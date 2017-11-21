class AddDatasetIDtoPeople < ActiveRecord::Migration[5.1]
  def change
    add_column :people, :dataset_id, :string
  end
end
