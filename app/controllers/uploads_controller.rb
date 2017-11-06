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
    
    puts "hi"
    @most_com = common_answer(@people)
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
        redirect_to '/', notice: response[:message]
      end
    else 
      redirect_to '/', notice: "please upload a CSV or JSON"
    end 
  end

end
