class AddQ16ToPeople < ActiveRecord::Migration[5.1]
  def change
    add_column :people, :q16, :string
  end
end
