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
    Person.import(params[:file])
    redirect_to '/display', notice: "uploaded"
  end

end
