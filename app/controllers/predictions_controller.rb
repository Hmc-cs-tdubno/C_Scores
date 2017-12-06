class PredictionsController < ApplicationController

  def index
  end

  # Runs prediction script and responds with result
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
    # puts x
    results= results[0..3]
    render json: {status: 'SUCCESS', message: 'Loaded all posts', data: results.to_f}, status: :ok
  end
end
