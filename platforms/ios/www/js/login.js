/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        app.startCardReader(); //cfries- added
    },
    startCardReader: function() {
        //alert("start cardreader");
        if(typeof cardreader != "undefined")
        {
            var success = function(uid) {
                if(localStorage.getItem("rsvp") == "true" || localStorage.getItem("enforcedeligibility") == "true")
                {
                    CheckIn(uid, false, true);
                }
                else
                {
                    SignIn(uid, true);
                }
            };
            var error = function(message) {
                //alert(message);
				showCardReaderErrorAlert("Error: Please reswipe card");
                /*
                $( "#dialog" ).on( "dialogclose", function( event, ui ) {
                                  app.stopCardReader();
                                  window.open("login.html", "_self");} );*/
                
            };
            cardreader.startCardReader(success, error);
        }
    },
    stopCardReader: function(){
        //alert("stop cardreader");
        if(typeof cardreader != "undefined")
        {
            var success = function() { };
            var error = function(message) { //showDialog("Error: " + message);
			showCardReaderErrorAlert("Error: " + message);};
            cardreader.closeCardReader(success, error);
        }
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        //var parentElement = document.getElementById(id);
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');

        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

function ClickBruincard(){
    //debugger;
	console.log('Cancel click..');
    $('#div_logon').css('display', 'none');
    $('#div_signin_method').css('display', 'block');
    $('#div_bruincard').css('display', 'block');
    $('#div_header').removeClass('invisible');
    $('#div_header_cancel').addClass('invisible');
    
    //app.startCardReader();
}

function ClickLogon(){
    //debugger;
    $('#div_bruincard').css('display', 'none');
    $('#div_signin_method').css('display', 'none');
    $('#div_logon').css('display', 'block');
    
    $('#div_header').addClass('invisible');
    $('#div_header_cancel').removeClass('invisible');
    
    
    app.stopCardReader();
}


function SignInWithUclaLogon(){
    app.stopCardReader();
	SignIn($('#txt_logon').val());
}

var startTimer1;
//self logging in
function SignIn(logon, isCardreader){
    isCardreader = typeof isCardreader != 'undefined' ? isCardreader : false;
    localStorage.setItem("cardswiped", isCardreader);
    
    var submitIntake = false; //if no reasons list, immediately submit intake
    var qjson = JSON.parse(localStorage.getItem("questions"));
    if(qjson.HasQuestions == false)
    {
        submitIntake = true;
    }
    
	if ( !isOfflineMode() )
	   {
           startTimer1 = new Date().getTime();
           
			$.ajax({
				   type: "GET",
				   url: "http://sait-test.uclanet.ucla.edu/sawebnew2/api/validlogon",
				   data: {"logon": logon, "submitIntake": submitIntake, "appkey": localStorage.getItem("key"), "initialintakestatus": localStorage.getItem("initialintakestatus"), "locationID": localStorage.getItem("selLocationID"), "cardSwiped": localStorage.getItem("cardswiped")},
				   beforeSend: function(){
				   app.stopCardReader();
				   console.log('before send..');
				   loading();
				   },
				   success: function(data){
					//alert(data);
					var jsonobj = JSON.parse(data);
					SetStudentData(jsonobj, submitIntake);
					
					//window.open("login.html?key=" + $('#txtAccessKey').val() + "&deptname=" + jsonobj.Data.DeptName ,"_self");
				   },
				   error: function (jqXHR, textStatus, errorThrown) {
				   //showDialog("Invalid UCLA logon");
				   ShowFlashMessage("Invalid UCLA logon");
                   app.startCardReader();
				   //alert(jqXHR + ";\n\n" + textStatus + ";\n\n" + errorThrown);
				   },
				   complete: function(){
				   $('body').removeClass('ajax-spinner');
				   }
				   });
//           alert((endTimer1 - startTimer1));
		 }
		 else{
				 //get offline data
				  var offlineData = GetOfflineStudentData();
				  var jsonobj = JSON.parse(offlineData);
				  SetStudentData(jsonobj, submitIntake);
		 }
}

function SetStudentData(jsonobj, submitIntake)
{
		if(jsonobj.Data.IsValidLogon == true)
            {
                localStorage.setItem("uid", jsonobj.Data.DictionaryUserInfo.UID);
                localStorage.setItem("firstname", jsonobj.Data.DictionaryUserInfo.FirstName)
                localStorage.setItem("lastname", jsonobj.Data.DictionaryUserInfo.LastName);
                localStorage.setItem("phone", jsonobj.Data.DictionaryUserInfo.Phone);
                localStorage.setItem("email", jsonobj.Data.DictionaryUserInfo.Email);
                if(!submitIntake)
                {
                    window.open("reasons.html", "_self");
                    //var endTimer1 = new Date().getTime();
                    //console.log('time taken to authenticate..' + (endTimer1 - startTimer1));

                }
                else
                {
                    window.open("thankyou.html", "_self");
                }
                //window.open("reasons.html?key=" + getUrlParameter('key') + "&uid=" + jsonobj.Data.UID + "&rsvp=" + getUrlParameter("rsvp") + "&anon=" + getUrlParameter("anon") + "&firstname=" + jsonobj.Data.DictionaryUserInfo.FirstName + "&lastname=" + jsonobj.Data.DictionaryUserInfo.LastName + "&phone=" + jsonobj.Data.DictionaryUserInfo.Phone + "&email=" + jsonobj.Data.DictionaryUserInfo.Email + "&initialintakestatus=" + getUrlParameter("initialintakestatus"), "_self");
            }
		else
            {
                //showDialog("Error: Invalid logon");
				ShowFlashMessage("Error: Invalid logon");

                //Remove loading image
                $('body').removeClass('ajax-spinner');
                //Remove loading image on kendo div - <div class="k-loading-mask ajax-spinner" style="width:100%;height:100%"></div>
                $('div.ajax-spinner').removeClass('ajax-spinner');
                $('#txt_logon').focus();
                app.startCardReader();
            }
}

function OverrideCheckIn(){
	CheckIn(localStorage.getItem('uid'), true, localStorage.getItem('cardswiped'));
}

//rsvp or eligibility check
function CheckIn(logon, isoverride, isCardreader){
    isCardreader = typeof isCardreader != 'undefined' ? isCardreader : false;
    localStorage.setItem("cardswiped", isCardreader);
    var type = -1; //if rsvp or enforced eligibility
    if(localStorage.getItem("rsvp") == "true")
    {
        type = 0;
    }
    else if(localStorage.getItem("enforcedeligibility"))
    {
        type = 1;
    }
    $.ajax({
           type: "GET",
           url: "http://sait-test.uclanet.ucla.edu/sawebnew2/api/checkineventuser",
           data: {"appid": localStorage.getItem("appid"), "uid": logon, "overrideRegistration": isoverride, "type": type, "initialintakestatus": localStorage.getItem("initialintakestatus"), "locationID": localStorage.getItem("selLocationID"), "appKey": localStorage.getItem("key"), "cardswiped": localStorage.getItem("cardswiped")},
           beforeSend: function(){
                app.stopCardReader();
           loading();
           },
           success: function(data){
               //alert(data);
               var jsonobj = JSON.parse(data);
                if(jsonobj.Data.UserInfo.IsValidLogon == false)
                {
                    //showDialog("Not valid logon");
					ShowFlashMessage("Not valid logon");
                }
               else
               {
           
                   localStorage.setItem("uid", jsonobj.Data.UserInfo.DictionaryUserInfo.UID);
                   localStorage.setItem("firstname", jsonobj.Data.UserInfo.DictionaryUserInfo.FirstName)
                   localStorage.setItem("lastname", jsonobj.Data.UserInfo.DictionaryUserInfo.LastName);
                   localStorage.setItem("phone", jsonobj.Data.UserInfo.DictionaryUserInfo.Phone);
                   localStorage.setItem("email", jsonobj.Data.UserInfo.DictionaryUserInfo.Email);
                    $('#student_name').text(localStorage.getItem("firstname") + " " + localStorage.getItem("lastname"));
           
                    if(jsonobj.Data.IsEligible == true)
                    {
                        $('#success').removeClass('invisible');
                        $('#failed').addClass('invisible');
                    }
                    else
                    {
                        $('#failed').removeClass('invisible');
                        $('#success').addClass('invisible');
                    }
           
           
               }
                app.startCardReader();
               //window.open("login.html?key=" + $('#txtAccessKey').val() + "&deptname=" + jsonobj.Data.DeptName ,"_self");
           },
           error: function (jqXHR, textStatus, errorThrown) {
                //showDialog("Invalid UCLA logon");
				ShowFlashMessage("Invalid UCLA logon");
                app.startCardReader();
           //alert(jqXHR + ";\n\n" + textStatus + ";\n\n" + errorThrown);
           },
           complete: function(){
           //$('body').removeClass('ajax-spinner');
           endLoading();
           }
           });
}

function CloseApp(e)
{
    e.preventDefault();
    /*
    var key = window.prompt("Please enter Application Key");
    if(key == null || key == "")
    {
        //do nothing
    }
    else if(key == localStorage.getItem("key"))
    {
        app.stopCardReader();
        window.open("index.html", "_self");
        //window.location.href = "index.html";
    }
    else
    {
        alert("Incorrect key");
    }
     */
    $("#dialog-modal").dialog(
                              {
                              width: 300,
                              open: function(event, ui)
                              {
                              //var textarea = $('<textarea style="height: 276px;">');
                              
                              },
                              modal:true,
                              dialogClass: "no-close",
                              buttons: {
                              "Cancel": function() {
                                $(this).dialog("close");
                              },
                              "Submit": ValidateAppKey()
                                  },
                              open: function(event) {
                              $('.ui-dialog-buttonpane').find('button:contains("Cancel")').addClass('modal-double-button-left');
                              $('.ui-dialog-buttonpane').find('button:contains("Submit")').addClass('modal-double-button-right important');
                              }
                              });
}

function OverrideHelp(e)
{
    e.preventDefault();
    //alert("Selecting 'Override' marks the attendee as having been admitted but failed to meet the criteria set for this event.");
	showNativeDialog("Selecting 'Override' marks the attendee as having been admitted but failed to meet the criteria set for this event.");
}

function ClickRegistration()
{
    loading();
    app.stopCardReader();
    location.href='registration.html';
    
}

function ValidateAppKey(){
	  var key = $("#txt_app_key").val();
	  if(key == null || key == "")
	  {
	  //do nothing
	  }
	  else if(key == localStorage.getItem("key"))
	  {
	  console.log('checking..');
		app.stopCardReader();

		localStorage.setItem("key", "null");
		console.log('opening..');
		window.open("index.html", "_self");
		//window.location.href = "index.html";
	  }
	  else
	  {
		//$(this).dialog("close");
		HideReconfigureLobbyDialog();
		//showDialog("Incorrect key");
		ShowFlashMessage("Incorrect key");
	  }
}

function NavigateToReasonsPage(){
  window.open('reasons.html', '_self');
}

function HideReconfigureLobbyDialog() {
	$("#dialog-modal").kendoMobileModalView("close");  	
}

function ShowFlashMessage(message){
	$('#spanFlashMessage').text(message);
	$("#modalviewFlash").kendoMobileModalView("open");
	//auto close the message after 1s
	window.setTimeout(function(){
                                  $("#modalviewFlash").kendoMobileModalView("close");
                                  }, 1500
					  );
}

function FailedCardSwipe(){
    $("#modalviewAlert").kendoMobileModalView("close");
    app.stopCardReader();
    window.open("login.html", "_self");
}

function showCardReaderErrorAlert(msg) {
    console.log(msg.toString);
    $('#spanAlertMessageCardReader').text(msg);
    $("#modalviewAlertCardReader").kendoMobileModalView("open");
}

//methods moved from login.html
var app1, initialView;
function Initialize(){
    
    //Reset CollectedResponses
    localStorage.setItem("CollectedResponses", JSON.stringify(""));
    //app1 = new kendo.mobile.Application(document.body, {useNativeScrolling: true}); //, transition: 'overlay:up'
    
    //debugger;
    if(localStorage.getItem("anon") != "true")
    {
        app.initialize();
    }
    
    //$("#welcome_text1").text("Welcome to " + localStorage.getItem("deptname"));
    InitForm();
    if(localStorage.getItem("allowregistration") == "false")
    {
        $("#btn-register").addClass("invisible");
    }
    
    app1 = new kendo.mobile.Application(document.body, {useNativeScrolling: true, initial: initialView}); //, transition: 'overlay:up'
};

//not used
function ClickLogon(){
    app1.Navigate('#viewSigninWithUclaLogon');
    app.stopCardReader();
}

function InitForm(){
    $("#DeptName").text(localStorage.getItem("deptname"));
    if(localStorage.getItem("welcome") != null && localStorage.getItem("welcome") != "null")
    {
        $("#welcome_text").text(localStorage.getItem("welcome"));
        $("#welcome_text1").text(localStorage.getItem("welcome"));
    }
    
    if(localStorage.getItem("anon") == "true")
    {
        initialView = "anon";
        //$("#anon").removeClass("invisible");
        //$("#not_anon").addClass("invisible");
        //app1.navigate("#anon");
        $("#body").addClass("molecules-bg");
    }
    else if(localStorage.getItem("rsvp") == "true" || localStorage.getItem("enforcedeligibility") == "true")
    {
        
        initialView = "rsvp_eleg";
        
        $("#body").removeClass("molecules-bg");
        //$("#rsvp_eleg").removeClass("invisible");
        //$("#not_anon").addClass("invisible");
        //$("#welcome_text_div").addClass("invisible");
        $("#event_name").text(localStorage.getItem("appdescription"));
        //app1.navigate("#rsvp_eleg");
    }
    else
    {
        initialView = "not_anon";
        $("#not_anon").removeClass("invisible");
        $('#txt_logon').val('').focus();
        $("#body").addClass("molecules-bg");
    }
}

