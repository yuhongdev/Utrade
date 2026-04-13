var N2NNumberFormat = (function(){


	/**
	 * Description <br/>
	 * 
	 * 		return lot size number format
	 * 
	 * @param {string / integer} 	value
	 * 
	 * @return{string}
	 */
	function formatNumber( value ){
		if (isNaN(value)) {
			return null;
		}

		var columnWidth = 99999999;
		
		var textWidth = 0; // _calculateTextWidth(value);
        value = value.toString(10);
        var length = value.length;
        var oldvalue = null;
        
        if (columnWidth != null && textWidth >= columnWidth) {
        	if (length > 3 && length < 8){
            	oldvalue = value;
                value =value/1000;
                value = value.toString(10);
                if (length > 4)
                	value = value.substring(0, length-3);
                else if (length == 4)
                	value = value.substring(0, length-1);
            }
            else if (length >= 8){
            	oldvalue = value;
                value = value/1000000;
                value = value.toString(10);
                value = value.substring(0, length-3);
            }
        }
        value += '';
        var x = value.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        var ret = x1 + x2;
        if (oldvalue != null) {
        	 if (length > 3 && length < 8){
        		 ret += 'K';
        	 }
        	 else if (length >= 8){
        		 ret += 'M';
        	 }
        }
        return ret;
	}


	return {
		formatNumber : formatNumber
	};


})();