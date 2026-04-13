/**
 * Provides Ext helper functions
 * @type type
 */
var helper = {
    /**
     * Sets html for a component aimed to improve performance
     * @param {component} comp Component
     * @param {string} html HTML
     * @param {boolean} useSetText Whether to use setText() if helper function can't be used
     */
    setHtml: function(comp, html, useSetText) {
        var el = comp.getEl();

        if (el) {
            el.setHtml(html);
        } else {
            if (useSetText != undefined && useSetText == true) {
                comp.setText(html);
            }
        }
    },
    /**
     * Gets column index of grid
     */
    getColumnIndex: function(gridColumns, getBy, getByValue) {
        for (var i = 0; i < gridColumns.length; i++) {
            if (gridColumns[i][getBy] == getByValue) {
                return i;
            }
        }

        return -1;
    },
    getColumn: function(gridColumns, getBy, getByValue) {
        for (var i = 0; i < gridColumns.length; i++) {
            if (gridColumns[i][getBy] == getByValue) {
                return {
                    index: i,
                    col: gridColumns[i]
                };
            }
        }

        return -1;
    },
    /**
     * Gets all columns of a grid
     */
    getGridColumns: function(grid, gridType) {
        if (!grid.lockable) {
            return grid.columns;
        } else {
            var gridView;

            if (gridType == 'lock') {
                gridView = grid.lockedGrid.getView();
            } else {
                gridView = grid.normalGrid.getView();
            }

            return gridView.headerCt.getGridColumns();
        }
    },
    getGridAllColumns: function(grid, visibleColOnly) {
        if (visibleColOnly) {
            if (!grid.lockable) {
                return grid.getView().headerCt.getVisibleGridColumns();
            } else {
                // locked columns
                var lockedCols = grid.lockedGrid.getView().headerCt.getVisibleGridColumns();
                // normal columns
                var normCols = grid.normalGrid.getView().headerCt.getVisibleGridColumns();
                // combines all columns
                return lockedCols.concat(normCols);
            }
        } else {
            if (!grid.lockable) {
                return grid.columns;
            } else {
                // locked columns
                var lockedCols = grid.lockedGrid.getView().headerCt.getGridColumns();
                // normal columns
                var normCols = grid.normalGrid.getView().headerCt.getGridColumns();
                // combines all columns
                return lockedCols.concat(normCols);
            }
        }

    },
    autoSizeGrid: function(grid, allCol) {
        var me = this;
        var t1 = new Date().getTime();
    
        var columns = me.getGridAllColumns(grid, !allCol);
        grid.suspendEvent('columnresize');
        grid.suspendLayouts();
        var hasFn = typeof(grid.updateColWidthCache) === 'function';
        
        var i, n = columns.length;
        for (i = 0; i < n; i++) {
            var col = columns[i];
            if(col.hidden)
                continue;
            col.autoSize();
            col.width = col.width + 2;
            if (hasFn) {
                grid.updateColWidthCache(col, col.width);
            }
        }
        grid.resumeLayouts(true);
        grid.resumeEvent('columnresize');
        tLog('autoSizeGrid: ' + (new Date().getTime() - t1) + 'ms');
    },
    autoFitGrid: function(grid, allCol) {
        var me = this;
        var t1 = new Date().getTime();

        var columns = me.getGridAllColumns(grid, !allCol);
        grid.suspendEvent('columnresize');
        grid.suspendLayouts();
        var hasFn = typeof(grid.updateColWidthCache) === 'function';
        
        var i, ii = 0, n = columns.length, totalFlex = 0 ,totalLockedWidth = 0 , totalWidth = 0;
        for (i = 0; i < n; i++) {
            var col = columns[i];
            if(col.locked){
            	col.autoSize();
            	col.width = col.width + 2;
            	totalLockedWidth += col.width; 
            	ii++;
            }else{
                if(col.hidden)
                    continue;
            	var flexConfigList = N2N_CONFIG.constFlexCol.split('|');
            	var j, flexConfigLength = flexConfigList.length;
            	col.flexRate = 2; //default flex value
            
            	(function (){
            		for(j = 0; j < flexConfigLength; j++){
            			var flexList = flexConfigList[j].split(';');
            			var flexIdList = flexList[0].split(',');
            			var flexWidth = flexList[1];

            			var k, idLength = flexIdList.length;
            			for(k = 0; k < idLength; k++){
            				var id = flexIdList[k];
            				if(col.dataIndex == id){
            					col.flexRate = parseFloat(flexWidth);
            					return
            				}
            			}
            		}
            	})();
            	totalFlex += col.flexRate;
            	totalWidth += col.width;
            }
        }
  
        var gridNormalWidth = grid.viewConfig.compRef.body.dom.clientWidth - totalLockedWidth;
//        tLog('|||| child: ',totalWidth, ' lock :' + totalLockedWidth,  gridNormalWidth);
        var srWidth = 0;
        if(grid.view.getEl().dom.clientHeight < grid.view.getEl().dom.scrollHeight)
            srWidth = 7;
//        tLog('||| vertical scroll width' + srWidth);
        grid.paddSizeGrid = gridNormalWidth - totalWidth - srWidth -2 ; // scrollbar
//        tLog('|||paddSizeGrid : ' + grid.paddSizeGrid);
        if(grid.paddSizeGrid > 0)
        for (i = 0; i < n; i++) {
            var col = columns[i];
            if(!col.locked){
                if(!col.hidden && grid.paddSizeGrid){
//                    tLog('|||fit o: ' + col.width + 'n : '+ ((grid.paddSizeGrid* (col.flexRate)/ totalFlex)+ col.width) + ' rate : '+col.flexRate + ', total f :' + totalFlex);
                    col.setWidth(col.width + (grid.paddSizeGrid* (col.flexRate)/ totalFlex));
                }
            }
        }
      
        grid.resumeLayouts(true);
        grid.resumeEvent('columnresize');
        
        for (i = 0; i < n; i++) {
            var col = columns[i];
            if (hasFn) {
                grid.updateColWidthCache(col, col.getWidth());
            }
        }

        console.log('autoFitGrid: ' + (new Date().getTime() - t1) + 'ms');
    },
    autoFitColumns: function(grid, allCol){
        tLog('||||autoFitColumns');
        var me = this;
        var t1 = new Date().getTime();
        if (userFitToScreen) {
            var hasFn = typeof(grid.updateColWidthCache) === 'function';
            var columns = me.getGridColumns(grid);
            grid.suspendEvent('columnresize');
            grid.suspendLayouts();

            var lstCols = me.getGridAllColumns(grid,true), totalLockedWidth = 0;
            for(var i = 0 ; i < lstCols.length ; i++){
                var col = lstCols[i], totalWidth = 0;
                delete col.flex;
                if(col.hidden)
                    continue;
                col.autoSize();
                col.setWidth(col.width +2 );
                if(!col.locked)
                    totalWidth += col.width;
                else 
                    totalLockedWidth += col.width; 
                if (hasFn) {
                    grid.updateColWidthCache(col, col.width);
                }
            }
            grid.resumeLayouts(true);
            grid.resumeEvent('columnresize');
            
            if(!grid.viewConfig.compRef) 
                return;
            var gridNormalWidth = grid.viewConfig.compRef.body.dom.clientWidth - totalLockedWidth;
//            tLog('|||| child: ',totalWidth, ' lock :' + totalLockedWidth,  gridNormalWidth);
            var srWidth = 0;
            if(grid.view.getEl().dom.clientHeight < grid.view.getEl().dom.scrollHeight)
                srWidth = 7;
//            tLog('||| vertical scroll width' + srWidth)
            
            if (totalWidth > gridNormalWidth - srWidth) {
//                tLog('horizontal scroll is present');
            }  else {
                grid.paddSizeGrid =  gridNormalWidth - totalWidth -srWidth -2;
//                tLog('padding : '  + grid.paddSizeGrid);
                me.autoFitGrid(grid, allCol);
            }
            
         }else{
            var columns = me.getGridColumns(grid);
            grid.suspendEvent('columnresize');
            grid.suspendLayouts();
            var i, n = columns.length;
            for (i = 0; i < n; i++) {
                var col = columns[i];
                delete col.flex;
            }
            grid.resumeLayouts(true);
            grid.resumeEvent('columnresize');

            tLog('removeFlex: ' + (new Date().getTime() - t1) + 'ms');
        }  
    },
    updateColWidthCache: function(grid, cookieKey, column, newWidth, colId) { // template function
        if (grid.columnHash) {
            if (!colId) {
                colId = stockutil.stripItemId(grid._idPrefix || grid.getId(), column.getItemId());
            }
            
            // keeps new width
            grid.columnHash.setItem(colId, newWidth);
            
            if (global_allowCookies == "TRUE") {
                grid.tempWidth = cookies.procTempCookies(grid, cookieKey, colId, newWidth);
                cookies.procCookie(cookieKey, grid.tempWidth, cookieExpiryDays);

                if (grid.colWidthKey && grid.paramKey) {
                    // update width in memory
                    N2N_CONFIG.userColWidth[grid.colWidthKey] = cookies.readCookie(cookieKey);
                    // add to columnWidthSaveManager to save to atp
                    columnWidthSaveManager.addWidthObj(grid.paramKey, cookieKey, grid.colWidthKey);
                }
            }
        }
    },
    getColMappingIDs: function(grid, cols) {
        var mappingIDs = new Array();
        for (var i = 0; i < cols.length; i++) {
            var cl = cols[i];
            if (!cl.isCheckerHd) {
                var colId = stockutil.stripItemId(grid.getId(), cl.getItemId());
                mappingIDs.push(colId);
            }
        }

        return mappingIDs;
    },
    getGridView: function(grid, gridType) {
        if (!grid) {
            return null;
        }

        if (!grid.lockable) {
            return grid.view;
        } else {
            if (gridType == 'lock') {
                return grid.lockedGrid.view;
            } else {
                return grid.normalGrid.view;
            }
        }
    },
    resetGridMenus: function(grid) {
        if (grid) {
            if (grid.lockable) { // locked grid
                if (grid.lockedGrid.headerCt.menu) {
                    grid.lockedGrid.headerCt.menu.destroy();
                    grid.lockedGrid.headerCt.menu = null;
                }
                if (grid.normalGrid.headerCt.menu) {
                    grid.normalGrid.headerCt.menu.destroy();
                    grid.normalGrid.headerCt.menu = null;
                }
            } else { // normal grid
                if (grid.view.headerCt.menu) {
                    grid.view.headerCt.menu.destroy();
                    grid.view.headerCt.menu = null;
                }
            }
        }
    },
    setGridEmptyText: function(grid, emptyText) {
        var gridView = this.getGridView(grid);

        if (gridView) {
            gridView.emptyText = '<div class="x-grid-empty">' + emptyText + '</div>';
            gridView.refresh();
            gridView.emptyText = ''; // reset emptyText
        }
    },
    getCodeLock: function(colArr, colId) {
        if (isMobile) {
            var symExist = false;
            for (var i = 0; i < colArr.length; i++) {
                if (colArr[i].column == colId) {
                    symExist = colArr[i].visible;
                    break;
                }
            }

            return !symExist; // lock depend on symbol column
        } else {
            return true; // lock for non-mobile
        }
    },
    show: function(comp) {
        if (comp && comp.isHidden()) {
            comp.show();
        }
    },
    hide: function(comp) {
        if (comp && !comp.isHidden()) {
            comp.hide();
        }
    },
    setVisible: function(comp, visibility) {
        var me = this;

        if (visibility) {
            me.show(comp);
        } else {
            me.hide(comp);
        }
    },
    /**
     * Checks whether an element or component in view or not
     * 
     * @param {object} el Component or element to check
     * @param {object} appCt Parent container
     * @returns {boolean} a status component/element is in view or not
     */
    inView: function(el, appCt) {
        var ctTop, ctBottom, elTop, elBottom;
        appCt = appCt || n2nLayoutManager.appMain;
        if (!appCt || !el) {
            return false;
        }

        ctTop = appCt.getY();
        ctBottom = ctTop + appCt.getHeight();
        elTop = el.getY();
        elBottom = elTop + el.getHeight();

        return (((elTop >= ctTop) && (elTop <= ctBottom)) || ((elBottom >= ctTop) && (elBottom <= ctBottom)));
    },
    activeView: function(el, appCt) {
        if (!el)
            return null;

        if (N2N_CONFIG.activeSub) {
            return this.inView(el, appCt);
        } else {
            return true;
        }
    },
    moveSelection: function(grid, direction) {
        var selection = grid.getSelectionModel().getSelection();
        var rIndex = -1;

        if (selection.length > 0) {
            var cIndex = grid.store.indexOf(selection[0]);
            var rCount = grid.store.getCount();

            switch (direction) {
                case 'top':
                    if (cIndex > 0) {
                        rIndex = 0;
                    }
                    break;
                case 'up':
                    if (cIndex > 0) {
                        rIndex = cIndex - 1;
                    }
                    break;
                case 'down':
                    if (cIndex < rCount - 1) {
                        rIndex = cIndex + 1;
                    }
                    break;
                case 'bottom':
                    if (cIndex < rCount - 1) {
                        rIndex = rCount - 1;
                    }
                    break;
            }

            if (rIndex > -1) {
                // removes current selection
                grid.store.remove(selection);
                // insert current selection
                grid.store.insert(rIndex, selection);
                grid.getSelectionModel().select(selection);
            }
        }

        return rIndex;
    },
    /**
     * Gets index of a tab
     * 
     * @param {component} tabPanel Tab panel
     * @param {component} tab Tab
     * @returns {int} index number othewise -1 if not found
     */
    getTabIndex: function(tabPanel, tab) {
        if (tabPanel) {
            return tabPanel.items.indexOf(tab);
        }

        return -1;
    },
    setLoading: function(comp, status) {
        if (comp) {
            if (status) {
                return comp.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
            } else {
                return comp.setLoading(false);
            }
        }

        return null;
    },
    cleanLoadMask: function(comp) {
        if (comp && comp.loadMask) {
            comp.loadMask.destroy();
            comp.loadMask = null;
        }
    },
    bufferedRun: {},
    addBufferedRun: function(bufferId, fn) {
        this.bufferedRun[bufferId] = fn;
    },
    removeBufferedRun: function(bufferId) {
        delete this.bufferedRun[bufferId];
    },
    runBuffer: function(bufferId) {
        if (typeof this.bufferedRun[bufferId] === 'function') {
            this.bufferedRun[bufferId]();
            delete this.bufferedRun[bufferId];
        }
    },
    runBufferedView: function(comp, bufferId, fn) {
        if (comp && comp.el) {
            if (helper.inView(comp)) { // if component is view, just run immediately otherwise will put as a buffer
                if (typeof fn === 'function') {
                    fn();
                }
            } else {
                this.addBufferedRun(bufferId, fn);
            }
        }
    },
    gotoRow: function(grid, rowIndex) {
        var me = this;
        var gridView = me.getGridView(grid);

        if (gridView && helper.inView(gridView) && gridView.bufferedRenderer) {
            gridView.bufferedRenderer.scrollTo(rowIndex, true);
    }
    },
    selectRow: function(grid, rowIndex, focusRow) {
        var me = this;
        
        if (rowIndex > -1 && grid.store && grid.store.getCount() > 0) {
            grid.suspendEvent('selectionchange'); // avoid activating orderpad when first time grid loads data; should wait until user clicks.
            
            if (grid.bufferedRenderer) {
                me.gotoRow(grid, rowIndex);
            } else {
                var selMod = grid.getSelectionModel();
                if (focusRow) {
                    selMod.preventFocus = false;
                } else {
                    selMod.preventFocus = true; // default to prevent focus if not set yet
                }
                selMod.select(rowIndex);
                if (focusRow) {
                    selMod.preventFocus = true;
                }
            }
            
            grid.resumeEvent('selectionchange');
        }
    },
    reselectRow: function(grid) {
        var me = this;

        // get current selection
        var curPos = grid.getSelectionModel().getCurrentPosition();
        
        if (curPos) {
            me.selectRow(grid, curPos.rowIdx);
        }
        
    },
    refreshView: function(grid) {
        if (grid.lockable) {
            grid.normalGrid.view.refreshView();
            grid.lockedGrid.view.refreshView();
        } else {
            grid.view.refreshView();
        }
    },
    resetGridScroll: function(grid) {
        if (N2N_CONFIG.gridBufferedRenderer) {
            if (grid.lockable) {
                grid.normalGrid.view._lastScrollTopPosition = null;
                grid.lockedGrid.view._lastScrollTopPosition = null;
                grid.normalGrid.view._lastScrollLeftPosition = null;
                grid.lockedGrid.view._lastScrollLeftPosition = null;
            } else {
                grid.view._lastScrollTopPosition = null;
                grid.view._lastScrollLeftPosition = null;
            }
        }
    },
    runAfterCompRendered: function(comp, fn, maxRun) {
        if (maxRun == null) {
            maxRun = 5;
        } else if (maxRun < 0) {
            return;
        }

        var me = this;

        if (comp && typeof(fn) === 'function') {
            if (comp.rendered) {
                try {
                    fn();
                } catch (e) {
                    console.log('runAfterCompRendered -> exception ->', e.stack);
                }

            } else {
                // wait and try again
                setTimeout(function() {
                    me.runAfterCompRendered(comp, fn, maxRun - 1);
                }, 0);
            }
        }
    },
    fitScreenAll: function() {
        if (quoteScreen) {
            quoteScreen.runFitScreen();
        }

        for (var i = 0; i < activeWatchlistArr.length; i++) {
            var wl = activeWatchlistArr[i].wlpanel;
            wl.runFitScreen();
        }

        if (recentQuotePanel) {
            recentQuotePanel.runFitScreen();
        }
        
        if (orderStatusPanel) {
            orderStatusPanel.runFitScreen();
        }
        
        
        if (mfOrderStatusPanel) {
            mfOrderStatusPanel.runFitScreen();
        }
        
        if (equityPrtfPanel) {
            equityPrtfPanel.runFitScreen();
        }
        
        if (mfEquityPrtfPanel) {
            mfEquityPrtfPanel.runFitScreen();
        }
        
        if (equityManualPrtfPanel) {
            equityManualPrtfPanel.runFitScreen();
        }
        
        if (equityPrtfRealizedPanel) {
            equityPrtfRealizedPanel.runFitScreen();
        }
        
        if (orderHistoryPanel) {
            orderHistoryPanel.runFitScreen();
        }
        
        if (mfOrderHistoryPanel) {
            mfOrderHistoryPanel.runFitScreen();
        }
        
        if (basketOrderPanel) {
            basketOrderPanel.runFitScreen();
        }
        
        if (cfdHoldingsPanel) {
            cfdHoldingsPanel.runFitScreen();
        }

    },
    setGridDefaultSortDirection: function(grid, dir) {
        grid.store.getSorters().$sortable.setDefaultSortDirection(dir || 'DESC');
    },
    addUrlParams: function(url, params) {
        if (url.indexOf('?') > -1) {
            return url + '&' + params;
        } else {
            return url + '?' + params;
        }
    },
    toDateStr: function(date) {
        return Ext.Date.format(date, 'Y-m-d');
    }
};

