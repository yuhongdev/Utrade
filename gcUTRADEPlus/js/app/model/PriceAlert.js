/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TCPlus.model.PriceAlert', {
    extend: 'Ext.data.Model',
    idProperty: fieldStkCode,
    fields: [
        {name: fieldStkCode, sortType: 'asUCText', type: "string"},
        {name: fieldStkName, sortType: 'asUCText', type: "string"},
        {name: "retrigger", sortType: 'asUCText', type: "string"},
        {name: "active", sortType: 'asUCText', type: "string"},
        {name: "modified", sortType: 'asUCText', type: "string"}
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            totalProperty: "count",
            rootProperty: "data",
            successProperty: "s",
            idProperty: fieldStkCode
        }
    }
});