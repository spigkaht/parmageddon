class ContactsController < ApplicationController
  def create
    @contact = Contact.new(contact_params)
    if @contact.save
      redirect_to root_path, notice: "Message sent successfully"
    else
      render "pages/contact", status: :unprocessable_entity
    end
  end

  private

  def contact_params
    params.require(:contact).permit(:email, :subject, :message)
  end
end
