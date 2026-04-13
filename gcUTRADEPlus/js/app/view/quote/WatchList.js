/*
 * this : Ext.grid.Panel
 * 
 * 
 * 
 * initComponent			: initial this object function / design this panel 
 * 
 * 
 * 
 * search 				: filter grid panel record
 * 
 * resetList				: call ajax to get watch list stock name and stock code
 * callSort				
 * updateSortHttp			
 * updateFeed				
 * updateFeedRecord			 
 * 
 * getFeedType 				: verify feed is "Delay" or "RealTime" , only for out bound
 * getExchangeType			: verify exchange is "Delay" or "RealTime" , only for out bound
 * 
 * generateColumnsArray                 : generate grid panel column header
 * generateColumn			: generate unhide column setting
 * 
 * resetFeedSetting			: reset all setting and reset to default
 * 
 * generateColumnID			: generate column ID to save user setting
 * changeField				: update watch list grid panel column / call ajax to return field record
 * getFieldList				: return grid panel on show field id
 * 
 * createContextMenu                    : create right click menu
 * onContextMenuClick                   : this function is at main.js call - set up right click menu listener
 * disableRightFunction                 : block right click items button
 * showContextMenu			: show right click menu
 * 
 * calculateTextWidth                   : calculate string width
 * 
 * returnNumberFormat                   : return number format 
 * 
 * onRowDblClick			: this function is at main.js call
 * 
 * isBuyInStk				: verify the stock can be trade or not
 * 
 * updateRDToolTip				: update "R/D" column tool tip
 * 
 * setTitleInfo				: set grid panel title
 * 
 * updateExchangeCb			: update exchange code combo box item
 * 
 * allColumnSetting			: return all column id
 * defaultColumnSetting                 : return default column id
 * currentColumnSetting                 : return current column id
 * 
 * openColumnSetting                    : return array list by available or exist
 * saveColumn				: save new column setting
 * 
 */

