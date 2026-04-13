var reqMedia = "";
var cur_sms = "";
var cur_mail = "";
var rmTr = "";
var timer = "";
var isFirst = true;
var url = "/gcSANS/web/html/StockAlert.html?jwt=[JWT]&bh=[BH]&appId=[AppId]&jwts=[JWTs]&stkCd=[StkCd]&exCd=[ExCd]";
var err_url = "https://poc.asiaebroker.com/gcSANS/web/html/error.html";
var table = "";

/* Login Area */
//verify first time login
function newClient(val){
	var jsonObject = {};
	
	jsonObject['jwt'] = chkUndefined(getUrlParameter("jwt"));
	jsonObject['bh'] = chkUndefined(getUrlParameter("bh"));
	jsonObject['appId'] = chkUndefined(getUrlParameter("appId"));
	jsonObject['jwts'] = chkUndefined(getUrlParameter("jwts"));
	
	console.log(JSON.stringify(jsonObject));
	newClientReq(jsonObject);
}

function newClientResp(data){
	console.log("newClientResp:"+JSON.stringify(data));
	
	if(data.s == "200"){
		var ev = JSON.parse(data.ev);
		var result = ev.result;
		var cur_mail = ev.cur_mail;
		var cur_mbn = ev.cur_mbn;
		var spr_id = ev.sponsorId;
		updateSetting(spr_id);
		var jwt = ev.jwt;
		var mediaLs = [];
		var defMediaLs = Media.media;
		var isNoPush = true;
		
		$("#ft_activate_bdy").empty();
		
		url = url.replace("[JWT]",jwt.replace("\"","").replace("\"",""));
		url = url.replace("[BH]",chkUndefined(getUrlParameter("bh")));
		url = url.replace("[AppId]",chkUndefined(getUrlParameter("appId")));
		url = url.replace("[StkCd]",chkUndefined(getUrlParameter("stkCd")));
		url = url.replace("[ExCd]",chkUndefined(getUrlParameter("exCd")));
		url = url.replace("[JWTs]","R");
		
		window.history.pushState("object or string", "Title", url);
		
		for(var i=0; i<defMediaLs.length; i++){
			var obj = defMediaLs[i];
			var tbdy = "";
			
			if(obj.cd == "E"){
				media = "email";
				sample = "e.g abc@email.com";
			}else if(obj.cd == "S"){
				media = "sms";
				sample = "e.g 01234567890";
			}else{
				media = "push notification";
			}
			
			tbdy += "<tr>";
			tbdy += "<th scope='row'>"+media.toUpperCase()+"<br/></th>";
			tbdy += "<td>";
			
			if(obj.cd == "E" || obj.cd == "S"){
				tbdy += "<div id='"+media+"-ft-step1'class='form-group'>";
				tbdy += "<input type='text' class='form-control input-xs' id='st_"+media+"_f' name='st_"+media+"_f' placeholder='"+sample+"' onkeydown='javascript:resetFTSt(\""+media.toUpperCase()+"\")'/>";
				tbdy += "<a href='javascript:alrtAccCdF(\""+media.toUpperCase()+"\");' class='btn_gb6 btn_s3' data-dismiss='dropdown' id='actcd"+media.toUpperCase()+"F'> Request Access Code </a>";
				tbdy += "</div>";
				tbdy += "<div id='"+media+"-ft-step2' class='form-group'  style='display: none;'>";
				tbdy += "<input type='text' class='form-control input-xs' id='"+media+"_actcd_f' name='"+media+"_actcd_f' placeholder='e.g 123456' maxlength='6' size='6' />";
				tbdy += "<a href='javascript:actAlrtAccF(\""+media.toUpperCase()+"\");' class='btn_gb6 btn_s3' data-dismiss='dropdown' id='act"+media.toUpperCase()+"F'> Activate </a>";	
				tbdy += "</div>";
				tbdy += "<div id='"+media+"_msg_f'></div>";
			}else{
				tbdy += "<div>In order to receive push notification, please turn on the receive notification setting on our mobile application.</div>";
			}
			
			tbdy += "</td>";
			tbdy += "</tr>";
			$("#ft_activate_bdy").append(tbdy);
            
			setAlertSt(obj);
		}
		
		for(var j=0; j<result.length; j++){
			var obj1 = result[j];
			var status = obj1.Sts;
			
			if(obj1.BundleCd == "E"){
				if(cur_mail != obj1.DevKey){
					$("#email_msg_f").html("<div id='sms-req-fail' class='alert alert-danger fade in' style='margin-top:10px;'>" +
										   "<a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> " +
										   "Current Email["+cur_mail+"] is different with Alert Email["+obj1.DevKey+"]. Please make sure Alert Email is available or update Current Email as Alert Email.</div>");
				}
				
				$("#st_email").val(obj1.DevKey);
				$("#st_email_f").val(obj1.DevKey);
				
				$("#st_email").prop('disabled', true);
				$("#edtEMAIL").show();
				$("#testEMAIL").show();
				$("#actEMAIL").hide();
				$("#actEMAIL_cd").hide();
			}else if(obj1.BundleCd == "S"){
				if(cur_mbn != obj1.DevKey){
					$("#sms_msg_f").html("<div id='sms-req-fail' class='alert alert-danger fade in' style='margin-top:10px;'>" +
										   "<a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> " +
										   "Current Contact Number["+cur_mbn+"] is different with Alert Contact Number["+obj1.DevKey+"]. Please make sure Alert Contact Number is available or update Current Contact Number as Alert Contact Number.</div>");
				}
				
				$("#st_sms").val(obj1.DevKey);
				$("#st_sms_f").val(obj1.DevKey);
				
				$("#st_sms").prop('disabled', true);
				$("#edtSMS").show();
				$("#testSMS").show();
				$("#actSMS").hide();
				$("#actSMS_cd").hide();
			}else{
				var deviceBdy = "";
				deviceBdy += "<div class='device-authorized-dropdown-child'>";
				deviceBdy += "<div class='vertical-center-outer'>";
				deviceBdy += "<div class='vertical-center-inner'>";
				deviceBdy += "<span class='device-title'>"+mapDevMdl(obj1.DevMdl,"")+"</span><br>";
				deviceBdy += "<span>Create on: September 10, 2016</span>";
				deviceBdy += "</div>";
				deviceBdy += "</div>";
				deviceBdy += "<div data-toggle='confirmation' data-placement='left'  title='Remove Device?' class='device-authorized-dropdown-icon'>";
				deviceBdy += "<span class='btn_gb6 glyphicon glyphicon-remove ' aria-hidden='true'></span>";
				deviceBdy += "</div>";
				deviceBdy += "</div>";
				
				$("#device_details").append(deviceBdy);
				isNoPush = false;
			}
			
			if(status != "P")
				isFirst = false;
			
			var mdnObject = {};
			
			mdnObject['key'] = obj1.BundleId;
			mdnObject['cd'] = obj1.BundleCd;
			
			mediaLs.push(mdnObject);
		}
		
		if(isNoPush)
			$("#device_details").append("No mobile device is registered");
		
		var mdnList = {};
		mdnList['media'] = mediaLs;
		atvLs = mdnList;
		
		updateMedia();
		setting();
		
		if(isFirst){
			$("#menu3").click();
			$("#menu2").attr('data-target','#modal-actSMS');
			$("#menu1").attr('data-target','#modal-actSMS');
		}else{	
			var stkCodeFTCPlus = chkUndefined(getUrlParameter("stkCd"));
			var exCodeFTCPlus = chkUndefined(getUrlParameter("exCd"));
		
			if(stkCodeFTCPlus == '' || exCodeFTCPlus == '' ||
			   !(JSON.stringify(ExchList).indexOf(exCodeFTCPlus) > -1)){
				refresh();
			}else{
				autoAddAlert();
				isRefresh = true;
			}
		}

		chgSuggest();
	}else{
		$('.container').empty();
		alert(data.msg);
		window.location = err_url;
	}
}

