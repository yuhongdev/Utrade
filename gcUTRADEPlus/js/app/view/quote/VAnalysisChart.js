/*
 * View: Analysis Chart
 */
Ext.define('TCPlus.view.quote.VAnalysisChart', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.analysis_chart',
    debug: false,
    slcomp: "ac",
    chartStyle: {
        CANDLE: 0,
        OPEN: 1,
        HIGHEST: 2,
        LOWEST: 3,
        CLOSE: 4
    },
    chartType: {
        VOL: 5,
        CHG: 6,
        MACD: 7,
        DI: 8,
        DMI: 9,
        ADX: 10
    },
    chartInterval: {
        M1: 30,
        M3: 90,
        M6: 180,
        Y1: 365,
        Y2: 730
    },
    compRef: {},
    type: 'an',
    savingComp: true,
    ddComp: true,
    initComponent: function() {
        var me = this;
        var stkParts = stockutil.getStockParts(me.key);

        if (gifChartExList.indexOf(stkParts.exch) == -1) {
            var chartURL;
            if (showFlashTeleChart && analysisChartFlashURL != '') {
                chartURL = analysisChartFlashURL;
            } else if (!jsutil.isEmpty(stockChartURL)) {
                chartURL = stockChartURL;
            }

            if (chartURL) {
                me.initMax = !me._startup;
                me.chartURL = chartURL;
                me.compRef.mainCt = Ext.create('Ext.ux.IFrame');
                me.layout = 'fit';
            }
        }
        
        if (!me.chartURL) {
            me._createUIItems();
        }

        Ext.apply(me, {
            border: false,
            height: '100%',
            items: [
                me.compRef.mainCt
            ],
            listeners: {
                resize: function(thisComp, newWidth, newHeight, oldWidth, oldHeight) {
                    if (me.debug) {
                        console.log('VAnalysisChart > resize...');
                        console.log('newHeight -> ', newHeight);
                    }
                    if (!me.chartURL) {
                        var chartHeight = newHeight - 35;
                        me.compRef.chart.setHeight(chartHeight);
                        me.compRef.searchVw.setHeight(chartHeight);
                    }

                    if (oldHeight) {
                        if (me.chartURL) {
                            // me.loadURLChart();
                        } else {
                            // Refresh chart when resize
                            me.getChart();
                        }
                    }
                }
            }
        });
        me.callParent();
    },
    refresh: function() {
        var me = this;

        if (me.key) {
            helper.runAfterCompRendered(me, function() {
                me.updateTitle();
                n2nLayoutManager.updateKey(me);
                if (me.chartURL) {
                    me.loadURLChart();
                } else {
                    me._resetCompValues();
                    me.getChart();
                }
            });
        }

    },
    _resetCompValues: function() {
        var me = this;

        me.compRef.styleCb.setValue(me.chartStyle.CANDLE);
        me.compRef.typeCb.setValue(me.chartType.VOL);
        me.compRef.movingAvgTf.setValue(10);
        me.compRef.intervalCb.setValue(me.chartInterval.Y1);
    },
    updateTitle: function() {
        var me = this;
        
        var compTitle = languageFormat.getLanguage(20102, 'Analysis Chart');
        // not display the stock name if it's not html5 chart since user can change it inside the chart and won't reflect back
        if (!me.chartURL) {
            compTitle += UI.titleSeparator + stockutil.getStockPart(this.stkname);
        }
        
        n2nLayoutManager.updateTitle(me, compTitle);
    },
    _createUIItems: function() {
        var me = this;

        /* info section */
        /*
         me.compRef.titleLbl = Ext.create('Ext.form.Label', {
         style: 'font-size:1.2em'
         });
         me.compRef.shrIssuedLbl = Ext.create('Ext.form.Label', {
         });
         me.compRef.mktCapLbl = Ext.create('Ext.form.Label', {
         });
         me.compRef.boardLbl = Ext.create('Ext.form.Label', {
         });
         me.compRef.secLbl = Ext.create('Ext.form.Label', {
         });
         me.compRef.highestLbl = Ext.create('Ext.form.Label', {
         });
         me.compRef.lowestLbl = Ext.create('Ext.form.Label', {
         });
         
         me.compRef.infoCt = Ext.create('Ext.container.Container', {
         width: 300,
         layout: {
         type: 'table',
         columns: 2,
         tableAttrs: {
         style: {
         width: '100%',
         height: '100%'
         }
         }
         },
         border: false,
         items: [
         {
         items: me.compRef.titleLbl,
         colspan: 2,
         height: 50
         },
         {html: MSG.get(MSG.HIGHEST)}, me.compRef.highestLbl,
         {html: MSG.get(MSG.LOWEST)}, me.compRef.lowestLbl,
         {html: MSG.get(MSG.SHR_ISS)}, me.compRef.shrIssuedLbl,
         {html: MSG.get(MSG.MKT_CAP)}, me.compRef.mktCapLbl,
         {html: MSG.get(MSG.BOARD)}, me.compRef.boardLbl,
         {html: MSG.get(MSG.SECTOR)}, me.compRef.secLbl
         ]
         });
         */

        /* chart section */
        var _fieldStyle = 'font-size: 0.9em';
        if (isMobile) {
            _fieldStyle = 'font-size: 0.85em!important;';
        }

        // search box
        me.compRef.searchTf = Ext.create('Ext.form.field.Text', {
            width: searchboxWidth,
            emptyText: languageFormat.getLanguage(10102, 'Symbol') + '/' + languageFormat.getLanguage(10101, 'Code'),
            selectOnFocus: true,
            listeners: {
                specialkey: function(thisTf, e) {
                    if (e.getKey() == e.ENTER)
                        me.search();
                }
            }
        });

        me.compRef.searchBtn = Ext.create('Ext.button.Button', {
            text: languageFormat.getLanguage(10007, 'Search'),
            icon: icoBtnSearch,
            handler: function() {
                me.search();
            }
        });

        me.compRef.backBtn = Ext.create('Ext.button.Button', {
            text: languageFormat.getLanguage(10027, 'Back'),
            icon: icoBtnBack,
            hidden: true,
            handler: function() {
                me._setDisplay();
            }
        });

        // chart style combo
        var styleArray = [
            [me.chartStyle.OPEN, languageFormat.getLanguage(10104, 'Open')],
            [me.chartStyle.HIGHEST, languageFormat.getLanguage(20105, 'Highest')],
            [me.chartStyle.LOWEST, languageFormat.getLanguage(20106, 'Lowest')],
            [me.chartStyle.CLOSE, languageFormat.getLanguage(10103, 'Close')]
        ];

        if (sponsorID != 'INTERPAC') {
            styleArray.push([me.chartStyle.CANDLE, languageFormat.getLanguage(20107, 'Candle Stick')]);
        }

        var eleWidth = isMobile ? 140 : 120;
        var labelWidth = 45;
        var eleMargin = isMobile ? '0 0 2px 0' : '0 3px 0 0';

        me.compRef.styleCb = Ext.create('Ext.form.field.ComboBox', {
            width: eleWidth,
            fieldLabel: languageFormat.getLanguage(20104, 'Style'),
            fieldStyle: _fieldStyle,
            labelWidth: isMobile ? labelWidth : 30,
            store: Ext.create('Ext.data.ArrayStore', {
                fields: ['value', 'text'],
                data: styleArray
            }),
            queryMode: 'local',
            valueField: 'value',
            displayField: 'text',
            editable: false,
            forceSelection: true,
            margin: eleMargin,
            listeners: {
                select: function() {
                    if (!isMobile) {
                        me.getChart();
                    }
                }
            }
        });

        // chart type combo
        var typeArray = [
            [me.chartType.VOL, languageFormat.getLanguage(11008, 'Volume')],
            [me.chartType.CHG, languageFormat.getLanguage(20108, '%Change')],
            [me.chartType.MACD, 'MACD'],
            [me.chartType.DI, 'DI'],
            [me.chartType.DMI, 'DMI'],
            [me.chartType.ADX, 'ADX']
        ];
        me.compRef.typeCb = Ext.create('Ext.form.field.ComboBox', {
            width: eleWidth,
            fieldLabel: languageFormat.getLanguage(20628, 'Type'),
            fieldStyle: _fieldStyle,
            labelWidth: isMobile ? labelWidth : 30,
            store: Ext.create('Ext.data.ArrayStore', {
                fields: ['value', 'text'],
                data: typeArray
            }),
            queryMode: 'local',
            valueField: 'value',
            displayField: 'text',
            editable: false,
            forceSelection: true,
            margin: eleMargin,
            listeners: {
                select: function() {
                    if (!isMobile) {
                        me.getChart();
                    }
                }
            }
        });

        // Moving average textbox
        me.compRef.movingAvgTf = Ext.create('Ext.form.field.Number', {
            fieldLabel: MSG.get(MSG.MOVING_AVG),
            width: eleWidth,
            labelWidth: isMobile ? labelWidth : 80,
            fieldStyle: _fieldStyle,
            allowDecimals: false,
            margin: eleMargin,
            selectOnFocus: true,
            hideTrigger: true,
            hidden: true, // TO REVIEW
            listeners: {
                change: function(thisComp, newValue, oldValue) {
                    if (!newValue) {
                        thisComp.setValue(oldValue);
                    }
                }
            }
        });

        // Interval combobox
        var intervalArray = [
            [me.chartInterval.M1, languageFormat.getLanguage(20110, '1 Month(s)', '1')],
            [me.chartInterval.M3, languageFormat.getLanguage(20110, '3 Month(s)', '3')],
            [me.chartInterval.M6, languageFormat.getLanguage(20110, '6 Month(s)', '6')],
            [me.chartInterval.Y1, languageFormat.getLanguage(20111, '1 Year(s)', '1')],
            [me.chartInterval.Y2, languageFormat.getLanguage(20111, '2 Year(s)', '2')]
        ];

        me.compRef.intervalCb = Ext.create('Ext.form.field.ComboBox', {
            width: eleWidth,
            fieldLabel: languageFormat.getLanguage(20109, 'Interval'),
            fieldStyle: _fieldStyle,
            labelWidth: isMobile ? labelWidth : 45,
            store: Ext.create('Ext.data.ArrayStore', {
                fields: ['value', 'text'],
                data: intervalArray
            }),
            queryMode: 'local',
            valueField: 'value',
            displayField: 'text',
            editable: false,
            forceSelection: true,
            margin: eleMargin,
            listeners: {
                select: function() {
                    if (!isMobile) {
                        me.getChart();
                    }
                }
            }
        });

        // chart menu items
        var chartMenuItems = [me.compRef.searchTf, me.compRef.searchBtn, '->', me.compRef.backBtn];

        if (isMobile) {
            me.compRef.chartToolBtn = Ext.create('Ext.button.Button', {
                icon: icoBtnSetting,
                handler: function() {
                    me.openChartTool();
                }
            });
            chartMenuItems.push(me.compRef.chartToolBtn);
        } else {
            chartMenuItems.push(me.compRef.styleCb, me.compRef.typeCb, me.compRef.movingAvgTf, me.compRef.intervalCb);
        }

        me.compRef.chartMenu = Ext.create('Ext.toolbar.Toolbar', {
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll,
            height: 30,
            items: chartMenuItems,
            padding: 3
        });
        me.compRef.chart = Ext.create('Ext.container.Container', {
        });

        // search
        me.compRef.searchVw = Ext.create('Ext.view.View', {
            tpl: [
                '<tpl for=".">',
                '<table class="search-item" style="width:100%">',
                '<tr><td style="width:30%">{' + fieldStkCode + '}</td><td style="width:70%">{' + fieldStkName + '}</td></tr>',
                '</table></tpl>'
            ],
            store: {
                fields: [fieldStkCode, fieldStkName]
            },
            itemSelector: 'table.search-item',
            selectedItemCls: 'search-item-selected',
            hidden: true,
            emptyText: '<div class="x-grid-empty">' + languageFormat.getLanguage(30013, 'No result found.') + '</div>',
            autoScroll: true,
            listeners: {
                itemclick: function(thisComp, record) {
                    me.setCode(record.get(fieldStkCode), record.get(fieldStkName));

                    me._setDisplay();
                    helper.setHtml(me.compRef.chart, '');
                    me.refresh();
                }
            }
        });


        /*
         me.compRef.chartCt = Ext.create('Ext.container.Container', {
         items: [
         ]
         });
         */

        /* main section */
        me.compRef.mainCt = Ext.create('Ext.container.Container', {
            items: [
                me.compRef.chartMenu,
                me.compRef.chart,
                me.compRef.searchVw
            ]
        });
    },
    _formatIntervalText: function(interval, msgID) {
        var text = interval;
        var msg = MSG.get(MSG[msgID]);

        if (isMobile) {
            text += msg;
        } else {
            if (interval > 1) {
                text += ' ' + msg + 's'; // prural
            } else {
                text += ' ' + msg;
            }
        }


        return text;
    },
    getChart: function() {
        var me = this;

        me.compRef.loadMask = me.setLoading(languageFormat.getLanguage(10017, 'Loading...'));

        var style = me.compRef.styleCb.getValue();
        var type = me.compRef.typeCb.getValue();
        // var moving = me.compRef.movingAvgTf.getValue();
        var moving = 10; // TO REVIEW
        var interval = me.compRef.intervalCb.getValue();

        if (type == me.chartType.MACD) {
            moving = '12,26,' + moving;
        }

        if (me.debug) {
            console.log('VAnalysisChart > getChart');
            console.log({
                style: style,
                type: type,
                moving: moving,
                interval: interval
            });
        }

        var chartSize = me.compRef.chart.getSize();
        var params = [
            'k=' + me.key,
            'w=' + chartSize.width,
            'h=' + chartSize.height,
            'd=' + interval,
            't=' + style + '|' + type,
            'dp=' + moving,
            'c=' + formatutils.procThemeColor()
        ];

        var chartURL = addPath + 'tcplus/analysischart?' + params.join('&');

        if (me.debug) {
            console.log('chartURL -> ', chartURL);
        }

        // call ajax
        Ext.Ajax.request({
            url: chartURL,
            timeout: 90000,
            method: 'POST',
            success: function(response) {
                try {
                    var obj = Ext.decode(response.responseText);

                    if (obj && obj.s && obj.d.length > 0) {
                        me._updateChart(obj.d);
                    } else {
                        me._setErrorMsg();

                        if (me.debug) {
                            console.log('obj -> ', obj);
                        }
                    }
                } catch (e) {
                    me._setErrorMsg();
                    if (me.debug) {
                        console.log('e -> ', e);
                    }
                }

                me.compRef.loadMask.hide();
            },
            failure: function(response) {
                me.compRef.loadMask.hide();
                me._setErrorMsg();
                if (me.debug) {
                    console.log('failure response -> ', response);
                }
            }
        });
    },
    _setErrorMsg: function() {
        var me = this;

        var msg = languageFormat.getLanguage(30905, 'Failed to load chart.');
        helper.setHtml(me.compRef.chart, msg);
    },
    _updateChart: function(url) {
        var me = this;
        var htmlStr = '';

        if (url.trim() != '') {
            htmlStr = '<img src="' + url + '" alt=' + languageFormat.getLanguage(20102, 'Analysis Chart') + ' - ' + me.key + '" style="width:100%; height:100%;" /> ';
        } else {
            htmlStr = languageFormat.getLanguage(30902, 'Chart is not available.');
        }

        helper.setHtml(me.compRef.chart, htmlStr);
    },
    search: function() {
        var me = this;

        var searchTxt = me.compRef.searchTf.getValue();
        searchTxt = searchTxt.trim();
        if (searchTxt == '') {
            me.compRef.searchTf.focus();
            return;
        }

        me.compRef.chart.hide();
        if (me.compRef.chartToolBtn) {
            me.compRef.chartToolBtn.hide();
        } else {
            me.compRef.styleCb.hide();
            me.compRef.typeCb.hide();
            me.compRef.movingAvgTf.hide();
            me.compRef.intervalCb.hide();
        }

        me.compRef.searchVw.show();
        me.compRef.backBtn.show();

        me.compRef.searchVw.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
        conn.searchStock({
            k: searchTxt,
            ex: exchangecode,
            quickSearch: true,
            field: [fieldStkCode, fieldStkName],
            success: function(res) {
                var records = [];
                if (res.d) {
                    records = res.d;
                }
                me.compRef.searchVw.getStore().loadData(records);
                me.compRef.searchVw.setLoading(false);
            }
        });

    },
    _setDisplay: function() {
        var me = this;

        me.compRef.searchTf.setValue('');
        me.compRef.searchVw.hide();
        me.compRef.searchVw.getStore().removeAll();
        me.compRef.backBtn.hide();
        if (me.compRef.chartToolBtn) {
            me.compRef.chartToolBtn.show();
        } else {
            me.compRef.styleCb.show();
            me.compRef.typeCb.show();
            // me.compRef.movingAvgTf.show();
            me.compRef.intervalCb.show();
        }
        me.compRef.chart.show();
    },
    openChartTool: function() {
        var me = this;

        if (!me.compRef.chartToolWin) {
            me.compRef.chartToolWin = msgutil.popup({
                title: languageFormat.getLanguage(20112, 'Chart Tool'),
                width: 160,
                height: 145,
                resizable: false,
                modal: false,
                closeAction: 'hide',
                items: {
                    xtype: 'container',
                    padding: 5,
                    items: [
                        me.compRef.styleCb,
                        me.compRef.typeCb,
                        me.compRef.movingAvgTf,
                        me.compRef.intervalCb
                    ]
                },
                bbar: [
                    '->',
                    {
                        text: languageFormat.getLanguage(20092, 'Load'),
                        handler: function() {
                            me.compRef.chartToolWin.close();
                            me.getChart();
                        }
                    },
                    '-',
                    {
                        text: languageFormat.getLanguage(10010, 'Cancel'),
                        handler: function() {
                            me.compRef.chartToolWin.close();
                        }
                    }
                ]
            });
        } else {
            me.compRef.chartToolWin.show();
            me.compRef.chartToolWin.toFront();
        }
    },
    setCode: function(stkcode, stkname) {
        var me = this;

        if (me.key) {
            me.oldKey = me.key;
        }

        me.key = stkcode;
        me.stkname = stkname;

    },
    loadURLChart: function() {
        var me = this;
        // Removes delayed exchange suffix. Determine whether exchange is delayed based on param 'View'
        var nonDelayCode = stockutil.removeStockDelay(me.key);
        var stkParts = stockutil.getStockParts(nonDelayCode);
        //var stkParts = stockutil.getStockParts(me.key);
        
        var params = [
            '?exchg=' + stkParts.exch,
            'Code=' + stkParts.code,
            'Name=' + encodeURIComponent(stockutil.getStockName(me.stkname)),
            "lang=" + global_Language,
            'View=' + (stockutil.isDelayStock(me.key) ? 'D' : 'R'),
            'color=' + formatutils.procThemeColor(),
            'isstock=' + (me.isIndices ? 'N' : 'Y'),
            'type=' + me.type + (me.isIndices ? 'i' : ''),
            'newOpen=' + (jsutil.boolToStr(me.newOpen, '1', '0'))
        ];
        
        if (me.chartURL) {
            me.compRef.mainCt.refresh(me.chartURL + params.join('&'));
        }
    },
    refreshEmpty: function() {
        var me = this;

        if (!me.key) {
            menuHandler.analysisChart();
        }
    },
    forceReloadChart: function() {
        var me = this;

        me.refresh();
        me.needReloadChart = false;
    },
    _updateTitle: function() {
        var me = this;

        me.updateTitle();
        n2nLayoutManager.updateKey(me);
    },
    syncBuffer: function(stkcode, stkname) {
        var me = this;

        // update key and title
        me.setCode(stkcode, stkname);
        me._updateTitle();

        me.needReloadChart = true;

    },
    setChartStatus: function() {
        var me = this;

        if (me.chartURL && me.newOpen) {
            me.newOpen = false;
            var newUrl = updateQueryStringParameter(me.compRef.mainCt.iframeURL, 'newOpen', '0');
            me.compRef.mainCt.refresh(newUrl);
        }
    }
});