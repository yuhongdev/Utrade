Ext.define('TCPlus.view.other.StockChartLinkButton', {
    extend: 'Ext.button.Button',
    alias: 'widget.stockchartbtn',
    chartMode: 'd', // Default to intraday
    initComponent: function() {
        var me = this;

        var config = {
            icon: iconNewStockChart,
            iconCls: 'icon-center',
            tooltip: MSG.get(MSG.OPEN_INTER_CHART),
            hidden: !N2N_CONFIG.interactiveChartButton
        };

        if (me.hasOwnProperty('urlParams') && !me.hasOwnProperty('handler')) {
            config.listeners = {
                click: function() {
                    debugutil.debug('StockChartLinkButton > click');

                    var params = new Array();
                    if (me.urlParams !== null) {
                        for (var p in me.urlParams) {
                            switch (p) {
                                case 'code':
                                    params.push('Code=' + me.urlParams[p]);
                                    break;
                                case 'exch':
                                    var exch = me.urlParams[p];
                                    if (exch.length > 0 && exch[exch.length - 1].toLowerCase() == 'd') {
                                        exch = exch.substring(0, exch.length - 1);
                                    }
                                    params.push('exchg=' + exch);
                                    break;
                            }
                        }
                    }
                    var urlParams = '';
                    if (params.length > 0)
                        urlParams = '?' + params.join('&');

                    msgutil.openURL({
                        url: stockChartURL + urlParams
                    });
                }
            };
        }
        
        Ext.apply(me, config);
        me.callParent();
    },
    loadStockChart: function(stockCode) {
        var me = this;

        if (!jsutil.isEmpty(stockChartURL)) {
            var params = new Array();
            var stockParts = stockCode.split(".");
            params.push('Code=' + stockParts[0]);
            params.push('exchg=' + stockParts[1]);
            params.push('mode=' + me.chartMode);
            var urlParams = '?' + params.join('&');

            msgutil.openURL({
                url: stockChartURL + urlParams
            });
        }
    }
});
