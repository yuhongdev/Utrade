var login_url = api_path+"login?";
var chkSess_url = api_path+"chkSession?";
var forgetPwd_url = api_path+"forgetPwdPin?";
var forgetPin_url = api_path+"forgetPwdPin?";
var getHint_url = api_path+"getHint?";
var chgPwd_url = api_path+"chgPwd?";
var chgPin_url = api_path+"chgPin?";
var logout_url = api_path+"logout?";
var tradingHall_url = "/trading?";
//var loginPage_url = root_url+"web/html/cliLogin.html";
var loginPage_url = "/";
var action = getUrlParameter("act");
var activateFlag=false;

var ct=1, ae=1;
var debug_log = true;
function loginReq(jsonObject){
	getRestApiResp(login_url,ct,jsonObject,ae,loginResp);	
}
function chkSessReq(jsonObject){
	if(getUrlParameter("LoginID"))
		chkSess_url += "loginID="+getUrlParameter("LoginID") + "&t=";
	getRestApiResp(chkSess_url,ct,jsonObject,ae,chkSessResp);	
}
function forgetPwdReq(jsonObject){
	getRestApiResp(forgetPwd_url,ct,jsonObject,ae,forgetPwdResp);
}
function forgetPinReq(jsonObject){
	getRestApiResp(forgetPin_url,ct,jsonObject,ae,forgetPinResp);
}
function getHintReq(jsonObject){
	getRestApiResp(getHint_url,ct,jsonObject,ae,getHintResp);
}
function chgPwdReq(jsonObject){
	getRestApiResp(chgPwd_url,ct,jsonObject,ae,chgPwdResp);
}
function chgPinReq(jsonObject){
	getRestApiResp(chgPin_url,ct,jsonObject,ae,chgPinResp);
}
function logoutReq(jsonObject){
	getRestApiResp(logout_url,ct,jsonObject,ae,logoutResp);
}