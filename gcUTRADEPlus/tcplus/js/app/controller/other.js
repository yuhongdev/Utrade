Ext.define('TCPlus.controller.other', {
    extend: 'Ext.app.Controller',
    views: isBasicVer ? ['other.exchangeRate'] : ['other.FinancialCalculator', 'other.PERatioEPSCalculator','other.exchangeRate', 'other.BrokerInfo', 'quote.WorldIndices'],
    init: function() {
        this.control({
        });
    }
});