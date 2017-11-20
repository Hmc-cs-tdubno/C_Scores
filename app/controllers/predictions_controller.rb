class PredictionsController < ApplicationController
  require "rubypython"
  def index
  end

  def analyze
    members = []
    styles = ['Collaborator','Comunicator','Contributor','Challenger']
    (1..4).each do |k|
      bla=[]
      styles.each do |sty|
        bla+=[params[sty+k.to_s+':']]
      end 
      members+=[bla]
    end 
    #             |
    # system call V
    results = `python TeamScoreAnalysis.py #{members}`
    puts results
    puts "welcome"
    # puts x
    render json: {status: 'SUCCESS', message: 'Loaded all posts', data: results}, status: :ok
  end
end
