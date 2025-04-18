modelfilestrs['cMcq'] = hereDoc(function(){/*!
<script type="text/javascript">

 
	// These optional properties are currently ignored:	reportTitle, pageLabel, titleLabel, idLabel
	
	// pageChanged & sizeChanged functions are needed in every model file
	// other functions for model should also be in here to avoid conflicts
	var cMcq = new function() {
		// function called every time the page is viewed after it has initially loaded
		this.pageChanged = function() {
			$("#optionHolder input:checked").prop("checked", false);
			$("#confirmBtn").attr("disabled", "disabled");
			$("#feedback").html("");
		}
		
		// function called every time the size of the LO is changed
		this.sizeChanged = function() {
			if (x_browserInfo.mobile == false) {
				var $panel = $("#pageContents .panel");
				$panel.height($x_pageHolder.height() - parseInt($x_pageDiv.css("padding-top")) * 2 - parseInt($panel.css("padding-top")) * 2 - 5);
			}
		}
		
		this.init = function() {
			// panel width and alignment
			var panelWidth = x_currentPageXML.getAttribute("panelWidth"),
				$splitScreen = $("#pageContents .splitScreen"),
				$textHolder = $("#textHolder");
			
			if (panelWidth == "Full") {
				$("#pageContents .panel").appendTo($("#pageContents"));
				$splitScreen.remove();
			} else {
				$textHolder.html(x_addLineBreaks(x_currentPageXML.getAttribute("instruction")));
				var textAlign = x_currentPageXML.getAttribute("align");
				if (textAlign != "Right") {
					if (panelWidth == "Small") {
						$splitScreen.addClass("large");
					} else if (panelWidth == "Large") {
						$splitScreen.addClass("small");
					} else {
						$splitScreen.addClass("medium");
					}
				} else {
					$textHolder
						.removeClass("left")
						.addClass("right")
						.appendTo($splitScreen);
					$("#infoHolder")
						.removeClass("right")
						.addClass("left");
					if (panelWidth == "Small") {
						$splitScreen.addClass("medium");
					} else if (panelWidth == "Large") {
						$splitScreen.addClass("xlarge");
					} else {
						$splitScreen.addClass("large");
					}
				}
			}
			
			// set up question and answer options
			$("#question").html(x_addLineBreaks(x_currentPageXML.getAttribute("prompt")));
			
			var	$optionHolder = $("#optionHolder"),
				$option = $optionHolder.find("input"),
				$optionTxt = $optionHolder.find(".optionTxt");
			
			if ($(x_currentPageXML).children().length == 0) {
				$optionHolder.html('<span class="alert">' + x_getLangInfo(x_languageData.find("errorQuestions")[0], "noA", "No answer options have been added") + '</span>');
				$("#confirmBtn").hide();
			} else {
				$(x_currentPageXML).children().each(function(i) {
					var $thisOption, $thisOptionTxt;
					if (i != 0) {
						$thisOption = $option.clone().appendTo($optionHolder);
						$thisOptionTxt = $optionTxt.clone().appendTo($optionHolder);
					} else {
						$thisOption = $option;
						$thisOptionTxt = $optionTxt;
					}
					
					var optTxt = this.getAttribute("text");
					if (x_params.authorSupport == "true") {
						optTxt += ' <span class="alert">[' + this.getAttribute("destination") + ']</span>';
					}
					
					$thisOption
						.data("id", this.getAttribute("destination"))
						.attr({
							"value"	:optTxt,
							"id"	:"option" + i
							})
						.change(function() {
							$("#confirmBtn").removeAttr("disabled", "disabled");
							$("#feedback").html("");
						});
					
					$thisOptionTxt
						.attr("for", "option" + i)
						.html(x_addLineBreaks(optTxt));
				});
				
				
				// text to display in developer mode if destination page not found / set
				var devTxt = [];
				if (x_params.authorSupport == "true") {
					devTxt.notFound = x_currentPageXML.getAttribute("notFoundMessage");
					if (devTxt.notFound == undefined) {
						devTxt.notFound = "could not be found in this project.";
					}
					devTxt.notSet = x_currentPageXML.getAttribute("notSetMessage");
					if (devTxt.notSet == undefined) {
						devTxt.notSet = "A destination page has not been set for this connection";
					}
				}
				
				var confirmBtnTxt = x_currentPageXML.getAttribute("confirmBtnTxt");
				if (confirmBtnTxt == undefined) {
					confirmBtnTxt = "Check";
				}
				
				$("#confirmBtn")
					.button({ label: confirmBtnTxt })
					.attr("disabled", "disabled")
					.click(function() {
						var destinationID = $("#optionHolder input:checked").data("id");
						if (destinationID == "") { // destination not set
							if (x_params.authorSupport == "true") {
								$("#feedback").html(devTxt.notSet);
							}
							
						} else if (x_lookupPage("linkID", destinationID) == null) { // destination not found
							if (x_params.authorSupport == "true") {
								$("#feedback").html(destinationID + " " + devTxt.notFound);
							}
							
						} else { // go to destination page
							x_navigateToPage(false, {type:"linkID", ID:destinationID});
						}
						
						$(this).hide().show(); // hack to take care of IEs inconsistent handling of clicks
					});
			}
			
			this.sizeChanged();
			
			if (x_params.authorSupport != "true") {
				$("#feedback").remove();
			}
			
			x_pageLoaded();
		}
	}
	
	cMcq.init();
	
</script>


<div id="pageContents">

	<div class="splitScreen">

		<div id="textHolder" class="left" tabindex="1"></div>

		<div id="infoHolder" class="right">
			<div class="panel">
				<h3 id="question"></h3>
				<div id="optionHolder">
					<input type="radio" name="option" />
					<label class="optionTxt"></label>
				</div>
				<button id="confirmBtn"></button>
				<div id="feedback" class="alert"></div>
			</div>
		</div>

	</div>

</div>

*/});