module GraphingHelper
   
    def primary_style(person)
        # Takes in a Person object, returns
        # the primary style of the person

        # grab the style scores from the person
        styles = {
            :challenger => person[:challenger],
            :contributor => person[:contributor],
            :communicator => person[:communicator],
            :contributor => person[:contributor]
        }
        return styles.max_by{|k,v| v}[0]
    end

end
