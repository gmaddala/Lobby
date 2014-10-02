function InitializeThankYou(){
    clearStudentInfo();
    
    if(localStorage.getItem("confirmation") != null && localStorage.getItem("confirmation") != "null")
    {
        $("#thankyoumsg").text(localStorage.getItem("confirmation"));
    }
    
    var url = "";
    $("#DeptNameThankYou").text(localStorage.getItem("deptname"));
    
    if(localStorage.getItem("rsvp") == "false")
    {
        url = "login.html";
    }
    
    //TODO: get the timeout ms from configuration
    window.setTimeout(function(){
//                      window.location.href = url;
                      if(localStorage.getItem("rsvp") == "false"){
                        app1.navigate("#", "slide:left");
                        }
                      }, 2500);
}