Ext.define('TCPlus.view.quote.WatchList', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.grid.column.Action'
    ],
    alias: 'widget.watchlist',
    oriTitle: languageFormat.getLanguage(20001, 'Watchlist'),
    exchangecode: '',
    sectorcode: 10,
    type: 'wl',
    savingComp: true,
    sort: 'vol',
    count: 15,
    page: 0,
    limit: 30,
    fulllist: [], // store this watch list content stock code 
    columnmap: null,
    reader: null,
    stkcodes: [],
    getFeedTask: null,
    blinkinterval: 3000,
    blinkTasks: null,
    blinkIntensities: null,
    columnState: 0,
    tempDatas: [],
    wlname: null, // store this watch list name
    tbBtnColumnId: null,
    feedExchangeList: new Array(),
    filterExtOpt: '0',
    contextMenu: null, // display context menu panel
    cMenuStkCode: null, // context menu - stkcode
    cMenuStkName: null, // context menu - stkName
    cbExchange: null, // create combo box for exchange code 
    tfSearch: null, // searching text box
    //v1.3.33.27 Save columns setting
    tooltip: null,
    columnHash: null,
    tempWidth: null,
    isImgBlink: false,
    screenType: 'main',
    slcomp: "wl",
    key: null,
    /**
     * Description <br/>
     * 		when this object create will call this function
     */
    initComponent: function () {
        /*
         * before call any ajax, this object already set the "fulllist" 
         * because it set at main.js 
         */

        var panel = this;
        panel.compRef = {};
        
        // disable dd drop if it is recent quote
        panel.ddComp = !panel.recentQuote;

        panel.procColumnWidth(); //v1.3.33.27

        var xtype = 'button';

        panel._procComponentId();

        // create searching text field
        panel.tfSearch = new Ext.form.field.Text({
            width: searchboxWidth,
            selectOnFocus: true,
            autoCreate: {tag: 'input', type: 'text', size: '30', autocomplete: 'off'},
            emptyText: languageFormat.getLanguage(10102, 'Symbol') + '/' + languageFormat.getLanguage(10101, 'Code'),
            listeners: {
                specialkey: function (field, e) {
                    // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                    // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
                    if (e.getKey() == e.ENTER) {
                        panel.search(panel.tfSearch.getValue());
                        panel.tfSearch.focus();
                    }
                }
            }
        });

        // combo box store / items
        var filterOptExList = [['0', languageFormat.getLanguage(20654, 'All Exchanges')]];
        for (var ii = 0; ii < global_ExchangeList.length; ii++) {
            filterOptExList.push([global_ExchangeList[ ii ].exchange, global_ExchangeList[ ii ].exchangeName]);
        }

        var filterOptStore = new Ext.data.ArrayStore({
            fields: ['id', 'name'],
            data: filterOptExList
        });

        // create exchange combo box 
        panel.cbExchange = new Ext.form.field.ComboBox({
            editable: false,
            width: UI.exchWidth,
            matchFieldWidth: UI.matchFieldWidth,
            listConfig: {
                minWidth: UI.exchWidth
            },
            mode: 'local',
            store: filterOptStore,
            displayField: 'name',
            valueField: 'id',
            triggerAction: 'all',
            value: Ext.isEmpty(panel.filterExtOpt) ? '0' : panel.filterExtOpt,
            listeners: {
                select: function (thisCombo, records, eOpts) {
                    panel.filterExtOpt = thisCombo.getValue();
                    panel.tfSearch.setValue("");
                    panel.search();
                }
            }
        });
        
        if (panel.recentQuote) {
            panel.compRef.saveBtn = Ext.create('Ext.button.Button', {
                text: languageFormat.getLanguage(20019, 'Save as a watchlist'),
                tooltip: languageFormat.getLanguage(20019, 'Save as a watchlist'),
                iconCls: 'icon-saveaswl',
                handler: function() {
                    if (panel.fulllist.length === 0) {
                        return;
                    }
                    
                    msgutil.prompt(languageFormat.getLanguage(30118, 'Please enter watchlist name') + ':', function(wlName) {
                        wlName = wlName.trim();

                        if (jsutil.isEmpty(wlName)) {
                            msgutil.alert(languageFormat.getLanguage(30106, 'The watchlist name should not be left blank. Kindly enter the name and try again.'), function() {
                                createWatchlist();
                            });
                        } else if (wlName.length > 20) { // more than 20 characters
                            msgutil.alert(languageFormat.getLanguage(30104, 'Please ensure that the name entered does not exceed 20 characters.'), function() {
                                createWatchlist();
                            });
                        } else if (containsWatchListFunnyChar(wlName)) {
                            msgutil.alert(languageFormat.getLanguage(30105, 'Please use only letters (a-z or A-Z), numbers (0-9) and symbols (space-_) in this field.'), function() {
                                createWatchlist();
                            });
                        } else if (watchlistExist(wlName)) {
                            msgutil.alert(languageFormat.getLanguage(30133, 'Wathclist \'[PARAM0]\' exists. Kindly give another name.', textToHtml(wlName)), function() {
                                createWatchlist();
                            });
                        } else { // import watchlist
                            var wlObj = {};
                            wlObj[wlName] = panel.fulllist.join(',');

                            requestImportWl(wlObj, function(op, success, response) {
                                var res;
                                if (response.responseText) {
                                    try {
                                        res = Ext.decode(response.responseText);
                                    } catch (e) {

                                    }
                                }

                                if (success && res && res.s) {
                                    msgutil.info(languageFormat.getLanguage(30110, 'New watchlist \'[PARAM0]\' had been successfully created.', textToHtml(wlName)));
                                    n2ncomponents.refreshWlGrid(res.l);
                                } else {
                                    var errMsg = languageFormat.getLanguage(30135, 'Failed to create a watchlist from recent quote.');
                                    if (res && res.m) {
                                        errMsg = res.m;
                                    }

                                    msgutil.alert(errMsg);
                                }
                            });
                        }
                        
                    });
                }
            });
            
            panel.compRef.clearBtn = Ext.create('Ext.button.Button', {
                text: languageFormat.getLanguage(20007, 'Clear'),
                iconCls: 'icon-clear',
                tooltip: languageFormat.getLanguage(20009, 'Clear recent quote'),
                handler: function() {
                    panel.clearRecentQuote();
                }
            });
        }
        
        panel.compRef.resetBtn = Ext.create('Ext.button.Button', {
            text: languageFormat.getLanguage(10003, 'Reset'),
            tooltip: languageFormat.getLanguage(10003, 'Reset'),
            xtype: xtype,
            icon: icoBtnReset,
            handler: function () {
                Blinking.clearBlink(panel);
                panel.tfSearch.setValue('');
                panel.cbExchange.setValue('0');
                panel.filterExtOpt = 0;
                // panel.search();
                panel.reconfigure(null, panel.generateColumnsArray(panel.generateColumn("")));
                panel.resetList();
            }
        });
        panel.compRef.columnBtn = Ext.create('Ext.button.Button', {
            xtype: xtype,
            text: languageFormat.getLanguage(10005, 'Columns'),
            icon: icoBtnColumn,
            hidden: global_showColSettingHeader == "TRUE" ? false : true,
            handler: function () {
                panel.openColumnSetting();
            }
        });
        var showbtnEditDone = !N2N_CONFIG.useEditButton;
        /*
        if (global_personalizationTheme.indexOf("wh") != -1) {
            if (!isMobile && !isTablet) {
                showbtnEditDone = true;
            }
        }
        */
        panel.compRef.btnEditDone = Ext.create('Ext.button.Button', {
            text: languageFormat.getLanguage(10021, 'Edit'),
            icon: ICON.EDIT,
            enableToggle: true,
            hidden: showbtnEditDone,
            toggleHandler: function(thisBtn, pressed) {
                var deleterCol = helper.getColumn(helper.getGridColumns(panel, 'lock'), 'itemId', 'deleter');
                if (pressed) {
                    thisBtn.setText(languageFormat.getLanguage(10023, 'Done'));
                    thisBtn.setIcon(ICON.DONE);
                    deleterCol.col.setVisible(true);
                } else {
                    thisBtn.setText(languageFormat.getLanguage(10021, 'Edit'));
                    thisBtn.setIcon(ICON.EDIT);
                    deleterCol.col.setVisible(false);
                }
            }
        });
        panel.compRef.selectedLabel = Ext.create('Ext.form.Label', {
            flex: 1,
            cls: 'selectedlabel',
            style: 'font-size:0.85em !important;'
        });
        
        var tbarItems = [
            panel.tfSearch,
            {
                text: languageFormat.getLanguage(10028, 'Filter'),
                xtype: xtype,
                icon: icoBtnSearch,
                handler: function() {
                    panel.search(panel.tfSearch.getValue());
                }
            },
            panel.cbExchange,
            panel.compRef.saveBtn,
            '->',
                {
                    id: 'saveSetting_WL' + panel.id, //v1.3.33.27
                    icon: iconBtnSaveSetting,
                    xtype: xtype,
                    hidden: true,
                    style: "margin-right:10px;",
                    handler: function() {
                        msgutil.confirm(languageFormat.getLanguage(30008, 'You have unsave settings. Would you like to save your settings?'),
                                function(sResp) {
                                    if (sResp == "yes") {
                                        panel.isImgBlink = false;
                                        cookies.procCookie(panel.wckId, panel.tempWidth, cookieExpiryDays);
                                        panel.tempWidth = cookies.toDefaultColumn(panel, panel.wckId);
                                    } else {
                                        panel.isImgBlink = false;
                                    }
                                }
                        );
                    }
                }
        ];
        
        var bbarItems = [];
        
        if (isMobile) {
            tbarItems.push(panel.compRef.columnBtn);
            bbarItems.push(
                    panel.compRef.btnEditDone,
                    // panel.compRef.clearBtn,
                    panel.compRef.selectedLabel,
                    panel.compRef.resetBtn);
        } else {
            tbarItems.push(
                    panel.compRef.btnEditDone,
                    panel.compRef.clearBtn,
                    createAutoWidthButton(panel),
                    panel.compRef.columnBtn,
                    panel.compRef.resetBtn);
        }

        panel.compRef.tbar = Ext.create('Ext.toolbar.Toolbar', {
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll,
            items: tbarItems
        });
        panel.compRef.bbar = Ext.create('Ext.toolbar.Toolbar', {
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll,
            hidden: !isMobile,
            items: bbarItems
        });
        
        var store = Ext.create('Ext.data.Store', {
            model: 'TCPlus.model.WatchListRecord'
        });

        var defaultConfig = {
            store: store,
            columns: {
                items: panel.generateColumnsArray(panel.generateColumn("")),
                defaults: {
                    lockable: false
                }
            },
            selModel: {
                preventFocus: true
            },
            animCollapse: false,
            bodyStyle: 'padding:0px; margin:0px; font-size: 12pt;',
            columnLines: false,
            enableColumnMove: N2N_CONFIG.gridColMove,
            enableColumnHide: N2N_CONFIG.gridColHide,
            header: false,
            border: false,
            viewConfig: getGridViewConfig(panel),
            bufferedRenderer: N2N_CONFIG.gridBufferedRenderer,
            leadingBufferZone: N2N_CONFIG.gridLeadingBufferZone,
            trailingBufferZone: N2N_CONFIG.gridTrailingBufferZone,
            listeners: {
                afterrender: function (thisComp) {
                    panel.tooltip = new Ext.tip.ToolTip({//v1.3.33.27
                        target: 'saveSetting_WL' + panel.id,
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
                    
                    var tab = thisComp.up();
                    if (tab.mt && tab.mt.indexOf('mt') > -1) {
                        n2nLayoutManager.addExtraButtons(thisComp, tab);
                    }
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
                headerclick: function (ct, column, e, t, eOpts) {
                    if (exchangecode == "MY" && derivativeWLSort == "TRUE") {
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
                itemcontextmenu: function (thisView, record, item, index, e) {
                    if (!touchMode) {
                        panel.showContextMenu(thisView, record, index, e);
                    }
                },
                sortchange: function (ct, col, dir) {
                    panel.sortInfo = [{
                        property: col.dataIndex,
                        direction: dir
                    }];
                    Blinking.resetBlink(panel);

                },
                beforedestroy: function () {
                    Blinking.clearBlink(panel);
                },
                destroy: function (grid) {
                    if (grid.contextMenu != null) {
                        grid.contextMenu.destroy();
                    }

                    Storage.generateUnsubscriptionByExtComp(panel);
                },
                selectionchange: function (selModel, selected, evt) {
                    controlSelectionChanged(panel, selected);
                },
                columnmove: gridColHandler,
                columnshow: gridColHandler,
                columnhide: gridColHandler,
                resize: bufferedResizeHandler
            },
            tbar: panel.compRef.tbar,
            bbar: panel.compRef.bbar
        };

        panel.createContextMenu();

        Ext.apply(this, defaultConfig);
        this.callParent();
    },
    switchRefresh: function (silent) {
        var panel = this;
        
        if (panel.suspendSwitchRefresh) {
            return;
        }

        if (panel.fulllist && panel.fulllist.length > 0) {
            reactivateRow(panel);
            panel.callSort(panel.fulllist, silent);
        }
    },
    show: function () {
        var panel = this;

        panel.resetFeedSetting();
        if (panel.fulllist.length > 0) {
            panel.callSort(panel.fulllist);
        } else {
            helper.setGridEmptyText(panel, languageFormat.getLanguage(30013, 'No result found.'));
            // msgutil.info(languageFormat.getLanguage(30102, 'You do not have any stocks in this watchlist \'[PARAM0]\'.', textToHtml(panel.wlname)));
        }
    },
    callImageBlink: function () { //v1.3.33.27
        var panel = this;
        var btn = Ext.getCmp('saveSetting_WL' + panel.id);
        if (panel.isImgBlink == false) {
            btn.show();
            panel.isImgBlink = true;
            panel.callImg(btn);
        }
    },
    callImg: function (btn) {
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
    imgBlink: function (hidden, btn) {
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

        if (cookies.isCookiesExist(panel.wckId)) {
            var temp = cookies.getCookies(panel.wckId);
            columnID = temp[0];
            columnWidth = temp[1];
        }
        else {
            columnID = global_WLColumnID;
            columnWidth = global_WLWidth;

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

        return panel.columnHash.get(columnID) || 100;
    },
    /**
     * Description <br/>
     * 
     * 		searching function 
     * 		this function didn't call back to server, it just at local to do filter
     * 
     *  @param key : string / null
     */
    search: function (key) {
        var panel = this;

        /*
         * key                 =  is stock name
         * panel.filterExtOpt  =  is exchange code
         */

        /*
         if (key == null || key.length == 0) {
         if (panel.filterExtOpt == 0) {
         if (panel.getStore().isFiltered()) {
         Blinking.clearBlink(panel);
         panel.getStore().clearFilter();
         }
         return;
         } else {
         // need filter
         }
         }*/

        Blinking.clearBlink(panel);
        panel.getStore().clearFilter(); //shuwen:clear filters before filtering again as new extjs5 keeps filtered record to be filtered again.

        panel.getStore().filterBy(function (record, id) {
            var blnFilterKey = true;
            var blnFilterEx = true;
            var tempStkName = stockutil.getStockName(record.get(fieldStkName)); //remove exchange suffix
            var tempStkCode = stockutil.getStockPart(record.get(fieldStkCode)); //remove exchange suffix

            // filter by stock name
            if (key == null || key.length == 0) {
                // show all
            } else {
                if (tempStkName.toUpperCase().indexOf(key.toUpperCase()) != -1) {
                    blnFilterKey = true;
                } else if (tempStkCode.toUpperCase().indexOf(key.toUpperCase()) != -1) { //v1.3.33.51 Filter by stock code also
                    blnFilterKey = true;
                } else {
                    blnFilterKey = false;
                }
            }

            // filter by exchange code
            if (panel.filterExtOpt == 0) {
                // show all
            } else {
        		var tempExchangeCode = formatutils.removeDelayExchangeChar(panel.filterExtOpt);

                if (record.get(fieldExchangeCode).toUpperCase().indexOf(tempExchangeCode.toUpperCase()) != -1) {
                    blnFilterEx = true;
                } else {
                    blnFilterEx = false;
                }
            }

            return blnFilterKey && blnFilterEx;
        });

        if (panel.getStore().getCount() == 0) {
            helper.setGridEmptyText(panel, languageFormat.getLanguage(30013, 'No result found.'));
        }
    },
    /**
     * Description <br/>
     * 
     * 		call ajax to get this watch list detail and recall this object function (callSort) again 
     * 
     */
    resetList: function () {
        /*
         * this function is different, it is call this watch list detail again
         * then reset stock list and recall "callSort" agains to retrieve record 
         */

        var panel = this;

        panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
        
        if (panel.recentQuote) {
            panel.displayList(recentQuotePrfr.getRecentList());
        } else {
            var url = addPath + 'tcplus/getwl?';
            url += 'ExtComp=WatchList_' + panel.getId();
            url += '&w=' + panel.wlname;

            Ext.Ajax.request({
                url: url,
                method: 'POST',
                success: function(response) {

                    var text = response.responseText;
                    try {
                        var obj = Ext.decode(text);
                        var d = obj.d;
                        panel.displayList(d);
                    } catch (e) {
                        helper.setGridEmptyText(panel, languageFormat.getLanguage(30121, 'We regret to inform that we are unable to process your request at this time. Kindly try again shortly. -9809-'));
                        panel.stkcodes = [];

                    }
                },
                failure: function(response) {
                    panel.setLoading(false);
                    helper.setGridEmptyText(panel, languageFormat.getLanguage(30121, 'We regret to inform that we are unable to process your request at this time. Kindly try again shortly. -9809-'));
                    panel.stkcodes = [];
                }
            });
        }
    },
    displayList: function(d) {
        var panel = this;

        if (d.length > 0) {

            if (showExchangeMapping == "TRUE") {
                //hardcoded: map SI to SG before display
                for (var i = 0; i < d.length; i++) {
                    var stkcode = d[i];
                    stkcode = stkcode.replace('.SI', '.SG');
                    d[i] = stkcode;
                }
            }

            panel.fulllist = d;

            if (panel.getStore().getCount() == 0) {
                panel.show();

            } else {
                panel.resetFeedSetting();
                panel.callSort(panel.fulllist);
            }
        } else {
            panel.setLoading(false);
            helper.setGridEmptyText(panel, languageFormat.getLanguage(30013, 'No result found.'));
            if (!panel.recentQuote) {
                msgutil.info(languageFormat.getLanguage(30102, 'You do not have any stocks in this watchlist \'[PARAM0]\'.', textToHtml(panel.wlname)));
            }
                        
        }
    },
    /**
     * Description <br/>
     * 
     * 		get watch list data from server side
     * 
     * @param list : null / json 
     */
    callSort: function (list, silent) {
        var panel = this;
        if (!panel.recentQuote) {
            n2nLayoutManager.updateTitle(panel, languageFormat.getLanguage(20001, 'Watchlist') + ' - ' + textToHtml(panel.wlname));
        }

        // display loading panel
        if (!silent) {
            panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
        }

        var sortAlpha = list != null;
        if (!sortAlpha) {
            panel.fulllist = null;
        }

        var newList = panel.getColList();
        var newStockList = panel.getCodeList(list);

        if (panel.store.getCount() != 0) {
            Blinking.clearBlink(panel);
        }
        
        conn.getStockList({
            f: newList,
            p: panel.page,
            c: newStockList.length,
            list: newStockList,
            success: function (obj) {
                try {
                    obj.t = 'WatchList_' + panel.id;
                    
                    if (!obj.s) {

                        var errorMessage = "";
                        if (obj.e != null && obj.m != null) {
                            errorMessage = obj.e + " - " + obj.m;

                        } else if (obj.c == 0) {
                            errorMessage = languageFormat.getLanguage(30013, 'No result found.');

                        }
                        
                        if (panel.store.getCount() != 0) {
                            panel.store.removeAll();
                        }
                        helper.setGridEmptyText(panel, errorMessage);
                        panel.stkcodes = [];

                    } else if (obj.s) {
                    	if(panel.recentQuote){
                    		obj = panel.arrangeList(obj, newStockList);
                    	}
                        panel.updateSortHttp(obj);
                        panel.search(panel.tfSearch.getValue());
                        if (panel.sortInfo) {
                            // panel.getStore().sort(panel.sortInfo);
                        }

                    } else {
                        if (panel.store.getCount() != 0) {
                            panel.store.removeAll();
                        }
                        helper.setGridEmptyText(panel, languageFormat.getLanguage(30123, 'We regret to inform that we are unable to process your request at this time. Kindly try again shortly. -9808 -'));
                        panel.stkcodes = [];

                    }

                } catch (e) {
                    if (panel.store.getCount() != 0) {
                        panel.store.removeAll();
                    }
                    helper.setGridEmptyText(panel, languageFormat.getLanguage(30124, 'We regret to inform that we are unable to process your request at this time. Kindly try again shortly. -9806 -'));
                    panel.stkcodes = [];
                }

                panel.setLoading(false);

            }
        });

    },
    /**
     * Description <br/>
     * 
     * 		filter stock record 
     */
    updateSortHttp: function (obj, pos) {
        var panel = this;
        
        // update grid panel record
        panel.updateFeed(obj, pos);
    },
    /**
     * Description <br/>
     * 
     * 		update watch list grid panel record 
     * 
     * @param obj : json
     */
    updateFeed: function (obj, pos) {

        var panel = this;

        /*
         * update watch list panel 
         * 
         * ** this method not only using in this object, at main.js also have call this method
         * 
         * why : because have latest record/feed will return or push back, then will pass to here process
         */
        try {
            if (('WatchList_' + panel.id) == obj.t) {
                // this is total number of record
                // this is carry record object
                
                var appendDt = [];
                if (pos == null) {
                    panel.tempDatas = [];
                    panel.stkcodes = [];
                    panel.fulllist = [];
                    panel.feedExchangeList = new Array();
                }

                for (var i = 0; i < obj.c; i++) {
                    var d = obj.d[i];
                    var newObject = {};

                    if (d[fieldStkCode] == null) {
                        dataComplete = false;
                    }

                    if (d[fieldStkCode] != null) {
                        var fIdx = panel.fulllist.indexOf(d[fieldStkCode]);
                        if (fIdx == -1) {
                            if (pos === 0) { // move to front position if given index is 0
                                panel.fulllist.unshift(d[fieldStkCode]);
                            } else {
                                panel.fulllist.push(d[fieldStkCode]);
                            }
                        } else {
                            if (pos === 0) { // move current element to front (0)
                                panel.fulllist.splice(fIdx, 1);
                                panel.fulllist.unshift(d[fieldStkCode]);
                            }
                        }

                        var sIdx = panel.stkcodes.indexOf(d[fieldStkCode]);
                        if (sIdx == -1) {
                            if (pos === 0) { // move to front position if given index is 0
                                panel.stkcodes.unshift(d[fieldStkCode]);
                            } else {
                                panel.stkcodes.push(d[fieldStkCode]);
                            }
                        } else {
                            if (pos === 0) {
                                panel.stkcodes.splice(fIdx, 1);
                                panel.stkcodes.unshift(d[fieldStkCode]);
                            }
                            continue; // ignore existing code
                        }

                        var exCode = panel.getExchangeType(d[fieldStkCode]);
                        if (panel.feedExchangeList.indexOf(exCode) == -1) {
                            panel.feedExchangeList.push(exCode);
                        }
                    }

                    var timeValue = d[fieldTime];
                    var timeval = 0;
                    if (timeValue != null) {
                        if (timeValue.length > 6) {
                            timeValue = timeValue.substring(1, timeValue.length);
                        }

                        var timevalue = formatutils.getDateInstance(timeValue);
                        timeval = timevalue.getTime();
                    }

                    newObject[fieldStkCode] = d[fieldStkCode] == null ? "" : d[fieldStkCode];
                    newObject[fieldStkName] = d[fieldStkName] == null ? "" : d[fieldStkName];
                    newObject[fieldStkFName] = d[fieldStkFName] == null ? "" : d[fieldStkFName];
                    newObject[fieldLast] = d[fieldLast] == null ? "" : d[fieldLast];
                    newObject[fieldPrev] = d[fieldPrev] == null ? "" : d[fieldPrev];
                    newObject[fieldLacp] = d[fieldLacp] == null ? "" : d[fieldLacp];
                    newObject[fieldHigh] = d[fieldHigh] == null ? "" : d[fieldHigh];
                    newObject[fieldLow] = d[fieldLow] == null ? "" : d[fieldLow];
                    newObject[fieldBqty] = d[fieldBqty] == null ? "" : d[fieldBqty];
                    newObject[fieldBuyRate] = d[fieldBuyRate] || 0;
                    newObject[fieldBuy] = d[fieldBuy] == null ? "" : d[fieldBuy];
                    newObject[fieldSell] = d[fieldSell] == null ? "" : d[fieldSell];
                    newObject[fieldSqty] = d[fieldSqty] == null ? "" : d[fieldSqty];
                    newObject[fieldUnit] = d[fieldUnit] == null ? "" : d[fieldUnit];
                    newObject[fieldVol] = d[fieldVol] == null ? "" : d[fieldVol];
                    newObject[fieldTime] = timeval;
                    newObject[fieldTotTrade] = d[fieldTotTrade] == null ? "" : d[fieldTotTrade];
                    newObject[fieldTP] = d[fieldTP] == null ? "" : d[fieldTP];
                    newObject[fieldTOP] = d[fieldTOP] == null ? "" : d[fieldTOP];
                    newObject[fieldLotSize] = d[fieldLotSize] == null ? "" : d[fieldLotSize];
                    newObject[fieldCurrency] = d[fieldCurrency] == null ? "" : d[fieldCurrency];
                    newObject[fieldPI] = d[fieldPI] == null ? "" : d[fieldPI];
                    newObject[fieldOpen] = d[fieldOpen] == null ? "" : d[fieldOpen];
                    newObject[fieldOpenInt] = d[fieldOpenInt] == null ? "" : d[fieldOpenInt];

                    //Dividend info
                    newObject[fieldEPS] = d[fieldEPS] == null ? "" : d[fieldEPS];
                    newObject[fieldPERatio] = d[fieldPERatio] == null ? "" : d[fieldPERatio];
                    newObject[field12MDiv] = d[field12MDiv] == null ? "" : d[field12MDiv];
                    newObject[fieldDivPay] = d[fieldDivPay] == null ? "" : d[fieldDivPay];
                    newObject[fieldDivEx] = d[fieldDivEx] == null ? "" : d[fieldDivEx];
                    newObject[fieldDivYld] = d[fieldDivYld] == null ? "" : d[fieldDivYld];
                    newObject[fieldDivCcy] = d[fieldDivCcy] == null ? "" : d[fieldDivCcy];
                    newObject[fieldIntDiv] = d[fieldIntDiv] == null ? "" : d[fieldIntDiv];
                    newObject[fieldIntExDate] = d[fieldIntExDate] == null ? "" : d[fieldIntExDate];
                    newObject[fieldFinDiv] = d[fieldFinDiv] == null ? "" : d[fieldFinDiv];
                    newObject[fieldFinDivExDate] = d[fieldFinDivExDate] == null ? "" : d[fieldFinDivExDate];
                    //Circuit Breaker enhancements
                    newObject[fieldRefPrice_06] = d[fieldRefPrice_06] == null ? "" : d[fieldRefPrice_06];
                    newObject[fieldEndTime_06] = d[fieldEndTime_06] == null ? "" : d[fieldEndTime_06];

                    var status = '';
                    var news = '';
                    if (d[fieldStatus] != null && d[fieldStatus].length > 1) {
                        status = d[fieldStatus].charAt(1);
                    }
                    if (d[fieldStatus] != null && d[fieldStatus].length > 5) {
                        news = d[fieldStatus].charAt(5) + d[fieldStatus].charAt(4);
                    }
                    
                    newObject[fieldStatus] = status;
                    newObject[fieldNews] = news;
                    newObject[fieldRD] = panel.getFeedType(d[fieldStkCode]) == null ? "" : panel.getFeedType(d[fieldStkCode]);

                    var cfdValue = d[fieldCFDMapValue_06] || '';
                    cfdValue = cfdValue.toString(2);
                    newObject[fieldCFDTradable_06] = cfdValue.charAt(0);
                    newObject[fieldCFDShortSell_06] = cfdValue.charAt(1);
                    
                    var exCode = panel.getExchangeType(d[fieldStkCode]);
                    newObject[fieldExchangeCode] = exCode;

                    for (var ma = 0; ma < global_margin.len; ma++) { // verify from main.jsp
                        var V = global_margin.scpt[ma];
                        if (V.key == d[fieldStkCode]) {
                            var marginV = V.value.split(',');
                            newObject['margin'] = marginV[0];
                            newObject['marginPrc'] = marginV[1];
                            newObject['marginPc'] = marginV[2];
                        }
                    }
                    newObject[fieldValue] = d[fieldValue] == null ? "" : d[fieldValue];
                    newObject[fieldIndexCode] = d[fieldIndexCode];

                    newObject[fieldChange] = 0;
                    newObject[fieldChangePer] = 0;
                    newObject[fieldInstrument] = d[fieldInstrument] == null ? "" : d[fieldInstrument];

                    panel.tempDatas.push(newObject);
                    if (pos != null) {
                        appendDt.push(newObject);
                    }
                }

                // update field id
                panel.changeField(panel.getFieldList('all'));
                
                // clears existing filter
                panel.store.clearFilter();
                
                if (pos!=null) {
                    var newRec;
                    if (pos > -1) { // insert at pos
                        Blinking.clearBlink(panel);
                        newRec = panel.store.insert(pos, appendDt);
                    } else { // append to the last
                        newRec = panel.store.add(appendDt);
                    }
                    
                    if (panel.sortInfo) {
                        panel.getStore().sort(panel.sortInfo);
                    }
                    if (newRec.length > 0) {
                        var recInd = panel.store.indexOf(newRec[0]);
                        helper.selectRow(panel, recInd, true);
                    }
                } else {
                    var jsonObj = new Object();

                    jsonObj.success = true;
                    jsonObj.count = panel.stkcodes.length;
                    jsonObj.data = panel.tempDatas;

                    resetGridScroll(panel);
                    panel.store.loadData(jsonObj.data);
                    activateRow(panel);
                    n2ncomponents.activateEmptyScreens();
                }

                Storage.generateUnsubscriptionByExtComp(panel, true);
                Storage.procJson(obj, panel);
                Storage.generateSubscriptionByList(panel.stkcodes, panel);

                //update Exchange combo base by the data returned
//        		panel.updateExchangeCb(); 
            }

        } catch (e) {
            console.log('[watchList][updateFeed] Exception ---> ' + e);
            console.log(e.stack);
        }
    },
    /**
     * Description <br/>
     * 
     * 		update watch list record
     * 
     * @param {json} dataObj
     */
    updateFeedRecord: function (dataObj) {
        var panel = this;

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


                        			// *************************************************************
                        			if (key == fieldChange || key == fieldChangePer) {

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

                        			// *************************************************************

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
                        			// update string cell
                        		} else {
                        			// only for news and status
                        			var updateStatus = false;
                        			if (key == fieldStatus || key == fieldStkStatus || key == fieldNews || key == fieldRSSIndicator) {

                        				if (dataObj[fieldStkStatus] != null && dataObj[fieldStkStatus] != record.data[fieldStkStatus]) {
                        					updateStatus = true;
                        					var statusValue = '' + dataObj[fieldStkStatus];
                        					var statusColumnIndex = helper.getColumnIndex(columns, 'dataIndex', fieldStkStatus);//columns.findColumnIndex(fieldStatus);

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
                        						var cfdIValue = dataObj[fieldStatus].charAt(9);

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
                        				// update string cell
                        			} else {

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
            console.log('[watch list][updateFeedRecord] Exception ---> ' + e);
            console.log(e.stack);
        }

    },
    /**
     * Description <br/>
     * 
     * 		return feed is "Realtime" or "Delay"
     * 
     * @param stockcode : string
     * 
     * @return string 
     */
    getFeedType: function (stockcode) {	// use on outbound only to show R=RealTime / D=Delay
        if (stockcode != undefined && stockcode != null && outbound == true) {
            var tmpV = stockcode.split(".");
            var tmpType = tmpV[tmpV.length - 1];
            if (tmpType.length == 1) {	// delay feed will more then 1 char
                return 'R';
            } else {
                var tmpChkType = tmpType.substring(tmpType.length, tmpType.length - 1);
                if (tmpChkType.toUpperCase() == "D") {
                    return 'D';
                } else {
                    return 'R';
                }
            }
        } else {
            return 'R';
        }
    },
    /**
     * Description <br/>
     * 
     * 		return exchange is "Realtime" or "Delay" 
     * 		example : A, AD, SI ...
     * 
     * @param stockcode : string
     * 
     * @return string 
     */
    getExchangeType: function (stockcode) {	// use on outbound only to show R=RealTime / D=Delay
        if (stockcode != undefined && stockcode != null) {// && outbound==true){
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

            } else if (type == "change") { //v1.3.33.23
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
        	//if (global_personalizationTheme.indexOf("wh") == -1 || isMobile) {
            	columnList.push(panel._getDeleterColumn());
        	//}
        }

        var wlPrefix = panel.getId();
        for (var i = 0; i < colSettingList.length; i++) {
            var colObj = colSettingList[i];
            var columnID = colObj.column;
            var columnVisible = colObj.visible ? false : true;

            switch (columnID) {
                case cmap_mmCode:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmCode,
                        header: languageFormat.getLanguage(10101, 'Code'),
                        dataIndex: fieldStkCode,
                        hidden: columnVisible,
                        sortable: true,
                        locked: helper.getCodeLock(colSettingList, cmap_mmSymbol),
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record, rowIndex, columnIndex, store) {

                            newSetting(meta, value, record, 'string');

                            var index = value.lastIndexOf('.');
                            if (index != -1) {
                                value = value.substring(0, index);
                            }

                            return value;
                        }});
                    break;
                case cmap_mmSymbol:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmSymbol,
                        header: languageFormat.getLanguage(10102, 'Symbol'),
                        dataIndex: fieldStkName,
                        hidden: columnVisible,
                        sortable: true,
                        locked: true,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record, rowIndex, columnIndex, store) {

                            newSetting(meta, value, record, 'stockName');

                            var index = value.lastIndexOf('.');
                            if (index != -1) {
                                value = value.substring(0, index);
                            }

                            return value;
                        }});
                    break;
                case cmap_mmClose:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmClose,
                        header: languageFormat.getLanguage(10103, 'Close'),
                        dataIndex: fieldPrev,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record, rowIndex, columnIndex, store) {

                            newSetting(meta, value, record, 'unchange');

                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmOpen:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmOpen,
                        header: languageFormat.getLanguage(10104, 'Open'),
                        dataIndex: fieldOpen,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmOpenInt:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmOpenInt,
                        header: languageFormat.getLanguage(10105, 'Open Int'),
                        dataIndex: fieldOpenInt,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmLacp:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmLacp,
                        header: languageFormat.getLanguage(10106, 'LACP'),
                        dataIndex: fieldLacp,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmHigh:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmHigh,
                        header: languageFormat.getLanguage(10107, 'High'),
                        dataIndex: fieldHigh,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmLow:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmLow,
                        header: languageFormat.getLanguage(10108, 'Low'),
                        dataIndex: fieldLow,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmBidQty:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmBidQty,
                        header: languageFormat.getLanguage(10109, 'Bid.Qty'),
                        dataIndex: fieldBqty,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'numberyellow');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mmBidQty));
                        },
                        align: 'right'});
                    break;
                case cmap_mmBid:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmBid,
                        header: languageFormat.getLanguage(10110, 'Bid'),
                        dataIndex: fieldBuy,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmAsk:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmAsk,
                        header: languageFormat.getLanguage(10111, 'Ask'),
                        dataIndex: fieldSell,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmAskQty:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmAskQty,
                        header: languageFormat.getLanguage(10112, 'Ask.Qty'),
                        dataIndex: fieldSqty,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'numberyellow');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mmAskQty));
                        },
                        align: 'right'});
                    break;
                case cmap_mmLast:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmLast,
                        header: languageFormat.getLanguage(10113, 'Last'),
                        dataIndex: fieldLast,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmBS:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmBS,
                        header: languageFormat.getLanguage(10114, 'b/s'),
                        dataIndex: fieldPI,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                       // menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmChg:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmChg,
                        header: languageFormat.getLanguage(10115, 'Chg'),
                        dataIndex: fieldChange,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'change');
                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmChgPer:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmChgPer,
                        header: languageFormat.getLanguage(10116, 'Chg%'),
                        dataIndex: fieldChangePer,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                       // menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'change'); //v1.3.33.23    					    						
                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmLVol:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmLVol,
                        header: languageFormat.getLanguage(10117, 'L.Vol'),
                        dataIndex: fieldUnit,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                       // menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {

                            newSetting(meta, value, record, 'numberyellow');

                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mmLVol));
                        },
                        align: 'right'});
                    break;
                case cmap_mmVol:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmVol,
                        header: languageFormat.getLanguage(10118, 'Vol'),
                        dataIndex: fieldVol,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                       // menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'numberyellow');

                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mmVol));
                        },
                        align: 'right'});
                    break;
                case cmap_mmTrades:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmTrades,
                        header: languageFormat.getLanguage(10119, 'Trades'),
                        dataIndex: fieldTotTrade,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');

                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mmTrades));
                        },
                        align: 'right'});
                    break;
                case cmap_mmSts:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmSts,
                        header: languageFormat.getLanguage(10120, 'Sts'),
                        dataIndex: fieldStkStatus,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {

                            newSetting(meta, value, record, 'string');

                            return formatutils.procStringValue(value);
                        },
                        align: 'center'});
                    break;
                case cmap_mmNews:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmNews,
                        header: languageFormat.getLanguage(10121, 'News'),
                        dataIndex: fieldNews,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
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
                        itemId: wlPrefix + cmap_mmRSSIndicator,
                        header: 'ShortSell',
                        dataIndex: fieldRSSIndicator,
                        hidden: columnVisible,
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
                        itemId: wlPrefix + cmap_mmTp,
                        header: languageFormat.getLanguage(10122, 'TP'),
                        dataIndex: fieldTP,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {

                            newSetting(meta, value, record, 'string');

                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmTime:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmTime,
                        header: languageFormat.getLanguage(10123, 'Time'),
                        dataIndex: fieldTime,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {

                            newSetting(meta, value, record, 'string');

                            return formatutils.procDateValue(value);
                        },
                        align: 'center'});
                    break;
                case cmap_mmTop:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmTop,
                        header: languageFormat.getLanguage(10124, 'TOP'),
                        dataIndex: fieldTOP,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmRD:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmRD,
                        header: languageFormat.getLanguage(10125, 'R/D'),
                        dataIndex: fieldRD,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {

                            newSetting(meta, value, record, 'string');

                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmExchg:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmExchg,
                        header: languageFormat.getLanguage(10126, 'Exchg'),
                        dataIndex: fieldExchangeCode,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                     //   menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {

                            newSetting(meta, value, record, 'string');

                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmTValue:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmTValue,
                        header: languageFormat.getLanguage(10127, 'Value'),
                        dataIndex: fieldValue,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                     //   menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');

                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mmTValue));
                        },
                        align: 'right'});
                    break;
                case cmap_mmMargin:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmMargin,
                        header: languageFormat.getLanguage(10128, 'Marginable'),
                        dataIndex: 'margin',
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmMarginPrc:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmMarginPrc,
                        header: languageFormat.getLanguage(10129, 'Margin-Price'),
                        dataIndex: 'marginPrc',
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {

                            newSetting(meta, value, record, 'unchange');

                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmMarginPc:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmMarginPc,
                        header: languageFormat.getLanguage(10130, 'Margin Perc.'),
                        dataIndex: 'marginPc',
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {

                            newSetting(meta, value, record, 'string');

                            return value;
                        },
                        align: 'center'
                    });
                    break;
                case cmap_mmLotSize:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmLotSize,
                        header: languageFormat.getLanguage(10131, 'Lot Size'),
                        dataIndex: fieldLotSize,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.33.27
                        renderer: function (value, meta, record) {

                            newSetting(meta, value, record, 'numberyellow');

                            return panel.returnNumberFormat(value);
                        },
                        align: 'center'});
                    break;
                case cmap_mmCurrency:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmCurrency,
                        header: languageFormat.getLanguage(10132, 'Currency'),
                        dataIndex: fieldCurrency,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                    //    menuDisabled: isMobile,
