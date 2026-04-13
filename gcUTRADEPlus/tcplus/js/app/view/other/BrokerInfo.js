Ext.define('TCPlus.view.other.BrokerInfo', {
    alias: 'widget.brokerinfo',
    extend: 'Ext.container.Container',
    compRef: {},
    winConfig: {
        width: 800,
        height: 400
    },
    type: 'bki',
    savingComp: true,
    bkMode: 'bkRank',
    intervalTimeOut: null,
    bkRankGridCol: 'bkCode,bkName,totalVal,buyVal,sellVal,netVal,crossVal,blockVal,weight,trade',
    bkRankGridCol_JK: 'bkCode,bkName,totalVol,totalVal,totalFreq,buyVol,buyVal,buyFreq,sellVol,sellVal,sellFreq,netVal,netVol,dBuyVol,dBuyVal,dBuyFreq,dSellVol,dSellVal,dSellFreq,dNetVal,dNetVol,fBuyVol,fBuyVal,fBuyFreq,fSellVol,fSellVal,fSellFreq,fNetVal,fNetVol',
    bkTranGridCol: 'stkCode,secCode,buyVol,buyVal,buyAvg,sellVol,sellVal,sellAvg,totalVol,totalVal,trade,netBuyVol,netSellVol,netBuyVal,netSellVal,weightValPc,mktVolPc,mktValPc',
    bkTranGridCol_JK: 'stkCode,totalVol,totalVal,totalFreq,buyVol,buyVal,buyFreq,sellVol,sellVal,sellFreq,netVal,netVol,dBuyVol,dBuyVal,dBuyFreq,dSellVol,dSellVal,dSellFreq,dNetVal,dNetVol,fBuyVol,fBuyVal,fBuyFreq,fSellVol,fSellVal,fSellFreq,fNetVal,fNetVol',
    bkCounterGridCol: 'bkCode,bkName,totalVal,buyVal,sellVal,netVal,crossVal,blockVal,weight,trade',
    bkCounterGridCol_JK: 'bkCode,bkName,totalVol,totalVal,totalFreq,buyVol,buyVal,buyFreq,sellVol,sellVal,sellFreq,netVal,netVol,dBuyVol,dBuyVal,dBuyFreq,dSellVol,dSellVal,dSellFreq,dNetVal,dNetVol,fBuyVol,fBuyVal,fBuyFreq,fSellVol,fSellVal,fSellFreq,fNetVal,fNetVol',
    bkList: null,
    initComponent: function() {
        var me = this;

        me.exch = exchangecode;

        me._createUIItems();
        Ext.apply(me, {
            items: [me.compRef.topCt, me.compRef.mainCt],
            layout: 'vbox',
            title: languageFormat.getLanguage(11060, 'Broker Info'),
            listeners: {
                afterrender: function() {
                    me.setExchange(exchangecode);
                    me.getBrokerInfo();
                },
                beforedestroy: function() {
                    me._stopRefreshTask();
                }
            }
        });

        me.callParent(arguments);
    },
    _createUIItems: function() {
        var me = this;

        me.compRef.bkFilter = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: languageFormat.getLanguage(11067, 'Broker Code'),
            labelWidth: 70,
            width: 250,
            store: {
                fields: ['bkCode', 'bkName']
            },
            displayField: 'bkName',
            valueField: 'bkCode',
            style: 'margin-left: 5px',
            hidden: true,
            queryMode: 'local',
            matchFieldWidth: false,
            selectOnFocus: true,
            forceSelection: true,
            listConfig: {
                tpl: Ext.create('Ext.XTemplate', // displayed in list
                        '<tpl for=".">',
                        '<div class="x-boundlist-item">{bkCode} ({bkName})</div>',
                        '</tpl>'
                        )
            },
            listeners: {
                select: function() {
                    me.getBrokerInfo();
                }
            }
        });
        me.compRef.tranFilter = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: languageFormat.getLanguage(11064, 'Filter by'),
            labelWidth: 60,
            width: 180,
            hidden: me.exch === 'JK',
            store: {
                fields: ['value', 'label'],
                data: [
                    {value: 'all', label: languageFormat.getLanguage(11065, 'All Transactions')},
                    {value: 'noCross', label: languageFormat.getLanguage(11066, 'Without Crosses')},
                    {value: 'noBlock', label: languageFormat.getLanguage(11078, 'Without Blocks')}
                ]
            },
            displayField: 'label',
            valueField: 'value',
            value: 'all',
            editable: false,
            style: 'margin-left: 5px',
            queryMode: 'local',
            listeners: {
                select: function() {
                    me.getBrokerInfo();
                }
            }
        });

        me.compRef.stkCb = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: languageFormat.getLanguage(10912, 'StkCode'),
            enableKeyEvents: true,
            hidden: true,
            width: 200,
            labelWidth: 60,
            matchFieldWidth: false,
            store: {
                fields: [fieldStkCode, fieldStkName]
            },
            valueField: fieldStkCode,
            displayField: fieldStkName,
            typeAhead: true,
            typeAheadDelay: 200,
            hideTrigger: true,
            minChars: 1,
            queryMode: 'local',
            selectOnFocus: true,
            forceSelection: true,
            tpl: Ext.create('Ext.XTemplate', // displayed in list
                    '<tpl for=".">',
                    '<div class="x-boundlist-item">{' + fieldStkName + '} ({' + fieldStkCode + '})</div>',
                    '</tpl>'
                    ),
            displayTpl: Ext.create('Ext.XTemplate', // displayed in textbox
                    '<tpl for=".">',
                    '{' + fieldStkName + '} ({' + fieldStkCode + '})',
                    '</tpl>'
                    ),
            listeners: {
                afterrender: function(thisCb) {
                    var task = new Ext.util.DelayedTask(function() {
                        var searchKey = thisCb.getValue();
                        if (searchKey) {
                            searchKey = searchKey.trim();
                        }

                        if (searchKey) {
                            conn.searchStock({
                                ex: me.exch,
                                k: searchKey,
                                field: [fieldStkCode, fieldStkName],
                                mkt: conn.getMarketCode(me.exch, '[All Stocks]'),
                                success: function(obj) {
                                    thisCb.store.clearFilter();
                                    thisCb.store.loadData(obj.d);
                                    thisCb.expand();
                                }
                            });
                        } else {
                            thisCb.collapse();
                        }
                    });

                    thisCb.on('keyup', function() {
                        task.delay(700);
                    });
                },
                select: function() {
                    me.getBrokerInfo();
                }
            }
        });

        me.compRef.refreshBt = Ext.create('Ext.button.Button', {
            text: languageFormat.getLanguage(10003, 'Reset'),
            tooltip: languageFormat.getLanguage(10003, 'Reset'),
            icon: icoBtnReset,
            cls: 'fix_btn',
            style: 'margin-left: 5px',
            handler: function() {
                me.getBrokerInfo();
            }
        });

        me.compRef.topCt = Ext.create('Ext.toolbar.Toolbar', {
            width: '100%',
            items: [me.compRef.bkFilter, me.compRef.stkCb, me.compRef.tranFilter, me.compRef.refreshBt],
            height: 40,
            cls: 'fix-tbar-bg',
            enableOverflow: true,
            autoScroll: false
        });

        me.createBkRankGrid();
        me.createBkTranGrid();
        me.createBkCounterGrid();

        me.compRef.mainCt = Ext.create('Ext.tab.Panel', {
            width: '100%',
            items: [
                me.compRef.bkRankGrid,
                me.compRef.bkTranGrid,
                me.compRef.bkCounterGrid
            ],
            flex: 1,
            activeTab: 0,
            listeners: {
                tabchange: function(thisTb, newTab, oldTab) {
                    me.activateTopItems(newTab.bkMode);
                }
            }
        });

    },
    createBkRankGrid: function() {
        var me = this;

        me.compRef.bkRankGrid = Ext.create('Ext.grid.Panel', {
            store: {
                fields: ['bkCode', 'bkName',
                    {name: 'buyVol', sortType: 'asInt'},
                    {name: 'buyVal', sortType: 'asFloat'},
                    {name: 'sellVol', sortType: 'asInt'},
                    {name: 'sellVal', sortType: 'asFloat'},
                    {name: 'totalVol', sortType: 'asInt'},
                    {name: 'totalVal', sortType: 'asFloat'},
                    {name: 'netVol', sortType: 'asInt'},
                    {name: 'netVal', sortType: 'asFloat'},
                    // for other exchanges
                    {name: 'noTran', sortType: 'asInt'},
                    {name: 'mktWeight', sortType: 'asFloat'},
                    {name: 'crossVal', sortType: 'asFloat'},
                    {name: 'blockVal', sortType: 'asFloat'},
                    {name: 'crossVol', sortType: 'asInt'},
                    {name: 'blockVol', sortType: 'asInt'},
                    // for JK
                    {name: 'buyFreq', sortType: 'asInt'},
                    {name: 'sellFreq', sortType: 'asInt'},
                    {name: 'totalFreq', sortType: 'asInt'},
                    {name: 'dBuyVol', sortType: 'asInt'},
                    {name: 'dBuyVal', sortType: 'asFloat'},
                    {name: 'dSellVol', sortType: 'asInt'},
                    {name: 'dSellVal', sortType: 'asFloat'},
                    {name: 'dTotalVol', sortType: 'asInt'},
                    {name: 'dTotalVal', sortType: 'asFloat'},
                    {name: 'dNetVol', sortType: 'asInt'},
                    {name: 'dNetVal', sortType: 'asFloat'},
                    {name: 'dBuyFreq', sortType: 'asInt'},
                    {name: 'dSellFreq', sortType: 'asInt'},
                    {name: 'fBuyVol', sortType: 'asInt'},
                    {name: 'fBuyVal', sortType: 'asFloat'},
                    {name: 'fSellVol', sortType: 'asInt'},
                    {name: 'fSellVal', sortType: 'asFloat'},
                    {name: 'fTotalVol', sortType: 'asInt'},
                    {name: 'fTotalVal', sortType: 'asFloat'},
                    {name: 'fNetVol', sortType: 'asInt'},
                    {name: 'fNetVal', sortType: 'asFloat'},
                    {name: 'fBuyFreq', sortType: 'asInt'},
                    {name: 'fSellFreq', sortType: 'asInt'}
                ]
            },
            columns: me.getBkRankGridCols(),
            title: languageFormat.getLanguage(11061, 'Broker Ranking'),
            bkMode: 'bkRank'
        });
    },
    getBkRankGridCols: function() {
        var me = this;
        var gridCols = [];
        var colStr = me.exch === 'JK' ? me.bkRankGridCol_JK : me.bkRankGridCol;
        var colArr = colStr.split(',');

        for (var i = 0; i < colArr.length; i++) {
            var colId = colArr[i].trim();
            var col = null;

            switch (colId) {
                case 'bkCode':
                    col = {
                        text: languageFormat.getLanguage(11068, 'Broker'),
                        width: 60,
                        dataIndex: 'bkCode',
                        locked: true
                    };
                    break;
                case 'bkName':
                    col = {
                        text: languageFormat.getLanguage(11069, 'BrokerName'),
                        width: 335,
                        dataIndex: 'bkName',
                        renderer: function(val, meta, rec) {
                            if (val) {
                                return val;
                            } else {
                                return me.getBkName(rec.get('bkCode'));
                            }
                        }
                    };
                    break;
                case 'totalVol':
                    col = {
                        text: languageFormat.getLanguage(11093, 'TotalVol'),
                        width: 110,
                        dataIndex: 'totalVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'buyVol':
                    col = {
                        text: languageFormat.getLanguage(11079, 'BuyVol'),
                        width: 110,
                        dataIndex: 'buyVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'sellVol':
                    col = {
                        text: languageFormat.getLanguage(11091, 'SellVol'),
                        width: 110,
                        dataIndex: 'sellVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'totalVal':
                    col = {
                        text: languageFormat.getLanguage(11070, 'TotalVal'),
                        width: 110,
                        dataIndex: 'totalVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'buyVal':
                    col = {
                        text: languageFormat.getLanguage(11071, 'BuyVal'),
                        width: 110,
                        dataIndex: 'buyVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'sellVal':
                    col = {
                        text: languageFormat.getLanguage(11072, 'SellVal'),
                        width: 110,
                        dataIndex: 'sellVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'netVol':
                    col = {
                        text: languageFormat.getLanguage(11104, 'NetVol'),
                        width: 110,
                        align: 'right',
                        dataIndex: 'netVol',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'netVal':
                    col = {
                        text: languageFormat.getLanguage(11073, 'NetVal'),
                        width: 110,
                        align: 'right',
                        dataIndex: 'netVal',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'crossVal':
                    col = {
                        text: languageFormat.getLanguage(11074, 'CrossVal'),
                        width: 110,
                        dataIndex: 'crossVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'blockVal':
                    col = {
                        text: languageFormat.getLanguage(11075, 'BlockVal'),
                        width: 110,
                        dataIndex: 'blockVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'weight':
                    col = {
                        text: languageFormat.getLanguage(11076, 'Weight'),
                        width: 70,
                        dataIndex: 'mktWeight',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'trade':
                    col = {
                        text: languageFormat.getLanguage(11077, 'Trade'),
                        width: 70,
                        dataIndex: 'noTran',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'totalFreq':
                    col = {
                        text: languageFormat.getLanguage(11103, 'TotalFreq'),
                        width: 70,
                        dataIndex: 'totalFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'buyFreq':
                    col = {
                        text: languageFormat.getLanguage(11101, 'BuyFreq'),
                        width: 70,
                        dataIndex: 'buyFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'sellFreq':
                    col = {
                        text: languageFormat.getLanguage(11102, 'SellFreq'),
                        width: 70,
                        dataIndex: 'sellFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;

                case 'dTotalVol':
                    col = {
                        text: languageFormat.getLanguage(11111, 'DTotalVol'),
                        width: 110,
                        dataIndex: 'dTotalVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dBuyVol':
                    col = {
                        text: languageFormat.getLanguage(11109, 'DBuyVol'),
                        width: 110,
                        dataIndex: 'dBuyVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dSellVol':
                    col = {
                        text: languageFormat.getLanguage(11110, 'DSellVol'),
                        width: 110,
                        dataIndex: 'dSellVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dTotalVal':
                    col = {
                        text: languageFormat.getLanguage(11105, 'DTotalVal'),
                        width: 110,
                        dataIndex: 'fTotalVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dBuyVal':
                    col = {
                        text: languageFormat.getLanguage(11106, 'DBuyVal'),
                        width: 110,
                        dataIndex: 'dBuyVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dSellVal':
                    col = {
                        text: languageFormat.getLanguage(11107, 'DSellVal'),
                        width: 110,
                        dataIndex: 'dSellVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dNetVol':
                    col = {
                        text: languageFormat.getLanguage(11115, 'DNetVol'),
                        width: 110,
                        align: 'right',
                        dataIndex: 'dNetVol',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'dNetVal':
                    col = {
                        text: languageFormat.getLanguage(11108, 'DNetVal'),
                        width: 110,
                        align: 'right',
                        dataIndex: 'dNetVal',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'dTotalFreq':
                    col = {
                        text: languageFormat.getLanguage(11114, 'DTotalFreq'),
                        width: 70,
                        dataIndex: 'dTotalFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dBuyFreq':
                    col = {
                        text: languageFormat.getLanguage(11112, 'DBuyFreq'),
                        width: 70,
                        dataIndex: 'dBuyFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dSellFreq':
                    col = {
                        text: languageFormat.getLanguage(11113, 'DSellFreq'),
                        width: 70,
                        dataIndex: 'dSellFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;

                case 'fTotalVol':
                    col = {
                        text: languageFormat.getLanguage(11122, 'FTotalVol'),
                        width: 110,
                        dataIndex: 'fTotalVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fBuyVol':
                    col = {
                        text: languageFormat.getLanguage(11120, 'FBuyVol'),
                        width: 110,
                        dataIndex: 'fBuyVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fSellVol':
                    col = {
                        text: languageFormat.getLanguage(11121, 'FSellVol'),
                        width: 110,
                        dataIndex: 'fSellVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fTotalVal':
                    col = {
                        text: languageFormat.getLanguage(11116, 'FTotalVal'),
                        width: 110,
                        dataIndex: 'fTotalVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fBuyVal':
                    col = {
                        text: languageFormat.getLanguage(11117, 'FBuyVal'),
                        width: 110,
                        dataIndex: 'fBuyVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fSellVal':
                    col = {
                        text: languageFormat.getLanguage(11118, 'FSellVal'),
                        width: 110,
                        dataIndex: 'fSellVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fNetVol':
                    col = {
                        text: languageFormat.getLanguage(11126, 'FNetVol'),
                        width: 110,
                        align: 'right',
                        dataIndex: 'fNetVol',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'fNetVal':
                    col = {
                        text: languageFormat.getLanguage(11119, 'FNetVal'),
                        width: 110,
                        align: 'right',
                        dataIndex: 'fNetVal',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'fTotalFreq':
                    col = {
                        text: languageFormat.getLanguage(11125, 'FTotalFreq'),
                        width: 70,
                        dataIndex: 'fTotalFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fBuyFreq':
                    col = {
                        text: languageFormat.getLanguage(11123, 'FBuyFreq'),
                        width: 70,
                        dataIndex: 'fBuyFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fSellFreq':
                    col = {
                        text: languageFormat.getLanguage(11124, 'FSellFreq'),
                        width: 70,
                        dataIndex: 'fSellFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
            }

            if (col) {
                gridCols.push(col);
            }
        }

        return gridCols;
    },
    createBkTranGrid: function() {
        var me = this;

        me.compRef.bkTranGrid = Ext.create('Ext.grid.Panel', {
            store: {
                fields: ['stkCode', 'secCode',
                    {name: 'buyVol', sortType: 'asInt'},
                    {name: 'buyVal', sortType: 'asFloat'},
                    {name: 'sellVol', sortType: 'asInt'},
                    {name: 'sellVal', sortType: 'asFloat'},
                    {name: 'totalVal', sortType: 'asFloat'},
                    {name: 'totalVol', sortType: 'asInt'},
                    {name: 'netBuyVal', sortType: 'asFloat'},
                    {name: 'netSellVal', sortType: 'asFloat'},
                    {name: 'netBuyVol', sortType: 'asFloat'},
                    {name: 'netSellVol', sortType: 'asFloat'},
                    {name: 'noTran', sortType: 'asInt'},
                    {name: 'weightValPc', sortType: 'asFloat'},
                    {name: 'mktVolPc', sortType: 'asFloat'},
                    {name: 'mktValPc', sortType: 'asFloat'},
                    {name: 'sellAvg', sortType: 'asFloat'},
                    {name: 'buyAvg', sortType: 'asFloat'},
                    // JK
                    {name: 'prev', sortType: 'asFloat'},
                    {name: 'last', sortType: 'asFloat'},
                    {name: 'chg', sortType: 'asFloat'},
                    {name: 'totalVol', sortType: 'asInt'},
                    {name: 'totalFreq', sortType: 'asInt'},
                    {name: 'buyFreq', sortType: 'asInt'},
                    {name: 'sellFreq', sortType: 'asInt'},
                    {name: 'netVal', sortType: 'asFloat'},
                    {name: 'netVol', sortType: 'asInt'},
                    {name: 'dBuyVol', sortType: 'asInt'},
                    {name: 'dBuyVal', sortType: 'asFloat'},
                    {name: 'dSellVol', sortType: 'asInt'},
                    {name: 'dSellVal', sortType: 'asFloat'},
                    {name: 'dTotalVol', sortType: 'asInt'},
                    {name: 'dTotalVal', sortType: 'asFloat'},
                    {name: 'dNetVol', sortType: 'asInt'},
                    {name: 'dNetVal', sortType: 'asFloat'},
                    {name: 'dBuyFreq', sortType: 'asInt'},
                    {name: 'dSellFreq', sortType: 'asInt'},
                    {name: 'fBuyVol', sortType: 'asInt'},
                    {name: 'fBuyVal', sortType: 'asFloat'},
                    {name: 'fSellVol', sortType: 'asInt'},
                    {name: 'fSellVal', sortType: 'asFloat'},
                    {name: 'fTotalVol', sortType: 'asInt'},
                    {name: 'fTotalVal', sortType: 'asFloat'},
                    {name: 'fNetVol', sortType: 'asInt'},
                    {name: 'fNetVal', sortType: 'asFloat'},
                    {name: 'fBuyFreq', sortType: 'asInt'},
                    {name: 'fSellFreq', sortType: 'asInt'}
                ]
            },
            columns: me.getBkTranGridCols(),
            title: languageFormat.getLanguage(11062, 'Broker Transaction'),
            bkMode: 'bkTran'
        });
    },
    getBkTranGridCols: function() {
        var me = this;
        var gridCols = [];
        var colStr = me.exch === 'JK' ? me.bkTranGridCol_JK : me.bkTranGridCol;
        var colArr = colStr.split(',');

        for (var i = 0; i < colArr.length; i++) {
            var colId = colArr[i].trim();
            var col = null;
            switch (colId) {
                case 'stkCode':
                    col = {
                        text: languageFormat.getLanguage(10101, 'Code'),
                        width: 85,
                        dataIndex: 'stkCode',
                        locked: true
                    };
                    break;
                case 'secCode':
                    col = {
                        text: languageFormat.getLanguage(10701, 'Name'),
                        width: 265,
                        dataIndex: 'secCode'
                    };
                    break;
                case 'buyVol':
                    col = {
                        text: languageFormat.getLanguage(11079, 'BuyVol'),
                        width: 100,
                        dataIndex: 'buyVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'buyVal':
                    col = {
                        text: languageFormat.getLanguage(11071, 'BuyVal'),
                        width: 100,
                        dataIndex: 'buyVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'buyAvg':
                    col = {
                        text: languageFormat.getLanguage(11090, 'BuyAvg'),
                        width: 100,
                        dataIndex: 'buyAvg',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'sellVol':
                    col = {
                        text: languageFormat.getLanguage(11091, 'SellVol'),
                        width: 100,
                        dataIndex: 'sellVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'sellVal':
                    col = {
                        text: languageFormat.getLanguage(11072, 'SellVal'),
                        width: 100,
                        dataIndex: 'sellVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'sellAvg':
                    col = {
                        text: languageFormat.getLanguage(11092, 'SellAvg'),
                        width: 100,
                        dataIndex: 'sellAvg',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'totalVol':
                    col = {
                        text: languageFormat.getLanguage(11093, 'TotalVol'),
                        width: 100,
                        dataIndex: 'totalVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'totalVal':
                    col = {
                        text: languageFormat.getLanguage(11070, 'TotalVal'),
                        width: 100,
                        dataIndex: 'totalVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'noTran':
                    col = {
                        text: languageFormat.getLanguage(11077, 'Trade'),
                        width: 60,
                        dataIndex: 'noTran',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'netBuyVol':
                    col = {
                        text: languageFormat.getLanguage(11094, 'NetBuyVol'),
                        width: 100,
                        dataIndex: 'netBuyVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'netSellVol':
                    col = {
                        text: languageFormat.getLanguage(11095, 'NetSellVol'),
                        width: 100,
                        dataIndex: 'netSellVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'netBuyVal':
                    col = {
                        text: languageFormat.getLanguage(11096, 'NetBuyVal'),
                        width: 100,
                        dataIndex: 'netBuyVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'netSellVal':
                    col = {
                        text: languageFormat.getLanguage(11097, 'NetSellVal'),
                        width: 100,
                        dataIndex: 'netSellVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'weightValPc':
                    col = {
                        text: languageFormat.getLanguage(11098, '%WeightVal'),
                        width: 90,
                        dataIndex: 'weightValPc',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'mktVolPc':
                    col = {
                        text: languageFormat.getLanguage(11099, '%MktVol'),
                        width: 90,
                        dataIndex: 'mktVolPc',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'mktValPc':
                    col = {
                        text: languageFormat.getLanguage(11100, '%MktVal'),
                        width: 90,
                        dataIndex: 'mktValPc',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'prev':
                    col = {
                        text: languageFormat.getLanguage(20058, 'Prev'),
                        width: 90,
                        dataIndex: 'prev',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'last':
                    col = {
                        text: languageFormat.getLanguage(10113, 'Last'),
                        width: 90,
                        dataIndex: 'prev',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'chg':
                    col = {
                        text: languageFormat.getLanguage(10115, 'Chg'),
                        width: 90,
                        dataIndex: 'prev',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'totalVol':
                    col = {
                        text: languageFormat.getLanguage(11093, 'TotalVol'),
                        width: 100,
                        dataIndex: 'totalVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'netVal':
                    col = {
                        text: languageFormat.getLanguage(11073, 'NetVal'),
                        width: 100,
                        dataIndex: 'netVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'netVol':
                    col = {
                        text: languageFormat.getLanguage(11104, 'NetVol'),
                        width: 100,
                        dataIndex: 'netVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'totalFreq':
                    col = {
                        text: languageFormat.getLanguage(11103, 'TotalFreq'),
                        width: 60,
                        dataIndex: 'totalFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'buyFreq':
                    col = {
                        text: languageFormat.getLanguage(11101, 'BuyFreq'),
                        width: 60,
                        dataIndex: 'buyFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'sellFreq':
                    col = {
                        text: languageFormat.getLanguage(11102, 'SellFreq'),
                        width: 60,
                        dataIndex: 'sellFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dTotalVol':
                    col = {
                        text: languageFormat.getLanguage(11111, 'DTotalVol'),
                        width: 110,
                        dataIndex: 'dTotalVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dBuyVol':
                    col = {
                        text: languageFormat.getLanguage(11109, 'DBuyVol'),
                        width: 110,
                        dataIndex: 'dBuyVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dSellVol':
                    col = {
                        text: languageFormat.getLanguage(11110, 'DSellVol'),
                        width: 110,
                        dataIndex: 'dSellVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dTotalVal':
                    col = {
                        text: languageFormat.getLanguage(11105, 'DTotalVal'),
                        width: 110,
                        dataIndex: 'fTotalVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dBuyVal':
                    col = {
                        text: languageFormat.getLanguage(11106, 'DBuyVal'),
                        width: 110,
                        dataIndex: 'dBuyVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dSellVal':
                    col = {
                        text: languageFormat.getLanguage(11107, 'DSellVal'),
                        width: 110,
                        dataIndex: 'dSellVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dNetVol':
                    col = {
                        text: languageFormat.getLanguage(11115, 'DNetVol'),
                        width: 110,
                        align: 'right',
                        dataIndex: 'dNetVol',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'dNetVal':
                    col = {
                        text: languageFormat.getLanguage(11108, 'DNetVal'),
                        width: 110,
                        align: 'right',
                        dataIndex: 'dNetVal',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'dTotalFreq':
                    col = {
                        text: languageFormat.getLanguage(11114, 'DTotalFreq'),
                        width: 70,
                        dataIndex: 'dTotalFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dBuyFreq':
                    col = {
                        text: languageFormat.getLanguage(11112, 'DBuyFreq'),
                        width: 70,
                        dataIndex: 'dBuyFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dSellFreq':
                    col = {
                        text: languageFormat.getLanguage(11113, 'DSellFreq'),
                        width: 70,
                        dataIndex: 'dSellFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;

                case 'fTotalVol':
                    col = {
                        text: languageFormat.getLanguage(11122, 'FTotalVol'),
                        width: 110,
                        dataIndex: 'fTotalVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fBuyVol':
                    col = {
                        text: languageFormat.getLanguage(11120, 'FBuyVol'),
                        width: 110,
                        dataIndex: 'fBuyVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fSellVol':
                    col = {
                        text: languageFormat.getLanguage(11121, 'FSellVol'),
                        width: 110,
                        dataIndex: 'fSellVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fTotalVal':
                    col = {
                        text: languageFormat.getLanguage(11116, 'FTotalVal'),
                        width: 110,
                        dataIndex: 'fTotalVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fBuyVal':
                    col = {
                        text: languageFormat.getLanguage(11117, 'FBuyVal'),
                        width: 110,
                        dataIndex: 'fBuyVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fSellVal':
                    col = {
                        text: languageFormat.getLanguage(11118, 'FSellVal'),
                        width: 110,
                        dataIndex: 'fSellVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fNetVol':
                    col = {
                        text: languageFormat.getLanguage(11126, 'FNetVol'),
                        width: 110,
                        align: 'right',
                        dataIndex: 'fNetVol',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'fNetVal':
                    col = {
                        text: languageFormat.getLanguage(11119, 'FNetVal'),
                        width: 110,
                        align: 'right',
                        dataIndex: 'fNetVal',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'fTotalFreq':
                    col = {
                        text: languageFormat.getLanguage(11125, 'FTotalFreq'),
                        width: 70,
                        dataIndex: 'fTotalFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fBuyFreq':
                    col = {
                        text: languageFormat.getLanguage(11123, 'FBuyFreq'),
                        width: 70,
                        dataIndex: 'fBuyFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fSellFreq':
                    col = {
                        text: languageFormat.getLanguage(11124, 'FSellFreq'),
                        width: 70,
                        dataIndex: 'fSellFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
            }

            if (col) {
                gridCols.push(col);
            }
        }

        return gridCols;

    },
    createBkCounterGrid: function() {
        var me = this;

        me.compRef.bkCounterGrid = Ext.create('Ext.grid.Panel', {
            store: {
                fields: ['bkCode', 'bkName',
                    {name: 'buyVal', sortType: 'asFloat'},
                    {name: 'sellVal', sortType: 'asFloat'},
                    {name: 'totalVal', sortType: 'asFloat'},
                    {name: 'netVal', sortType: 'asFloat'},
                    {name: 'noTran', sortType: 'asInt'},
                    {name: 'mktWeight', sortType: 'asFloat'},
                    {name: 'crossVal', sortType: 'asFloat'},
                    {name: 'blockVal', sortType: 'asFloat'},
                    // JK
                    {name: 'totalVol', sortType: 'asInt'},
                    {name: 'totalFreq', sortType: 'asInt'},
                    {name: 'buyFreq', sortType: 'asInt'},
                    {name: 'sellFreq', sortType: 'asInt'},
                    {name: 'netVal', sortType: 'asFloat'},
                    {name: 'netVol', sortType: 'asInt'},
                    {name: 'dBuyVol', sortType: 'asInt'},
                    {name: 'dBuyVal', sortType: 'asFloat'},
                    {name: 'dSellVol', sortType: 'asInt'},
                    {name: 'dSellVal', sortType: 'asFloat'},
                    {name: 'dTotalVol', sortType: 'asInt'},
                    {name: 'dTotalVal', sortType: 'asFloat'},
                    {name: 'dNetVol', sortType: 'asInt'},
                    {name: 'dNetVal', sortType: 'asFloat'},
                    {name: 'dBuyFreq', sortType: 'asInt'},
                    {name: 'dSellFreq', sortType: 'asInt'},
                    {name: 'fBuyVol', sortType: 'asInt'},
                    {name: 'fBuyVal', sortType: 'asFloat'},
                    {name: 'fSellVol', sortType: 'asInt'},
                    {name: 'fSellVal', sortType: 'asFloat'},
                    {name: 'fTotalVol', sortType: 'asInt'},
                    {name: 'fTotalVal', sortType: 'asFloat'},
                    {name: 'fNetVol', sortType: 'asInt'},
                    {name: 'fNetVal', sortType: 'asFloat'},
                    {name: 'fBuyFreq', sortType: 'asInt'},
                    {name: 'fSellFreq', sortType: 'asInt'}
                ]
            },
            columns: me.getBkCounterGridCols(),
            title: languageFormat.getLanguage(11063, 'Broker by Counter'),
            bkMode: 'bkCounter'
        });
    },
    getBkCounterGridCols: function() {
        var me = this;
        var gridCols = [];
        var colStr = me.exch === 'JK' ? me.bkCounterGridCol_JK : me.bkCounterGridCol;
        var colArr = colStr.split(',');

        for (var i = 0; i < colArr.length; i++) {
            var colId = colArr[i].trim();
            var col = null;

            switch (colId) {
                case 'bkCode':
                    col = {
                        text: languageFormat.getLanguage(11068, 'Broker'),
                        width: 60,
                        dataIndex: 'bkCode',
                        locked: true
                    };
                    break;
                case 'bkName':
                    col = {
                        text: languageFormat.getLanguage(11069, 'BrokerName'),
                        width: 335,
                        dataIndex: 'bkName',
                        renderer: function(val, meta, rec) {
                            if (val) {
                                return val;
                            } else {
                                return me.getBkName(rec.get('bkCode'));
                            }
                        }
                    };

                    break;
                case 'totalVal':
                    col = {
                        text: languageFormat.getLanguage(11070, 'TotalVal'),
                        width: 110,
                        dataIndex: 'totalVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'buyVal':
                    col = {
                        text: languageFormat.getLanguage(11071, 'BuyVal'),
                        width: 110,
                        dataIndex: 'buyVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'sellVal':
                    col = {
                        text: languageFormat.getLanguage(11072, 'SellVal'),
                        width: 110,
                        dataIndex: 'sellVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'netVal':
                    col = {
                        text: languageFormat.getLanguage(11073, 'NetVal'),
                        width: 110,
                        align: 'right',
                        dataIndex: 'netVal',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'crossVal':
                    col = {
                        text: languageFormat.getLanguage(11074, 'CrossVal'),
                        width: 110,
                        dataIndex: 'crossVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'blockVal':
                    col = {
                        text: languageFormat.getLanguage(11075, 'BlockVal'),
                        width: 110,
                        dataIndex: 'blockVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'mktWeight':
                    col = {
                        text: languageFormat.getLanguage(11076, 'Weight'),
                        width: 70,
                        dataIndex: 'mktWeight',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'noTran':
                    col = {
                        text: languageFormat.getLanguage(11077, 'Trade'),
                        width: 70,
                        dataIndex: 'noTran',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'totalVol':
                    col = {
                        text: languageFormat.getLanguage(11093, 'TotalVol'),
                        width: 100,
                        dataIndex: 'totalVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'buyVol':
                    col = {
                        text: languageFormat.getLanguage(11079, 'BuyVol'),
                        width: 100,
                        dataIndex: 'buyVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'sellVol':
                    col = {
                        text: languageFormat.getLanguage(11091, 'SellVol'),
                        width: 100,
                        dataIndex: 'sellVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'netVol':
                    col = {
                        text: languageFormat.getLanguage(11104, 'NetVol'),
                        width: 100,
                        dataIndex: 'netVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'totalFreq':
                    col = {
                        text: languageFormat.getLanguage(11103, 'TotalFreq'),
                        width: 60,
                        dataIndex: 'totalFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'buyFreq':
                    col = {
                        text: languageFormat.getLanguage(11101, 'BuyFreq'),
                        width: 60,
                        dataIndex: 'buyFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'sellFreq':
                    col = {
                        text: languageFormat.getLanguage(11102, 'SellFreq'),
                        width: 60,
                        dataIndex: 'sellFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dTotalVol':
                    col = {
                        text: languageFormat.getLanguage(11111, 'DTotalVol'),
                        width: 110,
                        dataIndex: 'dTotalVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dBuyVol':
                    col = {
                        text: languageFormat.getLanguage(11109, 'DBuyVol'),
                        width: 110,
                        dataIndex: 'dBuyVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dSellVol':
                    col = {
                        text: languageFormat.getLanguage(11110, 'DSellVol'),
                        width: 110,
                        dataIndex: 'dSellVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dTotalVal':
                    col = {
                        text: languageFormat.getLanguage(11105, 'DTotalVal'),
                        width: 110,
                        dataIndex: 'fTotalVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dBuyVal':
                    col = {
                        text: languageFormat.getLanguage(11106, 'DBuyVal'),
                        width: 110,
                        dataIndex: 'dBuyVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dSellVal':
                    col = {
                        text: languageFormat.getLanguage(11107, 'DSellVal'),
                        width: 110,
                        dataIndex: 'dSellVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dNetVol':
                    col = {
                        text: languageFormat.getLanguage(11115, 'DNetVol'),
                        width: 110,
                        align: 'right',
                        dataIndex: 'dNetVol',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'dNetVal':
                    col = {
                        text: languageFormat.getLanguage(11108, 'DNetVal'),
                        width: 110,
                        align: 'right',
                        dataIndex: 'dNetVal',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'dTotalFreq':
                    col = {
                        text: languageFormat.getLanguage(11114, 'DTotalFreq'),
                        width: 70,
                        dataIndex: 'dTotalFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dBuyFreq':
                    col = {
                        text: languageFormat.getLanguage(11112, 'DBuyFreq'),
                        width: 70,
                        dataIndex: 'dBuyFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'dSellFreq':
                    col = {
                        text: languageFormat.getLanguage(11113, 'DSellFreq'),
                        width: 70,
                        dataIndex: 'dSellFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;

                case 'fTotalVol':
                    col = {
                        text: languageFormat.getLanguage(11122, 'FTotalVol'),
                        width: 110,
                        dataIndex: 'fTotalVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fBuyVol':
                    col = {
                        text: languageFormat.getLanguage(11120, 'FBuyVol'),
                        width: 110,
                        dataIndex: 'fBuyVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fSellVol':
                    col = {
                        text: languageFormat.getLanguage(11121, 'FSellVol'),
                        width: 110,
                        dataIndex: 'fSellVol',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fTotalVal':
                    col = {
                        text: languageFormat.getLanguage(11116, 'FTotalVal'),
                        width: 110,
                        dataIndex: 'fTotalVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fBuyVal':
                    col = {
                        text: languageFormat.getLanguage(11117, 'FBuyVal'),
                        width: 110,
                        dataIndex: 'fBuyVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fSellVal':
                    col = {
                        text: languageFormat.getLanguage(11118, 'FSellVal'),
                        width: 110,
                        dataIndex: 'fSellVal',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fNetVol':
                    col = {
                        text: languageFormat.getLanguage(11126, 'FNetVol'),
                        width: 110,
                        align: 'right',
                        dataIndex: 'fNetVol',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'fNetVal':
                    col = {
                        text: languageFormat.getLanguage(11119, 'FNetVal'),
                        width: 110,
                        align: 'right',
                        dataIndex: 'fNetVal',
                        renderer: function(val) {
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'fTotalFreq':
                    col = {
                        text: languageFormat.getLanguage(11125, 'FTotalFreq'),
                        width: 70,
                        dataIndex: 'fTotalFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fBuyFreq':
                    col = {
                        text: languageFormat.getLanguage(11123, 'FBuyFreq'),
                        width: 70,
                        dataIndex: 'fBuyFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'fSellFreq':
                    col = {
                        text: languageFormat.getLanguage(11124, 'FSellFreq'),
                        width: 70,
                        dataIndex: 'fSellFreq',
                        align: 'right',
                        renderer: function(val) {
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
            }

            if (col) {
                gridCols.push(col);
            }
        }

        return gridCols;
    },
    activateTopItems: function(topId) {
        var me = this;
        me.bkMode = topId;

        if (topId === 'bkTran') {
            helper.show(me.compRef.bkFilter);
            helper.hide(me.compRef.stkCb);
        } else if (topId === 'bkCounter') {
            helper.hide(me.compRef.bkFilter);
            helper.show(me.compRef.stkCb);
        } else {
            helper.hide(me.compRef.bkFilter);
            helper.hide(me.compRef.stkCb);
        }

    },
    getBrokerList: function(callback) {
        var me = this;

        if (me.bkList) {
            if (typeof callback === 'function') {
                callback();
            }
        } else {
            conn.getBrokerList({
                ex: me.exch,
                success: function(data) {
                    if (data) {
                        me.bkList = data;
                        me.compRef.bkFilter.store.loadData(data);

                        if (typeof callback === 'function') {
                            callback();
                        }

                    }
                }
            });
        }
    },
    getBrokerInfo: function() {
        var me = this;

        me.getBrokerList(function() {
            if (me.bkMode === 'bkTran') {
                me.getBrokerTransaction();
            } else if (me.bkMode === 'bkCounter') {
                me.getBrokerByCounter();
            } else {
                me.getBrokerRanking();
            }
        });
    },
    getBrokerRanking: function() {
        var me = this;
        helper.setLoading(me.compRef.bkRankGrid, true);

        conn.getBrokerRanking({
            ex: me.exch,
            mode: me.compRef.tranFilter.getValue(),
            success: function(data) {
                if (data) {
                    me.compRef.bkRankGrid.store.loadData(data);
                    helper.setLoading(me.compRef.bkRankGrid, false);
                    me._setRefreshTask();
                }
            }
        });

    },
    getBrokerTransaction: function() {
        var me = this;
        var bk = me.compRef.bkFilter.getValue();

        if (bk) {
            helper.setLoading(me.compRef.bkTranGrid, true);

            conn.getBrokerTransaction({
                ex: me.exch,
                bk: bk,
                mode: me.compRef.tranFilter.getValue(),
                success: function(data) {
                    if (data) {
                        me.compRef.bkTranGrid.store.loadData(data);
                        helper.setLoading(me.compRef.bkTranGrid, false);
                        me._setRefreshTask();
                    }
                }
            });
        }
    },
    getBrokerByCounter: function() {
        var me = this;
        var stk = me.compRef.stkCb.getValue();

        if (stk) {
            helper.setLoading(me.compRef.bkCounterGrid, true);

            conn.getBrokerByStock({
                ex: me.exch,
                stk: stk,
                mode: me.compRef.tranFilter.getValue(),
                success: function(data) {
                    if (data) {
                        me.compRef.bkCounterGrid.store.loadData(data);
                        helper.setLoading(me.compRef.bkCounterGrid, false);
                        me._setRefreshTask();
                    }
                }
            });
        }

    },
    _setRefreshTask: function() {
        var panel = this;

        // clears previous task if any
        panel._stopRefreshTask();
        panel.intervalTimeOut = setTimeout(function() {
            panel.getBrokerInfo();
        }, N2N_CONFIG.brokerInfoInterval);
    },
    _stopRefreshTask: function() {
        var panel = this;

        if (panel.intervalTimeOut) {
            clearTimeout(panel.intervalTimeOut);
            panel.intervalTimeOut = null;
        }
    },
    setExchange: function(exch) {
        var me = this;

        me.prevExch = me.exch;
        me.exch = exch;
        var compTitle = languageFormat.getLanguage(11060, 'Broker Info') + ' [' + me.exch + ']';
        n2nLayoutManager.updateTitle(me, compTitle);
        if (me.exch !== me.prevExch) {
            if (me.exch === 'JK') {
                helper.hide(me.compRef.tranFilter);
            } else {
                helper.show(me.compRef.tranFilter);
            }

            if (me.compRef.bkRankGrid.rendered) {
                me.compRef.bkRankGrid.store.removeAll();
                me.compRef.bkRankGrid.reconfigure(null, me.getBkRankGridCols());
            }
            if (me.compRef.bkTranGrid.rendered) {
                me.compRef.bkTranGrid.store.removeAll();
                me.compRef.bkTranGrid.reconfigure(null, me.getBkTranGridCols());
            }
            if (me.compRef.bkCounterGrid.rendered) {
                me.compRef.bkCounterGrid.store.removeAll();
                me.compRef.bkCounterGrid.reconfigure(null, me.getBkCounterGridCols());
            }

            me.compRef.bkFilter.store.removeAll();
            me.compRef.bkFilter.setValue(null);
            me.compRef.stkCb.setValue('');
            me.bkList = null;
            me.getBrokerList();

        }
    },
    getBkName: function(bkCode) {
        var me = this;

        for (var i in me.bkList) {
            var bk = me.bkList[i];
            if (bk.bkCode === bkCode) {
                return bk.bkName;
            }
        }
    }
});