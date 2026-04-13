Ext.define('TCPlus.controller.QuoteCharts', {
    extend: 'Ext.app.Controller',
    views: ['quote.IntradayChart', 'quote.VAnalysisChart'],
    models: ['SearchRecord'],
    init: function() {
        this.control({
        });
    }
});