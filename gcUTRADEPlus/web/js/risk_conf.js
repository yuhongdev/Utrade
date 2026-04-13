var chkSess_url = api_path+"chkSession?";
var getRiskScore_url = api_path+"getRiskProfileTotalScore?";
var updRiskScore_url = api_path+"updRiskProfileTotalScore?";

var activateFlag=false;

var ct=1, ae=1;
var debug_log = true;


function chkSessReq(jsonObject){
	if(getUrlParameter("LoginID"))
		chkSess_url += "loginID="+getUrlParameter("LoginID") + "&t=";
	getRestApiResp(chkSess_url,ct,jsonObject,ae,chkSessResp);	
}

function getRiskScoreReq(jsonObject){
	getRestApiResp(getRiskScore_url,ct,jsonObject,ae,getRiskScoreResp);	
}

function updRiskScoreReq(jsonObject){
	getRestApiResp(updRiskScore_url,ct,jsonObject,ae,updRiskScoreResp);	
}