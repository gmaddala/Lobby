function Register()
{
    var hasError = false;
    if($('#txt_firstname').val().length == 0)
    {
        hasError = true;
        $('#firstname_error').text('Please enter First Name');
    }
    else
    {
        $('#firstname_error').text('');
    }
    
    if($('#txt_lastname').val().length == 0)
    {
        hasError = true;
        $('#lastname_error').text('Please enter Last Name');
    }
    else
    {
        $('#lastname_error').text('');
    }
    
    if($('#txt_email').val().length == 0)
    {
        hasError = true;
        $('#email_error').text('Please enter valid Email Address');
    }
    else
    {
        var re = /\S+@\S+\.\S+/
        if(!re.test($('#txt_email').val())){
            hasError = true;
            $('#email_error').text('Please enter valid Email Address');
        }
        else
        {
            $('#email_error').text('');
        }
    }
    
    var numbers = /^[0-9]+$/;
    if($('#txt_uid').val().length != 9 || !$('#txt_uid').val().match(numbers))
    {
        hasError = true;
        $('#uid_error').text('Please enter valid UID');
    }
    else
    {
        $('#uid_error').text('');
    }
    
    if($('#txt_phone').val().length != 10 || !$('#txt_phone').val().match(numbers))
    {
        hasError = true;
        $('#phone_error').text('Please enter valid Phone Number');
    }
    else
    {
        $('#uid_error').text('');
    }
    
    debugger;
    
    if(!hasError)
    {
        var submitIntake = false; //if no reasons list, immediately submit intake
        if(typeof localStorage.getItem("reasons").VisitReasonList == "undefined")
        {
            submitIntake = true;
        }
        
        localStorage.setItem("uid", $('#txt_uid').val());
        localStorage.setItem("firstname", $('#txt_firstname').val())
        localStorage.setItem("lastname", $('#txt_lastname').val());
        localStorage.setItem("phone", $('#txt_phone').val());
        localStorage.setItem("email", $('#txt_email').val());
        
        if(submitIntake)
        {
            var jsonobj = SetUpIntakeJSONObj();
            SubmitIntake(jsonobj);
        }
        else
        {
            window.open("reasons.html", "_self");
        }
    }
}