function AlphaNumberCtrl(keypress)
{
	//between '0' - '9', 'A' - 'Z', 'a'-'z'
	if ((keypress >= 48 && keypress <= 57)
			|| (keypress >= 65 && keypress <= 90)
			|| (keypress >= 97 && keypress <= 122)) {
		return keypress;
	}
//	beep();
	return 0;
}

function NumberCtrl(keypress)
{
	//not between '0' and '9'
	if (keypress < 48 || keypress > 57) {
//		beep();
		return 0;
	}
	return keypress;
}

function NumberSlashCtrl(keypress)
{
// for date 
	//not between '0' and '9' and not '.'
	if (keypress < 47 || keypress > 57 ) {
//		beep();
		return 0;
	}
	return keypress;

}

function DecimalCtrl(keypress)
{
	//not between '0' and '9' and not '.'
	if ((keypress < 48 || keypress > 57) && keypress != 46) {
//		beep();
		return 0;
	}
	return keypress;
}

function DecimalPrecCtrl(keypress, value, prec)
{
	var nDecPos
	//not between '0' and '9' and not '.'
	if ((keypress < 48 || keypress > 57) && keypress != 46) {
//		beep();
		return 0
	}
	nDecPos = value.indexOf(".")
	if (nDecPos >= 0) {
		//make sure only one decimal
		if (keypress == 46)
			return 0
		if ((value.length - nDecPos) > prec)
			return 0
	}

	return keypress;
}

function DecimalPrecCtrlNeg(keypress, value, length, prec){
	var nNumPrec = 0;
	var nNumLength = 0;
	var nDecPos;
	//not between '0' and '9' and not '.'

	if (keypress == 45 && value.length == 0){
	}
	else if ((keypress < 48 || keypress > 57) && keypress != 46) {
//		beep();
		return 0
	}
	sVal = value.split(".");
	nNumLength = sVal[0].length;

	nDecPos = value.indexOf(".")
	if (nDecPos >= 0) {
		//make sure only one decimal
		if (keypress == 46)
			return 0;
		else{
			nNumPrec = sVal[1].length;
			if (parseInt(nNumPrec) < parseInt(prec))	//control precision of number keyin.
				return keypress;
		}
	}else{
		if (parseInt(nNumLength) < parseInt(length) || keypress == 46)	//control length of number keyin.
			return keypress;
	}
}

function getSelectionStart(o) {
	if (o.createTextRange) {
		var r = document.selection.createRange().duplicate()
		r.moveEnd('character', o.value.length)
		if (r.text == '') return o.value.length
		return o.value.lastIndexOf(r.text)
	} else return o.selectionStart
}

function DecimalPrecCtrlNeg2(keypress, value, length, prec, obj){
	var nNumPrec = 0;
	var nNumLength = 0;
	var nDecPos;
	//not between '0' and '9' and not '.'

	if (keypress == 45 && value.length == 0){
	}
	else if ((keypress < 48 || keypress > 57) && keypress != 46) {
//		beep();
		return 0
	}
	sVal = value.split(".");
	nNumLength = sVal[0].length;
	
	nDecPos = value.indexOf(".")
	if (nDecPos >= 0) {
		//make sure only one decimal
		if (keypress == 46)
			return 0;
		else{
			nNumPrec = sVal[1].length;
			if (parseInt(nNumPrec) < parseInt(prec) && getSelectionStart(obj) > nDecPos)	//control precision of number keyin (after decimal point).
				return keypress;
			else if (parseInt(nNumLength) < parseInt(length) && getSelectionStart(obj) <= nDecPos)	//control precision of number keyin (before decimal point).
				return keypress;
		}
	}else{
		if (parseInt(nNumLength) < parseInt(length) || keypress == 46)	//control length of number keyin.
			return keypress;
	}
}

function AlphaCtrl(keypress)
{
	//between '0' - '9'
	if (keypress >= 48 && keypress <= 57) {
		return 0;
	}
	return keypress;
}

// Marquee for IE and NS
//scroller width
var swidth=200
//scroller height
var sheight=120
//scroller's speed;
var sspeed=1
var wholemessage=''

function setMsg(sMsg)
{
	wholemessage = sMsg;
}

