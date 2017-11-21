class GraphingController < ApplicationController
  include GraphingHelper

  def new
  end

  def scatter
    style1 = params[:style1]
    style2 = params[:style2]

    # Grab the uploaded data for the current user
    @people= Person.where("user_id = ?", current_user.id)
    #TODO make this better
    data = []
    @people.each do |person|
      data+=[
        {:style1 => person[style1],
        :style2 => person[style2]}
      ]
    end
    render json: {status: 'SUCCESS', message: 'Loaded all posts', data: data}, status: :ok
  end

  def bar
    @people = []

    # If the user wishes to filter dataset from graph run the following
    if !(params.keys.include? "include0")
      puts "NO params"
      Person.where("user_id = ?", current_user.id).find_each do |person|
        @people.push person
      end
    else
      # Grab data from each dataset in :include and add it to people
      puts "YES PARAMS"
      params.each do |key, dataset|
        puts key
        if key.include? "include"
          Person.where({user_id: current_user.id, dataset_id: dataset}).find_each do |person|
            @people.push person
          end
        end
      end
    end

    puts @people.length


    frequencies = {
      :challenger => 0,
      :contributor => 0,
      :communicator => 0,
      :collaborator => 0
    }


    # Update frequencies
    @people.each do |person|
      frequencies[person["style"].to_sym] += 1
    end
    data = []
    frequencies.each do |k,v|
      data+= [{:style => k, :freq => v}]
    end

    render json: {status: 'SUCCESS', message: 'Loaded all posts', data: data}, status: :ok
  end

end