var ColState = function(colConfig) { // depends on cookies.js
    var me = this;
    me.widths = {};
    me.flexs = {};
    me.defFlex = 0.1;

    if (colConfig) {
        me.config = colConfig;
        me.cookieKey = colConfig.cookieKey;
        me.colWidthKey = colConfig.colWidthKey;
        me.paramKey = colConfig.paramKey;
        me.calFlex = colConfig.calFlex;
    }
    
    me.init = function() {
        if (colConfig && colConfig.config) {
            var ckConfig = columnWidthSaveManager.getColWidth(me.colWidthKey, me.cookieKey, true);
            var isDefaultWidth = true;
            if (ckConfig) {
                colConfig.config = ckConfig; // use existing width from cookie
                isDefaultWidth = false;
            }

            var colArr = colConfig.config.split(',');

            for (var i = 0; i < colArr.length; i++) {
                var colWidth = colArr[i].split('=');
                if (colWidth.length > 1) {
                    if (colWidth[0] !== '' && colWidth[1] !== '') {
                        var clWd = parseInt(colWidth[1]);
                        if (clWd) {
                            if (isMobile && isDefaultWidth && me.config.adjustWidth) { // here quite mixed with outside logic
                                clWd += me.config.adjustWidth;
                            }

                            me.widths[colWidth[0]] = clWd;
                        }
                    }
                }
            }

            if (me.calFlex) { // calculate flex
                me.calculateFlexs();
            }
        }
    };
    
    me.getWidth = function(colId, defWidth) {
        var cw = me.widths[colId];
        if (!cw) {
            if (defWidth) {
                cw = defWidth;
            } else {
                cw = me.defColWidth || 50; // default to 50
            }

        }
        return cw;
    };
    
    me.getFlex = function(colId, defFlex) {
        if (me.calFlex) {
            var cf = me.flexs[colId];
            if (!cf) {
                if (defFlex) {
                    cf = defFlex;
                } else {
                    cf = me.defFlex;
                }

            }
            return cf;
        } else {
            return me.getWidth(colId);
        }
    };

    me.setWidth = function(colId, width) {
        me.widths[colId] = width;
    };

    me.toString = function() {
        var strArr = [];
        for (var i in me.widths) {
            var colStr = i + '=' + me.widths[i];
            strArr.push(colStr);
        }

        return strArr.join(',');
    };

    me.save = function() {
        var colWidth = me.toString();
        cookies.createCookie(me.cookieKey, colWidth, 1800);
        if (me.colWidthKey) {
            N2N_CONFIG.userColWidth[me.colWidthKey] = colWidth;
        }
        if (me.paramKey) {
            columnWidthSaveManager.addWidthObj(me.paramKey, me.cookieKey, me.colWidthKey);
        }
    };
    
    me.calculateFlexs = function() {
        var totalWidth = 0;
        
        for (var w in me.widths) {
            totalWidth += me.widths[w];
        }

        for (var w in me.widths) {
            me.flexs[w] = me.widths[w] / totalWidth;
        }
    };
    
    me.init();
};