/*send Activate Code (First Time)*/
function alrtAccCdF(val){
	var jsonObject = {};
	
	var mdn = val.toUpperCase();
	jsonObject['opt'] = 'A';
	jsonObject['mdn'] = mdn;
	jsonObject['jwt'] = chkUndefined(getUrlParameter("jwt"));
	jsonObject['bh'] = chkUndefined(getUrlParameter("bh"));
	jsonObject['appId'] = chkUndefined(getUrlParameter("appId"));
	jsonObject['jwts'] = chkUndefined(getUrlParameter("jwts"));
	reqMedia = mdn;
	
	if(mdn == "SMS"){
		$('#sms_msg_f').empty();
		
		if(!valPhone($("#st_sms_f").val())){
			$("#sms_msg_f").html("<div id='sms-req-fail' class='alert alert-danger fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> Please provide a valid contact number.</div>");
			return false;
		}
		
		jsonObject['mbn'] = "6"+$("#st_sms_f").val();
	}else if(mdn == "EMAIL"){
		$('#email_msg_f').empty();
		jsonObject['mail'] = $("#st_email_f").val();
	
		if(!valEmail($("#st_email_f").val())){
			$("#email_msg_f").html("<div id='email-req-fail' class='alert alert-danger fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> Please provide a valid email.</div>");
			return false;
		}
	}

	console.log(JSON.stringify(jsonObject));
	alrtAccCdFReq(jsonObject);
}

/*Return Activate Code (First Time)*/
function alrtAccCdFResp(data){
	console.log("alrtCdFResp:"+JSON.stringify(data));
	
	if(data.s&&data.s=="200"){
		var obj = JSON.parse(data.ev);
		var mdn = obj.mdn.toUpperCase();
		var jwt = obj.jwt;
		
		url = url.replace("[JWT]",jwt.replace("\"","").replace("\"",""));
		url = url.replace("[BH]",chkUndefined(getUrlParameter("bh")));
		url = url.replace("[AppId]",chkUndefined(getUrlParameter("appId")));
		url = url.replace("[StkCd]",chkUndefined(getUrlParameter("stkCd")));
		url = url.replace("[ExCd]",chkUndefined(getUrlParameter("exCd")));
		url = url.replace("[JWTs]","R");
		
		window.history.pushState("object or string", "Title", url);
		
		if(mdn == "SMS"){
			$('#sms_msg_f').empty();
			$("#sms-ft-step2").show();
			$("#sms_msg_f").html("<div id='sms-req-succ' class='alert alert-success fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> <strong>Your request is successfully process! </strong> Please get the code from SMS[<strong>"+obj.mbn+"</strong>] to activate this application</div>");
		}else if(mdn == "EMAIL"){
			$('#email_msg_f').empty();
			$("#email-ft-step2").show();
			$("#email_msg_f").html("<div id='email-req-succ' class='alert alert-success fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> <strong>Your request is successfully process! </strong> Please get the code from E-mail[<strong>"+obj.mail+"</strong>] to activate this application</div>");
		}
	}else{
		if(reqMedia == "SMS"){
			$('#sms_msg_f').empty();
			$("#sms_msg_f").html("<div id='sms-req-fail' class='alert alert-danger fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> "+data.msg+"</div>");
		}else if(reqMedia == "EMAIL"){
			$('#email_msg_f').empty();
			$("#email_msg_f").html("<div id='email-req-fail' class='alert alert-danger fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> "+data.msg+"</div>");
		}
	}
}

