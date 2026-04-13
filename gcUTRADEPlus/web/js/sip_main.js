var login_agent = false;

function chkSess(){
	var jsonObject = {};
	console_log("chkSess:"+JSON.stringify(jsonObject));
	chkSessReq(jsonObject);
}

function chkSessResp(data){
	console_log("chkSessResp:"+JSON.stringify(data));
	if(data.s&&data.s=="200"){
		console_log("chkSessResp:"+data.ev);
		var logon = JSON.parse(data.ev);
		if(logon.s=="true"){
			login_agent = true;
		}
	}
}

function trdAccATP(searchParam, accountTypeP){
	console.log("Calling Trading Account from ATP");
	var jsonObject = {};
	var accTypeP = "";
	var searchP = "";
	callATP = true;
	if(searchParam != null){
		var paramLength = searchParam.length;
		console.log("Search Trading Account Param length: "+paramLength);
		if(paramLength < 3){
			alert("Please insert at least 3 characters");
		}else{
			searchP = searchParam;
		}
		
	}
	if(accountTypeP != ""){
		accTypeP = accountTypeP;
		filterAccType = accountTypeP;
	}
	jsonObject['accType'] = accTypeP;
	jsonObject['search'] = searchP;
	jsonObject['exchCode'] = 'PHP';
	
	reqTrdAccATP(jsonObject);
}

function tradeAccInfo_response(data){
	console.log("Displaying Acc Select Box");
	console.log(data);
	var sttus = data.s;
	var msg = data.msg;
	
	if(sttus == "200"){
		var trdgAccD = JSON.parse(data.ev);
		$('#LoginID').html(trdgAccD.Loginid);
		$('#CliName').html(trdgAccD.CliName);
		$('.CliName').html(trdgAccD.CliName);
		console.log(trdgAccD);
		$('#TrdAccSel').empty();

		
			
		
		if (trdgAccD.BhCliInfo != null){
		var bhCliInfoD = trdgAccD.BhCliInfo;
		console.log(bhCliInfoD);
		$('#CliCode').html(bhCliInfoD[0].cliCode);
		if(bhCliInfoD.length > 0){
				for (var i=0;i<bhCliInfoD.length;i++){
					var $option=$('<option />');

					$option.attr('value', bhCliInfoD[i].branchCode+"|"+bhCliInfoD[i].bhCliCode+"|"+bhCliInfoD[i].accType+"|"+bhCliInfoD[i].rmsCode);
					
					$option.text(" (" + bhCliInfoD[i].bhCliCode+"-"+bhCliInfoD[i].branchCode+") "+bhCliInfoD[i].cliName);
					$('#TrdAccSel').append($option);
				}
			}
		console.log("$option="+$option);
		
		
		startSIP();

	}else{
			console.log("No Trading Account Record Found");
			//$('#tblTDHdr').css("display","none");
			$('#noDataMsg').text("No Trading Account Record Found");
			$('#noDataMsg').show();
		}
		
	}
	else{
		alert(msg);
	}
}
function AccInfoEncryptValue(){

	
	var $accDetail = $('#TrdAccSel');
	var valaccType=$accDetail.find(':selected').attr('value');
	var splitValue = valaccType.split("|");
	
	var jsonObject = {};
	jsonObject['fs'] = $('#filterStatus').html();
	jsonObject['brch'] = splitValue[0];
	jsonObject['trdAc'] = splitValue[1];

	
     console.log("jsonObject passed to Backend : "+JSON.stringify(jsonObject));
	 $("#tbl_sip tbody").empty();
	SIPStaReq(jsonObject);
}


//sipsta
//get status list



