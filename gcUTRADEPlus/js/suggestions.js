
/**
 * Provides suggestions for state names (USA).
 * @class
 * @scope public
 */
function N2NSuggestions(sCode) {
	this.states = sCode;
        var aSuggestions = [];
}

/**
 * Request suggestions for the given autosuggest control. 
 * @scope protected
 * @param oAutoSuggestControl The autosuggest control to provide suggestions for.
 */
N2NSuggestions.prototype.requestSuggestions = function (oAutoSuggestControl /*:AutoSuggestControl*/,
                                                          bTypeAhead /*:boolean*/) {
    aSuggestions = [];
    var sTextboxValue = oAutoSuggestControl.textbox.value;
    
    if (sTextboxValue.length > 0){
    
        //convert value in textbox to lowercase
        var sTextboxValueLC = sTextboxValue.toLowerCase();
	var iCount = 0;
	var nBeginIndex = 0;
	var nEndIndex = 0;

	var bIsNAN = isNaN(sTextboxValueLC.substring(0, sTextboxValueLC.length < 5 ? sTextboxValueLC.length : 4));

	if (bIsNAN){	//search by StkName
        	for (var i=0; i < this.states.length; i++) { 

	            //convert state name to lowercase
        	    var sStateLC = this.states[i].toLowerCase();
           
	            //compare the lowercase versions for case-insensitive comparison
	            if (sStateLC.indexOf(sTextboxValueLC) == 0 /*&& iCount < this.ilimit*/) {

	                //add a suggestion using what's already in the textbox to begin it                
	       	        aSuggestions.push(this.states[i]);
 	     	       	//aSuggestions.push(sTextboxValue + this.states[i].substring(sTextboxValue.length));
		    }
		    //iCount++;
	        } 
        }
	else{	//search by StkCode
        	for (var i=0; i < this.states.length; i++) { 

	            //convert state name to lowercase
        	    var sStateLC = this.states[i].toLowerCase();

		    nBeginIndex = sStateLC.indexOf("(");
		    nEndIndex = sStateLC.indexOf(")");

		    if (nBeginIndex >= 0)
			sStateLC = sStateLC.substring(nBeginIndex+1, nEndIndex >= 0 ? nEndIndex : sStateLC.length);

	            //compare the lowercase versions for case-insensitive comparison
	            if (sStateLC.indexOf(sTextboxValueLC) == 0) {

	                //add a suggestion using what's already in the textbox to begin it                
	       	        aSuggestions.push(this.states[i]);
		    }
	        } 
		bTypeAhead = false;
        }

	if (bTypeAhead || aSuggestions.length == 1)
		bTypeAhead = true;
	else
		bTypeAhead = false;

	if (aSuggestions.length == 0 && sTextboxValue.length > 0){
		oAutoSuggestControl.textbox.value = sTextboxValue.substring(0,sTextboxValue.length-1);
		this.requestSuggestions(oAutoSuggestControl, false);
	}
		
    }

    //provide suggestions to the control
    oAutoSuggestControl.autosuggest(aSuggestions, bTypeAhead);
};
