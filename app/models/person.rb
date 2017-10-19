class Person < ApplicationRecord
	serialize :answers, Array
	serialize :extra, Hash
	require 'csv'

	def self.import(file)
		CSV.foreach(file.path, headers: true) do |row|
			curhash = row.to_hash
			curhash["answers"] = curhash["answers"].tr('[]', '').split(',').map(&:to_i)
			curhash["extra"] = {}
			Person.create! curhash
		end
	end
end
