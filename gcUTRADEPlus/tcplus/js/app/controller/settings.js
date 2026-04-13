Ext.define('TCPlus.controller.settings', {
    extend: 'Ext.app.Controller',
    views: [
        'settings.TickerSetting',
        'settings.PriceAlert'
    ],
    models: ['PriceAlert'],
    init: function() {
        this.control({
            tickersetting: {
            }
        });
    }
});