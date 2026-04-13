/*
 * this  : Ext.grid.Panel
 * 
 * 
 * 
 * constructor 					: initial this object function / design this panel 
 * 
 * search					: call ajax to display port folio record
 * callAccBal					: 
 * 
 * updatePortfolio				: set record into grid panel
 * updateAccBal					: calculate account balance and net cash 
 * updateFeedRecord				: update feed record
 * updateCalInfo2				: update column 'Unrealized.G/L' , 'PL %' and 'Mkt.Val' value
 * 
 * generateColumnsArray                         : generate grid panel column header
 * generateColumn				: generate unhide column setting
 * generateColumnName                           : convert id to string
 * 
 * updateSummary				: update label price
 * 
 * rePaintRecPriceColor                         : update grid panel cell design 
 * 
 * createContextMenu                            : create menu design for mouse right click
 * onContextMenuClick                           : set mouse right click menu listeners
 * showContextMenu				: display right menu panel
 * disableRightFunction                         : disable right button 
 * 
 * getFieldList					: generate column id parameter
 * getExchangeType				: get stock code exchange code 
 * 
 * startRefreshTimer                            :
 * stopRefreshTimer				:
 * 
 * onCellClick					: 
 * onRowDblClick				: 
 * 
 * setAccBal					: update account balance label value
 * setNetCashLimit				: update net cash label value
 * 
 * formatCurrency				: 
 * formatDecimal				: 
 * 
 * openDetailPanel 				: display new panel for detail record
 * 
 * addForm 					: create add form design / design add form
 * addFormSubmit 				: submit add form record / call ajax to add record
 * 
 * openNewWindow 				: pop up a new window / design pop up new window
 * 
 * searchStockName 				: create url for search stock name and stock code
 * 
 * allColumnSetting				: return all column id
 * defaultColumnSetting                         : return default column id
 * currentColumnSetting                         : return current column id
 * 
 * openColumnSetting                            : return array list by available or exist
 * saveColumn					: save new column setting
 * 
 * returnNumberFormat
 * 
 */

