module UsersHelper
  #Each of these functions is called in uploads_controller, and the outputted stats are made displayed in uploads/displays

  def common_answer(people)
      # Takes in people data objects, returns
      # the most commonly answered question
      bla = {}
      # for each question, count number of each response
      for i in 1..18
        #response, frequency pair for each response to a question
        answers = {}
        people.each do |person|
          if answers[person["q#{i}"]]
            answers[person["q#{i}"]]+= 1
          else
            answers[person["q#{i}"]]=1
          end       # grab the style scores from the person
        end
        bla["q#{i}"] = answers.max_by{|k,v| v}
      end
      return bla.max_by{|k,v| v}
  end

  def common_style_answer(people, style)
      # Takes in a people data objects, and a style, returns
      # the most common answer among people of that style
      bla = {}
      for i in 1..18
        answers = {}
        people.each do |person|
          #filter out people with other styles
          if person.style = style
            if answers[person["q#{i}"]]
              answers[person["q#{i}"]]+= 1
            else
              answers[person["q#{i}"]]=1
            end       # grab the style scores from the person
          end
        end
        bla["q#{i}"] = answers.max_by{|k,v| v}
      end
      return bla.max_by{|k,v| v}
  end

  def common_substyle(people, style)
      # returns the most common substyle for a given style -
      # the style with the second highest score for eveyone of a given style
      substyles = {}
      substyles["collaborator"]=0
      substyles["communicator"]=0
      substyles["contributor"]=0
      substyles["challenger"]=0
      #only look at non-main styles
      substyles.delete(style)
      people.each do |person|
        if person.style = style
          substyle = substyles.keys[0]
          substyles.each do |key, num|
            if person[key] > person[substyle]
              substyle = key
            end
            puts "i am a substyle"
            puts substyles
            puts substyle
            puts substyles[substyle]= substyles[substyle] + 1
          # substyles[substyle] += 1
          end

        end
      end
      return substyles.max_by{|k,v| v}
  end
end
