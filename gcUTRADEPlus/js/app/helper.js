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
        for (var i = 0; i < columns.length; i++) {
            var col = columns[i];
            col.autoSize();
            col.width = col.width + 2;
            if (hasFn) {
                grid.updateColWidthCache(col, col.width);
            }
        }
        grid.resumeLayouts(true);
        grid.resumeEvent('columnresize');

        console.log('autoSizeGrid: ' + (new Date().getTime() - t1) + 'ms');
    },
    updateColWidthCache: function(grid, cookieId, column, newWidth) { // template function
        if (grid.columnHash) {
            var colId = stockutil.stripItemId(grid.getId(), column.getItemId());
            // keeps new width
            grid.columnHash.setItem(colId, newWidth);

            if (global_allowCookies == "TRUE") {
                grid.tempWidth = cookies.procTempCookies(grid, cookieId, colId, newWidth);
                cookies.procCookie(cookieId, grid.tempWidth, cookieExpiryDays);
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
                grid.normalGrid.view._ws_lastScrollPosition = null;
                grid.lockedGrid.view._ws_lastScrollPosition = null;
            } else {
                grid.view._ws_lastScrollPosition = null;
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
    }
};

var ColState = function(colConfig) { // depends on cookies.js
    var me = this;
    me.widths = {};

    if (colConfig) {
        me.config = colConfig;
        me.id = colConfig.id;
    }
    if (colConfig && colConfig.config) {
        var ckConfig = cookies.readCookie(me.id);
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
                    if (isMobile && isDefaultWidth && me.config.adjustWidth) { // here quite mixed with outside logic
                        clWd += me.config.adjustWidth;
                    }
                    me.widths[colWidth[0]] = clWd;
                }
            }
        }
    }

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
        cookies.createCookie(me.id, me.toString(), 1800);
    };
};

var LayoutConfig = function(lyConf) {
    var me = this;
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
            var scrArr = layoutConfig.split('{'); // split for each screen config
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
                                if (me.isStockCode(mScr.key)) { 
                                    mScr.stkname = mappedNames[mScr.key] || mScr.key;
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
    me.isStockCode = function(str) { // suppose key with . is a stock code
        if (typeof str === 'string') {
            return str.indexOf('.') > 0;
        }

        return false;
    };
    me.updateKey = function(scrId, comp, compKey, stkname, oldKey) {
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

    me.getScreenSize = function(scrId, isMct, defVal) {
        var scrSize;
        if (!me.cfScr[scrId] || jsutil.isEmpty(me.cfScr[scrId].size)) {
            if (defVal) {
                scrSize = defVal;
            } else {
                scrSize = isMct ? 0.25 : 0.5;
            }
        } else {
            scrSize = parseFloat(me.cfScr[scrId].size);
        }
        
        if(isMct && me.getScreenHidden(scrId)){
            scrSize = 0; // //
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
                        if (me.isStockCode(_key)) {
                            if (attrs.stkname) {
                                mappedNames[_key] = attrs.stkname;
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
                                    if (me.isStockCode(attrs.key)) {
                                        mappedNames[attrs.key] = attrs.stkname;
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
    me._defaultAccOpt = defAccValues.EMPTY;
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
            if (me.saveAjax) {
                me.saveAjax.abort();
            }

            me.saveAjax = Ext.Ajax.request({
                url: me.saveUrl + me.toString(),
                async: asyncMode != null ? asyncMode : true,
                success: function() {
                    me.setChanged(false);
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
        for (var k in me.savableItems) {
            var sv = me.savableItems[k];
            sv.save(async);
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

function UserPreference(confStr, enabledConf, saveUrl) {
    var me = this;
    me.saveUrl = saveUrl;
    me.delimiter1 = '{';
    me.delimiter2 = '=';
    me.conf = {};
    me.enabled = enabledConf;

    me._readConfig = function(config) {
        if (typeof config === 'string' && me.enabled) { // read config only when enabled
            var confArr = config.split(me.delimiter1);
            for (var i = 0; i < confArr.length; i++) {
                var cfArr = confArr[i].split(me.delimiter2);
                if (cfArr.length > 0 && cfArr[0] !== '') {
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
            Ext.Ajax.request({
                url: me.saveUrl + me.toString(),
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

        me.layoutPreference = new UserPreference(N2N_CONFIG.layoutPrf, true, addPath + 'tcplus/setting?a=set&sc=TCLLPRF&p=');

    },
    getActiveProfile: function() {
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
            var mapStr = Ext.encode(mappedNames);
            n2nStorage.set('mappedNames', mapStr);
            n2nStorage.set('layoutSync', false);

            var successResult = false;

            // save mapped name
            if (N2N_CONFIG.saveMappedNames) {
                Ext.Ajax.request({
                    url: addPath + "tcplus/setting?a=set&sc=" + mscKey + "&p=" + mapStr,
                    async: asyncMode != null ? asyncMode : true
                });
            }

            // save layout
            Ext.Ajax.request({
                url: addPath + "tcplus/setting?a=set&sc=" + scKey + "&p=" + lyStr,
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
    }
};