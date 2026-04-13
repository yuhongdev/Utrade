/*
 * View: Derivatives Portfolio Detail
 */
Ext.define('TCPlus.view.portfolio.VDerivativePrtfDetail', {
    extend: 'Ext.container.Container',
    alias: 'widget.derivative_prtf_detail',
    debug: false,
    compRef: {}, // component references
    _dayLoaded: false,
    _nightLoaded: false,
    _loadError: false,
    winConfig: {
        width: 1200
    },
    type: 'portfolio_detail',
    initComponent: function() {
        var me = this;

        // must call this first
        me._createUIItems();

        var dLayout = {
            type: 'column'
        };

        var dItems = [
            me.compRef.dayCt,
            me.compRef.nightCt
        ];

        if (isMobile) {
            dLayout = 'fit';
            dItems = {
                xtype: 'tabpanel',
                deferredRender: false,
                border: false,
                items: [
                    me.compRef.dayCt,
                    me.compRef.nightCt
                ]
            };
        }

        var config = {
            layout: dLayout,
            items: dItems,
            listeners: {
                afterrender: function(thisComp) {
                    /* no need anymore, will be removed in the future
                     if (!isMobile) {
                     var pme = me.up();
                     if (pme) {
                     var pmeHeight = pme.getHeight();
                     var gridHeight = 200; // default height
                     if (n2nLayoutManager.isTabLayout()) {
                     gridHeight = pmeHeight - 104;
                     } else {
                     gridHeight = pmeHeight - 137;
                     }
                     
                     if (me.debug) {
                     console.log('VDerivativePrtfDetail > parent body height ', pmeHeight);
                     console.log('set grid height ', gridHeight);
                     }
                     
                     me.compRef.dayGrid.setHeight(gridHeight);
                     me.compRef.nightGrid.setHeight(gridHeight);
                     }
                     }
                     */
                },
                resize: function(thisComp, newWidth, newHeight, oldWidth, oldHeight) {
                    if (!isMobile) {
                        me.compRef.dayCt.setHeight(newHeight);
                        me.compRef.nightCt.setHeight(newHeight);
                    }
                },
                destroy: function(thisComp) {
                    me.compRef.mainMask = null;
                    me.compRef.dayLoadMask = null;
                    me.compRef.nightLoadMask = null;
                }
            }
        };

        Ext.apply(me, config);
        me.callParent();
    },
    refresh: function() {
        var me = this;

        me._showLoadMask();
        // updates title
        me.updateTitle();
        me.resetData();

        me._loadData('dprtfD_currentday');
        me._loadData('dprtfD_overnight');
    },
    resetData: function() {
        var me = this;

        helper.setHtml(me.compRef.dayAvgBuyLbl, '-');
        helper.setHtml(me.compRef.dayAvgSellLbl, '-');
        helper.setHtml(me.compRef.dayTotalBuyLbl, '-');
        helper.setHtml(me.compRef.dayTotalSellLbl, '-');

        helper.setHtml(me.compRef.nightAvgPriceLbl, '-');
        helper.setHtml(me.compRef.nightAvgSellLbl, '-');
        helper.setHtml(me.compRef.nightBuyQtyLbl, '-');
        helper.setHtml(me.compRef.nightSellQtyLbl, '-');
        helper.setHtml(me.compRef.nightUnRealLbl, '-');

        if (me.compRef.dayGridStore.getCount() > 0) {
            me.compRef.dayGridStore.removeAll();
        }
        if (me.compRef.nightGridStore.getCount() > 0) {
            me.compRef.nightGridStore.removeAll();
        }

    },
    updateTitle: function() {
        var me = this;
        var compTitle = languageFormat.getLanguage(20285, 'Detail') + UI.titleSeparator + stockutil.getStockPart(this.stkName);
        n2nLayoutManager.updateTitle(me, compTitle);
    },
    _createUIItems: function() {
        var me = this;
        var eleStyle = 'text-align:center;padding:3px;';

        var ctHeight = 80;
        var tempContainerAvg = new Array();
        var tempContainerQty = new Array();
        
        /* Day container */
        
        me.compRef.dayAvgBuyTitle = Ext.create('Ext.form.Label', {
            text: languageFormat.getLanguage(10001, 'Buy'),
            columnWidth: isMobile ? 0.25 : 0.5,
            //minWidth: 100,
            style: eleStyle
        });
        me.compRef.dayAvgSellTitle = Ext.create('Ext.form.Label', {
            text: languageFormat.getLanguage(10002, 'Sell'),
            columnWidth: isMobile ? 0.25 : 0.5,
           // minWidth: 100,
            style: eleStyle
        });
        
        me.compRef.dayQtyBuyTitle = Ext.create('Ext.form.Label', {
            text: languageFormat.getLanguage(10001, 'Buy'),
            columnWidth: 0.5,
            //minWidth: 100,
            style: eleStyle
        });
        me.compRef.dayQtySellTitle = Ext.create('Ext.form.Label', {
            text: languageFormat.getLanguage(10002, 'Sell'),
            columnWidth: 0.5,
            //minWidth: 100,
            style: eleStyle
        });

        me.compRef.dayAvgBuyLbl = Ext.create('Ext.form.Label', {
            text: '-',
            columnWidth: isMobile ? 0.75 : 0.5,
            //minWidth: 100,
            style: eleStyle
        });
        me.compRef.dayAvgSellLbl = Ext.create('Ext.form.Label', {
            text: '-',
            columnWidth: isMobile ? 0.75 : 0.5,
            //minWidth: 100,
            style: eleStyle
        });
        me.compRef.dayTotalBuyLbl = Ext.create('Ext.form.Label', {
            text: '-',
            columnWidth: 0.5,
            //minWidth: 70,
            style: eleStyle
        });
        me.compRef.dayTotalSellLbl = Ext.create('Ext.form.Label', {
            text: '-',
            columnWidth: 0.5,
            //minWidth: 70,
            style: eleStyle
        });
        
        if(isMobile){
        	tempContainerAvg = [me.compRef.dayAvgBuyTitle,
        	                    me.compRef.dayAvgBuyLbl,
        	                    me.compRef.dayAvgSellTitle,
        	                    me.compRef.dayAvgSellLbl];
        	
        	tempContainerQty =[me.compRef.dayQtyBuyTitle,
        	                   me.compRef.dayTotalBuyLbl,
        	                   me.compRef.dayQtySellTitle,
        	                   me.compRef.dayTotalSellLbl
        	                   ];
        }else{
        	tempContainerAvg = [me.compRef.dayAvgBuyTitle,
        	                    me.compRef.dayAvgSellTitle,
        	                    me.compRef.dayAvgBuyLbl,
        	                    me.compRef.dayAvgSellLbl];

        	tempContainerQty =[me.compRef.dayQtyBuyTitle,
        	                   me.compRef.dayQtySellTitle,
        	                   me.compRef.dayTotalBuyLbl,
        	                   me.compRef.dayTotalSellLbl
        	                   ];
        }

        me.compRef.dayInnerCt = Ext.create('Ext.container.Container', {
            layout: 'column',
            height: ctHeight,
            items: [
                {
                    xtype: 'panel',
                    layout: {
                        type: 'column'
                    },
                    title: languageFormat.getLanguage(10602, 'Average Price'),
                    columnWidth: 0.5,
                    height: ctHeight,
                    bodyCls: 'middlebody',
                    items: tempContainerAvg
                },
                {
                    xtype: 'panel',
                    layout: {
                        type: 'column'
                    },
                    title: languageFormat.getLanguage(20290, 'Total Quantity'),
                    columnWidth: 0.5,
                    height: ctHeight,
                    bodyCls: 'middlebody',
                    items: tempContainerQty
                }
            ]
        });

        /*Ext.define('DerivativePrtfDetail', {
            extend: 'Ext.data.Model',
            fields: [
                {
                    name: 'no',
                    mapping: '42',
                    type: 'int'
                },
                {
                    name: 'buy',
                    mapping: 'buy',
                    type: 'int'
                },
                {
                    name: 'sell',
                    mapping: 'sell',
                    type: 'int'
                },
                {
                    name: 'price',
                    mapping: '117',
                    type: 'float'
                },
                {
                    name: 'real',
                    mapping: 'real',
                    type: 'float'
                },
                {
                    name: 'curr',
                    mapping: 'curr',
                    type: 'string'
                }
            ],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    totalProperty: "c",
                    rootProperty: "d",
                    successProperty: "s"
                }
            }
        });*/
        me.compRef.dayGridStore = Ext.create('Ext.data.Store', {
            model: 'TCPlus.model.DerivativePrtfDetailRecord'
        });
        me.compRef.dayGrid = Ext.create('Ext.grid.Panel', {
            flex: 1,
            layout: 'fit',
            border: false,
            store: me.compRef.dayGridStore,
            columns: {
                items: [
                    me._colObj({
                        text: languageFormat.getLanguage(10501, 'No.'),
                        dataIndex: 'no',
                        width: 40,
                        renderer: function(value) {
                            return value;
                        }
                    }),
                    me._colObj({
                        text: languageFormat.getLanguage(10001, 'Buy'),
                        dataIndex: 'buy'
                    }),
                    me._colObj({
                        text: languageFormat.getLanguage(10002, 'Sell'),
                        dataIndex: 'sell'
                    }),
                    me._colObj({
                        text: languageFormat.getLanguage(20835, 'Price'),
                        dataIndex: 'price',
                        width: 110,
                        renderer: function(value) {
                            return me._formatNum(value.toFixed(3));
                        }
                    }),
                    me._colObj({
                        text: languageFormat.getLanguage(10132, 'Currency'),
                        dataIndex: 'curr',
                        width: 65,
                        renderer: function(value) {
                            return value;
                        }
                    })
                ]
            }
        });

        me.compRef.dayCt = Ext.create('Ext.panel.Panel', {
            title: languageFormat.getLanguage(20288, 'Day'),
            columnWidth: 0.5,
            border: !isMobile,
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                me.compRef.dayInnerCt,
                me.compRef.dayGrid
            ]
        });

        /* Overnight panel */        
        
        me.compRef.nightAvgBuyTitle = Ext.create('Ext.form.Label', {
            text: languageFormat.getLanguage(10001, 'Buy'),
            columnWidth: isMobile ? 0.25 : 0.5,
            //minWidth: 100,
            style: eleStyle
        });
        me.compRef.nightAvgSellTitle = Ext.create('Ext.form.Label', {
            text: languageFormat.getLanguage(10002, 'Sell'),
            columnWidth: isMobile ? 0.25 : 0.5,
            //minWidth: 100,
            style: eleStyle
        });
        
        me.compRef.nightQtyBuyTitle = Ext.create('Ext.form.Label', {
            text: languageFormat.getLanguage(10001, 'Buy'),
            columnWidth: 0.5,
            //minWidth: 100,
            style: eleStyle
        });
        me.compRef.nightQtySellTitle = Ext.create('Ext.form.Label', {
            text: languageFormat.getLanguage(10002, 'Sell'),
            columnWidth: 0.5,
            //minWidth: 100,
            style: eleStyle
        });
        
        me.compRef.nightAvgPriceLbl = Ext.create('Ext.form.Label', {
            text: '-',
            columnWidth: isMobile ? 0.75 : 0.5,
            //minWidth: 100,
            style: eleStyle
        });
        me.compRef.nightAvgSellLbl = Ext.create('Ext.form.Label', {
            text: '-',
            columnWidth: isMobile ? 0.75 : 0.5,
            //minWidth: 100,
            style: eleStyle
        });
        me.compRef.nightBuyQtyLbl = Ext.create('Ext.form.Label', {
            text: '-',
            columnWidth: 0.5,
            //minWidth: 70,
            style: eleStyle
        });
        me.compRef.nightSellQtyLbl = Ext.create('Ext.form.Label', {
            text: '-',
            columnWidth: 0.5,
            //minWidth: 70,
            style: eleStyle
        });
        me.compRef.nightUnRealLbl = Ext.create('Ext.form.Label', {
            text: '-'
        });
        
        if(isMobile){
        	tempContainerAvg = [me.compRef.nightAvgBuyTitle,
        	                    me.compRef.nightAvgPriceLbl,
        	                    me.compRef.nightAvgSellTitle,
        	                    me.compRef.nightAvgSellLbl];

        	tempContainerQty =[me.compRef.nightQtyBuyTitle,
        	                   me.compRef.nightBuyQtyLbl,
        	                   me.compRef.nightQtySellTitle,
        	                   me.compRef.nightSellQtyLbl
        	                   ];
        }else{
        	tempContainerAvg = [me.compRef.nightAvgBuyTitle,
        	                    me.compRef.nightAvgSellTitle,
        	                    me.compRef.nightAvgPriceLbl,
        	                    me.compRef.nightAvgSellLbl];

        	tempContainerQty =[me.compRef.nightQtyBuyTitle,
        	                   me.compRef.nightQtySellTitle,
        	                   me.compRef.nightBuyQtyLbl,
        	                   me.compRef.nightSellQtyLbl
        	                   ];
        }
        
        me.compRef.nightInnerCt = Ext.create('Ext.container.Container', {
            layout: 'column',
            border: false,
            items: [
                {
                    xtype: 'panel',
                    height: ctHeight,
                    layout: {
                        type: 'column'
                    },
                    columnWidth: 0.4,
                    title: languageFormat.getLanguage(10602, 'Average Price'),
                    bodyCls: 'middlebody',
                    items: tempContainerAvg
                },
                {
                    xtype: 'panel',
                    height: ctHeight,
                    layout: {
                        type: 'column'
                    },
                    columnWidth: 0.3,
                    title: languageFormat.getLanguage(20290, 'Total Quantity'),
                    bodyCls: 'middlebody',
                    items: tempContainerQty
                },
                {
                    xtype: 'panel',
                    height: ctHeight,
                    columnWidth: 0.3,
                    layout: {
                        type: 'table',
                        columns: 1,
                        tableAttrs: {
                            style: {
                                width: '100%',
                                height: '100%'
                            }
                        },
                        tdAttrs: {
                            width: '100%',
                            style: 'text-align:center'
                        }
                    },
                    header:{minHeight:27},
                    title: isMobile ? '<label style="white-space:normal;font-size:10px !important;">' + languageFormat.getLanguage(20291, 'Total Unrealised G/L') + '</label>' : languageFormat.getLanguage(20291, 'Total Unrealised G/L'),
                    items: [
                        me.compRef.nightUnRealLbl
                    ]
                }
            ]
        });
        me.compRef.nightGridStore = Ext.create('Ext.data.Store', {
        	model: 'TCPlus.model.DerivativePrtfDetailRecord'
        });
        me.compRef.nightGrid = Ext.create('Ext.grid.Panel', {
            flex: 1,
            layout: 'fit',
            border: false,
            store: me.compRef.nightGridStore,
            columns: {
                items: [
                    me._colObj({
                        text: languageFormat.getLanguage(10501, 'No.'),
                        dataIndex: 'no',
                        width: 35,
                        renderer: function(value) {
                            return value;
                        }
                    }),
                    me._colObj({
                        text: languageFormat.getLanguage(10001, 'Buy'),
                        dataIndex: 'buy',
                        width: 85
                    }),
                    me._colObj({
                        text: languageFormat.getLanguage(10002, 'Sell'),
                        dataIndex: 'sell',
                        width: 85
                    }),
                    me._colObj({
                        text: languageFormat.getLanguage(20835, 'Price'),
                        dataIndex: 'price',
                        width: 110,
                        renderer: function(value) {
                            return me._formatNum(value.toFixed(3));
                        }
                    }),
                    me._colObj({
                        text: languageFormat.getLanguage(10604, 'Unrealised P/L'),
                        dataIndex: 'real',
                        width: 120,
                        renderer: function(value) {
                            return me._formatNum(value.toFixed(6));
                        }
                    }),
                    me._colObj({
                        text: languageFormat.getLanguage(10132, 'Currency'),
                        dataIndex: 'curr',
                        width: 65,
                        renderer: function(value) {
                            return value;
                        }
                    })
                ]
            }
        });
        me.compRef.nightCt = Ext.create('Ext.panel.Panel', {
            title: languageFormat.getLanguage(20289, 'Overnight'),
            columnWidth: 0.5,
            border: isMobile ? false : '1 1 1 0',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            items: [
                me.compRef.nightInnerCt,
                me.compRef.nightGrid
            ]
        });
    },
    _colObj: function(colObj) {
        var me = this;

        Ext.applyIf(colObj, {
            sortable: false,
            menuDisabled: true,
            align: 'right',
            width: 100,
            renderer: function(value, meta) {
                return me._formatNum(value);
            }
        });

        return colObj;
    },
    _loadData: function(dtype) {
        var me = this;
        if (me.debug) {
            console.log('VDerivativePrtfDetail > _loadGridData');
        }

        var mode = 2;
        if (dtype == 'dprtfD_overnight') {
            mode = 1;
            me._nightLoaded = false;
        } else {
            me._dayLoaded = false;
        }

        var ajaxUrl = addPath + 'tcplus/atp/derivativeportfoliodetail?';
        var ajaxParams = [
            's=' + new Date().getTime(),
            'ty=' + dtype,
            'ac=' + me.accountName,
            'bc=' + me.branchCode,
            'ex=MY',
            'sc=' + me.key,
            'mode=' + mode
        ];

        // call ajax
        Ext.Ajax.request({
            url: ajaxUrl + ajaxParams.join('&'),
            method: 'GET',
            success: function(response) {
                try {
                    var resObj = Ext.decode(response.responseText);

                    if (me.debug) {
                        console.log('return obj -> ', resObj);
                    }
                    if (resObj.s) {
                        if (resObj.t == 'dprtfD_overnight') {
                            me._updateNightData(resObj.d);
                        } else {
                            me._updateDayData(resObj.d);
                        }
                    } else {
                        me._loadError = true;
                        console.log('ajax success', dtype, ' error -> ', resObj.msg);
                    }
                } catch (e) {
                    me._loadError = true;
                    console.log('ajax success ', dtype, ' e -> ', e);
                }
                me.compRef.mainMask.hide();
                me.compRef.dayLoadMask.hide();
                me.compRef.nightLoadMask.hide();
            },
            failure: function(response) {
                console.log('ajax failure', dtype, ' error -> ', response.responseText);
                me._loadError = true;
                me.compRef.mainMask.hide();
                me.compRef.dayLoadMask.hide();
                me.compRef.nightLoadMask.hide();
            }
        });
    },
    _updateDayData: function(dataObj) {
        var me = this;

        var stkRecord = Storage.returnRecord(me.key);
        if (stkRecord) {
            var totalBuy = 0;
            var totalBuyPrice = 0;
            var totalSell = 0;
            var totalSellPrice = 0;

            var records = new Array();
            for (var i = 0; i < dataObj.length; i++) {
                var recObj = dataObj[i];
                var record = {};

                var matchPrice = recObj['117'];
                var matchQty = recObj['116'];

                if (recObj['114'].toLowerCase() == 'b') {
                    record['buy'] = recObj['116'];
                    record['sell'] = 0;

                    totalBuy += parseInt(recObj['116']);
                    totalBuyPrice += parseFloat(matchPrice * matchQty);
                } else {
                    record['buy'] = 0;
                    record['sell'] = recObj['116'];

                    totalSell += parseInt(recObj['116']);
                    totalSellPrice += parseFloat(matchPrice * matchQty);
                }

                record['no'] = recObj['42'];
                record['curr'] = recObj['155'];
                record['price'] = matchPrice;

                records.push(record);
            }

            var avgBuyPrice = stockutil.getAvgPrice(totalBuyPrice, totalBuy);
            var avgSellPrice = stockutil.getAvgPrice(totalSellPrice, totalSell);
            // update top info
            helper.setHtml(me.compRef.dayAvgBuyLbl, me._formatNum(avgBuyPrice.toFixed(6)));
            helper.setHtml(me.compRef.dayAvgSellLbl, me._formatNum(avgSellPrice.toFixed(6)));
            helper.setHtml(me.compRef.dayTotalBuyLbl, me._formatNum(totalBuy));
            helper.setHtml(me.compRef.dayTotalSellLbl, me._formatNum(totalSell));

            // update grid
            me.compRef.dayGridStore.loadData(records);

            me._dayLoaded = true;
        }
    },
    _updateNightData: function(dataObj) {
        var me = this;

        var totalUnreal = 0;
        var totalBuy = 0;
        var totalBuyPrice = 0;
        var totalSell = 0;
        var totalSellPrice = 0;

        var records = new Array();
        for (var i = 0; i < dataObj.length; i++) {
            var recObj = dataObj[i];
            var record = {};

            var matchPrice = recObj['117'];
            var matchQty = recObj['116'];
            var multiplier = recObj['118'];
            var totalReal = 0;

            if (recObj['114'].toLowerCase() == 'b') {
                record['buy'] = recObj['116'];
                record['sell'] = 0;

                totalReal = parseFloat((me.lastDone - matchPrice) * matchQty * multiplier);
                totalBuy += parseInt(recObj['116']);
                totalBuyPrice += parseFloat(matchPrice * matchQty);
            } else {
                record['buy'] = 0;
                record['sell'] = recObj['116'];

                totalReal = parseFloat((me.lastDone - matchPrice) * (-matchQty) * multiplier + 0);
                totalSell += parseInt(recObj['116']);
                totalSellPrice += parseFloat(matchPrice * matchQty);
            }
            totalUnreal += totalReal;

            record['no'] = recObj['42'];
            record['curr'] = recObj['155'];
            record['price'] = matchPrice;
            record['real'] = totalReal;

            records.push(record);
        }

        var avgBuyPrice = stockutil.getAvgPrice(totalBuyPrice, totalBuy);
        var avgSellPrice = stockutil.getAvgPrice(totalSellPrice, totalSell);
        // update top info
        helper.setHtml(me.compRef.nightAvgPriceLbl, me._formatNum(avgBuyPrice.toFixed(6)));
        helper.setHtml(me.compRef.nightAvgSellLbl, me._formatNum(avgSellPrice.toFixed(6)));
        helper.setHtml(me.compRef.nightBuyQtyLbl, me._formatNum(totalBuy));
        helper.setHtml(me.compRef.nightSellQtyLbl, me._formatNum(totalSell));
        helper.setHtml(me.compRef.nightUnRealLbl, me._formatNum(totalUnreal.toFixed(6)));

        // update grid
        me.compRef.nightGridStore.loadData(records);

        me._nightLoaded = true;
    },
    _formatNum: function(num) {
        return formatutils.formatNumber(num);
    },
    _showLoadMask: function() {
        var me = this;

        if (!me.compRef.dayLoadMask) {
            me.compRef.dayLoadMask = me.compRef.dayCt.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
            me.compRef.dayLoadMask.hide();
        }

        if (!me.compRef.nightLoadMask) {
            me.compRef.nightLoadMask = me.compRef.nightCt.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
            me.compRef.nightLoadMask.hide();
        }

        if (!me.compRef.mainMask) {
            me.compRef.mainMask = me.setLoading({
                msg: languageFormat.getLanguage(10017, 'Loading...'),
                listeners: {
                    hide: function() {
                        if (me._loadError || me._dayLoaded) {
                            me.compRef.dayLoadMask.hide();
                        } else {
                            me.compRef.dayLoadMask.show();
                        }

                        if (me._loadError || me._nightLoaded) {
                            me.compRef.nightLoadMask.hide();
                        } else {
                            me.compRef.nightLoadMask.show();
                        }
                    },
                    show: function() {
                        me._loadError = false;
                    }
                }
            });
        } else {
            me.compRef.mainMask.show();
        }
    }
});