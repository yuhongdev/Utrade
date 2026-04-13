
function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
	var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
	if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
	d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

//----------------
//dropmenu : start
//----------------
var timeout = 500;
var closetimer = 500;
var ddmenuitem = 0;

// open hidden layer
function mopen(id, imgid) {
	// cancel close timer
	mcancelclosetime();

	// close old layer
	if(ddmenuitem) ddmenuitem.style.visibility = 'hidden';

	// get new layer and show it
	ddmenuitem = document.getElementById(id);
	ddmenuitem.style.visibility = 'visible';
	document.getElementById(imgid).style.visibility="hidden";
	openOther(imgid, 'o');
}

function openOther(imgid, doWhat) {
	for(a=1;a<=7;a++) {
		var imagename = 'img'+a;
		var currentStatus = document.getElementById(imagename).style.visibility;
		//alert('status for image : ' + imagename + " is " + currentStatus);
		if((doWhat == 'o' && imagename != imgid) || doWhat == 'c') {
			document.getElementById(imagename).style.visibility="visible";
		}
	}
}

// close showed layer
function mclose() {
	if(ddmenuitem) ddmenuitem.style.visibility = 'hidden';
}

// go close timer
function mclosetime(imgid) {
	openOther(imgid, 'c');
	closetimer = window.setTimeout(mclose, timeout);
}

// cancel close timer
function mcancelclosetime() {
	if(closetimer) {
		window.clearTimeout(closetimer);
		closetimer = null;
	}
}

// close layer when click-out
document.onclick = mclose;

//------------------------------------------------
//popup new link via select option box : start
//------------------------------------------------
//
function MM_jumpMenuCIMBGroup(targ,selObj,restore){ //v3.0
	if (selObj.options[selObj.selectedIndex].value != ""){
	  window.open(selObj.options[selObj.selectedIndex].value, targ);
	  if (restore) selObj.selectedIndex=0;
	}
}

//control the drop down login box
function HideContent(d) {
	if(d.length < 1) { return; }
	document.getElementById(d).style.display = "none";
}

function ShowContent(d) {
	if(d.length < 1) { return; }
	var screenWidth = screen.width;
	var divPosition = '743px';
	
	if(d == 'apDiv2') {
		var divPosition = '609px';
	} else {
		if(screenWidth == '1280') {
			divPosition = '743px';
		} else if(screenWidth == '1024') {
			divPosition = '743px';
		} else if(screenWidth == '1152') {
			divPosition = '743px';
		}
	}

	document.getElementById(d).style.left=divPosition;
	document.getElementById(d).style.display = "block";
	//alert(screenWidth + " | " + divPosition);
}

function ReverseContentDisplay(d) {
	if(d.length < 1) { return; }
	if(document.getElementById(d).style.display == "none") { document.getElementById(d).style.display = "block"; }
	else { document.getElementById(d).style.display = "none"; }
}

function popup_mail2friend(theURL) {
	var mail2friendURL = theURL + "&tpl=mail2friend";
	window.open(mail2friendURL, '_blank', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=yes,width=470,height=330,top=200,left=200')
}

function popup_printfriendly(theURL) {
	var printfriendlyURL = theURL + "&tpl=printfriendly";
	window.open(printfriendlyURL, '_blank', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,copyhistory=yes,width=700,height=600,top=50,left=50')
}

function popup_letuscontact(theURL) {
	var letuscontactURL = theURL + "&tpl=letuscontact";
	window.open(letuscontactURL, '_blank', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=yes,width=400,height=300,top=50,left=50')
}

function popup_promotion(theURL) {
	var letuscontactURL = theURL + "&tpl=promotion";
	window.open(letuscontactURL, '_blank', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,copyhistory=yes,width=500,height=500,top=50,left=50')
}

/*======================*\
	CONTENT FORMATTING
\*======================*/
function addCommas(nStr) {	//add comma separator to numbers
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

/*======================*\
	COLLAPSIBLE DIV
\*======================*/
var nextnum = 1;

function collapsibleDiv(theid){
	nextnum++;
	var thearray= null;
	var formObj = document.sitemapForm;
	var allDivNameVal = formObj.allDivName.value;
	var allDivNameValArr = allDivNameVal.split('|');
	var allDivNameValLength = allDivNameValArr.length;

	for(i=1; i<allDivNameValLength; i++){
		var divLoop = allDivNameValArr[i];

		if(divLoop == theid){
			document.getElementById(theid).style.display="block";
		} else { document.getElementById(divLoop).style.display="none";
		}
   }
}



/*======================*\
	DIRECT ACCESS USAGE
\*======================*/

function da_popup_letuscontact(theURL) {
	var letuscontactURL = theURL + "&tpl=th003_letuscontact&tpt=cimb_da";
	window.open(letuscontactURL, '_blank', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no,copyhistory=yes,width=400,height=300,top=50,left=50')
}

function da_popup_printfriendly(theURL) {
	var printfriendlyURL = theURL + "&tpl=th003_printerfriendly";
	window.open(printfriendlyURL, '_blank', 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,copyhistory=yes,width=700,height=600,top=50,left=50')
}

//-->