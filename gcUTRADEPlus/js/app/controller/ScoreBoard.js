Ext.define('TCPlus.controller.ScoreBoard', {
    extend: 'Ext.app.Controller',
    views: ['quote.ScoreBoard'],
    models: ['ScoreBoard'],
    init: function() {
        this.control({
            'scoreboard grid': {
                itemclick: this.click,
                cellclick: this.cellclick,
                celldblclick: this.celldblclick
            }
        });
    },
    click: function(grid, rec) {
        if (!scoreBoard.isTabPanel && !isMobile) {
            scoreBoard.genExtjsChart(rec);
        }
    },
    cellclick: function(thisComp, td, cellIndex, rec, tr, rowIndex, e, eOpts) {
        if (isMobile && cellIndex == 0) {
            if (!scoreBoard.chartPanel) {
                scoreBoard.chartPanel = msgutil.popup({
                    title: "Pie Chart",
                    width: 300,
                    height: 300,
                    html: '<div id="titlechart" style="display:none;"></div><div id="chartdiv" style="height:100%;width:100%; "></div>',
                    listeners: {
                        resize: function(thisComp, newWidth, newHeight, oldWidth, oldHeight) {
                            if (oldWidth) {
                                var rec = scoreBoard.gridPanel.getSelectionModel().getSelection();
                                if (rec.length > 0) {
                                    scoreBoard.genExtjsChart(rec[0]);
                                }
                            }
                        },
                        close: function() {
                            scoreBoard.chartPanel = null;
                        }
                    }
                });
            }

            scoreBoard.genExtjsChart(rec);
        }
    },
    celldblclick: function(thisComp, td, cellIndex, rec, tr, rowIndex, e, eOpts) {
        if (rec.get("36") != quoteScreen.market) {
            quoteScreen.market = rec.get("36");
            quoteScreen.callSort();
            var oriTitle = "MAIN";
            var items = scoreBoard.compRef.topBar.items.items;
            for (var i = 0; i < items.length; i++) {
                if (items[i].pressed) {
                    oriTitle = items[i].text;
                    break;
                }
            }
            quoteScreen.tButtonAllStock.setText(oriTitle + " [" + rec.get("37") + "]");
            n2nLayoutManager.activateItem(quoteScreen);
        }
    }
});
