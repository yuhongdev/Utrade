Ext.define('TCPlus.controller.StockInfo', {
    extend: 'Ext.app.Controller',
    views: [
        'quote.StockInfo',
        'quote.Tracker'
    ],
    models: [
        'SearchRecord',
        'TransactionRecord',
        'BusinessDoneRecord'
    ],
    init: function() {
        this.control({
        });
    }
});