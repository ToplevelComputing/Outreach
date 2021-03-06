﻿// Collates page errors into an ordered list within the section's error message box
function TopErrorMessage() {
    var haslist = true;

    if ($("div.fielderrortext>strong").is('*')) {
        haslist = true;
    }
    else {
        haslist = false;
    }
    var showMoreClosingCode = "";
    var errorHTML = "";
	
	if($("h2.info").children(".errormsgheader").length === 0 && $("h2.info a").children(".errormsgheader").length === 0) {
		$("h2.info a").prepend("<span class='errormsgheader'>There is a problem with this section</span><span class='errormsgsubheader'>Please fix the following:</span>");
	}
	$("h2.info #Message").addClass('aerror');
    $("#aj_bodydiv div.fielderrortext>strong, #tldialogouter div.fielderrortext>strong").each(
        function (i) {
			if (i == 0) {
                $("h2.info").html("<span class='errormsgheader'>There is a problem with this section</span><span class='errormsgsubheader'>Please fix the following:</span>");
            }
			var inlineErrorText = $(this).html();
			if (inlineErrorText.indexOf("This is a required field and must be completed.") != -1) {
                var curName = $(this).closest("div.fielderrortext").attr("id").replace("err_", "").replace(":", "\\:").replace("'", "\\'");

				if (typeof (reqFieldNames[curName]) !== "undefined" && reqFieldNames[curName] !== "" && reqFieldNames[curName] != null) {
					inlineErrorText = inlineErrorText.replace("This is a required field and must be completed.", "You must complete the '" + reqFieldNames[curName] + "' field.");
					$(this).html(inlineErrorText);
				}
            }
		
			if (i == 5) {
                errorHTML += "<div class=\"hiddenerrors\">";
                showMoreClosingCode = "</div><div style=\"text-align:right\"><button type=\"button\" id=\"showmorebutton__link\" class=\"morelink\" onclick=\"ToggleExtraErrors();\">More</button></div>";
            }
			
			if ($(this).find("span").length === 0) {
				$(this).html("<span id='aerror" + (i + 1) + "'>" + (i + 1) + ". " + $(this).html() + '</span>');
            }
			
			if (i >= 5) {
				errorHTML += "<a href='#aerror" + (i + 1) + "' id='message" + (i + 1) + "' name='message" + (i + 1) + "' class='aerror' onclick=\"ScrollToFieldInError(event, 'aerror" + (i + 1) + "');\">" + $(this).find("span").html() + "</a><br/>";
			} else {
                $("h2.info").html($("h2.info").html() + "<a href='#aerror" + (i + 1) + "' id='message" + (i + 1) + "' name='message" + (i + 1) + "' class='aerror' onclick=\"ScrollToFieldInError(event, 'aerror" + (i + 1) + "');\">" + $(this).find("span").html() + "</a><br/>");
			}
        });
	if (haslist === true) {
        $("h2.info").append(errorHTML + showMoreClosingCode);
        $("div.fieldinputcolumn, div.radioinputcolumn, div.fieldmergedcolumn").each(function () {
            if ($(this).find(".fielderrortext").length != 0 && !$(this).parents(".fieldrow_err").length) $(this).parent().addClass("fieldrow_err");
        });
    }
}

function ScrollToFieldInError(e, errorId){
	e.preventDefault();
	var fieldInError;
	var fieldId = "";
	
	try {
		fieldInError = $('#' + errorId).parents('.fielderrortext')[0].id.replace("err_","");
		// Attempt to locate field on page (ID varies for text/date/radio/etc. fields.)
		if($("#s2id_F_" + fieldInError).length > 0) {
			// Multi-select listbox
			fieldId = "s2id_F_" + fieldInError;
		} else if($("#F_" + fieldInError).length > 0) {
			// Text/dropdown/listbox field
			fieldId = "F_" + fieldInError;
		} else if ($("#FD_" + fieldInError).length > 0) {
			// Date field
			fieldId = "FD_" + fieldInError;
		}  else if ($("#FH_" + fieldInError).length > 0) {
			// Time
			fieldId = "FH_" + fieldInError;
		} else if ($("#FLR_0_" + fieldInError).length > 0) {
			// Radio group
			fieldId = "FLR_0_" + fieldInError;
		}
	} catch(e) {
		console.log("Could not focus on erroneous field, potentially unhandled field type.");
	}
	// Scroll to error and move focus to erroneous field.
	// If we couldn't locate the erroneous field id, we don't attempt to move focus to it.
    $('html,body').animate({scrollTop: $("#"+errorId).offset().top}, 'fast', 'linear', function() {if(fieldId != "") $("#"+fieldId).focus();});
}

function ToggleExtraErrors() {
    if ($("#showmorebutton__link").html() == "More") {
        $(".hiddenerrors").show();
        $("#showmorebutton__link").html("Less");
    } else {
        $(".hiddenerrors").hide();
        $("#showmorebutton__link").html("More");
    }
}

