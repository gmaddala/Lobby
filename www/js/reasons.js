function SubmitReasons()
{
    event.preventDefault();
    
    var type = "checkbox";
    if(localStorage.getItem("reasonstype") == "1")
    {
        type = "radio";
    }
    if($('input[type=' + type + ']:checked').length == 0)
    {
        alert("Please select a response.");
        return;
    }
    
    var myJsonObj = SetUpIntakeJSONObj();
    
    $('input[type=' + type + ']:checked').each(function () {
                                   myJsonObj.Reasons.ReasonsList.push({"ReasonID": $(this).attr('id'), "ReasonDetails": $("#" + $(this).attr('id') + "_txt").val()});
                                   });
    
    SubmitIntake(myJsonObj);
}



function SubmitNoReasons()
{
    var myJsonObj = SetUpIntakeJSONObj();
    
    SubmitIntake(myJsonObj);
}


function SetUpIntakeJSONObj()
{
    var myJsonObj = {
    UID: localStorage.getItem("uid"),
    FirstName: localStorage.getItem("firstname"),
    LastName: localStorage.getItem("lastname"),
    Phone: localStorage.getItem("phone"),
    Email: localStorage.getItem("email"),
    AppID: localStorage.getItem("key"),
    InitialIntakeStatus: localStorage.getItem("initialintakestatus"),
    Reasons: {
    IntakeID: 0,
    ReasonsList: []
    },
    LocationID: localStorage.getItem("selLocationID"),
    CardSwiped: localStorage.getItem("cardswiped")
    };
    
    return myJsonObj;

}

function SubmitIntake(myJsonObj)
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
           $('body').addClass('ajax-spinner');
           },
           success: function(data){
           //alert(data);
           window.open("thankyou.html", "_self");
           },
           error: function (jqXHR, textStatus, errorThrown) {
           //alert("The access key you entered is incorrect. Please click 'Retry' to reenter your access key.");
           alert(jqXHR + ";\n\n" + textStatus + ";\n\n" + errorThrown);
           },
           complete: function(){
           $('body').removeClass('ajax-spinner');
           }
           
           });
}