Ext.define('TCPlus.view.portfolio.MfEquityPrtf', {
    extend: 'TCPlus.view.portfolio.Portfolio',
    requires: [
        'TCPlus.view.portfolio.Portfolio'
    ],
    alias: 'widget.mfequityprtf',
    emptyText: languageFormat.getLanguage(30013, 'No result found.'),
    accNo: '', // for store user account
    accList: null, // for store user account list
    accbranchNo: '', // for store user account no and branch
    exchangecode: '', // this object exchange code
    stkcodes: null, // store all stock code list
    feedExchangeList: null, // store all stock exchange code, for combo box items 
    currencyRateList: null,
    refreshTimer: null, // set refresh timer object
    blinkinterval: 3000,
    blinkTasks: null,
    blinkIntensities: null,
    filterExtOpt: '0', // set call ajax parameter
    filterPaymentCodeOpt: '',
    arPaymentCodeList: null,
    convertCurrencyEnable: false, // verify use this 'currentCurrency' format or not
    currentCurrency: defCurrency, // verify from main.jsp
    jsonString: '', // this is store the object when user click on data grid record 
    newWindow: null, // display new window for add record
    displayCategory: null,
    onAjaxPrftRequestId: null, // store the ajax call id - port folio detail
    onAjaxAccRequestId: null, // store the ajax call id - account balance detail
    record: null,
    contextMenu: null, // display context menu panel
    cMenuStkCode: null, // context menu - stkcode
    cMenuStkName: null, // context menu - stkName
    cMenuObject: null, // context menu - object
    cMenuBuyId: Ext.id(), // assign new id to context menu button
    cMenuSellId: Ext.id(), // assign new id to context menu button
    cMenuStkInfoId: Ext.id(), // assign new id to context menu button
    cMenuDepthId: Ext.id(), // assign new id to context menu button
    cMenuChartId: Ext.id(), // assign new id to context menu button
    cMenuStkNewsId: Ext.id(), // assign new id to context menu button
    cMenuArchiveNewsId: Ext.id(), // assign new id to context menu button
    cMenuElasticNewsId: Ext.id(), // assign new id to context menu button
    cMenuNikkeiNewsId: Ext.id(), // assign new id to context menu button
    cMenuNews2Id: Ext.id(), // assign new id to context menu button
    cMenuStkTrackerId: Ext.id(), // assign new id to context menu button
    cMenuEqTrackerId: Ext.id(), // assign new id to context menu button
    cMenuHisDataId: Ext.id(), // assign new id to context menu button
    cMenuBrokerQId: Ext.id(), // assign new id to context menu button
    cMenuAnalysisId: Ext.id(), // assign new id to context menu button
    cMenuFundamentalCPIQId: Ext.id(), // assign new id to context menu button
    cMenuFundamentalThomsonReutersId: Ext.id(), // assign new id to context menu button
    cMenuAddStockAlertId: Ext.id(), // assign new id to context menu button
    cMenuWarrantsInfoId: Ext.id(), // assign new id to context menu button
    cMenuStockAlertId: Ext.id(),
    cMenuPSEEdgeId: Ext.id(),
    cMenuIBId: Ext.id(),
    tButtonDetail: null,
    tButtonAdd: null,
    tButtonExport: null,
    tComboBoxAccount: null,
    tComboBoxPaymentCode: null,
    tbSearchAccount: null,
    searchAccountBtn: null,
    tLabelLblBalance: null,
    tLabelValBalance: null,
    tLabelLblNetCash: null,
    tLabelValNetCash: null,
    tLabelLblMarket: null,
    tLabelValMarket: null,
    tLabelLblTotal: null,
    tLabelValTotal: null,
    emptyResult: languageFormat.getLanguage(33696, 'Your mutual fund portfolio is empty.'),
    tooltip: null,
    columnHash: null,
    tempWidth: null,
    isImgBlink: false,
    screenType: 'main',
    type: 'fp',
    savingComp: true,
    slcomp: "fp",
    pckId: "fundPrtf",
    mappedSymbol: '05',
    compRef: {
        // store internal component/element references
    },
    _idPrefix: 'fprtf',
    winConfig: {
        width: 890,
        height: 400
    },
    isFirstTime: true,
    initComponent: function() {
        var panel = this;

        panel._procComponentId(panel.displayCategory);
        panel._idPrefix = panel.getId();

        panel.procColumnWidth();

        if (atpCurrencyRate) {
            if (atpCurrencyRate.obj.size > 0) {	// this check ATP is provide the CurrencyRate? if yes will perform calculation else take default Currency only
                panel.convertCurrencyEnable = true;
                panel.currencyRateList = atpCurrencyRate.obj;
            }
        }

        var xtype = 'button';

        panel.feedExchangeList = new Array();

        panel.accList = new Array();
        if (accRet != null) { 				// verify from main.jsp
            var accInfo = accRet.ai;
            var total = accInfo.length;
            for (var i = 0; i < total; i++) {
                var acc = accInfo[i];
                if (acc.ex != 'MY' && acc.cliType != 'D') {
                    var accRec = [acc.ac + global_AccountSeparator + acc.bc, acc.ac + ' - ' + acc.an + " - " + acc.bc]; // #account list separator ('-')
                    panel.accList.push(accRec);
                }
            }
        }

        var accountStore;
        if(isDealerRemisier){
        	var urlbuf = new Array();

        	urlbuf.push(addPath + 'tcplus/atp/searchAcc?');
        	urlbuf.push('ExtComp=EquityPrtf');
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
        				//delete panel.tComboBoxAccount.lastQuery;        				
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
        	accountStore = new Ext.data.ArrayStore({
        		fields: ['accno', 'name'],
        		data: panel.accList
        	});
        }

        panel.accNo = ((panel.accList.length > 0 ? panel.accList[0][0] : '')).split(global_AccountSeparator)[0].trim(); // #account list separator ('-')

        panel.tComboBoxAccount = new Ext.form.field.ComboBox({
            width: 145,
            matchFieldWidth: false,
            listConfig: {
                minWidth: 145,
                cls: 'my-combo-lst'
            },
            autoScroll: true,
            // editable: false,
            selectOnFocus: true,
            forceSelection: !isDealerRemisier,
            queryMode: !isDealerRemisier ? 'local' : 'remote',
            store: accountStore,
            displayField: 'name',
            valueField: 'accno',
            // lazyInit: false,
            emptyText: isDealerRemisier ? languageFormat.getLanguage(20876, 'Search account here.. min ' + N2N_CONFIG.constDRMinChars + ' chars', N2N_CONFIG.constDRMinChars) : languageFormat.getLanguage(20900, 'Please select account...'),
            triggerAction: 'all',
            value: (panel.accList.length > 0 ? panel.accList[0][0] : ''),
            minChars: 999, //set to large number to prevent query from being fired when typing
            pageSize: !isDealerRemisier ? 0 : N2N_CONFIG.constDRPagingSize,
            listeners: {
            	beforequery: function(qe){
            		if(isDealerRemisier){
            			if(qe.query.length == 0){
            				qe.cancel = true;	
            			}
            		}
            	},
            	afterrender: function(combo){
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
                select: function(thisCombo, records, eOpts) {
                    // gets selected account and split by -
                    var accountParts = thisCombo.getValue().split(global_AccountSeparator);
                    var thisAccount = accountParts[0].trim();
                    var accbranch = thisAccount + global_AccountSeparator + accountParts[1].trim();

                    Blinking.resetBlink(panel);
                    panel.accNo = thisAccount;
                    panel.accbranchNo = accbranch;
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
            emptyText: languageFormat.getLanguage(10044, 'Search Account...'),
            selectOnFocus: true,
            listeners: {
                specialkey: function(field, e) {
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
            handler: function() {
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

        panel.tComboBoxPaymentCode = new Ext.form.field.ComboBox({
            editable: false,
            width: 120,
            queryMode: 'local',
            store: filterPaymentCodeStore,
            displayField: 'desc',
            valueField: 'code',
            triggerAction: 'all',
            hidden: showPaymentCode.toLowerCase() == "true" ? false : true,
            value: (panel.arPaymentCodeList.length > 0 ? panel.arPaymentCodeList[0][0] : ''),
            listeners: {
                select: function(thisCombo, record, numIndex) {
                    Blinking.resetBlink(panel);
                    panel.filterPaymentCodeOpt = thisCombo.getValue();
                    panel.localSearch();
                }
            }
        });

        panel.tLabelLblBalance = new Ext.form.Label({
            text: languageFormat.getLanguage(20193, 'Bal.') + ': ',
            hidden: showBalanceNNetCashLimit == "TRUE" ? false : true
        });

        panel.tLabelValBalance = new Ext.form.Label({
            text: '-',
            hidden: showBalanceNNetCashLimit == "TRUE" ? false : true,
            cls: 'fix_top'
        });

        panel.tLabelLblNetCash = new Ext.form.Label({
            text: languageFormat.getLanguage(20194, 'Net Cash Limit') + ': ',
            hidden: showBalanceNNetCashLimit == "TRUE" ? false : true,
            cls: 'fix_top'
        });

        panel.tLabelValNetCash = new Ext.form.Label({
            text: '-',
            hidden: showBalanceNNetCashLimit == "TRUE" ? false : true,
            cls: 'fix_top'
        });

        panel.tLabelLblMarket = new Ext.form.Label({
            text: languageFormat.getLanguage(20293, 'Total Market Value') + ' : ',
            style: 'white-space:nowrap'
        });

        panel.tLabelValMarket = new Ext.form.Label({
            text: '-',
            style: 'white-space:nowrap'
        });

        panel.tLabelLblTotal = new Ext.form.Label({
            text: languageFormat.getLanguage(20294, 'Total Gain/Loss') + ' : ',
            style: 'white-space:nowrap'
        });

        panel.tLabelValTotal = new Ext.form.Label({
            text: '-',
            style: 'white-space:nowrap'
        });

        panel.tButtonDetail = new Ext.button.Button({
            text: languageFormat.getLanguage(20285, 'Detail'),
            tooltip: languageFormat.getLanguage(20285, 'Detail'),
            iconCls: 'icon-detail',
            handler: function() {
                panel.openDetailPanel();
            },
            hidden: ((panel.displayCategory == 'auto') ? (showPortFolioDetail == "TRUE" ? false : true) : (global_showPortFolioManualDetail == "TRUE" ? false : true)) 		// verify from main.jsp
        });

        panel.tButtonAdd = new Ext.button.Button({
            text: languageFormat.getLanguage(10012, 'Add'),
            tooltip: languageFormat.getLanguage(10012, 'Add'),
            iconCls: 'icon-portfolio-add',
            handler: function() {
                panel.addForm();
            },
            hidden: ((panel.displayCategory == 'auto') ? (showPortFolioDetailAdd == "TRUE" ? false : true) : (global_showPortFolioManualDetailAdd == "TRUE" ? false : true)) 	// verify from main.js
        });

        panel.tButtonExport = new Ext.button.Button({
            text: languageFormat.getLanguage(10004, 'Export CSV'),
            tooltip: languageFormat.getLanguage(10004, 'Export CSV'),
            iconCls: 'icon-export',
            hidden: !isDesktop,
            handler: function() {
                ExportFile.initial(ExportFile.FILE_CSV, panel);
            }
        });

        panel.compRef.topbar = Ext.create('Ext.toolbar.Toolbar', {
            itemId: panel.id + '_tbar',
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll,
            items: [
                panel.tComboBoxAccount,
                //panel.tbSearchAccount,
                panel.searchAccountBtn,
                panel.tComboBoxPaymentCode,
                panel.tButtonDetail,
                panel.tButtonAdd,
                panel.tButtonExport,
                '->',
                {
                    id: panel.id + 'saveSetting_PF',
                    xtype: xtype,
                    hidden: true,
                    style: "margin-right:10px;",
                    handler: function () {
                        msgutil.confirm(languageFormat.getLanguage(30008, 'You have unsaved setting. Would you like to save your setting?'),
                                function (sResp) {
                                    panel.isImgBlink = false;

                                    if (sResp == "yes") {
                                        cookies.procCookie(panel.pckId, panel.tempWidth, cookieExpiryDays);
                                        panel.tempWidth = cookies.toDefaultColumn(panel, panel.pckId);
                                    }
                                }
                        );
                    }
                },
                createAutoWidthButton(panel),
                //createAutoFitButton(panel),
                {
                    text: languageFormat.getLanguage(10005, 'Columns'),
                    xtype: xtype,
                    iconCls: 'icon-columnsetting',
                    hidden: global_showColSettingHeader == "TRUE" ? false : true,
                    handler: function () {
                        panel.openColumnSetting();
                    }
                },
                {
                    text: languageFormat.getLanguage(10008, 'Refresh'),
                    tooltip: languageFormat.getLanguage(10008, 'Refresh'),
                    xtype: xtype,
                    iconCls: 'icon-reset',
                    handler: function() {
                        Blinking.resetBlink(panel);
                        panel.store.clearFilter();
                        panel.search();
                    }
                }
            ]
        });

        var bottomItems = new Array();
        if (!isMobile) {
            bottomItems = [
                '->',
                panel.tLabelLblMarket,
                ' ',
                panel.tLabelValMarket,
                '&nbsp; &nbsp; &nbsp; &nbsp;',
                panel.tLabelLblTotal,
                ' ',
                panel.tLabelValTotal,
                '&nbsp; &nbsp; &nbsp; &nbsp;'
            ];
        } else {
            bottomItems = [
                panel.tLabelLblMarket,
                panel.tLabelValMarket,
                '->',
                panel.tLabelLblTotal,
                panel.tLabelValTotal
            ];
        }
        panel.compRef.bottombar = Ext.create('Ext.toolbar.Toolbar', {
            items: bottomItems,
            height: 25,
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll,
            hidden: !N2N_CONFIG.mfPortfolioSumBar
        });

        var store = new Ext.data.Store({
            model: 'TCPlus.model.EquityPrtfRecord'
        });

        var defaultConfig = {
            title: languageFormat.getLanguage(33690, 'Mutual Fund Portfolio'),
            width: '100%',
            height: 300,
            store: store,
            columns: {
                defaults: {
                    //menuDisabled: true
                	tdCls:'display-render',
                	lockable: false
                },
                items: panel.generateColumnsArray(panel.generateColumn(""))
            },
            bodyStyle: 'padding:0px; margin:0px; font-size: 12pt;',
            border: false,
            columnLines: false,
            enableColumnMove: N2N_CONFIG.gridColMove,
            enableColumnHide: N2N_CONFIG.gridColHide,
            header: false,
            viewConfig: getGridViewConfig(panel),
            bufferedRenderer: N2N_CONFIG.gridBufferedRenderer,
            leadingBufferZone: N2N_CONFIG.gridLeadingBufferZone,
            trailingBufferZone: N2N_CONFIG.gridTrailingBufferZone,
            keyEnabled: N2N_CONFIG.keyEnabled,
            selModel: {
                preventFocus: true
            },
            listeners: {
                resize: function(thisComp){
                	bufferedResizeHandler(panel);
                	
                        if (!panel.isFirstTime) {
                            helper.autoFitColumns(panel);
                        }
                },
                afterrender: function (thisComp) {
                    panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));

                    panel.tooltip = new Ext.tip.ToolTip({
                        target: panel.id + 'saveSetting_PF',
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
                    var tbar = panel.compRef.topbar;

                    tbar.insert(1, ' ');
                    var i = (!isDealerRemisier ? 0 : 2);

                    if (showPaymentCode == "TRUE") {
                        tbar.insert(3 + i, ' ');

                            tbar.insert(5 + i, '-');

                        if (showBalanceNNetCashLimit == "TRUE") {
                            tbar.insert(6 + i, panel.tLabelLblBalance);
                            tbar.insert(7 + i, ' ');
                            tbar.insert(8 + i, panel.tLabelValBalance);
                            tbar.insert(9 + i, '-');
                            tbar.insert(10 + i, panel.tLabelLblNetCash);
                            tbar.insert(11 + i, ' ');
                            tbar.insert(12 + i, panel.tLabelValNetCash);
                            tbar.insert(13 + i, '-');
                        }
                    } else {
                        tbar.insert(4 + i, '-');

                        if (showBalanceNNetCashLimit == "TRUE") {
                            tbar.insert(5 + i, panel.tLabelLblBalance);
                            tbar.insert(6 + i, ' ');
                            tbar.insert(7 + i, panel.tLabelValBalance);
                            tbar.insert(8 + i, '-');
                            tbar.insert(9 + i, panel.tLabelLblNetCash);
                            tbar.insert(10 + i, ' ');
                            tbar.insert(11 + i, panel.tLabelValNetCash);
                            tbar.insert(12 + i, '-');
                        }
                    }

                    tbar.doLayout();
                    panel.search();
                },
                beforedestroy: function () {
                    Blinking.resetBlink(panel);
                },
                columnresize: function(ct, column, newWidth) {
                    if (newWidth === 0) {
                        column.autoSize();
                        newWidth = column.width;
                    }

                    panel.updateColWidthCache(column, newWidth);

                    if (N2N_CONFIG.autoQtyRound) {
                        helper.refreshView(panel);
                    }

                },
                itemcontextmenu: function (thisView, record, item, index, e) {
                    if (!touchMode) {
                        panel.showContextMenu(thisView, record, index, e);
                    }
                },
                destroy: function () {
                    if (panel.contextMenu != null) {
                        panel.contextMenu.destroy();
                    }
                    Storage.generateUnsubscriptionByExtComp(panel);
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
                }
            },
            tbar: panel.compRef.topbar,
            bbar: panel.compRef.bottombar
        };

        panel.createContextMenu();

        Ext.apply(this, defaultConfig);
        this.callParent();

    },
    switchRefresh: function (silent) {
        var panel = this;
        
        reactivateRow(panel);
        panel._getStockData(N2N_CONFIG.gridBufferedRenderer);
        Storage.generateSubscriptionByList(panel.stkcodes, panel);
        
        helper.runBuffer(panel.getId() + 'prtfFitScreen');
    },
    callImageBlink: function () {
        var panel = this;

        var btn = Ext.getCmp(panel.id + 'saveSetting_PF');
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
            } else {
                btn.hide();
            }
        }, t);
    },
    imgBlink: function (hidden, btn) {
        var panel = this;

        if (hidden) {
            btn.setIcon(iconBtnSaveSettingOff);
        } else {
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
            columnID = global_FPColumnID;
            columnWidth = global_FPWidth;
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

        return panel.columnHash.get(columnID) || 100;
    },
    /**
     * Description <br/>
     * 
     * 		call ajax to display portfolio record
     * 
     * @param background : Boolean
     */
    search: function(background) {
        var panel = this;

        var _account = panel.tComboBoxAccount.getValue();
        if (_account == null || _account == '') {
            panel.setLoading(false);
            return;
        }

        try {
            if (!background) {
                helper.setHtml(panel.tLabelValMarket, panel.formatCurrency(0));
                helper.setHtml(panel.tLabelValTotal, panel.formatCurrency(0));
            }

            // delete existing record(s)
            if (panel.store.getCount() > 0) {
                panel.store.removeAll();
            }

            // display loading panel
            if (!background) {
                panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
            }

            var urlBuf = new Array();
            urlBuf.push(addPath + 'tcplus/atp/portfolio?');
            urlBuf.push('t=1');	// 1:unrealized, 0:realized

            if (panel.exchangecode) {
                urlBuf.push('&ex=' + panel.exchangecode);
            }
            urlBuf.push('&exfilt=' + N2N_CONFIG.mfExchCode);
            if (panel.filterPaymentCodeOpt) {
                urlBuf.push('&pcfilt=' + panel.filterPaymentCodeOpt);
            }
            if (panel.accNo) {
                urlBuf.push('&ac=' + panel.accNo);
            }

            var accountName = _account.split(global_AccountSeparator);
            if (accountName.length > 0) {
                urlBuf.push('&bc=' + accountName[accountName.length - 1].trim());
            }

            urlBuf.push('&category=' + panel.displayCategory);

            var url = urlBuf.join('');

            // if ajax is not null, it will cancel the ajax method
            if (panel.onAjaxPrftRequestId != null) {
                Ext.Ajax.abort(panel.onAjaxPrftRequestId);
            }

            panel.onAjaxPrftRequestId = Ext.Ajax.request({
                url: url,
                method: 'GET',
                success: function (response) {

                    try {
                        var obj = Ext.decode(response.responseText);

                        panel.updatePortfolio(obj);
                        panel.callAccBal();
                        panel._getStockData();
                        panel.onAjaxPrftRequestId = null;
                        panel.setLoading(false);
                    } catch (e) {
                        console.log('[MfFundPrtf][search][inner] Exception ---> ' + e);
                    }
                }
            });
        } catch (e) {
            console.log('[MfFundPrtf][search] Exception ---> ' + e);
        }

    },
    localSearch: function () {
        // Local filter     
        var panel = this;
        Blinking.clearBlink(panel);
        panel.getStore().filterBy(function (record) {
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

            var tempExchangeCode = formatutils.removeDelayExchangeChar(N2N_CONFIG.mfExchCode);

            if (record.get('ExchangeCode').toUpperCase().indexOf(tempExchangeCode) != -1) {
                blnFilterEx = true;
            } else {
                blnFilterEx = false;
            }

            return blnFilterSenderCode && blnFilterPaymentCode && blnFilterEx;
        });

        if (panel.getStore().getCount() == 0) {
            //helper.setHtml(panel.getView(), '<div class="x-grid-empty">' + panel.emptyResult + '</div>');
            helper.setGridEmptyText(panel, panel.emptyResult);
        }
    },
    /**
     * Description <br/>
     * 
     * 		
     */
    callAccBal: function() {
        var panel = this;

        try {
            var urlbuf = new Array();
            urlbuf.push(addPath + 'tcplus/atp/acc?');
            urlbuf.push('s=');
            urlbuf.push(new Date().getTime());

//            if (panel.exchangecode) {
//                urlbuf.push('&ex=' + panel.exchangecode);
//            }
            
            urlbuf.push('&ex=' + N2N_CONFIG.mfExchCode);

            var accno = (panel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[0].trim(); // #account list separator ('-')
            if (accno) {
                urlbuf.push('&ac=' + accno);
            }

            var accountName = (panel.tComboBoxAccount.getValue()).split(global_AccountSeparator); // #account list separator ('-')
            if (accountName.length > 0) {
                urlbuf.push('&bc=' + accountName[accountName.length - 1].trim());
            }

            var url = urlbuf.join('');

            if (panel.onAjaxAccRequestId != null) {
                Ext.Ajax.abort(panel.onAjaxAccRequestId);
            }

            panel.onAjaxAccRequestId = Ext.Ajax.request({
                url: url,
                method: 'POST',
                timeout: 60000,
                success: function(response) {
                    var obj = null;
                    try {
                        obj = Ext.decode(response.responseText);

                        if (obj != null && obj.s == true) {
                            panel.updateAccBal(obj);
                        }

                        panel.onAjaxAccRequestId = null;
                    } catch (e) {
                        console.log('[MfFundPrtf][callAccBal][inner] Exception ---> ' + e);
                    }
                },
                failure: function(response) {
                    debug(response);
                    panel.onAjaxAccRequestId = null;
                }
            });

        } catch (e) {
            console.log('[MfFundPrtf][callAccBal] Exception ---> ' + e);
        }
    },
    /**
     * Description <br/>
     * 
     * 		set record into grid panel
     * 
     * @param obj : Json 
     */
    updatePortfolio: function(obj) {
        var panel = this;
        var gridColumns = helper.getGridColumns(panel);

        if (obj.s) {
            var dt = obj.pf;
            var panelStore = panel.getStore();

            if (panelStore.getCount() == 0) {
                var tempDt = new Array();
                var count = dt.length;

                for (var i = 0; i < count; i++) {
                    var dataObject = dt[i];

                    var dExCode = panel.getExchangeType(dataObject.sc);
//                    tLog('||| updatePortfolio 1 , ' ,dExCode , dataObject.sc);
                    if( N2N_CONFIG.mfExchCode != dExCode)
                        continue;
                    
                    if (panel.accNo && dataObject.an && dataObject.an != panel.accNo) {
                        continue;
                    }

                    var data = new Object();
                    data.PrtfNo = dataObject.pn;
                    data.StkCode = dataObject.sc;
                    data.exch = stockutil.getExchange(dataObject.sc);
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
                    data.UncommitedShare = data.QtyOnHand - data.QtySIP;
                    data.AvgPurPrc = dataObject.abp;
                    data.LotSize = dataObject.ls;
                    data.Currency = dataObject.cr;
                    data.QtySold = dataObject.qtys;
                    data.QtySusp = dataObject.qtysusp == "" ? 0 : dataObject.qtysusp;
                    data.avgsp = dataObject.avgsp;
                    data.SettOpt = dataObject.setO;
                    // determine transaction type
                    data.action = panel.getActionType(dataObject);
                    data.UrlGLAmt = panel.generateUrlGLAmt(dataObject.lp, dataObject.abp, dataObject.qh, data.action, dataObject.avgsp, data.exch);
                    data.UrlGLPc = panel.generateUrlGLPerc(data.UrlGLAmt, dataObject.abp, dataObject.qh, data.action, dataObject.avgsp);
                    //check if last price avaliable
                    if (dataObject.lp && dataObject.lp != 0) {
                        data.MktVal = panel.generateMktValue(dataObject.lp, dataObject.qh);
                    } else if (dataObject.rp && dataObject.rp != 0) { //else if lacp avaliable
                        data.MktVal = panel.generateMktValue(dataObject.rp, dataObject.qh);
                    } else { //else empty
                        data.MktVal = 0;
                    }
                    data.ChgPc = parseFloat(0).toFixed(2);
                    data.Volume = 0;
                    data.TradeValue = panel.generateTradeValue(dataObject.qh, dataObject.abp, dataObject.avgsp);
                    data.BCode = dataObject.bc;
                    data.AccountName = dataObject.cliname1;
                    data.ReqCC = dataObject.reqcc;
                    data.Amount = dataObject.amt;
                    
                    lotSizeArchives.addLotSize(dataObject['sc'], dataObject['ls']);

                    var exCode = panel.getExchangeType(dataObject.sc);
                    data.ExchangeCode = exCode;

                    if (!contains(panel.feedExchangeList, exCode)) {
                        panel.feedExchangeList.push(exCode);
                    }
                    tempDt.push(data);

                    if (panel.stkcodes == null) {
                        panel.stkcodes = new Array();
                    }

                    var tempStkCode = formatutils.addDelaySuffix(dataObject.sc, true); //shuwen 20130821 - handle delay feed
                    var dExCode = panel.getExchangeType(dataObject.sc);
                    if (N2N_CONFIG.mfExchCode == dExCode &&!contains(panel.stkcodes, tempStkCode)) { //shuwen 20130821 - handle delay feed
                        panel.stkcodes.push(tempStkCode); 
                    }
                }

                panel.prtfList = tempDt;

                var jsonObj = {
                    success: obj.s,
                    count: tempDt.length,
                    data: tempDt
                };
                
                resetGridScroll(panel);
                panelStore.loadRawData(jsonObj);
                activateRow(panel);
                panel.localSearch();
                panel.updateSummary();
                n2ncomponents.activateEmptyScreens();
                Storage.generateSubscriptionByList(panel.stkcodes, panel);
                
                if (panel.isFirstTime) {
                    helper.autoFitColumns(panel);
                    panel.isFirstTime = false;
                }

            } else {

                var isUpdateSummary = false;

                var count = dt.length;

                for (var i = 0; i < count; i++) {
                    var dataObject = dt[i];

                    var dExCode = panel.getExchangeType(dataObject.sc);
//                    tLog('||| updatePortfolio 2 , ' ,dExCode , dataObject.sc);
                    if( N2N_CONFIG.mfExchCode != dExCode)
                        continue;
                    
                    if (dataObject.an != panel.accNo) {
                        continue;
                    }

                    var portFolioNo = d.pn; // TODO
                    var rowNumber = panelStore.indexOfId(portFolioNo);

                    if (rowNumber != -1) {
                        var record = panelStore.getAt(rowNumber);

                        if (record != null) {
                            var tempArray = new Array();
                            tempArray.push({name: 'AccNo', value: dataObject['an'], type: "string"});
                            tempArray.push({name: 'YrHigh', value: dataObject['yh'], type: "change"});
                            tempArray.push({name: 'YrLow', value: dataObject['yl'], type: "change"});
                            tempArray.push({name: 'QtyOnHand', value: dataObject['qh'], type: "string"});
                            tempArray.push({name: 'QtyAvlb', value: dataObject['qa'], type: "string"});
                            tempArray.push({name: 'QtySIP', value: dataObject['qsip'], type: "string"});
                            tempArray.push({name: 'AvgPurPrc', value: dataObject['abp'], type: "change"});
                            tempArray.push({name: 'LotSize', value: dataObject['ls'], type: "string"});
                            tempArray.push({name: 'Amount', value: dataObject['amt'], type: "change"});
                            lotSizeArchives.addLotSize(dataObject['sc'], dataObject['ls']);
                            if(dataObject['qh'] && dataObject['qsip'])
                                tempArray.push({name: 'UncommitedShare', value: dataObject['qh'] - dataObject['qsip'], type: "string"});

                            // loop array new data
                            for (var ii = 0; ii < tempArray.length; ii++) {
                                var objs = tempArray[ii];
                                // get array data value
                                var newValue = objs.value;

                                if (newValue != null) {
                                    // get record old data
                                    var oldValue = record.data[objs.name];

                                    // update record data 
                                    record.data[objs.name] = newValue;

                                    var col = helper.getColumn(gridColumns, 'dataIndex', objs.name);
                                    if (col != -1) {
                                        var columnIndex = col.index;
                                        var cssClass = "";

                                        if (objs.type == "string") {
                                            cssClass += " " + N2NCSS.FontString;
                                            cssClass += " " + N2NCSS.FontUnChange;

                                        } else if (objs.type == "change") {
                                            cssClass += " " + N2NCSS.FontString;

                                            if (parseFloat(value) > 0)
                                                cssClass += " " + N2NCSS.FontUp;
                                            else if (parseFloat(value) < 0)
                                                cssClass += " " + N2NCSS.FontDown;
                                            else
                                                cssClass += " " + N2NCSS.FontUnChange;
                                        }
                                        else {
                                            cssClass += " " + N2NCSS.FontString;
                                            cssClass += " " + N2NCSS.FontUnChange;
                                        }

                                        N2NUtil.updateCell(panel, rowNumber, columnIndex, newValue, cssClass);

                                        // verify if the column is not hidden
                                        if (!col.hidden) {
                                            Blinking.setBlink(panel, rowNumber, columnIndex, "unchange");
                                        }
                                    }

                                    if (objs.name == "QtyOnHand" || objs.name == "QtyAvlb") {
                                        isUpdateSummary = true;
                                    }
                                }
                            }

                        } else {
                            isUpdateSummary = true;

                            // create new record
                            var newRecord = Ext.create('TCPlus.model.EquityPrtfRecord', {
                                PrtfNo: dataObject.pn,
                                StkCode: dataObject['sc'],
                                StkName: dataObject['sy'],
                                AccNo: dataObject['an'],
                                YrHigh: dataObject['yh'],
                                YrLow: dataObject['yl'],
                                DayHigh: dataObject['dh'],
                                DayLow: dataObject['dl'],
                                RefPrc: dataObject['rp'],
                                Last: dataObject['lp'],
                                QtyOnHand: dataObject['qh'],
                                UncommitedShare: dataObject['qh'] - dataObject['qsip'],
                                QtyAvlb: dataObject['qa'],
                                QtySIP: dataObject['qsip'],
                                AvgPurPrc: dataObject['abp'],
                                LotSize: dataObject['ls'],
                                Currency: dataObject['cr'],
                                ExchangeCode: panel.getExchangeType(dataObject['sc']),
                                BCode: dataObject['bc'],
                                AccountName: dataObject['cliname1'],
                                ReqCC: dataObject['reqcc'],
                                Amount: dataObject['amt']
                            });
                            
                            lotSizeArchives.addLotSize(dataObject['sc'], dataObject['ls']);

                            try {
                                panelStore.addSorted(newRecord);
                            } catch (e) {
                                console.log('[MfFundPrtf][updatePortfolio][inner] Exception ---> ' + e);
                            }

                            var row = panelStore.indexOfId(dataObject.pn);

                            panel.updateCalInfo2(newRecord, row);
                        }
                    }
                }

                if (isUpdateSummary) {
                    panel.updateSummary();
                }
            }
        } else {
            var msg = panel.emptyText;
            if (obj && obj.msg) {
                //msg = obj.msg;
            	msg = languageFormat.getLanguage(33696, 'Your mutual fund portfolio is empty.');
            }
            //helper.setHtml(panel.getView(), '<div class="x-grid-empty">' + msg + '</div>');
            helper.setGridEmptyText(panel, msg);
        }

    },
    /**
     * Description <br/>
     * 
     * 		calculate account balance and net cash 
     * 
     * @param obj : Json
     */
    updateAccBal: function(obj) {

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
            // manually do layout
            panel.compRef.topbar.doLayout();

        } catch (e) {
            console.log('[MfFundPrtf][updateAccBal] Exception ---> ' + e);
        }
    },
    formatAccBalDecimal: function(value) {
        if (isNaN(value))
            return null;

        var decimal = 2;
        return parseFloat(value).toFixed(decimal);
    },
    updateFeedRecord: function(dataObj) {
        var panel = this;
        try {
            var isUpdateSumary = false;
            var panelStore = panel.store;

            if (panelStore != null && panelStore.getCount() > 0) {
                var objStkCode = dataObj[fieldStkCode];
                
                if (objStkCode == null) {
                    return;
                }
                
                var exch = stockutil.getExchange(objStkCode);
                
                if (formatutils.isForcedDelayed(exch)) {
                    return; // skip updating real time for those forcing delay exchanges
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
                    var gridColumns = helper.getGridColumns(panel);

                    var tempArray = new Array();
                    tempArray.push({name: "RefPrc", value: dataObj[fieldLacp], type: 'price'});
                    tempArray.push({name: "LotSize", value: dataObj[fieldLotSize], type: 'number'});
                    tempArray.push({name: "Volume", value: dataObj[fieldVol], type: 'number'});
                    tempArray.push({name: "Last", value: dataObj[fieldLast], type: 'price'});
                    tempArray.push({name: "Prev", value: dataObj[fieldPrev], type: 'price'});
                    tempArray.push({name: "Open", value: dataObj[fieldOpen], type: 'price'});
                    tempArray.push({name: fieldBuy, value: dataObj[fieldBuy], type: 'price'});
                    tempArray.push({name: fieldSell, value: dataObj[fieldSell], type: 'price'});
                    tempArray.push({name: 'DayHigh', value: dataObj[fieldHigh], type: 'price'});
                    tempArray.push({name: 'DayLow', value: dataObj[fieldLow], type: 'price'});
                    tempArray.push({name: "ChgAmt", value: dataObj[fieldPrfChange], type: 'change'});
                    tempArray.push({name: "ChgPc", value: dataObj[fieldPrfChangePer], type: 'change'});
                    for (var ii = 0; ii < tempArray.length; ii++) {
                        var objs = tempArray[ii];
                        // get array data value
                        var newValue = objs.value;

                        if (newValue != null) {
                            // get record old data
                            var oldValue = record.data[objs.name];
                            record.data[objs.name] = newValue;

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


                                        N2NUtil.updateCell(panel, rowIndex, columnIndex, stringValue, cssClass);
                                        Blinking.setBlink(panel, rowIndex, columnIndex, "unchange");

                                    } else if (objs.type == "change") {
                                        var cssClass = " " + N2NCSS.FontString;
                                        if (parseFloat(newValue) > 0)
                                            cssClass += " " + N2NCSS.FontUp;
                                        else if (parseFloat(newValue) < 0)
                                            cssClass += " " + N2NCSS.FontDown;

                                        N2NUtil.updateCell(panel, rowIndex, columnIndex, newValue, cssClass);

                                        if (parseFloat(newValue) > oldValue) {
                                            Blinking.setBlink(panel, rowIndex, columnIndex, "up");

                                        } else if (parseFloat(newValue) < oldValue) {
                                            Blinking.setBlink(panel, rowIndex, columnIndex, "down");
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
                                            N2NUtil.updateCell(panel, rowIndex, columnIndex, priceObj.value, cssClass);

                                            if (newValue > oldValue) {
                                                Blinking.setBlink(panel, rowIndex, columnIndex, "up", true);

                                            } else if (newValue < oldValue) {
                                                Blinking.setBlink(panel, rowIndex, columnIndex, "down", true);
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
                                            N2NUtil.updateCell(panel, rowIndex, avgPurPrcColumnIndex, panel.formatDecimal(record.data['AvgPurPrc'], decimalCtrl.prtf.avgbuyprice), fontcss);
                                            Blinking.setBlink(panel, rowIndex, avgPurPrcColumnIndex, blinkcss);
                                        }
                                    }
                                }
                            }

                            if (objs.name == "Last") {
                                isUpdateLast = true;
                                isUpdateSumary = true;
                            }
                        }
                    }

                    if (dataObj[fieldLacp] != null || dataObj[fieldLast] != null || dataObj[fieldOpen] != null || dataObj[fieldPrev] != null) {
                        panel.updateCalInfo2(record, rowIndex);
                    }

                    var updateStatus = false;

                    var stockStatusCode = '';
                    if (dataObj[fieldStatus] != null) {
                        stockStatusCode = dataObj[fieldStatus].charAt(1);
                        var oriRSSIValue = dataObj[fieldStatus].charAt(0);
                			var newsValue = dataObj[fieldStatus].charAt(5) + dataObj[fieldStatus].charAt(4);
                			if (newsValue == '..')
                                newsValue = '';
                            else
                                newsValue = newsValue.replace('.', '');
                			
                			if (newsValue != null && newsValue != record.data[fieldNews]) {
                				record.data[fieldNews] = newsValue;
                			}
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

//                    if (stockStatusCode && record.data[fieldStatus] !== stockStatusCode) {
//                    	record.data[fieldStkStatus] = stockStatusCode;
//                    	updateStatus = true;
//                    }

                    var stockIndexCode = dataObj[fieldIndexCode];
                    if (stockIndexCode && record.data[fieldIndexCode] !== stockIndexCode) {
                        record.data[fieldIndexCode] = stockIndexCode;
                        updateStatus = true;
                    }
                    if (updateStatus) {
                        var lockedColumns = helper.getGridColumns(panel, 'lock');
                        var stockNameIndex = helper.getColumnIndex(lockedColumns, 'itemId', panel._idPrefix + cmap_fpFundName);
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

                            N2NUtil.updateCell(panel, rowIndex, stockNameIndex, tempData, cssClass, 'lock');
                        }
                    }
                }
            }
            }

            if (!panel.suspendSummary && isUpdateSumary) {
                panel.updateSummary();
            }

        } catch (e) {
            console.log('[MfFundPrtf][updateFeedRecord] Exception ---> ' + e);
        }
    },
    _getStockData: function () {
        var me = this;
        
        if (me.stkcodes && me.stkcodes.length > 0) {
            conn.getStockList({
                list: me.stkcodes,
                f: [fieldStkCode, fieldLacp, fieldCurrency, fieldLotSize, fieldVol, fieldLast, fieldPrev, fieldBuy, fieldSell, fieldHigh, fieldLow, fieldStatus, fieldIndexCode, fieldOpen],
                p: 0,
                c: me.stkcodes.length,
                skipMDColCheck: true,
                success: function(res) {
                    if (res.d && res.d.length > 0) {
                        me.suspendSummary = true;
                        for (var i = 0; i < res.d.length; i++) {
                            var fd = _formatSingleVertxData({data: res.d[i]});
                            updater.updateQuote(fd);
                        }
                        me.suspendSummary = false;
                        me.updateSummary();
                    }
                }
            });
        }

    },
    /**
     * Description <br/>
     * 
     * 		update column 'Unrealized.G/L' , 'PL %' and 'Mkt.Val' value
     * 
     * @param record 	: Ext.data.Record
     * @param rowNumber : integer
     */
    updateCalInfo2: function(record, rowNumber) {
//        tLog('updateCalInfo2' ,record);
        var panel = this;
        var cssClass;

        if (record == null || rowNumber == null) {
            return;
        }

        var gridColumns = helper.getGridColumns(panel);
        if (rowNumber != -1) {
            var valuePrc = 0;
            
            // standardize reference price as derivative portfolio
            if (record.data.Last && record.data.Last != 0) {
                valuePrc = record.data.Last;
            } else if (record.data.RefPrc && record.data.RefPrc != 0) { // lacp
                valuePrc = record.data.RefPrc;
            } else if (N2N_CONFIG.prtfUseOpenPrev) {
                if (record.data.Open && record.data.Open != 0) {
                    valuePrc = record.data.Open;
                } else if (record.data.Prev && record.data.Prev != 0) {
                    valuePrc = record.data.Prev;
                }
            }
            
            if (!isNaN(valuePrc) && valuePrc > 0) {
                var avgPurPrc = record.data.AvgPurPrc;
                var qtyOnHand = record.data.QtyOnHand;
                var action = record.data.action;
                var avgSellPrc = record.data.avgsp;
                var exch = record.data.exch;

                if (!isNaN(avgPurPrc) && !isNaN(qtyOnHand)) {
                    var urlglamt = panel.generateUrlGLAmt(valuePrc, avgPurPrc, qtyOnHand, action, avgSellPrc, exch);
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
                                N2NUtil.updateCell(panel, rowNumber, urlglamtColumnIndex, urlglamtStr, cssClass, true);

                                if (!urlglamtColumn.hidden) {
                                    Blinking.setBlink(panel, rowNumber, urlglamtColumnIndex, "unchange");

                                }
                            }
                        }
                    }

                    var urlglpc = 0;
                    var urlglpcColumn = helper.getColumn(gridColumns, 'dataIndex', "UrlGLPc");
                    
                    if (N2N_CONFIG.prtfTrxFee) {
                        urlglpc = panel.generateUrlGLPerc(urlglamt, avgPurPrc, qtyOnHand, action, avgSellPrc);
                    } else {
                        if ((avgPurPrc * qtyOnHand) > 0) {
                            urlglpc = panel.generateUrlGLPerc(urlglamt, avgPurPrc, qtyOnHand, action, avgSellPrc);
                        }
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

                            N2NUtil.updateCell(panel, rowNumber, urlglpcColumnIndex, urlglpc, cssClass);

                            if (!urlglpcColumn.hidden) {
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
                                N2NUtil.updateCell(panel, rowNumber, mktvalColumnIndex, mktval, cssClass);

                                if (!mktvalColumn.hidden) {
                                    Blinking.setBlink(panel, rowNumber, mktvalColumnIndex, "unchange");
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    /**
     * Description <br/>
     * 
     * 		generate grid panel column header
     * 
     * @return array
     */
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
            } else if (type == "string" || type == 'number') {
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
                case cmap_fpFundCode:
                    columnList.push({
                        itemId: prtf + cmap_fpFundCode,
                        header: languageFormat.getLanguage(33510, "Fund Code"),
                        dataIndex: 'StkCode',
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID),
                        locked: true,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'string');

                            return formatutils.procStringValue(value);
                            }
                        });
                    break;
                    case cmap_fpFundName:
                        columnList.push({
                            itemId: prtf + cmap_fpFundName,
                            header: languageFormat.getLanguage(33511, "Fund Name"),
                            dataIndex: 'StkName',
                            hidden: columnVisible,
                            sortable: true,
                            width: panel.getWidth(columnID),
                            locked: true,
                            renderer: function(value, meta, record) {
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
                    case cmap_fpQTYQ:
                        columnList.push({
                            itemId: prtf + cmap_fpQTYQ,
                            header: languageFormat.getLanguage(33698, 'QTY Q(S)'),
                            dataIndex: 'QtySIP',
                            hidden: columnVisible,
                            sortable: true,
                            width: panel.getWidth(columnID),
                            lockable: false,
                            renderer: function(value, meta, record) {
                                newSetting(meta, value, record, 'number');
                                return panel.returnNumberFormat(value, panel.getWidth(cmap_fpQTYQ));
                            },
                            align: 'right'});
                    break;
                    case cmap_fpAvgSP:
                        columnList.push({
                            itemId: prtf + cmap_fpAvgSP,
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
                    case cmap_fpAvgBPrc:
                        columnList.push({
                            itemId: prtf + cmap_fpAvgBPrc,
                            header: languageFormat.getLanguage(10705, "Avg.Buy.Prc"),
                            dataIndex: 'AvgPurPrc',
                            hidden: columnVisible,
                            sortable: true,
                            width: panel.getWidth(columnID),
                            lockable: false,
                            renderer: function(value, meta, record) {
                                newSetting(meta, value, record, 'number');
                                return panel.formatDecimal(value, decimalCtrl.prtf.avgbuyprice);
                            },
                            align: 'right'});
                        break;
                    case cmap_fpLast:
                        columnList.push({
                            itemId: prtf + cmap_fpLast,
                            header: languageFormat.getLanguage(33526, 'NAVPS'),
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
                    case cmap_fpQtyHand:
                        columnList.push({
                            itemId: prtf + cmap_fpQtyHand,
                            header: languageFormat.getLanguage(10702, "Qty.Hand"),
                            tooltip: languageFormat.getLanguage(10732, "Quantity on hand"),
                            dataIndex: 'QtyOnHand',
                            hidden: columnVisible,
                            sortable: true,
                            width: panel.getWidth(columnID),
                            lockable: false,
                            renderer: function(value, meta, record) {
                                newSetting(meta, value, record, 'number');
                                return panel.returnNumberFormat(value, panel.getWidth(cmap_fpQtyHand));
                            },
                            align: 'right'});
                    break;
                    case cmap_fpUncommittedShares:
                        columnList.push({
                            itemId: prtf + cmap_fpUncommittedShares,
                            header: languageFormat.getLanguage(33692, 'Uncommitted Shares'),
                            dataIndex:  'UncommitedShare',
                            hidden: columnVisible,
                            sortable: true,
                            width: panel.getWidth(columnID),
                            lockable: false,
                            renderer: function(value, meta, record) {
                                newSetting(meta, value, record, 'number');
                                return panel.returnNumberFormat(value, panel.getWidth(cmap_fpUncommittedShares));
                            },
                            align: 'right'});
                    break;
                    case cmap_fpMarketValue:
                        columnList.push({
                            itemId: prtf + cmap_fpMarketValue,
                            header: languageFormat.getLanguage(33695, 'Market Value'),
                            dataIndex: 'MktVal',
                            hidden: columnVisible,
                            sortable: true,
                            width: panel.getWidth(columnID),
                            lockable: false,
                            renderer: function(value, meta, record) {
                                newSetting(meta, value, record, 'number');
                                return panel.returnNumberFormat(value, panel.getWidth(cmap_fpMarketValue));
                            },
                            align: 'right'});
                    break;
                    case cmap_fpGainLoss:
                        columnList.push({
                            itemId: prtf + cmap_fpGainLoss,
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

                                return panel.returnNumberFormat(value, panel.getWidth(columnID));
                            },
                            align: 'right'});
                    break;
                    
                    case cmap_fpGainLossP:
                        columnList.push({
                            itemId: prtf + cmap_fpGainLossP,
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
                            align: 'right'});
                    break;
                    case cmap_fpCurrency:
                        columnList.push({
                            itemId: prtf + cmap_fpCurrency,
                            header: languageFormat.getLanguage(10132, 'Currency'),
                            dataIndex:  'Currency',
                            hidden: columnVisible,
                            sortable: true,
                            width: panel.getWidth(columnID),
                            lockable: false,
                            renderer: function(value, meta, record) {
                                newSetting(meta, value, record, 'string');

                                return formatutils.procStringValue(value);
                            },
                            align: 'right'});
                    break;
                    case cmap_fpAmount:
                        columnList.push({
                            itemId: prtf + cmap_fpAmount,
                            header: languageFormat.getLanguage(33697, 'Amount'),
                            dataIndex:  'Amount',
                            hidden: columnVisible,
                            sortable: true,
                            width: panel.getWidth(columnID),
                            lockable: false,
                            renderer: function(value, meta, record) {
                                newSetting(meta, value, record, 'number');
                                return panel.returnNumberFormat(value, panel.getWidth(cmap_fpAmount));
                            },
                            align: 'right'});
                    break;
            }

        }

        return columnList;
    },
    /**
     * Description <br/>
     * 
     * 		generate show column setting
     * 
     * @param : newSetting : string
     * 
     * @return array
     */
    generateColumn: function(newSetting) {
        var panel = this;

        return colutils.generateColumnArray(panel, newSetting);
    },
    /**
     * Description <br/>
     * 
     * 		convert column id to string 
     * 
     * @param id : string
     * 
     * @return String
     */
    generateColumnName: function(id) {
        var string = "";

        switch (id) {
            case cmap_mfFundCode:
                string = languageFormat.getLanguage(33510, 'Fund Code');
                break;
            case cmap_fpFundName:
                string = languageFormat.getLanguage(33511, 'Fund Name');
                break;
            case cmap_fpQTYQ:
                string = languageFormat.getLanguage(33698, 'QTY Q(S)');
                break;
            case cmap_fpQtyHand:
                string = languageFormat.getLanguage(10702, "Qty.Hand");
                break;
            case cmap_fpUncommittedShares:
                string = languageFormat.getLanguage(33692, 'Uncommitted Shares');
                break;
            case cmap_fpAvgSP:
                string = languageFormat.getLanguage(10715, "Avg.Sell.Price");
                break;
            case cmap_fpAvgBPrc:
                string = languageFormat.getLanguage(10705, "Avg.Buy.Prc");
                break;
            case cmap_fpLast:
                string = languageFormat.getLanguage(33526, 'NAVPS');
                break;
            case cmap_fpMarketValue:
                string = languageFormat.getLanguage(33695, 'Market Value');
                break;
            case cmap_fpGainLoss:
                string = languageFormat.getLanguage(10708, "Un.G/L");
                break;
            case cmap_fpGainLossP:
                string = languageFormat.getLanguage(10716, "Un.G/L %");
                break;
            case cmap_fpCurrency:
                string = languageFormat.getLanguage(10132, 'Currency');
                break;
            case cmap_fpAmount:
                string = languageFormat.getLanguage(33697, 'Amount');
                break;
            default:
                string = "";
        }

        return string;
    },
    generateUrlGLAmt: function(valuePrice, avgBuyPrice, qtyOnHand, action, avgSellPrice, exch) {
        var decimalPlace = 2;
        var urlGtAmt = 0;

        if (qtyOnHand == 0 || qtyOnHand == null || valuePrice == 0) {
            urlGtAmt = 0;
        } else {
//            if (N2N_CONFIG.prtfTrxFee) {
//                var absQtyOnHand = Math.abs(qtyOnHand);
//                var trxFeeObj = getTrxFeeFromATPRules(exch, action, valuePrice, absQtyOnHand);
//                var trxFee = parseFloat(trxFeeObj.trxFee) || 0;
//                tLog('generateUrlGLAmt trxFee', trxFee);
//                
//                var sellTrxFee = 0;
//                if (N2N_CONFIG.prtfSellTrxFee && trxFeeObj.SellTrxFee != null) { // include sell fee in trade fee
//                    sellTrxFee = parseFloat(trxFeeObj.SellTrxFee);
//                }
//
//                if (action === modeOrdSell) {
//                    urlGtAmt = ((avgSellPrice - valuePrice) * absQtyOnHand) - trxFee;
//                } else {
//                    urlGtAmt = ((valuePrice - avgBuyPrice) * absQtyOnHand) - (trxFee + sellTrxFee);
//                }
//                
//            } else {
                urlGtAmt = (valuePrice - avgBuyPrice) * qtyOnHand;
//            }
        }

        if (decimalPlace > 0) {
            if (decimalPrtfFieldMeta != "" && decimalPrtf != "") {
                urlGtAmt = this.formatDecimal(parseFloat(urlGtAmt), decimalCtrl.prtf.unrealizedgl);
            } else {
                urlGtAmt = parseFloat(urlGtAmt).toFixed(decimalPlace);
            }
        }

        return urlGtAmt;
    },
    generateUrlGLPerc: function(urlglamt, avgBuyPrice, qtyOnHand, action, avgSellPrice) {
        var decimalPlace = 2;
        var urlGtPerc = '-';
        var actionPrice = avgBuyPrice;
        
//        if (N2N_CONFIG.prtfTrxFee) {
//            actionPrice = action === modeOrdSell ? avgSellPrice : avgBuyPrice;
//            qtyOnHand = Math.abs(qtyOnHand);
//        }

        var tempValue = actionPrice * qtyOnHand;

        if (tempValue != 0) {
            urlGtPerc = (urlglamt * 100) / tempValue;

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
        return mktVal;
    },
    generateTradeValue: function(qtyOnHand, avgBuyPrice, action, avgSellPrice) {
        var decimalPlace = 2;
        var tradeVal = 0;
        var actionPrice = avgBuyPrice;

        if (N2N_CONFIG.prtfTrxFee) {
            actionPrice = action === modeOrdSell ? avgSellPrice : avgBuyPrice;
        }

        if (actionPrice != 0 || actionPrice != null) {
            tradeVal = parseFloat(qtyOnHand * actionPrice).toFixed(decimalPlace);
        }
        return tradeVal;
    },
    /**
     * Description <br/>
     * 
     * 		update 'Total Market Value' and 'Total Gain/Loss' label price
     * 
     */
    updateSummary: function() {
        var panel = this;

        var store = panel.store;
        var totMktVal = 0;
        var totUrlGLAmt = 0;

        if (store != null) {
            var total = store.getCount();

            for (var i = 0; i < total; i++) {
                var record = store.getAt(i);
                var valuePrc = 0;
                // standardize reference price as derivative portfolio
                if (record.data.Last && record.data.Last != 0) {
                    valuePrc = record.data.Last;
                } else if (record.data.RefPrc && record.data.RefPrc != 0) { // lacp
                    valuePrc = record.data.RefPrc;
                } else if (N2N_CONFIG.prtfUseOpenPrev) {
                    if (record.data.Open && record.data.Open != 0) {
                        valuePrc = record.data.Open;
                    } else if (record.data.Prev && record.data.Prev != 0) {
                        valuePrc = record.data.Prev;
                    }
                }
                
                var recCurrency = record.data.Currency;
                var mktVal = panel.generateMktValue(valuePrc, record.data.QtyOnHand);
                var urlGLAmt = panel.generateUrlGLAmt(valuePrc, record.data.AvgPurPrc, record.data.QtyOnHand, record.data.action, record.data.avgsp, record.data.exch);

                if (panel.convertCurrencyEnable) {

                    var currencyRateList = panel.currencyRateList;
                    var n = currencyRateList.size;

                    for (var j = 0; j < n; j++) {
                        var inListCurrency = currencyRateList.d[j].currate[0];
                        if (recCurrency == panel.currentCurrency) {
                            // same currency no need convert
                            if (!isNaN(mktVal)) {
                                totMktVal += parseFloat(mktVal);
                            }

                            if (!isNaN(urlGLAmt)) {
                                totUrlGLAmt += parseFloat(urlGLAmt);
                            }

                            break;
                        } else if (inListCurrency == recCurrency) {
                            // not same curreny and need convert
                            var buyRate = currencyRateList.d[j].currate[3];
                            var denomiation = currencyRateList.d[j].currate[5];
                            
                            // Skip when denomiation is zero
                            if (denomiation == 0) {
                                break;
                            }
                            
                            // convert
                            if (!isNaN(mktVal)) {
                                var val = parseFloat(mktVal / denomiation * buyRate);
                                totMktVal += val;
                            }

                            if (!isNaN(urlGLAmt)) {
                                var val = parseFloat(urlGLAmt / denomiation * buyRate);
                                totUrlGLAmt += val;
                            }

                            break;
                        } else {
                            // unable to find
                        }
                    }
                } else {
                    // take back original value
                    if (!isNaN(mktVal)) {
                        totMktVal += parseFloat(mktVal);
                    }

                    if (!isNaN(urlGLAmt)) {
                        totUrlGLAmt += parseFloat(urlGLAmt);
                    }
                }
            }
        }

        totMktVal = parseFloat(totMktVal).toFixed(2);
        totUrlGLAmt = parseFloat(totUrlGLAmt).toFixed(2);

        helper.setHtml(panel.tLabelValMarket, '<span title="' + panel.currentCurrency + ' ' + panel.formatCurrency(totMktVal) + '">' + panel.currentCurrency + ' ' + panel.returnNumberFormat(totMktVal, 50)) + '</span>';
        helper.setHtml(panel.tLabelValTotal, '<span title="' + panel.currentCurrency + ' ' + panel.formatCurrency(totUrlGLAmt) + '">' + panel.currentCurrency + ' ' + panel.returnNumberFormat(totUrlGLAmt, 50)) + '</span>';
        // do layout
        panel.compRef.bottombar.doLayout();
    },
    /**
     * Description <br/>
     * 
     * 		update grid panel cell design 
     * 
     * @param record 	: Ext.data.Record
     * @param rowNumber 	: integer
     */
    rePaintRecPriceColor: function(record, rowNumber) {
        var panel = this;

        var yrhighIdx = panel.getColumnModel().findColumnIndex("YrHigh");
        var yrlowIdx = panel.getColumnModel().findColumnIndex("YrLow");
        var dayhighIdx = panel.getColumnModel().findColumnIndex("DayHigh");
        var daylowIdx = panel.getColumnModel().findColumnIndex("DayLow");
        var avgpurprcIdx = panel.getColumnModel().findColumnIndex("AvgPurPrc");

        var yrhigh = record.data.YrHigh;
        var yrlow = record.data.YrLow;
        var dayhigh = record.data.DayHigh;
        var daylow = record.data.DayLow;
        var avgpurprc = record.data.AvgPurPrc;


        if (yrhighIdx != -1) {
            if (parseFloat(yrhigh) == 0 || yrhigh == null || yrhigh == '') {
                yrhigh = "-";
            }
            N2NUtil.updateCell(panel, rowNumber, yrhighIdx, yrhigh);
        }
        if (yrlowIdx != -1) {
            if (parseFloat(yrlow) == 0 || yrlow == null || yrlow == '') {
                yrlow = "-";
            }
            N2NUtil.updateCell(panel, rowNumber, yrlowIdx, yrlow);
        }
        if (avgpurprcIdx != -1) {
            if (parseFloat(avgpurprc) == 0 || avgpurprc == null || avgpurprc == '') {
                avgpurprc = "-";
            }else{
            	avgpurprc = panel.formatDecimal(avgpurprc, decimalCtrl.prtf.avgbuyprice)
            }
            N2NUtil.updateCell(panel, rowNumber, avgpurprcIdx, avgpurprc);
        }
        if (dayhighIdx != -1) {
            if (parseFloat(dayhigh) == 0 || dayhigh == null || dayhigh == '') {
                dayhigh = "-";
            }
            N2NUtil.updateCell(panel, rowNumber, dayhighIdx, dayhigh);
        }
        if (daylowIdx != -1) {
            if (parseFloat(daylow) == 0 || daylow == null || daylow == '') {
                daylow = "-";
            }
            N2NUtil.updateCell(panel, rowNumber, daylowIdx, daylow);
        }
    },
    /**
     * Description <br/>
     * 
     * 		create menu design for mouse right click
     * 
     */
    createContextMenu: function() {
        var panel = this;
        /*
         * showV1GUI == true
         * 
         * Buy
         * Sell
         * Market Depth
         * Stock Info
         * Intraday Chart
         * Stock News
         * 
         * showV1GUI == false
         * 
         * Buy
         * Sell
         * Market Depth
         * Stock Info
         * Tracker
         * Intraday Chart
         * Analysis Chart
         * Stock News
         * Fundamental (Capital IQ)
         * Fundamental (Thomson Reuters)
         * Add Stock Alert
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
                id: panel.cMenuStkTrackerId,
                text: languageFormat.getLanguage(33730, 'Fund Info/Tracker'),
                hidden: showV1GUI == "TRUE" ? true : (showStkInfoHeader == "TRUE" ? (showStkInfoTracker == "TRUE" ? false : true) : true)
            },{
                id: panel.cMenuAnalysisId,
                text: languageFormat.getLanguage(20102, 'Analysis Chart'),
                hidden: showV1GUI == "TRUE" ? true : (showChartHeader == "TRUE" ? (showChartAnalysisChart == "TRUE" ? false : true) : true)
            }
        ];


        panel.contextMenu = new Ext.menu.Menu({
            stkCode: '',
            autoWidth: true,
            items: newMenu,
            listeners: addDDMenu()
        });

    },
    /**
     * Description <br/>
     * 
     * 		set mouse right click menu listeners
     * 		
     * @param funcs : Function
     */
    onContextMenuClick: function(funcs) {
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
                        case panel.cMenuAnalysisId:
                            btn = panel.contextMenu.getComponent(panel.cMenuAnalysisId);
                            btn.setHandler(func.func);
                            break;
                        case panel.cMenuStkTrackerId:
                            btn = panel.contextMenu.getComponent(panel.cMenuStkTrackerId);
                            btn.setHandler(func.func);
                            break;
                    }
                }
            }
        }
    },
    /**
     * Description <br/>
     * 
     *		right click on grid panel row function 
     * 
     * @param grid 	: Ext.grid.GridPanel
     * @param ridx 	: integer
     * @param e 		: event 
     */
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

        panel.cMenuStkCode = stkCode;
        panel.cMenuStkName = stkName;

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

        panel.disableRightFunction(panel.cMenuStkCode);
        panel.contextMenu.showAt(e.getXY());
    },
    /**
     * Description <br/>
     * 
     * 		block right click menu item 
     * 
     * @param stk : string
     */
    disableRightFunction: function(stk) {
        var panel = this;

        var intradayChartBtn = panel.contextMenu.getComponent(panel.cMenuChartId);
        var ibBtn = panel.contextMenu.getComponent(panel.cMenuIBId);
        var stkEx = formatutils.getExchangeFromStockCode(stk);
        
        checkContextMenuItems(intradayChartBtn, ibBtn, stkEx);
    },
    /**
     * Description <br/>
     * 
     * 		return grid panel on show column id
     * 
     * @param type : string
     * 
     * @return array / string
     */
    getFieldList: function(type) {
        var panel = this;

        var returnArray = new Array();
        var columns = helper.getGridColumns(panel);

        returnArray.push(fieldLacp);

        for (var i = 0; i < columns.length; i++) {
            switch (columns[i].itemId) {
                case cmap_fpFundName:
                    if (columns[i].isHidden()) {
                        returnArray.push(fieldStkName);
                    }
                    break;
                    
                    
//                case cmap_pfVol:
//                    if (columns[i].isHidden()) {
//                        returnArray.push(fieldVol);
//                    }
//                    break;
//                case cmap_pfDayHigh:
//                    if (columns[i].isHidden()) {
//                        returnArray.push(fieldHigh);
//                    }
//                    break;
//                case cmap_pfDayLow:
//                    if (columns[i].isHidden()) {
//                        returnArray.push(fieldLow);
//                    }
//                    break;
            }
        }

        if (type == "param") {
            return returnArray.join("~");
        } else {
            return returnArray;
        }
    },
    /**
     * Description <br/>
     * 
     * 		get stock code exchange code
     * 
     * @param stockcode : string
     */
    getExchangeType: function(stockcode) {	// from stockcode to get Stock Exchange
        if (stockcode != undefined && stockcode != null) {
            var tmpV = stockcode.split(".");
            var tmpType = tmpV[tmpV.length - 1];
            return tmpType;
        } else {
            return '';
        }
    },
    startRefreshTimer: function() {
        var panel = this;
        if (this.refreshTimer != null) {
            this.stopRefreshTimer();
        }
        this.refreshTimer = setInterval(function() {
            if (n2nLayoutManager.isActivation(panel)) {
                panel.search(true);
            }
        }, 10000, 2000);
    },
    stopRefreshTimer: function() {
        var panel = this;
        if (this.refreshTimer != null) {
            clearInterval(panel.refreshTimer);
        }
    },
    onCellClick: function(func) {
        this.on('cellclick', func);
    },
    onRowDblClick: function(func) {
        this.on("rowdblclick", func);
    },
    /**
     * Description <br/>
     * 
     *  		update account balance label value
     *  
     *  @param value : string
     */
    setAccBal: function(value) {
        var panel = this;

        if (value != null && !isNaN(value)) {
            var obj = panel.tLabelValBalance;
            if (obj != null) {
                helper.setHtml(obj, panel.currentCurrency + ' ' + panel.formatCurrency(value));
            }
        }
    },
    /**
     * Description <br/>
     * 
     *  		update net cash label value
     *  
     *  @param value : string
     */
    setNetCashLimit: function(value) {
        var panel = this;

        if (value != null && !isNaN(value)) {
            var obj = panel.tLabelValNetCash;
            if (obj != null) {
                helper.setHtml(obj, panel.currentCurrency + ' ' + panel.formatCurrency(value));
            }
        }
    },
    formatCurrency: function(value) {
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

        var records = panel.getSelectionModel().getSelection();

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
            console.log('[MfFundPrtf][openDetailPanel] Exception ---> ' + e);
        }
        panel.jsonString = newJson;

        n2ncomponents.createEquityPrtfDetail({
            key: portFolioNo,
            name: stockName,
            dataObj: newJson
        });

    },
    getViewExchangeList: function() { //1.3.25.36 get all view exchange
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
     * 	create add form
     * 	
     */
    addForm: function() {
        var panel = this;

        /*
         * create new exchange code list from main.js 
         * 
         * indexCodes : from main.js
         */
        var newExchangeCodeList = new Array();
        var pfEntryExchange = global_sPFEntryExchange.split(',');

        if (global_sPFEntryExchange.length > 0 && panel.displayCategory == 'auto') {
            for (var i = 0; i < indexCodes.length; i++) {
                var data = indexCodes[i];

                for (var j = 0; j < pfEntryExchange.length; j++) {
                    var tempEx = formatutils.removeDelayExchangeChar(data.ex);
                    if (tempEx == pfEntryExchange[j]) {
                        newExchangeCodeList.push([data.ex, data.name]);
                        break;
                    }
                }
            }
        } else {
            for (var i = 0; i < indexCodes.length; i++) {
                var data = indexCodes[i];

                if (data.ex != 'MY') {
                    newExchangeCodeList.push([data.ex, data.name]);
                }
            }
        }

        /*
         * create account list 
         */
        var newAccountList = new Array();
        var accInfoList = accRet.ai;
        panel.setAccountNoList(newAccountList, accInfoList);

        var newPaymentList = new Array();
        panel.setSettModeList(newPaymentList, exchangecode);
        
        // fix the bug that in "Manual Portfolio Entry" box, the combo box of Sett. Mode is always displaying "Cash", regardless of language selected
        var cashPaymentList = [];
        cashPaymentList.push('Cash','Cash');
        for (var i = 0; i < newPaymentList.length; i++){
        	if (jsutil.arrayEqual(newPaymentList[i],cashPaymentList) & global_Language != 'en'){
        		var updatedPayment = [];
        		var currentCashString = languageFormat.getLanguage(20064, 'Cash');
        		updatedPayment.push('Cash', currentCashString);
        		newPaymentList[i] = updatedPayment;
        	}
        }

        /*
         * set stock name format
         */
        var stockNameFormat = function(val, rec) {
            var newString = "";
            var temp = val.split(".");

            if (val.indexOf(".") != -1) {
                if (temp.length == 2) {
                    newString = temp[0];
                } else {
                    for (var i = 1; i < temp.length; i++) {
                        if (newString == "") {
                            newString = temp[i - 1];
                        } else {
                            newString = newString + "." + temp[i - 1];
                        }
                    }
                }
            } else {
                newString = val;
            }

            return newString;
        };

        // handler for some numeric fields' blur event
        var calculateTotal = function() {
            var qtyField = Ext.getCmp("eqpf_mQuantity_txtField");
            var priceField = Ext.getCmp("eqpf_mPrice_txtField");
            var transField = Ext.getCmp("eqpf_transFee_txtField");
            var displayField = Ext.getCmp("eqpf_totalValue_txtField");
            var actionField = Ext.getCmp("eqpf_action_txtField");
            if (qtyField != null && priceField != null && transField != null && displayField != null) {
                displayField.setValue(calculationOfPortFolioDetail(qtyField.getValue(), priceField.getValue(), transField.getValue(), actionField.getValue()));
            }
        };
        
        var addprtfaccStore;
        if(isDealerRemisier){
        	var urlbuf = new Array();

        	urlbuf.push(addPath + 'tcplus/atp/searchAcc?');
        	urlbuf.push('ExtComp=AddEquityPrtf');
        	urlbuf.push('&s=');
        	urlbuf.push(new Date().getTime());

        	var url = urlbuf.join('');

        	addprtfaccStore = Ext.create('Ext.data.Store', {
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
        				if(records){
        					newAccountList = new Array();
        					
        					thisStore.filter(function(rec){
        						var ex = rec.get('ex');
        						var cliType = rec.get('cliType');
        						
        						if(ex != 'MY' && cliType != 'D'){
        							var accRec = [rec.get('ac') + global_AccountSeparator + rec.get('bc'), rec.get('ac') + ' - ' + rec.get('an') + ' - ' + rec.get('bc')];
        							newAccountList.push(accRec);
        						}
        						
        						return ex != 'MY' && cliType != 'D';
        					});
        				}
        			}
        		}
        	});
        }else{
        	addprtfaccStore = new Ext.data.ArrayStore({
                fields: ['accno', 'name'],
                data: newAccountList
        	});
        }

        var newPanel = new Ext.form.Panel({
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            baseCls: "",
            bodyStyle: 'padding:5px',
            autoScroll: true,
            items: [
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        pack: 'start'
                    },
                    height: 28,
                    items: [
                        new Ext.form.field.ComboBox({
                            id: "eqpf_accNo_txtField",
                            fieldLabel: languageFormat.getLanguage(20833, 'Account No.'),
		                    emptyText: isDealerRemisier ? languageFormat.getLanguage(20876, 'Search account here.. min ' + N2N_CONFIG.constDRMinChars + ' chars', N2N_CONFIG.constDRMinChars) : languageFormat.getLanguage(20900, 'Please select account...'),
                            labelStyle: 'width:120px;',
                            flex: 1,
                            store: addprtfaccStore,
                            listConfig: {
                                minWidth: 270,
                                loadingText: languageFormat.getLanguage(10018, 'Loading'),
                                maxHeight: 140
                            },
                            //typeAhead: true,
                            triggerAction: 'all',
                            queryMode: !isDealerRemisier ? 'local' : 'remote',
                            valueField: 'accno',
                            displayField: 'name',
                            editable: true,
                            forceSelection: !isDealerRemisier,
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
		                    	afterrender: function(combo){
		                    		if(isDealerRemisier){
		                    			combo.getStore().on('load', function(thisStore, records) {
		                    				if (records) {
		                    					if(records.length == 1){
		                    						combo.select(records);
		                    						combo.collapse();
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
		                    	specialkey: function(thisCb, e) {
		                        	if (e.getKey() == e.ENTER) {
		                        		panel.runSearchAccount('addpf');
		                        	}
		                        } 
                            }
                        }),
                        new Ext.form.field.Text({
                            id: "eqpf_searchAcc_txtField",
                            fieldLabel: languageFormat.getLanguage(20833, 'Account No.'),
                            labelStyle: 'width:120px;',
                            flex: 1,
                            hidden: true,
                            emptyText: languageFormat.getLanguage(10044, 'Search Account...'),
                            selectOnFocus: true,
                            editable: true,
                            forceSelection: !isDealerRemisier,
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
                                            panel.searchAccount(field.getValue(), 'addpf');
                                        }
                                    } else {
                                        field = "";
                                    }
                                }
                            }
                        }),
                        new Ext.button.Button({
                            id: 'eqpf_searchAcc_btn',
                            iconCls: "icon-center icon-search-account",
                            iconAlign: 'top',
                            padding: 0,
                            width: 20,
                            hidden: !isDealerRemisier,
                            style: 'background: transparent;',
                            handler: function () {
                            	panel.runSearchAccount('addpf');
                            }
                        })
                    ]
                },
                new Ext.form.field.ComboBox({
                    id: "eqpf_exchg_txtField",
                    fieldLabel: languageFormat.getLanguage(20301, 'Exchange'),
                    labelStyle: 'width:120px;',
                    store: new Ext.data.ArrayStore({
                        fields: ['value', 'displayText'],
                        data: newExchangeCodeList
                    }),
                    //typeAhead: true,
                    triggerAction: 'all',
                    queryMode: 'local',
                    valueField: 'value',
                    displayField: 'displayText',
                    editable: false,
                    matchFieldWidth: false,
                    listConfig: {
                    listeners: {
                            beforerender: function(picker) {
                                picker.minWidth = picker.up('combobox').getWidth() - 120;
                            }
                        }
                    },
                    listeners: {
                        expand: function (thisCombo) {
                            Ext.getCmp("eqpf_stkName_txtField").setValue("");
                            Ext.getCmp("eqpf_stkName_txtField").getStore().removeAll();
                        },
                        select: function(thisCb, records) {
                            if (records.length > 0) {
                                Ext.getCmp('eqpf_stkName_txtField').exch = records[0].get('value');
                            }
                        }
                    }
                }),
                /*
                 new Ext.form.field.Date({
                 id: "eqpf_orderDate_txtField",
                 fieldLabel: languageFormat.getLanguage(20206, 'Order Date'),
                 labelStyle: 'width:120px;',
                 width: 160,
                 format: 'd/m/y',
                 editable: false,
                 hidden: true,
                 maxValue: topPanelBar.getDateTime()
                 }),*/
                new Ext.form.field.ComboBox({
                    id: "eqpf_action_txtField",
                    fieldLabel: languageFormat.getLanguage(21202, 'Action (Buy/Sell)'),
                    labelStyle: 'width:120px;',
                    store: new Ext.data.ArrayStore({
                        fields: ['value', 'displayText'],
                        data: [[1, languageFormat.getLanguage(10001, 'Buy')], [2, languageFormat.getLanguage(10002, 'Sell')]]
                    }),
                    //typeAhead: true,
                    triggerAction: 'all',
                    queryMode: 'local',
                    valueField: 'value',
                    displayField: 'displayText',
                    editable: false,
                    listeners: {
                        change: calculateTotal
                    }
                }),
                {
                    xtype: 'searchautobox',
                    id: "eqpf_stkName_txtField",
                    fieldLabel: languageFormat.getLanguage(21203, 'Stock Name (Code)'),
                    labelStyle: 'width:120px; white-space:nowrap;',
                    listConfig: {
                        minWidth: 150,
                        loadingText: languageFormat.getLanguage(10018, 'Loading'),
                        overflowX: "hidden",
                        maxHeight: 140
                    },
                    forceSelection: true
                },
                {
                    xtype: 'numericfield',
                    id: "eqpf_mQuantity_txtField",
                    fieldLabel: languageFormat.getLanguage(21204, 'Matched Quantity'),
                    labelStyle: 'width:120px;',
                    enableKeyEvents: true,
                    useThousandSeparator: true,
                    thousandSeparator: ',',
                    decimalPrecision: 3,
                    allowNegative: false,
                    listeners: {
                        keyup: calculateTotal
                    }
                },
                {
                    xtype: 'numericfield',
                    id: "eqpf_mPrice_txtField",
                    fieldLabel: languageFormat.getLanguage(21205, 'Match Price'),
                    labelStyle: 'width:120px;',
                    enableKeyEvents: true,
                    useThousandSeparator: true,
                    thousandSeparator: ',',
                    decimalPrecision: decimalCtrl.prtf.matchprice || 3,
                    listeners: {
                        keyup: calculateTotal
                    }
                }, {
                    xtype: "combo",
                    id: "eqpf_payment_txtField",
                    fieldLabel: languageFormat.getLanguage(21208, 'Sett. Mode'),
                    labelStyle: 'width:120px;',
                    store: new Ext.data.ArrayStore({
                        fields: ['value', 'displayText'],
                        data: newPaymentList
                    }),
                    //typeAhead: true,
                    triggerAction: 'all',
                    mode: 'local',
                    valueField: 'value',
                    displayField: 'displayText',
                    editable: false,
                    hidden: newPaymentList.length > 0 ? false : true
                },
                {
                    xtype: 'numericfield',
                    id: "eqpf_transFee_txtField",
                    fieldLabel: languageFormat.getLanguage(21206, 'Trans. Fee'),
                    labelStyle: 'width:120px;',
                    enableKeyEvents: true,
                    useThousandSeparator: true,
                    thousandSeparator: ',',
                    decimalPrecision: 3,
                    listeners: {
                        keyup: calculateTotal
                    }
                },
                {
                    xtype: 'numericfield',
                    id: "eqpf_totalValue_txtField",
                    fieldLabel: languageFormat.getLanguage(21207, 'Total Contract Value'),
                    labelStyle: 'width:120px; white-space:nowrap;',
                    enableKeyEvents: true,
                    useThousandSeparator: true,
                    thousandSeparator: ',',
                    decimalPrecision: 3,
                    readOnly: true
                }
            ],
            buttons: [
                new Ext.button.Button({
                    text: languageFormat.getLanguage(20849, 'Submit'),
                    cls: 'fix_btn',
                    handler: function() {
                        panel.addFormSubmit();
                    }
                })
            ]

        });

        panel.openNewWindow(newPanel, languageFormat.getLanguage(21201, 'Manual Portfolio Entry'));
    },
    setAccountNoList: function(newAccountList, accInfoList) {
        if (accInfoList != null) {
            var accInfo = accInfoList;
            var total = accInfo.length;
            var pfEntryAccType = global_sPFEntryAccType.split(',');
            if (global_sPFEntryAccType.length > 0 && panel.displayCategory == 'auto') {
                for (var i = 0; i < total; i++) {
                    var acc = accInfo[i];
                    if (acc.ex != 'MY' && acc.cliType != 'D') {
                        for (var j = 0; j < pfEntryAccType.length; j++) {
                            if (acc.cliType == pfEntryAccType[j]) {
                                newAccountList.push([acc.ac + global_AccountSeparator + acc.bc, acc.ac + ' - ' + acc.an + ' - ' + acc.bc]); // #account list separator ('-')
                            }
                        }
                    }
                }
            } else {
                for (var i = 0; i < total; i++) {
                    var acc = accInfo[i];
                    if (acc.ex != 'MY' && acc.cliType != 'D') {
//  					newAccountList.push( [acc.ac + '-' +  acc.bc, acc.ac + ' - ' + acc.an + ' - ' + acc.bc] );
                        newAccountList.push([acc.ac + global_AccountSeparator + acc.bc, acc.ac + ' - ' + acc.an + ' - ' + acc.bc]); // #account list separator ('-')
                    }
                }
            }

            var accListCombo = Ext.getCmp("eqpf_accNo_txtField");
            if (accListCombo != null) {
                accListCombo.setValue("");
                accListCombo.getStore().loadData(newAccountList);
            }
        }
    },
    
    setSettModeList: function(newPaymentList, exchg) {
        var atpPaymentList = "";
        var panel = this;
        var defPay = defPayment;
        if (defPay != null && defPay != "") {
            for (var i = 0; i < defPay.length; i++) {
                if (defPay[i].toUpperCase() != 'CUT') {
                    newPaymentList.push([defPay[ i ], defPay[ i ]]);
                }
            }
        }
        if (atpRule.s == true) {
            for (var i = 0; i < atpRule.size; i++) {
                if (atpRule.d != null && atpRule.d[i].ex == exchg) {
                    atpPaymentList = atpRule.d[i].payment;
                    break;
                }
            }
        }
        if (atpPaymentList && atpPaymentList.length > 0) {
            for (var i = 0; i < atpPaymentList.length; i++) {
                var p = atpPaymentList[i];
                if (p && p.act) {
                    var payAct = p.type;
                    if (p.act.length > 0) {
                        for (var j = 0; j < p.act.length; j++) {
                            if (!panel.checkArrayDuplicate(newPaymentList, payAct)) {
                                if (payAct.toUpperCase() != 'CUT') {
                                    newPaymentList.push([payAct, payAct]);
                                }
                            }
                        }
                    } else {
                        if (!panel.checkArrayDuplicate(newPaymentList, payAct)) {
                            if (payAct.toUpperCase() != 'CUT') {
                                newPaymentList.push([payAct, payAct]);
                            }
                        }
                    }
                }
            }
        }
        var paymentCombo = Ext.getCmp("eqpf_payment_txtField");
        if (paymentCombo != null) {
            paymentCombo.setValue("");
            if (newPaymentList.length > 0) {
                paymentCombo.setVisible(true);
                paymentCombo.getStore().loadData(newPaymentList);
            } else {
                paymentCombo.setVisible(false);
            }
        }
    },
    checkArrayDuplicate: function(arr, value) {
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
    /**
     * Description <br/>
     * 
     * 	submit add form record
     * 	
     */
    addFormSubmit: function() {
        var panel = this;

        if (panel.newWindow == null) {
            return;
        }

        var accNo = Ext.getCmp("eqpf_accNo_txtField").getValue();
        var exchg = Ext.getCmp("eqpf_exchg_txtField").getValue();
        //var orderDate = Ext.getCmp("eqpf_orderDate_txtField").getRawValue();
        var action = Ext.getCmp("eqpf_action_txtField").getValue();
        var stkName = Ext.getCmp("eqpf_stkName_txtField").getValue();
        var mQuantity = Ext.getCmp("eqpf_mQuantity_txtField").getValue();
        var mPrice = Ext.getCmp("eqpf_mPrice_txtField").getValue();
        var transFee = Ext.getCmp("eqpf_transFee_txtField").getValue();
        var totalValue = Ext.getCmp("eqpf_totalValue_txtField").getValue();
        var payment = '';
        console.log(accNo, exchg, action, stkName, mQuantity, mPrice, transFee, totalValue);

        if (Ext.getCmp("eqpf_payment_txtField").isVisible()) {
            payment = Ext.getCmp("eqpf_payment_txtField").getValue();
            if (jsutil.isEmpty(accNo) || jsutil.isEmpty(exchg) || jsutil.isEmpty(action) || jsutil.isEmpty(stkName) || jsutil.isEmpty(mQuantity) || jsutil.isEmpty(mPrice) || jsutil.isEmpty(transFee) || jsutil.isEmpty(totalValue) || jsutil.isEmpty(payment)) {
                msgutil.alert(languageFormat.getLanguage(31002, 'Please kindly enter all the data before submit.'));
                return;
            }
        } else {
            if (jsutil.isEmpty(accNo) || jsutil.isEmpty(exchg) || jsutil.isEmpty(action) || jsutil.isEmpty(stkName) || jsutil.isEmpty(mQuantity) || jsutil.isEmpty(mPrice) || jsutil.isEmpty(transFee) || jsutil.isEmpty(totalValue)) {
                msgutil.alert(languageFormat.getLanguage(31002, 'Please kindly enter all the data before submit.'));
                return;
            }
        }
        if (stkName.lastIndexOf('.') != -1) {
            stkName = formatutils.removeDelayExchangeChar(stkName);
        }

        exchg = formatutils.removeDelayExchangeChar(exchg);
        var accountNo = (accNo).split(global_AccountSeparator); // #account list separator ('-')

        if (stkName.lastIndexOf('.') != -1) {
            stkName = formatutils.removeDelayExchangeChar(stkName);
        }

        exchg = formatutils.removeDelayExchangeChar(exchg);
        var accountNo = (accNo).split(global_AccountSeparator); // #account list separator ('-')

        var tempUrl = new Array();
        tempUrl.push(addPath + 'tcplus/portFolioDetailAdd?');
        tempUrl.push("an=");
        tempUrl.push(accountNo[0].trim());
        tempUrl.push("&bc=");
        tempUrl.push(accountNo[accountNo.length - 1 ].trim());
        tempUrl.push("&ex=");
        tempUrl.push(exchg);
//        tempUrl.push("&od=");
//        tempUrl.push(orderDate);
        tempUrl.push("&ac=");
        tempUrl.push(action);
        tempUrl.push("&sn=");
        tempUrl.push(stkName);
        tempUrl.push("&mq=");
        tempUrl.push(mQuantity);
        tempUrl.push("&mp=");
        tempUrl.push(mPrice);
        tempUrl.push("&tf=");
        tempUrl.push(transFee);
        tempUrl.push("&tv=");
        tempUrl.push(totalValue);
        tempUrl.push("&category=");
        tempUrl.push(panel.displayCategory);
        if (payment.length > 0) {
            tempUrl.push("&sm=");
            tempUrl.push(payment);
        }

        var url = tempUrl.join('');
        Ext.Ajax.request({
            url: url,
            method: 'POST',
            success: function(response) {

                try {
                    /*
                     * convert text to json
                     */
                    var obj = Ext.decode(response.responseText);

                    if (obj != null) {
                        var displayMessage = '';

                        if (obj.errorMsg == null) {
                            displayMessage = languageFormat.getLanguage(31003, 'The record has been added to your portfolio.'); //obj.msg;
                        } else {
                            displayMessage = languageFormat.getLanguage(31006, 'The record was not added to your portfolio. Kindly try again.'); //obj.errorMsg;
                        }

                        msgutil.info(displayMessage, function (btn, text) {
                            if (obj.s) {
                                panel.store.removeAll();
                                panel.search();
                            }
                        });

                        if (obj.errorMsg != null) {
                            console.log('[MfFundPrtf][addFormSubmit][inner] result : error ---> ' + obj.errorMsg);
                        }
                    }

                } catch (e) {
                    console.log('[MfFundPrtf][addFormSubmit][inner] Exception ---> ' + e);
                }
            },
            failure: function(response) {
                debug(response.status);
            }
        });

        panel.newWindow.destroy();

    },
    /**
     * Description <br/>
     * 
     * 	create new window to display form 
     * 	
     */
    openNewWindow: function(object, title) {
        var panel = this;

        panel.newWindow = msgutil.popup({
            title: title,
            width: 300,
            maxHeight: 325,
            layout: 'fit',
            items: object,
            resizable: false,
            listeners: {
                destroy: function() {
                    panel.newWindow = null;
                }
            }
        }).show();
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
        return global_FPAllColumn;
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
        return global_FPDefaultColumn;
    },
    /**
     * Description <br/>
     * 
     * 		return current column setting id
     * 
     * @return string
     */
    currentColumnSetting: function() {
        var currentColumnId = layoutProfileManager.getCol('fpf'); // verify from main.jsp

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
    /**
     * Description <br/>
     * 
     * 		open new window for display column setting 
     */
    openColumnSetting: function() {
        colutils.displayWindow(this);
    },
    /**
     * Description <br/>
     * 
     * 		save column setting
     * 
     * @param newColumnId : string
     */
    saveColumn: function(newColumnId) {
        var panel = this;

        panel.reconfigure(null, panel.generateColumnsArray(panel.generateColumn(newColumnId)));
        panel.requestSaveColumns(newColumnId);
    },
    requestSaveColumns: function(newColumnId) {
        var panel = this;

        Storage.generateSubscriptionByList(panel.stkcodes, panel);
        newColumnId = newColumnId + "~" + colutils.ColumnVersion;
        colutils.saveColumn('fpf', newColumnId);

    },
    /** 
     * Description <br/>
     * 
     * 
     * 		return number format
     * 
     * 
     * @param {string/integer} 	value
     * value to convert format
     * 
     * @param {integer}			columnWidth
     */
    returnNumberFormat: function(value, columnWidth) {
        if (viewInLotMode) {
            value = formatutils.formatNumberLot(value);

        } else {
            value = formatutils.formatNumber(value, columnWidth);

        }

        return value;
    },
    // assign different ids for 'My Portfolio' context menu and 'Manual Portfolio' context menu
    _procComponentId: function(value) {
        var panel = this;

        panel.cMenuBuyId = value + "_" + panel.cMenuBuyId;
        panel.cMenuSellId = value + "_" + panel.cMenuSellId;
        panel.cMenuStkInfoId = value + "_" + panel.cMenuStkInfoId;
        panel.cMenuDepthId = value + "_" + panel.cMenuDepthId;
        panel.cMenuChartId = value + "_" + panel.cMenuChartId;
        panel.cMenuStkNewsId = value + "_" + panel.cMenuStkNewsId;
        panel.cMenuArchiveNewsId = value + "_" + panel.cMenuArchiveNewsId;
        panel.cMenuElasticNewsId = value + "_" + panel.cMenuElasticNewsId;
        panel.cMenuNikkeiNewsId = value + "_" + panel.cMenuNikkeiNewsId;
        panel.cMenuNews2Id = value + "_" + panel.cMenuNews2Id;
        panel.cMenuStkTrackerId = value + "_" + panel.cMenuStkTrackerId;
        panel.cMenuEqTrackerId = value + "_" + panel.cMenuEqTrackerId;
        panel.cMenuHisDataId = value + "_" + panel.cMenuHisDataId;
        panel.cMenuBrokerQId = value + "_" + panel.cMenuBrokerQId;
        panel.cMenuAnalysisId = value + "_" + panel.cMenuAnalysisId;
        panel.cMenuFundamentalCPIQId = value + "_" + panel.cMenuFundamentalCPIQId;
        panel.cMenuFundamentalThomsonReutersId = value + "_" + panel.cMenuFundamentalThomsonReutersId;
        panel.cMenuAddStockAlertId = value + "_" + panel.cMenuAddStockAlertId;
        panel.cMenuOrderStatus = value + "_" + panel.cMenuOrderStatus;
        panel.cMenuWarrantsInfoId = value + "_" + panel.cMenuWarrantsInfoId;
        panel.cMenuStockAlertId = value + "_" + panel.cMenuStockAlertId;
        panel.cMenuPSEEdgeId = value + "_" + panel.cMenuPSEEdgeId;
        panel.cMenuIBId = value + "_" + panel.cMenuIBId;
    },
    _setCookieId: function() {
        var me = this;
        me.cookieKey = columnWidthSaveManager.getCookieColKey('fundPrtf');
        me.paramKey = N2N_CONFIG.constKey + 'FP';
        me.colWidthKey = 'fp';
    },
    searchAccount: function(searchValue, cmp) {
        var panel = this;
        try {

            searchValue = searchValue.toLowerCase();

            if (cmp != 'addpf') {
                //panel.setLoading(true);
                panel.tComboBoxAccount.doQuery(searchValue, true);
            } else {
                //panel.newWindow.setLoading(true);
            	var addFormSearchAccCmp = Ext.getCmp("eqpf_accNo_txtField");
            	addFormSearchAccCmp.doQuery(searchValue, true);
            }
            /*
            var urlbuf = new Array();

            urlbuf.push(addPath + 'tcplus/atp/searchAcc?');
            urlbuf.push('ExtComp=EquityPrtf');
            urlbuf.push('&s=');
            urlbuf.push(new Date().getTime());

            urlbuf.push('&searchValue=' + searchValue);

            var url = urlbuf.join('');

            Ext.Ajax.request({
                url: url,
                method: 'POST',
                success: function(response) {
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

                        if (cmp != 'addpf') {
                            panel.accList = [];
                            //panel.accList.push(allRec);
                            for (var i = 0; i < totAcc; i++) {
                                var acc = accInfo[i];
                                var accRec = [acc.ac + global_AccountSeparator + acc.bc, acc.ac + ' - ' + acc.an + ' - ' + acc.bc];
                                panel.accList.push(accRec);
                            }

                            panel.tComboBoxAccount.store.removeAll();
                            panel.tComboBoxAccount.store.loadData(panel.accList);
                            panel.tComboBoxAccount.setValue('');
                            panel.tbSearchAccount.setValue('');
                            panel.tbSearchAccount.setHidden(true);
                            panel.tComboBoxAccount.setVisible(true);
                            panel.setLoading(false);
                        } else {
                            var tempList = [];
                            var addFormAccCmp = Ext.getCmp("eqpf_accNo_txtField");
                            var addFormSearchAccCmp = Ext.getCmp("eqpf_searchAcc_txtField");
                            //panel.accList.push(allRec);
                            for (var i = 0; i < totAcc; i++) {
                                var acc = accInfo[i];
                                var accRec = [acc.ac + global_AccountSeparator + acc.bc, acc.ac + ' - ' + acc.an + ' - ' + acc.bc];
                                tempList.push(accRec);
                            }

                            addFormAccCmp.store.removeAll();
                            addFormAccCmp.store.loadData(tempList);
                            addFormAccCmp.setValue('');
                            addFormSearchAccCmp.setValue('');
                            addFormSearchAccCmp.setHidden(true);
                            addFormAccCmp.setVisible(true);
                            panel.newWindow.setLoading(false);
                        }
                    }
                },
                failure: function(response) {
                    console.log('[Search Account] failed ---> ' + response.responseText);
                    panel.setLoading(false);
                    panel.newWindow.setLoading(false);
                }
            });
            */
        } catch (e) {
            console.log('[Search Account] Exception ---> ' + e);
            panel.setLoading(false);
            panel.newWindow.setLoading(false);
        }
    },
    autoAdjustWidth: function() {
        var panel = this;

        panel.procColumnWidth();
        panel.reconfigure(null, panel.generateColumnsArray(panel.generateColumn("")));
        panel.tempWidth = cookies.toDefaultColumn(panel, panel.pckId);
        panel.isImgBlink = false;
        panel.runAutoAdjustWidth = false;
    },
    updateColWidthCache: function(column, newWidth) {
        helper.updateColWidthCache(this, this.cookieKey, column, newWidth);
    },
    runSearchAccount: function(cmp) {
    	var panel = this;
    	if(cmp != 'addpf' ){
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
    	}else{
    		var addFormSearchAccCmp = Ext.getCmp("eqpf_accNo_txtField");
            
            if (addFormSearchAccCmp.getRawValue().trim() == '') {
            	addFormSearchAccCmp.setValue('');
                msgutil.alert(languageFormat.getLanguage(10045, 'Please key in your search text.'), function () {
                	addFormSearchAccCmp.focus();
                });
            } else if(addFormSearchAccCmp.getRawValue().trim().length < N2N_CONFIG.constDRMinChars){
            	msgutil.alert(languageFormat.getLanguage(10051, 'The minimum value for this field is [PARAM0]', N2N_CONFIG.constDRMinChars));
            } else {
                panel.searchAccount(addFormSearchAccCmp.getValue(), 'addpf');
            }
    	}
    },
    focusSearchBox: function() {
        focusManager.focusSearchbox(this.tComboBoxAccount);
    },
    getAccountBranch: function() {
        var me = this;
        var acc = me.tComboBoxAccount.getValue();
        if (acc) {
            var accbranch = acc.split(global_AccountSeparator)[0].trim() + global_AccountSeparator + acc.split(global_AccountSeparator)[1].trim(); // #account list separator ('-')
            me.accbranchNo = accbranch;

            return accbranch;
        }

        return null;
    },
    getActionType: function(rec) {
        var qty = parseInt(rec.qsip) + parseInt(rec.qa);

        return qty < 0 ? modeOrdSell : modeOrdBuy;
    },
    runFitScreen: function() {
        var panel = this;

        if (!helper.inView(panel)) {
            helper.addBufferedRun(panel.getId() + 'prtfFitScreen', function() {
                helper.autoFitColumns(panel);
            });
        } else {
            helper.autoFitColumns(panel);
        }
    }
});
