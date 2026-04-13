var action="";
var outputValue,inputValue;

function caSubsEncryptValue() {
	var v="";
	var $accDetail = $('#selTrdAcc');
	var valaccType=$accDetail.find(':selected').attr('value');
	var jsonObject = {'accType' : valaccType};
	console.log("original data "+jsonObject);
	$('#lastUpdate').html($.datepicker.formatDate("dd/mm/yy", new Date()));

	$("#input").val(JSON.stringify(jsonObject));
	$("#CASubsubmit").click();
}

function verifyCaAccountEncryptValue(sCaID) {
	var v="";
	var $accDetail = $('#selTrdAcc');
	var valaccType=$accDetail.find(':selected').attr('value');
	var splitValue = valaccType.split("|");
	var jsonObject = {'bhBranch' : splitValue[0], 'bhCliCode' : splitValue[1], 'accType' : splitValue[2], 'cdsNo' : splitValue[3], 'caID' : sCaID};
	console.log("original data "+jsonObject);

	$("#input").val(JSON.stringify(jsonObject));
	$("#CASubsubmit").click();
}

function subsBalEncryptValue() {
	var v="";
	var $accDetail = $('#selTrdAcc');
	var valaccType=$accDetail.find(':selected').attr('value');
	var splitValue = valaccType.split("|");
	var sCaID  =  $('#tblCARead').attr("caID");
	
	var jsonObject = {'bhBranch' : splitValue[0], 'cdsNo' : splitValue[3], 'caID' : sCaID};
	console.log("original data "+jsonObject);

	$("#input").val(JSON.stringify(jsonObject));
	$("#CASubsubmit").click();
}

function clientInfoEncryptValue() {		
	var jsonObject = {'attr1' : 'cliname', 'attr2' : 'senderEmailATP', 'attr3' : 'senderMobileATP', 'attr4' : 'ICNo'};
	console.log("original data "+jsonObject);
	action="getClientInfo"

	$("#input").val(JSON.stringify(jsonObject));
	$("#CASubsubmit").click();
}

function execSubsciptionEncryptValue() {
	var v="";
	var $accDetail = $('#selTrdAcc');
	var valaccType=$accDetail.find(':selected').attr('value');
	var splitValue = valaccType.split("|");
	var sCaID  =  $('#tblCARead').attr("caID");
	var stockCode = $('#tblSubscriptAction').attr("stockCode");
	var trdPin = $('#txtTrdPin').val();
	var entitledQty = $('.qty').val();
	var excessQty="";
	var entitledPrice= $('#price').html();
	var excessPrice="";
	var totEntitledAmt="";
	var totExcessAmt="";
	var totAmt = $('#total').html();
	//var contactNo = $('#contact3').val();
	var contactNo = "";
	//var email =  $('.clientEmail').html();
	var email = "";
	//var payMethod =  $('input[name=MerBank]:checked', '#divSubscriptPayment').attr("bankDesc");
	var payMethod = "";
	//var bnkAccNo = $('#txtCimbAcc').val();
	var bnkAccNo ="";
	
	/*if(contactNo == ""){
		contactNo = $('.clientContNo').html();
	}*/			
	/*
	$( ".optionRights" ).each(function() {
		var $row = $(this).closest("tr");
		if($(this).attr("value") == "Y"){			
			entitledQty = $row.find('.qty').val();
			entitledPrice = $row.find('.price').attr("value");
			totEntitledAmt = $row.find('.charges').html();
			
		}else{
			excessQty = $row.find('.qty').val();
			excessPrice = $row.find('.price').attr("value");
			totExcessAmt = $row.find('.charges').html();			
		}
	});
	*/
	var jsonObject = {'bhBranch' : splitValue[0], 'bhCliCode' : splitValue[1], 'accType' : splitValue[2], 'cdsNo' : splitValue[3], 'caID' : sCaID, 'stockCode' : stockCode, 'trdPin' : trdPin, 'entitledQty' : entitledQty, 'excessQty' : excessQty, 'entitledPrice' : entitledPrice, 'excessPrice' : excessPrice, 'totEntitledAmt' : totEntitledAmt, 'totExcessAmt' : totExcessAmt, 'totAmt' : totAmt, 'contactNo' : contactNo, 'email' : email, 'payMethod' : payMethod, 'bnkAccNo' : bnkAccNo};
	
	/*var jsonObject = {'bhBranch' : splitValue[0], 'bhCliCode' : splitValue[1], 'accType' : splitValue[2], 'cdsNo' : splitValue[3], 'caID' : sCaID, 'stockCode' : stockCode, 'trdPin' : trdPin, 'entitledQty' : entitledQty, 'excessQty' : excessQty, 'entitledPrice' : entitledPrice, 'excessPrice' : excessPrice, 'totEntitledAmt' : totEntitledAmt, 'totExcessAmt' : totExcessAmt, 'totAmt' : totAmt};*/
	console.log("original data "+jsonObject);
	action="execSubscription";
	$("#input").val(JSON.stringify(jsonObject));
	$("#CASubsubmit").click();
}


