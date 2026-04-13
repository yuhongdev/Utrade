/* 
 * 
 * callAccBal
 * 
 * search
 * 
 * updateAccBal
 * setAccBal
 * setNetCashLimit
 * appendExchangelist
 * updateSummary
 * updateFeedRecord
 * getOrderData
 * updateOrdSts
 * setOrdStsLastUptTime
 * calculateTotOrdValue
 * 
 * setTotOrdVal
 * formatNumber
 * formatNumberLot
 * formatCurrency
 * formatDecimal
 * updateColumnMap
 * showContextMenu
 * isRowCanChecked
 * processValidSelection
 * showCancelPanel
 * showCancelComp
 * canTrade
 * 
 * processCancel
 * 
 * processAjaxCacncel
 * 
 * uncheckHeader
 * setPinInfo
 * selectRecord
 * 
 * cleanUp
 * onCellClick
 * createContextMenu
 * onContextMenuClick
 * changeField
 * 
 * getFieldList
 * getStore
 * 
 * startRefreshTimer
 * stopRefreshTimer
 * updateOrdPadBal
 * updateOrdPadQty
 * updateOrdDetPanels
 * nextPage
 * previousPage
 * isValidColumnSetting
 * 
 * getExchangeType
 * disableRightFunction
 * showColumnSetting
 * allColumnSetting
 * defaultColumnSetting
 * currentColumnSetting
 * 
 * requiredColumnSetting
 * generateColumnName
 * 
 * saveColumn
 * generateColumnID
 * generateColumnsArray
 * storeReader
 * getRecordMapping
 * 
 * 
 */


