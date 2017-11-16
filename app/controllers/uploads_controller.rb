class UploadsController < ApplicationController
  before_action :authenticate_user!
  include UsersHelper
  
  def index
    @people = Person.where("user_id = ?", current_user.id)
  end

  def new
  end
  
  def remove
    Person.where("user_id = ?", current_user.id).destroy_all
    redirect_to("/")
  end
  
  def create
  end

  def display
    @people = Person.where("user_id = ?", current_user.id)
    
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
  end

  def import
    #Try to upload data to DB, catch response
    if params[:file]
      response = Person.import(params[:file],current_user.id)

      # Let the user know if there was an error uploading
      # otherwise redirect to display page
      if response[:status]==0
        puts response
        redirect_to '/display', notice: response[:message]
      else
        redirect_to '/', notice: response
      end
    else 
      redirect_to '/', notice: {message: "please upload a CSV or JSON"}
    end 
  end

end
