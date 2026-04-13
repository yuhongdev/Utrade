var N2NUtil = (function() {


    /**
     * Description <br/>
     * 
     * 		update grid panel cell record
     * 
     * @param {Ext.Component} 	ExtGrid
     * @param {integer}			rowIndex
     * @param {integer}			columnIndex
     * @param {string}			value
     * @param {string} 			cssClass   [optional]	 
     */
    function updateCell(ExtGrid, rowIndex, columnIndex, value, cssClass, gridType) {
        rowIndex = parseInt(rowIndex);
        columnIndex = parseInt(columnIndex);

        if (ExtGrid != null && rowIndex != null && columnIndex != null && value != null && value != '') {

            if (rowIndex != -1 && columnIndex != -1) {

                var tempExtView = helper.getGridView(ExtGrid, gridType);
                var tempCell = tempExtView.getCellByPosition({row: rowIndex, column: columnIndex});

                if (tempCell) {
                    var ele = tempCell.first();
                    if (ele != null) {
                        ele.setHtml(value);
                    }

                    if (cssClass != null) {
                        /*
                        var tempElement = Ext.get(tempCell);
                        if (tempElement != null) {
                            tempElement.removeCls(N2NCSS.allBlinkStyle);
                            tempElement.addCls(cssClass);
                        }
                        */
                       tempCell.removeCls(N2NCSS.allBlinkStyle);
                       tempCell.addCls(cssClass);
                    }
                }
                ele = null;
                tempExtView = null;
                tempCell = null;
            }
        }
    }


    return {
        updateCell: updateCell
    };


}());