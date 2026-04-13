Ext.define('TCPlus.controller.QuoteScreen', {
    extend: 'Ext.app.Controller',
    views: [
        'quote.QuoteScreen',
        'quote.TopPanelBar',
        'quote.MarketOverview',
        'quote.ForeignFlows'
    ],
    models: ['StockRecord'],
    init: function() {
        this.control({
            'quotescreen': {
                beforedestroy: function() {
                    quoteScreen.stopAutoRefresh();
                    quoteScreen = null;
                }
            },
            'quotescreen, watchlist': {
                cellclick: function(view, td, cidx, record, tr, ridx, evt) {
                    updateActivePanel(view, record, cidx);
                },
                celldblclick: function(view, td, cidx, record, tr, ridx, evt) {
                    // reset closing status
                    closedOrderPad = false;
                    if (!n2nLayoutManager.isWindowLayout()) {
                        // closedMarketDepth = false;
                    }
                    updateActivePanel(view, record, cidx, true);
                }
            }
        });
    }
});