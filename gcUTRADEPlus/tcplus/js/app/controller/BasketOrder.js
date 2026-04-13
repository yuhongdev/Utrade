Ext.define('TCPlus.controller.BasketOrder', {
    extend: 'Ext.app.Controller',
    views: ['orderbook.BasketOrder'],
    models: ['BasketOrder'],
    init: function() {
        this.control({
            'basketorder': {
                cellclick: function(view, td, cidx, record, tr, ridx, evt) {
                    if (N2N_CONFIG.singleClickMode) {
                        updateActivePanel(view, record, cidx);
                        // createCorporateNewsAction(grid, ridx); // TODO
                    }
                },
                itemdblclick: function(view, record, item, ridx, evt) {
                    // reset closing status
                    closedOrderPad = false;
                    if (!n2nLayoutManager.isWindowLayout()) {
                        // closedMarketDepth = false;
                    }
  
                    updateActivePanel(view, record, null, true);
                }
            }
        });
    }
});