var otherPrefix = "[Other] - ";

function SubmitReasons(e)
{
    e.preventDefault();
    
    var obj = JSON.parse(localStorage.getItem("questions"));
    var q_array = obj.Questions;
    
    //var errorText = "Please select a response for this question(s)- ";
	var errorText = "Please answer all the required questions highlighted";
    var hasError = false;
	var ctl;
	var firstErrCtl;
    var cnt = 0;
    var canDelay = false;
    
    if (q_array.length < 3)
	{//validate reasons for less than 3 questions
        if($('div.OtherDiv input').attr('id') != undefined){
            $('div.OtherDiv input').blur();
            canDelay = true;
            //adding a delay to avoid UI transition error
            for(var i= 0 ; i < 3000000; i++){
                cnt = cnt + 2;
            }
        }
        else{
            cnt = 1001;
        }
        
        if(cnt > 1000){
          hasError = ValidateReasons1(q_array);
        }
	}
	else{//validate reasons for 3 or more questions
		hasError = ValidateReasons2(q_array);
	}
    
    if(hasError)
    {
        //showDialog(errorText);
		//showNativeDialog(errorText);
        return;
    }
    var myJsonObj = SetUpIntakeJSONObj();
    
    
    if (q_array.length < 3){//collect response for lobby which has 2 or less questions
		for(var i = 0; i < q_array.length; i++) {
			var question = q_array[i];
			var inputtype = "checkbox";
			
			if(question.ResponsesType == "1" || question.ResponsesType == "2")
			{
				$('input[name="input-' + question.ID + '"]:checked').each(
														 function(){
														 myJsonObj.Reasons.ReasonsList.push({
															"ReasonID":$(this).attr('id'),
															"ReasonDetails": $("#" + $(this).attr('id') + "-txtother").val()
														 });
														 }
				);
				
				//TODO: add other textbox
			}
			else if(question.ResponsesType == "3")
			{
				/*
				inputtype = "selectbox";
				var select = $("#combobox_" + question.ID);
				myJsonObj.Reasons.ReasonsList.push({"ReasonID": select.val(), "ReasonDetails": ""});
				 */
				var select = $("#ul_" + question.ID + " li[data-role=combobox]");
				myJsonObj.Reasons.ReasonsList.push({"ReasonID": select.attr('value'), "ReasonDetails": ""});
			}
			else if (question.ResponsesType == "4")
			{
				inputtype = "textbox";
				var txt = $('#' + question.Responses[0].ID);
				myJsonObj.Reasons.ReasonsList.push({"ReasonID": question.Responses[0].ID, "ReasonDetails": txt.val()});
				 

			}
		}
    }
	else
	{
		var collectedResponses = JSON.parse(localStorage.getItem("CollectedResponses"));
		var reasonId, otherReason, reasonIdArr, otherReasonId, otherReasonForCheckbox;
		
		for(var idx = 0; idx < collectedResponses.length; idx++) {
			reasonId = collectedResponses[idx].ReasonId;
			otherReason = collectedResponses[idx].ReasonDetails;
			otherReasonId = collectedResponses[idx].OtherReasonId;
			
			otherReason = otherReason.replace(otherPrefix, "");
			
			if (otherReason == undefined) { otherReason = "";}

			//check if reasonId contains comma separated reasons (checkbox responses)
			if (reasonId.indexOf(",") != -1){
				//if yes, push them separate; check if the reasonid is other reasonId. if yes, push reasondetail assoicated
				reasonIdArr = reasonId.split(",");
				for (var idx1 = 0; idx1 < reasonIdArr.length; idx1++)
				{
					otherReasonForCheckbox = "";
					if(otherReasonId != undefined && otherReasonId == reasonIdArr[idx1]) 
					{
						otherReasonForCheckbox = otherReason;
					}
					
					myJsonObj.Reasons.ReasonsList.push({
												"ReasonID":reasonIdArr[idx1],
												"ReasonDetails": otherReasonForCheckbox
											 });
				}
			}
			else{
					//collect responses
					myJsonObj.Reasons.ReasonsList.push({
												"ReasonID":reasonId,
												"ReasonDetails": otherReason
											 });
				}
		}
	}
    
    if(canDelay){
//        alert('delay..');
        setTimeout(function(){SubmitIntake(myJsonObj);}, 300);
        canDelay = false;
    }
    else
    {
        SubmitIntake(myJsonObj);
    }
}

function ValidateReasons1(q_array){
	var question, hasError = false;
    var firstErrCtl;
	
	for(var i = 0 ; i < q_array.length ; i++)
    {
        question = q_array[i];
		
        if(question.ResponsesType == "1" || question.ResponsesType == "2")
        {//Checkbox/Radio
		   ctl = $('input[name="input-' + question.ID + '"]');
            if($('input[name="input-' + question.ID + '"]:checked').val() != "on")
			//if($(ctl+':checked').val() != "on")
            {
			   //$('input[name="input-' + question.ID + '"]').closest('div').addClass("Error");
			   $(ctl).closest('div').addClass("Error");
                //errorText = errorText + "\n " + question.QuestionText;
                hasError = true;
            }
			else{
				//$('input[name="input-' + question.ID + '"]').closest('div').removeClass("Error");
				$(ctl).closest('div').removeClass("Error");
			}
        }
        else if(question.ResponsesType == "4")
        {//Textbox
			ctl = $('#' + question.Responses[0].ID);
            //if($('#' + question.Responses[0].ID).val().length == 0)
			if($(ctl).val().length == 0)
            {
				//$('#' + question.Responses[0].ID).addClass("Error");
				$(ctl).addClass("Error");
                //errorText = errorText + "\n " + question.QuestionText;
                hasError = true;
            }
			else{
				//$('#' + question.Responses[0].ID).closest('div').removeClass("Error");
				$(ctl).removeClass("Error");
			}
        }
		else if(question.ResponseType = "3")
		{//combo box
			var select = $("#ul_" + question.ID + " li[data-role=combobox]");
			if ($(select).attr('value') == -1)
			{
				$("#ul_" + question.ID + " input").addClass('Error');
			}
			else
			{
				$("#ul_" + question.ID + " input").removeClass('Error');
			}
		}
		
        if($('div.OtherDiv input').attr('id') != undefined){
            //other input ctl is displayed
            var otherTextbox = $('div.OtherDiv input');
            var otherText = otherTextbox.val();
            otherText = $.trim(otherText);
            
            if(otherText == ""){
                otherTextbox.addClass('Error');
                hasError = true;
            }
            else{
                otherTextbox.removeClass('Error');
                hasError = false;
            }
        }
        
        
        for(var x = 0 ; x < question.Responses.length ; x++)
        {
            if (question.Responses[x].ReasonTypeID == 2)
            {
                var otherTextbox = $('div.OtherDiv input');
                var otherText = otherTextbox.val();
                otherText = $.trim(otherText);
                
                if(otherText.length > 0)
                {
                    var phoneNumber = otherText.replace("(", "").replace(")", "").replace("-","");
                    if(phoneNumber.length != 10)
                    {
                        otherTextbox.addClass('Error');
                        hasError = true;
                    }
                    else{
                        otherTextbox.removeClass('Error');
                        hasError = false;
                    }
                }
                
            }
        }
        
        
        
		if (firstErrCtl == undefined){
		   firstErrCtl = ctl;
		   //**scrollTop and focus both does the same; commented scrollTop
		    // $('html, body').animate({				 
				 // scrollTop:$(firstErrCtl).offset().top
			// }, 1000);
			
			//focus on first control that erred out
			$(firstErrCtl).focus();
		}
    }
	
	return hasError
}