/*activate Alert (First time)*/
function actAlrtAccF(val){
	var jsonObject = {};

	var mdn = val.toUpperCase();
	jsonObject['opt'] = 'U';
	jsonObject['mdn'] = mdn;
	jsonObject['jwt'] = chkUndefined(getUrlParameter("jwt"));
	jsonObject['bh'] = chkUndefined(getUrlParameter("bh"));
	jsonObject['appId'] = chkUndefined(getUrlParameter("appId"));
	jsonObject['jwts'] = chkUndefined(getUrlParameter("jwts"));
	reqMedia = mdn;
	
	if(mdn == "SMS"){
		jsonObject['mbn'] = $("#st_sms_f").val();
		jsonObject['acd'] = $("#sms_actcd_f").val();
	}else if(mdn == "EMAIL"){
		jsonObject['mail'] = $("#st_email_f").val();
		jsonObject['acd'] = $("#email_actcd_f").val();
	}

	console.log(JSON.stringify(jsonObject));
	actAlrtAccFReq(jsonObject);
}

/*response of activate alert (First time)*/
function actAlrtAccFResp(data){
	console.log("actAlrtFResp:"+JSON.stringify(data));
	
	if(data.s&&data.s=="200"){
		var obj = JSON.parse(data.ev);
		var mdn = obj.mdn.toUpperCase();
		var jwt = obj.jwt;
		
		url = url.replace("[JWT]",jwt.replace("\"","").replace("\"",""));
		url = url.replace("[BH]",chkUndefined(getUrlParameter("bh")));
		url = url.replace("[AppId]",chkUndefined(getUrlParameter("appId")));
		url = url.replace("[StkCd]",chkUndefined(getUrlParameter("stkCd")));
		url = url.replace("[ExCd]",chkUndefined(getUrlParameter("exCd")));
		url = url.replace("[JWTs]","R");
		
		window.history.pushState("object or string", "Title", url);
		
		var result = obj.result;
		setAlertSt(result);
		
		$("#menu2").attr('data-target','#modal-addSMS');
		
		if(mdn == "SMS"){
			$('#st_sms_f').prop('disabled', true);
			$('#actcdSMSF').hide();
			$('#sms_actcd_f').prop('disabled', true);
			$('#actSMSF').hide();
			
			$('#sms_msg_f').empty();
			$("#sms_msg_f").html("<div id='sms-req-succ' class='alert alert-success fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> <strong>Your SMS Alert is successfully activated!</strong></div>");
		}else if(mdn == "EMAIL"){
			$('#st_email_f').prop('disabled', true);
			$('#actcdEMAILF').hide();
			$('#email_actcd_f').prop('disabled', true);
			$('#actEMAILF').hide();
			
			$('#email_msg_f').empty();
			$("#email_msg_f").html("<div id='email-req-succ' class='alert alert-success fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> <strong>Your E-mail Alert is successfully activated!</strong></div>");
		}
	}else{
		if(reqMedia == "SMS"){
			$('#sms_msg_f').empty();
			$("#sms_msg_f").html("<div id='sms-req-fail' class='alert alert-danger fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> <strong>Your Activation code is Invalid!</strong></div>");
		}else if(reqMedia == "EMAIL"){
			$('#email_msg_f').empty();
			$("#email_msg_f").html("<div id='email-req-fail' class='alert alert-danger fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> <strong>Your Activation code is Invalid!</strong></div>");
		}
	}
}

/* Setting Area */
/*send Activate Code*/
function alrtAccCd(val){
	var jsonObject = {};
	
	var mdn = val.toUpperCase();
	jsonObject['opt'] = 'A';
	jsonObject['mdn'] = mdn;
	jsonObject['jwt'] = chkUndefined(getUrlParameter("jwt"));
	jsonObject['bh'] = chkUndefined(getUrlParameter("bh"));
	jsonObject['appId'] = chkUndefined(getUrlParameter("appId"));
	jsonObject['jwts'] = chkUndefined(getUrlParameter("jwts"));
	reqMedia = mdn;
	
	if(mdn == "SMS"){
		if(cur_sms == $("#st_sms").val()  || $("#st_email").val() == ""){
			$("#sms_msg_s").html("<div id='sms-req-fail' class='alert alert-danger fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> Please provide a new contact number.</div>");
			return false;
		}
		
		if(!valPhone($("#st_sms").val())){
			$("#sms_msg_s").html("<div id='sms-req-fail' class='alert alert-danger fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> Please provide a valid contact number.</div>");
			return false;
		}
			
		jsonObject['mbn'] = "6"+$("#st_sms").val();
	}else if(mdn == "EMAIL"){
		if(cur_mail == $("#st_email").val() || $("#st_email").val() == ""){
			$("#email_msg_s").html("<div id='email-req-fail' class='alert alert-danger fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> Please provide a new email.</div>");
			return false;
		}
		
		if(!valEmail($("#st_email").val())){
			$("#email_msg_s").html("<div id='email-req-fail' class='alert alert-danger fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> Please provide a valid email.</div>");
			return false;
		}
		
		jsonObject['mail'] = $("#st_email").val();
	}
	
	console.log(JSON.stringify(jsonObject));
	alrtAccCdReq(jsonObject);
}

/*Return Activate Code*/
function alrtAccCdResp(data){
	console.log("alrtCdResp:"+JSON.stringify(data));
	
	if(data.s&&data.s=="200"){
		var obj = JSON.parse(data.ev);
		var mdn = obj.mdn.toUpperCase();
		var jwt = obj.jwt;
		
		url = url.replace("[JWT]",jwt.replace("\"","").replace("\"",""));
		url = url.replace("[BH]",chkUndefined(getUrlParameter("bh")));
		url = url.replace("[AppId]",chkUndefined(getUrlParameter("appId")));
		url = url.replace("[StkCd]",chkUndefined(getUrlParameter("stkCd")));
		url = url.replace("[ExCd]",chkUndefined(getUrlParameter("exCd")));
		url = url.replace("[JWTs]","R");
		
		window.history.pushState("object or string", "Title", url);
		
		if(mdn == "SMS"){
			$('#sms_msg_s').empty();
			$("#st_sms").prop('disabled', false);
			$("#actSMS").hide();
			$("#actSMS_cd").show();
			$("#edtSMS").hide();
			$("#testSMS").hide();
		}else if(mdn == "EMAIL"){
			$('#email_msg_s').empty();
			$("#st_email").prop('disabled', false);
			$("#actEmail").hide();
			$("#actEmail_cd").show();
			$("#edtEmail").hide();
			$("#testEmail").hide();
		}
	}else{
		if(reqMedia == "SMS"){
			$('#sms_msg_s').empty();
			$("#sms_msg_s").html("<div id='sms-req-fail' class='alert alert-danger fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> <strong>Request Activate Code Fail.</strong> "+data.msg+"</div>");
		}else if(reqMedia == "EMAIL"){
			$('#email_msg_s').empty();
			$("#email_msg_s").html("<div id='email-req-fail' class='alert alert-danger fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> <strong>Request Activate Code Fail.</strong> "+data.msg+"</div>");
		}
	}
}

