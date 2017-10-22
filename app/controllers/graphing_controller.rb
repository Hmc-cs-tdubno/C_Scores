class GraphingController < ApplicationController
  def new
    puts params[:id]
    @people= Person.all
    i = 0
    x=Hash.new
    @people.each do |person|
      x[i]=person 
    end 
    render json: {status: 'SUCCESS', message: 'Loaded all posts', data: x}, status: :ok
  end
  
  def get
    
  end
  
  def bar
  end 
end
