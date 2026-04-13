/*
 * Controller: Historical Data
 */
Ext.define('TCPlus.controller.quote.CHistoricalData', {
    extend: 'Ext.app.Controller',
    views: [
        'quote.VHistoricalData'
    ],
    models: ['MHistoricalData'],
    init: function() {
        this.control({
            'historicaldata': {
            }
        });
    }
});