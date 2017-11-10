module UsersHelper
  def common_answer(people)
      # Takes in a Person object, returns
      # the primary style of the person
      bla = {}
      for i in 1..18
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
      # Takes in a Person object, returns
      # the primary style of the person
      bla = {}
      for i in 1..18
        answers = {}
        people.each do |person|
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
      substyles.delete(style)
      people.each do |person|
        if person.style = style
          substyle = "collaborator"
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