var LayoutConfig = function(lyConf) {
    var me = this;
    me.codeList = [];
    
    me.getScreenKey = function(comp, compKey) {
        var scrKey = comp;
        if (compKey) {
            scrKey += '_' + spaceToUnderscore(compKey);
        }

        return scrKey;
    };
    me._readConfig = function(layoutConfig) {
        me.changed = false;
        me.activeIndex = {};
        me.activeWlIndex = {};
        /*
            var confArr = dollarToSpace(layoutConfig).split('~'); // split for main layout and screen config

            var appLayoutArr = confArr[0].split(',');
            me.appLayout = appLayoutArr[0];
            me.remember = jsutil.toBoolean(appLayoutArr[1] || 1);
            me.remember_m = jsutil.toBoolean(appLayoutArr[2] || 1);

            // if current layout is not enabled, use the first one
            if (N2N_CONFIG.layoutSettingItems.indexOf(me.appLayout) == -1) {
                me.appLayout = N2N_CONFIG.layoutSettingItems[0];
            }
            if (isMobile) {
                me.appLayout = APP_LAYOUT.WINDOW;
            }
        */

        // read sub layout and configured screen
        var cfScr = {};
        if (layoutConfig) {
            var scrArr = dollarToSpace(layoutConfig).split('{'); // split for each screen config
            for (var i = 0; i < scrArr.length; i++) {
                var scrCfArr = scrArr[i].split('='); // split for screen value config
                if (scrCfArr.length > 1) {
                    // split multiple items for each screen
                    var scrCfMulArr = scrCfArr[1].split('[');
                    var cfVal = {};
                    
                    var activeIndex = null;
                    if (me._isMt(scrCfArr[0])) {
                        activeIndex = scrCfArr[3];
                    }
                    
                    var indexMatched = false;
                    var lastItem = null;
                    var itemCount = scrCfMulArr.length;
                    for (var m = 0; m < itemCount; m++) {
                        var scrCfValArr = scrCfMulArr[m].split(',');

                        if (scrCfArr[0] == 't' || scrCfArr[0] == 'w') {
                            cfVal = {
                                subLayout: scrCfValArr[0]
                            };
                            
                            if (scrCfArr[0] === 'w') {
                                if (scrCfValArr.length > 1) {
                                    cfVal.openAs = scrCfValArr[1];
                                }
                            } else {
                                if (scrCfValArr.length > 1) {
                                    cfVal.splitScreen = scrCfValArr[1];
                                }
                            }
                            
                        } else {
                            if (!jsutil.isEmpty(scrCfValArr[0])) {
                                var mScr = {
                                    comp: scrCfValArr[0]
                                };

                                if (scrCfValArr[1]) { // key
                                    mScr.key = scrCfValArr[1];
                                }
                                var scrKey = me.getScreenKey(mScr.comp, scrCfValArr[1]);
                                if (isStockCode(mScr.key)) {
                                    if (me.codeList.indexOf(mScr.key) === -1) {
                                        me.codeList.push(mScr.key);
                                    }

                                    mScr.stkname = mScr.key;
                                }

                                if (scrCfArr[0] === 'p') { // exclusive for popup config
                                    if (scrCfValArr[3]) { // width
                                        mScr.width = parseInt(scrCfValArr[3]);
                                    }
                                    if (scrCfValArr[4]) { // height
                                        mScr.height = parseInt(scrCfValArr[4]);
                                    }
                                    if (scrCfValArr[5]) { // x
                                        mScr.x = parseInt(scrCfValArr[5]);
                                    }
                                    if (scrCfValArr[6]) { // y
                                        mScr.y = parseInt(scrCfValArr[6]);
                                    }
                                } else {
                                    if (scrCfValArr[3]) { // index
                                        mScr.index = parseInt(scrCfValArr[3]);
                                    }
                                    
                                    if (activeIndex != null && activeIndex == m) {
                                        if (mScr.comp === 'wl') {
                                            me.activeWlIndex[scrCfArr[0]] = m;
                                        } else {
                                            me.activeIndex[scrCfArr[0]] = m;
                                        }
                                        indexMatched = true;
                                    }
                                }
                                
                                if (!indexMatched && m === itemCount - 1) {
                                    lastItem = mScr;
                                }
                                
                                cfVal[scrKey] = mScr;
                            }

                        }

                    }
                    
                    if (me._isMt(scrCfArr[0]) && lastItem) {
                        // select the last item
                        if (lastItem.comp === 'wl') {
                            me.activeWlIndex[scrCfArr[0]] = itemCount - 1;
                        } else {
                            me.activeIndex[scrCfArr[0]] = itemCount - 1;
                        }
                        activeIndex = itemCount - 1;
                    }

                    cfScr[scrCfArr[0]] = cfVal;
                    if (me._isMt(scrCfArr[0])) {
                        if (scrCfArr[2]) { // size
                            cfScr[scrCfArr[0]].size = scrCfArr[2];
                        }
                        if (activeIndex) { // active index
                            cfScr[scrCfArr[0]].activeIndex = activeIndex;
                        }
                        if (scrCfArr[4]) { // hidden
                            cfScr[scrCfArr[0]].hidden = jsutil.toBoolean(scrCfArr[4]);
                        }
                    }

                }
            }
        }
        
        /*
        // default config
        if (!cfScr.t) {
            cfScr.t = {
                subLayout: '2',
                splitScreen: '0'
            };
        }
        */
        if (!cfScr.w) {
            cfScr.w = {};
        }

        // set default screens for tab
        if (me.appLayout == APP_LAYOUT.TAB) {
            if (isTablet && cfScr.t.subLayout > 3 && cfScr.t.subLayout < 6) {
                cfScr.t.subLayout = '2';
            }
            if (!cfScr.tab2) {
                cfScr.tab2 = {
                    size: '',
                    comp: 'md'
                };
            }
            if (!cfScr.tab3) {
                cfScr.tab3 = {
                    size: '',
                    comp: 'gn'
                };
            }
            if (!cfScr.tab4) {
                cfScr.tab4 = {
                    size: '',
                    comp: 'mo'
                };
            }
        }

        me.cfScr = cfScr;
    };
    
    me._isMt = function(mt) {
        if (mt) {
            return mt.indexOf('mt') > -1;
        }

        return false;
    };
    me._isP = function(mt) {
        return mt === 'p';
    };
    me.updateKey = function(scrId, comp, compKey, stkname, oldKey) {
        if (compKey == oldKey) { // no need to update if new and old key are the same otherwise results a bug where a componet missing from the layout
            return;
        }
        
        var oldScrKey = me.getScreenKey(comp, oldKey);
        if (me.cfScr[scrId] && me.cfScr[scrId][oldScrKey]) {
            // copy old value to the new key
            var newScrKey = me.getScreenKey(comp, compKey);
            me.cfScr[scrId][newScrKey] = me.cfScr[scrId][oldScrKey];
            // update new values
            me.cfScr[scrId][newScrKey].key = compKey;
            if (stkname) {
                me.cfScr[scrId][newScrKey].stkname = stkname;
            }

            // remove old key
            delete me.cfScr[scrId][oldScrKey];
        }
    };
    me.removeKey = function(scrId, comp, key) {
        var scrKey = me.getScreenKey(comp, key);
        
        if (me.cfScr[scrId] && me.cfScr[scrId][scrKey]) {
            delete me.cfScr[scrId][scrKey];
        }

    };
    me.setScreen = function(scrId, comp, width, height, x, y) {
        if (scrId === 'p') { // avoid saving fullscreen popup
            var appMainSize = n2nLayoutManager.getSize();
            if (appMainSize.width === width && appMainSize.height === height) {
                return;
            }
        }
        
        if (comp && comp.savingComp) { // save only component which has savingComp=true
            // allow only one screen for mobile screen ('am')
            if (scrId === 'am') {
                me.cfScr[scrId] = {};
            }
            
            var scrKey = me.getScreenKey(comp.type, comp.key);

            if (!me.cfScr[scrId]) {
                me.cfScr[scrId] = {};
            }
            if (!me.cfScr[scrId][scrKey]) {
                me.cfScr[scrId][scrKey] = {};
            }
            
            me.cfScr[scrId][scrKey].comp = comp.type;
            if (comp.key) {
                me.cfScr[scrId][scrKey].key = comp.key;
                if (comp.stkname) {
                    me.cfScr[scrId][scrKey].stkname = comp.stkname;
                }
            } else {
                // removes unused member
                delete me.cfScr[scrId][scrKey].key;
                delete me.cfScr[scrId][scrKey].stkname;
            }

            if (width) {
                me.cfScr[scrId][scrKey].width = width;
            }

            if (height) {
                me.cfScr[scrId][scrKey].height = height;
            }

            if (x != null) {
                me.cfScr[scrId][scrKey].x = x;
            }

            if (y != null) {
                me.cfScr[scrId][scrKey].y = y;
            }

            me.changed = true;
            /*
            if (touchMode && me.getRemember()) { // fix issue on touch device since onbeforeunload not supported
                n2nStorage.set('layout', me.toString());
                n2nStorage.set('mappedNames', Ext.encode(mappedNames));
                n2nStorage.set('layoutSync', false);
            }
            */
        }

    };
    me.setMtScreen = function(scrId, scrKey, compKey, compStkName){
    	if (!me.cfScr[scrId]) {
            me.cfScr[scrId] = {};
        }
        if (!me.cfScr[scrId][scrKey]) {
            me.cfScr[scrId][scrKey] = {};
        }
        
        me.cfScr[scrId][scrKey].comp = scrKey;
        if (compKey) {
            me.cfScr[scrId][scrKey].key = compKey;
            if (compStkName) {
                me.cfScr[scrId][scrKey].stkname = compStkName;
            }
        } else {
            // removes unused member
            delete me.cfScr[scrId][scrKey].key;
            delete me.cfScr[scrId][scrKey].stkname;
        }
        
        me.changed = true;
    };
    me.removeMtScreen = function(scrId) {
        if (me.cfScr[scrId]) {
            delete me.cfScr[scrId];
        }

        me.changed = true;
    };
    me.removeScreen = function(scrId, comp, compKey) {
        if (me.cfScr[scrId]) {
            var scrKey = me.getScreenKey(comp, compKey);
            delete me.cfScr[scrId][scrKey];
        }

        me.changed = true;
    };
    me.getScreen = function(scrId) {
        return me.cfScr[scrId];
    };
    me.getScreenConfig = function(comp, compKey) {
        var scrKey = me.getScreenKey(comp, compKey);
        var configs = [];

        for (var mt in me.cfScr) {
            var mtScr = me.cfScr[mt];
            if (mtScr[scrKey]) {
                configs.push(mtScr[scrKey]);
            }
        }

        return configs;
    };

    me.getScreenSize = function (scrId, isMct, defVal, isHiddenMct) {
        var scrSize = 0;

        if (isMct && isHiddenMct) {
            return scrSize;
        }

        if (!me.cfScr[scrId] || jsutil.isEmpty(me.cfScr[scrId].size)) {
            if (defVal) {
                scrSize = defVal;
            } else {
                scrSize = isMct ? 0.25 : 0.5;
            }
        } else {
            scrSize = parseFloat(me.cfScr[scrId].size);
        }

        return scrSize;
    };
    me.setScreenSize = function(scrId, scrSize) {
        if (!me.cfScr[scrId]) {
            me.cfScr[scrId] = {};
        }
        me.cfScr[scrId].size = Math.round(scrSize * 100) / 100;

        me.changed = true;
    };
    me.setScreenHidden = function(scrId, hidden) {
        if (!me.cfScr[scrId]) {
            me.cfScr[scrId] = {};
        }

        me.cfScr[scrId].hidden = hidden;

        me.changed = true;
    };
    me.getScreenHidden = function(scrId) {
        if (!me.cfScr[scrId] || jsutil.isEmpty(me.cfScr[scrId].hidden)) {
            return true; // default to hidden
        } else {
            return me.cfScr[scrId].hidden;
        }
    };
    me.setActive = function(scrId, comp, compKey) { // set active status
        var scrKey = me.getScreenKey(comp, compKey);

        if (me.cfScr[scrId] && me.cfScr[scrId][scrKey]) {
            // reset active from all other screens
            for (var s in me.cfScr[scrId]) {
                delete me.cfScr[scrId][s]['active'];
            }

            me.cfScr[scrId][scrKey].active = 1;

            me.changed = true;
        }
    };
    me.setTabIndex = function(scrId, comp, compKey, index) {
        var scrKey = me.getScreenKey(comp, compKey);

        if (me.cfScr[scrId] && me.cfScr[scrId][scrKey]) {
            me.cfScr[scrId][scrKey].index = index;

            me.changed = true;
        }
    };
    me.setActiveTabIndex = function(scrId, index) {
        if (me.cfScr[scrId]) {
            me.cfScr[scrId].activeIndex = index;

            me.changed = true;
        }
    };
    me.getActiveTabIndex = function(scrId) {
        if (me.cfScr[scrId]) {
            return me.cfScr[scrId].activeIndex || 0;
        }

        return 0;
    };

    me.setAppLayout = function(appLayout) {
        me.appLayout = appLayout;
        me.changed = true;
    };
    me.getAppLayout = function() {
        return me.appLayout;
    };
    me.setSubLayout = function(subLayout) {
        if (me.appLayout == APP_LAYOUT.TAB) {
            me.cfScr.t.subLayout = subLayout;
        } else if (me.appLayout == APP_LAYOUT.WINDOW) {
            me.cfScr.w.subLayout = subLayout;
        }

        me.changed = true;
    };
    me.getSubLayout = function(appLayout) {
        // appLayout = appLayout || me.appLayout;
        if (me.cfScr) {
            appLayout = APP_LAYOUT.WINDOW;

            if (appLayout == APP_LAYOUT.TAB) {
                return me.cfScr.t.subLayout;
            } else if (appLayout == APP_LAYOUT.WINDOW) {
                return me.cfScr.w.subLayout;
            }
        }

        return '';
    };

    me.setSplitScreen = function(split) {
        me.cfScr.t.splitScreen = split;
    };
    me.getSplitScreen = function() {
        return me.cfScr.t.splitScreen;
    };
    me.shouldSave = function() {
        return layoutProfileManager.getRememberLastLayout() && me.changed;
    };
    me.setRemember = function(remember) {
        if (isMobile) {
            me.remember_m = remember;
        } else {
            me.remember = remember;
        }

        me.changed = true;
    };
    me.getRemember = function() {
        if (isMobile) {
            return me.remember_m;
        } else {
            return me.remember;
        }
    };
    me.getOpenAs = function() { // applicable for window layout only
        if (me.cfScr.w && me.cfScr.w.openAs) {
            return me.cfScr.w.openAs;
        } else {
            return '1'; // default as tab
        }
    };
    me.setOpenAs = function(openAs) {
        if (me.cfScr.w) {
            me.cfScr.w.openAs = openAs;
            me.changed = true;
        }
    };
    
    me.backup = function(){
        me._temp = me.toString();
    };
    me.removeBackup = function(){
        delete me._temp;
    };
    me.restore = function(){
        // re-read config
        me._readConfig(me._temp);
        // remove backup if any
        me.removeBackup();
    };
    me.isLayoutKey = function(key) {
        return key !== 'size' && key !== 'activeIndex' && key !== 'hidden';
    };

    me.toString = function() {
        // reset mapped name
        mappedNames = {};
        
        /*
        var appLayout = [
            me.appLayout,
            jsutil.boolToStr(me.remember, '1', '0'),
            jsutil.boolToStr(me.remember_m, '1', '0')
        ];
        var lyArr = [appLayout.join(',')];
        */
       
        var scrArr = new Array();

        for (var k in me.cfScr) {
            var scrStr = '';

            if (k === 't' || k === 'w') { // layout config
                if (k === 'w') {
                    var wcf = [];
                    if (me.cfScr.w && me.cfScr.w.subLayout) {
                        wcf.push(me.cfScr.w.subLayout);
                    }
                    if (me.cfScr.w && me.cfScr.w.openAs == '0') {
                        if (!me.cfScr.w.subLayout) {
                            wcf.push('');
                        }
                        wcf.push(me.cfScr.w.openAs);
                    }
                    scrStr = k + '=' + wcf.toString(',');
                } else {
                    scrStr = k + '=' + jsutil.objectToString(me.cfScr[k], ',');
                }
                
            } else if (k === 'p') { // popup
                var scrItem = [];
                for (var l in me.cfScr[k]) {
                    var scrAttrs = [];
                    var attrs = me.cfScr[k][l];
                    if (attrs.comp) {
                        scrAttrs.push(attrs.comp);
                        var _key = attrs.key || '';
                        scrAttrs.push(_key);
                        scrAttrs.push(''); 
                        // won't save stock name in the same param anymore
                        // but will save to a separate param and mapped cache
                        if (isStockCode(_key)) {
                            if (attrs.stkname) {
                                mappedNames[_key] = attrs.stkname;
                                updateMappedList(_key, attrs.stkname);
                            }
                        }
                        scrAttrs.push(attrs.width || '');
                        scrAttrs.push(attrs.height || '');
                        scrAttrs.push(attrs.x != null ? attrs.x : '');
                        scrAttrs.push(attrs.y != null ? attrs.y : '');

                        scrItem.push(scrAttrs.join(','));
                    }
                }

                if (scrItem.length > 0) {
                    scrStr = k + '=' + scrItem.join('[');
                }
            } else { // tab
                var scrItem = [];

                for (var l in me.cfScr[k]) {
                    if (l !== 'size' && l !== 'activeIndex') {
                        var scrAttrs = [];
                        var attrs = me.cfScr[k][l];
                        if (attrs.comp) {
                            scrAttrs.push(attrs.comp);
                            if (attrs.key) {
                                scrAttrs.push(attrs.key);
                                if (attrs.stkname) {
                                    scrAttrs.push('');
                                    if (isStockCode(attrs.key)) {
                                        mappedNames[attrs.key] = attrs.stkname;
                                        updateMappedList(attrs.key, attrs.stkname);
                                }
                            }
                            }
                            if (attrs.index) {
                                if (!attrs.key) {
                                    scrAttrs.push('');
                                }
                                if (!attrs.stkname) {
                                    scrAttrs.push('');
                                }
                                scrAttrs.push(attrs.index);
                            }

                            scrItem.push(scrAttrs.join(','));
                        }
                    }
                }

                scrStr = k + '=' + scrItem.join('[');
                var hasSize = false, hasActiveIndex = false;
                if (me.cfScr[k].size) {
                    scrStr += '=' + me.cfScr[k].size;
                    hasSize = true;
                }
                if (me.cfScr[k].activeIndex != null) {
                    if (!hasSize) {
                        scrStr += '=';
                        hasSize = true;
                    }
                    scrStr += '=' + me.cfScr[k].activeIndex;
                    hasActiveIndex = true;
                }
                if (me.cfScr[k].hidden == false) {
                    if (!hasSize) {
                        scrStr += '=';
                    }
                    if (!hasActiveIndex) {
                        scrStr += '=';
                    }

                    scrStr += '=0';
                }
            }

            if (scrStr !== '') {
                scrArr.push(scrStr);
            }
        }
        
        /*
        if (scrArr.length > 0) {
            lyArr.push(scrArr.join('{')); // use { instead of ; to work with cookies
        }
        */

        return spaceToDollar(scrArr.join('{'));
    };

    me.isPortalLayout = function() {
        return me.appLayout == APP_LAYOUT.PORTAL;
    };
    me.isWindowLayout = function() {
        return me.appLayout == APP_LAYOUT.WINDOW;
    };
    me.isTabLayout = function() {
        return me.appLayout == APP_LAYOUT.TAB;
    };

    me._readConfig(lyConf);
};