// Navigates to the top of the page when the error message box is displayed
function ScrollToTopIfSectionErrorShowing() { 
	var oErrorDiv = GetErrorDiv(); 
	if (oErrorDiv) { 
		TopErrorMessage(); 
		var content = oErrorDiv.innerHTML; 
		if (content != '') { 
			if (content.length > 40 && content.substr(0, 40).toLowerCase() == '<p class=\'fields mandatoryfieldmessage\'>') { 
			} else { 
				if ($("#tldialogouter").find(oErrorDiv).length === 0) {
					scrollTo(0, 0);
				} else { 
					scrollTo(0, $("#tldialogouter #aj_formmessage").position().top);
				}
			}
		}
	}
}

// Moves focus to the user name field if on the logon dialog
function FocusOnUserNameIfLogonDialog() {
	if($(".LogonDialog #F_UserCode").length > 0) $(".LogonDialog #F_UserCode").focus();
}

// Inserts the Day, Month, Year labels above the date field
function GDSDateChange() {
    $(".datefielddata").find("> label").remove();
    $(".datefielddata").find("select, input").each(function (index, elem) {
		if(!$(elem).parent('.hodate').length) {
			var label;
			var len = "2";
			if (index % 3 === 0) {
				label = "Day";
			}
			else if (index % 3 === 1) {
				label = "Month";
			}
			else if (index % 3 === 2) {
				label = "Year";
				len = "4"
			}

			var currentId = elem.id;
			var currentClass = elem.className;
			var currentName = elem.name;
			var currentValue = elem.value;
			var currentOnChange = elem.attributes["onchange"].value;
			var inputbox;
			if (currentName.substring(0,3) == "FD_") {
				inputbox = $('<div class="hodate"><span>' + label + '</span><input type="text" name="' + elem.name + '" id="' + elem.id + '" onchange="' + currentOnChange + '" class="' + elem.className + '" maxlength="' + len + '" size="' + len + '"></div>'); 
			} else { 
				inputbox = $('<div class="hodate"><label for="' + elem.name + '">' + label + '</label><input type="text" name="' + elem.name + '" id="' + elem.id + '" onchange="' + currentOnChange + '" class="' + elem.className + '" maxlength="' + len + '" size="' + len + '"></div>'); 
			}
			$(elem).replaceWith(inputbox);
			$("#" + currentId).val(currentValue);
		}
    });


}

// Animates headings that are hidden/shown via heading conditions
function SlideShow()
{
    for (var prop in aoConds) {
        aoConds[prop].doHide = function () {
            var elem = document.getElementById(this.m_sName);
            if (!elem) {
                 return;
            }
            if (!this.m_bValue) {
                $(elem).slideDown("fast");
            }
            else {
                $(elem).slideUp("fast");
            }
            var otemp = elem.parentNode;
            var oparentelem = otemp.parentNode;
            var oParentFrameSet = this.findParentFrameSet(oparentelem);
            if (oparentelem && oParentFrameSet) {
                var bHasDisplay = false;
                var a = oparentelem.childNodes;
                for (var j = 0; j < a.length; j++) {
                    var sTag = a.item(j).tagName;
                    if (sTag && sTag.toLowerCase() == 'div') {
                        var achildnodes = a.item(j).childNodes;
                        for (var i = 0; i < achildnodes.length; i++) {
                            var achild = achildnodes.item(i);
                            var sChildTag = achild.tagName;
                            if (sChildTag && sChildTag.toLowerCase() == 'div') {
                                var sStyle = achild.style.display;
                                if (sStyle != "none") {
                                    bHasDisplay = true;
                                    break;
                                }
                            }
                        }
                    }
                }

                if (bHasDisplay) {
                    $(oParentFrameSet).slideDown("fast");
                }
                else {
                    $(oParentFrameSet).slideUp("fast");
                }
            }
            if (!this.m_bValue) {
                var headingHelpSpan = document.getElementById("TL_ajaxreplace_help_" + this.m_sName);
                if (headingHelpSpan) {
                    PositionGroupHelpIconIfNecessary(headingHelpSpan);
                }
            }
        };

    }
}

