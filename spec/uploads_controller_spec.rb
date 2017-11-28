require "rails_helper"


describe "upload page", :type => :feature do
  it "uploads a file and returns the correct response", js: true do
    user = FactoryBot.create(:user)
    user.save

    visit(root_path)
    puts all('#poopy').length
    #attach_file("file", "test/try.json")
    #click_button("poopy")
  end
end
