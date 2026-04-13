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
	score += password.length * 4;
	score += (checkRepetition(1, password).length - password.length) * 1;
	score += (checkRepetition(2, password).length - password.length) * 1;
	score += (checkRepetition(3, password).length - password.length) * 1;
	score += (checkRepetition(4, password).length - password.length) * 1;
	if (password.match(/(.*[0-9].*[0-9].*[0-9])/)) {
		score += 5;
	}
	if (password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)) {
		score += 5;
	}
	if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
		score += 10;
	}
	if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) {
		score += 15;
	}
	if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/)
			&& password.match(/([0-9])/)) {
		score += 15;
	}
	if (password.match(/([!,@,#,$,%,^,&,*,?,_,~])/)
			&& password.match(/([a-zA-Z])/)) {
		score += 15;
	}
	if (password.match(/^\w+$/) || password.match(/^\d+$/)) {
		score -= 10;
	}
	if (score < 0) {
		score = 0;
	}
	if (score > 100) {
		score = 100;
	}
	if (score < 25) {
		return WEAK;
	}
	if (score < 50) {
		return FAIR;
	}
	if (score < 75) {
		return GOOD;
	}
	return STRONG;
}
function checkRepetition(pLen, str) {
	res = "";
	for (i = 0; i < str.length; i++) {
		repeated = true;
		for (j = 0; j < pLen && j + i + pLen < str.length; j++) {
			repeated = repeated
					&& str.charAt(j + i) == str.charAt(j + i + pLen);
		}
		if (j < pLen) {
			repeated = false;
		}
		if (repeated) {
			i += pLen - 1;
			repeated = false;
		} else {
			res += str.charAt(i);
		}
	}
	return res;
}


String.prototype.strReverse = function() {
	var newstring = "";
	for (var s=0; s < this.length; s++) {
		newstring = this.charAt(s) + newstring;
	}
	return newstring;
};