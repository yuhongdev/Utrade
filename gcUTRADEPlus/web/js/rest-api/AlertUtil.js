var ttlRecord = 0;
var AlertType = { "alert": [ {"key":"98","value":"Stock Price"},{"key":"101","value":"Stock Volume"},{"key":"68","value":"Bid Price"},{"key":"88","value":"Ask Price"},{"key":"58","value":"Bid Volume"},{"key":"78","value":"Ask Volume"} ] };
var CompareType = { "compare": [ {"key":"0","value":"Absolute Value"},{"key":"1","value":"% Change"} ] };
var CompareType_News = { "compare": [ {"key":"31","value":"Financial Summary"},{"key":"32","value":"Entitlement"},{"key":"36","value":"Change in Substantial"} ] };
var Media = { "media": [ {"key":"-1","cd":"PN","value":"Push Notifications","Sts":"P"},{"key":"2","cd":"S","value":"Sms","Sts":"P"},{"key":"1","cd":"E","value":"Email","Sts":"P"} ] };
var atvLs = "";
var Condition = { "condition": [ {"key":"2","value":">"},{"key":"4","value":"<"},{"key":"3","value":">="},{"key":"5","value":"<="},{"key":"1","value":"="} ] };
var ExchList = { "exch": [ {"key":"MY","value":"Bursa(MY)"},{"key":"KLL","value":"Bursa(KLL)"},{"key":"KL","value":"Bursa(KL)"},{"key":"JK","value":"IDX"},{"key":"PH","value":"PSE"},{"key":"SG","value":"SGX"},{"key":"HN","value":"HSX(HN)"},{"key":"HC","value":"HSX(HC)"},{"key":"O","value":"NASDAQ"},{"key":"N","value":"NYSE(N)"},{"key":"A","value":"NYSE(A)"},{"key":"HK","value":"HKSE"},{"key":"MT","value":"CME Metal"},{"key":"FX","value":"Forex"},{"key":"ENG","value":"CME Energy"},{"key":"BK","value":"SET"} ] };
var devMdl = {"devMdl":[ {"key":"iPhone3,1","value":"iPhone 4"},{"key":"iPhone3,2","value":"iPhone 4"},{"key":"iPhone3,3","value":"iPhone 4"},{"key":"iPhone4,1","value":"iPhone 4s"},{"key":"iPhone5,1","value":"iPhone 5"},{"key":"iPhone5,2","value":"iPhone 5"},{"key":"iPhone5,3","value":"iPhone 5c"},{"key":"iPhone5,4","value":"iPhone 5c"},{"key":"iPhone6,1","value":"iPhone 5s"},{"key":"iPhone6,2","value":"iPhone 5s"},{"key":"iPhone7,2","value":"iPhone 6"},{"key":"iPhone7,1","value":"iPhone 6 Plus"},{"key":"iPhone8,1","value":"iPhone 6s"},{"key":"iPhone8,2","value":"iPhone 6s Plus"},{"key":"iPhone8,4","value":"iPhone SE"} ] };
var SortingItem = {"sort":[ {"key":"0","value":"Stock"},{"key":"1","value":"Alert Type"},{"key":"2","value":"Compare Type"},{"key":"5","value":"Media"},{"key":"6","value":"Last Edit"} ] };

/* Setting Area */
function sorting(){
	var val = $("#sortby").val();
	var cur = String(table.order()); 
	var curVal = cur.split(",");
	
	if(val == curVal[0]){
		if(curVal[1] == "desc")
			table.order([val, "asc"]).draw();
		else
			table.order([val, "desc"]).draw();
	}else{
		table.order([val, "asc"]).draw();
	}
}

function updateSetting(val){
	if(chkUndefined(getUrlParameter("bh")) == "017"){
		Media = { "media": [ {"key":"-1","cd":"PN","value":"Push Notifications","Sts":"P"} ] };
		ExchList  = { "exch": [ {"key":"SG","value":"SGX"} ] };
	}else if(chkUndefined(getUrlParameter("bh")) == "065"){
		Media = { "media": [ {"key":"-1","cd":"PN","value":"Push Notifications","Sts":"P"} ] };
		ExchList  = { "exch": [ {"key":"KL","value":"Bursa(KL)"} ] };
	}else if(chkUndefined(getUrlParameter("bh")) == "086"){
		Media = { "media": [ {"key":"-1","cd":"PN","value":"Push Notifications","Sts":"P"} ] };
		ExchList  = { "exch": [ {"key":"MY","value":"Bursa(MY)"} ] };
	}
}

