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

/*function trdAccATP(searchParam, accountTypeP){
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
}*/

function getCashBalance(){
	
	var jsonObject = {};
	
	
     console.log("jsonObject passed to Backend : "+JSON.stringify(jsonObject));
	wdRequestReq(jsonObject);
}


function fundOverviewResp(data){
	console.log("Displaying Fund Overview");
	console.log(data);
	var sttus = data.s;
	var msg = data.msg;
	var wd = '';
	
	
	if(sttus == "200"){
		var evdata = JSON.parse(data.ev);
		var trdgAccD = evdata.Data;
		$('#TrdAccSel').empty();

		
		if (trdgAccD != ""){
		var bhCliCode = trdgAccD.BHCliCode;
		
		console.log(trdgAccD);
				for (var i=0;i<trdgAccD.length;i++){
					var c = parseFloat(trdgAccD[i].CurrentCashDeposit);
					var fund = c.toFixed(2);
    				//var fund = c.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
					//var fund = trdgAccD[i].CurrentCashDeposit;

					var $option=$('<option />');
					$option.attr('value', trdgAccD[i].BHCode+"|"+trdgAccD[i].BHCliCode+"|"+trdgAccD[i].BHBranch+"|"+trdgAccD[i].ExchangeCode);
					$option.text(" (" + trdgAccD[i].BHCliCode+"-"+trdgAccD[i].BHBranch+") ");


					wd+= "<li id='TrdAcc_"+trdgAccD[i].BHCliCode+"'><big id='trd_"+trdgAccD[i].BHCliCode+"'>"+trdgAccD[i].BHCliCode+"-"+trdgAccD[i].CliName+"-"+trdgAccD[i].BHBranch+"</big>";
					
					wd+= " <span id='amount_"+trdgAccD[i].BHCliCode+"' class='amount'>"+fund+"</span><span class='amount'>PHP  &nbsp</span>";
					wd+= "<span id='trdAcc_"+i+"' style='display:none'>"+trdgAccD[i].BHCliCode+"</span>";
					wd+="<span id='exchgCode_"+i+"' style='display:none'>"+trdgAccD[i].ExchangeCode+"</span></li>";

				}
				
		document.getElementById("TrdAccSel").innerHTML = wd;
		
		
		

	}else{
			console.log("No Trading Account Record Found");
			//$('#tblTDHdr').css("display","none");
			$('#TrdAccSel').empty();
			wd+= "<li><big>No Trading Account Record Found</big></li>";
			document.getElementById("TrdAccSel").innerHTML = wd;
		}
		
	}
	else{
		alert(msg);
	}
}

function getAcc(){
	
	var jsonObject = {};
	
	
     console.log("jsonObject passed to Backend : "+JSON.stringify(jsonObject));
	withdrawalReq(jsonObject);
}

function withdrawalResp(data){
console.log("Displaying Trading Account");
	console.log(data);
	var sttus = data.s;
	var msg = data.msg;
	var wd = '';
	
	
	if(sttus == "200"){
		var evdata = JSON.parse(data.ev);
		var trdgAccD = evdata.Data;
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
		
		today_date = dd + '-' + mm + '-' + yyyy;
		document.getElementById("withdrawRequest").reset();
		document.getElementById("withdrawalReq2").reset();
		$('#requestDate').html(today_date);
		 $("#selectAcc").empty();
		if (trdgAccD != ""){
		var bhCliCode = trdgAccD.BHCliCode;
		
		console.log(trdgAccD);
				for (var i=0;i<trdgAccD.length;i++){
					var c = parseFloat(trdgAccD[i].CurrentCashDeposit);
					var fund = c.toFixed(2);
    				//var fund = c.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
					//var fund = trdgAccD[i].CurrentCashDeposit;
					var $option=$('<option />');
					$option.attr('value', trdgAccD[i].BHCode+"|"+trdgAccD[i].BHCliCode+"|"+trdgAccD[i].BHBranch+"|"+trdgAccD[i].ExchangeCode+"|"+fund);
					$option.text(trdgAccD[i].BHCliCode+"-"+trdgAccD[i].CliName+"-"+trdgAccD[i].BHBranch);
					$('#selectAcc').append($option);
				}
				
		getFund();
		$("#selectAcc").val($("#selectAcc option:first").val());
		
		

	}else{
			console.log("No Trading Account Record Found");
			//$('#tblTDHdr').css("display","none");
			$('#TrdAccSel').empty();
			wd+= "<li><big>No Trading Account Record Found</big></li>";
			document.getElementById("TrdAccSel").innerHTML = wd;
		}
		
	}
	else{
		alert(msg);
	}

}


