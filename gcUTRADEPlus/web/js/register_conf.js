
var logout_url = api_path+"logout?";
var chkSess_url = api_path+"chkSession?";

var ct=1, ae=1;
var debug_log = true;

function chkSessReq(jsonObject){
	getRestApiResp(chkSess_url,ct,jsonObject,ae,chkSessResp);	
}
function registerReq(jsonObject,callback){
	var register_url = api_path+"register?";
	getRestApiResp(register_url,ct,jsonObject,ae,callback);	
}
function registerGameReq(jsonObject,callback){
	var registerGame_url = api_path+"registerGame?";
	getRestApiResp(registerGame_url,ct,jsonObject,ae,callback);	
}
function registerTrialReq(jsonObject,callback){
	var registerTrial_url = api_path+"registerTrial?";
	getRestApiResp(registerTrial_url,ct,jsonObject,ae,callback);	
}
function getTrialLoginReq(jsonObject,callback){
	var getTrialLogin_url = api_path+"getTrialOrOpenAccInfo?";
	getRestApiResp(getTrialLogin_url,ct,jsonObject,ae,callback);	
}
function registerOpenAccReq(jsonObject,callback){
	var registerOpenAcc_url = api_path+"registerOpenAcc?";
	getRestApiResp(registerOpenAcc_url,ct,jsonObject,ae,callback);	
}
function registerCorpAccReq(jsonObject,callback){
	var registerCorpAcc_url = api_path+"registerCorp?";
	getRestApiResp(registerCorpAcc_url,ct,jsonObject,ae,callback);	
}
function logoutReq(jsonObject){
	getRestApiResp(logout_url,ct,jsonObject,ae,logoutResp);
}
