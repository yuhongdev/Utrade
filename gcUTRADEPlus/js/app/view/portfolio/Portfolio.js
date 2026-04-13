/* 
 * Base class for other portfolio
 * 
 */
Ext.define('TCPlus.view.portfolio.Portfolio', {
    extend: 'Ext.grid.Panel',
    requires: [
        'Ext.ux.form.NumericField'
    ],
    portfolioType: '',
    initComponent: function() {

        this.callParent();
    },
    _procColumnWidth: function() {
        var panel = this;

        panel.columnHash = new N2NHashtable();
        var columnID;
        var columnWidth;
        var cookieName;

        // Checks portfolio type
        switch (panel.portfolioType) {
            case 'equity':
                columnID = global_PFColumnID;
                columnWidth = global_PFWidth;
                cookieName = '_Portfolio';
                break;
            case 'equityrealized':
                columnID = global_RGLColumnID;
                columnWidth = global_RGLWidth;
                cookieName = '_RealizeGL';
                break;
        }

        if (cookies.isCookiesExist(cookieName)) {
            var temp = cookies.getCookies(cookieName);
            columnID = temp[0];
            columnWidth = temp[1];
        }
        else {
            var tempInfo = [columnID, columnWidth];
            var tempCookie = tempInfo.join(',');
            cookies.setTempStorage(panel, tempCookie);
        }

        var IDArray = columnID.split('|');
        var widthArray = columnWidth.split('|');

        for (var x in IDArray) {
            (panel.columnHash).put(IDArray[x], widthArray[x]);
        }
    },
    /**
     * Gets column index of grid
     */
    getColumnIndex: function(gridColumns, getBy, getByValue) {
        for (var i = 0; i < gridColumns.length; i++) {
            if (gridColumns[i][getBy] === getByValue) {
                return i;
            }
        }

        return -1;
    }
});