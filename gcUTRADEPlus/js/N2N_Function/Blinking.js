/*
 * 
 * setBlink					: 
 * resetBlink				:
 * clearBlink				:
 * 
 * 
 * _procBlink				: set new blinking 
 * _procBlinkTask			: add blinking task
 * 
 * _procUnblink 			: blinking finish
 * _procUnblinkTask			: remove blinking task 
 * 
 * _procStoreInfo			: generate blink information
 * 
 * _returnCell				: return html cell
 * _returnRowID				:
 * _returnRowIndex			:
 * _returnColumnIndex		:
 * _returnRemainTime		:
 * 
 * 
 */


var Blinking = (function() {

    var blinkTime = 3000;

    var blinkTaskList = null;

    var font_onBlink = N2NCSS.FontOnBlink;

    var font_priceUp = N2NCSS.FontUp;
    var back_priceUp = N2NCSS.BackUp;

    var font_priceDown = N2NCSS.FontDown;
    var back_priceDown = N2NCSS.BackDown;

    var font_priceUnchange = N2NCSS.FontUnChange;
    var back_priceUnchange = N2NCSS.BackUnChange;

    var defaultFontClass = [N2NCSS.FontUp, N2NCSS.FontDown, N2NCSS.FontUnChange];


    /**
     * Description <br/>
     * 
     * 		set blinking color 
     * 
     * 
     * @param {Ext.Comp} 	ExtComp
     * @param {int} 		rowIndex
     * @param {int} 		columnIndex
     * @param {string} 		backgroundColor
     */
    function setBlink(ExtComp, rowIndex, columnIndex, backgroundColor) {
        var tempInfo = _procStoreInfo(ExtComp, rowIndex, columnIndex, backgroundColor);

        if (tempInfo == null) {
            return;
        }

        if (blinkTaskList == null) {
            blinkTaskList = new Object();
        }

        var task = blinkTaskList[tempInfo.bid];

        if (task == null) {
            _procBlink(tempInfo);
            _procBlinkTask(tempInfo);

            blinkTaskList[tempInfo.bid].task.delay(blinkTime);

        } else {

            tempInfo.fontColor = task.task.info.fontColor;

            _procUnblink(blinkTaskList[tempInfo.bid].task.info);

            blinkTaskList[tempInfo.bid].task.info = tempInfo;

            _procBlink(tempInfo);

            blinkTaskList[tempInfo.bid].task.delay(blinkTime);
        }

        task = null;
        tempInfo = null;

    }


    /**
     * Description <br/>
     * 
     * 		reset all blink task 
     * 
     * 
     * @param {Ext.Comp} 	ExtComp
     * 
     */
    function resetBlink(ExtComp) {
        if (blinkTaskList == null) {
            return;
        }

        var compId = ExtComp.getId();


        for (var key in blinkTaskList) {
            var obj = blinkTaskList[key].task;
            var objInfo = obj.info;

            if (compId == objInfo.ExtCompID) {
                var rowIndex = _returnRowIndex(ExtComp, objInfo.rowID);
                var columnIndex = _returnColumnIndex(ExtComp, objInfo.columnID);

                if (rowIndex == -1 || columnIndex == -1) {
                    _procUnblinkTask(obj.bid);

                } else {

                    _procUnblinkTask(obj.bid);

                    objInfo.rowIndex = rowIndex;
                    objInfo.columnIndex = columnIndex;

                    _procBlink(objInfo);
                    _procBlinkTask(objInfo);

                    var remainTime = _returnRemainTime(obj.start);
                    blinkTaskList[objInfo.bid].task.start = obj.start;

                    blinkTaskList[objInfo.bid].task.delay(remainTime);

                }
            }

            obj = null;
            compId = null;
        }

        compId = null;
    }

    /**
     * Description <br/>
     * 
     * 		remove all blink task 
     * 
     * 
     * @param {Ext.Comp} 	ExtComp
     * 
     */
    function clearBlink(ExtComp) {
        if (blinkTaskList == null) {
            return;
        }

        var compId = ExtComp.getId();

        for (var key in blinkTaskList) {
            var obj = blinkTaskList[key].task;
            var objInfo = obj.info;

            if (compId == objInfo.ExtCompID) {
                _procUnblink(obj.info);
                _procUnblinkTask(obj.bid);
            }
        }
    }





    /**
     * Description <br/>
     * 
     * 		process blink style
     * 
     * @param {object}  info
     */
    function _procBlink(info) {
        if (info.columnIndex == -1) {
            return;
        }

        var tempView = helper.getGridView(info.ExtComp);
        var tempCell = tempView.getCellByPosition({row: info.rowIndex, column: info.columnIndex});

        if (tempCell) {
            var tempCellEl = tempCell.first();

            if (tempCellEl) {
                tempCellEl.addCls(info.backgroundColor);
                tempCellEl.replaceCls(info.fontColor, font_onBlink);
                tempCellEl = null;
            }

            tempView = null;
            tempCell = null;
        }
    }

    /**
     * Description <br/>
     * 
     * 		process blink task
     * 
     * @param {object}  info
     */
    function _procBlinkTask(info) {
        if (info.columnIndex == -1) {
            return;
        }

        var task = new Ext.util.DelayedTask(function() {
            _procUnblink(task.info);
            _procUnblinkTask(task.bid);
        });

        task.info = info;
        task.bid = info.bid;
        task.start = new Date().getTime();

        blinkTaskList[info.bid] = {
            task: task
        };
    }

    /**
     * Description <br/>
     * 
     * 		return to default design
     * 
     * @param {object}  info
     */
    function _procUnblink(info) {
        var tempView = helper.getGridView(info.ExtComp);
        if (!tempView) {
            return;
        }
        
        var tempRowIndex = _returnRowIndex(info.ExtComp, info.rowID);

        if (info.rowIndex != tempRowIndex) {
            // info.rowIndex = tempRowIndex; // commented out 17-03-2014
        }

        var newRowID = _returnRowID(info.ExtComp, info.rowIndex);

        if (newRowID == "") {
            if (newRowID != info.rowID) {
                return;
            }
        }

        var tempCell = tempView.getCellByPosition({row: info.rowIndex, column: info.columnIndex});
        var tmpCell = tempCell;
        if (tmpCell) {
            var tempCellEl = tmpCell.first();
            if (tempCellEl) {
            var newInfo = blinkTaskList[info.bid].task.info;
                tempCellEl.removeCls(newInfo.backgroundColor);
                tempCellEl.replaceCls(font_onBlink, newInfo.fontColor);
                tempCellEl = null;
            }

            tempCell = null;
        }

    }

    /**
     * Description <br/>
     * 
     * 		remove blinking task 
     * 
     * @param {string}  taskID
     */
    function _procUnblinkTask(taskID) {
        var obj = blinkTaskList[taskID].task;
        obj.cancel();

        delete blinkTaskList[taskID];
    }


    /**
     * Description <br/>
     * 
     * 		return infomation
     * 
     * @param {Ext.Comp} 	ExtComp
     * @param {string}  	rowID
     * @param {int}			columnIndex
     * @param {string}		backgroundColor
     * 
     * @return object
     */
    function _procStoreInfo(ExtComp, rowIndex, columnIndex, backgroundColor) {
        /*** 
         * CAUTION: must cast rowIndex and columnIndex to integer for getCellByPosition.
         * row and column passed to getCellByPosition() must be integer
         ***/
        rowIndex = parseInt(rowIndex);
        columnIndex = parseInt(columnIndex);

        var gridView = helper.getGridView(ExtComp);
        var headerCol = gridView.getHeaderCt().getHeaderAtIndex(columnIndex);
        if (headerCol.isHidden()) {
            columnIndex = -1;
        }

        if (columnIndex == -1 || rowIndex == -1) {
            return null;
        }

        var columnID = headerCol.dataIndex;

        var rowID = _returnRowID(ExtComp, rowIndex);

        var tempObj = null;

        if (rowIndex != -1 && rowID != "") {
            var fontColor = '';
            var tempCell = _returnCell(ExtComp, rowIndex, columnIndex);

            if (tempCell) {
            var tempCellEl = tempCell.first();

            if (tempCellEl) {
                for (var i = 0; i < defaultFontClass.length; i++) {
                    if (tempCellEl.hasCls(defaultFontClass[i])) {
                        fontColor = defaultFontClass[i];
                    }
                }
            }

            var tempBlinkStyle = "";
            if (backgroundColor.toLowerCase() == "up") {
                tempBlinkStyle = back_priceUp;

            } else if (backgroundColor.toLowerCase() == "down") {
                tempBlinkStyle = back_priceDown;

            } else {
                tempBlinkStyle = back_priceUnchange;
            }

            tempObj = {
                bid: ExtComp.getId() + "_" + rowID + "_" + columnID,
                ExtComp: ExtComp,
                ExtCompID: ExtComp.getId(),
                rowID: rowID,
                rowIndex: rowIndex,
                columnID: columnID,
                columnIndex: columnIndex,
                fontColor: fontColor,
                backgroundColor: tempBlinkStyle
            };


            fontColor = null;

            tempCell = null;
            tempCellEl = null;

            tempBlinkStyle = null;
        }
        }

        columnID = null;
        rowID = null;

        return tempObj;
    }

    /**
     * Description <br/>
     * 
     * 	return html cell 
     * 
     * @param {Ext.Comp} 	ExtComp
     * @param {int}  		rowIndex
     * @param {int}			columnIndex
     * 
     * @return object
     */
    function _returnCell(ExtComp, rowIndex, columnIndex) {
        var cell = null;
        if (ExtComp != null) {
            var view = helper.getGridView(ExtComp);
            if (view != null) {
                cell = view.getCellByPosition({row: rowIndex, column: columnIndex});
            }
        }

        return cell;
    }


    /**
     * Description <br/>
     * 
     * 		return row id
     * 
     * @param {Ext.Comp} 	ExtComp
     * @param {int} 		rowIndex
     * 
     * @return string
     */
    function _returnRowID(ExtComp, rowIndex) {
        var rowID = "";
        if (ExtComp && ExtComp.store) {
            var record = ExtComp.store.getAt(rowIndex);
            if (record) {
                rowID = record.getId();
            }
        }

        return rowID;
    }


    /**
     * Description <br/>
     * 
     * 		return row index number
     * 
     * @param {Ext.Comp} 	ExtComp
     * @param {string} 		rowID
     * 
     * @return int
     */
    function _returnRowIndex(ExtComp, rowID) {
        var rowIndex = -1;
        if (ExtComp != null && ExtComp.store != null) {
            rowIndex = ExtComp.store.indexOfId(rowID);
        }

        return rowIndex;
    }

    /**
     * Description <br/>
     * 
     * 		return column index number
     * 
     * @param {Ext.Comp} 	ExtComp
     * @param {string} 		columnID
     * 
     * @return int
     */
    function _returnColumnIndex(ExtComp, columnID) {
        var gridCols = helper.getGridColumns(ExtComp);
        var colObj = helper.getColumn(gridCols, 'dataIndex', columnID);

        var colIndex = -1;
        if (colObj.index != -1 && !colObj.hidden) {
            colIndex = colObj.index;
        }

        return colIndex;
    }


    /**
     * Description <br/>
     * 
     * 		return remain time for blinking
     * 
     * @param {int}			startTime
     * 
     * @return int
     */
    function _returnRemainTime(startTime) {
        var newTime = new Date().getTime();

        if (newTime > startTime) {
            return blinkTime - (newTime - startTime);
        } else {
            return 0;
        }
    }



    return {
        setBlink: setBlink,
        resetBlink: resetBlink,
        clearBlink: clearBlink
    }

}());