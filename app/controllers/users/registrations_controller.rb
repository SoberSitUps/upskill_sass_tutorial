class Users::RegistrationsController < Devise::RegistrationsController
  before_action :select_plan, only: :new
  #Extend default Devise gem behavior. Pro users (plan id-2) are saved with 
  #Stripe subscription function
  #Otherwise use normal Devise signup
  def create
    super do |resource|
      if params[:plan]
        resource.plan_id = params[:plan]
        if resource.plan_id == 2
          resource.save_with_subscription
        else
          resource.save
        end
      end
    end
  end
  
  private
    def select_plan
      unless (params[:plan] == '1' || params[:plan] == '2')
      flash[:notice] = "Select plan tyle to sign up"
        redirect_to root_url
      end
    end
  
end