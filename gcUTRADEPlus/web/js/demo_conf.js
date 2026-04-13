var getDividendWarrant_url = api_path+"getDividendWarrant?";

var ct=1, ae=0;
var debug_log = true;
function getDividendSettingReq(jsonObject){
	getRestApiResp(getDividendWarrant_url,ct,jsonObject,ae,getDividendSettingResp);	
}