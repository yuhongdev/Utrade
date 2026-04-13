/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


Ext.define('TCPlus.controller.Indices', {
    extend: 'Ext.app.Controller',
    views: ['quote.Indices'],
    models: ['Indices', 'TransactionRecord'],
    init: function() {
        this.control({
//            'indices': {
//                itemdblclick: this.dblClick
//            }
        });
    },
    dblClick: function(grid, record) {

        grid.chartStockCode = record.data[fieldStkCode];
        grid._procCallChart();


    }
});