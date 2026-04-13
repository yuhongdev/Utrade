/*
 * this   : Ext.container.Container
 * 
 * 
 * _createIndicesPanel		: create indices panel
 * _createTimePanel			: create time and sales panel
 * _createChartPanel		: create chart panel
 * 
 * _procCallIndices			: process indices ajax request	
 * _procCallChart			: process chart ajax request	
 * _procCallTime			: process time and sales ajax request	
 * 
 * refresh					: recall all ajax
 * 
 * updateIndices			: update indices grid panel, time and sales grid panel and label value
 * _updateIndices			: update indices grid panel record
 * _updateTime				: update time and sales grid panel record
 * _updateLabel				: 
 * 
 * 
 * getFieldList
 * 
 * _procLoadMask			: process load mask
 * 
 * 
 */

Ext.define('TCPlus.view.quote.Indices', {
    extend: "Ext.container.Container",
    alias: 'widget.indices',
    chartStockCode: null,
    chartStockName: null,
    tButton_First: null,
    tButton_Next: null,
    tButton_Previous: null,
    tButton_Last: null,
    beginNumber: 0, // for time and sales begin record number
    endNumber: 0, // for time and sales end record number
    totalNumber: 0, // for time and sales total record number
    totalRecord: 0, // for time and sales total display number of record
    eventType: 0, // for time and sales next page or previous page event

    currentTranNo: 0,
    thisPanelId: null,
    tRecord_TimeSales: null,
    tRecord_Indices: null,
    tGrid_Indices: null,
    tGrid_TimeSales: null,
    tChartMain_Panel: null,
    tChart_panel: null,
    tLoadMask_main: null,
    tLoadMask_indices: null,
    tLoadMask_chart: null,
    tLoadMask_time: null,
    tLabel_previous: null,
    tLabel_High: null,
    tLabel_Low: null,
    tLabel_Name: null,
    tAjax_Indices: null,
    tAjax_Time: null,
    tAjax_chart: null,
    title: languageFormat.getLanguage(20029, 'Indices'),
    mainPanel: null,
    page: 0,
    transCount: 100,
    slcomp: "in",
    winConfig: {
        width: 900,
        height: 400,
        resizable: true
    },
    autoLoad: true,
    type: 'in',
    savingComp: true,
    feedScreen: true,
    codeList: [],
    initComponent: function() {
        var panel = this;

        panel.thisPanelId = panel.getId() + "_indices_";
        panel.isTabLayout = n2nLayoutManager.isTabLayout();

        var defaultConfig = {
            header: false,
            border: false,
            width: '100%',
            bodyStyle: 'padding: 0px; margin: 0px; font-size: 12pt;  overflow-y: auto;',
            items: [panel.mainPanel],
            listeners: {
                resize: function(thisComp, newWidth, newHeight, oldWidth, oldHeight) {
                    var prevLayout = panel.isTabPanel;
                    
                    if (oldWidth) {
                        panel.newOpen = false;
                    }
                    
                    if (newWidth <= 650) {
                        panel.isTabPanel = true;
                    } else {
                        panel.isTabPanel = false;
                    }

                    if (prevLayout != panel.isTabPanel) {
                        panel._createMainPanel();
                    } else {
                        var prevHeight = panel.ctHeight;
                        panel._calculateHeight();
                        if (prevHeight != panel.ctHeight) {
                            panel.tGrid_Indices.setHeight(panel.ctHeight);
                            panel.tChartMain_Panel.setHeight(panel.ctHeight);
                            if (panel.tChart_panel) {
                                panel.tChart_panel.setHeight(panel.getChartHeight());
                            }
                            panel.tGrid_TimeSales.setHeight(panel.ctHeight);
                        }
                    }
                }
            }
        };

        Ext.apply(this, defaultConfig);
        this.callParent(arguments);
    },
    _createMainPanel: function() {
        var panel = this;

        panel.removeAll();
        panel._calculateHeight();
        panel._createIndicesPanel();
        panel._createChartPanel();
        panel._createTimePanel();

        var mainItems = [
            panel.tGrid_Indices,
            panel.tChartMain_Panel,
            panel.tGrid_TimeSales
        ];

        var mainType = 'Ext.container.Container';
        var mainConf = {
            width: '100%',
            border: false,
            defaults: {
                bodyStyle: ' border: none; ',
                style: 'font-family: Helvetica,Verdana; font-weight: bold; font-size:9pt;'
            },
            items: mainItems,
            listeners: {
                beforedestroy: function(thisComp) {
                    panel.mainPanel = null;
                },
                afterrender: function(thisComp) {
                    panel.tLoadMask_main = thisComp.setLoading(languageFormat.getLanguage(10017, 'Loading...')).hide();
                    // panel._procLoadMask("global", "open"); //TODO

                    if (panel.autoLoad) {
                        panel._procCallIndices();
                    }

                    var firstLoad = true;
                    if (n2nLayoutManager.isTabLayout() && isStockChart) {
                        panel.up().on("beforedeactivate", function() {
                            panel.tChart_panel.refresh("");
                            firstLoad = false;
                        });
                        panel.up().on("activate", function() {
                            if (!firstLoad) {
                                panel.refresh();
                            }
                        });
                    }

                }
            }
        };

        if (panel.isTabPanel) {
            mainType = 'Ext.tab.Panel';
            mainConf.layout = 'fit';
            mainConf.listeners.tabchange = function(thisComp, newTab) {
                if (newTab.itemId == "indices_chart") {
                    var selection = panel.tGrid_Indices.getSelectionModel().getSelection();
                    if (selection.length > 0) {
                        var dataObj = selection[0].getData();
                        panel._updateLabel(dataObj);
                        panel._procCallChart();
                    }
                } else if (newTab.itemId == "indices_timesales") {
                    panel._procCallTime();
                }
            };
        } else {
            mainConf.layout = 'column';
        }

        panel.mainPanel = Ext.create(mainType, mainConf);

        panel.add(panel.mainPanel);
    },
    _calculateHeight: function() {
        var panel = this;

        var pHeight = panel.up().body.getHeight();
        panel.ctHeight = pHeight;
        if (panel.isTabPanel) {
            panel.ctHeight -= 27;
        }
    },
    /**
     * Description <br/>
     * 
     * 		create indices grid panel
     * 		
     */
    _createIndicesPanel: function( ) {
        var panel = this;

        var store = new Ext.data.Store({
            model: 'TCPlus.model.Indices'
        });

        panel.tGrid_Indices = Ext.create('Ext.grid.Panel', {
            title: languageFormat.getLanguage(20029, 'INDICES').toUpperCase(),
            header: !panel.isTabPanel,
            store: store,
            border: !panel.isTabPanel,
            enableColumnMove: false,
            height: panel.ctHeight,
            enableColumnResize: true,
            columnWidth: 0.4,
            selModel: {
                preventFocus: true
            },
            listeners: {
                afterrender: function(thisComp) {
                    panel.tLoadMask_indices = thisComp.setLoading(languageFormat.getLanguage(10017, 'Loading...')).hide();
                },
                beforedestroy: function() {
                    panel.tGrid_Indices = null;
                },
                selectionchange: function(thisComp, selected) {
                    if (selected.length > 0) {
                        panel.beginNumber = 0;
                        panel.endNumber = 0;
                        panel.eventType = '';
                        panel.chartStockCode = selected[0].data[fieldStkCode];
                        panel.chartStockName = selected[0].data[fieldStkName];
                        if (!panel.isTabPanel) {
                            panel._procCallChart();
                            panel._procCallTime();
                        }
                    }
                },
                headerclick: function(ct, col) {
                    var w = this.getWidth();
                    if (moColToggIndices && col.dataIndex != fieldStkName && w < 400) {
                        var lockIndex = 0;
                        var colVisible = "";
                        if (col.dataIndex == fieldLacp) {
                            colVisible = lockIndex + 1;

                        } else if (col.dataIndex == fieldLast) {
                            colVisible = lockIndex;
                        } else if (col.dataIndex == fieldChange) {
                            colVisible = lockIndex + 3;
                        } else if (col.dataIndex == fieldChangePer) {
                            colVisible = lockIndex + 2;
                        }
                        ct.getHeaderAtIndex(colVisible).setVisible(true);
                        col.setVisible(false);
                    }
                },
                resize: function(thisComp, w, h, ow, oh) {
                    if (moColToggIndices) {
                        var panel = this, perName = 0, perPrevCurrent = 0, prevCurrent = 0, chgChgPer = 0, numberColumns = 2;
                        w = w - 2 - Ext.getScrollbarSize().width;
                        perName = (100 * panel.columns[0].getWidth()) / w;
                        perPrevCurrent = 100 - perName;

                        if (w >= 400) {
                            numberColumns = 4;
                            panel.columns[1].sortable = true;
                            panel.columns[2].sortable = true;
                            panel.columns[3].sortable = true;
                            panel.columns[4].sortable = true;
                            panel.columns[1].setVisible(true);
                            panel.columns[2].setVisible(true);
                            panel.columns[3].setVisible(true);
                            panel.columns[4].setVisible(true);
                        } else {
                            var t = 0;
                            for (var i = 1; i <= 4; i++) {
                                if (panel.columns[i].isVisible) {
                                    t++;
                                }
                            }
                            if (t > 2) {
                                panel.columns[1].sortable = false;
                                panel.columns[2].sortable = false;
                                panel.columns[3].sortable = false;
                                panel.columns[4].sortable = false;
                                panel.columns[2].setVisible(false);
                                panel.columns[4].setVisible(false);
                            }
                        }
                        prevCurrent = (w * (perPrevCurrent / numberColumns + 2)) / 100;
                        chgChgPer = (w * (perPrevCurrent / numberColumns - 2)) / 100;
                        panel.columns[1].setWidth(prevCurrent);
                        panel.columns[2].setWidth(prevCurrent);
                        panel.columns[3].setWidth(chgChgPer);
                        panel.columns[4].setWidth(chgChgPer);
                    }
                    
                }
            },
            columns: [
                {
                    text: languageFormat.getLanguage(10701, 'Name'),
                    width: 120,
                    menuDisabled: true,
                    minWidth: 120,
                    sortable: true,
                    locked: true,
                    dataIndex: fieldStkName,
                    //resizable: false,
                    renderer: function(value, meta, record) {

                        var cssClass = N2NCSS.CellDefault;
                        cssClass += " " + N2NCSS.FontString;
                        cssClass += " " + N2NCSS.FontUnChange;
                        meta.css = cssClass;

                        var idx = value.lastIndexOf('.');
                        if (idx != -1) {
                            value = value.substring(0, idx);
                        }

                        return value;
                    }
                },
                {
                    text: languageFormat.getLanguage(20058, 'Prev'),
                    lockable: false,
                    menuDisabled: true,
                    width: 95,
                    sortable: !moColToggIndices,
                    dataIndex: fieldLacp,
                    align: 'right',
                    renderer: function(value, meta, record) {
                        var cssClass = N2NCSS.CellDefault;
                        cssClass += " " + N2NCSS.FontString + " " + N2NCSS.FontUnChange;

                        meta.css = cssClass;
                        return isNaN(value) ? '-' : Ext.util.Format.number(value, '0,000.000');
                    }
                },
                {
                    text: languageFormat.getLanguage(11022, 'Current'),
                    lockable: false,
                    menuDisabled: true,
                    width: 95,
                    sortable: !moColToggIndices,
                    dataIndex: fieldLast,
                    hidden: moColToggIndices,
                    align: 'right',
                    renderer: function(value, meta, record) {

                        var cssClass = N2NCSS.CellDefault;
                        cssClass += " " + N2NCSS.FontString + " " + N2NCSS.FontUnChange;

                        meta.css = cssClass;

                        return isNaN(value) ? '-' : formatutils.formatNumber(value, 1000);
                    }
                },
                {
                    text: languageFormat.getLanguage(11023, 'Change'),
                    width: 75,
                    lockable: false,
                    menuDisabled: true,
                    sortable: !moColToggIndices,
                    dataIndex: fieldChange,
                    align: 'right',
                    renderer: function(value, meta, record) {

                        var cssClass = N2NCSS.CellDefault;
                        cssClass += " " + N2NCSS.FontString;

                        if (parseFloat(value) > 0)
                            cssClass += " " + N2NCSS.FontUp;
                        else if (parseFloat(value) < 0)
                            cssClass += " " + N2NCSS.FontDown;
                        else
                            cssClass += " " + N2NCSS.FontUnChange;

                        meta.css = cssClass;

                        return isNaN(value) ? '-' : value;
                    }

                },
                {
                    text: languageFormat.getLanguage(10116, 'Chg %'),
                    width: 75,
                    sortable: !moColToggIndices,
                    menuDisabled: true,
                    lockable: false,
                    dataIndex: fieldChangePer,
                    hidden: moColToggIndices,
                    align: 'right',
                    renderer: function(value, meta, record) {

                        var cssClass = N2NCSS.CellDefault;
                        cssClass += " " + N2NCSS.FontString;

                        if (parseFloat(value) > 0)
                            cssClass += " " + N2NCSS.FontUp;
                        else if (parseFloat(value) < 0)
                            cssClass += " " + N2NCSS.FontDown;
                        else
                            cssClass += " " + N2NCSS.FontUnChange;

                        meta.css = cssClass;

                        return isNaN(value) ? '-' : value;
                    }
                }

            ]
        });

    },
    /**
     * Description <br/>
     * 
     * 
     * 		create time and sales grid panel
     * 
     */
    _createTimePanel: function( ) {
        var panel = this;

        panel.tRecord_TimeSales = Ext.create('TCPlus.model.TransactionRecord');

        var store = new Ext.data.Store({
            model: 'TCPlus.model.TransactionRecord',
            sorters: [{
                    property: fieldTransNo,
                    direction: 'DESC'
                }]
        });
        panel.tButton_Last = new Ext.Button({
            iconCls: 'x-tbar-page-last',
            tooltip: languageFormat.getLanguage('10050', 'Last'),
            disabled: true,
            handler: function() {
                panel.eventType = "last";
                panel.page = panel._getLastPage();
                panel._procCallTime();
            }
        });

        // paging previous button
        panel.tButton_Previous = new Ext.Button({
            iconCls: 'x-tbar-page-prev',
            tooltip: languageFormat.getLanguage('10049', 'Previous'),
            disabled: true,
            handler: function() {
                panel.eventType = "prev";
                if (panel.page > 0) {
                    panel.page = panel.page - 1;
                }
                panel._procCallTime();
            }
        });

        // paging next button
        panel.tButton_Next = new Ext.Button({
            iconCls: 'x-tbar-page-next',
            tooltip: languageFormat.getLanguage('10015', 'Next'),
            disabled: true,
            handler: function() {
                panel.eventType = "next";
                if (panel.page < panel._getLastPage()) {
                    panel.page = panel.page + 1;
                }
                panel._procCallTime();
            }
        });

        panel.tButton_First = new Ext.Button({
            iconCls: 'x-tbar-page-first',
            tooltip: languageFormat.getLanguage('10048', 'First'),
            disabled: true,
            handler: function() {
                panel.beginNumber = 0;
                panel.endNumber = 0;
                panel.totalNumber = 0;
                panel.totalRecord = 0;
                panel.page = 0;

                panel.eventType = "first";
                panel._procCallTime();
            }
        });
        panel.tGrid_TimeSales = new Ext.grid.Panel({
            title: languageFormat.getLanguage(20155, 'TIME & SALES').toUpperCase(),
            itemId: 'indices_timesales',
            header: !panel.isTabPanel,
            border: !panel.isTabPanel,
            enableColumnMove: false,
            height: panel.ctHeight,
            autoScroll: true,
            enableHdMenu: false,
            stripeRows: true,
            frame: false,
            store: store,
            viewConfig: {
                scrollOffset: 25,
                forceFit: true
            },
            columnWidth: 0.2,
            selModel: {
                preventFocus: true
            },
            listeners: {
                afterrender: function(thisComp) {
                    panel.tLoadMask_time = thisComp.setLoading(languageFormat.getLanguage(10017, 'Loading...')).hide();
                },
                beforedestroy: function() {
                    panel.tGrid_TimeSales = null;
                }
            },
            bbar: [
                new Ext.Button({
                    text: languageFormat.getLanguage(10003, 'Reset'),
                    icon: icoBtnReset,
                    listeners: {
                        click: function() {
                            panel.beginNumber = 0;
                            panel.endNumber = 0;
                            panel.totalNumber = 0;
                            panel.totalRecord = 0;
                            panel.page = 0;
                            panel.eventType = "refresh";
                            panel._procCallTime();
                        }
                    }
                }),
                '->',
                panel.tButton_First,
                panel.tButton_Previous,
                panel.tButton_Next,
                panel.tButton_Last
            ],
            columns: {
                defaults: {
                    menuDisabled: true
                },
                items: [
                    {
                        text: languageFormat.getLanguage(10123, 'Time'),
                        width: 70,
                        sortable: true,
                        dataIndex: fieldTime,
                        align: 'right',
                        renderer: function(value, meta, record) {

                            if (value.length < 6) {
                                value = '0' + value;
                            }

                            var val_a = value.substr(0, 2);
                            var val_b = value.substr(2, 2);
                            var val_c = value.substr(4, 2);
                            value = val_a + ':' + val_b + ':' + val_c;


                            var cssClass = N2NCSS.CellDefault;
                            cssClass += " " + N2NCSS.FontString;

                            var tempLacp = record.data[fieldLacp];
                            tempLacp = parseFloat(tempLacp);

                            meta.css = cssClass;

                            return value;
                        }
                    }, {
                        text: languageFormat.getLanguage(11021, 'Index value'),
                        minWidth: 80,
                        maxWidth: 120,
                        flex: 1,
                        sortable: true,
                        dataIndex: fieldLast,
                        align: 'right',
                        renderer: function(value, meta, record) {

                            var cssClass = N2NCSS.CellDefault;
                            cssClass += " " + N2NCSS.FontString;

                            var tempLacp = record.data[fieldLacp];
                            tempLacp = parseFloat(tempLacp);

                            if (parseFloat(value) > tempLacp)
                                cssClass += " " + N2NCSS.FontUp;
                            else if (parseFloat(value) < tempLacp && parseFloat( value ) != 0)
                                cssClass += " " + N2NCSS.FontDown;
                            else
                                cssClass += " " + N2NCSS.FontUnChange;

                            meta.css = cssClass;
                            return formatutils.formatNumber(value, 1000);
                        }
                    }
                ]}
        });
    },
    /**
     * Description <br/>
     * 
     * 
     * 		create chart panel
     * 
     */
    _createChartPanel: function( ) {
        var panel = this;
        var htmlDesign = "";
        htmlDesign += "<table cellspacing='0' cellpadding='0' border='0' style=' width: 100%;font-size:12px;'>";

        htmlDesign += "<tr>";
        htmlDesign += "<td colspan='4' ><div style='float:left;' id='" + panel.thisPanelId + "_name'></div> <div style='float:right;' id='" + panel.thisPanelId + "_button'></div></td>";
        //   htmlDesign += "<td colspan='2' id='" + panel.thisPanelId + "_button'> </td>";
        htmlDesign += "</tr>";
        if (!panel.isTabPanel) {
            htmlDesign += "<tr height='20'>";
        } else {
            htmlDesign += "<tr height='45'>";
        }
        htmlDesign += "<td colspan='1' id='" + panel.thisPanelId + "_previous'> </td>";
        htmlDesign += "<td colspan='1' id='" + panel.thisPanelId + "_High'> </td>";
        htmlDesign += "<td colspan='1' id='" + panel.thisPanelId + "_Low'> </td>";
        htmlDesign += "<td colspan='1' id='" + panel.thisPanelId + "_Open'> </td>";
        htmlDesign += "</tr>";

        htmlDesign += "<tr>";
        htmlDesign += "<td colspan='4' id='" + panel.thisPanelId + "_chart'>  </td>";
        htmlDesign += "</tr>";

        htmlDesign += "</table>";


        panel.tChartMain_Panel = Ext.create('Ext.panel.Panel', {
            title: languageFormat.getLanguage(20154, 'MOVEMENT & CHARTS').toUpperCase(),
            itemId: 'indices_chart',
            width: '100%',
            header: !panel.isTabPanel,
            height: panel.ctHeight,
            border: true,
            defaults: {
                bodyStyle: ' border: none;  ',
                style: 'margin: 0; font-family: Helvetica,Verdana; font-weight: bold; font-size: 9pt;padding:3px; '
            },
            items: [{html: htmlDesign}],
            columnWidth: 0.4,
            listeners: {
                afterrender: function(thisComp) {
                    panel.tLabel_High = new Ext.form.Label({
                        text: languageFormat.getLanguage(10107, 'High') + ' : - ',
                        renderTo: panel.thisPanelId + '_High'
                    });

                    panel.tLabel_Low = new Ext.form.Label({
                        text: languageFormat.getLanguage(10108, 'Low') + ' : - ',
                        renderTo: panel.thisPanelId + '_Low'
                    });

                    panel.tLabel_previous = new Ext.form.Label({
                        text: languageFormat.getLanguage(20058, 'Prev') + ' : - ',
                        renderTo: panel.thisPanelId + '_previous'
                    });

                    panel.tLabel_Name = new Ext.form.Label({
                        text: languageFormat.getLanguage(20153, 'CONSUMER INDEX').toUpperCase() + ' : - ',
                        renderTo: panel.thisPanelId + '_name'
                    });
                    panel.tLabel_Open = new Ext.form.Label({
                        text: languageFormat.getLanguage(10104, 'Open') + ' : - ',
                        renderTo: panel.thisPanelId + '_Open'
                    });
                    
                    var analysisBtn = Ext.create('Ext.button.Button', {
                        //text: 'H',
                        icon: iconIndicesHistorical,
                        tooltip: languageFormat.getLanguage('20102', 'Analysis chart'),
                        renderTo: panel.thisPanelId + '_button',
                        cls: 'fix_btn',
                        style: 'margin-right: 5px',
                        handler: function() {
                            panel.openAnalysisChart(true);
                        }
                    });
                    var tempButton = new Ext.button.Button({
                        text: languageFormat.getLanguage(10008, 'Refresh'),
                        icon: icoBtnReset,
                        renderTo: panel.thisPanelId + '_button',
                        cls: 'fix_btn',
                        listeners: {
                            click: function() {
                                panel._procCallChart();
                            }
                        }
                    });

                    var stkChart = Ext.widget('stockchartbtn', {
                        renderTo: panel.thisPanelId + '_button',
                        margin: '0 0 0 5',
                        chartMode: 'h',
                        handler: function(thisBtn) {
                            thisBtn.loadStockChart(panel.chartStockCode);
                        }
                    });
                    if (!isStockChart) {
                        panel.tChart_panel = Ext.create('Ext.container.Container', {
                            border: false,
                            height: panel.getChartHeight(),
                            style: ' margin: 0 0 0 0; ',
                            renderTo: panel.thisPanelId + '_chart',
                            listeners: {
                                afterrender: function(thisComp) {
                                    panel.tLoadMask_chart = thisComp.setLoading(languageFormat.getLanguage(10017, 'Loading...')).hide();
                                }
                            }
                        });
                    } else {
                        panel.tChart_panel = Ext.create('Ext.ux.IFrame', {
                            renderTo: panel.thisPanelId + '_chart',
                            height: panel.getChartHeight(),
                            iframeBorder: false,
                            border: false,
                            style: 'margin: 0 0 0 0;',
                            listeners: {
                                afterrender: function(thisComp) {
                                    panel.tLoadMask_chart = thisComp.setLoading(languageFormat.getLanguage(10017, 'Loading...')).hide();
                                }
                            }

                        });
                    }
                },
                beforedestroy: function() {
                    panel.tChartMain_Panel = null;
                }
            }
        });
    },
    /**
     * Description <br/>
     * 
     * 
     * 		process indices ajax request
     * 
     */
    _procCallIndices: function(background) {
        var panel = this;
        panel.autoLoad = true;

        if (panel.tAjax_Indices != null) {
            return;
        }
        
        if (!background) {
            panel._procLoadMask("indices", "open");
        }
        var excode = exchangecode == 'MY' ? 'KL' : exchangecode;

        panel.tAjax_Indices = {
            ex: excode,
            success: function(obj) {
                if (!background) {
                    panel._procLoadMask("indices", "close");
                }

                try {
                    obj.t = typeIndex;

                    if (obj.s) {
                        panel._updateIndices(obj.d);

                        if (obj.c == 0) {
                            helper.setGridEmptyText(panel.tGrid_Indices, languageFormat.getLanguage(30013, 'No result found.'));
                            panel.tChart_panel.update('<div class="x-grid-empty">' + languageFormat.getLanguage(30902, 'Chart is not available.') + '</div> ');
                            helper.setGridEmptyText(panel.tGrid_TimeSales, languageFormat.getLanguage(30013, 'No result found.'));
                        }

                    } else {
                        helper.setGridEmptyText(panel.tGrid_Indices, languageFormat.getLanguage(30013, 'No result found.'));
                    }

                } catch (e) {
                    helper.setGridEmptyText(panel.tGrid_Indices, languageFormat.getLanguage(30013, 'No result found.'));
                }

                panel.tAjax_Indices = null;
            }
        };



        conn.getIndices(panel.tAjax_Indices);
    },
    /**
     * Description <br/>
     * 
     * 
     * 		process chart ajax request
     * 
     */
    _procCallChart: function() {
        var panel = this;

        if (!panel.chartStockCode) {
            return;
        }

        if (!isStockChart) {
            var panelSize = panel.tChartMain_Panel.getSize();

            panel._procLoadMask("chart", "open");

            var url = addPath + 'tcplus/intradaychart?';
            url += 'k=';
            url += panel.chartStockCode;
            url += '&w=';
            url += panelSize.width - 5;
            url += '&h=';
            url += panelSize.height - 85;
            url += '&ex=';
            url += exchangecode;
            url += '&t=l';
            url += '&c=';
            url += formatutils.procThemeColor();

            var excode = getStkExCode(panel.chartStockCode);

            panel.tAjax_chart = Ext.Ajax.request({
                url: url,
                timeout: 10000,
                success: function(response) {
                    try {

                        var obj = Ext.decode(response.responseText);

                        if (obj.s) {
                            var tempNewObj = '<img src="' + obj.d + '?' + Math.random() + '" alt="Intraday Chart"/>';
                            panel.tChart_panel.update(tempNewObj);
                        } else {
                            panel.tChart_panel.update(' <div class="x-grid-empty">' + languageFormat.getLanguage(30902, 'Chart is not available') + '</div> ');
                        }

                    } catch (e) {
                        panel.tChart_panel.update(' <div class="x-grid-empty">' + languageFormat.getLanguage(30117, 'We regret to inform that we are unable to process your request at this time. Kindly try again shortly.') + '</div> ');
                    }

                    panel._procLoadMask("chart", "close");
                    panel.tAjax_chart = null;
                },
                failure: function(response) {
                    panel.tChart_panel.update(' <div class="x-grid-empty">' + languageFormat.getLanguage(30117, 'We regret to inform that we are unable to process your request at this time. Kindly try again shortly.') + '</div> ');

                    panel._procLoadMask("chart", "close");
                    panel.tAjax_chart = null;
                }
            });
        } else {
        	 // Removes delayed exchange suffix. Determine whether exchange is delayed based on param 'View'
            var nonDelayCode = stockutil.removeStockDelay(panel.chartStockCode);
            var stkParts = stockutil.getStockParts(nonDelayCode);
            var stockcode = stkParts.code; //stockutil.getStockPart(panel.chartStockCode);
            var exchg = stkParts.exch; //stockutil.getExchange(panel.chartStockCode);
            var charturl = embeddedStockChartURL + "?code=" + stockcode + '&Name=' + encodeURIComponent(stockutil.getStockName(panel.chartStockName)) + "&exchg=" + exchg + "&isstock=N&mode=d&color=" 
            				+ formatutils.procThemeColor() + '&lang=' + global_Language + '&View=' + (stockutil.isDelayStock(panel.chartStockCode) ? 'D' : 'R')
                                        + '&type=in&newOpen=' + (jsutil.boolToStr(panel.newOpen, '1', '0'));
            panel.tChart_panel.refresh(charturl);

            panel.tLoadMask_chart.hide();

        }
        
    },
    openAnalysisChart: function(isIndices) {
        createAnalysisChartPanel(this.chartStockCode, this.chartStockName, null, null, null, null, null, null, isIndices);
    },
    /**
     * Description <br/>
     * 
     * 
     * 		process time and sales ajax request
     * 
     */
    _procCallTime: function() {
        var panel = this;

        if (!panel.chartStockCode) {
            return;
        }
        panel._procLoadMask("time", "open");
        if (stockutil.isDelayStock(panel.chartStockCode)) {
            conn.getTransactionNum({
                k: panel.chartStockCode,
                success: function(response) {
                    if (response.d.length > 0) {
                        var totalTran = response.d[0][fieldTransNo];
                        // update total number and end number
                        panel.totalNumber = totalTran;
                        panel.endNumber = totalTran;
                        panel._getTransaction();
                    } else {
                        helper.setGridEmptyText(panel.tGrid_TimeSales, languageFormat.getLanguage(30013, 'No result found.'));
                        panel._procLoadMask("time", "close");
                        panel.tAjax_Time = null;
                    }
                }
            });
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
            var record = panel.tGrid_Indices.store.getById(panel.chartStockCode);

            if (record != null) {
                panel.endNumber = record.data[fieldTransNo] == null ? 0 : record.data[fieldTransNo];
                panel.totalNumber = record.data[fieldTransNo] == null ? 0 : record.data[fieldTransNo];

                if (panel.endNumber > 100) {
                    panel.beginNumber = panel.endNumber - 100;
                }
            }
        }

        conn.getTransaction({
            begin: panel.beginNumber,
            end: panel.endNumber,
            total: panel.totalNumber,
            k: panel.chartStockCode,
            eventType: panel.eventType,
            p: panel.page,
            success: function(obj) {
                try {
                    if (obj.s) {
                        //panel.currentTranNo = obj.info.endNumber;                      
                        panel._updateTime(obj.d, obj.info.info);
                    } else {
                        helper.setGridEmptyText(panel.tGrid_TimeSales, languageFormat.getLanguage(30013, 'No result found.'));
                    }
                    if (obj.info) {
                        panel._procPagingButton(obj.info, obj.d.length);
                    }
                } catch (e) {
                    helper.setGridEmptyText(panel.tGrid_TimeSales, languageFormat.getLanguage(30013, 'No result found.'));
                }

                panel._procLoadMask("time", "close");
                panel.tAjax_Time = null;
            }
        });
    },
    /** 
     * Description <br/>
     * 
     * 		recall all ajax 
     * 
     */
    refresh: function() {
        var panel = this;

        // reset stock code
        panel.chartStockCode = null;
        panel.chartStockName = null;
        panel._clearLabel();
        panel.tGrid_Indices.getStore().removeAll();
        panel.clearChart();
        panel.tGrid_TimeSales.getStore().removeAll();

        panel._procCallIndices();
    },
    switchRefresh: function(silent) {
        this._procCallIndices(silent);
    },
    /**
     * Description <br/>
     * 
     * 		update indices grid record and time and sales record
     * 
     * @param {object / json}  obj
     */
    updateIndices: function(obj) {
        var panel = this;

        var lockIndex = 0;
        for (var i = 0; i < obj.d.length; i++) {
            var dataObj = obj.d[i];

            var record = panel.tGrid_Indices.store.getById(dataObj[fieldStkCode]);
            var rowIndex = panel.tGrid_Indices.store.indexOfId(dataObj[fieldStkCode]);


            if (record != null && rowIndex != -1) {
                var newValue_last = dataObj[fieldLast];
                var newValue_lacp = dataObj[fieldLacp];

                var oldValue_last = record.data[fieldLast];

                if (newValue_lacp != null) {
                    record.data[fieldLacp] = newValue_lacp;
                    N2NUtil.updateCell(panel.tGrid_Indices, rowIndex, 0 + lockIndex, Ext.util.Format.number(newValue_lacp, '0,000.000'), cssClass);
                    Blinking.setBlink(panel.tGrid_Indices, rowIndex, 0 + lockIndex, "up");
                } else {
                    newValue_lacp = record.data[fieldLacp];
                    // use previous lacp if no update
                    dataObj[fieldLacp] = newValue_lacp;
                }

                if (newValue_last != null) {
                    record.data[fieldLast] = newValue_last;

                    var cssClass = " " + N2NCSS.FontString;

                    if (parseFloat(newValue_last) > parseFloat(newValue_lacp))
                        cssClass += " " + N2NCSS.FontUp;
                    else if (parseFloat(newValue_last) < parseFloat(newValue_lacp) && parseFloat( newValue_last ) != 0)
                        cssClass += " " + N2NCSS.FontDown;
                    else
                        cssClass += " " + N2NCSS.FontUnChange;

                    N2NUtil.updateCell(panel.tGrid_Indices, rowIndex, 1 + lockIndex, formatutils.formatNumber(newValue_last, 1000), cssClass);

                    if (parseFloat(newValue_last) > parseFloat(oldValue_last))
                        Blinking.setBlink(panel.tGrid_Indices, rowIndex, 1 + lockIndex, "up");

                    else if (parseFloat(newValue_last) < parseFloat(oldValue_last))
                        Blinking.setBlink(panel.tGrid_Indices, rowIndex, 1 + lockIndex, "down");

                }

                if (dataObj[fieldLast] != null && dataObj[fieldLacp] != null) {
                    var newValue_change = formatutils.procChangeValue(dataObj);
                    dataObj[fieldChange] = newValue_change;
                    var newValue_changePer = formatutils.procChangePercValue(dataObj);

                    var cssClass = " " + N2NCSS.FontString;
                    if (parseFloat(newValue_change) > 0)
                        cssClass += " " + N2NCSS.FontUp;
                    else if (parseFloat(newValue_change) < 0)
                        cssClass += " " + N2NCSS.FontDown;
                    else
                        cssClass += " " + N2NCSS.FontUnChange;
                    N2NUtil.updateCell(panel.tGrid_Indices, rowIndex, 2 + lockIndex, newValue_change, cssClass);
                    N2NUtil.updateCell(panel.tGrid_Indices, rowIndex, 3 + lockIndex, newValue_changePer, cssClass);

                    if (parseFloat(newValue_change) > record.data[fieldChange]) {
                        Blinking.setBlink(panel.tGrid_Indices, rowIndex, 2 + lockIndex, "up");
                        Blinking.setBlink(panel.tGrid_Indices, rowIndex, 3 + lockIndex, "up");

                    } else if (parseFloat(newValue_change) < record.data[fieldChange]) {
                        Blinking.setBlink(panel.tGrid_Indices, rowIndex, 2 + lockIndex, "down");
                        Blinking.setBlink(panel.tGrid_Indices, rowIndex, 3 + lockIndex, "down");
                    }

                    record.data[fieldChange] = newValue_change;
                    record.data[fieldChangePer] = newValue_changePer;
                }



                if (panel.chartStockCode == dataObj[fieldStkCode]) {

                    if (dataObj[fieldTransNo] != null) {
                        var tempData = {};
                        tempData[fieldTransNo] = dataObj[fieldTransNo];
                        tempData[fieldTime] = dataObj[fieldTime];
                        tempData[fieldLast] = dataObj[fieldLast];


                        if (parseInt(dataObj[fieldTransNo]) > (panel.endNumber)) {

                            if (panel.tGrid_TimeSales.store.getCount() == 0) {
                                panel._procCallTime();

                            } else {

                                record.data[fieldTransNo] = dataObj[fieldTransNo];
                                panel.tGrid_TimeSales.store.addSorted(new TCPlus.model.TransactionRecord(tempData));

                                if (panel.tGrid_TimeSales.store.getCount() > parseInt(panel.totalRecord)) {
                                    panel.tGrid_TimeSales.store.removeAt(panel.tGrid_TimeSales.store.getCount() - 1);
                                }

                                panel.endNumber = parseInt(dataObj[fieldTransNo]);

                                if (panel.totalRecord < panel.endNumber) {
                                    panel.beginNumber += 1;
                                }
                            }

                        }
                        //					   
                        //					   if ( parseInt( dataObj[fieldTransNo] ) > panel.currentTranNo ) {
                        //						   panel.currentTranNo = parseInt( dataObj[fieldTransNo] );
                        //						   var tempParsedValue = parseFloat(dataObj[fieldLast]);
                        //						   dataObj[fieldLast] = tempParsedValue;
                        //
                        //						   var newRecord = new panel.tRecord_TimeSales( dataObj );
                        //						   panel.tGrid_TimeSales.store.addSorted( newRecord );
                        //					   }
                    }

                    panel._updateLabel(dataObj);
                }
            }
        }

    },
    /**
     * Description <br/>
     * 
     * 
     * 		update indices grid panel record
     * 
     * 
     * @param {object / json}  dataObj
     */
    _updateIndices: function(dataObj) {
        var panel = this;

        panel.codeList = [];
        

        for (var i = 0; i < dataObj.length; i++) {
            dataObj[i][fieldChange] = formatutils.procChangeValue(dataObj[i]);
            dataObj[i][fieldChangePer] = formatutils.procChangePercValue(dataObj[i]);
            panel.codeList.push(dataObj[i][fieldStkCode]);
        }
        
        panel.tGrid_Indices.store.loadData(dataObj);
        
        var sm = panel.tGrid_Indices.getSelectionModel();
        var selected = sm.getSelection();
        if (selected.length > 0) { // select previous record (to force refreshing chart and time&sale)
            sm.deselectAll(true);
            sm.select(selected);
        } else {
            sm.select(0);
        }
        
        panel.firstLoad = false;
        Storage.refresh();
        
           if (!N2N_CONFIG.activeSub || helper.activeView(panel)) {
               panel.subscribeIndices();
           }

    },
    subscribeIndices: function() {
        var panel = this;

        conn.subscribeIndices(panel.codeList);
        panel.inactive = false;
    },
    /**
     * Description <br/>
     * 
     * 
     * 		update time and sales grid panel record
     * 
     * @param {object / json}  dataObj
     * @param {object / json}  dataInfo
     */
    _updateTime: function(dataObj, dataInfo) {
        var panel = this;

//        for (var i = 0; i < dataObj.length; i++) {
//            if (parseInt(dataObj[i][fieldTransNo]) > panel.currentTranNo) {
//                panel.currentTranNo = parseInt(dataObj[i][fieldTransNo]);
//            }
//        }

        var newObj = {};
        newObj.s = true;
        newObj.c = dataObj.length;
        newObj.d = dataObj;

        panel.tGrid_TimeSales.getStore().loadRawData(newObj);
        panel.tGrid_TimeSales.getSelectionModel().select(0);

        panel._updateLabel(dataInfo);
    },
    /**
     * Description <br/>
     * 
     * 		update label value
     * 
     * @param {object / json}  dataObj
     */
    _updateLabel: function(dataObj) {
//        console.log("update Label");
//        console.log(dataObj);
        var panel = this;

        if (dataObj != null) {
            var value_stockCode = dataObj[fieldStkCode];

            var value_high = dataObj[fieldHigh];
            var value_low = dataObj[fieldLow];
            var value_previous = dataObj[fieldPrev];
            var value_open = dataObj[fieldOpen];
            var value_lacp = dataObj[fieldLacp];

            var cssClass_Low = "";
            var cssClass_High = "";
            if (parseFloat(value_high) > parseFloat(value_previous)) {
                cssClass_High = N2NCSS.FontUp;

            } else if (parseFloat(value_high) < parseFloat(value_previous) && parseFloat( value_high ) != 0) {
                cssClass_High = N2NCSS.FontDown;

            } else if (parseFloat(value_high) == parseFloat(value_previous)) {
                cssClass_High = N2NCSS.FontUnChange;
            }

            if (parseFloat(value_low) > parseFloat(value_previous)) {
                cssClass_Low = N2NCSS.FontUp;

            } else if (parseFloat(value_low) < parseFloat(value_previous) && parseFloat( value_low ) != 0) {
                cssClass_Low = N2NCSS.FontDown;

            } else if (parseFloat(value_low) == parseFloat(value_previous)) {
                cssClass_Low = N2NCSS.FontUnChange;
            }
            var cssClass_Open = " " + N2NCSS.FontString;

            if (parseFloat(value_open) > parseFloat(value_lacp))
                cssClass_Open += " " + N2NCSS.FontUp;
            else if (parseFloat(value_open) < parseFloat(value_lacp) && parseFloat( value_open ) != 0)
                cssClass_Open += " " + N2NCSS.FontDown;
            else
                cssClass_Open += " " + N2NCSS.FontUnChange;
            var record = panel.tGrid_Indices.store.getById(value_stockCode);

            if (value_high != null && value_low != null && value_previous != null && panel.tChartMain_Panel) {
                var name = !panel.isTabPanel ? languageFormat.getLanguage(20153, 'CONSUMER INDEX').toUpperCase() + " : " : "";
                panel.tLabel_Name.update("<label> " + name + " </label> 		<label>  " + record.data[fieldStkFName] + " </label> ");
                panel.tLabel_previous.update("<label> " + languageFormat.getLanguage(20058, 'Prev') + " : </label> 				<label> " + formatutils.formatNumber(value_previous, 1000) + " </label> ");
                panel.tLabel_High.update("<label> " + languageFormat.getLanguage(10107, 'High') + " : </label> 				<label class='" + cssClass_High + "'>  " + formatutils.formatNumber(value_high, 1000) + " </label> ");
                panel.tLabel_Low.update("<label> " + languageFormat.getLanguage(10108, 'Low') + " </label> 				<label class='" + cssClass_Low + "'> " + formatutils.formatNumber(value_low, 1000) + " </label> ");
                panel.tLabel_Open.update("<label> " + languageFormat.getLanguage(10104, 'Open') + " </label>   <label class='" + cssClass_Open + "'>" + formatutils.formatNumber(value_open, 1000) + "</label>");
            }
        }
    },
    _clearLabel: function() {
        var panel = this;
        var name = !panel.isTabPanel ? languageFormat.getLanguage(20153, 'CONSUMER INDEX').toUpperCase() + " : " : "";
        panel.tLabel_Name.update("<label>  </label> 		<label>   </label> ");
        panel.tLabel_previous.update("<label> " + languageFormat.getLanguage(20058, 'Prev') + " : </label> 				<label>  </label> ");
        panel.tLabel_High.update("<label> " + languageFormat.getLanguage(10107, 'High') + " : </label> 				<label>  </label> ");
        panel.tLabel_Low.update("<label> " + languageFormat.getLanguage(10108, 'Low') + " : </label> 				<label>  </label> ");
        panel.tLabel_Open.update("<label> " + languageFormat.getLanguage(10104, 'Open') + " : </label>   <label > </label>");
    },
    getFieldList: function() {
        var fids = [];

        fids.push(fieldStkCode);
        fids.push(fieldStkName);
        fids.push(fieldStkFName);
        fids.push(fieldLast);
        fids.push(fieldPrev);
        fids.push(fieldHigh);
        fids.push(fieldLow);
        fids.push(fieldTime);
        fids.push(fieldTransNo);

        return fids;
    },
    /**
     * Description <br/>
     * 
     *		 
     * 
     * @param {object} 			dataObj
     * 
     * @param {integer/ string} dataRecordNumber
     */
    _procPagingButton: function(dataObj, dataRecordNumber) {
        var panel = this;

        if (!stockutil.isDelayStock(panel.chartStockCode)) {
            var record = panel.tGrid_Indices.store.getById(panel.chartStockCode);
            panel.totalNumber = parseInt(record.data[fieldTransNo]);

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
        } else {
            var lastPage = panel._getLastPage();
            // First page
            if (panel.page == 0) {
                panel.tButton_First.setDisabled(true);
                panel.tButton_Previous.setDisabled(true);
            } else {
                panel.tButton_First.setDisabled(false);
                panel.tButton_Previous.setDisabled(false);
            }

            if (panel.page == lastPage) {
                panel.tButton_Next.setDisabled(true);
                panel.tButton_Last.setDisabled(true);
            } else {
                panel.tButton_Next.setDisabled(false);
                panel.tButton_Last.setDisabled(false);
            }
        }

    },
    /**
     * Description <br/>
     * 
     * 		show or close loading mask
     * 
     * @param {string} 	type
     *  e.g 'global', 'chart', 'time', 'indices' 
     * 
     * @param {string}  event
     * e.g. 'close' or 'open'
     */
    _procLoadMask: function(type, event) {
        var panel = this;
        
        /*
        if (quoteScreen != null && quoteScreen.isFirstTime == true) {
            return;
        }
        */

        if (type == "global") {
            if (event == "open") {
                panel.tLoadMask_main.show();
                panel.tLoadMask_indices.hide();
                if (panel.tLoadMask_time) {
                    panel.tLoadMask_chart.hide();
                }
                if (panel.tLoadMask_time) {
                    panel.tLoadMask_time.hide();
                }

            } else {
                panel.tLoadMask_main.hide();
                panel.tLoadMask_indices.hide();
                if (panel.tLoadMask_chart) {
                    panel.tLoadMask_chart.hide();
                }
                if (panel.tLoadMask_time) {
                    panel.tLoadMask_time.hide();
                }
            }
        } else if (type == "chart") {
            if (event == "open") {
                panel.tLoadMask_chart.show();
            } else {
                panel.tLoadMask_chart.hide();
                panel.tLoadMask_main.hide();
            }
        } else if (type == "indices") {
            if (event == "open") {
                panel.tLoadMask_indices.show();
            } else {
                panel.tLoadMask_indices.hide();
                panel.tLoadMask_main.hide();
            }
        } else if (type == "time") {
            if (event == "open") {
                if (panel.tLoadMask_time) {
                    panel.tLoadMask_time.show();
                }
            } else {
                if (panel.tLoadMask_time) {
                    panel.tLoadMask_time.hide();
                }
                panel.tLoadMask_main.hide();
            }
        }
    },
    _getLastPage: function() {
        var me = this;
        return Math.floor(me.totalNumber / me.transCount);
    },
    forceReloadChart: function() {
        var me = this;
    
        if (helper.inView(me.tChart_panel)) {
            me._procCallChart();
        }
        me.needReloadChart = false;

    },
    setChartStatus: function() {
        var me = this;

        if (isStockChart && me.tChart_panel && me.newOpen) {
            me.newOpen = false;
            var newUrl = updateQueryStringParameter(me.tChart_panel.iframeURL, 'newOpen', '0');
            me.tChart_panel.refresh(newUrl);
        }
    },
    getChartHeight: function() {
        var panel = this;

        return panel.isTabPanel == false ? panel.ctHeight - 75 : panel.ctHeight - 70;
    },
    clearChart: function() {
        var me = this;

        if (isStockChart) {
            me.tChart_panel.refresh('');
        } else {
            me.tChart_panel.remove();
        }
    }
});
