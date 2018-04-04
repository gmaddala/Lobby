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
    var success = function(uid) {
        SignIn(uid);
    };
    //var error = function(message) { alert("Error: Please reswipe card"); };
    var error = function(message) { alert("Error: " + message); };
    cardreader.startCardReader(success, error);
},
stopCardReader: function(){
    var success = function() { };
    var error = function(message) { };
    cardreader.closeCardReader(success, error);
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

function SignIn(logon){
    $.ajax({
           type: "GET",
           url: getAPIUrl() + "/api/validlogon",
           data: {"logon": logon},
           beforeSend: function(){
           $('body').addClass('ajax-spinner');
           },
           success: function(data){
           //alert(data);
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
