function SubmitReasons(e)
{
    e.preventDefault();
    
    var obj = JSON.parse(localStorage.getItem("questions"));
    var q_array = obj.Questions;
    
    var errorText = "Please select a response for this question(s)- ";
    var hasError = false;
    for(var i = 0 ; i < q_array.length ; i++)
    {
        var question = q_array[i];
        if(question.ResponsesType == "1" || question.ResponsesType == "2")
        {
            if($('input[name="input-' + question.ID + '"]:checked').val() != "on")
            {
                errorText = errorText + "\n " + question.QuestionText;
                hasError = true;
            }
        }
        else if(question.ResponsesType == "4")
        {
            if($('#' + question.Responses[0].ID).val().length == 0)
            {
                errorText = errorText + "\n " + question.QuestionText;
                hasError = true;
            }
        }
    }
    
    if(hasError)
    {
        showDialog(errorText);
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
                                                        "ReasonDetails": ""
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