function ValidateReasons2(q_array){
 
	var question, questionId, responseContainer, response, hasError = false;
	
	for(var i = 0 ; i < q_array.length ; i++)
    {
        question = q_array[i];
		responseContainer = $('#divResponse'+ question.ID);
		if(!$("#div" + question.ID).hasClass("invisible"))
        {
            if (responseContainer.children().length == 1)
            {
                
                //input control
                var txtBox = responseContainer.find('input');
                
                if (txtBox.length == 0)// || (txtBox.length == 1 && responseContainer.find($("input[id^='txtother']")).length > 0))
                {
                    //alert("Hi");
                //button group
                if(responseContainer.find('ul'))
                {
                    //alert(responseContainer.children().data("kendoMobileButtonGroup").current().attr('id'));
                    if(responseContainer.children().data("kendoMobileButtonGroup").current().attr('id') == undefined)
                    {
                        responseContainer.find('ul').parent().addClass("Error");
                        responseContainer.find('ul').addClass("Error");
                        SetUserResponseForQuestionId(question.ID, responseContainer.children().data("kendoMobileButtonGroup").current().attr('id'), "");
                        hasError = true;
                    }
                    else
                    {
                        responseContainer.find('ul').parent().removeClass("Error");
                        responseContainer.find('ul').removeClass("Error");
                        SetUserResponseForQuestionId(question.ID, responseContainer.children().data("kendoMobileButtonGroup").current().attr('id'), "");
                    }
                }
                }
                
                if(txtBox.length != 0)
                {
                    response = txtBox.val();
                    if ($.trim(response) == ""){
                        //highlight the complete cell
                        responseContainer.find('input').parent().addClass("Error");
                        responseContainer.find('input').addClass("Error");
                        SetUserResponseForQuestionId(question.ID, txtBox.attr('id'), "");
                        hasError = true;
                    }
                    else
                    {
                        
                        responseContainer.find('input').parent().removeClass("Error");
                        responseContainer.find('input').removeClass("Error");
                        SetUserResponseForQuestionId(question.ID, txtBox.attr('id'), responseContainer.find('input').val());
                        
                        
                        for(var x = 0 ; x < question.Responses.length ; x++)
                        {
                            if (question.Responses[x].ReasonTypeID == 2)
                            {
                                
                                if(response.length > 0)
                                {
                                    var phoneNumber = response.replace("(", "").replace(")", "").replace("-","");
                                    if(phoneNumber.length != 10)
                                    {
                                        responseContainer.find('input').addClass("Error");
                                        hasError = true;
                                    }
                                    else
                                    {
                                        responseContainer.find('input').removeClass("Error");
                                    }
                                }
                                
                            }
                        }
                        
                        
                    }
                }
            }
            else if ($('#divResponse'+ question.ID).children().length == 2)
            {
                //span control and caret
                response = $('#divResponse'+ question.ID).find('span.Response').text();
                response = response.replace("Required", "");
                
                if (response == ""){
                    responseContainer.addClass("Error");
                    hasError = true;
                }
                else
                {
                    responseContainer.removeClass("Error");
                }
            }
            
            
        }//if not invisible
        else
        {
            RemoveUserResponseForQuestionId(question.ID);
        }
	}//for
	//console.log('has error..'+ hasError);
		return hasError;
}

function RemoveUserResponseForQuestionId(questionId)
{
	var collResponses = JSON.parse(localStorage.getItem("CollectedResponses"));
	for (var idx = 0; idx < collResponses.length; idx++)
	{
		if(collResponses[idx].QuestionId == questionId)
		{
			collResponses.splice(idx, 1);
		}
	}
	localStorage.setItem("CollectedResponses", JSON.stringify(collResponses));
}

function SetUserResponseForQuestionId(questionId, reasonId, value)
{
	var collResponses = JSON.parse(localStorage.getItem("CollectedResponses"));
    var found = false;
	for (var idx = 0; idx < collResponses.length; idx++)
	{
		if(collResponses[idx].QuestionId == questionId)
		{
            found = true;
			collResponses[idx].ReasonId = reasonId;
			collResponses[idx].ReasonDetails = value;
		}
	}
    
    if(!found)
    {
        collectedResponses.push({QuestionId: question.ID, ReasonId: reasonId, ReasonDetails: value, OtherReasonId: ""});
    }
    
	localStorage.setItem("CollectedResponses", JSON.stringify(collResponses));
}

function SubmitNoReasons()
{
    var myJsonObj = SetUpIntakeJSONObj();
    
    SubmitIntake(myJsonObj);
}


function SetUpIntakeJSONObj()
{
    if(localStorage.getItem("cardswiped") == "null")
    {
        localStorage.setItem("cardswiped", false);
    }
    if(localStorage.getItem("ShowNameOnPublicQueue") == "null")
    {
        localStorage.setItem("ShowNameOnPublicQueue", false);
    }
    var myJsonObj = {
    UID: localStorage.getItem("uid"),
    UclaLogonId: localStorage.getItem("uclalogonid"),
    FirstName: localStorage.getItem("firstname"),
    LastName: localStorage.getItem("lastname"),
    Phone: localStorage.getItem("phone"),
    Email: localStorage.getItem("email"),
    AppID: localStorage.getItem("key"),
    InitialIntakeStatus: localStorage.getItem("initialintakestatus"),
    Reasons: {
        IntakeID: localStorage.getItem("intakeID"),
        ReasonsList: []
    },
    LocationID: localStorage.getItem("selLocationID"),
    CardSwiped: localStorage.getItem("cardswiped"),
    IntakeID: localStorage.getItem("intakeID"),
    ShowNameOnPublicQueue: localStorage.getItem("ShowNameOnPublicQueue"),
    PreEvaluationFormID: localStorage.getItem("preformid"),
    BCAgreementVersionNumber:localStorage.getItem("BCAgreementVersionNumber")
    };
    
    //console.log("email: " + myJsonObj.Email)
    
    return myJsonObj;

}


function DummyRedirect(e)
{
    
}

function SubmitIntake(myJsonObj)
{
    $.ajax({
           type: "POST",
           contentType: "application/json; charset=utf-8",
           url: getAPIUrl() + "/api/submitstudentinfo",
           dataType: "json",
           data: JSON.stringify(
                                myJsonObj
                                ),
           beforeSend: function(){
           loading();
           },
           success: function(data){
           
           
           var obj = jQuery.parseJSON(data);
           
           if(obj.Status == 406)
           {
           //case when the Event/Lobby is not active
           showNativeDialog("Application is Not Active. Please enter a valid key");
           //window.open("index.html", "_self");
           DisplayReconfigureLobbyDialog();
           }
           
           else
           {
           //reset user responses on Reasons page
           ResetUserResponses();
           
           localStorage.setItem("intakeID", obj.Data);
           //alert(obj.Data);
				//window.open("thankyou.html", "_self");
           //alert("reasons pre formid = " + myJsonObj.PreEvaluationFormID);
           if (myJsonObj.PreEvaluationFormID != 1)
           {
           app1.navigate("#divThankYouView", "slide:left");
           }
           else
           {
           SetQuestions(2);
           localStorage.setItem("preformid", 2)
           endLoading();
           //redirect to questions-body1 div and redirect back to questions-body so that the data-show event fires
           app1.navigate("#questions-body1");
           app1.navigate("#questions-body");
           
           }
           }
           
           },
           error: function (jqXHR, textStatus, errorThrown) {
           showNativeDialog("An error has occurred. Please try again." + jqXHR.responseText);
           //alert("The access key you entered is incorrect. Please click 'Retry' to reenter your access key.");		   
           //alert(jqXHR.responseText + ";\n\n" + textStatus + ";\n\n" + errorThrown);
			//showNativeDialog("Error while checking in. Please contact the administrator");
           },
           complete: function(){
				endLoading();
           },
           
           });
}

