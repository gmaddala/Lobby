function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return replaceAll(sParameterName[1], "%20", " ");
        }
    }
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function clearStudentInfo()
{
    /*
    var key = localStorage.getItem("key");
    var deptname = localStorage.getItem("deptname");
    var appid = localStorage.getItem("appid");
    var rsvp = localStorage.getItem("rsvp");
    var anon = localStorage.getItem("anon");
    var initialintakestatus = localStorage.getItem("initialintakestatus");
    var hasreasons = localStorage.getItem("hasreasons");
    var reasons = localStorage.getItem("reasons");
    var enforcedeligibility = localStorage.getItem("enforcedeligibility");
    var appdescription = localStorage.getItem("appdescription");
    var allowregistration = localStorage.getItem("allowregistration");
    var eligiblitytype = localStorage.getItem("eligibilitytype");
    var locations = localStorage.getItem("locations");
    var selLocationID = localStorage.getItem("selLocationID");
    var question = localStorage.getItem("question");
    var reasonstype = localStorage.getItem("reasonstype");
    
    localStorage.clear();
    
    localStorage.setItem("key", key);
    localStorage.setItem("deptname", deptname);
    localStorage.setItem("appid", appid);
    localStorage.setItem("rsvp", rsvp);
    localStorage.setItem("anon", anon);
    localStorage.setItem("initialintakestatus", initialintakestatus);
    localStorage.setItem("hasreasons", hasreasons);
    localStorage.setItem("reasons", reasons);
     */
    
    localStorage.setItem("uid", null);
    localStorage.setItem("firstname", null);
    localStorage.setItem("lastname", null);
    localStorage.setItem("phone", null);
    localStorage.setItem("email", null);
    localStorage.setItem("cardswiped", null);
}

function showDialog(message) {
    /*
    $('<div id="dialog">' + message + '</div>').dialog(
                                                       {
                                                           modal: true,
                                                           buttons: {
                                                               "OK": function () {
                                                                $(this).dialog("close");
                                                               }
                                                           },
                                                       open: function(event) {
                                                       $('.ui-dialog-buttonpane').find('button:contains("OK")').addClass('modal-single-button');
                                                       },
                                                       dialogClass: "dialog-positioning"
                                                       }
                                                       );
     */
    alert(message);
}