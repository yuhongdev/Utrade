/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TCPlus.model.MarketDepth', {
    extend: 'Ext.data.Model',
    idProperty: "level",
    fields: [
        {name: cmap_mdNo},
        {name: cmap_mdBSplit},
        {name: cmap_mdBCum},
        {name: cmap_mdBidQty},
        {name: cmap_mdBidPrice},
        {name: cmap_mdAskPrice},
        {name: cmap_mdAskQty},
        {name: cmap_mdSCum},
        {name: cmap_mdSSplit},
        {name: 'column_0'},
        {name: 'column_1'},
        {name: 'column_2'}
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            rootProperty: "data",
            idProperty: "level",
            totalProperty: 'count',
            successProperty: "success"
        }
    }
});