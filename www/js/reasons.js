function SubmitReasons(e)
{
    e.preventDefault();
    
    var obj = JSON.parse(localStorage.getItem("questions"));
    var q_array = obj.Questions;
    
    //var errorText = "Please select a response for this question(s)- ";
	var errorText = "Please answer all the required questions";
    var hasError = false;
	var ctl;
	var firstErrCtl;
	
    for(var i = 0 ; i < q_array.length ; i++)
    {		
        var question = q_array[i];
		
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
    
    if(hasError)
    {
        //showDialog(errorText);
		showNativeDialog(errorText);
        return;
    }
    
    var myJsonObj = SetUpIntakeJSONObj();
    
    
    
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
           loading();
           },
           success: function(data){
           //alert(data);
           window.open("thankyou.html", "_self");
           },
           error: function (jqXHR, textStatus, errorThrown) {
           showNativeDialog("An error has occurred. Please try again.");
           //alert("The access key you entered is incorrect. Please click 'Retry' to reenter your access key.");		   
           //alert(jqXHR.responseText + ";\n\n" + textStatus + ";\n\n" + errorThrown);
			showNativeDialog("Error while checking in. Please contact the administrator");
           },
           complete: function(){
           endLoading();
           }
           
           });
}

function SetUpComboBox(questionID)
{
    $('#div_reason_list_' + questionID).append('<div class="ui-widget" style="width:100%;"><select id="combobox_' + questionID + '" class="select-combo-box"></select></div>');
    (function( $ ) {
     $.widget( "custom.combobox", {
              _create: function() {
              this.wrapper = $( "<span>" )
              .addClass( "" )
              .insertAfter( this.element );
              
              this.element.hide();
              this._createAutocomplete();
              this._createShowAllButton();
              },
              
              _createAutocomplete: function() {
              var selected = this.element.children( ":selected" ),
              value = selected.val() ? selected.text() : "";
              
              this.input = $( "<input>" )
              .appendTo( this.wrapper )
              .val( value )
              .attr( "title", "" )
              .addClass( "select-combobox-input" )
              .autocomplete({
                            delay: 0,
                            minLength: 0,
                            source: $.proxy( this, "_source" )
                            })
              .tooltip({
                       tooltipClass: "ui-state-highlight"
                       });
              
              this._on( this.input, {
                       autocompleteselect: function( event, ui ) {
                       ui.item.option.selected = true;
                       this._trigger( "select", event, {
                                     item: ui.item.option
                                     });
                       },
                       
                       autocompletechange: "_removeIfInvalid"
                       });
              },
              
              _createShowAllButton: function() {
              var input = this.input,
              wasOpen = false;
              
              $( "<a>" )
              .attr( "tabIndex", -1 )
              .attr( "title", "" )
              .tooltip()
              .appendTo( this.wrapper )
              .button({
                      icons: {
                      primary: "ui-icon-triangle-1-s"
                      },
                      text: false
                      })
              .removeClass( "ui-corner-all" )
              .addClass( "select-combobox-button" )
              .mousedown(function() {
                         wasOpen = input.autocomplete( "widget" ).is( ":visible" );
                         })
              .click(function() {
                     input.focus();
                     
                     // Close if already visible
                     if ( wasOpen ) {
                     return;
                     }
                     
                     // Pass empty string as value to search for, displaying all results
                     input.autocomplete( "search", "" );
                     });
              },
              
              _source: function( request, response ) {
              var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
              response( this.element.children( "option" ).map(function() {
                                                              var text = $( this ).text();
                                                              if ( this.value && ( !request.term || matcher.test(text) ) )
                                                              return {
                                                              label: text,
                                                              value: text,
                                                              option: this
                                                              };
                                                              }) );
              },
              
              _removeIfInvalid: function( event, ui ) {
              
              // Selected an item, nothing to do
              if ( ui.item ) {
              return;
              }
              
              // Search for a match (case-insensitive)
              var value = this.input.val(),
              valueLowerCase = value.toLowerCase(),
              valid = false;
              this.element.children( "option" ).each(function() {
                                                     if ( $( this ).text().toLowerCase() === valueLowerCase ) {
                                                     this.selected = valid = true;
                                                     return false;
                                                     }
                                                     });
              
              // Found a match, nothing to do
              if ( valid ) {
              return;
              }
              
              // Remove invalid value
              this.input
              .val( "" )
              .attr( "title", value + " didn't match any item" )
              .tooltip( "open" );
              this.element.val( "" );
              this._delay(function() {
                          this.input.tooltip( "close" ).attr( "title", "" );
                          }, 2500 );
              this.input.autocomplete( "instance" ).term = "";
              },
              
              _destroy: function() {
              this.wrapper.remove();
              this.element.show();
              }
              });
     })( jQuery );
    
    $(function() {
      $( "#combobox_" + questionID ).combobox();
      $( "#toggle" ).click(function() {
                           $( "#combobox_" + questionID ).toggle();
                           });
      });
}