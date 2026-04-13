var colutils = (function () {
    var panel = null;

    var ColumnVersion = 'v1';

    /**
     * Filter column id.
     * @param {string} string
     * @returns string
     */
    function filterColumnId(string) {
        var temp = string.split("~");

        if (showColQW_TOP != "TRUE") {
            var number = temp.indexOf(cmap_mmTop);
            if (number >= 0) {
                temp.splice(number, 1);
            }
        }

        var list = [cmap_mmMargin, cmap_mmMarginPrc, cmap_mmMarginPc];

        if (showMargin != "TRUE") {
            for (var i = 0; i < list.length; i++) {
                var number = temp.indexOf(list[i]);
                if (number >= 0) {
                    temp.splice(number, 1);
                }
            }
        }

        return temp.join("~");
    }


    /**
     * Display window for columns setting.
     * @param {Ext.grid.GridPanel} gridPanel
     */
    function displayWindow(gridPanel) {
        panel = gridPanel;
        var winWidth = 350;
        var winHeight = 400;

        // available grid panel store
        var storeForAvailable = new Ext.data.JsonStore({
            fields: [
                {name: 'columnID'},
                {name: 'columnName'}
            ]
        });

        var currentColumns = '';

        if (panel.currentColumnSetting() == "") {
            currentColumns = getAllRequiredColumns(panel.defaultColumnSetting());
        } else {
            currentColumns = getAllRequiredColumns(panel.currentColumnSetting());
        }

        // exist grid panel store
        var storeForExist = new Ext.data.JsonStore({
            fields: [
                {name: 'columnID'},
                {name: 'columnName'}
            ]
        });

        try {
            storeForAvailable.loadData(getColumnStore([panel.allColumnSetting(), currentColumns]));
            storeForExist.loadData(getColumnStore([currentColumns]));
        } catch (e) {
            msgutil.alert(languageFormat.getLanguage(21054, 'An error occured. Please try again.'));
            storeForAvailable.destroy();
            storeForExist.destroy();
            return;
        }

        // available grid panel
        var viewAvailable = Ext.create('Ext.grid.Panel', {
            title: languageFormat.getLanguage(21042, 'Available'),
            columnWidth: 0.35,
            autoScroll: true,
            height: '100%',
            hideHeaders: true,
            store: storeForAvailable,
            border: false,
            columnLines: false,
            selModel: {
                mode: 'MULTI'
            },
            cls: 'settinggrid',
            viewConfig: {
                stripeRows: false
            },
            columns: [
                {
                    text: 'id',
                    dataIndex: 'columnID',
                    hidden: true,
                    width: 30
                }, {
                    text: 'name',
                    dataIndex: 'columnName',
                    border: false,
                    width: 100,
                    flex: 1,
                    renderer: function (value, meta, record) {
                        var id = record.data.columnID;
                        return setColumnStyle(id, value);
                    }
                }
            ],
            listeners: {
                rowclick: function (thisGrid, rowIndex, e) {
                    thisGrid.onClickRow = rowIndex;
                }
            }
        });

        // exist grid panel
        var viewExist = Ext.create('Ext.grid.Panel', {
            title: languageFormat.getLanguage(21043, 'In Use'),
            columnWidth: .35,
            autoScroll: true,
            height: '100%',
            hideHeaders: true,
            store: storeForExist,
            border: false,
            columnLines: false,
            selModel: {
                mode: 'MULTI'
            },
            cls: 'settinggrid',
            viewConfig: {
                stripeRows: false
            },
            columns: [
                {
                    text: 'id',
                    dataIndex: 'columnID',
                    hidden: true,
                    width: 30
                }, {
                    text: 'name',
                    dataIndex: 'columnName',
                    border: false,
                    width: 100,
                    flex: 1,
                    renderer: function (value, meta, record) {
                        var id = record.data.columnID;
                        return setColumnStyle(id, value);
                    }
                }
            ],
            listeners: {
                rowclick: function (thisGrid, rowIndex, e) {
                    thisGrid.onClickRow = rowIndex;
                }
            }
        });


        // button panel available
        var buttonPanelAvai = Ext.create('Ext.container.Container', {
            columnWidth: .15,
            height: '100%',
            frame: false,
            border: false,
            style: 'text-align: center;padding-top: 22px;',
            items: [
                Ext.create('Ext.Component', {// move all to right
                    autoEl: {
                        tag: 'img',
                        src: iconBtnAllMoveToRight
                    },
                    listeners: {
                        render: function (thisComp) {

                            Ext.create('Ext.tip.ToolTip', {
                                target: thisComp.getId(),
                                html: languageFormat.getLanguage(21046, 'Add all columns')
                            });

                            thisComp.getEl().on({
                                'click': function () {
                                    transferColumns(viewAvailable, viewExist, false);
                                },
                                scope: thisComp
                            });
                            thisComp.getEl().setStyle('margin', '5px');
                        }
                    }
                }),
                Ext.create('Ext.Component', {// move to right
                    autoEl: {
                        tag: 'img',
                        src: iconBtnMoveToRight
                    },
                    listeners: {
                        render: function (thisComp) {
                            Ext.create('Ext.tip.ToolTip', {
                                target: thisComp.getId(),
                                html: languageFormat.getLanguage(21047, 'Add selected column')
                            });

                            thisComp.getEl().on({
                                'click': function () {
                                    transferSelectedColumns(viewAvailable, viewExist, false);
                                },
                                scope: thisComp
                            });
                            thisComp.getEl().setStyle('margin', '5px');
                        }
                    }
                })
            ]
        });

        // button panel exist
        var buttonPanelExist = Ext.create('Ext.container.Container', {
            columnWidth: .15,
            height: '100%',
            frame: false,
            border: false,
            style: 'text-align: center;padding-top: 22px;',
            autoScroll: true,
            items: [
                Ext.create('Ext.Component', {// all move to left
                    autoEl: {
                        tag: 'img',
                        src: iconBtnAllMoveToLeft
                    },
                    width: 32,
                    height: 32,
                    listeners: {
                        render: function (thisComp) {
                            Ext.create('Ext.tip.ToolTip', {
                                target: thisComp.getId(),
                                html: languageFormat.getLanguage(21048, 'Remove all columns')
                            });

                            thisComp.getEl().on({
                                'click': function () {
                                    transferColumns(viewExist, viewAvailable, true);
                                },
                                scope: thisComp
                            });
                            thisComp.getEl().setStyle('margin', '5px');
                        }
                    }
                }),
                Ext.create('Ext.Component', {// move to left
                    autoEl: {
                        tag: 'img',
                        src: iconBtnMoveToLeft
                    },
                    width: 32,
                    height: 32,
                    listeners: {
                        render: function (thisComp) {
                            Ext.create('Ext.tip.ToolTip', {
                                target: thisComp.getId(),
                                html: languageFormat.getLanguage(21049, 'Remove selected column')
                            });

                            thisComp.getEl().on({
                                'click': function () {
                                    transferSelectedColumns(viewExist, viewAvailable, true);
                                },
                                scope: thisComp
                            });
                            thisComp.getEl().setStyle('margin', '5px');
                        }
                    }
                }),
                Ext.create('Ext.Component', {// move to top
                    autoEl: {
                        tag: 'img',
                        src: iconBtnMoveToTop
                    },
                    width: 32,
                    height: 32,
                    listeners: {
                        render: function (thisComp) {
                            Ext.create('Ext.tip.ToolTip', {
                                target: thisComp.getId(),
                                html: languageFormat.getLanguage(21050, 'Move selected column to top')
                            });

                            thisComp.getEl().on({
                                'click': function () {
                                    moveColumn(viewExist, 0);
                                },
                                scope: thisComp
                            });
                            thisComp.getEl().setStyle('margin', '5px');
                        }
                    }
                }),
                Ext.create('Ext.Component', {// move to top
                    autoEl: {
                        tag: 'img',
                        src: iconBtnMoveToUp
                    },
                    width: 32,
                    height: 32,
                    listeners: {
                        render: function (thisComp) {
                            Ext.create('Ext.tip.ToolTip', {
                                target: thisComp.getId(),
                                html: languageFormat.getLanguage(21051, 'Move selected column up')
                            });

                            thisComp.getEl().on({
                                'click': function () {
                                    moveColumn(viewExist, 1);
                                },
                                scope: thisComp
                            });
                            thisComp.getEl().setStyle('margin', '5px');
                        }
                    }
                }),
                Ext.create('Ext.Component', {// move to down
                    autoEl: {
                        tag: 'img',
                        src: iconBtnMoveToDown
                    },
                    width: 32,
                    height: 32,
                    listeners: {
                        render: function (thisComp) {
                            Ext.create('Ext.tip.ToolTip', {
                                target: thisComp.getId(),
                                html: languageFormat.getLanguage(21052, 'Move selected column down')
                            });

                            thisComp.getEl().on({
                                'click': function () {
                                    moveColumn(viewExist, 3);
                                },
                                scope: thisComp
                            });
                            thisComp.getEl().setStyle('margin', '5px');
                        }
                    }
                }),
                Ext.create('Ext.Component', {// move to bottom
                    autoEl: {
                        tag: 'img',
                        src: iconBtnMoveToBottom
                    },
                    width: 32,
                    height: 32,
                    listeners: {
                        render: function (thisComp) {
                            Ext.create('Ext.tip.ToolTip', {
                                target: thisComp.getId(),
                                html: languageFormat.getLanguage(21053, 'Move selected column to bottom')
                            });

                            thisComp.getEl().on({
                                'click': function () {
                                    moveColumn(viewExist, 2);
                                },
                                scope: thisComp
                            });
                            thisComp.getEl().setStyle('margin', '5px');
                        }
                    }
                })
            ]
        });
        var restoreBtn = Ext.create('Ext.Button', {
            text: global_personalizationTheme.indexOf("wh") != -1 ? '' : languageFormat.getLanguage(21044, 'Restore'),
            tooltip: languageFormat.getLanguage(21044, 'Restore'),
            icon: iconBtnRestore,
            handler: function () {
                var columns = getAllRequiredColumns(panel.defaultColumnSetting());
                try {
                    viewExist.store.loadData(getColumnStore([columns]));
                    viewAvailable.store.loadData(getColumnStore([panel.allColumnSetting(), columns]));
                } catch (e) {
                    msgutil.alert(languageFormat.getLanguage(21054, 'An error occured. Please try again.'));
                }
            }
        });
        var saveBtn = Ext.create('Ext.button.Button', {
            text: global_personalizationTheme.indexOf("wh") != -1 ? '' : languageFormat.getLanguage(21045, 'Save'),
            tooltip: languageFormat.getLanguage(21045, 'Save'),
            icon: iconBtnSave,
            handler: function () {
                var colCount = viewExist.store.getCount();
                if (colCount > 0) {
                    var showArray = new Array();
                    for (var i = 0; i < colCount; i++) {
                        var obj = viewExist.store.getAt(i);
                        showArray.push(obj.data.columnID);
                    }

                    var mappedCode = panel.mappedCode || '01';
                    var mappedSymbol = panel.mappedSymbol || '02';

                    var codeExist = showArray.indexOf(mappedCode) > -1;
                    var symExist = showArray.indexOf(mappedSymbol) > -1;
                    if (codeExist || symExist) {
                        var minCol = 3;

                        if (showArray.length >= minCol) {
                            panel.saveColumn(showArray.join("~"));
                            // fix issue with grid reconfigure
                            if (touchMode) {
                                panel.getView().refresh();
                            }
                            newWindow.destroy();
                        } else {
                            msgutil.alert(languageFormat.getLanguage(30810, 'Please add at least 3 columns. Code or Symbol column is required.'));
                        }

                    } else {
                        msgutil.alert(languageFormat.getLanguage(30810, 'Code or symbol column is required!'));
                    }
                } else {
                    msgutil.alert(languageFormat.getLanguage(30810, 'Please add at least 3 columns. Code or Symbol column is required.'));
                }
            }
        });
        var btnCont = [
            '->',
            restoreBtn,
            '-',
//                global_personalizationTheme.indexOf("wh") != -1 ? '' : '-',
            saveBtn,
            '-',
//                global_personalizationTheme.indexOf("wh") != -1 ? '   ' : '-',
            Ext.create('Ext.Button', {
                hidden: global_personalizationTheme.indexOf("wh") != -1,
                text: languageFormat.getLanguage(10010, 'Cancel'),
                icon: iconBtnCancel,
                handler: function () {
                    newWindow.destroy();
                }
            })
        ];
        var btnHeader = [];
        if (global_personalizationTheme.indexOf("wh") != -1) {
            btnCont = [];
            btnHeader = [restoreBtn, saveBtn];
        }
        // display window 
        var newWindow = msgutil.popup({
            title: languageFormat.getLanguage(21041, 'Column Settings'),
            width: winWidth,
            height: winHeight,
            plain: true,
            layout: 'column',
            resizable: false,
            header: {
                items: btnHeader
            },
            bbar: btnCont,
            items: [
                viewAvailable,
                buttonPanelAvai,
                buttonPanelExist,
                viewExist
            ],
            listeners: {
                resize: function (thisComp, newWidth, newHeight, oldWidth, oldHeight) {
                    var marBot = 62;
                    if (global_personalizationTheme.indexOf("wh") != -1) {
                        marBot = 42;
                    }
                    var itemHeight = newHeight - marBot;
                    viewAvailable.setHeight(itemHeight);
                    buttonPanelAvai.setHeight(itemHeight);
                    buttonPanelExist.setHeight(itemHeight);
                    viewExist.setHeight(itemHeight);
                }
            }
        });

    }

    /**
     * Return all columns available or exist.
     * @param {Array} array
     * @returns Object
     */
    function getColumnStore(array) {
        var returnList = [];

        // if array is empty 
        if (array.length == 1 && array[0] == null) {
            return {
                columnStore: returnList
            };
        }

        // if array is one item
        else if (array.length == 1 && array[0] != null) {
            var temp = array[0].split('~');
            for (var i = 0; i < temp.length; i++) {
                var id = temp[i];
                returnList.push({
                    columnID: id,
                    columnName: panel.generateColumnName(id)
                });
            }
        }

        // if array is more than one items
        else {
            if (array.length == 2 && array[1] == null) {
                return getColumnStore([array[0]]);
            }

            else {
                var a = array[0].split('~');
                var b = array[1].split('~');

                for (var i = 0; i < a.length; i++) {
                    // check whether the second array contains the item from first array
                    var j = b.indexOf(a[i]);
                    if (j < 0) {
                        var id = a[i];
                        returnList.push({
                            columnID: id,
                            columnName: panel.generateColumnName(id)
                        });
                    }
                }
            }
        }

        /*
         return {
         "columnStore": returnList
         };
         */

        return returnList;
    }

    /**
     * Move all items to another grid.
     * @param {Ext.grid.Panel} grid1
     * @param {Ext.grid.Panel} grid2
     * @param {boolean} validate
     */
    function transferColumns(grid1, grid2, validate) {
        var reqCols = getRequiredColumns(validate);

        var tRecords = new Array();
        grid1.store.each(function (rec) {
            if (!checkIsColumnRequired(rec.data.columnID, reqCols)) {
                tRecords.push(rec);
            }
        });

        if (tRecords.length > 0) {
            grid2.store.add(tRecords);
            grid1.store.remove(tRecords);
            if (touchMode) {
                grid2.getView().refresh();
                grid1.getView().refresh();
            }
        }

    }

    /**
     * Moves selected items from one grid to another grid
     * 
     * @param {Ext.grid.Panel} grid1
     * @param {Ext.grid.Panel} grid2
     * @param {boolean} validate
     */
    function transferSelectedColumns(grid1, grid2, validate) {
        var selModel1 = grid1.getSelectionModel();
        var selModel2 = grid2.getSelectionModel();

        var gridSel1 = selModel1.getSelection();
        var reqCols = getRequiredColumns(validate);

        if (gridSel1.length > 0) {
            var lastSel = gridSel1[0];
            var lastInd = grid1.store.indexOf(lastSel);
            var tRecords = new Array();

            for (var i in gridSel1) {
                var record = gridSel1[i];
                var id = record.data.columnID;
                var required = checkIsColumnRequired(id, reqCols);
                if (!required) {
                    tRecords.push(record);
                }
            }

            if (tRecords.length > 0) {
                grid1.store.remove(tRecords);

                if (!selModel2.hasSelection()) {
                    grid2.store.add(tRecords);
                } else {
                    var gridSel2 = selModel2.getSelection();
                    var insInd = grid2.store.indexOf(gridSel2[0]);
                    grid2.store.insert(insInd, tRecords);
                }

                selModel2.select(gridSel1);
                var avlCount = grid1.store.getCount();
                if (lastInd >= avlCount) {
                    lastInd = avlCount - 1;
                }
                selModel1.select(lastInd);
            }
            grid1.getView().refresh();
            grid2.getView().refresh();

        }

    }

    /**
     * Move selected item vertically.
     * @param {Ext.grid.GridPanel} viewExist
     * @param {number} dir
     * @description
     * 0 (top), 1 (up), 2 (bottom), 3 (down)
     */
    function moveColumn(viewExist, dir) {
        var sm = viewExist.getSelectionModel();
        var selectedRecordList = sm.getSelection();
        if (selectedRecordList.length > 0) {
            var n = selectedRecordList.length;
            var step = 0;
            var idx;
            var store = viewExist.store;
            var o = [];

            for (var i = 0; i < store.getCount(); i++) {
                if (sm.isSelected(i))
                    o.push(store.getAt(i));
            }

            selectedRecordList = o;

            if (dir == 0 || dir == 1) {
                for (var i = 0; i < n; i++) {
                    var recordSelect = selectedRecordList[i];
                    var rowNumber = viewExist.store.indexOf(recordSelect);

                    // don't move if the first selected record is at index 0
                    if (rowNumber < 1 && i == 0)
                        break;

                    store.removeAt(rowNumber);

                    if (dir == 0) { // top
                        if (i == 0)
                            step = rowNumber;

                        idx = rowNumber - step;
                        viewExist.store.insert(idx, recordSelect);
                    }

                    else if (dir == 1) { // up
                        if (i == 0)
                            step = 1;

                        idx = rowNumber - step;
                        viewExist.store.insert(idx, recordSelect);
                    }
                }
            }

            else if (dir == 2 || dir == 3) {
                for (var i = n - 1; i >= 0; i--) {
                    var recordSelect = selectedRecordList[i];
                    var rowNumber = viewExist.store.indexOf(recordSelect);

                    // don't move if the last selected record is at last index
                    if (rowNumber > (store.getCount() - 2) && i == (n - 1))
                        break;

                    store.removeAt(rowNumber);

                    if (dir == 2) { // bottom
                        if (dir == 2 && i == (n - 1))
                            step = store.getCount() - rowNumber;

                        idx = rowNumber + step;
                        viewExist.store.insert(idx, recordSelect);
                    }

                    else if (dir == 3) { // down
                        if (i == (n - 1))
                            step = 1;

                        idx = rowNumber + step;
                        viewExist.store.insert(idx, recordSelect);
                    }
                }
            }

            sm.select(selectedRecordList, true);
        }
    }


    /**
     * Description <br/>
     * 
     * 		generate column array 
     * 
     * @param gridPanel : Ext.GridPanel
     * @param columnId : String
     * 
     * @return Array
     */
    function generateColumnArray(gridPanel, columnId) {
        panel = gridPanel;
        var returnArray = [];

        var currentSetting = gridPanel.currentColumnSetting();
        var defaultSetting = gridPanel.defaultColumnSetting();
        var allColumnSetting = gridPanel.allColumnSetting();

        if (columnId == "") {
            if (currentSetting != null && currentSetting != "") {
                var temp = currentSetting.split("~");
                var tmp = null;
                var isValidate = true;
                for (var i = 0; i < temp.length; i++) {
                    var strObj = temp[i];
                    if (strObj.length > 2) {
                        isValidate = false;
                    }
                }

                if (temp.length > 0) {
                    if (temp[0].length > 2) {
                        isValidate = false;
                    }
                }

                if (!isValidate) {
                    temp = defaultSetting.split("~");
                }

                var tempstr = temp.join('~');
                var res = getAllRequiredColumns(tempstr);
                tmp = res.split('~');

                for (var i = 0; i < tmp.length; i++) {
                    var strObj = tmp[i];
                    returnArray.push({
                        column: strObj,
                        visible: true
                    });
                }
            }

            else {
                var temp = defaultSetting.split("~");
                var res = getAllRequiredColumns(defaultSetting);
                tmp = res.split('~');

                for (var i = 0; i < tmp.length; i++) {
                    var strObj = tmp[i];
                    returnArray.push({
                        column: strObj,
                        visible: true
                    });
                }
            }
        }

        else {
            var temp = columnId.split("~");
            var res = getAllRequiredColumns(columnId);
            tmp = res.split('~');

            for (var i = 0; i < tmp.length; i++) {
                var strObj = tmp[i];
                returnArray.push({
                    column: strObj,
                    visible: true
                });
            }
        }

        if (allColumnSetting != null && allColumnSetting != "") {
            var tempOri = allColumnSetting.split("~");

            for (var i = 0; i < returnArray.length; i++) {
                var strObj = returnArray[i];

                var tempNum = tempOri.indexOf(strObj.column);
                if (tempNum >= 0) {
                    tempOri.splice(tempNum, 1);
                }
            }

            for (var i = 0; i < tempOri.length; i++) {
                var strObj = tempOri[i];
                returnArray.push({
                    column: strObj,
                    visible: false
                });
            }
        }

        return returnArray;
    }


    function getColumnModel(gridPanel, setting) {
        var newColumn = gridPanel.generateColumnsArray(generateColumnArray(gridPanel, setting));

        // set data grid columns
//		var colModel = new Ext.grid.column.Column({
//			columns: newColumn
//		});

        return newColumn;
    }


    function saveColumn(colSetting, newColumnId) {
        var url = addPath + 'tcplus/setting?a=set&sc=' + colSetting + '&p=' + newColumnId;
        Ext.Ajax.request({
            url: url,
            success: function (response) {
            },
            failure: function () {
            }
        });
    }

    /**
     * Sets the grid record to bold if required.
     * @param {String} id
     * The column id.
     * @param {String} val
     * The value of the record in the grid.
     * @return
     * A html string.
     */
    function setColumnStyle(id, val) {
        var v = false;

        var r = panel.requiredColumnSetting();
        var a = r.split('~');
        var i = a.indexOf(id);
        if (i >= 0)
            v = true;

        if (v == false)
            return val;

        return '<span style="font-weight: bold">' + val + '</span>';
    }

    /**
     * Checks whether the specified column is required.
     * @param {String} id
     * The column id to check.
     * @param {Array} rid
     * The required columns array.
     * @return
     * True if the column is required, False otherwise.
     */
    function checkIsColumnRequired(id, rid) {
        if (rid == null)
            return false;

        var i = rid.indexOf(id);
        return (i >= 0 ? true : false);
    }

    /**
     * Get the required columns array.
     * @param {Boolean} validate
     * True if needs to get the required columns, False otherwise.
     * @return
     * The required columns in array.
     */
    function getRequiredColumns(validate) {
        var requiredColumns = null;
        var arrid = null;

        if (validate == true) {
            requiredColumns = panel.requiredColumnSetting();
            arrid = requiredColumns.split('~');
        }

        return arrid;
    }

    /**
     * Get all required columns, appended at the end of the list if not exist in the current list.
     * @param {Array} columns
     * The existing columns array.
     * @return
     * The list of all required columns, with the current existing list, in string
     * separated by ~ delimiter.
     */
    function getAllRequiredColumns(columns) {
        var requiredColumns = panel.requiredColumnSetting();
        var arr = columns.split('~');
        var arrRequired = requiredColumns.split('~');
        var n = arrRequired.length;

        if (n < 1)
            return arr.join('~');

        if (n == 1 && arrRequired[0] == '')
            return arr.join('~');

        for (var i = 0; i < n; i++) {
            var o = arrRequired[i];
            var j = arr.indexOf(o);
            if (j < 0)
                arr.push(o);
        }

        return arr.join('~');
    }


    return {
        generateColumnArray: generateColumnArray,
        displayWindow: displayWindow,
        filterColumnId: filterColumnId,
        getColumnModel: getColumnModel,
        saveColumn: saveColumn,
        ColumnVersion: ColumnVersion
    };

}());