/*activate Alert*/
function actAlrtAcc(val){
	var jsonObject = {};

	var mdn = val.toUpperCase();
	jsonObject['opt'] = 'U';
	jsonObject['mdn'] = mdn;
	jsonObject['jwt'] = chkUndefined(getUrlParameter("jwt"));
	jsonObject['bh'] = chkUndefined(getUrlParameter("bh"));
	jsonObject['appId'] = chkUndefined(getUrlParameter("appId"));
	jsonObject['jwts'] = chkUndefined(getUrlParameter("jwts"));
	reqMedia = mdn;
	
	if(mdn == "SMS"){
		jsonObject['mbn'] = $("#st_sms").val();
		jsonObject['acd'] = $("#st_sms_cd").val();
	}else if(mdn == "EMAIL"){
		jsonObject['mail'] = $("#st_email").val();
		jsonObject['acd'] = $("#st_email_cd").val();
	}

	console.log(JSON.stringify(jsonObject));
	actAlrtAccReq(jsonObject);
}

/*response of activate alert*/
function actAlrtAccResp(data){
	console.log("actAlrtResp:"+JSON.stringify(data));
	
	if(data.s&&data.s=="200"){
		var obj = JSON.parse(data.ev);
		var mdn = obj.mdn.toUpperCase();
		var jwt = obj.jwt;
		
		url = url.replace("[JWT]",jwt.replace("\"","").replace("\"",""));
		url = url.replace("[BH]",chkUndefined(getUrlParameter("bh")));
		url = url.replace("[AppId]",chkUndefined(getUrlParameter("appId")));
		url = url.replace("[StkCd]",chkUndefined(getUrlParameter("stkCd")));
		url = url.replace("[ExCd]",chkUndefined(getUrlParameter("exCd")));
		url = url.replace("[JWTs]","R");
		
		window.history.pushState("object or string", "Title", url);
		
		var result = obj.result;
		setAlertSt(result);
		
		if(mdn == "SMS"){
			$("#st_sms").prop('disabled', true);
			$("#actSMS").hide();
			$("#actSMS_cd").hide();
			$("#edtSMS").show();
			$("#testSMS").show();
			
			$('#sms_msg_s').empty();
			$("#sms_msg_s").html("<div id='sms-req-fail' class='alert alert-success fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> <strong>Activate Process Success.</strong></div>");
		}else if(mdn == "EMAIL"){
			$("#st_email").prop('disabled', true);
			$("#actEmail").hide();
			$("#actEmail_cd").hide();
			$("#edtEmail").show();
			$("#testEmail").show();
			
			$('#email_msg_s').empty();
			$("#email_msg_s").html("<div id='email-req-fail' class='alert alert-success fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> <strong>Activate Process Success.</strong></div>");
		}
	}else{
		if(reqMedia == "SMS"){
			$('#sms_msg_s').empty();
			$("#sms_msg_s").html("<div id='sms-req-fail' class='alert alert-danger fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> <strong>Activate Process Fail.</strong> "+data.msg+"</div>");
		}else if(reqMedia == "EMAIL"){
			$('#email_msg_s').empty();
			$("#email_msg_s").html("<div id='email-req-fail' class='alert alert-danger fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> <strong>Activate Process Fail.</strong> "+data.msg+"</div>");
		}
	}
}

/* Alert Area */
/*get Alert List*/
function alrtLs(){
	$(".container").loadingOverlay();
	var jsonObject = {};
	
	jsonObject['s'] = "";
	jsonObject['jwt'] = chkUndefined(getUrlParameter("jwt"));
	jsonObject['bh'] = chkUndefined(getUrlParameter("bh"));
	jsonObject['appId'] = chkUndefined(getUrlParameter("appId"));
	jsonObject['jwts'] = chkUndefined(getUrlParameter("jwts"));

	$("#tbl_alert tbody").empty();
	console.log(JSON.stringify(jsonObject));
	alrtLsReq(jsonObject);
}