function setAlertSt(val){
	var tbdy = "";
	var media = "";
	var sample = "";
	
	if(val.cd == "E"){
		media = "email";
		sample = "e.g abc@email.com";
	}else if(val.cd == "S"){
		media = "sms";
		sample = "e.g 01234567890";
	}else{
		media = "mpn";
		sample = "IMEI";
	}
	
	if(media != "mpn"){
		tbdy += "<tr style='vertical-align:middle'>";
		tbdy += "<th scope='row' style='vertical-align:middle' >";
		tbdy += "<label for='label' class='labelSet'>"+media.toUpperCase()+" </label>";
		tbdy += "<label class='switch pull-right'>";
		tbdy += "<input type='checkbox' class='switch-input' checked/>";
		tbdy += "<span class='switch-label' data-on='On' data-off='Off'></span>"; 
		tbdy += "<span class='switch-handle'></span>"; 
		tbdy += "</label>";
		tbdy += "</th>";
		tbdy += "<td>";
		tbdy += "<div class='form-group'>";
		tbdy += "<label for='m"+media+"'></label>";
		tbdy += "<input type='text' class='form-control input-sm' id='st_"+media+"' name='st_"+media+"' value='' placeholder='"+sample+"' onchange='javascript:chgAlrtAcc(\""+media.toUpperCase()+"\")'/>";
		tbdy += "</div>";
		tbdy += "<div class='form-group'>"; 
		tbdy += "<a href='javascript:edtAlrtAcc(\""+media.toUpperCase()+"\");' class='' data-dismiss='dropdown' id='edt"+media.toUpperCase()+"' > <span class='btn_gb6 btn_s3 glyphicon glyphicon-pencil ' aria-hidden='true'></span> </a>";
		tbdy += "<a href='javascript:alrtAccCd(\""+media.toUpperCase()+"\");' class='btn_gb6 btn_s3 ' data-dismiss='dropdown' id='act"+media.toUpperCase()+"'> Request Access Code </a>";
		//tbdy += "<a href='javascript:tstAlrtAcc(\""+media.toUpperCase()+"\");' class='btn_gb6 btn_s3 ' data-dismiss='dropdown' id='test"+media.toUpperCase()+"'> Test alert </a>";	
		tbdy += "</div>";
		tbdy += "<div id='act"+media.toUpperCase()+"_cd' class='form-group'>";
		tbdy += "<input type='text' class='form-control input-xs' id='st_"+media+"_cd' name='st_"+media+"_cd' placeholder='e.g 123456' maxlength='6' size='6' />";
		tbdy += "<a href='javascript:actAlrtAcc(\""+media.toUpperCase()+"\");' class='btn_gb6 btn_s3' data-dismiss='dropdown'> Activate </a>";  	 
		tbdy += "</div>";
		tbdy += "<div id='"+media+"_msg_s'>";  
		tbdy += "</div>";  
		tbdy += "</td>";
		tbdy += "</tr>";
	}else{

		tbdy += "<tr style='vertical-align:middle' class='push-notice'>";
		tbdy += "<th scope='row' style='vertical-align:middle'>";
		tbdy += "<label for='label' class='labelSet'>Push Notifications </label>";
		tbdy += "<label class='switch pull-right'>";
		tbdy += "<input type='checkbox' class='switch-input' checked/>";    
		tbdy += "<span class='switch-label' data-on='On' data-off='Off'></span>";
		tbdy += "<span class='switch-handle'></span>";
		tbdy += "</label>";
		tbdy += "</th>";
		tbdy += "<td>";  
		tbdy += "<div class='device-authorized-dropdown'>";
		tbdy += "<div class='device-authorized-dropdown-children' id='device_details'>";
		tbdy += "</div>";
		tbdy += "</div>";
		tbdy += "</td>";
		tbdy += "</tr>";
	}
	
	
	$("#setting_bdy").append(tbdy);
	
	if(val.cd == "E"){
		$("#st_email").val(val.DevKey);
		
		if(chkUndefined(val.Sts).toUpperCase() == "A"){
			$("#st_email").prop('disabled', true);
			$("#edtEMAIL").show();
			$("#testEMAIL").show();
			
			$("#actEMAIL").hide();
			$("#actEMAIL_cd").hide();
		}else if(chkUndefined(val.Sts).toUpperCase() == "P"){
			$("#st_email").prop('disabled', false);
			$("#actEMAIL").show();
			
			$("#edtEMAIL").hide();
			$("#testEMAIL").hide();
			$("#actEMAIL_cd").hide();
		}
	}else if(val.cd == "S"){
		$("#st_sms").val(val.DevKey);
		
		if(chkUndefined(val.Sts).toUpperCase() == "A"){
			$("#st_sms").prop('disabled', true);
			$("#edtSMS").show();
			$("#testSMS").show();
			
			$("#actSMS").hide();
			$("#actSMS_cd").hide();
		}else if(chkUndefined(val.Sts).toUpperCase() == "P"){
			$("#st_sms").prop('disabled', false);
			$("#actSMS").show();
			
			$("#edtSMS").hide();
			$("#testSMS").hide();
			$("#actSMS_cd").hide();
		}
	}
}

