class UploadsController < ApplicationController
  before_action :authenticate_user!
  include UsersHelper
  include GraphingHelper

  def index
    @people = current_user.people
  end

  def new
  end

  def delete_individuals
    puts "WHY DOESN'T IT WORK"
    begin
      params.each do |key, dataset|
        message = "Successfully deleted datasets"
        if key.include? "include"
          puts current_user.people.where({dataset_id: dataset})
          current_user.people.where({dataset_id: dataset}).delete_all
        end
      end
    rescue
      message = "Unable to delete datasets"
    end

    render json: {status: 'SUCCESS', message: 'Loaded all posts', message: message}, status: :ok
  end

  def remove
    current_user.people.destroy_all
    redirect_to("/")
  end

  def create
  end

  def display
    @people = current_user.people

    #Makes calls to users_helper to get statistics and make them available in uploads/display
    @most_com = common_answer(@people)
    @most_com_challenger = common_style_answer(@people, "challenger")
    @most_com_contributor = common_style_answer(@people, "contributor")
    @most_com_collaborator = common_style_answer(@people, "collaborator")
    @most_com_communicator = common_style_answer(@people, "communicator")
    @substyle_challenger = common_substyle(@people, "challenger")
    @substyle_contributor = common_substyle(@people, "contributor")
    @substyle_collaborator = common_substyle(@people, "collaborator")
    @substyle_communicator = common_substyle(@people, "communicator")

    @dataset_ids = current_user.people.distinct.pluck(:dataset_id)
  end

  def import
    #Try to upload data to DB, catch response
    possible_dataset = current_user.people.where("dataset_id = ?", params[:dataset_id])
    if params[:file] && possible_dataset.empty?
      response = Person.import(params[:file], params[:dataset_id], current_user.id)

      # Let the user know if there was an error uploading
      # otherwise redirect to display page
      if response[:status]==0
        puts response
        redirect_to '/display', notice: response[:message]
      else
        redirect_to '/', notice: response
      end
    elsif !possible_dataset.empty?
      redirect_to '/', notice: {message: "You already have a data set with that name"}
    else
      redirect_to '/', notice: {message: "please upload a CSV or JSON"}
    end
  end

# Checks data for
  def check_dataset_id
    if params[:dataset_id] != ''
      puts params[:dataset_id]
      possible_dataset = current_user.people.where("dataset_id = ?", params[:dataset_id])

      if possible_dataset.empty?
        render json: {status: 'SUCCESS', message: 'Ok name'}, status: :ok
      else
        render json: {status: 'FAILURE', message: 'Duplicate name'}, status: :ok
      end
    else
        render json: {status: 'FAILURE', message: 'No parameters passed'}, status: :ok
    end

  end

end