function SIPStaResp(data){
	console.log("SIPStaResp:"+JSON.stringify(data));

	if(data.s&&data.s=="200"&&JSON.parse(data.ev).SIPScheduleData.length>=1){
		var obj = JSON.parse(data.ev);
		var ttlRecord = 0;
		ttlRecord = obj.SIPScheduleData.length;
		$("#lastUpdDtVal").html(obj.ltUpdDt);
	    $("#ttlRecord").html(ttlRecord);
	    var sip = "";
	    
	    $("#tbl_sip tbody").empty();
		
	    
	    for(var i=0; i < obj.SIPScheduleData.length; i++){
	    	var sipObj = obj.SIPScheduleData[i];
	    	var num = sipObj.RecordID;
	    	var status = sipObj.Status;
			
			var dateString  = sipObj.StartDt;
			var year = dateString.substring(0,4);
			var month = dateString.substring(4,6);
			var day = dateString.substring(6,8);
			var start_date = day+ "-" + month+ "-" + year;
			
			
			var dateString1  = sipObj.NextBuyDt;
			var year = dateString1.substring(0,4);
			var month = dateString1.substring(4,6);
			var day = dateString1.substring(6,8);
			var nextbuy_date = day+ "-" + month+ "-" + year;
	    	
			var c = parseFloat(sipObj.CashValue);
			var cashValue = c.toFixed(2);
			
		        sip += "<tr id='sipRecord_"+num+"'>";
		        if(sipObj.StockCode == ""){ 
		        	sip += "<td id='stockCode_"+num+"'>&nbsp</td>"; 
		        }else{
		        		sip += "<td id='stockCode_"+num+"'>"+sipObj.StockCode+"</td>";
		        }
				
		        if(sipObj.NoOfNextBuy == "") sip += "<td id='remainTrade_"+num+"'>&nbsp</td>"; else sip += "<td id='remainTrade_"+num+"'>"+sipObj.NoOfNextBuy+"</td>";
				if(sipObj.RecordID == "") sip += "<td id='orderRef_"+num+"'>&nbsp</td>"; else sip += "<td id='orderRef_"+num+"'>"+sipObj.RecordID+"</td>";
				if(sipObj.CashValue == "") sip += "<td id='cashAmount_"+num+"'>&nbsp</td>"; else sip += "<td id='cashAmount_"+num+"'>"+cashValue+"</td>";
				if(start_date == "") sip += "<td id='startDate_"+num+"'>&nbsp</td>"; else sip += "<td id='startDate_"+num+"'>"+start_date+"</td>";
				if(sipObj.Period == "") sip += "<td id='scheduleOpt_"+num+"'>&nbsp</td>"; else sip += "<td id='scheduleOpt_"+num+"'>"+sipObj.Period+"</td>";
				if(sipObj.NextBuyDt == "") sip += "<td id='nextBuy_"+num+"'>-</td>"; else sip += "<td id='nextBuy_"+num+"'>"+nextbuy_date+"</td>";
		        
		        if(status == "A") status = "ACTIVE"; else if(status == "D") status = "COMPLETED";else status = "CANCELLED";
		        if(sipObj.s == "") sip += "<td id='status_"+num+"'>&nbsp</td>"; else sip += "<td id='status_"+num+"'><b>"+status+"</b></td>";
				
		        sip += "<td id='sipbtn'>";
		        sip += "<div class='editSIP'>";
		        sip += "<a href='#editSIP-step1' class='btn-flat btn_gb1 btn_s1' data-toggle='modal' data-target='#modal-editSIP' onclick='javascript:getSIPedtls("+num+");'><span class='glyphicon glyphicon-pencil ' aria-hidden='true'></span></a>";
		        sip += "</div>";
		        sip += "<div class='deleteSMS'>";
		        sip += "<a href='#deleteSIP-step1' class=' btn-flat btn_gb1 btn_s1' data-toggle='modal' data-target='#modal-deleteSIP'  id='delSIP_"+num+"' onclick='javascript:setDelSIP("+num+");'><span class='glyphicon glyphicon-remove' aria-hidden='true'></span></a>";
		        sip += "</div>";
		        sip += "</td>";
				if(sipObj.RecordID == "") sip += "<td id='mID_"+num+"' >&nbsp</td>"; else sip += "<td id='mID_"+num+"' style='display:none' >"+sipObj.RecordID+"</td>";
				sip += "<td id='hiddenmID' style='display:none'>15</td>";
				if(sipObj.Duration == "") sip += "<td id='duration_"+num+"' style='display:none'>&nbsp</td>"; else sip += "<td id='duration_"+num+"' style='display:none' >"+sipObj.Duration+"</td>";
				if(sipObj.Mode == "") sip += "<td id='orderMode_"+num+"' style='display:none'>&nbsp</td>"; else sip += "<td id='orderMode_"+num+"' style='display:none' >"+sipObj.Mode+"</td>";
		        sip += "</tr>";
	    	}
	    
	    
	    $("#tbl_sip tbody").append(sip);
		

	}else if(JSON.parse(data.ev).SIPScheduleData.length<=0){
	$("#ttlRecord").html(0);
		var wd = "";
	    $("#tbl_sip tbody").empty();
		 wd += "<tr>";
		 wd += "<td>No Record Found</td></tr>";
		 $("#tbl_sip tbody").append(wd);
	}
	else{
		$("#ttlRecord").html(0);
		alert(JSON.parse(data.ev).ReturnMsg);
	}
}


