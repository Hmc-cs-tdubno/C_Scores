class Person < ApplicationRecord
	belongs_to :user

	serialize :extra, Hash
	require 'csv'


	def self.import(file, current_user_id)
		message = ""
		curhash = {}
		
		# Read file and create a hash to add to db
		# if invalid filetype return error response
		response = {:status => 2, :message =>"something went wrong"}
		#initial exception block incase the data was incorrectly formated. 
		begin	
			if(file.content_type=="text/csv")
				CSV.foreach(file.path, headers: true) do |row|
					curhash = row.to_hash
					styles = {
            		:challenger => curhash["challenger"],
            		:collaborator => curhash["collaborator"],
            		:communicator => curhash["communicator"],
            		:contributor => curhash["contributor"]
        			}
        			curhash["style"] = styles.max_by{|k,v| v}[0]
							put curhash["style"]
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
					styles = {
            		:challenger => i["challenger"],
            		:collaborator => i["collaborator"],
            		:communicator => i["communicator"],
            		:contributor => i["contributor"]
        			}
        			i[:style] = styles.max_by{|k,v| v}[0]
					puts i
					Person.create! i
				end 
			
			else
				return response = {:status => 4, :message => "Incorrect FileType"}
			end
		# Returns whether response saying whether database created new entry or failed to do so	
			response = {:status => 0, :message => message}
		rescue ActiveModel::UnknownAttributeError => e
			puts e
			bla = e.to_s.gsub!( ' \'', ' (')
			bla2 = bla.gsub!('\' ', ') ')
			response = {:status => 2, :message => bla2}
			return response
		end 
		#if it makes it past the exception return the response information. If that status isnt 0 it is an Error
		 return response 
	end


end
