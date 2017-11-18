class PredictionsController < ApplicationController
  require "rubypython"
  def index
  end

  def analyze
    y = "butts"
    RubyPython.start
    sys = RubyPython.import("sys")
    sys.path.append('.')
    sys.path.append("./nltk")
    print sys.path
    print y
  	anal = RubyPython.import("TeamScoreAnalysis")
    # x = anal.test().rubify
    RubyPython.stop
    puts "hello"
    # puts x
  end
end