function getSIPedtls(val){
	var s = $('#orderRef_'+val).html();
	console.log(s);
	$('#hiddenmID').html(s);
	var $accDetail = $('#TrdAccSel');
	var valaccType=$accDetail.find(':selected').attr('value');
	var splitValue = valaccType.split("|");
	
	var jsonObject = {};
	jsonObject['fs'] = $('#filterStatus').html();
	jsonObject['mID'] =  $('#mID_'+val).html();
	jsonObject['brch'] = splitValue[0];
	jsonObject['trdAc'] = splitValue[1];
	
	
	console.log(JSON.stringify(jsonObject));
	SIPedtlsReq(jsonObject);
}


function SIPedtlsResp(data){
		console.log("SIPedtlsResp:"+JSON.stringify(data));
		$("#backEdtStep1").click();
		if(data.s&&data.s=="200"){
		var obj = JSON.parse(data.ev);
	    var sip = "";
		var mIDedt = $('#hiddenmID').html();
		
		
	    $("#tbl_sipschedule tbody").empty();
	    var j=0;
	    for(var i=0; i < obj.SIPDetails.length; i++){
	    	
			var sipObj = obj.SIPDetails[i];
	    	var num = sipObj.RecordID;
			$('#stkname1').html(sipObj.StockCode);
			$('#stkname2').html(sipObj.StockCode);
	    	var status = sipObj.Status;
			var c = parseFloat(sipObj.CashValue);
			var cashValue = c.toFixed(2);
			var a = parseFloat(sipObj.AvgPrice);
			var AvgPrice = a.toFixed(2);
			
			var dateString  = sipObj.Date;
			var year = dateString.substring(0,4);
			var month = dateString.substring(4,6);
			var day = dateString.substring(6,8);
			var Date1 = day+ "-" + month+ "-" + year;

			
			sip += "<tr id='sipedtls_"+num+"' role='row' >";
			sip += "<td id='sipObjId' style='display:none'>"+num+"</td>";
			sip += "<td id='mIDedt' style='display:none'>"+mIDedt+"</td>";
			sip += "<td id='modifiDate_"+num+"' style='display:none'>"+Date1+"</td>";
			sip += "<td id='orderMode_"+num+"' style='display:none'>"+sipObj.Mode+"</td>";
	    	if(status == "A"){
			j++;
	        sip +="<th class='col-sm-1 center' scope='col'><input type='checkbox' onclick='toggle(this);' name='sipObjId"+j+"' id='checkbox_"+num+"' value = '"+num+"' class='large' /></th>"
			}else {
				j++;
			sip +="<th class='col-sm-1 center' scope='col'></th>"
			
			}
			
				if(Date1 == "") sip += "<td id='startDate_"+num+"'>&nbsp</td>"; else sip += "<td id='startDate_"+num+"'>"+Date1+"</td>";
				sip += "<td id='refNo_"+num+"'>"+sipObj.RecordID+"</td>";
		        if(sipObj.StockCode == ""){ 
		        	sip += "<td id='stockCode_"+num+"' style='display:none'>&nbsp</td>"; 
		        }else{
		        	sip += "<td id='stockCode_"+num+"' style='display:none'>"+sipObj.StockCode+"</td>";
		        }
				if(sipObj.CashValue == "") sip += "<td id='cashAmount_"+num+"'>&nbsp</td>"; else sip += "<td id='cashAmount_"+num+"'>"+cashValue+"</td>";
		        if(sipObj.QtyMatch == "") sip += "<td id='matchQty_"+num+"'>-</td>"; else sip += "<td id='matchQty_"+num+"'>"+sipObj.Qty+"</td>";
				if(sipObj.AvgPrice == 0.00) sip += "<td id='matchPrc_"+num+"'>-</td>"; else sip += "<td id='matchPrc_"+num+"'>"+AvgPrice+"</td>";
				if(sipObj.Remarks == "") sip += "<td id='remarks_"+num+"'>&nbsp</td>"; else sip += "<td id='remarks_"+num+"'>"+sipObj.Remarks+"</td>";
		        sip += "</tr>";
	    	}
	    
	    $("#tbl_sipschedule tbody").append(sip);
				
		
	
	}else{
		$('.container').empty();
		alert(JSON.parse(data.ev).ReturnMsg);

	}

}
function chkEdtNum(){
		
		var refNo = "";
		var j = 0;
		var modifiDate = "";
		var stkCode = "";
		var orderMode = "";
		if($('#tbl_sipschedule tbody input:checkbox:checked').length == 0){
		alert("Please choose at least one SIP Schedule");
		return false;
		}
		else if($('#tbl_sipschedule tbody input:checkbox:checked').length > 1){
		var i=0;

				$("#tbl_sipschedule tbody input:checkbox").each(function(){
					var $this = $(this); 
					i++;
					if($this.is(":checked")){
						j++;
						var num = $this.val();
					
					refNo += $('#refNo_'+num).html() ;
					modifiDate += $('#modifiDate_'+num).html();
					stkCode = $('#stockCode_'+num).html();
					orderMode += $('#orderMode_'+num).html();
					if (j < $('#tbl_sipschedule tbody input:checkbox:checked').length){
					refNo += ",";
					modifiDate += ",";
					stkCode += ",";
					orderMode += ",";
					}
					}else{
			
					}
				});
		
			
		$('#startDt2').html(modifiDate);	
		$('#refNo2').html(refNo);
		$('#stockCode2').html(stkCode);
		$('#bySchedule2').val("N/A");
		$('#bySchedule2').prop('disabled', true);
		$('#bySch').css("display","none");
		$('.input-group-addon').datepicker('remove');
        $('.input-group-addon').prop('disabled', true);
		$('#orderMode2').val(orderMode);
		$("#goEdtstep2").click();
		}
		else{
		var i=0;
		$("#tbl_sipschedule tbody input:checkbox").each(function(){
		var $this = $(this);
		i++;
		
		if($this.is(":checked")){
		var num = $this.val();
		console.log(num);
		$('#refNo2').html($('#refNo_'+num).html());
		$('#stockCode2').html($('#stockCode_'+num).html());
		$('#startDt2').html($('#startDate_'+num).html());	
		$('#bySchedule2').val($('#modifiDate_'+num).html());
		$('#bySchedule2').prop('disabled', false);
		$('.input-group-addon').datepicker('remove');
        $('.input-group-addon').prop('disabled', false);
        $('#cashValue2').val("");
        $('#tradingPin2').val("");
        $("select option[value='Automatic']").removeAttr("selected");
        $("select option[value='Manual']").removeAttr("selected");
		if($('#orderMode_'+num).html() == "A"){
		$("select option[value='Automatic']").attr("selected","selected");
		console.log("A");
		}else{
		$("#orderMode2").val("Manual");
		$("select option[value='Manual']").attr("selected","selected");
		console.log("M");
		}
		}
		});
		$("#goEdtstep2").click();
		
}
}

