class GraphingController < ApplicationController
  include GraphingHelper

  def new
  end
  
  def get
    
  end
  
  def bar
      # Grab the uploaded data for the current user
    @people= Person.where("user_id = ?", current_user.id)

    # Store the frequencies of each style in a hash
    frequencies = {
      :challenger => 0,
      :contributor => 0,
      :communicator => 0,
      :collaborator => 0
    }

    # Update frequencies 
    @people.each do |person|
      frequencies[primary_style(person) += 1
    end 
    
    render json: {status: 'SUCCESS', message: 'Loaded all posts', data: frequencies}, status: :ok
  end 
end
