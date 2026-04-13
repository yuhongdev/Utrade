/* 
 * this  :  Ext.grid.Panel
 * 
 * 
 * 
 * constructor 					: initial this object function / design this panel 
 * 
 * search					: searching function / call ajax
 * 
 * callMargin					: 
 * callSort 					: call ajax method to get feed record
 * updateSortHttp 				: set record from server to update feed record
 * updateFeed 					: update feed grid panel record 
 * updateFeedRecord				: update quote screen record 
 * 
 * generateColumnsArray                         : generate grid panel column header
 * generateColumn				: generate unhide column setting
 * 
 * initializeFilter				: set stock category filter function
 * initializeSector				: set "Normal Board Lot", "Buy In Board Lot" ... filter function
 * initializeTop				: set top value function
 * resetFeedSetting				: reset all setting and reset to default
 * 
 * generateColumnID				: generate column ID to save user setting
 * changeField					: update feed grid panel column / call ajax to return field record
 * getFieldList					: return grid panel on show field id
 * 
 * createContextMenu                            : create right click menu
 * onContextMenuClick                           : this function is at main.js call - set up right click menu listener
 * disableRightFunction                         : block right click items button
 * showContextMenu				: show right click menu
 * 
 * setPageNo					: change / set paging number text field
 * nextPage					: next paging button function
 * previousPage					: previous paging button function
 * blockPrevNextButton                          : set next paging and previous paging button to disable or able
 * 
 * 
 * returnNumberFormat                           : return number format 
 * 
 * 
 * isBuyInStk					: verify the stock can be trade or not
 * 
 * getExchangeType				:
 * 
 * updateRDToolTip				: update "R/D" column tool tip
 * 
 * setTitleInfo					: set grid panel title
 * 
 * 
 * allColumnSetting				: return all column id
 * defaultColumnSetting                         : return default column id
 * currentColumnSetting                         : return current column id
 * 
 * openColumnSetting                            : return array list by available or exist
 * saveColumn					: save new column setting
 * refreshRecordTime                            : compare quote screen record by every 5 minute
 * 
 * 
 */