function getSubsLogEncryptValue(mode, refNo, sAccNo) {
	
	var $accDetail = $('#selTrdAcc');
	var bhBranch;
	var bhCliCode;
	if($accDetail.length!=0){
		var valaccType=$accDetail.find(':selected').attr('value');
		var splitValue = valaccType.split("|");
		bhBranch = splitValue[0];
		bhCliCode = splitValue[1];
		
	}else if(typeof sAccNo !="undefined"&&sAccNo.length > 0){
		nLen = sAccNo.length();
		bhBranch = sAccNo.substring(0, 3);
		bhCliCode = sAccNo.substring(3, nLen);
	}else{
		alert("Unable to retrieve trading account info.\nUnexpected error.");
	}



	var jsonObject = {'bhBranch' : bhBranch, 'bhCliCode' : bhCliCode, 'mode' : mode, 'refNo' : refNo};
	console.log("original data "+jsonObject);
	action="getSubsLogList";
	$("#input").val(JSON.stringify(jsonObject));
	$("#CASubsubmit").click();

}

function cancelSubscriptionEncryptValue() {		
console.log("asd"+$('#refID').val());
	var jsonObject = {'refNo' : $('#refID').val()};
	console.log("original data "+jsonObject);
	action="cancelSubscription"

	$("#input").val(JSON.stringify(jsonObject));
	$("#CASubsubmit").click();
}

function caSubsBeginEnc(){
	var isSelectAcc = $("#divSelectAcc").css("display");
	var isReadAgree = $("#divReadAgree").css("display");
	var isSubscript = $("#divSubscript").css("display");
	var isComplete = $("#divComplete").css("display");
	var isVerifyAcc = $("#tblCASubs").css("display");

	if(action=="getClientInfo"){
		action="";
		getClientInfoWEncryption();		
	}else if(action=="execSubscription"){
		action="";
		execSubscriptionWEncryption();
	}else if(action=="getSubsLogList"){
		getSubsLogWEncryption();
console.log("getSubsLogWEncryption");		
	}else if(action=="cancelSubscription"){
		CancelSubscriptionWEncryption();
	}else if(isSelectAcc!="none" && isVerifyAcc!="none"){		
		verifyAccWEncryption();
	}else if(isSelectAcc!="none"){
		selectAccWEncryption();
	}else if(isReadAgree!="none"){

	}else if(isSubscript!="none"){
		getSubsBalWEncryption();		
		
	}else if(isComplete!="none"){
		
	}
}

function popupWin(act){
		$("#popupIFrame").attr("src",root_url+"web/html/cliLoginPop.html?act="+act);
		$("#triggerAnchor")[0].click()
}


function completeWEncryption(){
	var av="",cs="";
	console.log("-- Complete --");			
	av = encValWAES();
	cs = JSChecksum(av);
	console.log("Checksum: "+cs);
	getCompleteInfo(av,cs);
}

function selectAccWEncryption(){
	var av="",cs="";
	console.log("-- Select Account --");			
	av = encValWAES();
	cs = JSChecksum(av);
	console.log("Checksum: "+cs);
	getCASubsInfo(av,cs);
}

function verifyAccWEncryption(){
	var av="",cs="";
	console.log("-- Verify Account --");			
	av = encValWAES();
	cs = JSChecksum(av);
	console.log("Checksum: "+cs);
	verifyCASubsInfo(av,cs);
}

function getSubsBalWEncryption(){
	var av="",cs="";
	console.log("-- Get Subs Balance --");			
	av = encValWAES();
	cs = JSChecksum(av);
	console.log("Checksum: "+cs);
	getSubsBal(av,cs);	
}

function getClientInfoWEncryption(){
	var av="",cs="";
	console.log("-- Get Client Info --");			
	av = encValWAES();
	cs = JSChecksum(av);
	console.log("Checksum: "+cs);
	getClientInfo(av,cs);
}

function execSubscriptionWEncryption(){
	var av="",cs="";
	console.log("-- Execute Subscription --");			
	av = encValWAES();
	cs = JSChecksum(av);
	console.log("Checksum: "+cs);
	execSubscription(av,cs);
}

function getSubsLogWEncryption(){
	var av="",cs="";
	console.log("-- Get Subscription Log--");			
	av = encValWAES();
	cs = JSChecksum(av);
	console.log("Checksum: "+cs);
	getCASubsLog(av,cs);
}

function CancelSubscriptionWEncryption(){
	var av="",cs="";
	console.log("-- Cancel Subscription--");			
	av = encValWAES();
	cs = JSChecksum(av);
	console.log("Checksum: "+cs);
	cancelSubscriptions(av,cs);
}