Ext.define('TCPlus.view.orderbook.BasketOrder', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.basketorder',
    title: languageFormat.getLanguage(32013, 'Basket Order'),
    accNo: '',
    filterOpt: '0',
    stkcodes: null,
    sort: 'tktno',
    columnmap: null,
    orderno: null,
    orders: null,
    accList: null,
    basketList:  null,
    accs: null,
    cbAccount: null,
    cbBasket: null,
    cbfilterOpt: null,
    cbfilterPaymentCode: null,
    cbExchange: null,
    tbSearchAccount: null,
    searchAccountBtn: null,
    filterExtOpt: '0',
    feedExchangeList: null,
    convertCurrencyEnable: false,
    currentCurrency: defCurrency,
    currencyRateList: null,
    btnDetails: null,
    btnRefresh: null,
    columnState: 0,
    tempDatas: null,
    refreshTimer: null,
    //emptyText: '-9905 - No Result Found',
    emptyText: languageFormat.getLanguage(32011, 'Basket is empty'),
    searching: false,
    accBalReqId: null,
    ordStsReqId: null,
    filterBasketOpt: 'default',
    arPaymentCodeList: null,
    branchCode: '',
    emptyResult: languageFormat.getLanguage(30408, 'You do not have any order.'),
    intervalTimeOut: null,
    //v1.3.33.27 Save column setting
    tooltip: null,
    columnHash: null,
    tempWidth: null,
    isImgBlink: false,
    recordMapping: null,
    slcomp: "bo",
    pinInfo: {
        savePin: false,
        lastPin: ''
    },
    ordStsLastUptTime: '',
    ordPriceDecimal: '',
    stopLimitDecimal: '',
    screenType: 'main',
    compRef: {},
    mappedCode: '03',
    mappedSymbol: '04',
    _idPrefix: 'basOrd',
    type: 'bo',
    savingComp: true,
    basketListRecords: [],
    minDate: null,
    maxDate: null,
    isFirstTime: true,
    initComponent: function () {
        var panel = this;

        panel.maxDate = new Date();
        panel.maxDate.setDate(panel.maxDate.getDate() + 30);
        
        panel.cellEditing = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1,
            listeners:{
            	beforeedit: function(editor, e){
            		var rec = e.record.data;
            		var atpOrderControlList = new Array();
            		var currentOrderType = '';
            		if (atpRule.s == true) {
                        var len = atpRule.size;
                        var ex = stockutil.getExchange(rec.StkCode);
                        for (var i = 0; i < len; i++) {
                            if (atpRule.d != null && atpRule.d[i].ex == ex) {
                                // same exchange
                                atpOrderControlList = atpRule.d[i].ordctrl;
                                break;
                            }
                        }
                    }
            		
            		
            		currentOrderType = rec.OrdType;
            		
            		 for (var i = 0; i < atpOrderControlList.length; i++) {
                         var ordCtrl = atpOrderControlList[i];
                         if (ordCtrl.type == currentOrderType) {
                             var ordCtrlEnable = atpOrderControlList[i].oce;

                             // grab enable value element
                             var blnPrice = false;
                             var blnQty = false;
                             var blnStopLimit = false;
                             var blnMinQty = false;
                             var blnDisQty = false;
                             var blnTPType = false;
                             var blnTPDirection = false;
                             var arDisclosedRuleList = new Array();
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
                                         if (columnRule != undefined && columnRule != null && columnRule != '') {
                                             arDisclosedRuleList.push(columnRule);	// 2011-01-06: ATP  currently having this features	
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
                             
                             if(e.field == 'OrdQty' && !blnQty){
                            	 return false;
                             }
                             if(e.field == 'OrdPrc' && !blnPrice){
                            	 return false;
                             }
                             if(e.field == 'MinQty' && !blnMinQty){
                            	 return false;
                             }
                             if(e.field == 'StopLimit' && !blnStopLimit){
                            	 return false;
                             }
                             if (e.field == 'DsQty' && !blnDisQty) {
                            	 return false;
                             }
                             if (e.field == 'DsQty' && blnDisQty) {
                            	 var currentValidity = rec.Validity;
                            	 var blnDisQtyPassRule = false;
                            	 if (arDisclosedRuleList && arDisclosedRuleList.length == 1) {	// currently only 1 row, future may not sure
                            		 var v = arDisclosedRuleList[0];
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
                            	 
                            	 if(e.field == 'DsQty' && !blnDisQtyPassRule){
                            		 return false;
                            	 }
                             }
                             //break;
                         }
                     }
            		
//            		var rec = e.record.data;
//            		if(e.field == 'OrdPrc'){
//            			if(rec.OrdType == 'Market' || rec.OrdType == 'Stop' || rec.OrdType == 'MarketToLimit'){
//            				return false;
//            			}
//            		}
				},
				validateedit: function(editor, e){
					var rec = e.record.data;
					if(e.field == 'NewName'){
						if(rec.name == e.value){
							e.cancel = true;
						}
					}
					
					if(!e.value){
						e.cancel = true;
					}
				},
            	edit: function(editor, e){
            		// commit the changes right after editing finished
            	    e.record.commit();
            	}
            }
        });
        panel._idPrefix = panel.getId();

        //panel.recordMapping = Ext.create("TCPlus.model.BasketOrder").fields.items;

        panel.procColumnWidth(); //v1.3.33.27

        var xtype = 'button';

        var btnRefreshConf = {
            text: languageFormat.getLanguage(10008, 'Refresh'),
            tooltip: languageFormat.getLanguage(10008, 'Refresh'),
            xtype: xtype,
            iconCls: 'icon-reset',
            hidden: true,
            handler: function () {
                panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
                panel.search(true);
                // preserves current selection when refresh
                // panel.getSelectionModel().select(0);
            }
        };

        this.btnRefresh = new Ext.Button(btnRefreshConf);

        this.selModel = Ext.create('Ext.selection.CheckboxModel', {
            checkOnly: false,
            mode: 'SIMPLE',
            preventFocus: true,
            listeners: {
                select: function (sm, rec, ridx) {
                    panel.selectRecord(rec);
                    panel.showCancelPanel(sm, ridx, rec);
                },
                deselect: function (sm, rec, ridx) {
                    panel.showCancelPanel(sm, ridx, rec);
                }
            },
            renderer: function (value, meta, record) {
                meta.css = N2NCSS.CellDefault + " lkming fix_chkbg";

                var r = record.data;
                
                return '<div class="x-grid-row-checker">&#160;</div>';
            },
            selectAll: function () {

                var ridx = 0;
                var store = panel.getStore();
                var sm = panel.getSelectionModel();
                var selections = store.getRange();
                
            	sm.select(selections, true, true);
            	panel.showCancelComp(true);
            }
        });
        
        var store = new Ext.data.Store({
        	model: "TCPlus.model.BasketOrder"
//            fields: panel.getRecordMapping()
        });
        
        panel.accList = [];
        if (accRet != null) {
            var accInfo = accRet.ai;
            var totAcc = accInfo.length;
            if (isDealerRemisier) {
                var allRec = ['', languageFormat.getLanguage(10029, 'Select account...')];
                panel.accList.push(allRec);
            } else {
                var allRec = ['', languageFormat.getLanguage(20195,'All Account')];
                panel.accList.push(allRec);
            }
            for (var i = 0; i < totAcc; i++) {
                var acc = accInfo[i];
                var accRec = [acc.ac + global_AccountSeparator + acc.bc, acc.ac + ' - ' + acc.an + ' - ' + acc.bc];
                panel.accList.push(accRec);
            }
        }
        
        var accStore;
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
    						panel.accs = [];

    						for(var i=0; i<records.length; i++){
    							var rec = records[i].data;

    							var accRec = [rec.ac + global_AccountSeparator + rec.bc, rec.ac + ' - ' + rec.an + ' - ' + rec.bc];
    							panel.accList.push(accRec);

    							// cache some data for later use
    							var newobj = new Object();
    							newobj.ac = rec.ac;
    							newobj.bc = rec.bc;
    							newobj.cc = rec.cc;
    							newobj.ex = rec.ex;
    							panel.accs.push(newobj);
    						}
    					}
    				}
    			}
    		});
    	}else{
    		accStore = new Ext.data.ArrayStore({
    			fields: ['accno', 'name'],
    			data: this.accList
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
            iconAlign: 'top',
            padding: 0,
            margin: '0 5 0 0',
            hidden: !isDealerRemisier,
            iconCls: "icon-center icon-search-account",
            style: 'background: transparent;',
            handler: function () {
            	panel.runSearchAccount();
//                if (panel.tbSearchAccount.isHidden()) {
//                    panel.tbSearchAccount.setVisible(true);
//                    panel.cbAccount.setHidden(true);
//                } else {
//                    if (panel.tbSearchAccount.getValue().trim() == '') {
//                        panel.tbSearchAccount.setValue('');
//                        msgutil.alert(languageFormat.getLanguage(10045, 'Please key in your search text.'), function () {
//                            panel.tbSearchAccount.focus();
//                        });
//                    } else {
//                        panel.searchAccount(panel.tbSearchAccount.getValue());
//                    }
//                }
            }
        });
        
        panel.cbAccount = new Ext.form.ComboBox({
            width: 145,
            scroll: true,
            selectOnFocus: true,
            forceSelection: !isDealerRemisier,
            listConfig: {
                cls: 'my-combo-lst',
                minWidth: 145
            },
            editable: true,
            queryMode: !isDealerRemisier ? 'local' : 'remote',
            store: accStore,
            displayField: 'name',
            valueField: 'accno',
            triggerAction: 'all',
            pageSize: !isDealerRemisier ? 0 : N2N_CONFIG.constDRPagingSize,
            lazyInit: false,
            value: (panel.accList.length > 0 ? panel.accList[0][0] : ''),
            matchFieldWidth: false,
            minChars: 999, //set to large number to prevent query from being fired when typing
            emptyText: isDealerRemisier ? languageFormat.getLanguage(20876, 'Search account here.. min ' + N2N_CONFIG.constDRMinChars + ' chars', N2N_CONFIG.constDRMinChars) : languageFormat.getLanguage(20900, 'Please select account...'),
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
                	if(isDealerRemisier){
                    	combo.getStore().on('load', function(thisStore, records) {
                    		if (records) {
                    			if(records.length == 1){
                    				combo.select(records);
                    				combo.collapse();
                    				
                    				var accountParts = combo.getValue().split(global_AccountSeparator);
                                    var thisAccount = accountParts[0].trim();
                                    var accbranch = accountParts[1].trim();

                                    panel.accNo = thisAccount;
                                    panel.branchCode = accbranch;
                                    panel.setOrdStsLastUptTime('');
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
                    //Set loading here because filter locally
                    panel.setLoading(true);

                    //Obtain accno
                    var accno = this.value;

                    try {
                        //If default basket
                        if (accno == "") {
                            panel.store.clearFilter();
                        } else {
                            //Split account to obtain only the account part, then filter
                            accno = (accno).split(global_AccountSeparator)[0].trim();
                            panel.store.filter('AccNo', accno);
                        }
                    } catch (e) {
                        console.log('[BasketOrder][cbAccount] Exception ---> ' + e);
                    }
                    //[END] set loading
                    panel.setLoading(false);
                },
                specialkey: function(thisCb, e) {
                	if (e.getKey() == e.ENTER) {
                		panel.runSearchAccount();
                	}
                } 
            }
        });
        
        panel.basketList = [];
        var allRec = ['default', languageFormat.getLanguage(21609, 'Default Basket')];
        panel.basketList.push(allRec);
        
        var basketListStore = new Ext.data.ArrayStore({
            fields: ['id', 'name', 'expDate'],
            data: panel.basketList
        });
        
        panel.cbBasket = new Ext.form.ComboBox({
            width: 145,
            scroll: true,
           // selectOnFocus: true,
           // forceSelection: true,
            listConfig: {
                cls: 'my-combo-lst',
                minWidth: 145
            },
            queryMode: 'local',
            store: basketListStore,
            displayField: 'name',
            valueField: 'id',
            triggerAction: 'all',
            lazyInit: false,
            value: 'default',
            editable: false,
            matchFieldWidth: false,
            listeners: {
            	beforequery: function(qe){
                    delete qe.combo.lastQuery;
                },
            	expand: function(thisCombo){
            		n2ncomponents.saveBasketCookie();
            	},
                select: function () {
                	var filterBasketOpt = this.value;
                    panel.filterBasketOpt = filterBasketOpt;
                    panel.getBasketItems(filterBasketOpt);
                    if(filterBasketOpt == 'default'){
                    	panel.down('#topToolbar').down('#btnSaveBasket').disable();
                    }else{
                    	panel.down('#topToolbar').down('#btnSaveBasket').enable();
                    }
                }
            }
        });
               
        var btnEditBasket = {
        		text: languageFormat.getLanguage(10021, 'Edit'),
        		xtype: xtype,
        		handler: function () {
        			panel.openEditBasketPanel();
        		}
        };

        var btnCreateBasket = {
        		text: languageFormat.getLanguage(21601, 'Create'),
        		xtype: xtype,
        		handler: function () {
        			panel.openCreateBasketPanel();
        		}
        };

        var btnSaveBasket = {
        		itemId: 'btnSaveBasket',
        		text: languageFormat.getLanguage(21045, 'Save'),
        		xtype: xtype,
        		disabled: true,
        		handler: function () {
        			panel.saveBasketList();
        		}
        };
        var btnRefreshConf = {
                text: languageFormat.getLanguage(10008, 'Refresh'),
                tooltip: languageFormat.getLanguage(10008, 'Refresh'),
                xtype: xtype,
                iconCls: 'icon-reset',
                handler: function () {
                    var isAddBasket = basketOrderPanel.isAddBasket;
                    if(isAddBasket){
                        panel.getView().refresh();
                    } else {
                        panel.getBasketItems(panel.filterBasketOpt, true);
                    }
                }
            };
        this.btnRefresh = new Ext.Button(btnRefreshConf);  
        
        panel.compRef.topBar = Ext.create('Ext.toolbar.Toolbar', {
            itemId: 'topToolbar',
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll,
            //height: 30,
            items: [
                panel.cbAccount,
                panel.tbSearchAccount,
                panel.searchAccountBtn,
                panel.cbBasket,
                btnEditBasket,
                btnCreateBasket,
                btnSaveBasket,
                new Ext.Button({
                    text: languageFormat.getLanguage(10004, 'Export CSV'),
                    tooltip: languageFormat.getLanguage(10004, 'Export CSV'),
                    hidden: !isDesktop,
                    iconCls: 'icon-export',
                    listeners: {
                        click: function () {

                            var optColumn = {};
                            optColumn[ 'OrdDate' ] = ExportFile.TYPE_DATE;
                            optColumn[ 'ExpDate' ] = ExportFile.TYPE_DATE;

                            ExportFile.initial(ExportFile.FILE_CSV, panel, optColumn);
                        }
                    }

                }),
                '->',
                createAutoWidthButton(panel),
                this.btnRefresh
                ]
        });
        panel.compRef.bottomBar = Ext.create('Ext.toolbar.Toolbar', {
            height: 30,
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll,
            width: "100%",
            items: [
                {
                    xtype: 'label',
                    itemId: 'lblpinw',
                    html: languageFormat.getLanguage(20847, 'Trading Pin'),
                    style: 'text-align: right;font-size: 8pt',
                    hidden: this.checkIsHidePin() //1.3.25.3
                },
                {
                    xtype: 'textfield',
                    itemId: 'pinw',
                    name: 'pinw',
                    width: 55,
                    // vtype: 'pin',
                    invalidClass: 'ordpad-invalid',
                    inputType: 'password',
                    maxLength: 6,
                    hidden: this.checkIsHidePin(), //1.3.25.3
                    listeners: {
                        blur: function (el) {
                            panel.pinInfo.lastPin = el.getValue();
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
                    },
                    autoCreate: {tag: 'input', type: 'text', autocomplete: 'off', maxlength: 6, size: 6}
                },
                {
                    xtype: 'checkbox',
                    itemId: 'chkSavePinw',
                    name: 'chkSavePinw',
                    hideLabel: true,
                    boxLabel: '<img class="icon-save-pin" style="width: 16px; height: 16px;"/>&nbsp;',
                    hidden: this.checkIsHidePin(), //1.3.25.3
                    listeners: {
                        check: function (el, val) {
                            panel.pinInfo.savePin = val;
                        }
                    }
                },
               {
                    xtype: 'button',
                    itemId: 'btnsubmit',
                    text: languageFormat.getLanguage(20849, 'Submit'),
                    autoWidth: false,
                    style: 'font-size: 8pt;',
                    handler: function () {
                        panel.processBasketOrd();
                    }
                },
                {
                    xtype: 'button',
                    itemId: 'btnRemove',
                    text: languageFormat.getLanguage(21602, 'Remove'),
                    autoWidth: false,
                    style: 'font-size: 8pt;',
                    handler: function () {
                    	var ls = panel.getSelection();
                        var n = ls.length;
                        var basketList = [];
                        for (var i = 0; i < n; i++) {
                        	var r = ls[i];
                			basketOrderPanel.store.remove(r);				
                        }
                        panel.getView().refresh();
                        panel.saveBasketList();
                    }
                },
                new Ext.form.Label({
                    text: languageFormat.getLanguage(30404, 'Please click "Refresh" for the latest order status'),
                    hidden: showOrderStatusLabel == "TRUE" ? false : true
                })
            ]
        });

        var defaultConfig = {
            bufferedRenderer: N2N_CONFIG.gridBufferedRenderer,
            leadingBufferZone: N2N_CONFIG.gridLeadingBufferZone,
            trailingBufferZone: N2N_CONFIG.gridTrailingBufferZone,
        	plugins: [this.cellEditing],
            viewConfig: getGridViewConfig(panel),
            store: store,
            columns: {
            	defaults: {
                    lockable: false // does not work in ExtJS 4.2, keep for its later fix
                },
            	items: colutils.getColumnModel(panel, '')
            },
            header: false,
            bodyStyle: 'padding:0px; margin:0px; font-size: 12pt; border: none;',
            width: '100%',
            height: 232,
            selModel: this.selModel,
//            columnLines: false,
            border: false,
            enableColumnMove: N2N_CONFIG.gridColMove,
            enableColumnHide: N2N_CONFIG.gridColHide,
            trackMouseOver: false,
            tbar: panel.compRef.topBar,
            bbar: panel.compRef.bottomBar,
            listeners: {
                afterrender: function (p) {
                	panel.updateBasketList();
                	var basket = localStorage.getItem(loginId + '_BasketList');
                    if(basket){
                    	var basketList = basket.split('|');
                    	for(var i=0; i<basketList.length; i++){
                    		var basketRec = JSON.parse(basketList[i]);
                        	panel.store.add(basketRec);
                        	panel.getView().refresh();
                    	}
                    }
                },
                hide: function (p) {
                    p.store.removeAll();
                },
                columnresize: function(ct, column, newWidth, eOpts) {
                    if (newWidth === 0) {
                        column.autoSize();
                        newWidth = column.width;
                        return;
                    }

                    panel.updateColWidthCache(column, newWidth);
  

                    if (N2N_CONFIG.autoQtyRound) {
                        helper.refreshView(panel);
                    }
                },
//                cellcontextmenu: function (p, td, cellIndex, record, tr, ridx, e) {
//                    if (!touchMode) {
//                        if (outbound) {
//                            //panel.disableRightFunction(record.get('StkCode'));
//                        }
//                        //Currently disable Right click for the whole function cellcontextmenu
//                        panel.showContextMenu(p, ridx, e, record);
//                    }
//                },
                beforedestroy: function (p) {
                    if (p.contextMenu != null)
                        p.contextMenu.destroy();

                    panel.stkcodes = null;
                    //panel.stopRefreshTimer();
                   // panel._stopRefreshTask();

                    Blinking.clearBlink(panel);

                   // Storage.generateUnsubscriptionByExtComp(panel);
                },
                columnmove: function() {
                    gridColHandler(panel);
                },
                columnshow: function() {
                    gridColHandler(panel);
                    helper.autoFitColumns(panel);
                },
                columnhide: function() {
                    gridColHandler(panel);
                    helper.autoFitColumns(panel);
                },
                resize: function() {
                    bufferedResizeHandler(panel);

                    if (!panel.isFirstTime) {
                        helper.autoFitColumns(panel);
                    }
                }
            }
        };

        this.createContextMenu();

        Ext.apply(this, defaultConfig);

        this.callParent(arguments);
        
        //this.callAccBal();
    },
    procColumnWidth: function () {
        var panel = this;
        panel.columnHash = new N2NHashtable();
        var columnID;
        var columnWidth;
        panel._setCookieId();

        var columnID = '';
        var columnWidth = '';
        var col = columnWidthSaveManager.getColWidth(panel.colWidthKey, panel.cookieKey); 

        if (col) {
            columnID = col[0];
            columnWidth = col[1];
        } else {
            columnID = global_OSColumnID;
            columnWidth = global_OSWidth;
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
    formatDecimal: function (value, decimal) {
        var defaultValue = 0;
        if (value == '') {
            return parseFloat(defaultValue).toFixed(decimal);
        } else {
            return parseFloat(value).toFixed(decimal);
        }
    }, //1.3.25.20
    formatNumber: function (value, digit) {
        value = value.toString(10);
        var length = value.length;
        var oldvalue;
        if (digit != null && length > digit) {
            oldvalue = value;
            value = Math.round(value / 1000) * 1000;
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
            ret += 'k';

        return ret;
    },
    formatNumberLot: function (value) {
        if (isNaN(value)) {
            return null;
        }

        value = value.toString(10);
        var oldvalue = value;
        var cursor;
        var identifier = '';
        if (value.length >= 8) {
            identifier = 'M';
            var decimal = 3;

            if (value.length >= 10) {
                decimal = 2;
            }

            cursor = value.length - 6;
            var str1 = '';
            var str2 = '';

            if (cursor == 0) {
                str1 = "0";
                str2 = value;
            } else {
                str1 = value.substring(0, cursor);
                str2 = value.substring(cursor, value.length);
            }

            var l = str2.length;
            str2 = parseInt(str2, 10);
            str2 = str2 / Math.pow(10, l - 2);
            str2 = Math.round(str2);

            value = str1 + '.' + str2;
            value = parseFloat(value).toFixed(decimal);
        } else if (value.length >= 7) {
            identifier = 'K';

            cursor = value.length - 3;
            str1 = value.substring(0, cursor);
            str2 = value.substring(cursor, value.length);

            l = str2.length;
            str2 = parseInt(str2, 10);
            str2 = str2 / Math.pow(10, l - 2);
            str2 = Math.round(str2);

            value = str1 + '.' + str2;
            value = parseFloat(value).toFixed(2);
        }

        var x = value.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        var ret = x1 + x2;
        if (oldvalue != null) {
            ret += identifier;
        }

        return ret;
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
    printNumber: function (value) {
        if (viewInLotMode) {
            value = this.formatNumberLot(value);
        } else {
            value = this.formatNumber(value); //1.3.34.55 remove set digit to 8, if nt the number larger than 8 will show NaN
        }
        return value;
    },
    updateColumnMap: function () {
        var panel = this;

        var map = (panel.columnmap == null ? {} : panel.columnmap);
        var cm = this.getView().getHeaderCt();
        var colcount = cm.getColumnCount();

        for (var i = 1; i < colcount; i++) {
//                        var id = cm.getColumnId(i);
            var id = cm.getHeaderAtIndex(i).getItemId();
            //this columnmap id = current index of column of that id
            //map[id] = cm.getIndexById(id);
            map[id] = cm.getHeaderAtIndex(i).getIndex();
        }

        panel.columnmap = map;
    },
    showContextMenu: function (grid, ridx, e, record) {
        e.stopEvent();

        var panel = this;

        grid.getSelectionModel().select(ridx);

        if (this.contextMenu == null)
            this.createContextMenu();

        var rec = grid.store.getAt(ridx).data;
        var stkCode = rec.StkCode;
        var stkName = rec.StkName;
        var accno = rec.AccNo;
        var ordqty = rec.OrdQty;
        var ordprc = rec.OrdPrc;
        var ordtype = rec.OrdType;
        var validity = rec.Validity;
        var tktno = rec.TktNo;
        var ordno = rec.OrdNo;
        var SubOrdNo = rec.SubOrdNo;
        var ordsrc = rec.OrdSrc;
        var ordtime = rec.OrdTime;
        var orddate = rec.OrdDate;
        var ordsts = rec.Sts;
        var unmtqty = rec.UnMtQty;
        var expdate = rec.ExpDate;
        var stoplimit = rec.StopLimit;
        var minqty = rec.MinQty;
        var dsqty = rec.DsQty;
        var remark = rec.Remark;
        var seqNo = rec.SeqNo;
        var dateTime = rec.DateTime;
        var action = rec.PrevAct;
        var branchCode = rec.BCode;
        var brokerCode = rec.BrokerCode;
        var mtqty = rec.MtQty;
        var settopt = rec.SettOpt;
        var settcurr = rec.Currency;
        var tpType = rec.TPType;
        var tpDirection = rec.TPDirection;
        var accName = rec.AccountName;
        var tradCond = rec.TradCond;
        var state = rec.State;

        this.contextMenu.stkCode = stkCode;
        this.contextMenu.stkName = stkName;

        var ordRec = {
            accNo: accno + global_AccountSeparator + branchCode,
            ordQty: ordqty,
            ordPrc: ordprc,
            price: ordprc,
            ordType: ordtype,
            validity: validity,
            tktNo: tktno,
            ordNo: ordno,
            SubOrdNo: SubOrdNo,
            ordSrc: ordsrc,
            ordTime: ordtime,
            ordSts: ordsts,
            unMtQty: unmtqty,
            ordDate: orddate,
            expDate: expdate,
            stopLimit: stoplimit,
            MinQty: minqty,
            DsQty: dsqty,
            remark: remark,
            seqNo: seqNo,
            dateTime: dateTime,
            Action: action,
            BCode: branchCode,
            BrokerCode: brokerCode,
            MtQty: mtqty,
            SettOpt: settopt,
            SettCurr: settcurr,
            TPType: tpType,
            TPDirection: tpDirection,
            OrdStsAccList: [[accno + global_AccountSeparator + branchCode, accno + ' - ' + accName + ' - ' + branchCode]],
            TradCond: tradCond,
            State: state
        };

        //this.contextMenu.ordRec = ordRec;
        this.contextMenu.ordRec = record;

//        var canTrd = false;
//        if ((tktno || ordno) && canCancelRevise(ordsts))
//            canTrd = true;
//
//        if (canTrd) {
//            this.contextMenu.down('#' + this.menuReviseId).enable();
//            this.contextMenu.down('#' + this.menuCancelId).enable();
//        } else {
//            this.contextMenu.down('#' + this.menuReviseId).disable();
//            this.contextMenu.down('#' + this.menuCancelId).disable();
//        }

        //this.disableRightFunction(this.contextMenu.stkCode);
        this.contextMenu.showAt(e.getXY());

    },
    isRowCanChecked: function (row) {
        var panel = this;
        var view = helper.getGridView(panel, 'lock'); // safe for both locking or unlocking grid
        var chkcell = view.getCellByPosition({row: row, column: 0});
        if (chkcell) {
            var chkEl = Ext.get(chkcell);
            var c = chkEl.first().first();
            if (c.hasCls('x-grid-row-checker'))
                return true;
        }

        return false;
    },
    processValidSelection: function () {
        var panel = this;

        var sm = panel.getSelectionModel();
        var ls = sm.getSelection();
        var n = ls.length;
        if (n > 1) {
//            sm.each(function(rec) {
//                var row = panel.store.indexOf(rec);
//                if (!panel.isRowCanChecked(view, row))
//                    sm.deselect(row);
//            });
            Ext.each(ls, function (rec) {
                var row = panel.store.indexOf(rec);
                if (!panel.isRowCanChecked(row))
                    sm.deselect(row);
            });
        }
    },
    showCancelPanel: function (sm, ridx, rec) {
        var panel = this;

        if (sm.hasSelection()) {
            //panel.processValidSelection();
            var ls = sm.getSelection();
            var n = ls.length;
            if (n == 1) {
                var row = panel.store.indexOf(ls[0]);
                if (!panel.isRowCanChecked(row))
                    panel.showCancelComp(false);

                else
                    panel.showCancelComp(true);
            }

            else if (n < 1)
                panel.showCancelComp(false);

            else
                panel.showCancelComp(true);
        }

        else
            panel.showCancelComp(false);
    },
    showCancelComp: function (arg) {
        var panel = this;

        try {
            //   panel.compRef.bottomBar.suspendLayouts();

            if (!panel.checkIsHidePin()) { //1.3.25.3 Added Checking
                if (arg == true) {
                    //Ext.getCmp('lblpinw').setVisible(true);
                    panel.down('#lblpinw').setVisible(true);
                    //Ext.getCmp('pinw').setVisible(true);
                    panel.down('#pinw').setVisible(true);
                    //Ext.getCmp('chkSavePinw').setVisible(true);
                    panel.down('#chkSavePinw').setVisible(true);
                    //Ext.getCmp('btncancel').setVisible(true);
                    //panel.down('#btncancel').setVisible(true);
                    panel.down('#btnsubmit').setVisible(true);
                    panel.down('#btnRemove').setVisible(true);
                }

                else {
                    //Ext.getCmp('lblpinw').setVisible(false);
                    panel.down('#lblpinw').setVisible(false);
                    //Ext.getCmp('pinw').setVisible(false);
                    panel.down('#pinw').setVisible(false)
                    //Ext.getCmp('chkSavePinw').setVisible(false);
                    panel.down('#chkSavePinw').setVisible(false);
                    //Ext.getCmp('btncancel').setVisible(false);
                    //panel.down('#btncancel').setVisible(false);
                    panel.down('#btnsubmit').setVisible(false);
                    panel.down('#btnRemove').setVisible(false);
                }
            }
            else { //1.3.25.3
                if (arg == true) {
                    //Ext.getCmp('lblpinw').setVisible(false);
                    panel.down('#lblpinw').setVisible(false);
                    //Ext.getCmp('pinw').setVisible(false);
                    panel.down('#pinw').setVisible(false);
                    //Ext.getCmp('chkSavePinw').setVisible(false);
                    panel.down('#chkSavePinw').setVisible(false);
                    //Ext.getCmp('btncancel').setVisible(true);
                    //panel.down('#btncancel').setVisible(true);
                    panel.down('#btnsubmit').setVisible(true);
                    panel.down('#btnRemove').setVisible(true);
                }
                else {
                    //Ext.getCmp('lblpinw').setVisible(false);
                    panel.down('#lblpinw').setVisible(false);
                    //Ext.getCmp('pinw').setVisible(false);
                    panel.down('#pinw').setVisible(false);
                    //Ext.getCmp('chkSavePinw').setVisible(false);
                    panel.down('#chkSavePinw').setVisible(false);
                    //Ext.getCmp('btncancel').setVisible(false);
                    //panel.down('#btncancel').setVisible(false);
                    panel.down('#btnsubmit').setVisible(false);
                    panel.down('#btnRemove').setVisible(false);
                }
            }
          
            //  panel.compRef.bottomBar.resumeLayouts();
        } catch (e) {
            console.log('[orderStatus][showCancelComp] Exception ---> ' + e);
        }
    },
    canTrade: function (o) {
        if ((o.tktno || o.ordno) && canCancelRevise(o.ordsts))
            return true;

        return false;
    },
    processBasketOrd: function () {
    	var panel = this;
    	
    	try {
    		var ls = panel.getSelection();
    		var n = ls.length;
    		
    		if(n == 0){
    			msgutil.alert('No order(s) selected.');
    			return false;
    		}
    		
    		var keyPair = new RSAKeyPair(key, '', mod);

    		var pin = panel.down('#pinw').getValue();

    		//1.3.25.3 Set a fix pin when trading pin is hidden
    		if (panel.checkIsHidePin()) {
    			panel.down('#pinw').setValue("123456");
    			pin = "123456";
    		}
    		pin = trim(pin);
    		if (!pin) {
    			//  msgutil.alert('Pls enter your trading pin.',	
    			msgutil.alert(languageFormat.getLanguage(30212, 'Please enter your trading pin.'),
    					function () {
    				panel.down('#pinw').focus();
    			});
    			return false;
    		}


    		if (!testPin(pin)) {
    			//msgutil.alert('Invalid trading pin. Pls check your trading pin.',
    			msgutil.alert(languageFormat.getLanguage(30402, 'We regret to inform that you have entered an invalid trading pin. Kindly check your trading pin and try again.'),
    					function () {
    				panel.down('#pinw').focus();
    			});
    			return false;
    		}

    		setPinInfo(panel.pinInfo);

    		var pin2 = encryptedString(keyPair, pin);                    	
    		
    		var basketList = [];
    		for (var i = 0; i < n; i++) {
    			var r = ls[i].data;
    			basketList.push(r);
    		}

    		var fromBasket = true;
    		panel.setLoading(true);
    		//if(!orderPad){
    			//activateBuySellMenu(modeOrdBuy);  			
    		//}
    		orderPad.submitForm(basketList, pin2, fromBasket);
    		//msgutil.info(languageFormat.getLanguage(31607, 'Order(s) submitted. Please check order book for details.'));
    	} catch (e) {
    		console.log('[orderStatus][processBasketOrd] Exception ---> ' + e);
    	}
    },
    //1.3.25.3 Check IsHidePin function
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
    //1.3.25.3 getSkipPinCategory and split it
    getSkipPinCategory: function (skipCategary) {
        var x = skipCategary.split(',');
        return x;
    },
    uncheckHeader: function (clr) {
        this.columns[0].removeCls('x-grid-hd-checker-on');
        if (clr == true)
            this.getSelectionModel().clearSelections();
    },
    setPinInfo: function (cfg) {
        if (cfg.savePin) {
            this.pinInfo = cfg;
            this.down('#pinw').setValue(cfg.lastPin);
            this.down('#chkSavePinw').setValue(cfg.savePin);
        }
    },
    selectRecord: function (recData) {
        if (recData) {
            this.tktno = recData.get('TktNo');
            this.ordno = recData.get('OrdNo');
            this.stkname = recData.get('StkName');
        } else {
        }
    },
    cleanUp: function () {
        if (this.store != null)
            this.store.removeAll();
    },
    onRowDblClick: function (func) {
        this.on('rowdblclick', func);
    },
    onCellClick: function (func) {
        this.on('cellclick', func);
    },
    createContextMenu: function () {
    	var menu = this;
    	var btns = [];

    	this.menuRemoveId = Ext.id();
    	btns.push({
    		id: menu.menuRemoveId,
    		text: languageFormat.getLanguage(21602, 'Remove'),
    		popupOnly: true,
    		handler: function () {
    			//var ls = basketOrderPanel.getSelection();
    			//var n = ls.length;
    			var rec = basketOrderPanel.contextMenu.ordRec;
    			basketOrderPanel.store.remove(rec);
    			basketOrderPanel.getView().refresh();
    			basketOrderPanel.saveBasketList();
    		}
    	});
    	this.menuRemoveAllId = Ext.id();
    	btns.push({
    		id: menu.menuRemoveAllId,
    		text: languageFormat.getLanguage(21603, 'Remove All'),
    		popupOnly: true,
    		handler: function () {
    			basketOrderPanel.store.removeAll();		
    			basketOrderPanel.getView().refresh();
    			basketOrderPanel.saveBasketList();
    		}
    	});
		
    	this.contextMenu = new Ext.menu.Menu({
    		stkCode: '',
    		autoWidth: true,
    		items: btns,
    		listeners: addDDMenu()
    	});
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
                            btn = this.contextMenu.down("#" + this.menuBuyId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuSellId:
                            btn = this.contextMenu.down("#" + this.menuSellId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuReviseId:
                            btn = this.contextMenu.down("#" + this.menuReviseId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuCancelId:
                            btn = this.contextMenu.down("#" + this.menuCancelId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuDepthId:
                            btn = this.contextMenu.down("#" + this.menuDepthId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuStkInfoId:
                            btn = this.contextMenu.down("#" + this.menuStkInfoId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuChartId:
                            btn = this.contextMenu.down("#" + this.menuChartId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuAnalysisId:
                            btn = this.contextMenu.down("#" + this.menuAnalysisId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuStkNewsId:
//						if (exchangecode == 'KL' || exchangecode == 'MY') {
                            btn = this.contextMenu.down("#" + this.menuStkNewsId);
                            btn.setHandler(func.func);
//						}
                            break;
                        case this.menuStkTrackerId:
                            btn = this.contextMenu.down("#" + this.menuStkTrackerId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuStkNewsArchiveId:
                            btn = this.contextMenu.down("#" + this.menuStkNewsArchiveId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuEqTrackerId:
                            btn = this.contextMenu.down("#" + this.menuEqTrackerId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuHisDataId:
                            btn = this.contextMenu.down("#" + this.menuHisDataId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuOrdLogId:
                            btn = this.contextMenu.down("#" + this.menuOrdLogId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuOrdDetailId:
                            btn = this.contextMenu.down("#" + this.menuOrdDetailId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuOrdPositionId:
                            btn = this.contextMenu.get(this.menuOrdPositionId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuFundamentalCPIQId:
                            btn = this.contextMenu.down("#" + this.menuFundamentalCPIQId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuFundamentalThomsonReutersId:
                            btn = this.contextMenu.down("#" + this.menuFundamentalThomsonReutersId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuAddStockAlertId:
                            btn = this.contextMenu.down("#" + this.menuAddStockAlertId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuWarrantsInfoId:
                            btn = this.contextMenu.down("#" + this.menuWarrantsInfoId);
                            btn.setHandler(func.func);
                            break;
                    }
                }
            }
        }
    },
    getStore: function () {
        return this.store;
    },
    isValidColumnSetting: function () {
        if (orderStatusCol != null && orderStatusCol != "") {
            if (orderStatusCol.indexOf("~") != -1) {
                return true;
            }
            else
                return false;
        }

        return true;
    },
    getExchangeType: function (stockcode) {	// use on outbound only to show R=RealTime / D=Delay
        if (stockcode != undefined && stockcode != null) {
            var tmpV = stockcode.split(".");
            var tmpType = tmpV[tmpV.length - 1];
            return tmpType;
        } else {
            return '';
        }
    },
    /*
     disableRightFunction: function(stk) {
     // applicable for outbound some exchanges does not have data
     var exCode = stockutil.getExchange(stk);
     var ctmnChart = this.contextMenu.getComponent(this.menuChartId);
     var ctmnTracker = this.contextMenu.getComponent(this.menuStkTrackerId);
     if (exCode == "A" || exCode == "AD" || exCode == "N" || exCode == "ND" || exCode == "O" || exCode == "OD") {
     ctmnChart.disable();
     ctmnTracker.disable();
     } else {
     ctmnChart.enable();
     ctmnTracker.enable();
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
        menuList.push(trackerBtn.text);

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
        var allColumnId = global_BOAllColumn;
        return allColumnId;
    },
    defaultColumnSetting: function () {
        var defaultColumnId = global_BODefaultColumn;
        return defaultColumnId;
    },
    currentColumnSetting: function () {
    	var currentColumnId = layoutProfileManager.getCol('bo');

        // verify is new setting or old setting 
        var temp = currentColumnId.split("~");
        var indexNumber = temp.indexOf(colutils.ColumnVersion);
        if (indexNumber != -1) {
            temp.splice(indexNumber, 1);
            currentColumnId = temp.join('~');
        } else {
            currentColumnId = "";
        }

        return currentColumnId;
    },
    requiredColumnSetting: function () {
        return orderStatusReqCol;
    },
    /**
     * convert id to string 
     * 
     * @param id : string
     * 
     * @return String
     */
    saveColumn: function(newColumnIdArr) {
        var panel = this;
        panel._updatedCols = panel.generateColumnsArray(colutils.generateColumnArray(panel, newColumnIdArr));
        panel.reconfigure(null, panel._updatedCols);
        panel.requestSaveColumns(newColumnIdArr);

    },
    requestSaveColumns: function(newColumnIdArr) {
        var panel = this;

        newColumnIdArr = newColumnIdArr + "~" + colutils.ColumnVersion;
        colutils.saveColumn('bo', newColumnIdArr);
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
            var cssClass = N2NCSS.CellDefault;


            if (format == 'stkcode' || format == 'stkname') {
                var idx = value.lastIndexOf('.');

                if (idx >= 0)
                    value = value.substring(0, idx);
            }

            if (convert == 'string') {
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontColorString;
            }else if(convert == "unchange"){
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontUnChange;
            }
            else if (convert == 'ordno') {
                cssClass += " " + N2NCSS.FontColorString;
                cssClass += " " + N2NCSS.FontStockName;
            }
            else if (convert == 'stkname') {
                cssClass += " " + N2NCSS.FontStockName;
                var tempCss = StockColor.stockByOrderBook(value, record, panel);

                if (tempCss == null)
                    cssClass += " " + N2NCSS.FontColorString;
                else
                    cssClass += " " + tempCss.css;
            }
            else if (convert == 'stockcode') {
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontColorString;
            }
            else if (convert == 'orddate') {
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontColorString;
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
            else if (convert == 'date') {
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontColorString;

                var dateObj = null;
                if (value != null) {
                    if (value.indexOf('-') != -1) {
                        var tempDate = (value).split('-');
                        dateObj = new Date(tempDate[0], (tempDate[1] - 1), tempDate[2]);
                    }

                    value = Ext.Date.format(dateObj, global_DateFormat);
                }
            }
            else if (convert == 'action') {
                if (value.toLowerCase() == 'b') {
                    cssClass += " " + N2NCSS.FontUp;
                    cssClass += " " + N2NCSS.FontString;
                } else {
                    cssClass += " " + N2NCSS.FontDown;
                    cssClass += " " + N2NCSS.FontString;
                }

            }
            else if (convert == 'ordprc') {
                cssClass += " " + N2NCSS.FontUp;
                cssClass += " " + N2NCSS.FontString;
            } else if (convert == 'matchval') {
                cssClass += " " + N2NCSS.FontString;
                value = value == "" ? 0 : value;
                if (value == 0) {
                    cssClass += " " + N2NCSS.FontUnChange;

                } else if (value != 0) {
                    cssClass += " " + N2NCSS.FontUp;
                }
            } else if (convert == 'time') {
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontColorString;

                var timeObj = null;
                if (value != null) {
                    if (value.indexOf(':') != -1) {
                        var tempTime = (value).split(':');
                        timeObj = new Date();
                        timeObj.setHours(tempTime[0]);
                        timeObj.setMinutes(tempTime[1]);
                        timeObj.setSeconds(tempTime[2]);
                    }
                }

                if (timeObj != null) {
                    value = Ext.Date.format(timeObj, global_TimeFormat);
                }
            }
            else if (convert == 'price') {

//			var tempObj = formatutils.procPriceValue(value);

                cssClass += " " + N2NCSS.FontString;
//			if (!tempObj.validation) {
//				cssClass += " " + N2NCSS.FontUnChange;
//			} else {
                //if (parseFloat( record.data[fieldLast] ) > parseFloat( record.data[fieldLacp] )) {
                if (parseFloat(value) > parseFloat(record.data['LACP'])) {
                    cssClass += " " + N2NCSS.FontUp;
                    //} else if (parseFloat( record.data[fieldLast] ) < parseFloat( record.data[fieldLacp])) {
                } else if (parseFloat(value) < parseFloat(record.data['LACP'])) {
                    cssClass += " " + N2NCSS.FontDown;
                } else {
                    cssClass += " " + N2NCSS.FontUnChange;
                }
//			}
//			value = tempObj.value;

            }
            else if (convert == 'expdate') {
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontColorString;

                value = stockutil.formatExpDate(value);
            }


            meta.css = cssClass;

            return value;
        };

        var columnList = [];
        var ordSta = panel._idPrefix;
        for (var i = 0; i < colSettingList.length; i++) {
        	var colObj = colSettingList[i];
        	var columnID = colObj.column;
        	var columnVisible = colObj.visible ? false : true;
        	switch (columnID) {
        	case cmap_osAccNo:
        		columnList.push({
        			itemId: ordSta + columnID,
        			header: languageFormat.getLanguage(10901, 'Acc.No'),
        			dataIndex: 'AccNo',
        			sortable: true,
        			width: panel.getWidth(columnID),
        			menuDisabled: isMobile,
        			renderer: function (value, meta, record) {
        				return fmtHelper(value, meta, record, '', 'string');
        			}
        		});
        		break;
        	case cmap_osStkCode:
        		columnList.push({
        			itemId: ordSta + columnID,
        			header: languageFormat.getLanguage(10101, 'Code'),
        			dataIndex: 'StkCode',
        			sortable: true,
        			menuDisabled: isMobile,
        			width: panel.getWidth(columnID),  
        			renderer: function (value, meta, record) {
        				return fmtHelper(value, meta, record, '', 'string');
        			}
        		});
        		break;
//      		case cmap_osStkName:
//      		columnList.push({
//      		itemId: ordSta + columnID,
//      		header: languageFormat.getLanguage(10102, 'Symbol'),
//      		dataIndex: 'StkName',
//      		sortable: true,
//      		menuDisabled: isMobile,
//      		width: panel.getWidth(columnID),  
//      		renderer: function (value, meta, record) {
//      		return fmtHelper(value, meta, record, 'stkname', 'stkname');
//      		}
//      		});
//      		break;
        	case cmap_osAction:
        		columnList.push({
        			itemId: ordSta + columnID,
        			header: languageFormat.getLanguage(20832, 'Action'),
        			dataIndex: 'Act',
        			sortable: true,
        			menuDisabled: isMobile,
        			width: panel.getWidth(columnID), 
        			editor:{
        				xtype: 'combobox',
        				queryMode: 'local',
        				editable: false,
        				store: new Ext.data.ArrayStore({
        					fields: ['Act','displayText'],
        					data: [['B', 'B'], ['S', 'S']]
        				}),
        			    valueField: 'Act',
        			    displayField: 'displayText'
        			},
        			renderer: function (value, meta, record) {
        				return fmtHelper(value, meta, record, '', 'action');
        			}
        		});
        		break;
        	case cmap_osType:
        		columnList.push({
        			itemId: ordSta + columnID,
        			header: languageFormat.getLanguage(10905, 'OrdType'),
        			dataIndex: 'OrdType',
        			sortable: true,
        			menuDisabled: isMobile,
        			width: panel.getWidth(columnID),  
        			renderer: function (value, meta, record) {
        				return fmtHelper(value, meta, record, '', 'string');
        			}
        		});
        		break;
        	case cmap_osValidity:
        		columnList.push({
        			itemId: ordSta + columnID,
        			header: languageFormat.getLanguage(20838, 'Validity'),
        			dataIndex: 'Validity',
        			sortable: true,
        			menuDisabled: isMobile,
        			width: panel.getWidth(columnID),  
        			renderer: function (value, meta, record) {
        				return fmtHelper(value, meta, record, '', 'string');
        			}
        		});
        		break;
        	case cmap_osOrdQty:
        		columnList.push({
        			itemId: ordSta + columnID,
        			header: languageFormat.getLanguage(10907, 'OrdQty'),
        			dataIndex: 'OrdQty',
        			sortable: true,
        			menuDisabled: isMobile,
        			width: panel.getWidth(columnID),  
        			align: 'right',
        			editor:{
        				xtype: 'numberfield',
        				hideTrigger: true,
        				allowDecimals: false,
        				allowBlank: false
        			},
        			renderer: function (value, meta, record) {
        				value = panel.returnNumberFormat(value, panel.getWidth(cmap_osOrdQty));
        				return fmtHelper(value, meta, record, '', 'number');
        			}
        		});
        		break;
        	case cmap_osOrdPrc:
        		columnList.push({
        			itemId: ordSta + columnID,
        			header: languageFormat.getLanguage(10908, 'OrdPrice'),
        			dataIndex: 'OrdPrc',
        			sortable: true,
        			menuDisabled: isMobile,
        			width: panel.getWidth(columnID),  
        			align: 'right',
        			editor:{
        				xtype: 'numberfield',
        				allowBlank: false,
        				hideTrigger: true,
        				decimalPrecision: 3,
        				allowExponential: false,
        				listeners:{
//        					beforestartedit: function(){
//        						var store = panel.getStore().data;
//        				    	var rec = sm.items;
//        					}
        				}
        			},
        			renderer: function (value, meta, record) {
        				return fmtHelper(value, meta, record, '', 'ordprc');
        			}
        		});
        		break;
        	case cmap_osCurrency:
        		columnList.push({
        			itemId: ordSta + columnID,
        			header: languageFormat.getLanguage(10919, 'SettCurr'),
        			dataIndex: 'Currency',
        			sortable: true,
        			menuDisabled: isMobile,
        			width: panel.getWidth(columnID),  
        			align: 'center',
        			renderer: function (value, meta, record) {
        				return fmtHelper(value, meta, record, '', 'string');
        			}
        		});
        		break;
        	case cmap_osMinQty:
        		columnList.push({
        			itemId: ordSta + columnID,
        			header: languageFormat.getLanguage(10920, 'MinQty'),
        			dataIndex: 'MinQty',
        			sortable: true,
        			menuDisabled: isMobile,
        			width: panel.getWidth(columnID),  
        			align: 'right',
        			editor:{
        				xtype: 'numberfield',
        				minValue: 0,
        				allowDecimals: false,
        				allowBlank: true
        			},
        			renderer: function (value, meta, record) {
        				value = panel.returnNumberFormat(value, panel.getWidth(cmap_osMinQty));
        				return fmtHelper(value, meta, record, '', 'number');
        			}
        		});
        		break;
        	case cmap_osDsQty:
        		columnList.push({
        			itemId: ordSta + columnID,
        			header: languageFormat.getLanguage(10921, 'DisclosedQty'),
        			dataIndex: 'DsQty',
        			sortable: true,
        			menuDisabled: isMobile,
        			width: panel.getWidth(columnID),  
        			align: 'right',
        			editor:{
        				xtype: 'numberfield',
        				minValue: 0,
        				allowDecimals: false,
        				allowBlank: true
        			},
        			renderer: function (value, meta, record) {
        				value = panel.returnNumberFormat(value, panel.getWidth(cmap_osDsQty));
        				return fmtHelper(value, meta, record, '', 'number');
        			}
        		});
        		break;
        	case cmap_osStopLimit:
        		columnList.push({
        			itemId: ordSta + columnID,
        			header: languageFormat.getLanguage(20842, 'TriggerPrice'),
        			dataIndex: 'StopLimit',
        			sortable: true,
        			menuDisabled: isMobile,
        			width: panel.getWidth(columnID),  
        			align: 'right',
        			editor:{
        				xtype: 'numberfield',
        				//minValue: 1,
        				allowBlank: true,
        				decimalPrecision: 3,
        				allowExponential: false
        			},
        			renderer: function (value, meta, record) {
        				return fmtHelper(value, meta, record, '', 'unchange');
        			}
        		});
        		break;
        	case cmap_osSettOpt:
        		columnList.push({
        			itemId: ordSta + columnID,
        			header: languageFormat.getLanguage(10923, 'SettMode'),
        			dataIndex: 'SettOpt',
        			sortable: true,
        			menuDisabled: isMobile,
        			width: panel.getWidth(columnID),        		
        			align: 'center',
        			renderer: function (value, meta, record) {
        				return fmtHelper(value, meta, record, '', 'string');
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
    getAccountValue: function () {
        return this.cbAccount.getRawValue();
    },
    _setCookieId: function () {
        var me = this;
        
        me.cookieKey = columnWidthSaveManager.getCookieColKey('baskOrd');
        me.paramKey = N2N_CONFIG.constKey + 'BO';
        me.colWidthKey = 'bo';
    },
    getFieldList: function(type) {
        var panel = this;

        var returnArray = [fieldLast, fieldLacp];
        var columnModel = helper.getGridColumns(panel);
        var n = columnModel.length;

        for (var i = 1; i < n; i++) {
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
    _getActionEl: function (action) {
        var elStr = '';

        if (action.toLowerCase() === 'buy') {
            elStr = '<span class="' + N2NCSS.FontUp + '">' + action + '</span>';
        } else {
            elStr = '<span class="' + N2NCSS.FontDown + '">' + action + '</span>';
        }

        return elStr;
    },
    autoAdjustWidth: function() {
        var panel = this;

        panel.procColumnWidth();
        panel.reconfigure(null, colutils.getColumnModel(panel, ''));
        panel.tempWidth = cookies.toDefaultColumn(panel, panel.cookieKey);
        panel.isImgBlink = false;
        panel.runAutoAdjustWidth = false;
    },
    getRecordMapping: function () {
    	var o = [
    	         {name: 'StkCode', sortType: 'asUCString'},
    	         {name: 'AccNo', sortType: 'asUCString'},
    	         {name: 'BCode', sortType: 'asUCString'},
    	         {name: 'Act', sortType: 'asUCString'},
    	         {name: 'Validity', sortType: 'asUCString'},
    	         {name: 'Sts', sortType: 'asUCString'},
    	         {name: 'OrdQty', sortType: 'asInt'},
    	         {name: 'OrdPrc', sortType: 'asFloat'},
    	         {name: 'Currency', sortType: 'asUCString'},
    	         {name: 'OrdType', sortType: 'asUCString'},
    	         {name: 'LotSize', sortType: 'asInt'},
    	         {name: 'StopLimit', sortType: 'asFloat'}, //type: 'float'}, // fixed cancellation issue 20140820
    	         {name: 'MinQty', sortType: 'asInt'},
    	         {name: 'DsQty', sortType: 'asInt'},
    	         {name: 'Confirm', sortType: 'asUCString'},
    	         {name: 'SettOpt', sortType: 'asUCString'},
    	         {name: 'TPType', sortType: 'asUCString'},
    	         {name: 'TPDirection', sortType: 'asUCString'},
    	         {name: 'ClientCode', sortType: 'asUCString'},
    	         {name: 'AccExchCode', sortType: 'asUCString'},
    	         {name: 'BrokerCode', sortType: 'asUCString'},
    	         {name: 'ShortSell', sortType: 'asUCString'},
    	         {name: 'IDSS', sortType: 'asUCString'},
    	         {name: 'PrivateOrd', sortType: 'asUCString'}
    	         ];
    	return o;
    },
    localSearch: function () {
        // Local filter  
        var panel = this;

        //Blinking.clearBlink(panel);
        panel.getStore().filterBy(function (record, id) {
            var blnFilterAccNo = true;

            // filter by account no.
            if (panel.accNo == '') {
                // show all
            } else {
                if (panel.accNo.toUpperCase() == record.get('AccNo').toUpperCase()) {
                    if (panel.branchCode.toUpperCase() == record.get('BCode').toUpperCase()) {
                        blnFilterAccNo = true;
                    } else {
                        blnFilterAccNo = false;
                    }
                } else {
                    blnFilterAccNo = false;
                }
            }
            
            return blnFilterAccNo;
        });

        if (panel.getStore().getCount() == 0) {
            panel.emptyResult = languageFormat.getLanguage(30408, 'You do not have any order.');

            //helper.setHtml(panel.getView(), '<div class="x-grid-empty">' + panel.emptyResult + '</div>');
            helper.setGridEmptyText(panel, panel.emptyResult);
        }
    },
    openCreateBasketPanel: function(){
    	var panel = this;
    	 msgutil.prompt(languageFormat.getLanguage(32008, 'Please enter basket name') + ':', function (newBN) {
    		 newBN = newBN.trim();

             if (jsutil.isEmpty(newBN)) {
                 msgutil.alert(languageFormat.getLanguage(32002, 'The basket name should not be left blank. Kindly enter the name and try again.'), function () {
                	 openCreateBasketPanel();
                 });
             } else if (newBN.length > 20) { // more than 20 characters
                 msgutil.alert(languageFormat.getLanguage(30104, 'Please ensure that the name entered does not exceed 20 characters.'), function () {
                	 openCreateBasketPanel();
                 });
             } else if (containsWatchListFunnyChar(newBN)) { // TO REVIEW
                 msgutil.alert(languageFormat.getLanguage(30105, 'Please use only letters (a-z or A-Z), numbers (0-9) and symbols (space-_) in this field.'), function () {
                	 openCreateBasketPanel();
                 });
             } else {

                 var url = addPath + 'tcplus/createbl?b=' + encodeURI(newBN);
                 Ext.Ajax.request({
                     url: url,
                     method: 'POST',
                     success: function (response) {
                         try {
                             var obj = Ext.decode(response.responseText);
                             if (obj != null) {
                                 if (obj.s == true) {
                                	 var basketList = obj.d;
                                	 var rec = [];
                                	 var basket = basketList[0];
                                	 var basketSts = basket['45'];
                                	 
                                	 if(basketSts == '0'){
                                    	 var basketObj = new Object();
                                		 basketObj.id = basket['44'];
                                    	 basketObj.name = basket['43'];
                                		 rec.push(basketObj);
                                    	 panel.cbBasket.store.add(rec);
                                         msgutil.info(languageFormat.getLanguage(32001, 'New basket \'[PARAM0]\' had been successfully created.', textToHtml(newBN)));
                                	 }else{
                                		 var errMsg = basket['46'];
                                         msgutil.info(errMsg);
                                	 }
                                 } else {
                                	 if (obj.e == -5002) {
                                		 msgutil.alert(languageFormat.getLanguage(32012, 'Basket \'[PARAM0]\' already exist.', textToHtml(newBN)));
                                	 }else{
                                		 msgutil.alert(obj.m);
                                	 }
                                 }
                             }
                         } catch (e) {
                             msgutil.alert(languageFormat.getLanguage(32003, 'We regret to inform that we are unable to create your new basket at this time. Kindly try again shortly.(e)'));
                         }
                     },
                     failure: function () {
                         msgutil.alert(languageFormat.getLanguage(32003, 'We regret to inform that we are unable to create your new basket at this time. Kindly try again shortly.(e)'));
                     }
                 });
             }
         });
    },
    openEditBasketPanel: function(){
    	var panel = this;
    	var buttonList = [];

    	buttonList.push({
    		itemId: 'btn_submitBasketEdit',
    		text: 'OK',
    		cls: 'fix_btn',
    		handler: function() {
    			var ls = editGrid.getSelection();
                var n = ls.length;
                var basketList = [];
                for (var i = 0; i < n; i++) {
                	var r = ls[i].data;
                	if(r.Change){
                		r.expDate = Ext.util.Format.date(r.expDate, "YmdHis.u");
                		basketList.push(r);
                	}		
                }
                var jsonRec = Ext.encode(basketList);
    			var url = addPath + 'tcplus/editbl';
    			var data = {
    					jsonRec: jsonRec
    			}
    			Ext.Ajax.request({
    				url: url,
    				params: data,
    				method: 'POST',
    				success: function (response) {
    					try {
    						var obj = Ext.decode(response.responseText);
    						if (obj != null) {
    							if (obj.s == true) {
    								var basketList = obj.d;
    								var sts = true;
    								for(var i=0; i<basketList.length; i++){
    									var basket = basketList[i];
        								var basketSts = basket['45'];
        								
        								if(basketSts != '0'){
        									sts = false;
        									break;
        								}
    								}
    								
    								if(sts){
    									msgutil.info(languageFormat.getLanguage(32009, 'Basket has been saved'));
        								panel.updateBasketList();
    								}else{
    									msgutil.info(languageFormat.getLanguage(32010, 'Basket info update might not be successful. Please check your basket info.'));
    								}
    								
    							} else {
    								if (obj.m != null)
    									msgutil.alert(obj.m);
    							}
    						}

    					} catch (e) {
    					}
    				},
    				failure: function (response) {
    				}
    			});
    			
    			panel.editBasketWin.close();
    			panel.editBasketWin = null;
    		}
    	});

    	buttonList.push({
    		text: languageFormat.getLanguage(10010, 'Cancel'),
    		cls: 'fix_btn',
    		handler: function() {
    			panel.editBasketWin.close();
    			panel.editBasketWin = null;
    		}
    	});
    	
    	var editWinCellPlugin = new Ext.grid.plugin.CellEditing({
            clicksToEdit: 1,
            listeners:{
				validateedit: function(editor, e){
					var rec = e.record.data;

					if(e.field == 'NewName'){
						var sm = e.grid.getSelectionModel();
						var selections = sm.store.getRange();

						for(var i=0;i<selections.length; i++){
							var data = selections[i].data;
							if(e.value.toUpperCase() == data.name.toUpperCase()){
								e.cancel = true;
							}
						}
						
						if(rec.name == e.value){
							e.cancel = true;
						}
					}

					if(!e.value){
						e.cancel = true;
					}
				},
            	edit: function(editor, e){
            		// commit the changes right after editing finished
            		e.grid.down('checkcolumn').disabled = false;
            	    e.record.commit();
            	}
            }
        });
        
    	var editGrid = Ext.create('Ext.grid.Panel', {
    		plugins: [editWinCellPlugin],
    		store: {
    			fields: ['id', 'name', 'expDate', 'Change', 'Remove']
    		},
    		viewConfig: {
    			stripeRows: true,
    			trackOver: true
    		},
    		enableColumnMove: false,
    		cls: 'wrapgrid', // enable multiline in a row
    		forceFit: true,
    		frame: false,
    		columns: [
    		          {
    		        	  xtype: 'checkcolumn',
    		        	  text: languageFormat.getLanguage(21604, 'Change'),
    		        	  dataIndex: 'Change',
    		        	  disabled: true,
    		        	  width: 50
    		          },
    		          {text: languageFormat.getLanguage(21605, "CurrentName"), dataIndex: 'name', width: 125, sortable: true, menuDisabled: true, editable: false, align:'center'},
    		          {
    		        	  text: languageFormat.getLanguage(21606, "NewName"), 
    		        	  dataIndex: 'NewName', 
    		        	  width: 125, 
    		        	  sortable: false, 
    		        	  menuDisabled: true,
    		        	  editor:{
    		        		  xtype: 'textfield',
    		        		  allowBlank: true,
    		        		  enforceMaxLength: true,
    		        		  maxLength: 20,
    		        		  maskRe: /^[0-9a-zA-Z \-_]+$/
    		        	  }
    		           },
    		          {
    		        	  	xtype: 'datecolumn',
    		        	  	text: languageFormat.getLanguage(21607, 'Expiry Date'),
		        			dataIndex: 'expDate',
		        			sortable: false,
		        			menuDisabled: true,
		        			width: 135,  
		        			align: 'center',
		        			editor: {
		                        xtype: 'datefield',
		                        format: 'd/m/y',
		                        minValue: new Date(),
		                        maxValue: panel.maxDate
		                    },
		        			renderer: function (value, meta, record) {
		        				if(!value || value == ''){
		        					//value = new Date();
		        					value = Ext.util.Format.date(new Date(), 'd/m/Y');    
		        				}else{
		        					var dateObj = Ext.Date.parse(value, "YmdHis.u");
			        				if(dateObj){
			        					value = dateObj;
			        				}	
		        					
		        					value = Ext.util.Format.date(value, 'd/m/Y');   
		        				}
		        				return value;
		        			}
    		          },
    		          {
    		              xtype: 'actioncolumn',
    		              text: languageFormat.getLanguage(21602, 'Remove'),
    		              width: 50,
    		              align: 'center',
    		              menuDisabled: true,
    		              dataIndex: 'Remove',
    		              items: [
    		                  {
    		                      iconCls: 'icon-basket-close',
    		                      tooltip: languageFormat.getLanguage(32004, 'Remove from Basket List'),
    		                      handler: function(view, rowIndex, colIndex, item, e, record) {
    		                    	  panel.deleteBasketList(record);
    		                    	  panel.editBasketWin.close();
    		                    	  panel.editBasketWin = null;
    		                      }
    		                  }
    		              ]
    		          }
    		          ],
    		          buttons: buttonList
    	});
    	
    	//var records = panel.basketListRecords;
    	//editGrid.store.loadData(records);
    	
    	if (!panel.editBasketWin) {
            panel.editBasketWin = msgutil.popup({
                title: languageFormat.getLanguage(21608, "Edit Basket"),
                width: 500,
                height: 250,
                plain: true,
                layout: 'fit',
                autoScroll: true,
                resizable: true,
                closeAction: 'destroy',
                items: [editGrid],
                listeners:{
                	close: function(){
                		panel.editBasketWin = null;
                	},
                	show: function(){
                		var url = addPath + 'tcplus/getAllBasket';
                        Ext.Ajax.request({
                            url: url,
                            method: 'POST',
                            success: function (response) {
                                try {
                                    var obj = Ext.decode(response.responseText);
                                    if (obj != null) {
                                        if (obj.s == true) {
                                            var basketList = obj.d;
                                            panel.basketListRecords.length = 0;
                                            for(var i=0; i<basketList.length; i++){
                                            	var basket = basketList[i];
                                            	var basketObj = new Object();
                                            	basketObj.id = basket['44'];
                                            	basketObj.name = basket['43'];
                                            	basketObj.expDate = basket['47'];
                                            	
                                            	panel.basketListRecords.push(basketObj);
                                            }
                                            editGrid.store.loadData(panel.basketListRecords);
                                        } else {
                                            msgutil.alert(obj.m);
                                        }
                                    }
                                } catch (e) {
                                	console.log('fail to get basketlist --> ' + e);
                                }
                            },
                            failure: function () {
                                console.log('fail to get basketlist');
                            }
                        });
                	}
                }
            });
        }else{
        	panel.editBasketWin.show();
        }
    },
    deleteBasketList: function(record){
    	var panel = this;
    	var basketName = record.data.name;
    	msgutil.confirm(languageFormat.getLanguage(32005, 'Are you sure you want to remove [[PARAM0]] from your basket list?', basketName), function(btn) {
            if (btn == 'yes') {
            	var basketID = record.data.id;
                var url = addPath + 'tcplus/rembl?b=' + basketID;
                Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    success: function(response) {
                        try {
                            var obj = Ext.decode(response.responseText);
                            if (obj != null) {
                            	if (obj.s == true) {
                            		var basketList = obj.d;
                            		var basket = basketList[0];
                            		var basketSts = basket['45'];

                            		if(basketSts == '0'){
                                            msgutil.info(languageFormat.getLanguage(30603, 'Removed successfully'));
                                            panel.updateBasketList();
                                            //move to default basket after remove it
                                            panel.setLoading(true);
                                            panel.cbBasket.setValue(languageFormat.getLanguage(21609, 'Default Basket'));
                                            var filterBasketOpt = 'default';
                                            panel.filterBasketOpt = filterBasketOpt;
                                            panel.getBasketItems(filterBasketOpt);
                                            panel.down('#topToolbar').down('#btnSaveBasket').disable();
                                            panel.setLoading(false);
                                        } else {
                            			var errMsg = basket['46'];
                            			msgutil.info(errMsg);
                            		}
                                } else {
                                    if (obj.m) {
                                        msgutil.alert(obj.m);
                                    } else {
                                        msgutil.alert(languageFormat.getLanguage(32006, 'Failed to remove basket.'));
                                    }
                                }
                            }
                        } catch (e) {
                            msgutil.alert(languageFormat.getLanguage(32006, 'Failed to remove basket.'));
                        }
                    },
                    failure: function() {
                        msgutil.alert(languageFormat.getLanguage(32006, 'Failed to remove basket.'));
                    }
                });
            }
        });
    },
    saveBasketList: function(){
    	var panel = this;
    	var basketId = panel.cbBasket.getValue();
    	var sm = basketOrderPanel.getStore().data;
    	var ls = sm.items;
    	var n = ls.length;
    	var basketList = [];
    	var recordList = '';
    	for (var i = 0; i < n; i++) {
    		var r = ls[i].data;
    		//var record = JSON.stringify(r);
    		//recordList += record;
    		basketList.push(r);
//    		if(i != (n-1)){
//    			recordList += '^';
//    		}
    	}
    	//basketList = basketList.join('^');
    	var jsonRec = Ext.encode(basketList);
    	var data = {
    			jsonRec : jsonRec
    	}
    	var url = addPath + 'tcplus/saveBasketItems?b=' + basketId;
    	Ext.Ajax.request({
    		url: url,
    		params: data,
    		method: 'POST',
    		success: function (response) {
    			try {
    				var obj = Ext.decode(response.responseText);
    				if (obj != null) {
    					if (obj.s == true) {
    						var dataObj = obj.d;
    						var rec = dataObj[0];
    						var sts = rec['45'];
    						if(sts == '0'){
    						    basketOrderPanel.isAddBasket = false;
    							msgutil.info(languageFormat.getLanguage(32009, 'Basket has been saved'));
    						}else{
    							var errMsg = rec['46'];
    							msgutil.alert(errMsg);
    						}
    					} else {
    						msgutil.alert(obj.m);
    					}
    				}
    			} catch (e) {
    				console.log('fail to save basket items --> ' + e);
    			}
    		},
    		failure: function () {
    			console.log('fail to save basket items');
    		}
    	});
    },
    updateBasketList: function(){
    	var panel = this;
    	panel.basketListRecords.length = 0;
    	var defaultBasket = new Object();
    	defaultBasket.id = 'default';		
    	defaultBasket.name = languageFormat.getLanguage(21609, 'Default Basket');
    	
    	panel.basketListRecords.push(defaultBasket)
    	var url = addPath + 'tcplus/getAllBasket';
        Ext.Ajax.request({
            url: url,
            method: 'POST',
            success: function (response) {
                try {
                    var obj = Ext.decode(response.responseText);
                    if (obj != null) {
                        if (obj.s == true) {
                            var basketList = obj.d;
                            for(var i=0; i<basketList.length; i++){
                            	var basket = basketList[i];
                            	var basketObj = new Object();
                            	basketObj.id = basket['44'];
                            	basketObj.name = basket['43'];
                            	basketObj.expDate = basket['47'];
                            	
                            	panel.basketListRecords.push(basketObj);
                            }
                        } else {
                            msgutil.alert(obj.m);
                        }
                    }
                } catch (e) {
                	console.log('fail to get basketlist --> ' + e);
                }
            },
            callback: function(){
            	panel.cbBasket.store.loadData(panel.basketListRecords);
            	var id = panel.cbBasket.getValue();
            	panel.cbBasket.setValue(id);
                
                if (panel.isFirstTime) {
                    helper.autoFitColumns(panel);
                    panel.isFirstTime = false;
                }
                
                if (N2N_CONFIG.activeSub) {
                    panel.firstLoad = false;
                }
            },
            failure: function () {
                console.log('fail to get basketlist');
            }
        });
    },
    getBasketItems: function(basketId, isRefresh){
    	var panel = this;
    	panel.store.removeAll();
    	if(basketId == 'default' && !isRefresh){
    		var basket = localStorage.getItem(loginId + '_BasketList');
            if(basket){
            	var basketList = basket.split('|');
            	for(var i=0; i<basketList.length; i++){
            		var basketRec = JSON.parse(basketList[i]);
                	panel.store.add(basketRec);
                	panel.getView().refresh();
            	}
            }
    	}else{
    		panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
    		var url = addPath + 'tcplus/getBasketItems?b=' + basketId;
        	Ext.Ajax.request({
        		url: url,
        		method: 'POST',
        		success: function (response) {
        			try {
                        panel.setLoading(false);
                        var obj = Ext.decode(response.responseText);
                        if (obj != null) {
                            if (obj.s == true) {
                                var dataObj = obj.d;
                                var rec = dataObj[0];
                                //fix for empty data, the grid will show empty message anyway
                                if (rec) {
                                    var basket = rec['48'];
                                    var basketArr = basket.split('^');
                                    for (var i = 0; i < basketArr.length; i++) {
                                        var basketRec = JSON.parse(basketArr[i]);
                                        panel.store.add(basketRec);
                                        panel.getView().refresh();
                                        basketOrderPanel.isAddBasket = false;
                                    }
                                }
                            } else {
                                msgutil.alert(obj.m);
                            }
                        }
                    } catch (e) {
                        panel.setLoading(false);
                        console.log('fail to get basket items --> ' + e);
                    }
                },
                failure: function () {
                    panel.setLoading(false);
                    console.log('fail to get basket items');
                }
            });
    	}
    },
    searchAccount: function (searchValue) {
        var panel = this;
        try {
        	searchValue = searchValue.toLowerCase();
            panel.cbAccount.doQuery(searchValue, true);
        } catch (e) {
            console.log('[Search Account] Exception ---> ' + e);
            panel.setLoading(false);
        }
    },
    updateColWidthCache: function(column, newWidth) {
        helper.updateColWidthCache(this, this.cookieKey, column, newWidth);
    },
    runSearchAccount: function(){
    	var panel = this;
    	
    	if (panel.getAccountValue().trim() == '') {
            panel.cbAccount.setValue('');
            msgutil.alert(languageFormat.getLanguage(10045, 'Please key in your search text.'), function () {
                panel.cbAccount.focus();
            });
        } else if(panel.getAccountValue().trim().length < N2N_CONFIG.constDRMinChars){
        	msgutil.alert(languageFormat.getLanguage(10051, 'The minimum value for this field is [PARAM0]', N2N_CONFIG.constDRMinChars));
        } else {
            panel.searchAccount(panel.getAccountValue());
        }
     },
    switchRefresh: function(silent) {
        var panel = this;

        helper.runBuffer('boFitScreen');
    },
    runFitScreen: function() {
        var panel = this;

        if (!helper.inView(panel)) {
            helper.addBufferedRun('boFitScreen', function() {
                helper.autoFitColumns(panel);
            });
        } else {
            helper.autoFitColumns(panel);
        }
    }
//     },
     
//     //Blinking label, kept in comment for future use
//    animate: function (target, opacityFrom, opacityTo) {
//        var anim = Ext.create('Ext.fx.Anim', {
//            target: target,
//            duration: 1000,
//            from: {
//                opacity: opacityFrom
//            },
//            to: {
//                opacity: opacityTo
//            }
//        });
//        anim.on("afteranimate", function () {
//            if (opacityFrom == 1) {
//                animate(target, 0, 1);
//            } else {
//                animate(target, 1, 0);
//            }
//
//        }, this, {
//            single: true
//        });
//    }     
//     
//    //Save icon button blinking section
//    callImageBlink: function (btnId) { //v1.3.33.5
//        var panel = this;
//        var btn = Ext.getCmp(btnId); //v1.3.33.27
//        if (btn) {
//            if (btnId == 'saveSetting_Quote') {
//                if (panel.isImgBlink == false) {
//                    btn.show();
////				panel.tooltip.show();
//                    panel.isImgBlink = true;
//                    panel.callImg(btn);
//                }
//            } else {
//                if (panel.dynamicWin && !panel.dynamicWin.isHidden()) {
//                    panel.dlGrid.store.loadData(global_DynamicLimitList);
//                    panel.dlGrid.store.sort('datetime', 'DESC');
//                } else {
//                    if (panel.isDLUpdated == false) {
//                        btn.show();
//                        panel.isDLUpdated = true;
//                        panel.callImg(btn);
//                    }
//                }
//            }
//        }
//    },
//    callImg: function (btn) { //v1.3.33.5
//        var panel = this;
//        var t = 1000;
//        var hidden = true;
//
//        if (btn.iconCls == 'icon-dynamiclimit-off') {
//            hidden = false;
//            t = 1000;
//        }
//
//        if (btn.id == 'saveSetting_Quote') {
//            panel.imgBlinkTime = setTimeout(function () {
//                if (panel.isImgBlink == true) {
//                    panel.imgBlink(hidden, btn);
//                } else {
//                    btn.hide();
//                }
//            }, t);
//        } else {
//            panel.dlImgBlinkTime = setTimeout(function () {
//                if (panel.isDLUpdated == true) {
//                    panel.imgBlink(hidden, btn);
//                } else {
//                    btn.hide();
//                }
//            }, t);
//        }
//    },
//    imgBlink: function (hidden, btn) {
//        var panel = this;
//
//        if (hidden == true) {
//            if (btn.id == 'saveSetting_Quote') {
//            } else {
//                btn.setIconCls('icon-dynamiclimit-off');
//            }
//        } else {
//            if (btn.id == 'saveSetting_Quote') {
//            } else {
//                btn.setIconCls('icon-dynamiclimit');
//            }
//        }
//        panel.callImg(btn);
//    }
});
