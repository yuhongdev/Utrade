function JStrim(theString)
{
	var constBlank=" "
	var newString=""
	var nLen

	nLen = theString.length
	for (var i=0; i<nLen; ++i) {
		if (theString.charAt(i) != constBlank) {
			break
		}
	}
	if (i < nLen) {	//when i>=theString.length, return empty string
		for (var j=nLen-1; j>=0; --j) {
			if (theString.charAt(j) != constBlank) {
				break
			}
		}
		newString = theString.substring(i, j+1)
	}
	return newString
}

function JSencrypt(vsInput, vnID) {
	var sOutput = new String();
	var iCtr, nRnd;
	
	if (vnID%2==0) {
		for (iCtr=0; iCtr < vsInput.length; ++iCtr) {
			nRnd = Math.round(Math.random() * 127) + 53;
			//nRnd = 53;
			sOutput += String.fromCharCode(vsInput.charCodeAt(iCtr) +nRnd, nRnd)
		}
	} else {
		for (iCtr=0; iCtr < vsInput.length; ++iCtr) {
			nRnd = Math.round(Math.random() * 127) + 53;
			//nRnd = 53;
			sOutput += String.fromCharCode(nRnd, vsInput.charCodeAt(iCtr) +nRnd)
		}
	}
	return sOutput;
}