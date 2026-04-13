function N2NFilter(obj) {
	
	_onReady = false;
	_DecimalPlace = 0;
	_ExchangeCode = "";
	
	
	this.setDecimalPlace = function (dataObj) {
		
		var object = null;
		var tempLoop = 0;
		
		var listKey = [fieldLacp, fieldBuy, fieldLast, fieldSell];
		
		for (var i = 0; i < listKey.length; i ++) {
			if (dataObj[listKey[i]] != null && dataObj[listKey[i]] != "") {
				object = listKey[i];
			}
		}
		
		if (dataObj[object].indexOf(".") != -1) {
			var valueLength = dataObj[object].substring( ((dataObj[object].indexOf(".")) + 1), dataObj[object].length);
			_DecimalPlace = valueLength.length ;
		}
		
		_ExchangeCode = exchangeCode;
		
		_onReady = true;
		
	}
	
	this.isOnReady = function(){
		return _onReady;
	}
	
	this.getDecimalPlace = function(){
		return _DecimalPlace;
	}
	
	this.getExchangeCode = function(){
		return _ExchangeCode;
	}
	
	this.reset = function(){
		_onReady = false;
		_DecimalPlace = 0;
		_ExchangeCode = "";
	}
	
}