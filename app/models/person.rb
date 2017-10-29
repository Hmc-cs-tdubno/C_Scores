class Person < ApplicationRecord
	serialize :extra, Hash
	require 'csv'

	def self.import(file)
		if(file.content_type=="text/csv")
			CSV.foreach(file.path, headers: true) do |row|
				curhash = row.to_hash
				#loop through questions & change them to chars
				i = 0
				until i > 18 do
					question = 'q' + 1.to_i
					curhash[question] = answertochar[curhash[question]]
					i += 1
				end
				#setting extra equal to empty hash for testing purposes
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

=begin
the answertochar hash has keys which are each 4 digit
permutations of the integers 1-4 (with all possible permutations)
represented) to a char, the value, to allow for easy storing in a database
=end
	 answertochar =
	 {'1234' => 'A',
	 '1243' => 'B',
	 '1324' => 'C',
	 '1342' => 'D',
	 '1423' => 'E',
	 '1432' => 'F',
	 '2134' => 'G',
	 '2143' => 'H',
	 '2314' => 'I',
	 '2341' => 'J',
	 '2413' => 'K',
	 '2431' => 'L',
	 '3124' => 'M',
	 '3142' => 'N',
	 '3214' => 'O',
	 '3241' => 'P',
	 '3412' => 'Q',
	 '3421' => 'R',
	 '4123' => 'S',
	 '4132' => 'T',
	 '4213' => 'U',
	 '4231' => 'V',
	 '4312' => 'W',
	 '4321' => 'X'}

=begin
The char to answer array exists as a way to decode the way
the answer to a question is stored, it has chars as key and
4 digit strings of all possible ordering fo the digits 1-4
=end
	chartoanswer =
	{'A' => '1234',
	'B' => '1243',
	'C' => '1324',
	'D' => '1342',
	'E' => '1423',
	'F' => '1432',
	'G' => '2134',
	'H' => '2143',
	'I' => '2314',
	'J' => '2341',
	'K' => '2413',
	'L' => '2431',
	'M' => '3124',
	'N' => '3142',
	'O' => '3214',
	'P' => '3241',
	'Q' => '3412',
	'R' => '3421',
	'S' => '4123',
	'T' => '4132',
	'U' => '4213',
	'V' => '4231',
	'W' => '4312',
	'X' => '4321'}

end
