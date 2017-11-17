require 'test_helper'

class UserTest < ActiveSupport::TestCase
  def setup
    @user = users(:stupid)
  end

  def test_import_correct_file_json
    json = File.new('test/try.json', "r")
    json.class_eval {def content_type; return 'application/json'; end}
    response = Person.import(json, @user.id)
    assert_equal(0, response[:status], "Correct file format threw error on import")

    

    data = Person.where("user_id= ?", @user.id)
    assert_equal(3, data.length, "Correct number of people uploaded")
  end

  def test_import_correct_file_csv
    csv = File.new('test/memes.csv', "r")
    csv.class_eval {def content_type; return 'text/csv'; end}
    response = Person.import(csv, @user.id)
    assert_equal(0, response[:status], "Correct file format threw error on import")

    data = Person.where("user_id= ?", @user.id)
    assert_equal(3, data.length, "Correct number of people uploaded")
  end
end