/*display Alert List*/
function alrtLsResp(data){
	console.log("alrtLsResp:"+JSON.stringify(data));
	
	if(data.s&&data.s=="200"){
		var obj = JSON.parse(data.ev);
		var jwt = obj.jwt;
		
		url = url.replace("[JWT]",jwt.replace("\"","").replace("\"",""));
		url = url.replace("[BH]",chkUndefined(getUrlParameter("bh")));
		url = url.replace("[AppId]",chkUndefined(getUrlParameter("appId")));
		url = url.replace("[StkCd]",chkUndefined(getUrlParameter("stkCd")));
		url = url.replace("[ExCd]",chkUndefined(getUrlParameter("exCd")));
		url = url.replace("[JWTs]","R");
		
		window.history.pushState("object or string", "Title", url);
		
		ttlRecord = obj.ttlAlrt;
		$("#lastUpdDtVal").html(obj.ltUpdDt);
	    $("#ttlAlrt").html(ttlRecord);
	    ttlRecord = 0;
	    var alert = "";
	    
	    $("#tbl_alert tbody").empty();
	    
	    if ( $.fn.dataTable.isDataTable( '#tbl_alert' ) ) {
	    	table.clear();
	    	table.destroy();
	    }
	    
	    for(var i=0; i < obj.alrtLs.length; i++){
	    	var alertObj = obj.alrtLs[i];
	    	var num = alertObj.id;
	    	var status = alertObj.s;
	    	
	    	if(status != "J"){
	    		if(isOdd(i+1)){
		    		alert += "<tr id='alertRecord_"+num+"' role='row' class='odd'>";
		    	}else{
		    		alert += "<tr id='alertRecord_"+num+"' role='row' class='even'>";
		    	}
		        
		        if(alertObj.stkCd == ""){ 
		        	alert += "<td id='stockCode_"+num+"'>&nbsp</td>"; 
		        }else{
		        	if(alertObj.stkNm == "" && mapSptMth("", alertObj.stkCd) == "")
		        		alert += "<td id='stockCode_"+num+"'>"+alertObj.stkCd+"</td>";
		        	else if(alertObj.stkNm == "" && mapSptMth("", alertObj.stkCd) != "")
		        		alert += "<td id='stockCode_"+num+"'>"+alertObj.stkCd+" ("+mapSptMth("", alertObj.stkCd)+") </td>";
		        	else
		        		alert += "<td id='stockCode_"+num+"'>"+alertObj.stkCd+" ("+alertObj.stkNm+") </td>";
		        }
		        
		        if(mapAlertType("",alertObj.alrtt) == "") alert += "<td id='alertType_"+num+"'>&nbsp</td>"; else alert += "<td id='alertType_"+num+"'>"+mapAlertType("",alertObj.alrtt)+"</td>";
		        if(mapCompareType("",alertObj.compt) == "") alert += "<td id='compareType_"+num+"'>&nbsp</td>"; else alert += "<td id='compareType_"+num+"'>"+mapCompareType("",alertObj.compt)+"</td>";
		        if(mapCondition("", alertObj.cdt) == "") alert += "<td id='condition_"+num+"'>&nbsp</td>"; else alert += "<td id='condition_"+num+"'>"+mapCondition("", alertObj.cdt)+"</td>";
		        if(alertObj.lmt == "") alert += "<td id='limit_"+num+"'>&nbsp</td>"; else alert += "<td id='limit_"+num+"'>"+alertObj.lmt+"</td>";
		        if(alertObj.mdn == "") alert += "<td id='media_"+num+"'>&nbsp</td>"; else alert += "<td id='media_"+num+"'>"+mapMedia("","",alertObj.mdn)+"</td>";
		        if(alertObj.lsUpdDt == "") alert += "<td id='lsUpd_"+num+"'>&nbsp</td>"; else alert += "<td id='lsUpd_"+num+"'>"+alertObj.lsUpdDt+"</td>";
		        if(alertObj.rmk == "") alert += "<td id='remark_"+num+"'>&nbsp</td>"; else alert += "<td id='remark_"+num+"'>"+alertObj.rmk+"</td>";
		        
		        if(status == "A") status = "ON"; else status = "OFF";
		        if(alertObj.s == "") alert += "<td id='status_"+num+"'>&nbsp</td>"; else alert += "<td id='status_"+num+"'><b>"+status+"</b></td>";
		        alert += "<td id='alertbtn'>";
		        
		        alert += "<div class='editSMS'>";
		        
		        if(status.toUpperCase() == "ON")
		        	alert += "<button onclick='javascript:updAlrtS("+num+");' class=' btn-flat white big'><span id='status2_"+num+"' class='glyphicon glyphicon-pause ' aria-hidden='true'></span></button>";
		        else if(status.toUpperCase() == "OFF")
		        	alert += "<button onclick='javascript:updAlrtS("+num+");' class=' btn-flat white big'><span id='status2_"+num+"' class='glyphicon glyphicon-play 'aria-hidden='true'></span></button>";
		        else
		        	alert += "<button onclick='javascript:updAlrtS("+num+");' class=' btn-flat white big' disabled><span id='status2_"+num+"' class='glyphicon glyphicon-play 'aria-hidden='true'></span></button>";
		        
		        alert += "</div>";
		        alert += "<div class='editSMS'>";
		        alert += "<a href='#' class=' btn-flat white big' data-toggle='modal' data-target='#modal-editSMS' onclick='javascript:edtAlrt("+num+");'><span class='glyphicon glyphicon-pencil ' aria-hidden='true'></span></a>";
		        alert += "</div>";
		        alert += "<div class='deleteSMS'>";
		        alert += "<a href='#' class=' btn-flat white' data-toggle='confirmation' data-placement='left'  id='rmTr_"+num+"' onclick='javascript:setRmTr("+num+");'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>";
		        alert += "</div>";
		        alert += "</td>";
		        alert += "</tr>";
	    	}
	    }
	    
	    $("#tbl_alert tbody").append(alert);
	    $(".container").loadingOverlay("remove");
	    
		$('[data-toggle="confirmation"]').confirmation();
		
		table = $('#tbl_alert').DataTable( {
	        "dom": '<"toolbar">ft' , /*"dom": '<"toolbar">frtip'*/
			 "columnDefs": [{"targets": 'no-sort',"orderable": false,} ],
			 "aoColumns": [ {"bSearchable": true}, {"bSearchable": false}, {"bSearchable": false}, {"bSearchable": false}, {"bSearchable": false}, {"bSearchable": false}, {"bSearchable": false}, {"bSearchable": false}, {"bSearchable": false}, {"bSearchable": false}],
			 paging: false
	    } );
		
		$(".container").loadingOverlay("remove");

		delistedLs();
	}else{
		$('.container').empty();
		alert(data.msg);
		window.location = err_url;
	}
}