function tradeAccInfoSubs_response(data){
	console.log(data);
	$('#lblLoginID').html(data.loginid);
	
	$('#lastUpdate').html($.datepicker.formatDate("dd/mm/yy", new Date()));
	
	
	if(data.status="0"){
		for (var i=0;i<data.bhCliInfo.length;i++)
		{			
			var $option=$('<option />');
			$option.attr('value', data.bhCliInfo[i].branchCode+"|"+data.bhCliInfo[i].bhCliCode+"|"+data.bhCliInfo[i].accType+"|"+data.bhCliInfo[i].cdsNo+"|"+data.bhCliInfo[i].cliName);			
			accTypeSelName=mapAccType(data.bhCliInfo[i].accType);
			$option.text(accTypeSelName+" (" + data.bhCliInfo[i].bhCliCode+"-"+data.bhCliInfo[i].branchCode+") "+data.bhCliInfo[i].cliName);
			$('#selTrdAcc').append($option);		
			$('#lblCliName').html(data.bhCliInfo[0].cliName);
			$('#bhBranchComplete').html(data.bhCliInfo[0].branchCode);	
		}
			$('#selTrdAcc').on('change', function(){
				var $accDetail = $('#selTrdAcc');
				var valaccType=$accDetail.find(':selected').attr('value');
				var splitValue = valaccType.split("|");				
				$('#lblCliName').html(splitValue[4]);
			})
		caSubsEncryptValue();		
	}	

}

function tradeAccInfoStatus_response(data){
	console.log(data);
	$('#lblLoginID').html(data.loginid);	
	$('#lastUpdate').html($.datepicker.formatDate("dd/mm/yy", new Date()));
	
	
	if(data.status="0"){
		for (var i=0;i<data.bhCliInfo.length;i++)
		{
			var $option=$('<option />');
			$option.attr('value', data.bhCliInfo[i].branchCode+"|"+data.bhCliInfo[i].bhCliCode+"|"+data.bhCliInfo[i].accType+"|"+data.bhCliInfo[i].cdsNo+"|"+data.bhCliInfo[i].cliName);			
			accTypeSelName=mapAccType(data.bhCliInfo[i].accType);
			$option.text(accTypeSelName+" (" + data.bhCliInfo[i].bhCliCode+"-"+data.bhCliInfo[i].branchCode+") "+data.bhCliInfo[i].cliName);
			$('#selTrdAcc').append($option);		
			$('#lblCliName').html(data.bhCliInfo[0].cliName);			
		}
		$('#selTrdAcc').on('change', function(){
				var $accDetail = $('#selTrdAcc');
				var valaccType=$accDetail.find(':selected').attr('value');
				var splitValue = valaccType.split("|");
				getSubsLogEncryptValue('0','','');		
				$('#lblCliName').html(splitValue[4]);
			})
		getSubsLogEncryptValue('0','','');		
		
	}	

}


function getCASubsInfo_response(data){
	console.log(data);
	//createTableRow();
	if(data.length > 0)
	{
		$('#tblCASubs').show();
		$('#caSubsTitle').show();		
		for(var i=0;i<data.length;i++){
			createTableCAInfoRow(data[i],i);
		}
	}else if (data.length ==0){
		$('#tblCASubs').hide();
		$('#caSubsTitle').hide();
		$('#noDataMsg').text("There is no record found");
		$('#noDataMsg').show();	
	}
	
}

function verifyCASubsInfo_response(data){
	console.log(data);	
	if(data.length > 0)
	{		
		$('#tblSubscriptOption > tbody').remove();	
		$('#tblCAOption > tbody').remove();
//		$('#tblCAOption').attr('caOption',data);
		for(var i=0;i<data.length;i++){			
			if(data[i].returnVal!="-1"){
				createTblCAOptionRow(data[i]);
				createtTblSubscriptOptionRow(data[i],i);
				$('.totPay').html("0.00");
				chgLayout(5);
				
			}else{				
				alert(data[i].returnMsg);
				
				break;
			}
		}
	}else if (data.length == 0){		
		alert("No CA Option info found.");
	}
	
}

function getSubsBal_response(data){
	console.log(data);
	//createTableRow();
	if(data!=null)
	{				
		if(data.returnVal!="-1"){
			createTblCASubsBalance(data);			
		}else if(data.returnMsg != ""){
			alert(data.returnMsg);
		}else{		
			alert("CA subscription balance not found");
		}	
	}else {
		alert("Unexpected error, please retry.\nIf problem still exist, please contact customer support");
	}
}

function getClientInfo_response(data){
	console.log(data);
	
	if(typeof data!="undefined")
	{						
		setClientInfo(data);
	}else{		
		//alert("No data");
	}	
}

