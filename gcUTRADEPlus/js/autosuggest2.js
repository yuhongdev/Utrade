/**
 * An autosuggest textbox control.
 * @class
 * @scope public
 */
function AutoSuggestControl(oTextbox /*:HTMLInputElement*/,
                            oProvider /*:SuggestionProvider*/,
			    iLimit /*Added by kenny 2005-08-03: Max number of search result without showing scrolling.*/) {
    
    /**
     * The currently selected suggestions.
     * @scope private
     */   
    this.cur /*:int*/ = -1;

    /**
     * The dropdown list layer.
     * @scope private
     */
    this.layer = null;
    
    /**
     * Suggestion provider for the autosuggest feature.
     * @scope private.
     */
    this.provider /*:SuggestionProvider*/ = oProvider;

    this.ilimit = iLimit;
    
    /**
     * The textbox to capture.
     * @scope private
     */
    this.textbox /*:HTMLInputElement*/ = oTextbox;
    
    //initialize the control
    this.init(); 

    //New Added by kenny : 2005-08-04
    //this.iscroll = 3;
    this.iCurr = 0;
    this.iTop = 0;
    this.iBot = this.ilimit;
    //this.iURow = this.iscroll;  
    //this.iDRow = this.iscroll;  
    this.bPress = 1;	//0: previous, 1: next, 2: mouseover.

    this.getiKeyCode = 0;
    this.scrollHeight = 16;
    this.FontSize = 10;
}

AutoSuggestControl.prototype.setScrollHeight = function (vnHeight) {
    this.scrollHeight = vnHeight;
};

AutoSuggestControl.prototype.setFontSize = function (vnSize) {
    this.FontSize = vnSize;
};

/**
 * Autosuggests one or more suggestions for what the user has typed.
 * If no suggestions are passed in, then no autosuggest occurs.
 * @scope private
 * @param aSuggestions An array of suggestion strings.
 * @param bTypeAhead If the control should provide a type ahead suggestion.
 */
AutoSuggestControl.prototype.autosuggest = function (aSuggestions /*:Array*/,
                                                     bTypeAhead /*:boolean*/) {
    
    //make sure there's at least one suggestion
    if (aSuggestions.length > 0) {
        if (bTypeAhead) {
           this.typeAhead(aSuggestions);
        }
        
        this.showSuggestions(aSuggestions);
    } else {
        this.hideSuggestions();
	//this.textbox.value = "";
    }
};

/**
 * Creates the dropdown layer to display multiple suggestions.
 * @scope private
 */
AutoSuggestControl.prototype.createDropDown = function () {

    var oThis = this;

    //create the layer and assign styles
    this.layer = document.createElement("div");
    this.layer.className = "suggestions";
    this.layer.style.overflow = "auto";		//added by kenny 2005-08-03 to make it scrollable.
    this.layer.style.visibility = "hidden";
    this.layer.style.height = 0;
    this.layer.style.width = 250;
    //when the user clicks on the a suggestion, get the text (innerHTML)
    //and place it into a textbox
    this.layer.onmousedown = 
    this.layer.onmouseup = 
    this.layer.onmouseover = function (oEvent) {
        oEvent = oEvent || window.event;
        oTarget = oEvent.target || oEvent.srcElement;

        if (oEvent.type == "mousedown") {
	    if (oTarget.firstChild.nodeValue != null){	//modify by kenny 2005-08-03. To control div from hiding when click scrollbar.
		oThis.textbox.value = oTarget.firstChild.nodeValue;
                oThis.hideSuggestions();
            }
/*            else{
		oThis.NotRemoveSuggestion();
	    }*/
/*            oThis.textbox.value = oTarget.firstChild.nodeValue;
            if (oThis.textbox.value == 'null'){
		oThis.textbox.value = '';
            }
	    oThis.hideSuggestions();*/
        } else if (oEvent.type == "mouseover") {
	    oThis.bPress = 2;	//New Added by kenny : 2005-08-04
            oThis.highlightSuggestion(oTarget);
        } else {
            oThis.textbox.focus();
        }
    };	
    document.body.appendChild(this.layer);
};

