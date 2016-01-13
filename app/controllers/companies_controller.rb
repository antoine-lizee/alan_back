class CompaniesController < ApplicationController
  before_action :set_company, only: [:show, :edit, :update, :destroy, :batch_emails, :send_batch_emails]

  # GET /companies
  def index
    @companies = Company.all
  end

  # GET /companies/1
  def show
  end

  # GET /companies/new
  def new
    @company = Company.new
  end

  # GET /companies/1/edit
  def edit
  end

  # POST /companies
  # POST /companies.json
  def create
    @company = Company.new(company_params)

    respond_to do |format|
      if @company.save
        current_user.company = @company
        current_user.company_admin = true
        if current_user.save
          format.html { redirect_to batch_emails_company_path(@company), notice: 'Company information was successfully saved.' }
          format.json { head :service_unavailable }
        else
          head :internal_server_error
        end
      else
        format.html { render :new }
        format.json { head :service_unavailable }
      end
    end
  end

  # PATCH/PUT /companies/1
  # PATCH/PUT /companies/1.json
  def update
    respond_to do |format|
      if @company.update(company_params)
        format.html { redirect_to @company, notice: 'Company was successfully updated.' }
        format.json { head :service_unavailable }
      else
        format.html { render :edit }
        format.json { head :service_unavailable }
      end
    end
  end

  # DELETE /companies/1
  # DELETE /companies/1.json
  def destroy
    @company.destroy
    respond_to do |format|
      format.html { redirect_to companies_url, notice: 'Company was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def batch_emails
  end

  def send_batch_emails
    users = batch_emails_params.reject {|u| u['email'].blank?}.map do |u|
      User.create(email: u['email'],
        # password: (0...12).map { (65 + rand(26)).chr }.join,
        password: 'qwerpoiuqwerpoiu',
        company: @company
      )
    end
    redirect_to company_path(@company)
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_company
      @company = Company.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def company_params
      params.require(:company).permit(:name, :siret, :plan_id, :ratio)
    end

    def batch_emails_params
      params.require(:users)
    end
end