Ext.define('TCPlus.view.quote.QuoteScreen', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.quotescreen',
    requires: [
        'Ext.grid.column.Action'
    ],
    oriTitle: languageFormat.getLanguage(20631, 'Quote Screen'), // original title
    type: 'qs', // verify this object type/category
    savingComp: true,
    idxcode: '', //indices - 1.3.29.28
    isImgBlink: false, //v1.3.33.5
    isDLUpdated: false,
    exchangecode: '', // store exchange code to set url parameter
    exchangeFeedType: '', // on delay or real time feed
    sort: [{
            property: fieldVol,
            direction: 'DESC'
        }],
    stkcodes: [], // store stock code to set url parameter  -  (array) looking stock code
    stkList: [],
    count: parseInt(global_quoteScreenSize), // display feed record number and set url parameter
    page: 0, // record paging number and set url parameter
    // emptyText: '[9805] Some errors occurred  while processing your Search request, please click on Reset or refresh your page to try again.',
    currentTime: 0, // current times for refresh data
    sortingTime: 0, // added v1.3.29.5, current time for data sorting
    isBlockButton: false, // verify to block all next and previous button
    onSearchStatus: false, // verify is on search status
    searchValue: '', // store search criteria value
    isFirstTime: true,
    tooltipMsg: null,
    timeOutCall: 5, // when ajax time out or error, recall times	
    totalTimeOut: 5,
    marketRefreshTime: null,
    marketRefresh: false,
    contextMenu: null, // display context menu panel
    cMenuStkCode: null, // context menu - stkcode
    cMenuStkName: null, // context menu - stkName
    cMenuBuyId: Ext.id(), // assign new id to context menu button
    cMenuSellId: Ext.id(), // assign new id to context menu button
    cMenuStkInfoId: Ext.id(), // assign new id to context menu button
    cMenuDepthId: Ext.id(), // assign new id to context menu button
    cMenuChartId: Ext.id(), // assign new id to context menu button
    cMenuStkNewsId: Ext.id(), // assign new id to context menu button
    cMenuEqTrackerId: Ext.id(), // assign new id to context menu button
    cMenuArchiveNewsId: Ext.id(), // assign new id to context menu button
    cMenuElasticNewsId: Ext.id(), // assign new id to context menu button
    cMenuNikkeiNewsId: Ext.id(), // assign new id to context menu button
    cMenuStkTrackerId: Ext.id(), // assign new id to context menu button
    cMenuHisDataId: Ext.id(),
    cMenuAnalysisId: Ext.id(), // assign new id to context menu button
    cMenuFundamentalCPIQId: Ext.id(), // assign new id to context menu button
    cMenuFundamentalThomsonReutersId: Ext.id(), // assign new id to context menu button
    cMenuAddStockAlertId: Ext.id(), // assign new id to context menu button
    cMenuOrderStatus: Ext.id(), // assign new id to context menu button
    cMenuWarrantsInfoId: Ext.id(), // assign new id to context menu button
    cMenuAddToWL: Ext.id(),
    cMenuStockAlert: Ext.id(),
    cMenuPSEEdge: Ext.id(),
    tCombo_SearchType: null,
    tButtonNextPage: null,
    tButtonPrevPage: null,
    tFieldPage: null,
    tButtonAllStock: null, // top bar button  -  display all stock category
    tButtonTop: null, // top bar button  -  display top xxx value, top xxx volumn ...
    tButtonMarket: null, // top bar button  -  display Normal Board Lot, Buy In Board Lot ...
    tFieldSearch: null, // top bar text field  -  set searching text field   
    tRadioMarket: null,
    tAjax_Object: null,
    tAjax_ID: null,
    tRecord_stockRecord: null,
    tooltip: null, //v1.3.33.5
    columnHash: null, //v1.3.33.27
    tempWidth: null, //v1.3.33.27
    onResetMode: false,
    onWarrantSearchMode: false,
    warrantSearchParams: null,
    tempPage: 0,
    warrantSearchRows: 0,
    screenType: 'main',
    slcomp: "qs",
    compRef: {}, // component reference
    /**
     * Description <br />
     * 		when this object create will call this function
     */
    initComponent: function () {
        var panel = this;
        // panel.suspendLayouts();
        panel.procColumnWidth(exchangecode); //v1.3.30.9

        var store = Ext.create('Ext.data.Store', {
            model: 'TCPlus.model.StockRecord',
            listeners: {
                datachanged: function (thisStore) {
                    panel.blockPrevNextButton();
                }
            }
        });
        var styleTFieldSearch = "";
        /*
         * this is for set search text field
         */
        panel.tFieldSearch = new Ext.form.field.Text({
            autoCreate: {
                tag: 'input',
                type: 'text',
                size: '30',
                autocomplete: 'off'
            },
            style: styleTFieldSearch,
            width: searchboxWidth,
            emptyText: languageFormat.getLanguage(10102, 'Symbol') + '/' + languageFormat.getLanguage(10101, 'Code'),
            selectOnFocus: true,
            listeners: {
                specialkey: function (field, e) {
                    // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                    // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
                    if (e.getKey() == e.ENTER) {
                        if (panel.tFieldSearch.getValue().trim() == "") {//v1.3.34.11
                            panel.tFieldSearch.setValue('');
//							panel.initializeFilter(),
//							panel.initializeTop();
//							panel.setPageNo(0);
//							panel.searchValue = "";
//							panel.callSort();
                            msgutil.alert(languageFormat.getLanguage(30001, 'Please key in your search text.'), function () {
                                panel.tFieldSearch.focus();
                            });
                        } else {
                            panel.initializeTop();
                            panel.setPageNo(0);
                            panel.search(panel.tFieldSearch.getValue());
                        }
                    } else {
                        panel.searchValue = "";
                    }
                }
            }
        });
        var btnCls = 'smallerbtn';
        if (!isMobile) {
            btnCls = '';
        }

        /*
         * this is top button
         */
        panel.tButtonTop = new Ext.button.Button({
            text: languageFormat.getLanguage(20637, 'Sort by Volume'),
            hidden: global_showSortByTopHeader == "TRUE" ? false : true,
            menu: [],
            cls: btnCls
        });
//		panel.initializeTop();

        /*
         * this is market button
         */
        panel.tButtonMarket = new Ext.button.Button({
            text: languageFormat.getLanguage(20636, 'All Stock'),
            hidden: global_showSortByMarketHeader == "TRUE" ? false : true,
            menu: [],
            cls: btnCls
        });

        panel.tRadioMarket = new Ext.panel.Panel({
            border: false,
            style: ' background-color: transparent;',
            layout: {
                type: 'table',
                columns: 2,
                tableAttrs: {
                    style: ' width : 220px;'
                }
            },
            bodyStyle: ' background-color: transparent; ',
            defaults: {
                bodyStyle: ' border: none; ',
                style: ' font-family: Helvetica,Verdana; font-size:8pt; ',
                margins: 0
            },
            items: [
                {
                    xtype: "radio",
                    name: "market",
                    boxLabel: languageFormat.getLanguage(20648, 'Normal Board Lot'),
                    marketValue: 10,
                    checked: true,
                    hidden: (showSector == "TRUE") ? (showButton == "TRUE" ? true : false) : true,
                    handler: function(thisObject, checked) {
                    	if (checked && panel.onResetMode == false) {
                    		panel.setPageNo(0);
                    		panel.market = thisObject.marketValue;

                    		if (panel.onSearchStatus) {
                    			// bug - v1.3.14.12    	
                    			//panel.search();
                    			panel.onSearchStatus = false;
                    			panel.sectorButtonFunction();
                    		} else {
                    			panel.callSort();
                    		}
                    	}
                    }
                }, {
                    xtype: "radio",
                    name: "market",
                    boxLabel: languageFormat.getLanguage(20651, 'Normal Odd Lot'),
                    marketValue: 15,
                    hidden: (showSector == "TRUE") ? (showButton == "TRUE" ? true : false) : true,
                    handler: function(thisObject, checked) {
                    	if (checked && panel.onResetMode == false) {
                    		panel.setPageNo(0);
                    		panel.market = thisObject.marketValue;

                    		if (panel.onSearchStatus) {
                    			// bug - v1.3.14.12    	
                    			//panel.search();
                    			panel.onSearchStatus = false;
                    			panel.sectorButtonFunction();
                    		} else {

                    			panel.initializeFilter();

                    			panel.callSort();
                    		}
                    	}
                    }
                }
            ]
        });

        /*
         * this is display all stock category button
         */
        panel.tButtonAllStock = new Ext.button.Button({
            text: languageFormat.getLanguage(20636, 'All Stock'),
            hidden: global_showSortBySectorHeader == "TRUE" ? false : true,
            menu: [],
            cls: btnCls
        });

        panel.tButtonFirstPage = Ext.create('Ext.button.Button', {
            iconCls: 'x-tbar-page-first',
            overflowText: languageFormat.getLanguage('10048', 'First'),
            tooltip: languageFormat.getLanguage('10048', 'First'),
            disabled: true,
            handler: function () {
                if (panel.onWarrantSearchMode) {
                    panel.firstWarrantPage();
                } else {
                    panel.firstPage();
                }
            }
        });
        // paging previous button
        panel.tButtonPrevPage = Ext.create('Ext.button.Button', {
            iconCls: 'x-tbar-page-prev',
            overflowText: languageFormat.getLanguage('10049', 'Previous'),
            tooltip: languageFormat.getLanguage('10049', 'Previous'),
            disabled: true,
            handler: function () {
                if (panel.onWarrantSearchMode) {
                    panel.previousWarrantPage();
                } else {
                    panel.previousPage();
                }
            }
        });

        // paging next button
        panel.tButtonNextPage = Ext.create('Ext.button.Button', {
            iconCls: 'x-tbar-page-next',
            overflowText: languageFormat.getLanguage('10015', 'Next'),
            tooltip: languageFormat.getLanguage('10015', 'Next'),
            handler: function () {
                if (panel.onWarrantSearchMode) {
                    panel.nextWarrantPage();
                } else {
                    panel.nextPage();
                }
            }
        });

        // text field display paging number
//        panel.tFieldPage = new Ext.form.NumberField({
//        	readOnly: true,
//        	value: 1,
//        	width: 50
//        });

        //susan 20130411 - sw
        //text field display paging number
        panel.tFieldPage = new Ext.form.Label({
            text: 1
        });

        var tempButton_search = new Ext.button.Button({
            text: languageFormat.getLanguage(10007, 'Search'),
            tooltip: languageFormat.getLanguage(10007, 'Search'),
            icon: icoBtnSearch,
            handler: function () {
                if (panel.tFieldSearch.getValue().trim() == "") {//v1.3.34.11
                    //			panel.setPageNo(0);
                    //			panel.initializeFilter();
                    //			panel.initializeTop();
                    //			panel.callSort();
                    //			panel.searchValue = "";
                    panel.tFieldSearch.setValue('');
                    msgutil.alert(languageFormat.getLanguage(30001, 'Please key in your search text.'), function () {
                        panel.tFieldSearch.focus();
                    });
                } else {
                    panel.initializeTop();
                    panel.setPageNo(0);
                    panel.search(panel.tFieldSearch.getValue());
                }
            }
        });
        
        panel.tempButton_SaveColumn = new Ext.button.Button({//v1.3.33.5
            id: 'saveSetting_Quote', //v1.3.33.27
            icon: iconBtnSaveSetting,
            hidden: true,
            style: "margin-right:10px;",
            //	tooltip :  'Click this blinking icon to save the adjusted column width.',
            handler: function () {
                msgutil.confirm(languageFormat.getLanguage(30008, 'You have unsaved settings. Would you like to save your settings?'),
                        function (sResp) {
                            if (sResp == "yes") {
                                panel.isImgBlink = false;
                                cookies.procCookie(panel.qckId, panel.tempWidth, cookieExpiryDays);
                                panel.tempWidth = cookies.toDefaultColumn(panel, panel.qckId);
                            } else {
                                panel.isImgBlink = false;
                            }
                        }
                );
            }
        });

        panel.dlGrid = Ext.create('Ext.grid.Panel', {
            store: {
                fields: ['datetime', 'reason']
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
                {text: "DateTime", dataIndex: 'datetime', width: 130, sortable: true, menuDisabled: true},
                {text: "Reason", dataIndex: 'reason', width: 335, flex: 1, sortable: false, menuDisabled: true} // always give width to column even use forceFit to avoid alignment issue
            ]
        });
        
        panel.dynamicLimitBtn = Ext.create('Ext.button.Button', {
            id: 'openDynamicLimit_Quote',
            icon: iconBtnDLAnnouncements,
            hidden: true,
            style: "margin-right:10px;",
            tooltip: 'Click this blinking icon to see updated dynamic limit announcements.',
            handler: function() {
                if (global_DynamicLimitList) {
                    panel.isDLUpdated = false;

                    panel.dlGrid.store.loadData(global_DynamicLimitList);
                    panel.dlGrid.store.sort('datetime', 'DESC');

                    if (!panel.dynamicWin) {
                        panel.dynamicWin = msgutil.popup({
                            title: "Dynamic Limit Announcements",
                            width: 500,
                            height: 250,
                            plain: true,
                            layout: 'fit',
                            autoScroll: true,
                            resizable: true,
                            closeAction: 'hide',
                            items: [panel.dlGrid],
                            displayAtClick: false
                        });
                    } else if (panel.dynamicWin.isHidden()) {
                        panel.dynamicWin.show();
                    }

                }
            }
        });

        var buttonAutoWidth = createAutoWidthButton(panel);

        panel.tempButton_column = new Ext.button.Button({
            id: 'quoteColumns',
            text: languageFormat.getLanguage(10005, 'Columns'),
            tooltip: languageFormat.getLanguage(10005, 'Columns'),
            hidden: global_showColSettingHeader == "TRUE" ? false : true,
            icon: icoBtnColumn,
            handler: function () {
                panel.openColumnSetting();
            }
        });

        var tempButton_reset = new Ext.button.Button({
            text: languageFormat.getLanguage(10003, 'Reset'),
            tooltip: languageFormat.getLanguage(10003, 'Reset'),
            icon: icoBtnReset,
            handler: function () {
                panel.setPageNo(0);
                panel.tFieldSearch.setValue('');
                if (n2nLayoutManager.compRef.searchTf) {
                    n2nLayoutManager.compRef.searchTf.setValue('');
                }
                panel.resetFeedSetting();

                panel.procColumnWidth(exchangecode); //v1.3.33.5
                panel.reconfigure(null, panel.generateColumnsArray(panel.generateColumn("")));
                panel.tempWidth = cookies.toDefaultColumn(panel.qckId);
                panel.isImgBlink = false;
                panel.callSort();
            }
        });

        panel.tCombo_SearchType = new Ext.form.field.ComboBox({
            width: UI.exchWidth,
            triggerAction: 'all',
            queryMode: 'local',
            editable: false,
            scroll: true,
            lazyInit: false,
            store: new Ext.data.ArrayStore({
                fields: [
                    'typeId', 'typeDisplay'
                ],
                data: [['this', languageFormat.getLanguage(20665, 'This Exchange Only')], ['cross', languageFormat.getLanguage(20654, 'All Exchanges')], ['allBoard', languageFormat.getLanguage(20655, 'All Boards')]]
            }),
            value: 'this',
            valueField: 'typeId',
            displayField: 'typeDisplay'
        });

        panel.compRef.btnEditDone = Ext.create('Ext.button.Button', {
            text: languageFormat.getLanguage(10021, 'Edit'),
            tooltip: languageFormat.getLanguage(10021, 'Edit'),
            enableToggle: true,
            hidden: !N2N_CONFIG.useEditButton,
            icon: ICON.EDIT,
            toggleHandler: function (thisBtn, pressed) {
                var adderCol = helper.getColumn(helper.getGridColumns(panel, 'lock'), 'itemId', 'adder');
                if (pressed) {
                    thisBtn.setText(languageFormat.getLanguage(10023, 'Done'));
                    thisBtn.setIcon(ICON.DONE);
                    adderCol.col.setVisible(true);
                } else {
                    thisBtn.setText(languageFormat.getLanguage(10021, 'Edit'));
                    thisBtn.setIcon(ICON.EDIT);
                    adderCol.col.setVisible(false);
                }
            }
        });

        panel.compRef.selectedLabel = Ext.create('Ext.form.Label', {
            flex: 1,
            cls: 'selectedlabel',
            style: 'font-size:0.85em !important;'
        });

        var topToolBarItems = new Ext.toolbar.Toolbar({
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll
        });

        var bottomToolBarItems = new Ext.toolbar.Toolbar({
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll
        });

        if (global_QuotePagingPanel.toLowerCase() == "top") {
            if (isMobile) {
                topToolBarItems.add(panel.tFieldSearch);
                topToolBarItems.add(tempButton_search);
                topToolBarItems.add('-');
            }

            topToolBarItems.add(panel.tButtonAllStock);
            if (!isMobile) {
                if (global_personalizationTheme.indexOf("wh") == -1) {
                topToolBarItems.add('-');
            }
            }
            topToolBarItems.add(panel.tButtonTop);
            if (!isMobile) {
                if (global_personalizationTheme.indexOf("wh") == -1) {
                topToolBarItems.add('-');
            }
            }
            topToolBarItems.add(panel.tButtonMarket);
            if (!panel.tButtonMarket.isHidden()) {
                if (global_personalizationTheme.indexOf("wh") == -1) {
                topToolBarItems.add('-');
            }
            }
            if (!isMobile) {
                topToolBarItems.add(panel.tFieldSearch);
                topToolBarItems.add(' ');
            }

            if (global_QSCrossSearch.toLowerCase() == 'true' && n2nLayoutManager.isDefaultMenu()) {
                topToolBarItems.add(panel.tCombo_SearchType);
            }
            if (!isMobile) {
                topToolBarItems.add(tempButton_search);
            }

            if (showSector == "TRUE") {
                if (showButton != "TRUE") {
                    topToolBarItems.add(panel.tRadioMarket);
                }
            }

            if (!isMobile) {
            	topToolBarItems.add('->');
            	if (global_personalizationTheme.indexOf("wh") != -1) {
            		//if (isTablet) {
            			topToolBarItems.add(panel.compRef.btnEditDone);
            		//}
            	}else{
            		topToolBarItems.add(panel.compRef.btnEditDone);
            	}
                topToolBarItems.add(panel.tempButton_SaveColumn);
                topToolBarItems.add(panel.dynamicLimitBtn);
                topToolBarItems.add(buttonAutoWidth);
                topToolBarItems.add(panel.tempButton_column);
                topToolBarItems.add(tempButton_reset);
                if (global_personalizationTheme.indexOf("wh") == -1) {
                topToolBarItems.add('-');
                }
                topToolBarItems.add(panel.tButtonFirstPage);
                topToolBarItems.add(panel.tButtonPrevPage);
                if (global_personalizationTheme.indexOf("wh") == -1) {
                topToolBarItems.add('-');
                topToolBarItems.add(panel.tFieldPage);
                topToolBarItems.add('-');
                }
                topToolBarItems.add(panel.tButtonNextPage);
                bottomToolBarItems.setVisible(false);
            } else {
                topToolBarItems.add('->');
                topToolBarItems.add(panel.tempButton_SaveColumn);
                topToolBarItems.add(panel.tempButton_column);
                bottomToolBarItems.add(panel.compRef.btnEditDone);
                bottomToolBarItems.add(panel.compRef.selectedLabel);
                // bottomToolBarItems.add('->');
                bottomToolBarItems.add(tempButton_reset);
                bottomToolBarItems.add('-');
                bottomToolBarItems.add(panel.tButtonFirstPage);
                bottomToolBarItems.add(panel.tButtonPrevPage);
                // bottomToolBarItems.add('-');
                bottomToolBarItems.add(panel.tFieldPage);
                // bottomToolBarItems.add('-');
                bottomToolBarItems.add(panel.tButtonNextPage);
                bottomToolBarItems.setVisible(true);
            }
        } else {
            topToolBarItems.add(panel.tButtonAllStock);
            topToolBarItems.add('-');
            topToolBarItems.add(panel.tButtonTop);
            topToolBarItems.add('-');
            topToolBarItems.add(panel.tButtonMarket);
            topToolBarItems.add('-');
            topToolBarItems.add(panel.tFieldSearch);
            topToolBarItems.add(' ');

            if (global_QSCrossSearch.toLowerCase() == 'true') {
                topToolBarItems.add(panel.tCombo_SearchType);
            }

            topToolBarItems.add(tempButton_search);

            topToolBarItems.add('->');
            topToolBarItems.add(panel.tempButton_SaveColumn);
            topToolBarItems.add(panel.dynamicLimitBtn);
            topToolBarItems.add(panel.tempButton_column);
            topToolBarItems.add(buttonAutoWidth);
            topToolBarItems.add(tempButton_reset);

            bottomToolBarItems.add('->');
            bottomToolBarItems.add(panel.tRadioMarket);
            bottomToolBarItems.add('->');
            bottomToolBarItems.add(panel.tButtonFirstPage);
            bottomToolBarItems.add(panel.tButtonPrevPage);
            bottomToolBarItems.add('-');
            bottomToolBarItems.add(panel.tFieldPage);
            bottomToolBarItems.add('-');
            bottomToolBarItems.add(panel.tButtonNextPage);
        }

        /*
         * this is set this panel layout design 
         */
        var defaultConfig = {
            store: store,
            columns: {
                items: panel.generateColumnsArray(panel.generateColumn("")),
                defaults: {
                    lockable: false // does not work in ExtJS 4.2, keep for its later fix
                }
            },
            selModel: {
                preventFocus: true
            },
            title: languageFormat.getLanguage(20631, 'Quote Screen'),
            animCollapse: true,
            border: false,
            bodyStyle: 'padding:0px; margin:0px; font-size: 12pt;',
            columnLines: global_personalizationTheme.indexOf("wh") == -1 ? false : true,
            header: false,
            // enableColumnResize: false,
            enableColumnMove: N2N_CONFIG.gridColMove,
            enableColumnHide: N2N_CONFIG.gridColHide,
            viewConfig: getGridViewConfig(panel),
            bufferedRenderer: N2N_CONFIG.gridBufferedRenderer,
            leadingBufferZone: N2N_CONFIG.gridLeadingBufferZone,
            trailingBufferZone: N2N_CONFIG.gridTrailingBufferZone,
            listeners: {
                afterrender: function (thisComp) {
                    panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
                    
                    panel.tooltip = new Ext.tip.ToolTip({//v1.3.33.5
                        target: 'saveSetting_Quote', //v1.3.33.27
                        html: languageFormat.getLanguage(30009, 'Click this blinking icon to save the adjusted column width.'),
                        anchor: 'top',
                        style: 'margin:1px;',
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
                itemcontextmenu: function (thisView, record, item, index, e) {
                    if (!touchMode) {
                        panel.showContextMenu(thisView, record, index, e);
                    }
                },
                sortchange: function (ct, column, direction, eOpts) {
                    Blinking.resetBlink(panel);
                },
                destroy: function () {
                    if (panel.contextMenu != null) {
                        panel.contextMenu.destroy();
                    }
                    
                    // issues with components using id, need to destroy manually
                    if (panel.tempButton_SaveColumn) {
                        panel.tempButton_SaveColumn.destroy();
                    }
                    if (panel.dynamicLimitBtn) {
                        panel.dynamicLimitBtn.destroy();
                    }
                    if (panel.tempButton_column) {
                        panel.tempButton_column.destroy();
                    }

                    Storage.generateUnsubscriptionByExtComp(panel);
                },
                resize: function (thisComp) {
                    if (!panel.isFirstTime && n2nLayoutManager.isPortalLayout()) { // disable for mobile to keep from reloading
                        // previous row count
                        var preCount = panel.count;
                        panel._setDisplayRecord();
                        if (preCount != panel.count) {
                            // saves to cookie
                            var ppanel = panel.findParentByType('panel');
                            cookies.createCookie(cookieKey + "_Quote_Height_", ppanel.getHeight(), 1800);
                            // reloads grid
                            panel.callSort();
                        }
                    }
                    if (thisComp.bufferedRenderer && panel.didSelect) {
                        helper.reselectRow(thisComp);
                    }
                },
                headerclick: function (ct, column, e, t, eOpts) {
                    if (exchangecode == "MY") {
                        if (column.dataIndex == fieldStkName) {
                            column.dataIndex = fieldStkFName;
                            column.setText(languageFormat.getLanguage(10134, 'LongName'));
                        } else if (column.dataIndex == fieldStkFName) {
                            column.dataIndex = fieldStkName;
                            column.setText(languageFormat.getLanguage(10102, 'Symbol'));
                        }
                        if (column.dataIndex == fieldStkName || column.dataIndex == fieldStkFName) {
                            panel.getStore().sort({
                                property: fieldStkFName,
                                direction: 'ASC'
                            });
                        }
                    }
                },
                selectionchange: function (selModel, selected, evt) {
                    controlSelectionChanged(panel, selected);
                },
                columnmove: gridColHandler,
                columnshow: gridColHandler,
                columnhide: gridColHandler
            },
            tbar: topToolBarItems,
            bbar: bottomToolBarItems
        };

        panel.createContextMenu();
        panel.initializeTop();
        // panel.resumeLayouts();
        Ext.apply(this, defaultConfig);
        this.callParent();

    },
    switchRefresh: function (silent) {
        var panel = this;
        
        reactivateRow(panel);
        
        if (panel.onSearchStatus == false) {
            panel.callSort(silent);
        } else {
            panel.search(null, silent);
        }
    },
    show: function () {
        var panel = this;
        panel._setDisplayRecord();

        if (panel.exchangecode == 'MY') {
            panel.sort = [{property: fieldStkFName, direction: 'ASC'}];
        }
        
        if (searchKey != "") {
            panel.searchValue = searchKey;
            panel.search();
        } else {
        	if(sectorFilter.length > 0){ //to filter to a certain sector upon loading quotescreen
            	panel.setFilterInfo(panel.defMkt, sectorFilter, null);
                panel.initializeSector();
            }
        	
            if (showMargin == "TRUE") {
                panel.callMargin();
            } else {
            	panel.callSort();
            }
        }

        panel.refreshRecordTime();
    },
    start: function() {
        var me = this;

        if (me.rendered) {
            me.initializeFilter();
            me.initializeSector();
            me.show();
        } else {
            // wait until UI rendered
            setTimeout(function() {
                me.start();
            }, 0);
        }

    },
    /**
     * Description <br/>
     * 
     * 		call search
     * 
     *  @param key : string / null
     */
    search: function (key, silent) {
        console.log('[feed][search] start *** ');

        resetOrderPad();

        var panel = this;
        // panel.suspendLayouts();
        if (!silent) {
            panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
        }

        var searchCriteria = "";
        panel.isBlockButton = false;

        // set warrant search mode to false
        panel.onWarrantSearchMode = false;

        // set to on searching situation
        panel.onSearchStatus = true;


        if (key == null || key.length == 0) {
            if (panel.searchValue == "") {
                return;
            } else {
                searchCriteria = panel.searchValue;
            }
        } else {
            searchCriteria = key;
            panel.searchValue = key;
        }

        panel.tFieldSearch.setValue('');

        panel.initializeFilter();

        panel.tAjax_ID = panel._returnAjaxId();

        // [OSK] if warrant search, use panel.market value instead of panel.sectorcode 
        // sector = 2203 (structure warrant) , 9994 (company warrant)
        var market = panel.defMkt;
        var secList;
        if (sectorFilter.length > 0) {
            market = null;
            secList = sectorFilter;
        }
        
        var exchangecodes = [exchangecode]; // TODO
        if (global_QSCrossSearch.toLowerCase() == 'true') {
            var searchType = panel.tCombo_SearchType.getValue();
            if (searchType == 'cross') {
                exchangecodes = new Array();

                for (var i = 0; i < global_ExchangeList.length; i++) {
                    exchangecodes.push(global_ExchangeList[i].exchange);
                }
            } else if (searchType == 'allBoard') {
                market = null;
            }
        }

        conn.searchStock({
            k: searchCriteria,
            ex: exchangecodes,
            mkt: market,
            secList: secList,
            page: panel.page,
            count: panel.count,
            field: panel.getFieldList("all"),
            success: function (obj) {
                // panel.timeOutCall = panel.totalTimeOut;

                try {
                    // TODO
                    obj.t = panel.tAjax_ID;
                    if (!obj.s) {

                        var errorMessage = "";
                        if (obj.e != null && obj.m != null) {
                            errorMessage = obj.e + " - " + obj.m;

                        } else if (obj.c == 0) {
                            errorMessage = "-9811 - No Result Found.";

                        }

                        msgutil.alert(languageFormat.getLanguage(30003, 'We regret to inform that we are unable to process your request at this time. Kindly click the Reset button and try again. [9811]'), null);
                        panel.stkcodes = [];
                        panel.stkList = [];
                        panel.blockPrevNextButton();

                    } else if (obj.s) {

                        if (panel.tAjax_ID == obj.t) {

                            if (obj.c == 0) {
                                msgutil.info(languageFormat.getLanguage(30013, 'No result found.'), function () {
                                    if (searchKey != '') {
                                        panel.callSort();
                                        searchKey = '';
                                    } else {
                                        panel.tFieldSearch.focus();
                                    }
                                }, null, false);

                                panel.tButtonTop.setText(languageFormat.getLanguage(20666, "Sort by Name or Code"));

                                //block the prev next button if invalid counter is being search
                                panel.isBlockButton = true;
                                panel.blockPrevNextButton();

                            } else {

                                Blinking.clearBlink(panel);

                                /*
                                 * pass json to process
                                 */
                                panel.updateSortHttp(obj);
                            }

                        } else {
                            Storage.generateUnsubscriptionByExtComp(panel, true);
                            Storage.generateSubscriptionByList(panel.stkcodes, panel);
                        }
                    }

                    console.log('[feed][search] result : success *** ');

                } catch (e) {
                    console.log('[feed][search] Exception ---> ' + e);
                    msgutil.alert(languageFormat.getLanguage(30004, 'We regret to inform that we are unable to process your request at this time. Kindly click the Reset button and try again. [9806(e)]'), null);

                    panel.stkcodes = [];
                    panel.stkList = [];
                }

                panel._selectFirstRow();
            }
        });

    },
    callImageBlink: function (btnId) { //v1.3.33.5
        var panel = this;
        var btn = Ext.getCmp(btnId); //v1.3.33.27
        if (btn) {
            if (btnId == 'saveSetting_Quote') {
                if (panel.isImgBlink == false) {
                    btn.show();
//				panel.tooltip.show();
                    panel.isImgBlink = true;
                    panel.callImg(btn);
                }
            } else {
                if (panel.dynamicWin && !panel.dynamicWin.isHidden()) {
                    panel.dlGrid.store.loadData(global_DynamicLimitList);
                    panel.dlGrid.store.sort('datetime', 'DESC');
                } else {
                    if (panel.isDLUpdated == false) {
                        btn.show();
                        panel.isDLUpdated = true;
                        panel.callImg(btn);
                    }
                }
            }
        }
    },
    callImg: function (btn) { //v1.3.33.5
        var panel = this;
        var t = 1000;
        var hidden = true;

        if (btn.icon == iconBtnSaveSettingOff || btn.icon == iconBtnDLAnnouncementsOff) {
            hidden = false;
            t = 1000;
        }

        if (btn.id == 'saveSetting_Quote') {
            panel.imgBlinkTime = setTimeout(function () {
                if (panel.isImgBlink == true) {
                    panel.imgBlink(hidden, btn);
                }
                else {
                    btn.hide();
                }
            }, t);
        } else {
            panel.dlImgBlinkTime = setTimeout(function () {
                if (panel.isDLUpdated == true) {
                    panel.imgBlink(hidden, btn);
                }
                else {
                    btn.hide();
                }
            }, t);
        }
    },
    imgBlink: function (hidden, btn) {
        var panel = this;

        if (hidden == true) {
            if (btn.id == 'saveSetting_Quote') {
                btn.setIcon(iconBtnSaveSettingOff);
            } else {
                btn.setIcon(iconBtnDLAnnouncementsOff);
            }
        }
        else {
            if (btn.id == 'saveSetting_Quote') {
                btn.setIcon(iconBtnSaveSetting);
            } else {
                btn.setIcon(iconBtnDLAnnouncements);
            }
        }

        panel.callImg(btn);
    },
    callMargin: function () {
        var panel = this;

        console.log('[feed][callMargin] start *** ');

        if (panel.timeOutCall == 0) {
            //msgutil.alert("[9810] System having some difficulties processing your request. Please click Reset button and try again.", null);
            msgutil.alert(languageFormat.getLanguage(30006, 'We regret to inform that we are unable to process your request at this time. Kindly click the Reset button and try again. [9810]'), null);
            panel.timeOutCall = panel.totalTimeOut;
        }

        panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));

        var url = addPath + 'tcplus/Margin?';
        url += 'exchange=' + exchangecode;

        var ajaxMargin = Ext.Ajax.request({
            url: url,
            method: 'POST',
            timeout: 4000,
            success: function (response) {
                panel.timeOutCall = panel.totalTimeOut;

                try {
                    global_margin = Ext.decode(response.responseText);
                    console.log('[feed][callMargin] result : success *** ');

                } catch (e) {
                    console.log('[feed][callMargin] Exception ---> ' + e);
                }

                panel.callSort();
            },
            failure: function (response) {

                panel.timeOutCall -= 1;

                console.log('[feed][callMargin] failure ---> ' + response.responseText);
                panel.callMargin();
            }
        });
    },
    /**
     * Description <br/>
     * 
     * 		get feed data from server side
     * 
     * @param onVerify : boolean
     */
    callSort: function (onVerify) {
        var panel = this;

        if (N2N_CONFIG.lDebug) {
            t3 = new Date().getTime();
        }

        // panel.suspendLayouts();
        panel._onVerify = onVerify;
        if (!panel._onVerify) {
            resetOrderPad();
            panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
        }

        console.log("[feed][callSort] start *** ");

        /*
         * if user login time out or session destroy, didn't get new feed or block
         */
        if (!N2NLoginStatus.returnValidate()) {
            // return;
        }

        panel.isBlockButton = false;

        // for compare record (auto refresh) verify 
        // if true , is on compare record (auto refresh)
        // else , is not on compare record (auto refresh)
        if (!onVerify) {

            if (panel.onSearchStatus) {
                // panel.store.sort(fieldVol, "DESC");
            }
            panel.onSearchStatus = false;
            panel.searchValue = "";

            Blinking.clearBlink(panel);
        }

        var count = parseInt(panel.count);
        panel.tAjax_ID = panel._returnAjaxId();
        
        var market = panel.market;
        var secList = panel.secList;
        var sector = panel.sector;
        
        var sortReq = {
            ex: exchangecode,
            sorters: panel.sort,
            mkt: market,
            sec: sector, 
            secList: secList,
            f: panel.getFieldList("all"),
            p: panel.page,
            c: count,
            success: function (obj) {
                if (N2N_CONFIG.lDebug && t3) {
                    console.log('load feed in ', (new Date().getTime() - t3) / 1000, 's');
                    t3 = new Date().getTime();
                }

                // panel.timeOutCall = panel.totalTimeOut;
                try {
                    // TODO
                    obj.t = panel.tAjax_ID;

                    if (!obj.s && !onVerify) {
                        var errorMessage = "";
                        if (obj.e != null && obj.m != null) {
                            errorMessage = obj.e + " - " + obj.m;

                        } else if (obj.c == 0) {
                            errorMessage = panel.emptyText;

                        }

                        if (errorMessage == "") {
                            errorMessage = panel.emptyText;
                        }

                        console.log('[feed][callSort] failure : have error ---> ' + errorMessage);

                        if ((obj.e).indexOf("9803") != -1) {

                            panel.setLoading(false);
                            panel.setPageNo(0);
                            panel.tFieldSearch.setValue('');
                            panel.resetFeedSetting();

                            panel.procColumnWidth(exchangecode); //v1.3.33.5
                            panel.reconfigure(null, panel.generateColumnsArray(panel.generateColumn("")));
                            panel.tempWidth = cookies.toDefaultColumn(panel.qckId);
                            panel.isImgBlink = false;                       //v1.3.33.5
                            
                        }
                        
                        return;

                    } else if (!obj.s && onVerify) {
                        Storage.generateUnsubscriptionByExtComp(panel, true);
                        Storage.generateSubscriptionByList(panel.stkcodes, panel);

                        console.log('[feed][callSort] success call *** ');

                    } else if (obj.s) {

                        if (panel.tAjax_ID == obj.t) {
                            Blinking.clearBlink(panel);

                            panel.updateSortHttp(obj);
                        } else {
                            Storage.generateUnsubscriptionByExtComp(panel, true);
                            Storage.generateSubscriptionByList(panel.stkcodes, panel);
                        }

                        console.log('[feed][callSort] success call *** ');

                    } else {

                        console.log('[feed][callSort] failure : object not correct  ');
                        //msgutil.alert("[9808] Some errors occurred  while processing your request, please try again.", null);
                        msgutil.alert(languageFormat.getLanguage(30007, 'We regret to inform that we are unable to process your request at this time. Kindly try again shortly. [9808]'), null);
                        panel.stkcodes = [];
                        panel.stkList = [];
                        panel.blockPrevNextButton();
                    }

                } catch (e) {
                    console.log('[feed][callSort] Exception ---> ' + e);

                    panel.setPageNo(0);
                    panel.tFieldSearch.setValue('');
                    panel.resetFeedSetting();

                    panel.procColumnWidth(exchangecode); //v1.3.33.5
                    panel.reconfigure(null, panel.generateColumnsArray(panel.generateColumn("")));
                    panel.tempWidth = cookies.toDefaultColumn(panel.qckId);
                    panel.isImgBlink = false;
                    return;
                }

                panel._selectFirstRow();
            }
        };

        conn.getStockList(sortReq);

    },
    /**
     * Description <br/>
     * 
     * 		set reset new list / json from server side
     * 		set paging button disable or able
     * 
     * @param obj : json
     */
    updateSortHttp: function (obj) {
        var panel = this;


        if (parseInt(obj.c) == 0) {
            if (panel.page == 0) {
                panel.store.removeAll();
            } else {
                panel.previousPage();

                if (panel.page == 0) {
                    panel.isBlockButton = true;
                }
            }

        } else {
            panel.updateFeed(obj);

        }
    },
    /**
     * Description <br/>
     * 
     * 		update feed grid panel record 
     * 
     * @param obj : json
     */
    updateFeed: function (obj) {
        var panel = this;


        try {

            panel.stkcodes = [];
            panel.stkList = [];
            var tempData = [];

            for (var i = 0; i < obj.c; i++) {
                var dataObj = obj.d[i];

                if (dataObj[fieldStkCode] == null)
                    continue;

                panel.stkcodes.push(dataObj[fieldStkCode]);
                panel.stkList.push({
                    code: dataObj[fieldStkCode],
                    name: dataObj[fieldStkName]
                });

                tempData.push(panel._returnRecord(dataObj));

            }

            resetGridScroll(panel);
            // clears sort
            panel.store.sorters.clear();
            panel.store.loadData(tempData);

            // update field id
            panel.changeField(panel.getFieldList());

            Storage.generateUnsubscriptionByExtComp(panel, true);
            Storage.procJson(obj, panel);
            Storage.generateSubscriptionByList(panel.stkcodes, panel);
            // update ticker data
            if (n2nTicker != null) {
                n2nTicker.restart(100);
            }

            /*
             * to verify is searching mode or not
             * 
             * if : is searching mode
             * 		sorting stock name or stock code column
             */
            if (!panel.onWarrantSearchMode) {
                if (panel.onSearchStatus) {
                    if (panel.tButtonTop.getText() != "Sort by Name or Code") {
                        panel.tButtonTop.setText(languageFormat.getLanguage(20666, "Sort by Name or Code"));
                    }
                } else {
                    panel.getStore().sort(panel.sort);
                }
            }

            panel.blockPrevNextButton();

        } catch (e) {
            console.log('[feed][updateFeed] Exception ---> ' + e);
        }
    },
    /**
     * Description <br/>
     * 
     * 		update quote screen record
     * 
     * @param {json} dataObj
     */
    updateFeedRecord: function (dataObj) {
        var panel = this;

        /*	
         * dataObj : 
         * 
         * 		stockCode	: stock code
         * 		key			: field id
         * 		previous	: previous value
         * 		value		: new value
         */

        try {


            if (panel.store.getCount() == 0)
                return;
            
            var columns = helper.getGridColumns(panel);
            var stkcode = dataObj[fieldStkCode];

            var rowIndex = panel.store.indexOfId(stkcode);
            var record = panel.store.getById(stkcode);
            if (record != null) {
                // looping object key
                for (var key in dataObj) {
                    if (dataObj.hasOwnProperty(key)) {
                        var columnIndex = helper.getColumnIndex(columns, 'dataIndex', key);
                            // bid, bid qty, ask, ask aty, lacp and so on... 
                        if (columnIndex != -1) {
                        	var oldValue = record.data[key];

                        	var isInteger = (/^-?\.\d{1,}$|^-?\d{1,}\.\d{1,}$|^-?\d{1,}\.\d{1,}$|^-?[0-9]\d{1,}$|^-?[0-9]$/.test(oldValue));

                        	// update latest record
                        	record.data[key] = dataObj[key];
                        	
                        	if(!columns[columnIndex].hidden){
                        		var newCellValue = '' + dataObj[key];
                        		var columnWidth = columns[columnIndex].width;
                        		if (key == field52WHigh_06 || key == field52WLow_06) { // fixed blinking issue since no data for 52WH, 52WL at first
                        			isInteger = true;
                        		}
                        		// update number cell and price cell format
                        		if (isInteger) {
                        			// for blinking string design
                        			var procUnBlinkUpDown = [fieldBqty, fieldSqty, fieldUnit, fieldVol, fieldTotTrade, fieldValue, fieldTime, fieldEPS, fieldPERatio, field12MDiv, fieldDivPay, fieldDivEx, fieldDivYld, fieldDivCcy, fieldIntDiv, fieldIntExDate, fieldSpDiv, fieldSpDivExDate, fieldFinDiv, fieldFinDivExDate];
                        			// set cell value to format number
                        			var procNumberFormat = [fieldBqty, fieldSqty, fieldUnit, fieldVol, fieldTotTrade, fieldValue, fieldShrIssue];

                        			if (procNumberFormat.indexOf(key) != -1) {
                        				newCellValue = panel.returnNumberFormat(newCellValue, columnWidth);

                        			} else {

                        				if (key == fieldTOP || key == fieldOpenInt) {
                        					if (newCellValue == 0) {
                        						//newCellValue = panel.printString("-");
                        					} else {
                        						//newCellValue = panel.printPrice(newCellValue, null, record);
                        					}

                        				} else if (key == fieldTime) {

                        					newCellValue = formatutils.procDateValue(newCellValue);

                        				} else if (key == fieldBuyRate) {
                        					newCellValue = getColorBar(newCellValue);
                        				}
                        			}

                        			var tempFieldList = [fieldPrev, fieldOpen, fieldOpenInt, fieldLacp, fieldHigh, fieldLow, fieldBuy, fieldSell, fieldLast, fieldTOP, fieldSettPrice, field12MDiv, fieldDivPay, fieldDivEx, fieldDivYld, fieldDivCcy, fieldIntDiv, fieldIntExDate, fieldSpDiv, fieldSpDivExDate, fieldFinDiv, fieldFinDivExDate, fieldRefPrice_06, fieldEndTime_06, field52WHigh_06, field52WLow_06];
                        			if (tempFieldList.indexOf(key) != -1) {
                        				newCellValue = formatutils.procPriceValue(newCellValue).value;
                        			}

                        			//PSE
                        			var tempFieldList2 = [fieldFloatLevel_06, fieldFlunctuation_06, fieldDynamicLow_06, fieldDynamicHigh_06];
                        			if (tempFieldList2.indexOf(key) != -1) {
                        				newCellValue = formatutils.procPriceValue(newCellValue).value;
                        				N2NUtil.updateCell(panel, rowIndex, columnIndex, newCellValue);
                        			}

                        			//PSE comma separators
                        			var tempFieldList3 = [fieldFreeFloat_06, fieldFloatShare_06, fieldForeignOwnerLimit];
                        			if (tempFieldList3.indexOf(key) != -1) {
                        				newCellValue = panel.returnNumberFormat(newCellValue, columnWidth);
                        				N2NUtil.updateCell(panel, rowIndex, columnIndex, newCellValue);
                        			}

                        			// ---------------------------------------------------------------------

                        			if (key == fieldChange || key == fieldChangePer) {

//                      				if ( parseFloat( newCellValue ) == 0 && parseFloat(dataObj[fieldLast]) == 0) {
//                      				N2NUtil.updateCell(panel, rowIndex, columnIndex, '-');
//                      				} else 
                        				if (parseFloat(newCellValue) > 0) {
                        					N2NUtil.updateCell(panel, rowIndex, columnIndex, newCellValue, N2NCSS.FontUp);

                        				} else if (parseFloat(newCellValue) < 0) {
                        					N2NUtil.updateCell(panel, rowIndex, columnIndex, newCellValue, N2NCSS.FontDown);
                        				}
                        				else {
                        					N2NUtil.updateCell(panel, rowIndex, columnIndex, newCellValue);
                        				}

                        			} else {

                        				if (key == fieldHigh || key == fieldLow || key == fieldBuy || key == fieldSell || key == fieldOpen || key == fieldTOP || key == fieldLast || key == field52WHigh_06 || key == field52WLow_06) {

                        					var tempLacp = record.data[fieldLacp];

                        					var cssClass = "";
                        					if (parseFloat(newCellValue) > tempLacp)
                        						cssClass = N2NCSS.FontUp;

                        					else if (parseFloat(newCellValue) < tempLacp && parseFloat(newCellValue) != 0)
                        						cssClass = N2NCSS.FontDown;

                        					else
                        						cssClass = N2NCSS.FontUnChange;

                        					N2NUtil.updateCell(panel, rowIndex, columnIndex, newCellValue, cssClass);

                        					var fxSpreadIndex = helper.getColumnIndex(columns, 'dataIndex', fieldFXSpread);
                        					if (fxSpreadIndex != -1) {
                        						if (!columns[fxSpreadIndex].isHidden()) {
                        							var tempFXSpread = 0;
                        							cssClass = N2NCSS.FontUnChange;
                        							if (dataObj[fieldBuy] != null) {
                        								var tempFieldSell = record.data[fieldSell];
                        								tempFXSpread = ((tempFieldSell - dataObj[fieldBuy]) * 10000).toFixed(1);
                        								N2NUtil.updateCell(panel, rowIndex, fxSpreadIndex, tempFXSpread, cssClass);
                        							} else if (dataObj[fieldSell] != null) {
                        								var tempFieldBuy = record.data[fieldBuy];
                        								tempFXSpread = ((dataObj[fieldSell] - tempFieldBuy) * 10000).toFixed(1);
                        								N2NUtil.updateCell(panel, rowIndex, fxSpreadIndex, tempFXSpread, cssClass);
                        							}

                        							record.data[fieldFXSpread] = tempFXSpread;
                        						}
                        					}

                        				} else {

                        					N2NUtil.updateCell(panel, rowIndex, columnIndex, newCellValue);

                        				}
                        			}

                        			// ---------------------------------------------------------------------

                        			if (procUnBlinkUpDown.indexOf(key) != -1) {

                        				if (parseFloat(dataObj[key]) != parseFloat(oldValue)) {
                        					Blinking.setBlink(panel, rowIndex, columnIndex, "unchange");
                        				}

                        			} else if (key !== fieldBuyRate) {

                        				if (parseFloat(dataObj[key]) > parseFloat(oldValue)) {
                        					Blinking.setBlink(panel, rowIndex, columnIndex, "up");

                        				} else if (parseFloat(dataObj[key]) < parseFloat(oldValue)) {
                        					Blinking.setBlink(panel, rowIndex, columnIndex, "down");

                        				}

                        			}
                        		} else {
                        			// only for news and status
                        			var updateStatus = false;
                        			if (key == fieldStatus || key == fieldStkStatus || key == fieldNews || key == fieldRSSIndicator) {

                        				if (dataObj[fieldStkStatus] != null && dataObj[fieldStkStatus] != record.data[fieldStkStatus]) {
                        					updateStatus = true;
                        					var statusValue = '' + dataObj[fieldStkStatus];
                        					var statusColumnIndex = helper.getColumnIndex(columns, 'dataIndex', fieldStatus);//columns.findColumnIndex(fieldStatus);

                        					if (statusColumnIndex != -1) {
                        						N2NUtil.updateCell(panel, rowIndex, statusColumnIndex, statusValue);
                        					}
                        					record.data[fieldStkStatus] = statusValue;
                        				} else {
                        					if(dataObj[fieldStatus]){
                        						var statusValue = dataObj[fieldStatus].charAt(1);
                        						var newsValue = dataObj[fieldStatus].charAt(5) + dataObj[fieldStatus].charAt(4);
                        						var oriRSSIValue = dataObj[fieldStatus].charAt(0);
                        						var rssIValue = '';

                        						if (newsValue == '..')
                        							newsValue = '';
                        						else
                        							newsValue = newsValue.replace('.', '');

                        						if (oriRSSIValue == 'R') {
                        							rssIValue = 'Y';
                        						} else {
                        							rssIValue = '-';
                        						}

                        						var statusColumnIndex = helper.getColumnIndex(columns, 'dataIndex', fieldStkStatus);//columns.findColumnIndex(fieldStatus);
                        						var newsColumnIndex = helper.getColumnIndex(columns, 'dataIndex', fieldNews);//columns.findColumnIndex(fieldNews);
                        						var rssIColumnIndex = helper.getColumnIndex(columns, 'dataIndex', fieldRSSIndicator);

                        						if (statusColumnIndex != -1) {
                        							N2NUtil.updateCell(panel, rowIndex, statusColumnIndex, statusValue);
                        						}

                        						if (newsColumnIndex != -1) {
                        							N2NUtil.updateCell(panel, rowIndex, newsColumnIndex, newsValue);
                        						}

                        						if (rssIColumnIndex != -1) {
                        							N2NUtil.updateCell(panel, rowIndex, rssIColumnIndex, rssIValue);
                        						}

                        						record.data[fieldStkStatus] = statusValue;
                        						record.data[fieldNews] = newsValue;
                        						record.data[fieldRSSIndicator] = oriRSSIValue;
                        					}
                        				}

                        				if (updateStatus && dataObj[fieldStkName] != null) {
                        					var tempStkName = dataObj[fieldStkName];

                        					var index = tempStkName.lastIndexOf('.');
                        					if (index != -1) {
                        						tempStkName = tempStkName.substring(0, index);
                        					}

                        					var stknameColumnIndex = helper.getColumnIndex(columns, 'dataIndex', fieldStkName);//columns.findColumnIndex(fieldStkName);
                        					if (stknameColumnIndex != -1) {
                        						var cssClass = "";
                        						cssClass += " " + N2NCSS.FontStockName;

                        						var tempCss = StockColor.stockByQuote(tempStkName, record, panel);

                        						if (tempCss == null)
                        							cssClass += " " + N2NCSS.FontUnChange;
                        						else
                        							cssClass += " " + tempCss.css;

                        						N2NUtil.updateCell(panel, rowIndex, stknameColumnIndex, tempStkName, cssClass);
                        					}
                        				}

                        			}else if(key == fieldCFDMapValue_06){
                        				if(dataObj[fieldCFDMapValue_06]){
                        					var cfdValue = dataObj[fieldCFDMapValue_06];
                        					cfdValue = cfdValue.toString(2);
                        					var cfdTradable = cfdValue.charAt(0);
                        					var cfdShortSell = cfdValue.charAt(1);

                        					var cfdTradableIColumnIndex = helper.getColumnIndex(columns, 'dataIndex', fieldCFDTradable_06);
                        					var cfdSSIColumnIndex = helper.getColumnIndex(columns, 'dataIndex', fieldCFDShortSell_06);

                        					if(cfdTradable){
                        						if(cfdTradable == '1'){
                        							value = 'Y';
                        						}else{
                        							value = 'N';
                        						}
                        					}

                        					if(cfdShortSell){
                        						if(cfdShortSell == '1'){
                        							value = 'Y';
                        						}else{
                        							value = 'N';
                        						}
                        					}

                        					if (cfdTradableIColumnIndex != -1) {
                        						N2NUtil.updateCell(panel, rowIndex, cfdTradeableIColumnIndex, cfdTradable);
                        					}

                        					if (cfdSSIColumnIndex != -1) {
                        						N2NUtil.updateCell(panel, rowIndex, cfdSSIColumnIndex, cfdShortSell);
                        					}

                        					record.data[fieldCFDTradable_06] = cfdTradable;
                        					record.data[fieldCFDShortSell_06] = cfdShortSell;
                        				}
                        			}else {
                        				// update string cell
                        				if (key == fieldExpiryDate) {
                        					N2NUtil.updateCell(panel, rowIndex, columnIndex, Ext.util.Format.date(newCellValue, 'd/m/Y'));
                        				} else {
                        					if (oldValue != dataObj[key]) {
                        						//newCellValue = panel.printString(newCellValue);
                        						if(key == fieldPI){
                        							if (newCellValue == 'b' || newCellValue == 'm') {
                        								newCellValue = languageFormat.getLanguage(11011,'b');
                        							}else if (newCellValue == 's' || newCellValue == 'n') {
                        								newCellValue = languageFormat.getLanguage(11012,'s');
                        							}else if(newCellValue == 'o'){
                        								newCellValue = '-';
                        							}
                        						}
                        						N2NUtil.updateCell(panel, rowIndex, columnIndex, formatutils.procStringValue(newCellValue));
                        						Blinking.setBlink(panel, rowIndex, columnIndex, "unchange");
                        					}
                        				}
                        			}
                        		}
                        	} 
                        }
                    }
                }
            }

        } catch (e) {
            console.log('[feed][updateFeedRecord] Exception ---> ' + e);
        }
    },
    /**
     * Description <br/>
     * 
     * 		generate grid panel column header
     * 
     * @return array
     */
    generateColumnsArray: function (colSettingList) {
        var panel = this;

        var newSetting = function (meta, value, record, type) {
            var cssClass = N2NCSS.CellDefault;

            if (type == "stockName") {
                cssClass += " " + N2NCSS.FontStockName;

                var tempCss = StockColor.stockByQuote(value, record, panel);

                if (tempCss == null)
                    cssClass += " " + N2NCSS.FontColorString;
                else
                    cssClass += " " + tempCss.css;


            } else if (type == "string") {
                cssClass += " " + N2NCSS.FontString;
                cssClass += " " + N2NCSS.FontColorString;
                
            } else if (type == "unchange") {
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

            } else if (type == "numberyellow") {
                if (isNumberYellowColumn) {
                    cssClass += " " + N2NCSS.FontString;
                    cssClass += " " + N2NCSS.FontUnChange_yellow;
                } else {
                    cssClass += " " + N2NCSS.FontString;
                    cssClass += " " + N2NCSS.FontUnChange;
                }

            } else {
                cssClass += " " + N2NCSS.FontString;

                var tempLacp = record.data[fieldLacp];

                if (parseFloat(value) > tempLacp)
                    cssClass += " " + N2NCSS.FontUp;

                else if (parseFloat(value) < tempLacp && parseFloat(value) != 0)
                    cssClass += " " + N2NCSS.FontDown;

                else
                    cssClass += " " + N2NCSS.FontUnChange;

            }

            meta.css = cssClass;
        };



        var columnList = new Array();

        if (showWatchListHeader == "TRUE" && showWatchListCreate == "TRUE") { // verify from main.jsp
        	 //if(global_personalizationTheme.indexOf("wh") == -1 || isMobile){
                 columnList.push(panel._getAdderColumn());
        	 //}
        }

        var qsId = panel.getId();
        for (var i = 0; i < colSettingList.length; i++) {
            var colObj = colSettingList[i];
            var columnID = colObj.column;
            var colHidden = !colObj.visible;
            var colWidth = panel.getWidth(columnID);

            switch (columnID) {
                case cmap_mmCode:
                    columnList.push({
                        itemId: qsId + cmap_mmCode,
                        header: languageFormat.getLanguage(10101, 'Code'),
                        dataIndex: fieldStkCode,
                        hidden: colHidden,
                        sortable: true,
                        locked: helper.getCodeLock(colSettingList, cmap_mmSymbol),
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record, rowIndex, columnIndex, store) {
                            newSetting(meta, value, record, 'string');
                            var index = value.lastIndexOf('.');
                            if (index != -1) {
                                value = value.substring(0, index);
                            }

                            return formatutils.procStringValue(value);
                        }});
                    break;
                case cmap_mmSymbol:
                    columnList.push({
                        itemId: qsId + cmap_mmSymbol,
                        header: languageFormat.getLanguage(10102, 'Symbol'),
                        dataIndex: fieldStkName,
                        hidden: colHidden,
                        sortable: exchangecode == "MY" ? false : true,
                        locked: true,
                        //menuDisabled: isMobile,
                        width: colWidth + (isMobile ? 15 : 0),
                        renderer: function (value, meta, record, rowIndex, columnIndex, store) {
                            newSetting(meta, value, record, 'stockName');
                            var index = value.lastIndexOf('.');
                            if (index != -1) {
                                value = value.substring(0, index);
                            }

                            return formatutils.procStringValue(value);
                        }});
                    break;
                case cmap_mmClose:
                    columnList.push({
                        itemId: qsId + cmap_mmClose,
                        header: languageFormat.getLanguage(10103, 'Close'),
                        dataIndex: fieldPrev,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record, rowIndex, columnIndex, store) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmOpen:
                    columnList.push({
                        itemId: qsId + cmap_mmOpen,
                        header: languageFormat.getLanguage(10104, 'Open'),
                        dataIndex: fieldOpen,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmOpenInt:
                    columnList.push({
                        itemId: qsId + cmap_mmOpenInt,
                        header: languageFormat.getLanguage(10105, 'Open Int'),
                        dataIndex: fieldOpenInt,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmLacp:
                    columnList.push({
                        itemId: qsId + cmap_mmLacp,
                        header: languageFormat.getLanguage(10106, 'LACP'),
                        dataIndex: fieldLacp,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmHigh:
                    columnList.push({
                        itemId: qsId + cmap_mmHigh,
                        header: languageFormat.getLanguage(10107, 'High'),
                        dataIndex: fieldHigh,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmLow:
                    columnList.push({
                        itemId: qsId + cmap_mmLow,
                        header: languageFormat.getLanguage(10108, 'Low'),
                        dataIndex: fieldLow,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmBidQty:
                    columnList.push({
                        itemId: qsId + cmap_mmBidQty,
                        header: languageFormat.getLanguage(10109, 'Bid.Qty'),
                        dataIndex: fieldBqty,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'numberyellow');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mmBidQty));
                        },
                        align: 'right'});
                    break;
                case cmap_mmBid:
                    columnList.push({
                        itemId: qsId + cmap_mmBid,
                        header: languageFormat.getLanguage(10110, 'Bid'),
                        dataIndex: fieldBuy,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmAsk:
                    columnList.push({
                        itemId: qsId + cmap_mmAsk,
                        header: languageFormat.getLanguage(10111, 'Ask'),
                        dataIndex: fieldSell,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmAskQty:
                    columnList.push({
                        itemId: qsId + cmap_mmAskQty,
                        header: languageFormat.getLanguage(10112, 'Ask.Qty'),
                        dataIndex: fieldSqty,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'numberyellow');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mmAskQty));
                        },
                        align: 'right'});
                    break;
                case cmap_mmLast:
                    columnList.push({
                        itemId: qsId + cmap_mmLast,
                        header: languageFormat.getLanguage(10113, 'Last'),
                        dataIndex: fieldLast,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmBS:
                    columnList.push({
                        itemId: qsId + cmap_mmBS,
                        header: languageFormat.getLanguage(10114, 'b/s'),
                        dataIndex: fieldPI,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            if (value == 'b' || value == 'm') {
                                value = languageFormat.getLanguage(11011,'b');
                            }else if (value == 's' || value == 'n') {
                            	value = languageFormat.getLanguage(11012,'s');
                            }else if(value == 'o'){
                            	value = '-';
                            }
                            
                            return formatutils.procStringValue(value);
                        },
                        align: 'center'});
                    break;
                case cmap_mmChg:
                    columnList.push({
                        itemId: qsId + cmap_mmChg,
                        header: languageFormat.getLanguage(10115, 'Chg'),
                        dataIndex: fieldChange,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'change');
                            if (parseFloat(record.data[fieldVol]) == 0) {
                                value = "-";
                            }

                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmChgPer:
                    columnList.push({
                        itemId: qsId + cmap_mmChgPer,
                        header: languageFormat.getLanguage(10116, 'Chg%'),
                        dataIndex: fieldChangePer,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'change');
                            if (parseFloat(record.data[fieldVol]) == 0) {
                                value = "-";
                            }

                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmLVol:
                    columnList.push({
                        itemId: qsId + cmap_mmLVol,
                        header: languageFormat.getLanguage(10117, 'L.Vol'),
                        dataIndex: fieldUnit,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'numberyellow');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mmLVol));
                        },
                        align: 'right'});
                    break;
                case cmap_mmVol:
                    columnList.push({
                        itemId: qsId + cmap_mmVol,
                        header: languageFormat.getLanguage(10118, 'Vol'),
                        dataIndex: fieldVol,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'numberyellow');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mmVol));
                        },
                        align: 'right'});
                    break;
                case cmap_mmTrades:
                    columnList.push({
                        itemId: qsId + cmap_mmTrades,
                        header: languageFormat.getLanguage(10119, 'Trades'),
                        dataIndex: fieldTotTrade,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, "unchange");
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mmTrades));
                        },
                        align: 'right'});
                    break;
                case cmap_mmSts:
                    columnList.push({
                        itemId: qsId + cmap_mmSts,
                        header: languageFormat.getLanguage(10120, 'Sts'),
                        dataIndex: fieldStkStatus,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procStringValue(value);
                        },
                        align: 'center'});
                    break;
                case cmap_mmNews:
                    columnList.push({
                        itemId: qsId + cmap_mmNews,
                        header: languageFormat.getLanguage(10121, 'News'),
                        dataIndex: fieldNews,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');

                            if (value == '..')
                                value = '';
                            else
                                value = value.replace('.', '');

                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmRSSIndicator:
                    columnList.push({
                        itemId: qsId + cmap_mmRSSIndicator,
                        header: 'ShortSell',
                        dataIndex: fieldRSSIndicator,
                        hidden: colHidden,
                        sortable: true,
                        width: panel.getWidth(columnID), //v1.3.30.9
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            if (value == 'R')
                                value = 'Y';
                            else
                                value = '-';

                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmTp:
                    columnList.push({
                        itemId: qsId + cmap_mmTp,
                        header: languageFormat.getLanguage(10122, 'TP'),
                        dataIndex: fieldTP,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        tooltip: languageFormat.getLanguage(20672),
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmTime:
                    columnList.push({
                        itemId: qsId + cmap_mmTime,
                        header: languageFormat.getLanguage(10123, 'Time'),
                        dataIndex: fieldTime,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procDateValue(value);
                        },
                        align: 'center'});
                    break;
                case cmap_mmTop:
                    columnList.push({
                        itemId: qsId + cmap_mmTop,
                        header: languageFormat.getLanguage(10124, 'TOP'),
                        dataIndex: fieldTOP,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmRD:
                    columnList.push({
                        itemId: qsId + cmap_mmRD,
                        header: languageFormat.getLanguage(10125, 'R/D'),
                        dataIndex: fieldRD,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procStringValue(value);
                        },
                        align: 'center'});
                    break;
                case cmap_mmExchg:
                    columnList.push({
                        itemId: qsId + cmap_mmExchg,
                        header: languageFormat.getLanguage(10126, 'Exchg'),
                        dataIndex: fieldExchangeCode,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmTValue:
                    columnList.push({
                        itemId: qsId + cmap_mmTValue,
                        header: languageFormat.getLanguage(10127, 'Value'),
                        dataIndex: fieldValue,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mmTValue));
                        },
                        align: 'right'});
                    break;
                case cmap_mmMargin:
                    columnList.push({
                        itemId: qsId + cmap_mmMargin,
                        header: languageFormat.getLanguage(10128, 'Marginable'),
                        dataIndex: 'margin',
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmMarginPrc:
                    columnList.push({
                        itemId: qsId + cmap_mmMarginPrc,
                        header: languageFormat.getLanguage(10129, 'Margin-Price'),
                        dataIndex: 'marginPrc',
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmMarginPc:
                    columnList.push({
                        itemId: qsId + cmap_mmMarginPc,
                        header: languageFormat.getLanguage(10130, 'Margin Perc.'),
                        dataIndex: 'marginPc',
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'
                    });
                    break;
                case cmap_mmLotSize:
                    columnList.push({
                        itemId: qsId + cmap_mmLotSize,
                        header: languageFormat.getLanguage(10131, 'Lot Size'),
                        dataIndex: fieldLotSize,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'numberyellow');
                            return panel.returnNumberFormat(value);
                        },
                        align: 'center'});
                    break;
                case cmap_mmCurrency:
                    columnList.push({
                        itemId: qsId + cmap_mmCurrency,
                        header: languageFormat.getLanguage(10132, 'Currency'),
                        dataIndex: fieldCurrency,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                       // menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return panel.returnNumberFormat(value);
                        },
                        align: 'center'});
                    break;
                case cmap_mmRemark:
                    columnList.push({
                        itemId: qsId + cmap_mmRemark,
                        header: languageFormat.getLanguage(10133, 'Remark'),
                        dataIndex: fieldRemark,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');

                            return panel.returnNumberFormat(value);
                        },
                        align: 'center'});
                    break;
                case cmap_mmSettPrice:
                    columnList.push({
                        itemId: qsId + cmap_mmSettPrice,
                        header: languageFormat.getLanguage(10184, 'Sett.'),
                        dataIndex: fieldSettPrice,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                        	newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmBuyRate:
                    columnList.push({
                        itemId: qsId + cmap_mmBuyRate,
                        header: languageFormat.getLanguage(10166, 'Buy%'),
                        dataIndex: fieldBuyRate,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            meta.tdCls = 'nopadding';

                            return getColorBar(value);
                        },
                        align: 'center'});
                    break;
                case cmap_mm52WHi_06:	//msgtype06
                    columnList.push({
                        itemId: qsId + cmap_mm52WHi_06,
                        header: languageFormat.getLanguage(10135, '52WHi'),
                        dataIndex: field52WHigh_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mm52WLo_06:	//msgtype06
                    columnList.push({
                        itemId: qsId + cmap_mm52WLo_06,
                        header: languageFormat.getLanguage(10136, '52WLo'),
                        dataIndex: field52WLow_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmIndexGrp_06:		//msgtype06
                    columnList.push({
                        itemId: qsId + cmap_mmIndexGrp_06,
                        header: languageFormat.getLanguage(10137, 'Category'),
                        dataIndex: fieldIndexGrp_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmPrevStkNo_06:	//msgtype06
                    columnList.push({
                        itemId: qsId + cmap_mmPrevStkNo_06,
                        header: languageFormat.getLanguage(10138, 'PrevStkNo'),
                        dataIndex: fieldPrevStkNo_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmPrevStkName_06:	//msgtype06
                    columnList.push({
                        itemId: qsId + cmap_mmPrevStkName_06,
                        header: languageFormat.getLanguage(10139, 'PrevStkName'),
                        dataIndex: fieldPrevLongName_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmTickSize_06:	//msgtype06
                    columnList.push({
                        itemId: qsId + cmap_mmTickSize_06,
                        header: languageFormat.getLanguage(10140, 'TickSize'),
                        dataIndex: fieldTickSize_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmTheoPrice_06:	//msgtype06
                    columnList.push({
                        itemId: qsId + cmap_mmTheoPrice_06,
                        header: languageFormat.getLanguage(10141, 'TheoPrice'),
                        dataIndex: fieldTheoPrice_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmDynamicLow_06:	//msgtype06
                    columnList.push({
                        itemId: qsId + cmap_mmDynamicLow_06,
                        header: languageFormat.getLanguage(10142, 'DynamicLow'),
                        dataIndex: fieldDynamicLow_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                       // menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmDynamicHigh_06:	//msgtype06
                    columnList.push({
                        itemId: qsId + cmap_mmDynamicHigh_06,
                        header: languageFormat.getLanguage(10143, 'DynamicHigh'),
                        dataIndex: fieldDynamicHigh_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmIssuer_06:
                    columnList.push({
                        itemId: qsId + cmap_mmIssuer_06,
                        header: languageFormat.getLanguage(10153, 'Issuer'),
                        dataIndex: fieldIssuer_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'left'});
                    break;
                case cmap_mmUnderCurrency_06:
                    columnList.push({
                        itemId: qsId + cmap_mmUnderCurrency_06,
                        header: languageFormat.getLanguage(10154, 'UnderCurr'),
                        dataIndex: fieldUnderCurr_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmUnderName_06:
                    columnList.push({
                        itemId: qsId + cmap_mmUnderName_06,
                        header: languageFormat.getLanguage(10155, 'UnderName'),
                        dataIndex: fieldUnderName_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'left'});
                    break;
                case cmap_mmExpiryDate:		//OSK
                    columnList.push({
                        itemId: qsId + cmap_mmExpiryDate,
                        header: languageFormat.getLanguage(10144, 'ExpiryDate'),
                        dataIndex: fieldExpiryDate,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            if(value && (value != '0')){
                            	value = Ext.util.Format.date(value, 'd/m/Y');
                            }else{
                            	value = "";
                            }
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmExePrice:	//OSK
                    columnList.push({
                        itemId: qsId + cmap_mmExePrice,
                        header: languageFormat.getLanguage(10152, 'ExPrice'),
                        dataIndex: fieldExercisePrice,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmExeRatio:	//OSK
                    columnList.push({
                        itemId: qsId + cmap_mmExeRatio,
                        header: languageFormat.getLanguage(10145, 'ExRatio'),
                        dataIndex: fieldExerciseRatio,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmGearingX:	//OSK
                    columnList.push({
                        itemId: qsId + cmap_mmGearingX,
                        header: languageFormat.getLanguage(10146, 'Gearing'),
                        dataIndex: fieldGearingX,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmPremiumPerc:	//OSK
                    columnList.push({
                        itemId: qsId + cmap_mmPremiumPerc,
                        header: languageFormat.getLanguage(10147, 'Premium%'),
                        dataIndex: fieldPremiumPerc,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmImpVolatility:	//OSK
                    columnList.push({
                        itemId: qsId + cmap_mmImpVolatility,
                        header: languageFormat.getLanguage(10148, 'I.V%'),
                        dataIndex: fieldImpVolatility,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmUnderlying:	//OSK
                    columnList.push({
                        itemId: qsId + cmap_mmUnderlying,
                        header: languageFormat.getLanguage(10149, 'Underlying'),
                        dataIndex: fieldUnderlying,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'center'});
                    break;

                case cmap_mmOptionType:	//OSK
                    columnList.push({
                        itemId: qsId + cmap_mmOptionType,
                        header: languageFormat.getLanguage(10150, 'OptionType'),
                        dataIndex: fieldOptionType,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'});
                    break;

                case cmap_mmOptionStyle:	//OSK
                    columnList.push({
                        itemId: qsId + cmap_mmOptionStyle,
                        header: languageFormat.getLanguage(10151, 'OptionStyle'),
                        dataIndex: fieldOptionStyle,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmFloatLevel_06:	//PSE
                    columnList.push({
                        itemId: qsId + cmap_mmFloatLevel_06,
                        header: languageFormat.getLanguage(10159, 'FloatLevel'),
                        dataIndex: fieldFloatLevel_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmFreeFloat_06:	//PSE
                    columnList.push({
                        itemId: qsId + cmap_mmFreeFloat_06,
                        header: languageFormat.getLanguage(10160, 'FreeFloat'),
                        dataIndex: fieldFreeFloat_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            // return formatutils.procPriceValue(value).value;
                            return panel.returnNumberFormat(value);
                        },
                        align: 'right'});
                    break;
                case cmap_mmFloatShare_06:	//PSE
                    columnList.push({
                        itemId: qsId + cmap_mmFloatShare_06,
                        header: languageFormat.getLanguage(10161, 'FloatShare'),
                        dataIndex: fieldFloatShare_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            //return formatutils.procPriceValue(value).value;
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mmFloatShare_06));
                        },
                        align: 'right'});
                    break;
                case cmap_mmFlunctuation_06:	//PSE
                    columnList.push({
                        itemId: qsId + cmap_mmFlunctuation_06,
                        header: languageFormat.getLanguage(10162, 'Fluctuations'),
                        dataIndex: fieldFlunctuation_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmForeignOwnerLimit_06:	//PSE
                    columnList.push({
                        itemId: qsId + cmap_mmForeignOwnerLimit_06,
                        header: languageFormat.getLanguage(10163, 'ForeignLimit'),
                        dataIndex: fieldForeignOwnerLimit,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            //return formatutils.procPriceValue(value).value;
                            return panel.returnNumberFormat(value);
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldShrIssue_05:	//PSE
                    columnList.push({
                        itemId: qsId + cmap_mmfieldShrIssue_05,
                        header: languageFormat.getLanguage(10164, 'OutStdShare'),
                        dataIndex: fieldShrIssue,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'numberyellow');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mmfieldShrIssue_05));
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldEPS:	//Dividend Info
                    columnList.push({
                        itemId: qsId + cmap_mmfieldEPS,
                        header: languageFormat.getLanguage(10177, '12MEPS'),
                        dataIndex: fieldEPS,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldPERatio:	//Dividend Info
                    columnList.push({
                        itemId: qsId + cmap_mmfieldPERatio,
                        header: languageFormat.getLanguage(10178, '12MP/E'),
                        dataIndex: fieldPERatio,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfield12MDiv:	//Dividend Info
                    columnList.push({
                        itemId: qsId + cmap_mmfield12MDiv,
                        header: languageFormat.getLanguage(10167, '12MDiv'),
                        dataIndex: field12MDiv,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldDivPay:	//Dividend Info
                    columnList.push({
                        itemId: qsId + cmap_mmfieldDivPay,
                        header: languageFormat.getLanguage(10168, 'DivPay'),
                        dataIndex: fieldDivPay,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldDivEx:	//Dividend Info
                    columnList.push({
                        itemId: qsId + cmap_mmfieldDivEx,
                        header: languageFormat.getLanguage(10169, 'DivEx'),
                        dataIndex: fieldDivEx,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldDivYld:	//Dividend Info
                    columnList.push({
                        itemId: qsId + cmap_mmfieldDivYld,
                        header: languageFormat.getLanguage(10170, 'DivYld'),
                        dataIndex: fieldDivYld,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldDivCcy:	//Dividend Info
                    columnList.push({
                        itemId: qsId + cmap_mmfieldDivCcy,
                        header: languageFormat.getLanguage(10171, 'DivCcy'),
                        dataIndex: fieldDivCcy,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldIntDiv:	//Dividend Info
                    columnList.push({
                        itemId: qsId + cmap_mmfieldIntDiv,
                        header: languageFormat.getLanguage(10172, 'IntDiv'),
                        dataIndex: fieldIntDiv,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                       // menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldIntExDate:	//Dividend Info
                    columnList.push({
                        itemId: qsId + cmap_mmfieldIntExDate,
                        header: languageFormat.getLanguage(10173, 'IntExDate'),
                        dataIndex: fieldIntExDate,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                       // menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldSpDiv:	//Dividend Info
                    columnList.push({
                        itemId: qsId + cmap_mmfieldSpDiv,
                        header: languageFormat.getLanguage(10174, 'SpDiv'),
                        dataIndex: fieldSpDiv,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldSpDivExDate:	//Dividend Info
                    columnList.push({
                        itemId: qsId + cmap_mmfieldSpDivExDate,
                        header: languageFormat.getLanguage(10175, 'SpDivExDate'),
                        dataIndex: fieldSpDivExDate,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldFinDiv:	//Dividend Info
                    columnList.push({
                        itemId: qsId + cmap_mmfieldFinDiv,
                        header: languageFormat.getLanguage(10176, 'FinDiv'),
                        dataIndex: fieldFinDiv,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                       // menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldFinDivExDate:	//Dividend Info
                    columnList.push({
                        itemId: qsId + cmap_mmfieldFinDivExDate,
                        header: languageFormat.getLanguage(10179, 'FinDivExDate'),
                        dataIndex: fieldFinDivExDate,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: colWidth,
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldFXSpread:	//FOREX
                    columnList.push({
                        itemId: qsId + cmap_mmfieldFXSpread,
                        header: languageFormat.getLanguage(10180, 'Spread'),
                        dataIndex: fieldFXSpread,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                     //   menuDisabled: isMobile,
                        width: colWidth, //v1.3.30.9
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_fieldRefPrice_06:	//CIMBSG Circuit Breaker Enhancements
                    columnList.push({
                        itemId: qsId + cmap_fieldRefPrice_06,
                        header: languageFormat.getLanguage(10181, 'Reference'),
                        dataIndex: fieldRefPrice_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: colWidth, //v1.3.30.9
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_fieldEndTime_06:	//CIMBSG Circuit Breaker Enhancements
                    columnList.push({
                        itemId: qsId + cmap_fieldEndTime_06,
                        header: languageFormat.getLanguage(10182, 'EndTime'),
                        dataIndex: fieldEndTime_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: colWidth, //v1.3.30.9
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmCFDTradable_06:	//CFD Columns
                    columnList.push({
                        itemId: qsId + cmap_mmCFDTradable_06,
                        header: languageFormat.getLanguage(10185, 'CFD Tradable'),
                        dataIndex: fieldCFDTradable_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: colWidth, //v1.3.30.9
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            if(value && value == '1'){
                            	value = 'Y';
                            }else{
                            	value = 'N';
                            }
                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmCFDSS_06:	//CFD Columns
                    columnList.push({
                        itemId: qsId + cmap_mmCFDSS_06,
                        header: languageFormat.getLanguage(10186, 'CFD ShortSell'),
                        dataIndex: fieldCFDShortSell_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: colWidth, //v1.3.30.9
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            if(value && value == '1'){
                            	value = 'Y';
                            }else{
                            	value = 'N';
                            }
                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmCFDMarginPerc_06:	//CFD Columns
                    columnList.push({
                        itemId: qsId + cmap_mmCFDMarginPerc_06,
                        header: languageFormat.getLanguage(10187, 'CFD Margin%'),
                        dataIndex: fieldCFDMarginPerc_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: colWidth, //v1.3.30.9
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmCFDMarginLS_06:	//CFD Columns
                    columnList.push({
                        itemId: qsId + cmap_mmCFDMarginLS_06,
                        header: languageFormat.getLanguage(10188, 'CFD Margin LotSize'),
                        dataIndex: fieldCFDMarginLS_06,
                        hidden: colHidden,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: colWidth, //v1.3.30.9
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
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
    generateColumn: function (newSetting) {
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
    generateColumnName: function (id) {
        var string = "";

        switch (id) {
            case cmap_mmCode:
                string = languageFormat.getLanguage(10101, 'Code');
                break;
            case cmap_mmSymbol:
                string = languageFormat.getLanguage(10102, 'Symbol');
                break;
            case cmap_mmClose:
                string = languageFormat.getLanguage(10103, 'Close');
                break;
            case cmap_mmOpen:
                string = languageFormat.getLanguage(10104, 'Open');
                break;
            case cmap_mmOpenInt:
                string = languageFormat.getLanguage(10105, 'Open Int');
                break;
            case cmap_mmLacp:
                string = languageFormat.getLanguage(10106, 'LACP');
                break;
            case cmap_mmHigh:
                string = languageFormat.getLanguage(10107, 'High');
                break;
            case cmap_mmLow:
                string = languageFormat.getLanguage(10108, 'Low');
                break;
            case cmap_mmBidQty:
                string = languageFormat.getLanguage(10109, 'Bid.Qty');
                break;
            case cmap_mmBid:
                string = languageFormat.getLanguage(10110, 'Bid');
                break;
            case cmap_mmAsk:
                string = languageFormat.getLanguage(10111, 'Ask');
                break;
            case cmap_mmAskQty:
                string = languageFormat.getLanguage(10112, 'Ask.Qty');
                break;
            case cmap_mmLast:
                string = languageFormat.getLanguage(10113, 'Last');
                break;
            case cmap_mmBS:
                string = languageFormat.getLanguage(10114, 'b/s');
                break;
            case cmap_mmChg:
                string = languageFormat.getLanguage(10115, 'Chg');
                break;
            case cmap_mmChgPer:
                string = languageFormat.getLanguage(10116, 'Chg%');
                break;
            case cmap_mmLVol:
                string = languageFormat.getLanguage(10117, 'L.Vol');
                break;
            case cmap_mmVol:
                string = languageFormat.getLanguage(10118, 'Vol');
                break;
            case cmap_mmTrades:
                string = languageFormat.getLanguage(10119, 'Trades');
                break;
            case cmap_mmSts:
                string = languageFormat.getLanguage(10120, 'Sts');
                break;
            case cmap_mmNews:
                string = languageFormat.getLanguage(10121, 'News');
                break;
            case cmap_mmRSSIndicator:
                string = 'ShortSell';
                break;
            case cmap_mmTp:
                string = languageFormat.getLanguage(10122, 'TP');
                break;
            case cmap_mmTime:
                string = languageFormat.getLanguage(10123, 'Time');
                break;
            case cmap_mmTop:
                string = languageFormat.getLanguage(10124, 'TOP');
                break;
            case cmap_mmRD:
                string = languageFormat.getLanguage(10125, 'R/D');
                break;
            case cmap_mmExchg:
                string = languageFormat.getLanguage(10126, 'Exchg');
                break;
            case cmap_mmTValue:
                string = languageFormat.getLanguage(10127, 'Value');
                break;
            case cmap_mmMargin:
                string = languageFormat.getLanguage(10128, 'Marginable');
                break;
            case cmap_mmMarginPrc:
                string = languageFormat.getLanguage(10129, 'Margin-Price');
                break;
            case cmap_mmMarginPc:
                string = languageFormat.getLanguage(10130, 'Margin Perc.');
                break;
            case cmap_mmLotSize:
                string = languageFormat.getLanguage(10131, 'Lot Size');
                break;
            case cmap_mmCurrency:
                string = languageFormat.getLanguage(10132, 'Currency');
                break;
            case cmap_mmRemark:
                string = languageFormat.getLanguage(10133, 'Remark');
                break;
            case cmap_mm52WHi_06:	//msgtype06
                string = languageFormat.getLanguage(10135, '52WHi');
                break;
            case cmap_mm52WLo_06:
                string = languageFormat.getLanguage(10136, '52WLo');
                break;
            case cmap_mmIndexGrp_06:
                string = languageFormat.getLanguage(10137, 'Category');
                break;
            case cmap_mmIssuer_06:
                string = languageFormat.getLanguage(10153, 'Issuer');
                break;
            case cmap_mmUnderCurrency_06:
                string = languageFormat.getLanguage(10154, 'UnderCurr');
                break;
            case cmap_mmUnderName_06:
                string = languageFormat.getLanguage(10155, 'UnderName');
                break;
            case cmap_mmBuyRate:
                string = languageFormat.getLanguage(10166, 'Buy%');
                break;
                //OSK
            case cmap_mmExpiryDate:
                string = languageFormat.getLanguage(10144, 'ExpiryDate');
                break;
            case cmap_mmExePrice:
                string = languageFormat.getLanguage(10152, 'ExPrice');
                break;
            case cmap_mmExeRatio:
                string = languageFormat.getLanguage(10145, 'ExRatio');
                break;
            case cmap_mmGearingX:
                string = languageFormat.getLanguage(10146, 'Gearing');
                break;
            case cmap_mmPremiumPerc:
                string = languageFormat.getLanguage(10147, 'Premium%');
                break;
            case cmap_mmImpVolatility:
                string = languageFormat.getLanguage(10148, 'I.V%');
                break;
            case cmap_mmUnderlying:
                string = languageFormat.getLanguage(10149, 'Underlying');
                break;
            case cmap_mmOptionType:
                string = languageFormat.getLanguage(10150, 'OptionType');
                break;
            case cmap_mmOptionStyle:
                string = languageFormat.getLanguage(10151, 'OptionStyle');
                break;
                //PSE
            case cmap_mmFloatLevel_06:
                string = languageFormat.getLanguage(10159, 'FloatLevel');
                break;
            case cmap_mmFreeFloat_06:
                string = languageFormat.getLanguage(10160, 'FreeFloat');
                break;
            case cmap_mmFloatShare_06:
                string = languageFormat.getLanguage(10161, 'FloatShare');
                break;
            case cmap_mmFlunctuation_06:
                string = languageFormat.getLanguage(10162, 'Fluctuations');
                break;
            case cmap_mmForeignOwnerLimit_06:
                string = languageFormat.getLanguage(10163, 'ForeignLimit');
                break;
            case cmap_mmDynamicLow_06:
                string = languageFormat.getLanguage(10142, 'DynamicLow');
                break;
            case cmap_mmDynamicHigh_06:
                string = languageFormat.getLanguage(10143, 'DynamicHigh');
                break;
            case cmap_mmfieldShrIssue_05:
                string = languageFormat.getLanguage(10164, 'OutStdShare');
                break;
            case cmap_mmTickSize_06:
                string = languageFormat.getLanguage(10140, 'TickSize');
                break;
                //Dividend Info
            case cmap_mmfieldEPS:
                string = languageFormat.getLanguage(10177, '12MEPS');
                break;
            case cmap_mmfieldPERatio:
                string = languageFormat.getLanguage(10178, '12MP/E');
                break;
            case cmap_mmfield12MDiv:
                string = languageFormat.getLanguage(10167, '12MDiv');
                break;
            case cmap_mmfieldDivPay:
                string = languageFormat.getLanguage(10168, 'DivPay');
                break;
            case cmap_mmfieldDivEx:
                string = languageFormat.getLanguage(10169, 'DivEx');
                break;
            case cmap_mmfieldDivYld:
                string = languageFormat.getLanguage(10170, 'DivYld');
                break;
            case cmap_mmfieldDivCcy:
                string = languageFormat.getLanguage(10171, 'DivCcy');
                break;
            case cmap_mmfieldIntDiv:
                string = languageFormat.getLanguage(10172, 'IntDiv');
                break;
            case cmap_mmfieldIntExDate:
                string = languageFormat.getLanguage(10173, 'IntExDate');
                break;
            case cmap_mmfieldSpDiv:
                string = languageFormat.getLanguage(10174, 'SpDiv');
                break;
            case cmap_mmfieldSpDivExDate:
                string = languageFormat.getLanguage(10175, 'SpDivExDate');
                break;
            case cmap_mmfieldFinDiv:
                string = languageFormat.getLanguage(10176, 'FinDiv');
                break;
            case cmap_mmfieldFinDivExDate:
                string = languageFormat.getLanguage(10179, 'FinDivExDate');
                break;
            case cmap_mmfieldFXSpread:
                string = languageFormat.getLanguage(10180, 'Spread');
                break;
            case cmap_fieldRefPrice_06:
                string = languageFormat.getLanguage(10181, 'Reference');
                break;
            case cmap_fieldEndTime_06:
                string = languageFormat.getLanguage(10182, 'EndTime');
                break;
            default:
                string = "";
        }

        return string;
    },
    /**
     * Description <br/>
     * 
     * 		set stock category filter list 
     */
    initializeFilter: function () {
        var panel = this;
        // reset sector info
        panel.secList = null;
        panel.sector = null;
        
        var arr = new Array();
        global_isWarrantList.length = 0;
        var market;
        var secs = feedLoginRet.sec;
        // set default market
        for (var i = 0; i < secs.length; i++) {
            var sec = secs[i];
            if (sec.ex == panel.exchangecode) {
                market = sec.sc; // make the first one as default market
                break;
            }
        }

        var standardFunction = function (newText) {
            panel.setPageNo(0);
            panel.tFieldSearch.setValue('');
            panel.tButtonAllStock.setText(newText);
            if (panel.onSearchStatus) {
                panel.initializeTop();
            }
            panel.callSort();
        };
        
        //var defSecList = sectorFilter || null; // passed in main.jsp?sector=2203 (if any)
        var defSecList = null;
        arr.push({
            market: market,
            secList: defSecList,
            text: languageFormat.getLanguage(20636, 'All Stock'),
            handler: function () {
                panel.setFilterInfo(this.market, this.secList, null);
                panel.initializeSector();
                standardFunction(this.text);
            }
        });
        arr.push('-');

        // suspended
        arr.push({
            market: market,
            secList: '9998',
            text: languageFormat.getLanguage(20670, 'Suspended'),
            handler: function () {
                panel.setFilterInfo(this.market, this.secList, null);
                panel.initializeSector();
                standardFunction(this.text);
            }
        });

        // entitlement
        arr.push({
            market: market,
            secList: '9999',
            text: languageFormat.getLanguage(20671, 'Entitlement'),
            handler: function () {
                panel.setFilterInfo(this.market, this.secList, null);
                panel.initializeSector();
                standardFunction(this.text);
            }
        });

        arr.push({
            market: market,
            secList: '9995',
            text: languageFormat.getLanguage(20647, 'IPO / New Listing'),
            handler: function () {
                panel.setFilterInfo(this.market, this.secList, null);
                panel.initializeSector();
                standardFunction(this.text);
            }
        });

        arr.push('-');

        if (feedFilterRet != null) {
            var bl = feedFilterRet.bl; // sector parent (sector list)
            if (bl.length > 0) {
                panel.secListAsSector = true; // JK case which does not have sector list. This will check if the whole sector list have does not have children, so sector list is sector
            } else {
                panel.secListAsSector = null;
            }
            for (var i = 0; i < bl.length; i++) {
                var cat = bl[i];

                if (cat['id'] == '10000') {
                    continue;
                }

                var arr2 = new Array();
                var bi = feedFilterRet.bi; // individual sector

                for (var j = 0; j < bi.length; j++) {
                    var item = bi[j];
                    if (item['bid'] == cat['id']) {
                    	if(cat['id'] == '2203'){
                    		global_isWarrantList.push(item['id']);
                    	}
                        var sc = item['id']; // sector code
                        var obj2 = {
                            market: market,
                            sector: sc, // sector code
                            bl: cat['n'], // sector name
                            text: item['n'],
                            secList: item['bid'], // sector list
                            handler: function () {
                                panel.setFilterInfo(this.market, this.secList, this.sector);
                                panel.initializeSector();
                                standardFunction(this.bl + ' [' + this.text + ']');
                            }
                        };
                        arr2.push(obj2);
                    }
                }
                var obj;
                if (arr2.length > 0) { // a sector parent which has children (sectors)
                    sc = cat['id'];
                    obj2 = {
                        market: market,
                        secList: sc,
                        bl: cat['n'], // sector list name
                        text: languageFormat.getLanguage(10024, 'All'),
                        handler: function () {
                            panel.setFilterInfo(this.market, this.secList, null);
                            panel.initializeSector();
                            standardFunction(this.bl);
                        }
                    };
                    arr2.splice(0, 0, obj2); // move to the first position

                    obj = {
                        secList: sc,
                        text: cat['n'],
                        hideOnClick: !touchMode,
                        menu: arr2 // sector list sub menu
                    };
                    
                    panel.secListAsSector = false;
                } else {
                    sc = cat['id'];
                    
                    var cls = '';
                    if ((cat['ex'] === 'PH' || cat['ex'] === 'PHD') && sc == 2211) { // PSEI
                        cls = 'N2N_FontStockName_2';
                    }
                    
                    obj = {
                        market: market,
                        secList: sc,
                        text: cat['n'],
                        cls: cls,
                        _cls: cls,
                        handler: function () {
                            var _secList = this.secList;
                            var _sec;
                            if (panel.secListAsSector) {
                                _sec = _secList;
                                _secList = null;
                            }
                            panel.setFilterInfo(this.market, _secList, _sec);
                            panel.initializeSector();
                            
                            var btnLabel = this.text;
                            if (this._cls) {
                                btnLabel = '<span class="' + this._cls + '">' + btnLabel + '</span>';
                            }
                            standardFunction(btnLabel);
                        }
                    };
                }
                arr.push(obj);
            }
        }
        
        panel.tButtonAllStock.menu = new Ext.menu.Menu({
            items: arr
        });

        if (arr.length > 0) {
        	if(sectorFilter.length > 0){
        		for(var j=0; j<arr.length; j++){
        			if(sectorFilter == arr[j].secList){
        				panel.tButtonAllStock.setText(arr[j].text);
        				break;
        			}
        		}
        	}else{
        		panel.tButtonAllStock.setText(arr[0].text);
        	}
        }

    },
    sectorButtonFunction: function (text) {
        var panel = this;

        // set paging number to 0
        panel.setPageNo(0);
        // reset stock category
        panel.initializeFilter();
        // reset top value 
        panel.initializeTop();
        // call ajax
        panel.callSort();
        // clear search text field to empty
        panel.tFieldSearch.setValue('');
    },
    /**
     * Description <br/>
     * 
     * 		set "Normal Board Lot", "Buy In Board Lot" .... filter list
     */
    initializeSector: function () {
        var panel = this;

        console.log('[feed][initializeSector] start *** ');

        // bug - v1.3.14.12    	
        
        // reset market
        panel.market = null;
        panel.defMkt = null;
        
        var secs = feedLoginRet.sec; // market
        var arr = new Array();

        // *** 1.3.29.19
        var idx = feedLoginRet.ex;
        var totIdx = idx.length;
        for (var i = 0; i < totIdx; i++) {
            var exchg = idx[i];
            if (exchangecode == exchg.ex) {
                panel.idxcode = exchg.ix;
                break;
            }
        }

        if (showSector == "TRUE") {

            /* 
             * is the this value exist, mean only to show this information
             * e.g.  :  10,11 
             */
            var tempShowFilter = showFilterSector; // verify from main.jsp

            var tempList = [];

            for (var i = 0; i < secs.length; i++) { // sc here is market
                var sec = secs[i];
                if (sec.ex == exchangecode) {
                    tempList.push({
                        sc: sec['sc'],
                        text: sec['1']
                    });
                }
            }

            // confShowFilterSector filtering for equities market only.
            if (tempShowFilter != "" && exchangecode != 'MY') {
                var sFilterSector = tempShowFilter.split(',');
                var newTempList = [];

                for (var z = 0; z < sFilterSector.length; z++) {
                    var vSector = sFilterSector[z];
                    var vText = null;

                    for (var y = 0; y < tempList.length; y++) {
                        if (tempList[y].sc == vSector) {
                            vText = tempList[y].text;
                        }
                    }
                    if (vText != null) {
                        newTempList.push({
                            sc: vSector,
                            text: vText
                        });
                    }
                }
                tempList = newTempList;
            }

            for (var i = 0; i < tempList.length; i++) {
                var stringValue = tempList[i];
                if (stringValue.sc != '2000') {
                    var obj = {
                        market: stringValue.sc,
                        text: quotelabel.MarketButtonLabel(stringValue.sc, stringValue.text),
                        handler: function() {
                            panel.setPageNo(0);
                            panel.setFilterInfo(this.market, null, null);

                            panel.tButtonMarket.setText(this.text);

                            if (panel.onSearchStatus) {
                                // bug - v1.3.14.12    	
                                //panel.search();
                                panel.onSearchStatus = false;
                                panel.sectorButtonFunction();
                            } else {

                                if (this.market != '10') { // if not 'Normal Board Lot', it will reset the 'Sector' menu to 'All Stock'
                                    panel.initializeFilter();
                                }
                                panel.callSort();
                            }
                        }
                    };

                    arr.push(obj);
                }
            }
        }

        if (arr.length > 0) {
            // set default market
            panel.market = arr[0].market;
            panel.defMkt = arr[0].market;
            // set button text
            panel.tButtonMarket.setText(arr[0].text);
        }
        
        panel.tButtonMarket.menu = new Ext.menu.Menu({
            items: arr
        });
            
        // if item more than 1, it will display the menu; else it will not display the menu /*26-9-12 Not works!*/
        if (arr.length > 1) { //v1.3.29.8 Enhancement needed to remove the drop down
            helper.show(panel.tButtonMarket);
        } else {
            helper.hide(panel.tButtonMarket);
        }

        panel.onResetMode = true;

        if (panel.tRadioMarket != null) {

            if (panel.tRadioMarket.items.items.length > 0) {
                panel.tRadioMarket.items.items[ 0 ].setValue(true);
            }
        }

        panel.onResetMode = false;

    },
    /**
     * Description <br/>
     * 
     * 		generate top value button function (sorting menu)
     * 
     */
    initializeTop: function () {
        var panel = this;

        var topButtonFunction = function (text, property, direction) {
            // keep sort info
            panel.sort = [{property: property, direction: direction}];
            // set paging number to 0
            panel.setPageNo(0);
            // call ajax
            panel.callSort();
            // set button text 
            panel.tButtonTop.setText(panel._getSortBtnLabel(text));
            // clear search text field to empty
            panel.tFieldSearch.setValue('');
        };

        var newList = [
            {
                text: languageFormat.getLanguage(20637, 'Sort by Volume'),
                handler: function () {
                    topButtonFunction(this.text, fieldVol, 'DESC');
                }
            },
            {
                text: languageFormat.getLanguage(20638, 'Sort by Gainers'),
                handler: function () {
                    topButtonFunction(this.text, fieldChange, 'DESC');
                }
            },
            {
                text: languageFormat.getLanguage(20639, 'Sort by Gainers %'),
                handler: function () {
                    topButtonFunction(this.text, fieldChangePer, 'DESC');
                }
            },
            {
                text: languageFormat.getLanguage(20640, 'Sort by Losers'),
                handler: function () {
                    topButtonFunction(this.text, fieldChange, 'ASC');
                }
            },
            {
                text: languageFormat.getLanguage(20641, 'Sort by Losers %'),
                handler: function () {
                    topButtonFunction(this.text, fieldChangePer, 'ASC');
                }
            },
            {
                text: languageFormat.getLanguage(20642, 'Sort by Name'),
                handler: function () {
                    var _property = fieldStkName;
                    var _direction = 'ASC';

                    if (exchangecode == 'MY') {
                        _property = fieldStkFName;
                    }

                    topButtonFunction(this.text, _property, _direction);
                }
            },
            {
                text: languageFormat.getLanguage(20643, 'Sort by Trade'),
                handler: function () {
                    topButtonFunction(this.text, fieldTotTrade, 'DESC');
                }
            },
            {
                text: languageFormat.getLanguage(20644, 'Sort by Value'),
                handler: function () {
                    topButtonFunction(this.text, fieldValue, 'DESC');
                }
            },
            {
                text: languageFormat.getLanguage(20645, 'Sort by Close'),
                handler: function () {
                    topButtonFunction(this.text, fieldPrev, 'DESC');
                }
            },
            {
                text: languageFormat.getLanguage(20674, 'Sort by LACP'),
                handler: function () {
                    topButtonFunction(this.text, fieldLacp, 'DESC');
                }
            },
            {
                text: languageFormat.getLanguage(20675, 'Sort by Bid.Qty'),
                handler: function () {
                    topButtonFunction(this.text, fieldBqty, 'DESC');
                }
            }
        ];

        panel.tButtonTop.menu = new Ext.menu.Menu({
            items: newList
        });

        var defaultTopButtonText = languageFormat.getLanguage(20637, 'Sort by Volume');
        if (panel.exchangecode == 'MY') {
            defaultTopButtonText = languageFormat.getLanguage(20642, 'Sort by Name');
        }

        panel.tButtonTop.setText(panel._getSortBtnLabel(defaultTopButtonText));
    },
    /**
     * Description <br/>
     * 
     * 		reset this object all component items to default
     */
    resetFeedSetting: function () {
        var panel = this;

        panel.compRef.btnEditDone.setText(languageFormat.getLanguage(10021, 'Edit'));
        panel.compRef.btnEditDone.setIcon(ICON.EDIT);
        panel.compRef.btnEditDone.toggle(false, true);
        panel._setDisplayRecord();
        panel.onWarrantSearchMode = false; // reset warrantsearch mode

        /*
         * set ascending order by original column
         */
        if (panel.exchangecode == 'MY') {
            panel.sort = [{property: fieldStkFName, direction: 'ASC'}];
        } else {
            panel.sort = [{property: fieldVol, direction: 'DESC'}];
        }
        
        /*
         * reset filter list 
         * 		such as : Normal Board Lot, Buy In Board Lot and so on
         */
        panel.initializeSector();
        /*
         *  reset filter list 
         *  	such as : all stock
         */
        panel.initializeFilter();
        /*
         *  reset filter list 
         *  	such as : top xxx value , top xxx loser
         */
        panel.initializeTop();
        panel.tCombo_SearchType.setValue("this");
        panel.onResetMode = true;

        if (panel.tRadioMarket != null) {

            if (panel.tRadioMarket.items.items.length > 0) {
                panel.tRadioMarket.items.items[ 0 ].setValue(true);
            }
        }

        panel.onResetMode = false;

//		/*
//* reset the object sector code and market
//*/
//var secs = feedLoginRet.sec;
//		for (var i = 0; i < secs.length; i++) {
//		var sec = secs[i];
//		if (sec.ex == panel.exchangecode) {
//		panel.sectorcode = sec.sc;
//		panel.market = sec.sc;
//		break;
//		}
//		}

    },
    /**
     * Description <br/>
     * 
     * 		generate column setting
     * 
     * @return string / null
     */
    generateColumnID: function () {
        var panel = this;

        var columnModel = panel.getColumnModel();

        if (columnModel != null && mmColSetting != null && mmColSetting != "") { // verify from main.jsp
            var param = "";
            for (var i = 0; i < columnModel.getColumnCount() - 1; i++) {
                var colId = columnModel.getColumnId(i);
                if (!columnModel.isHidden(i)) {
                    if (param != "") {
                        param += "~";
                    }
                    param += colId;
                }
            }
            return param;
        } else {
            return null;
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

//		var urlbuf = new Array();
//		urlbuf.push(addPath + 'tcplus/field?');
//		urlbuf.push('s=' + dwr.engine._scriptSessionId);
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
//		},
//		failure: function(response) {
//		}
//		});
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
    getFieldList: function (type) {
        var panel = this;

        var returnArray = new Array();
        var columns = helper.getGridColumns(panel);

        returnArray.push(fieldStkCode);		// stock code	
        returnArray.push(fieldStkName);		// stock name
        returnArray.push(fieldSectorCode);  // sector code 1.3.29.19

        returnArray.push(fieldLast);		// last, change, change %		
        returnArray.push(fieldStatus);		// news, status
        returnArray.push(fieldSell);
        returnArray.push(fieldLacp);
        returnArray.push(fieldCurrency);
        returnArray.push(fieldRemark);
        returnArray.push(fieldPrev);
        returnArray.push(fieldLotSize);		// get the stock buy quantity, for trading use
        returnArray.push(fieldIndexCode);
        returnArray.push(fieldStkFName);
        returnArray.push(fieldInstrument);	// for order pad using
        returnArray.push(fieldTransNo);		// for tracker info
        returnArray.push(fieldTotBVol);

        var columnCount = columns.length;
        for (var i = 0; i < columnCount; i++) {
            var storeValue = null;
            var allowProcess = false;

            var col = columns[i];
            if (type == "all") {
                allowProcess = true;

            } else {
                //verify the column is hidden or show
                if (!col.hidden) {
                    allowProcess = true;
                } else {
                    allowProcess = false;
                }
            }

            if (allowProcess) {
                // get out the column data index
                var dataIndex = col.dataIndex;

                if (dataIndex == fieldLast || dataIndex == fieldChange || dataIndex == fieldChangePer) {
                    storeValue = fieldLast;

                } else if (dataIndex == fieldStatus || dataIndex == fieldNews || dataIndex == fieldRSSIndicator) {
                    storeValue = fieldStatus;

                } else if(dataIndex == fieldCFDMapValue_06 || dataIndex == fieldCFDTradable_06 || dataIndex == fieldCFDShortSell_06){
                	storeValue = fieldCFDMapValue_06;
                }else {
                    if (dataIndex == fieldStkCode) {
                        if (jQC == "TRUE") {
                            storeValue = dataIndex;
                        } else {
                            storeValue = null;
                        }
                    } else {
                        storeValue = dataIndex;
                    }
                }

                var isExist = false;
                for (var ii = 0; ii < returnArray.length; ii++) {
                    var val = returnArray[ii];
                    if (val == storeValue) {
                        isExist = true;
                    }
                }
                if (!isExist) {
                    if ((storeValue != "0" && (/^-?\d+$/).test(storeValue)) || storeValue === fieldBuyRate) {
                        returnArray.push(storeValue);
                    }
                }
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
     * 		create right click menu 
     */
    createContextMenu: function () {
        var panel = this;

        /*
         *  showV1GUI == true
         *  
         *  Buy
         *  Sell
         *  Market Depth
         *  Stock Info
         *  Stock News
         *  Intraday Chart
         *  
         *  
         *  showV1GUI == false
         *  
         *  Buy
         *  Sell
         *  Market Depth
         *  Stock Info
         *  Tracker
         *  Intraday Chart
         *  Analysis Chart
         *  Stock News
         *  Fundamental (Capital IQ)
         *  Fundamental (Thomson Reuters)
         *  Add Stock Alert
         *  
         */

        var newMenu = [
            {
                id: panel.cMenuBuyId,
                text: languageFormat.getLanguage(10001, 'Buy'),
                icon: icoBtnBuy,
                hidden: showV1GUI == "TRUE" ? false : (showBuySellHeader == "TRUE" ? false : true),
                popupOnly: true
            }, {
                id: panel.cMenuSellId,
                text: languageFormat.getLanguage(10002, 'Sell'),
                icon: icoBtnSell,
                hidden: showV1GUI == "TRUE" ? false : (showBuySellHeader == "TRUE" ? false : true),
                popupOnly: true
            }, {
                id: panel.cMenuOrderStatus,
                text: languageFormat.getLanguage(10009, 'Revise') + ' / ' + languageFormat.getLanguage(10010, 'Cancel'),
                icon: icoBtnOrdSts,
                hidden: showV1GUI == "TRUE" ? false : (showOrdBookHeader == "TRUE" ? (showOrdBookOrderSts == "TRUE" ? false : true) : true)
            }, {
                id: panel.cMenuDepthId,
                text: languageFormat.getLanguage(20022, 'Market Depth'),
                icon: icoBtnDepth,
                hidden: showV1GUI == "TRUE" ? false : (showStkInfoHeader == "TRUE" ? (showStkInfoMarketDepth == "TRUE" ? false : true) : true)
            }, {
                id: panel.cMenuStkInfoId,
                text: languageFormat.getLanguage(20021, 'Stock Info'),
                icon: icoBtnStkInfo,
                hidden: showV1GUI == "TRUE" ? false : (showStkInfoHeader == "TRUE" ? (showStkInfoStkInfo == "TRUE" ? false : true) : true)
            }, {
                id: panel.cMenuStkTrackerId,
                text: languageFormat.getLanguage(20024, 'Stock Tracker'),
                iconCls: 'tracker-ico',
                hidden: showV1GUI == "TRUE" ? true : (showStkInfoHeader == "TRUE" ? (showStkInfoTracker == "TRUE" ? false : true) : true)
            }, {
                id: panel.cMenuEqTrackerId,
                text: languageFormat.getLanguage(20025, 'Equities Tracker'),
                icon: icoBtnEquitiesTracker,
                hidden: showV1GUI == "TRUE" ? false : (showStkInfoHeader == "TRUE" ? (showStkInfoEquitiesTracker == "TRUE" ? false : true) : true)
            }, {
                id: panel.cMenuHisDataId,
                text: languageFormat.getLanguage(20060, 'Historical Data'),
                icon: ICON.HIS_DATA,
                hidden: !(showStkInfoHeader == "TRUE" && N2N_CONFIG.features_HistoricalData)
            }, {
                id: panel.cMenuChartId,
                text: languageFormat.getLanguage(20101, 'Intraday Chart'),
                icon: icoBtnIntraChart,
                hidden: showV1GUI == "TRUE" ? false : (showChartHeader == "TRUE" ? (showChartIntradayChart == "TRUE" ? false : true) : true)
            }, {
                id: panel.cMenuAnalysisId,
                text: languageFormat.getLanguage(20102, 'Analysis Chart'),
                icon: icoBtnAnalysisChart,
                hidden: showV1GUI == "TRUE" ? true : (showChartHeader == "TRUE" ? (showChartAnalysisChart == "TRUE" ? false : true) : true)
            }, {
                id: panel.cMenuStkNewsId,
                text: languageFormat.getLanguage(20123, 'Stock News'),
                icon: icoBtnNews,
                hidden: showV1GUI == "TRUE" ? false : (showNewsHeader == "TRUE" ? (showNewsStockNews == "TRUE" ? false : true) : true)
            }, {
                id: panel.cMenuArchiveNewsId,
                text: languageFormat.getLanguage(20137, 'News Archive'),
                icon: icoBtnArchive,
                hidden: showV1GUI == "TRUE" ? false : (showNewsHeader == "TRUE" ? (!N2N_CONFIG.featuresNews_Archive) : true)
            }, {
                id: panel.cMenuElasticNewsId,
                text: languageFormat.getLanguage(20140, 'Elastic News'),
                icon: icoBtnArchive,
                hidden: showV1GUI == "TRUE" ? false : (showNewsHeader == "TRUE" ? (!N2N_CONFIG.elasticNewsUrl) : true)
            }, {
                id: panel.cMenuNikkeiNewsId,
                text: languageFormat.getLanguage(21501, 'Nikkei News'),
                icon: icoBtnArchive,
                hidden: showV1GUI == "TRUE" ? false : (showNewsHeader == "TRUE" ? (!N2N_CONFIG.nikkeiNewsUrl) : true)
            },{
                id: panel.cMenuFundamentalCPIQId,
                text: languageFormat.getLanguage(20124, 'Fundamental (Capital IQ)'),
                icon: icoBtnNews24,
                hidden: showV1GUI == "TRUE" ? true : (showNewsHeader == "TRUE" ? (!N2N_CONFIG.featuresNews_FundamentalCPIQ) : true)
            }, {
                id: panel.cMenuFundamentalThomsonReutersId,
                text: languageFormat.getLanguage(20126, 'Fundamental (Thomson Reuters)'),
                icon: icoBtnNews24,
                hidden: showV1GUI == "TRUE" ? true : (showNewsHeader == "TRUE" ? (!N2N_CONFIG.featuresNews_FundamentalThomsonReuters) : true)
            }, {
                id: panel.cMenuAddStockAlertId,
                text: languageFormat.getLanguage(20603, 'Add Stock Alert'),
                icon: icoBtnAddStkAlert,
                hidden: showV1GUI == "TRUE" ? true : !(showSettingHeader == "TRUE" && N2N_CONFIG.featuresSetting_AddStockAlert)
            }, {
                id: panel.cMenuWarrantsInfoId,
                text: languageFormat.getLanguage(20130, 'Warrants Info'),
                icon: icoBtnStkInfo,
                hidden: showV1GUI == "TRUE" ? true : (showWarrantsInfo == "TRUE" ? false : true)
            }, {
                id: panel.cMenuAddToWL,
                text: languageFormat.getLanguage(30605, 'Add to Watchlist'),
                hidden: showWatchListHeader == 'FALSE' || (global_personalizationTheme.indexOf("wh") != -1 ? false : true),
                popupOnly: true
            },{
                id: panel.cMenuStockAlert,
                text: languageFormat.getLanguage(20602, 'Stock Alert'),
                hidden: settingSMSStockAlertURL.length > 0 ? false : true
            },{
                id: panel.cMenuPSEEdge,
                text: 'PSE Edge',
                hidden: N2N_CONFIG.pseEdgeURL.length > 0 ? false : true
            }
        ];


        panel.contextMenu = new Ext.menu.Menu({
            stkCode: '',
            items: newMenu,
            listeners: addDDMenu()
        });

    },
    /**
     * Description <br/>
     * 
     * 		call at main.js 
     * 		set up right click menu listener
     */
    onContextMenuClick: function (funcs) {
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
                        case panel.cMenuDepthId:
                            btn = panel.contextMenu.getComponent(panel.cMenuDepthId);
                            btn.setHandler(func.func);
                            break;
                        case panel.cMenuStkInfoId:
                            btn = panel.contextMenu.getComponent(panel.cMenuStkInfoId);
                            btn.setHandler(func.func);
                            break;
                        case panel.cMenuChartId:
                            btn = panel.contextMenu.getComponent(panel.cMenuChartId);
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
                        case panel.cMenuHisDataId:
                            btn = panel.contextMenu.getComponent(panel.cMenuHisDataId);
                            btn.setHandler(func.func);
                            break;
                        case panel.cMenuEqTrackerId:
                            btn = panel.contextMenu.getComponent(panel.cMenuEqTrackerId);
                            btn.setHandler(func.func);
                            break;
                        case panel.cMenuStkNewsId:
                            btn = panel.contextMenu.getComponent(panel.cMenuStkNewsId);
                            btn.setHandler(func.func);
                            break;
                        case panel.cMenuArchiveNewsId:
                            btn = panel.contextMenu.getComponent(panel.cMenuArchiveNewsId);
                            btn.setHandler(func.func);
                            break;
                        case panel.cMenuElasticNewsId:
                            btn = panel.contextMenu.getComponent(panel.cMenuElasticNewsId);
                            btn.setHandler(func.func);
                            break;
                        case panel.cMenuNikkeiNewsId:
                            btn = panel.contextMenu.getComponent(panel.cMenuNikkeiNewsId);
                            btn.setHandler(func.func);
                            break; 
                        case panel.cMenuFundamentalCPIQId:
                            btn = panel.contextMenu.getComponent(panel.cMenuFundamentalCPIQId);
                            btn.setHandler(func.func);
                            break;
                        case panel.cMenuFundamentalThomsonReutersId:
                            btn = panel.contextMenu.getComponent(panel.cMenuFundamentalThomsonReutersId);
                            btn.setHandler(func.func);
                            break;
                        case panel.cMenuAddStockAlertId:
                            btn = panel.contextMenu.getComponent(panel.cMenuAddStockAlertId);
                            btn.setHandler(func.func);
                            break;
                        case panel.cMenuOrderStatus:
                            btn = panel.contextMenu.getComponent(panel.cMenuOrderStatus);
                            btn.setHandler(func.func);
                            break;
                        case panel.cMenuWarrantsInfoId:
                            btn = panel.contextMenu.getComponent(panel.cMenuWarrantsInfoId);
                            btn.setHandler(func.func);
                            break;
                        case panel.cMenuAddToWL:
                            btn = panel.contextMenu.getComponent(panel.cMenuAddToWL);
                            btn.setHandler(func.func);
                            break;
                        case panel.cMenuStockAlert:
                            btn = panel.contextMenu.getComponent(panel.cMenuStockAlert);
                            btn.setHandler(func.func);
                            break;
                        case panel.cMenuPSEEdge:
                        	btn = panel.contextMenu.getComponent(panel.cMenuPSEEdge);
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
     * 		block right click menu item 
     */
    disableRightFunction: function () {	// applicable for outbound some exchange does not have data
        var panel = this;
        if (panel.contextMenu) {
            var intradayChartBtn = panel.contextMenu.getComponent(panel.cMenuChartId);
            var trackerBtn = panel.contextMenu.getComponent(panel.cMenuStkTrackerId);

            var menuList = new Array();
            menuList.push(intradayChartBtn.text);

            var newItemList = determineItem(menuList, exchangecode); // verify from main.js

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
        }
    },
    /**
     * Description <br/>
     * 
     * 		right click on grid panel row function
     * 
     * @param grid 	: Ext.grid.GridPanel
     * @param ridx 	: integer
     * @param e 	: Ext.EventObject
     */
    showContextMenu: function (grid, record, ridx, e) {
        var panel = this;

        e.stopEvent();

        grid.getSelectionModel().select(ridx);

        if (panel.contextMenu == null) {
            panel.createContextMenu();
        }

        var stkCode = record.get(fieldStkCode);
        var stkName = record.get(fieldStkName);
        panel.cMenuStkCode = stkCode;
        panel.cMenuStkName = stkName;

        panel.contextMenu.showAt(e.getXY());
    },
    /**
     * set paging text field value
     * 
     * @param page : int
     */
    setPageNo: function (page) {
        var panel = this;
        // panel.suspendLayouts();

        var msg = panel.tFieldPage;

        if (msg != null) {
            var pagingNumber = 0;
            if (page == null) {
                pagingNumber = 1;
            } else {
                pagingNumber = page + 1;
            }
            msg.setText(pagingNumber);
            // msg.setValue(pagingNumber);
        }

        panel.page = page;
        // panel.resumeLayouts();
    },
    firstPage: function () {
        var panel = this;

        panel.setPageNo(0);

        if (panel.onSearchStatus) {
            panel.search(null);
        } else {
            panel.callSort();
        }
    },
    /**
     * Description <br/>
     * 
     * 		paging next button function 
     * 
     * @param value : string
     */
    nextPage: function () {
        var panel = this;


        /*
         * set paging number
         * this paging number not display in the text field, it is set passing paging number to server
         */
        panel.setPageNo(panel.page + 1);

        // call latest feed record/ recall feed record
        if (panel.onSearchStatus) {
            panel.search(null);
        } else {
            panel.callSort();
        }
    },
    /**
     * Description <br/>
     * 
     * 		paging previous button function 
     * 
     * @param value : string
     */
    previousPage: function () {
        var panel = this;


        if (panel.page == 0) {
            return;
        }

        /*
         * set paging number
         * this paging number not display in the text field, it is set passing paging number to server
         */
        panel.setPageNo(panel.page - 1);

        // call latest feed record/ recall feed record
        if (panel.onSearchStatus) {
            panel.search(null);
        } else {
            panel.callSort();
        }
    },
    nextWarrantPage: function () {
        var panel = this;

        /*
         * set paging number
         * this paging number not display in the text field, it is set passing paging number to server
         */
        panel.setPageNo(panel.page + 1);

        // call warrant search\
        panel.warrantSearchParams.page = panel.page + 1;
        panel.callWarrantUrl(panel.warrantSearchParams);
    },
    previousWarrantPage: function () {
        var panel = this;

        if (panel.page == 0) {
            return;
        }

        /*
         * set paging number
         * this paging number not display in the text field, it is set passing paging number to server
         */
        panel.setPageNo(panel.page - 1);
        // call warrant search
        panel.warrantSearchParams.page = panel.page + 1;
        panel.callWarrantUrl(panel.warrantSearchParams);
    },
    blockPrevNextButton: function () {
        var panel = this;

        var thisStore = panel.getStore();

        var buttonPreviouse = panel.tButtonPrevPage;
        var buttonNext = panel.tButtonNextPage;
        var buttonFirst = panel.tButtonFirstPage;
        if (panel.isBlockButton) {

            buttonPreviouse.setDisabled(true);
            buttonNext.setDisabled(true);

        } else {
//			  if (panel.tFieldPage.getValue() == 1) {
            if (panel.tFieldPage.text == 1) {
                if (thisStore.getCount() < panel.count) {
                    buttonPreviouse.setDisabled(true);
                    buttonNext.setDisabled(true);
                } else {
                    buttonPreviouse.setDisabled(true);
                    buttonNext.setDisabled(false);
                }
                buttonFirst.setDisabled(true);
            } else {
                if (thisStore.getCount() < panel.count) {
                    buttonPreviouse.setDisabled(false);
                    buttonNext.setDisabled(true);
                } else {
                    buttonPreviouse.setDisabled(false);
                    buttonNext.setDisabled(false);
                }
                buttonFirst.setDisabled(false);
            }
        }
    },
    returnNumberFormat: function (value, columnWidth) {
        if (value == null) {
            return "";
        }

        if (viewInLotMode) {
            value = formatutils.formatNumberLot(value);
        } else {
            value = formatutils.formatNumber(value, columnWidth);
        }

        return value;
    },
    /**
     * Description <br/>
     * 
     * 		verify the stock can be trade or not
     */
    isBuyInStk: function (stkcode) {
        var isBuyIn = false;
        if (stkcode) {
            if (stkcode.indexOf(':B') != -1 || stkcode.indexOf(':I') != -1) {
                isBuyIn = true;
            }
        }
        return isBuyIn;
    },
    getExchangeType: function (stockcode) {	// use on outbound only to show R=RealTime / D=Delay
        if (stockcode != undefined && stockcode != null) {//} && outbound==true){
            var tmpV = stockcode.split(".");
            var tmpType = tmpV[tmpV.length - 1];
            if (tmpType.length == 1) {	// delay feed will more then 1 char
                return tmpType;
            } else {
                var tmpChkType = tmpType.substring(tmpType.length, tmpType.length - 1);
                var tmpChkTypeValue = tmpType.substring(0, tmpType.length - 1);
                if (tmpChkType.toUpperCase() == "D") {
                    return tmpChkTypeValue;
                } else {
                    return tmpType;
                }
            }
        } else {
            return '';
        }

    },
    /**
     * Description <br/>
     * 
     * 		update / set grid panel "R/D" column tool tip		
     * 
     * @param tip : string
     */
    updateRDToolTip: function (tip) {
        var panel = this;

        var tipMsg = "";

        if (tip != null) {
            panel.tooltipMsg = tip;
            tipMsg = tip;
        } else {
            if (panel.tooltipMsg != null) {
                tipMsg = panel.tooltipMsg;
            }
        }

        try {
            var idx = -1;
            var columns = helper.getGridColumns(panel);
            for (var i = 0; i < columns.length; i++) {
                var id = columns[i].id;
                if (id == cmap_mmRD) {
                    idx = i;
                    break;
                }
            }

            if (idx != -1) {
                // TODO work later
                // panel.getColumnModel().setColumnTooltip(idx, '<B><U>MARKET DATA DISPLAY SERVICE</U></B><BR>' + tipMsg);
                // panel.getView().updateHeaders();
            }
        } catch (e) {

        }
    },
    /**
     * Description <br/>
     * 
     * 		set this object title
     * 
     * @param str 	: string
     * @param str2 	: string
     */
    setTitleInfo: function (str, str2) {
        var title = this.oriTitle + ' ';
        if (str != null) {
            title += ' [' + str + ']';
        }
        if (str2 != null) {
            title += ' [' + str2 + ']';
        }

        this.setTitle(title);
    },
    /**
     * Description <br/>
     * 
     * 		return all column id
     * 
     * @return string
     */
    allColumnSetting: function () {

        var allColumnId = global_FeedAllColumn;
        // filter column id
        return colutils.filterColumnId(allColumnId);
    },
    /**
     * Description <br/>
     * 
     * 		return default column id
     * 
     * @return string
     */
    defaultColumnSetting: function () {
        var defaultColumnId = global_FeedDefaultColumn;
        // filter column id
        return colutils.filterColumnId(defaultColumnId);
    },
    /**
     * Description <br/>
     * 
     * 		return current column setting id
     * 
     * @return string
     */
    currentColumnSetting: function () {

        var currentColumnId = marketMoverCol; // verify from main.jsp

        // verify is new setting or old setting 
        var temp = currentColumnId.split("~");
        var indexNumber = temp.indexOf(colutils.ColumnVersion);
        var adderIndexNumber = temp.indexOf('adder');
        if (indexNumber != -1) {
        	temp.splice(indexNumber, 1);

        	if(adderIndexNumber != -1){
        		temp.splice(adderIndexNumber, 1);
        	}

        	currentColumnId = temp.join('~');
        } else {
            currentColumnId = "";
        }

        // filter column id
        return colutils.filterColumnId(currentColumnId);
    },
    requiredColumnSetting: function () {

        return marketMoverReqCol;
    },
    /**
     * Description <br/>
     * 
     * 		open new window for display column setting 
     * 
     */
    openColumnSetting: function () {
        var panel = this;

        colutils.displayWindow(panel);
        panel.procColumnWidth(exchangecode);
    },
    /**
     * Description <br/>
     * 
     * 		save column setting
     * 
     * @param newColumnId : string
     */
    saveColumn: function (newColumnId) {
        var panel = this;
        panel.reconfigure(null, panel.generateColumnsArray(panel.generateColumn(newColumnId)));

        panel.requestSaveColumns(newColumnId);

        Blinking.resetBlink(panel);
        panel.updateRDToolTip();
    },
    requestSaveColumns: function(newColumnId) {
        var panel = this;

        // update field id - call to server what column is display
        panel.changeField(panel.getFieldList());
        newColumnId = newColumnId + "~" + colutils.ColumnVersion;
        marketMoverCol = newColumnId;  // marketMoverCol is from main.js
        colutils.saveColumn(mmColSetting, newColumnId);
    },
    procColumnWidth: function (exchangeCode) {
        var panel = this;

        panel._setCookieId();
        // to make sure it does not use previous setting of other exchange
        panel.tempWidthArray = null;
        panel.tempStorage = null;
        
        panel.columnHash = new N2NHashtable();
        var columnID;
        var columnWidth;

        if (cookies.isCookiesExist(panel.qckId)) {
            var temp = cookies.getCookies(panel.qckId);
            columnID = temp[0];
            columnWidth = temp[1];
        }
        else {
            columnID = global_feedColumnID;

            switch (stockutil.removeDelayChar(exchangeCode)) {
                case 'KL':
                    columnWidth = global_feedWidthKL;
                    break;
                case 'MY':
                    columnWidth = global_feedWidthMY;
                    break;
                case 'HK':
                    columnWidth = global_feedWidthHK;
                    break;
                case 'SG':
                case 'SI':
                    columnWidth = global_feedWidthSI;
                    break;
                default:
                    columnWidth = global_feedWidthOth;
                    break;
            }

            var tempInfo = [columnID, columnWidth];
            var tempCookie = tempInfo.join(',');
            cookies.setTempStorage(panel, tempCookie); //v1.3.33.27
        }


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
    // shu wen 14/06/2013
    refreshRecordTime: function () {
        var panel = this;

        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1; //January starts from 0
        var year = date.getFullYear();

        if (month < 10) {
            month = '0' + month;
        }

        var currentDate = (year + "/" + month + "/" + day);
        var currentDateISO = (year + "-" + month + "-" + day);

        console.log('[feed][refreshRecordTime] refresh time ---> ' + global_QSMarketRefreshTime);

        panel.marketRefreshTime = {};

        if (global_QSMarketRefreshTime.length != 0) {
            var exchangeList = global_QSMarketRefreshTime.split(';');

            for (var i = 0; i < exchangeList.length; i++) {
                if (exchangeList[ i ].length != 0) {
                    var tempList = exchangeList[ i ].split('|');
                    var tempListTimer = tempList[1].split('-');

                    panel.marketRefreshTime[ tempList[0] ] = {};
                }
            }
        }

        panel.loopTime = setInterval(function () {
            if (streaming && !n2nLayoutManager.isActivation(panel)) { // avoid refresh when not in view
                return;
            }

            var localRefresh = 60;
            var serverRefresh = 300;

            if (global_QSMarketRefreshTime.length != 0) {
                if (panel.marketRefreshTime[ exchangecode ] != null) {
                    if (topPanelBarPanel != null) {
                        var currentTime = topPanelBarPanel.getTime();
                        var tempDateTime = currentDateISO + 'T' + currentTime; // (YYYY-mm-ddTHH:mm:ss) currently ECMAScript 5 ISO-8601 format support used by latest web browsers.
                        var tempDateTimeFallBack = currentDate + ' ' + currentTime; // fallback to this date format as IE8/Safari5 is not able to support the new format.
                        var startTime;
                        var endTime;

                        if (isNaN(Date.parse(tempDateTime))) {
                            startTime = currentDate + ' ' + tempListTimer[0];
                            endTime = currentDate + ' ' + tempListTimer[1];
                            if (Date.parse(tempDateTimeFallBack) >= Date.parse(startTime) && Date.parse(tempDateTimeFallBack) <= Date.parse(endTime)) {
                                localRefresh = 15;
                                serverRefresh = 60;
                            }
                        } else {
                            startTime = currentDateISO + 'T' + tempListTimer[0];
                            endTime = currentDateISO + 'T' + tempListTimer[1];
                            if (Date.parse(tempDateTime) >= Date.parse(startTime) && Date.parse(tempDateTime) <= Date.parse(endTime)) {
                                localRefresh = 15;
                                serverRefresh = 60;
                            }
                        }

                        /*
                         if (Date.parse(currentDate + ' ' + currentTime) >= Date.parse(currentDate + ' ' + tempListTimer[ 0 ]) && Date.parse(currentDate + ' ' + currentTime) <= Date.parse(currentDate + ' ' + tempListTimer[ 1 ])) {
                         localRefresh = 15;
                         serverRefresh = 60;
                         }*/
                    }
                }
            }

            panel.currentTime = parseInt(panel.currentTime) + 1;
            panel.sortingTime = parseInt(panel.sortingTime) + 1;

            if (panel.currentTime == serverRefresh) {
                if (exchangecode != "HKD") {
                    console.log('[feed][refreshRecordTime] refresh server *** ');

                    if (panel.onWarrantSearchMode == false) {
                        if (panel.onSearchStatus == false) {
                            if (panel.store.getCount() != 0) {
                                panel.callSort(true);
                            }
                        }
                    }
                }
                panel.currentTime = 0;
            }

            if (panel.sortingTime == localRefresh) {
                console.log('[feed][refreshRecordTime] refresh local grid *** ');

                if (panel.onWarrantSearchMode == false) {
                    if (panel.onSearchStatus == false) {
                        if (panel.getStore().getCount() > 0) {
                            panel.getStore().sort();
                            Blinking.resetBlink(panel);
                        }
                    }
                }
                panel.sortingTime = 0;
            }

        }, 1000); // looping 1000 = 1 second

    },
    stopAutoRefresh: function () {
        if (this.loopTime) {
            clearInterval(this.loopTime);
        }
    },
    /**
     * Description <br/>
     * 
     * 		return Ext.Record component
     * 
     * @param 	{object}  		dataObj
     * @return 	{Ext.Record}
     */
    _returnRecord: function (dataObj) {
        var panel = this;

        var newRecord = Ext.create('TCPlus.model.StockRecord');
        newRecord.id = dataObj[fieldStkCode];

        var stValue = dataObj[fieldStatus] || '';
        dataObj[fieldNews] = stValue.charAt(5) + stValue.charAt(4);
        dataObj[fieldStkStatus] = stValue.charAt(1);
        dataObj[fieldRSSIndicator] = stValue.charAt(0);
        dataObj[fieldRD] = panel.exchangeFeedType;
        dataObj[fieldExchangeCode] = panel.getExchangeType(dataObj[fieldStkCode]);

        var cfdValue = dataObj[fieldCFDMapValue_06] || '';
        cfdValue = cfdValue.toString(2);
        dataObj[fieldCFDTradable_06] = cfdValue.charAt(0);
        dataObj[fieldCFDShortSell_06] = cfdValue.charAt(1);
        
        if (global_margin != null) {

            if (global_margin.len != null && global_margin.scpt != null) {

                for (var ma = 0; ma < global_margin.len; ma++) { // verify from main.jsp
                    var V = global_margin.scpt[ma];

                    if (V.key == dataObj[fieldStkCode]) {
                        var marginV = V.value.split(',');

                        dataObj['margin'] = marginV[0];
                        dataObj['marginPrc'] = marginV[1];
                        dataObj['marginPc'] = marginV[2];
                    }
                }
            }
        }


        var timeValue = dataObj[fieldTime];
        var timeval = 0;
        if (timeValue != null) {
            if (timeValue.length > 6) {
                timeValue = timeValue.substring(1, timeValue.length);
            }

            var timevalue = formatutils.getDateInstance(timeValue);
            timeval = timevalue.getTime();
        }

        dataObj[fieldTime] = timeValue;

        dataObj[fieldChange] = 0;
        dataObj[fieldChangePer] = 0;

        newRecord.data = dataObj;

        return newRecord;
    },
    _returnAjaxId: function () {
        var panel = this;
        return 'QuoteScreen_' + panel.id;
    },
    _setDisplayRecord: function () {
        var panel = this;

        var recordHeight = 19;
        var borderHeight = 25;
        if (isMobile) {
            recordHeight = 25;
        }
        
        var panelHeight = panel.body.getHeight(true) - borderHeight;
        // deduct some more height if the grid presents horizontal scroll
        if (!touchMode && panel.normalGrid && panel.normalGrid.getView().getEl().isScrollable()) {
            panelHeight -= 20;
        }
        var totalRecord = Math.floor(panelHeight / recordHeight);

        if (global_QSSizeFollowSetting.toLowerCase() == "false") {
            if (totalRecord < parseInt(global_quoteScreenSize)) {
                totalRecord = global_quoteScreenSize;
            }
        }

        panel.count = totalRecord;
        panel.warrantSearchRows = totalRecord;
    },
    callWarrantUrl: function (warrantSearchParams) {
        var panel = this;

        Ext.Ajax.request({
            url: 'warrant.jsp',
            params: warrantSearchParams,
            success: function (response) {
                var data = null;

                try {
                    data = response.responseText.trim();

                    if (data != '-1') {
                        var stkcodes = data.split(',');
                        panel.warrantSearchParams = warrantSearchParams;
                        panel.onWarrantSearchMode = true;
                        tempPage = warrantSearchParams.page;
                        panel.sortWarrants(stkcodes);
                    } else {
                        Ext.Msg.show({
                            title: global_popUpMsgTitle,
                            msg: languageFormat.getLanguage(30012, 'No search result found. Please try again.'),
                            buttons: Ext.Msg.OK,
                            icon: Ext.MessageBox.INFO
                        });
                        panel.setPageNo(tempPage - 1); // do not set page back to zero if search results return empty
                        console.log('callWarrantUrl search data not found.');
                    }

                    // Scrolls to main panel
                    // This code does not work: Ext.get('mainPanel').scrollIntoView();
                    // So native js function is used here
                    document.getElementById('mainPanel').scrollIntoView();
                } catch (e) {
                    console.log('callWarrantUrl exception ' + e);
                }
            },
            failure: function (response) {
                console.log('callWarrantUrl error');
            }
        });
    },
    sortWarrants: function (stkcodes) {
        var panel = this;

        // display loading panel
        panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));

        console.log("[feed][callWarrantSort] start *** ");

        if (dwr.engine._scriptSessionId == null) {
            return;
        }

        var sessionID = dwr.engine._scriptSessionId;
        var urlbuf = new Array();

        /*
         * set the return feed record column
         */
        var fields = panel.getFieldList("all").join(',');

        panel.tAjax_ID = panel._returnAjaxId();

        /*
         * create url
         */
        // set url
        urlbuf.push(addPath + 'tcplus/sorthttp?');
        urlbuf.push('ExtComp=');
        urlbuf.push(panel.tAjax_ID);
        urlbuf.push('&s=');
        urlbuf.push(sessionID);
        urlbuf.push('&ex=');						// exchange code
        urlbuf.push(panel.exchangecode);
        urlbuf.push('&e=');
        urlbuf.push(panel.sort);
        urlbuf.push('&r=' + panel.sectorcode);
        urlbuf.push('&sp=' + sponsorID);
        urlbuf.push('&f=');							// field id
        urlbuf.push(fields);
        urlbuf.push('&p=');							// paging
        urlbuf.push(panel.page);
        urlbuf.push('&c=');							// total number of record
        urlbuf.push(stkcodes.length);
        urlbuf.push('&l=');							// stock list
        urlbuf.push(stkcodes.join(','));

        var url = urlbuf.join('');

        if (panel.store.getCount() != 0) {
            Blinking.clearBlink(panel);
            panel.store.removeAll();
        }

        /*
         * start to call server / process
         */
        Ext.Ajax.request({
            url: url,
            timeout: 90000,
            method: 'POST',
            success: function (response) {

                var obj = null;
                try {
                    obj = Ext.decode(response.responseText);

                    if (!obj.s) {

                        var errorMessage = "";
                        if (obj.e != null && obj.m != null) {
                            errorMessage = obj.e + " - " + obj.m;

                        } else if (obj.c == 0) {
                            errorMessage = panel.emptyText;

                        }

                        if (errorMessage == "") {
                            errorMessage = panel.emptyText;
                        }

                        msgutil.alert(languageFormat.getLanguage(30007, 'We regret to inform that we are unable to process your request at this time. Kindly try again shortly. [9808]'), null);
                        panel.stkcodes = [];
                        panel.stkList = [];

                    } else if (obj.s) {
                        panel.updateSortHttp(obj);

                    } else {
                        msgutil.alert(languageFormat.getLanguage(30007, 'We regret to inform that we are unable to process your request at this time. Kindly try again shortly. [9808]'), null);
                        panel.stkcodes = [];
                        panel.stkList = [];

                    }

                } catch (e) {
                    msgutil.alert(languageFormat.getLanguage(30007, 'We regret to inform that we are unable to process your request at this time. Kindly try again shortly. [9808]'), null);
                    panel.stkcodes = [];
                    panel.stkList = [];

                }

                panel.setLoading(false);

            }, failure: function (response) {
                panel.setLoading(false);

                msgutil.alert(languageFormat.getLanguage(30007, 'We regret to inform that we are unable to process your request at this time. Kindly try again shortly. [9808]'), null);

                panel.stkcodes = [];
                panel.stkList = [];
            }
        });
    },
    _getAdderColumn: function() {
        var width = 40;
        if(global_personalizationTheme.indexOf("wh")!= -1){
            width = 20;
        }
        return {
            xtype: 'actioncolumn',
            width: width,
            align: 'center',
            sortable: false,
            dataIndex: 0, // this is needed, otherwise there will be an error
            menuDisabled: true,
            draggable: false,
            itemId: 'adder',
            tdCls: 'adderRmCls',
            locked: true,
            hidden: N2N_CONFIG.useEditButton,
            items: [
                {
                    iconCls: 'add-wl',
                    tooltip: languageFormat.getLanguage(30605, 'Add to Watchlist'),
                    handler: function (view, rowIndex, colIndex, item, e, record) {
                        var stkcode = record.get(fieldStkCode);
                        addToWatchlist(stkcode);
                    }
                }
            ]
        };
    },
    resetSearchTypes: function () {
        var me = this;

        me.tCombo_SearchType.getStore().loadData([
            ['this', stockutil.getExchangeName(exchangecode)],
            ['cross', languageFormat.getLanguage(20654, 'All Exchanges')],
            ['allBoard', languageFormat.getLanguage(20655, 'All Boards')]
        ]);
        me.tCombo_SearchType.setValue('this');
    },
    _getSortBtnLabel: function (str) {
        if (isMobile) {
            var parts = str.split('Sort by ');
            if (parts.length > 1) {
                return parts[1];
            }
        }

        return str;
    },
    _selectFirstRow: function () {
        var panel = this;

        // panel.resumeLayouts(true);
        if (!panel._onVerify) {
            activateRow(panel);
        }

        if (panel.isFirstTime) {
            panel.isFirstTime = false;
        }
        
        n2ncomponents.activateEmptyScreens();
        panel.setLoading(false);

        panel.tAjax_Object = null;
        if (N2N_CONFIG.lDebug && t3) {
            console.log('display quote in ', (new Date().getTime() - t3) / 1000, 's');
        }
    },
    _setCookieId: function () {
        var me = this;
        me.qckId = cookieKey + '_Quote_' + exchangecode;
    },
    getMappedName: function (stkCode) {
        var me = this;

        for (var i = 0; i < me.stkList.length; i++) {
            var stkObj = me.stkList[i];
            if (stkObj.code == stkCode) {
                return stkObj.name;
            }
        }

        return '';
    },
    autoAdjustWidth: function() {
        var panel = this;
        
        panel.procColumnWidth(exchangecode);
        panel.reconfigure(null, panel.generateColumnsArray(panel.generateColumn("")));
        panel.tempWidth = cookies.toDefaultColumn(panel.qckId);
        panel.isImgBlink = false;
        panel.runAutoAdjustWidth = false;
    },
    setFilterInfo: function(market, secList, sector) {
        var panel = this;
        
        panel.market = market;
        panel.secList = secList;
        panel.sector = sector;
    },
    updateColWidthCache: function(column, newWidth) {
        helper.updateColWidthCache(this, this.qckId, column, newWidth);
    }
});
