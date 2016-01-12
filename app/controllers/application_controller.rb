class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  # Devise:
  before_action :authenticate_user!

  # Devise helpers: (-> for the RegistrationController)
  def after_sign_up_path_for(resource)
    new_company_path
  end

  def after_sign_in_path_for(resource)
    unless resource.company
      new_company_path
    else
      dashboard_path
    end
  end

end