//moved from reasons.html
var app1, paramQuestionId, eventQuestions, otherPrefix = "[Other] - ";
function Initialize1(){
    //Adding useNativeScrolling property interferes with mobileListView
    //needed for standalone reasons.html
    //    app1 = new kendo.mobile.Application(document.body);
    console.log("Initializing reasons page..");
    //    $("#DeptName").text(localStorage.getItem("deptname"));
    
    $('.textbox-true').click(function(){
                             $(this).parent().parent().append("<div><input type='text' id='" + $(this).attr('id') + "-txtother' class='temp'/></div>")
                             });
}

function ResetListViewControls(){
    console.log('reconstructing listview..');
    //set user response as empty when listview is to be constructed fresh
//    selectedResponse = "";
    //reset listview controls
    $('#local-filterable-listview1').empty();
    //reset the user selected response
    $('#spanListViewResponse').text("");
    //clear the filter control
    $('#txtSearchOrg').val("");
}

//page size for # of records to be displayed in the listview at a time
var defaultPageSize = 20;

function mobileListViewIncremental(){
    var allOrgs;
    var fromIdx = 0, toIdx = 0;
    
//    if(canReconstructListView){
//        ResetListViewControls();
//    }
    
    var selectedResponse = $('#spanListViewResponse').text();
    //get the user response from collected response obj
    userListViewResponseId = GetUserResponse(paramQuestionId, "Id");
    //            $('#txtSearchOrg').val('');
    
    if(allOrgs == undefined){
        //add all formatted orgs into localStorage
        var allOrgsFormatted = [];
        var liText = "", responseText;
        //get the data to be populated in the listview
        var dataSource = getOrganizations();
        
        for(var idx = 0; idx < dataSource.length; idx++)
        {
            responseText = dataSource[idx].Text;
            
            liText = "<li><label class='km-listview-label'>"+ dataSource[idx].Text + "<input type='radio' name='input-" + paramQuestionId + "' id='"+ dataSource[idx].ID +"' class='textbox-"+ dataSource[idx].OpensTextbox+ " km-widget km-icon km-check'/></label></li>";
            
            
            allOrgsFormatted.push({"li":liText, "Text": dataSource[idx].Text});
        }
        localStorage.setItem("allOrgs", JSON.stringify(allOrgsFormatted));
    }
    
    var totalLi = dataSource.length;
    var liCount = $('input[name="input-' + paramQuestionId + '"]').length;
    
    
    if(liCount > 0 && liCount < totalLi)
    {
        
    }
    else if (liCount == 0)
    {
        fromIdx = 0;
        toIdx = defaultPageSize;
        
        for (var idx = fromIdx; idx < toIdx; idx++)
        {
            $("#local-filterable-listview1").append(allOrgsFormatted[idx].li);
        }
        
        if (toIdx < totalLi && $('#liLoadMore').attr('id') == undefined){
            $("#local-filterable-listview1").append("<li id='liLoadMore' data-click='LoadMoreOrgs' class='LoadMore'><a data-role='button' data-click='LoadMoreOrgs' data-click='LoadMoreOrgs'>Load more...</a></li>");
        }
        
        $("#local-filterable-listview1").kendoMobileListView();
        //bind the click event to load more orgs
        $('#liLoadMore').bind('click', LoadMoreOrgs);
        $('#liLoadMore a').removeClass("km-listview-link");
        $('#liLoadMore a').kendoMobileButton({click:LoadMoreOrgs});
        //Display selected response by the side of the question
        $('input[name="input-' + paramQuestionId + '"]').click(function(){
                                                               $('#spanListViewResponse').text( $(this).parent().text());
                                                               listViewResponseId = $(this).attr('id');
                                                               });
    }
    
    
    
    //Find the span id in scroll container
    var spanIdInScrollContainer = $('div.km-scroll-container #spanQuestionText1').attr('id');
    if(spanIdInScrollContainer != undefined)
    {
        //				$('#spanQuestionText1').parent().next().next().next().after($('#spanQuestionText1').next().next().next())
        $('#spanQuestionText1').parent().next().next().after($('#divScrollableListView'));
    }
    //$('input[name="input-8"]').each(function() {console.log($(this).parent().text());});
    if(selectedResponse != undefined && selectedResponse != ""){
        RestoreUserSelection(selectedResponse);
    }
}

//Loads more organization on click of 'Load More' button
function LoadMoreOrgs(e){
    AddOrgs("");
}

var searchStartIdx = 0, searchEndIdx = 0, prevSearchText = "", searchResults;
//Adds organization to listview incrementally
function AddOrgs(searchText){
    //total number of Organizations
    var allOrgs = JSON.parse(localStorage.getItem("allOrgs"));
    var fromIdx, toIdx, liCount, org;
    var totalLi = allOrgs.length;
    var selectedResponse = $('#spanListViewResponse').text();
    //get the user response from collected response obj
    userListViewResponseId = GetUserResponse(paramQuestionId, "Id");
    //            console.log('selected response..' + selectedResponse + " userlistviewresponseid:"+ userListViewResponseId + " listviewResponseId:" + listViewResponseId);
    $('#liLoadMore').remove();
    
    if(searchText != "" && searchText != undefined){//if search text is available, clear all the li items
        searchText = searchText.toLowerCase();
        //                console.log('search text:' + searchText + '; prev search text:' + prevSearchText );
        
        if(prevSearchText != searchText){
            //get search results
            searchResults = GetSearchResults(searchText);
            $("#local-filterable-listview1").empty();
            prevSearchText = searchText;
        }
        
        liCount = $('input[name="input-' + paramQuestionId + '"]').length;
        fromIdx = liCount;// + 1;
        toIdx = liCount + defaultPageSize + 1;
        //                console.log(' search result#:' + searchResults.length);
        
        for (var idx = fromIdx; idx < toIdx; idx++)
        {
            if (searchResults[idx] != undefined){

                if(idx == fromIdx){
                    //input type='radio'
                    var tempLiText =searchResults[idx].li;
                    tempLiText = tempLiText.replace("input type='radio'", "input type='radio' disabled='disabled'");
                    
                    $("#local-filterable-listview1").append(tempLiText);
                    setTimeout(function(){$('input[type="radio"]:disabled').removeAttr('disabled');}, 500);
                }
                else
                {
                    $("#local-filterable-listview1").append(searchResults[idx].li);
                }
            }
        }
        
        if (toIdx < searchResults.length && $('#liLoadMore').attr('id') == undefined){
            $("#local-filterable-listview1").append("<li id='liLoadMore' data-click='SearchOrg' class='LoadMore'><a data-role='button' data-click='SearchOrg' onclick='SearchOrg' class='AdjustLoadMoreMargin'>Load more search results...</a></li>");
            //                    $('#liLoadMore').removeClass("km-listview-link").bind('click', SearchOrg);
            //associate click event to 'load more' button
            $('#liLoadMore a').kendoMobileButton({click:SearchOrg});
        }
        
        //Display selected response by the side of the question
        $('input[name="input-' + paramQuestionId + '"]').click(function(){
                                                               $('#spanListViewResponse').text( $(this).parent().text());
                                                               listViewResponseId = $(this).attr('id');
                                                               });
    }
    else{
        if(prevSearchText != ""){
            //clear the 'li' items when clearing the search text using backspace key
            $("#local-filterable-listview1").empty();
            prevSearchText = "";
        }
        
        liCount = $('input[name="input-' + paramQuestionId + '"]').length;
        fromIdx = liCount + 1;
        toIdx = liCount + defaultPageSize + 1;
        
        for (var idx = fromIdx; idx < toIdx; idx++)
        {
            if (allOrgs[idx] != undefined){console.log('disabling and enabling');
//                $("#local-filterable-listview1").append(allOrgs[idx].li);
                if(idx == fromIdx){//fix to prevent accidentally checking the first control which replaces the 'Load more' button
                    //input type='radio'
                    var tempLiText =allOrgs[idx].li;
                    tempLiText = tempLiText.replace("input type='radio'", "input type='radio' disabled='disabled'");
                    
                    $("#local-filterable-listview1").append(tempLiText);
                    setTimeout(function(){$('input[type="radio"]:disabled').removeAttr('disabled');}, 500);
                }
                else
                {
                    $("#local-filterable-listview1").append(allOrgs[idx].li);
                }
            }
        }
        
        if (toIdx < totalLi && $('#liLoadMore').attr('id') == undefined){
            $("#local-filterable-listview1").append("<li id='liLoadMore' data-click='LoadMoreOrgs' class='LoadMore'><a data-role='button' data-click='LoadMoreOrgs' onclick='LoadMoreOrgs'>Load more...</a></li>");
            //                    $('#liLoadMore').removeClass("km-listview-link").bind('click', LoadMoreOrgs);
            //associate click event to 'load more' button
            $('#liLoadMore a').kendoMobileButton({click:LoadMoreOrgs});
        }
        //Display selected response by the side of the question
        $('input[name="input-' + paramQuestionId + '"]').click(function(){
                                                               $('#spanListViewResponse').text( $(this).parent().text());
                                                               listViewResponseId = $(this).attr('id');
                                                               });
    }
    
    if(selectedResponse != undefined && selectedResponse != ""){
        RestoreUserSelection(selectedResponse);
    }
}

