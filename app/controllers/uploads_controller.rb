class UploadsController < ApplicationController
  before_action :authenticate_user!
  
  def index
    @people = Person.where("user_id = ?", current_user.id)
  end

  def new
  end

  def create
  end

  def display
    @people = Person.where("user_id = ?", current_user.id)
  end

  def import
    Person.import(params[:file], current_user.id)
    redirect_to '/display', notice: "uploaded"
  end

end
