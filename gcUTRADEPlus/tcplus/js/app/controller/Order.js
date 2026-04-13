Ext.define('TCPlus.controller.Order', {
    extend: 'Ext.app.Controller',
    views: [
        'orderbook.OrderPad',
        'orderbook.OrderHistory',
        'orderbook.MFOrderHistory',
        'orderbook.OrderLog',
        'orderbook.OrderDetail',
        'orderbook.BasketOrder'
    ],
    models: [],
    init: function() {
        this.control({
            'orderpad': {
                beforedestroy: function() {
                    orderPad = null;
                    closedOrderPad = true;
                    n2nLayoutManager.orderSkipConfirm = false; // reset back skip confirm
                }
            },
            'orderhistory, mforderhistory': {
                itemclick: function(view, record, item, idx, e) {
                    updateActivePanel(view, record, null);
                },
                itemdblclick: function(view, record, item, ridx, evt) {
                    // reset closing status
                    closedOrderPad = true;
                    if (!n2nLayoutManager.isWindowLayout()) {
                        // closedMarketDepth = false;
                    }
                    updateActivePanel(view, record, null, true);
                }
            }
        });
    }
});