AutoSuggestControl.prototype.ShowRemoveSuggestion = function (){	//Added by kenny on 2005-08-03. To control div from hiding when click scrollbar.
	var iPosX = 0;
	var iPosY = 0;
	var iMinWidth = this.getLeft();
	var iMinHeight = this.getTop();
	var iMaxWidth = parseInt(this.layer.style.width) + iMinWidth;
	var iMaxHeight = parseInt(this.layer.style.height) + iMinHeight + this.textbox.offsetHeight;

	if (document.layers){
		iPosX = e.pageX;
		iPosY = e.pageY;
	}
	else if (document.all){
		iPosX = window.event.x + document.body.scrollLeft;
		iPosY = window.event.y + document.body.scrollTop;
	}
	if (iMaxWidth < iPosX || iMaxHeight < iPosY || iMinWidth > iPosX || iMinHeight > iPosY || this.getiKeyCode == 9){
		if (this.cur < 0)
			this.select(0);
		this.hideSuggestions();
		this.getiKeyCode = 0;
	}
	else
		this.textbox.focus();
};

/**
 * Gets the left coordinate of the textbox.
 * @scope private
 * @return The left coordinate of the textbox in pixels.
 */
AutoSuggestControl.prototype.getLeft = function () /*:int*/ {

    var oNode = this.textbox;
    var iLeft = 0;
    
    while(oNode.tagName != "BODY") {
        iLeft += oNode.offsetLeft;
        oNode = oNode.offsetParent;        
    }
    
    return iLeft;
};

/**
 * Gets the top coordinate of the textbox.
 * @scope private
 * @return The top coordinate of the textbox in pixels.
 */
AutoSuggestControl.prototype.getTop = function () /*:int*/ {

    var oNode = this.textbox;
    var iTop = 0;
    
    while(oNode.tagName != "BODY") {
        iTop += oNode.offsetTop;
        oNode = oNode.offsetParent;
    }
    
    return iTop;
};

/**
 * Handles three keydown events.
 * @scope private
 * @param oEvent The event object for the keydown event.
 */
AutoSuggestControl.prototype.handleKeyDown = function (oEvent /*:Event*/) {

    switch(oEvent.keyCode) {
        case 38: //up arrow
            this.previousSuggestion();
            break;
        case 40: //down arrow 
            this.nextSuggestion();
            break;
        case 13: //enter
            this.hideSuggestions();
            break;
	case 9 : this.getiKeyCode = oEvent.keyCode;	//added by kenny on 2005-09-06. To make tab key in can use.
    }

};

AutoSuggestControl.prototype.select = function (nSelect) {

    var cSuggestionNodes = this.layer.childNodes;

    if (cSuggestionNodes.length > 0 && (this.textbox.value).length > 0) {
        var oNode = cSuggestionNodes[nSelect];
	this.textbox.value = oNode.firstChild.nodeValue;
    }

};

/**
 * Handles keyup events.
 * @scope private
 * @param oEvent The event object for the keyup event.
 */
AutoSuggestControl.prototype.handleKeyUp = function (oEvent /*:Event*/) {

    var iKeyCode = oEvent.keyCode;

    //for backspace (8) and delete (46), shows suggestions without typeahead
    if (iKeyCode == 8 || iKeyCode == 46) {
        this.provider.requestSuggestions(this, false);
        
    //make sure not to interfere with non-character keys
    } else if (iKeyCode < 32 || (iKeyCode >= 33 && iKeyCode < 46) || (iKeyCode >= 112 && iKeyCode <= 123)) {
        //ignore
    } else {
        //request suggestions from the suggestion provider with typeahead
        this.provider.requestSuggestions(this, true);
    }
};

/**
 * Hides the suggestion dropdown.
 * @scope private
 */
AutoSuggestControl.prototype.hideSuggestions = function () {
    this.layer.style.visibility = "hidden";
    if (form.selBoard != undefined)
    	form.selBoard.style.visibility = "visible";	//added by kenny on 2005-09-02. To show back combo box.
    //added by kenny on 2005-09-06. To reset suggestion data.
    this.layer.style.height = 0;
    this.layer.innerHTML = "";

/*  while (this.layer.all.length){
	var oChild=this.layer.children(0);
        this.layer.removeChild(oChild);
    }*/

};

