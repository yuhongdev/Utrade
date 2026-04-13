
Ext.define('TCPlus.view.orderbook.OrderPad', {
    debug: false,
    extend: 'Ext.panel.Panel',
    alias: 'widget.orderpad',
    exchangecode: '',
    stkcode: '',
    stkname: '',
    last: '',
    lacp: '',
    prev: '',
    buy: '',
    bqty: '',
    sell: '',
    sqty: '',
    lotsize: '',
    currency: '',
    act: '',
    bid1: '',
    bid2: '',
    bid3: '',
    bid4: '',
    bid5: '',
    ask1: '',
    ask2: '',
    ask3: '',
    ask4: '',
    ask5: '',
    //cancelrevise
    mode: '',
    accno: '',
    tktno: '',
    ordno: '',
    subordno: '',
    ordtype: '',
    ordprc: '',
    ordqty: '',
    validity: '',
    ordsrc: '',
    ordtime: '',
    ordsts: '',
    unmtqty: '',
    mtqty: '',
    minqty: '',
    dsqty: '',
    expdate: null,
    action: '',
    branchCode: '',
    brokerCode: '',
    tpType: '',
    tpDirection: '',
    revTPType: '',
    revTPDirection: '',
    // derivative
    stoplimit: '',
    trdForm: null,
    //tfSearch:null,
    //grid: null,
    tradeResultTimeout: null,
    loadMask: null,
    updPrc: false,
    bidRec: null,
    askRec: null,
    isReady: false,
    canTrade: false,
    emptyText: languageFormat.getLanguage(30013, 'No result found.'),
    price: '',
    fieldType: 'text', // empty for normal browser and ipad the keypad need show number
    //////////////////////// ATP params ////////////////////////
    accs: null,
    arPriceList: null, // price list		[ from QC]
    arCurrencyList: null, // currency list	[ from stock info]
    arAccList: null, // account list
    arActionList: null, // action list
    arOTypeList: null, // order type list
    arValidityList: null, // validity list
    arPaymentList: null, // payment list
    arOrderControlList: null, // order control
    arReviseControlList: null, // revise control
    arTrxFeeFormulaList: null, // trx fee formula
    arTPTypeList: null, // trigger price type
    arTPDirectionList: null, // trigger price direction
    arPaymentConfigList: null, //acc payment config
    origArPaymentList: null,
    arNotSupportedCurrList: null, //not supported currency
    arTakeProfitOrderTypeList: null,
    arStopLossOrderTypeList: null,
    arCFDOffsetTypeList: null,
    arCloseOrdCtrlList: null,

    revQty: '',
    revPrc: '',
    revDisclosedQty: '',
    revValidity: '',
    revOrderType: '',
    revStopLimit: '',
    revMinQty: '',
    // global variables
    selSymbolMsg: languageFormat.getLanguage(30214, 'Please select a symbol'),
    inputErrorMsg: languageFormat.getLanguage(30301, 'Please check the fields marked with red border.'),
    // vtypes
    qtyTest: /^[0-9]|^[0-9]+$[0-9]/,
    qtyTestMY1: /([a-z]+|[A-Z]+)/, // check have any character inside
    qtyTestMY2: /(^\-?[0-9]|^[0-9]|^\-)/, // check number format is correct or not

    minQtyTest: /^[0-9]|^[0-9]+$[0-9]/,
    dsQtyTest: /^[0-9]|^[0-9]+$[0-9]/,
    prcTest: /^\.\d{1,}$|^\d{1,}\.\d{1,}$|^\d{1,}\.\d{1,}$|^[1-9]\d{1,}$|^[1-9]$/,
    prcTestMY: /^-?\.\d{1,}$|^-?\d{1,}\.\d{1,}$|^-?\d{1,}\.\d{1,}$|^-?[0-9]\d{1,}$|^-?[0-9]$/,
    prcKeyUpTest: /^\.$|^\.\d{1,}$|^\d{1,}\.\d{1,}$|^\d{1,}\.$|^[1-9]\d{1,}$|^[1-9]$/,
    prcKeyUpTestMY: /^-?\.$|^-?\.\d{1,}$|^-?\d{1,}\.\d{1,}$|^-?\d{1,}\.$|^-?[0-9]\d{1,}$|^-?[0-9]$/,
    stopLimitTest: /^[0-9]|^[0-9]+$[0-9]/,
    //prev input
    lastAccNo: null,
    lastOrdType: null,
    lastValidity: null,
    lastPayment: null,
    lastAccount: null,
    lastStopLimit: null,
    lastExpDate: null,
    lastQty: null,
    lastPrc: null,
    oldTktNo: null,
    lastExchange: null,
    lastStock: null,
    prevAction: '',
    lastTPType: null,
    lastTPDirection: null,
    lastOffsetType: null,
    lastTakeProfitOrdType: null,
    lastStopLossOrdType: null,
    // default settings
    defCurrency: '',
    arFldCfg: null,
    fldCfg: null,
    atpRule: null,
    atpCurrencyRate: null,
    datePickerWin: null,
    // settings
    keyPair: null,
    lastPin: '',
    savePin: false,
    saveConf: false,
    prevMode: '',
    allowUpdate: true,
    OTPwindow: null, // store otp window
    tComboOTPDevice: null, // otp combo device list
    tFieldOTPPin: null, // otp field pin

    isDisableToClear: false, // for verify quantity text field
    row2Items: null,
    inputRow2: null,
    paymentStore: null,
    decimalPlace: 0,
    defaultDecimal: 3,
    tempLastPayment: '',
    accExchCode: '',
    totalValue: '',
    isBasic: true,
    btnBasic: null,
    selectDefault: true,
    slcomp: "op",
    tempSearchAccList: null,
    elDDGroup: 'orderPadDD',
    compRef: {},
//    tConf: {
//        tab: 'tab1',
//        closable: false
//    },
    _roundQty: false,
    type: 'od',
    _elMsgTarget: 'title',
    _maxQtyLength: 9,
    initComponent: function () {
        var panel = this;
        panel.pinTest = pinReg;
        // copy settings
//        if (config) {
//            panel.id = config.id;
//            if (config.arFldCfg)
//                panel.arFldCfg = config.arFldCfg;
//            if (config.atpRule)
//                panel.atpRule = config.atpRule;
//            if (config.atpCurrencyRate)
//                panel.atpCurrencyRate = config.atpCurrencyRate;
//        }

        setMaxDigits(38);
        panel.keyPair = new RSAKeyPair(
                key,
                '', // privateKey
                mod
                );

        /*
         if (device.ipad() > 0) {
         this.fieldType = 'number';
         }
         */

        Ext.apply(Ext.form.field.VTypes, {
            qty: function (val, field) {
                return panel.qtyTest.test(val);
            },
            qtyText: languageFormat.getLanguage(30215, 'Not a valid quantity. Must be a number.'),
            qtyMask: /[0-9\b]/i,
            minqty: function (val, field) {
                return panel.minQtyTest.test(val);
            },
            minqtyText: languageFormat.getLanguage(30215, 'Not a valid quantity. Must be a number.'),
            minqtyMask: /[0-9\b]/i,
            dsqty: function (val, field) {
                return panel.dsQtyTest.test(val);
            },
            dsqtyText: languageFormat.getLanguage(30215, 'Not a valid quantity. Must be a number.'),
            dsqtyMask: /[0-9\b]/i,
            prc: function (val, field) {
                if (panel.getExCode() == 'MY' && !panel.chkPrc()) {
                    return panel.prcTestMY.test(val);
                } else {
                    return panel.prcTest.test(val);
                }
            },
            prcText: languageFormat.getLanguage(30216, 'Not a valid price. Must be a numeric value.'),
            prcMask: /-?[0-9.\b]/i,
            pin: function (val, field) {
                return panel.pinTest.test(val);
            },
            pinText: languageFormat.getLanguage(30219, 'Not a valid pin. Must be 6 digits.'),
            pinMask: /[0-9\b]/i,
            stopLimit: function (val, field) {
                return panel.stopLimitTest.test(val);
            },
            stopLimitText: languageFormat.getLanguage(30229, 'Not a valid trigger price. Must be digits.'),
            stopLimitMask: /[0-9\b]/i,
            roundQty: function(val, field) {
                if (panel.getExCode() === 'MY') {
                    return N2N_CONFIG.roundNegQtyReg.test(val);
                } else {
                    return N2N_CONFIG.roundQtyReg.test(val);
                }
            },
            roundQtyText: languageFormat.getLanguage(30244, 'Please input a valid quantity. You can use K, M with maximum 2 decimals. \neg. 1.55K'),
            roundQtyMask: /[0-9.\-KM]/i
        });

        // init values
        panel.arActionList = new Array();
        panel.arAccList = new Array();
        panel.arPriceList = new Array();
        panel.arOTypeList = new Array();
        panel.arValidityList = new Array();
        panel.arPaymentList = new Array();
        panel.arCurrencyList = new Array();
        panel.arOrderControlList = new Array();
        panel.arTPTypeList = new Array();
        panel.arTPDirectionList = new Array();
        panel.arPaymentConfigList = new Array();
        panel.origArPaymentList = new Array();
        panel.arNotSupportedCurrList = new Array();
        panel.arTakeProfitOrderTypeList = new Array();
        panel.arStopLossOrderTypeList = new Array();
        panel.arCFDOffsetTypeList = new Array();
        panel.arCloseOrdCtrlList = new Array();

        // to store the value if the columns can enable for particular info [this info is from ATP]
        panel.arDisclosedRuleList = new Array();

        // show/hide UI.
        var stoplimit = false;
        var minqty = false;
        var dsqty = false;
        var payment = false;
        var settcurr = false;
        var strategy = false;
        var shortsell = false;
        var privateOrd = false;
//        var confirm = false;
        var showlimit = false;
        var skipconfm = false;
        var forceord = false;
        var forcequeue = false;
        var amalgamation = false;
        var bts2features = false;
        var triggertype = false;
        var triggerdirection = false;

        panel.initFldCfg(exchangecode);
        if (panel.fldCfg) {
            var cfg = panel.fldCfg;
            if (cfg.stoplimit)
                stoplimit = cfg.stoplimit;
            if (cfg.minqty)
                minqty = cfg.minqty;
            if (cfg.dsqty)
                dsqty = cfg.dsqty;
            if (cfg.payment)
                payment = cfg.payment;
            if (cfg.settcurr)
                settcurr = cfg.settcurr;
            if (cfg.strategy)
                strategy = cfg.strategy;
            if (cfg.shortsell)
                shortsell = cfg.shortsell;
            if (cfg.privateOrd)
                privateOrd = cfg.privateOrd;
//            if (cfg.confirm) confirm = cfg.confirm;
            if (cfg.showlimit)
                showlimit = cfg.showlimit;
            if (cfg.skipconfm)
                skipconfm = cfg.skipconfm;
            if (cfg.forceord)
                forceord = cfg.forceord;
            if (cfg.forcequeue)
                forcequeue = cfg.forcequeue;
            if (cfg.amalgamation)
                amalgamation = cfg.amalgamation;
            if (cfg.bts2features)
                bts2features = cfg.bts2features;
            if (cfg.triggertype)
                triggertype = cfg.triggertype;
            if (cfg.triggerdirection)
                triggerdirection = cfg.triggerdirection;
        }

        var dataStore = null;
        if (pagingMode) {
            dataStore = new Ext.ux.data.PagingSimpleStore({
                data: panel.arAccList,
                lastOptions: {params: {start: 0, limit: 5}}
            });
        } else {
            dataStore = Ext.create('Ext.data.ArrayStore', {
                storeId: 'accnoStore',
                fields: [
                    {name: 'accno', type: 'string'},
                    {name: 'name', type: 'string'}
                ],
                data: panel.arAccList
            });

        }

        var cookieOrdPadIsBasic = cookies.readCookie('_OrdPadIsBasic_');

        if (cookieOrdPadIsBasic != null) {
            if (cookieOrdPadIsBasic == 'true') {
                panel.isBasic = true;
            } else {
                panel.isBasic = false;
            }
        } else {
            panel.isBasic = !N2N_CONFIG.orderPadAdvView;
        }
        var stylebtnBasic = 'background:transparent;margin-top:-6px;margin-left:5px';
        var heightbtnBasic = 16;
        if (global_personalizationTheme.indexOf("wh") != -1) {
            stylebtnBasic = "background:#27313C;margin:0px;padding:0px;";
//            heightbtnBasic = 14;
        }
        panel.btnBasic = Ext.create('Ext.button.Button', {
            hidden: !N2N_CONFIG.orderPadBasic,
            icon: panel.isBasic == true ? iconBtnBasic : iconBtnAdv,
            tooltip: panel.isBasic ? languageFormat.getLanguage(30241, 'Switch to full view') : languageFormat.getLanguage(30242, 'Switch to basic view'),
            cls: isMobile ? 'menubtn' : '',
            height: isMobile ? '100%' : heightbtnBasic,
            width: isMobile ? 26 : 16,
            //isBasic: false,
            style: !isMobile ? stylebtnBasic : '',
            border: false,
            padding: 0,
            handler: function () {
                if (!panel.isBasic) {
                    panel.isBasic = true;
                    panel.btnBasic.setTooltip(languageFormat.getLanguage(30241, 'Switch to full view'));
                    panel.advBasicComponent();
                } else {
                    panel.isBasic = false;
                    panel.btnBasic.setTooltip(languageFormat.getLanguage(30242, 'Switch to basic view'));
                    panel.advBasicComponent();
                }

                cookies.createCookie('_OrdPadIsBasic_', panel.isBasic, 1800);

                panel._setCtSize();	           
            }
        });
        var lblBal = (showlimit && panel.exchangecode != 'MY') ? languageFormat.getLanguage(20834, 'Trading Limit') : '';
        panel._tempAccNo = Ext.create('Ext.form.field.Hidden', {
            name: 'accountno'
        });
        var _setTempAccNo = function (record) {
            if (panel._tempAccNo != null && record) {
                panel._tempAccNo.setValue(record.get('name'));
            }
        };
        var tradingLimit = ['<tpl for=".">',
            '<td>',
            '<table cellpadding="0" cellspacing="0" style="width:100%;table-layout:fixed">',
            '<tr>',
            '<td id="trdLimitCol" style="text-align:right;overflow:hidden;white-space:nowrap"><label for="{id}" id="accountno_label2" style="{labelStyle};display:inline-block;text-align:right" class="x-form-item-label"></label></td>',
            '<td style="margin-left:2px;width:35px;text-align:right;"><span id="btnbasic"></span><span id="sbtnlimit"></span><span id=sbtnSearchAcc></span></td>',
            '</tr>',
            '</table>',
            '</td></tr></table>',
            '</tpl>'];
        if (global_personalizationTheme.indexOf("wh") != -1) {
            tradingLimit = [
                '<tpl for=".">',
                '<td>',
                '<table cellpadding="0" cellspacing="0" style="width:100%;table-layout:fixed">',
                '<tr>',
                '<td style="margin-left:2px;width:20px;text-align:right;position:relative;"><span id=sbtnSearchAcc style="position:absolute;right:0"></span></td>',
                '</tr>',
                '</table>',
                '</td></tr></table>',
                '</tpl>'
            ];
        }
        var inputRow1 = new Ext.container.Container({
            baseCls: '',
            header: false,
            border: false,
            layout: 'column',
            style: 'padding-left:5px;padding-top:0px;padding-bottom:0px;margin:0px;',
            items: [
                {
                    // ref: '../../cbAction',
                    xtype: 'combo',
                    width: 70,
                    itemId: 'cbAction',
                    columnWidth: 0.20,
                    name: 'cbAction',
                    queryMode: 'local',
                    triggerAction: 'all',
                    editable: false,
                    valueField: 'actionCode',
                    displayField: 'actionDesc',
                    fieldLabel: languageFormat.getLanguage(20832, 'Action'),
                    msgTarget: 'none',
                    labelAlign: 'top',
                    labelPad: '2',
                    labelStyle: ' position: relative; top: 4px;',
                    style: 'padding-right: 2px;',
                    store: new Ext.data.ArrayStore({
                        fields: ['actionCode', 'actionDesc'],
                        data: panel.arActionList
                    }),
                    listeners: {
                        select: function () {
                            var val = this.value;
                            panel.isDisableToClear = true;
                            panel.prevMode = panel.mode;
                            panel.mode = val;
                            panel.trdForm.down('#act').setValue(val);
                            panel.setBGColor(val);		// set order pad colour
//                                    panel.setDefault();
                            // panel.setDefaultPrice(panel.price, panel.bidRec, panel.askRec, false);
                            panel.setCurrency(panel.currency, 1);
                            // panel.callStkInfo();
                            panel.selectActionMode(val);
                            if (global_useBidSize) {
                                panel.regeneratePriceList();
                            }
                            panel.setDefaultPrice(panel.price, panel.bidRec, panel.askRec, false);
                        }
                    }

                },
                Ext.create('Ext.form.field.ComboBox', {
                    itemId: 'accountno',
                    queryMode: 'local',
                    forceSelection: !isDealerRemisier && N2N_CONFIG.defTradeAccFeature,
                    triggerAction: 'all',
                    editable: true,
                    columnWidth: 0.798,
                    displayField: 'name',
                    valueField: 'accno',
                    labelAlign: 'top',
                    labelPad: '2',
                    matchFieldWidth:false,
                    margin: isMobile && isDealerRemisier ? '0 17 0 0' : 0,
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
                    pageSize: pagingMode ? 5 : 0,
                    //  width: 290,
                    //      lazyInit: false,
                    afterLabelTextTpl: new Ext.XTemplate(tradingLimit),
                    labelSeparator: "",
                    fieldLabel: "<table cellpadding='0' cellspacing='0' style='width:100%'><tr><td style='width:10px;white-space:nowrap'>" + languageFormat.getLanguage(20833, 'Account No.') + ":</td>", //For fixing error on Mozilla FireFox(Push down Trading Limit)
                    msgTarget: 'none',
                    //   boxLabel: '<span style="font-weight:normal">' + lblBal + '</span>',
                    labelStyle: ' position: relative;',
                    style: 'padding-right:5px;',
                    name: 'accountno',
                    // value: panel.lastAccount ? panel.lastAccount : (panel.arAccList.length > 0 ? panel.arAccList[0][0] : ''), // no need (not affected)
                    store: dataStore,
                    submitValue: false,
                    listeners: {
                        afterrender: function (combo, value) {
                            if (pagingMode) {
                                // combo.pageTb.setVisible(false);
//                                        var paging = new Ext.ux.EditedPagingToolbar({
//                                            enableOverflow: menuOverflow,
//                                            store: dataStore,
//                                            displayInfo: false,
//                                            pageSize: 5,
//                                            renderTo: combo.footer
//                                        });


                            }
                            if (!isMobile && global_personalizationTheme.indexOf("wh") != -1) {
                                panel.btnBasic.render("btnbasic");
                            }
                            panel.btnlimit = new Ext.button.Button({
                                // ref: '../../btnlimit',
                                itemId: 'btnlimit',
                                iconCls: "icon-center",
                                iconAlign: 'top',   
                                padding: 0,
                                margin: 0,
                                width: 18,
                                height: 16,
                                hidden: (showlimit && panel.exchangecode != 'MY') ? false : true,
                                renderTo: 'sbtnlimit',
                                tooltip: languageFormat.getLanguage(20855, 'Refresh Trading Limit'),
                                icon: iconRefreshLimit,
                                style: 'background:#27313C;border: none;',
                                handler: function () {
                                    panel.callAccBal();
                                    //panel.setCreditLimit(panel.getAccountNo());	// load credit limit
                                }
                            });
                            
                            var btnW = 18;
                            var btnH = 15;
                            var btnS = 'background:transparent;border:none;';
                            if (global_personalizationTheme.indexOf("wh") > -1) {
                                btnW = 17;
                                btnH = 16;
                                btnS = '';
                            }
                            
                            panel.searchAccountBtn = new Ext.button.Button({
                                // ref: '../../btnlimit',
                                itemId: 'btnSearchAcc',
                                iconCls: "icon-center",
                                iconAlign: 'top',
                                padding: 0,
                                margin: 0,
                                width: btnW,
                                height: btnH,
                                hidden: isDealerRemisier ? false : true,
                                renderTo: 'sbtnSearchAcc',
                                icon: iconSearchAccBtn,
                                style: btnS,
                                handler: function () {
                                    if (panel.getAccountName().trim() == '') {
                                        msgutil.alert(languageFormat.getLanguage(10045, 'Please key in your search text.'));
                                    } else {
                                        panel.searchAccount(panel.getAccountName());
                                    }
                                }
                            });

                        },
                        select: function (thisComp, record) {
                            var accno = this.value;
                            if (panel.btnlimit.isDisabled()) {
                                if (record[0].data.accno != '') {
                                    panel.btnlimit.enable();

                                }

                            } else {
                                if (record[0].data.accno == '') {
                                    panel.btnlimit.disable();

                                }
                            }
                            panel.isDisableToClear = true;
                            panel.setPaymentList();
                            panel.callAccBal();
                            panel.callStkInfo();
                        },
                        change: function(thisComp, newValue) {
                        if (newValue && N2N_CONFIG.defTradeAccFeature && defTrAccConf.getDefTrAccOpt(panel.exchangecode) == defAccValues.LAST) {
                            var defTrAccLast = isDealerRemisier ? thisComp.getRawValue() : newValue;
                            defTrAccConf.setDefTrAccLast(panel.exchangecode, defTrAccLast);
                            // Saves to cookie
                                cookies.createCookie(loginId + '_defTrAcc', defTrAccConf.save(), 1800);
                            cookies.createCookie(loginId + '_defTrAccSync', false, 1800);
                        }

                            var _record = thisComp.findRecordByValue(newValue);
                            _setTempAccNo(_record);
                        }
                    },
                    anchor: '100%'
                }),
                panel._tempAccNo

            ]
        });

        panel.compRef.dsqtyPanel = Ext.create('Ext.form.field.Text', {
            // ref: '../../dsqty',
            itemId: 'dsqty',
            baseCls: '',
            border: false,
            columnWidth: !isMobile ? 0.20 : 0.20, //0.35,
            hidden: !dsqty,
            fieldLabel: languageFormat.getLanguage(20839, 'Disclosed'),
            labelAlign: 'top',
            labelPad: '2',
            labelStyle: ' position: relative; top: 4px;text-align:left;',
            vtype: N2N_CONFIG.orderRoundQty ? 'roundQty' : 'dsqty',
            msgTarget: panel._elMsgTarget,
            name: 'dsqty',
            inputType: this.fieldType,
            width: 70,
            enableKeyEvents: true,
            getSubmitValue: panel._submitValueFn(),
            fieldStyle: 'text-transform:uppercase',
            maxLength: panel._maxQtyLength,
            maxLengthText: N2N_CONFIG.orderRoundQty ? '' : languageFormat.getLanguage(30245, 'The maximum length for this field is {0}'),
            listeners: {
                render: function (thisComp) {
                    panel.initializeOrderPadDragZone(thisComp);
                    panel.initializeOrderPadDropZone(thisComp);
                },
                change: function () {
                    panel.setMsgBox();
                },
                keyup: function () {
                    panel.setMsgBox();

                    // TODO:
//                          			if (this.getRawValue() && !panel.dsQtyTest.test(this.getRawValue())) {
//                          		this.setValue('');
//                          		}
                },
                focus: function(thisTf) {
                    panel._removeDigitComma(thisTf);
                },
                blur: panel._getBlurHandler()      
            },
            allowBlank: true
        });

        panel.compRef.validityCt = Ext.create('Ext.form.field.ComboBox', {
            //    // ref: '../../cbValidity',
            //xtype: 'combo',
            itemId: 'cbValidity',
            queryMode: 'local',
            triggerAction: 'all',
            editable: false,
            displayField: 'desc',
            valueField: 'code',
            columnWidth: !isMobile ? 0.20 : 0.20, //0.35,
            //    minHeight: 60,
            fieldLabel: languageFormat.getLanguage(20838, 'Validity'),
            msgTarget: 'none',
            labelAlign: 'top',
            labelPad: '2',
            labelStyle: ' position: relative; top: 4px',
            //  matchFieldWidth: false,
            listConfig: {
                //maxHeight: 90,
                minWidth: 50,
                listeners: {
                    'itemclick': {
                        fn: function (list, record) {
                            panel.setValidity(record.data.code);
                            panel.selectValidityEvent(record.data.code);
                        }
                    }
                }
            },
            style: 'padding-right:3px;',
            name: 'cbValidity',
            width: 90,
            store: new Ext.data.ArrayStore({
                fields: ['code', 'desc'],
                data: panel.arValidityList
            }),
            listeners: {
                render: function (thisComp) {
                    panel.initializeOrderPadDragZone(thisComp);
                    panel.initializeOrderPadDropZone(thisComp);
                },
                beforeselect: function (cbo, rec, idx) {
                    panel.lastValidity = this.value;
                },
                select: function () {
//                                	if(this.value!='GTD'){
                    panel.lastValidity = this.value;
//                                	}
                    panel.isDisableToClear = true;
                    //panel.setValidity(this.value);
                    //panel.selectValidityEvent(this.value);
                    //panel.setValidityCmb(this.value);

                    var mode = panel.mode;

                    if (mode == modeOrdBuy || mode == modeOrdSell) {
                        panel.setOrderPanelBuySellRule(panel.exchangecode);

                    } else if (mode == modeOrdRevise) {// || mode==modeOrdCancel){
                        panel.setOrderPanelReviseRule();
                    }
                }
            }
        });



        panel.row2Items = [
            panel.compRef.priceCT = Ext.create('Ext.form.field.ComboBox', {
                //     // ref: '../../price',
                itemId: 'price',
                queryMode: 'local',
                triggerAction: 'all',
                valueField: 'code',
                displayField: 'desc',
                columnWidth: !isMobile ? 0.20 : 0.20, //0.28
                //vtype: 'prc',   		 bug - v1.3.14.9
                fieldLabel: languageFormat.getLanguage(20835, 'Price'),
                msgTarget: panel._elMsgTarget,
                labelAlign: "top",
                labelPad: '2',
                name: 'price',
                maskRe: /[-0-9.]/, //filter keys to only accept -, numbers and .
                width: 70,
                listConfig: {
                    maxHeight: 110
                },
                store: new Ext.data.ArrayStore({
                    fields: ['code', 'desc'],
                    data: panel.arPriceList
                }),
                value: panel.arPriceList.length > 0 ? panel.arPriceList[0][0] : '',
                autoSelect: true,
                disableKeyFilter: true,
                minChars: 3,
                listeners: {
                    render: function (thisComp) {
                        panel.initializeOrderPadDragZone(thisComp);
                        panel.initializeOrderPadDropZone(thisComp);
                    },
                    afterrender: function (thisComp) {
                        if (isMobile) {
                            // var input = thisComp.getEl().down('input');
                            // input.set({type: 'number'});
                            // input.down('input').set({pattern: '\d+(\.\d*)?'});
                        }
                    },
                    select: function () {
                        panel.setMsgBox();
                    },
                    change: function () {
                        panel.isDisableToClear = true;
                        panel.lastPrc = this.getRawValue();
                        panel.price = panel.lastPrc; // to fix price reset issue
                        panel.setMsgBox();
                    },
                    keyup: function () {
                        var val = this.getRawValue();
                        if (val && val.length > 1) {
                            if (panel.chkPrc()) {
                                if (!panel.prcKeyUpTest.test(val)) {
                                    this.setValue('');
                                }
                            } else {
                                if (panel.getExCode() == 'MY') {
                                    if (!panel.prcKeyUpTestMY.test(val)) {
                                        this.setValue('');
                                    }
                                }
                            }
                        }
                        panel.setMsgBox();
                    },
                    focus: function () {
                        if (touchMode) {
                            var el = this;
                            var val = el.getRawValue();
                            var task = new Ext.util.DelayedTask(function () {
                                var obj = el.getEl().dom;
                                setCursorPosition(obj, val.length);
                                task.cancel();
                            });
                            task.delay(100);
                        }
                    }
                }
            }),
            panel.compRef.qtyCT = Ext.create(panel._getExtInputCls(), {
                //       ref: '../../quantity',
                itemId: 'quantity',
                //xtype: 'numberfield', //1.3.25.10 only accept number
                fieldLabel: languageFormat.getLanguage(20836, 'Qty'),
                msgTarget: panel._elMsgTarget,
                labelAlign: 'top',
                labelPad: '2',
                columnWidth: !isMobile ? 0.20 : 0.20, //0.72,
                labelStyle: ' position: relative; top: 4px;text-align:left;',
//                        style: 'text-align: right;',
                fieldStyle: 'text-align:right;text-transform:uppercase',
//                            vtype: 'qty',   			 bug - v1.3.14.9
                name: 'quantity',
                allowDecimals: false, //1.3.25.10 not allow decimal input
                inputType: this.fieldType,
                width: 70,
                enableKeyEvents: true,
                hideTrigger: true,
                maxLength: panel._maxQtyLength,
                enforceMaxLength: true,
                mouseWheelEnabled: false,
                //anchor: '95%',
                getSubmitValue: panel._submitValueFn(),
                vtype: N2N_CONFIG.orderRoundQty ? 'roundQty' : null,
                maxLengthText: N2N_CONFIG.orderRoundQty ? '' : languageFormat.getLanguage(30245, 'The maximum length for this field is {0}'),
                listeners: {
                    render: function (thisComp) {
                        panel.initializeOrderPadDragZone(thisComp);
                        panel.initializeOrderPadDropZone(thisComp);
                    },
                    afterrender: function (thisComp) {
                        if (isMobile && !N2N_CONFIG.orderRoundQty) {
                            thisComp.getEl().down('input').set({pattern: '[0-9]*'});
                        }
                    },
                    change: function () {
                        panel.setMsgBox();
                    },
                    keypress: function(thisComp, e) {
                        if (!N2N_CONFIG.orderRoundQty && thisComp.isValid() == false) {
                            e.stopEvent();
                        }
                    },
                    keyup: function (thisComp, e) {
                        var val = this.getRawValue();
                        
                        if (!N2N_CONFIG.orderRoundQty) {
                            if (val) {

                                if (panel.getExCode() == 'MY') {

                                    if (!panel.qtyTestMY1.test(val)) {
                                        if (!panel.qtyTestMY2.test(val)) {
                                            this.setValue('');
                                        }
                                    } else {
                                        this.setValue('');
                                    }

                                } else {
                                    if (!panel.qtyTest.test(this.getRawValue())) {
                                        this.setValue('');
                                    }
                                }

                            }
                        }
                        
                        panel.setMsgBox();
                    },
                    focus: function (thisTf) {
                        panel._removeDigitComma(thisTf);
                        
                        if (touchMode) {
                            var el = this;
                            var val = el.getRawValue();
                            var task = new Ext.util.DelayedTask(function () {
                                var obj = el.getEl().dom;
                                setCursorPosition(obj, val.length);
                                task.cancel();
                            });
                            task.delay(100);
                        }
                    },
                    blur: panel._getBlurHandler()
                }

            }),
            panel.compRef.orderTypeCT = Ext.create('Ext.form.ComboBox', {
                //   // ref: '../../otype',
                // xtype: 'combo',
                itemId: 'otype',
                queryMode: 'local',
                triggerAction: 'all',
                editable: false,
                displayField: 'desc',
                valueField: 'code',
                labelAlign: 'top',
                labelPad: '2',
                labelStyle: ' position: relative; top: 4px;',
                fieldLabel: languageFormat.getLanguage(20837, 'Order Type'),
                msgTarget: 'none',
                matchFieldWidth: true,
                columnWidth: !isMobile ? 0.20 : 0.20, //0.35,
                listConfig: {
                    minWidth: 100
                },
                //     labelStyle: 'white-space:nowrap;  position: relative; top: 4px',
                style: 'cursor: pointer;padding-right:2px;',
                name: 'otype',
                // minHeight: 60,
                width: 100,
                scroll: true,
                store: new Ext.data.ArrayStore({
                    fields: ['code', 'desc'],
                    data: panel.arOTypeList
                }),
                listeners: {
                    render: function (thisComp) {
                        panel.initializeOrderPadDragZone(thisComp);
                        panel.initializeOrderPadDropZone(thisComp);
                    },
                    beforeselect: function (cbo, rec, idx) {
                        panel.lastOrdType = this.value;
                    },
                    select: function (cbo, rec, idx) {
                        panel.isDisableToClear = true;
                        panel.lastOrdType = this.value;
                        var otype = this.value;
                        panel.setMsgBox();
                        panel.selectOType(otype);
                        var mode = panel.mode;


                        if (mode == modeOrdBuy || mode == modeOrdSell) {
                            panel.setOrderPanelBuySellRule(panel.exchangecode);

                        } else if (mode == modeOrdRevise) {// || mode==modeOrdCancel){
                            panel.setOrderPanelReviseRule();

                        }
                    }
                }
            })
        ];

        panel.compRef.tpTypeCt = Ext.create('Ext.form.field.ComboBox', {
            //itemId: 'tptypePanel',
            itemId: 'tptype',
            columnWidth: !isMobile ? 0.20 : 0.20, //0.28,
            baseCls: '',
            border: false,
            hidden: !triggertype,
            queryMode: 'local',
            triggerAction: 'all',
            editable: false,
            displayField: 'desc',
            valueField: 'code',
            labelAlign: 'top',
            labelPad: '2',
//          labelStyle: ' position: relative; top: 4px;',
            labelStyle: ' position: relative; top: 4px;text-align:left;',
            fieldLabel: languageFormat.getLanguage(20840, 'Trigger'),
            style: 'cursor: pointer;padding-right:2px;', //style: '',
            name: 'tptype',
            //  minHeight: 60,
            width: 70,
            scroll: true,
            msgTarget: 'none',
            store: new Ext.data.ArrayStore({
                fields: ['code', 'desc'],
                data: panel.arTPTypeList
            }),
            listeners: {
                render: function (thisComp) {
                    panel.initializeOrderPadDragZone(thisComp);
                    panel.initializeOrderPadDropZone(thisComp);
                },
                beforeselect: function () {
                    panel.lastTPType = this.value;
                },
                select: function () {
                    panel.isDisableToClear = true;
                    panel.lastTPType = this.value;
                    var tptype = this.value;
                    panel.tpType = tptype;
                    panel.setTPType(tptype);
                    var mode = panel.mode;

                    if (mode == modeOrdBuy || mode == modeOrdSell) {
                        panel.setOrderPanelBuySellRule(panel.exchangecode);
                    } else if (mode == modeOrdRevise) {// || mode==modeOrdCancel){
                        panel.setOrderPanelReviseRule();
                    }
                }
            }
        });

        panel.compRef.tpDirectionCt = Ext.create('Ext.form.field.ComboBox', {
            //itemId: 'tpdirectionPanel',
            itemId: 'tpdirection',
            columnWidth: !isMobile ? 0.20 : 0.20, //0.28,
            baseCls: '',
            border: false,
            hidden: !triggerdirection,
            queryMode: 'local',
            triggerAction: 'all',
            editable: false,
            displayField: 'desc',
            valueField: 'code',
            labelAlign: 'top',
            labelPad: '2',
            labelStyle: ' position: relative; top: 4px;text-align:left;',
            fieldLabel: languageFormat.getLanguage(20841, 'Direction'),
            style: 'cursor: pointer;padding-right:2px;', //style: '',
            name: 'tpdirection',
            //  minHeight: 60,
            width: 70,
            scroll: true,
            msgTarget: 'none',
            store: new Ext.data.ArrayStore({
                fields: ['code', 'desc'],
                data: panel.arTPDirectionList
            }),
            listeners: {
                render: function (thisComp) {
                    panel.initializeOrderPadDragZone(thisComp);
                    panel.initializeOrderPadDropZone(thisComp);
                },
                beforeselect: function (cbo, rec, idx) {
                    panel.lastTPDirection = this.value;
                },
                select: function (cbo, rec, idx) {
                    panel.isDisableToClear = true;
                    panel.lastTPDirection = this.value;
                    var tpdirection = this.value;
                    panel.tpDirection = tpdirection;
                    panel.setTPDirection(tpdirection);
                    var mode = panel.mode;

                    if (mode == modeOrdBuy || mode == modeOrdSell) {
                        panel.setOrderPanelBuySellRule(panel.exchangecode);
                    } else if (mode == modeOrdRevise) {// || mode==modeOrdCancel){
                        panel.setOrderPanelReviseRule();
                    }
                }
            }
        });

        panel.compRef.stopLimitCt = Ext.create('Ext.form.field.Text', {
            baseCls: '',
            border: false,
            // ref: '../stoplimitPanel',
            //itemId: 'stoplimitPanel',
            itemId: 'stoplimit',
            columnWidth: !isMobile ? 0.20 : 0.20, //0.28,
            //    autoHeight: true,
            hidden: !stoplimit,
            name: 'stoplimit',
            xtype: 'textfield',
            //vtype: 'prc',
            maskRe: /[-0-9.]/, //filter keys to only accept -, numbers and .
            msgTarget:'none',
            labelAlign: 'top',
            labelPad: '2',
            fieldLabel: languageFormat.getLanguage(20842, 'TriggerPrice'),
            inputType: this.fieldType,
            labelStyle: ' position: relative; top: 4px;text-align:left;',
            style: 'padding-right:3px;',
            width: 80,
            allowBlank: true,
            listeners: {
                render: function (thisComp) {
                    panel.initializeOrderPadDragZone(thisComp);
                    panel.initializeOrderPadDropZone(thisComp);
                },
                keyup: function () {
                    // TODO:
                    //                    var val = this.getRawValue();
                    //                    if (panel.chkPrc()) {
                    //                        if (val && val.length>1 && !panel.prcKeyUpTest.test(val)){
                    //                            this.setValue('');
                    //                        }
                    //                    } else {
                    //                        if (panel.getExCode() == 'MY') {
                    //                            if (!panel.prcKeyUpTestMY.test(val)) {
                    //                                this.setValue('');
                    //                            }
                    //                        }
                    //                    }
                }
            }
        });

        panel.compRef.minQtyCt = Ext.create('Ext.form.field.Text', {
            //itemId: 'minqtyPanel',
            itemId: 'minqty',
            baseCls: '',
            border: false,
            columnWidth: !isMobile ? 0.20 : 0.20, //0.3,
            hidden: !minqty,
            // ref: '../../minqty',
            fieldLabel: languageFormat.getLanguage(20843, 'Min Qty'),
            labelStyle: ' position: relative; top: 4px;text-align:left;',
            labelAlign: 'top',
            labelPad: '2',
            //        style: 'text-align: right;',
            vtype: N2N_CONFIG.orderRoundQty ? 'roundQty' : 'minqty',
            msgTarget: panel._elMsgTarget,
            name: 'minqty',
            inputType: this.fieldType,
            width: 70,
            enableKeyEvents: true,
            getSubmitValue: panel._submitValueFn(),
            fieldStyle: 'text-transform:uppercase',
            maxLength: panel._maxQtyLength,
            maxLengthText: N2N_CONFIG.orderRoundQty ? '' : languageFormat.getLanguage(30245, 'The maximum length for this field is {0}'),
            listeners: {
                render: function (thisComp) {
                    panel.initializeOrderPadDragZone(thisComp);
                    panel.initializeOrderPadDropZone(thisComp);
                },
                afterrender: function (thisComp) {
                    if (isMobile) {
                        thisComp.getEl().down('input').set({pattern: '[0-9]*'});
                    }
                },
                change: function () {
                    panel.setMsgBox();
                },
                keyup: function () {
                    panel.setMsgBox();
                    // TODO:
                    //                    if (this.getRawValue() && !panel.minQtyTest.test(this.getRawValue())) {
                    //                        this.setValue('');
                    //                    }
                },
                focus: function(thisTf) {
                    panel._removeDigitComma(thisTf);
                },
                blur: panel._getBlurHandler()     
            },
            allowBlank: true
        });

        panel.compRef.setCurCt = Ext.create('Ext.form.ComboBox', {
            // ref: '../settcurrPanel',
            //itemId: 'settcurrPanel',
            itemId: 'settcurr',
            baseCls: '',
            border: false,
            columnWidth: !isMobile ? 0.20 : 0.20, //0.3,
            hidden: !settcurr,
            // ref: '../../settcurr',
            queryMode: 'local',
            triggerAction: 'all',
            editable: false,
            displayField: 'desc',
            valueField: 'code',
            labelAlign: 'top',
            labelPad: '2',
            fieldLabel: languageFormat.getLanguage(20844, 'Sett. Curr.'),
            msgTarget: 'none',
            labelStyle: ' position: relative; top: 4px;text-align:left;',
            style: '',
            name: 'settcurr',
            //  minHeight: 60,
            width: 70,
            scroll: true,
            store: new Ext.data.ArrayStore({
                fields: ['code', 'desc'],
                data: panel.arCurrencyList
            }),
            listeners: {
                render: function (thisComp) {
                    panel.initializeOrderPadDragZone(thisComp);
                    panel.initializeOrderPadDropZone(thisComp);
                },
                select: function () {
                    panel.isDisableToClear = true;
                    panel.setSettCurr(this.value);
                    panel.setMsgBox();
                    if (panel.getPayment() == 'CUT') {
                        panel.callAccBal();
                    }
                }
            }
        });
        panel.compRef.paymentCt = Ext.create('Ext.form.ComboBox', {
            baseCls: '',
            border: false,
            // ref: '../paymentPanel',
            //itemId: 'paymentPanel',
            itemId: 'payment',
            columnWidth: !isMobile ? 0.20 : 0.20, //0.28,
            autoHeight: true,
            hidden: !payment,
            // ref: '../../payment',
            queryMode: 'local',
            triggerAction: 'all',
            editable: false,
            displayField: 'code',
            valueField: 'code',
            fieldLabel: languageFormat.getLanguage(20845, 'Payment'),
            msgTarget: 'none',
            labelAlign: 'top',
            labelPad: '2',
            labelStyle: ' position: relative; top: 4px',
            style: 'padding-left: 2px;cursor: pointer',
            name: 'payment',
            // minHeight: 60,
            width: 70,
            scroll: true,
            store: new Ext.data.ArrayStore({
                fields: ['code', 'desc'],
                data: panel.arPaymentList
            }),
            listeners: {
                render: function (thisComp) {
                    panel.initializeOrderPadDragZone(thisComp);
                    panel.initializeOrderPadDropZone(thisComp);
                },
                beforeselect: function (cbo, rec, idx) {
                    panel.lastPayment = this.value;
                    panel.tempLastPayment = this.value;
                },
                select: function () {
                    panel.isDisableToClear = true;
                    panel.lastPayment = this.value;
                    var payment = this.value;
                    panel.setPayment(payment);
                    panel.callStkInfo();
                    //panel.setMsgBox();
                    if (payment == 'CUT' || panel.tempLastPayment == 'CUT') {
                        panel.callAccBal();
                    }
                }
            }
        });
        panel.compRef.stratCt = Ext.create('Ext.form.field.ComboBox', {
            baseCls: '',
            border: false,
            // ref: '../strategyPanel',
            //itemId: 'strategyPanel',
            itemId: 'strategy',
            columnWidth: !isMobile ? 0.20 : 0.20, //0.28,
            autoHeight: true,
            hidden: !strategy,
            // ref: '../../strategy',
            //xtype: 'combo',
            queryMode: 'local',
            triggerAction: 'all',
            editable: false,
            displayField: 'code',
            valueField: 'code',
            fieldLabel: 'Strategy',
            msgTarget: 'none',
            labelAlign: 'top',
            labelPad: '2',
            name: 'strategy',
            style: "padding-right:3px;",
            //    minHeight: 60,
            width: 70,
            scroll: true,
            store: new Ext.data.ArrayStore({
                fields: ['code', 'desc'],
                data: []
            })
        });
        
        panel.compRef.cfdCt = Ext.create('Ext.form.FieldSet', {//'Ext.container.Container', {
        	title: '<b>' + languageFormat.getLanguage(20869, 'Take Profit/Stop Loss') + '</b>',
        	style: 'margin-top:5px;',
        	itemId: 'cfdPanel',
        	collapsible: true,
        	collapsed: true,
        	//style: 'padding-left:5px;padding-top:10px;padding-bottom:0px;margin:0px',
        	defaults: {
        		labelWidth: 89,
        		anchor: '100%',
        		layout: {
        			type: 'hbox',
        			defaultMargins: {top: 0, right: 5, bottom: 0, left: 0}
        		}
        	},
        	listeners:{
        		hide: function(fieldset){
        			if(fieldset.collapsed == false){
        				if(panel.isBasic){
        					panel.trdForm.down('#cfdPanel').collapse();
        				}
        			}
        		},
        		expand: function(fieldset){
                                panel.compRef.cfdHeight = fieldset.getHeight();
        			panel._setCtSize();
        		},
        		collapse: function(fieldset){
                                panel.compRef.cfdHeight = fieldset.getHeight();
        			panel._setCtSize();
        		}
        	},
        	items: [{
        		xtype: 'container',
        		layout: {
        			type: 'vbox'
        		},
        		items: [
        		        {
        		        	xtype: 'checkbox',
        		        	itemId: 'chkTakeProfit',
        		        	name: 'chkTakeProfit',
        		        	boxLabel: languageFormat.getLanguage(20870, 'Take Profit'),
        		        	listeners: {
        		        		change: function (thisComp) {
        		        			if(thisComp.getValue()){
            		        			thisComp.nextSibling().enable();
        		        			}else{
            		        			thisComp.nextSibling().disable();
        		        			}
        		        		}
        		        	}
        		        },
        		        {
        		        	xtype: 'container',
        		        	disabled: true,
        		        	layout: {
        		        		type: 'hbox'
        		        	},
        		        	items: [
        		        	        {
        		        	        	xtype: 'combobox',
        		        	        	itemId: 'ordTypeTakeProfit',
        		        	        	name: 'ordTypeTakeProfit',
        		        	        	labelAlign: 'top',
        		        	        	queryMode: 'local',
        		        	            triggerAction: 'all',
        		        	        	fieldLabel: languageFormat.getLanguage(20837, 'Order Type'),
        		        	        	style: 'padding-right:3px;',
        		        	        	displayField: 'desc',
        		        	        	valueField: 'code',
        		        	        	store: new Ext.data.ArrayStore({
        		        	        		fields: ['code', 'desc'],
        		        	        		data: panel.arTakeProfitOrderTypeList
        		        	        	}),
        		        	        	listeners:{
        		        	        		beforeselect: function (cbo, rec, idx) {
        		                                panel.lastTakeProfitOrdType = this.value;
        		                            },
        		                            select: function (cbo, rec, idx) {
        		                            	panel.isDisableToClear = true;
         		                                panel.lastTakeProfitOrdType = this.value;
        		        	                    var mode = panel.mode;

        		        	                    if (mode == modeOrdBuy || mode == modeOrdSell) {
        		        	                        panel.setOrderPanelBuySellRule(panel.exchangecode);
        		        	                    } else if (mode == modeOrdRevise) {// || mode==modeOrdCancel){
        		        	                        panel.setOrderPanelReviseRule();
        		        	                    }
        		        	                }
        		        	        	}
        		        	        },{
        		        	        	xtype: 'textfield',
        		        	        	itemId: 'priceTakeProfit',
        		        	        	name: 'priceTakeProfit',
        		        	        	fieldLabel: languageFormat.getLanguage(20871, 'Value'),
        		        	        	labelAlign: 'top',
        		        	        	width: 65,
        		        	        	style: 'padding-right:3px;',
        		        	        	allowBlank: true
        		        	        }, {
        		        	        	xtype: 'combobox',
        		        	        	itemId: 'cfdostype_0',
        		        	        	name: 'cfdostype_0',
        		        	        	queryMode: 'local',
        		        	            triggerAction: 'all',
        		        	        	fieldLabel: languageFormat.getLanguage(20872, 'Unit'),
        		        	        	width: 95,
        		        	        	labelAlign: 'top',
        		        	        	style: 'padding-right:3px;',
        		        	        	displayField: 'desc',
        		        	        	valueField: 'code',
        		        	        	store: new Ext.data.ArrayStore({
        		        	        		fields: ['code', 'desc'],
        		        	        		data: panel.arCFDOffsetTypeList
        		        	        	})
        		        	        }]
        		        }]

        	}, {
        		xtype: 'container',
        		layout: {
        			type: 'vbox'
        		},
        		style: 'padding-top:10px;',
        		items: [
        		        {
        		        	xtype: 'checkbox',
        		        	itemId: 'chkCutLoss',
        		        	name: 'chkCutLoss',
        		        	boxLabel: languageFormat.getLanguage(20873, 'Stop Loss'),
        		        	listeners: {
        		        		change: function (thisComp) {
        		        			if(thisComp.getValue()){
            		        			thisComp.nextSibling().enable();
        		        			}else{
            		        			thisComp.nextSibling().disable();
        		        			}
        		        		}
        		        	}
        		        },
        		        {
        		        	xtype: 'container',
        		        	disabled:true,
        		        	layout: {
        		        		type: 'hbox'
        		        	},
        		        	items: [
        		        	        {
        		        	        	xtype: 'combobox',
        		        	        	itemId: 'ordTypeCutLoss',
        		        	        	name: 'ordTypeCutLoss',
        		        	        	labelAlign: 'top',
        		        	        	queryMode: 'local',
        		        	            triggerAction: 'all',
        		        	        	fieldLabel: languageFormat.getLanguage(20837, 'Order Type'),
        		        	        	width: 80,
        		        	        	style: 'padding-right:3px;',
        		        	        	displayField: 'desc',
        		        	        	valueField: 'code',
        		        	        	store: new Ext.data.ArrayStore({
        		        	        		fields: ['code', 'desc'],
        		        	        		data: panel.arStopLossOrderTypeList
        		        	        	}),
        		        	        	listeners:{
        		        	        		beforeselect: function (cbo, rec, idx) {
        		                                panel.lastStopLossOrdType = this.value;
        		                            },
        		                            select: function (cbo, rec, idx) {
        		                            	panel.isDisableToClear = true;
         		                                panel.lastStopLossOrdType = this.value;
         		                                if(panel.lastStopLossOrdType == 'TrailingStop'){
         		                                	panel.trdForm.down('#cfdPanel').down('#chkTakeProfit').setValue(false);
         		                                	panel.trdForm.down('#cfdPanel').down('#chkTakeProfit').disable();
         		                                	panel.trdForm.down('#cfdPanel').down('#chkTakeProfit').nextSibling().disable();
         		                                }else{
         		                                	panel.trdForm.down('#cfdPanel').down('#chkTakeProfit').enable();
         		                                }
         		                                
        		        	                    var mode = panel.mode;

        		        	                    if (mode == modeOrdBuy || mode == modeOrdSell) {
        		        	                        panel.setOrderPanelBuySellRule(panel.exchangecode);
        		        	                    } else if (mode == modeOrdRevise) {// || mode==modeOrdCancel){
        		        	                        panel.setOrderPanelReviseRule();
        		        	                    }
        		        	                }
        		        	        	}
        		        	        },{
        		        	        	xtype: 'textfield',
        		        	        	itemId: 'priceCutLoss',
        		        	        	name: 'priceCutLoss',
        		        	        	fieldLabel: languageFormat.getLanguage(20871, 'Value'),
        		        	        	width: 65,
        		        	        	labelAlign: 'top',
        		        	        	style: 'padding-right:3px;',
        		        	        	allowBlank: true
        		        	        }, {
        		        	        	xtype: 'combobox',
        		        	        	itemId: 'cfdostype_1',
        		        	        	name: 'cfdostype_1',
        		        	        	queryMode: 'local',
        		        	            triggerAction: 'all',
        		        	        	fieldLabel: languageFormat.getLanguage(20872, 'Unit'),
        		        	        	width: 75,
        		        	        	labelAlign: 'top',
        		        	        	style: 'padding-right:3px;',
        		        	        	displayField: 'desc',
        		        	        	valueField: 'code',
        		        	        	store: new Ext.data.ArrayStore({
        		        	        		fields: ['code', 'desc'],
        		        	        		data: panel.arCFDOffsetTypeList
        		        	        	})
        		        	        },{
        		        	        	xtype: 'textfield',
        		        	        	itemId: 'tggrpriceCutLoss',
        		        	        	name: 'tggrpriceCutLoss',
        		        	        	fieldLabel: languageFormat.getLanguage(20850, 'TriggerPrice'),
        		        	        	width: 65,
        		        	        	labelAlign: 'top',
        		        	        	style: 'padding-right:3px;',
        		        	        	allowBlank: true
        		        	        }]
        		        }]

        	}]
        });

        //if (!isMobile) {
        panel.row2Items.push(panel.compRef.validityCt);
        panel.row2Items.push(panel.compRef.dsqtyPanel);
        panel.row2Items.push(panel.compRef.tpTypeCt);
        panel.row2Items.push(panel.compRef.tpDirectionCt);
        panel.row2Items.push(panel.compRef.stopLimitCt);
        panel.row2Items.push(panel.compRef.minQtyCt);
        panel.row2Items.push(panel.compRef.setCurCt);
        panel.row2Items.push(panel.compRef.paymentCt);
        panel.row2Items.push(panel.compRef.stratCt);
        //}

        var ordPadCookie = cookies.readCookie('_OrdPadRowSettings_');

        if (ordPadCookie != null) {
            var tempRowArray = new Array();
            var ordPadCookieArr = ordPadCookie.split('|');
            for (var i = 0; i < ordPadCookieArr.length; i++) {
                for (var j = 0; j < panel.row2Items.length; j++) {
                    if (ordPadCookieArr[i] == panel.row2Items[j].itemId) {
                        tempRowArray.push(panel.row2Items[j]);
                        break;
                    }
                }
            }

            panel.row2Items = tempRowArray;
        }

        panel.inputRow2 = new Ext.container.Container({
            baseCls: '',
            border: false,
            labelAlign: 'top',
            layout: 'column',
            style: 'padding-left:5px;padding-top:0px;padding-bottom:0px;margin:0px',
            defaults: {
                style: "padding-right:2px;",
                labelStyle: "text-align:left"
            },
            items: panel.row2Items
        });

        /*
         var row3Items = new Array();
         if (!isMobile) {
         row3Items.push(panel.compRef.stopLimitCt);
         row3Items.push(panel.compRef.minQtyCt);
         } else {
         row3Items.push(panel.compRef.validityCt);
         }
         row3Items.push(panel.compRef.setCurCt);
         row3Items.push(panel.compRef.paymentCt);
         row3Items.push(panel.compRef.stratCt);
         
         var inputRow3 = new Ext.container.Container({
         baseCls: '',
         border: false,
         labelAlign: 'top',
         layout: 'column',
         style: 'padding-left:5px;padding-top:0px;padding-bottom:0px;margin:0px',
         defaults: {
         style: "padding-right:2px;"
         },
         items: row3Items
         });
         */
        var inputRow4 = new Ext.container.Container({
            baseCls: '',
            border: false,
            labelAlign: 'top',
            layout: 'column',
            itemId: 'row4Cnt',
            style: 'padding-left:5px;padding-top:0px;padding-bottom:0px;margin:0px;font-size:12px',
            items: [
                {
                    // ref: '../shortsellPanel',
                    itemId: 'shortsellPanel',
                    baseCls: '',
                    border: false,
                    columnWidth: 0.30,
                    //style: 'padding-left:3px;',
                    hidden: true,
                    items: [
                        {
                            // ref: '../../shortsell',
                            itemId: 'shortsell',
                            xtype: 'checkbox',
                            boxLabel: '<span style="font-weight:normal">' + languageFormat.getLanguage(20848, 'Short Sell') + '</span>',
                            labelStyle: 'padding-left:5px;',
                            labelSeparator: '',
                            name: 'shortsell',
                            listeners: {
                                change: function (el, val) {
                                    panel.shortsell = val;
                                }
                            },
                            anchor: '98%',
                            allowBlank: true
                        }
                    ]
                }, {
                    //ref: '../privateOrdPanel',
                    itemId: 'privateOrdPanel',
                    baseCls: '',
                    border: false,
                    columnWidth: 0.20,
                    //style: 'padding-left:3px;',
                    hidden: !privateOrd,
                    items: [
                        {
                            //ref: '../../privateOrd',
                            itemId: 'privateOrd',
                            xtype: 'checkbox',
                            boxLabel: '<span style="font-weight:normal">' + languageFormat.getLanguage(20874, 'Private') + '</span>',
                            labelStyle: 'padding-left:5px;',
                            labelSeparator: '',
                            name: 'privateOrd',
                            listeners: {
                                check: function (el, val) {
                                    panel.privateOrd = val;
                                }
                            },
                            anchor: '98%',
                            allowBlank: true
                        }
                    ]
                }, {
                    // ref: '../forceorderPanel',
                    itemId: 'forceorderPanel',
                    baseCls: '',
                    border: false,
                    columnWidth: 0.25,
                    style: 'padding-left:3px;',
                    hidden: !forceord,
                    items: [
                        {
                            // ref: '../../forceorder',
                            itemId: 'forceorder',
                            xtype: 'checkbox',
                            boxLabel: '<span style="font-weight:normal">' + languageFormat.getLanguage(20859, 'Force Order') + '</span>',
                            labelStyle: 'padding-left:5px;',
                            labelSeparator: '',
                            name: 'forceorder',
                            listeners: {
                                change: function (el, val) {
                                    panel.forceorder = val;
                                }
                            },
                            anchor: '98%',
                            allowBlank: true
                        }
                    ]
                }, {
                    // ref: '../forcequeuePanel',
                    itemId: 'forcequeuePanel',
                    baseCls: '',
                    border: false,
                    columnWidth: 0.25,
                    style: 'padding-left:3px;',
                    hidden: !forcequeue,
                    items: [
                        {
                            // ref: '../../forcequeue',
                            itemId: 'forcequeue',
                            xtype: 'checkbox',
                            boxLabel: '<span style="font-weight:normal">' + languageFormat.getLanguage(20860, 'Force Queue') + '</span>',
                            labelStyle: 'padding-left:5px;',
                            labelSeparator: '',
                            name: 'forcequeue',
                            listeners: {
                                change: function (el, val) {
                                    panel.forcequeue = val;
                                }
                            },
                            anchor: '98%',
                            allowBlank: true
                        }
                    ]
                }, {
                    // ref: '../amalgamatePanel',
                    itemId: 'amalgamatePanel',
                    baseCls: '',
                    border: false,
                    columnWidth: 0.25,
                    style: 'padding-left:3px;',
                    hidden: !amalgamation,
                    items: [
                        {
                            // ref: '../../amalgamate',
                            itemId: 'amalgamate',
                            xtype: 'checkbox',
                            boxLabel: '<span style="font-weight:normal">' + languageFormat.getLanguage(20861, 'Amalgamate') + '</span>',
                            labelStyle: 'padding-left:5px;',
                            labelSeparator: '',
                            name: 'amalgamate',
                            listeners: {
                                change: function (el, val) {
                                    panel.amalgamate = val;
                                }
                            },
                            anchor: '98%',
                            allowBlank: true
                        }
                    ]
                }
            ]
        });

        /*var inputRow5 = null;
         if (isMobile) {
         var row5Items = [
         panel.compRef.dsqtyPanel,
         panel.compRef.stopLimitCt,
         panel.compRef.minQtyCt
         ];
         inputRow5 = Ext.create('Ext.container.Container', {
         baseCls: '',
         border: false,
         labelAlign: 'top',
         layout: 'column',
         style: 'padding-left:5px;padding-top:0px;padding-bottom:0px;margin:0px',
         items: row5Items
         });
         }*/

        var msgStyle = 'padding:3px;height:156px;background-color:white;border:lightgrey 1px solid;overflow:auto;color:#000;';
        if (isMobile) {
            msgStyle = 'padding:3px;background-color:white;border:lightgrey 1px solid;overflow:auto;color:#000;';
        }
        var msgPanel = new Ext.container.Container({
            baseCls: '',
            border: false,
            columnWidth: 0.35, //0.45,
            layout: 'form',
            style: !isMobile ? 'padding-top: 0px; padding-left: 0px; padding-right: 3px;' : 'padding-right:5px;padding-left:0px;margin-top: 10px',
            items: [
                {
                    //        ref: '../../../msgBox',
                    itemId: 'msgBox',
                    xtype: 'box',
                    autoEl: {
                        tag: 'div',
                        style: msgStyle,
                        html: panel.selSymbolMsg
                    },
                    anchor: '98%'
                }
            ]
        });

        var inPanelItems = new Array();
        if (global_personalizationTheme.indexOf("wh") != -1) {
            inPanelItems.push({
                xtype: "container",
                width: "100%",
                style: "padding: 0px; margin: 0px;",
                html: '<table border=0 style="width:100%;height:14px;" cellspacing="0px" cellpadding="0px"><tr><td id="trdLimitCol" style="text-align:left;overflow:hidden;white-space:nowrap;padding-left:4px;border-collapse:collapse;"><span  id="accountno_label2" style="display:inline-block;text-align:right;" ></span></td>' +
                        '<td style="padding-right:4px;width:50px;text-align:right;padding-top:2px;"><span id="btnbasic" style="background-position:0 0;"></span>&nbsp;<span id="sbtnlimit" style="background-position:0 0;display:block;float:right;"></span></td>' +
                        '</tr></table>'
            });
        }
        inPanelItems.push(inputRow1);
        inPanelItems.push(panel.inputRow2);
        //inPanelItems.push(inputRow3);
        if(sCFDMenu){
        	inPanelItems.push(panel.compRef.cfdCt);
        }
        inPanelItems.push(inputRow4);

        /*
         if (isMobile) {
         inPanelItems.push(inputRow5);
         //inPanelItems.push(msgPanel);
         }*/

        var inPanel = new Ext.container.Container({
            // ref: '../../inPanel',
            itemId: 'inPanel',
            columnWidth: !isMobile ? 0.65 : 1, //0.55,
            baseCls: '',
            border: false,
            defaults: {
                bodyStyle: 'padding:0px;margin:0px'
            },
            items: inPanelItems
        });

        var fz = 'font-size: 1em';
        
        var optPanel = new Ext.container.Container({
            baseCls: '',
            border: false,
            columnWidth: !isMobile ? 0.65 : 1,
            layout: 'table',
            style: 'padding-left:5px;padding-top:3px;background-color: none;',
            items: [
                {
                    // ref: '../../../../skipconfirm',
                    itemId: 'skipconfirm',
                    width: 130,
                    xtype: 'checkbox',
                    hideLabel: true,
                    boxLabel: '<span style="font-weight:normal;' + fz + ';white-space:nowrap">' + languageFormat.getLanguage(20846, 'Skip Confirmation') + '</span>',
                    msgTarget: 'none',
                    labelStyle: 'padding-left:5px;' + fz,
                    labelSeparator: '',
                    name: 'skipconfirm',
                    hidden: !skipconfm,
                    cls: 'cssreset',
                    listeners: {
                        change: function (el, val) {
                            panel.saveConf = val;
                            // need to store keep confirm as global since orderpad might not need to exist anymore
                            n2nLayoutManager.orderSkipConfirm = val;
                        }
                    }
                },
                {
                    baseCls: '',
                    layout: {
                        type: 'table',
                        columns: 3
                    },
                    items: [{
                            baseCls: '',
                            width: 110,
                            items: [
                                {
                                    // ref: '../../../../../pin',
                                    itemId: 'pin',
                                    xtype: 'textfield',
                                    labelWidth: 50,
                                    vtype: 'pin',
                                    msgTarget: 'none',
                                    //invalidClass: 'ordpad-invalid',
                                    inputType: 'password',
                                    enforceMaxLength: true,
                                    maxLength: 6,
                                    //      inputWidth: 60,
                                    fieldLabel: languageFormat.getLanguage(20847, 'Trading Pin'),
                                    style: 'text-align: right',
                                    name: 'pin',
                                    width: "100%",
                                    hidden: panel.checkIsHidePin(), //1.3.24.5 check category, if match then hide pin
                                    cls: 'pin-input',
                                    listeners: {
                                        afterrender: function(thisField) {
                                            // reset current autofill
                                            thisField.inputEl.set({
                                                autocomplete: 'new-password'
                                            });
                                        },
                                        blur: function (el) {
                                            panel.lastPin = el.getValue();
                                        },
                                        focus: function () {
                                            if (touchMode) {
                                                var el = this;
                                                var val = el.getRawValue();
                                                var task = new Ext.util.DelayedTask(function () {
                                                    var obj = el.getEl().dom;
                                                    setCursorPosition(obj, val.length);
                                                    task.cancel();
                                                });
                                                task.delay(100);
                                            }
                                        }
                                    }
                                }
                            ]
                        }, {
                            baseCls: '',
                            border: false,
                            style: 'padding-left:5px;padding-top:1px;',
                            items: [
                                {
                                    // ref: '../../../../../chkSavePin',
                                    xtype: 'checkbox',
                                    width: 45,
                                    itemId: 'chkSavePin',
                                    name: 'chkSavePin',
                                    hidden: panel.checkIsHidePin(), //1.3.24.5 check category, if match then hide pin
                                    hideLabel: true,
                                    boxLabel: '<img style="width: 16px; height: 16px;" src="' + iconSaveOrdPad + '"/>',
                                    listeners: {
                                        change: function (thisComp, val) {
                                            panel.savePin = val;
                                        }
                                    }
                                }
                            ]
                        }, {
                            baseCls: '',
                            border: false,
                            hidden: panel.checkIsHidePin() //1.3.24.5 check category, if match then hide pin
                        }]
                }
            ]
        });
        if (!isMobile) {
            if (global_personalizationTheme.indexOf("wh") == -1) {
                optPanel.add(panel.btnBasic);
            }
        }
        var autoHeight = null;
        if (isMobile) {
            autoHeight = '100%';
        }
        var btnWidth = 60;
        if (global_personalizationTheme.indexOf("wh") != -1) {
            btnWidth = 75;
        }
        var btnSubmit = {
            // ref: 'btnSubmit',
            xtype: 'button',
            itemId: 'btnSubmit',
            autoWidth: false,
            //   style: 'background:#fff;width:95%;',
            width: !isMobile ? btnWidth : 80,
            text: languageFormat.getLanguage(20849, 'Submit'),
            height: autoHeight,
            cls: 'bigbtn',
            handler: function () {

                var act = panel.trdForm.down('#OrdPad').down('#act').getValue();
                panel.act = act;
                if (act == modeOrdBuy) {
                    panel.submitBuy();
                } else if (act == modeOrdSell) {
                    panel.submitSell();
                } else if (act == modeOrdCancel) {
                    panel.submitCancel();
                } else if (act == modeOrdRevise) {
                    panel.submitRevise();
                } else {
                    msgutil.alert(panel.selSymbolMsg);
                }

            }
        };
        var btnReset = {
            // ref: 'btnReset',
            itemId: 'btnReset',
            autoWidth: false,
            xtype: 'button',
//            style: 'background-color:#fff;',
            // style: 'width:95%',
            width: btnWidth,
            height: autoHeight,
            text: languageFormat.getLanguage(10003, 'Reset').toUpperCase(),
            margin: '0 0 0 3',
            handler: function () {
                var savePin = panel.savePin;
                var saveConf = panel.saveConf;
                var pin = '';
                if (savePin) {
                    pin = panel.lastPin;
                }
                panel.trdForm.getForm().reset();
                panel.savePin = savePin;
                panel.saveConf = saveConf;
                panel.lastPin = pin;
                panel.setSetting();
                panel.reset();
                if (panel.compRef.marketDepth) {
                    panel.compRef.marketDepth.createMarketDepth();
                }
                panel.resetPanel();
                panel.selectActionMode();
                panel.setBGColor();
            }
        };

        panel.compRef.btnSubmit = Ext.create('Ext.button.Button', btnSubmit);
        panel.compRef.btnReset = Ext.create('Ext.button.Button', btnReset);

        var ex = Ext.create('widget.hiddenfield', {
            // ref: 'ex',
            itemId: 'ex',
            xtype: 'hiddenfield',
            name: 'ex'
        });
        var act = Ext.create('widget.hiddenfield', {
            // ref: 'act',
            itemId: 'act',
            xtype: 'hiddenfield',
            name: 'act',
            value: panel.lastAction ? panel.lastAction : ''
        });
        var tktno = Ext.create('widget.hiddenfield',
                {
                    // ref: 'tktno',
                    itemId: 'tktno',
                    xtype: 'hiddenfield',
                    name: 'tktno'
                }
        );
        var ordno = Ext.create('widget.hiddenfield', {
            // ref: 'ordno',
            itemId: 'ordno',
            xtype: 'hiddenfield',
            name: 'ordno'
        });
        var subordno = Ext.create('widget.hiddenfield', {
            // ref: 'subordno',
            itemId: 'subordno',
            xtype: 'hiddenfield',
            name: 'subordno'
        });
        var stkcode = Ext.create('widget.hiddenfield', {
            itemId: 'stkcode',
            xtype: 'hiddenfield',
            name: 'stkcode'
        });
        var ac = Ext.create('widget.hiddenfield', {
            // ref: 'ac',
            itemId: 'ac',
            xtype: 'hiddenfield',
            name: 'ac'
        });
        var cc = Ext.create('widget.hiddenfield', {
            // ref: 'cc',
            itemId: 'cc',
            xtype: 'hiddenfield',
            name: 'cc'
        });
        var lotsize = Ext.create('widget.hiddenfield', {
            // ref: 'lotsize',
            itemId: 'lotsize',
            xtype: 'hiddenfield',
            name: 'lotsize'
        });
        var validity = Ext.create('widget.hiddenfield', {
            // ref: 'validity',
            itemId: 'validity',
            xtype: 'hiddenfield',
            name: 'validity'
        });
        var gtd = Ext.create('widget.hiddenfield', {
            // ref: 'gtd',
            itemId: 'gtd',
            xtype: 'hiddenfield',
            name: 'gtd'
        });
        var pin2 = Ext.create('widget.hiddenfield', {
            // ref: 'pin2',
            itemId: 'pin2',
            name: 'pin2',
            xtype: 'hiddenfield'
        });
        var confirm = Ext.create('widget.hiddenfield', {
            // ref: 'confirm',
            itemId: 'confirm',
            name: 'confirm',
            xtype: 'hiddenfield'
        });

        var innerMainCtConfItemsConf = {
            baseCls: '',
            border: false,
            layout: 'column'
        };
        if (isMobile) {
            innerMainCtConfItemsConf.width = '98%';
            //innerMainCtConfItemsConf.maxWidth = 425;
            innerMainCtConfItemsConf.items = [inPanel, optPanel];
        } else {
            var btnPanel = Ext.create('Ext.container.Container', {
                itemId: 'btnPanel',
                baseCls: '',
                border: false,
                columnWidth: 0.35,
                style: 'text-align:center;padding:3px 5px 5px 0px',
                items: [panel.compRef.btnSubmit, panel.compRef.btnReset]
            });
            
            innerMainCtConfItemsConf.width = '100%';
            innerMainCtConfItemsConf.items = [optPanel, btnPanel];
        }
        var innerMainCtConf = {
            region: 'center',
            border: false,
            items: [
                innerMainCtConfItemsConf
            ]
        };
        if (isMobile) {
            innerMainCtConf.layout = 'fit';
        } else {
            innerMainCtConf.height = 30;
        }

        var tempOrdPadHeight = 170;
        if (!n2nLayoutManager.isWindowLayout() && Ext.isIE) {
            tempOrdPadHeight = 176;
        }
        if (isTablet) {
            tempOrdPadHeight = 180;
        }

        panel.compRef.innerMainCt = Ext.create('Ext.container.Container', innerMainCtConf);

        panel.compRef.mainCt = Ext.create('Ext.container.Container', {
            baseCls: '',
            border: false,
            // ref: 'OrdPad',
            itemId: 'OrdPad',
            layout: 'border',
            height: 207,
            width: '100%',
            bodyCssClass: N2NCSS.OrderPad_Default,
            items: [
                ex,
                act,
                tktno,
                ordno,
                subordno,
                stkcode,
                ac,
                cc,
                lotsize,
                validity,
                gtd,
                pin2,
                confirm,
                {
                    itemId: 'prevaction',
                    name: 'prevaction',
                    xtype: 'hiddenfield'
                },
                {
                    itemId: 'branchcode',
                    name: 'branchcode',
                    xtype: 'hiddenfield'
                },
                {
                    itemId: 'unmtqty',
                    name: 'unmtqty',
                    xtype: 'hiddenfield'
                },
                {
                    itemId: 'mtqty',
                    name: 'mtqty',
                    xtype: 'hiddenfield'
                },
                {
                    itemId: 'brokercode',
                    name: 'brokercode',
                    xtype: 'hiddenfield'
                },
                {
                    itemId: 'northCt',
                    region: 'north',
                    height: !isMobile ? tempOrdPadHeight : 0,
                    hidden: isMobile,
                    border: false,
                    items: [
                        {
                            baseCls: '',
                            border: false,
                            layout: 'column',
                            width: '100%',
                            items: !isMobile ? [inPanel, msgPanel] : []
                        }
                    ]
                },
                panel.compRef.innerMainCt
            ]
        });

        panel.trdForm = Ext.create('Ext.form.Panel', {
            baseCls: '',
            flex: 2,
            border: false,
            style: 'spacing:0px; padding:0px; margin:0px;',
            itemId: 'OrdForm',
            method: 'POST',
            monitorValid: true,
            url: 'trade2.jsp',
            items: [panel.compRef.mainCt],
            autoScroll: true,
            listeners: {
                resize: function (thisComp, newWidth, newHeight, oldWidth, oldHeight) {
                    if (isMobile) {
                        if (panel.debug) {
                            console.log('OrderPad trdForm resize...');
                            console.log({
                                newWidth: newWidth,
                                newHeight: newHeight,
                                oldWidth: oldWidth,
                                oldHeight: oldHeight
                            });
                        }

                        if (!panel._runningSetCtSize) {
                            panel._setCtSize();
                        }
                    }
                }
            }
        });

        panel.datePicker = new Ext.picker.Date({
            //startDay: 1,
            minDate: Ext.Date.clearTime(new Date()),
            maxDate: null, // new Date().add(Date.DAY, 89).clearTime(),
            listeners: {
                select: function (datePicker, date) {
//                    var ordPad = panel.trdForm.down('#OrdPad');
//                    var input = panel.trdForm.down('#inPanel');
//                    input.lblGTD.setValue(Ext.Date.format(date,'d/m/Y'));
//                    ordPad.gtd.setValue(Ext.Date.format(date,'Ymd'));
                    panel.setValidityCmb(Ext.Date.format(date, 'd/m/Y'));
                    panel.setGTD(Ext.Date.format(date, 'Ymd'));
                    panel.setGTDLbl(Ext.Date.format(date, 'd/m/Y'));
                    panel.datePickerWin.hide();
                }
            }
        });

        var dtPicker = {
            title: languageFormat.getLanguage(20192, 'GTD Date'),
            closeAction: 'hide',
            plain: true,
            items: [panel.datePicker],
            resizable: false,
            autoShow: false,
            modal: false
        };

        // hardcode for IE
        if (Ext.isIE && !Ext.isIE8) {
            dtPicker.width = 190;
            dtPicker.height = 228;
        }

        panel.datePickerWin = msgutil.popup(dtPicker);

        var bottomBar = null;
        if (isMobile) {
            bottomBar = Ext.create('Ext.toolbar.Toolbar', {
                height: 30,
                items: [panel.btnBasic, '->', panel.compRef.btnSubmit, panel.compRef.btnReset]
            });
        }

        var confItems = new Array();
        if (n2nLayoutManager.isWindowLayout()) {
            var collapsedMD = jsutil.toBoolean(cookies.readCookie('_OrdPad_Collapsed_MD_'));
            panel.compRef.marketDepth = Ext.widget('marketdepth', {
                isMatrix: true,
                height: 119,
                split: true,
                showSearch: false,
                showTotalBidAsk: false,
                type: "depthorderpad",
                collapsed: collapsedMD,
                listeners: {
                    beforedestroy: function(thisMd) {
                        Storage.generateUnsubscriptionByExtComp(thisMd);
                    }
                }
            });

            confItems.push(panel.compRef.marketDepth);
        }
        confItems.push(panel.trdForm);

        if (isMobile) {
            panel.compRef.headerHeight = 67;
            panel.compRef.mdHeight = 150;
            panel.compRef.formHeight = 220;
            panel.compRef.formDiffHeight = 105;
        } else {
            panel.compRef.headerHeight = 23;

            if (global_personalizationTheme.indexOf("wh") != -1) {
                panel.compRef.formHeight = 228;
                panel.compRef.mdHeight = 125;
            } else {
                panel.compRef.mdHeight = 119;
                panel.compRef.formHeight = 212;
            }
            panel.compRef.formDiffHeight = 80;
        }
        
        var compCls = 'orderpad';
        if (Ext.isFirefox) {
            compCls += ' fix_firefox_label';
        }
        
        var defaultConfig = {
            border: false,
            header: false,
            collapsible: true,
            animCollapse: false,
            bodyStyle: 'padding:0px; margin:0px; overflow: auto;',
            //style: 'margin-bottom: 0px;',
            style: 'padding:0px; margin: 0px;',
            cls: compCls,
            items: confItems,
            suspendLayout: !n2nLayoutManager.isWindowLayout(), // needed for performance
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            bbar: bottomBar,
            autoEl: {
                tag: 'form',
                autocomplete: 'off'
            },
            listeners: {
                afterrender: function (p) {
                    panel.setBGColor();
                    panel.loadMask = new Ext.LoadMask({
                        msg: languageFormat.getLanguage(10017, 'Loading...'),
                        target: p
                    });
                    //   panel.callAccBal();
                    /*
                     if (panel.compRef.marketDepth && !isMobile) {
                     panel.trdForm.addTool([{
                     xtype: 'button',
                     icon: ICON.MD,
                     enableToggle: true,
                     pressed: !collapsedMD,
                     toggleHandler: function() {
                     panel.compRef.marketDepth.toggleCollapse();
                     
                     collapsedMD = panel.compRef.marketDepth.getCollapsed() ? true : false;
                     cookies.createCookie('_OrdPad_Collapsed_MD_', collapsedMD, 1800);
                     panel._setCtSize();
                     }
                     }]);
                     }
                     */
                    if (N2N_CONFIG.orderPadBasic) {
                        panel.advBasicComponent();
                    }
                        	}
                        }
        };

        Ext.apply(this, defaultConfig);
        this.callParent(arguments);
        panel.isReady = true;

//        panel.callAccBal();
    },
    adjustComps: function() {
        var panel = this;

        helper.runAfterCompRendered(panel, function() {
            if (n2nLayoutManager.isWindowLayout() && !isMobile) { // for desktop only
                if (panel.mt === 'p') { // display market depth only in popup
                    var collapsedMD = jsutil.toBoolean(cookies.readCookie('_OrdPad_Collapsed_MD_'));
                    if (collapsedMD) {
                        panel.compRef.marketDepth.collapse();
                    } else {
                        panel.compRef.marketDepth.expand();
                    }
                } else if (panel.compRef.marketDepth) {
                    panel.compRef.marketDepth.collapse();
                }
            }
            panel._setCtSize();
        });
    },
    updateMarketDepth: function (stkcode, stkname) {
        var panel = this;
        
        if (panel.compRef.marketDepth) {
            panel.compRef.marketDepth.createMarketDepth(panel.stkcode || stkcode, panel.stkname || stkname);
        }
    },
    showEmptyMsg: function () {

        this.dataView.getEl().update('<div class="x-grid-empty">' + this.emptyText + '</div>');
    },
    callStkInfo: function () {
        var panel = this;
        console.log('[OrderPad][callStkInfo] start *** ');

        if (panel.canTrade == false)
            return;
        if (Ext.isEmpty(panel.stkcode))
            return;

        try {
            var tempStkCode = formatutils.addDelaySuffix(panel.stkcode);

            var rec = Storage.returnRecord(tempStkCode);
            var ordPad = panel.trdForm.down('#OrdPad');
            var input = panel.trdForm.down('#inPanel');
            var qtycomp = panel.trdForm.down('#quantity');
            if (rec) {
                if (rec[fieldLotSize]) {
                    var lotsize = panel._getLotSize(rec[fieldLotSize]);
                    if (lotsize > 0) {
                        panel.lotsize = lotsize;
                    }
                    panel.setLotSize(panel.lotsize);
                }
                if (enableRSSIndicator == 'TRUE') {
                    if (rec[fieldRSSIndicator] != null && rec[fieldRSSIndicator] == 'R') {
                        if (panel.mode == modeOrdSell || (panel.mode == modeOrdRevise && panel.prevAction.toLowerCase() == "sell")) {
                            input.shortsellPanel.setVisible(true);
                        }
                    }
                }
            }

            if ((this.mode == modeOrdRevise) || (this.mode == modeOrdCancel)) {	// only Revise / Cancel will get run
                if (panel.lotsize > 0) {
                    if (qtycomp.getValue() == null || qtycomp.getValue() == "") {
                        var qtyInLot = panel.ordqty / panel.lotsize;
                        panel.setQty(qtyInLot);
                    }
                }

                conn.getStockInfo({
                    f: panel.getFieldList(),
                    k: panel.stkcode,
                    success: function (obj) {
                        try {
                            if (obj.s == true && obj.c > 0) {
                                panel.updLotSize = false;
                                panel.updCurrency = false;

                                panel.updPrc = true;
                                panel.updateStkInfo(obj.d[0]);
                                panel.updPrc = false;

                                if (panel.dsqty != null || panel.dsqty != '') {
                                    panel.setDsQty(panel.dsqty / panel.lotsize);
                                }
                                if (panel.minqty != null || panel.minqty != '') {
                                    panel.setMinQty(panel.minqty / panel.lotsize);
                                }

                                if (!panel.updLotSize) {
                                    console.log('[OrderPad][callStkInfo] didnt update lotsize value');
                                }

                                if (!panel.updCurrency) {
                                    console.log('[OrderPad][callStkInfo] didnt update currency');
                                }
                            }

                        } catch (e) {
                            console.log('[OrderPad][callStkInfo] Exception ---> ' + e);
                        }
                    }
                });
                if (panel.dsqty != null || panel.dsqty != '') {
                    panel.setDsQty(panel.dsqty / panel.lotsize);
                }
                if (panel.minqty != null || panel.minqty != '') {
                    panel.setMinQty(panel.minqty / panel.lotsize);
                }
            } else { // buy or sell mode
                panel.updPrc = true;

                if (!jsutil.isEmptyObject(rec)) {
                    panel.updateStkInfo(rec);
                    panel.updPrc = false;
                } else {
                    conn.getStockInfo({
                        f: panel.getFieldList(),
                        k: panel.stkcode,
                        success: function (obj) {
                            if (obj.s && obj.c > 0) {
                                Storage.procJson(obj, null, true);
                                panel.updateStkInfo(obj.d[0]);
                                panel.updPrc = false;
                            }
                        }
                    });
                }
            }

        } catch (e) {
            console.log('[OrderPad][callStkInfo] Exception ---> ' + e);
        }
    },
    updateStkInfo: function (dataObj) {
        var panel = this;
        var mode = panel.mode;

        try {

            var priceListObj = null;
            if (panel.compRef.marketDepth && panel.compRef.marketDepth.stkcode === dataObj[fieldStkCode]) {
                priceListObj = panel.compRef.marketDepth.returnBidAskPrice();
            }
            if (!priceListObj && newMarketDepth && newMarketDepth.stkcode === dataObj[fieldStkCode]) {
                priceListObj = newMarketDepth.returnBidAskPrice();
            }
            if (!priceListObj && marketDepthMatrixPanel) {
                priceListObj = marketDepthMatrixPanel.returnBidAskPrice(dataObj[fieldStkCode]);
            }

            if (dataObj[fieldStkCode] != null) {
                if (dataObj[fieldStkCode].indexOf(panel.stkcode) == 0) {
                    if (panel.lotsize == null || panel.lotsize == "") {
                        if (dataObj[fieldLotSize] != null) {
                            panel.lotsize = panel._getLotSize(dataObj[fieldLotSize]);
                            panel.setLotSize(panel.lotsize);
                        }
                    }
                    panel.stkname = dataObj[fieldStkName] == null ? panel.stkname : dataObj[fieldStkName];

                    if (panel.getExCode() == 'MY')
                        panel.instrument = dataObj[fieldInstrument] == null ? panel.instrument : dataObj[fieldInstrument];

                    panel.prev = dataObj[fieldPrev] == null ? panel.prev : dataObj[fieldPrev];
                    panel.last = dataObj[fieldLast] == null ? panel.last : dataObj[fieldLast];
                    panel.lacp = dataObj[fieldLacp] == null ? panel.lacp : dataObj[fieldLacp];

                    panel.bqty = dataObj[fieldBqty] == null ? panel.bqty : dataObj[fieldBqty];
                    panel.buy = dataObj[fieldBuy] == null ? panel.buy : dataObj[fieldBuy];
                    panel.sqty = dataObj[fieldSqty] == null ? panel.sqty : dataObj[fieldSqty];
                    panel.sell = dataObj[fieldSell] == null ? panel.sell : dataObj[fieldSell];

                    if (panel.updPrc) {
                        var lotSize = panel.lotsize;

                        if (!isNaN(lotSize) && lotSize > 0) {
                            if (mode) {
                                var qty = 0;
                                var dsqty = '';
                                var minqty = '';
                                if (mode == modeOrdRevise || mode == modeOrdCancel) {
                                    if (panel.ordqty > 0)
                                        qty = panel.ordqty / lotSize;

                                    if (panel.dsqty > 0)
                                        dsqty = panel.dsqty / lotSize;

                                    if (panel.minqty > 0) {
                                        minqty = panel.minqty;

                                    }
                                }
                                panel.setDefaultQuantity(qty);
                                panel.setDefaultDsQty(dsqty);
                                panel.setDefaultMinQty(minqty);
                            }
                        }

                        //special case
                        if (panel.price == null) {
                            panel.price = panel.getBuySellPrc();
                        }

                        var bidRec = new Array();
                        var askRec = new Array();

                        if (global_useBidSize) {
                            panel.decimalPlace = jsutil.getDecNum(panel.buy || panel.sell);
                            panel._sector = dataObj[fieldSectorCode];
                            var prList = panel.getPriceList(panel.stkcode, panel.getExCode(), panel._sector, panel.price);

                            if (prList) {
                                bidRec = prList.bidList;
                                askRec = prList.askList;
                            }
                        } else {
                        	panel.bid1 = trim(dataObj[fieldBuy]) == null ? 0 : isNaN(parseFloat(trim(dataObj[fieldBuy]))) ? 0 : (dataObj[fieldBuy]);
                        	panel.bid2 = trim(dataObj[fieldBuy2]) == null ? 0 : isNaN(parseFloat(trim(dataObj[fieldBuy2]))) ? 0 : (dataObj[fieldBuy2]);
                        	panel.bid3 = trim(dataObj[fieldBuy3]) == null ? 0 : isNaN(parseFloat(trim(dataObj[fieldBuy3]))) ? 0 : (dataObj[fieldBuy3]);
                        	panel.bid4 = trim(dataObj[fieldBuy4]) == null ? 0 : isNaN(parseFloat(trim(dataObj[fieldBuy4]))) ? 0 : (dataObj[fieldBuy4]);
                        	panel.bid5 = trim(dataObj[fieldBuy5]) == null ? 0 : isNaN(parseFloat(trim(dataObj[fieldBuy5]))) ? 0 : (dataObj[fieldBuy5]);

                        	panel.ask1 = trim(dataObj[fieldSell]) == null ? 0 : isNaN(parseFloat(trim(dataObj[fieldSell]))) ? 0 : (dataObj[fieldSell]);
                        	panel.ask2 = trim(dataObj[fieldSell2]) == null ? 0 : isNaN(parseFloat(trim(dataObj[fieldSell2]))) ? 0 : (dataObj[fieldSell2]);
                        	panel.ask3 = trim(dataObj[fieldSell3]) == null ? 0 : isNaN(parseFloat(trim(dataObj[fieldSell3]))) ? 0 : (dataObj[fieldSell3]);
                        	panel.ask4 = trim(dataObj[fieldSell4]) == null ? 0 : isNaN(parseFloat(trim(dataObj[fieldSell4]))) ? 0 : (dataObj[fieldSell4]);
                        	panel.ask5 = trim(dataObj[fieldSell5]) == null ? 0 : isNaN(parseFloat(trim(dataObj[fieldSell5]))) ? 0 : (dataObj[fieldSell5]);

                        	var bidQtyQueue, bidPrice, askQtyQueue, askPrice;

                        	if (priceListObj == null) {
                        		bidQtyQueue = [dataObj[fieldBqty], dataObj[fieldBqty2], dataObj[fieldBqty3], dataObj[fieldBqty4], dataObj[fieldBqty5]];
                        		bidPrice = [panel.bid1, panel.bid2, panel.bid3, panel.bid4, panel.bid5];

                        		askQtyQueue = [dataObj[fieldSqty], dataObj[fieldSqty2], dataObj[fieldSqty3], dataObj[fieldSqty4], dataObj[fieldSqty5]];
                        		askPrice = [panel.ask1, panel.ask2, panel.ask3, panel.ask4, panel.ask5];

                        	} else {
                        		bidQtyQueue = priceListObj.bidQty;
                        		bidPrice = priceListObj.bid;

                        		askQtyQueue = priceListObj.askQty;
                        		askPrice = priceListObj.ask;

                        	}

                        	for (var i = 0; i < bidQtyQueue.length; i++) {
                        		var bidValue = bidQtyQueue[i];
                        		var bidPriceValue = bidPrice[i];

                        		if ((bidPriceValue.toString()).indexOf('.') != -1) {
                        			var tempNum = (((bidPriceValue.toString()).split('.'))[1]).length;
                        			if (tempNum > panel.decimalPlace) {
                        				panel.decimalPlace = tempNum;
                        			}
                        		}

                        		if (parseInt(bidValue) > 0) {
                        			bidRec.push(bidPriceValue);
                        		}
                        	}

                        	for (var i = 0; i < askQtyQueue.length; i++) {
                        		var askValue = askQtyQueue[i];
                        		var askPriceValue = askPrice[i];

                        		if ((askPriceValue.toString()).indexOf('.') != -1) {
                        			var tempNum = (((askPriceValue.toString()).split('.'))[1]).length;
                        			if (tempNum > panel.decimalPlace) {
                        				panel.decimalPlace = tempNum;
                        			}
                        		}

                        		if (parseInt(askValue) > 0) {
                        			askRec.push(askPriceValue);
                        		}
                        	}
                        }

                        panel.checkBidAsk(bidRec);
                        panel.checkBidAsk(askRec);

                        if (panel.getExCode() != 'MY') {
                            if (panel.price != null && !isNaN(panel.price)) {
                                panel.setDefaultPrice(panel.price, bidRec, askRec, false);
                            }
                        } else {
                            panel.setDefaultPrice(panel.price, bidRec, askRec, false);
                        }

                        panel.bidRec = bidRec;
                        panel.askRec = askRec;

                        var currency = dataObj[fieldCurrency];
                        panel.currency = currency ? currency : '';
                        if (mode == modeOrdBuy || mode == modeOrdSell) {
                            if (currency) {
                                var arrCurrency = currency.split(',');
                                if (arrCurrency && arrCurrency.length > 0) {
                                    for (var i = 0; i < arrCurrency.length; i++) {
                                        currency = arrCurrency[i];
                                        if (currency)
                                            break;
                                    }
                                }
                            } /*else {
                                currency = panel.getDefSettCurr();
                            }*/

                            panel.setCurrency(currency, 1);
                        }
                    }
                }
            }
            panel.setMsgBox();

        } catch (e) {
            console.log('[OrderPad][updateStkInfo] Exception ---> ' + e);
            console.log(e.stack);
        }
    },
    formatCurrencyDecimal: function (value, dec) {
        return parseFloat(value).toFixed(dec);
    },
    formatPrcDecimal: function (value, decimalPlace) {
        var panel = this;

        var returnValue = null;

        if (value != null) {
            if (!isNaN(value)) {
                if (decimalPlace > 0) {
                    returnValue = parseFloat(value).toFixed(decimalPlace);
                } else {
                    returnValue = parseFloat(value).toFixed(panel.defaultDecimal);
                }
            }
        }

        return returnValue;
    },
    formatTradingLimitDecimal: function (value) {
        var panel = this;

        if (isNaN(value))
            return null;

        return parseFloat(value).toFixed(2);

    },
//    printColor: function(value, color, bold, fontsize) {
//        var el = new Array();
//        el.push('<span');
//
//        var style = color || bold || fontsize;
//
//        if (style) {
//            el.push(' style="');
//
//            if (color) {
//                el.push('color: ');
//                el.push(color);
//                el.push('; ');
//            }
//
//            if (bold)
//                el.push('font-weight: bold; ');
//
//            if (fontsize) {
//                el.push('font-size: ');
//                el.push(fontsize);
//                el.push('pt');
//            }
//
//            el.push('"');
//        }
//
//        el.push('>');
//        el.push(value);
//        el.push('</span>');
//
//        return el.join('');
//    },
//    printString: function(value) {
//        return this.printColor(value, cFUnchanged, true, 9);
//    },


//    // 20130116 - lkming -  didn't use already 
//    printNumber: function(value) {
//        value = this.formatNumber(value);
//        return this.printColor(value, cFUnchanged, true, 9);
//    },



//    // 20130116 - lkming -  didn't use already 
//    
//    printPrice: function(value) {
//        var cFUnchanged = '#FFFF00';
//        var cFUp = '#00FF00';
//        var cFDown = '#FF0000';
//        if (isMO(value)) {
//            return this.printColor('MO', cFUnchanged, true, 9);
//        } else if (isMP(value)) {
//            return this.printColor('MP', cFUnchanged, true, 9);
//        }
//
//        value = this.formatPrcDecimal(value);
//        if (!value)
//            return this.printColor('-', cFUnchanged, true, 9);
//
//        var lacp = this.lacp;
//        var _value = parseFloat(value);
//        var change = this.change;
//        change = parseFloat(change);
//
//        if (!lacp) return this.printColor(value, cFUnchanged, true, 9);
//        if (_value > lacp) return this.printColor(value, cFUp, true, 9);
//        else if (_value < lacp) return this.printColor(value, cFDown, true, 9);
//        else return this.printColor(value, cFUnchanged, true, 9);
//    },
    setAction: function (str) {
        this.act = str;
    },
//    setLast: function(last, lacp) {
//        if (last) this.last = last;
//        if (lacp) this.lacp = lacp;
//        if (this.last && !isNaN(this.last) && this.last > 0) {
//            this.setDefaultPrice(this.last);
//        } else if (this.lacp && !isNaN(this.lacp) && this.lacp > 0) {
//            this.setDefaultPrice(this.lacp);
//        }
//    },
    setStkCode: function (str) {
        if (str && str != this.stkcode) {
            this.lotsize = '',
                    this.last = '';
            this.lacp = '';
            this.prev = '';
            this.bidRec = null;
            this.askRec = null;
            this.instrument = null;
        }

        this.stkcode = str;
    },
    setStkName: function (str) {
        this.stkname = str;
    },
//    showBtnBack: function() {
//        var panel = this;
//        var tbar = panel.getTopToolbar();
//        var btnid = panel.id+'_btnback';
//        var xtype = touchMode ? 'htmlbutton' : 'button';
//        if (tbar.getComponent(btnid) == null) {
//            var btnback = {
//                id:btnid,
//                text:'Back',
//                xtype:xtype,
//                icon:icoBtnBack,
//                handler:function(){
//                	//if (panel.stkcode) panel.tfSearch.setValue(stockutil.getStockName(panel.stkname));
//                	if (pagingMode) panel.hidePaging();
////                    panel.dataView.hide();
//                    panel.trdForm.show();
//                }
//            };
//            tbar.insert(4,btnback);
//            tbar.doLayout();
//        }
//    },
//    hideBtnBack: function() {
//        var btnid = this.id+'_btnback';
//        this.getTopToolbar().remove(btnid);
//    },
    setTrdInfo: function () {
        console.log('[OrderPad][setTrdInfo] start *** ');

        var panel = this;
        try {
            var stkcode = panel.stkcode;
            var stkname = panel.stkname;

            if (stkcode) {
                var ex = '';
                var board = '';

                var ordPad = panel.trdForm.down('#OrdPad');

                var action = panel.mode;
                var blnResetPrevious = false;
                stkcode = stkcode == null ? '' : stkcode;
                stkname = stkname == null ? '' : stkname;

                if (stkcode.indexOf('.') != -1) {
                    ex = getStkExCode(stkcode);
                }
                if (stkcode.indexOf(':') != -1) {
                    board = getStkBoard(stkcode);
                }

                stkname = stockutil.getStockName(stkname);

                if (stkname)
                    stkname = ' / ' + stkname;
                if (stkcode) {
                    ordPad.down('#stkcode').setValue(stkcode);
                    if (panel.lastStock == null) {
                        panel.lastStock = stkcode;
                    } else {
                        if (panel.lastStock == stkcode) {
                            // same
                        } else {
                            // reset previous value (for those not same exchange or not same stock)
                            panel.lastStock = stkcode;
                            blnResetPrevious = true;
                        }
                    }
                }

                if (ex) {
                    ordPad.down('#ex').setValue(ex);
                    panel.exchangecode = ex;

                    if (panel.lastExchange == null) {
                        panel.lastExchange = ex;
                    } else {
                        if (panel.lastExchange == ex) {
                            // same
                        } else {
                            // reset previous value (for those not same exchange or not same stock)
                            panel.lastExchange = ex;
                            blnResetPrevious = true;
                        }
                    }
                }

                if (blnResetPrevious) {
                    panel.lastAccNo = '';
                    panel.lastOrdType = '';
                    panel.lastValidity = '';
                    panel.lastPayment = '';
                    panel.lastAccount = '';
                    panel.lastStopLimit = '';
                    panel.lastExpDate = '';
                    panel.lastQty = '';
                    panel.lastPrc = '';
                    panel.lastTPType = '';
                    panel.lastTPDirection = '';
                    panel.lastOffsetType = '';
                    panel.lastTakeProfitOrdType = '';
                    panel.lastStopLossOrdType = '';
                }

                var msg;
                var canTrade = panel.chkTradeEx(ex) && panel.chkTradeBoard(board);

                if (canTrade) {
                    if ((action == modeOrdCancel || action == modeOrdRevise) && !canCancelRevise(this.ordsts))
                        this.canTrade = false;
                    if (this.canTrade == false) {
                        panel.resetPanel();
                        canTrade = false;
                    }
                }

                // unable to trade
                if (!canTrade) {
                    panel.initForm(0);
                    if (action && (action == modeOrdCancel || action == modeOrdRevise)) {
                        msg = languageFormat.getLanguage(30231, 'You are not allowed to cancel or revise this order');
                    } else {
                        if (board) {
                            if (board == 'B') {
                                msg = tradeBoardRestrictionBMsg;
                            } else if (board == 'D') {
                                msg = tradeBoardRestrictionDMsg;
                            } else if (board == 'I') {
                                msg = tradeBoardRestrictionIMsg;
                            } else if (board == 'O') {
                                msg = tradeBoardRestrictionOMsg;
                            } else {
                                msg = languageFormat.getLanguage(30232, 'You are not allowed to trade this symbol');
                            }
                        } else {
                            msg = languageFormat.getLanguage(30232, 'You are not allowed to trade this symbol');
                        }
                    }
                    if (panel.isReady) {
                        panel.trdForm.down('#msgBox').update(msg);
                    }

                    return;
                } else {
                    if (action)
                        panel.setMode(action);
                }

//                panel.setTrdStkCode(stkcode, stkname, 0);
            } else {
                msgutil.alert(languageFormat.getLanguage(30201, 'Stock Code is blank.'));
                return;
            }
//            if ((action == modeOrdCancel || action == modeOrdRevise) && !canCancelRevise(this.ordsts)) this.canTrade = false;
//            if (this.canTrade == false) return;
//            if (mode) panel.setMode(action);

        } catch (e) {
            console.log('[OrderPad][setTrdInfo] Exception ---> ' + e);
        }
    },
//    startTradeResultTimeout: function() {
//        var panel = this;
//        panel.tradeResultTimeout = setTimeout(function() {
//            panel.promptTradeResult('Your request had been sent.', true);
//        }, 10000);
//    },
//    stopTradeResultTimeout: function() {
//        var panel = this;
//        if (panel.tradeResultTimeout) {
//            clearTimeout(panel.tradeResultTimeout);
//            panel.tradeResultTimeout = null;
//        }
//    },
//    promptTradeResult: function(str, success) {
//        var panel = this;
//        var func = function() {
//            //Ext.get('content').unmask();
//        };
//        var retMsg = function() {
//            if (panel.isReady) {
//                var tradeFrame = document.getElementById('tradeFrame');
//                var win;
//                if (tradeFrame) win = tradeFrame.contentWindow;
//                if (win && win.Ext) {
//                    win.msgutil.alert(str, func);
//                    //panel.getEl().unmask();
//                    panel.loadMask.hide();
//                    return true;
//                }
//            }
//            return false;
//        };
//
//        var timeout = 40;
//        var intid = setInterval(function() {
//            var b = retMsg();
//            timeout--;
//            if (b || (timeout == 0)) {
//                clearInterval(intid);
//            }
//        },500);
//        //msgutil.alert(str, func);
//    },
//    printChange: function(value) {
//        var cFUnchanged = '#FFFF00';
//        var cFUp = '#00FF00';
//        var cFDown = '#FF0000';
//        value = this.formatDecimal(value);
//
//        if (value > 0) {
//            value = '+' + value;
//            return this.printColor(value, cFUp, true, 9);
//        }else if (value < 0) {
//            return this.printColor(value, cFDown, true, 9);
//        } else {
//            return this.printColor(value, cFUnchanged, true, 9);
//        }
//    },
//    printChangePercentage: function(value) {
//        var cFUnchanged = '#FFFF00';
//        var cFUp = '#00FF00';
//        var cFDown = '#FF0000';
//        if (value > 0) {
//            return '<span style="color: '+cFUp+'; font-weight: bold; font-size: 9pt">'+value+'%</span>';
//        } else if (value < 0) {
//            return '<span style="color: '+cFDown+'; font-weight: bold; font-size: 9pt">'+value+'%</span>';
//        } else {
//            return '<span style="color: '+cFUnchanged+'; font-weight: bold; font-size: 9pt">'+value+'%</span>';
//        }
//    },
//    //resetSearch: function() {
//        //this.tfSearch.setValue('');
//    //},
    resetPanel: function () {

        //this.grid.store.removeAll();
        var jsObj = new Object();
        jsObj.success = true;
        jsObj.count = 1;
        var jsRec = new Object();
        jsRec.Buy = 'Bid';
        jsRec.Last = 'Last';
        jsRec.Sell = 'Ask';
        jsRec.Change = 'Change';
        var jsArray = new Array();
        jsArray.push(jsRec);
        jsObj.data = jsArray;
        //this.grid.store.loadData(jsObj);

        this.exchangecode = '';
        this.stkcode = '';
        this.stkname = '';
        this.last = '';
        this.lacp = '';
        this.buy = '';
        this.bqty = '';
        this.sell = '';
        this.sqty = '';
        this.lotsize = 1;
        this.currency = '';
        this.act = '';
        this._sector = '';

        this.bid1 = '';
        this.bid2 = '';
        this.bid3 = '';
        this.bid4 = '';
        this.bid5 = '';
        this.ask1 = '';
        this.ask2 = '';
        this.ask3 = '';
        this.ask4 = '';
        this.ask5 = '';

        this.price = '';
        this.bidRec = null;
        this.askRec = null;
        this.instrument = null;
        this.canTrade = false;
        this.trdForm.down('#OrdPad').down('#inPanel').down('#shortsellPanel').setVisible(false);
    },
    getFieldList: function () {

        var fieldList = new Array();
        fieldList.push(fieldStkCode);
        fieldList.push(fieldStkName);

        fieldList.push(fieldLast);
        fieldList.push(fieldLacp);

        fieldList.push(fieldLotSize);
        fieldList.push(fieldCurrency);

        fieldList.push(fieldBuy);
        fieldList.push(fieldBuy2);
        fieldList.push(fieldBuy3);
        fieldList.push(fieldBuy4);
        fieldList.push(fieldBuy5);

        fieldList.push(fieldSell);
        fieldList.push(fieldSell2);
        fieldList.push(fieldSell3);
        fieldList.push(fieldSell4);
        fieldList.push(fieldSell5);

        fieldList.push(fieldBqty);
        fieldList.push(fieldBqty2);
        fieldList.push(fieldBqty3);
        fieldList.push(fieldBqty4);
        fieldList.push(fieldBqty5);

        fieldList.push(fieldSqty);
        fieldList.push(fieldSqty2);
        fieldList.push(fieldSqty3);
        fieldList.push(fieldSqty4);
        fieldList.push(fieldSqty5);

        if (global_useBidSize) { // sector is required for bid size option
            fieldList.push(fieldSectorCode);
        }

        if (this.getExCode() == 'MY')
            fieldList.push(fieldInstrument);

        return fieldList;
    },
    showLoadMask: function (mode) {
        return;
        var msg;
        if (mode == 1) {
            msg = languageFormat.getLanguage(10020, 'Processing...');
        } else if (mode == 2) {
            msg = languageFormat.getLanguage(10019, 'Searching...');
        } else {
            msg = languageFormat.getLanguage(10017, 'Loading...');
        }
        this.loadMask = new Ext.LoadMask({
            msg: msg,
            target: this.getEl()
        });
        this.loadMask.show();
    },
    getAction: function (act) {

        for (var i = 0; i < this.arActionList.length; i++) {
            if (this.arActionList[i][0] == act)
                act = this.arActionList[i][1];
        }
        return act.toUpperCase();
    },
    setActionList: function (mode) {

        var panel = this;
        try {
            panel.arActionList = new Array();
            if (mode) {
                panel.arActionList.push([modeOrdBuy, languageFormat.getLanguage(10001, 'Buy')]);
                panel.arActionList.push([modeOrdSell, languageFormat.getLanguage(10002, 'Sell')]);
                if (mode == modeOrdRevise || mode == modeOrdCancel) {
                    panel.arActionList.push([modeOrdRevise, languageFormat.getLanguage(10009, 'Revise')]);
                    panel.arActionList.push([modeOrdCancel, languageFormat.getLanguage(10010, 'Cancel')]);
                }
            }
        } catch (e) {
            console.log('[OrderPad][setActionList] Exception ---> ' + e);
        }
    },
    getBuySellPrc: function () {

        var prc;
        if (this.last && !isNaN(this.last) && this.last > 0) {
            prc = this.last;
        } else if (this.lacp && !isNaN(this.lacp) && this.lacp > 0) {
            prc = this.lacp;
        } else if (this.prev && !isNaN(this.prev) && this.prev > 0) {
            prc = this.prev;
        } else {
            prc = '';
        }
        return prc;
    },
    setMsgBox: function (reset) {
        var panel = this;
        var msgBox = panel.trdForm.down('#msgBox');

        if (!msgBox)
            return;

        try {
            var msgTxt = '<span>' + panel.selSymbolMsg + '<span>';
            var ordPad = panel.trdForm.down('#OrdPad');
            var input = panel.trdForm.down('#inPanel');
            if (reset) {
                msgBox.update(msgTxt);
                if (panel.isReady) {

                    panel.compRef.btnSubmit.enable();
                    panel.compRef.btnReset.enable();

                    panel.enableCmp(input.down('#cbAction'));
                    panel.enableCmp(input.down('#accountno'));
                    panel.enableCmp(input.down('#price'));
                    panel.enableCmp(input.down('#quantity'));
                    panel.enableCmp(input.down('#otype'));
                    panel.enableCmp(input.down('#cbValidity'));
                    panel.enableCmp(ordPad.down('#skipconfirm'));
                    panel.enableCmp(ordPad.down('#pin'));
                }
            } else {
                if (panel.canTrade && panel.isReady) {
                    try {
                        msgTxt = panel.getTrdMsg();
                        panel.trdForm.down('#msgBox').update(msgTxt);
                    } catch (e) {
                        console.log('[OrderPad][setMsgBox][inner] Exception ---> ' + e);
                    }
                }
            }
        } catch (e) {
            console.log('[OrderPad][setMsgBox] Exception ---> ' + e);
            console.log(e.stack);
        }
    },
    getTrdMsg: function () {
        var panel = this;
        var lineBreak = ' ';
        if (!isMobile) {
            lineBreak = '<br/>';
        }

        var ordPad = panel.trdForm.down("#OrdPad");
        var input = ordPad.down('#inPanel');
        var stkcode = ordPad.down('#stkcode').getValue();
        var stkname = panel.stkname;

        var act, qty, price, otype;
        qty = panel.getQty();
        price = input.down('#price').getRawValue();
        otype = panel.getOrdType();
        act = ordPad.down('#act').getValue();
        
        if (N2N_CONFIG.orderRoundQty) {
            qty = jsutil.getNumFromRound(qty);
        }
        
        qty = (qty && !isNaN(qty)) ? parseInt(qty, 10) : qty;

        var lotsize = panel.lotsize;
        lotsize = (lotsize && !isNaN(lotsize)) ? parseInt(lotsize, 10) : lotsize;
        var msgTxt;
        if (!Ext.isEmpty(stkcode) && !Ext.isEmpty(stkname) && !Ext.isEmpty(act) && !Ext.isEmpty(otype)) {

            var color = '';
            if (act == modeOrdBuy)
                color = 'green';
            else if (act == modeOrdSell)
                color = 'red';

            var br = '';
            if (stkcode.length + stkname.length > 33)
                br = '<br>';

            msgTxt = '<span style="font-weight: bold; color:' + color + '">';
            msgTxt += panel.getAction(act);
            msgTxt += ' (' + otype + ')' + lineBreak;

            if (stkcode.indexOf('.') != -1) {
                stkcode = panel.removeExchange(stkcode);
            }

            if (stkname.indexOf('.') != -1) {
                stkname = panel.removeExchange(stkname);
            }

            //msgTxt += panel.removeExchange(stkcode) + ' / ' + br + panel.removeExchange(stkname) + '</span>' + lineBreak;
            msgTxt += stkcode + ' / ' + br + stkname + '</span>' + lineBreak;


            var totUnits = qty * lotsize;
            var unitTxt = '';
            if (!isNaN(totUnits) && totUnits > 0) {
                unitTxt = panel.formatNumberComa(totUnits) + ' ' + panel.getUnitTxt();
            }

            var prcTxt = '';
            if (!isNaN(price) && price != '') { //v1.3.30.8 add checking price != ''
                prcTxt = ' @ ' + panel.formatPrcDecimal(price.toString(), panel.decimalPlace);
            }

            if ((unitTxt.length + prcTxt.length) > 33) {
                br = '<br>';
            }

            if (sponsorID == 'CIMBSG') {
                msgTxt += '<B>' + unitTxt + br + prcTxt + '</B>';
            } else {
                msgTxt += unitTxt + br + prcTxt;
            }

            br = '';

            var buyRate = 0;
            var sellRate = 0;
            var denomination = 0;

            var tempCurrencyMsg = '';

            if (act == modeOrdBuy || act == modeOrdSell) {
                if (showTrxFees == '2') {
                    var OrdQty = 0;
                    var OrdPrice = 0;
                    var ExchRate = 0;
                    var trxFees = 0;

                    for (var i = 0; i < panel.arTrxFeeFormulaList.length; i++) {
                        if (panel.arTrxFeeFormulaList[i].formula.indexOf('<') != -1) {
                            var formula = panel.arTrxFeeFormulaList[i].formula.replace(/[<>]/g, '');
                            var formulaVariables = formula.split(/[-+*\/]/g);

                            if (formulaVariables != null) {
                                for (var j = 0; j < formulaVariables.length; j++) {
                                    if (formulaVariables[j] == 'OrdQty') {
                                        OrdQty = qty;
                                    } else if (formulaVariables[j] == 'OrdPrice') {
                                        OrdPrice = price;
                                    } else if (formulaVariables[j] == 'ExchRate') {
                                        ExchRate = 1;
                                    }
                                }
                            }

                            var value = eval(formula);
                            panel.arTrxFeeFormulaList[i].value = value;
                            console.log('Amount: ' + panel.arTrxFeeFormulaList[i].value);
                        }
                    }

                    if (OrdQty > 0) {
                        trxFees = trxFeesCalculator.calcTrxFee(panel.arTrxFeeFormulaList, act);
                        trxFees = trxFees.toFixed(3);
                    }
                    
                    tempCurrencyMsg += '<br>' + languageFormat.getLanguage(20862, 'Trx Fees=[PARAM0]', formatutils.formatNumber(trxFees));
                    
                } else if (showTrxFees == '1') {
                    tempCurrencyMsg += '<br>' + languageFormat.getLanguage(20863, 'Trx Fees=To Be Advised');
                }
            }

            if (outbound) {
                if (panel.currency != null && panel.currency != '') {
                    if (atpCurrencyRate) {

                        var isShowLimit = false;
                        var tempCurrencyList = panel.getCurrencyRate();
                        var tempCurrencyRate = tempCurrencyList.split('|');
                        if (tempCurrencyRate.length > 0) {
                            buyRate = tempCurrencyRate[0];
                            sellRate = tempCurrencyRate[1];
                            denomination = tempCurrencyRate[2];
                            isShowLimit = tempCurrencyRate[3];
                        }

                        if (isShowLimit == 'true') {
                            var accountBalance = '';
                            try {
                                accountBalance = panel.getAccountBalance();
                            } catch (e) {
                                console.log('[trade3][getTrdMsg] Exception ---> ' + e);
                            }

                            if (act == modeOrdBuy) {
                                tempCurrencyMsg += '<br/>';
                                tempCurrencyMsg += languageFormat.getLanguage(20864, 'Indicative Exchange Rate');
                                tempCurrencyMsg += '<br>' + denomination + '  ' + panel.currency + ' : ' + panel.formatCurrencyDecimal(sellRate, 4) + ' ' + defCurrency;
                                if (panel.getPayment() != 'CUT' && panel.exchangecode != 'MY') {
                                    if (sponsorID == 'CIMBSG') {
                                        tempCurrencyMsg += '<B>' + '<br><label id=trdLimitLabel>' + languageFormat.getLanguage(20834, 'Trading Limit') + '=' + panel.currency + ' ' + panel.formatNumberComa(panel.formatCurrencyDecimal(accountBalance * denomination / sellRate, 2)) + '</label></B>';
                                    } else {
                                        tempCurrencyMsg += '<br><label id=trdLimitLabel>' + languageFormat.getLanguage(20834, 'Trading Limit') + '=' + panel.currency + ' ' + panel.formatNumberComa(panel.formatCurrencyDecimal(accountBalance * denomination / sellRate, 2)) + '</label>';
                                    }
                                }

                            } else if (act == modeOrdSell) {
                                tempCurrencyMsg += '<br/>';
                                tempCurrencyMsg += languageFormat.getLanguage(20864, 'Indicative Exchange Rate');
                                tempCurrencyMsg += '<br>' + denomination + '  ' + panel.currency + ' : ' + panel.formatCurrencyDecimal(buyRate, 4) + ' ' + defCurrency;
                                if (panel.getPayment() != 'CUT' && panel.exchangecode != 'MY') {
                                    if (sponsorID == 'CIMBSG') {
            							tempCurrencyMsg += '<B>' + '<br><label id=trdLimitLabel>' + languageFormat.getLanguage(20834, 'Trading Limit') + '=' + panel.currency + ' ' + panel.formatNumberComa(panel.formatCurrencyDecimal(accountBalance * denomination / buyRate,2)) + '</label></B>';
                                    } else {
            							tempCurrencyMsg += '<br><label id=trdLimitLabel>' + languageFormat.getLanguage(20834, 'Trading Limit') + '=' + panel.currency + ' ' + panel.formatNumberComa(panel.formatCurrencyDecimal(accountBalance * denomination / buyRate,2)) + '</label>';
                                    }
                                }
                            } else {
                                // revise
                            }
                        }
                    }
                }
            }

            var settcurr = panel.getSettCurr();
            var totVal = totUnits * ((price && !isNaN(price)) ? parseFloat(price) : price);
            if (panel.getExCode() != 'MY') {
                var tempValue = '';

                if (totVal != null && !isNaN(totVal) && totVal > 0) {
                    tempValue += languageFormat.getLanguage(10127, 'Value') + ' = ';
                    if (settcurr != null || settcurr != "") {
                        tempValue += settcurr;
                        if (settcurr != panel.currency) {
                            if (act == modeOrdBuy) {
                                if (sellRate > 0) {
                                    totVal = (totVal / denomination) * sellRate;
                                }
                            } else if (act == modeOrdSell) {
                                if (buyRate > 0) {
                                    totVal = (totVal / denomination) * buyRate;
                                }
                            } else {
                                if (panel.prevAction.toLowerCase() == "buy") {
                                    if (sellRate > 0) {
                                        totVal = (totVal / denomination) * sellRate;
                                    }
                                } else {
                                    if (buyRate > 0) {
                                        totVal = (totVal / denomination) * buyRate;
                                    }
                                }
                            }
                        }
                    } else {
                        tempValue += defCurrency;
                    }
                    //tempValue += ' ' + panel.formatNumberComa(panel.formatPrcDecimal(totVal, panel.decimalPlace));
                    tempValue += ' ' + panel.formatNumberComa(panel.formatPrcDecimal(totVal, 2));
                    panel.totalValue = panel.formatNumberComa(panel.formatPrcDecimal(totVal, 2));
                    
                }

                if (unitTxt.length + prcTxt.length + tempValue.length > 33) {
                    msgTxt += '<br/>';
                }

                if (sponsorID == 'CIMBSG') {
                    msgTxt += '<B>' + tempValue + '</B>';
                } else {
                    msgTxt += tempValue;
                }
            }

            msgTxt += '<br/>';

            if (input.down('#dsqty').isVisible()) {
                if (input.down('#dsqty').readOnly == false) {
                    if (input.down('#dsqty').getValue() != '') {
                        var dsStr = '';
                        if (N2N_CONFIG.orderRoundQty) {
                            var dsQty = jsutil.getNumFromRound(panel.compRef.dsqtyPanel.getRawValue());
                            if (dsQty) {
                                dsStr = panel.formatNumberComa(dsQty * lotsize);
                            }
                        } else {
                            dsStr = panel.formatNumberComa((parseInt(input.down('#dsqty').getValue()) * lotsize));
                        }

                        if (dsStr) {
                            msgTxt += languageFormat.getLanguage(20180, 'Disclosed Qty') + ' = ' + dsStr + " " + languageFormat.getLanguage(20852, 'units').toLowerCase() + "<br/>";
                        }
                    }
                }
            }

            if (input.down('#minqty').isVisible()) {
                if (input.down('#minqty').readOnly == false) {
                    if (input.down('#minqty').getValue() != '') {
                        var minQtyStr = '';
                        if (N2N_CONFIG.orderRoundQty) {
                            var minQty = jsutil.getNumFromRound(panel.compRef.minQtyCt.getRawValue());
                            if (minQty) {
                                minQtyStr = panel.formatNumberComa(minQty * lotsize);
                            }
                        } else {
                            minQtyStr = panel.formatNumberComa((parseInt(input.down('#minqty').getValue()) * lotsize));
                        }
                        
                        if (minQtyStr) {
                            msgTxt += languageFormat.getLanguage(20843, 'Min Qty') + ' = ' + minQtyStr + " " + languageFormat.getLanguage(20852, 'units').toLowerCase();
                        }
                    }
                }
            }

            msgTxt += tempCurrencyMsg;

            // amfraser SIP
            if (showSIPMessage == "TRUE" && accRet) {
                var accList = accRet.ai;
                var accno = panel.getAccountNo();
                for (var i = 0; i < accList.length; i++) {
                    var acc = accList[i];
                    if (acc.ac && accno == acc.ac) {
                        var msg = formatutils.SIPAccountChecking(acc.sip);
                        msgTxt += msg;
                        /*
                         if (acc.sip == 0 || acc.sip == 1024) {
                         msgTxt += '<br>This account is allowed to trade only EIPs.';
                         } else if (acc.sip == 2048 || acc.sip == 3072) {
                         msgTxt += '<br>This account is allowed to trade certain listed SIPs';
                         } else if (acc.sip == 6144 || acc.sip == 7168 || acc.sip == 1054720) {
                         msgTxt += '<br>This account is allowed to trade all listed SIPs';
                         } else {
                         msgTxt += '<br>This account is allowed to trade only EIPs.';
                         }
                         break;
                         */
                    }
                }
            }

            if (showOTypeHelpText == 'TRUE') {
                var helpTxt = '';
                helpTxt = panel.setHelpTxt(otype, act, true);
                msgTxt += helpTxt;
            }

        } else {
//        	console.log( '[OrderPad][getTrdMsg] stkcode ---> ' + stkcode );
//        	console.log( '[OrderPad][getTrdMsg] stkname ---> ' + stkname );
//        	console.log( '[OrderPad][getTrdMsg] act ---> ' + act );
//        	console.log( '[OrderPad][getTrdMsg] otype ---> ' + otype );
        }
        return msgTxt;
    },
    showMsg: function (msgTxt, err) {

        try {
            if (!isMobile) {
                var _msgBox = this.trdForm.down('#msgBox');
                _msgBox.update(msgTxt);
                // Scrolls to the end
                _msgBox.getEl().scroll('b', Infinity);
            } else {
                this.setLoading(false);
                if (!err) {
                    msgutil.alert(msgTxt);
                }
            }

        } catch (e) {
            console.log('[OrderPad][showMsg] Exception ---> ' + e);
        }
    },
    setAccList: function (mode) {

        //  mode =1;
        var panel = this;
        try {
            var el = this.trdForm.down("#accountno");
            if (el) {
                var val;
                if (mode == 0) {
                    el.store.removeAll();
                    el.clearValue();
                } else if (mode == 1) {
                    el.store.loadData(panel.arAccList);
                    el.collapse();
                    var trAction = panel.trdForm.down('#OrdPad').down('#act').getValue();
                    var runCase = true;

                    if (N2N_CONFIG.defTradeAccFeature) {
                        if (trAction == modeOrdBuy || trAction == modeOrdSell) {
                            runCase = false;
                            var defTrAccOpt = defTrAccConf.getDefTrAccOpt(panel.exchangecode);
                            var defTrAccVal = defTrAccConf.getDefTrAccVal(panel.exchangecode);

                            if (defTrAccOpt == defAccValues.LAST) {
                                var defTrAccLast = defTrAccConf.getDefTrAccLast(panel.exchangecode);
                                if (isDealerRemisier) {
                                    panel.searchAccount(defTrAccLast, true);
                                } else {
                                    el.setValue(defTrAccLast);
                                }
                            } else if (defTrAccOpt == defAccValues.SPECIFIC && defTrAccVal != '') {
                                if (isDealerRemisier) {
                                    panel.searchAccount(defTrAccVal, true);
                                } else {
                                    // get first match
                                    var firstMatch = panel._getFirstMatch(panel.arAccList, defTrAccVal);
                                    if (firstMatch) {
                                        el.setValue(firstMatch);
                                    }
                                }
                            } else { // default to empty option

                            }
                        }
                    }

                    if (runCase) {
                        val = panel.lastAccount ? panel.lastAccount : ((panel.arAccList && panel.arAccList.length > 0) ? panel.arAccList[0][0] : '');
                        el.setValue(val);
                    }
                } else {
                    /* this condition might not never occur */
                    el.store.loadData(panel.arAccList);

                    val = (panel.arAccList && panel.arAccList.length > 0) ? panel.arAccList[0][0] : '';
                    el.setValue(val);
                }
            }
        } catch (e) {
            console.log('[OrderPad][setAccList] Exception ---> ' + e);
        }
    },
    setCreditLimit: function (accno) {

        var panel = this;
        var ordPad = panel.trdForm.down('#OrdPad');
        var input = ordPad.down("#inPanel");
        var bal = '';

        try {
            if (!accno)
                accno = panel.getAccountNo();

            if (accRet) {
                var accList = accRet.ai;

                for (var i = 0; i < accList.length; i++) {
                    var acc = accList[i];

                    if (acc.ac && accno == acc.ac) {
                        ordPad.down('#ac').setValue(acc.ac);
                        ordPad.down('#cc').setValue(acc.cc);
                        bal = panel.setTradingLimitBal(acc);
                        break;
                    }
                }
            }
            panel.setBalance(bal);
        } catch (e) {
            console.log('[OrderPad][setCreditLimit] Exception ---> ' + e);
        }
    },
    setSearchAccCreditLimit: function (acc) {

        var panel = this;
        var ordPad = panel.trdForm.down('#OrdPad');
        //var input = ordPad.down("#inPanel");
        var bal = '';

        try {
            ordPad.down('#ac').setValue(acc.ac);
            ordPad.down('#cc').setValue(acc.cc);
            bal = panel.setTradingLimitBal(acc);
            panel.setBalance(bal);
        } catch (e) {
            console.log('[OrderPad][setSearchAccCreditLimit] Exception ---> ' + e);
        }
    },
    setTradingLimitBal: function (acc) {
        var panel = this;
        var bal = '';
        //var tempAl = panel.formatTradingLimitDecimal(acc.al);
        var blTxt = new Array();

        if (panel.getPayment() == 'CUT') {
            blTxt.push(languageFormat.getLanguage(20865, 'Inv.Power') + ': ' + panel.getSettCurr() + ' ');
        } else {
            blTxt.push(languageFormat.getLanguage(20834, 'Trading Limit') + ': ' + defCurrency + ' ');
        }

        var displayLimitType = '';

        if (global_displayCreditType.toLowerCase() == "bs") {
            displayLimitType = 'cashLimit'; // cash limit (buy sell limit)

        } else if (global_displayCreditType.toLowerCase() == "mix") {

            if (acc.cliType) {

                if (acc.cliType.toLowerCase() == 'm') {
                    displayLimitType = 'netCashLimit'; // net cash limit

                } else {
                    displayLimitType = 'cashLimit'; // cash limit (buy sell limit)
                }

            } else {
                displayLimitType = 'cashLimit'; // cash limit (buy sell limit)
            }

        } else {
            displayLimitType = 'creditLimit'; // cash limit (buy sell limit)
        }

        if (panel.getPayment() == 'CUT') {
            blTxt.push(panel.formatNumberComa(panel.formatTradingLimitDecimal(acc.al)));
        } else {
            if (displayLimitType == 'creditLimit') {
                blTxt.push(panel.formatNumberComa(panel.formatTradingLimitDecimal(acc.al)));
                //blTxt.push(panel.formatNumberComa(al));

            } else if (displayLimitType == 'cashLimit') {

                if (panel.mode == modeOrdBuy) {
                    blTxt.push(panel.formatNumberComa(panel.formatTradingLimitDecimal(acc.bl)));

                } else if (panel.mode == modeOrdSell) {
                    blTxt.push(panel.formatNumberComa(panel.formatTradingLimitDecimal(acc.sl)));

                } else {

                    if (panel.prevAction.toLowerCase() == "buy") {
                        blTxt.push(panel.formatNumberComa(panel.formatTradingLimitDecimal(acc.bl)));

                    } else {
                        blTxt.push(panel.formatNumberComa(panel.formatTradingLimitDecimal(acc.sl)));

                    }
                }

            } else {
                blTxt.push(panel.formatNumberComa(panel.formatTradingLimitDecimal(acc.ncl)));
            }

        }

        bal = blTxt.join('');
        return bal;
    },
    formatNumberComa: function (num) {
        var returnResult = '';

        if (num.toString().indexOf('.') != -1) {
            var tempList = num.toString().split('.');
            for (var i = 0; i < (tempList.length - 1); i++) {
                returnResult += tempList[ i ].replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
            }
            returnResult += '.' + tempList[ (tempList.length - 1) ];
        } else {
            returnResult = num.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
        }

        return returnResult;
    },
    callAccBal: function () {

        var panel = this;
        //   panel.setBalance('Trading Limit.: ');
        try {
            //if (panel.loadMask)
            //    panel.loadMask.show();
            var accList = accRet.ai;
            var accno = panel.getAccountNo();
            var branchCode = panel.branchCode;

            var urlbuf = new Array();
            urlbuf.push(addPath + 'tcplus/atp/acc?');
            urlbuf.push('s=');
            urlbuf.push(new Date().getTime());

            // clears balance label
            panel.setBalance('');
            if (!accno)
                return;

            urlbuf.push('&ac=' + accno);

            var accountName = (panel.getAccountName()).split('-');
            if (accountName.length == 3) {
                urlbuf.push('&bc=' + accountName[accountName.length - 1].trim());
            } else if (branchCode.length > 0) {
                urlbuf.push('&bc=' + branchCode);
            }

            if (panel.getPayment() == 'CUT') {
                urlbuf.push('&paymentCode=' + panel.getPayment());
                if (panel.getSettCurr().length > 0) {
                    urlbuf.push('&settCurr=' + panel.getSettCurr());
                } else {
                    urlbuf.push('&settCurr=' + panel.getDefSettCurr());
                }
            }

            var url = urlbuf.join('');

            Ext.Ajax.request({
                url: url,
                method: 'POST',
                success: function (response) {
                    var text = response.responseText;
                    var obj = null;
                    try {
                        obj = Ext.decode(text);
                    } catch (e) {
                        console.log('[OrderPad][callAccBal][inner] Exception ---> ' + e);
                    }

                    if (obj && obj.s == true) {
                        panel.updateAccBal(obj);

                        if (panel.getPayment() != 'CUT') {
                            if (outbound) {
                                var buyRate = 0;
                                var sellRate = 0;
                                var denomination = 0;
                                var isShowLimit = false;

                                var ordPad = panel.trdForm.down('#OrdPad');
                                var act = ordPad.down('#act').getValue();

                                var tempCurrencyList = panel.getCurrencyRate();
                                var tempCurrencyRate = tempCurrencyList.split('|');
                                if (tempCurrencyRate.length > 0) {
                                    buyRate = tempCurrencyRate[0];
                                    sellRate = tempCurrencyRate[1];
                                    denomination = tempCurrencyRate[2];
                                    isShowLimit = tempCurrencyRate[3];
                                }

                                if (isShowLimit == 'true') {
                                    var accountBalance = '';
                                    accountBalance = panel.getAccountBalance();

                                    if (act == modeOrdBuy) {
                                        Ext.get('trdLimitLabel').update(languageFormat.getLanguage(20834, 'Trading Limit') + '=' + panel.currency + ' ' + panel.formatNumberComa(panel.formatCurrencyDecimal(accountBalance * denomination / sellRate, 2)));
                                    } else if (act == modeOrdSell) {
                                        Ext.get('trdLimitLabel').update(languageFormat.getLanguage(20834, 'Trading Limit') + '=' + panel.currency + ' ' + panel.formatNumberComa(panel.formatCurrencyDecimal(accountBalance * denomination / buyRate, 2)));
                                    }
                                }
                            }
                        }
                        //panel.setCreditLimit(accno);
                    }
                },
                failure: function (response) {
                    panel.setCreditLimit(accno);
                    //if (panel.loadMask)
                    //    panel.loadMask.hide();
                }
            });

        } catch (e) {
            console.log('[OrderPad][callAccBal] Exception ---> ' + e);
        }
    },
    updateAccBal: function (obj) {
        var panel = this;

        var accNo = panel.getAccountNo();
        try {
            if (!obj || !obj.ai)
                return;

            var acc = obj.ai;
            var accBal = 0;
            if (!isDealerRemisier) {
                for (var i = 0; i < acc.length; i++) {
                    var updAcc = acc[i];
                    if (updAcc != null) {
                        if (panel.accNo && updAcc.ac == panel.accNo) {
                            accBal = parseFloat(updAcc.al);
                        }
                        if (accNo == updAcc.ac) {
                            if (panel.accExchCode != updAcc.ex) {
                                panel.accExchCode = updAcc.ex;
                            }
                        }

                        if (accRet && accRet.ai) {
                            var accInfo = accRet.ai;
                            for (var j = 0; j < accInfo.length; j++) {
                                var ac = accInfo[j];

                                if (ac.ac == updAcc.ac) {
                                    if (ac.bc == updAcc.bc) {
                                        accRet.ai[j] = updAcc;
                                    }
                                }
                            }
                        }
                    }
                }
                panel.setCreditLimit(accNo);
            } else {
                var updAcc = acc[0];
                if (accNo == updAcc.ac) {
                    if (panel.accExchCode != updAcc.ex) {
                        panel.accExchCode = updAcc.ex;
                    }
                    panel.setSearchAccCreditLimit(acc[0]);
                }
            }


        } catch (e) {
            console.log('[OrderPad][updateAccBal] Exception ---> ' + e);
        }
    },
    selectOType: function (val) {

        var panel = this;
        var input = panel.trdForm.down('#inPanel');
        var mode = panel.mode;
        if (val) {
            if (panel.selectDefault) {
                if (panel.arTPTypeList.length > 0) {
                    panel.lastTPType = panel.arTPTypeList[0][0];
                }

                if (panel.arTPDirectionList.length > 0) {
                    if (mode == modeOrdBuy) {
                        panel.lastTPDirection = panel.arTPDirectionList[0][0];
                    } else if (mode == modeOrdSell) {
                        panel.lastTPDirection = panel.arTPDirectionList[1][0];
                    }
                }
                panel.selectDefault = false;
            }
            /*
             var otype = val;
             var prcComp = input.down('#price');
             var stoplimitComp = input.down('#stoplimit');
             if (prcComp) {
             if (otype == 'Market') {
             panel.lastPrc = prcComp.getRawValue();
             prcComp.setValue('');
             panel.disableCmp(prcComp);
             } else {
             if (panel.lastPrc)
             prcComp.setValue(panel.lastPrc);
             panel.enableCmp(prcComp);
             }
             }
             if (otype == 'StopLimit') {
             if (stoplimitComp) {
             panel.enableCmp(stoplimitComp);
             stoplimitComp.focus();
             }
             } else {
             if (stoplimitComp) {
             stoplimitComp.setValue('');
             panel.disableCmp(stoplimitComp);
             }
             if (prcComp)
             prcComp.focus();
             }
             */
        }
    },
    validateBS: function () {

        var panel = this;
        var ordPad = panel.trdForm.down('#OrdPad');
        var input = ordPad.down('#inPanel');
//        if (!panel.trdForm.getForm().isValid()) {
//            msgutil.alert(panel.inputErrorMsg);
//            return false;
//        }
        var stkcode = panel.stkcode;
        var accno = panel.getAccountNo();
        var price = input.down('#price').getRawValue();
        var qty = panel.getQty();
        var validity = panel.getValidityCmb();
        var pin = ordPad.down('#pin').getValue();
        var act = ordPad.down('#act').getValue();
        var gtd = panel.getGTD();
        var minqty = panel.getMinQty();
        var dsqty = panel.getDsQty();
        var stoplimit = panel.getStopLimit();
        
        if (!stkcode) {
            msgutil.alert(panel.selSymbolMsg, function (btn, txt) {
            });
            return false;
        }

        accno = trim(accno);
        if (!accno) {
            msgutil.alert(languageFormat.getLanguage(30202, 'You do not have any valid trading account.'), function (btn, txt) {
                if (btn == 'ok') {
                    input.down('#accountno').focus();
                }
            });
            return false;
        }
        act = trim(act);
        if (!act)
            return false;

        var isnan;
        var valid;
        var otype = panel.getOrdType();

        if (otype == 'Market' || otype == 'MarketToLimit') {

        } else {
            isnan = isNaN(price);
            if (panel.chkPrc()) {
                valid = (price > 0 && panel.prcTest.test(price));
            } else {
                valid = panel.prcTestMY.test(price);
            }

            if (otype != 'Stop' && otype != 'MarketIfTouched') {
                if (isnan || !valid) {
                    msgutil.alert(languageFormat.getLanguage(30203, 'Please enter a valid order price.'), function (btn, txt) {
                        if (btn == 'ok') {
                            input.down('#price').focus();
                        }
                    });
                    return false;
                }
            }

            if (otype == 'StopLimit' || otype == 'MarketIfTouched' || otype == 'LimitIfTouched' || otype == 'Stop') {
                isnan = isNaN(stoplimit);
                valid = false;

                if (panel.chkPrc()) {
                    valid = (stoplimit > 0 && panel.prcTest.test(stoplimit));
                } else {
                    valid = panel.prcTestMY.test(stoplimit);
                }

                if (act == modeOrdBuy) {
                    if (stoplimit > price)
                        valid = true;
                } else {
                    if (stoplimit < price)
                        valid = true;
                }

                if (isnan || !stoplimit || !valid) {
                    msgutil.alert(languageFormat.getLanguage(30204, 'Please enter a valid trigger price.'), function (btn, txt) {
                        if (btn == 'ok') {
                            input.down('#stoplimit').focus();
                        }
                    });
                    return false;
                }
            }
        }

        //check validity
        if (validity == null || trim(validity) == null) {
            msgutil.alert(languageFormat.getLanguage(30205, 'Please enter a valid Validity.'), function (btn, txt) {
                if (btn == 'ok') {
                    input.down('#cbValidity').focus();
                }
            });
            return false;
        } else {
            panel.setValidity(validity);
        }

        if (validity && validity == 'GTD') {
            if (!gtd) {
                msgutil.alert(languageFormat.getLanguage(30206, 'Please enter a valid GTD date.'), function (btn, txt) {
                    if (btn == 'ok') {
                        panel.showCalendar();
                    }
                });
                return false;
            }
        }
        
        if (N2N_CONFIG.orderRoundQty) {
            qty = jsutil.getNumFromRound(qty);
        }
        
        //check qty
        isnan = isNaN(qty);
        var displayAlert = false;
        if (isnan) {
            displayAlert = true;
        } else {
            if (panel.getExCode() == 'MY') {
                if (!panel.qtyTestMY1.test(qty)) {
                    if (!panel.qtyTestMY2.test(qty)) {
                        displayAlert = true;
                    }
                } else {
                    displayAlert = true;
                }
            } else {
                if (!qty || qty <= 0 || !panel.qtyTest.test(qty)) {
                    displayAlert = true;
                }
            }
        }
        if (displayAlert) {
            if (isnan || !qty || qty <= 0 || !panel.qtyTest.test(qty)) {
                msgutil.alert(languageFormat.getLanguage(30207, 'Please enter a valid order quantity.'), function (btn, txt) {
                    if (btn == 'ok') {
                        input.down('#quantity').focus();
                    }
                });
                return false;
            }
        }



        //check ds qty
        if (dsqty) {
            if (N2N_CONFIG.orderRoundQty) {
                dsqty = jsutil.getNumFromRound(dsqty);
            }
        
            isnan = isNaN(dsqty);
            if (isnan || dsqty < 0 || !panel.dsQtyTest.test(dsqty)) {
                msgutil.alert(languageFormat.getLanguage(30208, 'Please enter a valid Disclosed Qty.'), function (btn, txt) {
                    if (btn == 'ok') {
                        input.down('#dsqty').focus();
                    }
                });
                return false;
            }
            if (parseInt(dsqty) > parseInt(qty)) {
                msgutil.alert(languageFormat.getLanguage(30209, 'Disclosed Qty cannot be greater than total quantity.'), function (btn, txt) {
                    if (btn == 'ok') {
                        input.down('#dsqty').focus();
                    }
                });
                return false;
            }
        }

        //check min qty
        if (minqty) {
            if (N2N_CONFIG.orderRoundQty) {
                minqty = jsutil.getNumFromRound(minqty);
            }
        
//            if (input.down('#otype').getValue() == 'Stop' || input.down('#otype').getValue() == 'StopLimit') {
//                msgutil.alert('Stop orders cannot have Min Qty.', function (btn, txt) {
//                    if (btn == 'ok'){
//                        input.down('#minqty').setValue('');
//                        input.down('#minqty').focus();
//                    }
//                });
//                return false;
//            }
            isnan = isNaN(minqty);
            if (isnan || minqty <= 0 || !panel.minQtyTest.test(minqty)) {
                msgutil.alert(languageFormat.getLanguage(30210, 'Please enter a valid Min Qty.'), function (btn, txt) {
                    if (btn == 'ok') {
                        input.down('#minqty').focus();
                    }
                });
                return false;
            }
            // bug - v1.3.14.16 - because it duplicate      
            if (parseFloat(minqty) > parseFloat(qty)) {
                msgutil.alert(languageFormat.getLanguage(30211, 'Minimum Qty cannot be greater than total quantity.'), function (btn, txt) {
                    if (btn == 'ok') {
                        input.down('#minqty').focus();
                    }
                });
                return false;
            }
        }

        //1.3.25.3 Set a fix pin when trading pin is hidden
        if (panel.checkIsHidePin()) {
            ordPad.down('#pin').setValue("123456");
            pin = "123456";
        }

        pin = trim(pin);
        if (!pin) {
            msgutil.alert(languageFormat.getLanguage(30212, 'Please enter your trading pin.'), function (btn, txt) {
                if (btn == 'ok') {
                    ordPad.down('#pin').focus();
                }
            });
            return false;
        }
        if (!panel.pinTest.test(pin)) {
            msgutil.alert(languageFormat.getLanguage(30213, 'Invalid trading pin. Please check your trading pin.'), function (btn, txt) { 
                if (btn == 'ok') {
                    ordPad.down('#pin').focus();
                }
            });
            return false;
        }

        return true;
    },
    validateRev: function () {

        var panel = this;
        var ordPad = panel.trdForm.down('#OrdPad');
        var input = ordPad.down('#inPanel');
//        if (!panel.trdForm.getForm().isValid()) {
//            msgutil.alert(panel.inputErrorMsg);
//            return false;
//        }
        var isRev = false;

        var act = ordPad.down('#act').getValue();
        var price = input.down('#price').getRawValue();
        var qty = panel.getQty();
        var otype = panel.getOrdType();
        var validity = panel.getValidityCmb();
        var pin = ordPad.down('#pin').getValue();
        var gtd = ordPad.down('#gtd').getValue();
        var state = panel.getPrivateOrd();

        //derivatives
        var dsqty = panel.getDsQty();
        var minqty = panel.getMinQty();
        var payment = panel.getPayment();
        var stoplimit = panel.getStopLimit();

        //new stop limit enhancement
        var tptype = panel.getTPType();
        var tpdirection = panel.getTPDirection();


        if (!act)
            return false;


        var isnan;
        if (otype == 'Market' || otype == 'MarketToLimit') {

        } else {
            // [start - price]
            isnan = isNaN(price);
            if (panel.chkPrc()) {
                valid = (price > 0 && panel.prcTest.test(price));
            } else {
                valid = panel.prcTestMY.test(price);
            }

            if (otype != 'Stop' && otype != 'MarketIfTouched') {
                if (isnan || !valid) {
                    msgutil.alert(languageFormat.getLanguage(30203, 'Please enter a valid order price.'), function (btn, txt) {
                        if (btn == 'ok') {
                            input.down('#price').focus();
                        }
                    });
                    return false;
                }
            }
            // [end - price]

            // [start - stop limit]
            if (otype == 'StopLimit' || otype == 'MarketIfTouched' || otype == 'LimitIfTouched' || otype == 'Stop') {
                isnan = isNaN(stoplimit);
                valid = false;

                if (panel.chkPrc()) {
                    valid = (stoplimit > 0 && panel.prcTest.test(stoplimit));
                } else {
                    valid = panel.prcTestMY.test(stoplimit);
                }

                if (act == modeOrdBuy) {
                    if (stoplimit > price)
                        valid = true;
                } else {
                    if (stoplimit < price)
                        valid = true;
                }

                if (isnan || !stoplimit || !valid) {
                    msgutil.alert(languageFormat.getLanguage(30204, 'Please enter a valid trigger price.'), function (btn, txt) {
                        if (btn == 'ok') {
                            input.down('#stoplimit').focus();
                        }
                    });
                    return false;
                }
            }
            // [end - stop limit]
        }

        if (N2N_CONFIG.orderRoundQty) {
            qty = jsutil.getNumFromRound(qty);
        }
        // [start - quantity validation]
        isnan = isNaN(qty);
        if (isnan || !qty || qty < 1 || !panel.qtyTest.test(qty)) {
            msgutil.alert(languageFormat.getLanguage(30207, 'Please enter a valid order quantity.'), function (btn, txt) {
                if (btn == 'ok') {
                    input.down('#quantity').focus();
                }
            });
            return false;
        }
        
        var revQty = panel.revQty;
        var orgQty = panel.ordqty / panel.lotsize;
        if (qty != orgQty) {
            isRev = true;

            if (revQty != null || revQty != '') {

                if (parseFloat(qty) > parseFloat(orgQty)) {
                    if (revQty.indexOf('+') == -1) {
                        msgutil.alert(languageFormat.getLanguage(30217, 'New order quantity cannot be more than original order quantity.'), function (btn, txt) {
                            if (btn == 'ok') {
                                input.down('#quantity').focus();
                            }
                        });
                        return false;
                    }
                } else if (parseFloat(qty) < parseFloat(orgQty)) {
                    if (revQty.indexOf('-') == -1) {
                        msgutil.alert(languageFormat.getLanguage(30218, 'New order quantity cannot be less than original order quantity.'), function (btn, txt) {
                            if (btn == 'ok') {
                                input.down('#quantity').focus();
                            }
                        });
                        return false;
                    }
                } else {
                    msgutil.alert(languageFormat.getLanguage(30207, 'Please enter a valid order quantity.'), function (btn, txt) {
                        if (btn == 'ok') {
                            input.down('#quantity').focus();
                        }
                    });
                    return false;
                }

            }
        }
        // [end - quantity validation]


        // [start - price validation]
        var revPrc = panel.revPrc;
        var orgPrice = panel.ordprc;
        if (price != panel.ordprc) {
            isRev = true;
            if (revQty != null || revQty != '') {
                if (parseFloat(price) > parseFloat(orgPrice)) {
                    if (revPrc.indexOf('+') == -1) {
                        msgutil.alert(languageFormat.getLanguage(30220, 'New order price cannot be more than original order price.'), function (btn, txt) {
                            if (btn == 'ok') {
                                input.down('#price').focus();
                            }
                        });
                        return false;
                    }
                } else if (parseFloat(price) < parseFloat(orgPrice)) {
                    if (revPrc.indexOf('-') == -1) {
                        msgutil.alert(languageFormat.getLanguage(30221, 'New order price cannot be less than original order price.'), function (btn, txt) {
                            if (btn == 'ok') {
                                input.down('#price').focus();
                            }
                        });
                        return false;
                    }
                }
            }
        }
        // [end - quantity validation]


        // [start - order type validation]
        var revOrderType = panel.revOrderType;
        if (otype != panel.ordtype) {
            isRev = true;
            if (revOrderType != 'O') {
                msgutil.alert('Order type cannot be revised.', function (btn, txt) {
                    if (btn == 'ok') {
                        input.down('#otype').focus();
                    }
                });
                return false;
            }
        }
        // [end - order type validation]


        // [start - validity validation]
        var revValidity = panel.revValidity;
        if (input.down('#cbValidity').readOnly == false) {
            if (validity != panel.validity) {
                isRev = true;
                if (revValidity != 'V') {
                    msgutil.alert(languageFormat.getLanguage(30222, 'Order type cannot be revised.'), function (btn, txt) {
                        if (btn == 'ok') {
                            input.down('#cbValidity').focus();
                        }
                    });
                    return false;
                }
            }
        }
        // [end - validity validation]


        // [start - validity GTD validation]
        var orgGTD = panel.expdate;
        if (orgGTD && orgGTD.length >= 8)
            orgGTD = orgGTD.substring(0, 8);
        if (gtd != orgGTD) {
            isRev = true;
            if (revValidity != 'V') {
                msgutil.alert(languageFormat.getLanguage(30223, 'Order validity cannot be revised.'), function (btn, txt) {
                    if (btn == 'ok') {
                        input.down('#cbValidity').focus();
                    }
                });
                return false;
            }
        }
        // [end - validity GTD validation]



        // [start - disclosed validation]
        var revDisclosedQty = panel.revDisclosedQty;
        var orgDsQty = panel.dsqty / panel.lotsize;
        var _tempDsQty = jsutil.getNumFromRound(dsqty);
        
        if (dsqty && _tempDsQty != orgDsQty) {
            isRev = true;
            dsqty = _tempDsQty;
            
            if (!dsqty) {
                msgutil.alert(languageFormat.getLanguage(30226, 'Please enter a valid disclosed quantity.'), function(btn, txt) {
                    if (btn == 'ok') {
                        input.down('#dsqty').focus();
                    }
                });
                return false;
            }

            if (revDisclosedQty != null && revDisclosedQty != '') {
                if (parseFloat(dsqty) > parseFloat(orgDsQty)) {
                    if (revDisclosedQty.indexOf('+') == -1) {
                        msgutil.alert(languageFormat.getLanguage(30224, 'New disclosed quantity cannot be more than original disclosed quantity.'), function (btn, txt) {
                            if (btn == 'ok') {
                                input.down('#dsqty').focus();
                            }
                        });
                        return false;
                    }
                } else if (parseFloat(dsqty) < parseFloat(orgDsQty)) {
                    if (revDisclosedQty.indexOf('-') == -1) {
                        msgutil.alert(languageFormat.getLanguage(30225, 'New disclosed quantity cannot be less than original disclosed quantity.'), function (btn, txt) {
                            if (btn == 'ok') {
                                input.down('#dsqty').focus();
                            }
                        });
                        return false;
                    }
                }
            }
        }
        // [end - disclosed validation]


        // [start - stop limit validation]
        var revStopLimit = panel.revStopLimit;
        var orgStopLimit = panel.stoplimit;
        if (stoplimit && stoplimit != panel.stoplimit) {
            isRev = true;

            if (revStopLimit != null && revStopLimit != '') {
                if (parseFloat(stoplimit) > parseFloat(orgStopLimit)) {
                    if (revStopLimit.indexOf('+') == -1) {
                        msgutil.alert(languageFormat.getLanguage(30227, 'New order trigger price cannot be more than original trigger price.'), function (btn, txt) {
                            if (btn == 'ok') {
                                input.down('#stoplimit').focus();
                            }
                        });
                        return false;
                    }
                } else if (parseFloat(stoplimit) < parseFloat(orgStopLimit)) {
                    if (revStopLimit.indexOf('-') == -1) {
                        msgutil.alert(languageFormat.getLanguage(30228, 'New order trigger price cannot be less than original trigger price.'), function (btn, txt) {
                            if (btn == 'ok') {
                                input.down('#stoplimit').focus();
                            }
                        });
                        return false;
                    }
                }
            }
        }
        // [end - stop limit validation]

        // [start - private order validation]
        var orgState = panel.state;
        if (state != formatutils.privateOrderChecking(orgState)) {
            isRev = true;
        }
        // [end - private order validation]

        if (tptype && tptype != panel.revTPType) {
            isRev = true;
        }

        if (tpdirection && tpdirection != panel.revTPDirection) {
            isRev = true;
        }

        //1.3.25.3 Set a fix pin when trading pin is hidden
        if (panel.checkIsHidePin()) {
            ordPad.down('#pin').setValue("123456");
            pin = "123456";
        }
        pin = trim(pin);
        if (!pin) {
            msgutil.alert(languageFormat.getLanguage(30212, 'Please enter your trading pin.'), function (btn, txt) {
                if (btn == 'ok') {
                    ordPad.down('#pin').focus();
                }
            });
            return false;
        }

        if (!panel.pinTest.test(pin)) {
            msgutil.alert(languageFormat.getLanguage(30213, 'Invalid trading pin. Please check your trading pin.'), function (btn, txt) {
                if (btn == 'ok') {
                    ordPad.down('#pin').focus();
                }
            });
            return false;
        }

        if (!isRev) {
            msgutil.alert(languageFormat.getLanguage(30231, 'You did not make any changes for the order.'), function (btn, txt) {
                if (btn == 'ok') {
                    //input.down('#otype').focus();
                }
            });
            return false;
        }

        return true;
    },
    validateCncl: function () {

        var panel = this;
        var ordPad = panel.trdForm.down('#OrdPad');
//        if (!panel.trdForm.getForm().isValid()) {
//            msgutil.alert(panel.inputErrorMsg);
//            return false;
//        }
        act = ordPad.down('#act').getValue();
        act = trim(act);
        if (!act)
            return false;

        var pin = ordPad.down('#pin').getValue();
        //1.3.25.3 Set a fix pin when trading pin is hidden
        if (panel.checkIsHidePin()) {
            ordPad.down('#pin').setValue("123456");
            pin = "123456";
        }
        pin = trim(pin);
        if (!pin) {
            msgutil.alert(languageFormat.getLanguage(30212, 'Please enter your trading pin.'), function (btn, txt) {
                if (btn == 'ok') {
                    ordPad.down('#pin').focus();
                }
            });
            return false;
        }
        return true;
    },
    setMode: function (mode) {

        // to determine the action + load account info
        var panel = this;
        var ordPad = panel.trdForm.down('#OrdPad');
        //console.log(ordPad.down('#inPanel'));
        var input = ordPad.down('#inPanel');
        try {
            if (!mode)
                mode = panel.mode;
            //if (!mode) mode = modeOrdBuy;	// if set mode is not valid then why will reach here?
            panel.setActionList(mode);	// to set action available [e.g Buy / Sell / Cancel / Revise]
            panel.setActList(1);		// load action list
            ordPad.down('#act').setValue(mode);	// set action

            input.down('#cbAction').setValue(mode);	// set action combo current action
            panel.setBGColor(mode);		// set order pad colour
            panel.selectActionMode(mode);	// buy / sell / revise / cancel action

            if (mode == modeOrdBuy || mode == modeOrdSell) {	// only Buy / Sell need reload all and Revise / Cancel will get the right account
                panel.setAccList(1);	// load account list into GUI	
            }

            //panel.callAccBal();		// load balance from ATP
//            if (mode == modeOrdBuy || mode == modeOrdSell) {
////            	ordPad.down('#act').setValue(mode);
////                panel.selectActionMode(mode);
////                panel.setDefault();
//////                panel.setDefault(2);
//            } else if (mode == modeOrdCancel || mode == modeOrdRevise) {
//////                ordPad.down('#act').setValue(mode);
//////                panel.selectActionMode(mode);
//////                panel.setDefault(1);
//            }
        } catch (e) {
            console.log('[OrderPad][setMode] Exception ---> ' + e);
        }
    },
    setActList: function (mode) {

        var panel = this;
        var input = panel.trdForm.down('#inPanel');
        try {
            var el = input.down('#cbAction');
            var val = panel.mode;
            if (el) {
                if (mode == 0) {
                    el.store.removeAll();
                    el.clearValue();
                } else if (mode == 1) {
                    el.store.loadData(panel.arActionList);
                    el.collapse();
                    if (!val) {
                        if (panel.arActionList.length > 0) {
                            val = panel.arActionList[0][0];
                        }
                    }
                    el.setValue(val);
                } else if (mode == 3) {
                    el.store.loadData(panel.arActionList);
                    el.collapse();
                    el.setValue(val);
                }
            }
        } catch (e) {
            console.log('[OrderPad][setActList] Exception ---> ' + e);
        }
    },
    setOTypeList: function (mode) {

        var panel = this;
        try {
            var input = panel.trdForm.down('#inPanel');
            var el = input.down('#otype');
            if (el != null) {
                var val;
                if (mode == 0) {
                    el.store.removeAll();
                    el.clearValue();
                } else if (mode == 1) {
                    el.store.loadData(panel.arOTypeList);
                    el.collapse();
                    val = panel.lastOrdType ? panel.lastOrdType : ((panel.arOTypeList && panel.arOTypeList.length > 0) ? panel.arOTypeList[0][0] : '');
                    el.setValue(val);
                } else {
                    el.store.loadData(panel.arOTypeList);
                    el.collapse();
                    val = (panel.arOTypeList && panel.arOTypeList.length > 0) ? panel.arOTypeList[0][0] : '';
                    el.setValue(val);
                }
            }
        } catch (e) {
            console.log('[OrderPad][setOTypeList] Exception ---> ' + e);
        }
    },
    setValidityList: function (mode) {

        var panel = this;
        try {
            var el = panel.trdForm.down('#cbValidity');
            if (el) {
                var val;
                if (mode == 0) {

                    el.store.removeAll();
                    el.clearValue();
                    panel.setValidity('');

                } else if (mode == 1) {
                	var v = false;
                    el.store.loadData(panel.arValidityList);
                    el.collapse();
                    if (panel.lastValidity) {
                    	for(var i=0; i<panel.arValidityList.length; i++){
                    		if(panel.lastValidity == panel.arValidityList[i][0]){
                    			v = true;
                    			break;
                    		}
                    	}
                    	if(v){
                    		if (panel.lastValidity == 'GTD') {
                                val = panel.getValidityCmb();
                            } else {
                                val = panel.lastValidity;
                            }
                    	}else{
                    		val = panel.arValidityList[0][0];
                    	}
                    } else {
                        if ((panel.arValidityList && panel.arValidityList.length > 0)) {
                            val = panel.arValidityList[0][0];
                        } else {
                            val = '';
                        }
                    }
                    //val = panel.lastValidity ? panel.lastValidity : ((panel.arValidityList && panel.arValidityList.length > 0) ? panel.arValidityList[0][0] : '');
                    el.setValue(val);

                } else {
                    el.store.loadData(panel.arValidityList);
                    el.collapse();
                    val = (panel.arValidityList && panel.arValidityList.length > 0) ? panel.arValidityList[0][0] : '';
                    el.setValue(val);
                }
            }
        } catch (e) {
            console.log('[OrderPad][setValidityList] Exception ---> ' + e);
        }
    },
    setPaymentList: function (mode) {

        if (forceDisablePayment == "TRUE") {
            // ignore
        } else {
            var panel = this;
            try {
                var el = panel.trdForm.down('#payment');
                if (el) {
                    var tempAccPaymentList = panel.getPaymentOption();
                    if (tempAccPaymentList.length > 0) {
                        panel.arPaymentList.length = 0;
                        for (var i = 0; i < tempAccPaymentList.length; i++) {
                            panel.arPaymentList.push([tempAccPaymentList[ i ], tempAccPaymentList[ i ]]);
                        }
                    } else {
                        var tempList = panel.origArPaymentList;
                        if (tempList) {
                            panel.arPaymentList.length = 0;
                            for (var i = 0; i < tempList.length; i++) {
                                var tempOpt = tempList[i];
                                if (tempOpt) {
                                    panel.arPaymentList.push(tempOpt);
                                }
                            }
                        }
                    }

                    var val;
                    if (mode == 0) {
                        el.store.removeAll();
                        el.clearValue();
                    } else if (mode == 1) {
                        el.store.loadData(panel.arPaymentList);
                        el.collapse();
                        val = panel.lastPayment ? panel.lastPayment : ((panel.arPaymentList && panel.arPaymentList.length > 0) ? panel.arPaymentList[0][0] : '');
                        el.setValue(val);
                    } else {
                        el.store.loadData(panel.arPaymentList);
                        el.collapse();
                        val = (panel.arPaymentList && panel.arPaymentList.length > 0) ? panel.arPaymentList[0][0] : '';
                        el.setValue(val);
                    }
                }
            } catch (e) {
                console.log('[OrderPad][setPaymentList] Exception ---> ' + e);
            }
        }
    },
    setTPTypeList: function (mode) {
        var panel = this;
        try {
            var input = panel.trdForm.down('#inPanel');
            var el = input.down('#tptype');
            if (el != null) {
                var val;
                if (mode == 0) {
                    el.store.removeAll();
                    el.clearValue();
                } else if (mode == 1) {
                    el.store.loadData(panel.arTPTypeList);
                    el.collapse();
                    val = panel.lastTPType ? panel.lastTPType : ((panel.arTPTypeList && panel.arTPTypeList.length > 0) ? panel.arTPTypeList[0][0] : '');
                    el.setValue(val);
                } else {
                    el.store.loadData(panel.arTPTypeList);
                    el.collapse();
                    val = (panel.arTPTypeList && panel.arTPTypeList.length > 0) ? panel.arTPTypeList[0][0] : '';
                    el.setValue(val);
                }
            }
        } catch (e) {
            console.log('[OrderPad][setTPTypeList] Exception ---> ' + e);
        }
    },
    setTPDirectionList: function (mode) {
        var panel = this;
        try {
            var input = panel.trdForm.down('#inPanel');
            var el = input.down('#tpdirection');
            if (el != null) {
                var val;
                if (mode == 0) {
                    el.store.removeAll();
                    el.clearValue();
                } else if (mode == 1) {
                    el.store.loadData(panel.arTPDirectionList);
                    el.collapse();
                    val = panel.lastTPDirection ? panel.lastTPDirection : ((panel.arTPDirectionList && panel.arTPDirectionList.length > 0) ? panel.arTPDirectionList[0][0] : '');
                    el.setValue(val);
                } else {
                    el.store.loadData(panel.arTPDirectionList);
                    el.collapse();
                    val = (panel.arTPDirectionList && panel.arTPDirectionList.length > 0) ? panel.arTPDirectionList[0][0] : '';
                    el.setValue(val);
                }
            }
        } catch (e) {
            console.log('[OrderPad][setTPDirectionList] Exception ---> ' + e);
        }
    },
    setCFDOffsetTypeList: function (mode) {
        var panel = this;
        try {
            var input = panel.trdForm.down('#inPanel');
            for(var i = 0; i<2; i++){
            var el = input.down('#cfdostype_' + i);
            if (el != null) {
                var val;
                if (mode == 0) {
                    el.store.removeAll();
                    el.clearValue();
                } else if (mode == 1) {
                    el.store.loadData(panel.arCFDOffsetTypeList);
                    el.collapse();
                    val = panel.lastOffsetType ? panel.lastOffsetType : ((panel.arCFDOffsetTypeList && panel.arCFDOffsetTypeList.length > 0) ? panel.arCFDOffsetTypeList[0][0] : '');
                    el.setValue(val);
                } else {
                    el.store.loadData(panel.arCFDOffsetTypeList);
                    el.collapse();
                    val = (panel.arCFDOffsetTypeList && panel.arCFDOffsetTypeList.length > 0) ? panel.arCFDOffsetTypeList[0][0] : '';
                    el.setValue(val);
                }
            }
            }
        } catch (e) {
            console.log('[OrderPad][setOffsetTypeList] Exception ---> ' + e);
        }
    },
    setTakeProfitTypeList: function (mode) {
    	var panel = this;
    	try {
    		var input = panel.trdForm.down('#inPanel');
    		var el = input.down('#ordTypeTakeProfit');
    		if (el != null) {
    			var val;
    			if (mode == 0) {
    				el.store.removeAll();
    				el.clearValue();
    			} else if (mode == 1) {
    				el.store.loadData(panel.arTakeProfitOrderTypeList);
    				el.collapse();
    				val = panel.lastTakeProfitOrdType ? panel.lastTakeProfitOrdType : ((panel.arTakeProfitOrderTypeList && panel.arTakeProfitOrderTypeList.length > 0) ? panel.arTakeProfitOrderTypeList[0][0] : '');
    				el.setValue(val);
    			} else {
    				el.store.loadData(panel.arTakeProfitOrderTypeList);
    				el.collapse();
    				val = (panel.arTakeProfitOrderTypeList && panel.arTakeProfitOrderTypeList.length > 0) ? panel.arTakeProfitOrderTypeList[0][0] : '';
    				el.setValue(val);
    			}
    		}
    	} catch (e) {
    		console.log('[OrderPad][setTakeProfitOrdTypeList] Exception ---> ' + e);
    	}
    },
    setStopLossTypeList: function (mode) {
    	var panel = this;
    	try {
    		var input = panel.trdForm.down('#inPanel');
    		var el = input.down('#ordTypeCutLoss');
    		if (el != null) {
    			var val;
    			if (mode == 0) {
    				el.store.removeAll();
    				el.clearValue();
    			} else if (mode == 1) {
    				el.store.loadData(panel.arStopLossOrderTypeList);
    				el.collapse();
    				val = panel.lastStopLossOrdType ? panel.lastStopLossOrdType : ((panel.arStopLossOrderTypeList && panel.arStopLossOrderTypeList.length > 0) ? panel.arStopLossOrderTypeList[0][0] : '');
    				el.setValue(val);
    			} else {
    				el.store.loadData(panel.arStopLossOrderTypeList);
    				el.collapse();
    				val = (panel.arStopLossOrderTypeList && panel.arStopLossOrderTypeList.length > 0) ? panel.arStopLossOrderTypeList[0][0] : '';
    				el.setValue(val);
    			}
    		}
    	} catch (e) {
    		console.log('[OrderPad][setStopLossOrdTypeList] Exception ---> ' + e);
    	}
    },
    getTakeProfitOrdType: function () {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#ordTypeTakeProfit');
        if (el)
            return el.getValue();
        else
            return '';
    },
    getStopLossOrdType: function () {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#ordTypeCutLoss');
        if (el)
            return el.getValue();
        else
            return '';
    },
    setStkRuleUI: function (ex) {

        // TODO:
//        var panel = this;
//        var ordPad = panel.trdForm.down('#OrdPad');
//        var input = panel.trdForm.down('#inPanel');
//        try {
//            panel.initFldCfg(ex);
//
//            var lotsize = panel.lotsize;
//            var currency = panel.currency;
//            act = ordPad.down('#act').getValue();
//
//            // check exchange rule UI.
//            if(act == modeOrdCancel || act == modeOrdRevise) {
//                // cancel/revise
//                var qtyInLot = '';
//                var minQtyInLot = '';
//                var dsQtyInLot = '';
//                if (lotsize && !isNaN(lotsize) && lotsize > 0) {
//                    qtyInLot = (panel.ordqty > 0) ? panel.ordqty / lotsize : '';
//                    minQtyInLot = (panel.minqty > 0) ? panel.minqty / lotsize : '';
//                    dsQtyInLot = (panel.dsqty > 0) ? panel.dsqty / lotsize : '';
//                } else {
//                    lotsize = panel.getDefLotSize();
//                }
//                panel.setLotSize(lotsize);
//
//                var accno = panel.accno;
//                var tktno = panel.tktno;
//                var ordno = panel.ordno;
//                var subordno = panel.subordno;
//                var price = panel.ordprc;
//                //if (parseFloat(price) == 0) price = '';
//                if (isNaN(price)) price = '';
//                var ordtype = panel.ordtype;
//                var validity = panel.validity;
//                var gtd = panel.expdate;
//                //var stoplimit = panel.stoplimit;
//
//                panel.setAccList(1);
//                panel.setOTypeList(1);
//                panel.setValidityList(1);
//                panel.setPaymentList(1);
//                panel.setCurrency(currency, 1);
//                //panel.setCreditLimit(accno); //get from RMS
//                panel.callAccBal();
//                panel.setAccountNo(accno);
//                panel.setQty(qtyInLot);
//                panel.setMinQty(minQtyInLot);
//                panel.setDsQty(dsQtyInLot);
//                panel.setDefaultPrice(price, panel.bidRec, panel.askRec, false);
//                panel.setOrdType(ordtype);
//            	panel.setValidityCmb(validity);
//            	panel.setValidity(validity);
//                panel.setSettCurr(currency);
//                ordPad.down('#tktno').setValue(tktno);
//                ordPad.ordno.setValue(ordno);
//                ordPad.subordno.setValue(subordno);
//
//                if (validity && validity == 'GTD' && gtd && gtd.length >= 10) {
//                    var dt = gtd.substring(0, 8);
//                    var date = Ext.Date.format(dt, 'Ymd');
//                    panel.setGTD(dt);
//                    panel.setGTDLbl(Ext.Date.format(date,'d/m/Y'));
////                    ordPad.gtd.setValue(dt);
////                    input.lblGTD.setValue(Ext.Date.format(date,'d/m/Y'));
//                }
//
//                if (ordtype == 'StopLimit' && panel.stoplimit) panel.setStopLimit(panel.stoplimit);
//
//                panel.disableCmp(input.down('#accountno'));
//                if (act == modeOrdCancel) {
//                    panel.disableCmp(input.down('#price'));
//                    panel.disableCmp(input.down('#quantity'));
//                    panel.disableCmp(input.down('#otype'));
//                    panel.disableCmp(input.down('#cbValidity'));
//
//                    //derivatives
//                    panel.disableCmp(input.down('#stoplimit'));
//                    panel.disableCmp(input.down('#minqty'));
//                    panel.disableCmp(input.down('#dsqty'));
//
//                    //SGX
//                    panel.disableCmp(input.down('#payment'));
//                    panel.disableCmp(input.down('#settcurr'));
//                    panel.disableCmp(input.down('#strategy'));
//                } else {
//
//                    var revPrc = panel.revPrc;
//                    var revQty = panel.revQty;
//                    var revDisclosedQty = panel.revDisclosedQty;
//                    var revOrderType = panel.revOrderType;
//                    var revValidity = panel.revValidity;
//                    var revStopLimit = panel.revStopLimit;
//
//                    if (revPrc) panel.enableCmp(input.down('#price'));
//                    else panel.disableCmp(input.down('#price'));
//
//                    if (revQty) panel.enableCmp(input.down('#quantity'));
//                    else panel.disableCmp(input.down('#quantity'));
//
//                    if (revOrderType) {
//                        panel.enableCmp(input.down('#otype'));
//                        if (ordtype == 'StopLimit') panel.enableCmp(input.down('#stoplimit'));
//                    }
//                    else panel.disableCmp(input.down('#otype'));
//
//                    if (revValidity) panel.enableCmp(input.down('#cbValidity'));
//                    else panel.disableCmp(input.down('#cbValidity'));
//
//                    if (revStopLimit) panel.enableCmp(input.down('#stoplimit'));
//                    else panel.disableCmp(input.down('#stoplimit'));
//
//                    if (revDisclosedQty) panel.enableCmp(input.down('#dsqty'));
//                    else panel.disableCmp(input.down('#dsqty'));
//
//                    panel.disableCmp(input.down('#minqty'));
////                    panel.disableCmp(input.currency);
//
//                    //SGX
//                    panel.disableCmp(input.down('#payment'));
//                    panel.disableCmp(input.down('#settcurr'));
//                    panel.disableCmp(input.down('#strategy'));
//                }
//            } else {
//                // buy/sell
//                panel.setAccList(1);
//                panel.setOTypeList(1);
//                panel.setValidityList(1);
//                panel.setPaymentList(1);
//                panel.setCurrency(currency, 1);
//                if (!lotsize || isNaN(lotsize) || lotsize < 1) lotsize = panel.getDefLotSize();
//                panel.setLotSize(lotsize);
//                //panel.setCreditLimit(panel.getAccountNo()); //get from RMS
//                panel.callAccBal();
//
//                panel.enableCmp(input.down('#accountno'));
//                panel.enableCmp(input.down('#price'));
//                panel.enableCmp(input.down('#quantity'));
//                panel.enableCmp(input.down('#otype'));
//                panel.enableCmp(input.down('#cbValidity'));
//
//                panel.disableCmp(input.down('#dsqty'));
//                panel.disableCmp(input.down('#minqty'));
//                panel.disableCmp(input.down('#stoplimit'));
//
//                //SGX
//                panel.enableCmp(input.down('#payment'));
//                panel.enableCmp(input.down('#settcurr'));
//                panel.enableCmp(input.down('#strategy'));
//
//                panel.setGTD('');
//                panel.setGTDLbl('');
////                ordPad.gtd.setValue('');
////                input.lblGTD.setValue('');
//                panel.setStopLimit('');
//                panel.setDsQty('');
//                panel.setMinQty('');
//            }
//
//            if(panel.savePin) ordPad.down('#pin').setValue(panel.lastPin);
//
//            ordPad.down('#chkSavePin').setValue(panel.savePin);
//            ordPad.down('#skipconfirm').setValue(panel.saveConf);
//        } catch(e) {
//            debug(e);
//        }
    },
    chkTradeEx: function (ex) {

        var panel = this;
        try {
            var canTrd = canTrade(ex);
            panel.canTrade = canTrd;
        } catch (e) {
            console.log('[OrderPad][chkTradeEx] Exception ---> ' + e);
            canTrd = false;
        }
        return canTrd;
    },
    chkTradeBoard: function (board) {

        //if (board && (board == 'B' || board == 'I')) return false;
        if (board) {
            if (board == 'B') {
                if (tradeBoardRestrictionB == "TRUE") {
                    return true;
                } else {
                    return false;
                }
            } else if (board == 'D') {
                if (tradeBoardRestrictionD == "TRUE") {
                    return true;
                } else {
                    return false;
                }
            } else if (board == 'I') {
                if (tradeBoardRestrictionI == "TRUE") {
                    return true;
                } else {
                    return false;
                }
            } else if (board == 'O') {
                if (tradeBoardRestrictionO == "TRUE") {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
        return true;
    },
//    setStkExRule: function (ex) {
//        var panel = this;
//        var ordPad = panel.trdForm.down('#OrdPad');
//        act = ordPad.down('#act').getValue();
//        if (act == modeOrdBuy || act == modeOrdSell) {
//            panel.initBuySell();
//        } else if (act == modeOrdCancel || act == modeOrdRevise) {
//            panel.initCancelRevise();
//        } else {
//            panel.initBuySell();
//        }
//        if (panel.canTrade) panel.setStkRuleUI(ex);
//        else alert('You are not allow to do trading.');
//    },
    initForm: function (mode) {

        var panel = this;
        try {
            var ordPad = panel.trdForm.down('#OrdPad');

            panel.setBGColor();

            var savePin = panel.savePin;
            var saveConf = panel.saveConf;
            var pin = panel.lastPin;
            panel.trdForm.getForm().reset();

            panel.resetPanel();

            if (mode == 0) {
                panel.selectDefault = true;

                panel.savePin = savePin;
                panel.saveConf = saveConf;
                panel.lastPin = pin;
                panel.setSetting();

                panel.setActList(mode);
                panel.setAccList(mode);
                panel.setOTypeList(mode);
                panel.setValidityList(mode);
                panel.setPaymentList(mode);
                panel.setTPTypeList(mode);
                panel.setTPDirectionList(mode);
                panel.setCFDOffsetTypeList(mode);
                panel.setTakeProfitTypeList(mode);
                panel.setStopLossTypeList(mode);
                panel.setCurrency(null, mode);
                panel.setCreditLimit();
                panel.setDefaultPrice(null, null, null, true);
                panel.setQty('');
                panel.setStopLimit('');
                panel.setMinQty('');
                panel.setDsQty('');
                panel.setSettCurr('');
                panel.setStrategy(mode);

                // disable all the component
                panel.disableCmp(ordPad.down('#cbAction'));
                panel.disableCmp(ordPad.down('#accountno'));
                panel.disableCmp(ordPad.down('#price'));
                panel.disableCmp(ordPad.down('#stoplimit'));
                panel.disableCmp(ordPad.down('#otype'));
                panel.disableCmp(ordPad.down('#quantity'));
                panel.disableCmp(ordPad.down('#cbValidity'));
                panel.disableCmp(ordPad.down('#settcurr'));
                panel.disableCmp(ordPad.down('#payment'));
                panel.disableCmp(ordPad.down('#minqty'));
                panel.disableCmp(ordPad.down('#dsqty'));
                //panel.disableCmp(ordPad.down('#privateOrd'));
                panel.disableCmp(ordPad.down('#tptype'));
                panel.disableCmp(ordPad.down('#tpdirection'));
                panel.disableCmp(ordPad.down('#chkTakeProfit'));
                panel.disableCmp(ordPad.down('#chkCutLoss'));
                panel.disableCmp(ordPad.down('#ordTypeTakeProfit'));
                panel.disableCmp(ordPad.down('#ordTypeCutLoss'));
                panel.disableCmp(ordPad.down('#priceTakeProfit'));
                panel.disableCmp(ordPad.down('#cfdostype_0'));
                panel.disableCmp(ordPad.down('#priceCutLoss'));
                panel.disableCmp(ordPad.down('#cfdostype_1'));
                panel.disableCmp(ordPad.down('#tggrpriceCutLoss'));

            } else if (mode == 1) {

                panel.savePin = savePin;
                panel.saveConf = saveConf;
                panel.lastPin = pin;
                panel.setSetting();

                panel.setActList(0);
                panel.setAccList(mode);
                panel.setOTypeList(mode);
                panel.setValidityList(mode);
                panel.setPaymentList(mode);
                panel.setTPTypeList(mode);
                panel.setTPDirectionList(mode);
                panel.setCFDOffsetTypeList(mode);
                panel.setTakeProfitTypeList(mode);
                panel.setStopLossTypeList(mode);
                panel.setCurrency(null, mode);
                panel.setCreditLimit(panel.getAccountNo());
                panel.setDefaultPrice(null, null, null, true);
                panel.setQty('');
                panel.setStopLimit('');
                panel.setMinQty('');
                panel.setDsQty('');
                panel.setSettCurr('');
                panel.setStrategy(mode);	// TODO: 
            }

            panel.compRef.btnSubmit.enable();
            panel.compRef.btnReset.enable();
        } catch (e) {
            console.log('[OrderPad][initForm] Exception ---> ' + e);
        }
    },
    setLotSize: function (size) {

        size = size ? size : '';
        var lotsizeCmp = this.trdForm.down('#lotsize');
        var quantityCmp = this.trdForm.down('#quantity');

        if (lotsizeCmp && (!lotsizeCmp.getValue() || lotsizeCmp.getValue() != size)) {
            lotsizeCmp.setValue(size);
        }

        // bug - v1.3.14.16
        if (size && size > 0)
            this.updLotSize = true;

        if (quantityCmp != null && quantityCmp.labelEl != null) {

            if (size != null || !isNaN(size)) {

            	/*
                if (this.getExCode() == 'PH') {

                    quantityCmp.labelEl.update("<div style= 'margin-top:4px;margin-bottom:2px;'>" + this.getQtyTxt() + ':</div>');

                } else {
                 */
            	
                	if (size == "") {
                        quantityCmp.labelEl.update("<div style= 'margin-top:4px;margin-bottom:2px;'>" + this.getQtyTxt() + ':</div>');
                    } else {
                        quantityCmp.labelEl.update("<div style= 'margin-top:4px;margin-bottom:2px;'>" + this.getQtyTxt() + "x" + size + ':<div>');
                    }
                //}
            }
        }
    },
    selectValidityEvent: function (val) {

        var panel = this;
//        var input = panel.trdForm.down('#inPanel');
        if (val) {
            if (val == 'GTD') {
                panel.showCalendar();

                var act = panel.trdForm.down('#act').getValue();
                if (act) {
                    if (act == modeOrdBuy || act == modeOrdSell) {
                        var today = new Date();
                        panel.setValidityCmb(Ext.Date.format(today, 'd/m/Y'));
                        panel.setGTD(Ext.Date.format(today, 'Ymd'));
                        panel.setGTDLbl(Ext.Date.format(today, 'd/m/Y'));
                    } else if (act == modeOrdCancel || act == modeOrdRevise) {
                        var gtd = panel.expdate;
                        if (gtd && gtd.length >= 10) {
                            var dt = gtd.substring(0, 8);
                            var date = Ext.Date.format(dt, 'Ymd');
                            panel.setValidityCmb(Ext.Date.format(date, 'd/m/Y'));
                            panel.setGTD(dt);
                            panel.setGTDLbl(Ext.Date.format(date, 'd/m/Y'));
                        }
                    }
                }
            } else {
                panel.setGTD('');
                panel.setGTDLbl('');
                if (panel.datePickerWin) {
                    if (panel.datePickerWin.isVisible()) {
                        panel.datePickerWin.hide();
                    }
                }
            }
        } else {
//            input.btnGTD.disable();
        }
    },
    selectPayment: function (val) {
        debug('selectPayment:' + val);
    },
//    setTrdStkCode: function (stkcode, stkname, mode) {
//        var panel = this;
//        var ordPad = panel.trdForm.down('#OrdPad');
//        var input = ordPad.down('#inPanel');
//        var btns = ordPad.btnPanel;
//        var ex = '';
//        var board = '';
//        stkcode = stkcode == null ? '' : stkcode;
//        stkname = stkname == null ? '' : stkname;
//
//        if (stkcode.indexOf('.') != -1) {
//        	ex = getStkExCode(stkcode);
//        }
//        if (stkcode.indexOf(':') != -1) {
//            board = getStkBoard(stkcode);
//        }
//
//        if (stkname.indexOf('.') != -1) {
//        	stkname = stockutil.getStockName(stkname);
//        }
//        if (stkname) stkname = ' / ' + stkname;
//        if (stkcode) ordPad.down('#stkcode').setValue(stkcode);
//
//        if (ex) {
//            ordPad.ex.setValue(ex);
//            panel.exchangecode = ex;
//        }
//
//        // TODO:
////        var msg;
////        var action = panel.mode;
////        var canTrade = this.chkTradeEx(ex) && this.chkTradeBoard(board);
////////        console.log('mode: ' + mode + ' - stkcode: ' + stkcode  + ' - stkname: ' + stkname + ' - action: ' + action + ' - canTrade: ' + canTrade);
////        if (canTrade){//canTrade) {
////            if (action && (action == modeOrdCancel || action == modeOrdRevise)) {
////                if (canCancelRevise(panel.ordsts)) {
////                    panel.setStkExRule(ex);
////                    btns.btnSubmit.enable();
////                    btns.btnReset.enable();
////
////                    panel.enableCmp(input.down('#accountno'));
////                    panel.enableCmp(input.down('#cbAction'));
////                    panel.enableCmp(input.down('#price'));
////                    panel.enableCmp(input.down('#quantity'));
////                    panel.enableCmp(input.down('#otype'));
////                    panel.enableCmp(input.down('#cbValidity'));
////                    panel.enableCmp(ordPad.down('#pin'));
////                    
////                    panel.enableCmp(input.down('#stoplimit'));
////                    panel.enableCmp(input.down('#minqty'));
////                    panel.enableCmp(input.down('#dsqty'));
////
////                    //SGX
////                    panel.enableCmp(input.down('#payment'));
////                    panel.enableCmp(input.down('#settcurr'));
////                    panel.enableCmp(input.down('#strategy'));
////                } else {
////                    if (!mode) mode = 0;
////                    panel.initForm(mode);
////                    msg = 'You are not allow to cancel or revise this order';
////                    btns.btnSubmit.disable();
////                    btns.btnReset.disable();
////
////                    panel.disableCmp(input.down('#accountno'));
////                    panel.disableCmp(input.down('#cbAction'));
////                    panel.disableCmp(input.down('#price'));
////                    panel.disableCmp(input.down('#quantity'));
////                    panel.disableCmp(input.down('#otype'));
////                    panel.disableCmp(input.down('#cbValidity'));
////                    panel.disableCmp(ordPad.down('#pin'));
////                    if (panel.isReady && msg) {
////                        panel.trdForm.down('#msgBox').update(msg);
////                    }
////                    panel.disableCmp(input.down('#stoplimit'));
////                    panel.disableCmp(input.down('#minqty'));
////                    panel.disableCmp(input.down('#dsqty'));
////
////                    //SGX
////                    panel.disableCmp(input.down('#payment'));
////                    panel.disableCmp(input.down('#settcurr'));
////                    panel.disableCmp(input.down('#strategy'));
////                }
////            } else {
////                btns.btnSubmit.enable();
////                btns.btnReset.enable();
////                panel.enableCmp(input.down('#accountno'));
////                panel.enableCmp(input.down('#cbAction'));
////                panel.enableCmp(input.down('#price'));
////                panel.enableCmp(input.down('#quantity'));
////                panel.enableCmp(input.down('#otype'));
////                panel.enableCmp(input.down('#cbValidity'));
////                panel.enableCmp(ordPad.down('#pin'));
////
////                panel.disableCmp(input.down('#stoplimit'));
////                panel.disableCmp(input.down('#minqty'));
////                panel.disableCmp(input.down('#dsqty'));
////
////                //SGX
////                panel.enableCmp(input.down('#payment'));
////                panel.enableCmp(input.down('#settcurr'));
////                panel.enableCmp(input.down('#strategy'));
////
////                panel.setStkExRule();
////            }
////        } else {
////            if (!mode) mode = 0;
////            panel.initForm(mode);
////            if (action && (action == modeOrdCancel || action == modeOrdRevise)) {
////                msg = 'You are not allow to cancel or revise this order';
////            } else {
////                msg = 'You are not allow to trade this symbol';
////            }
////            if (panel.isReady) {
////                panel.trdForm.down('#msgBox').update(msg);
////            }
////                btns.btnSubmit.disable();
////                btns.btnReset.disable();
////                panel.disableCmp(input.down('#accountno'));
////                panel.disableCmp(input.down('#cbAction'));
////                panel.disableCmp(input.down('#price'));
////                panel.disableCmp(input.down('#quantity'));
////                panel.disableCmp(input.down('#otype'));
////                panel.disableCmp(input.down('#cbValidity'));
////                panel.disableCmp(ordPad.down('#pin'));
////
////                panel.disableCmp(input.down('#stoplimit'));
////                panel.disableCmp(input.down('#minqty'));
////                panel.disableCmp(input.down('#dsqty'));
////
////                //                panel.disableCmp(input.down('#payment'));
//////                panel.disableCmp(input.down('#settcurr'));
//////                panel.disableCmp(input.down('#strategy'));
////        }
//    },
    selectActionMode: function (act) {

        var panel = this;
        try {
            // clear values.
            panel.oldTktNo = '';

            var ordPad = panel.trdForm.down("#OrdPad");
            ordPad.down('#tktno').setValue('');
            ordPad.down('#ordno').setValue('');
            act = (act == null ? '' : act);
            if (act == modeOrdBuy) {

                panel.compRef.btnSubmit.setText(languageFormat.getLanguage(10001, 'Buy').toUpperCase());
                panel.compRef.btnSubmit.removeCls(["ordPad-SellBtn"]);
                panel.compRef.btnSubmit.addCls("ordPad-BuyBtn");
                panel.initBuySell();
            } else if (act == modeOrdSell) {

                panel.compRef.btnSubmit.setText(languageFormat.getLanguage(10002, 'Sell').toUpperCase());
                panel.compRef.btnSubmit.removeCls(["ordPad-BuyBtn"]);
                panel.compRef.btnSubmit.addCls("ordPad-SellBtn");
                panel.initBuySell();
            } else if (act == modeOrdCancel) {
                panel.compRef.btnSubmit.removeCls(["ordPad-BuyBtn", "ordPad-SellBtn"]);
                panel.compRef.btnSubmit.setText(languageFormat.getLanguage(10010, 'Cancel').toUpperCase());
                panel.initCancel(act);
            } else if (act == modeOrdRevise) {
                panel.compRef.btnSubmit.removeCls(["ordPad-BuyBtn", "ordPad-SellBtn"]);
                panel.compRef.btnSubmit.setText(languageFormat.getLanguage(10009, 'Revise').toUpperCase());
                panel.initRevise(act);
            }

            panel.setCreditLimit(panel.getAccountNo());	// load credit limit

        } catch (e) {
            console.log('[OrderPad][selectActionMode] Exception ---> ' + e);

        }
    },
    setDefault: function (mode) {

        var panel = this;
        var ordPad = panel.trdForm.down('#OrdPad');
        var input = panel.trdForm.down('#inPanel');
        act = ordPad.down('#act').getValue();
        try {
            var prevMode = panel.prevMode;
            var currMode = panel.mode;
            var accno = panel.accno;
            var tktno = panel.tktno;
            var ordno = panel.ordno;
            var subordno = panel.subordno;
            var price = panel.ordprc;
            var ordtype;
            var validity;
            var gtd;
            var stkcode;
            var stkname;
            var currency;
            var stoplimit;
            var lotsize; //1.3.24.6
            var date;
            var dt = '';
            var dtLbl = '';
            var qtyInLot = '';
            var dsQtyInLot = '';
            var minQtyInLot = '';

            if (prevMode == modeOrdBuy || prevMode == modeOrdSell) {
                if (currMode == modeOrdBuy || currMode == modeOrdSell)
                    mode = 2;
                else
                    mode = 1;
            } else {
                if (currMode == modeOrdCancel || currMode == modeOrdRevise)
                    mode = 2;
                else
                    mode = 1;
            }

//            debug(prevMode + '->' + currMode +  ':setDefault:' + mode);
//            //panel.setPayment('');
//            panel.setStrategy('');
//            if (mode == 1) {
//                if(act == modeOrdBuy || act == modeOrdSell || act == '') {
//                    stkcode = panel.stkcode;
//                    stkname = panel.stkname;
//                    lotsize = panel.lotsize;
//                    currency = panel.currency;
//                    panel.setAccList(mode);
//                    panel.setOTypeList(mode); //test
//                    panel.setValidityList(mode); //test
//                    panel.setPaymentList(mode); //test
//                    panel.setStkCode(stkcode, stkname, mode);
//                    panel.setCurrency(currency, mode);
//                    panel.setLotSize(lotsize);
//                    panel.setCreditLimit(panel.getAccountNo());
//                    //optional fields
//                    panel.setStopLimit('');
//                    panel.setDsQty('');
//                    panel.setMinQty('');
//
//                    panel.enableCmp(input.down('#accountno'));
//                    panel.enableCmp(input.down('#price'));
//                    panel.enableCmp(input.down('#quantity'));
////                    panel.enableCmp(input.down('#dsqty'));localo
////                    panel.enableCmp(input.down('#minqty'));
//                    panel.enableCmp(input.down('#otype'));
//                    panel.enableCmp(input.down('#cbValidity'));
////                    panel.enableCmp(input.currency);
//
//                    if (panel.lastPrc)
//                        panel.setPrc(panel.lastPrc);
//                    if (panel.lastQty)
//                        panel.setQty(panel.lastQty);
//                    if (panel.lastValidity) {
//                    	panel.setValidityCmb(panel.lastValidity);
//                    	panel.setValidity(panel.lastValidity);
//                    }
//                    if (panel.lastOrdType)
//                        panel.setOrdType(panel.lastOrdType);
//
//                    dt = '';
//                    dtLbl = '';
////                    if (panel.lastExpDate) {
////                        dt = panel.lastExpDate;
////                        date = Ext.Date.format(panel.lastExpDate, 'Ymd');
////                        dtLbl = Ext.Date.format(date,'d/m/Y');
////                    }
//                    if (panel.getValidity() != 'GTD') {
//                    	panel.setGTD(dt);
//                    	panel.setGTDLbl(dtLbl);
////                        ordPad.gtd.setValue(dt);
////                        input.lblGTD.setValue(dtLbl);
////                        input.btnGTD.disable();
//                    } else {
////                        input.btnGTD.enable();
//                    }
//
//                    panel.enableCmp(input.down('#payment'));
//                    panel.enableCmp(input.down('#settcurr'));
//
//                    if (input.down('#shortsell')) {
//                        input.down('#shortsell').setValue(false);
//                        if (act == modeOrdSell)
//                            input.down('#shortsell').enable();
//                        else
//                            input.down('#shortsell').disable();
//                    }
//
//                    if (panel.getOrdType() == 'StopLimit') {
//                        panel.enableCmp(input.down('#stoplimit'));
//                    } else {
//                        panel.disableCmp(input.down('#stoplimit'));
//                    }
//                } else if (act == modeOrdRevise || act == modeOrdCancel) {
//                    if (!canCancelRevise(panel.ordsts)) {
//                        return;
//                    }
//                    if (panel.lotsize && panel.lotsize > 0) {
//                        lotsize = panel.lotsize;
//                        panel.setLotSize(lotsize);
//                        qtyInLot = panel.ordqty / lotsize;
//                        dsQtyInLot = (panel.dsqty > 0) ? panel.dsqty / lotsize : '';
//                        minQtyInLot = (panel.minqty > 0) ? panel.minqty / lotsize : '';
//                    }
//                    accno = panel.accno;
//                    stkcode = panel.stkcode;
//                    stkname = panel.stkname;
//                    currency = panel.currency;
//                    stoplimit = panel.stoplimit;
//
//                    tktno = panel.tktno;
//                    ordno = panel.ordno;
//                    subordno = panel.subordno;
//                    price = panel.ordprc;
//                    ordtype = panel.ordtype;
//                    validity = panel.validity;
//                    gtd = panel.expdate;
//
//                    panel.setAccList(1);
//                    panel.setOTypeList(mode); //test
//                    panel.setValidityList(mode); //test
//                    panel.setPaymentList(mode); //test
////                    input.down('#accountno').setValue(accno);
//                    panel.setAccountNo(accno);
//                    panel.setStkCode(stkcode, stkname, mode);
//                    panel.setCurrency(currency, 1);
//                    panel.setCreditLimit(panel.getAccountNo());
//                    panel.setOrdType(ordtype);
//
//                	panel.setValidityCmb(validity);
//                	panel.setValidity(validity);
//                    input.down('#quantity').setValue(qtyInLot);
//                    panel.setDefaultPrice(price, panel.bidRec, panel.askRec);
//
//                    //optional fields
//                    if (ordtype && ordtype == 'StopLimit') panel.setStopLimit(stoplimit);
//                    panel.setDsQty(dsQtyInLot);
//                    panel.setMinQty(minQtyInLot);
//
//                    ordPad.down('#tktno').setValue(tktno);
//                    ordPad.ordno.setValue(ordno);
//                    ordPad.subordno.setValue(subordno);
//
//                    dt = '';
//                    dtLbl = '';
//                    if (gtd && gtd.length >= 10) {
//                        dt = gtd.substring(0, 8);
//                        date = Ext.Date.format(dt, 'Ymd');
//                        dtLbl = Ext.Date.format(date,'d/m/Y');
//                    }
//                    panel.setGTD(dt);
//                    panel.setGTDLbl(dtLbl);
////                    ordPad.gtd.setValue(dt);
////                    input.lblGTD.setValue(dtLbl);
//
//                    if (act == modeOrdCancel) {
//                        panel.disableCmp(input.down('#accountno'));
//                        panel.disableCmp(input.down('#price'));
//                        panel.disableCmp(input.down('#quantity'));
//                        panel.disableCmp(input.down('#dsqty'));
//                        panel.disableCmp(input.down('#minqty'));
//                        panel.disableCmp(input.down('#otype'));
//                        panel.disableCmp(input.down('#cbValidity'));
//                        panel.disableCmp(input.down('#stoplimit'));
////                        input.btnGTD.disable();
//                    } else {
//                        panel.disableCmp(input.down('#accountno'));
//                        panel.chkRevInput();
////                        if (input.down('#otype') && input.down('#otype').getValue() == 'StopLimit') {
//                        if (panel.getOrdType() == 'StopLimit') {
//                            panel.enableCmp(input.down('#stoplimit'));
//                        } else {
//                            panel.disableCmp(input.down('#stoplimit'));
//                        }
////                        if (panel.revValidity && validity == 'GTD') input.btnGTD.enable();
////                        else input.btnGTD.disable();
//                    }
//
//                    panel.disableCmp(input.down('#settcurr'));
//                    panel.disableCmp(input.down('#strategy'));
//                    panel.disableCmp(input.down('#payment'));
//                    if (input.down('#shortsell')) {
//                        input.down('#shortsell').setValue(false);
//                        input.down('#shortsell').disable();
//                    }
//                }
//            } else {
//                //select from combo
//                if(act == modeOrdBuy || act == modeOrdSell || act == '') {
//                    stkcode = panel.stkcode;
//                    stkname = panel.stkname;
//                    lotsize = panel.lotsize;
//                    currency = panel.currency;
//                    panel.setAccList(mode);
//                    panel.setStkCode(stkcode, stkname, mode);
//                    panel.setCurrency(currency, mode);
//                    panel.setLotSize(lotsize);
//                    panel.setCreditLimit(panel.getAccountNo());
//
//                    panel.enableCmp(input.down('#accountno'));
//                    panel.enableCmp(input.down('#price'));
//                    panel.enableCmp(input.down('#quantity'));
//                    panel.enableCmp(input.down('#otype'));
//                    panel.enableCmp(input.down('#cbValidity'));
//                    panel.enableCmp(input.down('#settcurr'));
//                    panel.enableCmp(input.down('#strategy'));
//
//                    if (panel.lastPrc) input.down('#price').setValue(panel.lastPrc);
//                    if (panel.lastQty) input.down('#quantity').setValue(panel.lastQty);
//
//                    dt = '';
//                    dtLbl = '';
//                    if (panel.getValidity() != 'GTD') {
////                        if (panel.lastExpDate) {
////                            dt = panel.lastExpDate;
////                            date = Ext.Date.format(panel.lastExpDate, 'Ymd');
////                            dtLbl = Ext.Date.format(date,'d/m/Y');
////                        }
////                        ordPad.gtd.setValue(dt);
////                        input.lblGTD.setValue(dtLbl);
//                    	panel.setGTD(dt);
//                    	panel.setGTDLbl(dtLbl);
////                        input.btnGTD.disable();
//                    } else {
////                        input.btnGTD.enable();
//                    }
//                    panel.enableCmp(input.down('#payment'));
//                    panel.enableCmp(input.down('#settcurr'));
//                    panel.enableCmp(input.down('#strategy'));
//                    if (input.down('#shortsell')) {
//                        input.down('#shortsell').setValue(false);
//                        if (act == modeOrdSell)
//                            input.down('#shortsell').enable();
//                        else
//                            input.down('#shortsell').disable();
//                    }
//
//                    if (panel.getOrdType() == 'StopLimit') {
//                        panel.enableCmp(input.down('#stoplimit'));
//                    } else {
//                        panel.disableCmp(input.down('#stoplimit'));
//                    }
//                } else if (act == modeOrdRevise || act == modeOrdCancel) {
//                    if (!canCancelRevise(panel.ordsts)) {
//                        return;
//                    }
//                    if (panel.lotsize && panel.lotsize > 0) {
//                        lotsize = panel.lotsize;
//                        panel.setLotSize(lotsize);
//                        qtyInLot = panel.ordqty / lotsize;
//                        dsQtyInLot = (panel.dsqty > 0) ? panel.dsqty / lotsize : '';
//                        minQtyInLot = (panel.minqty > 0) ? panel.minqty / lotsize : '';
//                    }
//                    stkcode = panel.stkcode;
//                    stkname = panel.stkname;
//                    currency = panel.currency;
//
//                    accno = panel.accno;
//                    tktno = panel.tktno;
//                    ordno = panel.ordno;
//                    subordno = panel.subordno;
//                    price = panel.ordprc;
//                    ordtype = panel.ordtype;
//                    validity = panel.validity;
//                    gtd = panel.expdate;
//                    stoplimit = panel.stoplimit;
//
//                    panel.setAccList(1);
//                    panel.setAccountNo(accno);
//                    panel.setStkCode(stkcode, stkname, mode);
//                    panel.setCurrency(currency, 1);
//                    panel.setCreditLimit(accno);
//                    panel.setOTypeList(mode);
//                    panel.setOrdType(ordtype);
//
//                	panel.setValidityCmb(validity);
//                	panel.setValidity(validity);
//                    panel.setQty(qtyInLot);
//                    panel.setDefaultPrice(price, panel.bidRec, panel.askRec);
//                    ordPad.down('#tktno').setValue(tktno);
//                    ordPad.ordno.setValue(ordno);
//                    ordPad.subordno.setValue(subordno);
//                    panel.setDsQty(dsQtyInLot);
//                    panel.setMinQty(minQtyInLot);
//                    if (ordtype && ordtype == 'StopLimit') panel.setStopLimit(stoplimit);
//
//                    dt = '';
//                    dtLbl = '';
//                    if (gtd && gtd.length >= 10) {
//                        dt = gtd.substring(0, 8);
//                        date = Ext.Date.format(dt, 'Ymd');
//                        dtLbl = Ext.Date.format(date,'d/m/Y');
//                    }
////                    ordPad.gtd.setValue(dt);
////                    input.lblGTD.setValue(dtLbl);
//                    panel.setGTD(dt);
//                    panel.setGTDLbl(dtLbl);
//
//                    if (act == modeOrdCancel)  {
//                        panel.disableCmp(input.down('#accountno'));
//                        panel.disableCmp(input.down('#price'));
//                        panel.disableCmp(input.down('#quantity'));
//                        panel.disableCmp(input.down('#dsqty'));
//                        panel.disableCmp(input.down('#minqty'));
//                        panel.disableCmp(input.down('#otype'));
//                        panel.disableCmp(input.down('#cbValidity'));
//                        panel.disableCmp(input.down('#stoplimit'));
//
////                        input.btnGTD.disable();
//                    } else {
//                        panel.disableCmp(input.down('#accountno'));
//                        panel.chkRevInput();
//
////                        if (input.down('#otype') && input.down('#otype').getValue() == 'StopLimit') {
//                        if (panel.getOrdType() == 'StopLimit') {
//                            panel.enableCmp(input.down('#stoplimit'));
//                        } else {
//                            panel.disableCmp(input.down('#stoplimit'));
//                        }
////                        if (panel.revValidity && validity == 'GTD') {
////                            if (panel.revOrderType) input.btnGTD.enable();
////                        }
////                        else input.btnGTD.disable();
//                    }
//                    panel.disableCmp(input.down('#payment'));
//                    panel.disableCmp(input.down('#settcurr'));
//                    panel.disableCmp(input.down('#strategy'));
//                    if (input.down('#shortsell')) {
//                        input.down('#shortsell').setValue(false);
//                        input.down('#shortsell').disable();
//                    }
//                }
//            }
        } catch (e) {
            console.log('[OrderPad][setDefault] Exception ---> ' + e);
        }
        panel.setBGColor(act);
    },
    chkRevInput: function () {


        var panel = this;
        var input = panel.trdForm.down('#inPanel');
        var revPrc = panel.revPrc;
        var revQty = panel.revQty;
        var revOrderType = panel.revOrderType;
        var revValidity = panel.revValidity;
        var revDisclosedQty = panel.revDisclosedQty;

        if (revPrc)
            panel.enableCmp(input.down('#quantity'));
        else
            panel.disableCmp(input.down('#price'));

        if (revQty)
            panel.enableCmp(input.down('#quantity'));
        else
            panel.disableCmp(input.down('#quantity'));

        if (revOrderType)
            panel.enableCmp(input.down('#otype'));
        else
            panel.disableCmp(input.down('#otype'));

        if (revValidity)
            panel.enableCmp(input.down('#cbValidity'));
        else
            panel.disableCmp(input.down('#cbValidity'));

        if (revDisclosedQty)
            panel.enableCmp(input.down('#dsqty'));
        else
            panel.disableCmp(input.down('#dsqty'));

//        if (revDisclosedQty) panel.enableCmp(input.down('#minqty'));
//        else panel.disableCmp(input.down('#minqty'));
    },
    setBGColor: function (act) {
        var panel = this;

        try {
            var bg = N2NCSS.OrderPad_Default;

            if (act == modeOrdBuy)
                bg = N2NCSS.OrderPad_Buy;
            else if (act == modeOrdSell)
                bg = N2NCSS.OrderPad_Sell;

            panel.trdForm.body.removeCls(N2NCSS.AllOrderPadStyle);
            panel.trdForm.body.addCls(bg);

        } catch (e) {
            console.log('[OrderPad][setBGColor] Exception ---> ' + e);
        }
    },
    reset: function () {
        var panel = this;

        panel.oldTktNo = '';
        panel.lastAccount = '';
        panel.lastOrdType = '';
        panel.lastValidity = '';
        panel.lastStopLimit = '';
        panel.lastExpDate = '';
        panel.lastQty = '';
        panel.lastPrc = '';
        panel.lastAccNo = '';
        panel.lasTPType = '';
        panel.lastTPDirection = '';
        panel.lastOffsetType = '';
        panel.lastTakeProfitOrdType = '';
        panel.lastStopLossOrdType = '';

        //panel.resetSearch();
        panel.setLotSize('');
        panel.initForm(0);
        panel.setMsgBox(true);
        panel.compRef.btnSubmit.removeCls(["ordPad-SellBtn","ordPad-BuyBtn"]);
        panel.compRef.btnSubmit.setText(languageFormat.getLanguage(20849, 'Submit'));
        // panel.btnlimit.disable();
//        panel.btnlimit.hide();
//        panel.setSetting();
        panel.isReady = true;
    },
    setSetting: function () {

        var ordPad = this.trdForm.down('#OrdPad');
        ordPad.down('#skipconfirm').setValue(this.saveConf);
        ordPad.down('#chkSavePin').setValue(this.savePin);
        if (this.savePin) {
            ordPad.down('#pin').setValue(this.lastPin);
        }
    },
    submitBuy: function () {

        try {
            this.allowUpdate = false;
            var panel = this;
            var ordPad = panel.trdForm.down('#OrdPad');
            var input = panel.trdForm.down('#inPanel');
            var ccEl = ordPad.down('#cc');
            var ac = ordPad.down('#ac').getValue();

            if (ac == '') {
                ac = panel.getAccountNo();
                ordPad.down('#ac').setValue(ac);
            }

            for (var i = 0; i < panel.accs.length; i++) {
                if (panel.accs[i].ac == ac) {
                    ccEl.setValue(panel.accs[i].cc);
                    break;
                }
            }


            var valid = panel.validateBS();
            if (valid) {
                if (panel.oldTktNo) {
                    ordPad.down('#tktno').setValue(panel.oldTktNo);
                } else {
                    ordPad.down('#tktno').setValue('');
                }
                var skip = ordPad.down('#skipconfirm').getValue();
                panel.price = input.down('#price').getRawValue();
                if (!skip) {
                    var currencyEl = input.down('#settcurr');
                    var defCurrency;
                    if (currencyEl && currencyEl.getValue()) {
                        defCurrency = currencyEl.getValue();
                    } else {
                        defCurrency = panel.currency;
                        if (currencyEl && forceDisableSettCurr != "TRUE")
                            currencyEl.setValue(defCurrency);
                    }
                    var stkname = panel.stkname;
                    var stkcode = ordPad.down('#stkcode').getValue();
                    var type = input.down('#otype').getValue();
                    var validity = input.down('#cbValidity').getValue();
                    var price = input.down('#price').getRawValue();
                    var qty = input.down('#quantity').getValue();
                    var lotsize = ordPad.down('#lotsize').getValue();
                    var tggrprice = input.down('#stoplimit').getValue();
                    var tggrtype = input.down('#tptype').getRawValue();
                    var tggrdirection = input.down('#tpdirection').getRawValue();
                    
                    if (N2N_CONFIG.orderRoundQty) {
                        qty = jsutil.getNumFromRound(qty);
                    }
                    
                    qty = qty * lotsize;
                    
                    var msgBuf = new Array();
                    var st = '<span style="width:130px;display:inline-block;">';
                    msgBuf.push('<span style="font-size:1.3em;display:inline-block;font-weight:bold;">' + stkname + '</span>');
                    msgBuf.push('<span style="font-size:1.1em;display:inline-block;">' + stkcode + '</span>');
                    msgBuf.push(st + languageFormat.getLanguage(20833, 'Account No.') + ':  </span><b>' + ac + '</b>');
                    msgBuf.push(st + languageFormat.getLanguage(20837, 'Order Type') + ':  </span><b style="color:green">' + languageFormat.getLanguage(10001, 'Buy') + ', </b><b>' + type + '</b>');
                    msgBuf.push(st + languageFormat.getLanguage(20838, 'Validity') + ':  </span><b>' + validity + '</b>');
                    msgBuf.push(st + languageFormat.getLanguage(20183, 'Order Price') + '(' + panel.currency + '):  </span><b>' + price + '</b>');
                    if (exchangecode == "MY") {
                        msgBuf.push(st + languageFormat.getLanguage(20851, 'Contract') + ':  </span><b>' + panel.formatNumberComa(qty) + '</b>');
                    } else {
                        msgBuf.push(st + languageFormat.getLanguage(20184, 'Order Qty') + ':  </span><b>' + panel.formatNumberComa(qty) + '</b>');
                    }

                    if (showExtraOrdMsg == 'TRUE') {
                        msgBuf.push(st + languageFormat.getLanguage(20853, 'Payment Mode') + ':  </span><b>' + panel.getPayment() + '</b>');
                        //msgBuf.push(st+ 'Total Order Value:  </span>'+ input.settcurr.getValue() + ' ' + (price * qty).toFixed(3));
                        msgBuf.push(st + languageFormat.getLanguage(20854, 'Total Order Value') + ':  </span><b>' + input.down('#settcurr').getValue() + ' ' + panel.totalValue + '</b>');
                    }

                    if (input.down('#stoplimit').isVisible()) {
                        if (input.down('#stoplimit').readOnly == false) {
                            if (input.down('#stoplimit').getValue() != '') {
                                msgBuf.push(st + 'Trigger Price:  </span><b>' + tggrprice + '</b>');
                            }
                        }
                    }

                    if (input.down('#tptype').isVisible()) {
                        if (input.down('#tptype').readOnly == false) {
                            if (input.down('#tptype').getValue() != '') {
                                msgBuf.push(st + 'Trigger Type:  </span><b>' + tggrtype + '</b>');
                            }
                        }
                    }

                    if (input.down('#tpdirection').isVisible()) {
                        if (input.down('#tpdirection').readOnly == false) {
                            if (input.down('#tpdirection').getValue() != '') {
                                msgBuf.push(st + 'Trigger Direction:  </span><b>' + tggrdirection + '</b>');
                            }
                        }
                    }

                    var tempLotSize = ordPad.down('#lotsize').getValue();
                    if (input.down('#dsqty').isVisible()) {
                        if (input.down('#dsqty').readOnly == false) {
                            if (input.down('#dsqty').getValue() != '') {
                                var dsQtyVal = input.down('#dsqty').getValue();
                                if (N2N_CONFIG.orderRoundQty) {
                                    dsQtyVal = jsutil.getNumFromRound(dsQtyVal) * parseInt(tempLotSize);
                                } else {
                                    dsQtyVal = parseInt(dsQtyVal) * parseInt(tempLotSize);
                                }
                                msgBuf.push(st + languageFormat.getLanguage(20839, 'Disclosed Qty') + ':  </span><b>' + panel.formatNumberComa(dsQtyVal) + '</b>');
                            }
                        }
                    }
                    if (input.down('#minqty').isVisible()) {
                        if (input.down('#minqty').readOnly == false) {
                            if (input.down('#minqty').getValue() != '') {
                                var minQtyVal = input.down('#minqty').getValue();
                                if (N2N_CONFIG.orderRoundQty) {
                                    minQtyVal = jsutil.getNumFromRound(minQtyVal) * parseInt(tempLotSize);
                                } else {
                                    minQtyVal = parseInt(minQtyVal) * parseInt(tempLotSize);
                                }

                                msgBuf.push(st + languageFormat.getLanguage(20843, 'Min Qty') + ':  </span><b>' + panel.formatNumberComa(minQtyVal) + '</b>');
                            }
                        }
                    }

                    if (input.down('#privateOrd')) {
                        if (input.down('#privateOrd').getValue()) {
                            msgBuf.push(st + ' Private Order: Yes  </span>');
                        }
                    }

                    for (var i = 1; i < msgBuf.length; i++) {
                        msgBuf[i] = '<span style="border-bottom: 1px solid grey;display:inline-block;width:100%;padding:3px 0px;">' + msgBuf[i] + '</span>';
                    }
                    var msg = msgBuf.join('<br>');

                    var isPromptPromoMsg = false;
                    var cutPromoMsg = '';
                    var tempEx = stkcode.substring(stkcode.lastIndexOf('.') + 1);

                    if (!global_isCUTAcc && cutSupportedEx.indexOf(tempEx) != -1) {
                        isPromptPromoMsg = true;
                    }
                    if (isPromptPromoMsg) {
                        cutPromoMsg = "<br><br><label style='color:red;width:260px;text-align:justify;display:block;'>" + promoMessage + '</label>';
                    }

                    panel.setMsgBox();
                    
                    var okText = languageFormat.getLanguage(10036, 'OK');
                    var cancelText = languageFormat.getLanguage(10010,'Cancel');
                    
                    var mbox = Ext.Msg.show({
                        title: global_popUpMsgTitle,
                        msg: msg + "<br><br><button style='width:70px;margin-left: 65px;' onclick='orderPad.submitForm();Ext.Msg.hide();'>" + okText + "</button><button style='width:70px' onclick='orderPad.allowUpdate=true;Ext.Msg.hide();'> " + cancelText + "</button>" + cutPromoMsg,
                        minWidth: 300,
                        cls: 'fix_msgfull'
                                /*
                                 buttons: Ext.Msg.OKCANCEL,
                                 fn: function(btn, text) {
                                 if (btn == 'ok') {
                                 panel.submitForm();
                                 } else {
                                 panel.allowUpdate = true;
                                 }
                                 }*/
                                // icon: Ext.Msg.QUESTION
                    });
                    // fix unable to trade again after closing X button
                    mbox.on('close', function() {
                        panel.allowUpdate = true;
                    });
                    
                    if (N2N_CONFIG.confMsgBoxCenter) {
                        msgutil.mouseMsgBoxPosition(mbox);
                    }
                    
                    // panel._repositionMsgBox(mbox);
                    var cutPromoLinkEl = Ext.get('cutPromoLink');
                    if (cutPromoLinkEl) {
                        cutPromoLinkEl.on('click', function () {
                            var cutFaqLinkUrl = cutFaqURL.split('|');

                            //open popup
                            var myRef = window.open(cutFaqLinkUrl[0], 'cutfaqlink', "menubar=1,resizable=1,width=" + cutFaqLinkUrl[1] + ";,height=" + cutFaqLinkUrl[2] + ",scrollbars=yes");
                            myRef.focus(); // focus popup.
                        });
                    }
                } else {
                    //panel.getEl().mask();
                    panel.showLoadMask(1);
                    panel.isReady = false;
                    panel.submitForm();
                    /*if (panel && panel.startTradeResultTimeout) {
                     panel.startTradeResultTimeout();
                     }*/
                }
            } else {
                this.allowUpdate = true;
            }
        } catch (e) {
            console.log('[OrderPad][submitBuy] Exception ---> ' + e);
            this.allowUpdate = true;
        }
    },
    encrypt: function () {

        var panel = this;
        // encrypt password
        var ordPad = panel.trdForm.down('#OrdPad');
        var pin = ordPad.down('#pin').getValue();
        var pin2 = encryptedString(panel.keyPair, pin);
        ordPad.down('#pin2').setValue(pin2);
    },
    setConfirmation: function (confirm) {

        var panel = this;
        var ordPad = panel.trdForm.down('#OrdPad');
        ordPad.down('#confirm').setValue(confirm);
    },
    printMsg: function (msg, style) {

        var st = '<div>';
        if (style)
            st = '<div style=\"' + style + '\">';
        return st + msg + '</div>';
    },
    getTrdInfoMsg: function (rs) {
        var panel = this;
        var msg = '';

        if (isMobile) { // for mobile
            if (rs.rmk && rs.rmk != '') {
                msg = rs.rmk;
            } else {
                msg = languageFormat.getLanguage(30233, 'Your order is being processed. Please check your order book for updates.');
            }

        } else {
            var ordPad = panel.trdForm.down('#OrdPad');
            var input = ordPad.down('#inPanel');

            var arMsg = [];
            try {
                if (rs.on) {
                    arMsg.push('Ticket No: ');
                    arMsg.push(rs.on);
                    arMsg.push('<br>');
                }

                var act = ordPad.down('#act').getValue();
                var stkname = panel.stkname;
                var stkcode = ordPad.down('#stkcode').getValue();
                var type = input.down('#otype').getValue();
                var validity = input.down('#cbValidity').getValue();
                var prc = input.down('#price').getRawValue();
                //var gtd = input.lblGTD.getValue();
                var gtd = panel.getGTD();
                var qty = input.down('#quantity').getValue();
                var lotsize = ordPad.down('#lotsize').getValue();
                
                if (N2N_CONFIG.orderRoundQty) {
                    qty = jsutil.getNumFromRound(qty);
                    qty = qty * parseFloat(lotsize);
                } else {
                    qty = parseFloat(qty) * parseFloat(lotsize);
                }

                if (act == modeOrdBuy) {
                    act = languageFormat.getLanguage(10001, 'Buy');
                } else if (act == modeOrdSell) {
                    act = languageFormat.getLanguage(10002, 'Sell');
                } else if (act == modeOrdCancel) {
                    act = languageFormat.getLanguage(10010, 'Cancel');
                } else if (act == modeOrdRevise) {
                    act = languageFormat.getLanguage(10009, 'Revise');
                }

                if (validity == 'GTD') {
                    validity = "Good Till " + gtd;
                }

                arMsg.push('Your order ');
                arMsg.push(' ');
                arMsg.push(stkcode);
                arMsg.push('/');
                arMsg.push(stkname);
                arMsg.push(' - ');
                arMsg.push(act);
                arMsg.push(' ');
                arMsg.push(qty);
                arMsg.push(' ');
                arMsg.push(this.getUnitTxt());
                arMsg.push('@');
                arMsg.push(' ');
                arMsg.push(type);
                arMsg.push(' ');
                arMsg.push(prc);
                arMsg.push(', Validity for ');
                arMsg.push(validity);
                arMsg.push(' is submitted on ');
                arMsg.push(rs.tm);
                arMsg.push('<br>For the status of submitted order, please go to order book');
                //Your order <action> <stockcode>/<stockname> - <action> <qty> (units)@ <price>, Validity for <validity> is accepted on <order time stamp>.
                msg = arMsg.join('');
            } catch (e) {
                console.log('[OrderPad][getTrdInfoMsg] Exception ---> ' + e);

                msg = languageFormat.getLanguage(30233, 'Your order is being processed. Please check your order book for updates.');
            }
        }

        return msg;
    },
    getTrdAckMsg: function (rs) {

        var panel = this;
        var ordPad = panel.trdForm.down('#OrdPad');
        var input = ordPad.down('#inPanel');
        var msg = '';
        var arMsg = [];
        try {
            if (rs.on) {
                arMsg.push('Ticket No: ');
                arMsg.push(rs.on);
                arMsg.push('<br>');
            }
            arMsg.push('Your order ');
            arMsg.push(' ');
            arMsg.push(rs.sc);
            if (rs.sy) {
                arMsg.push('/');
                arMsg.push(rs.sy);
            } else if (this.stkname) {
                arMsg.push('/');
                arMsg.push(this.stkname);
            }
            arMsg.push(' - ');
            var act = '';
            if (rs.act) {
                act = rs.act;
            } else if (ordPad.down('#act').getValue()) {
                act = ordPad.down('#act').getValue();
            }
            arMsg.push(act);
            arMsg.push(' ');
            arMsg.push(rs.oq);
            arMsg.push(' ');
            arMsg.push(this.getUnitTxt());
            arMsg.push('@');
            arMsg.push(' ');
            arMsg.push(rs.op);
            arMsg.push(', Validity for ');
            var validity = rs.vd;
            if (validity == 'GTD') {
                validity = "Good Till " + gtd;
            }
            arMsg.push(validity);
            arMsg.push(' accepted on ');
            arMsg.push(rs.tm);
            arMsg.push('<br>For the status of submitted order, please go to order book');
            //Your order <action> <stockcode>/<stockname> - <action> <qty> (units)@ <price>, Validity for <validity> is accepted on <order time stamp>.
            msg = arMsg.join('');
        } catch (e) {
            console.log('[OrderPad][getTrdAckMsg] Exception ---> ' + e);

            msg = languageFormat.getLanguage(30233, 'Your order is being processed. Please check your order book for updates.');
        }
        return msg;
    },
    submitForm: function () {
        var panel = this;

        var stkExchange = panel.getExCode();
        if (N2NDisclaimerRDS.validation(stkExchange)) {
            this.allowUpdate = true;
            return;
        }

        if (global_s2FARequire == 'true' && global_s2FABypass == 'YES' && global_s2FADeviceList.length == 0 || global_s2FABypass == 'ALL') {
            if (!N2N1FA.return1FAValidation('ordPad')) {
                this.allowUpdate = true;
                return;
            }
        } else {
            if (!N2N2FA.return2FAValidate('ordPad')) {
                this.allowUpdate = true;
                return;
            }
        }

        var ordPad = panel.trdForm.down('#OrdPad');
        panel.lastPin = ordPad.down('#pin').getValue();
        panel.saveConf = ordPad.down('#skipconfirm').getValue();
        panel.savePin = ordPad.down('#chkSavePin').getValue();

        ordPad.down('#unmtqty').setValue(panel.unmtqty);
        ordPad.down('#mtqty').setValue(panel.mtqty);
        ordPad.down('#prevaction').setValue(panel.prevAction);
        ordPad.down('#branchcode').setValue(panel.branchCode);
        ordPad.down('#brokercode').setValue(panel.brokerCode);
        ordPad.down('#ex').setValue(panel.accExchCode);

        if (orderStatusPanel != null)
            orderStatusPanel.setPinInfo({
                savePin: orderPad.savePin,
                lastPin: orderPad.lastPin});

        panel.compRef.btnSubmit.disable();
        if (isMobile) {
            panel.setLoading({msg: languageFormat.getLanguage(10020, 'Processing...')});
        } else {
            var bgcolor = "";
            if (global_personalizationTheme.indexOf("wh") != -1) {
                if (this.down('#act').getValue() == modeOrdBuy) {
                    bgcolor = " background-color:#32dd7b;";
                } else if (this.down('#act').getValue() == modeOrdSell) {
                    bgcolor = "background-color:#ff3333";
                }else{
                	bgcolor = "background-color:#fff";
                }
            }
            ordPad.down('#msgBox').update(panel.getTrdMsg() + '<br>' + panel.printMsg('Processing...', 'font-weight:bold; color:blue;' + bgcolor));
        }

        panel.encrypt();

        ordPad.down('#pin').disable(); // disable component to prevent the pin number send to backend

        panel.trdForm.getForm().submit({
            clientValidation: false,
            timeout: 10000,
            success: function (form, action) {
                ordPad.down('#pin').enable();  // enable back component
                panel.submitResult(form, action);

            },
            failure: function (form, action) {
                ordPad.down('#pin').enable();  // enable back component
                panel.submitResult(form, action);

            }
        });
    },
    submitResult: function (form, action) {
        var panel = this;

        console.log('[OrderPad][submitResult] start *** ');
        var bgcolor = "";
        if (global_personalizationTheme.indexOf("wh") != -1) {
            if (this.down('#act').getValue() == modeOrdBuy) {
                bgcolor = " background-color:#32dd7b;";
            } else if (this.down('#act').getValue() == modeOrdSell) {
                bgcolor = "background-color:#ff3333";
            }else{
            	bgcolor = "background-color:#fff";
            }
        }
        var ordPad = panel.trdForm.down('#OrdPad');
        try {
            var style = 'font-weight:bold;color:blue;word-wrap:break-word;' + bgcolor;
            var msgTxt = '';
            if (!isMobile) {
                msgTxt = panel.getTrdMsg() + '<br>';
            }
            var msg = '';
            var result = action.result;
            var resetPriceQty = false;
            var resetPin = true;
            if (result && result.s) {
                if (panel.act == modeOrdCancel) {
                    panel.reset();
                    panel.resetPanel();
                }
                if (result.t == 'trd') {
                    resetPriceQty = true;
                    if (result.rmk)
                        //msg = result.rmk;
                        //msg = panel.getTrdAckMsg(result);

                        msg = panel.getTrdInfoMsg(result);

                    else if (result.msg)
                        msg = result.msg;
                    else {
                        //msg = 'Your order is being processed, please check your order book for updates.';
                        //msg = panel.getTrdAckMsg(result);
                        msg = panel.getTrdInfoMsg(result);
//                        panel.updMsg = true;
                    }
                } else if (result.t == 'co' || result.t == 'ro') {
                    resetPriceQty = true;
                    if (result.rmk)
                        msg = result.rmk;
                    else if (result.msg)
                        msg = result.msg;
                    else {
                        //msg = 'Your order is being processed, please check your order book for updates.';
                        if (result.t == 'co')
                            msg = languageFormat.getLanguage(30234, 'Cancel order submitted!');
                        else if (result.t == 'ro')
                            msg = languageFormat.getLanguage(30235, 'Revise order submitted!');
//                        panel.updMsg = true;
                    }
                } else if (result.t == 'a') {
                    if (result.m) {
                        msg = result.m;
                    } else {
                        msg = Ext.encode(result);
                    }
                    // main.connectionManager.notifySession(result);
                } else {
                    msg = Ext.encode(result);
                }
            } else {
                switch (action.failureType) {
                    case Ext.form.Action.CLIENT_INVALID:
                        msg = languageFormat.getLanguage(30236, 'Form fields may not be submitted with invalid values');
//                      msgutil.alert('Form fields may not be submitted with invalid values', null, 'Failure');
                        break;
                    case Ext.form.Action.CONNECT_FAILURE:
//                        msg = 'Ajax communication failed';
                        msg = languageFormat.getLanguage(30237, 'For the status of submitted order, please go to order book.');
//                      msgutil.alert('Ajax communication failed', null, 'Failure');
                        break;
                    case Ext.form.Action.SERVER_INVALID:
                    {
                        if (result.t == 'trd') {
                            resetPin = false;
                            msg = result.msg;
                            if ((result.err && result.err == '502') || (result.err && result.err == '509')) {
                                Ext.Msg.show({
                                    title: global_popUpMsgTitle,
                                    msg: msg,
                                    buttons: Ext.Msg.OKCANCEL,
                                    fn: function (btn, text) {
                                        if (btn == 'ok') {
                                            panel.setConfirmation('1');
                                            ordPad.down('#tktno').setValue(result.tktno);
                                            panel.submitForm();
                                        }
                                    },
                                    icon: Ext.Msg.QUESTION
                                });
                            } else if ((result.err && result.err == '510')) {
                                //for CIMBSG CUT 'Error 510  50||There is insufficient cash balance to proceed with this order. Please use Cash Top-up service to top-up your Investment Power|InsufficientValue=xxx'
                                var tempMsg = result.msg.split('|');
                                var tempKeyArray;
                                var key = '';

                                if (tempMsg.length > 1) {
                                    tempKeyArray = tempMsg[1].split('=');
                                    key = tempKeyArray[1];
                                }
                                msg = languageFormat.getLanguage(20866, 'Rejected') + '<br>' + tempMsg[0];

                                Ext.Msg.show({
                                    title: global_popUpMsgTitle,
                                    msg: tempMsg[0], //result.msg,
                                    buttons: Ext.MessageBox.OKCANCEL,
                                    buttonText: {ok: languageFormat.getLanguage(20867, 'Top-up'), cancel: languageFormat.getLanguage(10010, 'Cancel')},
                                    icon: Ext.Msg.INFO,
                                    fn: function (btn, text) {
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

//                                    Ext.get('cashTopUpLabel').on('click', function() {
//                                        var myRef = window.open(cashTopUpURL, 'mywindow', "menubar=1,resizable=1,width=865,height=595,scrollbars=yes");
//                                        myRef.focus(); // focus popup.
//                                    });
                            } else if ((result.err && result.err == '513')) {
                                //for CIMBSG CUT 'Error 513  50||You do not have sufficient funds to place an order. Click on Convert button to perform FX conversion to increase your investment power.
                                var tempMsg = result.msg.split('|');
                                var tempKeyArray;
                                var key = '';

                                if (tempMsg.length > 1) {
                                    tempKeyArray = tempMsg[1].split('=');
                                    key = tempKeyArray[1];
                                }
                                msg = 'Rejected<br>' + tempMsg[0];
                                
                                var messageBox = Ext.create('Ext.window.MessageBox');
                                messageBox.buttonText = {ok: 'Convert'};
                                messageBox.show({
                                    title: global_popUpMsgTitle,
                                    msg: tempMsg[0], //result.msg,
                                    buttons: Ext.MessageBox.OK,                                 
                                    icon: Ext.Msg.INFO,
                                    fn: function (btn, text) {
                                        if (btn == 'ok') {
                                        	n2ncomponents.createExchangeRate();
                                        }
                                    }
                                });
                            }
                        } else if (result.t == 'a') {
                            if (result.m) {
                                msg = result.m;
                            } else {
                                msg = Ext.encode(result);
                            }
                            if (result.e && result.e == '-999') {
                                var ack = '{d:\"e\"}';
                                // main.connectionManager.notifySession(ack);
                            }
                        } else {
                            if (result.msg) {
                                msg = result.msg;
                            } else if (action.result.m) {
                                msg = result.m;
                            }else{
                            	msg = languageFormat.getLanguage(30247, 'This order may not be successful, please confirm from order book.');
                            }
                        }
//                          msgutil.alert(msg, null, 'Failure');
                        break;
                    }
                    default:
                    {
                        msg = languageFormat.getLanguage(30247, 'This order may not be successful, please confirm from order book.');
                    }
                }
            }

            // enable send order button.
            panel.compRef.btnSubmit.enable();

            // after submit order //
            if (panel.oldTktNo) {
                panel.compRef.btnSubmit.setText(languageFormat.getLanguage(20868, 'Re-Submit'));
                createOrdStsPanel('', '0');
                return;
            }

            // clear session settings //
            if (resetPin == true && !ordPad.down('#chkSavePin').getValue())
                ordPad.down('#pin').setValue('');

            if (resetPriceQty == true) {	// reset Price & Qty field
                var input = panel.trdForm.down('#inPanel');
                input.down('#price').setValue('');
                input.down('#quantity').setValue('');
                input.down('#minqty').setValue('');
            }

//            var confirm = '0';
//            if (panel.fldCfg.confirm == true) confirm = '1';
            var confirm = '';
            panel.setConfirmation(confirm);
            msgTxt += panel.printMsg(msg, style);
            if(result){
            	panel.showMsg(msgTxt, result.err);	
            }else{
                panel.showMsg(msgTxt, null);
            }

        } catch (e) {
            console.log('[OrderPad][submitResult] Exception ---> ' + e);
            panel.showMsg(msgTxt, null);
        }
        panel.allowUpdate = true;
        panel.isReady = true;
        panel.callAccBal();
        if (orderStatusPanel != null) {
            orderStatusPanel.search(true);
        }
    },
    submitSell: function () {

        try {
            this.allowUpdate = false;
            var panel = this;
            var ordPad = panel.trdForm.down('#OrdPad');
            var input = panel.trdForm.down('#inPanel');
            var ccEl = ordPad.down('#cc');
            var ac = ordPad.down('#ac').getValue();
            var totAcc = panel.accs.length;

            if (ac == '') {
                ac = panel.getAccountNo();
                ordPad.down('#ac').setValue(ac);
            }

            for (var i = 0; i < totAcc; i++) {
                if (panel.accs[i].ac == ac) {
                    ccEl.setValue(panel.accs[i].cc);
                    break;
                }
            }

            if (panel.oldTktNo) {
                ordPad.down('#tktno').setValue(panel.oldTktNo);
            } else {
                ordPad.down('#tktno').setValue('');
            }
            var valid = panel.validateBS();
            panel.price = input.down('#price').getRawValue();
            if (valid) {
                var skip = ordPad.down('#skipconfirm').getValue();
                if (!skip) {
                    var currencyEl = input.down('#settcurr');
                    var defCurrency;
                    if (currencyEl && currencyEl.getValue()) {
                        defCurrency = currencyEl.getValue();
                    } else {
                        defCurrency = panel.currency;
                        if (currencyEl && forceDisableSettCurr != "TRUE")
                            currencyEl.setValue(defCurrency);
                    }

                    var stkname = panel.stkname;
                    var stkcode = ordPad.down('#stkcode').getValue();
                    var type = input.down('#otype').getValue();
                    var validity = input.down('#cbValidity').getValue();
                    var price = input.down('#price').getRawValue();
                    var qty = input.down('#quantity').getValue();
                    var lotsize = ordPad.down('#lotsize').getValue();
                    var tggrprice = input.down('#stoplimit').getValue();
                    var tggrtype = input.down('#tptype').getRawValue();
                    var tggrdirection = input.down('#tpdirection').getRawValue();
                    
                    if (N2N_CONFIG.orderRoundQty) {
                        qty = jsutil.getNumFromRound(qty);
                        qty = qty * lotsize;
                    } else {
                        qty = parseFloat(qty) * parseFloat(lotsize);
                    }

                    var msgBuf = new Array();
                    var st = '<span style="width:130px;display:inline-block;">';
                    msgBuf.push('<span style="font-size:1.3em;display:inline-block;font-weight:bold;">' + stkname + '</span>');
                    msgBuf.push('<span style="font-size:1.1em;display:inline-block;">' + stkcode + '</span>');
                    msgBuf.push(st + languageFormat.getLanguage(20833, 'Account No.') + ': </span><b>' + ac + '</b>');
                    msgBuf.push(st + languageFormat.getLanguage(20837, 'Order Type') + ':  </span><b style="color:red">' + languageFormat.getLanguage(10002, 'Sell') + ', </b><b>' + type + '</b>');
                    msgBuf.push(st + languageFormat.getLanguage(20838, 'Validity') + ':  </span><b>' + validity + '</b>');
                    msgBuf.push(st + languageFormat.getLanguage(20183, 'Order Price') + '(' + panel.currency + '):  </span><b>' + price + '</b>');
                    if (exchangecode == "MY") {
                        msgBuf.push(st + languageFormat.getLanguage(20851, 'Contract') + ':  </span><b>' + panel.formatNumberComa(qty) + '</b>');
                    } else {
                        msgBuf.push(st + languageFormat.getLanguage(20184, 'Order Qty') + ':  </span><b>' + panel.formatNumberComa(qty) + '</b>');
                    }

                    if (showExtraOrdMsg == 'TRUE') {
                        msgBuf.push(st + languageFormat.getLanguage(20853, 'Payment Mode') + ':  </span><b>' + panel.getPayment() + '</b>');
                        //msgBuf.push(st+ 'Total Order Value:  </span>'+ input.settcurr.getValue() + ' ' + (price * qty).toFixed(3));
                        msgBuf.push(st + languageFormat.getLanguage(20854, 'Total Order Value') + ':  </span><b>' + input.down('#settcurr').getValue() + ' ' + panel.totalValue + '</b>');
                    }

                    if (input.down('#stoplimit').isVisible()) {
                        if (input.down('#stoplimit').readOnly == false) {
                            if (input.down('#stoplimit').getValue() != '') {
                                msgBuf.push(st + 'Trigger Price:  </span><b>' + tggrprice + '</b>');
                            }
                        }
                    }

                    if (input.down('#tptype').isVisible()) {
                        if (input.down('#tptype').readOnly == false) {
                            if (input.down('#tptype').getValue() != '') {
                                msgBuf.push(st + 'Trigger Type:  </span><b>' + tggrtype + '</b>');
                            }
                        }
                    }

                    if (input.down('#tpdirection').isVisible()) {
                        if (input.down('#tpdirection').readOnly == false) {
                            if (input.down('#tpdirection').getValue() != '') {
                                msgBuf.push(st + 'Trigger Direction:  </span><b>' + tggrdirection + '</b>');
                            }
                        }
                    }

                    var tempLotSize = ordPad.down('#lotsize').getValue();
                    if (input.down('#dsqty').isVisible()) {
                        if (input.down('#dsqty').readOnly == false) {
                            if (input.down('#dsqty').getValue() != '') {
                                var dsQtyVal = input.down('#dsqty').getValue();
                                if (N2N_CONFIG.orderRoundQty) {
                                    dsQtyVal = jsutil.getNumFromRound(dsQtyVal) * parseInt(tempLotSize);
                                } else {
                                    dsQtyVal = parseInt(dsQtyVal) * parseInt(tempLotSize);
                                }
                                
                                msgBuf.push(st + languageFormat.getLanguage(20839, 'Disclosed Qty') + ':  </span><b>' + panel.formatNumberComa(dsQtyVal) + '</b>');
                            }
                        }
                    }
                    if (input.down('#minqty').isVisible()) {
                        if (input.down('#minqty').readOnly == false) {
                            if (input.down('#minqty').getValue() != '') {
                                var minQtyVal = input.down('#minqty').getValue();
                                if (N2N_CONFIG.orderRoundQty) {
                                    minQtyVal = jsutil.getNumFromRound(minQtyVal) * parseInt(tempLotSize);
                                } else {
                                    minQtyVal = formatutils.formatNumberLot(parseInt(minQtyVal) * parseInt(tempLotSize));
                                }

                                msgBuf.push(st + languageFormat.getLanguage(20843, 'Min Qty') + ':  </span><b>' + panel.formatNumberComa(minQtyVal) + '</b>');
                            }
                        }
                    }

                    if (input.down('#shortsell')) {
                        if (input.down('#shortsell').getValue()) {
                            msgBuf.push(st + ' ' + languageFormat.getLanguage(20848, 'Short Sell') + ': </span><b>' + languageFormat.getLanguage(10011, 'Yes') + '</b>');
                        }
                    }

                    if (input.down('#privateOrd')) {
                        if (input.down('#privateOrd').getValue()) {
                            msgBuf.push(st + ' Private Order: Yes  </span>');
                        }
                    }

                    for (var i = 1; i < msgBuf.length; i++) {
                        msgBuf[i] = '<span style="border-bottom: 1px solid grey;display:inline-block;width:100%;padding:3px 0px;">' + msgBuf[i] + '</span>';
                    }

                    var msg = msgBuf.join('<br>');
                    var isPromptPromoMsg = false;
                    var cutPromoMsg = '';
                    var tempEx = stkcode.substring(stkcode.lastIndexOf('.') + 1);
                    if (!global_isCUTAcc && cutSupportedEx.indexOf(tempEx) != -1) {
                        isPromptPromoMsg = true;
                    }
                    if (isPromptPromoMsg) {
                        cutPromoMsg = "<br><br><label style='color:red;width:260px;text-align:justify;display:block;'>" + promoMessage + '</label>';
                    }

                    panel.setMsgBox();

                    var okText = languageFormat.getLanguage(10036, 'OK');
                    var cancelText = languageFormat.getLanguage(10010,'Cancel');
                    
                    var mbox = Ext.Msg.show({
                        title: global_popUpMsgTitle,
                        msg: msg + "<br><br><button style='width:70px;margin-left: 65px;' onclick='orderPad.showLoadMask(1); orderPad.isReady=false; orderPad.submitForm();Ext.Msg.hide();'>" + okText + "</button><button style='width:70px' onclick='orderPad.allowUpdate=true;Ext.Msg.hide();'>" + cancelText + "</button>" + cutPromoMsg,
                        minWidth: 300,
                        cls: 'fix_msgfull'
                                /*
                                 buttons: Ext.Msg.OKCANCEL,
                                 fn: function(btn, text) {
                                 if (btn == 'ok') {
                                 panel.showLoadMask(1);
                                 panel.isReady = false;
                                 panel.submitForm();
                                 } else {
                                 panel.allowUpdate = true;
                                 }
                                 }*/
                                // icon: Ext.Msg.QUESTION
                    });
                    mbox.on('close', function() {
                        panel.allowUpdate = true;
                    });
                    
                    if (N2N_CONFIG.confMsgBoxCenter) {
                        msgutil.mouseMsgBoxPosition(mbox);
                    }
                    
                    // panel._repositionMsgBox(mbox);
                    var cutPromoLinkEl = Ext.get('cutPromoLink');
                    if (cutPromoLinkEl) {
                        cutPromoLinkEl.on('click', function () {
                            var cutFaqLinkUrl = cutFaqURL.split('|');
                            //open popup
                            var myRef = window.open(cutFaqLinkUrl[0], 'cutfaqlink', "menubar=1,resizable=1,width=" + cutFaqLinkUrl[1] + ";,height=" + cutFaqLinkUrl[2] + ",scrollbars=yes");
                            myRef.focus(); // focus popup.
                        });
                    }
                } else {
                    //panel.getEl().mask();
                    panel.showLoadMask(1);
                    panel.isReady = false;
                    panel.submitForm();
                    /*if (panel && panel.startTradeResultTimeout) {
                     panel.startTradeResultTimeout();
                     }*/
                }
            } else {
                this.allowUpdate = true;
            }
        } catch (e) {
            console.log('[OrderPad][submitSell] Exception ---> ' + e);

            this.allowUpdate = true;
        }
    },
    submitCancel: function () {

        try {
            this.allowUpdate = false;
            var panel = this;
            var ordPad = panel.trdForm.down('#OrdPad');
            var input = ordPad.down('#inPanel');
            var ccEl = ordPad.down('#cc');
            var ac = ordPad.down('#ac').getValue();

            if (ac == '') {
                ac = panel.getAccountNo();
                ordPad.down('#ac').setValue(ac);
            }

            var accList;
            if (!authenret)
                return;
            accList = accRet.ai;
            panel.accs = new Array();

            if (accList && accList.length > 0) {
                for (var i = 0; i < accList.length; i++) {
                    var acc = accList[i];
                    if (acc.ac && acc.cc) {
                        var newobj = new Object();
                        newobj.ac = acc.ac;
                        newobj.cc = acc.cc;
                        panel.accs.push(newobj);
                    }
                }
            }

            for (var i = 0; i < panel.accs.length; i++) {
                if (panel.accs[i].ac == ac) {
                    ccEl.setValue(panel.accs[i].cc);
                    break;
                }
            }

            var valid = panel.validateCncl();
            if (valid) {
                var skip = ordPad.down('#skipconfirm').getValue();
                if (!skip) {
                    var msg = languageFormat.getLanguage(30239, 'Do you really want to cancel the order?');

                    panel.setMsgBox();

                    var mbox = Ext.Msg.show({
                        title: global_popUpMsgTitle,
                        msg: msg,
                        buttons: Ext.Msg.OKCANCEL,
                        fn: function (btn, text) {
                            if (btn == 'ok') {
                                panel.showLoadMask(1);
                                panel.isReady = false;
                                panel.submitForm();
                            } else {
                                panel.allowUpdate = true;
                            }
                        },
                        icon: Ext.Msg.QUESTION
                    });
                    
                    if (N2N_CONFIG.confMsgBoxCenter) {
                        msgutil.mouseMsgBoxPosition(mbox);
                    }
                } else {
                    //panel.getEl().mask();
                    panel.showLoadMask(1);
                    panel.isReady = false;
                    panel.submitForm();
                }
            } else {
                this.allowUpdate = true;
            }
        } catch (e) {
            console.log('[OrderPad][submitCancel] Exception ---> ' + e);

            this.allowUpdate = true;
        }
    },
    submitRevise: function () {

        try {
            this.allowUpdate = false;
            var panel = this;
            var ordPad = panel.trdForm.down('#OrdPad');
            var input = ordPad.down('#inPanel');
            var ccEl = ordPad.down('#cc');
            var ac = ordPad.down('#ac').getValue();

            if (ac == '') {
                ac = panel.getAccountNo();
                ordPad.down('#ac').setValue(ac);
            }

            for (var i = 0; i < panel.accs.length; i++) {
                if (panel.accs[i].ac == ac) {
                    ccEl.setValue(panel.accs[i].cc);
                    break;
                }
            }

            var valid = panel.validateRev();
            if (valid) {
                var skip = ordPad.down('#skipconfirm').getValue();
                if (!skip) {
                    var msg = languageFormat.getLanguage(30240, 'Do you really want to revise the order?');

                    panel.setMsgBox();

                    var mbox = Ext.Msg.show({
                        title: global_popUpMsgTitle,
                        msg: msg,
                        buttons: Ext.Msg.OKCANCEL,
                        fn: function (btn, text) {
                            if (btn == 'ok') {
                                panel.showLoadMask(1);
                                panel.isReady = false;
                                panel.submitForm();
                            } else {
                                panel.allowUpdate = true;
                            }
                        },
                        icon: Ext.Msg.QUESTION
                    });
                    
                    if (N2N_CONFIG.confMsgBoxCenter) {
                        msgutil.mouseMsgBoxPosition(mbox);
                    }

                } else {
                    //panel.getEl().mask();
                    panel.showLoadMask(1);
                    panel.isReady = false;
                    panel.submitForm();
                }
            } else {
                this.allowUpdate = true;
            }
        } catch (e) {
            console.log('[OrderPad][submitRevise] Exception ---> ' + e);

            this.allowUpdate = true;
        }
    },
    setDefaultPrice: function (price, bid, ask, reset) {

        var panel = this;
        var ordPad = panel.trdForm.down('#OrdPad');
        var input = ordPad.down('#inPanel');
        panel.lastPrc = price;
        var isMOMP = false;

////         bug - v1.3.14.16
//        var setPriceDecimalPlace = function(priceList){
//        	var newList = [];
//        	
//        	if (panel.exchangecode != "MY") {
//        		
//        		for (var i = 0; i < priceList.length; i ++) {
//        			
//        			if (priceList[i][0] != 0 && priceList[i][0] > 0) {
//        				newList.push([priceList[i][0], priceList[i][1]]);
//        			}
//        		}
//        	} else {
//        		newList = priceList;
//        	}
//        	
//        	for (var i = 0; i < newList.length; i ++) {
//        		var priceObject = newList[i];
//        		
//        		if (priceObject[0] != null && priceObject[1] != null) {
//            		newList[i][0] = priceObject[0];
//                	newList[i][1] = panel._formatDecimal2(priceObject[1]);
//        		}
//        	}
//        	
//        	return newList;
//        };

        try {
            var prcEl = input.down('#price');
            var qtyEl = input.down('#quantity');
            if (prcEl) {
                if (reset) {
                    prcEl.store.removeAll();
                    prcEl.clearValue();
                } else {
                    var act = input.down('#cbAction').getValue();
                    price = (price == null) ? '' : price;
                    isMOMP = (isMO(price) || isMP(price));

                    if (isMOMP)
                        price = '';

                    panel.arPriceList = new Array();
                    if (act == '' || act == modeOrdBuy || act == modeOrdSell) {
                        var i;

                        if (act == modeOrdSell) {
                            if (bid && bid.length > 0) {
                                if (isNaN(price) || isMOMP) {
                                    price = bid[0];
                                }
                                panel.arPriceList.push([bid[0], bid[0]]);
                            }
                            if (ask && ask.length > 0) {
                                if (isNaN(price) || isMOMP) {
                                    price = ask[0];
                                }
                                for (i = 0; i < ask.length; i++) {
                                    panel.arPriceList.push([ask[i], ask[i]]);
                                }
                            }

                            if (panel.arPriceList && panel.arPriceList.length == 0) {
                                if (!isNaN(price))
                                    panel.arPriceList.push([price, price]);
                            }
                        } else if (act == modeOrdBuy) {
                            if (ask && ask.length > 0) {
                                if (isNaN(price) || isMOMP) {
                                    price = ask[0];
                                }
                                panel.arPriceList.push([ask[0], ask[0]]);
                            }

                            if (bid && bid.length > 0) {
                                if (isNaN(price) || isMOMP) {
                                    price = bid[0];
                                }
                                for (i = 0; i < bid.length; i++) {
                                    panel.arPriceList.push([bid[i], bid[i]]);
                                }
                            }
                            if (panel.arPriceList && panel.arPriceList.length == 0) {
                                if (!isNaN(price))
                                    panel.arPriceList.push([price, price]);
                            }
                        } else {
                            if (isMOMP)
                                price = '';
                        }

                        //  panel.arPriceList = setPriceDecimalPlace(panel.arPriceList);

                        prcEl.store.removeAll();
                        prcEl.store.loadData(panel.arPriceList);

//                        if (!qtyEl.getValue()) 
//                        	panel.setDefaultQuantity(1);

                    } else {
                        if (!isNaN(price))
                            panel.arPriceList.push([price, price]);

                        prcEl.store.removeAll();
                        prcEl.store.loadData(panel.arPriceList);
                    }

                    // bug - v1.3.14.9
                    if (!isNaN(price)) {
                        if (global_showPrice == 'TRUE')
                            prcEl.setValue(price);
                        else
                            prcEl.setValue('');//1.3.30.10 Do not set default value of price
                    }
                    else {
                        prcEl.setRawValue(0);
                    }

                    prcEl.collapse();
                }
            }
            panel.setMsgBox();
        } catch (e) {
            console.log('[OrderPad][setDefaultPrice] Exception ---> ' + e);
        }
    },
    setDefaultQuantity: function (qty) {
        var panel = this;
        if (panel.isDisableToClear) {
            panel.isDisableToClear = false;
            //    return;            
        }
        try {
            qty = (qty && !isNaN(qty) && qty > 0) ? qty : '';
            panel.setQty(qty);
        } catch (e) {
            console.log('[OrderPad][setDefaultQuantity] Exception ---> ' + e);
        }
    },
    setDefaultDsQty: function (qty) {
        //debug('setDefaultDsQty:[' + qty + ']');
        //var qtyEl = Ext.getCmp(this.id + 'dsqty');
        var qtyEl = this.trdForm.down('#dsqty');
        if (qtyEl && (!qtyEl.getValue())) {
            qty = (qty && !isNaN(qty) && qty > 0) ? qty : '';
            qtyEl.setValue(qty);
        }
    },
    setDefaultMinQty: function (qty) {
        //debug('setDefaultMinQty:[' + qty + ']');
        //var qtyEl = Ext.getCmp(this.id + 'minqty');

        var qtyEl = this.trdForm.down("#minqty");
        if (qtyEl) {
            qty = qty != null ? qty : '';
            qtyEl.setValue(qty);
        }
    },
    showCalendar: function () {
        var panel = this;
//        var input = panel.trdForm.down('#inPanel');
        if (panel.isReady) {
            if (panel.getValidity() == 'GTD')
                if (!panel.datePickerWin.isVisible())
                    panel.datePickerWin.show();
        }
    },
    initFldCfg: function (ex) {

        var panel = this;
        try {
            if (!ex)
                ex = panel.getExCode();

            panel.setFldConfig(ex);
            if (panel.isReady && panel.fldCfg) {
                panel.setExUICfg(ex);
            }
        } catch (e) {
            console.log('[OrderPad][initFldCfg] Exception ---> ' + e);
        }
    },
    setExUICfg: function (ex) {

        var panel = this;
        var ordPad = panel.trdForm.down('#OrdPad');
        var input = ordPad.down('#inPanel');
        if (ex) {
            var cfg = panel.fldCfg;
            if (N2N_CONFIG.orderPadBasic) {
                panel.advBasicComponent();
            } else {
                panel.suspendLayouts();
                input.down('#stoplimit').setVisible(cfg.stoplimit);

                input.down('#minqty').setVisible(cfg.minqty);
                input.down('#dsqty').setVisible(cfg.dsqty);

                input.down('#settcurr').setVisible(cfg.settcurr);
                input.down('#payment').setVisible(cfg.payment);
                input.down('#strategy').setVisible(cfg.strategy);

                if (panel.mode == modeOrdSell) {
                    input.down('#shortsellPanel').setVisible(cfg.shortsell);
                } else {
                    input.down('#shortsellPanel').setVisible(false);
                }

                input.down('#privateOrdPanel').setVisible(cfg.privateOrd);
                input.down('#forceorderPanel').setVisible(cfg.forceord);
                input.down('#forcequeuePanel').setVisible(cfg.forcequeue);
                input.down('#amalgamatePanel').setVisible(cfg.amalgamation);
                input.down('#tptype').setVisible(cfg.triggertype);
                input.down('#tpdirection').setVisible(cfg.triggerdirection);
//            input.creditlimitPanel.setVisible(panel.fldCfg.showlimit);
                panel.resumeLayouts();
            }
            //var confirm = '0';
            //if (!panel.fldCfg.confirm) confirm = '1';
            var confirm = '';
            panel.setConfirmation(confirm);
        }
    },
    initBuySell: function () {

        var panel = this;
        try {
            var ex = panel.getExCode();
            if (ex) {

                panel.exchangecode = ex;
                panel.setExRule(ex);	// load exchange rule
                panel.setDefaultPrice(panel.price, null, null, false);
                //apply rule into Order Pad [Action / Price / Qty / Sett. Curr - do not have much changes]
                panel.setOrderPanelBuySellRule(ex);
            }
        } catch (e) {
            console.log('[OrderPad][initBuySell] Exception ---> ' + e);
        }
    },
    initCancel: function (mode) {

        var panel = this;
        var stkcode = panel.stkcode;
        var ex = '';

        if (canCancelRevise(panel.ordsts)) {

            if (stkcode.indexOf('.') != -1) {
                ex = getStkExCode(stkcode);
                panel.setExRule(ex);
            }

            var ordPad = panel.trdForm.down('#OrdPad');
            var input = panel.trdForm.down('#inPanel');

            var date;
            var dt = '';
            var dtLbl = '';
            var qtyInLot = '';
            var dsQtyInLot = '';
            var minQtyInLot = '';

            if (panel.lotsize && panel.lotsize > 0) {
                var lotsize = panel.lotsize;
                panel.setLotSize(lotsize);
                qtyInLot = panel.ordqty / lotsize;
                dsQtyInLot = (panel.dsqty > 0) ? (panel.dsqty / lotsize) : '';
                minQtyInLot = (panel.minqty > 0) ? (panel.minqty / lotsize) : '';
            }

            try {
                if (!authenret)
                    return;
                var accList = accRet.ai;

                stkcode = panel.stkcode;
                stkname = panel.stkname;
                currency = panel.currency;

                accno = panel.accno;
                tktno = panel.tktno;
                ordno = panel.ordno;
                subordno = panel.subordno;
                price = panel.ordprc;
                ordtype = panel.ordtype;
                validity = panel.validity;
                gtd = panel.expdate;
                stoplimit = panel.stoplimit;
                var paymentmode = panel.paymentmode;
                var settcurr = panel.settcurr;
                tptype = panel.tpType;
                tpdirection = panel.tpDirection;
                state = panel.state;
                var accnobc = accno;

                //shuwen - 20141007
//                panel.accs = new Array();
//                panel.arAccList = new Array();
                if (accList && accList.length > 0) {
                    //var exchg = getStkExCode(stkcode);
                    for (var i = 0; i < accList.length; i++) {
                        var acc = accList[i];
                        //var show = true;
                        if (accno == acc.ac) {
                            accnobc = accno + "-" + acc.bc;
                            break;
                        }
//                        if (show) {
//                            if (acc.ac && acc.cc) {
//                                var newobj = new Object();
//                                newobj.ac = acc.ac;
//                                newobj.cc = acc.cc;
//                                panel.accs.push(newobj);
//                                panel.arAccList.push([acc.ac + global_AccountSeparator + acc.bc, acc.ac + ' - ' + acc.an + ' - ' + acc.bc]);
//                            }
//                        }
                    }
                }

                panel.setAccList(1);
                panel.setAccountNo(accnobc);
                panel.setStkCode(stkcode, stkname, mode);
                panel.setCurrency(currency, 1);
                panel.setCreditLimit(accno);
                panel.setOTypeList(mode);
                panel.setOrdType(ordtype);
                panel.setPayment(paymentmode);
                panel.setSettCurr(settcurr);
                panel.setTPType(tptype);
                panel.setTPDirection(tpdirection);

                if (formatutils.privateOrderChecking(state)) {
                    panel.setPrivateOrd(true);
                } else {
                    panel.setPrivateOrd(false);
                }

                panel.setValidityCmb(validity);
                panel.setValidity(validity);
                panel.setQty(qtyInLot);
                panel.setDefaultPrice(price, panel.bidRec, panel.askRec);
                ordPad.down('#tktno').setValue(tktno);
                ordPad.down('#ordno').setValue(ordno);
                ordPad.down('#subordno').setValue(subordno);
                if (dsQtyInLot > 0) {
                    panel.setDsQty(dsQtyInLot);
                }

                if (minQtyInLot > 0) {
                    panel.setMinQty(minQtyInLot);
                }
                if (stoplimit > 0) {
                    panel.setStopLimit(stoplimit);
                }

                dt = '';
                dtLbl = '';
                if (gtd && gtd.length >= 10) {
                    dt = gtd.substring(0, 8);
                    date = Ext.Date.parse(dt, 'Ymd');
                    dtLbl = Ext.Date.format(date, 'd/m/Y');
                }

                panel.setGTD(dt);
                panel.setGTDLbl(dtLbl);

                panel.disableCmp(input.down('#accountno'));
                panel.disableCmp(input.down('#price'));
                panel.disableCmp(input.down('#quantity'));
                panel.disableCmp(input.down('#dsqty'));
                panel.disableCmp(input.down('#minqty'));
                panel.disableCmp(input.down('#otype'));
                panel.disableCmp(input.down('#cbValidity'));
                panel.disableCmp(input.down('#stoplimit'));

                panel.disableCmp(input.down('#payment'));
                panel.disableCmp(input.down('#settcurr'));
                panel.disableCmp(input.down('#strategy'));
                panel.disableCmp(input.down('#tptype'));
                panel.disableCmp(input.down('#tpdirection'));

                if (input.down('#shortsell')) {
                    input.down('#shortsell').setValue(false);
                    input.down('#shortsell').disable();
                }
                panel.disableCmp(input.down('#privateOrd'));

                // incase it disabled
                panel.enableCmp(input.down('#cbAction'));
            } catch (e) {
                console.log('[OrderPad][initCancel] Exception ---> ' + e);
            }
        } else {
            msg = languageFormat.getLanguage(30231, 'You are not allowed to cancel or revise this order');
            if (panel.isReady && msg) {
                panel.trdForm.down('#msgBox').update(msg);
            }
        }
    },
    initRevise: function (mode) {

        var panel = this;
        var stkcode = panel.stkcode;
        var exchg = getStkExCode(stkcode);

        try {
            if (canCancelRevise(panel.ordsts)) {
                panel.arOrderControlList = new Array();
                panel.arReviseControlList = new Array();
                if (stkcode.indexOf('.') != -1) {
                    exchg = getStkExCode(stkcode);
                    panel.setExRule(exchg);
                }

                var ordPad = panel.trdForm.down('#OrdPad');
                var input = panel.trdForm.down('#inPanel');

                var date;
                var dt = '';
                var dtLbl = '';
                var qtyInLot = '';
                var dsQtyInLot = 0;
                var minQtyInLot = '';

                if (panel.lotsize && panel.lotsize > 0) {
                    var lotsize = panel.lotsize;
                    panel.setLotSize(lotsize);
                    qtyInLot = panel.ordqty / lotsize;
                    dsQtyInLot = panel.dsqty != null ? panel.dsqty : 0;
                    minQtyInLot = panel.minqty > 0 ? panel.minqty : '';
                }


                if (!authenret)
                    return;

                var accList = !isDealerRemisier ? accRet.ai : panel.arAccList;

                var stkname = panel.stkname;
                var currency = panel.currency;

                var accno = panel.accno;
                var tktno = panel.tktno;
                var ordno = panel.ordno;
                var subordno = panel.subordno;
                var price = panel.ordprc;
                var ordtype = panel.ordtype;
                var validity = panel.validity;
                var gtd = panel.expdate;
                var stoplimit = panel.stoplimit;
                var paymentmode = panel.paymentmode;
                var settcurr = panel.settcurr;
                var tptype = panel.tpType;
                var tpdirection = panel.tpDirection;
                var state = panel.state;
                var accnobc = panel.accno;

                //shuwen - 20141007
//                panel.accs = new Array();
//                panel.arAccList = new Array();


                if (accList && accList.length > 0) {
                    for (var i = 0; i < accList.length; i++) {
                        var acc = accList[i];
                        //var show = true;
                        if (acc.ac == accno) {
                            accnobc = accno + '-' + acc.bc;
                            break;
                        }
//                        if (acc.ac == accno) {
//                            branchCode = acc.bc;
//                        }
//                        if (show) {
//                            if (acc.ac && acc.cc) {
//                                var newobj = new Object();
//                                newobj.ac = acc.ac;
//                                newobj.cc = acc.cc;
//                                panel.accs.push(newobj);
//                                panel.arAccList.push([acc.ac + global_AccountSeparator + acc.bc, acc.ac + ' - ' + acc.an + ' - ' + acc.bc]);
//                            }
//                        }
                    }
                }

                panel.setAccList(1);
                panel.setAccountNo(accnobc);
                panel.setStkCode(stkcode, stkname, mode);
                panel.setCurrency(currency, 1);
                panel.setCreditLimit(accno);
                //panel.setOTypeList(mode);
                panel.setOrdType(ordtype);
                panel.setPayment(paymentmode);
                panel.setSettCurr(settcurr);
                panel.setTPType(tptype);
                panel.setTPDirection(tpdirection);

                if (formatutils.privateOrderChecking(state)) {
                    panel.setPrivateOrd(true);
                } else {
                    panel.setPrivateOrd(false);
                }

                if (enableRSSIndicator == 'TRUE') {
                    if (panel.tradCond == 262144) {
                        panel.setShortSell(true);
                    } else {
                        panel.setShortSell(false);
                    }
                }

                if (validity && validity == 'GTD' && gtd && gtd.length >= 10) {
                    var dt = gtd.substring(0, 8);
                    var date = Ext.Date.parse(dt, 'Ymd');
                    var dtStr = Ext.Date.format(date, 'd/m/Y');
                    panel.setGTD(dt);
                    panel.setGTDLbl(dtStr);
                    panel.setValidityCmb(dtStr);
                    panel.setValidity(validity);
                } else {
                    //panel.setValidityList(mode);
                    panel.setValidityCmb(validity);
                    panel.setValidity(validity);
                }

                panel.setQty(qtyInLot);
                panel.setDefaultPrice(price, panel.bidRec, panel.askRec);
                ordPad.down('#tktno').setValue(tktno);
                ordPad.down('#ordno').setValue(ordno);
                ordPad.down('#subordno').setValue(subordno);

//  			if(dsQtyInLot > 0){
//  			panel.setDsQty(dsQtyInLot);	
//  			} else {
//  			panel.setDsQty('');	
//  			}        	
                panel.setDsQty(dsQtyInLot);

//  			if(minQtyInLot > 0){
//  			panel.setMinQty(minQtyInLot);	
//  			} else {
//  			panel.setMinQty('');	
//  			}
                panel.setMinQty(minQtyInLot);


                if (stoplimit > 0) {
                    panel.setStopLimit(stoplimit);
                } else {
                    panel.setStopLimit('');
                }
                //panel.setStopLimit(stoplimit);	

                dt = '';
                dtLbl = '';
                if (gtd && gtd.length >= 10) {
                    dt = gtd.substring(0, 8);
                    date = Ext.Date.parse(dt, 'Ymd');
                    dtLbl = Ext.Date.format(date, 'd/m/Y');
                }

                panel.setGTD(dt);
                panel.setGTDLbl(dtLbl);

                // disable those value
                panel.disableCmp(input.down('#accountno'));
                panel.disableCmp(input.down('#price'));
                panel.disableCmp(input.down('#quantity'));
                panel.disableCmp(input.down('#dsqty'));
                panel.disableCmp(input.down('#minqty'));
                panel.disableCmp(input.down('#otype'));
                panel.disableCmp(input.down('#cbValidity'));
                panel.disableCmp(input.down('#stoplimit'));

                panel.disableCmp(input.down('#payment'));
                panel.disableCmp(input.down('#settcurr'));
                panel.disableCmp(input.down('#strategy'));
                panel.disableCmp(input.down('#tptype'));
                panel.disableCmp(input.down('#tpdirection'));

                // incase it disabled
                panel.enableCmp(input.down('#cbAction'));

                // take from ATP [start]
                if (panel.atpRule.s == true) {
                    var len = panel.atpRule.size;
                    for (var i = 0; i < len; i++) {
                        if (panel.atpRule.d != null && panel.atpRule.d[i].ex == exchg) {
                            // same exchange
                            // revise
                            // revisevalidity
                            // rot

//  						V=Validity
//  						O=OrderType
//  						Q=Qty
//  						P=Price
//  						L=StopLimit
//  						D=DisclosedQty
//  						M=MinQty
//  						Y=Payment
//  						T=SettCurrency

                            var blnReviseValidity = false;
                            var blnReviseOrderType = false;

                            panel.arOTypeList = new Array();
                            panel.arValidityList = new Array();

                            // revise validity
                            var atpReviseValidity = panel.atpRule.d[i].revisevalidity;
                            for (var j = 0; j < atpReviseValidity.length; j++) {
                                var revTypeVal = atpReviseValidity[j];
                                if (revTypeVal) {
                                    if (revTypeVal.toUpperCase() == validity.toUpperCase()) {
                                        blnReviseValidity = true;
                                    }

                                    if (!panel.checkArrayDuplicate(panel.arValidityList, revTypeVal)) {
                                        panel.arValidityList.push([revTypeVal, revTypeVal]);
                                    }
                                }
                            }

                            // revise order type
                            var atpReviseOrderType = panel.atpRule.d[i].rot;
                            for (var j = 0; j < atpReviseOrderType.length; j++) {
                                var revTypeOrderType = atpReviseOrderType[j];
                                if (revTypeOrderType) {
                                    if (revTypeOrderType.toUpperCase() == ordtype.toUpperCase()) {
                                        blnReviseOrderType = true;
                                    }

                                    if (!panel.checkArrayDuplicate(panel.arOTypeList, revTypeOrderType)) {
                                        panel.arOTypeList.push([revTypeOrderType, revTypeOrderType]);
                                    }
                                }
                            }

                            var atpRevise = panel.atpRule.d[i].revise;
                            for (var j = 0; j < atpRevise.length; j++) {
                                var revType = atpRevise[j];
                                revType = revType.replace('+', '').replace('-', '');

                                if (revType.toUpperCase() == 'Q') {
                                    panel.revQty = atpRevise[j];
                                    //panel.enableCmp(input.down('#quantity'));
                                }

                                if (revType.toUpperCase() == 'V') {
                                    panel.revValidity = atpRevise[j];
                                    // check the current Order value in revise atp value if yes then load combo and enable for revise
                                    if (blnReviseValidity) {
                                        panel.setValidityList(mode);
                                        panel.setValidityCmb(validity);
                                        panel.setValidity(validity);

                                        panel.enableCmp(input.down('#cbValidity'));
                                    }
                                }

                                if (revType.toUpperCase() == 'O') {
                                    panel.revOrderType = atpRevise[j];
                                    // check the current Order value in revise atp value if yes then load combo and enable for revise
                                    if (blnReviseOrderType) {
                                        panel.setOTypeList(mode);
                                        panel.setOrdType(ordtype);

                                        panel.enableCmp(input.down('#otype'));
                                    }
                                }

                                if (revType.toUpperCase() == 'P') {
                                    panel.revPrc = atpRevise[j];
                                    //panel.enableCmp(input.down('#price'));
                                }

//                                if (revType.toUpperCase() == 'L') {
//                                    if (validity.toUpperCase() == 'STOPLIMIT') {
//                                        panel.enableCmp(input.down('#stoplimit'));
//                                    }
//                                }

                                if (revType.toUpperCase() == 'D') {
                                    panel.revDisclosedQty = atpRevise[j];
                                    panel.enableCmp(input.down('#dsqty'));
                                }

                                if (revType.toUpperCase() == 'Y') {
                                    panel.enableCmp(input.down('#payment'));
                                }

                                if (revType.toUpperCase() == 'T') {
                                    panel.enableCmp(input.down('#settcurr'));
                                }
                            }

                            break;
                        }
                    }

                    // rule checking
                    panel.setOrderPanelReviseRule(exchg);
                }

                // take from ATP [end]
            } else {
                msg = languageFormat.getLanguage(30231, 'You are not allowed to cancel or revise this order');
                if (panel.isReady && msg) {
                    panel.trdForm.down('#msgBox').update(msg);
                }
            }
        } catch (e) {
            console.log('[OrderPad][initRevise] Exception ---> ' + e);
        }
//  	var panel = this;
//  	try {
//  	panel.oldTktNo = '';
//  	var accno, stkcode, ordtype, validity;
//  	var accList, accInfo;
//  	try {
//  	if (!authenret) return;
//  	accList = accRet.ai;
//  	accInfo = authenret.atp.ti;
//  	accno = panel.accno;
//  	stkcode = panel.stkcode;
//  	ordtype = panel.ordtype;
//  	validity = panel.validity;
//  	} catch(e) {
//  	debug(e);
//  	}
//  	if (stkcode) {
//  	var idx = stkcode.lastIndexOf('.');
//  	if (idx != -1 && idx != (stkcode.length-1)) {
//  	//var exchg = stkcode.substring(idx+1, stkcode.length);
//  	var exchg = getStkExCode(stkcode);
//  	panel.accs = new Array();
//  	panel.arAccList = new Array();
//  	var acc, i;
//  	if (accList && accList.length > 0) {
//  	for (i = 0; i < accList.length; i++) {
//  	acc = accList[i];
//  	if (acc.ex == exchg){ // || (acc.ex == 'SI' && exchg == 'SG')) {
//  	if (acc.ac && acc.cc) {
//  	var newobj = new Object();
//  	newobj.ac = acc.ac;
//  	newobj.cc = acc.cc;
//  	panel.accs.push(newobj);
//  	panel.arAccList.push([acc.ac, acc.ac + ' - ' + acc.an]);
//  	}
//  	}
//  	}
//  	}
//  	// list current accno if not found
//  	if (panel.arAccList.length < 1) {
//  	for (i = 0; i < accList.length; i++) {
//  	acc = accList[i];
//  	if (acc.ac && acc.ac == accno) {
//  	panel.arAccList.push([acc.ac, acc.ac + ' - ' + acc.an]);
//  	}
//  	}
//  	}

//  	// initialize default values
//  	panel.arOTypeList = new Array();
//  	panel.arValidityList = new Array();
//  	if (accInfo && accInfo.length > 0) {
//  	for (i = 0; i < accInfo.length; i++) {
//  	var info = accInfo[i];
//  	if (info.ex == exchg) {
//  	if (info.act && info.act.length > 0) {
//  	for (var a = 0; a < info.act.length; a++) {
//  	var act = info.act[a]?info.act[a]:'';
//  	if (act) {
//  	if (act == modeOrdBuyLabel) panel.allowBuy = true;
//  	else if (act == modeOrdSellLabel) panel.allowSell = true;
//  	}
//  	}
////	debug('panel.allowBuy:' + panel.allowBuy);
////	debug('panel.allowSell:' + panel.allowSell);
//  	}

//  	if (info.r && info.r.length > 0) {
////	debug(info.r.length);
//  	for (var k = 0; k < info.r.length; k++) {
//  	var r = info.r[k] ? info.r[k] : '';
////	debug('info.r:' + r);
//  	if (r) {
//  	var r1 = r.charAt(0);
//  	if (r1 == 'Q') {
//  	panel.revQty = r;
//  	} else if (r1 == 'P') {
//  	panel.revPrc = r;
//  	} else if (r1 == 'D') {
//  	panel.revDisclosedQty = r;
//  	} else if (r1 == 'V') {
//  	panel.revValidity = r;
//  	} else if (r1 == 'O') {
//  	panel.revOrderType = r;
//  	} else if (r1 == 'L') {
//  	panel.revStopLimit = r;
//  	}
//  	}
//  	}
//  	}

//  	if (info.rot && info.rot.length > 0) {
//  	var rot;
////	debug(info.rot.length);
//  	for (var j = 0; j < info.rot.length; j++) {
//  	rot = info.rot[j];
////	debug('rot:'+rot);
//  	panel.arOTypeList.push([rot,rot]);
//  	}
//  	if (panel.arOTypeList.length < 1) {
////	debug('ordtype:'+ordtype);
//  	rot = ordtype;
//  	panel.arOTypeList.push([rot,rot]);
//  	}
//  	}

//  	if (info.rv && info.rv.length > 0) {
//  	var rv;
////	debug(info.rv.length);
//  	for (j = 0; j < info.rv.length; j++) {
//  	rv = info.rv[j];
////	debug('rv:'+rv);
//  	panel.arValidityList.push([rv, rv]);
//  	}
//  	if (panel.arValidityList.length < 1) {
////	debug('validity:'+validity);
//  	rv = validity;
//  	panel.arValidityList.push([rv, rv]);
//  	}
//  	}
//  	}
//  	}
//  	}
//  	if (panel.arOTypeList.length < 1) {
//  	panel.arOTypeList.push([ordtype, ordtype]);
//  	}
//  	if (panel.arValidityList.length < 1) {
//  	panel.arValidityList.push([validity, validity]);
//  	}
//  	}
//  	}
//  	} catch(e) {
//  	debug(e);
//  	}
    },
    setExRule: function (exchg) {
        if (!exchg)
            return;
        var panel = this;
        var accList;
        var i;
        try {
            if (!authenret)
                return;
            accList = accRet.ai;
            //shuwen - 20141007
            if (!isDealerRemisier) {
                panel.accs = new Array();
                panel.arAccList = new Array();

                if (accList && accList.length > 0) {
                    for (i = 0; i < accList.length; i++) {

                        var acc = accList[i];
                        //var show = true;

                        /*
                         var tempExchangeList = [];
                         if (acc.spex != null) {
                         var temp = acc.spex.split(',');
                         for (var ii = 0; ii < temp.length; ii ++) {
                         tempExchangeList.push(panel.getExchangeType(temp[ii]));
                         }
                         }
                         tempExchangeList.push(acc.ex);
                         
                         if (acc.ex == 'SI' && exchg == 'SG') {
                         show = true;
                         } else {
                         if (tempExchangeList.indexOf(exchg) != -1) {
                         show = true;
                         }
                         }
                         */
                        // v1.3.24.13 - kah ming
//          			if (outbound) {
//          			var spex = acc.spex;
//          			var spexs = spex.split(',');
//          			var sp = false;
//          			for(var j = 0; j < spexs.length; j ++) {
//          			var ex = spexs[j];
//          			// need check is the exchange viewing is Delay / RealTime
//          			var exCheck = panel.getExchangeType(exchg);
//          			if (ex == exCheck) {
//          			sp = true;
//          			break;
//          			}
//          			}
//          			show = sp;
//          			} else {
//          			if (acc.ex == exchg || (acc.ex == 'SI' && exchg == 'SG'))
//          			show = true;
//          			}

                        //if (show) {
                        if (acc.ac && acc.cc) {
                            var newobj = new Object();
                            newobj.ac = acc.ac;
                            newobj.cc = acc.cc;
                            panel.accs.push(newobj);
                            panel.arAccList.push([acc.ac + global_AccountSeparator + acc.bc, acc.ac + ' - ' + acc.an + ' - ' + acc.bc]);
                        }
                        //}
                    }
                }
            }

            // reset value
            //panel.setSettCurr('');

            var mode = panel.mode;	// BUY || SELL || CANCEL || REVISE
            // load component info [Order Type / Validity / Payment] - start
            panel.arOTypeList = new Array();
            panel.arValidityList = new Array();
            panel.arPaymentList = new Array();
            panel.arOrderControlList = new Array();
            panel.arReviseControlList = new Array();
            panel.arTrxFeeFormulaList = new Array();
            panel.arTPTypeList = new Array();
            panel.arTPDirectionList = new Array();
            panel.arPaymentConfigList = new Array();
            panel.arNotSupportedCurrList = new Array();
            panel.arCFDOffsetTypeList = new Array();
            panel.arTakeProfitOrderTypeList = new Array();
            panel.arStopLossOrderTypeList = new Array();
            panel.arCloseOrdCtrlList = new Array();
            // take from ATP [start]
            var atpOrderTypeList = '';
            var atpValidityList = '';
            var atpPaymentList = '';
            var atpOrderControlList = '';
            var atpReviseControlList = '';
            var atpTrxFeeFormulaList = '';
            var atpTPTypeList = '';
            var atpTPDirectionList = '';
            var atpPaymentConfigList = '';
            var atpNotSupportedCurrList = '';
            var atpCFDOffsetTypeList = '';
            var atpTakeProfitOrderTypeList = '';
            var atpStopLossOrderTypeList = '';
            var atpCloseOrdCtrlList = '';
            if (panel.atpRule.s == true) {
                var len = panel.atpRule.size;
                for (var i = 0; i < len; i++) {
                    if (panel.atpRule.d != null && panel.atpRule.d[i].ex == panel.exchangecode) {
                        // same exchange
                        atpOrderTypeList = panel.atpRule.d[i].ordtype;
                        atpValidityList = panel.atpRule.d[i].validity;
                        atpPaymentList = panel.atpRule.d[i].payment;
                        atpOrderControlList = panel.atpRule.d[i].ordctrl;
                        atpReviseControlList = panel.atpRule.d[i].revctrl;
                        atpTrxFeeFormulaList = panel.atpRule.d[i].trxfee;
                        atpTPTypeList = panel.atpRule.d[i].tptype;
                        atpTPDirectionList = panel.atpRule.d[i].tpdirection;
                        atpPaymentConfigList = panel.atpRule.d[i].payconfig;
                        atpNotSupportedCurrList = panel.atpRule.d[i].nosupportcurr;
                        atpCFDOffsetTypeList = panel.atpRule.d[i].offsettype;
                        atpTakeProfitOrderTypeList = panel.atpRule.d[i].tpordtype;
                        atpStopLossOrderTypeList = panel.atpRule.d[i].slordtype;
                        atpCloseOrdCtrlList = panel.atpRule.d[i].ccordctrl;
                        break;
                    }
                }
            }

            // Order Control [start]
            if (atpOrderControlList && atpOrderControlList.length > 0) {
                for (var i = 0; i < atpOrderControlList.length; i++) {
                    var OC = atpOrderControlList[i];
                    if (OC) {
                        panel.arOrderControlList.push(OC);
                    }
                }
            }
            // Order Control [End]

            // Revise Control [start]
            if (atpReviseControlList && atpReviseControlList.length > 0) {
                for (var i = 0; i < atpReviseControlList.length; i++) {
                    var RC = atpReviseControlList[i];
                    if (RC) {
                        panel.arReviseControlList.push(RC);
                    }
                }
            }
            // Revise Control [End]

            // Order Type [start]
            if (atpOrderTypeList && atpOrderTypeList.length > 0) {
                for (var i = 0; i < atpOrderTypeList.length; i++) {
                    var t = atpOrderTypeList[i];
                    if (t) {
                        if (!panel.checkArrayDuplicate(panel.arOTypeList, t)) {
                            panel.arOTypeList.push([t, t]);
                        }
                    }
                }
            }
            // Order Type [end] 

            // Validity [start]
            if (atpValidityList && atpValidityList.length > 0) {
                for (var i = 0; i < atpValidityList.length; i++) {
                    var v = atpValidityList[i];
                    if (v) {
                        if (!panel.checkArrayDuplicate(panel.arOTypeList, v)) {
                            panel.arValidityList.push([v, v]);
                        }
                    }
                }
            }
            // Validity [end] 

            // TrxFeeFormula [start]
            if (atpTrxFeeFormulaList && atpTrxFeeFormulaList.length > 0) {
                for (var i = 0; i < atpTrxFeeFormulaList.length; i++) {
                    var tf = atpTrxFeeFormulaList[i];
                    if (tf) {
                        panel.arTrxFeeFormulaList.push(tf);
                    }
                }
            }
            // TrxFeeFormula [end]

            // TPType [start]
            if (atpTPTypeList && atpTPTypeList.length > 0) {
                for (var i = 0; i < atpTPTypeList.length; i++) {
                    var tptype = atpTPTypeList[i];
                    if (tptype) {
                        panel.arTPTypeList.push([tptype, tptype]);
                    }
                }
            }
            // TPType [end]

            // TPDirection [start]
            if (atpTPDirectionList && atpTPDirectionList.length > 0) {
                for (var i = 0; i < atpTPDirectionList.length; i++) {
                    var tpdirection = atpTPDirectionList[i];
                    if (tpdirection) {
                        panel.arTPDirectionList.push([tpdirection, tpdirection]);
                    }
                }
            }
            // TPDirection [end]

            // payment [start]
            var defPay = panel.getDefPayment();
            // bug fix - v1.3.21.1
            if (defPay != null && defPay != "") {
                for (var i = 0; i < defPay.length; i++) {
                    panel.arPaymentList.push([defPay[ i ], defPay[ i ]]);
                }
            }
            if (atpPaymentList && atpPaymentList.length > 0) {
                panel.origArPaymentList.length = 0;
                for (var i = 0; i < atpPaymentList.length; i++) {
                    var p = atpPaymentList[i];
                    if (p && p.act) {
                        var payAct = p.type;
                        if (p.act.length > 0) {
                            for (var j = 0; j < p.act.length; j++) {
                                var payRest = p.act[j].toUpperCase();
                                var blnAdd = false;
                                if (mode == modeOrdBuy) {
                                    if (payRest == modeOrdBuyLabel.toUpperCase()) {
                                        blnAdd = true;
                                    }
                                } else if (mode == modeOrdSell) {
                                    if (payRest == modeOrdSellLabel.toUpperCase()) {
                                        blnAdd = true;
                                    }
                                } else if (mode == modeOrdRevise) {
                                    if (payRest == modeOrdReviseLabel.toUpperCase()) {
                                        blnAdd = true;
                                    }
                                } else if (mode == modeOrdCancel) {
                                    if (payRest == modeOrdCancelLabel.toUpperCase()) {
                                        blnAdd = true;
                                    }
                                }

                                if (blnAdd) {
                                    if (!panel.checkArrayDuplicate(panel.arPaymentList, payAct)) {
                                        panel.arPaymentList.push([payAct, payAct]);
                                    }
                                    if (!panel.checkArrayDuplicate(panel.origArPaymentList, payAct)) {
                                        panel.origArPaymentList.push([payAct, payAct]);
                                    }
                                }
                            }

                            // check if the payment is exist (selected previous)
                            if (!panel.checkArrayDuplicate(panel.arPaymentList, panel.lastPayment)) {
                                panel.lastPayment = '';
                            }
                        } else {
                            // set the payment
                            if (!panel.checkArrayDuplicate(panel.arPaymentList, payAct)) {
                                panel.arPaymentList.push([payAct, payAct]);
                            }
                            if (!panel.checkArrayDuplicate(panel.origArPaymentList, payAct)) {
                                panel.origArPaymentList.push([payAct, payAct]);
                            }
                        }
                    }
                }
            }
            // payment [end]

            // Payment Config [start]
            if (atpPaymentConfigList && atpPaymentConfigList.length > 0) {
                for (var i = 0; i < atpPaymentConfigList.length; i++) {
                    var payconfig = atpPaymentConfigList[i];
                    if (payconfig) {
                        panel.arPaymentConfigList.push(payconfig);
                    }
                }
            }
            // Payment Config [end]

            // Not supported currency [start]
            if (atpNotSupportedCurrList && atpNotSupportedCurrList.length > 0) {
                for (var i = 0; i < atpNotSupportedCurrList.length; i++) {
                    var nosupportcurr = atpNotSupportedCurrList[i];
                    if (nosupportcurr) {
                        panel.arNotSupportedCurrList.push(nosupportcurr);
                    }
                }
            }
            // Not supported currency [end]
            
            //CFD offset type [start]
            if (atpCFDOffsetTypeList && atpCFDOffsetTypeList.length > 0) {
            	for (var i = 0; i < atpCFDOffsetTypeList.length; i++) {
            		var cfdOffsetType = atpCFDOffsetTypeList[i];
            		if (cfdOffsetType) {
            			panel.arCFDOffsetTypeList.push([cfdOffsetType, cfdOffsetType]);
            		}
            	}
            }
            //CFD offset type [end]

            if (atpTakeProfitOrderTypeList && atpTakeProfitOrderTypeList.length > 0) {
            	for (var i = 0; i < atpTakeProfitOrderTypeList.length; i++) {
                    var takeProfitOrdType = atpTakeProfitOrderTypeList[i];
                    if (takeProfitOrdType) {
                    	panel.arTakeProfitOrderTypeList.push([takeProfitOrdType, takeProfitOrdType]);
                    }
                }
            }
            
            if (atpStopLossOrderTypeList && atpStopLossOrderTypeList.length > 0) {
                for (var i = 0; i < atpStopLossOrderTypeList.length; i++) {
                    var stopLossOrdType = atpStopLossOrderTypeList[i];
                    if (stopLossOrdType) {
                    	panel.arStopLossOrderTypeList.push([stopLossOrdType, stopLossOrdType]);
                    }
                }
            }
            
            if (atpCloseOrdCtrlList && atpCloseOrdCtrlList.length > 0) {
                for (var i = 0; i < atpCloseOrdCtrlList.length; i++) {
                    var closeOrdCtrl = atpCloseOrdCtrlList[i];
                    if (closeOrdCtrl) {
                    	panel.arCloseOrdCtrlList.push(closeOrdCtrl);
                    }
                }
            }

            panel.initFldCfg(exchg);	// load init flag configure (order pad element ON or OFF)

        } catch (e) {
            console.log('[OrderPad][setExRule] Exception ---> ' + e);
        }
    },
    setOrderPanelReviseRule: function (exchg) {

        var panel = this;
        var input = panel.trdForm.down('#inPanel');
//        var stkcode = panel.stkcode;
//        var ex = '';

//        panel.arOrderControlList = new Array();
//		panel.arReviseControlList = new Array();
//        if (stkcode.indexOf('.') != -1) {
//            ex = getStkExCode(stkcode);
//            panel.setExRule(ex);
//        }

        if (panel.arReviseControlList && panel.arReviseControlList.length > 0) {
            var currentOrderType = panel.getOrdType();
            for (var i = 0; i < panel.arReviseControlList.length; i++) {
                var revOrdCtrl = panel.arReviseControlList[i];
                if (revOrdCtrl.type == currentOrderType) {
                    var revCtrlEnable = revOrdCtrl.rce;

//      			grab enable value element
                    var blnStopLimit = false;
                    var blnPrice = false;
                    var blnQty = false;
                    var blnTPType = false;
                    var blnTPDirection = false;

                    for (var j = 0; j < revCtrlEnable.length; j++) {
                        var val = revCtrlEnable[j];
                        if (val) {
                            var tmp = val.split("=");
                            var columnRule = '';
                            if (tmp.length >= 1) {
                                val = tmp[0];
                                columnRule = tmp[1];
                            }

                            if (val.toUpperCase() == 'STOPLIMIT') {
                                blnStopLimit = true;
                            }
                            if (val.toUpperCase() == 'PRICE') {
                                blnPrice = true;
                            }
                            if (val.toUpperCase() == 'QTY') {
                                blnQty = true;
                            }
                            if (val.toUpperCase() == 'TRIGGERPRICETYPE') {
                                blnTPType = true;
                            }
                            if (val.toUpperCase() == 'TRIGGERPRICEDIRECTION') {
                                blnTPDirection = true;
                            }
                        }
                    }

                    if (panel.fldCfg.stoplimit) {
                        if (blnStopLimit) {
                            panel.enableCmp(input.down('#stoplimit'));
                        } else {
                            panel.disableCmp(input.down('#stoplimit'));
                        }
                    }
        			if(panel.fldCfg.triggertype){
        				if(blnTPType){        				
                            panel.lastTPType = panel.tpType;
                            panel.setTPTypeList(1);
                            panel.enableCmp(input.down('#tptype'));
        				}else{
                            panel.disableCmp(input.down('#tptype'));
                        }
                    }
        			if(panel.fldCfg.triggerdirection){
        				if(blnTPDirection){      					
                            panel.lastTPDirection = panel.tpDirection;
                            panel.setTPDirectionList(1);
                            panel.enableCmp(input.down('#tpdirection'));
        				}else{
                            panel.disableCmp(input.down('#tpdirection'));
                        }
                    }
        			if(blnPrice){
                        panel.enableCmp(input.down('#price'));
        			}else{
                        panel.disableCmp(input.down('#price'));
                    }
        			if(blnQty){
                        panel.enableCmp(input.down('#quantity'));
        			}else{
                        panel.disableCmp(input.down('#quantity'));
                    }

                    break;
                }
            }
        }

        /*if (panel.arOrderControlList.length > 0) {
         var currentOrderType = panel.getOrdType();
         // validity
         if (panel.arOrderControlList && panel.arOrderControlList.length > 0) {
         for (var i = 0; i < panel.arOrderControlList.length; i++) {
         var ordCtrl = panel.arOrderControlList[i];
         if (ordCtrl.type == currentOrderType) {
         var ordCtrlEnable = panel.arOrderControlList[i].oce;
         
         // grab enable value element
         var blnStopLimit = false;
         var blnMinQty = false;
         var blnDisQty = false;
         
         for (var j = 0; j < ordCtrlEnable.length; j++) {
         var val = ordCtrlEnable[j];
         if (val) {
         var tmp = val.split("=");
         var columnRule = '';
         if (tmp.length >= 1) {
         val = tmp[0];
         columnRule = tmp[1];
         }
         
         if (val.toUpperCase() == 'MIN') {
         blnMinQty = true;
         }
         if (val.toUpperCase() == 'DISCLOSED') {
         blnDisQty = true;
         panel.arDisclosedRuleList = new Array();
         if (columnRule != undefined && columnRule != null && columnRule != '') {
         panel.arDisclosedRuleList.push(columnRule);	// 2011-01-06: ATP  currently having this features	
         }
         }
         if (val.toUpperCase() == 'STOPLIMIT') {
         blnStopLimit = true;
         }
         }
         }
         
         // action for enable / disable element
         if (panel.fldCfg.stoplimit) {	// check Stop limit is visible
         if (blnStopLimit) {
         panel.enableCmp(input.down('#stoplimit'));
         } else {
         panel.disableCmp(input.down('#stoplimit'));
         }
         }
         
         // bug - v1.3.14.16
         if (panel.fldCfg.minqty) {	// check Min. Qty is visible
         //        					if(blnMinQty){
         //        						panel.enableCmp(input.down('#minqty'));
         //        					}else{
         panel.disableCmp(input.down('#minqty'));
         //        					}
         }
         
         
         // not idea why will checking this part
         //    					if(panel.fldCfg.dsqty){		// check Disc. Qty is visible
         //        					if(blnDisQty){
         //        						var currentValidity = panel.getValidity();
         //        						var blnDisQtyPassRule = false;
         //        						if(panel.arDisclosedRuleList && panel.arDisclosedRuleList.length==1){	// currently only 1 row, future may not sure
         //        							var v = panel.arDisclosedRuleList[0];
         //        							if(v){
         //        								var tmp = v.split(".");
         //            							for(var j=0; j<tmp.length; j++){
         //            								if(tmp[j]==currentValidity){
         //            									blnDisQtyPassRule = true;
         //            								}
         //            							}        								
         //        							}
         //        						}else{
         //        							blnDisQtyPassRule = true;
         //        						}
         //        						
         //        						if(blnDisQtyPassRule){
         //        							panel.enableCmp(input.down('#dsqty'));
         //        						}else{
         //        							panel.disableCmp(input.down('#dsqty'));
         //        						}
         //        					}else{
         //        						panel.disableCmp(input.down('#dsqty'));
         //        					}
         //    					}
         
         break;
         }
         }
         }
         
         }*/
    },
    setOrderPanelBuySellRule: function (ex) {

        var panel = this;
        var input = panel.trdForm.down('#inPanel');
//        var mode = panel.mode;	// BUY || SELL || CANCEL || REVISE

        // compulsory field that will show
        panel.enableCmp(input.down('#cbAction'));
        var _accountNo = input.down('#accountno');
        panel.enableCmp(_accountNo);
        panel.enableCmp(input.down('#price'));
        panel.enableCmp(input.down('#quantity'));
        panel.enableCmp(input.down('#otype'));
        panel.enableCmp(input.down('#cbValidity'));
        panel.enableCmp(input.down('#chkTakeProfit'));
        panel.enableCmp(input.down('#chkCutLoss'));
        panel.enableCmp(input.down('#ordTypeTakeProfit'));
        panel.enableCmp(input.down('#ordTypeCutLoss'));

        if (panel.arAccList.length > 0) {
            for (var i = 0; i < panel.arAccList.length; i++) {
                if (panel.arAccList[i][1].indexOf(_accountNo.value) != -1) {
                    _accountNo.setValue(panel.arAccList[i][1]);
                    break;
                }
            }
        }

        if (panel.arOrderControlList.length > 0) {
            if (panel.arOTypeList.length > 0) {
                panel.setOTypeList(1);	// load to GUI
            }

            if (panel.arTPTypeList.length > 0) {
                panel.setTPTypeList(1); // load to GUI
            }

            if (panel.arTPDirectionList.length > 0) {
                panel.setTPDirectionList(1); // load to GUI
            }

            var currentOrderType = panel.getOrdType();

            // validity
            if (panel.arOrderControlList && panel.arOrderControlList.length > 0) {
                for (var i = 0; i < panel.arOrderControlList.length; i++) {
                    var ordCtrl = panel.arOrderControlList[i];
                    if (ordCtrl.type == currentOrderType) {
                        var ordCtrlValidity = panel.arOrderControlList[i].ocv;
                        var ordCtrlEnable = panel.arOrderControlList[i].oce;

                        panel.arValidityList = new Array();
                        for (var j = 0; j < ordCtrlValidity.length; j++) {
                            var v = ordCtrlValidity[j];
                            if (v) {
                                if (!panel.checkArrayDuplicate(panel.arOTypeList, v)) {
                                    panel.arValidityList.push([v, v]);
                                }
                            }
                        }

                        if (panel.arValidityList.length > 0) {
                            panel.setValidityList(1); // load to GUI
                            //panel.setValidityCmb(panel.arValidityList[0][0]);
                        }

                        // grab enable value element
                        var blnPrice = false;
                        var blnQty = false;
                        var blnStopLimit = false;
                        var blnMinQty = false;
                        var blnDisQty = false;
                        var blnTPType = false;
                        var blnTPDirection = false;
                        for (var j = 0; j < ordCtrlEnable.length; j++) {
                            var val = ordCtrlEnable[j];
                            if (val) {
                                var tmp = val.split("=");
                                var columnRule = '';
                                if (tmp.length >= 1) {
                                    val = tmp[0];
                                    columnRule = tmp[1];
                                }

                                if (val.toUpperCase() == 'QTY') {
                                    blnQty = true;
                                }
                                if (val.toUpperCase() == 'PRICE') {
                                    blnPrice = true;
                                }
                                if (val.toUpperCase() == 'MIN') {
                                    blnMinQty = true;
                                }
                                if (val.toUpperCase() == 'DISCLOSED') {
                                    blnDisQty = true;
                                    panel.arDisclosedRuleList = new Array();
                                    if (columnRule != undefined && columnRule != null && columnRule != '') {
                                        panel.arDisclosedRuleList.push(columnRule);	// 2011-01-06: ATP  currently having this features	
                                    }
                                }
                                if (val.toUpperCase() == 'STOPLIMIT') {
                                    blnStopLimit = true;
                                }

                                if (val.toUpperCase() == 'TRIGGERPRICETYPE') {
                                    blnTPType = true;
                                }
                                if (val.toUpperCase() == 'TRIGGERPRICEDIRECTION') {
                                    blnTPDirection = true;
                                }
                            }
                        }

                        // action for enable / disable element
                        if (panel.fldCfg.stoplimit) {	// check Stop limit is visible
                            if (blnStopLimit) {
                                input.down('#stoplimit').setValue(''); // requested by Susan 20140305
                                panel.enableCmp(input.down('#stoplimit'));
                            } else {
                                panel.disableCmp(input.down('#stoplimit'));
                                input.down('#stoplimit').setValue('');
                            }
                        }

                        if (panel.fldCfg.minqty) {	// check Min. Qty is visible
                            if (blnMinQty) {
                                //input.down('#minqty').setValue('1');
                                panel.enableCmp(input.down('#minqty'));
                            } else {
                                panel.disableCmp(input.down('#minqty'));
                                input.down('#minqty').setValue('');
                            }
                        }

                        if (panel.fldCfg.dsqty) {		// check Disc. Qty is visible
                            if (blnDisQty) {
                                var currentValidity = panel.getValidityCmb();
                                var blnDisQtyPassRule = false;
                                if (panel.arDisclosedRuleList && panel.arDisclosedRuleList.length == 1) {	// currently only 1 row, future may not sure
                                    var v = panel.arDisclosedRuleList[0];
                                    if (v) {
                                        var tmp = v.split(".");
                                        for (var j = 0; j < tmp.length; j++) {
                                            if (tmp[j] == currentValidity) {
                                                blnDisQtyPassRule = true;
                                            }
                                        }
                                    }
                                } else {
                                    blnDisQtyPassRule = true;
                                }

                                if (blnDisQtyPassRule) {
                                    input.down('#dsqty').setValue('');
                                    panel.enableCmp(input.down('#dsqty'));
                                } else {
                                    panel.disableCmp(input.down('#dsqty'));
                                    input.down('#dsqty').setValue('');
                                }
                            } else {
                                panel.disableCmp(input.down('#dsqty'));
                                input.down('#dsqty').setValue('');
                            }
                        }

                        if (blnPrice) {
                            panel.enableCmp(input.down('#price'));
                            input.down('#price').setValue(panel.lastPrc);
                        } else {
                            panel.disableCmp(input.down('#price'));
                            input.down('#price').setValue('');
                        }

                        if (blnQty) {
                            if (panel.isDisableToClear) {
                                panel.isDisableToClear = false;
                            } else {
                                input.down('#quantity').setValue(''); //1.3.29.36
                            }

                            panel.enableCmp(input.down('#quantity'));
                        } else {
                            panel.disableCmp(input.down('#quantity'));
                            input.down('#quantity').setValue('');
                        }

                        if (panel.fldCfg.bts2features) {
                            if (blnTPType) {
                                panel.enableCmp(input.down('#tptype'));
                                input.down('#tptype').setValue(panel.lastTPType);
                            } else {
                                panel.disableCmp(input.down('#tptype'));
                                input.down('#tptype').setValue('');
                            }

                            if (blnTPDirection) {
                                panel.enableCmp(input.down('#tpdirection'));
                                input.down('#tpdirection').setValue(panel.lastTPDirection);
                            } else {
                                panel.disableCmp(input.down('#tpdirection'));
                                input.down('#tpdirection').setValue('');
                            }
                        }

                        // to enable back it may disable when reset

                        if (panel.fldCfg.payment) {	// check Payment is visible
                            // bug fix - v1.3.21.1
                            if (panel.arPaymentList.length > 0) {
                                panel.enableCmp(input.down('#payment'));
                            }
                        }

                        if (panel.fldCfg.settcurr) {	// check Sett.Curr is visible
                            panel.enableCmp(input.down('#settcurr'));
                        }

                        break;
                    }
                }
            }

            if (panel.arPaymentList.length > 0) {
                panel.setPaymentList(1); // load to GUI
            }
        } else {
            // load Order Type / Validity / Payment default as Order Control not exist
            if (panel.arOTypeList.length == 0 && panel.arValidityList.length == 0 && panel.arPaymentList.length == 0) {
                panel.setExRule(ex);
                panel.setOrderPanelBuySellRule(ex);
                return;
            } else {
                if (panel.arOTypeList.length > 0) {
                    panel.setOTypeList(1);	// load to GUI
                }

                if (panel.arValidityList.length > 0) {
                    panel.setValidityList(1); // load to GUI
                }

                if (panel.arPaymentList.length > 0) {
                    panel.setPaymentList(1); // load to GUI
                }

                if (panel.arTPTypeList.length > 0) {
                    panel.setTPTypeList(1); // load to GUI
                }

                if (panel.arTPDirectionList.length > 0) {
                    panel.setTPDirectionList(1); // load to GUI
                }                
            }
        }
        
        if (panel.arCloseOrdCtrlList.length > 0) {
        	if (panel.arCFDOffsetTypeList.length > 0) {
        		panel.setCFDOffsetTypeList(1); // load to GUI
        	}

        	if (panel.arTakeProfitOrderTypeList.length > 0) {
        		panel.setTakeProfitTypeList(1); // load to GUI
        	}

        	if (panel.arStopLossOrderTypeList.length > 0) {
        		panel.setStopLossTypeList(1); // load to GUI
        	}

        	var currentTakeProfitOrdType = panel.getTakeProfitOrdType();
        	var currentStopLossOrdType = panel.getStopLossOrdType();

        	// close condition
        	if (panel.arCloseOrdCtrlList && panel.arCloseOrdCtrlList.length > 0) {
        		for (var i = 0; i < panel.arCloseOrdCtrlList.length; i++) {
        			var ordCtrl = panel.arCloseOrdCtrlList[i];
        			if (ordCtrl.type == currentTakeProfitOrdType) {
        				// grab enable value element
        				var blnTakeProfitValue = false;
        				var blnTakeProfitOffsetType = false;
        				var blnStopLossValue = false;
        				var blnStopLossOffsetType = false;
        				var blnStopLossTggrPrice = false;

        				var ordCtrlEnable = panel.arCloseOrdCtrlList[i].oce;
        				for (var j = 0; j < ordCtrlEnable.length; j++) {
        					var val = ordCtrlEnable[j];
        					if (val) {
        						if (val.toUpperCase() == 'VALUE') {
        							blnTakeProfitValue = true;
        						}

        						if (val.toUpperCase() == 'OFFSETTYPE') {
        							blnTakeProfitOffsetType = true;
        						}
        					}
        				}
        			}

        			if (ordCtrl.type == currentStopLossOrdType) {
        				var ordCtrlEnable = panel.arCloseOrdCtrlList[i].oce;

        				for (var j = 0; j < ordCtrlEnable.length; j++) {
        					var val = ordCtrlEnable[j];
        					if (val) {
        						if (val.toUpperCase() == 'VALUE') {
        							blnStopLossValue = true;
        						}

        						if (val.toUpperCase() == 'OFFSETTYPE') {
        							blnStopLossOffsetType = true;
        						}

        						if (val.toUpperCase() == 'STOPLIMIT') {
        							blnStopLossTggrPrice = true;
        						}
        					}
        				}
        			}

        			if (blnTakeProfitValue) {
        				panel.enableCmp(input.down('#priceTakeProfit'));
        				input.down('#priceTakeProfit').setValue('');
        			} else {
        				panel.disableCmp(input.down('#priceTakeProfit'));
        				input.down('#priceTakeProfit').setValue('');
        			}

        			if (blnTakeProfitOffsetType) {
        				panel.enableCmp(input.down('#cfdostype_0'));
        				input.down('#cfdostype_0').setValue(panel.arCFDOffsetTypeList[0][0]);
        			} else {
        				panel.disableCmp(input.down('#cfdostype_0'));
        				input.down('#cfdostype_0').setValue('');
        			}

        			if (blnStopLossValue) {
        				panel.enableCmp(input.down('#priceCutLoss'));
        				input.down('#priceCutLoss').setValue('');
        			} else {
        				panel.disableCmp(input.down('#priceCutLoss'));
        				input.down('#priceCutLoss').setValue('');
        			}

        			if (blnStopLossOffsetType) {
        				panel.enableCmp(input.down('#cfdostype_1'));
        				input.down('#cfdostype_1').setValue(panel.arCFDOffsetTypeList[0][0]);
        			} else {
        				panel.disableCmp(input.down('#cfdostype_1'));
        				input.down('#cfdostype_1').setValue('');
        			}

        			if (blnStopLossTggrPrice) {
        				panel.enableCmp(input.down('#tggrpriceCutLoss'));
        				input.down('#tggrpriceCutLoss').setValue('');
        			} else {
        				panel.disableCmp(input.down('#tggrpriceCutLoss'));
        				input.down('#tggrpriceCutLoss').setValue('');
        			}
        		}
        	}
        }
    },
    setCurrency: function (val, mode) {
        var getFeedCurr = false;

        if (forceDisableSettCurr == "TRUE") {
            // ignore
        } else {

            var panel = this;
            var ordPad = panel.trdForm.down('#OrdPad');
            var currEl = ordPad.down('#settcurr');
            var getATPPaymentConfig = false;

            if (currEl) {

                if (mode == 0) {
                    currEl.store.removeAll();
                    currEl.clearValue();

                } else {

                    panel.arCurrencyList = new Array();
                    var settCurrOption = panel.getSettPaymentOption();
                    var atpCurrOption = new Array();

                    if (settCurrOption.length > 0) {
                        getFeedCurr = false;
                        for (var i = 0; i < settCurrOption.length; i++) {
                            if (settCurrOption[i] == '+') {
                                getFeedCurr = true;
                                getATPPaymentConfig = true;
                            } else {
                                if (settCurrOption[i].length > 0) {
                                    atpCurrOption.push([settCurrOption[i], settCurrOption[i]]);
                                }
                            }
                        }
                    }

                    // Load QC + Load ATP + Loan Default
                    // take from local
                    var curr = '';//panel.getDefSettCurr();
                    //if (curr) panel.arCurrencyList.push([curr,curr]);
                    /*
                     if (panel.exchangecode != 'MY') {
                     if (showDefaultCur == "TRUE") {
                     // take from local
                     var defcurr = panel.getDefSettCurr();
                     if (defcurr) {
                     if (!panel.checkArrayDuplicate(panel.arCurrencyList, defcurr)) {
                     panel.arCurrencyList.push([defcurr, defcurr]);
                     }
                     if (curr == null || curr.length == 0) {
                     curr = defcurr;
                     }
                     }
                     }
                     }*/

                    // take from ATP [start]
                    if (!getATPPaymentConfig) {
                        var atpCurrList = '';
                        if (panel.atpRule.s == true) {
                            var len = panel.atpRule.size;
                            for (var i = 0; i < len; i++) {
                                if (panel.atpRule.d != null && panel.atpRule.d[i].ex == panel.exchangecode) {
                                    // same exchange
                                    atpCurrList = panel.atpRule.d[i].cur;
                                    break;
                                }
                            }
                        }

                        if (atpCurrList && atpCurrList.length > 0) {
                            for (var i = 0; i < atpCurrList.length; i++) {
                                var c = atpCurrList[i];
                                if (c && c == '+') {
                                    getFeedCurr = true;
                                } else {
                                    curr = c;
                                    if(panel.currency == ''){
                                    	panel.currency = c;
                                    }
                                    if (!panel.checkArrayDuplicate(panel.arCurrencyList, c)) {
                                        panel.arCurrencyList.push([c, c]);
                                    }
                                }
                            }
                        } else {
                            getFeedCurr = true;
                        }
                    } else {
                        if (atpCurrOption.length > 0) {
                            panel.arCurrencyList = atpCurrOption;
                        }
                    }
                    // take from ATP [end]

                    // this from QC [start]
                    if (getFeedCurr) {
                        var currList = val ? val.split(',') : '';
                        if (currList && currList.length > 0) {
                            for (var i = 0; i < currList.length; i++) {
                                var c = currList[i];
                                var isCurrSupported = true;
                                if (c) {
                                    //if (showDefaultCur != "TRUE" && (curr == null || curr.length == 0)) {
                                    if (panel.arNotSupportedCurrList.length > 0) {
                                        for (var j = 0; j < panel.arNotSupportedCurrList.length; j++) {
                                            if (c == panel.arNotSupportedCurrList[j]) {
                                                isCurrSupported = false;
                                                break;
                                            }
                                        }
                                    }

                                    if (isCurrSupported) {
                                        curr = c;

                                        if (!panel.checkArrayDuplicate(panel.arCurrencyList, c)) {
                                            panel.arCurrencyList.unshift([c, c]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // this from QC [end]


                    /*
                     if (panel.exchangecode != 'MY') {
                     if (showDefaultCur != "TRUE") {
                     // take from local
                     var defcurr = panel.getDefSettCurr();
                     if (defcurr) {
                     if (!panel.checkArrayDuplicate(panel.arCurrencyList, defcurr)) {
                     panel.arCurrencyList.push([defcurr, defcurr]);
                     }
                     if (curr == null || curr.length == 0) {
                     curr = defcurr;
                     }
                     }
                     }
                     }*/

                    currEl.store.loadData(panel.arCurrencyList);

                    if (curr && curr.length > 0) {
                        panel.setSettCurr(curr);
                    }

                    if (curr)
                        panel.updCurrency = true;

                    currEl.collapse();
                }
            }
        }
    },
    setFldConfig: function (ex) {

        var panel = this;
        if (!ex)
            ex = panel.getExCode();

        var fldCfg = new Object();
        fldCfg.contra = false;
        fldCfg.force = false;
        fldCfg.amalgamation = false;
        fldCfg.payment = false;
        fldCfg.minqty = false;
        fldCfg.stoplimit = false;
        fldCfg.shortsell = false;
        fldCfg.privateOrd = false;
        fldCfg.dsqty = false;
        fldCfg.settcurr = false;
        fldCfg.strategy = false;
        fldCfg.confirm = true;
        fldCfg.showlimit = true;
        fldCfg.skipconfm = false;
        fldCfg.forceord = false;
        fldCfg.forcequeue = false;
        fldCfg.bts2features = false;
        fldCfg.triggertype = false;
        fldCfg.triggerdirection = false;

        if (ex && panel.arFldCfg && panel.arFldCfg.length > 0) {
            for (var i = 0; i < panel.arFldCfg.length; i++) {
                var cfg = panel.arFldCfg[i];
                var key = cfg.ex;
                var tempExchange = formatutils.removeDelayExchangeChar(ex);

                if (key && key == tempExchange) {
                    if (cfg.contra && cfg.contra == 'Y')
                        fldCfg.contra = true;
                    if (cfg.force && cfg.force == 'Y')
                        fldCfg.force = true;
                    if (cfg.amalgamation && cfg.amalgamation == 'Y')
                        fldCfg.amalgamation = true;
                    if (cfg.payment && cfg.payment == 'Y')
                        fldCfg.payment = true;
                    if (cfg.minqty && cfg.minqty == 'Y')
                        fldCfg.minqty = true;
                    if (cfg.stoplimit && cfg.stoplimit == 'Y')
                        fldCfg.stoplimit = true;
                    if (cfg.shortsell && cfg.shortsell == 'Y')
                        fldCfg.shortsell = true;
                    if (cfg.privateOrd && cfg.privateOrd == 'Y')
                        fldCfg.privateOrd = true;
                    if (cfg.dsqty && cfg.dsqty == 'Y')
                        fldCfg.dsqty = true;
                    if (cfg.settcurr && cfg.settcurr == 'Y')
                        fldCfg.settcurr = true;
                    if (cfg.strategy && cfg.strategy == 'Y')
                        fldCfg.strategy = true;
                    if (cfg.confirm && cfg.confirm == 'N')
                        fldCfg.confirm = false;
                    if (cfg.showlimit && cfg.showlimit == 'N')
                        fldCfg.showlimit = false;

                    if (cfg.skipconfm && cfg.skipconfm == 'Y')
                        fldCfg.skipconfm = true;
                    if (cfg.forceord && cfg.forceord == 'Y')
                        fldCfg.forceord = true;
                    if (cfg.forcequeue && cfg.forcequeue == 'Y')
                        fldCfg.forcequeue = true;
                    if (cfg.bts2features && cfg.bts2features == 'Y')
                        fldCfg.bts2features = true;
                    if (cfg.triggertype && cfg.triggertype == 'Y')
                        fldCfg.triggertype = true;
                    if (cfg.triggerdirection && cfg.triggerdirection == 'Y')
                        fldCfg.triggerdirection = true;
                    break;
                }
            }
        }
        
        panel.fldCfg = fldCfg;
    },
    setBalance: function (val) {
        var me = this;

        var el = Ext.get('accountno_label2');

        if (el) {
            var cfg = this.fldCfg;
            if (me.exchangecode == '') {
                el.update('');
                if (me.btnlimit.isVisible()) {
                    me.btnlimit.setVisible(false);
                }
            } else if (cfg && cfg.showlimit == true && me.exchangecode != 'MY') {
                el.update(val);
                if (!me.btnlimit.isVisible()) {
                    me.btnlimit.setVisible(true);
                }
            } else {
                el.update('');
                if (me.btnlimit.isVisible()) {
                    me.btnlimit.setVisible(false);
                }
            }

            if (me.btnlimit.isVisible()) {
                var trdLimitCol = Ext.get("trdLimitCol");
                var isOverflow = formatutils.checkOverflow(trdLimitCol);

                if (isOverflow) {
                    var trimValIndex = val.indexOf(':');
                    var trimVal = val.substring(trimValIndex + 2); //to account for the space after ':'
                    el.update(trimVal);
                }
            }
        }
    },
    setSettCurr: function (val) {
        var panel = this;

        var isSetSetting = false;
        var paymentTypeList = [];

        if (global_orderPadPaymentSetting != '') {
            var tempList = global_orderPadPaymentSetting.split(';');
            for (var i = 0; i < tempList.length; i++) {
                var tempSubList = tempList[ i ].split('|');
                if (tempSubList[ 0 ] == val) {
                    isSetSetting = true;
                    paymentTypeList = tempSubList[ 1 ].split(',');
                }
            }
        }

        if (panel.paymentStore == null) {
            panel.paymentStore = [];
        }

        var component = panel.trdForm.down('#payment');


        if (panel.paymentStore.length != 0) {
            panel.enableCmp(component);
            var comboStore = component.getStore();
            comboStore.removeAll();

            for (var i = 0; i < panel.paymentStore.length; i++) {
                comboStore.add(panel.paymentStore[ i ]);
            }

            component.setValue(panel.paymentStore[0].get('code'));
            panel.paymentStore = [];
        }

        if (isSetSetting) {

            if (!component.readOnly) {
                var comboStore = component.getStore();
                var removeItemList = [];

                for (var i = 0; i < comboStore.getCount(); i++) {
                    var record = comboStore.getAt(i);
                    if (record != null) {
                        if (paymentTypeList.indexOf(record.get('code')) != -1) {
                            removeItemList.push(record);
                        }
                    }
                    panel.paymentStore.push(record);
                }

                comboStore.remove(removeItemList);

                if (comboStore.getCount() > 0) {
                    component.setValue(comboStore.getAt(0).get('code'));
                } else {
                    panel.disableCmp(component);
                    component.setValue('');
                }
            }
        }

        var input = panel.trdForm.down('#inPanel');
        var el = input.down('#settcurr');

        if (forceDisableSettCurr == "TRUE") {
            if (el)
                el.setValue('');
        } else {
            if (el)
                el.setValue(val);
        }
    },
    getSettCurr: function () {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#settcurr');
        if (el)
            return el.getValue();
        else
            return '';
    },
    setOrdType: function (val) {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#otype');
        if (el)
            el.setValue(val);
    },
    getOrdType: function () {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#otype');
        if (el)
            return el.getValue();
        else
            return '';
    },
    setValidityCmb: function (val) {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#cbValidity');
        if (el)
            el.setValue(val);
    },
    getValidityCmb: function () {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#cbValidity');
        if (el)
            return el.getValue();
        else
            return '';
    },
    setValidity: function (val) {
//        var input = this.trdForm.OrdPad.inPanel;
        var input = this.trdForm.down('#OrdPad');
        var el = input.down('#validity');

        if (el)
            el.setValue(val);
    },
    getValidity: function () {
//        var input = this.trdForm.OrdPad.inPanel;
        var input = this.trdForm.down('#OrdPad');
        var el = input.down('#validity');
        if (el)
            return el.getValue();
        else
            return '';
    },
    setGTD: function (val) {
        var input = this.trdForm.down('#OrdPad');
        var el = input.down('#gtd');
        if (el)
            el.setValue(val);
    },
    getGTD: function () {
        var input = this.trdForm.down('#OrdPad');
        var el = input.down('#gtd');
        if (el)
            return el.getValue();
        else
            return '';
    },
    setGTDLbl: function (val) {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#lblGTD');
        if (el)
            el.setValue(val);
    },
    getGTDLbl: function () {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#lblGTD');
        if (el)
            return el.getValue();
        else
            return '';
    },
    setAccountNo: function (val) {
        var el = this.trdForm.down("#accountno");
        if (el)
            el.setValue(val);
    },
    getAccountNo: function () {
        var el = this.trdForm.down("#accountno");
        if (el.getValue()) {
            var tempValue = ((el.getValue()).split(global_AccountSeparator))[0].trim();
            return tempValue;
        }
        else
            return '';
    },
    getAccountName: function () {
        var el = this.trdForm.down("#accountno");

        if (el)
            return el.getRawValue();
        else
            return '';
    },
    setPayment: function (val) {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#payment');
        if (el)
            el.setValue(val);
    },
    getPayment: function () {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#payment');
        if (el)
            return el.getValue();
        else
            return '';
    },
    setShortSell: function (val) {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#shortsell');
        if (el)
            el.setValue(val);
    },
    getShortSell: function () {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#shortsell');
        if (el)
            return el.getValue();
        else
            return '';
    },
    setPrivateOrd: function (val) {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#privateOrd');
        if (el) el.setValue(val);
    },
    getPrivateOrd: function() {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#privateOrd');
        if (el) return el.getValue();
        else return '';
    },
    setForceOrder: function(val) {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#forceorder');
        if (el)
            el.setValue(val);
    },
    getForceOrder: function() {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#forceorder');
        if (el)
            return el.getValue();
        else
            return '';
    },
    setForceQueue: function (val) {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#forcequeue');
        if (el)
            el.setValue(val);
    },
    getForceQueue: function () {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#forcequeue');
        if (el)
            return el.getValue();
        else
            return '';
    },
    setAmalgamate: function (val) {
        var ordpad = this.trdForm.getComponent('OrdPad');
        var input = ordpad.down('#inPanel');
        var el = input.down('#amalgamate');
        if (el)
            el.setValue(val);
    },
    getAmalgamate: function () {
        var ordpad = this.trdForm.getComponent('OrdPad');
        var input = ordpad.down('#inPanel');
        var el = input.down('#amalgamate');
        if (el)
            return el.getValue();
        else
            return '';
    },
    setStrategy: function (mode) {
        var panel = this;
        try {
            var input = panel.trdForm.down('#inPanel');
            var el = input.down('#strategy');
            if (el) {
                var val;
                if (mode == 0) {
//                    el.store.removeAll();
//                    el.clearValue();
                } else if (mode == 1) {
//  				el.store.loadData(panel.arPaymentList);
//el.collapse();
//val = panel.lastPayment ? panel.lastPayment : ((panel.arPaymentList && panel.arPaymentList.length>0) ? panel.arPaymentList[0][0] : '');
//  				el.setValue(val);
                } else {
//  				el.store.loadData(panel.arPaymentList);
//  				el.collapse();
//  				val = (panel.arPaymentList && panel.arPaymentList.length>0) ? panel.arPaymentList[0][0] : '';
//  				el.setValue(val);
                }
            }
        } catch (e) {
            console.log('[OrderPad][setStrategy] Exception ---> ' + e);
        }
    },
    setStopLimit: function (val) {
        if (forceDisableStopLimit == "TRUE") {
            // ignore
        } else {
            var input = this.trdForm.down('#inPanel');
            var el = input.down('#stoplimit');
            if (el)
                el.setValue(val);
        }
    },
    getStopLimit: function () {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#stoplimit');
        if (el)
            return el.getValue();
        else
            return '';
    },
    setMinQty: function (val) {
        if (val) {
            var input = this.trdForm.down('#inPanel');
            var el = input.down('#minqty');
            if (forceDisableMinQty == "TRUE") {
                if (el)
                    el.setValue('');
            } else {
                if (el) {
                    if (val.toString().length > 0) {
                        if (parseInt(val) > 0) {
                            if (N2N_CONFIG.orderRoundQty) {
                                val = formatutils.formatNumber(val);
                            }
                            el.setValue(val);
                        } else {
                            el.setValue('');
                        }
                    }
                }
            }
        }
    },
    getMinQty: function () {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#minqty');
        if (el)
            return el.getValue();
    },
    setDsQty: function (val) {
        if (val) {
            var input = this.trdForm.down('#inPanel');
            var el = input.down('#dsqty');
            if (forceDisableDisclosedQty == "TRUE") {
                if (el)
                    el.setValue('');
            } else {
                if (el) {
                    if (val.toString().length > 0) {
                        if (parseInt(val) > 0) {
                            if (N2N_CONFIG.orderRoundQty) {
                                val = formatutils.formatNumber(val);
                            }
                            el.setValue(val);
                        } else {
                            el.setValue('');
                        }
                    }
                }
            }
        }
    },
    getDsQty: function () {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#dsqty');
        if (el)
            return el.getValue();
        else
            return '';
    },
    setQty: function(val) {
        var el = this.trdForm.down('#quantity');
        if (el) {
            if (N2N_CONFIG.orderRoundQty) {
                val = formatutils.formatNumber(val);
            }
            
            el.setValue(val);
        }
        
    },
    getQty: function () {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#quantity');
        if (el)
            return el.getValue();
        else
            return '';
    },
    setPrc: function (val) {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#price');
        if (el)
            el.setValue(val);
    },
    setTPType: function (val) {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#tptype');
        if (el)
            el.setValue(val);
    },
    getTPType: function () {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#tptype');
        if (el)
            return el.getValue();
        else
            return '';
    },
    setTPDirection: function (val) {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#tpdirection');
        if (el)
            el.setValue(val);
    },
    getTPDirection: function () {
        var input = this.trdForm.down('#inPanel');
        var el = input.down('#tpdirection');
        if (el)
            return el.getValue();
        else
            return '';
    },
    disableCmp: function (comp) {
        try {
            if (!comp)
                return;

            if (comp.disableCmp === false || comp.disableCmp == undefined) {
                comp.setReadOnly(true);
                var bgcolor = "background-color: #A3A09E;";
                if (global_personalizationTheme.indexOf("wh") != -1) {
                    bgcolor = "background-color: #505050;";
                }
                comp.setFieldStyle('background-image: none;cursor:pointer;' + bgcolor);
                comp.disableCmp = true;
            }
        } catch (e) {
            console.log('[OrderPad][disableCmp] Exception ---> ' + e);
        }
    },
    enableCmp: function (comp) {
        if (!comp)
            return;
        if (comp.disableCmp === true) {
            if (!this.checkCompForceDisable(comp.id)) {
                try {
                    comp.setReadOnly(false);
                    comp.disableCmp = false;
                    if (comp.getItemId() != "skipconfirm") {
                        comp.setFieldStyle('background:white');
                    }
                    comp.setFieldStyle('cursor:auto');
                } catch (e) {
                    console.log('[OrderPad][enableCmp] Exception ---> ' + e);
                }
            }

        }
    },
    checkCompForceDisable: function (id) {
        var panel = this;

        // bug - v1.3.14.9
        var processFunction = function (value) {
            var returnValue = "FALSE";
            for (var ii = 0; ii < value.length; ii++) {
                if (value[ii].indexOf(panel.exchangecode) != -1) {
                    var result = value[ii].split(":");
                    if (result[1] == "0")
                        returnValue = "TRUE";
                    else
                        returnValue = "FALSE";
                }
            }
            return returnValue;
        };


        /*		
         * 		** original is retrieve from at propertise file,
         * 		** for new version is retrieve from propertise file and split into list to set up the value
         * 		
         * 		StopLimit | MinQty | DisclosedQty | Sett.Curr | Payment
         * 
         * forceDisableStopLimit 		= stop limit
         * forceDisableMinQty			= min qty
         * forceDisableDisclosedQty		= disclosed qty
         * forceDisableSettCurr			= sett curr
         * forceDisablePayment			= payment
         */

        var temp = global_orderPadSetting.split("|");

        for (var i = 0; i < temp.length; i++) {
            if (i == 0) {		// for stop limit
                forceDisableStopLimit = processFunction(temp[i].split(";"));
            } else if (i == 1) {
                forceDisableMinQty = processFunction(temp[i].split(";"));
            } else if (i == 2) {
                forceDisableDisclosedQty = processFunction(temp[i].split(";"));
            } else if (i == 3) {
                forceDisableSettCurr = processFunction(temp[i].split(";"));
            } else if (i == 4) {
                forceDisablePayment = processFunction(temp[i].split(";"));
            }
        }

        var input = panel.trdForm.down('#inPanel');
        if (forceDisableStopLimit == "TRUE" && id == "stoplimit") {
            panel.disableCmp(input.down('#stoplimit'));
            panel.setStopLimit('');
            return true;
        }

        if (forceDisableMinQty == "TRUE" && id == "minqty") {
            panel.disableCmp(input.down('#minqty'));
            panel.setMinQty('');
            return true;
        }

        if (forceDisableDisclosedQty == "TRUE" && id == "dsqty") {
            panel.disableCmp(input.down('#dsqty'));
            panel.setDsQty('');
            return true;
        }

        if (forceDisableSettCurr == "TRUE" && id == "settcurr") {
            panel.disableCmp(input.down('#settcurr'));
            return true;
        }

        if (forceDisablePayment == "TRUE" && id == "payment") {
            panel.disableCmp(input.down('#payment'));
            return true;
        }

        return false;
    },
    getExCode: function () {
        if (this.stkcode && getStkExCode(this.stkcode))
            return getStkExCode(this.stkcode);
        else if (this.exchangecode)
            return this.exchangecode;
        else if (exchangecode)
            return exchangecode;
        else
            return '';

    },
    getUnitTxt: function () {
        if (this.getExCode() == 'MY')
            return 'contract(s)';
        else
            return 'unit(s)';
    },
    getQtyTxt: function () {
        if (this.getExCode() == 'MY')
            return languageFormat.getLanguage(20851, 'Contract');
//        else if (this.getExCode() == 'PH')
//            return languageFormat.getLanguage(20852, 'Units');
        else {
            return languageFormat.getLanguage(20836, 'Qty');
        }

    },
    getDefPayment: function () {	// base currency (setting on properties)
        return defPayment;
    },
    getDefLotSize: function () {
        if (this.getExCode() == 'KL') {
            return 100;
        } else if (this.getExCode() == 'MY') {
            return 1;
        } else if (this.getExCode() == 'SG') {
            return 1;
        } else {
            return '';
        }
    },
    getDefSettCurr: function () {	// base currency (setting on properties)
        return defCurrency;
    },
    chkPrc: function () {
        var stk = stockutil.getStockPart(this.stkcode);
        var instrument = this.instrument;
        if (stk && instrument) {
            if (stk != instrument)
                return false;
        }
        return true;
    },
//    nextPage: function() {
//    	var store = this.dataView.getStore();
//    	var total = store.getTotalCount();
//    	
//    	var cursor = this.paging.cursor;
//    	var size = this.paging.pageSize;
//    	
//    	this.page = cursor/size;
//    	var islastpage = cursor >=(total-size);
//    	if (!islastpage) {
//    		this.paging.moveNext();
//    	}
//    },
//    previousPage: function() {
//    	var store = this.dataView.getStore();
//    	var total = store.getTotalCount();
//    	
//    	var cursor = this.paging.cursor;
//    	var size = this.paging.pageSize;
//    	
//    	this.page = cursor/size;
//    	if (this.page > 0) {
//    		this.paging.movePrevious();
//    	}
//    },
//    hidePaging: function() {
//    	var tbar = this.getTopToolbar();
//    	tbar.getComponent('op_prev').hide();
//		tbar.getComponent('op_next').hide();
//    },
//    showPaging: function() {
//    	var tbar = this.getTopToolbar();
//    	tbar.getComponent('op_prev').show();
//		tbar.getComponent('op_next').show();
//    },
    getExchangeType: function (ex) {	// from stockcode to get Stock Exchange
        if (ex != undefined && ex != null) {
            if (ex.length == 1) {
                return ex;
            } else {
                var tmpEx = ex;
                var tmpExL = tmpEx.length;
                var tmpType = tmpEx.substring(tmpExL - 1);
                var tmpFilter = tmpEx.substring(0, tmpExL - 1);

                if (tmpType.toUpperCase() == "D") {
                    return tmpFilter;
                }

                return ex;
            }
        } else {
            return '';
        }
    },
    removeExchange: function (info) {
        if (info != undefined && info != null) {
            var tmp = info.split(".");
            var infoMsg = '';
            for (var j = 0; j < tmp.length - 1; j++) {
                infoMsg += tmp[j];
            }

            return infoMsg;
        } else {
            return '';
        }
    },
    checkArrayDuplicate: function (arr, value) {
        // in combo array distinct if duplicate
        for (var j = 0; j < arr.length; j++) {
            var tmp = arr[j];
            var len = tmp.length;
            for (var i = 0; i < len; i++) {
                var arrValue = tmp[i];

                if (arrValue == value) {
                    return true;
                }
            }
        }

        return false;
    },
    //1.3.24.5 Check IsHidePin function
    checkIsHidePin: function () {
        var isHidePin = false;
        var clientCategory = cliCategory; //get from main.jsp
        var skipPinCategory = this.getSkipPinCategory(global_skipPin);
        for (var i = 0; i < skipPinCategory.length; i++) {
            if (clientCategory == skipPinCategory[i])
                isHidePin = true;
        }
        return isHidePin;
    },
    //1.3.24.5 getSkipPinCategory and split it
    getSkipPinCategory: function (skipCategary) {
        var x = skipCategary.split(',');
        return x;
    },
    /**
     * Description <br/>
     * 
     * open alert to user key in OTP value to validation 
     * 
     */
    _openOTPwindow: function () {
        var panel = this;

        var oriDeviceList = tradeOTPDeviceList;  // verify from main.jsp

        var deviceList = [];
        if (oriDeviceList != null) {
            var temp = oriDeviceList.split(",");
            for (var i = 0; i < temp.length; i++) {
                var value = temp[i];
                if (value != "") {
                    deviceList.push([value, value]);
                }
            }
        }

        panel.tComboOTPDevice = new Ext.form.ComboBox({
            fieldLabel: "Device",
            labelStyle: 'width:50px;',
            width: 200,
            store: new Ext.data.ArrayStore({
                fields: ['value', 'displayText'],
                data: deviceList
            }),
            typeAhead: true,
            triggerAction: 'all',
            mode: 'local',
            valueField: 'value',
            displayField: 'displayText',
            editable: false
        });

        panel.tFieldOTPPin = new Ext.form.TextField({
            fieldLabel: 'Pin',
            labelStyle: 'width:50px;',
            width: 200,
            //inputType	: 'password',
            emptyText: 'Key in password to validation'
        });

        var formPanel = new Ext.form.Panel({
            layout: 'form',
            bodyStyle: 'padding:20px',
            items: [
                panel.tComboOTPDevice,
                panel.tFieldOTPPin
            ]
        });


        panel.OTPwindow = new Ext.Window({
            title: "OTP Validation",
            width: 400,
            height: 150,
            plain: true,
            layout: 'fit',
            items: formPanel,
            resizable: false,
            bbar: {
                enableOverflow: menuOverflow,
                items: [
                    '->',
                    new Ext.button.Button({
                        text: 'Submit',
                        handler: function () {
                            panel._submitOTPWindow();
                        }
                    }),
                    '-',
                    new Ext.button.Button({
                        text: 'Cancel',
                        handler: function () {
                            panel.OTPwindow.destroy();
                        }
                    })
                ]
            },
            listeners: {
                destroy: function () {
                    /*
                     * mainPanel = from main.js 
                     */
                    mainPanel.setDisabled(false);
                    panel.OTPwindow = null;
                },
                show: function () {
                    /*
                     * mainPanel = from main.js 
                     */

                    if (mainPanel.loadMask != null) {
                        mainPanel.loadMask.hide();
                        mainPanel.loadMask = null;
                    }
                    mainPanel.setDisabled(true);
                },
                hide: function () {
                    /*
                     * mainPanel = from main.js 
                     */
                    mainPanel.loadMask = new Ext.LoadMask({
                        msg: 'Loading...',
                        target: Ext.get(mainPanel)
                    });
                    mainPanel.loadMask.show();
                },
                titlechange: function () {
                    /*
                     * mainPanel = from main.js 
                     */
                    if (mainPanel.loadMask != null) {
                        mainPanel.loadMask.hide();
                    }
                }
            }
        }).show();
    },
    /**
     * Description <br/>
     * 
     * 	submit OTP validation
     */
    _submitOTPWindow: function () {
        var panel = this;

        panel.OTPwindow.hide();

        var tempUrl = [];
        tempUrl.push(addPath + 'tcplus/otpvalidation?');
        tempUrl.push("deviceItem=");
        tempUrl.push(panel.tComboOTPDevice.getValue());
        tempUrl.push("&pin=");
        tempUrl.push(panel.tFieldOTPPin.getValue());

        var url = tempUrl.join('');
        Ext.Ajax.request({
            url: url,
            method: 'GET',
            success: function (response) {
                try {
                    var obj = Ext.decode(response.responseText);
                    if (obj.s) {
                        tradeOTPDevice = panel.tComboOTPDevice.getValue();	// verify from main.jsp
                        tradeOTPPassword = panel.tFieldOTPPin.getValue(); 	// verify from main.jsp 
                        panel.OTPwindow.setTitle(panel.OTPwindow.title + " : " + obj.s);
                        msgutil.info("Success to log in.", function () {
                            panel.OTPwindow.destroy();
                        });
                    } else {
                        panel.OTPwindow.setTitle(panel.OTPwindow.title + " : " + obj.s);
                        msgutil.alert(obj.msg, function () {
                            panel.OTPwindow.show();
                        });
                    }
                } catch (e) {
                    console.log('[OrderPad][_submitOTPWindow] Exception ---> ' + e);
                }
            },
            failure: function (response) {
            }
        });
    },
    /**
     * Description <br/>
     * 
     * 		return lotsize value by exchange
     * 
     *  return {integer} lotsize 
     */
    _getLotSize: function (value) {
        var panel = this;

        var lotSize = value;
        if (global_orderPadUnitTrading != null) {

            if (global_orderPadUnitTrading != "") {
                var tempList = global_orderPadUnitTrading.split(",");

                for (var i = 0; i < tempList.length; i++) {
                    if (panel.getExCode().indexOf(tempList[i]) != -1) {
                        lotSize = 1;
                    }
                }
            }
        }

        return lotSize;
    },
    _repositionMsgBox: function (mbox) {
        var dlgBox = mbox.getDialog();
        // Gets current position of this order pad
        var ordPos = this.getPosition();
        // New postion: above and middle of order pad
        var posX = ordPos[0] + (this.getWidth() - dlgBox.getWidth()) / 2;
        var posY = ordPos[1] - dlgBox.getHeight();

        dlgBox.setPosition(posX, posY);
    },
    getCurrencyRate: function () {

        var panel = this;
        var currencyRateList = atpCurrencyRate.obj;
        var buyRate = 0;
        var sellRate = 0;
        var denomination = 0;
        var isCurrencyRate = false;

        if (currencyRateList.size > 0) {
            for (var i = 0; i < currencyRateList.size; i++) {
                var inListCurrency = currencyRateList.d[i].currate[0];

                if (inListCurrency == panel.currency) {

                    buyRate = currencyRateList.d[i].currate[3];
                    sellRate = currencyRateList.d[i].currate[4];
                    denomination = currencyRateList.d[i].currate[5];
                    isCurrencyRate = true;

                    break;
                }
            }
        }

        return buyRate + '|' + sellRate + '|' + denomination + '|' + isCurrencyRate;
    },
    getAccountBalance: function (accObj) {

        var panel = this;
        var accountBalance = '';
        var displayLimitType = '';
        var accno = panel.getAccountNo();

        if (!accObj) {
            if (accRet) {
                var accList = accRet.ai;
                for (var i = 0; i < accList.length; i++) {
                    var acc = accList[i];
                    if (acc.ac && accno == acc.ac) {
                        var al = '';

                        if (global_displayCreditType.toLowerCase() == "bs") {
                            displayLimitType = 'cashLimit'; // cash limit (buy sell limit)

                        } else if (global_displayCreditType.toLowerCase() == "mix") {

                            if (acc.cliType) {

                                if (acc.cliType.toLowerCase() == 'm') {
                                    displayLimitType = 'netCashLimit'; // net cash limit

                                } else {
                                    displayLimitType = 'cashLimit'; // cash limit (buy sell limit)
                                }

                            } else {
                                displayLimitType = 'cashLimit'; // cash limit (buy sell limit)
                            }

                        } else {
                            displayLimitType = 'creditLimit'; // cash limit (buy sell limit)
                        }


                        if (displayLimitType == 'creditLimit') {
                            al = panel.formatTradingLimitDecimal(acc.al);

                        } else if (displayLimitType == 'cashLimit') {

                            if (panel.mode == modeOrdBuy) {
                                al = panel.formatTradingLimitDecimal(acc.bl);

                            } else if (panel.mode == modeOrdSell) {
                                al = panel.formatTradingLimitDecimal(acc.sl);

                            } else {

                                if (panel.prevAction.toLowerCase() == "buy") {
                                    al = panel.formatTradingLimitDecimal(acc.bl);

                                } else {
                                    al = panel.formatTradingLimitDecimal(acc.sl);

                                }
                            }

                        } else {
                            al = panel.formatTradingLimitDecimal(acc.ncl);
                        }

                        accountBalance = al;
                        break;
                    }
                }
            }
        } else {
            var al = '';

            if (global_displayCreditType.toLowerCase() == "bs") {
                displayLimitType = 'cashLimit'; // cash limit (buy sell limit)

            } else if (global_displayCreditType.toLowerCase() == "mix") {

                if (accObj.cliType) {

                    if (accObj.cliType.toLowerCase() == 'm') {
                        displayLimitType = 'netCashLimit'; // net cash limit

                    } else {
                        displayLimitType = 'cashLimit'; // cash limit (buy sell limit)
                    }

                } else {
                    displayLimitType = 'cashLimit'; // cash limit (buy sell limit)
                }

            } else {
                displayLimitType = 'creditLimit'; // cash limit (buy sell limit)
            }


            if (displayLimitType == 'creditLimit') {
                al = panel.formatTradingLimitDecimal(accObj.al);

            } else if (displayLimitType == 'cashLimit') {

                if (panel.mode == modeOrdBuy) {
                    al = panel.formatTradingLimitDecimal(accObj.bl);

                } else if (panel.mode == modeOrdSell) {
                    al = panel.formatTradingLimitDecimal(accObj.sl);

                } else {

                    if (panel.prevAction.toLowerCase() == "buy") {
                        al = panel.formatTradingLimitDecimal(accObj.bl);

                    } else {
                        al = panel.formatTradingLimitDecimal(accObj.sl);

                    }
                }

            } else {
                al = panel.formatTradingLimitDecimal(accObj.ncl);
            }

            accountBalance = al;
        }

        return accountBalance;
    },
    setResultMsg: function (msgTxt) {
        var panel = this;

        if (!isMobile) {
            panel.trdForm.down('#msgBox').update(msgTxt);
        } else {
            msgutil.info(msgTxt);
        }
    },
    advBasicComponent: function () {
        var panel = this;
        var basic = panel.isBasic;
        var ordPad = panel.trdForm.down('#OrdPad');
        var input = ordPad.down('#inPanel');

        var compo = [
            panel.trdForm.down("#otype"),
            input.down('#cbValidity')
        ];

        if (panel.fldCfg) {
            var cfg = panel.fldCfg;
            if (cfg.stoplimit)
                compo.push(input.down('#stoplimit'));
            if (cfg.minqty)
                compo.push(input.down('#minqty'));
            if (cfg.dsqty)
                compo.push(input.down('#dsqty'));
            if (cfg.payment)
                compo.push(input.down('#payment'));
            if (cfg.settcurr)
                compo.push(input.down('#settcurr'));
            if (cfg.strategy)
                compo.push(input.down('#strategy'));
            if (cfg.shortsell)
                compo.push(panel.trdForm.down('#shortsell'));
            if (cfg.forceord)
                compo.push(panel.trdForm.down("#forceorderPanel"));
            if (cfg.forcequeue)
                compo.push(panel.trdForm.down("#forcequeuePanel"));
            if (cfg.amalgamation)
                compo.push(panel.trdForm.down("#amalgamatePanel"));
            if (cfg.triggertype)
                compo.push(input.down('#tptype'));
            if (cfg.triggerdirection)
                compo.push(input.down('#tpdirection'));
            if (cfg.privateOrd)
                compo.push(panel.trdForm.down('#privateOrd'));
            if (sCFDMenu)
                compo.push(panel.trdForm.down('#cfdPanel'));
            
            if (cfg.privateOrd){
            	panel.trdForm.down('#privateOrd').setVisible(cfg.privateOrd);
            }else{
            	panel.trdForm.down('#privateOrd').setVisible(false);
            }

            if (panel.mode == modeOrdSell) {
                panel.trdForm.down('#shortsellPanel').setVisible(cfg.shortsell);
            } else {
                panel.trdForm.down('#shortsellPanel').setVisible(false);
            }
        }

        panel.suspendLayouts();
        for (var i = 0; i < compo.length; i++) {
            if (basic) {
                compo[i].hide();
                if (i == 0) {
                    //if (panel.btnBasic.isBasic) {
                    //panel.btnBasic.isBasic = false;
                    panel.btnBasic.setIcon(iconBtnAdv);
                    //}
                }
            } else {
                compo[i].show();
                if (i == 0) {
                    //if (!panel.btnBasic.isBasic) {
                    //panel.btnBasic.isBasic = true;
                    panel.btnBasic.setIcon(iconBtnBasic);
                    //}
                }
            }

        }
        panel.resumeLayouts();
        panel.doLayout();
    },
    initializeOrderPadDragZone: function (v) {
        var panel = this;
        
        if (enableOrdPadDD == 'TRUE') {
            v.dragZone = new Ext.dd.DragZone(v.getEl(), {
                ddGroup: panel.elDDGroup,
//  			On receipt of a mousedown event, see if it is within a draggable element.
//  			Return a drag data object if so. The data object can contain arbitrary application
//  			data, but it should also contain a DOM element in the ddel property to provide
//  			a proxy to drag.
                getDragData: function (e) {
                    var sourceEl = v.getEl();
                    if (sourceEl) {
                        v.focus(); // focus on component so that mousedown event for dragging doesnt't effect textfield editing
                        d = sourceEl.dom.cloneNode(true);
                        d.id = Ext.id();
                        return {
                            sourceEl: v,
                            repairXY: Ext.fly(sourceEl).getXY(),
                            ddel: d,
                            componentClone: v.cloneConfig()
                        };
                    }
                },
//  			Provide coordinates for the proxy to slide back to on failed drag.
//  			This is the original XY coordinates of the draggable element.
                getRepairXY: function () {
                    return this.dragData.repairXY;
                }
            });
        }
    },
    initializeOrderPadDropZone: function (g) {
        var panel = this;
        
        if (enableOrdPadDD == 'TRUE') {
            var panel = this;

            g.dropZone = new Ext.dd.DropZone(g.getEl(), {
                ddGroup: panel.elDDGroup,
//  			If the mouse is over a target node, return that node. This is
//  			provided as the "target" parameter in all "onNodeXXXX" node event handling functions
                getTargetFromEvent: function (e) {
                    return g;
                },
//  			On entry into a target node, highlight that node.
                onNodeEnter: function (target, dd, e, data) {
                },
//  			On exit from a target node, unhighlight that node.
                onNodeOut: function (target, dd, e, data) {
                },
//  			While over a target node, return the default drop allowed class which
//  			places a "tick" icon into the drag proxy.
                onNodeOver: function (target, dd, e, data) {
                    return Ext.dd.DropZone.prototype.dropAllowed;
                },
//  			On node drop, Remove dragged node and target node from panel. 
//  			Insert dragged node and target node to their specific index position.
                onNodeDrop: function (target, dd, e, data) {
                    var cookieOrdPadSetting = '';
                    var savedRow2ItemsPos = new Array();
                    var targetIndex = panel.inputRow2.items.indexOf(target);
                    var draggedIndex = panel.inputRow2.items.indexOf(data.sourceEl);

                    var draggedPanel = panel.inputRow2.remove(panel.inputRow2.getComponent(data.sourceEl.itemId), false);
                    var targetPanel = panel.inputRow2.remove(panel.inputRow2.getComponent(target.itemId), false);

                    if (draggedIndex > targetIndex) {
                        panel.inputRow2.insert(targetIndex, draggedPanel);
                        panel.inputRow2.insert(draggedIndex, targetPanel);
                    } else {
                        panel.inputRow2.insert(draggedIndex, targetPanel);
                        panel.inputRow2.insert(targetIndex, draggedPanel);
                    }

                    for (var i = 0; i < panel.inputRow2.items.length; i++) {
                        savedRow2ItemsPos.push(panel.inputRow2.items.items[i].itemId);
                    }

                    cookieOrdPadSetting = savedRow2ItemsPos.join('|');
                    cookies.createCookie('_OrdPadRowSettings_', cookieOrdPadSetting, 1800);

                    panel.inputRow2.doLayout();

                    panel.callStkInfo();

                    return true;
                }
            });
        }
    },
    _setCtSize: function() {
        var me = this;

        var pcomp = me.up();
        var isWin = pcomp.isXType('window');

        if (isWin && pcomp.getCollapsed()) {
            return;
        }
        
            me._runningSetCtSize = true;

        if (sCFDMenu) {
            if (me.compRef.cfdHeight == null) {
                me.compRef.cfdHeight = me.compRef.cfdCt.getHeight(); // cache cfdHeight
                // dirty hack here
                // in popup, the height returns 61 which is not valid (don't know why???)
                // the take profit/stop loss fieldset's height should be never more than 20 for the first time
                if (me.compRef.cfdHeight > 20) {
                    me.compRef.cfdHeight = 17;
                }
            }

                } else {
            me.compRef.cfdHeight = 0;
                }

        if (me.compRef.row4CntHeight == null) {
            me.compRef.row4CntHeight = me.trdForm.down('#row4Cnt').getHeight(); // cache row4CntHeight
                	}
        
        var winPadding = 12; // for top and bottom border
        if (isMobile) {
            winPadding = 0;
                }
        var bodyHeight = me.compRef.formHeight + me.compRef.cfdHeight + me.compRef.row4CntHeight;
                if (N2N_CONFIG.orderPadBasic && me.isBasic) {
            bodyHeight -= me.compRef.formDiffHeight;
                    }

        var winMinHeight = me.compRef.headerHeight + bodyHeight + winPadding;
        var winHeight = winMinHeight;

        me.compRef.mainCt.setHeight(bodyHeight);
        var nctHeight = bodyHeight - 33; // left some height for bottom line
                me.compRef.mainCt.down('#northCt').setHeight(nctHeight);

        if (!isMobile) {
                me.compRef.mainCt.down('#msgBox').setHeight(nctHeight - 7); // left some padding
            }

        if (isWin) {
            var appMainSize = n2nLayoutManager.getAppMain().getSize();
            if (winMinHeight > appMainSize.height) {
                if (!me.compRef.marketDepth.getCollapsed()) {
                    me.compRef.marketDepth.setHeight(50);
                    winHeight += 50;
                }
            } else {
                if (!me.compRef.marketDepth.getCollapsed()) {
                    me.compRef.marketDepth.setHeight(me.compRef.mdHeight);
                    winHeight += me.compRef.mdHeight;
                }
            }

            if (winHeight > appMainSize.height) {
                    winHeight = appMainSize.height;	
            	}

            pcomp.setHeight(winHeight);
            }

            me._runningSetCtSize = false;
    },
    setHelpTxt: function (orderType, act) {
        var panel = this;
        var helpTxt = '';

        if (act == modeOrdBuy) {
            if (orderType == 'StopLimit' || orderType == 'Stop') {
                helpTxt = '<br><i>To submit a Buy Stop order, Trigger Price should be > Trigger (LastTrade, BestBid, BestOffer).</i>';
            } else if (orderType == 'MarketIfTouched' || orderType == 'LimitIfTouched') {
                helpTxt = '<br><i>To submit a Buy If-Touch Order, Trigger Price should be < Trigger (LastTrade, BestBid, BestOffer).</i>';

            }
        } else if (act == modeOrdSell) {
            if (orderType == 'StopLimit' || orderType == 'Stop') {
                helpTxt = '<br><i>To submit a Sell Stop Order, Trigger Price should be < Trigger (LastTrade, BestBid, BestOffer).</i>';
            } else if (orderType == 'MarketIfTouched' || orderType == 'LimitIfTouched') {
                helpTxt = '<br><i>To submit a Sell If-Touch Order, Trigger Price should be > Trigger (LastTrade, BestBid, BestOffer).</i>';
            }
        } else if (act == modeOrdRevise) {
            if (panel.prevAction.toLowerCase() == "buy") {
                if (orderType == 'StopLimit' || orderType == 'Stop') {
                    helpTxt = '<br><i>To submit a Buy Stop order, Trigger Price should be > Trigger (LastTrade, BestBid, BestOffer).</i>';
                } else if (orderType == 'MarketIfTouched' || orderType == 'LimitIfTouched') {
                    helpTxt = '<br><i>To submit a Buy If-Touch Order, Trigger Price should be < Trigger (LastTrade, BestBid, BestOffer).</i>';
                }
            } else {
                if (orderType == 'StopLimit' || orderType == 'Stop') {
                    helpTxt = '<br><i>To submit a Sell Stop Order, Trigger Price should be < Trigger (LastTrade, BestBid, BestOffer).</i>';
                } else if (orderType == 'MarketIfTouched' || orderType == 'LimitIfTouched') {
                    helpTxt = '<br><i>To submit a Sell If-Touch Order, Trigger Price should be > Trigger (LastTrade, BestBid, BestOffer).</i>';
                }
            }
        }
        return helpTxt;
    },
    searchAccount: function (searchValue, selectMatch) {
        var panel = this;
        searchValue = searchValue.toLowerCase();

        panel.setLoading(true);
        var urlbuf = new Array();

        urlbuf.push(addPath + 'tcplus/atp/searchAcc?');
        urlbuf.push('ExtComp=OrderPad');
        urlbuf.push('&s=');
        urlbuf.push(new Date().getTime());

        urlbuf.push('&searchValue=' + searchValue);

        var url = urlbuf.join('');

        Ext.Ajax.request({
            url: url,
            method: 'POST',
            success: function (response) {
                var text = response.responseText;
                var obj = null;
                try {
                    obj = Ext.decode(text);
                } catch (e) {
                    console.log('[Search Account] Exception ---> ' + e);
                }

                if (obj && obj.s == true) {
                    if (!obj.ai) {
                        return;
                    }

                    panel.arAccList = [];
                    panel.accs = [];

                    var accInfo = obj.ai;
                    var totAcc = accInfo.length;
                    var allRec = ['', languageFormat.getLanguage(20900, 'Please select account...')];
                    panel.arAccList.push(allRec);
                    var matchKey;
                    for (var i = 0; i < totAcc; i++) {
                        var acc = accInfo[i];
                        var newobj = new Object();
                        newobj.ac = acc.ac;
                        newobj.cc = acc.cc;
                        var accValue = acc.ac + global_AccountSeparator + acc.bc;
                        var accText = acc.ac + ' - ' + acc.an + ' - ' + acc.bc;
                        if (!matchKey && accText.toLowerCase().indexOf(searchValue) > -1) {
                            matchKey = accValue;
                        }
                        var accRec = [accValue, accText];
                        panel.arAccList.push(accRec);
                        panel.accs.push(newobj);
                    }

                    panel.trdForm.down("#accountno").store.removeAll();
                    panel.trdForm.down("#accountno").store.loadData(panel.arAccList);
                    panel.trdForm.down("#accountno").setValue('');

                    panel.tempSearchAccList = accInfo;
                    //panel.tbSearchAccount.setValue('');
                    panel.setLoading(false);

                    if (selectMatch && matchKey) {
                        panel.trdForm.down("#accountno").select(matchKey); // better to use select() than setValue()
                        // Since select event is not fired from above line, so need to fire it manually
                        panel.trdForm.down("#accountno").fireEvent('select');
                    }
                }
            },
            failure: function (response) {
                console.log('[Search Account] failed ---> ' + response.responseText);
                panel.setLoading(false);
            }
        });
    },
    _getFirstMatch: function (list, searchKey) {
        if (!searchKey && !list)
            return null;

        searchKey = searchKey.toLowerCase();
        for (var i = 0; i < list.length; i++) {
            var accStr = list[i][1].toLowerCase();
            if (accStr.indexOf(searchKey) > -1) {
                return list[i][0];
            }
        }

        return null;
    },
    getPaymentOption: function () {
        var panel = this;
        var accno = panel.getAccountNo();
        var paymentOption = new Array();
        if (accRet) {
            var accList = accRet.ai;
            for (var i = 0; i < accList.length; i++) {
                var acc = accList[i];
                if (acc.ac && accno == acc.ac) {
                    for (var j = 0; j < panel.arPaymentConfigList.length; j++) {
                        if (panel.arPaymentConfigList[j].accType == acc.cliType) {
                            var tempPaymentOption = panel.arPaymentConfigList[j].paymentType;
                            if (tempPaymentOption) {
                                paymentOption = tempPaymentOption.split(',');
                            }
                            break;
                        } else if (panel.arPaymentConfigList[j].accType == 'Def') {
                            var tempPaymentOption = panel.arPaymentConfigList[j].paymentType;
                            if (tempPaymentOption) {
                                paymentOption = tempPaymentOption.split(',');
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }
        return paymentOption;
    },
    getSettPaymentOption: function () {
        var panel = this;
        var accno = panel.getAccountNo();
        var settCurrOption = new Array();
        if (accRet) {
            var accList = accRet.ai;
            for (var i = 0; i < accList.length; i++) {
                var acc = accList[i];
                if (acc.ac && accno == acc.ac) {
                    for (var j = 0; j < panel.arPaymentConfigList.length; j++) {
                        if (panel.arPaymentConfigList[j].accType == acc.cliType) {
                            var tempSettCurrOption = panel.arPaymentConfigList[j].settCurrType;
                            if (tempSettCurrOption) {
                                settCurrOption = tempSettCurrOption.split(',');
                            }
                            break;
                        } else if (panel.arPaymentConfigList[j].accType == 'Def') {
                            var tempSettCurrOption = panel.arPaymentConfigList[j].settCurrType;
                            if (tempSettCurrOption) {
                                settCurrOption = tempSettCurrOption.split(',');
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }

        return settCurrOption;
    },
    getPriceList: function(stkCode, exch, sector, price) {
        // console.log(stkCode, exch, sector, price);
        var me = this, bidList = [], askList = [];
        price = parseFloat(price); // to avoid invalid comparison (string vs. string)

        if (isNaN(price))
            return null;

        if (atpRule && atpRule.d) {
            var bidSize;
            // get bid size for specified exchange
            for (var i = 0; i < atpRule.d.length; i++) {
                if (atpRule.d[i].ex === exch) {
                    bidSize = atpRule.d[i].bidsize;
                    break;
    }
            }

            if (bidSize) {
                // console.log('bidSize', bidSize.length);

                // get bid value according to specified condition
                for (var i = 0; i < bidSize.length; i++) {
                    var bidRule = bidSize[i];

                    if (
                            (bidRule.sc === '-' || bidRule.sc === stkCode) && // any stock code or matched stock code
                            (bidRule.sec === '-1' || bidRule.sec === sector) && // any sector or matcthed sector
                            me.isMatchedPrice(price, bidRule.opfr, bidRule.frval) && // from operator
                            me.isMatchedPrice(price, bidRule.opto, bidRule.toval) // to operator
                            ) {

                        var bidInt = parseFloat(bidRule.bint);
                        var bNumDec = jsutil.getDecNum(me.buy);
                        var aNumDec = jsutil.getDecNum(me.sell);

                        // console.log('bidsize matched', bidRule);

                        if (bidInt > 0) {
                            // to allow negative list for MY exchange
                            var allowNeg = me.getExCode() === 'MY' && !me.chkPrc();

                            if (me.mode === modeOrdBuy) {
                                var popBid = parseFloat(me.sell);
                                askList.push(me.formatPrcDecimal(popBid, bNumDec));

                                for (var b = 1; b < global_priceListSize; b++) {
                                    popBid -= bidInt;

                                    var bidNum = me.formatPrcDecimal(popBid, bNumDec);
                                    if (bidNum > 0 || allowNeg) {
                                        bidList.push(bidNum);
                                    }
                                    // console.log('popBid', popBid);
                                }
                            } else if (me.mode === modeOrdSell) {
                                var popAsk = parseFloat(me.buy);
                                bidList.push(me.formatPrcDecimal(popAsk, aNumDec));

                                for (var a = 1; a < global_priceListSize; a++) {
                                    popAsk += bidInt;

                                    var askNum = me.formatPrcDecimal(popAsk, aNumDec);
                                    if (askNum > 0 || allowNeg) {
                                        askList.push(askNum);
                                    }
                                    // console.log('popAsk', popAsk);
                                }
                            }

                            break; // do only on the first match
                        }

                    }
                }
            }

        }

        return {
            bidList: bidList,
            askList: askList
        };
    },
    isMatchedPrice: function(price, operator, opValue) {
        // console.log(price, operator, opValue);
        var matched = false;

        switch (operator) {
            case '>':
                matched = price > opValue;
                break;
            case '>=':
                matched = price >= opValue;
                break;
            case '<':
                matched = price < opValue;
                break;
            case '<=':
                matched = price <= opValue;
                break;
            case '-':
                matched = true;
                break;
        }

        return matched;
    },
    getDecNum: function(num) {
        return (num.toString().split('.')[1] || []).length;
    },
    regeneratePriceList: function() {
        var panel = this;

        var prList = panel.getPriceList(panel.stkcode, panel.getExCode(), panel._sector, panel.price);

        if (prList) {
            var bidRec = prList.bidList;
            var askRec = prList.askList;

            panel.checkBidAsk(bidRec);
            panel.checkBidAsk(askRec);

            panel.bidRec = bidRec;
            panel.askRec = askRec;
        }
    },
    checkBidAsk: function(ba) {
        if (ba.length > 0) {
            for (var i = 0; i < ba.length; i++) {
                if (isMO(ba[i]) || isMP(ba[i])) {
                    ba.splice(i, 1);
                }
            }
        }
    },
    updateTitle: function(stkcode, stkname) {
        var panel = this;
        var pcomp = panel.findParentByType('window');

        if (pcomp) {
            var disStk = panel.stkname || stkname;
            var newTitle = '';
            if (disStk != null) {
                newTitle = languageFormat.getLanguage(30243, 'Order @ [PARAM0]', disStk);
            } else {
                newTitle = languageFormat.getLanguage(30214, 'Please select a symbol');
            }
            pcomp.setTitle(newTitle);
        }
    },
    _getExtInputCls: function() {
        return N2N_CONFIG.orderRoundQty ? 'Ext.form.field.Text' : 'Ext.form.field.Number';
    },
    _submitValueFn: function() {
        return function() {
            var qtyVal = this.getRawValue();
            if (N2N_CONFIG.orderRoundQty) {
                return jsutil.getNumFromRound(qtyVal);
            } else {
                return qtyVal;
            }
        };
    },
    _getBlurHandler: function() {
        var me = this;

        return function(thisTf) {
            if (N2N_CONFIG.orderRoundQty) {
                // convert rounding to normal value
                var val = thisTf.getRawValue();
                val = jsutil.getNumFromRound(val);

                if (val) {
                    var valLen = String(val).length;
                    if (valLen > me._maxQtyLength) {
                        msgutil.warn(languageFormat.getLanguage(30246, 'The maximum length for quantity is [PARAM0].', me._maxQtyLength));
                        val = String(val).substring(0, me._maxQtyLength);
                    }

                    // format number
                    val = formatutils.formatNumber(val);
                    thisTf.setRawValue(val);
                }
            }
        };

    },
    _removeDigitComma: function(thisTf) {
        if (N2N_CONFIG.orderRoundQty) {
            var val = thisTf.getRawValue();
            val = jsutil.getNumFromRound(val);
            if (val) {
                thisTf.setRawValue(val);
            }
        }

    }
});
