json.array!(@companies) do |company|
  json.extract! company, :id, :name, :siret, :plan_id, :ratio
  json.url company_url(company, format: :json)
end