function chgAlrtAcc(val){
	var mdn = val.toUpperCase();
	
	if(mdn == "SMS"){
		$("#actSMS").show();
	}else if(mdn == "EMAIL"){
		$("#actEmail").show();
	}else if(mdn == "MPN"){
		$("#actMPN").show();
	}
}

function edtAlrtAcc(val){
	if(val.toUpperCase() == "SMS"){
		$("#st_sms").prop('disabled', false);
		$("#actSMS_cd").hide();
		$("#edtSMS").hide();
		$("#testSMS").hide();
		$("#actSMS").show();
	}else if(val.toUpperCase() == "EMAIL"){
		$("#st_email").prop('disabled', false);
		$("#actEmail_cd").hide();
		$("#edtEmail").hide();
		$("#testEmail").hide();
		$("#actEmail").show();
	}else if(val.toUpperCase() == "MPN"){
		$("#st_mpn").prop('disabled', false);
		$("#actMPN_cd").hide();
		$("#edtMPN").hide();
		$("#testMPN").hide();
		$("#actMPN").show();
	}
}

function chgSuggest(){
	arrStkCodeName = function() {
  		var exch = $('#Exchange_N').val();
  		arrStkCodeName = "";
  		
  		if(exch == "A")
			arrStkCodeName = arrStkCodeName_A;
		else if(exch == "BK")
			arrStkCodeName = arrStkCodeName_BK;
		else if(exch == "ENG")
			arrStkCodeName = arrStkCodeName_ENG;
		else if(exch == "FX")
			arrStkCodeName = arrStkCodeName_FX;
		else if(exch == "HC")
			arrStkCodeName = arrStkCodeName_HC;
		else if(exch == "HK")
			arrStkCodeName = arrStkCodeName_HK;
		else if(exch == "HN")
			arrStkCodeName = arrStkCodeName_HN;
		else if(exch == "JK")
			arrStkCodeName = arrStkCodeName_JK;
		else if(exch == "KL")
			arrStkCodeName = arrStkCodeName_KL;
		else if(exch == "KLL")
			arrStkCodeName = arrStkCodeName_KLL;
		else if(exch == "MT")
			arrStkCodeName = arrStkCodeName_MT;
		else if(exch == "MY")
			arrStkCodeName = arrStkCodeName_MY;
		else if(exch == "N")
			arrStkCodeName = arrStkCodeName_N;
		else if(exch == "O")
			arrStkCodeName = arrStkCodeName_O;
		else if(exch == "PH")
			arrStkCodeName = arrStkCodeName_PH;
		else if(exch == "SG")
			arrStkCodeName = arrStkCodeName_SG;
  	};
  	
	var exch = $('#Exchange_N').val();
	
	if(exch == "MY"){
		$('#SpotMth_btn').show();
		if($('#txtStkCodeSearch').css('display') != 'none')
			$('#SpotMth_N').hide();
		$('#StkCode_input').removeClass('form-group col-xs-12').addClass('form-group col-xs-11');
	}else{
		$('#SpotMth_btn').hide();
		$('#SpotMth_N').hide();
		$('#StkCode_input').removeClass('form-group col-xs-11').addClass('form-group col-xs-12');
	}
	
	if(exch == "A" && chkUndefined(arrStkCodeName_A) != "")
		arrStkCodeName = arrStkCodeName_A;
	else if(exch == "BK" && chkUndefined(arrStkCodeName_BK) != "")
		arrStkCodeName = arrStkCodeName_BK;
	else if(exch == "ENG" && chkUndefined(arrStkCodeName_ENG) != "")
		arrStkCodeName = arrStkCodeName_ENG;
	else if(exch == "FX" && chkUndefined(arrStkCodeName_FX) != "")
		arrStkCodeName = arrStkCodeName_FX;
	else if(exch == "HC" && chkUndefined(arrStkCodeName_HC) != "")
		arrStkCodeName = arrStkCodeName_HC;
	else if(exch == "HK" && chkUndefined(arrStkCodeName_HK) != "")
		arrStkCodeName = arrStkCodeName_HK;
	else if(exch == "HN" && chkUndefined(arrStkCodeName_HN) != "")
		arrStkCodeName = arrStkCodeName_HN;
	else if(exch == "JK" && chkUndefined(arrStkCodeName_JK) != "")
		arrStkCodeName = arrStkCodeName_JK;
	else if(exch == "KL" && chkUndefined(arrStkCodeName_KL) != "")
		arrStkCodeName = arrStkCodeName_KL;
	else if(exch == "KLL" && chkUndefined(arrStkCodeName_KLL) != "")
		arrStkCodeName = arrStkCodeName_KLL;
	else if(exch == "MT" && chkUndefined(arrStkCodeName_MT) != "")
		arrStkCodeName = arrStkCodeName_MT;
	else if(exch == "MY" && chkUndefined(arrStkCodeName_MY) != "")
		arrStkCodeName = arrStkCodeName_MY;
	else if(exch == "N" && chkUndefined(arrStkCodeName_N) != "")
		arrStkCodeName = arrStkCodeName_N;
	else if(exch == "O" && chkUndefined(arrStkCodeName_O) != "")
		arrStkCodeName = arrStkCodeName_O;
	else if(exch == "PH" && chkUndefined(arrStkCodeName_PH) != "")
		arrStkCodeName = arrStkCodeName_PH;
	else if(exch == "SG" && chkUndefined(arrStkCodeName_SG) != "")
		arrStkCodeName = arrStkCodeName_SG;
	else
		getSuggestionJS($('#Exchange_N').val())
}

