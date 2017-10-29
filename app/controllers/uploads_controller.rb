class UploadsController < ApplicationController
  before_action :authenticate_user!
  
  def index
    @people = Person.all
  end

  def new
  end

  def create
  end

  def display
    @people = Person.all
  end

  def import
    Person.import(params[:file], current_user)
    redirect_to '/display', notice: "uploaded"
  end

end