/*function execSubscription_response(data){
	console.log(data);	
	var $accDetail = $('#selTrdAcc');
	var valaccType=$accDetail.find(':selected').attr('value');
	var splitValue = valaccType.split("|");	
	if(typeof data!="undefined")
	{						
		if(data.returnVal != "-1")
		{			
			$('#Acc').val(splitValue[1] + "-" + splitValue[0]);
			$('#Amt').val($('#tblSubscriptTotPay .totPay').html());
			$('#Bank').val( $('input[name=MerBank]:checked', '#divSubscriptPayment').val());
			$('#refID').val(data.refID);
			$('#AccTypeDesc').val(mapAccType(splitValue[2]));			
			$('#caID').val($('#tblCARead').attr('caID'));
			
			document.frmPaymentSubmit.submit();
		}else{
			alert(data.returnMsg);
		}
	}else{		
		//alert("No data");
	}	
}
*/
function getToday(){
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();

if(dd<10) {
    dd = '0'+dd
} 

if(mm<10) {
    mm = '0'+mm
} 
return today = dd + '/' + mm + '/' + yyyy;
}

function execSubscription_response(data){
	console.log(data);	
	var $accDetail = $('#selTrdAcc');
	var valaccType=$accDetail.find(':selected').attr('value');
	var splitValue = valaccType.split("|");	
	if(typeof data!="undefined")
	{						
		if(data.returnVal != "-1")
		{		
	
	
		$('#orderNo').html(data.refID);
		$('#status').html(data.status);
		$('#stockNameComplete').html(document.getElementById ( "stockName1" ).innerText);
		$('#priceComplete').html($('#price').html());
		$('#subsQty').html($("input[name=qty1]").val());
		$('#totAmt').html($('#total').html());
		$('#appDate').html(getToday());
		
		chgLayout(4);
		
		}else{
			alert(data.returnMsg);
		}
	}else{		
		//alert("No data");
	}	
}



function getCASubsLog_response(data){
	console.log(data);
	//createTableRow();
		console.log("getCASubsLog_response");
	if(data.length > 0)
	{
		$('#tblCASubsLogContent > tbody').remove();
		$('.tblCASubsLog').show();		
		for(var i=0;i<data.length;i++){
			createTableCASubsLogRow(data[i],i);
		}
		$("#tblCASubsLogContent tr.pending").click( function(){
			
			$("#tblCASubsLogContent tr.pending").each(function() {
				$(this).removeClass("selectedRow");
				$(this).css('background-color', '');
				var amt = parseFloat($(this).find(".refID").attr("Amt")).toFixed(2);
			$('#refID').val($(this).find(".refID").html());
			$('#Amt').val(amt);
			$('#caID').val($(this).find(".refID").attr("caID"));
			});
			$("#btnResubmit").prop('disabled', false);
			$("#btnCancel").prop('disabled', false);
			$(this).css('background-color', 'aqua');
			$(this).addClass("selectedRow");

			
			clientInfoEncryptValue(); //To reset sRefresh flag
		});
	}else if(data.length == 0){
		$('#tblCASubsLogContent > tbody').remove();
		//$('.tblCASubsLog').hide();				
		alert("No Corporate Action Subscription Status found for selected account");
	}else{
		$('#tblCASubsLogContent > tbody').remove();
		//$('.tblCASubsLog').hide();		
		alert("Unexpected error");
	}
	
}

function cancelSubscription_response(data){
	console.log(data);
	if(typeof data!="undefined")
	{						
		if(data.returnVal != "-1")
		{			
			alert("Cancel successfully");
			getSubsLogEncryptValue('0','','');		
		}else{
			alert(data.returnMsg);
		}
	}else{		
		//alert("No data");
	}	
}