//Restore passed in user response
function RestoreUserSelection(userResponseText){
    //console.log('restoring user response..' + userResponseText);
    $('input[name="input-' + paramQuestionId + '"]').each(function() {
                                                          if($(this).parent().text() == userResponseText)
                                                          {
                                                          $(this).prop('checked', true);
                                                          }
                                                          });
}

//Performs search on organizations and returns the list of items which contains the searchText
function GetSearchResults(searchText){
    var retResults = [], org;
    //total number of Organizations
    var allOrgs = JSON.parse(localStorage.getItem("allOrgs"));

    for(var idx = 0; idx < allOrgs.length; idx++){
        org = allOrgs[idx].Text.toLowerCase();
        //apply 'contains' filter
        if(org.indexOf(searchText) != -1){
            //add li
            retResults.push(allOrgs[idx]);
        }
     
    }
    
    return retResults;
}

//Function called on keyup event on listview search box
function SearchOrg(e)
{
    var ctl = $('#txtSearchOrg');
    //            console.log('searching ..')
    AddOrgs($(ctl).val());
}

//clear search box text
function ClearSearch(){
    //            console.log('clearing search text..');
    var ctl = $('#txtSearchOrg');
    ctl.val('');
    //$('#spanListViewResponse').text('');
    AddOrgs("");
}

function DisplayResponses(e){
    
    var divid = $("#questions-body");
    
    var divQuestion = $("#divQuestions");
    
    var divResponses = $("#ulResponses");
    
    //add delay before displaying all the response controls to prevent accidental touch on response controls    
    divQuestion.addClass('DisplayHidden');
    
    divResponses.addClass('DisplayHidden');
    
    eventQuestions = JSON.parse(localStorage.getItem("questions"));
    var q_array = new Array();
    if(eventQuestions != null)
    {
        q_array = eventQuestions.Questions;
    }
    
    if(q_array.length == 0)
    {
        //if no questions are configured for the lobby, do a checkin and redirect to ThankYou page
        $('#spanMsgNoQuestion').addClass("DisplayNone");
        $('div.ReasonsContainer span').first().addClass('DisplayNone');
        $('#divContinueButton').addClass('DisplayNone');
        //        setTimeout(function(){
        
        //                   $('#continueBtn').trigger('click');
        //                   app1.navigate("#divThankYouView", "slide:left");
        //                   }, 1200);
        
        setTimeout(function(){$('#continueBtn').trigger('click'); app1.navigate("#divThankYouView", "slide:left");}, 50);
        
    }
    else{
        $('#divContinueButton').removeClass('DisplayNone');
    }
    
    if (q_array.length < 3)
    { //Display one-column layout like display if there're only 2 questions or less. This will be needed for most of the lobby which has single question
        divQuestion.empty();
        window.setTimeout(function(){
                          divResponses.removeClass('DisplayHidden')
                          }, 400);
        
        //reset the response container
        divResponses.empty();
        //Hide the instruction
        $('div.ReasonsContainer span').first().addClass('DisplayNone');
        
        for(var i = 0; i < q_array.length; i++) {
            
            var question = q_array[i];
            $('#questions-body div[data-role="content"]').append('<div class="control reasons-form" id="div_reason_list_' + question.ID +'"><label id="i-4" style="margin-bottom:3%;"><span id="' + question.ID +'_prompt"></span></label></div><div class="control">');
            
            divResponses.append("<li><span class='span-question-text'>" + question.QuestionText + "</span><div><ul id='ul_" + question.ID + "'></ul></div></li>");
            
            var inputtype = GetResponseControlType(question.ResponsesType);//"checkbox";
            var responses = question.Responses;
            
            e.view.content.append($('<ul ></ul>'));
            
            var viewID = e.view.id;
            if(inputtype == "radio" || inputtype == "checkbox")
            {
                e.view.element.find("#ul_" + question.ID).kendoMobileListView({
                                                                              //dataSource: responses,
                                                                              //template: "id: #: id# with text: #: text#",
                                                                              template: "<label>#: Description# <input type='" + inputtype + "' name='input-" + question.ID + "' id='#:ID#' class='textbox-#:OpensTextbox#'/></label>",
                                                                              });
                
                e.view.element.find("#ul_" + question.ID).data("kendoMobileListView").append(responses);
            }
            else if(inputtype == "select")//selectbox
            {
                //Please select/start typing...
                var defaultEntry = JSON.parse('{"ID":-1,"Text":"","Description":"Select","OpensTextbox":false}');
                responses.unshift(defaultEntry);
                $("#ul_" + question.ID).append("<li></li>");
                e.view.element.find("#ul_" + question.ID + " > li").kendoComboBox({
                                                                                  dataTextField: "Text",
                                                                                  dataValueField: "ID",
                                                                                  dataSource: responses,
                                                                                  filter: "contains",
                                                                                  suggest: true,
                                                                                  index: 0
                                                                                  });
                
                $('#ul_8 input').attr('placeholder', 'Please select/start typing an organization...');
            }
            else if(inputtype == "textbox")
            {
                var txtId = responses[0].ID;
                $("#ul_" + question.ID).append('<input type="text" value="" name="' + question.ID + '" id="' +  txtId + '" class="TextBox" />');
            }
            else if(inputtype == "numerictextbox")
            {
                var txtId = responses[0].ID;
                $("#ul_" + question.ID).append('<input type="number" value="" name="' + question.ID + '" id="' +  txtId + '" class="TextBox Borderless" />');
            }
            
            for(var index = 0; index < responses.length; index++){
                
                if(inputtype == "checkbox"){
                    if(responses[index].OpensTextbox == true)
                    {
                        txtId = responses[index].ID;
                        $("input[id='" + txtId + "']").change(function(){
                                                              if(this.checked){
                                                              $("#ul_" + question.ID).after("<div class='OtherDiv'><input type='text' id='" + txtId + "-txtother'/></div>");
                                                              //                $('div.OtherDiv input').val(responseText);
                                                              }
                                                              else{
                                                              $('div.OtherDiv').remove();
                                                              }
                                                              });
                    }
                }
                if(inputtype == "radio"){
                    txtId = responses[index].ID;
                    if(responses[index].OpensTextbox == true){
                        $("input[id='" + txtId + "']").change(function(){
                                                                if(this.checked){
                                                              //if($("#" + txtId).checked){
                                                              //$("#ul_" + question.ID).after("<div class='OtherDiv'><input type='text' id='" + txtId + "-txtother'/></div>");
                                                              $('div.OtherDiv').remove();
                                                              $("#ul_" + question.ID).after("<div class='OtherDiv'><input type='text' id='" + this.id + "-txtother'/></div>");
                                                              //                $('div.OtherDiv input').val(responseText);
                                                              
                                                              
                                                              for(var x = 0 ; x < responses.length ; x++)
                                                              {
                                                              if (responses[x].ReasonTypeID == 2)
                                                                {
                                                              
                                                              $('#' + this.id + '-txtother').attr('placeholder', '(999)999-9999');
                                                              $('#' + this.id + '-txtother').mask('(999)999-9999');
                                                              $('#' + this.id + '-txtother').attr('type', 'tel');
                                                              $('#' + this.id + '-txtother').focus();
                                                                }
                                                              }
                                                            
                                                              }
                                                              else{
                                                              //                          $('div.OtherDiv').remove();
                                                              //$("#" + txtId).remove();
                                                              }
                                                              });
                    }
                    
                    if(responses[index].OpensTextbox == false){
                        //remove Other textbox if any other options are selected
                        $("input[id='" + txtId + "']").change(function(){
                                                              if(this.checked){
                                                              $('div.OtherDiv').remove();
                                                              }
                                                              });
                    }
                }
            }
        }//for
        
        //Continue button
        //        $("#ulResponses").append('<li><a data-role="button" id="continueBtn" class="button">Continue</a></li>');
        //        e.view.element.find("#continueBtn").kendoMobileButton({click: SubmitReasons});
    }
    else{//Build questions and responses if there're more than 2 questions
        //Display the instruction
        divResponses.empty();
        window.setTimeout(function(){
                          divQuestion.removeClass('DisplayHidden')
                          }, 400);
        
        $('div.ReasonsContainer span').first().removeClass('DisplayNone');
        BuildQuestionsAndResponses(q_array, e);
    }
    
    
}

