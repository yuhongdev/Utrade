Ext.define('TCPlus.model.ExchangeRate', {
    extend: 'Ext.data.Model',
    idProperty: fieldStkCode,
    fields: [
        {name: fieldStkName, sortType: 'asUCString'},
        {name: fieldBuy, sortType: 'asUCString'},
        {name: fieldSell, sortType: 'asUCString'},
        {name: 'cut', sortType: 'asUCString'},
        {name: fieldLacp, sortType: 'asUCString'},
        {name: fieldStkCode, sortType: 'asUCString'},
        {name: fieldLotSize, sortType: "asUCString"}
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            totalProperty: "c",
            rootProperty: "data",
            successProperty: "success",
            idProperty: fieldStkCode
        }
    }
});