var defAccValues = {
    EMPTY: '0',
    LAST: '1',
    SPECIFIC: '2'
};

var DefaultTradingAccountConfig = function(confStr) {
    var me = this;
    me._defaultAccOpt = N2N_CONFIG.defTradingAccountOpt;
    me._defTrAccLast = '';
    
    if (accRet && accRet.ai.length === 1) { // default to last for one account
        me._defaultAccOpt = defAccValues.LAST;
        me._defTrAccLast = accRet.ai[0].ac + global_AccountSeparator + accRet.ai[0].bc;
    }
    me.config = {};
    me._validateTrAccOpt = function(tdAccOptValue) {
        switch (tdAccOptValue) {
            case defAccValues.EMPTY:
            case defAccValues.LAST:
            case defAccValues.SPECIFIC:
                return tdAccOptValue;
                break;
            default:
                return  me._defaultAccOpt;
        }
    };
    me._readConfig = function(confString) {
        me.configStr = confString;

        var confArr = confString.split('}');
        for (var i = 0; i < confArr.length; i++) {
            var exConfArr = confArr[i].split('{');
            if (exConfArr.length > 1) {
                var exValueArr = exConfArr[1].split(',');
                me['config'][exConfArr[0]] = {
                    defTrAccOpt: me._validateTrAccOpt(exValueArr[0]),
                    defTrAccVal: exValueArr[1] || '',
                    defTrAccLast: exValueArr[2] || ''
                };
            }
        }
    };
    me._createExConf = function(exch) {
        if (!me['config'][exch]) {
            me['config'][exch] = {};
        }
    };
    me.getDefTrAccOpt = function(exch) {
        if (me['config'][exch]) {
            return me['config'][exch]['defTrAccOpt'] || me._defaultAccOpt;
        }
        return  me._defaultAccOpt;
    };
    me.setDefTrAccOpt = function(exch, defTrAccOptValue) {
        if (exch && defTrAccOptValue) {
            me._createExConf(exch);
            me['config'][exch]['defTrAccOpt'] = defTrAccOptValue;
        }
    };
    me.getDefTrAccVal = function(exch) {
        if (me['config'][exch]) {
            return me['config'][exch]['defTrAccVal'] || '';
        }
        return '';
    };
    me.setDefTrAccVal = function(exch, defTrAccValValue) {
        if (exch && defTrAccValValue) {
            me._createExConf(exch);
            me['config'][exch]['defTrAccVal'] = defTrAccValValue;
        }
    };
    me.getDefTrAccLast = function(exch) {
        if (me['config'][exch]) {
            return me['config'][exch]['defTrAccLast'] || me._defTrAccLast;
        }
        return me._defTrAccLast;
    };
    me.setDefTrAccLast = function(exch, defTrAccLastValue) {
        if (exch && defTrAccLastValue) {
            me._createExConf(exch);
            me['config'][exch]['defTrAccLast'] = defTrAccLastValue;
        }
    };

    me.revert = function() {
        // recreates config from previous version
        me._readConfig(me.configStr);
    };
    me.save = function() {
        var confStrArr = [];
        for (var conf in me['config']) {
            var exConf = me['config'][conf];
            var conArr = [];
            for (var confKey in exConf) {
                if (!jsutil.isEmpty(exConf[confKey])) {
                    conArr.push(exConf[confKey]);
                }
            }
            confStrArr.push(conf + '{' + conArr.join(','));
        }

        me.configStr = confStrArr.join('}');
        return me.configStr;
    };

    me._readConfig(confStr);

};

