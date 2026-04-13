/* 
 * Model for search result
 * 
 */
Ext.define('TCPlus.model.SearchRecord', {
    extend: 'Ext.data.Model',
    fields: [
        {name: fieldStkCode},
        {name: fieldStkName},
        {name: fieldSbExchgCode}
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: 'json',
            idProperty: fieldStkCode,
            totalProperty: "c",
            rootProperty: "d",
            successProperty: "s"
        }
    }
});