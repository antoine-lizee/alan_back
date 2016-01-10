class CreateCompanies < ActiveRecord::Migration
  def change
    create_table :companies do |t|
      t.string :name
      t.string :siret
      t.references :plan, index: true, foreign_key: true
      t.float :ratio

      t.timestamps null: false
    end
  end
end
