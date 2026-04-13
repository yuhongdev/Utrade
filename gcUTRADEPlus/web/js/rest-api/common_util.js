var root_url = "/gcSANS/";
var ref_path = root_url+"ref/";
var api_path = root_url+"srvs/";
var get_newkey_url = api_path+"getNewKey?"+$.now();
var public_dkey,public_dsalt,public_div,public_ekey,public_esalt,public_eiv,public_id;
var outputValue, inputValue;
var s = "",  msg = "";

function getMonth(n){
	var month = new Array();
	month[0] = "Jan";
	month[1] = "Feb";
	month[2] = "Mar";
	month[3] = "Apr";
	month[4] = "May";
	month[5] = "Jun";
	month[6] = "Jul";
	month[7] = "Aug";
	month[8] = "Sep";
	month[9] = "Oct";
	month[10] = "Nov";
	month[11] = "Dec";	
	return month[n];
}

function decimalPlaces(num) {
  var match = (''+num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!match) { return 0; }
  return Math.max(
       0,
       // Number of digits right of decimal point.
       (match[1] ? match[1].length : 0)
       // Adjust for scientific notation.
       - (match[2] ? +match[2] : 0));
}

Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function getCookie(key) {
	var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
	return keyValue ? keyValue[2] : null;
}

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

function loadPropertiesFile(path, fileName, callback){
	// initialize messageResource.js with settings
	messageResource.init({
	  // path to directory containing message resource files(.properties files),
	  // give empty string or discard this configuration if files are in the
	  // same directory as that of html file.
	  filePath : path
	});

	// will load the file 'path/messageresource/moduleName.properties'
	// and callbackFunction will be executed when loading is complete.
	messageResource.load(fileName, callback); 
	// file name without extension is taken as module name.

	// use messageResource.get function to get values from loaded file. 
	//messageResource.get('sourceCode', 'fundamental');
}


function MD5CheckSum(av){
	var cs = CryptoJS.MD5(av);
	return cs;
}



function getRestApiResp(targetUrl,ctP,jsonObject,aeP,respCallback){
	var jsonData = JSON.stringify(jsonObject);		
	inputValue = jsonData;
	//$("#input").val(jsonData);
	
	if(ctP != 0){
		encryptValue(function(output){
		outputValue=output}
		);
		ctP = ctP + "," + public_id ;
	}else{
		outputValue = inputValue;
	}
	
	if(outputValue != null){
			var csP = MD5CheckSum(outputValue);	
															
			$.ajax({
				type:"POST",
				datatype:"json",
				async:true,
				url:targetUrl+$.now(),
				data:{
					s:s,
					msg:msg,
					cs:csP.toString(),
					//ct:ctP + "," + public_id ,
					ct:ctP,
					ev:outputValue,
					ae:aeP			
				},
				success: function(data){
					if(data.ev == null || data.ev == ""){
						respCallback(data);
					}else if(CryptoJS.MD5(data.ev).toString() == data.cs) {
						if(data.ct != 0){
							data.ev = decryptFunction(data.ct, data.ev);
							//console_log(data.ev);
							respCallback(data);					
						}else{
							respCallback(data);					
						}
					}else if (CryptoJS.MD5(data.ev).toString() != data.cs){
						data.s = 406;
						data.msg = "Unexpected Error(Error Code : 406)"
						respCallback(data);
					}
				},
				error: function(jqXHR, textStatus){
					errorHandling(textStatus);
				}
			});
	}
}

function encryptValue(handleData){
	$.jCryption.getKeys(root_url+"key.jsp",
											function(e) {												
												$.jCryption.encrypt(inputValue,	e,
														function(f) {
															var encryptedValue = encValWAES(f);
															handleData(encryptedValue);

														}
												)
											}
	);
}

function errorHandling(textStatus){
	if(textStatus=="timeout"){
		console_log("Timeout.");
	}else if(textStatus=="error"){
		console_log("Error.");
	}else if(textStatus=="abort"){
		console_log("Abort.");
	}else if(textStatus=="parsererror"){
		console_log("Parser error.");
	}
	//alert("System under maintenance. Please kindly try again later.");
}

function console_log(text){
	if(debug_log)
		console.log(text);
}

function encValWAES(rv){	
	var av="",login_public;
	console_log("RSA Encrypted value: "+rv);
	getNewKey(function(output){login_public=output;});
	if(login_public!=null){
		public_dkey = login_public.dkey;
		public_dsalt = login_public.dsalt;
		public_div = login_public.div;
		public_ekey = login_public.ekey;
		public_esalt = login_public.esalt;
		public_eiv = login_public.eiv;
		public_id = login_public.id;
		console_log("Salt: "+public_dsalt);
		console_log("IV: "+public_div);
		console_log("ID: "+public_id);
		console_log("Encrypted Key: "+public_dkey);
		var aesUtilDec = new AesUtil(256,100);
		public_dkey = aesUtilDec.decrypt(public_dsalt,public_div,"wms in n2n is great!",public_dkey);
		console_log("Decrypted Key: "+public_dkey);

		var aesUtil = new AesUtil(256,100);
		av = aesUtil.encrypt(public_dsalt,public_div,public_dkey,rv);
		console_log("AES Encrypted value: "+av);
	}
	return av;
}

function decryptFunction(type, input){
	var result = "";
	
	if(type == "1"){
		var aesUtilDec = new AesUtil(256,100);
		tmp_public_ekey = aesUtilDec.decrypt(public_esalt,public_eiv,"wms in n2n is great!",public_ekey);	
		result = aesUtilDec.decrypt(public_esalt,public_eiv,tmp_public_ekey,input);
	}else{
		result = input;
	}
	
	return result;
}

function getNewKey(handleData){
	$.ajax({
		type:"GET",
		datatype:"json",
		async:false,
		url:get_newkey_url,
		success: function(data){
			handleData(data);
		},
		error: function(jqXHR, textStatus){
			errorHandling(textStatus);
		}
	});
}

$(document).ready(function() {
	$("#frmSelEnc").jCryption({ 
		getKeysURL:root_url+"key.jsp",
		beforeEncryption : function() {
			return true;
		}
	});
	
	
});

//validate unknown
function chkUndefined(val){
	if (val === undefined) {
	    return "";
	} else if (val == null || val == "null") {
		return "";
	}else {
		return val;
	}
}

// import js file
function loadScript(url, callback){
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}