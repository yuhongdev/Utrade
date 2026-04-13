/*
 * getDateInstance
 * _getDateFromStr
 * 
 * formatNumber
 * formatNumberLot
 * 
 * procStringValue
 * 
 * procPriceValue
 * 
 * procChangeValue		
 * procChangePercValue
 * procPrfChangeValue //v1.3.33.1
 * procPrfChangePercValue //v1.3.33.1
 * procPrfCodeExtraction //susan 20130412-sw
 * procOptionType //20130805-shuwen
 * procOptionStyle //20130805-shuwen
 * checkOverflow	//20140721- shuwen
 */

var formatutils = (function() {
	
	
	/**
	 * This method returns a Date object from a given string parameter.
	 * 
	 * @param {String} value to be converted to a Date object.
	 * @return Date object.
	 */
	function getDateInstance(value) {
		var o = _getDateFromStr(value);

		var d = new Date();
		var year = d.getFullYear();
		var month = d.getMonth();
		var day = d.getDate();

		var a = new Date(year, month, day, o.hour, o.minute, o.second);
		return a;
	}
	
	function formatLot(value, dataObject) { // v1.3.34.68
		var lotsize = dataObject[fieldLotSize];
		if (lotsize == null){
			lotsize = dataObject["LotSize"];
		}
    	if (!isNaN(value) && !isNaN(lotsize)) {
    		if (value != 0 && lotsize > 0)
    			value = value / lotsize;
    	}
		return value;
    }
	/**
	 * This method return an object from a string paramater.
	 * 
	 * @param {String} value
	 * The string value to be converted to an object.
	 * @return object with hour, minute, second.
	 */
	function _getDateFromStr(value) {
		var hours;
        var minutes;
        var seconds;

		var hour;
		var minute;
		var second;

		var o = {hour: 0, minute: 0, second: 0};

        if (value == 0) {
            return o;
        }
		
		else if (value.length == 7) {
        	hours = value.substring(1, 3);
            minutes = value.substring(3, 5);
            seconds = value.substring(5, 7);

			hour = parseInt(hours);
			minute = parseInt(minutes);
			second = parseInt(seconds);

            return {hour: hour, minute: minute, second: second};
        }
		
		else if (value.length == 6) {
            hours = value.substring(0, 2);
            minutes = value.substring(2, 4);
            seconds = value.substring(4, 6);

			hour = parseInt(hours);
			minute = parseInt(minutes);
			second = parseInt(seconds);

            return {hour: hour, minute: minute, second: second};
        }
		
		else if (value.length == 5) {
            hours = '0' + value.substring(0, 1);
            minutes = value.substring(1, 3);
            seconds = value.substring(3, 5);

			hour = parseInt(hours);
			minute = parseInt(minutes);
			second = parseInt(seconds);

            return {hour: hour, minute: minute, second: second};
        }

        return o;
	}

	/**
	 * Description <br/>
	 * 
	 * 		return date format by string
	 * 
	 * @param {string} value
	 * @return {string} 
	 */
	function procDateValue(value) {
		var hours;
        var minutes;
        var seconds;

		var hour;
		var minute;
		var second;

		var returnValue = "";
		
        if (value == 0) {
        	returnValue = "";
        }
		
		else if (value.length == 7) {
        	hours = value.substring(1, 3);
            minutes = value.substring(3, 5);
            seconds = value.substring(5, 7);

			hour = parseInt(hours);
			minute = parseInt(minutes);
			second = parseInt(seconds);

			returnValue = hours + ":" + minutes + ":" + seconds;
        }
		
		else if (value.length == 6) {
            hours = value.substring(0, 2);
            minutes = value.substring(2, 4);
            seconds = value.substring(4, 6);

			hour = parseInt(hours);
			minute = parseInt(minutes);
			second = parseInt(seconds);

			returnValue = hours + ":" + minutes + ":" + seconds;
        }
		
		else if (value.length == 5) {
            hours = '0' + value.substring(0, 1);
            minutes = value.substring(1, 3);
            seconds = value.substring(3, 5);

			hour = parseInt(hours);
			minute = parseInt(minutes);
			second = parseInt(seconds);

			returnValue = hours + ":" + minutes + ":" + seconds;
        }

        return returnValue;
	}

	
	
    /**
     * Description <br/>
     * 
     * 		return number format
     * 
     * @param {string / integer}	value
     * @param {integer}                 columnWidth
     * 
     * @return {string}
     */
    function _formatNumber(value, columnWidth) { // not used anymore
        var textWidth = 0;
        value = value.toString(10);
        var length = value.length;
        var oldvalue = null;

        if (columnWidth != null && textWidth >= columnWidth) {
            if (length > 3 && length < 8) {
                oldvalue = value;
                value = value / 1000;
                value = value.toString(10);
                if (length > 4)
                    value = value.substring(0, length - 3);
                else if (length == 4)
                    value = value.substring(0, length - 1);
            }
            else if (length >= 8) {
                oldvalue = value;
                value = value / 1000000;
                value = value.toString(10);
                value = value.substring(0, length - 3);
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
            if (length > 3 && length < 8) {
                ret += 'K';
            }
            else if (length >= 8) {
                ret += 'M';
            }
        }

        return ret;
    }
    
    function formatNumber(value, colWidth, forceRound, dec, optionalDec, roundK, roundDec) {
        if (isNaN(value)) {
            return value;
        }

        if (dec) {
            value = parseFloat(value).toFixed(dec);
            if (optionalDec) {
                value = parseFloat(value);
            }
        }

        var valStr = _formatNum(value);
        var roundQty = forceRound || false;

        if (!forceRound && (N2N_CONFIG.autoQtyRound && colWidth)) {
            var textWidth = fmx.getWidth(valStr) + 10; // leaves some padding
            roundQty = textWidth > colWidth;
        }

        if (roundQty) {
            if (N2N_CONFIG.round10) {
                valStr = _round10(value);
            } else {
                if (roundDec == null) {
                    roundDec = 2; // default to 2
                }
                var roundDecStr = '0,000' + jsutil.getExtNumFormat(roundDec, true);

                if (Math.abs(value) >= 1.0e+9) { // billions
                    valStr = Ext.util.Format.number(value / 1.0e+9, roundDecStr) + 'B';
                } else if (Math.abs(value) >= 1.0e+6) { // millions
                    valStr = Ext.util.Format.number(value / 1.0e+6, roundDecStr) + 'M';
                } else if (roundK) {
                    valStr = Ext.util.Format.number(value / 1.0e+3, roundDecStr) + 'K';
                } else {
                    valStr = Ext.util.Format.number(value, '0,000');
                }
            }
        }

        return valStr;
    }
    
    function _round10(value, decNum) {
        var valStr = '';
        var decStr = '0,000';
        if (decNum > 0) {
            decStr += '.';
            for (var i = 0; i < decNum; i++) {
                decStr += '0';
            }
        }
        
        if (Math.abs(value) >= 1.0e+10) { // 10 billions
            valStr = Ext.util.Format.number(value / 1.0e+9, decStr) + 'B';
        } else if (Math.abs(value) >= 1.0e+7) { // 10 millions
            valStr = Ext.util.Format.number(value / 1.0e+6, decStr) + 'M';
        } else if (Math.abs(value) >= 1.0e+4) { // 10 thouands
            valStr = Ext.util.Format.number(value / 1.0e+3, decStr) + 'K';
        } else {
            valStr = Ext.util.Format.number(value, '0,000');
        }

        return valStr;
    }
    
    function _formatRound(value, noComma) {
        var valStr = '';

        if (isNaN(value)) {
            return valStr;
        }

        var numFormat = '0,000.##';
        var numFormat2 = '0,000';
        if (noComma) {
            numFormat = '0.##';
            numFormat2 = '0';
        }

        if (Math.abs(value) >= 1.0e+9) { // billions
            valStr = Ext.util.Format.number(value / 1.0e+9, numFormat) + 'B';
        } else if (Math.abs(value) >= 1.0e+6) { // millions
            valStr = Ext.util.Format.number(value / 1.0e+6, numFormat) + 'M';
        } else if (Math.abs(value) >= 1.0e+3) { // thousands
            valStr = Ext.util.Format.number(value / 1.0e+3, numFormat) + 'K';
        } else {
            valStr = Ext.util.Format.number(value, numFormat2);
        }

        return valStr;
    }
    
    function _formatNum(num) {
        num = num.toString(10);
        var x = num.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }

        return x1 + x2;
    }
	
    // shu wen 02/05/2013
    function formatNumberLot(value, k, colWidth) {
        /*
         if (N2N_CONFIG.autoQtyRound) {
         return formatNumber(value, colWidth);
         } else {
         */
        if (isNaN(value)) {
            return null;
        }
        k = k == null ? true : k;
        if (value >= 1000000000) {
            return (value / 1000000000).toFixed(2) + 'B';
        }
        if (value >= 1000000) {
            return (value / 1000000).toFixed(2) + 'M';
        }
        if (value >= 1000) {
            if (k)
                return (value / 1000).toFixed(2) + 'K';
            else
                return formatNumber(value);
        }
        return value;
        // }
    }
	
	// shu wen 02/05/2013
	// replaced with new method to convert to K,M,G

        /**
	 * Description <br/>
	 * 
	 * 		return lot size number format
	 * 
	 * @param {string / integer} 	value
	 * 
	 * @return{string}
	 */
/*	function formatNumberLot(value){
		if (isNaN(value)) {
			return null;
		}

		value = value.toString(10);
		var oldvalue = value;
		var cursor;
		var identifier = '';
		if (value.length >= 8) {
			identifier = 'M';
			var decimal = 3;

			if (value.length >= 10) {
				decimal = 2;
			}

			cursor = value.length - 6;
			var str1 = '';
			var str2 = '';

			if (cursor == 0) {
				str1 = "0";
				str2 = value;
			} else {
				str1 = value.substring(0, cursor);
				str2 = value.substring(cursor, value.length);
			}

			var l = str2.length;
			str2 = parseInt(str2, 10);
			str2 = str2 / Math.pow(10, l-2);
			str2 = Math.round(str2);

			value = str1 + '.' + str2;
			value = parseFloat(value).toFixed(decimal);
		} else if (value.length >= 7) {
			identifier = 'K';

			cursor = value.length - 3;
			str1 = value.substring(0, cursor);
			str2 = value.substring(cursor, value.length);

			l = str2.length;
			str2 = parseInt(str2, 10);
			str2 = str2 / Math.pow(10, l-2);
			str2 = Math.round(str2);

			value = str1 + '.' + str2;
			value = parseFloat(value).toFixed(2);
		}

		var x = value.split('.');
		var x1 = x[0];
		var x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		var ret = x1 + x2;
		if (oldvalue != null) {
			ret += identifier;
		}

		return ret;
	}
*/	
	
	
	/**
	 * Description <br/>
	 * 
	 * 		process string value
	 * 
	 * @param {string} value
	 * 
	 * @return {string}
	 */
	function procStringValue(value){
		var returnValue = value;
		
		if (value != null) {
			if (value.length == 0 || value == "") {
				returnValue = "-";
			}
		}
		
		return returnValue;		
	}
	
	/**
	 * Description <br/>
	 * 
	 * 		process price value
	 * 
	 * @param {string}  value
	 * 
	 * @return {object}
	 */
	function procPriceValue(value){
		var returnValue = value;
		var isPrice = true;
		if (value == null || value == '') {
			returnValue = '-';
			isPrice = false;
        } else {
        	if (value == -999001 || value == 999001) {
        		returnValue = 'MO';
        		isPrice = false;
        	} else if (value == -999002 || value == 999002) {
        		returnValue = 'MP';
        		isPrice = false;
        	}
        }
		
		return {
			value		: returnValue,
			validation 	: isPrice
		};
	}
	
	
	/**
	 * Description <br/>
	 * 
	 * 		process change value
	 * 		Shouldn't check for other value when LACP is not exist
	 * 
	 * @param {object}  dataObj
	 * 
	 * @return {string}
	 */
	function procChangeValue( dataObj ){
		
		var allowToCount = true;
    	
    	var tempLast = 0;
    	var tempValue = 0;
    	var returnValue = 0;
    	
    	try {

    		if (dataObj[fieldLast] == null || parseFloat(dataObj[fieldLast]) == 0) {
    			if ( dataObj[fieldVol] != null ) {
    				if ( parseFloat( dataObj[fieldVol] ) == 0 ) {
    					allowToCount = false;
    					returnValue = '-';
    				}
    			} else {
    				allowToCount = false;
    				returnValue = '-';
    			}

    		} else {
    			tempLast = dataObj[fieldLast];
    		}

    		if (allowToCount) {

    			if ( dataObj[fieldLacp] != null && parseFloat(dataObj[fieldLacp]) != 0 ) {
    				tempValue = dataObj[fieldLacp];
    				returnValue = parseFloat( tempLast ) - parseFloat( tempValue );
    			}  	

    			var decimalPlace = 0;
    			if ( ( tempLast.toString() ).indexOf( '.' ) != -1) {
    				var temp = ( tempLast ).substring( ( tempLast ).indexOf( '.' ) + 1, tempLast.length);
    				decimalPlace = temp.length;
    			}

    			if ( decimalPlace > 0 ) {
    				returnValue = parseFloat( returnValue ).toFixed( decimalPlace );
    			} else {
    				returnValue = parseFloat( returnValue ).toFixed( 3 );
    			}

    		}

    	} catch ( e ) {
    		console.log( '[formatutils][procChangeValue] Exception ---> ' + e );
    	}
    	
		return returnValue;
	}
	
	/**
	 * Description <br/>
	 * 
	 * 		process portfolio change value
	 * 		if Lacp not exist, then check for Open, then Prev
	 * 
	 * @param {object}  dataObj
	 * 
	 * @return {string}
	 */
	function procPrfChangeValue( dataObj ){
		
		var allowToCount = true;
    	
    	var tempLast = 0
    	var tempValue = 0;
    	var returnValue = 0;
    	
    	try {

    		if (dataObj[fieldLast] == null || parseFloat(dataObj[fieldLast]) == 0) {
    			if ( parseFloat( dataObj[fieldVol] ) == 0 ) {
    				allowToCount = false;
    				returnValue = '-';
    			}
    		} else {
    			tempLast = dataObj[fieldLast];
    		}

    		if (allowToCount) {

    			if ( dataObj[fieldLacp] != null && parseFloat(dataObj[fieldLacp]) != 0 ) {
    				tempValue = dataObj[fieldLacp];

    			} else {
    				if ( dataObj[fieldOpen] != null && parseFloat(dataObj[fieldOpen]) != 0 ) {
    					tempValue = dataObj[fieldOpen];

    				} else {

    					if ( dataObj[fieldPrev] != null && parseFloat(dataObj[fieldPrev]) != 0 ) {
    						tempValue = dataObj[fieldPrev];
    					}
    				}
    			}    	


    			var decimalPlace = 0;
    			if ( ( tempLast.toString() ).indexOf( '.' ) != -1) {
    				var temp = ( tempLast ).substring( ( tempLast ).indexOf( '.' ) + 1, tempLast.length);
    				decimalPlace = temp.length;
    			}

    			returnValue = parseFloat( tempLast ) - parseFloat( tempValue );

    			if ( decimalPlace > 0 ) {
    				returnValue = parseFloat( returnValue ).toFixed( decimalPlace );
    			} else {
    				returnValue = parseFloat( returnValue ).toFixed( 3 );
    			}

    		}

    	} catch ( e ) {
    		console.log( '[formatutils][procPrfChangeValue] Exception ---> ' + e );
    	}
    	
		return returnValue;
	}
	
	
	/**
	 * Description <br/>
	 * 
	 * 		process change value
	 * 
	 * @param {object}  dataObj
	 * 
	 * @return {string}
	 */
	function procChangePercValue(dataObj){
		
		var changeValue = dataObj[fieldChange];
		var changePer = 0;
		var tempValue = 0;
		
		try {

			if ( parseFloat( changeValue ) == 0) {
				changePer = ( 0 ).toFixed(2);
			} else if (changeValue == '-'){
				changePer = '-';
			} else {
				if ( dataObj[fieldLacp] != null && parseFloat(dataObj[fieldLacp]) != 0 ) {
					tempValue = dataObj[fieldLacp];

				} else {
					if ( dataObj[fieldOpen] != null && parseFloat(dataObj[fieldOpen]) != 0 ) {
						tempValue = dataObj[fieldOpen];

					} else {

						if ( dataObj[fieldPrev] != null && parseFloat(dataObj[fieldPrev]) != 0 ) {
							tempValue = dataObj[fieldPrev];
						}
					}
				}    	

				changePer = ( ( changeValue / parseFloat(tempValue) ) * 100 ).toFixed(2);

			}
		
		} catch ( e ) {
    		console.log( '[formatutils][procChangePercValue] Exception ---> ' + e );
    	}
		
		return changePer;
	}
	
	/**
	 * Description <br/>
	 * 
	 * 		process change value
	 * 
	 * @param {object}  dataObj
	 * 
	 * @return {string}
	 */
	function procPrfChangePercValue(dataObj){
		
		var changeValue = dataObj[fieldPrfChange];
		var changePer = 0;
		var tempValue = 0;
		
		try {

			if ( parseFloat( changeValue ) == 0) {
				changePer = ( 0 ).toFixed(2);
			} else if (changeValue == '-'){
				changePer = '-';
			} else {

				if ( dataObj[fieldLacp] != null && parseFloat(dataObj[fieldLacp]) != 0 ) {
					tempValue = dataObj[fieldLacp];
				} else {
					if ( dataObj[fieldOpen] != null && parseFloat(dataObj[fieldOpen]) != 0 ) {
						tempValue = dataObj[fieldOpen];

					} else {

						if ( dataObj[fieldPrev] != null && parseFloat(dataObj[fieldPrev]) != 0 ) {
							tempValue = dataObj[fieldPrev];
						}
					}
				}

				changePer = ( ( changeValue / parseFloat(tempValue) ) * 100 ).toFixed(2);

			}

		} catch ( e ) {
			console.log( '[formatutils][procPrfChangeValue] Exception ---> ' + e );
		}

		return changePer;
	}
	
	/* 
	 * OSK: get warrant fifth character as Option Type
	 * for KL Warrants : Call Warrant - C 
	 * 					 Put Warrant - H
	 * 					 CBBC Bear - K
	 * 					 CBBC Bull - J]
	 * 					 W ??
	 */
	function procPrfCodeExtraction(dataObj){
         
		var extractedValue = '';
		var returnValue = '';
		try {         
			var tempStkCode =  dataObj[fieldStkCode].substring(0, dataObj[fieldStkCode].lastIndexOf('.'));
			var exchange = dataObj[fieldStkCode].substring(dataObj[fieldStkCode].lastIndexOf('.') + 1, dataObj[fieldStkCode].length);
			var letters = /^[A-Za-z]+$/; //regex to check if its a letter
			
			if(tempStkCode.length > 4) {
				extractedValue = dataObj[fieldStkCode].charAt(4);
				
				if(exchange == 'KL'){
					if(!extractedValue.match(letters)){
                                            if(dataObj[fieldStkFName] != null){
						var indexOfColon = dataObj[fieldStkFName].indexOf(':');
						extractedFName = dataObj[fieldStkFName].charAt(indexOfColon + 1);
						extractedValue = extractedFName;
                                            }
					} 
					//returnValue = dataObj[fieldStkCode].substring(0, 4);    
				}else{
					extractedValue = '';
				}
			}
			else {
				extractedValue = '';
				//returnValue = dataObj[fieldStkCode].substring(0, 4);
			}
		} catch ( e ) {
			console.log( '[formatutils][procPrfCodeExtraction] Exception ---> ' + e );	
		}

		return extractedValue;    
	}	
	
	function procOptionType(dataObj){
		
		var extractedValue = procPrfCodeExtraction(dataObj);
		var optionType = '';
		
		 switch(extractedValue){
         case 'C':
        	 optionType = 'Call';
        	 break;
         case 'H':
        	 optionType = 'Put';
        	 break;
         case 'J':
        	 optionType = 'Bull';
        	 break;
         case 'K':
        	 optionType = 'Bear';
        	 break;
         case 'W':
        	 optionType = 'Call';
        	 break;
         }
		 
		 return optionType;
	}
	
	function procOptionStyle(dataObj){
		
		var extractedValue = procPrfCodeExtraction(dataObj);
		var optionStyle = '';
		
		if(extractedValue == 'W'){
			optionStyle = 'American';
		}else if(extractedValue == 'C' || extractedValue == 'H' || extractedValue == 'J' || extractedValue == 'K'){
			optionStyle = 'European';
		}else{
			optionStyle = '';
		}
		
		return optionStyle;
	}
	           
	function formatDate(dataObj){
		var expiryDate = dataObj[fieldExpiryDate];
		/*
                var expiryDate = dataObj[fieldExpiryDate];
                if (expiryDate == 0) {
                    dataObj[fieldExpiryDate] = "";
                    expiryDate = "";
                }

		  if(expiryDate.length != 0 && expiryDate.indexOf('/') == -1){

			  var year = expiryDate.substring(0, 4);
			  var month = expiryDate.substring(4, 6);
			  var day = expiryDate.substring(6, expiryDate.length);

			  expiryDate = [day, month, year].join('/');
		  }*/		
		if (!expiryDate || expiryDate == '0') {
            dataObj[fieldExpiryDate] = "";
            expiryDate = "";
        }else{
        	expiryDate = Ext.Date.parse(expiryDate, 'Ymd');
        }

		return expiryDate; //Ext.Date.parse(expiryDate, 'Ymd');		  
	}  

    function removeDelayExchangeChar(stkcode) {
        stkcode = stkcode.replace(/D$/, '');

        return stkcode;
    }
    
    function SIPAccountChecking(flag){
    	var condSIP1 = 2048;
    	var condSIP2 = 4096;
    	var msg = '';

    	if(((flag & condSIP1) == condSIP1) && ((flag & condSIP2) == condSIP2)){
    		msg = '<br>'+ languageFormat.getLanguage(33350, 'This account is allowed to trade all listed SIPs');
    	}else if(((flag & condSIP1) == condSIP1) || ((flag & condSIP2) == condSIP2)){
    		msg = '<br>'+ languageFormat.getLanguage(33351 , 'This account is allowed to trade certain listed SIPs');
    	}else{
    		msg = '<br>'+ languageFormat.getLanguage(33352, 'This account is allowed to trade only EIPs.');
    	}

    	return msg;
    }
    
    function privateOrderChecking(flag){
    	var condPO = 2097152; //bitwise condition for private order
    	var isPrivateOrd = false;

    	if(((flag & condPO) == condPO)){
    		isPrivateOrd = true;
    	}

    	return isPrivateOrd;
    }
    
    function isCUTSubAcc(accountName){
    	var isCUTAcc = false;
    	var accno = '';

    	if(accountName.length > 0){
    		accno = accountName[0];

    		if (accRet) {
    			var accList = accRet.ai;
    			for (var i = 0; i < accList.length; i ++) {
    				var acc = accList[i];
    				if (acc.ac && accno == acc.ac) {
    					if(acc.cliType == 'B'){
    						isCUTAcc = true;
    					}
    					break;
    				}
    			}
    		}
    	}
    	return isCUTAcc;
    }
    
    function addDelaySuffix(tempStkCode, checkForceDelayed) {
        var tempExchange = getExchangeFromStockCode(tempStkCode);

        if (checkForceDelayed && _isForcedDelayed(tempExchange)) {
            return tempStkCode + "D"; // always return delayed for those specific exchanges
        }

        for (var i = 0; i < global_ExchangeList.length; i++) {
            if (global_ExchangeList[i].exchange.indexOf(tempExchange) == 0) {
                if (tempExchange != global_ExchangeList[i].exchange) {
                    tempStkCode = tempStkCode + "D";
                }
                break;
            }
        }

        return tempStkCode;
    }
          
    function procThemeColor() { //1.3.29.37 
        var x;
        if (global_personalizationTheme.indexOf('black') != -1 ) {
            x = 'b';
        }
        else
            x = 'w';

        return x;
    }
    
    /**
     * 
     * Gets exchange from stock code
     * 
     * @param {string} stockCode
     * @returns {string} exchange code
     */
    function getExchangeFromStockCode(stockCode) {
        var separator = stockCode.indexOf('.');

        return stockCode.substring(separator + 1);
    }
    
    /** Determines if the passed element is overflowing its bounds,
     * either vertically or horizontally.
     * Will temporarily modify the "overflow" style to detect this
     * if necessary as when overflow is set to 'visible', client[Height|Width] and scroll[Height|Width] will be the same.
     */
    function checkOverflow(el)
    {
    	var curOverflow = el.dom.style.overflow;
    	var cssChange = false;
    	
    	if ( !curOverflow || curOverflow === "visible" || curOverflow.length == 0){
    		el.dom.style.overflow = "hidden";
    		cssChange = true;
    	}
        
        // fixed IE issues where width is always wider
        var tPadding = 0;
        if (Ext.isIE) {
            tPadding = 1;
        }
    	var isOverflowing = ((el.dom.scrollWidth - tPadding) > el.dom.clientWidth) || (el.dom.scrollHeight > el.dom.clientHeight);

    	if(cssChange){
    		el.dom.style.overflow = curOverflow;
    	}

    	return isOverflowing;
    }
    
    function isWarrant(sector, stkName) {

        var isWarrant = false;

        for (var i = 0; i < global_isWarrantList.length; i++) {
            if(sector == global_isWarrantList[i] || stkName.indexOf('-') != -1){
            	isWarrant = true;
            	break;
            }
        }

        return isWarrant;
    }
    
    function _displayNet(val) {
        // var absVal = Math.abs(val);
        var fmNum = formatutils.formatNumber(val);

        if (val < 0) {
            // return '(' + fmNum + ')';
            return fmNum;
        } else {
            return fmNum;
        }
    }
    
    function _displayRound(val) {
        var numStr = Ext.util.Format.number(val, '0,000.###'); // to fix decimal issue and display optional decimals
        var roundStr = _formatRound(val);

        return '<span title="' + numStr + '">' + roundStr + '</span>';
    }
    
    function getCFDValues(val){
    	var cfdObj = {};
    	var cfdTradable = '';
    	var cfdShortSell = '';
		
		switch(val){
		case '0':
			cfdTradable = 'N';
			cfdShortSell = 'N';
			break;
		case '1':
			cfdTradable = 'Y';
			cfdShortSell = 'N';
			break;
		case '2':
			cfdTradable = 'N';
			cfdShortSell = 'Y';
			break;
		case '3':
			cfdTradable = 'Y';
			cfdShortSell = 'Y';
			break;		
		default:
			cfdTradable = 'N';
			cfdShortSell = 'N';
			break;
		}
		
		cfdObj.tradable = cfdTradable;
		cfdObj.shortsell = cfdShortSell;
		
		return cfdObj;
    }
    
    function getCFDCurrConversionValue(value, currentCurr, act, settCurr){
    	if (atpOthersCurrencyRate) {
            if (atpOthersCurrencyRate.obj.size > 0) {	// this check ATP is provide the CurrencyRate? if yes will perform calculation else take default Currency only
                var othersCurrencyRateList = atpOthersCurrencyRate.obj;
                
                var currencyRateList = othersCurrencyRateList;
                var n = currencyRateList.size;
                var fxRate = 1.000000;
                var denomination = 1;
                
                var currencyCompare = settCurr || defCurrency;
                
                for (var j = 0; j < n; j++) {
                	var prod = currencyRateList.d[j].p;
                    var currFrom = currencyRateList.d[j].currate[0];
                    var currTo = currencyRateList.d[j].currate[1];
                    
                    if(prod == 'CFD'){
                    	if (currentCurr == currencyCompare) {
                    		fxRate = parseFloat(1).toFixed(6);
                    	} else if (currTo == currentCurr) {
                    		// not same curreny and need convert
                    		if(currFrom == currencyCompare){
                    			var buyRate = currencyRateList.d[j].currate[3];
                    			var sellRate = currencyRateList.d[j].currate[4];
                    			denomination = currencyRateList.d[j].currate[5];
                    			
                    			if(act && act == modeOrdBuy){
                    				fxRate = sellRate;
                    			}else{
                    				fxRate = buyRate;
                    			}
                    			break;
                    		}
                    	} 
                    }
                }
                value = value * fxRate;
            }
        }
    	return value;
    }
    
    function getLastExchangeChar(dataString){

    	var lastChar = dataString.slice(-1);

    	if(lastChar == 'D'){
    		return lastChar;
    	}else{
    		return 'R';
    	}
    }
    
    function _isForcedDelayed(exch) {
        return N2N_CONFIG.portfolioForceDelayedExch.indexOf(exch) > -1;
    }
	
	return {
		getDateInstance	: getDateInstance,
		
		formatNumberLot	: formatNumberLot,            
		formatNumber	: formatNumber,
		formatLot		: formatLot, // v1.3.34.68
		
		procDateValue	: procDateValue,
		
		procStringValue	: procStringValue,
		procPriceValue	: procPriceValue,
		
		procChangeValue		: procChangeValue,
		procChangePercValue	: procChangePercValue,
		procPrfChangeValue	:	procPrfChangeValue,
		procPrfChangePercValue	:	procPrfChangePercValue,
		procPrfCodeExtraction	:	procPrfCodeExtraction,
		procOptionType		:	procOptionType,
		procOptionStyle		:	procOptionStyle,
		formatDate			:	formatDate,
		removeDelayExchangeChar	: removeDelayExchangeChar,
		SIPAccountChecking	:	SIPAccountChecking,
		addDelaySuffix		:	addDelaySuffix,
		procThemeColor	: procThemeColor, //1.3.29.37
		getExchangeFromStockCode: getExchangeFromStockCode,
		checkOverflow	:	checkOverflow,
		privateOrderChecking : privateOrderChecking,
		isCUTSubAcc			: 	isCUTSubAcc,
		isWarrant	:	isWarrant,
		displayNet: _displayNet,
		displayRound: _displayRound,
                formatRound: _formatRound,
                round10: _round10,
		getCFDValues: getCFDValues,
		getCFDCurrConversionValue: getCFDCurrConversionValue,
		getLastExchangeChar	: getLastExchangeChar,
                isForcedDelayed: _isForcedDelayed
	};
}());