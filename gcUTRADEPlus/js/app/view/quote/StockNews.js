/*
 * _createNewsPanel			: create news grid panel
 * _createSearchPanel		: create search stock grid panel
 * 
 * 
 * searchNews				: for out side call inside function 
 * _procCallNewsInfo		: call ajax to get news record
 * _procSearchStock			: call ajax to get stock 
 * 
 * 
 * _updateSearch			: update search stock record into grid panel
 * _updateNews				: update news record into grid panel
 * 
 * 
 * _generateTitle			: set panel title
 * 
 */
Ext.define('TCPlus.view.quote.StockNews', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.stocknews',
    stkcode: '',
    stkname: '',
    tGrid_Search: null,
    tGrid_News: null,
    tField_Search: null,
    tButton_Search: null,
    tButton_Back: null,
    tTimer_refresh: null,
    slcomp: 'sn',
    type: 'sn',
    savingComp: true,
    ddComp: true,
    portConfig: {
        height: 170 // applicable for theEdge only
    },
//    tConf: {
//        tab: 'tab3',
//        altTab: 'tab2'
//    },
    winConfig: {
        resizable: true,
        width: 590,
        height: 267
    },
    screenType: 'main',
    ignoredScreen: true,
    notMainSubscription: true,
    refreshScreen: true,
    initComponent: function() {
        var panel = this;

        panel._createNewsPanel();
        panel._createSearchPanel();

        panel.tField_Search = new Ext.form.field.Text({
            emptyText: languageFormat.getLanguage(10102, 'Symbol') + '/' + languageFormat.getLanguage(10101, 'Code'),
            width: searchboxWidth,
            selectOnFocus: true,
            autoCreate: {
                tag: 'input',
                type: 'text',
                size: '40',
                autocomplete: 'off'},
            listeners: {
                specialkey: function(thisField, e) {

                    if (e.getKey() == e.ENTER) {
                        if (thisField.getValue() != '') {
                            panel._procSearchStock();
                        }
                    }
                }
            }
        });

        panel.tButton_Search = new Ext.Button({
            text: languageFormat.getLanguage(10007, 'Search'),
            icon: icoBtnSearch,
            handler: function() {
                if (panel.tField_Search.getValue != "") {
                    panel._procSearchStock();
                }
            }
        });

        panel.tButton_Back = new Ext.Button({
            text: languageFormat.getLanguage(10027, 'Back'),
            hidden: true,
            icon: icoBtnBack,
            handler: function() {
                panel.tGrid_News.show();
                panel.tGrid_Search.hide();
                panel.tField_Search.setValue('');
            }
        });

        var tbarItems = [panel.tField_Search, ' ', panel.tButton_Search, '->'];
        if (N2N_CONFIG.newsSearchPopup) {
            // Archive button
            panel.archiveBtn = Ext.create('Ext.button.Button', {
                text: languageFormat.getLanguage(20129, 'Archive'),
                icon: icoBtnArchive,
                handler: function() {
                    n2ncomponents.openArchiveNews({key: panel.stkcode, name: panel.stkname});
                }
            });

            tbarItems.push(panel.archiveBtn);
        }

        tbarItems.push(panel.tButton_Back);

        var defaultConfig = {
            width: '100%',
            height: 200,
            header: false,
            border: false,
            emptyText: MSG.NO_RESULT,
            // style: 'margin-bottom: 10px;',
            autoScroll: true,
            collapsible: true,
            animCollapse: true,
            items: [panel.tGrid_Search, panel.tGrid_News],
            listeners: {
                afterrender: function(p) {
                    panel._timerReload();
                },
                destroy: function() {
                    clearInterval(panel.tTimer_refresh);
                }
            },
            tbar: {
                enableOverflow: menuOverflow,
                items: tbarItems
            }
        };


        Ext.apply(this, defaultConfig);
        this.callParent(arguments);
    },
    /**
     * Description <br/>
     * 
     * 		create news grid panel
     * 
     */
    _createNewsPanel: function() {
        var panel = this;

        var newsTpl = new Ext.XTemplate(
                '<tpl for=".">',
                '<table class="news-item" cellpadding="0" cellspacing="0" style="width:100%;">',
                '<tr title="{54} {sy} {101}">',
                '<td style=" width: 80px; font-size: 0.9em;"> {54} </td>',
                '<td style=" width: 100px;"> {sy} </td>',
                '<td style="position:relative;"><a href="#" class="news_title" onclick="createNewsContentPanel(\'{100}\', \'{sy}\');"> {101} </a></td>',
                '</tr>',
                '</table>',
                '</tpl>'
                );


        var newsRec = [
            {
                name: '54',
                convert: function(v, record) {
                    // parses date string
                    var dateObj = Ext.Date.parse(v, "Y-m-d H:i:s");
                    return Ext.util.Format.date(dateObj, N2N_CONFIG.newsDateTimeFormat);
                }
            },
            {name: 'sy'},
            {name: '101'},
            {name: '33'},
            {name: '100'}
        ];


        var newsStore = new Ext.data.Store({
            fields: newsRec,
            proxy: {
                type: "memory",
                reader: {
                    totalProperty: "c",
                    rootProperty: "d",
                    successProperty: "s"
                }
            },
            sorters: [{property: '54', direction: 'DESC'}]
        });


        panel.tGrid_News = new Ext.DataView({
            tpl: newsTpl,
            store: newsStore,
            itemSelector: 'table.news-item'
        });

    },
    /**
     * Description <br/>
     * 
     * 		create search stock grid panel
     * 
     */
    _createSearchPanel: function() {
        var panel = this;

        var resultTpl = new Ext.XTemplate(
                '<tpl for=".">',
                '<table class="search-item" cellpadding="0" cellspacing="0">',
                '<tr><td style="width: 35%"><span>{' + fieldStkCode + '}</span></td><td><span>{' + fieldStkName + '}</span></td></tr>',
                '</table></tpl>'
                );

        var record = [
            {name: fieldStkCode},
            {name: fieldStkName}
        ];


        var reader = new Ext.data.reader.Json({
            idProperty: fieldStkCode,
            totalProperty: "c",
            rootProperty: "d",
            successProperty: "s"
        });

        var store = new Ext.data.Store({
            fields: record,
            proxy: {
                type: "memory",
                reader: reader
            }
        });


        panel.tGrid_Search = new Ext.DataView({
            hidden: true,
            tpl: resultTpl,
            store: store,
            itemSelector: 'table.search-item',
            singleSelect: true,
            selectedItemCls: 'search-item-selected',
            listeners: {
                itemclick: function(thisComp, record, node, event) {
                    panel.setCode(record.get(fieldStkCode), record.get(fieldStkName));
                    panel.tField_Search.setValue("");
                    panel._procCallNewsInfo();
                },
                show: function() {
                    panel.tButton_Back.show();
                    if (panel.archiveBtn) {
                        panel.archiveBtn.hide();
                    }
                },
                hide: function() {
                    panel.tButton_Back.hide();
                    if (panel.archiveBtn) {
                        panel.archiveBtn.show();
                    }
                }
            }
        });

    },
    /**
     * Description <br/>
     * 
     * 		for out side call inside function 
     * 
     */
    searchNews: function(dataObj) {
        var panel = this;

        panel._procCallNewsInfo(dataObj);

    },
    _procCallNewsInfo: function(dataObj, autoRefresh) {
        var panel = this;
        
        if (!panel.stkcode) {
            return;
        }
        
        panel.firstLoad = false;
        
        // Fix loading when connection dropped
        if (!conn.isConnected()) {
            panel.setLoading(false);
            clearInterval(panel.tTimer_refresh);
            return;
        }

        panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
        
        if (!autoRefresh) { // avoid unncessary update on auto refresh
            panel.tGrid_News.show();
            panel.tGrid_Search.hide();
            panel._generateTitle();
            n2nLayoutManager.updateKey(panel);
            compAddRecent(panel, panel.stkcode);
            panel.stkcode = stockutil.removeStockDelay(panel.stkcode);
        }

        if (dataObj) {
            panel.renderNews(dataObj);
        } else {
            conn.getStockNews({
                r: 50,
                k: panel.stkcode,
                success: function(obj) {
                    panel.renderNews(obj);
                }
            });
        }
    },
    renderNews: function(obj) {
        var panel = this;
        var newDataList = [];

        if (obj && obj.s && obj.c > 0) {
            var stockName = stockutil.getStockName(panel.stkname);

            for (var i = 0; i < obj.c; i++) {
                var dataObj = obj.d[i];
                dataObj['sy'] = stockName;

                var h = dataObj['101'];
                if (h) {
                    if (h.length > 45) {
                        // h = h.substring(0, 50) + ' ...';
                    }
                    
                    dataObj['101'] = h;
                    newDataList.push(dataObj);
                }
            }
        }

        if (newDataList.length > 0) {
            panel._updateNews(newDataList);
        } else {
            panel.tGrid_News.update('<div class="x-grid-empty">' + panel.emptyText + '</div>');
        }

        panel.setLoading(false);
    },
    /**
     * Description <br/>
     * 
     * 		call ajax to get stock 
     * 
     */
    _procSearchStock: function() {
        var panel = this;

        var searchKey = panel.tField_Search.getValue();
        searchKey = searchKey.trim();
        if (searchKey != '') {
            panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
            panel.tGrid_News.hide();
            panel.tGrid_Search.show();

            conn.searchStock({
                k: searchKey,
                ex: [exchangecode],
                start: 0,
                count: 10,
                quickSearch: true,
                field: [fieldStkCode, fieldStkName],
                success: function(obj) {
                    if (obj != null) {

                        if (obj.s && obj.c > 0) {
                            panel._updateSearch(obj.d);

                        } else {
                            panel.tGrid_Search.getEl().update('<div class="x-grid-empty">' + panel.emptyText + '</div>');
                        }

                    } else {
                        panel.tGrid_Search.getEl().update('<div class="x-grid-empty">' + panel.emptyText + '</div>');
                    }
                    panel.setLoading(false);
                }
            });
        } else {
            panel.tField_Search.focus();
        }
    },
    /**
     * Description <br/>
     * 
     * 		update search stock record into grid panel
     * 
     */
    _updateSearch: function(dataObj) {
        var panel = this;

        panel.tGrid_Search.store.removeAll();

        var temoObject = {};
        temoObject.s = true;
        temoObject.c = dataObj.length;
        temoObject.d = dataObj;

        panel.tGrid_Search.store.loadRawData(temoObject);
    },
    /**
     * Description <br/>
     * 
     * 		update news record into grid panel
     * 
     */
    _updateNews: function(dataObj) {
        var panel = this;

        panel.tGrid_News.store.removeAll();

        var temoObject = {};
        temoObject.s = true;
        temoObject.c = dataObj.length;
        temoObject.d = dataObj;

        panel.tGrid_News.store.loadRawData(temoObject);
    },
    /**
     * Description <br/>
     * 
     * 		 set panel title
     * 
     */
    _generateTitle: function() {
        var panel = this;
        var title = languageFormat.getLanguage(20123, 'Stock News') + ' - ' + stockutil.getStockPart(panel.stkname);
        n2nLayoutManager.updateTitle(panel, title);
    },
    _timerReload: function() {
        if (!isMobile) {
            var panel = this;
            panel.tTimer_refresh = setInterval(function() {
                if (streaming) {
                    panel._procCallNewsInfo(null, true);
                }
            }, 60000);
        }
    },
    setCode: function(stkcode, stkname) {
        var me = this;

        if (me.key) {
            me.oldKey = me.key;
        }

        me.key = stkcode;
        me.stkcode = stkcode;
        me.stkname = stkname;

    },
    refreshEmpty: function() {
        var me = this;

        if (!me.key) {
            menuHandler.stockNews();
        }
    },
    _updateTitle: function() {
        var me = this;
        var stkName = stockutil.getStockPart(me.stkname);

        var newTitle = languageFormat.getLanguage(20123, 'Stock News') + ' - ' + stkName;
        n2nLayoutManager.updateTitle(me, newTitle);
        n2nLayoutManager.updateKey(me);
    },
    syncBuffer: function(stkcode, stkname) {
        var me = this;

        // update key and title
        me.setCode(stkcode, stkname);
        me._updateTitle();

        me._needReload = true;

    },
    switchRefresh: function() {
        var me = this;

        if (me._needReload) {
            me._needReload = false;
            me.searchNews();
        }
    }
});