function edtSIP(){
	var j = $('#tbl_sipschedule tbody input:checkbox:checked').length;
	var k = 0;
	var jsonObject = {};
	var jsonObjectRequest = {};
	var jsonArrayRequest = [];
	if( j > 1){
	if($('#orderMode2').val()=="Automatic"||$('#orderMode2').val()=="Manual"){
	}else{
		alert("Please select Order Mode.");
		return false;
	}
	var mID = $('#hiddenmID').html();
	var $dID = $('#refNo2').html();
	var dID = $dID.split(",");
	var stkCd = $('#stockCode2').html();
	var $startDate = $('#startDt2').html();
	var startDate = $startDate.split(",");
	var $mdft = $('#startDt2').html();
	var mdft = $mdft.split(",");
	var tradingpin =  $('#tradingPin2').val();
	var cashValue = $('#cashValue2').val();
	var orderMode = $('#orderMode2').val();
	var $accDetail = $('#TrdAccSel');
	var valaccType=$accDetail.find(':selected').attr('value');
	var splitValue = valaccType.split("|");

	for (var i=0;i<j;i++){
		var jsonObjectRequest = {};
		jsonObjectRequest['dID'] = dID[i];
		console.log(dID[i]);
		
		jsonObjectRequest['mID'] = mID;
		jsonObjectRequest['cVal'] = cashValue;
		jsonObjectRequest['mode'] = orderMode;
		jsonObjectRequest['pin'] = tradingpin;
		jsonObjectRequest['trdAc'] = splitValue[1];
		jsonObjectRequest['brch'] = splitValue[0];
		jsonObjectRequest['sc'] = stkCd;
		jsonObjectRequest['sdt'] = startDate[i];
		jsonObjectRequest['mdfDt'] = mdft[i];
		console.log(jsonObjectRequest);
		jsonArrayRequest.push(jsonObjectRequest);
		
			
	}
	
	
	
	}else{
	var mID = $('#hiddenmID').html();
	var dID = $('#refNo2').html();
	var stkCd = $('#stockCode2').html();
	var startDate = $('#startDt2').html();
	var mdft = $('#bySchedule2').val();
	var tradingpin =  $('#tradingPin2').val();
	var cashValue = $('#cashValue2').val();
	var orderMode = $('#orderMode2').val();
	
	var $accDetail = $('#TrdAccSel');
	var valaccType=$accDetail.find(':selected').attr('value');
	var splitValue = valaccType.split("|");
	
	
		
		jsonObjectRequest['mID'] = mID;
		jsonObjectRequest['dID'] = dID;
		jsonObjectRequest['sc'] = stkCd;
		jsonObjectRequest['cVal'] = cashValue;
		jsonObjectRequest['sdt'] = startDate;
		jsonObjectRequest['mode'] = orderMode;
		jsonObjectRequest['mdfDt'] = mdft;
		jsonObjectRequest['trdAc'] = splitValue[1];
		jsonObjectRequest['brch'] = splitValue[0];
		jsonObjectRequest['pin'] = tradingpin;
		jsonArrayRequest.push(jsonObjectRequest);
		console.log("jsonObjectRequest:"+jsonObjectRequest);
		
	}
		//$("#tblAddNew tbody").empty();
		//$("#tblReview tbody").empty();
		jsonObject['Request'] = jsonArrayRequest;
		console.log("jsonObject passed to Backend : "+JSON.stringify(jsonObject));
		edtSIPReq(jsonObject);
		
}


