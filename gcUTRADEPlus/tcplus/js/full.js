/* 
 * Additional scripts for full version
 */

/*
 * View: Historical Data
 */
Ext.define('TCPlus.view.quote.VHistoricalData', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.historicaldata',
    debug: false,
    header: false,
    compRef: {}, // component references
    _periodicity: 7,
    _load: 50,
    PERIOD_1MIN: 1,
    PERIOD_15MIN: 3,
    PERIOD_30MIN: 4,
    PERIOD_60MIN: 5,
    PERIOD_DAILY: 7,
    type: 'hd',
    slcomp: "hd",
    savingComp: true,
    ddComp: true,
    refreshScreen: true,
    winConfig: {
        width: 650,
        height: 400
    },
    mkDeptShowHideInfobar : false,
    initComponent: function() {
        var me = this;

        // Must call first //
        me._createItems();
        Ext.apply(me, {
            title: languageFormat.getLanguage(20060, 'Historical Data'),
            bufferedRenderer: N2N_CONFIG.gridBufferedRenderer,
            leadingBufferZone: N2N_CONFIG.gridLeadingBufferZone,
            trailingBufferZone: N2N_CONFIG.gridTrailingBufferZone,
            columns: {
                items: me.compRef.colItems,
                defaults: { // not work with locked grid

                }
            },
            selModel: {
                preventFocus: true
            },
            store: me.compRef.store,
            tbar: me.compRef.toolbar,
            listeners: {
                afterrender: function() {
                    me.loadMask = me.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
                },
                resize: bufferedResizeHandler        
                }
        });
        me.callParent();
    },
    /**
     * Custom template method: every component should have this method
     * to ease code management
     */
    refresh: function() {
        var me = this;
        if (me.debug) {
            console.log('VHistoricalData > load');
        }
        
        if (me.rendered) {
            me.loadHistoricalData();
        } else {
            setTimeout(function() {
                me.refresh();
            }, 0);
        }
        
    },
    switchRefresh: function() {
        var me = this;

        if (me._needReload) {
            me._needReload = false;
            me.refresh();
        } else {
            reactivateRow(this);
        }
    },
    loadHistoricalData: function() {
        var me = this;
        if (me.debug) {
            console.log('VHistoricalData > loadHistoricalData');
        }

        if (me._isEmptyStock()) {
            me.loadMask.hide();
            return;
        } else {
            me.loadMask.show();
        }
        
        me.firstLoad = false;
        me.updateTitle();
        n2nLayoutManager.updateKey(me);
        conn.getHistoricalData({
            rType: 'hd',
            key: me.key,
            count: me._load,
            period: me._periodicity,
            success: function(response) {
                if (me.debug) {
                    console.log('response -> ', response);
                }
                if (response.s) {
                    if (response.d.length > 0) {
                        resetGridScroll(me);
                        me.store.loadRawData(response);
                        activateRow(me);
                        patchFirstLoad(me);
                    } else {
                        me.store.removeAll();
                        me.setMsg(languageFormat.getLanguage(30013, 'No result found.'));
                    }
                }
                me.loadMask.hide();
            }
        });
    },
    updateTitle: function() {
        var me = this;
        var compTitle = languageFormat.getLanguage(20060, 'Historical Data') + UI.titleSeparator + stockutil.getStockPart(this.stkname);
        n2nLayoutManager.updateTitle(me, compTitle);
        compAddRecent(me, me.key);
    },
    setMsg: function(msg) {
        helper.setGridEmptyText(this, msg);
    },
    _createItems: function() {
        var me = this;

        // grid columns
        me.compRef.colItems = [
            me._colObj({
                text: languageFormat.getLanguage(10927, 'Date'),
                dataIndex: COL.DATE_TIME,
                width: 150,
                minWidth: 145,
                align: 'left',
                sortable: true,
                renderer: function(value) {
                    var dtStr = '';
                    if (me._periodicity == me.PERIOD_DAILY) {
                        var dtValue = Ext.Date.parse(value, "Ymd");
                        dtStr = Ext.util.Format.date(dtValue, N2N_CONFIG.dateFormat);
                    } else {
                        var dtValue = Ext.Date.parse(value, "YmdHis");
                        dtStr = Ext.util.Format.date(dtValue, N2N_CONFIG.dateFormat + ' ' + N2N_CONFIG.timeFormat2);
                    }

                    return dtStr;
                }
            }),
            me._colObj({
                text: languageFormat.getLanguage(10104, 'Open'),
                dataIndex: COL.OPEN
            }),
            me._colObj({
                text: languageFormat.getLanguage(10107, 'High'),
                dataIndex: COL.HIGH
            }),
            me._colObj({
                text: languageFormat.getLanguage(10108, 'Low'),
                dataIndex: COL.LOW
            }),
            me._colObj({
                text: languageFormat.getLanguage(10103, 'Close'),
                dataIndex: COL.CLOSE
            }),
            me._colObj({
                text: languageFormat.getLanguage(10118, 'Vol'),
                dataIndex: COL.VOLUME,
                width: 120,
                renderer: function(value) {
                    return Ext.util.Format.number(value, N2N_CONFIG.qtyFormat);
                }
            })
        ];

        // Store
        me.compRef.store = Ext.create('Ext.data.Store', {
            model: 'TCPlus.model.MHistoricalData',
            sorters: [
                {
                    property: COL.DATE_TIME,
                    direction: 'DESC'
                }
            ]
        });

        var toolbarItems = new Array();
        if (N2N_CONFIG.features_HistoricalData_Periodicity || N2N_CONFIG.features_HistoricalData_Load) {
            if (N2N_CONFIG.features_HistoricalData_Periodicity) {
                var periodicityStore = Ext.create('Ext.data.Store', {
                    fields: ['period', 'text'],
                    data: [
                        {period: me.PERIOD_1MIN, text: languageFormat.getLanguage(20094, '1Min', '1').toUpperCase()},
                        {period: me.PERIOD_15MIN, text: languageFormat.getLanguage(20094, '15Min', '15').toUpperCase()},
                        {period: me.PERIOD_30MIN, text: languageFormat.getLanguage(20094, '30Min', '30').toUpperCase()},
                        {period: me.PERIOD_60MIN, text: languageFormat.getLanguage(20094, '60Min', '60').toUpperCase()},
                        {period: me.PERIOD_DAILY, text: languageFormat.getLanguage(20093, 'Daily').toUpperCase()}
                    ]
                });
                me.compRef.periodicity = Ext.create('Ext.form.field.ComboBox', {
                    fieldLabel: languageFormat.getLanguage(20091, 'Periodicity'),
                    store: periodicityStore,
                    queryMode: 'local',
                    displayField: 'text',
                    valueField: 'period',
                    labelStyle: 'font-weight: bold',
                    style: 'margin-left: 5px',
                    editable: false,
                    labelWidth: 65,
                    width: 130,
                    value: me._periodicity,
                    listeners: {
                        change: function(thisComp, newValue, oldValue) {
                            if (me.debug) {
                                console.log('VHistoricalData > Periodicity:change ', oldValue, '->', newValue);
                            }
                            me._periodicity = newValue;
                            me.loadHistoricalData();
                        }
                    }
                });

                toolbarItems.push(me.compRef.periodicity);
            }

            if (N2N_CONFIG.features_HistoricalData_Load) {
                me.compRef.load = Ext.create('Ext.form.field.ComboBox', {
                    fieldLabel: languageFormat.getLanguage(20092, 'Load'),
                    store: [50, 100, 200, 300, 500],
                    queryMode: 'local',
                    labelStyle: 'font-weight: bold',
                    style: 'margin-left: 5px',
                    editable: false,
                    labelWidth: 35,
                    width: 90,
                    value: me._load,
                    listeners: {
                        change: function(thisComp, newValue, oldValue) {
                            if (me.debug) {
                                console.log('VHistoricalData > Load:change ', oldValue, '->', newValue);
                            }
                            me._load = newValue;
                            me.loadHistoricalData();
                        }
                    }
                });

                toolbarItems.push(me.compRef.load);
            }
        }

        me.compRef.refresh = Ext.create('Ext.button.Button', {
            text: languageFormat.getLanguage(10008, 'Refresh'),
            tooltip: languageFormat.getLanguage(10008, 'Refresh'),
            iconCls: 'icon-reset',
            handler: function() {
                if (me.debug) {
                    console.log('VHistoricalData > refresh');
                }

                me.refresh();
            }
        });

        toolbarItems.push('->', me.compRef.refresh);

        // Toolbar
        me.compRef.toolbar = Ext.create('Ext.toolbar.Toolbar', {
            items: toolbarItems
        });
    },
    _colObj: function(colObj) { // to add default column settings
        Ext.applyIf(colObj, {
            sortable: false,
            menuDisabled: true,
            width: 85,
            minWidth: 80,
            align: 'right'
        });

        return colObj;
    },
    _selectLast: function() {
        var me = this;

        var recCount = me.compRef.store.getCount();
        me.getSelectionModel().select(recCount - 1);
    },
    _isEmptyStock: function() {
        var me = this;

        return jsutil.isEmpty(me.key) || jsutil.isEmpty(me.stkname);
    },
    refreshEmpty: function() {
        var me = this;

        if (!me.key) {
            menuHandler.historicalData();
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
    _updateTitle: function() {
        var me = this;
        
        var compTitle = languageFormat.getLanguage(20060, 'Historical Data') + UI.titleSeparator + stockutil.getStockPart(this.stkname);
        n2nLayoutManager.updateTitle(me, compTitle);
        n2nLayoutManager.updateKey(me);
    },
    syncBuffer: function(stkcode, stkname) {
        var me = this;

        // update key and title
        me.setCode(stkcode, stkname);
        me._updateTitle();

        me._needReload = true;

    }
});

/**
 * Historical Data Model
 */
Ext.define('TCPlus.model.MHistoricalData', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: COL.DATE_TIME,
            mapping: 0
        },
        {
            name: COL.OPEN,
            mapping: 1
        },
        {
            name: COL.HIGH,
            mapping: 2
        },
        {
            name: COL.LOW,
            mapping: 3
        },
        {
            name: COL.CLOSE,
            mapping: 4
        },
        {
            name: COL.VOLUME,
            mapping: 5
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
});

/* View: Financial Calculator */
Ext.define('TCPlus.view.other.FinancialCalculator', {
    extend: 'Ext.container.Container',
    alias: 'widget.fcalculator',
    brokrRateWin: null,
    exCode: null,
    // vtypes
    qtyTest: /^[1-9]|^[1-9]+$[0-9]/,
    // buy price Regular Expressions
    // buyPrcTest:    /^-?\.$|^-?\.\d{1,}$|^-?\d{1,}\.\d{1,}$|^-?\d{1,}\.$|^-?[0-9]\d{1,}$|^-?[0-9]$/,
    buyPrcTest: /^\.$|^\.\d{1,}$|^\d{1,}\.\d{1,}$|^\d{1,}\.$|^[0-9]\d{1,}$|^[0-9]$/,
    // breakeven Regular Expressions
    // brkrgRateTest: /^-?\.$|^-?\.\d{1,}$|^-?\d{1,}\.\d{1,}$|^-?\d{1,}\.$|^-?[0-9]\d{1,}$|^-?[0-9]$/,
    brkrgRateTest: /^\.$|^\.\d{1,}$|^\d{1,}\.\d{1,}$|^\d{1,}\.$|^[0-9]\d{1,}$|^[0-9]$/,
    // sell price Regular Expressions
    // sellPrcTest: /^-?\.$|^-?\.\d{1,}$|^-?\d{1,}\.\d{1,}$|^-?\d{1,}\.$|^-?[0-9]\d{1,}$|^-?[0-9]$/,
    sellPrcTest: /^\.$|^-?\.\d{1,}$|^\d{1,}\.\d{1,}$|^\d{1,}\.$|^[0-9]\d{1,}$|^[0-9]$/,
    trgtP_LTest: /^-?\.$|^-?\.\d{1,}$|^-?\d{1,}\.\d{1,}$|^-?\d{1,}\.$|^-?[0-9]\d{1,}$|^-?[0-9]$/,
    winConfig: {
        width: 692,
        height: 295
    },
    type: 'bc',
    slcomp: 'bc',
    savingComp: true,
    compRef: {},
    initComponent: function() {
        var panel = this;

        panel.exCode = panel.exCode;
        var brokerRateLink = languageFormat.getLanguage(20627, 'Brokerage Rate(%)');
        if (panel.exCode == 'KL' || panel.exCode == 'MY') {
            brokerRateLink = '<a class="bratetext" href="#" onclick="n2ncomponents.openBrokerageFaq();">' + languageFormat.getLanguage(20627, 'Brokerage Rate(%)') + '</a>';
        }

        Ext.apply(Ext.form.field.VTypes, {
            qty: function(val, field) {
                return panel.qtyTest.test(val);
            },
            qtyText: languageFormat.getLanguage(33000, 'Please enter a valid quantity'),
            qtyMask: /[0-9\b]/i,
            buyPrc: function(val, field) {
                return panel.buyPrcTest.test(val);
            },
            buyPrcText: languageFormat.getLanguage(33002, 'Please enter a valid buy price'),
            buyPrcMask: /-?[0-9.\b]/i,
            brkrgRate: function(val, field) {
                return panel.brkrgRateTest.test(val);
            },
            brkrgRateText: languageFormat.getLanguage(33003, 'Please enter a valid brokerage rate'),
            brkrgRateMask: /-?[0-9.\b]/i,
            sellPrc: function(val, field) {
                return panel.sellPrcTest.test(val);
            },
            sellPrcText: languageFormat.getLanguage(33004, 'Please enter a valid sell price'),
            sellPrcMask: /-?[0-9.\b]/i,
            trgtpl: function(val, field) {
                return panel.trgtP_LTest.test(val);
            },
            trgtP_LText: languageFormat.getLanguage(33005, 'Please enter a valid targeted profit/loss'),
            trgtP_LMask: /-?[0-9.\b]/i
        });

        var itemWidth = 210;
        var labelWidth = 120;
        var ctMinWidth = 225;
        var ctHeight = 260;
        var fcLabelWidth = 73;

        if (isMobile) {
            itemWidth = 275;
            labelWidth = 135;
        }

        var be_formPanelItems = [
            {
                xtype: 'numericfield',
                name: 'buyprcbe',
                fieldLabel: languageFormat.getLanguage(20625, 'Buy Price'),
                invalidClass: 'calculator-invalid ', //in css
                allowBlank: true,
                enableKeyEvents: true,
                vtype: 'buyPrc',
                emptyText: languageFormat.getLanguage(30307, 'Enter a value'),
                fieldStyle: 'text-align:right;',
                decimalPrecision: 3,
                allowDecimals: true,
                alwaysDisplayDecimals: true,
                decimalSeparator: '.',
                useThousandSeparator: true,
                thousandSeparator: ',',
                hideTrigger: true,
                listeners: {
                    keyup: function() {
                        var val = this.getRawValue();
                        //check val is not null
                        if (val) {
                            if (!panel.buyPrcTest.test(val)) {
                                this.setValue('');
                                msgutil.alert(Ext.form.VTypes.buyPrcText);
                            }
                        }
                    }
                }
            }, {
                xtype: 'numericfield',
                vtype: 'qty',
                name: 'qtybe',
                fieldLabel: languageFormat.getLanguage(20626, 'Quantity'),
                allowBlank: true,
                emptyText: languageFormat.getLanguage(30307, 'Enter a value'),
                enableKeyEvents: true,
                allowDecimals: false,
                useThousandSeparator: true,
                thousandSeparator: ',',
                fieldStyle: 'text-align:right;',
                hideTrigger: true,
                listeners: {
                    keyup: function() {
                        var val = this.getRawValue();

                        //check val is not null
                        if (val) {
                            if (!panel.qtyTest.test(val)) {
                                this.setValue('');
                                msgutil.alert(Ext.form.VTypes.qtyText);
                            }
                        }
                    }
                }
            }, {
                xtype: 'numericfield',
                id: 'brokerageR',
                name: 'brokerageR',
                fieldLabel: brokerRateLink,
                vtype: 'brkrgRate',
                allowBlank: true,
                invalidClass: 'calculator-invalid ',
                enableKeyEvents: true,
                decimalPrecision: 3,
                allowDecimals: true,
                alwaysDisplayDecimals: true,
                decimalSeparator: '.',
                useThousandSeparator: true,
                thousandSeparator: ',',
                fieldStyle: 'text-align:right;',
                hideTrigger: true,
                listeners: {
                    afterrender: function(brate) {
                        this.setValue('0.70');
                    },
                    keyup: function() {
                        var val = this.getRawValue();
                        //check val is not null
                        if (val) {
                            if (!panel.brkrgRateTest.test(val)) {
                                this.setValue('');
                                msgutil.alert(Ext.form.VTypes.brkrgRateText);
                            }
                        }
                    }
                }

            }, {
                fieldLabel: languageFormat.getLanguage(20178, 'Order Source'),
                name: 'ord_source',
                allowBlank: true,
                id: 'ord_source',
                xtype: 'combobox',
                store: ['Internet', 'Phone'],
                hideTrigger: false,
                triggerAction: 'all',
                editable: false,
                listeners: {
                    afterrender: function(cb) {
                        cb.setValue(cb.getStore().getAt(0).get('field1'));
                    }
                }
            },
            {
                fieldLabel: languageFormat.getLanguage(20628, 'Type'),
                name: 'type',
                allowBlank: false,
                id: 'type',
                xtype: 'combobox',
                store: ['Ordinary', 'Loan'],
                hideTrigger: false,
                triggerAction: 'all',
                editable: false,
                listeners: {
                    afterrender: function(cb) {
                        cb.setValue(cb.getStore().getAt(0).get('field1'));
                    }
                }
            }, {
                xtype: 'numericfield',
                name: 'brkevenPricefield',
                fieldLabel: languageFormat.getLanguage(20629, 'Breakeven Price'),
                readOnly: true,
                useThousandSeparator: true,
                thousandSeparator: ',',
                allowBlank: true,
                decimalPrecision: 3,
                allowDecimals: true,
                alwaysDisplayDecimals: true,
                decimalSeparator: '.',
                fieldStyle: 'text-align:right;'
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: '',
                hideEmptyLabel: false,
                labelWidth: fcLabelWidth,
                padding: '10 0 0 0',
                items: [
                    {
                        xtype: 'button',
                        cls: 'fix_btn',
                        text: languageFormat.getLanguage(10003, 'Reset'),
                        handler: function() {
                            Ext.getCmp('formpanel1').getForm().reset();
                        }
                    }, {
                        xtype: 'button',
                        cls: 'fix_btn',
                        style: 'margin-left: 5px;text-align: right;',
                        text: languageFormat.getLanguage(21003, 'Compute'),
                        handler: function() {
                            Ext.getCmp('formpanel1').getForm().findField('brkevenPricefield').setValue(panel.formatCurrencyDecimal(panel.compute("BE"), 3));
                        }
                    }
                ]
            }

        ];

        panel.compRef.be_formPanel = new Ext.form.Panel({
            title: languageFormat.getLanguage(20624, 'Breakeven'),
            height: ctHeight,
            minWidth: ctMinWidth,
            style: 'margin: 5px; color: #000;',
            bodyStyle: {
                background: 'transparent'
            },
            id: 'formpanel1',
            frame: true,
            autoScroll: true,
            defaults: {
                width: itemWidth,
                labelWidth: labelWidth
            },
            items: be_formPanelItems
        });

        var pl_formPanelItems = [
            {
                xtype: 'numericfield',
                fieldLabel: languageFormat.getLanguage(20625, 'Buy Price'),
                name: 'buyprcpl',
                invalidClass: 'calculator-invalid ',
                allowBlank: true,
                useThousandSeparator: true,
                thousandSeparator: ',',
                emptyText: languageFormat.getLanguage(30307, 'Enter a value'),
                enableKeyEvents: true,
                decimalPrecision: 3,
                allowDecimals: true,
                alwaysDisplayDecimals: true,
                decimalSeparator: '.',
                vtype: 'buyPrc',
                fieldStyle: 'text-align:right;',
                hideTrigger: true,
                listeners: {
                    keyup: function() {
                        var val = this.getRawValue();
                        //check val is not null
                        if (val) {
                            if (!panel.buyPrcTest.test(val)) {
                                this.setValue('');
                                msgutil.alert(Ext.form.VTypes.buyPrcText);
                            }
                        }


                    }
                }
            }, {
                xtype: 'numericfield',
                fieldLabel: languageFormat.getLanguage(20626, 'Quantity'),
                invalidClass: 'calculator-invalid ',
                name: 'qtypl',
                enableKeyEvents: true,
                allowBlank: true,
                useThousandSeparator: true,
                thousandSeparator: ',',
                vtype: 'qty',
                emptyText: languageFormat.getLanguage(30307, 'Enter a value'),
                fieldStyle: 'text-align:right;',
                hideTrigger: true,
                listeners: {
                    keyup: function() {
                        var val = this.getRawValue();
                        //check val is not null
                        if (val) {
                            if (!panel.qtyTest.test(val)) {
                                this.setValue('');
                                msgutil.alert(Ext.form.VTypes.qtyText);
                            }
                        }


                    }
                }
            }, {
                xtype: 'numericfield',
                fieldLabel: languageFormat.getLanguage(20630, 'Sell Price'),
                invalidClass: 'calculator-invalid ',
                name: 'spprc',
                allowBlank: true,
                emptyText: 'Enter a value',
                vtype: 'sellPrc',
                decimalPrecision: 3,
                allowDecimals: true,
                alwaysDisplayDecimals: true,
                decimalSeparator: '.',
                useThousandSeparator: true,
                thousandSeparator: ',',
                enableKeyEvents: true,
                fieldStyle: 'text-align:right;',
                hideTrigger: true,
                listeners: {
                    keyup: function() {
                        var val = this.getRawValue();
                        //check val is not null
                        if (val) {
                            if (!panel.sellPrcTest.test(val)) {
                                this.setValue('');
                                msgutil.alert(Ext.form.VTypes.sellPrcText);
                            }
                        }
                    }
                }
            }, {
                xtype: 'numericfield',
                name: 'brokerageRPL',
                invalidClass: 'calculator-invalid ',
                fieldStyle: 'text-align: right;',
                vtype: 'brkrgRate',
                decimalPrecision: 3,
                allowDecimals: true,
                alwaysDisplayDecimals: true,
                decimalSeparator: '.',
                useThousandSeparator: true,
                allowBlank: true,
                thousandSeparator: ',',
                fieldLabel: brokerRateLink,
                enableKeyEvents: true,
                hideTrigger: true,
                listeners: {
                    afterrender: function(brate) {
                        this.setValue('0.70');
                    },
                    keyup: function() {
                        var val = this.getRawValue();
                        //check val is not null
                        if (val) {
                            if (!panel.brkrgRateTest.test(val)) {
                                this.setValue('');
                                msgutil.alert(Ext.form.VTypes.brkrgRateText);
                            }
                        }
                    }
                }
            },
            {
                fieldLabel: languageFormat.getLanguage(20178, 'Order Source'),
                name: 'ord_source1',
                allowBlank: false,
                id: 'ord_source1',
                xtype: 'combobox',
                store: ['Internet', 'Phone'],
                hideTrigger: false,
                triggerAction: 'all',
                editable: false,
                listeners: {
                    afterrender: function(cb) {
                        cb.setValue(cb.getStore().getAt(0).get('field1'));
                    }
                }

            },
            {
                fieldLabel: languageFormat.getLanguage(20628, 'Type'),
                name: 'type1',
                allowBlank: false,
                id: 'type1',
                xtype: 'combobox',
                store: ['Ordinary', 'Loan'],
                hideTrigger: false,
                triggerAction: 'all',
                editable: false,
                listeners: {
                    afterrender: function(cb) {
                        cb.setValue(cb.getStore().getAt(0).get('field1'));
                    }
                }

            }, {
                xtype: 'numericfield',
                name: 'proftLossfield',
                fieldLabel: languageFormat.getLanguage(21001, 'Profit/Loss'),
                readOnly: true,
                allowBlank: true,
                useThousandSeparator: true,
                thousandSeparator: ',',
                decimalPrecision: 3,
                allowDecimals: true,
                alwaysDisplayDecimals: true,
                decimalSeparator: '.',
                fieldStyle: 'text-align:right;'
            }
            , {
                xtype: 'fieldcontainer',
                fieldLabel: '',
                hideEmptyLabel: false,
                labelWidth: fcLabelWidth,
                padding: '10 0 0 0',
                items: [
                    {
                        xtype: 'button',
                        cls: 'fix_btn',
                        text: languageFormat.getLanguage(10003, 'Reset'),
                        handler: function() {
                            Ext.getCmp('formpanel2').getForm().reset();
                        }
                    }, {
                        xtype: 'button',
                        cls: 'fix_btn',
                        style: 'margin-left: 5px;text-align: right;',
                        text: languageFormat.getLanguage(21003, 'Compute'),
                        handler: function() {
                            Ext.getCmp('formpanel2').getForm().findField('proftLossfield').setValue(panel.formatCurrencyDecimal(panel.compute("PL"), 3));
                        }
                    }
                ]
            }
        ];

        panel.compRef.pl_formPanel = new Ext.form.Panel({
            title: languageFormat.getLanguage(21001, 'Profit/Loss'),
            height: ctHeight,
            minWidth: ctMinWidth,
            style: 'margin: 5px; color: #000;',
            bodyStyle: {
                background: 'transparent'
            },
            id: 'formpanel2',
            frame: true,
            autoScroll: true,
            defaults: {
                width: itemWidth,
                labelWidth: labelWidth
            },
            items: pl_formPanelItems
        });

        var sp_formPanelItems = [
            {
                xtype: 'numericfield',
                fieldLabel: languageFormat.getLanguage(20625, 'Buy Price'),
                name: 'buyprcsp',
                invalidClass: 'calculator-invalid ',
                useThousandSeparator: true,
                thousandSeparator: ',',
                decimalPrecision: 3,
                allowDecimals: true,
                alwaysDisplayDecimals: true,
                decimalSeparator: '.',
                allowBlank: true,
                emptyText: languageFormat.getLanguage(30307, 'Enter a value'),
                enableKeyEvents: true,
                vtype: 'buyPrc',
                fieldStyle: 'text-align:right;',
                hideTrigger: true,
                listeners: {
                    keyup: function() {
                        var val = this.getRawValue();
                        //check val is not null
                        if (val) {
                            if (!panel.buyPrcTest.test(val)) {
                                this.setValue('');
                                msgutil.alert(Ext.form.VTypes.buyPrcText);
                            }
                        }
                    }
                }

            }, {
                xtype: 'numericfield',
                fieldLabel: languageFormat.getLanguage(20626, 'Quantity'),
                name: 'qtysp',
                vtype: 'qty',
                enableKeyEvents: true,
                allowBlank: true,
                useThousandSeparator: true,
                thousandSeparator: ',',
                emptyText: languageFormat.getLanguage(30307, 'Enter a value'),
                fieldStyle: 'text-align:right;',
                hideTrigger: true,
                listeners: {
                    keyup: function() {
                        var val = this.getRawValue();
                        //check val is not null
                        if (val) {
                            if (!panel.qtyTest.test(val)) {
                                this.setValue('');
                                msgutil.alert(Ext.form.VTypes.qtyText);
                            }
                        }
                    }
                }
            }, {
                xtype: 'numericfield',
                fieldLabel: languageFormat.getLanguage(21002, 'Targeted Profit/Loss'),
                name: 'target',
                invalidClass: 'calculator-invalid ',
                allowBlank: true,
                useThousandSeparator: true,
                thousandSeparator: ',',
                emptyText: languageFormat.getLanguage(30307, 'Enter a value'),
                decimalPrecision: 3,
                allowDecimals: true,
                alwaysDisplayDecimals: true,
                decimalSeparator: '.',
                enableKeyEvents: true,
                vtype: 'trgtpl',
                fieldStyle: 'text-align:right;',
                hideTrigger: true,
                listeners: {
                    keyup: function() {
                        var val = this.getRawValue();
                        //check val is not null
                        if (val) {
                            /*
                             * if user type in the '-' first character , it will avoid it
                             */
                            if (val.length == 1 && val == "-") {

                            } else {
                                if (!panel.trgtP_LTest.test(val)) {
                                    this.setValue('');
                                    msgutil.alert(Ext.form.VTypes.trgtP_LText);
                                }
                            }
                        }
                    }
                }

            },
            {
                xtype: 'numericfield',
                fieldLabel: brokerRateLink,
                name: 'brokerageRSP',
                invalidClass: 'calculator-invalid ',
                allowBlank: true,
                useThousandSeparator: true,
                decimalPrecision: 3,
                allowDecimals: true,
                alwaysDisplayDecimals: true,
                decimalSeparator: '.',
                thousandSeparator: ',',
                emptyText: languageFormat.getLanguage(30307, 'Enter a value'),
                enableKeyEvents: true,
                vtype: 'brkrgRate',
                fieldStyle: 'text-align:right;',
                hideTrigger: true,
                listeners: {
                    afterrender: function(brate) {
                        this.setValue('0.70');
                    },
                    keyup: function() {
                        var val = this.getRawValue();
                        //check val is not null
                        if (val) {
                            if (!panel.brkrgRateTest.test(val)) {
                                this.setValue('');
                                msgutil.alert(Ext.form.VTypes.brkrgRateText);
                            }
                        }
                    }
                }
            },
            {
                fieldLabel: languageFormat.getLanguage(20178, 'Order Source'),
                name: 'ord_source2',
                allowBlank: false,
                id: 'ord_source2',
                xtype: 'combobox',
                store: ['Internet', 'Phone'],
                hideTrigger: false,
                triggerAction: 'all',
                editable: false,
                listeners: {
                    afterrender: function(cb) {
                        cb.setValue(cb.getStore().getAt(0).get('field1'));
                    }
                }
            },
            {
                fieldLabel: languageFormat.getLanguage(20628, 'Type'),
                name: 'type2',
                allowBlank: false,
                id: 'type2',
                xtype: 'combobox',
                store: ['Ordinary', 'Loan'],
                hideTrigger: false,
                triggerAction: 'all',
                editable: false,
                listeners: {
                    afterrender: function(cb) {
                        cb.setValue(cb.getStore().getAt(0).get('field1'));
                    }
                }
            },
            {
                xtype: 'numericfield',
                name: 'sellPricefield',
                readOnly: true,
                fieldLabel: languageFormat.getLanguage(20630, 'Sell Price'),
                allowBlank: true,
                useThousandSeparator: true,
                thousandSeparator: ',',
                decimalPrecision: 3,
                allowDecimals: true,
                alwaysDisplayDecimals: true,
                decimalSeparator: '.',
                fieldStyle: 'text-align:right;'
            }, {
                xtype: 'fieldcontainer',
                fieldLabel: '',
                hideEmptyLabel: false,
                labelWidth: fcLabelWidth,
                padding: '10 0 0 0',
                items: [
                    {
                        xtype: 'button',
                        cls: 'fix_btn',
                        text: languageFormat.getLanguage(10003, 'Reset'),
                        handler: function() {
                            Ext.getCmp('formpanel3').getForm().reset();
                        }
                    }, {
                        xtype: 'button',
                        cls: 'fix_btn',
                        style: 'margin-left: 5px;text-align: right;',
                        text: languageFormat.getLanguage(21003, 'Compute'),
                        handler: function() {
                            Ext.getCmp('formpanel3').getForm().findField('sellPricefield').setValue(panel.formatCurrencyDecimal(panel.compute("SP"), 3));
                        }
                    }
                ]
            }

        ];

        panel.compRef.sp_formPanel = new Ext.form.Panel({
            title: languageFormat.getLanguage(20630, 'Sell Price'),
            height: ctHeight,
            minWidth: ctMinWidth,
            style: 'margin: 5px; color: #000;',
            bodyStyle: {
                background: 'transparent'
            },
            id: 'formpanel3',
            frame: true,
            autoScroll: true,
            defaults: {
                width: itemWidth,
                labelWidth: labelWidth
            },
            items: sp_formPanelItems
        });


        var newItemList = [
            panel.compRef.be_formPanel,
            panel.compRef.pl_formPanel,
            panel.compRef.sp_formPanel
        ];

        var ctLayout = 'column';
        var mainCt;
        if (isMobile) {
            ctLayout = 'fit';
            mainCt = Ext.create('Ext.tab.Panel', {
                items: newItemList
            });
        } else {
            mainCt = newItemList;
        }

        var defaultConfig = {
            layout: ctLayout,
            autoScroll: true,
            items: mainCt
        };

        Ext.apply(this, defaultConfig);
        this.callParent(arguments);
    },
    formatCurrencyDecimal: function(value, dec) {
        return parseFloat(value).toFixed(dec);
    },
    compute: function(type) {

        if (type == "BE") {
            var calc = new calculator();

            var buyprc = Ext.getCmp('formpanel1').getForm().findField('buyprcbe').getValue();
            var qty = Ext.getCmp('formpanel1').getForm().findField('qtybe').getValue();
            var brkrgR = Ext.getCmp('formpanel1').getForm().findField('brokerageR').getValue();
            var ordsrc = Ext.getCmp('formpanel1').getForm().findField('ord_source').getValue();
            var type = Ext.getCmp('formpanel1').getForm().findField('type').getValue();

            if (ordsrc == "Internet") {
                ordsrc = "I";
            }
            else {
                ordsrc = "P";
            }

            if (type == "Ordinary") {
                type = "O";
            }
            else {
                type = "L";
            }

            if (!Ext.getCmp('formpanel1').getForm().isValid()) {
                msgutil.alert(languageFormat.getLanguage(30301, 'Please check the fields in red border'));
                return;
            }

            if (buyprc == null || buyprc == "") {
                msgutil.alert(languageFormat.getLanguage(30302, 'Please enter buy price'));
                return;
            }
            if (qty == null || qty == "") {
                msgutil.alert(languageFormat.getLanguage(30303, 'Please enter quantity'));
                return;
            }

            if (brkrgR == null || brkrgR == "") {
                msgutil.alert(languageFormat.getLanguage(30304, 'Please enter brokerage rate'));
                return;
            }

            return calc.calculateBreakeven(buyprc, qty, brkrgR, ordsrc, type);
        } else if (type == "PL") {


            var calc = new calculator();

            var buyprc = Ext.getCmp('formpanel2').getForm().findField('buyprcpl').getValue();
            var qty = Ext.getCmp('formpanel2').getForm().findField('qtypl').getValue();
            var brkrgR = Ext.getCmp('formpanel2').getForm().findField('brokerageRPL').getValue();
            var ordsrc = Ext.getCmp('formpanel2').getForm().findField('ord_source1').getValue();
            var type = Ext.getCmp('formpanel2').getForm().findField('type1').getValue();
            var sprice = Ext.getCmp('formpanel2').getForm().findField('spprc').getValue();

            if (ordsrc == "Internet") {
                ordsrc = "I";
            }
            else {
                ordsrc = "P";
            }

            if (type == "Ordinary") {
                type = "O";
            }
            else {
                type = "L";
            }

            if (!Ext.getCmp('formpanel2').getForm().isValid()) {
                msgutil.alert(languageFormat.getLanguage(30301, 'Please check the fields in red border'));
                return;
            }

            if (buyprc == null || buyprc == "") {
                msgutil.alert(languageFormat.getLanguage(30302, 'Please enter buy price'));
                return;
            }
            if (qty == null || qty == "") {
                msgutil.alert(languageFormat.getLanguage(30303, 'Please enter quantity'));
                return;
            }
            if (sprice == null || sprice == "") {
                msgutil.alert(languageFormat.getLanguage(30305, 'Please enter sell price'));
                return;
            }
            if (brkrgR == null || brkrgR == "") {
                msgutil.alert(languageFormat.getLanguage(30304, 'Please enter brokerage rate'));
                return;
            }

            return calc.calculateProfitloss(buyprc, qty, sprice, brkrgR, ordsrc, type);

        }
        else if (type == "SP") {

            var calc = new calculator();

            var buyprc = Ext.getCmp('formpanel3').getForm().findField('buyprcsp').getValue();
            var qty = Ext.getCmp('formpanel3').getForm().findField('qtysp').getValue();
            var brkrgR = Ext.getCmp('formpanel3').getForm().findField('brokerageRSP').getValue();
            var ordsrc = Ext.getCmp('formpanel3').getForm().findField('ord_source2').getValue();
            var type = Ext.getCmp('formpanel3').getForm().findField('type2').getValue();
            var target = Ext.getCmp('formpanel3').getForm().findField('target').getValue();

            if (ordsrc == "Internet") {
                ordsrc = "I";
            }
            else {
                ordsrc = "P";
            }

            if (type == "Ordinary") {
                type = "O";
            }
            else {
                type = "L";
            }

            //check fields valid or not
            if (!Ext.getCmp('formpanel3').getForm().isValid()) {
                msgutil.alert(languageFormat.getLanguage(30301, 'Please check the fields in red border'));
                return;
            }

            if (buyprc == null || buyprc == "") {
                msgutil.alert(languageFormat.getLanguage(30302, 'Please enter buy price'));
                return;
            }
            if (qty == null || qty == "") {
                msgutil.alert(languageFormat.getLanguage(30303, 'Please enter quantity'));
                return;
            }
            if (target == null || target == "") {
                msgutil.alert(languageFormat.getLanguage(30306, 'Please enter targeted profit/loss'));
                return;
            }
            if (brkrgR == null || brkrgR == "") {
                msgutil.alert(languageFormat.getLanguage(30304, 'Please enter brokerage rate'));
                return;
            }

            return calc.calculateSellPrice(buyprc, qty, target, brkrgR, ordsrc, type);
             }
    }
});

/*
 * View: Depth matrix
 */
Ext.define('TCPlus.view.quote.DepthMatrix', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.marketdepthmatrix',
    defaultMarketDepthWidth: 435,
    marketDepthHeight: 148,
    storeMatrix: null,
    matrixWidth: 800,
    marketDepthCols: 4,
    marketDepthRows: 2,
    itemsMarketDepth: [],
    cols: "01~04~05~06~07",
    settingRowColumn: null,
    slcomp: "dm",
    savingComp: true,
    type: "dm",
    feedScreen: true,
    initComponent: function() {
        var panel = this;

        panel.maxCol = N2N_CONFIG.features_DepthMatrix_MaxCol;
        panel.maxRow = N2N_CONFIG.features_DepthMatrix_MaxRow;
        panel.minCol = N2N_CONFIG.features_DepthMatrix_MinCol;
        panel.minRow = N2N_CONFIG.features_DepthMatrix_MinRow;

        var defaultConfig = {
            title: languageFormat.getLanguage(20023, 'Depth Matrix'),
            header: false,
            autoScroll: true,
            border: false,
            layout: 'vbox',
            tbar: {
                xtype: 'toolbar',
                hidden: false,
                items: [
                    '->',
                    new Ext.Button({
                        text: languageFormat.getLanguage(20601, 'Settings'),
                        tooltip: languageFormat.getLanguage(20601, 'Settings'),
                        iconCls: 'icon-columnsetting',
                        handler: function() {
                            panel.setting();
                        }
                    }),
                    new Ext.Button({
                        text: languageFormat.getLanguage(10008, 'Refresh'),
                        tooltip: languageFormat.getLanguage(10008, 'Refresh'),
                        iconCls: 'icon-reset',
                        handler: function() {
                            panel._refresh();
                        }
                    })
                ]
            },
            listeners: {
                resize: function(thisComp, width, height, oldWidth, oldHeight) {
                    if (oldWidth) {
                        var comp = thisComp.up();
                        if (comp) {
                            // update matrix size
                            panel._setMatrixSize(comp);
                        }
                        if(thisComp.switched){
                            thisComp.switched = false;
                            panel._updateWinSize();
                        }
                    }
                },
                afterrender: function(thisComp) {
                    // get panel size
                    var comp = thisComp.up();
                    if (comp) {
                        panel._setMatrixSize(comp);
                        
                        panel._returnNumberMarketDepth(panel.matrixWidth, panel.matrixHeight);
                        panel.marketDepthTotal = panel.marketDepthCols * panel.marketDepthRows;
                    }
                },
                beforedestroy: function(thisComp) {
                    panel._unscriptAllMarket();
                    if (panel.settingRowColumn) {
                        panel.settingRowColumn.close();
                    }
                }
            }
        };


        Ext.apply(this, defaultConfig);
        this.callParent(arguments);
    },
    start: function() {
        var panel = this;
        
        if (panel.rendered) {
            panel.suspendLayouts();
            panel._createMatrixCt();
            panel.resumeLayouts(true);
            panel._refresh();
        } else {
            // wait until UI rendered
            setTimeout(function() {
                panel.start();
            }, 0);
        }
    },
    _createMatrixCt: function() {
        var me = this;

        me.removeAll();

        me.itemsMarketDepth = [];
        var matrixItems = [];
        var cellIdx = 0;

        for (var i = 0; i < me.marketDepthRows; i++) {
            var ctItems = [];
            for (var j = 0; j < me.marketDepthCols; j++) {
                var depthItem = me._createMarketDepth('marketDepth_' + cellIdx);

                me.itemsMarketDepth.push(depthItem);
                ctItems.push(depthItem);
                cellIdx++;
            }

            // create row ct
            matrixItems.push(Ext.widget('container', {
                layout: 'hbox',
                items: ctItems,
                width: '100%',
                flex: 1
            }));
        }

        me.add(matrixItems);

    },
    _setMatrixSize: function(comp) {
        var panel = this;

        var size = comp.getSize();
        var toolHg = 30; // toolbar height
        // leave some space for scrollbar
        var mxWidthPadding = 22;
        if (isTablet) {
            if (n2nLayoutManager.isWindowLayout()) {
                mxWidthPadding = 13;
            } else {
                mxWidthPadding = 0;
            }
        }
        var ctWidth = size.width;
        var ctHeight = size.height;
        if (ctWidth > mxWidthPadding) {
            ctWidth -= mxWidthPadding;
        }
        if (ctHeight > toolHg) {
            ctHeight -= toolHg;
        }

        panel.matrixWidth = ctWidth;
        panel.matrixHeight = ctHeight;
    },
    switchRefresh: function() {
        var panel = this;

        for (var i = 0; i < panel.itemsMarketDepth.length; i++) {
            var md = panel.itemsMarketDepth[i];
            md.switchRefresh();
            Storage.generateUnsubscriptionByExtComp(md);
        }
    },
    /**
     * Description <br/>
     * 
     * 		generate new market depth 
     * 
     * @param {string} title
     * 
     * @return {Market Depth Panel}
     */
    _createMarketDepth: function(title) {
        var panel = this;

        if (panel.storeMatrix == null) {
            panel.storeMatrix = {};
        }
        
        var marketDepth = Ext.widget('marketdepth', {
            title: title,
            itemId: title,
            stkcode: '',
            stkname: '',
            searchBoxWidth: 85,
            height: '100%',
            flex: 1,
            isMatrix: true,
            showTitle: false,
            showSearch: true,
            showTotalBidAsk: false,
            border: true,
            savingComp: false,
            viewConfig: {
                overflowX: 'hidden',
                maxHeight: 105
            },
            setVisibleColumn: function(id) {

                var hide = true;

                if (panel.cols == '') {

                    if (global_MDDefaultColumn.indexOf(id) !== -1) {
                        hide = false;
                    }
                } else {
                    if (panel.cols.indexOf(id) !== -1) {
                        hide = false;
                    }
                }
                if (cmap_mdNo == id) {
                    hide = true;
                }

                return hide;
            }
        });
        panel.storeMatrix[ title ] = {};
        panel.storeMatrix[ title ].comp = marketDepth;

        return marketDepth;
    },
    /**
     * Description <br/>
     * 
     * 		return how many market depth should display
     * 
     * @param {integer} width
     * @param {integer} height
     * 
     * @return {Object}
     */
    _returnNumberMarketDepth: function(mxWidth, mxHeight) {
        var panel = this;

        panel._marketDepthWidth();
        
        var mxCol = userPreference.get('mxcol');
        var mxRow = userPreference.get('mxrow');
        
        if (mxCol && mxRow) {
            panel.marketDepthCols = mxCol;
            panel.marketDepthRows = mxRow;
        } else { // calculate according to the current size
            panel.marketDepthCols = Math.floor(mxWidth / panel.marketDepthWidth);
            panel.marketDepthRows = (mxHeight / panel.marketDepthHeight).toFixed();
        }
        
        if (panel.marketDepthCols > panel.maxCol) {
            panel.marketDepthCols = panel.maxCol;
        }
        if (panel.marketDepthRows > panel.maxRow) {
            panel.marketDepthRows = panel.maxRow;
        }

        if (panel.marketDepthCols >= panel.minCol) {
            panel.marketDepthWidth = mxWidth / panel.marketDepthCols;
        } else {
            panel.marketDepthCols = panel.minCol;
        }

        if (panel.marketDepthRows < panel.minRow) {
            panel.marketDepthRows = panel.minRow;
        }

    },
    _marketDepthWidth: function() {
        var panel = this;
        if (panel.cols == "01~02~04~05~06~07~09") {
            panel.marketDepthWidth = 385;
        } else if (panel.cols == "01~04~05~06~07") {
            panel.marketDepthWidth = 240;
        } else if (panel.cols == "01~03~04~05~06~07~08") {
            panel.marketDepthWidth = 395;
        } else {
            panel.marketDepthWidth = panel.defaultMarketDepthWidth;
        }
    },
    /**
     * Description <br/>
     * 
     * 		refresh all market depth record 
     */
    _refresh: function() {
        var panel = this;

        panel._unscriptAllMarket();

        if (quoteScreen && quoteScreen.stkcodes.length > 0) {
            var tempList = quoteScreen.stkcodes; // fixed code list issue when record is empty in storage

            var stockCodeList = [];
            for (var ii = 0; ii < tempList.length; ii++) {
                stockCodeList.push(tempList[ ii ]);
            }
            panel._refreshDepthUI(stockCodeList);
        } else {
            var tempMarket = "10";
            var tempSector = null;
            if (exchangecode == "MY") {
                tempMarket = null;
                tempSector = "1000";
            }

            conn.getStockList({
                ex: exchangecode,
                sorters: [
                    {direction: 'DESC', property: fieldVol}
                ],
                mkt: tempMarket,
                sec: tempSector,
                f: [fieldStkCode, fieldStkName],
                p: 0,
                c: parseInt(panel.marketDepthTotal),
                success: function(obj) {
                    if (obj.s) {
                        var dt = obj.d;
                        var stockCodeList = [];
                        // keep mapped names
                        panel.mappedNames = dt;
                        for (var i in dt) {
                            stockCodeList.push(dt[i][fieldStkCode]);
                        }
                        panel._refreshDepthUI(stockCodeList);
                    }
                }
            });
        }

    },
    _getMappedName: function(code) {
        var panel = this;

        if (panel.mappedNames) {
            for (var i in panel.mappedNames) {
                if (panel.mappedNames[i][fieldStkCode] == code) {
                    return panel.mappedNames[i][fieldStkName];
                }
            }

            return '';
        } else if(panel._grid && panel._grid.alias[0] === 'widget.watchlist' ){
            return panel._grid.getMappedName(code);
        } else if (quoteScreen) {
            return quoteScreen.getMappedName(code);
        }
    },
    _refreshDepthUI: function(stockCodeList) {
        var panel = this;

        var i = 0;
        for (var key in panel.storeMatrix) {

            if (panel.storeMatrix.hasOwnProperty(key)) {
                var marketDepthComp = panel.storeMatrix[ key ].comp;

                if (i < stockCodeList.length) {

                    var recordObj = Storage.returnRecord(stockCodeList[ i ]);

                    if (i === panel.marketDepthTotal - 1) { // get the last item to set switch refresh ready
                        marketDepthComp.lastDepth = true;
                        marketDepthComp.dpComp = panel;
                    }
                    
                    if (!jsutil.isEmpty(recordObj)) {
                        marketDepthComp.createMarketDepth(recordObj['33'], recordObj['38']);
                    } else {
                        var stkName = panel._getMappedName(stockCodeList[i]);
                        if (stkName != '') {
                            marketDepthComp.createMarketDepth(stockCodeList[i], stkName);
                        }
                    }
                }

                i += 1;
            }

            panel.firstLoad = false;
        }

    },
    /**
     * Description <br/>
     * 
     * 		un-subscript all market depth in Storage
     * 
     */
    _unscriptAllMarket: function() {
        var panel = this;

        for (var key in panel.storeMatrix) {

            if (panel.storeMatrix.hasOwnProperty(key)) {
                var marketDepthComp = panel.storeMatrix[ key ].comp;
                Storage.generateUnsubscriptionByExtComp(marketDepthComp);
            }
        }
    },
    /**
     * Description <br/>
     * 
     * 		return all market depth panel
     * 
     * @return {array<Ext.Panel>}
     */
    returnAllMarketDepth: function() {
        var panel = this;
        var marketDepthList = [];

        for (var key in panel.storeMatrix) {

            if (panel.storeMatrix.hasOwnProperty(key)) {
                var marketDepthComp = panel.storeMatrix[ key ].comp;

                marketDepthList.push(marketDepthComp);
            }
        }

        return marketDepthList;
    },
    /**
     * Description <br/>
     * 
     * 		return market depth panel
     * 
     * @param {string} stockCode
     * 
     * @return {Ext.Panel}
     */
    returnMarketDepth: function(stockCode) {
        var panel = this;
        var returnComp = null;

        for (var key in panel.storeMatrix) {

            if (panel.storeMatrix.hasOwnProperty(key)) {
                var marketDepthComp = panel.storeMatrix[ key ].comp;

                if (marketDepthComp.stkcode == stockCode) {
                    returnComp = marketDepthComp;
                    break;
                }
            }
        }

        return returnComp;
    },
    /**
     * Description <br/>
     * 
     * 		 return market depth price list
     * 
     * @param {string} stockCode
     * 
     * @return {object}
     */
    returnBidAskPrice: function(stockCode) {
        var panel = this;

        var compMarketDepth = panel.returnMarketDepth(stockCode);
        if (compMarketDepth) {
        return compMarketDepth.returnBidAskPrice();
        }

        return null;
    },
    setting: function() {
        var panel = this;

        var checkValid = function() {
            if (txtCol.isValid() && txtRow.isValid()) {
                var newCol = txtCol.getValue();
                var newRow = txtRow.getValue();
                
                if (panel.marketDepthCols == newCol && panel.marketDepthRows == newRow) {
                    btnSave.disable();
                } else {
                    btnSave.enable();
                }
            } else {
                btnSave.disable();
            }
        };
        
        if (!panel.settingRowColumn) {
            var txtCol = Ext.create('Ext.form.field.Number', {
                xtype: 'numberfield',
                width: 100,
                labelWidth: 50,
                fieldLabel: languageFormat.getLanguage(10510, 'Columns'),
                itemId: 'dm_cols',
                minValue: panel.minCol,
                maxValue: panel.maxCol,
                allowBlank: false,
                allowDecimals: false,
                value: panel.marketDepthCols,
                listeners: {
                    change: function() {
                        checkValid();
                    }
                }
            });
            var txtRow = Ext.create('Ext.form.field.Number', {
                xtype: 'numberfield',
                width: 100,
                labelWidth: 50,
                fieldLabel: languageFormat.getLanguage(10511, 'Rows'),
                itemId: 'dm_rows',
                allowBlank: false,
                minValue: panel.minRow,
                maxValue: panel.maxRow,
                allowDecimals: false,
                value: panel.marketDepthRows,
                listeners: {
                    change: function() {
                        checkValid();
                    }
                }
            });
            var btnSave = Ext.create('Ext.button.Button', {
                text: languageFormat.getLanguage(20092, 'Load'),
                iconCls: 'icon-save',
                disabled: true,
                handler: function() {
                    panel.marketDepthCols = txtCol.getValue();
                    panel.marketDepthRows = txtRow.getValue();
                    
                    userPreference.set('mxcol', panel.marketDepthCols);
                    userPreference.set('mxrow', panel.marketDepthRows);
                    userPreference.save();

                    panel.suspendLayouts();
                    // recalculate width for tab layout to fit width
                    if (n2nLayoutManager.isMt(panel.mt)) {
                        panel.marketDepthWidth = (panel.matrixWidth / panel.marketDepthCols);
                    }else{
                        panel._marketDepthWidth();
                    }

                    panel.itemsMarketDepth = [];
                    panel.marketDepthTotal = panel.marketDepthCols * panel.marketDepthRows;
                    panel._unscriptAllMarket();
                    panel.storeMatrix = {};
                    panel._createMatrixCt();

                    panel.resumeLayouts(true);
                    panel._refresh();
                    panel.settingRowColumn.close();

                    // resizes window size
                    if (n2nLayoutManager.isP(panel.mt)) {
                        panel._updateWinSize();
                    }
                }
            });
            var headerBtn = [];
            var bbarBtn = [
                '->',
                btnSave,
                '-',
                {
                    xtype: 'button',
                    cls: 'fix_btn',
                    text: 'Cancel',
                    handler: function() {
                        panel.settingRowColumn.close();
                    }
                }
            ];
            headerBtn = [btnSave];
            bbarBtn = [];
            panel.settingRowColumn = Ext.create('Ext.window.Window', {
                title: languageFormat.getLanguage(10509, 'Matrix Settings'),
                width: 140,
                height: 130,
                autoShow: true,
                resizable: false,
                bodyStyle: 'padding:10px',
                items: [
                    txtCol,
                    txtRow
                ],
                constrainTo: panel.getEl(),
                constrain: true,
                header: {
                    items: headerBtn
                },
                bbar: {
                    items: bbarBtn
                },
                listeners: {
                    destroy: function() {
                        panel.settingRowColumn = null;
                    }}
            });
        } else {
            panel.settingRowColumn.toFront();
            panel.settingRowColumn.body.highlight();
        }
    },
    _updateWinSize: function() {
        var panel = this;

        var winWd = panel.marketDepthWidth * panel.marketDepthCols + 16;
        var winHt = panel.marketDepthHeight * panel.marketDepthRows + 65;
        var pwin = panel.up();
        if (pwin && pwin.isXType('window')) {
            pwin.setSize(winWd, winHt);
        }
    },
    refresh: function() {
        var panel = this;
//        var activeColumn = 0;
        // panel._marketDepthWidth();
//        for (var i = 0; i < panel.marketDepthTotal; i++) {
//            activeColumn = panel.down('#marketDepth_' + i).activeColumn;
//            if (activeColumn == 1) {
//                break;
//            }
//        }
        for (var i = 0; i < panel.itemsMarketDepth.length; i++) {
//            if (activeColumn != 0) {
//                panel.down('#marketDepth_' + i).width = panel.marketDepthWidth;
//            }
            var md = panel.itemsMarketDepth[i];
            md.isGradient = marketDepthGradient;
            //   md.showSplit = md.setVisibleColumn(cmap_mdBSplit) ? false : true;
            //   md.showBcum = md.setVisibleColumn(cmap_mdBSplit) ? false : true;
            md.refresh();
        }
        panel._refresh();
    },
    updateGradientStatus: function(isGradient) {
        var panel = this;

        for (var i = 0; i < panel.itemsMarketDepth.length; i++) {
            panel.itemsMarketDepth[i].isGradient = isGradient;
        }
    }

});

/*
 * Card quote
 */
Ext.define('TCPlus.view.quote.CardQuote', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cardquote',
    defaultMarketDepthWidth: 435,
    marketDepthHeight: 148,
    storeMatrix: null,
    matrixWidth: 800,
    marketDepthCols: 4,
    marketDepthRows: 2,
    itemsMarketDepth: [],
    cols: "01~04~05~06~07",
    settingRowColumn: null,
    slcomp: "cq",
    type: "cq",
    feedScreen: true,
    initComponent: function() {
        var panel = this;

        panel.maxCol = N2N_CONFIG.features_DepthMatrix_MaxCol;
        panel.maxRow = N2N_CONFIG.features_DepthMatrix_MaxRow;
        panel.minCol = N2N_CONFIG.features_DepthMatrix_MinCol;
        panel.minRow = N2N_CONFIG.features_DepthMatrix_MinRow;

        var defaultConfig = {
            title: languageFormat.getLanguage(20023, 'Depth Matrix'),
            header: false,
            autoScroll: true,
            border: false,
            layout: 'vbox',
            listeners: {
                afterrender: function(thisComp) {
                    // get panel size
                    var comp = thisComp.up() || thisComp;
                    
                    if (comp) {
                        panel._setMatrixSize(comp);
                        
                        panel._returnNumberMarketDepth(panel.matrixWidth, panel.matrixHeight);
                        panel.marketDepthTotal = panel.marketDepthCols * panel.marketDepthRows;
                    }
                },
                beforedestroy: function(thisComp) {
                    panel._unscriptAllMarket();
                    
                    panel.closeSettingWin();
                }
            }
        };


        Ext.apply(this, defaultConfig);
        this.callParent(arguments);
    },
    start: function() {
        var panel = this;
        
        if (panel.rendered) {
            panel._started = true;
            panel.suspendLayouts();
            panel._createMatrixCt();
            panel.resumeLayouts(true);
            panel._refresh();
        } else {
            // wait until UI rendered
            setTimeout(function() {
                panel.start();
            }, 0);
        }
    },
    _createMatrixCt: function() {
        var me = this;

        me.removeAll();

        me.itemsMarketDepth = [];
        var matrixItems = [];
        var cellIdx = 0;
        
        for (var i = 0; i < me.marketDepthRows; i++) {
            var ctItems = [];
            for (var j = 0; j < me.marketDepthCols; j++) {
                var depthItem = me._createMarketDepth('marketDepth_' + cellIdx);

                me.itemsMarketDepth.push(depthItem);
                ctItems.push(depthItem);
                cellIdx++;
            }

            // create row ct
            matrixItems.push(Ext.widget('container', {
                layout: 'hbox',
                items: ctItems,
                width: '100%',
                flex: 1
            }));
        }

        me.add(matrixItems);

    },
    _setMatrixSize: function(comp) {
        var panel = this;

        var size = comp.getSize();
        var toolHg = 30; // toolbar height
        // leave some space for scrollbar
        var mxWidthPadding = 22;
        if (isTablet) {
            if (n2nLayoutManager.isWindowLayout()) {
                mxWidthPadding = 13;
            } else {
                mxWidthPadding = 0;
            }
        }
        var ctWidth = size.width;
        var ctHeight = size.height;
        if (ctWidth > mxWidthPadding) {
            ctWidth -= mxWidthPadding;
        }
        if (ctHeight > toolHg) {
            ctHeight -= toolHg;
        }

        panel.matrixWidth = ctWidth;
        panel.matrixHeight = ctHeight;
    },
    switchRefresh: function() {
        var panel = this;
        
        for (var i = 0; i < panel.itemsMarketDepth.length; i++) {
            var md = panel.itemsMarketDepth[i];
            md.switchRefresh();
            Storage.generateUnsubscriptionByExtComp(md);
        }
    },
    /**
     * Description <br/>
     * 
     * 		generate new market depth 
     * 
     * @param {string} title
     * 
     * @return {Market Depth Panel}
     */
    _createMarketDepth: function(title) {
        var panel = this;

        if (panel.storeMatrix == null) {
            panel.storeMatrix = {};
        }
        
        var marketDepth = Ext.widget('marketdepth', {
            title: title,
            itemId: title,
            stkcode: '',
            stkname: '',
            searchBoxWidth: 85,
            height: '100%',
            flex: 1,
            isMatrix: true,
            showTitle: false,
            showSearch: true,
            showTotalBidAsk: false,
            border: true,
            savingComp: false,
            viewConfig: {
                overflowX: 'hidden',
                maxHeight: 105
            },
            selectionHandler: panel.selectionHandler,
            enableContextMenu: true,
            cardComp: panel,
            setVisibleColumn: function(id) {

                var hide = true;

                if (panel.cols == '') {

                    if (global_MDDefaultColumn.indexOf(id) !== -1) {
                        hide = false;
                    }
                } else {
                    if (panel.cols.indexOf(id) !== -1) {
                        hide = false;
                    }
                }
                if (cmap_mdNo == id) {
                    hide = true;
                }

                return hide;
            }
        });
        
        panel.storeMatrix[ title ] = {};
        panel.storeMatrix[ title ].comp = marketDepth;

        return marketDepth;
    },
    selectionHandler: function(comp) {
        // remove previous selections
        Ext.select('.card-selected').removeCls('card-selected');
        // add current selection
        comp.addCls('card-selected');

        comp.cardComp._selectedCard = comp;
        
        if (comp.cardComp._grid) {
            n2nLayoutManager.setActiveItem(comp.cardComp._grid.getId());
        }

    },
    selectCard: function(cardIndex) {
        var panel = this;
        var i = 0;

        for (var k in panel.storeMatrix) {
            var md = panel.storeMatrix[k];
            if (cardIndex === i) {
                if (md.comp) {
                    panel.selectionHandler(md.comp);
                } else {
                    return md.comp;
                }
            }

            i++;
        }

        return null;
    },
    getSelectedCard: function() {
        return this._selectedCard || null;
    },
    clearSelection: function() {
        var panel = this;

        // clear selection
        Ext.select('.card-selected').removeCls('card-selected');
        // clear card
        panel._selectedCard = null;

    },
    /**
     * Description <br/>
     * 
     * 		return how many market depth should display
     * 
     * @param {integer} width
     * @param {integer} height
     * 
     * @return {Object}
     */
    _returnNumberMarketDepth: function(mxWidth, mxHeight) {
        var panel = this;

        panel._marketDepthWidth();
         
        var cfgPrefer = panel.getUserPreferenceKey();
        var mxCol = userPreference.get(cfgPrefer.mxCol);
        var mxRow = userPreference.get(cfgPrefer.mxRow);
        
        if (mxCol && mxRow) {
            panel.marketDepthCols = mxCol;
            panel.marketDepthRows = mxRow;
        } else { // calculate according to the current size
            panel.marketDepthCols = Math.floor(mxWidth / panel.marketDepthWidth);
            panel.marketDepthRows = (mxHeight / panel.marketDepthHeight).toFixed();
        }
        
        if (panel.marketDepthCols > panel.maxCol) {
            panel.marketDepthCols = panel.maxCol;
        }
        if (panel.marketDepthRows > panel.maxRow) {
            panel.marketDepthRows = panel.maxRow;
        }

        if (panel.marketDepthCols >= panel.minCol) {
            panel.marketDepthWidth = mxWidth / panel.marketDepthCols;
        } else {
            panel.marketDepthCols = panel.minCol;
        }

        if (panel.marketDepthRows < panel.minRow) {
            panel.marketDepthRows = panel.minRow;
        }

    },
    _marketDepthWidth: function() {
        var panel = this;
        if (panel.cols == "01~02~04~05~06~07~09") {
            panel.marketDepthWidth = 385;
        } else if (panel.cols == "01~04~05~06~07") {
            panel.marketDepthWidth = 240;
        } else if (panel.cols == "01~03~04~05~06~07~08") {
            panel.marketDepthWidth = 395;
        } else {
            panel.marketDepthWidth = panel.defaultMarketDepthWidth;
        }
    },
    /**
     * Description <br/>
     * 
     * 		refresh all market depth record 
     */
    _refresh: function() {
        var panel = this;

        panel._unscriptAllMarket();
        
        if (panel.codeList) {
            panel._refreshDepthUI(panel.codeList);
        }

    },
    _getMappedName: function(code) {
        var panel = this;

        if (panel.mappedNames) {
            for (var i in panel.mappedNames) {
                if (panel.mappedNames[i][fieldStkCode] == code) {
                    return panel.mappedNames[i][fieldStkName];
                }
            }

            return '';
        } 
        else if( panel._grid && panel._grid.alias[0] === 'widget.watchlist' ){
            return panel._grid.getMappedName(code);
        } else if (quoteScreen) {
            return quoteScreen.getMappedName(code);
        }
    },
    _refreshDepthUI: function(stockCodeList) {
        var panel = this;

        var i = 0;
        for (var key in panel.storeMatrix) {

            if (panel.storeMatrix.hasOwnProperty(key)) {
                var marketDepthComp = panel.storeMatrix[ key ].comp;

                if (i < stockCodeList.length) {

                    var recordObj = Storage.returnRecord(stockCodeList[ i ]);

                    if (i === panel.marketDepthTotal - 1) { // get the last item to set switch refresh ready
                        marketDepthComp.lastDepth = true;
                        marketDepthComp.dpComp = panel;
                    }
                    
                    var stkName = '';
                    if (!jsutil.isEmpty(recordObj)) {
                        stkName = recordObj[fieldStkName];
                        if(!stkName)
                            stkName = panel._getMappedName(stockCodeList[i]);
                        tLog('create matrik : cod: ' + recordObj[fieldStkCode] + ' name :' + stkName );
                        marketDepthComp.createMarketDepth(recordObj[fieldStkCode], stkName, true);
                    } else {
                        stkName = panel._getMappedName(stockCodeList[i]);
                        tLog('create matrik 2: cod: ' + stockCodeList[i] + ' name :' +  stkName);
                        if (stkName != '') {
                            marketDepthComp.createMarketDepth(stockCodeList[i], stkName, true);
                        }
                    }
                } else { 
                    // reset other depths
                    marketDepthComp.createMarketDepth('', '');
                }

                i += 1;
            }

            // panel.firstLoad = false;
        }

    },
    /**
     * Description <br/>
     * 
     * 		un-subscript all market depth in Storage
     * 
     */
    _unscriptAllMarket: function() {
        var panel = this;

        for (var key in panel.storeMatrix) {

            if (panel.storeMatrix.hasOwnProperty(key)) {
                var marketDepthComp = panel.storeMatrix[ key ].comp;
                Storage.generateUnsubscriptionByExtComp(marketDepthComp);
            }
        }
    },
    /**
     * Description <br/>
     * 
     * 		return all market depth panel
     * 
     * @return {array<Ext.Panel>}
     */
    returnAllMarketDepth: function() {
        var panel = this;
        var marketDepthList = [];

        for (var key in panel.storeMatrix) {

            if (panel.storeMatrix.hasOwnProperty(key)) {
                var marketDepthComp = panel.storeMatrix[ key ].comp;

                marketDepthList.push(marketDepthComp);
            }
        }

        return marketDepthList;
    },
    /**
     * Description <br/>
     * 
     * 		return market depth panel
     * 
     * @param {string} stockCode
     * 
     * @return {Ext.Panel}
     */
    returnMarketDepth: function(stockCode) {
        var panel = this;
        var returnComp = null;

        for (var key in panel.storeMatrix) {

            if (panel.storeMatrix.hasOwnProperty(key)) {
                var marketDepthComp = panel.storeMatrix[ key ].comp;

                if (marketDepthComp.stkcode == stockCode) {
                    returnComp = marketDepthComp;
                    break;
                }
            }
        }

        return returnComp;
    },
    /**
     * Description <br/>
     * 
     * 		 return market depth price list
     * 
     * @param {string} stockCode
     * 
     * @return {object}
     */
    returnBidAskPrice: function(stockCode) {
        var panel = this;

        var compMarketDepth = panel.returnMarketDepth(stockCode);
        if (compMarketDepth) {
        return compMarketDepth.returnBidAskPrice();
        }

        return null;
    },
    setting: function() {
        var panel = this;

        var checkValid = function() {
            if (txtCol.isValid() && txtRow.isValid()) {
                var newCol = txtCol.getValue();
                var newRow = txtRow.getValue();
                
                if (panel.marketDepthCols == newCol && panel.marketDepthRows == newRow) {
                    btnSave.disable();
                } else {
                    btnSave.enable();
                }
            } else {
                btnSave.disable();
            }
        };
        
        if (!panel.settingRowColumn) {
            var txtCol = Ext.create('Ext.form.field.Number', {
                xtype: 'numberfield',
                width: 100,
                labelWidth: 50,
                fieldLabel: languageFormat.getLanguage(10510, 'Columns'),
                itemId: 'dm_cols',
                minValue: panel.minCol,
                maxValue: panel.maxCol,
                allowBlank: false,
                allowDecimals: false,
                value: panel.marketDepthCols,
                listeners: {
                    change: function() {
                        checkValid();
                    }
                }
            });
            var txtRow = Ext.create('Ext.form.field.Number', {
                xtype: 'numberfield',
                width: 100,
                labelWidth: 50,
                fieldLabel: languageFormat.getLanguage(10511, 'Rows'),
                itemId: 'dm_rows',
                allowBlank: false,
                minValue: panel.minRow,
                maxValue: panel.maxRow,
                allowDecimals: false,
                value: panel.marketDepthRows,
                listeners: {
                    change: function() {
                        checkValid();
                    }
                }
            });
            var btnSave = Ext.create('Ext.button.Button', {
                text: languageFormat.getLanguage(20092, 'Load'),
                iconCls: 'icon-save',
                disabled: true,
                handler: function() {
                    panel.marketDepthCols = txtCol.getValue();
                    panel.marketDepthRows = txtRow.getValue();
                    
                    var cfgPrefer = panel.getUserPreferenceKey();
                    userPreference.set(cfgPrefer.mxCol, panel.marketDepthCols);
                    userPreference.set(cfgPrefer.mxRow, panel.marketDepthRows);
                    
                    userPreference.save();

                    panel.suspendLayouts();
                    // recalculate width for tab layout to fit width
                    if (n2nLayoutManager.isMt(panel.mt)) {
                        panel.marketDepthWidth = (panel.matrixWidth / panel.marketDepthCols);
                    }else{
                        panel._marketDepthWidth();
                    }

                    panel.itemsMarketDepth = [];
                    panel.marketDepthTotal = panel.marketDepthCols * panel.marketDepthRows;
                    panel._unscriptAllMarket();
                    panel.storeMatrix = {};
                    panel._createMatrixCt();

                    panel.resumeLayouts(true);
                    
                    if (panel._grid) {
                        panel._grid.resetLoad();
                    } else {
                        panel._refresh();
                    }
                    
                    panel.settingRowColumn.close();

                    // resizes window size
                    if (n2nLayoutManager.isP(panel.mt)) {
                        panel._updateWinSize();
                    }
                }
            });
            var headerBtn = [];
            var bbarBtn = [
                '->',
                btnSave,
                '-',
                {
                    xtype: 'button',
                    cls: 'fix_btn',
                    text: 'Cancel',
                    handler: function() {
                        panel.settingRowColumn.close();
                    }
                }
            ];
            headerBtn = [btnSave];
            bbarBtn = [];
            panel.settingRowColumn = msgutil.popup({
                title: languageFormat.getLanguage(20678, 'Card settings'),
                width: 140,
                height: 130,
                autoShow: true,
                resizable: false,
                bodyStyle: 'padding:10px',
                modal: false,
                items: {
                    xtype: 'container',
                    items: [
                        txtCol,
                        txtRow
                    ]
                },
                constrainTo: panel.getEl(),
                constrain: true,
                header: {
                    items: headerBtn
                },
                bbar: {
                    items: bbarBtn
                },
                cls: 'cap-title',
                listeners: {
                    destroy: function() {
                        panel.settingRowColumn = null;
                    }}
            });
        } else {
            panel.settingRowColumn.toFront();
            panel.settingRowColumn.body.highlight();
        }
    },
    getUserPreferenceKey : function() {
        var panel = this, mxcol = 'qsc_mxcol', msrow = 'qsc_mxrow';
        
        if (panel._grid) {
            if (panel._grid.type == 'rq') {
                mxcol = 'rqc_mxcol';
                msrow = 'rqc_mxrow';
            } else {
                mxcol = 'wlc_mxcol';
                msrow = 'wlc_mxrow';
            }
        }
        
        return {
            mxCol : mxcol,
            mxRow : msrow
        };
    },
    closeSettingWin: function() {
        var panel = this;
        
        if (panel.settingRowColumn) {
            panel.settingRowColumn.close();
        }
    },
    _updateWinSize: function() {
        var panel = this;

        var winWd = panel.marketDepthWidth * panel.marketDepthCols + 16;
        var winHt = panel.marketDepthHeight * panel.marketDepthRows + 65;
        var pwin = panel.up();
        if (pwin && pwin.isXType('window')) {
            pwin.setSize(winWd, winHt);
        }
    },
    refresh: function() {
        var panel = this;
        for (var i = 0; i < panel.itemsMarketDepth.length; i++) {
            var md = panel.itemsMarketDepth[i];
            md.isGradient = marketDepthGradient;
            md.showHideInfobar = panel.mkDeptShowHideInfobar;
            md.refresh();
        }
    },
    setList: function(codeList, dataObj) {
        var panel = this;

        panel.codeList = codeList;
        if (!panel._started) {
            panel.start();
        } else {
            panel._refresh();
        }
    },
    updateGradientStatus: function(isGradient) {
        var panel = this;

        for (var i = 0; i < panel.itemsMarketDepth.length; i++) {
            panel.itemsMarketDepth[i].isGradient = isGradient;
        }
    },
    getFieldList: function() {
        var me = this;
        var fieldList = [];

        // first depth is enough
        if (me.itemsMarketDepth.length > 0) {
            fieldList = me.itemsMarketDepth[0].getFieldList();
        }

        return fieldList;
    }
});

/* View: market streamer */
Ext.define('TCPlus.view.quote.MarketStreamer', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.marketstreamer',
    compRef: {}, // component references
    idPrefix: 'mktstm_',
    autoRecordNum: 10,
    recordCursor: -1,
    _cursorCells: [],
    _appName: 'TCPlus',
    debug: false,
    slcomp: "ms",
    type: 'ms',
    savingComp: true,
    notMainSubscription: true,
    _maxRecord: 0,
    screenType: 'main',
    initComponent: function() {
        var me = this;
        me._gridWidth = N2N_CONFIG.streamerGridWidth;
        if (!me.winConfig) {
            var winSize = N2N_CONFIG.streamerWinConf.split(',');
            me.winConfig = {
                width: parseInt(winSize[0]) || 1110,
                height: parseInt(winSize[1]) || 273
            };
        }
        
        me._createUIItems();
        
        Ext.apply(me, {
            title: languageFormat.getLanguage(20157, 'Streamer'),
            header: false,
            scroll: false,
            border: false,
            tbar: me.compRef.topCt,
            layout: 'hbox',
            keyEnabled: N2N_CONFIG.keyEnabled,
            listeners: {
                resize: function(thisGrid, newWidth, newHeight, oldWidth, oldHeight) {
                    me._adjusting = true;
                    me._createSplitGrids(newWidth, newHeight, oldWidth);
                    me._adjusting = false;
                    
                    if (!oldWidth) {
                        me._firstSub = true;
                        me.subscribe();
                        me._firstSub = false;
                    }
                }
            }
        });
        
        me.callParent(arguments);
    },
    updateFeedRecord: function(feedObj) {
        var me = this;

        if (me._adjusting || me.paused || me.inactive) { // skip painting
            return;
        }

        var stkCode = feedObj[fieldStkCode];
        if (!me._reqObj || !stkCode) {
            return;
        }

        // check filter
        var exch = stockutil.getExchange(stkCode);

        // watchlist or exchange
        if (me._reqObj.list && me._reqObj.list.indexOf(stkCode) === -1) {
            return;
        } else if (me._reqObj.exch && me._reqObj.exch.indexOf(exch) === -1) {
            return;
        }

        // value
        if (me._reqObj.value && me._reqObj.valueSign && !compareValues(feedObj[fieldLValue], me._reqObj.value, me._reqObj.valueSign)) {
            return;
        }

        // vol
        if (me._reqObj.vol && me._reqObj.volSign && !compareValues(feedObj[fieldUnit], me._reqObj.vol, me._reqObj.volSign)) {
            return;
        }

        var stkData = stockutil.getStockDataFromList(feedObj[fieldStkCode], exch, me._streamWl);
        
        if (stkData) {
            feedObj[fieldStkName] = stkData[fieldStkName];
            var lotSize = parseInt(stkData[fieldLotSize]);
            if (lotSize > 0) {
                feedObj[fieldLotSize] = lotSize;
            }
        }

        if (!feedObj[fieldStkName]) { // use stock code if can't get stock name
            feedObj[fieldStkName] = feedObj[fieldStkCode];
        }

        var chg = formatutils.procChangeValue(feedObj);
        feedObj[fieldChange] = chg;
        var chgPer = formatutils.procChangePercValue(feedObj);
        feedObj[fieldChangePer] = chgPer;

        // buy/sell broker
        updateBrokerData(feedObj);

        if (!feedObj[fieldSbEx]) {
            feedObj[fieldSbEx] = exch;
        }

        // R/D
        feedObj['delayed'] = stockutil.isDelayStock(feedObj[fieldStkCode]);

        if (N2N_CONFIG.streamerMove === 'top') {

            // always add to top of first grid
            var fGrid = me.items.items[0];
            var popRec = null;

            if (fGrid) {
                // marked as top record
                feedObj._topRec = true;
                // insert to top
                fGrid.store.insert(0, feedObj);
                // reset top record status
                feedObj._topRec = false;

                // highlight first row
                me._highlightFirstRow();
                // remove the last one and cache to add to next grid
                popRec = fGrid.store.getAt(me._recordNum);
                fGrid.store.removeAt(me._recordNum);
            }

            // adjust for non-empty record
            if (popRec && popRec.get(fieldStkCode)) {
                for (var i = 1; i < me._gridCount; i++) {
                    // get grid
                    var iGrid = me.items.items[i];

                    if (iGrid) {
                        iGrid.store.insert(0, popRec);
                        popRec = iGrid.store.getAt(me._recordNum);
                        iGrid.store.removeAt(me._recordNum);
                    }
                }
            }

        } else {

            me._moveRecordCursor();
            var cursor = me.recordCursor;
            me._cursorExch = exch;
            me._cursorCells = new Array();

            // stock code
            var stkCodeCell = me._getCell(cursor, fieldStkCode);
            var stkCodeVal = stockutil.getStockPart(feedObj[fieldStkCode]);
            me._cursorCells.push({
                el: stkCodeCell,
                cls: ''
            });

            me._updateCell(stkCodeCell, stkCodeVal);

            // stock name
            var stkNameCell = me._getCell(cursor, fieldStkName);
            var stkNameVal = stockutil.getStockPart(feedObj[fieldStkName]);
            me._cursorCells.push({
                el: stkNameCell,
                cls: ''
            });

            me._updateCell(stkNameCell, stkNameVal);

            // Exchange
            if (feedObj[fieldSbEx] != null) {
                var exCell = me._getCell(cursor, fieldSbEx);
                me._cursorCells.push({
                    el: exCell,
                    cls: ''
                });

                me._updateCell(exCell, feedObj[fieldSbEx]);
            }

            // change
            var piCls = '';

            var chgCls = N2NCSS.BackUnChange;
            if (chg > 0) {
                chgCls = N2NCSS.BackUp;
            } else if (chg < 0) {
                chgCls = N2NCSS.BackDown;
            }

            // tranaction, PI
            if (feedObj[fieldTransAction] != null) {
                var piCell = me._getCell(cursor, fieldTransAction);
                var piVal = feedObj[fieldTransAction];

                if (piVal == 'b' || piVal == 'm') {
                    if (exch == 'PH') {
                        piCls = N2NCSS.BackUp;
                    } else {
                        piCls = N2NCSS.BackDown;
                    }
                }
                else if (piVal == 's' || piVal == 'n') {
                    if (exch == 'PH') {
                        piCls = N2NCSS.BackDown;
                    } else {
                        piCls = N2NCSS.BackUp;
                    }
                } else {
                    piCls = N2NCSS.BackUnChange;
                }

                if (N2N_CONFIG.streamerPIFull) {
                    piVal = me._getPIText(piVal.toLowerCase());
                }

                me._cursorCells.push({
                    el: piCell,
                    cls: piCls
                });

                me._updateCell(piCell, piVal);
            }

            // last done price
            if (feedObj[fieldLast] != null) {
                var priceCell = me._getCell(cursor, fieldLast);

                me._cursorCells.push({
                    el: priceCell,
                    cls: chgCls
                });

                me._updateCell(priceCell, me._formatNumber(feedObj[fieldLast]));
            }

            // LQtyU
            if (feedObj[fieldUnit] != null) {
                var qtyCell = me._getCell(cursor, fieldUnit);

                me._cursorCells.push({
                    el: qtyCell,
                    cls: piCls
                });

                me._updateCell(qtyCell, me._formatNumber(getLotValue(feedObj[fieldUnit], feedObj[fieldLotSize])));
            }

            // LValue
            if (feedObj[fieldLValue] != null) {
                var valCell = me._getCell(cursor, fieldLValue);

                me._cursorCells.push({
                    el: valCell,
                    cls: piCls
                });

                me._updateCell(valCell, me._formatNumber(jsutil.getFloat(feedObj[fieldLValue], 0, 3)));
            }

            // Time
            if (feedObj[fieldTime] != null) {
                var timeCell = me._getCell(cursor, fieldTime);
                var timeVal = formatutils.procDateValue(feedObj[fieldTime]);
                me._cursorCells.push({
                    el: timeCell,
                    cls: ''
                });

                me._updateCell(timeCell, timeVal);
            }

            // Change
            if (chg != null) {
                var chgCell = me._getCell(cursor, fieldChange);
                me._cursorCells.push({
                    el: chgCell,
                    cls: chgCls
                });

                me._updateCell(chgCell, me._formatNumber(chg));
            }

            // Change Percent
            if (chgPer != null) {
                if (chgPer != '-') {
                    chgPer = me._formatNumber(chgPer) + '%';
                }
                var chgPerCell = me._getCell(cursor, fieldChangePer);
                me._cursorCells.push({
                    el: chgPerCell,
                    cls: chgCls
                });

                me._updateCell(chgPerCell, chgPer);
            }

            if (showTrackerBrokerName == 'TRUE') {
                // BBH
                if (feedObj[fieldBuyBroker] != null) {
                    var bbhCell = me._getCell(cursor, fieldBuyBroker);
                    me._cursorCells.push({
                        el: bbhCell,
                        cls: ''
                    });

                    me._updateCell(bbhCell, feedObj[fieldBuyBroker]);
                }

                // SBH
                if (feedObj[fieldSellBroker] != null) {
                    var sshCell = me._getCell(cursor, fieldSellBroker);
                    me._cursorCells.push({
                        el: sshCell,
                        cls: ''
                    });

                    me._updateCell(sshCell, feedObj[fieldSellBroker]);
                }
            }

            // Exchange
            var delayedCell = me._getCell(cursor, 'delayed');
            var delayedVal = feedObj['delayed'] ? languageFormat.getLanguage(11161, 'D') : languageFormat.getLanguage(11160, 'R');

            me._cursorCells.push({
                el: delayedCell,
                cls: ''
            });

            me._updateCell(delayedCell, delayedVal);

            me._updateStore(cursor, feedObj);
            me._highlightCursor();
        }
    },
    _getLotValue: function(value, lotSize) {
        if (global_displayUnit.toLowerCase() == "lot" && lotSize > 0) {
            return value / lotSize;
        }

        return value;
    },
    refreshAllGrids: function() {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var grid = me.items.items[i];
            if (grid) {
                helper.refreshView(grid);
            }
        }
    },
    _updateStore: function(cursorIndex, data) {
        var me = this;
        var cursor = me._getCursorInfo(cursorIndex);
        
        if (cursor.grid) {
            var rec = cursor.grid.store.getAt(cursor.rowIndex);
            if (rec) {
                rec.data = data;
            }
        }
    },
    _createUIItems: function() {
        var me = this;

        me._createTopbar();
        // setting
        if (N2N_CONFIG.streamerPreference) {

            var streamOpt = streamerPreference.get('sr_filter_opt') || streamerPreference.get('sr_flex_opt');
            if (streamOpt) {
                if (streamerPreference.get('sr_exchg')) {
                    me.compRef.exCb.setValue(streamerPreference.get('sr_exchg'));
                    me.compRef.wlCb.setValue('');
                } else if (streamerPreference.get('sr_wl')) {
                    me.compRef.exCb.setValue('');
                    me.compRef.wlCb.setValue(streamerPreference.get('sr_wl'));
                }

                if (streamerPreference.get('sr_filter_opt') && me.compRef.filterCb) {

                    var valueSign = asciiToString(streamerPreference.get('sr_filter_valSign'));
                    var value = streamerPreference.get('sr_filter_val');
                    var volSign = asciiToString(streamerPreference.get('sr_filter_volSign'));
                    var vol = streamerPreference.get('sr_filter_vol');
                    //pass in undefined to compare combobox store value
                    me.compRef.filterCb.setCustomValue({
                        value: value == "" ? null : value,
                        valueSign: valueSign,
                        volSign: volSign,
                        vol: vol == "" ? null : vol
                    })
                } else if (streamerPreference.get('sr_flex_opt')) {
                    if (me.compRef.valueSignCb) {
                        var sign = asciiToString(streamerPreference.get('sr_flex_valSign'))
                        me.compRef.valueSignCb.setValue(sign);
                    }
                    if (me.compRef.valueTf) {
                        me.compRef.valueTf.setValue(streamerPreference.get('sr_flex_val'));
                    }
                    if (me.compRef.volSignCb) {
                        var sign = asciiToString(streamerPreference.get('sr_flex_volSign'));
                        me.compRef.volSignCb.setValue(sign);
                    }
                    if (me.compRef.volTf)
                        me.compRef.volTf.setValue(streamerPreference.get('sr_flex_vol'));
                }
            }
        }
        
        me.subscribe();
    },
    _createSplitGrids: function(width, height, oldWidth) {
        var me = this;

        // determine number of split grids
        var gridCount = Math.floor(width / me._gridWidth);
        if (gridCount < 1) {
            gridCount = 1;
        }

        var diffCount = gridCount - (me._gridCount || 0);
        me._gridCount = gridCount;

        var compItems = me.items.items;

        // create/adjust split grid
        if (diffCount > 0) {
            var gridItems = [];

            for (var i = 0; i < diffCount; i++) {

                var grid = Ext.create('Ext.grid.Panel', {
                    store: {
                        fields: [
                            fieldStkCode, fieldTime,
                            fieldTransAction, fieldLast, fieldUnit, fieldBuyBroker, fieldSellBroker
                        ]
                    },
                    columns: me._createGridColumns(),
                    enableColumnMove: false,
                    flex: 1,
                    height: '100%',
                    scroll: false,
                    style: 'border-left-width: 1px;border-left-style: solid;',
                    listeners: {
                        itemcontextmenu: function(gridView, record, item, idx, e) {
                            e.stopEvent();

                            var stkCode = record.get(fieldStkCode);
                            var stkName = record.get(fieldStkName);
                            tLog('streamer > itemcontextmenu', stkCode, stkName);
                            // keep active record
                            me._selectedRec = [record];
                            // set active item in layout
                            n2nLayoutManager.setActiveItem(me.getId());
                            me._resetSelection(gridView);

                            if (stkCode && stkName) {
                                // global_OrderSource = 'MS';
                                mainContextMenu.showAt(stkCode, stkName, e);
                            }

                        },
                        itemclick: function(gridView, record) {
                            var stkCode = record.get(fieldStkCode);
                            var stkName = record.get(fieldStkName);
                            // keep active record
                            me._selectedRec = [record];
                            // set active item in layout
                            n2nLayoutManager.setActiveItem(me.getId());
                            me._resetSelection(gridView);
                            
                            if (stkCode && stkName) {
                                syncGroupManager.syncAllComps(me, stkCode, stkName);
                                
                                me.activateOrder(record);
                            }
                            
                        },
                        itemdblclick: function(gridView, record) {
                            var stkCode = record.get(fieldStkCode);
                            var stkName = record.get(fieldStkName);
                            
                            if (stkCode && stkName) {
                                closedOrderPad = false;
                                me.activateOrder(record);
                            }
                            
                        },
                        resize: function(thisGrid, _newWidth, _newHeight, _oldWidth, _oldHeight) {
                            if (!_oldWidth) {
                                // determine number of records
                                var recNum = Math.floor(thisGrid.body.getHeight() / getGridRowHeight());
                                // create empty records
                                var rec = me._createEmptyRecords(recNum);
                                thisGrid.store.loadData(rec);
                                if (!oldWidth) {
                                    me._recordNum = recNum;
                                }
                            }
                        }
                    }
                });

                gridItems.push(grid);
            }

            me.add(gridItems);

        } else if (diffCount < 0) {
            var removeCount = Math.abs(diffCount);

            for (var i = compItems.length - 1; i > 0, removeCount > 0; i--) {
                me.remove(compItems[i]);
                removeCount--;
            }
        }

        // adjust number of record
        if (oldWidth) {
            var adjustCount = me.items.items.length;
            if (diffCount > 0) {
                adjustCount -= diffCount;
            }

            var newRecNum = null;
            for (var i = 0; i < adjustCount; i++) {
                var grid = me.items.items[i];
                // determine number of records
                var recNum = Math.floor(grid.body.getHeight() / getGridRowHeight());
                newRecNum = recNum;
                var recDiff = me._recordNum - recNum;

                if (recDiff > 0) {
                    grid.store.removeAt(grid.store.getCount() - recDiff, recDiff);
                } else if (recDiff < 0) {
                    var rec = me._createEmptyRecords(Math.abs(recDiff));
                    grid.store.add(rec);
                }
            }

            if (newRecNum != null) {
                me._recordNum = newRecNum;
            }

        }
        
        me._maxRecord = me._recordNum * me.items.items.length;
    },
    _resetSelection: function(skipGridView) {
        var me = this;

        for (var i = 0; i < me.items.items.length; i++) {
            var iGrid = me.items.items[i];

            if (iGrid.getView().getId() !== skipGridView.getId()) {
                iGrid.getSelectionModel().deselectAll(true);
            }
        }
    },
    getSelectedRec: function() {
        var me = this;
        
        return me._selectedRec;
    },
    _createTopbar: function() {
        var me = this;

        var exList = [
            ['', languageFormat.getLanguage(20342, 'Select Exchange')]
        ];
        for (var i = 0; i < global_ExchangeList.length; i++) {
            if (validateStreamerExch(global_ExchangeList[i].exchange)) {
                exList.push([global_ExchangeList[i].exchange, global_ExchangeList[i].exchangeName]);
            }
        }
        
        if (exList.length < 3) {
            exList.shift();
        }
        
        var elStyle = 'margin-left: 5px';

        me.compRef.exCb = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: languageFormat.getLanguage(11064, 'Filter by'),
            labelWidth: 50,
            width: 170,
            store: {
                fields: ['value', 'label'],
                data: exList
            },
            displayField: 'label',
            valueField: 'value',
            value: validateStreamerExch(exchangecode) ? exchangecode : exList[0],
            editable: false,
            queryMode: 'local',
            matchFieldWidth: false,
            style: 'margin-left: 3px',
            listeners: {
                beforeselect: function(thisCb, record) {
                    /*
                     if (me.compRef.wlCb) {
                     var wl = me.compRef.wlCb.getValue();
                     
                     if (!wl && !record.get('value')) {
                     msgutil.warn(languageFormat.getLanguage(11086, 'An exchange or a watchlist required.'));
                     return false;
                     }
                     }
                     */
                },
                select: function() {
                    // reset watchlist
                    me.compRef.wlCb.select('');
                }
            }
        });

        me.compRef.wlCb = Ext.create('Ext.form.field.ComboBox', {
            width: 115,
            store: {
                fields: ['value', 'label'],
                data: [['', languageFormat.getLanguage(11084, 'Select Watchlist')]]
            },
            style: elStyle,
            listConfig: {
                listeners: {
                    beforeshow: function() {
                        var wlList = [
                            ['', languageFormat.getLanguage(11084, 'Select Watchlist')]
                        ];
                        var lastSelected = me.compRef.wlCb.getSelection() || '';
                        for (var i = 0; i < watchListArr.length; i++) {
                            var wl = watchListArr[i];
                            wlList.push([wl, wl]);
                        }

                        me.compRef.wlCb.store.loadData(wlList);
                        me.compRef.wlCb.select(lastSelected);
                    }
                }
            },
            displayField: 'label',
            valueField: 'value',
            value: '',
            editable: false,
            queryMode: 'local',
            listeners: {
                beforeselect: function(thisCb, record) {
                    /*
                     if (me.compRef.exCb) {
                     var ex = me.compRef.exCb.getValue();
                     
                     if (!ex && !record.get('value')) {
                     msgutil.warn(languageFormat.getLanguage(11086, 'An exchange or a watchlist required.'));
                     return false;
                     }
                     }
                     */
                },
                select: function() {
                    // reset exchange
                    me.compRef.exCb.select('');
                }
            }
        });
        
        me.compRef.orLbl = Ext.widget('label', {
            text: languageFormat.getLanguage(11157, 'OR'),
            style: elStyle
        });
        me.compRef.andLbl = Ext.widget('label', {
            text: languageFormat.getLanguage(11158, 'AND'),
            style: elStyle
        });
        
        var filterItems = [me.compRef.exCb, me.compRef.orLbl, me.compRef.wlCb];
        
        if (N2N_CONFIG.streamerFlexibleFilter) {
            me.compRef.valueLb = Ext.widget('label', {
                text: languageFormat.getLanguage(10736, 'Trade value'),
                style: elStyle
            });
            me.compRef.valueSignCb = Ext.widget('combobox', {
                store: ['>', '<', '='],
                value: '>',
                width: 35,
                style: 'margin-left: 5px',
                listConfig: {
                    minWidth: 30
                },
                editable: false
            });
            me.compRef.valueTf = Ext.widget('numberfield', {
                hideTrigger: true,
                selectOnFocus: true,
                width: 75
            });

            me.compRef.volLb = Ext.widget('label', {
                text: languageFormat.getLanguage(11085, 'Trade volume'),
                style: elStyle
            });
            me.compRef.volSignCb = Ext.widget('combobox', {
                store: ['>', '<', '='],
                value: '>',
                width: 35,
                style: 'margin-left: 5px',
                editable: false,
                listConfig: {
                    minWidth: 30
                }
            });
            me.compRef.volTf = Ext.widget('numberfield', {
                hideTrigger: true,
                selectOnFocus: true,
                width: 75
            });

            filterItems.push(me.compRef.andLbl, me.compRef.volLb, me.compRef.volSignCb, me.compRef.volTf,
                    me.compRef.valueLb, me.compRef.valueSignCb, me.compRef.valueTf
                    );
        } else {
            var optRec = toStreamerOptionRec(N2N_CONFIG.streamerFilterOptions);
            if (optRec.length > 1) {
                me.compRef.filterCb = Ext.widget('combo', {
                    store: {
                        fields: ['text', 'value'],
                        data: optRec
                    },
                    displayField: 'text',
                    valueField: 'value',
                    editable: false,
                    value: 0,
                    matchFieldWidth: false,
                    width: 130,
                    style: elStyle,
                    listConfig: {
                        minWidth: 130
                    },
                    setCustomValue: function (value) {
                        for (var i = 0; i < optRec.length; i++) {
                            if (optRec[i].value.volSign == value.volSign
                                    && optRec[i].value.vol == value.vol
                                    && optRec[i].value.valueSign == value.valueSign
                                    && optRec[i].value.value == value.value) {
                                me.compRef.filterCb.setValue(optRec[i].value);
                                return;
                            }
                        }
                    }
                });

                filterItems.push(me.compRef.andLbl, me.compRef.filterCb);
            }

        }

        me.compRef.applyBt = Ext.widget('button', {
            text: languageFormat.getLanguage(20618, 'Apply'),
            tooltip: languageFormat.getLanguage(11087, 'Apply filter'),
            iconCls: '',
            cls: 'flatbtn',
            style: elStyle,
            handler: function() {
                me.clearAll();
                me.paused = false; // resume streaming
                me.subscribe();
                if (N2N_CONFIG.streamerPreference) {
                    me.saveSettingPreference();
                }
            }
        });

        filterItems.push(me.compRef.applyBt, '->');

        me.compRef.playBt = Ext.widget('button', {
            text: languageFormat.getLanguage(20505, 'Pause'),
            iconCls: 'icon-pause',
            _paused: false,
            disabled: true,
            tooltip: languageFormat.getLanguage(11153, 'Stream/Pause'),
            hidden: true,
            handler: function(thisBtn) {
                thisBtn._paused = !thisBtn._paused;
                me.paused = thisBtn._paused;
                if (me.paused) {
                    thisBtn.setIconCls('icon-play');
                    thisBtn.setText(languageFormat.getLanguage(20506, 'Stream'));
                    thisBtn.setTooltip(languageFormat.getLanguage(20506, 'Stream'));
                    me.unsubscribe();
                } else {
                    thisBtn.setIconCls('icon-pause');
                    thisBtn.setText(languageFormat.getLanguage(20505, 'Pause'));
                    thisBtn.setTooltip(languageFormat.getLanguage(20505, 'Pause'));
                    me._skipApplyMsg = true;
                    me.subscribe();
                }
            }
        });

        me.compRef.clearBt = Ext.widget('button', {
            text: languageFormat.getLanguage(20007, 'Clear'),
            tooltip: languageFormat.getLanguage(20007, 'Clear'),
            iconCls: 'icon-clear',
            handler: function() {
                me.clearAll();
            }
        });

        filterItems.push(me.compRef.playBt, me.compRef.clearBt);

        if (N2N_CONFIG.streamerGuide) {
            var smHelp = jsutil.toBoolean(userPreference.get('sm_help', true));

            me.compRef.helpBtn = Ext.widget('button', {
                text: '?',
                iconCls: 'icon-info',
                tooltip: languageFormat.getLanguage(11156, 'Show/Hide help text'),
                enableToggle: true,
                pressed: smHelp,
                toggleHandler: function(thisBtn, pressed) {
                    if (pressed) {
                        me.compRef.helpCt1.show();
                        me.compRef.helpCt2.show();
                    } else {
                        me.compRef.helpCt1.hide();
                        me.compRef.helpCt2.hide();
                    }

                    var mSize = me.getSize();
                    me._adjusting = true;
                    me._createSplitGrids(mSize.width, mSize.height, mSize.width);
                    me._adjusting = false;
                    
                    // save setting
                    userPreference.set('sm_help', pressed);
                    userPreference.save();

                }
            });

            filterItems.push(me.compRef.helpBtn);

            me._topBar_ = Ext.create('Ext.toolbar.Toolbar', {
                items: filterItems,
                enableOverflow: menuOverflow,
                autoScroll: menuAutoScroll,
                width: '100%'
            });

            me.compRef.helpCt1 = Ext.widget('container', {
                html: languageFormat.getLanguage(11154, ''),
                width: '100%',
                padding: '0 5px',
                hidden: !smHelp,
                cls: 'fix_themebg'
            });

            me.compRef.helpCt2 = Ext.widget('container', {
                xtype: 'container',
                html: languageFormat.getLanguage(11155, ''),
                width: '100%',
                padding: '3px 5px',
                hidden: !smHelp,
                cls: 'fix_themebg'
            });

            me.compRef.topCt = Ext.create('Ext.container.Container', {
                items: [
                    me.compRef.helpCt1,
                    me._topBar_,
                    me.compRef.helpCt2
                ],
                layout: 'vbox',
                width: '100%'
            });

        } else {
            me.compRef.topCt = Ext.create('Ext.toolbar.Toolbar', {
                items: filterItems,
                enableOverflow: menuOverflow,
                autoScroll: menuAutoScroll
            });
        }
        
    },
    _createGridColumns: function() {
        var me = this;

        return {
            defaults: {
                sortable: false,
                menuDisabled: true
            },
            items: me.getGridCols()
        };
    },
    getGridCols: function() {
        var me = this;
        var colArr = N2N_CONFIG.streamerFid.split(',');
        var gridCols = [];

        for (var i = 0; i < colArr.length; i++) {
            var fid = colArr[i].trim().toLowerCase();
            var col = me.getColById(fid);
            if (col) {
                gridCols.push(col);
            }
        }
        
        return gridCols;

    },
    getColById: function(id) {
        var me = this;
        var baseCss = N2NCSS.CellDefault + " " + N2NCSS.FontString;
        me._gridColState = new ColState({
            cookieKey: columnWidthSaveManager.getCookieColKey('sm'),
            config: N2N_CONFIG.streamerColWidth,
            colWidthKey: 'sm',
            paramKey: N2N_CONFIG.constKey + 'SM',
            calFlex: true
        });

        switch (id) {
            case 'exch':
                return {
                    flex: me._gridColState.getFlex('exch'),
                    text: languageFormat.getLanguage(10126, 'Exchg'),
                    dataIndex: fieldSbEx,
                    tooltip: languageFormat.getLanguage(10731, 'Exchange Code'),
                    tooltipType: 'title',
                    renderer: function(value, meta, record) {
                        meta.css = baseCss + " " + N2NCSS.FontUnChange;

                        return record.get(fieldSbEx);
                    }
                };

                break;
            case 'code':
                return {
                    flex: me._gridColState.getFlex('code'),
                    text: languageFormat.getLanguage(10101, 'Code'),
                    dataIndex: fieldStkCode,
                    tooltip: languageFormat.getLanguage(10101, 'Code'),
                    tooltipType: 'title',
                    renderer: function(value, meta, record) {
                        meta.css = baseCss + " " + N2NCSS.FontUnChange;
                        return stockutil.getStockPart(record.get(fieldStkCode));
                    }
                };

                break;
            case 'symbol':
                return {
                    flex: me._gridColState.getFlex('symbol'),
                    text: languageFormat.getLanguage(10102, 'Symbol'),
                    dataIndex: fieldStkName,
                    tooltip: languageFormat.getLanguage(10102, 'Symbol'),
                    tooltipType: 'title',
                    renderer: function(value, meta, record) {
                        meta.css = baseCss + " " + N2NCSS.FontUnChange;
                        return stockutil.getStockPart(record.get(fieldStkName));
                    }
                };

                break;
            case 'pi':
                return {
                    text: N2N_CONFIG.streamerPIFull ? languageFormat.getLanguage(11162, 'Price Indicator') : languageFormat.getLanguage(11081, 'PI'),
                    dataIndex: fieldTransAction,
                    align: 'center',
                    tooltip: N2N_CONFIG.streamerPIFull ? languageFormat.getLanguage(11162, 'Price Indicator') : languageFormat.getLanguage(11142, 'Price Indicator'),
                    tooltipType: 'title',
                    flex: me._gridColState.getFlex('pi'),
                    renderer: function(value, meta, record) {
                        var exch = stockutil.getExchange(record.get(fieldStkCode));
                        var piCls = '';

                        if (value == 'b' || value == 'm') {
                            if (exch == 'PH') {
                                piCls = N2NCSS.FontUp;
                            } else {
                                piCls = N2NCSS.FontDown;
                            }
                        }
                        else if (value == 's' || value == 'n') {
                            if (exch == 'PH') {
                                piCls = N2NCSS.FontDown;
                            } else {
                                piCls = N2NCSS.FontUp;
                            }
                        } else {
                            piCls = N2NCSS.FontUnChange;
                        }

                        meta.css = baseCss + ' ' + piCls;
                        
                        if (value && N2N_CONFIG.streamerPIFull) {
                            value = me._getPIText(value.toLowerCase());
                            meta.tdAttr = 'title="' + value + '"';
                        }

                        return value || '';
                    }
                };

                break;
            case 'prc':
                return {
                    text: languageFormat.getLanguage(11082, 'LPrice'),
                    dataIndex: fieldLast,
                    align: 'right',
                    flex: me._gridColState.getFlex('prc'),
                    tooltip: languageFormat.getLanguage(11143, 'Last price'),
                    tooltipType: 'title',
                    renderer: me._getChangeRenderer()
                };

                return;
            case 'qty':
                return {
                    text: languageFormat.getLanguage(11083, 'LQtyU'),
                    dataIndex: fieldUnit,
                    align: 'right',
                    flex: me._gridColState.getFlex('qty'),
                    tooltip: languageFormat.getLanguage(11144, 'Last Quantity Unit'),
                    tooltipType: 'title',
                    renderer: function(value, meta, record) {
                        var exch = stockutil.getExchange(record.get(fieldStkCode));
                        var pi = record.get(fieldPI);
                        var piCls = '';

                        if (pi == 'b') {
                            if (exch == 'PH') {
                                piCls = N2NCSS.FontUp;
                            } else {
                                piCls = N2NCSS.FontDown;
                            }
                        }
                        else if (pi == 's') {
                            if (exch == 'PH') {
                                piCls = N2NCSS.FontDown;
                            } else {
                                piCls = N2NCSS.FontUp;
                            }
                        } else {
                            piCls = N2NCSS.FontUnChange;
                        }

                        meta.css = baseCss + ' ' + piCls;

                        var valueText = '';
                        if (value != null) {
                            valueText = me._formatNumber(getLotValue(value, record.get(fieldLotSize)));
                        }

                        return valueText;
                    }
                };

                break;
            case 'val':
                return {
                    text: languageFormat.getLanguage(11090, 'LValue'),
                    dataIndex: fieldLValue,
                    align: 'right',
                    flex: me._gridColState.getFlex('val'),
                    tooltip: languageFormat.getLanguage(11145, 'Last Value'),
                    tooltipType: 'title',
                    renderer: function(value, meta, record) {
                        meta.css = baseCss + " " + N2NCSS.FontUnChange;

                        var valueText = '';
                        if (value != null) {
                            valueText = me._formatNumber(jsutil.getFloat(value, 0, 3));
                        }

                        return valueText;
                    }
                };

                break;
            case 'time':
                return {
                    text: languageFormat.getLanguage(10123, 'Time'),
                    dataIndex: fieldTime,
                    align: 'center',
                    flex: me._gridColState.getFlex('time'),
                    tooltip: languageFormat.getLanguage(10123, 'Time'),
                    tooltipType: 'title',
                    renderer: function(value, meta) {
                        meta.css = baseCss + " " + N2NCSS.FontUnChange;
                        var valueText = '';
                        if (value) {
                            valueText = formatutils.procDateValue(value);
                            meta.tdAttr = 'title="' + valueText + '"';
                        }

                        return valueText;
                    }
                };

                break;
            case 'chg':
                return {
                    text: languageFormat.getLanguage(10115, 'Chg'),
                    dataIndex: fieldChange,
                    align: 'right',
                    flex: me._gridColState.getFlex('chg'),
                    tooltip: languageFormat.getLanguage(11023, 'Change'),
                    tooltipType: 'title',
                    renderer: me._getChangeRenderer()
                };

                break;
            case 'chgper':
                return {
                    text: languageFormat.getLanguage(10116, 'Chg%'),
                    dataIndex: fieldChangePer,
                    align: 'right',
                    flex: me._gridColState.getFlex('chgper'),
                    tooltip: languageFormat.getLanguage(11146, 'Change Percentage'),
                    tooltipType: 'title',
                    renderer: function(value, meta, record) {
                        var chgCls = N2NCSS.FontUnChange;
                        var chg = record.get(fieldChange);

                        if (chg > 0) {
                            chgCls = N2NCSS.FontUp;
                        } else if (chg < 0) {
                            chgCls = N2NCSS.FontDown;
                        }
                        meta.css = N2NCSS.CellDefault + ' ' + N2NCSS.FontString + ' ' + chgCls;
                        var valueText = '';
                        if (value != null) {
                            valueText = me._formatNumber(value) + '%';
                        }

                        return valueText;
                    }
                };

                break;
            case 'bbh':
                return {
                    text: languageFormat.getLanguage(11009, 'BBH'),
                    tooltip: languageFormat.getLanguage(11147, 'Buy Broker House'),
                    tooltipType: 'title',
                    dataIndex: fieldBuyBroker,
                    align: 'center',
                    flex: me._gridColState.getFlex('bbh'),
                    hidden: showTrackerBrokerName != 'TRUE',
                    renderer: function(value, meta, record) {
                        meta.css = baseCss + " " + N2NCSS.FontUnChange;

                        return value;
                    }
                };
                break;
            case 'sbh':
                return {
                    text: languageFormat.getLanguage(11010, 'SBH'),
                    tooltip: languageFormat.getLanguage(11148, 'Sell Broker House'),
                    tooltipType: 'title',
                    dataIndex: fieldSellBroker,
                    align: 'center',
                    flex: me._gridColState.getFlex('sbh'),
                    hidden: showTrackerBrokerName != 'TRUE',
                    renderer: function(value, meta, record) {
                        meta.css = baseCss + " " + N2NCSS.FontUnChange;

                        return value;
                    }
                };
                break;
            case 'rd':
                return {
                    flex: me._gridColState.getFlex('rd'),
                    text: languageFormat.getLanguage(10125, 'R/D'),
                    dataIndex: 'delayed',
                    tooltip: languageFormat.getLanguage(11159, 'R = Real-time\nD =  Delayed'),
                    tooltipType: 'R/D',
                    align: 'center',
                    renderer: function(value, meta, record) {
                        meta.css = baseCss + " " + N2NCSS.FontUnChange;
                        var val = '';
                        if (record.get('delayed') != null) {
                            if (record.get('delayed')) {
                                val = languageFormat.getLanguage(11161, 'D');
                            } else {
                                val = languageFormat.getLanguage(11160, 'R');
                            }
                        }

                        return val;
                    }
                };

                break;

            default:
                return null;
        }
    },
    _getPIText: function(pi) {
        switch (pi) {
            case 'b':
                return languageFormat.getLanguage(11163, 'Sold to Buyer');
                break;
            case 's':
                return languageFormat.getLanguage(11164, 'Bought from Seller');
                break;
            case 'm':
                return languageFormat.getLanguage(11165, 'Cross Buy');
                break;
            case 'n':
                return languageFormat.getLanguage(11166, 'Cross Sell');
                break;
            default:
                return languageFormat.getLanguage(11167, 'Other');
        }

    },
    _getChangeRenderer: function() {
        var me = this;

        return function(value, meta, record) {
            var chgCls = N2NCSS.FontUnChange;
            var chg = record.get(fieldChange);

            if (chg > 0) {
                chgCls = N2NCSS.FontUp;
            } else if (chg < 0) {
                chgCls = N2NCSS.FontDown;
            }
            
            meta.css = N2NCSS.CellDefault + ' ' + N2NCSS.FontString + ' ' + chgCls;
            var valueText = '';
            if (value != null) {
                valueText = me._formatNumber(value);
            }

            return valueText;
        };
    },
    _createEmptyRecords: function(num) {
        var records = [];
        for (var i = 0; i < num; i++) {
            records.push({});
        }

        return records;
    },
    _formatNumber: function(value) {
        return formatutils.formatNumber(value);
    },
    _moveRecordCursor: function() {
        var me = this;

        // clears highlight if any previous moving cursor
        me._clearCursorHighlight();
        me.recordCursor += 1;
        if (me.recordCursor > me._maxRecord - 1) {
            me.recordCursor = 0;
        }
    },
    _getCursorInfo: function(cursorIndex) {
        var me = this;
        
        // grid index
        var gridIndex = parseInt(cursorIndex/me._recordNum);
        // record index
        var rowIndex = cursorIndex % me._recordNum;

        return {
            rowIndex: rowIndex,
            gridIndex: gridIndex,
            grid: me.items.items[gridIndex]
        };
    },
    _getCell: function(cursorIndex, dataIndex) {
        var me = this;
        var cursor = me._getCursorInfo(cursorIndex);

        // record index
        var rowIndex = cursor.rowIndex;
        var grid = cursor.grid;

        if (grid) {
            var gridView = helper.getGridView(grid);
            if (gridView) {
                var colIndex = helper.getColumnIndex(gridView.headerCt.getGridColumns(), 'dataIndex', dataIndex);
                var cell = gridView.getCellByPosition({row: rowIndex, column: colIndex});

                return cell;
            }
        }

        return null;
    },
    _updateCell: function(cell, feedData) {
        if (cell) {
            var cellEl = cell.first(); // get first element of cell
            cellEl.setHtml(feedData);
        }
    },
    saveSettingPreference: function () {
        var me = this, paramsObj = {};
        var exch = me.compRef.exCb.getValue();
        var wl = me.compRef.wlCb.getValue();

        if (me.compRef.filterCb) {
            var filterOpt = me.compRef.filterCb.getValue();

            var valueSign = stringToAscii(filterOpt.valueSign);
            paramsObj['filter_valSign'] = valueSign;

            paramsObj['filter_val'] = filterOpt.value;

            var volSign = stringToAscii(filterOpt.volSign);
            paramsObj['filter_volSign'] = volSign;

            paramsObj['filter_vol'] = filterOpt.vol;
            paramsObj['filter_opt'] = true;

        } else if (me.compRef.valueSignCb) {
            var valueSign = stringToAscii(me.compRef.valueSignCb.getValue());
            var value = me.compRef.valueTf.getValue();
            var volSign = stringToAscii(me.compRef.volSignCb.getValue());
            var vol = me.compRef.volTf.getValue();

            paramsObj['flex_valSign'] = valueSign;
            paramsObj['flex_val'] = value;
            paramsObj['flex_volSign'] = volSign;
            paramsObj['flex_vol'] = vol;
            paramsObj['flex_opt'] = true;
        }
        if (exch) {
            paramsObj.exchg = exch;
            paramsObj.wl = "";
        } else if (wl) {
            paramsObj.exchg = "";
            paramsObj.wl = wl;
        }

        for (var key in paramsObj) {
            if (paramsObj.hasOwnProperty(key)) { //to be safe
                streamerPreference.set("sr_" + key, paramsObj[key]);
            }
        }
        streamerPreference.save();
    },
    subscribe: function() {
        var me = this;

        if (me.paused) {
            return;
        }

        me._adjusting = true;
        
        var exch = me.compRef.exCb.getValue();
        var wl = me.compRef.wlCb.getValue();
        me._streamWl = !exch && wl;
        
        if (!exch && !wl) {
            if (!me._firstSub) {
                msgutil.alert(languageFormat.getLanguage(11152, 'Please select an exchange or a watchlist.'));
            }
            return;
        }

        var reqObj = {
            listenId: 'listenStreamer'
        };
        
        var filterExists = false;
        if (me.compRef.filterCb) {
            var filterOpt = me.compRef.filterCb.getValue();

            if (filterOpt) {
                Ext.apply(reqObj, filterOpt);
                filterExists = true;
            }

        } else if (me.compRef.valueSignCb) {
            reqObj.valueSign = me.compRef.valueSignCb.getValue();
            reqObj.value = me.compRef.valueTf.getValue();
            reqObj.volSign = me.compRef.volSignCb.getValue();
            reqObj.vol = me.compRef.volTf.getValue();
            
            filterExists = reqObj.value != null || reqObj.vol != null;
        }
        
        if (N2N_CONFIG.streamerRequireFilter && !filterExists) {
            if (me._hasSubscribed) {
                n2nLayoutManager.updateTitle(me, languageFormat.getLanguage(20157, 'Streamer'));
                me.unsubscribe();
                if (!me.compRef.playBt.isDisabled()) {
                    me.compRef.playBt.disable();
                }
            }
            
            // msgutil.alert(languageFormat.getLanguage(20157, 'Streamer') + ': '+ languageFormat.getLanguage(11149, 'please select a filter.'));
            if (!me._firstSub) {
                msgutil.alert(languageFormat.getLanguage(11149, 'Please filter by Value and/or Quantity.'));
            }

            return;
        }
        
        if (me.compRef.playBt.isDisabled()) {
            me.compRef.playBt.enable();
        }
        
        if (exch) { // filter by exchange
            reqObj.exch = exch;
            me._updateTitle(exch, reqObj);

            if (!fullList[exch]) {
                fullList[exch] = {}; // to avoid duplicate loading stock list when loading is still in progress

                conn.getFullList({
                    rType: 'full_list',
                    exch: exch,
                    success: function() {
                        conn.subscribeTransaction(reqObj);
                        me._cacheRequest(reqObj);
                    }
                });
            } else {
                conn.subscribeTransaction(reqObj);
                me._cacheRequest(reqObj);
            }

        } else if (wl) { // filter by watchlist
            var url = addPath + 'tcplus/getwl?w=' + encodeURI(wl);
            me._updateTitle(textToHtml(wl), reqObj);

            Ext.Ajax.request({
                url: url,
                method: 'POST',
                success: function(response) {
                    try {
                        var obj = Ext.decode(response.responseText);
                        var stkList = obj.d;

                        if (stkList.length > 0) {
                            reqObj.list = stkList;

                            var newList = getNewWlMappingList(stkList);
                            if (newList.length > 0) {
                                conn.getSimpleStockList({
                                    list: newList,
                                    col: [fieldStkCode, fieldStkName, fieldLotSize],
                                    success: function(res) {
                                        // update mapping list
                                        updateWlMappingList(res.d);
                                        conn.subscribeTransaction(reqObj);
                                        me._cacheRequest(reqObj);
                                    }
                                });
                            } else {
                                conn.subscribeTransaction(reqObj);
                                me._cacheRequest(reqObj);
                            }
                        }
                    } catch (e) {
                    }

                },
                failure: function() {

                }
            });
        }

    },
    _updateTitle: function(title, extraObj) {
        var me = this;
        
        var newTitles = [
            languageFormat.getLanguage(20157, 'Streamer'),
            ' [',
            title];
        
        var applyTitle = [];
        if (title) {
            applyTitle.push(languageFormat.getLanguage(20157, 'Streamer'));
            applyTitle.push('<br/>' + languageFormat.getLanguage(11150, 'filter applied: ') + title);
        }

        if (extraObj) {
            if (!jsutil.isEmpty(extraObj.vol)) {
                newTitles.push(', ', languageFormat.getLanguage(10118, 'Vol'), extraObj.volSign, formatutils.formatNumber(extraObj.vol, 0, true, 0, 0, true, 0));
                applyTitle.push(', ', languageFormat.getLanguage(10118, 'Vol'), extraObj.volSign, formatutils.formatNumber(extraObj.vol, 0, true, 0, 0, true, 0));
            }

            if (!jsutil.isEmpty(extraObj.value)) {
                newTitles.push(', ', languageFormat.getLanguage(10127, 'Value'), extraObj.valueSign, formatutils.formatNumber(extraObj.value, 0, true, 0, 0, true, 0));
                applyTitle.push(', ', languageFormat.getLanguage(10127, 'Value'), extraObj.valueSign, formatutils.formatNumber(extraObj.value, 0, true, 0, 0, true, 0));
            }
        }

        newTitles.push(']');
        n2nLayoutManager.updateTitle(me, newTitles.join(''));
        
        if (applyTitle.length > 0) {
            // msgutil.info(applyTitle.join(''));
            if (!me._skipApplyMsg) {
                msgutil.info(languageFormat.getLanguage(20157, 'Streamer') + ' ' + languageFormat.getLanguage(11151, 'will start streaming data according to the selected criteria.'));
            }
            me._skipApplyMsg = false;
        }
        
    },
    _cacheRequest: function(reqObj){
        var me = this;
        
        me._reqObj = reqObj;
        me._adjusting = false;
        me._hasSubscribed = true;
    },
    unsubscribe: function() {
        var me = this;
        
        me._hasSubscribed = false;
        me._streamWl = false;
        conn.unsubscribeTransaction('listenStreamer');
    },
    _highlightCursor: function() {
        var me = this;

        for (var i = 0; i < me._cursorCells.length; i++) {
            var cell = me._cursorCells[i];
            if (cell && cell.el) {
                var firstChild = cell.el.first();
                if (firstChild) {
                    firstChild.removeCls(me._getAllMappedCls());
                }
                cell.el.addCls(['currentCursor', cell.cls]);
            }
        }
    },
    _clearCursorHighlight: function() {
        var me = this;
        
        for (var i = 0; i < me._cursorCells.length; i++) {
            var cell = me._cursorCells[i];
            if (cell && cell.el) {
                cell.el.removeCls(['currentCursor', cell.cls]);
                
                var firstChild = cell.el.first();
                if (firstChild) {
                    firstChild.addCls(me._getMappedCls(cell.cls)); // make sure cell.cls is a single class
                }
            }
        }
    },
    _getMappedCls: function(cls) {
        var me = this;
        var childCls = '';

        switch (cls) {
            case N2NCSS.BackDown:
                childCls = N2NCSS.FontDown;
                break;
            case N2NCSS.BackUp:
                childCls = N2NCSS.FontUp;
                break;
            case N2NCSS.BackUnChange:
                if (me._cursorExch === 'PH') {
                    childCls = N2NCSS.FontUnChange_yellow;
                } else {
                    childCls = N2NCSS.FontUnChange;
                }
                break;
        }

        return childCls;
    },
    _getAllMappedCls: function() {
        return [N2NCSS.FontDown, N2NCSS.FontUp, N2NCSS.FontUnChange, N2NCSS.FontUnChange_yellow];
    },
    _highlightFirstRow: function() {
        var me = this;

    },
    clearAll: function() {
        var me = this;
        
        me._selectedRec = [];
        me.adjusting = true;
        me.recordCursor = -1;
        var grids = me.items.items;
        for (var i = 0; i < grids.length; i++) {
            var grid = grids[i];
            var rec = me._createEmptyRecords(me._recordNum);
            grid.store.loadData(rec);
        }

        me.adjusting = false;
    },
    focusSearchBox: function() {
        focusManager.focusSearchbox(this.compRef.valueTf);
    },
    activateOrder: function(record) {
        var me = this;
        if (closedOrderPad) {
            return;
        }

        var activeRec = {};
        activeRec.stkCode = record.get(fieldStkCode);
        activeRec.stkName = record.get(fieldStkName);
        activeRec.rec = record;
        
        global_OrderSource = 'MS';

        if (record.get(fieldTransAction) === 'b') {
            // activate sell
            activateBuySellMenu(modeOrdSell, activeRec);
        } else {
            // default buy
            activateBuySellMenu(modeOrdBuy, activeRec);
        }
    }
});

Ext.define('TCPlus.view.quote.TrackerRecord', {
    extend: 'Ext.container.Container',
    alias: 'widget.trackerrecord',
    type: 'td',
    savingComp: true,
    compRef: {},
    boxWidth: 110,
    boxHeight: 90,
    widthPadding: 10,
    winConfig: {
        minWidth: 125,
        minHeight: 150,
        width: 862,
        height: 170
    },
    r2l: false,
    multiRow: false,
    screenType: 'main',
    initComponent: function() {
        var me = this;
        
        if (N2N_CONFIG.streamerPreference) {
            me.r2l = jsutil.toBoolean(streamerPreference.get('tr_rightToLeft', "true"));
            me.multiRow = jsutil.toBoolean(streamerPreference.get('tr_multiRow', "false"));
        }
        
        if (N2N_CONFIG.trackerRecordV2) {
            me.boxWidth = 70;
            me.widthPadding = 5;
            me.winConfig.height = 160;
        }
        
        me._createCompItems();
        Ext.apply(me, {
            title: languageFormat.getLanguage(20501, 'Tracker Record'),
            keyEnabled: N2N_CONFIG.keyEnabled,
            items: [
                me._topBar_,
                me.compRef.tdView
            ],
            listeners: {
                resize: function(thisComp, width, height) {
                    if (width) {
                        // determine the the number of boxes fit to display
                        me._procAutoNum(thisComp, width, height);

                        if (!me._firstLoad) { // should run only once
                            me._firstLoad = true;
                            me._firstSub = true;
                            // display some records instead of blank (if available)
                            me._getTrackerHistory();

                            me.subscribe();
                            me._firstSub = false;
                        }
                    }
                }
            }
        });

        me.callParent(arguments);
    },
    reset: function () {
        var me = this;

        me._adjusting = true;
        me.unsubscribe();

        me.compRef.tdView.store.loadData([]); // don't use removeAll(), will cause bugs (ExtJS's bug)
        if (me._width && me._height) {
            me._procAutoNum(me, me._width, me._height);
        }

        me._getTrackerHistory();
        me.subscribe();
    },
    clearAll: function() {
        var me = this;

        me._adjusting = true;

        me.compRef.tdView.store.loadData([]);
        if (me._width && me._height) {
            me._procAutoNum(me, me._width, me._height);
        }
        
    },
    saveSettingPreference: function () {
        var me = this, paramsObj = {};
        var exch = me.compRef.exCb.getValue();
        var wl = me.compRef.wlCb.getValue();

        if (me.compRef.filterCb) {
            var filterOpt = me.compRef.filterCb.getValue();

            var valueSign = stringToAscii(filterOpt.valueSign);
            paramsObj['filter_valSign'] = valueSign;

            paramsObj['filter_val'] = filterOpt.value;

            var volSign = stringToAscii(filterOpt.volSign);
            paramsObj['filter_volSign'] = volSign;

            paramsObj['filter_vol'] = filterOpt.vol;
            paramsObj['filter_opt'] = true;

        } else if (me.compRef.valueSignCb) {
            var valueSign = stringToAscii(me.compRef.valueSignCb.getValue());
            var value = me.compRef.valueTf.getValue();
            var volSign = stringToAscii(me.compRef.volSignCb.getValue());
            var vol = me.compRef.volTf.getValue();

            paramsObj['flex_valueSign'] = valueSign;
            paramsObj['flex_value'] = value;
            paramsObj['flex_volSign'] = volSign;
            paramsObj['flex_vol'] = vol;
            paramsObj['flex_opt'] = true;
        }
        if (exch) {
            paramsObj.exchg = exch;
            paramsObj.wl = "";
        } else if (wl) {
            paramsObj.exchg = "";
            paramsObj.wl = wl;
        }

        for (var key in paramsObj) {
            if (paramsObj.hasOwnProperty(key)) { //to be safe
                streamerPreference.set("tr_" + key, paramsObj[key]);
            }
        }
        streamerPreference.save();
    },
    _procAutoNum: function(me, width, height) {
        me._adjusting = true; // status as calculating number of boxes, so the update will skip the painting at this point
        me._width = width;
        me._height = height;
        
        var tbarHeight = 22;
        if (me._topBar_) {
            tbarHeight = me._topBar_.getHeight();
        }
        var heightPadding = 10;
        me.boxCol = Math.floor(width / (me.boxWidth + me.widthPadding));
        me.boxRow = Math.floor((height - tbarHeight) / (me.boxHeight + heightPadding));
        if (me.boxCol === 0) { // at least one row
            me.boxCol = 1;
        }
        if (me.boxRow === 0 || !me.multiRow) { // at least one column
            me.boxRow = 1;
        }
        me.boxNum = me.boxCol * me.boxRow;

        // follow max record if enabled
        if (global_TrackerRecordTotalRecord != -1 && me.boxNum > global_TrackerRecordTotalRecord) {
            me.boxNum = parseInt(global_TrackerRecordTotalRecord);
        }

        // readjust number of boxes
        if (me.compRef.tdView) {
            var boxNum = me.compRef.tdView.store.getCount();
            // if total boxes exceeds, removes the exceeding boxes
            var exceeding = boxNum - me.boxNum;

            if (exceeding > 0) {
                if (me.r2l) {
                    me.compRef.tdView.store.removeAt(0, exceeding);
                } else {
                    me.compRef.tdView.store.removeAt(me.boxNum, exceeding);
                }
            } else {
                if (me.r2l && boxNum < me.boxNum) {
                    // populate empty boxes
                    var emptyBoxes = [];
                    var lessNum = Math.abs(exceeding);
                    for (var i = 0; i < lessNum; i++) {
                        emptyBoxes.push({});
                    }
                    me.compRef.tdView.store.insert(0, emptyBoxes);
                }
            }
        }
        me._adjusting = false;
    },
    _createCompItems: function() {
        var me = this;

        // tracker view
        if (me.compRef.tdView) {
            me.compRef.tdView.destroy();
        }
        
        var recTpl = new Ext.XTemplate('<tpl for=".">',
                '<table class="font-applied trackerrecord {reccls}">',
                '<tr><td colspan="2"><div class="tr-title">{title}</div></td></tr>',
                '<tr><td class="first-td">{[this.formatLot(values[' + fieldUnit + '], values[' + fieldLotSize + '])]}</td>',
                '<td rowspan="4" class="back-img"></td></tr>',
                '<tr><td>{' + fieldLast + '}</td></tr>',
                '<tr><td title="{tooltip}">{' + fieldBuyBroker + '}</td></tr>',
                '<tr><td title="{tooltip}">{' + fieldSellBroker + '}</td></tr>',
                '</table>',
                '</tpl>',
                {
                    formatLot: function(unit, lotSize) {
                        return formatutils.round10(getLotValue(unit, lotSize));
                    }
                });

        if (N2N_CONFIG.trackerRecordV2) {
            recTpl = new Ext.XTemplate('<tpl for=".">',
                    '<table class="font-applied trackerrecord tdv2 {reccls}">',
                    '<tr><td><div class="tr-title">{title}</div></td></tr>',
                    '<tr><td><div class="tr-indent">{' + fieldLast + '}</div></td></tr>',
                    '<tr><td>{[this.formatLot(values[' + fieldUnit + '], values[' + fieldLotSize + '])]}</td></tr>',
                    '<tr><td title="{tooltip}">{' + fieldBuyBroker + '}</td></tr>',
                    '<tr><td title="{tooltip}"><div class="tr-indent">{' + fieldSellBroker + '}</div></td></tr>',
                    '</table>',
                    '</tpl>',
                    {
                        formatLot: function(unit, lotSize) {
                            return formatutils.round10(getLotValue(unit, lotSize));
                        }
                    });
        }
        
        me.compRef.tdView = Ext.create('Ext.view.View', {
            tpl: recTpl,
            itemSelector: 'table.trackerrecord',
            store: {
                fields: [
                    fieldStkCode, fieldTime, fieldTransAction, fieldLast, fieldUnit,
                    fieldBuyBroker, fieldSellBroker, fieldPI, 'reccls', 'tooltip', 'title'
                ]
            },
            listeners: {
                itemclick: function(gridView, record) {
                    var stkCode = record.get(fieldStkCode);
                    var stkName = record.get(fieldStkName);

                    syncGroupManager.syncAllComps(me, stkCode, stkName);
                }
            }
        });
        
        // toolbox
        me._createTopbar();
        // setting
        if (N2N_CONFIG.streamerPreference) {

            var trackerRecordOpt = streamerPreference.get('tr_filter_opt') || streamerPreference.get('tr_flex_opt');
            if (trackerRecordOpt) {
                if (streamerPreference.get('tr_exchg')) {
                    me.compRef.exCb.setValue(streamerPreference.get('tr_exchg'));
                    me.compRef.wlCb.setValue('');
                } else if (streamerPreference.get('tr_wl')) {
                    me.compRef.exCb.setValue('');
                    me.compRef.wlCb.setValue(streamerPreference.get('tr_wl'));
                }

                if (streamerPreference.get('tr_filter_opt') && me.compRef.filterCb) {
                    var valueSign = asciiToString(streamerPreference.get('tr_filter_valSign'));
                    var value = streamerPreference.get('tr_filter_val');
                    var volSign = asciiToString(streamerPreference.get('tr_filter_volSign'));
                    var vol = streamerPreference.get('tr_filter_vol');
                    //pass in undefined to compare combobox store value
                    me.compRef.filterCb.setCustomValue({
                        value: value == "" ? null : value,
                        valueSign: valueSign,
                        volSign: volSign,
                        vol: vol == "" ? null : vol
                    })
                } else if (streamerPreference.get('tr_flex_opt')) {
                    var sign = asciiToString(streamerPreference.get('tr_flex_valueSign'));
                    if (me.compRef.valueSignCb)
                        me.compRef.valueSignCb.setValue(sign);
                    if (me.compRef.valueTf)
                        me.compRef.valueTf.setValue(streamerPreference.get('tr_flex_value'));
                    sign = asciiToString(streamerPreference.get('tr_flex_volSign'));
                    if (me.compRef.volSignCb)
                        me.compRef.volSignCb.setValue(sign);
                    if (me.compRef.volTf)
                        me.compRef.volTf.setValue(streamerPreference.get('tr_flex_vol'));
                }
            }
        }
        me.subscribe();
    },
    _createTopbar: function() {
        var me = this;

        var exList = [
            ['', languageFormat.getLanguage(20342, 'Select Exchange')]
        ];
        for (var i = 0; i < global_ExchangeList.length; i++) {
            if (validateStreamerExch(global_ExchangeList[i].exchange)) {
                exList.push([global_ExchangeList[i].exchange, global_ExchangeList[i].exchangeName]);
            }
        }
        
        if (exList.length < 3) {
            exList.shift();
        }
        
        var elStyle = 'margin-left: 5px';

        me.compRef.exCb = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: languageFormat.getLanguage(11064, 'Filter by'),
            labelWidth: 50,
            width: 170,
            store: {
                fields: ['value', 'label'],
                data: exList
            },
            displayField: 'label',
            valueField: 'value',
            value: validateStreamerExch(exchangecode) ? exchangecode : exList[0],
            editable: false,
            queryMode: 'local',
            matchFieldWidth: false,
            listeners: {
                select: function() {
                    // reset watchlist
                    me.compRef.wlCb.select('');
                }
            }
        });

        me.compRef.wlCb = Ext.create('Ext.form.field.ComboBox', {
            width: 115,
            store: {
                fields: ['value', 'label'],
                data: [['', languageFormat.getLanguage(11084, 'Select Watchlist')]]
            },
            style: elStyle,
            listConfig: {
                listeners: {
                    beforeshow: function() {
                        var wlList = [
                            ['', languageFormat.getLanguage(11084, 'Select Watchlist')]
                        ];
                        var lastSelected = me.compRef.wlCb.getSelection() || '';
                        for (var i = 0; i < watchListArr.length; i++) {
                            var wl = watchListArr[i];
                            wlList.push([wl, wl]);
                        }

                        me.compRef.wlCb.store.loadData(wlList);
                        me.compRef.wlCb.select(lastSelected);
                    }
                }
            },
            displayField: 'label',
            valueField: 'value',
            value: '',
            editable: false,
            queryMode: 'local',
            listeners: {
                select: function() {
                    // reset exchange
                    me.compRef.exCb.select('');
                }
            }
        });
        
        var tbarItems = [me.compRef.exCb, me.compRef.wlCb];
    
        if (N2N_CONFIG.streamerFlexibleFilter) {
            me.compRef.valueLb = Ext.widget('label', {
                text: languageFormat.getLanguage(10736, 'Trade value'),
                style: elStyle
            });
            me.compRef.valueSignCb = Ext.widget('combobox', {
                store: ['>', '<', '='],
                value: '>',
                width: 35,
                style: 'margin-left: 5px',
                listConfig: {
                    minWidth: 30
                },
                editable: false
            });
            me.compRef.valueTf = Ext.widget('numberfield', {
                hideTrigger: true,
                selectOnFocus: true,
                width: 75
            });

            me.compRef.volLb = Ext.widget('label', {
                text: languageFormat.getLanguage(11085, 'Trade volume'),
                style: elStyle
            });
            me.compRef.volSignCb = Ext.widget('combobox', {
                store: ['>', '<', '='],
                value: '>',
                width: 35,
                style: 'margin-left: 5px',
                editable: false,
                listConfig: {
                    minWidth: 30
                }
            });
            me.compRef.volTf = Ext.widget('numberfield', {
                hideTrigger: true,
                selectOnFocus: true,
                width: 75
            });

            tbarItems.push(me.compRef.volLb, me.compRef.volSignCb, me.compRef.volTf,
                    me.compRef.valueLb, me.compRef.valueSignCb, me.compRef.valueTf
                    );
        } else {
            var optRec = toStreamerOptionRec(N2N_CONFIG.streamerFilterOptions);
            if (optRec.length > 1) {
                me.compRef.filterCb = Ext.widget('combo', {
                    store: {
                        fields: ['text', 'value'],
                        data: optRec
                    },
                    displayField: 'text',
                    valueField: 'value',
                    editable: false,
                    value: 0,
                    matchFieldWidth: false,
                    width: 130,
                    style: elStyle,
                    listConfig: {
                        minWidth: 130
                    },
                    setCustomValue: function (value) {
                        for (var i = 0; i < optRec.length; i++) {
                            if (optRec[i].value.volSign == value.volSign
                                    && optRec[i].value.vol == value.vol
                                    && optRec[i].value.valueSign == value.valueSign
                                    && optRec[i].value.value == value.value) {
                                me.compRef.filterCb.setValue(optRec[i].value);
                                return;
                            }
                        }
                    }
                });

                tbarItems.push(me.compRef.filterCb);
            }
        }
        
        me.compRef.applyBt = Ext.widget('button', {
            text: languageFormat.getLanguage(20618, 'Apply'),
            tooltip: languageFormat.getLanguage(11087, 'Apply filter'),
            iconCls: '',
            cls: 'flatbtn',
            style: elStyle,
            handler: function() {
                me.clearAll();
                me.paused = false; // resume streaming
                me.subscribe();
                if (N2N_CONFIG.streamerPreference) {
                    me.saveSettingPreference();
                }
            }
        });

        if (N2N_CONFIG.streamerPreference) {
            var trackRecordTrans = streamerPreference.get('tr_rightToLeft') == "true";
            var trackRecordSetting = [];
            if (trackRecordTrans) {
                trackRecordSetting.push(languageFormat.getLanguage(20502, 'Right to Left'));
                trackRecordSetting.push('icon-r2l');
                trackRecordSetting.push(trackRecordTrans);
            } else {
                trackRecordSetting.push(languageFormat.getLanguage(20503, 'Left to Right'));
                trackRecordSetting.push('icon-l2r');
                trackRecordSetting.push(trackRecordTrans);
            }
        }
        
        me.compRef.transitionBt = Ext.widget('button', {
            text: trackRecordSetting ? trackRecordSetting[0] : languageFormat.getLanguage(20503, 'Left to Right'),
            tooltip: trackRecordSetting ? trackRecordSetting[0] : languageFormat.getLanguage(20503, 'Left to Right'),
            iconCls: trackRecordSetting ? trackRecordSetting[1] : 'icon-l2r',
            _r2l: trackRecordSetting ? trackRecordSetting[2] : false,
            handler: function(thisBtn) {
                thisBtn._r2l = !thisBtn._r2l;
                me.r2l = thisBtn._r2l;
                streamerPreference.set('tr_rightToLeft', thisBtn._r2l.toString());
                streamerPreference.save();
                if (me.r2l) {
                    thisBtn.setIconCls('icon-r2l');
                    thisBtn.setTooltip(languageFormat.getLanguage(20502, 'Right to Left'));
                } else {
                    thisBtn.setIconCls('icon-l2r');
                    thisBtn.setTooltip(languageFormat.getLanguage(20503, 'Left to Right'));
                }
            }
        });
        me.compRef.multiBt = Ext.widget('button', {
            text: languageFormat.getLanguage(20504, 'Multirow'),
            enableToggle: true,
            iconCls: 'icon-multirow',
            pressed: me.multiRow,
            toggleHandler: function(thisBtn, state) {
                me.multiRow = state;
                streamerPreference.set('tr_multiRow', state.toString());
                streamerPreference.save();
                // recalculate boxes
                var compSize = me.getSize();
                me._procAutoNum(me, compSize.width, compSize.height);
            }
        });

        me.compRef.playBt = Ext.widget('button', {
            text: languageFormat.getLanguage(20505, 'Pause'),
            iconCls: 'icon-pause',
            _paused: false,
            handler: function(thisBtn) {
                thisBtn._paused = !thisBtn._paused;
                me.paused = thisBtn._paused;
                if (me.paused) {
                    thisBtn.setIconCls('icon-play');
                    thisBtn.setText(languageFormat.getLanguage(20506, 'Stream'));
                    thisBtn.setTooltip(languageFormat.getLanguage(20506, 'Stream'));
                    me.unsubscribe();
                } else {
                    thisBtn.setIconCls('icon-pause');
                    thisBtn.setText(languageFormat.getLanguage(20505, 'Pause'));
                    thisBtn.setTooltip(languageFormat.getLanguage(20505, 'Pause'));
                    me.subscribe();
                }
            }
        });
        
        tbarItems.push(me.compRef.applyBt, '->', me.compRef.transitionBt,
                me.compRef.multiBt, me.compRef.playBt);

        me._topBar_ = Ext.create('Ext.toolbar.Toolbar', {
            items: tbarItems,
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll
        });
    },
    updateFeedRecord: function(feedObj) {
        var me = this;
        
        if (me._adjusting || me.paused || me.inactive) { // skip this update
            return;
        }
        
        var stkCode = feedObj[fieldStkCode];
        if (!me._reqObj || !stkCode) {
            return;
        }

        // check filter
        var exch = stockutil.getExchange(stkCode);

        // watchlist or exchange
        if (me._reqObj.list && me._reqObj.list.indexOf(stkCode) === -1) {
            return;
        } else if (me._reqObj.exch && me._reqObj.exch.indexOf(exch) === -1) {
            return;
        }

        // value
        if (me._reqObj.value && me._reqObj.valueSign && !compareValues(feedObj[fieldLValue], me._reqObj.value, me._reqObj.valueSign)) {
            return;
        }

        // vol
        if (me._reqObj.vol && me._reqObj.volSign && !compareValues(feedObj[fieldUnit], me._reqObj.vol, me._reqObj.volSign)) {
            return;
        }

        var pi = feedObj[fieldPI];
        var recCls = N2NCSS.FontUnChange_yellow;
        if (pi) {
            pi = pi.toLowerCase();

            if (pi === 'b') {
                recCls = N2NCSS.FontUp;
            } else if (pi === 's') {
                recCls = N2NCSS.FontDown;
            }
        }

        feedObj['reccls'] = recCls;
        
        var stkData = stockutil.getStockDataFromList(feedObj[fieldStkCode], exch, me._streamWl);
        if (stkData) {
            feedObj[fieldStkName] = stkData[fieldStkName];
            var lotSize = parseInt(stkData[fieldLotSize]);
            if (lotSize > 0) {
                feedObj[fieldLotSize] = lotSize;
            }
        }

        if (!feedObj[fieldStkName]) {
            feedObj[fieldStkName] = feedObj[fieldStkCode];
        }
        
        if (N2N_CONFIG.trackerRecordDisplayCode) {
            feedObj['title'] = stockutil.getStockPart(feedObj[fieldStkCode]);
        } else {
            feedObj['title'] = stockutil.getStockPart(feedObj[fieldStkName]);
        }
        
        if (feedObj[fieldLast]) { // format decimals and remove unneeded 0
            feedObj[fieldLast] = processDecimal(feedObj[fieldLast], N2N_CONFIG.trackerRecordPriceDec, true);
        }

        updateBrokerData(feedObj);
        
        if (me.r2l) { // right to left
            if (me.compRef.tdView.store.getCount() >= me.boxNum && me.boxNum > 0) {
                    me.compRef.tdView.store.removeAt(0); // remove first record
            }
                me.compRef.tdView.store.add(feedObj); // add to the last
        } else { // left to right
            if (me.compRef.tdView.store.getCount() >= me.boxNum && me.boxNum > 0) {
                me.compRef.tdView.store.removeAt(me.boxNum - 1); // remove the last record
            }
            me.compRef.tdView.store.insert(0, feedObj); // adds to the first 
        }
        
    },
    _getLotValue: function(value, lotSize) {
        if (global_displayUnit.toLowerCase() == "lot" && lotSize > 0) {
            return value / lotSize;
        }

        return value;
    },
    refreshRecords: function() {
        var me = this;

        me.compRef.tdView.refreshView();
    },
    _getTrackerHistory: function() {
        var me = this;

        me.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
        conn.getTrackerHistory({
            exch: exchangecode,
            limit: me.boxNum,
            success: function(res) {
                me.setLoading(false);
                
                if (res && res.data) {
                    var dataObj = res.data;
                    for (var i = 0; i < dataObj.length; i++) {
                        me.updateFeedRecord(dataObj[i]);
                    }
                }

            }
        });
    },
    subscribe: function() {
        var me = this;

        if (me.paused) {
            return;
        }

        me._adjusting = true;

        var exch = me.compRef.exCb.getValue();
        var wl = me.compRef.wlCb.getValue();
        me._streamWl = !exch && wl;
        
        if (!exch && !wl) {
            if (!me._firstSub) {
                msgutil.alert(languageFormat.getLanguage(11152, 'Please select an exchange or a watchlist.'));
            }
            
            return;
        }

        var reqObj = {
            listenId: 'listenTrackerRecord'
        };
        
        var filterExists = false;
        if (me.compRef.filterCb) {
            var filterOpt = me.compRef.filterCb.getValue();

            if (filterOpt) {
                Ext.apply(reqObj, filterOpt);
                filterExists = true;
            }

        } else if (me.compRef.valueSignCb) {
            reqObj.valueSign = me.compRef.valueSignCb.getValue();
            reqObj.value = me.compRef.valueTf.getValue();
            reqObj.volSign = me.compRef.volSignCb.getValue();
            reqObj.vol = me.compRef.volTf.getValue();
            
            filterExists = reqObj.value != null || reqObj.vol != null;
        }
        
        if (N2N_CONFIG.streamerRequireFilter && !filterExists) {
            if (me._hasSubscribed) {
                n2nLayoutManager.updateTitle(me, languageFormat.getLanguage(20501, 'Tracker Record'));
                me.unsubscribe();
            }
            
            // msgutil.alert(languageFormat.getLanguage(20501, 'Tracker Record') + ': '+ languageFormat.getLanguage(11149, 'please select a filter.'));
            if (!me._firstSub) {
                msgutil.alert(languageFormat.getLanguage(11149, 'Please filter by Value and/or Quantity.'));
            }
            
            return;
        }
        
        if (exch) { // filter by exchange
            reqObj.exch = exch;
            me._updateTitle(exch, reqObj);

            if (!fullList[exch]) {
                fullList[exch] = {}; // to avoid duplicate loading stock list when loading is still in progress

                conn.getFullList({
                    exch: exch,
                    success: function() {
                        conn.subscribeTransaction(reqObj);
                        me._cacheRequest(reqObj);
                    }
                });
            } else {
                conn.subscribeTransaction(reqObj);
                me._cacheRequest(reqObj);
            }

        } else if (wl) { // filter by watchlist
            var url = addPath + 'tcplus/getwl?w=' + encodeURI(wl);
            me._updateTitle(textToHtml(wl), reqObj);

            Ext.Ajax.request({
                url: url,
                method: 'POST',
                success: function(response) {
                    try {
                        var obj = Ext.decode(response.responseText);
                        var stkList = obj.d;

                        if (stkList.length > 0) {
                            reqObj.list = stkList;

                            var newList = getNewWlMappingList(stkList);
                            if (newList.length > 0) {
                                conn.getSimpleStockList({
                                    list: newList,
                                    col: [fieldStkCode, fieldStkName],
                                    success: function(res) {
                                        // update mapping list
                                        updateWlMappingList(res.d);
                                        conn.subscribeTransaction(reqObj);
                                        me._cacheRequest(reqObj);
                                    }
                                });
                            } else {
                                conn.subscribeTransaction(reqObj);
                                me._cacheRequest(reqObj);
                            }
                        }
                    } catch (e) {
                    }

                },
                failure: function() {

                }
            });
        }

    },
    _updateTitle: function(title, extraObj) {
        var me = this;
        
        var newTitles = [
            languageFormat.getLanguage(20501, 'Tracker Record'),
            ' [',
            title];
        
        var applyTitle = [];
        if (title) {
            applyTitle.push(languageFormat.getLanguage(20501, 'Tracker Record'));
            applyTitle.push('<br/>' + languageFormat.getLanguage(11150, 'filter applied: ') + title);
        }

        if (extraObj) {
            if (!jsutil.isEmpty(extraObj.vol)) {
                newTitles.push(', ', languageFormat.getLanguage(10118, 'Vol'), extraObj.volSign, formatutils.formatNumber(extraObj.vol, 0, true, 0, 0, true, 0));
                applyTitle.push(', ', languageFormat.getLanguage(10118, 'Vol'), extraObj.volSign, formatutils.formatNumber(extraObj.vol, 0, true, 0, 0, true, 0));
            }

            if (!jsutil.isEmpty(extraObj.value)) {
                newTitles.push(', ', languageFormat.getLanguage(10127, 'Value'), extraObj.valueSign, formatutils.formatNumber(extraObj.value, 0, true, 0, 0, true, 0));
                applyTitle.push(', ', languageFormat.getLanguage(10127, 'Value'), extraObj.valueSign, formatutils.formatNumber(extraObj.value, 0, true, 0, 0, true, 0));
            }
        }

        newTitles.push(']');
        n2nLayoutManager.updateTitle(me, newTitles.join(''));
        
        if (applyTitle.length > 0) {
            // msgutil.info(applyTitle.join(''));
            msgutil.info(languageFormat.getLanguage(20501, 'Tracker Record') + ' ' + languageFormat.getLanguage(11151, 'will start streaming data according to the selected criteria.'));
        }
        
    },
    _cacheRequest: function(reqObj) {
        var me = this;

        me._reqObj = reqObj;
        me._adjusting = false;
        me._hasSubscribed = true;
    },
    unsubscribe: function() {
        var me = this;
        
        me._hasSubscribed = false;
        me._streamWl = false;
        conn.unsubscribeTransaction('listenTrackerRecord');
    },
    focusSearchBox: function() {
        focusManager.focusSearchbox(this.compRef.valueTf);
    }
});

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
    bkRankGridCol: 'rank,bkCode,bkName,totalVal,valPc,buyVal,sellVal,netVal,crossVal,blockVal,trade',
    bkRankGridCol_JK: 'rank,bkCode,bkName,totalVol,totalVal,totalFreq,buyVol,buyVal,buyFreq,sellVol,sellVal,sellFreq,netVal,netVol,dBuyVol,dBuyVal,dBuyFreq,dSellVol,dSellVal,dSellFreq,dNetVal,dNetVol,fBuyVol,fBuyVal,fBuyFreq,fSellVol,fSellVal,fSellFreq,fNetVal,fNetVol',
    bkTranGridCol: {
        'b': 'rank,stkCode,secCode,buyVol,buyAvg,buyVal,valPc',
        's': 'rank,stkCode,secCode,sellVol,sellAvg,sellVal,valPc'
    },
    bkTranGridCol_JK: {
        'b': 'rank,stkCode,buyVol,buyVal,buyFreq,dBuyVol,dBuyVal,dBuyFreq,fBuyVol,fBuyVal,fBuyFreq',
        's': 'rank,stkCode,sellVol,sellVal,sellFreq,dSellVol,dSellVal,dSellFreq,fSellVol,fSellVal,fSellFreq'
    },
    bkCounterGridCol: {
        'b': 'rank,bkCode,bkName,buyVol,buyAvg,buyVal,valPc',
        's': 'rank,bkCode,bkName,sellVol,sellAvg,sellVal,valPc'
    },
    bkCounterGridCol_JK: {
        'b': 'rank,bkCode,bkName,buyVol,buyVal,buyFreq,dBuyVol,dBuyVal,dBuyFreq,fBuyVol,fBuyVal,fBuyFreq',
        's': 'rank,bkCode,bkName,sellVol,sellVal,sellFreq,dSellVol,dSellVal,dSellFreq,fSellVol,fSellVal,fSellFreq'
    },
    refreshScreen: true,
    initComponent: function() {
        var me = this;

        me.exch = exchangecode;
        me.isJK = me.exch.indexOf('JK') > -1;
        
        // calculate the min date for start date picker
        var curDate = new Date();
        if (N2N_CONFIG.prevDayLimit) {
            me._minDate = new Date();
            me._minDate.setDate(curDate.getDate() - N2N_CONFIG.prevDayLimit);
        }
        
        me._createUIItems();
        Ext.apply(me, {
            items: [me.compRef.mainCt],
            layout: 'fit',
            title: languageFormat.getLanguage(11060, 'Broker Info'),
            keyEnabled: N2N_CONFIG.keyEnabled,
            plugins: ['freemask'],
            listeners: {
                afterrender: function() {
                    var compTitle = languageFormat.getLanguage(11060, 'Broker Info') + ' [' + me.exch + ']';
                    n2nLayoutManager.updateTitle(me, compTitle);

                    me.getBrokerInfo();
                },
                beforedestroy: function() {
                    me._stopRefreshTask();
                }
            }
        });

        me.callParent(arguments);
    },
    switchRefresh: function() {
        var me = this;

        if (me._needReload) {
            me._needReload = false;
            if (me.bkMode === 'bkCounter') {
                me.getBrokerInfo();
            }
        }
    },
    _createUIItems: function() {
        var me = this;

        me.createBkRankGrid();
        me.createBkTranGrid();
        me.createBkCounterGrid();

        me.compRef.mainCt = Ext.create('Ext.tab.Panel', {
            width: '100%',
            items: [
                me.compRef.bkRankGrid,
                me.compRef.btCt,
                me.compRef.bcCt
            ],
            activeTab: 0,
            listeners: {
                tabchange: function(thisTb, newTab, oldTab) {
                    me.setBkMode(newTab.bkMode);
                }
            }
        });

    },
    activateBrokerActivities: function(record, startDate, endDate, transFilter) {
        var me = this;

        if (record) {
            // sync date range
            me.compRef.btStartDate.setValue(startDate);
            me.compRef.btEndDate.setValue(endDate);
            me.compRef.btTranFilter.setValue(transFilter);

            me.compRef.mainCt.setActiveTab(1);
            me.compRef.btFilter.setValue(record.get('bkCode'));
            /// pass date
            me.getBrokerInfo();
        }
    },
    activateBrokerCounter: function(record, startDate, endDate, transFilter) {
        var me = this;

        if (record) {
            me.compRef.bcStartDate.setValue(startDate);
            me.compRef.bcEndDate.setValue(endDate);
            me.compRef.bcTranFilter.select(transFilter);

            me.compRef.mainCt.setActiveTab(2);
            me._updateCounter(record.get('stkCode'), record.get('secCode'));
            /// pass date
            me.getBrokerInfo();
        }
    },
    createBkRankGrid: function() {
        var me = this;

        me.compRef.brTranFilter = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: languageFormat.getLanguage(11064, 'Filter by'),
            labelWidth: 60,
            width: 200,
            listConfig: {
                minWidth: 135
            },
            matchFieldWidth: false,
            hidden: me.isJK,
            store: {
                fields: ['value', 'label'],
                data: me.getTransFilterList()
            },
            displayField: 'label',
            valueField: 'value',
            value: 'all',
            editable: false,
            style: 'margin-left: 5px',
            queryMode: 'local'
        });

        me.compRef.brStartDate = Ext.create('Ext.form.field.Date', {
            value: new Date(),
            maxValue: new Date(),
            editable: false,
            format: 'd/m/Y',
            width: 100,
            style: 'margin-left: 5px',
            vtype: 'daterange',
            hidden: me.isJK,
            minValue: me._minDate
        });
        
        me.compRef.brEndDate = Ext.create('Ext.form.field.Date', {
            value: new Date(),
            maxValue: new Date(),
            editable: false,
            format: 'd/m/Y',
            width: 100,
            style: 'margin-left: 5px',
            vtype: 'daterange',
            hidden: me.isJK
        });

        // set start/end date for daterange vtype
        me.compRef.brStartDate.endDateField = me.compRef.brEndDate;
        me.compRef.brEndDate.startDateField = me.compRef.brStartDate;
        
        me.compRef.brRefreshBt = Ext.create('Ext.button.Button', {
            text: languageFormat.getLanguage(10008, 'Refresh'),
            tooltip: languageFormat.getLanguage(10008, 'Refresh'),
            iconCls: 'icon-reset',
            style: 'margin-left: 5px',
            handler: function() {
                me.getBrokerInfo();
            }
        });

        var tbarItems = [me.compRef.brTranFilter, me.compRef.brStartDate, me.compRef.brEndDate, me.compRef.brRefreshBt, '->'];

        if (N2N_CONFIG.autoWidthButton) {
            me.compRef.brFitBtn = Ext.create('Ext.button.Button', {
                text: languageFormat.getLanguage(20664, 'Fit columns'),
                tooltip: languageFormat.getLanguage(20664, 'Fit columns'),
                iconCls: 'icon-fitcolumn',
                handler: function() {
                    helper.autoSizeGrid(me.compRef.bkRankGrid);
                }
            });

            tbarItems.push(me.compRef.brFitBtn);
        }

        me.compRef.bkRankGrid = Ext.create('Ext.grid.Panel', {
            store: {
                fields: ['rank', 'bkCode', 'bkName',
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
                ],
                sorters: [
                    {
                        property: 'totalVal',
                        direction: 'DESC'
                    }
                ]
            },
            columns: me.getBkRankGridCols(),
            title: languageFormat.getLanguage(11061, 'Broker Ranking'),
            bkMode: 'bkRank',
            tbar: {
                items: tbarItems,
                enableOverflow: menuOverflow
            },
            listeners: {
                itemdblclick: function(thisGrid, record, item) {
                    me.activateBrokerActivities(record, me.compRef.brStartDate.getValue(), me.compRef.brEndDate.getValue(), me.compRef.brTranFilter.getValue());
                }
            }
        });

        helper.setGridDefaultSortDirection(me.compRef.bkRankGrid);
    },
    _styleCell: function(meta, value, record, type) {
        var clsArr = [N2NCSS.CellDefault, N2NCSS.FontString];

        if (type === 'n') {
            if (value > 0) {
                type = 'b';
            } else if (value < 0) {
                type = 's';
            }
        }

        if (type === 'b') {
            clsArr.push(N2NCSS.FontUp);
        } else if (type === 's') {
            clsArr.push(N2NCSS.FontDown);
        } else {
            clsArr.push(N2NCSS.FontUnChange);
        }

        meta.css = clsArr.join(' ');
    },
    getBkRankGridCols: function() {
        var me = this;
        var gridCols = [];
        var colStr = me.isJK ? me.bkRankGridCol_JK : me.bkRankGridCol;
        var colArr = colStr.split(',');

        for (var i = 0; i < colArr.length; i++) {
            var colId = colArr[i].trim();
            var col = null;

            switch (colId) {
                case 'rank':
                    col = {
                        text: languageFormat.getLanguage(10014, 'No'),
                        width: 40,
                        dataIndex: 'rank',
                        locked: true,
                        sortable: N2N_CONFIG.brokerInfoNoAsRank,
                        renderer: function(val, meta, rec, rowIndex) {
                            if (!N2N_CONFIG.brokerInfoNoAsRank) {
                                val = rowIndex + 1;
                            }
                            me._styleCell(meta, val, rec);

                            return val;
                        }
                    };
                    break;
                case 'bkCode':
                    col = {
                        text: languageFormat.getLanguage(11068, 'Broker'),
                        width: 60,
                        dataIndex: 'bkCode',
                        locked: true,
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
                            return val;
                        }
                    };
                    break;
                case 'bkName':
                    col = {
                        text: languageFormat.getLanguage(11069, 'BrokerName'),
                        width: 335,
                        dataIndex: 'bkName',
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
                            if (val) {
                                return val;
                            } else {
                                return brokerList.getBrokerName(me.exch, rec.get('bkCode'));
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'b');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 's');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'valPc':
                    col = {
                        text: languageFormat.getLanguage(11127, '%Val'),
                        width: 60,
                        dataIndex: 'mktWeight',
                        align: 'center',
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
                            meta.tdCls = 'nopadding';

                            if (val === '-') {
                                return val;
                            } else {
                                return getColorBar(val, null, 'b', true);
                            }
                        }
                    };
                    break;
                case 'buyVal':
                    col = {
                        text: languageFormat.getLanguage(11071, 'BuyVal'),
                        width: 110,
                        dataIndex: 'buyVal',
                        align: 'right',
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'b');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 's');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'n');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'n');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'b');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 's');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'b');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 's');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'n');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'n');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'b');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 's');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'b');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 's');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'n');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'n');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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

        me.compRef.btFilter = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: languageFormat.getLanguage(11067, 'Broker Code'),
            labelWidth: 70,
            width: 250,
            store: {
                fields: ['bkCode', 'bkName']
            },
            displayField: 'bkName',
            valueField: 'bkCode',
            style: 'margin-left: 5px',
            queryMode: 'local',
            matchFieldWidth: false,
            selectOnFocus: true,
            forceSelection: true,
            labelStyle: 'white-space: nowrap;',
            listConfig: {
                tpl: Ext.create('Ext.XTemplate', // displayed in list
                        '<tpl for=".">',
                        '<div class="x-boundlist-item">{bkCode} ({bkName})</div>',
                        '</tpl>'
                        )
            },
            listeners: {
                select: function () {
                    me.getBrokerInfo();
                }
            }
        });

        me.compRef.btTranFilter = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: languageFormat.getLanguage(11064, 'Filter by'),
            labelWidth: 60,
            width: 200,
            hidden: me.isJK,
            listConfig: {
                minWidth: 135
            },
            matchFieldWidth: false,
            store: {
                fields: ['value', 'label'],
                data: me.getTransFilterList()
            },
            displayField: 'label',
            valueField: 'value',
            value: 'all',
            editable: false,
            style: 'margin-left: 5px',
            queryMode: 'local'
        });

        me.compRef.btStartDate = Ext.create('Ext.form.field.Date', {
            value: new Date(),
            maxValue: new Date(),
            editable: false,
            format: 'd/m/Y',
            width: 100,
            style: 'margin-left: 5px',
            vtype: 'daterange',
            hidden: me.isJK,
            minValue: me._minDate
        });      

        me.compRef.btEndDate = Ext.create('Ext.form.field.Date', {
            value: new Date(),
            maxValue: new Date(),
            editable: false,
            format: 'd/m/Y',
            width: 100,
            style: 'margin-left: 5px',
            vtype: 'daterange',
            hidden: me.isJK
        });

        // set start/end date for daterange vtype
        me.compRef.btStartDate.endDateField = me.compRef.btEndDate;
        me.compRef.btEndDate.startDateField = me.compRef.btStartDate;

        me.compRef.btRefreshBt = Ext.create('Ext.button.Button', {
            text: languageFormat.getLanguage(10008, 'Refresh'),
            tooltip: languageFormat.getLanguage(10008, 'Refresh'),
            iconCls: 'icon-reset',
            style: 'margin-left: 5px',
            handler: function() {
                me.getBrokerInfo();
            }
        });

        var tbarItems = [me.compRef.btFilter, me.compRef.btTranFilter, me.compRef.btStartDate, me.compRef.btEndDate, me.compRef.btRefreshBt, '->'];

        if (N2N_CONFIG.autoWidthButton && !isMobile) {
            me.compRef.btFitBtn = Ext.create('Ext.button.Button', {
                text: languageFormat.getLanguage(20664, 'Fit columns'),
                tooltip: languageFormat.getLanguage(20664, 'Fit columns'),
                iconCls: 'icon-fitcolumn',
                handler: function() {
                    helper.autoSizeGrid(me.compRef.bkTranBuyGrid);
                    helper.autoSizeGrid(me.compRef.bkTranSellGrid);
                }
            });

            tbarItems.push(me.compRef.btFitBtn);
        }

        me.compRef.bkTranBuyGrid = Ext.create('Ext.grid.Panel', {
            title: languageFormat.getLanguage(0, 'Top Buying Stocks'),
            width: '100%',
            flex: 1,
            store: {
                fields: ['rank', 'stkCode', 'secCode',
                    {name: 'buyVol', sortType: 'asInt'},
                    {name: 'buyVal', sortType: 'asFloat'},
                    {name: 'totalVal', sortType: 'asFloat'},
                    {name: 'totalVol', sortType: 'asInt'},
                    {name: 'noTran', sortType: 'asInt'},
                    {name: 'weightValPc', sortType: 'asFloat'},
                    {name: 'mktVolPc', sortType: 'asFloat'},
                    {name: 'mktValPc', sortType: 'asFloat'},
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
                ],
                sorters: [
                    {
                        property: 'buyVal',
                        direction: 'DESC'
                    }
                ]
            },
            columns: me.getBkTranGridCols('b'),
            cls: 'ct-title upper-title buy-title',
            listeners: {
                itemdblclick: function(thisGrid, record, item) {
                    me.activateBrokerCounter(record, me.compRef.btStartDate.getValue(), me.compRef.btEndDate.getValue(), me.compRef.btTranFilter.getValue());
                }
            }
        });

        me.compRef.bkTranSellGrid = Ext.create('Ext.grid.Panel', {
            title: languageFormat.getLanguage(0, 'Top Selling Stocks'),
            width: '100%',
            flex: 1,
            store: {
                fields: ['rank', 'stkCode', 'secCode',
                    {name: 'sellVol', sortType: 'asInt'},
                    {name: 'sellVal', sortType: 'asFloat'},
                    {name: 'totalVal', sortType: 'asFloat'},
                    {name: 'totalVol', sortType: 'asInt'},
                    {name: 'noTran', sortType: 'asInt'},
                    {name: 'weightValPc', sortType: 'asFloat'},
                    {name: 'mktVolPc', sortType: 'asFloat'},
                    {name: 'mktValPc', sortType: 'asFloat'},
                    {name: 'sellAvg', sortType: 'asFloat'},
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
                ],
                sorters: [
                    {
                        property: 'sellVal',
                        direction: 'DESC'
                    }
                ]
            },
            columns: me.getBkTranGridCols('s'),
            cls: 'ct-title upper-title sell-title',
            listeners: {
                itemdblclick: function(thisGrid, record, item) {
                    me.activateBrokerCounter(record, me.compRef.btStartDate.getValue(), me.compRef.btEndDate.getValue(), me.compRef.btTranFilter.getValue());
                }
            }
        });

        helper.setGridDefaultSortDirection(me.compRef.bkTranBuyGrid);
        helper.setGridDefaultSortDirection(me.compRef.bkTranSellGrid);

        me.compRef.btCt = {
            title: languageFormat.getLanguage(11062, 'Broker Transaction'),
            layout: 'vbox',
            items: [
                {
                    xtype: 'toolbar',
                    width: '100%',
                    items: tbarItems,
                    enableOverflow: menuOverflow
                },
                me.compRef.bkTranBuyGrid,
                me.compRef.bkTranSellGrid
            ],
            bkMode: 'bkTran'
        };
    },
    getBkTranGridCols: function(mode) {
        var me = this;
        var gridCols = [];
        var colStr = (me.isJK ? me.bkTranGridCol_JK[mode] : me.bkTranGridCol[mode]) || '';
        var colArr = colStr.split(',');

        for (var i = 0; i < colArr.length; i++) {
            var colId = colArr[i].trim();
            var col = null;
            switch (colId) {
                case 'rank':
                    col = {
                        text: languageFormat.getLanguage(10014, 'No'),
                        width: 40,
                        dataIndex: 'rank',
                        locked: true,
                        sortable: N2N_CONFIG.brokerInfoNoAsRank,
                        renderer: function(val, meta, rec, rowIndex) {
                            if (!N2N_CONFIG.brokerInfoNoAsRank) {
                                val = rowIndex + 1;
                            }
                            me._styleCell(meta, val, rec);

                            return val;
                        }
                    };
                    break;
                case 'stkCode':
                    col = {
                        text: languageFormat.getLanguage(10101, 'Code'),
                        width: 85,
                        dataIndex: 'stkCode',
                        locked: true,
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
                            return val;
                        }
                    };
                    break;
                case 'secCode':
                    col = {
                        text: languageFormat.getLanguage(10701, 'Name'),
                        width: 265,
                        dataIndex: 'secCode',
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
                            return val;
                        }
                    };
                    break;
                case 'buyVol':
                    col = {
                        text: languageFormat.getLanguage(11079, 'BuyVol'),
                        width: 100,
                        dataIndex: 'buyVol',
                        align: 'right',
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'b');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'b');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 's');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 's');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'valPc':
                    col = {
                        text: languageFormat.getLanguage(11127, '%Val'),
                        width: 60,
                        dataIndex: 'weightValPc',
                        align: 'center',
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
                            meta.tdCls = 'nopadding';

                            if (val === '-') {
                                return val;
                            } else {
                                return getColorBar(val, null, mode, true);
                            }
                        }
                    };
                    break;
                case 'noTran':
                    col = {
                        text: languageFormat.getLanguage(11077, 'Trade'),
                        width: 60,
                        dataIndex: 'noTran',
                        align: 'right',
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'n');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'n');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'n');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'n');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'n');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'n');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'b');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 's');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'b');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 's');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'b');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 's');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'b');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 's');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'b');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 's');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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

        me.compRef.stkCb = Ext.widget('searchautobox', {
            fieldLabel: languageFormat.getLanguage(10912, 'StkCode'),
            width: 200,
            labelWidth: 60,
            forceSelection: true,
            style: 'margin-left: 5px',
            listeners: {
                select: function(thisCombo, records, e) {
                    me.getBrokerInfo();
                    if (N2N_CONFIG.syncSibling) {
                        var rec = records[0];
                        syncGroupManager.syncAllComps(me, rec.get(fieldStkCode), rec.get(fieldStkName));
                    }                    
                }
            },
            onSearchEnterKey: function (records) {
                if (records.length > 0) {
                    var rec = records[0];
                    me.compRef.stkCb.select(rec);
                    me.getBrokerInfo();
                    if (N2N_CONFIG.syncSibling) {
                        var rec = records[0];
                        syncGroupManager.syncAllComps(me, rec.get(fieldStkCode), rec.get(fieldStkName));
                    }                    
                } else {
                    msgutil.alert(languageFormat.getLanguage(30014, 'Invalid Symbol/Code.'));
                }
            }
        });

        me.compRef.bcTranFilter = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: languageFormat.getLanguage(11064, 'Filter by'),
            labelWidth: 60,
            width: 200,
            hidden: me.isJK,
            listConfig: {
                minWidth: 135
            },
            matchFieldWidth: false,
            store: {
                fields: ['value', 'label'],
                data: me.getTransFilterList()
            },
            displayField: 'label',
            valueField: 'value',
            value: 'all',
            editable: false,
            style: 'margin-left: 5px',
            queryMode: 'local'
        });

        me.compRef.bcStartDate = Ext.create('Ext.form.field.Date', {
            value: new Date(),
            maxValue: new Date(),
            editable: false,
            format: 'd/m/Y',
            width: 100,
            style: 'margin-left: 5px',
            vtype: 'daterange',
            hidden: me.isJK,
            minValue: me._minDate
        });

        me.compRef.bcEndDate = Ext.create('Ext.form.field.Date', {
            value: new Date(),
            maxValue: new Date(),
            editable: false,
            format: 'd/m/Y',
            width: 100,
            style: 'margin-left: 5px',
            vtype: 'daterange',
            hidden: me.isJK
        });

        // set start/end date for daterange vtype
        me.compRef.bcStartDate.endDateField = me.compRef.bcEndDate;
        me.compRef.bcEndDate.startDateField = me.compRef.bcStartDate;

        me.compRef.bcRefreshBt = Ext.create('Ext.button.Button', {
            text: languageFormat.getLanguage(10008, 'Refresh'),
            tooltip: languageFormat.getLanguage(10008, 'Refresh'),
            iconCls: 'icon-reset',
            style: 'margin-left: 5px',
            handler: function() {
                me.getBrokerInfo();
            }
        });

        var tbarItems = [me.compRef.stkCb, me.compRef.bcTranFilter, me.compRef.bcStartDate, me.compRef.bcEndDate, me.compRef.bcRefreshBt, '->'];

        if (N2N_CONFIG.autoWidthButton && !isMobile) {
            me.compRef.bcFitBtn = Ext.create('Ext.button.Button', {
                text: languageFormat.getLanguage(20664, 'Fit columns'),
                tooltip: languageFormat.getLanguage(20664, 'Fit columns'),
                iconCls: 'icon-fitcolumn',
                handler: function() {
                    helper.autoSizeGrid(me.compRef.bkCounterBuyGrid);
                    helper.autoSizeGrid(me.compRef.bkCounterSellGrid);
                }
            });

            tbarItems.push(me.compRef.bcFitBtn);
        }

        me.compRef.bkCounterBuyGrid = Ext.create('Ext.grid.Panel', {
            store: {
                fields: ['rank', 'bkCode', 'bkName',
                    {name: 'buyVal', sortType: 'asFloat'},
                    {name: 'totalVal', sortType: 'asFloat'},
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
                ],
                sorters: [
                    {
                        property: 'buyVal',
                        direction: 'DESC'
                    }
                ]
            },
            columns: me.getBkCounterGridCols('b'),
            title: languageFormat.getLanguage(0, 'Top Buyers'),
            flex: 1,
            width: '100%',
            cls: 'ct-title upper-title buy-title',
            listeners: {
                itemdblclick: function(thisGrid, record, item) {
                    me.activateBrokerActivities(record, me.compRef.bcStartDate.getValue(), me.compRef.bcEndDate.getValue(), me.compRef.bcTranFilter.getValue());
                }
            }
        });

        me.compRef.bkCounterSellGrid = Ext.create('Ext.grid.Panel', {
            store: {
                fields: ['rank', 'bkCode', 'bkName',
                    {name: 'sellVal', sortType: 'asFloat'},
                    {name: 'totalVal', sortType: 'asFloat'},
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
                ],
                sorters: [
                    {
                        property: 'sellVal',
                        direction: 'DESC'
                    }
                ]
            },
            columns: me.getBkCounterGridCols('s'),
            title: languageFormat.getLanguage(0, 'Top Sellers'),
            flex: 1,
            width: '100%',
            cls: 'ct-title upper-title sell-title',
            listeners: {
                itemdblclick: function(thisGrid, record, item) {
                    me.activateBrokerActivities(record, me.compRef.bcStartDate.getValue(), me.compRef.bcEndDate.getValue(), me.compRef.bcTranFilter.getValue());
                }
            }
        });

        helper.setGridDefaultSortDirection(me.compRef.bkCounterBuyGrid);
        helper.setGridDefaultSortDirection(me.compRef.bkCounterSellGrid);

        me.compRef.bcCt = {
            layout: 'vbox',
            items: [
                {
                    xtype: 'toolbar',
                    items: tbarItems,
                    width: '100%',
                    enableOverflow: menuOverflow
                },
                me.compRef.bkCounterBuyGrid,
                me.compRef.bkCounterSellGrid
            ],
            title: languageFormat.getLanguage(0, 'Buyers & Sellers'),
            bkMode: 'bkCounter'
        };
    },
    getBkCounterGridCols: function(mode) {
        var me = this;
        var gridCols = [];
        var colStr = (me.isJK ? me.bkCounterGridCol_JK[mode] : me.bkCounterGridCol[mode]) || '';
        var colArr = colStr.split(',');

        for (var i = 0; i < colArr.length; i++) {
            var colId = colArr[i].trim();
            var col = null;

            switch (colId) {
                case 'rank':
                    col = {
                        text: languageFormat.getLanguage(10014, 'No'),
                        width: 40,
                        dataIndex: 'rank',
                        locked: true,
                        sortable: N2N_CONFIG.brokerInfoNoAsRank,
                        renderer: function(val, meta, rec, rowIndex) {
                            if (!N2N_CONFIG.brokerInfoNoAsRank) {
                                val = rowIndex + 1;
                            }
                            me._styleCell(meta, val, rec);

                            return val;
                        }
                    };
                    break;
                case 'bkCode':
                    col = {
                        text: languageFormat.getLanguage(11068, 'Broker'),
                        width: 60,
                        dataIndex: 'bkCode',
                        locked: true,
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
                            return val;
                        }
                    };
                    break;
                case 'bkName':
                    col = {
                        text: languageFormat.getLanguage(11069, 'BrokerName'),
                        width: 335,
                        dataIndex: 'bkName',
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
                            if (val) {
                                return val;
                            } else {
                                return brokerList.getBrokerName(me.exch, rec.get('bkCode'));
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'b');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 's');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'n');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'b');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 's');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'n');
                            return formatutils.displayNet(val);
                        }
                    };
                    break;
                case 'buyAvg':
                    col = {
                        text: languageFormat.getLanguage(11090, 'BuyAvg'),
                        width: 100,
                        dataIndex: 'buyAvg',
                        align: 'right',
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
                            return formatutils.formatNumber(val);
                        }
                    };
                    break;
                case 'valPc':
                    col = {
                        text: languageFormat.getLanguage(11127, '%Val'),
                        width: 60,
                        dataIndex: 'weightValPc',
                        align: 'center',
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
                            meta.tdCls = 'nopadding';

                            if (val === '-') {
                                return val;
                            } else {
                                return getColorBar(val, null, mode, true);
                            }
                        }
                    };
                    break;
                case 'totalFreq':
                    col = {
                        text: languageFormat.getLanguage(11103, 'TotalFreq'),
                        width: 60,
                        dataIndex: 'totalFreq',
                        align: 'right',
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'b');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 's');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'b');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 's');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'n');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'n');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'b');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 's');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'b');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 's');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'n');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec, 'n');
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
                        renderer: function(val, meta, rec) {
                            me._styleCell(meta, val, rec);
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
    setBkMode: function(topId) {
        this.bkMode = topId;
    },
    getBrokerList: function(callback) {
        var me = this;
        var bkList = brokerList.getList(me.exch);

        if (bkList) {
            if (!me._bkListLoaded) {
                me.compRef.btFilter.store.loadData(bkList);
            }

            if (typeof callback === 'function') {
                callback();
            } else {
                me.retrievingData = false;
            }
        } else {
            conn.getBrokerList({
                rType: 'bki_list',
                ex: me.exch,
                success: function(data) {
                    if (data) {
                        brokerList.addList(me.exch, data);
                        me.compRef.btFilter.store.loadData(data);
                        me._bkListLoaded = true;

                        if (typeof callback === 'function') {
                            callback();
                        } else {
                            me.retrievingData = false;
                        }

                    }
                }
            });
        }
    },
    getBrokerInfo: function(silent) {
        var me = this;

        me.getBrokerList(function() {
            me.retrievingData = true;

            if (me.bkMode === 'bkTran') {
                me.getBrokerTransaction(silent);
            } else if (me.bkMode === 'bkCounter') {
                me.getBrokerByCounter(silent);
            } else {
                me.getBrokerRanking(silent);
            }
        });
    },
    getBrokerRanking: function(silent) {
        var me = this;

        // date
        var startDate = '';
        if (!me.isJK) {
            startDate = me.compRef.brStartDate.getValue();
        }
        var endDate = '';
        if (!me.isJK) {
            endDate = me.compRef.brEndDate.getValue();
        }

        if (endDate < startDate) {
            return;
        }

        if (silent) {
            me.freeMask.setMsg(true);
        } else {
            helper.setLoading(me.compRef.bkRankGrid, true);
        }        

        conn.getBrokerRanking({
            rType: 'bki_rank',
            ex: me.exch,
            mode: me.compRef.brTranFilter.getValue(),
            fromDate: helper.toDateStr(startDate),
            toDate: helper.toDateStr(endDate),
            success: function(data) {
                if (data) {
                    me.setRankData(data, 'totalVal');
                    me.compRef.bkRankGrid.store.loadData(data);
                    if (silent) {
                        me.freeMask.setMsg(false);
                    } else {
                        helper.setLoading(me.compRef.bkRankGrid, false);
                        setTimeout(function() {
                            helper.selectRow(me.compRef.bkRankGrid, 0, true);
                        }, 5);
                    }
                    me.retrievingData = false;
                    me._setRefreshTask();
                }
            }
        });

    },
    getBrokerTransaction: function(silent) {
        var me = this;
        var bk = me.compRef.btFilter.getValue();

        if (bk) {
            // date
            var startDate = '';
            if (!me.isJK) {
                startDate = me.compRef.btStartDate.getValue();
            }
            var endDate = '';
            if (!me.isJK) {
                endDate = me.compRef.btEndDate.getValue();
            }

            if (endDate < startDate) {
                return;
            }

            // buy grid
            if (silent) {
                me.freeMask.setMsg(true);
            } else {
                helper.setLoading(me.compRef.bkTranBuyGrid, true);
            }

            conn.getBrokerTransaction({
                rType: 'bki_trans',
                ex: me.exch,
                bk: bk,
                mode: me.compRef.btTranFilter.getValue(),
                fromDate: helper.toDateStr(startDate),
                toDate: helper.toDateStr(endDate),
                type: me.isJK ? '' : 'b',
                success: function(data) {
                    if (data) {
                        me.setRankData(data, 'buyVal');
                        me.compRef.bkTranBuyGrid.store.loadData(data);
                        if (silent) {
                            me.freeMask.setMsg(false);
                        } else {
                            helper.setLoading(me.compRef.bkTranBuyGrid, false);
                            setTimeout(function() {
                                helper.selectRow(me.compRef.bkTranBuyGrid, 0, true);
                            }, 5);
                        }

                        me.retrievingData = false;
                        me._setRefreshTask();
                    }
                }
            });

            // sell grid
            if (silent) {
                me.freeMask.setMsg(true);
            } else {
                helper.setLoading(me.compRef.bkTranSellGrid, true);
            }

            conn.getBrokerTransaction({
                rType: 'bki_trans',
                ex: me.exch,
                bk: bk,
                mode: me.compRef.btTranFilter.getValue(),
                fromDate: helper.toDateStr(startDate),
                toDate: helper.toDateStr(endDate),
                type: me.isJK ? '' : 's',
                success: function(data) {
                    if (data) {
                        me.setRankData(data, 'sellVal');
                        me.compRef.bkTranSellGrid.store.loadData(data);
                        if (silent) {
                            me.freeMask.setMsg(false);
                        } else {
                            helper.setLoading(me.compRef.bkTranSellGrid, false);
                            setTimeout(function() {
                                helper.selectRow(me.compRef.bkTranSellGrid, 0, true);
                            }, 5);
                        }

                        me.retrievingData = false;
                        me._setRefreshTask();
                    }
                }
            });
        }
    },
    getBrokerByCounter: function(silent) {
        var me = this;
        var stk = me.compRef.stkCb.getValue();
        /// date

        if (stk) {
            me.firstLoad = false;

            // date
            var startDate = '';
            if (!me.isJK) {
                startDate = me.compRef.bcStartDate.getValue();
            }
            var endDate = '';
            if (!me.isJK) {
                endDate = me.compRef.bcEndDate.getValue();
            }

            if (endDate < startDate) {
                return;
            }

            // buy grid
            if (silent) {
                me.freeMask.setMsg(true);
            } else {
                helper.setLoading(me.compRef.bkCounterBuyGrid, true);
            }

            conn.getBrokerByStock({
                rType: 'bki_stock',
                ex: me.exch,
                stk: stk,
                mode: me.compRef.bcTranFilter.getValue(),
                fromDate: helper.toDateStr(startDate),
                toDate: helper.toDateStr(endDate),
                type: me.isJK ? '' : 'b',
                success: function(data) {
                    if (data) {
                        me.setRankData(data, 'buyVal');
                        me.compRef.bkCounterBuyGrid.store.loadData(data);
                        if (silent) {
                            me.freeMask.setMsg(false);
                        } else {
                            helper.setLoading(me.compRef.bkCounterBuyGrid, false);
                            setTimeout(function() {
                                helper.selectRow(me.compRef.bkCounterBuyGrid, 0, true);
                            }, 5);
                        }

                        me.retrievingData = false;
                        me._setRefreshTask();
                    }
                }
            });

            // sell grid
            if (silent) {
                me.freeMask.setMsg(true);
            } else {
                helper.setLoading(me.compRef.bkCounterSellGrid, true);
            }

            conn.getBrokerByStock({
                rType: 'bki_stock',
                ex: me.exch,
                stk: stk,
                mode: me.compRef.bcTranFilter.getValue(),
                fromDate: helper.toDateStr(startDate),
                toDate: helper.toDateStr(endDate),
                type: me.isJK ? '' : 's',
                success: function(data) {
                    if (data) {
                        me.setRankData(data, 'sellVal');
                        me.compRef.bkCounterSellGrid.store.loadData(data);
                        if (silent) {
                            me.freeMask.setMsg(false);
                        } else {
                            helper.setLoading(me.compRef.bkCounterSellGrid, false);
                            setTimeout(function() {
                                helper.selectRow(me.compRef.bkCounterSellGrid, 0, true);
                            }, 5);
                        }

                        me.retrievingData = false;
                        me._setRefreshTask();
                    }
                }
            });
        }

    },
    _setRefreshTask: function() {
        var me = this;

        // clears previous task if any
        me._stopRefreshTask();

        me.refreshTask = setTimeout(function() {
            if (!me.retrievingData) {
                me.getBrokerInfo(true);
            }
        }, N2N_CONFIG.brokerInfoInterval);
    },
    _stopRefreshTask: function() {
        var me = this;

        if (me.refreshTask) {
            clearTimeout(me.refreshTask);
            me.refreshTask = null;
        }
    },
    setExchange: function(exch) {
        var me = this;

        me.retrievingData = true;
        me.prevExch = me.exch;
        me.exch = exch;
        me.isJK = exch.indexOf('JK') > -1;
        var compTitle = languageFormat.getLanguage(11060, 'Broker Info') + ' [' + me.exch + ']';
        n2nLayoutManager.updateTitle(me, compTitle);

        if (me.exch !== me.prevExch) {
            if (me.isJK) {
                helper.hide(me.compRef.brTranFilter);
                helper.hide(me.compRef.btTranFilter);
                helper.hide(me.compRef.bkTranFilter);
                helper.hide(me.compRef.brStartDate);
                helper.hide(me.compRef.brEndDate);
                helper.hide(me.compRef.btStartDate);
                helper.hide(me.compRef.btEndDate);
                helper.hide(me.compRef.bcStartDate);
                helper.hide(me.compRef.bcEndDate);
            } else {
                helper.show(me.compRef.brTranFilter);
                helper.show(me.compRef.btTranFilter);
                helper.show(me.compRef.bcTranFilter);
                helper.show(me.compRef.brStartDate);
                helper.show(me.compRef.brEndDate);
                helper.show(me.compRef.btStartDate);
                helper.show(me.compRef.btEndDate);
                helper.show(me.compRef.bcStartDate);
                helper.show(me.compRef.bcEndDate);
            }

            if (me.compRef.bkRankGrid.rendered) {
                me.compRef.bkRankGrid.store.loadData([]);
                me.compRef.bkRankGrid.reconfigure(null, me.getBkRankGridCols());
            }
            if (me.compRef.bkTranBuyGrid.rendered) {
                me.compRef.bkTranBuyGrid.store.loadData([]);
                me.compRef.bkTranBuyGrid.reconfigure(null, me.getBkTranGridCols('b'));
            }
            if (me.compRef.bkTranSellGrid.rendered) {
                me.compRef.bkTranSellGrid.store.loadData([]);
                me.compRef.bkTranSellGrid.reconfigure(null, me.getBkTranGridCols('s'));
            }
            if (me.compRef.bkCounterBuyGrid.rendered) {
                me.compRef.bkCounterBuyGrid.store.loadData([]);
                me.compRef.bkCounterBuyGrid.reconfigure(null, me.getBkCounterGridCols('b'));
            }
            if (me.compRef.bkCounterSellGrid.rendered) {
                me.compRef.bkCounterSellGrid.store.loadData([]);
                me.compRef.bkCounterSellGrid.reconfigure(null, me.getBkCounterGridCols('s'));
            }

            me.compRef.btFilter.store.removeAll();
            me._bkListLoaded = false;
            me.compRef.btFilter.setValue(null);
            me.compRef.stkCb.setValue('');
            me.getBrokerInfo();

        }
    },
    syncBuffer: function(stkcode, stkname) {
        var me = this;

        if (me.bkMode === 'bkCounter') {
            me._updateCounter(stkcode, stkname);
            me._needReload = true;
        }

    },
    activateSync: function(stkcode, stkname) {
        var me = this;

        if (me.bkMode === 'bkCounter') {
            me._updateCounter(stkcode, stkname);
            me.getBrokerInfo();
        }

    },
    _updateCounter: function(stkcode, stkname) {
        var me = this;

        var rec = {};
        rec[fieldStkCode] = stkcode;
        rec[fieldStkName] = stkname;

        me.compRef.stkCb.store.loadData([rec]);
        me.compRef.stkCb.setValue(stkcode);
    },
    focusSearchBox: function() {
        var me = this;

        if (me.bkMode === 'bkTran') {
            focusManager.focusSearchbox(me.compRef.btFilter);
        } else if (me.bkMode === 'bkCounter') {
            focusManager.focusSearchbox(me.compRef.stkCb);
        }
    },
    setRankData: function(data, rankField) {
        var rankData = [];

        for (var i = 0; i < data.length; i++) {
            var dt = data[i];
            rankData.push(parseFloat(dt[rankField]));
        }

        rankData.sort(function(a, b) {
            return b - a;
        });

        for (var i = 0; i < data.length; i++) {
            var dt = data[i];
            var rank = rankData.indexOf(parseFloat(dt[rankField]));

            if (rank === -1) {
                rank = 0;
            }
            dt['rank'] = rank + 1;
        }

        return data;
    },
    getTransFilterList: function() {
        var transList = [];
        var configArr = N2N_CONFIG.brokerInfoTransFilterList.split(',');

        for (var i = 0; i < configArr.length; i++) {
            var conf = configArr[i];

            switch (conf.toLowerCase()) {
                case 'all':
                    transList.push({value: 'all', label: languageFormat.getLanguage(11065, 'All Transactions')});
                    break;
                case 'nocross':
                    transList.push({value: 'noCross', label: languageFormat.getLanguage(11066, 'Without Crosses')});
                    break;
                case 'noblock':
                    transList.push({value: 'noBlock', label: languageFormat.getLanguage(11078, 'Without Blocks')});
                    break;
                case 'nocrossblock':
                    transList.push({value: 'noCrossBlock', label: languageFormat.getLanguage(11128, 'Without Crosses & Blocks')});
                    break;
            }
        }

        return transList;
    }
});

Ext.define('TCPlus.view.quote.WorldIndices', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.worldindices',
    type: 'wi',
    compRef: {},
    winConfig: {
        width: 840,
        height: 405
    },
    savingComp: true,
    feedScreen: true,
    stkcodes: [],
    initComponent: function() {
        var me = this;
        me.exch = 'WIDX';

        me._createUIItems();
        Ext.apply(me, {
            title: languageFormat.getLanguage(20158, 'World Indices'),
            header: false,
            store: {
                fields: [
                    {name: fieldStkCode, sortType: 'asUCString'},
                    {name: fieldStkName, sortType: 'asUCString'},
                    {name: fieldOpen, sortType: 'asFloat'},
                    {name: fieldPrev, sortType: 'asFloat'},
                    {name: fieldHigh, sortType: 'asFloat'},
                    {name: fieldLow, sortType: 'asFloat'},
                    {name: fieldChange, sortType: 'asFloat'},
                    {name: fieldChangePer, sortType: 'asFloat'},
                    {name: fieldTime, sortType: 'asUCString'}
                ]
            },
            columns: me._getColumns(),
            listeners: {
                afterrender: function() {
                    me.loadMarketData();
                },
                beforedestroy: function() {
                    me.unsubscribe();
                },
                resize: function() {
                    if (me.bufferedRenderer && me.didSelect) {
                        helper.reselectRow(me);
                    }
                },
                itemdblclick: function(thisGrid, record, item) {
                    me._openAnalysisChart(record);
                },
                itemclick: function(gridView, record) {
                    if (syncGroupManager.isSyncComp(me.type) && syncGroupManager.isSyncEnabled(me.type)) {
                        var stkCode = record.get(fieldStkCode);
                        var stkName = record.get(fieldStkName);

                        if (stkCode) {
                            // analysis chart
                            syncGroupManager.syncFirstComp(me, n2ncomponents.analysisCharts, function() {
                                createAnalysisChartPanel(stkCode, stkName);
                            }, stkCode, stkName);
                        }
                    }
                }
            }
        });
        me.callParent(arguments);
    },
    _openAnalysisChart: function(record) {
        var stkCode = record.get(fieldStkCode);
        var stkName = record.get(fieldStkName);
        createAnalysisChartPanel(stkCode, stkName);
    },
    _getColumns: function() {
        var me = this;

        var cols = [
            {
                text: languageFormat.getLanguage(10101, 'Code'),
                dataIndex: fieldStkCode,
                sortable: true,
                locked: true,
                width: 70,
                hidden: true,
                renderer: function(value, meta, record) {
                    me._setFieldColor(value, meta, record, 'str');
                    if (value) {
                        value = stockutil.getStockName(value);
                    }

                    return value;
                }
            },
            {
                text: languageFormat.getLanguage(21023, 'Index'),
                dataIndex: fieldStkName,
                sortable: true,
                locked: true,
                width: 190,
                renderer: function(value, meta, record) {
                    me._setFieldColor(value, meta, record, 'str');
                    if (value) {
                        value = stockutil.getStockName(value);
                    }

                    return value;
                }
            },
            {
                text: languageFormat.getLanguage(10104, 'Open'),
                dataIndex: fieldOpen,
                sortable: true,
                lockable: false,
                width: 90,
                align: 'right',
                renderer: function(value, meta, record) {
                    me._setFieldColor(value, meta, record, 'prc');

                    return formatutils.formatNumber(value);
                }
            },
            {
                text: languageFormat.getLanguage(10103, 'Close'),
                dataIndex: fieldPrev,
                sortable: true,
                lockable: false,
                width: 90,
                align: 'right',
                renderer: function(value, meta, record) {
                    me._setFieldColor(value, meta, record, 'prc');

                    return formatutils.formatNumber(value);
                }
            },
            {
                text: languageFormat.getLanguage(10107, 'High'),
                dataIndex: fieldHigh,
                sortable: true,
                lockable: false,
                width: 90,
                align: 'right',
                renderer: function(value, meta, record) {
                    me._setFieldColor(value, meta, record, 'prc');

                    return formatutils.formatNumber(value);
                }
            },
            {
                text: languageFormat.getLanguage(10108, 'Low'),
                dataIndex: fieldLow,
                sortable: true,
                lockable: false,
                width: 90,
                align: 'right',
                renderer: function(value, meta, record) {
                    me._setFieldColor(value, meta, record, 'prc');

                    return formatutils.formatNumber(value);
                }
            },
            {
                text: languageFormat.getLanguage(10115, 'Chg'),
                dataIndex: fieldChange,
                sortable: true,
                lockable: false,
                width: 90,
                align: 'right',
                renderer: function(value, meta, record) {
                    me._setFieldColor(value, meta, record, 'chg');

                    return formatutils.formatNumber(value);
                }
            },
            {
                text: languageFormat.getLanguage(10116, 'Chg%'),
                dataIndex: fieldChangePer,
                sortable: true,
                lockable: false,
                width: 90,
                align: 'right',
                renderer: function(value, meta, record) {
                    me._setFieldColor(value, meta, record, 'chg');

                    return formatutils.formatNumber(value);
                }
            },
            {
                text: languageFormat.getLanguage(10123, 'Time'),
                dataIndex: fieldTime,
                sortable: true,
                lockable: false,
                width: 90,
                align: 'right',
                renderer: function(value, meta, record) {
                    me._setFieldColor(value, meta, record, 'str');
                    if (value == 0) {
                        value = '';
                    }

                    return value;
                }
            }
        ];

        return cols;
    },
    getFieldList: function() {
        return [
            fieldStkCode,
            fieldStkName,
            fieldOpen,
            fieldPrev,
            fieldHigh,
            fieldLow,
            fieldTime,
            fieldLacp,
            fieldLast,
            fieldChange, 
            fieldChangePer
        ];
    },
    _createUIItems: function() {
        var me = this;
        var tbarItems = [];
        var markets = conn.getMarketList(me.exch);

        // create regions buttons
        for (var i = 0; i < markets.length; i++) {
            var mkt = markets[i];

            // skip index
            if (mkt.marketCode != 2000) {
                var mktBtn = Ext.create('widget.button', {
                    text: cleanName(mkt.marketName),
                    mkt: mkt.marketCode,
                    toggleGroup: 'marketbutton',
                    pressed: !me.activeMarket,
                    allowDepress: false,
                    handler: function(thisBtn) {
                        me.activeMarket = thisBtn.mkt;
                        me.loadMarketData();
                    }
                });

                if (!me.activeMarket) {
                    me.activeMarket = mkt.marketCode;
                }

                tbarItems.push(mktBtn);
            }
        }

        tbarItems.push('->');
        me.compRef.anChart = Ext.create('Ext.button.Button', {
            iconCls: 'icon-chart3',
            tooltip: languageFormat.getLanguage('20102', 'Analysis chart'),
            handler: function() {
                var rec = me.getSelectionModel().getSelection();
                if (rec.length > 0) {
                    var record = rec[0];
                    me._openAnalysisChart(record);
                }
            }
        });
        tbarItems.push(me.compRef.anChart);
                  
        // add toolbar items
        me.tbar = tbarItems;
    },
    _setFieldColor: function(value, meta, record, fieldType) {
        var me = this;
        var clsArr = [N2NCSS.CellDefault, N2NCSS.FontString];

        switch (fieldType) {
            case 'str':
                clsArr.push(N2NCSS.FontColorString);

                break;
            case 'chg':
                if (value > 0) {
                    clsArr.push(N2NCSS.FontUp);
                } else if (value < 0) {
                    clsArr.push(N2NCSS.FontDown);
                } else {
                    clsArr.push(N2NCSS.FontUnChange);
                }

                break;
            case 'prc':
                var lacp = record.get(fieldLacp);

                if (lacp && value && value != 0) {
                    if (value > lacp) {
                        clsArr.push(N2NCSS.FontUp);
                    } else if (value < lacp) {
                        clsArr.push(N2NCSS.FontDown);
                    }
                } else {
                    clsArr.push(N2NCSS.FontUnChange);
                }

                break;
        }

        meta.css = clsArr.join(' ');
    },
    loadMarketData: function(silent) {
        var me = this;

        if (me.activeMarket) {
            if (!silent) {
                helper.setLoading(me, true);
            }
        
            conn.getStockList({
                rType: 'wi_stockList',
                ex: me.exch,
                mkt: me.activeMarket,
                f: me.getFieldList(),
                ef05: [fieldChange, fieldChangePer], // need this or these columns will not be included
                p: 0,
                c: 9999,
                success: function(data) {
                    var stkcodes = [];

                    if (data && data.d) {

                        for (var i = 0; i < data.d.length; i++) {
                            var dt = data.d[i];
                            if (dt[fieldStkCode]) {
                                stkcodes.push(dt[fieldStkCode]);
                            }
                        }
                        resetGridScroll(me);
                        me.store.loadData(data.d);
                        activateRow(me);
                    }

                    // subscribe feed
                    me.stkcodes = stkcodes;
                    me.subscribe();

                    if (!silent) {
                        helper.setLoading(me, false);
                    }
                }
            });
        }
    },
    _prcCols: [fieldOpen, fieldPrev, fieldHigh, fieldLow, fieldLacp, fieldLast],
    _chgCols: [fieldChange, fieldChangePer],
    updateFeedRecord: function(dataObj) {
        var me = this;
        if (me.inactive) {
            return;
        }
        
        try {
            if (me.store.getCount() === 0) {
                return;
            }

            var columns = helper.getGridColumns(me);
            var stkcode = dataObj[fieldStkCode];
            var record = me.store.findRecord(fieldStkCode, stkcode);

            if (record) {
                var rowIndex = me.store.indexOf(record);
                var lacp = record.get(fieldLacp);

                for (var fid in dataObj) {
                    var colIndex = helper.getColumnIndex(columns, 'dataIndex', fid);
                    var blinkUpDown = false;

                    if (colIndex > -1 && !columns[colIndex].hidden) {
                        var oldValue = record.get(fid);
                        var newValue = dataObj[fid];
                        var cssCls = '';

                        if (oldValue != newValue) {
                            newValue = String(newValue);
                            // update data to storage
                            record.data[fid] = newValue;

                            if (me._prcCols.indexOf(fid) > -1) {
                                cssCls = N2NCSS.FontUnChange;
                                if (newValue && newValue != 0) {
                                    if (newValue > lacp) {
                                        cssCls = N2NCSS.FontUp;
                                    } else {
                                        cssCls = N2NCSS.FontDown;
                                    }

                                    blinkUpDown = true;
                                    newValue = formatutils.formatNumber(newValue);
                                }

                            } else if (me._chgCols.indexOf(fid) > -1) {
                                if (newValue > 0) {
                                    cssCls = N2NCSS.FontUp;
                                } else if (newValue < 0) {
                                    cssCls = N2NCSS.FontDown;
                                }
                            } else if (fid == fieldTime) {
                                if (newValue != 0) {
                                    newValue = formatutils.formatutils.procDateValue(newValue);
                                }
                            }

                            N2NUtil.updateCell(me, rowIndex, colIndex, newValue, cssCls);
                            if (blinkUpDown) {
                                if (newValue > oldValue) {
                                    Blinking.setBlink(me, rowIndex, colIndex, "up");
                                } else if (newValue < oldValue) {
                                    Blinking.setBlink(me, rowIndex, colIndex, "down");
                                }
                            } else {
                                Blinking.setBlink(me, rowIndex, colIndex, "unchange");
                            }
                        }
                    }
                }
            }

        } catch (e) {
        }
    },
    subscribe: function() {
        var me = this;

        if (!N2N_CONFIG.activeSub || helper.activeView(me)) {
            me.firstLoad = false;
            Storage.refresh();
            conn.subscribeWorldIndices(me.stkcodes, me.getFieldList());
            me.inactive = false;
        }
    },
    unsubscribe: function() {
        conn.unsubscribeWorldIndices();
    },
    switchRefresh: function(silent) {
        if (N2N_CONFIG.activeSub) {
            this.loadMarketData(silent);
        }
    }
});

function getCommission(value, commRate) {
    var mincom1 = parseFloat(calPreference.get('mincom1', 20));
    // var mincom2 = parseFloat(calPreference.get('mincom2', 135));

    // get actual commission
    var comm = value * commRate;
    
    /*
    if (comm < mincom2) {
        // get commission @ 0.015
        var comm15 = value * 0.015;

        if (comm15 > mincom2) {
            comm = mincom2;
        } else {
            if (comm15 < mincom1) {
                comm = mincom1;
            } else {
                comm = comm15;
            }
        }
    }
    */
    
    // ABACUS's request for simple calculation
    if (comm < mincom1) {
        comm = mincom1;
    }
   

    return comm;
}
    
/* Trade calculator */
Ext.define('TCPlus.view.TradeCal', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tradecal',
    type: 'tc',
    savingComp: true,
    compRef: {},
    rowCount: 10,
    _profits: {},
    initComponent: function() {
        var me = this;
        me._extraFieldCount = N2N_CONFIG.tradeCalExtraField.length;
        me._extraWidth = me._extraFieldCount * 100;

        if (!me.winConfig) {
            me.winConfig = {
                width: 500 + me._extraWidth,
                height: 352
            };
        }

        me.compRef.totalProfitEl = Ext.widget('textfield', {
            fieldLabel: languageFormat.getLanguage(31613, 'Net Profit'),
            labelWidth: 60,
            width: 185,
            editable: false,
            cls: 'readonly-input',
            fieldStyle: 'font-weight:bold;font-size:0.95em'
        });
        me.compRef.totalProfitPerEl = Ext.widget('textfield', {
            width: 65,
            style: 'margin-right: 5px;',
            fieldStyle: 'font-weight:bold;font-size:0.95em',
            cls: 'readonly-input',
            editable: false
        });
        me.compRef.totalDetailEl = Ext.widget('button', {
            text: languageFormat.getLanguage(20285, 'Detail'),
            tooltip: languageFormat.getLanguage(20285, 'Detail'),
            iconCls: 'icon-detail',
            cls: 'fix_btn',
            handler: function() {
                me.viewSummary();
            }
        });

        Ext.apply(me, {
            title: languageFormat.getLanguage(31600, 'Trade Calculator'),
            header: false,
            layout: {
                type: 'table',
                columns: 6 + me._extraFieldCount,
                tableAttrs: {
                    style: {
                        width: 500 + me._extraWidth
                    },
                    cls: 'tradecal'
                },
                tdAttrs: {
                    style: {
                        padding: '0px 0px 0px 5px'
                    }
                }
            },
            autoScroll: true,
            border: false,
            items: me._createTableItems(me.rowCount),
            tbar: {
                enableOverflow: menuOverflow,
                autoScroll: menuAutoScroll,
                items: [
                    {
                        xtype: 'combo',
                        fieldLabel: languageFormat.getLanguage(31604, 'Commission'),
                        width: 135,
                        labelWidth: 75,
                        store: [0.25, 0.50, 0.75, 1, 1.5],
                        value: calPreference.get('comm', 0),
                        editable: false,
                        listConfig: {
                            minWidth: 30
                        },
                        listeners: {
                            change: function(thisCb, newValue) {
                                calPreference.set('comm', newValue);
                                calPreference.save();

                                me.calculateAll();
                            }
                        }
                    },
                    {
                        xtype: 'label',
                        text: '%'
                    },
                    {
                        xtype: 'container',
                        flex: 1,
                        maxWidth: 65
                    },
                    me.compRef.totalProfitEl,
                    me.compRef.totalProfitPerEl,
                    me.compRef.totalDetailEl
                ]
            },
            bbar: {
                items: [
                    {
                        text: languageFormat.getLanguage(20601, 'Settings'),
                        tooltip: languageFormat.getLanguage(20601, 'Settings'),
                        iconCls: 'icon-columnsetting',
                        handler: function() {
                            me._openSetting();
                        }
                    },
                    '->',
                    {
                        text: languageFormat.getLanguage(31603, 'Clear All'),
                        tooltip: languageFormat.getLanguage(31603, 'Clear All'),
                        iconCls: 'icon-clear',
                        handler: function() {
                            msgutil.confirm(languageFormat.getLanguage(31635, 'Are you sure to clear all?'), function(btn) {
                                if (btn == 'yes') {
                                    me.clearAll();
                                }
                            });
                        }
                    }
                ]
            },
            listeners: {
                afterrender: function() {
                    // me.loadData();
                },
                beforedestroy: function() {
                    if (me.tradeSummary) {
                        me.tradeSummary.up().destroy();
                    }
                    if (me.tradeDetail) {
                        me.tradeDetail.up().destroy();
                    }
                }
            }
        });

        me.callParent(arguments);
    },
    _createTableItems: function(count) {
        var me = this;

        var tbItems = [
            me._createLabel(languageFormat.getLanguage(20177, 'Stock')),
            me._createLabel(languageFormat.getLanguage(31601, '# of Shares')),
            me._createLabel(languageFormat.getLanguage(20625, 'Buy Price')),
            me._createLabel(languageFormat.getLanguage(20630, 'Sell Price'))
        ];
        
        if (me._checkConfig("buyamount")) {
            tbItems.push(me._createLabel(languageFormat.getLanguage(31645, 'Buy Amount')));
        }
        if (me._checkConfig("sellamount")) {
            tbItems.push(me._createLabel(languageFormat.getLanguage(31646, 'Sell Amount')));
        }
        
        tbItems.push(me._createLabel(languageFormat.getLanguage(31602, 'Profit')));
        
        if (me._checkConfig("profitper")) {
            tbItems.push(me._createLabel(languageFormat.getLanguage(31644, 'Profit %')));
        }
        
        tbItems.push(me._createLabel(''));

        for (var i = 0; i < count; i++) {
            me.compRef['code' + i] = Ext.widget('combobox', {
                width: '100%',
                _rowId: i,
                store: {
                    fields: [
                        {name: fieldStkCode},
                        {name: fieldStkName},
                        {name: 'resultText', convert: function(value, record) {
                                var resultText = stockutil.getStockPart(record.get(fieldStkName)) + ' (' + record.get(fieldStkCode) + ')';
                                return htmlDecode(resultText);
                            }
                        }
                    ]
                },
                listConfig: {
                    loadingText: languageFormat.getLanguage(10018, 'Loading'),
                    maxHeight: 150
                },
                matchFieldWidth: false,
                valueField: fieldStkCode,
                displayField: fieldStkCode,
                typeAhead: true,
                typeAheadDelay: 200,
                hideTrigger: true,
                minChars: 1,
                queryMode: 'remote',
                forceSelection: true,
                enableKeyEvents: true,
                selectOnFocus: true,
                tpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '<div class="x-boundlist-item">{resultText}</div>',
                        '</tpl>'
                        ),
                displayTpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '{33}',
                        '</tpl>'
                        ),
                listeners: {
                    focus: function(thisTf) {
                        me._calculateRow(thisTf);
                    },
                    select: function(thisTf) {
                        me._calculateRow(thisTf);
                    },
                    afterrender: function(thisCb) {
                        var task = new Ext.util.DelayedTask(function() {
                            var cbValue = thisCb.getRawValue();
                            if (cbValue != "") {
                                conn.searchStock({
                                    ex: exchangecode,
                                    k: cbValue,
                                    field: [fieldStkCode, fieldStkName],
                                    mkt: conn.getMarketCode(exchangecode, '[All Stocks]'),
                                    success: function(obj) {
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
                    }
                }
            });

            me.compRef['share' + i] = me._createTextbox({
                width: '100%',
                _rowId: i,
                _decNum: 0,
                // reset maskRe as already exists at roundQtyCommon vtype
                maskRe: null,
                vtype: 'roundQtyCommon',
                fieldCls: 'num-field',
                listeners: {
                    blur: function (thisTf) {
                        var val = thisTf.getRawValue();
                        val = jsutil.getNumFromRound(val);
                        thisTf.setNum(val);
                        
                        me._calculateRow(thisTf);
                    },
                    change: function () {
                        return null;
                    }
                }
            });
            
            me.compRef['buyPrice' + i] = me._createTextbox({
                width: '100%',
                _rowId: i,
                _decNum: 4,
                listeners: me._getRowListeners()
            });

            me.compRef['sellPrice' + i] = me._createTextbox({
                width: '100%',
                _rowId: i,
                _decNum: 4,
                listeners: me._getRowListeners()
            });

            if (me._checkConfig("buyamount")) {
                me.compRef['buyAmount' + i] = Ext.widget('textfield', {
                    width: '100%',
                    fieldStyle: 'text-align:right;font-weight:bold;font-size:0.95em',
                    editable: false,
                    cls: 'readonly-input',
                    _rowId: i
                });
            }

            if (me._checkConfig("sellamount")) {
                me.compRef['sellAmount' + i] = Ext.widget('textfield', {
                    width: '100%',
                    fieldStyle: 'text-align:right;font-weight:bold;font-size:0.95em',
                    editable: false,
                    cls: 'readonly-input',
                    _rowId: i
                });
            }

            me.compRef['profit' + i] = Ext.widget('textfield', {
                width: '100%',
                fieldStyle: 'text-align:right;font-weight:bold;font-size:0.95em',
                editable: false,
                cls: 'readonly-input',
                _rowId: i
            });
            
            if (me._checkConfig("profitper")) {
                me.compRef['profitPercent' + i] = Ext.widget('textfield', {
                    width: '100%',
                    fieldStyle: 'text-align:right;font-weight:bold;font-size:0.95em',
                    editable: false,
                    cls: 'readonly-input',
                    _rowId: i
                });
            }

            me.compRef['detail' + i] = Ext.widget('button', {
                text: languageFormat.getLanguage(20285, 'Detail'),
                tooltip: languageFormat.getLanguage(20285, 'Detail'),
                iconCls: 'icon-detail',
                style: 'margin-top: -5px',
                _rowId: i,
                cls: 'fix_btn',
                handler: function(thisBt) {
                    var rowId = thisBt._rowId;

                    var code = me.compRef['code' + rowId].getValue();
                    if (code) {
                        code = code.trim();
                    }

                    var share = parseFloat(me.compRef['share' + rowId].getNum());
                    var buyPrice = parseFloat(me.compRef['buyPrice' + rowId].getNum());
                    var sellPrice = parseFloat(me.compRef['sellPrice' + rowId].getNum());

                    me.viewTradeDetail({
                        code: code,
                        share: share,
                        buyPrice: buyPrice,
                        sellPrice: sellPrice
                    });
                }
            });

            tbItems.push(
                    me.compRef['code' + i],
                    me.compRef['share' + i],
                    me.compRef['buyPrice' + i],
                    me.compRef['sellPrice' + i]
                    );
                        
            if (me.compRef['buyAmount' + i]) {
                tbItems.push(me.compRef['buyAmount' + i]);
            }
            if (me.compRef['sellAmount' + i]) {
                tbItems.push(me.compRef['sellAmount' + i]);
            }
            
            tbItems.push(me.compRef['profit' + i]);
            
            if (me.compRef['profitPercent' + i]) {
                tbItems.push(me.compRef['profitPercent' + i]);
            }
            
            tbItems.push(me.compRef['detail' + i]);
        }
        
        return tbItems;
    },
    saveItems: function() {
        var me = this;

        for (var i = 0; i < me.rowCount; i++) {
            var code = me.compRef['code' + i].getValue();
            if (code) {
                code = code.trim();
            }
            var share = me.compRef['share' + i].getValue();
            var buyPrice = me.compRef['buyPrice' + i].getValue();
            var sellPrice = me.compRef['sellPrice' + i].getValue();


        }
    },
    _createLabel: function(label, extraConf) {
        return Ext.create('Ext.form.Label', Ext.apply({
            text: label
        }, extraConf));
    },
    _getRowListeners: function() {
        var me = this;

        return {
            change: function(thisTf, newValue, oldValue) {
                if (newValue) {
                    newValue = newValue.trim();
                }

                if (newValue != '') {
                    if (isNaN(newValue)) {
                        // revert back to previous value
                        thisTf.setValue(oldValue);
                        return;
                    }
                }
                me._calculateRow(thisTf);
            }
        };
    },
    _calculateRow: function(thisTf) {
        var me = this;

        var rowId = thisTf._rowId;
        if (!me.compRef['code' + rowId]) {
            return;
        }
        var code = me.compRef['code' + rowId].getRawValue();
        var share = parseFloat(me.compRef['share' + rowId].getNum());
        var buyPrice = parseFloat(me.compRef['buyPrice' + rowId].getNum());
        var sellPrice = parseFloat(me.compRef['sellPrice' + rowId].getNum());
        var profitEl = me.compRef['profit' + rowId];
        // Extra field
        var buyAmountEl = me.compRef['buyAmount' + rowId];
        var sellAmountEl = me.compRef['sellAmount' + rowId];
        var profitPercentEl = me.compRef['profitPercent' + rowId];

        if (share > 0 && buyPrice > 0 && sellPrice > 0) {
            var profit = me.calculateProfit(share, buyPrice, sellPrice);

            var pCls = N2NCSS.FontUnChange;
            if (profit.netProfit > 0) {
                pCls = N2NCSS.FontUp;
            } else if (profit.netProfit < 0) {
                pCls = N2NCSS.FontDown;
            }

            if (buyAmountEl) {
                buyAmountEl.setRawValue(me._formatNum(profit.buyAmount, 2));
            }
            if (sellAmountEl) {
                sellAmountEl.setRawValue(me._formatNum(profit.sellAmount, 2));
            }
            if (profitPercentEl) {
                profitPercentEl.removeCls([N2NCSS.FontUnChange, N2NCSS.FontUp, N2NCSS.FontDown]);
                profitPercentEl.addCls(pCls);
                profitPercentEl.setRawValue(me._formatNum(profit.netProfitPer, 2) + '%');
            }

            profitEl.removeCls([N2NCSS.FontUnChange, N2NCSS.FontUp, N2NCSS.FontDown]);
            profitEl.addCls(pCls);
            profitEl.setRawValue(me._formatNum(profit.netProfit, 2));
            // cache calculations
            me._profits[thisTf._rowId] = profit;
        } else {
            profitEl.setRawValue('');
            me._profits[thisTf._rowId] = null;
        }

        if (me.tradeDetail) {
            me.tradeDetail.refresh({
                code: code,
                share: share,
                buyPrice: buyPrice,
                sellPrice: sellPrice
            });
        }
        me.updateSummary();
    },    
    _createTextbox: function(conf) {
        var me = this;

        return Ext.create('Ext.form.field.Text', Ext.merge({
            width: 180,
            fieldStyle: 'text-align:right',
            maskRe: /[0-9.]/,
            _minVal: 0,
            selectOnFocus: true,
            listeners: me._getTfListeners(),
            setNum: function(num) {
                num = jsutil.getNumFromFormat(num);

                if (num != null) {
                    if (this._decNum != null) {
                        num = num.toFixed(this._decNum);
                    }

                    num = formatutils.formatNumber(num);
                    this.setRawValue(num);
                }
            },
            getNum: function() {
                var num = jsutil.getNumFromFormat(this.getRawValue());

                if (num != null && this._decNum != null) {
                    num = num.toFixed(this._decNum);
                }

                return num;
            }
        }, conf));
    },
    _openSetting: function() {
        var me = this;
        var lMargin = '0 0 0 5';
        var tWidth = 180;

        var sccpRateTf = me._createTextbox({
            width: tWidth,
            fieldLabel: languageFormat.getLanguage(31605, 'SCCP Rate'),
            _decNum: 4,
            _defVal: 0
        });
        var advalRateTf = me._createTextbox({
            fieldLabel: languageFormat.getLanguage(31606, 'Ad Valorem Rate'),
            fieldStyle: 'text-align:right',
            _decNum: 4,
            _defVal: 0,
            hidden: !N2N_CONFIG.tradeCalShowAdValorem
        });
        var pseFeeRateTf = me._createTextbox({
            fieldLabel: languageFormat.getLanguage(31647, 'PSE Fee'),
            fieldStyle: 'text-align:right',
            _decNum: 4,
            _defVal: 0,
            hidden: !N2N_CONFIG.tradeCalShowPSEFee
        });
        var vatRateTf = me._createTextbox({
            fieldLabel: languageFormat.getLanguage(31607, 'VAT Rate'),
            _decNum: 2,
            _defVal: 0
        });
        var taxRateTf = me._createTextbox({
            width: tWidth,
            fieldLabel: languageFormat.getLanguage(31608, 'Sale Tax Rate'),
            _decNum: 2,
            _defVal: 0
        });
        var mincomTf = me._createTextbox({
            fieldLabel: languageFormat.getLanguage(31609, 'Minimum Comm.'),
            _decNum: 2,
            _defVal: 0,
            hidden: true
        });

        var tcSettingWin = msgutil.popup({
            title: languageFormat.getLanguage(20601, 'Setting'),
            resizable: false,
            items: {
                layout: {
                    type: 'table',
                    columns: 2
                },
                padding: 5,
                items: [
                    sccpRateTf,
                    {
                        xtype: 'label',
                        text: '%',
                        margin: lMargin
                    },
                    advalRateTf,
                    {
                        xtype: 'label',
                        text: '%',
                        margin: lMargin,
                        hidden: !N2N_CONFIG.tradeCalShowAdValorem
                    },
                    pseFeeRateTf,
                    {
                        xtype: 'label',
                        text: '%',
                        margin: lMargin,
                        hidden: !N2N_CONFIG.tradeCalShowPSEFee
                    },
                    vatRateTf,
                    {
                        xtype: 'label',
                        text: '%',
                        margin: lMargin
                    },
                    taxRateTf,
                    {
                        xtype: 'label',
                        text: '%',
                        margin: lMargin
                    },
                    mincomTf,
                    {
                        xtype: 'label',
                        text: '',
                        margin: lMargin,
                        hidden: true
                    },
                    {
                        xtype: 'button',
                        cls: 'flatbtn',
                        style: 'margin-left: 105px; margin-top: 10x',
                        text: languageFormat.getLanguage(21045, 'Save'),
                        handler: function() {
                            var sccp = sccpRateTf.getNum();
                            var adval = advalRateTf.getNum();
                            var psefee = pseFeeRateTf.getNum();
                            var vat = vatRateTf.getNum();
                            var tax = taxRateTf.getNum();
                            var mincom = mincomTf.getNum();

                            calPreference.set('sccp', sccp);
                            if (N2N_CONFIG.tradeCalShowAdValorem) {
                                calPreference.set('adval', adval);
                            }

                            if (N2N_CONFIG.tradeCalShowPSEFee) {
                                calPreference.set('psefee', psefee);
                            }
                            calPreference.set('vat', vat);
                            calPreference.set('tax', tax);
                            calPreference.set('mincom', mincom);
                            calPreference.save();

                            tcSettingWin.close();

                            me.calculateAll();
                            if (me.tradeDetail) {
                                me.tradeDetail.refresh();
                            }
                        }
                    }
                ],
                listeners: {
                    afterrender: function() {
                        sccpRateTf.setNum(calPreference.get('sccp', 0));
                        if (N2N_CONFIG.tradeCalShowAdValorem) {
                            advalRateTf.setNum(calPreference.get('adval', 0));
                        }
                        if (N2N_CONFIG.tradeCalShowPSEFee) {
                            pseFeeRateTf.setNum(calPreference.get('psefee', 0.005)); // to solve previous user setting issue
                        }
                        vatRateTf.setNum(calPreference.get('vat', 0));
                        taxRateTf.setNum(calPreference.get('tax', 0));
                        mincomTf.setNum(calPreference.get('mincom', 0));
                    }
                }
            }
        });
    },
    _getTfListeners: function() {
        var me = this;

        return {
            change: function(thisTf, newValue, oldValue) {
                if (newValue) {
                    newValue = newValue.trim();
                }

                if (newValue != '') {
                    if (isNaN(newValue)) {
                        // revert back to previous value
                        thisTf.setValue(oldValue);
                        return;
                    }
                }
            },
            focus: function(thisTf) {
                thisTf.resumeEvent('change');

                var num = thisTf.getNum();
                if (num != null) {
                    thisTf.setRawValue(num);
                }
                me._calculateRow(thisTf);
            },
            blur: function(thisTf) {
                var val = thisTf.getRawValue();

                if (val != null) {
                    val = val.trim();
                }

                if (val == '') {
                    if (thisTf._defVal != null) {
                        thisTf.setNum(thisTf._defVal);
                    }
                } else {
                    thisTf.setNum(val);
                }

                // suspend change event when user leaves textbox to accept formatted number otherwise will revert back to unformatted number
                thisTf.suspendEvent('change');
            }
        };
    },
    calculateProfit: function(shares, buyPrice, sellPrice) {

        // config
        var sccp = parseFloat(calPreference.get('sccp', 0)) / 100;
        var adval = parseFloat(calPreference.get('adval', 0)) / 100;
        var vat = parseFloat(calPreference.get('vat', 0)) / 100;
        var tax = parseFloat(calPreference.get('tax', 0)) / 100;
        var mincom = parseFloat(calPreference.get('mincom', 0));
        var comm = parseFloat(calPreference.get('comm', 0)) / 100;

        // buy extension
        var buyEx = shares * buyPrice;

        // buy commission
        var buyComm = getCommission(buyEx, comm);
        
        // buy ad valorem and sccp
        var buyAdval = adval * buyEx;
        var buySccp = sccp * buyEx;

        // buy vat
        var buyVat = vat * buyComm;

        // total buying cost
        var buyCost = buyComm + buyAdval + buySccp + buyVat;

        // total buy amount
        var buyAmount = buyCost + buyEx;

        var sellEx = shares * sellPrice;

        // sell commission
        var sellComm = getCommission(sellEx, comm);

        // sell ad valorem and sccp
        var sellAdval = adval * sellEx;
        var sellSccp = sccp * sellEx;

        // sell vat
        var sellVat = vat * sellComm;

        // sales tax
        var salesTax = tax * sellEx;

        // sell cost
        var sellCost = sellComm + sellAdval + sellSccp + sellVat + salesTax;

        // total sell cost
        var sellAmount = sellEx - sellCost;

        // net profit
        var netProfit = sellAmount - buyAmount;
        
        // net profit %
        var netProfitPer = (netProfit / buyAmount) * 100;
        
        return {
            buyEx: buyEx,
            sellEx: sellEx,
            buyCost: buyCost,
            sellCost: sellCost,
            buyAmount: buyAmount,
            sellAmount: sellAmount,
            netProfit: netProfit,
            netProfitPer: netProfitPer
        };
    },
    updateSummary: function() {
        var me = this;

        var totalBuyEx = 0;
        var totalSellEx = 0;
        var totalBuyCost = 0;
        var totalSellCost = 0;
        var totalBuyAmount = 0;
        var totalSellAmount = 0;

        var emptyProfit = true;
        for (var i in me._profits) {
            var profit = me._profits[i];

            if (profit) {
                emptyProfit = false;
                totalBuyEx += profit.buyEx;
                totalSellEx += profit.sellEx;
                totalBuyCost += profit.buyCost;
                totalSellCost += profit.sellCost;
                totalBuyAmount += profit.buyAmount;
                totalSellAmount += profit.sellAmount;
            }
        }

        me.compRef.totalProfitEl.removeCls([N2NCSS.FontUnChange, N2NCSS.FontUp, N2NCSS.FontDown]);
        me.compRef.totalProfitPerEl.removeCls([N2NCSS.FontUnChange, N2NCSS.FontUp, N2NCSS.FontDown]);

        if (!emptyProfit) {
            var totalNetProfit = totalSellAmount - totalBuyAmount;
            me.compRef.totalProfitEl.setRawValue(formatutils.formatNumber(totalNetProfit, null, null, 2));

            totalNetProfitPer = 0;
            if (totalNetProfit) {
                var totalNetProfitPer = totalNetProfit * 100 / totalBuyAmount;
                me.compRef.totalProfitPerEl.setRawValue(formatutils.formatNumber(totalNetProfitPer, null, null, 2) + '%');
            }

            var pCls = N2NCSS.FontUnChange;
            if (totalNetProfit > 0) {
                pCls = N2NCSS.FontUp;
            } else if (totalNetProfit < 0) {
                pCls = N2NCSS.FontDown;
            }

            me.compRef.totalProfitEl.addCls(pCls);
            me.compRef.totalProfitPerEl.addCls(pCls);

            // cache summary
            me._summary = {
                totalBuyEx: totalBuyEx,
                totalSellEx: totalSellEx,
                totalBuyCost: totalBuyCost,
                totalSellCost: totalSellCost,
                totalBuyAmount: totalBuyAmount,
                totalSellAmount: totalSellAmount,
                totalCost: totalBuyCost + totalSellCost,
                totalNetProfit: totalNetProfit,
                totalNetProfitPer: totalNetProfitPer
            };
        } else {
            me.compRef.totalProfitEl.setRawValue('');
            me.compRef.totalProfitPerEl.setRawValue('');
            me._summary = null;
        }

        if (me.tradeSummary) {
            me.tradeSummary._summary = me._summary;
            me.tradeSummary.refresh();
        }

    },
    loadData: function() {
        var me = this;

    },
    clearAll: function() {
        var me = this;

        for (var i = 0; i < me.rowCount; i++) {
            var codeEl = me.compRef['code' + i];
            var shareEl = me.compRef['share' + i];
            var buyPriceEl = me.compRef['buyPrice' + i];
            var sellPriceEl = me.compRef['sellPrice' + i];
            var profitEl = me.compRef['profit' + i];
            // Extra field
            var buyAmountEl = me.compRef['buyAmount' + i];
            var sellAmountEl = me.compRef['sellAmount' + i];
            var profitPercentEl = me.compRef['profitPercent' + i];

            codeEl.setRawValue('');
            shareEl.setRawValue('');
            buyPriceEl.setRawValue('');
            sellPriceEl.setRawValue('');
            // Avoid null for extra field
            if (buyAmountEl) {
                buyAmountEl.setRawValue('');
            }
            if (sellAmountEl) {
                sellAmountEl.setRawValue('');
            }
            profitEl.setRawValue('');
            if (profitPercentEl) {
                profitPercentEl.setRawValue('');
            }

        }
        me.compRef.totalProfitEl.setRawValue('');
        me.compRef.totalProfitPerEl.setRawValue('');

        me._profits = {};
        me._summary = null;
        if (me.tradeSummary) {
            me.tradeSummary._summary = null;
            me.tradeSummary.refresh();
        }
        if (me.tradeDetail) {
            me.tradeDetail.refresh({});
        }
    },
    calculateAll: function() {
        var me = this;

        for (var i = 0; i < me.rowCount; i++) {
            var share = parseFloat(me.compRef['share' + i].getNum());
            var buyPrice = parseFloat(me.compRef['buyPrice' + i].getNum());
            var sellPrice = parseFloat(me.compRef['sellPrice' + i].getNum());
            var profitEl = me.compRef['profit' + i];
            // Extra fields
            var buyAmountEl = me.compRef['buyAmount' + i];
            var sellAmountEl = me.compRef['sellAmount' + i];
            var profitPercentEl = me.compRef['profitPercent' + i];

            if (share > 0 && buyPrice > 0 && sellPrice > 0) {
                var profit = me.calculateProfit(share, buyPrice, sellPrice);

                var pCls = N2NCSS.FontUnChange;
                if (profit.netProfit > 0) {
                    pCls = N2NCSS.FontUp;
                } else if (profit.netProfit < 0) {
                    pCls = N2NCSS.FontDown;
                }

                if (buyAmountEl) {
                    buyAmountEl.setRawValue(me._formatNum(profit.buyAmount, 2));
                }
                if (sellAmountEl) {
                    sellAmountEl.setRawValue(me._formatNum(profit.sellAmount, 2));
                }


                profitEl.removeCls([N2NCSS.FontUnChange, N2NCSS.FontUp, N2NCSS.FontDown]);
                profitEl.addCls(pCls);
                profitEl.setRawValue(me._formatNum(profit.netProfit, 2));

                if (profitPercentEl) {
                    profitPercentEl.removeCls([N2NCSS.FontUnChange, N2NCSS.FontUp, N2NCSS.FontDown]);
                    profitPercentEl.addCls(pCls);
                    profitPercentEl.setRawValue(me._formatNum(profit.netProfitPer, 2) + '%');
                }

                me._profits[i] = profit;
            } else {
                profitEl.setRawValue('');
                me._profits[i] = null;
            }
        }

        me.updateSummary();
    },
    viewSummary: function() {
        var me = this;

        if (!me.tradeSummary) {
            me.tradeSummary = Ext.widget('tradecalsummary', {
                _summary: me._summary
            });

            me.tradeSummary.on('destroy', function() {
                me.tradeSummary = null;
            });

            n2nLayoutManager.addItem(me.tradeSummary);
            n2nLayoutManager.activateItem(me.tradeSummary);
        } else {
            n2nLayoutManager.activateItem(me.tradeSummary);
            me.tradeSummary.refresh(me._summary);
        }
    },
    viewTradeDetail: function(detail) {
        var me = this;

        if (!me.tradeDetail) {
            me.tradeDetail = Ext.widget('tradecaldetail', {
                detail: detail
            });

            me.tradeDetail.on('destroy', function() {
                me.tradeDetail = null;
            });

            n2nLayoutManager.addItem(me.tradeDetail);
            n2nLayoutManager.activateItem(me.tradeDetail);
        } else {
            n2nLayoutManager.activateItem(me.tradeDetail);
            me.tradeDetail.refresh(detail);
        }

    },
    _checkConfig: function(extraField) {
        return N2N_CONFIG.tradeCalExtraField.indexOf(extraField) > -1;
    },
    _formatNum: function(num, dec) {
        return formatutils.formatNumber(num, null, null, dec);
    }
});

Ext.define('TCPlus.view.TradeCalDetail', {
    extend: 'Ext.container.Container',
    alias: 'widget.tradecaldetail',
    compRef: {},
    winConfig: {
        width: 500,
        height: 275
    },
    detail: {},
    initComponent: function() {
        var me = this;

        me._createUIItems();
        Ext.apply(me, {
            title: languageFormat.getLanguage(31612, 'Transaction Details'),
            autoScroll: true,
            items: [
                me.compRef.topCt,
                me.compRef.mainCt
            ],
            padding: '5 5 5 0',
            cls: 'fix_themebg trade-cal-detail',
            listeners: {
                afterrender: function() {
                    me.refresh();
                }
            }
        });

        me.callParent(arguments);
    },
    _createUIItems: function () {
        var me = this;

        me.compRef.codeEl = me._createValueEl();
        me.compRef.netProfitEl = me._createValueEl();
        me.compRef.shareEl = me._createValueEl();
        me.compRef.netProfitPerEl = me._createValueEl();

        me.compRef.topCt = Ext.create('Ext.container.Container', {
            width: '100%',
            layout: {
                type: 'column',
                columns: 2
            },
            style: 'margin-bottom: 5px',
            items: [
                me._getColumnCt([
                    me._createLabel(languageFormat.getLanguage(10101, 'Code')),
                    me.compRef.codeEl,
                    me._createLabel(languageFormat.getLanguage(31614, 'Number of Shares')),
                    me.compRef.shareEl
                ]),
                me._getColumnCt([
                    me._createLabel(languageFormat.getLanguage(31613, 'Net Profit')),
                    me.compRef.netProfitEl,
                    me._createLabel(languageFormat.getLanguage(31615, 'Net Profit %')),
                    me.compRef.netProfitPerEl
                ])
            ]
        });

        me.compRef.buyPriceEl = me._createValueEl();
        me.compRef.buyExEl = me._createValueEl();
        me.compRef.buyComEl = me._createValueEl();
        me.compRef.buyAdValEl = me._createValueEl({hidden: !N2N_CONFIG.tradeCalShowAdValorem});
        me.compRef.buyPSEFeeEl = me._createValueEl({hidden: !N2N_CONFIG.tradeCalShowPSEFee});
        me.compRef.buySccpEl = me._createValueEl();
        me.compRef.buyVatEl = me._createValueEl();
        me.compRef.buyCostEl = me._createValueEl();
        me.compRef.buyAmountEl = me._createValueEl();
        me.compRef.beSellPriceEl = me._createValueEl();

        me.compRef.sellPriceEl = me._createValueEl();
        me.compRef.sellExEl = me._createValueEl();
        me.compRef.sellComEl = me._createValueEl();
        me.compRef.sellAdValEl = me._createValueEl({hidden: !N2N_CONFIG.tradeCalShowAdValorem});
        me.compRef.sellPSEFeeEl = me._createValueEl({hidden: !N2N_CONFIG.tradeCalShowPSEFee});
        me.compRef.sellSccpEl = me._createValueEl();
        me.compRef.sellVatEl = me._createValueEl();
        me.compRef.sellCostEl = me._createValueEl();
        me.compRef.sellAmountEl = me._createValueEl();
        me.compRef.salesTaxEl = me._createValueEl();

        me.compRef.mainCt = Ext.create('Ext.container.Container', {
            width: '100%',
            layout: {
                type: 'column',
                columns: 2
            },
            items: [
                me._getColumnCt([
                    me._createLabel(languageFormat.getLanguage(31616, 'Buy Transaction Details'), {colspan: 2, style: 'font-weight:bold'}),
                    me._createLabel(languageFormat.getLanguage(31618, 'Buying Price')),
                    me.compRef.buyPriceEl,
                    me._createLabel(languageFormat.getLanguage(31619, 'Buy Extension')),
                    me.compRef.buyExEl,
                    me._createLabel(languageFormat.getLanguage(31620, 'Buy Commission')),
                    me.compRef.buyComEl,
                    me._createLabel(languageFormat.getLanguage(31648, 'Ad Valorem'), {hidden: !N2N_CONFIG.tradeCalShowAdValorem}),
                    me.compRef.buyAdValEl,
                    me._createLabel(languageFormat.getLanguage(31647, 'PSE Fee'), {hidden: !N2N_CONFIG.tradeCalShowPSEFee}),
                    me.compRef.buyPSEFeeEl,
                    me._createLabel(languageFormat.getLanguage(31649, 'SCCP')),
                    me.compRef.buySccpEl,
                    me._createLabel(languageFormat.getLanguage(31622, 'VAT')),
                    me.compRef.buyVatEl,
                    me._createLabel(languageFormat.getLanguage(31623, 'Total Buying Cost')),
                    me.compRef.buyCostEl,
                    me._createLabel(languageFormat.getLanguage(31624, 'Total Buying Amount')),
                    me.compRef.buyAmountEl,
                    me._createLabel(languageFormat.getLanguage(31625, 'Break Even Selling Price')),
                    me.compRef.beSellPriceEl
                ], {style: 'margin-top: 5px'}),
                me._getColumnCt([
                    me._createLabel(languageFormat.getLanguage(31617, 'Sell Transaction Details'), {colspan: 2, style: 'font-weight:bold'}),
                    me._createLabel(languageFormat.getLanguage(31626, 'Selling Price')),
                    me.compRef.sellPriceEl,
                    me._createLabel(languageFormat.getLanguage(31627, 'Sell Extension')),
                    me.compRef.sellExEl,
                    me._createLabel(languageFormat.getLanguage(31628, 'Sell Commission')),
                    me.compRef.sellComEl,
                    me._createLabel(languageFormat.getLanguage(31648, 'Ad Valorem'), {hidden: !N2N_CONFIG.tradeCalShowAdValorem}),
                    me.compRef.sellAdValEl,
                    me._createLabel(languageFormat.getLanguage(31647, 'PSE Fee'), {hidden: !N2N_CONFIG.tradeCalShowPSEFee}),
                    me.compRef.sellPSEFeeEl,
                    me._createLabel(languageFormat.getLanguage(31649, 'SCCP')),
                    me.compRef.sellSccpEl,
                    me._createLabel(languageFormat.getLanguage(31622, 'VAT')),
                    me.compRef.sellVatEl,
                    me._createLabel(languageFormat.getLanguage(31629, 'Total Selling Cost')),
                    me.compRef.sellCostEl,
                    me._createLabel(languageFormat.getLanguage(31630, 'Total Selling Amount')),
                    me.compRef.sellAmountEl,
                    me._createLabel(languageFormat.getLanguage(31631, 'Sales Tax')),
                    me.compRef.salesTaxEl
                ], {style: 'margin-top: 5px'})
            ]
        });
    },
    cleanUp: function () {
        var me = this;

        me._setElVal(me.compRef.codeEl, '-');
        me._setElVal(me.compRef.shareEl, '-');
        me._setElVal(me.compRef.buyPriceEl, '-');
        me._setElVal(me.compRef.buyExEl, '-');
        me._setElVal(me.compRef.buyComEl, '-');
        me._setElVal(me.compRef.buyAdValEl, '-');
        me._setElVal(me.compRef.buyPSEFeeEl, '-');
        me._setElVal(me.compRef.buySccpEl, '-');
        me._setElVal(me.compRef.buyVatEl, '-');
        me._setElVal(me.compRef.buyCostEl, '-');
        me._setElVal(me.compRef.buyAmountEl, '-');
        me._setElVal(me.compRef.beSellPriceEl, '-');

        me._setElVal(me.compRef.sellPriceEl, '-');
        me._setElVal(me.compRef.sellExEl, '-');
        me._setElVal(me.compRef.sellComEl, '-');
        me._setElVal(me.compRef.sellAdValEl, '-');
        me._setElVal(me.compRef.sellPSEFeeEl, '-');
        me._setElVal(me.compRef.sellSccpEl, '-');
        me._setElVal(me.compRef.sellVatEl, '-');
        me._setElVal(me.compRef.sellCostEl, '-');
        me._setElVal(me.compRef.sellAmountEl, '-');
        me._setElVal(me.compRef.salesTaxEl, '-');

        me._setElVal(me.compRef.netProfitEl, '-');
        me._setElVal(me.compRef.netProfitPerEl, '-');
        me.compRef.netProfitEl.removeCls([N2NCSS.FontUnChange, N2NCSS.FontUp, N2NCSS.FontDown]);
        me.compRef.netProfitPerEl.removeCls([N2NCSS.FontUnChange, N2NCSS.FontUp, N2NCSS.FontDown]);

    },
    refresh: function (detail) {
        var me = this;
        me.cleanUp();

        if (detail) {
            me.detail = detail;
        }

        var shares = me.detail.share;
        var buyPrice = me.detail.buyPrice;
        var sellPrice = me.detail.sellPrice;
        var sellAmount = null;
        var buyAmount = null;

        // config
        var sccp = parseFloat(calPreference.get('sccp', 0)) / 100;
        var adval = parseFloat(calPreference.get('adval', 0)) / 100;
        var psefee = parseFloat(calPreference.get('psefee', 0.005)) / 100;
        var vat = parseFloat(calPreference.get('vat', 0)) / 100;
        var tax = parseFloat(calPreference.get('tax', 0)) / 100;
        var mincom = parseFloat(calPreference.get('mincom', 0));
        var comm = parseFloat(calPreference.get('comm', 0)) / 100;

        me._setElVal(me.compRef.codeEl, me.detail.code || '-');
        if (shares) {
            me._setElVal(me.compRef.shareEl, me._formatNum(shares));
        }
        if (buyPrice) {
            me._setElVal(me.compRef.buyPriceEl, me._formatNum(buyPrice, 4));
        }
        if (sellPrice) {
            me._setElVal(me.compRef.sellPriceEl, me._formatNum(sellPrice, 4));
        }

        if (shares && buyPrice) {
            // buy extension
            var buyEx = shares * buyPrice;
            me._setElVal(me.compRef.buyExEl, me._formatNum(buyEx, 2));

            // buy commission
            var buyComm = getCommission(buyEx, comm);
            me._setElVal(me.compRef.buyComEl, me._formatNum(buyComm, 2));

            // buy ad valorem and sccp
            var buyAdval = adval * buyEx;
            var buyPSEFee = psefee * buyEx;
            var buySccp = sccp * buyEx;

            if (N2N_CONFIG.tradeCalShowAdValorem) {
                me._setElVal(me.compRef.buyAdValEl, me._formatNum(buyAdval, 2));
            }

            if (N2N_CONFIG.tradeCalShowPSEFee) {
                me._setElVal(me.compRef.buyPSEFeeEl, me._formatNum(buyPSEFee, 2));
            }

            me._setElVal(me.compRef.buySccpEl, me._formatNum(buySccp, 2));

            // buy vat
            var buyVat = vat * buyComm;
            me._setElVal(me.compRef.buyVatEl, me._formatNum(buyVat, 2));

            // total buying cost
            var buyCost = buyComm + buySccp + buyVat;
            if (N2N_CONFIG.tradeCalShowAdValorem) {
                buyCost += buyAdval;
            }
            if (N2N_CONFIG.tradeCalShowPSEFee) {
                buyCost += buyPSEFee;
            }
            me._setElVal(me.compRef.buyCostEl, me._formatNum(buyCost, 2));

            // total buy amount
            var buyAmount = buyCost + buyEx;
            me._setElVal(me.compRef.buyAmountEl, me._formatNum(buyAmount, 2));
        }

        if (shares && sellPrice) {
            var sellEx = shares * sellPrice;
            me._setElVal(me.compRef.sellExEl, me._formatNum(sellEx, 2));

            // sell commission
            var sellComm = getCommission(sellEx, comm);
            me._setElVal(me.compRef.sellComEl, me._formatNum(sellComm, 2));

            // sell ad valorem and sccp
            var sellAdval = adval * sellEx;
            var sellPSEFee = psefee * sellEx;
            var sellSccp = sccp * sellEx;
            if (N2N_CONFIG.tradeCalShowAdValorem) {
                me._setElVal(me.compRef.sellAdValEl, me._formatNum(sellAdval, 2));
            }
            if (N2N_CONFIG.tradeCalShowPSEFee) {
                me._setElVal(me.compRef.sellPSEFeeEl, me._formatNum(sellPSEFee, 2));
            }
            me._setElVal(me.compRef.sellSccpEl, me._formatNum(sellSccp, 2));

            // sell vat
            var sellVat = vat * sellComm;
            me._setElVal(me.compRef.sellVatEl, me._formatNum(sellVat, 2));

            // sales tax
            var salesTax = tax * sellEx;
            me._setElVal(me.compRef.salesTaxEl, me._formatNum(salesTax, 2));

            // sell cost
            var sellCost = sellComm + sellSccp + sellVat + salesTax;
            if (N2N_CONFIG.tradeCalShowAdValorem) {
                sellCost += sellAdval;
            }
            if (N2N_CONFIG.tradeCalShowPSEFee) {
                sellCost += sellPSEFee;
            }
            me._setElVal(me.compRef.sellCostEl, me._formatNum(sellCost, 2));

            // total sell cost
            var sellAmount = sellEx - sellCost;
            me._setElVal(me.compRef.sellAmountEl, me._formatNum(sellAmount, 2));
        }

        if (sellAmount && buyAmount) {
            // net profit
            var netProfit = sellAmount - buyAmount;
            me._setElVal(me.compRef.netProfitEl, me._formatNum(netProfit, 2));

            var netProfitPer = (netProfit / buyAmount) * 100;
            me._setElVal(me.compRef.netProfitPerEl, me._formatNum(netProfitPer, 2) + '%');

            // set color
            var pCls = N2NCSS.FontUnChange;
            if (netProfit > 0) {
                pCls = N2NCSS.FontUp;
            } else if (netProfit < 0) {
                pCls = N2NCSS.FontDown;
            }

            me.compRef.netProfitEl.addCls(pCls);
            me.compRef.netProfitPerEl.addCls(pCls);

            // break even selling price
            var beSellPrice = buyAmount / (shares - (shares * comm) - (shares * sccp) - (shares * adval) - (shares * tax) - (shares * comm * vat));
            me._setElVal(me.compRef.beSellPriceEl, me._formatNum(beSellPrice, 4));
        }

    },
    _formatNum: function(num, dec) {
        return formatutils.formatNumber(num, null, null, dec);
    },
    _getColumnCt: function(items, extraConf) {
        return Ext.apply({
            xtype: 'container',
            minWidth: 210,
            maxWidth: 300,
            columnWidth: 0.5,
            cls: 'info_ct',
            layout: {
                type: 'table',
                columns: 2,
                tableAttrs: {
                    style: {
                        width: '100%'
                    }
                },
                tdAttrs: {
                    style: {
                        'text-align': 'right',
                        'padding-left': '10px'
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
        }, extraConf);
    },
    _createLabel: function(label, extraConf) {
        return Ext.create('Ext.form.Label', Ext.apply({
            text: label
        }, extraConf));
    },
    _createValueEl: function(extraConf) {
        return Ext.create('Ext.form.Label', Ext.apply({
            text: '-'
        }, extraConf));
    },
    _setElVal: function(el, val) {
        helper.setHtml(el, val);
    }
});

Ext.define('TCPlus.views.TradeCalSummary', {
    extend: 'Ext.container.Container',
    alias: 'widget.tradecalsummary',
    compRef: {},
    winConfig: {
        width: 305,
        height: 160
    },
    initComponent: function() {
        var me = this;

        me._createUIItems();
        Ext.apply(me, {
            layout: {
                type: 'table',
                columns: 2,
                tableAttrs: {
                    style: {
                        width: '100%'
                    },
                    cls: 'tradecalsummary'
                },
                tdAttrs: {
                    style: {
                        'padding': '5px'
                    }
                }
            },
            cls: 'fix_themebg',
            title: languageFormat.getLanguage(31634, 'Transactions Overview'),
            items: [
                me._createLabel(languageFormat.getLanguage(31619, 'Buy Extension')),
                me.compRef.buyExEl,
                me._createLabel(languageFormat.getLanguage(31627, 'Sell Extension')),
                me.compRef.sellExEl,
                me._createLabel(languageFormat.getLanguage(31633, 'Total Costs')),
                me.compRef.totalCostEl,
                me._createLabel(languageFormat.getLanguage(31624, 'Total Buying Amount')),
                me.compRef.totalBuyAmountEl,
                me._createLabel(languageFormat.getLanguage(31630, 'Total Selling Amount')),
                me.compRef.totalSellAmountEl
            ],
            listeners: {
                afterrender: function() {
                    me.refresh();
                }
            }
        });
        me.callParent(arguments);
    },
    refresh: function(summary) {
        var me = this;
        if (summary) {
            me._summary = summary;
        }
        if (me._summary) {
            me._setElVal(me.compRef.buyExEl, formatutils.formatNumber(me._summary.totalBuyEx, null, null, 2));
            me._setElVal(me.compRef.sellExEl, formatutils.formatNumber(me._summary.totalSellEx, null, null, 2));
            me._setElVal(me.compRef.totalCostEl, formatutils.formatNumber(me._summary.totalCost, null, null, 2));
            me._setElVal(me.compRef.totalBuyAmountEl, formatutils.formatNumber(me._summary.totalBuyAmount, null, null, 2));
            me._setElVal(me.compRef.totalSellAmountEl, formatutils.formatNumber(me._summary.totalSellAmount, null, null, 2));
        } else {
            me.clearAll();
        }
    },
    clearAll: function() {
        var me = this;

        me._setElVal(me.compRef.buyExEl, '-');
        me._setElVal(me.compRef.sellExEl, '-');
        me._setElVal(me.compRef.totalCostEl, '-');
        me._setElVal(me.compRef.totalBuyAmountEl, '-');
        me._setElVal(me.compRef.totalSellAmountEl, '-');
    },
    _createUIItems: function() {
        var me = this;

        me.compRef.buyExEl = me._createValueEl();
        me.compRef.sellExEl = me._createValueEl();
        me.compRef.totalCostEl = me._createValueEl();
        me.compRef.totalBuyAmountEl = me._createValueEl();
        me.compRef.totalSellAmountEl = me._createValueEl();
    },
    _createLabel: function(label, extraConf) {
        return Ext.create('Ext.form.Label', Ext.apply({
            text: label
        }, extraConf));
    },
    _createValueEl: function() {
        return Ext.create('Ext.form.Label', {
            text: '-'
        });
    },
    _setElVal: function(el, val) {
        helper.setHtml(el, val);
    }
});

Ext.define('TCPlus.view.BrokerQ', {
    extend: 'Ext.container.Container',
    alias: 'widget.brokerq',
    compRef: {},
    type: 'bq',
    savingComp: true,
    feedScreen: true,
    ddComp: true,
    winConfig: {
        width: 575,
        height: 305
    },
    _colNum: 4,
    _rowNum: 10,
    initComponent: function() {
        var me = this;
        me._cellNum = me._colNum * me._rowNum;

        me._createUIs();
        Ext.apply(me, {
            title: languageFormat.getLanguage(31800, 'Broker Queue'),
            keyEnabled: N2N_CONFIG.keyEnabled,
            items: [
                me.compRef.tBar,
                me.compRef.mainCt,
                me.compRef.bBar
            ],
            layout: 'vbox',
            listeners: {
                destroy: function() {
                    me.unsubscribe();
                }
            }
        });
        me.callParent(arguments);
    },
    _createUIs: function() {
        var me = this;

        if (N2N_CONFIG.searchAutoComplete) {
            me.compRef.searchTf = Ext.widget('searchautobox', {
                listeners: {
                    select: function(thisCb, records) {
                        if (records.length > 0) {
                            var rec = records[0];

                            me.compRef.searchTf.setValue('');
                            me.setCode(rec.get(fieldStkCode), rec.get(fieldStkName));
                            me.loadBrokerQ();
                            
                            if (N2N_CONFIG.syncSibling) {
                                syncGroupManager.syncAllComps(me, me.stkcode, me.stkname);
                            }                            
                        }
                    }
                },
                onSearchEnterKey: function(records) {
                    if (records.length > 0) {
                        var rec = records[0];

                        me.compRef.searchTf.setValue('');
                        me.setCode(rec.get(fieldStkCode), rec.get(fieldStkName));
                        me.loadBrokerQ();
                        
                        if (N2N_CONFIG.syncSibling) {
                            syncGroupManager.syncAllComps(me, me.stkcode, me.stkname);
                        }                        
                    } else {
                        msgutil.alert(languageFormat.getLanguage(30014, 'Invalid Symbol/Code.'));
                    }
                }
            });
        }

        me.compRef.tBar = Ext.create('Ext.toolbar.Toolbar', {
            items: [me.compRef.searchTf],
            width: '100%'
        });

        me.compRef.buyGrid = Ext.create('Ext.grid.Panel', {
            title: languageFormat.getLanguage(10001, 'Buy'),
            flex: 1,
            height: '100%',
            columns: me.createGridCols('b'),
            store: me.createGridStore('bcol'),
            columnLines: true,
            hideHeaders: true,
            cls: 'center-title buy-title',
            viewConfig: {
                markDirty: false,
                trackOver: false,
                cls: 'hscroll-only'
            },
            selType: 'cellmodel',
            allowDeselect: true,
            listeners: {
                beforeselect: function() {
                    // make sure there is only one selected cell
                    me.compRef.sellGrid.getSelectionModel().deselectAll();
                },
                cellclick: function(thisView, td, cellIndex, rec) {
                    me.updateStatusBar(rec, cellIndex);
                }
            }
        });

        me.compRef.sellGrid = Ext.create('Ext.grid.Panel', {
            title: languageFormat.getLanguage(10002, 'Sell'),
            flex: 1,
            height: '100%',
            columns: me.createGridCols('s'),
            store: me.createGridStore('scol'),
            columnLines: true,
            hideHeaders: true,
            cls: 'center-title sell-title',
            viewConfig: {
                markDirty: false,
                trackOver: false,
                cls: 'hscroll-only'
            },
            selType: 'cellmodel',
            allowDeselect: true,
            listeners: {
                beforeselect: function() {
                    // make sure there is only one selected cell
                    me.compRef.buyGrid.getSelectionModel().deselectAll();
                },
                cellclick: function(thisView, td, cellIndex, rec) {
                    me.updateStatusBar(rec, cellIndex);
                }
            }
        });

        me.compRef.mainCt = Ext.create('Ext.container.Container', {
            flex: 1,
            items: [me.compRef.buyGrid, me.compRef.sellGrid],
            width: '100%',
            layout: 'hbox'
        });
        
        // status bar
        me.compRef.statusLb = Ext.widget('label', {
            width: '100%',
            height: 13
        });

        me.compRef.bBar = Ext.create('Ext.toolbar.Toolbar', {
            items: [me.compRef.statusLb],
            width: '100%'
        });
    },
    updateStatusBar: function(rec, cellIndex) {
        var me = this;

        if (rec) {
            // get selected broker code
            var bkCode = rec.get(rec.get('indicator') + 'col_' + cellIndex);

            var bkName = '';
            if (bkCode) {
                if (!bkCode.endsWith('s')) {
                    bkName = brokerList.getBrokerName(me.exch, bkCode);
                } else {
                    bkCode = '';
                }
            }

            if (bkName) {
                helper.setHtml(me.compRef.statusLb, bkCode + ' - ' + bkName);
                me.handleSync(bkCode);
            } else {
                helper.setHtml(me.compRef.statusLb, bkCode);
            }
        } else {
            helper.setHtml(me.compRef.statusLb, '');
        }

    },
    handleSync: function(bkCode) {

        if (bkCode) {
            var me = this;

            if (syncGroupManager.isSyncComp(me.type) && syncGroupManager.isSyncEnabled(me.type)) {
                syncGroupManager.syncFirstComp(me, [n2ncomponents.bkSearch], function() {
                    if (n2ncomponents.bkSearch) {
                        n2ncomponents.bkSearch.setBroker(me.exch, bkCode, true);
                    }
                }, me.exch, bkCode);
            }
        }

    },
    createGridCols: function(colPrefix) {
        var me = this;

        var columns = [];
        for (var i = 0; i < me._colNum; i++) {
            columns.push({
                dataIndex: colPrefix + 'col_' + i,
                flex: 1,
                align: 'right',
                renderer: function(value, meta, record) {
                    var cssArr = [N2NCSS.CellDefault, N2NCSS.FontString, N2NCSS.FontColorString];
                    if (value && value.endsWith('s')) {
                        if (record.get('indicator') === 'b') {
                            cssArr.push(N2NCSS.FontOnBlink, N2NCSS.BackUp);
                        } else {
                            cssArr.push(N2NCSS.FontOnBlink, N2NCSS.BackDown);
                        }
                    } else {
                        if (record.get('indicator') === 'b') {
                            cssArr.push(N2NCSS.FontUp);
                        } else {
                            cssArr.push(N2NCSS.FontDown);
                        }
                    }

                    meta.css = cssArr.join(' ');
                    
                    if (!value || value.trim() === '') {
                        return '&nbsp;'; // fixes short row's height issue
                    }
                    
                    return value;
                }
            });
        }

        return columns;
    },
    createGridStore: function(colPrefix) {
        var me = this;

        var fields = [];
        for (var i = 0; i < me._colNum; i++) {
            fields.push({
                name: colPrefix + '_' + i
            });
        }

        return {
            fields: fields,
            data: me.createEmptyRec(colPrefix)
        };
    },
    refresh: function() {
        var me = this;

        if (me.rendered) {
            me.loadBrokerQ();
        } else {
            setTimeout(function() {
                me.refresh();
            }, 0);
        }
    },
    setCode: function(stkcode, stkname) {
        var me = this;

        if (me.key) {
            me.oldKey = me.key;
        }

        me.key = stkcode;
        me.stkcode = stkcode;
        me.stkname = stkname;
        me.exch = stockutil.getExchange(me.key);

    },
    updateTitle: function() {
        var me = this;

        var compTitle = languageFormat.getLanguage(31800, 'Broker Queue');
        if (me.key) {
            compTitle += ' - ' + stockutil.getStockPart(this.stkname);
        }
        n2nLayoutManager.updateTitle(me, compTitle);
        n2nLayoutManager.updateKey(me);
    },
    getBrokerList: function(callback) {
        var me = this;

        if (brokerList.getList(me.exch)) {
            if (typeof callback === 'function') {
                callback();
            }
        } else {
            conn.getBrokerList({
                ex: me.exch,
                success: function(data) {
                    if (data) {
                        brokerList.addList(me.exch, data);

                        if (typeof callback === 'function') {
                            callback();
                        }

                    }
                }
            });
        }
    },
    loadBrokerQ: function() {
        var me = this;

        me.getBrokerList(function() {
            me.getBrokerQ();
        });
    },
    getBrokerQ: function() {
        var me = this;

        tLog('Broker Q > loadBrokerQ');

        me.updateTitle();
        compAddRecent(me, me.key);
        me.updateStatusBar();
        
        if (!me.key) {
            return;
        }

        helper.setLoading(me, true);
        // clear previous records
        me.compRef.buyGrid.store.loadData(me.createEmptyRec('b'));
        me.compRef.sellGrid.store.loadData(me.createEmptyRec('s'));

        conn.getBrokerQ({
            k: me.key,
            success: function(data) {
                var buyRec = null;
                var sellRec = null;

                for (var i = 0; i < data.length; i++) {
                    var dt = data[i];

                    if (dt[field18BrokerData] && dt[field18Indicator]) {
                        if (dt[field18Indicator] === '1') { // buy
                            buyRec = me.strToRec(dt[field18BrokerData], 'b');
                        } else { // sell
                            sellRec = me.strToRec(dt[field18BrokerData], 's');
                        }
                    }

                    if (buyRec && sellRec) {
                        break;
                    }
                }

                if (buyRec && buyRec.length > 0) {
                    me.compRef.buyGrid.store.loadData(buyRec);
                }
                if (sellRec && sellRec.length > 0) {
                    me.compRef.sellGrid.store.loadData(sellRec);
                }

                helper.setLoading(me, false);

                me.subscribe();

            }
        });
    },
    subscribe: function() {
        var me = this;

        if (!N2N_CONFIG.activeSub || helper.activeView(me)) {
            me.firstLoad = false;
            Storage.refresh();
            conn.subscribe18();
            me.inactive = false;
        }
    },
    unsubscribe: function() {
        conn.unsubscribe18();
    },
    getColPrefix: function(indicator) {
        return indicator === '1' ? 'b' : 's';
    },
    strToRec: function(str, colPrefix) {
        var me = this;
        var rec = [];

        var bkArr = str.split(',');
        // fill empty value if number of values is less than total cells
        var s = bkArr.length;
        for (s; s < me._cellNum; s++) {
            bkArr.push(' ');
        }

        for (var b = 0; b < bkArr.length; b++) {
            var colIdx = Math.floor(b / me._rowNum);
            var rowIdx = b - colIdx * me._rowNum;
            var colId = colPrefix + 'col_' + colIdx;

            if (!rec[rowIdx]) {
                rec[rowIdx] = {
                    'indicator': colPrefix
                };
            }

            rec[rowIdx][colId] = bkArr[b];

        }

        var remainingCount = me._rowNum - rec.length;
        for (var i = 0; i < remainingCount; i++) {
            rec.push({
                'indicator': colPrefix
            });
        }

        return rec;
    },
    createEmptyRec: function(colPrefix) {
        var me = this;
        var rec = [];

        for (var i = 0; i < me._rowNum; i++) {
            rec.push({
                'indicator': colPrefix
            });
        }

        return rec;
    },
    updateFeedRecord: function(dataObj) {
        var me = this;

        if (dataObj && dataObj[fieldStkCode] === me.key) {
            var colPrefix = me.getColPrefix(dataObj[field18Indicator]);
            var records = me.strToRec(dataObj[field18BrokerData], colPrefix);

            var grid = null;
            var blinkType = 'up';
            var blinkColor = N2NCSS.FontUp;
            if (colPrefix === 'b') {
                grid = me.compRef.buyGrid;
            } else {
                grid = me.compRef.sellGrid;
                blinkType = 'down';
                blinkColor = N2NCSS.FontDown;
            }

            for (var i = 0; i < me._colNum; i++) {
                var colId = colPrefix + 'col_' + i;

                for (var j = 0; j < records.length; j++) {
                    var rec = records[j];
                    var value = rec[colId] || '';

                    var oldRec = grid.store.getAt(j);
                    var oldValue = oldRec.get(colId) || '';

                    if (value != oldValue) {
                        // update record
                        oldRec.data[colId] = value;

                        if (value.endsWith('s')) { // level
                            if (colPrefix === 'b') {
                                N2NUtil.updateCell(grid, j, i, value, [N2NCSS.FontOnBlink, N2NCSS.BackUp]);
                            } else {
                                N2NUtil.updateCell(grid, j, i, value, [N2NCSS.FontOnBlink, N2NCSS.BackDown]);
                            }

                        } else {
                            if (!value || value.trim() === '') {
                                value = '&nbsp;'; // fixes row height issue
                            }
                            
                            N2NUtil.updateCell(grid, j, i, value, blinkColor);
                            // blink
                            Blinking.setBlink(grid, j, i, blinkType);
                        }
                    }
                }
            }

        }

    },
    syncBuffer: function(stkcode, stkname) {
        var me = this;

        // update key and title
        me.setCode(stkcode, stkname);
        me.updateTitle();

    },
    switchRefresh: function(silent) {
        var me = this;

        if (N2N_CONFIG.activeSub) {
            me.loadBrokerQ(silent);
        }
    },
    focusSearchBox: function() {
        focusManager.focusSearchbox(this.compRef.searchTf);
    }
});

/* Broker search */
Ext.define('TCPlus.view.BrokerSearch', {
    extend: 'Ext.container.Container',
    alias: 'widget.brokersearch',
    savingComp: true,
    type: 'bks',
    feedScreen: true,
    ddComp: true,
    compRef: {},
    winConfig: {
        width: 575,
        height: 305
    },
    initComponent: function() {
        var me = this;

        me._createUIItems();
        Ext.apply(me, {
            title: languageFormat.getLanguage(31820, 'Broker Search'),
            layout: 'vbox',
            keyEnabled: N2N_CONFIG.keyEnabled,
            items: [
                me._topBar_,
                me.compRef.mainCt
            ],
            listeners: {
                afterrender: function() {
                    me.setExchange(exchangecode);
                    me.firstLoad = false;
                }
            }
        });
        me.callParent(arguments);
    },
    _createUIItems: function() {
        var me = this;

        me._colConf = new UserItemList(userPreference.get('bks_col', 'c,s,p'));

        me.compRef.bkListCb = Ext.widget('combo', {
            fieldLabel: languageFormat.getLanguage(11068, 'Broker'),
            labelWidth: 45,
            width: 200,
            store: {
                fields: ['bkCode', 'bkName']
            },
            displayField: 'bkName',
            valueField: 'bkCode',
            style: 'margin-left: 5px',
            queryMode: 'local',
            matchFieldWidth: false,
            selectOnFocus: true,
            forceSelection: true,
            labelStyle: 'white-space: nowrap;',
            listConfig: {
                tpl: Ext.create('Ext.XTemplate', // displayed in list
                        '<tpl for=".">',
                        '<div class="x-boundlist-item">{bkName}</div>',
                        '</tpl>'
                        ),
                maxHeight: 175
            },
            listeners: {
                select: function(thisCb, records) {
                    var rec = records[0];

                    if (rec) {
                        var codeList = me.createCodeRecords(rec.get('codes'));

                        me.compRef.bkCodeCb.store.loadData(codeList);
                        me.compRef.bkCodeCb.setValue('All');

                        me.loadBrokerQStocks();
                    }
                }
            }
        });

        me.compRef.bkCodeCb = Ext.widget('combo', {
            fieldLabel: languageFormat.getLanguage(10101, 'Code'),
            labelWidth: 35,
            width: 110,
            store: {
                fields: ['code']
            },
            displayField: 'code',
            valueField: 'value',
            style: 'margin-left: 5px',
            queryMode: 'local',
            forceSelection: true,
            editable: false,
            labelStyle: 'white-space: nowrap;',
            listConfig: {
                maxHeight: 175
            },
            listeners: {
                select: function() {
                    me.loadBrokerQStocks();
                }
            }
        });

        me.compRef.refreshBt = Ext.widget('button', {
            text: languageFormat.getLanguage(10008, 'Refresh'),
            tooltip: languageFormat.getLanguage(10008, 'Refresh'),
            iconCls: 'icon-reset',
            style: 'margin-left: 5px',
            handler: function() {
                me.loadBrokerQStocks();
            }
        });

        me._topBar_ = Ext.widget('toolbar', {
            items: [me.compRef.bkListCb, me.compRef.bkCodeCb, '->', me.compRef.refreshBt],
            width: '100%'
        });

        me.compRef.buyGrid = Ext.create('Ext.grid.Panel', {
            title: languageFormat.getLanguage(10001, 'Buy'),
            flex: 1,
            height: '100%',
            columns: me.createGridCols(),
            store: me.createGridStore(),
            columnLines: true,
            cls: 'center-title buy-title broker-search',
            viewConfig: {
                markDirty: false,
                cls: 'hscroll-only'
            },
            allowDeselect: true,
            enableColumnMove: false,
            sortableColumns: false,
            requires: ['Ext.grid.feature.Grouping'],
            features: me.getGridFeatures(),
            listeners: {
                beforeselect: function() {
                    // make sure there is only one selected cell
                    me.compRef.sellGrid.getSelectionModel().deselectAll();
                },
                columnshow: function(ct, col) {
                    me.toggleColumn(col, 's', true);
                },
                columnhide: function(ct, col) {
                    me.toggleColumn(col, 's', false);
                },
                itemclick: function(gridView, record) {
                    me.handleSync(record);
                }
            }
        });

        me.compRef.sellGrid = Ext.create('Ext.grid.Panel', {
            title: languageFormat.getLanguage(10002, 'Sell'),
            flex: 1,
            height: '100%',
            columns: me.createGridCols(),
            store: me.createGridStore(),
            columnLines: true,
            cls: 'center-title sell-title broker-search',
            viewConfig: {
                markDirty: false,
                cls: 'hscroll-only'
            },
            allowDeselect: true,
            enableColumnMove: false,
            sortableColumns: false,
            requires: ['Ext.grid.feature.Grouping'],
            features: me.getGridFeatures(),
            listeners: {
                beforeselect: function() {
                    // make sure there is only one selected cell
                    me.compRef.buyGrid.getSelectionModel().deselectAll();
                },
                columnshow: function(ct, col) {
                    me.toggleColumn(col, 'b', true);
                },
                columnhide: function(ct, col) {
                    me.toggleColumn(col, 'b', false);
                },
                itemclick: function(gridView, record) {
                    me.handleSync(record);
                }
            }
        });

        me.compRef.mainCt = Ext.widget('container', {
            flex: 1,
            width: '100%',
            layout: 'hbox',
            items: [me.compRef.buyGrid, me.compRef.sellGrid]
        });


    },
    handleSync: function(record) {
        var me = this;
        if (record) {
            var stkCode = record.get(fieldStkCode);
            var stkName = record.get(fieldStkName);

            if (stkCode && stkName) {
                syncGroupManager.syncAllComps(me, stkCode, stkName);
            }
        }
    },
    createCodeRecords: function(bkCodes) {
        var codeList = [{
                value: 'All',
                code: languageFormat.getLanguage(10024, 'All')
            }];

        if (bkCodes) {
            for (var i = 0; i < bkCodes.length; i++) {
                codeList.push({
                    value: bkCodes[i],
                    code: bkCodes[i]
                });
            }
        }

        return codeList;
    },
    cacheCols: function() {
        var me = this;

        if (!me._cols) { // cache
            me._cols = {};
            var bCols = helper.getGridColumns(me.compRef.buyGrid);
            var sCols = helper.getGridColumns(me.compRef.sellGrid);

            me._cols['b' + fieldStkCode] = helper.getColumn(bCols, 'dataIndex', fieldStkCode)['col'];
            me._cols['b' + fieldStkName] = helper.getColumn(bCols, 'dataIndex', fieldStkName)['col'];
            me._cols['bprice'] = helper.getColumn(bCols, 'dataIndex', 'price')['col'];
            me._cols['s' + fieldStkCode] = helper.getColumn(sCols, 'dataIndex', fieldStkCode)['col'];
            me._cols['s' + fieldStkName] = helper.getColumn(sCols, 'dataIndex', fieldStkName)['col'];
            me._cols['sprice'] = helper.getColumn(sCols, 'dataIndex', 'price')['col'];

        }
    },
    toggleColumn: function(col, type, status) {
        var me = this;

        me.cacheCols();

        helper.setVisible(me._cols[type + col.dataIndex], status);

        // save settings
        if (status) {
            me._colConf.add(col.settingId);
        } else {
            me._colConf.remove(col.settingId);
        }

        userPreference.set('bks_col', me._colConf.toString());

    },
    createGridCols: function() {
        var me = this;

        var columns = [
            {
                text: languageFormat.getLanguage(10101, 'Code'),
                dataIndex: fieldStkCode,
                flex: 1,
                sortable: false,
                hidden: !me._colConf.exist('c'),
                settingId: 'c',
                renderer: function(value, meta, record) {
                    me._addGridRowMeta(meta);
                    // meta.tdAttr = 'title="' + record.get(fieldStkName) + '"';

                    return stockutil.getStockPart(value);
                }
            },
            {
                text: languageFormat.getLanguage(10102, 'Symbol'),
                dataIndex: fieldStkName,
                flex: 2,
                sortable: false,
                hidden: !me._colConf.exist('s'),
                settingId: 's',
                renderer: function(value, meta, record) {
                    me._addGridRowMeta(meta);
                    // meta.tdAttr = 'title="' + record.get(fieldStkCode) + '"';

                    return stockutil.getStockPart(value);
                }
            },
            {
                text: languageFormat.getLanguage(10942, 'Price'),
                dataIndex: 'price',
                align: 'right',
                flex: 1,
                sortable: false,
                hidden: !me._colConf.exist('p'),
                settingId: 'p',
                renderer: function(value, meta, record) {
                    me._addGridRowMeta(meta);
                    return value;
                }
            }
        ];

        return columns;
    },
    _addGridRowMeta: function(meta) {
        meta.css = [N2NCSS.CellDefault, N2NCSS.FontString, N2NCSS.FontColorString].join(' ');
    },
    createGridStore: function() {

        var fields = [
            {
                name: fieldStkCode
            },
            {
                name: fieldStkName
            },
            {
                name: 'price'
            }
        ];

        return {
            fields: fields,
            groupField: 'group'
        };
    },
    getGridFeatures: function() {
        return [
            {
                ftype: 'grouping',
                hideGroupedHeader: true,
                startCollapsed: false,
                enableGroupingMenu: false,
                groupHeaderTpl: '{name}'
            }
        ];
    },
    setExchange: function(exch) {
        var me = this;

        if (me.exch != exch) {
            me.exch = exch;

            me.clearUIs();
            me.updateTitle();
            me.loadBrokerList();
        }
    },
    clearUIs: function() {
        var me = this;

        me.compRef.bkListCb.store.loadData([]);
        me.compRef.bkListCb.setValue('');
        me.compRef.bkListCb.disable();
        me.compRef.bkCodeCb.store.loadData([]);
        me.compRef.bkCodeCb.setValue('');
        me.compRef.buyGrid.store.loadData([]);
        me.compRef.sellGrid.store.loadData([]);

    },
    updateTitle: function() {
        var me = this;

        var title = languageFormat.getLanguage(31820, 'Broker Search');
        if (me.exch) {
            title += ' [' + me.exch + ']';
        }
        n2nLayoutManager.updateTitle(me, title);

    },
    loadBrokerList: function() {
        var me = this;
        var bkList = brokerList.getList(me.exch);

        if (bkList) {
            me.compRef.bkListCb.enable();
            me.compRef.bkListCb.store.loadData(bkList);
        } else {
            conn.getBrokerList({
                ex: me.exch,
                success: function(data) {
                    brokerList.addList(me.exch, data);
                    me.compRef.bkListCb.store.loadData(data);
                    me.compRef.bkListCb.enable();
                }
            });
        }
    },
    loadBrokerQStocks: function(silent) {
        var me = this;
        var broker = me.compRef.bkListCb.getValue();
        var code = me.compRef.bkCodeCb.getValue();

        if (!broker || !code) {
            return;
        }

        if (code !== 'All') {
            broker = '';
        }

        if (!silent) {
            helper.setLoading(me.compRef.mainCt, true);
        }

        // clear existing data
        me.compRef.buyGrid.store.loadData([]);
        me.compRef.sellGrid.store.loadData([]);

        conn.getBrokerQStocks({
            grp: broker,
            code: code,
            fields: [fieldStkCode, fieldStkName],
            ex: me.exch,
            success: function(data) {
                me.compRef.buyGrid.store.loadData(data.b);
                me.compRef.sellGrid.store.loadData(data.s);
                if (!silent) {
                    helper.setLoading(me.compRef.mainCt, false);
                }
            }
        });
    },
    focusSearchBox: function() {
        focusManager.focusSearchbox(this.compRef.bkListCb);
    },
    syncBuffer: function(exch, bkCode) {
        var me = this;
        me.setBroker(exch, bkCode);

        me._needReload = true;
    },
    setBroker: function(exch, bkCode, refresh) {
        var me = this;
        var bkRec = brokerList.getBrokerRecord(exch, bkCode);

        if (bkRec) {
            me.compRef.bkListCb.setValue(bkRec['bkCode']);
            me.compRef.bkCodeCb.store.loadData(me.createCodeRecords(bkRec['codes']));
            me.compRef.bkCodeCb.setValue(bkCode);

            if (refresh) {
                me.loadBrokerQStocks();
            } else {
                me.compRef.buyGrid.store.loadData([]);
                me.compRef.sellGrid.store.loadData([]);
            }
        }

    },
    switchRefresh: function() {
        var me = this;

        if (me._needReload) {
            me._needReload = false;
            me.loadBrokerQStocks();
        }

        Storage.refresh();
    }
});

// from n2ncomponents.js
if (n2ncomponents) {
    n2ncomponents.createBreakEvenCalc = function(conf, tabCt) {
    	if (!tabCt && n2nLayoutManager.activateBuffer('bc')) {
            return;
        }
    	
    	var me = this;
        if (me.debug) {
            console.log('n2ncomponents > createBreakEvenCalc');
        }

        if (!me.breakEvenCalc) {
            if (me.debug) {
                console.log('creating breakEvenCalc...');
            }

            me.breakEvenCalc = Ext.create('widget.fcalculator', Ext.apply({
            	title: languageFormat.getLanguage(20622, 'Breakeven Calculator'),
                exCode: exchangecode,
                initMax: true,
                type: 'bc',
                savingComp: true,
                ddComp: true
            }, conf));
            me.breakEvenCalc.on('beforedestroy', function() {
                me.breakEvenCalc = null;
            });

            n2nLayoutManager.addItem(me.breakEvenCalc, null, null, tabCt);
        }

        if (me.debug) {
            console.log('activate breakEvenCalc...');
        }
        
        n2nLayoutManager.activateItem(me.breakEvenCalc);
    };

    n2ncomponents.createAnalysisWarrants = function(conf, tabCt) {
    	if (!tabCt && n2nLayoutManager.activateBuffer('aw')) {
            return;
        }
    	
        var me = this;
        var params = [
                      'rate=0',
                      'BHCode=' + bhCode,
                      'ft=' + gl_fonttype,
                      'fs=' + globalFontSize,
                      'lang=' + global_Language,
                      'exchg=' + exchangecode,
                      'color=' + formatutils.procThemeColor()
                  ];
        
        //var anwURL = analysisWarrantsURL + '?rate=0&BHCode=' + bhCode + '&lang=en&exchg=' + exchangecode + '&' + new Date().getTime();
        var anwURL = helper.addUrlParams(analysisWarrantsURL, params.join('&'));

        if (N2N_CONFIG.newWin_Analysis) { // TO REVIEW
            if (window.name == "analysis_warrants")
                window.name = "";

            msgutil.openURL({
                url: anwURL,
                name: 'analysis_warrants'
            });
        } else {
            var anWarrants = me.userReports['Analysis_Warrants'];
            if (anWarrants == null) {
                var anWarrants = Ext.create('Ext.ux.IFrame', Ext.apply({
                    title: languageFormat.getLanguage(20142, 'Warrants'),
                    type: 'aw',
                    ddComp: true,
                    savingComp: true,
                    initMax: true
                }, conf));

                anWarrants.on('beforedestroy', function() {
                    me.userReports['Analysis_Warrants'] = null;
                });
                me.userReports['Analysis_Warrants'] = anWarrants;
                n2nLayoutManager.addItem(anWarrants, null, null, tabCt);
            } 
            
            n2nLayoutManager.activateItem(anWarrants);
            helper.runAfterCompRendered(anWarrants, function() {
            	anWarrants.refresh(anwURL);
            });
        }
    };

    n2ncomponents.createAnalysisDividend = function(conf, tabCt) {
    	if (!tabCt && n2nLayoutManager.activateBuffer('ad')) {
            return;
        }
    	
        var me = this;
        var params = [
                      'rate=0',
                      'BHCode=' + bhCode,
                      'ft=' + gl_fonttype,
                      'fs=' + globalFontSize,
                      'lang=' + global_Language,
                      'exchg=' + exchangecode,
                      'color=' + formatutils.procThemeColor()
                  ];
        
        //var andURL = analysisDividendURL + '?refresh=0&BHCode=' + bhCode + '&lang=en&exchg=' + exchangecode + '&' + new Date().getTime();
        var andURL = helper.addUrlParams(analysisDividendURL, params.join('&'));
        
        if (N2N_CONFIG.newWin_Analysis) {
            if (window.name == "analysis_dividend")
                window.name = "";

            msgutil.openURL({
                url: andURL,
                name: 'analysis_dividend'
            });
        } else {
            var anDividend = me.userReports['Analysis_Dividend'];
            if (anDividend == null) {
                anDividend = Ext.create('Ext.ux.IFrame', Ext.apply({
                    title: languageFormat.getLanguage(20141, 'Dividend'),
                    type: 'ad',
                    ddComp: true,
                    savingComp: true,
                    initMax: true,
                    winConfig: {
                        width: 820
                    }
                }, conf));

                anDividend.on('beforedestroy', function() {
                    me.userReports['Analysis_Dividend'] = null;
                });

                me.userReports['Analysis_Dividend'] = anDividend;
                n2nLayoutManager.addItem(anDividend, null, null, tabCt);
            } 
            
            n2nLayoutManager.activateItem(anDividend);
            helper.runAfterCompRendered(anDividend, function() {
            	anDividend.refresh(andURL);
            });
        }
    };

    n2ncomponents.createAnalysisBMD_Future = function(conf, tabCt) {
    	if (!tabCt && n2nLayoutManager.activateBuffer('abf')) {
            return;
        }
    	
        var me = this;
        var params = [
                      'ft=' + gl_fonttype,
                      'fs=' + globalFontSize,
                      'lang=' + global_Language,
                      'color=' + formatutils.procThemeColor()
                  ];
        
        var bmdURL = helper.addUrlParams(analysisBMFuturesURL, params.join('&'));

        if (N2N_CONFIG.newWin_Analysis) {
            if (window.name == "analysis_bmf_futures")
                window.name = "";

            msgutil.openURL({
                url: bmdURL,
                name: 'analysis_bmf_futures'
            });
        } else {
            var anBmf = me.userReports['Analysis_BMFutures'];
            if (anBmf == null) {
                var anBmf = Ext.create('Ext.ux.IFrame', Ext.apply({
                    title: languageFormat.getLanguage(20143, 'BMD Futures'),
                    type: 'abf',
                    ddComp: true,
                    savingComp: true,
                    initMax: true
                }, conf));

                anBmf.on('beforedestroy', function() {
                    me.userReports['Analysis_BMFutures'] = null;
                });
                me.userReports['Analysis_BMFutures'] = anBmf;

                n2nLayoutManager.addItem(anBmf, null, null, tabCt);
            }
            
            n2nLayoutManager.activateItem(anBmf);
            helper.runAfterCompRendered(anBmf, function() {
            	anBmf.refresh(bmdURL);
            });
        }
    };

    n2ncomponents.settingUI = function() {
        var me = this;
        var settingGenItems = new Array();
        var settingFontItems = new Array();
        var fsMargin = '5px 0 5px';
        var uiSettingChanged = false;
        var fontSettingChanged = false;
        var tradeSettingChanged = false;
        var tradeAccOrderChanged = false;
        var tradeQtyStepsChanged = false
        var layoutSettingChanged = false;
        var checkDuplicateChanged = false;
        var layoutChanged = false;
        var doSaveSetting = false;
        var trdAccGd;
        var qtyStepsValue = userPreference.get('tqs') ? parseInt(userPreference.get('tqs'), 10) : N2N_CONFIG.qtyScrollStep;
        var settingWin = null;

        var _toggleSaveBtn = function() {
            if (settingSaveBtn) {
                if (uiSettingChanged || fontSettingChanged || tradeSettingChanged || tradeAccOrderChanged || tradeQtyStepsChanged || layoutSettingChanged || checkDuplicateChanged) {
                    settingSaveBtn.enable();
                    settingApplyBtn.enable();
                } else {
                    settingSaveBtn.disable();
                    settingApplyBtn.disable();
                }
            } else {
                // fixed issues for too early check from change event in some controls
                uiSettingChanged = false;
                fontSettingChanged = false;
                tradeSettingChanged = false;
                tradeAccOrderChanged = false;
                tradeQtyStepsChanged = false;
                layoutSettingChanged = false;
                checkDuplicateChanged = false;
            }
        };

        var _isSpecificValue = function(value) {
            return value == defAccValues.SPECIFIC;
        };
//      Font Size        
        var fontSizeItem = null;
        
        var fontStr = "";
        var alter, fonttype;
        alter = gl_alter;
        fonttype = gl_fonttype;
        if (jsutil.toBoolean(showUISettingItem[5]) && !isMobile) {
            fontSizeItem = Ext.create("Ext.form.field.Number", {
                fieldLabel: languageFormat.getLanguage(21118, 'Size'),
                value: globalFontSize,
                labelStyle: "padding-left: 15px;",
                width: "130px",
                minValue: minFontSize,
                maxValue: maxFontSize,
                editable: false,
                labelWidth: 70,
                listeners: {
                    change: function(thisComp, newValue, oldValue) {
                        if (newValue <= maxFontSize && newValue >= minFontSize) {
                            changeFontSize(newValue);
                            fontSettingChanged = true;
                            _toggleSaveBtn();
                        }
                    }
                }
            });
            settingFontItems.push({
                xtype: 'container',
                items: fontSizeItem,
                margin: fsMargin
            });
        }
        var fontTypeItem;
        if (jsutil.toBoolean(showUISettingItem[6]) && !isMobile) {
            var font = Ext.create('Ext.data.Store', {
                fields: ['font', 'name'],
                data: fontTypeItemsArr
            });
            fontTypeItem = Ext.create("Ext.form.field.ComboBox", {
                fieldLabel: languageFormat.getLanguage(21119, 'Type'),
                value: gl_fonttype,
                labelStyle: "padding-left: 15px;",
                width: "160px",
                editable: false,
                displayField: "name",
                valueField: "font",
                labelWidth: 70,
                store: font,
                tpl: Ext.create('Ext.XTemplate',
                        '<tpl for=".">',
                        '<li class="x-boundlist-item" style="font-family:{font}">',
                        '{name}',
                        '</li>',
                        '</tpl>'
                        ),
                _updateInputFont: function(newFont) {
                    if (newFont) {
                        this.inputEl.setStyle({
                            'font-family': newFont
                        });
                    }
                },
                listeners: {
                    afterrender: function() {
                        this._updateInputFont(this.getValue());
                    },
                    change: function(thisComp, newValue, oldValue) {
                        // var detective = new Detector();
                        // var isSupported = detective.detect(newValue);
                        
                        fonttype = newValue;
                        this._updateInputFont(newValue);
                        changeTextFont(newValue);
                        fontSettingChanged = true;
                        _toggleSaveBtn();
                        
                        /*
                        if (isSupported) {
                            
                        } else {
                            msgutil.alert(languageFormat.getLanguage(31401, "Font type is not supported"));
                        }
                        */
                        
                    }
                }
            });
            settingFontItems.push({
                xtype: 'container',
                items: fontTypeItem,
                margin: fsMargin
            });
        }
        
        var fontUpItem, fontDownItem, fontUnchangeItem, fontYellowItem;
        
        var loadFontColors = function() {
            
            if (isBlackTheme(settingWin.themeRdg)) {
                fontUpItem.setValue(up_b);
                fontDownItem.setValue(down_b);
                fontUnchangeItem.setValue(unchg_b);
                fontYellowItem.setValue(yel_b);
            } else {
                fontUpItem.setValue(up_w);
                fontDownItem.setValue(down_w);
                fontUnchangeItem.setValue(unchg_w);
                fontYellowItem.setValue(yel_w);
            }
            
        };
        
        if (jsutil.toBoolean(showUISettingItem[7]) && !isMobile) {
            var hidUp = Ext.create('widget.hiddenfield', {
                listeners: {
                    change: function(thisComp, newVal, oldVal, eOpts) {
                        changeClsStyle(".n2n .N2N_FontUp", "color:#" + newVal + " !important;");
                        gl_up = newVal;
                        fontSettingChanged = true;
                        _toggleSaveBtn();
                    }
                }});
            fontUpItem = Ext.create("Ext.ux.colorpicker.ColorPickerField", {
                labelStyle: "padding-left: 5px;",
                style: "padding-bottom:5px;",
                labelWidth: 70,
                width: 110,
                fieldLabel: languageFormat.getLanguage(11031, 'Up'),
                columnWidth: 0.5,
                editable: false,
                setValue: function(value) {
                    this.setFieldStyle("background-image: none;background-color:#" + value);
                    hidUp.setValue(value);
                },
                getValue: function() {
                    return hidUp.getValue();
                }
            });
            var hidDown = Ext.create("widget.hiddenfield", {
                listeners: {
                    change: function(thisComp, newVal, oldVal, eOpts) {
                        changeClsStyle(".n2n .N2N_FontDown", "color:#" + newVal + " !important;");
                        gl_down = newVal;
                        fontSettingChanged = true;
                        _toggleSaveBtn();
                    }
                }
            });
            fontDownItem = fontUpItem.cloneConfig({
                fieldLabel: languageFormat.getLanguage(11032, 'Down'),
                setValue: function(value) {
                    this.setFieldStyle("background-image: none; background-color:#" + value);
                    hidDown.setValue(value);
                },
                getValue: function() {
                    return hidDown.getValue();
                }
            });
            var hidUnchange = Ext.create("widget.hiddenfield", {
                listeners: {
                    change: function(thisComp, newVal, oldVal, eOpts) {
                        changeClsStyle(".n2n .N2N_FontUnchange", "color:#" + newVal + " !important;");
                        gl_unchg = newVal;
                        fontSettingChanged = true;
                        _toggleSaveBtn();
                    }
                }
            });

            fontUnchangeItem = fontUpItem.cloneConfig({
                fieldLabel: languageFormat.getLanguage(11036, 'Unchanged'),
                setValue: function(value) {
                    this.setFieldStyle("background-image: none; background-color:#" + value);
                    hidUnchange.setValue(value);
                },
                getValue: function() {
                    return hidUnchange.getValue();
                }
            });

            var hidYellowItem = Ext.create("widget.hiddenfield", {
                listeners: {
                    change: function(thisComp, newVal, oldVal, eOpts) {
                        changeClsStyle(".n2n .N2N_FontUnchange_yellow", "color:#" + newVal + " !important;");
                        gl_yel = newVal;
                        fontSettingChanged = true;
                        _toggleSaveBtn();
                    }
                }
            });
            fontYellowItem = fontUpItem.cloneConfig({
                fieldLabel: languageFormat.getLanguage(11008, 'Volume'),
                hidden: !isNumberYellowColumn,
                setValue: function(value) {
                    this.setFieldStyle("background-image: none; background-color:#" + value);
                    hidYellowItem.setValue(value);
                },
                getValue: function() {
                    return hidYellowItem.getValue();
                }
            });

            settingFontItems.push({
                xtype: "fieldset",
                layout: "column",
                title: languageFormat.getLanguage(21120, 'Color'),
                items: [fontUpItem, fontDownItem, fontUnchangeItem, fontYellowItem],
                margin: fsMargin
            });
        }
        // Theme setting
        if (jsutil.toBoolean(showUISettingItem[0])) {
            var themeRdg = Ext.create('Ext.form.RadioGroup', {
                width: '100%!important;', // needs important or not work
                height: 22,
                labelWidth: 50,
                vertical: true,
                columns: 2,
                items: [
                    {
                        boxLabel: languageFormat.getLanguage(21140, "Lite"),
                        name: "themeRdg",
                        inputValue: "wh"
                    },
                    {
                        boxLabel: languageFormat.getLanguage(21141, "Dark"),
                        name: "themeRdg",
                        inputValue: "wh_black"
                    }
                ],
                value: {
                    themeRdg: global_personalizationTheme
                },
                listeners: {
                    change: function(thisComp, newValue) {
                        if (newValue.themeRdg) {
                            settingWin.themeRdg = newValue.themeRdg;
                            uiSettingChanged = true;
                            _toggleSaveBtn();
                            setThemeCSS(newValue.themeRdg, settingWin.alternative);
                            loadFontColors();
                        }
                    }
                }
            });

            settingGenItems.push({
                xtype: 'fieldset',
                title: languageFormat.getLanguage(20604, 'Theme'),
                items: themeRdg,
                margin: fsMargin
            });

        }

        // Unit/Lot setting
        if (jsutil.toBoolean(showUISettingItem[1])) {
            var unitRdg = Ext.create('Ext.form.RadioGroup', {
                width: '100%!important;',
                height: 22,
                labelWidth: 50,
                vertical: true,
                columns: 2,
                items: [
                    {
                        boxLabel: languageFormat.getLanguage(21097, 'Unit'),
                        name: 'unitRdg',
                        inputValue: 'unit'
                    },
                    {
                        boxLabel: languageFormat.getLanguage(21098, 'Lot'),
                        name: 'unitRdg',
                        inputValue: 'lot'
                    }
                ],
                value: {
                    unitRdg: global_displayUnit.toLowerCase()
                },
                listeners: {
                    change: function(thisComp, newValue) {
                        settingWin.unitRdg = newValue.unitRdg;
                        uiSettingChanged = true;
                        _toggleSaveBtn();
                    }
                }
            });

            settingGenItems.push({
                xtype: 'fieldset',
                title: languageFormat.getLanguage(21097, 'Unit') + '/' + languageFormat.getLanguage(21098, 'Lot'),
                items: unitRdg,
                margin: fsMargin
            });

        }

        if (jsutil.toBoolean(showUISettingItem[2]) && !isMobile) {
            // News setting
            var newsRdg = Ext.create('Ext.form.RadioGroup', {
                width: '100%!important;',
                height: 22,
                labelWidth: 50,
                vertical: true,
                columns: 2,
                items: [
                    {
                        boxLabel: languageFormat.getLanguage(21095, 'Open inside'),
                        name: 'newsRdg',
                        inputValue: '0'
                    },
                    {
                        boxLabel: languageFormat.getLanguage(21096, 'Open new tab'),
                        name: 'newsRdg',
                        inputValue: '1'
                    }
                ],
                value: {
                    newsRdg: global_newsSetting
                },
                listeners: {
                    change: function(thisComp, newValue) {
                        settingWin.newsRdg = newValue.newsRdg;
                        uiSettingChanged = true;
                        _toggleSaveBtn();
                    }
                }
            });

            settingGenItems.push({
                xtype: 'fieldset',
                title: languageFormat.getLanguage(10121, 'News') + '/' + languageFormat.getLanguage(20103, 'Chart'),
                items: newsRdg,
                margin: fsMargin
            });

        }

        if (jsutil.toBoolean(showUISettingItem[3]) && !isMobile) {
            // Report setting
            var reportRdg = Ext.create('Ext.form.RadioGroup', {
                width: '100%!important;',
                height: 22,
                labelWidth: 50,
                vertical: true,
                columns: 2,
                items: [
                    {
                        boxLabel: languageFormat.getLanguage(21095, 'Open inside'),
                        name: 'reportRdg',
                        inputValue: '0'
                    },
                    {
                        boxLabel: languageFormat.getLanguage(21096, 'Open new tab'),
                        name: 'reportRdg',
                        inputValue: '1'
                    }
                ],
                value: {
                    reportRdg: global_reportSetting
                },
                listeners: {
                    change: function(thisComp, newValue) {
                        settingWin.reportRdg = newValue.reportRdg;
                        uiSettingChanged = true;
                        _toggleSaveBtn();
                    }
                }
            });

            settingGenItems.push({
                xtype: 'fieldset',
                title: languageFormat.getLanguage(20242, 'Reports') + '/' + languageFormat.getLanguage(21405, 'Services'),
                items: reportRdg,
                margin: fsMargin
            });

        }

        if (jsutil.toBoolean(showUISettingItem[4]) && !isMobile) {
            // Dynamic limit popup setting
            var dyLimitRdg = Ext.create('Ext.form.RadioGroup', {
                width: '100%!important;',
                height: 22,
                labelWidth: 130,
                vertical: true,
                columns: 2,
                items: [
                    {
                        boxLabel: languageFormat.getLanguage(21109, 'On'),
                        name: 'dyLimitRdg',
                        inputValue: '0'
                    },
                    {
                        boxLabel: languageFormat.getLanguage(21110, 'Off'),
                        name: 'dyLimitRdg',
                        inputValue: '1'
                    }
                ],
                value: {
                    dyLimitRdg: global_dynamicLimitSetting
                },
                listeners: {
                    change: function(thisComp, newValue) {
                        settingWin.dyLimitRdg = newValue.dyLimitRdg;
                        uiSettingChanged = true;
                        _toggleSaveBtn();
                    }
                }
            });

            settingGenItems.push({
                xtype: 'fieldset',
                title: languageFormat.getLanguage(21116, 'Dynamic Limit Popup'),
                items: dyLimitRdg,
                margin: fsMargin
            });
        }
        var alternativeRdg = null;
        if (jsutil.toBoolean(showUISettingItem[8]) && !isMobile) {
            alternativeRdg = Ext.create('Ext.form.RadioGroup', {
                width: '100%!important;',
                height: 22,
                labelWidth: 130,
                vertical: true,
                columns: 2,
                items: [
                    {
                        boxLabel: languageFormat.getLanguage(21109, 'On'),
                        name: 'alternativeRdg',
                        inputValue: '0'
                    },
                    {
                        boxLabel: languageFormat.getLanguage(21110, 'Off'),
                        name: 'alternativeRdg',
                        inputValue: '1'
                    }
                ],
                value: {
                    alternativeRdg: gl_alter
                },
                listeners: {
                    change: function(thisComp, newValue) {
                        fontSettingChanged = true;
                        settingWin.alternative = newValue.alternativeRdg;
                        setAltStyle(newValue.alternativeRdg, settingWin.themeRdg);
                        alter = newValue.alternativeRdg;
                        _toggleSaveBtn();
                    }
                }
            });

            settingGenItems.push({
                xtype: 'fieldset',
                title: languageFormat.getLanguage(21121, 'Alternate Row Shading'),
                items: alternativeRdg,
                margin: fsMargin
            });
        }
        var brokerMapRdg = null;
        if (jsutil.toBoolean(showUISettingItem[9]) && !isMobile) {
        	brokerMapRdg = Ext.create('Ext.form.RadioGroup', {
                width: '100%!important;',
                height: 22,
                labelWidth: 130,
                vertical: true,
                columns: 2,
                items: [
                    {
                        boxLabel: languageFormat.getLanguage(10101, 'Code'),
                        name: 'brokerMapRdg',
                        inputValue: '0'
                    },
                    {
                        boxLabel: languageFormat.getLanguage(10701, 'Name'),
                        name: 'brokerMapRdg',
                        inputValue: '1'
                    }
                ],
                value: {
                	brokerMapRdg: global_brokerListMapping
                },
                listeners: {
                    change: function(thisComp, newValue) {
                        settingWin.brokerMapRdg = newValue.brokerMapRdg;
                        uiSettingChanged = true;
                        _toggleSaveBtn();
                    }
                }
            });

            settingGenItems.push({
                xtype: 'fieldset',
                title: languageFormat.getLanguage(21161, 'BrokerListMapping'),
                items: brokerMapRdg,
                margin: fsMargin
            });
        }
        
        var isSuccess = false;
        var saveUIHandler = function() {
            doSaveSetting = true;

            if (uiSettingChanged) {
                var settingUrl = [
                    addPath,
                    "tcplus/setting?a=set&sc=TCLPTHEME&p=",
                    settingWin.themeRdg, '~',
                    settingWin.unitRdg, '~',
                    'news,', settingWin.newsRdg, '-',
                    'rpt,', settingWin.reportRdg, '-',
                    'dl,', settingWin.dyLimitRdg, '-',
                    'fs,', '', '-', // will be ignored and use from TCLFS (font setting) instead
                    'na,', global_noAsk, '-',
                    'nt,', 1, '-', // later on the selected theme will take effect
                    'lang,', global_Language, '-',
                    'bm,', settingWin.brokerMapRdg
                ].join('');

                settingWin.closeAction = "hide";
                settingWin.close();
                settingWin.closeAction = "destroy";
                
                // need to update to new theme first since other setting depends on it
                var themeChanged = global_personalizationTheme !== settingWin.themeRdg;
                if (themeChanged) {
                    global_personalizationTheme = settingWin.themeRdg;
                }
                
                Ext.Ajax.request({
                    url: settingUrl,
                    success: function() {
                        global_newsSetting = settingWin.newsRdg;
                        global_reportSetting = settingWin.reportRdg;
                        global_NewWindow_News = global_newsSetting;
                        global_NewWindow_Report = global_reportSetting;
                        global_dynamicLimitSetting = settingWin.dyLimitRdg;
                        
                        if (themeChanged) {
                            // refresh market depth to get gradient take effected
                            if (helper.inView(marketDepthMatrixPanel) && marketDepthMatrixPanel.itemsMarketDepth[0] && marketDepthMatrixPanel.itemsMarketDepth[0].isGradient === "gradient") {
                                marketDepthMatrixPanel.refresh();
                            }
                            
                            if (helper.inView(quoteScreen) && quoteScreen.isCardView && quoteScreen.cardComp.itemsMarketDepth[0] && quoteScreen.cardComp.itemsMarketDepth[0].isGradient === "gradient") {
                                quoteScreen.cardComp.refresh();
                            }
                            
                            refreshViewMarketDepth();

                            //reload web urls
                            reloadWebUrls();
                            
                            // reload iframe chart
                            reloadAllCharts();
                        }

                        isSuccess = true;
                        // refresh only when change unit
                        if (settingWin.unitRdg != global_displayUnit) {
                        	global_displayUnit = settingWin.unitRdg;
                        	conn.forceSubscribeFeed();
                        	if (trackerPanels && trackerPanels.length > 0) {
                        		trackerPanels[0].forceRefresh();
                        	}
                                
                                // refresh streamer
                                if (marketStreamer) {
                                    marketStreamer.refreshAllGrids();
                                }
                                
                                if (trackerRecord) {
                                    trackerRecord.refreshRecords();
                                }
                        }
                        
                        if(settingWin.brokerMapRdg != global_brokerListMapping){
                        	global_brokerListMapping = settingWin.brokerMapRdg;
                        	if(trackerRecord){
                        		trackerRecord.reset();
                        	}
                        }
                        
                        settingWin.close();
                    },
                    failure: function() {
                        settingWin.close();
                    }
                });

            }

            if (fontSettingChanged) {
                var fontSizeValue = !fontSizeItem ? globalFontSize : fontSizeItem.getValue();
                var fontChanged = false;

                if (fontSizeItem && globalFontSize != fontSizeValue) {
                    globalFontSize = fontSizeValue;
                    changeFontSize(globalFontSize, true);
                    fontChanged = true;
                }
                
                if (jsutil.toBoolean(showUISettingItem[7]) && !isMobile) {
                    if (isBlackTheme(global_personalizationTheme)) {
                        up_b = gl_up;
                        down_b = gl_down;
                        unchg_b = gl_unchg;
                        yel_b = gl_yel;
                    } else {
                        up_w = gl_up;
                        down_w = gl_down;
                        unchg_w = gl_unchg;
                        yel_w = gl_yel;
                    }
                }

                fontStr = "ft_" + fonttype + "{" + globalFontSize + ",fcl_up~" + up_w + "~" + up_b + "_down~" + down_w + "~" + down_b + "_unchg~" + unchg_w + "~" + unchg_b + "_yel~" + yel_w + "~" + yel_b + ",alter_" + alter;
                
                if (fontStr != fontSaving.join(',')) {
                    fontChanged = true;
                    gl_alter = alter;
                    gl_fonttype = fonttype;
                    fontSaving = fontStr.split(",");

                    var fontUrl = addPath + "tcplus/setting?a=set&sc=TCLFS";
                    Ext.Ajax.request({
                        url: fontUrl,
                        method: 'POST',
                        params:{p:fontStr},
                        success: function() {
                            
                        }
                    });
                }

                if (fontChanged) {
                    setFontStyle();
                    createFmx0(settingWin.prevFontType, settingWin.prevFontSize);
                    createFmx();
                    adjustColWidths();
                    
                    if (orderPad) {
                        orderPad.ajdustAllLabels();
                    }
                    
                    cookies.createCookie(loginId + '_LastFont', gl_fonttype + fontSizeDel + globalFontSize, 1800);
                }

                if (!uiSettingChanged) {
                    settingWin.close();
                }
            }

            // Saves trading setting
            if (tradeSettingChanged) {
                me.requestSaveDefaultTradingAccountSetting();
                if (!uiSettingChanged && !fontSettingChanged) {
                    settingWin.close();
                }
            }

            // Saves trading account order
            if (tradeAccOrderChanged) {
                me.requestSaveAccountOrder(trdAccGd);
                if (!uiSettingChanged && !fontSettingChanged && !tradeSettingChanged) {
                    settingWin.close();
                }
            }
            
            if(tradeQtyStepsChanged){
            	userPreference.set('tqs', qtyStepsValue);
            	orderPad.compRef.qtyCT.step = parseInt(qtyStepsValue, 10);
            	userPreference.save();
            	if (!uiSettingChanged && !fontSettingChanged && !tradeSettingChanged && !tradeAccOrderChanged) {
            		settingWin.close();
            	}
            }

            if (layoutSettingChanged) {
                var layoutPrChanged = false;
                
                if (layoutChanged) {
                    if (n2nLayoutManager.isWindowLayout()) {
                        layoutProfileManager.requestSaveProfileLayout();
                        layoutPrChanged = true;
                    }
                }

                var curSubLayout = layoutProfileManager.getProfileSubLayout();
                if (curSubLayout != settingWin.subLayout) {
                    layoutProfileManager.layoutPreference.set(layoutProfileManager.getActiveProfile(), settingWin.subLayout);
                    layoutPrChanged = true;
                }
                
                if (settingWin.openAs !== layoutProfileManager.getOpenAs()) {
                    layoutProfileManager.setOpenAs(settingWin.openAs);
                    layoutPrChanged = true;
                }
                
                if (settingWin.remember !== layoutProfileManager.getRememberLastLayout()) {
                    layoutProfileManager.setRememberLastLayout(settingWin.remember);
                    layoutPrChanged = true;
                }
                
                var appLayoutChanged = false;
                if (settingWin.appLayout !== layoutProfileManager.getMainLayout()) {
                    layoutProfileManager.setMainLayout(settingWin.appLayout);
                    layoutPrChanged = true;
                    appLayoutChanged = true;
                }

                if (layoutPrChanged) {
                    if (appLayoutChanged) {
                        layoutProfileManager.saveLayoutPreference(false, function() {
                            n2nLayoutManager.setLoading(true);
                            location.reload();
                        }, function() {
                            n2nLayoutManager.setLoading(false);
                        });
                    } else {
                        layoutProfileManager.saveLayoutPreference();
                    }
                }
                
                if (!uiSettingChanged && !fontSettingChanged && !tradeSettingChanged && !tradeAccOrderChanged && !tradeQtyStepsChanged) {
                    settingWin.close();
                }
                
            }

            //Save if apply
            if (checkDuplicateChanged) {
                if (duplicateOrder.value.duplicateOrder == '1') {
                    userPreference.set('confirmDup', '1');
                } else {
                    userPreference.set('confirmDup', '0');
                }
                userPreference.save();
                settingWin.close();
            }

        };
            
        var settingSaveBtn = Ext.create('Ext.button.Button', {
            text: languageFormat.getLanguage(21045, 'Save'),
            tooltip: languageFormat.getLanguage(21045, 'Save'),
            iconCls: 'icon-save', 
            disabled: true,
            handler: saveUIHandler,
            hidden: true
        });
        
        var settingApplyBtn = Ext.create('Ext.button.Button', {
            text: languageFormat.getLanguage(20618, 'Apply'),
            disabled: true,
            handler: saveUIHandler,
            cls: 'flatbtn applybtn'
        });
        
        var btnDefault = Ext.create("Ext.button.Button", {
            text: languageFormat.getLanguage(21115, 'Default'),
            cls: 'flatbtn applybtn',
            hidden: true,
            handler: function() {
                var fontObj = getDefaultFontSettings(settingWin.themeRdg);

                if (jsutil.toBoolean(showUISettingItem[7]) && !isMobile) {
                    if (fontObj.up) {
                        fontUpItem.setValue(fontObj.up);
                    }
                    if (fontObj.down) {
                        fontDownItem.setValue(fontObj.down);
                    }
                    if (fontObj.unchg) {
                        fontUnchangeItem.setValue(fontObj.unchg);
                    }
                    if (fontObj.yellow) {
                        fontYellowItem.setValue(fontObj.yellow);
                    }
                }

                if (jsutil.toBoolean(showUISettingItem[6]) && !isMobile && fontObj.fontType) {
                    fontTypeItem.setValue(fontObj.fontType);
                }

                if (jsutil.toBoolean(showUISettingItem[5]) && !isMobile && fontObj.fontSize) {
                    fontSizeItem.setValue(fontObj.fontSize);
                }

            }
        });

        var settingCancelBtn = Ext.create('Ext.button.Button', {
            text: languageFormat.getLanguage(10010, 'Cancel'),
            handler: function() {
                settingWin.close();
            }
        });

        var stpItems = [];
        
     // Layout settings
        var layoutSettingTab;
        var layoutSettingItems = [];
        var lsItems = N2N_CONFIG.layoutSettingItems;
        if (N2N_CONFIG.layoutSetting) {
            // backup current layout
            n2nLayoutManager.backupLayout();

            // layout dropdown
            var layoutDdItems = [];

            if (!isMobile && lsItems.indexOf(APP_LAYOUT.WINDOW) > -1) {
                layoutDdItems.push({
                    label: languageFormat.getLanguage(21130, 'Tab-Popup'),
                    value: APP_LAYOUT.WINDOW
                });
            }

            if (!isMobile && lsItems.indexOf(APP_LAYOUT.PORTAL) > -1) {
                layoutDdItems.push({
                    label: languageFormat.getLanguage(21112, 'Docked'),
                    value: APP_LAYOUT.PORTAL
                });
            }

            if (layoutDdItems.length > 1) {
                layoutSettingItems.push({
                    xtype: 'combobox',
                    store: {
                        fields: ['label', 'value'],
                        data: layoutDdItems
                    },
                    displayField: 'label',
                    valueField: 'value',
                    padding: 10,
                    editable: false,
                    value: n2nLayoutManager.getAppLayout(),
                    listeners: {
                        change: function(thisComp, newValue) {
                            if (newValue == APP_LAYOUT.WINDOW) {
                                subLayoutFs.show();
                                // display previous sub layout
                                var prevSubLayout = n2nLayoutManager.lyConf.getSubLayout(APP_LAYOUT.WINDOW);
                                subLayoutView.getSelectionModel().select(prevSubLayout - 1);
                                openAsFs.show();
                            } else {
                                subLayoutFs.hide();
                                openAsFs.hide();
                            }
                            
                            settingWin.appLayout = newValue;
                            layoutSettingChanged = true;
                            _toggleSaveBtn();
                        }
                    }
                });
            }

            // layout type
            if (!isMobile && lsItems.indexOf(APP_LAYOUT.WINDOW) > -1) {
            	var subItems = [];
                var layoutItems = N2N_CONFIG.layoutOptions.split(',');
                var rowHeight = 40;
                var iconsPerRow = 5;

                for (var i = 0; i < layoutItems.length; i++) {
                    var iconCls = 'icon-layout icon-layout-' + layoutItems[i];
                    subItems.push({iconCls: iconCls, value: layoutItems[i]});
                }
                var rowNum = Math.ceil(layoutItems.length / iconsPerRow);
                var viewHeight = rowNum * rowHeight;

                var subStore = Ext.create('Ext.data.Store', {
                    fields: [
                        {name: 'iconCls', type: 'string'},
                        {name: 'value', type: 'string'}
                    ],
                    data: subItems
                });

                var subLayoutTpl = new Ext.XTemplate(
                        '<tpl for=".">',
                        '<div class="force_black thumb-wrap">',
                        '<div class="{iconCls}"></div>',
                        '</div>',
                        '</tpl>'
                        );
                
                var subLayoutView = Ext.create('Ext.view.View', {
                    store: subStore,
                    tpl: subLayoutTpl,
                    height: viewHeight,
                    trackOver: true,
                    overItemCls: 'x-item-over',
                    itemSelector: 'div.thumb-wrap',
                    autoScroll: true,
                    listeners: {
                        afterrender: function(thisView) {
                            // select currently used sub layout
                            var rec = thisView.store.findRecord('value', n2nLayoutManager.getSubLayout());
                            if (rec) {
                                thisView.getSelectionModel().select(rec, false, true);
                            }
                        },
                        itemclick: function(thisComp, record) {
                            var value = record.get('value');
                            var resetLayout = settingWin.subLayout === value; // click the same layout to reset to default
                            settingWin.subLayout = value;
                            layoutSettingChanged = true;
                            layoutChanged = true;
                            _toggleSaveBtn();

                            if (n2nLayoutManager.isWindowLayout()) {
                                var layoutStr = null;
                                if (resetLayout) {
                                    layoutStr = layoutProfileManager.getDefaultProfileLayout(value);
                                }

                                n2nLayoutManager.loadLayout(value, layoutStr);
                            }
                        }
                    }
                });
                
                var subLayoutFs = Ext.create('widget.fieldset', {
                    xtype: 'fieldset',
                    title: languageFormat.getLanguage(21146, 'Layouts (Preview)'),
                    items: subLayoutView,
                    hidden: !n2nLayoutManager.isWindowLayout()
                });
                layoutSettingItems.push(subLayoutFs);

                var openAsRg = Ext.create('Ext.form.RadioGroup', {
                    xtype: 'radiogroup',
                    columns: 1,
                    items: [
                        {
                            boxLabel: languageFormat.getLanguage(21145, 'Open as popup'),
                            name: 'openAsRadio',
                            inputValue: '0'
                        },
                        {
                            boxLabel: languageFormat.getLanguage(21144, 'Open as tab'),
                            name: 'openAsRadio',
                            inputValue: '1'
                        }
                    ],
                    value: {
                        openAsRadio: layoutProfileManager.getOpenAs()
                    },
                    listeners: {
                        change: function(thisComp, newValue) {
                            settingWin.openAs = newValue.openAsRadio;
                            layoutSettingChanged = true;
                            _toggleSaveBtn();
                        }
                    }
                });
                
                var openAsFs = Ext.create('widget.fieldset', {
                    xtype: 'fieldset',
                    title: languageFormat.getLanguage(21143, 'New Screen'),
                    items: openAsRg,
                    hidden: !n2nLayoutManager.isWindowLayout()
                });
                
                // default open
                layoutSettingItems.push(openAsFs);
            }
            
            /*
            var rememberRg = Ext.create('Ext.form.RadioGroup', {
                xtype: 'radiogroup',
                columns: 1,
                items: [
                    {
                        boxLabel: languageFormat.getLanguage(21132, 'Last Saved Layout'),
                        name: 'rememberRadio',
                        inputValue: '1'
                    },
                    {
                        boxLabel: languageFormat.getLanguage(21133, 'Default Layout'),
                        name: 'rememberRadio',
                        inputValue: '0'
                    }
                ],
                value: {
                    rememberRadio: jsutil.boolToStr(layoutProfileManager.getRememberLastLayout(), '1', '0')
                },
                listeners: {
                    change: function(thisComp, value) {
                        settingWin.remember = jsutil.toBoolean(value.rememberRadio);
                        layoutSettingChanged = true;
                        _toggleSaveBtn();
                    }
                }
            });
            
            layoutSettingItems.push({
                xtype: 'fieldset',
                title: languageFormat.getLanguage(21134, 'Remember'),
                items: rememberRg
            });
            */
           
            var rememberCb = Ext.create('Ext.form.field.Checkbox', {
                boxLabel: languageFormat.getLanguage(21153, 'Automatically remember last layout'),
                checked: layoutProfileManager.getRememberLastLayout(),
                style: 'margin-left:10px',
                handler: function(thisCb, status) {
                    settingWin.remember = status;
                    layoutSettingChanged = true;
                    _toggleSaveBtn();
                }
            });
            layoutSettingItems.push(rememberCb);
        }
        
        if (layoutSettingItems.length > 0) {
            layoutSettingTab = {
                title: languageFormat.getLanguage(20605, 'Layout'),
                items: layoutSettingItems,
                border: false,
                padding: 0,
                margin: fsMargin
            };
            stpItems.push(layoutSettingTab);
        }
        
        stpItems.push({
        	title: languageFormat.getLanguage(21122, 'UI'),
        	items: settingGenItems,
        	bodyStyle: "background-color: transparent;color: #000;",
        	autoScroll: true,
        	border: false
        });

        if (settingFontItems.length != 0) {
        	/*
            var btnDefault = Ext.create("Ext.button.Button", {
                text: languageFormat.getLanguage(21115, 'Default'),
                cls: 'fix_btn',
                margin: '0 0 5 20',
                handler: function() {
                    if (jsutil.toBoolean(showUISettingItem[7]) && !isMobile) {
                        fontUpItem.setValue(defaultUp);
                        fontDownItem.setValue(defaultDown);
                        fontUnchangeItem.setValue(defaultUnchange);
                        fontYellowItem.setValue(defaultYellow);
                    }
                    if (jsutil.toBoolean(showUISettingItem[6]) && !isMobile) {
                        fontTypeItem.setValue(defFontType);
                    }
                    if (jsutil.toBoolean(showUISettingItem[5]) && !isMobile) {
                        fontSizeItem.setValue(defFontSize);
                    }
                }
            });
            settingFontItems.push(btnDefault);
            */
            stpItems.push({
                title: languageFormat.getLanguage(21117, 'Font'),
                border: false,
                baseCls: "",
                items: settingFontItems
            });
        }
        
        var tradeSettingTab;
        var tradeSettingItems = [];
        
        if (N2N_CONFIG.duplicateOrderSetting) {
            // Setting for enable disable duplicate order
            var duplicateOrder = Ext.create('Ext.form.RadioGroup', {
                width: '100%!important;',
                height: 22,
                labelWidth: 130,
                vertical: true,
                columns: 2,
                items: [
                    {
                        boxLabel: languageFormat.getLanguage(21109, 'On'),
                        name: 'duplicateOrder',
                        inputValue: '1'
                    },
                    {
                        boxLabel: languageFormat.getLanguage(21110, 'Off'),
                        name: 'duplicateOrder',
                        inputValue: '0'
                    }
                ],
                value: {duplicateOrder: userPreference.get('confirmDup', '0')}, // load config from user preference
                listeners: {
                    change: function (thisComp, newValue) {
                        //Toggle save button
                        duplicateOrder.value.duplicateOrder = newValue.duplicateOrder;
                        checkDuplicateChanged = true;
                        _toggleSaveBtn();
                    }
                }
            });

            tradeSettingItems.push({
                xtype: 'fieldset',
                title: languageFormat.getLanguage(21162, 'Check Duplicate Order'),
                items: duplicateOrder,
                hidden: !N2N_CONFIG.duplicateOrderSetting,
                margin: fsMargin
            });
        };
        //End setting for duplicate order
        
        if (N2N_CONFIG.defTradeAccFeature && !isDealerRemisier) {

        	var filterOptExList = [];
            for (var ii = 0; ii < global_ExchangeList.length; ii++) {
                filterOptExList.push([global_ExchangeList[ ii ].exchange, global_ExchangeList[ ii ].exchangeName]);
            }
            
            var dexCb = Ext.create('Ext.form.field.ComboBox', {
                fieldLabel: languageFormat.getLanguage(20301, 'Exchange'),
                fieldWidth: 150,
                width: '100%',
                store: {
                    fields: ['exchange', 'exchangeName'],
                    data: filterOptExList
                },
                forceSelection: true,
                queryMode: 'local',
                displayField: 'exchangeName',
                valueField: 'exchange',
                editable: false,
                value: exchangecode,
                hidden: filterOptExList.length < 2,
                listeners: {
                    change: function(thisComp, newValue) {
                        daCb.select(defTrAccConf.getDefTrAccOpt(newValue));
                        layoutSettingChanged = true;
                        _toggleSaveBtn();
                        var specialAcc = defTrAccConf.getDefTrAccVal(newValue);
                        if(specialAcc){
                           if (isDealerRemisier) {
                                spaTf.doQuery(specialAcc, true);
                           } else {
                               spaTf.suspendEvents();
                               spaTf.setValue(specialAcc);
                               spaTf.resumeEvents(false);
                           }
                        }
                    }
                }
            });

            var daCb = Ext.create('Ext.form.field.ComboBox', {
                fieldLabel: languageFormat.getLanguage(21123, 'Default account'),
                fieldWidth: 150,
                width: '100%',
                store: {
                    fields: ['value', 'text'],
                    data: [
                        {value: '0', text: languageFormat.getLanguage(21124, 'Empty')},
                        {value: '1', text: languageFormat.getLanguage(21125, 'Last selected')},
                        {value: '2', text: languageFormat.getLanguage(21126, 'Specific account')}
                    ]
                },
                forceSelection: true,
                value: defTrAccConf.getDefTrAccOpt(exchangecode),
                queryMode: 'local',
                displayField: 'text',
                valueField: 'value',
                editable: false,
                hidden: isDealerRemisier,
                listeners: {
                    change: function(thisComp, newValue) {
                        var dex = dexCb.getValue();
                        defTrAccConf.setDefTrAccOpt(dex, newValue);

                        tradeSettingChanged = true;
                        _toggleSaveBtn();
                        if (_isSpecificValue(newValue)) {
                            spaTf.show();
                        } else {
                            spaTf.hide();
                        }
                    }
                }
            });
            var accList = accRet.ai;
            if (!isDealerRemisier) {
                arAccList = new Array();

                if (accList && accList.length > 0) {
                    for (i = 0; i < accList.length; i++) {
                        var acc = accList[i]; 
                        if (acc.ac && acc.cc) {
                            arAccList.push([acc.ac + global_AccountSeparator + acc.bc, acc.ac + ' - ' + acc.an + ' - ' + acc.bc]);
                        }
                    }
                }
            }
            var dataStore = null;
            if (pagingMode) {
                dataStore = new Ext.ux.data.PagingSimpleStore({
                    data: arAccList,
                    lastOptions: {params: {start: 0, limit: 5}}
                });
            } else {
                if(isDealerRemisier){
                    var urlbuf = new Array();

                    urlbuf.push(addPath + 'tcplus/atp/searchAcc?');
                    urlbuf.push('ExtComp=OrderPad');
                    urlbuf.push('&s=');
                    urlbuf.push(new Date().getTime());

                    var url = urlbuf.join('');
                    dataStore = Ext.create('Ext.data.Store', {
                        pageSize: N2N_CONFIG.constDRPagingSize,
                        proxy: {
                            type: 'ajax',
                            url: url,
                            reader: {
                                type: 'json',
                                rootProperty: 'ai',
                                totalProperty: 'c'
                            }
                        },
                        fields: ['accno', 'name']
                    });
                }else{
                    dataStore = Ext.create('Ext.data.ArrayStore', {
                        storeId: 'accnoStoreSetting',
                        fields: [
                                 {name: 'accno', type: 'string'},
                                 {name: 'name', type: 'string'}
                                 ],
                                 data: arAccList
                    });
                }
            }

            var spaTf = Ext.create('Ext.form.field.ComboBox', {
                itemId: 'accountnoSetting',
                queryMode: !isDealerRemisier ? 'local' : 'remote',
                forceSelection: true,
                triggerAction: 'all',
                editable: false,
                displayField: 'name',
                valueField: 'accno',
                labelAlign: 'left',
                // labelPad: 2,
                width: '100%',
                matchFieldWidth:false,
                margin: isMobile && isDealerRemisier ? '0 17 0 0' : 0,
                labelWidth: 10,
                labelSeparator: '',
                pageSize: pagingMode ? 5 : (!isDealerRemisier ? 0 : N2N_CONFIG.constDRPagingSize),
                fieldLabel: '',
                msgTarget: 'none',
                name: 'accountnoSetting',
                store: dataStore,
                submitValue: false,
                queryCaching: isDealerRemisier ? false : true,
                hidden: !_isSpecificValue(defTrAccConf.getDefTrAccOpt(exchangecode)),
                value: defTrAccConf.getDefTrAccVal(exchangecode),
                minChars: 999, //set to large number to prevent query from being fired when typing
                emptyText: isDealerRemisier ? languageFormat.getLanguage(20876, 'Search account here.. min ' + N2N_CONFIG.constDRMinChars + ' chars', N2N_CONFIG.constDRMinChars) : languageFormat.getLanguage(20900, 'Please select account...'),
                listConfig: {
                    cls: 'my-combo-lst',
                    //width: 'auto',
                    maxHeight: 150,
                    listeners: {
                        beforeshow: function (picker) {
                            picker.minWidth = picker.up('combobox').inputEl.getSize().width;
                        }
                    }
                },
                listeners: {
                    beforequery: function(qe) {
                        if (isDealerRemisier) {
                            if (qe.query.length == 0) {
                                qe.cancel = true;
                            }
                        }
                    },
                    afterrender: function (combo, value) {
                        if(isDealerRemisier){
                            combo.getStore().on('load', function(thisStore, records) {
                                if (records) {
                                    if(records.length == 1){
                                        combo.select(records);
                                        combo.collapse();
                                    }                               
                                }
                            }); 

                        }
    
                    },
                    change: function(thisComp, newValue) {
                        var dex = dexCb.getValue();
                        defTrAccConf.setDefTrAccVal(dex, thisComp.getValue());

                        tradeSettingChanged = true;
                        _toggleSaveBtn();
                    },
                    specialkey: function(thisCb, e) {
                        if (e.getKey() == e.ENTER) {
                            searchValue = thisCb.getRawValue().toLowerCase();
                            
                            if (searchValue) {
                                thisCb.doQuery(searchValue, true);
                            }
                        }
                    }        
                },
            });
              
            var defAccFs = {
                xtype: 'fieldset',
                width: '100%',
                title: languageFormat.getLanguage(21127, 'Default Trading Account'),
                hidden: dexCb.hidden && daCb.hidden && spaTf.hidden,
                items: [dexCb, daCb, spaTf],
                // margin: fsMargin,
                // padding: 0,
                cls: 'settingfs'
            };
            
            if (!defAccFs.hidden){
                tradeSettingItems.push(defAccFs);
            };
        }

        if (N2N_CONFIG.tradeAccOrder && !isDealerRemisier) {
            var accList = [];
            if (accRet.ai) {
                for (var i = 0; i < accRet.ai.length; i++) {
                    var acc = accRet.ai[i];
                    if (acc.ac && acc.cc) {
                        accList.push({
                            acckey: acc.ac + global_AccountSeparator + acc.bc,
                            accname: acc.ac + ' - ' + acc.an + ' - ' + acc.bc
                        });
                    }
                }
            }

            trdAccGd = Ext.create('Ext.grid.Panel', {
                width: '100%',
                store: {
                    fields: ['accname', 'acckey'],
                    data: accList
                },
                columns: [
                    {dataIndex: 'accname', flex: 1, text: 'Account'}
                ],
                maxHeight: 130,
                hideHeaders: true,
                cls: 'settinggrid smallfont',
                border: false,
                viewConfig: {
                    stripeRows: false,
                    trackOver: false
                },
                tbar: [
                    '->',
                    {
                        iconCls: 'icon-move-top',
                        tooltip: languageFormat.getLanguage(21149, 'Move to first'),
                        handler: function() {
                            if (helper.moveSelection(trdAccGd, 'top') > -1) {
                                tradeAccOrderChanged = true;
                                _toggleSaveBtn();
                            }
                        }
                    },
                    {
                        iconCls: 'icon-move-up',
                        tooltip: languageFormat.getLanguage(21150, 'Move up'),
                        handler: function() {
                            if (helper.moveSelection(trdAccGd, 'up') > -1) {
                                tradeAccOrderChanged = true;
                                _toggleSaveBtn();
                            }
                        }
                    },
                    {
                        iconCls: 'icon-move-down',
                        tooltip: languageFormat.getLanguage(21151, 'Move down'),
                        handler: function() {
                            if (helper.moveSelection(trdAccGd, 'down') > -1) {
                                tradeAccOrderChanged = true;
                                _toggleSaveBtn();
                            }
                        }
                    },
                    {
                        iconCls: 'icon-move-bottom',
                        tooltip: languageFormat.getLanguage(21152, 'Move to last'),
                        handler: function() {
                            if (helper.moveSelection(trdAccGd, 'bottom') > -1) {
                                tradeAccOrderChanged = true;
                                _toggleSaveBtn();
                            }
                        }
                    }
                ]
            });
            
            if (trdAccGd.store.data.length > 0){
                var trdAccOrdFs = {
                    xtype: 'fieldset',
                    width: '100%',
                    title: languageFormat.getLanguage(21128, 'Trading Account Order'),
                    items: [trdAccGd],
                    // padding: 0,
                    // margin: 0
                };
                tradeSettingItems.push(trdAccOrdFs);
            };
        }
        
        if(N2N_CONFIG.enableUserPrefQtyStep){
        	var qtyTf = Ext.create('Ext.form.field.Text', {
                //fieldLabel: '',
                width: 100,
                fieldWidth: 150,
                labelSeparator: '',
                selectOnFocus: true,
                maskRe: /[0-9]/,
                value: qtyStepsValue,
                listeners: {
                    change: function(thisComp, newValue) {
                    	if(newValue && newValue != '' && newValue != 0){
                    		//thisComp.setValue(newValue);
                            qtyStepsValue = newValue;
                            tradeQtyStepsChanged = true;
                            _toggleSaveBtn();
                    	}else{
                    		tradeQtyStepsChanged = false;
                    	}
                    },
                    blur: function(thisComp){
                    	if(!tradeQtyStepsChanged){
                    		thisComp.setValue(qtyStepsValue);
                    	}
                    }
                }
            });
            var defQtyStepsFs = {
                xtype: 'fieldset',
                width: '100%',
                title: languageFormat.getLanguage(21154, 'Default Qty Steps'),
                items: [qtyTf],
                cls: 'settingfs'
            };
            tradeSettingItems.push(defQtyStepsFs);
        }

        if (tradeSettingItems.length > 0) {
            tradeSettingTab = {
                title: languageFormat.getLanguage(21129, 'Trade'),
                items: tradeSettingItems,
                border: false,
                padding: 0,
                margin: fsMargin
            };
            stpItems.push(tradeSettingTab);
        }
        
        if(N2N_CONFIG.enableHKMapping){
        	var hotKeysItem = [];
        	var keyObj = {};
        	var hkList = keyMapUtil.getHKMappedList();

        	var hkStore = new Ext.data.ArrayStore({
        		fields: ['id', 'func', 'hk'],
        		data: hkList,
                        sorters: [
                            {
                                property: "id",
                                direction: 'ASC'
                            }
                        ]
        	});
        	var viewHotKeys = Ext.create('Ext.grid.Panel', {
        		columnWidth: 1,
        		autoScroll: true,
        		height: '100%',
        		store: hkStore,
        		border: false,
        		columnLines: true,
        		cls: 'settinggrid',
        		enableColumnMove: false,
        		enableColumnHide: false,
        		enableColumnResize: false,
        		sortableColumns: false,
        		viewConfig: {
        			stripeRows: false
        		},
        		columns: [
    		          {
    		        	  text: languageFormat.getLanguage(21158, 'Function'),
    		        	  dataIndex: 'func',
    		        	  sortable: false,
    		        	  flex: 2
    		          },
    		          {
 			        	   text: languageFormat.getLanguage(21155, 'HotKeys'),
 			        	   dataIndex: 'hk',
 			        	   sortable: false,
 			        	   align: 'right',
 			        	   flex: 1,
 			        	   renderer: function (value, meta, record) {
 			        		   var valueText = keyMapUtil.mappedKey(value);
 			        		   meta.tdAttr = 'data-qtip="' + valueText + '"';
 			        		   return valueText;
 			        	   }
    		          }
		          ],
		          listeners:{
		        	  rowclick: function(grid, record, tr, rowIndex, e){
		        		  newMappingTf.focus();
		        		  currentMappingTf.setValue(keyMapUtil.mappedKey(record.data.hk));
		        		  keyObj.id = record.data.id;
		        		  keyObj.name = record.data.func;
		        	  }
		          }
        	});

        	var newMappingTf = Ext.create('Ext.form.field.Text', {
        		fieldLabel: languageFormat.getLanguage(21156, 'New Mapping'),
        		labelSeparator: '',
        		padding: '0 0 0 10',
        		selectOnFocus: true,
        		enableKeyEvents: true,
        		width: 250,
        		listeners: {
        			keyup: function(thisComp, e){
        				var key = e.getKey();
        				var alt = Ext.event.Event.ALT;
        				var ctrl = Ext.event.Event.CTRL;
        				var shift = Ext.event.Event.SHIFT;

        				if(e.altKey){ thisComp.alt = alt; }
        				if(e.ctrlKey){ thisComp.ctrl = ctrl; }
        				if(e.shiftKey){ thisComp.shift = shift; }

        				if(key != alt && key != ctrl && key != shift){
        					thisComp.key = e.getKey();
        				}

        				thisComp.blur();
        			},
        			keydown: function(thisComp, e){
        				var key = e.getKey();
        				var alt = Ext.event.Event.ALT;
        				var ctrl = Ext.event.Event.CTRL;
        				var shift = Ext.event.Event.SHIFT;

        				if(e.altKey){ thisComp.alt = alt; }
        				if(e.ctrlKey){ thisComp.ctrl = ctrl;  }
        				if(e.shiftKey){ thisComp.shift = shift; }

        				if(key != alt && key != ctrl && key != shift){
        					thisComp.key = e.getKey();
        				}

        				e.preventDefault();
        			},
        			focus: function(thisComp){
        				thisComp.setValue('');
        				thisComp.key = '';
        				thisComp.alt = false;
        				thisComp.ctrl = false;
        				thisComp.shift = false;
        				keyObj = {};
        				hotKeysAssignBtn.disable();
        			},
        			blur: function(thisComp){
        				var mapAllow = false;
        				var keyList = [];
        				keyObj.alt = false;
        				keyObj.ctrl = false;
        				keyObj.shift = false;
        				
        				if(thisComp.key >= 112 && thisComp.key <= 135){
        					mapAllow = true;
        				}

        				if(thisComp.alt){
        					keyList.push(thisComp.alt);
        					keyObj.alt = true;
        					if(thisComp.key >= 65 && thisComp.key <= 90){
        						mapAllow = true;
        					}else{
        						mapAllow = false;
        					}
        				}
        				if(thisComp.ctrl){
        					keyList.push(thisComp.ctrl);
        					keyObj.ctrl = true;
        					if(thisComp.key >= 65 && thisComp.key <= 90){
        						mapAllow = true;
        					}else{
        						mapAllow = false;
        					}
        				}
        				if(thisComp.shift){
        					keyList.push(thisComp.shift);
        					keyObj.shift = true;
        					if(thisComp.key >= 65 && thisComp.key <= 90){
        						mapAllow = true;
        					}else{
        						mapAllow = false;
        					}
        				}
                                        
        				if(mapAllow){
        					keyList.push(thisComp.key);

        					keyObj.key = thisComp.key;
        					keyObj.keyName = keyList.join(',');

        					thisComp.setValue(keyMapUtil.mappedKey(keyObj.keyName));

        					if(thisComp.getRawValue() != ''){
        						hotKeysAssignBtn.enable();
        					}
        				}
        			}
        		}
        	});

        	var currentMappingTf = Ext.create('Ext.form.field.Text', {
        		fieldLabel: languageFormat.getLanguage(21157, 'Current Mapping'),
        		labelSeparator: '',
        		padding: '5 0 5 10',
        		selectOnFocus: true,
        		editable: false,
        		width: 250,
        		triggers: {
        	        foo: {
        	        	cls: 'icon-clearMapping',
        	            handler: function() {
        	            	currentMappingTf.setValue('');
        	            	hotKeysAssignBtn.enable();
        	            }
        	        }
        	    }
        	});

        	var hotKeysAssignBtn = Ext.create('Ext.button.Button', {
        		text: languageFormat.getLanguage(20618, 'Apply'),
        		disabled: true,
        		cls: 'flatbtn applybtn',
        		handler: function() {
        			var record = viewHotKeys.getSelectionModel().getLastSelected();
        			if(record){
        				keyObj.id = record.data.id;
        			}
        			var duplicateObj = keyMapUtil.returnDuplicateInfo(keyObj, newMappingTf.getValue());

        			if(duplicateObj.duplicate){
                            var keyName = keyMapUtil.mappedKey(keyObj.keyName);
                            msgutil.confirm(languageFormat.getLanguage(31402, '[PARAM0] is currently used by another function. Do you want to assign [PARAM1] to this function instead?', keyName + '|' + keyName), function (btn) {
        					if (btn == 'yes') {            		        
        						var dr = hkStore.findRecord('id', duplicateObj.id);
        						//var r = hkStore.findRecord('id', keyObj.id);
        						if(dr){
        							dr.set('hk', '');
        						}
        						if(record){
        							record.set('hk', keyObj.keyName);
        						}

        						keyMapUtil.removeBinding(duplicateObj.id);
    							duplicateObj.key = '';
    							duplicateObj.alt = false;
    							duplicateObj.ctrl = false;
    							duplicateObj.shift = false;
        						keyMapUtil.addBinding(duplicateObj);
        						
        						keyMapUtil.removeBinding(keyObj.id);
        						keyMapUtil.addBinding(keyObj);

        						newMappingTf.setValue('');
        						currentMappingTf.setValue(keyMapUtil.mappedKey(keyObj.keyName));

        						sessionStorage.setItem('HotKeys', JSON.stringify(global_MappedKeys.bindings));
        						
        						msgutil.alert(languageFormat.getLanguage(31404, 'New HotKeys mapping applied.'));
        					}
        				});
        			}else{
        				
        				//var r = hkStore.findRecord('id', keyObj.id);
        				if(record){	
        					record.set('hk', keyObj.keyName);
        				}
        				newMappingTf.setValue('');
        				currentMappingTf.setValue(keyMapUtil.mappedKey(keyObj.keyName));
        				keyMapUtil.removeBinding(keyObj.id);
        				keyMapUtil.addBinding(keyObj);
        				sessionStorage.setItem('HotKeys', JSON.stringify(global_MappedKeys.bindings));
        				msgutil.alert(languageFormat.getLanguage(31404, 'New HotKeys mapping applied.'));
        			}
        			
        			hotKeysAssignBtn.disable();
        			keyMapUtil.disable();
        		}
        	});
        	var hotKeysRestoreBtn = Ext.create('Ext.button.Button', {
        		text: languageFormat.getLanguage(21115, 'Default'),
        		cls: 'flatbtn applybtn',
        		handler: function() {
        			var hkList = [];
        			keyMapUtil.restoreHotKeysMapping();
        			hkList = keyMapUtil.getHKMappedList();
        			viewHotKeys.store.loadData(hkList);
        			msgutil.alert(languageFormat.getLanguage(31403, 'HotKeys mapping restored.'));
        			var record = viewHotKeys.getSelectionModel().getLastSelected();
        			newMappingTf.setValue('');
    				currentMappingTf.setValue(keyMapUtil.mappedKey(record.data.hk));
    				
    				hotKeysAssignBtn.disable();
        		}
        	});

        	var btnPanel = new Ext.container.Container({
        		border: false,
        		padding: '10 0 0 0',
        		layout: {
        			type: 'hbox',
        			pack: 'start',
        			align: 'left'
        		},
        		items: [hotKeysAssignBtn, hotKeysRestoreBtn]
        	});

        	hotKeysItem.push({
                xtype: 'container',
                width: 200,
                layout:'hbox',
                cls: 'fix_themebg',
                items:[{
	                    xtype: 'label',
	                    padding: '12 0 0 3',
	                    text: languageFormat.getLanguage(21159, 'Enable Hotkeys')
	                },
	                {
	                	xtype: 'container',
	                    html:'<div id="toggles"><input type="checkbox" name="checkbox1" id="checkbox1" class="ios-toggle"><label for="checkbox1" class="checkbox-label" ></label></div>'
	                }
                ],
                listeners: {
                    afterrender: function(){
                    	var chkboxBtn = Ext.get('checkbox1');
                    	chkboxBtn.dom.checked = userPreference.get('hksts') ? (userPreference.get('hksts') == '1' ? true : false) : (N2N_CONFIG.hotKeysStatus ? true : false);
                    	chkboxBtn.on('change', function(){
                    		var newValue = chkboxBtn.dom.checked;
                    		if(newValue){
                            	N2N_CONFIG.hotKeysStatus = true;
                            }else{
                            	N2N_CONFIG.hotKeysStatus = false;
                            }
                            
                            userPreference.set('hksts', newValue);
                            userPreference.save();
                    	});
                    }
                }
            });
        	hotKeysItem.push(viewHotKeys);
        	hotKeysItem.push(currentMappingTf);
        	hotKeysItem.push(newMappingTf);
        	hotKeysItem.push(btnPanel);

        	if (hotKeysItem.length > 0) {
        		hotKeysSettingTab = {
        				title: languageFormat.getLanguage(21155, 'HotKeys'),
        				items: hotKeysItem,
        				border: false,
        				padding: 0,
        				margin: fsMargin
        		};
        		stpItems.push(hotKeysSettingTab);
        	}
        }

        var settingTp;
        if (stpItems.length > 1) {
            settingTp = Ext.create('Ext.tab.Panel', {
                items: stpItems,
                cls: 'resetbg',
                bodyStyle: "background-color: transparent;color: #000;",
                border: false,
                padding: 0,
                listeners:{
                	tabchange: function(tabPanel, newCard){
                		if(newCard.title == languageFormat.getLanguage(21117, 'Font')){
                			btnDefault.show();
                			settingApplyBtn.show();
                                        
                                        if (!newCard.activateColor) {
                                            loadFontColors();
                                            newCard.activateColor = true;
                                        }
                                        
                		}else if (newCard.title == languageFormat.getLanguage(21155, 'HotKeys')){
                			settingApplyBtn.hide();
                			btnDefault.hide();
                			keyMapUtil.disable();
                		}else{
                			btnDefault.hide();
                			settingApplyBtn.show();
                		}
                	}
                }
            });
        } else {
            stpItems[0].xtype = 'container';
        }

        var btnCont = [settingApplyBtn, btnDefault];
        var btnHeader = [settingSaveBtn];
        settingWin = msgutil.popup({
            title: languageFormat.getLanguage(20617, 'Settings'),
            width: 280,
//            height: winHeight,
            resizable: false,
            themeRdg: global_personalizationTheme,
            unitRdg: global_displayUnit,
            newsRdg: global_newsSetting,
            reportRdg: global_reportSetting,
            dyLimitRdg: global_dynamicLimitSetting,
            brokerMapRdg : global_brokerListMapping,
            layout: "fit",
            items: settingTp || stpItems[0],
            appLayout: n2nLayoutManager.getAppLayout(),
            subLayout: n2nLayoutManager.getSubLayout(),
            remember: layoutProfileManager.getRememberLastLayout(),
            openAs: layoutProfileManager.getOpenAs(),
            alternative: gl_alter,
            header: {
                items: btnHeader
            },
            bbar: {
                items: btnCont,
                cls: 'fix_themebg'
            },
            prevFontType: gl_fonttype,
            prevFontSize: globalFontSize,
            listeners: {
                destroy: function(thisComp) {
                    if (thisComp.themeRdg !== global_personalizationTheme) { // revert theme
                        setThemeCSS(global_personalizationTheme);
                    }
                    
                    if (isSuccess == false) {
                        updateGlobalFontColors(global_personalizationTheme); // revert color
                        
                        setFontStyle();
                        var fontSizeValue = !fontSizeItem ? globalFontSize : fontSizeItem.getValue();
                        if (fontSizeItem && globalFontSize != fontSizeValue) {
                            changeFontSize(globalFontSize);
                        }
                    }
                    
                    if (!doSaveSetting && defTrAccConf) {
                        defTrAccConf.revert();
                    }
                    
                    if (!isMobile) {
                        if (!doSaveSetting) {
                            // restore previous layout
                            if (layoutChanged && n2nLayoutManager.isWindowLayout()) {
                                n2nLayoutManager.restorePreviousLayout();
                            }
                            n2nLayoutManager.lyConf.changed = true;
                        } else {
                            if (layoutChanged && n2nLayoutManager.isWindowLayout()) {
                                n2nLayoutManager.loadConfiguredPopup();
                                n2ncomponents.runAllBufferTasks();
                                n2nLayoutManager.activateAllScreens();
                            }
                        }
                    }
                    
                    if(N2N_CONFIG.enableHKMapping){
                    	if(N2N_CONFIG.hotKeysStatus){
                    		keyMapUtil.enable();
                    	}
                    	keyMapUtil.saveHotKeysMapping();
                    }
                }
            }
        });

    };
    n2ncomponents.requestSaveNoAsk = function() {

        var settingUrl = addPath + "tcplus/setting?a=set&sc=TCLPTHEME";
        var data = [
            global_personalizationTheme, '~',
            global_displayUnit, '~',
            'news,', global_newsSetting, '-',
            'rpt,', global_reportSetting, '-',
            'dl,', global_dynamicLimitSetting, '-',
            'fs,', globalFontSize, '-',
            'na,', global_noAsk, '-',
            'nt,', 1, '-',
            'lang,', global_Language, '-',
            'bm,', global_brokerListMapping
        ].join('');
        Ext.Ajax.request({
            url: settingUrl,
            method: 'POST',
            params:{p:data}
        });
    };

    n2ncomponents.createAddStockAlert = function(key) {
        if (!jsutil.isEmpty(key)) {
            var me = this;
            var stkParts = stockutil.getStockParts(key);
            var code = stkParts.code;
            var exch = stkParts.exch;
            var stkAlertURL = settingAddStockAlertURL + '?BHCode=' + bhCode + '&Clicode=' + cliCode + '&Mobile=' + mobileNo + '&Email=' + emailAdd + '&LoginID=' + loginId + '&Encrypt=N&StkCode=' + code + '&exchg=' + exch + '&' + new Date().getTime();

            if (N2N_CONFIG.newWin_Other) {
                if (window.name == "add_stockalert")
                    window.name = "";

                msgutil.openURL({
                    url: stkAlertURL,
                    name: 'add_stockalert'
                });
            } else {
                var asAlert = me.userReports['Add_StockAlert'];
                if (asAlert == null) {
                    asAlert = Ext.create('Ext.ux.IFrame', {
                        title: languageFormat.getLanguage(20603, 'Add Stock Alert'),
                        key: key,
                        type: 'asa',
                        ddComp: true,
                        winConfig: {
                            width: 700,
                            height: 480
                        }
                    });

                    asAlert.on('beforedestroy', function() {
                        me.userReports['Add_StockAlert'] = null;
                    });

                    me.userReports['Add_StockAlert'] = asAlert;
                    n2nLayoutManager.addItem(asAlert);
                    n2nLayoutManager.activateItem(asAlert);
                    asAlert.refresh(stkAlertURL);
                } else {
                    n2nLayoutManager.activateItem(asAlert);
                    if (key != asAlert.key) {
                        asAlert.refresh(stkAlertURL);
                    }
                }
            }
        } else {
            msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
        }
    };
    
    n2ncomponents.createSMSStockAlert = function(key, stkname, conf, tabCt) {
    	if (!tabCt && n2nLayoutManager.activateBuffer('smsa', key, stkname)) {
            return;
        }
    	
    	//title rename from SMS Stock Alert to Stock Alert
    	var me = this;
    	var smsStkAlertURL = '';
    	var params = [
                      'ft=' + gl_fonttype,
                      'fs=' + globalFontSize,
                      'lang=' + global_Language,
                      'color=' + formatutils.procThemeColor()
                  ];
    	
    	if(key){
    		var stkParts = stockutil.getStockParts(key);
            var code = stkParts.code;
            var exch = stkParts.exch;
            params.push('stkCd=' + code, 'exCd=' + exch);
            //smsStkAlertURL = smsStkAlertURL + '?stkCd=' + code + '&exCd=' + exch;
    	}
    	
    	smsStkAlertURL = helper.addUrlParams(settingSMSStockAlertURL, params.join('&'));

    	if (N2N_CONFIG.newWin_Other) {
    		if (window.name == "sms_stockalert")
    			window.name = "";

    		msgutil.openURL({
    			url: smsStkAlertURL,
    			name: 'sms_stockalert'
    		});
    	} else {
    		var smsAlert = me.userReports['SMS_StockAlert'];
    		if (smsAlert == null) {
    			smsAlert = Ext.create('Ext.ux.IFrame', Ext.apply({
    				title: languageFormat.getLanguage(20602, 'Stock Alert'),
    				key: key,
    				type: 'smsa',
    				savingComp: true,
                    ddComp: true,
    				winConfig: {
    					width: 700,
    					height: 480
    				}
    			}, conf));

    			smsAlert.on('beforedestroy', function() {
    				me.userReports['SMS_StockAlert'] = null;
    			});

    			me.userReports['SMS_StockAlert'] = smsAlert;
    			n2nLayoutManager.addItem(smsAlert, null, null, tabCt);
    		} 
    		
    		// update key
    		smsAlert.updateKey(key, stkname);
    		n2nLayoutManager.activateItem(smsAlert);
    		helper.runAfterCompRendered(smsAlert, function() {
    			smsAlert.refresh(smsStkAlertURL);
            });  
    	}
    };

    n2ncomponents.languageSetting = function() {
        var tempLanguageItems = [];
        var languageText = '';
        var languageFile = '';
        var languageFileType = languageOptions.split(',');
        for (var i = 0; i < languageFileType.length; i++) {
            // default to english
            var languageText = languageFormat.getLanguage(10034, 'English');
            var languageFile = 'en';

            switch (languageFileType[i].toLowerCase()) {
                case 'cn':
                    languageText = languageFormat.getLanguage(10035, 'Chinese');
                    languageFile = 'cn';
                    break;
                case 'jp':
                    languageText = languageFormat.getLanguage(10037, 'Japanese');
                    languageFile = 'jp';
                    break;
                case 'vn':
                    languageText = languageFormat.getLanguage(10038, 'Vietnamese');
                    languageFile = 'vn';
                    break;
            }

            tempLanguageItems.push({
                text: languageText,
                cls: 'x-menu-item-medium',
                languageFile: languageFile,
                showSeparator: false,
                handler: function(item, event) {
                    /*
                     if (wMSServer == 'TRUE') {
                     window.parent.location = 'index.jsp?lang=' + item.languageFile;
                     } else {
                     window.location.href = 'main.jsp?lang=' + item.languageFile;
                     }
                     */

                    switchLanguage(item.languageFile);
                }
            });
        }

        return tempLanguageItems;
    };
    n2ncomponents.createPEREPSCalc = function(stk, tabCt) {
    	if (!tabCt && n2nLayoutManager.activateBuffer('pc')) {
            return;
        }
    	
        var me = this;
        if (me.debug) {
            console.log('n2ncomponents > createPEREPSCalc');
        }

        if (!me.perEPSCalc) {
            if (me.debug) {
                console.log('creating createPEREPSCalc...');
            }

            me.perEPSCalc = Ext.create('widget.perepscalc', {
                title: languageFormat.getLanguage(21005, 'P/E Ratio & EPS Calculator'),
                exCode: exchangecode,
                stk: stk,
                initMax: true,
                type: 'pc',
                savingComp: true,
                ddComp: true
            });
            me.perEPSCalc.on('beforedestroy', function() {
                me.perEPSCalc = null;
            });

            n2nLayoutManager.addItem(me.perEPSCalc, null, null, tabCt); 
        }

        if (me.debug) {
            console.log('activate createPEREPSCalc...');
        }
        
        n2nLayoutManager.activateItem(me.perEPSCalc);
    };
    
    n2ncomponents.createTradeCal = function(conf, tabCt) {
        if (!N2N_CONFIG.tradeCal) {
            return;
        }
        
        if (!tabCt && n2nLayoutManager.activateBuffer('tc')) {
            return;
        }
        
        if (!n2ncomponents.tradeCal) {
            var tradeCal = Ext.widget('tradecal', Ext.apply({
            }, conf));
            tradeCal.on('destroy', function() {
                n2ncomponents.tradeCal = null;
            });
            n2nLayoutManager.addItem(tradeCal, null, null, tabCt);
            n2ncomponents.tradeCal = tradeCal;

        }

        n2nLayoutManager.activateItem(n2ncomponents.tradeCal);

    };
    n2ncomponents.openHotKeysMapping = function(conf, tabCt) { 
    	if (!tabCt && n2nLayoutManager.activateBuffer('hk')) {
            return;
        }
    	
    	if (!n2ncomponents.hotKeys) {
    		var hotKeys = Ext.widget('hotkeys', Ext.apply({
            }, conf));
    		hotKeys.on('destroy', function() {
    			n2ncomponents.hotKeys = null;
    		});
    		n2nLayoutManager.addItem(hotKeys, null, null, tabCt);
    		n2ncomponents.hotKeys = hotKeys;

    	}

    	n2nLayoutManager.activateItem(n2ncomponents.hotKeys);
    };
}

Ext.define("TCPlus.view.settings.PriceAlert", {
	extend: "Ext.tab.Panel",
    alias: "widget.pricealert",
    header: false,
    gridPanel: null,
    gridStore: null,
    pagingTool: null,
    btnAdd: null,
    btnDelete: null,
    btnDeleteAll: null,
    stkcodes: new Array(),
    addStockWin: null,
    btnSearch: null,
    formContainer: null,
    btnBack: null,
    addstockcode: null,
    eventmode: "add",
    resultView: null,
    bodyStyle: "overflow-x:hidden;overflow-y: auto;",
    isChanged: false,
    objForm: {
        code: "",
        name: "",
        retrigger: "",
        active: "",
        modified: "",
        immediate: "",
        price: "",
        price1: "",
        change: "",
        changeper: "",
        drop: "",
        dropper: "",
        volume: "",
        value: "",
        lot: "",
        buy: "",
        buyqty: "",
        sell: "",
        sellqty: "",
        remark: ""
    },
    initComponent: function() {
        var me = this;
        me._createMainPanel();
        me._createResultView();
        var defaultConfig = {
            emptyText: MSG.NO_RESULT,
            items: [me.gridPanel, me.resultView],
            listeners: {
                destroy: function() {
                    me._unsubscriptFeed();
                }
            }
        };
        Ext.apply(this, defaultConfig);
        this.callParent(arguments);
    },
    _createMainPanel: function() {
        var me = this;
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
        me.btnAdd = Ext.create("Ext.button.Button", {
            text: "Add New",
            handler: function() {
                me.eventmode = "add";
                me._createAddStockWin();
            }
        });
        me.btnDelete = Ext.create("Ext.button.Button", {
            text: "Delete",
            handler: function() {
                me._deleteRecord();
            }
        });
        me.btnDeleteAll = Ext.create("Ext.button.Button", {
            text: "Delete All",
            handler: function() {
                me._deleteAll();
            }
        });
        me.gridStore = Ext.create("Ext.data.Store", {
            model: "TCPlus.model.PriceAlert"
        });
        me.gridPanel = Ext.create("Ext.grid.Panel", {
            store: me.gridStore,
            title: "Alert",
            header: false,
            border: false,
            listeners: {
                afterrender: function() {
                    me._callAlertRecord();
                },
                itemdblclick: function(thisComp, rec, index) {
                    me._editStockAlert(rec);
                }
            },
            columns: [
                {
                    itemId: 'code',
                    text: 'Code',
                    width: 80,
                    sortable: false,
                    dataIndex: fieldStkCode,
                    renderer: function(val, meta) {
                        newSetting(meta, val, "string");
                        return val;
                    }
                }, {
                    itemId: 'name',
                    text: 'Name',
                    width: 100,
                    sortable: false,
                    dataIndex: fieldStkName,
                    renderer: function(val, meta) {
                        newSetting(meta, val, "string");
                        return val;
                    }
                }, {
                    itemId: 'retrigger',
                    text: 'Retrigger',
                    width: 60,
                    sortable: false,
                    dataIndex: "retrigger",
                    renderer: function(val, meta) {
                        newSetting(meta, val, "string");
                        if (val == "false") {
                            val = "no";
                        } else {
                            val = "yes";
                        }
                        return val;
                    }
                }, {
                    itemId: "active",
                    text: "Active",
                    width: 60,
                    sortable: false,
                    dataIndex: "active",
                    renderer: function(val, meta) {
                        newSetting(meta, val, "string");
                        if (val == "false") {
                            val = "no";
                        } else {
                            val = "yes";
                        }
                        return val;
                    }
                }, {
                    itemId: "modified",
                    text: "ModifiedDT",
                    width: 150,
                    sortable: false,
                    dataIndex: "modified",
                    renderer: function(val, meta) {
                        newSetting(meta, val, "string");
                        return val;
                    }
                }
            ],
            bbar: {
                items: [
                    me.btnAdd, me.btnDelete, me.btnDeleteAll
                ]
            }
        });
    },
    _deleteRecord: function() {
        var me = this;
        var allAlertRecords = stockAlertATP == "_" ? "" : stockAlertATP;
        var selModel = me.gridPanel.getSelectionModel();
        if (selModel.hasSelection()) {
            var rec = selModel.getSelection()[0];
            msgutil.confirm(MSG.STOCKALERT_DELETE + " '" + rec.data[fieldStkName] + "' ?", function(btn) {
                if (btn == "yes") {
                    var stkcode = rec.data[fieldStkCode];
                    if (allAlertRecords.indexOf(stkcode) != -1) {
                        var allAlertArr = allAlertRecords.split("~");
                        var allAlertString = "";
                        var allAlertArrLength = allAlertArr.length;
                        for (var j = 0; j < allAlertArrLength; j++) {
                            var allAlert = allAlertArr[j];

                            if (allAlertArrLength != 1 && j > 0 && j != allAlertArrLength - 1) {
                                allAlertString += "~";
                            }
                            if (allAlert.indexOf(stkcode) != -1) {
                                if (allAlertString == "") {
                                    allAlertString += "_";
                                }
                                //allAlertString += "";                        
                            } else {
                                allAlertString += allAlert;
                            }
                        }
                        allAlertRecords = allAlertString;
                    }
                    var url = addPath + "tcplus/setting?a=set&sc=TCLALERT&p=" + allAlertRecords;
                    Ext.Ajax.request({
                        url: url,
                        success: function(response) {
                            stockAlertATP = allAlertRecords;
                            me._callAlertRecord();
                        }
                    });
                }
            });

        }


    },
    _addEditStock: function(obj) {
        var me = this;
        var allAlertRecords = stockAlertATP == "_" ? "" : stockAlertATP;
        var newStock = "";

        if (obj) {
            obj["name"] = obj["name"].replace(/ /g, "_");
            if (allAlertRecords.indexOf(obj.code) == -1 || me.eventmode == "edit") {

                for (var property in obj) {
                    if (obj[property] != "") {
                        newStock += obj[property] + ",";
                    }
                }
                var lastIndex = newStock.lastIndexOf(",");
                newStock = newStock.substring(0, lastIndex);
                if (allAlertRecords.indexOf(obj.code) != -1) {
                    var allAlertArr = allAlertRecords.split("~");
                    var allAlertString = "";
                    var allAlertArrLength = allAlertArr.length;
                    for (var j = 0; j < allAlertArrLength; j++) {
                        var allAlert = allAlertArr[j];
                        if (allAlertArrLength != 1 && j > 0) {
                            allAlertString += "~";
                        }
                        if (allAlert.indexOf(obj.code) != -1) {
                            allAlertString += newStock;
                        } else {
                            allAlertString += allAlert;
                        }

                    }
                    allAlertRecords = allAlertString;
                } else if (allAlertRecords != "") {
                    allAlertRecords += "~" + newStock;
                } else {

                    allAlertRecords += newStock;
                }
                if (allAlertRecords.length > 216) {
                    msgutil.alert("Characters are more than 216", function(btn) {
                        if (btn == "ok") {
                            if (me.eventmode == "edit")
                                me._createAddStockWin(obj);
                            if (me.eventmode == "add")
                                me._createAddStockWin();
                        }
                    });
                } else {
                    var url = addPath + "tcplus/setting?a=set&sc=TCLALERT&p=" + allAlertRecords;
                    Ext.Ajax.request({
                        url: url,
                        success: function(response) {
                            stockAlertATP = allAlertRecords;
                            me._callAlertRecord();
                            //  me.addstockcode = null;
                        }
                    });
                }

            } else {
                msgutil.alert(MSG.STOCKALERT_EXISTSTOCK);
            }
        }
    },
    _callAlertRecord: function() {
        var me = this;
        var objArr = [];
        if (stockAlertATP == "" || stockAlertATP == "_") {

        } else {
            var stockAlertRecs = stockAlertATP.split("~");
            for (var i = 0; i < stockAlertRecs.length; i++) {
                var stockAlertFields = stockAlertRecs[i].split(",");
                var obj = new Object();
                //console.log(stockAlertATP);
                if (stockAlertFields.length > 0) {
                    obj[fieldStkCode] = stockAlertFields[0];
                    if (me.stkcodes.indexOf(stockAlertFields[0]) == -1) {
                        me.stkcodes.push(stockAlertFields[0].replace(/_/g, ""));
                    }
                    obj[fieldStkName] = stockAlertFields[1].replace(/_/g, " ");
                    obj['retrigger'] = stockAlertFields[2];
                    obj['active'] = stockAlertFields[3];
                    if (stockAlertFields[4]) {
                        obj['modified'] = stockAlertFields[4].replace("_", " ");
                    }
                    obj['immediate'] = stockAlertFields[5];
                    for (var j = 6; j < stockAlertFields.length; j++) {
                        var fields = stockAlertFields[j].split("_");
                        if (stockAlertFields[j].indexOf("_") != -1) {
                            if (fields[0] == "remark") {
                                obj[fields[0]] = fields[1];
                            } else {
                                obj[fields[0]] = fields[1] + "|" + fields[2];
                            }
                        }
                    }
                    objArr.push(obj);
                }
            }
        }
        me._subscriptFeed();
        me.gridStore.loadData(objArr);
    },
    _createAddStockWin: function(obj) {
        var me = this;

        if (me.addStockWin == null) {
            me.isChanged = false;
            //  me._createSearchGrid();
            var storeExchange = Ext.create("Ext.data.Store", {
                fields: ["ex", "name"],
                data: indexCodes
            });
            var storeSign = Ext.create("Ext.data.Store", {
                fields: ["sign", "des"],
                data: [{
                        sign: "=", des: "eql"
                    }, {
                        sign: ">", des: "sr"
                    }, {
                        sign: "<", des: "lr"
                    }, {
                        sign: ">=", des: "sreql"
                    }, {
                        sign: "<=", des: "lreql"
                    }]
            });

            me.ddExchange = Ext.create("Ext.form.field.ComboBox", {
                itemId: "exchange",
                store: storeExchange,
                displayField: "name",
                columnWidth: 0.5,
                style: "padding-left: 10px;",
                value: exchangecode,
                valueField: "ex"
            });
//            me.btnSearch = Ext.create("widget.button", {
//                text: "Search",
//                handler: function() {
//                    me._procSearchStock();
//                }
//            });
            var activeRec = n2nLayoutManager.getActiveRecord(true);
            var stkcode = activeRec.stkCode;
            var stkname = activeRec.stkName;
            var stkObj = new Object();
            stkObj[fieldStkCode] = stkcode;
            stkObj[fieldStkName] = stkname;

            /*
             * set stock name format
             */
            var ds = new Ext.data.Store({
                proxy: {
                    type: 'memory',
                    reader: {
                        type: 'json',
                        rootProperty: 'd',
                        totalProperty: 'c'
                    }
                },
                fields: [
                    {name: 'stockCode', mapping: fieldStkCode},
                    {name: 'stockName', mapping: fieldStkName}
                ],
                data: [stkObj]
            });
            /*        
             me.txtSymbol = Ext.create("Ext.form.field.ComboBox", {
             fieldLabel: "Symbol",
             itemId: fieldStkName,
             labelWidth: 40
             //                    listeners: {
             //                        specialkey: function(field, e) {
             //                            if (e.getKey() == e.ENTER) {
             //                                me.btnSearch.handler(me.btnSearch);
             //                            }
             //                        }}
             });
             */
            me.txtSymbol = Ext.create("Ext.form.field.ComboBox", {
                fieldLabel: "Symbol",
                itemId: fieldStkName,
                labelWidth: 40,
                selectOnFocus: true,
                queryMode: 'local',
                value: stkcode,
                listConfig: {
                    minWidth: 150,
                    loadingText: 'Loading',
                    overflowX: "hidden",
                    maxHeight: 140
                },
                store: ds,
                forceSelection: true,
                valueField: 'stockCode',
                hideTrigger: true,
                typeAhead: true,
                typeAheadDelay: 200,
                displayField: 'stockName',
                enableKeyEvents: true,
                listeners: {
                    afterrender: function(thisCombo) {
                        console.log(ds);
                        var task = new Ext.util.DelayedTask(function() {
                            var comboValue = thisCombo.getRawValue();
                            var exCmp = me.ddExchange.getValue();
                            if (comboValue != "") {
                                conn.searchStock({
                                    ex: exCmp == "" ? exchangecode : exCmp,
                                    k: comboValue,
                                    field: [fieldStkCode, fieldStkName],
                                    quickSearch: true,
                                    success: function(obj) {
                                        thisCombo.store.clearFilter();
                                        thisCombo.store.loadRawData(obj);
                                    }
                                });
                            } else {
                                thisCombo.store.removeAll();
                            }
                        });
                        thisCombo.on('keyup', function() {
                            task.delay(700);
                        });
                    }
                }
            });

            var pricecheck = Ext.create("Ext.form.field.Checkbox", {
                itemId: "pricecheck",
                boxLabel: "Target",
                labelAlign: "right",
                columnWidth: "0.31",
                disabled: false,
                handler: function(checkbox, checked) {
                    me._checkBoxEvent(checkbox, checked);
                }
            });
            var pricecombo = Ext.create("Ext.form.field.ComboBox", {
                itemId: "pricecombo",
                displayField: "sign",
                valueField: "des",
                store: storeSign,
                fieldStyle: "font-weight: bold;",
                listConfig: {
                    style: "font-weight: bold;"
                },
                listeners: {
                    change: function() {
                        me.isChanged = true;
                    },
                    select: function() {
                        me.isChanged = true;
                    }
                },
                columnWidth: "0.31",
                disabled: true,
                editable: false
            });
            var price = Ext.create("Ext.form.field.Number", {
                itemId: "price",
                columnWidth: "0.31",
                disabled: true,
                listeners: {
                    change: function() {
                        me.isChanged = true;
                    }}
            });
            me.formContainer = Ext.create("Ext.container.Container", {
                style: "padding: 5px;",
                layout: {
                    type: "table",
                    columns: 2,
                    tableAttrs: {
                        style: {
                            width: '100%',
                            //     height: '100%',
                            cellspacing: 0,
                            cellpadding: 0
                        }
                    },
                    tdAttrs: {
                        style: "vertical-align:top;cellpadding: 0px; cellspacing: 0px;width: 50%;"
                    }
                },
                defaults: {
                    baseCls: "",
                    defaults: {
                        disabled: true,
                        marginBottom: '0px',
                        style: {
                            marginRight: '5px',
                            marginBottom: '5px'
                        }
                    }
                },
                items: [
                    {
                        layout: "hbox",
                        items: [me.txtSymbol, me.ddExchange, me.btnSearch],
                        height: 25,
                        colspan: 2
                    }, {
                        xtype: 'fieldset',
                        title: "Price",
                        layout: "column",
                        border: 1,
                        style: {
                            borderColor: '#cfd5d6',
                            borderStyle: 'solid',
                            marginLeft: "0px"
                        },
                        items: [
                            pricecheck,
                            pricecombo,
                            price,
                            pricecheck.cloneConfig({
                                itemId: "price1check"
                            }),
                            pricecombo.cloneConfig({
                                itemId: "price1combo"
                            }),
                            price.cloneConfig({
                                itemId: "price1"
                            })
                        ]
                    }, {
                        layout: "column",
                        border: true,
                        style: "padding: 5px;border: 1px solid #cfd5d6;",
                        items: [
                            pricecheck.cloneConfig({
                                itemId: "volumecheck",
                                boxLabel: "Volume"
                            }),
                            pricecombo.cloneConfig({
                                itemId: "volumecombo"
                            }),
                            price.cloneConfig({
                                itemId: "volume"
                            }),
                            pricecheck.cloneConfig({
                                itemId: "valuecheck",
                                boxLabel: "Value"
                            }),
                            pricecombo.cloneConfig({
                                itemId: "valuecombo"
                            }),
                            price.cloneConfig({
                                itemId: "value"
                            }),
                            pricecheck.cloneConfig({
                                itemId: "lotcheck",
                                boxLabel: "Lot"

                            }),
                            pricecombo.cloneConfig({
                                itemId: "lotcombo"
                            }),
                            price.cloneConfig({
                                itemId: "lot"
                            })
                        ]
                    }, {
                        xtype: 'fieldset',
                        title: "Change",
                        layout: "column",
                        rowspan: 2,
                        border: 1,
                        style: {
                            borderColor: '#cfd5d6',
                            borderStyle: 'solid',
                            marginLeft: "0px"
                        },
                        items: [
                            pricecheck.cloneConfig({
                                itemId: "changecheck",
                                boxLabel: "Rise"

                            }),
                            pricecombo.cloneConfig({
                                itemId: "changecombo"
                            }),
                            price.cloneConfig({
                                itemId: "change"
                            }),
                            pricecheck.cloneConfig({
                                itemId: "changepercheck",
                                boxLabel: "Rise %"

                            }),
                            pricecombo.cloneConfig({
                                itemId: "changepercombo"
                            }),
                            price.cloneConfig({
                                itemId: "changeper"
                            }), {
                                xtype: "label",
                                columnWidth: "1",
                                height: "10px"
                            },
                            pricecheck.cloneConfig({
                                itemId: "dropcheck",
                                boxLabel: "Drop"
                            }),
                            pricecombo.cloneConfig({
                                itemId: "dropcombo"
                            }),
                            price.cloneConfig({
                                itemId: "drop"
                            }),
                            pricecheck.cloneConfig({
                                itemId: "droppercheck",
                                boxLabel: "Drop %"

                            }),
                            pricecombo.cloneConfig({
                                itemId: "droppercombo"
                            }),
                            price.cloneConfig({
                                itemId: "dropper"
                            })
                        ]
                    }, {
                        style: "border:1px solid #cfd5d6;padding: 5px;border-top:0px;margin-bottom:0px;",
                        layout: "column",
                        items: [
                            pricecheck.cloneConfig({
                                itemId: "buycheck",
                                boxLabel: "Buy"
                            }),
                            pricecombo.cloneConfig({
                                itemId: "buycombo"
                            }),
                            price.cloneConfig({
                                itemId: "buy"
                            }),
                            pricecheck.cloneConfig({
                                itemId: "buyqtycheck",
                                boxLabel: "B/C"
                            }),
                            pricecombo.cloneConfig({
                                itemId: "buyqtycombo"
                            }),
                            price.cloneConfig({
                                itemId: "buyqty"
                            })
                        ]
                    }, {
                        style: "border:1px solid #cfd5d6;padding: 5px;",
                        layout: "column",
                        items: [
                            pricecheck.cloneConfig({
                                itemId: "sellcheck",
                                boxLabel: "Sell"
                            }),
                            pricecombo.cloneConfig({
                                itemId: "sellcombo"
                            }),
                            price.cloneConfig({
                                itemId: "sell"
                            }),
                            pricecheck.cloneConfig({
                                itemId: "sellqtycheck",
                                boxLabel: "S/C"
                            }),
                            pricecombo.cloneConfig({
                                itemId: "sellqtycombo"
                            }),
                            price.cloneConfig({
                                itemId: "sellqty"
                            })
                        ]
                    }, {
                        colspan: 2,
                        style: "padding: 5px;",
                        layout: "column",
                        items: [{
                                xtype: 'textareafield',
                                itemId: 'remark',
                                columnWidth: "1",
                                name: 'remark',
                                fieldLabel: 'Remark',
                                labelWidth: 50,
                                height: 70,
                                disabled: false
                            }]
                    }
                ]
            });
            me.btnBack = new Ext.button.Button({
                text: "Back",
                iconCls: 'icon-back',
                hidden: true,
                handler: function() {
                    me.formContainer.show();
                    //  me.searchGrid.hide();
                    this.hide();
                }
            });
            me.addStockWin = Ext.create("Ext.window.Window", {
                width: 700,
                height: 420,
                title: me.eventmode == "add" ? "Add Price Alert" : "Edit Price Alet",
                layout: 'fit',
                plain: true,
                //  items: [me.formContainer, me.searchGrid],
                items: [me.formContainer],
//                tbar: [
//                    '->',
//                    me.btnBack
//                ],
                bbar: [
                    {
                        xtype: "checkbox",
                        itemId: "retrigger",
                        boxLabel: "Retrigger"
                    },
                    {
                        xtype: "checkbox",
                        itemId: "active",
                        boxLabel: "Active"
                    }, {
                        xtype: "checkbox",
                        itemId: "immediate",
                        boxLabel: "Immediate"
                    }, "->", {
                        xtype: "button",
                        itemId: "ok",
                        text: "OK",
                        handler: function() {
                            if (me.txtSymbol.getValue() == "") {
                                msgutil.alert("Symbol is blank");
                            } else {
                                me._saveStockAlert();
                                me.addStockWin.destroy();
                            }
                        }
                    }, {
                        xtype: "button",
                        itemId: "cancel",
                        text: "Cancel",
                        handler: function() {

                            if (me.isChanged) {
                                msgutil.confirm(MSG.STOCKALERT_CANCELCONFIRM, function(btn) {
                                    if (btn == "yes") {
                                        me.addStockWin.destroy();
                                    }
                                });
                            } else {
                                me.addStockWin.destroy();
                            }
                        }
                    }
                ],
                listeners: {
                    destroy: function() {
                        me.addStockWin = null;
                    }
                }
            }).show();
            if (obj) {
                for (var property in obj) {
                    var value = obj[property];
                    if (property == "remark") {
                        me.addStockWin.down("#" + property).setValue(value);
                    } else if (property == fieldStkCode) {
//                        me.addstockcode = value;
                        var symbolStore = me.txtSymbol.store;
                        var model = symbolStore.getProxy().getModel();
                        var rec = new Object();
                        rec ["stockCode"] = obj[property];
                        rec ["stockName"] = obj[fieldStkName];
                        me.txtSymbol.store.add(Ext.create(model, rec));
                        console.log(symbolStore);
                        me.txtSymbol.setValue(value);
                        me.ddExchange.setValue(stockutil.getExchange(value));
                    } else if (property == fieldStkName) {
                        continue;
                    } else if (property != "modified") {
                        var comp = me.addStockWin.down("#" + property);
                        if (comp.isXType("checkbox")) {
                            comp.setValue(value);
                        } else {
                            var values = value.split("|");
                            comp.setValue(values[0]);
                            me.addStockWin.down("#" + property + "check").setValue(true);
                            me.addStockWin.down("#" + property + "combo").setValue(values[1]);
                        }
                    }
                }
                me.txtSymbol.disable();
                me.ddExchange.disable();
                //    me.btnSearch.disable();
                me.isChanged = false;
            }
        }
    },
    _subscriptFeed: function() {
        var me = this;
        me._unsubscriptFeed();
        Storage.generateSubscriptionByList(me.stkcodes, me);
    },
    _unsubscriptFeed: function() {
        var me = this;
        Storage.generateUnsubscriptionByExtComp(me);
    },
    _procSearchStock: function() {
        var me = this;

        var searchKey = stockutil.getStockPart(me.txtSymbol.getValue());
        searchKey = searchKey.trim();
        if (searchKey != '') {
            me.formContainer.hide();
            me.searchGrid.show();
            me.btnBack.show();

            helper.setHtml(me.searchGrid, '');


            var searchExchange = me.ddExchange.getValue();


            conn.searchStock({
                k: searchKey,
                ex: searchExchange,
                quickSearch: true,
                field: [fieldStkCode, fieldStkName, fieldSbExchgCode, fieldTransNo],
                success: function(obj) {
                    try {
                        if (obj.s) {
                            if (obj.d.length > 0) {
                                me._updateSearchStock(obj.d);

                            } else {
                                helper.setHtml(me.searchGrid, '<div class="x-grid-empty">' + me.emptyText + '</div>');

                            }

                        } else {
                            helper.setHtml(me.searchGrid, '<div class="x-grid-empty">' + me.emptyText + '</div>');

                        }

                    } catch (e) {
                        console.log('[Stock Alert][_procSearchStock] Exception ---> ' + e);

                        helper.setHtml(me.searchGrid, '<div class="x-grid-empty">' + me.emptyText + '</div>');
                    }

                    // me._procLoadMask("search", "close");
                }
            });
        } else {
            me.txtSymbol.focus();
        }
    },
    _updateSearchStock: function(dataObj) {
        var panel = this;
        panel.searchGrid.store.loadData(dataObj);
    },
    _createSearchGrid: function() {
        var me = this;
        var resultTpl = new Ext.XTemplate(
                '<tpl for=".">',
                '<table class="search-item" cellpadding="0" cellspacing="0">',
                '<tr><td width="200px"><span>{' + fieldStkCode + '}</span></td><td><span>{' + fieldStkName + '}</span></td></tr>',
                '</table></tpl>'
                );

        var store = new Ext.data.Store({
            model: 'TCPlus.model.SearchRecord'
        });

        me.searchGrid = new Ext.view.View({
            tpl: resultTpl,
            store: store,
            itemSelector: 'table.search-item',
            emptyText: me.emptyText,
            singleSelect: true,
            selectedItemCls: 'search-item-selected',
            hidden: true,
            listeners: {
                beforeselect: function() {
                    return !touchMode;
                },
                itemclick: function(thisComp, record, item, index, e) {
                    me.txtSymbol.setValue(record.get(fieldStkName));
                    me.addstockcode = record.get(fieldStkCode);
                    this.hide();
                    me.formContainer.show();
                    me.btnBack.hide();
                },
                afterrender: function(thisComp) {
//                    me.loadMask_search = new Ext.LoadMask(thisComp, {
//                        msg: 'Loading...'
//                    });
                }
            }
        });
    },
    _createResultView: function() {
        var me = this;
        var store = Ext.create("Ext.data.Store", {
            fields: [
                {name: fieldStkName, type: 'string'},
                {name: fieldTime, type: 'string'},
                {name: fieldTransDate, type: "string"},
                {name: "volumecurrent", type: "string"},
                {name: "valuecurrent", type: "string"},
                {name: "lotcurrent", type: "string"},
                {name: "buycurrent", type: "string"},
                {name: "sellcurrent", type: "string"},
                {name: "buyqtycurrent", type: "string"},
                {name: "sellqtycurrent", type: "string"},
                {name: "lastprice1current", type: "string"},
                {name: "lastprice2current", type: "string"},
                {name: "changerisecurrent", type: "string"},
                {name: "changerisepercurrent", type: "string"},
                {name: "changedropcurrent", type: "string"},
                {name: "changedroppercurrent", type: "string"},
                {name: "lastprice1", type: "string"},
                {name: "lastprice2", type: "string"},
                {name: "volume", type: "string"},
                {name: "value", type: "string"},
                {name: "lot", type: "string"},
                {name: "changerise", type: "string"},
                {name: "changeriseper", type: "string"},
                {name: "changedrop", type: "string"},
                {name: "changedropper", type: "string"},
                {name: "buy", type: "string"},
                {name: "sell", type: "string"},
                {name: "buyqty", type: "string"},
                {name: "sellqty", type: "string"},
                {name: "remark", type: "string"},
                {name: "lastprice1title", type: "string"},
                {name: "lastprice2title", type: 'string'},
                {name: "volumetitle", type: "string"},
                {name: "valuetitle", type: "string"},
                {name: "lottitle", type: "string"},
                {name: "changerisetitle", type: "string"},
                {name: "changerisepertitle", type: "string"},
                {name: "changedroptitle", type: "string"},
                {name: "changedroppertitle", type: "string"},
                {name: "buytitle", type: "string"},
                {name: "selltitle", type: "string"},
                {name: "buyqtytitle", type: "string"},
                {name: "sellqtytitle", type: "string"},
                {name: "remarktitle", type: "string"},
                {name: "lastprice1sign", type: 'string'},
                {name: "lastprice2sign", type: 'string'},
                {name: "volumesign", type: "string"},
                {name: "valuesign", type: "string"},
                {name: "lotsign", type: "string"},
                {name: "changerisesign", type: "string"},
                {name: "changerisepersign", type: "string"},
                {name: "changedropsign", type: "string"},
                {name: "changedroppersign", type: "string"},
                {name: "buysign", type: "string"},
                {name: "sellsign", type: "string"},
                {name: "buyqtysign", type: "string"},
                {name: "sellqtysign", type: "string"}
            ],
            proxy: {
                type: "memory",
                reader: {
                    type: 'json'
                }
            }
        });
        var resultTpl = new Ext.XTemplate(
                '<tpl for=".">',
                '<table cellpadding="0" cellspacing="0" style="font-size:1.2em;">',
                '<tr style="background-color:#f9fbd9;color:#000;"><td style="font-weight:bold;">{' + fieldStkName + '}</td><td align="left" colspan="2">{' + fieldTime + '}</td><td>{' + fieldTransDate + '}</td></tr>',
                '<tr style="background-color:#cde2dc;color:#000;"><td>Status</td><td colspan="2">Current</td><td>Alert Value</td></tr>',
                '<tr><td width= "150px">{lastprice1title}</td><td width= "150px">{lastprice1current}</td><td width= "100px">{lastprice1sign}</td><td width= "150px">{lastprice1}</td></tr>',
                '<tr><td>{lastprice2title}</td><td>{lastprice2current}</td><td>{lastprice2sign}</td><td>{lastprice2}</td></tr>',
                '<tr><td>{volumetitle}</td><td>{volumecurrent}</td><td>{volumesign}</td><td>{volume}</td></tr>',
                '<tr><td>{valuetitle}</td><td>{valuecurrent}</td><td>{valuesign}</td><td>{value}</td></tr>',
                '<tr><td>{lottitle}</td><td>{lotcurrent}</td><td>{lotsign}</td><td>{lot}</td></tr>',
                '<tr><td>{changerisetitle}</td><td>{changerisecurrent}</td><td>{changerisesign}</td><td>{changerise}</td></tr>',
                '<tr><td>{changerisepertitle}</td><td>{changerisepercurrent}</td><td>{changerisepersign}</td><td>{changeriseper}</td></tr>',
                '<tr><td>{changedroptitle}</td><td>{changedropcurrent}</td><td>{changedropsign}</td><td>{changedrop}</td></tr>',
                '<tr><td>{changedroppertitle}</td><td>{changedroppercurrent}</td><td>{changedroppersign}</td><td>{changedropper}</td></tr>',
                '<tr><td>{buytitle}</td><td>{buycurrent}</td><td>{buysign}</td><td>{buy}</td></tr>',
                '<tr><td>{buyqtytitle}</td><td>{buyqtycurrent}</td><td>{buyqtysign}</td><td>{buyqty}</td></tr>',
                '<tr><td>{selltitle}</td><td>{sellcurrent}</td><td>{sellsign}</td><td>{sell}</td></tr>',
                '<tr><td>{sellqtytitle}</td><td>{sellqtycurrent}</td><td>{sellqtysign}</td><td>{sellqty}</td></tr>',
                '<tr><td>{remarktitle}</td><td colspan="3">{remark}</td></tr>',
                '</table></tpl>');
        me.resultView = Ext.create("Ext.view.View", {
            tpl: resultTpl,
            title: "Trigger",
            store: store,
            emptyText: me.emptyText
        });
    },
    _checkBoxEvent: function(checkbox, checked) {
        var me = this;
        var checkboxfield = checkbox.getItemId().replace("check", "");
        var textfield = me.addStockWin.down("#" + checkboxfield);
        var combobox = me.addStockWin.down("#" + checkboxfield + "combo");
        if (checked) {
            textfield.enable();
            combobox.enable();
            me.isChanged = true;
        } else {
            textfield.disable();
            combobox.disable();
            me.isChanged = true;
        }
    },
    _saveStockAlert: function() {
        var me = this;
        var date = Ext.Date.format(new Date(), "d-m-Y_H:i:s").toString();
        for (var property in me.objForm) {
            if (property == "code") {
                me.objForm[property] = me.txtSymbol.getValue();
            } else if (property == "name") {
                me.objForm[property] = me.txtSymbol.getRawValue();
            } else if (property == "retrigger") {
                me.objForm[property] = me.addStockWin.down("#" + property).getValue().toString();
            } else if (property == "active") {
                me.objForm[property] = me.addStockWin.down("#" + property).getValue().toString();
            } else if (property == "modified") {
                me.objForm[property] = date;
            } else if (property == "immediate") {
                me.objForm[property] = me.addStockWin.down("#" + property).getValue().toString();
            } else if (property == "remark") {
                me.objForm[property] = me.addStockWin.down("#" + property).getValue() == "" ? "" : "remark_" + me.addStockWin.down("#" + property).getValue().toString().replace(/ /g, "_");
            } else {
                me.objForm[property] = me._getComponentValue(me.addStockWin.down("#" + property));
            }
        }
        me._addEditStock(me.objForm);
    },
    _getComponentValue: function(textfield) {
        var me = this;
        var text = textfield.getItemId();
        var combobox = me.addStockWin.down("#" + text + "combo");
        var checkbox = me.addStockWin.down("#" + text + "check");
        if (textfield.getValue() == "" || textfield.getValue() == null || !checkbox.getValue()) {
            return "";
        }
        return text + "_" + textfield.getValue() + "_" + combobox.getValue();
    },
    _editStockAlert: function(rec) {
        var me = this;
        me.eventmode = "edit";
        me._createAddStockWin(rec.raw);
    },
    _deleteAll: function() {
        var me = this;
        msgutil.confirm(MSG.STOCKALERT_DELETEALL, function(btn) {
            if (btn == "yes") {
                var url = addPath + "tcplus/setting?a=set&sc=TCLALERT&p=_";
                Ext.Ajax.request({
                    url: url,
                    success: function(response) {
                        stockAlertATP = "_";
                        me._callAlertRecord();
                    }
                });
            }
        });
    },
    updateResultView: function(obj) {
        var me = this;
        var updateRec = new Object();
        if (obj.s) {
            for (var i = 0; i < obj.d.length; i++) {
                if (me.stkcodes.indexOf(obj.d[i][fieldStkCode]) != -1) {
                    var stockRecord = me.gridPanel.store.findRecord(fieldStkCode, obj.d[i][fieldStkCode]).raw;
                    if (stockRecord.active == "true") {
                        for (var property in stockRecord) {
                            switch (property) {
                                case "price":
                                    if (obj.d[i][fieldLast]) {
                                        var price = stockRecord[property].split("|");
                                        me._calculateAlert(obj.d[i][fieldLast], price, updateRec, "lastprice1", "Last Price 1");
                                    }
                                    break;
                                case "price1":
                                    if (obj.d[i][fieldLast]) {
                                        var price = stockRecord[property].split("|");
                                        me._calculateAlert(obj.d[i][fieldLast], price, updateRec, "lastprice2", "Last Price 2");
                                    }
                                    break;
                                case "change":
                                    if (obj.d[i]["change"]) {
                                        var change = stockRecord[property].split("|");
                                        me._calculateAlert(obj.d[i]["change"], change, updateRec, "changerise", "Rise");
                                    }
                                    break;
                                case "changeper":
                                    if (obj.d[i]["changePer"]) {
                                        var change = stockRecord[property].split("|");
                                        me._calculateAlert(obj.d[i]["changePer"], change, updateRec, "changeriseper", "Rise %");
                                    }
                                    break;
                                case "drop":
                                    if (obj.d[i]["change"]) {
                                        var change = stockRecord[property].split("|");
                                        change[0] = -change[0];
                                        me._calculateAlert(obj.d[i]["change"], change, updateRec, "changedrop", "Drop");
                                    }
                                    break;
                                case "dropper":
                                    if (obj.d[i]["changePer"]) {
                                        var change = stockRecord[property].split("|");
                                        change[0] = -change[0];
                                        me._calculateAlert(obj.d[i]["changePer"], change, updateRec, "changeriseper", "Drop %");
                                    }
                                    break;
                                case "volume":
                                    if (obj.d[i][fieldVol]) {
                                        var volume = stockRecord[property].split("|");
                                        me._calculateAlert(obj.d[i][fieldVol], volume, updateRec, "volume", "Volume");
                                    }
                                    break;
                                case "value":
                                    if (obj.d[i][fieldValue]) {
                                        var value = stockRecord[property].split("|");
                                        me._calculateAlert(obj.d[i][fieldValue], value, updateRec, "value", "Value");
                                    }
                                    break;
                                case "lot":
                                    if (obj.d[i][fieldLotSize]) {
                                        var value = stockRecord[property].split("|");
                                        me._calculateAlert(obj.d[i][fieldLotSize], value, updateRec, "lot", "Lot");
                                    }
                                    break;
                                case "buy":
                                    if (obj.d[i][fieldBuy]) {
                                        var buy = stockRecord[property].split("|");
                                        me._calculateAlert(obj.d[i][fieldBuy], buy, updateRec, "buy", "Buy");
                                    }
                                    break;
                                case "buyqty":
                                    if (obj.d[i][fieldBqty]) {
                                        var buyqty = stockRecord[property].split("|");
                                        me._calculateAlert(obj.d[i][fieldBqty], buyqty, updateRec, "buyqty", "B/C");
                                    }
                                    break;
                                case "sell":
                                    if (obj.d[i][fieldSell]) {
                                        var sell = stockRecord[property].split("|");
                                        me._calculateAlert(obj.d[i][fieldSell], sell, updateRec, "sell", "Sell");
                                    }
                                    break;
                                case "sellqty":
                                    if (obj.d[i][fieldBqty]) {
                                        var sellqty = stockRecord[property].split("|");
                                        me._calculateAlert(obj.d[i][fieldBqty], sellqty, updateRec, "sellqty", "S/C");
                                    }
                                    break;
                                case "remark":
                                    if (!jsutil.isEmptyObject(updateRec)) {
                                        var remark = stockRecord[property];
                                        updateRec["remark"] = remark;
                                        updateRec["remarktitle"] = "Remark";
                                    }
                                    break;
                            }
                        }
                        if (!jsutil.isEmptyObject(updateRec)) {
                            var date = Ext.Date.format(new Date(), "d-m-Y").toString();
                            var time = Ext.Date.format(new Date(), "H:i:s").toString();
                            updateRec[fieldStkName] = stockRecord[fieldStkName];
                            updateRec[fieldTransDate] = date;
                            updateRec[fieldTime] = time;
                            var model = me.resultView.store.getProxy().getModel();
                            me.resultView.store.insert(0, Ext.create(model, updateRec));
                        }
                    }
                }
            }

        }
    },
    _conditionSign: function(sign, current, alertprice) {
        current = parseFloat(current);
        alertprice = parseFloat(alertprice);
        var arr = new Array();
        switch (sign) {
            case "eql" :
                if (current == alertprice) {
                    arr.push(current);
                    arr.push("=");
                }
                break;
            case "sr" :
                if (alertprice < current) {
                    arr.push(current);
                    arr.push(">");
                }
                break;
            case "lr" :
                if (alertprice > current) {
                    arr.push(current);
                    arr.push("<");
                }
                break;
            case "sreql":
                if (alertprice <= current) {
                    arr.push(current);
                    arr.push(">=");
                }
                break;
            case "lreql" :
                if (alertprice >= current) {
                    arr.push(current);
                    arr.push("<=");
                }
                break;
        }
        return arr;

    },
    _calculateAlert: function(current, stockrecord, updateRec, alertpricepro, title) {
        var me = this;
        var conSign = me._conditionSign(stockrecord[1], current, stockrecord[0]);
        var titlepro = alertpricepro + "title";
        var currentpro = alertpricepro + "current";
        var signpro = alertpricepro + "sign";
        if (conSign.length != 0) {
            updateRec[titlepro] = title;
            updateRec[currentpro] = conSign[0];
            updateRec[signpro] = conSign[1];
            updateRec[alertpricepro] = stockrecord[0];
        }
    }

});

// from components.js
function createPriceAlert(portlet_col, idx) {
    if (priceAlert == null) {
        var appMainSize = n2nLayoutManager.getAppMain().getSize();

        // read from cookie
        var qsHeight = 300;
        if (!isMobile) {
            //  qsHeight = cookies.readCookie('_Quote_Height_');
            if (qsHeight != null) {
                qsHeight = parseInt(qsHeight);
            } else {
                if (n2nLayoutManager.isWindowLayout()) {
                    qsHeight = appMainSize.height - 235;
                } else {
                    qsHeight = appMainSize.height - 241;
                }
            }
        }
        priceAlert = Ext.widget('pricealert', {
            itemId: 'pricealert',
            title: languageFormat.getLanguage(20608, 'Price Alert'),
            height: qsHeight,
            minHeight: 300,
            maxHeight: 600
        });
        priceAlert.on("destroy", function() {
            priceAlert = null;
        });
        portlet_col = portlet_col ? portlet_col : portalcol_2;
        n2nLayoutManager.addItem(priceAlert, portlet_col, idx);
        n2nLayoutManager.activateItem(priceAlert);
    } else {
        n2nLayoutManager.activateItem(priceAlert);
    }
}

function setThemeCSS(themeName, altOpt) {
    console.log('themeName', themeName);
    
    Ext.getBody().hide();
    
    var baseBlackPath = N2N_CONFIG.themePath + 'black.css';
    if (themeName.indexOf("black") != -1) {
        Ext.util.CSS.swapStyleSheet("blackbase", baseBlackPath);
    } else {
        Ext.util.CSS.swapStyleSheet("blackbase", "");
    }
    
    Ext.Function.defer(function() {
        Ext.getBody().show();
        // refresh market depth gradient if switching between lite and dark theme
        if (newMarketDepth && newMarketDepth.isGradient === 'gradient') {
            newMarketDepth.refresh(themeName);
        }
        
        if (orderPad && orderPad.compRef.marketDepth && orderPad.compRef.marketDepth.isGradient === "gradient") {
            orderPad.compRef.marketDepth.refresh(themeName);
        }
        
        // alternative row effect
        if (altOpt) {
            setAltStyle(altOpt, themeName);
        }
    }, 500); // delay 0.5s
}

Ext.define('TCPlus.view.settings.TickerSetting', {
    extend: 'Ext.window.Window',
    alias: 'widget.tickersetting',
    title: 'Ticker Settings',
    width: 450,
    height: 300,
    autoShow: true,
    modal: true,
    bodyPadding: 5,
    _ots: {},
    initComponent: function() {
        var me = this;

        // Show/hide ticker
        var tsShowHideRg = Ext.create('Ext.form.RadioGroup', {
            fieldLabel: 'Ticker',
            labelWidth: 50,
            width: 200,
            items: [
                {boxLabel: 'On', name: 'tsShowHideRg', inputValue: 1, checked: true},
                {boxLabel: 'Off', name: 'tsShowHideRg', inputValue: 0}
            ],
            listeners: {
                change: function(thisComp, newValue) {
                    if (newValue.tsShowHideRg == 1) {
                        tsSpeedRg.setDisabled(false);
                        tsTickerItem.setDisabled(false);
                        n2nTicker.reconfigure({show: true});
                    } else {
                        tsSpeedRg.setDisabled(true);
                        tsTickerItem.setDisabled(true);
                        n2nTicker.reconfigure({show: false});
                    }
                }
            }
        });
        // ticker speed radio
        var tsSpeedRg = Ext.create('Ext.form.RadioGroup', {
            fieldLabel: 'Speed',
            labelWidth: 50,
            width: 270,
            items: [
                {boxLabel: 'Slow', name: 'tsSpeedRg', inputValue: 1},
                {boxLabel: 'Medium', name: 'tsSpeedRg', inputValue: 5, checked: true},
                {boxLabel: 'Fast', name: 'tsSpeedRg', inputValue: 10}
            ],
            listeners: {
                change: function(thisComp, newValue) {
                    n2nTicker.reconfigure({speed: newValue['tsSpeedRg']});
                }
            }
        });
        var tsQsShow = Ext.create('Ext.form.field.Checkbox', {
            id: 'tsQsShow',
            boxLabel: 'All stocks in quote screen',
            checked: true
        });
        var tsWlShow = Ext.create('Ext.form.field.Checkbox', {
            id: 'tsWlShow',
            boxLabel: 'All stocks in watch lists',
            checked: true
        });
        var tsMordShow = Ext.create('Ext.form.field.Checkbox', {
            id: 'tsMordShow',
            boxLabel: 'Matched orders',
            hidden: true
        });
        var tsNewsShow = Ext.create('Ext.form.field.Checkbox', {
            id: 'tsNewsShow',
            boxLabel: 'News update',
            hidden: true
        });
        var tsCodesTxt = Ext.create('Ext.form.field.TextArea', {
            fieldLabel: 'Stock codes (separated by commas)',
            anchor: '100%'
        });
        // Ticker items
        var tsTickerItem = Ext.create('Ext.form.FieldSet', {
            title: 'Display',
            labelWidth: 50,
            items: [
                tsQsShow,
                tsMordShow,
                tsNewsShow
            ]
        });
        // Save button
        var tsSaveBtn = Ext.create('Ext.button.Button', {
            text: 'Save',
            iconCls: 'icon-save',
            handler: function() {
                var tsShowValue = tsShowHideRg.getValue()['tsShowHideRg'];
                var tsSpeedValue = tsSpeedRg.getValue()['tsSpeedRg'];
                var tsQsValue = tsQsShow.getValue() ? 1 : 0;
                var tsMord = tsMordShow.getValue() ? 1 : 0;
                var tsNews = tsNewsShow.getValue() ? 1 : 0;

                var tsValues = new Array();
                tsValues.push(tsShowValue);
                tsValues.push(tsSpeedValue);
                tsValues.push(tsQsValue);
                tsValues.push('');
                tsValues.push(tsMord);
                tsValues.push(tsNews);
                var pts = tsValues.join("~");
                var url = addPath + "tcplus/setting?a=set&sc=TCLTSI&p=" + pts;
                Ext.Ajax.request({
                    url: url,
                    success: function(response) {
                        var res = Ext.decode(response.responseText);
                        me.close();
                        if (res != null && res.s) {
                            // update tsItems
                            tsItems = pts;
                            if (n2nTicker != null && tsQsValue != me._ots['showQs']) {
                                n2nTicker.restart();
                            }
                        }
                    },
                    failure: function() {
                        me.close();
                    }
                });
                me.close();
            }
        });
        // Cancel button
        var tsCancelBtn = Ext.create('Ext.button.Button', {
            text: 'Cancel',
            handler: function() {
                n2nTicker.reconfigure(me._ots);
                me.close();
            }
        });

        Ext.apply(me, {
            items: [
                tsShowHideRg,
                tsSpeedRg,
                tsTickerItem
            ],
            bbar: [
                '->',
                tsSaveBtn,
                '-',
                tsCancelBtn
            ],
            listeners: {
                afterrender: function() {
                    var tsi = me.getTickerSettings();
                    tsShowHideRg.setValue({tsShowHideRg: tsi[0]});
                    tsSpeedRg.setValue({tsSpeedRg: tsi[1]});
                    tsQsShow.setValue(jsutil.toBoolean(tsi[2]));
                    tsMordShow.setValue(jsutil.toBoolean(tsi[4]));
                    tsNewsShow.setValue(jsutil.toBoolean(tsi[5]));
                }
            }
        });
        me.callParent();
    },
    getTickerSettings: function() {
        var me = this;
        var tsi = tsItems.split("~"); // from main.jsp

        debugutil.debug('TickerSetting > getTickerSettings', {tsi: tsi});
        me._ots = {
            show: jsutil.toBoolean(tsi[0]),
            speed: parseInt(tsi[1]),
            showQs: jsutil.toBoolean(tsi[2])
        };
        return tsi;
    }
});

/**
 * Provides ticker setting UI (from components.js)
 */
function tickerSettingUI() {
    Ext.create('widget.tickersetting');
}

Ext.define('TCPlus.view.MutualFund', {
        extend: 'Ext.grid.Panel',
        alias: 'widget.mutualFund',
        requires: [
            'Ext.grid.column.Action'
        ],
        //Column var
        columnHash: null,
        //Component var
        compRef: {},
        //Saving
        type: 'mf',
        slcomp: "mf",
        savingComp: true,
        screenType: 'main',
        //Additional var
        ddComp: true,        
        //Record var
        count: parseInt(10), //Later add a config for this
        //Record time
        currentTime: 0, // current times for refresh data
        sortingTime: 0, // added v1.3.29.5, current time for data sorting
        //Sorting
        sort: [{
                property: fieldStkFName,
                direction: 'DESC'
            }],
        sortName: null,
        filter: null,
        //context menu button
        cMenuStkCode: null, // context menu - stkcode
        cMenuStkName: null, // context menu - stkName
        contextMenu: null,
        cMenuBuyId: Ext.id(),
        cMenuSellId: Ext.id(),
        cMenuOrderStatus: Ext.id(),
        cMenuEqPrtfId: Ext.id(),
        cMenuStkTrackerId: Ext.id(),
        cMenuAnalysisId: Ext.id(),
        //Paging
        page: 0, // record paging number and set url parameter
        //For card view to map stkcode location
        stkList: [],
        //Param for send exchg to conn
        exch: 'PHMF',
        //TODO add the save user preference
        //Filter var
        filterFundIssuer: N2N_CONFIG.MFFundIssuerDefault,
        filterFundType: N2N_CONFIG.MFFundTypeDefault,
        filterRiskRating: N2N_CONFIG.MFRiskRatingDefault,
        filterCurrencyMF: N2N_CONFIG.MFCurrencyDefault,
        //Recommendation array
        arrayFilterFundType: [],
        initComponent: function() {
            var me = this;
            
            me.emptyMsg = languageFormat.getLanguage(30013, 'No result found.');
            me.createUI();
            
            var store = Ext.create('Ext.data.Store', {
                model: 'TCPlus.model.StockRecord',
                listeners: {
                    datachanged: function (thisStore) {
                        me.blockPrevNextButton();
                    }
                }
            });            
            
            Ext.apply(me, {
                store: store,
                keyEnabled: N2N_CONFIG.keyEnabled,
                layout: 'hbox',
                //Top bar according to quote screen
                tbar: me.compRef.OptBar,
                //remove header within window
                header: false,
                width: '100%',
                //Column
                //load all var for cookie key into the grid for save cookie purpose
                columnHash: me.columnHash,
                columns: {
                    items: me.generateColumnsArray(me.generateColumn("")),
                    defaults: {
                        tdCls: 'display-render',
                        lockable: false // does not work in ExtJS 4.2, keep for its later fix
                    }
                },
                //Additional page
                items: [me.compRef.filterMsg],
                //Column formatting
                enableColumnMove: N2N_CONFIG.gridColMove,
                enableColumnHide: N2N_CONFIG.gridColHide,
                //Allow drag and drop stk
                viewConfig: getGridViewConfig(me),
                listeners: {
                    columnresize: function(ct, column, newWidth, eOpts) {
                        
                        if (newWidth === 0) {
                            column.autoSize();
                            newWidth = column.width;
                        }
                   
                        me.updateColWidthCache(column, newWidth);

                        if (N2N_CONFIG.autoQtyRound) {
                            helper.refreshView(me);
                        }
                    },
                    //Stop refresh and destroy
                    beforedestroy: function() {
                        mutualFund.stopAutoRefresh();
                        Storage.generateUnsubscriptionByExtComp(mutualFund);
                        mutualFund = null;
                    },
                    destroy: function () {
                        if (me.contextMenu != null) {
                            me.contextMenu.destroy();
                        }
                    },
                    //Sync comp START
                    cellclick: function (view, td, cidx, record, tr, ridx, evt) {
                        updateActivePanel(view, record, cidx);
                    },
                    celldblclick: function (view, td, cidx, record, tr, ridx, evt) {
                        // reset closing status
                        closedOrderPad = false;
                        if (!n2nLayoutManager.isWindowLayout()) {
                            // closedMarketDepth = false;
                        }
                        updateActivePanel(view, record, cidx, true);
                    },
                    //Sync comp END
                    itemcontextmenu: function (thisView, record, item, index, e) {
                        
                        //Hide first due to not supported
                        if (!touchMode) {
                            me.showContextMenu(thisView, record, index, e);
                        }
                    },
                    resize: function (thisComp) {
                        
                        //Save cookie snippet
                        var ppanel = me.findParentByType('panel');
                        cookies.createCookie(cookieKey + "_MFund_Height_", ppanel.getHeight(), 1800);
                        
                    },
                    columnmove: function(){
                        gridColHandler(me);
                    },
                    columnshow: function(){
                        gridColHandler(me);
                        helper.autoFitColumns(me);
                    },
                    columnhide: function(){
                        gridColHandler(me);
                        helper.autoFitColumns(me);
                    }
                }
            });            
            
            //Create menu for sorting
            me.initializeSortMenu();
            //Create context menu
            me.createContextMenu();
            me.callParent(arguments);
        },
        //CreateUI
        createUI: function() {
            var me = this;
            
            me._createOptionBar();
            me.procColumnWidth();
            
        },
        _createOptionBar: function() {
            var me = this;
        
            //Button cls
            var btnCls = 'smallerbtn';
            if (!isMobile) {
                btnCls = '';
            }
        
            //Left side start
            //Card view and grid view
            if (N2N_CONFIG.cardViewButton) {
                me.compRef.cardViewBtn = Ext.widget('cardviewbuttonmf', {
                    grid: me,
                    defaultView: userPreference.get('mfv', 'grid'),
                    switchViewHandler: function (cardBtn, grid, currentView) {
                        
                        me._setDisplayRecord();
                        // reset page number
                        me.setPageNo(0);

                        if (currentView === 'card') {
                            
                            me.compRef.matrixSettingBt.show();
//                            if (N2N_CONFIG.useEditButton) {
//                                me.compRef.btnEditDone.hide();
//                            }
                            if (N2N_CONFIG.autoWidthButton) {
                                me.compRef.tFitColumns.hide();
                            }
                            //Button for manage column easily, very pity that no one want to use
//                            if (global_showColSettingHeader == "TRUE") {
//                                me.tempButton_column.hide();
//                            }

                            Storage.generateUnsubscriptionByExtComp(me);

                        } else {
                            // close existing depth matrix setting
                            me.cardComp.closeSettingWin();

                            me.compRef.matrixSettingBt.hide();
//                            if (N2N_CONFIG.useEditButton) {
//                                me.compRef.btnEditDone.show();
//                            }
                            if (N2N_CONFIG.autoWidthButton) {
                                me.compRef.tFitColumns.show();
                            }
                            //Button for manage column easily, very pity that no one want to use
//                            if (global_showColSettingHeader == "TRUE") {
//                                me.tempButton_column.show();
//                            }
                        }
//
                        if (me.onSearchStatus) {
                            me.search();
                        } else {
                            me.callSort();
                        }

                        userPreference.set('mfv', currentView);
                        userPreference.save();
                    }
                });

                //Setting for card view
                me.compRef.matrixSettingBt = Ext.create('Ext.button.Button', {
                    text: languageFormat.getLanguage(20601, 'Settings'),
                    iconCls: 'icon-setting2',
                    tooltip: languageFormat.getLanguage(20678, 'Matrix setting'),
                    hidden: userPreference.get('mfv', 'grid') === 'grid',
                    handler: function () {
                        me.cardComp.setting();
                    }
                });
            }
            //Open new page for filter, do UI first
            me.compRef.tButtonFilter = new Ext.button.Button({
                text: languageFormat.getLanguage(11064, 'Filter by'),
                //FILTER PART SO LATER DO
                cls: btnCls,
                handler: function () {
                    //open popup message for filter page
                    
                    //Open something
                    //Nevermind the logic is create and then destroy
                    me._createFilterPage();
                    
                }
            });
            //Sorting
            me.compRef.tButtonSort = new Ext.button.Button({
                text: languageFormat.getLanguage(33572, 'Sort by Fund Name'),
                hidden: global_showSortByMarketHeader == "TRUE" ? false : true,
                menu: [],
                cls: btnCls
            });
            //search bar
            if (N2N_CONFIG.searchAutoComplete) {
                me.compRef.searchTf = Ext.widget('searchautobox', {
                    exch: me.exch,
                    listeners: {
                        select: function(thisCb, records) {
                            if (records.length > 0) {
                                var rec = records[0];

                                me.setPageNo(0);
                                me.search(rec.get('stkCode'));

                            }
                        }
                    },
                    onSearchEnterKey: function(records) {
                        if (records.length > 0) {
                            var rec = records[0];
                            
                                me.setPageNo(0);
                                me.search(rec.get('stkCode'));
                                
                        } else {
                            msgutil.alert(languageFormat.getLanguage(30013, 'No result found.'));
                        }
                    }
                });
            }
            //Search button
            me.compRef.search = new Ext.button.Button({
                text: languageFormat.getLanguage(10007, 'Search'),
                tooltip: languageFormat.getLanguage(10007, 'Search'),
                iconCls: 'icon-search',
                handler: function () {
                    if (me.compRef.searchTf.getValue().trim() == "") {//v1.3.34.11
                        me.compRef.searchTf.setValue('');
                        msgutil.alert(languageFormat.getLanguage(30001, 'Please key in your search text.'), function () {
                            panel.tFieldSearch.focus();
                        });
                    } else {
                        me.setPageNo(0);
                        me.search(me.compRef.searchTf.getValue());
                    }
                }
            });
            //Left side end

            //Right side start
            // reset button
            me.compRef.tButtonReset = Ext.create('Ext.button.Button', {
                text: languageFormat.getLanguage(10003, 'Reset'),
                tooltip: languageFormat.getLanguage(10003, 'Reset'),
                iconCls: 'icon-reset',
                style: isMobile ? 'margin: 0 5px 0 2px;float:left;' : 'margin: 0 5px;float:left;',
                handler: function() {
                    //Set back initial value
                    me.setPageNo(0);
                    me.compRef.searchTf.setValue('');
                    
                    me.callSort();
                }
            });

            // fit column button
            me.compRef.tFitColumns = Ext.create('Ext.button.Button', Ext.merge({
                text: languageFormat.getLanguage(20664, 'Fit columns'),
                tooltip: languageFormat.getLanguage(20664, 'Fit columns'),
                iconCls: 'icon-fitcolumn',
                hidden: userPreference.get('mfv', 'grid') === 'card',
                handler: function() {
                    helper.autoSizeGrid(me);
                }
            }));

            //Paging button
            me.compRef.tButtonFirstPage = Ext.create('Ext.button.Button', {
                iconCls: 'x-tbar-page-first',
                overflowText: languageFormat.getLanguage(10048, 'First'),
                tooltip: languageFormat.getLanguage(10048, 'First'),
                disabled: true,
                handler: function() {
                    me.goFirstPage();
                }
            });
            // paging previous button
            me.compRef.tButtonPrevPage = Ext.create('Ext.button.Button', {
                iconCls: 'x-tbar-page-prev',
                overflowText: languageFormat.getLanguage(10049, 'Previous'),
                tooltip: languageFormat.getLanguage(10049, 'Previous'),
                disabled: true,
                handler: function() {
                    me.goPrevPage();
                }
            });

            // paging next button
            me.compRef.tButtonNextPage = Ext.create('Ext.button.Button', {
                iconCls: 'x-tbar-page-next',
                overflowText: languageFormat.getLanguage(10015, 'Next'),
                tooltip: languageFormat.getLanguage(10015, 'Next'),
                handler: function() {
                    me.goNextPage();
                }
            });
            //Right side end

            //Item config
            var optionItem = []
            
            if (N2N_CONFIG.cardViewButton) {
            optionItem.push(me.compRef.cardViewBtn,
                            me.compRef.matrixSettingBt,
                            '-');
            }
            optionItem.push(me.compRef.tButtonFilter,
                            me.compRef.tButtonSort,
                            me.compRef.searchTf,
                            me.compRef.search,
                            '->',
                            me.compRef.tFitColumns,
                            me.compRef.tButtonReset,
                            me.compRef.tButtonFirstPage,
                            me.compRef.tButtonPrevPage,
                            me.compRef.tButtonNextPage
                            );

            me.compRef.OptBar = Ext.create('Ext.toolbar.Toolbar', {
                itemId: 'toolbar',
                enableOverflow: menuOverflow,
                width: '100%',
                items: optionItem
            });

            //Paging var
            me.tFieldPage = new Ext.form.Label({
                text: 1
            });            
            
        },
        //Context menu START
        createContextMenu: function () {
            var panel = this;

            /*
             *  Buy
             *  Sell
             *  Stock Info
             *  Tracker
             *  Analysis Chart
             *  Equility Portfolio
             */

            var newMenu = [
                {
                    id: panel.cMenuBuyId,
                    text: languageFormat.getLanguage(10001, 'Buy'),
                    hidden: showV1GUI == "TRUE" ? false : (showBuySellHeader == "TRUE" ? false : true),
                    popupOnly: true
                }, {
                    id: panel.cMenuSellId,
                    text: languageFormat.getLanguage(10002, 'Sell'),
                    hidden: showV1GUI == "TRUE" ? false : (showBuySellHeader == "TRUE" ? false : true),
                    popupOnly: true
                }, {
                    id: panel.cMenuOrderStatus,
                    text: languageFormat.getLanguage(10009, 'Revise') + ' / ' + languageFormat.getLanguage(10010, 'Cancel'),
                    hidden: showV1GUI == "TRUE" ? false : (showOrdBookHeader == "TRUE" ? (showOrdBookOrderSts == "TRUE" ? false : true) : true)
                }, {
                    id: panel.cMenuEqPrtfId,
                    text: languageFormat.getLanguage(33690, 'Mutual Fund Portfolio'),
                    hidden: true // because no mutual fund component
//                    hidden: showV1GUI == "TRUE" ? false : (showPortFolioHeader == "TRUE" ? (showPortFolioMyPortFolio == "TRUE" ? false : true) : true)
                }, {
                    id: panel.cMenuStkTrackerId,
                    text: languageFormat.getLanguage(20024, 'Stock Info/Tracker'),
                    hidden: showV1GUI == "TRUE" ? true : (showStkInfoHeader == "TRUE" ? (showStkInfoTracker == "TRUE" ? false : true) : true)
                }, {
                    id: panel.cMenuAnalysisId,
                    text: languageFormat.getLanguage(20102, 'Analysis Chart'),
                    hidden: showV1GUI == "TRUE" ? true : (showChartHeader == "TRUE" ? (showChartAnalysisChart == "TRUE" ? false : true) : true)
                }
            ];


            panel.contextMenu = new Ext.menu.Menu({
                stkCode: '',
                items: newMenu,
                listeners: addDDMenu()
            });

        },        
        showContextMenu: function (grid, record, ridx, e) {
            var panel = this;

            e.stopEvent();

            grid.getSelectionModel().select(ridx);

            if (panel.contextMenu == null) {
                panel.createContextMenu();
            }

            var stkCode = record.get(fieldStkCode);
            var stkName = record.get(fieldStkName);
            panel.cMenuStkCode = stkCode;
            panel.cMenuStkName = stkName;

            panel.disableRightFunction(panel.cMenuStkCode);
            panel.contextMenu.showAt(e.getXY());
        },        
        onContextMenuClick: function (funcs) {
            var panel = this;

            if (funcs != null) {
                for (var i = 0; i < funcs.length; i++) {
                    var func = funcs[i];

                    if (func.name != null) {
                        var btn;

                        switch (func.name) {
                            case panel.cMenuBuyId:
                                btn = panel.contextMenu.getComponent(panel.cMenuBuyId);
                                btn.setHandler(func.func);
                                break;
                            case panel.cMenuSellId:
                                btn = panel.contextMenu.getComponent(panel.cMenuSellId);
                                btn.setHandler(func.func);
                                break;
                            case panel.cMenuOrderStatus:
                                btn = panel.contextMenu.getComponent(panel.cMenuOrderStatus);
                                btn.setHandler(func.func);
                                break;
                            case panel.cMenuEqPrtfId:
                                btn = panel.contextMenu.getComponent(panel.cMenuEqPrtfId);
                                btn.setHandler(func.func);
                                break;
                            case panel.cMenuStkTrackerId:
                                btn = panel.contextMenu.getComponent(panel.cMenuStkTrackerId);
                                btn.setHandler(func.func);
                                break;
                            case panel.cMenuAnalysisId:
                                btn = panel.contextMenu.getComponent(panel.cMenuAnalysisId);
                                btn.setHandler(func.func);
                                break;
                        }
                    }
                }
            }
        },
        disableRightFunction: function (stk) {	// applicable for outbound some exchange does not have data
            var panel = this;
            if (panel.contextMenu) {
                var intradayChartBtn = panel.contextMenu.getComponent(panel.cMenuChartId);
                var ibBtn = panel.contextMenu.getComponent(panel.cMenuIB);
                var stkEx = formatutils.getExchangeFromStockCode(stk);

                checkContextMenuItems(intradayChartBtn, ibBtn, stkEx);
            }
        },
        //For card view to get rec
        getSelectedRec: function () {
            var panel = this;

            if (panel.isCardView) {
                var card = panel.cardComp.getSelectedCard();

                if (card && card.stkcode) {
                    var rec = {};
                    rec[fieldStkCode] = card.stkcode;
                    rec[fieldStkName] = card.stkname;

                    return [Ext.create('TCPlus.model.StockRecord', rec)];
                }

                return [];
            } else {
                return panel.getSelectionModel().getSelection();
            }
        },
        //Context menu END
        //Load data section START
        //Start load data
        start: function() {
            var me = this;
            
            if(me.rendered){
                me.displayRecommend();
                me.show();                

            } else {
                // wait until UI rendered
                setTimeout(function() {
                    me.start();
                }, 0);                
            }
            
        },
        show: function () {
            var panel = this;
            
            if (panel.isCardView && !panel.cardComp && !panel.delayedShowTask) {
                // delay show until card components created
                panel.delayedShowTask = setTimeout(function() {
                    panel.show();
                    panel.delayedShowTask = null;
                }, 0);

                return;
            }            
            
            panel._setDisplayRecord();
            
            if (searchKey != "") {
                panel.searchValue = searchKey;
                panel.search();
            } else {
                panel.callSort();
            }
            
            panel.refreshRecordTime();
        },
        refreshRecordTime: function () {
            var panel = this;

            var date = new Date();
            var day = date.getDate();
            var month = date.getMonth() + 1; //January starts from 0
            var year = date.getFullYear();

            if (month < 10) {
                month = '0' + month;
            }

            var currentDate = (year + "/" + month + "/" + day);
            var currentDateISO = (year + "-" + month + "-" + day);

            console.log('[feed][refreshRecordTime] refresh time ---> ' + N2N_CONFIG.MFundMarketRefreshTime);

            panel.marketRefreshTime = {};
            
            if (N2N_CONFIG.MFundMarketRefreshTime.length != 0) {
                var exchangeList = N2N_CONFIG.MFundMarketRefreshTime.split(';');

                for (var i = 0; i < exchangeList.length; i++) {
                    if (exchangeList[ i ].length != 0) {
                        var tempList = exchangeList[ i ].split('|');
                        var tempListTimer = tempList[1].split('-');

                        panel.marketRefreshTime[ tempList[0] ] = {};
                    }
                }
            }
            
            panel.loopTime = setInterval(function () {
                if (streaming && !n2nLayoutManager.isActivation(panel)) { // avoid refresh when not in view
                    return;
                }

                if (panel.isCardView) {
                    return; // avoid auto refresh on card view (to avoid too much data pulling)
                }
                
                var localRefresh = 60;
                var serverRefresh = 300;
                
                if (N2N_CONFIG.MFundMarketRefreshTime.length != 0) {
                if (panel.marketRefreshTime[ exchangecode ] != null) {
                    if (topPanelBarPanel != null) {
                        var currentTime = topPanelBarPanel.getTime();
                        var tempDateTime = currentDateISO + 'T' + currentTime; // (YYYY-mm-ddTHH:mm:ss) currently ECMAScript 5 ISO-8601 format support used by latest web browsers.
                        var tempDateTimeFallBack = currentDate + ' ' + currentTime; // fallback to this date format as IE8/Safari5 is not able to support the new format.
                        var startTime;
                        var endTime;

                        if (isNaN(Date.parse(tempDateTime))) {
                            startTime = currentDate + ' ' + tempListTimer[0];
                            endTime = currentDate + ' ' + tempListTimer[1];
                            if (Date.parse(tempDateTimeFallBack) >= Date.parse(startTime) && Date.parse(tempDateTimeFallBack) <= Date.parse(endTime)) {
                                localRefresh = 15;
                                serverRefresh = 60;
                            }
                        } else {
                            startTime = currentDateISO + 'T' + tempListTimer[0];
                            endTime = currentDateISO + 'T' + tempListTimer[1];
                            if (Date.parse(tempDateTime) >= Date.parse(startTime) && Date.parse(tempDateTime) <= Date.parse(endTime)) {
                                localRefresh = 15;
                                serverRefresh = 60;
                            }
                        }

                        /*
                         if (Date.parse(currentDate + ' ' + currentTime) >= Date.parse(currentDate + ' ' + tempListTimer[ 0 ]) && Date.parse(currentDate + ' ' + currentTime) <= Date.parse(currentDate + ' ' + tempListTimer[ 1 ])) {
                         localRefresh = 15;
                         serverRefresh = 60;
                         }*/
                    }
                }
            }

            panel.currentTime = parseInt(panel.currentTime) + 1;
            panel.sortingTime = parseInt(panel.sortingTime) + 1;

            if (panel.currentTime == serverRefresh) {
                if (exchangecode != "HKD") {
                    console.log('[feed][refreshRecordTime] refresh server *** ');

                    if (panel.onSearchStatus == false) {
                        if (panel.store.getCount() != 0) {
                        	panel.callSort(true);
                        }
                    }
                }
                panel.currentTime = 0;
            }

            if (panel.sortingTime == localRefresh) {
                console.log('[feed][refreshRecordTime] refresh local grid *** ');

                if (panel.onSearchStatus == false) {
                    if (panel.getStore().getCount() > 0) {
                        panel.getStore().sort();
                        Blinking.resetBlink(panel);
                    }
                }
                panel.sortingTime = 0;
            }

        }, 1000);
            
        },
        //Stop refresh data
        stopAutoRefresh: function () {
            if (this.loopTime) {
                clearInterval(this.loopTime);
            }
        },
        //For reloading
        resetLoad: function () {
            var panel = this;

            panel._setDisplayRecord();
            if (panel.onSearchStatus) {
                panel.search();
            } else {
                panel.callSort();
            }
        },        
        callSort: function (onVerify) {
            var panel = this;

            if (N2N_CONFIG.lDebug) {
                t3 = new Date().getTime();
            }

            panel._onVerify = onVerify;
            if (!panel._onVerify) {
                resetOrderPad();
                panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
            }

            //Not sure what this is, skip first
    //            panel.isBlockButton = false;

            if (!onVerify) {

                if (panel.onSearchStatus) {
                    // panel.store.sort(fieldVol, "DESC");
                }
                panel.onSearchStatus = false;
                panel.searchValue = "";

                if (!panel.isCardView) {
                    Blinking.clearBlink(panel);
                }
            }

            console.log("mf grid view");
            var count = parseInt(panel.count);
            panel.tAjax_ID = panel._returnAjaxId();

            var market = panel.market;

            var sortReq = {
                ex: panel.exch,
                sorters: panel.sort,
                mkt: "10",
                sec: null,
                secList: null,
                f: panel.getFieldList("all"),
                p: panel.page,
                c: count,
                filterFundIssuer: panel.filterFundIssuer,
                filterFundType: panel.filterFundType,
                filterRiskRating: panel.filterRiskRating,
                filterCurrencyMF: panel.filterCurrencyMF,
                //Array for recommendation
                arrayFilterFundType: panel.arrayFilterFundType,
                success: function (obj) {

                    if (N2N_CONFIG.lDebug && t3) {
                        console.log('load feed in ', (new Date().getTime() - t3) / 1000, 's');
                        t3 = new Date().getTime();
                    }

                    try {
                        // TODO
                        obj.t = panel.tAjax_ID;

                        if (!obj.s && !onVerify) {
                            var errorMessage = "";
                            if (obj.e != null && obj.m != null) {
                                errorMessage = obj.e + " - " + obj.m;

                            } else if (obj.c == 0 || errorMessage == "") {
                                errorMessage = panel.emptyText;

                            }

                            console.log('[feed][callSort] failure : have error ---> ' + errorMessage);

                            if ((obj.e).indexOf("9803") != -1) {

                                panel.setLoading(false);
                                panel.setPageNo(0);
                                panel.compRef.searchTf.setValue('');
//                                panel.resetFeedSetting(); //Later do

                                if (!panel.isCardView) {
                                    panel.procColumnWidth(); //v1.3.33.5
                                    panel.reconfigure(null, panel.generateColumnsArray(panel.generateColumn("")));
                                    panel.tempWidth = cookies.toDefaultColumn(panel.cookieKey);
                                    panel.isImgBlink = false;                       //v1.3.33.5
                                }

                            }

                            return;

                        } else if (!obj.s && onVerify) {
                            if (!panel.isCardView) {
                                Storage.generateUnsubscriptionByExtComp(panel, true);
                                Storage.generateSubscriptionByList(panel.stkcodes, panel);
                            }

                            console.log('[feed][callSort] success call *** ');

                        } else if (obj.s) {

                            if (panel.tAjax_ID == obj.t) {
                                if (!panel.isCardView) {
                                    Blinking.clearBlink(panel);
                                }

                                panel.updateSortHttp(obj);
                            } else {
                                if (!panel.isCardView) {
                                    Storage.generateUnsubscriptionByExtComp(panel, true);
                                    Storage.generateSubscriptionByList(panel.stkcodes, panel);
                                }
                            }

                            console.log('[feed][callSort] success call *** ');

                        } else {

                            console.log('[feed][callSort] failure : object not correct  ');
                            //msgutil.alert("[9808] Some errors occurred  while processing your request, please try again.", null);
                            msgutil.alert(languageFormat.getLanguage(30007, 'We regret to inform that we are unable to process your request at this time. Kindly try again shortly. [9808]'), null);
                            panel.stkcodes = [];
                            panel.stkList = [];
                            panel.blockPrevNextButton();
                        }

                    } catch (e) {
                        console.log('[feed][callSort] Exception ---> ' + e);

                        panel.setPageNo(0);
                        panel.compRef.searchTf.setValue('');
                        //Reset textfield value, not sure what to do first
//                        panel.resetFeedSetting();

                        if (!panel.isCardView) {
                            panel.procColumnWidth(exchangecode); //v1.3.33.5
                            panel.reconfigure(null, panel.generateColumnsArray(panel.generateColumn("")));
                            panel.tempWidth = cookies.toDefaultColumn(panel.cookieKey);
                            panel.isImgBlink = false;
                        }

                        return;
                    }
                    panel._selectFirstRow();
                }
            };

            if (panel.filterFundIssuer != "All" || panel.filterFundType != "All" || panel.filterRiskRating != "All" || panel.filterCurrencyMF != "All" || (panel.arrayFilterFundType != null && panel.arrayFilterFundType.length > 0 )) {
                conn.getFilterMFStockList(sortReq);
            } else {
                conn.getStockList(sortReq);
            }
            
        },
        _returnAjaxId: function () {
            var panel = this;
            return 'MutualFund_' + panel.id;
        },
        getFieldList: function (type) {
            var panel = this;

            var returnArray = new Array();
            var columns = helper.getGridColumns(panel);

            returnArray.push(fieldStkCode);		// stock code	
            returnArray.push(fieldStkName);		// stock name
            returnArray.push(fieldStkFName);		// stock name
            returnArray.push(fieldFundType);  // sector code 1.3.29.19

            returnArray.push(fieldCurrency);		// last, change, change %		
            returnArray.push(fieldRiskRate);		// last, change, change %		
            returnArray.push(fieldIndexGrp_06);		// Benchmark
            returnArray.push(fieldStartDate_06);	// Start Date
            returnArray.push(fieldExpiryDate);		// news, status
            returnArray.push(fieldMinInvestment);		// news, status
            returnArray.push(fieldMinAdditionalSub);	
            returnArray.push(fieldMinRedemptionQty);	
            returnArray.push(fieldMinHoldingDays);	
            returnArray.push(fieldEarlyRedemptionFee);	
            returnArray.push(fieldManagementFee);	
            returnArray.push(fieldAssetClass);	
            returnArray.push(fieldInvestmentAllocations);	
            returnArray.push(fieldSettleMentDateRedemption);	
            returnArray.push(fieldFundIssuerName);	
            returnArray.push(fieldLacp);	
            returnArray.push(fieldTransDate);	
            returnArray.push(fieldFundSize);
            
            returnArray.push(fieldYTD);
            returnArray.push(field1YTD);
            returnArray.push(field3YTD);
            returnArray.push(field5YTD);
            
            returnArray.push(fieldLast);
            returnArray.push(fieldFundIssuerName);

            var columnCount = columns.length;
            for (var i = 0; i < columnCount; i++) {
                var storeValue = null;
                var allowProcess = false;

                var col = columns[i];
                if (type == "all") {
                    allowProcess = true;

                } else {
                    //verify the column is hidden or show
                    if (!col.hidden) {
                        allowProcess = true;
                    } else {
                        allowProcess = false;
                    }
                }

                if (allowProcess) {
                    // get out the column data index
                    var dataIndex = col.dataIndex;

                    if (dataIndex == fieldLast || dataIndex == fieldChange || dataIndex == fieldChangePer) {
                        storeValue = fieldLast;

                    } else if (dataIndex == fieldStatus || dataIndex == fieldNews || dataIndex == fieldRSSIndicator) {
                        storeValue = fieldStatus;

                    } else if(dataIndex == fieldCFDMapValue_06 || dataIndex == fieldCFDTradable_06 || dataIndex == fieldCFDShortSell_06){
                            storeValue = fieldCFDMapValue_06;
                    }else {
                        if (dataIndex == fieldStkCode) {
                            if (jQC == "TRUE") {
                                storeValue = dataIndex;
                            } else {
                                storeValue = null;
                            }
                        } else {
                            storeValue = dataIndex;
                        }
                    }

                    var isExist = false;
                    for (var ii = 0; ii < returnArray.length; ii++) {
                        var val = returnArray[ii];
                        if (val == storeValue) {
                            isExist = true;
                        }
                    }
                    if (!isExist) {
                        if ((storeValue != "0" && (/^x?\d+$/).test(storeValue)) || storeValue === fieldBuyRate) {
                            returnArray.push(storeValue);
                        }
                    }
                }
            }

            if (type == "param") {
                return returnArray.join("~");
            } else {
                return returnArray;
            }
        },
        updateSortHttp: function (obj) {
            var panel = this;

            if (parseInt(obj.c) == 0) {
                if (panel.page == 0) {
                    panel.stkcodes = [];
                    panel.stkList = [];
                    panel.store.removeAll();
                    panel._recCount = 0;

                    if (panel.isCardView) {
                        panel.cardComp.setList([]);
                    } 

                } else {
                    panel.previousPage();

                    if (panel.page == 0) {
                        panel.isBlockButton = true;
                    }
                }

            } else {
                panel.updateFeed(obj);
            }
        },
        updateFeed: function (obj) {
            var panel = this;

            try {

                panel.stkcodes = [];
                panel.stkList = [];
                var tempData = [];

                for (var i = 0; i < obj.c; i++) {
                    var dataObj = obj.d[i];

                    if (dataObj[fieldStkCode] == null)
                        continue;

                    panel.stkcodes.push(dataObj[fieldStkCode]);
                    panel.stkList.push({
                        code: dataObj[fieldStkCode],
                        name: dataObj[fieldStkName]
                    });

                    tempData.push(panel._returnRecord(dataObj));
                }

                //Take care of this section TODO
                if (panel.isCardView) {
                    // Storage.procJson(obj, panel);

                    // handle card view, call start function
                    //create card view and 
                    //panel.stkcodes should replaced with the whole obj
                    //but stkcodes can still be passed in, just to store stkcode so that
                    //during update, can quickly identify which card hold which stkcodes
                    panel.cardComp.setList(panel.stkcodes, tempData);

                    panel.firstLoad = false; // for switchrefresh

                } else {
                    if (panel.onSearchStatus && N2N_CONFIG.searchJQC) {
                        activateRow(panel);
                    }

                    resetGridScroll(panel);
                    // clears sort
                    panel.store.sorters.clear();
                    panel.store.loadData(tempData);

                    helper.runBuffer('mfFitScreen');

                    // update field id
                    // panel.changeField(panel.getFieldList());
                }
                
                Storage.generateUnsubscriptionByExtComp(panel, true);
                Storage.procJson(obj, panel);
                Storage.generateSubscriptionByList(panel.stkcodes, panel);

                /*
                 * to verify is searching mode or not
                 * 
                 * if : is searching mode
                 * 		sorting stock name or stock code column
                 */
                if (panel.onSearchStatus) {
                    if (panel.compRef.tButtonTop.getText() != "Sort by Name or Code") {
                        panel.compRef.tButtonTop.setText(languageFormat.getLanguage(20666, "Sort by Name or Code"));
                    }
                } else {
                    if (!panel.isCardView) {
                        panel.getStore().sort(panel.sort);
                    }
                }

                panel._recCount = tempData.length;

                if (panel.onSearchStatus && N2N_CONFIG.searchJQC) { // not allowed paging for jqc search
                    panel.compRef.tButtonPrevPage.disable();
                    panel.compRef.tButtonNextPage.disable();
                    panel.compRef.tButtonFirstPage.disable();
                } else {
                    panel.blockPrevNextButton();
                }

            } catch (e) {
                console.log('[feed][updateFeed] Exception ---> ' + e);
            }
        },
        updateFeedRecord: function (dataObj) {
            var panel = this;
            
            if (panel.isCardView && panel.cardComp) {	

            	// find the card
            	var card = panel.cardComp.getCard(dataObj[fieldStkCode]);
            	
            	if(card){
            		card.updateYTD1(dataObj);
            	}
                   
                return; // no need updating for card view since below logic for grid only
            }


            try {

                if (panel.store.getCount() == 0)
                    return;

                var columns = helper.getGridColumns(panel);
                var lockedCols = helper.getGridColumns(panel, 'lock');
                var stkcode = dataObj[fieldStkCode];

                var rowIndex = panel.store.indexOfId(stkcode);
                var record = panel.store.getById(stkcode);
                if (record != null) {
                    // looping object key
                    for (var key in dataObj) {
                        if (dataObj.hasOwnProperty(key)) {
                            var columnIndex = helper.getColumnIndex(columns, 'dataIndex', key);
                            // bid, bid qty, ask, ask aty, lacp and so on... 
                            if (columnIndex != -1) {
                                var oldValue = record.data[key];

                                var isInteger = (/^-?\.\d{1,}$|^-?\d{1,}\.\d{1,}$|^-?\d{1,}\.\d{1,}$|^-?[0-9]\d{1,}$|^-?[0-9]$/.test(oldValue));

                                // update latest record
                                record.data[key] = dataObj[key];

                                // only for news and status
                                var updateStatus = false;
                                if (key == fieldStkStatus) {

                                    if (dataObj[fieldStkStatus] && dataObj[fieldStkStatus] != oldValue) {
                                        updateStatus = true;
                                        var statusValue = '' + dataObj[fieldStkStatus];
                                        var statusColumnIndex = helper.getColumnIndex(columns, 'dataIndex', fieldStkStatus);//columns.findColumnIndex(fieldStatus);

                                        if (statusColumnIndex != -1) {
                                            N2NUtil.updateCell(panel, rowIndex, statusColumnIndex, statusValue);
                                        }
                                    }
                                }

                                if (updateStatus) {
                                    var tempStkName = record.data[fieldStkName] ? record.data[fieldStkName] : '';

                                    var index = tempStkName.lastIndexOf('.');
                                    if (index != -1) {
                                        tempStkName = tempStkName.substring(0, index);
                                    }

                                    var stknameColumnIndex = helper.getColumnIndex(lockedCols, 'dataIndex', fieldStkName);//columns.findColumnIndex(fieldStkName);
                                    if (stknameColumnIndex != -1) {
                                        var cssClass = "";
                                        cssClass += " " + N2NCSS.FontStockName;

                                        var tempCss = StockColor.stockByQuote(tempStkName, record, panel);

                                        if (tempCss == null)
                                            cssClass += " " + N2NCSS.FontUnChange;
                                        else
                                            cssClass += " " + tempCss.css;

                                        N2NUtil.updateCell(panel, rowIndex, stknameColumnIndex, tempStkName, cssClass, 'lock');
                                    }
                                }

                                if (!columns[columnIndex].hidden) {
                                    var newCellValue = '' + dataObj[key];
                                    var columnWidth = columns[columnIndex].width;
                                    if (key == field52WHigh_06 || key == field52WLow_06 || key == fieldFreeFloat_06 || key == fieldFloatShare_06 || key == fieldForeignOwnerLimit || key == fieldIDSSTolVol_06 || key == fieldIDSSTolVal_06) { // fixed blinking issue since no data for 52WH, 52WL at first
                                        isInteger = true;
                                    }
                                    // update number cell and price cell format
                                    if (isInteger) {
                                        // for blinking string design
                                        var procUnBlinkUpDown = [fieldBqty, fieldSqty, fieldUnit, fieldVol, fieldTotTrade, fieldValue, fieldTime, fieldEPS, fieldPERatio, field12MDiv, fieldDivPay, fieldDivEx, fieldDivYld, fieldDivCcy, fieldIntDiv, fieldIntExDate, fieldSpDiv, fieldSpDivExDate, fieldFinDiv, fieldFinDivExDate, fieldIDSSTolVol_06, fieldIDSSTolVal_06];
                                        // set cell value to format number
                                        var procNumberFormat = [fieldBqty, fieldSqty, fieldUnit, fieldVol, fieldTotTrade, fieldValue, fieldShrIssue, fieldIDSSTolVol_06, fieldIDSSTolVal_06];

                                        if (procNumberFormat.indexOf(key) != -1) {
                                            newCellValue = panel.returnNumberFormat(newCellValue, columnWidth);

                                        } else {

                                            if (key == fieldTOP || key == fieldOpenInt) {
                                                if (newCellValue == 0) {
                                                    //newCellValue = panel.printString("-");
                                                } else {
                                                    //newCellValue = panel.printPrice(newCellValue, null, record);
                                                }

                                            } else if (key == fieldTime) {

                                                newCellValue = formatutils.procDateValue(newCellValue);

                                            } else if (key == fieldBuyRate) {
                                                newCellValue = getColorBar(newCellValue);
                                            }
                                        }

                                        var tempFieldList = [fieldPrev, fieldOpen, fieldOpenInt, fieldLacp, fieldHigh, fieldLow, fieldBuy, fieldSell, fieldLast, fieldTOP, fieldSettPrice, fieldRefPrice, fieldUpLmt, fieldLowLmt, field12MDiv, fieldDivPay, fieldDivEx, fieldDivYld, fieldDivCcy, fieldIntDiv, fieldIntExDate, fieldSpDiv, fieldSpDivExDate, fieldFinDiv, fieldFinDivExDate, fieldRefPrice_06, fieldEndTime_06, field52WHigh_06, field52WLow_06];
                                        if (tempFieldList.indexOf(key) != -1) {
                                            newCellValue = formatutils.procPriceValue(newCellValue).value;
                                        }

                                        //PSE
                                        var tempFieldList2 = [fieldFloatLevel_06, fieldFlunctuation_06, fieldDynamicLow_06, fieldDynamicHigh_06];
                                        if (tempFieldList2.indexOf(key) != -1) {
                                            newCellValue = formatutils.procPriceValue(newCellValue).value;
                                            N2NUtil.updateCell(panel, rowIndex, columnIndex, newCellValue);
                                        }

                                        //PSE comma separators
                                        var tempFieldList3 = [fieldFreeFloat_06, fieldFloatShare_06, fieldForeignOwnerLimit];
                                        if (tempFieldList3.indexOf(key) != -1) {
                                            newCellValue = panel.returnNumberFormat(newCellValue, columnWidth);
                                            N2NUtil.updateCell(panel, rowIndex, columnIndex, newCellValue);
                                        }

                                        // ---------------------------------------------------------------------

                                        if (key == fieldChange || key == fieldChangePer) {

                                            //                      				if ( parseFloat( newCellValue ) == 0 && parseFloat(dataObj[fieldLast]) == 0) {
                                            //                      				N2NUtil.updateCell(panel, rowIndex, columnIndex, '-');
                                            //                      				} else 
                                            if (parseFloat(newCellValue) > 0) {
                                                N2NUtil.updateCell(panel, rowIndex, columnIndex, newCellValue, N2NCSS.FontUp);

                                            } else if (parseFloat(newCellValue) < 0) {
                                                N2NUtil.updateCell(panel, rowIndex, columnIndex, newCellValue, N2NCSS.FontDown);
                                            } else {
                                                N2NUtil.updateCell(panel, rowIndex, columnIndex, newCellValue);
                                            }

                                        } else {

                                            if (key == fieldHigh || key == fieldLow || key == fieldBuy || key == fieldSell || key == fieldOpen || key == fieldTOP || key == fieldLast || key == field52WHigh_06 || key == field52WLow_06) {

                                                var tempLacp = record.data[fieldLacp];

                                                var cssClass = "";
                                                if (parseFloat(newCellValue) > tempLacp)
                                                    cssClass = N2NCSS.FontUp;

                                                else if (parseFloat(newCellValue) < tempLacp && parseFloat(newCellValue) != 0)
                                                    cssClass = N2NCSS.FontDown;

                                                else
                                                    cssClass = N2NCSS.FontUnChange;

                                                N2NUtil.updateCell(panel, rowIndex, columnIndex, newCellValue, cssClass);

                                                var fxSpreadIndex = helper.getColumnIndex(columns, 'dataIndex', fieldFXSpread);
                                                if (fxSpreadIndex != -1) {
                                                    if (!columns[fxSpreadIndex].isHidden()) {
                                                        var tempFXSpread = 0;
                                                        cssClass = N2NCSS.FontUnChange;
                                                        if (dataObj[fieldBuy] != null) {
                                                            var tempFieldSell = record.data[fieldSell];
                                                            tempFXSpread = ((tempFieldSell - dataObj[fieldBuy]) * 10000).toFixed(1);
                                                            N2NUtil.updateCell(panel, rowIndex, fxSpreadIndex, tempFXSpread, cssClass);
                                                        } else if (dataObj[fieldSell] != null) {
                                                            var tempFieldBuy = record.data[fieldBuy];
                                                            tempFXSpread = ((dataObj[fieldSell] - tempFieldBuy) * 10000).toFixed(1);
                                                            N2NUtil.updateCell(panel, rowIndex, fxSpreadIndex, tempFXSpread, cssClass);
                                                        }

                                                        record.data[fieldFXSpread] = tempFXSpread;
                                                    }
                                                }

                                            } else {

                                                N2NUtil.updateCell(panel, rowIndex, columnIndex, newCellValue);

                                            }
                                        }

                                        // ---------------------------------------------------------------------

                                        if (procUnBlinkUpDown.indexOf(key) != -1) {

                                            if (parseFloat(dataObj[key]) != parseFloat(oldValue)) {
                                                Blinking.setBlink(panel, rowIndex, columnIndex, "unchange");
                                            }

                                        } else if (key !== fieldBuyRate) {

                                            if (parseFloat(dataObj[key]) > parseFloat(oldValue)) {
                                                Blinking.setBlink(panel, rowIndex, columnIndex, "up");

                                            } else if (parseFloat(dataObj[key]) < parseFloat(oldValue)) {
                                                Blinking.setBlink(panel, rowIndex, columnIndex, "down");

                                            }

                                        }
                                    } else {
                                        // update string cell
                                        if (key == fieldExpiryDate || key == fieldTransDate) {
                                            N2NUtil.updateCell(panel, rowIndex, columnIndex, Ext.util.Format.date(newCellValue, 'd/m/Y'));
                                        } else if (key == fieldStartDate_06) {
                                            N2NUtil.updateCell(panel, rowIndex, columnIndex, jsutil.formatDate(newCellValue));
                                        } else {
                                            if (oldValue != dataObj[key]) {
                                                //newCellValue = panel.printString(newCellValue);
                                                if (key == fieldPI) {
                                                    if (newCellValue == 'b' || newCellValue == 'm') {
                                                        newCellValue = languageFormat.getLanguage(11011, 'b');
                                                    } else if (newCellValue == 's' || newCellValue == 'n') {
                                                        newCellValue = languageFormat.getLanguage(11012, 's');
                                                    } else if (newCellValue == 'o') {
                                                        newCellValue = '-';
                                                    }
                                                }
                                                N2NUtil.updateCell(panel, rowIndex, columnIndex, formatutils.procStringValue(newCellValue));
                                                // disable blink
                                                // Blinking.setBlink(panel, rowIndex, columnIndex, "unchange");
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                
            } catch (e) {
                console.log('[feed][updateFeedRecord] Exception ---> ' + e);
            }
        },        
        _returnRecord: function (dataObj) {
            var panel = this;

            var newRecord = Ext.create('TCPlus.model.StockRecord');
            newRecord.id = dataObj[fieldStkCode];

            var stValue = dataObj[fieldStatus] || '';
            dataObj[fieldNews] = stValue.charAt(5) + stValue.charAt(4);
            dataObj[fieldStkStatus] = stValue.charAt(1);
            dataObj[fieldRSSIndicator] = stValue.charAt(0);
            //dataObj[fieldRD] = panel.exchangeFeedType;
            dataObj[fieldRD] = formatutils.getLastExchangeChar(dataObj[fieldStkCode]);

            if(dataObj[fieldCFDMapValue_06]){
                    var cfdValue = formatutils.getCFDValues(dataObj[fieldCFDMapValue_06]);
                dataObj[fieldCFDTradable_06] = cfdValue.tradable;
                dataObj[fieldCFDShortSell_06] = cfdValue.shortsell;	
            }

            if (global_margin != null) {

                if (global_margin.len != null && global_margin.scpt != null) {

                    for (var ma = 0; ma < global_margin.len; ma++) { // verify from main.jsp
                        var V = global_margin.scpt[ma];

                        if (V.key == dataObj[fieldStkCode]) {
                            var marginV = V.value.split(',');

                            dataObj['margin'] = marginV[0];
                            dataObj['marginPrc'] = marginV[1];
                            dataObj['marginPc'] = marginV[2];
                        }
                    }
                }
            }


            var timeValue = dataObj[fieldTime];
            var timeval = 0;
            if (timeValue != null) {
                if (timeValue.length > 6) {
                    timeValue = timeValue.substring(1, timeValue.length);
                }

                var timevalue = formatutils.getDateInstance(timeValue);
                timeval = timevalue.getTime();
            }

            dataObj[fieldTime] = timeValue;

            dataObj[fieldChange] = 0;
            dataObj[fieldChangePer] = 0;

            newRecord.data = dataObj;

            return newRecord;
        },        
        //Load data section END 
        //Search Function
        search: function (key, silent) {
            var panel = this;
            var searchCriteria = key;
            
            //Start loadmask
            panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
            
            panel.compRef.searchTf.setValue('');
            
            conn.searchStock({
                k: searchCriteria,
                ex: panel.exch,
                mkt: null, //Null for Cross exchg, all board
                page: panel.page,
                count: N2N_CONFIG.JQCSearchMaxCount ? N2N_CONFIG.JQCSearchMaxCount : panel.count,
                field: panel.getFieldList("all"),
                success: function (obj) {
                    panel.processSearchResult(obj);
                }
            });
        },
        //Sorting function START
        //Condition for populate option
        initializeSortMenu: function () {
            var panel = this;

            var ddList = [
                {
                    text: languageFormat.getLanguage(33571, 'Sort by Fund Code'),
                    handler: function () {
                        panel.runSort('stkcode');
                    }
                },
                {
                    text: languageFormat.getLanguage(33572, 'Sort by Fund Name'),
                    handler: function () {
                        panel.runSort('stkfname');
                    }
                },
                {
                    text: languageFormat.getLanguage(33573, 'Sort by NAVPS'),
                    handler: function () {
                        panel.runSort('navps');
                    }
                },
                {
                    text: languageFormat.getLanguage(33574, 'Sort by Launch Date'),
                    handler: function () {
                        panel.runSort('startdate');
                    }
                },
                {
                    text: languageFormat.getLanguage(33579, 'Sort by Fund Type'),
                    handler: function () {
                        panel.runSort('fundtype');
                    }
                },
                {
                    text: languageFormat.getLanguage(33580, 'Sort by Risk Rating'),
                    handler: function () {
                        panel.runSort('riskrate');
                    }
                }
            ];

            panel.compRef.tButtonSort.menu = new Ext.menu.Menu({
                items: ddList
            });

            var MFPrf = panel.getMFPrf();
            panel.setSorting(MFPrf.sort);

        },
        //Initialize sorting menu option
        setSorting: function(sortName) {
            var me = this;

            var text = '';
            var sort = '';
            switch (sortName) {
                case 'stkcode':
                    text = languageFormat.getLanguage(33571, 'Sort by Fund Code');
                    sort = [{property: fieldStkCode, direction: 'ASC'}];
                    break;
                case 'stkfname':
                    text = languageFormat.getLanguage(33572, 'Sort by Fund Name');
                    sort = [{property: fieldStkFName, direction: 'ASC'}];
                    break;
                case 'navps':
                    text = languageFormat.getLanguage(33573, 'Sort by NAVPS');
                    sort = [{property: fieldLacp, direction: 'ASC'}];
                    break;
                    //Msgtype06
                case 'startdate':
                    text = languageFormat.getLanguage(33574, 'Sort by Launch Date');
                    sort = [{property: fieldStartDate_06, direction: 'ASC'}];
                    break;
                case 'fundtype':
                    text = languageFormat.getLanguage(33579, 'Sort by Fund Type');
                    sort = [{property: fieldFundType, direction: 'ASC'}];
                    break;
                case 'riskrate':
                    text = languageFormat.getLanguage(33580, 'Sort by Risk Rating');
                    sort = [{property: fieldRiskRate, direction: 'ASC'}];
                    break;
                    //TODO ytd(%) 1Y(%) 3Y(%) 5Y(%)
            }

            me.sortName = sortName;
            me.sort = sort;
            me.compRef.tButtonSort.setText(me._getSortBtnLabel(text));
        },
        //Get label for sort btn
        _getSortBtnLabel: function (str) {
            if (isMobile) {
                var parts = str.split('Sort by ');
                if (parts.length > 1) {
                    return parts[1];
                }
            }

            return str;
        },
        //Execute sort
        runSort: function (sortName) {
            var me = this;

            me.setSorting(sortName);

            // set paging number to 0
            me.setPageNo(0);
            // get data
            me.callSort();
            // clear search text field to empty
            me.compRef.searchTf.setValue('');

            me.saveMFPrf();            
        },
        //Sorting function END
        //Save and load preference
        saveMFPrf: function () {
            var me = this;

            MFundPreference.set('sort', me.sortName);
            MFundPreference.set('filter', me.filter);
            MFundPreference.save();
        
        },
        getMFPrf: function () {

            var MutualFundPrf = {
//                filter: MFundPreference.get('filter', adval),
                sort: MFundPreference.get('sort', 'stkcode')
            };

            return MutualFundPrf;
        
        },
        //Get result
        processSearchResult: function (obj) {
            var panel = this;
            
            try {
                // TODO
                obj.t = panel.tAjax_ID;
                if (!obj.s) {

                    msgutil.alert(languageFormat.getLanguage(30003, 'We regret to inform that we are unable to process your request at this time. Kindly click the Reset button and try again. [9811]'), null);
                    panel.stkcodes = [];
                    panel.stkList = [];
                    panel.blockPrevNextButton();

                } else if (obj.s) {

                    if (panel.tAjax_ID == obj.t) {

                        if (obj.c == 0) {
                            msgutil.info(languageFormat.getLanguage(30014, 'Invalid Symbol/Code.'), function () {
                                if (searchKey != '') {
                                    panel.callSort();
                                    searchKey = '';
                                } else {
                                    panel.tFieldSearch.focus();
                                }
                            }, null, false);

                            //block the prev next button if invalid counter is being search
                            panel.isBlockButton = true;
                            panel.blockPrevNextButton();

                        } else {

                            if (!panel.isCardView) {
                                Blinking.clearBlink(panel);
                            }
                            /*
                             * pass json to process
                             */
                            panel.updateSortHttp(obj);
                        }

                    } else {
                        if (!panel.isCardView) {
                            Storage.generateUnsubscriptionByExtComp(panel, true);
                            Storage.generateSubscriptionByList(panel.stkcodes, panel);
                        }
                    }
                }

                console.log('[feed][search] result : success *** ');

            } catch (e) {
                console.log('[feed][search] Exception ---> ' + e);
                msgutil.alert(languageFormat.getLanguage(30004, 'We regret to inform that we are unable to process your request at this time. Kindly click the Reset button and try again. [9806(e)]'), null);

                panel.stkcodes = [];
                panel.stkList = [];
            }

            panel._selectFirstRow();
            
        },
        //Paging function
        setPageNo: function (page) {
            var panel = this;
            // panel.suspendLayouts();

            var msg = panel.tFieldPage;

            if (msg != null) {
                var pagingNumber = 0;
                if (page == null) {
                    pagingNumber = 1;
                } else {
                    pagingNumber = page + 1;
                }
                msg.setText(pagingNumber);
                // msg.setValue(pagingNumber);
            }

            panel.page = page;
            // panel.resumeLayouts();
        },
        firstPage: function () {
            var panel = this;

            panel.setPageNo(0);

            if (panel.onSearchStatus) {
                panel.search(null);
            } else {
                panel.callSort();
            }
        },
        goFirstPage: function () {
            var panel = this;

            if (panel.compRef.tButtonFirstPage.isDisabled()) {
                return; // already a first page
            }

            if (panel.onWarrantSearchMode) {
                panel.firstWarrantPage(); ///
            } else {
                panel.firstPage();
            }
        },
        goNextPage: function () {
            var panel = this;

            if (panel.compRef.tButtonNextPage.isDisabled()) {
                return; // This is the last page
            }

            if (panel.onWarrantSearchMode) {
                panel.nextWarrantPage();
            } else {
                panel.nextPage();
            }
        },
        goPrevPage: function () {
            var panel = this;

            if (panel.compRef.tButtonPrevPage.isDisabled()) {
                return; // This is the first page
            }

            if (panel.onWarrantSearchMode) {
                panel.previousWarrantPage();
            } else {
                panel.previousPage();
            }
        },
        //Paging next button function
        nextPage: function () {
            var panel = this;


            /*
             * set paging number
             * this paging number not display in the text field, it is set passing paging number to server
             */
            panel.setPageNo(panel.page + 1);

            // call latest feed record/ recall feed record
            if (panel.onSearchStatus) {
                panel.search(null);
            } else {
                panel.callSort();
            }
        },
        //paging previous button function 
        previousPage: function () {
            var panel = this;


            if (panel.page == 0) {
                return;
            }

            /*
             * set paging number
             * this paging number not display in the text field, it is set passing paging number to server
             */
            panel.setPageNo(panel.page - 1);

            // call latest feed record/ recall feed record
            if (panel.onSearchStatus) {
                panel.search(null);
            } else {
                panel.callSort();
            }
        },        
        blockPrevNextButton: function () {
            var panel = this;

            var buttonPrevious = panel.compRef.tButtonPrevPage;
            var buttonNext = panel.compRef.tButtonNextPage;
            var buttonFirst = panel.compRef.tButtonFirstPage;
            if (panel.isBlockButton) {

                buttonPrevious.setDisabled(true);
                buttonNext.setDisabled(true);

            } else {
    //			  if (panel.tFieldPage.getValue() == 1) {
                if (panel.tFieldPage.text == 1) {
                    if (panel._recCount < panel.count) {
                        buttonPrevious.setDisabled(true);
                        buttonNext.setDisabled(true);
                    } else {
                        buttonPrevious.setDisabled(true);
                        buttonNext.setDisabled(false);
                    }
                    buttonFirst.setDisabled(true);
                } else {
                    if (panel._recCount < panel.count) {
                        buttonPrevious.setDisabled(false);
                        buttonNext.setDisabled(true);
                    } else {
                        buttonPrevious.setDisabled(false);
                        buttonNext.setDisabled(false);
                    }
                    buttonFirst.setDisabled(false);
                }
            }
        },
        //Select first row
        _selectFirstRow: function () {
            var panel = this;

            // panel.resumeLayouts(true);
            if (!panel._onVerify) {
                if (panel.isCardView) {
                    panel.cardComp.selectCard(0);
                } else {
                    activateRow(panel);
                }

            }

            if (panel.isFirstTime) {
                panel.runFitScreen();
                panel.isFirstTime = false;
            }

            n2ncomponents.activateEmptyScreens();
            panel.setLoading(false);

            panel.tAjax_Object = null;
            if (N2N_CONFIG.lDebug && t3) {
                console.log('display mutual fund in ', (new Date().getTime() - t3) / 1000, 's');
            }
        },
        //auto run fit function
        runFitScreen: function () {
            var panel = this;

            if (panel.isCardView || !helper.inView(panel)) {
                helper.addBufferedRun('mfFitScreen', function () {
                    if (!panel.isCardView) {
                        helper.autoFitColumns(panel);
                    }
                });
            } else {
                helper.autoFitColumns(panel);
            }
        },
        //Format number
        returnNumberFormat: function (value, columnWidth) {
            if (value == null) {
                return "-";
            }

            if (viewInLotMode) {
                value = formatutils.formatNumberLot(value);
            } else {
                value = formatutils.formatNumber(value, columnWidth);
            }

            return value;
        },
        //Card view and grid view function //TODO
        _setDisplayRecord: function () {
            var panel = this;

            var totalRecord = 0;
            if (panel.isCardView) {
                totalRecord = panel.cardComp.cardTotal;

            } else {
            var recordHeight = getGridRowHeight();
            var borderHeight = 23;

            var panelHeight = panel.body.getHeight(true) - borderHeight;
            // deduct some more height if the grid presents horizontal scroll
            if (!touchMode && panel.normalGrid && panel.normalGrid.getView().getEl().isScrollable()) {
                panelHeight -= 8;
            }
            var totalRecord = Math.floor(panelHeight / recordHeight);

            if (N2N_CONFIG.MFundSizeFollowSetting) {
                if (totalRecord < parseInt(N2N_CONFIG.MFundScreenRecord)) {
                        totalRecord = N2N_CONFIG.MFundScreenRecord;
                }
            }

            }

            panel.count = totalRecord;
        },
        //Column formatting, really feel like boiler code START
        generateColumnsArray: function (colSettingList) {
            var panel = this;

            var newSetting = function (meta, value, record, type) {
                var cssClass = N2NCSS.CellDefault;

                if (type == "stockName") {
                    cssClass += " " + N2NCSS.FontStockName;

                    var tempCss = StockColor.stockByQuote(value, record, panel);

                    if (tempCss == null)
                        cssClass += " " + N2NCSS.FontColorString;
                    else
                        cssClass += " " + tempCss.css;


                } else if (type == "string") {
                    cssClass += " " + N2NCSS.FontString;
                    cssClass += " " + N2NCSS.FontColorString;

                } else if (type == "unchange") {
                    cssClass += " " + N2NCSS.FontString;
                    cssClass += " " + N2NCSS.FontUnChange;

                } else if (type == "change") {
                    cssClass += " " + N2NCSS.FontString;

                    if (parseFloat(value) > 0)
                        cssClass += " " + N2NCSS.FontUp;
                    else if (parseFloat(value) < 0)
                        cssClass += " " + N2NCSS.FontDown;
                    else
                        cssClass += " " + N2NCSS.FontUnChange;

                } else if (type == "numberyellow") {
                    if (isNumberYellowColumn) {
                        cssClass += " " + N2NCSS.FontString;
                        cssClass += " " + N2NCSS.FontUnChange_yellow;
                    } else {
                        cssClass += " " + N2NCSS.FontString;
                        cssClass += " " + N2NCSS.FontUnChange;
                    }

                } else {
                    cssClass += " " + N2NCSS.FontString;

                    var tempLacp = record.data[fieldLacp];

                    if (parseFloat(value) > tempLacp)
                        cssClass += " " + N2NCSS.FontUp;

                    else if (parseFloat(value) < tempLacp && parseFloat(value) != 0)
                        cssClass += " " + N2NCSS.FontDown;

                    else
                        cssClass += " " + N2NCSS.FontUnChange;

                }

                meta.css = cssClass;
            };

            var columnList = new Array();

            var idPrefix = panel.getId();

            for (var i = 0; i < colSettingList.length; i++) {
                var colObj = colSettingList[i];
                var columnID = colObj.column;
                var colHidden = !colObj.visible;
                var colWidth = panel.getWidth(columnID);

                switch (columnID) {
                    case cmap_mfFundCode:
                    columnList.push({
                        itemId: idPrefix + cmap_mfFundCode,
                        header: languageFormat.getLanguage(33510, 'Fund Code'),
                        dataIndex: fieldStkCode, //TODO
                        hidden: colHidden,
                        sortable: true,
                        locked: true,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record, rowIndex, columnIndex, store) {
                            newSetting(meta, value, record, 'string');
                            var index = value.lastIndexOf('.');
                            if (index != -1) {
                                value = value.substring(0, index);
                            }

                            return formatutils.procStringValue(value);
                        }});
                    break;
                case cmap_mfFundName:
                    columnList.push({
                        itemId: idPrefix + cmap_mfFundName,
                        header: languageFormat.getLanguage(33511, 'Fund Name'),
                        dataIndex: fieldStkFName,
                        hidden: colHidden,
                        sortable: true,
                        locked: true,
                        //menuDisabled: isMobile,
                        width: colWidth + (isMobile ? 15 : 0),
                        renderer: function (value, meta, record, rowIndex, columnIndex, store) {
                            value = value || '';
                            newSetting(meta, value, record, 'stockName');

                            return formatutils.procStringValue(value);
                        }});
                    break;
                case cmap_mfFundType:
                    columnList.push({
                        itemId: idPrefix + cmap_mfFundType,
                        header: languageFormat.getLanguage(33512, 'Fund Type'),
                        dataIndex: fieldFundType, //TODO
                        hidden: colHidden,
                        sortable: true,
                        locked: false,
                        //menuDisabled: isMobile,
                        width: colWidth + (isMobile ? 15 : 0),
                        renderer: function (value, meta, record, rowIndex, columnIndex, store) {
                            value = value || '';
                            
                            newSetting(meta, value, record, 'stockName');
                            var index = value.lastIndexOf('.');
                            if (index != -1) {
                                value = value.substring(0, index);
                            }

                            return formatutils.procStringValue(value);
                        }});
                    break;
                case cmap_mfCurrency:
                    columnList.push({
                        itemId: idPrefix + cmap_mfCurrency,
                        header: languageFormat.getLanguage(10132, 'Currency'),
                        dataIndex: fieldCurrency,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                       // menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procStringValue(value);
                        },
                        align: 'center'});
                    break;
                case cmap_mfRiskRate:
                    columnList.push({
                        itemId: idPrefix + cmap_mfRiskRate,
                        header: languageFormat.getLanguage(33513, 'Risk Rating'),
                        dataIndex: fieldRiskRate,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mfRiskRate));
                        },
                        align: 'right'});
                    break;
                case cmap_mfBenchMark:
                    columnList.push({
                        itemId: idPrefix + cmap_mfBenchMark,
                        header: languageFormat.getLanguage(33514, 'Benchmark'),
                        dataIndex: fieldIndexGrp_06,
                        hidden: colHidden,
                        sortable: true,
                        locked: false,
                        //menuDisabled: isMobile,
                        width: colWidth + (isMobile ? 15 : 0),
                        renderer: function (value, meta, record, rowIndex, columnIndex, store) {
                            return formatutils.procStringValue(value || '');
                        }});
                    break;
                case cmap_mfLaunchDate:		//OSK
                            columnList.push({
                        itemId: idPrefix + cmap_mfLaunchDate,
                        header: languageFormat.getLanguage(33515, 'Launch Date'),
                        dataIndex: fieldStartDate_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            if (value && (value != '0')) {
                                value = jsutil.formatDate(value);
                            } else {
                                value = "";
                            }
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mfMinInvest:	//OSK
                    columnList.push({
                        itemId: idPrefix + cmap_mfMinInvest,
                        header: languageFormat.getLanguage(33516, 'Min Investment'),
                        dataIndex: fieldMinInvestment, //TODO
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mfMinInvest));
                        },
                        align: 'right'});
                    break;
                case cmap_mfMinAddSub:	//OSK
                    columnList.push({
                        itemId: idPrefix + cmap_mfMinAddSub,
                        header: languageFormat.getLanguage(33517, 'Minimum Additional Subscription'),
                        dataIndex: fieldMinAdditionalSub, //TODO
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mfMinAddSub));
                        },
                        align: 'right'});
                    break;
                case cmap_mfMinRedQty:	//OSK
                    columnList.push({
                        itemId: idPrefix + cmap_mfMinRedQty,
                        header: languageFormat.getLanguage(33518, 'Minimum Redemption Qty'),
                        dataIndex: fieldMinRedemptionQty, //TODO
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mfMinRedQty));
                        },
                        align: 'right'});
                    break;
                case cmap_mfMinHoldDays:
                    columnList.push({
                        itemId: idPrefix + cmap_mfMinHoldDays,
                        header: languageFormat.getLanguage(33519, 'Minimum holding days'),
                        dataIndex: fieldMinHoldingDays,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mfMinHoldDays));
                        },
                        align: 'right'});
                    break;
                case cmap_mfEarlyRedFee:	//OSK
                    columnList.push({
                        itemId: idPrefix + cmap_mfEarlyRedFee,
                        header: languageFormat.getLanguage(33520, 'Early redemption fee'),
                        dataIndex: fieldEarlyRedemptionFee, //TODO
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mfEarlyRedFee));
                        },
                        align: 'right'});
                    break;                    
                case cmap_mfManageFee:	//OSK
                    columnList.push({
                        itemId: idPrefix + cmap_mfManageFee,
                        header: languageFormat.getLanguage(33521, 'Management fee'),
                        dataIndex: fieldManagementFee, //TODO
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mfManageFee));
                        },
                        align: 'right'});
                    break;
                case cmap_mfAssetClass:
                    columnList.push({
                        itemId: idPrefix + cmap_mfAssetClass,
                        header: languageFormat.getLanguage(33522, 'Asset Class'),
                        dataIndex: fieldAssetClass,
                        hidden: colHidden,
                        sortable: true,
                        locked: false,
                        //menuDisabled: isMobile,
                        width: colWidth + (isMobile ? 15 : 0),
                        renderer: function (value, meta, record, rowIndex, columnIndex, store) {
                            value = value || '';

                            newSetting(meta, value, record, 'string');
                            var index = value.lastIndexOf('.');
                            if (index != -1) {
                                value = value.substring(0, index);
                            }

                            return formatutils.procStringValue(value);
                        }});
                    break;                    
                case cmap_mfInvestAllo:
                    columnList.push({
                        itemId: idPrefix + cmap_mfInvestAllo,
                        header: languageFormat.getLanguage(33523, 'Investment Allocations'),
                        dataIndex: fieldInvestmentAllocations,
                        hidden: colHidden,
                        sortable: true,
                        locked: false,
                        //menuDisabled: isMobile,
                        width: colWidth + (isMobile ? 15 : 0),
                        renderer: function (value, meta, record, rowIndex, columnIndex, store) {
                            value = value || '';

                            newSetting(meta, value, record, 'string');
                            var index = value.lastIndexOf('.');
                            if (index != -1) {
                                value = value.substring(0, index);
                            }

                            return formatutils.procStringValue(value);
                        }});
                    break;
                case cmap_mfSetDateRed:
                    columnList.push({
                        itemId: idPrefix + cmap_mfSetDateRed,
                        header: languageFormat.getLanguage(33524, 'Settlement date for redemption'),
                        dataIndex: fieldSettleMentDateRedemption,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mfManageFee));
                        },
                        align: 'right'});
                    break;
                case cmap_mfFundIssuName:
                    columnList.push({
                        itemId: idPrefix + cmap_mfFundIssuName,
                        header: languageFormat.getLanguage(33525, 'Fund Issuer Name'),
                        dataIndex: fieldFundIssuerName,
                        hidden: colHidden,
                        sortable: true,
                        locked: false,
                        //menuDisabled: isMobile,
                        width: colWidth + (isMobile ? 15 : 0),
                        renderer: function (value, meta, record, rowIndex, columnIndex, store) {
                            value = value || '';

                            newSetting(meta, value, record, 'string');
                            var index = value.lastIndexOf('.');
                            if (index != -1) {
                                value = value.substring(0, index);
                            }

                            return formatutils.procStringValue(value);
                        }});
                    break;                
                case cmap_mfNAVPS:	//OSK
                    columnList.push({
                        itemId: idPrefix + cmap_mfNAVPS,
                        header: languageFormat.getLanguage(33526, 'NAVPS'),
                        dataIndex: fieldLacp, //TODO
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mfDate:		//OSK
                    columnList.push({
                        itemId: idPrefix + cmap_mfDate,
                        header: languageFormat.getLanguage(33532, 'Trade Date'),
                        dataIndex: fieldTransDate,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');

                            return jsutil.formatDate(value);
                        },
                        align: 'center'});
                    break;
                case cmap_mfFundSize:
                    columnList.push({
                        itemId: idPrefix + cmap_mfFundSize,
                        header: languageFormat.getLanguage(33527, 'Fund Size'),
                        dataIndex: fieldFundSize,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mfFundSize));
                        },
                        align: 'right'});
                    break;
                case cmap_mfYTD:
                    columnList.push({
                        itemId: idPrefix + cmap_mfYTD,
                        header: languageFormat.getLanguage(33528, 'YTD(%)'),
                        dataIndex: fieldYTDChgPer,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mfYTD));
                        },
                        align: 'right'});
                    break;
                case cmap_mf1Y:
                    columnList.push({
                        itemId: idPrefix + cmap_mf1Y,
                        header: languageFormat.getLanguage(33529, '1Y(%)'),
                        dataIndex: fieldYTD1ChgPer,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mf1Y));
                        },
                        align: 'right'});
                    break;                    
                case cmap_mf3Y:
                    columnList.push({
                        itemId: idPrefix + cmap_mf3Y,
                        header: languageFormat.getLanguage(33530, '3Y(%)'),
                        dataIndex: fieldYTD3ChgPer,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mf3Y));
                        },
                        align: 'right'});
                    break;                    
                case cmap_mf5Y:
                    columnList.push({
                        itemId: idPrefix + cmap_mf5Y,
                        header: languageFormat.getLanguage(33531, '5Y(%)'),
                        dataIndex: fieldYTD5ChgPer,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mf5Y));
                        },
                        align: 'right'});
                    break;
                }
            }

            return columnList;
        },
        generateColumn: function (newSetting) {
            var panel = this;

            return colutils.generateColumnArray(panel, newSetting);
        },
        currentColumnSetting: function() {
            var currentColumnId = layoutProfileManager.getCol('mf'); // verify from main.jsp

            // verify is new setting or old setting 
            var temp = currentColumnId.split("~");
            var indexNumber = temp.indexOf(colutils.ColumnVersion);
            if (indexNumber != -1) {
                temp.splice(indexNumber, 1);
                currentColumnId = temp.join('~');
            } else {
                currentColumnId = "";
            }

            // filter column id
            return currentColumnId;
        },        
        defaultColumnSetting: function() {
            
            var defaultColumnId = global_MFLDefaultColumn; //todo

            // filter column id
            return colutils.filterColumnId(defaultColumnId);
        },
        allColumnSetting: function() {

            var allColumnId = global_MFLAllColumn; //todo

            // filter column id
            return colutils.filterColumnId(allColumnId);
        },
        requiredColumnSetting: function() {
            return marketMoverReqCol;
        },
        //Adjust width
        procColumnWidth: function () {
            var panel = this;

            panel._setCookieId();

            panel.columnHash = new N2NHashtable();

            var columnID = '';
            var columnWidth = '';

            var col = columnWidthSaveManager.getColWidth(panel.colWidthKey, panel.cookieKey);

            if (col) {
                columnID = col[0];
                columnWidth = col[1];
            } else {
                columnID = global_MFColumnID;
                columnWidth = global_MFWidth;
            }

            var tempInfo = [columnID, columnWidth];
            var tempCookie = tempInfo.join(',');
            cookies.setTempStorage(panel, tempCookie); //v1.3.33.27

            var IDArray = columnID.split('|');
            var widthArray = columnWidth.split('|');

            for (var x in IDArray) {
                (panel.columnHash).put(IDArray[x], parseInt(widthArray[x]));
            }

        },
        getWidth: function (columnID) {
            var panel = this;

            return panel.columnHash.get(columnID) || 100;
        },
        //Saving function section
        _setCookieId: function() {
            var me = this;
            me.cookieKey = columnWidthSaveManager.getCookieColKey('mFund');
            me.paramKey = N2N_CONFIG.constKey + 'MF';
            me.colWidthKey = 'mf';
        },
        updateColWidthCache: function (column, newWidth) {
            helper.updateColWidthCache(this, this.cookieKey, column, newWidth);
        },
        //Save column
        saveColumn: function (newColumnId) {
            var panel = this;
            panel.reconfigure(null, panel.generateColumnsArray(panel.generateColumn(newColumnId)));

            panel.requestSaveColumns(newColumnId);

            Blinking.resetBlink(panel);
            panel.updateRDToolTip();
        },
        requestSaveColumns: function(newColumnId) {
            var panel = this;
            
            // update field id - call to server what column is display
            panel.changeField(panel.getFieldList());
            newColumnId = newColumnId + "~" + colutils.ColumnVersion;
            colutils.saveColumn('mf', newColumnId);
        },
        /**
         * Description <br/>
         * 
         *      call ajax to pass new field list to server to retrieve field list record
         * 
         * @param fieldList : string
         */
        changeField: function (fieldList) {
            var panel = this;

            if (!panel.isCardView) {
                Storage.generateSubscriptionByList(panel.stkcodes, panel);
            }
        },
        //Column formatting, really feel like boiler code END
        //Filter page START
        //Create as popup
        _createFilterPage: function () {
            var me = this;

            //Split config into array
            var MFFundIssuer = N2N_CONFIG.MFFundIssuer.split("|");
            var MFFundType = N2N_CONFIG.MFFundType.split("|");
            var MFRiskRating = N2N_CONFIG.MFRiskRating.split("|");
            var MFCurrency = N2N_CONFIG.MFCurrency.split("|");
            
            //Var to temporary hold the new value, load saved data from global var from user preference
            var tempFundIssuer = me.filterFundIssuer;
            var tempFundType = me.filterFundType;
            var tempRiskRating = me.filterRiskRating;
            var tempCurrency = me.filterCurrencyMF;
            
            //Combobox
            var fundIssuerCb = {
                                    xtype: 'combo',
                                    fieldLabel: languageFormat.getLanguage(33552, 'Fund Issuer Name'),
                                    labelAlign: "top",
                                    style: 'margin: 8px',
//                                    columnWidth: 0.25,
                                    columnWidth: 0.40,
                                    //labelCls // can I add the label into here
                                    width: 100,
                                    labelWidth: 75,
                                    store: MFFundIssuer,
                                    value: tempFundIssuer,
                                    editable: false,
                                    listConfig: {
                                        minWidth: 30
                                    },
                                    listeners: {
                                        change: function (thisCb, newValue) {
                                            tempFundIssuer = newValue;
                                        }
                                    }
                                };            
            var fundTypeCb = {
                                    xtype: 'combo',
                                    fieldLabel: languageFormat.getLanguage(33553, 'Fund Type'),
                                    labelAlign: "top",
                                    style: 'margin: 8px',
                                    columnWidth: 0.35,
                                    width: 100,
                                    labelWidth: 75,
                                    store: MFFundType,
                                    value: tempFundType,
                                    editable: false,
                                    listConfig: {
                                        minWidth: 30
                                    },
                                    listeners: {
                                        change: function (thisCb, newValue) {
                                            tempFundType = newValue;
                                        }
                                    }
                                };                                
            var riskRatingCb = {
                                    xtype: 'combo',
                                    fieldLabel: languageFormat.getLanguage(33554, 'Risk Rating'),
                                    labelAlign: "top",
                                    style: 'margin: 8px',
                                    columnWidth: 0.10,
                                    width: 100,
                                    labelWidth: 75,
                                    store: MFRiskRating,
                                    value: tempRiskRating,
                                    editable: false,
                                    listConfig: {
                                        minWidth: 30
                                    },
                                    listeners: {
                                        change: function (thisCb, newValue) {
                                            tempRiskRating = newValue;
                                        }
                                    }
                                };                                
            var currencyMF = {
                                    xtype: 'combo',
                                    fieldLabel: languageFormat.getLanguage(33555, 'Currency'),
                                    labelAlign: "top",
                                    style: 'margin: 8px',
                                    columnWidth: 0.25,
                                    width: 100,
                                    labelWidth: 75,
                                    store: MFCurrency,
                                    value: tempCurrency,
                                    editable: false,
                                    listConfig: {
                                        minWidth: 30
                                    },
                                    listeners: {
                                        change: function (thisCb, newValue) {
                                            tempCurrency = newValue;
                                        }
                                    }
                                };

            var MFFilterPage = msgutil.popup({
                title: languageFormat.getLanguage(33550, 'Mutual fund filter page'),
                //Submit orderMF
                width: 700,
                height: 250,
                items: {
                    style: 'margin: 5px',
                    items: [
                        {
                            //Message
                            xtype: 'container',
                            html: languageFormat.getLanguage(33551)
                        },
                        {
                            //
                            xtype: 'container',
                            layout: {
                                type: 'column',
                                columns: 4
                            },
                            style: 'text-align:center!important',
//                            style: 'text-align:center!important;margin: 8px',
                            items: [fundIssuerCb,fundTypeCb,currencyMF]
                        },
                        {
                            //Button
                            xtype: 'container',
//                            style: 'text-align:center!important',
                            items: [
                                {
                                    xtype: 'button',
                                    text: languageFormat.getLanguage(10003, 'Reset'),
                                    width: 75,
                                    style: 'margin-right: 8px',
                                    cls: 'fix_btn',
                                    handler: function () {
                                        
                                        //Set all filter to default value
                                        me.filterFundIssuer = N2N_CONFIG.MFFundIssuerDefault;
                                        me.filterFundType = N2N_CONFIG.MFFundTypeDefault;
                                        me.filterRiskRating = N2N_CONFIG.MFRiskRatingDefault;
                                        me.filterCurrencyMF = N2N_CONFIG.MFCurrencyDefault;

                                        //Reset array
                                        me.arrayFilterFundType = [];

                                        //Apply filter and refresh after you press apply
                                        me.reloadScreen();

                                        //Close this window
                                        MFFilterPage.close();
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: languageFormat.getLanguage(10028, 'Filter'),
                                    width: 75,
                                    style: 'margin-right: 8px',
                                    cls: 'fix_btn mf_filter_btn',
                                    handler: function () {
                                        
                                        //Set all combobox to "all"
                                        me.filterFundIssuer = tempFundIssuer;
                                        me.filterFundType = tempFundType;
                                        me.filterRiskRating = tempRiskRating;
                                        me.filterCurrencyMF = tempCurrency;
                                        
                                        //Reset array
                                        me.arrayFilterFundType = [];
                                        
                                        //Reload mutual fund
                                        me.reloadScreen();
                                        
                                        //Close this window
                                        MFFilterPage.close();
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: languageFormat.getLanguage(33556, 'Recommendation'),
                                    width: 150,
                                    style: 'margin-right: 8px',
                                    cls: 'fix_btn',
                                    handler: function () {
                                        
                                        //Call this function to add filter if got score and return true, else return false
                                        var useRecommend = me.displayRecommend();
                                        //ADD IT INTO ARRAY, THEN IN CONN.JS, PRIORITIZE ARRAY OVER A LONE VAR
                                        //Currently only support 5 option or less
                                        if (useRecommend) {
                                            //Reload mutual fund
                                            me.reloadScreen();

                                            //Close this window
                                            MFFilterPage.close();
                                        } else {
                                            //No score or score out of range
                                            var MFScore = MFClientLogin["RiskScoreVal"];
                                            msgutil.alert(languageFormat.getLanguage(33557, 'Fail to provide recommendation due to client risk profile score is [PARAM0], which is below 32 or higher than 80', MFScore));
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            });
        },
        //Filter Page END
        //Display Recommendation according to score
        //Call this function to add filter if got score and return true, else return false
        //Only use return value if required
        displayRecommend: function () {
            var me = this;

            //RECEIVE SCORE FROM OMS
            var MFScore = MFClientLogin["RiskScoreVal"];

            if (MFScore >= 32 && MFScore <= 80) {

                //Set unrelated filter to default value
                me.filterFundIssuer = N2N_CONFIG.MFFundIssuerDefault;
                me.filterRiskRating = N2N_CONFIG.MFRiskRatingDefault;
                me.filterCurrencyMF = N2N_CONFIG.MFCurrencyDefault;
                
                //Reset array
                me.arrayFilterFundType = [];

                //Get fund type for recommendation
                var arrayFilter = N2N_CONFIG.MFRecommendFundType.split("|");

                if (MFScore >= 32)
                    me.arrayFilterFundType.push(arrayFilter[0]);
                if (MFScore >= 41)
                    me.arrayFilterFundType.push(arrayFilter[1]);
                if (MFScore >= 51)
                    me.arrayFilterFundType.push(arrayFilter[2]);
                if (MFScore >= 61)
                    me.arrayFilterFundType.push(arrayFilter[3]);
                if (MFScore >= 71)
                    me.arrayFilterFundType.push(arrayFilter[4]);

                return true;
            } else {
                return false;
            }
        },
        //Reload page
        reloadScreen: function () {
            var me = this;
            //Reload mutual fund
            //Set back initial value
            me.setPageNo(0);
            me.compRef.searchTf.setValue('');
            me.callSort();
        },
        //Card view support
        getMappedName: function (stkCode) {
            var me = this;

            for (var i = 0; i < me.stkList.length; i++) {
                var stkObj = me.stkList[i];
                if (stkObj.code == stkCode) {
                    return stkObj.name;
                }
            }

            return '';
        }
});

//Card Mutual Fund
Ext.define('TCPlus.view.quote.CardMFund', {
    extend: 'Ext.container.Container',
    alias: 'widget.cardmfund',
    defaultCardWidth: 165,
    cardHeight: 180,
    storeMatrix: null,
    matrixWidth: 800,
    cardCols: 4,
    cardRows: 2,
    itemsMarketDepth: [],
    cols: "01~04~05~06~07",
    settingRowColumn: null,
    slcomp: "cmf",
    type: "cmf",
    feedScreen: true,
    //Size of box
//    boxWidth: 110,
//    boxHeight: 90,
//    widthPadding: 10,
    //Store location of each card
//    storeMatrix
    //Load data
    count: parseInt(10), //Later add a config for this
    initComponent: function() {
        var panel = this;

        panel.maxCol = N2N_CONFIG.features_MutualFund_MaxCol;
        panel.maxRow = N2N_CONFIG.features_MutualFund_MaxRow;
        panel.minCol = N2N_CONFIG.features_MutualFund_MinCol;
        panel.minRow = N2N_CONFIG.features_MutualFund_MinRow;

        var defaultConfig = {
            title: languageFormat.getLanguage(33500, 'Mutual Fund'),
            header: false,
            autoScroll: true,
            border: false,
            layout: 'vbox',
            listeners: {
                afterrender: function(thisComp) {
                    // get panel size
                    var comp = thisComp.up() || thisComp;
                    
                    if (comp) {
                        panel._setMatrixSize(comp);
                        
                        panel._returnNumberMFCard(panel.matrixWidth, panel.matrixHeight);
                        panel.cardTotal = panel.cardCols * panel.cardRows;
                    }
                },
                beforedestroy: function(thisComp) {
                    panel._unscriptAllCard();
                    
                    panel.closeSettingWin();
                }
            }
        };

        Ext.apply(this, defaultConfig);
        this.callParent(arguments);
    },
    //On start tcplus
    start: function() {
        var panel = this;
        if (panel.rendered) {
            panel._started = true;
            panel.suspendLayouts();
            //Where the UI is created
            panel._createMatrixCt();
            panel.resumeLayouts(true);
            panel._refresh();
        } else {
            // wait until UI rendered
            setTimeout(function() {
                panel.start();
            }, 0);
        }
    },
    //Original matrix
    _createMatrixCt: function() {
        var me = this;

        me.removeAll();

        me.itemsCard = [];
        var matrixItems = [];
        var cellIdx = 0;
        
        for (var i = 0; i < me.cardRows; i++) {
            var ctItems = [];
            for (var j = 0; j < me.cardCols; j++) {
                var depthItem = me._createMFCard('MFCard_' + cellIdx);
                
                me.itemsCard.push(depthItem);
                ctItems.push(depthItem);
                cellIdx++;
            }

            // create row ct
            matrixItems.push(Ext.widget('container', {
                layout: 'hbox',
                items: ctItems,
                width: '100%',
                flex: 1
            }));
        }

        me.add(matrixItems);

    },
    _setMatrixSize: function(comp) {
        var panel = this;

        var size = comp.getSize();
        var toolHg = 30; // toolbar height
        // leave some space for scrollbar
        var mxWidthPadding = 22;
        if (isTablet) {
            if (n2nLayoutManager.isWindowLayout()) {
                mxWidthPadding = 13;
            } else {
                mxWidthPadding = 0;
            }
        }
        var ctWidth = size.width;
        var ctHeight = size.height;
        if (ctWidth > mxWidthPadding) {
            ctWidth -= mxWidthPadding;
        }
        if (ctHeight > toolHg) {
            ctHeight -= toolHg;
        }

        panel.matrixWidth = ctWidth;
        panel.matrixHeight = ctHeight;
    },
    switchRefresh: function() {
        var panel = this;
        
        for (var i = 0; i < panel.itemsMarketDepth.length; i++) {
            var md = panel.itemsMarketDepth[i];
            md.switchRefresh();
            Storage.generateUnsubscriptionByExtComp(md);
        }
    },
    //generate new mutual fund card
    _createMFCard: function(title) {
        var panel = this;

        if (panel.storeMatrix == null) {
            panel.storeMatrix = {};
        }
        
        var MFCard = Ext.widget('mfcard', Ext.apply({
            //cls in here determine special style for mutual fund card
            cls: 'mutualfund',
            //Card determine by parent comp height
            height: '100%',
            //let all items to be same length
            flex: 1,
            cardComp: panel,
            itemId: title
        }));
        
        panel.storeMatrix[ title ] = {};
        panel.storeMatrix[ title ].comp = MFCard;

        return MFCard;
    },
    //CREATE UI END
    selectionHandler: function(comp) {
        // remove previous selections
        Ext.select('.mfcard-selected').removeCls('mfcard-selected');
        // add current selection
        comp.addCls('mfcard-selected');

        comp.cardComp._selectedCard = comp;
        
        if (comp.cardComp._grid) {
            n2nLayoutManager.setActiveItem(comp.cardComp._grid.getId());
        }

    },
    selectCard: function(cardIndex) {
        var panel = this;
        var i = 0;

        for (var k in panel.storeMatrix) {
            var md = panel.storeMatrix[k];
            if (cardIndex === i) {
                if (md.comp) {
                    panel.selectionHandler(md.comp);
                } else {
                    return md.comp;
                }
            }

            i++;
        }

        return null;
    },
    getSelectedCard: function() {
        return this._selectedCard || null;
    },
    clearSelection: function() {
        var panel = this;

        // clear selection
        Ext.select('.card-selected').removeCls('card-selected');
        // clear card
        panel._selectedCard = null;

    },
    //Return number of market depth to display
    _returnNumberMFCard: function(mxWidth, mxHeight) {
        var panel = this;

        panel._cardWidth();
         
        var cfgPrefer = panel.getUserPreferenceKey();
        var mxCol = userPreference.get(cfgPrefer.mxCol);
        var mxRow = userPreference.get(cfgPrefer.mxRow);
        
        if (mxCol && mxRow) {
            panel.cardCols = mxCol;
            panel.cardRows = mxRow;
        } else { // calculate according to the current size
            panel.cardCols = Math.floor(mxWidth / panel.cardWidth);
            panel.cardRows = (mxHeight / panel.cardHeight).toFixed();
        }
        
        if (panel.cardCols > panel.maxCol) {
            panel.cardCols = panel.maxCol;
        }
        if (panel.cardRows > panel.maxRow) {
            panel.cardRows = panel.maxRow;
        }

        if (panel.cardCols >= panel.minCol) {
            panel.cardWidth = mxWidth / panel.cardCols;
        } else {
            panel.cardCols = panel.minCol;
        }

        if (panel.cardRows < panel.minRow) {
            panel.cardRows = panel.minRow;
        }

    },
    //Set default card width
    _cardWidth: function() {
        var panel = this;
        
            panel.cardWidth = panel.defaultCardWidth;
    },
    //Refresh/reload all card
    _refresh: function() {
        var panel = this;

        panel._unscriptAllCard();
        
        if (panel.codeList) {
//            recreate UI, sure no way
            panel._refreshCardUI(panel.codeList);
        }

    },
    _getMappedName: function(code) {
        var panel = this;

        if (panel.mappedNames) {
            for (var i in panel.mappedNames) {
                if (panel.mappedNames[i][fieldStkCode] == code) {
                    return panel.mappedNames[i][fieldStkName];
                }
            }

            return '';
        } 
        else if( panel._grid && panel._grid.alias[0] === 'widget.watchlist' ){
            return panel._grid.getMappedName(code);
        } else if (mutualFund) {
            return mutualFund.getMappedName(code);
        }
    },
    _refreshCardUI: function(stockCodeList) {
        var panel = this;

        var i = 0;
        for (var key in panel.storeMatrix) {

            if (panel.storeMatrix.hasOwnProperty(key)) {
                var cardComp = panel.storeMatrix[ key ].comp;

                if (i < stockCodeList.length) {

                    var recordObj = Storage.returnRecord(stockCodeList[ i ]);

                    if (i === panel.cardTotal - 1) { // get the last item to set switch refresh ready
                        cardComp.lastDepth = true;
                        cardComp.dpComp = panel;
                    }
                    
                    var stkName = '';
                    if (!jsutil.isEmpty(recordObj)) {
                        stkName = recordObj[fieldStkName];
                        if(!stkName)
                            stkName = panel._getMappedName(stockCodeList[i]);
                        tLog('create card : cod: ' + recordObj[fieldStkCode] + ' name :' + stkName );
                        cardComp.updateLabel(panel.dataObj[i]);
                    } else {
                        stkName = panel._getMappedName(stockCodeList[i]);
                        tLog('create card 2: cod: ' + stockCodeList[i] + ' name :' +  stkName);
                        if (stkName != '') {
                            cardComp.updateLabel(panel.dataObj[i]);
                        }
                    }
                } else { 
                    // reset other depths
                    cardComp.updateLabel();
                }

                i += 1;
            }

            // panel.firstLoad = false;
        }

    },
    // unscript all card
    _unscriptAllCard: function() {
        var panel = this;

        for (var key in panel.storeMatrix) {

            if (panel.storeMatrix.hasOwnProperty(key)) {
                var cardComp = panel.storeMatrix[ key ].comp;
                Storage.generateUnsubscriptionByExtComp(cardComp);
            }
        }
    },
    //return all card
    returnAllCard: function() {
        var panel = this;
        var cardList = [];

        for (var key in panel.storeMatrix) {

            if (panel.storeMatrix.hasOwnProperty(key)) {
                var cardComp = panel.storeMatrix[ key ].comp;

                cardList.push(cardComp);
            }
        }

        return cardList;
    },
    //return card
    returnMarketDepth: function(stockCode) {
        var panel = this;
        var returnComp = null;

        for (var key in panel.storeMatrix) {

            if (panel.storeMatrix.hasOwnProperty(key)) {
                var marketDepthComp = panel.storeMatrix[ key ].comp;

                if (marketDepthComp.stkcode == stockCode) {
                    returnComp = marketDepthComp;
                    break;
                }
            }
        }

        return returnComp;
    },
    /**
     * Description <br/>
     * 
     * 		 return market depth price list
     * 
     * @param {string} stockCode
     * 
     * @return {object}
     */
    returnBidAskPrice: function(stockCode) {
        var panel = this;

        var compMarketDepth = panel.returnMarketDepth(stockCode);
        if (compMarketDepth) {
        return compMarketDepth.returnBidAskPrice();
        }

        return null;
    },
    //Manually set card row and col
    setting: function() {
        var panel = this;

        var checkValid = function() {
            if (txtCol.isValid() && txtRow.isValid()) {
                var newCol = txtCol.getValue();
                var newRow = txtRow.getValue();
                
                if (panel.cardCols == newCol && panel.cardRows == newRow) {
                    btnSave.disable();
                } else {
                    btnSave.enable();
                }
            } else {
                btnSave.disable();
            }
        };
        
        if (!panel.settingRowColumn) {
            var txtCol = Ext.create('Ext.form.field.Number', {
                xtype: 'numberfield',
                width: 100,
                labelWidth: 50,
                fieldLabel: languageFormat.getLanguage(10510, 'Columns'),
                itemId: 'dm_cols',
                minValue: panel.minCol,
                maxValue: panel.maxCol,
                allowBlank: false,
                allowDecimals: false,
                value: panel.cardCols,
                listeners: {
                    change: function() {
                        checkValid();
                    }
                }
            });
            var txtRow = Ext.create('Ext.form.field.Number', {
                xtype: 'numberfield',
                width: 100,
                labelWidth: 50,
                fieldLabel: languageFormat.getLanguage(10511, 'Rows'),
                itemId: 'dm_rows',
                allowBlank: false,
                minValue: panel.minRow,
                maxValue: panel.maxRow,
                allowDecimals: false,
                value: panel.cardRows,
                listeners: {
                    change: function() {
                        checkValid();
                    }
                }
            });
            var btnSave = Ext.create('Ext.button.Button', {
                text: languageFormat.getLanguage(20092, 'Load'),
                iconCls: 'icon-save',
                disabled: true,
                handler: function() {
                    panel.cardCols = txtCol.getValue();
                    panel.cardRows = txtRow.getValue();
                    
                    var cfgPrefer = panel.getUserPreferenceKey();
                    userPreference.set(cfgPrefer.mxCol, panel.cardCols);
                    userPreference.set(cfgPrefer.mxRow, panel.cardRows);
                    
                    userPreference.save();

                    panel.suspendLayouts();
                    // recalculate width for tab layout to fit width
                    if (n2nLayoutManager.isMt(panel.mt)) {
                        panel.cardWidth = (panel.matrixWidth / panel.cardCols);
                    }else{
                        panel._cardWidth();
                    }

                    panel.itemsMarketDepth = [];
                    panel.cardTotal = panel.cardCols * panel.cardRows;
                    panel._unscriptAllCard();
                    panel.storeMatrix = {};
                    panel._createMatrixCt();

                    panel.resumeLayouts(true);
                    
                    if (panel._grid) {
                        panel._grid.resetLoad();
                    } else {
                        panel._refresh();
                    }
                    
                    panel.settingRowColumn.close();

                    // resizes window size
                    if (n2nLayoutManager.isP(panel.mt)) {
                        panel._updateWinSize();
                    }
                }
            });
            var headerBtn = [];
            var bbarBtn = [
                '->',
                btnSave,
                '-',
                {
                    xtype: 'button',
                    cls: 'fix_btn',
                    text: 'Cancel',
                    handler: function() {
                        panel.settingRowColumn.close();
                    }
                }
            ];
            headerBtn = [btnSave];
            bbarBtn = [];
            panel.settingRowColumn = msgutil.popup({
                title: languageFormat.getLanguage(20678, 'Card settings'),
                width: 140,
                height: 130,
                autoShow: true,
                resizable: false,
                bodyStyle: 'padding:10px',
                modal: false,
                items: {
                    xtype: 'container',
                    items: [
                        txtCol,
                        txtRow
                    ]
                },
                constrainTo: panel.getEl(),
                constrain: true,
                header: {
                    items: headerBtn
                },
                bbar: {
                    items: bbarBtn
                },
                cls: 'cap-title',
                listeners: {
                    destroy: function() {
                        panel.settingRowColumn = null;
                    }}
            });
        } else {
            panel.settingRowColumn.toFront();
            panel.settingRowColumn.body.highlight();
        }
    },
    getUserPreferenceKey : function() {
        var mxcol = 'mfc_mxcol', msrow = 'mfc_mxrow';
        
        return {
            mxCol : mxcol,
            mxRow : msrow
        };
    },
    closeSettingWin: function() {
        var panel = this;
        
        if (panel.settingRowColumn) {
            panel.settingRowColumn.close();
        }
    },
    _updateWinSize: function() {
        var panel = this;

        var winWd = panel.cardWidth * panel.cardCols + 16;
        var winHt = panel.cardHeight * panel.cardRows + 65;
        var pwin = panel.up();
        if (pwin && pwin.isXType('window')) {
            pwin.setSize(winWd, winHt);
        }
    },
    refresh: function() {
        var panel = this;
        for (var i = 0; i < panel.itemsMarketDepth.length; i++) {
            var md = panel.itemsMarketDepth[i];
            md.isGradient = marketDepthGradient;
            md.showHideInfobar = panel.mkDeptShowHideInfobar;
            md.refresh();
        }
    },
    setList: function(codeList, dataObj) {
        var panel = this;

        panel.codeList = codeList;
        panel.dataObj = dataObj;
        if (!panel._started) {
            panel.start();
        } else {
            panel._refresh();
        }
    },
    updateGradientStatus: function(isGradient) {
        var panel = this;

        for (var i = 0; i < panel.itemsMarketDepth.length; i++) {
            panel.itemsMarketDepth[i].isGradient = isGradient;
        }
    },
    getFieldList: function() {
        var me = this;
        var fieldList = [];

        // first depth is enough
        if (me.itemsMarketDepth.length > 0) {
            fieldList = me.itemsMarketDepth[0].getFieldList();
        }

        return fieldList;
    },
    getCard: function (stkCode) {
        var me = this;

        for (var i = 0; i < me.itemsCard.length > 0; i++) {
            var card = me.itemsCard[i];
            if (card && card.data && card.data[fieldStkCode] === stkCode) {
                return card;
            }
        }

        return null;

    }
});

Ext.define('TCPlus.view.MFCard', {
    extend: 'Ext.container.Container',
    alias: 'widget.mfcard',
    showTitle: false,
    itemId: null,
    //Store stkcode
    type: 'mf',
    data: null,
    //For context menu
    stkcode: null,
    stkname: null,
    initComponent: function () {
        var panel = this;

        panel.tValue_FullName = Ext.create('widget.box', {
            flex: 1,
            width: '100%',
            autoEl: {
                tag: 'div',
                cls: 'fullname'
            }
        });
                
        panel.tValue_change = Ext.create('widget.box', {
            flex: 1,
            width: '100%',
            autoEl: {
                tag: 'div',
                cls: 'change'
            }
        });
        
        panel.tValue_Performance = Ext.create('widget.box', {
            flex: 1,
            width: '100%',
            autoEl: {
                tag: 'div',
                cls: 'performance'
            }
        });
                   
        var defaultConfig = {
            selectionHandler: panel.selectionHandler,
            items : [panel.tValue_FullName, panel.tValue_change, panel.tValue_Performance],
            listeners: {
                afterRender: function (thisComp) {
                    //Allow selection
                    thisComp.el.on('click', function () {
                        var data = thisComp.data;
                        
                        thisComp.selectionHandler(thisComp);
                        
                        // sync group
                        //Code kept in case complaint want to click to sync orderpad
//                        updateActivePanel(thisComp, thisComp.data);
                        if (data && data[fieldStkCode] && data[fieldStkName]) {
//                            activateBuySellMenu(modeOrdBuy, data);
                            syncGroupManager.syncMutualFundComps(thisComp, data[fieldStkCode], data[fieldStkName]);
                        }
                    });
                    
                    //Allow selection
                    thisComp.el.on('dblclick', function () {
                        var data = thisComp.data;
                        
                        thisComp.selectionHandler(thisComp);
                        
                        // reset closing status
//                        closedOrderPad = false;
                        //Code kept in case complaint want to click to sync orderpad
//                        updateActivePanel(thisComp, thisComp.data, null, true);
                        //
                        if (data && data[fieldStkCode] && data[fieldStkName]) {
//                            activateBuySellMenu(modeOrdBuy, data);
                            syncGroupManager.syncMutualFundComps(thisComp, data[fieldStkCode], data[fieldStkName]);
                        }
                    });
                    
                    //Allow selection
                    thisComp.el.on('contextmenu', function (e) {
                        var data = thisComp.data;
                        
                        thisComp.selectionHandler(thisComp);
                        
                        thisComp.stkcode = data[fieldStkCode];
                        thisComp.stkname = data[fieldStkName];
                        mutualFund.cMenuStkCode = thisComp.stkcode;
                        mutualFund.cMenuStkName = thisComp.stkname;
            
                        //Hide first due to not supported
                        //Follow the mutual fund config so just directly use the menu
//                        mutualFund.contextMenu.showAt(e.getXY());
                        mutualFundMenu.showAt(thisComp.stkcode, thisComp.stkname, e);
                    });
                }
            }
        }
        
        Ext.apply(this, defaultConfig);
        this.callParent(arguments);
    },
    //Add different border to the selected
    selectionHandler: function (comp) {
        // remove previous selections
        Ext.select('.mfcard-selected').removeCls('mfcard-selected');
        // add current selection
        comp.addCls('mfcard-selected');

        mutualFund.cardComp._selectedCard = comp;

        if (comp.cardComp._grid) {
            n2nLayoutManager.setActiveItem(comp.cardComp._grid.getId());
        }

    },
    updateLabel: function (dataObj) {
        var panel = this;
        
        if (dataObj) {
            panel.data = dataObj.data;

            helper.setHtml(panel.tValue_FullName, panel.data[fieldStkFName]);
            
            /*
            if (panel.data[fieldChange] != null) {
                var cssClass = N2NCSS.FontUnChange;

                if (parseFloat(panel.data[fieldChange]) > 0) {
                    cssClass = N2NCSS.FontUp;

                } else if (parseFloat(panel.data[fieldChange]) < 0) {
                    cssClass = N2NCSS.FontDown;
                }
               
                helper.setHtml(panel.tValue_change, "<label class='" + cssClass + "'> " + panel.data[fieldChange] + "%  </label>");
            }
            */
            
            helper.setHtml(panel.tValue_Performance, "1 year performance");
            
        }
    },
    updateYTD1: function(dataObj){
    	var panel = this;
    	
    	if(dataObj && dataObj[fieldYTD1ChgPer]){
    		// update YTD to cache
    		panel.data[fieldYTD1ChgPer] = dataObj[fieldYTD1ChgPer];
    		helper.setHtml(panel.tValue_change, "<label>" + panel.data[fieldYTD1ChgPer] + "%  </label>");
    	}
    	
    }
});

Ext.define('TCPlus.view.MFInfo', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.mfinfo',
    header: false,
    height: 119,
    type: "mfinfoorderpad",
    stkcode: null,
    stkname: null,
    excode: null,
    //dolayout on first load
    hasRunDoLayout: false,
    initComponent: function () {
        var panel = this;

        var configItems = panel.getLabels();
        var defaultConfig = {
            autoScroll: true,
//            layout:'vbox',
            style: 'padding: 5px',
            items: [{
                    xtype: 'container',
                    layout: {
                        type: 'column',
                        columnWidth: '100%',
                        columns: 2
                    },
                    cls: 'font-style-applied font-size-max-applied',
                    items: [
                        panel._getColumnCt(configItems.stkInfoLeft),
                        panel._getColumnCt(configItems.stkInfoRight)
                    ]
                }]
        };

        Ext.apply(this, defaultConfig);
        this.callParent(arguments);
    },
    _getColumnCt: function (items) {
        return {
            xtype: 'container',
            minWidth: 180,
            columnWidth: 0.5,
            cls: 'mf_info_ct',
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
                resize: function (thisCt) {
                    if (thisCt.getWidth() === thisCt.minWidth) { // expand container width to 100% if displayed as one column
                        thisCt.addCls('fulltable');
                    } else {
                        thisCt.removeCls('fulltable');
                    }
                }
            }
        };
    },
    getLabels: function (fid) {
        var panel = this;
        var stkInfoLeft = [];
        var stkInfoRight = [];

        //Create field
        panel.createLabels();
        //Left side of the field
        stkInfoLeft.push(panel.tLabel_IncepDate, panel.tValue_IncepDate);
        stkInfoLeft.push(panel.tLabel_Currency, panel.tValue_Currency);
        stkInfoLeft.push(panel.tLabel_RiskClass, panel.tValue_RiskClass);
        stkInfoLeft.push(panel.tLabel_MinInitPart, panel.tValue_MinInitPart);
        stkInfoLeft.push(panel.tLabel_MinAddPart, panel.tValue_MinAddPart);

        //Right side of the field
        stkInfoRight.push(panel.tLabel_MinHoldPart, panel.tValue_MinHoldPart);
        stkInfoRight.push(panel.tLabel_CutTimePart, panel.tValue_CutTimePart);
        stkInfoRight.push(panel.tLabel_SetDate, panel.tValue_SetDate);
        stkInfoRight.push(panel.tLabel_TrustFee, panel.tValue_TrustFee);
        stkInfoRight.push(panel.tLabel_EarlyRedFee, panel.tValue_EarlyRedFee);

        return {
            stkInfoLeft: stkInfoLeft,
            stkInfoRight: stkInfoRight
        };
    },
    createLabels: function () {
        var panel = this;

        //CSS for label
        var createNewLabel = function (name, isLabel) {
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

        // Inception Date
        panel.tLabel_IncepDate = createNewLabel(languageFormat.getLanguage(33611, "Inception Date"), true);
        panel.tValue_IncepDate = createNewLabel("-");

        // Currency
        panel.tLabel_Currency = createNewLabel(languageFormat.getLanguage(10132, "Currency"), true);
        panel.tValue_Currency = createNewLabel("-");

        // Risk Classification
        panel.tLabel_RiskClass = createNewLabel(languageFormat.getLanguage(33653, "Risk Classification"), true);
        panel.tValue_RiskClass = createNewLabel("-");

        // Min. Initial Participation
        panel.tLabel_MinInitPart = createNewLabel(languageFormat.getLanguage(33654, "Min. Initial Participation"), true);
        panel.tValue_MinInitPart = createNewLabel("-");

        // Min. Additional Participation
        panel.tLabel_MinAddPart = createNewLabel(languageFormat.getLanguage(33655, "Min. Additional Participation"), true);
        panel.tValue_MinAddPart = createNewLabel("-");

        // Min. Holding Period
        panel.tLabel_MinHoldPart = createNewLabel(languageFormat.getLanguage(33657, "Min. Holding Period"), true);
        panel.tValue_MinHoldPart = createNewLabel("-");

        // Cut-Off Time for Participation
        panel.tLabel_CutTimePart = createNewLabel(languageFormat.getLanguage(33658, "Cut-Off Time for Participation"), true);
//        panel.tValue_CutTimePart = createNewLabel("-");
        //Hardcode
        panel.tValue_CutTimePart = createNewLabel("11am");

        // Settlement Date (T + # of Days)
        panel.tLabel_SetDate = createNewLabel(languageFormat.getLanguage(33659, "Settlement Date (T + # of Days)"), true);
//        panel.tValue_SetDate = createNewLabel("-");
        //Hardcode
        panel.tValue_SetDate = createNewLabel("10 days");

        // Trust Fee Stucture
        panel.tLabel_TrustFee = createNewLabel(languageFormat.getLanguage(33660, "Trust Fee Stucture"), true);
        panel.tValue_TrustFee = createNewLabel("-");

        // Early Redemption Fee
        panel.tLabel_EarlyRedFee = createNewLabel(languageFormat.getLanguage(33661, "Early Redemption Fee"), true);
        panel.tValue_EarlyRedFee = createNewLabel("-");
    },
    getFieldList: function (type) {
        var panel = this;

        var returnArray = new Array();

        returnArray.push(fieldStkCode);		// stock code	
        returnArray.push(fieldStkName);		// stock name
        returnArray.push(fieldStkFName);		// stock name
        returnArray.push(fieldFundType);  // sector code 1.3.29.19

        returnArray.push(fieldCurrency);		// last, change, change %		
        returnArray.push(fieldRiskRate);		// last, change, change %		
        returnArray.push(fieldIndexGrp_06);		// Benchmark
        returnArray.push(fieldStartDate_06);	// Start Date
        returnArray.push(fieldExpiryDate);		// news, status
        returnArray.push(fieldMinInvestment);		// news, status
        returnArray.push(fieldMinAdditionalSub);
        returnArray.push(fieldMinRedemptionQty);
        returnArray.push(fieldMinHoldingDays);
        returnArray.push(fieldEarlyRedemptionFee);
        returnArray.push(fieldManagementFee);
        returnArray.push(fieldAssetClass);
        returnArray.push(fieldInvestmentAllocations);
        returnArray.push(fieldSettleMentDateRedemption);
        returnArray.push(fieldFundIssuerName);
        returnArray.push(fieldLacp);
        returnArray.push(fieldTransDate);
        returnArray.push(fieldFundSize);

        returnArray.push(fieldLast);
        returnArray.push(fieldFundIssuerName);

        if (type == "param") {
            return returnArray.join("~");
        } else {
            return returnArray;
        }
    },
    resetLabel: function () {
        var panel = this;
        
        resetFieldValues([
            panel.tValue_IncepDate,
            panel.tValue_Currency,
            panel.tValue_RiskClass,
            panel.tValue_MinInitPart,
            panel.tValue_MinAddPart,
            panel.tValue_MinHoldPart,
            //Currently hardcoded
//            panel.tValue_CutTimePart,
//            panel.tValue_SetDate,
            panel.tValue_TrustFee,
            panel.tValue_EarlyRedFee
        ]);
        
    },
    // update field
    searchMutualFundInfo: function (stkcode, stkname) {
        var panel = this;

        //Clear all field first
        panel.resetLabel();

        var stkPart = stockutil.getStockPart(stkname);
        var exCode = getStkExCode(stkname);
        var stockCodeList = [stkcode];

        //save received data
        panel.stkcode = stkcode;
        panel.stkname = stkname;
        panel.excode = exCode;

//        if (me.stkcode != stkcode) {
//            this.setStkCode(stkcode);
//            this.setStkName(stkname);
//            this.tField_Search.setValue(stkname);
//            n2nLayoutManager.updateKey(this);
//            refreshMD = true;
//        }
//
//        if (refreshMD) {
//            this.refresh();
//        }
        
        conn.getStockList({
            rType: 'mf_list',
            list: stockCodeList,
            //Use it's own getfield, but copy from mutual fund
            //Avoid exception when mutual fund not open on first load
            f: panel.getFieldList("all"),
            p: 0,
            c: stockCodeList.length,
            skipMDColCheck: true,
            success: function (obj) {
                //If got data
                if (obj && obj.d.length != 0) {
                    panel.loadMutualFundInfo(obj);
                    //Subscription just for get the msg 06 and 17, why???
                    Storage.generateUnsubscriptionByExtComp(panel, true);
                    Storage.generateSubscriptionByList(stockCodeList, panel);
                }
            }
        });
    },
    //load field
    loadMutualFundInfo: function (obj) {
        var panel = this;
        var dataObj = obj.d[0];
        
        if (dataObj[fieldCurrency] != null) {
            updateFieldValue(panel.tValue_Currency, dataObj[fieldCurrency]);
        }
    },
    /* One small rant here. Why after get msg05 data, then inside the conn there
     * queryFeed06 and 17 go to storage, then after msg 06 and 17 load into storage hashtable
     * then it call updatefeedrecord to pass in msg 06 and 17
     * the flaws is that it first load msg 05, then after that, it load msg 06 and 17 by updatefeedrecord
     * why cant it hold all data first before it load everything into a component
     */
    updateFeedRecord: function (dataObj) {
        var panel = this;
        if (dataObj == null || panel.stkcode != dataObj[fieldStkCode]) {
            return;
        }

        //Msg 06
        var incepDate = jsutil.formatDate(dataObj[fieldStartDate_06]);
        if (incepDate) {
            updateFieldValue(panel.tValue_IncepDate, incepDate, '-');
        }
        //Msg 17
        updateFieldValue(panel.tValue_RiskClass, dataObj[fieldRiskRate], '-');
        updateFieldValue(panel.tValue_MinInitPart, dataObj[fieldMinInvestment], '-');
        updateFieldValue(panel.tValue_MinAddPart, dataObj[fieldMinAdditionalSub], '-');
        updateFieldValue(panel.tValue_MinHoldPart, dataObj[fieldMinHoldingDays], '-');
        updateFieldValue(panel.tValue_SetDate, dataObj[fieldSettleMentDateRedemption], '-');
        updateFieldValue(panel.tValue_EarlyRedFee, dataObj[fieldEarlyRedemptionFee], '-');
        updateFieldValue(panel.tValue_TrustFee, dataObj[fieldInvestmentAllocations], '-');
        //Msg 17
        if (!panel.hasRunDoLayout) {
            panel.doLayout();
            panel.hasRunDoLayout = true;
        }
    }
    });
    
Ext.define('TCPlus.view.RiskRateBar', {
    extend: 'Ext.Component',
    alias: 'widget.riskratebar',
    minRate: 1,
    maxRate: 5,
    initComponent: function() {
        var me = this;

        Ext.apply(me, {
            autoEl: {
                tag: 'div',
                cls: ''
            }
        });
        me.callParent(arguments);
    },
    setRate: function(rate) {
        var me = this;
        
        if (rate == null) {
            me.setHtml('');
            return;
        }
        
        var htmls = [
            '<section class="section section-score">',
            '<div class="br-wrapper br-theme-bars-pill">',
            '<div class="br-widget br-readonly">'
        ];

        tLog('setRate', rate);

        for (var i = me.minRate; i <= me.maxRate; i++) {
            if (rate == i) {
                htmls.push('<a href="#" data-rating-value="' + i + '" data-rating-text="' + i + '" class="br-selected"><div class="br-' + i + '">' + i + '<span class="arrow-up"></span></div></a>');
            } else {
                htmls.push('<a href="#" data-rating-value="' + i + '" data-rating-text="' + i + '" class="br-selected"><div class="br-' + i + '">' + i + '</div></a>');
            }
        }

        htmls.push('</div>', '</div>', '</section>');
        
        me.setHtml(htmls.join("\n"));

    }
});
