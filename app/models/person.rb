class Person < ApplicationRecord
	serialize :answers, Array
	serialize :extra, Hash
	require 'csv'

	def self.import(file)
		if(file.content_type=="text/csv")
			CSV.foreach(file.path, headers: true) do |row|
				curhash = row.to_hash
				curhash["answers"] = curhash["answers"].tr('[]', '').split(',').map(&:to_i)
				curhash["extra"] = {}
				Person.create! curhash
			end
		elsif(file.content_type=="application/json")
			curfile = file.read
			hash = JSON.parse(curfile)
		
		
			Person.create! hash
		else
			puts "hey stop that"
		end
	end
end
