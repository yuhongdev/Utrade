Ext.define('TCPlus.view.quote.ScoreBoard', {
    extend: "Ext.container.Container",
    alias: 'widget.scoreboard',
    layout: 'fit',
    sectorId: null, // keeps current sector
    sectorText: null,
    storeData: null,
    sb_bbar_text: null,
    sb_bbar_text1: null,
    title: languageFormat.getLanguage(20156, 'Scoreboard'),
    mainPanel: null,
    chartPanel: null,
    gridPanel: null,
    winChart: null,
    type: 'sb',
    savingComp: true,
    compRef: {},
    slcomp: "sb",
    initComponent: function() {

//        if (pagingMode) {
//            this.storeData = new Ext.ux.data.PagingStore({
//                model: record,
//                reader: reader,
//                lastOptions: {params: {start: 0, limit: 10}}
//            });
//        } else {
        var panel = this;

        panel.procColumnWidth();
        panel.isTabLayout = n2nLayoutManager.isTabLayout();

        var defaultConfig = {
            header: false,
            width: '100%',
            border: false,
            style: 'margin-left: 2px;',
            items: panel.mainPanel,
            listeners: {
                resize: function(thisComp, w, h, oldw, oldh) {
                    if (!isMobile) {
                        var isTabPanel = w <= 650;
                        if (panel.isTabPanel != isTabPanel) {
                            panel.isTabPanel = isTabPanel;
                            panel._createMainPanel();
                        } else {
                            // readjust component height
                            panel.gridPanel.setHeight(h);
                            panel.chartPanel.setHeight(h);
                            // refresh chart size
                            if (!panel.isTabPanel || panel.mainPanel.getActiveTab().getId() == 'sbchartpanel') {
                                var rec = panel.gridPanel.getSelectionModel().getSelection();
                                if (rec.length > 0) {
                                    panel.genExtjsChart(rec[0]);
                                }
                            }
                        }
                    } else {
                        if (!oldw) {
                            panel._createMainPanel();
                        }
                    }
                }
            }
        };


        Ext.apply(this, defaultConfig);

        this.callParent(arguments);
    },
    procColumnWidth: function() {
        var panel = this;

        panel._setCookieId();
        panel.columnHash = new N2NHashtable();
        var columnID;
        var columnWidth;

        if (cookies.isCookiesExist(panel.colCk)) {
            var temp = cookies.getCookies(panel.colCk);
            columnID = temp[0];
            columnWidth = temp[1];
        } else {
            columnID = N2N_CONFIG.scoreColId;
            columnWidth = N2N_CONFIG.scoreColWidth;

            var tempInfo = [columnID, columnWidth];
            var tempCookie = tempInfo.join(',');
            cookies.setTempStorage(panel, tempCookie);
        }


        var IDArray = columnID.split('|');
        var widthArray = columnWidth.split('|');

        for (var x in IDArray) {
            (panel.columnHash).put(IDArray[x], parseInt(widthArray[x]));
        }
    },
    getWidth: function(columnID) {
        var panel = this;

        return panel.columnHash.get(columnID) || 100;
    },
    _setCookieId: function() {
        var me = this;
        me.colCk = N2N_CONFIG.scoreColStateId;
    },
    _createMainPanel: function() {
        var panel = this;
        helper.removeBufferedRun('bfSBCol');
        
        panel.storeData = Ext.create("Ext.data.Store", {
            model: "TCPlus.model.ScoreBoard"
        });
        //   }
        if (Ext.get(panel.getId())) {
            panel.removeAll();
        }
        if (panel.mainPanel) {
            panel.chartPanel.removeAll();
            panel.chartPanel = null;
            panel.gridPanel.removeAll();
            panel.gridPanel = null;
            panel.mainPanel.removeAll();
            panel.mainPanel = null;
        }

        this.pagingL = new Ext.PagingToolbar({
            enableOverflow: menuOverflow,
            height: 30,
            store: this.storeData,
            displayInfo: false,
            pageSize: 10,
            hidden: true,
            listeners: {
                change: function(pagingL, pagedata) {
                    //console.log('right grid change');
                    if (pagingMode) {

                        var tbar = panel.gridPanel.getTopToolbar();
                        //if there is data
                        if (pagedata.total > 0) {
                            // if data more than the total data display in one page, display the paging button	
                            if (pagedata.total > pagingL.pageSize)
                                panel.showPaging('left');

                            var page = pagedata.activePage;
                            var lastpage = pagedata.pages;

                            if (pagedata.total <= pagingL.pageSize) {
                                //disable both
                                tbar.getComponent('tk_prev1').disable();
                                tbar.getComponent('tk_next1').disable();
                            } else if (page == 1) {//if active page number is 1 means one page only
                                //disable prev
                                tbar.getComponent('tk_prev1').disable();
                                tbar.getComponent('tk_next1').enable();
                            } else if (page == lastpage) { // if active page number == number of pages
                                //disable next
                                tbar.getComponent('tk_prev1').enable();
                                tbar.getComponent('tk_next1').disable();
                            } else {
                                //disable none
                                tbar.getComponent('tk_prev1').enable();
                                tbar.getComponent('tk_next1').enable();
                            }
                            // this line is for imsl feature -->panel.page = page;
                        } else {
                            tbar.getComponent('tk_prev1').disable();
                            tbar.getComponent('tk_next1').disable();
                        }
                        tbar.doLayout();// some button must be force only can see
                    }
                }
            }
        });

        var hideLPagingBtns = true; // hide the buttons by default
        var tbPrev1 = {
            id: 'tk_prev1',
            xtype: 'button',
            text: 'Prev',
            hidden: hideLPagingBtns,
            listeners: {
                click: function() {
                    panel.previousPage();
                }
            }
        };

        var tbNext1 = {
            id: 'tk_next1',
            xtype: 'button',
            text: 'Next',
            hidden: hideLPagingBtns,
            listeners: {
                click: function() {
                    panel.nextPage();
                }
            }
        };

        panel.sb_bbar_text = Ext.create('widget.tbtext', {
            text: "0",
            xtype: 'tbtext',
            style: "font-weight:bold;color:#000000;"
        });
        panel.sb_bbar_text1 = Ext.create('widget.tbtext', {
            text: "0",
            style: "font-weight:bold;color:#000000;text-align:left;margin-right:20px;"
        });

        // top toolbar
        panel.compRef.topBar = Ext.create('Ext.toolbar.Toolbar', {
            items: panel._getSectorUI()
        });

        panel.gridPanel = Ext.create('Ext.grid.Panel', {
            title: languageFormat.getLanguage(20156, 'Scoreboard'),
            border: false,
            header: false,
            store: this.storeData,
            autoScroll: true,
            columnWidth: isMobile ? 1 : 0.5,
            enableColumnMove: false,
            enableColumnHide: false,
            enableColumnResize: true,
            columns: {
                defaults: {
                    menuDisabled: true
                },
                items:panel.getColConfig()
            },
            selModel: {
                preventFocus: true
            },
            tbar: panel.compRef.topBar,
            stripeRows: true,
            bbar: {
                items: [{
                        text: languageFormat.getLanguage(11035, 'Total'),
                        xtype: 'tbtext',
                        style: "font-weight:bold;color:#000000;width:100px;text-align:right;"
                    },
                    panel.sb_bbar_text,
                    '->',
                    panel.sb_bbar_text1, panel.pagingL
                ]
            },
            listeners: {
                afterrender: function(grid) {
                    if (panel.sectorId) {
                        panel.callScoreBoard(panel.sectorId);
                    }

                    // readjust grid height
                    grid.setHeight(panel.getHeight());
                },
                columnresize: function(ct, column, newWidth) {
                    if (newWidth === 0) {
                        column.autoSize();
                        return;
                    }

                    // keeps new width
                    panel.columnHash.setItem(column.dataIndex, newWidth);
                    // auto save
                    panel.tempWidth = cookies.procTempCookies(panel, panel.colCk, column.dataIndex, newWidth);
                    cookies.procCookie(panel.colCk, panel.tempWidth, cookieExpiryDays);
                    panel.tempWidth = cookies.toDefaultColumn(panel, panel.colCk);
                    
                    if (N2N_CONFIG.autoQtyRound) {
                        helper.refreshView(panel);
                    }
                }
            }
        });

        if (!isMobile) {
            panel.chartPanel = new Ext.Panel({
                id: 'sbchartpanel',
                header: false,
                title: languageFormat.getLanguage(20160, "Pie Chart"),
                columnWidth: 0.5,
//		height:600,
                border: false,
//            tbar: [{
//                    xtype: 'tbtext',
//                    text: '',
//                    height: 22
//                }],
                listeners: {
                    afterrender: function(chartpanel) {
                        chartpanel.setHeight(panel.getHeight());
                    }
                },
                html: '<div id="titlechart" style="padding-top: 2px; padding-left: 7px;float:left;clear:both;height: 14px;font-weight:bold;font-size:14px;"></div><div id="chartdiv" style="height:365px;width:100%; "></div>'
            });
        }

        //var items = isMobile? panel.gridPanel : [panel.gridPanel, panel.chartPanel];
        panel.mainPanel = Ext.create(!panel.isTabPanel || isMobile ? "Ext.container.Container" : "Ext.tab.Panel", {
            width: '100%',
            layout: isMobile ? "fit" : "column",
            items: [panel.gridPanel, panel.chartPanel],
            listeners: {
                tabchange: function(thisComp, newTab, oldTab) {
                    if (newTab.id == "sbchartpanel") {
                        var rec = panel.gridPanel.getSelectionModel().getSelection();
                        if (rec.length > 0) {
                            panel.genExtjsChart(rec[0]);
                        } else {
                            Ext.get('chartdiv').update('');
                            Ext.get("titlechart").update('');
                        }
                    } else {
                        helper.runBuffer('bfSBCol');
                    }
                }
            }
        });
        if (Ext.get(panel.getId())) {
            panel.add(panel.mainPanel);
        }
    },
    getColConfig: function() {
        var panel = this;

        var newSetting = function(meta, value, type) {
            var cssClass = N2NCSS.CellDefault;

            if (type == "string") {
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontUnChange;

            } else if (type == "up") { //1.3.33.45
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontUp;

            } else if (type == "down") { //1.3.33.45
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontDown;

            } else {
                cssClass += " " + N2NCSS.FontString;

                if (parseFloat(value) > 0)
                    cssClass += " " + N2NCSS.FontUp;
                else if (parseFloat(value) < 0)
                    cssClass += " " + N2NCSS.FontDown;
                else
                    cssClass += " " + N2NCSS.FontUnChange;

            }
            meta.css = cssClass;
        };

        return [{
                text: 'Code',
                width: 45,
                minWidth: 45,
                sortable: true,
                dataIndex: fieldSbId,
                css: 'vertical-align: left;',
                hidden: true,
                renderer: function(val, meta) {
                    newSetting(meta, val, "string");
                    return val;
                }
            }, {
                text: languageFormat.getLanguage(10701, 'Name'),
                locked: true,
                width: panel.getWidth(fieldSbName),
                sortable: true,
                dataIndex: fieldSbName,
                renderer: function(val, meta) {
                    newSetting(meta, val, "string");
                    return val;
                }
            }, {
                text: languageFormat.getLanguage(11008, 'Volume'),
                width: panel.getWidth(fieldSbVol),
                sortable: true,
                dataIndex: fieldSbVol,
                align: 'right',
                renderer: function(val, meta) {
                    val = formatutils.formatNumber(val, panel.getWidth(fieldSbVol));
                    newSetting(meta, val, "string");
                    return val;
                }
            }, {
                text: languageFormat.getLanguage(11031, 'Up'),
                width: panel.getWidth(fieldSbUp),
                sortable: true,
                dataIndex: fieldSbUp,
                align: 'center',
                renderer: function(val, meta) {
                    newSetting(meta, val, "up"); //1.3.33.45
                    return val;
                }
            }, {
                text: languageFormat.getLanguage(11032, 'Down'),
                width: panel.getWidth(fieldSbDown),
                sortable: true,
                dataIndex: fieldSbDown,
                align: 'center',
                renderer: function(val, meta) {
                    newSetting(meta, val, "down"); //1.3.33.45
                    return val;
                }
            }, {
                text: languageFormat.getLanguage(11033, 'Unchg'),
                width: panel.getWidth(fieldSbUnchg),
                sortable: true,
                dataIndex: fieldSbUnchg,
                align: 'center',
                renderer: function(val, meta) {
                    newSetting(meta, val, "string");
                    return val;
                }
            }, {
                text: languageFormat.getLanguage(11034, 'Untrd'),
                width: panel.getWidth(fieldSbUntrd),
                sortable: true,
                dataIndex: fieldSbUntrd,
                align: 'center',
                renderer: function(val, meta) {
                    newSetting(meta, val, "string");
                    return val;
                }
            }, {
                text: languageFormat.getLanguage(11035, 'Total'),
                width: panel.getWidth(fieldSbVal),
                sortable: true,
                dataIndex: fieldSbVal,
                align: 'right',
                renderer: function(val, meta) {
                    val = formatutils.formatNumber(val, panel.getWidth(fieldSbVal));
                    newSetting(meta, val, "string");
                    return val;
                }
            }
        ];
    },
    genChart: function(up, down, unchg, untrd) {

        var upLabel = 'Up (' + up + ')';
        var dwnLabel = 'Down (' + down + ')';
        var unchgLabel = 'Unchange (' + unchg + ')';
        var untrdLabel = 'Untraded (' + untrd + ')';

        var data = [
            [upLabel, up], [dwnLabel, down], [unchgLabel, unchg],
            [untrdLabel, untrd]
        ];

        Ext.get('chartdiv').update('');
        var plot1 = jQuery.jqplot('chartdiv', [data],
                {
                    seriesDefaults: {
                        // Make this a pie chart.
                        renderer: jQuery.jqplot.PieRenderer,
                        rendererOptions: {
                            // Put data labels on the pie slices.
                            // By default, labels show the percentage of the slice.
                            showDataLabels: true,
                            highlightMouseOver: false,
                            shadow: false,
                            padding: 1
                        }
                    },
                    legend: {
                        placement: 'outside',
                        location: 'se',
                        rendererOptions: {
                            numberColumns: 1,
                            numberRows: 4
                        },
                        show: true

                    },
                    grid: {shadow: false, drawBorder: false},
                    seriesColors: ['#00ff00', '#ff0000', '#ffff00', '#a9a9a9']



                }
        );


    },
    format: function(val, dec) {
        if (dec != null) {
            val = parseFloat(val).toFixed(dec);
        }

        var nStr = val += '';
        x = nStr.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;

        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },
    menuitem: function() {
        var panel = this;

        var arr = feedFilterRet.bl; // get sectors
        var arr2 = new Array();

        this.sectorId = null;
        this.sectorText = null;
        
        for (var i = 0; i < arr.length; i++) {
            var sbtbItem = arr[i].n; // sector
            var sbtbItemId = arr[i].id; // sector ID

            var insert = false;
            if (exchangecode == "KL") {
                if (sbtbItem == "MAIN" || sbtbItem == "ACE-MKT" || sbtbItem == "STRCWARR") {
                    insert = true;
                }
            } else if (sbtbItem != "TOTAL") {
                insert = true;
            }

            if (insert) {
                if (!this.sectorId) {
                    this.sectorText = sbtbItem;
                    this.sectorId = sbtbItemId;
                }

                var menuItem = {
                    secId: sbtbItemId, // for custom use
                    text: sbtbItem,
                    handler: function() {
                        if (panel.compRef.sectorBtn) {
                            var text = this.text;
                            panel.compRef.sectorBtn.setText(text);
                        }

                        panel.callScoreBoard(this.secId);
                    }
                };

                arr2.push(menuItem);
            }
        }

        return arr2;
    },
    calculateTotal: function() {
        var grid = this.gridPanel;

        var store = grid.getStore();
        var sum = 0;
        var tsum = 0;
        store.each(function(rec) {

            sum += rec.get(fieldSbVol);
            tsum += rec.get(fieldSbVal);
        });
        
        // fix decimal issue (3 decimals)
        tsum = Math.round(tsum * 1000) / 1000;

        var fsum = formatutils.formatNumber(sum, 30); // given 30 to make values round
        var ftsum = formatutils.formatNumber(tsum, 30);

        this.sb_bbar_text.setText('<span title="' + this.format(sum) + '">' + fsum + '</span>');
        this.sb_bbar_text1.setText('<span title="' + this.format(tsum, 3) + '">' + ftsum + '</span>');
    },
    refresh: function() {
        this.callScoreBoard();
    },
    _lastSecId: null,
    callScoreBoard: function(sectorId) {
        var panel = this;
        var tgrid = panel.gridPanel;
        
        if (!sectorId) {
            sectorId = panel._lastSecId;
        } else {
            panel._lastSecId = sectorId;
        }

        panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));

        var reqObj = {
            ex: exchangecode,
            id: sectorId,
            round: false,
            success: function(obj) {
                tgrid.getStore().loadData(obj.d);
                panel.calculateTotal();
                tgrid.getSelectionModel().select(0);

                if (!isMobile && !panel.isTabPanel) {
                    var rec = tgrid.getSelectionModel().getSelection();
                    if (rec.length > 0) {
                        panel.genExtjsChart(rec[0]);
                    } else {
                        Ext.get('chartdiv').update('');
                        Ext.get("titlechart").update('');
                    }
                }

                panel.loadMask.hide();
            }
        };
        conn.getScoreBoard(reqObj);
    },
    printNumber: function(value, digit) {
        return this.printColor(value, cFUnchanged, true, 9);
    },
    printColor: function(value, color, bold, fontsize) {
        var el = new Array();
        el.push('<span');

        var style = color != null || bold != null || fontsize != null;

        if (style) {
            el.push(' style="');

            if (color != null) {
                el.push('color: ');
                el.push(color);
                el.push('; ');
            }

            if (bold != null) {
                el.push('font-weight: bold; ');
            }

            if (fontsize != null) {
                el.push('font-size: ');
                el.push(fontsize);
                el.push('pt');
            }

            el.push('"');
        }

        el.push('>');
        el.push(value);
        el.push('</span>');

        return el.join('');
    },
    nextPage: function() {

        var total = this.storeData.getTotalCount();
        var cursor = this.pagingL.cursor; //record position of current active page
        var size = this.pagingL.pageSize;

        this.page = cursor / size; // calculate current page number
        var islastpage = cursor >= (total - size); //similar to cursor+size>=total
        //if last page, cant move next
        if (!islastpage)
            this.pagingL.moveNext();


    },
    previousPage: function() {

        var total = this.storeData.getTotalCount();

        var cursor = this.pagingL.cursor;
        var size = this.pagingL.pageSize;

        this.page = cursor / size;
        if (this.page > 0)
            this.pagingL.movePrevious();

    },
    showPaging: function() {

        var tbar = this.gridPanel.getTopToolbar();

        tbar.getComponent('tk_prev1').show();
        tbar.getComponent('tk_next1').show();

    },
    genFusionChart: function(up, down, unchg, untrd, rcCode, rcName) {
        //console.log("1");
        var caption_title = rcCode + " " + rcName;
        var objJSON = {"chart": {
                "caption": caption_title,
                "palette": "1",
                "animation": "1",
                "formatnumberscale": "0",
                // "numberprefix": "$",// prefix the value of slice with $ symbol :)
                "pieslicedepth": "30",
                "startingangle": "125",
                "pieRadius": "80",
                "manageLabelOverflow": "1",
                "pieYScale": "60"
//            "showLegend":"1",
//            "enablesmartlabels":"0"
            },
            "data": [
                {
                    "label": "Up",
                    "size": "12",
                    "value": up,
                    "issliced": "1",
                    "color": "00ff00"
                },
                {
                    "label": "Untraded",
                    "value": untrd,
                    "issliced": "1",
                    "color": "a9a9a9"
                },
                {
                    "label": "Unchanged",
                    "value": unchg,
                    "issliced": "0",
                    "color": "ffff00"
                },
                {
                    "label": "Down",
                    "value": down,
                    "issliced": "0",
                    "color": "ff0000"
                }
            ],
            "styles": {
                "definition": [
                    {
                        "type": "font",
                        "name": "CaptionFont",
                        "underline": "1",
                        "align": "left",
                        "font": "Arial",
                        "size": "16",
                        "color": "000000",
                        "bold": "1" // bold == 1 means bolded
                    },
                    {
                        "type": "font",
                        "name": "SubCaptionFont",
                        "bold": "0"
                    }, {
                        "name": "myCaptionAnim",
                        "type": "animation",
                        "param": "_y",
                        "easing": "Bounce",
                        "start": "0",
                        "duration": "1"

                    },
                    {
                        "type": "font",
                        "name": "myLabelsFont",
                        "bold": "1",
                        "font": "Arial",
                        "size": "13",
                        "color": "000000",
                        "underline": "0"
                    }
                ],
                "application": [//apply/assign styles to desired object :)
                    {
                        "toobject": "caption",
                        "styles": "myCaptionAnim,CaptionFont" //apply two styles together for caption title :))
                    },
                    {
                        "toobject": "SubCaption",
                        "styles": "SubCaptionFont"
                    },
                    {
                        "toobject": "DataLabels",
                        "styles": "myLabelsFont"
                    }
                ]
            }
        };
        //console.log(objJSON);
        Ext.get('scoreboard_title').update('');

        var myChart = new FusionCharts("FusionCharts/Pie3D.swf",
                "myChartId", "400", "305", "0", "1");
        //myChart.setXMLUrl("Data.xml");//xml data
        myChart.setJSONData(objJSON); //json data
        //console.log("hihi");
        myChart.render("scoreboard_title");
        //console.log("2");


    },
    genGoogleChart: function(up, down, unchg, untrd, rcCode, rcName) {
        var drawVisualization = function() {

            //v1.3.30.12 Hardcode background color and font color of chart
            var bgColor;
            var fontColor;
            if (formatutils.procThemeColor() == 'b') {
                bgColor = '#000000';
                fontColor = '#FFFFFF';
            }
            else {
                bgColor = '#FFFFFF';
                fontColor = '#000000';
            }

            // Create and populate the data table.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Status');
            data.addColumn('number', 'value');
            data.addRows(4);
            data.setValue(0, 0, 'Up');
            data.setValue(0, 1, up);
            data.setValue(1, 0, 'Down');
            data.setValue(1, 1, down);
            data.setValue(2, 0, 'Unchanged');
            data.setValue(2, 1, unchg);
            data.setValue(3, 0, 'Untraded');
            data.setValue(3, 1, untrd);

            var stockname = rcCode + " " + rcName;
            var conf = {
                title: stockname,
                titleTextStyle: {color: fontColor}, //v1.3.30.12 added to set title color
                is3D: true,
                width: '100%',
                backgroundColor: {fill: bgColor}, //v1.3.30.12 added to set chart bgColor
                chartArea: {left: 20, width: "100%", height: "75%"},
                colors: ['#00ff00', '#ff0000', '#ffff00', 'a9a9a9'],
                legend: 'right',
                pieSliceTextStyle: {color: '#000000', fontSize: 14},
                legendTextStyle: {fontSize: 14, color: fontColor} //v1.3.30.12 add color:fontColor
            };

            Ext.get('chartdiv').update('');
            // Create and draw the visualization.
            new google.visualization.PieChart(Ext.getDom(Ext.get('chartdiv'))).draw(data, conf);
        };

        google.load('visualization', '1', {
            packages: ['corechart'],
            callback: drawVisualization
        });
        //google.setOnLoadCallback(drawVisualization);
    },
    genExtjsChart: function(record) {
        if (!record) {
            return;
        }

        var panel = this;
        var rcName = record.get(fieldSbName);
        var up = record.get(fieldSbUp);
        var down = record.get(fieldSbDown);
        var unchg = record.get(fieldSbUnchg);
        var untrd = record.get(fieldSbUntrd);

        Ext.get('chartdiv').update('');
        var datastore = new Array();

        if (isMobile) {
            panel.chartPanel.setTitle(rcName);
        } else {
            Ext.get("titlechart").update(rcName);
        }
        if (up != 0) {
            datastore.push({
                name: 'Up',
                data: up
            });
        }

        if (down != 0) {
            datastore.push({
                name: 'Down',
                data: down
            });
        }

        if (unchg != 0) {
            datastore.push({
                name: 'Unchanged',
                data: unchg
            });
        }

        if (untrd != 0) {
            datastore.push({
                name: 'Untraded',
                data: untrd
            });
        }
        var store = Ext.create('Ext.data.JsonStore', {
            fields: ['name', 'data'],
            data: datastore
        });
        var chartHeight = panel.chartPanel.getHeight();

        if (!isMobile) {
            chartHeight -= 15;
        } else {
            chartHeight -= 35;
        }

        if (panel._scorePie) {
            panel._scorePie.destroy();
            panel._scorePie = null;
        }
        panel._scorePie = Ext.widget('chart', {
            animate: true,
            width: "100%",
            height: chartHeight,
            store: store,
            shadow: false,
            renderTo: 'chartdiv',
            insetPadding: 25,
            theme: 'Base:gradients',
            series: [{
                    type: 'pie',
                    angleField: 'data',
                    getLegendColor: function(index) {
                        return PIE_COLOR[index % 4];
                    },
                    renderer: function(sprite, record, attr, index, store) {
                        attr.fill = PIE_COLOR[index % 4];
                        return attr;
                    },
                    tips: {
                        trackMouse: true,
                        width: isMobile ? 170 : 150,
                        height: 28,
                        renderer: function(storeItem, item) {
                            // calculate and display percentage on hover
                            var total = 0;
                            store.each(function(rec) {
                                total += rec.get('data');
                            });
                            this.setTitle(storeItem.get('name') + ': ' + storeItem.get('data') + " ( " + Math.round(storeItem.get('data') / total * 100) + '% )');
                        }
                    },
                    highlight: {
                        segment: {
                            margin: 20
                        }
                    },
                    label: {
                        field: 'name',
                        display: 'middle',
                        contrast: true,
                        renderer: function(value, label, storeItem, item) {
                            var total = 0;
                            store.each(function(rec) {
                                total += rec.get('data');
                            });
                            var percent = 0;
                            if (total != 0) {
                                percent = storeItem.get('data') / total * 100;
                            }
                            return value + "\n" + Ext.util.Format.number(percent, '0') + '%';
                        }
                    }
                }]
        });

    },
    resetExchange: function() {
        var panel = this;
        panel.topBar.removeAll();

        var tbarItems = panel._getSectorUI();

        if (tbarItems.length > 0) {
            panel.topBar.add(tbarItems);
            panel.callScoreBoard(panel.sectorId);
        }
    },
    _getSectorUI: function() {
        var panel = this;
        var menu = panel.menuitem();
        var sectorItems = [];

        if (menu.length > 3) {
            panel.compRef.sectorBtn = Ext.create('Ext.button.Button', {
                text: panel.sectorText,
                menu: menu
            });
            sectorItems.push(panel.compRef.sectorBtn);
        } else {
            panel.compRef.sectorBtn = null;
            // add toggle config for button
            for (var i = 0; i < menu.length; i++) {
                menu[i].enableToggle = true;
                menu[i].toggleGroup = 'sectors';
                menu[i].allowDepress = false;
                if (i == 0) {
                    menu[i].pressed = true;
                }
            }

            sectorItems = menu;
        }

        return sectorItems;
    },
    autoAdjustWidth: function() {
        var panel = this;

        panel.procColumnWidth();
        helper.runBufferedView(panel.gridPanel, 'bfSBCol', function() {
            panel.gridPanel.reconfigure(null, panel.getColConfig());
            panel.tempWidth = cookies.toDefaultColumn(panel, panel.colCk);
        });

        panel.runAutoAdjustWidth = false;
    }
});