function edtSIPResp(data){

console.log("edtSIPResp:"+JSON.stringify(data));
	
	if(data.s&&data.s=="200" && JSON.parse(data.ev).UpdateSIPData[0].ReturnCode == "0"){
		
		console.log("edtSIPResp: done");
		
		var obj = JSON.parse(data.ev);
		var sip = "";
		var dID = $('#refNo2').html();
		var stkCd = $('#stockCode2').html();
		var cashValue = $('#cashValue2').val();
		var startDate = $('#startDt2').html();
		var mdft = $('#bySchedule2').val();
		var orderMode = $('#orderMode2').val();
	    console.log(obj);
	    $("#tblEDTSuccess tbody").empty();
	    

		    		sip += "<tr><th scope='row'>Reference number</th>";
					sip += "<td><label>"+dID+"</label></td></tr>";
		    		sip += "<tr><th scope='row'>Stock Code</th>";
					sip += "<td><label>"+stkCd+"</label></td></tr>";
					sip += "<tr><th scope='row'>Cash Value</th>";
					sip += "<td><label>"+cashValue+"</label></td></tr>";
					sip += "<tr><th scope='row'>Date</th>";
					sip += "<td><label>"+mdft+"</label></td></tr>";
					sip += "<tr><th scope='row'>Order Mode</th>";
					sip += "<td><label>"+orderMode+"</label></td></tr>";
    
	    $("#tblEDTSuccess tbody").append(sip);
		$("#goEdt").click();

	}else{
	
		alert(JSON.parse(data.ev).UpdateSIPData[0].ReturnMsg);
		return false;
	}

}

/*add new SIP schedule*/


function addSchRev(){
	
	if($('#stkCode').val()==""){
	alert("Please enter Stock Code");
	return false;
	}else if($('#cashValue').val()==""){
	alert("Please enter Cash Value");
	return false;
	}else if($('#startDate1').val()==""){
	alert("Please select Start Date");
	return false;
	}else{

	$('#stockCode2').html($('#stkCode').val());
	$('#cashValue2').html($('#cashValue').val());
	$('#period2').html(document.getElementById('period').value);
	$('#startDate2').html($('#startDate1').val());
	$('#orderMode2').html($('#orderMode').val());
	$('#tradingAcc2').html($('#TrdAccSel option:selected').text());
	
	var duration = $('#duration').val();
	if (duration == "0.5") $('#duration2').html("6 Months");else if (duration == "1") $('#duration2').html("1 Years");
	else if (duration == "2") $('#duration2').html("2 Years");else if (duration == "3") $('#duration2').html("3 Years");
	$("#goStep2").click();
	}
	
	
}


