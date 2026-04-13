var wd_root = "wdr/";
var tradeAcc_url= api_path+"getTradeAcc?";
var tradeAccInfoATP_url= api_path+"getTradeAccATP?";
var wdRequest_url = api_path+wd_root+"fundOverview?";
var sendwithdrawal_url = api_path+wd_root+"wdrReq?";
var wdSts_url = api_path+wd_root+"wdrSts?";


var ct=1, ae=1;
var debug_log = true;


/*function reqTrdAccATP(jsonObject){
	getRestApiResp(tradeAccInfoATP_url,ct,jsonObject,ae,fundOverviewResp);
}*/

function wdRequestReq(jsonObject){
	getRestApiResp(wdRequest_url,ct,jsonObject,ae,fundOverviewResp);	
}

function sendwdReq(jsonObject){
	getRestApiResp(sendwithdrawal_url,ct,jsonObject,ae,sendwdResp);	
}

function wdHistoryReq(jsonObject){
	getRestApiResp(wdSts_url,ct,jsonObject,ae,wdHistoryResp);	
}

function withdrawalReq(jsonObject){
	getRestApiResp(wdRequest_url,ct,jsonObject,ae,withdrawalResp);	
}

