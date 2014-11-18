var phoneNumber, phoneNumberFormatted, canClearMaskedPhone = false, canClearMaskedUID = false;
function InitRegisterControls(){
    //9 digit UID
    //$('#txt_uid').mask("?999999999");
    //Phone number format : (999)999-9999 where all the digits are required
    $('#txt_phone').mask('?(999)999-9999');
    
    $('#txt_uid').bind('keypress', FormatUid);
    //$('#txt_phone').bind('keydown', FormatPhone);
}

function FormatUid(e){
    var code = e.keyCode || e.which;
    console.log(code);
    if(code < 48 || code > 57){
        e.preventDefault();
    }
}

function FormatPhone(e){
    var code = e.keyCode || e.which;
    var isBackSpace = false;
    console.log(code);
    isBackSpace = code == 8;
    if(code != 8 && (code < 48 || code > 57)){
        e.preventDefault();
    }
    else {
        var digit = String.fromCharCode(code);
        //alert(code + ' ' + digit);
        if(!isNaN(digit))
        {
        
        var phone = $("#txt_phone").val();
        phone = phone.replace("(", "");
        phone = phone.replace(")", "");
        phone = phone.replace("-", "");
        var formattedPhone = "(";
        
        for (var index = 0; index < phone.length; index++){
            if(index == 0){
                formattedPhone = "(" + phone[index];
            }
            else{
                formattedPhone = formattedPhone + phone[index];
                if(index == 2){
                    formattedPhone = formattedPhone + ")";
                }
                if(index == 5){
                    formattedPhone = formattedPhone + "-";
                }
            }
        }//for
        $('#txt_phone').val(formattedPhone);
        }
       
        
    }
}

function SetDefaultRegisterFocus(){//set default focus on first name control
    //$('#txt_firstname').focus();
    //Reset all the input fields
    $("#txt_firstname").val("");
    $("#txt_lastname").val("");
    $("#txt_email").val("");
    $("#txt_phone").val("");
    $("#txt_uid").val("");
    
//    $('#txt_phone').bind("focus", function() {
//         if(canClearMaskedPhone){
//            ClearField(this);
//            $('#txt_phone').mask('?(999)999-9999');
//            canClearMaskedPhone = false;
//         }
//     });
//    
//    $('#txt_uid').bind("focus", function() {
//         if(canClearMaskedUID){
//             ClearField(this);
//            $('#txt_uid').mask("?999999999");
//             canClearMaskedUID = false;
//         }
//    });
}

function ClearField(ctl)
{
    $(ctl).val("");
}

function NavigateBack(){
    //navigate back to login.html; sliding animation will not take effect since the navigation is to a different html
//    loading();
//    $("body").data().kendoMobilePane.navigate("#:back", "slide:left");
//    console.log('navigating back to registration page');
    app1.navigate("#divRegistrationView");
}

function SubmitRegistrationForm(){
    //when soft keypad is open on the device, focus is arbitrarily set on a input control when 'Register' button is hit
    //To avoid arbitrary focus, trigger blur event of all the input controls after a delay of 400ms
    Register();
//    setTimeout(function(){ console.log('calling Regiser');
//                   $('#divRegistration input').blur();
                    //Register();
//               }, 400);
}

function Register()
{
    var hasError = false;
    if($('#txt_firstname').val().length == 0)
    {
        hasError = true;        
		$('#txt_firstname').addClass('Error');
        //$('#txt_firstname').next().removeClass('DisplayNone');
    }
    else
    {
		$('#txt_firstname').removeClass('Error');
        //$('#txt_firstname').next().addClass('DisplayNone');
    }
    
    if($('#txt_lastname').val().length == 0)
    {
        hasError = true;
        //$('#lastname_error').text('Please enter Last Name');
		$('#txt_lastname').addClass('Error');
        //$('#txt_lastname').next().removeClass('DisplayNone');
    }
    else
    {
        //$('#lastname_error').text('');
		$('#txt_lastname').removeClass('Error');
//        $('#txt_lastname').next().addClass('DisplayNone');
    }
    
    if($('#txt_email').val().length > 0)
    {
		var re = /\S+@\S+\.\S+/
        if(!re.test($('#txt_email').val())){
            hasError = true;
            //$('#email_error').text('Please enter valid Email Address');
			$('#txt_email').addClass('Error');
//            $('#txt_email').next().removeClass('DisplayNone');
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
    
//    var numbers = /^[0-9]+$/;
//    if($('#txt_uid').val().length > 0)
//	{
//		if($('#txt_uid').val().length != 9 || !$('#txt_uid').val().match(numbers))
//		{
//			hasError = true;
//			//$('#uid_error').text('Please enter valid UID');
//			$('#txt_uid').addClass('Error');
//		}
//	}
//    else
//    {
//        //$('#uid_error').text('');
//		$('#txt_uid').removeClass('Error');
//    }
    
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
        else{
            $('#txt_phone').removeClass('Error');
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
		if(typeof localStorage.getItem("questions") == "undefined" || localStorage.getItem("questions") == "null")
        {
            submitIntake = true;
        }

        localStorage.setItem("cardswiped", false);
        //localStorage.setItem("uid", $('#txt_uid').val());
        localStorage.setItem("uid", "");
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
//    console.log('navigating to login page..');
    ResetUserResponses();
    app.startCardReader();
    if(localStorage.getItem("anon") == "true")
    {
        app1.navigate("#anon", "slide:left");
    }
    else
    {
        app1.navigate("#");//, "slide:left");
    }
}

function SwitchSplitView(){
//    console.log('switch view..');
    var data = e.button.data();
    var view = data.param;
//    console.log('param..' + param);
    switch(view){
        case "Swipe":
            $('#divDetailPane').data("kendoMobilePane");
            pane.navigate("#divCheckInView");
            break;
        case "Search":
            $('#divDetailPane').data("kendoMobilePane");
            pane.navigate("#divSearchView");
            //focus not set on Safari browser on iOS
            $('#txt_rsvp_eleg_uid').focus();
            break;
    }
}

function DisplayRSVPSearchResults(canShow)
{
    if(!canShow){
        $('#divRSVPSearchResults').addClass('DisplayNone');
    }
    else{
        $('#divRSVPSearchResults').removeClass('DisplayNone');
    }
}

function ResetRSVPInput(){
//    console.log('resetting..');
    $('#txt_rsvp_eleg_uid').val("");
    //hide RSVP search results
    DisplayRSVPSearchResults(false);
}

function NavigateToLoginPage(){
    StartCardReader();
    app1.navigate("#", "slide:reverse");
}