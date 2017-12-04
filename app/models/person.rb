class Person < ApplicationRecord
	belongs_to :user

	serialize :extra, Hash
	require 'csv'


	def self.import(file, dataset_id, current_user_id)
		puts file.class
		message = ""
		curhash = {}

		# Read file and create a hash to add to db
		# if invalid filetype return error response
		response = {:status => 2, :message =>"something went wrong"}
		#initial exception block incase the data was incorrectly formated.
		begin
			csv_types = ["text/csv", "application/vnd.ms-excel"]
			json_types = ["application/json", "application/octet-stream"]

# standard upload control
			if(csv_types.include? file.content_type)
				CSV.foreach(file.path, headers: true) do |row|
					# Other teams upload controler
					curhash = {}
					#check if the other formatted selection is made so that we can convert it to our way of stroage.
					if row.header?("q1a")
						working_hash = row.to_hash
						curhash["style"] = working_hash['quiz_category'].downcase.to_sym
						curhash["challenger"] = working_hash["challenger"]
						curhash["collaborator"] = working_hash["collaborator"]
						curhash["communicator"] = working_hash["communicator"]
						curhash["contributor"] = working_hash["contributor"]
						# go through each of the questions and store it as a string which is how we have been keeping it. 
						for question in 1..18
							compact_string=""
							for answer in ['a','b','c','d']
								 compact_string+=working_hash['q'+question.to_s+answer].to_s
							 end
							curhash['q'+question.to_s]=compact_string
						end
						
						
						
					else
						curhash = row.to_hash

						#Calculating the team player style of a person
						styles = {
	            		:challenger => curhash["challenger"].to_i,
	            		:collaborator => curhash["collaborator"].to_i,
	            		:communicator => curhash["communicator"].to_i,
	            		:contributor => curhash["contributor"].to_i
	        			}
	        			curhash["style"] = styles.max_by{|k,v| v}[0]
					end 
						#setting extra equal to empty hash for testing purposes
						curhash["extra"] = {}
						message	= "CSV uploaded"
						curhash["user_id"] = current_user_id
						curhash[:dataset_id] = dataset_id
						#puts "style: "+curhash["style"]
						Person.create! curhash
				end

			elsif(json_types.include? file.content_type)
				curfile = file.read
				curhash = JSON.parse(curfile)
				message = "JSON uploaded"
				#go through each new user
				curhash.each do |i|
					i["user_id"] = current_user_id
					#Calculating the team player style of a person
					styles = {
            		:challenger => i["challenger"],
            		:collaborator => i["collaborator"],
            		:communicator => i["communicator"],
            		:contributor => i["contributor"]
        			}
        			i[:style] = styles.max_by{|k,v| v}[0]
							i[:dataset_id] = dataset_id
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