var canReconstructListView = false;
//Method to build questions and response summary where # of questions > 2
function BuildQuestionsAndResponses(q_array, e){
    //alert("BuildQuestionsAndResponses");
    //var e = $("#questions-body");
    var divid = $("#questions-body");
    var divQuestion = $("#divQuestions");
    var divResponses = $("#ulResponses");
    
    var defaultResponseText = "Required";
    //check if questions are already constructed
    var canConstructQuestions = divQuestion.children().length == 0;
    var userResponses = JSON.parse(localStorage.getItem("CollectedResponses"));
    
    //if user response is not available, clear the responses that were already made
    if(userResponses == ""){
        $('div.ResponseContainer span.Response').text(defaultResponseText)
        //clear number fields
        $('div.QuestionAndResponseContainer').find('div input[type="number"]').val("");
        //clear text fields
        $('div.QuestionAndResponseContainer').find('div input[type="text"]').val("");

    }
        console.log('canConstructQuestions..' + canConstructQuestions);
    if (canConstructQuestions){
        //Reset listview control and collected user response
            ResetListViewControls();
        
        var collectedResponses = [], response, responseId;
        
        for(var i = 0; i < q_array.length; i++) {
            var question = q_array[i];
            var responses = question.Responses;
            
            collectedResponses.push({QuestionId: question.ID, ReasonId: "", ReasonDetails: "", OtherReasonId: ""});
            
            var divContainer;
            if(question.IsConditionalQuestion)
            {
                divContainer = '<div id="div'+ question.ID + '" class="QuestionAndResponseContainer invisible">{0}</div>';
            }
            else
            {
                divContainer = '<div id="div'+ question.ID + '" class="QuestionAndResponseContainer">{0}</div>';
            }
            var divQuestionText = '<div class="span8"> <span class="QuestionText"><br/>' + question.QuestionText + '</span> </div>';
            //add ul view here and append here..
            var divResponse = '<div class="span4" id="divResponse'+ question.ID + '"><ul id="ul_' + question.ID + '"></ul></div>';
            if(defaultResponseText == undefined) {defaultResponseText = "";}
            
            divResponse = '<div class="span4 ResponseContainer" id="divResponse'+ question.ID + '" displayListView="false"><span id="spanResponseText' + question.ID + '" class="Response Required">' + defaultResponseText + '</span> <a data-role="button"  id="btnResponseDetail_' + question.ID + '" data-questionid="' + question.ID + '" class="ResponseDetailButton"><span><i class="icon-chevron-sign-right"></i></span></a></div>';
            
            var divQuestionAndResponse = "";
            var inputtype = "checkbox";
            
            if(question.ResponsesType == "1")
            {//radio button
                inputtype = "radio";
                divResponse = '<div class="span4 ResponseContainer" id="divResponse'+ question.ID + '" displayListView="false"><span id="spanResponseText' + question.ID + '" class="Response Required">' + defaultResponseText + '</span> <span class="response-detail-chevron-container"><i class="icon-chevron-sign-right response-detail-chevron"></i></span></div>';
                //alert("divResponse - " + divResponse);
            }
            else if(question.ResponsesType == "2")
            {//checkbox
                inputtype = "checkbox";
                divResponse = '<div class="span4 ResponseContainer" id="divResponse'+ question.ID + '" displayListView="false"><span id="spanResponseText' + question.ID + '" class="Response Required">' + defaultResponseText + '</span> <span class="response-detail-chevron-container"><i class="icon-chevron-sign-right response-detail-chevron"></i></span></div>';
            }
            else if(question.ResponsesType == "3")
            {//combo/select control
                inputtype = "selectbox";
                divResponse = '<div class="span4 ResponseContainer" id="divResponse'+ question.ID + '" displayListView="true"><span id="spanResponseText' + question.ID + '" class="Response Required">' + defaultResponseText + '</span> <span class="response-detail-chevron-container"><i class="icon-chevron-sign-right response-detail-chevron"></i></span></div>';
            }
            else if (question.ResponsesType == "4")
            {//textbox
                inputtype = "textbox";
                responseId = responses[0].ID;
                divResponse = '<div class="span4" id="divResponse'+ question.ID + '" style="padding-top:1.5%;"><input type="text" name="' + question.ID + '" id="' +  responseId + '"  class="TextBox FloatRight Borderless" placeholder="'+ defaultResponseText +'"></input></div>';
                
            }
            else if (question.ResponsesType == "5")
            {//numeric textbox
                inputtype = "textbox";
                responseId = responses[0].ID;
                
                //type number
                divResponse = '<div class="span4" id="divResponse'+ question.ID + '" style="padding-top:1.5%;"><input type="number" name="' + question.ID + '" id="' +  responseId + '" min="1" max="9999" oninput="MaxLengthCheck(this)" class="TextBox FloatRight Borderless" placeholder="'+ defaultResponseText +'"></input></div>';
            }
            else if (question.ResponsesType == "10")
            {
                inputtype = "buttongroup";
                responseId = responses[0].ID;
                
                debugger;
                var buttongroupInside = "";
                for(var j = 0 ; j < responses.length ; j++)
                {
                    var str = '<li id="' +  responses[j].ID + '">' + responses[j].Text + '</li>';
                    buttongroupInside += str;
                }
                
                divResponse = '<div class="span4" id="divResponse'+ question.ID + '" style="padding-top:1.5%;"><ul data-role="buttongroup" data-index="0" id="ul-' + question.ID + '">' + buttongroupInside + '</ul></div>';
                
            }
            
            divQuestionAndResponse = divQuestionText + divResponse;
            //alert("divQuestionAndResponse - " + divQuestionAndResponse);
            
            var searchedDiv = divQuestion;
            var appendedDiv = searchedDiv.append(divContainer.replace('{0}', divQuestionAndResponse));
            //alert(searchedDiv);
            //alert(appendedDiv);
            
            if(question.ResponsesType != "4" && question.ResponsesType != "5" && question.ResponsesType != "10")
            {//Display all the responses for the question if the response type is not textbox/numeric textbox or button group
                $('#divResponse'+ question.ID).click(ShowResponsePage);
            }
            
            if(question.ResponsesType == "5"){
                //allow only numbers on keypress event
                $('#'+ responseId).bind('keypress',PopulateNumbers);
                //disable paste
                $('#'+ responseId).bind("paste",function(e) {
                                        e.preventDefault();
                                        });
            }
            
            
            var responses = question.Responses;
            var viewID = e.view.id;
            //alert(viewID);
            //alert(e.id);
            e.view.content.append($('<ul ></ul>'));
            //alert(e.view);
            //alert(e.view.content);
            
            
            
            
            if(inputtype == "radio" || inputtype == "checkbox" || inputtype == "selectbox")
            {
                //e.view.element.find("#btnResponseDetail_" + question.ID).kendoMobileButton(); //, question:12 | {click: ShowResponsePage}
                //$("#btnResponseDetail_" + question.ID).addClass('ResponseDetailButton');
                //alert(inputtype);
            }
            else if(inputtype == "textbox")
            {
                e.view.element.find("#ul_" + question.ID).kendoMobileListView();
                if (responses[0].ReasonTypeID == 2)
                {
                    
                    $('#' +  responses[0].ID).attr('placeholder', '(999)999-9999');
                    $('#' + responses[0].ID).mask('(999)999-9999');
                    $('#' + responses[0].ID).attr('type', 'tel');
                }

            }
            else if(inputtype == "buttongroup")
            {
                e.view.element.find("#ul-" + question.ID).kendoMobileButtonGroup({
                                                                                 select: function(e){
                                                                                 //console.log(e.sender.element.attr('id'));
                                                                                    var qid = e.sender.element.attr('id');
                                                                                     var rid = "";
                                                                                     var buttons = e.sender.element.children();
                                                                                     for(var i = 0 ; i < buttons.length ; i++)
                                                                                     {
                                                                                        if($(buttons[i]).hasClass("km-state-active"))
                                                                                        {
                                                                                            rid = $(buttons[i]).attr("id");
                                                                                        }
                                                                                     }
                                                                                     HandleConditionalQuestions(qid.match(/\d+$/)[0], rid);
                                                                                 }
                });
            }
        }//for
        
        localStorage.setItem("CollectedResponses", JSON.stringify(collectedResponses));
        //Continue button
        //$("#divQuestions").append('<div id="divContinueButton" class="ContinueButtonPadding"><a data-role="button" id="continueBtn" class="button">Continue</a></div>');
        //e.view.element.find("#continueBtn").kendoMobileButton({click: SubmitReasons});
    }
    else{
        //load responses for the questions
        var question, responseType, responseText;
        //alert(q_array.length);
        for(var i = 0; i < q_array.length; i++) {
            question = q_array[i];
            responseType = GetResponseControlType(question.ResponsesType);
            
            if(responseType != "textbox" && responseType != "checkbox")
            {
                //get response text for the question, if made
                responseText = GetResponseText(question.ID);
                //					console.log("Respones for QuestionId:" + question.ID + " - " + responseText);
                if(responseText != ""){//if user provided a response, remove error highlight
                    $('#divResponse'+ question.ID).removeClass("Error");
                    //populate in the readonly control
                    responseText = responseText.replace("<u>", "").replace("</u>", "");
                    $('#spanResponseText'+ question.ID).text(responseText).removeClass("Required");
                }
                else
                {
                    $('#spanResponseText'+ question.ID).text("Required").addClass("Required");
                }
            }
            else if(responseType == "checkbox"){
                //display number of responses selected
                var collResponses = JSON.parse(localStorage.getItem("CollectedResponses"));
                
                if (collResponses != undefined){
                    //responseId = GetUserResponseId(collResponses, question.ID);
                    responseId = GetUserResponse(question.ID, "Id");
                }
                
                var responseCount = 0;
                
                if (responseId != ""){
                    responseCount = responseId.split(",").length;
                }
                
                if (responseCount > 0){//if user provided a response, remove error highlight
                    $('#spanResponseText'+ question.ID).text(responseCount + " selected").removeClass("Required");
                    $('#divResponse'+ question.ID).removeClass("Error");
                }
                else
                {
                    $('#spanResponseText'+ question.ID).text("Required").addClass("Required");
                }
            }
            else if(responseType == "textbox")
            {console.log('textbox..');
                responseText = $('#txt_' +question.ID).val();
                if(responseText != ""){//if user provided a response, remove error highlight
                    console.log("removing highlight..");
                    $('#txt_' +question.ID).removeClass("Error");
                    $('#txt_' +question.ID).parent().removeClass("Error");
                }
                else{
                    $('#txt_' +question.ID).addClass("Error");
                    $('#txt_' +question.ID).parent().addClass("Error");
                }
            }
        }
    }
    
    //if all the questions are constructed, ListView will also be constructed new
    canReconstructListView = canConstructQuestions;
}

