// Collates page errors into an ordered list within the section's error message box
function TopErrorMessage() {
	if($("h2.info").children(".errormsgheader").length === 0) {
		$("h2.info").prepend("<div class='errormsgheader'>There is a problem with this section</div><p>Please fix the following:</p>");
	}
	$("h2.info #Message").addClass('aerror');
    $("div.fielderrortext>strong").each(
        function (i) {
			if (i == 0) {
                $("h2.info").html("<div class='errormsgheader'>There is a problem with this section</div><p>Please fix the following:</p>");
            }
		
            if ($(this).find("span").length === 0) {
                $("h2.info").html($("h2.info").html() + "<a href='#aerror" + (i + 1) + "' id='message" + (i + 1) + "' name='message" + (i + 1) + "' class='aerror'>" + (i + 1) + ". " + $(this).html() + "</a><br/>");
                $(this).html("<span id='aerror" + (i + 1) + "'>" + (i + 1) + ". " + $(this).html() + '</span>');
            }
            else {
                $("h2.info").html($("h2.info").html() + "<a href='#aerror" + (i + 1) + "' id='message" + (i + 1) + "' name='message" + (i + 1) + "' class='aerror'>" +  $(this).html() + "</a><br/>");
            }
        });
	$("div.fieldinputcolumn, div.radioinputcolumn, div.fieldmergedcolumn").each(function () {
		if($(this).find(".fielderrortext").length != 0 && !$(this).parents(".fieldrow_err").length) $(this).parent().addClass("fieldrow_err");
	});
}

// Navigates to the top of the page when the error message box is displayed
function ScrollToTopIfSectionErrorShowing() { var oErrorDiv = GetErrorDiv(); if (oErrorDiv) { TopErrorMessage(); var content = oErrorDiv.innerHTML; if (content != '') { if (content.length > 40 && content.substr(0, 40).toLowerCase() == '<p class=\'fields mandatoryfieldmessage\'>') { } else { var bTableInlineAddRow = IsInsideTableInlineRowAddContent(oErrorDiv); if (bTableInlineAddRow) { SetFocusOnSectionError(oErrorDiv) } else { scrollTo(0, 0) } m_nErrorSwitchCounter = 0; setTimeout('ToggleInfoClass();', 150); if (m_bAjaxMode && !bTableInlineAddRow) { SetFocusOnSectionErrorForJAWSAfterDelay() } } } } }; 

// Inserts the Day, Month, Year labels above the date field
function GDSDateChange() {
    $(".datefielddata").find("label").remove();
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
			var inputbox = $('<div class="hodate"><label for="' + elem.name + '">' + label + '</label><input type="text" name="' + elem.name + '" id="' + elem.id + '" onchange="setTimeout(' + currentOnChange + ', 500);" class="' + elem.className + '" maxlength="' + len + '" size="' + len + '"></div>');
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
    $('html').addClass(/*$.fn.details.support ? */'details'/* : 'no-details'*/);

	 $('html.details summary').each(function () {
		if(!$(this).next('.detailwrap').length) {
			$(this).nextAll().wrapAll('<div class="detailwrap"></div>');
			$(this).click(function (e) {
				//if($.fn.details.support) {
					e.preventDefault();

					$(this).siblings('div.detailwrap').slideToggle("fast", function () {
						$(this).parent('details').toggleClass('open');
					});
				//}
			});
		}
    });
	
	$('html.details details').attr('open', '').find('.detailwrap').css('display', 'none');
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
    $('.toolbarbuttons .aj_bottomtoolbar ul').append(exit)

    var back = $('#BTB_BB_Back').parent();
    $(back).css("display", "block");
    $('#BTB_BB_Back').parent().remove();
    $('.toolbarbuttons .aj_bottomtoolbar ul').append(back)
}

// Moves radio button inside it's label for correct styling.
// Also assigns a class to horizontal radio groups, allowing targeted css selection.
function GroupRadioButtons() {
	$(".radiogroup, .radiogroup_err, .checkboxfield, .checkboxfield_err").find('input').each(function(){
		if(!$(this).parent('label').length) {
			$(this).prependTo($(this).next());
		}
	});
	
	$(".radiogroup").not(":has(br)").addClass("radiogroup_horizontal");
	$(".radiogroup_err").not(":has(br)").addClass("radiogroup_horizontal");
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