function addSchedule(){
	var jsonObject = {};
	
	
	var stkCd = $('#stkCode').val();
	var cashValue = $('#cashValue').val();
	var period = $('#period').val();
	var startDate = $('#startDate1').val();
	var duration = $('#duration').val();
	var orderMode = $('#orderMode').val();
	var tradingpin =  $('#tradingPin').val();
	var $accDetail = $('#TrdAccSel');
	var valaccType=$accDetail.find(':selected').attr('value');
	var splitValue = valaccType.split("|");
	
	
		
		jsonObject['brch'] = splitValue[0];
		jsonObject['trdAc'] = splitValue[1];
		jsonObject['sc'] = stkCd;
		jsonObject['cVal'] = cashValue;
		jsonObject['prd'] = period;
		jsonObject['sdt'] = startDate;
		jsonObject['drt'] = duration;
		jsonObject['pin'] = tradingpin;
		jsonObject['mode'] = orderMode;
		
		console.log("jsonObject passed to Backend : "+JSON.stringify(jsonObject));
		addScheduleReq(jsonObject);
	}


/*add Schedule return*/
function addScheduleResp(data){
	console.log("addScheduleResp:"+JSON.stringify(data));
	
	if(data.s&&data.s=="200" && JSON.parse(data.ev).CreateSIPData[0].ReturnCode == "0"){
		console.log("addScheduleResp: done");
		
		var obj = JSON.parse(data.ev);
		var sipObj = obj.CreateSIPData[0]
		var sip = "";
		var stkCd = $('#stockCode2').html();
		var cashValue = $('#cashValue2').html();
		var period = $('#period2').html();
		var startDate = $('#startDate2').html();
		var duration = $('#duration2').html();
		var orderMode = $('#orderMode2').html();
		var tradingAcc = $('#tradingAcc2').html();
	    console.log(obj);
		
		
	    $("#tblAddSub tbody").empty();
	    

		    		sip += "<tr><th scope='row'>Reference number</th>";
					sip += "<td><label>"+sipObj.ID+"</label></td></tr>";
		    		sip += "<tr><th scope='row'>Stock Code</th>";
					sip += "<td><label>"+stkCd+"</label></td></tr>";
					sip += "<tr><th scope='row'>Cash Value</th>";
					sip += "<td><label>"+cashValue+"</label></td></tr>";
					sip += "<tr><th scope='row'>Period</th>";
					sip += "<td><label>"+period+"</label></td></tr>";
					sip += "<tr><th scope='row'>Start Date</th>";
					sip += "<td><label>"+startDate+"</label></td></tr>";
					sip += "<tr><th scope='row'>Duration</th>";
					sip += "<td><label>"+duration+"</label></td></tr>";
					sip += "<tr><th scope='row'>Order Mode</th>";
					sip += "<td><label>"+orderMode+"</label></td></tr>";
					sip += "<tr><th scope='row'>Trading Account</th>";
					sip += "<td><label>"+tradingAcc+"</label></td></tr>";
	    $("#tblAddSub tbody").append(sip);
		$('#goAdd').click();

	}else{
		alert(JSON.parse(data.ev).CreateSIPData[0].ReturnMsg);
		return false;
	}
}

//del SIP

function setDelSIP(val){
	
	if($('#duration_'+val).html()=="2.00000000"){
	$('#delduration').html("2 Years");
	}else if ($('#duration_'+val).html()=="3.00000000"){
	$('#delduration').html("3 Years");
	}else if ($('#duration_'+val).html()=="1.00000000"){
	$('#delduration').html("1 Year");
	}else{
	$('#delduration').html("6 Months");
	}
	
	if ($('#orderMode_'+val).html()=="A"){
	$('#delorderMd').html("Automatic");
	}else{
	$('#delorderMd').html("Manual");
	}
	
	$('#delstkCode').html($('#stockCode_'+val).html());
	$('#delcashValue').html($('#cashAmount_'+val).html());
	$('#delperiod').html($('#scheduleOpt_'+val).html());
	$('#delstartDt').html($('#startDate_'+val).html());
	$('#delmID').html($('#mID_'+val).html());
	$('#deltraPin').val("");
	

}

function delSIP(){
var jsonObject = {};
	
	
	var stkCd = $('#delstkCode').html();
	var mID = $('#delmID').html();
	var sdt = $('#delstartDt').html();
	var tradingpin =  $('#deltraPin').val();
	var $accDetail = $('#TrdAccSel');
	var valaccType=$accDetail.find(':selected').attr('value');
	var splitValue = valaccType.split("|");
	
	
		
		jsonObject['brch'] = splitValue[0];
		jsonObject['trdAc'] = splitValue[1];
		jsonObject['sc'] = stkCd;
		jsonObject['mID'] = mID;
		jsonObject['pin'] = tradingpin;
		jsonObject['sdt'] = sdt;
		
		console.log("jsonObject passed to Backend : "+JSON.stringify(jsonObject));
		delSIPReq(jsonObject);
}

