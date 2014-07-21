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
        //app.startCardReader(); //cfries- added
    },
    //startCardReader: function() {
        //var success = function(uid) { alert("Success: " + uid); };
        //var error = function(message) { alert("Oopsie! " + message); };
        //cardreader.createEvent(success, error);
    //},
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

function showBadKeyDialog()
{
    $("#dialog-modal").dialog(
                              {
                              width: 600,
                              height: 400,
                              open: function(event, ui)
                              {
                              var textarea = $('<textarea style="height: 276px;">');
                              $(textarea).redactor({
                                                   focus: true,
                                                   autoresize: false,
                                                   initCallback: function()
                                                   {
                                                   this.set('<p>Lorem...</p>');
                                                   }
                                                   });
                              }
                              });
}

function LaunchKiosk()
{
    localStorage.clear();
    
    //SetTestData();
    //window.open("login.html", "_self");
    
    $.ajax({
           type: "GET",
           url: "http://sait-test.uclanet.ucla.edu/sawebnew2/api/ApplicationConfiguration",
           data: {"id": $('#txtAccessKey').val()},
           beforeSend: function(){
            $('body').addClass('ajax-spinner');
           },
           success: function(data){
            //alert(data);
            var jsonobj = JSON.parse(data);
            if(jsonobj.Status == 200)
               {
               
                    localStorage.setItem("key", $('#txtAccessKey').val());
                    localStorage.setItem("deptname", jsonobj.Data.DeptName);
                    localStorage.setItem("appdescription", jsonobj.Data.AppDescription);
                    localStorage.setItem("appid", jsonobj.Data.AppId);
                    localStorage.setItem("rsvp", jsonobj.Data.IsRSVPOnly);
                    localStorage.setItem("anon", jsonobj.Data.IsAnonymous);
                    localStorage.setItem("enforcedeligibility", jsonobj.Data.IsEnforcedEligibility);
                    localStorage.setItem("initialintakestatus", jsonobj.Data.InitialIntakeStatus);
                    localStorage.setItem("hasreasons", jsonobj.Data.HasReasons);
                    localStorage.setItem("reasons", JSON.stringify(jsonobj.Data.Reasons));
                   
                    //window.open("login.html?key=" + $('#txtAccessKey').val() + "&deptname=" + jsonobj.Data.DeptName + "&appid=" + jsonobj.Data.AppId + "&rsvp=" + jsonobj.Data.IsRSVPOnly + "&anon=" + jsonobj.Data.IsAnonymous + "&initialintakestatus=" + jsonobj.Data.InitialIntakeStatus,"_self");
                    window.open("login.html", "_self");
                }
            else
            {
                alert("The access key you entered is incorrect. Please click 'Retry' to reenter your access key.");
            }
           },
           error: function (jqXHR, textStatus, errorThrown) {
            alert("The access key you entered is incorrect. Please click 'Retry' to reenter your access key.");
           //alert(jqXHR + ";\n\n" + textStatus + ";\n\n" + errorThrown);
           },
           complete: function(){
            $('body').removeClass('ajax-spinner');
           }
    });
     
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


