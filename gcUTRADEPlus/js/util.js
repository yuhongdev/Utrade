var emoreg_password = "Password";
var emoreg_password_str = "Password Strength";
var emoreg_password_short = "Too Short";
var emoreg_password_weak = "Weak";
var emoreg_password_fair = "Fair";
var emoreg_password_good = "Good";
var emoreg_password_strong = "Strong";
var emoreg_minchar = "Case sensitive. Min. 6 characters. <br>(Best to have a combination of lowercase, uppercase letters and numbers.)"
var emoreg_confirm_password = "Password (Confirm)";

function lang(id, value) {
	document.getElementById(id).innerHTML = value;
}

function trimAll(str) {
	var result = "";
	var c = 0;
	str = "" + str + "";
	for (i = 0; i < str.length; i++) {
		if (str.charAt(i) != " ") {
			result += str.charAt(i);
		}
	}
	return result;
}
function trimLeft(str) {
	var pos = "";
	var result = "";
	var c = 0;
	for (i = 0; i < str.length; i++) {
		if (str.charAt(i) != " ") {
			pos = i;
		}
	}
	result = str.substring(i);
	return result;
}
function IsEmpty(str) {
	str = trimAll(str);
	if (str == "") {
		return true;
	}
	return false;
}
function IsNumeric(str) {
	var numb = "0123456789";
	if (!IsEmpty(str)) {
		if (!IsValidParam(str, numb)) {
			return false;
		}
	} else {
		return false;
	}
	return true;
}
function IsValidUserID(str) {
	str = str.toLowerCase();
	var numb = "abcdefghijklmnopqrstuvwxyz0123456789_";
	if (!IsEmpty(str)) {
		if (!IsValidParam(str, numb)) {
			return false;
		}
	} else {
		return false;
	}
	return true;
}
function IsValidParam(parm, val) {
	if (parm == "") {
		return true;
	}
	for (i = 0; i < parm.length; i++) {
		if (val.indexOf(parm.charAt(i), 0) == -1) {
			return false;
		}
	}
	return true;
}
function chkValidDate(dtFrom, dtTo) {
	var arrFrom, arrTo;
	if (dtFrom == "") {
		return false;
	}
	if (dtTo == "") {
		return false;
	}
	arrFrom = dtFrom.split("-");
	arrTo = dtTo.split("-");
	if (arrFrom[0] > arrTo[0]) {
		return false;
	}
	if (arrFrom[1] > arrTo[1]) {
		return false;
	}
	if (arrFrom[2] > arrTo[2]) {
		return false;
	}
	return true;
}
function addZero(str) {
	var sOut = "";
	if (str < 10) {
		sOut = "0" + str;
	} else {
		sOut = "" + str;
	}
	return sOut;
}
function popitup(sUrl, sHeight, sWidth) {
	var sProperty = "";
	sProperty = "dependent=0,directories=0,fullscreen=0,left=200,top=100,location=0,menubar=0,";
	sProperty = sProperty
			+ "resizable=1,scrollbars=1,status=0,toolbar=0,height=" + sHeight
			+ ",width=" + sWidth;
	newwindow = window.open(sUrl, "name", sProperty);
	if (window.focus) {
		newwindow.focus();
	}
	return false;
}
function IsValidEmail(sStr) {
	var nCntA = 0;
	var nCntD = 0;
	if (!IsEmpty(sStr)) {
		for (i = 0; i < sStr.length; i++) {
			if (sStr.charAt(i) == "@") {
				nCntA++;
			}
			if (sStr.charAt(i) == ".") {
				nCntD++;
			}
		}
		if (nCntA != 1) {
			return false;
		} else if (nCntD < 1) {
			return false;
		} else {
			return true;
		}
	} else {
		return false;
	}
}
function validatePassword(password, username) {
	var TOO_SHORT = -1;
	var STRONG = 0;
	var GOOD = 1;
	var FAIR = 2;
	var WEAK = 3;
	score = 0;
	password = trimAll(password);
	if (username == null) {
		username = "";
	}
	if (password.length < 6) {
		return TOO_SHORT;
	}
	if (password.toLowerCase() == username.toLowerCase()) {
		return WEAK;
	}

	//alert("Score Raw : "+score);
	score = checkScore(password);

	if (score < 0) {
		score = 0;
	}
	if (score > 100) {
		score = 100;
	}
	if (score < 40) {
		return WEAK;
	}
	else if (score >= 40 && score < 60) {
		return FAIR;
	}
	else if (score >= 60 && score < 75) {
		return GOOD;
	}
	else if(score >= 75 && score <= 100) {
		return STRONG;
	}
}

