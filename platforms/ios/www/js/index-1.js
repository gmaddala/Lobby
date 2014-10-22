function LaunchKiosk()
{
    
    //SetTestData();
    //window.open("login.html", "_self");
    if($('#ddl-locations > option').length > 0)
    {
        localStorage.setItem("selLocationID", $('#ddl-locations').val());
        InitializeLocalStorage();
        window.open("login.html", "_self");
    }
    else
    {
        if ( !isOfflineMode() )
        {
            //localStorage.clear();
            $.ajax({
                   type: "GET",
                   url: getAPIUrl() + "/api/ApplicationConfiguration",
                   data: {"id": $('#txtAccessKey').val()},
                   beforeSend: function(){
                   loading();
                   },
                   success: function(data){
                   //alert(data);
                   var jsonobj = JSON.parse(data);
                   if(jsonobj.Status == 200)
                   {
                   //RedirectToLoginPage(jsonobj);
                   RedirectToLoginPage(data);
                   }
                   else
                   {
                   showNativeDialog("The access key you entered is incorrect. Please reenter your access key.");
                   }
                   },
                   error: function (jqXHR, textStatus, errorThrown) {
                   //alert('The access key you entered is incorrect. Please reenter your access key.');
                   showNativeDialog('The access key you entered is incorrect. Please reenter your access key.');
                   //alert(jqXHR + ";\n\n" + textStatus + ";\n\n" + errorThrown);
                   },
                   complete: function(){
                   endLoading();
                   }
                   });
        }
        else{
            //get offline data
            var offlineData = GetOfflineData();
            var jsonobj = JSON.parse(offlineData);
            RedirectToLoginPage(jsonobj);
        }
    }
    
}

function RedirectToLoginPage(data)
{
//    localStorage.setItem("key", $('#txtAccessKey').val());
//    localStorage.setItem("deptname", jsonobj.Data.DeptName);
//    localStorage.setItem("appdescription", jsonobj.Data.AppDescription);
//    localStorage.setItem("appid", jsonobj.Data.AppId);
//    localStorage.setItem("rsvp", jsonobj.Data.IsRSVPOnly);
//    localStorage.setItem("anon", jsonobj.Data.IsAnonymous);
//    localStorage.setItem("enforcedeligibility", jsonobj.Data.IsEnforcedEligibility);
//    localStorage.setItem("initialintakestatus", jsonobj.Data.InitialIntakeStatus);
//    //localStorage.setItem("hasreasons", jsonobj.Data.HasReasons);
//    localStorage.setItem("allquestions", JSON.stringify(jsonobj.Data.Questions));
//    
//    if(jsonobj.Data.Questions.Questions.length == 1)
//    {
//        localStorage.setItem("questions", JSON.stringify(jsonobj.Data.Questions.Questions[0])); //does not have multiple forms
//    }
//	   localStorage.setItem("allowregistration", jsonobj.Data.AllowRegistration);
//    localStorage.setItem("confirmation", jsonobj.Data.ConfirmationMessage);
//    localStorage.setItem("welcome", jsonobj.Data.WelcomeMessage);
//	   
//	   localStorage.setItem("eligibilitytype", jsonobj.Data.EligibilityType);
//	   
//	   localStorage.setItem("locations", JSON.stringify(jsonobj.Data.Locations));
//    localStorage.setItem("intakeID", -1);

    localStorage.setItem("newAppData", data);
    var jsonobj = JSON.parse(data);
	   var location_array = jsonobj.Data.Locations;
	   if(location_array.length < 2)
       {
           if(location_array.length == 1)
           {
               localStorage.setItem("selLocationID", location_array[0].ID);
           }
           
           InitializeLocalStorage();
           window.open("login.html", "_self");
       }
       else
       {
           //$('#div-locations').removeClass('invisible');
           $('#liLocations').removeClass('invisible');
           //$('#div-locations').empty();
           //clear all the locations that were already populated
           $('#ddl-locations').empty();
           for(var i = 0 ; i < location_array.length ; i++)
           {
               $('#ddl-locations').append($('<option></option>').val(location_array[i].ID).html(location_array[i].Name));
           }
       }
    
    
	   
    //window.open("login.html?key=" + $('#txtAccessKey').val() + "&deptname=" + jsonobj.Data.DeptName + "&appid=" + jsonobj.Data.AppId + "&rsvp=" + jsonobj.Data.IsRSVPOnly + "&anon=" + jsonobj.Data.IsAnonymous + "&initialintakestatus=" + jsonobj.Data.InitialIntakeStatus,"_self");
    //window.open("login.html", "_self");
    
}

function InitializeLocalStorage()
{
    var jsonobj = JSON.parse(localStorage.getItem("newAppData"));
    
    localStorage.setItem("key", $('#txtAccessKey').val());
    localStorage.setItem("deptname", jsonobj.Data.DeptName);
    localStorage.setItem("appdescription", jsonobj.Data.AppDescription);
    localStorage.setItem("appid", jsonobj.Data.AppId);
    localStorage.setItem("rsvp", jsonobj.Data.IsRSVPOnly);
    localStorage.setItem("anon", jsonobj.Data.IsAnonymous);
    localStorage.setItem("enforcedeligibility", jsonobj.Data.IsEnforcedEligibility);
    localStorage.setItem("initialintakestatus", jsonobj.Data.InitialIntakeStatus);
    //localStorage.setItem("hasreasons", jsonobj.Data.HasReasons);
    localStorage.setItem("allquestions", JSON.stringify(jsonobj.Data.Questions));
    
    if(jsonobj.Data.Questions.Questions.length == 1)
    {
        localStorage.setItem("questions", JSON.stringify(jsonobj.Data.Questions.Questions[0])); //does not have multiple forms
    }
    
    localStorage.setItem("allowregistration", jsonobj.Data.AllowRegistration);
    localStorage.setItem("confirmation", jsonobj.Data.ConfirmationMessage);
    localStorage.setItem("welcome", jsonobj.Data.WelcomeMessage);
    localStorage.setItem("eligibilitytype", jsonobj.Data.EligibilityType);
    localStorage.setItem("locations", JSON.stringify(jsonobj.Data.Locations));
    localStorage.setItem("intakeID", -1);
}

function SetTestData()
{
    localStorage.setItem("key", "U0D7G3");
    localStorage.setItem("deptname", "Office for Students with Disabilities");
    localStorage.setItem("appdescription", "app description");
    localStorage.setItem("appid", "2");
    localStorage.setItem("rsvp", "0");
    localStorage.setItem("anon", "0");
    localStorage.setItem("enforcedeligibility", "0");
    localStorage.setItem("initialintakestatus", "5");
    localStorage.setItem("hasreasons", "false");
}

function AccessKeyHelp(e)
{
    e.preventDefault();
    //showDialog('Access Key is a system-generated passkey assigned to your event. You can find the Access Key on the Event Kiosk page of the staff portal.');
    showNativeDialog('Access Key is a system-generated passkey assigned to your event. You can find the Access Key on the Event Kiosk page of the staff portal.');
    
}