function RecentQuote(confStr) {
    var me = this;
    me.saveUrl = addPath + 'tcplus/setting?a=set&sc=TCLRQL&p=';
    me.delimiter = ',';
    me.list = [];
    me.comp = '';
    me.changed = false;

    me.add = function(stkCode) {
        // add outbound stock validation
        stkCode = validateOutboundStock(stkCode);
        if (!stkCode) {
            return false;
        }
        
        var listCount = me.list.length;
        if (listCount > 0 && me.list[listCount - 1] === stkCode) { // if that stock is the latest, no need to do anything
            return false;
        }

        var stkToRemove = [];
        // make sure to remove the existing code
        if (me.remove(stkCode)) {
            stkToRemove.push(stkCode);
        }

        // if max counter reaches, remove the oldest counter
        if (me.list.length >= N2N_CONFIG.maxRecent) {
            var lastStk = me.list.shift();
            if (lastStk) {
                stkToRemove.push(lastStk);
            }
        }

        if (stkToRemove.length > 0) { // remove from recent quote panel if opening
            if (recentQuotePanel) {
                recentQuotePanel.deleteStocks(stkToRemove);
            }
        }
        
        var addedCount = me.list.push(stkCode);
        me.setChanged(true);
        if (recentQuotePanel) {
            recentQuotePanel.newStock = true;
            recentQuotePanel.addStock([stkCode], 0); // auto add to recent quote if opening
        }

        return addedCount;
    };

    me.addRecent = function(type, stkCode) {
        if (me.isComp(type)) {
            me.add(stkCode);
        }
    };

    me.remove = function(stkCode) {
        var idx = me.list.indexOf(stkCode);
        if (idx > -1) {
            me.setChanged(true);
            return me.list.splice(idx, 1).length > 0;
        }
        
        return false;
    };
    me.removeAll = function() {
        me.list = [];
        me.setChanged(true);
    };

    me.getRecentList = function() { // return in reverse order so the lastest will be displayed on top
        return [].concat(me.list).reverse();
    };

    me._readConfig = function(conf) {
        if (conf !== '' && conf !== '0') {
            me.list = conf.split(me.delimiter);
        }
    };

    me.setComp = function(compList) {
        me.comp = compList;
    };

    me.isComp = function(comp) {
        return me.comp.indexOf(comp) > -1;
    };

    me.toString = function() {
        var str = me.list.join(me.delimiter);
        if (str === '') {
            str = '0'; // need to insert placeholder or can't save to ATP
        }
        return str;
    };

    me.setChanged = function(status) {
        me.changed = status;
    };

    me.getChanged = function() {
        return me.changed;
    };

    me.save = function(asyncMode) {
        if (me.getChanged()) { // save only when there is change
            if (me.saveAjax && me.saveAjax.abort) {
                me.saveAjax.abort();
            }

            me.saveAjax = Ext.Ajax.request({
                url: me.saveUrl + me.toString(),
                async: asyncMode != null ? asyncMode : true,
                success: function() {
                    me.setChanged(false);
                },
                complete: function() {
                    me.saveAjax = null;
                }
            });
        }

    };

    me._readConfig(confStr);
}

var autoSaveManager = {
    savableItems: [],
    interval: 60000, // 1mn
    add: function(svItem) {
        var me = this;
        if (svItem && typeof svItem.save === 'function') {
            me.savableItems.push(svItem);
        }
    },
    start: function() {
        var me = this;

        if (me.savableItems.length > 0) {
            if (!me.runner) {
                me.runner = setInterval(function() {
                    me.saveAll();
                }, me.interval);
            }
        }
    },
    stop: function() {
        var me = this;

        if (me.runner) {
            clearInterval(me.runner);
            me.runner = null;
        }
    },
    saveAll: function(async) {
        var me = this;
        
        if (!me.saving) {
            me.saving = true;

            for (var k in me.savableItems) {
                var sv = me.savableItems[k];
                sv.save(async);
            }

            me.saving = false;
        }
        
    }
};

function UserItemList(confStr) {
    var me = this;
    me.delimiter1 = ',';
    me.list = [];
    
    me.getIndex = function(item) {
        return me.list.indexOf(item);
    };
    me.exist = function(item) {
        return me.getIndex(item) > -1;
    };
    me.add = function(item) {
        if (!me.exist(item)) {
            me.list.push(item);
        }
    };
    me.remove = function(item) {
        var itemIdx = me.getIndex(item);
        if (itemIdx > -1) {
            me.list.splice(itemIdx, 1);
        }
    };
    me.toString = function() {
        return me.list.join(me.delimiter1);
    };
    me._readConfig = function(config) {
        me.list = config.split(me.delimiter1);
    };
    me.save = function() {
        if (me.saveUrl) {
            Ext.Ajax.request({
                url: me.saveUrl + me.toString(),
                success: function() {
                }
            });
        }
    };

    me._readConfig(confStr);
}

function UserPreference(confStr, enabledConf, saveUrl, param, del1, del2) {
    var me = this;
    me.saveUrl = saveUrl;
    me.delimiter1 = del1 || '{';
    me.delimiter2 = del2 || '=';
    me.conf = {};
    me.enabled = enabledConf;
    me.method = 'post';
    me.param = param;

    me._readConfig = function(config) {
        if (typeof config === 'string' && me.enabled) { // read config only when enabled
            var confArr = config.split(me.delimiter1);
            for (var i = 0; i < confArr.length; i++) {
                var cfArr = confArr[i].split(me.delimiter2);
                if (cfArr.length > 1 && cfArr[0] !== '') {
                    me.conf[cfArr[0]] = cfArr[1];
                }
            }
        }
    };
    me.set = function(param, value) {
        me.conf[param] = value;
        
        return me.conf[param];
    };
    me.get = function(param, defVal) {
        if (me.conf[param] != null) {
            if (typeof me.conf[param] === 'string') {
                return me.conf[param].trim();
            }

            return me.conf[param];
        }

        return defVal;
    };
    me.remove = function(param) {
        delete me.conf[param];
    };
    me.toString = function() {
        var confArr = [];
        for (var c in me.conf) {
            var val = me.conf[c];
            if (typeof val === 'boolean') {
                val = jsutil.boolToStr(val, '1', '0');
            }
            confArr.push([c, val].join(me.delimiter2));
        }

        return confArr.join(me.delimiter1);
    };
    
    var successResult = false;
    me.save = function(asyncMode, successCallback, failureCallback) {
        if (me.enabled) {
            var params = {};
            params[me.param] = me.toString();
            
            Ext.Ajax.request({
                url: me.saveUrl,
                method: me.method,
                params: params,
                async: asyncMode != null ? asyncMode : true,
                success: function() {
                    successResult = true;
                },
                callback: function() {
                    if (successResult) {
                        if (typeof successCallback === 'function') {
                            successCallback();
                        }
                    } else {
                        if (typeof failureCallback === 'function') {
                            failureCallback();
                        }
                    }
                }
            });
        }
    };
    
    me._readConfig(confStr);
}

