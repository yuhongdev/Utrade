/*
 * this  : Ext.panel.Panel
 * 
 * 
 * 
 * _procDesign			: {void} generate tab panel		
 * _procGridSummary		: {void} generate grid panel
 * _procPanelInfo		: {void} generate info panel
 * _procOtherComponent          : {void} generate other component, e.g. : button, combobox  
 * 
 * refresh			: {void} recall call function
 * 
 * _procCallInfo		: {void} process call portfolio info
 * _procCallSummary		: {void} process call summary record
 * _procCallAccBalance          : {void} process call account balance limit
 * 
 * updateFeedRecord		: {void} update stock info / data from feed 
 * _updateInfo			: {void} update portfolio info
 * _updateSummary		: {void} update grid panel record
 * _updateAccBal		: {void} update account balance and net cash limit
 * 
 * _resetInfo			: {void} reset all label component
 * _procOpenDetail		: {void} open portfolio detail
 * 
 */

Ext.define('TCPlus.view.portfolio.CFDHoldings', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.cfdHoldings',
    accNo: '', // for store user account
    accList: null, // for store user account list
    tTab_MainTab: null,
    tPanel_PanelInfo: null,
    tPanel_GridSummary: null,
    tComboBoxAccount: null,
    tComboBoxExchange: null,
    tButton_Refresh: null,
    tButton_Detail: null,
    tButton_Export: null,
    tLabel_ProfitLoss: null,
    tLabel_GLV: null,
    tLabel_InitialMargin: null,
    tLabel_OrderInQueue: null,
    tLabel_FreeEquity: null,
    tLabel_GrossExposure: null,
    tLabel_RealisedPL: null,
    tLabel_UnrealisedPL: null,
    tLabel_InitialMarginUsed: null,
    tLabel_Balance: null,
    tLoadMask: null,
    tbSearchAccount: null,
    searchAccountBtn: null,
    tooltip: null,
    columnHash: null,
    tempWidth: null,
    isImgBlink: false,
    value_SODBalance: 0,
    value_Multiplier: 1,
    value_ProfitLoss: 0,
    value_GLV: 0,
    value_InitialMargin: 0,
    value_OrderInQueue: 0,
    value_FreeEquity: 0,
    value_GrossExposure: 0,
    value_RealisedPL: 0,
    value_UnrealisedPL: 0,
    value_InitialMarginUsed: 0,
    tempStkPrice: 0,
    stockList: [],
    compRef: {}, // component references
    _summaryActivated: false,
    screenType: 'main',
    slcomp: "cfdh",
    type: 'cfdh',
    savingComp: true,
    _idPrefix: 'cfdh',
    convertCurrencyEnable: false,
    othersCurrencyRateList: null,
    currentCurrency: defCurrency, // verify from main.jsp
    contextMenu: null, // display context menu panel
    emptyResult: languageFormat.getLanguage(31001, 'Your portfolio is empty.'),
    filterExtOpt: '0',
    isFirstTime: true,
    initComponent: function () {
        var panel = this;

        panel._idPrefix = panel.getId();

        panel.procColumnWidth();
        
        if (atpOthersCurrencyRate) {
            if (atpOthersCurrencyRate.obj.size > 0) {	// this check ATP is provide the CurrencyRate? if yes will perform calculation else take default Currency only
                panel.convertCurrencyEnable = true;
                panel.othersCurrencyRateList = atpOthersCurrencyRate.obj;
            }
        }

        panel._procOtherComponent();

        var tbarItems = new Array();
        tbarItems.push(panel.tComboBoxAccount, ' ');
        tbarItems.push(panel.tComboBoxExchange, ' ');
        tbarItems.push(panel.tbSearchAccount);
        tbarItems.push(panel.searchAccountBtn);

        var lblBal = new Ext.form.Label({
            text: languageFormat.getLanguage(33100,'SOD Balance') + ': '
        });

        tbarItems.push('-');
        tbarItems.push(lblBal);
        tbarItems.push(' ');
        tbarItems.push(panel.tLabel_Balance);
        tbarItems.push('-');
        //tbarItems.push('-');
        
        tbarItems.push('->', panel.tButton_Refresh);

        panel.compRef.topBar = Ext.create('Ext.toolbar.Toolbar', {
            items: tbarItems,
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll
        });

        panel._procGridSummary();
        panel._procPanelInfo();
        panel._procDesign();

        var defaultConfig = {
            title: languageFormat.getLanguage(10749, 'CFD Holdings'),
            keyEnabled: N2N_CONFIG.keyEnabled,
            header: false,
            layout: 'fit',
            border: false,
            defaults: {
                bodyStyle: 'border: none;',
                style: 'padding: 0px; font-family: Helvetica,Verdana; font-weight: bold; font-size: 9pt;'
            },
            tbar: panel.compRef.topBar,
            items: [panel.tTab_MainTab],
            listeners: {
                afterrender: function (thisComp) {
                    panel.tLoadMask = thisComp.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
                },
                destroy: function (thisComp) {
                    Storage.generateUnsubscriptionByExtComp(panel);
                }
            }
        };
        
        panel.createContextMenu();

        Ext.apply(this, defaultConfig);
        this.callParent();
    },
    /**
     * Description <br/>
     * 
     * 		generate tab panel		
     * 
     */
    _procDesign: function () {
        var panel = this;

        panel.tTab_MainTab = new Ext.tab.Panel({
            border: false,
            items: [panel.tPanel_PanelInfo, panel.tPanel_GridSummary],
            listeners: {
                tabchange: function (thisComp, newCard, oldCard) {
                    /*
                     * Below issue has been resolved on 20140324 r4319
                     * Will remove in the future 
                     */
                    if (newCard.id == panel.tPanel_GridSummary.id) {
                        helper.runBuffer('cfdSumCol');
                        helper.runBuffer('cfdSumBuf');
                        helper.runBuffer('cfdHSFitScreen');
                        
                        if (!panel._summaryActivated) {
                            panel._summaryActivated = true;
                            panel.refresh();
                        }
                    }
                }
            }
        });
    },
    generateColumnsArray: function(colSettingList) {
        var panel = this;

        var newSetting = function(meta, value, record, type) {
            var cssClass = N2NCSS.CellDefault;

            if (type == "stockName") {
                cssClass += " " + N2NCSS.FontStockName;
                var tempCss = StockColor.stockByOrderBook(value, record, panel);

                if (tempCss == null)
                    cssClass += " " + N2NCSS.FontColorString;
                else
                    cssClass += " " + tempCss.css;

            } else if (type == "unchange") {
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontUnChange;
            } else if (type == "string") {
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontColorString;

            } else if (type == "change") {
                cssClass += " " + N2NCSS.FontString;

                if (parseFloat(value) > 0)
                    cssClass += " " + N2NCSS.FontUp;
                else if (parseFloat(value) < 0)
                    cssClass += " " + N2NCSS.FontDown;
                else
                    cssClass += " " + N2NCSS.FontUnChange;

            } else if (type == "numberyellow" && isNumberYellowColumn) {
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontUnChange_yellow;
            } else if (type == "avgbuyprc") {
                cssClass += " " + N2NCSS.FontString;

                //var tempLacp = record.data['RefPrc'];
                var tempLacp = isNaN(record.data.Last) || record.data.Last == "" || parseFloat(record.data.Last) == 0 ? record.data.RefPrc : record.data.Last;
                tempLacp = parseFloat(tempLacp);

                if (parseFloat(value) < tempLacp && parseFloat(value) != 0)
                    cssClass += " " + N2NCSS.FontUp;

                else if (parseFloat(value) > tempLacp)
                    cssClass += " " + N2NCSS.FontDown;

                else
                    cssClass += " " + N2NCSS.FontUnChange;

            } else {
                cssClass += " " + N2NCSS.FontString;

                var tempLacp = record.data['RefPrc'];
                tempLacp = parseFloat(tempLacp);

                if (parseFloat(value) == 0) {
                    cssClass += " " + N2NCSS.FontUnChange;

                } else {
                    if (parseFloat(value) > tempLacp)
                        cssClass += " " + N2NCSS.FontUp;

                    else if (parseFloat(value) < tempLacp && parseFloat(value) != 0)
                        cssClass += " " + N2NCSS.FontDown;

                    else
                        cssClass += " " + N2NCSS.FontUnChange;
                }

            }

            meta.css = cssClass;
        };

        var columnList = new Array();
        var prtf = panel._idPrefix;
        for (var i = 0; i < colSettingList.length; i++) {
            var colObj = colSettingList[i];
            var columnID = colObj.column;
            var columnVisible = !colObj.visible;

            switch (columnID) {
                case cmap_pfName:
                    columnList.push({
                        itemId: prtf + cmap_pfName,
                        header: languageFormat.getLanguage(10102, 'Symbol'),
                        dataIndex: 'StkName',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        locked: true,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, "stockName");

                            var index = value.lastIndexOf('.');
                            if (index != -1) {
                                value = value.substring(0, index);
                            }

                            return formatutils.procStringValue(value);
                        }});
                    break;
                case cmap_pfQtyOH:
                    columnList.push({
                        itemId: prtf + cmap_pfQtyOH,
                        header: languageFormat.getLanguage(10702, "Qty.Hand"),
                        tooltip: languageFormat.getLanguage(10732, "Quantity on hand"),
                        dataIndex: 'QtyOnHand',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, "numberyellow");

                            return panel.returnNumberFormat(value, panel.getWidth(cmap_pfQtyOH));
                        },
                        align: 'right'});
                    break;
                case cmap_pfQtyAvl:
                    columnList.push({
                        itemId: prtf + cmap_pfQtyAvl,
                        header: languageFormat.getLanguage(10703, "Qty.Avai"),
                        tooltip: languageFormat.getLanguage(10733, "Quantity available"),
                        dataIndex: 'QtyAvlb',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {

                            newSetting(meta, value, record, "numberyellow");

                            return panel.returnNumberFormat(value, panel.getWidth(cmap_pfQtyAvl));
                        },
                        align: 'right'});
                    break;
                case cmap_pfQtyQue:
                    columnList.push({
                        itemId: prtf + cmap_pfQtyQue,
                        header: languageFormat.getLanguage(10704, "Qty.Q(S)"),
                        tooltip: languageFormat.getLanguage(10734, "Quantity queue (sell)"),
                        dataIndex: 'QtySIP',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, "numberyellow");

                            return panel.returnNumberFormat(value, panel.getWidth(cmap_pfQtyQue));
                        },
                        align: 'right'});
                    break;
                case cmap_pfCode:
                    columnList.push({
                        itemId: prtf + cmap_pfCode,
                        header: languageFormat.getLanguage(10101, "Code"),
                        dataIndex: 'StkCode',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        locked: helper.getCodeLock(colSettingList, cmap_pfName),
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, "string");

                            return formatutils.procStringValue(value);
                        },
                        align: 'left'});
                    break;
                case cmap_pfAvgBPrc:
                    columnList.push({
                        itemId: prtf + cmap_pfAvgBPrc,
                        header: languageFormat.getLanguage(10705, "Avg.Buy.Prc"),
                        dataIndex: 'AvgPurPrc',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'avgbuyprc');
                            return panel.formatDecimal(value, decimalCtrl.prtf.avgbuyprice);
                        },
                        align: 'right'});
                    break;
                case cmap_pfLast:
                    columnList.push({
                        itemId: prtf + cmap_pfLast,
                        header: languageFormat.getLanguage(10113, "Last"),
                        dataIndex: 'Last',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            if (parseFloat(value) == 0) {
                                value = '-';
                            }
                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_pfMktVal:
                    columnList.push({
                        itemId: prtf + cmap_pfMktVal,
                        header: languageFormat.getLanguage(10706, "Mkt.Val"),
                        dataIndex: 'MktVal',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');

                            return panel.returnNumberFormat(value, panel.getWidth(cmap_pfMktVal));
                        },
                        align: 'right'});
                    break;
                case cmap_pfAccNo:
                    columnList.push({
                        itemId: prtf + cmap_pfAccNo,
                        header: languageFormat.getLanguage(10901, "Acc.No."),
                        dataIndex: 'AccNo',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, "string");

                            return formatutils.procStringValue(value);
                        },
                        align: 'right'});
                    break;
                case cmap_pfYrHigh:
                    columnList.push({
                        itemId: prtf + cmap_pfYrHigh,
                        header: languageFormat.getLanguage(10719, "Yr.High"),
                        dataIndex: 'YrHigh',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'change');

                            if (parseFloat(value) == 0 || value == null || value == '') {
                                value = "-";
                            }
                            else
                                value = panel.formatDecimal(value, 3);

                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_pfYrLow:
                    columnList.push({
                        itemId: prtf + cmap_pfYrLow,
                        header: languageFormat.getLanguage(10720, "Yr.Low"),
                        dataIndex: 'YrLow',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'change');

                            if (parseFloat(value) == 0 || value == null || value == '') {
                                value = "-";
                            }
                            else
                                value = panel.formatDecimal(value, 3);

                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_pfDayHigh:
                    columnList.push({
                        itemId: prtf + cmap_pfDayHigh,
                        header: languageFormat.getLanguage(10710, "Day.High"),
                        dataIndex: 'DayHigh',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'change');

                            if (parseFloat(value) == 0 || value == null || value == '') {
                                value = "-";
                            } else {
                                // value = panel.formatDecimal(value, 3);
                            }

                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_pfDayLow:
                    columnList.push({
                        itemId: prtf + cmap_pfDayLow,
                        header: languageFormat.getLanguage(10711, "Day.Low"),
                        dataIndex: 'DayLow',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'change');

                            if (parseFloat(value) == 0 || value == null || value == '') {
                                value = "-";
                            } else {
                                // value = panel.formatDecimal(value, 3);
                            }

                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_pfRef:
                    columnList.push({
                        itemId: prtf + cmap_pfRef,
                        header: languageFormat.getLanguage(10106, "LACP"),
                        dataIndex: 'RefPrc',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            if (parseFloat(value) == 0) {
                                value = '-';
                            }
                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_pfVol:
                    columnList.push({
                        itemId: prtf + cmap_pfVol,
                        header: languageFormat.getLanguage(10118, "Vol"),
                        dataIndex: 'Volume',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'numberyellow');
                            if (parseFloat(value) == 0) {
                                value = '-';
                            }
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_pfVol));
                        },
                        align: 'right'});
                    break;
                case cmap_pfLtSize:
                    columnList.push({
                        itemId: prtf + cmap_pfLtSize,
                        header: languageFormat.getLanguage(10712, "Lot.Size"),
                        dataIndex: 'LotSize',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'numberyellow');
                            return panel.returnNumberFormat(value);
                        },
                        align: 'right'});
                    break;
                case cmap_pfChg:
                    columnList.push({
                        itemId: prtf + cmap_pfChg,
                        header: languageFormat.getLanguage(10115, "Chg"),
                        dataIndex: 'ChgAmt',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'change');
                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_pfChgPc:
                    columnList.push({
                        itemId: prtf + cmap_pfChgPc,
                        header: languageFormat.getLanguage(10116, "Chg %"),
                        dataIndex: 'ChgPc',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'change');
                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_pfUnGL:
                    columnList.push({
                        itemId: prtf + cmap_pfUnGL,
                        header: languageFormat.getLanguage(10708, "Un.G/L"),
                        tooltip: languageFormat.getLanguage(10735, "Unrealised gain/loss"),
                        dataIndex: 'UrlGLAmt',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'change');

                            if (parseFloat(value) == 0) {
                                value = "-";
                            }

                            return panel.returnNumberFormat(value, panel.getWidth(cmap_pfUnGL));
                        },
                        align: 'right'});
                    break;
                case cmap_pfPL:
                    columnList.push({
                        itemId: prtf + cmap_pfPL,
                        header: languageFormat.getLanguage(10716, "Un.G/L %"),
                        tooltip: languageFormat.getLanguage(10737, "Unrealised gain/loss percent"),
                        dataIndex: 'UrlGLPc',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'change');

                            if (parseFloat(value) == 0) {
                                value = "-";
                            }

                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_pfCurrency:
                    columnList.push({
                        itemId: prtf + cmap_pfCurrency,
                        header: languageFormat.getLanguage(10132, "Currency"),
                        dataIndex: 'Currency',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'string');

                            return formatutils.procStringValue(value);
                        },
                        align: 'center'});
                    break;
                case cmap_pfExchg:
                    columnList.push({
                        itemId: prtf + cmap_pfExchg,
                        header: languageFormat.getLanguage(10126, "Exchg"),
                        dataIndex: 'ExchangeCode',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'string');

                            return formatutils.procStringValue(value);
                        },
                        align: 'center'});
                    break;
                case cmap_pfQtySold:
                    columnList.push({
                        itemId: prtf + cmap_pfQtySold,
                        header: languageFormat.getLanguage(10709, "Qty Sold"),
                        dataIndex: 'QtySold',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {

                            newSetting(meta, value, record, 'numberyellow');

                            return panel.returnNumberFormat(value, panel.getWidth(cmap_pfQtySold));
                        },
                        align: 'right'});
                    break;
                case cmap_pfQtySusp:
                    columnList.push({
                        itemId: prtf + cmap_pfQtySusp,
                        header: languageFormat.getLanguage(10718, "Qty.Susp"),
                        tooltip: languageFormat.getLanguage(10738, "Quantity suspended"),
                        dataIndex: 'QtySusp',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'numberyellow');

                            return panel.returnNumberFormat(value, panel.getWidth(cmap_pfQtySusp));
                        },
                        align: 'right'});
                    break;
                case cmap_pfavgsp:
                    columnList.push({
                        itemId: prtf + cmap_pfavgsp,
                        header: languageFormat.getLanguage(10715, "Avg.Sell.Price"),
                        dataIndex: 'avgsp',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return panel.returnNumberFormat(panel.formatDecimal(value, decimalCtrl.prtf.avgsellprice));
                        },
                        align: 'right'});
                    break;
                case cmap_pfBid:
                    columnList.push({
                        itemId: prtf + cmap_pfBid,
                        header: languageFormat.getLanguage(10110, "Bid"),
                        dataIndex: fieldBuy,
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            if (parseFloat(value) == 0 || value == null || value == '') {
                                value = "-";
                            }

                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_pfAsk:
                    columnList.push({
                        itemId: prtf + cmap_pfAsk,
                        header: languageFormat.getLanguage(10111, "Ask"),
                        dataIndex: fieldSell,
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            if (parseFloat(value) == 0 || value == null || value == '') {
                                value = "-";
                            }
                            return value;
                        },
                        align: 'right'});
                    break;

                case cmap_pfTradeValue:
                    columnList.push({
                        itemId: prtf + cmap_pfTradeValue,
                        header: languageFormat.getLanguage(10714, "Trade.Val"),
                        tooltip: languageFormat.getLanguage(10736, "Trade value"),
                        dataIndex: 'TradeValue',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        lockable: false,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');

                            return panel.returnNumberFormat(value, panel.getWidth(cmap_pfTradeValue));
                        },
                        align: 'right'});
                    break;
                case cmap_pfSettOpt:
                    columnList.push({
                        itemId: prtf + cmap_pfSettOpt,
                        header: languageFormat.getLanguage(10713, "Inv.Portfolio"),
                        dataIndex: 'SettOpt',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'string');

                            return formatutils.procStringValue(value);
                        },
                        align: 'right'});
                    break;
                case cmap_pfSoDVol:
                	columnList.push({
                		itemId: prtf + cmap_pfSoDVol,
                        header: languageFormat.getLanguage(10740, "SoDVol"),
                		dataIndex: 'SoDVol',
                		hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'string');

                            return formatutils.procStringValue(value);
                        },
                        align: 'right'
                	});
                	break;
                case cmap_pfSoDAvgPrc:
                	columnList.push({
                		itemId: prtf + cmap_pfSoDAvgPrc,
                        header: languageFormat.getLanguage(10741, "SoDAvgPrc"),
                		dataIndex: 'SoDAvgPrc',
                		hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'string');

                            return formatutils.procStringValue(value);
                        },
                        align: 'right'
                	});
                	break;
                case cmap_pfAvgPrcTod:
                	columnList.push({
                		itemId: prtf + cmap_pfAvgPrcTod,
                        header: languageFormat.getLanguage(10742, "AvgPrcTod"),
                		dataIndex: 'AvgPrcTod',
                		hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'string');

                            return formatutils.procStringValue(value);
                        },
                        align: 'right'
                	});
                	break;
                case cmap_pfClosePL:
                	columnList.push({
                		itemId: prtf + cmap_pfClosePL,
                        header: languageFormat.getLanguage(10743, "Closed P/L"),
                		dataIndex: 'closePL',
                		hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'string');

                            return formatutils.procStringValue(value);
                        },
                        align: 'right'
                	});
                	break;
                case cmap_pfOpenPL:
                	columnList.push({
                		itemId: prtf + cmap_pfOpenPL,
                        header: languageFormat.getLanguage(10744, "Open P/L"),
                		dataIndex: 'openPL',
                		hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'string');

                            return formatutils.procStringValue(value);
                        },
                        align: 'right'
                	});
                	break;
                case cmap_pfTotalPL:
                	columnList.push({
                		itemId: prtf + cmap_pfTotalPL,
                        header: languageFormat.getLanguage(10745, "Total P/L"),
                		dataIndex: 'totalPL',
                		hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'string');

                            return formatutils.procStringValue(value);
                        },
                        align: 'right'
                	});
                	break;
                case cmap_pfIMPerc:
                	columnList.push({
                		itemId: prtf + cmap_pfIMPerc,
                        header: languageFormat.getLanguage(10746, "InitialMargin%"),
                		dataIndex: fieldCFDMarginPerc_06,
                		hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'string');

                            return formatutils.procStringValue(value);
                        },
                        align: 'right'
                	});
                	break;
                case cmap_pfIM:
                	columnList.push({
                		itemId: prtf + cmap_pfIM,
                        header: languageFormat.getLanguage(10747, "InitialMargin"),
                		dataIndex: 'im',
                		hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'string');

                            return formatutils.procStringValue(value);
                        },
                        align: 'right'
                	});
                	break;
                case cmap_pfFXR:
                	columnList.push({
                		itemId: prtf + cmap_pfFXR,
                        header: languageFormat.getLanguage(10748, "FXRate"),
                		dataIndex: 'fxr',
                		hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        lockable: false,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'string');

                            return formatutils.procStringValue(value);
                        },
                        align: 'right'
                	});
                	break;
            }

        }
        return columnList;
    },
    generateColumn: function(newSetting) {
        var panel = this;

        return colutils.generateColumnArray(panel, newSetting);
    },
    /**
     * Description <br/>
     * 
     * 		generate grid panel
     * 
     */
    _procGridSummary: function () {
        var panel = this;
        
        helper.removeBufferedRun('cfdSumCol');
        var tempStorage = new Ext.data.Store({
            model: 'TCPlus.model.CFDPrtfRecord'
        });

        panel.tPanel_GridSummary = new Ext.grid.Panel({
            type: 'cfdh', // fixed syncing issue
            title: languageFormat.getLanguage(10750, 'Holding Summary'),
            store: tempStorage,
            columns: {
                defaults: {
                    //menuDisabled: true
                	tdCls:'display-render',
                	lockable: false
                },
                items: panel.generateColumnsArray(panel.generateColumn(""))
            },
            width: '100%',
            viewConfig: getGridViewConfig(panel.tPanel_GridSummary),
            bufferedRenderer: N2N_CONFIG.gridBufferedRenderer,
            leadingBufferZone: N2N_CONFIG.gridLeadingBufferZone,
            trailingBufferZone: N2N_CONFIG.gridTrailingBufferZone,
            columnmove: function(){
            	gridColHandler(panel.tPanel_GridSummary);
            },
            columnshow: function(){
            	gridColHandler(panel.tPanel_GridSummary);
            	helper.autoFitColumns(panel.tPanel_GridSummary);
            },
            columnhide: function(){
            	gridColHandler(panel.tPanel_GridSummary);
            	helper.autoFitColumns(panel.tPanel_GridSummary);
            },
            border: false,
            listeners: {
                cellclick: function(view, td, cidx, record, tr, ridx, evt) {
                    var accbranch = (cfdHoldingsPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[0].trim() + global_AccountSeparator + (cfdHoldingsPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[1].trim(); // #account list separator ('-')
                    cfdHoldingsPanel.accbranchNo = accbranch;
                    updateActivePanel(view, record, cidx);
                },
                celldblclick: function (view, td, cidx, record, tr, ridx, evt) {
                    var accbranch = (cfdHoldingsPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[0].trim() + global_AccountSeparator + (cfdHoldingsPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[1].trim(); // #account list separator ('-')
                    cfdHoldingsPanel.accbranchNo = accbranch;
                    // reset closing status
                    closedOrderPad = false;
                    updateActivePanel(view, record, cidx, true);
                },
                selectionchange: function (selModel, selected, evt) {
                    if (N2N_CONFIG.singleClickMode) {
                        if (selected.length > 0) {
                            var record = selected[0];
                            updateActivePanel(null, record, null);
                        }
                    }
                },
                columnresize: function (thisCt, thisCol, newWidth) {
                    if (newWidth === 0) {
                        thisCol.autoSize();
                        newWidth = thisCol.width;
                    }

                    panel.updateColWidthCache(thisCol, newWidth);
                    
                    if (N2N_CONFIG.autoQtyRound) {
                        helper.refreshView(panel.tPanel_GridSummary);
                    }
                },
                resize: function() {
                    bufferedResizeHandler(panel.tPanel_GridSummary);
                    panel.runFitScreen();
                },
                columnmove: function() {
                    panel.requestSaveColumns();
                },
                columnshow: function() {
                    panel.runFitScreen();
                    panel.requestSaveColumns();
                },
                columnhide: function() {
                    panel.runFitScreen();
                    panel.requestSaveColumns();
                },
                itemcontextmenu: function (thisView, record, item, index, e) {
                    if (!touchMode) {
                        panel.showContextMenu(thisView, record, index, e);
                    }
                }
            },
            tbar: [
                panel.tButton_Detail,
                panel.tButton_Export,
                '->',
                createAutoWidthButton(panel, 'tPanel_GridSummary')
                //createAutoFitButton(panel, 'tPanel_GridSummary')
            ],
            updateColWidthCache: function(column, newWidth) {
                panel.updateColWidthCache(column, newWidth);
            }
        });

        panel.mainScreenId = panel.tPanel_GridSummary.getId();
    },
    /**
     * Description <br/>
     * 
     * 		generate info panel
     * 
     */
    _procPanelInfo: function () { 
       var panel = this;

        var createLabel = function (name, isLabel, isHidden) {
            var tempLabel = new Ext.form.Label({
                text: name,
                hidden: isHidden
            });

            if (isLabel) {
                tempLabel.addCls(N2NCSS.stockInfoLabel_color);
            }

            return tempLabel;
        };

        panel.tLabel_ProfitLoss = createLabel("-", false, false);
        panel.tLabel_GLV = createLabel("-", false, false);
        panel.tLabel_InitialMargin = createLabel("-", false, false);
        panel.tLabel_OrderInQueue = createLabel("-", false, false);
        panel.tLabel_FreeEquity = createLabel("-", false, false);
        panel.tLabel_GrossExposure = createLabel("-", false, false);
        panel.tLabel_RealisedPL = createLabel("-", false, false);
        panel.tLabel_UnrealisedPL = createLabel("-", false, false);
        panel.tLabel_InitialMarginUsed = createLabel("-", false, false);

        var tempPanel_1 = new Ext.container.Container({
            layout: {
                type: 'table',
                columns: 2,
                tableAttrs: {
                    style: {
                        width: '100%'
                    },
                    cellspacing: '2'
                }
            },
            minWidth: 250,
            columnWidth: 0.33,
            border: false,
            items: [
                createLabel(languageFormat.getLanguage(21001, 'Profit/Loss'), true, false),
                panel.tLabel_ProfitLoss,
                createLabel(languageFormat.getLanguage(10751, 'GLV'), true, false),
                panel.tLabel_GLV,
                createLabel(languageFormat.getLanguage(20280, 'Initial Margin'), true, false),
                panel.tLabel_InitialMargin,
                createLabel(languageFormat.getLanguage(10752, 'Order in Queue'), true, false),
                panel.tLabel_OrderInQueue,
                createLabel(languageFormat.getLanguage(10753, 'Free Equity'), true, false),
                panel.tLabel_FreeEquity
            ]
        });

        var tempPanel_2 = new Ext.container.Container({
            layout: {
                type: 'table',
                columns: 2,
                tableAttrs: {
                    style: {
                        width: '100%'
                    },
                    cellspacing: '2'
                }
            },
            minWidth: 250,
            columnWidth: 0.33,
            border: false,
            items: [
                createLabel(languageFormat.getLanguage(10754, 'Gross Exposure'), true, false),
                panel.tLabel_GrossExposure,
                createLabel(languageFormat.getLanguage(10755, 'Realised Profit/Loss'), true, false),
                panel.tLabel_RealisedPL,
                createLabel(languageFormat.getLanguage(10756, 'Unrealised Profit/Loss'), true, false),
                panel.tLabel_UnrealisedPL,
                createLabel(languageFormat.getLanguage(10757, 'Initial Margin Used %'), true, false),
                panel.tLabel_InitialMarginUsed
            ]
        });

        panel.tPanel_PanelInfo = new Ext.container.Container({
            title: languageFormat.getLanguage(10758, 'Account Summary'),
            layout: {
                type: 'column'
            },
            border: false,
            items: [tempPanel_1, tempPanel_2],
            padding: 5,
            autoScroll: true,
            listeners: {
                afterrender: function (thisComp) {

                }
            }
        });

    },
    /**
     * Description <br/>
     * 
     * 		generate other component, e.g. : button, combo box  
     * 
     */
    _procOtherComponent: function () {
        var panel = this;

        panel.accList = new Array();
        if (accRet != null) { 				// verify from main.jsp
            var accInfo = accRet.ai;
            var total = accInfo.length;
            for (var i = 0; i < total; i++) {
                var acc = accInfo[i];
                if (acc.cliType == 'D') {
                    var accRec = [acc.ac + global_AccountSeparator + acc.bc, acc.ac + ' - ' + acc.an + " - " + acc.bc]; // #account list separator ('-')
                    panel.accList.push(accRec);
                }
            }
        }

        var accountStore = null;
        if(isDealerRemisier){
    		var urlbuf = new Array();

    		urlbuf.push(addPath + 'tcplus/atp/searchAcc?');
    		urlbuf.push('ExtComp=CFDHoldings');
    		urlbuf.push('&s=');
    		urlbuf.push(new Date().getTime());

    		var url = urlbuf.join('');

    		accountStore = Ext.create('Ext.data.Store', {
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
    			fields: ['accno', 'name'],
    			listeners:{
    				load:function(thisStore, records){
    					//delete panel.trdForm.down("#accountno").lastQuery;
    					if(records){
    						panel.accList = new Array();
    						
    						thisStore.filter(function(rec){
        						var cliType = rec.get('cliType');
        						
        						if(cliType == 'D'){
        							var accRec = [rec.get('ac') + global_AccountSeparator + rec.get('bc'), rec.get('ac') + ' - ' + rec.get('an') + ' - ' + rec.get('bc')];
            						panel.accList.push(accRec);
        						}
        						
        						return cliType == 'D';
        					});
    					}
    				}
    			}
    		});
    	}else{
    		accountStore = new Ext.data.ArrayStore({
    			fields: ['accno', 'name'],
    			data: panel.accList
    		});
    	}

        if (panel.accList.length > 0) {
            panel.accNo = panel.accList[0][0].split(global_AccountSeparator)[0].trim();
            panel.accbranchNo = panel.accList[0][0];
        } else {
            panel.accNo = '';
        }

        panel.tComboBoxAccount = new Ext.form.field.ComboBox({
            listConfig: {
                cls: 'my-combo-lst',
                minWidth: 150
            },
            width: 150,
            //hidden: isDealerRemisier,
            matchFieldWidth: false,
            selectOnFocus: true,
            forceSelection: !isDealerRemisier,
            queryMode: !isDealerRemisier ? 'local' : 'remote',
            store: accountStore,
            displayField: 'name',
            valueField: 'accno',
            emptyText: isDealerRemisier ? languageFormat.getLanguage(20876, 'Search account here.. min ' + N2N_CONFIG.constDRMinChars + ' chars', N2N_CONFIG.constDRMinChars) : languageFormat.getLanguage(20900, 'Please select account...'),
            triggerAction: 'all',
            value: (panel.accList.length > 0 ? panel.accList[0][0] : ''),
            minChars: 999, //set to large number to prevent query from being fired when typing
            pageSize: !isDealerRemisier ? 0 : N2N_CONFIG.constDRPagingSize,
            listeners: {
            	beforequery: function(qe) {
            		if (isDealerRemisier) {
            			//qe.combo.store.proxy.extraParams.query = qe.combo.getValue();
            			if (qe.query.length == 0) {
            				qe.cancel = true;
            			}
            		}
            	},
                select: function (thisCombo, records, eOpts) {
                    panel.accNo = configutil.getATPAccountParts(thisCombo.getValue())[0].trim();
                    panel.accbranchNo = thisCombo.getValue();
                    panel.refresh();
                },
                afterrender: function(combo, value){
                	if(isDealerRemisier){
                    	combo.getStore().on('load', function(thisStore, records) {
                    		if (records) {
                    			if(records.length == 1){
                    				combo.select(records);
                    				combo.collapse();
                    				
                    				var accountParts = combo.getValue().split(global_AccountSeparator);
                                    var thisAccount = accountParts[0].trim();
                                    var accbranch = thisAccount + global_AccountSeparator + accountParts[1].trim();

                                    panel.accNo = thisAccount;
                                    panel.accbranchNo = accbranch;
                    				panel._procCallSummary();
                    			}			  
                    		}
                    		
                    		panel._procCallAccBalance();
                		}); 
                    	
                    	combo.picker.pagingToolbar.down('#refresh').hide();
                    	combo.picker.pagingToolbar.down('#afterTextItem').hide();
                    	combo.picker.pagingToolbar.down('#inputItem').fieldStyle = 'background-color:inherit;color:inherit;'; 
                    	combo.picker.pagingToolbar.down('#inputItem').cls = 'pagingtoolbar'; 
                    	combo.picker.pagingToolbar.down('#first').hide();
                    	combo.picker.pagingToolbar.down('#last').hide();
                    	combo.picker.pagingToolbar.down('#next').prev().hide()
                    	combo.picker.pagingToolbar.down('#refresh').prev().hide()
                    	combo.picker.pagingToolbar.down('#prev').next().hide()
                    }
                },
                specialkey: function(thisCb, e) {
                	if (e.getKey() == e.ENTER) {
                		panel.runSearchAccount();
                	}
                } 
            }
        });
        
        var filterOptExList = [['0', languageFormat.getLanguage(20654, 'All Exchanges')]];
        for (var ii = 0; ii < global_ExchangeList.length; ii++) {
            if (global_ExchangeList[ ii ].exchange != 'MY') {
                filterOptExList.push([global_ExchangeList[ ii ].exchange, global_ExchangeList[ ii ].exchangeName]);
            }
        }

        var filterOptStore = new Ext.data.ArrayStore({
            fields: ['id', 'name'],
            data: filterOptExList
        });

        panel.tComboBoxExchange = new Ext.form.field.ComboBox({
            editable: false,
            width: UI.exchWidth,
            listConfig: {
                minWidth: UI.exchWidth
            },
            matchFieldWidth: UI.matchFieldWidth,
            queryMode: 'local',
            store: filterOptStore,
            displayField: 'name',
            valueField: 'id',
            triggerAction: 'all',
            value: Ext.isEmpty(this.filterExtOpt) ? '0' : this.filterExtOpt,
            listeners: {
                select: function(thisCombo, records, eOpts) {
                    Blinking.resetBlink(panel.tPanel_GridSummary);
                    panel.filterExtOpt = thisCombo.getValue();
                    panel.localSearch();
                    
                    // fix refresh account summary
                    // panel._procCallInfo();
                }
            }
        });

        panel.tbSearchAccount = new Ext.form.field.Text({
            autoCreate: {
                tag: 'input',
                type: 'text',
                size: '30',
                autocomplete: 'off'
            },
            width: 100,
            hidden: true,
            emptyText: languageFormat.getLanguage(10044, 'Search Account...'),
            selectOnFocus: true,
            listeners: {
                specialkey: function (field, e) {
                    // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                    // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
                    if (e.getKey() == e.ENTER) {
                        if (field.getValue().trim() == "") {//v1.3.34.11
                            field.setValue('');
                            msgutil.alert(languageFormat.getLanguage(10045, 'Please key in your search text.'), function () {
                                field.focus();
                            });
                        } else {
                            panel.searchAccount(field.getValue());
                        }
                    } else {
                        field = "";
                    }
                }
            }
        });

        panel.searchAccountBtn = new Ext.button.Button({
            itemId: 'btnSearchAcc',
            iconCls: "icon-center icon-search-account",
            iconAlign: 'top',
            padding: 0,
            margin: '0 5 0 0',
            hidden: !isDealerRemisier,
            style: 'background: transparent;',
            handler: function () {         
            	panel.runSearchAccount();
            }
        });

        panel.tButton_Export = new Ext.button.Button({
            text: languageFormat.getLanguage(10004, 'Export CSV'),
            tooltip: languageFormat.getLanguage(10004, 'Export CSV'),
            iconCls: 'icon-export',
            hidden: !isDesktop,
            handler: function () {
                ExportFile.initial(ExportFile.FILE_CSV, panel.tPanel_GridSummary);

            }
        });

        panel.tButton_Detail = Ext.create('Ext.button.Button', {
            text: languageFormat.getLanguage(20285, 'Detail'),
            tooltip: languageFormat.getLanguage(20285, 'Detail'),
            iconCls: 'icon-detail',
            hidden: (global_showPortFolioDerivativePortFolioDetail.toLowerCase() == 'true' ? false : true),
            handler: function () {
                panel.openDetailPanel();
            }
        });

        panel.tButton_Refresh = new Ext.button.Button({
            text: languageFormat.getLanguage(10008, 'Refresh'),
            tooltip: languageFormat.getLanguage(10008, 'Refresh'),
            iconCls: 'icon-reset',
            handler: function () {
                panel.refresh();
            }
        });

        panel.tLabel_Balance = new Ext.form.Label({
            text: '-'
        });
    },
    /**
     * Description <br/>
     * 
     * 		recall call function
     * 
     */
    refresh: function () {
        var panel = this;
        panel.tPanel_GridSummary.store.clearFilter();
        panel._procCallSummary();
    },
    switchRefresh: function (silent) {
        var panel = this;
        helper.runBufferedView(panel.tPanel_GridSummary, 'cfdSumBuf', function() {
            reactivateRow(panel.tPanel_GridSummary);
        });
        
        helper.runBuffer('cfdHSFitScreen');
        panel._getStockData(N2N_CONFIG.gridBufferedRenderer);
        Storage.generateSubscriptionByList(panel.stkcodes, panel);
    },
    /**
     * Description <br/>
     * 
     * 		process call portfolio info
     * 
     */
    _procCallInfo: function () {
        var panel = this;

        try {
        	panel._procCallAccBalance();
        	//panel._updateInfo();
        } catch (e) {
            console.log('[CFDHoldings][_procCallInfo] Exception ---> ' + e);
        }

    },
    /**
     * Description <br/>
     * 
     * 		process call summary record
     * 
     */
    _procCallSummary: function (silent) {
        var panel = this;

        var _account = panel.tComboBoxAccount.getValue();
        if (_account == null || _account == '') {
            panel.setLoading(false);
            return;
        }
        
        console.log('[CFDHoldings][_procCallSummary] start *** ');

        try {
            var accParts = configutil.getATPAccountParts(panel.tComboBoxAccount.getValue());

            var url = addPath + 'tcplus/atp/portfolio?';
            url += 't=1';
            url += '&category=cfd';
            url += '&ac=' + panel.accNo;

            if (accParts.length > 0) {
                url += '&bc=' + accParts[accParts.length - 1];
            }

            if (!silent && panel.tLoadMask != null) {
                panel.tLoadMask.show();
            }

            Ext.Ajax.request({
                url: url,
                method: 'GET',
                success: function (response) {

                    try {
                        var obj = Ext.decode(response.responseText);

                        if (obj.s) {
                            //panel._updateSummary(obj.pf);
                            panel.updatePortfolio(obj);
                            panel._getStockData();
                        } else {
                            if (N2N_CONFIG.activeSub) {
                                panel.firstLoad = false;
                                Storage.refresh();
                            }

                            console.log('[CFDHoldings][_procCallSummary] error ---> ' + obj.m);
                        }

                        console.log('[CFDHoldings][_procCallSummary] success *** ');

                    } catch (e) {
                        console.log('[CFDHoldings][_procCallSummary][inner] Exception ---> ' + e);
                    }

                    panel._procCallInfo();
                    panel.setLoading(false);
                },
                failure: function (response) {
                    console.log('[CFDHoldings][_procCallSummary][inner] failure ---> ' + response.responseText);

                    panel._procCallInfo();
                }
            });

        } catch (e) {
            console.log('[CFDHoldings][_procCallSummary] Exception ---> ' + e);
        }
    },
    /**
     * Description <br/>
     * 
     * 		process call account balance limit
     * 
     */
    _procCallAccBalance: function () {
        var panel = this;

        console.log('[CFDHoldings][_procCallAccBalance] start *** ');

        try {
            var accParts = configutil.getATPAccountParts(panel.tComboBoxAccount.getValue());

            var url = addPath + 'tcplus/atp/acc?';
            url += 's=' + new Date().getTime();
            url += '&ex=MY';

            if (accParts.length > 0) {
                url += '&ac=' + accParts[0].trim();
                url += '&bc=' + accParts[accParts.length - 1].trim();
            }

            Ext.Ajax.request({
                url: url,
                method: 'POST',
                timeout: 60000,
                success: function (response) {
                    var obj = null;
                    try {
                        obj = Ext.decode(response.responseText);

                        if (obj) {
                            if (obj.s) {
                                panel._updateAccBal(obj.ai);
                                panel._updateInfo();
                            }
                        }

                        console.log('[CFDHoldings][_procCallAccBalance] success *** ');
                    } catch (e) {
                        console.log('[CFDHoldings][_procCallAccBalance][inner] Exception ---> ' + e);
                    }
                },
                failure: function (response) {
                    console.log('[CFDHoldings][_procCallAccBalance][inner] failure ---> ' + e);
                }
            });

        } catch (e) {
            console.log('[CFDHoldings][_procCallAccBalance] Exception ---> ' + e);
        }

    },
    /**
     * Description <br/>
     * 
     * 		update stock info / data from feed 
     * 
     * @param {object} 	dataObj
     */
    updateFeedRecord: function (dataObj) {
        var panel = this;
        
        try {
            var isUpdateSumary = false;
            var panelStore = panel.tPanel_GridSummary.store;

            if (panelStore != null && panelStore.getCount() > 0) {
                var objStkCode = dataObj[fieldStkCode];

                if (objStkCode == null) {
                    return;
                }

                var record = null;
                var tempObjStkCode = formatutils.removeDelayExchangeChar(objStkCode); //shuwen 20130821 - handle delay feed
                var total = panelStore.getCount();
                if(loopPortfolioRecord == 'FALSE'){
                	total = 1;
                }
                var startIndex = 0;
                for(var i = 0; i < total; i ++){
                	var rowIndex = panelStore.find('StkCode', tempObjStkCode, startIndex); //shuwen 20130821 - handle delay feed
                	if (rowIndex != -1) {
                		record = panelStore.getAt(rowIndex);
                		startIndex = rowIndex + 1;
                	}else{
                		continue;
                	}

                	if (record != null) {
                		var gridColumns = helper.getGridColumns(panel.tPanel_GridSummary);

                		var tempArray = new Array();
                		tempArray.push({name: "RefPrc", value: dataObj[fieldLacp], type: 'price'});
                		tempArray.push({name: "LotSize", value: dataObj[fieldLotSize], type: 'number'});
                		tempArray.push({name: "Volume", value: dataObj[fieldVol], type: 'number'});
                		tempArray.push({name: "Last", value: dataObj[fieldLast], type: 'price'});
                		tempArray.push({name: fieldBuy, value: dataObj[fieldBuy], type: 'price'});
                		tempArray.push({name: fieldSell, value: dataObj[fieldSell], type: 'price'});
                		tempArray.push({name: "Prev", value: dataObj[fieldPrev], type: 'price'});
                        tempArray.push({name: "Open", value: dataObj[fieldOpen], type: 'price'});
                		tempArray.push({name: 'DayHigh', value: dataObj[fieldHigh], type: 'price'});
                		tempArray.push({name: 'DayLow', value: dataObj[fieldLow], type: 'price'});
                		tempArray.push({name: "ChgAmt", value: dataObj[fieldPrfChange], type: 'change'});
                		tempArray.push({name: "ChgPc", value: dataObj[fieldPrfChangePer], type: 'change'});
                		tempArray.push({name: fieldCFDMarginPerc_06, value: dataObj[fieldCFDMarginPerc_06], type: 'string'});
                		for (var ii = 0; ii < tempArray.length; ii++) {
                			var objs = tempArray[ii];
                			// get array data value
                			var newValue = objs.value;

                			if (newValue != null) {
                				// get record old data
                				var oldValue = record.data[objs.name];
                				if(objs.name == fieldCFDMarginPerc_06){
                					if(record.data.mrf){
                						record.data[objs.name] = newValue;
                					}else{
                						newValue = oldValue;
                					}
                				}else{
                					record.data[objs.name] = newValue;	
                				}
                				
                				var col = helper.getColumn(gridColumns, 'dataIndex', objs.name);

                				if (col != -1) {
                					var columnIndex = col.index;
                					var stringValue = newValue;

                					if (oldValue != newValue) {
                						if (objs.type == "none") {
                							panel.rePaintRecPriceColor(record, rowIndex); //TEST

                						} else if (objs.type == "number") {
                							var colWidth;
                							var cssClass = " " + N2NCSS.FontString;
                							if (objs.name == 'Volume') {
                								colWidth = panel.getWidth(cmap_pfVol);
                								cssClass += " " + N2NCSS.FontUnChange_yellow;
                							} else {
                								cssClass += " " + N2NCSS.FontUnChange;
                							}
                							stringValue = formatutils.formatNumber(stringValue, colWidth);


                							N2NUtil.updateCell(panel.tPanel_GridSummary, rowIndex, columnIndex, stringValue, cssClass);
                							Blinking.setBlink(panel.tPanel_GridSummary, rowIndex, columnIndex, "unchange");

                						} else if (objs.type == "change") {
                							var cssClass = " " + N2NCSS.FontString;
                							if (parseFloat(newValue) > 0)
                								cssClass += " " + N2NCSS.FontUp;
                							else if (parseFloat(newValue) < 0)
                								cssClass += " " + N2NCSS.FontDown;

                							N2NUtil.updateCell(panel.tPanel_GridSummary, rowIndex, columnIndex, newValue, cssClass);

                							if (parseFloat(newValue) > oldValue) {
                								Blinking.setBlink(panel.tPanel_GridSummary, rowIndex, columnIndex, "up");

                							} else if (parseFloat(newValue) < oldValue) {
                								Blinking.setBlink(panel.tPanel_GridSummary, rowIndex, columnIndex, "down");
                							}

                						} else {
                							if (!col.hidden) {

                								var priceObj = formatutils.procPriceValue(stringValue);
                								var cssClass = " " + N2NCSS.FontString;
                								if (!priceObj.validation) {
                									cssClass += " " + N2NCSS.FontUnChange;
                								} else {
                									if (parseFloat(priceObj.value) > parseFloat(dataObj[fieldLacp])) {
                										cssClass += " " + N2NCSS.FontUp;
                									} else if (parseFloat(priceObj.value) < parseFloat(dataObj[fieldLacp]) && parseFloat(priceObj.value) != 0) {
                										cssClass += " " + N2NCSS.FontDown;
                									} else {
                										cssClass += " " + N2NCSS.FontUnChange;
                									}
                								}
                								N2NUtil.updateCell(panel.tPanel_GridSummary, rowIndex, columnIndex, priceObj.value, cssClass);

                								if (newValue > oldValue) {
                									Blinking.setBlink(panel.tPanel_GridSummary, rowIndex, columnIndex, "up", true);

                								} else if (newValue < oldValue) {
                									Blinking.setBlink(panel.tPanel_GridSummary, rowIndex, columnIndex, "down", true);
                								}
                							}

                							if (objs.name == 'RefPrc') {
                								var avgPurPrcColumnIndex = helper.getColumn(gridColumns, 'dataIndex', 'AvgPurPrc').index;
                								var lastPrice = '';
                								if (dataObj[fieldLast] != null && parseFloat(dataObj[fieldLast]) != 0) {
                									lastPrice = dataObj[fieldLast];
                								} else if (dataObj[fieldLacp] != null && parseFloat(dataObj[fieldLacp]) != 0) {
                									lastPrice = dataObj[fieldLacp];
                								}
                								var blinkcss = '';
                								var fontcss = " " + N2NCSS.FontString;
                								if (parseFloat(record.data['AvgPurPrc']) > parseFloat(lastPrice)) {
                									fontcss += " " + N2NCSS.FontDown;
                									blinkcss = 'down';
                								} else if (parseFloat(record.data['AvgPurPrc']) < parseFloat(lastPrice) && parseFloat(record.data['AvgPurPrc']) != 0) {
                									fontcss += " " + N2NCSS.FontUp;
                									blinkcss = 'up';
                								} else {
                									fontcss += " " + N2NCSS.FontUnChange;
                									blinkcss = 'unchange';
                								}
                								N2NUtil.updateCell(panel.tPanel_GridSummary, rowIndex, avgPurPrcColumnIndex, record.data['AvgPurPrc'], fontcss);
                								Blinking.setBlink(panel.tPanel_GridSummary, rowIndex, avgPurPrcColumnIndex, blinkcss);
                							}
                						}
                					}
                				}
                			}
                		}

                		if (dataObj[fieldLacp] != null || dataObj[fieldLast] != null || dataObj[fieldCFDMarginPerc_06] != null || dataObj[fieldOpen] != null || dataObj[fieldPrev] != null) {
                			panel.updateCalInfo2(record, rowIndex);
                		}

                		var updateStatus = false;

                		var stockStatusCode = '';
                		if (dataObj[fieldStatus] != null) {
                			stockStatusCode = dataObj[fieldStatus].charAt(1);
                			var oriRSSIValue = dataObj[fieldStatus].charAt(0);

                			if (stockStatusCode != null && stockStatusCode != record.data[fieldStkStatus]) {
                				record.data[fieldStkStatus] = stockStatusCode;
                				updateStatus = true;
                			}
                			if (oriRSSIValue != null && oriRSSIValue != record.data[fieldRSSIndicator]) {
                				record.data[fieldRSSIndicator] = oriRSSIValue;
                			}
                		}

                		var stkStatusCode = dataObj[fieldStkStatus];
                		if (stkStatusCode != null && record.data[fieldStkStatus] !== stkStatusCode) {
                			record.data[fieldStkStatus] = stkStatusCode;
                			updateStatus = true;
                		}

                		var stockIndexCode = dataObj[fieldIndexCode];
                		if (stockIndexCode && record.data[fieldIndexCode] !== stockIndexCode) {
                			record.data[fieldIndexCode] = stockIndexCode;
                			updateStatus = true;
                		}
                		if (updateStatus) {
                			var lockedColumns = helper.getGridColumns(panel.tPanel_GridSummary, 'lock');
                			var stockNameIndex = helper.getColumnIndex(lockedColumns, 'itemId', panel._idPrefix + cmap_pfName);
                			if (stockNameIndex != -1) {
                				var tempData = record.data.StkName;
                				var idx = tempData.lastIndexOf('.');
                				if (idx >= 0)
                					tempData = tempData.substring(0, idx);

                				var cssClass = " " + N2NCSS.FontStockName;
                				var tempCss = StockColor.stockByOrderBook(tempData, record, panel);
                				if (tempCss == null) {
                					cssClass += " " + N2NCSS.FontUnChange;
                				} else {
                					cssClass += " " + tempCss.css;
                				}

                				N2NUtil.updateCell(panel.tPanel_GridSummary, rowIndex, stockNameIndex, tempData, cssClass, 'lock');
                			}
                		}
                	}
                }
            }

            //if (!panel.suspendSummary && isUpdateSumary) {
                panel._updateInfo();
           //}

        } catch (e) {
            console.log('[CFDHoldings][updateFeedRecord] Exception ---> ' + e);
        }

    },
    _getStockData: function () {
        var me = this;

        if (me.stkcodes && me.stkcodes.length > 0) {
            conn.getStockList({
                list: me.stkcodes,
                f: [fieldStkCode, fieldLacp, fieldCurrency, fieldLotSize, fieldVol, fieldLast, fieldPrev, fieldBuy, fieldSell, fieldHigh, fieldLow, fieldStatus, fieldIndexCode, fieldCFDMarginPerc_06, fieldOpen],
                p: 0,
                c: me.stkcodes.length,
                skipMDColCheck: true,
                success: function (res) {
                    if (res.d && res.d.length > 0) {
                        for (var i = 0; i < res.d.length; i++) {
                            var fd = _formatSingleVertxData({data: res.d[i]});
                            updater.updateQuote(fd);
                            var qd = _formatSingleVertxData(res, typeQuote, '666');
                            updater.updateQuote06(qd);
                        }
                    }
                }
            });
        }

    },
    /**
     * Description <br/>
     * 
     * 		update portfolio info
     * 
     * @param { array< object > }	 dataObj
     */
    _updateInfo: function () {
        var panel = this;
        var gridStore = panel.tPanel_GridSummary.getStore();
        
        panel.value_ProfitLoss = 0;
        panel.value_GLV = 0;
        panel.value_InitialMargin = 0;
        panel.value_FreeEquity = 0;
        panel.value_GrossExposure = 0;
        panel.value_RealisedPL = 0;
        panel.value_UnrealisedPL = 0;
        panel.value_InitialMarginUsed = 0;
        
        gridStore.each(function (record) {
        	var fxr = record.get('fxr') == null ? 0 : record.get('fxr');
        	var initialMargin = record.get('im') == null ? 0 : record.get('im');
        	var marketValue = record.get('MktVal') == null ? 0 : record.get('MktVal');
        	var closePL = record.get('closePL') == null ? 0 : record.get('closePL');
        	var openPL = record.get('openPL') == null ? 0 : record.get('openPL');
        
        	panel.value_InitialMargin += parseFloat(initialMargin * fxr);
        	panel.value_GrossExposure += parseFloat(Math.abs(marketValue) * fxr);
        	panel.value_RealisedPL += parseFloat(closePL * fxr);
        	panel.value_UnrealisedPL += parseFloat(openPL * fxr);
        	
        });

        panel.value_RealisedPL = panel.value_RealisedPL * panel.value_Multiplier;
        panel.value_UnrealisedPL = panel.value_UnrealisedPL * panel.value_Multiplier;
        
        panel.value_ProfitLoss = +panel.value_RealisedPL + +panel.value_UnrealisedPL;
        panel.value_GLV = panel.value_ProfitLoss + panel.value_SODBalance;
        panel.value_FreeEquity = panel.value_GLV - panel.value_InitialMargin - panel.value_OrderInQueue;
        
        if(panel.value_GLV == 0 || isNaN(panel.value_GLV)){
        	panel.value_InitialMarginUsed = 0;
        }else{
        	panel.value_InitialMarginUsed = panel.value_InitialMargin / panel.value_GLV;
        }
        
        helper.setHtml(panel.tLabel_ProfitLoss, panel._formatValue(panel.value_ProfitLoss.toFixed(2)));
        helper.setHtml(panel.tLabel_GLV, panel._formatValue(panel.value_GLV.toFixed(2)));
        helper.setHtml(panel.tLabel_InitialMargin, panel._formatValue(panel.value_InitialMargin.toFixed(2)));
        helper.setHtml(panel.tLabel_OrderInQueue, panel._formatValue(panel.value_OrderInQueue.toFixed(2)));
        helper.setHtml(panel.tLabel_FreeEquity, panel._formatValue(panel.value_FreeEquity.toFixed(2)));
        helper.setHtml(panel.tLabel_GrossExposure, panel._formatValue(panel.value_GrossExposure.toFixed(2)));
        helper.setHtml(panel.tLabel_RealisedPL, panel._formatValue(panel.value_RealisedPL.toFixed(2)));
        helper.setHtml(panel.tLabel_UnrealisedPL, panel._formatValue(panel.value_UnrealisedPL.toFixed(2)));
        helper.setHtml(panel.tLabel_InitialMarginUsed, panel._formatValue(panel.value_InitialMarginUsed.toFixed(2)));
            
    },
    /**
     * Description <br/>
     * 
     * 		update grid panel record
     * 
     * @param { array< object > }	 dataObj
     */
    _updateSummary: function (dataObj) {
        var panel = this;

        panel.stkcodes = [];

        for (var i = 0; i < dataObj.length; i++) {
            var record = dataObj[i];
            if (record) {
                if (record[fieldStkCode] != null) {
                    panel.stkcodes.push(record[fieldStkCode]);
                }
                if (!record.StkCode) {
                    // maps more fields
                    record.StkCode = record[fieldStkCode];
                    record.StkName = record[fieldStkName];
                }
            }

            dataObj[i] = record;
        }

        var temoObject = {};
        temoObject.s = true;
        temoObject.c = dataObj.length;
        temoObject.data = dataObj;
        
        resetGridScroll(panel.tPanel_GridSummary);
        panel.tPanel_GridSummary.store.loadData(temoObject.data);
        panel.tPanel_GridSummary.getSelectionModel().select(0);
        
        panel.runFitScreen();
        
        //activateRow(panel.tPanel_GridSummary);
        
        //n2ncomponents.activateEmptyScreens();
        
        Storage.generateUnsubscriptionByExtComp(panel, true);
        Storage.generateSubscriptionByList(panel.stkcodes, panel);

    },
    /**
     * Description <br/>
     * 
     * 		update account balance and net cash limit
     * 
     * @param { array< object > }	 dataObj
     */
    _updateAccBal: function (dataObj) {
        var panel = this;

        try {
            var BalanceLimit = 0;
            var orderInQueue = 0;
            var multiplier = 1;
            
            if (dataObj.length > 0) {
                if (dataObj[0] != null) {
                    if (dataObj[0].ac == panel.accNo) {
                        BalanceLimit = parseFloat(dataObj[0].ol);
                        orderInQueue = parseFloat(dataObj[0].oq);
                        multiplier = isNaN(parseFloat(dataObj[0].mp)) ? 1 : parseFloat(dataObj[0].mp);
                        panel.currentCurrency = dataObj[0].occ;
                    }

                    if (accRet) {
                        for (var i = 0; i < accRet.ai.length; i++) {
                            var tempAccInfo = accRet.ai[ i ];
                            if (tempAccInfo.ac == panel.accNo) {
                                if (tempAccInfo.bc == dataObj[0].bc) {
                                    accRet.ai[ i ] = dataObj[0];
                                }
                            }
                        }
                    }
                }
            }

            if (BalanceLimit) {
            	BalanceLimit = formatutils.getCFDCurrConversionValue(BalanceLimit, panel.currentCurrency);
            	
                BalanceLimit = BalanceLimit.toFixed(2);
                panel.value_SODBalance = parseFloat(BalanceLimit);
                panel.value_Multiplier = parseFloat(multiplier);
                panel.value_OrderInQueue = parseFloat(orderInQueue);
                panel.tLabel_Balance.setText(panel.currentCurrency + ' ' + panel._formatValue(BalanceLimit));
                helper.setHtml(panel.tLabel_OrderInQueue, panel._formatValue(orderInQueue.toFixed(2)));
            }

            panel.compRef.topBar.doLayout();

        } catch (e) {
            console.log('[CFDHoldings][updateAccBal] Exception ---> ' + e);
        }
    },
    /**
     * Description <br/>
     * 
     * 		reset all label component
     * 
     */
    _resetInfo: function () {
        var panel = this;

        panel.value_SODBalance = 0;
        panel.value_Multiplier = 1;
        panel.value_ProfitLoss = 0;
        panel.value_GLV = 0;
        panel.value_InitialMargin = 0;
        panel.value_OrderInQueue = 0;
        panel.value_FreeEquity = 0;
        panel.value_GrossExposure = 0;
        panel.value_RealisedPL = 0;
        panel.value_UnrealisedPL = 0;
        panel.value_InitialMarginUsed = 0;

        helper.setHtml(panel.tLabel_ProfitLoss, '-');
        helper.setHtml(panel.tLabel_GLV, '-');
        helper.setHtml(panel.tLabel_InitialMargin, '-');
        helper.setHtml(panel.tLabel_OrderInQueue, '-');
        helper.setHtml(panel.tLabel_FreeEquity, '-');
        helper.setHtml(panel.tLabel_GrossExposure, '-');
        helper.setHtml(panel.tLabel_RealisedPL, '-');
        helper.setHtml(panel.tLabel_UnrealisedPL, '-');
        helper.setHtml(panel.tLabel_InitialMarginUsed, '-');
    },
    /**
     * Description <br/>
     * 
     * 		open portfolio detail
     * 
     */
    _procOpenDetail: function () {
        var panel = this;

        var records = panel.tPanel_GridSummary.getSelectionModel().getSelection();

        if (records.length > 0) {
            var record = records[0];

            var conf = {
                key: record.get('43'),
                name: record.get('43'),
                config: {
                    accountName: panel.accNo,
                    stockCode: record.get('43'),
                    branchCode: record.get('52'),
                    bhClientCode: record.get('51'),
                    lastDone: panel.tempStkPrice //record.get('lastDone')
                }
            };
            n2ncomponents.createDerivativePrtfDetail(conf);
        }

    },
    _formatValue: function (value, columnWidth) {
        return formatutils.formatNumber(value, columnWidth);
    },
    searchAccount: function (searchValue, cmp) {
        var panel = this;
        try {            
            searchValue = searchValue.toLowerCase();
            
            if (searchValue) {
                panel.tComboBoxAccount.doQuery(searchValue, true);
            }      
        } catch (e) {
            console.log('[Search Account] Exception ---> ' + e);
            panel.setLoading(false);
            panel.newWindow.setLoading(false);
        }
    },
    autoAdjustWidth: function() {
        var panel = this;
        panel.procColumnWidth();
        
        helper.runBufferedView(panel.tPanel_GridSummary, 'cfdhSumCol', function() {
            panel.tPanel_GridSummary.reconfigure(null, panel.generateColumnsArray(panel.generateColumn("")));
        });
        panel.runAutoAdjustWidth = false;
    },
    updateColWidthCache: function(column, newWidth) {
        helper.updateColWidthCache(this, this.cookieKey, column, newWidth);
    },
    updatePortfolio: function(obj) {
        var panel = this;
        var gridColumns = helper.getGridColumns(panel.tPanel_GridSummary);

        if (obj.s) {
        	var dt = obj.pf;
        	var panelStore = panel.tPanel_GridSummary.getStore();

        	//if (panelStore.getCount() == 0) {
        	var tempDt = new Array();
        	var count = dt.length;

        	for (var i = 0; i < count; i++) {
        		var dataObject = dt[i];

        		if (panel.accNo && dataObject.an && dataObject.an != panel.accNo) {
        			continue;
        		}

        		var data = new Object();
        		data.PrtfNo = dataObject.pn;
        		data.StkCode = dataObject.sc;
        		data.StkName = dataObject.sy;
        		data.AccNo = dataObject.an;
        		data.YrHigh = dataObject.yh;
        		data.YrLow = dataObject.yl;
        		data.DayHigh = dataObject.dh;
        		data.DayLow = dataObject.dl;
        		data.RefPrc = parseFloat(dataObject.rp).toFixed(3);
        		data.Last = parseFloat(dataObject.lp).toFixed(3);
        		data.QtyOnHand = dataObject.qh;
        		data.QtyAvlb = dataObject.qa;
        		data.QtySIP = dataObject.qsip;
        		data.AvgPurPrc = dataObject.abp;
        		data.LotSize = dataObject.ls;
        		data.Currency = dataObject.cr;
        		data.QtySold = dataObject.qtys;
        		data.QtySusp = dataObject.qtysusp == "" ? 0 : dataObject.qtysusp;
        		data.avgsp = dataObject.avgsp;
        		data.SettOpt = dataObject.setO;
        		
        		var valuePrc = 0;
        		if (data.Last && data.Last != 0) {
                    valuePrc = data.Last;
                } else if (data.RefPrc && data.RefPrc != 0) { // lacp
                    valuePrc = data.RefPrc;
                }
        		
        		var avgPurPrc = dataObject.abp;
        		if(dataObject.qh < 0){
                	avgPurPrc = data.avgsp;
                }
        		
        		data.UrlGLAmt = panel.generateUrlGLAmt(valuePrc, avgPurPrc, dataObject.qh);
        		data.UrlGLPc = panel.generateUrlGLPerc(data.UrlGLAmt, avgPurPrc, dataObject.qh);
        		data.MktVal = panel.generateMktValue(valuePrc, dataObject.qh);
        		data.ChgAmt = parseFloat(0).toFixed(3);
        		data.ChgPc = parseFloat(0).toFixed(2);
        		data.Volume = 0;
        		data.TradeValue = panel.generateTradeValue(dataObject.qh, avgPurPrc);
        		data.BCode = dataObject.bc;
        		data.AccountName = dataObject.cliname1;

        		//cfd
        		data.SoDVol = dataObject.sodvol;
        		data.SoDAvgPrc = dataObject.sodavgprc;
        		data.AvgPrcTod = dataObject.avgprctod;
        		data.closePL = dataObject.realisedgl;
        		
        		var openpl = 0.00;
        		if(!isNaN(parseFloat(avgPurPrc)) && parseFloat(avgPurPrc) != 0){
        			openpl = panel.formatDecimal(parseFloat((valuePrc - avgPurPrc) * dataObject.qh), 2);
        		}
        		data.openPL = openpl;
        		
        		var totalpl = panel.formatDecimal(parseFloat(+data.openPL + +data.closePL), 2);
        		data.totalPL = totalpl;
        		
        		data[fieldCFDMarginPerc_06] = parseFloat(dataObject.mr) == '-1' ? parseFloat(0).toFixed(3) : parseFloat(dataObject.mr).toFixed(3);
        		if(N2N_CONFIG.showCFDDeltaFile){
        			data.mrf = true;
        		}else{
        			data.mrf = parseFloat(dataObject.mr) == '-1' ? true : false;
        		}
        		
        		var im = panel.formatDecimal(parseFloat(data.MktVal * (data[fieldCFDMarginPerc_06] / 100)), 2);
        		data.im = im;
        		data.fxr = parseFloat(1).toFixed(6);

        		if (panel.convertCurrencyEnable) {
        			var currencyRateList = panel.othersCurrencyRateList;
        			var n = currencyRateList.size;
        			var recCurrency = data.Currency;

        			for (var j = 0; j < n; j++) {
        				var prod = currencyRateList.d[j].p;
        				var currFrom = currencyRateList.d[j].currate[0];
        				var currTo = currencyRateList.d[j].currate[1];
        				if(prod == 'CFD'){
        					if (recCurrency == panel.currentCurrency) {
        						data.fxr = parseFloat(1).toFixed(6);
        					} else if (currFrom == recCurrency) {
        						// not same curreny and need convert
        						if(panel.currentCurrency == currTo){
        							var buyRate = currencyRateList.d[j].currate[3];
        							var denomiation = currencyRateList.d[j].currate[5];

        							data.fxr = buyRate;
        							break;
        						}
        					} 
        				}
        			}
        		}

        		var exCode = panel.getExchangeType(dataObject.sc);
        		data.ExchangeCode = exCode;

        		tempDt.push(data);

        		if (panel.stkcodes == null) {
        			panel.stkcodes = new Array();
        		}

        		var tempStkCode = formatutils.addDelaySuffix(dataObject.sc); //shuwen 20130821 - handle delay feed
        		if (!contains(panel.stkcodes, tempStkCode)) { //shuwen 20130821 - handle delay feed
        			panel.stkcodes.push(tempStkCode); //shuwen 20130821 - handle delay feed
        		}
        	}

        	panel.prtfList = tempDt;

        	var jsonObj = {
        			susccess: obj.s,
        			count: tempDt.length,
        			data: tempDt
        	};

        	resetGridScroll(panel.tPanel_GridSummary);
        	panel.tPanel_GridSummary.store.loadRawData(jsonObj);
        	panel.tPanel_GridSummary.getSelectionModel().select(0);
        	panel.localSearch();
        	//activateRow(panel.tPanel_GridSummary);

        	Storage.generateSubscriptionByList(panel.stkcodes, panel);

        	panel._updateInfo();
        } else {
            var msg = panel.emptyText;
            if (obj && obj.msg) {
                //msg = obj.msg;
            	msg = languageFormat.getLanguage(31001, 'Your portfolio is empty.');
            }
            //helper.setHtml(panel.getView(), '<div class="x-grid-empty">' + msg + '</div>');
            helper.setGridEmptyText(panel, msg);
        }

    },
    /**
     * Description <br/>
     * 
     * 		return all column id
     * 
     * @return string
     */
    allColumnSetting: function() {
        // filter column id
        return global_CFDAllColumn;
    },
    /**
     * Description <br/>
     * 
     * 		return default column id
     * 
     * @return string
     */
    defaultColumnSetting: function() {
        // filter column id
        return global_CFDDefaultColumn;
    },
    /**
     * Description <br/>
     * 
     * 		return current column setting id
     * 
     * @return string
     */
    currentColumnSetting: function() {
        var currentColumnId = layoutProfileManager.getCol('cfd');//CFDCol; // verify from main.jsp

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
    requiredColumnSetting: function() {
        return portfolioReqCol;
    },
    getWidth: function (columnID) {
        var panel = this;

        return panel.columnHash.get(columnID) || 100;
    },
    procColumnWidth: function() {
        var panel = this;

        panel.columnHash = new N2NHashtable();
        panel._setCookieId();

        var columnID = '';
        var columnWidth = '';
        var col = columnWidthSaveManager.getColWidth(panel.colWidthKey, panel.cookieKey); 

        if (col) {
            columnID = col[0];
            columnWidth = col[1];
        } else {
            columnID = global_CFDColumnID;
            columnWidth = global_CFDWidth;
        }

        var tempInfo = [columnID, columnWidth];
        var tempCookie = tempInfo.join(',');
        cookies.setTempStorage(panel, tempCookie);

        var IDArray = columnID.split('|');
        var widthArray = columnWidth.split('|');

        for (var x in IDArray) {
            (panel.columnHash).put(IDArray[x], parseInt(widthArray[x]));
        }
    },
    saveColumn: function(newColumnId) {
        var panel = this;

        //panel.reconfigure(null, panel.generateColumnsArray(panel.generateColumn(newColumnId)));
        helper.runBufferedView(panel.tPanel_GridSummary, 'cfdhSumCol', function() {
            panel.tPanel_GridSummary.reconfigure(null, panel.generateColumnsArray(panel.generateColumn(newColumnId)));
        });
        panel.requestSaveColumns(newColumnId);
    },
    requestSaveColumns: function(newColumnId) {
        var panel = this;

        Storage.generateSubscriptionByList(panel.stkcodes, panel);
        
        if(panel.tPanel_GridSummary){
        	if(!newColumnId){
        		var mappingCols = helper.getColMappingIDs(panel, helper.getGridAllColumns(panel.tPanel_GridSummary, true));
        		newColumnId = mappingCols.join('~');
        	}

        	newColumnId = newColumnId + "~" + colutils.ColumnVersion;
        	CFDCol = newColumnId;  // portfolioCol is from main.js
        	colutils.saveColumn('cfd', newColumnId);
        }

    },
    _setCookieId: function() {
        var me = this;
        me.cookieKey = columnWidthSaveManager.getCookieColKey('cfdHoldings');
        me.paramKey = N2N_CONFIG.constKey + 'CFD';
        me.colWidthKey = 'cfd';
    },
    generateUrlGLAmt: function(valuePrice, avgBuyPrice, qtyOnHand) {
        var decimalPlace = 2;
        var urlGtAmt = 0;

        if (qtyOnHand == 0 || qtyOnHand == null || valuePrice == 0) {
            urlGtAmt = 0;
        }
        else
            urlGtAmt = (valuePrice - avgBuyPrice) * qtyOnHand;

        if (decimalPlace > 0) {
            if (decimalPrtfFieldMeta != "" && decimalPrtf != "") {
                urlGtAmt = this.formatDecimal(parseFloat(urlGtAmt), decimalCtrl.prtf.unrealizedgl);
            } else {
                urlGtAmt = parseFloat(urlGtAmt).toFixed(decimalPlace);
            }
        }

        return urlGtAmt;
    },
    generateUrlGLPerc: function(urlglamt, avgBuyPrice, qtyOnHand) {
        var decimalPlace = 2;
        var urlGtPerc = '-';

        var tempValue = avgBuyPrice * qtyOnHand;

        if (tempValue != 0) {
            urlGtPerc = (urlglamt * 100) / (avgBuyPrice * qtyOnHand);

            if (decimalPlace > 0) {
                if (decimalPrtfFieldMeta != "" && decimalPrtf != "") {
                    urlGtPerc = this.formatDecimal(parseFloat(urlGtPerc), decimalCtrl.prtf.unrealizedglprc);
                } else {
                    urlGtPerc = parseFloat(urlGtPerc).toFixed(decimalPlace);
                }
            }
        }

        return urlGtPerc;
    },
    generateMktValue: function(valuePrice, qtyOnHand) {
        var decimalPlace = 2;
        var mktVal = 0;

        if (qtyOnHand == 0 || qtyOnHand == null) {
            urlGtAmt = 0;
        }
        else
            mktVal = valuePrice * qtyOnHand;

        if (decimalPlace > 0) {
            mktVal = parseFloat(mktVal).toFixed(decimalPlace);
        }
        return Math.abs(mktVal);
    },
    generateTradeValue: function(qtyOnHand, avgBuyPrice) {
        var decimalPlace = 2;
        var tradeVal = 0;

        if (avgBuyPrice != 0 || avgBuyPrice != null) {
            tradeVal = parseFloat(qtyOnHand * avgBuyPrice).toFixed(decimalPlace);
        }
        return tradeVal;
    },
    getExchangeType: function(stockcode) {	// from stockcode to get Stock Exchange
        if (stockcode != undefined && stockcode != null) {
            var tmpV = stockcode.split(".");
            var tmpType = tmpV[tmpV.length - 1];
            return tmpType;
        } else {
            return '';
        }
    },
    returnNumberFormat: function(value, columnWidth) {
        if (viewInLotMode) {
            value = formatutils.formatNumberLot(value);

        } else {
            value = formatutils.formatNumber(value, columnWidth);

        }

        return value;
    },
    updateCalInfo2: function(record, rowNumber) {
        var panel = this;
        var cssClass;

        if (record == null || rowNumber == null) {
            return;
        }

        var gridColumns = helper.getGridColumns(panel.tPanel_GridSummary);
        if (rowNumber != -1) {
            var valuePrc = 0;
            
            if (record.data.Last && record.data.Last != 0) {
                valuePrc = record.data.Last;
            } else if (record.data.RefPrc && record.data.RefPrc != 0) { // lacp
                valuePrc = record.data.RefPrc;
            } else if (record.data.Open && record.data.Open != 0) {
                valuePrc = record.data.Open;
            } else if (record.data.Prev && record.data.Prev != 0) {
                valuePrc = record.data.Prev;
            }

            if (!isNaN(valuePrc) && valuePrc > 0) {
                var avgPurPrc = record.data.AvgPurPrc;
                var qtyOnHand = record.data.QtyOnHand;
                
                if(qtyOnHand < 0){
                	avgPurPrc = record.data.avgsp;
                }

                if (!isNaN(avgPurPrc) && !isNaN(qtyOnHand)) {
                    var urlglamt = panel.generateUrlGLAmt(valuePrc, avgPurPrc, qtyOnHand);
                    var urlglamtColumn = helper.getColumn(gridColumns, 'dataIndex', "UrlGLAmt");

                    if (urlglamt != record.data.UrlGLAmt) {  // unrealized g/l
                        var oldurlglamt = record.data.UrlGLAmt;
                        record.data.UrlGLAmt = urlglamt;

                        if (urlglamtColumn != -1) {
                            var urlglamtColumnIndex = urlglamtColumn.index;
                            if (urlglamt != oldurlglamt && rowNumber != -1) {
                                cssClass += " " + N2NCSS.FontString;

                                if (parseFloat(urlglamt) > 0)
                                    cssClass += " " + N2NCSS.FontUp;
                                else if (parseFloat(urlglamt) < 0)
                                    cssClass += " " + N2NCSS.FontDown;
                                else
                                    cssClass += " " + N2NCSS.FontUnChange;

                                var urlglamtStr = panel.returnNumberFormat(urlglamt, panel.getWidth(cmap_pfUnGL));
                                N2NUtil.updateCell(panel.tPanel_GridSummary, rowNumber, urlglamtColumnIndex, urlglamtStr, cssClass, true);

                                if (!urlglamtColumn.hidden && panel._summaryActivated) {
                                    Blinking.setBlink(panel.tPanel_GridSummary, rowNumber, urlglamtColumnIndex, "unchange");

                                }
                            }
                        }
                    }

                    var urlglpc = 0;
                    var urlglpcColumn = helper.getColumn(gridColumns, 'dataIndex', "UrlGLPc");

                    if ((avgPurPrc * qtyOnHand) > 0) {
                        urlglpc = panel.generateUrlGLPerc(urlglamt, avgPurPrc, qtyOnHand);
                    }

                    var oldurlglpc = record.data.UrlGLPc;
                    record.data.UrlGLPc = urlglpc;

                    if (urlglpcColumn != -1) { // PL %
                        var urlglpcColumnIndex = urlglpcColumn.index;
                        if (urlglpc != oldurlglpc && rowNumber != -1) {
                            cssClass += " " + N2NCSS.FontString;

                            if (parseFloat(urlglpc) > 0)
                                cssClass += " " + N2NCSS.FontUp;
                            else if (parseFloat(urlglpc) < 0)
                                cssClass += " " + N2NCSS.FontDown;
                            else
                                cssClass += " " + N2NCSS.FontUnChange;

                            N2NUtil.updateCell(panel.tPanel_GridSummary, rowNumber, urlglpcColumnIndex, urlglpc, cssClass);

                            if (!urlglpcColumn.hidden && panel._summaryActivated) {
                                // Blinking.setBlink(panel, rowNumber, urlglpcColumnIndex, "unchange");
                            }
                        }
                    }
                }

                if (!isNaN(qtyOnHand)) {
                    var mktval = panel.generateMktValue(valuePrc, qtyOnHand);

                    if (mktval != null && mktval != record.data.MktVal) {
                        var oldmktval = record.data.MktVal;
                        record.data.MktVal = mktval;
                        var mktvalColumn = helper.getColumn(gridColumns, 'dataIndex', "MktVal");

                        if (mktvalColumn != -1) {
                            var mktvalColumnIndex = mktvalColumn.index;
                            if (mktval != oldmktval && rowNumber != -1) {

                                mktval = panel.returnNumberFormat(mktval, panel.getWidth(cmap_pfMktVal));
                                cssClass += " " + N2NCSS.FontUnChange;
                                N2NUtil.updateCell(panel.tPanel_GridSummary, rowNumber, mktvalColumnIndex, mktval, cssClass);

                                if (!mktvalColumn.hidden && panel._summaryActivated) {
                                    Blinking.setBlink(panel.tPanel_GridSummary, rowNumber, mktvalColumnIndex, "unchange");
                                }
                            }
                        }
                    }
                }
                
                var openpl = 0.00;
        		if(!isNaN(parseFloat(avgPurPrc)) && parseFloat(avgPurPrc) != 0){
        			openpl = panel.formatDecimal(parseFloat((valuePrc - avgPurPrc) * record.data.QtyOnHand), 2);
        		}
                if (!isNaN(openpl) && openpl != record.data.openPL) {
                    record.data.openPL = openpl;
                    var openPLColumn = helper.getColumn(gridColumns, 'dataIndex', "openPL");

                    if (openPLColumn != -1) {
                    	if (!openPLColumn.hidden) {
                    		var openPLColumnIndex = openPLColumn.index;
                    		if (rowNumber != -1 && panel._summaryActivated) {
                    			//openpl = formatutils.returnNumberFormat(openpl, panel.getWidth(cmap_pfOpenPL));
                    			cssClass += " " + N2NCSS.FontUnChange;
                    			N2NUtil.updateCell(panel.tPanel_GridSummary, rowNumber, openPLColumnIndex, openpl, cssClass);
                    			Blinking.setBlink(panel.tPanel_GridSummary, rowNumber, openPLColumnIndex, "unchange");
                    		}
                    	}
                    }
                }
                
                var totalpl = panel.formatDecimal(parseFloat(+record.data.openPL + +record.data.closePL), 2);
                if (!isNaN(totalpl) && totalpl != record.data.totalPL) {
                    record.data.totalPL = totalpl;
                    var totalPLColumn = helper.getColumn(gridColumns, 'dataIndex', "totalPL");

                    if (totalPLColumn != -1) {
                    	if (!totalPLColumn.hidden) {
                    		var totalPLColumnIndex = totalPLColumn.index;
                    		if (rowNumber != -1 && panel._summaryActivated) {
                    			//totalpl = formatutils.returnNumberFormat(openpl, panel.getWidth(cmap_pfTotalPL));
                    			cssClass += " " + N2NCSS.FontUnChange;
                    			N2NUtil.updateCell(panel.tPanel_GridSummary, rowNumber, totalPLColumnIndex, totalpl, cssClass);
                    			Blinking.setBlink(panel.tPanel_GridSummary, rowNumber, totalPLColumnIndex, "unchange");
                    		}
                    	}
                    }
                }
                
                var im = panel.formatDecimal(parseFloat(record.data.MktVal * (record.data[fieldCFDMarginPerc_06] / 100)), 2);
                if (!isNaN(im) && im != record.data.im) {
                    record.data.im = im;
                    var IMColumn = helper.getColumn(gridColumns, 'dataIndex', "im");

                    if (IMColumn != -1) {
                    	if (!IMColumn.hidden) {
                    		var IMColumnIndex = IMColumn.index;
                    		if (rowNumber != -1 && panel._summaryActivated) {
                    			//im = formatutils.returnNumberFormat(im, panel.getWidth(cmap_pfIM));
                    			cssClass += " " + N2NCSS.FontUnChange;
                    			N2NUtil.updateCell(panel.tPanel_GridSummary, rowNumber, IMColumnIndex, im, cssClass);
                    			Blinking.setBlink(panel.tPanel_GridSummary, rowNumber, IMColumnIndex, "unchange");
                    		}
                    	}
                    }
                }
            }
        }
    },
    formatDecimal: function(value, decimal) {

        var isNum = function(input) {

            return (input - 0) == input && (input + '').replace(/^\s+|\s+$/g, "").length > 0;
        };
        if (decimal) {
            if (isNum(value)) {
                value = parseFloat(value).toFixed(decimal);
            }
        }

        return value;
    },
    /**
     * Description <br/>
     * 
     *		display new panel for detail record
     * 
     */
    openDetailPanel: function() {
        var panel = this;

        var records = panel.tPanel_GridSummary.getSelectionModel().getSelection();

        if (records.length == 0) {
            return;
        }

        var record = records[0];
        var portFolioNo = record.data.PrtfNo;
        var AccountNo = record.data.AccNo;
        var BranchNo = record.data.BCode;
        var stockCode = record.data.StkCode;
        var stockName = record.data.StkName;
        var settOpt = record.data.SettOpt;

        // TODO: why need to create json string first then convert to object?
        var tempJsonString = new Array();
        tempJsonString.push("{");
        tempJsonString.push("stkCode:");
        tempJsonString.push("\"" + stockCode + "\"");
        tempJsonString.push(",");
        tempJsonString.push("accNo:");
        tempJsonString.push("\"" + AccountNo + "\"");
        tempJsonString.push(",");
        tempJsonString.push("branchNo:");
        tempJsonString.push("\"" + BranchNo + "\"");
        tempJsonString.push(",");
        tempJsonString.push("StkName:");
        tempJsonString.push("\"" + stockName + "\"");
        tempJsonString.push(",");
        tempJsonString.push("displayCategory:");
        tempJsonString.push("\"" + panel.displayCategory + "\"");
        tempJsonString.push(",");
        tempJsonString.push("settOpt:");
        tempJsonString.push("\"" + settOpt + "\"");
        tempJsonString.push("}");

        var newJson = null;
        try {
            newJson = Ext.decode(tempJsonString.join(""));
        } catch (e) {
            console.log('[CFDHoldings][openDetailPanel] Exception ---> ' + e);
        }
        panel.jsonString = newJson;

        n2ncomponents.createEquityPrtfDetail({
            key: portFolioNo,
            name: stockName,
            dataObj: newJson
        });

    },
    runSearchAccount: function(){
    	var panel = this;

    	if (panel.tComboBoxAccount.getRawValue().trim() == '') {
    		panel.tComboBoxAccount.setValue('');
    		msgutil.alert(languageFormat.getLanguage(10045, 'Please key in your search text.'), function () {
    			panel.tComboBoxAccount.focus();
    		});
    	} else if(panel.tComboBoxAccount.getRawValue().trim().length < N2N_CONFIG.constDRMinChars){
    		msgutil.alert(languageFormat.getLanguage(10051, 'The minimum value for this field is [PARAM0]', N2N_CONFIG.constDRMinChars));
    	} else {
    		panel.searchAccount(panel.tComboBoxAccount.getRawValue());
    	}
    },
    showContextMenu: function(grid, record, ridx, e) {
        var panel = this;
        e.stopEvent();

        grid.getSelectionModel().select(ridx);

        if (panel.contextMenu == null) {
            panel.createContextMenu();
        }

        var stkCode = record.get('StkCode');
        var stkName = record.get('StkName');
        var last = record.get('Last');
        var lacp = record.get('LACP');
        var refPrc = record.get('RefPrc');

        panel.contextMenu.stkCode = stkCode;
        panel.contextMenu.stkName = stkName;

        var ordRec = new Object();
        if (!isNaN(last)) {
            ordRec.price = last;
        } else {
            if (!isNaN(lacp)) {
                ordRec.price = lacp;
            } else {
                if (!isNaN(refPrc)) {
                    ordRec.price = refPrc;
                }
            }
        }

        panel.cMenuObject = ordRec;

        panel.disableRightFunction(panel.contextMenu.stkCode);
        panel.contextMenu.showAt(e.getXY());
    },
    disableRightFunction: function (stk) {
        var panel = this;

        var intradayChartBtn = panel.contextMenu.getComponent(panel.menuChartId);
        var ibBtn = panel.contextMenu.getComponent(panel.menuIBId);
        var stkEx = formatutils.getExchangeFromStockCode(stk);

        checkContextMenuItems(intradayChartBtn, ibBtn, stkEx);
    },
    createContextMenu: function() {
        if (showV1GUI == "TRUE") {
            this.menuBuyId = Ext.id();
            this.menuSellId = Ext.id();
            this.menuReviseId = Ext.id();
            this.menuCancelId = Ext.id();
            this.menuStkInfoId = Ext.id();
            this.menuDepthId = Ext.id();
            this.menuChartId = Ext.id();
            this.menuStkNewsId = Ext.id();
            this.menuOrdDetailId = Ext.id();
            var menu = this;
            var tbNews = {
                id: menu.menuStkNewsId,
                text: languageFormat.getLanguage(20123, 'Stock News')
            };
            var btns = [{
                    id: menu.menuBuyId,
                    text: languageFormat.getLanguage(10001, 'Buy')
                }, {
                    id: menu.menuSellId,
                    text: languageFormat.getLanguage(10002, 'Sell')
                }, {
                    id: menu.menuReviseId,
                    text: languageFormat.getLanguage(10009, 'Revise')
                }, {
                    id: menu.menuCancelId,
                    text: languageFormat.getLanguage(10010, 'Cancel')
                }, {
                    id: menu.menuDepthId,
                    text: languageFormat.getLanguage(20022, 'Market Depth')
                }, {
                    id: menu.menuStkInfoId,
                    text: languageFormat.getLanguage(20021, 'Stock Info')
                }, {
                    id: menu.menuChartId,
                    text: languageFormat.getLanguage(20101, 'Intraday Chart')
                }, {
                    id: menu.menuOrdDetailId,
                    text: languageFormat.getLanguage(20175, 'Order Detail')
                }];
            if (exchangecode == 'KL' || exchangecode == 'MY')
                btns.splice(7, 0, tbNews);

            this.contextMenu = new Ext.menu.Menu({
                stkCode: '',
                autoWidth: true,
                items: btns
            });
        } else {
            var menu = this;
            var btns = [];

            if (showBuySellHeader == "TRUE") {
                this.menuBuyId = Ext.id();
                btns.push({
                    id: menu.menuBuyId,
                    text: languageFormat.getLanguage(10001, 'Buy'),
                    popupOnly: true,
                    handler: function () {
                    	 var objRec = cfdHoldingsPanel.cMenuObject;
                         var accbranch = (cfdHoldingsPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[0].trim() + global_AccountSeparator + (cfdHoldingsPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[1].trim(); // #account list separator ('-')
                         cfdHoldingsPanel.accbranchNo = accbranch;
                         objRec.accbranchNo = accbranch;
                         closedOrderPad = false;
                         createOrderPad(cfdHoldingsPanel.contextMenu.stkCode, cfdHoldingsPanel.contextMenu.stkName, modeOrdBuy, objRec, true);
                    }
                });

                this.menuSellId = Ext.id();
                btns.push({
                    id: menu.menuSellId,
                    text: languageFormat.getLanguage(10002, 'Sell'),
                    popupOnly: true,
                    handler: function () {
                    	var objRec = cfdHoldingsPanel.cMenuObject;
                        var accbranch = (cfdHoldingsPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[0].trim() + global_AccountSeparator + (cfdHoldingsPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[1].trim(); // #account list separator ('-')
                        cfdHoldingsPanel.accbranchNo = accbranch;
                        objRec.accbranchNo = accbranch;
                        closedOrderPad = false;
                        createOrderPad(cfdHoldingsPanel.contextMenu.stkCode, cfdHoldingsPanel.contextMenu.stkName, modeOrdSell, objRec, true);
                    }
                });
            }

            if (showStkInfoHeader == "TRUE") {
                if (showStkInfoMarketDepth == "TRUE") {
                    this.menuDepthId = Ext.id();
                    btns.push({
                        id: menu.menuDepthId,
                        text: languageFormat.getLanguage(20022, 'Market Depth'),
                        handler: function () {
                            /**
                             * Apply Market Depth Logic, To Get selected StkCode get using
                             * marketMoverPanel.contextMenu.stkCode
                             */
                            closedMarketDepth = false;
                            createMarketDepthPanel(cfdHoldingsPanel.contextMenu.stkCode, cfdHoldingsPanel.contextMenu.stkName, true);

                        }
                    });
                }

                if (showStkInfoStkInfo == "TRUE") {
                    this.menuStkInfoId = Ext.id();
                    btns.push({
                        id: menu.menuStkInfoId,
                        text: languageFormat.getLanguage(20021, 'Stock Info'),
                        handler: function () {
                            createStkInfoPanel(cfdHoldingsPanel.contextMenu.stkCode, cfdHoldingsPanel.contextMenu.stkName, false);

                        }
                    });
                }

                if (showStkInfoTracker == "TRUE") {
                    this.menuStkTrackerId = Ext.id();
                    btns.push({
                        id: menu.menuStkTrackerId,
                        text: languageFormat.getLanguage(20024, 'Stock Tracker'),
                        handler: function () {
                            /**
                             * Apply Stock News Logic, To Get selected StkCode get using
                             * marketMoverPanel.contextMenu.stkCode
                             */
                            createTrackerPanel(cfdHoldingsPanel.contextMenu.stkCode, cfdHoldingsPanel.contextMenu.stkName, false);
                        }
                    });
                }

                if (showStkInfoEquitiesTracker == "TRUE") {
                    this.menuEqTrackerId = Ext.id();
                    btns.push({
                        id: menu.menuEqTrackerId,
                        text: languageFormat.getLanguage(20025, 'Equities Tracker'),
                        handler: function () {
                            n2ncomponents.createEquitiesTracker(cfdHoldingsPanel.contextMenu.stkCode);
                        }
                    });
                }

                if (N2N_CONFIG.features_HistoricalData) {
                    this.menuHisDataId = Ext.id();

                    btns.push({
                        id: this.menuHisDataId,
                        text: languageFormat.getLanguage(20060, 'Historical Data'),
                        handler: function () {
                            n2ncomponents.createHistoricalData(cfdHoldingsPanel.contextMenu.stkCode, cfdHoldingsPanel.contextMenu.stkName);
                        }
                    });
                }
            }

            if (showChartHeader == "TRUE") {
                if (showChartIntradayChart == "TRUE") {
                    this.menuChartId = Ext.id();
                    btns.push({
                        id: menu.menuChartId,
                        text: languageFormat.getLanguage(20101, 'Intraday Chart'),
                        handler: function () {
                            /**
                             * Apply Chart Logic, To Get selected StkCode get using
                             * marketMoverPanel.contextMenu.stkCode
                             */

                            createChartPanel(cfdHoldingsPanel.contextMenu.stkCode, cfdHoldingsPanel.contextMenu.stkName, false);
                        }
                    });
                }

                if (showChartAnalysisChart == "TRUE") {
                    this.menuAnalysisId = Ext.id();
                    btns.push({
                        id: menu.menuAnalysisId,
                        text: languageFormat.getLanguage(20102, 'Analysis Chart'),
                        handler: function () {
                            /**
                             * Apply Chart Logic, To Get selected StkCode get using
                             * marketMoverPanel.contextMenu.stkCode
                             */

                            createAnalysisChartPanel(cfdHoldingsPanel.contextMenu.stkCode, cfdHoldingsPanel.contextMenu.stkName, false);

                        }
                    });
                }
            }

            if (showNewsHeader == "TRUE") {
                if (showNewsStockNews == "TRUE") {
                    this.menuStkNewsId = Ext.id();
                    btns.push({
                        id: menu.menuStkNewsId,
                        text: languageFormat.getLanguage(20123, 'Stock News'),
                        handler: function () {
                            /**
                             * Apply Stock News Logic, To Get selected StkCode get using
                             * marketMoverPanel.contextMenu.stkCode
                             */
                            createStkNewsPanel(cfdHoldingsPanel.contextMenu.stkCode, cfdHoldingsPanel.contextMenu.stkName);
                        }
                    });
                }

                if (N2N_CONFIG.featuresNews_Archive) {
                    this.menuStkNewsArchiveId = Ext.id();
                    btns.push({
                        id: menu.menuStkNewsArchiveId,
                        text: languageFormat.getLanguage(20137, 'News Archive'),
                        handler: function () {
                            n2ncomponents.openArchiveNews({key: cfdHoldingsPanel.contextMenu.stkCode, name: cfdHoldingsPanel.contextMenu.stkName});
                        }
                    });
                }
                if (N2N_CONFIG.elasticNewsUrl) {
                    this.menuStkNewsElasticId = Ext.id();
                    btns.push({
                        id: menu.menuStkNewsElasticId,
                        text: languageFormat.getLanguage(20140, 'Elastic News'),
                        handler: function () {
                            n2ncomponents.openElasticNews({key: cfdHoldingsPanel.contextMenu.stkCode, name: cfdHoldingsPanel.contextMenu.stkName, newsOpt: '1'});
                        }
                    });
                }
                if (N2N_CONFIG.nikkeiNewsUrl) {
                    this.menuStkNewsNikkeiId = Ext.id();
                    btns.push({
                        id: menu.menuStkNewsNikkeiId,
                        text: languageFormat.getLanguage(21501, 'Nikkei News'),
                        handler: function () {
                            n2ncomponents.openElasticNews({key: cfdHoldingsPanel.contextMenu.stkCode, name: cfdHoldingsPanel.contextMenu.stkName, newsOpt: '1'});
                        }
                    });
                }

                if (N2N_CONFIG.featuresNews_FundamentalCPIQ) {
                    this.menuFundamentalCPIQId = Ext.id();
                    btns.push({
                        id: menu.menuFundamentalCPIQId,
                        text: languageFormat.getLanguage(20124, 'Fundamental (Capital IQ)'),
                        handler: function () {
                            createFundamentalCPIQWin(cfdHoldingsPanel.contextMenu.stkCode);
                        }
                    });
                }

                if (N2N_CONFIG.featuresNews_FundamentalThomsonReuters) {
                    this.menuFundamentalThomsonReutersId = Ext.id();
                    btns.push({
                        id: menu.menuFundamentalThomsonReutersId,
                        text: languageFormat.getLanguage(20126, 'Fundamental (Thomson Reuters)'),
                        handler: function () {
                            /**
                             * Show Fundamental Thomson Reuters news
                             * selected StkCode get using
                             * marketMoverPanel.contextMenu.stkCode
                             */
                            createFundamentalThomsonReutersWin(cfdHoldingsPanel.contextMenu.stkCode);
                        }
                    });
                }
            }

            if (showSettingHeader == "TRUE") {
                if (N2N_CONFIG.featuresSetting_AddStockAlert) {
                    this.menuAddStockAlertId = Ext.id();
                    btns.push({
                        id: menu.menuAddStockAlertId,
                        text: languageFormat.getLanguage(20603, 'Add Stock Alert'),
                        handler: function () {
                            /**
                             * Add Stock Alert
                             * selected StkCode get using
                             */
                            n2ncomponents.createAddStockAlert(cfdHoldingsPanel.contextMenu.stkCode);
                        }
                    });
                }
            }

            if (showWarrantsInfo == "TRUE") {
                this.menuWarrantsInfoId = Ext.id();
                btns.push({
                    id: menu.menuWarrantsInfoId,
                    text: languageFormat.getLanguage(20130, 'Warrants Info'),
                    handler: function () {
                        /**
                         * Show Warrants Info
                         * selected StkCode get using
                         * marketMoverPanel.contextMenu.stkCode
                         */
                        createWarrantsInfoWin(cfdHoldingsPanel.contextMenu.stkCode);
                    }
                });
            }
            
            if (settingSMSStockAlertURL.length > 0) {
                this.menuStockAlertId = Ext.id();
                btns.push({
                    id: menu.menuStockAlertId,
                    text: languageFormat.getLanguage(20602, 'Stock Alert'),
                    handler: function () {
                    	n2ncomponents.createSMSStockAlert(cfdHoldingsPanel.contextMenu.stkCode);
                    }
                });
            }
            
            if (N2N_CONFIG.pseEdgeURL.length > 0) {
                this.menuPSEEdgeId = Ext.id();
                btns.push({
                    id: menu.menuPSEEdgeId,
                    text: languageFormat.getLanguage(20139, 'PSE Edge'),
                    handler: function () {
                    	n2ncomponents.openPseEdge(cfdHoldingsPanel.contextMenu.stkCode);
                    }
                });
            }
            
            if (N2N_CONFIG.iBillionaireURL.length > 0) {
                this.menuIBId = Ext.id();
                btns.push({
                    id: menu.menuIBId,
                    text: languageFormat.getLanguage(20527, 'Follow iBillionaire'),
                    handler: function () {
                    	n2ncomponents.openIBillionaire(cfdHoldingsPanel.contextMenu.stkCode);
                    }
                });
            }

            this.contextMenu = new Ext.menu.Menu({
                stkCode: '',
                autoWidth: true,
                items: btns,
                listeners: addDDMenu()
            });

        }
    },
    localSearch: function () {
        // Local filter     
        var panel = this;
        Blinking.clearBlink(panel.tPanel_GridSummary);
        panel.tPanel_GridSummary.getStore().filterBy(function (record) {
            var blnFilterEx = true;

            // filter by exchange code
            if (panel.filterExtOpt == 0) {
                // show all
            } else {
                var tempExchangeCode = formatutils.removeDelayExchangeChar(panel.filterExtOpt);

                if (record.get('ExchangeCode').toUpperCase().indexOf(tempExchangeCode) != -1) {
                    blnFilterEx = true;
                } else {
                    blnFilterEx = false;
                }
            }

            return blnFilterEx;
        });

        if (panel.tPanel_GridSummary.getStore().getCount() == 0) {
            //helper.setHtml(panel.getView(), '<div class="x-grid-empty">' + panel.emptyResult + '</div>');
            helper.setGridEmptyText(panel.tPanel_GridSummary, panel.emptyResult);
        }
    },
    focusSearchBox: function() {
        focusManager.focusSearchbox(this.tComboBoxAccount);
    },
    runFitScreen: function() {
        var panel = this;

        if (!helper.inView(panel.tPanel_GridSummary)) {
            helper.addBufferedRun('cfdHSFitScreen', function() {
                helper.autoFitColumns(panel.tPanel_GridSummary);
            });
        } else {
            helper.autoFitColumns(panel.tPanel_GridSummary);
        }
    }
});