//set setting
function setting(){
	for(var i = 0; i < AlertType.alert.length; i++){
		var alert = AlertType.alert[i];
		$('#AlertType_E').append($("<option></option>").attr("value",alert.key).text(alert.value));
		
		if(i==0)
			$('#AlertType_N').append($("<option></option>").attr("value",alert.key).text(alert.value).prop("selected",true));
		else
			$('#AlertType_N').append($("<option></option>").attr("value",alert.key).text(alert.value));
	}

	for(var i = 0; i < CompareType.compare.length; i++){
		var compare = CompareType.compare[i];
		$('#CompareType_E').append($("<option></option>").attr("value",compare.key).text(compare.value));
		
		if(i==0)
			$('#CompareType_N').append($("<option></option>").attr("value",compare.key).text(compare.value).prop("selected",true));
		else
			$('#CompareType_N').append($("<option></option>").attr("value",compare.key).text(compare.value));
	}

	for(var i = 0; i < Condition.condition.length; i++){
		var condition = Condition.condition[i];
		$('#Condition_E').append($("<option></option>").attr("value",condition.key).text(condition.value));
		
		if(i==0)
			$('#Condition_N').append($("<option></option>").attr("value",condition.key).text(condition.value).prop("selected",true));
		else
			$('#Condition_N').append($("<option></option>").attr("value",condition.key).text(condition.value));
	}

	for(var i = 0; i < Media.media.length; i++){
		var media = Media.media[i];
		$('#Media_E').append($("<option></option>").attr("value",media.key).text(media.value));
		
		if(i==0){
			$('#Media_N').append($("<option></option>").attr("value",media.key).text(media.value).prop("selected",true));
			$('#Media_N').prop('disabled', true);
			$('#Media_E').prop('disabled', true);
			$('#Media_N').hide();
			$('#Media_E').hide();
			$('#label_Media_N').append(media.value);
			$('#label_Media_E').append(media.value);
		}else{
			$('#Media_N').append($("<option></option>").attr("value",media.key).text(media.value));
			$('#Media_N').prop('disabled', false);
			$('#Media_E').prop('disabled', false);
			$('#Media_N').show();
			$('#Media_E').show();
			$('#label_Media_N').empty();
			$('#label_Media_E').empty();
		}
	}

	for(var i = 0; i < ExchList.exch.length; i++){
		var exch = ExchList.exch[i];
		
		if(i==0){
			$('#Exchange_N').append($("<option></option>").attr("value",exch.key).text(exch.value).prop("selected",true));
			$('#Exchange_N').prop('disabled', true);
			$('#Exchange_N').hide();
			$('#label_Exchange_N').append(exch.value);
		}else{
			$('#Exchange_N').append($("<option></option>").attr("value",exch.key).text(exch.value));
			$('#Exchange_N').prop('disabled', false);
			$('#Exchange_N').show();
			$('#label_Exchange_N').empty();
		}
	}
	
	for(var i = 0; i < SortingItem.sort.length; i++){
		var sorting = SortingItem.sort[i];
		
		if(i==0)
			$('#sortby').append($("<option></option>").attr("value",sorting.key).text(sorting.value).prop("selected",true));
		else
			$('#sortby').append($("<option></option>").attr("value",sorting.key).text(sorting.value));
	}
	
	for(var i = 0; i < spotMonth.length; i++){
		var spotMth = spotMonth[i];
		var key = spotMth[0].split(".");
		var value = spotMth[1].split(".");
		
		if(i==0)
			$('#SpotMth_N').append($("<option></option>").attr("value",key[0]).text(key[0]+" ("+value[0]+")").prop("selected",true));
		else
			$('#SpotMth_N').append($("<option></option>").attr("value",key[0]).text(key[0]+" ("+value[0]+")"));
	}
}

