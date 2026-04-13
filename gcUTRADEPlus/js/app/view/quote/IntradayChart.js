Ext.define('TCPlus.view.quote.IntradayChart', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.intradaychart',
    exchangecode: '',
    stkcode: '',
    stkname: '',
    loadMask: null,
    centerPanel: null,
    tfSearch: null,
    emptyText: languageFormat.getLanguage(30013, 'No result found.'),
    slcomp:"ic",
//    tConf: {
//        tab: 'tab4',
//        altTab: 'tab2'
//    },
    type: 'ic',
    savingComp: true,
    ddComp: true,
    notMainSubscription: true,
    initComponent: function() {
        var panel = this;
        var chtid = panel.id;
        var imgid;
        if (chtid != null && chtid.length > 0) {
            imgid = chtid + '_chartImgPanel';
        } else {
            imgid = 'chartImgPanel';
        }
        
        this.imgid = imgid;
        var chartPanel = null;
        if (!isStockChart) {
            chartPanel = new Ext.container.Container({
                id: imgid,
                bodyStyle: 'border: none;',
                width: '100%'
            });
        } else {
            chartPanel = Ext.create('Ext.ux.IFrame', {
                id: imgid
            });
            panel.initMax = !panel._startup;
        }
        panel.centerPanel = new Ext.container.Container({
            layout: 'fit',
            hidden: true,
            title: 'ChartPanel',
            header: false,
            border: false,
            bodyStyle: 'border: none;',
            items: [
                chartPanel
            ],
            listeners: {
                afterrender: function(thisComp) {
                    panel.loadMask = thisComp.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
                }
            }
        });

        var resultTpl = new Ext.XTemplate(
                '<tpl for=".">',
                '<table class="search-item" cellpadding="0" cellspacing="0" width="100%">',
                '<tr><td width="30%"><span>{' + fieldStkCode + '}</span></td><td width="70%"><span>{' + fieldStkName + '}</span></td></tr>',
                '</table></tpl>'
                );

        var store;
        if (pagingMode) {
            store = new Ext.ux.data.PagingStore({
                reader: reader,
                lastOptions: {params: {start: 0, limit: 7}}
            });
        } else {
            store = Ext.create('Ext.data.Store', {
                model: 'TCPlus.model.SearchRecord'
            });
        }

        this.dataView = new Ext.view.View({
            tpl: resultTpl,
            store: store,
            itemSelector: 'table.search-item',
            singleSelect: true,
            selectedItemCls: 'search-item-selected',
            listeners: {
                beforeselect: function() {
                    return !touchMode;
                },
                itemclick: function(dataView, record, item, index, e, eOpts) {
                    panel.selectSearchResult(dataView, record);
                    if (pagingMode)
                        panel.hidePaging();
                },
                show: function() {
                    var tbar = panel._getTopToolbar();

                    panel.hideRefresh();

                    var btnid = panel.id + '_btnback';
                    var xtype = 'button';
                    if (tbar.getComponent(btnid) == null) {
                        var btnback = {
                            id: btnid,
                            text: languageFormat.getLanguage(10027, 'Back'),
                            xtype: xtype,
                            icon: icoBtnBack,
                            handler: function() {
                                panel.tfSearch.setValue('');
                                panel.dataView.hide();
                                panel.centerPanel.show();
//                                tbar.remove(this.id);
//                                tbar.doLayout();
                            },
                            listeners: {
                                afterrender: function() {
//                                    panel.switchButtonStyle();
                                }
                            }
                        };
                        tbar.insert(3, btnback);
                        tbar.doLayout();
                    }
                },
                hide: function() {
                    panel.showRefresh();
                    var btnid = panel.id + '_btnback';
                    panel._getTopToolbar().remove(btnid);
                    if (pagingMode)
                        panel.hidePaging();
                }
            }
        });

        this.tfSearch = new Ext.form.field.Text({
            width: searchboxWidth,
            autoCreate: {tag: 'input', type: 'text', size: '25', autocomplete: 'off'},
            emptyText: languageFormat.getLanguage(10102, 'Symbol') + '/' + languageFormat.getLanguage(10101, 'Code'),
            selectOnFocus: true,
            listeners: {
                specialkey: function(field, e) {
                    // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                    // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
                    if (e.getKey() == e.ENTER) {
                        panel.search();
                    }
                }
            }
        });

        var xtype = 'button';

        // add paging buttons
        var hidePagingBtns = true;
        var tbPrev = {
            id: 'ic_prev',
            xtype: xtype,
            text: languageFormat.getLanguage(20058, 'Prev'),
            hidden: hidePagingBtns,
            listeners: {
                click: function() {
                    panel.previousPage();
                }
            }
        };

        var tbNext = {
            id: 'ic_next',
            xtype: xtype,
            text: languageFormat.getLanguage(10015, 'Next'),
            hidden: hidePagingBtns,
            listeners: {
                click: function() {
                    panel.nextPage();
                }
            }
        };

        this.paging = new Ext.toolbar.Paging({
            enableOverflow: menuOverflow,
            height: 30,
            store: store,
            displayInfo: false,
            pageSize: 7,
            hidden: true,
            listeners: {
                change: function(paging, pagedata) {
                    if (pagingMode) {
                        var tbar = panel._getTopToolbar();
                        if (pagedata.total > 0) {
                            if (pagedata.total > paging.pageSize) {
                                panel.showPaging();
                            }

                            var page = pagedata.activePage;
                            var lastpage = pagedata.pages;

                            if (pagedata.total <= paging.pageSize) {
                                //disable both
                                tbar.getComponent('ic_prev').disable();
                                tbar.getComponent('ic_next').disable();
                            } else if (page == 1) {
                                //disable prev
                                tbar.getComponent('ic_prev').disable();
                                tbar.getComponent('ic_next').enable();
                            } else if (page == lastpage) {
                                //disable next
                                tbar.getComponent('ic_prev').enable();
                                tbar.getComponent('ic_next').disable();
                            } else {
                                //disable none
                                tbar.getComponent('ic_prev').enable();
                                tbar.getComponent('ic_next').enable();
                            }
                            panel.page = page;
                        } else {
                            tbar.getComponent('ic_prev').disable();
                            tbar.getComponent('ic_next').disable();
                        }
                        tbar.doLayout();
                    }
                }
            }
        });
        var defaultConfig = {
            title: languageFormat.getLanguage(20101, 'Intraday Chart'),
            autoScroll: false,
            header: false,
            border: false,
            layout: 'fit',
            // style: 'margin-bottom: 10px;',
            bodyStyle: 'overflow-y: auto;',
            tools: [{
                    id: 'close',
                    qtip: 'Close Panel',
                    handler: function(event, toolEl, panel) {
                        panel.destroy();
                    }
                }],
            items: [
                panel.dataView,
                panel.centerPanel
            ],
            tbar: {
                itemId: 'inchtbar' + panel.id,
                enableOverflow: menuOverflow,
                autoScroll: menuAutoScroll,
                items: [
                    this.tfSearch, {
                        text: languageFormat.getLanguage(10007, 'Search'),
                        xtype: xtype,
                        icon: icoBtnSearch,
                        handler: function() {
                            panel.search();
                        }
                    }, '->', tbPrev, tbNext, {
                        id: panel.id + '_btnRefresh',
                        text: languageFormat.getLanguage(10008, 'Refresh'),
                        xtype: xtype,
                        icon: icoBtnRefresh,
                        handler: function() {
                            if (panel.stkcode != null && panel.stkcode.length > 0) {
                                panel.loadChart();
                            }
                        }
                    },
                    {
                        xtype: 'stockchartbtn',
                        id: panel.id + '_btnStockChart',
                        handler: function(thisBtn) {
                            thisBtn.loadStockChart(panel.stkcode);
                        }
                    }
                ]
            },
            bbar: this.paging,
            listeners: {
                show: function() {
                    if (!Ext.isEmpty(panel.stkcode)) {
                        panel.centerPanel.show();
                    }
                },
                hide: function() {
                    panel.centerPanel.hide();
                },
                resize: function() {
                    // Reloads chart if panel has been resized and only when
                    // chart is being displayed
                    if (!panel.centerPanel.isHidden() && !isStockChart) {
                        panel.loadChart();
                    }

                    panel.setActive(true);
                }
            }
        };

        Ext.apply(this, defaultConfig);
        this.callParent(arguments);
    },
    search: function() {
        var panel = this;

        var searchKey = panel.tfSearch.getValue();
        searchKey = searchKey.trim();
        if (searchKey != '') {
            if (pagingMode)
                this.hidePaging();

            this.centerPanel.hide();
            this.dataView.show();
            this.dataView.store.removeAll();
//        this.stkcode = null;
//        this.stkname = null;

            panel.page = 0;
            panel.loadMask.show();

            conn.searchStock({
                k: searchKey,
                ex: exchangecode,
                quickSearch: true,
                field: [fieldStkCode, fieldStkName, fieldSbExchgCode],
                success: function(obj) {
                    try {
                        var l = obj.c;
                        if (l == 0) {
                            panel.loadMask.hide();
                            panel.dataView.update('<div class="x-grid-empty">' + panel.emptyText + '</div>');
                        } else {
                            if (pagingMode) {
                                panel.dataView.store.lastOptions.params = Ext.applyIf({start: 0, limit: 7}, panel.dataView.store.lastOptions.params);
                            }
                            panel.dataView.store.loadRawData(obj);
                            panel.loadMask.hide();
                        }
                    } catch (e) {
                        debugutil.debug('IntradayChart > search', null, e, true);
                    }
                }
            });
        } else {
            panel.tfSearch.focus();
        }
    },
    selectSearchResult: function(dtview, record) {
        this.setCode(record.get(fieldStkCode), record.get(fieldStkName));

        this.tfSearch.setValue("");
        this.loadChart();
    },
    loadChart: function() {
        var panelid = this.id;
        var panel = this;
        if (!panel.stkcode) {
            return;
        }
        
        var newTitle = languageFormat.getLanguage(20101, 'Intraday Chart');
        // not display the stock name if it's not html5 chart since user can change it inside the chart and won't reflect back
        if (!isStockChart) {
            newTitle += ' - ' + stockutil.getStockPart(this.stkname);
        }
        
        n2nLayoutManager.updateTitle(this, newTitle);
        n2nLayoutManager.updateKey(panel);

        this.dataView.hide();
        this.centerPanel.show();

        // Do not display chart for HKD
        if (formatutils.getExchangeFromStockCode(panel.stkcode) == 'HKD') {
        	panel.setLoading(false);
            panel.setErrMsg(languageFormat.getLanguage(30902, 'Chart Not Available.'));
            return;
        }
        
        if (!isStockChart) {
            var imgPanel = Ext.get(panelid + '_chartImgPanel');
            if (imgPanel == null) {
                imgPanel = Ext.get('chartImgPanel');
            }

            if (imgPanel == null)
                return;

            imgPanel.update('');
            this.loadMask.show();
            var chartWidth = this.getSize().width;
            var chartHeight = this.body.getHeight() - 5; // decrease by some padding
            Ext.Ajax.request({
                url: addPath + 'tcplus/intradaychart?' + 'k=' + panel.stkcode + '&w=' + chartWidth + '&h=' + chartHeight + '&ex=' + panel.exchangecode + '&t=2&ct=&c=' + formatutils.procThemeColor(), //1.3.29.37 Added c=formatutils.procThemeColor()
                success: function(response) {
                    var text = response.responseText;
                    var obj = null;
                    try {
                        obj = Ext.decode(text);
                    } catch (e) {
                        debug(e);
                        debugutil.debug('IntradayChart > loadChart', null, e, true);
                    }
                    if (obj != null) {
                        if (obj.s == true) {
                            panel.setIntradayChart(obj.d);
                        } else {
                            panel.setErrMsg(obj.d);
                        }
                    } else {
                        debug(response);
                        panel.setErrMsg(languageFormat.getLanguage(30904, 'Failed to request chart.'));
                    }
                    panel.loadMask.hide();
                },
                failure: function() {
                    panel.loadMask.hide();
                    panel.setErrMsg(languageFormat.getLanguage(30904, 'Failed to request chart.'));
                }
            });
        } else {
            //var stkParts = stockutil.getStockParts(panel.stkcode);
        	
        	// Removes delayed exchange suffix. Determine whether exchange is delayed based on param 'View'
            var nonDelayCode = stockutil.removeStockDelay(panel.stkcode);
            var stkParts = stockutil.getStockParts(nonDelayCode);
            var charturl = embeddedStockChartURL + "?code=" + stkParts.code + '&Name=' + encodeURIComponent(stockutil.getStockName(this.stkname)) + "&exchg=" + stkParts.exch + "&mode=d&color=" + formatutils.procThemeColor() 
            				+ '&lang=' + global_Language + '&View=' + (stockutil.isDelayStock(panel.stkcode) ? 'D' : 'R') + '&type=ic&newOpen=' + (jsutil.boolToStr(panel.newOpen, '1', '0'));

            var chartpanel = Ext.getCmp(this.imgid);
            chartpanel.refresh(charturl);
            if (n2nLayoutManager.isTabLayout()) {
                panel.up().on("deactivate", function() {
                    chartpanel.refresh("");
                });
                panel.up().on("activate", function() {
                    chartpanel.refresh(charturl);
                });
            }
            this.loadMask.hide();
        }
    },
    setIntradayChart: function(url) {
        if (Ext.isEmpty(url)) {
            var el = Ext.fly(this.imgid);
            var text = languageFormat.getLanguage(30901, 'Chart data not available.');
            el.update(text);
        } else {
            url = url + '?' + Math.random();
            var el = Ext.fly(this.imgid);
            var img = '<img src="' + url + '" />';
            el.update(img);
        }
    },
    setErrMsg: function(msg) {
        var el = Ext.fly(this.imgid);
        if (Ext.isEmpty(msg)) {
            msg = languageFormat.getLanguage(30901, 'Chart data not available.');
            el.update(msg);
        } else {
            el.update(msg);
        }
    },
    nextPage: function() {
        var store = this.dataView.getStore();
        var total = store.getTotalCount();

        var cursor = this.paging.cursor;
        var size = this.paging.pageSize;

        this.page = cursor / size;
        var islastpage = cursor >= (total - size);
        if (!islastpage) {
            this.paging.moveNext();
        }
    },
    previousPage: function() {
        var store = this.dataView.getStore();
        var total = store.getTotalCount();

        var cursor = this.paging.cursor;
        var size = this.paging.pageSize;

        this.page = cursor / size;
        if (this.page > 0) {
            this.paging.movePrevious();
        }
    },
    hidePaging: function() {
        var tbar = this._getTopToolbar();
        tbar.getComponent('ic_prev').hide();
        tbar.getComponent('ic_next').hide();
    },
    showPaging: function() {
        var tbar = this._getTopToolbar();
        tbar.getComponent('ic_prev').show();
        tbar.getComponent('ic_next').show();
    },
    hideRefresh: function() {
        var tbar = this._getTopToolbar();
        tbar.getComponent(this.id + '_btnRefresh').hide();
        if (N2N_CONFIG.interactiveChartButton) {
            tbar.getComponent(this.id + '_btnStockChart').hide();
        }
    },
    showRefresh: function() {
        var tbar = this._getTopToolbar();
        tbar.getComponent(this.id + '_btnRefresh').show();
        if (N2N_CONFIG.interactiveChartButton) {
            tbar.getComponent(this.id + '_btnStockChart').show();
        }
    },
    _getTopToolbar: function() {
        return this.getDockedComponent('inchtbar' + this.id);
    },
    setCode: function(stkcode, stkname) {
        var me = this;

        if (me.key) {
            me.oldKey = me.key;
        }

        me.key = stkcode;
        me.stkcode = stkcode;
        me.stkname = stkname;
        me.exchangecode = stockutil.getExchange(stkcode);

    },
    refreshEmpty: function() {
        var me = this;

        if (!me.key) {
            menuHandler.intradayChart();
        }
    },
    forceReloadChart: function() {
        var me = this;

        me.loadChart();
        me.needReloadChart = false;
    },
    _updateTitle: function() {
        var me = this;
        var newTitle = languageFormat.getLanguage(20101, 'Intraday Chart');
        if (!isStockChart) {
            newTitle += ' - ' + stockutil.getStockPart(me.stkname);
        }

        n2nLayoutManager.updateTitle(me, newTitle);
        n2nLayoutManager.updateKey(me);
    },
    syncBuffer: function(stkcode, stkname) {
        var me = this;

        // update key and title
        me.setCode(stkcode, stkname);
        me._updateTitle();

        me.needReloadChart = true;

    },
    setChartStatus: function() {
        var me = this;

        if (isStockChart && me.newOpen) {
            me.newOpen = false;
            var chartComp = Ext.getCmp(me.imgid);
            var newUrl = updateQueryStringParameter(chartComp.iframeURL, 'newOpen', '0');
            chartComp.refresh(newUrl);
        }
    }
});