class Company < ActiveRecord::Base
  belongs_to :plan
  has_many :users

end
