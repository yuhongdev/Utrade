//v1.3.33.5

var cookies = (function() {
	var tempStorage = null;
	
	function createCookie(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		if(window.location.protocol != "https:"){
			document.cookie = name + "=" + value + expires + "; path=/";
		}
		else if(window.location.protocol == "https:"){ // v1.3.33.30 check if url is ssl secure, then store cookies in secure
			document.cookie = name + "=" + value + expires + "; path=/; secure"; //v1.3.33.8 secure cookie
		}
	}
	

	function readCookie(cookiesName) {
		var nameEQ = cookiesName + "=";
		var ca = document.cookie.split(';');
		
		for(var i=0;i < ca.length;i++) {
			var c = ca[i].trim();
			if (c.indexOf(nameEQ) == 0) 
				return c.substring(nameEQ.length,c.length);
		}
		return null;
	}
	
	function getCookies(cookiesName) {
		var x = readCookie(cookiesName);
		if(x == null) return null;
		else {
    		return x.split(',');
		}
	}
	
	function eraseCookie(cookiesName) {
		createCookie(cookiesName,"",-1);
	}
	
	function procCookie(cookiesName, tempValue, days) {
		var count = 0;
		var tempId = new Array();
		var tempWidth = new Array();
		
		//Put Object into Array
		for (var z in tempValue){
			tempId[count] = z;
			tempWidth[count] = tempValue[z];
			count++;
		}
		
		var tempsId = tempId.join('|');
		var tempsWidth = tempWidth.join('|');
		var temp = [tempsId, tempsWidth];
		var value = temp.join(',');
		createCookie(cookiesName, value, days);
	}
	
	function isCookiesExist(cookiesName) {
		var x = readCookie(cookiesName);
		if(x == null) return false;
		else return true;
	}
	
    function setTempStorage(panel, tempData) {
        panel.tempStorage = tempData.split(',');
    }

    function procTempCookies(panel, cookiesName, id, newWidth) {
        var tempWidthArray = {};
        var tempX;

        if (panel.tempWidthArray == null) {
            if (panel.tempStorage == null) {
                tempX = getCookies(cookiesName);
            }
            else {
                tempX = panel.tempStorage;
            }
            if (tempX) {
                var columnID = tempX[0].split('|');
                var tempWidth = tempX[1].split('|');

                for (var i = 0; i < tempWidth.length; i++) {
                    tempWidthArray[columnID[i]] = tempWidth[i];
                }
                tempWidthArray[id] = newWidth;
                panel.oriArray = tempWidthArray;
                panel.tempWidthArray = tempWidthArray;
            }
        }
        else {
            panel.tempWidthArray[id] = newWidth;
            panel.oriArray[id] = newWidth;
        }
        return panel.tempWidthArray;
    }
	
	function procTempCookiesPerc (panel, cookiesName, id, newWidth){ //v1.3.33.27
		var tempWidthArray = {};
		var tempX;

		if (panel.tempWidthArray == null){
			if (panel.tempStorage == null){
				tempX = getCookies(cookiesName);
			}
			else{
				tempX = panel.tempStorage;
			}
			
			if ( tempX != null ) {
				var columnID = tempX[0].split('|');
				var tempWidth = tempX[1].split('|');
				
				for(var i = 0; i < tempWidth.length; i++){
					tempWidthArray[columnID[i]]  = tempWidth[i];
				}
				tempWidthArray[id] = newWidth;
				panel.oriArray = tempWidthArray;
				panel.tempWidthArray = tempWidthArray;
			}
		}
		else{
			panel.tempWidthArray[id] = newWidth;
		}
		return panel.tempWidthArray;
	}
	
	function toDefaultColumn(panel, cookiesName){ //v1.3.33.27
		panel.tempWidthArray = panel.oriArray;
		return panel.tempWidthArray;
	}

        function adjustAllColWidths(cookieId, adjustWidth) {
            // get column cookie
            var colSetting = readCookie(cookieId);
            if (colSetting) {
                var colArr = colSetting.split(',');
                if (colArr[1]) {
                    var newColSetting = [colArr[0], stockutil.adjustSizes(colArr[1], adjustWidth)].join(',');

                    // rewrite cookie
                    createCookie(cookieId, newColSetting, cookieExpiryDays);
                }
            }
        }
        
        function adjustAllColWidths2(cookieId, adjustWidth) {
            // get column cookie
            var colSetting = readCookie(cookieId);
            if (colSetting) {
                var newColSetting = stockutil.toColWidthConfig2(colSetting, adjustWidth);

                // rewrite cookie
                createCookie(cookieId, newColSetting, cookieExpiryDays);
            }
        }

	return {
		getCookies		:	getCookies,
		eraseCookie		:	eraseCookie,
		procCookie		:	procCookie,
		isCookiesExist	:	isCookiesExist,
		setTempStorage	:	setTempStorage,
		procTempCookies	:	procTempCookies,
		procTempCookiesPerc: procTempCookiesPerc, //v1.3.33.27
		toDefaultColumn	:	toDefaultColumn,
                // makes public by Ratha
                readCookie: readCookie,
                createCookie: createCookie,
                adjustAllColWidths: adjustAllColWidths,
                adjustAllColWidths2: adjustAllColWidths2
	};
}());