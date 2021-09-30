var offlineMode = false;

$.ajaxSetup({
            headers:{"Auth-Key": "AB2EC57B8891ED2DAD4C27D6DF5BD"}
});

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

function getAPIUrl()
{
    //Test
    return "https://sait-test.uclanet.ucla.edu/lobbyapi";
    //QA
    //return "https://api-qa.sa.ucla.edu/v2/lobbyapi";
    //Prod
    //return "https://api.sa.ucla.edu/lobbyapi"; old version obsolete
    //return "https://api.sa.ucla.edu/v2/lobbyapi";
    
    
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
    localStorage.setItem("intakeID", -1);
    localStorage.setItem("ShowNameOnPublicQueue", null);
}

function showDialog(message) {
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
}

function showNativeDialog(msg) {
	$('#spanAlertMessage').text(msg);
	$("#modalviewAlert").kendoMobileModalView("open");
    $('#divContent').parent().parent().addClass('FlexFix');
}
			
function HideNativeDialog() {			
	$("#modalviewAlert").kendoMobileModalView("close");
}			


function isOfflineMode (){
	return offlineMode;
}

function getJSON(){
$.get('js/not_anonymous.json', function(data) {
   //do_something_with(data)
   console.log('success..' + data);
}, 'text');

}

function GetOfflineData(){
var retData = "";

 if (isOfflineMode()){
	console.log('getting offline data');
	var fileName = '';
	fileName = 'js/not_anonymous.json';
	//fileName = 'js/anonymous.json';
	//fileName = 'js/rsvp.json'
	console.log('fileName..' + fileName);
	
     $.get(fileName, function(data) {
		retData = data;
	}, 'text');
	 console.log('offline data1..' + retData);
 }
 
 return retData;
}

function GetOfflineStudentData(){
  var retData = "";
  if (isOfflineMode())
  {
    retData = '{"Status":200,"ErrorMessage":null,"Data":{"IsValidLogon":true,"DictionaryUserInfo":{"FirstName":"LESLIE","UclaLogonId":"leabbott","Email":"leabbott@ucla.edu","UID":"403723183","LastName":"ABBOTT","Phone":"7609009579","ShowNameOnPublicQueue":true}}}';
  }
  
  return retData;
}

function loading(){
    //$('body').addClass('ajax-spinner');
    $('body').append('<div class="k-loading-mask ajax-spinner" style="width:100%;height:100%"></div>');
}

function endLoading(){
    $('.ajax-spinner').remove();
}

/* Proposed fix from Telerik Form to make a modal center aligned. Didn't work as expected. Have to try it again */
/* http://www.telerik.com/forums/can't-get-modal-view-to-appear-at-top#iMEmd0SZ_0KH6H7SBhLtuw */
function AddMiddleClass() {
      //this.element.closest(".km-modalview-root").addClass("MiddleModalView")
	  this.element.closest(".k-animation-container").addClass("MiddleModalView1")
}

GlobalObjects = {
LobbyType: { NONE: 0, CheckIn_CheckOut: 1 },
CheckInErrorType: { NONE: 0, SystemError: 1, IntakeId_NotSupplied: 2, Success: 3, RoomFull: 4, NoTraningWithin360: 5, NotCheckedOut: 6 },
CheckOutErrorType: { NONE: 0, SystemError: 1, IntakeId_NotSupplied: 2, Success: 3, NotCheckedIn: 4 }
}
