Ext.define('TCPlus.view.orderbook.OrderLog', {
    extend: 'Ext.grid.Panel',
    alias: "widget.orderlog",
    slcomp: "ol",
    type: 'order',
//    tConf: {
//        tab: 'tab1'
//    },
    winConfig: {
        width: 800,
        height: 250
    },
    initComponent: function() {

        this.record = [
            {name: 'on', sortType: 'asUCString'},
            {name: 'tm', sortType: 'asUCString'},
            {name: 'dt', sortType: 'asUCString'},
            {name: 'prc', sortType: 'asUCString'},
            {name: 'qty', sortType: 'asInt', type: 'int'},
            {name: 'rmk', sortType: 'asUCString'},
            {name: 'appId', sortType: 'asUCString'},
            {name: 'conBroker', sortType: 'asUCString'},
            {name: 'exchRefNo', sortType: 'asUCString'},
            {name: 'loginId', sortType: 'asUCString'},
            {name: 'exchId', sortType: 'asUCString'}
        ];

        var reader;
        reader = new Ext.data.reader.Json({
            //if id is order no...it is no longer unique as order no for order log is the same.Therefore it is omitted to avoid only the last data loaded into listview
            //idProperty: "on",  
            totalProperty: "c",
            rootProperty: "d",
            successProperty: "s"
        });

        var store;
        if (pagingMode) {
            store = new Ext.ux.data.PagingStore({
                reader: reader,
                lastOptions: {params: {start: 0, limit: 10}}
            });
        } else {
            store = new Ext.data.Store({
            	sortOnLoad: false, //disable default sorting
                fields: this.record,
                proxy: {
                    type: 'memory',
                    reader: reader
                }
            });
        }

        var panel = this;

        // add paging buttons
        var hidePagingBtns = (pagingMode == true) ? false : true;
        var tbPrev = {
            id: 'ol_prev',
            xtype: 'button',
            text: languageFormat.getLanguage(20058, 'Prev'),
            hidden: hidePagingBtns,
            listeners: {
                click: function() {
                    panel.previousPage();
                }
            }
        };

        var tbNext = {
            id: 'ol_next',
            xtype: 'button',
            text: languageFormat.getLanguage(10015, 'Next'),
            hidden: hidePagingBtns,
            listeners: {
                click: function() {
                    panel.nextPage();
                }
            }
        };

        this.paging = new Ext.PagingToolbar({
            enableOverflow: menuOverflow,
            store: store,
            displayInfo: false,
            pageSize: 10,
            hidden: true,
            listeners: {
                change: function(paging, pagedata) {

                    if (pagingMode) {

                        var bbar = panel.getBottomToolbar();
                        //if there is data
                        if (pagedata.total > 0) {
                            // if data more than the total data display in one page, display the paging button	
                            if (pagedata.total > paging.pageSize)
                                panel.showPaging();

                            var page = pagedata.activePage;
                            var lastpage = pagedata.pages;

                            if (pagedata.total <= paging.pageSize) {
                                //disable both
                                bbar.getComponent('ol_prev').disable();
                                bbar.getComponent('ol_next').disable();
                            } else if (page == 1) {//if active page number is 1 means one page only
                                //disable prev
                                bbar.getComponent('ol_prev').disable();
                                bbar.getComponent('ol_next').enable();
                            } else if (page == lastpage) { // if active page number == number of pages
                                //disable next
                                bbar.getComponent('ol_prev').enable();
                                bbar.getComponent('ol_next').disable();
                            } else {
                                //disable none
                                bbar.getComponent('ol_prev').enable();
                                bbar.getComponent('ol_next').enable();
                            }

                        } else {
                            bbar.getComponent('ol_prev').disable();
                            bbar.getComponent('ol_next').disable();
                        }
                        bbar.doLayout();
                    }
                }
            }
        });

        var defaultConfig = {
            title: languageFormat.getLanguage(20174, 'Order Log'),
            header: false,
            width: '100%',
            border: false,
            store: store,
            columnLines: false,
            enableColumnMove: false,
            animCollapse: true,
            viewConfig: {
                stripeRows: true,
                trackMouseOver: false
            },
            columns: {
                defaults: {
                    menuDisabled: true
                },
                items: [
                    {
                        text: languageFormat.getLanguage(10123, 'Time'),
                        width: 80,
                        dataIndex: 'tm',
                        renderer: function(value, meta, record) {

//        	        		   console.log(value);
//        	        		   
//        	        		   var timeObj = null;
//        	        		   if ( value != null ) {
//        	        			   if ( value.indexOf( ':' ) != -1 ) {
//        	        				   var tempTime = ( value ).split( ':' );
//        	        				   timeObj = new Date();
//        	        				   timeObj.setHours( tempTime[0] );
//        	        				   timeObj.setMinutes( tempTime[1] );
//        	        				   timeObj.setSeconds( tempTime[2] );
//        	        			   }
//        	        		   }
//
//        	        		   if ( timeObj != null ) {
//        	        			   value = timeObj.format( global_TimeFormat );
//        	        		   }			

                            return value;
                        }
                    },
                    {
                        text: languageFormat.getLanguage(10927, 'Date'),
                        width: 80,
                        dataIndex: 'dt',
                        renderer: function(value, meta, record) {

                            var dateObj = null;
                            if (value != null) {
                                if (value.indexOf('-') != -1) {
                                    var tempDate = (value).split('-');
                                    dateObj = new Date(tempDate[0], (tempDate[1] - 1), tempDate[2]);
                                }
                            }

                            if (dateObj != null) {
                                value = Ext.Date.format(dateObj, global_DateFormat);
                            }
                            return value;
                        }
                    },
                    {
                        text: languageFormat.getLanguage(20835, 'Price'),
                        dataIndex: 'prc',
                        width: 95,
                        align: 'right'
                    },
                    {
                        text: languageFormat.getLanguage(10928, 'O/S Qty'),
                        dataIndex: 'qty',
                        width: 80,
                        align: 'right',
                        renderer: function(value, meta, record) {

                            return formatutils.formatNumberLot(value);
                        }
                    },
                    {
                        text: languageFormat.getLanguage(10929, 'App ID'),
                        dataIndex: 'appId',
                        width: 45,
                        tooltip: languageFormat.getLanguage(30552, '<b><u> Application Name </u></b> <br/> LP = TCLite <br/>  TW = TCWeb <br/> LM = TCLite Mobile <br/> TC = TCPro')
                    },
                    {
                        text: languageFormat.getLanguage(10930, 'Counter Broker'),
                        dataIndex: 'conBroker',
                        width: 85
                    },
                    {
                        text: languageFormat.getLanguage(10944, 'Action by'),
                        dataIndex: 'loginId',
                        width: 85
                    },
                    {
                        text: 'ExecId',
                        dataIndex: 'execId',
                        width: 85,
                        hidden: true
                    },
                    {
                        text: languageFormat.getLanguage(10931, 'ExchRefNo'),
                        dataIndex: 'exchRefNo',
                        width: 105
                    },
                    {
                        text: languageFormat.getLanguage(10133, 'Remark'),
                        dataIndex: 'rmk',
                        width: 200,
                        renderer: function(value, meta, record) {
                        	// to create tooltip for the remark data, and add a class that enable us to modify the CSS
                            meta.tdAttr = 'data-qtip="' + value + '"';
                            meta.tdCls = 'order-log-remark';
                            return value;
                        }
                    }
                ]
            },
            tbar: {
                items: [{
                        id: 'ol_tbtxt',
                        xtype: 'tbtext',
                        height: 22,
                        text: '',
                        style: 'padding-top: 3px;'
                    }, '->']
            },
            bbar: {hidden: !pagingMode,
                items: [
                    this.paging, '->', tbPrev, tbNext
                ]},
            listeners: {
                afterrender: function(thisComp) { //after order log is rendered
                    panel.loadMask = thisComp.setLoading(languageFormat.getLanguage(10017, 'Loading...')).hide();
                }
            }
        };

        Ext.apply(this, defaultConfig);
        this.callParent(arguments);
    },
    callOrdLog: function() {
        var panel = this;

        var rec;
        var recData;
        var accNo;
        var ordNo;
        var subordNo;
        var ordDate;
        var stsHis;
        var stkname;

        var emptyobj = new Object();//empty obj
        emptyobj.s = true;
        emptyobj.c = 0;
        emptyobj.d = [];

        // get record of row selected 
        if (n2nLayoutManager.isActiveItem(orderStatusPanel)) {
            rec = orderStatusPanel.getSelectionModel().getSelection()[0];
            if (rec == null) {
                panel.getStore().loadRawData(emptyobj);
                return;
            }
            recData = rec.data;
            accNo = recData.AccNo;
            ordNo = recData.OrdNo;
            subordNo = recData.SubOrdNo;
            ordDate = recData.OrdDate;
            ordDate = panel.printurlOrdDate(ordDate, 'ordstspanel');
            stsHis = "0";
            stkname = recData.StkName;
        } else if (n2nLayoutManager.isActiveItem(mfOrderStatusPanel)) {
            rec = mfOrderStatusPanel.getSelectionModel().getSelection()[0];
            if (rec == null) {
                panel.getStore().loadRawData(emptyobj);
                return;
            }
            recData = rec.data;
            accNo = recData.AccNo;
            ordNo = recData.OrdNo;
            subordNo = recData.SubOrdNo;
            ordDate = recData.OrdDate;
            ordDate = panel.printurlOrdDate(ordDate, 'ordstspanel');
            stsHis = "0";
            stkname = recData.StkName;
        } else if (n2nLayoutManager.isActiveItem(orderHistoryPanel)) {
            rec = orderHistoryPanel.getSelectionModel().getSelection()[0];
            if (rec == null) {
                panel.getStore().loadRawData(emptyobj);
                return;
            }
            recData = rec.data;
            accNo = recData.an;
            ordNo = recData.on;
            subordNo = recData.son;
            ordDate = recData.dt;
            ordDate = panel.printurlOrdDate(ordDate, 'ordhispanel');
            stsHis = "1";
            stkname = recData.sy;
        } else if (n2nLayoutManager.isActiveItem(mfOrderHistoryPanel)) {
            rec = mfOrderHistoryPanel.getSelectionModel().getSelection()[0];
            if (rec == null) {
                panel.getStore().loadRawData(emptyobj);
                return;
            }
            recData = rec.data;
            accNo = recData.an;
            ordNo = recData.on;
            subordNo = recData.son;
            ordDate = recData.dt;
            ordDate = panel.printurlOrdDate(ordDate, 'mfordhispanel');
            stsHis = "1";
            stkname = recData.sy;
        } else { // not active tab
            if (orderStatusPanel != null) {
                rec = orderStatusPanel.getSelectionModel().getSelection()[0];
                if (rec == null) {
                    panel.getStore().loadRawData(emptyobj);
                    return;
                }
                recData = rec.data;
                accNo = recData.AccNo;
                ordNo = recData.OrdNo;
                subordNo = recData.SubOrdNo;
                ordDate = recData.OrdDate;
                ordDate = panel.printurlOrdDate(ordDate, 'ordstspanel');
                stsHis = "0";
                stkname = recData.StkName;
            } else if (mfOrderStatusPanel != null) {
                rec = mfOrderStatusPanel.getSelectionModel().getSelection()[0];
                if (rec == null) {
                    panel.getStore().loadRawData(emptyobj);
                    return;
                }
                recData = rec.data;
                accNo = recData.AccNo;
                ordNo = recData.OrdNo;
                subordNo = recData.SubOrdNo;
                ordDate = recData.OrdDate;
                ordDate = panel.printurlOrdDate(ordDate, 'ordstspanel');
                stsHis = "0";
                stkname = recData.StkName;
            } else if (orderHistoryPanel != null) {
                rec = orderHistoryPanel.getSelectionModel().getSelection()[0];
                if (rec == null) {
                    panel.getStore().loadRawData(emptyobj);
                    return;
                }
                recData = rec.data;
                accNo = recData.an;
                ordNo = recData.on;
                subordNo = recData.son;
                ordDate = recData.dt;
                ordDate = panel.printurlOrdDate(ordDate, 'ordhispanel');
                stsHis = "1";
                stkname = recData.sy;
            } else
                return;
        }

        panel.stkname = stkname;
        panel.OrdNo = ordNo;

        var urlbuf = new Array();
        urlbuf.push(addPath + 'tcplus/atp/log?');
        urlbuf.push('&ac=');
        urlbuf.push(accNo);
        urlbuf.push('&st=');
        urlbuf.push(stsHis);
        urlbuf.push('&on=');
        urlbuf.push(ordNo);
        urlbuf.push('&son=');
        urlbuf.push(subordNo);
        urlbuf.push('&fr=');
        urlbuf.push(ordDate);
        var url = urlbuf.join('');

        panel.getComponent(0).store.removeAll(); //listview store
        panel.loadMask.show();

        Ext.Ajax.request({
            url: url,
            success: function(response) {
                var text = response.responseText;
                var obj = null;
                try {
                    obj = Ext.decode(text);
                } catch (e) {
                    debug(e);
                }

                if (obj == null || !obj.s) {
                    panel.getStore().loadRawData(emptyobj); //empty obj
                    return;
                }

                if (obj.c > 0) {

                    for (var i = 0; i < obj.c; i++) {
                        //var iobj = obj.d[i];

                        var dt = obj.d[i].dt;


                        if (dt == null) {
                            obj.d[i].dt = '-';
                            obj.d[i].tm = '-';
                        } else {

                            var date = panel.printurlOrdDate(dt);
                            var time = panel.printurlOrdDate(dt, 'time');

                            obj.d[i].dt = date;
                            obj.d[i].tm = time;
                        }
                    }

                    var displayStkName = '';
                    var idx = panel.stkname.lastIndexOf('.');
                    if (idx != -1) {
                        displayStkName = panel.stkname.substring(0, idx);
                    } else {
                        displayStkName = panel.stkname;
                    }

                    panel.down('#ol_tbtxt').setText("<span style='font-weight:bold;'>" + displayStkName + "</span>" + ' - ' + panel.OrdNo);
                    panel.getStore().loadRawData(obj);

                } else {
                    helper.setGridEmptyText(panel, languageFormat.getLanguage(30551, 'Order log is empty.'));

                }
                
                panel.loadMask.hide();
            },
            failure: function(response) {
                panel.loadMask.hide();

            }
        });
    },
    printurlOrdDate: function(value, type) { // format date to pass as url params/format date to display in listview
        var dateObj = Ext.Date;
        if (type == 'ordstspanel' || type == 'ordhispanel') {
            //date += '';
            if (value != null) {
                var d = value.split('-');
                var d1 = d[0];
                var d2 = d[1];
                var d3 = d[2];
                return d1 + d2 + d3;
            }
        }

        var format;


        if (value.length > 8) {//eg 20050112053012.303 date with time > 8 digits
            var date = new Date(value.substring(0, 4), (value.substring(4, 6) - 1), value.substring(6, 8), value.substring(8, 10), value.substring(10, 12), value.substring(12, 13));

//            format = 'YmdHis.u';

        }
//        else if (value.length == 8)//eg 20050112 == 8 digits
//            format = 'Ymd';
//        else
//            return value;


        //var date = dateObj.format(value, format);// value must match format, else null value returned (date obj)

        if (type == 'time') {
            value = dateObj.format(date, "H:i:s A");
            return value;
        }
        value = dateObj.format(date, "Y-m-d");//format it to string
        return value;
    },
    nextPage: function() {
        var store = this.getStore();
        var total = store.getTotalCount();

        var cursor = this.paging.cursor;
        var size = this.paging.pageSize;

        this.page = cursor / size;
        var islastpage = cursor >= (total - size);
        if (!islastpage)
            this.paging.moveNext();
    },
    previousPage: function() {
        var store = this.getStore();
        var total = store.getTotalCount();

        var cursor = this.paging.cursor;
        var size = this.paging.pageSize;

        this.page = cursor / size;
        if (this.page > 0)
            this.paging.movePrevious();
    },
    showPaging: function() {

//        var bbar = this.getBottomToolbar();

        this.down('#ol_prev').show();
        this.down('#ol_next').show();

    }


});