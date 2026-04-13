function getDividendSetting(){
	var jsonObject = {};
	//dividend setting
	//jsonObject['req'] = ['0'];
	
	//warrant setting
	//jsonObject['req'] = ['2'];
	
	//dividend data
	//jsonObject['DateFrom'] = "2015-11-26";
	//jsonObject['DateTo'] = "2015-12-26";
	//jsonObject['req'] = ['1'];
	
	//warrant data
	jsonObject['From'] = "A";
	jsonObject['To'] = "B";

	jsonObject['req'] = ['3'];
		
		
		
		getDividendSettingReq(jsonObject);
}

function getDividendSettingResp(data){
	console.log(data);
	var dividendData = JSON.parse(data.ev);
	console.log(dividendData);
}