function ConfigReader(confStr, del1, del2) {
    var me = this;
    me.delimiter1 = del1 || '{';
    me.delimiter2 = del2 || '=';
    me.conf = {};

    me._readConfig = function(config) {
        if (typeof config === 'string') {
            var confArr = config.split(me.delimiter1);
            for (var i = 0; i < confArr.length; i++) {
                var cfArr = confArr[i].split(me.delimiter2);
                if (cfArr.length > 1 && cfArr[0] !== '') {
                    me.conf[cfArr[0]] = cfArr[1];
                }
            }
        }
    };
    me.set = function(param, value) {
        me.conf[param] = value;
        
        return me.conf[param];
    };
    me.get = function(param, defVal) {
        if (me.conf[param] != null) {
            if (typeof me.conf[param] === 'string') {
                return me.conf[param].trim();
            }

            return me.conf[param];
        }

        return defVal;
    };

    me.toString = function() {
        var confArr = [];
        for (var c in me.conf) {
            var val = me.conf[c];
            if (typeof val === 'boolean') {
                val = jsutil.boolToStr(val, '1', '0');
            }
            confArr.push([c, val].join(me.delimiter2));
        }

        return confArr.join(me.delimiter1);
    };
    
    me._readConfig(confStr);
}

function N2NStorage(storageId) {
    var me = this;
    me.supported = Ext.util.LocalStorage.supported;

    if (me.supported) {
        me.store = Ext.util.LocalStorage.get(storageId);
    }
    me.set = function(name, value) {
        if (me.store) {
            me.store.setItem(name, value);
        }
    };
    me.get = function(name, defVal) {
        if (me.store) {
            defVal = defVal || null;
            return me.store.getItem(name) || defVal;
        }
    };
    me.getStorage = function() { // get Ext localStorage object for direct manipulation
        return me.store;
    };
}

var layoutProfileManager = {
    init: function() {
        var me = this;
        me._cols = {};

        me.layoutPreference = new UserPreference(N2N_CONFIG.layoutPrf, true, addPath + 'tcplus/setting?a=set&sc=TCLLPRF', 'p');
        // profile column settings
        var profile = me.getActiveProfile();
        me._cols[profile] = new UserPreference(N2N_CONFIG.profileCols, true, addPath + 'tcplus/setting?a=set&sc=TCLPCOL' + profile.toUpperCase(), 'p');
        me._cols[profile].method = 'post';
    },
    getLastSelectedExchange: function() {
        var me = this;

        var profile = me.getActiveProfile();

        if (profile && userPreference) {
            var exchStr = userPreference.get('last_ex_' + profile);
            if (exchStr) {
                var exArr = exchStr.split(',');

                return {
                    exch: exArr[0] || null,
                    sort: exArr[1] || null,
                    market: exArr[2] || null,
                    secList: exArr[3] || null,
                    sector: exArr[4] || null
                };
            }
        }

        return {};
    },
    setLastSelectedExchange: function (exchange, sort, market, secList, sector) {
        if (userPreference && exchange) {
            var me = this;
            
            var exchArr = [
                exchange,
                sort || '',
                market || '',
                secList || '',
                sector || ''
            ];
            
            var profile = me.getActiveProfile();
            if (profile) {
                userPreference.set('last_ex_' + profile, exchArr.join(','));
                userPreference.save();
            }
        }
    },
    getActiveProfile: function () {
        if (isMobile) {
            return 'm';
        }

        return this.layoutPreference.get('active_lp', 1); // default profile to 1
    },
    setActiveProfile: function(profile) {
        this.layoutPreference.set('active_lp', profile);
    },
    getProfileLayout: function(profile, layoutId) {
        var useCurrentLayout = false;
        if (!layoutId) {
            layoutId = this.layoutPreference.get(profile);
            useCurrentLayout = true;
        }

        // get layout ID for this profile
        var layout;
        if (layoutId) {
            var profileId = layoutId + profile;
            // get user layout
            layout = N2N_CONFIG.userLayouts[profileId];
        }

        if (!layout) {
            // if profile does not have layout yet, use the default one
            if (useCurrentLayout) {
                layoutId = N2N_CONFIG.defLayoutProfiles[profile];
            }

            layout = this.getDefaultProfileLayout(layoutId);
        }

        return layout || '';
    },
    getDefaultProfileLayout: function(layout) {
        return N2N_CONFIG.defLayouts[layout];
    },
    getActiveLayout: function() {
        if (isMobile) {
            return N2N_CONFIG.mbLayout;
        } else if (isGuestUser || isBasicVer) {
            return N2N_CONFIG.guestLayout;
        } else {
            return this.getProfileLayout(this.getActiveProfile());
        }
    },
    setRememberLastLayout: function(status) {
        this.layoutPreference.set('rem_' + currentDeviceKey, status);
    },
    getRememberLastLayout: function() {
        return jsutil.toBoolean(this.layoutPreference.get('rem_' + currentDeviceKey));
    },
    setOpenAs: function(status) {
        this.layoutPreference.set('ope_' + currentDeviceKey, status);
    },
    getOpenAs: function() {
        return this.layoutPreference.get('ope_' + currentDeviceKey);
    },
    setMainLayout: function(status) {
        this.layoutPreference.set('mnl_' + currentDeviceKey, status);
    },
    getMainLayout: function() {
        return this.layoutPreference.get('mnl_' + currentDeviceKey);
    },
    saveLayoutPreference: function(asyncMode, successCallback, failureCallback) {
        this.layoutPreference.save(asyncMode, successCallback, failureCallback);
    },
    getProfileSubLayout: function() {
        var me = this;
        var curPro = me.getActiveProfile();
        return me.layoutPreference.get(curPro);
    },
    requestSaveProfileLayout: function(asyncMode, successCallback, failureCallback, displayMsg) {
        if (n2nLayoutManager) {
            var me = this;
            var lyStr = n2nLayoutManager.lyConf.toString();
            n2nLayoutManager.removeBackupLayout();
            var subLayout = n2nLayoutManager.getSubLayout();

            var scKey = 'TCLMBML';
            var mscKey = 'TCLMBMN';
            if (!isMobile) { // TODO tablet
                var curPro = me.getActiveProfile();
                var profileId = subLayout + curPro;
                scKey = 'TCLUL' + profileId;
                mscKey = 'TCLMN';
                // update user layouts cache
                N2N_CONFIG.userLayouts[profileId] = lyStr;
                
                // get current sub layout for current profile, if not set yet need to force saving
                var curSubLayout = me.getProfileSubLayout();
                if (!curSubLayout) {
                    me.layoutPreference.set(curPro, subLayout);
                    me.saveLayoutPreference(asyncMode);
                }
                
            }

            n2nStorage.set('layout', lyStr);
            // var mapStr = Ext.encode(mappedNames);
            // n2nStorage.set('mappedNames', mapStr);
            n2nStorage.set('layoutSync', false);

            var successResult = false;

            // save mapped name
            /*
            if (N2N_CONFIG.saveMappedNames) {
                
                Ext.Ajax.request({
                    url: addPath + "tcplus/setting?a=set&sc=" + mscKey,
                    method: 'post',
                    params: {
                        'p': mapStr
                    },
                    async: asyncMode != null ? asyncMode : true
                });
            }
            */

            // save layout
            Ext.Ajax.request({
                url: addPath + "tcplus/setting?a=set&sc=" + scKey,
                method: 'post',
                params: {
                    p: lyStr
                },
                async: asyncMode != null ? asyncMode : true,
                success: function(response) {
                    var res = Ext.decode(response.responseText);
                    if (res && res.s) {
                        n2nStorage.set('layoutSync', true);
                        n2nLayoutManager.lyConf.changed = false;
                        successResult = true;
                    }
                },
                callback: function() {
                    if (successResult) {
                        if (displayMsg) {
                            msgutil.info(languageFormat.getLanguage(21031, 'Layout saved successfully.'));
                        }
                        
                        if (typeof successCallback === 'function') {
                            successCallback();
                        }
                    } else {
                        if (displayMsg) {
                            msgutil.warn(languageFormat.getLanguage(21032, 'Failed to save layout.'));
                        }
                        
                        if (typeof failureCallback === 'function') {
                            failureCallback();
                        }
                    }
                }
            });
        }
    },
    getActiveCol: function () {
        var me = this;

        var profile = me.getActiveProfile();
        return me._cols[profile];
    },
    getCol: function (colName) {
        var me = this;

        var col = me.getActiveCol();
        if (col) {
            return col.get(colName, '');
        }

        return '';
    },
    getColKey: function(id, profile) {
        var me = this;
        if (profile == null) {
            profile = me.getActiveProfile();
        }

        return cookieKey + profile + '_col_' + id;
    },
    setCol: function (colName, colStr) {
        var me = this;

        var col = me.getActiveCol();
        if (col) {
            return col.set(colName, colStr);
        }
    },
    saveCol: function () {
        var me = this;

        if (!isBasicVer && !isGuestUser) {
            var col = me.getActiveCol();
            if (col) {
                col.save();
            }
        }

    },
    loadCols: function (successCallback) {
        var me = this;

        var profile = me.getActiveProfile();
        if (me._cols[profile]) { // use cache if possible
            if (typeof successCallback === 'function') {
                successCallback();
            }
        } else {
            Ext.Ajax.request({
                url: addPath + 'tcplus/atp/clientparam?param=TCLPCOL' + profile.toUpperCase(),
                success: function (response) {
                    var res = {};
                    try {
                        res = Ext.decode(response.responseText);
                    } catch (e) {

                    }
                    if (res.s) {
                        if (res.d != null) {
                            N2N_CONFIG.profileCols = res.d;
                            me._cols[profile] = new UserPreference(N2N_CONFIG.profileCols, true, addPath + 'tcplus/setting?a=set&sc=TCLPCOL' + profile.toUpperCase(), 'p');
                            me._cols[profile].method = 'post';
                            if (typeof successCallback === 'function') {
                                successCallback();
                            }
                        }
                    }
                }
            });
        }

    },
    loadProfileSettings: function (successCallback) {
        var me = this;

        // load last selected exchange
        var lastExch = me.getLastSelectedExchange()['exch'];
        if (lastExch && lastExch != exchangecode) {
            setExchange(lastExch);
            loadExchange();
        }

        // load column setting
        me.loadCols(successCallback);
    }
};

