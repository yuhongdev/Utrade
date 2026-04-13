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
 * setTotMtVal
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


Ext.define('TCPlus.view.orderbook.MutualFundOrderStatus', {
    extend: 'TCPlus.view.orderbook.OrderBookBase',
    alias: 'widget.mforderstatus',
    accNo: '',
    filterOpt: '0',
    stkcodes: null,
    sort: 'tktno',
    columnmap: null,
    orderno: null,
    orders: null,
    accList: null,
    accs: null,
    cbAccount: null,
    cbfilterOpt: null,
    cbfilterPaymentCode: null,
    tbSearchAccount: null,
    searchAccountBtn: null,
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
    emptyText: languageFormat.getLanguage(30405, 'Order Book is empty'),
    searching: false,
    accBalReqId: null,
    ordStsReqId: null,
    filterPaymentCodeOpt: '',
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
    slcomp: "mfos",
    pinInfo: {
        savePin: false,
        lastPin: ''
    },
    ordStsLastUptTime: '',
    ordPriceDecimal: '',
    stopLimitDecimal: '',
    avgPriceDecimal: '',
    screenType: 'main',
    compRef: {},
    mappedCode: '03',
    mappedSymbol: '04',
    _idPrefix: 'mfOrdSta',
    type: 'mfos',
    savingComp: true,
    isFirstTime: true,
    initComponent: function () {
//        tLog('||| create orderstatus ..');
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
            panel.avgPriceDecimal = decimalList[2];
        }

        panel.recordMapping = Ext.create("TCPlus.model.OrderStatus").fields.items;

        panel.procColumnWidth(); //v1.3.33.27

        // gets amalgamation status
           var amalState = jsutil.toBoolean(userPreference.get('amal', N2N_CONFIG.ordBookAmalStatus));

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
        if (pagingMode) {
            accStore = new Ext.ux.data.PagingStore({
                fields: ['accno', 'name'],
                data: this.accList,
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
        }

        panel.accNo = (panel.accList.length > 0 ? panel.accList[0][0] : '');
        panel.accNo = (panel.accNo).split(global_AccountSeparator)[0].trim();
//		var defAccNo = (panel.accList.length > 0 ? panel.accList[0][0] : '');
//		this.accNo = defAccNo;

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

        this.cbAccount = new Ext.form.ComboBox({
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
            pageSize: pagingMode ? 5 : (!isDealerRemisier ? 0 : N2N_CONFIG.constDRPagingSize),
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
                    var accno = this.value;
                    if (accno != panel.accNo)
                        panel.setAccBal('-');

                    panel.accNo = (this.value).split(global_AccountSeparator)[0].trim();
                    if (panel.accNo.length > 0) {
                        panel.branchCode = (this.value).split(global_AccountSeparator)[1].trim();
                    }

                    panel.setOrdStsLastUptTime('');

                    if (isDealerRemisier) {
                        panel.search();
                    } else {
                        //panel.search(true);
                        panel.localSearch();
                    }
                    
                    panel.callAccBal(panel.accNo, panel.branchCode);
                },
                specialkey: function(thisCb, e) {
                	if (e.getKey() == e.ENTER) {
                		panel.runSearchAccount();
                	}
                } 
            }
        });
        var filterOptList = [
            ['0', languageFormat.getLanguage(20196, 'All Order')],
            ['1', languageFormat.getLanguage(20068, 'Active')],
            ['4', languageFormat.getLanguage(10104, 'Open')],
            ['2', languageFormat.getLanguage(20197, 'Filled')],
            ['3', languageFormat.getLanguage(20198, 'Inactive')]
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
            value: Ext.isEmpty(this.filterOpt) ? '0' : this.filterOpt,
            listeners: {
                select: function () {
                    var filterOpt = this.value;
                    panel.filterOpt = filterOpt;
                    panel.setOrdStsLastUptTime('');
                    //panel.search(true);
                    panel.localSearch();
                }
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
                if (pc && orderbookExcludePayment.indexOf(pc[0]) === -1) {
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

        this.cbfilterPaymentCode = new Ext.form.field.ComboBox({
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
                select: function () {
                    var filterPaymentCodeOpt = this.value;
                    panel.filterPaymentCodeOpt = filterPaymentCodeOpt;
                    //panel.search(true);
                    panel.localSearch();
                }
            }
        });

        panel.feedExchangeList = [];

        var xtype = 'button';

        var btnRefreshConf = {
            text: languageFormat.getLanguage(10008, 'Refresh'),
            tooltip: languageFormat.getLanguage(10008, 'Refresh'),
            xtype: xtype,
            iconCls: 'icon-reset',
            handler: function () {
                panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
                panel.search(true);
                // preserves current selection when refresh
                // panel.getSelectionModel().select(0);
            }
        };

        var btnDetailsConf = {
            id: 'mfos_btnDetail',
            text: languageFormat.getLanguage(20199, 'View Details'),
            xtype: xtype,
            iconCls: 'icon-detail',
            hidden: !isMobile,
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

                if (!panel.canTrade({tktno: r.TktNo, ordno: r.OrdNo, ordsts: r.Sts}))
                    return '<div> &#160; </div>';

                else
                    return '<div class="x-grid-row-checker">&#160;</div>';

            },
            selectAll: function () {

                var ridx = 0;
                var store = panel.getStore();
                var sm = panel.getSelectionModel();
                //sm.clearSelections();                                

                /*
                while (typeof (store.getAt(ridx)) != 'undefined' && store.getAt(ridx) != null) {
                    var rec = store.getAt(ridx).data;

                    if (!panel.canTrade({tktno: rec.TktNo, ordno: rec.OrdNo, ordsts: rec.Sts}))
                        sm.deselect(ridx, true);

                    else
                        sm.select(ridx, true);

                    ++ridx;

                }
                */
                
                var selections = panel.store.getRange();
                var len = selections.length;

                for (var i=0; i < len; i++) {
                	var rec = selections[i].data;
                	if (!panel.canTrade({tktno: rec.TktNo, ordno: rec.OrdNo, ordsts: rec.Sts}))
                		sm.deselect(selections[i], true);

                	else
                		sm.select(selections[i], true);
                }

                panel.getView().getHeaderAtIndex(0).addCls('x-grid-hd-checker-on'); //panel.columns[0].addCls('x-grid-hd-checker-on');
            }
        });

        var store = null;
        if (pagingMode) {
            store = new Ext.ux.data.PagingStore({
                model: "TCPlus.model.OrderStatus",
                sorters: [{
                        property: "OrdDate",
                        direction: 'DESC'
                    }, {
                        property: "OrdTime",
                        direction: 'DESC'
                    }
                ],
                lastOptions: {params: {start: 0, limit: 10}}
            });
        } else {
            var storeObj = {
                model: "TCPlus.model.OrderStatus",
                sortOnLoad: true,
                sorters: [
                    {
                        property: "OrdDate",
                        direction: 'DESC'
                    },
                    {
                        property: "OrdTime",
                        direction: 'DESC'
                    }
                ]
            };
            if (N2N_CONFIG.ordBookAmal) {
                storeObj.groupField = 'groupKey';
            }
            store = new Ext.data.Store(storeObj);
        }

        // sort it by OrdDate Desc, and OrdTime Desc
        // latest will be at the top
//        try {
//            store.sort([
//                {field: 'OrdDate', direction: 'DESC'},
//                {field: 'OrdTime', direction: 'DESC'}
//            ], 'ASC');
//        }
//
//        catch (ex) {
//            console.log('[orderStatus][constructor][inner] Exception ---> ' + ex);
//        }

        // add paging buttons
        var hidePagingBtns = (pagingMode == true) ? false : true;
        var tbPrev = {
            id: 'mfos_prev',
            xtype: xtype,
            text: languageFormat.getLanguage(20058 ,'Prev'),
            hidden: hidePagingBtns,
            listeners: {
                click: function () {
                    panel.previousPage();
                }
            }
        };

        var tbNext = {
            id: 'mfos_next',
            xtype: xtype,
            text: languageFormat.getLanguage(10015,'Next'),
            hidden: hidePagingBtns,
            listeners: {
                click: function () {
                    panel.nextPage();
                }
            }
        };

        this.paging = new Ext.PagingToolbar({
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll,
            height: 30,
            store: store,
            displayInfo: false,
            pageSize: 10,
            listeners: {
                afterrender: function (c) {
                    for (var i = 0; i < 11; i++) {
                        var itm = c.items.items[i];
                        itm.hide();
                    }
                },
                change: function (paging, pagedata) {
                    var tbar = panel.down("#topToolbar");
                    if (pagedata.total > 0) {
//						// call Replace
//if (touchMode) {
//	panel.stkcodes = [];
//var i;
//for(i=0;i<panel.store.getCount();i++) {
//						var rec = panel.store.getAt(i);
//						if (rec.data['StkCode'])
//						panel.stkcodes.push(rec.data['StkCode']);
//						}
//						conn.updateStkCodes();
//						conn.updateFieldList();
//						conn.subscribeFeed();
//						}

                        var page = pagedata.activePage;
                        var lastpage = pagedata.pages;

                        if (pagedata.total <= paging.pageSize) {
                            //disable both
                            tbar.getComponent('mfos_prev').disable();
                            tbar.getComponent('mfos_next').disable();
                        } else if (page == 1) {
                            //disable prev
                            tbar.getComponent('mfos_prev').disable();
                            tbar.getComponent('mfos_next').enable();
                        } else if (page == lastpage) {
                            //disable next
                            tbar.getComponent('mfos_prev').enable();
                            tbar.getComponent('mfos_next').disable();
                        } else {
                            //disable none
                            tbar.getComponent('mfos_prev').enable();
                            tbar.getComponent('mfos_next').enable();
                        }
                        tbar.doLayout();
                        panel.page = page;
                    } else {
                        tbar.getComponent('mfos_prev').disable();
                        tbar.getComponent('mfos_next').disable();
                    }

                    panel.getSelectionModel().select(0);
                }
            },
            items: [
            ]
        });

        panel.compRef.totalMktVal = new Ext.form.Label({
            id: 'mfordSts_totMtVal',
            text: '-',
            style: 'white-space:nowrap'
        });
        panel.compRef.totalOrdVal = new Ext.form.Label({
            id: 'mfordSts_totOrdVal',
            text: '-',
            style: 'white-space:nowrap'
        });
        panel.compRef.topBar = Ext.create('Ext.toolbar.Toolbar', {
            itemId: 'topToolbar',
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll,
            //height: 30,
            items: [
                this.cbAccount,
                //panel.tbSearchAccount,
                panel.searchAccountBtn,
                this.cbfilterOpt,
                this.cbfilterPaymentCode,
                //'-',

                //					     			   new Ext.BoxComponent({
                //					     			   autoEl: {
                //					     			   tag: 'img',
                //					     			   src: 'images/summary/ScoreBoardVal.gif'
                //					     			   }
                //					     			   }),'-',
                //					     			   new Ext.form.Label({
                //					     			   //style: 'font-weight:bold',
                //					     			   text: 'Bal.:'
                //					     			   }), ' ',//'-',
                //					     			   new Ext.form.Label({
                //					     			   id: 'mfordSts_AccBal',
                //					     			   text: '-'
                //					     			   }), 
                this.btnDetails,
                new Ext.Button({
                    text: languageFormat.getLanguage(10004, 'Export CSV'),
                    tooltip: languageFormat.getLanguage(10004, 'Export CSV'),
                    hidden: !isDesktop,
                    iconCls: 'icon-export',
                    listeners: {
                        click: function () {
                            // exportCSV() from main.js
                            //					     						   exportCSV(panel.getColumnModel(), panel.getStore());

                            var optColumn = {};
                            optColumn[ 'OrdDate' ] = ExportFile.TYPE_DATE;
                            optColumn[ 'ExpDate' ] = ExportFile.TYPE_DATE;

                            ExportFile.initial(ExportFile.FILE_CSV, panel, optColumn);

                        }
                    }

                }),
                {
                    xtype: 'button',
                    enableToggle: true,
                    iconCls: 'icon-amalgamate',
                    text: languageFormat.getLanguage(20861, 'Amalgamate'),
                    hidden: !N2N_CONFIG.ordBookAmal,
                    pressed: N2N_CONFIG.ordBookAmal && amalState,
                    tooltip: N2N_CONFIG.ordBookAmal && amalState ? languageFormat.getLanguage(30412, 'Turn off amalgamation') : languageFormat.getLanguage(30411, 'Turn on amalgamation'),
                    toggleHandler: function (thisBtn, state) {
                        // toggle amalgamation
                        if (!panel.amalFeature) {
                            var pview = helper.getGridView(panel);
                            if (pview) {
                                panel.amalFeature = pview.getFeature('mforderGrouping');
                            }
                        }

                        if (state) {
                            if (panel.amalFeature)
                                panel.amalFeature.enable();
                            thisBtn.setTooltip(languageFormat.getLanguage(30412, 'Turn off amalgamation'));
                        } else {
                            if (panel.amalFeature)
                                panel.amalFeature.disable();
                            thisBtn.blur();
                            thisBtn.setTooltip(languageFormat.getLanguage(30411, 'Turn on amalgamation'));
                        }
                        // save state amalgamation status
                        userPreference.set('amal', jsutil.boolToStr(state, '1', '0'));
                        userPreference.save();
                    }
                },
                '->', tbPrev, tbNext,
                {
                    id: panel.id + 'saveSetting_OS', //v1.3.33.27
                    xtype: xtype,
                    hidden: true,
                    style: "margin-right:10px;",
                    handler: function () {
                        msgutil.confirm(languageFormat.getLanguage(30008, 'You have unsaved settings. Would you like to save your settings?'),
                                function (sResp) {
                                    if (sResp == "yes") {
                                        panel.isImgBlink = false;
                                        cookies.procCookie(panel.cookieKey, panel.tempWidth, cookieExpiryDays);
                                        panel.tempWidth = cookies.toDefaultColumn(panel, panel.cookieKey);
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
                    id: 'mfostb_btnColumns',
                    text: languageFormat.getLanguage(10005, 'Columns'),
                    tooltip: languageFormat.getLanguage(10005, 'Columns'),
                    xtype: xtype,
                    iconCls: 'icon-columnsetting',
                    hidden: global_showColSettingHeader == "TRUE" ? false : true,
                    handler: function () {
                        panel.showColumnSetting();
                    }
                }, this.btnRefresh]
        });
        panel.compRef.bottomBar = Ext.create('Ext.toolbar.Toolbar', {
            height: 30,
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll,
            width: "100%",
            hidden: !N2N_CONFIG.mfOrderbookSumBar,
            items: [
                {
                    xtype: 'label',
                    id: 'mflblpinw',
                    html: languageFormat.getLanguage(20847, 'Trading Pin'),
                    style: 'text-align: right;font-size: 8pt',
                    hidden: this.checkIsHidePin() //1.3.25.3
                },
                {
                    xtype: 'textfield',
                    id: 'mfpinw',
                    name: 'mfpinw',
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
                    boxLabel: '<div style="width: 16px; height: 16px" class="icon-save-pin"></div>',
                    hidden: this.checkIsHidePin(), //1.3.25.3
                    listeners: {
                        check: function (el, val) {
                            panel.pinInfo.savePin = val;
                        }
                    }
                },
                {
                    xtype: 'button',
                    itemId: 'btncancel',
                    text: languageFormat.getLanguage(10010, 'Cancel'),
                    autoWidth: false,
                    style: 'font-size: 8pt;',
                    handler: function () {
                        panel.processCancel();
                    }
                }, {
                    xtype: 'button',
                    itemId: 'btnrevise',
                    text: languageFormat.getLanguage(10009, 'Revise'),
                    autoWidth: false,
                    style: 'font-size: 8pt;',
//                    width: 60,
                    handler: function () {
                        panel.processRevise();
                    }
                },
                new Ext.form.Label({
                    text: languageFormat.getLanguage(30404, 'Please click "Refresh" for the latest order status'),
                    hidden: showOrderStatusLabel == "TRUE" ? false : true
                }),
                '->',
                new Ext.form.Label({
                    text: languageFormat.getLanguage(20190, 'Total Ordered Value') + ': ',
                    style: 'white-space:nowrap'
                }), '&nbsp;',
                panel.compRef.totalOrdVal,
                '&nbsp;',
                new Ext.form.Label({
                    text: languageFormat.getLanguage(20191, 'Total Matched Value') + ': ',
                    style: 'white-space:nowrap'
                }), '&nbsp;',
                panel.compRef.totalMktVal
                        , '&nbsp;'
            ]
        });

        var defaultConfig = {
            bufferedRenderer: N2N_CONFIG.gridBufferedRenderer,
            leadingBufferZone: N2N_CONFIG.gridLeadingBufferZone,
            trailingBufferZone: N2N_CONFIG.gridTrailingBufferZone,
            viewConfig: getGridViewConfig(panel),
            title: languageFormat.getLanguage(33720, 'Mutual Fund Order Book'),
            store: store,
            columns: {
            	defaults: {
            		tdCls:'display-render',
                    lockable: false // does not work in ExtJS 4.2, keep for its later fix
                },
            	items: colutils.getColumnModel(panel, '')
            },
            header: false,
            bodyStyle: 'padding:0px; margin:0px; font-size: 12pt; border: none;',
            width: '100%',
            height: 232,
            selModel: this.selModel,
            columnLines: false,
            border: false,
            enableColumnMove: N2N_CONFIG.gridColMove,
            enableColumnHide: N2N_CONFIG.gridColHide,
            trackMouseOver: false,
            tbar: panel.compRef.topBar,
            bbar: panel.compRef.bottomBar,
            keyEnabled: N2N_CONFIG.keyEnabled,
            listeners: {
                afterrender: function (p) {
                    panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));

                    //p.updateColumnMap();
                    //p.switchButtonStyle();
                    p.search();
                    //p.startRefreshTimer();

                    panel.tooltip = new Ext.ToolTip({//v1.3.33.27
                        target: panel.id + 'saveSetting_OS',
                        html: languageFormat.getLanguage(30009, 'Click this blinking icon to save the adjusted column width.'),
                        anchor: 'top',
                        showDelay: 0,
                        listeners: {
                            afterrender: function (thisComp) {
                                if (Ext.isIE) {
                                    thisComp.setWidth(thisComp.getWidth() + 2);
                                }
                            }
                        }
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
                cellcontextmenu: function (p, td, cellIndex, record, tr, ridx, e) {
                    if (!touchMode) {
                        if (outbound) {
                            panel.disableRightFunction(record.get('StkCode'));
                        }

                        panel.showContextMenu(p, ridx, e);
                    }
                },
                beforedestroy: function (p) {
                    if (p.contextMenu != null)
                        p.contextMenu.destroy();

                    panel.stkcodes = null;
                    //panel.stopRefreshTimer();
                    panel._stopRefreshTask();

                    Blinking.clearBlink(panel);

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
                },
                resize: function(){
                	bufferedResizeHandler(panel);
                        
                        if (!panel.isFirstTime) {
                            helper.autoFitColumns(panel);
                        }
                }
            }
        };

        if (N2N_CONFIG.ordBookAmal) {
            defaultConfig.requires = ['Ext.grid.feature.Grouping'];
            defaultConfig.features = [
                {
                    ftype: 'grouping',
                    id: 'mforderGrouping',
                    disabled: !amalState,
                    groupHeaderTpl: [
                        '{name:this.formatName} {children:this.formatChildren}',
                        {
                            formatName: function (name) {
                                if (name === '|INACTIVE|') {
                                    return languageFormat.getLanguage(20198, 'Inactive');
                                } else {
                                    return ''; // use the children format
                                }
                            },
                            formatChildren: function(children) {
                                var str = '';

                                if (children) {
                                    var recCount = children.length;

                                    if (recCount > 0) {
                                        if (children[0].get('groupKey') !== '|INACTIVE|') {
                                            var totalQty = 0;
                                            var totalOrderValue = 0;
                                            var totalMtQty = 0;
                                            var totalMtValue = 0;
                                            var totalCnQty = 0;
                                            var totalUnMtQty = 0;
                                            var totalExQty = 0;

                                            for (var i = 0; i < children.length; i++) {
                                                var child = children[i];
                                                var ordSt = child.get('Sts');
                                                if (ordSt && ordSt !== 'RJ' && ordSt !== 'CN' && ordSt !== 'DN' && ordSt !== 'SPS') {
                                                    totalQty += parseInt(child.get('OrdQty'));
                                                    totalOrderValue += parseFloat(child.get('OrderValue'));
                                                    totalMtQty += parseInt(child.get('MtQty'));
                                                    totalMtValue += parseFloat(child.get('MtVal'));
                                                    totalCnQty += parseInt(child.get('CnclQty'));
                                                    totalUnMtQty += parseInt(child.get('UnMtQty'));
                                                    totalExQty += parseInt(child.get('ExpQty'));
                                                }
                                            }

                                            // amalgamated price
                                            var amPrice = 0;
                                            if (totalQty != 0) {
                                                amPrice = totalOrderValue / totalQty;
                                            }

                                            var mtQtyStr = '';
                                            var mtValStr = '';
                                            var avgPrStr = '';
                                            // translate the buy/sell into the correct language
                                            var prevAct = child.get('PrevAct');
                                            var prevActStr = '';
                                            if (prevAct == 'Buy') {
                                                prevActStr = languageFormat.getLanguage(10001, 'Buy');
                                            } else if (prevAct == 'Sell') {
                                                prevActStr = languageFormat.getLanguage(10002, 'Sell');
                                            }

                                            var qtyStr = '';
                                            if (totalQty != 0) {
                                                qtyStr = '&nbsp; ' + languageFormat.getLanguage(10941, 'Qty') + ': ' + formatutils.formatNumber(totalQty);
                                            }

                                            var ordValStr = '';
                                            if (totalOrderValue != 0) {
                                                ordValStr = '&nbsp; ' + languageFormat.getLanguage(10943, 'OrderValue') + ': ' + panel.formatCurrency(panel.formatDecimal(totalOrderValue, 2));
                                            }

                                            var amPrcStr = '';
                                            if (amPrice != 0) {
                                                // the dec format will look through unrealized gl price dec -> order price dec -> default 3
                                                amPrcStr = '&nbsp; ' + languageFormat.getLanguage(10942, 'Price') + ': ' + amPrice.toFixed(decimalCtrl.prtf.unrealizedglprc || panel.ordPriceDecimal || 3);
                                            }

                                            if (totalMtQty != 0) {
                                                mtQtyStr = '&nbsp; ' + languageFormat.getLanguage(10909, 'MatchQty') + ': ' + formatutils.formatNumber(totalMtQty);
                                                mtValStr = '&nbsp; ' + languageFormat.getLanguage(10939, 'MatchValue') + ': ' + panel.formatCurrency(panel.formatDecimal(totalMtValue, 2));
                                                // average price
                                                var decOpt = 3;
                                                /*
                                                if (prevAct == 'Buy') { // buy
                                                    if (decimalCtrl.prtf.avgbuyprice) {
                                                        decOpt = decimalCtrl.prtf.avgbuyprice;
                                                    }
                                                } else { // sell
                                                    if (decimalCtrl.prtf.avgsellprice) {
                                                        decOpt = decimalCtrl.prtf.avgsellprice;
                                                    }
                                                }
                                                */
                                                if (panel.avgPriceDecimal.length > 0) {
                                                	decOpt = panel.avgPriceDecimal;
                                                }
                                                var avgPrice = totalMtValue / totalMtQty;
                                                avgPrStr = '&nbsp; ' + languageFormat.getLanguage(10910, 'AvgPrice') + ': ' + avgPrice.toFixed(decOpt);
                                            }

                                            var cnQtyStr = '';
                                            var unMtQtyStr = '';
                                            var exQtyStr = '';
                                            if (totalCnQty != 0) {
                                                cnQtyStr = '&nbsp; ' + languageFormat.getLanguage(10916, 'CancelQty') + ': ' + formatutils.formatNumber(totalCnQty);
                                            }
                                            if (totalUnMtQty != 0) {
                                                unMtQtyStr = '&nbsp; ' + languageFormat.getLanguage(10915, 'UnmatchQty') + ': ' + formatutils.formatNumber(totalUnMtQty);
                                            }
                                            if (totalExQty != 0) {
                                                exQtyStr = '&nbsp; ' + languageFormat.getLanguage(10940, 'ExpiredQty') + ': ' + formatutils.formatNumber(totalExQty);
                                            }

                                            str = [
                                                child.get('AccNo'), ' ',
                                                stockutil.getStockPart(child.get('StkCode')), '/', stockutil.getStockPart(child.get('StkName')), ' ',
                                                panel._getActionEl(prevActStr),
                                                ' (',
                                                recCount,
                                                ')',
                                                '&nbsp;&nbsp;&nbsp;',
                                                qtyStr,
                                                amPrcStr,
                                                ordValStr,
                                                mtQtyStr,
                                                avgPrStr,
                                                mtValStr,
                                                cnQtyStr,
                                                unMtQtyStr,
                                                exQtyStr
                                            ].join('');

                                        } else {
                                            str = '(' + recCount + ')';
                                        }
                                    }
                                }

                                return str;
                            }
                        }
                    ],
                    hideGroupedHeader: true,
                    startCollapsed: false,
                    enableGroupingMenu: false
                }
            ];
        }

        this.createContextMenu();

        Ext.apply(this, defaultConfig);

        this.callParent(arguments);
        
        //this.callAccBal();
    },
    switchRefresh: function (silent) {
        var panel = this;
        
        reactivateRow(panel);
        panel._getStockData(N2N_CONFIG.gridBufferedRenderer);
        Storage.generateSubscriptionByList(panel.stkcodes, panel);
        helper.runBuffer('osFitScreen');
    },
    show: function () {
        var panel = this;

        // show net cash limit

        var tbar = panel.compRef.topBar;

        tbar.insert(1, ' ');

        var i = (!isDealerRemisier ? 0 : 2);

        tbar.insert(3 + i, ' ');

        if (showPaymentCode == "TRUE") {
            tbar.insert(5 + i, ' ');
        }

        tbar.insert(7 + i, '-');

        if (showBalanceNNetCashLimit == "TRUE") {
            var lblBal = new Ext.form.Label({
                //style: 'font-weight:bold',
                text: languageFormat.getLanguage(20193, 'Bal.') + ':'
            }); //, ' ',//'-',
            panel.compRef.accBal = new Ext.form.Label({
                id: 'mfordSts_AccBal',
                text: '-'
            });

            tbar.insert(8 + i, lblBal);
            tbar.insert(9 + i, ' ');
            tbar.insert(10 + i, panel.compRef.accBal);

            var lblNetCash = new Ext.form.Label({
                //style: 'font-weight:bold',
                id: 'mfordSts_lbl_NetCashLimit',
                text: languageFormat.getLanguage(20194, 'Net Cash Limit') + ':'
            });

            panel.compRef.netCashLimit = new Ext.form.Label({
                id: 'mfordSts_NetCashLimit',
                text: '-'
            });

            tbar.insert(11 + i, '-');
            tbar.insert(12 + i, lblNetCash);
            tbar.insert(13 + i, ' ');
            tbar.insert(14 + i, panel.compRef.netCashLimit);
            tbar.insert(15 + i, '-');
        }
        tbar.doLayout();
    },
    callImageBlink: function () { //v1.3.33.27
        var panel = this;
        var btn = Ext.getCmp(panel.id + 'saveSetting_OS');
        if (panel.isImgBlink == false) {
            btn.show();
            panel.isImgBlink = true;
            panel.callImg(btn);
        }
    },
    callImg: function (btn) { //v1.3.33.27
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
    callAccBal: function (accno, branchCode) {
        var panel = this;
        try {
            var urlbuf = [];
            urlbuf.push(addPath + 'tcplus/atp/acc?');
            urlbuf.push('ExtComp=');
            urlbuf.push('OrderStatus_' + panel.getId());
            urlbuf.push('&s=');
            urlbuf.push(new Date().getTime());

            urlbuf.push('&ac=' + accno);

            if (branchCode.length > 0) {
                urlbuf.push('&bc=' + branchCode);
            }

            if (orderPad && orderPad.getPayment() == 'CUT') {
                urlbuf.push('&paymentCode=' + orderPad.getPayment());
                if (orderPad.getSettCurr().length > 0) {
                    urlbuf.push('&settCurr=' + orderPad.getSettCurr());
                } else {
                    urlbuf.push('&settCurr=' + orderPad.getDefSettCurr());
                }
            }

            var url = urlbuf.join('');

            if (panel.accBalReqId != null)
                Ext.Ajax.abort(panel.accBalReqId);

            panel.accBalReqId = Ext.Ajax.request({
                url: url,
                method: 'GET',
                success: function (response) {
                    var text = response.responseText;
                    var obj = null;
                    try {
                        if (text)
                            obj = Ext.decode(text);

                        if (obj != null) {
                            if (obj.s == true)
                                panel.updateAccBal(obj);
                        }
                    } catch (e) {
                        console.log('[orderStatus][callAccBal][inner] Exception ---> ' + e);
                    }
                    panel.accBalReqId = null;
                },
                failure: function (response) {
                    debug(response);
                    panel.accBalReqId = null;
                }
            });
        } catch (e) {
            console.log('[orderStatus][callAccBal] Exception ---> ' + e);
        }
    },
    search: function (background) {
        var panel = this;
        try {
            if (!isDealerRemisier || (isDealerRemisier && panel.accNo != '')) {
                if (background == null) {
                    panel.tktno = '';
                    panel.ordno = '';
                    panel.stkname = '';
                }

                if (!background) {
                    //panel.btnDetails.disable();
                    this.down('#topToolbar').down('#mfos_btnDetail').disable();
                    this.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
                    Blinking.clearBlink(panel);
                    panel.store.removeAll();
                } else {
//  				if (this.searching) return;
                }
                this.searching = true;

                var urlbuf = [];
                urlbuf.push(addPath + 'tcplus/atp/status?');
                urlbuf.push('ExtComp=');
                urlbuf.push('MfOrderStatus_orderStatusPanel'/* + panel.getId()*/);
//  			urlbuf.push('&s=');
//  			urlbuf.push(dwr.engine._scriptSessionId);

                if (this.accNo != '') {
                    urlbuf.push('&ac=');
                    urlbuf.push(this.accNo);
                }
                if (this.filterOpt != '0') {
                    urlbuf.push('&st=');
                    urlbuf.push(this.filterOpt);
                } else {
                    urlbuf.push('&st=');
                    urlbuf.push(0);
                }
            
                urlbuf.push('&exfilt=' + N2N_CONFIG.mfExchCode);
                if (panel.filterPaymentCodeOpt) {
                    urlbuf.push('&pcfilt=' + panel.filterPaymentCodeOpt);
                }

                urlbuf.push('&r=1');

                var accountName = (panel.cbAccount.getValue()).split(global_AccountSeparator);
                if (this.accNo != '') {
                    if (accountName.length > 0) {
                        urlbuf.push('&bc=' + accountName[accountName.length - 1].trim());
                    }
                }


                // TODO: temp disable it will effected the whole logic on backend (because when cancel / revise unable search the previous data)
                urlbuf.push('&lut=');
                urlbuf.push(this.ordStsLastUptTime);

                var url = urlbuf.join('');

                if (panel.ordStsReqId != null)
                    Ext.Ajax.abort(panel.ordStsReqId);

                panel.ordStsReqId = Ext.Ajax.request({
                    url: url,
                    method: 'GET',
                    success: function (response) {
                        //????????
                        //Why when update account balance, have to depend on whether orderpad got account no or not
//                        if (orderPad) {
//                            if (orderPad.getAccountNo().length > 0) {
//                                panel.callAccBal(orderPad.getAccountNo(), orderPad.branchCode);
//                            }
//                        }

                        var accountInfo = panel.cbAccount.getValue();
                        //If select account, then run below
                        //Otherwise, default is display fund from all account
                        //So will reset balance to 0
                        if (accountInfo) {
                            accountInfo = (panel.cbAccount.getValue()).split(global_AccountSeparator);
                            var accountNo = accountInfo[0];
                            var branchCode = accountInfo[1];
                            panel.callAccBal(accountNo, branchCode);
                        }
                        panel.showCancelPanel(panel.getSelectionModel(), 0, null);
                        var text = response.responseText;
                        var obj = null;

                        try {
                            obj = Ext.decode(text);
                        } catch (e) {
                            console.log('[orderStatus][search][inner] Exception ---> ' + e);
                        }

                        if (obj != null) {

                            if (!obj.s) {
                                var errorMessage = "";
                                if (obj.e != null) {
                                    errorMessage += obj.e;
                                }

                                if (obj.m != null) {
                                    errorMessage += " - " + msgutil.parseMsg(obj.m);
                                } else if (obj.msg != null) {
                                    errorMessage = msgutil.parseMsg(obj.msg);
                                }

                                if (errorMessage == "") {
                                    errorMessage = panel.emptyText;
                                }

                                if(obj.e != null && obj.e == 0){
                                	helper.setGridEmptyText(panel, panel.emptyText);
                                }else{
                                    helper.setGridEmptyText(panel, errorMessage);
                                }
                                //helper.setHtml(panel.getView(), '<div class="x-grid-empty">' + errorMessage + '</div>');
                                //panel.stopRefreshTimer();
                                panel.setLoading(false);
                                if (N2N_CONFIG.activeSub) {
                                    panel.firstLoad = false;
                                    Storage.refresh();
                                }
                                return;
                            } /*else {
                             panel.startRefreshTimer();
                             }*/


//  						if (panel.refreshTimer == null) {	// only start the timer if null
//  						panel.startRefreshTimer();
//  						}

                            //if (background) panel.store.removeAll();
                            panel.updateOrdSts(obj);
                            panel.updateOrdDetPanels(obj);
                            panel.updateSummary();
                            //   panel.localSearch();
                            panel.compRef.bottomBar.doLayout();
                            //if (!background) {
                            panel.setLoading(false);
                            //}

                            var datas = obj.os;
                            if (datas) {
                                var stkcodes;
                                if (panel.stkcodes)
                                    stkcodes = panel.stkcodes;
                                else
                                    stkcodes = [];

                                for (var i = 0; i < datas.length; i++) {
                                    var d = datas[i];
                                    var tempStkCode = formatutils.addDelaySuffix(d['sc']);
                                    var dExCode = panel.getExchangeType(d['sc']);
                                    if (N2N_CONFIG.mfExchCode == dExCode && !contains(stkcodes, tempStkCode)) {
                                        stkcodes.push(tempStkCode);
                                    }
                                }
                                panel.stkcodes = stkcodes;

                                panel._getStockData();
                                Storage.generateSubscriptionByList(panel.stkcodes, panel);
                            }
                        }

                    },
                    failure: function () {
                        panel.updateSummary();
                        panel.showCancelPanel(panel.getSelectionModel(), 0, null);
                    },
                    callback: function (opt, success, response) {
                        var obj = Ext.decode(response.responseText);
                        panel.searching = false;
                        panel.ordStsReqId = null;
                        if (obj && obj.s) {
                            panel.localSearch();
                        }
                        panel._setRefreshTask();
                    }
                });

            } else {
                panel.setLoading(false);
            }
        } catch (e) {
            console.log('[orderStatus][search] Exception ---> ' + e);
            panel._setRefreshTask();
        }
    },
    _setRefreshTask: function () {
        var panel = this;

        // clears previous task if any
        panel._stopRefreshTask();
        panel.intervalTimeOut = setTimeout(function () {
            panel.search(true);
        }, orderStsInterval);
    },
    _stopRefreshTask: function () {
        var panel = this;

        if (panel.intervalTimeOut) {
            clearTimeout(panel.intervalTimeOut);
            panel.intervalTimeOut = null;
        }
    },
    localSearch: function () {
        // Local filter  
        var panel = this;
        Blinking.clearBlink(panel);
        panel.getStore().filterBy(function (record, id) {
        	var blnFilterSenderCode = true;
            var blnFilterAccNo = true;
            var blnFilterSts = true;
            var blnFilterPaymentCode = true;
            var blnFilterEx = true;

            if(global_senderCode.toUpperCase() != record.get('ReqCC').toUpperCase()){
            	blnFilterSenderCode = false;
            }
            
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

            // filter by order status
            if (panel.filterOpt == 0) {
                // show all
            } else {
                if (panel.filterOpt == 1) {
                    // Active - Q,PFL,RP,PCN,PRP
                    if (record.get('Sts') == 'Q' || record.get('Sts') == 'PFL' || record.get('Sts') == 'RP' ||
                            record.get('Sts') == 'PCN' || record.get('Sts') == 'PRP') {
                        blnFilterSts = true;
                    } else {
                        blnFilterSts = false;
                    }
                } else if (panel.filterOpt == 2) {
                    // Filled - PFL,FL
                    if (record.get('Sts') == 'PFL' || (record.get('Sts') == 'EXP' && record.get('MtQty') > 0) || record.get('Sts') == 'FL') {
                        blnFilterSts = true;
                    } else {
                        blnFilterSts = false;
                    }
                } else if (panel.filterOpt == 3) {
                    // Inactive - DN,CN,RJ,SPS,EXP
                    if (record.get('Sts') == 'DN' || record.get('Sts') == 'CN' || record.get('Sts') == 'RJ' ||
                            record.get('Sts') == 'SPS' || record.get('Sts') == 'EXP') {
                        blnFilterSts = true;
                    } else {
                        blnFilterSts = false;
                    }
                } else if (panel.filterOpt == 4) {
                    // Open - PRL,PQ,Q,PFL,RP,PCN,PRP
                    if (record.get('Sts') == 'PRL' || record.get('Sts') == 'PQ' || record.get('Sts') == 'Q' ||
                            record.get('Sts') == 'PFL' || record.get('Sts') == 'RP' || record.get('Sts') == 'PCN' || record.get('Sts') == 'PRP') {
                        blnFilterSts = true;
                    } else {
                        blnFilterSts = false;
                    }
                }
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

            if (record.get('ExCode').toUpperCase().indexOf(tempExchangeCode) != -1) {
                blnFilterEx = true;
            } else {
                blnFilterEx = false;
            }
            return blnFilterSenderCode && blnFilterAccNo && blnFilterSts && blnFilterPaymentCode && blnFilterEx;
        });

        if (panel.getStore().getCount() == 0) {
            if (panel.filterOpt == 0 || panel.filterOpt == 4) {
                if (panel.accNo == '') {
                    panel.emptyResult = languageFormat.getLanguage(30406, 'Your order book is empty.');
                } else {
                    panel.emptyResult = languageFormat.getLanguage(30407, 'You do not have any order for this account.');
                }
            } else {
                if (panel.accNo == '') {
                    panel.emptyResult = languageFormat.getLanguage(30408, 'You do not have any order.');
                } else {
                    panel.emptyResult = languageFormat.getLanguage(30407, 'You do not have any order for this account.');
                }
            }

            //helper.setHtml(panel.getView(), '<div class="x-grid-empty">' + panel.emptyResult + '</div>');
            helper.setGridEmptyText(panel, panel.emptyResult);
        }
    },
    updateAccBal: function (obj) {
        var panel = this;
        try {
//			if (obj) accRet = obj;
//			else return;
            if (!obj || !obj.ai)
                return;

            var acc = obj.ai;
            var accBal = 0;
            var netCashLimit = 0;
            for (var i = 0; i < acc.length; i++) {
                var updAcc = acc[i];
                if (updAcc != null) {
                    if (panel.accNo && updAcc.ac == panel.accNo) {
                        //console.log(panel.accNo + ':balance found:' + accBal);
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
            panel.updateOrdPadBal(acc[0]);
        } catch (e) {
            console.log('[orderStatus][updateAccBal] Exception ---> ' + e);
        }
    },
    setAccBal: function (value) {
    	var panel = this;
        
        if (value != null && !isNaN(value)) {
            var obj = panel.compRef.accBal;
            if (obj != null) {
                helper.setHtml(obj, panel.currentCurrency + ' ' + panel.formatCurrency(value));
            }
        }
    },
    setNetCashLimit: function (value) {
    	var panel = this;
        
        if (value != null && !isNaN(value)) {
            var obj = panel.compRef.netCashLimit;
            if (obj != null) {
                helper.setHtml(obj, panel.currentCurrency + ' ' + panel.formatCurrency(value));
            }
        }
    },
    appendExchangelist: function (exCode) {
        var panel = this;
        if (!contains(panel.feedExchangeList, exCode)) {
            panel.feedExchangeList.push(exCode);
        }
    },
    //1.3.25.36 hide getExchangeList
//	getExchangeList: function(){ //1.3.25.34 get all exchange code 
//	var panel = this;
//	var accList = accRet.ai;

//	if (accList && accList.length > 0) {
//	for (i = 0; i < accList.length; i++) {
//	var acc = accList[i];

//	var tempExchangeList = [];
//	if (acc.spex != null) {
//	var temp = acc.spex.split(',');
//	for (var ii = 0; ii < temp.length; ii ++) {
//	tempExchangeList.push(panel.getExchangeType(temp[ii]));
//	}
//	}
//	tempExchangeList.push(acc.ex);     
//	}
//	}
//	return tempExchangeList;
//	}, 
    getViewExchangeList: function () { //1.3.25.36 get all view exchange
        var panel = this;
        var viewList = confViewEx;

        if (viewList != null) {
            var tempExchangeList = viewList.split(',');
        }
        return tempExchangeList;
    },
    updateSummary: function () {
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
                var amt = recData.Amt;
                var prevAct = recData.PrevAct;
                if (panel.convertCurrencyEnable && panel.currencyRateList != null) {	// convert to the currency value

                    var currencyRateList = panel.currencyRateList;
                    var n = currencyRateList.size;

                    //var recCurrency = recData.Currency;
                    var recCurrency = recData.TradeCurr;

                    for (var j = 0; j < n; j++) {
                        var inListCurrency = currencyRateList.d[j].currate[0];
                        if (recCurrency == panel.currentCurrency) {
                            // same currency no need convert
//							console.log("in same currecnt: " + recCurrency);
                            //IF MATCH STATUS 'F'
                            //Check status from here
                            //protected static String convOrderStatusCode(String ATPOrderStatusCode) {
                            if (recData.Sts == 'FL' && prevAct == 'Sell') {
                                if (!isNaN(amt)) {
                                    var val = parseFloat(amt);
                                    totMtVal += val;
                                }
                            }

                            break;
                        } else if (inListCurrency == recCurrency) {
                            // not same curreny and need convert
//							console.log("need convert");
                        	var recAction = recData.PrevAct;	// BUY or Sell
                            var buyRate = currencyRateList.d[j].currate[3];
                            var sellRate = currencyRateList.d[j].currate[4];
                            var denomiation = currencyRateList.d[j].currate[5];
                            var val = 0;
                            // convert
                            if (!isNaN(amt)) {
                            	if(recAction.toLowerCase() == "buy"){
                                    val = parseFloat(amt / denomiation * sellRate);
                            	}else{
                            		val = parseFloat(amt / denomiation * buyRate);
                            	}
//								console.log("[Market]mktVal: " + mktVal + " - val: " + val + " - denomiation: " + denomiation + " - buyRate: " + buyRate + " - recCurrency: " + recCurrency);
                                //IF MATCH STATUS 'F'
                                //Check status from here
                                //protected static String convOrderStatusCode(String ATPOrderStatusCode) {
                                if (recData.Sts == 'FL' && prevAct == 'Sell') {
                                    totMtVal += val;
                                }
                            }

                            break;
                        } else {
                            //console.log("[Not found!!]panel.currentCurrency: " + panel.currentCurrency + " - inListCurrency: " + inListCurrency + " - recCurrency: " + recCurrency);
                            // unable to find
                        }
                    }
                } else {
                    //IF MATCH STATUS 'F'
                    //Check status from here
                    //protected static String convOrderStatusCode(String ATPOrderStatusCode) {
                    if (recData.Sts == 'FL' && prevAct == 'Sell') {
                        if (!isNaN(amt)) {
                            var val = parseFloat(amt);
                            totMtVal += val;
                        }
                    }
                }
            }
            panel.totMtVal = totMtVal;
            panel.setTotMtVal(totMtVal);
        } catch (e) {
            console.log('[orderStatus][updateSummary] Exception ---> ' + e);
        }
    },
    setTotMtVal: function(v) {
        var panel = this;
        var fv = this.currentCurrency +  ' ' + panel.formatCurrency(panel.formatDecimal(v, 2));
        var rv = this.currentCurrency + ' ' +this.returnNumberFormat(v, 50);
        if (this.compRef.hasOwnProperty('totalMktVal')) {
            helper.setHtml(this.compRef.totalMktVal, '<span title="' + fv + '">' + rv + '</span>');
        }
    },
    formatAccBalDecimal: function (value) {
        if (isNaN(value))
            return null;

        var decimal = 2;
        return parseFloat(value).toFixed(decimal);
    },
    updateFeedRecord: function (dataObj) {
        var panel = this;
//        tLog('||| updateFeedRecord ' + dataObj) ;
        try {
            if (this.searching)
                return;

            var lastIndex, stockNameIndex, lacpIndex;
            var lastCol = panel.down("#" + panel._idPrefix + cmap_osLast);
            var stockNameCol = panel.down("#" + panel._idPrefix + cmap_osStkName);
            var lacpCol = panel.down("#" + panel._idPrefix + cmap_osLACP);
            if (lastCol) {
                lastIndex = lastCol.getIndex();
            }
            if (stockNameCol) {
                stockNameIndex = stockNameCol.getIndex();
            }
            if (lacpCol) {
                lacpIndex = lacpCol.getIndex();
            }

            var store = panel.store;
            var total = store.getCount();

            if (dataObj != null && total > 0) {
                for (var ii = 0; ii < total; ii++) {
                    var tempRecord = store.getAt(ii);

                    if (tempRecord == null) {
                        continue;
                    } else {
                        if (dataObj[fieldStkCode] && dataObj[fieldStkCode].indexOf(tempRecord.data.StkCode) == 0) { // to handle checking of both real and delay feed update

                            var nLacp = dataObj[fieldLacp];
                            if (nLacp != null && nLacp != tempRecord.data.LACP) {
                                tempRecord.data.LACP = nLacp;
                                var priceObj = formatutils.procPriceValue(nLacp);
                                var cssClass = " " + N2NCSS.FontString + " " + N2NCSS.FontUnChange;

                                N2NUtil.updateCell(panel, ii, lacpIndex, priceObj.value, cssClass);
                            }

                            var nLast = (isNaN(dataObj[fieldLast]) || dataObj[fieldLast] == 0) ? dataObj[fieldLacp] : dataObj[fieldLast];

                            if (nLast != null && nLast != tempRecord.data.Last && nLast > 0) {
                                var oldValue = tempRecord.data.Last;
                                tempRecord.data.Last = nLast;
                                //1.3.24.4 nLast = panel.formatDecimal(nLast);

                                if (lastIndex != -1) {
                                    if (nLast != oldValue && ii != -1) {

                                        var priceObj = formatutils.procPriceValue(nLast);

                                        var cssClass = " " + N2NCSS.FontString;
                                        if (!priceObj.validation) {
                                            cssClass += " " + N2NCSS.FontUnChange;
                                        } else {
                                            if (parseFloat(nLast) > parseFloat(tempRecord.data.LACP)) {
                                                cssClass += " " + N2NCSS.FontUp;
                                            } else if (parseFloat(nLast) < parseFloat(tempRecord.data.LACP)) {
                                                cssClass += " " + N2NCSS.FontDown;
                                            } else {
                                                cssClass += " " + N2NCSS.FontUnChange;
                                            }
                                        }

                                        N2NUtil.updateCell(panel, ii, lastIndex, priceObj.value, cssClass);

                                        if (!panel.columns[lastIndex].isHidden() && oldValue) {
                                            if (parseFloat(nLast) > parseFloat(oldValue)) {
                                                Blinking.setBlink(panel, ii, lastIndex, "up");
                                            } else if (parseFloat(nLast) < parseFloat(oldValue)) {
                                                Blinking.setBlink(panel, ii, lastIndex, "down");
                                            } else {
                                                Blinking.setBlink(panel, ii, lastIndex, "unchange");
                                            }
                                        }
                                    }
                                }
                            }

                            var lotsize = dataObj[fieldLotSize];
                            if (lotsize != null && lotsize != tempRecord.data.LotSize)
                                tempRecord.data.LotSize = lotsize;

                            /*
                             var currency = dataObj[fieldCurrency];
                             if (currency != null && currency != tempRecord.data.Currency)
                             tempRecord.data.Currency = currency;
                             */

                            var updateStatus = false;

                            var stockIndexCode = dataObj[fieldIndexCode];
                            if (stockIndexCode && stockIndexCode != tempRecord.data[fieldIndexCode]) {
                                tempRecord.data[fieldIndexCode] = stockIndexCode;
                                updateStatus = true;
                            }

                            if (dataObj[fieldStatus] != null) {
                                var stockStatusCode = dataObj[fieldStatus].charAt(1);
                                var oriRSSIValue = dataObj[fieldStatus].charAt(0);

                                if (stockStatusCode != null && stockStatusCode != tempRecord.data[fieldStkStatus]) {
                                    tempRecord.data[fieldStkStatus] = stockStatusCode;
                                    updateStatus = true;
                                }
                                if (oriRSSIValue != null && oriRSSIValue != tempRecord.data[fieldRSSIndicator]) {
                                    tempRecord.data[fieldRSSIndicator] = oriRSSIValue;
                                }
                            }

                            var stkStatusCode = dataObj[fieldStkStatus];
                            if (stkStatusCode && stkStatusCode != tempRecord.data[fieldStkStatus]) {
                                tempRecord.data[fieldStkStatus] = stkStatusCode;
                                updateStatus = true;
                            }

                            if (updateStatus && stockNameIndex != -1) {
                                var tempData = tempRecord.data.StkName;
                                var idx = tempData.lastIndexOf('.');
                                if (idx >= 0)
                                    tempData = tempData.substring(0, idx);

                                var cssClass = " " + N2NCSS.FontStockName;
                                var tempCss = StockColor.stockByOrderBook(tempData, tempRecord, panel);
                                if (tempCss == null) {
                                    cssClass += " " + N2NCSS.FontUnChange;
                                } else {
                                    cssClass += " " + tempCss.css;
                                }
                                N2NUtil.updateCell(panel, ii, stockNameIndex, tempData, cssClass);
                            }
                        }
                    }
                }

                if (!panel.suspendSummary) {
                    panel.updateSummary();
                }
            }
        } catch (e) {
            console.log('[orderStatus][updateFeedRecord] Exception ---> ' + e);
        }
    },
    _prevStkCodes: [],
    _getStockData: function () {
        var me = this;

        if (me.stkcodes && me.stkcodes.length > 0) {
            me.stkcodes.sort();

            if (me.stkcodes.join(',') !== me._prevStkCodes.join(',')) {
                me._prevStkCodes = me.stkcodes;
                me._callStockData(me.stkcodes);
            }

        }

    },
    _callStockData: function (stkList) {
        var me = this;

        conn.getStockList({
            list: stkList,
            f: [fieldStkCode, fieldLast, fieldLacp, fieldLotSize, fieldCurrency, fieldStatus, fieldIndexCode, fieldInstrument, fieldPrev],
            p: 0,
            c: stkList.length,
            skipMDColCheck: true,
            success: function (res) {
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
    },
    getOrderData: function (d, dExCode) {
        var panel = this;

//		var dateObj = null;
//		var dateValue = '';
//		var timeValue = '';
//		
//		if ( d != null ) {
//			if ( d.dt != null && d.tm != null ) {
//				if ( ( d.dt ).indexOf( '-' ) != -1 && ( d.tm ).indexOf( ':' ) != -1 ) {
//					var tempTime = ( d.tm ).split( ':' );
//					var tempDate = ( d.dt ).split( '-' );
//
//					dateObj = new Date( tempDate[0], ( tempDate[1] - 1 ), tempDate[2], tempTime[0], tempTime[1], tempTime[2] );
//				}
//				dateValue = d.dt;
//				timeValue = d.tm;
//			}
//		}
//		
//		if ( dateObj != null ) {
//			dateValue = dateObj.format( global_DateFormat );
//			timeValue = dateObj.format( global_TimeFormat );
//		}
        var o = {
            TktNo: d.tn,
            OrdNo: d.on,
            SubOrdNo: d.son,
            StkCode: d.sc,
            StkName: d.sy,
            AccNo: d.an,
            PrevAct: d.act,
            OrdTime: d.tm,
            OrdDate: d.dt,
            Validity: d.vd,
            Sts: d.st,
            Remark: d.rmk,
            OrdQty: d.oq,
            OrdPrc: d.op,
            MtQty: d.mq,
            MtPrc: d.mp,
            MtVal: d.mv,
            UnMtQty: d.uq,
            CnclQty: d.cq,
            ExpDate: d.ed,
            ExpQty: d.eq,
            Currency: d.cr,
            ExCode: dExCode,
            OrdType: d.ot,
            OrdSubType: d.ost,
            StsMsg: d.sts,
            MinQty: d.minq,
            DsQty: d.dq,
            StopLimit: d.sl,
            //				LastUpdTime	: d.lut,
            LastUpdateTime: d.lut,
            AccountName: d.accN,
            SettOpt: d.setO,
            OrderValue: d.ordv,
            LotSize: d.ls,
            TradeCurr: d.tc,
            OrderCond: d.ordercond,
            SeqNo: d.orderSeqNo,
            DateTime: d.orderDateTime,
            BCode: d.bc,
            BrokerCode: d.brkcode,
            TPType: d.tptype,
            TPDirection: d.tpdirection,
            CCode: d.cc,
            TradCond: d.tradcond,
            State: d.state,
            QtyTM: d.qtytm,
            ReqCC: d.reqcc,
            Amt: d.amt
        };

        var recordmapping = panel.recordMapping;

        for (var i = 0; i < recordmapping.length; i++) {
            var mappingObj = recordmapping[i];

            if (o[ mappingObj.mapping ] == null) {
                o[ mappingObj.mapping ] = '';
            }
        }

        return o;
    },
    updateOrdSts: function (obj) {
        var panel = this;
//        tLog('||| updateOrdSts ' + obj) ;
        var success = obj.s;
        //var cm = panel.getColumnModel();

        if (panel.cbfilterOpt != null) {
            panel.cbfilterOpt.setValue(panel.filterOpt);
        }

        if (success == true) {
            var datas = obj.os;
            var totData = datas.length;
            var store = this.store;
            var total = (pagingMode == true) ? store.getTotalCount() : store.getCount();

            if (totData < 1)
                return;

            var updDatas = [];
            if (total == 0) {
                // load data
                this.tempDatas = [];

                for (var i = 0; i < totData; i++) {
                    var d = datas[i];
  
                    d.amt = panel.formatDecimal(d.amt, 0); // remove decimal from amount
                    
                    d.ordv = panel.formatDecimal(d.ordv, 3); //1.3.25.20 set format of d.ordv

                    if (panel.ordPriceDecimal.length > 0) {
                        d.op = panel.formatDecimal(d.op, panel.ordPriceDecimal);
                    }

                    if (panel.stopLimitDecimal.length > 0) {
                        d.sl = panel.formatDecimal(d.sl, panel.stopLimitDecimal);
                    }
                    
                    if (panel.avgPriceDecimal.length > 0) {
                        d.mp = panel.formatDecimal(d.mp, panel.avgPriceDecimal);
                    }

                    //filter accno
//					if (d.an == null || d.an != panel.accNo)
//						continue;

                    if (d.tn != null && d.on != null) {
                        var dExCode = panel.getExchangeType(d.sc);
//                        tLog('||| updateOrdSts 1 , ' ,dExCode , d.sc);
                        if( N2N_CONFIG.mfExchCode != dExCode)
                            continue;
                        var ordObj = panel.getOrderData(d, dExCode);

                        //ordObj.ExCode= d.ex;	// this ex is base by Account Ex (if KL means KL all the stock will be same)
                        panel.setOrdStsLastUptTime(d.lut);

                        this.tempDatas.push(ordObj);
                        this.appendExchangelist(dExCode);
                    }
                }

                var incompleteData = 0;
                var totTempData = this.tempDatas.length;
                for (var i = 0; i < totTempData; i++) {
                    var tempData = this.tempDatas[i];
                    if (tempData.OrdNo == null && tempData.TktNo == null)
                        incompleteData++;
                }

                if (incompleteData < 1) {
                    var jsonObj = {
                        success: obj.s,
                        count: totTempData,
                        data: this.tempDatas
                    };

                    if (pagingMode)
                        store.lastOptions.params = Ext.applyIf({start: 0, limit: 10}, store.lastOptions.params);
                    //this.store.lastOptions.params = Ext.applyIf({start: 0, limit: 10}, this.store.lastOptions.params);

                    //this.store.loadData(jsonObj);        
                    resetGridScroll(panel);
                    store.loadRawData(jsonObj);
                    activateRow(panel);
                    n2ncomponents.activateEmptyScreens();
                    this.count = totTempData;
                    
                    if (panel.isFirstTime) {
                        helper.autoFitColumns(panel);
                        panel.isFirstTime = false;
                    }
                    
                }
            }

            else {
                // update or insert
                for (var i = 0; i < totData; i++) {
                    var d = datas[i];
                    
                    d.amt = panel.formatDecimal(d.amt, 0); // remove decimal from amount
                    
                    d.ordv = panel.formatDecimal(d.ordv, 3); //1.3.25.20 set format of d.ordv

                    if (panel.ordPriceDecimal.length > 0) {
                        d.op = panel.formatDecimal(d.op, panel.ordPriceDecimal);
                    }

                    if (panel.stopLimitDecimal.length > 0) {
                        d.sl = panel.formatDecimal(d.sl, panel.stopLimitDecimal);
                    }
                    
                    if (panel.avgPriceDecimal.length > 0) {
                        d.mp = panel.formatDecimal(d.mp, panel.avgPriceDecimal);
                    }

                    //filter accno
//					if (d.an == null || d.an != panel.accNo)
//						continue;

                    var totTempData = this.tempDatas.length;
                    var found = false;
                    var posFound = -1;
                    for (var j = 0; j < totTempData; j++) {
                        var tempData = this.tempDatas[j];
                        if (d.on == tempData.OrdNo && d.tn == tempData.TktNo) {
                            posFound = j;
                            found = true;
                            break;
                        }
                    }

                    if (!found) {
                        var dExCode = panel.getExchangeType(d.sc);
                        if( N2N_CONFIG.mfExchCode != dExCode)
                            continue;
                        
                        var tempData = panel.getOrderData(d, dExCode);
                        //tempData.ExCode= d.ex;	// this ex is base by Account Ex (if KL means KL all the stock will be same)
                        panel.setOrdStsLastUptTime(d.lut);
                        //console.log('not found....');

                        this.tempDatas.push(tempData);

                        //insert new data
                        if (pagingMode) {

                            var reload = false;
                            var row = -1;
                            var tktno = tempData.TktNo;
                            //console.log('tktno=' + tktno);
                            if (tktno)
                                row = store.allData.indexOfKey(tktno);

                            if (row == -1) {
                                var ordno = tempData.OrdNo;
                                //console.log('ordno=' + ordno);
                                if (ordno) {
                                    for (var x = 0; x < total; x++) {
                                        var rec = store.allData.get(x);
                                        if (rec.data.OrdNo == ordno) {
                                            row = x;
                                            break;
                                        }
                                    }
                                }
                            }

                            if (row == -1) {
                                reload = true;
                                try {
                                    //this.store.addRec(record);
                                    store.addRec(Ext.create('TCPlus.model.OrderStatus', tempData));
                                    //console.log('addRec');
                                }

                                catch (e) {
                                    console.log('[orderStatus][updateOrdSts][inner] Exception ---> ' + e);
                                }
                            }


                            if (reload)
                                store.reload();
                        }

                        else {
                            console.log('[orderStatus][updateOrdSts] add Sorted ... ');

                            //insert new data
//							for(var k = 0; k < totTempData; k++) {
//							var ordstsObj = this.tempDatas[k];
//							var tktno = ordstsObj.TktNo;
//							var ordno = ordstsObj.OrdNo;
                            var row = -1;
                            var tktno = tempData.TktNo;
                            //console.log('add ' + tktno);
                            if (tktno)
                                row = store.find('TktNo', tktno);

                            if (row == -1) {
                                var ordno = tempData.OrdNo;

                                //console.log('add ' + ordno);
                                if (ordno)
                                    row = store.find('OrdNo', ordno);
                            }

                            if (row == -1) {
                                var recordmapping = panel.recordMapping;
                                try {
                                    for (var i = 0; i < recordmapping.length; i++) {
                                        var mappingObj = recordmapping[i];

                                        if (tempData[ mappingObj.mapping ] == null) {
                                            tempData[ mappingObj.mapping ] = '';
                                        }
                                    }

                                    store.addSorted(Ext.create("TCPlus.model.OrderStatus", tempData));
                                    // get stock data for newly added record
                                    if (panel.stkcodes.indexOf(tempData.StkCode) === -1) {
                                        panel.stkcodes.push(tempData.StkCode);
                                    }
                                    if (panel._prevStkCodes.indexOf(tempData.StkCode) === -1) {
                                        panel._prevStkCodes.push(tempData.StkCode);
                                    }
                                    panel._callStockData(tempData.StkCode);

                                    console.log('[orderStatus][updateOrdSts] success to add ... ');
                                }

                                catch (e) {
                                    console.log('[orderStatus][updateOrdSts][inner] Exception ---> ' + e);
                                }
                            }

                            //console.log('row = ' + row);
//							}

                            //remove outdate data
//							var total = store.getCount();
//							for(var k = total - 1; k >= 0; k--) {
//							var recData = store.getAt(k).data;
//							tktno = recData.TktNo;
//							ordno = recData.OrdNo;
//							var exist = false;
//							var totTempData = this.tempDatas.length;
//							for(var l = 0; l < totTempData; l++) {
//							var data = this.tempDatas[l];
//							if (tktno == data.TktNo || ordno == data.OrdNo) {
//							exist = true;
//							break;
//							}
//							}

//							if (!exist) store.removeAt(k);
//							}
                        }
                        // end insert new data
                    }

                    else {
                        // update new data                    
                        var store = this.store;
                        ordno = d.on;
                        tktno = d.tn;
                        var row = 0;

                        var rec = store.getById(tktno);

                        /* var row = store.find('TktNo', tktno);
                         
                         if (row == -1)
                         row = store.find('OrdNo', ordno);
                         
                         if (row == -1)
                         continue;
                         
                         var rec = store.getAt(row);*/
                        if (rec == null)
                            continue;

                        var recData = rec.data; //rec.items[0].data;
                        //update whether to show/hide the selection checkbox on the left
                        /* if (!panel.canTrade({tktno: tktno, ordno: ordno, ordsts: d.st})) {
                         
                         var view = panel.getView();
                         //	var chkcell = view.getCell(row, 0);
                         var chkcell = view.getCellByPosition({row: row, column: 0});
                         if(chkcell){
                         var chkEl = Ext.get(chkcell);
                         var c = chkEl.first().first();
                         
                         c.removeCls('x-grid-row-checker');
                         }
                         }*/
                        //end of update checkbox

                        var buff = [
                            {id: cmap_osStkCode, value: d.sc, cellFromat: 'string'},
                            {id: cmap_osStkName, value: d.sy, cellFormat: null},
                            {id: cmap_osAccNo, value: d.an, cellFormat: 'string'},
                            {id: cmap_osAction, value: d.act, cellFormat: 'string'},
                            {id: cmap_osOrdTime, value: d.tm, cellFormat: 'string'},
                            {id: cmap_osOrdDate, value: d.dt, cellFormat: 'string'},
                            {id: cmap_osValidity, value: d.vd, cellFormat: 'string'},
                            {id: cmap_osStsCode, value: d.st, cellFormat: 'string'},
                            {id: cmap_osStatus, value: d.sts, cellFormat: 'string'},
                            {id: cmap_osRemark, value: d.rmk, cellFormat: 'string'},
                            {id: cmap_osOrdQty, value: d.oq, cellFormat: 'number'},
                            {id: cmap_osOrdPrc, value: d.op, cellFormat: 'price'},
                            {id: cmap_osMtQty, value: d.mq, cellFormat: 'number'},
                            {id: cmap_osMtPrc, value: d.mp, cellFormat: 'price'},
                            {id: cmap_osMchVal, value: d.mv, cellFormat: 'price'},
                            {id: cmap_osUnMchQty, value: d.uq, cellFormat: 'number'},
                            {id: cmap_osCncQty, value: d.cq, cellFormat: 'number'},
                            {id: cmap_osExpDate, value: d.ed, cellFormat: 'expdate'},
                            {id: cmap_osExpQty, value: d.eq, cellFormat: 'number'},
                            //{id: cmap_osCurrency,  value: d.cr,                        cellFormat: 'string'},
                            {id: cmap_osExCode, value: panel.getExchangeType(d.sc), cellFormat: 'string'},
                            {id: cmap_osType, value: d.ot, cellFormat: 'string'},
                            {id: cmap_osMinQty, value: d.minq, cellFormat: 'number'},
                            {id: cmap_osDsQty, value: d.dq, cellFormat: 'number'},
                            {id: cmap_osStopLimit, value: d.sl, cellFormat: 'price'},
                            {id: cmap_osLastUpdateTime, value: d.lut, cellFormat: 'expdate'},
                            {id: cmap_osAccountName, value: d.accN, cellFormat: 'string'},
                            {id: cmap_osSettOpt, value: d.setO, cellFormat: 'string'},
                            {id: cmap_osOrderValue, value: d.ordv, cellFormat: 'number'},
                            {id: cmap_osLotSize, value: d.ls, cellFormat: 'number'},
                            {id: cmap_osLACP, value: d.LACP, cellFormat: 'number'},
                            {id: cmap_osTradeCurrency, value: d.tc, cellFormat: 'string'},
                            {id: cmap_osTradeCound, value: d.ordercond, cellFormat: 'string'},
                            {id: 'DateTime', value: d.orderDateTime, cellFormat: 'string'},
                            {id: 'SeqNo', value: d.orderSeqNo, cellFormat: 'string'},
                            {id: cmap_osBranchCode, value: d.bc, cellFormat: 'string'},
                            {id: cmap_osBrokerCode, value: d.brkcode, cellFormat: 'string'},
                            {id: cmap_osTPType, value: d.tptype, cellFormat: 'string'},
                            {id: cmap_osTPDirection, value: d.tpdirection, cellFormat: 'string'},
                            {id: 'TradCond', value: d.tradcond, cellFormat: 'string'},
                            {id: 'State', value: d.state, cellFormat: 'string'},
                            {id: cmap_osQtyTodayMatch, value: d.qtytm, cellFormat: 'number'},
                            {id: cmap_osAmt, value: d.amt, cellFormat: 'number'}
                        ];

                        var tempRow = this.store.find('TktNo', tktno); // to get current view row index

                        for (var k = 0; k < buff.length; k++) {
                            var o = buff[k];
                            var id = o.id;

                            if (id == 'lastUpdateTime')
                                panel.setOrdStsLastUptTime(o.value);

                            if (id == cmap_osStkName)
                                continue;

                            // to update datetime and seqno after revise/cancel while in orderbook
                            if (id == 'DateTime') {
                                if (recData['DateTime'] != o.value) {
                                    recData['DateTime'] = o.value;
                                }
                            } else if (id == 'SeqNo') {
                                if (recData['SeqNo'] != o.value) {
                                    recData['SeqNo'] = o.value;
                                }
                            } else if (id == 'TradCond') {
                                if (recData['TradCond'] != o.value) {
                                    recData['TradCond'] = o.value;
                                }
                            } else if (id == 'State') {
                                if (recData['State'] != o.value) {
                                    recData['State'] = o.value;
                                }
                            }

                            //var colIndex = cm.getIndexById(o.id);
                            var ordSta = panel._idPrefix;
                            var getCol = panel.down("#" + ordSta + o.id);
                            var colIndex = getCol == null ? -1 : getCol.getIndex();
                            if (colIndex != -1) {
                                var dataIndex = getCol.dataIndex;
                                var recValue = recData[dataIndex];
                                if (o.value && o.value != recValue) {
                                    recData[dataIndex] = o.value;
                                    var val;
                                    if (o.cellFormat == 'string')
                                        val = o.value;

                                    else if (o.cellFormat == 'number')
                                        val = panel.printNumber(o.value);

                                    else if (o.cellFormat == 'price') {
//												var tempObj = formatutils.procPriceValue(o.value);
//												val = tempObj.value;
                                        val = o.value;
                                    }
                                    else if (o.cellFormat = 'expdate')
                                        val = stockutil.formatExpDate(o.value);

                                    if (tempRow != -1) {
                                        N2NUtil.updateCell(panel, tempRow, colIndex, val);

                                        //N2NUtil.updateCell(panel, row, colIndex, val);

                                        if (!getCol.isHidden()) {
                                            Blinking.setBlink(panel, tempRow, colIndex, "unchange");
                                        }
                                    }
                                }
                            }
                        }
                        //

                        if (posFound != -1) {
                            var dExCode = panel.getExchangeType(d.sc);
                            var tempData = panel.getOrderData(d, dExCode);
                            panel.setOrdStsLastUptTime(d.lut);

                            this.tempDatas[j] = tempData;
                            this.appendExchangelist(dExCode);
                        }
                    }
                    // end update new data
                }


                // remove outdated data
//				var total  = store.allData.length;
//				for(var k = total - 1; k >= 0; k--) {
//				var recData = store.allData.get(k).data;
//				var tktno = recData.TktNo;
//				var ordno = recData.OrdNo;
//				var exist = false;
//				for(var l=0; l<totTempData; l++) {
//				var data = this.tempDatas[l];
//				if (tktno == data.TktNo || ordno == data.OrdNo) {
//				exist = true;
//				break;
//				}
//				}

//				if (!exist) store.allData.removeAt(k);
//				}

//				var total = store.getCount();
//				for(var k = total - 1; k >= 0; k--) {
//				var recData = store.getAt(k).data;
//				tktno = recData.TktNo;
//				ordno = recData.OrdNo;
//				var exist = false;
//				var totTempData = this.tempDatas.length;
//				for(var l = 0; l < totTempData; l++) {
//				var data = this.tempDatas[l];
//				if (tktno == data.TktNo || ordno == data.OrdNo) {
//				exist = true;
//				break;
//				}
//				}

//				if (!exist) store.removeAt(k);
//				}

            }

            panel.updateOrdPadQty();


            //Ext.fly('mfordSts_totOrdVal').update(this.currentCurrency + ' ' + panel.formatCurrency(panel.formatDecimal(obj.tov, 2)));
            panel.calculateTotOrdValue();

        }
        else {
            panel.setLoading(false);

            if (this.store.getCount() == 0) {
                var msg = panel.emptyText;

                //helper.setHtml(panel.getView(), '<div class="x-grid-empty">' + msg + '</div>');
                helper.setGridEmptyText(panel, msg);
            }
        }


    },
    setOrdStsLastUptTime: function (val) {
        var panel = this;

        if (val != null) {
            if (panel.ordStsLastUptTime == null || val.length == 0)
                panel.ordStsLastUptTime = val;

            else {
                if (panel.ordStsLastUptTime < val)
                    panel.ordStsLastUptTime = val;
            }
        }
    },
    calculateTotOrdValue: function () {// this function is to calculate totOrdVal
        //Formula of total order value is total amount of all mutual fund
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
                var amt = recData.Amt;
                //IF MATCH STATUS 'P.R','P.Q','Q'
                //Check status from here
                //protected static String convOrderStatusCode(String ATPOrderStatusCode) {
                if (recData.Sts == 'PRL' || recData.Sts == 'PQ' || recData.Sts == 'Q') {
                    if (amt && !isNaN(amt)) {
                        var valOrd = parseFloat(amt, 2);
                        totOrdVal += valOrd;
                    }
                }
            }
            
            totOrdVal = panel.formatDecimal(totOrdVal, 2); //1.3.25.20
            this.totOrdVal = totOrdVal;
            this.setTotOrdVal(totOrdVal);
        } catch (e) {
            console.log('[orderStatus][calculateTotOrdValue] Exception ---> ' + e);
        }
    },
    setTotOrdVal: function (v) { // set/update total mt val at bbar
        //1.3.24.4 var _v = this.formatDecimal(v, 2);
        var _v = this.currentCurrency + ' ' + this.formatCurrency(v);
        var rv = this.currentCurrency + ' ' + this.returnNumberFormat(v, 50);
        if (this.compRef.hasOwnProperty('totalOrdVal')) {
            helper.setHtml(this.compRef.totalOrdVal, '<span title="' + _v + '">' + rv + '</span>');
        }
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
    showContextMenu: function (grid, ridx, e) {
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
        var ordsubtype = rec.OrdSubType;
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
        
        //Mutual fund
        var amount = rec.Amt;

        this.contextMenu.stkCode = stkCode;
        this.contextMenu.stkName = stkName;

        var ordRec = {
            accNo: accno + global_AccountSeparator + branchCode,
            ordQty: ordqty,
            ordPrc: ordprc,
            price: ordprc,
            ordType: ordtype,
            ordSubType: ordsubtype,
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
            State: state,
            //Mutual fund
            Amount: amount
        };

        this.contextMenu.ordRec = ordRec;

        var canTrd = false;
        if ((tktno || ordno) && canCancelRevise(ordsts) && (ordsts != 'Q' && ordsts != 'PQ'))
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
            panel.processValidSelection();
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
                    //Ext.getCmp('mflblpinw').setVisible(true);
                    panel.down('#mflblpinw').setVisible(true);
                    //Ext.getCmp('mfpinw').setVisible(true);
                    panel.down('#mfpinw').setVisible(true);
                    //Ext.getCmp('chkSavePinw').setVisible(true);
                    panel.down('#chkSavePinw').setVisible(true);
                    //Ext.getCmp('btncancel').setVisible(true);
                    panel.down('#btncancel').setVisible(true);
                    panel.down('#btnrevise').setVisible(true);

                }

                else {
                    //Ext.getCmp('mflblpinw').setVisible(false);
                    panel.down('#mflblpinw').setVisible(false);
                    //Ext.getCmp('mfpinw').setVisible(false);
                    panel.down('#mfpinw').setVisible(false)
                    //Ext.getCmp('chkSavePinw').setVisible(false);
                    panel.down('#chkSavePinw').setVisible(false);
                    //Ext.getCmp('btncancel').setVisible(false);
                    panel.down('#btncancel').setVisible(false);
                    panel.down('#btnrevise').setVisible(false);
                }
            }
            else { //1.3.25.3
                if (arg == true) {
                    //Ext.getCmp('mflblpinw').setVisible(false);
                    panel.down('#mflblpinw').setVisible(false);
                    //Ext.getCmp('mfpinw').setVisible(false);
                    panel.down('#mfpinw').setVisible(false);
                    //Ext.getCmp('chkSavePinw').setVisible(false);
                    panel.down('#chkSavePinw').setVisible(false);
                    //Ext.getCmp('btncancel').setVisible(true);
                    panel.down('#btncancel').setVisible(true);
                    panel.down('#btnrevise').setVisible(true);
                }

                else {
                    //Ext.getCmp('mflblpinw').setVisible(false);
                    panel.down('#mflblpinw').setVisible(false);
                    //Ext.getCmp('mfpinw').setVisible(false);
                    panel.down('#mfpinw').setVisible(false);
                    //Ext.getCmp('chkSavePinw').setVisible(false);
                    panel.down('#chkSavePinw').setVisible(false);
                    //Ext.getCmp('btncancel').setVisible(false);
                    panel.down('#btncancel').setVisible(false);
                    panel.down('#btnrevise').setVisible(false);
                }
            }
            if (!touchMode) {
                panel.down('#btnrevise').setVisible(false);
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
    processCancel: function () {
        var panel = this;

        setMaxDigits(38);
        var keyPair = new RSAKeyPair(key, '', mod);
        var sm = panel.getSelectionModel();
        var ls = sm.getSelection();
        var n = ls.length;

//        var lsordno = [];
//        var lssubordno = [];
//        var lstktno = [];

        var validSel = [];

        var selectedRecords = [];
        //var accList = accRet.ai;
        var accList = !isDealerRemisier ? accRet.ai : panel.accs;
        
        for (var i = 0; i < n; i++) {
            var r = ls[i].data;
            var canTrd = panel.canTrade({tktno: r.TktNo, ordno: r.OrdNo, ordsts: r.Sts});

            if (canTrd) {
//                lsordno.push(r.OrdNo);
//                lssubordno.push(r.SubOrdNo);
//                lstktno.push(r.TktNo);

                validSel.push(ls[i]);
                if (accList && accList.length > 0) {
                    for (var j = 0; j < accList.length; j++) {
                        var acc = accList[j];
                        if (acc.ac == r.AccNo && acc.bc == r.BCode) {
                            r.ClientCode = acc.cc; //assign clientcode to each row record
                            r.AccExchCode = acc.ex;
                        }
                    }
                }
                selectedRecords.push(r);
            }
        }

        sm.select(validSel);

//        var act = 'C';
//        var ordno = lsordno.join('|');
        var pin = Ext.getCmp('mfpinw').getValue();

        //1.3.25.3 Set a fix pin when trading pin is hidden
        if (panel.checkIsHidePin()) {
            Ext.getCmp('mfpinw').setValue("123456");
            pin = "123456";
        }
        pin = trim(pin);
        if (!pin) {
            //  msgutil.alert('Pls enter your trading pin.',	
            msgutil.alert(languageFormat.getLanguage(30212, 'Please enter your trading pin.'),
                    function () {
                        Ext.getCmp('mfpinw').focus();
                    });
            return false;
        }


        if (!testPin(pin)) {
            //msgutil.alert('Invalid trading pin. Pls check your trading pin.',
            msgutil.alert(languageFormat.getLanguage(30402, 'We regret to inform that you have entered an invalid trading pin. Kindly check your trading pin and try again.'),
                    function () {
                        Ext.getCmp('mfpinw').focus();
                    });
            return false;
        }

        setPinInfo(panel.pinInfo);

        if (validSel.length < 1)
            return;

        var pin2 = encryptedString(keyPair, pin);
        /*
         var subordno = lssubordno.join('|');
         var tktno = lstktno.join('|');
         
         var data = {
         ExtComp: 'OrderStatus_' + panel.getId(),
         act: act,
         ordno: ordno,
         pin: pin,
         pin2: pin2,
         subordno: subordno,
         tktno: tktno
         };
         */
        var skippin = panel.down('#chkSavePinw').getValue();

        var params = {"selectedRecords": selectedRecords, "pin2": pin2, "chkSavePin": skippin, "skipconfirm": n2nLayoutManager.orderSkipConfirm};

        var jsonRec = Ext.encode(params);

        var data = {
            jsonRec: jsonRec
        };

        if (!n2nLayoutManager.orderSkipConfirm) {
            msgutil.confirm(languageFormat.getLanguage(30409, 'Are you sure you want to cancel the selected records?'),
                    function (btn) {
                        if (btn == 'yes') {
                            panel.processAjaxCacncel(data, sm);
                        }
                    }
            );
        } else {
            panel.processAjaxCacncel(data, sm);
        }


    },
    processAjaxCacncel: function (data, sm) {
        var panel = this;

        if (global_s2FARequire == 'true' && global_s2FABypass == 'YES' && global_s2FADeviceList.length == 0 || global_s2FABypass == 'ALL') {
            if (!N2N1FA.return1FAValidation('multiplecancel')) {
                return;
            }
        }

        panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));

        Ext.Ajax.request({
            url: addPath + 'tcplus/orderbook',
            method: 'POST',
            params: data,
            success: function (response) {

                try {
                    var o = Ext.decode(response.responseText);

                    /*
                    if (o.success == 1) {
                        panel.uncheckHeader(true);
                        panel.showCancelPanel(sm, 0, null);
//                        if (o.msg != null) {
//                            msgutil.info(o.msg);
//                        }
                        msgutil.info(languageFormat.getLanguage(30248, 'Cancel request has been submitted successfully.'));
                    }
                    else 
                    */

                    if (o.resultS) {
                        var resultCount = o.resultS.length;
                        var store = panel.getStore();
                        panel.uncheckHeader(false);

                        // deselect those successfully cancelled
                        for (var i = 0; i < resultCount; i++) {
                            var r = Ext.decode(o.resultS[i]);

                            if (r && r.d) {
                                var recidx = store.findExact('OrdNo', r.d[0].on, 0);
                            sm.deselect(recidx);
                        }
                        }
                    }

                    if (o.resultF) {
                        var errorMsg = [];

                        for (var i = 0; i < o.resultF.length; i++) {
                            var record = Ext.decode(o.resultF[i]);
                            var msg = record.msg;
                            if (msg != null) {
                                if (errorMsg.indexOf(msg) == -1) {
                                    errorMsg.push(msg);
                                }
                            }
                        }

                        if (errorMsg.length > 0) {
                        msgutil.alert(errorMsg.join("<br/>"));
                    }
                    }

                    /*
                    else if (o.error == 1)
                        msgutil.alert(o.msg);

                    else
                        //msgutil.alert('There is an unknown error while trying to process your cancellation.');
                        msgutil.alert(languageFormat.getLanguage(30403, 'We regret to inform that we are unable to process your cancellation at this time. Kindly try again shortly.'));
                    */
                }

                catch (err) {
                    msgutil.alert(global_popUpMsgTitle, err);
                    console.log('[orderStatus][processAjaxCacncel][inner] Exception ---> ' + err);
                }
                
                panel.setLoading(false);
                panel.search(true);

            },
            failure: function (response) {
                panel.setLoading(false);
            }
        });
    },
    processRevise: function () {
        try {
            var panel = this;
            var sm = panel.getSelectionModel();
            var ls = sm.getSelection();
            var n = ls.length;
            var validSel = [];
            var selectedRecords = [];
            var accList = !isDealerRemisier ? accRet.ai : panel.accs;
            var r = ls[0].data;
            var accName = '';
            var canTrd = panel.canTrade({tktno: r.TktNo, ordno: r.OrdNo, ordsts: r.Sts});
            if (canTrd) {
                validSel.push(ls[0]);
                if (accList && accList.length > 0) {
                    for (var j = 0; j < accList.length; j++) {
                        var acc = accList[j];
                        if (acc.ac == r.AccNo && acc.bc == r.BCode) {
                            r.ClientCode = acc.cc; //assign clientcode to each row record
                            r.AccExchCode = acc.ex;
                            accName = acc.an;
                        }
                    }
                }
                selectedRecords.push(r);
            }

            sm.select(validSel);
            var record = selectedRecords[0];
            var ordRec = {
                accNo: record.AccNo + global_AccountSeparator + record.BCode,
                ordQty: record.OrdQty,
                ordPrc: record.OrdPrc,
                price: record.OrdPrc,
                ordType: record.OrdType,
                ordSubType: record.OrdSubType,
                validity: record.Validity,
                tktNo: record.TktNo,
                ordNo: record.OrdNo,
                SubOrdNo: record.SubOrdNo,
                ordTime: record.OrdTime,
                ordSts: record.Sts,
                unMtQty: record.UnMtQty,
                ordDate: record.OrdDate,
                expDate: record.ExpDate,
                stopLimit: record.StopLimit,
                MinQty: record.MinQty,
                DsQty: record.DsQty,
                remark: record.Remark,
                seqNo: record.SeqNo,
                dateTime: record.DateTime,
                Action: modeOrdRevise,
                BCode: record.BCode,
                BrokerCode: record.BrokerCode,
                MtQty: record.MtQty,
                SettCurr: record.Currency,
                TPType: record.TPType,
                TPDirection: record.TPDirection,
                OrdStsAccList: [[record.AccNo + global_AccountSeparator + record.BCode, record.AccNo + ' - ' + record.AccountName + ' - ' + record.BCode]]
            };
            closedOrderPad = false;
            createOrderPad(selectedRecords[0].StkCode, selectedRecords[0].StkName, modeOrdRevise, ordRec, true);
        } catch (e) {
            console.log('[orderStatus][processRevise] Exception ---> ' + e);
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
            this.down('#mfpinw').setValue(cfg.lastPin);
            this.down('#chkSavePinw').setValue(cfg.savePin);
        }
    },
    selectRecord: function (recData) {
        if (recData) {
            this.down("#topToolbar").getComponent('mfos_btnDetail').enable();
            this.tktno = recData.get('TktNo');
            this.ordno = recData.get('OrdNo');
            this.stkname = recData.get('StkName');
        } else {
            this.down("#topToolbar").getComponent('mfos_btnDetail').disable();
        }
    },
    cleanUp: function () {
        this.accNo = '';
        this.filterOpt = '0';
        this.filterPaymentCodeOpt = '';
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
                        activateBuySellMenu(modeOrdBuy);
                    }
                });

                this.menuSellId = Ext.id();
                btns.push({
                    id: menu.menuSellId,
                    text: languageFormat.getLanguage(10002, 'Sell'),
                    popupOnly: true,
                    handler: function () {
                        activateBuySellMenu(modeOrdSell);
                    }
                });
            }

            this.menuReviseId = Ext.id();
            btns.push({
                id: menu.menuReviseId,
                text: languageFormat.getLanguage(10009, 'Revise'),
                popupOnly: true,
                handler: function () {
                    var ordRec = mfOrderStatusPanel.contextMenu.ordRec;
                    if (ordRec != null) {
                        var tktno = trim(ordRec.tktNo) == null ? '' : trim(ordRec.tktNo);
                        var ordno = trim(ordRec.ordNo) == null ? '' : trim(ordRec.ordNo);
                        var ordsts = trim(ordRec.ordSts) == null ? '' : trim(ordRec.ordSts);
                        if ((tktno || ordno) && canCancelRevise(ordsts)) {
                            closedOrderPad = false;
                            createOrderPad(mfOrderStatusPanel.contextMenu.stkCode, mfOrderStatusPanel.contextMenu.stkName, modeOrdRevise, ordRec, true);
                            if (n2nLayoutManager.isTabLayout()) {
                                closedMarketDepth = false;
                            }
                        }
                    }
                }
            });

            this.menuCancelId = Ext.id();
            btns.push({
                id: menu.menuCancelId,
                text: languageFormat.getLanguage(10010, 'Cancel'),
                popupOnly: true,
                handler: function () {
                    var ordRec = mfOrderStatusPanel.contextMenu.ordRec;
                    if (ordRec != null) {
                        var tktno = trim(ordRec.tktNo) == null ? '' : trim(ordRec.tktNo);
                        var ordno = trim(ordRec.ordNo) == null ? '' : trim(ordRec.ordNo);
                        var ordsts = trim(ordRec.ordSts) == null ? '' : trim(ordRec.ordSts);
                        if ((tktno || ordno) && canCancelRevise(ordsts)) {
                            closedOrderPad = false;
                            createOrderPad(mfOrderStatusPanel.contextMenu.stkCode, mfOrderStatusPanel.contextMenu.stkName, modeOrdCancel, mfOrderStatusPanel.contextMenu.ordRec, true);
                            if(autoCancel == "TRUE"){
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
                if (showStkInfoTracker == "TRUE") {
                    this.menuStkTrackerId = Ext.id();
                    btns.push({
                        id: menu.menuStkTrackerId,
                        text: languageFormat.getLanguage(33730, 'Fund Info/Tracker'),
                        handler: function () {
                            /**
                             * Apply Stock News Logic, To Get selected StkCode get using
                             * marketMoverPanel.contextMenu.stkCode
                             */
                            createTrackerPanel(mfOrderStatusPanel.contextMenu.stkCode, mfOrderStatusPanel.contextMenu.stkName, false);
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

                            createAnalysisChartPanel(mfOrderStatusPanel.contextMenu.stkCode, mfOrderStatusPanel.contextMenu.stkName, false);

                        }
                    });
                }
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
                        case this.menuStkNewsElasticId:
                            btn = this.contextMenu.down("#" + this.menuStkNewsElasticId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuNews2Id:
                            btn = this.contextMenu.down("#" + this.menuNews2Id);
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
                        case this.menuBrokerQId:
                            btn = this.contextMenu.down("#" + this.menuBrokerQId);
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
                        case this.menuStockAlertId:
                            btn = this.contextMenu.down("#" + this.menuStockAlertId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuPSEEdgeId:
                            btn = this.contextMenu.down("#" + this.menuPSEEdgeId);
                            btn.setHandler(func.func);
                            break;
                        case this.menuIBId:
                            btn = this.contextMenu.down("#" + this.menuIBId);
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
     * 		call ajax to pass new field list to server to retrieve field list record
     * 
     * @param fieldList : string
     */
    changeField: function (fieldList) {
        var panel = this;

        Storage.generateSubscriptionByList(panel.stkcodes, panel);

//		var urlbuf = [];
//		urlbuf.push(addPath + 'tcplus/field?');
//		urlbuf.push('s=' + dwr.engine._scriptSessionId);

//		if (panel.stkcodes != null)
//		urlbuf.push('&l=' + panel.stkcodes.join(','));

//		urlbuf.push('&f=' + fieldList);
//		urlbuf.push('&t=q');

//		var url = urlbuf.join('');

//		Ext.Ajax.request({
//		url: url,
//		method: 'POST',
//		success: function(response) {
//		if (response != null) {
//		var obj = null;
//		try {
//		obj = Ext.decode(response.responseText);
//		panel.updateFeed(obj);
//		} catch(e) {}
//		}
//		}
//		});
    },
    getFieldList: function (type) {
        var panel = this;

        var returnArray = [fieldLast, fieldLacp];
        var columnModel = helper.getGridColumns(panel);//panel.getView().getHeaderCt();
        var n = columnModel.length;//columnModel.getColumnCount();

        for (var i = 1; i < n; i++) {
            var storeValue = null;

            // verify the column is hidden or show
            //if (!columnModel.getHeaderAtIndex(i).isHidden()) {
            if (!columnModel[i].isHidden()){
                // retrieve the column data index
                var dataIndex = columnModel[i].dataIndex;//columnModel.getHeaderAtIndex(i).dataIndex;
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
    getStore: function () {
        return this.store;
    },
//	switchButtonStyle:function() {
//	this.btnDetails.setVisible(touchMode);

//	if (Ext.isIE) return;
//	if (!isVisible(this.id)) return;

//	var tbar = this.getTopToolbar();
//	if (tbar != null) {
//	var items = tbar.items;
//	for (var i = 0; i < items.length; i++) {
//	var item = tbar.get(i);
//	this.chgBtnUI(item);
//	}
//	}
//	},
//	chgBtnUI: function(item) {
//	var xtype = item.getXType();
//	if (xtype == 'button') {
//	var dom = item.getEl().dom;
//	var obj = null;
//	var exist = false;
//	var html = '';
//	var className = '';
//	if (touchMode) {
//	html = dom.innerHTML;
//	className = dom.className;
//	if (this.btnarr == null) this.btnarr = [];
//	for (var j = 0; j < this.btnarr.length; j++) {
//	if (this.btnarr[j].id == item.id) {
//	obj = this.btnarr[j];
//	exist = true;
//	break;
//	}
//	}
//	if (obj == null) obj = {};

//	if (!exist) {
//	obj.id = item.id;
//	obj.innerHTML = html;
//	obj.className = className;
//	this.btnarr.push(obj);
//	}

//	dom.className = 'generalButton';
//	dom.innerHTML = '<tr></td><button style="width: '+item.getWidth()+'px;">'+item.text+'</button></td></tr>';
//	} else {
//	if (this.btnarr != null) {
//	for (j = 0; j < this.btnarr.length; j++) {
//	if (this.btnarr[j].id == item.id) {
//	obj = this.btnarr[j];
//	exist = true;
//	break;
//	}
//	}

//	if (obj != null) {
//	html = obj.innerHTML;
//	dom.className = obj.className;
//	dom.innerHTML = html;
//	}
//	}
//	}
//	}
//	},
    startRefreshTimer: function () {
        var panel = this;

        if (this.refreshTimer != null)
            this.stopRefreshTimer();

        this.refreshTimer = setInterval(function () {
            panel.search(true);

        }, 20000, 2000);

    },
    stopRefreshTimer: function () {
        var panel = this;

        if (this.refreshTimer != null)
            clearInterval(panel.refreshTimer);

    },
    updateOrdPadBal: function (accInfo) {
        if (orderPad != null && orderPad.isReady) {
            if (!isDealerRemisier) {
                orderPad.setCreditLimit();
            } else {
                orderPad.setSearchAccCreditLimit(accInfo);
            }
        }
    },
    updateOrdPadQty: function () {
        var panel = this;
        if (orderPad != null && orderPad.tktno) {
            var datas = panel.tempDatas;
            if (datas) {
                var totData = datas.length;
                for (var x = 0; x < totData; x++) {
                    var d = datas[x];
                    if (d.TktNo == orderPad.tktno && d.OrdNo == orderPad.ordno) {
                        var unmtqty = d.UnMtQty;
                        if (unmtqty && !isNaN(unmtqty) && orderPad.ordqty != unmtqty) {
                            orderPad.ordqty = unmtqty;
                        }
                        break;
                    }
                }
            }
        }
    },
    updateOrdDetPanels: function (obj) {
        if (ordDetailPanel) {
            //  var totPanel = ordDetailPanels.length;
            //     for (var i = 0; i < totPanel; i++) {
            ordDetailPanel.updateOrdDetail(obj);
            //   }
        }
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
    isValidColumnSetting: function () {
//		if (authenret != null && authenret.atp != null && authenret.atp.cs != null) {
//	var cs = authenret.atp.cs;

//var param = null;
//for (var i = 0; i < cs.length; i++) {
//	var colset = cs[i];
//if (colset.sc == osColSetting) {
//	param = colset.p;
//}
//}
        
        var osCol = layoutProfileManager.getCol('mfos');
        if (osCol != null && osCol != "") {
            if (osCol.indexOf("~") != -1) {
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
    callOrderPosition: function (stkCode, ordno, priceIndicator, seqNo, orderDateTime) {
        var panel = this;

        var requestObj = {
            k: stkCode,
            on: ordno,
            pi: priceIndicator,
            sn: seqNo,
            odt: orderDateTime,
            success: function (arrObj) {
            	var arr = arrObj.d;
                if (arr && arr.length > 0) {
                    var orderPosition = arr[0];
                    orderPosition[0] = orderPosition[0].replace(/\r\n/g, '<br>');

                    msgutil.show({
                        msg: orderPosition[0],
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                }else{
                	msgutil.show({
                        msg: languageFormat.getLanguage(30413, 'No order position.'),
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.INFO
                    });
                }
            }
        };
        conn.getOrderPosition(requestObj);

        /*
         var urlbuf = [];
         urlbuf.push(addPath + 'tcplus/orderposition?');
         urlbuf.push('ExtComp=');
         urlbuf.push('OrderStatus_' + panel.getId());
         urlbuf.push('&stkCode=' + stkCode);
         urlbuf.push('&ordNo=' + ordno);
         urlbuf.push('&pI=' + priceIndicator);
         urlbuf.push('&seqNo=' + seqNo);
         urlbuf.push('&ordDateTime=' + orderDateTime);
         
         var url = urlbuf.join('');
         
         Ext.Ajax.request({
         url: url,
         success: function(response) {
         var text = response.responseText;
         var obj = null;
         
         try {
         obj = Ext.decode(text);
         } catch (e) {
         console.log('[orderStatus][orderPosition] Exception ---> ' + e);
         }
         
         if (obj != null) {
         
         if (!obj.s) {
         var errorMessage = "";
         if (obj.e != null) {
         errorMessage += obj.e;
         }
         
         if (obj.m != null) {
         errorMessage += " - " + obj.m;
         } else if (obj.msg != null) {
         errorMessage = obj.msg;
         }
         
         if (errorMessage == "") {
         errorMessage = languageFormat.getLanguage(30410, 'Order Position is empty');
         }
         
         msgutil.show({
         msg: errorMessage,
         buttons: Ext.Msg.OK,
         icon: Ext.Msg.INFO
         });
         } else {
         
         var orderPosition = obj.d;
         orderPosition = orderPosition.replace(/\r\n/g, '<br>');
         
         msgutil.show({
         msg: orderPosition,
         buttons: Ext.Msg.OK,
         icon: Ext.Msg.INFO
         });
         }
         }
         },
         failure: function() {
         
         }
         });
         */
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
        var ibBtn = panel.contextMenu.getComponent(panel.menuIBId);
        var stkEx = formatutils.getExchangeFromStockCode(stk);

        checkContextMenuItems(intradayChartBtn, ibBtn, stkEx);
    },
// region start custom column functions
    showColumnSetting: function () {
        var panel = this;
        colutils.displayWindow(panel);
    },
    allColumnSetting: function () {
        var allColumnId = global_FOSAllColumn;
        return allColumnId;
    },
    defaultColumnSetting: function () {
        var defaultColumnId = global_FOSDefaultColumn;
        return defaultColumnId;
    },
    currentColumnSetting: function () {
        var currentColumnId = layoutProfileManager.getCol('mfos');

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
    generateColumnName: function (id) {
        switch (id) {
            case cmap_osAccNo:
                return languageFormat.getLanguage(10901, 'Acc.No');
            case cmap_osOrdNo:
                return languageFormat.getLanguage(10902, 'OrdNo');
            case cmap_osStkCode:
                return languageFormat.getLanguage(33510, 'Fund Code');
            case cmap_osStkName:
                return languageFormat.getLanguage(33511, 'Fund Name');
            case cmap_osOrdTime:
                return languageFormat.getLanguage(10904, 'OrdTime');
            case cmap_osOrdDate:
                return languageFormat.getLanguage(10913, 'OrdDate');
            case cmap_osAction:
                return languageFormat.getLanguage(20832, 'Action');
            case cmap_osType:
                return languageFormat.getLanguage(10905, 'OrdType');
            case cmap_osSubType:
                return languageFormat.getLanguage(10945, 'OrdSubType');
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
                return languageFormat.getLanguage(33526, 'NAVPS');
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
            case cmap_osAmt:
                return languageFormat.getLanguage(33697, 'Amount');
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

        // update field id - call to server what column is display
        panel.changeField(panel.getFieldList());
        newColumnIdArr = newColumnIdArr + "~" + colutils.ColumnVersion;
        colutils.saveColumn('mfos', newColumnIdArr);
    },
    /**
     * generate column setting
     * 
     * @return string / null
     */
    generateColumnID: function () {
        var panel = this;

        var columnModel = panel.getView().getHeaderCt();

        if (columnModel != null) { // verify from main.jsp
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
                /*
                cssClass += " " + N2NCSS.FontString;
                if (isNumberYellowColumn) {
                    cssClass += " " + N2NCSS.FontUnChange_yellow;
                } else {
                    cssClass += " " + N2NCSS.FontUnChange;
                }
                */
                
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontColorString;
                
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
                if (value.toLowerCase() == 'buy') {
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
                
                if (parseFloat(value) == 0 && (record.data['OrdType'] == 'Market' || record.data['OrdType'] == 'MarketToLimit')) {
                	value = '';
                }
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

        //    var columnList = [selModel];
        var columnList = [];
        var ordSta = panel._idPrefix;
        for (var i = 0; i < colSettingList.length; i++) {
            var colObj = colSettingList[i];
            var columnID = colObj.column;
            var columnVisible = colObj.visible ? false : true;
            var hd = panel.generateColumnName(columnID);

            switch (columnID) {
                case cmap_osAccNo:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10901, 'Acc.No'),
                        dataIndex: 'AccNo',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        menuDisabled: isMobile,
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;

                case cmap_osOrdNo:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10902, 'OrdNo'),
                        dataIndex: 'OrdNo',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'ordno');
                        }
                    });
                    break;

                case cmap_osStkCode:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(33510, 'Fund Code'),
                        dataIndex: 'StkCode',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, 'stkcode', 'stkname');
                        }
                    });
                    break;

                case cmap_osStkName:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(33511, 'Fund Name'),
                        dataIndex: 'StkName',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            value = value || '';
                            return fmtHelper(value, meta, record, 'stkname', 'stkname');
                        }
                    });
                    break;

                case cmap_osOrdTime:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10904, 'OrdTime'),
                        dataIndex: 'OrdTime',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'center',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'time');
                        }
                    });
                    break;

                case cmap_osOrdDate:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10913, 'OrdDate'),
                        dataIndex: 'OrdDate',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'center',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'date');
                        }
                    });
                    break;

                case cmap_osAction:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(20832, 'Action'),
                        dataIndex: 'PrevAct',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
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
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;
                case cmap_osSubType:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10945, 'OrdSubType'),
                        dataIndex: 'OrdSubType',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
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
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;

                case cmap_osStsCode:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10914, 'StsCode'),
                        dataIndex: 'Sts',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;

                case cmap_osStatus:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10906, 'Status'),
                        dataIndex: 'StsMsg',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
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
                        hidden: columnVisible,
                        menuDisabled: isMobile,
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
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10908, 'OrdPrice'),
                        dataIndex: 'OrdPrc',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'ordprc');
                        }
                    });
                    break;

                case cmap_osMtQty:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10938, 'TotalMatchQty'),
                        dataIndex: 'MtQty',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
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
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10910, 'AvgPrice'),
                        dataIndex: 'MtPrc',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;

                case cmap_osMchVal:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10911, 'MatchVal'),
                        dataIndex: 'MtVal',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            value = panel.returnNumberFormat(value, panel.getWidth(cmap_osMchVal));
                            return fmtHelper(value, meta, record, '', 'matchval');
                        }
                    });
                    break;

                case cmap_osUnMchQty:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10915, 'UnmatchQty'),
                        dataIndex: 'UnMtQty',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
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
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10916, 'CancelQty'),
                        dataIndex: 'CnclQty',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
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
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10917, 'ExpDate'),
                        dataIndex: 'ExpDate',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'center',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'expdate');
                        }
                    });
                    break;

                case cmap_osExpQty:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10918, 'ExpQty'),
                        dataIndex: 'ExpQty',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'number');
                        }
                    });
                    break;

                case cmap_osCurrency:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10919, 'SettCurr'),
                        dataIndex: 'Currency',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'center',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;

                case cmap_osExCode:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10126, 'Exchg'),
                        dataIndex: 'ExCode',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'center',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;

                case cmap_osLast:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10113, 'Last'),
                        dataIndex: 'Last',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'price');
                        }
                    });
                    break;
                case cmap_osMinQty:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10920, 'MinQty'),
                        dataIndex: 'MinQty',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
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
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10921, 'DisclosedQty'),
                        dataIndex: 'DsQty',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
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
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10922, 'StopLimit'),
                        dataIndex: 'StopLimit',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'unchange');
                        }
                    });
                    break;
                case cmap_osRemark:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10133, 'Remark'),
                        dataIndex: 'Remark',
                        sortable: true,
                        menuDisabled: isMobile,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'left',
                        renderer: function (value, meta, record) {
                            return fmtHelper(n2other(value, ' '), meta, record, '', 'string');
                        }
                    });
                    break;
                case cmap_osAccountName:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10932, 'AccName'),
                        dataIndex: 'AccountName',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'left',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;
                case cmap_osSettOpt:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10923, 'SettMode'),
                        dataIndex: 'SettOpt',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'center',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;
                case cmap_osOrderValue:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10924, 'OrdValue'),
                        dataIndex: 'OrderValue',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            value = panel.returnNumberFormat(value, panel.getWidth(cmap_osOrderValue));
                            return fmtHelper(value, meta, record, '', 'unchange');
                        }
                    });
                    break;

                case cmap_osLotSize:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10712, 'Lot.Size'),
                        dataIndex: 'LotSize',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'center',
                        renderer: function(value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'unchange');
                        }
                    });
                    break;
                case cmap_osLACP:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(33526, 'NAVPS'),
                        dataIndex: 'LACP',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'unchange');
                        }
                    });
                    break;
                case cmap_osTradeCurrency:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10925, 'TradeCurr'),
                        dataIndex: 'TradeCurr',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'center',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;
                case cmap_osTradeCound:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(20848, 'Short Sell'),
                        dataIndex: 'OrderCond',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
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
                case cmap_osLastUpdateTime:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10926, 'LastUpdate'),
                        dataIndex: 'LastUpdateTime',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'expdate');
                        }
                    });
                    break;
                case cmap_osBranchCode:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10933, 'BCode'),
                        dataIndex: 'BCode',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;
                case cmap_osBrokerCode:
                    columnList.push({
                        itemId: ordSta + columnID,
                        header: languageFormat.getLanguage(10934, 'BrokerCode'),
                        dataIndex: 'BrokerCode',
                        sortable: true,
                        hidden: columnVisible,
                        menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            return fmtHelper(value, meta, record, '', 'string');
                        }
                    });
                    break;
                case cmap_osTPType:
                    columnList.push({
                        id: ordSta + columnID,
                        header: languageFormat.getLanguage(10935, 'TPType'),
                        dataIndex: 'TPType',
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
                        id: ordSta + columnID,
                        header: languageFormat.getLanguage(10936, 'TPDirection'),
                        dataIndex: 'TPDirection',
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
                        id: ordSta + columnID,
                        header: languageFormat.getLanguage(10937, 'TodayQtyMatch'),
                        dataIndex: 'QtyTM',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        align: 'right',
                        renderer: function (value, meta, record) {
                        	value = panel.returnNumberFormat(value, panel.getWidth(cmap_osQtyTodayMatch));
                            return fmtHelper(value, meta, record, '', 'number');
                        }
                    });
                    break;
                case cmap_osAmt:
                    columnList.push({
                        id: ordSta + columnID,
                        header: languageFormat.getLanguage(33697, 'Amount'),
                        dataIndex: 'Amt',
                        sortable: true,
                        hidden: columnVisible,
                        width: panel.getWidth(columnID),
                        align: 'right',
                        renderer: function (value, meta, record) {
                            value = panel.returnNumberFormat(value, panel.getWidth(cmap_osAmt));
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
            idProperty: 'TktNo',
            rootProperty: 'data',
            totalProperty: 'count', // os,,c ,s  according to result frm ajax request...if we create an obj and load it ...then we map back the name of variable accordingly
            successProperty: 'success'
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
        
        me.cookieKey = columnWidthSaveManager.getCookieColKey('mfOrdStatus');
        me.paramKey = N2N_CONFIG.constKey + 'MFOS';
        me.colWidthKey = 'mfos';
    },
    searchAccount: function (searchValue) {
        var panel = this;
        try {
        	searchValue = searchValue.toLowerCase();
            panel.cbAccount.doQuery(searchValue, true);
            /*
            panel.setLoading(true);
            var urlbuf = new Array();

            urlbuf.push(addPath + 'tcplus/atp/searchAcc?');
            urlbuf.push('ExtComp=OrderStatus');
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
                        panel.accs = [];

                        var accInfo = obj.ai;
                        var totAcc = accInfo.length;
                        var allRec = ['', languageFormat.getLanguage(10029, 'Select account...')];
                        panel.accList.push(allRec);
                        for (var i = 0; i < totAcc; i++) {
                            var acc = accInfo[i];
                            var accRec = [acc.ac + global_AccountSeparator + acc.bc, acc.ac + ' - ' + acc.an + ' - ' + acc.bc];
                            panel.accList.push(accRec);

                            var newobj = new Object();
                            newobj.ac = acc.ac;
                            newobj.bc = acc.bc;
                            newobj.cc = acc.cc;
                            newobj.ex = acc.ex;
                            panel.accs.push(newobj);
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
    _getActionEl: function (action) {
        var elStr = '';

        if (action.toLowerCase() === 'buy' || action == languageFormat.getLanguage(10001, 'Buy')) {
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
    focusSearchBox: function() {
        focusManager.focusSearchbox(this.cbAccount);
    },
    runFitScreen: function() {
        var panel = this;

        if (!helper.inView(panel)) {
            helper.addBufferedRun('osFitScreen', function() {
                helper.autoFitColumns(panel);
            });
        } else {
            helper.autoFitColumns(panel);
        }
    }
});
