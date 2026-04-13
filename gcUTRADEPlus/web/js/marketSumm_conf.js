var getMarketSummary_url = api_path+"marketSummary?";

var ct=1, ae=0;
var debug_log = true;
function getMarketSummaryReq(jsonObject,callback){
	getRestApiResp(getMarketSummary_url,ct,jsonObject,ae,callback);	
}