/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


Ext.define('TCPlus.controller.GeneralNews', {
    extend: 'Ext.app.Controller',
    views: ['quote.GeneralNews','quote.NewsContent','quote.StockNews'],
    models: ['GeneralNews'],
    init: function() {
        this.control({
//            'indices': {
//                itemdblclick: this.dblClick
//            }
        });
    }

});