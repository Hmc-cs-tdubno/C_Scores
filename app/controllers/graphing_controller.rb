class GraphingController < ApplicationController
  include GraphingHelper

  def scatter
    style1 = params[:style1]
    style2 = params[:style2]

    # Grab the uploaded data for the current user
    @people = get_data_by_params(current_user, params)

    data = []

    # Create data points for scatter plot
    # Note that style1 is the x and style 2 is the y
    @people.each do |person|
      data+=[
        {:style1 => person[style1],
        :style2 => person[style2],
        :dataset => person[:dataset_id]}
      ]
    end

    render json: {status: 'SUCCESS', message: 'Loaded all posts', data: data}, status: :ok
  end


  def bar
    # Grab the uploaded data for the current user
    @people = get_data_by_params(current_user, params)

    frequencies = {
      :challenger => 0,
      :contributor => 0,
      :communicator => 0,
      :collaborator => 0
    }

    # Update frequencies
    @people.each do |person|
      puts "hello: "+ person["style"]
      frequencies[person["style"].to_sym] += 1
    end
    data = []
    frequencies.each do |k,v|
      data+= [{:style => k, :freq => v}]
    end

    render json: {status: 'SUCCESS', message: 'Loaded all posts', data: data}, status: :ok
  end

end