/**
 * Highlights the given node in the suggestions dropdown.
 * @scope private
 * @param oSuggestionNode The node representing a suggestion in the dropdown.
 */
AutoSuggestControl.prototype.highlightSuggestion = function (oSuggestionNode) {
    //alert(this.layer.scrollHeight);
    for (var i=0; i < this.layer.childNodes.length; i++) {
        var oNode = this.layer.childNodes[i];
        if (oNode == oSuggestionNode) {
            oNode.className = "current";
	    //New Added by kenny on 2005-08-04. To control scroll when up & down key is press.
            if(this.bPress == 0){
		if (this.iCurr == this.iTop + 1){
			this.layer.scrollTop -= this.scrollHeight;	//modify by kenny 2005-08-19.make it scroll

			//update iTop and iBot.
			this.iTop -= 1;
			this.iBot -= 1;
			//this.layer.doScroll("up");
			//this.iTop -= this.iURow;
			//this.iBot -= this.iURow;
			//this.iURow = this.switchRow(this.iURow);
			//this.iDRow = this.switchRow(this.iDRow);
			if (this.iTop < 0){	//when this.iCurr is reach top.
				this.iTop = 0;
				this.iCurr = 2;
				this.iBot = this.ilimit;
			}
		}
                this.iCurr--;
	    }
	    if(this.bPress == 1){
	    	if (this.iCurr == this.iBot){ //this.layer.doScroll("scrollbarDown");
			this.layer.scrollTop += this.scrollHeight;	//modify by kenny 2005-08-19.make it scroll
			
			//update iTop and iBot.
			this.iTop += 1;
			this.iBot += 1;
			//this.layer.doScroll("down");
			//this.iTop += this.iDRow;
			//this.iBot += this.iDRow;
			//this.iURow = this.switchRow(this.iURow);
			//this.iDRow = this.switchRow(this.iDRow);
			if (this.iBot > this.layer.childNodes.length){	//when this.iCurr is reach bottom.
				this.iBot = this.layer.childNodes.length;
				this.iCurr = this.iBot - 1;
				this.iTop = this.iBot - this.ilimit;
			}
		}
	        this.iCurr++;
	    }
	    //window.status = this.iTop + " : " + this.iCurr + " : " + this.iBot;
        } else if (oNode.className == "current") {
            oNode.className = "";
        }
    }
	//window.status = this.cur
};
//New Added by kenny on 2005-08-04. To switch the row.
/*
AutoSuggestControl.prototype.switchRow = function (iRow) {
	var iNewRow = 0;

	if (iRow == this.iscroll - 1)
		iNewRow = this.iscroll;
	else if (iRow == this.iscroll)
		iNewRow = this.iscroll - 1;

	return iNewRow;
};*/

/**
 * Initializes the textbox with event handlers for
 * auto suggest functionality.
 * @scope private
 */
AutoSuggestControl.prototype.init = function () {

    //save a reference to this object
    var oThis = this;
    
    //assign the onkeyup event handler
    this.textbox.onkeyup = function (oEvent) {
    
        //check for the proper location of the event object
        if (!oEvent) {
            oEvent = window.event;
        }    
        
        //call the handleKeyUp() method with the event object
        oThis.handleKeyUp(oEvent);
    };
    
    //assign onkeydown event handler
    this.textbox.onkeydown = function (oEvent) {
    
        //check for the proper location of the event object
        if (!oEvent) {
            oEvent = window.event;
        }    
        //call the handleKeyDown() method with the event object
        oThis.handleKeyDown(oEvent);
    };
    
    //assign onblur event handler (hides suggestions)    
    this.textbox.onblur = function () {
	oThis.ShowRemoveSuggestion();	//modify by kenny 2005-08-03. To control div from hiding when click scrollbar.
       	//oThis.hideSuggestions();
    };
    
    //create the suggestions dropdown
    this.createDropDown();
};

/**
 * Highlights the next suggestion in the dropdown and
 * places the suggestion into the textbox.
 * @scope private
 */
AutoSuggestControl.prototype.nextSuggestion = function () {
    var cSuggestionNodes = this.layer.childNodes;

    if (cSuggestionNodes.length > 0 && this.cur < cSuggestionNodes.length-1) {
        var oNode = cSuggestionNodes[++this.cur];
	this.bPress = 1;	//New Added by kenny : 2005-08-04
        this.highlightSuggestion(oNode);
	this.textbox.value = oNode.firstChild.nodeValue;
    }
};

