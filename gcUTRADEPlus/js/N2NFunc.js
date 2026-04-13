var browser_string = navigator.appVersion + " " + navigator.userAgent;
var g_bNS;

if ( browser_string.indexOf("MSIE") < 0 ) 
{
	g_bNS = true;
}
else
{	
	g_bNS = false;
}

function JStrim(vsString)
{
	var constBlank=" "
	var newString=""
	var nLen

	nLen = vsString.length
	for (var i=0; i<nLen; ++i) {
		if (vsString.charAt(i) != constBlank) {
			break
		}
	}
	if (i < nLen) {	//when i>=vsString.length, return empty string
		for (var j=nLen-1; j>=0; --j) {
			if (vsString.charAt(j) != constBlank) {
				break
			}
		}
		newString = vsString.substring(i, j+1)
	}
	return newString
}

function JSformatNumber(vnData, vnDecimal)
{
	var sNumber;
	var nDecPower;
	var pos;
	var nCount, nZeroToAdd;

	sNumber = vnData;
	if (vnDecimal > 0) {
		nDecPower = Math.pow(10, vnDecimal);
		//round it to vnDecimal first
		sNumber = Math.round(sNumber * nDecPower) / nDecPower;
		//convert to string
		sNumber = sNumber.toString();
		//look for a decimal, period
		nZeroToAdd = vnDecimal;
		pos = sNumber.indexOf(".");
		if (pos < 0) {
			sNumber += ".";
		} else {
			nZeroToAdd -= (sNumber.length - pos -1);
		}

		for (nCount = 0; nCount < nZeroToAdd; ++nCount) {
			sNumber += "0";
		}
	}

	return sNumber;
}

function JSstripChar(vsInput, vcSep)
{
	var aWork;
	var sWork;
	var pos;
	var nCount, nZeroToAdd;

	aWork = vsInput.split(vcSep);
	sWork = "";
	for (nCount = 0; nCount < aWork.length; ++nCount) {
		sWork += aWork[nCount];
	}
	return sWork;
}

function JSencrypt(vsInput, vnID) {
	var sOutput = new String();
	var iCtr, nRnd;

	if (vnID%2==0) {
		for (iCtr=0; iCtr < vsInput.length; ++iCtr) {
			nRnd = Math.round(Math.random() * 127) + 53;
			sOutput += String.fromCharCode(vsInput.charCodeAt(iCtr) +nRnd, nRnd)
		}
	} else {
		for (iCtr=0; iCtr < vsInput.length; ++iCtr) {
			nRnd = Math.round(Math.random() * 127) + 53;
			sOutput += String.fromCharCode(nRnd, vsInput.charCodeAt(iCtr) +nRnd)
		}
	}
	return sOutput;
}

function JSescape(vsInput) {
	var sOutput = new String();
	var sTemp;
	var iCtr;

	for (iCtr=0; iCtr < vsInput.length; ++iCtr) {
		sTemp = String(vsInput.charCodeAt(iCtr).toString(16));
		if (sTemp.length == 3)
			sTemp = "0"+ sTemp
		if (sTemp.length == 2)
			sOutput += "%"+ sTemp;
		else
			sOutput += "%u"+ sTemp;
	}
	return sOutput;
}

function FormatNumber(num,decimalNum,bolLeadingZero,bolParens,bolCommas)
/**********************************************************************
	IN:
		NUM - the number to format
		decimalNum - the number of decimal places to format the number to
		bolLeadingZero - true / false - display a leading zero for
										numbers between -1 and 1
		bolParens - true / false - use parenthesis around negative numbers
		bolCommas - put commas as number separators.
 
	RETVAL:
		The formatted number!
 **********************************************************************/
{ 
        if (isNaN(parseInt(num))) return "NaN";

	var nZeroToAdd = 0;
	var pos = -1;
	var sNumber = "";
	var tmpNum = num;
	var iSign = num < 0 ? -1 : 1;		// Get sign of number
	
	// Adjust number so only the specified number of numbers after
	// the decimal point are shown.
	tmpNum *= Math.pow(10,decimalNum);
	tmpNum = Math.round(Math.abs(tmpNum))
	tmpNum /= Math.pow(10,decimalNum);
	tmpNum *= iSign;					// Readjust for sign

	// Create a string object to do our formatting on
	var tmpNumStr = new String(tmpNum);

	// See if we need to strip out the leading zero or not.
	if (!bolLeadingZero && num < 1 && num > -1 && num != 0)
		if (num > 0)
			tmpNumStr = tmpNumStr.substring(1,tmpNumStr.length);
		else
			tmpNumStr = "-" + tmpNumStr.substring(2,tmpNumStr.length);
		
	// See if we need to put in the commas
	if (bolCommas && (num >= 1000 || num <= -1000)) {
		var iStart = tmpNumStr.indexOf(".");
		if (iStart < 0)
			iStart = tmpNumStr.length;

		iStart -= 3;
		while (iStart >= 1) {
			tmpNumStr = tmpNumStr.substring(0,iStart) + "," + tmpNumStr.substring(iStart,tmpNumStr.length)
			iStart -= 3;
		}		
	}

	// See if we need to use parenthesis
	if (bolParens && num < 0)
		tmpNumStr = "(" + tmpNumStr.substring(1,tmpNumStr.length) + ")";

	nZeroToAdd = decimalNum;
	sNumber = tmpNumStr;
	
	pos = sNumber.indexOf(".");
	if (pos < 0) {
		sNumber += ".";
	} else {
		nZeroToAdd -= (sNumber.length - pos -1);
	}

	for (nCount = 0; nCount < nZeroToAdd; ++nCount) {
		sNumber += "0";
	}		
	
	tmpNumStr = sNumber;
	return tmpNumStr;		// Return our formatted string!
}


function JSgetInnerText(oData) {
	if (oData == null) {
		return "";
	}

	if (document.all) {
		return oData.innerText;
	} else {
		return oData.textContent;
	}

}
