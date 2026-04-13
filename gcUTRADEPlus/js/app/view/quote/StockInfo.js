/*
 * 
 * _createSearchGrid
 * _createTitlePanel
 * _createStockInfoPanel
 * _createGraphPanel
 * 1M
 * procCallTitle
 * _procCallStockInfo
 * _procCallChart
 * _procSearchStock
 * 
 * _procClickSearchRecord
 * _procClearText
 * 
 * updateFeedRecord
 * _updateSearchStock
 * 
 * getFieldList
 * 
 */

Ext.define('TCPlus.view.quote.StockInfo', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.stockinfo',
    stkcode: '',
    stkname: '',
    historyDay: 730,
    emptyText: languageFormat.getLanguage(30013, 'No result found.'),
    thisPanelId: null,
    exchangeCode: '',
    tLabel_StockName: null,
    tLabel_UpDown: null,
    tLabel_Last: null,
    tLabel_Change: null,
    tLabel_Previous: null,
    tLabel_Open: null,
    tLabel_OpenInt: null,
    tLabel_High: null,
    tLabel_Low: null,
    tLabel_FullName: null,
    tLabel_Sector: null,
    tLabel_Status: null,
    tLabel_Indices: null,
    tLabel_LotSize: null,
    tLabel_ISIN: null,
    tLabel_ForeignLimit: null,
    tLabel_ForeignOwnershipLimit: null,
    tLabel_DeliveryBasis: null,
    tLabel_SharesIssued: null,
    tLabel_MktCap: null,
    tLabel_ParValue: null,
    tLabel_ValueTraded: null,
    tLabel_TradingBoard: null,
    tLabel_TotalSSellVol: null,
    //tLabel_NetSSell: null,
    tLabel_TotalBuyVol: null,
    tLabel_TotalSellVol: null,
    tLabel_TotalBuyTrans: null,
    tLabel_TotalSellTrans: null,
    tLabel_LACP: null,
    tLabel_Ceiling: null,
    tLabel_Floor: null,
    tLabel_Volume: null,
    tGrid_SearchGrid: null,
    tPanel_stockInfo: null,
    tPanel_Chart: null,
    tPanel_mainPanel: null,
    tField_Search: null,
    tButton_search: null,
    tButton_back: null,
    tButton_chart_onClick: null,
    loadMask: null,
    loadMask_search: null,
    loadMask_chart: null,
    tempLabelPanel: null,
    _firstTime: true,
    slcomp: "si",
    winConfig: {
        width: 925,
        height: 310
    },
    type: 'si',
    savingComp: true,
    ddComp: true,
    refreshScreen: true,
    initComponent: function() {
        var panel = this;
        panel.isTabPanel = isMobile;
        panel.height = n2nLayoutManager.isWindowLayout() ? 385 : 380;
        panel.isTabLayout = n2nLayoutManager.isTabLayout();
        panel.thisPanelId = panel.getId();
        panel.exchangeCode = exchangecode;


        panel._createSearchGrid();

        //    panel._createMainPanel();
        panel.tField_Search = new Ext.form.field.Text({
            autoCreate: {
                tag: 'input',
                type: 'text',
                size: '30',
                autocomplete: 'off'
            },
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
            icon: icoBtnSearch,
            handler: function() {
                panel._procSearchStock();
            }
        });

        panel.tButton_back = new Ext.button.Button({
            text: languageFormat.getLanguage(10027, 'Back'),
            icon: icoBtnBack,
            hidden: true,
            handler: function() {
                panel.tField_Search.setValue("");
                panel.tButton_back.hide();

                panel.tPanel_mainPanel.show();
                panel.tGrid_SearchGrid.hide();
            }
        });


        var defaultConfig = {
            layout: 'fit',
            header: false,
            border: false,
            autoScroll: false,
            bodyStyle: 'padding:0px;margin:0px;font-size:12pt;overflow-y:auto;',
            // style: 'margin-bottom: 10px;',
            items: [panel.tGrid_SearchGrid, panel.tPanel_mainPanel],
            listeners: {
                destroy: function() {
                    Storage.generateUnsubscriptionByExtComp(panel);
                },
                resize: function(thisComp, w, h, oldw, oldh) {
//                    if (oldh) {
                        panel._firstTime = true; // to reload the chart (image issue)
                    //   var portCol = thisComp.findParentByType('portalcolumn');
                    if (oldw) {
                        panel.newOpen = false;
                    }
                    
                    if (isMobile || w < 650) {
                                panel.isTabPanel = true;
                                panel._createMainPanel();
                            } else {
                                panel.isTabPanel = false;
                                panel._createMainPanel();
                            }

//                        if (portCol != null) {
//                            if (portCol.id != 'portalcol_top') {
//                                panel.isTabPanel = true;
//                                panel._createMainPanel();
//                            } else {
//                                panel.isTabPanel = false;
//                                panel._createMainPanel();
//                            }
//                        }

                        }
//                }
            },
            tbar: {
                enableOverflow: menuOverflow,
                items: [
                    panel.tField_Search,
                    '-',
                    panel.tButton_search,
                    '->',
                    panel.tButton_back
                ]
            }
        };

        Ext.apply(this, defaultConfig);
        this.callParent(arguments);

    },
    _createMainPanel: function() {
        var panel = this;
        if (Ext.get(panel.getId())) {
            panel.remove(panel.tPanel_mainPanel);
        }
        if (panel.tPanel_mainPanel) {
            if (panel.loadMask) {
                panel.loadMask.destroy();
            }
            if (panel.loadMask_chart) {
                panel.loadMask_chart.destroy();
            }
            
            panel.tPanel_stockInfo.removeAll();
            panel.tPanel_stockInfo = null;
            panel.tPanel_mainPanel.removeAll();
            panel.tPanel_mainPanel = null;
            panel.tPanel_Chart = null;
            panel.tempLabelPanel.removeAll();
            panel.tempLabelPanel = null;
        }
        var htmlDesign = "";
        htmlDesign += "<table cellspacing='0' cellpadding='2' style='width:100%'>";
        htmlDesign += "<tr>";
        htmlDesign += "<td id='" + panel.thisPanelId + "_title'  style='font-size:13pt;font-weight:bold;'> </td>";
        htmlDesign += "<td id='" + panel.thisPanelId + "_buttons' style='width:160px;font-size:13pt;font-weight:bold;'> </td>";
        htmlDesign += "</tr>";
        htmlDesign += "</tr>";
        htmlDesign += "</table>";
        htmlDesign += "<table cellspacing='0' cellpadding='2' style='width:100%'>";
        htmlDesign += "<tr>";
        htmlDesign += "<td id='" + panel.thisPanelId + "_info' style='width:50%;vertical-align:top;'> </td>";
        htmlDesign += "<td id='" + panel.thisPanelId + "_chart' style='width:50%;vertical-align:top;'> </td>";
        htmlDesign += "</tr>";
        htmlDesign += "</table>";


        var items = [{html: htmlDesign}];
        if (panel.isTabPanel) {
            items = [{
                    title: languageFormat.getLanguage(20061, 'Info'),
                    id: "stockinfo_info",
                    html: "<div id='" + panel.thisPanelId + "_title' colspan='2'  style='width:100%;font-size:13pt;font-weight:bold;clear:both;'> </div><div id='" + panel.thisPanelId + "_info' style='width:100%;vertical-align:top;clear:both;'> </div>"
                }, {
                    title: languageFormat.getLanguage(20103, 'Chart'),
                    id: "stockinfo_chart",
                    html: "<div id='" + panel.thisPanelId + "_buttons' colspan='2' style='width:100%;font-size:13pt;font-weight:bold;clear:both;height:28px;'> </div><div id='" + panel.thisPanelId + "_chart' style='width:100%;vertical-align:top;clear:both;'> </div>"
                }];
        }
        panel.tPanel_mainPanel = Ext.create(!panel.isTabPanel ? 'Ext.container.Container' : 'Ext.tab.Panel', {
            width: '99%',
            border: false,
            overflowY: "hidden",
            cls: 'stock-info',
            defaults: {
                bodyStyle: 'border:none;',
                style: 'padding:5px;font-family:Helvetica,Verdana;font-weight:bold;font-size:9pt;'
            },
            items: items,
            listeners: {
                afterrender: function(thisPanel) {
                    panel.loadMask = thisPanel.setLoading(languageFormat.getLanguage(10017, 'Loading...')).hide();
                    
                    var ppanel = thisPanel.up();
                    if (ppanel) {
                        var pHt = ppanel.getHeight();
                        var ctMg = 66;
                        if (panel.isTabPanel) {
                            ctMg = 100;
                        }
                        panel.containerHeight = pHt - ctMg;
                    }
                    
                    panel._createTitlePanel();
                    panel._createStockInfoPanel();

                    if (!panel.isTabPanel) {
                        panel._createNumberButtonPanel();
                        panel._createGraphPanel();
                    }
                    
                    panel.procCallTitle();
                },
                tabchange: function(thisComp, newTab) {
                    if (newTab.getId() == "stockinfo_chart") {
                        if (!panel.tPanel_Chart) {
                            panel._createNumberButtonPanel();
                            panel._createGraphPanel();
                        }
                        panel.tPanel_Chart.setHeight(panel.getHeight() - 88);
                        panel._procCallChart();
                    }
                }
            }
        });

        if (Ext.get(panel.getId())) {
            panel.add(panel.tPanel_mainPanel);

        }
    },
    /**
     * Description <br/>
     * 
     * 		create search grid panel
     * 
     */
    _createSearchGrid: function() {
        var panel = this;

        var resultTpl = new Ext.XTemplate(
                '<tpl for=".">',
                '<table class="search-item" cellpadding="0" cellspacing="0">',
                '<tr><td width="200px"><span>{' + fieldStkCode + '}</span></td><td><span>{' + fieldStkName + '}</span></td></tr>',
                '</table></tpl>'
                );

        var store = Ext.create('Ext.data.Store', {
            model: 'TCPlus.model.SearchRecord'
        });

        panel.tGrid_SearchGrid = new Ext.view.View({
            tpl: resultTpl,
            store: store,
            itemSelector: 'table.search-item',
            emptyText: panel.emptyText,
            singleSelect: true, //?
            selectedItemCls: 'search-item-selected',
            hidden: true,
            listeners: {
                beforeselect: function() {
                    return !touchMode;
                },
                itemclick: function(thisComp, record, item, index, e, eOpts) {
                    panel._procClickSearchRecord(record);
                }
            }
        });

    },
    /**
     * Description <br/>
     * 
     * 		create title panel
     * 
     */
    _createTitlePanel: function() {
        var panel = this;



        panel.tempLabelPanel = new Ext.container.Container({
            columnWidth: 0.5,
            height: panel.isTabPanel ? 42 : 'auto',
            border: false,
            renderTo: panel.thisPanelId + "_title",
            html: "<table><tr>" +
                    "<td id='value_stockname_info' style='vertical-align:top'></td>" +
                    "<td id='value_updown_info' style='vertical-align:top'></td>" +
                    "<td id='value_last_info' style='vertical-align:top'></td>" +
                    "<td id='value_change_info' style='vertical-align:top'></td>" +
                    "</tr></table>",
            listeners: {
                afterrender: function() {
                    panel.tLabel_StockName = new Ext.form.Label({
                        text: "",
                        style: 'margin: 0 5px 0 5px; ',
                        renderTo: 'value_stockname_info'
                    });
                    panel.tLabel_UpDown = new Ext.form.Label({
                        text: "",
                        renderTo: "value_updown_info",
                        style: 'margin: 0 0 0 5px; '
                    });
                    panel.tLabel_Last = new Ext.form.Label({
                        text: "",
                        renderTo: "value_last_info",
                        style: 'margin: 0 5px 0 5px; '
                    });
                    panel.tLabel_Change = new Ext.form.Label({
                        text: "",
                        renderTo: "value_change_info",
                        style: 'margin: 0 5px 0 5px; '
                    });
                }
            }
        });
    },
    _createNumberButtonPanel: function() {
        var panel = this;
        var tempButtonPanel = new Ext.container.Container({
            columnWidth: 0.5,
            renderTo: panel.thisPanelId + "_buttons",
            layout: {
                type: 'table',
                columns: 6,
                tableAttrs: {
                    style: 'float:right'
                    }
            },
            border: false,
            cls: 'fix_whitebutton',
            items: [
                new Ext.button.Button({
                    text: languageFormat.getLanguage(20114, '1M', '1'),
                    tooltip: languageFormat.getLanguage(20110, '1 Month(s)', '1'),
                    cls: 'fix_btn',
                    margin: '0 2',
                    listeners: {
                        click: function(thisComp, event) {
                            panel.historyDay = 30;
                            panel._procCallChart();

                            thisComp.toggle(true, true);
                            if (panel.tButton_chart_onClick != thisComp.getId()) {
                                Ext.getCmp(panel.tButton_chart_onClick).toggle(false, true);
                            }
                            panel.tButton_chart_onClick = thisComp.getId();
                        }
                    }
                }),
                new Ext.button.Button({
                    text: languageFormat.getLanguage(20114, '3M', '3'),
                    tooltip: languageFormat.getLanguage(20110, '3 Month(s)', '3'),
                    cls: 'fix_btn',
                    margin: '0 2',
                    listeners: {
                        click: function(thisComp, event) {
                            panel.historyDay = 90;
                            panel._procCallChart();

                            thisComp.toggle(true, true);
                            if (panel.tButton_chart_onClick != thisComp.getId()) {
                                Ext.getCmp(panel.tButton_chart_onClick).toggle(false, true);
                            }
                            panel.tButton_chart_onClick = thisComp.getId();
                        }
                    }
                }),
                new Ext.button.Button({
                    text: languageFormat.getLanguage(20114, '6M', '6'),
                    tooltip: languageFormat.getLanguage(20110, '6 Month(s)', '6'),
                    cls: 'fix_btn',
                    margin: '0 2',
                    listeners: {
                        click: function(thisComp, event) {
                            panel.historyDay = 180;
                            panel._procCallChart();

                            thisComp.toggle(true, true);
                            if (panel.tButton_chart_onClick != thisComp.getId()) {
                                Ext.getCmp(panel.tButton_chart_onClick).toggle(false, true);
                            }
                            panel.tButton_chart_onClick = thisComp.getId();
                        },
                        afterrender: function(thisComp) {
                            panel.tButton_chart_onClick = thisComp.getId();
                            thisComp.toggle(true, true);
                        }
                    }
                }),
                new Ext.button.Button({
                    text: languageFormat.getLanguage(20115, '1Y', '1'),
                    tooltip: languageFormat.getLanguage(20111, '1 Year(s)', '1'),
                    cls: 'fix_btn',
                    margin: '0 2',
                    listeners: {
                        click: function(thisComp, event) {
                            panel.historyDay = 365;
                            panel._procCallChart();

                            thisComp.toggle(true, true);
                            if (panel.tButton_chart_onClick != thisComp.getId()) {
                                Ext.getCmp(panel.tButton_chart_onClick).toggle(false, true);
                            }
                            panel.tButton_chart_onClick = thisComp.getId();
                        }
                    }
                }),
                new Ext.button.Button({
                    text: languageFormat.getLanguage(20115, '2Y', '2'),
                    tooltip: languageFormat.getLanguage(20111, '2 Year(s)', '2'),
                    cls: 'fix_btn',
                    margin: '0 2',
                    listeners: {
                        click: function(thisComp, event) {
                            panel.historyDay = 730;
                            panel._procCallChart();

                            thisComp.toggle(true, true);
                            if (panel.tButton_chart_onClick != thisComp.getId()) {
                                Ext.getCmp(panel.tButton_chart_onClick).toggle(false, true);
                            }
                            panel.tButton_chart_onClick = thisComp.getId();
                        }
                    }
                }),
                {
                    xtype: 'stockchartbtn',
                    chartMode: 'h',
                    margin: '0 2',
                    handler: function(thisBtn) {
                        thisBtn.loadStockChart(panel.stkcode);
                    }
                }
            ]
        });
    },
    /**
     * Description <br/>
     * 
     * 		create stock info panel 
     */
    _createStockInfoPanel: function() {
        var panel = this;

        var createLabel = function(name, isLabel) {
            var tempLabel = Ext.create('Ext.form.Label', {
                text: name
            });

            if (isLabel) {
                tempLabel.addCls(N2NCSS.stockInfoLabel_color);
            }

            return tempLabel;
        };


        panel.tLabel_Ceiling = createLabel("-", false);
        panel.tLabel_DeliveryBasis = createLabel("-", false);
        panel.tLabel_Floor = createLabel("-", false);
        panel.tLabel_ForeignLimit = createLabel("-", false);
        panel.tLabel_ForeignOwnershipLimit = createLabel("-", false);

        panel.tLabel_FullName = new Ext.form.Label({
            text: '-',
            colspan: 3
        });
        panel.tLabel_High = createLabel("-", false);
        panel.tLabel_Indices = createLabel("-", false);
        panel.tLabel_ISIN = createLabel("-", false);
        panel.tLabel_LACP = createLabel("-", false);
        panel.tLabel_LotSize = createLabel("-", false);
        panel.tLabel_Low = createLabel("-", false);
        panel.tLabel_MktCap = createLabel("-", false);
       // panel.tLabel_NetSSell = createLabel("-", false);
        panel.tLabel_Open = createLabel("-", false);
        panel.tLabel_OpenInt = createLabel("-", false);
        panel.tLabel_ParValue = createLabel("-", false);
        panel.tLabel_Previous = createLabel("-", false);
        panel.tLabel_Sector = createLabel("   -", false);
        panel.tLabel_SharesIssued = createLabel("-", false);
        panel.tLabel_Status = createLabel("-", false);
        panel.tLabel_TotalBuyTrans = createLabel("-", false);
        panel.tLabel_TotalBuyVol = createLabel("-", false);
        panel.tLabel_TotalSellTrans = createLabel("-", false);
        panel.tLabel_TotalSellVol = createLabel("-", false);
        panel.tLabel_TotalSSellVol = createLabel("-", false);
        panel.tLabel_TradingBoard = createLabel("-", false);
        panel.tLabel_ValueTraded = createLabel("-", false);
        panel.tLabel_Volume = createLabel("-", false);

        var itemList = [];
        if (panel.exchangeCode == "MY") {
            itemList.push(createLabel(languageFormat.getLanguage(20030, "Previous"), true));
            itemList.push(panel.tLabel_Previous);
            itemList.push(createLabel(languageFormat.getLanguage(20042, "Total Buy Vol."), true));
            itemList.push(panel.tLabel_TotalBuyVol);
            itemList.push(createLabel(languageFormat.getLanguage(10104, "Open"), true));
            itemList.push(panel.tLabel_Open);
            itemList.push(createLabel(languageFormat.getLanguage(20043, "Total Sell Vol."), true));
            itemList.push(panel.tLabel_TotalSellVol);
            itemList.push(createLabel(languageFormat.getLanguage(10105, "Open Int"), true));
            itemList.push(panel.tLabel_OpenInt);
            itemList.push(createLabel(languageFormat.getLanguage(20044, "Total Buy Trans."), true));
            itemList.push(panel.tLabel_TotalBuyTrans);
            itemList.push(createLabel(languageFormat.getLanguage(10107, "High"), true));
            itemList.push(panel.tLabel_High);
            itemList.push(createLabel(languageFormat.getLanguage(20045, "Total Sell Trans."), true));
            itemList.push(panel.tLabel_TotalSellTrans);
            itemList.push(createLabel(languageFormat.getLanguage(10108, "Low"), true));
            itemList.push(panel.tLabel_Low);
            itemList.push(createLabel(languageFormat.getLanguage(20046, "Ceiling"), true));
            itemList.push(panel.tLabel_Ceiling);
            itemList.push(createLabel(languageFormat.getLanguage(11008, "Volume"), true));
            itemList.push(panel.tLabel_Volume);
            itemList.push(createLabel(languageFormat.getLanguage(20047, "Floor"), true));
            itemList.push(panel.tLabel_Floor);

        } else {
            itemList.push(createLabel(languageFormat.getLanguage(20026, "Full Name"), true));
            itemList.push(panel.tLabel_FullName);
            itemList.push(createLabel(languageFormat.getLanguage(20027, "Sector"), true));
            itemList.push(panel.tLabel_Sector);
            itemList.push(createLabel(languageFormat.getLanguage(20039, "Trading Board"), true));
            itemList.push(panel.tLabel_TradingBoard);
            itemList.push(createLabel(languageFormat.getLanguage(20028, "Status"), true));
            itemList.push(panel.tLabel_Status);
            itemList.push(createLabel(languageFormat.getLanguage(20040, "Total S.Sell Vol."), true));
            itemList.push(panel.tLabel_TotalSSellVol);
            itemList.push(createLabel(languageFormat.getLanguage(20029, "Indices"), true));
            itemList.push(panel.tLabel_Indices);
            //itemList.push(createLabel("Net S.Sell", true));
            //itemList.push(panel.tLabel_NetSSell);
            itemList.push(createLabel(languageFormat.getLanguage(10712, "Lot.Size"), true));
            itemList.push(panel.tLabel_LotSize);
            itemList.push(createLabel(languageFormat.getLanguage(20042, "Total Buy Vol."), true));
            itemList.push(panel.tLabel_TotalBuyVol);
            itemList.push(createLabel(languageFormat.getLanguage(20031, "ISIN"), true));
            itemList.push(panel.tLabel_ISIN);
            itemList.push(createLabel(languageFormat.getLanguage(20043, "Total Sell Vol."), true));
            itemList.push(panel.tLabel_TotalSellVol);
            itemList.push(createLabel(languageFormat.getLanguage(20032, "Foreign Limit"), true));
            itemList.push(panel.tLabel_ForeignLimit);
            itemList.push(createLabel(languageFormat.getLanguage(20044, "Total Buy Trans."), true));
            itemList.push(panel.tLabel_TotalBuyTrans);
            itemList.push(createLabel(languageFormat.getLanguage(20033, "Foreign Ownership Limit"), true));
            itemList.push(panel.tLabel_ForeignOwnershipLimit);
            itemList.push(createLabel(languageFormat.getLanguage(20045, "Total Sell Trans."), true));
            itemList.push(panel.tLabel_TotalSellTrans);
            itemList.push(createLabel(languageFormat.getLanguage(20034, "Shares Issued"), true));
            itemList.push(panel.tLabel_SharesIssued);
            itemList.push(createLabel(languageFormat.getLanguage(10106, "LACP"), true));
            itemList.push(panel.tLabel_LACP);
            itemList.push(createLabel(languageFormat.getLanguage(20035, "Mkt. Cap."), true));
            itemList.push(panel.tLabel_MktCap);
            itemList.push(createLabel(languageFormat.getLanguage(20046, "Ceiling"), true));
            itemList.push(panel.tLabel_Ceiling);
            itemList.push(createLabel(languageFormat.getLanguage(20036, "Par Value"), true));
            itemList.push(panel.tLabel_ParValue);
            itemList.push(createLabel(languageFormat.getLanguage(20047, "Floor"), true));
            itemList.push(panel.tLabel_Floor);
            itemList.push(createLabel(languageFormat.getLanguage(20037, "Value Traded"), true));
            itemList.push(panel.tLabel_ValueTraded);
            itemList.push(createLabel(languageFormat.getLanguage(11008, "Volume"), true));
            itemList.push(panel.tLabel_Volume);
            itemList.push(createLabel(languageFormat.getLanguage(20038, "Delivery Basis"), true));
            itemList.push(panel.tLabel_DeliveryBasis);

        }

        var colNum = panel.getWidth() < N2N_CONFIG.minViewWidth ? 2 : 4;
        panel.tPanel_stockInfo = new Ext.container.Container({
            height: panel.containerHeight,
            autoScroll: true,
            border: false,
            style: 'padding-bottom:10px',
            items: [
                {
                    type: 'container',
                    border: false,
                    layout: {
                        type: 'table',
                        columns: colNum,
                        tableAttrs: {
                            style: {
                                width: '100%'
                            },
                            cellspacing: '2',
                            cls: 'stkinfo_tbl'
                        }
                    },
                    items: itemList
                }
            ],
            renderTo: panel.thisPanelId + '_info'
        });
    },
    /**
     * Description <br/>
     * 
     * 		create graph panel
     */
    _createGraphPanel: function() {
        var panel = this;

        if (!isStockChart) {
            panel.tPanel_Chart = new Ext.container.Container({
                renderTo: panel.thisPanelId + '_chart',
                height: panel.containerHeight,
                border: false,
                listeners: {
                    afterrender: function(thisComp) {
                        panel.loadMask_chart = thisComp.setLoading(languageFormat.getLanguage(10017, 'Loading...')).hide();
                    }
                }

            });
        } else {
            panel.tPanel_Chart = Ext.create('Ext.ux.IFrame', {
                renderTo: panel.thisPanelId + '_chart',
                height: panel.containerHeight,
                iframeBorder: false,
                border: false,
                style: 'margin: 0 0 0 0px;',
                listeners: {
                    afterrender: function(thisComp) {
                        panel.loadMask_chart = thisComp.setLoading(languageFormat.getLanguage(10017, 'Loading...')).hide();
                    }
                }
            });
        }
    },
    /**
     * Description <br/>
     * 
     * 		call title info
     * 		
     */
    procCallTitle: function() {
        var panel = this;
        if (panel._isEmptyStock()) {
            return;
        }
        
        var tmpStkCode = stockutil.getStockPart(panel.stkcode);
    	var tmpStkName = stockutil.getStockName(panel.stkname);
    	
        panel._procClearText();

        var newTitle = languageFormat.getLanguage(20021, 'Stock Info') + ' - ' + tmpStkName;
        n2nLayoutManager.updateTitle(panel, newTitle);
        n2nLayoutManager.updateKey(panel);
        compAddRecent(panel, panel.stkcode);

        if (pseStockNewsURL.length == 0) {
            panel.tLabel_StockName.update('<label>' + tmpStkCode + " / " + tmpStkName + '</label>');
        } else {
            panel.tLabel_StockName.update('<label class="label_link" onclick="n2ncomponents.openPSENews(\''+panel.stkcode +'\')" >' + tmpStkCode + " / " + tmpStkName + '</label>');
        }

        Storage.generateUnsubscriptionByExtComp(panel, true);
        panel.updateFeedRecord(Storage.returnRecord(panel.stkcode));
        Storage.generateSubscriptionByList([panel.stkcode], panel);

        panel._procCallStockInfo();
        if (!panel.isTabPanel) {
            panel._procCallChart();
        }
    },
    /**
     * Description <br/>
     * 
     * 		call ajax to get stock info
     * 		
     */
    _procCallStockInfo: function() {
        var panel = this;

        if (panel.stkcode) {
            panel.exchangeCode = getStkExCode(panel.stkcode); // get exchange code from stock code
        }

        panel.tField_Search.setValue("");
        panel.tButton_back.hide();
        panel.tGrid_SearchGrid.hide();

        panel.tPanel_mainPanel.show();
        panel.loadMask.show();

        conn.getStockInfo({
            k: panel.stkcode,
            f: panel.getFieldList(),
            success: function(obj) {
                try {
                    if (obj.s) {
                        updater.updateQuote(obj);
                    }
                } catch (e) {
                }

                panel.loadMask.hide();
            }
        });

    },
    /**
     * Description <br/>
     * 
     * 		call chart graph
     * 
     */
    _procCallChart: function() {
        var panel = this;
        if (panel._isEmptyStock() || !panel.tPanel_Chart) {
            return;
        }
        
        panel.tPanel_Chart.update('');
        panel.loadMask_chart.show();
        
        var panelSize = panel.tPanel_Chart.getSize();
        
        if (!isStockChart) {
            if (panel._firstTime) {
                // wait for 50ms to call chart again in order to fix distorted chart issue for the first time
                if (panel._recallChartTask) {
                    clearTimeout(panel._recallChartTask);
                }

                panel._recallChartTask = setTimeout(function() {
                    if (panel) {
                        panel._firstTime = false;
                        panel._procCallChart();
                    }
                }, 50);

                return;
            }
        
            var url = "";
            url += addPath + 'tcplus/hischart?';
            url += 'ExtComp=';
            url += 'stockInfo_' + panel.getId();
            url += '&k=';
            url += panel.stkcode;
            url += '&w=';
            url += (panelSize.width);
            url += '&h=';
            url += (panelSize.height - 5);
            url += '&d=';
            url += panel.historyDay;
            url += '&id=stkInfo';
            url += '&ct=';
            url += '&c='; //1.3.29.37 Added c=formatutils.procThemeColor()
            url += formatutils.procThemeColor(); //1.3.29.37 Added c=formatutils.procThemeColor()

            Ext.Ajax.request({
                url: url,
                method: 'POST',
                timeout: 10000,
                success: function(response) {
                    var obj = null;
                    try {
                        obj = Ext.decode(response.responseText);

                        if (obj.s) {
                            var tempNewObj = '<img src="' + obj.d + '?' + Math.random() + '" alt="Analysis Chart" />';
                            panel.tPanel_Chart.update(tempNewObj);
                        } else {
                            panel.tPanel_Chart.update(obj.d);
                        }

                    } catch (e) {
                        if (panel.tPanel_Chart) {
                            panel.tPanel_Chart.update(languageFormat.getLanguage(30901, 'Chart data not available.'));
                    }
                    }
                    panel.loadMask_chart.hide();
                },
                failure: function(response) {
                    panel.tPanel_Chart.update(languageFormat.getLanguage(30901, 'Chart data not available.'));
                    panel.loadMask_chart.hide();
                }
            });
        } else {
        	// Removes delayed exchange suffix. Determine whether exchange is delayed based on param 'View'
            var nonDelayCode = stockutil.removeStockDelay(panel.stkcode);
            var stkParts = stockutil.getStockParts(nonDelayCode);
            var stockcode = stkParts.code; //stockutil.getStockPart(panel.stkcode);
            var exchangecode = stkParts.exch;
            var url = embeddedStockChartURL + "?code=" + stockcode + '&Name=' + encodeURIComponent(stockutil.getStockName(panel.stkname)) + "&exchg=" + exchangecode + "&amount=" + panel.historyDay 
            			+ "&color=" + formatutils.procThemeColor() + '&lang=' + global_Language + '&View=' + (stockutil.isDelayStock(panel.stkcode) ? 'D' : 'R') +
                                '&type=si&newOpen=' + (jsutil.boolToStr(panel.newOpen, '1', '0'));
            panel.tPanel_Chart.refresh(url);
            panel.loadMask_chart.hide();
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
            panel.tButton_back.show();
            panel.tPanel_mainPanel.hide();
            panel.tGrid_SearchGrid.show();
            panel.tGrid_SearchGrid.getEl().update('');
            panel.tGrid_SearchGrid.setLoading(languageFormat.getLanguage(10017, 'Loading...'));

            conn.searchStock({
                k: searchKey,
                field: [fieldStkCode, fieldStkName, fieldSbExchgCode],
                quickSearch: true,
                success: function(obj) {
                    try {
                        if (obj.c > 0) {
                            panel._updateSearchStock(obj.d);
                        } else {
                            panel.tGrid_SearchGrid.getEl().update('<div class="x-grid-empty">' + panel.emptyText + '</div>');
                        }
                    } catch (e) {
                        panel.tGrid_SearchGrid.getEl().update('<div class="x-grid-empty">' + panel.emptyText + '</div>');
                    }
                    panel.tGrid_SearchGrid.setLoading(false);
                }
            });
        } else {
            panel.tField_Search.focus();
        }
    },
    /**
     * Description <br/>
     * 
     * 		process search result on click 
     * 
     * @param {integer}  rowIndex
     */
    _procClickSearchRecord: function(record) {
        var panel = this;

        panel.tField_Search.setValue("");

        panel.tPanel_mainPanel.show();
        panel.tGrid_SearchGrid.hide();

        panel.tButton_back.hide();

        if (record != null) {
            panel.stkcode = record.get(fieldStkCode);
            panel.stkname = record.get(fieldStkName);
            panel.oldKey = panel.key;
            panel.key = panel.stkcode;
            
            if (panel.stkcode) {
                panel.exchangeCode = getStkExCode(panel.stkcode); // get exchange code from stock code
            }

            panel.tPanel_stockInfo.destroy();

            panel._createStockInfoPanel();

            panel.procCallTitle();
            if (panel.isTabPanel) {
                if (panel.tPanel_mainPanel.getActiveTab().getId() == "stockinfo_chart") {
                    panel._procCallChart();
                }
            }
        }
    },
    /**
     * Description <br/>
     * 
     * 		update record result
     * 
     * @param {object}   dataObj
     */
    updateFeedRecord: function(dataObj) {
        var panel = this;
        // panel.suspendLayouts();

        if (dataObj == null) {
            return;
        }
        
        var lastUpdate = false;
        var lacpUpdate = false;
        if (dataObj[fieldLast] != null) {
            panel.last = dataObj[fieldLast];
            lastUpdate = true;
        }
        if (dataObj[fieldLacp] != null) {
            panel.lacp = dataObj[fieldLacp];
            lacpUpdate = true;
        }
        var last = panel.last || 0;
        var lacp = panel.lacp || 0;

        if (lastUpdate || lacpUpdate) {
            var cssClass = "";
            if (parseFloat(last) == 0 || parseFloat(lacp) == 0) {
                cssClass = N2NCSS.FontUnChange;
            } else if (parseFloat(last) > parseFloat(lacp)) {
                cssClass = N2NCSS.FontUp;
            } else if (parseFloat(last) < parseFloat(lacp) && parseFloat(last) != 0) {
                cssClass = N2NCSS.FontDown;
            } else {
                cssClass = N2NCSS.FontUnChange;
            }

            if (lacpUpdate) {
                helper.setHtml(panel.tLabel_LACP, lacp);
            }

            panel.tLabel_Last.update("<label class='" + cssClass + "'> " + last + "  </label>");
        }

        if (dataObj[fieldChange] != null) {
            var cssClass = "";
            var imageURL = "";

            if (parseFloat(dataObj[fieldChange]) > 0) {
                cssClass = N2NCSS.FontUp;
                imageURL = '<img src="images/arrow_up.png">';

            } else if (parseFloat(dataObj[fieldChange]) < 0) {
                cssClass = N2NCSS.FontDown;
                imageURL = '<img src="images/arrow_down.png">';

            } else {
                cssClass = N2NCSS.FontUnChange;
                imageURL = '';

            }

            var decimalPlace = (last.substring((last.lastIndexOf(".") + 1), last.length)).length;
            panel.tLabel_Change.update("<label class='" + cssClass + "'> " + dataObj[fieldChange] + " " + dataObj[fieldChangePer] + "%  </label>");
            panel.tLabel_UpDown.update(imageURL);
        }

        var displayValue = null;
        // ****************** only for exchange 'MY' : start *********************

        displayValue = dataObj[fieldPrev] == null ? null : dataObj[fieldPrev];
        if (displayValue != null)
            helper.setHtml(panel.tLabel_Previous, displayValue);

        displayValue = dataObj[fieldOpen] == null ? null : dataObj[fieldOpen];
        if (displayValue != null)
            helper.setHtml(panel.tLabel_Open, displayValue);

        displayValue = dataObj[fieldOpenInt] == null ? null : dataObj[fieldOpenInt];
        if (displayValue != null)
            helper.setHtml(panel.tLabel_OpenInt, displayValue);

        // ****************** only for exchange 'MY' : end *********************


        displayValue = dataObj[fieldHigh] == null ? null : dataObj[fieldHigh];
        if (displayValue != null)
            helper.setHtml(panel.tLabel_High, displayValue);

        displayValue = dataObj[fieldLow] == null ? null : dataObj[fieldLow];
        if (displayValue != null)
            helper.setHtml(panel.tLabel_Low, displayValue);

        displayValue = dataObj[fieldBTrans] == null ? null : dataObj[fieldBTrans];
        if (displayValue != null)
            helper.setHtml(panel.tLabel_TotalBuyTrans, formatutils.formatNumber(displayValue, 500));

        displayValue = dataObj[fieldSTrans] == null ? null : dataObj[fieldSTrans];
        if (displayValue != null)
            helper.setHtml(panel.tLabel_TotalSellTrans, formatutils.formatNumber(displayValue, 500));

        displayValue = dataObj[fieldVol] == null ? null : dataObj[fieldVol];
        if (displayValue != null)
            helper.setHtml(panel.tLabel_Volume, formatutils.formatNumber(displayValue, 500));

        displayValue = dataObj[fieldUpLmt] == null ? null : dataObj[fieldUpLmt];
        if (displayValue != null && displayValue != 0)
            helper.setHtml(panel.tLabel_Ceiling, displayValue);

        displayValue = dataObj[fieldLowLmt] == null ? null : dataObj[fieldLowLmt];
        if (displayValue != null && displayValue != 0)
            helper.setHtml(panel.tLabel_Floor, displayValue);

        displayValue = dataObj[fieldTotBVol] == null ? null : dataObj[fieldTotBVol];
        if (displayValue != null)
            helper.setHtml(panel.tLabel_TotalBuyVol, formatutils.formatNumber(displayValue, 500));

        displayValue = dataObj[fieldTotSVol] == null ? null : dataObj[fieldTotSVol];
        if (displayValue != null)
            helper.setHtml(panel.tLabel_TotalSellVol, formatutils.formatNumber(displayValue, 500));



        // ****************** for exchange is not 'MY' : start *********************

        displayValue = dataObj[fieldStkFName] == null ? null : dataObj[fieldStkFName];
        if (displayValue != null)
            helper.setHtml(panel.tLabel_FullName, displayValue);

        displayValue = dataObj[fieldStkFName] == null ? null : dataObj[fieldStkFName];
        if (displayValue != null)
            helper.setHtml(panel.tLabel_FullName, displayValue);

        displayValue = dataObj[fieldLotSize] == null ? null : dataObj[fieldLotSize];
        if (displayValue != null)
            helper.setHtml(panel.tLabel_LotSize, formatutils.formatNumber(displayValue, 500));

        displayValue = dataObj[fieldValue] == null ? null : dataObj[fieldValue];
        if (displayValue != null)
            helper.setHtml(panel.tLabel_ValueTraded, formatutils.formatNumber(parseFloat(displayValue).toFixed(0), 500));

        displayValue = dataObj[fieldShrIssue] == null ? null : dataObj[fieldShrIssue];
        if (displayValue != null && displayValue != 0) {
            helper.setHtml(panel.tLabel_SharesIssued, formatutils.formatNumber(displayValue, 500));

            if (parseFloat(last) == 0) {
                helper.setHtml(panel.tLabel_MktCap, formatutils.formatNumber((parseInt(displayValue) * parseFloat(lacp)).toFixed(2), 500));

            } else {
                helper.setHtml(panel.tLabel_MktCap, formatutils.formatNumber((parseInt(displayValue) * parseFloat(last)).toFixed(2), 500));
            }
        }


        displayValue = dataObj[fieldParValue] == null ? null : dataObj[fieldParValue];
        if (displayValue != null && displayValue != 0)
            helper.setHtml(panel.tLabel_ParValue, parseFloat(displayValue).toFixed(3));

        var statusObj = getStockStatusObj(dataObj[fieldStatus]);
        updateFieldValue(panel.tLabel_Status, statusObj.status, '');
        updateFieldValue(panel.tLabel_DeliveryBasis, statusObj.deliveryBasis);
        updateFieldValue(panel.tLabel_ForeignLimit, statusObj.foreignLimit);

        displayValue = dataObj[fieldStkStatus] == null ? null : dataObj[fieldStkStatus];
        if (displayValue != null) {
            helper.setHtml(panel.tLabel_Status, getStkStatus(displayValue));
        }

        displayValue = dataObj[fieldIndexCode] == null ? null : dataObj[fieldIndexCode];
        if (displayValue != null) {
            var value2 = dataObj[fieldSectorCode] == null ? null : dataObj[fieldSectorCode];
            helper.setHtml(panel.tLabel_Indices, getIndicesName(displayValue, value2));
        }

        var displayValue = dataObj["pathName"] == null ? null : dataObj["pathName"];
        if (displayValue != null) {
            helper.setHtml(panel.tLabel_Sector, getSectorName(displayValue));
            helper.setHtml(panel.tLabel_TradingBoard, getBoardName(displayValue));
        }

        displayValue = dataObj[fieldISIN] == null ? null : dataObj[fieldISIN];
        if (displayValue != null)
            helper.setHtml(panel.tLabel_ISIN, displayValue);

        displayValue = dataObj[fieldTotSSVol] == null ? null : dataObj[fieldTotSSVol];
        if (displayValue != null && displayValue != 0)
            helper.setHtml(panel.tLabel_TotalSSellVol, formatutils.formatNumber(displayValue, 500));

//        displayValue = dataObj[fieldLotSize] == null ? null : dataObj[fieldLotSize];
//        if (displayValue != null && displayValue != 0)
//            helper.setHtml(panel.tLabel_NetSSell, displayValue);


        displayValue = dataObj[fieldForeignOwnerLimit] == null ? null : dataObj[fieldForeignOwnerLimit];
        if (displayValue != null && displayValue != 0)
            helper.setHtml(panel.tLabel_ForeignOwnershipLimit, formatutils.formatNumber(displayValue, 90000000));


        // ****************** for exchange is not 'MY' : end *********************
        // panel.resumeLayouts();
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

        var temoObject = {};
        temoObject.s = true;
        temoObject.c = dataObj.length;
        temoObject.d = dataObj;

        panel.tGrid_SearchGrid.store.loadRawData(temoObject);

    },
    /**
     * Description <br/>
     * 
     * 		clear all component text 
     */
    _procClearText: function() {
        var panel = this;

        helper.setHtml(panel.tLabel_StockName, "-");
        helper.setHtml(panel.tLabel_UpDown, "-");
        helper.setHtml(panel.tLabel_Last, "-");
        helper.setHtml(panel.tLabel_Change, "-");
        helper.setHtml(panel.tLabel_Previous, "-");
        helper.setHtml(panel.tLabel_Open, "-");
        helper.setHtml(panel.tLabel_OpenInt, "-");
        helper.setHtml(panel.tLabel_High, "-");
        helper.setHtml(panel.tLabel_Low, "-");
        helper.setHtml(panel.tLabel_FullName, "-");
        helper.setHtml(panel.tLabel_Sector, "-");
        helper.setHtml(panel.tLabel_Status, "-");
        helper.setHtml(panel.tLabel_Indices, "-");
        helper.setHtml(panel.tLabel_LotSize, "-");
        helper.setHtml(panel.tLabel_ISIN, "-");
        helper.setHtml(panel.tLabel_ForeignLimit, "-");
        helper.setHtml(panel.tLabel_DeliveryBasis, "-");
        helper.setHtml(panel.tLabel_SharesIssued, "-");
        helper.setHtml(panel.tLabel_MktCap, "-");
        helper.setHtml(panel.tLabel_ParValue, "-");
        helper.setHtml(panel.tLabel_ValueTraded, "-");
        helper.setHtml(panel.tLabel_TradingBoard, "-");
        helper.setHtml(panel.tLabel_TotalSSellVol, "-");
        helper.setHtml(panel.tLabel_TotalBuyVol, "-");
        helper.setHtml(panel.tLabel_TotalSellVol, "-");
        helper.setHtml(panel.tLabel_TotalBuyTrans, "-");
        helper.setHtml(panel.tLabel_TotalSellTrans, "-");
        helper.setHtml(panel.tLabel_LACP, "-");
        helper.setHtml(panel.tLabel_Ceiling, "-");
        helper.setHtml(panel.tLabel_Floor, "-");
        helper.setHtml(panel.tLabel_Volume, "-");
        helper.setHtml(panel.tLabel_ForeignOwnershipLimit, "-");
        // clear cached data
        panel.last = null;
        panel.lacp = null;
        
    },
    /**
     * Description <br/>
     * 
     * 		return field id by array 
     * 
     * @return {array}
     */
    getFieldList: function() {
        var fieldList = new Array();

        fieldList.push(fieldStkCode);
        fieldList.push(fieldStkName);
        fieldList.push(fieldStkFName);
        fieldList.push(fieldLacp);
        fieldList.push(fieldLast);
        fieldList.push(fieldVol);
        fieldList.push(fieldValue);
        fieldList.push(fieldBuy);
        fieldList.push(fieldSell);
        fieldList.push(fieldParValue);

        fieldList.push(fieldStkStatus);
        fieldList.push(fieldStatus);
        fieldList.push(fieldSectorCode);
        fieldList.push(fieldSectorName);
        fieldList.push(fieldLotSize);
        fieldList.push(fieldISIN);
        fieldList.push(fieldShrIssue);
        fieldList.push(fieldTotSSVol);

        fieldList.push(fieldTotBVol);
        fieldList.push(fieldTotSVol);
        fieldList.push(fieldBTrans);
        fieldList.push(fieldSTrans);
        fieldList.push(fieldHigh);
        fieldList.push(fieldLow);
        fieldList.push(fieldUpLmt);
        fieldList.push(fieldLowLmt);

        fieldList.push(fieldPrev);
        fieldList.push(fieldOpen);
        fieldList.push(fieldOpenInt);
        fieldList.push("pathName");

        return fieldList;
    },
    _isEmptyStock: function() {
        var me = this;

        return jsutil.isEmpty(me.stkcode);
    },
    refreshEmpty: function() {
        var me = this;

        if (!me.key) {
            menuHandler.stockInfo();
        }
    },
    forceReloadChart: function() {
        var me = this;

        if (helper.inView(me.tPanel_Chart)) {
            me._procCallChart();
        }

    },
    _updateTitle: function() {
        var me = this;
        var stkName = stockutil.getStockPart(me.stkname);

        var newTitle = languageFormat.getLanguage(20021, 'Stock Info') + ' - ' + stkName;
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

    },
    syncBuffer: function(stkcode, stkname) {
        var me = this;

        // update key and title
        me.setCode(stkcode, stkname);
        me._updateTitle();

        me._needReload = true;

    },
    switchRefresh: function() {
        var me = this;

        if (me._needReload) {
            me._needReload = false;
            me.procCallTitle();
        }
    },
    setChartStatus: function() {
        var me = this;

        if (isStockChart && me.tPanel_Chart && me.newOpen) {
            me.newOpen = false;
            var newUrl = updateQueryStringParameter(me.tPanel_Chart.iframeURL, 'newOpen', '0');
            me.tPanel_Chart.refresh(newUrl);
        }
    }
});