function setWidth(nWidth)
{
	swidth = nWidth;
}

function setHeight(nHeight)
{
	sheight = nHeight;
}

function setSpeed(nSpeed)
{
	sspeed = nSpeed;
}

function start()
{
	if (!g_bNS) return
	if (document.getElementById)
	{
		document.getElementById("slider").style.visibility="show"
		ns6marquee(document.getElementById('slider'))
	}
	else if(document.layers)
	{
		document.slider1.visibility="show"
		ns4marquee(document.slider1.document.slider2)
	}
}

function ns4marquee(whichlayer)
{
	ns4layer=eval(whichlayer)
	ns4layer.document.write(wholemessage)
	ns4layer.document.close()
	sizeup=ns4layer.document.height
	ns4layer.top-=sizeup
	ns4slide()
}

function ns4slide()
{
	if (ns4layer.top>=sizeup*(-1))
	{
		ns4layer.top-=sspeed
		setTimeout("ns4slide()",100)
	}	
	else
	{
		ns4layer.top=sheight
		ns4slide()
	}
}

function ns6marquee(whichdiv)
{
	ns6div=eval(whichdiv)
	ns6div.innerHTML=wholemessage
	ns6div.style.top=sheight
	sizeup=sheight
	ns6slide()
}

function ns6slide()
{
	if (parseInt(ns6div.style.top)>=sizeup*(-1))
	{
		ns6div.style.top=parseInt(ns6div.style.top)-sspeed
		setTimeout("ns6slide()",100)
	}
	else
	{
		ns6div.style.top=sheight
		ns6slide()
	}
}

function scrollText()
{
	document.writeln('<span style="borderWidth:1; borderColor:red; width:300; height:100;">')
	document.writeln('<ilayer width=300 height=100 name="slider1" bgcolor="black" visibility=hide>')
	document.writeln('<layer name="slider2" onMouseover="sspeed=0;" onMouseout="sspeed=2">')
	document.writeln('</layer>')
	document.writeln('</ilayer>')
	if (!g_bNS)
	{
		document.writeln('<marquee id="ieslider" scrollAmount=1 width=' + swidth + ' height=' + sheight + ' direction=up scrolldelay=' + sspeed + '>')
		document.writeln(wholemessage)
		ieslider.onmouseover=new Function("ieslider.scrollAmount=0")
		ieslider.onmouseout=new Function("if (document.readyState=='complete') ieslider.scrollAmount=2")
		document.write('</marquee>')
	}
	if (document.getElementById&&g_bNS)
	{
		document.write('<div style="position:relative;overflow:hidden;width:' + swidth + ';height:' + sheight + ';clip:rect(0 302 102 0);" onMouseover="sspeed=0;" onMouseout="sspeed=2">')
		document.write('<div id="slider" style="position:relative;width:' + swidth + ';">')
		document.write('</div></div>')
	}
}
	
	function formatDateToODBC(pnFormat, psValue) {
		//pnFormat
		//1 = dd-mm-yyyy
		//2 = mm-dd-yyyy
		//3 = yyyy-mm-dd
		
		var sValue = ""
		if (psValue != null) {			
			sValue = psValue;
		}
		
		if (sValue != "") {
			if (pnFormat == 1) {
				sValue = sValue.substring(6,10) + "-" + sValue.substring(3,5) + "-" +  sValue.substring(0,2);
			} else if (pnFormat == 2) {
				sValue = sValue.substring(6,10) + "-" + sValue.substring(0,2) + "-" +  sValue.substring(3,5);
			}
		}
		return sValue;
	}
	
	function formatDateField(pnFormat, psValue) {
		//pnFormat
		//1 = dd-mm-yyyy
		//2 = mm-dd-yyyy
		//3 = yyyy-mm-dd
		
		var sValue = ""
		if (psValue != null) {
			sValue = psValue;
		}
		
		if (sValue != "") {
			if (pnFormat == 1) {
				sValue = sValue.substring(8,10) + "-" + sValue.substring(5,7) + "-" +  sValue.substring(0,4);
			} else if (pnFormat == 2) {
				sValue = sValue.substring(5,7) + "-" + sValue.substring(8,10) + "-" +  sValue.substring(0,4);
			}
		}
		
		return sValue;
	}	
