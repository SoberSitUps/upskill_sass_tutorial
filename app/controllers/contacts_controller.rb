class ContactsController < ApplicationController
  
  # GET request to /contacts
  # Show contact form
  def new
    @contact = Contact.new
  end
  
  # POST request /contacts
  def create
    # Mass assignment of form fields into Contact object
    @contact = Contact.new(contact_params)
    # Store form fields via parameters, into variables
    if @contact.save
      name = params[:contact][:name]
      email = params[:contact][:email]
      body = params[:contact][:comments]
      # Plug variables into ContactMailer
      # email method and send email
      ContactMailer.contact_email(name, email, body).deliver
      # Store Success message in flash hash
      # redirect to new action
      flash[:success] = "Message sent."
      redirect_to new_contact_path
    else
      # If Contact object doesn't save, store errors in flash hash
      # redirect to new action
      flash[:danger] = @contact.errors.full_messages.join(", ")
      redirect_to new_contact_path
    end
  end
  
  private
    # to collect data from form, use strong params and whitelist form fields
    def contact_params
      params.require(:contact).permit(:name, :email, :comments)
    end
end