/**
 * Highlights the previous suggestion in the dropdown and
 * places the suggestion into the textbox.
 * @scope private
 */
AutoSuggestControl.prototype.previousSuggestion = function () {
    var cSuggestionNodes = this.layer.childNodes;

    if (cSuggestionNodes.length > 0 && this.cur > 0) {
        var oNode = cSuggestionNodes[--this.cur];
	this.bPress = 0;	//New Added by kenny : 2005-08-04
        this.highlightSuggestion(oNode);
	this.textbox.value = oNode.firstChild.nodeValue;   
    }
};

/**
 * Selects a range of text in the textbox.
 * @scope public
 * @param iStart The start index (base 0) of the selection.
 * @param iLength The number of characters to select.
 */
AutoSuggestControl.prototype.selectRange = function (iStart /*:int*/, iLength /*:int*/) {

    //use text ranges for Internet Explorer
    if (this.textbox.createTextRange) {
        var oRange = this.textbox.createTextRange(); 
        oRange.moveStart("character", iStart); 
        oRange.moveEnd("character", iLength - this.textbox.value.length);      
        oRange.select();
        
    //use setSelectionRange() for Mozilla
    } else if (this.textbox.setSelectionRange) {
        this.textbox.setSelectionRange(iStart, iLength);
    }     

    //set focus back to the textbox
    this.textbox.focus();      
}; 

/**
 * Builds the suggestion layer contents, moves it into position,
 * and displays the layer.
 * @scope private
 * @param aSuggestions An array of suggestions for the control.
 */
AutoSuggestControl.prototype.showSuggestions = function (aSuggestions /*:Array*/) {
    
    var oDiv = null;
    this.layer.innerHTML = "";  //clear contents of the layer

    this.layer.style.height = "0";	//added by kenny on 2005-08-03. To set width of the div.
    this.layer.style.height = "" + ((this.scrollHeight * aSuggestions.length) + 2); //added by kenny on 2005-08-18. fiz bug for div height = 0px on mozilla & netscape.
    if (aSuggestions.length > this.ilimit){
    	this.layer.style.height = "" + ((this.scrollHeight * this.ilimit) + 2);
    }

    for (var i=0; i < aSuggestions.length; i++) {
        oDiv = document.createElement("div");
        oDiv.appendChild(document.createTextNode(aSuggestions[i]));
        this.layer.appendChild(oDiv);
    }

    //this.layer.style.position = "absolute";
    //this.layer.style.zIndex = "10";
    this.layer.style.fontSize = this.FontSize + "pt";
    this.layer.style.left = this.getLeft() + "px";
    this.layer.style.top = (this.getTop()+this.textbox.offsetHeight) + "px";
    this.layer.style.visibility = "visible";
    this.cur = -1;	/*New Added. Always reset this.cur = -1 when new data is filter out. by kenny 2005-08-03*/
    this.iCurr = 0;

    if (form.selBoard != undefined)
    	form.selBoard.style.visibility = "hidden";	//added by kenny on 2005-09-02. To hidden combo box.

    /*Reset Scrolling - kenny on 2005-08-19*/
    this.layer.scrollTop = 0;
    this.iCurr = 0;
    this.iTop = 0;
    this.iBot = this.ilimit;
/*
    for (var i=0; i < aSuggestions.length; i+=2)
	this.layer.doScroll("up");*/
};

/**
 * Inserts a suggestion into the textbox, highlighting the 
 * suggested part of the text.
 * @scope private
 * @param sSuggestion The suggestion for the textbox.
 */
AutoSuggestControl.prototype.typeAhead = function (oSuggestion /*:String*/) {
    var sSuggestion = oSuggestion[0];

    //check for support of typeahead functionality
    if ((this.textbox.createTextRange || this.textbox.setSelectionRange)){
        var iLen = this.textbox.value.length; 
        this.textbox.value = sSuggestion; 
 	if (oSuggestion.length > 1)
 	       this.selectRange(iLen, sSuggestion.length);
    }
};