/* Activate Area*/
function resetFTSt(val){
	if(val.toUpperCase() == "SMS"){
		$('#sms_msg_f').empty();
		$("#sms-ft-step2").hide();
	}else if(val.toUpperCase() == "EMAIL"){
		$('#email_msg_f').empty();
		$("#email-ft-step2").hide();
	}
}

/* Alert Area */
function edtAlrt(val){
	var cur_stockCode = document.getElementById("stockCode_"+val).textContent;
	var cur_alertType = document.getElementById("alertType_"+val).textContent;
	var cur_compareType = document.getElementById("compareType_"+val).textContent;
	var cur_media = document.getElementById("media_"+val).textContent;
	var cur_limit = document.getElementById("limit_"+val).textContent;
	var cur_condition = document.getElementById("condition_"+val).textContent;
	var cur_remark = document.getElementById("remark_"+val).textContent;
	
	$('#edt_alert_lmt').empty();
	$('#StockName_E').html(cur_stockCode);
	$('#AlertType_E').val(mapAlertType(cur_alertType, ""));
	$('#CompareType_E').val(mapCompareType(cur_compareType, ""));
	$('#Media_E').val(mapMedia(cur_media, "", ""));
	$('#Limit_E').val(cur_limit);
	$('#Condition_E').val(mapCondition(htmlDecode(cur_condition), ""));
	$('#Remark_E').val(htmlDecode(cur_remark.trim()));
	$("#Undo_E").attr("onclick","edtAlrt("+val+")");
	$("#Save_E").attr("onclick","updAlrtD("+val+")");
}

function clrAddAlrt(val){
    $('#Media_N').val($("#Media_N option:first").val());
    //$('#Exchange_N').val($("#Exchange_N option:first").val());
    chgSuggest();
    $('#txtStkCodeSearch').val("");
    $('#add_alert_stkcd').empty();
    $('#AlertType_N').val($("#AlertType_N option:first").val());
    $('#CompareType_N').val($("#CompareType_N option:first").val());
    $('#Condition_N').val($("#Condition_N option:first").val());
    $('#Limit_N').val("");    
    $('#add_alert_lmt').empty();
	$('#Remark_N').val("");
}

