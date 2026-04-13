function getMarketSummaryTop10Active(callback){
	var jsonObject = {};

	//Hardcode it to A for active stock
	jsonObject['t'] = "A";
		
	getMarketSummaryReq(jsonObject,callback);
}

function getMarketSummaryTop10ActiveResp(data){
	//Data return from API
	console.log(data);
	var activeData = JSON.parse(data.ev);
	console.log(activeData);
	//Add in your code to construct your stock watch
	//.....your code



}

//For testing due to server not ready
function getMarketSummaryTop10ActiveTest(callback){
	//Static data for temporary testing before server ready
	var result = {"s":"200","msg":"","ct":"0","ae":"0,1","ev":"{\"activeStock\":[{\"changeInPercent\":\"3.57%\",\"stockName\":\"AAX\",\"change\":\"0.015\",\"lastDonePrice\":\"0.435\"},{\"changeInPercent\":\"-3.85%\",\"stockName\":\"XOX\",\"change\":\"-0.005\",\"lastDonePrice\":\"0.125\"},{\"changeInPercent\":\"6.78%\",\"stockName\":\"HIBISCS\",\"change\":\"0.020\",\"lastDonePrice\":\"0.315\"},{\"changeInPercent\":\"0.00%\",\"stockName\":\"KINSTEL\",\"change\":\"0.000\",\"lastDonePrice\":\"0.030\"},{\"changeInPercent\":\"0.00%\",\"stockName\":\"NEXGRAM\",\"change\":\"0.000\",\"lastDonePrice\":\"0.045\"},{\"changeInPercent\":\"-16.67%\",\"stockName\":\"XDL\",\"change\":\"-0.005\",\"lastDonePrice\":\"0.025\"},{\"changeInPercent\":\"-5.80%\",\"stockName\":\"HIAPTEK\",\"change\":\"-0.020\",\"lastDonePrice\":\"0.325\"},{\"changeInPercent\":\"-2.27%\",\"stockName\":\"RGB\",\"change\":\"-0.005\",\"lastDonePrice\":\"0.215\"},{\"changeInPercent\":\"-2.49%\",\"stockName\":\"FGV\",\"change\":\"-0.050\",\"lastDonePrice\":\"1.960\"},{\"changeInPercent\":\"3.03%\",\"stockName\":\"BORNOIL\",\"change\":\"0.005\",\"lastDonePrice\":\"0.170\"}]}","cs":"ffa36180dfc59f18ca3e82a2504418e1"};
	callback(result);
}


