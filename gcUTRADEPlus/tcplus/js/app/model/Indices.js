/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


Ext.define('TCPlus.model.Indices', {
    extend: 'Ext.data.Model',
    idProperty: fieldStkCode,
    fields: [
        {name: fieldStkCode, sortType: 'asUCString'},
        {name: fieldStkName, sortType: 'asUCString'},
        {name: fieldStkFName, sortType: 'asUCString'},
        {name: fieldLast, sortType: 'asFloat', type: 'float'},
        {name: fieldLacp, sortType: 'asFloat', type: 'float'},
        {name: fieldChange, sortType: 'asFloat', type: 'float'},
        {name: fieldChangePer, sortType: 'asFloat', type: 'float'},
        {name: fieldTransNo, sortType: 'asInt', type: 'int'},
        {name: fieldPrev, sortType: 'asFloat', type: 'float'},
        {name: fieldOpen, sortType: 'asFloat', type: 'float'},
        {name: fieldHigh, sortType: 'asFloat', type: 'float'},
        {name: fieldLow, sortType: 'asFloat', type: 'float'}
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            totalProperty: "c",
            rootProperty: "d",
            successProperty: "s",
            idProperty: fieldStkCode
        }
    }
});