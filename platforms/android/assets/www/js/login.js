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
        if(typeof(cardreader) != "undefined")
        {
            var success = function(uid) {
                if(localStorage.getItem("rsvp") == "true" || localStorage.getItem("enforcedeligibility") == "true")
                {
                    CheckIn(uid, false);
                }
                else
                {
                    SignIn(uid);
                }
            };
            var error = function(message) {
                alert("Error: Please reswipe card");
                app.stopCardReader();
                window.open("login.html", "_self");
            };
            cardreader.startCardReader(success, error);
        }
    },
    stopCardReader: function(){
        if(typeof(cardreader) != "undefined")
        {
            var success = function() { };
            var error = function(message) { };
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
    $('#btn_bruincard').addClass('primary active');
    $('#btn_logon').removeClass('primary active');
    $('#div_logon').css('display', 'none');
    $('#div_bruincard').css('display', 'block');
    
    app.startCardReader();
}

function ClickLogon(){
    $('#btn_bruincard').removeClass('primary active');
    $('#btn_logon').addClass('primary active');
    $('#div_bruincard').css('display', 'none');
    $('#div_logon').css('display', 'block');
    
    app.stopCardReader();
}

//self logging in
function SignIn(logon){
    alert(logon);
    $.ajax({
           type: "GET",
           url: "http://sait-test.uclanet.ucla.edu/sawebnew2/api/validlogon",
           data: {"logon": logon},
           beforeSend: function(){
           app.stopCardReader();
           $('body').addClass('ajax-spinner');
           },
           success: function(data){
            alert(data);
            var jsonobj = JSON.parse(data);
            if(jsonobj.Data.IsValidLogon == true)
            {
                localStorage.setItem("uid", jsonobj.Data.DictionaryUserInfo.UID);
                localStorage.setItem("firstname", jsonobj.Data.DictionaryUserInfo.FirstName)
                localStorage.setItem("lastname", jsonobj.Data.DictionaryUserInfo.LastName);
                localStorage.setItem("phone", jsonobj.Data.DictionaryUserInfo.Phone);
                localStorage.setItem("email", jsonobj.Data.DictionaryUserInfo.Email);
                window.open("reasons.html", "_self");
                //window.open("reasons.html?key=" + getUrlParameter('key') + "&uid=" + jsonobj.Data.UID + "&rsvp=" + getUrlParameter("rsvp") + "&anon=" + getUrlParameter("anon") + "&firstname=" + jsonobj.Data.DictionaryUserInfo.FirstName + "&lastname=" + jsonobj.Data.DictionaryUserInfo.LastName + "&phone=" + jsonobj.Data.DictionaryUserInfo.Phone + "&email=" + jsonobj.Data.DictionaryUserInfo.Email + "&initialintakestatus=" + getUrlParameter("initialintakestatus"), "_self");
            }
            else
            {
                alert("Error: Invalid logon");
            }
            //window.open("login.html?key=" + $('#txtAccessKey').val() + "&deptname=" + jsonobj.Data.DeptName ,"_self");
           },
           error: function (jqXHR, textStatus, errorThrown) {
           alert("Invalid UCLA logon");
           //alert(jqXHR + ";\n\n" + textStatus + ";\n\n" + errorThrown);
           },
           complete: function(){
           $('body').removeClass('ajax-spinner');
           }
           });
}

//rsvp or eligibility check
function CheckIn(logon, isoverride){
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
           data: {"appid": localStorage.getItem("appid"), "uid": logon, "overrideRegistration": isoverride, "type": type, "initialintakestatus": localStorage.getItem("initialintakestatus"), "locationID": localStorage.getItem("selLocationID"), "appKey": localStorage.getItem("key")},
           beforeSend: function(){
                app.stopCardReader();
                $('body').addClass('ajax-spinner');
           },
           success: function(data){
               alert(data);
               var jsonobj = JSON.parse(data);
                if(jsonobj.Data.UserInfo.IsValidLogon == false)
                {
                    alert("Not valid logon");
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
                alert("Invalid UCLA logon");
                app.startCardReader();
           //alert(jqXHR + ";\n\n" + textStatus + ";\n\n" + errorThrown);
           },
           complete: function(){
           $('body').removeClass('ajax-spinner');
           }
           });
}

