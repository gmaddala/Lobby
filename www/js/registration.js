var phoneNumber, phoneNumberFormatted;
function Register()
{
    var hasError = false;
    if($('#txt_firstname').val().length == 0)
    {
        hasError = true;        
		$('#txt_firstname').addClass('Error');
    }
    else
    {
		$('#txt_firstname').removeClass('Error');
    }
    
    if($('#txt_lastname').val().length == 0)
    {
        hasError = true;
        //$('#lastname_error').text('Please enter Last Name');
		$('#txt_lastname').addClass('Error');
    }
    else
    {
        //$('#lastname_error').text('');
		$('#txt_lastname').removeClass('Error');
    }
    
    if($('#txt_email').val().length > 0)
    {
		var re = /\S+@\S+\.\S+/
        if(!re.test($('#txt_email').val())){
            hasError = true;
            //$('#email_error').text('Please enter valid Email Address');
			$('#txt_email').addClass('Error');
        }
        else
        {
            //$('#email_error').text('');
			$('#txt_email').removeClass('Error');
        }
    }
	else
	{
		$('#txt_email').removeClass('Error');
	}
    
    var numbers = /^[0-9]+$/;
    if($('#txt_uid').val().length > 0)
	{
		if($('#txt_uid').val().length != 9 || !$('#txt_uid').val().match(numbers))
		{
			hasError = true;
			//$('#uid_error').text('Please enter valid UID');
			$('#txt_uid').addClass('Error');
		}
	}
    else
    {
        //$('#uid_error').text('');
		$('#txt_uid').removeClass('Error');
    }
    
	phoneNumberFormatted = $('#txt_phone').val();
	if(phoneNumberFormatted.length > 0)
	{
		phoneNumber = phoneNumberFormatted.replace("(", "").replace(")", "").replace("-","");
		//if($('#txt_phone').val().length != 10 || !$('#txt_phone').val().match(numbers))
		if(phoneNumber.length != 10 || !phoneNumber.match(numbers))
		{
			hasError = true;
			//$('#phone_error').text('Please enter valid Phone Number');
			$('#txt_phone').addClass('Error');
		}
	}
    else
    {
        //$('#uid_error').text('');
		$('#txt_phone').removeClass('Error');
    }
    
    
    if(!hasError)
    {
        var submitIntake = false; //if no reasons list, immediately submit intake
		if(typeof localStorage.getItem("questions") == "undefined")
        {
            submitIntake = true;
        }

        localStorage.setItem("cardswiped", false);
        localStorage.setItem("uid", $('#txt_uid').val());
        localStorage.setItem("firstname", $('#txt_firstname').val())
        localStorage.setItem("lastname", $('#txt_lastname').val());
        //localStorage.setItem("phone", $('#txt_phone').val());
		localStorage.setItem("phone", phoneNumber);
        localStorage.setItem("email", $('#txt_email').val());
        
        if(submitIntake)
        {
            var jsonobj = SetUpIntakeJSONObj();
            SubmitIntake1(jsonobj);
        }
        else
        {
            window.open("reasons.html", "_self");
        }
    }
}

function SubmitIntake1(myJsonObj)
{
    $.ajax({
           type: "POST",
           contentType: "application/json; charset=utf-8",
           url: "http://sait-test.uclanet.ucla.edu/sawebnew2/api/submitstudentinfo",
           dataType: "json",
           data: JSON.stringify(
                                myJsonObj
                                ),
           beforeSend: function(){
           loading();
           },
           success: function(data){
           //Reset CollectedResponses on successful submission
           localStorage.setItem("CollectedResponses", JSON.stringify(""));
           window.open("thankyou.html", "_self");
           },
           error: function (jqXHR, textStatus, errorThrown) {
           showNativeDialog("An error has occurred. Please try again." + jqXHR.responseText);
           //alert("The access key you entered is incorrect. Please click 'Retry' to reenter your access key.");
           //alert(jqXHR.responseText + ";\n\n" + textStatus + ";\n\n" + errorThrown);
           //showNativeDialog("Error while checking in. Please contact the administrator");
           },
           complete: function(){
           endLoading();
           }
           
           });
}