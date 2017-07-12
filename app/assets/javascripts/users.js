/* global $, Stripe */
//Document ready.
$(document).on('turbolinks:load', function(){
  var theForm = $('#pro_form');
  var submitBtn = $('#form-signup-btn');
  //Set Stripe public key.
  Stripe.setPublishableKey( $('meta[name="stripe-key"]').attr('content') );
  //When user clicks form submit btn,
  submitBtn.click(function(event){
    //prevent default submission behavior.
    event.preventDefault();
    submitBtn.val("Processing").prop('disabled' , true);
    
    //Collect the credit card fields.
    var ccNum = $('#card_number').val(),
        cvcNum = $('#card_code').val(),
        expMonth = $('#card_month').val(),
        expYear = $('#card_year').val();
        
    //use stripe js library to check for card errors
    var error = false;
    
    //validate card number
    if (!Stripe.card.validateCardNumber(ccNum)) {
      error = true;
      alert('Credit card number is invalid');
      
    }
    
    if (!Stripe.card.validateCVC(cvcNum)) {
      error = true;
      alert('CVC number is invalid');
    }
    
    if (!Stripe.card.validateExpiry(expMonth,expYear)) {
      error = true;
      alert('Expiration date is invalid');
      
    }
    
    if (error) {
      submitBtn.prop('disabled', false).val("Sign up");
      
    } else {
        
      //Send the card info to Stripe.
      Stripe.createToken({
        number: ccNum,
        cvc: cvcNum,
        exp_month: expMonth,
        exp_year: expYear
      }, stripeResponseHandler);
    }
      
     return false;
  });
  
  //Stripe will return a card token.
  function stripeResponseHandler(status, response){
    //get token from response
    var token = response.id;
    
    //inject card token in hidden field
    theForm.append( $('<input type="hidden" name="user[stripe_card_token]">').val(token) );
    
    //submit to rails app
    theForm.get(0).submit();
  }
  
  
  //Inject card token as hidden field into form.
  //Submit form to our Rails app.
});