//        				width			: 50,//v1.3.30.9
                        width: panel.getWidth(columnID), //v1.3.30.9
                        renderer: function (value, meta, record) {

                            newSetting(meta, value, record, 'string');

                            return panel.returnNumberFormat(value);
                        },
                        align: 'center'});
                    break;
                case cmap_mmRemark:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmRemark,
                        header: languageFormat.getLanguage(10133, 'Remark'),
                        dataIndex: fieldRemark,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');

                            return panel.returnNumberFormat(value);
                        },
                        align: 'center'});
                    break;
                case cmap_mmSettPrice:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmSettPrice,
                        header: languageFormat.getLanguage(10184, 'Sett.'),
                        dataIndex: fieldSettPrice,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                        	newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmBuyRate:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmBuyRate,
                        header: languageFormat.getLanguage(10166, 'Buy%'),
                        dataIndex: fieldBuyRate,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                     //   menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            meta.tdCls = 'nopadding';

                            return getColorBar(value);
                        },
                        align: 'center'});
                    break;
                case cmap_mm52WHi_06:	//msgtype06
                    columnList.push({
                        itemId: wlPrefix + cmap_mm52WHi_06,
                        header: languageFormat.getLanguage(10135, '52WHi'),
                        dataIndex: field52WHigh_06,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                     //   menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.30.9
                        renderer: function (value, meta, record) {

                            newSetting(meta, value, record, 'number');

                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mm52WLo_06:	//msgtype06
                    columnList.push({
                        itemId: wlPrefix + cmap_mm52WLo_06,
                        header: languageFormat.getLanguage(10136, '52WLo'),
                        dataIndex: field52WLow_06,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.30.9
                        renderer: function (value, meta, record) {

                            newSetting(meta, value, record, 'number');

                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmIndexGrp_06:		//msgtype06
                    columnList.push({
                        itemId: wlPrefix + cmap_mmIndexGrp_06,
                        header: languageFormat.getLanguage(10137, 'Category'),
                        dataIndex: fieldIndexGrp_06,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.30.9
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmPrevStkNo_06:	//msgtype06
                    columnList.push({
                        itemId: wlPrefix + cmap_mmPrevStkNo_06,
                        header: languageFormat.getLanguage(10138, 'PrevStkNo'),
                        dataIndex: fieldPrevStkNo_06,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.30.9
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmPrevStkName_06:	//msgtype06
                    columnList.push({
                        itemId: wlPrefix + cmap_mmPrevStkName_06,
                        header: languageFormat.getLanguage(10139, 'PrevStkName'),
                        dataIndex: fieldPrevLongName_06,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                     //   menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.30.9
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmTickSize_06:	//msgtype06
                    columnList.push({
                        itemId: wlPrefix + cmap_mmTickSize_06,
                        header: languageFormat.getLanguage(10140, 'TickSize'),
                        dataIndex: fieldTickSize_06,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.30.9
                        renderer: function (value, meta, record) {

                            newSetting(meta, value, record, 'number');

                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmTheoPrice_06:	//msgtype06
                    columnList.push({
                        itemId: wlPrefix + cmap_mmTheoPrice_06,
                        header: languageFormat.getLanguage(10141, 'TheoPrice'),
                        dataIndex: fieldTheoPrice_06,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                     //   menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.30.9
                        renderer: function (value, meta, record) {

                            newSetting(meta, value, record, 'number');

                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmDynamicLow_06:	//msgtype06
                    columnList.push({
                        itemId: wlPrefix + cmap_mmDynamicLow_06,
                        header: languageFormat.getLanguage(10142, 'DynamicLow'),
                        dataIndex: fieldDynamicLow_06,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.30.9
                        renderer: function (value, meta, record) {

                            newSetting(meta, value, record, 'number');

                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmDynamicHigh_06:	//msgtype06
                    columnList.push({
                        itemId: wlPrefix + cmap_mmDynamicHigh_06,
                        header: languageFormat.getLanguage(10143, 'DynamicHigh'),
                        dataIndex: fieldDynamicHigh_06,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                     //   menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.30.9
                        renderer: function (value, meta, record) {

                            newSetting(meta, value, record, 'number');

                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmIssuer_06:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmIssuer_06,
                        header: languageFormat.getLanguage(10153, 'Issuer'),
                        dataIndex: fieldIssuer_06,
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID), //v1.3.30.9
                        renderer: function (value, meta, record) {

                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmUnderCurrency_06:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmUnderCurrency_06,
                        header: languageFormat.getLanguage(10154, 'UnderCurr'),
                        dataIndex: fieldUnderCurr_06,
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID), //v1.3.30.9
                        renderer: function (value, meta, record) {

                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmUnderName_06:
                    columnList.push({
                        itemId: wlPrefix + cmap_mmUnderName_06,
                        header: languageFormat.getLanguage(10155, 'UnderName'),
                        dataIndex: fieldUnderName_06,
                        hidden: columnVisible,
                        sortable: true,
                        width: panel.getWidth(columnID), //v1.3.30.9
                        renderer: function (value, meta, record) {

                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmExpiryDate:		//OSK
                    columnList.push({
                        itemId: wlPrefix + cmap_mmExpiryDate,
                        header: languageFormat.getLanguage(10144, 'ExpiryDate'),
                        dataIndex: fieldExpiryDate,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return Ext.util.Format.date(value, 'd/m/Y'); //return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmExePrice:	//OSK
                    columnList.push({
                        itemId: wlPrefix + cmap_mmExePrice,
                        header: languageFormat.getLanguage(10152, 'ExPrice'),
                        dataIndex: fieldExercisePrice,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                       // menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmExeRatio:	//OSK
                    columnList.push({
                        itemId: wlPrefix + cmap_mmExeRatio,
                        header: languageFormat.getLanguage(10145, 'ExRatio'),
                        dataIndex: fieldExerciseRatio,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                       // menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmGearingX:	//OSK
                    columnList.push({
                        itemId: wlPrefix + cmap_mmGearingX,
                        header: languageFormat.getLanguage(10146, 'Gearing'),
                        dataIndex: fieldGearingX,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmPremiumPerc:	//OSK
                    columnList.push({
                        itemId: wlPrefix + cmap_mmPremiumPerc,
                        header: languageFormat.getLanguage(10147, 'Premium%'),
                        dataIndex: fieldPremiumPerc,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                       // menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmImpVolatility:	//OSK
                    columnList.push({
                        itemId: wlPrefix + cmap_mmImpVolatility,
                        header: languageFormat.getLanguage(10148, 'I.V%'),
                        dataIndex: fieldImpVolatility,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'number');
                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmUnderlying:	//OSK
                    columnList.push({
                        itemId: wlPrefix + cmap_mmUnderlying,
                        header: languageFormat.getLanguage(10149, 'Underlying'),
                        dataIndex: fieldUnderlying,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function(value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmOptionType:		//OSK
                    columnList.push({
                        itemId: wlPrefix + cmap_mmOptionType,
                        header: languageFormat.getLanguage(10150, 'OptionType'),
                        dataIndex: fieldOptionType,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmOptionStyle:		//OSK
                    columnList.push({
                        itemId: wlPrefix + cmap_mmOptionStyle,
                        header: languageFormat.getLanguage(10151, 'OptionStyle'),
                        dataIndex: fieldOptionStyle,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                       // menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'center'});
                    break;
                case cmap_mmFloatLevel_06:	//PSE
                    columnList.push({
                        itemId: wlPrefix + cmap_mmFloatLevel_06,
                        header: languageFormat.getLanguage(10159, 'FloatLevel'),
                        dataIndex: fieldFloatLevel_06,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmFreeFloat_06:	//PSE
                    columnList.push({
                        itemId: wlPrefix + cmap_mmFreeFloat_06,
                        header: languageFormat.getLanguage(10160, 'FreeFloat'),
                        dataIndex: fieldFreeFloat_06,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            // return formatutils.procPriceValue(value).value;
                            return panel.returnNumberFormat(value);
                        },
                        align: 'right'});
                    break;
                case cmap_mmFloatShare_06:	//PSE
                    columnList.push({
                        itemId: wlPrefix + cmap_mmFloatShare_06,
                        header: languageFormat.getLanguage(10161, 'FloatShare'),
                        dataIndex: fieldFloatShare_06,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            //return formatutils.procPriceValue(value).value;
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mmFloatShare_06));
                        },
                        align: 'right'});
                    break;
                case cmap_mmFlunctuation_06:	//PSE
                    columnList.push({
                        itemId: wlPrefix + cmap_mmFlunctuation_06,
                        header: languageFormat.getLanguage(10162, 'Fluctuations'),
                        dataIndex: fieldFlunctuation_06,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmForeignOwnerLimit_06:	//PSE
                    columnList.push({
                        itemId: wlPrefix + cmap_mmForeignOwnerLimit_06,
                        header: languageFormat.getLanguage(10163, 'ForeignLimit'),
                        dataIndex: fieldForeignOwnerLimit,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                        //menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            //return formatutils.procPriceValue(value).value;
                            return panel.returnNumberFormat(value);
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldShrIssue_05:	//PSE
                    columnList.push({
                        itemId: wlPrefix + cmap_mmfieldShrIssue_05,
                        header: languageFormat.getLanguage(10164, 'OutStdShare'),
                        dataIndex: fieldShrIssue,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            console.log("testing: " + value);
                            newSetting(meta, value, record, 'numberyellow');
                            return panel.returnNumberFormat(value, panel.getWidth(cmap_mmfieldShrIssue_05));
                        },
                        align: 'right'});
                    break;                
                case cmap_mmfieldEPS:	//Dividend Info
                    columnList.push({
                        itemId: wlPrefix + cmap_mmfieldEPS,
                        header: languageFormat.getLanguage(10177, '12MEPS'),
                        dataIndex: fieldEPS,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                     //   menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldPERatio:	//Dividend Info
                    columnList.push({
                        itemId: wlPrefix + cmap_mmfieldPERatio,
                        header: languageFormat.getLanguage(10178, '12MP/E'),
                        dataIndex: fieldPERatio,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfield12MDiv:	//Dividend Info
                    columnList.push({
                        itemId: wlPrefix + cmap_mmfield12MDiv,
                        header: languageFormat.getLanguage(10167, '12MDiv'),
                        dataIndex: field12MDiv,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldDivPay:	//Dividend Info
                    columnList.push({
                        itemId: wlPrefix + cmap_mmfieldDivPay,
                        header: languageFormat.getLanguage(10168, 'DivPay'),
                        dataIndex: fieldDivPay,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldDivEx:	//Dividend Info
                    columnList.push({
                        itemId: wlPrefix + cmap_mmfieldDivEx,
                        header: languageFormat.getLanguage(10169, 'DivEx'),
                        dataIndex: fieldDivEx,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                       // menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldDivYld:	//Dividend Info
                    columnList.push({
                        itemId: wlPrefix + cmap_mmfieldDivYld,
                        header: languageFormat.getLanguage(10170, 'DivYld'),
                        dataIndex: fieldDivYld,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                     //   menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldDivCcy:	//Dividend Info
                    columnList.push({
                        itemId: wlPrefix + cmap_mmfieldDivCcy,
                        header: languageFormat.getLanguage(10171, 'DivCcy'),
                        dataIndex: fieldDivCcy,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                     //   menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldIntDiv:	//Dividend Info
                    columnList.push({
                        itemId: wlPrefix + cmap_mmfieldIntDiv,
                        header: languageFormat.getLanguage(10172, 'IntDiv'),
                        dataIndex: fieldIntDiv,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldIntExDate:	//Dividend Info
                    columnList.push({
                        itemId: wlPrefix + cmap_mmfieldIntExDate,
                        header: languageFormat.getLanguage(10173, 'IntExDate'),
                        dataIndex: fieldIntExDate,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                     //   menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldSpDiv:	//Dividend Info
                    columnList.push({
                        itemId: wlPrefix + cmap_mmfieldSpDiv,
                        header: languageFormat.getLanguage(10174, 'SpDiv'),
                        dataIndex: fieldSpDiv,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                     //   menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldSpDivExDate:	//Dividend Info
                    columnList.push({
                        itemId: wlPrefix + cmap_mmfieldSpDivExDate,
                        header: languageFormat.getLanguage(10175, 'SpDivExDate'),
                        dataIndex: fieldSpDivExDate,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                     //   menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldFinDiv:	//Dividend Info
                    columnList.push({
                        itemId: wlPrefix + cmap_mmfieldFinDiv,
                        header: languageFormat.getLanguage(10176, 'FinDiv'),
                        dataIndex: fieldFinDiv,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldFinDivExDate:	//Dividend Info
                    columnList.push({
                        itemId: wlPrefix + cmap_mmfieldFinDivExDate,
                        header: languageFormat.getLanguage(10179, 'FinDivExDate'),
                        dataIndex: fieldFinDivExDate,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmfieldFXSpread:	//FOREX
                    columnList.push({
                        itemId: wlPrefix + cmap_mmfieldFXSpread,
                        header: languageFormat.getLanguage(10180, 'Spread'),
                        dataIndex: fieldFXSpread,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                     //   menuDisabled: isMobile,
                        width: panel.getWidth(columnID),
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_fieldRefPrice_06:	//CIMBSG Circuit Breaker Enhancements
                    columnList.push({
                        itemId: wlPrefix + cmap_fieldRefPrice_06,
                        header: languageFormat.getLanguage(10181, 'Reference'),
                        dataIndex: fieldRefPrice_06,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.30.9
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'unchange');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_fieldEndTime_06:	//CIMBSG Circuit Breaker Enhancements
                    columnList.push({
                        itemId: wlPrefix + cmap_fieldEndTime_06,
                        header: languageFormat.getLanguage(10182, 'EndTime'),
                        dataIndex: fieldEndTime_06,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.30.9
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return formatutils.procPriceValue(value).value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmCFDTradable_06:	//CFD Columns
                    columnList.push({
                        itemId: wlPrefix + cmap_mmCFDTradable_06,
                        header: languageFormat.getLanguage(10185, 'CFD Tradable'),
                        dataIndex: fieldCFDTradable_06,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.30.9
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
                        itemId: wlPrefix + cmap_mmCFDSS_06,
                        header: languageFormat.getLanguage(10186, 'CFD ShortSell'),
                        dataIndex: fieldCFDShortSell_06,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.30.9
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
                        itemId: wlPrefix + cmap_mmCFDMarginPerc_06,
                        header: languageFormat.getLanguage(10187, 'CFD Margin%'),
                        dataIndex: fieldCFDMarginPerc_06,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.30.9
                        renderer: function (value, meta, record) {
                            newSetting(meta, value, record, 'string');
                            return value;
                        },
                        align: 'right'});
                    break;
                case cmap_mmCFDMarginLS_06:	//CFD Columns
                    columnList.push({
                        itemId: wlPrefix + cmap_mmCFDMarginLS_06,
                        header: languageFormat.getLanguage(10188, 'CFD Margin LotSize'),
                        dataIndex: fieldCFDMarginLS_06,
                        hidden: columnVisible,
                        sortable: true,
                        lockable: false,
                      //  menuDisabled: isMobile,
                        width: panel.getWidth(columnID), //v1.3.30.9
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
            case cmap_mmDynamicLow_06:
                string = languageFormat.getLanguage(10142, 'DynamicLow');
                break;
            case cmap_mmDynamicHigh_06:
                string = languageFormat.getLanguage(10143, 'DynamicHigh');
                break;
            case cmap_mmTickSize_06:
                string = languageFormat.getLanguage(10140, 'TickSize');
                break;
            case cmap_mmfieldShrIssue_05:
                string = languageFormat.getLanguage(10164, 'OutStdShare');
                break;
            default:
                string = "";
        }

        return string;
    },
    /**
     * reset this object all component items to default
     */
    resetFeedSetting: function () {
        this.page = 0;
        this.sort = 'vol';
        this.sectorcode = 10;
        this.compRef.btnEditDone.setText(languageFormat.getLanguage(10021, 'Edit'));
        this.compRef.btnEditDone.setIcon(ICON.EDIT);
        this.compRef.btnEditDone.toggle(false, true);
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

        if (columnModel != null && wlColSetting != null && wlColSetting != "") { // verify from main.jsp
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
//        
//        fieldList = fieldList;
//
//        var urlbuf = new Array();
//        urlbuf.push(addPath+'tcplus/field?');
//        urlbuf.push('s='+dwr.engine._scriptSessionId);
//        urlbuf.push('&l='+panel.stkcodes.join(','));
//        urlbuf.push('&f='+fieldList);
//        urlbuf.push('&t=q');
//
//        var url = urlbuf.join('');
//        Ext.Ajax.request({
//            url: url,
//            method: 'POST',
//            success: function(response) {
//                if (response != null) {
//                    var obj = null;
//                    try {
//                        obj = Ext.decode(response.responseText);
//                        panel.updateFeed(obj);
//                    } catch(e) {}
//                }
//            },
//            failure: function(response) {}
//        });
    },
    /**
     * Description <br/>
     * 
     * 		return grid panel on show column id
     * 
     * @return array
     */
    getFieldList: function (type) {
        var panel = this;

        var returnArray = new Array();
        var columns = helper.getGridColumns(panel);

        returnArray.push(fieldStkCode);
        returnArray.push(fieldStkName);
        returnArray.push(fieldStkFName);
        returnArray.push(fieldLast);		// last, change, change %		
        returnArray.push(fieldStatus);		// news, status
        returnArray.push(fieldSell);
        returnArray.push(fieldLacp);
        returnArray.push(fieldCurrency);
        returnArray.push(fieldPrev);
        returnArray.push(fieldLotSize);		// get the stock buy quantity, for trading use
        returnArray.push(fieldIndexCode);
        returnArray.push(field52WHigh_06);
        returnArray.push(field52WLow_06);
        returnArray.push(fieldIndexGrp_06);
        returnArray.push(fieldInstrument);
        returnArray.push(fieldShrIssue);

        var columnCount = columns.length;
        for (var i = 0; i < columnCount; i++) {
            var storeValue = null;
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
                } else {
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
         * showV1GUI == true
         * 
         * Buy 
         * Sell
         * Stock Info
         * Market Depth
         * Intraday Chart
         * Stock News
         * 
         * 
         * showV1GUI == false
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
            }, {
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
            },
            {
                id: panel.cMenuRmFrWatchlist,
                text: languageFormat.getLanguage(20006, 'Remove from Watchlist'),
                hidden: (global_personalizationTheme.indexOf("wh") != -1 ? false : true) || panel.recentQuote,
                popupOnly: true
            },
            {
                id: panel.cMenuRmFrRecent,
                text: languageFormat.getLanguage(20017, 'Remove from Recent Quote'),
                hidden: !panel.recentQuote,
                popupOnly: true
            },
            {
                id: panel.cMenuStockAlert,
                text: languageFormat.getLanguage(20602, 'Stock Alert'),
                hidden: settingSMSStockAlertURL.length > 0 ? false : true
            },
            {
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
                        case panel.cMenuEqTrackerId:
                            btn = panel.contextMenu.getComponent(panel.cMenuEqTrackerId);
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
                        case panel.cMenuRmFrWatchlist:
                            btn = panel.contextMenu.getComponent(panel.cMenuRmFrWatchlist);
                            btn.setHandler(func.func);
                            break;
                        case panel.cMenuRmFrRecent:
                            btn = panel.contextMenu.getComponent(panel.cMenuRmFrRecent);
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
     * 		block right click menu item 
     */
    disableRightFunction: function (stk) {	// applicable for outbound some exchange does not have data
        var panel = this;

        var intradayChartBtn = panel.contextMenu.getComponent(panel.cMenuChartId);
        var trackerBtn = panel.contextMenu.getComponent(panel.cMenuStkTrackerId);
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
    /**
     * Description <br/>
     * 
     * 		right click on grid panel row function
     * 
     * @param grid 	: Ext.Grid
     * @param ridx 	: int
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
        panel.cMenuRowIndex = ridx;

        panel.disableRightFunction(panel.cMenuStkCode);
        panel.contextMenu.showAt(e.getXY());
    },
    /**
     * Description <br/>
     * 
     * 		calculate text width
     * 
     * @param text   : string
     * 
     * @return double
     */
    calculateTextWidth: function (text) {
        var element = document.createElement('element');
        document.body.appendChild(element);
        element.style.fontSize = "" + cGridFSize + "pt";
        //element.style.fontStyle = "bold";
        element.style.display = "inline";
        element.style.fontFamily = "Helvetica,tahoma,verdana,arial";
        element.innerHTML = text;

        width = element.offsetWidth + 10; //to allowed some space of string

        document.body.removeChild(element);
        element = null;
        return width;
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
    onRowDblClick: function (func) {
        this.on("celldblclick", func);
    },
    /**
     * Description <br/>
     * 
     * 		verify the stock can be trade or not
     * 
     * @return boolean
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
    getViewExchangeList: function () { //1.3.25.34 get all exchange code
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
     * 		update / set grid panel "R/D" column tool tip		
     * 
     * @param tip : string
     */
    updateRDToolTip: function (tip) {
        var panel = this;

        try {
            var gridCols = helper.getGridColumns(panel);
            var idx = helper.getColumnIndex(gridCols, 'itemId', cmap_mmRD);
            if (idx != -1) {
                // panel.getColumnModel().setColumnTooltip(idx, '<B><U>MARKET DATA DISPLAY SERVICE</U></B><BR>' + tip);
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
        var allColumnId = global_WLAllColumn;
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
        var defaultColumnId = global_WLDefaultColumn;
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
        var currentColumnId = watchlistCol; // verify from main.jsp

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
        return colutils.filterColumnId(currentColumnId);
    },
    requiredColumnSetting: function () {
        return watchlistReqCol;
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
    },
    /**
     * Description <br/>
     * 
     * 		save column setting
     * 
     * @param showArray : array
     */
    saveColumn: function(newColumnId) {
        var panel = this;

        panel.reconfigure(null, panel.generateColumnsArray(panel.generateColumn(newColumnId)));
        panel.requestSaveColumns(newColumnId);
    },
    requestSaveColumns: function(newColumnId) {
        var panel = this;

        // update field id - call to server what column is display
        panel.changeField(panel.getFieldList());
        newColumnId = newColumnId + "~" + colutils.ColumnVersion;
        watchlistCol = newColumnId;  // watchlistCol is from main.js
        colutils.saveColumn(wlColSetting, newColumnId);
    },
    _procComponentId: function () {
        var panel = this;

        panel.cMenuBuyId = Ext.id();
        panel.cMenuSellId = Ext.id();
        panel.cMenuStkInfoId = Ext.id();
        panel.cMenuDepthId = Ext.id();
        panel.cMenuChartId = Ext.id();
        panel.cMenuStkNewsId = Ext.id();
        panel.cMenuArchiveNewsId = Ext.id();
        panel.cMenuElasticNewsId = Ext.id();
        panel.cMenuNikkeiNewsId = Ext.id();
        panel.cMenuEqTrackerId = Ext.id();
        panel.cMenuStkTrackerId = Ext.id();
        panel.cMenuHisDataId = Ext.id();
        panel.cMenuAnalysisId = Ext.id();
        panel.cMenuFundamentalCPIQId = Ext.id();
        panel.cMenuFundamentalThomsonReutersId = Ext.id();
        panel.cMenuAddStockAlertId = Ext.id();
        panel.cMenuOrderStatus = Ext.id();
        panel.cMenuWarrantsInfoId = Ext.id();
        panel.cMenuRmFrWatchlist = Ext.id();
        panel.cMenuRmFrRecent = Ext.id();
        panel.cMenuStockAlert = Ext.id();
        panel.cMenuPSEEdge = Ext.id();
    },
    // LAST REVIEW: Ratha Pov 2013-11-15
    _getDeleterColumn: function () {
        var me = this;
        var width = 40;
        if (global_personalizationTheme.indexOf("wh") != -1) {
            width = 20;
        }
        return {
            xtype: 'actioncolumn',
            width: width,
            align: 'center',
            sortable: false,
            dataIndex: 0,
            menuDisabled: true,
            hidden: N2N_CONFIG.useEditButton,
            draggable: false,
            itemId: 'deleter',
            locked: true,
            tdCls: 'adderRmCls',
            items: [
                {
                    iconCls: 'extensive-remove',
                    tooltip: me.recentQuote ? languageFormat.getLanguage(20017, 'Remove from Recent Quote') : languageFormat.getLanguage(20006, 'Remove from Watchlist'),
                    handler: function(view, rowIndex, colIndex, item, e, record) {
                        var stkcode = record.get(fieldStkCode);
                        if (me.recentQuote) {
                            removeFromRecent(me, stkcode, rowIndex);
                        } else {
                            removeFromWatchlist(me, stkcode, rowIndex);
                        }
                    }
                }
            ]
        };
    },
    _setCookieId: function() {
        var me = this;
        var ckName = '_RecentQuote';
        if (!me.recentQuote) {
            ckName = '_Watchlist_' + me.key;
        }
        me.wckId = cookieKey + ckName;
    },
    removeFromTempDatas: function(stkCode) {
        var me = this;

        if (me.tempDatas) {
            for (var i = 0; i < me.tempDatas.length; i++) {
                if (me.tempDatas[i][fieldStkCode] === stkCode) {
                    me.tempDatas.splice(i, 1);
                    return;
                }
            }
        }
    },
    updateKey: function(newKey, oldKey) {
        var me = this;

        // update title
        me.title = languageFormat.getLanguage(20001, 'Watchlist') + ' - ' + textToHtml(me.wlname);
        me.key = newKey;
        me.oldKey = oldKey;
        n2nLayoutManager.updateKey(me);
    },
    autoAdjustWidth: function() {
        var panel = this;
        
        panel.procColumnWidth();
        panel.reconfigure(null, panel.generateColumnsArray(panel.generateColumn("")));
        panel.tempWidth = cookies.toDefaultColumn(panel, panel.wckId);
        panel.isImgBlink = false;
        panel.runAutoAdjustWidth = false;
    },
    getColList: function() {
        var panel = this;

        var tempList = panel.getFieldList('all');
        tempList.push(fieldStkCode);
        tempList.push(fieldStkName);
        tempList.push(fieldStkFName);

        // for set the stock code and stock name to first column
        var newList = [];
        if (tempList.indexOf(fieldStkCode) != -1) {
            newList.push(fieldStkCode);
        }
        if (tempList.indexOf(fieldStkName) != -1) {
            newList.push(fieldStkName);
        }
        // to filter duplicate record
        for (var i = 0; i < tempList.length; i++) {
            var str = tempList[i];
            var sameRecord = false;
            for (var ii = 0; ii < newList.length; ii++) {
                if (str == newList[ii]) {
                    sameRecord = true;
                }
            }
            if (!sameRecord) {
                if (str != "0") {
                    newList.push(str);
                }
            }
        }

        return newList;
    },
    getCodeList: function(list) {
        var newStockList = [];
        if (outbound) {
            var outboundStkList = new Array();
            try {
                for (var i = 0; i < list.length; i++) {
                    var listStock = list[i];
                    var tmpV = listStock.split(".");
                    if (tmpV.length > 0) {
                        var tmpType = tmpV[tmpV.length - 1];
                        //var tmpChkType = tmpType.substring(tmpType.length, tmpType.length-1);
                        if (arExMapping && arExMapping.scpt) {
                            var scpts = arExMapping.scpt;
                            for (var j = 0; j < scpts.length; j++) {
                                var scpt = scpts[j];
                                if (scpt.ex && scpt.extype == "D") {
                                    if (scpt.ex == tmpType + "D") {
                                        newStockList.push(listStock + "D");
                                        break;
                                    }
                                } else if (scpt.ex && scpt.extype == "R") {
                                    if (scpt.ex == tmpType) {
                                        newStockList.push(listStock);
                                        break;
                                    }
                                }
                            }
                        } else {
                            newStockList.push(listStock);
                        }
                    } else {
                        newStockList.push(listStock);
                    }
                }
            } catch (e) {
            }
        } else {
            newStockList = list;
        }

        return newStockList;
    },
    addStock: function(stkcodes, pos) {
        var panel = this;

        if (stkcodes.length > 0) {
            // field list
            var fd = panel.getColList();
            // get data from storage
            var cacheRec = Storage.returnRecord(stkcodes[0]);
            var extraFd = [];

            if (!jsutil.isEmpty(cacheRec)) {
                for (var i = 0; i < fd.length; i++) {
                    if (cacheRec[fd[i]] == null) {
                        extraFd.push(fd[i]);
                    }
                }
            } else {
                cacheRec = {};
                extraFd = fd;
            }

            if (extraFd.length > 0) { // need to get more data
                // add stock code if it has been removed in the filter
                if (extraFd.indexOf(fieldStkCode) === -1) {
                    extraFd.push(fieldStkCode);
                }
                
                conn.getStockList({
                    f: extraFd,
                    c: 1,
                    list: stkcodes,
                    p: 0,
                    success: function(obj) {
                        if (obj.s) { // combine data
                            if (obj.d && obj.d.length > 0 && obj.d[0][fieldStkCode] === stkcodes[0]) {
                                Ext.apply(cacheRec, obj.d[0]);
                                obj.d[0] = cacheRec;
                                panel.procAppendRec(obj, pos);
                            } else if (!jsutil.isEmpty(cacheRec)) {
                                panel.procAppendRec({
                                    d: [cacheRec],
                                    s: true
                                }, pos);
                            }
                            
                            if (panel.suspendSwitchRefresh) {
                                panel.suspendSwitchRefresh = false;
                                panel.switchRefresh(true);
                            }
                        }
                    }
                });
            } else { // use cache
                if (!jsutil.isEmpty(cacheRec)) {
                    panel.procAppendRec({
                        d: [cacheRec],
                        s: true
                    }, pos);
                    
                    if (panel.suspendSwitchRefresh) {
                        panel.suspendSwitchRefresh = false;
                        panel.switchRefresh(true);
                    }
                }
            }
        }

    },
    procAppendRec: function(obj, pos) {
        var panel = this;

        if (obj.s) {
            obj.t = 'WatchList_' + panel.id;
            panel.updateSortHttp(obj, pos);
            if (panel.sortInfo != null) {
                // panel.getStore().sort(panel.sortInfo);
            }
        }
    },
    getStock: function(stkCode) {
        return this.store.findRecord(fieldStkCode, stkCode);
    },
    removeFromCache: function(stkCode) {
        var me = this;
        
        jsutil.arrayRemoveElement(me.fulllist, stkCode);
        jsutil.arrayRemoveElement(me.stkcodes, stkCode);
        me.removeFromTempDatas(stkCode);
    },
    removeStock: function(rowIdx, stkCode, updateSubscription) {
        var me = this;
        
        if (typeof(rowIdx) === 'object') { // model object
            me.store.remove(rowIdx);
        } else { // index
            me.store.removeAt(rowIdx);
        }
        
        me.removeFromCache(stkCode);
        helper.refreshView(me);
        
        if (updateSubscription) {
            Storage.generateUnsubscriptionByExtComp(me, true);
            Storage.generateSubscriptionByList(me.stkcodes, me);
        }
    },
    stockExists: function(stkcode) {
        return this.fulllist.indexOf(stkcode) > -1;
    },
    deleteStocks: function(stkcodes) {
        var me = this;
        var rmRec = [];
        var stkCodes = [];

        for (var i = 0; i < stkcodes.length; i++) {
            var code = stkcodes[i];
            var rec = me.store.findRecord(fieldStkCode, code); //me.stockExists(code);
            if (rec) {
                rmRec.push(rec);
                stkCodes.push(code);
            }
        }

        if (rmRec.length > 0) {
            me.store.remove(rmRec);
            for (var i = 0; i < stkCodes.length; i++) {
                me.removeFromCache(stkCodes[i]);
            }
        }
    },
    arrangeList: function(sortedList, oriList){
    	var obj= [];
    	for(var i=0; i<oriList.length; i++){
    		for(var j=0; j<sortedList.c; j++){
    			var data = sortedList.d[j];
        		if(oriList[i] == data[fieldStkCode]){
        			obj.push(data);
        		}	
    		}
    	}
    	
    	sortedList.d = obj;
    	return sortedList;
    },
    updateColWidthCache: function(column, newWidth) {
        helper.updateColWidthCache(this, this.wckId, column, newWidth);
    },
    clearRecentQuote: function() {
        var me = this;

        if (me.fulllist.length > 0) {
            msgutil.confirm(languageFormat.getLanguage(20008, 'Are you sure to clear recent quote?'), function(btn) {
                if (btn === 'yes') {
                    me.store.removeAll();
                    me.tempDatas = [];
                    me.fulllist = [];
                    me.stkcodes = [];

                    recentQuotePrfr.removeAll();
                    // save immediately
                    recentQuotePrfr.save();

                    // update subscription
                    Storage.generateUnsubscriptionByExtComp(me, true);
                    Storage.generateSubscriptionByList(me.stkcodes, me);
                }
            });
        }

    }
});