/*function withdrawalReq(){
		var trdAcc="";
		
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
		
		today_date = dd + '-' + mm + '-' + yyyy;
		document.getElementById("withdrawRequest").reset();
		document.getElementById("withdrawalReq2").reset();
		$('#requestDate').html(today_date);
		 $("#selectAcc").empty();
		var selection = document.getElementById("TrdAccSel").getElementsByTagName("li");
		
		for(var i = 0; i < selection.length; i++)
		{
		var num = $('#trdAcc_'+i).html();
		var exchgCode = $('#exchgCode_'+i).html();
		var a = $('#trd_'+num).html();
		var $option=$('<option />');
		$option.attr('value',a+"-"+exchgCode);
		$option.text(a);
		$('#selectAcc').append($option);
		}		
		getFund();
		$("#selectAcc").val($("#selectAcc option:first").val());
		
}*/

function getFund(){
	/*var $accDetail = $('#selectAcc').val();
	var valaccType=$accDetail.find(':selected').attr('text');
	console.log(accDetail);*/
	var x = document.getElementById("selectAcc").value;
	var splitValue = x.split("|");
	
	var fund =  splitValue[4];
	$('#fundAmount').html(fund);
}

function chkFund(){
	/*var regex  = /^\$?[\d,]+(\.\d{0,2})$/;
	var numStr = $('#withdrawAmount').val();
	if (!regex.test(numStr)){
    alert("Withdrawal Amount is Invalid");
	return false;
	}else*/
	 if((parseFloat($('#withdrawAmount').val()) < 500.00) || ($('#withdrawAmount').val()=="")){
	alert("Amount to withdraw cannot be empty or less than 500");
	return false;
	}else if (parseFloat($('#withdrawAmount').val()) > $('#fundAmount').html()){
	alert("Amount to withdraw cannot greater than Available Fund");
	return false;
	}
	else if (isNaN($('#withdrawAmount').val())) {
		alert("Amount should be numbers only.")
	}
	else{
	$('#requestNum2').html($('#requestNum').html());
	$('#requestDate2').html($('#requestDate').html());
	$('#withdrawAmount2').html($('#withdrawAmount').val());
	$('#selectAcc2').html($( "#selectAcc option:selected" ).text());
		
	$("#goNext").click();
}
}


function sendwithdrawalReq(){

	
	var $accDetail = $('select[name=selectAcc]').val();
	var splitValue = $accDetail.split("|");

	var jsonObject = {};
	jsonObject['trdAc'] = splitValue[1];
	jsonObject['brch'] = splitValue[2];
	jsonObject['accExch'] = splitValue[3];
	jsonObject['amt'] = $('#withdrawAmount2').html();
	jsonObject['pin'] = $('#txtPIN').val();

	
     console.log("jsonObject passed to Backend : "+JSON.stringify(jsonObject));
	 $("#tbl_wdSuccess tbody").empty();
	sendwdReq(jsonObject);
}
function sendwdResp(data){

console.log("sendwdResp:"+JSON.stringify(data));
	
	if(data.s&&data.s=="200"&&JSON.parse(data.ev).Data[0].ReturnVal=="0"){
		
		console.log("sendwdResp: done");
		
		var obj = JSON.parse(data.ev);
		var wd = "";
		var requestNum =obj.Data[0].ID;
		
		//var requestDate = obj.Data[0].DateCreated;
		var a = obj.Data[0].DateCreated;
		var splitValue = a.split(".");
		var requestDate =  (splitValue[0].replace(
    			/(\d\d\d\d)(\d\d)(\d\d)(\d\d\d\d\d\d)/, '$3-$2-$1'
					));
		var selectAcc = $('#selectAcc2').html();
		var withdrawAmount = obj.Data[0].WithdrawalAmount;
		var statusReq = obj.Data[0].Status;
		$("#goStep3").click();
	    $("#tbl_wdSuccess tbody").empty();
	    

		    		wd += "<tr><th scope='row'>Request number</th>";
					wd += "<td><label>"+requestNum+"</label></td></tr>";
		    		wd += "<tr><th scope='row'>Request Date</th>";
					wd += "<td><label>"+requestDate+"</label></td></tr>";
					wd += "<tr><th scope='row'>Trading Account</th>";
					wd += "<td><label>"+selectAcc+"</label></td></tr>";
					wd += "<tr><th scope='row'>Withdraw Amount(PHP)</th>";
					wd += "<td><label>"+withdrawAmount+"</label></td></tr>";
					wd += "<tr><th scope='row'>Status</th>";
					wd += "<td><label></label>"+statusReq+"</td></tr>";
    
	    $("#tbl_wdSuccess tbody").append(wd);
	}
	else if(data.s!="200"){
	alert(JSON.stringify(data.msg));
	return false;
	}else{
	
		alert(JSON.parse(data.ev).Data[0].ReturnMsg);
		$('#txtPIN').val("");
		return false;
	}

}

