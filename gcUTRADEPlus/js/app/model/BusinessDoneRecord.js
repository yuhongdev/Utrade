Ext.define('TCPlus.model.BusinessDoneRecord', {
    extend: 'Ext.data.Model',
    fields: [
        {name: '1', sortType: 'asFloat'},
        {name: '2', sortType: 'asInt', type: 'int'},
        {name: '6', sortType: 'asFloat', type: 'float'},
        {name: '3', sortType: 'asInt', type: 'int'},
        {name: '7', sortType: 'asFloat', type: 'float'},
        {name: '4', sortType: 'asInt', type: 'int'},
        {name: '5', sortType: 'asInt', type: 'int'}
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            idProperty: "1",
            totalProperty: "c",
            rootProperty: "data",
            successProperty: "s"
        }
    }
});