function autoAddAlert(){
	var stkCodeFTCPlus = chkUndefined(getUrlParameter("stkCd"));
	var exCodeFTCPlus = chkUndefined(getUrlParameter("exCd"));
	var sugStk = "";
	
	if(stkCodeFTCPlus != "" && exCodeFTCPlus != ""){
		$("#Exchange_N").val(exCodeFTCPlus);
		
		getCorrectSug(exCodeFTCPlus, stkCodeFTCPlus);
	}
}

function refresh(){
	$(".container-fluid").show();
	$(".topbar").show();
	$("#sts_setting").show();
	$("#tbl_col_alert").show();
	$("#note").show();
	
	alrtLs();
}

/* Mapping Area */
function mapAlertType(val, key){
	for(var i = 0; i < AlertType.alert.length; i++){
		var alert = AlertType.alert[i];
		
		if(alert.value == val){
			return alert.key;
		}else if(alert.key == key){
			return alert.value;
		}
	}
}

function mapCondition(val, key){
	for(var i = 0; i <  Condition.condition.length; i++){
		var cdn = Condition.condition[i];
		
		if(cdn.value == val){
			return cdn.key;
		}else if(cdn.key == key){
			return cdn.value;
		}
	}
}

function mapCompareType(val, key){
	for(var i = 0; i < CompareType.compare.length; i++){
		var comp = CompareType.compare[i];
		
		if(comp.value == val){
			return comp.key;
		}else if(comp.key == key){
			return comp.value;
		}
	}
}

function mapMedia(val, key, cd){
	for(var i = 0; i <  Media.media.length; i++){
		var mdn = Media.media[i];
		
		if(mdn.value == val){
			return mdn.key;
		}else if(mdn.key == key){
			return mdn.value;
		}else if(mdn.cd == cd){
			return mdn.value;
		}
	}
}

function mapDevMdl(key, mdl){
	for(var i = 0; i < devMdl.devMdl.length; i++){
		var devMdlObj = devMdl.devMdl[i];
		
		if(key != ""){
			if(devMdlObj.key == key)
				return devMdlObj.value;
		}else if(mdl != ""){
			if(devMdlObj.value == mdl)
				return devMdlObj.key;
		}
	}
	
	return key+mdl;
}

function mapSptMth(code, name){
	for(var i = 0; i < spotMonth.length; i++){
		var spotMth = spotMonth[i];
		var arrName = spotMth[0].split(".");
		var arrCode = spotMth[1].split(".");
		
		if(code != ""){
			if(arrCode[0] == code)
				return arrName[0];
		}else{
			if(arrName[0] == name)
				return arrCode[0];
		}
	}

	return code+name;
}

/* Checking Area */
function chkAlertType(val){
	$('#CompareType_'+val).find('option').remove().end();
	
	if($('#AlertType_'+val).val() == "NEWS"){
		$("#CompareType_"+val).prop('disabled', false);
		$("#Limit_"+val).prop('disabled', true);
		$("#Condition_"+val).prop('disabled', true);
		
		for(var i = 0; i < CompareType_News.compare.length; i++){
			var compare = CompareType_News.compare[i];
		
			if(i==0)
				$('#CompareType_'+val).append($("<option></option>").attr("value",compare.key).text(compare.value).prop("selected",true));
			else
				$('#CompareType_'+val).append($("<option></option>").attr("value",compare.key).text(compare.value));
		}
	}
	
	if($('#AlertType_'+val).val() == "98"){
		$("#CompareType_"+val).prop('disabled', false);
		$("#Limit_"+val).prop('disabled', false);
		$("#Condition_"+val).prop('disabled', false);
		$("#Condition_"+val).val("2");
		
		for(var i = 0; i < CompareType.compare.length; i++){
			var compare = CompareType.compare[i];
		
			if(i==0)
				$('#CompareType_'+val).append($("<option></option>").attr("value",compare.key).text(compare.value).prop("selected",true));
			else
				$('#CompareType_'+val).append($("<option></option>").attr("value",compare.key).text(compare.value));
		}
	}
	
	if($('#AlertType_'+val).val() == "68" || $('#AlertType_'+val).val() == "88" || $('#AlertType_'+val).val() == "58" || $('#AlertType_'+val).val() == "78" || $('#AlertType_'+val).val() == "101"){
		$("#CompareType_"+val).prop('disabled', false);
		$("#Limit_"+val).prop('disabled', false);
		$("#Condition_"+val).prop('disabled', false);
		$("#Condition_"+val).val("2");
		
		for(var i = 0; i < CompareType.compare.length; i++){
			var compare = CompareType.compare[i];
			
			if(compare.key == '0'){
				if(i==0)
					$('#CompareType_'+val).append($("<option></option>").attr("value",compare.key).text(compare.value).prop("selected",true));
				else
					$('#CompareType_'+val).append($("<option></option>").attr("value",compare.key).text(compare.value));
			}
		}
	}
}

