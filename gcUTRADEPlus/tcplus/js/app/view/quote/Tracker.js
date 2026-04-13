/*
 * _createTitlePanel			: create title panel 
 *  _createSearchGrid			: create search panel 
 *  _createSummaryGrid			: create summary panel
 *  _createGraphPanel			: create graph panel
 *  _createTransactionGrid		: create transaction grid panel
 *  _createBusinessDoneGrid		: create business done grid panel
 *  
 *  procCallTitle			: 
 *  _procCallStockInfo			: call ajax to get stock info 
 *  _procCallTransaction		: call ajax to get transaction result 
 *  _procCallBusinessDone		: call ajax to get business done result
 *  _procCallChart			: call ajax to get chart url
 *  _procSearchStock			: call ajax to get stock searching result
 *  
 *  updateFeedRecord			: update stock info 
 *  _updateTransaction			: load result into grid panel 
 *  _updateBusinessDone			: load result into grid panel
 *  _updateSearchStock			: laod result into grid panel
 *  
 *  _procClickSearchRecord		: double click searching grid panel function
 *  _procCleanAllPanel			: reset all component to default
 *  _procPagingButton			: 
 *  
 *  _returnNumberFormat			: return number format design
 *  getFieldList			: 
 *  
 */

Ext.define('TCPlus.view.quote.Tracker', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tracker',
    stkcode: '',
    stkname: '',
    lacp: null,
    last: null,
    beginNumber: 0, // for time and sales begin record number
    endNumber: 0, // for time and sales end record number
    totalNumber: 0, // for time and sales total record number
    totalRecord: 0, // for time and sales total display number of record
    eventType: 0, // for time and sales next page or previous page event
    thisPanelID: '',
    onViewTab: '', // view on which tab
    onReady: false,
    onAjaxTransaction: false,
    tPanel_mainPanel: null,
    tPanel_titlePanel: null,
    tPanel_GraphPanel: null,
    tPanel_summary: null,
    tTabPanel_Panel: null,
    tRecord_Transaction: null,
    tGrid_searchGrid: null,
    tGrid_BusinessDone: null,
    tGrid_Transaction: null,
    tLabel_TotalBuyVol: null,
    tLabel_TotalSellVol: null,
    tLabel_HighPrice: null,
    tLabel_LowPrice: null,
    tLabel_Volumn: null,
    tLabel_Value: null,
    tLabel_MarketAvgPrice: null,
    tLabel_BuyRate: null,
    tLabel_PERatio: null,
    tLabel_EPS: null,
    tLabel_NTA: null,
    tValue_TotalBuyVol: null,
    tValue_TotalSellVol: null,
    tValue_HighPrice: null,
    tValue_LowPrice: null,
    tValue_Volumn: null,
    tValue_Value: null,
    tValue_MarketAvgPrice: null,
    tValue_BuyRate: null,
    tValue_PERatio: null,
    tValue_EPS: null,
    tValue_NTA: null,
    tValue_UpDown: null,
    tValue_stockName: null,
    tValue_change: null,
    tValue_changePer: null,
    tValue_Last: null,
    tValue_Rating: null,
    tValue_BRisk: null,
    tValue_IBillionaire: null,
    tField_Search: null,
    tField_Paging: null,
    tButton_First: null,
    tButton_Next: null,
    tButton_Previous: null,
    tButton_Last: null,
    tButton_back: null,
    tButton_search: null,
    containerHeight: null,
    mainHeight: null,
    buyStore: null,
    sellStore: null,
    totalStore: null,
    trackerPullTimer: null,
    page: 0,
    transCount: 100,
    slcomp: "tr",
    compRef: {},
    type: 'tr',
    savingComp: true,
    ddComp: true,
    activeTabIndex: 0,
    activeChartTabIndex: 0,
    winConfig: {
        width: 835,
        height: 420
    },
    chartEvent: false,
    tabbarLink: null,
    tabbarFundSheet: null,
    tabbarProspects: null,
    mfFundSheetWindow: null,
    mfProspectsWindow: null,
    initComponent: function() {
        var panel = this;
        panel.isMobile = isMobile;
        panel.emptyMsg = languageFormat.getLanguage(30013, 'No result found.');
        panel.hasMfFid = N2N_CONFIG.trackerInfoMfFid.length > 0;
        panel.layoutSet = panel.getLayoutSet();

        panel.createColStates();

        panel.thisPanelID = panel.getId();
        panel._createSearchGrid();

        if (N2N_CONFIG.searchAutoComplete) {
            panel.tField_Search = Ext.widget('searchautobox', {
                field05: [fieldStkCode, fieldStkName, fieldSbExchgCode, fieldTransNo],
                listeners: {
                    select: function(thisCb, records) {
                        if (records.length > 0) {
                            panel._procClickSearchRecord(records[0]);
                        }
                    }
                },
                onSearchEnterKey: function(records) {
                    if (records.length > 0) {
                        panel._procClickSearchRecord(records[0]);
                    } else {
                        msgutil.alert(languageFormat.getLanguage(30014, 'Invalid Symbol/Code.'));
                    }
                }
            });
        } else {
            panel.tField_Search = new Ext.form.field.Text({
                width: searchboxWidth,
                emptyText: languageFormat.getLanguage(10102, 'Symbol') + '/' + languageFormat.getLanguage(10101, 'Code'),
                selectOnFocus: true,
                listeners: {
                    specialkey: function(field, e) {
                        if (e.getKey() == e.ENTER) {
                            panel._procSearchStock();
                        }
                    }
                }
            });
            
            panel.tButton_search = new Ext.button.Button({
                text: languageFormat.getLanguage(10007, 'Search'),
                iconCls: 'icon-search',
                handler: function() {
                    panel._procSearchStock();
                }
            });
        
        }

        panel.tButton_back = new Ext.button.Button({
            text: languageFormat.getLanguage(10027, 'Back'),
            iconCls: 'icon-back',
            hidden: true,
            handler: function() {
                panel.tField_Search.setValue("");
                panel.tPanel_mainPanel.show();
                panel.tGrid_searchGrid.hide();
                panel.tButton_back.hide();
            }
        });

        var defaultConfig = {
            layout: 'fit',
            header: false,
            border: false,
            width: '100%',
            autoScroll: false,
            height: 310,
            bodyStyle: 'padding: 0px; margin: 0px; overflow-y: auto;',
            items: [panel.tGrid_searchGrid],
            cls: 'tracker',
            keyEnabled: N2N_CONFIG.keyEnabled,
            listeners: {
                afterrender: function(thisComp) {
                },
                destroy: function() {
                    Storage.generateUnsubscriptionByExtComp(panel);
                    conn.unsubscribeStockInfo06();
                    conn.unsubscribeFundamental();
                    
                    panel.stopTrackerPullTimer();
                    // clear buffered run
                    helper.removeBufferedRun('bfTSCol');
                    helper.removeBufferedRun('bfBSCol');
                    helper.removeBufferedRun('trRefresh');
                },
                resize: function(thisComp, width, height, oldWidth, oldHeight) {
                    panel.parentCt = thisComp;
                    sessionStorage.removeItem('trackerChart');
                    
                    // clear buffered run
                    helper.removeBufferedRun('bfTSCol');
                    helper.removeBufferedRun('bfBSCol');
                    helper.removeBufferedRun('trRefresh');
                    
                    sessionStorage.removeItem('trackerChart');
                    
                    //panel._createMainPanel();
                    
                    // If oldwidth is in low width range while new width in high width range, and vice versa, only then recreate the charts
                    if ((oldWidth > 650 && width <= 650) || (oldWidth <= 650 && width > 650)) {
                        panel.preventRecreate = false;
                    }
  
                    if (!oldWidth) {
                    	panel._createMainPanel();
                        thisComp.add(panel.tPanel_mainPanel);
                        // default viewed tab to transaction tab
                        panel.onViewTab = panel.tGrid_Transaction.getId();
                    }

                    if (oldWidth && isStockChart) {
                        panel.newOpen = false;
                        
                        //panel.procCallTitle();
                        var tMargin = isMobile ? 75 : 59;
                        var nw = width / 2;

                        if (!isMobile) {
                        	if(oldWidth <= 650){
                        		if (width <= 650) {
                                    if (isStockChart && panel.tPanel_GraphPanel) { // TOREVIEW
                                       // panel.tPanel_GraphPanel.refresh("");
                                    	
                                    	var chartHeight = panel.parentCt.height + 65;
                                    	var newHeight = height - tMargin;
                                    	panel.tPanel_titlePanel.setWidth(width);
                                    	
                                    	panel.tPanel_mainPanel.setHeight(newHeight);
                                    	panel.tPanel_mainPanel.setWidth(width);
                                    	panel.tPanel_mainPanel.down('panel').setHeight(panel.tPanel_mainPanel.getHeight());
                                    	panel.tPanel_mainPanel.down('panel').setWidth(width);
                                    	
                                    	panel.tTabPanel_Panel.setHeight(newHeight);
                                        panel.tTabPanel_Panel.setWidth(width);
                                    	Ext.get(panel.thisPanelID + "_info").setHeight(panel.tTabPanel_Panel.getHeight());
                                        Ext.get(panel.thisPanelID + "_info").setWidth(width);

                                        panel.compRef.intradayChart.setHeight(chartHeight);
                                        panel.compRef.intradayChart.setWidth(width);
                                        Ext.get(panel.thisPanelID + "_chart").setHeight(chartHeight);
                                        Ext.get(panel.thisPanelID + "_chart").setWidth(width);
                                        panel.tPanel_GraphPanel.setHeight(chartHeight - 5);
                                        panel.tPanel_GraphPanel.setWidth(width);
                                        
                                        panel.compRef.intradayChart.updateLayout();   
                                    }
                                }else{
                                	panel._createMainPanel();
                                	panel.procCallTitle();
                                	panel.tTabPanel_Panel.setHeight(panel.getHeight() - tMargin);
                                }
                        	}else{
                        		if(width <= 650){
                        			panel._createMainPanel();
                                	panel.procCallTitle();
                                	panel.tTabPanel_Panel.setHeight(panel.getHeight() - tMargin);
                        		}else{
                        			var newHeight = panel.getHeight() - tMargin;
                        			var newWidth = width / 2;
                        			panel.tPanel_titlePanel.setWidth(width);
                        			
                        			panel.tPanel_mainPanel.setHeight(newHeight);
                                	panel.tPanel_mainPanel.setWidth(newWidth);
                        			
                        			Ext.get(panel.thisPanelID + "_info").setHeight(newHeight);
                                    Ext.get(panel.thisPanelID + "_info").setWidth(newWidth);
                                    panel.tTabPanel_Panel.setHeight(panel.getHeight() - tMargin);
                                    panel.tTabPanel_Panel.setWidth(newWidth);
                                    
                                    Ext.get(panel.thisPanelID + "_chart").setHeight(newHeight);
                                    Ext.get(panel.thisPanelID + "_chart").setWidth(newWidth);
                                    panel.tPanel_GraphPanel.setHeight(newHeight - 5);
                                    panel.tPanel_GraphPanel.setWidth(newWidth);
                                    
                                    panel.tPanel_mainPanel.updateLayout();
                        		}
                        	}   
                        }
                    } else {
                        if (thisComp.autoLoad) {
                            thisComp.procCallTitle();
                            thisComp.autoLoad = false;
                        }else{
                        	if(!isStockChart){
                            	panel._createMainPanel();
                            	panel.procCallTitle();
                                var tMargin = isMobile ? 75 : 59;
                                panel.tTabPanel_Panel.setHeight(panel.getHeight() - tMargin);
                            }
                        }
                    }
                }
            },
            tbar: {
                enableOverflow: menuOverflow,
                items: [
                    panel.tField_Search,
                    N2N_CONFIG.searchAutoComplete ? null : '-',
                    panel.tButton_search,
                    '->',
                    panel.tButton_back
                ]
            }
        };

        Ext.apply(this, defaultConfig);
        this.callParent();

    },
    createColStates: function() {
        var panel = this;

        panel.trackerColState = new ColState({
            cookieKey: columnWidthSaveManager.getCookieColKey('trackerTS'),
            config: N2N_CONFIG.trackerTSCol,
            adjustWidth: 7,
            colWidthKey: 'trTS',
            paramKey: N2N_CONFIG.constKey + 'TRTS'
        });
        panel.bsColState = new ColState({
            cookieKey: columnWidthSaveManager.getCookieColKey('trackerBS'),
            config: N2N_CONFIG.trackerBSCol,
            adjustWidth: 7,
            colWidthKey: 'trBS',
            paramKey: N2N_CONFIG.constKey + 'TRBS'
        });
    },
    cleanAllLoadMasks: function() {
        var panel = this;
        helper.cleanLoadMask(panel.tPanel_summary);
        helper.cleanLoadMask(panel.tGrid_Transaction);
        helper.cleanLoadMask(panel.tGrid_BusinessDone);
        helper.cleanLoadMask(panel.tPanel_GraphPanel);
    },
    
    // The panel in the Price Charts tab
    _createChartPanel: function(){
    	var panel = this;
    	var chartTabItemList = [];
    	var pieChartTabItemList = [];
    	
    	if (panel.tTabPanel_ChartPanel) {
    		panel.tTabPanel_ChartPanel.removeAll(false);
    		panel.tTabPanel_ChartPanel = null;
    		panel.compRef.bsStackedColumnCharts = null;
    		panel.compRef.bsPieChartsPanel = null;
    	}
    	
    	// add in the histogram container
        panel.compRef.bsStackedColumnCharts = Ext.create('Ext.container.Container', {
            itemId: 'bsStackedColumnCharts',
            iconCls: "icon-chart",
            tooltip: languageFormat.getLanguage(11013, "Stacked bars (Price)"),
            layout: {
            	type: 'fit'
            },
            border: false,
            frame: false,
            cls: 'charts stacked-column',
            overflowX: 'hidden'
        });          	
        
    	chartTabItemList.push(panel.compRef.bsStackedColumnCharts); 
    	
    	panel.compRef.bsPieChartsTotal = Ext.create('Ext.container.Container', {
    		itemId: 'pieChartTotal',
            title: languageFormat.getLanguage(11035, 'Total'),  
            layout: {
            	type: 'container'
            },
            overflowX: 'hidden'
        });          	
    	pieChartTabItemList.push(panel.compRef.bsPieChartsTotal);
    	
    	panel.compRef.bsPieChartsBuy = Ext.create('Ext.container.Container', {
    		itemId: 'pieChartBuy',
            title: languageFormat.getLanguage(10001, 'Buy'),           
            layout: {
            	type: 'container'
            },
            overflowX: 'hidden'
        });          	
    	pieChartTabItemList.push(panel.compRef.bsPieChartsBuy);
    	
    	panel.compRef.bsPieChartsSell = Ext.create('Ext.container.Container', {
    		itemId: 'pieChartSell',
            title: languageFormat.getLanguage(10002, 'Sell'),           
            layout: {
            	type: 'container'
            },
            overflowX: 'hidden'
        });          	
    	pieChartTabItemList.push(panel.compRef.bsPieChartsSell);
    	
    	// add the pie chart tab panel that have 3 tab
    	panel.compRef.bsPieChartsPanel = Ext.create('Ext.tab.Panel', {
            itemId: 'bsPieCharts',
            iconCls: "icon-pie",
            tooltip: languageFormat.getLanguage(11014, "Pie charts (Price)"),
            layout: 'fit',
            cls: 'charts pie-charts',
            border: false,
            frame: false,
            tabBar : {
            	layout : {
            		pack : 'center'
            	}
            },
            autoScroll: true,
            tabPosition: 'bottom',
            items: pieChartTabItemList,
            listeners: {
                tabchange: function(tb, newTab) {
                    panel.activateBsCall();
                }
            }
        });
    	chartTabItemList.push(panel.compRef.bsPieChartsPanel);
    	
    	panel.tTabPanel_ChartPanel = new Ext.tab.Panel({
            frame: false,
            border: false,
            cls: 'price-chart',
            plain: true,
            deferredRender: false,
            activeTab: 0,
            items: chartTabItemList,
            autoScroll: true,
            listeners: {
                tabchange: function(tabPanel, newTab) {
                    panel.activateChartCall();
                }
            }
        });
    	
    }, 
    _createMainPanel: function() {
        var panel = this;
        panel.cleanAllLoadMasks();
        var htmlDesign = "";
        var widthInfo = "50%";
        var chartPanel = "<td id='" + panel.thisPanelID + "_chart' style=' width:50%;'>  </td>";
        var colSpan = "2";
        var width = 0;
        if (panel.parentCt) {
            width = panel.parentCt.getWidth();
        }
        var width3pies = width / 2;
        
        if (isMobile || (panel.parentCt && width <= 650)) {
            widthInfo = "100%";
            chartPanel = "";
            colSpan = "1";
        }
        
        if (Ext.isIE) {
            widthInfo = (width / 2) + "px";
        }
        
        htmlDesign += "<table cellspacing='0' cellpadding='2' border='0' style=' width: 100%; '>";
        htmlDesign += "<tr>";
        htmlDesign += "<td id='" + panel.thisPanelID + "_title' colspan='" + colSpan + "' class='content-title'>   </td>";
        htmlDesign += "</tr>";
        htmlDesign += "<tr>";
        htmlDesign += "<td id='" + panel.thisPanelID + "_info' style=' width:" + widthInfo + ";'>  </td>";
        htmlDesign += chartPanel;
        htmlDesign += "</tr>";
        htmlDesign += "</table>";
        if (panel.parentCt && width <= 650) {
            chartPanel = "<div id='" + panel.thisPanelID + "_chart' style='width: 100%;height: 100%;'>  </div>";
            width3pies = width;
        }
        if (Ext.get(panel.getId())) {
            panel.remove(panel.tPanel_mainPanel);
        }
        if (panel.tPanel_mainPanel) {
            panel.tPanel_mainPanel.removeAll();
            panel.tPanel_mainPanel = null;
            panel.tPanel_titlePanel.removeAll();
            panel.tPanel_titlePanel = null;
        }
        panel.tPanel_mainPanel = new Ext.container.Container({
            width: '100%',
            height: '100%',
            border: false,
            overflowY: "hidden",
            defaults: {
                border: false,
                style: 'padding: 0px; font-weight: bold;'
            },
            cls: 'content_detail',
            items: [{html: htmlDesign}],
            listeners: {
                afterrender: function(thisComp) {
                    panel.containerHeight = !isMobile ? thisComp.findParentByType('container') - 60 : thisComp.findParentByType('container').findParentByType('container').getHeight() - mhPadding - 71;
                    if (n2nLayoutManager.isTabLayout()) {
                        panel.containerHeight = panel.up().up().body.getHeight() - 62;
                    }
                    panel._createTitlePanel();

                    if (!isMobile) {
                        if (width <= 650 && panel.parentCt) {

                        } else {
                            panel._createGraphPanel();
                        }
                    } else {
                        Ext.get(panel.thisPanelID + "_info").setHeight(panel.containerHeight - 20);
                    }
                    panel._createSummaryGrid();
                    panel._createTransactionGrid();
                    panel._createBusinessDoneGrid();
                    // create the price chart panel
                    panel._createChartPanel();

                    var tabItemList = [panel.tPanel_summary];
                    
                    if (!panel.isMf) {
                        
                        tabItemList.push(panel.tGrid_Transaction);
                        
                        if (showStkInfoTrackerBusinessDone.toLowerCase() == 'true') {
                            tabItemList.push(panel.tGrid_BusinessDone);
                            if (!isMobile && N2N_CONFIG.features_Tracker_3Pies) {
                                var ct = "Ext.container.Container";
                                if (width3pies == 0) {
                                    width3pies = thisComp.getWidth() / 2;
                                }
                                if (width3pies <= 440) {
                                    panel._piesAsTab = true;
                                } else {
                                    panel._piesAsTab = false;
                                }
                                panel.compRef.bsCharts = Ext.create(ct, {
                                    itemId: 'bsCharts',
                                    title: languageFormat.getLanguage(20098, 'Price Distribution'),
                                    layout: 'fit',
                                    autoScroll: true,
                                    tabPosition: 'top',
                                    items: [panel.tTabPanel_ChartPanel]
                                });

                                tabItemList.push(panel.compRef.bsCharts);
                            }
                        }   
                    
                    }
                    
                    if (!isMobile && width <= 650 && panel.parentCt) {
                        panel.compRef.intradayChart = Ext.create("Ext.panel.Panel", {
                            title: languageFormat.getLanguage(20103, 'Chart'),
                            border: false,
                            itemId: 'trackChart',
                            items: [{html: chartPanel}]
                        });
                        tabItemList.push(panel.compRef.intradayChart);
                    }
                    var infowidth = 0;
                    if (!isMobile && panel.parentCt && width > 650) {
                        infowidth = (thisComp.getWidth() / 2);
                    } else {
                        infowidth = '100%';
                    }
                    
                    panel.tTabPanel_Panel = new Ext.tab.Panel({
                        frame: false,
                        plain: true,
                        deferredRender: false,
                        renderTo: panel.thisPanelID + '_info',
                        height: !isMobile ? (panel.getHeight() - 60) : panel.containerHeight - 6,
                        width: infowidth,
                        tabBar: isMf(panel.exch) ? panel._createDocLink(stockutil.getStockPart()) : '',
                        items: tabItemList,
                        autoScroll: false,
                        listeners: {
                            tabchange: function(thisTabPanel, newTab) {
                                
                                panel.activateCall();
                                
                                // var portCol = thisComp.findParentByType('portalcolumn');
                                if (!isMobile && newTab.itemId !== 'trackChart' && width <= 650 && panel.parentCt) {
                                    panel.compRef.chartBtCt.hide();
                                }
                            },
                            afterrender: function(thisTabPanel) {
                                if (n2nLayoutManager.isTabLayout()) {
                                    thisTabPanel.setHeight(panel.containerHeight);
                                }
                            }
                        } 
                   });
                    panel.tTabPanel_Panel.doLayout();
                }
            }
        });
        if (Ext.get(panel.getId())) {
            panel.add(panel.tPanel_mainPanel);
        }
    },
    activateCall: function() {
        var panel = this;
        
        var activeTab = panel.tTabPanel_Panel.getActiveTab();
        panel.activeTabIndex = panel.tTabPanel_Panel.items.findIndex('id', activeTab.getId());
        panel.onViewTab = activeTab.getId();
        
        console.log(activeTab.itemId);

        var isBsChart = activeTab.itemId === 'bsCharts';
        if (activeTab.itemId === 'bsGrid' || isBsChart) {
            if (isBsChart) {
                
            } else {
                helper.runBuffer('bfBSCol');
            }

            panel.stopTrackerPullTimer();
            panel._procCallBusinessDone(isBsChart);

        } else if (activeTab.itemId === 'tranGrid') {
            panel.beginNumber = 0;
            panel.endNumber = 0;
            panel.eventType = '';

            helper.runBuffer('bfTSCol');
            panel._procCallTransaction();

        } else if (activeTab.itemId === 'trackChart') {
            panel.stopTrackerPullTimer();

            panel._createGraphPanel(true);
            panel.tPanel_GraphPanel.height = panel.compRef.intradayChart.getHeight() - 5;
            panel.tPanel_GraphPanel.border = false;
            panel._procCallChart();
            panel.compRef.intradayChart.updateLayout();
            panel.compRef.chartBtCt.show();
        } else {
            panel.stopTrackerPullTimer();
        }
    },
    activateChartCall: function() {
        var panel = this;
        
        // keep active tab
        var activeTab = panel.tTabPanel_ChartPanel.getActiveTab();
        panel.activeChartTabIndex = panel.tTabPanel_ChartPanel.items.findIndex('id', activeTab.id);
        
        if (activeTab.itemId === panel.compRef.bsStackedColumnCharts.itemId) { // stacked bar
            panel.compRef.bsStackedColumnCharts.removeAll(false);
            panel.compRef.bsStackedColumnCharts.add([panel._createStackedColumnChart(languageFormat.getLanguage(20097, 'Total Distribution'), true)]);
        } else { //  3 pies
            if(!panel.compRef.bsPieChartsPanel.setActiveTab(panel.activePieChartTabIndex)){
                panel.activateBsCall();
            }
        }
    },
    activateBsCall: function() {
        var panel = this;
        
        var activeTab = panel.compRef.bsPieChartsPanel.getActiveTab();
        panel.activePieChartTabIndex = panel.compRef.bsPieChartsPanel.items.findIndex('id', activeTab.id);
        
        switch (panel.activePieChartTabIndex) {
            case 0:
                panel.compRef.bsPieChartsTotal.removeAll(false);
                panel.compRef.bsPieChartsTotal.add(panel.createTitle(languageFormat.getLanguage(11035, 'Total'), 'pie chart'));
                panel.compRef.bsPieChartsTotal.add([panel._createBusinessDoneChart(languageFormat.getLanguage(11035, 'Total'), '4', false)]);
                
                break;
            case 1:
                panel.compRef.bsPieChartsBuy.removeAll(false);
                panel.compRef.bsPieChartsBuy.add(panel.createTitle(languageFormat.getLanguage(10001, 'Buy'), 'pie chart'));
                panel.compRef.bsPieChartsBuy.add([panel._createBusinessDoneChart(languageFormat.getLanguage(10001, 'Buy'), '2', false)]);
                
                break;
            case 2:
                panel.compRef.bsPieChartsSell.removeAll(false);
                panel.compRef.bsPieChartsSell.add(panel.createTitle(languageFormat.getLanguage(10002, 'Sell'), 'pie chart'));
                panel.compRef.bsPieChartsSell.add([panel._createBusinessDoneChart(languageFormat.getLanguage(10002, 'Sell'), '3', false)]);

                break;
        }

    },
            
    /**
     * Description <br/>
     * 
     * 		create transaction grid panel
     * 
     */
    _createTransactionGrid: function() {
        var panel = this;

        panel.compRef.tranStore = new Ext.data.Store({
            model: 'TCPlus.model.TransactionRecord',
            autoDestroy: true,
            sorters: [{
                    property: fieldTransNo,
                    direction: 'DESC'
                }]
        });

        panel.tField_Paging = new Ext.form.field.Number({
            readOnly: true,
            value: 1,
            width: 50,
            hidden: true
        });

        panel.tButton_Last = new Ext.button.Button({
            iconCls: 'x-tbar-page-last',
            tooltip: languageFormat.getLanguage('10050', 'Last'),
            disabled: true,
            handler: function() {
                panel.goLastPage();
            }
        });

        // paging previous button
        panel.tButton_Previous = new Ext.button.Button({
            iconCls: 'x-tbar-page-prev',
            tooltip: languageFormat.getLanguage('10049', 'Previous'),
            disabled: true,
            handler: function() {
                panel.goPrevPage();
            }
        });

        // paging next button
        panel.tButton_Next = new Ext.button.Button({
            iconCls: 'x-tbar-page-next',
            tooltip: languageFormat.getLanguage('10015', 'Next'),
            disabled: true,
            handler: function() {
                panel.goNextPage();
            }
        });

        panel.tButton_First = new Ext.button.Button({
            iconCls: 'x-tbar-page-first',
            tooltip: languageFormat.getLanguage('10048', 'First'),
            disabled: true,
            handler: function() {
                panel.goFirstPage();
            }
        });

        panel.tGrid_Transaction = new Ext.grid.Panel({
            title: languageFormat.getLanguage(20048, 'Time and Sales'),
            store: panel.compRef.tranStore,
            itemId: 'tranGrid',
            columns: panel.createTransactionColumns(),
            enableColumnMove: false,
            enableColumnHide: false,
            // allowDeselect: true, // so the scrollbar won't follow the selected row
            selModel: {
                mode: 'SINGLE',
                toggleOnClick: true,
                allowDeselect: true
            },
            viewConfig: {
                stripeRows: true
            },
            listeners: {
                afterrender: function(thisComp) {
                },
                columnresize: function(ct, column, newWidth) {
                    panel.trackerColState.setWidth(column.dataIndex, newWidth);
                    panel.trackerColState.save();
                }
            },
            bbar: [
                new Ext.button.Button({
                    text: languageFormat.getLanguage(10003, 'Reset'),
                    tooltip: languageFormat.getLanguage(10003, 'Reset'),
                    iconCls: 'icon-reset',
                    listeners: {
                        click: function() {
                            panel.beginNumber = 0;
                            panel.endNumber = 0;
                            panel.totalNumber = 0;
                            panel.totalRecord = 0;
                            panel.page = 0;
                            panel.stopTrackerPullTimer();
                            panel.eventType = "refresh";
                            panel._procCallTransaction();
                        }
                    }
                }),
                '->',
                panel.tButton_First,
                panel.tButton_Previous,
//    		    			   '-',
//    		    			   panel.tField_Paging,
//    		    			   '-',
                panel.tButton_Next,
                panel.tButton_Last
            ]
        });

    },
    /**
     * Creates transaction grid columns
     */
    createTransactionColumns: function() {
        var panel = this;

        return {
            defaults: {
                sortable: false
            },
            items: [
                {
                    itemId: 'time',
                    header: languageFormat.getLanguage(10123, 'Time'),
                    dataIndex: fieldTime,
                    hidden: false,
                    width: panel.trackerColState.getWidth(fieldTime),
                    locked: true,
                    renderer: function(value, meta) {
                        var cssClass = N2NCSS.CellDefault;
                        cssClass += " " + N2NCSS.FontString;
                        cssClass += " " + N2NCSS.FontUnChange;

                        meta.css = cssClass;

                        return formatutils.procDateValue(value);
                    }
                },
                {
                    itemId: 'action',
                    header: languageFormat.getLanguage(11081, 'PI'),
                    dataIndex: fieldTransAction,
                    hidden: false,
                    width: panel.trackerColState.getWidth(fieldTransAction),
                    align: 'center',
                    lockable: false,
                    renderer: function(value, meta) {
                        var cssClass = N2NCSS.CellDefault;
                        cssClass += " " + N2NCSS.FontString;

                        var returnValue = "";
                        if (value == 'b') {
                            returnValue = languageFormat.getLanguage(11011,'b');
                            if (panel.exch == 'PH') {
                                cssClass += " " + N2NCSS.FontUp;
                            } else {
                                cssClass += " " + N2NCSS.FontDown;
                            }
                        }
                        else if (value == 's') {
                            returnValue = languageFormat.getLanguage(11012,'s');

                            if (panel.exch == 'PH') {
                                cssClass += " " + N2NCSS.FontDown;
                            } else {
                                cssClass += " " + N2NCSS.FontUp;
                            }

                        } else if (value == 'm') {
                            returnValue = languageFormat.getLanguage(11011,'b');
                            if (panel.exch == 'PH') {
                                cssClass += " " + N2NCSS.FontUp;
                            } else {
                                cssClass += " " + N2NCSS.FontDown;
                            }
                        } else if (value == 'n') {
                            returnValue = languageFormat.getLanguage(11011,'s');;
                            if (panel.exch == 'PH') {
                                cssClass += " " + N2NCSS.FontDown;
                            } else {
                                cssClass += " " + N2NCSS.FontUp;
                            }
                        } else if (value == 'o') {
                            returnValue = "-";
                            if (panel.exch == 'PH') {
                                cssClass += " " + N2NCSS.FontUnChange_yellow;
                            } else {
                                cssClass += " " + N2NCSS.FontUnChange;
                            }
                        } else {
                            returnValue = value;

                            if (panel.exch == 'PH') {
                                cssClass += " " + N2NCSS.FontUnChange_yellow;
                            } else {
                                cssClass += " " + N2NCSS.FontUnChange;
                            }
                        }

                        meta.css = cssClass;

                        return returnValue;
                    }
                },
                {
                    itemId: 'price',
                    header: languageFormat.getLanguage(20835, 'Price'),
                    dataIndex: fieldLast,
                    width: panel.trackerColState.getWidth(fieldLast),
                    align: 'right',
                    lockable: false,
                    renderer: function(value, meta, record) {
                        var cssClass = N2NCSS.CellDefault;
                        cssClass += " " + N2NCSS.FontString;

                        if (panel.exch == 'PH') {

                            if (record.data[ fieldTransAction ].toLowerCase() == 'b') {
                                cssClass += " " + N2NCSS.FontUp;
                            } else if (record.data[ fieldTransAction ].toLowerCase() == 's') {
                                cssClass += " " + N2NCSS.FontDown;
                            } else {
                                cssClass += " " + N2NCSS.FontUnChange_yellow;
                            }

                        } else {
                            var tempLacp = (panel.lacp == null || isNaN(panel.lacp)) ? 0 : panel.lacp;

                            if (parseFloat(value) > parseFloat(tempLacp))
                                cssClass += " " + N2NCSS.FontUp;

                            else if (parseFloat(value) < parseFloat(tempLacp) && parseFloat(value) != 0)
                                cssClass += " " + N2NCSS.FontDown;

                            else
                                cssClass += " " + N2NCSS.FontUnChange;
                        }

                        meta.css = cssClass;

                        if (value.indexOf('.') != -1) {
                            if (value.toString().substring(0, 1) == '.') {
                                value = "0" + value;
                            }
                        }

                        return value;
                    }
                },
                {
                    itemId: 'volume',
                    header: languageFormat.getLanguage(11008, 'Volume'),
                    dataIndex: fieldUnit,
                    width: panel.trackerColState.getWidth(fieldUnit),
                    align: 'right',
                    lockable: false,
                    renderer: function(value, meta) {
                        var cssClass = N2NCSS.CellDefault;
                        cssClass += " " + N2NCSS.FontString;
                        cssClass += " " + N2NCSS.FontUnChange;

                        meta.css = cssClass;

                        return panel._returnNumberFormat(value, this.width);
                    }
                },
                {
                    itemId: 'bbh',
                    header: languageFormat.getLanguage(11009, 'BBH'),
                    dataIndex: fieldBuyBroker,
                    hidden: showTrackerBrokerName == "TRUE" ? false : true,
                    width: panel.trackerColState.getWidth(fieldBuyBroker),
                    align: 'right',
                    lockable: false,
                    renderer: function(value, meta, rec) {
                        var cssClass = N2NCSS.CellDefault;
                        cssClass += " " + N2NCSS.FontString;
                        cssClass += " " + N2NCSS.FontUnChange;

                        meta.css = cssClass;

                        if (value.indexOf('|') != -1) {
                            var buyBrokerToolTip = '';
                            var buyBrokerList = value.split('|');
                            var sellBrokerList = rec.get(fieldSellBroker).split('|');
                            var volList = rec.get(fieldAmalgamateBroker).split('|');
                            for (var i = 0; i < buyBrokerList.length; i++) {
                                buyBrokerToolTip = buyBrokerToolTip.concat(msgutil.join(languageFormat.getLanguage(11009, "BBH"), ":", buyBrokerList[i], ", ", languageFormat.getLanguage(11010, "SBH"), ":" + sellBrokerList[i], ", ", languageFormat.getLanguage(10118, "Vol"), ":", volList[i]));
                            }

                            meta.tdAttr = 'title="' + buyBrokerToolTip + '"';
                            return "[GROUP]";
                        } else {
                            return panel._returnNumberFormat(value, this.width);
                        }
                    }
                },
                {
                    itemId: 'sbh',
                    header: languageFormat.getLanguage(11010, 'SBH'),
                    dataIndex: fieldSellBroker,
                    width: panel.trackerColState.getWidth(fieldSellBroker),
                    hidden: showTrackerBrokerName == "TRUE" ? false : true,
                    align: 'right',
                    lockable: false,
                    renderer: function(value, meta, rec) {
                        var cssClass = N2NCSS.CellDefault;
                        cssClass += " " + N2NCSS.FontString;
                        cssClass += " " + N2NCSS.FontUnChange;

                        meta.css = cssClass;

                        if (value.indexOf('|') != -1) {
                            var sellBrokerToolTip = '';
                            var buyBrokerList = rec.get(fieldBuyBroker).split('|');
                            var sellBrokerList = value.split('|');
                            var volList = rec.get(fieldAmalgamateBroker).split('|');
                            for (var i = 0; i < sellBrokerList.length; i++) {
                                sellBrokerToolTip = sellBrokerToolTip.concat(msgutil.join(languageFormat.getLanguage(11009, "BBH"), ":", buyBrokerList[i], ", ", languageFormat.getLanguage(11010, "SBH"), ":", sellBrokerList[i], ", ", languageFormat.getLanguage(10118, "Vol"), ":", volList[i]));
                            }
                            meta.tdAttr = 'title="' + sellBrokerToolTip + '"';
                            return "[GROUP]";
                        } else {
                            return panel._returnNumberFormat(value, this.width);
                        }
                    }
                }
            ]
        };
    },
    /**
     * Description <br/>
     * 
     * 		create search panel
     */
    _createSearchGrid: function() {
        var panel = this;

        var resultTpl = new Ext.XTemplate(
                '<tpl for=".">',
                '<table class="search-item" cellpadding="0" cellspacing="0">',
                '<tr><td width="200px"><span>{' + fieldStkCode + '}</span></td><td><span>{' + fieldStkName + '}</span></td></tr>',
                '</table></tpl>'
                );

        var store = new Ext.data.Store({
            model: 'TCPlus.model.SearchRecord'
        });

        panel.tGrid_searchGrid = new Ext.view.View({
            tpl: resultTpl,
            store: store,
            itemSelector: 'table.search-item',
            emptyText: '<div class="x-grid-empty">' + panel.emptyMsg + '</div>',
            deferEmptyText: false,
            singleSelect: true,
            selectedItemCls: 'search-item-selected',
            hidden: true,
            listeners: {
                beforeselect: function() {
                    return !touchMode;
                },
                itemclick: function(thisComp, record, item, index, e) {
                    panel._procClickSearchRecord(record);
                },
                afterrender: function(thisComp) {
                }
            }
        });

    },
    /**
     * Description <br/>
     * 
     * 		create summary panel
     */
    _createSummaryGrid: function() {
        var panel = this;

        var createNewLabel = function(name, isLabel) {
            var tempComp = new Ext.form.Label({
                text: name
            });

            if (isLabel) {
                tempComp.addCls(N2NCSS.stockInfoLabel_color);
            } else {
                tempComp.addCls('wrap-text');
            }

            return tempComp;
        };

        var createNewPanel = function(itemsList) {
            var tempCompPanel = new Ext.container.Container({
                items: itemsList,
                style: {
                    width: '110px'
                },
                border: false
            });

            return tempCompPanel;
        };

        // full name
        panel.tLabel_FullName = createNewLabel(languageFormat.getLanguage(20026, "Full Name"), true);
        panel.tValue_FullName = new Ext.form.Label({
            text: '-'
            //colspan: 3
            //style: 'margin-left: 45px'
        });
        
        panel.tValue_Rating = new Ext.form.Label({
            text: '-',
            hidden: true,
            height: 26,
            width: 120,
            style: 'margin: 0 0 0 5px;float:left;'
        });
        
        panel.tValue_BRisk = new Ext.form.Label({
            text: '-',
            hidden: true,
            height: 66,
            width: 120,
            style: 'margin: 0 0 0 5px;float:left;'
        });
        
        panel.tValue_IBillionaire = new Ext.form.Label({
            text: '-',
            hidden: true,
            height: 50,
            style: 'margin: 10px 0 10px 5px;float:left;'
        });
        
        // indices
        panel.tLabel_Indices = createNewLabel(languageFormat.getLanguage(20029, "Indices"), true);
        panel.tValue_Indices = createNewLabel("-");
        // status
        panel.tLabel_Status = createNewLabel(languageFormat.getLanguage(20028, "Status"), true);
        panel.tValue_Status = createNewLabel("-");
        // trading board
        panel.tLabel_TBoard = createNewLabel(languageFormat.getLanguage(20039, "Trading Board"), true);
        panel.tValue_TBoard = createNewLabel("-");
        // sector
        panel.tLabel_Sector = createNewLabel(languageFormat.getLanguage(20027, "Sector"), true);
        panel.tValue_Sector = createNewLabel("-");
        // ISIN
        panel.tLabel_ISIN = createNewLabel(languageFormat.getLanguage(20031, "ISIN"), true);
        panel.tValue_ISIN = createNewLabel("-");
        // Delivery Basis
        panel.tLabel_DlBasis = createNewLabel(languageFormat.getLanguage(20038, "Delivery Basis"), true);
        panel.tValue_DlBasis = createNewLabel("-");
        // Lot size
        panel.tLabel_LotSize = createNewLabel(languageFormat.getLanguage(10712, "Lot.Size"), true);
        panel.tValue_LotSize = createNewLabel("-");
        // Lot size
        panel.tLabel_LotSize = createNewLabel(languageFormat.getLanguage(10712, "Lot.Size"), true);
        panel.tValue_LotSize = createNewLabel("-");
        // Par value
        panel.tLabel_ParValue = createNewLabel(languageFormat.getLanguage(20036, "Par Value"), true);
        panel.tValue_ParValue = createNewLabel("-");
        // Shares issued
        panel.tLabel_ShIssued = createNewLabel(languageFormat.getLanguage(20034, "Shares Issued"), true);
        panel.tValue_ShIssued = createNewLabel("-");
        // Market capital
        panel.tLabel_MktCap = createNewLabel(languageFormat.getLanguage(20035, "Mkt. Cap."), true);
        panel.tValue_MktCap = createNewLabel("-");
        // Value
        panel.tLabel_Value = createNewLabel(languageFormat.getLanguage(10127, 'Value'), true);
        panel.tValue_Value = createNewLabel('-');
        // Trade
        // panel.tLabel_Traded = createNewLabel(languageFormat.getLanguage(20037, "Value Traded"), true);
        // panel.tValue_Traded = createNewLabel("-");
        // volume
        panel.tLabel_Volumn = createNewLabel(languageFormat.getLanguage(11008, 'Volume'), true);
        panel.tValue_Volumn = createNewLabel('-');
        // Buy rate
        panel.tLabel_BuyRate = createNewLabel(languageFormat.getLanguage(20054, 'Buy Rate'), true);
        panel.tValue_BuyRate = createNewLabel('-');
        // Total buy
        panel.tLabel_TotalBuyVol = createNewLabel(languageFormat.getLanguage(20042, 'Total Buy Vol.'), true);
        panel.tValue_TotalBuyVol = createNewLabel('-');
        // Total sell
        panel.tLabel_TotalSellVol = createNewLabel(languageFormat.getLanguage(20043, 'Total Sell Vol.'), true);
        panel.tValue_TotalSellVol = createNewLabel('-');
        // Total short sell
        panel.tLabel_ShortSellVol = createNewLabel(languageFormat.getLanguage(20040, "Total S.Sell Vol."), true);
        panel.tValue_ShortSellVol = createNewLabel('-');
        // Total buy trans
        panel.tLabel_BuyTrans = createNewLabel(languageFormat.getLanguage(20044, "Total Buy Trans."), true);
        panel.tValue_BuyTrans = createNewLabel('-');
        // Total sell trans
        panel.tLabel_SellTrans = createNewLabel(languageFormat.getLanguage(20045, "Total Sell Trans."), true);
        panel.tValue_SellTrans = createNewLabel('-');
        // NTA
        panel.tLabel_NTA = createNewLabel(languageFormat.getLanguage(20057, 'NTA'), true);
        panel.tValue_NTA = createNewLabel('0.000');
        // LACP
        panel.tLabel_LACP = createNewLabel(languageFormat.getLanguage(10106, "LACP"), true);
        panel.tValue_LACP = createNewLabel('-');
        // High
        panel.tLabel_HighPrice = createNewLabel(languageFormat.getLanguage(20051, 'High Price'), true);
        panel.tValue_HighPrice = createNewLabel('-');
        // Low
        panel.tLabel_LowPrice = createNewLabel(languageFormat.getLanguage(20052, 'Low Price'), true);
        panel.tValue_LowPrice = createNewLabel('-');
        // Average Price
        panel.tLabel_MarketAvgPrice = createNewLabel(languageFormat.getLanguage(20053, 'Market Avg Price'), true);
        panel.tValue_MarketAvgPrice = createNewLabel('-');
        // P/E Ratio
        panel.tLabel_PERatio = createNewLabel(languageFormat.getLanguage(20055, 'P/E Ratio'), true);
        panel.tValue_PERatio = createNewLabel('0.0000');
        // EPS
        panel.tLabel_EPS = createNewLabel(languageFormat.getLanguage(20056, 'EPS'), true);
        panel.tValue_EPS = createNewLabel('0.000');
        // Ceiling
        panel.tLabel_Ceiling = createNewLabel(languageFormat.getLanguage(20046, "Ceiling"), true);
        panel.tValue_Ceiling = createNewLabel('-');
        // Floor
        panel.tLabel_Floor = createNewLabel(languageFormat.getLanguage(20047, "Floor"), true);
        panel.tValue_Floor = createNewLabel('-');
        // Foreign limit
        panel.tLabel_FrLimit = createNewLabel(languageFormat.getLanguage(20032, "Foreign Limit"), true);
        panel.tValue_FrLimit = createNewLabel('-');
        // Foreign ownership limit
        panel.tLabel_FrOwnerLimit = createNewLabel(languageFormat.getLanguage(20033, "Foreign Ownership Limit"), true);
        panel.tValue_FrOwnerLimit = createNewLabel('-');
        // Foreign Shares
        panel.tLabel_FrShare = createNewLabel(languageFormat.getLanguage(31903, "Foreign Shs"), true);
        panel.tValue_FrShare = createNewLabel('-');        
        // Foreign buy
        panel.tLabel_FrBuy = createNewLabel(languageFormat.getLanguage(31900, "Foreign Buy"), true);
        panel.tValue_FrBuy = createNewLabel('-');        
        // Foreign sell
        panel.tLabel_FrSell = createNewLabel(languageFormat.getLanguage(31901, "Foreign Sell"), true);
        panel.tValue_FrSell = createNewLabel('-');
        // Net Foreign
        panel.tLabel_NetFr = createNewLabel(languageFormat.getLanguage(31902, "Net Foreign"), true);
        panel.tValue_NetFr = createNewLabel('-');
        
        // Last Qtr Revenue
        // panel.tLabel_LastQtrRv = createNewLabel(languageFormat.getLanguage(11015, "Last Qtr Revenue/PAT"), true);
        // panel.tValue_LastQtrRv = createNewLabel('-');
        
        // YTD Revenue/PAT
        // panel.tLabel_YtdRev = createNewLabel(languageFormat.getLanguage(11016, "YTD Revenue/PAT"), true);
        // panel.tValue_YtdRev = createNewLabel('-');
        
        // Last 12 Months Revenue/PAT
        // panel.tLabel_Last12Rev = createNewLabel(languageFormat.getLanguage(11017, "Last 12 Months Revenue/PAT"), true);
        // panel.tValue_Last12Rev = createNewLabel('-');
        
        // Day Spread
        panel.tLabel_DaySpread = createNewLabel(languageFormat.getLanguage(11018, "Day Spread"), true);
        panel.tValue_DaySpread = createNewLabel('-');
        
        // 52Wk Spread
        panel.tLabel_52WkSpread = createNewLabel(languageFormat.getLanguage(11019, "52Wk Spread"), true);
        panel.tValue_52WkSpread = createNewLabel('-');
        
        // Week Hi
        panel.tLabel_WkHigh = createNewLabel(languageFormat.getLanguage(11020, "Week High"), true);
        panel.tValue_WkHigh = createNewLabel('-');
        
        // Week Low
        panel.tLabel_WkLow = createNewLabel(languageFormat.getLanguage(31636, "Week Low"), true);
        panel.tValue_WkLow = createNewLabel('-');
        
        // Month Hi
        panel.tLabel_MonthHigh = createNewLabel(languageFormat.getLanguage(31637, "Month High"), true);
        panel.tValue_MonthHigh = createNewLabel('-');
        
        // Month Low
        panel.tLabel_MonthLow = createNewLabel(languageFormat.getLanguage(31638, "Month Low"), true);
        panel.tValue_MonthLow = createNewLabel('-');
        
        // 52 Week Hi
        panel.tLabel_52WkHigh = createNewLabel(languageFormat.getLanguage(31639, "52Wk High"), true);
        panel.tValue_52WkHigh = createNewLabel('-');
        
        // 52 Week Low
        panel.tLabel_52WkLow = createNewLabel(languageFormat.getLanguage(31640, "52Wk Low"), true);
        panel.tValue_52WkLow = createNewLabel('-');
        
        // Previous price
        panel.tLabel_PrePrice = createNewLabel(languageFormat.getLanguage(31904, "Previous Price"), true);
        panel.tValue_PrePrice = createNewLabel('-');
        
        // Change Percentage
        panel.tLabel_ChgPer = createNewLabel(languageFormat.getLanguage(31905, "% Change"), true);
        panel.tValue_ChgPer = createNewLabel('-');
        
        // Open Price
        panel.tLabel_OpenPrice = createNewLabel(languageFormat.getLanguage(31906, "Open Price"), true);
        panel.tValue_OpenPrice = createNewLabel('-');
        
        // Total Transaction
        panel.tLabel_TolTrans = createNewLabel(languageFormat.getLanguage(31907, "Total Trans"), true);
        panel.tValue_TolTrans = createNewLabel('-');
                
        // Fluactation
        panel.tLabel_Fluactation = createNewLabel(languageFormat.getLanguage(31908, "Fluactation"), true);
        panel.tValue_Fluactation = createNewLabel('-');
        
        // Float Free
        panel.tLabel_FloatFree = createNewLabel(languageFormat.getLanguage(31909, "Freefloat Shs"), true);
        panel.tValue_FloatFree = createNewLabel('-');        
        
        // IDSS Total Volume
        panel.tLabel_IDSSTolVol = createNewLabel(languageFormat.getLanguage(31912, "IDSS Total Vol"), true);
        panel.tValue_IDSSTolVol = createNewLabel('-');        
        
        // IDSS Total Value
        panel.tLabel_IDSSTolVal = createNewLabel(languageFormat.getLanguage(31913, "IDSS Total Val"), true);
        panel.tValue_IDSSTolVal = createNewLabel('-');        
        
        // Type
        panel.tLabel_Type = createNewLabel(languageFormat.getLanguage(31914, "Type"), true);
        panel.tValue_Type = createNewLabel('-');        

        // VWAP
        panel.tLabel_VWAP = createNewLabel(languageFormat.getLanguage(31911, "VWAP"), true);
        panel.tValue_VWAP = createNewLabel('-');  
        
        // Vwap/Vol Day
        // panel.tLabel_VwapVolDay = createNewLabel(languageFormat.getLanguage(31641, "Vwap/Vol Day"), true);
        // panel.tValue_VwapVolDay = createNewLabel('-');
        
        // Vwap/Vol Week
        // panel.tLabel_VwapVolWeek = createNewLabel(languageFormat.getLanguage(31642, "Vwap/Vol Week"), true);
        // panel.tValue_VwapVolWeek = createNewLabel('-');
        
        // Vwap/Vol52 Week
        // panel.tLabel_VwapVol52Week = createNewLabel(languageFormat.getLanguage(31643, "Vwap/Vol52 Week"), true);
        // panel.tValue_VwapVol52Week = createNewLabel('-');
        
        if (panel.hasMfFid) {
            panel.tLabel_FundCode = createNewLabel(languageFormat.getLanguage(33510, "Fund Code"), true);
            panel.tValue_FundCode = new Ext.form.Label({
                text: '-'
            });
            
            panel.tLabel_FundName = createNewLabel(languageFormat.getLanguage(33511, "Fund Name"), true);
            panel.tValue_FundName = new Ext.form.Label({
                text: '-'
            });
            
            panel.tLabel_Currency = createNewLabel(languageFormat.getLanguage(10132, "Currency"), true);
            panel.tValue_Currency = new Ext.form.Label({
                text: '-'
            });
            
            panel.tLabel_MinInvest = createNewLabel(languageFormat.getLanguage(33516, "Min Investment"), true);
            panel.tValue_MinInvest = new Ext.form.Label({
                text: '-'
            });
            
            panel.tLabel_MinAddInvest = createNewLabel(languageFormat.getLanguage(0, "Min Additional Investment"), true);
            panel.tValue_MinAddInvest = new Ext.form.Label({
                text: '-'
            });
            
            panel.tLabel_MinRedQty = createNewLabel(languageFormat.getLanguage(0, "Min Redemption Amount"), true);
            panel.tValue_MinRedQty = new Ext.form.Label({
                text: '-'
            });
            
            panel.tLabel_MinHoldPeriod = createNewLabel(languageFormat.getLanguage(0, "Min Holding Period"), true);
            panel.tValue_MinHoldPeriod = new Ext.form.Label({
                text: '-'
            });
            
            panel.tLabel_MgtFee = createNewLabel(languageFormat.getLanguage(0, "Management Fee"), true);
            panel.tValue_MgtFee = new Ext.form.Label({
                text: '-'
            });
            
            panel.tLabel_EarlyRedFee = createNewLabel(languageFormat.getLanguage(0, "Early Redemption Fee"), true);
            panel.tValue_EarlyRedFee = new Ext.form.Label({
                text: '-'
            });
            
            panel.tLabel_RiskRate = createNewLabel(languageFormat.getLanguage(0, "Risk Rating"), true);
            panel.tValue_RiskRate = Ext.widget('riskratebar');
            
            panel.tLabel_FundType = createNewLabel(languageFormat.getLanguage(0, "Fund Type"), true);
            panel.tValue_FundType = new Ext.form.Label({
                text: '-'
            });
            
            panel.tLabel_Philosophy = createNewLabel(languageFormat.getLanguage(0, "Philosophy"), true);
            panel.tValue_Philosophy = new Ext.form.Label({
                text: '-'
            });
            
            panel.tLabel_Geo = createNewLabel(languageFormat.getLanguage(0, "Geography"), true);
            panel.tValue_Geo = new Ext.form.Label({
                text: '-'
            });
            
            panel.tLabel_LegalBase = createNewLabel(languageFormat.getLanguage(0, "Legal Base"), true);
            panel.tValue_LegalBase = new Ext.form.Label({
                text: '-'
            });
            
            panel.tLabel_FundSize = createNewLabel(languageFormat.getLanguage(0, "Fund Size"), true);
            panel.tValue_FundSize = new Ext.form.Label({
                text: '-'
            });
            
            panel.tLabel_FundIssuer = createNewLabel(languageFormat.getLanguage(0, "Fund Issuer"), true);
            panel.tValue_FundIssuer = new Ext.form.Label({
                text: '-'
            });
            
            panel.tLabel_NAVPS = createNewLabel(languageFormat.getLanguage(0, "NAVPS"), true);
            panel.tValue_NAVPS = new Ext.form.Label({
                text: '-'
            });
            
            panel.tLabel_StartDate = createNewLabel(languageFormat.getLanguage(0, "Start Date"), true);
            panel.tValue_StartDate = new Ext.form.Label({
                text: '-'
            });
            
        }
        
        var colNum = panel.getWidth() < N2N_CONFIG.minViewWidth ? 2 : 4;
        
        // get label and value according to config
        var configItems = panel.getConfigItems();

        panel.tPanel_summary = new Ext.container.Container({
            title: languageFormat.getLanguage(20061, 'Info'),
            autoScroll: true,
            style: 'padding: 5px',
            itemId: 'infoCt',
            items: [
				{
				    xtype: 'container',
				    layout:'hbox',
				    items: [
		                {
		                    xtype: 'container',
		                    layout:'vbox',
		                    //height: theScreenerURL.length > 0 ? 100 : 0,
		                    items: [
		                        panel.tValue_BRisk,
		                        panel.tValue_Rating
		                    ],
		                    style: 'padding: 2px 3px'
		                },
		                {
		                    xtype: 'container',
		                    layout:'vbox',
		                    //height: N2N_CONFIG.iBillionaireURL.length > 0 ? 100 : 0,
		                    items: [
		                        panel.tValue_IBillionaire
		                    ]
		                    //style: 'padding: 25px 3px'
		                }
	                ]
				},
                {
                    xtype: 'container',
                    layout: {
                        type: 'column',
                        columns: 2
                    },
                    cls: 'font-style-applied font-size-max-applied',
                    items: [
                        panel._getColumnCt(configItems.stkInfoLeft),
                        panel._getColumnCt(configItems.stkInfoRight)
                    ]
                }
            ]
        });

    },
    //Occupy tabbar for 2 link
    _createDocLink: function(fundcode) {
       var me = this;
       
       me.tabbarFundSheet = {
                    xtype: 'button',
                    cls: 'icon-small icon-pdf',
                    text: languageFormat.getLanguage(33710, 'Fact Sheet'),
                    textAlign: 'right',
                    handler: function () {
                        if (me.mfFundSheetWindow && !me.mfFundSheetWindow.closed) {
                            me.mfFundSheetWindow.focus();
                        } else {
                            url = N2N_CONFIG.mfFundSheet + '?code=' + me.stkcode + '&type=f';
                            me.mfFundSheetWindow = window.open(url, 'FundSheet', 'height=800,width=800');
                        }
                    }
               };
                       
       me.tabbarProspects = {
                    xtype: 'button',
                    cls: 'icon-small icon-pdf',
                    text: languageFormat.getLanguage(33711, 'Prospectus'),
                    textAlign: 'right',
                    handler: function(){
                        if (me.mfProspectsWindow && !me.mfProspectsWindow.closed) {
                            me.mfProspectsWindow.focus();
                        } else {
                            url = N2N_CONFIG.mfProspects + '?code=' + me.stkcode + '&type=p';
                            me.mfProspectsWindow = window.open(url, 'Prospects', 'height=800,width=800');
                            window.open(url, 'Prospects', 'height=800,width=800');
                        }
                    }
               };
       
       me.tabbarLink = {
           xtype: 'container',
           width: '100%',
           items: [
               //A non-rendering placeholder item which instructs the Toolbar's Layout to begin using the right-justified button container.
               { xtype: 'tbfill' },
               me.tabbarFundSheet,
               me.tabbarProspects
           ]
       };
       
       return me.tabbarLink;
    },
    _getColumnCt: function(items) {
        return {
            xtype: 'container',
            minWidth: 180,
            columnWidth: 0.5,
            cls: 'info_ct',
            layout: {
                type: 'table',
                columns: 2,
                tableAttrs: {
                    style: {
                        width: '100%'
                    }
                }
            },
            items: items,
            listeners: {
                resize: function(thisCt) {
                    if (thisCt.getWidth() === thisCt.minWidth) { // expand container width to 100% if displayed as one column
                        thisCt.addCls('fulltable');
                    } else {
                        thisCt.removeCls('fulltable');
                    }
                }
            }
        };
    },
    /**
     * Description <br/>
     * 
     * 		create graph panel
     */
    _createGraphPanel: function(checkPreventRecreate) {
        var panel = this;
        
        if (checkPreventRecreate) {
            if (panel.preventRecreate) {
                return;
            } else {
                panel.preventRecreate = true;
            }
        }
        
        if (!isStockChart) {
            panel.tPanel_GraphPanel = new Ext.container.Container({
                renderTo: panel.thisPanelID + '_chart',
                height: n2nLayoutManager.isTabLayout() ? panel.containerHeight : (panel.getHeight() - 70),
                style: 'margin:3px;',
                border: false,
                listeners: {
                    afterrender: function(thisComp) {
                        if (n2nLayoutManager.isTabLayout()) {
                            thisComp.setHeight(panel.containerHeight);
                        }
                    }
                }

            });
        } else {
            panel.tPanel_GraphPanel = Ext.create('Ext.ux.IFrame', {
                renderTo: panel.thisPanelID + '_chart',
                height: n2nLayoutManager.isTabLayout() ? panel.containerHeight : (panel.getHeight() - 55),
                iframeBorder: false,
                border: false,
                style: 'margin:0;',
                listeners: {
                    afterrender: function(thisComp) {
                    }
                }
            });
        }

    },
    /**
     * Description <br/>
     * 
     * 		create title panel
     */
    _createTitlePanel: function() {
        var panel = this;
        var tempPanel = new Ext.container.Container({
            cls: 'fix_themebg font-style-applied',
            flex: 1,
            border: false,
            html: "<table><tr>" +
                    "<td id=" + panel.thisPanelID + 'value_stockname' + " style='vertical-align:top'></td>" +
                    "<td id=" + panel.thisPanelID + 'value_updown' + " style='vertical-align:top'></td>" +
                    "<td id=" + panel.thisPanelID + 'value_last' + " style='vertical-align:top'></td>" +
                    "<td id=" + panel.thisPanelID + 'td_change' + " style='vertical-align:top'><div id=" + panel.thisPanelID + 'value_change' + " style='float:left;'></div> <div id=" + panel.thisPanelID + 'value_changeper' + " style='float:left;'></div></td>" +
                    "</tr></table>",
            listeners: {
                afterrender: function(thisComp) {
                    panel.tValue_Last = new Ext.form.Label({
                        text: '-',
                        renderTo: panel.thisPanelID + 'value_last',
                        style: 'margin: 0 5px 0 5px;'
                    });

                    panel.tValue_UpDown = new Ext.form.Label({
                        text: '',
                        renderTo: panel.thisPanelID + 'value_updown',
                        style: 'margin: 0 0 0 5px;float:left;'
                    });

                    panel.tValue_change = new Ext.form.Label({
                        text: '-',
                        renderTo: panel.thisPanelID + 'value_change',
                        style: 'margin: 0 5px 0 5px;float:left;'
                    });

                    panel.tValue_changePer = new Ext.form.Label({
                        text: '-',
                        renderTo: panel.thisPanelID + 'value_changeper',
                        style: 'margin: 0 5px 0 5px;float:left;'
                    });

                    panel.tValue_stockName = new Ext.form.Label({
                        text: '-',
                        renderTo: panel.thisPanelID + 'value_stockname',
                        style: isMobile ? 'margin: 0 5px 0 2px;float:left;' : 'margin: 0 5px;float:left;'
                    });
                }

            }

        });
        
        // default chart status
        if (!panel._chartType) {
            panel._chartType = 'i';
        }
        if (!panel._chartPrd) {
            panel._chartPrd = 730; // 2 years
        }
            
        var toolItems = [{flex: 1, border: false}];
        if (!isStockChart) {
            var elStyle = 'margin-left: 5px';
            
            // chart type drop down list
            panel.compRef.chartTypeCb = Ext.create('Ext.form.field.ComboBox', {
                width: 75,
                store: {
                    fields: ['value', 'text'],
                    data: [
                        {text: languageFormat.getLanguage(31513, 'Intraday'), value: 'i'},
                        {text: languageFormat.getLanguage(31514, 'Historical'), value: 'h'}
                    ]
                },
                valueField: 'value',
                displayField: 'text',
                queryMode: 'local',
                editable: false,
                style: elStyle,
                value: panel._chartType,
                listeners: {
                    select: function(thisCb, rec) {
                        if (rec && rec.length > 0) {
                            var cht = rec[0].get('value');

                            panel._chartType = cht;
                            if (cht === 'h') {
                                panel.compRef.periodCb.show();
                            } else {
                                panel.compRef.periodCb.hide();
                            }
                            panel._procCallChart();
                        }
                    }
                }
            });
            toolItems.push(panel.compRef.chartTypeCb);

            // historical period
            panel.compRef.periodCb = Ext.create('Ext.form.field.ComboBox', {
                width: 40,
                hidden: panel._chartType !== 'h',
                store: {
                    fields: ['value', 'text'],
                    data: [
                        {text: '1M', value: 30},
                        {text: '3M', value: 90},
                        {text: '6M', value: 180},
                        {text: '1Y', value: 365},
                        {text: '2Y', value: 730}
                    ]
                },
                valueField: 'value',
                displayField: 'text',
                queryMode: 'local',
                editable: false,
                style: elStyle,
                value: panel._chartPrd,
                matchFieldWidth: false,
                listConfig: {
                    maxWidth: 40
                },
                listeners: {
                    select: function(thisCb, rec) {
                        if (rec && rec.length > 0) {
                            var prd = rec[0].get('value');

                            panel._chartPrd = prd;
                            panel._procCallChart();
                        }
                    }
                }
            });
            toolItems.push(panel.compRef.periodCb);
        }
        
        var refreshBtn = Ext.create('Ext.button.Button', {
            text: languageFormat.getLanguage(10008, 'Refresh'),
            tooltip: languageFormat.getLanguage(10008, 'Refresh'),
            iconCls: 'icon-reset',
            cls: 'fix_btn',
            style: 'margin-left: 5px; margin-right: 3px',
            handler: function() {
                panel.newOpen = false;
                panel._procCallChart(true);
            }
        });
        toolItems.push(refreshBtn);

        panel.compRef.chartBtCt = Ext.create('Ext.container.Container', {
            width: isStockChart ? 30 : 160,
            border: false,
            xtype: 'container',
            layout: 'hbox',
            items: toolItems,
            hidden: isMobile || panel.getWidth() <= 650,
            style: 'padding-top:5px'
        });
        panel.tPanel_titlePanel = new Ext.container.Container({
            height: isMobile ? 42 : 'auto',
            layout: 'hbox',
            border: false,
            items: [
                tempPanel,
                panel.compRef.chartBtCt
            ],
            renderTo: panel.thisPanelID + '_title'
        });
    },
    /**
     * Description <br/>
     * 
     * 		create business done grid panel
     */
    _createBusinessDoneGrid: function() {
        var panel = this;

        panel.compRef.bsStore = new Ext.data.Store({
            model: 'TCPlus.model.BusinessDoneRecord',
            autoDestroy: true
//            sorters: [{
//                    property: '1',
//                    direction: 'DESC'
//                }]
        });
        panel.buyStore = Ext.create("Ext.data.Store", {
            model: 'TCPlus.model.BusinessDoneRecord',
            autoDestory: true,
            sorters: [{
                    property: '1',
                    direction: 'DESC'
                }],
            filters: [function(item) {
                    var dataIndexBuy = "2";
                    return item.data[dataIndexBuy] > 0;
                }]
        });
        panel.totalStore = Ext.create("Ext.data.Store", {
            model: 'TCPlus.model.BusinessDoneRecord',
            autoDestory: true,
            sorters: [{
                    property: '1',
                    direction: 'DESC'
                }],
            filters: [function(item) {
                    return item.data["4"] > 0;
                }]
        });
        panel.sellStore = Ext.create("Ext.data.Store", {
            model: 'TCPlus.model.BusinessDoneRecord',
            autoDestory: true,
            sorters: [{
                    property: '1',
                    direction: 'DESC'
                }],
            filters: [function(item) {
                    var dataIndexSell = "3";
                    return item.data[dataIndexSell] > 0;
                }]
        });

        panel.tGrid_BusinessDone = new Ext.grid.Panel({
            title: languageFormat.getLanguage(20049, 'Business Done'),
            itemId: 'bsGrid',
            store: panel.compRef.bsStore,
            columns: panel.createBusinessDoneColumns(),
            enableColumnMove: false,
            enableColumnHide: false,
            autoScroll: true,
            viewConfig: {
                stripeRows: true,
                trackOver: true,
                preserveScrollOnRefresh: true
            },
            bufferedRenderer: false,
            listeners: {
            	columnresize: function(ct, column, newWidth) {
            		panel.bsColState.setWidth(column.dataIndex, newWidth);
            		panel.bsColState.save();

            		if (N2N_CONFIG.autoQtyRound) {
            			helper.refreshView(panel.tGrid_BusinessDone);
            		}
            	}
            }
        });

    },
    createBusinessDoneColumns: function() {
        var panel = this;

        return {
            defaults: {
                sortable: false
            },
            items: [
                {
                    itemId: 'price',
                    header: languageFormat.getLanguage(20835, 'Price'),
                    dataIndex: '1',
                    hidden: false,
                    locked: true,
                    align: 'right',
                    sortable: false,
                    menuDisabled: true,
                    width: panel.bsColState.getWidth('1'),
                    renderer: function(value, meta) {
                        var cssClass = N2NCSS.CellDefault;

                        cssClass += " " + N2NCSS.FontString;

                        var tempLacp = (panel.lacp == null || isNaN(panel.lacp)) ? 0 : panel.lacp;

                        if (parseFloat(value) > parseFloat(tempLacp))
                            cssClass += " " + N2NCSS.FontUp;
                        else if (parseFloat(value) < parseFloat(tempLacp) && parseFloat(value) != 0)
                            cssClass += " " + N2NCSS.FontDown;
                        else
                            cssClass += " " + N2NCSS.FontUnChange;

                        meta.css = cssClass;

                        return value;
                    }
                },
                {
                    itemId: 'bvol',
                    header: languageFormat.getLanguage(11002, 'BVol'),
                    dataIndex: '2',
                    hidden: false,
                    align: 'right',
                    sortable: false,
                    menuDisabled: true,
                    width: panel.bsColState.getWidth('2'),
                    renderer: function(value, meta) {
                        var cssClass = N2NCSS.CellDefault;
                        cssClass += " " + N2NCSS.FontString;
                        cssClass += " " + N2NCSS.FontUnChange;

                        meta.css = cssClass;
                        return panel._returnNumberFormat(value, panel.bsColState.getWidth('2'));
                    }
                },
                {
                    itemId: 'bvolpc',
                    header: languageFormat.getLanguage(11003, 'BVol%'),
                    dataIndex: '6',
                    hidden: true,
                    align: 'right',
                    sortable: false,
                    menuDisabled: true,
                    width: panel.bsColState.getWidth('6'),
                    renderer: function(value, meta) {
                        var cssClass = N2NCSS.CellDefault;
                        cssClass += " " + N2NCSS.FontString;
                        cssClass += " " + N2NCSS.FontUnChange;

                        meta.css = cssClass;
                        return parseFloat(value).toFixed(2);
                    }
                },
                {
                    itemId: 'svol',
                    header: languageFormat.getLanguage(11004, 'SVol'),
                    dataIndex: ('3'),
                    hidden: false,
                    align: 'right',
                    sortable: false,
                    menuDisabled: true,
                    width: panel.bsColState.getWidth('3'),
                    renderer: function(value, meta) {
                        var cssClass = N2NCSS.CellDefault;
                        cssClass += " " + N2NCSS.FontString;
                        cssClass += " " + N2NCSS.FontUnChange;

                        meta.css = cssClass;

                        return panel._returnNumberFormat(value, panel.bsColState.getWidth('3'));
                    }
                },
                {
                    itemId: 'svolpc',
                    header: languageFormat.getLanguage(11005, 'SVol%'),
                    dataIndex: '7',
                    hidden: true,
                    align: 'right',
                    sortable: false,
                    menuDisabled: true,
                    width: panel.bsColState.getWidth('7'),
                    renderer: function(value, meta) {
                        var cssClass = N2NCSS.CellDefault;
                        cssClass += " " + N2NCSS.FontString;
                        cssClass += " " + N2NCSS.FontUnChange;

                        meta.css = cssClass;
                        return parseFloat(value).toFixed(2);
                    }
                },
                {
                    itemId: 'bvolcb', // color bar
                    header: languageFormat.getLanguage(10166, 'Buy%'),
                    dataIndex: '6',
                    hidden: false,
                    align: 'center',
                    sortable: false,
                    menuDisabled: true,
                    width: panel.bsColState.getWidth('br'),
                    renderer: function(value, meta, record) {
                        var cssClass = N2NCSS.CellDefault;
                        cssClass += " " + N2NCSS.FontString;
                        cssClass += " " + N2NCSS.FontUnChange;

                        meta.css = cssClass;
                        var _qtip = languageFormat.getLanguage(10001, 'Buy') + ': ' + value + '%, ' + languageFormat.getLanguage(10002, 'Sell') + ': ' + record.get('7') + '%';
                        meta.tdAttr = 'title="' + _qtip + '"';
                        meta.tdCls = 'nopadding';
                        
                        if (panel.exch === 'PH') {
                            return getColorBar(value, null, "b");
                        } else {
                            return getColorBar(value, null, "s");
                        }
                    }
                },
                {
                    itemId: 'totvol',
                    header: languageFormat.getLanguage(11006, 'Total Vol'),
                    dataIndex: '4',
                    hidden: false,
                    align: 'right',
                    sortable: false,
                    menuDisabled: true,
                    width: panel.bsColState.getWidth('4'),
                    renderer: function(value, meta) {
                        var cssClass = N2NCSS.CellDefault;
                        cssClass += " " + N2NCSS.FontString;
                        cssClass += " " + N2NCSS.FontUnChange;

                        meta.css = cssClass;

                        return panel._returnNumberFormat(value, panel.bsColState.getWidth('4'));
                    }
                },
                {
                    itemId: 'totval',
                    header: languageFormat.getLanguage(11007, 'Total Val'),
                    dataIndex: '5',
                    hidden: false,
                    align: 'right',
                    sortable: false,
                    menuDisabled: true,
                    width: panel.bsColState.getWidth('5'),
                    renderer: function(value, meta) {
                        var cssClass = N2NCSS.CellDefault;
                        cssClass += " " + N2NCSS.FontString;
                        cssClass += " " + N2NCSS.FontUnChange;

                        meta.css = cssClass;
                        return panel._returnNumberFormat(value, panel.bsColState.getWidth('5'));
                    }
                }
            ]};
    },
    /**
     * Description <br/>
     * 
     * 		call title info 
     */
    procCallTitle: function() {
        var panel = this;
        if (panel._isEmptyStock()) {
            return;
        }
        
        // check whether to show only stock info for some exchanages
        var item = determineItem(['Stock Tracker'], formatutils.getExchangeFromStockCode(panel.stkcode));
        panel.fullTracker = item[0].status;

        panel._procCleanAllPanel();
        var tmpStkCode = stockutil.getStockPart(panel.stkcode);
        var tmpStkName = stockutil.getStockPart(panel.stkname);
        var hTitle = tmpStkCode + ' / ' + tmpStkName;

        helper.setHtml(panel.tValue_stockName, hTitle);

        panel._updateTitle();
        compAddRecent(panel, panel.stkcode);

        if (pseStockNewsURL.length == 0) {
            panel.tValue_stockName.update('<label>' + hTitle + '</label>');
        } else {
            panel.tValue_stockName.update('<label class="label_link" onclick="n2ncomponents.openPSENews(\'' + panel.stkcode + '\')" >' + hTitle + '</label>');
        }

        panel._procCallStockInfo(true);
    },
    _innerCall: function(newRecordObj) {
        var panel = this;

        if (newRecordObj != null) {
            panel.endNumber = newRecordObj[fieldTransNo] == null ? 0 : newRecordObj[fieldTransNo];
            panel.totalNumber = newRecordObj[fieldTransNo] == null ? 0 : newRecordObj[fieldTransNo];
        }

        panel.onReady = true;


        if (panel.fullTracker) {
            panel.tGrid_Transaction.enable();
            panel.tGrid_BusinessDone.enable();
            if (panel.compRef.bsCharts) {
                panel.compRef.bsCharts.enable();
            }
            
        } else {
            panel.tGrid_Transaction.disable();
            panel.tGrid_BusinessDone.disable();
            if (panel.compRef.bsCharts) {
                panel.compRef.bsCharts.disable();
            }
            panel.activeTabIndex = 0; // info tab
        }

        if (!panel.tTabPanel_Panel.setActiveTab(panel.activeTabIndex)) {
            // if tabchange not fired, will need to call manually
            panel.activateCall();
        }

        if (!isMobile && panel.getWidth() > 650) {
            panel._procCallChart();
        }

    },
    /**
     * Description <br/>
     * 
     * 		call stock info and subscription stock info 
     */
    _procCallStockInfo: function(runFn, showLoading) {
        var panel = this;
        if (panel._isEmptyStock()) {
            return;
        }
        
        if (showLoading) {
            helper.setLoading(panel.tPanel_summary, true);
        }
        
        conn.getStockInfo({
            rType: 'tr_info',
            k: panel.stkcode,
            f: panel.getFieldList(),
            success: function(obj) {
                try {
                    if (obj.s) {
                        Storage.generateUnsubscriptionByExtComp(panel, true);
                        Storage.generateSubscriptionByList([panel.stkcode], panel);
                        
                        updater.updateQuote(obj);
                        
                        if (showLoading) {
                            helper.setLoading(panel.tPanel_summary, false);
                        }
                        
                        if (runFn) {
                            panel._innerCall(Storage.returnRecord(panel.stkcode));
                        }
                        
                        panel.getMsg06();
                        panel.getMsg17();
                        panel.getIBillionaire();
                    }
                } catch (e) {
                    console.log('[Tracker][_procCallStockInfo] Exception ---> ' + e);
                }

            }
        });
    },
    /**
     * Description <br/>
     * 
     * 		call transaction info
     * 
     */
    _procCallTransaction: function() {
        var panel = this;

        if (panel._isEmptyStock()) {
            return;
        }
        
        panel.stopTrackerPullTimer();

        if (panel.onAjaxTransaction) {
            return;
        } else {
            if (panel.onReady) {
                panel.onAjaxTransaction = true;
            } else {
                return;
            }
        }
        
        helper.setLoading(panel.tGrid_Transaction, true);
        
        if (stockutil.isDelayStock(panel.stkcode)) {
            if (panel.endNumber == 0) { // no need to retrive total number again if retrieved earlier
                conn.getTransactionNum({
                    rType: 'tr_transNum',
                    k: panel.stkcode,
                    success: function(response) {
                        if (response.d.length > 0) {
                            var totalTran = 0;
                            if (response.info && response.info.info && response.info.info[fieldTransNo]) {
                                totalTran = response.info.info[fieldTransNo];
                            }

                            // update total number and end number
                            panel.totalNumber = totalTran;
                            panel.endNumber = totalTran;
                            panel._getTransaction();
                        } else {
                            helper.setLoading(panel.tGrid_Transaction, false);
                            helper.setGridEmptyText(panel.tGrid_Transaction, panel.emptyMsg);
                            panel.onAjaxTransaction = false;
                        }
                    },
                    callback: function(opt, success, response) {
                        var obj = Ext.decode(response.responseText);
                        if (obj.s) {
                            panel.startTrackerPullTimer();
                        }
                    },
                    failure: function(response) {
                        panel.stopTrackerPullTimer();
                    }
                });
            } else {
                panel._getTransaction();
            }
        } else {
            panel._getTransaction();
        }
    },
    _getTransaction: function() {
        var panel = this;

        if (isNaN(panel.beginNumber)) {
            panel.beginNumber = 0;
        }
        if (isNaN(panel.endNumber)) {
            panel.endNumber = 0;
        }
        if (isNaN(panel.totalNumber)) {
            panel.totalNumber = 0;
        }
        if (panel.endNumber == 0 && panel.beginNumber == 0) {
            var newRecordObj = Storage.returnRecord(panel.stkcode);

            if (newRecordObj) {
                panel.endNumber = newRecordObj[fieldTransNo] == null ? 0 : newRecordObj[fieldTransNo];
                panel.totalNumber = newRecordObj[fieldTransNo] == null ? 0 : newRecordObj[fieldTransNo];
            }
        }

        panel.tPanel_mainPanel.show();

        panel.tGrid_searchGrid.hide();
        panel.tButton_back.hide();

        conn.getTransaction({
            rType: 'tr_trans',
            k: panel.stkcode,
            begin: panel.beginNumber,
            end: panel.endNumber,
            eventType: panel.eventType,
            total: panel.totalNumber,
            p: panel.page,
            lotSize: panel.lotSize,
            success: function(obj) {
                try {
                    if (obj.s) {
                        if (obj.t == 'trans' || obj.t == 't') {
                            if (obj.d.length > 0) {
                                var newDataObj = obj.d;
                                panel._updateTransaction(newDataObj);
                            } else {
                                helper.setGridEmptyText(panel.tGrid_Transaction, panel.emptyMsg);
                            }
                        }
                    } else {

                        var errorMessage = "";
                        if (obj.e != null && obj.m != null) {
                            errorMessage = obj.e + " - " + obj.m;

                        } else if (obj.c == 0) {
                            errorMessage = panel.emptyMsg;
                        }

                        helper.setGridEmptyText(panel.tGrid_Transaction, panel.emptyMsg);
                    }

                    if (obj.info) {
                        panel._procPagingButton(obj.info, obj.d.length);
                    }
                    
                    // auto select first row
                    // helper.selectRow(panel.tGrid_Transaction, 0, true);
                    var gridView = helper.getGridView(panel.tGrid_Transaction);
                    
                    // save scroll position when refresh
                    gridView.bufferedRenderer.onViewScroll(null, gridView.el);

                } catch (e) {
                    console.log('[Tracker][_procCallTransaction] Exception ---> ' + e);
                    //helper.setHtml(panel.tGrid_Transaction.getView(), '<div class="x-grid-empty"> We regret to inform that we are unable to process your request at this time. Kindly try again shortly. -9603 - </div>');
                }

                panel.onAjaxTransaction = false;
                helper.setLoading(panel.tGrid_Transaction, false);
            }
        });
    },
    /**
     * Description <br/>
     * 
     * 		call business done info
     * 
     */
    _procCallBusinessDone: function(isBsChart) {
        var panel = this;
        if (panel._isEmptyStock()) {
            return;
        }
        
        helper.setLoading(panel.tGrid_BusinessDone, true);
        conn.getBusinessDone({
            rType: 'tr_bs',
            k: panel.stkcode,
            lotSize: panel.lotSize,
            success: function(response) {
                try {
                    var obj = response;

                    if (obj && obj.s && obj.k == panel.stkcode) {
                        panel._updateBusinessDone(obj.d, isBsChart);
                    } else {
                        var errorMessage = "";
                        if (obj.e != null && obj.m != null) {
                            errorMessage = obj.e + " - " + obj.m;

                        } else if (obj.c == 0) {
                            errorMessage = languageFormat.getLanguage(30002, "No results found. Kindly try again shortly.") + " -9508 -";
                        }
                        helper.setGridEmptyText(panel.tGrid_BusinessDone, panel.emptyMsg);
                        
                    }

                } catch (e) {
                    console.log('[Tracker][_procCallBusinessDone] Exception ---> ' + e);
                    // helper.setGridEmptyText(panel.tGrid_BusinessDone, panel.emptyMsg);
                }
                
                helper.setLoading(panel.tGrid_BusinessDone, false);
            }
        });

    },
    /**
     * Description <br/>
     * 
     * 		call chart graph
     * 
     */
    _procCallChart: function(refreshChart) {
        var panel = this;
        
        if (!panel.fullTracker && panel._chartType === 'i') { // no intraday chart for non full trackers
            panel._chartType = 'h';
            panel._chartPrd = 730;

            if (!isStockChart) {
                panel.compRef.chartTypeCb.select(panel._chartType);
                helper.show(panel.compRef.periodCb);
                panel.compRef.periodCb.select(panel._chartPrd);
            }
        } else if (panel.fullTracker && panel._chartType === 'h' && isStockChart) {
            panel._chartType = 'i';
        }
        
        if (panel._isEmptyStock()) {
            return;
        }
        // Do not display chart for HKD
        if (formatutils.getExchangeFromStockCode(panel.stkcode) == 'HKD') {
            helper.setHtml(panel.tPanel_GraphPanel, languageFormat.getLanguage(30902, 'Chart Not Available.'));
            return;
        }
        var headerHeight = 40;
        if (panel.getWidth() > 650) {
            headerHeight = 5;
        }
        
        if (!isStockChart) {
            var panelSize = panel.tPanel_GraphPanel.getSize();

            var url = addPath;
            if (panel._chartType === 'i') { // intraday chart
                url += 'tcplus/intradaychart?t=2';
            } else {
                url += 'tcplus/hischart?';
                url += 'd=';
                url += panel._chartPrd;
            }

            url += '&ExtComp=';
            url += 'Tracker_' + panel.getId();
            url += '&k=';
            url += panel.stkcode;
            url += '&w=';
            url += panelSize.width;
            url += '&h=';
            url += panelSize.height - headerHeight;
            url += '&id=tracker';
            url += '&ct=';
            url += '&c=';
            url += formatutils.procThemeColor(); 
            
            helper.setLoading(panel.tPanel_GraphPanel, true);

            Ext.Ajax.request({
                url: url,
                method: 'POST',
                timeout: 10000,
                success: function(response) {
                    helper.cleanLoadMask(panel.tPanel_GraphPanel);
                    
                    try {
                        var obj = Ext.decode(response.responseText);

                        if (obj.s) {
                            var tempNewObj = '<img src="' + obj.d + '?' + Math.random() + '" alt="' + languageFormat.getLanguage(11135, 'Price Volume vs Time Chart') + '"/>';
                            helper.setHtml(panel.tPanel_GraphPanel, tempNewObj);
                        } else {
                            helper.setHtml(panel.tPanel_GraphPanel, msgutil.parseMsg(obj.d));
                        }

                    } catch (e) {
                        console.log('[Tracker][_procCallChart] Exception ---> ' + e);

                        helper.setHtml(panel.tPanel_GraphPanel, languageFormat.getLanguage(30903, 'Please click on Refresh Chart to get the latest chart.'));
                    }
                },
                failure: function(response) {
                    helper.setHtml(panel.tPanel_GraphPanel, languageFormat.getLanguage(30903, 'Please click on Refresh Chart to get the latest chart.'));
                    helper.cleanLoadMask(panel.tPanel_GraphPanel);
                }
            });
        } else {

            if (!panel.chartEvent) {
                refreshChart = true;
                
                /*
                if (n2nLayoutManager.isTabLayout()) {
                    panel.up().on("deactivate", function() {
                        panel.tPanel_GraphPanel.refresh("");
                    });
                    panel.up().on("activate", function() {
                        panel.tPanel_GraphPanel.refresh(panel._getChartUrl());
                    });
                }
                if (panel.compRef.intradayChart) {
                    panel.compRef.intradayChart.on("deactivate", function() {
                        panel.tPanel_GraphPanel.refresh("");
                    });
                    panel.compRef.intradayChart.on("activate", function() {
                        panel.tPanel_GraphPanel.refresh(panel._getChartUrl());
                    });
                }
                */

                panel.chartEvent = true;
            }
            
            // if (refreshChart) {
            var prevChartKey = sessionStorage.getItem('trackerChart');
            if(prevChartKey){
            	if(prevChartKey == panel.stkcode){
            		return;
            	}
            }

            sessionStorage.setItem('trackerChart', panel.stkcode);
            var charturl = panel._getChartUrl();
            panel.tPanel_GraphPanel.refresh(charturl);
            // }
        }
        
        panel.needReloadChart = false;
    },
    /**
     * Description <br/>
     * 
     * 		call search stock code / name
     * 
     */
    _procSearchStock: function() {
        var panel = this;

        var searchKey = panel.tField_Search.getValue();
        searchKey = searchKey.trim();
        if (searchKey != '') {
            panel.tPanel_mainPanel.hide();
            panel.tGrid_searchGrid.show();
            panel.tButton_back.show();
            panel.onReady = false;

            //helper.setHtml(panel.tGrid_searchGrid, '');
            panel.tGrid_searchGrid.store.removeAll();

            var searchValue = panel.tField_Search.getValue();
            
            // var item = determineItem(['Stock Tracker'], exchangecode);
            // if(item[0].status){
            	conn.searchStock({
            		k: searchValue,
            		ex: exchangecode,
            		field: [fieldStkCode, fieldStkName, fieldSbExchgCode, fieldTransNo],
                        quickSearch: true,
            		success: function(obj) {
            			try {
            				if (obj.s) {
            					if (obj.d.length > 0) {
            						panel._updateSearchStock(obj.d);

            					} else {
                                                        helper.setGridEmptyText(panel.tGrid_searchGrid, panel.emptyMsg);
            					}

            				} else {
                                                helper.setGridEmptyText(panel.tGrid_searchGrid, panel.emptyMsg);
            				}

            			} catch (e) {
            				console.log('[Tracker][_procSearchStock] Exception ---> ' + e);
            			}

            		}
            	});
            // }
        } else {
            panel.tField_Search.focus();
        }
    },
    /**
     * Description <br/>
     * 
     * 		update stock info
     * 
     */
    updateFeedRecord: function(dataObj) {
        var panel = this;

        if (dataObj == null || panel.stkcode != dataObj[fieldStkCode]) {
            return;
        }
        
        var lastUpdate = false;
        if (dataObj[fieldLacp] != null) {
            panel.lacp = dataObj[fieldLacp];
            helper.setHtml(panel.tValue_LACP, getDisplayValue(panel.lacp));
            
            // mf
            if (panel.isMf) {
                helper.setHtml(panel.tValue_NAVPS, getDisplayValue(panel.lacp));
            }
            
            lastUpdate = true;
        }
        if (dataObj[fieldLast] != null) {
            panel.last = dataObj[fieldLast];
            lastUpdate = true;
        }

        if (lastUpdate) {
            var cssClass = "";
            if (panel.last == 0 || panel.lacp == 0) {
                cssClass = N2NCSS.FontUnChange;
            } else if (panel.last > panel.lacp) {
                cssClass = N2NCSS.FontUp;
            } else if (panel.last < panel.lacp) {
                cssClass = N2NCSS.FontDown;
            } else {
                cssClass = N2NCSS.FontUnChange;
            }

            helper.setHtml(panel.tValue_Last, "<label class='" + cssClass + "'> " + getDisplayValue(panel.last) + "  </label>");
        }
        
        if (dataObj[fieldChange] != null) {
            var cssClass = "";
            var iconCls = "";

            if (parseFloat(dataObj[fieldChange]) > 0) {
                cssClass = N2NCSS.FontUp;
                iconCls = 'icon-arrow icon-arrow-up';

            } else if (parseFloat(dataObj[fieldChange]) < 0) {
                cssClass = N2NCSS.FontDown;
                iconCls = 'icon-arrow icon-arrow-down';

            } else {
                cssClass = N2NCSS.FontUnChange;
            }

            helper.setHtml(panel.tValue_change, "<label class='" + cssClass + "'> " + dataObj[fieldChange] + "  </label>");
            helper.setHtml(panel.tValue_changePer, "<label class='" + cssClass + "'> " + dataObj[fieldChangePer] + "%" + "  </label>");
            helper.setHtml(panel.tValue_ChgPer, "<label class='" + cssClass + "'> " + dataObj[fieldChangePer] + "%" + "  </label>");
            panel.tValue_UpDown.removeCls(['icon-arrow', 'icon-arrow-up', 'icon-arrow-down']);
            panel.tValue_UpDown.addCls(iconCls);
        }

        if (panel.isMf) {
            updateFieldValue(panel.tValue_FundCode, stockutil.getStockPart(dataObj[fieldStkCode]));
            updateFieldValue(panel.tValue_FundName, stockutil.getStockPart(dataObj[fieldStkName]));
            updateFieldValue(panel.tValue_Currency, dataObj[fieldCurrency]);
            updateFieldValue(panel.tValue_FundSize, dataObj[fieldFundSize], '-', 'qty');
        } else {
           
            // time and sale record
            if (dataObj[fieldLotSize]) {
                panel.lotSize = dataObj[fieldLotSize];
            }

            if (dataObj[fieldTransNo] != null && dataObj[fieldTime] != null && dataObj[fieldLast] != null && dataObj[fieldUnit] != null) {
                var tempData = {};

                tempData[fieldTransNo] = dataObj[fieldTransNo];
                tempData[fieldTime] = dataObj[fieldTime];
                tempData[fieldTransAction] = dataObj[fieldTransAction] || "-";
                tempData[fieldLast] = dataObj[fieldLast];
                tempData[fieldUnit] = dataObj[fieldUnit];
                // these assignments seems not necessary (cos will be overwritten evitably)
                tempData[fieldBuyBroker] = dataObj[fieldBuyBroker] || "";
                tempData[fieldSellBroker] = dataObj[fieldSellBroker] || "";

                if (dataObj[fieldBrokerId] != null) {
                    var tempBrokerId = dataObj[fieldBrokerId].split(',');

                    tempData[fieldBuyBroker] = tempBrokerId[1];
                    tempData[fieldSellBroker] = tempBrokerId[3];
                    tempData[fieldAmalgamateBroker] = tempBrokerId[4];
                } else {
                    tempData[fieldBuyBroker] = '-';
                    tempData[fieldSellBroker] = '-';
                    tempData[fieldAmalgamateBroker] = '-';
                }

                // if transno is greater than end number there should be transaction update
                if (parseInt(dataObj[fieldTransNo]) > parseInt(panel.endNumber)) {

                    if (panel.onViewTab == panel.tGrid_Transaction.getId()) {
                        if (panel.tGrid_Transaction.store.getCount() == 0) {
                            panel._procCallTransaction();

                        } else {
                            if (panel._isFirstPage()) {
                                panel.tGrid_Transaction.store.addSorted(Ext.create('TCPlus.model.TransactionRecord', tempData));

                                if (panel.tGrid_Transaction.store.getCount() > parseInt(panel.totalRecord)) {
                                    panel.tGrid_Transaction.store.removeAt(panel.tGrid_Transaction.store.getCount() - 1);
                                }
                            }

                            panel.endNumber = dataObj[fieldTransNo];
                            if (panel.totalRecord < panel.endNumber) {
                                panel.beginNumber += 1;
                            }
                        }
                    }
                }
            }

            if (dataObj[fieldEPS] != null) {
                updateFieldValue(panel.tValue_EPS, parseFloat(dataObj[fieldEPS]).toFixed(3), '-');
                panel.eps = dataObj[fieldEPS];
            }
            if (dataObj[fieldNTA] != null) {
                updateFieldValue(panel.tValue_NTA, parseFloat(dataObj[fieldNTA]).toFixed(3), '-');
            }

            updateFieldValue(panel.tValue_PERatio, dataObj[fieldPERatio], '-');

            var high = dataObj[fieldHigh];
            var low = dataObj[fieldLow];

            if (high != null) {
                panel.high = high;
                helper.setHtml(panel.tValue_HighPrice, getPriceString(high, panel.lacp));
            }
            if (low != null) {
                panel.low = low;
                helper.setHtml(panel.tValue_LowPrice, getPriceString(low, panel.lacp));
            }
            // day spread
            if (high != null || low != null) {
                var daySpread = panel.high - panel.low;

                if (!isNaN(daySpread)) {
                    updateFieldValue(panel.tValue_DaySpread, parseFloat(daySpread).toFixed(3), '-');
                }
            }

            var totalBuyVolumn = dataObj[fieldTotBVol];
            var totalSellVolumn = dataObj[fieldTotSVol];
            var volumn = dataObj[fieldVol];
            var value = dataObj[fieldValue];
            var bRateUpdate = false;
            var buyRate = null;
            if (volumn != null && totalBuyVolumn != null) {
                buyRate = volumn == 0 ? 0 : parseFloat((parseFloat(totalBuyVolumn) / parseFloat(volumn)) * 100).toFixed(2);
            }

            if (totalBuyVolumn != null) {
                panel.bVol = totalBuyVolumn;
                bRateUpdate = true;
            }
            if (volumn != null) {
                panel.vol = volumn;
                bRateUpdate = true;
            }
            if (value != null) {
                panel.val = value;
            }

            if (bRateUpdate) {
                var buyRate = panel.vol == 0 ? 0 : ((panel.bVol / panel.vol) * 100).toFixed(2);
                if (buyRate == 0) {
                    buyRate = '-';
                } else {
                    buyRate += '%';
                }
                helper.setHtml(panel.tValue_BuyRate, buyRate);
            }

            var avgPrice = dataObj[fieldMktAvgPrice];
            if (avgPrice != null) {

                var cssClass = "";
                if (avgPrice == 0 || panel.lacp == 0) {
                    cssClass = N2NCSS.FontUnChange;
                } else if (avgPrice > panel.lacp) {
                    cssClass = N2NCSS.FontUp;
                } else if (avgPrice < panel.lacp) {
                    cssClass = N2NCSS.FontDown;
                } else {
                    cssClass = N2NCSS.FontUnChange;
                }

                helper.setHtml(panel.tValue_MarketAvgPrice, "<label class='" + cssClass + "'> " + getDisplayValue(avgPrice) + " </label>");
            }

            // more fields
            updateFieldValue(panel.tValue_FullName, dataObj[fieldStkFName]);
            updateFieldValue(panel.tValue_Indices, getIndicesName(dataObj[fieldIndexCode], dataObj[fieldSectorCode]));

            var statusObj = getStockStatusObj(dataObj[fieldStatus]);
            updateFieldValue(panel.tValue_Status, statusObj.status);
            updateFieldValue(panel.tValue_DlBasis, statusObj.deliveryBasis);
            updateFieldValue(panel.tValue_FrLimit, statusObj.foreignLimit);

            if (dataObj['pathName']) {
                var sector = getSectorName(dataObj['pathName']);

                if (sector) {
                    panel.sector = sector;
                    panel.updateSector();
                }

                updateFieldValue(panel.tValue_TBoard, getBoardName(dataObj['pathName']));
            }

            if (N2N_CONFIG.subSector) {
                var subSector = dataObj[fieldSubSector];

                if (subSector && subSector !== 'null') {
                    panel.subSector = subSector;
                    panel.updateSector();
                }
            }

            updateFieldValue(panel.tValue_ISIN, dataObj[fieldISIN]);
            if (dataObj[fieldType]) {
                var typeStr = getTypeDescription(dataObj[fieldType]);

                // update suspend status
                if (dataObj[fieldIdssSuspend]) {
                    typeStr = getIdssLabel(typeStr, dataObj[fieldIdssSuspend]);
                }

                updateFieldValue(panel.tValue_Type, typeStr);
            }

            updateFieldValue(panel.tValue_LotSize, dataObj[fieldLotSize], '-', 'qty');
            if (dataObj[fieldShrIssue] > 0) {
                updateFieldValue(panel.tValue_ShIssued, dataObj[fieldShrIssue], '-', 'qty', true);
                var mktCap = getMarketCapital(dataObj[fieldShrIssue], panel.last, panel.lacp);
                if (mktCap) {
                    mktCap = mktCap.toFixed(2);
                    updateFieldValue(panel.tValue_MktCap, mktCap, '-', 'qty', true);
                }
            }

            updateFieldValue(panel.tValue_Value, value, '-', 'qty', true);
            updateFieldValue(panel.tValue_Volumn, volumn, '-', 'qty', true);
            updateFieldValue(panel.tValue_TotalBuyVol, totalBuyVolumn, '-', 'qty', true);
            updateFieldValue(panel.tValue_TotalSellVol, totalSellVolumn, '-', 'qty', true);
            updateFieldValue(panel.tValue_ParValue, dataObj[fieldParValue], '-');
            updateFieldValue(panel.tValue_Ceiling, dataObj[fieldUpLmt], '-');
            updateFieldValue(panel.tValue_Floor, dataObj[fieldLowLmt], '-');
            updateFieldValue(panel.tValue_FrOwnerLimit, dataObj[fieldForeignOwnerLimit], '-', 'qty', true);
            updateFieldValue(panel.tValue_ShortSellVol, dataObj[fieldTotSSVol], '-', 'qty', true);
            updateFieldValue(panel.tValue_BuyTrans, dataObj[fieldBTrans], '-', 'qty', true);
            updateFieldValue(panel.tValue_SellTrans, dataObj[fieldSTrans], '-', 'qty', true);

            if (dataObj[fieldPrev]) {
                helper.setHtml(panel.tValue_PrePrice, getPriceString(dataObj[fieldPrev], panel.lacp));
            }
            if (dataObj[fieldOpen]) {
                helper.setHtml(panel.tValue_OpenPrice, getPriceString(dataObj[fieldOpen], panel.lacp));
            }

            updateFieldValue(panel.tValue_TolTrans, dataObj[fieldTotTrade], '-', 'qty', true);


            var updateFNet = false;
            if (dataObj[fieldFrBuy]) {
                panel.foreignBuy = dataObj[fieldFrBuy];
                updateFieldValue(panel.tValue_FrBuy, panel.foreignBuy, '-', 'qty', true);
                updateFNet = true;
            }

            if (dataObj[fieldFrSell]) {
                panel.foreignSell = dataObj[fieldFrSell];
                updateFieldValue(panel.tValue_FrSell, panel.foreignSell, '-', 'qty', true);
                updateFNet = true;
            }

            if (updateFNet && panel.foreignBuy && panel.foreignSell) {
                // Calculation for net foreign
                var netForeign = panel.foreignBuy - panel.foreignSell;
                updateFieldValue(panel.tValue_NetFr, netForeign, '-', 'qty', true);
            }

            updateFieldValue(panel.tValue_VWAP, dataObj[fieldVWAP], '-');
        
        }
        
        panel._updateMsg06(dataObj);
        panel._updateMsg17(dataObj);
    },
    _updateMsg06: function(dataObj, checkLot) {
    	var me = this;
        
        if (me.isMf) {
            // format date
            var startDate = jsutil.formatDate(dataObj[fieldStartDate_06]);
            
            updateFieldValue(me.tValue_StartDate, startDate, '-');
            
        } else {
            var high52 = dataObj[field52WHigh_06];
            var low52 = dataObj[field52WLow_06];

            if (high52 != null) {
                me.high52 = high52;
                helper.setHtml(me.tValue_52WkHigh, getPriceString(high52, me.lacp));
            }
            if (low52 != null) {
                me.low52 = low52;
                helper.setHtml(me.tValue_52WkLow, getPriceString(low52, me.lacp));
            }

            // 52 weeks spread
            if (high52 != null || low52 != null) {
                var spread52 = me.high52 - me.low52;
                if (!isNaN(spread52)) {
                    updateFieldValue(me.tValue_52WkSpread, parseFloat(spread52).toFixed(3), '-');
                }
            }

            updateFieldValue(me.tValue_FrShare, dataObj[fieldForeignShares_06], '-', 'qty', true);
            updateFieldValue(me.tValue_Fluactation, dataObj[fieldFluactation_06], '-', 'qty', true);
            updateFieldValue(me.tValue_FloatFree, dataObj[fieldFloatFree_06], '-', 'qty', true);        

            if (checkLot && global_displayUnit.toLowerCase() == 'lot' && dataObj[fieldIDSSTolVol_06] && me.lotSize > 0) {
                dataObj[fieldIDSSTolVol_06] /= me.lotSize;
            }

            //IDSS info
            updateFieldValue(me.tValue_IDSSTolVol, dataObj[fieldIDSSTolVol_06], '-', 'qty', true);
            updateFieldValue(me.tValue_IDSSTolVal, dataObj[fieldIDSSTolVal_06], '-', 'qty', true);
        }          
    },
    _updateMsg17: function(dataObj) {
        var me = this;
        
        if (me.isMf) {
            updateFieldValue(me.tValue_MinInvest, dataObj[fieldMinInvestment], '-', 'qty');
            updateFieldValue(me.tValue_MinAddInvest, dataObj[fieldMinAdditionalSub], '-', 'qty');
            updateFieldValue(me.tValue_MinRedQty, dataObj[fieldMinRedemptionQty], '-', 'qty');
            updateFieldValue(me.tValue_MinHoldPeriod, dataObj[fieldMinHoldingDays], '-');
            updateFieldValue(me.tValue_MgtFee, dataObj[fieldManagementFee], '-');
            updateFieldValue(me.tValue_EarlyRedFee, dataObj[fieldEarlyRedemptionFee], '-');
            me.tValue_RiskRate.setRate(dataObj[fieldRiskRate]);
            updateFieldValue(me.tValue_FundType, dataObj[fieldFundType], '-');
            updateFieldValue(me.tValue_FundIssuer, dataObj[fieldFundIssuerName], '-');

        } else {

            var weekHigh = dataObj[field17WeekHigh];
            var weekLow = dataObj[field17WeekLow];
            var monthHigh = dataObj[field17MonthHigh];
            var monthLow = dataObj[field17MonthLow];
            //var high52 = dataObj[field17High52];
            //var low52 = dataObj[field17Low52];

            if (weekHigh != null) {
                helper.setHtml(me.tValue_WkHigh, getPriceString(weekHigh, me.lacp));
            }
            if (weekLow != null) {
                helper.setHtml(me.tValue_WkLow, getPriceString(weekLow, me.lacp));
            }
            if (monthHigh != null) {
                helper.setHtml(me.tValue_MonthHigh, getPriceString(monthHigh, me.lacp));
            }
            if (monthLow != null) {
                helper.setHtml(me.tValue_MonthLow, getPriceString(monthLow, me.lacp));
            }
            /*
            if (high52 != null) {
                me.high52 = high52;
                helper.setHtml(me.tValue_52WkHigh, getPriceString(high52, me.lacp));
            }
            if (low52 != null) {
                me.low52 = low52;
                helper.setHtml(me.tValue_52WkLow, getPriceString(low52, me.lacp));
            }


            // 52 weeks spread
            if (high52 != null || low52 != null) {
                var spread52 = me.high52 - me.low52;
                if (!isNaN(spread52)) {
                    updateFieldValue(me.tValue_52WkSpread, parseFloat(spread52).toFixed(3), '-');
                }
            }
            */
        }
    },    
    /**
     * Description <br/>
     * 
     * 		update transaction grid panel record
     * 
     * @param {array<json / object>}	dataObj
     */
    _updateTransaction: function(dataObj) {
        var panel = this;

        panel.tGrid_Transaction.store.loadData(dataObj);
    },
    /**
     * Description <br/>
     * 
     * 		update business done grid panel record
     * 
     * @param {array<json / object>}	dataObj
     */
    _updateBusinessDone: function(dataObj, isBsChart) {
        var panel = this;

        if (isBsChart) {
            var sellDataObj = [];
            var buyDataObj = [];
            var totalDataObj = [];
            var dataIndexSell = "3";
            var dataIndexBuy = "2";
            var sellObj = Object.create(dataObj);
            var buyObj = Object.create(dataObj);
            var totalObj = Object.create(dataObj);

            if (dataObj.length > 5) {

                var sort_by = function(field, reverse, primer) {

                    var key = primer ?
                            function(x) {
                                return primer(x[field]);
                            } :
                            function(x) {
                                return x[field];
                            };

                    reverse = [-1, 1][+!!reverse];

                    return function(a, b) {
                        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
                    };

                };
                var sell = sellObj.sort(sort_by(dataIndexSell, false, parseFloat));
                var buy = buyObj.sort(sort_by(dataIndexBuy, false, parseFloat));
                var total = totalObj.sort(sort_by("4", false, parseFloat));
                var sellOther = 0;
                var buyOther = 0;
                var totalOther = 0;
                var sumOther = true;
                for (var i = 0; i < dataObj.length; i++) {
                    if (i <= 4 || (dataObj.length - i == 1 && i == 5)) {
                        sellDataObj.push(sell[i]);
                        buyDataObj.push(buy[i]);
                        totalDataObj.push(total[i]);
                        if (dataObj.length - i == 1 && i == 5) {
                            sumOther = false;
                            break;
                        }

                    } else {

                        sellOther += parseInt(sell[i][dataIndexSell]);
                        buyOther += parseInt(buy[i][dataIndexBuy]);
                        totalOther += parseInt(total[i]["4"]);
                    }
                }
                if (sumOther) {
                    sellDataObj.push({"1": languageFormat.getLanguage(11136, "Other"),
                        "2": sellOther.toString(),
                        "3": sellOther.toString()
                    });
                    buyDataObj.push({
                        "1": languageFormat.getLanguage(11136, "Other"),
                        "2": buyOther.toString(),
                        "3": buyOther.toString()
                    });
                    totalDataObj.push({
                        "1": languageFormat.getLanguage(11136, "Other"),
                        "4": totalOther.toString()
                    });
                }
            } else {
                sellDataObj = dataObj;
                buyDataObj = dataObj;
                totalDataObj = dataObj;
            }

            panel.buyStore.loadData(buyDataObj);
            panel.sellStore.loadData(sellDataObj);
            panel.totalStore.loadData(totalDataObj);
            
            panel.compRef.bsStore.loadData(dataObj);
            
            if (!panel.tTabPanel_ChartPanel.setActiveTab(panel.activeChartTabIndex)) {
                panel.activateChartCall();
            }
        } else {
            
            if (dataObj.length === 0) {
                helper.setGridEmptyText(panel.tGrid_BusinessDone, panel.emptyMsg);
            }else{
                panel.tGrid_BusinessDone.store.loadData(dataObj);
            }
        }

    },
    /**
     * Description <br/>
     * 
     * 		update search grid panel record
     * 
     * @param {array<json / object>}	dataObj
     */
    _updateSearchStock: function(dataObj) {
        var panel = this;

        panel.tGrid_searchGrid.store.loadData(dataObj);
    },
    /**
     * Description <br/>
     * 
     * 		process search result on click 
     * 
     * @param {object}  record
     */
    _procClickSearchRecord: function(record) {
        var panel = this;
        
        panel.tField_Search.setValue("");
        if (!N2N_CONFIG.searchAutoComplete) {
            panel.tPanel_mainPanel.show();

            panel.tGrid_searchGrid.hide();
            panel.tButton_back.hide();
        }

        if (record != null) {
            panel.oldKey = panel.key;
            panel.stkcode = record.data[fieldStkCode];
            panel.key = panel.stkcode;
            panel.stkname = record.data[fieldStkName];
            panel.endNumber = record.data[fieldTransNo];
            panel.totalNumber = record.data[fieldTransNo];

            panel.procCallTitle();
            
            if (N2N_CONFIG.syncSibling) {
                syncGroupManager.syncAllComps(panel, panel.stkcode, panel.stkname);
            }            
        }
    },
    /**
     * Description <br/>
     * 
     * @param {object} 		dataObj
     * @param {integer/ string} dataRecordNumber
     * 
     */
    _procPagingButton: function(dataObj, dataRecordNumber) { // TODO
        var panel = this;

        // if (!stockutil.isDelayStock(panel.stkcode)) {
            var newRecordObj = Storage.returnRecord(panel.stkcode);
            panel.totalNumber = parseInt(newRecordObj[fieldTransNo]);
            panel.beginNumber = parseInt(dataObj.beginNumber);
            panel.endNumber = parseInt(dataObj.endNumber);
            panel.totalRecord = dataObj.totalCount;

            // block previous and first button
            if (panel.totalNumber == panel.endNumber) {
                panel.tButton_Previous.setDisabled(true);
                panel.tButton_First.setDisabled(true);

                if (panel.totalNumber > panel.totalRecord) {
                    panel.tButton_Next.setDisabled(false);
                    panel.tButton_Last.setDisabled(false);

                } else {
                    panel.tButton_Next.setDisabled(true);
                    panel.tButton_Last.setDisabled(true);

                }

                // block next and last button 
            } else if (panel.beginNumber == 0 || panel.beginNumber == 1) {
                panel.tButton_Next.setDisabled(true);
                panel.tButton_Last.setDisabled(true);

                if (panel.totalNumber < panel.totalRecord) {
                    panel.tButton_Previous.setDisabled(true);
                    panel.tButton_First.setDisabled(true);

                } else {
                    panel.tButton_Previous.setDisabled(false);
                    panel.tButton_First.setDisabled(false);
                }

                // open all button	
            } else {
                panel.tButton_Next.setDisabled(false);
                panel.tButton_Previous.setDisabled(false);
                panel.tButton_First.setDisabled(false);
                panel.tButton_Last.setDisabled(false);

            }
//        } else {
//            var lastPage = panel._getLastPage();
//            // First page
//            if (panel.page == 0) {
//                panel.tButton_First.setDisabled(true);
//                panel.tButton_Previous.setDisabled(true);
//            } else {
//                panel.tButton_First.setDisabled(false);
//                panel.tButton_Previous.setDisabled(false);
//            }
//
//            if (panel.page == lastPage) {
//                panel.tButton_Next.setDisabled(true);
//                panel.tButton_Last.setDisabled(true);
//            } else {
//                panel.tButton_Next.setDisabled(false);
//                panel.tButton_Last.setDisabled(false);
//            }
//        }
    },
    /**
     * Description <br/>
     * 
     * 		clear all grid panel / return to default value 
     */
    _procCleanAllPanel: function() {
        var panel = this;

        panel.tGrid_BusinessDone.store.removeAll();
        panel.tGrid_Transaction.store.removeAll();
        panel.tGrid_searchGrid.store.removeAll();
        panel.buyStore.removeAll();
        panel.sellStore.removeAll();
        panel.totalStore.removeAll();
        helper.setHtml(panel.tValue_UpDown, '');

        resetFieldValues([
            panel.tValue_stockName,
            panel.tValue_Last,
            panel.tValue_change,
            panel.tValue_changePer,
            panel.tValue_Status,
            panel.tValue_Indices,
            panel.tValue_TBoard,
            panel.tValue_Sector,
            panel.tValue_ISIN,
            panel.tValue_LotSize,
            panel.tValue_ShIssued,
            panel.tValue_MktCap,
            panel.tValue_ParValue,
            panel.tValue_Ceiling,
            panel.tValue_Floor,
            panel.tValue_DlBasis,
            panel.tValue_FrLimit,
            panel.tValue_FrOwnerLimit,
            panel.tValue_Value,
            panel.tValue_Volumn,
            panel.tValue_BuyRate,
            panel.tValue_TotalBuyVol,
            panel.tValue_TotalSellVol,
            panel.tValue_ShortSellVol,
            panel.tValue_BuyTrans,
            panel.tValue_SellTrans,
            panel.tValue_LACP,
            panel.tValue_HighPrice,
            panel.tValue_LowPrice,
            panel.tValue_MarketAvgPrice,
            panel.tValue_PERatio,
            panel.tValue_WkHigh,
            panel.tValue_WkLow,
            panel.tValue_MonthHigh,
            panel.tValue_MonthLow,
            panel.tValue_52WkHigh,
            panel.tValue_52WkLow,
            panel.tValue_DaySpread,
            panel.tValue_52WkSpread,
            panel.tValue_IDSSTolVol,
            panel.tValue_IDSSTolVal,
            panel.tValue_Type
        ]);
        
        if (panel.isMf) {
            resetFieldValues([
                panel.tValue_FundName,
                panel.tValue_FundCode,
                panel.tValue_NAVPS,
                panel.tValue_Currency,
                panel.tValue_StartDate,
                panel.tValue_FundSize,
                panel.tValue_MinInvest,
                panel.tValue_MinAddInvest,
                panel.tValue_MinRedQty,
                panel.tValue_MinHoldPeriod,
                panel.tValue_MgtFee,
                panel.tValue_EarlyRedFee,
                panel.tValue_FundType,
                panel.tValue_FundIssuer
            ]);

            panel.tValue_RiskRate.setRate();

        }
        
        resetFieldValues([
            panel.tValue_EPS,
            panel.tValue_NTA
        ], '0.000');
        
        panel.beginNumber = 0;
        panel.endNumber = 0;
        panel.eventType = '';
        
        panel.lacp = null;
        panel.last = null;
        panel.eps = null;
        panel.bVol = null;
        panel.vol = null;
        panel.val = null;
        panel.high = null;
        panel.low = null;
        panel.high52 = null;
        panel.low52 = null;
        
        panel.lotSize = null;
        panel.sector = null;
        panel.subSector = null;
    },
    /** 
     * Description <br/>
     * 
     * 
     * 		return number format
     * 
     * 
     * @param {string/integer} 	value
     * value to convert format
     * 
     * @param {integer}			columnWidth
     */
    _returnNumberFormat: function(value, columnWidth) {
        var panel = this;

        if (viewInLotMode) {
            value = formatutils.formatNumberLot(value);

        } else {
            value = formatutils.formatNumber(value, columnWidth);

        }

        return value;
    },
    /**
     * Description <br/>
     * 
     * 		return field list
     * 
     * @return {array<string>}
     */
    getFieldList: function() {
        var panel = this;

        if (panel.isMf) {
            return [
                fieldStkCode,
                fieldStkName,
                fieldLast,
                fieldLacp,
                fieldCurrency,
                fieldFundSize
            ];
        } else {
            return [
                fieldStkCode,
                fieldStkName,
                fieldStkFName,
                fieldStatus,
                fieldStkStatus,
                fieldIndexCode,
                fieldSectorCode,
                fieldSectorName,
                fieldISIN,
                fieldLotSize,
                fieldLowLmt,
                fieldParValue,
                fieldValue,
                fieldUpLmt,
                fieldShrIssue, //

                fieldVol,
                fieldTotBVol,
                fieldTotSVol,
                fieldTotSSVol,
                fieldBTrans,
                fieldSTrans,
                fieldLast,
                fieldLacp,
                fieldBuy,
                fieldSell,
                fieldHigh,
                fieldLow,
                fieldNTA,
                fieldEPS,
                fieldPERatio, //

                fieldTime,
                fieldTransNo,
                fieldUnit,
                fieldPrev,
                fieldOpen,
                fieldTotTrade,
                fieldFrBuy,
                fieldFrSell,
                fieldType,
                fieldIDSSTolVol_06,
                fieldIDSSTolVal_06,
                'pathName',
                fieldSubSector,
                fieldIdssSuspend,
                fieldTransAction
            ];
        }

    },
    // to display stacked column chart
    _createStackedColumnChart: function(chartTitle, showLegend) {
    	var panel = this;
    	var bsStore = this.compRef.bsStore;
    	if (bsStore.getCount() == 0) {
			chartTitle = languageFormat.getLanguage(30902, 'Chart Not Available.');
			var title = Ext.create('Ext.form.Label', {
				text : chartTitle,
				x : '45%',
				style : {
					position : 'relative'
				}
			});
			return title;
        }
    	if (showLegend) {
            showLegend = {
                position: 'bottom',
                boxFill: 'transparent'
            };
        }
    	
    	// sort the store based on the stock price
        bsStore.sort('1','ASC');
       
        // var colors = ['#10b210', '#ed1414'];       
        var colors = ['#ed1414', '#10b210'];
        
        if (panel.exch === 'PH') {
            colors = ['#10b210', '#ed1414'];
        }
    
        // Set the color by using theme   
        Ext.chart.theme.MyCustomChartTheme = Ext.extend(Ext.chart.theme.Base, {
        	constructor : function (config) {
        		
        		this.callParent([Ext.apply({
                    axisLabelLeft: {
                        font: '12px'
                    },
                    colors: colors
                }, config)]);
        	}
        });
        
		var stackedColumnCharts = new Ext.chart.Chart({
			title: chartTitle,
			animate: true,
            store: bsStore,
            insetPadding: 15,
            minHeight: 200,
            minWidth: 200,
            cls: "stacked-column-charts",
            theme: 'MyCustomChartTheme',
            legend: showLegend,
            axes: [{
                type: 'numeric',
                position: 'left',
                fields: ['2', '3'],
                title: languageFormat.getLanguage(11008, 'Volume'),
                labelTitle: {font: 'bold 16px'},
                grid: true,
                label: {
                    renderer: function(v) {
                        return formatutils.formatNumberLot(v);
                    }
                },
                roundToDecimal: false
            }, {
                type: 'category',
                position: 'bottom',
                fields: ['1'],
                title: languageFormat.getLanguage(10942, 'Price'),
                labelTitle: {font: 'bold 16px'}
            }],
		    series: [{
		    	showInLegend: true,
				type: 'column',
				axis: 'bottom',
				gutter: 40,
				xField: '1',
				yField: [ '2', '3'],
                                title: [languageFormat.getLanguage(10001, 'Buy'), languageFormat.getLanguage(10002, 'Sell')],
				stacked: true,
				tips: {
					trackMouse: true,
                                        autoHide: false,
                                        renderer: function(storeItem, item) {
                                            if (item.value) {
                                                var price = item.value[0] || 0;
                                                var vol = item.value[1] || 0;
                                                var action = item.yField == 2 ? languageFormat.getLanguage(10001, 'Buy') : languageFormat.getLanguage(10002, 'Sell');

                                                var tip = action + ' ' + formatutils.formatNumberLot(vol) + ' @ ' + formatutils.formatNumber(price) + 
                                                        '<br/>' + languageFormat.getLanguage(11035, 'Total') + ' ' + formatutils.formatNumberLot(storeItem.get(4) || 0);
                                                this.setHtml(tip);
                                            }
                                        }
				}
			}
			],
			items: [ {
				type: 'text',
				text: chartTitle + " (" + languageFormat.getLanguage(10942, 'Price') + ")",
				width: 150,
				height: 30,
				x: '45%',
				y: 10
			} ]
		});	  
		
		return stackedColumnCharts;
    },
    _createBusinessDoneChart: function(chartTitle, dataField, showLegend) {
        var panel = this;
        var bsStore;
        if (chartTitle == languageFormat.getLanguage(10001, 'Buy')) {
            bsStore = this.buyStore;
        } else if (chartTitle == languageFormat.getLanguage(10002, 'Sell')) {
            bsStore = this.sellStore;
        } else if (chartTitle == languageFormat.getLanguage(11035, 'Total')) {
            bsStore = this.totalStore;
        }
        if (bsStore.getCount() == 0) {
            //chartTitle = languageFormat.getLanguage(30902, 'Chart Not Available.');
            if (bsStore.getCount() == 0) {
    			chartTitle = languageFormat.getLanguage(30902, 'Chart Not Available.');
    			var labelchart = global_personalizationTheme.indexOf("black") == -1 ? "black" : "white";
    			var title = Ext.create('Ext.form.Label', {
    				//text : chartTitle,
    				fill : labelchart,
    				x : '45%',
    				style : {
    					position : 'relative'
    				}
    			});
    			return title;
            }
        }
        if (showLegend) {
            showLegend = {
                position: 'bottom'
            };
        }
        var labelchart = global_personalizationTheme.indexOf("black") == -1 ? "black" : "white";

        var tMargin = 44;
        var ctStyle = '';
        if (panel._piesAsTab) {
            ctStyle = 'margin-right:15px'; // left for scrollbar to avoid both scrollbars
        }
        
        
        var pieHeight = panel.compRef.bsPieChartsPanel.el ? (panel.compRef.bsPieChartsPanel.getHeight() - tMargin) : 200;
        var pieWidth = panel.compRef.bsPieChartsPanel.el ? panel.compRef.bsPieChartsPanel.getWidth() : 200;
        
        var bsCt = Ext.create('Ext.chart.Chart', {
        	title: chartTitle,
        	columnWidth: 0.32,
        	height: pieHeight,
        	width: pieWidth,
        	minHeight: 200,
        	//maxHeight: 250,
        	minWidth: 200,
        	animate: true,
        	store: bsStore,
        	shadow: false,
        	legend: showLegend,
        	insetPadding: 12,
        	theme: 'Base:gradients',
        	style: ctStyle,
        	series: [{
        		type: 'pie',
        		angleField: dataField,
        		showInLegend: true,
        		donut: false,
        		tips: {
        			trackMouse: true,
        			width: 175,
        			height: 25,
        			renderer: function(storeItem, item) {
        				// Calculate percentage
        				var total = 0;
        				bsStore.each(function(rec) {
        					total += rec.get(dataField);
        				});

        				var per = storeItem.get(dataField) / total * 100;
        				var perTxt = Ext.util.Format.number(per, '0.00');
        				var value = Ext.util.Format.number(storeItem.get(dataField), '0,000');
        				var price = storeItem.get("1");
        				this.setTitle(price + " = " + perTxt + ' % (' + value + ')');
        			}
        		},
        		highlight: {
        			segment: {
        				margin: 20
        			}
        		},
        		label: {
        			field: '1',
        			display: 'middle',
        			contrast: true
        		}
        	}]
        });
        
        return bsCt;
    },
    
    createTitle: function(chartTitle){
    	var panel = this;
    	//var titleWidth = panel.compRef.bsPieChartsPanel.el ? panel.compRef.bsPieChartsPanel.getWidth() : 200;
    	var bsStore = this.totalStore;
    	var titleText;
    	if (bsStore.getCount() == 0) {
            chartTitle = languageFormat.getLanguage(30902, 'Chart Not Available.');
            titleText = chartTitle;
        } else {
        	titleText = chartTitle + " (" + languageFormat.getLanguage(10942, 'Price') + ")";
        }
    	
		 var labelchart = global_personalizationTheme.indexOf("black") == -1 ? "black" : "white";
		 var title = Ext.create('Ext.form.Label', {
			 text: titleText,
			 fill: labelchart,
			 x: '45%',
			 style: {
                 cls: 'chart-title',
                 position: 'relative'
             }
		 });
		 return title;
    },
    
    _getLastPage: function() {
        var me = this;
        return Math.floor(me.totalNumber / me.transCount);
    },
    _isFirstPage: function() {
        return this.eventType == 'refresh' || this.eventType == 'first' || this.eventType == '' || this.eventType == 0;
    },
    startTrackerPullTimer: function() {
        var panel = this;
        if (trackerUpdate.length > 0) {
            if (panel.trackerPullTimer == null) {
                panel.trackerPullTimer = setTimeout(function() {
                    panel.beginNumber = 0;
                    panel.endNumber = 0;
                    panel.totalNumber = 0;
                    panel.totalRecord = 0;
                    panel._procCallTransaction();
                }, trackerPullInterval);
            }
        }
    },
    stopTrackerPullTimer: function() {
        var panel = this;
        if (panel.trackerPullTimer != null) {
            clearTimeout(panel.trackerPullTimer);
            panel.trackerPullTimer = null;
        }
    },
    _isEmptyStock: function() {
        var me = this;

        return jsutil.isEmpty(me.stkcode) || jsutil.isEmpty(me.stkname);
    },
    _getChartUrl: function() {
        var panel = this;
     // Removes delayed exchange suffix. Determine whether exchange is delayed based on param 'View'
        var nonDelayCode = stockutil.removeStockDelay(panel.stkcode);
        var stockParts = stockutil.getStockParts(nonDelayCode);
        //var stockParts = stockutil.getStockParts(panel.stkcode);
        var stkname = htmlDecode(stockutil.getStockName(panel.stkname));
        var chartMode = panel._chartType === 'h' ? 'h' : 'd';
        
        if (panel.isMf) {
            chartMode = 'h';
        }

        return helper.addUrlParams(embeddedStockChartURL, "code=" + stockParts.code + '&Name=' + encodeURIComponent(stkname) + "&exchg=" + stockParts.exch + "&mode=" + chartMode + "&color=" 
        		+ formatutils.procThemeColor() + '&lang=' + global_Language + '&View=' + (stockutil.isDelayStock(panel.stkcode) ? 'D' : 'R')
                        + '&type=tr&newOpen=' + (jsutil.boolToStr(panel.newOpen, '1', '0'))) + '&loginId=' + md5UniqueLoginId;
    },
    autoAdjustWidth: function() {
        var panel = this;
        // recreates col states
        panel.createColStates();
        
        helper.runBufferedView(panel.tGrid_Transaction, 'bfTSCol', function() {
            panel.resetTSCol();
        });
        helper.runBufferedView(panel.tGrid_BusinessDone, 'bfBSCol', function() {
            panel.resetBSCol();
        });

        panel.runAutoAdjustWidth = false;

    },
    resetTSCol: function() {
        var panel = this;
        var cols = panel.createTransactionColumns();

        if (cols) {
            panel.tGrid_Transaction.reconfigure(null, cols.items);
        }
    },
    resetBSCol: function() {
        var panel = this;
        var cols = panel.createBusinessDoneColumns();
        
        if (cols) {
            panel.tGrid_BusinessDone.reconfigure(null, cols.items);
        }
    },
    forceRefresh: function() {
    	var panel = this;

    	helper.runBufferedView(panel, 'trRefresh', function() {
    		var tabPanel = panel.tTabPanel_Panel.getActiveTab();

    		var isBsChart = !isMobile && tabPanel.getItemId() == 'bsCharts';
    		if (tabPanel.title == panel.tGrid_BusinessDone.title || isBsChart) {
    			panel._procCallBusinessDone(isBsChart);
    		} else if (tabPanel.title == panel.tGrid_Transaction.title) {
    			panel._procCallTransaction();
    		}
    	});
    },
    refreshScreen: true,
    switchRefresh: function() {
        var me = this;

        helper.runBuffer('trRefresh');

        if (me._needReload) {
            me._needReload = false;
            me.procCallTitle();
        }
    },
    refreshEmpty: function() {
    	var me = this;

    	if (!me.key) {
    		menuHandler.tracker();
    	}
    },
    getMsg06: function(){
        var panel = this;
        var cols = [fieldStkCode, field52WHigh_06, field52WLow_06, fieldFluactation_06, fieldFloatFree_06, fieldForeignShares_06, fieldIDSSTolVol_06, fieldIDSSTolVal_06];
        
        if (panel.isMf) {
            cols = [fieldStkCode, fieldStartDate_06];
        }
        
        var fcols = stockutil.filterCols(cols);
        conn.getStockInfo06({
            rType: 'tr_06',
            f: fcols.col06,
            k: panel.stkcode,
            success: function(obj) {
                try {
                    var data = {};
                    if (obj.s && obj.c > 0) {
                        var data = obj.d[0];
                    }
                    
                    panel._updateMsg06(data, true);
                    conn.subscribeStockInfo06(panel.stkcode, fcols.col06);

                } catch (e) {
                    console.log('[Tracker][getMsg06] Exception ---> ' + e);
                }
            }
        });
    },
    getMsg17: function() {
        var panel = this;
        var cols = [fieldStkCode, field17WeekHigh, field17WeekLow, field17MonthHigh, field17MonthLow, field17High52, field17Low52];
        
        if (panel.isMf) {
            cols = [
                fieldStkCode,
                fieldMinInvestment,
                fieldMinAdditionalSub,
                fieldMinRedemptionQty,
                fieldMinHoldingDays,
                fieldManagementFee,
                fieldEarlyRedemptionFee,
                fieldFundType,
                fieldFundIssuerName,
                fieldRiskRate];
        }
        
        var scrEnabled = theScreenerURL.length > 0;

        if (scrEnabled) {
            cols.push(field17Ratings, field17BRisk);
        }

        conn.getFundamentalInfo({
            rType: 'tr_fund',
            f: cols,
            k: panel.stkcode,
            success: function(obj) {
                try {
                    var data = {};
                    if (obj.s && obj.c > 0) {
                        var data = obj.d[0];
                    }

                    if (scrEnabled) {
                        var ratings = data[field17Ratings];
                        var brisk = data[field17BRisk];

                        if (ratings) {
                            panel.tValue_Rating.show();

                            var imgSrc = panel.getImgRating(ratings);
                            var imageURL = '<div class="' + imgSrc + '" onclick="n2ncomponents.openTheScreener(\'' + panel.stkcode + '\')" ></div>';
                            helper.setHtml(panel.tValue_Rating, imageURL);
                        } else {
                            panel.tValue_Rating.hide();
                        }

                        if (brisk) {
                            panel.tValue_BRisk.show();

                            var imgSrc = panel.getImgBRisk(brisk);
                            var imageURL = '<div class="' + imgSrc + '" onclick="n2ncomponents.openTheScreener(\'' + panel.stkcode + '\')" ></div>';
                            helper.setHtml(panel.tValue_BRisk, imageURL);
                        } else {
                            panel.tValue_BRisk.hide();
                        }
                    }

                    panel._updateMsg17(data);
                    conn.subscribeFundamental(panel.stkcode, cols);

                } catch (e) {
                    console.log('[Tracker][callFundamentalInfo] Exception ---> ' + e);
                }
            }
        });
    },
    getImgRating: function(data) {
        var imgSrc = '';

        switch (data) {
            case '0':
                imgSrc = 'img-rate img-rate0';
                break;
            case '1':
                imgSrc = 'img-rate img-rate1';
                break;
            case '2':
                imgSrc = 'img-rate img-rate2';
                break;
            case '3':
                imgSrc = 'img-rate img-rate3';
                break;
            case '4':
                imgSrc = 'img-rate img-rate4';
                break;

        }

        return imgSrc;
    },
    getImgBRisk: function(data) {
        var imgSrc = '';
        
        switch (data) {
            case '-1':
                imgSrc = 'img-risk img-risk-high';
                break;
            case '0':
                imgSrc = 'img-risk img-risk-medium';
                break;
            case '1':
                imgSrc = 'img-risk img-risk-low';
                break;
        }

        return imgSrc;
    },
    getIBillionaire: function(){
    	var panel = this;
    	if (N2N_CONFIG.iBillionaireURL.length > 0 && N2N_CONFIG.IBExchanges.length > 0) {
    		var ibExchList = N2N_CONFIG.IBExchanges.split(',');
    		var stkEx = stockutil.getExchange(panel.stkcode);
    		panel.tValue_IBillionaire.hide();
    		
    		for(var i=0; i<ibExchList.length; i++){
    			if(ibExchList[i] == stkEx){
    	            var imgSrc = 'ibillionaire img-ibill';
    	            var imageURL = '<div class="' + imgSrc + '" onclick="n2ncomponents.openIBillionaire(\'' + panel.stkcode + '\')" ></div>';
    	            helper.setHtml(panel.tValue_IBillionaire, imageURL);
    	            panel.tValue_IBillionaire.show();
    	            
    	            break;
    			}
    		}
        } else {
            panel.tValue_IBillionaire.hide();
        }
    },
    forceReloadChart: function() {
        var me = this;

        sessionStorage.removeItem('trackerChart');
        if (helper.inView(me.tPanel_GraphPanel)) {
            me._procCallChart();
        }

    },
    _updateTitle: function() {
        var me = this;
        var stkName = stockutil.getStockPart(me.stkname);

        var newTitle = languageFormat.getLanguage(20095, 'Tracker') + ' - ' + stkName;
        n2nLayoutManager.updateTitle(me, newTitle);
        n2nLayoutManager.updateKey(me);
    },
    setCode: function(stkcode, stkname) {
        var me = this;

        if (me.key) {
            me.oldKey = me.key;
        }

        me.key = stkcode;
        me.stkcode = stkcode;
        me.stkname = stkname;
        me.exch = stockutil.getExchange(stkcode);
        me.isMf = isMf(me.exch);

    },
    syncBuffer: function(stkcode, stkname) {
        var me = this;

        // update key and title
        me.setCode(stkcode, stkname);
        me._updateTitle();

        me._needReload = true;

    },
    setChartStatus: function() {
        var me = this;

        if (isStockChart && me.tPanel_GraphPanel && me.newOpen) {
            me.newOpen = false;
            var newUrl = updateQueryStringParameter(me.tPanel_GraphPanel.iframeURL, 'newOpen', '0');
            me.tPanel_GraphPanel.refresh(newUrl);
        }
    },
    focusSearchBox: function() {
        var me = this;

        focusManager.focusSearchbox(me.tField_Search);
    },
    goFirstPage: function() {
        var panel = this;

        if (panel.tButton_First.isHidden() || panel.tButton_First.isDisabled()) {
            return;
        }

        panel.stopTrackerPullTimer();
        panel.beginNumber = 0;
        panel.endNumber = 0;
        panel.totalNumber = 0;
        panel.totalRecord = 0;
        panel.page = 0;

        panel.eventType = "first";
        panel._procCallTransaction();
    },
    goPrevPage: function() {
        var panel = this;

        if (panel.tButton_Previous.isHidden() || panel.tButton_Previous.isDisabled()) {
            return;
        }

        panel.stopTrackerPullTimer();
        panel.eventType = "prev";
        if (panel.page > 0) {
            panel.page = panel.page - 1;
        }
        panel._procCallTransaction();
    },
    goNextPage: function() {
        var panel = this;

        if (panel.tButton_Next.isHidden() || panel.tButton_Next.isDisabled()) {
            return;
        }

        panel.stopTrackerPullTimer();
        panel.eventType = "next";
        if (panel.page < panel._getLastPage()) {
            panel.page = panel.page + 1;
        }
        panel._procCallTransaction();
    },
    goLastPage: function() {
        var panel = this;

        if (panel.tButton_Last.isHidden() || panel.tButton_Last.isDisabled()) {
            return;
        }

        panel.stopTrackerPullTimer();
        panel.eventType = "last";
        panel.page = panel._getLastPage();
        panel._procCallTransaction();
    },
    getConfigItems: function() {
        var panel = this;
        var stkInfoLeft = [];
        var stkInfoRight = [];

        var fids = N2N_CONFIG.trackerInfoFid;
        if (panel.isMf) {
            fids = N2N_CONFIG.trackerInfoMfFid;
            stkInfoLeft.push(panel.tLabel_FundName, panel.tValue_FundName);
        } else {
            // these items are always enabled and at the top
            // full name
            stkInfoLeft.push(panel.tLabel_FullName, panel.tValue_FullName);
        }

        if (fids) {
            var configArr = fids.split('{');
            if (configArr.length > 0) {

                // read first config
                if (configArr[0]) {
                    var confArrLeft = configArr[0].split(',');
                    for (var i = 0; i < confArrLeft.length; i++) {
                        var el = panel.getConfElements(confArrLeft[i].trim());
                        if (el) {
                            stkInfoLeft.push(el[0], el[1]);
                        }
                    }
                }

                // check configArr[1]
                if (configArr[1]) {
                    var confArrRight = configArr[1].split(',');
                    for (var i = 0; i < confArrRight.length; i++) {
                        var el = panel.getConfElements(confArrRight[i].trim());
                        if (el) {
                            stkInfoRight.push(el[0], el[1]);
                        }
                    }
                }
            }
        }

        return {
            stkInfoLeft: stkInfoLeft,
            stkInfoRight: stkInfoRight
        };
    },
    getConfElements: function(fid) {
        var panel = this;

        switch (fid) {
            //for stock info at left side
            // status
            case 'status':
                return [panel.tLabel_Status, panel.tValue_Status];
                //indices
            case 'indices':
                return [panel.tLabel_Indices, panel.tValue_Indices];
                //trading board
            case 'tboard':
                return [panel.tLabel_TBoard, panel.tValue_TBoard];
                //sector
            case 'sector':
                return [panel.tLabel_Sector, panel.tValue_Sector];
                //ISIN
            case 'isin':
                return [panel.tLabel_ISIN, panel.tValue_ISIN];
                //Lot size
            case 'lotsize':
                return [panel.tLabel_LotSize, panel.tValue_LotSize];
                //Shares issued
            case 'shissued':
                return [panel.tLabel_ShIssued, panel.tValue_ShIssued];
                //market capital
            case 'mktcap':
                return [panel.tLabel_MktCap, panel.tValue_MktCap];
                //Par value
            case 'parvalue':
                return [panel.tLabel_ParValue, panel.tValue_ParValue];
                //Ceiling
            case 'ceiling':
                return [panel.tLabel_Ceiling, panel.tValue_Ceiling];
                //Floor
            case 'floor':
                return [panel.tLabel_Floor, panel.tValue_Floor];
                //Delivery basis
            case 'dlbasis':
                return [panel.tLabel_DlBasis, panel.tValue_DlBasis];
                //Foreign limit
            case 'frlimit':
                return [panel.tLabel_FrLimit, panel.tValue_FrLimit];
                //Foreign ownership limit
            case 'frolimit':
                return [panel.tLabel_FrOwnerLimit, panel.tValue_FrOwnerLimit];
                //Foreign buy                
            case 'frbuy':
                return [panel.tLabel_FrBuy, panel.tValue_FrBuy];
                //Foreign sell                
            case 'frsell':
                return [panel.tLabel_FrSell, panel.tValue_FrSell];
                //Net foreign                
            case 'netfr':
                return [panel.tLabel_NetFr, panel.tValue_NetFr];
                //EPS
            case 'eps':
                return [panel.tLabel_EPS, panel.tValue_EPS];
                //P/E Ratio
            case 'peratio':
                return [panel.tLabel_PERatio, panel.tValue_PERatio];
                //NTA
            case 'nta':
                return [panel.tLabel_NTA, panel.tValue_NTA];
            //for stock info at right side    
                //Value
            case 'value':
                return [panel.tLabel_Value, panel.tValue_Value];
                //Volume
            case 'volume':
                return [panel.tLabel_Volumn, panel.tValue_Volumn];
                //Buyrate
            case 'buyrate':
                return [panel.tLabel_BuyRate, panel.tValue_BuyRate];
                //Total buy
            case 'totalbuy':
                return [panel.tLabel_TotalBuyVol, panel.tValue_TotalBuyVol];
                //Total sell
            case 'totalsell':
                return [panel.tLabel_TotalSellVol, panel.tValue_TotalSellVol];
                //Total short sell
            case 'shortsell':
                return [panel.tLabel_ShortSellVol, panel.tValue_ShortSellVol];
                //Total buy transaction
            case 'buytrans':
                return [panel.tLabel_BuyTrans, panel.tValue_BuyTrans];
                //Total sell transaction
            case 'selltrans':
                return [panel.tLabel_SellTrans, panel.tValue_SellTrans];
                //LACP
            case 'lacp':
                return [panel.tLabel_LACP, panel.tValue_LACP];
                //High price
            case 'high':
                return [panel.tLabel_HighPrice, panel.tValue_HighPrice];
                //Low price
            case 'low':
                return [panel.tLabel_LowPrice, panel.tValue_LowPrice];
                //Day spread
            case 'dayspread':
                return [panel.tLabel_DaySpread, panel.tValue_DaySpread];
                //Average price
            case 'avgprice':
                return [panel.tLabel_MarketAvgPrice, panel.tValue_MarketAvgPrice];
                //Week high
            case 'wkhigh':
                return [panel.tLabel_WkHigh, panel.tValue_WkHigh];
                //Week low
            case 'wklow':
                return [panel.tLabel_WkLow, panel.tValue_WkLow];
                //Month high
            case 'mthhigh':
                return [panel.tLabel_MonthHigh, panel.tValue_MonthHigh];
                //Month Low
            case 'mthlow':
                return [panel.tLabel_MonthLow, panel.tValue_MonthLow];
                //52 week high
            case '52wkhigh':
                return [panel.tLabel_52WkHigh, panel.tValue_52WkHigh];
                //52 week low
            case '52wklow':
                return [panel.tLabel_52WkLow, panel.tValue_52WkLow];
                //52 week spread
            case '52wkspread':
                return [panel.tLabel_52WkSpread, panel.tValue_52WkSpread];
                // Previous price
            case 'prev':
                return [panel.tLabel_PrePrice, panel.tValue_PrePrice];
                // Change Percentage
            case 'chgper':
                return [panel.tLabel_ChgPer, panel.tValue_ChgPer];
               // Open Price
            case 'open':
                return [panel.tLabel_OpenPrice , panel.tValue_OpenPrice];
               // Total Transaction
            case 'totaltrans':
                return [panel.tLabel_TolTrans, panel.tValue_TolTrans];
                // Fluactation
            case 'fluact':
                return [panel.tLabel_Fluactation, panel.tValue_Fluactation];
                // Change Percentage
            case 'floatfree':
                return [panel.tLabel_FloatFree, panel.tValue_FloatFree];
               // Open Price
            case 'frshare':
                return [panel.tLabel_FrShare , panel.tValue_FrShare];
               // VWAP
            case 'vwap':
                return [panel.tLabel_VWAP , panel.tValue_VWAP];   
               // IDSS total volume
            case 'idsstolvol':
                return [panel.tLabel_IDSSTolVol, panel.tValue_IDSSTolVol];
                // IDSS total value
            case 'idsstolval':
                return [panel.tLabel_IDSSTolVal, panel.tValue_IDSSTolVal];
            // Type
            case 'type':
                return [panel.tLabel_Type, panel.tValue_Type];
            /* mutual fund */
            // fund name
            case 'fund_code':
                return [panel.tLabel_FundCode, panel.tValue_FundCode];
            // fund name
            case 'fund_name':
                return [panel.tLabel_FundName, panel.tValue_FundName];
            // currency
            case 'curr':
                return [panel.tLabel_Currency, panel.tValue_Currency];
            // min investment
            case 'min_invest':
                return [panel.tLabel_MinInvest, panel.tValue_MinInvest];
            // min additional investment
            case 'min_add_invest':
                return [panel.tLabel_MinAddInvest, panel.tValue_MinAddInvest];
            // Min Redemption Amount
            case 'min_red_amt':
                return [panel.tLabel_MinRedQty, panel.tValue_MinRedQty];
            // Min Holding Period
            case 'min_hold_period':
                return [panel.tLabel_MinHoldPeriod, panel.tValue_MinHoldPeriod];
            // Management Fee
            case 'mgt_fee':
                return [panel.tLabel_MgtFee, panel.tValue_MgtFee];
            // Early Redemption Fee
            case 'early_red_fee':
                return [panel.tLabel_EarlyRedFee, panel.tValue_EarlyRedFee];
            // Fund Type
            case 'risk_rate':
                return [panel.tLabel_RiskRate, panel.tValue_RiskRate];
            // Fund Type
            case 'fund_type':
                return [panel.tLabel_FundType, panel.tValue_FundType];
            // Philosophy
            case 'phi':
                return [panel.tLabel_Philosophy, panel.tValue_Philosophy];
            // Geography
            case 'geo':
                return [panel.tLabel_Geo, panel.tValue_Geo];
            // Legal Base
            case 'legal_base':
                return [panel.tLabel_LegalBase, panel.tValue_LegalBase];
            // Fund Size
            case 'fund_size':
                return [panel.tLabel_FundSize, panel.tValue_FundSize];
            // Fund Issuer
            case 'fund_issuer':
                return [panel.tLabel_FundIssuer, panel.tValue_FundIssuer];
            // NAVPS
            case 'navps':
                return [panel.tLabel_NAVPS, panel.tValue_NAVPS];
            // Start Date
            case 'start_date':
                return [panel.tLabel_StartDate, panel.tValue_StartDate];
                
        }

        return null;
    },
    updateSector: function() {
        var me = this;
        var sectorStr = me.sector || '';
        
        if(N2N_CONFIG.subSector && me.subSector){
            sectorStr += ' / ' + me.subSector;
        }
        sectorStr = sectorStr.trim();

        updateFieldValue(me.tValue_Sector, sectorStr);
    },
    setLayoutSet: function() {
        var panel = this;
        var layoutSet = panel.getLayoutSet();

        if (panel.layoutSet != layoutSet) {
            panel.layoutSet = layoutSet;
            // recreate fid
            panel._createMainPanel();
        }

    },
    getLayoutSet: function() {
        var panel = this;

        var layoutSet = 'default';
        if (panel.isMf) {
            layoutSet = 'mf';
        }

        return layoutSet;
    }
});