function createTableCASubsLogRow(data,i){
	var tblRow ="";
	var oddEven ="";
	

	
	if(data.status == "0"){
		oddEven += " pending";
	}
	
	
	tblRow = "<tr >";
	tblRow += "<td >&nbsp;" + data.AppDate +"</td>";
	tblRow += "<td >" + data.stockName +"</td>";
	tblRow += "<td >" + data.qtyOfShares +"</td>";
	
	if(data.status == "0"){
		tblRow += "<td ><a href='javascript:void(0)'>" + data.remark +"</a></td>";
	}else{
		tblRow += "<td >" + data.remark +"</td>";
	}
	
	
	tblRow += "<td class=' refID' Amt='"+ data.totAmount +"' Bank='"+ data.bank +"' caID="+ data.caID+">" + data.appRefNo +"</td>";
	
	if(data.invoiceID !="")
	{
		tblRow += "<td class='clsRepLastCol' style='display:none' align='center'><img src='../img/butPrint.png' width='18' height='18' onclick=openTaxInvoice('"+ data.appRefNo +"');></td>";
	}else{
		tblRow += "<td class='clsRepLastCol' style='display:none' align='center'>&nbsp;</td>";
	}

	//tblRow += "<td class='clsRepFirstCol'>&nbsp;" + "data.AppDate" +"</td>";
	// tblRow += "<td class='clsRepMidCol'>" + "data.stockName" +"</td>";
	// tblRow += "<td class='clsRepMidCol'>" + "data.qtyOfShares" +"</td>";
	// tblRow += "<td class='clsRepMidCol'>" + "data.status" +"</td>";
	// tblRow += "<td class='clsRepMidCol'>" + "data.appRefNo" +"</td>";
	// tblRow += "<td class='clsRepLastCol' align='center'><img src='../img/butPrint.png' width='18' height='18' onclick='openTaxInvoice(12);'></td>";
	  tblRow += "</tr>";
	 
	$('#tblCASubsLogContent').append(tblRow);
	// tblRow = "<tr width='100%' class='clsRepRowEven pending'>";
		// tblRow += "<td class='clsRepFirstCol'>&nbsp;" + "data.AppDate" +"</td>";
	// tblRow += "<td class='clsRepMidCol'>" + "data.stockName" +"</td>";
	// tblRow += "<td class='clsRepMidCol'>" + "data.qtyOfShares" +"</td>";
	// tblRow += "<td class='clsRepMidCol' ><a href='javascript:void(0)'>" + "Pending payment" +"</td>";
	// tblRow += "<td class='clsRepMidCol'>" + "data.appRefNo" +"</td>";
	 // tblRow += "<td class='clsRepLastCol' align='center'>&nbsp;</td>";
	 // tblRow += "</tr>";
	// $('#tblCASubsLogContent').append(tblRow);
	
		// tblRow = "<tr width='100%' class='clsRepRowEven pending'>";
		// tblRow += "<td class='clsRepFirstCol'>&nbsp;" + "data.AppDate" +"</td>";
	// tblRow += "<td class='clsRepMidCol'>" + "data.stockName" +"</td>";
	// tblRow += "<td class='clsRepMidCol'>" + "data.qtyOfShares" +"</td>";
	// tblRow += "<td class='clsRepMidCol' ><a href='javascript:void(0)'>" + "Pending payment" +"</td>";
	// tblRow += "<td class='clsRepMidCol refID'>" + "data.appRefNo" +"</td>";
	 // tblRow += "<td class='clsRepLastCol' align='center'>&nbsp;</td>";
	 // tblRow += "</tr>";
	// $('#tblCASubsLogContent').append(tblRow);
				
}

function openTaxInvoice(refId){
	window.open(root_url+"cliGetERightTaxInvoice.jsp?refId="+ refId , "_blank");
}

function reSubmit(){
	var $accDetail = $('#selTrdAcc');
	var valaccType=$accDetail.find(':selected').attr('value');
	var splitValue = valaccType.split("|");
	
	$('#Acc').val(splitValue[1] + "-" + splitValue[0]);	
	$('#AccTypeDesc').val(mapAccType(splitValue[2]));			
			
	document.frmPaymentSubmit.submit();
}

function cancelSubscription(){
	cancelSubscriptionEncryptValue();
}

function toggleTodayOrHistory(){
	$("#btnResubmit").prop('disabled', true);
	$("#btnCancel").prop('disabled', true);
	if($("#btnCAHistory").val() == "Application(s) History"){
		getSubsLogEncryptValue(1,'','');
		$("#btnCAHistory").val("Today") ;
	}else{
		getSubsLogEncryptValue(0,'','');
		$("#btnCAHistory").val("Application(s) History") ;
	}
	
}


function setClientInfo(data){
	var $accDetail = $('#selTrdAcc');
	var valaccType=$accDetail.find(':selected').attr('value');
	var splitValue = valaccType.split("|");
	
	$('.clientName').html(data.attr1);
	$('.clientTrdAcc').html(splitValue[1]);
	$('.clientCdsNo').html(splitValue[3]);
	$('.clientEmail').html(data.attr2);
	$('.clientContNo').html(data.attr3);
	$('.clientIC').html(data.attr4);
	//$('.clientDealerCd').html(data.attr5);
}

function createTblCASubsBalance(data){
	var stockName2=document.getElementById("stockName").innerHTML;
	var er2=document.getElementById("er").innerHTML;
	var tblRow;
	tblRow = "<tr>";
	tblRow += "<td id='stockName1'>"+ stockName2 +"</td>";
	tblRow += "<td id='er1'>"+ er2 +"</td>";
	tblRow += "<td>"+ data.eligibleQty +"</td>";
	tblRow += "<td ><span id = 'eRights'>"+ data.entitledQty   +"</span></td>";
	//tblRow += "<td>"+ data.buySellQty +"</td>";
	//tblRow += "<td>"+ data.subsEntitledQty +"</td>";
	//tblRow += "<td>"+ data.unSubsEntitledQty +"</td>";
	tblRow += "</tr>";	
	$('#tblCASubsBalance > tbody').remove();
	$('#tblCASubsBalance').append(tblRow);			
	$('#tblCASubsBalance').data("subsBal",data);
	
}

