Ext.define('TCPlus.controller.Portfolio', {
    extend: 'Ext.app.Controller',
    views: [
        'portfolio.DerivativePrtf',
        'portfolio.EquityPrtf',
        'portfolio.EquityPrtfRealized',
        'portfolio.EquityPrtfDetail',
        'portfolio.VDerivativePrtfDetail'
    ],
    models: [
        'EquityPrtfRecord',
        'EquityPrtfRealizedRecord',
        'PortfolioRecord',
        'PortfolioDetailRecord',
        'DerivativePrtfDetailRecord'
    ],
    init: function() {
        this.control({
            'equityprtf, equityprtfrealized': {
                cellclick: function(view, td, cidx, record, tr, ridx, evt) {
                    if (equityPrtfPanel) {
                        var grid = view.findParentByType('panel').up();
                        if (grid.id == equityPrtfPanel.id) {
                            var accbranch = (equityPrtfPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[0].trim() + global_AccountSeparator + (equityPrtfPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[1].trim(); // #account list separator ('-')
                            equityPrtfPanel.accbranchNo = accbranch;
                        }
                    }
                    updateActivePanel(view, record, cidx);
                },
                celldblclick: function(view, td, cidx, record, tr, ridx, evt) {
                	if(equityPrtfPanel){
                		var grid = view.findParentByType('panel').up();
                		if(grid.id == equityPrtfPanel.id){
                			var accbranch = (equityPrtfPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[0].trim() + global_AccountSeparator + (equityPrtfPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[1].trim(); // #account list separator ('-')
                			equityPrtfPanel.accbranchNo=accbranch;
                		}
                	}               	
                    // reset closing status
                    closedOrderPad = false;
                    if (!n2nLayoutManager.isWindowLayout()) {
                        // closedMarketDepth = false;
                    }
                    updateActivePanel(view, record, cidx, true);
                },
                selectionchange: function(selModel, selected, evt) {
                    if (N2N_CONFIG.singleClickMode) {
                        if (selected.length > 0) {
                            var record = selected[0];
                            updateActivePanel(null, record, null);
                            // only update the market depth
                            // updateActiveMarketDepth(record.get(fieldStkCode), record.get(fieldStkName));
                        }
                    }
                }
            }
        });
    }
});