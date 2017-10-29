class Person < ApplicationRecord
	serialize :extra, Hash
	require 'csv'

	def self.import(file)
		if(file.content_type=="text/csv")
			CSV.foreach(file.path, headers: true) do |row|
				curhash = row.to_hash
				curhash["extra"] = {}
				begin
					Person.create! curhash
					response = {:status => 0, :message => "CSV uploaded"}
					return response
				rescue ActiveModel::UnknownAttributeError => e
					puts e
					response = {:status => 2, :message => e.to_s}
					return response
				end 
			end
		elsif(file.content_type=="application/json")
			curfile = file.read
			hash = JSON.parse(curfile)
			begin
				Person.create! hash
				response = {:status => 0, :message => "JSON uploaded"}
				return response
			rescue ActiveModel::UnknownAttributeError => e
				puts e.to_s.html_safe
				response = {:status => 2, :message => e.to_s}
				return response
			end 
		else
			response = {:status => 4, :message => "Incorrect FileType"}
			return response
		end
	end
end
