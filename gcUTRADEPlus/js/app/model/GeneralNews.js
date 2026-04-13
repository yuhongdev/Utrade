/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

Ext.define('TCPlus.model.GeneralNews', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'dt',
            convert: function(v, record) {
                // parses date string
                var dateObj = Ext.Date.parse(v, "Y-m-d H:i:s");
                return Ext.util.Format.date(dateObj, N2N_CONFIG.newsDateTimeFormat);
            }
        },
        {name: 'sy'},
        {name: 'url'},
        {name: 'h'},
        {name: 'l'},
        {name: 'sc'},
        {name: 'k'}
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            //  idProperty: fieldStkCode,
            totalProperty: "c",
            rootProperty: "d",
            successProperty: "s"
        }
    }
});
