class UsersController < ApplicationController

  before_action :set_user, only: [:dashboard]

  def dashboard
  end

  private

  def set_user
    @user = current_user
  end

end
