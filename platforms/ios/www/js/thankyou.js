function InitializeThankYou(){
    clearStudentInfo();
    
    if(localStorage.getItem("confirmation") != null && localStorage.getItem("confirmation") != "null")
    {
        $("#thankyoumsg").text(localStorage.getItem("confirmation"));
    }
    
    var url = "";
    $("#DeptName").text(localStorage.getItem("deptname"));
    
    if(localStorage.getItem("rsvp") == "false")
    {
        url = "login.html";
    }
    
    
    window.setTimeout(function(){
                      window.location.href = url;
                      }, 1500);
}