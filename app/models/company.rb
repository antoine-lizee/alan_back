class Company < ActiveRecord::Base
  belongs_to :plan
  has_many :users

  validates_presence_of :name, :siret, :plan, :ratio

end
