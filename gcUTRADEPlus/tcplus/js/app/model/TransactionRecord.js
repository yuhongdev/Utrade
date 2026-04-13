var brokermapping = function(value, record){
	var brokerMap = value;
	if(global_brokerListMapping == "0"){
		if ( global_brokerlist != null ) {
			if ( global_brokerlist.len != null && global_brokerlist.scpt != null ) {
				if(value.indexOf('|') != -1){
					var brokerList = value.split('|');
					var brokerArr = [];
					for(var i=0; i<brokerList.length; i++){
						for (var j = 0; j < global_brokerlist.len; j ++) {
							V = global_brokerlist.scpt[j];

							if ( V.value == brokerList[i] ){
								brokerArr.push(V.key);
							}
							brokerMap = brokerArr.join('|');
						}
					}
				}
				else{
					for (var j = 0; j < global_brokerlist.len; j ++) {
						V = global_brokerlist.scpt[j];
						if ( V.value == value ){
							brokerMap = V.key;
							break;
						}
					}
				}
			}
		}
	}
	return brokerMap;
};

Ext.define('TCPlus.model.TransactionRecord', {
    extend: 'Ext.data.Model',
    fields: [
        {name: fieldStkCode, sortType: 'asUCString'},
        {name: fieldTransNo, sortType: 'asInt'},
        {name: fieldTime, sortType: 'asUCString'},
        {name: fieldTransAction, sortType: 'asUCString'},
        {name: fieldLast, sortType: 'asFloat'},
        {name: fieldUnit, sortType: 'asInt'},
        {name: fieldBuyBroker, sortType: 'asUCString', convert: brokermapping},
        {name: fieldSellBroker, sortType: 'asUCString', convert: brokermapping},
        {name: fieldAmalgamateBroker, sortType: 'asUCString'}
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            idProperty: fieldTransNo,
            totalProperty: "c",
            rootProperty: "d",
            successProperty: "s"
        }
    }
});