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
    response = Person.import(params[:file])
    if response[:status]==0
      redirect_to '/display', notice: response[:message]
    else
      bla = response[:message].gsub! ' \'', ' ('
      bla2 = bla.gsub! '\' ', ') '
      redirect_to '/', notice: bla
    end
  end

end