/*get delisted List*/
function delistedLs(){
	$(".container").loadingOverlay();
	var jsonObject = {};
	
	jsonObject['s'] = "";
	jsonObject['jwt'] = chkUndefined(getUrlParameter("jwt"));
	jsonObject['bh'] = chkUndefined(getUrlParameter("bh"));
	jsonObject['appId'] = chkUndefined(getUrlParameter("appId"));
	jsonObject['jwts'] = chkUndefined(getUrlParameter("jwts"));

	$("#tbl_delisted tbody").empty();
	console.log(JSON.stringify(jsonObject));
	delistedLsReq(jsonObject);
}

/*display delisted List*/
function delistedLsResp(data){
	console.log("delistedLsResp:"+JSON.stringify(data));
	
	if(data.s&&data.s=="200"){
		var obj = JSON.parse(data.ev);
		var jwt = obj.jwt;
		
		url = url.replace("[JWT]",jwt.replace("\"","").replace("\"",""));
		url = url.replace("[BH]",chkUndefined(getUrlParameter("bh")));
		url = url.replace("[AppId]",chkUndefined(getUrlParameter("appId")));
		url = url.replace("[StkCd]",chkUndefined(getUrlParameter("stkCd")));
		url = url.replace("[ExCd]",chkUndefined(getUrlParameter("exCd")));
		url = url.replace("[JWTs]","R");
		
		window.history.pushState("object or string", "Title", url);
		
	    var delisted = "";
	    
	    $("#tbl_delisted tbody").empty();
	    
	    for(var i=0; i < obj.alrtLs.length; i++){
	    	var alertObj = obj.alrtLs[i];
	    	var num = alertObj.id;
	        
	    	if(alertObj.s == "J"){
	    		$(".delisted").show();
	    		
	    		delisted += "<tr id='delistedRecord_"+num+"'>";
	    		
	    		if(alertObj.stkCd == ""){ 
	    			delisted += "<td id='stockCode_"+num+"'>&nbsp</td>"; 
		        }else{
		        	if(alertObj.stkNm == "" && mapSptMth("", alertObj.stkCd) == "")
		        		delisted += "<td id='stockCode_"+num+"'>"+alertObj.stkCd+"</td>";
		        	else if(alertObj.stkNm == "" && mapSptMth("", alertObj.stkCd) != "")
		        		delisted += "<td id='stockCode_"+num+"'>"+alertObj.stkCd+" ("+mapSptMth("", alertObj.stkCd)+") </td>"; 
		        	else
		        		delisted += "<td id='stockCode_"+num+"'>"+alertObj.stkCd+" ("+alertObj.stkNm+") </td>";
		        }
	    		
	    		if(mapAlertType("",alertObj.alrtt) == "") delisted += "<td id='alertType_"+num+"'>&nbsp</td>"; else delisted += "<td id='alertType_"+num+"'>"+mapAlertType("",alertObj.alrtt)+"</td>";
	    		if(mapCompareType("",alertObj.compt) == "") delisted += "<td id='compareType_"+num+"'>&nbsp</td>"; else delisted += "<td id='compareType_"+num+"'>"+mapCompareType("",alertObj.compt)+"</td>";
		        if(mapCondition("", alertObj.cdt) == "") delisted += "<td id='condition_"+num+"'>&nbsp</td>"; else alert += "<td id='condition_"+num+"'>"+mapCondition("", alertObj.cdt)+"</td>";
		        if(alertObj.lmt == "") delisted += "<td id='limit_"+num+"'>&nbsp</td>"; else delisted += "<td id='limit_"+num+"'>"+alertObj.lmt+"</td>";
		        if(alertObj.mdn == "") delisted += "<td id='media_"+num+"'>&nbsp</td>"; else delisted += "<td id='media_"+num+"'>"+mapMedia("","",alertObj.mdn)+"</td>";
		        if(alertObj.lsUpdDt == "") delisted += "<td id='lsUpd_"+num+"'>&nbsp</td>"; else delisted += "<td id='lsUpd_"+num+"'>"+alertObj.lsUpdDt+"</td>";
		        if(alertObj.rmk == "") delisted += "<td id='remark_"+num+"'>&nbsp</td>"; else delisted += "<td id='remark_"+num+"'>"+alertObj.rmk+"</td>";
		        
		        delisted += "</td>";
		        delisted += "</tr>";
	    	}
	    }
	    
	    $("#tbl_delisted tbody").append(delisted);
	    
		$(".container").loadingOverlay("remove");
	}else{
		$('.container').empty();
		alert(data.msg);
		window.location = err_url;
	}
}

/*add new stock alert*/
function addAlrt(){
	$(".container").loadingOverlay();
	var jsonObject = {};
	
	var ex = $("#Exchange_N").val();
	var mdn = $("#Media_N").val();
	
	var stkCd = "";
	
	if($('#txtStkCodeSearch').css('display') == 'none'){
		stkCd = " ("+$("#SpotMth_N").val()+")";
	}else{
		stkCd = $("#txtStkCodeSearch").val();
	}
	
	var stkNm = "";
	var alrtT = $("#AlertType_N").val();
	var lmt = $("#Limit_N").val();
	var compT = $("#CompareType_N").val();
	var cond = $("#Condition_N").val();
	var rmk = $("#Remark_N").val();
	
	$('#add_alert_stkcd').empty();
	$('#add_alert_lmt').empty();
	
	var stkCd1 = stkCd.substring(stkCd.lastIndexOf("(")+1,stkCd.lastIndexOf(")"));

	if(!(arrStkCodeName.indexOf(stkCd) > -1) && $('#txtStkCodeSearch').css('display') != 'none'){
		$("#add_alert_stkcd").html("<div id='add-alert-stkcd-fail' class='alert alert-danger fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> Please provide valid Stock Code / Name </div>");
		
		$(".container").loadingOverlay("remove");
	}else if(isNaN(lmt) || lmt == ""){
		$("#add_alert_lmt").html("<div id='add-alert-lmt-fail' class='alert alert-danger fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> Value must be Numberic </div>");
		
		$(".container").loadingOverlay("remove");
	}else if(mdn < 1){
		alert("Media selected is inactivate now. Please activate it.");
		
		$("#menu1").click();
		$("#closeAddStkAlert").click();
	}else{
		jsonObject['ex'] = ex;
		jsonObject['mdn'] = mdn;

		stkNm = stkCd.substring(0,stkCd.lastIndexOf("("));
		stkCd = stkCd.substring(stkCd.lastIndexOf("(")+1,stkCd.lastIndexOf(")"));
		
		jsonObject['stkCd'] = stkCd;
		jsonObject['stkNm'] = stkNm;
		jsonObject['alrtT'] = alrtT;
		jsonObject['lmt'] = lmt;
		jsonObject['compT'] = compT;
		jsonObject['cond'] = cond;
		jsonObject['rmk'] = rmk;
		jsonObject['jwt'] = chkUndefined(getUrlParameter("jwt"));
		jsonObject['bh'] = chkUndefined(getUrlParameter("bh"));
		jsonObject['appId'] = chkUndefined(getUrlParameter("appId"));
		jsonObject['jwts'] = chkUndefined(getUrlParameter("jwts"));

		$("#tbl_alert tbody").empty();
		console.log(JSON.stringify(jsonObject));
		addAlrtReq(jsonObject);
	}
}

