var ExportFile = (function() {
    var FILE_CSV = 'file_type_csv';

    var TYPE_DATE = 'type_date_format';
    var TYPE_STRING = 'type_string_format';
    var TYPE_INTEGER = 'type_integer_format';

    var columnDataIndex = null;
    var columnRecord = null;
    var bodyRecord = null;

    var export_filename = 'N2N_ExportFile';
    var export_fileType = null;
    var export_gridPanel = null;
    var export_optCol = null;

    /**
     * Description <br/>
     * 
     * 		export file
     * 
     * @param { string }					fileType
     * @param { Ext.grid.panel }			panel
     * @param { object }	specialColumn [option]
     */
    function initial(fileType, panel, optCol) {

        export_fileType = fileType;
        export_gridPanel = panel;
        export_optCol = optCol;

        var newPanel = new Ext.form.FormPanel({
            layout: 'form',
            baseCls: '',
            bodyStyle: 'padding:5px',
            items: [
                new Ext.form.TextField({
                    id: "exportCSVTextField",
                    selectOnFocus: true,
                    fieldLabel: languageFormat.getLanguage(30809, 'Export CSV File Name')
                })
            ]
        });
        var btnExport = {
            xtype: "button",
            text: global_personalizationTheme.indexOf("wh") != -1 ? "" : languageFormat.getLanguage(10031, 'Export'),
            tooltip: global_personalizationTheme.indexOf("wh") == -1 ? "" : languageFormat.getLanguage(10031, 'Export'),
            icon: exportIcon,
            handler: function() {
                var fname = Ext.getCmp("exportCSVTextField").getValue();
                fname = fname.trim();

                if (fname == "") {
                    msgutil.alert(languageFormat.getLanguage(30801, 'Please enter a file name.'));
                } else {
                    ExportFile.setFileName(fname);
                    ExportFile.exportFile();
                    expWin.close();
                }
            }
        };
        var btnCont = [
            '->',
            btnExport,
            '-',
            {
                text: languageFormat.getLanguage(10010, 'Cancel'),
                handler: function() {
                    expWin.close();
                }
            }
        ];
        var btnHeader = [];
        if (global_personalizationTheme.indexOf("wh") != -1) {
            btnCont = [];
            btnHeader = [btnExport];
        }

        var expWin = msgutil.popup({
            id: "exportCSVNewWindow",
            title: languageFormat.getLanguage(10004, 'Export CSV'),
            // width: 250,
            // height: 100,
            plain: true,
            items: newPanel,
            resizable: false,
            layout: 'fit',
            header: {
                items: btnHeader
            },
            bbar: btnCont
        });
    }


    /**
     * Description <br/>
     * 
     * 		start to export file
     * 
     */
    function exportFile() {

        if (export_fileType == FILE_CSV) {
            if (export_gridPanel != null) {
                var gridCols;
                if (export_gridPanel._updatedCols) {
                    gridCols = export_gridPanel._updatedCols;
                } else {
                    gridCols = helper.getGridAllColumns(export_gridPanel);
                }

                _procColumnHeader(gridCols);
                _procBodyRecord(export_gridPanel.getStore(), export_optCol);
                _procFile();
            }
        }
    }

    /**
     * Description <br/>
     * 
     * 		set file name
     * 
     * @param { string }	value
     */
    function setFileName(value) {
        export_filename = value;
    }

    /**
     * Description <br/>
     * 
     * 		process column header record
     * 
     * @param { Ext.grid.ColumnModel }		columns
     */
    function _procColumnHeader(columns) {
        columnDataIndex = [];
        columnRecord = [];

        for (var i = 0; i < columns.length; i++) {
            var col = columns[i];

            if (!col.hidden) {
                var columnId = col.text || col.header || '';
                var normalString = true;

                if (columnId.indexOf("<") > 0) {
                    normalString = false;

                } else if (columnId.indexOf(";") > 0) {
                    normalString = false;
                }

                if (normalString) {
                    columnRecord.push(_returnString(columnId));
                    columnDataIndex.push(col.dataIndex);
                }
            }
        }
    }


    /**
     * Description <br/>
     * 
     * 		process body record
     * 
     * @param { Ext.data.Store }		store
     */
    function _procBodyRecord(store, optCol) {

        bodyRecord = [];

        for (var i = 0; i < store.getCount(); i++) {
            var tempRecord = [];

            for (var ii = 0; ii < columnDataIndex.length; ii++) {

                var tempValue = store.getAt(i).data[ columnDataIndex[ii] ];
            	if(tempValue == null){
                    tempValue = '';
                }

                if (optCol != null) {

                    var valueTypeFormat = TYPE_STRING;

                    if (optCol[ columnDataIndex[ii] ] != null) {
                        valueTypeFormat = optCol[ columnDataIndex[ii] ];
                    }

                    switch (valueTypeFormat) {
                        case TYPE_DATE:
                            tempRecord.push(_returnDate(tempValue.toString()));//tempRecord.push(_returnDate(store.getAt(i).data[ columnDataIndex[ii] ].toString()));
                            break;
                        case TYPE_STRING:
                            tempRecord.push(_returnString(tempValue.toString()));
                            break;
                        case TYPE_INTEGER:
                            tempRecord.push(_returnString(tempValue.toString()));
                            break;
                        default:
                            tempRecord.push(_returnString(tempValue.toString()));
                    }

                } else {
                    tempRecord.push(_returnString(tempValue.toString()));
                }
            }

            bodyRecord.push(tempRecord);
        }
    }

    /**
     * Description <br/>
     * 
     * 		process data to CSV file
     * 
     * 
     */
    function _procFile() {

        var columnData = columnRecord.join('!');
        var tempBodyData = [];
        for (var i = 0; i < bodyRecord.length; i++) {
            var tempRecord = bodyRecord[i];
            tempBodyData.push(tempRecord.join('!'));
        }
        var bodyData = tempBodyData.join('~');

        var url = addPath + 'tcplus/ExportExcelFile';
        Ext.Ajax.request({
            url: url,
            method: 'POST',
            params: {col: columnData, data: bodyData},
            success: function(response) {

                var stat = response.responseText;

                if (stat == 'success' && export_filename != null) { //1.3.25.8 Add file name checking

                    var iframeElement = Ext.Element.get("ExportIFrame");

                    if (iframeElement != null) {
                        iframeElement.set({src: url + '?name=' + export_filename});

                    } else {
                        iframeElement = document.createElement('iframe');
                        iframeElement.id = 'ExportIFrame';
                        iframeElement.src = url + '?name=' + export_filename;
                        iframeElement.style.display = "none";
                        document.body.appendChild(iframeElement);
                    }

                }
            },
            failure: function(response) {

            }
        });

    }



    /**
     * Description <br/>
     * 
     * 		return string format
     * 
     * @param { string } value
     * 
     * @returns { string }
     */
    function _returnString(value) {
        if (value == null) {
            value = '';
        }
        return value.replace("%", "(Perc)").replace("&", " ").replace("?", " ");
    }


    /**
     * Description <br/>
     * 
     * 		return date format
     * 
     * @param { string } value
     * 
     * @returns { string }
     */
    function _returnDate(value) {
        if (value == null) {
            value = '';
        }

        if (value.indexOf('-') != -1) {

            var dateObj = null;
            var tempDate = (value).split('-');
            dateObj = new Date(tempDate[0], (tempDate[1] - 1), tempDate[2]);

            value = Ext.Date.format(dateObj, global_DateFormat);

        } else {

            var format;
            if ((value.trim()).length > 10)
                format = 'YmdHis.u';
            else if ((value.trim()).length == 8)
                format = 'Ymd';

            if (value.trim() != '') {
                var date = Ext.Date.parse(value, format);

                if (Ext.Date.format(date, 'Y') == '1900') {
                    value = '-';
                } else {
                    value = Ext.Date.format(date, global_OrderStatusDateFormat);
                }

            } else {
                value = '-';
            }
        }

        return value;
    }

    return {
        FILE_CSV: FILE_CSV,
        TYPE_DATE: TYPE_DATE,
        TYPE_STRING: TYPE_STRING,
        TYPE_INTEGER: TYPE_INTEGER,
        initial: initial,
        exportFile: exportFile,
        setFileName: setFileName
    };

})();