var syncGroupManager = {
    init: function() {
        var me = this;

        me.groupConf = new UserPreference(N2N_CONFIG.syncGroup, true);
        // extra config reading
        
        // no group
        var groupData = [{
                id: 'nogroup',
                name: languageFormat.getLanguage(31700, 'No Group'),
                color: 'transparent'
            }];

        for (var g in me.groupConf.conf) {
            var gp = me.groupConf.conf[g].split(',');
            groupData.push({
                id: g,
                name: languageFormat.getLanguage(gp[0], gp[0] || ''),
                color: gp[1]
            });
        }
        
        // group mix
        groupData.push({
                id: 'groupmix',
                name: languageFormat.getLanguage(31710, 'Group Mix'),
                color: 'transparent'
            });

        me.groupData = groupData;

        me.profileSyncItems = new UserPreference(N2N_CONFIG.syncComp, true, addPath + 'tcplus/setting?a=set&sc=TCLSCG', 'p', ']', '[');
        me.activateProfileItems();

    },
    activateProfileItems: function() {
        var me = this;
        var lp = layoutProfileManager.getActiveProfile();
		if(N2N_CONFIG.syncScreen)
			me.syncItems = new UserPreference(me.profileSyncItems.get(lp, N2N_CONFIG.defSyncComp), true);

    },
    getSyncGroup: function(comp) {
        return this.syncItems.get(comp, 'nogroup');
    },
    setSyncGroup: function(comp, group) {
        var me = this;
        me.syncItems.set(comp, group);

        // update profile sync string
        var lp = layoutProfileManager.getActiveProfile();
        me.profileSyncItems.set(lp, me.syncItems.toString());
    },
    save: function() {
        this.profileSyncItems.save();
    },
    isSyncComp: function(compType) { // check if this component is a sync component
        return N2N_CONFIG.syncScreen && N2N_CONFIG.syncItems.indexOf(compType) > -1;
    },
    isSyncEnabled: function(compType) { // check if sync is enabled for this component (when it has group)
        var me = this;

        var group = me.getSyncGroup(compType);
        if (group && group !== 'nogroup') {
            return true;
        }

        return false;
    },
    isSyncCompVisible: function(comp) { // check if a component is visible and has sync enabled
        var me = this;

        if (comp && helper.inView(comp)) {
            return me.isSyncComp(comp.type) && me.isSyncEnabled(comp.type);
        }

        return false;
    },
    syncAllComps: function(comp, stkCode, stkName) {
        var me = this;

        // check whether current component is a syncing component
        if (me.isSyncComp(comp.type) && me.isSyncEnabled(comp.type)) {
            // market depth
            if (newMarketDepth) {
                me.syncFirstComp(comp, [newMarketDepth], function() {
                    createMarketDepthPanel(stkCode, stkName);
                }, stkCode, stkName);
            }

            // stock info
            me.syncFirstComp(comp, stkInfoPanels, function() {
                createStkInfoPanel(stkCode, stkName);
            }, stkCode, stkName);

            // tracker
            me.syncFirstComp(comp, trackerPanels, function() {
                createTrackerPanel(stkCode, stkName);
            }, stkCode, stkName);

            // intraday chart
            me.syncFirstComp(comp, chartPanels, function() {
                createChartPanel(stkCode, stkName);
            }, stkCode, stkName);

            // analysis chart
            me.syncFirstComp(comp, n2ncomponents.analysisCharts, function() {
                createAnalysisChartPanel(stkCode, stkName);
            }, stkCode, stkName);

            // historical data
            me.syncFirstComp(comp, n2ncomponents.historicalDataViews, function() {
                n2ncomponents.createHistoricalData(stkCode, stkName);
            }, stkCode, stkName);

            // stock news
            me.syncFirstComp(comp, n2ncomponents.stockNews, function() {
                createStkNewsPanel(stkCode, stkName);
            }, stkCode, stkName);
            
            // foreign flow
            me.syncFirstComp(comp, n2ncomponents.fFlows, function() {
                n2ncomponents.createForeignFlows({
                    key: stkCode,
                    name: stkName
                });
            }, stkCode, stkName);
            
            // broker info
            if (n2ncomponents.bkInfo) {
                me.syncFirstComp(comp, [n2ncomponents.bkInfo], function() {
                    if (n2ncomponents.bkInfo) {
                        n2ncomponents.bkInfo.activateSync(stkCode, stkName);
                    }

                }, stkCode, stkName);
            }
            
            // fundamental
            if (userReport['userReport_fundamental_cpiq']) {
                me.syncFirstComp(comp, [userReport['userReport_fundamental_cpiq']], function() {
                    createFundamentalCPIQWin(stkCode, stkName);
                }, stkCode, stkName);
            }
            
            // news
            if (n2ncomponents.news && n2ncomponents.news['enews']) {
                me.syncFirstComp(comp, [n2ncomponents.news['enews']], function() {
                    menuHandler.openNews('', stkCode);
                }, stkCode, stkName);
            }
            
            // broker queue
            me.syncFirstComp(comp, n2ncomponents.brokerQViews, function() {
                n2ncomponents.createBrokerQ({
                    key: stkCode,
                    name: stkName
                });
            }, stkCode, stkName);
            
        }
    },
    syncFirstComp: function(pComp, compArr, callback, stkCode, stkName) {
        if (compArr && compArr.length > 0) {
            var me = this;
            var comp = compArr[0];
            var compGroup = syncGroupManager.getSyncGroup(comp.type);

            if (comp && me.isSyncComp(comp.type) && me.isSyncEnabled(comp.type) &&
                    (syncGroupManager.getSyncGroup(pComp.type) === compGroup || compGroup === 'groupmix')) {
                
                comp.fromSync = true;
                if (helper.inView(comp)) {
                    callback();
                } else if (typeof comp.syncBuffer === 'function') {
                    comp.syncBuffer(stkCode, stkName);
                }
                comp.fromSync = false;
            }

        }
    },
    //SYNC MUTUAL FUND
    syncMutualFundComps: function(comp, stkCode, stkName) {
        var me = this;
        
        if (me.isSyncComp(comp.type) && me.isSyncEnabled(comp.type)) {
            
            // tracker
            me.syncFirstComp(comp, trackerPanels, function() {
                createTrackerPanel(stkCode, stkName);
            }, stkCode, stkName);
            
            // analysis chart
            me.syncFirstComp(comp, n2ncomponents.analysisCharts, function() {
                createAnalysisChartPanel(stkCode, stkName);
            }, stkCode, stkName);
            
            //mutual fund portfolio
            
        }
    }
    
};

var watchlistDetector = {
    list: [],
    add: function(wl, skipMaxMsg) {
        var me = this;
        var exists = me.exists(wl);

        if (!exists && N2N_CONFIG.maxOpenWatchlist !== -1 && (me.list.length === N2N_CONFIG.maxOpenWatchlist)) {
            if (!skipMaxMsg) {
                msgutil.alert(languageFormat.getLanguage(30130, 'Maximum of [PARAM0] watchlists are allowed to open. Kindly close some watchlists and try again.',
                        N2N_CONFIG.maxOpenWatchlist.toString()));
            }

            return false;
        }

        if (!exists) {
            me.list.push(wl);
        }

        return true;
    },
    rename: function(oldName, newName) {
        var me = this;
        for (var i = 0; i < me.list.length; i++) {
            var wl = me.list[i];
            if (wl === oldName) {
                me.list[i] = newName;
                return true;
            }
        }

        return false;
    },
    remove: function(wlName) {
        var me = this;
        for (var i = 0; i < me.list.length; i++) {
            var wl = me.list[i];
            if (wl === wlName) {
                me.list.splice(i, 1);
                return true;
            }
        }

        return false;
    },
    exists: function(wlName) {
        if (wlName) {
            return this.list.indexOf(wlName) > -1;
        }

        return false; // special case for configured empty watchlist 
    },
    clear: function() {
        this.list = [];
    }
};

var columnWidthSaveManager = {
    saveUrl: addPath + 'tcplus/batchsetting?a=set',
    widthObj: {}, // width collection
    addWidthObj: function(paramKey, cookieKey, colWidthKey) {
        this.widthObj[paramKey] = {
            cookieKey: cookieKey,
            colWidthKey: colWidthKey
        };
    },
    removeWidthObj: function(paramKey) {
        delete this.widthObj[paramKey];
    },
    getColWidth: function(colWidthKey, cookieKey, asStr) {
        var me = this;

        // check whether this col width failed to save last time
        var failedParam = me.getFailedKey(cookieKey);

        if (failedParam) {
            var colWidth = cookies.readCookies(cookieKey);

            if (colWidth) {
                // update user col width
                N2N_CONFIG.userColWidth[colWidthKey] = colWidth;

                // remove failed key
                delete me._failedKey[failedParam];

                // add to saving again
                me.addWidthObj(failedParam, cookieKey, colWidthKey);

                if (asStr) {
                    return colWidth;
                } else { // default as array
                    colWidth = colWidth.split(',');
                    if (colWidth.length > 1) {
                        return colWidth;
                    }
                }
            }
        } else {
            if (N2N_CONFIG.userColWidth[colWidthKey]) {
                N2N_CONFIG.userColWidth[colWidthKey] = me.toCookieString(N2N_CONFIG.userColWidth[colWidthKey]);
                var cols = N2N_CONFIG.userColWidth[colWidthKey];

                if (asStr) {
                    return cols;
                } else {
                    cols = cols.split(',');
                    if (cols.length > 1) {
                        return cols;
                    }
                }
            }
        }

        return null;
    },
    getFailedKey: function(cookieKey) {
        var me = this;

        if (!me._failedKey) {
            me._failedKey = Ext.decode(n2nStorage.get('colWidthObj', '{}'));
        }

        for (var k in me._failedKey) {
            if (me._failedKey[k]['cookieKey'] === cookieKey) {
                return k;
            }
        }

        return null;
    },
    getCookieColKey: function(id) {
        return cookieKey + '_col_' + id;
    },
    save: function(asyncMode) {
        var me = this;

        if (!jsutil.isEmptyObject(me.widthObj)) {
            tLog('columnWidthSaveManager -> save');

            var pObj = {};
            var cObj = {};
            for (var paramKey in me.widthObj) {
                var widthValue = N2N_CONFIG.userColWidth[me.widthObj[paramKey]['colWidthKey']];
                // replace | with ~ since | can't be saved to atp
                pObj[paramKey] = me.toAtpString(widthValue);

                cObj[paramKey] = me.widthObj[paramKey]['cookieKey'];
            }

            // keep saving status
            n2nStorage.set('colWidthObj', Ext.encode(cObj));

            // save to db
            Ext.Ajax.request({
                url: me.saveUrl,
                method: 'post',
                params: pObj,
                async: asyncMode != null ? asyncMode : true,
                success: function(response) {
                    var res = Ext.decode(response.responseText);
                    if (res && res.s) {
                        n2nStorage.set('colWidthObj', '{}');

                        // reset collection
                        me.widthObj = {};
                    }
                },
                complete: function() {

                }
            });

        }

    },
    toAtpString: function(str) {
        return str.replace(/\|/g, '~');
    },
    toCookieString: function(str) {
        return str.replace(/~/g, '|');
    },
    adjustAllColWidths: function(paramKey, cookieKey, colWidthKey, adjustWidth) {
        var me = this;
        // adjust width in cookie
        cookies.adjustAllColWidths(cookieKey, adjustWidth);

        // adjust width in memory
        if (N2N_CONFIG.userColWidth[colWidthKey]) {
            // make sure it uses | instead of ~
            N2N_CONFIG.userColWidth[colWidthKey] = me.toCookieString(N2N_CONFIG.userColWidth[colWidthKey]);
            
            var colArr = N2N_CONFIG.userColWidth[colWidthKey].split(',');
            if (colArr[1]) {
                N2N_CONFIG.userColWidth[colWidthKey] = [colArr[0], stockutil.adjustSizes(colArr[1], adjustWidth)].join(',');
                me.addWidthObj(paramKey, cookieKey, colWidthKey);
            }
        }
    },
    adjustAllColWidths2: function(paramKey, cookieKey, colWidthKey, adjustWidth) {
        var me = this;
        // adjust width in cookie
        cookies.adjustAllColWidths2(cookieKey, adjustWidth);

        // adjust width in memory
        if (N2N_CONFIG.userColWidth[colWidthKey]) {
            N2N_CONFIG.userColWidth[colWidthKey] = stockutil.toColWidthConfig2(N2N_CONFIG.userColWidth[colWidthKey], adjustWidth);
            me.addWidthObj(paramKey, cookieKey, colWidthKey);
        }
    }
};