function HandleConditionalQuestions(questionID, selectedResponse)
{
    //alert("Cond Question: " + questionID + " " + selectedResponse);
    
    var questionsObj = JSON.parse(localStorage.getItem("questions"));
    var questions = questionsObj.Questions;
    
    var q;
    for (var idx = 0; idx < questions.length; idx++)
    {
        if(questions[idx].ID == questionID){
            q = questions[idx]; //grab question object
        }
    }
    
    for (var idx = 0 ; idx < q.Responses.length ; idx++)
    {
        for(var condidx = 0 ; condidx < q.Responses[idx].ConditionalQuestions.length ; condidx++)
        {
            if(q.Responses[idx].ID == selectedResponse)
            {
                $("#div" + q.Responses[idx].ConditionalQuestions[condidx].ID).removeClass("invisible");
            }
            else
            {
                $("#div" + q.Responses[idx].ConditionalQuestions[condidx].ID).addClass("invisible");
            }
        }
    }
    
}

//function to check length of input. If greater than 4, first 4 chars are retained
//TODO: To make length check for number textbox generic, maxlength need to be configured in DB
function MaxLengthCheck(ctl, e){
    var maxLength = 4;
    if (ctl.value.length > maxLength)
    {ctl.value = ctl.value.slice(0,maxLength); }
}

//Function to allow only numbers into the text field
function PopulateNumbers(e)
{
    var code = e.keyCode || e.which;
    if(code < 48 || code > 57){
        
        e.preventDefault();
    }
    
    if(code == 13){//if 'return/enter' is hit, trigger blur event to hide the soft keypad on the device
        $(this).blur();
    }
}
//Gets user provided response for the passed in questionId
function GetResponseText(questionId)
{
    var allQuestions, responseId, question, responses, retResponseText;
    responseText = "";
    //user provided responses
    var collResponses = JSON.parse(localStorage.getItem("CollectedResponses"));
    if(eventQuestions == undefined){ //if eventQuestions does not exist, parse it. eventQuestions should have been initialized in DisplayResponses methods
        eventQuestions = JSON.parse(localStorage.getItem("questions"));
    }
    
    allQuestions = eventQuestions.Questions;
    
    if (collResponses != undefined){
        //responseId = GetUserResponseId(collResponses, questionId);
        responseId = GetUserResponse(questionId, "Id");
    }
    
    //loop through all the questions to find the response text for the input questionId
    for (var idx = 0; idx < allQuestions.length; idx++)
    {//loop through all the questions
        question = allQuestions[idx];
        if(question.ID == questionId){
            responses = question.Responses;
            for (var idx1 = 0 ; idx1 < responses.length; idx1++)
            {//loop through all the responses for the passed in question id
                if(responses[idx1].ID == responseId)
                {//if response id matches, get the reponse text
                    retResponseText = responses[idx1].Text;
                    if(responses[idx1].OpensTextbox == true)
                    {
                        //get user entered text
                        retResponseText = GetUserResponse(questionId, "OtherText");
                    }
                    break;
                }
            }
        }
    }
    
    if (retResponseText == undefined) retResponseText = "";
    
    return retResponseText;
}

