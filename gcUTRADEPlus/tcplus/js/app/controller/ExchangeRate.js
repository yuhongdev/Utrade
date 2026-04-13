/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */



Ext.define('TCPlus.controller.ExchangeRate', {
    extend: 'Ext.app.Controller',
    views: ['other.exchangeRate'],
    models: ['TCPlus.model.ExchangeRate'],
    init: function() {
        this.control({
//            'indices': {
//                itemdblclick: this.dblClick
//            }
        });
    }
});