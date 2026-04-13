
/*
 *	this :  Ext.Panel
 *
 *
 * constructor 		: initial this object function / design this panel 
 * 
 * setValue			: update this object stkname
 * 
 * search 			: call ajax to get news record
 * 
 * updateTime		: update time record
 * 
 * nextPage			: 
 * previousPage		: 
 * hidePaging		: 
 * showPaging		: 
 * 
 */
Ext.define('TCPlus.view.quote.GeneralNews', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.generalnews',
    stkname: '',
    tbarMsg: null,
    optionPanel: null,
    count: 0,
    page: 1,
    resultList: null,
    loadMask: null,
    emptyText: languageFormat.getLanguage(30013, 'No result found.'),
    tTimer_refresh: null,
    title: languageFormat.getLanguage(20138, 'Announcement News'),
    slcomp: "gn",
    type: 'gn',
    savingComp: true,
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
    initComponent: function() {

        var panel = this;

        this.tbarMsg = new Ext.form.Label();

        var xtype = 'button';

        var btnRefresh = {
            text: languageFormat.getLanguage(10008, 'Refresh'),
            xtype: xtype,
            icon: icoBtnRefresh,
            handler: function() {
                panel.page = 1;
                panel.search();
            }
        };

        var resultTpl = new Ext.XTemplate(
                '<tpl for=".">',
                '<table class="news-item" cellpadding="0" cellspacing="0" style=" width:100%;">',
                '<tr title="{dt} {sy} {h}">',
                '<td style="width:80px; font-size:0.9em;"> {dt} </td>',
                '<td style="width:100px;"> {sy} </td>',
                '<td style="position:relative;"><a href="#" class="news_title" onclick="createNewsContentPanel( \'{k}\', \'{sy}\', null, true);"> {h} </a></td>',
                '</tr>',
                '</table>',
                '</tpl>'
                );

        var store;
        if (pagingMode) {
            store = new Ext.ux.data.PagingStore({
                model: 'TCPlus.model.GeneralNews',
                lastOptions: {params: {start: 0, limit: 8}}
            });
        } else {
            store = new Ext.data.Store({
                model: 'TCPlus.model.GeneralNews'
            });
        }

        this.dataView = new Ext.view.View({
            tpl: resultTpl,
            store: store,
            itemSelector: 'table.news-item',
            emptyText: ''
        });


        // add paging buttons
        var hidePagingBtns = true;
        var tbPrev = {
            id: 'gn_prev',
            xtype: xtype,
            text: 'Prev',
            hidden: hidePagingBtns,
            listeners: {
                click: function() {
                    panel.previousPage();
                }
            }
        };

        var tbNext = {
            id: 'gn_next',
            xtype: xtype,
            text: 'Next',
            hidden: hidePagingBtns,
            listeners: {
                click: function() {
                    panel.nextPage();
                }
            }
        };

        this.paging = new Ext.PagingToolbar({
            enableOverflow: menuOverflow,
            height: 30,
            store: store,
            displayInfo: false,
            pageSize: 8,
            hidden: true,
            listeners: {
                change: function(paging, pagedata) {
                    if (pagingMode) {
                        var tbar = panel.getTopToolbar();
                        if (pagedata.total > 0) {
                            if (pagedata.total > paging.pageSize) {
                                panel.showPaging();
                            }

                            var page = pagedata.activePage;
                            var lastpage = pagedata.pages;

                            if (pagedata.total <= paging.pageSize) {
                                //disable both
                                tbar.getComponent('gn_prev').disable();
                                tbar.getComponent('gn_next').disable();
                            } else if (page == 1) {
                                //disable prev
                                tbar.getComponent('gn_prev').disable();
                                tbar.getComponent('gn_next').enable();
                            } else if (page == lastpage) {
                                //disable next
                                tbar.getComponent('gn_prev').enable();
                                tbar.getComponent('gn_next').disable();
                            } else {
                                //disable none
                                tbar.getComponent('gn_prev').enable();
                                tbar.getComponent('gn_next').enable();
                            }
                            panel.page = page;
                        } else {
                            tbar.getComponent('gn_prev').disable();
                            tbar.getComponent('gn_next').disable();
                        }
                        tbar.doLayout();
                    }
                }
            }
        });

        var defaultConfig = {
            height: 200,
            header: false,
            border: false,
            autoScroll: true,
            items: [
                this.dataView
            ],
            listeners: {
                afterrender: function(thisComp) {
                    thisComp.loadMask = thisComp.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
                    //panel.switchButtonStyle();

                    panel._timerRefresh();
                },
                destroy: function() {
                    panel.stopRefresh();
                }
            },
            collapsible: true,
            animCollapse: true,
            tbar: {
                enableOverflow: menuOverflow,
                items: [
//                    panel.tfSearch, ' ', panel.btnSearch, ' ', panel.btnRefresh]
                    '  ', panel.tbarMsg, '  ', '->', btnRefresh, tbPrev, tbNext
                ]
            },
            bbar: panel.paging
        };

        Ext.apply(this, defaultConfig);
        this.callParent(arguments);

    },
    setValue: function(str) {
        this.stkname = str;
    },
    search: function() {
        var me = this;
        
        if (me.rendered) {
            me._getNews();
        } else {
            setTimeout(function() {
                me.search();
            }, 0);
        }
    },
    _getNews: function() {
        if (pagingMode)
            this.hidePaging();
        var panel = this;
        var value = '';
        this.dataView.getStore().removeAll();

        if (panel.stkname)
            value = panel.stkname;
        var pageno = panel.page;

        var urlBuf = new Array();
        urlBuf.push(addPath + 'tcplus/news?');
        urlBuf.push('r=50');

        if (exchangecode)
            urlBuf.push('&ex=' + exchangecode);

        if (value)
            urlBuf.push('&k=' + value);

        if (pageno)
            urlBuf.push('&p=' + pageno);

        var Url = urlBuf.join('');

        panel.loadMask.show();

        Ext.Ajax.request({
            url: Url,
            success: function(response) {

                if (response != null && response.responseText != null) {
                    var text = response.responseText;
                    var obj = null;

                    try {

                        obj = Ext.decode(text);
                        panel.resultList = obj;

                    } catch (e) {
                    }

                    if (obj != null && obj.s == true) {
                        panel.updateTime();

                        var ds = obj.d;
                        var c = obj.c;

                        var newd = new Array();

                        for (var i = 0; i < c; i++) {
                            var d = ds[i];


                            if (d['k'] != null && d['l'] != null) {
                                var url = obj.url.replace('<NewsKey>', d['k']);
                                url = url.replace('<NewsLanguage>', d['l']);
                                d['url'] = url;
                            }


                            var h = d['h'];
                            if (h && h.length > 45) {
                                // h = h.substring(0, 50) + ' ...';
                            }
                            d['h'] = h;


                            var sy = d['sy'];
                            if (!sy) {
                                sy = 'Announcement';
                            }
                            d['sy'] = sy;


                            newd.push(d);
                        }

                        obj.d = newd;

                        if (pagingMode) {
                            panel.dataView.store.lastOptions.params = Ext.applyIf({start: 0, limit: 8}, panel.dataView.store.lastOptions.params);
                        }

                        panel.dataView.getStore().loadRawData(obj);


                    } else {
                        panel.dataView.update('<div class="x-grid-empty">' + panel.emptyText + '</div>');

                    }

                    panel.loadMask.hide();
                }
            },
            failure: function(response) {
                panel.tbarMsg.setText('Failed to get news from server. Please try again later.');
                panel.dataView.getEl().update('<div class="x-grid-empty">Request failed. Please try again.</div>');
                panel.loadMask.hide();
            }
        });
    },
    updateTime: function() {
        var msg = languageFormat.getLanguage(10926, 'Last update: ');
        var currentTime = new Date();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var ampm;
        if (hours > 11) {
            ampm = 'PM';
        } else {
            ampm = 'AM';
        }
        if (hours > 12) {
            hours -= 12;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        msg += hours + ':' + minutes + ' ' + ampm;
        this.tbarMsg.setText(msg);
    },
//    switchButtonStyle:function() {
//        if (Ext.isIE) return;
//        if (!isVisible(this.id)) return;
//
//        var tbar = this.getTopToolbar();
//        if (tbar != null) {
//            var items = tbar.items;
//            for (var i = 0; i < items.length; i++) {
//                var item = tbar.get(i);
//                var xtype = item.getXType();
//                if (xtype == 'button') {
//                    var dom = item.getEl().dom;
//                    var obj = null;
//                    var exist = false;
//                    var html = '';
//                    var className = '';
//                    if (touchMode) {
//                        html = dom.innerHTML;
//                        className = dom.className;
//                        if (this.btnarr == null) this.btnarr = new Array();
//                        for (var j = 0; j < this.btnarr.length; j++) {
//                            if (this.btnarr[j].id == item.id) {
//                                obj = this.btnarr[j];
//                                exist = true;
//                                break;
//                            }
//                        }
//                        if (obj == null) obj = new Object();
//
//                        if (!exist) {
//                            obj.id = item.id;
//                            obj.innerHTML = html;
//                            obj.className = className;
//                            this.btnarr.push(obj);
//                        }
//
//                        dom.className = 'generalButton';
//                        dom.innerHTML = '<tr></td><button style="width: '+item.getWidth()+'px;">'+item.text+'</button></td></tr>';
//                    } else {
//                        if (this.btnarr != null) {
//                            for (j = 0; j < this.btnarr.length; j++) {
//                                if (this.btnarr[j].id == item.id) {
//                                    obj = this.btnarr[j];
//                                    exist = true;
//                                    break;
//                                }
//                            }
//
//                            if (obj != null) {
//                                html = obj.innerHTML;
//                                dom.className = obj.className;
//                                dom.innerHTML = html;
//                            }
//                        }
//                    }
//                }
//            }
//        }
//    },
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
        var tbar = this.getTopToolbar();
        tbar.getComponent('gn_prev').hide();
        tbar.getComponent('gn_next').hide();
    },
    showPaging: function() {
        var tbar = this.getTopToolbar();
        tbar.getComponent('gn_prev').show();
        tbar.getComponent('gn_next').show();
    },
    _timerRefresh: function() {
        if (!isMobile) {
            var panel = this;
            panel.tTimer_refresh = setInterval(function() {
                if (streaming) {
                    panel.search();
                }
            }, 60000);
        }

    },
    stopRefresh: function() {
        if (this.tTimer_refresh) {
            clearInterval(this.tTimer_refresh);
        }
    }

});
