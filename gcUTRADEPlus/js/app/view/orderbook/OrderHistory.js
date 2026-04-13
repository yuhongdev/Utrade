Ext.define('TCPlus.view.orderbook.OrderHistory', {
    requires: ['TCPlus.view.orderbook.OrderBookBase'],
    extend: 'TCPlus.view.orderbook.OrderBookBase',
    alias: 'widget.orderhistory',
    cbAccount: null,
    cbfilterOpt: null,
    border: false,
    stkcodes: null,
    sort: 'tktno',
    accNo: '',
    filterOpt: '0',
    filterExtOpt: '0',
    convertCurrencyEnable: false,
    currentCurrency: defCurrency,
    currencyRateList: null,
    columnmap: null,
    orderno: null,
    orders: null,
    accList: null,
    cbExchange: null,
    tbSearchAccount: null,
    searchAccountBtn: null,
    feedExchangeList: null,
    tLoadMask_grid: null,
    emptyText: languageFormat.getLanguage(30013, 'No result found.'),
    ordPriceDecimal: '',
    stopLimitDecimal: '',
    //v1.3.33.27 Save column setting
    tooltip: null,
    columnHash: null,
    tempWidth: null,
    isImgBlink: false,
    title: languageFormat.getLanguage(20173, 'Order History'),
    compRef: {},
    mappedCode: '03',
    mappedSymbol: '04',
    screenType: 'main',
    _idPrefix: 'ordHis',
    winConfig: {
        width: 850,
        height: 330
    },
    slcomp: "oh",
    type: 'oh',
    savingComp: true,
    initComponent: function () {

        if (atpCurrencyRate) {
            if (atpCurrencyRate.obj.size > 0) {	// this check ATP is provide the CurrecnyRate? if yes will perform calculation else take default Currency only
                this.convertCurrencyEnable = true;
                this.currencyRateList = atpCurrencyRate.obj;
            }
        }

        var panel = this;

        panel._idPrefix = panel.getId();

        if (setOrderBookDP.length > 0) {
            var decimalList = setOrderBookDP.split('|');
            panel.ordPriceDecimal = decimalList[0];
            panel.stopLimitDecimal = decimalList[1];
        }

        panel.procColumnWidth(); //v1.3.33.27

        //accRet json object
        this.accList = [];
        if (accRet != null) {
            var accInfo = accRet.ai;//account info like name,acc etc
            var totAcc = accInfo.length; // num of acc == size of ai array
            for (var i = 0; i < totAcc; i++) {
                var acc = accInfo[i]; //single obj in ai array
                var accRec = [acc.ac + global_AccountSeparator + acc.bc, acc.ac + ' - ' + acc.an + ' - ' + acc.bc];
                panel.accList.push(accRec);
            }
        }
        //default acc num if there is item in accList to the first item in the first accRec
        this.accNo = ((panel.accList.length > 0 ? panel.accList[0][0] : '')).split(global_AccountSeparator)[0].trim();

        var accStore;
        if (pagingMode) {
            accStore = new Ext.ux.data.PagingSimpleStore({
                fields: ['accno', 'name'],
                data: this.accList,
                lastOptions: {params: {start: 0, limit: 5}}
            });
        }

        else {
            accStore = new Ext.data.ArrayStore({
                fields: ['accno', 'name'],
                data: this.accList
            });
        }

        var store;
        if (pagingMode) {
            store = new Ext.ux.data.PagingStore({
                reader: panel.storeReader(),
                lastOptions: {params: {start: 0, limit: 10}}
            });
        }

        else {
            store = new Ext.data.Store({
                fields: panel.getRecordMapping(),
                proxy: {
                    type: 'memory',
                    reader: panel.storeReader()
                }
            });
        }

        panel.tbSearchAccount = new Ext.form.field.Text({
            autoCreate: {
                tag: 'input',
                type: 'text',
                size: '30',
                autocomplete: 'off'
            },
            width: 100,
            hidden: !isDealerRemisier,
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
            iconCls: "icon-center",
            iconAlign: 'top',
            padding: 0,
            margin: '0 5 0 0',
            hidden: !isDealerRemisier,
            icon: iconSearchAccBtn,
            style: 'background: transparent;',
            handler: function () {
                if (panel.tbSearchAccount.isHidden()) {
                    panel.tbSearchAccount.setVisible(true);
                    panel.cbAccount.setHidden(true);
                } else {
                    if (panel.tbSearchAccount.getValue().trim() == '') {
                        panel.tbSearchAccount.setValue('');
                        msgutil.alert(languageFormat.getLanguage(10045, 'Please key in your search text.'), function () {
                            panel.tbSearchAccount.focus();
                        });
                    } else {
                        panel.searchAccount(panel.tbSearchAccount.getValue());
                    }
                }
            }
        });

        this.cbAccount = new Ext.form.ComboBox({
            width: 145,
            selectOnFocus: true,
            forceSelection: true,
            queryMode: 'local',
            matchFieldWidth: false,
            listConfig: {
                minWidth: 145
            },
            hidden: isDealerRemisier,
            store: accStore,
            displayField: 'name',
            listClass: 'my-combo-lst',
            valueField: 'accno', // id for displayfield
            emptyText: languageFormat.getLanguage(10029, 'Select account...'),
            pageSize: pagingMode ? 5 : 0,
            triggerAction: 'all',
            lazyInit: false,
            value: (panel.accList.length > 0 ? panel.accList[0][0] : ''), //refer to this.accNo of orderHistoryPanel.start with defaultaccNo
            listeners: {
                afterrender: function () {
                    //var pgTb = this.pageTb;
                    if (pagingMode) {

                        this.pageTb.setVisible(false);

                        var paging = new Ext.ux.EditedPagingToolbar({
                            enableOverflow: menuOverflow,
                            ///height: 30,
                            store: accStore,
                            displayInfo: false,
                            pageSize: 5,
                            //hideParent:true,
                            //hideLabel:true,
                            //nextText:'Next',
                            renderTo: this.footer
                        });
                    }
                },
                select: function () {
                    var accno = this.value; // refer to combobox
                    panel.accNo = (this.value).split(global_AccountSeparator)[0].trim();
                    panel.search();
                }
            }
        });

        var filterOptList = [
            ['0', languageFormat.getLanguage(20196, 'All Order')],
            ['1', languageFormat.getLanguage(20068, 'Active')],
            ['2', languageFormat.getLanguage(10104, 'Open')],
            ['3', languageFormat.getLanguage(20197, 'Filled')],
            ['4', languageFormat.getLanguage(20198, 'Inactive')]
        ];

        var filterOptStore = new Ext.data.ArrayStore({
            fields: ['code', 'desc'],
            data: filterOptList
        });

        this.cbfilterOpt = new Ext.form.ComboBox({
            editable: false,
            width: 75,
            queryMode: 'local',
            store: filterOptStore,
            displayField: 'desc',
            valueField: 'code',
            triggerAction: 'all',
            //value display in combobox according valueField
            value: Ext.isEmpty(this.filterOpt) ? '0' : this.filterOpt, //Ext.isEmpty(value) returns to true if value passed in is empty
            listeners: {
                select: function () {
                    var filterOpt = this.value;
                    panel.filterOpt = filterOpt;
                    panel.search();
                }
            }
        });

        panel.feedExchangeList = [];
        var filterOptExList = [['0', languageFormat.getLanguage(20654, 'All Exchanges')]];
        for (var ii = 0; ii < global_ExchangeList.length; ii++) {
            filterOptExList.push([global_ExchangeList[ ii ].exchange, global_ExchangeList[ ii ].exchangeName]);
        }

        var filterOptExStore = new Ext.data.ArrayStore({
            fields: ['id', 'name'],
            data: filterOptExList
        });

        this.cbExchange = new Ext.form.ComboBox({
            editable: false,
            width: UI.exchWidth,
            listConfig: {
                minWidth: UI.exchWidth
            },
            matchFieldWidth: UI.matchFieldWidth,
            queryMode: 'local',
            store: filterOptExStore,
            displayField: 'name',
            valueField: 'id',
            triggerAction: 'all',
            value: Ext.isEmpty(this.filterExtOpt) ? '0' : this.filterExtOpt,
            listeners: {
                select: function () {
                    var filterExtOpt = this.value;
                    panel.filterExtOpt = filterExtOpt;
                    panel.search();
                }
            }
        });

        var xtype = 'button';

        var btnRefreshConf = {
            text: languageFormat.getLanguage(10008, 'Refresh'),
            tooltip: languageFormat.getLanguage(10008, 'Refresh'),
            xtype: xtype,
            icon: icoBtnRefresh,
            handler: function () {
                panel.search();
            }
        };

        var btnDetailsConf = {
            itemId: 'oh_btnDetail',
            text: languageFormat.getLanguage(20199, 'View Details'),
            xtype: xtype,
            icon: icoBtnOrdSts,
            hidden: !touchMode && !macSafari,
            handler: function () {
                var tktno = panel.tktno;
                var ordno = panel.ordno;
                var stkname = panel.stkname;
                tktno = trim(tktno) == null ? '' : trim(tktno);
                ordno = trim(ordno) == null ? '' : trim(ordno);
                createOrderDetailPanel(ordno, tktno, stkname, false);
            }
        };

        this.btnRefresh = new Ext.Button(btnRefreshConf);
        this.btnDetails = new Ext.Button(btnDetailsConf);

        var todayDate = new Date();

        this.dateFrom = new Ext.form.DateField({
            editable: false,
            format: 'd/m/Y',
            itemId: 'dtFrom',
            maxValue: todayDate,
            width: 100
        });

        this.dateTo = new Ext.form.DateField({
            editable: false,
            format: 'd/m/Y',
            itemId: 'dtTo',
            maxValue: todayDate,
            width: 100
        });

        // add paging buttons
        var hidePagingBtns = (pagingMode == true) ? false : true;
        var tbPrev = {
            itemId: 'oh_prev',
            xtype: 'button',
            text: languageFormat.getLanguage(20058, 'Prev'),
            hidden: hidePagingBtns,
            listeners: {
                click: function () {
                    panel.previousPage();
                }
            }
        };

        var tbNext = {
            itemId: 'oh_next',
            xtype: 'button',
            text: languageFormat.getLanguage(10015, 'Next'),
            hidden: hidePagingBtns,
            listeners: {
                click: function () {
                    panel.nextPage();
                }
            }
        };

        panel.compRef.totalMktVal = new Ext.form.Label({
            text: '-'
        });
        panel.compRef.totalOrdVal = new Ext.form.Label({
            text: '-'
        });

        this.paging = new Ext.PagingToolbar({
            enableOverflow: menuOverflow,
            height: 30,
            store: store,
            displayInfo: false,
            pageSize: 10,
            listeners: {
                afterrender: function (c) { // hide items of paging tbar(i.e refresh button etc. can check at firebug console (orderStatusPanel.paging.items.items )
                    for (var i = 0; i < 11; i++) { // the form label items r not hidden
                        var itm = c.items.items[i];
                        itm.hide();
                    }
                },
                change: function (paging, pagedata) {
                    var tbar = panel.getTopToolbar();
                    if (pagedata.total > 0) {

                        var page = pagedata.activePage;
                        var lastpage = pagedata.pages;

                        if (pagedata.total <= paging.pageSize) {
                            //disable both
                            tbar.getComponent('oh_prev').disable();
                            tbar.getComponent('oh_next').disable();
                        } else if (page == 1) {
                            //disable prev
                            tbar.getComponent('oh_prev').disable();
                            tbar.getComponent('oh_next').enable();
                        } else if (page == lastpage) {
                            //disable next
                            tbar.getComponent('oh_prev').enable();
                            tbar.getComponent('oh_next').disable();
                        } else {
                            //disable none
                            tbar.getComponent('oh_prev').enable();
                            tbar.getComponent('oh_next').enable();
                        }
                        tbar.doLayout();
                        panel.page = page;
                    } else {
                        tbar.getComponent('oh_prev').disable();
                        tbar.getComponent('oh_next').disable();
                    }

                    panel.getSelectionModel().select(0);
                }
            },
            items: ['->', new Ext.form.Label({
                    text: languageFormat.getLanguage(20190, 'Total Ordered Value') + ': '
                }), '&nbsp;&nbsp;',
                panel.compRef.totalOrdVal, '&nbsp;&nbsp;&nbsp;&nbsp;',
                new Ext.form.Label({
                    text: languageFormat.getLanguage(20191, 'Total Matched Value') + ': '
                }), '&nbsp;&nbsp;',
                panel.compRef.totalMktVal, '&nbsp;&nbsp;&nbsp;&nbsp;']
        });

        panel.compRef.topBar = Ext.create('Ext.toolbar.Toolbar', {
            itemId: 'tbarOrdHis',
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll,
            items: [
                this.cbAccount,
                '',
                panel.tbSearchAccount,
                panel.searchAccountBtn,
                this.cbfilterOpt,
                '',
                this.cbExchange,
                {
                    xtype: 'tbspacer',
                    width: 10
                }, this.dateFrom,
                {
                    text: 'to',
                    xtype: 'tbtext'
                },
                this.dateTo,
                '  ',
                {
                    xtype: xtype,
                    text: languageFormat.getLanguage(10007, 'Search'),
                    tooltip: languageFormat.getLanguage(10007, 'Search'),
                    icon: icoBtnSearch,
                    handler: function () {
                        panel.search();
                    }
                },
                new Ext.Button({
                    text: languageFormat.getLanguage(10004, 'Export CSV'),
                    tooltip: languageFormat.getLanguage(10004, 'Export CSV'),
                    hidden: !isDesktop,
                    icon: icoBtnExportCSV,
                    handler: function () {

                        var optColumn = {};
                        optColumn[ 'ed' ] = ExportFile.TYPE_DATE;

                        ExportFile.initial(ExportFile.FILE_CSV, panel, optColumn);
                    }

                }),
                '->',
                tbPrev,
                tbNext,
                {
                    itemId: 'saveSetting_OH', //v1.3.33.27
                    icon: iconBtnSaveSetting,
                    xtype: xtype,
                    hidden: true,
                    style: "margin-right:5px;",
                    handler: function () {
                        msgutil.confirm(languageFormat.getLanguage(30008, 'You have unsave settings. Would you like to save your settings?'),
                                function (sResp) {
                                    if (sResp == "yes") {
                                        panel.isImgBlink = false;
                                        cookies.procCookie(panel.ohckId, panel.tempWidth, cookieExpiryDays);
                                        panel.tempWidth = cookies.toDefaultColumn(panel, panel.ohckId);
                                    } else {
                                        panel.isImgBlink = false;
                                    }
                                }
                        );
                    }
                },
                createAutoWidthButton(panel),
                {
                    itemId: 'ostb_btnColumns_history',
                    text: languageFormat.getLanguage(10005, 'Columns'),
                    tooltip: languageFormat.getLanguage(10005, 'Columns'),
                    xtype: xtype,
                    icon: icoBtnColumn,
                    hidden: global_showColSettingHeader == "TRUE" ? false : true,
                    handler: function () {
                        panel.showColumnSetting();
                    }
                },
                btnRefreshConf
            ]
        });

        var defaultConfig = {
            header: false,
            enableColumnMove: N2N_CONFIG.gridColMove,
            enableColumnHide: N2N_CONFIG.gridColHide,
            columnLines: false,
            border: false,
            store: store,
            columns: {
            	items: colutils.getColumnModel(panel, ''),
            	defaults: {
                    lockable: false // does not work in ExtJS 4.2, keep for its later fix
                }
            },
            selModel: {
                preventFocus: true
            },
            bodyStyle: 'padding:0px; margin:0px; font-size: 12pt; border: none;',
            tbar: panel.compRef.topBar,
            bbar: this.paging,
            height: 232,
            viewConfig: getGridViewConfig(panel),
            bufferedRenderer: N2N_CONFIG.gridBufferedRenderer,
            leadingBufferZone: N2N_CONFIG.gridLeadingBufferZone,
            trailingBufferZone: N2N_CONFIG.gridTrailingBufferZone,
            listeners: {
                afterrender: function (thisComp) {
                    panel.tooltip = new Ext.ToolTip({
                        target: 'saveSetting_OH',
                        html: languageFormat.getLanguage(30009, 'Click this blinking icon to save the adjusted column width.'),
                        anchor: 'top',
                        showDelay: 0
                    });
                },
                hide: function (p) {
                    p.store.removeAll();
                },
                columnresize: function(ct, column, newWidth, eOpts) {
                    if (newWidth === 0) {
                        column.autoSize();
                        newWidth = column.width;
                    }

                    panel.updateColWidthCache(column, newWidth);

                    if (N2N_CONFIG.autoQtyRound) {
                        helper.refreshView(panel);
                    }
                },
                cellclick: function (p, td, cellidx, rec, tr, ridx, e) {
                    panel.selectRecord(ridx);
                },
                cellcontextmenu: function (p, td, cellIndex, rec, tr, ridx, e) {
                    if (!touchMode) {
                        var stkCode = panel.getStore().getAt(ridx).get('sc');
                        if (outbound) {
                            // panel.disableRightFunction(stkCode);	// applicable for outbound some exchange does not have data
                        }

                        panel.showContextMenu(p, ridx, e);
                    }
                },
                select: function (sm, rec, ridx) {
                    panel.selectRecord(ridx);
                },
                beforedestroy: function (p) {
                    orderHistoryPanel = null;
                    if (!orderStatusPanel) {
                        Ext.getCmp("ord_log").disable();
                    }
                    p.stkcodes = null;
                    Storage.clearHelpObj();
                    // conn.updateFieldList();
                    // conn.updateStkCodes();
                    // conn.subscribeFeed();
                },
                columnmove: gridColHandler,
                columnshow: gridColHandler,
                columnhide: gridColHandler,
                resize: bufferedResizeHandler
            }
        };

        this.createContextMenu();

        Ext.apply(this, defaultConfig);
        this.callParent(arguments);

    },
    callImageBlink: function () { //v1.3.33.27
        var panel = this;
        var btn = panel.down('#saveSetting_OH');
        if (panel.isImgBlink == false) {
            btn.show();
            panel.isImgBlink = true;
            panel.callImg(btn);
        }
    },
    callImg: function (btn) {  //v1.3.33.27
        var panel = this;
        var hidden;
        if (btn.icon == iconBtnSaveSettingOff) {
            hidden = false;
            t = 1000;
        }
        else {
            hidden = true;
            t = 1000;
        }

        panel.imgBlinkTime = setTimeout(function () {
            if (panel.isImgBlink == true) {
                panel.imgBlink(hidden, btn);
            }
            else {
                btn.hide();
            }
        }, t);
    },
    imgBlink: function (hidden, btn) { //v1.3.33.27
        var panel = this;
        var x;
        if (hidden == true) {
            btn.setIcon(iconBtnSaveSettingOff);
        }
        else {
            btn.setIcon(iconBtnSaveSetting);
        }

        panel.callImg(btn);
    },
    procColumnWidth: function () {
        var panel = this;
        panel.columnHash = new N2NHashtable();
        var columnID;
        var columnWidth;
        panel._setCookieId();

        if (cookies.isCookiesExist(panel.ohckId)) {
            var temp = cookies.getCookies(panel.ohckId);
            columnID = temp[0];
            columnWidth = temp[1];
        }
        else {
            columnID = global_OSColumnID;
            columnWidth = global_OSWidth;

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
    getWidth: function (columnID) {
        var panel = this;

        return panel.columnHash.get(columnID) || 60;
    },
    onContextMenuClick: function (funcs) {
        if (funcs != null) {
            var totFunc = funcs.length;
            for (var i = 0; i < totFunc; i++) {
                var func = funcs[i];
                if (func.name != null) {
                    var btn;
                    switch (func.name) {
                        case this.menuBuyId:
                            btn = this.contextMenu.get(this.menuBuyId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuSellId:
                            btn = this.contextMenu.get(this.menuSellId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuReviseId:
                            btn = this.contextMenu.get(this.menuReviseId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuCancelId:
                            btn = this.contextMenu.get(this.menuCancelId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuDepthId:
                            btn = this.contextMenu.get(this.menuDepthId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuStkTrackerId:
                            btn = this.contextMenu.get(this.menuStkTrackerId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuEqTrackerId:
                            btn = this.contextMenu.get(this.menuEqTrackerId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuHisDataId:
                            btn = this.contextMenu.get(this.menuHisDataId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuStkInfoId:
                            btn = this.contextMenu.get(this.menuStkInfoId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuChartId:
                            btn = this.contextMenu.get(this.menuChartId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuAnalysisId:
                            btn = this.contextMenu.get(this.menuAnalysisId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuOrdLogId:
                            btn = this.contextMenu.get(this.menuOrdLogId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuStkNewsId:
//                    	if (exchangecode == 'KL' || exchangecode == 'MY') {
                            btn = this.contextMenu.get(this.menuStkNewsId);
                            btn.setHandler(func.func);
//                    	}
                            break;
                        case this.menuStkNewsArchiveId:
                            btn = this.contextMenu.get(this.menuStkNewsArchiveId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuStkNewsElasticId:
                            btn = this.contextMenu.get(this.menuStkNewsElasticId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuStkNewsNikkeiId:
                            btn = this.contextMenu.get(this.menuStkNewsNikkeiId);
                            btn.setHandler(func.func);
                            break; 
                        case this.menuOrdDetailId:
                            btn = this.contextMenu.get(this.menuOrdDetailId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuFundamentalCPIQId:
                            btn = this.contextMenu.get(this.menuFundamentalCPIQId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuFundamentalThomsonReutersId:
                            btn = this.contextMenu.get(this.menuFundamentalThomsonReutersId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuAddStockAlertId:
                            btn = this.contextMenu.get(this.menuAddStockAlertId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuWarrantsInfoId:
                            btn = this.contextMenu.get(this.menuWarrantsInfoId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuStockAlertId:
                            btn = this.contextMenu.get(this.menuStockAlertId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuPSEEdgeId:
                            btn = this.contextMenu.get(this.menuPSEEdgeId);
                            btn.setHandler(func.func);
                            break;
                    }
                }
            }
        }
    },
    createContextMenu: function () {
        var menu = this;
        var btns = [];

        if (showBuySellHeader == "TRUE") {
            this.menuBuyId = Ext.id();
            btns.push({
                itemId: menu.menuBuyId,
                text: languageFormat.getLanguage(10001, 'Buy'),
                icon: icoBtnBuy,
                popupOnly: true,
                handler: function () {
                    activateBuySellMenu(modeOrdBuy);
                }
            });

            this.menuSellId = Ext.id();
            btns.push({
                itemId: menu.menuSellId,
                text: languageFormat.getLanguage(10002, 'Sell'),
                icon: icoBtnSell,
                popupOnly: true,
                handler: function () {
                    activateBuySellMenu(modeOrdSell);
                }
            });
        }

        this.menuReviseId = Ext.id();
        btns.push({
            itemId: menu.menuReviseId,
            text: languageFormat.getLanguage(10009, 'Revise'),
            icon: icoBtnOrdPad,
            popupOnly: true,
            handler: function () {
                var ordRec = orderHistoryPanel.contextMenu.ordRec;
                if (ordRec != null) {
                    var tktno = trim(ordRec.tn) == null ? '' : trim(ordRec.tn);
                    var ordno = trim(ordRec.on) == null ? '' : trim(ordRec.on);
                    var ordsts = trim(ordRec.stc) == null ? '' : trim(ordRec.stc);
                    if ((tktno || ordno) && canCancelRevise(ordsts)) {
                        closedOrderPad = false;
                        createOrderPad(orderHistoryPanel.contextMenu.stkCode, orderHistoryPanel.contextMenu.stkName, modeOrdRevise, orderHistoryPanel.contextMenu.ordRec, true);
                        if (n2nLayoutManager.isTabLayout()) {
                            closedMarketDepth = false;
                        }
                    }
                }
            }
        });

        this.menuCancelId = Ext.id();
        btns.push({
            itemId: menu.menuCancelId,
            text: languageFormat.getLanguage(10010, 'Cancel'),
            icon: icoBtnOrdPad,
            popupOnly: true,
            handler: function () {
                var ordRec = orderHistoryPanel.contextMenu.ordRec;
                if (ordRec != null) {
                    var tktno = trim(ordRec.tn) == null ? '' : trim(ordRec.tn);
                    var ordno = trim(ordRec.on) == null ? '' : trim(ordRec.on);
                    var ordsts = trim(ordRec.stc) == null ? '' : trim(ordRec.stc);
                    if ((tktno || ordno) && canCancelRevise(ordsts)) {
                        closedOrderPad = false;
                        createOrderPad(orderHistoryPanel.contextMenu.stkCode, orderHistoryPanel.contextMenu.stkName, modeOrdCancel, orderHistoryPanel.contextMenu.ordRec, true);

                        if (autoCancel == "TRUE") {
                            orderPad.submitCancel();
                        }
                        if (n2nLayoutManager.isTabLayout()) {
                            closedMarketDepth = false;
                        }
                    }
                }
            }
        });

        if (showStkInfoHeader == "TRUE") {
            if (showStkInfoMarketDepth == "TRUE") {
                this.menuDepthId = Ext.id();
                btns.push({
                    itemId: menu.menuDepthId,
                    text: languageFormat.getLanguage(20022, 'Market Depth'),
                    icon: icoBtnDepth,
                    handler: function () {
                        /**
                         * Apply Market Depth Logic, To Get selected StkCode get using
                         * marketMoverPanel.contextMenu.stkCode
                         */
                        closedMarketDepth = false;
                        createMarketDepthPanel(orderHistoryPanel.contextMenu.stkCode, orderHistoryPanel.contextMenu.stkName, true);
                    }
                });
            }

            if (showStkInfoStkInfo == "TRUE") {
                this.menuStkInfoId = Ext.id();
                btns.push({
                    itemId: menu.menuStkInfoId,
                    text: languageFormat.getLanguage(20021, 'Stock Info'),
                    icon: icoBtnStkInfo,
                    handler: function () {
                        createStkInfoPanel(orderHistoryPanel.contextMenu.stkCode, orderHistoryPanel.contextMenu.stkName, false);

                    }
                });
            }

            if (showStkInfoTracker == "TRUE") {
                this.menuStkTrackerId = Ext.id();
                btns.push({
                    itemId: menu.menuStkTrackerId,
                    text: languageFormat.getLanguage(20024, 'Stock Tracker'),
                    iconCls: 'tracker-ico',
                    handler: function () {
                        /**
                         * Apply Stock News Logic, To Get selected StkCode get using
                         * marketMoverPanel.contextMenu.stkCode
                         */
                        createTrackerPanel(orderHistoryPanel.contextMenu.stkCode, orderHistoryPanel.contextMenu.stkName, false);
                    }
                });
            }

            if (showStkInfoEquitiesTracker == "TRUE") {
                this.menuEqTrackerId = Ext.id();
                btns.push({
                    id: menu.menuEqTrackerId,
                    text: languageFormat.getLanguage(20025, 'Equities Tracker'),
                    icon: icoBtnEquitiesTracker,
                    handler: function () {
                        n2ncomponents.createEquitiesTracker(orderHistoryPanel.contextMenu.stkCode);
                    }
                });
            }

            if (N2N_CONFIG.features_HistoricalData) {
                this.menuHisDataId = Ext.id();

                btns.push({
                    itemId: menu.menuHisDataId,
                    text: languageFormat.getLanguage(20060, 'Historical Data'),
                    icon: ICON.HIS_DATA,
                    handler: function () {
                        n2ncomponents.createHistoricalData(orderHistoryPanel.contextMenu.stkCode, orderHistoryPanel.contextMenu.stkName);
                    }
                });
            }
        }

        if (showChartHeader == "TRUE") {
            if (showChartIntradayChart == "TRUE") {
                this.menuChartId = Ext.id();
                btns.push({
                    itemId: menu.menuChartId,
                    text: languageFormat.getLanguage(20101, 'Intraday Chart'),
                    icon: icoBtnIntraChart,
                    handler: function () {
                        /**
                         * Apply Chart Logic, To Get selected StkCode get using
                         * marketMoverPanel.contextMenu.stkCode
                         */

                        createChartPanel(orderHistoryPanel.contextMenu.stkCode, orderHistoryPanel.contextMenu.stkName, false);
                    }
                });
            }

            if (showChartAnalysisChart == "TRUE") {
                this.menuAnalysisId = Ext.id();
                btns.push({
                    itemId: menu.menuAnalysisId,
                    text: languageFormat.getLanguage(20102, 'Analysis Chart'),
                    icon: icoBtnAnalysisChart,
                    handler: function () {
                        /**
                         * Apply Chart Logic, To Get selected StkCode get using
                         * marketMoverPanel.contextMenu.stkCode
                         */

                        createAnalysisChartPanel(orderHistoryPanel.contextMenu.stkCode, orderHistoryPanel.contextMenu.stkName, false);

                    }
                });
            }
        }

        if (showOrdBookHeader == "TRUE") {
            if (showOrdBookOrderLog == "TRUE") {
                this.menuOrdLogId = Ext.id();
                btns.push({
                    itemId: menu.menuOrdLogId,
                    text: languageFormat.getLanguage(20174, 'Order Log'),
                    icon: icoBtnOrdSts,
                    handler: function () {
                        /**
                         * Apply Stock News Logic, To Get selected StkCode get using
                         * marketMoverPanel.contextMenu.stkCode
                         */
                        createOrdLogPanel();
                        orderLogPanel.callOrdLog();
                    }
                });
            }
            if (showOrdBookOrderDetails == "TRUE") {
                this.menuOrdDetailId = Ext.id();
                btns.push({
                    itemId: menu.menuOrdDetailId,
                    text: languageFormat.getLanguage(20175, 'Order Detail'),
                    icon: icoBtnOrdSts,
                    handler: function () {
                        /**
                         * Apply News Logic, To Get selected StkCode get using
                         * marketMoverPanel.contextMenu.stkCode
                         */
                        var tktno = orderHistoryPanel.contextMenu.ordRec.tktNo;
                        var ordno = orderHistoryPanel.contextMenu.ordRec.ordNo;
                        //var orderDate = orderHistoryPanel.contextMenu.ordRec.ordDate;

                        /* shuwen 05/08/2014
                         * Use last update time as the searchDate param for TradeHistory API instead of ordDate as GTD orders are involved.
                         * ExpDate is not accurate enough as user might cancel GTD orders halfway through.
                         */
                        var orderDate = orderHistoryPanel.contextMenu.ordRec.lastUpdate;
                        var accno = orderHistoryPanel.getAccountValue();

                        tktno = trim(tktno) == null ? '' : trim(tktno);
                        ordno = trim(ordno) == null ? '' : trim(ordno);
                        orderDate = trim(orderDate) == null ? '' : trim(orderDate.substring(0, 8));
                        accno = trim(accno) == null ? '' : trim(accno);

                        createOrderDetailPanel(ordno, tktno, orderHistoryPanel.contextMenu.stkName, false, 'ordHistPanel', orderDate, accno);

                    }
                });
            }
        }

        if (showNewsHeader == "TRUE") {
            if (showNewsStockNews == "TRUE") {
                this.menuStkNewsId = Ext.id();
                btns.push({
                    itemId: menu.menuStkNewsId,
                    text: languageFormat.getLanguage(20123, 'Stock News'),
                    icon: icoBtnNews,
                    handler: function () {
                        /**
                         * Apply Stock News Logic, To Get selected StkCode get using
                         * marketMoverPanel.contextMenu.stkCode
                         */
                        createStkNewsPanel(orderHistoryPanel.contextMenu.stkCode, orderHistoryPanel.contextMenu.stkName);
                    }
                });
            }
            if (N2N_CONFIG.featuresNews_Archive) {
                this.menuStkNewsArchiveId = Ext.id();
                btns.push({
                    id: menu.menuStkNewsArchiveId,
                    text: languageFormat.getLanguage(20137, 'News Archive'),
                    icon: icoBtnArchive,
                    handler: function () {
                        n2ncomponents.openArchiveNews({key: orderHistoryPanel.contextMenu.stkCode, name: orderHistoryPanel.contextMenu.stkName});
                    }
                });
            }
            if (N2N_CONFIG.elasticNewsUrl) {
                this.menuStkNewsElasticId = Ext.id();
                btns.push({
                    id: menu.menuStkNewsElasticId,
                    text: languageFormat.getLanguage(20140, 'Elastic News'),
                    icon: icoBtnArchive,
                    handler: function () {
                        n2ncomponents.openElasticNews({key: orderHistoryPanel.contextMenu.stkCode, name: orderHistoryPanel.contextMenu.stkName, newsOpt: '1'});
                    }
                });
            }
            if (N2N_CONFIG.nikkeiNewsUrl) {
                this.menuStkNewsNikkeiId = Ext.id();
                btns.push({
                    id: menu.menuStkNewsNikkeiId,
                    text: languageFormat.getLanguage(21501, 'Nikkei News'),
                    icon: icoBtnArchive,
                    handler: function () {
                        n2ncomponents.openElasticNews({key: orderHistoryPanel.contextMenu.stkCode, name: orderHistoryPanel.contextMenu.stkName, newsOpt: '2'});
                    }
                });
            }
            if (N2N_CONFIG.featuresNews_FundamentalCPIQ) {
                this.menuFundamentalCPIQId = Ext.id();
                btns.push({
                    itemId: menu.menuFundamentalCPIQId,
                    text: languageFormat.getLanguage(20124, 'Fundamental (Capital IQ)'),
                    icon: icoBtnNews24,
                    handler: function () {
                        createFundamentalCPIQWin(orderHistoryPanel.contextMenu.stkCode);
                    }
                });
            }

            if (N2N_CONFIG.featuresNews_FundamentalThomsonReuters) {
                this.menuFundamentalThomsonReutersId = Ext.id();
                btns.push({
                    itemId: menu.menuFundamentalThomsonReutersId,
                    text: languageFormat.getLanguage(20126, 'Fundamental (Thomson Reuters)'),
                    icon: icoBtnNews24,
                    handler: function () {
                        /**
                         * Show Fundamental Thomson Reuters news
                         * selected StkCode get using
                         * marketMoverPanel.contextMenu.stkCode
                         */
                        createFundamentalThomsonReutersWin(orderHistoryPanel.contextMenu.stkCode);
                    }
                });
            }
        }

        if (showSettingHeader == "TRUE") {
            if (N2N_CONFIG.featuresSetting_AddStockAlert) {
                this.menuAddStockAlertId = Ext.id();
                btns.push({
                    itemId: menu.menuAddStockAlertId,
                    text: languageFormat.getLanguage(20603, 'Add Stock Alert'),
                    icon: icoBtnAddStkAlert,
                    handler: function () {
                        /**
                         * Add Stock Alert
                         * selected StkCode get using
                         */
                        n2ncomponents.createAddStockAlert(orderHistoryPanel.contextMenu.stkCode);
                    }
                });
            }
        }

        if (showWarrantsInfo == "TRUE") {
            this.menuWarrantsInfoId = Ext.id();
            btns.push({
                itemId: menu.menuWarrantsInfoId,
                text: languageFormat.getLanguage(20130, 'Warrants Info'),
                icon: icoBtnStkInfo,
                handler: function () {
                    /**
                     * Show Warrants Info
                     * selected StkCode get using
                     * marketMoverPanel.contextMenu.stkCode
                     */
                    createWarrantsInfoWin(orderHistoryPanel.contextMenu.stkCode);
                }
            });
        }
        
        if (settingSMSStockAlertURL.length > 0) {
            this.menuStockAlertId = Ext.id();
            btns.push({
                itemId: menu.menuStockAlertId,
                text: languageFormat.getLanguage(20602, 'Stock Alert'),
                handler: function () {
                	n2ncomponents.createSMSStockAlert(orderHistoryPanel.contextMenu.stkCode);
                }
            });
        }
        
        if (N2N_CONFIG.pseEdgeURL.length > 0) {
            this.menuPSEEdgeId = Ext.id();
            btns.push({
                itemId: menu.menuPSEEdgeId,
                text: 'PSE Edge',
                handler: function () {
                	n2ncomponents.openPseEdge(orderHistoryPanel.contextMenu.stkCode);
                }
            });
        }

        this.contextMenu = new Ext.menu.Menu({
            stkCode: '',
            autoWidth: true,
            items: btns,
            listeners: addDDMenu()
        });
    },
    showContextMenu: function (grid, ridx, e) {
        e.stopEvent();

        grid.getSelectionModel().select(ridx);
        if (this.contextMenu == null)
            this.createContextMenu();

        var rec = grid.store.getAt(ridx).data;
        var stkCode = rec.sc;
        var stkName = rec.sy;
        var accno = rec.an;
        var ordqty = rec.oq;
        var ordprc = rec.op;
        var ordtype = rec.ot;
        var validity = rec.vd;
        var tktno = rec.tn;
        var ordno = rec.on;
        var subordno = rec.son;
        var ordsrc = rec.OrdSrc;
        var ordtime = rec.tm;
        var orddate = rec.dt;
        var ordsts = rec.stc;
        var unmtqty = rec.uq;
        var expdate = rec.ed;
        var stoplimit = rec.sl;
        var minqty = rec.mq;
        var dsqty = rec.dq;
        var lotsize = rec.ls;
        var lastupdate = rec.lut;
        var branchCode = rec.bc;
        var accName = rec.accN;

        this.contextMenu.stkCode = stkCode;
        this.contextMenu.stkName = stkName;

        var ordRec = {
            //accNo: accno,
            accNo: accno + global_AccountSeparator + branchCode,
            ordQty: ordqty,
            ordPrc: ordprc,
            price: ordprc,
            ordType: ordtype,
            validity: validity,
            tktNo: tktno,
            ordNo: ordno,
            subOrdNo: subordno,
            ordSrc: ordsrc,
            ordTime: ordtime,
            ordSts: ordsts,
            unMtQty: unmtqty,
            ordDate: orddate,
            expDate: expdate,
            stopLimit: stoplimit,
            minQty: minqty,
            dsQty: dsqty,
            lotSize: lotsize,
            lastUpdate: lastupdate,
            OrdStsAccList: [[accno + global_AccountSeparator + branchCode, accno + ' - ' + accName + ' - ' + branchCode]]
        };

        this.contextMenu.ordRec = ordRec;

        var canTrd = false;
        if ((tktno || ordno) && canCancelRevise(ordsts))
            canTrd = true;

        if (canTrd) {
            this.contextMenu.down('#' + this.menuReviseId).enable();
            this.contextMenu.down('#' + this.menuCancelId).enable();
        } else {
            this.contextMenu.down('#' + this.menuReviseId).disable();
            this.contextMenu.down('#' + this.menuCancelId).disable();
        }

        this.disableRightFunction(this.contextMenu.stkCode);
        this.contextMenu.showAt(e.getXY());
    },
    printColor: function (value, color, bold, fontsize) {
        var el = [];
        el.push('<span');

        var style = color != null || bold != null || fontsize != null;
        if (style) {
            el.push(' style="');
            if (color != null) {
                el.push('color: ');
                el.push(color);
                el.push('; ');
            }
            if (bold != null)
                el.push('font-weight: bold; ');

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
    printOrdNo: function (value) {
        return this.printColor(value, cFUnchanged, true, cGridFSize - 1);
    },
    printStkName: function (value) {
        return this.printColor(value, cFUnchanged, true, cGridFSize - 1);
    },
    printString: function (value) {
        return this.printColor(value, cFUnchanged, true, cGridFSize);
    },
    printPrice: function (value, meta, record) {
        if (isNaN(value))
            if (value == null || value == '')
                return '-';

        if (value == -999001 || value == 999001)
            return this.printColor('MO', cFUnchanged, true, cGridFSize);
        else if (value == -999002 || value == 999002)
            return this.printColor('MP', cFUnchanged, true, cGridFSize);

        //1.3.24.4 value = this.formatDecimal(value);

        if (record == null)
            return this.printColor(value, cFUnchanged, true, cGridFSize);
//            debug(record.data);
        var lacp = record.data.LACP;
        //1.3.24.4 lacp = this.formatDecimal(lacp);

        var _value = parseFloat(value);

        if (_value > lacp)
            return this.printColor(value, cFUp, true, cGridFSize);
        else if (_value < lacp)
            return this.printColor(value, cFDown, true, cGridFSize);
        else
            return this.printColor(value, cFUnchanged, true, cGridFSize);
    },
    formatDecimal: function (value, decimal) {
        if (isNaN(value) || value == '')
            value = 0;
        if (decimal == null)
            decimal = 3;

        if (exchangecode == "KL")
            decimal = 3;

        else if (exchangecode == "SA")
            decimal = 2;

        else {
            if ((value / 1000) >= 1)
                decimal = 2;
        }

        return parseFloat(value).toFixed(decimal);
    },
    formatCurrency: function (value) {
        value += '';
        var x = value.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        var ret = x1 + x2;
        return ret;
    },
    formatNumber: function (value, digit) {
        if (typeof value == "undefined") {
            value = "";
        }
        value = value.toString(10); //toString to base 10
        var length = value.length;
        //cater for number with decimal-- start
        if (value.indexOf(".") != -1) {
            length = value.indexOf(".");
        }
        //---end
        var oldvalue;
        if (digit != null && length > digit) {
            oldvalue = value;
            value = Math.round(value / 1000) * 1000;// round to 3 decimals
            value = value.toString(10);
            value = value.substring(0, length - 3);
        }
        value += '';
        var x = value.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        var ret = x1 + x2;
        if (oldvalue != null)
            ret += 'k'; // if oldvalue!=null means din go in the first if condition

        return ret;
    },
    printNumber: function (value, digit) {
        if (viewInLotMode) {
            value = this.formatNumberLot(value);
        } else {
            value = this.formatNumber(value, 8);
        }
        return value;
    },
    printChange: function (value) {
        //1.3.24.4 value = this.formatDecimal(value);
        if (value > 0)
            return this.printColor(value, cFUp, true, cGridFSize);
        else if (value < 0)
            return this.printColor(value, cFDown, true, cGridFSize);
        else
            return this.printColor(value, cFUnchanged, true, cGridFSize);

    },
    printChgPct: function (value) {
        if (value > 0)
            return '<span style="color: ' + cFUp + '; font-weight: bold; font-size: ' + cGridFSize + 'pt">' + value + '%</span>';
        else if (value < 0)
            return '<span style="color: ' + cFDown + '; font-weight: bold; font-size: ' + cGridFSize + 'pt">' + value + '%</span>';
        else
            return '<span style="color: ' + cFUnchanged + '; font-weight: bold; font-size: ' + cGridFSize + 'pt">' + value + '%</span>';

    },
    appendExchangelist: function (exCode) {
        var panel = this;
        if (!contains(panel.feedExchangeList, exCode)) {
            panel.feedExchangeList.push(exCode);
        }
    },
    updateSummary: function () {// this function is to calculate totMtVal
        var panel = this;
        try {
            var store = this.store;
            if (store == null)
                return;
            var totMtVal = 0.0;
            var total = (pagingMode == true) ? store.getTotalCount() : store.getCount();
            for (var i = 0; i < total; i++) {
                var rec;
                if (pagingMode)
                    rec = store.allData.get(i);
                else
                    rec = store.getAt(i);
                var recData = rec.data;
                var mtQty = parseInt(recData.mq);
                var mtPrc = parseFloat(recData.mp);
                var mtVal = mtQty * mtPrc;
//            if (!isNaN(mtVal)) totMtVal += mtVal;




                if (panel.convertCurrencyEnable && panel.currencyRateList != null) {	// convert to the currency value

                    var currencyRateList = panel.currencyRateList;
                    var n = currencyRateList.size;

                    var recCurrency = recData.cr;

                    for (var j = 0; j < n; j++) {
                        var inListCurrency = currencyRateList.d[j].currate[0];
                        if (recCurrency == panel.currentCurrency) {
                            // same currency no need convert
//            			console.log("in same currecnt: " + recCurrency);
                            if (!isNaN(mtVal)) {
                                var val = parseFloat(mtVal);
                                totMtVal += val;
                            }


                            break;
                        } else if (inListCurrency == recCurrency) {
                            // not same curreny and need convert
//            			console.log("need convert");
                        	var recAction = recData.act;	// BUY or Sell
                            var buyRate = currencyRateList.d[j].currate[3];
                            var sellRate = currencyRateList.d[j].currate[4];
                            var denomiation = currencyRateList.d[j].currate[5];
                            var val = 0;
                            // convert
                            if (!isNaN(mtVal)) {
                            	if(recAction.toLowerCase() == "buy"){
                            		val = parseFloat(mtVal / denomiation * sellRate);
                            	}else{
                            		val = parseFloat(mtVal / denomiation * buyRate);
                            	}
//                        	console.log("[Market]mktVal: " + mktVal + " - val: " + val + " - denomiation: " + denomiation + " - buyRate: " + buyRate + " - recCurrency: " + recCurrency);
                                totMtVal += val;
                            }

                            break;
                        } else {
                            //console.log("[Not found!!]panel.currentCurrency: " + panel.currentCurrency + " - inListCurrency: " + inListCurrency + " - recCurrency: " + recCurrency);
                            // unable to find
                        }
                    }
                } else {
                    if (!isNaN(mtVal)) {
                        var val = parseFloat(mtVal);
                        totMtVal += val;
                    }
                }
            }
            this.totMtVal = totMtVal;
            this.setTotMtVal(totMtVal);
        } catch (e) {
            debug(e);
        }
    },
    setTotMtVal: function (v) {
        var _v = this.currentCurrency + ' ' + this.formatCurrency(v); //1.3.25.23 
        var rv = this.currentCurrency + ' ' + this.returnNumberFormat(v, 50);
        helper.setHtml(this.compRef.totalMktVal, '<span title="' + _v + '">' + rv + '</span>');
    },
    calculateTotOrdValue: function () {// this function is to calculate totOrdVal
        var panel = this;
        try {
            var store = this.store;
            if (store == null)
                return;
            var totOrdVal = 0.0;
            var total = (pagingMode == true) ? store.getTotalCount() : store.getCount();
            for (var i = 0; i < total; i++) {
                var rec;
                if (pagingMode)
                    rec = store.allData.get(i);
                else
                    rec = store.getAt(i);
                var recData = rec.data;
                var ordQty = parseInt(recData.oq);
                var ordPrc = parseFloat(recData.op);
                var ordVal = ordQty * ordPrc;
                //if (!isNaN(ordVal)) totOrdVal += ordVal;
                var currencyRateList = panel.currencyRateList; //1.3.25.23
                var recCurrency = recData.cr;
//            console.log("recCurrency: " + recCurrency);
                if (panel.convertCurrencyEnable) {	// convert to the currency value
                    for (var j = 0; j < currencyRateList.size; j++) {
                        var inListCurrency = currencyRateList.d[j].currate[0];
                        if (recCurrency == panel.currentCurrency) {
                            // same currency no need convert
//            			console.log("in same currecnt: " + recCurrency);
                            if (!isNaN(ordVal)) {
                                var valOrd = parseFloat(ordVal);
                                totOrdVal += valOrd;
                            }

                            break;
                        } else if (inListCurrency == recCurrency) {
                            // not same curreny and need convert
//            			console.log("need convert");
                        	var recAction = recData.act;	// BUY or Sell
                            var buyRate = currencyRateList.d[j].currate[3];
                            var sellRate = currencyRateList.d[j].currate[4];
                            var denomiation = currencyRateList.d[j].currate[5];
                            var valOrd = 0;
                            // convert
                            if (!isNaN(ordVal)) {
                            	if(recAction.toLowerCase() == "buy"){
                            		valOrd = parseFloat(ordVal / denomiation * sellRate);
                            	}else{
                            		valOrd = parseFloat(ordVal / denomiation * buyRate);
                            	}
                                totOrdVal += valOrd;
                            }

                            break;
                        } else {
                            //console.log("[Not found!!]panel.currentCurrency: " + panel.currentCurrency + " - inListCurrency: " + inListCurrency + " - recCurrency: " + recCurrency);
                            // unable to find
                        }
                    }
                } else {
                    if (!isNaN(ordVal)) {
                        var valOrd = parseFloat(ordVal);
                        totOrdVal += valOrd;
                    }
                }
            }
            this.totOrdVal = totOrdVal;
            this.setTotOrdVal(totOrdVal);
        } catch (e) {
            debug(e);
        }
    },
    setTotOrdVal: function (v) {
        var _v = this.currentCurrency + ' ' + this.formatCurrency(v);
        var rv = this.currentCurrency + ' ' + this.returnNumberFormat(v, 50);
        helper.setHtml(this.compRef.totalOrdVal, '<span title="' + _v + '">' + rv + '</span>');
    },
    nextPage: function () {
        var store = this.getStore();
        var total = store.getTotalCount();

        var cursor = this.paging.cursor;
        var size = this.paging.pageSize;

        this.page = cursor / size;
        var islastpage = cursor >= (total - size);
        if (!islastpage)
            this.paging.moveNext();
    },
    previousPage: function () {
        var store = this.getStore();
        var total = store.getTotalCount();

        var cursor = this.paging.cursor;
        var size = this.paging.pageSize;

        this.page = cursor / size;
        if (this.page > 0)
            this.paging.movePrevious();
    },
    search: function () {
        var panel = this;
        try {
            panel.tktno = '';
            panel.ordno = '';
            panel.stkname = '';

//        panel.fr = Ext.get('dtFrom').getValue();
//        panel.to = Ext.get('dtTo').getValue();
            panel.fr = panel.dateFrom.getRawValue();
            panel.to = panel.dateTo.getRawValue();

            var checkfr = panel.formatDate(panel.fr);
            var checkto = panel.formatDate(panel.to);
            if (checkfr > checkto) {
                //msgutil.alert('Date from should be earlier than date to');	  
                msgutil.alert(languageFormat.getLanguage(30501, 'Please ensure that the date entered in "Date from" is earlier than that of "Date to" and kindly try again.'));
                return;
            }
            if (panel.fr == "" || panel.to == "") {
                // msgutil.alert('Please enter date');
                msgutil.alert(languageFormat.getLanguage(30502, 'Please enter date.'));
                return;
            }

            var fr = panel.formatDate(panel.fr);
            var to = panel.formatDate(panel.to);

            var urlbuf = [];
            urlbuf.push(addPath + 'tcplus/atp/history?');

            if (this.accNo != '') {
                urlbuf.push('ac=');
                urlbuf.push(this.accNo);
            }

            urlbuf.push('&fr=');
            urlbuf.push(fr);
            urlbuf.push('&to=');
            urlbuf.push(to);

            var accountName = (panel.cbAccount.getValue()).split(global_AccountSeparator);
            if (accountName.length > 0) {
                urlbuf.push('&bc=' + accountName[accountName.length - 1].trim());
            }

            var url = urlbuf.join('');

            panel.store.removeAll();
            panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));

            Ext.Ajax.request({
                url: url,
                method: 'GET',
                success: function (response) {

                    var text = response.responseText;
                    var obj = null;
                    try {
                        obj = Ext.decode(text);
                    } catch (e) {
                        debug(e);
                    }

                    if (obj != null) {

                        panel.updateOrdHis(obj, panel.fr, panel.to);

                        //panel.stkcodes = [];

                        // conn.updateFieldList();
                        // conn.updateStkCodes();
                        // conn.subscribeFeed();
                    }

                    panel.updateSummary();
                    panel.calculateTotOrdValue();
                    
                    panel.paging.doLayout();
                    panel.setLoading(false);
                },
                failure: function (response) {
                    panel.setLoading(false);
                    //helper.setHtml(panel.getView(), '<div class="x-grid-empty">No results found</div>');
                    helper.setGridEmptyText(panel, panel.emptyText);
                }
            });

        } catch (e) {
            debug(e);
        }
    },
    getUpdateOrdHisData: function (d, stkEx) {
        var panel = this;

        var o = {
            tn: d.tn,
            ac: d.ac,
            an: d.an,
            on: d.on,
            son: d.son,
            sc: d.sc,
            sy: d.sy,
            sn: d.an,
            act: d.act,
            tm: d.tm,
            dt: d.dt,
            vd: d.vd,
            st: d.st,
            stc: d.stc,
            sts: d.sts,
            rmk: d.rmk,
            oq: d.oq,
            op: d.op,
            mq: d.mq,
            mp: d.mp,
            mv: d.mv,
            uq: d.uq,
            cq: d.cq,
            ed: d.ed,
            eq: d.eq,
            cr: d.cr,
            ex: stkEx,
            ot: d.ot,
            minq: d.minq,
            dq: d.dq,
            sl: d.sl,
            ls: d.ls,
            ordercond: d.ordercond,
            lut: d.lut,
            tptype: d.tptype,
            tpdirection: d.tpdirection,
            bc: d.bc,
            accN: d.accN
        };
        return o;
    },
    addNewData: function (newObj, arr, stkEx) {
        var panel = this;

        var blnPass = false;
        if (panel.filterExtOpt == '0') {
            blnPass = true;
        }

        else {
            // filter by exchange
            if (stkEx == panel.filterExtOpt) {
                blnPass = true;
            } else {
                var stockCodeIndex = stkEx.toLowerCase().indexOf('d');
                var filterCodeIndex = panel.filterExtOpt.toLowerCase().indexOf('d');

                if (stockCodeIndex != -1 || filterCodeIndex != -1) {
                    if (stockCodeIndex != -1) {
                        stkEx = stkEx.substring(0, stockCodeIndex);
                    }

                    var filterCode = '';
                    if (filterCodeIndex != -1) {
                        filterCode = panel.filterExtOpt.substring(0, filterCodeIndex);
                    } else {
                        filterCode = panel.filterExtOpt;
                    }

                    if (filterCode.toLowerCase() == stkEx.toLowerCase()) {
                        blnPass = true;
                    }
                }
            }
        }

        if (blnPass == true) {
            arr.push(newObj);
            panel.appendExchangelist(stkEx);
        }
    },
    updateOrdHis: function (obj, dateTo, dateFrm) {
        // filter records  
        var panel = this;
        if (obj == null || obj.s == false) {
            //helper.setHtml(panel.getView(), '<div class="x-grid-empty">No results found</div>');
            helper.setGridEmptyText(panel, panel.emptyText);
            return;
        }

        var newArr = [];
        if (obj.os != null) {
            var datas = obj.os;
            for (var i = 0; i < datas.length; i++) {
                var d = datas[i];

                if (panel.ordPriceDecimal.length > 0) {
                    d.op = panel.formatDecimal(d.op, panel.ordPriceDecimal);
                }

                if (panel.stopLimitDecimal.length > 0) {
                    d.sl = panel.formatDecimal(d.sl, panel.stopLimitDecimal);
                }

                var newObj;
                if (this.filterOpt == "0") {
                    var stkEx = panel.getExchangeType(d.sc);
                    newObj = panel.getUpdateOrdHisData(d, stkEx);
                    //newObj.ex= d.ex;	// this ex is base by Account Ex (if KL means KL all the stock will be same)
                    panel.addNewData(newObj, newArr, stkEx);
                }

                else if (this.filterOpt == '2') { //Open Orders
                    if (d.st == '7' || d.st == 'A' || d.st == '0' || d.st == '1' || d.st == '5' || d.st == '6' || d.st == 'E') {
                        var stkEx = panel.getExchangeType(d.sc);
                        newObj = panel.getUpdateOrdHisData(d, stkEx);
                        //newObj.ex= d.ex;	// this ex is base by Account Ex (if KL means KL all the stock will be same)
                        panel.addNewData(newObj, newArr, stkEx);
                    }
                }

                else if (this.filterOpt == '3') { //Filled Orders
                    if (d.st == '3' || d.st == '2' || (d.st == 'C' && d.mq > 0)) {
                        var stkEx = panel.getExchangeType(d.sc);
                        newObj = panel.getUpdateOrdHisData(d, stkEx);
                        //newObj.ex= d.ex;	// this ex is base by Account Ex (if KL means KL all the stock will be same)
                        panel.addNewData(newObj, newArr, stkEx);
                    }
                }

                else if (this.filterOpt == '1') { //Active Orders
                    if (d.st == '0' || d.st == '5' || d.st == '6' || d.st == 'E' || d.st == '1' || d.st == 'NEW') {
                        var stkEx = panel.getExchangeType(d.sc);
                        newObj = panel.getUpdateOrdHisData(d, stkEx);
                        //newObj.ex= d.ex;	// this ex is base by Account Ex (if KL means KL all the stock will be same)
                        panel.addNewData(newObj, newArr, stkEx);
                    }
                }

                else if (this.filterOpt == "4") {//Inactive Orders
                    if (d.st == '3' || d.st == '4' || d.st == '8' || d.st == '9' || d.st == 'C') {
                        var stkEx = panel.getExchangeType(d.sc);
                        newObj = panel.getUpdateOrdHisData(d, stkEx);
                        //newObj.ex= d.ex;	// this ex is base by Account Ex (if KL means KL all the stock will be same)
                        panel.addNewData(newObj, newArr, stkEx);
                    }
                }
            }
        }

        var jsonObj = {
            s: obj.s,
            c: newArr.length,
            os: newArr
        };

        if (this.filterOpt == '0' && newArr.length == 0) {
            //helper.setHtml(panel.getView(), '<div class="x-grid-empty">No order history found between  ' + dateTo + ' and ' + dateFrm + '. Kindly try again shortly.</div>');
            helper.setGridEmptyText(panel, languageFormat.getLanguage(30503, 'No order history found between [PARAM0] and [PARAM1]. Kindly try again shortly', dateTo + '|' + dateFrm));
            return;
        }
        else if (this.filterOpt == '3' && newArr.length == 0) {
            //.setHtml(panel.getView(), '<div class="x-grid-empty">No filled order history found between ' + dateTo + ' and ' + dateFrm + '. Kindly try again shortly.</div>');
            helper.setGridEmptyText(panel, languageFormat.getLanguage(30504, 'No filled order history found between [PARAM0] and [PARAM1]. Kindly try again shortly', dateTo + '|' + dateFrm));
            return;
        }
        else if (this.filterOpt == '2' && newArr.length == 0) {
            //helper.setHtml(panel.getView(), '<div class="x-grid-empty">No open order history found between ' + dateTo + ' and ' + dateFrm + '. Kindly try again shortly.</div>');
            helper.setGridEmptyText(panel, languageFormat.getLanguage(30505, 'No open order history found between [PARAM0] and [PARAM1]. Kindly try again shortly', dateTo + '|' + dateFrm));
            return;
        }
        else if (this.filterOpt == '1' && newArr.length == 0) {
            //helper.setHtml(panel.getView(), '<div class="x-grid-empty">No active order history found between ' + dateTo + ' and ' + dateFrm + '. Kindly try again shortly.</div>');
            helper.setGridEmptyText(panel, languageFormat.getLanguage(30506, 'No active order history found between [PARAM0] and [PARAM1]. Kindly try again shortly', dateTo + '|' + dateFrm));
            return;
        }
        else if (this.filterOpt == '4' && newArr.length == 0) {
            //helper.setHtml(panel.getView(), '<div class="x-grid-empty">No inactive order history found between ' + dateTo + ' and ' + dateFrm + '. Kindly try again shortly.</div>');
            helper.setGridEmptyText(panel, languageFormat.getLanguage(30507, 'No inactive order history found between [PARAM0] and [PARAM1]. Kindly try again shortly', dateTo + '|' + dateFrm));
            return;
        }

        if (this.stkcodes == null)
            this.stkcodes = [];
        else
            this.stkcodes = this.stkcodes.slice(this.stkcodes.length);

        var helpObj = null;
        if (newArr != null && newArr.length > 0) {
            helpObj = {};
            for (var i = 0; i < newArr.length; i++) {
                var d = newArr[i];
                var stkcode = d.sc;
                if (stkcode) {
                    this.stkcodes.push(stkcode);
                    var dObj = {};
                    dObj[fieldStkCode] = stkcode;
                    dObj[fieldLotSize] = d.ls;
                    dObj[fieldCurrency] = d.cr;

                    helpObj[stkcode] = dObj;
                }
            }
        }
        
        resetGridScroll(panel);
        this.getStore().loadRawData(jsonObj);
        activateRow(panel);
        
        if (helpObj) {
            Storage.updateHelpObj(helpObj);
        }

        patchFirstLoad(panel);
        
        n2ncomponents.activateEmptyScreens();

        // Storage.generateSubscriptionByList(panel.stkcodes, panel);

    },
    switchRefresh: function() {
        var panel = this;

        reactivateRow(panel);
    },
    updateFeedRecord: function (dataObj) {

        //console.log(" updateFeedRecord -- ");

//	try {
//		var success = obj.s;
//        if (success != true) return;
//        
//        var colmap = this.columnmap;
//        var lastIdx = colmap.cmap_osLast;
//        //var lacpIdx = this.columnmap['lacp'];
//        var store = this.getStore();
//        var datas = obj.d;
//        var total = (pagingMode == true) ? store.getTotalCount() : store.getCount();
//        if (datas != null && store && total > 0) {
//
//    		var cm = this.getColumnModel();
//    		
//        	var totData = datas.length;
//            for (var i = 0; i < totData; i++) {
//                var d = datas[i];
//                var stkcode = d[fieldStkCode];
//                if(stkcode == null)
//                	continue;
//                
//                for(var j=0; j<total; j++) {
//                    var rec;
//                    if (pagingMode) rec = store.allData.get(j);
//                    else rec = store.getAt(j);
//                    
//                    if (rec == null) continue;
//
//            		var recData = rec.data;
//
//            		if (recData.sc == stkcode) {
//            			
//            			var row = j;
//            			var vrow = store.find('sc', stkcode, j);
//
//                		var lacp = d[fieldLacp];
//                		if (lacp != null && lacp != recData.LACP) {
//                			lacp = this.formatDecimal(lacp);
//                			recData.LACP = lacp;
//                		}
//
//                		var last = d[fieldLast];
//                		if (isNaN(last) || last == 0)
//                			last = d[fieldLacp];
//
//                		if (last != null && last != recData.Last && last > 0) {
//                			
//                			var oldlast = recData.Last;
//                			recData.Last = last;
//                			last = this.formatDecimal(last);
//                			if (lastIdx != -1) {
//                				if (last != oldlast && vrow != -1) {
//                					this.updateCell(vrow, lastIdx, this.printPrice(last, null, rec));
//                					if (!cm.isHidden(lastIdx) && oldlast) {
//                						if (last > oldlast) this.blink(vrow, lastIdx, cBUp);
//                						else if (last < oldlast) this.blink(vrow, lastIdx, cBDown);
//                					}
//                				}
//                			}
//                		}
//
//                		var lotsize = d[fieldLotSize];
//                		if (lotsize != null && lotsize != recData.LotSize)
//                			recData.LotSize = lotsize;
//                		var currency = d[fieldCurrency];
//                		if (currency != null && currency != recData.cr)
//                			recData.cr = currency;
//                	}
//                }
//            }
//            this.updateSummary();
//        }
//	} catch (e) {
//		//console.log(e);
//	}
    },
    selectRecord: function (ridx) {
        var store = this.store;

        var btnDetail = this.down('#oh_btnDetail');
        if (store.getCount() > 0) {
            if (btnDetail != null)
                btnDetail.enable();
            var recData = store.getAt(ridx).data;
            this.tktno = recData.TktNo;
            this.ordno = recData.OrdNo;
            this.stkname = recData.StkName;
        } else {
            if (btnDetail != null)
                btnDetail.disable();
        }
    },
    formatDate: function (date) {
        // this format to change date frm dd/mm/yyyy format to yyyymmdd to cater for url for atp/history? :)
        date += '';
        var d = date.split('/');
        var d1 = d[0];
        var d2 = d[1];
        var d3 = d[2];
        return d3 + d2 + d1;
    },
    formatTime: function (time) {
        time += '';
        if (time.length > 8) {
            var hours = time.substr(8, 2);
            var mins = time.substr(10, 2);
            var secs = time.substr(12, 2);
            time = hours + ':' + mins + ':' + secs;
        }
        return time;
    },
    updateColumnMap: function () {
        var panel = this;

        var map = (panel.columnmap == null ? {} : panel.columnmap);
        var cm = panel.getView().getHeaderCt();
        var colcount = cm.getColumnCount();

        for (var i = 0; i < colcount; i++) {
            var id = cm.getHeaderAtIndex(i).getItemId();
            //this columnmap id = current index of column of that id
            map[id] = cm.getHeaderAtIndex(i).getIndex();
        }

        panel.columnmap = map;
    },
    getViewExchangeList: function () { //1.3.25.36 get all view exchange
        var panel = this;
        var viewList = confViewEx;

        if (viewList != null) {
            var tempExchangeList = viewList.split(',');
        }
        return tempExchangeList;
    },
    /**
     * Description <br/>
     * 
     * 		call ajax to pass new field list to server to retrieve field list record
     * 
     * @param fieldList : string
     */
    changeField: function (fieldList) {
        var panel = this;

        Storage.generateSubscriptionByList(panel.stkcodes, panel);
        
        /*
        var urlbuf = [];
        urlbuf.push(addPath + 'tcplus/field?');
//	urlbuf.push('s=' + dwr.engine._scriptSessionId);

        if (panel.stkcodes != null)
            urlbuf.push('&l=' + panel.stkcodes.join(','));

        urlbuf.push('&f=' + fieldList);
        urlbuf.push('&t=q');

        var url = urlbuf.join('');

        Ext.Ajax.request({
            url: url,
            method: 'POST',
            success: function (response) {
                if (response != null) {
                    var obj = null;
                    try {
                        obj = Ext.decode(response.responseText);
                        panel.updateFeed(obj);
                    } catch (e) {
                    }
                }
            }
        });
        */
    },
    getFieldList: function (type) {
        var panel = this;

        var returnArray = [fieldLast, fieldLacp, fieldPrev, fieldLotSize, fieldCurrency, fieldInstrument];
        //var columnModel = panel.getColumnModel();
        var columnModel = helper.getGridColumns(panel);//panel.getView().getHeaderCt();
        var n = columnModel.length;//columnModel.getColumnCount();

        for (var i = 0; i < n; i++) {
            var storeValue = null;

            // verify the column is hidden or show
            if (!columnModel[i].isHidden()) {
                // retrieve the column data index
                var dataIndex = columnModel[i].dataIndex;
                if (dataIndex == fieldLast)
                    storeValue = fieldLast;

                else
                    storeValue = dataIndex;

                if (storeValue != null) {
                    var j = returnArray.indexOf(storeValue);
                    if (j < 0)
                        returnArray.push(storeValue);
                }
            }
        }

        if (type == 'param')
            return returnArray.join('~');

        return returnArray;
    },
    onRowDblClick: function (func) {
        this.on('rowdblclick', func);
    },
    onCellClick: function (func) {
        this.on('cellclick', func);
    },
    getExchangeType: function (stockcode) {	// from stockcode to get Stock Exchange
        if (stockcode != undefined && stockcode != null) {
            var tmpV = stockcode.split(".");
            var tmpType = tmpV[tmpV.length - 1];
            return tmpType;
        } else {
            return '';
        }
    },
    /*
     disableRightFunction: function(stk) {	// applicable for outbound some exchange does not have data
     var exCode = this.getExchangeType(stk);
     if (exCode == "A" || exCode == "AD" || exCode == "N" || exCode == "ND" || exCode == "O" || exCode == "OD") {
     btn = this.contextMenu.get(this.menuChartId);
     btn.disable();
     btn = this.contextMenu.get(this.menuStkTrackerId);
     btn.disable();
     } else {
     btn = this.contextMenu.get(this.menuChartId);
     btn.enable();
     btn = this.contextMenu.get(this.menuStkTrackerId);
     btn.enable();
     }
     },
     */
    disableRightFunction: function (stk) {
        var panel = this;

        var intradayChartBtn = panel.contextMenu.getComponent(panel.menuChartId);
        var trackerBtn = panel.contextMenu.getComponent(panel.menuStkTrackerId);
        var stkEx = formatutils.getExchangeFromStockCode(stk);

        var menuList = new Array();
        menuList.push(intradayChartBtn.text);

        var newItemList = determineItem(menuList, stkEx); // verify from main.js
        for (var i = 0; i < newItemList.length; i++) {
            var obj = newItemList[i];
            if (obj.name == intradayChartBtn.text) {
                if (obj.status) {
                    intradayChartBtn.enable();
                } else {
                    intradayChartBtn.disable();
                }
            } else if (obj.name == trackerBtn.text) {
                if (obj.status) {
                    trackerBtn.enable();
                } else {
                    trackerBtn.disable();
                }
            }
        }
    },
// region start custom column functions
    showColumnSetting: function () {
        var panel = this;
        colutils.displayWindow(panel);
    },
    allColumnSetting: function () {
        var allColumnId = global_OHAllColumn;
        //	return colutils.filterColumnId(allColumnId);
        return allColumnId;
    },
    defaultColumnSetting: function () {
        var defaultColumnId = global_OHDefaultColumn;
        //	return colutils.filterColumnId(defaultColumnId);
        return defaultColumnId;
    },
    currentColumnSetting: function () {
        var currentColumnId = orderHisCol;

        // verify is new setting or old setting 
        var temp = currentColumnId.split("~");
        var indexNumber = temp.indexOf(colutils.ColumnVersion);
        if (indexNumber != -1) {
            temp.splice(indexNumber, 1);
            currentColumnId = temp.join('~');
        } else {
            currentColumnId = "";
        }

        //	return colutils.filterColumnId(currentColumnId);
        return currentColumnId;
    },
    requiredColumnSetting: function () {
        return orderHisReqCol;
    },
    /**
     * convert id to string 
     * 
     * @param id : string
     * 
     * @return String
     */
    generateColumnName: function (id) {
        switch (id) {
            case cmap_osAccNo:
                return languageFormat.getLanguage(10901, 'Acc.No');
            case cmap_osOrdNo:
                return languageFormat.getLanguage(10902, 'OrdNo');
            case cmap_osStkCode:
                return languageFormat.getLanguage(10101, 'Code');
            case cmap_osStkName:
                return languageFormat.getLanguage(10102, 'Symbol');
            case cmap_osOrdTime:
                return languageFormat.getLanguage(10904, 'OrdTime');
            case cmap_osOrdDate:
                return languageFormat.getLanguage(10913, 'OrdDate');
            case cmap_osAction:
                return languageFormat.getLanguage(20832, 'Action');
            case cmap_osType:
                return languageFormat.getLanguage(10905, 'OrdType');
            case cmap_osValidity:
                return languageFormat.getLanguage(20838, 'Validity');
            case cmap_osStsCode:
                return languageFormat.getLanguage(10914, 'StsCode');
            case cmap_osStatus:
                return languageFormat.getLanguage(10906, 'Status');
            case cmap_osOrdQty:
                return languageFormat.getLanguage(10907, 'OrdQty');
            case cmap_osOrdPrc:
                return languageFormat.getLanguage(10908, 'OrdPrice');
            case cmap_osMtQty:
            	return languageFormat.getLanguage(10938, 'TotalMatchQty');
            case cmap_osMtPrc:
                return languageFormat.getLanguage(10910, 'AvgPrice');
            case cmap_osMchVal:
                return languageFormat.getLanguage(10911, 'MatchVal');
            case cmap_osUnMchQty:
                return languageFormat.getLanguage(10915, 'UnmatchQty');
            case cmap_osCncQty:
                return languageFormat.getLanguage(10916, 'CancelQty');
            case cmap_osExpDate:
                return languageFormat.getLanguage(10917, 'ExpDate');
            case cmap_osExpQty:
                return languageFormat.getLanguage(10918, 'ExpQty');
            case cmap_osCurrency:
                return languageFormat.getLanguage(10919, 'SettCurr');
            case cmap_osExCode:
                return languageFormat.getLanguage(10126, 'Exchg');
            case cmap_osLast:
                return languageFormat.getLanguage(10113, 'Last');
            case cmap_osMinQty:
                return languageFormat.getLanguage(10920, 'MinQty');
            case cmap_osDsQty:
                return languageFormat.getLanguage(10921, 'DisclosedQty');
            case cmap_osStopLimit:
                return languageFormat.getLanguage(10922, 'TriggerPrice');
            case cmap_osRemark:
                return languageFormat.getLanguage(10133, 'Remark');
            case cmap_osAccountName:
                return languageFormat.getLanguage(10932, 'AccName');
            case cmap_osSettOpt:
                return languageFormat.getLanguage(10923, 'SettMode');
            case cmap_osOrderValue:
                return languageFormat.getLanguage(10924, 'OrdValue');
            case cmap_osLotSize:
                return languageFormat.getLanguage(10712, 'Lot.Size');
            case cmap_osLACP:
                return languageFormat.getLanguage(10106, 'LACP');
            case cmap_osTradeCurrency:
                return languageFormat.getLanguage(10925, 'TradeCurr');
            case cmap_osTradeCound:
                return languageFormat.getLanguage(20848, 'Short Sell');
            case cmap_osLastUpdateTime:
                return languageFormat.getLanguage(10926, 'LastUpdate');
            case cmap_osBranchCode:
                return languageFormat.getLanguage(10933, 'BCode');
            case cmap_osBrokerCode:
                return languageFormat.getLanguage(10934, 'BrokerCode');
            case cmap_osTPType:
                return languageFormat.getLanguage(10935, 'TPType');
            case cmap_osTPDirection:
                return languageFormat.getLanguage(10936, 'TPDirection');
            case cmap_osQtyTodayMatch:
            	return languageFormat.getLanguage(10937, 'TodayQtyMatch');
        }
        return '';
    },
    saveColumn: function(newColumnIdArr) {
        var panel = this;

        panel._updatedCols = panel.generateColumnsArray(colutils.generateColumnArray(panel, newColumnIdArr));
        panel.reconfigure(null, panel._updatedCols);
        panel.requestSaveColumns(newColumnIdArr);
    },
    requestSaveColumns: function(newColumnIdArr) {
        var panel = this;

        conn.updateFieldList();
        // update field id - call to server what column is display
        panel.changeField(panel.getFieldList());
        newColumnIdArr = newColumnIdArr + "~" + colutils.ColumnVersion;
        orderHisCol = newColumnIdArr; // orderHisCol is from main.jsp
        colutils.saveColumn(ohColSetting, newColumnIdArr);
    },
    /**
     * generate column setting
     * 
     * @return string / null
     */
    generateColumnID: function () {
        var panel = this;

        var columnModel = panel.getView().getHeaderCt();

        if (columnModel != null && osColSetting != null && osColSetting != '') { // verify from main.jsp
            var p = [];
            var param = '';
            var n = columnModel.getColumnCount();
            for (var i = 1; i < n; i++) {
                var colId = columnModel.getHeaderAtIndex(i).getItemId();
                if (!columnModel.isHidden(i))
                    p.push(colId);
            }

            param = p.join('~');
            return param;
        }

        return null;
    },
    /**
     * generate grid panel column header
     * 
     * @return array
     */
    generateColumnsArray: function (colSettingList) {
        var panel = this;

        var fmtHelper = function (value, meta, record, format, convert) {
            var returnValue = value;

            var cssClass = N2NCSS.CellDefault;

            if (format == 'stkcode' || format == 'stkname') {
                var idx = returnValue.lastIndexOf('.');
                if (idx >= 0)
                    returnValue = returnValue.substring(0, idx);
            }

            if (convert == 'string') {
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontColorString;
            } else if (convert == "unchange") {
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontUnChange;
            }
            else if (convert == 'ordno') {
                cssClass += " " + N2NCSS.FontColorString;
                cssClass += " " + N2NCSS.FontStockName;
            }
            else if (convert == 'stkname') {
                cssClass += " " + N2NCSS.FontColorString;
                cssClass += " " + N2NCSS.FontStockName;
            }
            else if (convert == 'time') {
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontColorString;

                var timeObj = null;
                if (returnValue != null) {
                    if (returnValue.indexOf(':') != -1) {
                        var tempTime = (returnValue).split(':');
                        timeObj = new Date();
                        timeObj.setHours(tempTime[0]);
                        timeObj.setMinutes(tempTime[1]);
                        timeObj.setSeconds(tempTime[2]);
                    }
                }

                if (timeObj != null) {
                    vareturnValuelue = Ext.Date.format(timeObj, global_TimeFormat);
                }
            }
            else if (convert == 'orddate') {
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontColorString;

                var dateObj = null;
                if (returnValue != null) {
                    if (returnValue.indexOf('-') != -1) {
                        var tempDate = (returnValue).split('-');
                        dateObj = new Date(tempDate[0], (tempDate[1] - 1), tempDate[2]);
                    }
                }

                if (dateObj != null) {
                    returnValue = Ext.Date.format(dateObj, global_DateFormat);
                }
            }
            else if (convert == 'number') {
                cssClass += " " + N2NCSS.FontString;
                if (isNumberYellowColumn) {
                    cssClass += " " + N2NCSS.FontUnChange_yellow;
                } else {
                    cssClass += " " + N2NCSS.FontUnChange;
                }
                value = panel.printNumber(value);
            }
            else if (convert == 'price') {

//			var tempObj = formatutils.procPriceValue(returnValue);

                cssClass += " " + N2NCSS.FontString;
//			if (!tempObj.validation) {
//				cssClass += " " + N2NCSS.FontUnChange;
//			} else {
                if (parseFloat(record.data[fieldLast]) > parseFloat(record.data[fieldLacp])) {
                    cssClass += " " + N2NCSS.FontUp;
                } else if (parseFloat(record.data[fieldLast]) < parseFloat(record.data[fieldLacp]) && parseFloat(record.data[fieldLast]) != 0) {
                    cssClass += " " + N2NCSS.FontDown;
                } else {
                    cssClass += " " + N2NCSS.FontUnChange;
                }
//			}
//			returnValue = tempObj.value;
            }
            else if (convert == 'expdate') {
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontColorString;

                returnValue = stockutil.formatExpDate(returnValue);
            }

            meta.css = cssClass;

            return returnValue;
        };

        var columnList = [];
        for (var i = 0; i < colSettingList.length; i++) {
            var colObj = colSettingList[i];
            var columnID = colObj.column;
            var columnVisible = colObj.visible ? false : true;
            //var hd = panel.generateColumnName(columnID);

            var colItemId = panel._idPrefix + columnID;
            switch (columnID) {
                case cmap_osAccNo:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10901, 'Acc.No'),
                        dataIndex: 'an',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;

                case cmap_osOrdNo:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10902, 'OrdNo'),
                        dataIndex: 'on',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'ordno');
                        }
                    });
                    break;

                case cmap_osStkCode:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10101, 'Code'),
                        dataIndex: 'sc',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, 'stkcode', 'stkname');
                        }
                    });
                    break;

                case cmap_osStkName:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10102, 'Symbol'),
                        dataIndex: 'sy',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, 'stkname', 'stkname');
                        }
                    });
                    break;

                case cmap_osOrdTime:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10904, 'OrdTime'),
                        dataIndex: 'tm',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'center',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'time');
                        }
                    });
                    break;

                case cmap_osOrdDate:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10913, 'OrdDate'),
                        dataIndex: 'dt',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'center',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'orddate');
                        }
                    });
                    break;

                case cmap_osAction:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(20832, 'Action'),
                        dataIndex: 'act',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;

                case cmap_osType:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10905, 'OrdType'),
                        dataIndex: 'ot',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;

                case cmap_osValidity:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(20838, 'Validity'),
                        dataIndex: 'vd',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;

                case cmap_osStsCode:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10914, 'StsCode'),
                        dataIndex: 'stc',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;

                case cmap_osStatus:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10906, 'Status'),
                        dataIndex: 'sts',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;

                case cmap_osOrdQty:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10907, 'OrdQty'),
                        dataIndex: 'oq',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            value = panel.returnNumberFormat(value, panel.getWidth(cmap_osOrdQty));
                            return fmtHelper(value, meta, record, '', 'number');
                        }
                    });
                    break;

                case cmap_osOrdPrc:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10908, 'OrdPrice'),
                        dataIndex: 'op',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'price');
                        }
                    });
                    break;

                case cmap_osMtQty:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10938, 'TotalMatchQty'),
                        dataIndex: 'mq',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            value = panel.returnNumberFormat(value, panel.getWidth(cmap_osMtQty));
                            return fmtHelper(value, meta, record, '', 'number');
                        }
                    });
                    break;

                case cmap_osMtPrc:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10910, 'AvgPrice'),
                        dataIndex: 'mp',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'price');
                        }
                    });
                    break;

                case cmap_osMchVal:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10911, 'MatchVal'),
                        dataIndex: 'mv',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            value = panel.returnNumberFormat(value, panel.getWidth(cmap_osMchVal));
                            return fmtHelper(value, meta, record, '', 'price');
                        }
                    });
                    break;

                case cmap_osUnMchQty:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10915, 'UnmatchQty'),
                        dataIndex: 'uq',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            value = panel.returnNumberFormat(value, panel.getWidth(cmap_osUnMchQty));
                            return fmtHelper(value, meta, record, '', 'number');
                        }
                    });
                    break;

                case cmap_osCncQty:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10916, 'CancelQty'),
                        dataIndex: 'cq',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            value = panel.returnNumberFormat(value, panel.getWidth(cmap_osCncQty));
                            return fmtHelper(value, meta, record, '', 'number');
                        }
                    });
                    break;

                case cmap_osExpDate:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10917, 'ExpDate'),
                        dataIndex: 'ed',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'expdate');
                        }
                    });
                    break;

                case cmap_osExpQty:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10918, 'ExpQty'),
                        dataIndex: 'eq',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            value = panel.returnNumberFormat(value, panel.getWidth(cmap_osExpQty));
                            return fmtHelper(value, meta, record, '', 'number');
                        }
                    });
                    break;

                case cmap_osCurrency:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10919, 'SettCurr'),
                        dataIndex: 'cr',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;

                case cmap_osExCode:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10126, 'Exchg'),
                        dataIndex: 'ex',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;

                case cmap_osLast:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10113, 'Last'),
                        dataIndex: 'Last',
                        sortable: true,
                        hidden: true,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'price');
                        }
                    });
                    break;

                case cmap_osMinQty:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10920, 'MinQty'),
                        dataIndex: 'minq',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            value = panel.returnNumberFormat(value, panel.getWidth(cmap_osMinQty));
                            return fmtHelper(value, meta, record, '', 'number');
                        }
                    });
                    break;

                case cmap_osDsQty:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10921, 'DisclosedQty'),
                        dataIndex: 'dq',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            value = panel.returnNumberFormat(value, panel.getWidth(cmap_osDsQty));
                            return fmtHelper(value, meta, record, '', 'number');
                        }
                    });
                    break;

                case cmap_osStopLimit:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10922, 'StopLimit'),
                        dataIndex: 'sl',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'price');
                        }
                    });
                    break;

                case cmap_osLotSize:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10712, 'Lot.Size'),
                        dataIndex: 'ls',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'center',
                        renderer: function (value, meta, record) {
                            value = panel.returnNumberFormat(value);
                            return fmtHelper(value, meta, record, '', 'number');
                        }
                    });
                    break;
                case cmap_osTradeCound:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(20848, 'Short Sell'),
                        dataIndex: 'ordercond',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'center',
                        renderer: function (value, meta, record) {
                            var newValue = fmtHelper(value, meta, record, '', 'string');

                            if (newValue == null) {
                                newValue = '-';

                            } else {

                                if (newValue == '') {
                                    newValue = '-';

                                } else {

                                    if (newValue == '8192') {
                                        newValue = 'Y';

                                    } else {
                                        newValue = '-';
                                    }
                                }
                            }

                            return newValue;
                        }
                    });
                    break;
                case cmap_osSettOpt:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10923, 'SettMode'),
                        dataIndex: 'setO',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;
                case cmap_osLastUpdateTime:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10926, 'LastUpdate'),
                        dataIndex: 'lut',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'expdate');
                        }
                    });
                    break;
                case cmap_osTPType:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10935, 'TPType'),
                        dataIndex: 'tptype',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;
                case cmap_osTPDirection:
                    columnList.push({
                        itemId: colItemId,
                        header: languageFormat.getLanguage(10936, 'TPDirection'),
                        dataIndex: 'tpdirection',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;
                case cmap_osQtyTodayMatch:
                    columnList.push({
                        id: colItemId,
                        header: languageFormat.getLanguage(10937, 'TodayQtyMatch'),
                        dataIndex: 'qtytm',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                        	value = panel.returnNumberFormat(value, panel.getWidth(cmap_osQtyTodayMatch));
                            return fmtHelper(value, meta, record, '', 'number');
                        }
                    });
                    break;
            }
        }

        return columnList;
    },
    storeReader: function () {
        var panel = this;
        var reader = new Ext.data.reader.Json({
            idProperty: 'tn',
            rootProperty: 'os',
            totalProperty: 'c', // os,,c ,s  according to result frm ajax request...if we create an obj and load it ...then we map back the name of variable accordingly
            successProperty: 's'

        });
        return reader;
    },
    /**
     * Description <br/>
     * 
     * 
     * return number format
     * 
     * 
     * @param {string/integer}
     *            value value to convert format
     * 
     * @param {integer}
     *            columnWidth
     */
    returnNumberFormat: function (value, columnWidth) {
        var panel = this;

        if (viewInLotMode) {
            value = formatutils.formatNumberLot(value);

        } else {
            value = formatutils.formatNumber(value, columnWidth);

        }

        return value;
    },
    getRecordMapping: function () {
        var o = [
            {name: 'tn', mapping: 'tn', sortType: 'asUCString'},
            {name: 'sc', mapping: 'sc', sortType: 'asUCString'},
            {name: 'sy', mapping: 'sy', sortType: 'asUCString'},
            {name: 'on', mapping: 'on', sortType: 'asUCString'},
            {name: 'an', mapping: 'an', sortType: 'asUCString'},
            {name: 'son', mapping: 'son', sortType: 'asUCString'},
            {name: 'act', mapping: 'act', sortType: 'asUCString'},
            {name: 'tm', mapping: 'tm', sortType: 'asUCString'},
            {name: 'dt', mapping: 'dt', sortType: 'asUCString'},
            {name: 'vd', mapping: 'vd', sortType: 'asUCString'},
            {name: 'st', mapping: 'st', sortType: 'asUCString'},
            {name: 'stc', mapping: 'stc', sortType: 'asUCString'},
            {name: 'sts', mapping: 'sts', sortType: 'asUCString'},
            {name: 'rmk', mapping: 'rmk', sortType: 'asUCString'},
            {name: 'oq', mapping: 'oq', sortType: 'asInt', type: 'int'},
            {name: 'op', mapping: 'op', sortType: 'asFloat'},
            {name: 'mq', mapping: 'mq', sortType: 'asInt', type: 'int'},
            {name: 'mp', mapping: 'mp', sortType: 'asFloat'},
            {name: 'mv', mapping: 'mv', sortType: 'asFloat'},
            {name: 'uq', mapping: 'uq', sortType: 'asInt', type: 'int'},
            {name: 'cq', mapping: 'cq', sortType: 'asInt', type: 'int'},
            {name: 'ed', mapping: 'ed', sortType: 'asUCString'},
            {name: 'eq', mapping: 'eq', sortType: 'asInt', type: 'int'},
            {name: 'cr', mapping: 'cr', sortType: 'asUCString'},
            {name: 'ex', mapping: 'ex', sortType: 'asUCString'},
            {name: 'ot', mapping: 'ot', sortType: 'asUCString'},
            {name: 'Last', mapping: 'Last', sortType: 'asFloat'},
            {name: 'LACP', mapping: 'LACP', sortType: 'asFloat'},
            {name: 'sl', mapping: 'sl', sortType: 'asFloat'},
            {name: 'minq', mapping: 'minq', sortType: 'asInt', type: 'int'},
            {name: 'dq', mapping: 'dq', sortType: 'asInt', type: 'int'},
            {name: 'ls', mapping: 'ls', sortType: 'asInt', type: 'int'},
            {name: 'ordercond', mapping: 'ordercond', sortType: 'asUCString'},
            {name: 'setO', mapping: 'setO', sortType: 'asUCString'},
            {name: 'lut', mapping: 'lut', sortType: 'asUCString'},
            {name: 'tptype', mapping: 'tptype', sortType: 'asUCString'},
            {name: 'tpdirection', mapping: 'tpdirection', sortType: 'asUCString'},
            {name: 'bc', mapping: 'bc', sortType: 'asUCString'},
            {name: 'accN', mapping: 'accN', sortType: 'asUCString'},
            {name: 'qtytm', mapping: 'qtytm', sortType: 'asInt', type: 'int'}
        ];
        return o;
    },
    getAccountValue: function () {
        return this.cbAccount.getRawValue();
    },
    _setCookieId: function () {
        var me = this;
        me.ohckId = cookieKey + '_OrdHistory';
    },
    searchAccount: function (searchValue) {
        var panel = this;
        try {
            panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
            var urlbuf = new Array();

            urlbuf.push(addPath + 'tcplus/atp/searchAcc?');
            urlbuf.push('ExtComp=OrderHistory');
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
                    obj = Ext.decode(text);


                    if (obj && obj.s == true) {
                        if (!obj.ai) {
                            return;
                        }

                        panel.accList = [];

                        var accInfo = obj.ai;
                        var totAcc = accInfo.length;
                        //var allRec = ['', 'Please select account...'];
                        //panel.accList.push(allRec);
                        for (var i = 0; i < totAcc; i++) {
                            var acc = accInfo[i];
                            var accRec = [acc.ac + global_AccountSeparator + acc.bc, acc.ac + ' - ' + acc.an + ' - ' + acc.bc];
                            panel.accList.push(accRec);
                        }

                        panel.cbAccount.store.removeAll();
                        panel.cbAccount.store.loadData(panel.accList);
                        panel.cbAccount.setValue('');
                        panel.tbSearchAccount.setValue('');
                        panel.tbSearchAccount.setHidden(true);
                        panel.cbAccount.setVisible(true);
                        panel.setLoading(false);
                    }
                },
                failure: function (response) {
                    console.log('[Search Account] failed ---> ' + response.responseText);
                    panel.setLoading(false);
                }
            });
        } catch (e) {
            console.log('[Search Account] Exception ---> ' + e);
            panel.setLoading(false);
        }
    },
    autoAdjustWidth: function() {
        var panel = this;

        panel.procColumnWidth();
        panel.reconfigure(null, colutils.getColumnModel(panel, ''));
        panel.tempWidth = cookies.toDefaultColumn(panel, panel.ohckId);
        panel.isImgBlink = false;
        panel.runAutoAdjustWidth = false;
    },
    updateColWidthCache: function(column, newWidth) {
        var panel = this;
        var colId = stockutil.stripItemId(panel._idPrefix, column.getItemId());
        // keeps new width
        panel.columnHash.setItem(colId, newWidth);

        if (global_allowCookies == "TRUE") {
            panel.tempWidth = cookies.procTempCookies(panel, panel.ohckId, colId, newWidth);
            cookies.procCookie(panel.ohckId, panel.tempWidth, cookieExpiryDays);
        }
    }
});