function createTblCAOptionRow(data){
	var tblRow;
	tblRow = "<tr>";
	tblRow += "<th scope='row'>Option "+data.optionNo+"</th>";
	tblRow += "<td>"+data.optionDesc+"</td>";
	tblRow += "</tr>";	
	
	$('#tblCAOption').append(tblRow);			
}

function createTblCAReadRow(data){
	var tblRow;
	tblRow = "<tr>";
	tblRow += "<th scope='row'>Company Action Type</th>";
	tblRow += "<td>"+ data.cadesc +"</td>";
	tblRow += "</tr>";
	tblRow += "<tr>";
	tblRow += "<th scope='row'>Description</th>";
	tblRow += "<td id ='er'>"+ data.txt1 + data.txt2 +"</td>";
	tblRow += "</tr>";
	tblRow += "<tr>";
	tblRow += "<th scope='row'>Ex-Date / Meeting-Date</th>";
	tblRow += "<td>"+ data.meetingDate +"</td>";
	tblRow += "</tr>";
	tblRow += "<tr>";
	tblRow += "<th scope='row'>Record Date</th>";
	tblRow += "<td>"+ data.recordDate +"</td>";
	tblRow += "</tr>";
	tblRow += "<tr>";
	tblRow += "<th scope='row'>Last Trading Date</th>";
	tblRow += "<td>"+ data.lastTradeDate +"</td>";
	
	tblRow += "</tr>";
	$('#tblCARead').empty();
	$('#tblCARead').append(tblRow);	
	$('#tblCARead').attr('caID',data.caID);
	$('#tblCARead').data('caInfo',data);	
	
}

function createTblCASubsDtRow(data){
	var tblRow;
	tblRow = "<tr>";
	tblRow += "<td>Corporate Action Subscription</td>";
	tblRow += "<td>"+ data.endSubsDate +"</td>";
	tblRow += "<td>"+ data.deadLineTime +"</td>";
	
	$('#tblCASubsDt').empty();
	$('#tblCASubsDt').append(tblRow);
}

function createTblSubscriptActionRow(data){
	var tblRow;
	tblRow = "<tr>";
	tblRow += "<th scope='row'>Company Action Type</th>";
	tblRow += "<td>"+ data.cadesc +"</td>";
	tblRow += "</tr>";
	tblRow += "<tr>";
	tblRow += "<th scope='row'>Issuer Name</th>";
	tblRow += "<td>"+ data.stockLongName+ " " + data.stockName +"</td>";
	tblRow += "<td id='stockName' style='display:none'>"+ data.stockName +"</td>";
	tblRow += "</tr>";
	
	$('#tblSubscriptAction > tbody').remove();
	//$('#tblSubscriptAction').empty();
	$('#tblSubscriptAction').append(tblRow);	
	$('#tblSubscriptAction').attr("stockCode",data.stockName);
}

function createtTblSubscriptOptionRow(data,count){
	

	var tblRow;
	var caInfo =  $('#tblCARead').data("caInfo");
	console.log(caInfo);	
	tblRow = "<tr>";
	//tblRow += "<td class='optionRights' value='"+ data.isRight +"' Option >"+ data.optionNo + " " + data.optionDesc +"</td>";
	tblRow += "<td><input id='qty" + count + "' type='text' name ='qty1' class='qty'></input></td>";  
	tblRow += "<td class='price' value='"+ caInfo.reinvestPrice +"'>@ "+ caInfo.reinvestPrice +"</td>";
	tblRow += "<td style='display:none'> <span id='price'>"+ caInfo.reinvestPrice +"</span></td>";
	//tblRow += "<td class='subsAmount'>0.00</td>";
	//tblRow += "<td id='charges" + count + "' class='charges' value='0'>0.00</td>";
	tblRow += "<td class='totAmount'><span id='total'>0.00</span></td>";
	tblRow += "</tr>";	
		
	//var qtyRow = "#qty" + count;
	$('#tblSubscriptOption').append(tblRow);

 $("input[name=qty1]").keypress(function(event){

       if(event.which != 8 && isNaN(String.fromCharCode(event.which))){
           event.preventDefault(); //stop character from entering input
       }

   });	

		 $("input[name=qty1]").keyup(function(ev){
			  var total =  $("input[name=qty1]").val() * $('#price').html() ;
			$('#total').html((total).toFixed(2));
			});	
	//$('#tblSubscriptOption').on('blur', qtyRow, calculateRow);	
	//$('#tblSubscriptOption').on('keyup', qtyRow, calculateRow);		
	/*$('#tblSubscriptOption').on('input', qtyRow, function(event){   //hau removed
		calculateRow(qtyRow);
	});	*/
	
	/*$('#tblSubscriptOption').on('paste', qtyRow, function(event){
		setTimeout(function () {
    		calculateRow(qtyRow);
    
 	 }, 100);
	});	
	$('#tblSubscriptOption').on('cut', qtyRow, function(event){
		setTimeout(function () {
    		calculateRow(qtyRow);
    
 	 }, 100);
	});	*/
	//$(".charges").attr('title', 'This is the hover-over text');
	//var charges = 
	
	//$("#charges"+count).data("caOption",data);    //hau removed
	
}

