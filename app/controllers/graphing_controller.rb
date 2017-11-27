class GraphingController < ApplicationController
  include GraphingHelper

  def new
  end

  def scatter
    style1 = params[:style1]
    style2 = params[:style2]

    # Grab the uploaded data for the current user
    @people = []

    #TODO: MAKE THIS A FUNCTION
    # If the user wishes to filter dataset from graph run the following
    if !(params.keys.include? "include0")
      current_user.people.find_each do |person|
        @people.push person
      end
    else
      # Grab data from each dataset in :include and add it to people
      params.each do |key, dataset|
        puts key
        if key.include? "include"
          current_user.people.where({dataset_id: dataset}).find_each do |person|
            @people.push person
          end
        end
      end
    end

    #TODO make this better
    puts @people.length
    data = []
    @people.each do |person|
      puts "STYLE1"
      puts style1
      puts person[style1]
      puts "STYLE2"
      puts person[style2]
      data+=[
        {:style1 => person[style1],
        :style2 => person[style2]}
      ]
    end

    puts data
    render json: {status: 'SUCCESS', message: 'Loaded all posts', data: data}, status: :ok
  end

  def bar
    @people = []

    # If the user wishes to filter dataset from graph run the following
    if !(params.keys.include? "include0")
      current_user.people.find_each do |person|
        @people.push person
      end
    else
      # Grab data from each dataset in :include and add it to people
      params.each do |key, dataset|
        puts key
        if key.include? "include"
          current_user.people.where({dataset_id: dataset}).find_each do |person|
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
