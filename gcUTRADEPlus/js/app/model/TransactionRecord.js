Ext.define('TCPlus.model.TransactionRecord', {
    extend: 'Ext.data.Model',
    fields: [
        {name: fieldStkCode, sortType: 'asUCString'},
        {name: fieldTransNo, sortType: 'asInt'},
        {name: fieldTime, sortType: 'asUCString'},
        {name: fieldTransAction, sortType: 'asUCString'},
        {name: fieldLast, sortType: 'asFloat'},
        {name: fieldUnit, sortType: 'asInt'},
        {name: fieldBuyBroker, sortType: 'asUCString'},
        {name: fieldSellBroker, sortType: 'asUCString'},
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