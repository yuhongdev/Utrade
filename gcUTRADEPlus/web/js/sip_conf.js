var sip_root = "sip/";
var tradeAcc_url= api_path+"getTradeAcc?";
var tradeAccInfoATP_url= api_path+"getTradeAccATP?";
var SIPSta_url = api_path+sip_root+"sipSchedule?";
var SIPedtls_url = api_path+sip_root+"sipScheduleDetails?";
var addSchedule_url = api_path+sip_root+"createSIP?";
var edtSIP_url = api_path+sip_root+"updateSIP?";
var delSIP_url = api_path+sip_root+"deleteSIP?";
var manSIP_url = api_path+sip_root+"manualSIPDetails?";
var skipSIP_url = api_path+sip_root+"cancelManualSIP?";
var buySIP_url = api_path+sip_root+"proceedManualSIP?";

var ct=1, ae=1;
var debug_log = true;


function reqTrdAccATP(jsonObject){
	getRestApiResp(tradeAccInfoATP_url,ct,jsonObject,ae,tradeAccInfo_response);
}

function SIPStaReq(jsonObject){
	getRestApiResp(SIPSta_url,ct,jsonObject,ae,SIPStaResp);	
}

function SIPedtlsReq(jsonObject){
	getRestApiResp(SIPedtls_url,ct,jsonObject,ae,SIPedtlsResp);	
}

function delSIPReq(jsonObject){
	getRestApiResp(delSIP_url,ct,jsonObject,ae,delSIPResp);	
}

function edtSIPReq(jsonObject){
	getRestApiResp(edtSIP_url,ct,jsonObject,ae,edtSIPResp);	
}

function manSIPReq(jsonObject){
	getRestApiResp(manSIP_url,ct,jsonObject,ae,manSIPResp);	
}
function buySIPReq(jsonObject){
	getRestApiResp(buySIP_url,ct,jsonObject,ae,buySIPResp);	
}


function skipSIPReq(jsonObject){
	getRestApiResp(skipSIP_url,ct,jsonObject,ae,skipSIPResp);	
}

function addScheduleReq(jsonObject){
	getRestApiResp(addSchedule_url,ct,jsonObject,ae,addScheduleResp);	
}