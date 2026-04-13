/*
 * this : Ext.panel.Panel
 * 
 * 
 * 
 * initComponent 	: initial this object function / design this panel 
 * 
 * callRecord           : retrieve buy sell panel record / call ajax method 
 * updatePanel          : update buy and sell grid panel 
 * 
 * nextPage             : paging next button function
 * previousPage         : paging previous button function
 * blockButton          : block previous / next paging button
 * 
 * gridView             : create new grid panel / design grid panel
 *  
 * editForm		: create edit form / design edit form
 * editFormSubmit       : save edit form record / call ajax to save record
 * 
 * deleteForm           : create delete form design / design delete form
 * deleteFormSubmit     : submite delete form record / call ajax to delete record
 * 
 * openNewWindow        : pop up a new window / design pop up new window
 * 
 */
Ext.define('TCPlus.view.portfolio.EquityPrtfDetail', {
    extend: 'TCPlus.view.portfolio.PortfolioDetail',
    requires: [
        'TCPlus.view.portfolio.PortfolioDetail'
    ],
    alias: 'widget.equityprtfdetail',
    title: '',
    header: false,
    displayCategory: null,
    stkCode: '', // store this stock code
    stkName: '', // store this stock name
    accNo: '', // store this account number/id
    branchNo: '',
    prtfNo: '', // store this port folio number/id
    onClickPaging: 'buy', // verify which panel click paging
    buyPageNumber: 0, // store buy panel page number
    sellPageNumber: 0, // store sell panel page number
    numberOfRecord: 10, // set display of number record
    mainTab: null, // this object main tab
    buyPanel: null, // this object buy grid panel
    sellPanel: null, // this object sell grid panel
    loadMask: null, // loading panel 
    clickOnGrid_buy: null, // store grid panel on click
    clickOnRowNo_buy: 0, // store grid panel on click row number
    clickOnGrid_sell: null, // store grid panel on click
    clickOnRowNo_sell: 0, // store grid panel on click row number
    newWindow: null, // display new window
    onBuySellPanel: 1, // record active on buy or sell panel, 1 = buy , 2 = sell
    onReady: false,
    settOpt: '',
    slcomp: 'epd',
    type: 'portfolio_detail',
    compRef: {},
    /**
     * Description <br />
     * 		when this object create will call this function
     */
    initComponent: function() {
        var panel = this;
        /* FIX: update display category first */
        panel.displayCategory = panel.jsonString.displayCategory;

        // create main panel
        // this panel is to display tab panel 
        panel.mainTab = new Ext.tab.Panel({
            border: false,
            tabPosition: 'top',
            height: 200, // gives some height to fix top load mask issue
            listeners: {
                afterrender: function() {
                    panel.loadMask = panel.mainTab.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
                },
                tabchange: function(thisTab, thisPanel) {
                    if (panel.loadMask != null) {
                        if (panel.onReady) {
                            if (thisPanel.title.toLowerCase() == "buy") {
                                panel.onBuySellPanel = 1;
                            } else {
                                panel.onBuySellPanel = 2;
                            }
                            panel.onClickPaging = thisPanel.title.toLowerCase();
                            panel.callRecord();
                        }
                    }
                }
            }
        });

        // panel to store tab panel
        var defaultConfig = {
            border: false,
            layout: 'fit',
            title: languageFormat.getLanguage(20267, 'Portfolio Detail'),
            listeners: {
                afterrender: function(thisComp) {
                    /*
                     * create new store for sell and buy
                     */
                    var storeBuy = Ext.create('Ext.data.Store', {
                        model: 'TCPlus.model.PortfolioDetailRecord',
                        listeners: {
                            datachanged: function(thisStore) {
                                panel.blockButton("Buy");
                            }
                        }
                    });
                    var storeSell = Ext.create('Ext.data.Store', {
                        model: 'TCPlus.model.PortfolioDetailRecord',
                        listeners: {
                            datachanged: function(thisStore) {
                                panel.blockButton("Sell");
                            }
                        }
                    });

                    // set up grid view panel		
                    panel.buyPanel = panel.gridView(storeBuy, 'Buy');
                    panel.sellPanel = panel.gridView(storeSell, 'Sell');

                    // add child tab panel into parent panel
                    panel.mainTab.add(panel.buyPanel).show();
                    panel.mainTab.add(panel.sellPanel).show();
                    // active first child tab panel 
                    panel.mainTab.setActiveTab(0);

                    panel.onReady = true;
                    panel.blockButton("Buy");

                }
            },
            items: [
                panel.mainTab
            ]
        };

        Ext.apply(this, defaultConfig);
        this.callParent();

    },
    setConf: function() {
        var panel = this;
        
        panel.stkCode = panel.jsonString.stkCode;
        panel.stkName = panel.jsonString.StkName;
        panel.accNo = panel.jsonString.accNo;
        panel.branchNo = panel.jsonString.branchNo;
        panel.settOpt = panel.jsonString.settOpt;
        n2nLayoutManager.updateTitle(panel, languageFormat.getLanguage(20267, 'Portfolio Detail') + ' - ' + stockutil.getStockName(panel.stkName));
    },
    /**
     * Description <br />
     * 
     * 		retrieve record from server side
     * 		
     */
    callRecord: function() {
        var panel = this;

        panel.setConf();

        panel.loadMask.show();
        panel.clickOnGrid_buy = null;
        panel.clickOnGrid_sell = null;

        var pagingNumber = 0;
        if (panel.onClickPaging.toLowerCase() == "buy") {
            pagingNumber = panel.buyPageNumber;
        } else {
            pagingNumber = panel.sellPageNumber;
        }

        var totalRecord = 0;
        if (pagingNumber == 0) {
            totalRecord = panel.numberOfRecord;
        } else {
            totalRecord = (parseInt(panel.numberOfRecord) * pagingNumber);
        }

        var tempUrl = new Array();
        tempUrl.push(addPath + 'tcplus/portFolioDetail?');
        tempUrl.push("ac=");
        tempUrl.push(panel.accNo);
        tempUrl.push("&bc=");
        tempUrl.push(panel.branchNo);
        tempUrl.push("&sc=");

        if (panel.stkCode.indexOf(".") != -1) {
            tempUrl.push((panel.stkCode.split("."))[0]);
        } else {
            tempUrl.push(panel.stkCode);
        }
        tempUrl.push("&pn=");
        tempUrl.push(pagingNumber);
        tempUrl.push("&nr=");
        tempUrl.push(totalRecord);
        tempUrl.push("&ex=");
        tempUrl.push("&s=");
        tempUrl.push(panel.onBuySellPanel);
        tempUrl.push("&category=");
        tempUrl.push(panel.displayCategory);
        tempUrl.push("&settOpt=");
        tempUrl.push(panel.settOpt);

        var url = tempUrl.join('');

        Ext.Ajax.request({
            url: url,
            method: 'POST',
            tradeType: panel.onBuySellPanel,
            success: function(response, opts) {
                try {
                    /*
                     * convert text to json
                     */
                    var obj = Ext.decode(response.responseText);
                    panel.updatePanel(obj, opts.tradeType);
                } catch (e) {
                    console.log("[EquityPrtfDetail][callRecord] Exception ---> " + e);
                }
                panel.loadMask.hide();
            },
            failure: function(response) {
                console.log("[EquityPrtfDetail][callRecord] response ---> " + response.responseText);
            }
        });
    },
    /**
     * Description <br />
     * 
     * 		update buy / sell panel
     * 		
     */
    updatePanel: function(object, tradeType) {
        var panel = this;
        var tGrid = panel.buyPanel;
        var tStore = tGrid.store;
        
        if (tradeType == '2') { // sell
            tGrid = panel.sellPanel;
            tStore = tGrid.store;
        }

        if (object.s) {
            tStore.loadRawData(object);
            tGrid.getSelectionModel().select(0);
        } else {
            tStore.removeAll(); // fix empty record issue
            //helper.setGridEmptyText(tGrid, object.msg);
            helper.setGridEmptyText(tGrid, languageFormat.getLanguage(31001, 'Your portfolio is empty.'));
        }
    },
    /**
     * Description <br />
     * 
     * 		paging next button function
     */
    nextPage: function(side) {
        var panel = this;

        var fieldObject = Ext.getCmp(panel.id + "_" + side);

        var paging = parseInt(fieldObject.getValue()) + 1;
        fieldObject.setValue(paging);
        if (side.toLowerCase() == "buy") {
            panel.buyPageNumber = paging;
        } else {
            panel.sellPageNumber = paging;
        }

        panel.onClickPaging = side.toLowerCase();
        panel.callRecord();
    },
    /**
     * Description <br />
     * 
     * 		paging previous button function
     */
    previousPage: function(side) {
        var panel = this;

        var fieldObject = Ext.getCmp(panel.id + "_" + side);

        var paging = parseInt(fieldObject.getValue()) - 1;
        if (paging < 1) {
            return;
        }

        fieldObject.setValue(paging);
        if (side.toLowerCase() == "buy") {
            panel.buyPageNumber = paging;
        } else {
            panel.sellPageNumber = paging;
        }

        panel.onClickPaging = side.toLowerCase();
        panel.callRecord();
    },
    /**
     * Description <br/>
     * 
     * 		block next previous paging button
     */
    blockButton: function(side) {
        var panel = this;

        // get next / previous button
        var fieldObject = Ext.getCmp(panel.id + "_" + side);
        var nextButtonId = Ext.getCmp("next_" + panel.id + "_" + side);
        var prevButtonId = Ext.getCmp("prev_" + panel.id + "_" + side);

        // get store record
        var recordNumber = 0;
        if (side.toLowerCase() == "buy") {
            recordNumber = panel.buyPanel.store.getCount();
        } else {
            recordNumber = panel.sellPanel.store.getCount();
        }

        if (fieldObject.getValue() == "1") {
            if (recordNumber < panel.numberOfRecord) {
                prevButtonId.setDisabled(true);
                nextButtonId.setDisabled(true);
            } else {
                prevButtonId.setDisabled(true);
                nextButtonId.setDisabled(false);
            }
        } else {
            if (recordNumber < panel.numberOfRecord) {
                prevButtonId.setDisabled(false);
                nextButtonId.setDisabled(true);
            } else {
                prevButtonId.setDisabled(false);
                nextButtonId.setDisabled(false);
            }
        }
    },
    /**
     * Description <br />
     * 
     * return data grid view
     * 
     */
    gridView: function(store, title) {
        var panel = this;
        
        var editBtn = Ext.create('Ext.button.Button', {
            thisSide: title,
            text: languageFormat.getLanguage(10021, 'Edit'),
            tooltip: languageFormat.getLanguage(10021, 'Edit'),
            iconCls: 'icon-portfolio-detail-edit',
            reference: 'editbtn',
            disabled: true,
            hidden: (panel.displayCategory == 'auto') ? (showPortFolioDetailUpdate.toLowerCase() == "true" ? false : true) : (global_showPortFolioManualDetailUpdate.toLowerCase() == "true" ? false : true), // verify from main.js
            listeners: {
                click: function() {
                    panel.editForm(this.thisSide);
                }
            }
        });
        var deleteBtn = Ext.create('Ext.button.Button', {
            thisSide: title,
            text: languageFormat.getLanguage(10013, 'Delete'),
            tooltip: languageFormat.getLanguage(10013, 'Delete'),
            iconCls: 'icon-portfolio-detail-delete',
            reference: "deletebtn",
            disabled: true,
            hidden: (panel.displayCategory == 'auto') ? (showPortFolioDetailDelete.toLowerCase() == "true" ? false : true) : (global_showPortFolioManualDetailDelete.toLowerCase() == "true" ? false : true), // verify from main.js
            listeners: {
                click: function() {
                    panel.deleteForm(this.thisSide);
                }
            }
        });
        var refreshBtn = Ext.create('Ext.button.Button', {
            thisSide: title,
            text: languageFormat.getLanguage(10008, 'Refresh'),
            tooltip: languageFormat.getLanguage(10008, 'Refresh'),
            iconCls: 'icon-reset',
            listeners: {
                click: function() {
                    panel.callRecord();
                }
            }

        });
        
        // translation for the Buy/Sell Tab
        var titleAtTab = '';
        if (title == 'Buy'){
        	titleAtTab = languageFormat.getLanguage(10001, "Buy");
        } else if (title == 'Sell') {
        	titleAtTab = languageFormat.getLanguage(10002, "Sell");
        }
        
        var gridPanel = Ext.create('Ext.grid.Panel',{
            store: store,
            columns: panel.getColumns(),
            title: titleAtTab,
            width: '100%',
            height: n2nLayoutManager.isTabLayout() ? (quoteScreen.up().up().body.getHeight() - 27) : (panel.body.getHeight() - 10),
            header: false,
            enableColumnMove: false,
            border: false,
            referenceHolder: true,
            // trackMouseOver: false,
            listeners: {
                select: function(thisView, record, index, e) {
                    var pgrid = this;
                    if (record != null) {
                    	if(panel.displayCategory == 'auto'){
                    		var prtfEditFlag = record.get('prtfEditFlag');
                    		if(prtfEditFlag){
                    			var noEditDelete = 0;
                    			var canEdit = 1;
                    			var canDelete = 2;
                    			if(prtfEditFlag == noEditDelete){
                    				pgrid.lookupReference("editbtn").setDisabled(true);
                    				pgrid.lookupReference("deletebtn").setDisabled(true);
                    			}else{
                    				if((prtfEditFlag & canEdit) == canEdit){
                    					pgrid.lookupReference("editbtn").setDisabled(false);
                        			}
                        			if((prtfEditFlag & canDelete) == canDelete){
                        				pgrid.lookupReference("deletebtn").setDisabled(false);
                        			}
                    			}
                    		}else{
                    			if (record.get('orderSource').toLowerCase() == "c" || record.data['orderSource'].toLowerCase() == "a") {
                					pgrid.lookupReference("editbtn").setDisabled(false);
                					pgrid.lookupReference("deletebtn").setDisabled(false);
                				} else {
                					pgrid.lookupReference("editbtn").setDisabled(true);
                					pgrid.lookupReference("deletebtn").setDisabled(true);
                				}
                    		}
                    	}else{
                    		pgrid.lookupReference("editbtn").setDisabled(false);
        					pgrid.lookupReference("deletebtn").setDisabled(false);
                    	}
                        
                        if (pgrid.title == languageFormat.getLanguage(10001, 'Buy')) {
                            panel.clickOnGrid_buy = pgrid;
                            panel.clickOnRowNo_buy = index;
                        } else {
                            panel.clickOnGrid_sell = pgrid;
                            panel.clickOnRowNo_sell = index;
                        }
                    }
                }
            },
            bbar: {
                items: [
                    editBtn,
                    deleteBtn,
                    refreshBtn,
                    new Ext.button.Button({
                        text: languageFormat.getLanguage(10004, 'Export CSV'),
                        tooltip: languageFormat.getLanguage(10004, 'Export CSV'),
                        thisSide: title,
                        hidden: !isDesktop,
                        iconCls: 'icon-export',
                        listeners: {
                            click: function() {
                                if (this.thisSide.toLowerCase() == "buy") {
                                    ExportFile.initial(ExportFile.FILE_CSV, panel.buyPanel);
                                } else {
                                    ExportFile.initial(ExportFile.FILE_CSV, panel.sellPanel);
                                }
                            }
                        }

                    }),
                    '->',
                    new Ext.button.Button({
                        id: "prev_" + panel.id + "_" + title,
                        thisSide: title,
                        thisField: panel.id + '_' + title,
                        iconCls: 'x-tbar-page-prev',
                        tooltip: languageFormat.getLanguage('10049', 'Previous'),
                        disabled: true,
                        handler: function() {
                            panel.previousPage(this.thisSide);
                        }
                    }),
                    '-',
                    {// display current paging number text field
                        xtype: 'numericfield',
                        id: panel.id + '_' + title,
                        value: 1,
                        // cls: 'x-tbar-page-number',
                        allowDecimals: false,
                        allowNegative: false,
                        enableKeyEvents: true,
                        selectOnFocus: true,
                        submitValue: false,
                        readOnly: true,
                        width: 30,
                        fieldStyle: 'text-align:center'
                    },
                    '-',
                    new Ext.button.Button({
                        id: "next_" + panel.id + "_" + title,
                        thisSide: title,
                        thisField: panel.id + '_' + title,
                        iconCls: 'x-tbar-page-next',
                        tooltip: languageFormat.getLanguage('10015', 'Next'),
                        handler: function() {
                            panel.nextPage(this.thisSide);
                        }
                    })
                ]
            }
        });

        return gridPanel;
    },
    /**
     * Description <br />
     * 		return grid view column 
     */
    getColumns: function() {
    	var orderNo = {header: languageFormat.getLanguage(20182, 'Order No.'), dataIndex: 'SubAndOrderNo', width: 165, sortable: true, menuDisabled: true};
//    	if(prtfTypeToolTip != ""){ //check prtfTypeToolTip have or not.
//      	orderNo.tooltip = prtfTypeToolTip;
//  	}
    	orderNo.tooltip = languageFormat.getLanguage(10739, 'I = Traded via i*Trade<br/>A = Manual Entry via i*Trade<br/>B = Migrated Entry from Old i*Trade<br/>C = Transferred In / Out Entry');
        return [
            {header: languageFormat.getLanguage(10717, 'Document No'), dataIndex: 'documentNo', width: 200, sortable: true, menuDisabled: true, hidden: true},
            {header: languageFormat.getLanguage(10721, 'Document Sequence No'), dataIndex: 'documentSequenceNo', width: 200, sortable: true, menuDisabled: true, hidden: true},
            orderNo,
            {header: languageFormat.getLanguage(10722, 'ori Order No'), dataIndex: 'orderNo', width: 150, sortable: true, menuDisabled: true, hidden: true},
            {header: languageFormat.getLanguage(10723, 'Sub Order No'), dataIndex: 'subOrderNo', width: 200, sortable: true, menuDisabled: true, hidden: true},
            {header: languageFormat.getLanguage(10724, 'BhCli Code'), dataIndex: 'bhCliCode', width: 200, sortable: true, menuDisabled: true, hidden: true},
            {header: languageFormat.getLanguage(10725, 'Contract No'), dataIndex: 'contractNo', width: 200, sortable: true, menuDisabled: true, hidden: true},
            {header: languageFormat.getLanguage(10726, 'Side'), dataIndex: 'side', width: 50, sortable: true, menuDisabled: true},
            {header: languageFormat.getLanguage(10927, 'Date'), dataIndex: 'Date', width: 100, sortable: true, menuDisabled: true, align: 'right',
                renderer: function(value) {
                    return Ext.Date.format(value, 'd/m/Y');
                }
            },
            {header: languageFormat.getLanguage(10123, 'Time'), dataIndex: 'Time', width: 100, sortable: true, menuDisabled: true, align: 'right', 
                renderer: function(value) {
                    return Ext.Date.format(value, 'H:i');
                }
            },
            {header: languageFormat.getLanguage(20626, 'Quantity'), dataIndex: 'quantity', width: 100, sortable: true, menuDisabled: true, align: 'right'},
            {header: languageFormat.getLanguage(10727, 'Quantity Left'), dataIndex: 'quantityLeft', width: 200, sortable: true, menuDisabled: true, hidden: true},
            {header: languageFormat.getLanguage(20835, 'Price'), dataIndex: 'price', width: 100, sortable: true, menuDisabled: true, align: 'right'},
            {header: languageFormat.getLanguage(20178, 'Order Source'), dataIndex: 'orderSource', width: 200, sortable: true, menuDisabled: true, hidden: true},
            {header: languageFormat.getLanguage(10728, 'Transaction Fee'), dataIndex: 'transactionFee', width: 140, sortable: true, menuDisabled: true, align: 'right'},
            {header: languageFormat.getLanguage(10731, 'Exchange Code'), dataIndex: 'exchangeCode', width: 200, sortable: true, menuDisabled: true, hidden: true},
            {header: languageFormat.getLanguage(10132, 'Currency'), dataIndex: 'currency', width: 200, sortable: true, menuDisabled: true, hidden: true},
            {header: languageFormat.getLanguage(21025, 'Total Value'), dataIndex: 'totalRecord', width: 100, sortable: true, menuDisabled: true, align: 'right'},
            {header: languageFormat.getLanguage(10729, 'Total Quantity Buy'), dataIndex: 'quantityBuy', width: 200, sortable: true, menuDisabled: true, hidden: true},
            {header: languageFormat.getLanguage(10730, 'Total Quantity Sold'), dataIndex: 'quantitySold', width: 200, sortable: true, menuDisabled: true, hidden: true},
            {header: languageFormat.getLanguage(10923, 'SettMode'), dataIndex: 'settOpt', width: 200, sortable: true, menuDisabled: true},
            {header: languageFormat.getLanguage(10919, 'SettCurr'), dataIndex: 'settCurr', width: 200, sortable: true, menuDisabled: true, hidden: true}
        ];

    },
    /**
     * Description <br/>
     * 
     * 	edit form 
     */
    editForm: function(side) {
        var panel = this;

        /*
         * get data grid from this object to determine click on grid data record
         */
        var thisGrid = null;
        var thisRowNo = 0;
        if (side.toLowerCase() == "buy") {
            if (panel.clickOnGrid_buy == null) {
                return;
            }
            thisGrid = panel.clickOnGrid_buy;
            thisRowNo = panel.clickOnRowNo_buy;
        } else {
            if (panel.clickOnGrid_sell == null) {
                return;
            }
            thisGrid = panel.clickOnGrid_sell;
            thisRowNo = panel.clickOnRowNo_sell;
        }

        // get the record from grid data record
        var store = thisGrid.store.getAt(thisRowNo);

        // this is get the total value : quantity + price + transactionFee
        // before sum up add value, it need to remove "," symbol 
        // bug - v1.3.14.8
        var totalValue = calculationOfPortFolioDetail(store.get('quantity'),
                store.get('price'),
                store.get('transactionFee'),
                store.get('side'));

        // design form record
        var newPanel = new Ext.form.Panel({
            layout: 'form',
            bodyStyle: 'padding:5px',
            baseCls: '',
            autoScroll: true,
            defaults: {
                labelStyle: 'width:120px;',
                readOnly: true,
                fieldStyle: {
                    textAlign: 'right',
                    background: '#E6E6E6'
                }
            },
            items: [
                new Ext.form.field.Text({
                    id: "eqpfd_docNo_txtField",
                    fieldLabel: languageFormat.getLanguage(10717, 'Document No'),
                    readOnly: true,
                    hidden: true,
                    value: store.data['documentNo']
                }),
                new Ext.form.field.Text({
                    id: "eqpfd_docSqNo_txtField",
                    fieldLabel: languageFormat.getLanguage(10721, 'Document Sequence No'),
                    readOnly: true,
                    hidden: true,
                    value: store.data['documentSequenceNo']
                }),
                new Ext.form.field.Text({
                    id: "eqpfd_orderSource_txtField",
                    fieldLabel: languageFormat.getLanguage(20178, 'Order Source'),
                    readOnly: true,
                    hidden: true,
                    value: store.data['orderSource']
                }),
                new Ext.form.field.Text({
                    id: "eqpfd_accNo_txtField",
                    fieldLabel: languageFormat.getLanguage(20833, 'Account No.'),
                    readOnly: true,
                    value: panel.accNo
                }),
                new Ext.form.field.Text({
                    id: "eqpfd_exchg_txtField",
                    fieldLabel: languageFormat.getLanguage(20301, 'Exchange'),
                    readOnly: true,
                    value: store.data['exchangeCode']
                }),
                new Ext.form.field.Text({
                    id: "eqpfd_orderDate_txtField",
                    fieldLabel: languageFormat.getLanguage(20206, 'Order Date'),
                    readOnly: true,
                    value: store.data['Date'] + " " + store.data['Time']
                }),
                new Ext.form.field.Text({
                    id: "eqpfd_action_txtField",
                    fieldLabel: languageFormat.getLanguage(21202, 'Action (Buy/Sell)'),
                    readOnly: true,
                    value: store.data['side']
                }),
                new Ext.form.field.Text({
                    id: "eqpfd_stkName_txtField",
                    fieldLabel: languageFormat.getLanguage(21203, 'Stock Name (Code)'),
                    readOnly: true,
                    value: panel.stkName + ' (' + panel.stkCode + ')'
                }),
                Ext.create('widget.numericfield', {
                    id: "eqpfd_mQuantity_txtField",
                    fieldLabel: languageFormat.getLanguage(21204, 'Matched Quantity'),
                    readOnly: true,
                    enableKeyEvents: true,
                    useThousandSeparator: true,
                    thousandSeparator: ',',
                    decimalPrecision: 3,
                    value: jsutil.getNumFromFormat(store.data['quantity'])
                }),
                {
                    xtype: 'numericfield',
                    id: "eqpfd_mPrice_txtField",
                    fieldLabel: languageFormat.getLanguage(21205, 'Match Price'),
                    readOnly: false,
                    enableKeyEvents: true,
                    useThousandSeparator: true,
                    thousandSeparator: ',',
                    decimalPrecision: decimalCtrl.prtf.matchprice || 3,
                    allowNegative: false,
                    value: jsutil.getNumFromFormat(store.data['price']),
                    fieldStyle: 'text-align:right',
                    listeners: {
                        keyup: function() {
                            panel.calculateTotal();
                        }
                    }
                },
                {
                    xtype: 'numericfield',
                    id: "eqpfd_transFee_txtField",
                    fieldLabel: languageFormat.getLanguage(21206, 'Trans. Fee'),
                    readOnly: false,
                    enableKeyEvents: true,
                    useThousandSeparator: true,
                    thousandSeparator: ',',
                    decimalPrecision: 3,
                    value: jsutil.getNumFromFormat(store.data['transactionFee']),
                    fieldStyle: 'text-align:right',
                    listeners: {
                        keyup: function() {
                            panel.calculateTotal();
                        }
                    }
                },
                Ext.create('widget.numericfield', {
                    xtype: 'numericfield',
                    id: "eqpfd_totalValue_txtField",
                    readOnly: true,
                    fieldLabel: languageFormat.getLanguage(21207, 'Total Contract Value'),
                    enableKeyEvents: true,
                    useThousandSeparator: true,
                    thousandSeparator: ',',
                    decimalPrecision: 3,
                    value: totalValue
                })
            ],
            buttons: [
                new Ext.button.Button({
                    text: languageFormat.getLanguage(20849, 'Submit'),
                    cls: 'fix_btn',
                    handler: function() {
                        panel.editFormSubmit();
                    }
                }),
                new Ext.button.Button({
                    text: languageFormat.getLanguage(10010, 'Cancel'),
                    cls: 'fix_btn',
                    handler: function() {
                        panel.newWindow.destroy();
                    }
                })
            ]

        });

        // call new window 
        panel.openNewWindow(newPanel, store.data['SubAndOrderNo'], 300, 325);
    },
    /**
     * Description <br/>
     * 
     * 	edit form save
     */
    editFormSubmit: function() {
        var panel = this;

        if (panel.newWindow == null) {
            return;
        }

        var docNo = Ext.getCmp("eqpfd_docNo_txtField").getValue();
        var docSqNo = Ext.getCmp("eqpfd_docSqNo_txtField").getValue();
        var accNo = Ext.getCmp("eqpfd_accNo_txtField").getValue();
        var exchg = Ext.getCmp("eqpfd_exchg_txtField").getValue();
        var orderSource = Ext.getCmp("eqpfd_orderSource_txtField").getValue();
        var stkName = panel.stkCode;
        var mQuantity = Ext.getCmp("eqpfd_mQuantity_txtField").getValue();
        var mPrice = Ext.getCmp("eqpfd_mPrice_txtField").getValue();
        var transFee = Ext.getCmp("eqpfd_transFee_txtField").getValue();
        var totalValue = Ext.getCmp("eqpfd_totalValue_txtField").getValue();

        if (mPrice == null) {
            msgutil.alert(languageFormat.getLanguage(31002, 'Please kindly enter all the data before submit.'));
            return;
        }

        panel.loadMask.show();

        var tempUrl = new Array();
        tempUrl.push(addPath + 'tcplus/portFolioDetailUpdate?');
        tempUrl.push("an=");
        tempUrl.push(accNo);
        tempUrl.push("&dn=");
        tempUrl.push(docNo);
        tempUrl.push("&dsn=");
        tempUrl.push(docSqNo);
        tempUrl.push("&ex=");
        tempUrl.push(exchg);
        tempUrl.push("&os=");
        tempUrl.push(orderSource);
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

        var url = tempUrl.join('');

        Ext.Ajax.request({
            url: url,
            method: 'POST',
            success: function(response) {

                try {
                    var obj = Ext.decode(response.responseText);

                    if (obj.s) {
                    	msgutil.info(languageFormat.getLanguage(31005, 'The record has been updated to your portfolio.'));
                        panel.callRecord();
                        panel.refreshPortfolio();
                    } else {
                        panel.loadMask.hide();
                    	msgutil.warn(languageFormat.getLanguage(31008, 'The record was not updated to your portfolio. Kindly try again.'));
                    }
                } catch (e) {
                    console.log("[EquityPrtfDetail][editFormSubmit] Exception ---> " + e);
                }
            }
        });

        panel.newWindow.destroy();
    },
    /**
     * Decription <br/>
     * 
     * 	create delete form
     */
    deleteForm: function(side) {
        var panel = this;

        /*
         * get data grid from this object to determine click on grid data record
         */
        var thisGrid = null;
        var thisRowNo = 0;
        if (side.toLowerCase() == "buy") {
            if (panel.clickOnGrid_buy == null) {
                return;
            }
            thisGrid = panel.clickOnGrid_buy;
            thisRowNo = panel.clickOnRowNo_buy;
        } else {
            if (panel.clickOnGrid_sell == null) {
                return;
            }
            thisGrid = panel.clickOnGrid_sell;
            thisRowNo = panel.clickOnRowNo_sell;
        }

        // get the record from grid data record
        var store = thisGrid.store.getAt(thisRowNo);

        // design form record
        var newPanel = new Ext.form.Panel({
            layout: 'form',
            bodyStyle: 'padding:5px',
            autoScroll: true,
            baseCls: '',
            defaults: {
                fieldStyle: {
                    textAlign: 'right',
                    background: '#E6E6E6'
                },
                labelStyle: 'width:120px;',
                readOnly: true
            },
            items: [
                new Ext.form.field.Text({
                    id: "eqpfd_docNo_txtField",
                    fieldLabel: languageFormat.getLanguage(10717, 'Document No'),
                    readOnly: true,
                    hidden: true,
                    value: store.data['documentNo']
                }),
                new Ext.form.field.Text({
                    id: "eqpfd_docSqNo_txtField",
                    fieldLabel: languageFormat.getLanguage(10721, 'Document Sequence No'),
                    readOnly: true,
                    hidden: true,
                    value: store.data['documentSequenceNo']
                }),
                new Ext.form.field.Text({
                    id: "eqpfd_orderSource_txtField",
                    fieldLabel: languageFormat.getLanguage(20178, 'Order Source'),
                    readOnly: true,
                    hidden: true,
                    value: store.data['orderSource']
                }),
                new Ext.form.field.Text({
                    id: "eqpfd_exchg_txtField",
                    fieldLabel: languageFormat.getLanguage(20301, 'Exchange'),
                    readOnly: true,
                    hidden: true,
                    value: store.data['exchangeCode']
                }),
                new Ext.form.field.Text({
                    id: "eqpfd_orderNo_txtField",
                    fieldLabel: languageFormat.getLanguage(20182, 'Order No.'),
                    readOnly: true,
                    hidden: true,
                    value: store.data['orderNo']
                }),
                new Ext.form.field.Text({
                    id: "eqpfd_subOrderNo_txtField",
                    fieldLabel: languageFormat.getLanguage(10723, 'Sub Order No'),
                    readOnly: true,
                    hidden: true,
                    value: store.data['subOrderNo']
                }),
                new Ext.form.field.Text({
                    id: "eqpfd_accNo_txtField",
                    fieldLabel: languageFormat.getLanguage(20833, 'Account No.'),
                    readOnly: true,
                    value: panel.accNo
                }),
                new Ext.form.field.Text({
                    id: "eqpfd_orderDate_txtField",
                    fieldLabel: languageFormat.getLanguage(20206, 'Order Date'),
                    readOnly: true,
                    value: store.data['Date'] + " " + store.data['Time']
                }),
                new Ext.form.field.Text({
                    id: "eqpfd_action_txtField",
                    fieldLabel: languageFormat.getLanguage(21202, 'Action (Buy/Sell)'),
                    readOnly: true,
                    value: store.data['side']
                }),
                new Ext.form.field.Text({
                    id: "eqpfd_mQuantity_txtField",
                    fieldLabel: languageFormat.getLanguage(21204, 'Matched Quantity'),
                    readOnly: true,
                    value: store.data['quantity']
                }),
                new Ext.form.field.Number({
                    id: "eqpfd_mPrice_txtField",
                    fieldLabel: languageFormat.getLanguage(21205, 'Match Price'),
                    readOnly: true,
                    decimalPrecision: decimalCtrl.prtf.matchprice || 3,
                    allowNegative: false,
                    hideTrigger: true,
                    keyNavEnabled: false,
                    mouseWheelEnabled: false,
                    value: store.data['price']
                })
            ],
            buttons: [
                new Ext.button.Button({
                    text: languageFormat.getLanguage(10030, 'Confirm'),
                    cls: 'fix_btn',
                    handler: function() {
                        panel.deleteFormSubmit();
                    }
                }),
                new Ext.button.Button({
                    text: languageFormat.getLanguage(10010, 'Cancel'),
                    cls: 'fix_btn',
                    handler: function() {
                        panel.newWindow.destroy();
                    }
                })

            ]

        });

        // call new window 
        panel.openNewWindow(newPanel, languageFormat.getLanguage(10013, 'Delete') + " - " + store.data['SubAndOrderNo'], 260, 215);
    },
    /**
     * Decription <br/>
     * 
     * 	submit delete form record
     * 	
     */
    deleteFormSubmit: function() {
        var panel = this;

        if (panel.newWindow == null) {
            return;
        }

        panel.loadMask.show();

        var accNo = Ext.getCmp("eqpfd_accNo_txtField").getValue();
        var actionSide = Ext.getCmp("eqpfd_action_txtField").getValue();
        var exchangeCode = Ext.getCmp("eqpfd_exchg_txtField").getValue();
        var orderNo = Ext.getCmp("eqpfd_orderNo_txtField").getValue();
        var subOrderNo = Ext.getCmp("eqpfd_subOrderNo_txtField").getValue();

        if (actionSide.toLowerCase() == "buy") {
            actionSide = 1;
        } else {
            actionSide = 2;
        }

        // get exchange code from stock code
        if (exchangeCode == null)
            exchangeCode = stockutil.getExchange(panel.stkCode);

        var tempUrl = new Array();
        tempUrl.push(addPath + 'tcplus/portFolioDetailDelete?');
        tempUrl.push("an=");
        tempUrl.push(accNo);
        tempUrl.push("&s=");
        tempUrl.push(actionSide);
        tempUrl.push("&exc=");
        tempUrl.push(exchangeCode);
        tempUrl.push("&on=");
        tempUrl.push(orderNo);
        tempUrl.push("&son=");
        tempUrl.push(subOrderNo);
        tempUrl.push("&category=");
        tempUrl.push(panel.displayCategory);

        var url = tempUrl.join('');

        Ext.Ajax.request({
            url: url,
            method: 'POST',
            success: function(response) {

                try {
                    var obj = Ext.decode(response.responseText);

                    if (obj.s) {
                    	msgutil.info(languageFormat.getLanguage(31004, 'The record has been deleted from your portfolio.'));
                        panel.callRecord();
                        panel.refreshPortfolio();
                    } else {
                        panel.loadMask.hide();
                        msgutil.warn(languageFormat.getLanguage(31007, 'The record was not deleted from your portfolio. Kindly try again.'));
                    }
                } catch (e) {
                    console.log("[EquityPrtfDetail][deleteFormSubmit] Exception ---> " + e);
                }
            }
        });

        panel.newWindow.destroy();
    },
    /**
     * Description <br/>
     * 
     * 	create new window to display form 
     */
    openNewWindow: function(object, title, width, maxHeight) {
        var panel = this;

        panel.newWindow = msgutil.popup({
            title: title,
            width: width,
            maxHeight: maxHeight,
            plain: true,
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
    calculateTotal: function() {
        var qtyField = Ext.getCmp("eqpfd_mQuantity_txtField");
        var priceField = Ext.getCmp("eqpfd_mPrice_txtField");
        var transField = Ext.getCmp("eqpfd_transFee_txtField");
        var displayField = Ext.getCmp("eqpfd_totalValue_txtField");
        var actionField = Ext.getCmp("eqpfd_action_txtField");
        if (qtyField != null && priceField != null && transField != null && displayField != null) {
            displayField.setValue(calculationOfPortFolioDetail(qtyField.getValue(), priceField.getValue(), transField.getValue(), actionField.getValue()));
        }
    },
    refreshPortfolio: function() {
        if (equityPrtfPanel) {
            equityPrtfPanel.search();
        }
    }
});