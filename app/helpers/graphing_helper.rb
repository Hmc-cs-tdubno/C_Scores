module GraphingHelper

=begin
 Call this function if you want to select data
 from certain data sets specified in a request's
 url parameters
=end
  def get_data_by_params(current_user, params)
    result = []

    #If no datasets are specified just find all data associated with the user
    if !(params.keys.include? "include0")
      current_user.people.find_each do |person|
        result.push person
      end
    else
      # Grab data from each dataset in :include and add it to people
      params.each do |key, dataset|
        if key.include? "include"
          current_user.people.where({dataset_id: dataset}).find_each do |person|
            result.push person
          end
        end
      end
    end
    return result
  end
end