/*add alert return*/
function addAlrtResp(data){
	console.log("addAlrtResp:"+JSON.stringify(data));
	
	if(data.s&&data.s=="200"){
		console.log("addAlrtResp: done");
		var obj = JSON.parse(data.ev);
		var jwt = obj.jwt;
		
		url = url.replace("[JWT]",jwt.replace("\"","").replace("\"",""));
		url = url.replace("[BH]",chkUndefined(getUrlParameter("bh")));
		url = url.replace("[AppId]",chkUndefined(getUrlParameter("appId")));
		url = url.replace("[StkCd]","");
		url = url.replace("[ExCd]","");
		url = url.replace("[JWTs]","R");
		
		window.history.pushState("object or string", "Title", url);
		
		$(".container").loadingOverlay("remove");
		
		clrAddAlrt();
		
		$("#closeAddStkAlert").click();
		
		refresh();
	}else{
		$('.container').empty();
		alert(data.msg);
		window.location = err_url;
	}
}

/*update alert details*/
function updAlrtD(val){
	$(".container").loadingOverlay();
	var jsonObject = {};
	
	var aid = val;
	var mdn = document.getElementById("Media_E").value;
	var alrtT = document.getElementById("AlertType_E").value;
	var compT = document.getElementById("CompareType_E").value;
	var cond = document.getElementById("Condition_E").value;
	var lmt = document.getElementById("Limit_E").value;
	var rmk = document.getElementById("Remark_E").value;
	
	if(isNaN(lmt) || lmt == ""){
		$("#edt_alert_lmt").html("<div id='add-alert-lmt-fail' class='alert alert-danger fade in' style='margin-top:10px;'><a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a> Value must be Numberic </div>");
	
		$(".container").loadingOverlay("remove");
	}else{
		jsonObject['aid'] = aid;
		jsonObject['mdn'] = mdn;
		jsonObject['alrtT'] = alrtT;
		jsonObject['compT'] = compT;
		jsonObject['cond'] = cond;
		jsonObject['lmt'] = lmt;
		jsonObject['rmk'] = htmlDecode(rmk.trim());
		jsonObject['s'] = "A";
		jsonObject['jwt'] = chkUndefined(getUrlParameter("jwt"));
		jsonObject['bh'] = chkUndefined(getUrlParameter("bh"));
		jsonObject['appId'] = chkUndefined(getUrlParameter("appId"));
		jsonObject['jwts'] = chkUndefined(getUrlParameter("jwts"));
		
		$("#tbl_alert tbody").empty();
		console.log(JSON.stringify(jsonObject));
		updAlrtReq(jsonObject);
	}
}

/*update alert status*/
function updAlrtS(val){
	$(".container").loadingOverlay();
	var jsonObject = {};
	
	var aid = val;
	var sts = document.getElementById("status_"+val).textContent;
	
	if(sts != "ON")
		sts = "A";
	else
		sts = "X";
	
	jsonObject['aid'] = aid;
	jsonObject['s'] = sts;
	jsonObject['jwt'] = chkUndefined(getUrlParameter("jwt"));
	jsonObject['bh'] = chkUndefined(getUrlParameter("bh"));
	jsonObject['appId'] = chkUndefined(getUrlParameter("appId"));
	jsonObject['jwts'] = chkUndefined(getUrlParameter("jwts"));
	
	$("#tbl_alert tbody").empty();
	console.log(JSON.stringify(jsonObject));
	updAlrtReq(jsonObject);
}

/*update alert return*/
function updAlrtResp(data){
	console.log("updAlrtResp:"+JSON.stringify(data));
	
	if(data.s&&data.s=="200"){
		$("#closeEdtButton").click();
		
		console.log("updAlrtResp: done");
		var obj = JSON.parse(data.ev);
		var jwt = obj.jwt;
		
		url = url.replace("[JWT]",jwt.replace("\"","").replace("\"",""));
		url = url.replace("[BH]",chkUndefined(getUrlParameter("bh")));
		url = url.replace("[AppId]",chkUndefined(getUrlParameter("appId")));
		url = url.replace("[StkCd]","");
		url = url.replace("[ExCd]","");
		url = url.replace("[JWTs]","R");
		
		window.history.pushState("object or string", "Title", url);
		
		refresh();
	}else{
		$('.container').empty();
		alert(data.msg);
		window.location = err_url;
	}
}

/*set remove target*/
function setRmTr(val){
	if(!isNaN(val)){
		if(rmTr != val)
			$("#cancelDlt").click();
	}else{
		$("#cancelDlt").click();
	}
	
	rmTr = val;
}