// Initialises any custom expandable help items (drop, guidance, help)
function InitDetailsSummary() {
    $('html').addClass('detailscompatible');
	
	$('html.detailscompatible .details span').each(function () {
		if(!$(this).hasClass('screenreader')) $(this).addClass('hiddenhelpcontainer');
	});
	
	$('html.detailscompatible .summary, html.detailscompatible .helpsummary').each(function () {
		if(!$(this).next('br').next('.detailwrap').length) {
			$(this).next('br').nextAll().wrapAll('<span class="detailwrap"></span>');
			$(this).parent('.details').toggleClass('open');
			$(this).prop('disabled', false);
			$(this).click(function (e) {
				e.preventDefault();
				$(this).siblings('span.detailwrap').slideToggle("fast", function () {
					$(this).parent('.details').toggleClass('open');
					$(this).children('span').each(function () {
						if(!$(this).hasClass('screenreader')) $(this).toggleClass('hiddenhelpcontainer');
					});
				});
			});
			$(this).keyup(function (e) {
				e.preventDefault();
				if (event.keyCode == '32') {
					$(this).next('br').siblings('span.detailwrap').slideToggle("fast", function () {
						$(this).parent('.details').toggleClass('open');
					});
				}
			});
		}
    });
	
	$('html.detailscompatible .details').find('.detailwrap').css('display', 'none');
} 

// Scrolls to a dialog box on the page if necessary.
function scrollToDialog(selector, time, verticalOffset) {
    time = typeof (time) != 'undefined' ? time : 1000;
    verticalOffset = typeof (verticalOffset) != 'undefined' ? verticalOffset : 0;
    element = $(selector);
    offset = element.offset();
    offsetTop = offset.top + verticalOffset;
    $('html, body').animate({
        scrollTop: offsetTop
    }, time);
}

// Adds a section class to the summary table allowing styling of the 
// section headers in the table.
function Summary() {
    $('#aj_htmltable_Summary td[colspan="5"]').parent().addClass("section");
}

// Ensures the bottom navigation is ordered: Next/Continue, Exit, Back
// Important for tabbing order.
function ReorderBottom() {
    var exit = $('#BTB_BB_Exit').parent();
    $('#BTB_BB_Exit').parent().remove();
    $('.toolbarbuttons .aj_bottomtoolbar ul').append(exit);

   var back = $('#BTB_BB_Back').parent();
    $(back).addClass("newlinebutton");
    $('#BTB_BB_Back').parent().remove();
    $('.toolbarbuttons .aj_bottomtoolbar ul').append(back);
	
	var next = $('#BTB_BB_Next').parent();
	$('#BTB_BB_Next').parent().remove();
	$('.toolbarbuttons .aj_bottomtoolbar ul').prepend(next);
}


// Moves radio button inside it's label for correct styling.
// Also assigns a class to horizontal radio groups, allowing targeted css selection.
function GroupRadioButtons() {
	$(".radiogroup, .radiogroup_err").find('input').each(function(){
		if(!$(this).parent('label').length) {
			$(this).prependTo($(this).next());
		}
	});
	
	$(".radiogroup").not(":has(br)").addClass("radiogroup_horizontal");
	$(".radiogroup_err").not(":has(br)").addClass("radiogroup_horizontal");
}

function GroupCheckboxes() {
	$(".checkboxfield, .checkboxfield_err").find('input').each(function() {
		if(!$(this).parent('label').length && $("label[for="+ $(this).attr('id') +"]").length) {
			$(this).prependTo( $("label[for="+ $(this).attr('id') +"]") );
		}
	});
}

// Assigns classes to input and merged columns with radio fields, to allow 
// targeted css selection.
function FixRadioFields() {
	$(".fieldinputcolumn").has(".fieldwidthmodifierradio").addClass("radioinputcolumn");
	$(".fieldmergedcolumn").has(".fieldwidthmodifierradio").addClass("radiomergedcolumn");
}

// Handles the styling of radio button & checkbox labels
// when checked.
function CheckedLabel(toggledInput) {
	toggledInput.parent("label").addClass("checked");
}

// Handles the styling of radio button & checkbox labels
// when unchecked.
function RemoveLabelChecked(toggledInput) {	
	toggledInput.parent("label").removeClass("checked");
}

// Handles custom help text for standard captions (on the left, instead of above)
// Note: Only 'micro' and 'text' custom help items will work for standard captions.
function StandardCaptionMicroHelp() {
	$(".fieldcaptioncolumn").find(".help").each(function() {
		$(this).children().hide();
	});
	$(".fieldcaptioncolumn").find(".standardcaptionhelptext").each(function() {
		var inputField = $(this).closest('.fieldrow').find('.fieldwidthmodifier, .fieldwidthmodifierradio');
		$(this).prependTo(inputField);
		$(this).show();
	});
	$(".fieldcaptioncolumn").find(".standardcaption, .optional").each(function() {
		$(this).show();
	});
}

// PDF download button handler
function PdfDownload() {
    if ($(".PDFOptions input[name='BB_YesBtn']").is('*')) {
        setTimeout(PdfClose, 2500);
    }
}

// PDF close button handler
function PdfClose() {
    $(".PDFOptions input[name='BB_NoBtn']").click();
}

function SubmitSummaryLink(summaryactionlink) {
	m_sLastButtonPressed = summaryactionlink;
	if ((typeof(sendAjaxRequest) == "undefined") || sendAjaxRequest()) document.forms[TLFormName].submit();
	return false;
}