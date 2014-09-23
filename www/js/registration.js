var phoneNumber, phoneNumberFormatted;
function InitRegisterControls(){
    //9 digit UID
    $('#txt_uid').mask("999999999");
    //Phone number format : (999)999-9999 where all the digits are required
    $('#txt_phone').mask('(999)999-9999');
}

function SetDefaultRegisterFocus(){//set default focus on first name control
    $('#txt_firstname').focus();
}

function NavigateBack(){
    //navigate back to login.html; sliding animation will not take effect since the navigation is to a different html
//    loading();
//    $("body").data().kendoMobilePane.navigate("#:back", "slide:left");
    console.log('navigating back to registration page');
    app1.navigate("#divRegistrationView");
}

function Register()
{
    var hasError = false;
    if($('#txt_firstname').val().length == 0)
    {
        hasError = true;        
		$('#txt_firstname').addClass('Error');
        $('#txt_firstname').next().removeClass('DisplayNone');
    }
    else
    {
		$('#txt_firstname').removeClass('Error');
        $('#txt_firstname').next().addClass('DisplayNone');
    }
    
    if($('#txt_lastname').val().length == 0)
    {
        hasError = true;
        //$('#lastname_error').text('Please enter Last Name');
		$('#txt_lastname').addClass('Error');
        $('#txt_lastname').next().removeClass('DisplayNone');
    }
    else
    {
        //$('#lastname_error').text('');
		$('#txt_lastname').removeClass('Error');
        $('#txt_lastname').next().addClass('DisplayNone');
    }
    
    if($('#txt_email').val().length > 0)
    {
		var re = /\S+@\S+\.\S+/
        if(!re.test($('#txt_email').val())){
            hasError = true;
            //$('#email_error').text('Please enter valid Email Address');
			$('#txt_email').addClass('Error');
            $('#txt_email').next().removeClass('DisplayNone');
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
            SubmitIntake(jsonobj);
        }
        else
        {
//            window.open("reasons.html", "_self");
            app1.navigate("#questions-body");
        }
    }
}

function DisplayLogin(){
    console.log('navigating to login page..');
    app.startCardReader();
    app1.navigate("#");//, "slide:left");
}