function validateSubscription(qty, isRight){
	var subsBal = $('#tblCASubsBalance').data("subsBal")
	if(qty>parseInt(subsBal.unSubsEntitledQty) && isRight=="Y"){		
		return false;
	}else{
		return true;
	}
	
}

/*function calculateRow(id){
	var $row = $(id).closest("tr");
	var qty = parseFloat($row.find('.qty').val());
	var price = parseFloat($row.find('.price').attr("value"));
	var charges = parseFloat($row.find('.charges').attr("value"));
	var isRight = $row.find('.optionRights').attr("value");
	var strQty = $row.find('.qty').val();
	var caInfo =  $('#tblCARead').data("caInfo");
	var caOption = $row.find('.charges').data("caOption");
	var title = "";
	var reg = new RegExp('^[0-9]+$');	
	
	if(reg.test($row.find('.qty').val())){
		//if(isRight =="Y"){
			//$row.find('.charges').attr('title', '●*Registar Fee - MYR ' + caInfo.registarFee + '\n●*Bank Draft - MYR ' + caInfo.bnkDraftFee + '\n●Bank Draft Stamp Duty - MYR ' + caInfo.bnkDraftStampDuty + '\n●Stamp Duty - MYR ' + caInfo.stampDutyFee);								
			//charges = parseFloat(caInfo.registarFee) + parseFloat(caInfo.bnkDraftFee) + parseFloat(caInfo.bnkDraftStampDuty) + parseFloat(caInfo.stampDutyFee);		
		//}else{
			//$row.find('.charges').attr('title', '●*Bank Draft - MYR ' + caInfo.bnkDraftFee + '\n●Bank Draft Stamp Duty - MYR ' + caInfo.bnkDraftStampDuty);			
			//charges = parseFloat(caInfo.bnkDraftFee) + parseFloat(caInfo.bnkDraftStampDuty);
		//}
		if(qty != 0)
		{
			if(caOption.registarFee !=0)
			{
				var registarFeeGST = roundToTwo(parseFloat(caOption.registarFee) + parseFloat(caOption.registarFeeGST));				
				title +=  '●*Registar Fee - MYR ' + registarFeeGST + '\n';
				charges +=  registarFeeGST ;
			}
		
			if(caOption.bnkDraftFee !=0)
			{
				var bnkDraftGST = roundToTwo(parseFloat(caOption.bnkDraftFee) + parseFloat(caOption.bnkDraftFeeGST));				
				title +=  '●*Bank Draft - MYR ' + bnkDraftGST + '\n';
				charges +=  bnkDraftGST ;
			}
			
			if(caOption.bnkDraftStampDuty !=0)
			{
				var bnkDraftStampDutyGST = roundToTwo(parseFloat(caOption.bnkDraftStampDuty));				
				title +=  '●Bank Draft Stamp Duty - MYR ' + bnkDraftStampDutyGST + '\n';
				charges += bnkDraftStampDutyGST ;
			}
			
			if(caOption.stampDutyFee !=0)
			{
				var stampDutyFeeGST = roundToTwo(parseFloat(caOption.stampDutyFee));				
				title +=  '●Stamp Duty - MYR ' + stampDutyFeeGST + '\n';
				charges +=  stampDutyFeeGST ;
			}
			
			if(caOption.bursaFee !=0)
			{
				var bursaFeeGST = roundToTwo(parseFloat(caOption.bursaFee) + parseFloat(caOption.bursaFeeGST));				
				title +=  '●Bursa Fee - MYR ' + bursaFeeGST + '\n';
				charges +=  bursaFeeGST ;
			}
			
			if(caOption.reserveCharge1 !=0)
			{
				var reserveCharge1GST = roundToTwo(parseFloat(caOption.reserveCharge1) + parseFloat(caOption.reserveCharge1GST));				
				title +=  'Reserved Charge 1 - MYR ' + reserveCharge1GST + '\n';
				charges +=  reserveCharge1GST ;
			}
			
			if(caOption.reserveCharge2 !=0)
			{
				var reserveCharge2GST = roundToTwo(parseFloat(caOption.reserveCharge2));				
				title +=  '●Reserved Charge 2 - MYR ' + reserveCharge2GST + '\n';
				charges +=  reserveCharge2GST ;
			}
						
		}else{
			charges = 0;
			title = "";
		}
		
		$row.find('.charges').attr('title', title);
		$row.find('.charges').html(parseFloat(charges).toFixed(2));
		
		if(validateSubscription(qty,isRight)){
			var subsAmount = qty * price;
			var totAmount = subsAmount + charges;
			$row.find('.subsAmount').html(parseFloat(subsAmount).toFixed(2));
			$row.find('.totAmount').html(parseFloat(totAmount).toFixed(2));	
			calculateTotPay();	
		}else{
			alert("Instructed quantity is over Uninstructed quantity, please revise.");
			//$row.find('.qty').val(strQty.substring(0,strQty.length-1));
			$row.find('.qty').val('');
			calculateRow(id);
		}
	}else{
		$row.find('.charges').html("0.00");
		$row.find('.charges').removeAttr('title');
		$row.find('.subsAmount').html("0.00");		
		$row.find('.totAmount').html("0.00");	
		calculateTotPay();
		if($row.find('.qty').val() != ''){
			alert("Please enter valid quantity");
			$row.find('.qty').val('');
		}
		
		
	}	
	
} */

