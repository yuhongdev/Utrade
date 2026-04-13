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
    initComponent: function() {
        var panel = this;
        panel.emptyMsg = languageFormat.getLanguage(30013, 'No result found.');

        panel._createSearchGrid();
        
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
          icon: icoBtnSearch,
          handler: function() {
              panel._procSearchStock();
          }
      });

      panel.tButton_back = new Ext.button.Button({
          text: languageFormat.getLanguage(10027, 'Back'),
          icon: icoBtnBack,
          hidden: true,
          handler: function() {
              panel.tField_Search.setValue("");
              panel.tGrid_searchGrid.hide();
              panel.tButton_back.hide();
                if (panel.fitBtn) {
                    panel.fitBtn.show();
                }
              panel.formPanel.show();
              panel.ffGrid.show();
          }
      });
        
        panel.titleLbl = Ext.create('Ext.form.Label', {
            width: '100%',
            height: 30,
            style: 'padding-top: 10px; font-size: 16px; padding-left: 10px;',
            cls: 'x-form-cb-label'
        });

        var elStyle = 'margin-left: 10px';
        panel.comboType = Ext.create('Ext.form.field.ComboBox', {
            mode: 'local',
            editable: false,
            style: elStyle,
            store: new Ext.data.ArrayStore({
                fields: [
                    'value', 'desc'
                ],
                data: [['all', 'All Transactions'], ['nocross', 'No Cross'], ['noblock', 'No Block'], ['netTransaction', 'Net Transaction']]
            }),
            valueField: 'value',
            displayField: 'desc',
            triggerAction: 'all',
            value: 'all',
            width: 140
        });

        var todayDate = new Date();

        Ext.apply(Ext.form.field.VTypes, {
            daterange: function(val, field) {
                var date = field.parseDate(val);

                if (!date) {
                    return false;
                }
                if (field.startDateField) {
                    var start = panel.startDate;
                    if (!start.maxValue || (date.getTime() != start.maxValue.getTime())) {
                        start.setMaxValue(date);
                        start.validate();
                    }
                }
                else if (field.endDateField) {
                    var end = panel.endDate;
                    if (!end.minValue || (date.getTime() != end.minValue.getTime())) {
                        end.setMinValue(date);
                        end.validate();
                    }
                }
                /*
                 * Always return true since we're only using this vtype to set the
                 * min/max allowed values (these are tested for after the vtype test)
                 */
                return true;
            }
        });

        panel.startDate = new Ext.form.DateField({
            editable: false,
            allowBlank: false,
            value: todayDate,
            format: 'd/m/Y',
            vtype: 'daterange',
            endDateField: 'dtEnd',
            itemId: 'dtStart',
            maxValue: todayDate,
            style: elStyle
        });

        panel.endDate = new Ext.form.DateField({
            editable: false,
            allowBlank: false,
            format: 'd/m/Y',
            itemId: 'dtEnd',
            value: todayDate,
            vtype: 'daterange',
            startDateField: 'dtStart',
            maxValue: todayDate,
            style: elStyle
        });

        var row2 = Ext.create('Ext.container.Container', {
            border: false,
            style: "padding-top:10px;",
            layout: "hbox",
            items: [panel.comboType, panel.startDate, panel.endDate]
        });

        panel.periodType = Ext.create('Ext.form.field.ComboBox', {
            mode: 'local',
            editable: false,
            store: new Ext.data.ArrayStore({
                fields: [
                    'value', 'desc'
                ],
                data: [['daily', 'Daily Transaction'], ['monthly', 'Monthly Transaction']]}),
            valueField: 'value',
            displayField: 'desc',
            triggerAction: 'all',
            value: 'daily',
            style: elStyle,
            width: 140,
            listeners: {
                select: function() {
                    if (panel.readyUpdate) {
                        panel.trans = panel.comboType.getValue();
                        panel.startdate = panel.startDate.getRawValue();
                        panel.enddate = panel.endDate.getRawValue();
                        panel.period = this.value;

                        panel._updateCols = true;
                        panel._setFirstPage();
                    }
                }
            }
        });

        panel.btnUpdate = new Ext.Button({
            text: 'Update',
            width: 60,
            style: elStyle,
            cls: 'fix_btn',
            handler: function() {
                panel.getFF();
            }
        });

        var row3 = Ext.create('Ext.container.Container', {
            border: false,
            layout: "hbox",
            style: "padding-top:10px;",
            items: [panel.periodType, panel.btnUpdate]
        });

        panel.formPanel = new Ext.container.Container({
            height: 100,
            border: false,
            items: [panel.titleLbl, row2, row3]
        });

        var ffStore = new Ext.data.Store({
            fields: ['date', 'nettrade', 'price', 'totbuyvol', 'totsellvol', 'netvolume', 'totbuyval', 'totsellval', 'buyavgpri', 'sellavgpri'],
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

        panel.ffGrid = new Ext.grid.Panel({
            width: '100%',
            store: ffStore,
            enableHdMenu: false,
            enableColumnMove: false,
            columns: panel._procColumnModel(),
            flex: 1,
            bbar: ['->',
                panel.tButton_First,
                panel.tButton_Previous,
                panel.tButton_Next,
                panel.tButton_Last
            ],
            listeners: {
                afterrender: function(thisComp) {
                    panel.tLoadMask_Grid = thisComp.setLoading(languageFormat.getLanguage(10017, 'Loading...')).hide();
                }
            }
        });
        
        panel.fitBtn = createAutoWidthButton(panel.ffGrid);
        
        var defaultConfig = {
            title: languageFormat.getLanguage(20653, 'Foreign Flows'),
            header: false,
            layout: 'vbox',
            items: [panel.formPanel, panel.ffGrid, panel.tGrid_searchGrid],
            tbar: {
                enableOverflow: menuOverflow,
                items: [
                    panel.tField_Search,
                    '-',
                    panel.tButton_search,
                    '->',
                    panel.fitBtn,
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
    updateTitle: function() {
        var panel = this;
        var title = languageFormat.getLanguage(20653, 'Foreign Flows') + ' - ' + stockutil.getStockPart(panel.stkname);
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

        var requestObj = {
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
                        record.totbuyval = parseFloat(temp[3]).toFixed(4);
                        record.totsellval = parseFloat(temp[4]).toFixed(4);
                        record.netvolume = parseFloat(record.totbuyvol - record.totsellvol);
                        record.buyavgpri = parseFloat(record.totbuyval / record.totbuyvol).toFixed(4);
                        record.sellavgpri = parseFloat(record.totsellval / record.totsellvol).toFixed(4);
                        record.nettrade = (record.totbuyval - record.totsellval).toFixed(4);

                        data.push(record);
                    }
                }

                // total record
                var totalParts = obj.d[0][0].split(':');
                panel.totalNumber = parseInt(totalParts[1]);
                panel.totalRecord = parseInt(obj.d.length - 1);

                if (this._updateCols) {
                    this.ffGrid.reconfigure(null, this._procColumnModel());
                    this._updateCols = false;
                }

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
                if (record.get("nettrade") > 0) {
                    cssClass += " " + N2NCSS.FontUp;
                } else if (record.get("nettrade") < 0) {
                    cssClass += " " + N2NCSS.FontDown;
                } else {
                    cssClass += " " + N2NCSS.FontUnChange;
                }

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
                    text: 'Price',
                    width: 170,
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
                    itemId: 'totbuyvol',
                    text: 'TotalBuyVol',
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
                    text: 'TotalSellVol',
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
                    itemId: 'netvolume',
                    text: 'NetVolume',
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
                    text: 'TotalBuyVal',
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
                    text: 'TotalSellVal',
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
                    itemId: 'nettrade',
                    text: 'NetTrade',
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
                    text: 'BuyAvgPrice',
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
                    text: 'SellAvgPrice',
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

        panel.formPanel.show();
        panel.ffGrid.show();

        panel.tGrid_searchGrid.hide();
        panel.tButton_back.hide();
        if (panel.fitBtn) {
            panel.fitBtn.show();
        }

        if (record != null) {
            panel.stkcode = record.data[fieldStkCode];
            panel.key = panel.stkcode;
            panel.stkname = record.data[fieldStkName];
            panel.updateTitle();
            panel.getFF();
        }
    },
    _procSearchStock: function() {
        var panel = this;

        var searchKey = panel.tField_Search.getValue();
        searchKey = searchKey.trim();
        if (searchKey != '') {
        	panel.formPanel.hide();
            panel.ffGrid.hide();
            panel.tGrid_searchGrid.show();
            panel.tButton_back.show();
            if (panel.fitBtn) {
                panel.fitBtn.hide();
            }
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
    }
});