Ext.define('TCPlus.view.quote.MarketDepth', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.marketdepth',
    exchangecode: '',
    stkcode: '',
    stkname: '',
    last: '',
    lacp: '',
    lotSize: 0,
    allColumn: [],
    retryCallAjax: 0,
    storageObj: null,
    market: 10, // store market code to set url parameter  -  Normal Board Lot, Buy In Board Lot
    sectorcode: 10, // store sector code to set url parameter  -  stock category
    tField_Search: null,
    tButton_back: null,
    bottomToolbar: null,
    tLabel: null,
    tLabel2: null,
    tLabel3: null,
    tLabel4: null,
    //Column save setting
    tooltip: null,
    columnHash: null,
    tempWidth: null,
    isImgBlink: false,
    thisPanelType: 'normal', // multi , normal
    onViewType: '',
//    showTitle: true,
    showSearch: true,
    type: "md",
    savingComp: true,
    ddComp: true,
    forceFit: true,
    tempButton_column: null,
    title: languageFormat.getLanguage(20022, 'Market Depth'),
    activeColumn: 0,
    settingWin: null,
    slcomp: "md",
    portConfig: {
        height: 235
    },
//    tConf: {
//        tab: 'tab2',
//        closable: false
//    },
    isMatrix: false,
    bts2NewMktDepthLvl: 5,
    mdLevel: 0,
    debug: false,
    border: false,
    _exchUpdated: false,
    feedScreen: true,
    initComponent: function() {
        var panel = this;
        
        panel.isGradient = marketDepthGradient;
        
        if (n2nLayoutManager.isPortalLayout() && Ext.isIE) {
            panel.portConfig = {
                height: 241
            };
        }
        if (n2nLayoutManager.isTabLayout() && N2N_CONFIG.configScreen) {
            panel.tConf.closable = true;
        }

        // column map
        // will be removed when standardize confMDColumnId=confMDAllColumn
        // here to support previous config
        panel._colMap = {
            level: cmap_mdNo,
            bidtrd: cmap_mdBSplit,
            bidcum: cmap_mdBCum,
            bidqty: cmap_mdBidQty,
            bidprice: cmap_mdBidPrice,
            askprice: cmap_mdAskPrice,
            askqty: cmap_mdAskQty,
            askcum: cmap_mdSCum,
            asktrd: cmap_mdSSplit
        };
        panel._idMap = {};
        panel._idMap[cmap_mdNo] = 'level';
        panel._idMap[cmap_mdBSplit] = 'bidtrd';
        panel._idMap[cmap_mdBCum] = 'bidcum';
        panel._idMap[cmap_mdBidQty] = 'bidqty';
        panel._idMap[cmap_mdBidPrice] = 'bidprice';
        panel._idMap[cmap_mdAskPrice] = 'askprice';
        panel._idMap[cmap_mdAskQty] = 'askqty';
        panel._idMap[cmap_mdSCum] = 'askcum';
        panel._idMap[cmap_mdSSplit] = 'asktrd';

        if (!panel.hasOwnProperty('showTotalBidAsk')) {
            panel.showTotalBidAsk = jsutil.toBoolean(showMktDepthTotal);
        }

        if (!panel.searchBoxWidth) {
            panel.searchBoxWidth = searchboxWidth;
        }

        panel.allColumn = global_MDAllColumn.split("~");
        panel.showSplit = panel.setVisibleColumn(cmap_mdBSplit) ? false : true;
        panel.showBcum = panel.setVisibleColumn(cmap_mdBCum) ? false : true;
        var fontsize = "10pt";
        var width = "49%";
        if (global_personalizationTheme.indexOf("wh") != -1) {
            fontsize = "8pt";
            width = "130px";
        }


        panel.storageObj = [];
        panel.tLabel = new Ext.form.Label({
            xtype: 'tbtext',
            hidden: true,
            text: '-',
            style: 'font-weight:bold; font-size: ' + fontsize + '; padding-right: 3px;'
        });

        panel.tLabel2 = new Ext.form.Label({
            xtype: 'tbtext',
            width: width,
            text: '-',
            style: 'font-weight:bold; font-size: ' + fontsize + ';text-align:left'
        });

        panel.tLabel3 = new Ext.form.Label({
            xtype: 'tbtext',
            hidden: true,
            text: '-',
            style: 'font-weight:bold; font-size: ' + fontsize + '; padding-right: 3px;'
        });

        panel.tLabel4 = new Ext.form.Label({
            width: width,
            xtype: 'tbtext',
            text: '-',
            align: 'right',
            style: 'font-weight:bold; font-size: ' + fontsize + ';text-align: right;'
        });


        panel.tField_Search = new Ext.form.TextField({
            tag: 'input',
            type: 'text',
            autocomplete: 'off',
            emptyText: languageFormat.getLanguage(10102, 'Symbol') + '/' + languageFormat.getLanguage(10101, 'Code'),
            selectOnFocus: true,
            width: panel.searchBoxWidth,
            listeners: {
                specialkey: function (thisField, e) {
                    // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                    // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN

                    if (e.getKey() == e.ESC) {
                        panel._procPanelInfo();

                    } else if (e.getKey() == e.ENTER) {
                        panel._procCallSearch();
                    }


                }
            }
        });

        panel.tButton_back = new Ext.Button({
            text: languageFormat.getLanguage(10027, 'Back'),
            hidden: true,
            icon: icoBtnBack,
            handler: function () {
                panel.bottomToolbar.isShowLabel(true, false);
                panel.refresh();
            }
        });
        var mainStore = Ext.create('Ext.data.Store', {
            model: 'TCPlus.model.MarketDepth'
        });

        panel.tempButton_column = new Ext.Button({
            text: languageFormat.getLanguage(20601, 'Settings'),
            tooltip: languageFormat.getLanguage(20601, 'Settings'),
            icon: icoBtnColumn,
            hidden: (showMDColButton == "TRUE" && !isMobile) ? false : true,
            handler: function () {
                panel.setting();
            }
        });
        
        this.topToolbar = Ext.create('Ext.toolbar.Toolbar', {
            hidden: !panel.showSearch,
            items: [
                panel.tField_Search,
                {
                    text: languageFormat.getLanguage(10007, 'Search'),
                    //  xtype: 'tbbutton',
                    icon: icoBtnSearch,
                    handler: function() {
                        panel._procCallSearch();
                    }
                },
                '->',
                panel.tempButton_column,
                {
                    id: 'saveSetting_MD_' + panel.getId(), //v1.3.33.27
                    icon: iconBtnSaveSetting,
                    hidden: true,
                    handler: function() {
                        msgutil.confirm(languageFormat.getLanguage(30008, 'You have unsaved settings. Would you like to save your settings?'),
                                function(sResp) {
                                    if (sResp == "yes") {
                                        panel.isImgBlink = false;
                                        cookies.procCookie(panel.mdckId, panel.tempWidth, cookieExpiryDays);
                                        panel.tempWidth = cookies.toDefaultColumn(panel, panel.mdckId);
                                    } else {
                                        panel.isImgBlink = false;
                                    }
                                }
                        );
                    }
                },
                panel.tButton_back
            ],
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll
        });
        this.bottomToolbar = new Ext.Toolbar({
            hidden: !panel.showTotalBidAsk,
            enableOverflow: menuOverflow,
            autoScroll: menuAutoScroll,
            isShowLabel: function(LabelBoolean, buttonBoolean) {
                if (LabelBoolean) {
                    helper.setHtml(panel.tLabel, languageFormat.getLanguage(10507, 'Total Bid') + ' : ');
                    helper.setHtml(panel.tLabel2, '-');
                    helper.setHtml(panel.tLabel3, languageFormat.getLanguage(10508, 'Total Ask') + ' : ');
                    helper.setHtml(panel.tLabel4, '-');

                } else {
                    helper.setHtml(panel.tLabel, '');
                    helper.setHtml(panel.tLabel2, '');
                    helper.setHtml(panel.tLabel3, '');
                    helper.setHtml(panel.tLabel4, '');
                }

                if (buttonBoolean) {
                    panel.tButton_back.show();
                } else {
                    panel.tButton_back.hide();
                }
            },
            items: [
                panel.tLabel,
                panel.tLabel2,
                '->',
                panel.tLabel3,
                panel.tLabel4
            ]
        });

        Ext.apply(this, {
            store: mainStore,
            columns: [],
            enableColumnMove: false,
            enableColumnResize: true,
            header: false,
            viewConfig: {
                markDirty: false,
                trackOver: true,
                style: 'overflow-y:auto!important;overflow-x:hidden!important;' // hide horizontal scroll since forceFit is used
            },
            cls: 'fix_width',
            listeners: {
                show: function (thisComp) {

                    panel.refresh();
                },
                afterrender: function (thisComp) {
                    panel.tooltip = new Ext.ToolTip({//v1.3.33.27
                        target: 'saveSetting_MD_' + panel.getId(),
                        html: languageFormat.getLanguage(30009, 'Click this blinking icon to save the adjusted column width.'),
                        anchor: 'top',
                        showDelay: 0
                    });
                },
                celldblclick: function (thisComp, td, cellIndex, record, tr, rowIndex, e) {
                    if (panel.onViewType != 'search') {
                        closedOrderPad = false;
                        panel._procGridClick(cellIndex, record);
                    }
                },
                cellclick: function (thisComp, td, cellIndex, record, tr, rowIndex, e) {
                    if (panel.onViewType == 'search') {
                        panel._procGridClick(cellIndex, record);
                    } else {
                        if (N2N_CONFIG.singleClickMode) {
                            panel._procGridClick(cellIndex, record);
                        }
                    }
                },
                columnresize: function (ct, column, newWidth, eOpts) {
                    if (global_allowCookies == "TRUE" && column.width != null) {
                        var colId = stockutil.stripItemId(panel.getId(), column.getItemId());
                        panel.tempWidth = cookies.procTempCookies(panel, panel.mdckId, panel._idMap[colId], newWidth);
                        //panel.callImageBlink();
                        cookies.procCookie(panel.mdckId, panel.tempWidth, cookieExpiryDays);
                    }
                },
                beforedestroy: function () {
                    if (mdSetting) {
                        mdSetting.destroy();
                    }
                }
            },
            tbar: this.topToolbar,
            bbar: this.bottomToolbar
        });
        this.callParent();
    },
    switchRefresh: function () {
        var panel = this;

        if(panel.onViewType != 'search'){
        	panel.refresh();
        }
        
    },
    _getWidth: function (columnID) {
        var panel = this;
        var returnObj = {};
        returnObj.value = 50;
        returnObj.status = false;

        if (columnID != '') {
            var value = panel.columnHash.get(columnID);
            if (value != null) {
                returnObj.value = parseFloat(value);
                returnObj.status = true;
            }
        }

        return returnObj;
    },
    createMarketDepth: function (stkcode, stkname, refreshMD) {
        var me = this;

        if (me.stkcode != stkcode) {
            this.setStkCode(stkcode);
            this.setStkName(stkname);
            n2nLayoutManager.updateKey(this);
            refreshMD = true;
        }

        if (refreshMD) {
            this.refresh();
        }
    },
    callImageBlink: function () { //v1.3.33.27
        var panel = this;
        var btn = Ext.getCmp('saveSetting_MD_' + panel.getId());
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
        
        if (!panel._exchUpdated) {
            return;
        }

        panel.columnHash = new N2NHashtable();
        var columnID;
        var columnWidth;
        panel._setCookieId();

        if (cookies.isCookiesExist(panel.mdckId)) {
            var temp = cookies.getCookies(panel.mdckId);
            columnID = temp[0];
            columnWidth = temp[1];

        } else {
            columnID = global_MDColumnID;

            switch (stockutil.removeDelayChar(panel.exchangecode)) {
                case 'KL':
                    columnWidth = global_MDWidthKL;
                    break;
                case 'MY':
                    columnWidth = global_MDWidthMY;
                    break;
                case 'HK':
                    columnWidth = global_MDWidthHK;
                    break;
                default:
                    columnWidth = global_MDWidthOth;
                    break;
            }

            var tempInfo = [columnID, columnWidth];
            var tempCookie = tempInfo.join(',');
            cookies.setTempStorage(panel, tempCookie);
        }


        var IDArray = columnID.split('|');
        var widthArray = columnWidth.split('|');

        for (var x in IDArray) {
            (panel.columnHash).put(panel._colMap[IDArray[x]], parseInt(widthArray[x]));
        }
    },
    /**
     * Description <br/>
     *
     * 		process set column model
     *
     * @param {string} type
     */
    _procColumnModel: function (type) {
        var panel = this;
        // var mainColumnModel = panel.getColumnModel();
        if (!panel) {
            return;
        }
        try {
            var row = 0;

            var lum = 0.1;

            if (panel.isGradient != "gradient") {
                if (panel.hasCls("marketdepth")) {
                    panel.removeCls("marketdepth");
                }
            } else if (!isMobile) {
                if (!panel.hasCls("marketdepth")) {
                    panel.addCls("marketdepth");
                }
            }

            var marketDepthGridFun = function (thisDataIndex, value, meta) {
                var cssClass = N2NCSS.CellDefault;
                var style = "";
                var colWidth = panel._getWidth(thisDataIndex)['value'];

                if (panel.isGradient == "gradient" && !isMobile) {
                    if (thisDataIndex == cmap_mdBSplit || thisDataIndex == cmap_mdBCum || thisDataIndex == cmap_mdBidQty || thisDataIndex == cmap_mdBidPrice) {
                        style = "background-color:" + panel._colorLuminance(panel._getGradientBuyColor(), row * lum);

                    } else if (thisDataIndex == cmap_mdSSplit || thisDataIndex == cmap_mdSCum || thisDataIndex == cmap_mdAskQty || thisDataIndex == cmap_mdAskPrice) {
                        style = "background-color:" + panel._colorLuminance(panel._getGradientSellColor(), row * lum);
                    }
                }
                if (thisDataIndex == cmap_mdNo) {

                    if (value != null) {
                        if (value.toString() != '') {
                            if (value.toString() != '###') {
                                value = parseFloat(value) + 1;
                            } else {
                                value = '';
                            }
                        }

                    }

                } else if (thisDataIndex == cmap_mdBSplit) {
                    cssClass += " " + N2NCSS.FontString;

                    cssClass += " " + N2NCSS.FontUnChange;

                    value = (value != '-') ? formatutils.formatNumberLot(value) : '-';

                } else if (thisDataIndex == cmap_mdBCum) {
                    cssClass += " " + N2NCSS.FontString;
                    if (isNumberYellowColumn) {
                        cssClass += " " + N2NCSS.FontUnChange_yellow;
                    } else {
                        cssClass += " " + N2NCSS.FontUnChange;
                    }
                    value = (value != '-' && value != 0) ? formatutils.formatNumberLot(value, panel.qtyFormat, colWidth) : '-';


                } else if (thisDataIndex == cmap_mdBidQty) {
                    cssClass += " " + N2NCSS.FontString;
                    if (isNumberYellowColumn) {
                        cssClass += " " + N2NCSS.FontUnChange_yellow;
                    } else {
                        cssClass += " " + N2NCSS.FontUnChange;
                    }

                    value = (value != '-') ? formatutils.formatNumberLot(value, panel.qtyFormat, colWidth) : '-';


                } else if (thisDataIndex == cmap_mdBidPrice || thisDataIndex == cmap_mdAskPrice) {
                    cssClass += " " + N2NCSS.FontString;

                    if (isMO(value)) {
                        value = 'MO';

                    } else if (isMP(value)) {
                        value = 'MP';

                    } else {

                        if (parseFloat(value) > parseFloat(panel.lacp))
                            cssClass += " " + N2NCSS.FontUp;

                        else if (parseFloat(value) < parseFloat(panel.lacp) && parseFloat(value) != 0)
                            cssClass += " " + N2NCSS.FontDown;

                        else
                            cssClass += " " + N2NCSS.FontUnChange;
                    }

                } else if (thisDataIndex == cmap_mdAskQty) {
                    cssClass += " " + N2NCSS.FontString;
                    if (isNumberYellowColumn) {
                        cssClass += " " + N2NCSS.FontUnChange_yellow;
                    } else {
                        cssClass += " " + N2NCSS.FontUnChange;
                    }

                    value = (value != '-') ? formatutils.formatNumberLot(value, panel.qtyFormat, colWidth) : '-';

                }
                else if (thisDataIndex == cmap_mdSCum) {
                    cssClass += " " + N2NCSS.FontString;
                    if (isNumberYellowColumn) {
                        cssClass += " " + N2NCSS.FontUnChange_yellow;
                    } else {
                        cssClass += " " + N2NCSS.FontUnChange;
                    }
                    value = (value != '-' && value != 0) ? formatutils.formatNumberLot(value, panel.qtyFormat, colWidth) : '-';

                } else if (thisDataIndex == cmap_mdSSplit) {
                    cssClass += " " + N2NCSS.FontString;
                    cssClass += " " + N2NCSS.FontUnChange;
                    value = (value != '-') ? formatutils.formatNumberLot(value) : '-';

                } else {
                    cssClass += " " + N2NCSS.FontString;
                    cssClass += " " + N2NCSS.FontUnChange;

                }


                meta.css = cssClass;
                meta.style = style;

                return value;
            };

            var labelName = function (type, indexNumber) {
                var returnLabel = '';
                if (type == 'normal' || type == 'multi') {


                    switch (indexNumber) {
                        case cmap_mdNo:
                            returnLabel = languageFormat.getLanguage(10501, 'No.');
                            break;
                        case cmap_mdBSplit:
                            returnLabel = languageFormat.getLanguage(10502, '#');
                            break;
                        case cmap_mdBCum:
                            returnLabel = languageFormat.getLanguage(10503, 'BCum');
                            break;
                        case cmap_mdBidQty:
                            returnLabel = languageFormat.getLanguage(10504, 'B.Qty');
                            break;
                        case cmap_mdBidPrice:
                            returnLabel = languageFormat.getLanguage(10110, 'Bid');
                            break;
                        case cmap_mdAskPrice:
                            returnLabel = languageFormat.getLanguage(10111, 'Ask');
                            break;
                        case cmap_mdAskQty:
                            returnLabel = languageFormat.getLanguage(10505, 'A.Qty');
                            break;
                        case cmap_mdSCum:
                            returnLabel = languageFormat.getLanguage(10506, 'SCum');
                            break;
                        case cmap_mdSSplit:
                            returnLabel = languageFormat.getLanguage(10502, '#');
                            break;
                    }

                } else if (type == 'search') {
                    switch (indexNumber) {
                        case 0:
                            returnLabel = languageFormat.getLanguage(10101, 'Code');
                            break;
                        case 1:
                            returnLabel = languageFormat.getLanguage(10701, 'Name');
                            break;
                        case 2:
                            returnLabel = languageFormat.getLanguage(20301, 'Exchange');
                            break;
                    }
                }
                return returnLabel;
            };

            var mdId = panel.getId();
            panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
            var column = [];
            if (type == 'normal' || type == 'multi') {
                panel.thisPanelType = type;
                panel.onViewType = type;
                var numbercol = 9;

                // for (var i = 0; i < 7; i++) {
                for (var i = 0; i < numbercol; i++) {
                    var columnInfo = panel._getWidth(panel.allColumn[i]);
                    var columnWidth = columnInfo.value;

                    var colObj = {
                        itemId: mdId + panel.allColumn[i],
                        text: labelName(type, panel.allColumn[i]),
                        dataIndex: panel.allColumn[i],
                        sortable: false,
                        menuDisabled: true,
                        resizable: true,
                        hidden: panel.setVisibleColumn(panel.allColumn[i]),
                        width: columnWidth,
                        align: 'right',
                        renderer: function (value, meta, record, rowIndex, columnIndex, store, view) {
                            row = rowIndex;
                            return marketDepthGridFun(panel.allColumn[columnIndex], value, meta);
                        }
                    };

                    if (i == 0) {
                        colObj.maxWidth = 30;
                    }
                    if (i == 1 || i == 8) {
                        colObj.maxWidth = 45;
                    }

                    column.push(colObj);
                }
                if (type == "multi") {
                    panel.getView().scrollOffset = 20;
                } else {
                    panel.getView().scrollOffset = 0;
                }

                panel.reconfigure(null, column);
                if (panel.tempButton_column && showMDColButton == "TRUE" && !isMobile) {
                    if (panel.tempButton_column.isHidden()) {
                        panel.tempButton_column.show();
                    }
                }
                
                panel.bottomToolbar.isShowLabel(true, false);
            } else if (type == 'search') {
                panel.onViewType = 'search';
                if (panel.hasCls("marketdepth")) {
                    panel.removeCls("marketdepth");
                }


                for (var i = 0; i < 2; i++) {
                    column.push({
                        itemId: 'column_' + i,
                        text: labelName('search', i),
                        dataIndex: 'column_' + i,
                        flex: 1,
                        css: '',
                        sortable: false,
                        menuDisabled: true,
                        renderer: function (value, meta, record, rowIndex, columnIndex, store) {

                            var cssClass = N2NCSS.CellDefault;
                            cssClass += " " + N2NCSS.FontString;
                            cssClass += " " + N2NCSS.FontUnChange;
                            meta.css = cssClass;
                            return value;
                        }
                    });
                }

                //    panel.getView().scrollOffset = 25;

                //mainColumnModel.setConfig(column, false);
                panel.reconfigure(null, column);

                if (panel.tempButton_column && showMDColButton == "TRUE" && !isMobile) {
                    if (!panel.tempButton_column.isHidden()) {
                        panel.tempButton_column.hide();
                    }
                }
                
                panel.bottomToolbar.isShowLabel(false, true);
            }
        } catch (e) {
            console.log("[marketdepth][_procColumnModel] Exception ---> " + e);
        }

    },
    _procPanelInfo: function () {
        var panel = this;

        var stkName = panel.stkname ? stockutil.getStockPart(panel.stkname) : '';
        if (!panel.isMatrix) {
            var newTitle = languageFormat.getLanguage(20022, 'Market Depth');
            if (stkName !== '') {
                newTitle += ' - ' + stkName;
            }
            n2nLayoutManager.updateTitle(panel, newTitle);
            compAddRecent(panel, panel.stkcode);
            } else {
            if (panel.type == 'depthorderpad') {
                /* move into orderpad for faster update title
                var pcomp = panel.findParentByType('window');
                if (pcomp) {
                    var newTitle = '';
                    if (stkName !== '') {
                        newTitle = languageFormat.getLanguage(30243, 'Order @ [PARAM0]', stkName);
                    } else {
                        newTitle = languageFormat.getLanguage(30214, 'Please select a symbol');
                    }
                    pcomp.setTitle(newTitle);
                }
                */
            } else {
                panel.tField_Search.setRawValue(htmlDecode(stkName));
            }
        }

    },
    _procCallNormalType: function () {
        var panel = this;

        conn.getStockInfo({
            k: panel.stkcode,
            f: panel.getFieldList(),
            success: function (res) {
                if (res.s && res.d && res.d.length > 0) {
                    var dataObj = res.d[0];
                    var lotSize = dataObj[fieldLotSize];
                    if (lotSize && global_displayUnit.toLowerCase() == 'lot') {
                        for (var i = 0; i < MD_QTY_COL.length; i++) {
                            if (dataObj[MD_QTY_COL[i]]) {
                                dataObj[MD_QTY_COL[i]] /= lotSize;
                            }
                        }
                    }

                    panel._updateNormalType(dataObj);
                    Storage.generateUnsubscriptionByExtComp(panel, true);
                    Storage.generateSubscriptionByList([panel.stkcode], panel);
                    panel.setDepthMatrixFirstLoad();
                }

                panel.setLoading(false);
            }
        });
    },
    /**
     * Description <br/>
     *
     * 		load 5 level market depth result into Ext.Store / Ext.grid
     *
     * @param {object} dataObj
     */
    _updateNormalType: function (dataObj) {
        var panel = this;

        panel._procPanelInfo();

        if (dataObj && dataObj[fieldStkCode] == panel.stkcode) {
            try {
                panel.last = dataObj[fieldLast] || 0;
                panel.lacp = dataObj[fieldLacp] || 0;
                panel.lotSize = dataObj[fieldLotSize] || 1;

                var array = [];

                var finalTotalObj = {};
                finalTotalObj.level = 'normal_5';
                finalTotalObj[ cmap_mdNo ] = '###';
                var bcum = 0;
                var scum = 0;
                for (var i = 0; i < 5; i++) {
                    var tempRecord = panel._returnCellInfo(i, null, null);
                    var jsonObj = {};
                    jsonObj.level = 'normal_' + i;
                    jsonObj[cmap_mdNo] = i;

                    if (tempRecord.validate) {
                        for (var ii = 0; ii < tempRecord.data.length; ii++) {
                            var key = tempRecord.data[ ii ];

                            if (dataObj[ key ] != null) {
                                jsonObj[ panel.allColumn[ii + 1] ] = dataObj[ key ];

                            } else {
                                jsonObj[ panel.allColumn[ii + 1] ] = '-';

                                if ((ii + 1) === panel.allColumn.indexOf(cmap_mdBCum)) {
                                    var k = tempRecord.data[2];
                                    var bQty = isNaN(dataObj[k]) ? 0 : parseFloat(dataObj[k]);
                                    var rBcum = '-';
                                    if (bQty != 0) {
                                        bcum += bQty;
                                        rBcum = bcum;
                                        jsonObj[panel.allColumn[ii + 1]] = rBcum;
                                    }
                                } else if ((ii + 1) === panel.allColumn.indexOf(cmap_mdSCum)) {
                                    
                                    var k = tempRecord.data[5];
                                    var sQty = isNaN(dataObj[k]) ? 0 : parseFloat(dataObj[k]);
                                    var rScum = '-';
                                    if (sQty != 0) {
                                        scum += sQty;
                                        rScum = scum;
                                        jsonObj[panel.allColumn[ii + 1]] = rScum;
                                }
                            }
                            }

                            finalTotalObj[panel.allColumn[ii + 1]] = '0';
                        }
                    }
                    array.push(jsonObj);

                }

                if (panel.showTotalBidAsk) {
                    array.push(finalTotalObj);
                }
                panel.storageObj = array;
                panel.store.loadData(array);
                // calcuates total immediately
                panel._updateNormalTotal();
                panel.updateOrderPriceList();
            } catch (e) {
                console.log('[marketDepth][_updateNormalType] Exception ---> ' + e);
            }
        }
    },
    /**
     * Description <br/>
     *
     * 		set stock code
     *
     * @param {string} str
     */
    setStkCode: function (str) {
        var me = this;

        me.stkcode = str;
        if (me.key) {
            me.oldKey = me.key;
        }
        me.key = str;
        var prevExch = this.exchangecode;
        me.exchangecode = stockutil.getExchange(me.stkcode);
        if (prevExch != this.exchangecode) {
            me._exchUpdated = true;
        } else {
            me._exchUpdated = false;
        }
    },
    /**
     * Description <br/>
     *
     * 		set stock name
     *
     * @param {string} str
     */
    setStkName: function (str) {
        this.stkname = str;
    },
    getFieldList: function () {
        var fieldList = new Array();
        fieldList.push(fieldStkCode);
        fieldList.push(fieldStkName);

        fieldList.push(fieldBSplit);
        fieldList.push(fieldBSplit2);
        fieldList.push(fieldBSplit3);
        fieldList.push(fieldBSplit4);
        fieldList.push(fieldBSplit5);

        fieldList.push(fieldBqty);
        fieldList.push(fieldBqty2);
        fieldList.push(fieldBqty3);
        fieldList.push(fieldBqty4);
        fieldList.push(fieldBqty5);

        fieldList.push(fieldBuy);
        fieldList.push(fieldBuy2);
        fieldList.push(fieldBuy3);
        fieldList.push(fieldBuy4);
        fieldList.push(fieldBuy5);

        fieldList.push(fieldSqty);
        fieldList.push(fieldSqty2);
        fieldList.push(fieldSqty3);
        fieldList.push(fieldSqty4);
        fieldList.push(fieldSqty5);

        fieldList.push(fieldSell);
        fieldList.push(fieldSell2);
        fieldList.push(fieldSell3);
        fieldList.push(fieldSell4);
        fieldList.push(fieldSell5);

        fieldList.push(fieldSSplit);
        fieldList.push(fieldSSplit2);
        fieldList.push(fieldSSplit3);
        fieldList.push(fieldSSplit4);
        fieldList.push(fieldSSplit5);

        fieldList.push(fieldLotSize);
        fieldList.push(fieldLast);
        fieldList.push(fieldLacp);
        fieldList.push(fieldPrev);
        fieldList.push(fieldInstrument);
        fieldList.push('255'); // hardcode to avoid 50 level checking

        return fieldList;
    },
    _procCallMultiType: function () {
        var panel = this;
        panel.bottomToolbar.isShowLabel(true, false);

        panel._procCallMultiTypeAjax();
    },
    _procCallMultiTypeAjax: function () {
        var panel = this;

        var requestObj = {
            k: panel.stkcode,
            success: function (arrObj) {
                if (arrObj) {
                    panel._updateMultiType(arrObj);
                    Storage.generateUnsubscriptionByExtComp(panel, true);
                    Storage.generateSubscriptionByList([panel.stkcode], panel);
                    panel.setDepthMatrixFirstLoad();
                }
                panel.setLoading(false);
            }
        };

        // market depth level
        if (N2N_CONFIG.BTS2MDLSetting) {         
        	if(mdlExList.length > 0){
        		var mdlList = mdlExList.split('|');
        		for (var i = 0; i < mdlList.length; i++) {
            		var mdlObj = mdlList[i].split('_');
            		var mdlEx = mdlObj[0];
            		var mdlLevel = mdlObj[1];
        			if (this.exchangecode == mdlEx) {
        				requestObj.l = mdlLevel;
        				panel.mdLevel = mdlLevel;
        				break;
        			}
        		}
        	}else{
        		/*
        		if (this.exchangecode == 'SI' || this.exchangecode == 'SG'
        			|| this.exchangecode == 'SID' || this.exchangecode == 'SGD'
        				|| this.exchangecode == 'PH' || this.exchangecode == 'PHD') {
        			requestObj.l = N2N_CONFIG.mdLevel;
        			panel.mdLevel = N2N_CONFIG.mdLevel;
        		}else{
        		*/
        			requestObj.l = panel.bts2NewMktDepthLvl;
        			panel.mdLevel = panel.bts2NewMktDepthLvl;
        		//}
        	}
        } 

        var tempRecord = Storage.returnRecord(panel.stkcode);
        if (tempRecord && tempRecord[fieldLacp] && tempRecord[fieldLotSize]) {
            panel.lotSize = tempRecord[fieldLotSize];
            panel.lacp = tempRecord[fieldLacp];
            conn.getMDL(requestObj);
        } else {
            conn.getStockInfo({
                k: panel.stkcode,
                f: [fieldStkCode, fieldLotSize, fieldLacp],
                success: function (res) {
                    if (res.s && res.d.length > 0) {
                        var dObj = res.d[0];
                        panel.lotSize = dObj[fieldLotSize] || 1;
                        panel.lacp = dObj[fieldLacp] || 0;
                        conn.getMDL(requestObj);
                    }
                }
            });
        }
    },
    /**
     * Description <br/>
     *
     * 		update 5 level market depth record
     *
     * @param {object} dataObj
     */
    _updateNormalRecord: function (dataObj) {
        var panel = this;

        try {
            for (var i = 0; i < 5; i++) {
                var tempRecordId = panel._returnCellInfo(i, null, null);
                var storeRecord = panel.store.getAt(i);

                for (var ii = 0; ii < tempRecordId[ 'data' ].length; ii++) {

                    if (dataObj[ tempRecordId[ 'data' ][ ii ] ] != null) {
                        var newValue = dataObj[ tempRecordId[ 'data' ][ ii ] ];

                        if (parseFloat(storeRecord.get(panel.allColumn [ii + 1])) != parseFloat(newValue)) {

                            if (panel.allColumn [ii + 1] == cmap_mdBidQty) {

                                if (isMO(newValue)) {
                                    newValue = 'MO';

                                } else if (isMP(newValue)) {
                                    newValue = 'MP'
                                }

                            } else if (panel.allColumn [ii + 1] == cmap_mdBidPrice) {

                                if (isMO(newValue)) {
                                    newValue = 'MO';

                                } else if (isMP(newValue)) {
                                    newValue = 'MP'
                                }
                            }

                            panel._updateGridCell(i, (ii + 1), newValue, 'up');
                        }
                    }
                }
            }

            panel._updateNormalTotal();
        } catch (e) {
            console.log('[marketDepth][_updateNormalRecord] Exception ---> ' + e.stack);
        }
    },
    _updateNormalTotal: function () {
        var panel = this;

        if (panel.showTotalBidAsk) {
            var column_1 = 0;
            var column_2 = 0;
            var column_3 = 0;
            var column_4 = 0;
            var column_5 = 0;
            var column_6 = 0;
            var column_7 = 0;
            var column_8 = 0;
            var decimalPlace = 3;

            var totalBid = 0;
            var totalAsk = 0;

            var hasMO_BidPrice = false;
            var hasMP_BidPrice = false;

            var hasMO_AskPrice = false;
            var hasMP_AskPrice = false;

            for (var i = 0; i < panel.storageObj.length; i++) {
                var recordObj = panel.storageObj[ i ];

                if (recordObj[cmap_mdNo ] != '###') {

                    column_1 = column_1 + (isNaN(parseFloat(recordObj[ cmap_mdBSplit ])) ? 0 : parseFloat(recordObj[ cmap_mdBSplit ])); // bid : split
                    column_2 = column_2 + (isNaN(parseFloat(recordObj[ cmap_mdBCum ])) ? 0 : parseFloat(recordObj[ cmap_mdBCum  ])); // bid : cum
                    column_3 = column_3 + (isNaN(parseFloat(recordObj[ cmap_mdBidQty ])) ? 0 : parseFloat(recordObj[ cmap_mdBidQty ])); // bid : qty
                    column_4 = column_4 + (isNaN(parseFloat(recordObj[ cmap_mdBidPrice ])) ? 0 : parseFloat(recordObj[ cmap_mdBidPrice ])); // bid : price
                    column_5 = column_5 + (isNaN(parseFloat(recordObj[ cmap_mdAskPrice ])) ? 0 : parseFloat(recordObj[ cmap_mdAskPrice ])); // ask : price
                    column_6 = column_6 + (isNaN(parseFloat(recordObj[ cmap_mdAskQty ])) ? 0 : parseFloat(recordObj[ cmap_mdAskQty ])); // ask : qty
                    column_7 = column_7 + (isNaN(parseFloat(recordObj[ cmap_mdSCum ])) ? 0 : parseFloat(recordObj[ cmap_mdSCum ])); // ask : cum
                    column_8 = column_8 + (isNaN(parseFloat(recordObj[ cmap_mdSSplit ])) ? 0 : parseFloat(recordObj[ cmap_mdSSplit ])); // ask : split


                    var tempTotalBid = 0;
                    var tempTotalAsk = 0;

                    if (isMO(recordObj[ cmap_mdBidPrice ])) {
                        hasMO_BidPrice = true;

                    } else if (isMP(recordObj[ cmap_mdBidPrice ])) {
                        hasMP_BidPrice = true;

                    } else {
                        tempTotalBid = parseFloat(recordObj[ cmap_mdBidPrice ]) * parseFloat(recordObj[ cmap_mdBidQty ]);

                        if ((recordObj[ cmap_mdBidPrice ].toString()).indexOf('.') != -1) {
                            var temp = (recordObj[ cmap_mdBidPrice ].toString()).substring((recordObj[ cmap_mdBidPrice ].toString()).indexOf('.') + 1, recordObj[ cmap_mdBidPrice ].toString().length);
                            decimalPlace = temp.length;
                        }
                    }

                    if (isMO(recordObj[ cmap_mdAskPrice ])) {
                        hasMO_AskPrice = true;

                    } else if (isMP(recordObj[ cmap_mdAskPrice ])) {
                        hasMP_AskPrice = true;

                    } else {
                        tempTotalAsk = parseFloat(recordObj[ cmap_mdAskPrice ]) * parseFloat(recordObj[ cmap_mdAskQty ]);
                    }

                    if (!isNaN(tempTotalBid)) {
                        totalBid += tempTotalBid;
                    }

                    if (!isNaN(tempTotalAsk)) {
                        totalAsk += tempTotalAsk;
                    }


                }
            }

            var storeRecord = panel.store.getAt(5);

            if (storeRecord.get(cmap_mdBSplit) != column_1) { // bid : split
                panel._updateGridCell(5, panel.allColumn.indexOf(cmap_mdBSplit), column_1, 'up');
            }
            if (storeRecord.get(cmap_mdBidQty) != column_3) { // bid : qty
                panel._updateGridCell(5, panel.allColumn.indexOf(cmap_mdBidQty), column_3, 'up');

            }

            var tempResultBid = parseFloat(totalBid / column_3).toFixed(decimalPlace);
            if (storeRecord.get(cmap_mdBidPrice) != tempResultBid) { // bid : price
                if (isNaN(tempResultBid)) {
                    panel._updateGridCell(5, panel.allColumn.indexOf(cmap_mdBidPrice), parseFloat(0).toFixed(decimalPlace), 'up');
                } else {
                    panel._updateGridCell(5, panel.allColumn.indexOf(cmap_mdBidPrice), parseFloat(tempResultBid).toFixed(decimalPlace), 'up');
                }
            }

            var tempResultAsk = parseFloat(totalAsk / column_6).toFixed(decimalPlace);
            if (storeRecord.get(cmap_mdAskPrice) != tempResultAsk) { // ask : price
                if (isNaN(tempResultAsk)) {
                    panel._updateGridCell(5, panel.allColumn.indexOf(cmap_mdAskPrice), parseFloat(0).toFixed(decimalPlace), 'up');
                } else {
                    panel._updateGridCell(5, panel.allColumn.indexOf(cmap_mdAskPrice), parseFloat(tempResultAsk).toFixed(decimalPlace), 'up');
                }
            }
            if (storeRecord.get(cmap_mdAskQty) != column_6) { // ask : qty
                panel._updateGridCell(5, panel.allColumn.indexOf(cmap_mdAskQty), column_6, 'up');
            }
            if (storeRecord.get(cmap_mdSSplit) != column_8) { // ask : split
                panel._updateGridCell(5, panel.allColumn.indexOf(cmap_mdSSplit), column_8, 'up');
            }
            /*
             if (storeRecord.get('column_2') != column_2) { // bid : cum
             panel._updateGridCell(5, 2, column_2, 'up');
             }
             if (storeRecord.get('column_7') != column_7) { // ask : cum
             panel._updateGridCell(5, 7, column_7, 'up');
             }
             */
            if (!hasMO_BidPrice && !hasMP_BidPrice) {
                if (global_displayUnit.toLowerCase() == "lot") // v1.3.34.68
                    helper.setHtml(panel.tLabel2, languageFormat.getLanguage(10507, 'Total Bid') + ': ' + formatutils.formatNumber(parseFloat(totalBid * panel.lotSize).toFixed(0)));
                else
                    helper.setHtml(panel.tLabel2, languageFormat.getLanguage(10507, 'Total Bid') + ': ' + formatutils.formatNumber(parseFloat(totalBid).toFixed(0)));
            } else
                helper.setHtml(panel.tLabel2, '-');


            if (!hasMO_AskPrice && !hasMP_AskPrice) {

                if (global_displayUnit.toLowerCase() == "lot") // v1.3.34.68
                    helper.setHtml(panel.tLabel4, languageFormat.getLanguage(10508, 'Total Ask') + ': ' + formatutils.formatNumber(parseFloat(totalAsk * panel.lotSize).toFixed(0)));
                else
                    helper.setHtml(panel.tLabel4, languageFormat.getLanguage(10508, 'Total Ask') + ': ' + formatutils.formatNumber(parseFloat(totalAsk).toFixed(0)));

            } else
                helper.setHtml(panel.tLabel4, '-');

        }
    },
    /**
     * Description <br/>
     *
     * 		update record data
     *
     * @param {json} dataObj
     */
    updateFeedRecord: function (dataObj) {
        var panel = this;

        if (dataObj != null && dataObj[fieldStkCode] == panel.stkcode) {
            try {

                if (panel.onViewType != 'search') {
                    if (panel.thisPanelType == 'normal') {
                        panel._updateNormalRecord(dataObj);

                    } else {
                        panel._updateMultiRecord(dataObj);
                    }
                }

            } catch (e) {
                console.log('[marketDepth][updateFeedRecord] Exception ---> ' + e);
            }
        }
    },
    /**
     * Description <br/>
     *
     * 		update 20 level market depth record
     *
     * @param {object} dataObj
     */
    _updateMultiRecord: function (dataObj) {
        var panel = this;

        try {

            if (dataObj[ '105' ] == '1') { // add

            } else if (dataObj[ '105' ] == '2') { // update

                if (dataObj[ '106' ] == '0') { // both column
                    panel._updateGridCell(dataObj[ '107' ], '4', dataObj[ '68' ], 'up'); // bid price
                    panel._updateGridCell(dataObj[ '107' ], '3', dataObj[ '58' ], 'up'); // bid volume
                    panel._updateGridCell(dataObj[ '107' ], '1', dataObj[ '170' ], 'up'); // bid split

                    panel._updateGridCell(dataObj[ '107' ], '5', dataObj[ '68' ], 'up'); // ask price
                    panel._updateGridCell(dataObj[ '107' ], '6', dataObj[ '58' ], 'up'); // ask volume
                    panel._updateGridCell(dataObj[ '107' ], '8', dataObj[ '170' ], 'up'); // ask split

                } else if (dataObj[ '106' ] == '1') { // bid column
                    panel._updateGridCell(dataObj[ '107' ], '4', dataObj[ '68' ], 'up'); // bid price
                    panel._updateGridCell(dataObj[ '107' ], '3', dataObj[ '58' ], 'up'); // bid volume
                    panel._updateGridCell(dataObj[ '107' ], '1', dataObj[ '170' ], 'up'); // bid split

                } else if (dataObj[ '106' ] == '2') { // ask column
                    panel._updateGridCell(dataObj[ '107' ], '5', dataObj[ '68' ], 'up'); // ask price
                    panel._updateGridCell(dataObj[ '107' ], '6', dataObj[ '58' ], 'up'); // ask volume
                    panel._updateGridCell(dataObj[ '107' ], '8', dataObj[ '170' ], 'up'); // ask split
                }

            } else if (dataObj[ '105' ] == '3') { // delete

            }

            panel._updateMultiTotal();

            /* // total bid, total ask
             var totalBid = 0;
             var totalAsk = 0;
             var items = panel.getStore().data.items;
             
             if (items.length > 0) {
             for (var i = 0; i < items.length; i++) {
             var recordObj = items[i].data;
             
             if (recordObj[cmap_mdBidQty] && recordObj[cmap_mdBidPrice]) {
             totalBid += parseFloat(recordObj[cmap_mdBidQty]) * parseFloat(recordObj[cmap_mdBidPrice]);
             }
             if (recordObj[cmap_mdAskQty] && recordObj[cmap_mdAskPrice]) {
             totalAsk += parseFloat(recordObj[cmap_mdAskQty]) * parseFloat(recordObj[cmap_mdAskPrice]);
             }
             }
             
             helper.setHtml(panel.tLabel2, 'Total Bid: ' + formatutils.formatNumber(totalBid.toFixed(0)));
             helper.setHtml(panel.tLabel4, 'Total Ask: ' + formatutils.formatNumber(totalAsk.toFixed(0)));
             }*/

        } catch (e) {
            console.log('[marketDepth][_updateMultiRecord] Exception ---> ' + e);
        }
    },
    _updateMultiTotal: function () {
        var panel = this;

        if (panel.showTotalBidAsk) {
            var column_1 = 0;
            var column_2 = 0;
            var column_3 = 0;
            var column_4 = 0;
            var column_5 = 0;
            var column_6 = 0;
            var column_7 = 0;
            var column_8 = 0;
            var decimalPlace = 3;

            var totalBid = 0;
            var totalAsk = 0;

            var hasMO_BidPrice = false;
            var hasMP_BidPrice = false;

            var hasMO_AskPrice = false;
            var hasMP_AskPrice = false;

            for (var i = 0; i < panel.storageObj.length; i++) {
                var recordObj = panel.storageObj[ i ];

                if (recordObj[cmap_mdNo ] != '###') {

                    column_1 = column_1 + (isNaN(parseFloat(recordObj[ cmap_mdBSplit ])) ? 0 : parseFloat(recordObj[ cmap_mdBSplit ])); // bid : split
                    column_2 = column_2 + (isNaN(parseFloat(recordObj[ cmap_mdBCum ])) ? 0 : parseFloat(recordObj[ cmap_mdBCum  ])); // bid : cum
                    column_3 = column_3 + (isNaN(parseFloat(recordObj[ cmap_mdBidQty ])) ? 0 : parseFloat(recordObj[ cmap_mdBidQty ])); // bid : qty
                    column_4 = column_4 + (isNaN(parseFloat(recordObj[ cmap_mdBidPrice ])) ? 0 : parseFloat(recordObj[ cmap_mdBidPrice ])); // bid : price
                    column_5 = column_5 + (isNaN(parseFloat(recordObj[ cmap_mdAskPrice ])) ? 0 : parseFloat(recordObj[ cmap_mdAskPrice ])); // ask : price
                    column_6 = column_6 + (isNaN(parseFloat(recordObj[ cmap_mdAskQty ])) ? 0 : parseFloat(recordObj[ cmap_mdAskQty ])); // ask : qty
                    column_7 = column_7 + (isNaN(parseFloat(recordObj[ cmap_mdSCum ])) ? 0 : parseFloat(recordObj[ cmap_mdSCum ])); // ask : cum
                    column_8 = column_8 + (isNaN(parseFloat(recordObj[ cmap_mdSSplit ])) ? 0 : parseFloat(recordObj[ cmap_mdSSplit ])); // ask : split


                    var tempTotalBid = 0;
                    var tempTotalAsk = 0;

                    if (isMO(recordObj[ cmap_mdBidPrice ])) {
                        hasMO_BidPrice = true;

                    } else if (isMP(recordObj[ cmap_mdBidPrice ])) {
                        hasMP_BidPrice = true;

                    } else {
                        tempTotalBid = parseFloat(recordObj[ cmap_mdBidPrice ]) * parseFloat(recordObj[ cmap_mdBidQty ]);

                        if ((recordObj[ cmap_mdBidPrice ].toString()).indexOf('.') != -1) {
                            var temp = (recordObj[ cmap_mdBidPrice ].toString()).substring((recordObj[ cmap_mdBidPrice ].toString()).indexOf('.') + 1, recordObj[ cmap_mdBidPrice ].toString().length);
                            decimalPlace = temp.length;
                        }
                    }

                    if (isMO(recordObj[ cmap_mdAskPrice ])) {
                        hasMO_AskPrice = true;

                    } else if (isMP(recordObj[ cmap_mdAskPrice ])) {
                        hasMP_AskPrice = true;

                    } else {
                        tempTotalAsk = parseFloat(recordObj[ cmap_mdAskPrice ]) * parseFloat(recordObj[ cmap_mdAskQty ]);
                    }

                    if (!isNaN(tempTotalBid)) {
                        totalBid += tempTotalBid;
                    }

                    if (!isNaN(tempTotalAsk)) {
                        totalAsk += tempTotalAsk;
                    }


                }
            }

            var storeRecord = panel.store.getAt(panel.mdLevel);
            if (storeRecord) {
                if (storeRecord.get(cmap_mdBSplit) != column_1) { // bid : split
                    panel._updateGridCell(panel.mdLevel, panel.allColumn.indexOf(cmap_mdBSplit), column_1, 'up');
                }
                if (storeRecord.get(cmap_mdBidQty) != column_3) { // bid : qty
                    panel._updateGridCell(panel.mdLevel, panel.allColumn.indexOf(cmap_mdBidQty), column_3, 'up');

                }

                var tempResultBid = parseFloat(totalBid / column_3).toFixed(decimalPlace);
                if (storeRecord.get(cmap_mdBidPrice) != tempResultBid) { // bid : price
                    if (isNaN(tempResultBid)) {
                        panel._updateGridCell(panel.mdLevel, panel.allColumn.indexOf(cmap_mdBidPrice), parseFloat(0).toFixed(decimalPlace), 'up');
                    } else {
                        panel._updateGridCell(panel.mdLevel, panel.allColumn.indexOf(cmap_mdBidPrice), parseFloat(tempResultBid).toFixed(decimalPlace), 'up');
                    }
                }

                var tempResultAsk = parseFloat(totalAsk / column_6).toFixed(decimalPlace);
                if (storeRecord.get(cmap_mdAskPrice) != tempResultAsk) { // ask : price
                    if (isNaN(tempResultAsk)) {
                        panel._updateGridCell(panel.mdLevel, panel.allColumn.indexOf(cmap_mdAskPrice), parseFloat(0).toFixed(decimalPlace), 'up');
                    } else {
                        panel._updateGridCell(panel.mdLevel, panel.allColumn.indexOf(cmap_mdAskPrice), parseFloat(tempResultAsk).toFixed(decimalPlace), 'up');
                    }
                }
                if (storeRecord.get(cmap_mdAskQty) != column_6) { // ask : qty
                    panel._updateGridCell(panel.mdLevel, panel.allColumn.indexOf(cmap_mdAskQty), column_6, 'up');
                }
                if (storeRecord.get(cmap_mdSSplit) != column_8) { // ask : split
                    panel._updateGridCell(panel.mdLevel, panel.allColumn.indexOf(cmap_mdSSplit), column_8, 'up');
                }
                /*
                 if (storeRecord.get('column_2') != column_2) { // bid : cum
                 panel._updateGridCell(5, 2, column_2, 'up');
                 }
                 if (storeRecord.get('column_7') != column_7) { // ask : cum
                 panel._updateGridCell(5, 7, column_7, 'up');
                 }
                 */
                if (!hasMO_BidPrice && !hasMP_BidPrice) {
                    if (global_displayUnit.toLowerCase() == "lot") // v1.3.34.68
                        helper.setHtml(panel.tLabel2, languageFormat.getLanguage(10507, 'Total Bid') + ': ' + formatutils.formatNumber(parseFloat(totalBid * panel.lotSize).toFixed(0)));
                    else
                        helper.setHtml(panel.tLabel2, languageFormat.getLanguage(10507, 'Total Bid') + ': ' + formatutils.formatNumber(parseFloat(totalBid).toFixed(0)));
                } else
                    helper.setHtml(panel.tLabel2, '-');


                if (!hasMO_AskPrice && !hasMP_AskPrice) {

                    if (global_displayUnit.toLowerCase() == "lot") // v1.3.34.68
                        helper.setHtml(panel.tLabel4, languageFormat.getLanguage(10508, 'Total Ask') + ': ' + formatutils.formatNumber(parseFloat(totalAsk * panel.lotSize).toFixed(0)));
                    else
                        helper.setHtml(panel.tLabel4, languageFormat.getLanguage(10508, 'Total Ask') + ': ' + formatutils.formatNumber(parseFloat(totalAsk).toFixed(0)));

                } else
                    helper.setHtml(panel.tLabel4, '-');
            }
        }
    },
    /**
     * Description <br/>
     *
     * 		refresh grid panel / reset grid panel
     *
     */
    refresh: function(themeName) {
         var panel = this;

        if (panel.debug) {
            console.log('Market Depth > refresh');
            console.log('stkcode -> ', panel.stkcode, ', stkname -> ', panel.stkname, ', exchange -> ', panel.exchangecode);
        }

        helper.setHtml(panel.tLabel2, '-');
        helper.setHtml(panel.tLabel4, '-');
        panel.tField_Search.setValue("");
        panel.store.removeAll();
        
        if (!panel.stkcode) {
            panel._procPanelInfo();
            return;
        }

        panel.procColumnWidth();
        panel.thisPanelType = panel.getMktDepthLevel();
        panel.setShowFormatQtyLot();

        panel._setGradientColors(null, themeName);
        
        if (panel.thisPanelType == 'normal') {
            panel._procColumnModel('normal');
            panel._procCallNormalType();

        } else if (panel.thisPanelType == 'multi') {
            panel._procColumnModel('multi');
            panel._procCallMultiType();
        }
    },
    /**
     * Description <br/>
     *
     * 		process update grid cell value
     *
     * @param {integer} 	rowIndex
     * @param {integer} 	columnIndex
     * @param {string} 		value
     * @param {string} 		blinkStatus
     */
    _updateGridCell: function (rowIndex, columnIndex, value, blinkStatus) {
        var panel = this;
        var record = panel.store.getAt(rowIndex);
        var storeRecord = panel.storageObj[ rowIndex ];
        if (!panel) {
            return;
        }
        if (jsutil.isEmpty(value)) {
            return;
        }
        var colModel = panel.getView().getHeaderCt();
        if (!colModel.getHeaderAtIndex(columnIndex).isVisible()) {
            return;
        }
        try {
            if (storeRecord != null) {
                if (record != null) {
                    if (value.toString().trim() != '' && value.toString().trim() != '-') {
                        /*
                    	if ((columnIndex.toString() == panel.allColumn.indexOf(cmap_mdBidQty) || columnIndex.toString() == panel.allColumn.indexOf(cmap_mdAskQty)) && global_displayUnit.toLowerCase() == "lot" && panel.thisPanelType == "multi") {
                            value /= panel.lotSize;
                        }
                        */
                        record.data[ panel.allColumn[columnIndex] ] = value;
                        if (storeRecord != null) {
                            //    if (record[ panel.allColumn[columnIndex] ] != value) {
                            storeRecord[ panel.allColumn[columnIndex] ] = value;
                            //   if (showBcumScum.toLowerCase() == "true") {
                            if (columnIndex.toString() == panel.allColumn.indexOf(cmap_mdBSplit) || columnIndex.toString() == panel.allColumn.indexOf(cmap_mdBidQty) || columnIndex.toString() == panel.allColumn.indexOf(cmap_mdAskQty) || columnIndex.toString() == panel.allColumn.indexOf(cmap_mdSSplit)) {
                                var gridcount = panel.getStore().getCount();
                                var colWidth = panel._getWidth(panel.allColumn[columnIndex])['value'];
                                if (columnIndex.toString() == panel.allColumn.indexOf(cmap_mdBidQty)) {//update Bcum when b.qty update.
                                    var bcum = 0;

                                    //  console.log("rowIndex: " + rowIndex);
                                    for (var i = rowIndex; i < gridcount; i++) { // i = rowIndex to cut down not unnecessary loop
                                        var record = panel.getStore().getAt(i);
                                        //var colname = panel.getColumnModel().getDataIndex(panel.allColumn.indexOf(cmap_mdBidQty));
                                        var colname = cmap_mdBidQty;

                                        var cellvalue = record.get(colname);
                                        var bQty = isNaN(cellvalue) ? 0 : parseFloat(cellvalue); 

                                        if (bQty == 0) { // break when b.qty='-' or 0
                                            N2NUtil.updateCell(panel, i, panel.allColumn.indexOf(cmap_mdBCum), '-');
                                        }
                                        if (gridcount === 6 && i === 5) { // delete total value of bcum cell in normal type
                                            N2NUtil.updateCell(panel, i, panel.allColumn.indexOf(cmap_mdBCum), '-');
                                            break;
                                        }
                                        
                                        if (bQty !== 0) {
                                        var oldbcum = 0;
                                        if (i > 0) {
                                            var bcumrecord = panel.getStore().getAt(i - 1);
                                            var bcumcolname = cmap_mdBCum;
                                            oldbcum = parseFloat(bcumrecord.get(bcumcolname));
                                                // var tempExtView = panel.getView();
                                                // var tempCell = tempExtView.getCell(i - 1, panel.allColumn.indexOf(cmap_mdBCum));
                                                // if (tempCell.firstChild.textContent.indexOf('M') !== -1) {
                                                // oldbcum = parseFloat(tempCell.firstChild.textContent) * 1000000; //covert M to normal number
                                                //  } else if (tempCell.firstChild.textContent.indexOf('K') !== -1) {
                                                // oldbcum = parseFloat(tempCell.firstChild.textContent) * 1000;    // convert K to normal number
                                                // } else {
                                                // oldbcum = parseFloat(tempCell.firstChild.textContent);
                                            }


                                            bcum = oldbcum + bQty;
                                        }
                                        	
//                                      console.log("cellvalue: " + cellvalue + "; oldbcum: " + oldbcum+"; resultbcum: " + bcum  );

                                        if (record.data[panel.allColumn[0]] != "###" && bQty != 0) {
                                            N2NUtil.updateCell(panel, i, panel.allColumn.indexOf(cmap_mdBCum), formatutils.formatNumberLot(bcum, panel.qtyFormat, colWidth));
                                            record.data[ panel.allColumn[panel.allColumn.indexOf(cmap_mdBCum)] ] = bcum;
                                            Blinking.setBlink(panel, i, panel.allColumn.indexOf(cmap_mdBCum), blinkStatus);
                                        } else {
                                            N2NUtil.updateCell(panel, i, panel.allColumn.indexOf(cmap_mdBCum), '-');
                                            record.data[ panel.allColumn[panel.allColumn.indexOf(cmap_mdBCum)] ] = "-";
                                        }
                                    }

                                }

                                if (columnIndex.toString() == panel.allColumn.indexOf(cmap_mdAskQty)) { //update Scum when A.qty update.
                                    var scum = 0;

                                    for (var i = rowIndex; i < gridcount; i++) { // i = rowIndex to cut down not unnecessary loop
                                        var record = panel.getStore().getAt(i);
                                        var colname = cmap_mdAskQty;
                                        var cellvalue = record.get(colname);
                                        var sQty = isNaN(cellvalue) ? 0 : parseFloat(cellvalue);

                                        
                                        if (sQty == 0) {
                                            N2NUtil.updateCell(panel, i, panel.allColumn.indexOf(cmap_mdSCum), '-');
                                        }
                                        if (gridcount === 6 && i === 5) { // delete total value of scum cell in normal type
                                            N2NUtil.updateCell(panel, i, panel.allColumn.indexOf(cmap_mdSCum), '-');
                                            break;
                                        }

                                        if (sQty !== 0) {
                                            var oldscum = 0;
                                        if (i > 0) {
                                            var scumrecord = panel.getStore().getAt(i - 1);
                                            var scumcolname = cmap_mdSCum;
                                            oldscum = parseFloat(scumrecord.get(scumcolname));
//                                                var tempExtView = panel.getView();
//                                                var tempCell = tempExtView.getCell(i - 1, panel.allColumn.indexOf(cmap_mdSCum));

//                                                if (tempCell.firstChild.textContent.indexOf('M') !== -1) {
//                                                    oldscum = parseFloat(tempCell.firstChild.textContent) * 1000000; //covert M to normal number (000000)
//                                                } else if (tempCell.firstChild.textContent.indexOf('K') !== -1) {
//                                                    oldscum = parseFloat(tempCell.firstChild.textContent) * 1000;   //convert K to normal number (000)
//                                                } else {
//                                                    oldscum = parseFloat(tempCell.firstChild.textContent);
//                                                }
                                        }


                                            scum = oldscum + sQty;
                                        }
                                                                                
                                        //console.log("cellvalue: " + cellvalue + "; scum: " + bcum + "; colname: " + colname + "; bcumvalue: " + oldbcum);
                                        if (record.data[panel.allColumn[0]] != "###" && sQty != 0) {
                                            N2NUtil.updateCell(panel, i, panel.allColumn.indexOf(cmap_mdSCum), formatutils.formatNumberLot(scum, panel.qtyFormat, colWidth));
                                            record.data[ panel.allColumn[panel.allColumn.indexOf(cmap_mdSCum)] ] = scum;
                                            Blinking.setBlink(panel, i, panel.allColumn.indexOf(cmap_mdSCum), blinkStatus);
                                        } else {
                                            N2NUtil.updateCell(panel, i, panel.allColumn.indexOf(cmap_mdSCum), '-');
                                            record.data[ panel.allColumn[panel.allColumn.indexOf(cmap_mdSCum)] ] = "-";
                                        }

                                    }

                                }



                                if (columnIndex.toString() != panel.allColumn.indexOf(cmap_mdBCum) || columnIndex.toString() != panel.allColumn.indexOf(cmap_mdSCum)) {
                                    N2NUtil.updateCell(panel, rowIndex, columnIndex, formatutils.formatNumberLot(value, panel.qtyFormat, colWidth));
                                }


                            } else {

                                if (columnIndex.toString() == panel.allColumn.indexOf(cmap_mdBidPrice) || columnIndex.toString() == panel.allColumn.indexOf(cmap_mdAskPrice)) {

                                    if (parseFloat(value) > parseFloat(panel.lacp))
                                        N2NUtil.updateCell(panel, rowIndex, columnIndex, value, N2NCSS.FontUp);

                                    else if (parseFloat(value) < parseFloat(panel.lacp) && parseFloat(value) != 0)
                                        N2NUtil.updateCell(panel, rowIndex, columnIndex, value, N2NCSS.FontDown);

                                    else
                                        N2NUtil.updateCell(panel, rowIndex, columnIndex, value, N2NCSS.FontUnChange);

                                } else {

                                    N2NUtil.updateCell(panel, rowIndex, columnIndex, value);
                                }

                            }
//                                } else {
//                                    if (columnIndex.toString() == '1' || columnIndex.toString() == '2' || columnIndex.toString() == '5' || columnIndex.toString() == '6') {
//                                        N2NUtil.updateCell(panel, rowIndex, columnIndex, formatutils.formatNumberLot(value));
//                                    } else {
//
//                                        if (columnIndex.toString() == '3' || columnIndex.toString() == '4') {
//
//                                            if (parseFloat(value) > parseFloat(panel.lacp))
//                                                N2NUtil.updateCell(panel, rowIndex, columnIndex, value, N2NCSS.FontUp);
//
//                                            else if (parseFloat(value) < parseFloat(panel.lacp) && parseFloat(value) != 0)
//                                                N2NUtil.updateCell(panel, rowIndex, columnIndex, value, N2NCSS.FontDown);
//
//                                            else
//                                                N2NUtil.updateCell(panel, rowIndex, columnIndex, value, N2NCSS.FontUnChange);
//
//                                        } else {
//                                            N2NUtil.updateCell(panel, rowIndex, columnIndex, value);
//                                        }
//
//                                    }
//                                }
                            Blinking.setBlink(panel, rowIndex, columnIndex, blinkStatus);
                            //  }
                        }
                    }
                }
            }
        } catch (e) {
            console.log('[marketDepth][_updateGridCell] Exception ---> ' + e);
        }
    },
    /**
     * Description <br/>
     *
     * 		return 5 level market depth cell info
     *
     * @param {integer} 	row
     * @param {integer} 	colum
     * @param {string} 		fieldId
     *
     * @return {object}
     */
    _returnCellInfo: function (row, colum, fieldId) {
        var panel = this;

        var result = {};
        result.search = {};
        result.search.row = row;
        result.search.colum = colum;
        result.search.fieldId = fieldId;
        result.validate = false;
        result.data = [];

        var fieldList = [];

        fieldList.push([fieldBSplit, '', fieldBqty, fieldBuy, fieldSell, fieldSqty, '', fieldSSplit]);
        fieldList.push([fieldBSplit2, '', fieldBqty2, fieldBuy2, fieldSell2, fieldSqty2, '', fieldSSplit2]);
        fieldList.push([fieldBSplit3, '', fieldBqty3, fieldBuy3, fieldSell3, fieldSqty3, '', fieldSSplit3]);
        fieldList.push([fieldBSplit4, '', fieldBqty4, fieldBuy4, fieldSell4, fieldSqty4, '', fieldSSplit4]);
        fieldList.push([fieldBSplit5, '', fieldBqty5, fieldBuy5, fieldSell5, fieldSqty5, '', fieldSSplit5]);



        if (fieldList.length >= row) {

            if (row != null && colum != null && fieldId != null) {
                var tempField = fieldList[ row ][ colum ];

                if (fieldId == tempField) {
                    result.validate = true;

                } else {
                    result.validate = false;
                }

            } else if (row != null && colum != null && fieldId == null) {

                var tempRow = fieldList[ row ];

                if (tempRow.length >= colum) {
                    result.validate = true;
                    result.data.push(tempRow[ colum ]);

                } else {
                    result.validate = false;

                }

            } else if (row != null && colum == null && fieldId == null) {

                var tempRow = fieldList[ row ];

                if (tempRow != null) {
                    result.validate = true;
                    result.data = tempRow;

                } else {
                    result.validate = false;

                }

            } else if (row == null && colum != null && fieldId == null) {

                for (var i = 0; i < fieldList.length; i++) {
                    var tempRow = fieldList[ i ];

                    if (tempRow.length >= colum) {
                        result.validate = true;
                        result.data.push(tempRow[ colum ]);

                    } else {
                        result.validate = false;

                    }
                }

            } else if (row == null && colum == null && fieldId != null) {

                for (var i = 0; i < fieldList.length; i++) {
                    var tempRow = fieldList[ i ];

                    for (var ii = 0; ii < tempRow.length; ii++) {
                        var tempColumn = tempRow[ ii ];

                        if (tempColumn == fieldId) {
                            result.validate = true;
                            result.data.push([(i + 1), (ii + 1)]);
                            break;
                        }
                    }
                }
            }
        }

        return result;

    },
    setting: function () {
        var panel = this;
        if (mdSetting == null) {
            panel.activeColumn = 0;
            var col = '';
            var marketDepthSplitItem = new Ext.container.Container({
                layout: 'table',
                border: false,
                hidden: panel.type == "depthmatrix",
                boolSplit: panel.setVisibleColumn(cmap_mdBSplit) ? false : true,
                defaults: {
                    baseCls: ''
                },
                padding: '0 5 0 5',
                items: [
                    new Ext.form.field.Radio({
                        width: 170,
                        labelWidth: 110,
                        name: "marketDepthSplitRadio",
                        boxLabel: languageFormat.getLanguage(21107, "Show"),
                        fieldLabel: languageFormat.getLanguage(21100, 'B/S Split'),
                        labelSeparator: '',
                        checked: panel.showSplit,
                        handler: function (thisObj, checked) {

                            if (checked) {
                                panel.activeColumn = 1;

                                marketDepthSplitItem.boolSplit = true;

                            }


                        }
                    }),
                    new Ext.form.field.Radio({
                        width: 60,
                        name: "marketDepthSplitRadio",
                        boxLabel: languageFormat.getLanguage(21108, "Hide"),
                        fieldLabel: '',
                        labelSeparator: '',
                        checked: !panel.showSplit,
                        handler: function (thisObj, checked) {
                            if (checked) {
                                marketDepthSplitItem.boolSplit = false;
                                panel.activeColumn = 1;
                            }

                        }
                    })
                ]

            });
            var marketDepthCumItem = new Ext.container.Container({
                layout: 'table',
                padding: '0 5 0 5',
                border: false,
                boolCum: panel.showBcum,
                hidden: panel.type == "depthmatrix",
                defaults: {
                    baseCls: ''
                },
                items: [
                    new Ext.form.field.Radio({
                        name: "marketDepthCumRadio",
                        boxLabel: languageFormat.getLanguage(21107, "Show"),
                        fieldLabel: languageFormat.getLanguage(21101, 'B/S Cum'),
                        labelSeparator: '',
                        width: 170,
                        labelWidth: 110,
                        checked: panel.showBcum, // from
                        handler: function (thisObj, checked) {
                            if (checked) {
                                marketDepthCumItem.boolCum = true;
                                panel.activeColumn = 1;
                            }

                        }
                    }),
                    new Ext.form.field.Radio({
                        name: "marketDepthCumRadio",
                        width: 60,
                        boxLabel: languageFormat.getLanguage(21108, "Hide"),
                        fieldLabel: '',
                        labelSeparator: '',
                        checked: !panel.showBcum, // from
                        // main.jsp
                        handler: function (thisObj, checked) {
                            if (checked) {
                                marketDepthCumItem.boolCum = false;
                                panel.activeColumn = 1;
                            }
                        }

                    })
                ]

            });
            var marketDepthQtyFormatItem = new Ext.container.Container({
                layout: 'table',
                padding: '0 5 0 5',
                border: false,
                boolQtyFormat: panel.qtyFormat,
                defaults: {
                    baseCls: ''
                },
                items: [
                    new Ext.form.field.Radio({
                        name: "marketDepthQtyFormatRadio",
                        width: 170,
                        labelWidth: 110,
                        boxLabel: languageFormat.getLanguage(10011, "Yes"),
                        fieldLabel: languageFormat.getLanguage(21102, 'B/S Qty Round Up'),
                        labelSeparator: '',
                        checked: panel.qtyFormat,
                        handler: function (thisObj, checked) {
                            if (checked) {
                                marketDepthQtyFormatItem.boolQtyFormat = true;
                            }
                        }

                    }),
                    new Ext.form.field.Radio({
                        name: "marketDepthQtyFormatRadio",
                        width: 60,
                        boxLabel: languageFormat.getLanguage(10014, "No"),
                        fieldLabel: '',
                        labelSeparator: '',
                        checked: !panel.qtyFormat,
                        handler: function (thisObj, checked) {
                            if (checked) {
                                marketDepthQtyFormatItem.boolQtyFormat = false;
                            }
                        }
                    })
                ]

            });
            var marketDepthApplyAllItem = new Ext.container.Container({
                border: false,
                isApplyAllItem: panel.isApplyAllItem,
                defaults: {
                    baseCls: ''
                },
                items: [
                    {
                        xtype: "checkboxfield",
                        name: "marketDepthApplyAllRadio",
                        boxLabel: languageFormat.getLanguage(21106, "Apply to All"),
                        fieldLabel: '',
                        labelSeparator: '',
                        checked: panel.isApplyAllItem,
                        hidden: true,
                        handler: function (thisObj, checked) {
                            if (checked) {
                                marketDepthApplyAllItem.isApplyAllItem = true;
                            } else {
                                marketDepthApplyAllItem.isApplyAllItem = false;
                            }
                        }

                    }
                ]


            });
            var marketDepthGradientItem = new Ext.container.Container({
                layout: 'table',
                border: false,
                gradient: panel.isGradient,
                items: [
                    new Ext.form.field.Radio({
                        name: "marketDepthColorRadio",
                        width: 65,
                        boxLabel: languageFormat.getLanguage(21109, "On").toUpperCase(),
                        fieldLabel: '',
                        labelSeparator: '',
                        checked: panel.isGradient == "gradient" ? true : false, // from
                        handler: function (thisObj, checked) {
                            if (checked) {
                                marketDepthGradientItem.gradient = "gradient";
                                Ext.getCmp("bgfieldset").enable();
                                panel.isGradient = marketDepthGradientItem.gradient;
                                panel.refresh();

                            }

                        }
                    }),
                    new Ext.form.field.Radio({
                        name: "marketDepthColorRadio",
                        width: 65,
                        boxLabel: languageFormat.getLanguage(21110, "Off").toUpperCase(),
                        fieldLabel: '',
                        labelSeparator: '',
                        checked: panel.isGradient == "gradient" ? false : true, // from
                        // main.jsp
                        handler: function (thisObj, checked) {
                            if (checked) {
                                marketDepthGradientItem.gradient = "normal";
                                Ext.getCmp("bgfieldset").disable();
                                panel.isGradient = marketDepthGradientItem.gradient;
                                panel.refresh();
                            }
                        }

                    })
                ]

            });
            var hidbgbuy = Ext.create('widget.hiddenfield', {
                listeners: {
                    change: function(thisComp, newVal, oldVal, eOpts) {
                        panel._setGradientBuyColor(newVal);
                        panel.getView().refresh();
                    }
                }});
            var hidbgsell = Ext.create('widget.hiddenfield', {
                listeners: {
                    change: function(thisComp, newVal, oldVal, eOpts) {
                        panel._setGradientSellColor(newVal);
                        panel.getView().refresh();
                    }
                }
            });

            var buyColorPicker = Ext.create('Ext.ux.colorpicker.ColorPickerField', {
                id: 'depth_buycolorpicker',
                fieldLabel: languageFormat.getLanguage(10001, 'Buy'),
                labelWidth: 25,
                width: 70,
                value: panel._getGradientBuyColor(),
                editable: false,
                setValue: function (value) {
                    this.setFieldStyle("background-image: none;background-color:#" + value);
                    hidbgbuy.setValue(value);
                },
                getValue: function () {
                    return hidbgbuy.getValue();
                }
            });
            var sellColorPicker = buyColorPicker.cloneConfig({
                id: 'depth_sellcolorpicker',
                fieldLabel: languageFormat.getLanguage(10002, 'Sell'),
                value: panel._getGradientSellColor(),
                width: 70,
                labelWidth: 25,
                style: 'margin-left: 10px',
                setValue: function(value) {
                    this.setFieldStyle("background-image: none;background-color:#" + value);
                    hidbgsell.setValue(value);
                },
                getValue: function () {
                    return hidbgsell.getValue();
                }
            });
            var btnDefaultBackground = Ext.create("Ext.button.Button", {
                text: languageFormat.getLanguage(21115, 'Default'),
                margin: '0 0 0 80',
                handler: function() {
                    buyColorPicker.setValue(isBlackTheme() ? defMarketDepthBuyColor_b : defMarketDepthBuyColor);
                    sellColorPicker.setValue(isBlackTheme() ? defMarketDepthSellColor_b : defMarketDepthSellColor);
                }
            });

            var fieldSetAdvance = Ext.create('Ext.form.FieldSet', {
                title: languageFormat.getLanguage(21103, "Gradient Option"),
                collapsible: true,
                collapsed: true,
                margin: 0,
                items: [
                    marketDepthGradientItem,
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: "fieldset",
                                title: languageFormat.getLanguage(21104, "Background"),
                                id: "bgfieldset",
                                height: 80,
                                flex: 1,
                                items: [
                                    {
                                        xtype: 'container',
                                        layout: 'hbox',
                                        width: '100%',
                                        style: 'padding: 5px',
                                        items: [
                                            buyColorPicker,
                                            sellColorPicker
                                        ]
                                    },
                                    btnDefaultBackground]

                            }
                        ]
                    }
                ]
            });

            var split = marketDepthSplitItem.boolSplit;
            var cum = marketDepthCumItem.boolCum;
            var qtyFormat = marketDepthQtyFormatItem.boolQtyFormat;

            if (panel.isGradient == "gradient") {
                Ext.getCmp("bgfieldset").enable();
            } else {
                Ext.getCmp("bgfieldset").disable();
            }
            var saveBtn = new Ext.Button({
                text: global_personalizationTheme.indexOf("wh") != -1 ? '' : languageFormat.getLanguage(21045, 'Save'),
                tooltip: global_personalizationTheme.indexOf("wh") == -1 ? '' : languageFormat.getLanguage(21045, 'Save'),
                icon: iconBtnSave,
                handler: function () {
                    this.disable();
                            
                    if (panel.type !== "depthmatrix") {
                    	split = marketDepthSplitItem.boolSplit;
                    	cum = marketDepthCumItem.boolCum;

                    	if (split && !cum) {
                    		col = "01~02~04~05~06~07~09";
                    	} else if (!split && cum) {
                    		col = "01~03~04~05~06~07~08";
                    	} else if (!split && !cum) {
                    		col = "01~04~05~06~07";
                    	} else {
                    		col = "01~02~03~04~05~06~07~08~09";
                    	}
                    } else {
                    	col = "01~04~05~06~07";
                    }

                    qtyFormat = marketDepthQtyFormatItem.boolQtyFormat;

                    if (qtyFormat) {
                        col += "~Qty=Y";
                    } else {
                        col += "~Qty=N";
                    }
                    if (hidbgbuy.getValue() != "") {
                    	panel.buyPartColor = hidbgbuy.getValue();
                    }
                    if (hidbgsell.getValue() != "") {
                    	panel._setGradientSellColor(hidbgsell.getValue());
                    }

                    panel._updateGradientSettings();

                    var params = [
                                  col,
                                  marketDepthGradientItem.gradient,
                                  marketDepthBuyColor,
                                  marketDepthSellColor,
                                  '',
                                  '',
                                  '',
                                  '',
                                  marketDepthBuyColor_b,
                                  marketDepthSellColor_b
                                  ];

                    var url = addPath + "tcplus/setting?a=set&sc=TCLMDSET&p=" + params.join(',');
                            
                    Ext.Ajax.request({
                    	url: url,
                    	success: function(response) {
                    		var allColumn = panel.allColumn;
                    		var colModel = panel.getView().getHeaderCt();

                    		if (panel.showSplit !== split || panel.showBcum !== cum) {
                    			// remove column width cookie to avoid misalign
                    			cookies.eraseCookie(panel.mdckId);
                    		}

                    		panel.suspendEvent('columnresize');
                    		if (panel.activeColumn != 0) {
                    			colModel.getHeaderAtIndex([allColumn.indexOf(cmap_mdBCum)]).setVisible(cum);
                    			colModel.getHeaderAtIndex([allColumn.indexOf(cmap_mdSCum)]).setVisible(cum);
                    			colModel.getHeaderAtIndex([allColumn.indexOf(cmap_mdBSplit)]).setVisible(split);
                    			colModel.getHeaderAtIndex([allColumn.indexOf(cmap_mdSSplit)]).setVisible(split);
                    		}

                    		// update global settings
                    		marketDepthGradient = marketDepthGradientItem.gradient;
                    		marketDepthCol = col;
                    		panel.showSplit = split;
                    		panel.showBcum = cum;
                    		showFormatNumberLot = qtyFormat;

                    		mdSetting.destroy(); // use destroy instead of close to avoid running logic in close event
                    		if (newMarketDepth) {
                    			newMarketDepth.isGradient = marketDepthGradient;
                    			newMarketDepth.refresh();
                    		}

                    		if (marketDepthMatrixPanel) {
                    			marketDepthMatrixPanel.refresh();
                    		}

                    		if (orderPad && orderPad.compRef.marketDepth) {
                    			var md2 = orderPad.compRef.marketDepth;
                    			md2.isGradient = marketDepthGradient;
                    			md2.refresh();
                    		}

                    		panel.resumeEvent('columnresize');
                    	},
                    	failure: function() {
                    		mdSetting.close();
                    	}
                    });

                }
            });
            var btnCont = [
                marketDepthApplyAllItem,
                "->",
                saveBtn,
                '-',
                new Ext.Button({
                    text: languageFormat.getLanguage(10010, "Cancel"),
                    handler: function () {
                        mdSetting.close();
                    }

                })
            ];
            var btnHeader = [];
            if (global_personalizationTheme.indexOf("wh") != -1) {
                btnCont = [];
                btnHeader = [saveBtn];
            }
            mdSetting = Ext.create('Ext.window.Window', {
                title: languageFormat.getLanguage(21099, "Market Depth Settings"),
                layout: 'fit',
                itemId: panel.id + "_MDSetting",
                width: 250,
                header: {
                    items: btnHeader
                },
                items: {
                    baseCls: '',
                    items: [
                        marketDepthSplitItem,
                        marketDepthCumItem,
                        marketDepthQtyFormatItem,
                        fieldSetAdvance
                    ]
                },
                constrain: true,
                resizable: false,
                bbar: btnCont,
                listeners: {
                    close: function() {
                        panel.isGradient = marketDepthGradient;
                        panel._setGradientColors();
                        panel.refresh();
                    },
                    destroy: function() {
                        mdSetting = null;
                    }
                }


            }).show();
        } else {
            mdSetting.toFront();
            mdSetting.body.highlight();
        }
    },
    getMktDepthLevel: function () {
        var tempPanelType = 'normal';

        if (N2N_CONFIG.BTS2MDLSetting) {
            if (isLMS) {
                if (arExMapping && arExMapping.scpt) {
                    var scpts = arExMapping.scpt;
                    for (var i = 0; i < scpts.length; i++) {
                        var scpt = scpts[i];

                        if (this.exchangecode == scpt.ex) {
                            if (scpt.bts2mktdptlvl != null) {
                                this.bts2NewMktDepthLvl = scpt.bts2mktdptlvl; // keeps in this component
                                tempPanelType = 'multi';
                                break;
                            } else if (scpt.mktdptlvl == N2N_CONFIG.mdLevel) {
                                tempPanelType = 'multi';
                                break;
                            } else {
                            	if(mdlExList.length > 0){
                            		var mdlList = mdlExList.split('|');
                            		for (var i = 0; i < mdlList.length; i++) {
                            			var mdlObj = mdlList[i].split('_');
                            			var mdlEx = mdlObj[0];
                            			if (this.exchangecode == mdlEx) {
                            				tempPanelType = 'multi';
                            				break;
                            			}
                            		}
                            	}
                                break;
                            }
                        }
                    }
                    return tempPanelType;
                } else {
                    return tempPanelType;
                }
            } else {
            	if(mdlExList.length > 0){
            		var mdlEx = mdlExList.split('|');
            		var mdlList = mdlExList.split('|');
            		for (var i = 0; i < mdlList.length; i++) {
            			var mdlObj = mdlList[i].split('_');
            			var mdlEx = mdlObj[0];
            			if (this.exchangecode == mdlEx) {
            				tempPanelType = 'multi';
            				break;
            			}
            		}
            	}
                return tempPanelType;
            }
        } else {
            return tempPanelType;
        }
    },
    setVisibleColumn: function (id) {

        var isHidden = true;
        if (marketDepthCol == '') {

            if (global_MDDefaultColumn.indexOf(id) !== -1) {
                isHidden = false;
            }
        } else {
            if (marketDepthCol.indexOf(id) !== -1) {
                isHidden = false;
            }
        }

        return isHidden;
    },
    /**
     * Description <br/>
     * 
     * 		return bid and ask price
     * 
     * @return {object}
     */
    returnBidAskPrice: function () {
        var panel = this;

        var priceObj = {};
        priceObj.askQty = [];
        priceObj.ask = [];
        priceObj.bid = [];
        priceObj.bidQty = [];

        try {

            for (var i = 0; i < panel.storageObj.length; i++) {
                var tempObj = panel.storageObj[ i ];

                if (tempObj[ cmap_mdNo ] != '###') {
                    if (priceObj.askQty.indexOf(tempObj[ cmap_mdAskQty ]) == -1)
                        priceObj.askQty.push((tempObj[ cmap_mdAskQty ] == '-' ? '0' : tempObj[ cmap_mdAskQty ])); // ask qty
                    if (priceObj.ask.indexOf(tempObj[ cmap_mdAskPrice ]) == -1)
                        priceObj.ask.push((tempObj[ cmap_mdAskPrice ] == '-' ? '0' : tempObj[ cmap_mdAskPrice ])); // ask
                    if (priceObj.bid.indexOf(tempObj[ cmap_mdBidPrice ]) == -1)
                        priceObj.bid.push((tempObj[ cmap_mdBidPrice ] == '-' ? '0' : tempObj[ cmap_mdBidPrice ])); // bid
                    if (priceObj.bidQty.indexOf(tempObj[ cmap_mdBidQty ]) == -1)
                        priceObj.bidQty.push((tempObj[ cmap_mdBidQty ] == '-' ? '0' : tempObj[ cmap_mdBidQty ])); // bid qty
                }

            }

        } catch (e) {
            console.log('[marketDepth][returnBidAskPrice] Exception ---> ' + e);
        }
        return priceObj;
    },
    _procGridClick: function (cellIndex, record) {
        var panel = this;

        if (panel.debug) {
            console.log('MarketDepth > _procGridClick');
            console.log('cellIndex ->', cellIndex);
            console.log('record -> ', record);
        }

        try {
            if (panel.onViewType == 'search') {
                if (record != null) {
                    this.setStkCode(record.get('column_0').indexOf('.') == -1 ? record.get('column_0') + record.get('column_2') : record.get('column_0'));
                    this.setStkName(record.get('column_1').indexOf('.') == -1 ? record.get('column_1') + record.get('column_2') : record.get('column_1'));
                    n2nLayoutManager.updateKey(panel);
                    panel.refresh();
                }

            } else {
                var mode = null;
                var cell = panel.allColumn[cellIndex];
                var ordRec = new Object();
                ordRec.stkcode = panel.stkcode;
                ordRec.stkname = panel.stkname;

                if (cell == cmap_mdBSplit || cell == cmap_mdBidQty || cell == cmap_mdBidPrice || cell == cmap_mdBCum) {

                    mode = modeOrdSell;
                    ordRec.price = record.get(cmap_mdBidPrice);

                } else if (cell == cmap_mdSSplit || cell == cmap_mdAskPrice || cell == cmap_mdAskQty || cell == cmap_mdSCum) {
                    mode = modeOrdBuy;
                    ordRec.price = record.get(cmap_mdAskPrice);
                }

                if (mode != null) {
                    createOrderPad(panel.stkcode, panel.stkname, mode, ordRec, true);
                }
            }
        } catch (e) {
            console.log('[marketDepth][_procGridClick] Exception ---> ' + e);
        }

    },
    _colorLuminance: function (hex, lum) {

        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i * 2, 2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00" + c).substr(c.length);
        }

        return rgb;
    },
    /**
     * Description <br/>
     *
     * 		load search result into Ext.Store / Ext.grid
     *
     * @param {object} dataObj
     */
    _updateSearch: function (dataObj) {
        var panel = this;

        if (dataObj != null) {
            if (dataObj.s && dataObj.c > 0) {
                var record = [];

                for (var i = 0; i < dataObj.d.length; i++) {
                    var newRecord = {};
                    newRecord.Level = 'normal_' + i;
                    newRecord['column_0'] = dataObj.d[ i ][ fieldStkCode ];
                    newRecord['column_1'] = dataObj.d[ i ][ fieldStkName ];
                    newRecord['column_2'] = dataObj.d[ i ][ fieldSbExchgCode ];
                    record.push(newRecord);
                }

                panel.store.loadData(record);
            } else {
                helper.setGridEmptyText(panel, languageFormat.getLanguage(30013, 'No result found.'));
            }
        }

        panel.setLoading(false);
    },
    _procCallSearch: function () {
        var panel = this;
        var searchKey = panel.tField_Search.getValue();
        searchKey = searchKey.trim();
        if (searchKey != '') {
            // close market depth setting to avoid exception when saving
            if (mdSetting) {
                mdSetting.close();
            }
            panel._procColumnModel('search');
            panel.store.removeAll();

            conn.searchStock({
                k: searchKey,
                ex: [exchangecode],
                quickSearch: true,
                start: 0,
                count: 10,
                field: [fieldStkCode, fieldStkName, fieldSbExchgCode],
                success: function (obj) {
                    try {
                        panel._updateSearch(obj);
                    } catch (e) {
                        console.log('[marketDepth][_procSearchCall][inner] Exception ---> ' + e);
                    }
                }
            });
        } else {
            // Focus if no text entered
            panel.tField_Search.focus();
        }

    },
    _updateMultiType: function(dataObj) {
        var panel = this;

        panel._procPanelInfo();
        try {
            if (dataObj) {
                var array = [];
                var finalTotalObj = {};
                finalTotalObj.level = 'multi_' + panel.mdLevel;
                finalTotalObj[ cmap_mdNo ] = '###';
                var bcum = 0;
                var scum = 0;

                for (var i = 0; i < dataObj.length; i++) {
                    var dt = dataObj[i];

                    var isNew = true;
                    var recordObj = {};
                    if(isNaN(dt[fieldBqty])){
                        dt[fieldBqty] = 0;
                    }

                    if (array.length > 0 && array[dt['107']]) {
                        isNew = false;
                    } else {
                        recordObj.level = 'multi_' + dt['107'];
                        recordObj[cmap_mdNo] = dt['107'];
                    }
                    if (global_displayUnit.toLowerCase() == "lot") {
                        dt[fieldBqty] /= panel.lotSize;
                    }
                    if (isNew) {
                        if (dt['106'] == "1") {
                            var bQty = parseFloat(dt[fieldBqty]);
                            var rBcum = '-';
                            if (bQty != 0) {
                                bcum += bQty;
                                rBcum = bcum;
                            }

                            recordObj[cmap_mdBCum] = rBcum;
                            recordObj[cmap_mdBidQty] = dt[fieldBqty];
                            recordObj [cmap_mdBidPrice] = dt[fieldBuy];
                            recordObj[cmap_mdBSplit] = dt[fieldBSplit];
                        } else if (dt['106'] == "2") {
                            var sQty = parseFloat(dt[fieldBqty]);
                            var rScum = '-';
                            if (sQty != 0) {
                                scum += sQty;
                                rScum = scum;
                            }
                            recordObj[cmap_mdAskPrice] = dt[fieldBuy];
                            recordObj[cmap_mdAskQty] = dt[fieldBqty];
                            recordObj[cmap_mdSSplit] = dt[fieldBSplit]; // fieldBSplit?
                            recordObj[cmap_mdSCum] = rScum;
                        }

                        // creates new record
                        array.push(recordObj);

                    } else {
                        // updates record
                        if (dt['106'] == "1") {
                            var bQty = parseFloat(dt[fieldBqty]);
                            var rBcum = '-';
                            if (bQty != 0) {
                                bcum += bQty;
                                rBcum = bcum;
                            }
                            
                            array[dt['107']][cmap_mdBCum] = rBcum;
                            array[dt['107']][cmap_mdBidQty] = dt[fieldBqty];
                            array[dt['107']] [cmap_mdBidPrice] = dt[fieldBuy];
                            array[dt['107']][cmap_mdBSplit] = dt[fieldBSplit];
                        } else if (dt['106'] == "2") {
                            var sQty = parseFloat(dt[fieldBqty]);
                            var rScum = '-';
                            if (sQty != 0) {
                                scum += sQty;
                                rScum = scum;
                            }
                            
                            array[dt['107']][cmap_mdAskPrice] = dt[fieldBuy];
                            array[dt['107']][cmap_mdAskQty] = dt[fieldBqty];
                            array[dt['107']][cmap_mdSSplit] = dt[fieldBSplit];
                            array[dt['107']][cmap_mdSCum] = rScum;
                        }
                    }
                }

                if (panel.showTotalBidAsk) {
                    array.push(finalTotalObj);
                }
                panel.storageObj = array;
                panel.getStore().loadData(array);
                panel._updateMultiTotal();
                panel.updateOrderPriceList();
            }
        } catch (e) {
            console.log('[marketDepth][_updateMultiType] Exception ---> ' + e);
        }
    },
    setShowFormatQtyLot: function() {
        if (marketDepthCol == '') {
            showFormatNumberLot = true;
        } else {
            if (marketDepthCol.indexOf('Qty') != -1) {
                var index = marketDepthCol.indexOf('Qty');
                var tempString = marketDepthCol.substring(index);
                var showFormat = tempString.split('=');
                if (showFormat[1] == 'Y') {
                    showFormatNumberLot = true;
                } else {
                    showFormatNumberLot = false;
                }
            } else {
                showFormatNumberLot = true;
            }
        }
        this.qtyFormat = showFormatNumberLot;
    },
    _setCookieId: function () {
        var me = this;
        me.mdckId = sView + '_MktDepth' + me.exchangecode;
    },
    updateOrderPriceList: function () {
        var panel = this;
        if (orderPad && panel.stkcode === orderPad.stkcode) {
            orderPad.callStkInfo();
        }
    },
    _setGradientBuyColor: function(color, theme) {
        var panel = this;

        if (isBlackTheme(theme)) {
            panel.buyPartColor = color || marketDepthBuyColor_b;
        } else {
            panel.buyPartColor = color || marketDepthBuyColor;
        }
    },
    _setGradientSellColor: function(color, theme) {
        var panel = this;

        if (isBlackTheme(theme)) {
            panel.sellPartColor = color || marketDepthSellColor_b;
        } else {
            panel.sellPartColor = color || marketDepthSellColor;
        }
    },
    _setGradientColors: function(color, theme) {
        var me = this;

        me._setGradientBuyColor(color, theme);
        me._setGradientSellColor(color, theme);
    },
    _getGradientBuyColor: function(theme) {
        var panel = this;

        if (isBlackTheme(theme)) {
            return panel.buyPartColor;
        } else {
            return panel.buyPartColor;
        }
    },
    _getGradientSellColor: function(theme) {
        var panel = this;

        if (isBlackTheme(theme)) {
            return panel.sellPartColor;
        } else {
            return panel.sellPartColor;
        }
    },
    _updateGradientSettings: function() {
        var me = this;

        if (isBlackTheme()) {
            marketDepthBuyColor_b = me.buyPartColor;
            marketDepthSellColor_b = me.sellPartColor;
        } else {
            marketDepthBuyColor = me.buyPartColor;
            marketDepthSellColor = me.sellPartColor;
        }
    },
    setDepthMatrixFirstLoad: function() {
        var panel = this;

        if (panel.lastDepth && panel.dpComp) {
            panel.dpComp.firstLoad = false;
            panel.lastDepth = false;
        }
    },
    refreshEmpty: function() {
        var me = this;

        if (!me.key) {
            menuHandler.marketDepth();
        }
    },
    _updateTitle: function() {
        var me = this;
        var stkName = stockutil.getStockPart(me.stkname);

        var newTitle = languageFormat.getLanguage(20022, 'Market Depth') + ' - ' + stkName;
        n2nLayoutManager.updateTitle(me, newTitle);
        n2nLayoutManager.updateKey(me);
    },
    setCode: function(stkcode, stkname) {
        var me = this;

        me.setStkCode(stkcode);
        me.setStkName(stkname);

    },
    syncBuffer: function(stkcode, stkname) {
        var me = this;

        // update key and title
        me.setCode(stkcode, stkname);
        me._updateTitle();

    }
});