function checkScore(pwd){
	var nScore = 0;
	var nLength = 0;
	var nAlpha = 0;
	var nNumber = 0;
	var nSymbol = 0;
	var nRepChar = 0;
	var nMultLength = 4;
	var nMultSymbol = 4;
	var nMultAlpha = 4;
	var nMultNumber = 4;
	var nMultRepChar = 8;
	var symRepChar = 0;
	nLength = pwd.length;
	var arrPwd = pwd;
//	var arrPwd = pwd.replace (/\s+/g,"").split(/\s*/);
	var arrPwdLen = arrPwd.length;
	nScore = parseInt(pwd.length * nMultLength);
	for(var a=0; a<arrPwdLen; a++)
	{	//alert(arrPwd.charAt(a));
		if(arrPwd.charAt(a).match(new RegExp(/[a-zA-Z]/))){
			nAlpha++;
		}	
		else if (arrPwd.charAt(a).match(new RegExp(/[0-9]/g))) { 
			nNumber++;
		}	
		else if (arrPwd.charAt(a).match(new RegExp(/[^a-zA-Z0-9_]/g))) { 
			nSymbol++;
		}	
		/* Internal loop through password to check for repeated characters */
		for (var b=0; b < arrPwdLen; b++) {
			
			if (arrPwd.charAt(a).toLowerCase() == arrPwd.charAt(b).toLowerCase() && a != b) 
			{ 	if(!arrPwd.charAt(b).match(/([^a-zA-Z0-9_])/))
				{//alert(arrPwd.charAt(b));
				nRepChar++; 
				}
				else
				symRepChar++
			}
		}
	}
	//alert(nRepChar);
	/* General point assignment */
		if (nAlpha > 0 && nAlpha < nLength) {	
			//nScore = parseInt(nScore + (nAlpha * nMultAlpha));
			nScore += 6;
		}
		if (nNumber > 0 && nNumber < nLength) {	
			//nScore = parseInt(nScore + (nNumber * nMultNumber));
			nScore += 6;
		}
		if (nSymbol > 0 && nSymbol < nLength) {	
		//	nScore = parseInt(nScore + (nSymbol * nMultSymbol));
			nScore += 8;
		}
		if(nAlpha > 0 && nNumber > 0)
		{
			nScore += 15;
		}
		if(nSymbol > 0 && nNumber > 0)
		{
			nScore += 20;
		}
		if(nSymbol > 0 && nAlpha > 0)
		{	
			nScore += 20;
		}
		if(nSymbol > 0 && nAlpha > 0 && nNumber > 0)
		{
			nScore += 25;
		}
		if (pwd.match(/^\w+$/) || pwd.match(/^\d+$/)) {
		//	nScore -= 10;
		}
		//nScore -= 10;
	//alert("Score"+nScore);
	//alert("nRepChar" +nRepChar);
	
	/* Point deductions for poor practices */
		if ((nAlpha > 0) && nSymbol === 0 && nNumber === 0) {  // Only Letters
			nScore = parseInt(nScore - nLength);
			//nScore = parseInt(nScore - 10);nScore -= 4;
		}
		if (nAlpha === 0 && nSymbol === 0 && nNumber > 0) {  // Only Numbers
			nScore = parseInt(nScore - nLength);
			//nScore = parseInt(nScore - 10);			
		}
		if (nAlpha === 0 && nSymbol > 0 && nNumber === 0){ //Only Symbol
			nScore = parseInt(nScore - (nSymbol * nMultSymbol));
			//nScore = parseInt(nScore - 15);
		}
		if (nRepChar > 0) {  // Same character exists more than once
			nScore = parseInt(nScore - (nRepChar*nMultRepChar));
			//nScore -= 4;
			
		}
		if(nSymbol == 0 && nAlpha > 0 && nNumber > 0 && nLength >6)
		{
			nScore -= ((nLength-6)*4);
			//nScore -=10;
		}
		if(symRepChar > 6)
		{
			nScore -= ((nLength-6)*4);
		}
		/*else
		{
			nScore -=10;
		}*/
	//alert("Final score after Deduct: " +nScore);
	return nScore;
}	

String.prototype.strReverse = function() {
	var newstring = "";
	for (var s=0; s < this.length; s++) {
		newstring = this.charAt(s) + newstring;
	}
	return newstring;
};