Ext.define('TCPlus.controller.OrderStatus', {
    extend: 'Ext.app.Controller',
    views: ['orderbook.OrderStatus'],
    models: ['OrderStatus'],
    init: function() {
        this.control({
            'orderstatus': {
                cellclick: function(view, td, cidx, record, tr, ridx, evt) {
                    updateActivePanel(view, record, cidx);
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