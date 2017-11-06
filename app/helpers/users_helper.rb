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

  def common_challenger_answer(people)
      # Takes in a Person object, returns
      # the primary style of the person
      bla = {}
      for i in 1..18
        answers = {}
        people.each do |person|
          if person.style = "challenger"
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
end
