//v1.0
//Copyright 2006 Adobe Systems, Inc. All rights reserved.
//onerror = handleErrors;

/*
* ======================================
* This part is for Object Tag
* ======================================
*/

function EnableObjectTag() {
    theObjects = document.getElementsByTagName("object"); 

    for (var i = 0; i < theObjects.length; i++) { 
        theObjects[i].outerHTML = theObjects[i].outerHTML;
    }
}

function AC_AddExtension(src, ext)
{
  if (src.indexOf('?') != -1)
    return src.replace(/\?/, ext+'?'); 
  else
    return src + ext;
}

/*
*	Generate Flash Object
*/
function AC_FL_RunContent(){
  var ret = 
    AC_GetArgs
    (  arguments, ".swf", "movie", "clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"
     , "application/x-shockwave-flash"
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

/*
*	Generate Shockwave Object
*/

function AC_SW_RunContent(){
  var ret = 
    AC_GetArgs
    (  arguments, ".dcr", "src", "clsid:166B1BCA-3F9C-11CF-8075-444553540000"
     , null
    );
  AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_GetArgs(args, ext, srcParamName, classid, mimeType){
  var ret = new Object();
  ret.embedAttrs = new Object();
  ret.params = new Object();
  ret.objAttrs = new Object();
  for (var i=0; i < args.length; i=i+2){
    var currArg = args[i].toLowerCase();    

    switch (currArg){   
      case "classid":
        break;
      case "pluginspage":
        ret.embedAttrs[args[i]] = args[i+1];
        break;
      case "src":
      case "movie": 
        args[i+1] = AC_AddExtension(args[i+1], ext);
        ret.embedAttrs["src"] = args[i+1];
        ret.params[srcParamName] = args[i+1];
        break;
      case "onafterupdate":
      case "onbeforeupdate":
      case "onblur":
      case "oncellchange":
      case "onclick":
      case "ondblClick":
      case "ondrag":
      case "ondragend":
      case "ondragenter":
      case "ondragleave":
      case "ondragover":
      case "ondrop":
      case "onfinish":
      case "onfocus":
      case "onhelp":
      case "onmousedown":
      case "onmouseup":
      case "onmouseover":
      case "onmousemove":
      case "onmouseout":
      case "onkeypress":
      case "onkeydown":
      case "onkeyup":
      case "onload":
      case "onlosecapture":
      case "onpropertychange":
      case "onreadystatechange":
      case "onrowsdelete":
      case "onrowenter":
      case "onrowexit":
      case "onrowsinserted":
      case "onstart":
      case "onscroll":
      case "onbeforeeditfocus":
      case "onactivate":
      case "onbeforedeactivate":
      case "ondeactivate":
      case "type":
      case "codebase":
        ret.objAttrs[args[i]] = args[i+1];
        break;
      case "width":
      case "height":
      case "align":
      case "vspace": 
      case "hspace":
      case "class":
      case "title":
      case "accesskey":
      case "name":
      case "id":
      case "tabindex":
        ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i+1];
        break;
      default:
        ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i+1];
    }
  }
  ret.objAttrs["classid"] = classid;
  if (mimeType) ret.embedAttrs["type"] = mimeType;
  return ret;
}

function AC_Generateobj(objAttrs, params, embedAttrs) 
{
  var str = '<object ';
  for (var i in objAttrs)
    str += i + '="' + objAttrs[i] + '" ';
  str += '>';
  for (var i in params)
    str += '<param name="' + i + '" value="' + params[i] + '" /> ';
  str += '<embed ';
  for (var i in embedAttrs)
    str += i + '="' + embedAttrs[i] + '" ';
  str += ' ></embed></object>';
  
  document.write(str);
}

function AC_AX_RunContent() {   
    var ret = AC_AX_GetArgs(arguments);     
    var oAttrs = ret.embedAttrs;
    var oParam = ret.params;
    AC_Generateobj(ret.objAttrs, ret.params, ret.embedAttrs);
}

function AC_AX_GetArgs(args) {
  var ret = new Object();
  ret.embedAttrs = new Object();
  ret.params = new Object();
  ret.objAttrs = new Object();
  for (var i=0; i < args.length; i=i+2){
    var currArg = args[i].toLowerCase(); 
    alert(currArg);
    switch (currArg){   
      case "pluginspage":
      case "type":
      case "src":
        ret.embedAttrs[args[i]] = args[i+1];
        break;
      case "data":
      case "codebase":
      case "classid":
      case "id":
      case "onafterupdate":
      case "onbeforeupdate":
      case "onblur":
      case "oncellchange":
      case "onclick":
      case "ondblClick":
      case "ondrag":
      case "ondragend":
      case "ondragenter":
      case "ondragleave":
      case "ondragover":
      case "ondrop":
      case "onfinish":
      case "onfocus":
      case "onhelp":
      case "onmousedown":
      case "onmouseup":
      case "onmouseover":
      case "onmousemove":
      case "onmouseout":
      case "onkeypress":
      case "onkeydown":
      case "onkeyup":
      case "onload":
      case "onlosecapture":
      case "onpropertychange":
      case "onreadystatechange":
      case "onrowsdelete":
      case "onrowenter":
      case "onrowexit":
      case "onrowsinserted":
      case "onstart":
      case "onscroll":
      case "onbeforeeditfocus":
      case "onactivate":
      case "onbeforedeactivate":
      case "ondeactivate":
        ret.objAttrs[args[i]] = args[i+1];
        break;
      case "width":
      case "height":
      case "align":
      case "vspace": 
      case "hspace":
      case "class":
      case "title":
      case "accesskey":
      case "name":
      case "tabindex":
        ret.embedAttrs[args[i]] = ret.objAttrs[args[i]] = args[i+1];
        break;
      default: 
        ret.embedAttrs[args[i]] = ret.params[args[i]] = args[i+1];       
    }
  }
  
  return ret;
}
/*
* ======================================
* This part is for Applet Tag
* ======================================
*/
/*
function AC_Generateapplet(objAttrs, params) 
{	
  var str = "<applet ";
  
  for (var i in objAttrs)
    str += i + "=" + objAttrs[i] + " ";
  
  str += " MAYSCRIPT>";

  //str += "<param name=MinSYNC value=30>"; // Min. milliseconds/frame for sync
  //str += "<param name=priority value=1>";    // Task priority 1-10
  //str += "<param name=memdelay value=15>"; // Memory deallocation delay

  for (var i in params) {
       str += "<param name=" + i + " value=" + params[i] + ">";
  }

  str += "</" + "applet>";
  
  //alert(str);
  document.write(str);
  //document.close();
}
*/

function AC_Generateapplet(objAttrs, params) 
{ 
	
  var str = '<applet ';
  
  for (var i in objAttrs) 
  		str += i + '="' + objAttrs[i] + '" ';
  
  str += ' MAYSCRIPT>';
  
  for (var i in params) 
  		str += '<param name="' + i + '" value="' + params[i] + '" > ';
   
  str += '</applet>';

  document.write(str);
 
  //alert(str);
}

function AC_AX_RunAppletContent(applet_param) {

    var ret = AC_AX_GetAppletArgs(applet_param);

    AC_Generateapplet(ret.objAttrs, ret.params);
}
/*
function AC_AX_GetAppletArgs(args) {
  
  var ret      = new Object();
  ret.params   = new Object();
  ret.objAttrs = new Object();
  
  for (var i=0, j=args.length; i<j; i=i+2) {
		    
    //var currArg = args[i].toLowerCase(); 
    //alert(currArg);
    	
    switch (args[i].toLowerCase()){   
      case "code":
      case "codebase":
      case "archive":
      case "width":
      case "height":
        ret.objAttrs[args[i]] = args[i+1];
        break;
      default: 
        ret.params[args[i]] = args[i+1];       
    }

  }  
  return ret;
}
*/

function AC_AX_GetAppletArgs(args) {
  var ret = new Object();
  ret.params = new Object();
  ret.objAttrs = new Object();
  for (var i=0; i < args.length; i=i+2){
    var currArg = args[i].toLowerCase(); 
    //alert(currArg);
    switch (currArg){   
      case "code":
      case "codebase":
      case "archive":
      case "width":
      case "height":
        ret.objAttrs[args[i]] = args[i+1];
        break;
      default: 
        ret.params[args[i]] = args[i+1];       
    }
  }
  
  return ret;
}

/*
* ======================================
* This part is for OjectTag Qsee Deployment
* ======================================
*/
function AC_AX_RunAppletObjectTagContent_Qsee(applet_param, browserType) {  
    var ret = AC_AX_GetObjectArgs_Qsee(applet_param, browserType); 
    AC_GenerateObjectTagContent_Qsee(ret.objAttrs, ret.params);
}

function AC_AX_GetObjectArgs_Qsee(args, type){
	var ret = new Object();
	ret.objAttrs = new Object();
	ret.params = new Object();
	if (type == "IE") {
		for(var i=0; i<args.length; i+=2){
			var currArg = args[i].toLowerCase();
			switch(currArg){		
				case "classid":
				case "width":
				case "height":
					ret.objAttrs[args[i]] = args[i+1];
					break;
				case "codebase1":
					args[i] = "CODEBASE"
					ret.objAttrs[args[i]] = args[i+1];
					break;
				default:
					ret.params[args[i]] = args[i+1];
			}
		}
	} else {
		for(var i=0; i<args.length; i+=2){
			var currArg = args[i].toLowerCase();
			switch(currArg){		
				case "classid":
				case "width":
				case "height":
				case "type":
					ret.objAttrs[args[i]] = args[i+1];
					break;
				case "codebase1":
					//args[i] = "CODEBASE"
					//ret.objAttrs[args[i]] = args[i+1];
					break;
				default:
					ret.params[args[i]] = args[i+1];
			}
		}
	}
	
	return ret;	
}

function AC_GenerateObjectTagContent_Qsee(objAttrs, params){
	var str = '<OBJECT ';
	
	for(var i in objAttrs){
		str += i + '="' +objAttrs[i]+ '" ';
	}
	
	str += '>';
	//alert("str object attrs:"+str);
	for(var i in params){
		str += '<param name="'+i+'" value="'+params[i]+'">';
	}
	
	str += 'This browser does not have a Java Plug-in!';
	str += '</OBJECT>';

	document.write(str);
	//alert(str);
}

function handleErrors(errorMessage, url, line)
{
  var msg = new String("");
    msg = "AC_RunActiveContent: There was an error on this page.\n\n";
    msg += "An internal programming error may keep\n";
    msg += "this page from displaying properly.\n";
    msg += "Click OK to continue.\n\n";
    msg += "Error message: " + errorMessage + "\n";
    msg += "URL: " + url + "\n";
    msg += "Line #: " + line;
    alert(msg);
}

function ieupdate() { 
  
  //alert("ieupdate");
	
	var strBrowser = navigator.userAgent.toLowerCase(); 
	
	if (strBrowser.indexOf("msie") > -1 && strBrowser.indexOf("mac") < 0) {  
		  
		  //alert("MSIE");
		  
		  var theObjects = document.getElementsByTagName('object');  
		  var theObjectsLen = theObjects.length;  
		
		  //alert("obj len ="+theObjectsLen);
		
		  if (theObjectsLen*1 > 0) {
					//alert("object");
		 		  for (var i = 0; i < theObjectsLen; i++) {
		 		  	
						   if(theObjects[i].outerHTML) {    
						
									if(theObjects[i].data) {     
										 theObjects[i].removeAttribute('data');    
									}    
									
									var theParams = theObjects[i].getElementsByTagName("param");    
									var theParamsLength = theParams.length;    
									for (var j = 0; j < theParamsLength; j++) {      
											 if(theParams[j].name.toLowerCase() == 'flashvars'){     
													var theFlashVars = theParams[j].value;
											 }
									}
									var theOuterHTML = theObjects[i].outerHTML;
									var re = /<param name="FlashVars" value="">/ig;
									theOuterHTML = theOuterHTML.replace(re,"<param name='FlashVars' value='" + theFlashVars + "'>");
									theObjects[i].outerHTML = theOuterHTML;
							 } 
		 			} // End of for
		  }
		
		  var theObjects2 = document.getElementsByTagName('applet');  
		  var theObjectsLen2 = theObjects2.length;
		  
		  //alert("applet len ="+theObjectsLen2);
		
		  if (theObjectsLen2*1 > 0) {
		  		//alert("applet");
		 			for (var i = 0; i < theObjectsLen2; i++) {
							 if(theObjects2[i].outerHTML) {
							 	  //alert(theObjects2[i].outerHTML);
									if(theObjects2[i].data) {
								     theObjects2[i].removeAttribute('data');
									}
									//var theParams2 = theObjects2[i].getElementsByTagName("param");    
									//var theParamsLength2 = theParams2.length;
									//for (var j = 0; j < theParamsLength2; j++) {
											 //alert(theParams2.value);
									//}
					     }
		      }
		  }
		  
	} // End of if MSIE & MAC Browser
}

window.onunload = function() { 
	
	if (document.getElementsByTagName) {  
			
			var objs = document.getElementsByTagName("object");  
			
			for (i=0; i<objs.length; i++) {   
					objs[i].outerHTML = "";  
			} 

			var objs2 = document.getElementsByTagName("applet");  
			
			for (i=0; i<objs2.length; i++) {   
					objs2[i].outerHTML = "";  
			} 
	}
}