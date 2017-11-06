class AddStyleToPeople < ActiveRecord::Migration[5.1]
  def change
    add_column :people, :style, :string
  end
end