function checkMedia(val){
	var defMediaLs = Media.media;

	if(val == "N")
		val = $("#Media_N").val();
	else if(val == "E")
		val = $("#Media_E").val();	

	for(var i=0; i<defMediaLs.length; i++){
		var obj = defMediaLs[i];
		
		if(obj.key == val){
			if(Sts != "A"){
				alert("This media is inactivate now. Please activate it.");
			}
		}
	}
}

function updateMedia(){
	var defMediaLs = Media.media;
	var currMediaLs = atvLs.media;
	
	for(var i=0; i<defMediaLs.length; i++){
		var obj = defMediaLs[i];
		
		if(obj.cd == "S" || obj.cd == "E"){
			for(var j=0; j<currMediaLs.length;j++){
				var obj1 = currMediaLs[j];
				
				if(obj.key == obj1.key){
					defMediaLs[i].Sts = "A";
				}
			}
		}else{
			for(var j=0; j<currMediaLs.length;j++){
				var obj1 = currMediaLs[j];
				
				if(obj1.key != 1 && obj1.key != 2){
					defMediaLs[i].key = obj1.key;
					defMediaLs[i].Sts = "A";
				}
			}
		}
	}
}

function valNum(val){
	if(isNaN(val))
		return false;
	else
		return true;
}

function valEmail(val){
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  
	if (val == '' || !val.match(mailformat))
	    return false;
	else
		return true;
}

function valPhone(val){
	var phoneno = /^\d{11}$/;  
	if(val.match(phoneno))  
		return true;
	else
		return false;
}

function htmlDecode(input){
	var e = document.createElement('div');
	e.innerHTML = input;
	return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function isOdd(num){
	return num % 2;
}

function checkMedia(val){
	var defMediaLs = Media.media;

	if(val == "N")
		val = $("#Media_N").val();
	else if(val == "E")
		val = $("#Media_E").val();

	for(var i=0; i<defMediaLs.length; i++){
		var obj = defMediaLs[i];
	
		if(obj.key == val){
			if(obj.Sts != "A"){
				alert("This media is inactivate now.Please activate it.");
			}
		}
	}
}

var presentValN = "";
var presentValE = "";

function valLimitN(){
        var val = $("#Limit_N").val().trim().split(".");
        var val1 = chkUndefined(val[0]);
        var val2 = chkUndefined(val[1]);

        if(val1.length > 10 || val2.length > 3){
                $("#Limit_N").val(presentValN);
        }else{
                if(valNum($("#Limit_N").val())){
                        presentValN = $("#Limit_N").val();
                }else{
                        alert("Value must be Numberic");
                }
        }
}

function valLimitE(){
        var val = $("#Limit_E").val().trim().split(".");
        var val1 = chkUndefined(val[0]);
        var val2 = chkUndefined(val[1]);

        if(val1.length > 10 || val2.length > 3){
                $("#Limit_E").val(presentValE);
        }else{
                if(valNum($("#Limit_E").val())){
                        presentValE = $("#Limit_E").val();
                }else{
                        alert("Value must be Numberic");
                }
        }
}

function chgStkInput(){
	if($('#txtStkCodeSearch').css('display') == 'none'){
		$('#SpotMth_N').hide();
		$('#txtStkCodeSearch').show();
	}else if($('#SpotMth_N').css('display') == 'none'){
		$('#SpotMth_N').show();
		$('#txtStkCodeSearch').hide();
	}
}
