module GraphingHelper
  def separate_data_sets
    dataset_ids = Person.uniq.pluck(:created_at)
    dataset_hash = {}
    dataset_ids.each do |dataset, index|
      key = "dataset"+index.to_s
      dataset_hash[key] = Person.where("user_id = ?", current_user.id).where("created_at = ?", dataset)
    end
    return dataset_hash
  end
end