function delSIPResp(data){
	console.log("delSIPResp:"+JSON.stringify(data));
	
	if(data.s&&data.s=="200" && JSON.parse(data.ev).DeleteSIPData[0].ReturnCode == "0"){
		
		console.log("delSIPResp: done");
		
		var obj = JSON.parse(data.ev);
		var sip = "";
		var dID = $('#delmID').html();
		var stkCd = $('#delstkCode').html();
		var cashValue = $('#delcashValue').html();
		var period = $('#delperiod').html();
		var startDate = $('#delstartDt').html();
		var duration = $('#delduration').html();
		var orderMode = $('#delorderMd').html();
	    console.log(obj);
	    $("#tblDelSuccess tbody").empty();
	    

		    		sip += "<tr><th scope='row'>Reference number</th>";
					sip += "<td><label>"+dID+"</label></td></tr>";
		    		sip += "<tr><th scope='row'>Stock Code</th>";
					sip += "<td><label>"+stkCd+"</label></td></tr>";
					sip += "<tr><th scope='row'>Cash Value</th>";
					sip += "<td><label>"+cashValue+"</label></td></tr>";
					sip += "<tr><th scope='row'>Period</th>";
					sip += "<td><label>"+period+"</label></td></tr>";
					sip += "<tr><th scope='row'>Start Date</th>";
					sip += "<td><label>"+startDate+"</label></td></tr>";
					sip += "<tr><th scope='row'>Duration</th>";
					sip += "<td><label>"+duration+"</label></td></tr>";
					sip += "<tr><th scope='row'>Order Mode</th>";
					sip += "<td><label>"+orderMode+"</label></td></tr>";
    
	    $("#tblDelSuccess tbody").append(sip);
		$('#goDel').click();

	}else{
		alert(JSON.parse(data.ev).DeleteSIPData[0].ReturnMsg);
		return false;
	}

}

//sip manual
function manSIP(){

	
	var jsonObject = {};
	jsonObject['clicde'] = $('#CliCode').html();
	
     console.log("jsonObject passed to Backend : "+JSON.stringify(jsonObject));
	manSIPReq(jsonObject);
}

function manSIPResp(data){
console.log("manSIPResp:"+JSON.stringify(data));
	
	if(data.s&&data.s=="200"&&JSON.parse(data.ev).ManualSIPData.length>=1){
		console.log("manSIPResp: done");
		
		var obj = JSON.parse(data.ev);
		var sip = "";
	    console.log(obj);
		
		for(var i=0; i < obj.ManualSIPData.length; i++){
		var sipObj = obj.ManualSIPData[i];
		var num = sipObj.RecordID;
		$('#dID_'+num).html(num);
		$('#accExch_'+num).html(sipObj.AccExchCode);

			var dateString  = sipObj.Date;
			var year = dateString.substring(0,4);
			var month = dateString.substring(4,6);
			var day = dateString.substring(6,8);
			var Date1 = day+ "-" + month+ "-" + year;
		
			var c = parseFloat(sipObj.CashValue);
			var cashValue = c.toFixed(4);
			
			

			
			

					sip += "<tr><td><label id='manDate_"+num+"'>"+Date1+"</label></td>";
					sip += "<td><label id='manstkCode_"+num+"'>"+sipObj.StockCode+"</label></td>";
					sip += "<td><label id='mancash_"+num+"'>"+cashValue+"</label></td>";
					sip += "<td><div><a class='btn-glow2 btn_nor1 btn_s1 xsmb5' onclick='buySIP("+num+")'>Buy Now</a> ";
					sip += "<a class='btn-glow2 btn_nor1 btn_s1 xsmb5' onclick='skipSIP("+num+")' >Skip</a> ";
					/*sip +=  "<div class='popover' id='dtlReminderDiv' >" ;
                    sip +=            "<div class='arrow'></div>" ;
                    sip +=            //'<h3 class="popover-title"></h3>' +
                    sip +=            "<div class='popover-content text-center'>Skip for this round schedule?" ;
                    sip +=            "</div>";
                    sip +=            "<div class='popover-content text-center'>";
                    sip +=            "<div class='button'>" ;
                    sip +=            "<a class='btn btn-small'  onclick='javascript:skipSIP();'></a>" ;
                    sip +=            "<a class='btn btn-small' data-dismiss='confirmation' id='cancelDlt'></a>" ;
                    sip +=            "</div>" ;
                    sip +=            "</div>" ;
                    sip +=            "</div>";*/
					sip+="<span id='bhcode_"+num+"' class='bhcode' style='display:none'>"+sipObj.BHCode+"</span>";
					sip+="<span id='mode_"+num+"' class='mode' style='display:none'>"+sipObj.Mode+"</span>";
					sip+="<span id='dID_"+num+"' class='dID' style='display:none'>"+num+"</span>";
					sip+="<span id='accExch_"+num+"' class='accExch' style='display:none'>"+sipObj.AccExchCode+"</span></div></td></tr>";
					
		}	
    
	    $("#tblSIPAdv thead").append(sip);


	}else if(JSON.parse(data.ev).ManualSIPData.length==0){
	$('#redirect').click();
	}else{
		
		alert("No Record Found");
		$('#redirect').click();
	}

}
//buy manual
function buySIP(val){
	
	var jsonObject = {};
	var stkCd = $('#manstkCode_'+val).html();
	var accExch  = $('#accExch_'+val).html();
	var dID = $('#dID_'+val).html();
	var mode = $('#mode_'+val).html();
	var bhcode = $('#bhcode_'+val).html();
	var sdt = $('#manDate_'+val).html();
	var $accDetail = $('#TrdAccSel');
	var valaccType=$accDetail.find(':selected').attr('value');
	var splitValue = valaccType.split("|");
	
	
		jsonObject['accExch'] = accExch;
		jsonObject['brch'] = splitValue[0];
		jsonObject['trdAc'] = splitValue[1];
		jsonObject['sc'] = stkCd;
		jsonObject['dID'] = dID;
		jsonObject['bhCode'] = bhcode;
		jsonObject['mode'] = mode;
		jsonObject['sdt'] = sdt;
	
     console.log("jsonObject passed to Backend : "+JSON.stringify(jsonObject));
	buySIPReq(jsonObject);
	var rows = document.getElementById("tblSIPAdv").getElementsByTagName("thead")[0].rows.length;
	if (rows==2){
	$('#redirect').click();
	}
}

