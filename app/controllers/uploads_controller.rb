class UploadsController < ApplicationController
  before_action :authenticate_user!
  include UsersHelper
  
  def index
    @people = Person.where("user_id = ?", current_user.id)
  end

  def new
  end

  def create
  end

  def display
    @people = Person.where("user_id = ?", current_user.id)
    
    puts "hi"
    @most_com = comon_answer(@people)
  end

  def import
    #Try to upload data to DB, catch response
    response = Person.import(params[:file],current_user.id)

    # Let the user know if there was an error uploading
    # otherwise redirect to display page
    if response[:status]==0
      redirect_to '/display', notice: response[:message]
    else
      bla = response[:message].gsub! ' \'', ' ('
      bla2 = bla.gsub! '\' ', ') '
      redirect_to '/', notice: bla
    end
  end

end
