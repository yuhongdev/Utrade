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
        resizable: true,
        width: 650,
        height: 400
    },
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
            icon: icoBtnReset,
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
            qtyText: 'Please enter a valid quantity',
            qtyMask: /[0-9\b]/i,
            buyPrc: function(val, field) {
                return panel.buyPrcTest.test(val);
            },
            buyPrcText: 'Please enter a valid buy price',
            buyPrcMask: /-?[0-9.\b]/i,
            brkrgRate: function(val, field) {
                return panel.brkrgRateTest.test(val);
            },
            brkrgRateText: 'Please enter a valid brokerage rate',
            brkrgRateMask: /-?[0-9.\b]/i,
            sellPrc: function(val, field) {
                return panel.sellPrcTest.test(val);
            },
            sellPrcText: 'Please enter a valid sell price',
            sellPrcMask: /-?[0-9.\b]/i,
            trgtpl: function(val, field) {
                return panel.trgtP_LTest.test(val);
            },
            trgtP_LText: 'Please enter a valid targeted profit/loss',
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
                        text: 'Compute',
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
                fieldLabel: languageFormat.getLanguage(2101, 'Profit/Loss'),
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
            title: languageFormat.getLanguage(2101, 'Profit/Loss'),
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
                fieldLabel: languageFormat.getLanguage(2102, 'Targeted Profit/Loss'),
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
    tLabal_Exchangelabel: null,
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

        panel.tLabal_Exchangelabel = Ext.create('Ext.form.Label', {
            text: '-',
            style: 'padding-left: 20px;',
            hidden: true
        });

        var defaultConfig = {
            title: languageFormat.getLanguage(20023, 'Depth Matrix'),
            header: false,
            autoScroll: true,
            border: false,
            tbar: {
                xtype: 'toolbar',
                hidden: false,
                items: [
                    panel.tLabal_Exchangelabel,
                    '->',
                    new Ext.Button({
                        text: languageFormat.getLanguage(20601, 'Settings'),
                        tooltip: languageFormat.getLanguage(20601, 'Settings'),
                        icon: icoBtnColumn,
                        handler: function() {
                            panel.setting();
                        }
                    }),
                    new Ext.Button({
                        text: languageFormat.getLanguage(10008, 'Refresh'),
                        tooltip: languageFormat.getLanguage(10008, 'Refresh'),
                        icon: icoBtnReset,
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
                        panel.itemsMarketDepth = [];
                        panel.marketDepthTotal = panel.marketDepthCols * panel.marketDepthRows;
                        for (var i = 0; i < panel.marketDepthTotal; i++) {
                            panel.itemsMarketDepth.push(panel._createMarketDepth('marketDepth_' + i));
                        }


                        panel.dpCt = thisComp.add({
                            xtype: "container",
                            id: "ct_depthmatrix",
                            layout: {
                                type: 'table',
                                columns: panel.marketDepthCols
                            }
                        });

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
            panel.dpCt.add(panel.itemsMarketDepth);
            panel.resumeLayouts(true);
            panel._refresh();
        } else {
            // wait until UI rendered
            setTimeout(function() {
                panel.start();
            }, 0);
        }
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
            height: panel.marketDepthHeight,
            width: panel.marketDepthWidth,
            isMatrix: true,
            showTitle: false,
            showSearch: true,
            showTotalBidAsk: false,
            border: true,
            type: "depthmatrix",
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

        panel.marketDepthCols = Math.floor(mxWidth / panel.marketDepthWidth);
        panel.marketDepthRows = (mxHeight / panel.marketDepthHeight).toFixed();

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
            panel._marketDepthWidth();
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
                btnSave.enable();
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
                    validitychange: function() {
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
                    validitychange: function() {
                        checkValid();
                    }
                }
            });
            var btnSave = Ext.create('Ext.button.Button', {
                text: global_personalizationTheme.indexOf("wh") != -1 ? '' : languageFormat.getLanguage(20092, 'Load'),
                tooltip: global_personalizationTheme.indexOf("wh") == -1 ? '' : languageFormat.getLanguage(20092, 'Load'),
                icon: global_personalizationTheme.indexOf("wh") != -1 ? iconBtnSave : "",
                handler: function() {
                    panel.marketDepthCols = txtCol.getValue();
                    panel.marketDepthRows = txtRow.getValue();

                    panel.suspendLayouts();
                    var matrixCt = panel.down("#ct_depthmatrix");
                    matrixCt.removeAll();
                    matrixCt.layout.columns = panel.marketDepthCols;
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
                    for (var i = 0; i < panel.marketDepthTotal; i++) {
                        panel.itemsMarketDepth.push(panel._createMarketDepth('marketDepth_' + i));
                    }
                    matrixCt.add(panel.itemsMarketDepth);

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
            if (global_personalizationTheme.indexOf("wh") != -1) {
                headerBtn = [btnSave];
                bbarBtn = [];
            }
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
    winConfig: {
        width: 1020,
        height: 273,
        resizable: true
    },
    debug: false,
    slcomp: "ms",
    type: 'ms',
    savingComp: true,
    notMainSubscription: true,
    _gridWidth: 500,
    _recordHeight: 19,
    _maxRecord: 0,
    initComponent: function() {
        var me = this;
        
        me._createUIItems();
        
        Ext.apply(me, {
            title: languageFormat.getLanguage(20157, 'Streamer'),
            header: false,
            scroll: false,
            border: false,
            tbar: me.compRef.topCt,
            layout: 'hbox',
            listeners: {
                resize: function(thisGrid, newWidth, newHeight, oldWidth, oldHeight) {
                    me._adjusting = true;
                    me._createSplitGrids(newWidth, newHeight, oldWidth);
                    me._adjusting = false;
                    
                    if (!oldWidth) {
                        me.subscribe();
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

        me._moveRecordCursor();
        var cursor = me.recordCursor;
        me._cursorCells = new Array();

        // stock code
        var cell = me._getCell(cursor, fieldStkCode);

        var stkName = stockutil.getStockNameFromList(feedObj[fieldStkCode], exch);
        var fd = '';
        if (N2N_CONFIG.streamerDisplayCode) {
            fd = stockutil.getStockPart(feedObj[fieldStkCode]);
        } else {
            fd = stockutil.getStockPart(stkName);
        }
        me._cursorCells.push({
            el: cell,
            cls: ''
        });

        me._updateCell(cell, fd);

        feedObj[fieldStkName] = stkName;

        // change
        var piCls = '';
        var chg = formatutils.procChangeValue(feedObj);
        feedObj[fieldChange] = chg;
        var chgPer = formatutils.procChangePercValue(feedObj);
        feedObj[fieldChangePer] = chgPer;

        var chgCls = N2NCSS.BackUnChange;
        if (chg > 0) {
            chgCls = N2NCSS.BackUp;
        } else if (chg < 0) {
            chgCls = N2NCSS.BackDown;
        }

        // tranaction, PI
        if (feedObj[fieldTransAction] != null) {
            var cell = me._getCell(cursor, fieldTransAction);
            var fd = feedObj[fieldTransAction];

            if (fd == 'b') {
                if (exch == 'PH') {
                    piCls = N2NCSS.BackUp;
                } else {
                    piCls = N2NCSS.BackDown;
                }
            }
            else if (fd == 's') {
                if (exch == 'PH') {
                    piCls = N2NCSS.BackDown;
                } else {
                    piCls = N2NCSS.BackUp;
                }
            } else {
                piCls = N2NCSS.BackUnChange;
            }

            me._cursorCells.push({
                el: cell,
                cls: piCls
            });

            me._updateCell(cell, fd);
        }

        // last done price
        if (feedObj[fieldLast] != null) {
            var cell = me._getCell(cursor, fieldLast);

            me._cursorCells.push({
                el: cell,
                cls: chgCls
            });

            me._updateCell(cell, me._formatNumber(feedObj[fieldLast]));
        }

        // LQtyU
        if (feedObj[fieldUnit] != null) {
            var cell = me._getCell(cursor, fieldUnit);

            me._cursorCells.push({
                el: cell,
                cls: piCls
            });

            me._updateCell(cell, me._formatNumber(feedObj[fieldUnit]));
        }

        // Time
        if (feedObj[fieldTime] != null) {
            var cell = me._getCell(cursor, fieldTime);
            var fd = formatutils.procDateValue(feedObj[fieldTime]);
            me._cursorCells.push({
                el: cell,
                cls: ''
            });

            me._updateCell(cell, fd);
        }

        // Change
        if (chg != null) {
            var cell = me._getCell(cursor, fieldChange);
            me._cursorCells.push({
                el: cell,
                cls: chgCls
            });

            me._updateCell(cell, me._formatNumber(chg));
        }

        // Change Percent
        if (chgPer != null) {
            if (chgPer != '-') {
                chgPer = me._formatNumber(chgPer) + '%';
            }
            var cell = me._getCell(cursor, fieldChangePer);
            me._cursorCells.push({
                el: cell,
                cls: chgCls
            });

            me._updateCell(cell, chgPer);
        }

        me._updateStore(cursor, feedObj);
        me._highlightCursor();
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
        me._createContextMenu();
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
                            fieldTransAction, fieldLast, fieldUnit
                        ]
                    },
                    columns: me._createGridColumns(),
                    flex: 1,
                    height: '100%',
                    scroll: false,
                    forceFit: true,
                    style: 'border-left-width: 1px;border-left-style: solid;',
                    listeners: {
                        itemcontextmenu: function(thisComp, record, item, idx, e) {
                            e.stopEvent();
                            me._ctMenu.showAt(e.getXY());
                        },
                        itemclick: function(gridView, record) {
                            var stkCode = record.get(fieldStkCode);
                            var stkName = record.get(fieldStkName);

                            syncAllComps(me, stkCode, stkName);
                        },
                        resize: function(thisGrid, _newWidth, _newHeight, _oldWidth, _oldHeight) {
                            if (!_oldWidth) {
                                // determine number of records
                                var recNum = Math.floor(thisGrid.body.getHeight() / me._recordHeight);
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
                var recNum = Math.floor(grid.body.getHeight() / me._recordHeight);
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
    _createTopbar: function() {
        var me = this;

        var exList = [
            ['', languageFormat.getLanguage(20342, 'Select Exchange')]
        ];
        for (var i = 0; i < global_ExchangeList.length; i++) {
            exList.push([global_ExchangeList[i].exchange, global_ExchangeList[i].exchangeName]);
        }

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
            value: exchangecode,
            editable: false,
            queryMode: 'local',
            matchFieldWidth: false,
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
            style: 'margin-left: 5px',
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

        me.compRef.valueLb = Ext.widget('label', {
            text: languageFormat.getLanguage(10736, 'Trade value'),
            style: 'margin-left: 5px'
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
            style: 'margin-left: 5px'
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
        me.compRef.applyBt = Ext.widget('button', {
            text: languageFormat.getLanguage(20618, 'Apply'),
            tooltip: languageFormat.getLanguage(11087, 'Apply filter'),
            iconCls: '',
            cls: 'flatbtn',
            handler: function() {
                me.clearAll();
                me.subscribe();
            }
        });

        me.compRef.topCt = Ext.create('Ext.toolbar.Toolbar', {
            items: [me.compRef.exCb, me.compRef.wlCb, me.compRef.valueLb, me.compRef.valueSignCb, me.compRef.valueTf,
                me.compRef.volLb, me.compRef.volSignCb, me.compRef.volTf, me.compRef.applyBt, '->'],
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll
        });
    },
    _createGridColumns: function() {
        var me = this;
        var baseCss = N2NCSS.CellDefault + " " + N2NCSS.FontString;

        return {
            defaults: {
                sortable: false,
                menuDisabled: true
            },
            items: [
                {
                    width: 100,
                    text: languageFormat.getLanguage(10102, 'Symbol'),
                    dataIndex: fieldStkCode,
                    renderer: function(value, meta) {
                        meta.css = baseCss + " " + N2NCSS.FontUnChange;
                        var valueText = '';
                        if (value) {
                            valueText = stockutil.getStockPart(value);
                        }

                        return valueText;
                    }
                },
                {
                    text: languageFormat.getLanguage(11081, 'PI'),
                    dataIndex: fieldTransAction,
                    align: 'center',
                    width: 35,
                    renderer: function(value, meta, record) {
                        var exch = stockutil.getExchange(record.get(fieldStkCode));
                        var piCls = '';

                        if (value == 'b') {
                            if (exch == 'PH') {
                                piCls = N2NCSS.FontUp;
                            } else {
                                piCls = N2NCSS.FontDown;
                            }
                        }
                        else if (value == 's') {
                            if (exch == 'PH') {
                                piCls = N2NCSS.FontDown;
                            } else {
                                piCls = N2NCSS.FontUp;
                            }
                        } else {
                            piCls = N2NCSS.FontUnChange;
                        }

                        meta.css = baseCss + ' ' + piCls;

                        return value || '';
                    }
                },
                {
                    text: languageFormat.getLanguage(11082, 'LPrice'),
                    dataIndex: fieldLast,
                    align: 'right',
                    width: 80,
                    renderer: me._getChangeRenderer()
                },
                {
                    text: languageFormat.getLanguage(11083, 'LQtyU'),
                    dataIndex: fieldUnit,
                    align: 'right',
                    width: 85,
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
                            valueText = me._formatNumber(value);
                        }

                        return valueText;
                    }
                },
                {
                    text: languageFormat.getLanguage(10123, 'Time'),
                    dataIndex: fieldTime,
                    align: 'center',
                    width: 75,
                    renderer: function(value, meta) {
                        meta.css = baseCss;
                        var valueText = '';
                        if (value) {
                            valueText = formatutils.procDateValue(value);
                        }

                        return valueText;
                    }
                },
                {
                    text: languageFormat.getLanguage(10115, 'Chg'),
                    dataIndex: fieldChange,
                    align: 'right',
                    width: 70,
                    renderer: me._getChangeRenderer()
                },
                {
                    text: languageFormat.getLanguage(10116, 'Chg%'),
                    dataIndex: fieldChangePer,
                    align: 'right',
                    width: 70,
                    renderer: function(value, meta, record) {
                        var chgCls = N2NCSS.FontUnChange;
                        var chg = record.get(fieldChange);

                        if (chg > 0) {
                            chgCls = N2NCSS.FontUp;
                        } else if (chg < 0) {
                            chgCls = N2NCSS.fontDown;
                        }
                        meta.css = N2NCSS.CellDefault + ' ' + N2NCSS.FontString + ' ' + chgCls;
                        var valueText = '';
                        if (value != null) {
                            valueText = me._formatNumber(value) + '%';
                        }

                        return valueText;
                    }
                }
            ]
        };
    },
    _getChangeRenderer: function() {
        var me = this;

        return function(value, meta, record) {
            var chgCls = N2NCSS.FontUnChange;
            var chg = record.get(fieldChange);

            if (chg > 0) {
                chgCls = N2NCSS.FontUp;
            } else if (chg < 0) {
                chgCls = N2NCSS.fontDown;
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
            var colIndex = helper.getColumnIndex(grid.columns, 'dataIndex', dataIndex);
            var cell = grid.view.getCellByPosition({row: rowIndex, column: colIndex});

            return cell;
        }

        return null;
    },
    _updateCell: function(cell, feedData) {
        if (cell) {
            var cellEl = cell.first(); // get first element of cell
            cellEl.setHtml(feedData);
        }
    },
    subscribe: function() {
        var me = this;

        if (me.paused) {
            return;
        }

        me._adjusting = true;

        var exch = me.compRef.exCb.getValue();
        var wl = me.compRef.wlCb.getValue();

        var reqObj = {
            listenId: 'listenStreamer',
            valueSign: me.compRef.valueSignCb.getValue(),
            value: me.compRef.valueTf.getValue(),
            volSign: me.compRef.volSignCb.getValue(),
            vol: me.compRef.volTf.getValue()
        };

        if (exch) { // filter by exchange
            reqObj.exch = exch;

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
    _cacheRequest: function(reqObj){
        var me = this;
        
        me._reqObj = reqObj;
        me._adjusting = false;
    },
    unsubscribe: function() {
        conn.unsubscribeTransaction('listenStreamer');
    },
    _highlightCursor: function() {
        var me = this;

        for (var i = 0; i < me._cursorCells.length; i++) {
            var cell = me._cursorCells[i];
            var firstChild = cell.el.first();
            if (firstChild) {
                firstChild.removeCls(me._getAllMappedCls());
            }
            cell.el.addCls(['currentCursor', cell.cls]);
        }
    },
    _clearCursorHighlight: function() {
        var me = this;

        for (var i = 0; i < me._cursorCells.length; i++) {
            var cell = me._cursorCells[i];
            cell.el.removeCls(['currentCursor', cell.cls]);
            var firstChild = cell.el.first();
            if (firstChild) {
                firstChild.addCls(me._getMappedCls(cell.cls)); // make sure cell.cls is a single class
            }
        }
    },
    _getMappedCls: function(cls) {
        var childCls = '';

        switch (cls) {
            case N2NCSS.BackDown:
                childCls = N2NCSS.FontDown;
                break;
            case N2NCSS.BackUp:
                childCls = N2NCSS.FontUp;
                break;
            case N2NCSS.BackUnChange:
                if (exchangecode === 'PH') {
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
    _createContextMenu: function() {
        var me = this;

        me._ctMenu = Ext.create('Ext.menu.Menu', {
            items: [
                {
                    text: languageFormat.getLanguage(20505, 'Pause'),
                    paused: false,
                    handler: function(thisCt) {
                        thisCt.paused = !thisCt.paused;
                        me.paused = thisCt.paused;
                        if (me.paused) {
                            me.unsubscribe();
                            thisCt.setText(languageFormat.getLanguage(20506, 'Stream'));
                        } else {
                            me.subscribe();
                            thisCt.setText(languageFormat.getLanguage(20505, 'Pause'));
                        }
                    }
                },
                {
                    text: languageFormat.getLanguage(20007, 'Clear'),
                    handler: function() {
                        me.clearAll();
                    }
                }
            ]
        });
    },
    clearAll: function() {
        var me = this;

        me.adjusting = true;
        me.recordCursor = -1;
        var grids = me.items.items;
        for (var i = 0; i < grids.length; i++) {
            var grid = grids[i];
            var rec = me._createEmptyRecords(me._recordNum);
            grid.store.loadData(rec);
        }

        me.adjusting = false;
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
        width: 620,
        height: 170
    },
    r2l: true,
    initComponent: function() {
        var me = this;
        
        if (N2N_CONFIG.trackerRecordV2) {
            me.boxWidth = 70;
            me.widthPadding = 5;
            me.winConfig.width = 620;
            me.winConfig.height = 160;
        }
        
        me.multiRow = false;
        me._createCompItems();
        Ext.apply(me, {
            title: languageFormat.getLanguage(20501, 'Tracker Record'),
            items: [
                me.compRef.topbar,
                me.compRef.tdView
            ],
            listeners: {
                resize: function(thisComp, width, height) {
                    console.log('resize', width, height);
                    if (width) {
                        // determine the the number of boxes fit to display
                        me._procAutoNum(thisComp, width, height);

                        if (!me._firstLoad) { // should run only once
                            // update title
                            me._updateTitle();

                            me._firstLoad = true;
                            // display some records instead of blank (if available)
                            me._getTrackerHistory();

                            me.subscribe();
                        }
                    }
                }
            }
        });

        me.callParent(arguments);
    },
    reset: function() {
        var me = this;

        me.calNum = true;
        me.unsubscribe();
        me._updateTitle();
        me.compRef.tdView.store.removeAll();
        me.calNum = false;
        me._getTrackerHistory();
        me.subscribe();
    },
    _procAutoNum: function(me, width, height) {
        me.calNum = true; // status as calculating number of boxes, so the update will skip the painting at this point
        var tbarHeight = 22;
        if (me.compRef.topBar) {
            tbarHeight = me.compRef.topBar.getHeight();
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
        me.calNum = false;
    },
    _updateTitle: function() {
        var me = this;

        n2nLayoutManager.updateTitle(me, languageFormat.getLanguage(20501, 'Tracker Record') + ' [' + exchangecode + ']');
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
                '<tr><td class="first-td">{' + fieldUnit + '}</td>',
                '<td rowspan="4" class="back-img"></td></tr>',
                '<tr><td>{' + fieldLast + '}</td></tr>',
                '<tr><td title="{tooltip}">{' + fieldBuyBroker + '}</td></tr>',
                '<tr><td title="{tooltip}">{' + fieldSellBroker + '}</td></tr>',
                '</table>',
                '</tpl>');

        if (N2N_CONFIG.trackerRecordV2) {
            recTpl = new Ext.XTemplate('<tpl for=".">',
                    '<table class="font-applied trackerrecord tdv2 {reccls}">',
                    '<tr><td><div class="tr-title">{title}</div></td></tr>',
                    '<tr><td>{' + fieldLast + '}</td></tr>',
                    '<tr><td>{' + fieldUnit + '}</td></tr>',
                    '<tr><td title="{tooltip}">{' + fieldBuyBroker + '}</td></tr>',
                    '<tr><td title="{tooltip}">{' + fieldSellBroker + '}</td></tr>',
                    '</table>',
                    '</tpl>');
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

                    syncAllComps(me, stkCode, stkName);
                }
            }
        });
        
        // toolbox
        me.compRef.topbar = Ext.create('Ext.toolbar.Toolbar', {
            items: [
                {
                    text: languageFormat.getLanguage(20503, 'Left to Right'),
                    tooltip: languageFormat.getLanguage(20503, 'Left to Right'),
                    iconCls: 'icon-l2r',
                    _r2l: true,
                    handler: function(thisBtn) {
                        thisBtn._r2l = !thisBtn._r2l;
                        me.r2l = thisBtn._r2l;

                        if (me.r2l) {
                            thisBtn.setIconCls('icon-l2r');
                            thisBtn.setTooltip(languageFormat.getLanguage(20503, 'Left to Right'));
                        } else {
                            thisBtn.setIconCls('icon-r2l');
                            thisBtn.setTooltip(languageFormat.getLanguage(20502, 'Right to Left'));
                        }
                    }
                },
                {
                    text: languageFormat.getLanguage(20504, 'Multirow'),
                    enableToggle: true,
                    iconCls: 'icon-multirow',
                    toggleHandler: function(thisBtn, state) {
                        me.multiRow = state;
                        // recalculate boxes
                        var compSize = me.getSize();
                        me._procAutoNum(me, compSize.width, compSize.height);
                    }
                },
                {
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
                }
            ] 
        });

    },
    updateFeedRecord: function(feedObj) {
        var me = this;
        
        if (me.calNum || me.paused || me.inactive) { // skip this update
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
        
        feedObj[fieldStkName] = stockutil.getStockNameFromList(feedObj[fieldStkCode], exchangecode);
        if (N2N_CONFIG.trackerRecordDisplayCode) {
            feedObj['title'] = stockutil.getStockPart(feedObj[fieldStkCode]);
        } else {
            feedObj['title'] = stockutil.getStockPart(feedObj[fieldStkName]);
        }
        
        feedObj[fieldUnit] = formatutils.round10(feedObj[fieldUnit]);
        if (feedObj[fieldLast]) { // format 2 decimals
            feedObj[fieldLast] = parseFloat(feedObj[fieldLast]).toFixed(4);
        }

        var brokerId = feedObj[fieldBrokerId];
        if (!feedObj[fieldBuyBroker]) {
            feedObj[fieldBuyBroker] = '-';
        }
        if (!feedObj[fieldSellBroker]) {
            feedObj[fieldSellBroker] = '-';
        }

        if (brokerId) {
            var bkStr = brokerId.split(',');
            if (bkStr[1].indexOf('|') !== -1 || bkStr[3].indexOf('|') !== -1) {
                var brokerToolTip = '';
                var buyBrokerList = bkStr[1].split('|');
                var sellBrokerList = bkStr[3].split('|');
                var volList = bkStr[4].split('|');
                for (var i = 0; i < volList.length; i++) {
                    brokerToolTip = brokerToolTip.concat("BBH:" + buyBrokerList[i] + ", " + "SBH:" + sellBrokerList[i] + ", " + "Vol:" + volList[i] + "&#13;");
                }

                feedObj[fieldBuyBroker] = "GROUP";
                feedObj[fieldSellBroker] = "GROUP";
                feedObj['tooltip'] = brokerToolTip;
            } else {
                feedObj[fieldBuyBroker] = bkStr[1];
                feedObj[fieldSellBroker] = bkStr[3];
                feedObj['tooltip'] = '';
            }
        }
        
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
    _getTrackerHistory: function() {
        var me = this;

        me.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
        conn.getTrackerHistory({
            exch: exchangecode,
            limit: me.num,
            success: function(res) {
                me.setLoading(false);

                if (res && res.d) {
                    var dataObj = res.d;
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
        
        if (!fullList[exchangecode]) {
            fullList[exchangecode] = {};
            conn.getFullList({
                exch: exchangecode,
                success: function() {
                    me.setLoading(false);
                    conn.subscribeTransaction({
                        exch: exchangecode,
                        listenId: 'listenTrackerRecord'
                    });
                }
            });
        } else {
            conn.subscribeTransaction({
                exch: exchangecode,
                listenId: 'listenTrackerRecord'
            });
        }
    },
    unsubscribe: function() {
        conn.unsubscribeTransaction('listenTrackerRecord');
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
            style: 'margin-left: 5px',
            handler: function() {
                me.getBrokerInfo();
            }
        });
        
        var tbarItems = [me.compRef.bkFilter, me.compRef.stkCb, me.compRef.tranFilter, me.compRef.refreshBt];
        
        if (N2N_CONFIG.autoWidthButton && !isMobile) {
            me.compRef.fitBtn = Ext.create('Ext.button.Button', {
                text: languageFormat.getLanguage(20664, 'Fit columns'),
                tooltip: languageFormat.getLanguage(20664, 'Fit columns'),
                iconCls: 'icon-fitcolumn',
                handler: function() {
                    var gridComp = me.compRef.bkRankGrid;
                    if (me.bkMode === 'bkTran') {
                        gridComp = me.compRef.bkTranGrid;
                    } else if (me.bkMode === 'bkCounter') {
                        gridComp = me.compRef.bkCounterGrid;
                    }

                    helper.autoSizeGrid(gridComp);
                }
            });

            tbarItems.push('->', me.compRef.fitBtn);
        }

        me.compRef.topCt = Ext.create('Ext.toolbar.Toolbar', {
            width: '100%',
            items: tbarItems,
            height: 40,
            enableOverflow: true,
            autoScroll: false
        });
        me._topBar_ = me.compRef.topCt;

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
                    if (isSyncComp(me.type) && isSyncEnabled(me.type)) {
                        var stkCode = record.get(fieldStkCode);
                        var stkName = record.get(fieldStkName);

                        if (stkCode) {
                            // analysis chart
                            syncFirstComp(n2ncomponents.analysisCharts, function() {
                                createAnalysisChartPanel(stkCode, stkName);
                            });
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
            icon: iconIndicesHistorical,
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

/* Trade calculator */
Ext.define('TCPlus.view.TradeCal', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.tradecal',
    type: 'tc',
    savingComp: true,
    winConfig: {
        width: 525,
        height: 352,
        resizable: false
    },
    compRef: {},
    rowCount: 10,
    _profits: {},
    initComponent: function() {
        var me = this;

        me.compRef.totalProfitEl = Ext.widget('textfield', {
            fieldLabel: languageFormat.getLanguage(31613, 'Net Profit'),
            labelWidth: 60,
            width: 185,
            editable: false,
            fieldStyle: 'font-weight:bold;font-size:0.95em'
        });
        me.compRef.totalProfitPerEl = Ext.widget('textfield', {
            width: 65,
            style: 'margin-right: 5px;',
            fieldStyle: 'font-weight:bold;font-size:0.95em',
            editable: false
        });
        me.compRef.totalDetailEl = Ext.widget('button', {
            text: languageFormat.getLanguage(20285, 'Detail'),
            tooltip: languageFormat.getLanguage(20285, 'Detail'),
            icon: iconBtnDetail,
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
                columns: 6,
                tableAttrs: {
                    style: {
                        width: '500px'
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
                        value: calPreference.get('comm', 0.25),
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
                        icon: icoBtnColumn,
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
            me._createLabel(languageFormat.getLanguage(20630, 'Sell Price')),
            me._createLabel(languageFormat.getLanguage(31602, 'Profit')),
            me._createLabel('')
        ];

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
                maskRe: /[0-9]/,
                listeners: me._getRowListeners()
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

            me.compRef['profit' + i] = Ext.widget('textfield', {
                width: '100%',
                fieldStyle: 'text-align:right;font-weight:bold;font-size:0.95em',
                editable: false,
                _rowId: i
            });

            me.compRef['detail' + i] = Ext.widget('button', {
                text: languageFormat.getLanguage(20285, 'Detail'),
                tooltip: languageFormat.getLanguage(20285, 'Detail'),
                icon: iconBtnDetail,
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
                    me.compRef['sellPrice' + i],
                    me.compRef['profit' + i],
                    me.compRef['detail' + i]
                    );
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

                var rowId = thisTf._rowId;
                var code = me.compRef['code' + rowId].getRawValue();
                var share = parseFloat(me.compRef['share' + rowId].getNum());
                var buyPrice = parseFloat(me.compRef['buyPrice' + rowId].getNum());
                var sellPrice = parseFloat(me.compRef['sellPrice' + rowId].getNum());
                var profitEl = me.compRef['profit' + rowId];

                if (share > 0 && buyPrice > 0 && sellPrice > 0) {
                    var profit = me.calculateProfit(share, buyPrice, sellPrice);

                    var pCls = N2NCSS.FontUnChange;
                    if (profit.netProfit > 0) {
                        pCls = N2NCSS.FontUp;
                    } else if (profit.netProfit < 0) {
                        pCls = N2NCSS.FontDown;
                    }

                    profitEl.removeCls([N2NCSS.FontUnChange, N2NCSS.FontUp, N2NCSS.FontDown]);
                    profitEl.addCls(pCls);
                    profitEl.setRawValue(formatutils.formatNumber(profit.netProfit, null, null, 2));
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
            }
        };
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
            _defVal: 0
        });
        var vatRateTf = me._createTextbox({
            fieldLabel: languageFormat.getLanguage(31607, 'VAT Rate'),
            _decNum: 2,
            _defVal: 0
        });
        var taxRateTf = me._createTextbox({
            width: tWidth,
            fieldLabel: languageFormat.getLanguage(31608, 'Tax Rate'),
            _decNum: 2,
            _defVal: 0
        });
        var mincomTf = me._createTextbox({
            fieldLabel: languageFormat.getLanguage(31609, 'Minimum Comm.'),
            _decNum: 2,
            _defVal: 0
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
                        margin: lMargin
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
                        margin: lMargin
                    },
                    {
                        xtype: 'button',
                        cls: 'flatbtn',
                        style: 'margin-left: 105px; margin-top: 10x',
                        text: languageFormat.getLanguage(21045, 'Save'),
                        handler: function() {
                            var sccp = sccpRateTf.getNum();
                            var adval = advalRateTf.getNum();
                            var vat = vatRateTf.getNum();
                            var tax = taxRateTf.getNum();
                            var mincom = mincomTf.getNum();

                            calPreference.set('sccp', sccp);
                            calPreference.set('adval', adval);
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
                        sccpRateTf.setNum(calPreference.get('sccp', 0.01));
                        advalRateTf.setNum(calPreference.get('adval', 0));
                        vatRateTf.setNum(calPreference.get('vat', 12));
                        taxRateTf.setNum(calPreference.get('tax', 0.5));
                        mincomTf.setNum(calPreference.get('mincom', 150));
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
        var buyComm = buyEx * comm;
        if (buyComm < mincom) {
            buyComm = mincom;
        }

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
        var sellComm = sellEx * comm;
        if (sellComm < mincom) {
            sellComm = mincom;
        }

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

        return {
            buyEx: buyEx,
            sellEx: sellEx,
            buyCost: buyCost,
            sellCost: sellCost,
            buyAmount: buyAmount,
            sellAmount: sellAmount,
            netProfit: netProfit
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

            codeEl.setRawValue('');
            shareEl.setRawValue('');
            buyPriceEl.setRawValue('');
            sellPriceEl.setRawValue('');
            profitEl.setRawValue('');

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

            if (share > 0 && buyPrice > 0 && sellPrice > 0) {
                var profit = me.calculateProfit(share, buyPrice, sellPrice);

                var pCls = N2NCSS.FontUnChange;
                if (profit.netProfit > 0) {
                    pCls = N2NCSS.FontUp;
                } else if (profit.netProfit < 0) {
                    pCls = N2NCSS.FontDown;
                }

                profitEl.removeCls([N2NCSS.FontUnChange, N2NCSS.FontUp, N2NCSS.FontDown]);
                profitEl.addCls(pCls);
                profitEl.setRawValue(formatutils.formatNumber(profit.netProfit, null, null, 2));

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

    }
});

Ext.define('TCPlus.view.TradeCalDetail', {
    extend: 'Ext.container.Container',
    alias: 'widget.tradecaldetail',
    compRef: {},
    winConfig: {
        width: 500,
        height: 255
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
    _createUIItems: function() {
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
        me.compRef.buyAdSccpEl = me._createValueEl();
        me.compRef.buyVatEl = me._createValueEl();
        me.compRef.buyCostEl = me._createValueEl();
        me.compRef.buyAmountEl = me._createValueEl();
        me.compRef.beSellPriceEl = me._createValueEl();

        me.compRef.sellPriceEl = me._createValueEl();
        me.compRef.sellExEl = me._createValueEl();
        me.compRef.sellComEl = me._createValueEl();
        me.compRef.sellAdSccpEl = me._createValueEl();
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
                    me._createLabel(languageFormat.getLanguage(31621, 'Ad Valorem & SCCP')),
                    me.compRef.buyAdSccpEl,
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
                    me._createLabel(languageFormat.getLanguage(31616, 'Sell Transaction Details'), {colspan: 2, style: 'font-weight:bold'}),
                    me._createLabel(languageFormat.getLanguage(31626, 'Selling Price')),
                    me.compRef.sellPriceEl,
                    me._createLabel(languageFormat.getLanguage(31627, 'Sell Extension')),
                    me.compRef.sellExEl,
                    me._createLabel(languageFormat.getLanguage(31628, 'Sell Commission')),
                    me.compRef.sellComEl,
                    me._createLabel(languageFormat.getLanguage(31621, 'Ad Valorem & SCCP')),
                    me.compRef.sellAdSccpEl,
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
    cleanUp: function() {
        var me = this;

        me._setElVal(me.compRef.codeEl, '-');
        me._setElVal(me.compRef.shareEl, '-');
        me._setElVal(me.compRef.buyPriceEl, '-');
        me._setElVal(me.compRef.buyExEl, '-');
        me._setElVal(me.compRef.buyComEl, '-');
        me._setElVal(me.compRef.buyAdSccpEl, '-');
        me._setElVal(me.compRef.buyVatEl, '-');
        me._setElVal(me.compRef.buyCostEl, '-');
        me._setElVal(me.compRef.buyAmountEl, '-');
        me._setElVal(me.compRef.beSellPriceEl, '-');

        me._setElVal(me.compRef.sellPriceEl, '-');
        me._setElVal(me.compRef.sellExEl, '-');
        me._setElVal(me.compRef.sellComEl, '-');
        me._setElVal(me.compRef.sellAdSccpEl, '-');
        me._setElVal(me.compRef.sellVatEl, '-');
        me._setElVal(me.compRef.sellCostEl, '-');
        me._setElVal(me.compRef.sellAmountEl, '-');
        me._setElVal(me.compRef.salesTaxEl, '-');

        me._setElVal(me.compRef.netProfitEl, '-');
        me._setElVal(me.compRef.netProfitPerEl, '-');
        me.compRef.netProfitEl.removeCls([N2NCSS.FontUnChange, N2NCSS.FontUp, N2NCSS.FontDown]);
        me.compRef.netProfitPerEl.removeCls([N2NCSS.FontUnChange, N2NCSS.FontUp, N2NCSS.FontDown]);

    },
    refresh: function(detail) {
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
            var buyComm = buyEx * comm;
            if (buyComm < mincom) {
                buyComm = mincom;
            }
            me._setElVal(me.compRef.buyComEl, me._formatNum(buyComm, 2));

            // buy ad valorem and sccp
            var buyAdval = adval * buyEx;
            var buySccp = sccp * buyEx;
            me._setElVal(me.compRef.buyAdSccpEl, me._formatNum((buyAdval + buySccp), 2));

            // buy vat
            var buyVat = vat * buyComm;
            me._setElVal(me.compRef.buyVatEl, me._formatNum(buyVat, 2));


            // total buying cost
            var buyCost = buyComm + buyAdval + buySccp + buyVat;
            me._setElVal(me.compRef.buyCostEl, me._formatNum(buyCost, 2));

            // total buy amount
            var buyAmount = buyCost + buyEx;
            me._setElVal(me.compRef.buyAmountEl, me._formatNum(buyAmount, 2));
        }

        if (shares && sellPrice) {
            var sellEx = shares * sellPrice;
            me._setElVal(me.compRef.sellExEl, me._formatNum(sellEx, 2));

            // sell commission
            var sellComm = sellEx * comm;
            if (sellComm < mincom) {
                sellComm = mincom;
            }
            me._setElVal(me.compRef.sellComEl, me._formatNum(sellComm, 2));

            // sell ad valorem and sccp
            var sellAdval = adval * sellEx;
            var sellSccp = sccp * sellEx;
            me._setElVal(me.compRef.sellAdSccpEl, me._formatNum((sellAdval + sellSccp), 2));

            // sell vat
            var sellVat = vat * sellComm;
            me._setElVal(me.compRef.sellVatEl, me._formatNum(sellVat, 2));

            // sales tax
            var salesTax = tax * sellEx;
            me._setElVal(me.compRef.salesTaxEl, me._formatNum(salesTax, 2));

            // sell cost
            var sellCost = sellComm + sellAdval + sellSccp + sellVat + salesTax;
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
    _createValueEl: function() {
        return Ext.create('Ext.form.Label', {
            text: '-'
        });
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

// from n2ncomponents.js
if (n2ncomponents) {
    n2ncomponents.createBreakEvenCalc = function(tabCt) {
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

            me.breakEvenCalc = Ext.create('widget.fcalculator', {
            	title: languageFormat.getLanguage(20622, 'Breakeven Calculator'),
                exCode: exchangecode,
                initMax: true,
                type: 'bc',
                savingComp: true,
                ddComp: true
            });
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

    n2ncomponents.createAnalysisWarrants = function() {
        var me = this;
        var anwURL = analysisWarrantsURL + '?rate=0&BHCode=' + bhCode + '&lang=en&exchg=' + exchangecode + '&' + new Date().getTime();

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
                var anWarrants = Ext.create('Ext.ux.IFrame', {
                    title: languageFormat.getLanguage(20142, 'Warrants'),
                    initMax: true
                });

                anWarrants.on('beforedestroy', function() {
                    me.userReports['Analysis_Warrants'] = null;
                });
                me.userReports['Analysis_Warrants'] = anWarrants;
                n2nLayoutManager.addItem(anWarrants);
                n2nLayoutManager.activateItem(anWarrants);
                anWarrants.refresh(anwURL);
            } else {
                n2nLayoutManager.activateItem(anWarrants);
            }
        }
    };

    n2ncomponents.createAnalysisDividend = function() {
        var me = this;
        var andURL = analysisDividendURL + '?refresh=0&BHCode=' + bhCode + '&lang=en&exchg=' + exchangecode + '&' + new Date().getTime();

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
                anDividend = Ext.create('Ext.ux.IFrame', {
                    title: languageFormat.getLanguage(20141, 'Dividend'),
                    initMax: true,
                    winConfig: {
                        width: 820
                    }
                });

                anDividend.on('beforedestroy', function() {
                    me.userReports['Analysis_Dividend'] = null;
                });

                me.userReports['Analysis_Dividend'] = anDividend;
                n2nLayoutManager.addItem(anDividend);
                n2nLayoutManager.activateItem(anDividend);
                anDividend.refresh(andURL);
            } else {
                n2nLayoutManager.activateItem(anDividend);
            }
        }
    };

    n2ncomponents.createAnalysisBMD_Future = function() {
        var me = this;

        if (N2N_CONFIG.newWin_Analysis) {
            if (window.name == "analysis_bmf_futures")
                window.name = "";

            msgutil.openURL({
                url: analysisBMFuturesURL,
                name: 'analysis_bmf_futures'
            });
        } else {
            var anBmf = me.userReports['Analysis_BMFutures'];
            if (anBmf == null) {
                var anBmf = Ext.create('Ext.ux.IFrame', {
                    title: languageFormat.getLanguage(20143, 'BMD Futures'),
                    initMax: true
                });

                anBmf.on('beforedestroy', function() {
                    me.userReports['Analysis_BMFutures'] = null;
                });
                me.userReports['Analysis_BMFutures'] = anBmf;

                n2nLayoutManager.addItem(anBmf);
                n2nLayoutManager.activateItem(anBmf);
                anBmf.refresh(analysisBMFuturesURL);
            } else {
                n2nLayoutManager.activateItem(anBmf);
            }
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
        var layoutSettingChanged = false;
        var layoutChanged = false;
        var doSaveSetting = false;
        var trdAccGd;
        var settingWin = null;

        var _toggleSaveBtn = function() {
            if (settingSaveBtn) {
                if (uiSettingChanged || fontSettingChanged || tradeSettingChanged || tradeAccOrderChanged || layoutSettingChanged) {
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
                layoutSettingChanged = false;
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
                listeners: {
                    change: function(thisComp, newValue, oldValue) {
                        // var detective = new Detector();
                        // var isSupported = detective.detect(newValue);
                        
                        fonttype = newValue;
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
        var up = gl_up, down = gl_down, unchg = gl_unchg, yellow = gl_yel;
        if (jsutil.toBoolean(showUISettingItem[7]) && !isMobile) {
            var hidUp = Ext.create('widget.hiddenfield', {
                listeners: {
                    change: function(thisComp, newVal, oldVal, eOpts) {
                        if (global_personalizationTheme.indexOf("black") == -1) {
                            up_w = newVal;
                        } else {
                            up_b = newVal;
                        }
                        changeClsStyle(".N2N_FontUp", "color:#" + newVal + " !important;");
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
                value: up,
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
                        if (global_personalizationTheme.indexOf("black") == -1||isWhiteTheme()) {
                            down_w = newVal;
                        } else {
                            down_b = newVal;
                        }
                        changeClsStyle(".N2N_FontDown", "color:#" + newVal + " !important;");
                        
                        fontSettingChanged = true;
                        _toggleSaveBtn();
                    }
                }
            });
            fontDownItem = fontUpItem.cloneConfig({
                fieldLabel: languageFormat.getLanguage(11032, 'Down'),
                value: down,
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
                        if (global_personalizationTheme.indexOf("black") == -1 || isWhiteTheme()) {
                            unchg_w = newVal;
                        } else {
                            unchg_b = newVal;
                        }
                        changeClsStyle(".N2N_FontUnchange", "color:#" + newVal + " !important;");
                        fontSettingChanged = true;
                        _toggleSaveBtn();
                    }
                }
            });

            fontUnchangeItem = fontUpItem.cloneConfig({
                fieldLabel: languageFormat.getLanguage(11036, 'Unchanged'),
                value: unchg,
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
                        if (global_personalizationTheme.indexOf("black") == -1 || isWhiteTheme()) {
                            yel_w = newVal;
                        } else {
                            yel_b = newVal;
                        }
                        changeClsStyle(".N2N_FontUnchange_yellow", "color:#" + newVal + " !important;");
                        fontSettingChanged = true;
                        _toggleSaveBtn();
                    }
                }
            });
            fontYellowItem = fontUpItem.cloneConfig({
                fieldLabel: languageFormat.getLanguage(11008, 'Volume'),
                value: yellow,
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
                        boxLabel: languageFormat.getLanguage(21091, 'Grey (Lite)'),
                        name: 'themeRdg',
                        inputValue: 'grey',
                        hidden: true
                    },
                    {
                        boxLabel: languageFormat.getLanguage(21093, 'Blue (Lite)'),
                        name: 'themeRdg',
                        inputValue: 'blue',
                        hidden: true
                    },
                    {
                        boxLabel: languageFormat.getLanguage(21136, "Crisp (Lite)"),
                        name: "themeRdg",
                        inputValue: "crisp",
                        hidden: true
                    },
                    {
                        boxLabel: languageFormat.getLanguage(21137, "Neptune (Lite)"),
                        name: "themeRdg",
                        inputValue: "neptune",
                        hidden: true
                    },
                    {
                        boxLabel: languageFormat.getLanguage(21140, "Lite"),
                        name: "themeRdg",
                        inputValue: "wh"
                    },
                    {
                        boxLabel: languageFormat.getLanguage(21092, 'Grey (Dark)'),
                        name: 'themeRdg',
                        inputValue: 'grey_black',
                        hidden: true
                    },
                    {
                        boxLabel: languageFormat.getLanguage(21094, 'Blue (Dark)'),
                        name: 'themeRdg',
                        inputValue: 'blue_black',
                        hidden: true
                    }, {
                        boxLabel: languageFormat.getLanguage(21138, "Crisp (Dark)"),
                        name: "themeRdg",
                        inputValue: "crisp_black",
                        hidden: true
                    },
                    {
                        boxLabel: languageFormat.getLanguage(21139, "Neptune (Dark)"),
                        name: "themeRdg",
                        inputValue: "neptune_black",
                        hidden: true
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
                        settingWin.themeRdg = newValue.themeRdg;
                        uiSettingChanged = true;
                        _toggleSaveBtn();
                        setThemeCSS(newValue.themeRdg, settingWin.alternative);
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
        var isSuccess = false;
        var saveUIHandler = function() {
            doSaveSetting = true;
            var updateGlobalFonts = false;

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
                    'lang,', global_Language
                ].join('');

                settingWin.closeAction = "hide";
                settingWin.close();
                settingWin.closeAction = "destroy";

                Ext.Ajax.request({
                    url: settingUrl,
                    success: function() {
                        global_newsSetting = settingWin.newsRdg;
                        global_reportSetting = settingWin.reportRdg;
                        global_NewWindow_News = global_newsSetting;
                        global_NewWindow_Report = global_reportSetting;
                        global_dynamicLimitSetting = settingWin.dyLimitRdg;
                        
                        /*
                        if (global_personalizationTheme != settingWin.themeRdg) {
                            var reloadPage = function() {
                                n2nLayoutManager.setLoading(languageFormat.getLanguage(31104, 'Please wait. Reloading...'));
                                location.reload();
                            };
                            if (settingWin.themeRdg.indexOf('wh') != -1) {
                                reloadPage();
                            } else if (global_personalizationTheme.indexOf('wh') != -1 && settingWin.themeRdg.indexOf("wh") == -1) {
                                reloadPage();
                            } else if (settingWin.themeRdg.indexOf("crisp") != -1) {
                                reloadPage();
                            } else if (settingWin.themeRdg.indexOf("neptune") != -1) {
                                reloadPage();
                            }
                        }
                        */
                       
                        if (global_personalizationTheme !== settingWin.themeRdg) {
                            global_personalizationTheme = settingWin.themeRdg;
                            updateGlobalFontColors();
                            updateGlobalFonts = true;

                            // refresh market depth to get gradient take effected
                            if (marketDepthMatrixPanel && marketDepthMatrixPanel.itemsMarketDepth[0] && marketDepthMatrixPanel.itemsMarketDepth[0].isGradient === "gradient") {
                                marketDepthMatrixPanel.refresh();
                            }
                            
                            refreshViewMarketDepth();

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

                fontStr = "ft_" + fonttype + "{" + globalFontSize + ",fcl_up~" + up_w + "~" + up_b + "_down~" + down_w + "~" + down_b + "_unchg~" + unchg_w + "~" + unchg_b + "_yel~" + yel_w + "~" + yel_b + ",alter_" + alter;
                if (fontStr != fontSaving.join(',')) {
                    fontChanged = true;
                    gl_alter = alter;
                    gl_fonttype = fonttype;
                    if (jsutil.toBoolean(showUISettingItem[7]) && !isMobile) {
                        if (!updateGlobalFonts) {
                            updateGlobalFontColors();
                        }
                    }

                    fontSaving = fontStr.split(",");

                    Ext.Ajax.request({
                        url: [
                            addPath,
                            "tcplus/setting?a=set&sc=TCLFS&p=",
                            fontStr
                        ].join(''),
                        success: function() {
                        }
                    });
                }

                if (fontChanged) {
                    setFontStyle();
                    createFmx0(settingWin.prevFontType, settingWin.prevFontSize);
                    createFmx();
                    adjustColWidths();
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
                
                if (!uiSettingChanged && !fontSettingChanged && !tradeSettingChanged && !tradeAccOrderChanged) {
                    settingWin.close();
                }
                
            }
        };
            
        var settingSaveBtn = Ext.create('Ext.button.Button', {
            text: global_personalizationTheme.indexOf("wh") != -1 ? '' : languageFormat.getLanguage(21045, 'Save'),
            tooltip: global_personalizationTheme.indexOf("wh") == -1 ? '' : languageFormat.getLanguage(21045, 'Save'),
            icon: global_personalizationTheme.indexOf("wh") != -1 ? iconBtnSave : "",
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
                if (jsutil.toBoolean(showUISettingItem[7]) && !isMobile) {
                    var colorObj = getDefaultFontColors(settingWin.themeRdg);

                    fontUpItem.setValue(colorObj.up);
                    fontDownItem.setValue(colorObj.down);
                    fontUnchangeItem.setValue(colorObj.unchg);
                    fontYellowItem.setValue(colorObj.yellow);
                    
                }
                if (jsutil.toBoolean(showUISettingItem[6]) && !isMobile) {
                    fontTypeItem.setValue(defFontType);
                }
                if (jsutil.toBoolean(showUISettingItem[5]) && !isMobile) {
                    fontSizeItem.setValue(defFontSize);
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
                    var iconPath = iconLayoutPath + 'layout' + layoutItems[i] + '.png';
                    subItems.push({src: iconPath, value: layoutItems[i]});
                }
                var rowNum = Math.ceil(layoutItems.length / iconsPerRow);
                var viewHeight = rowNum * rowHeight;

                var subStore = Ext.create('Ext.data.Store', {
                    fields: [
                        {name: 'src', type: 'string'},
                        {name: 'value', type: 'string'}
                    ],
                    data: subItems
                });

                var subLayoutTpl = new Ext.XTemplate(
                        '<tpl for=".">',
                        '<div class="force_black thumb-wrap">',
                        '<img src="{src}" />',
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
        if (N2N_CONFIG.defTradeAccFeature) {

            var dexCb = Ext.create('Ext.form.field.ComboBox', {
                fieldLabel: languageFormat.getLanguage(20301, 'Exchange'),
                fieldWidth: 150,
                width: '100%',
                store: {
                    fields: ['exchange', 'exchangeName'],
                    data: global_ExchangeList
                },
                forceSelection: true,
                queryMode: 'local',
                displayField: 'exchange',
                valueField: 'exchange',
                editable: false,
                value: exchangecode,
                listeners: {
                    change: function(thisComp, newValue) {
                        daCb.select(defTrAccConf.getDefTrAccOpt(newValue));
                        spaTf.setValue(defTrAccConf.getDefTrAccVal(newValue));
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
            var spaTf = Ext.create('Ext.form.field.Text', {
                fieldLabel: '&nbsp;',
                width: '100%',
                fieldWidth: 150,
                labelSeparator: '',
                selectOnFocus: true,
                hidden: !_isSpecificValue(defTrAccConf.getDefTrAccOpt(exchangecode)),
                value: defTrAccConf.getDefTrAccVal(exchangecode),
                listeners: {
                    change: function(thisComp, newValue) {
                        var dex = dexCb.getValue();
                        defTrAccConf.setDefTrAccVal(dex, newValue);

                        tradeSettingChanged = true;
                        _toggleSaveBtn();
                    }
                }
            });
            var defAccFs = {
                xtype: 'fieldset',
                width: '100%',
                title: languageFormat.getLanguage(21127, 'Default Trading Account'),
                items: [dexCb, daCb, spaTf],
                // margin: fsMargin,
                // padding: 0,
                cls: 'settingfs'
            };
            tradeSettingItems.push(defAccFs);
        }

        if (N2N_CONFIG.tradeAccOrder) {
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
                        icon: iconTop,
                        tooltip: languageFormat.getLanguage(21149, 'Move to first'),
                        handler: function() {
                            if (helper.moveSelection(trdAccGd, 'top') > -1) {
                                tradeAccOrderChanged = true;
                                _toggleSaveBtn();
                            }
                        }
                    },
                    {
                        icon: iconUp,
                        tooltip: languageFormat.getLanguage(21150, 'Move up'),
                        handler: function() {
                            if (helper.moveSelection(trdAccGd, 'up') > -1) {
                                tradeAccOrderChanged = true;
                                _toggleSaveBtn();
                            }
                        }
                    },
                    {
                        icon: iconDown,
                        tooltip: languageFormat.getLanguage(21151, 'Move down'),
                        handler: function() {
                            if (helper.moveSelection(trdAccGd, 'down') > -1) {
                                tradeAccOrderChanged = true;
                                _toggleSaveBtn();
                            }
                        }
                    },
                    {
                        icon: iconBottom,
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

            var trdAccOrdFs = {
                xtype: 'fieldset',
                width: '100%',
                title: languageFormat.getLanguage(21128, 'Trading Account Order'),
                items: [trdAccGd],
                // padding: 0,
                // margin: 0
            };
            tradeSettingItems.push(trdAccOrdFs);
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
                		}else{
                			btnDefault.hide();
                		}
                	}
                }
            });
        } else {
            stpItems[0].xtype = 'container';
        }
        var btnCont = [
            '->',
            settingSaveBtn,
            '-',
            settingCancelBtn
        ];
        var btnHeader = [];
        if (global_personalizationTheme.indexOf("wh") != -1) {
            btnCont = [settingApplyBtn, btnDefault];
            btnHeader = [settingSaveBtn];
        }
        settingWin = msgutil.popup({
            title: languageFormat.getLanguage(20617, 'Settings'),
            width: 260,
//            height: winHeight,
            resizable: false,
            themeRdg: global_personalizationTheme,
            unitRdg: global_displayUnit,
            newsRdg: global_newsSetting,
            reportRdg: global_reportSetting,
            dyLimitRdg: global_dynamicLimitSetting,
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
                }
            }
        });

    };
    n2ncomponents.requestSaveNoAsk = function() {

        var settingUrl = [
            addPath,
            "tcplus/setting?a=set&sc=TCLPTHEME&p=",
            global_personalizationTheme, '~',
            global_displayUnit, '~',
            'news,', global_newsSetting, '-',
            'rpt,', global_reportSetting, '-',
            'dl,', global_dynamicLimitSetting, '-',
            'fs,', globalFontSize, '-',
            'na,', global_noAsk, '-',
            'nt,', 1, '-',
            'lang,', global_Language
        ].join('');
        Ext.Ajax.request({
            url: settingUrl
        });
    };
    n2ncomponents.layoutSettingUI = function() {
        var tabLayoutView;
        var lsItems = N2N_CONFIG.layoutSettingItems;

        if (lsItems.indexOf(APP_LAYOUT.TAB) > -1) {
            var tabItems = [
                {src: ICON.TAB_2, value: 2},
                {src: ICON.TAB_3, value: 3}
            ];
            if (!isTablet) {
                tabItems.push({src: ICON.TAB_4, value: 4}, {src: ICON.TAB_5, value: 5});
            }

            var tabStore = Ext.create('Ext.data.Store', {
                fields: [
                    {name: 'src', type: 'string'},
                    {name: 'value', type: 'int'}
                ],
                data: tabItems
            });

            var tabLayoutTpl = new Ext.XTemplate(
                    '<tpl for=".">',
                    '<div class="thumb-wrap">',
                    '<img src="{src}" />',
                    '</div>',
                    '</tpl>'
                    );

            tabLayoutView = Ext.create('Ext.view.View', {
                store: tabStore,
                tpl: tabLayoutTpl,
                style: 'text-align: left;margin-left:80px',
                trackOver: true,
                overItemCls: 'x-item-over',
                itemSelector: 'div.thumb-wrap',
                hidden: !n2nLayoutManager.isTabLayout(),
                listeners: {
                    afterrender: function(thisComp) {
                        thisComp.getSelectionModel().select(n2nLayoutManager.getSubLayout() - 2);
                    },
                    selectionchange: function(thisComp, selected) {
                        if (selected.length > 0) {
                            var value = selected[0].get('value');
                            if (n2nLayoutManager.getSubLayout() == value) {
                                layoutSaveBtn.disable();
                            } else {
                                layoutSaveBtn.enable();
                            }
                        }
                    }
                }
            });
        }

        var layoutRadioItems = new Array();
        if (lsItems.indexOf(APP_LAYOUT.PORTAL) > -1) {
            layoutRadioItems.push({
                boxLabel: languageFormat.getLanguage(21112, 'Docked'),
                name: 'layoutRadio',
                inputValue: APP_LAYOUT.PORTAL
            });
        }
        if (lsItems.indexOf(APP_LAYOUT.WINDOW) > -1) {
            layoutRadioItems.push({
                boxLabel: languageFormat.getLanguage(21113, 'Popup'),
                name: 'layoutRadio',
                inputValue: APP_LAYOUT.WINDOW
            });
        }
        if (lsItems.indexOf(APP_LAYOUT.TAB) > -1) {
            layoutRadioItems.push({
                boxLabel: languageFormat.getLanguage(21114, 'Tab'),
                name: 'layoutRadio',
                inputValue: APP_LAYOUT.TAB
            });
        }

        var layoutRadio = Ext.create('Ext.form.RadioGroup', {
            fieldLabel: languageFormat.getLanguage(20605, 'Layout'),
            labelWidth: 60,
            vertical: true,
            columns: 1,
            items: layoutRadioItems,
            value: {
                layoutRadio: n2nLayoutManager.getAppLayout()
            },
            listeners: {
                change: function(thisComp, newValue) {
                    if (newValue.layoutRadio != n2nLayoutManager.getAppLayout()) {
                        layoutSaveBtn.enable();
                    } else {
                        if (newValue.layoutRadio == APP_LAYOUT.TAB) {
                            var selectedTl = tabLayoutView.getSelectionModel().getSelection();
                            var subLayout;
                            if (selectedTl.length > 0) {
                                subLayout = selectedTl[0].get('value');
                            }
                            if (subLayout != n2nLayoutManager.getSubLayout()) {
                                layoutSaveBtn.enable();
                            } else {
                                layoutSaveBtn.disable();
                            }
                        } else {
                            layoutSaveBtn.disable();
                        }
                    }

                    if (tabLayoutView) {
                        if (newValue.layoutRadio == APP_LAYOUT.TAB) {
                            tabLayoutView.show();
                        } else {
                            tabLayoutView.hide();
                        }
                    }
                }
            }
        });

        var layoutSaveBtn = Ext.create('Ext.button.Button', {
            text: global_personalizationTheme.indexOf("wh") != -1 ? '' : languageFormat.getLanguage(21045, 'Save'),
            disabled: true,
            tooltip: 'This action will reload the whole page.',
            tooltipType: 'title',
            icon: iconBtnSave,
            handler: function() {
                // keeps previous layout
                var prevAppLayout = n2nLayoutManager.getAppLayout();
                var prevSubLayout = n2nLayoutManager.getSubLayout();

                var checked = layoutRadio.getValue();
                n2nLayoutManager.lyConf.appLayout = checked.layoutRadio;

                if (n2nLayoutManager.isTabLayout()) {
                    var selectedTl = tabLayoutView.getSelectionModel().getSelection();
                    if (selectedTl.length > 0) {
                        var subLayout = selectedTl[0].get('value');
                        n2nLayoutManager.lyConf.setSubLayout(subLayout);
                    }
                }

                var scKey = 'TCLML';
                if (isTablet) {
                    scKey = 'TCLTBML';
                }

                // something wrong reset back the layout
                var restoreLayout = function() {
                    n2nLayoutManager.lyConf.appLayout = prevAppLayout;
                    n2nLayoutManager.lyConf.setSubLayout(prevSubLayout);
                };

                var url = addPath + "tcplus/setting?a=set&sc=" + scKey + "&p=" + n2nLayoutManager.lyConf.toString();
                Ext.Ajax.request({
                    url: url,
                    success: function(response) {
                        var res = Ext.decode(response.responseText);

                        layoutWin.close();
                        if (res && res.s) {
                            n2nLayoutManager.setLoading(languageFormat.getLanguage(31104, 'Please wait. Reloading...'));
                            location.reload();
                        } else {
                            restoreLayout();
                        }
                    },
                    failure: function() {
                        restoreLayout();
                        layoutWin.close();
                    }
                });

            }
        });

        var layoutWinItems = new Array();
        layoutWinItems.push(layoutRadio);
        if (tabLayoutView) {
            layoutWinItems.push(tabLayoutView);
        }
        var btnCont = [
            '->',
            layoutSaveBtn,
            '-',
            {
                text: languageFormat.getLanguage(10010, 'Cancel'),
                icon: iconBtnCancel,
                handler: function() {
                    layoutWin.close();
                }
            }
        ];
        var btnHeader = [];
        if (global_personalizationTheme.indexOf("wh") != -1) {
            btnCont = [];
            btnHeader = [layoutSaveBtn];
        }
        var layoutWin = Ext.create('Ext.window.Window', {
            title: languageFormat.getLanguage(21111, 'Layout Settings'),
            width: 250,
            height: 185,
            bodyPadding: 5,
            autoShow: true,
            modal: true,
            alwaysOnTop: winAlwaysOnTop,
            resizable: false,
            items: layoutWinItems,
            header: {
                items: btnHeader
            },
            bbar: btnCont
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
                            resizable: true,
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
    
    n2ncomponents.createSMSStockAlert = function(key) {
    	//title rename from SMS Stock Alert to Stock Alert
    	var me = this;
    	var smsStkAlertURL = settingSMSStockAlertURL;
    	
    	if(key){
    		var stkParts = stockutil.getStockParts(key);
            var code = stkParts.code;
            var exch = stkParts.exch;
            
            smsStkAlertURL = smsStkAlertURL + '?stkCd=' + code + '&exCd=' + exch;
    	}

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
    			smsAlert = Ext.create('Ext.ux.IFrame', {
    				title: languageFormat.getLanguage(20602, 'Stock Alert'),
    				key: key,
    				type: 'smsa',
    				ddComp: true,
    				winConfig: {
    					resizable: true,
    					width: 700,
    					height: 480
    				}
    			});

    			smsAlert.on('beforedestroy', function() {
    				me.userReports['SMS_StockAlert'] = null;
    			});

    			me.userReports['SMS_StockAlert'] = smsAlert;
    			n2nLayoutManager.addItem(smsAlert);
    			n2nLayoutManager.activateItem(smsAlert);
    			smsAlert.refresh(smsStkAlertURL);
    		} else {
    			n2nLayoutManager.activateItem(smsAlert);
    			if (key != smsAlert.key) {
    				smsAlert.refresh(smsStkAlertURL);
    			}
    		}
    	}
    };

    n2ncomponents.languageSetting = function() {
        var tempLanguageItems = [];
        var languageText = '';
        var languageFile = '';
        var languageIcon = '';
        var languageFileType = languageOptions.split(',');
        for (var i = 0; i < languageFileType.length; i++) {
            // default to english
            var languageText = languageFormat.getLanguage(10034, 'English');
            var languageFile = 'en';
            var languageIcon = iconLanguageEnglish;

            switch (languageFileType[i].toLowerCase()) {
                case 'cn':
                    languageText = languageFormat.getLanguage(10035, 'Chinese');
                    languageFile = 'cn';
                    languageIcon = iconLanguageChinese;
                    break;
                case 'jp':
                    languageText = languageFormat.getLanguage(10037, 'Japanese');
                    languageFile = 'jp';
                    languageIcon = iconLanguageJapanese;
                    break;
                case 'vn':
                    languageText = languageFormat.getLanguage(10038, 'Vietnamese');
                    languageFile = 'vn';
                    languageIcon = iconLanguageVietnamese;
                    break;
            }

            tempLanguageItems.push({
                text: languageText,
                icon: languageIcon,
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
                icon: icoBtnBack,
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

// from components.js
function setThemeCSS(themeName, altOpt) {
    var newlinkTheme = "js/lib/extjs/themes/";
    var newlinkBack = "css/N2NCSS/";
    var fixcrisp = "";
    var whtheme = "";
    var bltheme = "";
    
    console.log('themeName', themeName);
    if (!themeName) {
        newlinkTheme = global_theme;
        newlinkBack = global_themeBack;
    } else {
        themeName = themeName.toLowerCase();
        if (themeName.indexOf("blue") != -1) {
            newlinkTheme += "ext-theme-classic/resources/ext-theme-classic-all.css";
        } else if (themeName.indexOf("grey") != -1) {
            newlinkTheme += "ext-theme-gray/resources/ext-theme-gray-all.css";
        } else if (themeName.indexOf("crisp") != -1) {
            newlinkTheme += "ext-theme-crisp/resources/ext-theme-crisp-all.css";
            fixcrisp = "css/N2NCSS/crisp.css";
        } else if (themeName.indexOf("neptune") != -1) {
            newlinkTheme += "ext-theme-neptune/resources/ext-theme-neptune-all.css";
            fixcrisp = "css/N2NCSS/crisp.css";
        } else if (themeName.indexOf("wh") != -1) {
            newlinkTheme += "ext-theme-gray/resources/ext-theme-gray-all.css";
            whtheme = "css/N2NCSS/whbase.css";
        }
        else {
            newlinkTheme += "ext-theme-gray/resources/ext-theme-gray-all.css";
        }

        if (themeName.indexOf("black") != -1) {
            newlinkBack += "blinking_black.css";
            if (themeName.indexOf("wh") != -1) {
                bltheme = "css/N2NCSS/black.css";
            }
        } else {
            newlinkBack += "blinking_white.css";
        }
    }

    Ext.getBody().hide();
    Ext.util.CSS.swapStyleSheet('themeCSS', newlinkTheme);
    Ext.util.CSS.swapStyleSheet('themeCSS_blink', newlinkBack);
    if (fixcrisp != "") {
        Ext.util.CSS.swapStyleSheet("fixcrisp", fixcrisp);
    } else {
        Ext.util.CSS.removeStyleSheet("fixcrisp");
    }
    if (whtheme != "") {
        Ext.util.CSS.swapStyleSheet("whitetheme", whtheme);
    } else {
        Ext.util.CSS.removeStyleSheet("whitetheme");
    }

    if (bltheme != "") {
        Ext.util.CSS.swapStyleSheet("blacktheme", bltheme);
    } else {
        Ext.util.CSS.removeStyleSheet("blacktheme");
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
            icon: iconBtnSave,
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
            icon: iconBtnCancel,
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