//Get the user response id(s) fors the question
function GetUserResponseId(collResponses, questionId){
    var retResponseId;
    
    //loop through all the responses that were collected to find the response id that was made
    for(var idx = 0; idx < collResponses.length; idx++)
    {
        if(collResponses[idx].QuestionId == questionId){
            retResponseId = collResponses[idx].ReasonId;
            break;
        }
    }
    
    return retResponseId;
}

//Display view where response for the question will be displayed
function ShowResponsePage(e){
    //Get QuestionId for which responses need to be displayed
    var params = "", canDisplayListView = false;
    
    if(e.button == 0){
        paramQuestionId = $(this).attr('id');
        paramQuestionId = paramQuestionId.replace("divResponse", "");
        canDisplayListView = $(this).attr('displayListView');
    }
    else{
        params = e.button.data();
        //Passing parameter to listview/view is not supported. So, param value is stored in a global variable
        paramQuestionId = params.questionid;
    }
    
    if (canDisplayListView == "true"){
        //load a different view to display response in a listview. Loading the dynamic listview response in 'divCompleteResponseView' had some rendering problems
        //commenting slide to be consistent with all the view transitions
        //Issue: When slide view transition is in place, if the keypad is displayed in the response detai page
        //and when 'Cancel' / 'Done' is touched/clicked, all the buttons stop working. To avoid that, transition is removed
//        app1.navigate("#LocalListView");//, "slide:left");
        app1.navigate("#LocalListView", "slide:left");
    }
    else
    {
        //commenting slide to be consistent with all the view transitions
//        app1.navigate("#divCompleteResponseView");//, "slide:left");
        app1.navigate("#divCompleteResponseView", "slide:left");        
    }
}

//Display responses associated with the question
//This function is used to display responses for a question where response count is more than 2
function DisplayQuestionResponses(e){
    //add delay before displaying all the response controls to prevent accidental touch on response controls
    $('#divCompleteResponseView').addClass('DisplayNone');
    window.setTimeout(function(){
                      $('#divCompleteResponseView').removeClass('DisplayNone')
                      }, 300);
    
    var responseForQuestion, allQuestions, question, questionText, responseControlTypeId, responseControlType;
    
    //$("#DeptNameResponseDetail").text(localStorage.getItem("deptname"));
    if(eventQuestions == undefined){ //if eventQuestions does not exist, parse it. eventQuestions should have been initialized in DisplayResponses methods
        eventQuestions = JSON.parse(localStorage.getItem("questions"));
    }
    
    allQuestions = eventQuestions.Questions;
    
    for (var idx = 0; idx < allQuestions.length; idx++){
        question = allQuestions[idx];
        if(question.ID == paramQuestionId)
        {
            //get responses
            responseForQuestion	= question.Responses;
            responseControlTypeId 	= question.ResponsesType;
            questionText 			= question.QuestionText;
            break;
        }
    }
    
    //Clear the responses that were already loaded
    $('#divCompleteResponseView div.km-listview-wrapper').remove();
    //Remove kendo combobox control alone
    $('ul[id*="_"]').remove();
    //Clear Other reasons control
    $('div.OtherDiv').remove();
    $('#spanQuestionText').text(questionText);
    e.view.content.append('<ul id="ul_' + paramQuestionId + '"></ul>')
    //$('#ResponseDetailContainer').append('<ul id="ul_' + paramQuestionId + '"></ul>');
    
    responseControlType = GetResponseControlType(responseControlTypeId);
    var collResponses = JSON.parse(localStorage.getItem("CollectedResponses"));
    var responseId, responseIdColl, responseText, canDisplayListView = false;
//    console.log('displaying responses..');
    switch(responseControlType)
    {
        case "radio":
        case "checkbox":
            //if a response is already made, mark it
            responseIdColl = GetUserResponse(paramQuestionId, "Id");
            responseText = GetUserResponse(paramQuestionId, "OtherText");
            responseText = responseText.replace(otherPrefix,"");
            
            var liText = "";
            var canCreateOtherTextBox = false;
            var responseIdArr = responseIdColl.split(",");
            var doesQuestionHaveResponse = false;
            
            for (var idx = 0; idx < responseForQuestion.length; idx++)
            {
                //if(responseId != undefined && responseId != "" && responseForQuestion[idx].ID == responseId){
                doesQuestionHaveResponse = CanCheckResponseId(responseForQuestion[idx].ID, responseIdArr);
                if(doesQuestionHaveResponse){
                    liText = "<li><label> " + responseForQuestion[idx].Text + "<input type='" + responseControlType + "' name='input-" + paramQuestionId + "' id='"+ responseForQuestion[idx].ID+ "' checked='checked' class='textbox-"+ responseForQuestion[idx].OpensTextbox+ "'/></label></li>";
                }
                else
                {
                    liText = "<li><label> " + responseForQuestion[idx].Text + "<input type='" + responseControlType + "' name='input-" + paramQuestionId + "' id='"+ responseForQuestion[idx].ID+ "' class='textbox-"+ responseForQuestion[idx].OpensTextbox+ "'/></label></li>";
                }
                
                if (!canCreateOtherTextBox){
                    canCreateOtherTextBox = responseForQuestion[idx].OpensTextbox == true;
                }
                
                $("#ul_" + paramQuestionId).append(liText);
                if(canCreateOtherTextBox && doesQuestionHaveResponse){
                    $("#ul_" + paramQuestionId).after("<div class='OtherDiv'><input type='text' id='" + responseForQuestion[idx].ID + "-txtother'/></div>");
                    $('div.OtherDiv input').val(responseText);
                }
            }
            e.view.element.find("#ul_" + paramQuestionId).kendoMobileListView();
            
            break;
        case "select":
			//This will not be called anymore
            if(false){
				var defaultEntry = JSON.parse('{"ID":-1,"Text":"","Description":"Select","OpensTextbox":false}');
				responseForQuestion.unshift(defaultEntry);
                $("#ul_" + question.ID).append("<li></li>");
				
                e.view.element.find("#ul_" + paramQuestionId + " > li").kendoComboBox({
                                                                                      dataTextField: "Text",
                                                                                      dataValueField: "ID",
                                                                                      dataSource: responseForQuestion,
                                                                                      filter: "contains",
                                                                                      suggest: true,
                                                                                      index: 0
                                                                                      });
                
                $('#ul_' + paramQuestionId +' input').attr('placeholder', 'Please select/start typing an organization...');
                
                var combo = $("#ul_" + paramQuestionId +" li[data-role=combobox]").data("kendoComboBox");
                responseIdColl = GetUserResponse(paramQuestionId, "Id");
                combo.value(responseIdColl);
            }
            else{
                canDisplayListView = true;
            }
            break;
        
    }
    
    
    if($('.textbox-true').attr("type") == "radio"){
        //event to add textbox when 'Other' is clicked
        $('.textbox-true').click(function(){
                                 if($('div.OtherDiv input').attr('id') == undefined)
                                 {
                                 $(this).closest('ul').after("<div class='OtherDiv'><input type='text' id='" + $(this).attr('id') + "-txtother'/></div>")
                                 $('div.OtherDiv input').focus();
                                 }
                                 });
        $('.textbox-false').click(function(){
                                  $('div.OtherDiv').remove();
                                  });
    }
    else if($('.textbox-true').attr("type") == "checkbox"){
        $('.textbox-true').click(function(){
                                 if($('div.OtherDiv input').attr('id') == undefined)
                                 {
                                 if ($('.textbox-true').is(":checked")){
                                 $(this).closest('ul').after("<div class='OtherDiv'><input type='text' id='" + $(this).attr('id') + "-txtother'/></div>")
                                 $('div.OtherDiv input').focus();
                                 }
                                 }
                                 else
                                 {
                                 $('div.OtherDiv').remove();
                                 }
                                 });
    }
    
    if(canDisplayListView){
        app1.navigate("#LocalListView");
    }
    
}