/*function calculateTotPay(){
	var totPay = 0;
	$('#tblSubscriptOption .totAmount').each(function()
	{
		totPay += parseFloat($(this).html());		
	});	
	
	$('#tblSubscriptTotPay .totPay').html(parseFloat(totPay).toFixed(2));
}*/

function createTableCAInfoRow(data,count){
	var tblRow;
	tblRow = "<tr>";
	
	//tblRow += '<td><a href="" onclick="verifyCaAccountEncryptValue('+test+');return false;"><u>asdsd</u></a></td>';
	//tblRow += "<td><a href='#' onclick='return false;'><u><p class='clickable'>" + data.stockLongName + " ("+ data.stockName +")" + "</p></u><a></td>";
	tblRow += "<td><a href='#' onclick='return false;'><u><p class='clickable'  id='tblRow"+ count +"'>"+data.cadesc +"</p></u><a></td>";
	tblRow += "<td>"+ data.startSubsDate +"</td>";
	tblRow += "<td>"+ data.endSubsDate +"</td>";
	tblRow += "<td>"+ data.txt1 + data.txt2 +"</td>";
	tblRow += "<td>"+ data.reinvestPrice +"</td>";
	//tblRow += "<td>"+ data.txt1 + data.txt2 +"</td>";
	tblRow += "<td style='display:none'>"+ data.meetingDate +"</td>";
	tblRow += "<td style='display:none'>"+ data.recordDate +"</td>";
	tblRow += "<td>"+ data.lastTradeDate +"</td>";
	tblRow += "</tr>";
	
	$('#tblCASubs').append(tblRow);
	
	$("#tblRow"+count).click(function(){
		verifyCaAccountEncryptValue(data.caID);
		$("#titAction").text(data.stockLongName + " (" + data.stockName + ")");
		
		createTblCAReadRow(data);		
		createTblCASubsDtRow(data);
		createTblSubscriptActionRow(data);
		//createtTblSubscriptOptionRow(data);
		//chgLayout(5);
	})
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

function checkCompleteSts(handleData){
	
	var bhBranch = $('#bhBranchComplete').html();
	var bhCliCode =$('#Acc').val();
	var refNo = $('#refID').val();
	
	console.log(bhBranch);
	console.log(bhCliCode);
	console.log(refNo);
	
	//var jsonObject = {'TranDt' : '20151119', 'PayeeID' : 'CIMBEBC', 'BilAccNo' : '0010C2656', 'BilRefNo' : '', 'Amt' : '12.13'};
	var jsonObject = {'bhBranch' : bhBranch, 'bhCliCode' : bhCliCode, 'mode' : '0', 'refNo' : refNo};
		
	completeWEncryption();

	
	
}



function setTblComplete(data){
	console.log(data);
	
	$('#orderNo').html(data.appRefNo);
	$('#status').html(data.status);
	$('#stockName').html(data.stockName);
	$('#subsQty').html(data.qtyOfShares);
	$('#totAmt').html(data.totAmount);
	$('#appDate').html(data.AppDate);
	chgLayout(4);
}

function checkChild(){
	
	console.log("abcd");
	checkCompleteSts(function(data){			
				if (data) {
					setTblComplete(data)
					chgLayout(4);
					console.log("1234");
				}else{
				}	
			});
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

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}



$(document).ready(function() {
	$("#frmCASubsEnc").jCryption({ 
		getKeysURL:root_url+"key.jsp",
		beforeEncryption : function() {
			return true;
		}
	});
	

	
});