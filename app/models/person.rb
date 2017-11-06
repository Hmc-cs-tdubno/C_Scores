class Person < ApplicationRecord
	belongs_to :user

	serialize :extra, Hash
	require 'csv'


	def self.import(file, current_user_id)
		message = ""
		curhash = {}
		
		# Read file and create a hash to add to db
		# if invalid filetype return error response
		response = {}
		#initial exception block incase the data was incorrectly formated. 
		begin	
			if(file.content_type=="text/csv")
				CSV.foreach(file.path, headers: true) do |row|
					curhash = row.to_hash
					
					styles = {
            		:challenger => person[:challenger],
            		:collaborator => person[:collaborator],
            		:communicator => person[:communicator],
            		:contributor => person[:contributor]
        			}
        			currhash["style"] = styles.max_by{|k,v| v}[0]

					#setting extra equal to empty hash for testing purposes
					curhash["extra"] = {}
					message	= "CSV uploaded"
					curhash["user_id"] = current_user_id
					Person.create! curhash
				end
			
			elsif(file.content_type=="application/json")
				curfile = file.read
				curhash = JSON.parse(curfile)
				message = "JSON uploaded"
				#go through each new user
				curhash.each do |i|
					i["user_id"] = current_user_id
					puts i
					Person.create! i
				end 
			
			else
				response = {:status => 4, :message => "Incorrect FileType"}
			end
		# Returns whether response saying whether database created new entry or failed to do so	
			response = {:status => 0, :message => message}
		rescue ActiveModel::UnknownAttributeError => e
			puts e
			response = {:status => 2, :message => e.to_s}
			return response
		end 
		#if it makes it past the exception return the response information. If that status isnt 0 it is an Error
		 return response 
	end


end