function withdrawalHistoryReq(){
		var trdAcc="";
		
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

		today_date = dd + '-' + mm + '-' + yyyy;
		$('#lastDate').html(today_date);
		$("#TrdAccSel1").empty();		
		var m = moment( moment().subtract(30, 'days') ).format("DD-MM-YYYY");
		var selection = document.getElementById("TrdAccSel").getElementsByTagName("li");
		
		for(var i = 0; i < selection.length; i++)
		{
		var num = $('#trdAcc_'+i).html();
		var exchgCode = $('#exchgCode_'+i).html();
		var a = $('#trd_'+num).html();
		var $option=$('<option />');
		$option.attr('value',a+"-"+exchgCode);
		$option.text(a);
		$('#TrdAccSel1').append($option);
		}		
		$("#TrdAccSel1").val($("#TrdAccSel1 option:first").val());
		$('#startDate').html(m);
		getwdHistory();
}

function getwdHistory(){

	
	var $accDetail = $('select[name=TrdAccSel1]').val();
	var splitValue = $accDetail.split("-");

	var jsonObject = {};
	jsonObject['trdAc'] = splitValue[0];
	jsonObject['brch'] = splitValue[2];
	jsonObject['accExch'] = splitValue[3];
	jsonObject['fs'] = $('#statusFilter').val();
	jsonObject['sdt'] = $('#startDate').html();
	jsonObject['edt'] = $('#lastDate').html();

	
     console.log("jsonObject passed to Backend : "+JSON.stringify(jsonObject));
	 $("#tbl_WD tbody").empty();
	wdHistoryReq(jsonObject);
}

