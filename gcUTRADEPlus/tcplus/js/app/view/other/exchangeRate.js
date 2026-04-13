Ext.define('TCPlus.view.other.exchangeRate', {
    extend: 'Ext.container.Container',
    requires: [
        'TCPlus.model.ExchangeRate'
    ],
    alias: 'widget.exchangerate',
    currencyTb: null,
    transactionlist: {},
    comboAcc: null,
    arAccList: [],
    comp: "exchangerate",
    type: "exchangeRate",
    style: "padding:5px;",
    winFXConversion: null,
    accBal: 0,
    tAjax_ID: "exchangeRate",
    arrCurr: [],
    stkcodes: [],
    tktno: "",
    autoScroll: true,
    noRoundCurr1: 0,
    noRoundCurr2: 0,
    formatDateTime: "d-m-Y H:i:s A",
    lastKeyin: "",
    lastAct: "",
    lastFXMCurr: "",
    recCurrencyTb: null,
    initComponent: function() {
        var me = this;

        setMaxDigits(38);
        me.keyPair = new RSAKeyPair(
                key,
                '', // privateKey
                mod
                );

        me.labelEffDateTime = new Ext.form.field.Display({
            fieldLabel: languageFormat.getLanguage(21251, 'Effective Date'),
            width: '100%',
            labelSeparator: ':&nbsp',
            style: "display:inline-block;padding-left: 5px;",
            value: Ext.Date.format(new Date(), me.formatDateTime)
        });

        me.scrollBarWidth = Ext.getScrollbarSize().width - 2;
        me.loadAccList();

        me.comboAcc = Ext.create('Ext.form.ComboBox', {
            store: new Ext.data.ArrayStore({
                fields: ['val', 'nam'],
                data: me.arAccList
            }),
            editable: false,
            triggerAction: 'all',
            width: 300,
            labelStyle: "width: 150px;",
            mode: 'local',
            fieldLabel: languageFormat.getLanguage(21252, 'Cash Trading Account No'),
            displayField: "nam",
            valueField: "val",
            selectOnFocus: false,
            forceSelection: true,
            value: me.arAccList.length != 0 ? me.arAccList[0][0] : "",
            queryMode: 'local',
            listeners: {
                change: function() {
                    me.getFXDisplay();
                    me.callCUT();
                }
            }
        });

        var todayDate = new Date();
        var last7Date = new Date();
        var min180Days = new Date();
        last7Date.setDate(last7Date.getDate() - 7);
        last7Date = Ext.Date.format(last7Date, "d/m/Y");
        min180Days.setDate(min180Days.getDate() - 180);
        min180Days = Ext.Date.format(min180Days, "d/m/Y");
        Ext.apply(Ext.form.VTypes, {
            daterange: function(val, field) {
                var date = field.parseDate(val);

                if (!date) {
                    return false;
                }
                if (field.startDateField) {
                    var start = me.dateFromTrans;
                    if (!start.maxValue || (date.getTime() != start.maxValue.getTime())) {
                        start.setMaxValue(date);
                        start.validate();
                    }
                }
                else if (field.endDateField) {
                    var end = me.dateToTrans;
                    if (!end.minValue || (date.getTime() != end.minValue.getTime())) {
                        end.setMinValue(date);
                        end.validate();
                    }
                }
                /*
                 * Always return true since we're only using this vtype to set the
                 * min/max allowed values (these are tested for after the vtype test)
                 */
                return true;
            }
        });

        me.dateFromTrans = new Ext.form.DateField({
            editable: false,
            format: 'd/m/Y',
            itemId: "dtStart",
            hidden: true,
            value: last7Date,
            maxValue: todayDate,
            vtype: 'daterange',
            endDateField: 'dtEnd',
            minValue: min180Days
        });

        me.dateToTrans = new Ext.form.DateField({
            itemId: "dtEnd",
            editable: false,
            format: 'd/m/Y',
            hidden: true,
            value: todayDate,
            maxValue: todayDate,
            vtype: 'daterange',
            startDateField: "dtStart",
            minValue: min180Days
        });

        var defaultConfig = {
            title: languageFormat.getLanguage(21250, 'FX Conversion - CUT'),
            items: [
                {
                    border: false,
                    html: '<div class="titleCurrencyRate"><div class="text">' + languageFormat.getLanguage(21255, 'FX for Cash Upfront Trading') + '</div></div>'
                            + '<div class="bodyCurrencyRate" style="padding:0px;padding-bottom:10px;padding-top:10px;">'
                            + languageFormat.getLanguage(31201, 'This service gives you a side by side view of FX Rate and Cash Upfront cash balances. It also allows you to convert your Cash Upfront cash balance online from one currency to another currency.')
                            + '</div>'
                },
                {
                    unstyled: true,
                    border: false,
                    autoHeight: true,
                    style: "padding-bottom:10px;",
                    layout: 'form',
                    items: [
                        {
                            layout: "column",
                            border: false,
                            items: [
                                {
                                    layout: "form",
                                    border: false,
                                    width: 460,
                                    items: [me.comboAcc]
                                },
                                {
                                    border: false,
                                    style: "padding-top:5px;cursor:pointer;",
                                    html: "<div id='refreshcurrencytable'><div class='fx-refresh-limit' style='margin-top:2px;'></div></div>",
                                    listeners: {
                                        afterrender: function() {
                                            Ext.get("refreshcurrencytable").on("click", function() {
                                                me.callCurrencyTable();
                                                var accountName = me._getAccountName();

                                                if (formatutils.isCUTSubAcc(accountName)) {
                                                    me.callRecentTransactionList();
                                                } else {
                                                    me.hideNonCUTOptions();
                                                }
                                                
                                            });
                                        }
                                    }
                                }
                            ]
                        },
                        me.labelEffDateTime
                    ]
                },
                {
                    html: "<div><i>" + languageFormat.getLanguage(31202, 'Double click on a row with desired currency to perform FX conversion.') + "</i></div>",
                    border: false,
                    style: 'margin-bottom: 3px'
                },
                me.currencyTable(),
                {
                    html: "<div style='width:700px;clear:both;float:left;padding-top:6px;'><div style='float:right;height:43px;padding:10px;padding-bottom:0px;font-size:1.1em;border:2px solid #C7C6C6;border:2px solid #C7C6C6;border-left-width:0px;width:100px;text-align:right;' id='lbEs'>0.00</div><div id='cbCrEs' style='float:right;padding-top:8px;border:2px solid #C7C6C6;border-left-width:0px;border-right-width:0px;padding-left:5px;height:43px;'></div>" +
                            "<div style='float:right;height:43px;padding:10px;padding-bottom:0px;width:110px;font-size:1.1em;background-color: #760209;color:#fff;border:2px solid #C7C6C6;border-right-width:0px;'>" + languageFormat.getLanguage(21256, 'Estimate Total') + "</div></div>"
                            + "<div id='promoteMsg' style='padding-top:20px;padding-bottom:20px;font-size: 0.85em;clear:both;'></div>",
                    border: false
                },
                {
                    html: "<div id='fxlistlink' style='padding-top:20px;margin-bottom: 4px;padding-bottom: 5px;border-bottom: 4px solid #D4D5D6;'> " + 
                    		languageFormat.getLanguage(31224, 'Click') + "<span style='color:#278EF2; cursor:pointer;' id='showtransact'> " + languageFormat.getLanguage(31225, 'here') + "</span> " + 
                    		languageFormat.getLanguage(31226, 'to view your') + "<span id='fxtran'> " + languageFormat.getLanguage(31227, 'FX transaction list') + "</span></div>" +
                            "<div style='padding-bottom:2px;display:none;' id='titlerecent'>" + languageFormat.getLanguage(21257, 'Recent FX Transaction List') + "</div>",
                    border: false
                },
                me.getRecentTransactionList(),
                {
                    unstyled: true,
                    border: false,
                    autoHeight: true,
                    style: "padding-bottom:20px;width:460px;",
                    xtype: 'container',
                    layout: 'column',
                    items: [
                        {
                            items: me.dateFromTrans,
                            xtype: "container"
                        },
                        {
                            xtype: "container",
                            html: "to",
                            id: "tolabel",
                            border: false,
                            hidden: true,
                            style: "padding-top:3px;padding-left: 10px; padding-right: 10px;border-width:0px!important;"
                        },
                        {
                            items: me.dateToTrans,
                            xtype: "container"
                        },
                        {
                            xtype: "container",
                            html: "<div class='fx-refresh-limit'></div>",
                            border: false,
                            id: "refreshtransaction",
                            hidden: true,
                            style: "cursor: pointer;padding-top:2px;margin-left: 10px;border-width: 0px!important;",
                            listeners: {
                                afterrender: function() {
                                    Ext.get("refreshtransaction").addListener("click", function() {
                                        me.callTransactionList();
                                    });
                                }
                            }
                        }
                    ]
                },
                me.getTransactionList()
            ],
            listeners: {
                afterrender: function() {
                    Ext.get("showtransact").addListener("click", function() {
                        me.showTransact();
                    });
                    me.comboEs = new Ext.form.ComboBox({
                        store: new Ext.data.ArrayStore({
                            fields: ['value', "des"],
                            data: [['SGD', "SGD"]]
                        }),
                        triggerAction: 'all',
                        displayField: "des",
                        width: 52,
                        style: "border:none;font-size:1.05em;",
                        valueField: "value",
                        value: "SGD",
                        renderTo: "cbCrEs",
                        mode: 'local'
                    });
                    me.getFXDisplay();
                },
                resize: function(thisComp, width) {
                    // set grid width since 100% doesn't work when resize
                    if (width) {
                        var newWidth = width - 30;
                        if (me.transactionlist) {
                            me.transactionlist.setWidth(newWidth);
                        }
                        if (me.recentTransactionlist) {
                            me.recentTransactionlist.setWidth(newWidth);
                        }
                    }
                },
                destroy: function() {
                    Storage.generateUnsubscriptionByExtComp(me);
                }
            }
        };

        Ext.apply(this, defaultConfig);
        this.callParent(arguments);
    },
    showTransact: function() {
        var fx = document.getElementById("fxtran").innerHTML;
        var me = this;
        var accountName = me._getAccountName();

        if (!formatutils.isCUTSubAcc(accountName)) {
            me.hideNonCUTOptions();
            return;
        }

        if (fx == languageFormat.getLanguage(31227, "FX transaction list")) {
            if (global_s2FARequire == 'true' && global_s2FABypass == 'YES' && global_s2FADeviceList.length == 0 || global_s2FABypass == 'ALL') {
                if (!N2N1FA.return1FAValidation('showTransact')) {
                    return;
                }
            } else {
                if (!N2N2FA.return2FAValidate('showTransact')) {
                    return;
                }
            }
            me.transactionlist.show();
            me.dateFromTrans.show();
            me.dateToTrans.show();
            Ext.get("refreshtransaction").show();
            Ext.get("tolabel").show();
            me.callTransactionList();
            Ext.get("fxtran").update(" " + languageFormat.getLanguage(31228, "recent FX transactions"));
            me.recentTransactionlist.hide();
            Ext.get("titlerecent").hide();
        } else {
            if (global_s2FARequire == 'true' && global_s2FABypass == 'YES' && global_s2FADeviceList.length == 0 || global_s2FABypass == 'ALL') {
                if (!N2N1FA.return1FAValidation('showTransact')) {
                    return;
                }
            } else {
                if (!N2N2FA.return2FAValidate('showTransact')) {
                    return;
                }
            }
            me.transactionlist.hide();
            me.dateFromTrans.hide();
            me.dateToTrans.hide();
            Ext.get("refreshtransaction").hide();
            Ext.get("tolabel").hide();
            Ext.get("fxtran").update(" " + languageFormat.getLanguage(31227, "FX transaction list"));
            me.callRecentTransactionList();
            Ext.get("titlerecent").show();
        }
    },
    newSetting: function(meta, value, record, type) {
        var cssClass = N2NCSS.CellDefault;
        if (type == "stockName") {
            //cssClass += " " + N2NCSS.FontString;
            cssClass += " " + N2NCSS.FontUnChange;

        } else if (type == "number") {
            //   cssClass += " " + N2NCSS.FontString;

            var tempLacp = record.data[fieldLacp];
            if (parseFloat(value) > tempLacp)
                cssClass += " " + N2NCSS.FontUp;

            else if (parseFloat(value) < tempLacp && parseFloat(value) != 0)
                cssClass += " " + N2NCSS.FontDown;

            else
                cssClass += " " + N2NCSS.FontUnChange;
            meta.style += " text-align:center;";
        } else if (type == "buyrate") {
            cssClass += " " + N2NCSS.FontUp;
            meta.style += "text-align:center; padding-top: 12px;";
        } else {
            cssClass += " " + N2NCSS.FontDown;
            meta.style += "text-align:center; padding-top: 12px;";
        }

        meta.css = cssClass;
    },
    currencyTable: function() {
        var me = this;
        var tempStorage = Ext.create('Ext.data.Store', {
            model: "TCPlus.model.ExchangeRate"
        });

        me.currencyTb = new Ext.grid.Panel({
            store: tempStorage,
            width: 700,
            maxHeight: 175, // adjusted to fit max 3 records
            cls: "exchangeRate",
            enableHdMenu: false,
            id: "exchangerate",
            autoScroll: true,
            border: true,
            enableColumnResize: false,
            enableColumnMove: false,
            forceFit: true,
            viewConfig: {
                stripeRows: true,
                trackMouseOver: false,
                columnLines: true
            },
            columns: [
                {
                    header: languageFormat.getLanguage(21258, 'Currency From'),
                    menuDisabled: true,
                    dataIndex: fieldStkName,
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        me.newSetting(meta, value, record, 'stockName');
                        var itemAdd = "";
                        var item = "";
                        var index = value.lastIndexOf('.');
                        if (index != -1) {
                            value = value.substring(0, index);
                        }
                        value = formatutils.procStringValue(value);
                        value = value.split("/")[0];
                        item = value;
                        itemAdd = me.getFlag(value)[1];
                        value = "<div style='float:left;'>" + me.getFlag(value) [0] + "</div><div style='float:left;padding-top:10px;'>" + value + "</div>";
                        me.arrCurr.push([item, itemAdd]);
                        return value;
                    }

                },
                {
                    header: languageFormat.getLanguage(21259, 'Currency To'),
                    dataIndex: fieldStkName,
                    menuDisabled: true,
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        me.newSetting(meta, value, record, 'stockName');
                        var itemAdd = "";
                        var item = "";
                        var index = value.lastIndexOf('.');
                        if (index != -1) {
                            value = value.substring(0, index);
                        }
                        value = formatutils.procStringValue(value);
                        value = value.split("/")[1];
                        item = value;
                        itemAdd = me.getFlag(value)[1];
                        value = "<div style='float:left;'>" + me.getFlag(value)[0] + "</div><div style='float:left;padding-top:10px;'>" + value + "</div>";
                        me.arrCurr.push([item, itemAdd]);
                        return value;
                    }

                },
                {
                    header: languageFormat.getLanguage(21260, 'Buy Rate'),
                    dataIndex: fieldBuy,
                    menuDisabled: true,
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        me.newSetting(meta, value, record, 'buyrate');
                        return formatutils.procPriceValue(value).value;
                    }
                },
                {
                    header: languageFormat.getLanguage(21261, 'Sell Rate'),
                    dataIndex: fieldSell,
                    menuDisabled: true,
                    renderer: function(value, meta, record, rowindex, columnIndex, store, view) {
                        me.newSetting(meta, value, record, 'sellrate');
                        return formatutils.procPriceValue(value).value;
                    }
                },
                {
                    header: languageFormat.getLanguage(21262, 'Available Cash Balance (CUT)'),
                    dataIndex: "cut",
                    menuDisabled: true,
                    width: 200,
                    renderer: function(value, meta, record, rowindex, columnIndex, store, view) {
                        meta.style += " text-align: right;padding-top: 12px;";
                        return value;
                    }
                }
            ],
            listeners: {
                afterrender: function(thisComp) {
                    me.callCurrencyTable();
                },
                rowdblclick: function(thisComp, rec) {
                    me.recCurrencyTb = rec;
                    me.openFXConversion();
                }
            }
        });

        return me.currencyTb;
    },
    openFXConversion: function() {
        var me = this;
        var rec = me.recCurrencyTb;
        var stockcode = stockutil.getStockPart(rec.get(fieldStkCode)).split("/");
        if (global_s2FARequire == 'true' && global_s2FABypass == 'YES' && global_s2FADeviceList.length == 0 || global_s2FABypass == 'ALL') {
            if (!N2N1FA.return1FAValidation('openFXConversion')) {
                return;
            }
        } else {
            if (!N2N2FA.return2FAValidate('openFXConversion')) {
                return;
            }
        }

        if (me.winFXConversion == null) {
            me.getFXConversion(rec);
            me.lastKeyin = me.noRoundCurr1;
            me.lastAct = "SELL";
            me.lastFXMCurr = me.comboCurr1.getValue();
        } else {
            me.winFXConversion.toFront();
            me.fxrate = parseFloat(rec.get(fieldBuy));
            me.noRoundCurr1 = 1.00;
            me.noRoundCurr2 = me.fxrate;

            me.textCurr2.setValue(me.roundingFunc(me.fxrate, 1));
            me.textCurr1.setValue("1.00");
            me.comboCurr1.setValue(stockcode[0]);
            me.comboCurr2.setValue(stockcode[1]);

            me.setIconCombo(me.comboCurr1, stockcode[0]);
            me.setIconCombo(me.comboCurr2, stockcode[1]);
            me.labelCurr1.setText(stockcode[0]);
            me.labelCurr2.setText(stockcode[1]);
            me.setEventTextCurr("default");
        }
    },
    callCurrencyTable: function() {
        var me = this;
        try {
            me.setLoading(languageFormat.getLanguage(10017, 'Loading...'));

            var sortReq = {
                ex: 'FXM',
                mkt: '10',
                f: me.getFields(),
                p: '0',
                c: '1000',
                success: function(response) {
                    var obj = response;
                    if (obj.s && obj.d && obj.d.length > 0) {
                        var fxName = localCurr + "/" + localCurr + ".FXM";
                        obj.d.push({
                            33: fxName,
                            38: fxName,
                            68: "1.000000",
                            88: "1.000000",
                            44: "0000",
                            130: fxName // needed as other language will use this field
                        });
                        me.currencyTb.getStore().loadData(obj.d);
                        me.callCUT();
                        var rec = {};
                        if (obj.d.length > 3) {
                            me.currencyTb.getView().scrollOffset = me.scrollBarWidth;
                            me.currencyTb.getView().refresh();
                        }
                        for (var i = 0; i < me.currencyTb.getStore().getCount(); i++) {
                            rec = me.currencyTb.getStore().getAt(i);
                            me.stkcodes.push(rec.get(fieldStkCode));
                        }

                        Storage.generateUnsubscriptionByExtComp(me);
                        Storage.generateSubscriptionByList(me.stkcodes, me);
                    } else {
                        helper.setGridEmptyText(me.currencyTb, languageFormat.getLanguage(21263, 'No Data'));
                    }

                    me.labelEffDateTime.setValue(Ext.Date.format(new Date(), me.formatDateTime));

                    me.setLoading(false);
                },
                failure: function() {
                    me.setLoading(false);
                    console.log('Unable to load FXM');
                }
            };

            conn.getStockList(sortReq);
        } catch (e) {
            me.setLoading(false);
        }
    },
    callCUT: function() {
        var me = this;
        var accCombo = me._getAccountName();
        if (accCombo.length === 0) {
            return;
        }

        var urlbuf = [];
        urlbuf.push(addPath + 'tcplus/CUTCashBalance');
        urlbuf.push('?ac=' + accCombo[0]);
        urlbuf.push('&bc=' + accCombo[1]);
        urlbuf.push("&paymentCode=CUT");
        urlbuf.push("&isZero=Yes"); //No : show -ve value, Yes : map -ve value to zero

        var url = urlbuf.join('');

        Ext.Ajax.request({
            url: url,
            success: function(response) {
                var obj = Ext.decode(response.responseText);
                if (obj != null) {
                    if (obj.s) {
                        var cm = helper.getGridColumns(me.currencyTb);
                        var columnIndex = helper.getColumnIndex(cm, 'dataIndex', "cut");
                        for (var i = 0; i < obj.d.length; i++) {
                            var rec = {};
                            var rowIndex = -1;
                            if (obj.d[i]["60"] != localCurr) {
                                rowIndex = me.currencyTb.store.find(fieldStkCode, obj.d[i]["60"], 0, true);
                            } else {
                                rowIndex = me.currencyTb.store.find(fieldStkCode, localCurr + "/" + localCurr, 0, true);
                            }
                            if (rowIndex != -1) {
                                rec = me.currencyTb.getStore().getAt(rowIndex);
                                N2NUtil.updateCell(me.currencyTb, rowIndex, columnIndex, obj.d[i]["60"] + " " + Ext.util.Format.number(obj.d[i]["57"], "0,000.00"));
                                rec.data["cut"] = obj.d[i]["57"];
                            }
                            if ((obj.d[i]["60"]).indexOf("Est. Total (SGD)") != -1) {
                                Ext.get("lbEs").update(Ext.util.Format.number(obj.d[i]["57"], "0,000.00"));
                            }
                        }
                    }
                }
            }
        });
    },
    getFields: function() {
        var fields = [
            fieldStkCode,
            fieldStkName,
            fieldLacp,
            fieldHigh,
            fieldLow,
            fieldLast,
            fieldVol,
            fieldBqty,
            fieldSqty,
            fieldPrev,
            fieldBuy,
            fieldSell,
            fieldLotSize
        ];

        return fields;
    },
    loadAccList: function() {
        var global_AccountSeparator = '~';
        var accList = accRet.ai;
        var me = this;
        me.arAccList = new Array();
        if (accList && accList.length > 0) {
            for (var i = 0; i < accList.length; i++) {
                var acc = accList[i];
                if (acc.ac && acc.cc) {
                    me.arAccList.push([acc.ac + global_AccountSeparator + acc.bc, acc.ac + ' - ' + acc.an + ' - ' + acc.bc]);
                }
            }

        }

    },
    getFlag: function(val) {
        var imgAdr = "";
        var img = '';

        if (val) {
            imgAdr = 'fx-flag icon-fx-flag-' + String(val).toLowerCase();
            img = '<div style="margin-right: 5px" class="' + imgAdr + '"></div>';
        }

        return [img, imgAdr];
    },
    getTransactionList: function() {
        var me = this;

        var tempStorage = new Ext.data.Store({
            fields: ['51', '52', '53', '54', '55', '56', '57', '58', '59', '62'],
            sorters: [{
                    property: "51",
                    direction: 'DESC'
                }
            ]
        });

        me.transactionlist = new Ext.grid.Panel({
            store: tempStorage,
            maxHeight: 155,
            width: '100%',
            cls: "exchangeRate",
            enableColumnResize: true,
            hidden: true,
            viewConfig: {
                stripeRows: true,
                trackMouseOver: false,
                columnLines: true
            },
            columns: [
                {
                    header: languageFormat.getLanguage(10927, 'Date'),
                    menuDisabled: true,
                    dataIndex: '51',
                    width: 155,
                    renderer: function(value, meta) {
                        var tempDate = me.formateDateTimeFxTrans(value);
                        meta.tdAttr = "data-qtip='" + tempDate + "'";
                        return tempDate;
                    }
                },
                {
                    header: languageFormat.getLanguage(21264, 'Request ID'),
                    width: 255,
                    menuDisabled: true,
                    dataIndex: '62',
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        meta.tdAttr = "data-qtip='" + value + "'";
                        return value;
                    }
                },
                {
                    header: languageFormat.getLanguage(21265, 'Channel'),
                    width: 75,
                    dataIndex: '59',
                    menuDisabled: true,
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        meta.tdAttr = "data-qtip='" + ordLogToolTip + "'";
                        return value;
                    }
                },
                {
                    header: languageFormat.getLanguage(21266, 'From Currency'),
                    width: 110,
                    dataIndex: '52',
                    menuDisabled: true,
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        meta.tdAttr = "data-qtip='" + value + "'";
                        return value;
                    }
                }
                , {
                    header: languageFormat.getLanguage(21267, 'To Currency'),
                    width: 110,
                    dataIndex: '53',
                    menuDisabled: true,
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        var tempValue = formatutils.procPriceValue(value).value;
                        meta.tdAttr = "data-qtip='" + tempValue + "'";
                        return tempValue;
                    }
                },
                {
                    header: languageFormat.getLanguage(21268, 'Amount Converted'),
                    dataIndex: '54',
                    align: 'right',
                    menuDisabled: true,
                    width: 140,
                    renderer: function(value, meta, record, rowindex, columnIndex, store, view) {
                        value = parseFloat(value).toFixed(2);
                        var tempValue = formatutils.procPriceValue(value).value;
                        tempValue = Ext.util.Format.number(tempValue, '0,000.00');
                        meta.tdAttr = "data-qtip='" + tempValue + "'";
                        return tempValue;
                    }
                },
                {
                    header: languageFormat.getLanguage(21269, 'Rate'),
                    dataIndex: '55',
                    align: 'right',
                    width: 95,
                    menuDisabled: true,
                    renderer: function(value, meta, record, rowindex, columnIndex, store, view) {
                        meta.tdAttr = "data-qtip='" + value + "'";
                        return value;
                    }
                }, {
                    header: languageFormat.getLanguage(21270, 'Amount Received'),
                    dataIndex: '56',
                    align: 'right',
                    menuDisabled: true,
                    width: 115,
                    renderer: function(value, meta, record, rowindex, columnIndex, store, view) {
                        value = parseFloat(value).toFixed(2);
                        var tempValue = formatutils.procPriceValue(value).value;
                        tempValue = Ext.util.Format.number(tempValue, '0,000.00');
                        meta.tdAttr = "data-qtip='" + tempValue + "'";
                        return tempValue;
                    }
                },
                {
                    header: languageFormat.getLanguage(10906, 'Status'),
                    width: 65,
                    dataIndex: '57',
                    menuDisabled: true,
                    renderer: function(value, meta, record, rowindex, columnIndex, store, view) {
                        meta.tdAttr = "data-qtip='" + value + "'";
                        return value;
                    }
                },
                {
                    header: languageFormat.getLanguage(10133, 'Remark'),
                    dataIndex: '58',
                    menuDisabled: true,
                    width: 260,
                    renderer: function(value, meta, record, rowindex, columnIndex, store, view) {
                        meta.tdAttr = "data-qtip='" + value + "'";
                        return value;
                    }
                }
            ]
        });

        return me.transactionlist;
    },
    callTransactionList: function() {
        var me = this;

        me.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
        
        var accCombo = me._getAccountName();

        if (accCombo.length === 0) {
            return;
        }
        
        var urlbuf = [];
        var fromDate = me.dateFromTrans.getRawValue();
        var toDate = me.dateToTrans.getRawValue();

        urlbuf.push(addPath + 'tcplus/getFXTrxList');
        urlbuf.push('?ac=' + accCombo[0]);
        urlbuf.push('&bc=' + accCombo[1]);
        urlbuf.push("&startDate=" + me.formatDate(fromDate));
        urlbuf.push("&endDate=" + me.formatDate(toDate));
        urlbuf.push("&FXTrxListType=0"); // 0 - historical, 1 - recent
        var url = urlbuf.join('');

        Ext.Ajax.request({
            url: url,
            success: function(response) {
                var obj = Ext.decode(response.responseText);
                if (obj.s) {
                    if (obj.d.length > 0) {
                        me.transactionlist.getStore().loadData(obj.d);
                    } else {
                        helper.setGridEmptyText(me.transactionlist, languageFormat.getLanguage(21263, 'No Data'));
                    }
                } else {
                    console.log(obj);
                }
                me.setLoading(false);
            }
        });
    },
    getFXConversion: function(rec) {
        var me = this;
        var stockName = stockutil.getStockPart(rec.get(fieldStkName)).split("/");
        me.fxrate = parseFloat(rec.get(fieldBuy));
        me.noRoundCurr1 = 1.00;
        me.noRoundCurr2 = me.fxrate;
        me.textCurr1 = new Ext.form.NumberField({
            value: parseFloat(1).toFixed(2),
            allowDecimals: true,
            style: "text-align:right;padding-right:5px;",
            enableKeyEvents: true,
            id: "textcurr1",
            columnWidth: 0.795,
            allowBlank: false,
            blankText: languageFormat.getLanguage(31331, 'This field is required'),
            decimalPrecision: 2,
            minValue: 1,
            minText: languageFormat.getLanguage(31330, 'The minimum value for this field is {0}'),
            hideTrigger: true,
            listeners: {
                keyup: function(thisComp, newv, oldv) {
                    /*
                    if (newv != oldv) {
                        var value = 0;
                        me.noRoundCurr1 = thisComp.getValue();
                        if (me.fxrate != 0) {
                            value = parseFloat(me.noRoundCurr1 * me.fxrate);
                        } else {
                            value = 0;
                        }
                        // me.noRoundCurr2 = value;
                        // me.setFieldValue(me.textCurr2, me.roundingFunc(value, 1));

                        me.lastKeyin = me.noRoundCurr1;
                    
                    */
                   me.setValueFXConversion();
                }
            }
        });
        me.labelCurr1 = new Ext.form.Label({
            text: stockName[0],
            style: "display: inline-block;text-align: center;background-color: #fff;padding-top:3px;font-weight: bold;color: #000;",
            width: 36,
            columnWidth: 0.2
        });
        me.labelCurr2 = new Ext.form.Label({
            text: stockName[1],
            style: "display: inline-block; text-align: center;background-color: #fff;font-weight: bold;padding-top:3px;color: #000;",
            width: 36,
            columnWidth: 0.2
        });

        me.textCurr2 = new Ext.form.NumberField({
            value: me.roundingFunc(me.fxrate, 1),
            allowDecimals: true,
            style: "text-align:right;padding-right:5px;",
            enableKeyEvents: true,
            id: "textcurr2",
            columnWidth: 0.795,
            allowBlank: false,
            blankText: languageFormat.getLanguage(31331, 'This field is required'),
            decimalPrecision: 2,
            hideTrigger: true,
            minValue: 1,
            minText: languageFormat.getLanguage(31330, 'The minimum value for this field is {0}'),
            listeners: {
                keyup: function(thisComp, newv, oldv) {
                    /*
                    if (newv != oldv) {
                        var value = 0;
                        me.noRoundCurr2 = thisComp.getValue();
                        if (me.fxrate != 0) {
                            value = parseFloat(me.noRoundCurr2 / me.fxrate);
                        } else {
                            value = 0;
                        }
                        //me.noRoundCurr1 = value;
                        //me.setFieldValue(me.textCurr1, me.roundingFunc(value, 1));
                        me.setFieldValue(me.textCurr1, me.roundingFunc(value, 1));
                        me.lastKeyin = me.noRoundCurr2;
                        me.lastAct = "BUY";
                        me.lastFXMCurr = me.comboCurr2.getValue();
                    }
                    */
                   me.setValueFXConversion();
                }
            }
        });
        me.comboCurr1 = new Ext.form.ComboBox({
            fieldLabel: languageFormat.getLanguage(21253, 'Convert From'),
            fieldCls: 'fx-cb',
            store: new Ext.data.ArrayStore({
                fields: ["value", "address"],
                data: me.arrCurr,
                listeners: {
                    load: function(store) {
                        var hits = {};
                        store.filterBy(function(record) {
                            var name = record.get('value');
                            if (hits[name]) {
                                return false;
                            } else {
                                hits[name] = true;
                                return true;
                            }
                        });

                        // delete the filtered out records
                        delete store.snapshot;

                    }
                }
            }),
            triggerAction: 'all',
            tpl: '<tpl for="."><li class="x-boundlist-item"><div style="float:left;"><div class="{address}"></div></div><div style="float:left;padding-top:5px;">&nbsp;&nbsp;{value}</div><li><div style="clear:both;"></div></tpl>',
            mode: 'local',
            editable: false,
            displayField: "value",
            width: "100%",
            labelAlign: 'top',
            valueField: "value",
            anchor: '99%',
            style: "padding-left:0px;",
            labelStyle: "font-weight: bold;",
            value: stockName[0],
            listeners: {
                afterrender: function(comp) {
                    me.setIconCombo(comp, comp.getValue());
                },
                select: function(thisComp, record) {
                    var val = record[0].get("value");
                    me.setIconCombo(thisComp, val);
                    me.setValueFXConversion();
                }
            }
        });

        me.comboCurr2 = new Ext.form.ComboBox({
            fieldLabel: languageFormat.getLanguage(21254, 'Convert To'),
            fieldCls: 'fx-cb',
            store: new Ext.data.ArrayStore({
                fields: ["value", "address"],
                data: me.arrCurr,
                listeners: {
                    load: function(store) {
                        var hits = {};
                        store.filterBy(function(record) {
                            var name = record.get('value');
                            if (hits[name]) {
                                return false;
                            } else {
                                hits[name] = true;
                                return true;
                            }
                        });

                        // delete the filtered out records
                        delete store.snapshot;

                    }
                }
            }),
            displayField: "value",
            valueField: "value",
            tpl: '<tpl for="."><li class="x-boundlist-item"><div style="float:left;"><div class="{address}"></div></div><div style="float:left;padding-top:5px;">&nbsp;&nbsp;{value}</div></li><div style="clear:both;"></div></tpl>',
            triggerAction: 'all',
            mode: 'local',
            editable: false,
            labelAlign: 'top',
            anchor: '99%',
            style: "padding-left:0px;",
            labelStyle: "font-weight: bold;",
            width: "100%",
            value: stockName[1],
            listeners: {
                afterrender: function(comp) {
                    me.setIconCombo(comp, comp.getValue());
                },
                select: function(thisComp, record) {
                    var val = record[0].get("value");

                    me.setIconCombo(thisComp, val);
                    me.setValueFXConversion();
                }
            }
        });
        me.winFXConversion = new Ext.Window({
            title: "<div class='fx-logo'></div>",
            width: 420,
            cls: "fxconversion",
            plain: true,
            layout: 'fit',
            resizable: false,
            constrain: true,
            constrainTo: me.getEl(),
            bodyStyle: "background:transparent",
            border: false,
            items: [{
                    border: false,
                    xtype: "form",
                    height: "100%",
                    labelAlign: 'top',
                    items: [{
                            layout: "column",
                            width: "100%",
                            border: false,
                            bodyStyle: 'padding:10px;',
                            items: [{
                                    border: false,
                                    columnWidth: 0.45,
                                    items: [me.comboCurr1, {
                                            border: false,
                                            bodyStyle: "padding-bottom: 5px;padding-top:10px;",
                                            html: "<div style:'clear:both;padding-top:20px;'>" + languageFormat.getLanguage(21273, 'Amount') + "<span style='color:#50A566;'> (" + languageFormat.getLanguage(21271, 'I have') + ")</span></div>"
                                        }, {
                                            layout: "column",
                                            border: true,
                                            height: 20,
                                            items: [
                                                me.labelCurr1,
                                                me.textCurr1
                                            ]
                                        }]
                                }, {
                                    border: false,
                                    columnWidth: 0.1,
                                    items: [{
                                            border: false,
                                            xtype: "container",
                                            style: "text-align:center;padding-top: 50px;cursor:pointer;",
                                            html: '<div id="interchange"><div class="fx-flip" style="margin-left:10px"></div></div>',
                                            listeners: {
                                                afterrender: function() {
                                                    Ext.get("interchange").addListener("click", function() {
                                                        var newCombo2Value = me.comboCurr1.getValue();
                                                        var newCombo1Value = me.comboCurr2.getValue();
                                                        me.comboCurr1.setValue(newCombo1Value);
                                                        me.comboCurr2.setValue(newCombo2Value);
                                                        me.setIconCombo(me.comboCurr1, newCombo1Value);
                                                        me.setIconCombo(me.comboCurr2, newCombo2Value);
                                                        me.setValueFXConversion();
                                                    });
                                                }
                                            }
                                        }]

                                }, {
                                    border: false,
                                    columnWidth: 0.45,
                                    items: [me.comboCurr2, {
                                            border: false,
                                            bodyStyle: "padding-bottom: 5px;padding-top: 10px;",
                                            html: "<div style:'clear:both;padding-top:20px;'>" + languageFormat.getLanguage(21273, 'Amount') + "<span style='color:#E7545A;'> (" + languageFormat.getLanguage(21272, 'I want') + ")</span></div>"
                                        }, {
                                            layout: "column",
                                            border: true,
                                            height: 20,
                                            items: [
                                                me.labelCurr2,
                                                me.textCurr2
                                            ]
                                        }]
                                }, {
                                    border: false,
                                    columnWidth: 1,
                                    align: "right",
                                    layout: 'column',
                                    style: 'padding-top: 30px;text-align:right;',
                                    items: [
                                        {
                                            columnWidth: 0.7,
                                            html: "<div>&nbsp;&nbsp;</div>",
                                            border: false
                                        },
                                        {
                                            columnWidth: 0.15,
                                            xtype: "button",
                                            text: languageFormat.getLanguage(21274, 'Convert'),
                                            cls: 'fix_btn',
                                            style: "padding-right: 2px;",
                                            handler: function() {
                                                var textCurr1 = me.textCurr1.getValue();
                                                var textCurr2 = me.textCurr2.getValue();
                                                var mergeValue1 = me.comboCurr1.getValue() + "/" + me.comboCurr2.getValue();
                                                var mergeValue2 = me.comboCurr2.getValue() + "/" + me.comboCurr1.getValue();
                                                var searchRecord1 = me.searchRecord(mergeValue1);
                                                var searchRecord2 = me.searchRecord(mergeValue2);

                                                if (me.comboCurr1.getValue() == me.comboCurr2.getValue()) {
                                                    msgutil.alert(languageFormat.getLanguage(31203, "Both currencies cannot be the same"), null, global_popUpMsgTitle);
                                                } else if (searchRecord1 == "" && searchRecord2 == "") {
                                                    msgutil.alert(languageFormat.getLanguage(31204, "No FX Rate available to do this conversion"), null, global_popUpMsgTitle);
                                                } else if (textCurr1 < 1 || textCurr2 < 1) {
                                                    msgutil.alert(languageFormat.getLanguage(31205, "Amount entered for conversion is less than the minimum amount allowed for FX conversion. Please revise and try again."), null, global_popUpMsgTitle);
                                                } else if (textCurr1 > 1000000 || textCurr2 > 1000000) {
                                                    msgutil.alert(languageFormat.getLanguage(31206, "Amount entered for conversion is more than the maximum amount allowed for FX conversion. Please revise and try again."), null, global_popUpMsgTitle);
                                                } else if (textCurr1 == "" || textCurr2 == "") {
                                                    msgutil.alert(languageFormat.getLanguage(31207, "Please enter the amount for conversion."), null, global_popUpMsgTitle);
                                                } else {
                                                    me.confirmation();
                                                }
                                            }
                                        }, {
                                            columnWidth: 0.15,
                                            xtype: "button",
                                            cls: 'fix_btn',
                                            text: languageFormat.getLanguage(10010, 'Cancel'),
                                            style: "padding-left: 2px; margin-left: 5px",
                                            handler: function() {
                                                me.winFXConversion.close();
                                            }
                                        }]
                                }, {
                                    columnWidth: 1,
                                    border: false,
                                    preventBodyReset: true,
                                    html: "<div style='padding-top: 30px;font-size: 0.9em;'>" +
                                            "Note:<ul><li>"
                                            + languageFormat.getLanguage(31208, 'Coversion value shown above is indicative. It may slightly vary due to change in Fx rate while processing the request.')
                                            + "</li>"
                                            + "<li>"
                                            + languageFormat.getLanguage(31209, "Please contact our Customer Service Representatives at 1800 538 9889 or +65 6538 9889 (overseas) between 8:00 AM to 6:00 PM (Monday - Friday excluding Public Holidays) to find out more on FX conversion.")
                                            + "</li></ul></div>"
                                }]
                        }]
                }],
            listeners: {
                close: function() {
                    me.lastFocusText = null;
                    me.winFXConversion = null;
                },
                afterrender: function(thisComp) {
                }
            }
        }).show();
        if (me.fxrate != 0) {
            me.setValueFXConversion();
        }
    },
    idleOrderPad: function() {
        var me = this;
        if (me.winFXConversion != null) {
            Ext.Msg.show({
                title: global_popUpMsgTitle,
                msg: languageFormat.getLanguage(31210, 'There is a change in Exchange rates. Please resubmit your request.'),
                buttons: Ext.Msg.OK,
                icon: Ext.Msg.INFO,
                closable: false,
                fn: function(btn) {
                    if (btn === 'ok') {
                        me.setValueFXConversion(true);
                        this.close();
                        if (me.winCon) {
                            me.winCon.close();
                        }
                    }
                }
            });
        }
    },
    callAccBal: function() {
        var me = this;

        console.log('[derivativePrtfPanel][_procCallAccBalance] start *** ');

        try {
            var accountName = me._getAccountName();
            if (accountName.length === 0) {
                return;
            }

            var url = addPath + 'tcplus/atp/acc?';
            url += 's=' + new Date().getTime();


            if (accountName.length > 0) {
                url += '&ac=' + accountName[0].trim();
                url += '&bc=' + accountName[accountName.length - 1].trim();
            }

            Ext.Ajax.request({
                url: url,
                method: 'POST',
                timeout: 60000,
                success: function(response) {
                    var obj = null;
                    try {
                        obj = Ext.decode(response.responseText);

                        if (obj) {
                            if (obj.s) {
                                me.accBal = obj.ai[0].al;
                            }
                        }

                        console.log('[exchangeRate][callAccBal] success *** ');
                    } catch (e) {
                        console.log('[exchangeRate][callAccBal][inner] Exception ---> ' + e);
                    }
                },
                failure: function(response) {
                    console.log('[exchangeRate][callAccBal][inner][inner] failure ---> ' + e);
                }
            });

        } catch (e) {
            console.log('[exchangeRate][callAccBal] Exception ---> ' + e);
        }

    },
    setValueFXConversion: function(update) {
        try {
            var me = this, mergeValue, searchRecord, rateField;
            var comboCurr1 = me.comboCurr1.getValue(), comboCurr2 = me.comboCurr2.getValue();
            mergeValue = comboCurr1 + "/" + comboCurr2;
            searchRecord = me.searchRecord(mergeValue);
            if (searchRecord != "") {
                var tempValue1 = 0;
                var tempValue2 = 0;
                me.recCurrencyTb = searchRecord;
                rateField = fieldBuy;
                me.fxrate = parseFloat(searchRecord.get(rateField));
                if (update) {

                    if (me.lastKeyin == me.noRoundCurr1) {
                        //me.textCurr1.setValue(me.noRoundCurr1);
                        //me.textCurr2.setValue(me.roundingFunc(me.fxrate * me.noRoundCurr1, 1));
                        tempValue1 = me.noRoundCurr1;
                        tempValue2 = me.roundingFunc(me.fxrate * me.noRoundCurr1, 1);
                        me.noRoundCurr2 = me.fxrate * me.noRoundCurr1;
                    } else if (me.lastKeyin == me.noRoundCurr2) {
                        //me.textCurr2.setValue(me.noRoundCurr2);
                        //me.textCurr1.setValue(me.roundingFunc(me.noRoundCurr2 / me.fxrate, 1));
                        tempValue1 = me.roundingFunc(me.noRoundCurr2 / me.fxrate, 1);
                        tempValue2 = me.noRoundCurr2;
                        me.noRoundCurr1 = me.noRoundCurr2 / me.fxrate;
                    }

                } else if (me.lastKeyin == me.noRoundCurr1) {
                    //me.textCurr1.setValue(me.noRoundCurr1);
                    //me.textCurr2.setValue(me.roundingFunc(me.noRoundCurr1 * me.fxrate, 1));
                    tempValue1 = me.noRoundCurr1;
                    tempValue2 = me.roundingFunc(me.noRoundCurr1 * me.fxrate, 1);
                    me.noRoundCurr2 = me.noRoundCurr1 * me.fxrate;
                    me.lastKeyin = me.noRoundCurr1;
                } else if (me.lastKeyin == me.noRoundCurr2) {
                    //me.textCurr2.setValue(me.noRoundCurr2);
                    //me.textCurr1.setValue(me.roundingFunc(me.noRoundCurr2 / me.fxrate, 1));
                    tempValue1 = me.roundingFunc(me.noRoundCurr2 / me.fxrate, 1);
                    tempValue2 = me.noRoundCurr2;
                    me.noRoundCurr1 = me.noRoundCurr2 / me.fxrate;
                    me.lastKeyin = me.noRoundCurr2;
                } else {
                    //me.textCurr1.setValue(1);
                    me.noRoundCurr1 = 1;
                    //me.textCurr2.setValue(me.roundingFunc(me.fxrate, 1));
                    tempValue1 = 1;
                    tempValue2 = me.roundingFunc(me.fxrate, 1);
                    me.noRoundCurr2 = me.fxrate;
                    me.lastKeyin = me.noRoundCurr1;
                }
                me.setEventTextCurr("default");
                //me.setFieldValue(me.textCurr1, tempValue1);	//still need to set the text
                //me.setFieldValue(me.textCurr2, tempValue2);
            } else {
                mergeValue = comboCurr2 + "/" + comboCurr1;
                searchRecord = me.searchRecord(mergeValue);
                var tempValue1 = 0;
                var tempValue2 = 0;
                if (searchRecord != "") {
                    me.recCurrencyTb = searchRecord;
                    rateField = fieldSell;
                    me.fxrate = parseFloat(searchRecord.get(rateField));
                    if (update) {

                        if (me.lastKeyin == me.noRoundCurr2) {
                            //me.textCurr2.setValue(me.noRoundCurr2);
                            //me.textCurr1.setValue(me.roundingFunc(me.fxrate * me.noRoundCurr2, 1));
                            tempValue1 = me.roundingFunc(me.fxrate * me.noRoundCurr2, 1);
                            tempValue2 = me.noRoundCurr2;
                            me.noRoundCurr1 = me.fxrate * me.noRoundCurr2;
                        } else if (me.lastKeyin == me.noRoundCurr1) {
                            //me.textCurr1.setValue(me.noRoundCurr1);
                            //me.textCurr2.setValue(me.noRoundCurr1 / me.fxrate);
                            tempValue1 = me.noRoundCurr1;
                            tempValue2 = me.noRoundCurr1 / me.fxrate;
                            me.noRoundCurr2 = me.noRoundCurr1 / me.fxrate;
                        }
                    } else if (me.lastKeyin == me.noRoundCurr1) {
                        // me.textCurr1.setValue(me.noRoundCurr1);
                        //me.textCurr2.setValue(me.roundingFunc(me.noRoundCurr1 / me.fxrate, 1));
                        tempValue1 = me.noRoundCurr1;
                        tempValue2 = me.roundingFunc(me.noRoundCurr1 / me.fxrate, 1);
                        me.noRoundCurr2 = me.noRoundCurr1 / me.fxrate;
                        me.lastKeyin = me.noRoundCurr1;
                    } else if (me.lastKeyin == me.noRoundCurr2) {
                        //me.textCurr2.setValue(me.noRoundCurr2);
                        //me.textCurr1.setValue(me.roundingFunc(me.noRoundCurr2 * me.fxrate, 1));
                        tempValue1 = me.roundingFunc(me.noRoundCurr2 * me.fxrate, 1);
                        tempValue2 = me.noRoundCurr2;
                        me.noRoundCurr1 = me.noRoundCurr2 * me.fxrate;
                        me.lastKeyin = me.noRoundCurr2;
                    } else {
                        // me.textCurr2.setValue(1);
                        me.noRoundCurr2 = 1;
                        //me.textCurr1.setValue(me.roundingFunc(me.fxrate, 1));
                        tempValue1 = me.roundingFunc(me.fxrate, 1);
                        tempValue2 = 1;
                        me.noRoundCurr1 = me.fxrate;
                        me.lastKeyin = me.noRoundCurr2;
                    }
                    me.setEventTextCurr("notdefault");
                } else {
                    if (comboCurr1 == comboCurr2) {
                        //me.textCurr1.setValue("1.00");                         //me.textCurr2.setValue("1.00");
                        tempValue1 = 1.00;
                        tempValue2 = 1.00;
                        me.fxrate = 1;

                    } else {
                        //me.textCurr1.setValue("0.00");
                        //me.textCurr2.setValue("0.00");
                        tempValue1 = 1.00;
                        tempValue2 = 1.00;
                        me.fxrate = 0;
                    }
                }
                me.setFieldValue(me.textCurr1, tempValue1);
                me.setFieldValue(me.textCurr2, tempValue2);
            }
            me.labelCurr1.setText(me.comboCurr1.getValue());
            me.labelCurr2.setText(me.comboCurr2.getValue());
        } catch (e) {
            console.log('[exchangeRate][setValueFXConversion] Exception ---> ' + e);
        }
    },
    submit: function() {
        try {
            if (global_s2FARequire == 'true' && global_s2FABypass == 'YES' && global_s2FADeviceList.length == 0 || global_s2FABypass == 'ALL') {
                if (!N2N1FA.return1FAValidation('submitOrderFX')) {
                    return;
                }
            } else {
                if (!N2N2FA.return2FAValidate('submitOrderFX')) {
                    return;
                }
            }
            var me = this;
            me.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
            var params = {}, action, stockcode, lastFocus;
            var acc = me._getAccountName();
            if (acc.length === 0) {
                return;
            }
            
            var accraw = me.comboAcc.getRawValue();
            var combo1 = me.comboCurr1.getValue();
            var combo2 = me.comboCurr2.getValue();
            var quantity = me.roundingFunc(me.lastKeyin, 1);//me.roundingFunc(me.noRoundCurr2, 1);
            var rec = me.searchRecord(combo1 + "/" + combo2);
            if (me.lastKeyin == me.noRoundCurr1) {
                me.lastAct = "SELL";
                me.lastFXMCurr = me.comboCurr1.getValue();
            } else if (me.lastKeyin == me.noRoundCurr2) {
                me.lastAct = "BUY";
                me.lastFXMCurr = me.comboCurr2.getValue();
            }
            var fxmCurr = me.lastFXMCurr;
            if (rec != "") {
                stockcode = rec.get(fieldStkCode);
            } else {
                rec = me.searchRecord(combo2 + "/" + combo1);
                if (rec != "") {
                    stockcode = rec.get(fieldStkCode);
                } else {
                    msgutil.alert(languageFormat.getLanguage(31211, "Stock Name is invalid"), null, "Error");
                    return;
                }
            }
            action = me.lastAct; //"BUY";
            var accList = accRet.ai;
            var cc = "";
            for (var i = 0; i < accList.length; i++) {
                if (acc[0] == accList[i].ac && acc[1] == accList[i].bc) {
                    cc = accList[i].cc;
                    break;
                }
            }
            var pin = "123456";
            if (me.checkIsHidePin()) {
                pin = "123456";
            }
            var pin2 = me.encrypt(pin);
            params = {
                ac: acc[0],
                cc: cc,
                branchcode: acc[1],
                stkcode: stockcode,
                accountno: accraw,
                settcurr: combo2,
                ex: "FXM",
                stoplimit: null,
                strategy: null,
                subordno: null,
                tktno: null,
                tpdirection: null,
                price: me.fxrate,
                tptype: null,
                unmtqty: null,
                cbAction: action,
                gtd: null,
                act: action.substring(0, 1),
                lotsize: rec.get(fieldLotSize),
                otype: "Limit",
                validity: "FOK",
                fxmCurr: fxmCurr, //combo2,
                minqty: null,
                mtqty: null,
                ordno: null,
                prevaction: null,
                quantity: quantity,
                payment: "CUT",
                pin2: pin2
            };

            Ext.Ajax.request({
                url: "trade2.jsp",
                method: 'POST',
                params: params,
                success: function(response) {
                    me.setLoading(false);
                    var task = new Ext.util.DelayedTask(function() {
                        me.callRecentTransactionList();
                        me.callCUT();
                    });
                    task.delay(1500);

                    if (response != null || response == "") {
                        var obj = Ext.decode(response.responseText);
                        me.submitResult(obj);
                    }
                },
                failure: function(response) {
                    me.setLoading(false);
                }
            });
        } catch (e) {
            console.log("[ExchangeRate] [submit] exception-->" + e.stack);
        }
    },
    submitResult: function(result) {
        var me = this;

        console.log('[exchangeRate][submitResult] start *** ');

        try {
            var msg = '';

            if (result && result.s && result.s == true) {

                if (result.t == 'trd') {
                    if (result.rmk)
                        msg = result.rmk;

                    else if (result.msg)
                        msg = result.msg;
                    else {
                        msg = languageFormat.getLanguage(31212, 'Your FX conversion request is submitted. Please check FX transaction list for updates');
                        me.winFXConversion.close();
                    }
                } else if (result.t == 'a') {
                    if (result.m) {
                        msg = result.m;
                    } else {
                        msg = Ext.encode(result);
                    }
                    main.connectionManager.notifySession(result);
                } else {
                    msg = Ext.encode(result);
                }
            } else {
                if (result.t == 'trd') {
                    msg = result.msg;
                    if ((result.err && result.err == '502') || (result.err && result.err == '509')) {
                        Ext.Msg.show({
                            title: global_popUpMsgTitle,
                            msg: msg,
                            buttons: Ext.Msg.OKCANCEL,
                            fn: function(btn, text) {
                                if (btn == 'ok') {
                                    me.tktno = result.tktno;
                                    me.submit();
                                }
                            },
                            icon: Ext.Msg.QUESTION
                        });
                        return;
                    } else if ((result.err && result.err == '510')) {
                        //for CIMBSG CUT 'Error 510  50||There is insufficient cash balance to proceed with this order. Please use Cash Top-up service to top-up your Investment Power|InsufficientValue=xxx'
                        var tempMsg = result.msg.split('|');
                        var tempKeyArray;
                        var key = '';

                        if (tempMsg.length > 1) {
                            tempKeyArray = tempMsg[1].split('=');
                            key = tempKeyArray[1];
                        }
                        msg = msgutil.join( languageFormat.getLanguage(20866, 'Rejected') ,'<br>', tempMsg[0]);

                        Ext.Msg.show({
                            title: global_popUpMsgTitle,
                            msg: tempMsg[0], //result.msg,
                            buttons: Ext.MessageBox.OKCANCEL,
                            buttonText: {ok: languageFormat.getLanguage(20867, 'Top-up'), cancel: languageFormat.getLanguage(10010, 'Cancel')},
                            icon: Ext.Msg.INFO,
                            fn: function(btn, text) {
                                if (btn == 'ok') {
                                    var aesUtil = new AesUtil(256, 100);
                                    key = aesUtil.encrypt("416E737765723838416E737765723838", "5175657374696F6E5175657374696F6E", "#WMS N2N 0108#", key);
                                    var cs = JSChecksum(key);

                                    var params = new Array();
                                    params['v'] = key;
                                    params['cs'] = cs;
                                    params['enc'] = '1'; //0-no encryption, 1-aes(tclite), 2-rsa(tcpro)

                                    //var myRef= window.open(cashTopUpURL + '?key=' + key + '&enc=1','mywindow',"menubar=1,resizable=1,width=865,height=595,scrollbars=yes");
                                    //myRef.focus(); // focus popup.

                                    post_to_url(cashTopUpURL, params, 'post', 'mywindow');
                                }
                            }
                        });
                        return;
                    } else if ((result.err && result.err == '514')) {
                        //for CIMBSG CUT 'Error 510  50||There is insufficient cash balance to proceed with this order. Please use Cash Top-up service to top-up your Investment Power|InsufficientValue=xxx'
                        var tempMsg = result.msg.split('|');
                        var tempKeyArray;
                        var key = '';

                        if (tempMsg.length > 1) {
                            tempKeyArray = tempMsg[1].split('=');
                            key = tempKeyArray[1];
                        }
                        msg = 'Rejected<br>' + tempMsg[0];
                        
                        Ext.Msg.show({
                            title: global_popUpMsgTitle,
                            msg: tempMsg[0], //result.msg,
                            buttons: Ext.MessageBox.OKCANCEL,
                            buttonText: {ok: languageFormat.getLanguage(20867, 'Top-up'), cancel: languageFormat.getLanguage(21277,'Continue')}, 
                            icon: Ext.Msg.INFO,
                            fn: function(btn, text) {
                                if (btn == 'ok') {
                                    var aesUtil = new AesUtil(256, 100);
                                    key = aesUtil.encrypt("416E737765723838416E737765723838", "5175657374696F6E5175657374696F6E", "#WMS N2N 0108#", key);
                                    var cs = JSChecksum(key);

                                    var params = new Array();
                                    params['v'] = key;
                                    params['cs'] = cs;
                                    params['enc'] = '1'; //0-no encryption, 1-aes(tclite), 2-rsa(tcpro)

                                    //var myRef= window.open(cashTopUpURL + '?key=' + key + '&enc=1','mywindow',"menubar=1,resizable=1,width=865,height=595,scrollbars=yes");
                                    //myRef.focus(); // focus popup.

                                    post_to_url(cashTopUpURL, params, 'post', 'mywindow');
                                }
                            }
                        });
                        return;
                    }
                } else if (result.t == 'a') {
                    if (result.m) {
                        msg = result.m;
                    } else {
                        msg = Ext.encode(result);
                    }
                    if (result.e && result.e == '-999') {
                        var ack = '{d:\"e\"}';
                        main.connectionManager.notifySession(ack);
                    }
                } else {
                    if (result.msg) {
                        msg = result.msg;
                    } else if (result.m) {
                        msg = result.m;
                    }
                }
            }
            msgutil.alert(msg, null, global_popUpMsgTitle);
        } catch (e) {
            console.log('[exchangeRate][submitResult] Exception ---> ' + e);
        }
    },
    setIconCombo: function(comp, val) {
        var me = this;
        if (comp.inputEl) {
        	comp.inputEl.removeCls(me.getFlag('sgd')[1]);
            comp.inputEl.addCls(me.getFlag(val)[1]);
        }
    },
    searchRecord: function(value) {
        var me = this, rec = "";
        var store = me.currencyTb.getStore();
        var index = store.find(fieldStkName, value, 0, true);
        if (index != -1) {
            rec = store.getAt(index);
        }
        return rec;
    },
    setEventTextCurr: function(mode) {
        var me = this;
        if (mode == "default") {
            me.textCurr1.on("change", function(thisComp, newv, oldv) {
                if (newv != oldv) {
                    me.noRoundCurr1 = thisComp.getValue();
                    var value = 0;
                    value = parseFloat(me.noRoundCurr1 * me.fxrate);
                    me.noRoundCurr2 = value;
                    me.setFieldValue(me.textCurr2, me.roundingFunc(value, 1));
                    //me.textCurr2.setValue(me.roundingFunc(value, 1));

                    me.lastKeyin = me.noRoundCurr1;
                    me.lastAct = "SELL";
                    me.lastFXMCurr = me.comboCurr1.getValue();
                }
            });
            me.textCurr2.on("change", function(thisComp, newv, oldv) {
                if (newv != oldv) {
                    me.noRoundCurr2 = thisComp.getValue();
                    var value = 0;
                    value = parseFloat(me.noRoundCurr2 / me.fxrate);
                    me.noRoundCurr1 = value;
                    me.setFieldValue(me.textCurr1, me.roundingFunc(value, 1));
                    //me.textCurr1.setValue(me.roundingFunc(value, 1));

                    me.lastKeyin = me.noRoundCurr2;
                    me.lastAct = "BUY";
                    me.lastFXMCurr = me.comboCurr2.getValue();
                }
            });
        } else {
            me.textCurr1.on("change", function(thisComp, newv, oldv) {
                if (newv != oldv) {
                    me.noRoundCurr1 = thisComp.getValue();
                    var value = 0;
                    value = parseFloat(me.noRoundCurr1 / me.fxrate);
                    me.noRoundCurr2 = value;
                    me.setFieldValue(me.textCurr2, me.roundingFunc(value, 1));
                    //me.textCurr2.setValue(me.roundingFunc(value, 1));

                    me.lastKeyin = me.noRoundCurr1;
                    me.lastAct = "SELL";
                    me.lastFXMCurr = me.comboCurr1.getValue();
                }
            });
            me.textCurr2.on("change", function(thisComp, newv, oldv) {
                var value = 0;
                if (newv != oldv) {
                    me.noRoundCurr2 = thisComp.getValue();
                    value = parseFloat(me.noRoundCurr2 * me.fxrate);
                    me.noRoundCurr1 = value;
                    me.setFieldValue(me.textCurr1, me.roundingFunc(value, 1));
                    //me.textCurr1.setValue(me.roundingFunc(value, 1));

                    me.lastKeyin = me.noRoundCurr2;
                    me.lastAct = "BUY";
                    me.lastFXMCurr = me.comboCurr2.getValue();
                }
            });
        }

    },
    confirmation: function() {
        var me = this;
        var stringContent = "<div style='clear:both;padding-top:5px;padding-left:5px;'>" + languageFormat.getLanguage(31229, 'Please verify the amount that you want to convert and confirm the request:') + "</div><div style='width:100%;text-align:center;padding:10px 0px;font-weight:bold;'><span style='font-size:1.2em;'>" + languageFormat.getLanguage(21276, 'Converting') + " "
                + me.comboCurr1.getValue() + " " + me.textCurr1.getValue() + "  </span><span style='display:inline-block;margin: 0px 10px;' class='fx-play'></span><span style='font-size:1.2em;'>" + me.comboCurr2.getValue() + " " + me.textCurr2.getValue() + "</span></div>";
        me.winCon = msgutil.popup({
            title: languageFormat.getLanguage(21275, 'Confirmation'),
            width: 400,
            layout: "fit",
            buttonAlign: 'center',
            html: stringContent,
            cls: 'confirmation',
            buttons: [
                {
                    text: languageFormat.getLanguage(10030, 'Confirm'),
                    handler: function() {
                        me.submit();
                        me.winCon.close();
                    }
                }, {
                    text: languageFormat.getLanguage(10027, 'Back'),
                    handler: function() {
                        me.winCon.close();
                    }
                }
            ],
            listeners: {
                close: function() {
                    me.winCon = null;
                }
            }
        }).show();
    },
    //1.3.24.5 Check IsHidePin function
    checkIsHidePin: function() {
        var isHidePin = false, me = this;
        var clientCategory = cliCategory; //get from main.jsp
        var skipPinCategory = me.getSkipPinCategory(global_skipPin);
        for (var i = 0; i < skipPinCategory.length; i++) {
            if (clientCategory == skipPinCategory[i])
                isHidePin = true;
        }
        return isHidePin;
    },
    encrypt: function(pin) {
        var me = this;
        // encrypt password
        var pin2 = encryptedString(me.keyPair, pin);
        return pin2;
    },
    updateFeedRecord: function(dataObj) {
        var me = this;
        try {
            if (dataObj != null) {
                var cm = helper.getGridColumns(me.currencyTb);//me.currencyTb.getColumnModel();
                var stkcode = dataObj[fieldStkCode];
                var rowIndex = me.currencyTb.store.indexOfId(stkcode);
                if (stkcode != null && rowIndex != -1) {
                    var record = me.currencyTb.store.getAt(rowIndex);
                    var updateList = [];
                    updateList.push(fieldBuy);
                    updateList.push(fieldSell);
                    updateList.push(fieldLacp);
                    for (var key in dataObj) {
                        if (dataObj.hasOwnProperty(key)) {
                            var columnIndex = helper.getColumnIndex(me.currencyTb.columns, 'dataIndex', key);//cm.findColumnIndex(key);
                            if (updateList.indexOf(key) != -1) {
                                if (columnIndex != -1) {
                                    var oldValue = record.data[key];
                                    record.data[key] = dataObj[key];
                                    var newCellValue = dataObj[key];
                                    if (updateList.indexOf(key) != -1) {
                                        if (oldValue != newCellValue) {
                                            Blinking.setBlink(me.currencyTb, rowIndex, columnIndex, "unchange");
                                            N2NUtil.updateCell(me.currencyTb, rowIndex, columnIndex, newCellValue);
                                            if (me.recCurrencyTb == record && me.fxrate == parseFloat(oldValue)) {
                                                me.idleOrderPad();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    me.labelEffDateTime.setValue(Ext.Date.format(new Date(), me.formatDateTime));
                }
            }

        } catch (e) {
            console.log("[exchangeRate] [updateFeedRecord] exception-->" + e.stack);
        }
    },
    getSkipPinCategory: function(skipCategary) {
        var x = skipCategary.split(',');
        return x;
    },
    formatDate: function(date) {
        // this format to change date frm dd/mm/yyyy format to yyyymmdd to cater for url for atp/history? :)
        date += '';
        var d = date.split('/');
        var d1 = d[0];
        var d2 = d[1];
        var d3 = d[2];
        return d3 + d2 + d1;
    },
    formateDateTimeFxTrans: function(date) {
        //eg:20150109114534
        var day = date.substring(6, 8);
        var month = date.substring(4, 6);
        var year = date.substring(0, 4);
        var hh = date.substring(8, 10);
        var mm = date.substring(10, 12);
        var ss = date.substring(12, 14);
        var ampm = "AM";
        if (hh > 11) {
            ampm = "PM";
            hh = hh - 12;
            if (hh < 10) {
                hh = "0" + hh;
            }
        }
        return day + "/" + month + "/" + year + " " + hh + ":" + mm + ":" + ss + " " + ampm;
    },
    getRecentTransactionList: function() {
        var me = this;

        var tempStorage = new Ext.data.Store({
            fields: ['51', '52', '53', '54', '55', '56', '57', '58', '59', '62'],
            sorters: [{
                    property: "51",
                    direction: 'DESC'
                }
            ]
        });

        me.recentTransactionlist = new Ext.grid.Panel({
            store: tempStorage,
            maxHeight: 150,
            width: '100%',
            cls: "exchangeRate",
            enableColumnResize: true,
            enableColumnMove: false,
            hidden: true,
            viewConfig: {
                columnLines: true,
                stripeRows: true,
                trackMouseOver: false
            },
            columns: [
                {
                    header: languageFormat.getLanguage(10927, 'Date'),
                    dataIndex: '51',
                    width: 155,
                    menuDisabled: true,
                    renderer: function(value, meta) {
                        var tempDate = me.formateDateTimeFxTrans(value);
                        meta.tdAttr = "data-qtip='" + tempDate + "'";
                        return tempDate;
                    }
                },
                {
                    header: languageFormat.getLanguage(21264, 'Request ID'),
                    width: 255,
                    dataIndex: '62',
                    menuDisabled: true,
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        meta.tdAttr = "data-qtip='" + value + "'";
                        return value;
                    }
                },
                {
                    header: languageFormat.getLanguage(21265, 'Channel'),
                    dataIndex: '59',
                    width: 75,
                    menuDisabled: true,
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        meta.tdAttr = "data-qtip='" + ordLogToolTip + "'";
                        return value;
                    }
                },
                {
                    header: languageFormat.getLanguage(21266, 'From Currency'),
                    dataIndex: '52',
                    width: 110,
                    menuDisabled: true,
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        meta.tdAttr = "data-qtip='" + value + "'";
                        return value;
                    }
                }
                , {
                    header: languageFormat.getLanguage(21267, 'To Currency'),
                    dataIndex: '53',
                    width: 110,
                    menuDisabled: true,
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        var tempValue = formatutils.procPriceValue(value).value;
                        meta.tdAttr = "data-qtip='" + tempValue + "'";
                        return tempValue;
                    }
                },
                {
                    header: languageFormat.getLanguage(21268, 'Amount Converted'),
                    dataIndex: '54',
                    align: 'right',
                    menuDisabled: true,
                    width: 140,
                    renderer: function(value, meta, record, rowindex, columnIndex, store, view) {
                        value = parseFloat(value).toFixed(2);
                        var tempValue = formatutils.procPriceValue(value).value;
                        tempValue = Ext.util.Format.number(tempValue, '0,000.00');
                        meta.tdAttr = "data-qtip='" + tempValue + "'";
                        return tempValue;
                    }
                },
                {
                    header: languageFormat.getLanguage(21269, 'Rate'),
                    dataIndex: '55',
                    align: 'right',
                    width: 95,
                    menuDisabled: true,
                    renderer: function(value, meta, record, rowindex, columnIndex, store, view) {
                        meta.tdAttr = "data-qtip='" + value + "'";
                        return value;
                    }
                }, {
                    header: languageFormat.getLanguage(21270, 'Amount Received'),
                    dataIndex: '56',
                    width: 115,
                    align: 'right',
                    menuDisabled: true,
                    renderer: function(value, meta, record, rowindex, columnIndex, store, view) {
                        value = parseFloat(value).toFixed(2);
                        var tempValue = formatutils.procPriceValue(value).value;
                        tempValue = Ext.util.Format.number(tempValue, '0,000.00');
                        meta.tdAttr = "data-qtip='" + tempValue + "'";
                        return tempValue;
                    }
                },
                {
                    header: languageFormat.getLanguage(10906, 'Status'),
                    dataIndex: '57',
                    width: 65,
                    menuDisabled: true,
                    renderer: function(value, meta, record, rowindex, columnIndex, store, view) {
                        meta.tdAttr = "data-qtip='" + value + "'";
                        return value;
                    }
                },
                {
                    header: languageFormat.getLanguage(10133, 'Remark'),
                    dataIndex: '58',
                    width: 260,
                    menuDisabled: true,
                    renderer: function(value, meta, record, rowindex, columnIndex, store, view) {
                        meta.tdAttr = "data-qtip='" + value + "'";
                        return value;
                    }
                }
            ]
        });

        return me.recentTransactionlist;
    },
    callRecentTransactionList: function() {
        var me = this;

        me.setLoading(languageFormat.getLanguage(10017, 'Loading...'));

        me.recentTransactionlist.show();
        Ext.get("titlerecent").show();
        me.transactionlist.hide();
        me.dateFromTrans.hide();
        me.dateToTrans.hide();
        Ext.get("refreshtransaction").hide();
        Ext.get("tolabel").hide();
        Ext.get("fxtran").update(languageFormat.getLanguage(31227, "FX transaction list"));
        var accCombo = me._getAccountName();
        if (accCombo.length === 0) {
            return;
        }

        var urlbuf = [];
        urlbuf.push(addPath + 'tcplus/getFXTrxList');
        urlbuf.push('?ac=' + accCombo[0]);
        urlbuf.push('&bc=' + accCombo[1]);
        urlbuf.push("&FXTrxListType=1"); // 0 - historical, 1 - recent

        var url = urlbuf.join('');
        Ext.Ajax.request({
            url: url,
            success: function(response) {
                var obj = Ext.decode(response.responseText);
                me.setLoading(false);
                if (obj.s) {
                    if (obj.d.length > 0) {
                        me.recentTransactionlist.getStore().loadData(obj.d);
                    } else {
                        //me.recentTransactionlist.getView().mainBody.update('<div class="x-grid-empty">' + languageFormat.getLanguage(21263, 'No Data') + '</div>');
                        helper.setGridEmptyText(me.recentTransactionlist, languageFormat.getLanguage(21263, 'No Data'));
                    }
                } else {
                    console.log(obj);
                }
            }
        });
    },
    roundingFunc: function(value, opt) {
        //0 = floor, 1 = ceiling
        if (opt == 0) {
            value = Math.floor((value * 100)) / 100;
        } else {
            value = Math.ceil((value * 100)) / 100;
        }
        return value;
    },
    getFXDisplay: function() {
        var me = this;
        var promotionMessage = '';
        var updateFXDisplay = true;
        var accountName = me._getAccountName();
        
        if (formatutils.isCUTSubAcc(accountName)) {
            updateFXDisplay = false;
        }

        if (updateFXDisplay) {
            promotionMessage = "<div style='font-size:10pt'>" + languageFormat.getLanguage(31213, "Cash Upfront Trading (CUT) allows you to trade in Singapore and foreign markets(*) at a lower commission rate.")
                    + languageFormat.getLanguage(31214, "Using the FX Conversion feature in i*Trade@CIMB, you can conveniently convert cash balances from one currency to a desired currency to trade Cash Upfront in the respective markets.")
                    + "<br/>"
                    + "</br>"
                    + "<i><small>" + languageFormat.getLanguage(31215, "*note - Cash Upfront Trading is available in SG, HK and US markets.") + "</small></i></br>"
                    + "</br>"
                    + languageFormat.getLanguage(31216, "Not a Cash Upfront Trading customer yet? Follow below steps to get started") + ":</br>"
                    + "<div class='fxbullet'>"
                    + "- " + languageFormat.getLanguage(31217, "Apply for a trading account designated for Cash Upfront Trading.")
                    + "- " + languageFormat.getLanguage(31218, "Link your CIMB Bank StarSaver account with your trading account designated for CUT.") + "<br/>"
                    + "- " + languageFormat.getLanguage(31219, "Top-up your trading account by transferring SGD funds from your StarSaver account to your trading account.") + "<br/>"
                    + "- " + languageFormat.getLanguage(31220, "Use the FX conversion feature in i*Trade@CIMB to convert your cash balances from one currency to other currencies for trading in the different markets.") + "<br/>"
                    + "- " + languageFormat.getLanguage(31221, "Trade using \"CUT\" payment mode in local or foreign markets to enjoy a lower commission rate.")
                    + "</div><br/>";
            document.getElementById("fxlistlink").style.display = 'none';
            me.hideNonCUTOptions();
        } else {
            promotionMessage = languageFormat.getLanguage(20430, "Note") + ":<br/>"
                    + "<div class='fxbullet'>"
                    + "- " + languageFormat.getLanguage(31222, "FX Conversion is applicable only to convert cash balance available for Cash Upfront Trading") + "<br/>"
                    + "- " + languageFormat.getLanguage(31223, "FX Conversion is available on business working days except the timings 5:00 AM to 7:15 AM")
                    + "</div>";

            document.getElementById("fxlistlink").style.display = 'block';
        }

        document.getElementById("promoteMsg").innerHTML = promotionMessage;
    },
    hideNonCUTOptions: function() {
        var me = this;
        me.transactionlist.hide();
        me.dateFromTrans.hide();
        me.dateToTrans.hide();
        Ext.get("refreshtransaction").hide();
        Ext.get("tolabel").hide();
        me.recentTransactionlist.hide();
        Ext.get("titlerecent").hide();
    },
    setFieldValue: function(field, value) {
        if (field) {
            field.suspendEvent('change');
            field.setValue(value);
            field.resumeEvent('change');
        }
    },
    _getAccountName: function() {
        var me = this;
        var accountVal = me.comboAcc.getValue();
        var accountNames = [];

        if (accountVal) {
            accountNames = accountVal.split(global_AccountSeparator);
        }

        return accountNames;
    }
});