//Get user response - reasonId/reasonText (in case if 'Other' is checked)
function GetUserResponse(paramQuestionId, prop){
    var collResponses = JSON.parse(localStorage.getItem("CollectedResponses"));
    var retPropValue = "";
    
    if(collResponses.length > 0)
    {
        for (var idx = 0; idx < collResponses.length; idx ++){
            if (paramQuestionId == collResponses[idx].QuestionId)
            {
                switch(prop)
                {
                    case "Id":
                        retPropValue = collResponses[idx].ReasonId;
                        break;
                    case "OtherText":
                        retPropValue = collResponses[idx].ReasonDetails;
                        break;
                }
            }
        }
    }
    
    return retPropValue;
}
//Check if the passed in user responseId exist in the list of responses for the question. Returns true if there's a match; else false
function CanCheckResponseId(responseId, responseIdArr){
    var didResponseIdMatch = false;
    
    for (var idx = 0; idx < responseIdArr.length; idx++)
    {
        if(responseId == responseIdArr[idx]){
            didResponseIdMatch = true;
            break;
        }
    }
    
    return didResponseIdMatch;
}

//Gets the control type for the passed in control type Id
function GetResponseControlType(responseControlTypeId)
{
    var responseControlType = "";
    
    switch(responseControlTypeId)
    {
        case 1:
            responseControlType = "radio"
            break;
        case 2:
            responseControlType = "checkbox"
            break;
        case 3:
            responseControlType = "select"
            break;
        case 4:
            responseControlType = "textbox"
            break;
		case 5:
			responseControlType = "numerictextbox";
			break;
        case 6:
            responseControlType = "scale";
            break;
        case 7:
            responseControlType = "dropdown";
            break;
        case 8:
            responseControlType = "toggle";
            break;
    }
    
    return responseControlType;
}

//Get the response type of the question for the passed in questionId
function GetResponseType(questionId)
{
    var retResponseType = "";
    //Get the questions that are loaded
    var questionsObj = JSON.parse(localStorage.getItem("questions"));
    var questions = questionsObj.Questions;
    for (var idx = 0; idx < questions.length; idx++)
    {
        if(questions[idx].ID == questionId){
            retResponseType = GetResponseControlType(questions[idx].ResponsesType);
            break;
        }
    }
    
    return retResponseType;
}

//Function called when 'Cancel' button is clicked from the header
function CancelResponses(e)
{
    //    window.location.href = "login.html";
//    app1.navigate("#", "slide:left");
}

var listViewResponseId = "", userListViewResponseId = "";
//Function called when 'Done' button clicked from the header. Collects the response provided by the user
function CollectResponse(e)
{
    try{
        var canSaveResponse = true;
        var responseType = GetResponseType(paramQuestionId);
        var responseId = "";
        //Other checkbox
        var isOther = false;
        var otherText = "";
        var collResponses = JSON.parse(localStorage.getItem("CollectedResponses"));
        var response, otherCtl, indivResponseId;
        
        for (var idx = 0; idx < collResponses.length; idx++)
        {
            response = collResponses[idx];
            if (response.QuestionId == paramQuestionId)
            {
                switch(responseType)
                {
                    case "radio":
                    case "checkbox":
                        //collect all the responses for checkbox/radio control
                        $('input[name="input-'+ paramQuestionId + '"]:checked').each(function(){
                                                                                     indivResponseId = $(this).attr('id');
                                                                                     responseId = responseId + indivResponseId + ",";
                                                                                     
                                                                                     otherCtl = $('#' + indivResponseId + '.textbox-true:checked');
                                                                                     isOther = otherCtl.attr('id') != undefined;
                                                                                     //console.log('indivresp..'+ indivResponseId + ' isOther..' + isOther + ' otherText..' + otherText)
                                                                                     if(isOther)
                                                                                     {
                                                                                     otherText = $('#'+ indivResponseId +"-txtother").val();
                                                                                     }
                                                                                     });
                        //							console.log('response id before:' + responseId);
                        if (responseId != "")
                        {
                            responseId = responseId.substring(0, responseId.length - 1);
                        }
                        //                            							console.log('response id after:' + responseId);
						break;
                    case "select":
                        responseId = $('input[name="input-' + paramQuestionId + '"]:checked').attr('id');
                        if(responseId == undefined)// && (listViewResponseId != "" || userListViewResponseId != "")){
                        {
                            //                                console.log('collecting response..' + listViewResponseId + " -- " + userListViewResponseId);
                            if(listViewResponseId != undefined && listViewResponseId != "")
                            {
                                //collect user response if the user answered any
                                responseId = listViewResponseId;
                            }
                            else if(userListViewResponseId != undefined && userListViewResponseId != "")
                            {
                                //collect the user response which was already made if the user didn't answer any
                                responseId = userListViewResponseId;
                            }
                            
                            //responseId = listViewResponseId;
                            //                                console.log('chkbox responseId nul.. collecting from listviewresponseId..' + responseId);
                            listViewResponseId = "";
                            
                        }
                        otherText = "";
                        //                            console.log('select checkbox' + responseId);
						break;
                }
                collResponses[idx].ReasonId = responseId;
                //collResponses[idx].ReasonDetails = otherText;
                var otherReasonId = "";
                if(otherText != "" && otherText != undefined){
                    //OtherReasonId
                    collResponses[idx].OtherReasonId = responseId;//otherReasonId;
                    collResponses[idx].ReasonDetails = otherPrefix + otherText.replace(otherPrefix, "");
                }
                else{
                    collResponses[idx].OtherReasonId = otherReasonId;
                    collResponses[idx].ReasonDetails = "";
                }
                
                break;
            }
        }
        
        localStorage.setItem("CollectedResponses", JSON.stringify(collResponses));
        
        if (isOther) //if other checkbox is enabled
        {
            if($.trim(otherText) == '')
            {
                $('div.OtherDiv input').addClass('Error').focus();
                canSaveResponse = false;
            }
            else{
                $('div.OtherDiv input').blur();
            }
        }
        
        var divid = "#questions-body";
            
        //canSaveResponse is false when no reason is provided when "Other" reason is selected
        if (canSaveResponse){
            if(isOther){
                //if Other textbox is displayed, add a 200ms delay before completing the transition with slide effect
                //Note: If Slide transition is not needed, delay is not needed
                setTimeout(function(){ app1.navigate(divid, "slide:left"); }, 200);
            }
            else
            {
                //adding transition effect stops the page from navigating when the keypad is displayed on iOS7
                app1.navigate(divid, "slide:left");
            }
        }
    }
    catch(err){
        console.log('err occured..');
        console.log(err.message);
    }
}

//Gets all the organizations for the questionId.
function getOrganizations(){
    var question, responseForQuestion, questionText;
    
    if(eventQuestions == undefined){ //if eventQuestions does not exist, parse it. eventQuestions should have been initialized in DisplayResponses methods
        eventQuestions = JSON.parse(localStorage.getItem("questions"));
    }
    
    var allQuestions = eventQuestions.Questions;
    
    for (var idx = 0; idx < allQuestions.length; idx++){
        question = allQuestions[idx];
        if(question.ID == paramQuestionId)
        {
            //get responses
            responseForQuestion	= question.Responses;
            //responseControlTypeId 	= question.ResponsesType;
            questionText 			= question.QuestionText;
            break;
        }
    }
    //populate the question text
    $('#spanQuestionText1').text(questionText);
    return responseForQuestion;
}


//method added on SPA integration
function NavigateToReasonSummary(){
    //app1.navigate("#questions-body");//, "slide:left");
    var divid = "#questions-body";
    
    if ($("#questions-body1").is(":visible"))
    {
        divid = "#questions-body1";
    }
    app1.navigate(divid);
}

//Reset user responses to display blank form on reasons page load
function ResetUserResponses(){
    //empty all the questions and responses that were already displayed
    $("#divQuestions").empty();
    $("#divQuestions1").empty();
    //Reset CollectedResponses
    localStorage.setItem("CollectedResponses", JSON.stringify(""));
}
