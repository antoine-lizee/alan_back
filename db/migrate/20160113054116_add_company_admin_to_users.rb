class AddCompanyAdminToUsers < ActiveRecord::Migration
  def change
    add_column :users, :company_admin, :boolean, index: true, null: false, default: false
  end
end