function wdHistoryResp(data){
console.log("wdHistoryResp:"+JSON.stringify(data));

	if(data.s&&data.s=="200"&&JSON.parse(data.ev).Data.length>=1){
		/*if (elem.style.removeProperty) {
    	elem.style.removeProperty('width');
		} else {
   		 elem.style.removeAttribute('width');
		}*/
		var obj = JSON.parse(data.ev);
		var ttlRecord = obj.Data.length;
	    $("#ttlAlrt").html(ttlRecord);
	    var wd = "";
	    $('#tbl_WD').DataTable().destroy();
	    $("#tbl_WD tbody").empty();
		var TrdAccSel1 = $('#TrdAccSel1 option:selected').text();
		console.log(TrdAccSel1);
	     
		
	    
	    for(var i=0; i < obj.Data.length; i++){
	    	var wdObj = obj.Data[i];
	    	var num = wdObj.ID;
	    	var status = wdObj.Status;

			//var reqDate = wdObj.Created;
			//var wd_date = wdObj.ExportDate;




	    	var a = wdObj.Created;
			var splitValue = a.split(".");
			var reqDate = (splitValue[0].replace(
    				/(\d\d\d\d)(\d\d)(\d\d)(\d\d\d\d\d\d)/, '$3-$2-$1'
					));

			
			var b = wdObj.ExportDate;
			var splitValue1 = b.split(".");
			var wd_date = (splitValue1[0].replace(
    				/(\d\d\d\d)(\d\d)(\d\d)(\d\d\d\d\d\d)/, '$3-$2-$1'
					));


			//var c = parseFloat(wdObj.Amount);
			//var cashValue = c.toFixed(2);
			//var cashValue = Math.floor((wdObj.Amount) * 100) / 100;
			//var cashValue = wdObj.Amount;

			var am = wdObj.Amount;
    		var cashValue = am.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    		

		        wd += "<tr id='wdRecord_"+num+"'>";
		        if(num == "") wd += "<td id='requestNo_"+num+"'>&nbsp</td>"; else wd += "<td id='requestNo_"+num+"'>"+num+"</td>";				
		        if(reqDate == "") wd += "<td id='reqDate_"+num+"'>&nbsp</td>"; else wd += "<td id='reqDate_"+num+"'>"+reqDate+"</td>";
				if(wdObj.Acc == "") wd += "<td id='account_"+num+"'>&nbsp</td>"; else wd += "<td id='account_"+num+"' name='account"+i+"'>"+TrdAccSel1+"</td>";
				if(wd_date == "") wd += "<td id='wdDate_"+num+"'>-</td>"; else wd += "<td id='wdDate_"+num+"'>"+wd_date+"</td>";				
				if(cashValue == "" ) wd += "<td id='cashValue_"+num+"'>0.00</td>";else wd += "<td id='cashValue_"+num+"'>"+cashValue+"</td>";
				//if(wdObj.RefID == "0") wd += "<td id='receiptNo_"+num+"'>-</td>"; else wd += "<td id='receiptNo_"+num+"'>"+wdObj.RefID+"</td>";
		        
		        if(wdObj.Status == "") wd += "<td id='status_"+num+"'>&nbsp</td>"; else wd += "<td id='status_"+num+"'><b>"+status+"</b></td>";
		      //wd += "<td class='td-actbtn'>";
		      //wd += "<div class='printWD'>";
		      //wd += "<a href='' class='btn-flat btn_gb1 btn_s1' data-toggle='modal' data-target='#modal-printWD' id='wdDetails_"+num+"' onclick='javascript:getwdDetails("+num+");'><span class='glyphicon glyphicon-zoom-in ' aria-hidden='true'></span></a>";
		      //wd += "</div>";
			  //wd += "</td>";
		        wd += "</tr>";
	    	}
	    
	    
	    $("#tbl_WD tbody").append(wd);
	    $('#tbl_WD').DataTable( {
	     	"destroy": true,
	        "dom": '<"toolbar">frtpi' ,
			"order": [[ 0, "asc" ]],
			/*"dom": '<"toolbar">frtip'*/
			 "columnDefs": [{
				  // select-all column 0
					 "targets": 0,
					 "searchable":true,
					 "orderable":true,
					},
					 
					// no-sort columns
					{	
					"targets": 'no-sort',
					"orderable": false,
					}
				],
			 "oLanguage": { "sSearch": "" , "sSearchPlaceholder" : "Request No"},
			"bPaginate": false,
			"bLengthChange": false,
			"bFilter": true,
			"bSort": true,
			"bInfo": false,

			 "aoColumns": [ {"bSearchable": true}, {"bSearchable": false},  {"bSearchable": false}, {"bSearchable": false},{"bSearchable": false} ,{"bSearchable": false}],
			 paging: false
	    } );

	    	    $("#tbl_WD thead").find("th").removeAttr("style");

		
		
	}else if(data.s=="200"&&JSON.parse(data.ev).Data.length==0){
		$('#tbl_WD').DataTable().destroy();
		$("#ttlAlrt").html(0);
		var wd = "";
	    $("#tbl_WD tbody").empty();
		 wd += "<tr>";
		 wd += "<td>No Record Found</td></tr>";
		 $("#tbl_WD tbody").append(wd);
	}else {
		alert(JSON.stringify(data.msg));
	}
}

function getwdDetails(val){
	$('#receiptNo').html($('#receiptNo_'+val).html());
	$('#tranDate').html($('#wdDate_'+val).html());
	$('#amountPrint').html($('#cashValue_'+val).html());
	$('#accountPrint').html($('#account_'+val).html());
	$('#statusPrint').html($('#status_'+val).html());
}


