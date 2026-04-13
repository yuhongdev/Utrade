/*
 * convert date format
 */
var dateFormat = function(val, rec) {
    var year = val.substring(0, 4);
    var month = val.substring(4, 6);
    var day = val.substring(6, 8);
    return day + "/" + month + "/" + year;
};

/*
 * convert time format
 */
var timeFormat = function(val, rec) {
	var hour = val.substring(8, 10);
	var minute = val.substring(10, 12);

	return hour + ":" + minute;
};

/*
 * convert side to buy or sell
 * 
 *  1 = buy
 *  2 = sell
 */
var buySell = function(val, rec) {
	if (val == "1") {
		return "Buy";
	} else {
		return "Sell";
	}
};

/*
 * join column 'orderSource' and 'orderNo' together
 */
var orderStatus = function(value, record) {
	return record.get('orderSource') + " " + value;
};

/*
 * total value : (quantity * price) + transactionFee
 */
var totalValue = function(value, record) {
	var q = jsutil.getNumFromFormat(record.get('quantity'), 0);
	var tf = jsutil.getNumFromFormat(record.get('transactionFee'), 0);
	var p = parseFloat(record.get('price'));
	
	if (record.get('side').toLowerCase() == 'buy') {
		return doRound((q * p) + tf, 3);
	} else {
		return doRound((q * p) - tf, 3);
	}
};

/*
 * convert number format 
 */
var convertFormat = function(value, record) {
	return doRound(value, 3);
};

/*
 * convert price format 
 */
var priceFormat = function(value, record) {
	var dp = decimalCtrl.prtf.matchprice || 3;
	return parseFloat(value).toFixed(dp);
};

var toDate = function(v, record) {
    return Ext.Date.parse(record.get('od'), 'YmdHis.u');
};

Ext.define('TCPlus.model.PortfolioDetailRecord', {
	extend: 'Ext.data.Model',
	fields: [
	         {name: 'documentNo', mapping: 'dn'},
	         {name: 'documentSequenceNo', mapping: 'dsn'},
	         {name: 'SubAndOrderNo', mapping: 'on', convert: orderStatus},
	         {name: 'orderNo', mapping: 'on'},
	         {name: 'subOrderNo', mapping: 'son'},
	         {name: 'bhCliCode', mapping: 'bhcc'},
	         {name: 'contractNo', mapping: 'cn'},
	         {name: 'side', mapping: 's', convert: buySell},
             {name: 'Date', mapping: 'od', convert: toDate, sortType: 'asDate'},
             {name: 'Time', mapping: 'od', convert: toDate, sortType: 'asDate'},
	         {name: 'quantity', mapping: 'q', convert: convertFormat, sortType: 'asInt', type: 'string'},
	         {name: 'quantityLeft', mapping: 'ql'},
	         {name: 'price', mapping: 'p', convert: priceFormat, sortType: 'asFloat'},
	         {name: 'orderSource', mapping: 'os'},
	         {name: 'transactionFee', mapping: 'tf', convert: convertFormat, sortType: 'asFloat', type: 'string'},
	         {name: 'exchangeCode', mapping: 'ec'},
	         {name: 'currency', mapping: 'c'},
	         {name: 'totalRecord', mapping: 'tr', convert: totalValue, sortType: 'asFloat', type: 'string'},
	         {name: 'quantityBuy', mapping: 'tqb'},
	         {name: 'quantitySold', mapping: 'tqs'},
	         {name: 'settOpt', mapping: 'setO'},
	         {name: 'settCurr', mapping: 'setC'},
	         {name: 'prtfEditFlag', mapping: 'pef'},
	         ],
	         proxy: {
	        	 type: 'memory',
	        	 reader: {
	        		 type: 'json',
	        		 rootProperty: 'pfd',
	        		 totalProperty: 'count',
	        		 successProperty: 's'
	        	 }
	         }
});