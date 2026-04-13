Ext.define('TCPlus.controller.Market', {
    extend: 'Ext.app.Controller',
    views: [
        'quote.MarketStreamer',
        'quote.TrackerRecord'
    ],
    models: ['TransactionRecord'],
    init: function() {
        this.control({
        });
    }
});