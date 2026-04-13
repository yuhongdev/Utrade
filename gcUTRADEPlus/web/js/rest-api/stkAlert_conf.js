var newClient_url = api_path+"newClient?";
var actAccCd_url = api_path+"actAccCd?";
var actAlrtAcc_url = api_path+"actAlrtAcc?";
var alrtLs_url = api_path+"alrtLs?";
var addAlrt_url = api_path+"addAlrt?";
var updAlrt_url = api_path+"updAlrt?";
var getSuggestion_url = api_path+"stkSuggestion?";

var ct=1, ae=1;
var debug_log = true;

/* Login Area */
function newClientReq(jsonObject){
	getRestApiResp(newClient_url,ct,jsonObject,ae,newClientResp);
}

function alrtAccCdFReq(jsonObject){
	getRestApiResp(actAccCd_url,ct,jsonObject,ae,alrtAccCdFResp);	
}

function actAlrtAccFReq(jsonObject){
	getRestApiResp(actAlrtAcc_url,ct,jsonObject,ae,actAlrtAccFResp);	
}

/* Setting Area */
function alrtAccCdReq(jsonObject){
	getRestApiResp(actAccCd_url,ct,jsonObject,ae,alrtAccCdResp);	
}

function actAlrtAccReq(jsonObject){
	getRestApiResp(actAlrtAcc_url,ct,jsonObject,ae,actAlrtAccResp);	
}

/*Alert Area*/
function alrtLsReq(jsonObject){
	getRestApiResp(alrtLs_url,ct,jsonObject,ae,alrtLsResp);	
}

function delistedLsReq(jsonObject){
	getRestApiResp(alrtLs_url,ct,jsonObject,ae,delistedLsResp);
}

function addAlrtReq(jsonObject){
	getRestApiResp(addAlrt_url,ct,jsonObject,ae,addAlrtResp);	
}

function updAlrtReq(jsonObject){
	getRestApiResp(updAlrt_url,ct,jsonObject,ae,updAlrtResp);	
}

/* Common Area */
function getSuggestionReq(jsonObject){
	getRestApiResp(getSuggestion_url,0,jsonObject,0,getSuggestionResp);
}

function getCorrectSugReq(jsonObject){
	getRestApiResp(getSuggestion_url,0,jsonObject,0,getCorrectSugResp);
}

function getSuggestionJS(exch){
	if(exch == "A")
		loadScript(ref_path+"array/stkCodeName_"+exch+".js", arrStkCodeName);
	else if(exch == "BK")
		loadScript(ref_path+"array/stkCodeName_"+exch+".js", arrStkCodeName);
	else if(exch == "ENG")
		loadScript(ref_path+"array/stkCodeName_"+exch+".js", arrStkCodeName);
	else if(exch == "FX")
		loadScript(ref_path+"array/stkCodeName_"+exch+".js", arrStkCodeName);
	else if(exch == "HC")
		loadScript(ref_path+"array/stkCodeName_"+exch+".js", arrStkCodeName);
	else if(exch == "HK")
		loadScript(ref_path+"array/stkCodeName_"+exch+".js", arrStkCodeName);
	else if(exch == "HN")
		loadScript(ref_path+"array/stkCodeName_"+exch+".js", arrStkCodeName);
	else if(exch == "JK")
		loadScript(ref_path+"array/stkCodeName_"+exch+".js", arrStkCodeName);
	else if(exch == "KL")
		loadScript(ref_path+"array/stkCodeName_"+exch+".js", arrStkCodeName);
	else if(exch == "KLL")
		loadScript(ref_path+"array/stkCodeName_"+exch+".js", arrStkCodeName);
	else if(exch == "MT")
		loadScript(ref_path+"array/stkCodeName_"+exch+".js", arrStkCodeName);
	else if(exch == "MY")
		loadScript(ref_path+"array/stkCodeName_"+exch+".js", arrStkCodeName);
	else if(exch == "N")
		loadScript(ref_path+"array/stkCodeName_"+exch+".js", arrStkCodeName);
	else if(exch == "O")
		loadScript(ref_path+"array/stkCodeName_"+exch+".js", arrStkCodeName);
	else if(exch == "PH")
		loadScript(ref_path+"array/stkCodeName_"+exch+".js", arrStkCodeName);
	else if(exch == "SG")
		loadScript(ref_path+"array/stkCodeName_"+exch+".js", arrStkCodeName);
}

