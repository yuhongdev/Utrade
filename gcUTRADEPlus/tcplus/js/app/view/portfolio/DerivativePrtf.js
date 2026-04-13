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

Ext.define('TCPlus.view.portfolio.DerivativePrtf', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.derivativeprtf',
    thisPanelID: '',
    accNo: '', // for store user account
    accList: null, // for store user account list
    tTab_MainTab: null,
    tPanel_PanelInfo: null,
    tPanel_GridSummary: null,
    tComboBoxAccount: null,
    tButton_Refresh: null,
    tButton_Detail: null,
    tButton_Export: null,
    tLabel_BFCashBalance: null,
    tLabel_EligbleCollateral: null,
    tLabel_BuyOptMktVal: null,
    tLabel_SellOptMktVal: null,
    tLabel_Withdrawal: null,
    tLabel_Deposit: null,
    tLabel_MaintenanceMargin: null,
    tLabel_ExcessShortfall: null,
    tLabel_MarginCall: null,
    tLabel_Eligibility: null,
    tLabel_InitialMargin: null,
    tLabel_NetLiquidation: null,
    tLabel_CurrentBalance: null,
    tLabel_UnrealizedPL: null,
    tLabel_Equity: null,
    tLabel_RealizedPL: null,
    tLabel_Balance: null,
    tLabel_NetCash: null,
    tLabelLblNetCash: null,
    tLabelValNetCash: null,
    tLoadMask: null,
    tbSearchAccount: null,
    searchAccountBtn: null,
    tooltip: null,
    columnHash: null,
    tempWidth: null,
    isImgBlink: false,
    value_BFCashBalance: 0,
    value_Deposit: 0,
    value_WithDrawal: 0,
    value_RealisedPL: 0,
    value_CurrentBalance: 0,
    value_UnrealisedPL: 0,
    value_Equity: 0,
    value_BuyOptMktVal: 0,
    value_SellOptMktVal: 0,
    value_NetLiquidations: 0,
    value_EligibleCollateral: 0,
    value_InitialMargin: 0,
    value_MaintenanceMargin: 0,
    value_ExcessShortfall: 0,
    value_MarginCall: 0,
    value_Eligibility: 0,
    tempStkPrice: 0,
    stockList: [],
    compRef: {}, // component references
    _summaryActivated: false,
    screenType: 'main',
    slcomp: "dp",
    type: 'dp',
    savingComp: true,
    currentCurrency: defCurrency,
    initComponent: function () {
        var panel = this;

        panel.thisPanelID = panel.getId();

        panel.createColStates();

        panel._procOtherComponent();

        var tbarItems = new Array();
        tbarItems.push(panel.tComboBoxAccount, ' ');
        //tbarItems.push(panel.tbSearchAccount);
        tbarItems.push(panel.searchAccountBtn);

        var lblBal = new Ext.form.Label({
            text: languageFormat.getLanguage(20193, 'Bal.') + ': ',
            hidden: !(showBalanceNNetCashLimit == "TRUE")
        });

        var lblNetCash = new Ext.form.Label({
            text: languageFormat.getLanguage(20194, 'Net Cash Limit') + ': ',
            hidden: !(showBalanceNNetCashLimit == "TRUE")
        });

        if (showBalanceNNetCashLimit == "TRUE") {
            tbarItems.push('-');
            tbarItems.push(lblBal);
            tbarItems.push(' ');
            tbarItems.push(panel.tLabel_Balance);
            tbarItems.push('-');
            tbarItems.push(lblNetCash);
            tbarItems.push(' ');
            tbarItems.push(panel.tLabel_NetCash);
            tbarItems.push('-');
        }
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
            title: languageFormat.getLanguage(20263, 'Derivatives Portfolio'),
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
                beforedestroy: function (thisComp) {
                    Storage.generateUnsubscriptionByExtComp(thisComp);
                }
            }
        };

        Ext.apply(this, defaultConfig);
        this.callParent();
    },
    createColStates: function() {
        var panel = this;

        panel._summaryColState = new ColState({
            cookieKey: columnWidthSaveManager.getCookieColKey('dpSummary'),
            config: N2N_CONFIG.dpColWidth,
            adjustWidth: 7,
            colWidthKey: 'dpSM',
            paramKey: N2N_CONFIG.constKey + 'DPSM'
        });
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
                        helper.runBuffer('dpSumCol');
                        helper.runBuffer('dpSumBuf');
                        if (!panel._summaryActivated) {
                            panel._summaryActivated = true;
                            panel.refresh();
                        }
                    }
                }
            }
        });
    },
    getGridCols: function() {
        var panel = this;

        return [
            {
                text: languageFormat.getLanguage(10501, 'No.'),
                dataIndex: '42',
                width: panel._summaryColState.getWidth('42'),
                sortable: false,
                menuDisabled: true,
                resizable: false
            },
            {
                text: languageFormat.getLanguage(10102, "Symbol"),
                dataIndex: '44',
                width: panel._summaryColState.getWidth('44'),
                sortable: false,
                menuDisabled: true
            },
            {
                text: languageFormat.getLanguage(10601, 'Nett Position'),
                dataIndex: 'nettPosition',
                width: panel._summaryColState.getWidth('nettPosition'),
                sortable: false,
                menuDisabled: true,
                align: 'right'
            },
            {
                text: languageFormat.getLanguage(10616, 'BHCliCode'),
                dataIndex: '51',
                width: panel._summaryColState.getWidth('51'),
                sortable: false,
                menuDisabled: true,
                align: 'right',
                hidden: true
            },
            {
                text: languageFormat.getLanguage(10611, 'Branch Code'),
                dataIndex: '52',
                width: panel._summaryColState.getWidth('52'),
                sortable: false,
                menuDisabled: true,
                align: 'right',
                hidden: true
            },
            {
                text: languageFormat.getLanguage(10602, 'Average Price'),
                dataIndex: '78',
                width: panel._summaryColState.getWidth('78'),
                sortable: false,
                menuDisabled: true,
                align: 'right',
                renderer: function(value) {
                    return panel._formatValue(value);
                }
            },
            {
                text: languageFormat.getLanguage(10603, 'Last Done'),
                dataIndex: 'lastDone',
                width: panel._summaryColState.getWidth('lastDone'),
                sortable: false,
                menuDisabled: true,
                align: 'right',
                renderer: function(value) {
                    return panel._formatValue(value);
                }
            },
            {
                text: languageFormat.getLanguage(10132, 'Currency'),
                dataIndex: '155',
                width: panel._summaryColState.getWidth('155'),
                sortable: false,
                menuDisabled: true,
                align: 'right'
            },
            {
                text: languageFormat.getLanguage(10617, 'CurrRate'),
                dataIndex: '154',
                width: panel._summaryColState.getWidth('154'),
                sortable: false,
                menuDisabled: true,
                align: 'right'
            },
            {
                text: languageFormat.getLanguage(10604, 'Unrealised P/L'),
                dataIndex: 'unrealised',
                width: panel._summaryColState.getWidth('unrealised'),
                sortable: false,
                menuDisabled: true,
                align: 'right',
                renderer: function(value) {
                    return panel._formatValue(value, panel._summaryColState.getWidth('unrealised'));
                }
            },
            {
                text: languageFormat.getLanguage(10612, 'Unrealised G/L Amount'),
                dataIndex: '82',
                width: panel._summaryColState.getWidth('82'),
                sortable: false,
                menuDisabled: true,
                align: 'right',
                hidden: true,
                renderer: function(value) {
                    return panel._formatValue(value, panel._summaryColState.getWidth('82'));
                }
            },
            {
                text: languageFormat.getLanguage(20272, 'Realised P/L'),
                dataIndex: '125',
                width: panel._summaryColState.getWidth('125'),
                sortable: false,
                menuDisabled: true,
                align: 'right',
                renderer: function(value) {
                    return panel._formatValue(value, panel._summaryColState.getWidth('125'));
                }
            },
            {
                text: languageFormat.getLanguage(10618, 'Total P/L'),
                dataIndex: 'totalpl',
                width: panel._summaryColState.getWidth('totalpl'),
                sortable: false,
                menuDisabled: true,
                align: 'right',
                renderer: function(value) {
                    return panel._formatValue(value, panel._summaryColState.getWidth('totalpl'));
                }
            },
            {
                text: languageFormat.getLanguage(10605, 'Gross Buy'),
                dataIndex: '95',
                width: panel._summaryColState.getWidth('95'),
                sortable: false,
                menuDisabled: true,
                align: 'right'
            },
            {
                text: languageFormat.getLanguage(10606, 'Gross Sell'),
                dataIndex: '96',
                width: panel._summaryColState.getWidth('96'),
                sortable: false,
                menuDisabled: true,
                align: 'right'
            },
            {
                text: languageFormat.getLanguage(10607, 'B/f Buy'),
                dataIndex: '99',
                width: panel._summaryColState.getWidth('99'),
                sortable: false,
                menuDisabled: true,
                align: 'right'
            },
            {
                text: languageFormat.getLanguage(10608, 'B/f Sell'),
                dataIndex: '100',
                width: panel._summaryColState.getWidth('100'),
                sortable: false,
                menuDisabled: true,
                align: 'right'
            },
            {
                text: languageFormat.getLanguage(10609, "Day's Buy"),
                dataIndex: '97',
                width: panel._summaryColState.getWidth('97'),
                sortable: false,
                menuDisabled: true,
                align: 'right'
            },
            {
                text: languageFormat.getLanguage(10610, "Day's Sell"),
                dataIndex: '98',
                width: panel._summaryColState.getWidth('98'),
                sortable: false,
                menuDisabled: true,
                align: 'right'
            },
            {
                text: languageFormat.getLanguage(10613, 'Product Code'),
                dataIndex: '111',
                width: panel._summaryColState.getWidth('111'),
                sortable: false,
                menuDisabled: true,
                align: 'right',
                hidden: true
            },
            {
                text: languageFormat.getLanguage(10614, 'Contract PerVal'),
                dataIndex: '118',
                width: panel._summaryColState.getWidth('118'),
                sortable: false,
                menuDisabled: true,
                align: 'right',
                hidden: true
            }
        ];
    },
    /**
     * Description <br/>
     * 
     * 		generate grid panel
     * 
     */
    _procGridSummary: function () {
        var panel = this;
        
        helper.removeBufferedRun('dpSumCol');
        var tempStorage = new Ext.data.Store({
            model: 'TCPlus.model.PortfolioRecord'
        });

        panel.tPanel_GridSummary = new Ext.grid.Panel({
            type: 'dp', // fixed syncing issue
            title: languageFormat.getLanguage(20050, 'Summary'),
            store: tempStorage,
            columns: {
            	items: panel.getGridCols(),
            	defaults:{
            		tdCls:'display-render'
            	}
            },
            width: '100%',
            viewConfig: getGridViewConfig(panel.tPanel_GridSummary),
            bufferedRenderer: N2N_CONFIG.gridBufferedRenderer,
            leadingBufferZone: N2N_CONFIG.gridLeadingBufferZone,
            trailingBufferZone: N2N_CONFIG.gridTrailingBufferZone,
            enableColumnMove: false,
            border: false,
            listeners: {
                cellclick: function(view, td, cidx, record, tr, ridx, evt) {
                    var accbranch = (derivativePrtfPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[0].trim() + global_AccountSeparator + (derivativePrtfPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[1].trim(); // #account list separator ('-')
                    derivativePrtfPanel.accbranchNo = accbranch;
                    updateActivePanel(view, record, cidx);
                },
                celldblclick: function (view, td, cidx, record, tr, ridx, evt) {
                    var accbranch = (derivativePrtfPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[0].trim() + global_AccountSeparator + (derivativePrtfPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[1].trim(); // #account list separator ('-')
                    derivativePrtfPanel.accbranchNo = accbranch;
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
                resize: function(){
                	bufferedResizeHandler(panel.tPanel_GridSummary);
                	helper.autoFitColumns(panel.tPanel_GridSummary);
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

        panel.tLabel_BFCashBalance = createLabel("-", false, false);
        panel.tLabel_BuyOptMktVal = createLabel("-", false, false);
        panel.tLabel_CurrentBalance = createLabel("-", false, false);
        panel.tLabel_Deposit = createLabel("-", false, false);
        panel.tLabel_EligbleCollateral = createLabel("-", false, false);
        panel.tLabel_Eligibility = createLabel("-", false, false);
        panel.tLabel_Equity = createLabel("-", false, false);
        panel.tLabel_ExcessShortfall = createLabel("-", false, false);
        panel.tLabel_InitialMargin = createLabel("-", false, false);
        panel.tLabel_MarginCall = createLabel("-", false, (sponsorID == 'CIMBDMA' ? true : false));
        panel.tLabel_MaintenanceMargin = createLabel("-", false, false);
        panel.tLabel_NetLiquidation = createLabel("-", false, false);
        panel.tLabel_SellOptMktVal = createLabel("-", false, false);
        panel.tLabel_UnrealizedPL = createLabel("-", false, false);
        panel.tLabel_Withdrawal = createLabel("-", false, false);
        panel.tLabel_RealizedPL = createLabel("-", false);

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
                createLabel(languageFormat.getLanguage(20269, 'B/F Cash Balance'), true, false),
                panel.tLabel_BFCashBalance,
                createLabel(languageFormat.getLanguage(20270, 'Deposit'), true, false),
                panel.tLabel_Deposit,
                createLabel(languageFormat.getLanguage(20271, 'Withdrawal'), true, false),
                panel.tLabel_Withdrawal,
                createLabel(languageFormat.getLanguage(20272, 'Realised P/L'), true, false),
                panel.tLabel_RealizedPL,
                createLabel(languageFormat.getLanguage(20273, 'Current Balance'), true, false),
                panel.tLabel_CurrentBalance,
                createLabel(languageFormat.getLanguage(20274, 'Unrealised P/L'), true, false),
                panel.tLabel_UnrealizedPL,
                createLabel(languageFormat.getLanguage(20275, 'Equity'), true, false),
                panel.tLabel_Equity
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
                createLabel(languageFormat.getLanguage(20276, 'Buy Option Mkt Val'), true, false),
                panel.tLabel_BuyOptMktVal,
                createLabel(languageFormat.getLanguage(20277, 'Sell Option Mkt Val'), true, false),
                panel.tLabel_SellOptMktVal,
                createLabel(languageFormat.getLanguage(20278, 'Net Liquidation'), true, false),
                panel.tLabel_NetLiquidation
            ]
        });

        var tempPanel_3 = new Ext.container.Container({
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
                createLabel(languageFormat.getLanguage(20279, 'Eligible Collateral'), true, false),
                panel.tLabel_EligbleCollateral,
                createLabel(languageFormat.getLanguage(20280, 'Initial Margin'), true, false),
                panel.tLabel_InitialMargin,
                createLabel(languageFormat.getLanguage(20281, 'Maintenance Margin'), true, false),
                panel.tLabel_MaintenanceMargin,
                createLabel(languageFormat.getLanguage(20282, 'Excess / Shortfall'), true, false),
                panel.tLabel_ExcessShortfall,
                createLabel(languageFormat.getLanguage(20287, 'Margin Call'), true, (sponsorID == 'CIMBDMA' ? true : false)),
                panel.tLabel_MarginCall,
                createLabel(languageFormat.getLanguage(20283, 'Eligibility %'), true, false),
                panel.tLabel_Eligibility
            ]
        });

        panel.tPanel_PanelInfo = new Ext.container.Container({
            title: languageFormat.getLanguage(20268, 'Virtual P/L'),
            layout: {
                type: 'column'
            },
            border: false,
            items: [tempPanel_1, tempPanel_2, tempPanel_3],
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
                if (acc.ex == 'MY') {
                    var accRec = [acc.ac + global_AccountSeparator + acc.bc, acc.ac + ' - ' + acc.an + " - " + acc.bc]; // #account list separator ('-')
                    panel.accList.push(accRec);
                }
            }
        }

        var accountStore;
        if(isDealerRemisier){
        	var urlbuf = new Array();

        	urlbuf.push(addPath + 'tcplus/atp/searchAcc?');
        	urlbuf.push('ExtComp=OrderPad');
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
        						
        						if(ex == 'MY'){
        							var accRec = [rec.get('ac') + global_AccountSeparator + rec.get('bc'), rec.get('ac') + ' - ' + rec.get('an') + ' - ' + rec.get('bc')];
            						panel.accList.push(accRec);
        						}
        						
        						return ex == 'MY';
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
            matchFieldWidth: false,
            auotScroll: true,
//    		editable			: false,
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
                    				panel._procCallSummary();
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
                select: function (thisCombo, records, eOpts) {
                    panel.accNo = configutil.getATPAccountParts(thisCombo.getValue())[0].trim();
                    panel.accbranchNo = thisCombo.getValue();
                    panel.refresh();
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


        var filterOptExList = [['0', languageFormat.getLanguage(20654, 'All Exchanges')]];
        for (var ii = 0; ii < global_ExchangeList.length; ii++) {
            filterOptExList.push([global_ExchangeList[ ii ].exchange, global_ExchangeList[ ii ].exchangeName]);
        }

        var filterOptStore = new Ext.data.ArrayStore({
            fields: ['id', 'name'],
            data: filterOptExList
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
                panel._procOpenDetail();
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
            text: '-',
            hidden: showBalanceNNetCashLimit == "TRUE" ? false : true
        });

        panel.tLabel_NetCash = new Ext.form.Label({
            text: '-',
            hidden: showBalanceNNetCashLimit == "TRUE" ? false : true
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

        panel._procCallSummary();
    },
    switchRefresh: function (silent) {
        var panel = this;
        
        helper.runBufferedView(panel.tPanel_GridSummary, 'dpSumBuf', function() {
            reactivateRow(panel.tPanel_GridSummary);
        });
        
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
            console.log('[DerivativePrtf][_procCallInfo] start *** ');

            var url = addPath + 'tcplus/atp/derivativeportfolioinfo?';
            url += 'ex=MY';
            url += '&ac=' + panel.accNo;

            var accountParts = configutil.getATPAccountParts(panel.tComboBoxAccount.getValue());
            if (accountParts.length > 0) {
                url += '&bc=' + accountParts[accountParts.length - 1].trim();
            }

            panel._resetInfo();

            Ext.Ajax.request({
                url: url,
                method: 'GET',
                success: function (response) {

                    try {
                        var obj = Ext.decode(response.responseText);

                        if (obj.s) {
                            panel._updateInfo(obj.d);
                        } else {
                            console.log('[DerivativePrtf][_procCallInfo] error ---> ' + obj.m);
                        }

                        console.log('[DerivativePrtf][_procCallInfo] success *** ');

                    } catch (e) {
                        console.log('[DerivativePrtf][_procCallInfo][inner] Exception ---> ' + e);
                    }

                    if (panel.tLoadMask != null) {
                        panel.tLoadMask.hide();
                    }

                    panel._procCallAccBalance();
                },
                failure: function (response) {
                    console.log('[DerivativePrtf][_procCallInfo][inner] failure ---> ' + response.responseText);

                    if (panel.tLoadMask != null) {
                        panel.tLoadMask.hide();
                    }

                    panel._procCallAccBalance();
                }
            });

        } catch (e) {
            console.log('[DerivativePrtf][_procCallInfo] Exception ---> ' + e);
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

        console.log('[DerivativePrtf][_procCallSummary] start *** ');

        try {
            var accParts = configutil.getATPAccountParts(panel.tComboBoxAccount.getValue());

            var url = addPath + 'tcplus/atp/derivativeportfolio?';
            url += 'ex=MY';
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
                            panel._updateSummary(obj.d);
                            panel._getStockData();
                        } else {
                            if (N2N_CONFIG.activeSub) {
                                panel.firstLoad = false;
                                Storage.refresh();
                            }

                            console.log('[DerivativePrtf][_procCallSummary] error ---> ' + obj.m);
                        }

                        console.log('[DerivativePrtf][_procCallSummary] success *** ');

                    } catch (e) {
                        console.log('[DerivativePrtf][_procCallSummary][inner] Exception ---> ' + e);
                    }

                    panel._procCallInfo();
                },
                failure: function (response) {
                    console.log('[DerivativePrtf][_procCallSummary][inner] failure ---> ' + response.responseText);

                    panel._procCallInfo();
                }
            });

        } catch (e) {
            console.log('[DerivativePrtf][_procCallSummary] Exception ---> ' + e);
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

        console.log('[DerivativePrtf][_procCallAccBalance] start *** ');

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
                            }
                        }

                        console.log('[DerivativePrtf][_procCallAccBalance] success *** ');
                    } catch (e) {
                        console.log('[DerivativePrtf][_procCallAccBalance][inner] Exception ---> ' + e);
                    }
                },
                failure: function (response) {
                    console.log('[DerivativePrtf][_procCallAccBalance][inner] failure ---> ' + e);
                }
            });

        } catch (e) {
            console.log('[DerivativePrtf][_procCallAccBalance] Exception ---> ' + e);
        }

    },
    /**
     * Description <br/>
     * 
     * 		update stock info / data from feed 
     * 
     * @param {object} 	dataObj
     */
    updateFeedRecord: function(dataObj) {
        var panel = this;
        
        if (!panel.forcePLCal) {
            var stkPrice = panel._getStockPrice(dataObj);

            if (stkPrice === null) {
                return; // nothing to update when there is no last, pri
            }
        }

        var updateCellInfo = [];
        var gridStore = panel.tPanel_GridSummary.getStore();
        var totalUnrealisedPL = 0;

        gridStore.each(function(record, i) {
            if (record.get('43') == dataObj[fieldStkCode]) {
                // original last done from OMS
                var tempPrice = record.data['lastDone'];

                var price = panel._getStockPrice(dataObj, tempPrice);

                // update only when price changes
                if (price != null && price != tempPrice) {
                    // update price in record
                    record.data['lastDone'] = price;

                    var avgPrice = jsutil.getNum(record.get('78'));
                    var netPos = jsutil.getNum(record.get('nettPosition'));
                    var contractPerVal = jsutil.getNum(record.get('118'));
                    
                    var unrealised = jsutil.getNum(((price - avgPrice) * netPos * contractPerVal), 0, 6, true);
                    var realisedPL = jsutil.getNum(record.get('125'));
                    var totalPL = jsutil.getNum((jsutil.getNum(unrealised) + realisedPL), 0, 6, true);
                    
                    record.data['unrealised'] = unrealised;
                    record.data['totalpl'] = totalPL;

                    // blinking data
                    updateCellInfo.push({
                        column: 'lastDone',
                        row: i,
                        value: price
                    },
                    {
                        column: 'unrealised',
                        row: i,
                        value: unrealised
                    },
                    {
                        column: 'totalpl',
                        row: i,
                        value: totalPL
                    });

                }

            }

            var unreal = jsutil.getNum(record.get('unrealised'));
            var curRate = jsutil.getNum(record.get('154'), 1); // default rate to 1
            var appliedUnreal = unreal * curRate;

            totalUnrealisedPL += appliedUnreal;
            
        });

        if (panel.value_UnrealisedPL != totalUnrealisedPL) {
            panel.value_UnrealisedPL = totalUnrealisedPL;

            panel.value_Equity = panel.value_CurrentBalance + panel.value_UnrealisedPL;
            panel.value_NetLiquidations = panel.value_Equity + panel.value_BuyOptMktVal + panel.value_SellOptMktVal;
            panel.value_ExcessShortfall = panel.value_NetLiquidations + panel.value_EligibleCollateral - panel.value_InitialMargin;
            if (panel.value_InitialMargin != 0) {
                panel.value_Eligibility = ((panel.value_NetLiquidations + panel.value_EligibleCollateral) / panel.value_InitialMargin) * 100;
            }

            helper.setHtml(panel.tLabel_UnrealizedPL, panel._formatValue(panel.value_UnrealisedPL.toFixed(2)));
            helper.setHtml(panel.tLabel_Equity, panel._formatValue(panel.value_Equity.toFixed(2)));
            helper.setHtml(panel.tLabel_NetLiquidation, panel._formatValue(panel.value_NetLiquidations.toFixed(2)));
            helper.setHtml(panel.tLabel_ExcessShortfall, panel._formatValue(panel.value_ExcessShortfall.toFixed(2)));
            helper.setHtml(panel.tLabel_Eligibility, panel._formatValue(panel.value_Eligibility.toFixed(6)));
        }

        // blinking
        if (panel._summaryActivated) {
            var columns = helper.getGridColumns(panel.tPanel_GridSummary);

            for (var i = 0; i < updateCellInfo.length; i++) {
                var tempInfo = updateCellInfo[i];
                var columnIndex = helper.getColumnIndex(columns, 'dataIndex', tempInfo.column);
                N2NUtil.updateCell(panel.tPanel_GridSummary, tempInfo.row, columnIndex, panel._formatValue(tempInfo.value, panel._summaryColState.getWidth(tempInfo.column)));
                Blinking.setBlink(panel.tPanel_GridSummary, tempInfo.row, columnIndex, "unchange");
            }
        }

    },
    _getStockData: function () {
        var me = this;

        if (me.stkcodes && me.stkcodes.length > 0) {
            conn.getStockList({
                rType: 'dp_stockList',
                list: me.stkcodes,
                f: [fieldStkCode, fieldLast, fieldLacp, fieldOpen, fieldPrev, fieldVol, fieldLotSize, fieldCurrency, fieldInstrument],
                p: 0,
                c: me.stkcodes.length,
                skipMDColCheck: true,
                success: function (res) {
                    if (res.d && res.d.length > 0) {
                        me.forcePLCal = true;
                        for (var i = 0; i < res.d.length; i++) {
                            var fd = _formatSingleVertxData({data: res.d[i]});
                            updater.updateQuote(fd);
                        }
                        
                        me.forcePLCal = false;
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
    _updateInfo: function (dataObj) {
        var panel = this;

        if (dataObj != null) {
            if (dataObj[0] != null) {

                panel.value_BFCashBalance = jsutil.getFloat(dataObj[0]['103']);
                panel.value_Deposit = jsutil.getFloat(dataObj[0]['104']);
                panel.value_WithDrawal = jsutil.getFloat(dataObj[0]['105']);
                panel.value_RealisedPL = jsutil.getFloat(dataObj[0]['125']);

                panel.value_CurrentBalance = 0;
                panel.value_UnrealisedPL = 0;
                panel.value_Equity = 0;

                panel.value_BuyOptMktVal = jsutil.getFloat(dataObj[0]['99']);
                panel.value_SellOptMktVal = jsutil.getFloat(dataObj[0]['100']);
                panel.value_NetLiquidations = 0;

                panel.value_EligibleCollateral = jsutil.getFloat(dataObj[0]['106']);
                panel.value_InitialMargin = jsutil.getFloat(dataObj[0]['107']);
                panel.value_MaintenanceMargin = jsutil.getFloat(dataObj[0]['108']);
                panel.value_ExcessShortfall = 0;
                panel.value_MarginCall = jsutil.getFloat(dataObj[0]['109']);
                panel.value_Eligibility = 0;

                var gridStore = panel.tPanel_GridSummary.getStore();
                gridStore.each(function (record) {
                    var unreal = record.get('unrealised');
                    if (!jsutil.isEmpty(unreal)) {
                        panel.value_UnrealisedPL += parseFloat(unreal * record.get('154'));
                    }
                });

                panel.value_CurrentBalance = ((panel.value_BFCashBalance + panel.value_Deposit) - panel.value_WithDrawal + panel.value_RealisedPL);
                panel.value_Equity = panel.value_CurrentBalance + panel.value_UnrealisedPL;
                panel.value_NetLiquidations = panel.value_Equity + panel.value_BuyOptMktVal + panel.value_SellOptMktVal;
                panel.value_ExcessShortfall = panel.value_NetLiquidations + panel.value_EligibleCollateral - panel.value_InitialMargin;
                if (panel.value_InitialMargin != 0) {
                    panel.value_Eligibility = ((panel.value_NetLiquidations + panel.value_EligibleCollateral) / panel.value_InitialMargin) * 100;
                }

                helper.setHtml(panel.tLabel_BFCashBalance, panel._formatValue(panel.value_BFCashBalance.toFixed(2)));
                helper.setHtml(panel.tLabel_Deposit, panel._formatValue(panel.value_Deposit.toFixed(2)));
                helper.setHtml(panel.tLabel_Withdrawal, panel._formatValue(panel.value_WithDrawal.toFixed(2)));
                helper.setHtml(panel.tLabel_RealizedPL, panel._formatValue(panel.value_RealisedPL.toFixed(2)));
                helper.setHtml(panel.tLabel_CurrentBalance, panel._formatValue(panel.value_CurrentBalance.toFixed(2)));
                helper.setHtml(panel.tLabel_UnrealizedPL, panel._formatValue(panel.value_UnrealisedPL.toFixed(2)));
                helper.setHtml(panel.tLabel_Equity, panel._formatValue(panel.value_Equity.toFixed(2)));
                helper.setHtml(panel.tLabel_BuyOptMktVal, panel._formatValue(panel.value_BuyOptMktVal.toFixed(2)));
                helper.setHtml(panel.tLabel_SellOptMktVal, panel._formatValue(panel.value_SellOptMktVal.toFixed(2)));
                helper.setHtml(panel.tLabel_NetLiquidation, panel._formatValue(panel.value_NetLiquidations.toFixed(2)));
                helper.setHtml(panel.tLabel_EligbleCollateral, panel._formatValue(panel.value_EligibleCollateral.toFixed(2)));
                helper.setHtml(panel.tLabel_InitialMargin, panel._formatValue(panel.value_InitialMargin.toFixed(2)));
                helper.setHtml(panel.tLabel_MaintenanceMargin, panel._formatValue(panel.value_MaintenanceMargin.toFixed(2)));
                helper.setHtml(panel.tLabel_ExcessShortfall, panel._formatValue(panel.value_ExcessShortfall.toFixed(2)));
                helper.setHtml(panel.tLabel_MarginCall, panel._formatValue(panel.value_MarginCall.toFixed(2)));
                helper.setHtml(panel.tLabel_Eligibility, panel._formatValue(panel.value_Eligibility.toFixed(6)));
            }
        }
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
                if (record['43'] != null) {
                    panel.stkcodes.push(record['43']);
                }
                if (!record.StkCode) {
                    // maps more fields
                    record.StkCode = record['43'];
                    record.StkName = record['44'];
                }

                var value = record[ '111' ];
                var tempLastDone = '';
                var tempUnrealised = '';
                var totalPL = 0;
                var realisedPL = record['125'];

                var tempNettPosition = 0;
                var grossBuy = record['95'];
                var grossSell = record['96'];
                tempNettPosition = grossBuy - grossSell;

                if (value) {
                    if (value.indexOf('~') != -1) {
                        var temp = value.split('~');
                        tempUnrealised = temp[0];
                        tempLastDone = temp[1];
                    }
                }

                totalPL = parseFloat((+tempUnrealised) + (+realisedPL)); //add '+' in front of variable to force string to become numbers

                record[ 'lastDone' ] = tempLastDone;
                record[ 'unrealised' ] = tempUnrealised;
                record['nettPosition'] = tempNettPosition;
                record['78'] = parseFloat(record['78']).toFixed(6);
                record['125'] = parseFloat(record['125']).toFixed(6);
                record['totalpl'] = totalPL.toFixed(6);
            }

            dataObj[i] = record;
        }

        var temoObject = {};
        temoObject.s = true;
        temoObject.c = dataObj.length;
        temoObject.data = dataObj;
        
        resetGridScroll(panel.tPanel_GridSummary);
        panel.tPanel_GridSummary.store.loadData(temoObject.data);
        activateRow(panel.tPanel_GridSummary);
        
        n2ncomponents.activateEmptyScreens();
        
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
            var NetCashLimit = 0;

            if (dataObj.length > 0) {
                if (dataObj[0] != null) {
                    if (dataObj[0].ac == panel.accNo) {
                        BalanceLimit = parseFloat(dataObj[0].al);
                        NetCashLimit = parseFloat(dataObj[0].ncl);
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
                BalanceLimit = BalanceLimit.toFixed(2);
                helper.setHtml(panel.tLabel_Balance, panel.currentCurrency + ' ' + panel._formatValue(BalanceLimit));
            }

            if (NetCashLimit) {
                NetCashLimit = NetCashLimit.toFixed(2);
                helper.setHtml(panel.tLabel_NetCash, panel.currentCurrency + ' ' + panel._formatValue(NetCashLimit));
            }
            panel.compRef.topBar.doLayout();

        } catch (e) {
            console.log('[DerivativePrtf][updateAccBal] Exception ---> ' + e);
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

        panel.value_BFCashBalance = 0;
        panel.value_Deposit = 0;
        panel.value_WithDrawal = 0;
        panel.value_RealisedPL = 0;
        panel.value_CurrentBalance = 0;
        panel.value_UnrealisedPL = 0;
        panel.value_Equity = 0;
        panel.value_BuyOptMktVal = 0;
        panel.value_SellOptMktVal = 0;
        panel.value_NetLiquidations = 0;
        panel.value_EligibleCollateral = 0;
        panel.value_InitialMargin = 0;
        panel.value_MaintenanceMargin = 0;
        panel.value_ExcessShortfall = 0;
        panel.value_MarginCall = 0;
        panel.value_Eligibility = 0;

        helper.setHtml(panel.tLabel_BFCashBalance, '-');
        helper.setHtml(panel.tLabel_Deposit, '-');
        helper.setHtml(panel.tLabel_EligbleCollateral, '-');
        helper.setHtml(panel.tLabel_InitialMargin, '-');
        helper.setHtml(panel.tLabel_MaintenanceMargin, '-');
        helper.setHtml(panel.tLabel_MarginCall, '-');
        helper.setHtml(panel.tLabel_Withdrawal, '-');
        helper.setHtml(panel.tLabel_RealizedPL, '-');
        helper.setHtml(panel.tLabel_BuyOptMktVal, '-');
        helper.setHtml(panel.tLabel_CurrentBalance, '-');
        helper.setHtml(panel.tLabel_Eligibility, '-');
        helper.setHtml(panel.tLabel_Equity, '-');
        helper.setHtml(panel.tLabel_ExcessShortfall, '-');
        helper.setHtml(panel.tLabel_NetLiquidation, '-');
        helper.setHtml(panel.tLabel_SellOptMktVal, '-');
        helper.setHtml(panel.tLabel_UnrealizedPL, '-');
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
                name: record.get('44'),
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
    searchAccount: function (searchValue) {
        var panel = this;
        try {
        	searchValue = searchValue.toLowerCase();
            panel.tComboBoxAccount.doQuery(searchValue, true);
            
            /*
            if (cmp != 'addpf') {
                panel.setLoading(true);
            } else {
                panel.newWindow.setLoading(true);
            }
            
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
                failure: function (response) {
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
        // recreates col states
        panel.createColStates();
        
        helper.runBufferedView(panel.tPanel_GridSummary, 'dpSumCol', function() {
            panel.tPanel_GridSummary.reconfigure(null, panel.getGridCols());
        });
        panel.runAutoAdjustWidth = false;
    },
    updateColWidthCache: function(column, newWidth) {
        var panel = this;

        panel._summaryColState.setWidth(column.dataIndex, newWidth);
        panel._summaryColState.save();
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
    focusSearchBox: function() {
        focusManager.focusSearchbox(this.tComboBoxAccount);
    },
    _getStockPrice: function(dataObj, cachedLast) {
        var price = null;

        var vol = jsutil.getNum(dataObj[fieldVol], null);
        var last = jsutil.getNum(dataObj[fieldLast], null);
        var lacp = jsutil.getNum(dataObj[fieldLacp], null);
        var open = jsutil.getNum(dataObj[fieldOpen], null);
        var prev = jsutil.getNum(dataObj[fieldPrev], null);

        if (vol > 0 && last !== null) {
            price = dataObj[fieldLast];
        } else if (cachedLast != null) {
            price = cachedLast;
        } else if (lacp !== null) {
            price = dataObj[fieldLacp];
        } else if (open !== null) {
            price = dataObj[fieldOpen];
        } else if (prev !== null) {
            price = dataObj[fieldPrev];
        }

        return price;
    }
            
});
