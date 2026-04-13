Ext.define('TCPlus.view.portfolio.EquityPrtfRealized', {
    extend: 'TCPlus.view.portfolio.Portfolio',
    requires: [
        'TCPlus.view.portfolio.Portfolio'
    ],
    alias: 'widget.equityprtfrealized',
    exchangecode: '',
    currencyRateList: null,
    feedExchangeList: null,
    accNo: '',
    accList: null,
    stkcodes: null,
    prtfList: null,
    refreshTimer: null,
    emptyText: languageFormat.getLanguage(30013,'No Result Found'),
    sort: 'stkname',
    count: 0,
    blinkinterval: 3000,
    blinkTasks: null,
    blinkIntensities: null,
    columnmap: null,
    columnState: 0,
    cbAccount: null,
    cbExchange: null,
    tbSearchAccount: null,
    searchAccountBtn: null,
    filterExtOpt: '0',
    convertCurrencyEnable: false,
    currentCurrency: defCurrency,
    btnRefresh: null,
    searching: false,
    updatingPrtf: false,
    accBalReqId: null,
    prtfReqId: null,
    fieldListReqId: null,
    prtfRetry: 2,
    filterPaymentCodeOpt: '',
    arPaymentCodeList: null,
    tooltip: null,
    columnHash: null,
    tempWidth: null,
    isImgBlink: false,
    portfolioType: 'equityrealized',
    screenType: 'main',
    compRef: {
    },
    _idPrefix: 'rlzpf',
    slcomp: "eqr",
    type: 'rp',
    savingComp: true,
    isFirstTime: true,
    initComponent: function () {
        var panel = this;
        panel.emptyResult = languageFormat.getLanguage(31001, 'Your portfolio is empty.');

        panel._idPrefix = panel.getId();

        if (atpCurrencyRate) {
            if (atpCurrencyRate.obj.size > 0) {
                // this checks ATP is provide the CurrecnyRate?
                // if yes will perform calculation
                // else take default Currency only
                this.convertCurrencyEnable = true;
                this.currencyRateList = atpCurrencyRate.obj;
            }
        }

        panel.procColumnWidth();

        panel.accList = [];
        if (accRet != null) {
            var accInfo = accRet.ai;
            var total = accInfo.length;
            for (var i = 0; i < total; i++) {
                var acc = accInfo[i];
                if (acc.ex != 'MY') {
                    var accRec = [acc.ac + global_AccountSeparator + acc.bc, acc.ac + ' - ' + acc.an + ' - ' + acc.bc]; // #account list separator ('-')
                    panel.accList.push(accRec);
                }
            }
        }

        var accStore;
        if (pagingMode) {
            accStore = new Ext.ux.data.PagingSimpleStore({// TODO
                fields: ['accno', 'name'],
                data: panel.accList,
                lastOptions: {
                    params: {
                        start: 0,
                        limit: 5
                    }
                }
            });
        } else {
        	if(isDealerRemisier){
        		var urlbuf = new Array();

        		urlbuf.push(addPath + 'tcplus/atp/searchAcc?');
        		urlbuf.push('ExtComp=OrderPad');
        		urlbuf.push('&s=');
        		urlbuf.push(new Date().getTime());

        		var url = urlbuf.join('');

        		accStore = Ext.create('Ext.data.Store', {
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
        					//delete panel.cbAccount.lastQuery;
        					if(records){
        						panel.accList = new Array();
        						            					
            					thisStore.filter(function(rec){
            						var ex = rec.get('ex');
            						var cliType = rec.get('cliType');
            						
            						if(ex != 'MY' && cliType != 'D'){
            							var accRec = [rec.get('ac') + global_AccountSeparator + rec.get('bc'), rec.get('ac') + ' - ' + rec.get('an') + ' - ' + rec.get('bc')];
                						panel.accList.push(accRec);
            						}
            						
            						return ex != 'MY' && cliType != 'D';
            					});
        					}
        				}
        			}
        		});
        	}else{
        		accStore = new Ext.data.ArrayStore({
        			fields: ['accno', 'name'],
        			data: panel.accList
        		});
        	}
        }

        this.accNo = ((panel.accList.length > 0 ? panel.accList[0][0] : '')).split(global_AccountSeparator)[0].trim(); // #account list separator ('-')

        this.cbAccount = new Ext.form.field.ComboBox({
            width: 145,
            matchFieldWidth: false,
            listConfig: {
                minWidth: 145,
                cls: 'my-combo-lst'
            },
            selectOnFocus: true,
            forceSelection: !isDealerRemisier,
            queryMode: !isDealerRemisier ? 'local' : 'remote',
            store: accStore,
            displayField: 'name',
            valueField: 'accno',
            pageSize: pagingMode ? 5 : (!isDealerRemisier ? 0 : N2N_CONFIG.constDRPagingSize),
            // lazyInit: false,
            emptyText: isDealerRemisier ? languageFormat.getLanguage(20876, 'Search account here.. min ' + N2N_CONFIG.constDRMinChars + ' chars', N2N_CONFIG.constDRMinChars) : languageFormat.getLanguage(20900, 'Please select account...'),
            triggerAction: 'all',
            value: (panel.accList.length > 0 ? panel.accList[0][0] : ''),
            minChars: 999, //set to large number to prevent query from being fired when typing
            listeners: {
            	beforequery: function(qe){
            		if (isDealerRemisier) {
            			//qe.combo.store.proxy.extraParams.query = qe.combo.getValue();
            			if (qe.query.length == 0) {
            				qe.cancel = true;
            			}
            		}
            	},  
                afterrender: function (combo) {
                    if (pagingMode) { // TODO
                        this.pageTb.setVisible(false);

                        new Ext.ux.EditedPagingToolbar({
                            enableOverflow: menuOverflow,
                            // height: 30,
                            store: accStore,
                            displayInfo: false,
                            pageSize: 5,
                            // hideParent:true,
                            // hideLabel:true,
                            // nextText:'Next',
                            renderTo: this.footer
                        });
                    }
                    
                    if(isDealerRemisier){
                    	combo.getStore().on('load', function(thisStore, records) {
                    		if (records) {
                    			if(records.length == 1){
                    				combo.select(records);
                    				combo.collapse();
                    				
                    				var accountParts = combo.getValue().split(global_AccountSeparator);
                                    var thisAccount = accountParts[0].trim();

                                    panel.accNo = thisAccount;
                    				panel.search();
                    			}			  
                    		}
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
                select: function () {
                    var accno = (this.value).split(global_AccountSeparator)[0].trim(); // #account list separator ('-')
                    if (accno != panel.accNo)
                        helper.setHtml(panel.compRef.accBal, '-');
                    panel.accNo = accno;
                    panel.search();
                },
                specialkey: function(thisCb, e) {
                	if (e.getKey() == e.ENTER) {
                		panel.runSearchAccount();
                	}
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
            emptyText: isDealerRemisier ? languageFormat.getLanguage(20876, 'Search account here.. min ' + N2N_CONFIG.constDRMinChars + ' chars', N2N_CONFIG.constDRMinChars) : languageFormat.getLanguage(20900, 'Please select account...'),
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

        panel.arPaymentCodeList = new Array();
        var arPaymentCodeList = '';
        if (atpPaymentCode.size > 0) {
            arPaymentCodeList = atpPaymentCode.mappaymentcode;
        }

        if (arPaymentCodeList && arPaymentCodeList.length > 0) {
            for (var i = 0; i < arPaymentCodeList.length; i++) {
                var pc = arPaymentCodeList[i];
                if (pc && portfolioExcludePayment.indexOf(pc[0]) === -1) {
                    var paymentCodeRec = [pc, pc];
                    panel.arPaymentCodeList.push(paymentCodeRec);
                }
            }
        }

        var filterPaymentCodeStore = new Ext.data.ArrayStore({
            fields: ['code', 'desc'],
            data: panel.arPaymentCodeList
        });

        panel.filterPaymentCodeOpt = ((panel.arPaymentCodeList.length > 0 ? panel.arPaymentCodeList[0][0] : ''));

        panel.cbfilterPaymentCode = new Ext.form.ComboBox({
            editable: false,
//			width: 162,
            width: 120,
            mode: 'local',
            store: filterPaymentCodeStore,
            displayField: 'desc',
            valueField: 'code',
            triggerAction: 'all',
            hidden: showPaymentCode.toLowerCase() == "true" ? false : true,
            value: (panel.arPaymentCodeList.length > 0 ? panel.arPaymentCodeList[0][0] : ''),
            listeners: {
                select: function () {
                    var filterPaymentCodeOpt = this.value;
                    panel.filterPaymentCodeOpt = filterPaymentCodeOpt;
                    //panel.search();
                    panel.localSearch();
                }
            }
        });

        panel.feedExchangeList = [];
        var filterOptExList = [['0', languageFormat.getLanguage(20654, 'All Exchanges')]];
        for (var ii = 0; ii < global_ExchangeList.length; ii++) {
            filterOptExList.push([global_ExchangeList[ ii ].exchange, global_ExchangeList[ ii ].exchangeName]);
        }

        var filterOptStore = new Ext.data.ArrayStore({
            fields: ['id', 'name'],
            data: filterOptExList
        });

        this.cbExchange = new Ext.form.field.ComboBox({
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
                select: function () {
                    panel.filterExtOpt = this.value;
                    panel.localSearch();
                }
            }
        });

        var xtype = 'button';

        this.btnRefresh = {
            text: languageFormat.getLanguage(10008, 'Refresh'),
            tooltip: languageFormat.getLanguage(10008, 'Refresh'),
            xtype: xtype,
            iconCls: 'icon-reset',
            handler: function () {
            	panel.store.clearFilter();
                panel.search();
            }
        };

        var store;
        if (pagingMode) {
            store = new Ext.ux.data.PagingStore({
                model: 'TCPlus.model.EquityPrtfRealizedRecord',
                lastOptions: {
                    params: {
                        start: 0,
                        limit: 10
                    }
                }
            });
        }
        else {
            store = new Ext.data.Store({
                model: 'TCPlus.model.EquityPrtfRealizedRecord'
            });
        }

        // add paging buttons
        var hidePagingBtns = !pagingMode;
        this.tbPrev = {
            id: 'epr_prev',
            xtype: xtype,
            text: languageFormat.getLanguage(20058, 'Prev'),
            hidden: hidePagingBtns,
            listeners: {
                click: function () {
                    panel.previousPage();
                }
            }
        };
        this.tbNext = {
            id: 'epr_next',
            xtype: xtype,
            text: languageFormat.getLanguage(10015, 'Next'),
            hidden: hidePagingBtns,
            listeners: {
                click: function () {
                    panel.nextPage();
                }
            }
        };
        panel.compRef.totalGL = new Ext.form.Label({
            id: 'eqtyPrtfReal_totGL',
            text: '-',
            style: 'white-space:nowrap'
        });

        panel.compRef.topBar = Ext.create('Ext.toolbar.Toolbar', {
            itemId: 'epr_tbar',
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll,
            items: [
                panel.cbAccount,
                //panel.tbSearchAccount,
                panel.searchAccountBtn,
                panel.cbfilterPaymentCode,
                panel.cbExchange,
                new Ext.button.Button({
                    text: languageFormat.getLanguage(10004, 'Export CSV'),
                    tooltip: languageFormat.getLanguage(10004, 'Export CSV'),
                    hidden: !isDesktop,
                    iconCls: 'icon-export',
                    listeners: {
                        click: function () {
                            ExportFile.initial(ExportFile.FILE_CSV, panel);
                        }
                    }

                }),
                '->',
                panel.tbPrev,
                panel.tbNext,
                {
                    id: 'saveSetting_RGL',
                    xtype: xtype,
                    hidden: true,
                    style: "margin-right:10px;",
                    handler: function () {
                        msgutil.confirm(languageFormat.getLanguage(30008, 'You have unsaved settings. Would you like to save your settings?'),
                                function (sResp) {
                                    if (sResp == "yes") {
                                        panel.isImgBlink = false;
                                        cookies.procCookie(panel.prckId, panel.tempWidth, cookieExpiryDays);
                                        panel.tempWidth = cookies.toDefaultColumn(panel, panel.prckId);
                                    } else {
                                        panel.isImgBlink = false;
                                    }
                                }
                        );
                    }
                },
                createAutoWidthButton(panel),
                //createAutoFitButton(panel),
                {
                    id: 'pftbReal_btnColumns',
                    text: languageFormat.getLanguage(10005, 'Columns'),
                    xtype: xtype,
                    iconCls: 'icon-columnsetting',
                    hidden: global_showColSettingHeader == "TRUE" ? false : true,
                    handler: function () {
                        panel.showColumnSetting();
                    }
                }
            ]
        });

        if (!isMobile) {
            panel.compRef.topBar.add(panel.btnRefresh);
        }

        this.paging = new Ext.toolbar.Paging({
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll,
            store: store,
            displayInfo: false,
            pageSize: 10,
            listeners: {
                afterrender: function (c) {
                    // hide paging btns
                    var items = c.items;
                    for (var i = 0; i < 11; i++) {
                        var itm = items.items[i];
                        itm.hide();
                    }
                },
                change: function (paging, pagedata) { // TODO
                    var tbar = panel.getTopToolbar();
                    if (pagedata.total > 0) {
                        var page = pagedata.activePage;
                        var lastpage = pagedata.pages;

                        if (pagedata.total <= paging.pageSize) {
                            // disable both
                            tbar.getComponent('epr_prev').disable();
                            tbar.getComponent('epr_next').disable();
                        } else if (page == 1) {
                            // disable prev
                            tbar.getComponent('epr_prev').disable();
                            tbar.getComponent('epr_next').enable();
                        } else if (page == lastpage) {
                            // disable next
                            tbar.getComponent('epr_prev').enable();
                            tbar.getComponent('epr_next').disable();
                        } else {
                            // disable none
                            tbar.getComponent('epr_prev').enable();
                            tbar.getComponent('epr_next').enable();
                        }
                        tbar.doLayout();
                        panel.page = page;
                    } else {
                        tbar.getComponent('epr_prev').disable();
                        tbar.getComponent('epr_next').disable();
                    }
                }
            }
        });

        if (isMobile) {
            this.paging.add(panel.btnRefresh);
        }
        this.paging.add([
            '->',
            new Ext.form.Label({
                text: languageFormat.getLanguage(20294, 'Total Gain/Loss') + ' : ',
                style: 'white-space:nowrap'
            }),
            '&nbsp;&nbsp;',
            panel.compRef.totalGL,
            '&nbsp;&nbsp;&nbsp;&nbsp;'
        ]);

        var defaultConfig = {
            border: false,
            header: false,
            width: '100%',
            height: 300,
            title: languageFormat.getLanguage(10807, 'Realised G/L'),
            bodyStyle: 'padding:0px; margin:0px; font-size: 12pt; border: none;',
            store: store,
            keyEnabled: N2N_CONFIG.keyEnabled,
            columns: {
                defaults: {
                    //menuDisabled: true
                	tdCls:'display-render',
                	lockable: false
                },
                items: panel.generateColumnsArray(colutils.generateColumnArray(panel, ""))
            },
            selModel: {
                preventFocus: true
            },
            viewConfig: getGridViewConfig(panel),
            bufferedRenderer: N2N_CONFIG.gridBufferedRenderer,
            leadingBufferZone: N2N_CONFIG.gridLeadingBufferZone,
            trailingBufferZone: N2N_CONFIG.gridTrailingBufferZone,
            columnLines: false,
            enableColumnMove: N2N_CONFIG.gridColMove,
            enableColumnHide: N2N_CONFIG.gridColHide,
            listeners: {
                afterrender: function (thisComp) {
                    panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));

                    // show net cash limit

                    var tbar = panel.compRef.topBar;
                    var lblBal = new Ext.form.Label({
                        text: languageFormat.getLanguage(20193, 'Bal.') + ':',
                        hidden: showBalanceNNetCashLimit == "TRUE" ? false : true
                    });

                    panel.compRef.accBal = new Ext.form.Label({
                        id: 'eqtyPrtfReal_AccBal',
                        text: '-',
                        hidden: showBalanceNNetCashLimit == "TRUE" ? false : true,
                        cls: 'fix_top'
                    });

                    var lblNetCash = new Ext.form.Label(
                            {
                                id: 'eqtyPrtfReal_lbl_NetCashLimit',
                                text: languageFormat.getLanguage(20194, 'Net Cash Limit') + ':',
                                hidden: showBalanceNNetCashLimit == "TRUE" ? false : true,
                                cls: 'fix_top'
                            });

                    panel.compRef.netCashLimit = new Ext.form.Label({
                        id: 'eqtyPrtfReal_NetCashLimit',
                        text: '-',
                        hidden: showBalanceNNetCashLimit == "TRUE" ? false : true,
                        cls: 'fix_top'
                    });

                    tbar.insert(1, ' ');
                    var i = (!isDealerRemisier ? 0 : 2);

                    if (showPaymentCode == "TRUE") {
                        tbar.insert(3 + i, ' ');
                        tbar.insert(5 + i, '-');

                        if (showBalanceNNetCashLimit == "TRUE") {
                            tbar.insert(6 + i, lblBal);
                            tbar.insert(7 + i, ' ');
                            tbar.insert(8 + i, panel.compRef.accBal);
                            tbar.insert(9 + i, '-');
                            tbar.insert(10 + i, lblNetCash);
                            tbar.insert(11 + i, ' ');
                            tbar.insert(12 + i, panel.compRef.netCashLimit);
                            tbar.insert(13 + i, '-');
                        }
                    } else {
                        tbar.insert(4 + i, '-');

                        if (showBalanceNNetCashLimit == "TRUE") {
                            tbar.insert(5 + i, lblBal);
                            tbar.insert(6 + i, ' ');
                            tbar.insert(7 + i, panel.compRef.accBal);
                            tbar.insert(8 + i, '-');
                            tbar.insert(9 + i, lblNetCash);
                            tbar.insert(10 + i, ' ');
                            tbar.insert(11 + i, panel.compRef.netCashLimit);
                            tbar.insert(12 + i, '-');
                        }
                    }

                    tbar.doLayout();

                    thisComp.search();
                    panel.tooltip = new Ext.tip.ToolTip({
                        target: 'saveSetting_RGL',
                        html: languageFormat.getLanguage(30009, 'Click this blinking icon to save the adjusted column width.'),
                        anchor: 'top',
                        showDelay: 0,
                        listeners: {
                            afterrender: function (thisComp) {
                                if (Ext.isIE) {
                                    thisComp.setWidth(thisComp.getWidth() + 3);
                                }
                            }
                        }
                    });
                },
                beforedestroy: function () {
                    Ext.Ajax.abort(panel.prtfReqId);

                    Blinking.resetBlink(panel);
                    if (panel.contextMenu != null) {
                        panel.contextMenu.destroy();
                    }
                    panel.stopRefreshTimer();
                    Storage.generateUnsubscriptionByExtComp(panel);
                },
                columnresize: function (ct, column, newWidth) {
                    if (newWidth === 0) {
                        column.autoSize();
                        newWidth = column.width;
                    }

                    panel.updateColWidthCache(column, newWidth);

                    if (N2N_CONFIG.autoQtyRound) {
                        helper.refreshView(panel);
                    }
                },
                hide: function () {
                    Blinking.resetBlink(panel);
                    panel.store.removeAll();
                },
                itemcontextmenu: function (thisView, record, item, index, e) {
                    if (!touchMode) {
                        var stkCode = record.get('StkCode');
                        if (outbound) {
                            panel.disableRightFunction(stkCode);
                        }

                        panel.showContextMenu(thisView, record, index, e);
                    }
                },
                columnmove: function(){
                	gridColHandler(panel);
                },
                columnshow: function(){
                	gridColHandler(panel);
                	helper.autoFitColumns(panel);
                },
                columnhide: function(){
                	gridColHandler(panel);
                	helper.autoFitColumns(panel);
                },
                resize: function(){
                	bufferedResizeHandler(panel);
                	if (!panel.isFirstTime) {
                            helper.autoFitColumns(panel);
                        }
                }
            },
            tbar: panel.compRef.topBar,
            bbar: panel.paging
        };

        this.createContextMenu();
        Ext.apply(this, defaultConfig);
        this.callParent();

    },
    switchRefresh: function (silent) {
        var panel = this;
        
        reactivateRow(panel);
        panel._getStockData(N2N_CONFIG.gridBufferedRenderer);
        Storage.generateSubscriptionByList(panel.stkcodes, panel);
        helper.runBuffer('prtfRealisedFitScreen');
    },
    callImageBlink: function () {
        var panel = this;
        var btn = Ext.getCmp('saveSetting_RGL');
        if (!panel.isImgBlink) {
            btn.show();
            panel.isImgBlink = true;
            panel.callImg(btn);
        }
    },
    callImg: function (btn) {
        var panel = this;

        var hidden = true;
        var t = 1000;
        if (btn.icon == iconBtnSaveSettingOff) {
            hidden = false;
        }

        panel.imgBlinkTime = setTimeout(function () {
            if (panel.isImgBlink) {
                panel.imgBlink(hidden, btn);
            }
            else {
                btn.hide();
            }
        }, t);
    },
    imgBlink: function (hidden, btn) {
        var panel = this;

        var x;
        if (hidden) {
            btn.setIcon(iconBtnSaveSettingOff);
        }
        else {
            btn.setIcon(iconBtnSaveSetting);
        }

        panel.callImg(btn);
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
            columnID = global_RGLColumnID;
            columnWidth = global_RGLWidth;
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
    getWidth: function (columnID) {
        var panel = this;

        return panel.columnHash.get(columnID) || 60;
    },
    getColumnState: function () {
        return this.columnState;
    },
    shiftColumn: function (state) {
        if (state == null)
            return;
        this.shiftColumn(state);
    },
    setRowClickListener: function (func) {
        var panel = this;
        panel.on('rowclick', func);
    },
    changeExchg: function (val) {
        if (val && val != 'MY') {
            this.exchangecode = val;
        } else {
            alert('Please use Derivatives Portfolio for exchange "'
                    + val + '"');
        }
    },
    onRowDblClick: function (func) {
        this.on('rowdblclick', func);
    },
    onCellClick: function (func) {
        this.on('cellclick', func);
    },
    createContextMenu: function () {
        if (showV1GUI == "TRUE") {
            this.menuBuyId = Ext.id();
            this.menuSellId = Ext.id();
            this.menuReviseId = Ext.id();
            this.menuCancelId = Ext.id();
            this.menuStkInfoId = Ext.id();
            this.menuDepthId = Ext.id();
            this.menuChartId = Ext.id();
            this.menuStkNewsId = Ext.id();
            this.menuStkNewsArchiveId = Ext.id();
            this.menuStkNewsElasticId = Ext.id();
            this.menuNews2Id = Ext.id();
            var menu = this;
            // var tbNews = {
            // id: menu.menuStkNewsId,
            // text:'Stock News',
            // };
            var btns = [{
                    id: menu.menuBuyId,
                    text: languageFormat.getLanguage(10001, 'Buy')
                }, {
                    id: menu.menuSellId,
                    text: languageFormat.getLanguage(10002, 'Sell')
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
                    id: menu.menuStkNewsArchiveId,
                    text: languageFormat.getLanguage(20137, 'News Archive')
                }, {
                    id: menu.menuStkNewsElasticId,
                    text: languageFormat.getLanguage(20140, 'Elastic News')
                }, {
                    id: menu.menuNews2Id,
                    text: languageFormat.getLanguage(20121, 'News')
                }, {
                    id: menu.menuStkNewsId,
                    text: languageFormat.getLanguage(20123, 'Stock News')
                }];
            // if (exchangecode != 'SG') {
            // btns.splice(6, 0, tbNews);
            // }
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
                    popupOnly: true
                });

                this.menuSellId = Ext.id();
                btns.push({
                    id: menu.menuSellId,
                    text: languageFormat.getLanguage(10002, 'Sell'),
                    popupOnly: true
                });
            }

            if (showStkInfoHeader == "TRUE") {
                if (showStkInfoMarketDepth == "TRUE") {
                    this.menuDepthId = Ext.id();
                    btns.push({
                        id: menu.menuDepthId,
                        text: languageFormat.getLanguage(20022, 'Market Depth')
                    });
                }

                if (showStkInfoStkInfo == "TRUE") {
                    this.menuStkInfoId = Ext.id();
                    btns.push({
                        id: menu.menuStkInfoId,
                        text: languageFormat.getLanguage(20021, 'Stock Info')
                    });
                }

                if (showStkInfoTracker == "TRUE") {
                    this.menuStkTrackerId = Ext.id();
                    btns.push({
                        id: menu.menuStkTrackerId,
                        text: languageFormat.getLanguage(20024, 'Stock Tracker')
                    });
                }

                if (showStkInfoEquitiesTracker == "TRUE") {
                    this.menuEqTrackerId = Ext.id();
                    btns.push({
                        id: menu.menuEqTrackerId,
                        text: languageFormat.getLanguage(20025, 'Equities Tracker')
                    });
                }

                if (N2N_CONFIG.features_HistoricalData) {
                    this.menuHisDataId = Ext.id();
                    btns.push({
                        id: menu.menuHisDataId,
                        text: languageFormat.getLanguage(20060, 'Historical Data')
                    });
                }
                
                if (N2N_CONFIG.features_BrokerQ) {
                    this.menuBrokerQId = Ext.id();
                    btns.push({
                        id: menu.menuBrokerQId,
                        text: languageFormat.getLanguage(31800, 'Broker Queue')
                    });
                }
            }

            if (showChartHeader == "TRUE") {
                if (showChartIntradayChart == "TRUE") {
                    this.menuChartId = Ext.id();
                    btns.push({
                        id: menu.menuChartId,
                        text: languageFormat.getLanguage(20101, 'Intraday Chart')
                    });
                }

                if (showChartAnalysisChart == "TRUE") {
                    this.menuAnalysisId = Ext.id();
                    btns.push({
                        id: menu.menuAnalysisId,
                        text: languageFormat.getLanguage(20102, 'Analysis Chart')
                    });
                }
            }

            if (showNewsHeader == "TRUE") {
                if (showNewsStockNews == "TRUE") {
                    this.menuStkNewsId = Ext.id();
                    btns.push({
                        id: menu.menuStkNewsId,
                        text: languageFormat.getLanguage(20123, 'Stock News')
                    });
                }
                if (N2N_CONFIG.featuresNews_Archive) {
                    this.menuStkNewsArchiveId = Ext.id();
                    btns.push({
                        id: menu.menuStkNewsArchiveId,
                        text: languageFormat.getLanguage(20137, 'News Archive')
                    });
                }
                if (N2N_CONFIG.elasticNewsUrl) {
                    this.menuStkNewsElasticId = Ext.id();
                    btns.push({
                        id: menu.menuStkNewsElasticId,
                        text: languageFormat.getLanguage(20140, 'Elastic News')
                    });
                }
            }
            
            if (N2N_CONFIG.hasNews2) {
                this.menuNews2Id = Ext.id();
                btns.push({
                    id: menu.menuNews2Id,
                    text: languageFormat.getLanguage(20121, 'News')
                });
            }
                
            if (N2N_CONFIG.featuresFund_Header) {
                if (N2N_CONFIG.featuresNews_FundamentalCPIQ) {
                    this.menuFundamentalCPIQId = Ext.id();
                    btns.push({
                        id: menu.menuFundamentalCPIQId,
                        text: languageFormat.getLanguage(20124, 'Fundamental (Capital IQ)')
                    });
                }

                if (N2N_CONFIG.featuresNews_FundamentalThomsonReuters) {
                    this.menuFundamentalThomsonReutersId = Ext.id();
                    btns.push({
                        id: menu.menuFundamentalThomsonReutersId,
                        text: languageFormat.getLanguage(20126, 'Fundamental (Thomson Reuters)')
                    });
                }
            }
            

            if (showSettingHeader == "TRUE") {
                if (N2N_CONFIG.featuresSetting_AddStockAlert) {
                    this.menuAddStockAlertId = Ext.id();
                    btns.push({
                        id: menu.menuAddStockAlertId,
                        text: languageFormat.getLanguage(20603, 'Add Stock Alert')
                    });
                }
            }

            if (showWarrantsInfo == "TRUE") {
                this.menuWarrantsInfoId = Ext.id();
                btns.push({
                    id: menu.menuWarrantsInfoId,
                    text: languageFormat.getLanguage(20130, 'Warrants Info')
                });
            }
            
            if (settingSMSStockAlertURL.length > 0) {
                this.menuStockAlertId = Ext.id();
                btns.push({
                    id: menu.menuStockAlertId,
                    text: languageFormat.getLanguage(20602, 'Stock Alert')
                });
            }
            
            if (N2N_CONFIG.pseEdgeURL.length > 0) {
                this.menuPSEEdgeId = Ext.id();
                btns.push({
                    id: menu.menuPSEEdgeId,
                    text: languageFormat.getLanguage(20139, 'PSE Edge')
                });
            }
            
            if (N2N_CONFIG.iBillionaireURL.length > 0) {
                this.menuIBId = Ext.id();
                btns.push({
                    id: menu.menuIBId,
                    text: languageFormat.getLanguage(20527, 'Follow iBillionaire')
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
    onContextMenuClick: function (funcs) {
        if (funcs != null) {
            var len = funcs.length;
            var contextMenu = this.contextMenu;
            for (var i = 0; i < len; i++) {
                var func = funcs[i];
                if (func.name != null) {
                    var btn;
                    switch (func.name) {
                        case this.menuBuyId:
                            btn = contextMenu.getComponent(this.menuBuyId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuSellId:
                            btn = contextMenu.getComponent(this.menuSellId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuReviseId:
                            btn = contextMenu.getComponent(this.menuReviseId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuCancelId:
                            btn = contextMenu.getComponent(this.menuCancelId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuDepthId:
                            btn = contextMenu.getComponent(this.menuDepthId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuStkInfoId:
                            btn = contextMenu.getComponent(this.menuStkInfoId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuStkTrackerId:
                            btn = contextMenu.getComponent(this.menuStkTrackerId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuEqTrackerId:
                            btn = contextMenu.getComponent(this.menuEqTrackerId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuHisDataId:
                            btn = contextMenu.getComponent(this.menuHisDataId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuBrokerQId:
                            btn = contextMenu.getComponent(this.menuBrokerQId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuChartId:
                            btn = contextMenu.getComponent(this.menuChartId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuStkNewsId:
                            // if (exchangecode != 'SG') {
                            btn = contextMenu.getComponent(this.menuStkNewsId);
                            btn.setHandler(func.func);
                            // }
                            break;
                        case this.menuStkNewsArchiveId:
                            btn = contextMenu.getComponent(this.menuStkNewsArchiveId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuStkNewsElasticId:
                            btn = contextMenu.getComponent(this.menuStkNewsElasticId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuNews2Id:
                            btn = contextMenu.getComponent(this.menuNews2Id);
                            btn.setHandler(func.func);
                            break;
                        case this.menuAnalysisId:
                            btn = contextMenu.getComponent(this.menuAnalysisId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuFundamentalCPIQId:
                            btn = contextMenu.getComponent(this.menuFundamentalCPIQId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuFundamentalThomsonReutersId:
                            btn = contextMenu.getComponent(this.menuFundamentalThomsonReutersId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuAddStockAlertId:
                            btn = contextMenu.getComponent(this.menuAddStockAlertId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuWarrantsInfoId:
                            btn = contextMenu.getComponent(this.menuWarrantsInfoId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuStockAlertId:
                            btn = contextMenu.getComponent(this.menuStockAlertId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuPSEEdgeId:
                            btn = contextMenu.getComponent(this.menuPSEEdgeId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuIBId:
                            btn = contextMenu.getComponent(this.menuIBId);
                            btn.setHandler(func.func);
                            break;
                    }
                }
            }
        }
    },
    getFieldList: function (type) {
        var panel = this;

        var returnArray = [fieldLacp];

        var columns = helper.getGridColumns(panel);

        for (var i = 0; i < columns.length; i++) {
            var storeValue = null;

            if (!columns[i].hidden) {
                // retrieve the column data index
                var dataIndex = columns[i].dataIndex;

                //???
                if (dataIndex == fieldLast)
                    storeValue = fieldLast;
                else
                    storeValue = dataIndex;

                if (storeValue != null) {
                    if (returnArray.indexOf(storeValue) < 0)
                        returnArray.push(storeValue);
                }
            }
        }

        if (type == 'param')
            return returnArray.join('~');

        return returnArray;
    },
    getStore: function () {
        return this.store;
    },
    startRefreshTimer: function () {
        var panel = this;
        if (this.refreshTimer != null) {
            this.stopRefreshTimer();
        }
        this.refreshTimer = setInterval(function () {
            if (n2nLayoutManager.isActivation(panel)) {
                panel.search(true);
            }
        }, 20000, 2000);
    },
    stopRefreshTimer: function () {
        var panel = this;
        if (this.refreshTimer != null) {
            clearInterval(panel.refreshTimer);
        }
    },
    nextPage: function () {
        var store = this.store;
        var total = store.getTotalCount();

        var cursor = this.paging.cursor;
        var size = this.paging.pageSize;

        this.page = cursor / size;
        var islastpage = cursor >= (total - size);
        if (!islastpage) {
            this.paging.moveNext();
        }
    },
    previousPage: function () {
        var store = this.store;
        var total = store.getTotalCount();

        var cursor = this.paging.cursor;
        var size = this.paging.pageSize;

        this.page = cursor / size;
        if (this.page > 0) {
            this.paging.movePrevious();
        }
    },
    callAccBal: function () {
        var panel = this;

        var urlbuf = [];
        urlbuf.push(addPath + 'tcplus/atp/acc?');
        urlbuf.push('s=');
        urlbuf.push(new Date().getTime());

        if (panel.exchangecode)
            urlbuf.push('&ex=' + panel.exchangecode);

        var accno = (panel.cbAccount.getValue()).split(global_AccountSeparator)[0].trim(); // #account list separator ('-')
        if (accno)
            urlbuf.push('&ac=' + accno);

        var accountName = (panel.cbAccount.getValue()).split(global_AccountSeparator); // #account list separator ('-')
        if (accountName.length > 0) {
            urlbuf.push('&bc=' + accountName[accountName.length - 1].trim());
        }

        var url = urlbuf.join('');

        if (panel.accBalReqId != null)
            Ext.Ajax.abort(panel.accBalReqId);

        panel.accBalReqId = Ext.Ajax.request({
            url: url,
            method: 'POST',
            timeout: 60000,
            success: function (response) {
                try {
                    var obj = Ext.decode(response.responseText);
                    if (obj.s) {
                        panel.updateAccBal(obj);
                    }
                } catch (e) {
                    debug(e);
                }
                panel.accBalReqId = null;
            },
            failure: function (response) {
                debug(response);
                panel.accBalReqId = null;
            }
        });

    },
    search: function (background) {
        var panel = this;
        var _account = panel.cbAccount.getValue();
        if (_account == null || _account == '') {
            panel.setLoading(false);
            return;
        }

        if (!background) {
            helper.setHtml(panel.compRef.totalGL, this.formatCurrency(0));
            panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
            Blinking.resetBlink(panel);
            panel.store.removeAll();
        } else {
            if (this.searching)
                return;
        }

        this.searching = true;
        var urlBuf = [];
        urlBuf.push(addPath + 'tcplus/atp/portfolio?');
        urlBuf.push('t=0'); // 0: realized
        if (panel.exchangecode) {
            urlBuf.push('&ex=' + panel.exchangecode);
            urlBuf.push('&exfilt=' + panel.filterExtOpt);
        }

        if (panel.filterPaymentCodeOpt) {
            urlBuf.push('&pcfilt=' + panel.filterPaymentCodeOpt);
        }

        if (panel.accNo)
            urlBuf.push('&ac=' + panel.accNo);

        var accountName = _account.split(global_AccountSeparator); // #account list separator ('-')
        if (accountName.length > 0) {
            urlBuf.push('&bc=' + accountName[accountName.length - 1].trim());
        }

        var url = urlBuf.join('');

        if (panel.prtfReqId != null) {
            Ext.Ajax.abort(panel.prtfReqId);
            this.searching = false;
        }

        panel.prtfReqId = Ext.Ajax.request({
            url: url,
            method: 'GET',
            success: function (response) {
                panel.prtfRetry = 2;

                try {
                    var obj = Ext.decode(response.responseText);
                    panel.updatePortfolio(obj, background);
                    panel._getStockData();
                    panel.callAccBal();
                } catch (e) {
                    console.log(e.stack);
                    debug(e);
                }
                panel.resetSearch();
            },
            failure: function (response) {
                if (panel.prtfRetry > 0) {
                    panel.prtfRetry--;
                    panel.resetSearch();
                    panel.search();
                } else {
                    panel.resetSearch();
                }
            }
        });
    },
    _getStockData: function () {
        var me = this;

        if (me.stkcodes && me.stkcodes.length > 0) {
            conn.getStockList({
                rType: 'rp_stockList',
                list: me.stkcodes,
                f: [fieldStkCode, fieldLacp, fieldCurrency, fieldLotSize, fieldStatus, fieldIndexCode, fieldPrev],
                p: 0,
                c: me.stkcodes.length,
                skipMDColCheck: true,
                success: function (res) {
                    if (res.d && res.d.length > 0) {
                        for (var i = 0; i < res.d.length; i++) {
                            var fd = _formatSingleVertxData({data: res.d[i]});
                            updater.updateQuote(fd);
                        }
                    }
                }
            });
        }

    },
    resetSearch: function () {
        this.setLoading(false);
        this.searching = false;
        this.prtfReqId = null;
    },
    localSearch: function () {
        // Local filter
        var panel = this;

        Blinking.clearBlink(panel);
        panel.getStore().filterBy(function (record, id) {
        	var blnFilterSenderCode = true;
            var blnFilterPaymentCode = true;
            var blnFilterEx = true;

            if(global_senderCode.toUpperCase() != record.get('ReqCC').toUpperCase()){
            	blnFilterSenderCode = false;
            }
            
            // filter by payment code
            if (panel.filterPaymentCodeOpt == 'ALL' || panel.filterPaymentCodeOpt == '') {
                // show all
            } else {
                if (record.get('SettOpt').toUpperCase() == panel.filterPaymentCodeOpt) {
                    blnFilterPaymentCode = true;
                } else {
                    blnFilterPaymentCode = false;
                }
            }

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

            return blnFilterSenderCode && blnFilterPaymentCode && blnFilterEx;
        });

        if (panel.getStore().getCount() == 0) {
            //helper.setHtml(panel.getView(), '<div class="x-grid-empty">' + panel.emptyResult + '</div>');
            helper.setGridEmptyText(panel, panel.emptyResult);
        }
    },
    updateAccBal: function (obj) {
        var panel = this;

        try {
            if (!obj || !obj.ai)
                return;

            var acc = obj.ai;
            var accBal = 0;
            var netCashLimit = 0;
            for (var i = 0; i < acc.length; i++) {
                var updAcc = acc[i];
                if (updAcc != null) {
                    if (panel.accNo && updAcc.ac == panel.accNo) {
                        accBal = parseFloat(updAcc.al);
                        netCashLimit = parseFloat(updAcc.ncl);
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
            panel.setAccBal(panel.formatAccBalDecimal(accBal));
            panel.setNetCashLimit(panel.formatAccBalDecimal(netCashLimit));
            panel.compRef.topBar.doLayout();

        } catch (e) {
            debug(e);
        }
    },
    setAccBal: function (v) {
        if (v != null && !isNaN(v)) {
            helper.setHtml(this.compRef.accBal, this.currentCurrency + ' ' + this.formatCurrency(v));
        }
    },
    setNetCashLimit: function (v) {
        if (v != null && !isNaN(v)) {
            helper.setHtml(this.compRef.netCashLimit, this.currentCurrency + ' ' + this.formatCurrency(v));
        }
    },
    updateSummary: function () {
        var panel = this;

        var totRealGLAmt = 0;
        var store = panel.store;

        if (store != null) {
            var total = (pagingMode) ? store.getTotalCount() : store.getCount();
            for (var i = 0; i < total; i++) {
                var rec;
                if (pagingMode) {
                    rec = store.allData.get(i);
                } else {
                    rec = store.getAt(i);
                }

                if (rec == null)
                    continue;
                var recData = rec.data;
                var recCurrency = recData.Currency;
                var realGLAmt = parseFloat(recData.realGLAmt);

                if (panel.convertCurrencyEnable) {
                    var haveToConvert = false;
                    var buyRate = null;
                    var denomination = null;
                    var currencyRateList = panel.currencyRateList;
                    var n = currencyRateList.size;

                    for (var j = 0; j < n; j++) {
                        var inListCurrency = currencyRateList.d[j].currate[0];

                        if (recCurrency == panel.currentCurrency) {
                            // same currency no need convert
                            haveToConvert = false;
                            break;

                        } else if (inListCurrency == recCurrency) {
                            // not same curreny and need convert
                            buyRate = currencyRateList.d[j].currate[3];
                            denomination = currencyRateList.d[j].currate[5];

                            haveToConvert = true;
                            break;
                        }
                    }

                    if (!isNaN(realGLAmt)) {
                        if (haveToConvert) {
                            if (denomination != null || buyRate != null) {
                                totRealGLAmt += parseFloat(realGLAmt / denomination * buyRate);
                            }
                        } else {
                            totRealGLAmt += realGLAmt;
                        }
                    }

                } else {
                    // take back original value
                    if (!isNaN(realGLAmt)) {
                        totRealGLAmt += realGLAmt;
                    }
                }
            }
        }
        helper.setHtml(panel.compRef.totalGL, '<span title="' + panel.currentCurrency + ' ' + this.formatCurrency(parseFloat(totRealGLAmt).toFixed(2)) + '">' + panel.currentCurrency + ' ' + panel.returnNumberFormat(totRealGLAmt, 50)) + '</span>';
        panel.compRef.totalGL.updateLayout();

    },
    updateCalInfo2: function (rec, row, vrow) {
        var panel = this;
        if (rec == null || row == null || vrow == null)
            return;

        if (row != -1) {
            var recData = rec.data;
            var last = recData.Last;
            var lacp = recData.RefPrc;

            var cm = helper.getGridColumns(panel);
            var colmap = this.columnmap;
            var prc = last;
            prc = (isNaN(prc)) ? lacp : prc;
            if (!isNaN(prc) && prc > 0) {
                var avgPurPrc = recData.AvgPurPrc;
                var qtyOnHand = recData.QtyOnHand;

                if (!isNaN(avgPurPrc) && !isNaN(qtyOnHand)) {
                    var urlglamt = (prc - avgPurPrc) * qtyOnHand;
                    var urlglamtIdx = colmap.urlglamt;
                    if (urlglamt && urlglamt != recData.UrlGLAmt) {
                        var oldurlglamt = recData.UrlGLAmt;
                        recData.UrlGLAmt = urlglamt;
                        if (urlglamtIdx != -1) {
                            if (urlglamt != oldurlglamt && vrow != -1) {
                                N2NUtil.updateCell(panel, vrow, urlglamtIdx, urlglamt);
                                if (!cm[urlglamtIdx].isHidden() && !oldurlglamt)
                                    Blinking.setBlink(panel, rowIndex, columnIndex, "unchange"); // Something wrong?
                            }
                        }
                        var urlglpcIdx = colmap.urlglpc;
                        var urlglpc = 0;
                        if ((avgPurPrc * qtyOnHand) > 0)
                            urlglpc = urlglamt * 100 / (avgPurPrc * qtyOnHand);
                        var oldurlglpc = recData.UrlGLPc;
                        recData.UrlGLPc = urlglpc;
                        if (urlglpcIdx != -1) {
                            if (urlglpc != oldurlglpc && vrow != -1) {
                                urlglpc = this.formatDecimal(urlglpc, 2);
                                N2NUtil.updateCell(panel, urlglpcIdx, urlglpcIdx, urlglpc);
                                if (!cm[urlglpcIdx].isHidden() && !oldurlglpc)
                                    Blinking.setBlink(panel, rowIndex, columnIndex, "unchange");
                            }
                        }
                    }
                }

                if (!isNaN(qtyOnHand) && !isNaN(qtyOnHand)) {
                    var mktval = prc * qtyOnHand;
                    var mktvalIdx = colmap.mktval;
                    if (mktval != null && mktval != recData.MktVal) {
                        var oldmktval = recData.MktVal;
                        recData.MktVal = mktval;
                        if (mktvalIdx != -1) {
                            if (mktval != oldmktval && vrow != -1) {
                                mktval = this.formatCurrency(mktval);
                                N2NUtil.updateCell(panel, vrow, mktvalIdx, mktval);
                                if (!cm[mktvalIdx].isHidden() && !oldmktval)
                                    this.blink(vrow, mktvalIdx, cBUnchanged);
                            }
                        }
                    }
                }
            }
        }
    },
    updatePortfolio: function (obj, reset) {
        if (this.updatingPrtf) {
            return;
        }
        this.updatingPrtf = true;

        var panel = this;

        if (obj.s) {
            var dt = obj.pf;
            var store = this.store;
            var total = (pagingMode) ? store.getTotalCount() : store.getCount();
            if (reset) {
                total = 0;
            }
            if (total == 0) {
                var tempDt = [];
                var count = dt.length;
                for (var i = 0; i < count; i++) {
                    var d = dt[i];

                    if (panel.accNo && d.an && d.an != panel.accNo)
                        continue;

                    var data = {
                        StkCode: d.sc,
                        StkName: d.sy,
                        AggrBuyPrice: d.abp,
                        AggrSellPrice: d.asp,
                        TotalQtyFromHolding: d.qh,
                        TotalQtyShort: d.qsh,
                        TotalQtySold: d.qso,
                        TotalBrokerage: d.tb,
                        realGLAmt: d.rpla,
                        realGLPc: d.rplp,
                        AccNo: d.an,
                        Currency: d.cr,
                        ExchangeCode: getStkExCode(d.sc), //d.ex,
                        LotSize: d.ls,
                        SettOpt: d.setO,
                        BCode: d.bc,
                        AccountName: d.accN,
                        ReqCC: d.reqcc
                    };
                    
                    lotSizeArchives.addLotSize(d['sc'], d['ls']);

                    var exCode = d.ex;

                    if (!contains(panel.feedExchangeList, exCode)) {
                        panel.feedExchangeList.push(exCode);
                    }
                    tempDt.push(data);

                    if (panel.stkcodes == null) {
                        panel.stkcodes = [];
                        panel.stkcodes.push(d.sc);
                    }

                    if (!contains(panel.stkcodes, d.sc))
                        panel.stkcodes.push(d.sc);
                }

                this.prtfList = tempDt;
                if (tempDt.length > 0) {
                    var jsonObj = {
                        success: obj.s,
                        count: tempDt.length,
                        data: tempDt
                    };

                    if (pagingMode)
                        store.lastOptions.params = Ext.applyIf({
                            start: 0,
                            limit: 10
                        }, store.lastOptions.params);
                    
                    resetGridScroll(panel);
                    store.loadRawData(jsonObj);
                    activateRow(panel);
                    n2ncomponents.activateEmptyScreens();
                    
                    if (panel.isFirstTime) {
                        helper.autoFitColumns(panel);
                        panel.isFirstTime = false;
                    }
                }
                panel.localSearch();

                Storage.generateUnsubscriptionByExtComp(panel, true);
                Storage.generateSubscriptionByList(panel.stkcodes, panel);

                // manually update
                total = (pagingMode) ? store.getTotalCount() : store.getCount();
                for (var j = 0; j < total; j++) {
                    var rec;
                    var vrow;
                    if (pagingMode)
                        rec = store.allData.get(j);
                    else
                        rec = store.getAt(j);

                    var recData = rec.data;
                    if (pagingMode)
                        vrow = store.indexOfId(recData.PrtfNo);
                    else
                        vrow = j;

                    this.updateCalInfo2(rec, j, vrow);
                }

                this.updateSummary();

            }
        } else {
            var msg = panel.emptyText;
            if (obj && obj.msg)
                //msg = obj.msg;
            	msg = languageFormat.getLanguage(31001, 'Your portfolio is empty.');
            //helper.setHtml(panel.getView(), '<div class="x-grid-empty">' + msg + '</div>');
            helper.setGridEmptyText(panel, msg);
        }

        this.updatingPrtf = false;
    },
    setChange: function (rec, vrow) {
        var recData = rec.data;
        var last = recData.Last;
        var lacp = recData.RefPrc;
        var column = this.columnmap['chgamt'];
        var oldchange = rec.ChgAmt;
        oldchange = parseFloat(oldchange);

        if (lacp == 0) {
            if (oldchange != 0) {
                recData.ChgAmt = 0;
                if (vrow != -1)
                    N2NUtil.updateCell(panel, vrow, column, '-');
            }
            return 0;
        } else if (last == 0) {
            if (oldchange != 0) {
                rec.data.ChgAmt = 0;
                if (vrow != -1)
                    N2NUtil.updateCell(panel, vrow, column, 0);
            }
            return 0;
        }

        var change = last - lacp;
        var _change = parseFloat(change);
        if (_change != oldchange) {
            recData.ChgAmt = change;
            if (vrow != -1)
                N2NUtil.updateCell(panel, vrow, column, change);
        }
        return change;
    },
    setChgPercentage: function (rec, vrow) {
        var recData = rec.data;
        var lacp = recData.RefPrc;
        var change = recData.ChgAmt;
        var last = recData.Last;
        var column = this.columnmap['chgpc'];
        var oldchgpc = rec.data.ChgPc;
        oldchgpc = parseFloat(oldchgpc);

        if (lacp == 0) {
            if (oldchgpc != 0) {
                recData.ChgPc = 0;
                if (vrow != -1)
                    N2NUtil.updateCell(panel, vrow, column, '-');
            }
            return 0;
        } else if (last == 0) {
            if (oldchgpc != 0) {
                recData.ChgPc = 0;
                if (vrow != -1)
                    N2NUtil.updateCell(panel, vrow, column, 0);
            }
            return 0;
        }

        var chgpc = (change / lacp) * 100;
        if (!lacp || isNaN(lacp) || lacp == 0)
            chgpc = 0;
        chgpc = parseFloat(chgpc).toFixed(2);
        if (chgpc != oldchgpc) {
            recData.ChgPc = chgpc;
            if (vrow != -1)
                N2NUtil.updateCell(panel, vrow, column, chgpc);
        }
        return chgpc;
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
    formatAccBalDecimal: function (value) {
        if (isNaN(value))
            return null;

        var decimal = 2;
        return parseFloat(value).toFixed(decimal);
    },
    formatDecimal: function (value, decimal) {

        var isNum = function (input) {
            return (input - 0) == input && (input + '').replace(/^\s+|\s+$/g, "").length > 0;
        };
        if (decimal) {
            if (isNum(value)) {
                value = parseFloat(value).toFixed(decimal);
            }
        }
        return value;
    },
    updateColumnMap: function () {
        var panel = this;

        var map = (panel.columnmap == null ? {} : panel.columnmap);
        var cm = helper.getGridColumns(panel);

        for (var i = 0; i < cm.length; i++) {
            var itemId = cm[i].itemId;
            map[itemId] = i;
        }

        panel.columnmap = map;
    },
    cleanUpBlinkTimer: function () {
        var store = this.store;
        var rowcount = store.getCount();
        var cm = this.columns;
        var colcount = cm.length;

        for (var i = 0; i < rowcount; i++) {
            for (var j = 0; j < colcount; j++) {
                var k = i + ',' + j;
                if (this.blinkTasks != null && this.blinkTasks[k] != null) {
                    this.blinkTasks[k].cancel();
                    this.blinkTasks[k] = null;
                }

                if (this.blinkIntensities != null && this.blinkIntensities[k] != null) {
                    this.blinkIntensities[k] = null;
                }
            }
        }

        this.blinkTasks = null;
        this.blinkIntensities = null;
    },
    showContextMenu: function (grid, record, ridx, e) {
        e.stopEvent();
        grid.getSelectionModel().select(ridx);

        if (this.contextMenu == null)
            this.createContextMenu();

        var stkCode = record.get('StkCode');
        var stkName = record.get('StkName');
        var last = record.get('Last');
        var lacp = record.get('LACP');
        var refPrc = record.get('RefPrc');

        this.contextMenu.stkCode = stkCode;
        this.contextMenu.stkName = stkName;

        var ordRec = {};
        if (!isNaN(last))
            ordRec.price = last;

        else {
            if (!isNaN(lacp))
                ordRec.price = lacp;

            else {
                if (!isNaN(refPrc))
                    ordRec.price = refPrc;
            }
        }
        this.contextMenu.ordRec = ordRec;

        this.disableRightFunction(this.contextMenu.stkCode);
        this.contextMenu.showAt(e.getXY());
    },
    isValidColumnSetting: function () {
        var rpfCol = layoutProfileManager.getCol('rpf');
        if (rpfCol != null && rpfCol != "") {
            if (rpfCol.indexOf("~") != -1) {
                return true;
            } else
                return false;
        }

        return true;
    },
    /*
     disableRightFunction: function(stk) {
     // applicable for outbound some exchange does not have data
     var exCode = stockutil.getExchange(stk);
     var enable = true;
     
     if (exCode == "A" || exCode == "AD" || exCode == "N"
     || exCode == "ND" || exCode == "O"
     || exCode == "OD") {
     enable = false;
     }
     
     this._toggleContextMenuItem(this.menuChartId, enable);
     this._toggleContextMenuItem(this.menuStkTrackerId, enable);
     },
     */
    disableRightFunction: function (stk) {
        var panel = this;

        var intradayChartBtn = panel.contextMenu.getComponent(panel.menuChartId);
        var ibBtn = panel.contextMenu.getComponent(panel.menuIBId);
        var stkEx = formatutils.getExchangeFromStockCode(stk);

        checkContextMenuItems(intradayChartBtn, ibBtn, stkEx);
    },
    _toggleContextMenuItem: function (ctId, enable) {
        var ctMenu = this.contextMenu.getComponent(ctId);
        if (ctMenu) {
            if (enable) {
                ctMenu.enable();
            } else {
                ctMenu.disable();
            }
        }
    },
    // region start custom column functions
    showColumnSetting: function () {
        var panel = this;
        colutils.displayWindow(panel);
    },
    allColumnSetting: function () {
        var allColumnId = global_RGLAllColumn;
        return colutils.filterColumnId(allColumnId);
    },
    defaultColumnSetting: function () {
        var defaultColumnId = global_RGLDefaultColumn;
        return colutils.filterColumnId(defaultColumnId);
    },
    currentColumnSetting: function () {
        var currentColumnId = layoutProfileManager.getCol('rpf');

        // verify is new setting or old setting
        var temp = currentColumnId.split("~");
        var indexNumber = temp.indexOf(colutils.ColumnVersion);
        if (indexNumber != -1) {
            temp.splice(indexNumber, 1);
            currentColumnId = temp.join('~');
        } else {
            currentColumnId = "";
        }

        return colutils.filterColumnId(currentColumnId);
    },
    requiredColumnSetting: function () {
        return portfolioRealReqCol;
    },
    /**
     * convert id to string
     * 
     * @param id :
     *            string
     * 
     * @return String
     */
    generateColumnName: function (id) {
        switch (id) {
            case cmap_pfRealCode:
                return languageFormat.getLanguage(10101, "Code");
            case cmap_pfRealName:
                return languageFormat.getLanguage(10102, "Symbol");
            case cmap_pfRealAggBuyPrc:
                return languageFormat.getLanguage(10801, "AggrBuyPrice");
            case cmap_pfRealAggSellPrc:
                return languageFormat.getLanguage(10802, "AggrSellPrice");
            case cmap_pfRealTtlQtyFromHolding:
                return languageFormat.getLanguage(10803, "Qty.H");
            case cmap_pfRealTtlQtyShort:
                return languageFormat.getLanguage(10804, "Qty.Sh");
            case cmap_pfRealTtlQtySold:
                return languageFormat.getLanguage(10805, "Qty.Sd");
            case cmap_pfRealTtlBrokerage:
                return languageFormat.getLanguage(10806, "Brokerage");
            case cmap_pfRealGLAmt:
                return languageFormat.getLanguage(10809, "RGL");
            case cmap_pfRealGLPc:
                return languageFormat.getLanguage(10808, "RGL%");
            case cmap_pfRealAccNo:
                return languageFormat.getLanguage(10901, "Acc.No");
            case cmap_pfRealCurrency:
                return languageFormat.getLanguage(10132, "Currency");
            case cmap_pfRealExchg:
                return languageFormat.getLanguage(10126, "Exchg");
            case cmap_pfRealLotSize:
                return languageFormat.getLanguage(10712, "Lot.Size");
            case cmap_pfRealSettOpt:
                return languageFormat.getLanguage(10713, "Inv.Portfolio");
        }

        return '';
    },
    saveColumn: function(newColumnIdArr) {
        var panel = this;

        panel.reconfigure(null, panel.generateColumnsArray(colutils.generateColumnArray(panel, newColumnIdArr)));
        panel.requestSaveColumns(newColumnIdArr);

    },
    requestSaveColumns: function(newColumnIdArr) {
        var panel = this;

        conn.updateFieldList();
        Storage.generateSubscriptionByList(panel.stkcodes, panel);
        newColumnIdArr = newColumnIdArr + "~" + colutils.ColumnVersion;
        panel.updateColumnMap();
        colutils.saveColumn('rpf', newColumnIdArr);
    },
    /**
     * generate column setting
     * 
     * @return string / null
     */
    generateColumnID: function () {
        var panel = this;

        var columns = helper.getGridColumns(panel);
        var param = null;

        var p = [];

        var n = columns.length;
        for (var i = 0; i < n; i++) {
            var colItemId = columns[i].itemId;
            if (!columns[i].hidden)
                p.push(colItemId);
        }

        param = p.join('~');

        return param;
    },
    getViewExchangeList: function () { // 1.3.25.36 get all
        // view exchange
        var panel = this;
        var viewList = confViewEx;

        if (viewList != null) {
            var tempExchangeList = viewList.split(',');
        }
        return tempExchangeList;
    },
    /**
     * generate grid panel column header
     * 
     * @return array
     */
    generateColumnsArray: function (colSettingList) {
        var panel = this;

        var newSetting = function (meta, value, record, type) {
            var cssClass = N2NCSS.CellDefault;

            if (type == "stockName") {
                cssClass += " " + N2NCSS.FontStockName;
                var tempCss = StockColor.stockByOrderBook(
                        value, record, panel);

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

            } else if (type == "string") {
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
            } else if (type == "numberyellow" && isNumberYellowColumn) {
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontUnChange_yellow;
            } else {
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontUnChange;
            }

            meta.css = cssClass;
        };

        var columnList = [];
        var rlzpf = panel._idPrefix;
        for (var i = 0; i < colSettingList.length; i++) {
            var colObj = colSettingList[i];
            var columnID = colObj.column;
            var columnVisible = !colObj.visible;
            //var hd = panel.generateColumnName(columnID);

            switch (columnID) {
                case cmap_pfRealCode:
                    columnList.push({
                        itemId: rlzpf + columnID,
                        header: languageFormat.getLanguage(10101, 'Code'),
                        dataIndex: 'StkCode',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID),
                        locked: helper.getCodeLock(colSettingList, cmap_pfRealName),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, "string");
                            return formatutils.procStringValue(value);
                        }
                    });

                    break;
                case cmap_pfRealName:
                    columnList.push({
                        itemId: rlzpf + columnID,
                        header: languageFormat.getLanguage(10102, 'Symbol'),
                        dataIndex: 'StkName',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID),
                        locked: true,
                        renderer: function (value, meta, record) {
                            value = value || '';
                            newSetting(meta, value, record, "stockName");

                            var index = value.lastIndexOf('.');
                            if (index != -1) {
                                value = value.substring(0, index);
                            }

                            return formatutils.procStringValue(value);
                        }
                    });

                    break;
                case cmap_pfRealAggBuyPrc:
                    columnList.push({
                        itemId: rlzpf + columnID,
                        header: languageFormat.getLanguage(10801, "AggrBuyPrice"),
                        dataIndex: 'AggrBuyPrice',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID),
                        align: 'right',
                        lockable: false,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return panel.formatDecimal(value, decimalCtrl.rgl.aggrbuyprice);
                        }
                    });

                    break;
                case cmap_pfRealAggSellPrc:
                    columnList.push({
                        itemId: rlzpf + columnID,
                        header: languageFormat.getLanguage(10802, "AggrSellPrice"),
                        dataIndex: 'AggrSellPrice',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID),
                        align: 'right',
                        lockable: false,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return panel.formatDecimal(value, decimalCtrl.rgl.aggrsellprice);
                        }
                    });

                    break;
                case cmap_pfRealTtlQtyFromHolding:
                    columnList.push({
                        itemId: rlzpf + columnID,
                        header: languageFormat.getLanguage(10803, "Qty.H"),
                        tooltip: languageFormat.getLanguage(10812, "Quantity Holding"),
                        dataIndex: 'TotalQtyFromHolding',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID),
                        align: 'right',
                        lockable: false,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, "numberyellow");

                            return panel.returnNumberFormat(value, panel.getWidth(cmap_pfRealTtlQtyFromHolding));
                        }
                    });

                    break;
                case cmap_pfRealTtlQtyShort:
                    columnList.push({
                        itemId: rlzpf + columnID,
                        header: languageFormat.getLanguage(10804, "Qty.Sh"),
                        tooltip: languageFormat.getLanguage(10813, "Quantity Short"),
                        dataIndex: 'TotalQtyShort',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID),
                        align: 'right',
                        lockable: false,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, "numberyellow");

                            return panel.returnNumberFormat(value, panel.getWidth(cmap_pfRealTtlQtyShort));
                        }
                    });

                    break;
                case cmap_pfRealTtlQtySold:
                    columnList.push({
                        itemId: rlzpf + columnID,
                        header: languageFormat.getLanguage(10805, "Qty.Sd"),
                        tooltip: languageFormat.getLanguage(10814, "Total Quantity Sold"),
                        dataIndex: 'TotalQtySold',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID),
                        align: 'right',
                        lockable: false,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, "numberyellow");

                            return panel.returnNumberFormat(value, panel.getWidth(cmap_pfRealTtlQtySold));
                        }
                    });

                    break;
                case cmap_pfRealTtlBrokerage:
                    columnList.push({
                        itemId: rlzpf + columnID,
                        header: languageFormat.getLanguage(10806, "Brokerage"),
                        dataIndex: 'TotalBrokerage',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID),
                        align: 'right',
                        lockable: false,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, "unchange");
                            return panel.formatDecimal(value, decimalCtrl.rgl.brokerage);
                        }
                    });

                    break;
                case cmap_pfRealGLAmt:
                    columnList.push({
                        itemId: rlzpf + columnID,
                        header: languageFormat.getLanguage(10809, "RGL"),
                        tooltip: languageFormat.getLanguage(10810, "Realised G/L"),
                        dataIndex: 'realGLAmt',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID),
                        align: 'right',
                        lockable: false,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'change');
                            return panel.returnNumberFormat(panel.formatDecimal(value, decimalCtrl.rgl.realizedgl), panel.getWidth(cmap_pfRealGLAmt));
                        }
                    });

                    break;
                case cmap_pfRealGLPc:
                    columnList.push({
                        itemId: rlzpf + columnID,
                        header: languageFormat.getLanguage(10808, "RGL%"),
                        tooltip: languageFormat.getLanguage(10811, "Realised G/L %"),
                        dataIndex: 'realGLPc',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID),
                        align: 'right',
                        lockable: false,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'change');
                            return panel.formatDecimal(value, decimalCtrl.rgl.realizedglprc);
                        }
                    });

                    break;
                case cmap_pfRealAccNo:
                    columnList.push({
                        itemId: rlzpf + columnID,
                        header: languageFormat.getLanguage(10901, "Acc.No"),
                        dataIndex: 'AccNo',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID),
                        align: 'right',
                        lockable: false,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, "string");

                            return formatutils.procStringValue(value);
                        }
                    });

                    break;
                case cmap_pfRealCurrency:
                    columnList.push({
                        itemId: rlzpf + columnID,
                        header: languageFormat.getLanguage(10132, "Currency"),
                        dataIndex: 'Currency',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID),
                        align: 'right',
                        lockable: false,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, "string");

                            return formatutils.procStringValue(value);
                        }
                    });

                    break;
                case cmap_pfRealExchg:
                    columnList.push({
                        itemId: rlzpf + columnID,
                        header: languageFormat.getLanguage(10126, "Exchg"),
                        dataIndex: 'ExchangeCode',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID),
                        align: 'right',
                        lockable: false,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, "string");

                            return formatutils.procStringValue(value);
                        }
                    });

                    break;
                case cmap_pfRealLotSize:
                    columnList.push({
                        itemId: rlzpf + columnID,
                        header: languageFormat.getLanguage(10712, "Lot.Size"),
                        dataIndex: 'LotSize',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID),
                        align: 'center',
                        lockable: false,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, "numberyellow");

                            return formatutils.procStringValue(value);
                        }
                    });

                    break;
                case cmap_pfRealSettOpt:
                    columnList.push({
                        itemId: rlzpf + columnID,
                        header: languageFormat.getLanguage(10713, "Inv.Portfolio"),
                        dataIndex: 'SettOpt',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        lockable: false,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');

                            return formatutils.procStringValue(value);
                        },
                        align: 'right'});
                    break;
            }
        }

        return columnList;
    },
    updateFeedRecord: function (dataObj) {
        var panel = this;

        var rowNumber = panel.store.find('StkCode', dataObj[fieldStkCode]);

        if (rowNumber != -1) {
            var record = panel.store.getAt(rowNumber);

            if (record != null) {
                var updateStatus = false;
                var stockIndexCode = dataObj[fieldIndexCode];
                if (stockIndexCode && record.data[fieldIndexCode] !== stockIndexCode) {
                    record.data[fieldIndexCode] = stockIndexCode;
                    updateStatus = true;
                }

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
                if (stkStatusCode && record.data[stkStatusCode] !== stkStatusCode) {
                    record.data[stkStatusCode] = stkStatusCode;
                    updateStatus = true;
                }

                if (updateStatus) {
                    var gridCols = helper.getGridColumns(panel, 'lock'); // locked columns only
                    var stockNameIndex = helper.getColumnIndex(gridCols, 'itemId', panel._idPrefix + cmap_pfRealName);
                    
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

                        N2NUtil.updateCell(panel, rowNumber, stockNameIndex, tempData, cssClass, 'lock');
                    }
                }
            }
        }
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
    _setCookieId: function() {
        var me = this;
        me.cookieKey = columnWidthSaveManager.getCookieColKey('realisedGL');
        me.paramKey = N2N_CONFIG.constKey + 'RP';
        me.colWidthKey = 'rp';
    },
    searchAccount: function (searchValue) {
        var panel = this;
        try {
            panel.setLoading(false);
            searchValue = searchValue.toLowerCase();
            panel.cbAccount.doQuery(searchValue, true);
            /*
            var urlbuf = new Array();

            urlbuf.push(addPath + 'tcplus/atp/searchAcc?');
            urlbuf.push('ExtComp=EquityRealisedPrtf');
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

                        var accInfo = obj.ai;
                        var totAcc = accInfo.length;
                        //var allRec = ['', 'Please select account...'];

                        panel.accList = [];
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
            */
        } catch (e) {
            console.log('[Search Account] Exception ---> ' + e);
            panel.setLoading(false);
        }
    },
    autoAdjustWidth: function() {
        var panel = this;

        panel.procColumnWidth();
        panel.reconfigure(null, panel.generateColumnsArray(colutils.generateColumnArray(panel, "")));
        panel.tempWidth = cookies.toDefaultColumn(panel, panel.prckId);
        panel.isImgBlink = false;
        panel.runAutoAdjustWidth = false;
    },
    updateColWidthCache: function(column, newWidth) {
        helper.updateColWidthCache(this, this.cookieKey, column, newWidth);
    },
    runSearchAccount: function() {
    	var panel = this;
    	
    	if (panel.cbAccount.getRawValue().trim() == '') {
            panel.cbAccount.setValue('');
            msgutil.alert(languageFormat.getLanguage(10045, 'Please key in your search text.'), function () {
                panel.cbAccount.focus();
            });
        } else if(panel.cbAccount.getRawValue().trim().length < N2N_CONFIG.constDRMinChars){
        	msgutil.alert(languageFormat.getLanguage(10051, 'The minimum value for this field is [PARAM0]', N2N_CONFIG.constDRMinChars));
        } else {
            panel.searchAccount(panel.cbAccount.getRawValue());
        }
    },
    focusSearchBox: function() {
        focusManager.focusSearchbox(this.cbAccount);
    },
    runFitScreen: function() {
        var panel = this;

        if (!helper.inView(panel)) {
            helper.addBufferedRun('prtfRealisedFitScreen', function() {
                helper.autoFitColumns(panel);
            });
        } else {
            helper.autoFitColumns(panel);
        }
    }
});
