Ext.define('TCPlus.view.quote.ForeignFlows', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.fflows',
    startDate: null,
    endDate: null,
    comboType: null,
    periodType: null,
    btnUpdate: null,
    grid: null,
    border: false,
    begin: 0,
    limit: 100, //limit per page.
    end: 100,
    trans: "",
    period: "daily",
    startdate: "",
    enddate: "",
    totalNumber: 0,
    totalRecord: 0,
    readyUpdate: false,
    type: 'ff',
    savingComp: true,
    ddComp: true,
    tField_Search: null,
    tButton_back: null,
    tButton_search: null,
    tGrid_searchGrid: null,
    formPanel: null,
    refreshScreen: true,
    initComponent: function() {
        var panel = this;
        panel.emptyMsg = languageFormat.getLanguage(30013, 'No result found.');

        panel._createSearchGrid();
        
        if (N2N_CONFIG.searchAutoComplete) {
            panel.tField_Search = Ext.widget('searchautobox', {
                listeners: {
                    select: function(thisCb, records) {
                        if (records.length > 0) {
                            panel._procClickSearchRecord(records[0]);
                        }
                    }
                },
                onSearchEnterKey: function(records) {
                    if (records.length > 0) {
                        panel._procClickSearchRecord(records[0]);
                    } else {
                        msgutil.alert(languageFormat.getLanguage(30014, 'Invalid Symbol/Code.'));
                    }
                }
            });
        } else {
            panel.tField_Search = new Ext.form.field.Text({
                width: searchboxWidth,
                emptyText: languageFormat.getLanguage(10102, 'Symbol') + '/' + languageFormat.getLanguage(10101, 'Code'),
                selectOnFocus: true,
                listeners: {
                    specialkey: function(field, e) {
                        if (e.getKey() == e.ENTER) {
                            panel._procSearchStock();
                        }
                    }
                }
            });
            
            panel.tButton_search = new Ext.button.Button({
                text: languageFormat.getLanguage(10007, 'Search'),
                iconCls: 'icon-search',
                handler: function() {
                    panel._procSearchStock();
                }
            });
        }

      panel.tButton_back = new Ext.button.Button({
          text: languageFormat.getLanguage(10027, 'Back'),
          iconCls: 'icon-back',
          hidden: true,
          handler: function() {
              panel.tField_Search.setValue("");
              panel.tGrid_searchGrid.hide();
              panel.tButton_back.hide();
              if (panel.fitBtn) {
            	  panel.fitBtn.show();
              }
//              if(panel.fitScreenBtn){
//            	  panel.fitScreenBtn.show();
//              }
              panel.mainBar.show();
              panel.ffGrid.show();
          }
      });
        
        panel.titleLbl = Ext.create('Ext.form.Label', {
            width: '100%',
            height: 30,
            style: 'padding-top: 10px; font-size: 16px; padding-left: 10px;',
            cls: 'x-form-cb-label'
        });

        var elStyle = 'margin-right: 5px';
        panel.comboType = Ext.create('Ext.form.field.ComboBox', {
            mode: 'local',
            editable: false,
            style: elStyle,
            store: new Ext.data.ArrayStore({
                fields: [
                    'value', 'desc'
                ],
                data: [['all', languageFormat.getLanguage(11065,'All Transactions')], ['nocross', languageFormat.getLanguage(11130, 'No Cross')]
                , ['noblock', languageFormat.getLanguage(11131,'No Block')], ['netTransaction', languageFormat.getLanguage(11132,'Net Transaction')]]
            }),
            valueField: 'value',
            displayField: 'desc',
            triggerAction: 'all',
            value: 'all',
            width: 115
        });

        var todayDate = new Date();
        var weekBefore = new Date();
        weekBefore.setDate(weekBefore.getDate() - 7);
        var monthBefore = new Date();
        monthBefore.setDate(monthBefore.getDate() - 30);

        panel.startDate = new Ext.form.DateField({
            editable: false,
            allowBlank: false,
            value: todayDate,
            format: 'd/m/Y',
            vtype: 'daterange',
            maxValue: todayDate,
            style: elStyle,
            width: 90
        });

        panel.endDate = new Ext.form.DateField({
            editable: false,
            allowBlank: false,
            format: 'd/m/Y',
            value: todayDate,
            vtype: 'daterange',
            maxValue: todayDate,
            style: elStyle,
            width: 90
        });
        
        // set start/end date for daterange vtype
        panel.startDate.endDateField = panel.endDate;
        panel.endDate.startDateField = panel.startDate;

        panel.periodType = Ext.create('Ext.form.field.ComboBox', {
            mode: 'local',
            editable: false,
            store: new Ext.data.ArrayStore({
                fields: [
                    'value', 'desc'
                ],
                data: [['daily', languageFormat.getLanguage(11133, 'Daily Transaction')], ['monthly', languageFormat.getLanguage(11134, 'Monthly Transaction')]]}),
            valueField: 'value',
            displayField: 'desc',
            triggerAction: 'all',
            value: 'daily',
            style: elStyle,
            width: 135,
            listeners: {
                select: function() {
                    panel.period = panel.periodType.getValue();
                    panel.ffGrid.reconfigure(null, panel._procColumnModel());
                    panel.getFF();
                }
            }
        });

        panel.btnUpdate = new Ext.Button({
            text: languageFormat.getLanguage(10063, 'Update'),
            width: 60,
            style: elStyle,
            cls: 'fix_btn',
            handler: function() {
                panel.getFF();
            }
        });
        
        panel.dayBt = Ext.widget('button', {
            text: 'D',
            style: 'padding: 2px 0px',
            handler: function() {
                panel.startDate.setValue(todayDate);
                panel.endDate.setValue(todayDate);
            }
        });
        panel.weekBt = Ext.widget('button', {
            text: 'W',
            style: 'padding: 2px 0px',
            handler: function() {
                panel.startDate.setValue(weekBefore);
                panel.endDate.setValue(todayDate);
            }
        });
        panel.monthBt = Ext.widget('button', {
            text: 'M',
            style: 'padding: 2px 0px',
            handler: function() {
                panel.startDate.setValue(monthBefore);
                panel.endDate.setValue(todayDate);
            }
        });
        
        panel.tButton_Last = new Ext.Button({
            iconCls: 'x-tbar-page-last',
            tooltip: languageFormat.getLanguage('10050', 'Last'),
            disabled: true,
            listeners: {
                click: function() {
                    panel._setLastPage();
                }
            }
        });

        // paging previous button
        panel.tButton_Previous = new Ext.Button({
            iconCls: 'x-tbar-page-prev',
            tooltip: languageFormat.getLanguage('10049', 'Previous'),
            disabled: true,
            listeners: {
                click: function() {
                    panel._setPrevPage();
                }
            }
        });

        // paging next button
        panel.tButton_Next = new Ext.Button({
            iconCls: 'x-tbar-page-next',
            tooltip: languageFormat.getLanguage('10015', 'Next'),
            disabled: true,
            listeners: {
                click: function() {
                    panel._setNextPage();
                }
            }
        });

        panel.tButton_First = new Ext.Button({
            iconCls: 'x-tbar-page-first',
            tooltip: languageFormat.getLanguage('10048', 'First'),
            disabled: true,
            listeners: {
                click: function() {
                    panel._setFirstPage();
                }
            }
        });
        
        panel.mainBar = new Ext.toolbar.Toolbar({
            border: false,
            items: [panel.comboType, panel.periodType, panel.startDate, panel.endDate, panel.dayBt, panel.weekBt, panel.monthBt, panel.btnUpdate,
                '->',
                panel.tButton_First,
                panel.tButton_Previous,
                panel.tButton_Next,
                panel.tButton_Last
            ],
            width: '100%',
            enableOverflow: menuOverflow
        });

        var ffStore = new Ext.data.Store({
            fields: ['date', 'nettrade', 'price', 'totbuyvol', 'totsellvol', 'netvolume', 'totbuyval', 'totsellval', 'buyavgpri', 'sellavgpri'],
        });

        panel.ffGrid = new Ext.grid.Panel({
            width: '100%',
            store: ffStore,
            enableHdMenu: false,
            enableColumnMove: false,
            columns: {
            	items: panel._procColumnModel(),
            	defaults: {
            		tdCls:'display-render'
            	}
            },
            flex: 1,
            listeners: {
                afterrender: function(thisComp) {
                    panel.tLoadMask_Grid = thisComp.setLoading(languageFormat.getLanguage(10017, 'Loading...')).hide();
                },
                resize: function(){
                	helper.autoFitColumns(panel.ffGrid); 
                }
            }
        });
        
        panel.fitBtn = createAutoWidthButton(panel.ffGrid);
        //panel.fitScreenBtn = createAutoFitButton(panel.ffGrid);
        
        var defaultConfig = {
            title: languageFormat.getLanguage(20653, 'Flow Analysis'),
            header: false,
            layout: 'vbox',
            keyEnabled: N2N_CONFIG.keyEnabled,
            items: [panel.mainBar, panel.ffGrid, panel.tGrid_searchGrid],
            tbar: {
                enableOverflow: menuOverflow,
                items: [
                    panel.tField_Search,
                    N2N_CONFIG.searchAutoComplete ? '' : '-',
                    panel.tButton_search,
                    '->',
                    panel.fitBtn,
                    //panel.fitScreenBtn,
                    panel.tButton_back
                ]
            }
        };

        Ext.apply(this, defaultConfig);
        this.callParent(arguments);
    },
    refresh: function() {
        var panel = this;

        panel.updateTitle();
        panel.getFF();
    },
    switchRefresh: function() {
        var me = this;

        if (me._needReload) {
            me._needReload = false;
            me.getFF();
        }
    },
    updateTitle: function() {
        var panel = this;
        var title = languageFormat.getLanguage(20653, 'Flow Analysis') + ' - ' + stockutil.getStockPart(panel.stkname);
        n2nLayoutManager.updateKey(panel);
        n2nLayoutManager.updateTitle(panel, title);

        helper.setHtml(panel.titleLbl, stockutil.getStockPart(panel.key) + ' / ' + stockutil.getStockPart(panel.stkname));
    },
    getFF: function() {
        var panel = this;

        panel.btnUpdate.setDisabled(true);
        panel.trans = panel.comboType.getValue();
        panel.period = panel.periodType.getValue();
        panel.startdate = panel.startDate.getRawValue();
        panel.enddate = panel.endDate.getRawValue();
        panel.readyUpdate = true;
        panel._setFirstPage();
    },
    procCallForeignFlow: function() {
        var panel = this;

        var startdate = panel.formatDate(panel.startdate);
        var enddate = panel.formatDate(panel.enddate);
        if (startdate === "" || enddate === "") {
            msgutil.alert(languageFormat.getLanguage(30502, 'Please enter date.'));
            return;
        }

        panel.tLoadMask_Grid.show();

        if (panel.ffGrid.store.getCount() > 0) {
            panel.ffGrid.store.removeAll();
        }
        
        panel.firstLoad = false;
        var requestObj = {
            rType: 'ff',
            k: panel.key,
            tr: panel.trans,
            pd: panel.period,
            sd: startdate,
            ed: enddate,
            fr: panel.begin,
            to: panel.end,
            success: function(arrObj) {
                panel.tLoadMask_Grid.hide();
                panel.btnUpdate.setDisabled(false);

                if (arrObj.s && arrObj.d && arrObj.d.length > 1) {
                    panel.updateForeignFlow(arrObj);
                    panel._procPagingButton();
                } else {
                    helper.setGridEmptyText(panel.ffGrid, languageFormat.getLanguage(30013, 'No result found.'));
                }
            }
        };

        conn.getForeignFlows(requestObj);
    },
    updateForeignFlow: function(obj) {
        var panel = this;

        if (obj !== null) {
            if (obj.d !== null) {
                var data = [];

                if (this.period === "monthly") {
                    for (var i = 1; i < obj.d.length; i++) {
                        var record = {};
                        var temp = obj.d[i];

                        record.date = temp[0].toString();
                        record.nettrade = parseFloat(temp[3]) - parseFloat(temp[4]);
                        record.price = parseFloat(temp[5]).toFixed(4);
                        data.push(record);
                    }
                } else {
                    for (var i = 1; i < obj.d.length; i++) {
                        var temp = obj.d[i];
                        var record = {};

                        record.date = temp[0].toString();
                        record.totbuyvol = parseFloat(temp[1]);
                        record.totsellvol = parseFloat(temp[2]);
                        record.totvol = record.totbuyvol + record.totsellvol;
                        record.buyvolper = jsutil.getFloat((record.totbuyvol / record.totvol) * 100, 0, 2);
                        record.totbuyval = parseFloat(temp[3]);
                        record.totsellval = parseFloat(temp[4]);
                        record.totval = record.totbuyval + record.totsellval;
                        record.buyvalper = jsutil.getFloat((record.totbuyval / record.totval) * 100, 0, 2);
                        record.netvolume = parseFloat(record.totbuyvol - record.totsellvol);
                        record.buyavgpri = parseFloat(record.totbuyval / record.totbuyvol).toFixed(4);
                        record.sellavgpri = parseFloat(record.totsellval / record.totsellvol).toFixed(4);
                        record.nettrade = (record.totbuyval - record.totsellval);
                        record.price = parseFloat(temp[5]).toFixed(4);

                        data.push(record);
                    }
                }

                // total record
                var totalParts = obj.d[0][0].split(':');
                panel.totalNumber = parseInt(totalParts[1]);
                panel.totalRecord = parseInt(obj.d.length - 1);

                this.ffGrid.store.loadData(data);
            }
        }

    },
    formatDate: function(date) {
        // this format to change date frm dd/mm/yyyy format to yyyy-mm-dd to cater for url for tcplus/foreignFlows? :)
        if (!date) {
            return "";
        }
        date += '';
        var d = date.split('/');
        var d1 = d[0];
        var d2 = d[1];
        var d3 = d[2];
        return d3 + '-' + d2 + '-' + d1;
    },
    _setFirstPage: function() {
        var panel = this;

        panel.begin = 0;
        panel.end = panel.limit;
        panel._blockButtons();
        panel.procCallForeignFlow();
    },
    _setPrevPage: function() {
        var panel = this;
        panel.begin = panel.begin - panel.limit - 1;
        panel.end = panel.begin + panel.limit;
        panel._blockButtons();
        panel.procCallForeignFlow();
    },
    _setNextPage: function() {
        var panel = this;

        panel.begin = panel.end + 1;
        panel.end = panel.begin + panel.limit;
        if (panel.end > panel.totalNumber) {
            panel.end = panel.totalNumber;
        }
        panel._blockButtons();
        panel.procCallForeignFlow();
    },
    _setLastPage: function() {
        var panel = this;

        panel.begin = panel.totalNumber + 1 - (panel.totalNumber % panel.limit);
        panel.end = panel.totalNumber;
        panel._blockButtons();
        panel.procCallForeignFlow();
    },
    _blockButtons: function() {
        var panel = this;

        panel.tButton_Previous.setDisabled(true);
        panel.tButton_First.setDisabled(true);
        panel.tButton_Next.setDisabled(true);
        panel.tButton_Last.setDisabled(true);
    },
    _procPagingButton: function() {
        var panel = this;

        if (panel.totalNumber > panel.end) {
            panel.tButton_Next.setDisabled(false);
            panel.tButton_Last.setDisabled(false);
        }

        if (panel.begin > panel.limit) {
            panel.tButton_Previous.setDisabled(false);
            panel.tButton_First.setDisabled(false);
        } else {
            panel.tButton_Previous.setDisabled(true);
            panel.tButton_First.setDisabled(true);
        }
    },
    _procColumnModel: function() {
        var panel = this;
        var newSetting = function(meta, value, record, type) {
            var cssClass = N2NCSS.CellDefault;
            cssClass += " " + N2NCSS.FontString;
            
            if (type === "nettrade") {
                if (parseFloat(value) > 0)
                    cssClass += " " + N2NCSS.FontUp;
                else if (parseFloat(value) < 0)
                    cssClass += " " + N2NCSS.FontDown;
                else
                    cssClass += " " + N2NCSS.FontUnChange;

            } else {
                    cssClass += " " + N2NCSS.FontUnChange;
            }

            meta.css = cssClass;
        };

        var columns = [];
        if (this.period === "monthly") {
            columns = [
                {
                    itemId: 'date',
                    text: "Date",
                    dataIndex: 'date',
                    width: 90,
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        newSetting(meta, value, record, 'date');
                        var dt = Ext.Date.parse(value, "Y-m-d");

                        return Ext.Date.format(dt, "d-M-Y");
                    }
                },
                {
                    itemId: 'nettrade',
                    text: 'NetTrade',
                    width: 170,
                    dataIndex: 'nettrade',
                    align: 'right',
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        newSetting(meta, value, record, store, 'nettrade');
                        if (isNaN(value) || value == 0) {
                            value = '-';
                        } else if (value < 0) {
                            value = "(" + formatutils.formatNumber(Math.abs(value).toFixed(4)) + ")";
                        } else {
                            value = formatutils.formatNumber(Math.abs(value).toFixed(4));
                        }

                        return value;
                    }
                },
                {
                    itemId: 'price',
                    text: languageFormat.getLanguage(11059, 'ClosingPrice'),
                    width: 110,
                    dataIndex: 'price',
                    align: 'right',
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        newSetting(meta, value, record, 'price');
                        if (isNaN(value) || value == 0) {
                            value = '-';
                        } else {
                            value = formatutils.formatNumber(value);
                        }

                        return value;
                    }
                }
            ];
        } else {
            columns = [
                {
                    itemId: 'date',
                    text: languageFormat.getLanguage(11200, "Date"),
                    dataIndex: 'date',
                    width: 90,
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        newSetting(meta, value, record, 'date');
                        var dt = Ext.Date.parse(value, "Y-m-d");

                        return Ext.Date.format(dt, "d-M-Y");
                    }
                },
                {
                    itemId: 'totbuyvol',
                    text: languageFormat.getLanguage(11051,'TotalBuyVol'),
                    width: 110,
                    dataIndex: 'totbuyvol',
                    align: 'right',
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        newSetting(meta, value, record, 'price');

                        if (isNaN(value) || value == 0) {
                            value = '-';
                        } else {
                            value = formatutils.formatNumber(value);
                        }

                        return value;
                    }
                },
                {
                    itemId: 'totsellvol',
                    text: languageFormat.getLanguage(11052,'TotalSellVol'),
                    width: 110,
                    dataIndex: 'totsellvol',
                    align: 'right',
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        newSetting(meta, value, record, 'price');
                        if (isNaN(value) || value == 0) {
                            value = '-';
                        } else {
                            value = formatutils.formatNumber(value);
                        }

                        return value;
                    }
                },
                {
                    itemId: 'buyvolper',
                    text: languageFormat.getLanguage(11201,'BuyVol%'),
                    width: 65,
                    dataIndex: 'buyvolper',
                    align: 'center',
                    renderer: function(value, meta, record) {
                        newSetting(meta, value, record, 'price');

                        if (record.get('totvol') == 0) {
                            return '-';
                        } else {
                            meta.tdCls = 'nopadding';

                            return getColorBar(value, true);
                        }
                    }
                },
                {
                    itemId: 'netvolume',
                    text: languageFormat.getLanguage(11053, 'NetVolume'),
                    width: 110,
                    dataIndex: 'netvolume',
                    align: 'right',
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        newSetting(meta, value, record, 'price');
                        if (isNaN(value) || value == 0) {
                            value = '-';
                        } else if (value < 0) {
                            value = "(" + formatutils.formatNumber(Math.abs(value)) + ")";
                        } else if (value > 0) {
                            value = formatutils.formatNumber(Math.abs(value));
                        }

                        return value;
                    }
                },
                {
                    itemId: 'totbuyval',
                    text: languageFormat.getLanguage(11054, 'TotalBuyVal'),
                    width: 110,
                    dataIndex: 'totbuyval',
                    align: 'right',
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        newSetting(meta, value, record, 'price');
                        if (isNaN(value) || value == 0) {
                            value = '-';
                        } else {
                            value = formatutils.formatNumber(parseFloat(value));
                        }

                        return value;
                    }
                }, {
                    itemId: 'totsellval',
                    text: languageFormat.getLanguage(11055, 'TotalSellVal'),
                    width: 110,
                    dataIndex: 'totsellval',
                    align: 'right',
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        newSetting(meta, value, record, 'price');
                        if (isNaN(value) || value == 0) {
                            value = '-';
                        } else {
                            value = formatutils.formatNumber(parseFloat(value));
                        }
                        return value;
                    }
                },
                {
                    itemId: 'buyvalper',
                    text: languageFormat.getLanguage(11202, 'BuyVal%'),
                    width: 65,
                    dataIndex: 'buyvalper',
                    align: 'center',
                    renderer: function(value, meta, record) {
                        newSetting(meta, value, record, 'price');

                        if (record.get('totval') == 0) {
                            return '-';
                        } else {
                            meta.tdCls = 'nopadding';

                            return getColorBar(value, true);
                        }
                    }
                },
                {
                    itemId: 'nettrade',
                    text: languageFormat.getLanguage(11056, 'NetTrade'),
                    width: 110,
                    dataIndex: 'nettrade',
                    align: 'right',
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        newSetting(meta, value, record, store, 'nettrade');
                        if (isNaN(value) || value == 0) {
                            value = '-';
                        } else if (value < 0) {
                            value = "(" + formatutils.formatNumber(Math.abs(value)) + ")";
                        } else if (value > 0) {
                            value = formatutils.formatNumber(Math.abs(value));
                        }

                        return value;
                    }

                },
                {
                    itemId: 'buyavgpri',
                    text: languageFormat.getLanguage(11057, 'BuyAvgPrice'),
                    width: 90,
                    dataIndex: 'buyavgpri',
                    align: 'right',
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        newSetting(meta, value, record, 'price');
                        if (isNaN(value) || value == 0) {
                            value = '-';
                        } else {
                            value = formatutils.formatNumber(value);
                        }

                        return value;
                    }
                },
                {
                    itemId: 'sellavgpri',
                    text: languageFormat.getLanguage(11058, 'SellAvgPrice'),
                    width: 90,
                    dataIndex: 'sellavgpri',
                    align: 'right',
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        newSetting(meta, value, record, 'price');
                        if (isNaN(value) || value == 0) {
                            value = '-';
                        } else {
                            value = formatutils.formatNumber(value);
                        }

                        return value;
                    }
                },
                {
                    itemId: 'price',
                    text: languageFormat.getLanguage(11059, 'ClosingPrice'),
                    width: 110,
                    dataIndex: 'price',
                    align: 'right',
                    renderer: function(value, meta, record, rowIndex, columnIndex, store, view) {
                        newSetting(meta, value, record, 'price');
                        if (isNaN(value) || value == 0) {
                            value = '-';
                        } else {
                            value = formatutils.formatNumber(value);
                        }

                        return value;
                    }
                }
            ];
        }

        return columns;
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
    _createSearchGrid: function() {
        var panel = this;

        var resultTpl = new Ext.XTemplate(
                '<tpl for=".">',
                '<table class="search-item" cellpadding="0" cellspacing="0">',
                '<tr><td width="200px"><span>{' + fieldStkCode + '}</span></td><td><span>{' + fieldStkName + '}</span></td></tr>',
                '</table></tpl>'
                );

        var store = new Ext.data.Store({
            model: 'TCPlus.model.SearchRecord'
        });

        panel.tGrid_searchGrid = new Ext.view.View({
            tpl: resultTpl,
            store: store,
            itemSelector: 'table.search-item',
            emptyText: '<div class="x-grid-empty">' + panel.emptyMsg + '</div>',
            deferEmptyText: false,
            singleSelect: true,
            selectedItemCls: 'search-item-selected',
            hidden: true,
            listeners: {
                beforeselect: function() {
                    return !touchMode;
                },
                itemclick: function(thisComp, record, item, index, e) {
                    panel._procClickSearchRecord(record);
                },
                afterrender: function(thisComp) {
                }
            }
        });

    },
    _procClickSearchRecord: function(record) {
        var panel = this;

        panel.tField_Search.setValue("");
        
        if (!N2N_CONFIG.searchAutoComplete) {
            panel.mainBar.show();
            panel.ffGrid.show();

            panel.tGrid_searchGrid.hide();
            panel.tButton_back.hide();
        }
        
        if (panel.fitBtn) {
            panel.fitBtn.show();
        }
//        
//        if(panel.fitScreenBtn){
//        	panel.fitScreenBtn.show();
//        }

        if (record != null) {
            panel.stkcode = record.data[fieldStkCode];
            panel.key = panel.stkcode;
            panel.stkname = record.data[fieldStkName];
            panel.updateTitle();
            panel.getFF();
            
            // Sync changes in child component to child component
            if (N2N_CONFIG.syncSibling) {
                syncGroupManager.syncAllComps(panel, panel.key, panel.stkname);
            }  
        }
    },
    _procSearchStock: function() {
        var panel = this;

        var searchKey = panel.tField_Search.getValue();
        searchKey = searchKey.trim();
        if (searchKey != '') {
        	panel.mainBar.hide();
            panel.ffGrid.hide();
            panel.tGrid_searchGrid.show();
            panel.tButton_back.show();
            if (panel.fitBtn) {
                panel.fitBtn.hide();
            }
//            
//            if(panel.fitScreenBtn){
//            	panel.fitScreenBtn.hide();
//            }
            
            panel.onReady = false;

            panel.tGrid_searchGrid.store.removeAll();

            var searchValue = panel.tField_Search.getValue();
            conn.searchStock({
            	k: searchValue,
            	ex: exchangecode,
            	field: [fieldStkCode, fieldStkName, fieldSbExchgCode, fieldTransNo],
            	quickSearch: true,
            	success: function(obj) {
            		try {
            			if (obj.s) {
            				if (obj.d.length > 0) {
            					panel._updateSearchStock(obj.d);

            				} else {
            					helper.setGridEmptyText(panel.tGrid_searchGrid, panel.emptyMsg);
            				}

            			} else {
            				helper.setGridEmptyText(panel.tGrid_searchGrid, panel.emptyMsg);
            			}

            		} catch (e) {
            			console.log('[FF][_procSearchStock] Exception ---> ' + e);
            		}

            	}
            });
            
        } else {
            panel.tField_Search.focus();
        }
    },
    _updateSearchStock: function(dataObj) {
        var panel = this;

        panel.tGrid_searchGrid.store.loadData(dataObj);
    },
    syncBuffer: function(stkcode, stkname) {
        var me = this;

        // update key and title
        me.setCode(stkcode, stkname);
        me.updateTitle();

        me._needReload = true;

    },
    focusSearchBox: function() {
        focusManager.focusSearchbox(this.tField_Search);
    }
});