/*delete alert status*/
function rmAlrt(val){
	$(".container").loadingOverlay();
	var jsonObject = {};
	
	if(!isNaN(rmTr)){
		val = rmTr;
		
		var aid = val;
		var mdn = document.getElementById("media_"+val).textContent;
		var alrtT = document.getElementById("alertType_"+val).textContent;
		var compT = document.getElementById("compareType_"+val).textContent;
		var cond = document.getElementById("condition_"+val).textContent;
		var lmt = document.getElementById("limit_"+val).textContent;
		var rmk = document.getElementById("remark_"+val).textContent;
		
		var sts = "L";
		
		jsonObject['aid'] = aid;
		jsonObject['mdn'] = mapMedia(mdn,"","");
		jsonObject['alrtT'] = mapAlertType(alrtT,"");
		jsonObject['compT'] = mapCompareType(compT,"");
		jsonObject['cond'] = mapCondition(cond,"");
		jsonObject['lmt'] = lmt;
		jsonObject['rmk'] = rmk.trim();
		jsonObject['s'] = sts;
		jsonObject['jwt'] = chkUndefined(getUrlParameter("jwt"));
		jsonObject['bh'] = chkUndefined(getUrlParameter("bh"));
		jsonObject['appId'] = chkUndefined(getUrlParameter("appId"));
		jsonObject['jwts'] = chkUndefined(getUrlParameter("jwts"));
		
		$("#tbl_alert tbody").empty();
		console.log(JSON.stringify(jsonObject));
		updAlrtReq(jsonObject);
	}else{
		$(".delisted").hide();
		$(".container").loadingOverlay("remove");
	}
}

/*update alert return*/
function rmAlrtResp(data){
	console.log("updAlrtResp:"+JSON.stringify(data));
	
	if(data.s&&data.s=="200"){
		console.log("updAlrtResp: done");
		var obj = JSON.parse(data.ev);
		var jwt = obj.jwt;
		
		url = url.replace("[JWT]",jwt.replace("\"","").replace("\"",""));
		url = url.replace("[BH]",chkUndefined(getUrlParameter("bh")));
		url = url.replace("[AppId]",chkUndefined(getUrlParameter("appId")));
		url = url.replace("[StkCd]",chkUndefined(getUrlParameter("stkCd")));
		url = url.replace("[ExCd]",chkUndefined(getUrlParameter("exCd")));
		url = url.replace("[JWTs]","R");
		
		window.history.pushState("object or string", "Title", url);
		
		refresh();
	}else{
		$('.container').empty();
		alert(data.msg);
		window.location = err_url;
	}
}

/* Common Area */
/*get Suggestion List*/
function getSuggestion(exchCd, input, isStkCd){
	arrStkCodeName = [];
	var jsonObject = {};
	
	if(input == "")
		input = $("#txtStkCodeSearch").val();
	if(exchCd == "")
		exchCd = $("#Exchange_N").val();
	var maxRecords = 10;
	
	if(chkUndefined(input) != ''){
		jsonObject['i'] = input.toUpperCase();
		jsonObject['ex'] = exchCd;
		jsonObject['mxr'] = maxRecords;
		
		console.log(JSON.stringify(jsonObject));
		
		if(isStkCd){
			getSuggestionReq(jsonObject);
		}else{
			if(input.length == 2)
				getSuggestionReq(jsonObject);
		}
	}else{
		$('#txtStkCodeSearch').autocomplete({
                source: arrStkCodeName,
                autoFocus: true
        });
	}
}

function getSuggestionResp(data){
	console.log("getSuggestionResp:"+JSON.stringify(data));
	
	if(data.s == "200"){
		var newArray = [];
		var ev = JSON.parse(data.ev);
		var stkLs = ev.suggestList;
		
		for(var i=0; i < stkLs.length; i++){
			var jsonObj = stkLs[i];
			newArray.push(jsonObj.StkName+" ("+jsonObj.StkCode+")");
		}
		
		arrStkCodeName = newArray;

		arrStkCodeName.sort();
  		
	  	$('#txtStkCodeSearch').autocomplete({
	  		source: arrStkCodeName,
	  		autoFocus: true
	  	});
	}else{
		$('.container').empty();
		alert(data.msg);
	}
}

function getCorrectSug(exchCd, input){
	var jsonObject = {};
	
	jsonObject['i'] = input.toUpperCase();
	jsonObject['ex'] = exchCd;
	jsonObject['mxr'] = 20;
	
	console.log(JSON.stringify(jsonObject));
	getCorrectSugReq(jsonObject);
}

function getCorrectSugResp(data){
	console.log("getCorrectSugResp:"+JSON.stringify(data));
	
	if(data.s == "200"){
		var ev = JSON.parse(data.ev);
		var stkLs = ev.suggestList;
		
		var stkCodeFTCPlus = chkUndefined(getUrlParameter("stkCd"));
		var exCodeFTCPlus = chkUndefined(getUrlParameter("exCd"));
		
		for(var i=0; i < stkLs.length; i++){
			var jsonObj = stkLs[i];
			
			if(stkCodeFTCPlus == jsonObj.StkCode)
				$("#txtStkCodeSearch").val(jsonObj.StkName+" ("+jsonObj.StkCode+")");
		}
		
		url = url.replace("[JWT]",chkUndefined(getUrlParameter("jwt")));
		url = url.replace("[BH]",chkUndefined(getUrlParameter("bh")));
		url = url.replace("[AppId]",chkUndefined(getUrlParameter("appId")));
		url = url.replace("[StkCd]","");
		url = url.replace("[ExCd]","");
		url = url.replace("[JWTs]",chkUndefined(getUrlParameter("jwts")));
		
		window.history.pushState("object or string", "Title", url);
		
		$("#menu2").click();
	}else{
		$('.container').empty();
		alert(data.msg);
	}
}