function buySIPResp(data){
console.log("buySIPResp:"+JSON.stringify(data));
		if(data.s&&data.s=="200"&&JSON.parse(data.ev).ProceedManualSIP[0].ReturnCode == "0"){
		console.log("buySIPResp: done");
		$('#refresh').click();
		}else{
		
		alert(JSON.parse(data.ev).ProceedManualSIP[0].ReturnMsg);
		return false;
		}

}



//skip this round
function skipSIP(val){

	var jsonObject = {};
	var stkCd = $('#manstkCode_'+val).html();
	var accExch  = $('#accExch_'+val).html();
	var dID = $('#dID_'+val).html();
	var mode = $('#mode_'+val).html();
	var bhcode = $('#bhcode_'+val).html();
	var sdt = $('#manDate_'+val).html();
	var $accDetail = $('#TrdAccSel');
	var valaccType=$accDetail.find(':selected').attr('value');
	var splitValue = valaccType.split("|");
	
	
		jsonObject['accExch'] = accExch;
		jsonObject['brch'] = splitValue[0];
		jsonObject['trdAc'] = splitValue[1];
		jsonObject['sc'] = stkCd;
		jsonObject['dID'] = dID;
		jsonObject['bhCode'] = bhcode;
		jsonObject['mode'] = mode;
		jsonObject['sdt'] = sdt;
     console.log("jsonObject passed to Backend : "+JSON.stringify(jsonObject));
	skipSIPReq(jsonObject);
	var rows = document.getElementById("tblSIPAdv").getElementsByTagName("thead")[0].rows.length;
	if (rows==2){
	$('#redirect').click();
	}
}

function skipSIPResp(data){
console.log("skipSIPResp:"+JSON.stringify(data));
		if(data.s&&data.s=="200"){
		console.log("skipSIPResp: done");
		$('#refresh').click();
		}else{
		
		
		}

}

function mapAccType(symbol){
	var value = "";
	switch(symbol){
		case "M":
			value = "Margin";
			break;
		case "T":
			value = "Non Margin";
			break;
		case "N":
			value = "Nominees";
			break;
		case "X":
			value = "STS";
			break;
		case "V":
			value = "EES A/C";
			break;
		case "W":
			value = "ESOS";
			break;
		case "K":
			value = "Ext ESOS";
			break;
		case "H":
			value = "Ext Margin";
			break;
		case "Y":
			value = "Clicks Trader";
			break;
	}
	return value;
}
