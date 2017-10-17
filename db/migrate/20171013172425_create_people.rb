class CreatePeople < ActiveRecord::Migration[5.1]
  def change
    create_table :people do |t|
      t.integer :challenger
      t.integer :collaborator
      t.integer :communicator
      t.integer :contributor
      t.text :answers
      t.text :extra

      t.timestamps
    end
  end
end