var focusManager = {
    _activeKeyScreen: null,
    addActiveKeyScreenEvent: function(comp) {
        var me = this;

        if (N2N_CONFIG.keyEnabled && comp && comp.el && !comp.keyEnabledEventAdded) {
            tLog('addActiveKeyScreenEvent > add event');

            comp.el.on('click', function() {
                tLog('addActiveKeyScreenEvent > click');

                me.setActiveKeyScreen(comp);
            });
            
            if (comp.tab) { // tab bar
                comp.tab.el.on('click', function() {
                    tLog('addActiveKeyScreenEvent > click tabbar');

                    me.setActiveKeyScreen(comp);
                });
            }
           
            comp.keyEnabledEventAdded = true;
        }
        
        // dirty hack here (should not be put here. to be reviewed)
        if (comp && comp.type == 'od') {
            var odComp = comp.getComponent(0);

            if (odComp) {
                console.log('focusManager > addActiveKeyScreenEvent -> resize orderPad');

                odComp._setCtSize(); // readjus order pad size
            }
        }

    },
    setActiveKeyScreen: function(comp) {
        var me = this;

        if (comp.keyEnabled) {
            var keyId = comp.getId();
            
            if (keyId == me._activeKeyScreen) {
                return;
            }

            tLog('_activeKeyScreen', keyId);

            me._activeKeyScreen = keyId;
            
            if (me.lastFocusedBox && me.lastFocusedBox.el) {
                me.lastFocusedBox.blur();
            }
            
        } else {
            me.resetActiveKeyScreen();
        }
    },
    resetActiveKeyScreen: function() {
        var me = this;
        me._activeKeyScreen = null;
    },
    getActiveKeyScreen: function() {
        var me = this;

        if (me._activeKeyScreen) {
            var comp = Ext.getCmp(me._activeKeyScreen);

            if (comp) {
                var compItem = comp.getComponent(0);
                if (compItem && helper.inView(compItem)) {
                    return compItem;
                }
            }
        }

        // reset active key screen
        me._activeKeyScreen = null;

        return null; // no active key screen
    },
    focusComponent: function(evt) {
        if (!N2N_CONFIG.keyEnabled) {
            return;
        }
        
        var keyCode = evt.keyCode || evt.which;

        if ((keyCode < KEY_CODES.left || keyCode > KEY_CODES.down) && keyCode !== KEY_CODES.enter) { // except arrow keys and enter key

            if (evt.target.tagName !== 'INPUT') {
                var keyComp = focusManager.getActiveKeyScreen();

                if (keyComp && typeof keyComp.focusSearchBox === 'function') {
                    keyComp.focusSearchBox();
                }
                
            }
        } else {
            if (keyCode == KEY_CODES.enter) {
                var keyComp = focusManager.getActiveKeyScreen();

                if (keyComp && typeof keyComp.proceedOnEnter === 'function' && !keyComp.proceedingEnter) {
                    tLog('Proceeding on enter key...');
                    
                    keyComp.proceedingEnter = true;
                    keyComp.proceedOnEnter();

                    // enable proceeding enter key back only after 1s to avoid double enter key
                    setTimeout(function() {
                        keyComp.proceedingEnter = false;
                    }, 1000);
                }
            }
        }
    },
    focusSearchbox: function(box) {
        if (box && !box.isHidden()) {
            var me = this;
            
            box.setRawValue('');
            // temporarily disable selection on focus
            box.selectOnFocus = false;
            box.focus();
            // temporarily enable selection on focus
            box.selectOnFocus = true;
            
            me.lastFocusedBox = box;
        }

    },
    navComponent: function(evt) {
        if (!N2N_CONFIG.keyEnabled) {
            return;
        }
        
        var keyCode = evt.keyCode || evt.which;

        if (keyCode == KEY_CODES.page_down ||
                keyCode == KEY_CODES.page_up ||
                keyCode == KEY_CODES.home ||
                keyCode == KEY_CODES.end) {

            var keyComp = focusManager.getActiveKeyScreen();

            if (keyComp) {
                if (keyCode == KEY_CODES.page_down && typeof keyComp.goNextPage === 'function') { // next page
                    keyComp.goNextPage();

                    return;
                }

                if (keyCode == KEY_CODES.page_up && typeof keyComp.goPrevPage === 'function') { // previous page
                    keyComp.goPrevPage();

                    return;
                }

                if (keyCode == KEY_CODES.home && typeof keyComp.goFirstPage === 'function') { // first page
                    keyComp.goFirstPage();

                    return;
                }

                if (keyCode == KEY_CODES.end && typeof keyComp.goLastPage === 'function') { // last page
                    keyComp.goLastPage();

                    return;
                }
            }
        }
    }
};

/* broker list data store */
var brokerList = {
    data: {},
    addList: function(exch, list) {
        var me = this;
        if (exch) {
            me.data[exch] = list;
        }
    },
    getList: function(exch) {
        var me = this;

        return me.data[exch];
    },
    getBrokerRecord: function(exch, code) {
        var me = this;
        var list = me.getList(exch);
        
        if (list) {
            for (var k in list) {
                if (list[k]['codes']) { // search sub code first
                    if (list[k]['codes'].indexOf(code) > -1) {
                        return list[k];
                    }
                }

                // search by broker id
                if (list[k]['bkCode'] === code) {
                    return list[k];
                }
            }
        }

        return {};
    },
    getBrokerName: function(exch, code) {
        var me = this;
        var bkRec = me.getBrokerRecord(exch, code);

        return bkRec.bkName || '';
    }
};

// keep lot size in case can't get from feed (from oms)
var lotSizeArchives = {
    data: {},
    addLotSize: function(stkCode, lotSize) {
        var me = this;
        lotSize = parseInt(lotSize);

        if (stkCode && lotSize > 0) {
            me.data[stkCode] = lotSize;
        }
    },
    getLotSize: function(stkCode) {
        var me = this;
        var lotSize = me.data[stkCode];

        if (lotSize > 0) {
            return lotSize;
        }

        if (N2N_CONFIG.altLotSize) {
            return N2N_CONFIG.altLotSize;
        }

        return lotSize;
    }
};

function MDConfManager (config) {
    var me = this;
    me.conf = {};
    me.init = function() {
        var me = this;

        if (config) {
            var confArr = config.split(',');

            for (var i = 0; i < confArr.length; i++) {
                var confStr = confArr[i].trim();

                if (confStr) {
                    var innerConfArr = confStr.split('-');

                    if (innerConfArr.length > 1) {
                        var exchObj = {};
                        var exch = innerConfArr[0].trim();

                        exchObj.exch = exch;
                        exchObj.mdType = innerConfArr[1].trim() === '1' ? 'mdl' : 'normal';
                        var level = innerConfArr[2];

                        if (level) {
                            level = parseInt(level.trim());
                            if (!isNaN(level)) {
                                exchObj.level = level;
                            }
                        }

                        me.conf[exch] = exchObj;
                    }
                }
            }
        }

    },
    me.getMDInfo = function(exch) {
        return this.conf[exch];
    };
    
    me.init();
};

var normalMDFidManager = {
    fid1: [fieldBSplit, fieldBqty, fieldBuy, fieldSell, fieldSqty, fieldSSplit],
    fid2: [fieldBSplit2, fieldBqty2, fieldBuy2, fieldSell2, fieldSqty2, fieldSSplit2],
    fid3: [fieldBSplit3, fieldBqty3, fieldBuy3, fieldSell3, fieldSqty3, fieldSSplit3],
    fid4: [fieldBSplit4, fieldBqty4, fieldBuy4, fieldSell4, fieldSqty4, fieldSSplit4],
    fid5: [fieldBSplit5, fieldBqty5, fieldBuy5, fieldSell5, fieldSqty5, fieldSSplit5],
    fid6: [fieldBSplit6, fieldBqty6, fieldBuy6, fieldSell6, fieldSqty6, fieldSSplit6],
    fid7: [fieldBSplit7, fieldBqty7, fieldBuy7, fieldSell7, fieldSqty7, fieldSSplit7],
    fid8: [fieldBSplit8, fieldBqty8, fieldBuy8, fieldSell8, fieldSqty8, fieldSSplit8],
    fid9: [fieldBSplit9, fieldBqty9, fieldBuy9, fieldSell9, fieldSqty9, fieldSSplit9],
    fid10: [fieldBSplit10, fieldBqty10, fieldBuy10, fieldSell10, fieldSqty10, fieldSSplit10],
    getFid: function(level, extraFid) {
        var me = this;
        var fids = [];

        for (var i = 1; i <= level; i++) {
            fids = fids.concat(me['fid' + i]);
        }
        
        if (extraFid) {
            fids.push(fieldStkCode, fieldMsgType);
        }

        return fids;
    },
    getQtyFid: function(level) {
        var me = this;
        var fids = [];

        for (var i = 1; i <= level; i++) {
            var col = me['fid' + i];

            if (col[1]) {
                fids.push(col[1]);
            }
            if (col[4]) {
                fids.push(col[4]);
            }
        }

        return fids;
    }
};
