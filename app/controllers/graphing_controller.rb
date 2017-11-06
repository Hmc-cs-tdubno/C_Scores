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
      # Grab the uploaded data for the current user
    @people= Person.where("user_id = ?", current_user.id)
    frequencies = {
      :challenger => 0,
      :contributor => 0,
      :communicator => 0,
      :collaborator => 0
    }

    # Update frequencies 
    @people.each do |person|
      puts "reaches graphing"
      frequencies[person["style"].parameterize.underscore.to_sym] += 1
    end 
    data = []
    frequencies.each do |k,v|
      data+= [{:style => k, :freq => v}]
    end
      
    render json: {status: 'SUCCESS', message: 'Loaded all posts', data: data}, status: :ok
  end 

end
