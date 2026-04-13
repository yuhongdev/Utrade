Ext.define('TCPlus.model.PortfolioRecord', {
    extend: 'Ext.data.Model',
    fields: [
        {name: '42', sortType: 'asUCString'},
        {name: '43', sortType: 'asUCString'},
        {name: 'StkCode', sortType: 'asUCString'},
        {name: 'StkName', sortType: 'asUCString'},
        {name: '44', sortType: 'asUCString'},
        {name: '51', sortType: 'asUCString'},
        {name: '52', sortType: 'asUCString'},
        {name: '78', sortType: 'asUCString'},
        {name: '82', sortType: 'asUCString'},
        {name: '95', sortType: 'asUCString'},
        {name: '96', sortType: 'asUCString'},
        {name: '97', sortType: 'asUCString'},
        {name: '98', sortType: 'asUCString'},
        {name: '99', sortType: 'asUCString'},
        {name: '100', sortType: 'asUCString'},
        {name: '111', sortType: 'asUCString'},
        {name: 'lastDone', sortType: 'asUCString'},
        {name: 'unrealised', sortType: 'asUCString'},
        {name: '118', sortType: 'asUCString'},
        {name: '125', sortType: 'asUCString'},
        {name: 'nettPosition', sortType: 'asUCString'},
        {name: '154', sortType: 'asUCString'},
        {name: '155', sortType: 'asUCString'},
        {name: 'totalpl', sortType: 'asUCString'},
        {name: 'News', sortType: 'asUCString'}
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            totalProperty: "c",
            rootProperty: "data",
            successProperty: "s"
        }
    },
    idProperty: '42'
});