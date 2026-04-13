/*
 * This controller controls two views: market depth and depth matrix
 */

Ext.define('TCPlus.controller.MarketDepth', {
    extend: 'Ext.app.Controller',
    views: isBasicVer ? ['quote.MarketDepth'] : ['quote.MarketDepth', 'quote.DepthMatrix'],
    models: ['MarketDepth'],
    init: function() {
        this.control({
            'marketdepthmatrix': {
                beforedestroy: function() {
                    marketDepthMatrixPanel = null;
                }
            }
        });
    }
});