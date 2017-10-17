class Person < ApplicationRecord
	serialize :answers, Array
	serialize :extra, Hash
end
