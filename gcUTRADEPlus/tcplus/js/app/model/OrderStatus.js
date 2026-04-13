Ext.define('TCPlus.model.OrderStatus', {
    extend: 'Ext.data.Model',
    idProperty: 'TktNo',
    fields: [
        {name: 'TktNo', sortType: 'asUCString'},
        {name: 'StkCode', sortType: 'asUCString'},
        {name: 'StkName', sortType: 'asUCString'},
        {name: 'OrdNo', sortType: 'asUCString'},
        {name: 'AccNo', sortType: 'asUCString'},
        {name: 'SubOrdNo', sortType: 'asUCString'},
        {name: 'PrevAct', sortType: 'asUCString'},
        {name: 'OrdTime', sortType: 'asUCString'},
        {name: 'OrdDate', sortType: 'asUCString'},
        {name: 'Validity', sortType: 'asUCString'},
        {name: 'Sts', sortType: 'asUCString'},
        {name: 'StsMsg', sortType: 'asUCString'},
        {name: 'Remark', sortType: 'asUCString'},
        {name: 'OrdQty', sortType: 'asInt', type: 'int'},
        {name: 'OrdPrc', sortType: 'asFloat'},
        {name: 'MtQty', sortType: 'asInt', type: 'int'},
        {name: 'MtPrc', sortType: 'asFloat'},
        {name: 'MtVal', sortType: 'asFloat', type: 'float'},
        {name: 'UnMtQty', sortType: 'asInt', type: 'int'},
        {name: 'CnclQty', sortType: 'asInt', type: 'int'},
        {name: 'ExpDate', sortType: 'asUCString'},
        {name: 'ExpQty', sortType: 'asInt', type: 'int'},
        {name: 'Currency', sortType: 'asUCString'},
        {name: 'ExCode', sortType: 'asUCString'},
        {name: 'OrdType', sortType: 'asUCString'},
        {name: 'Last', sortType: 'asFloat', type: 'float'},
        {name: 'LACP', sortType: 'asFloat', type: 'float'},
        {name: 'LotSize', sortType: 'asInt', type: 'int'},
        {name: 'StopLimit', sortType: 'asFloat'}, //type: 'float'}, // fixed cancellation issue 20140820
        {name: 'MinQty', sortType: 'asInt', type: 'int'},
        {name: 'DsQty', sortType: 'asInt', type: 'int'},
        {name: 'AccountName', sortType: 'asUCString'},
        {name: 'SettOpt', sortType: 'asUCString'},
        {name: 'OrderValue', sortType: 'asFloat'},
        {name: fieldIndexCode, sortType: 'asInt'},
        {name: fieldStkStatus, sortType: 'asUCString'},
        {name: 'TradeCurr', sortType: 'asUCString'},
        {name: 'OrderCond', mapping: 'OrderCond', sortType: 'asUCString'},
        {name: 'SeqNo', mapping: 'SeqNo', sortType: 'asUCString'},
        {name: 'DateTime', mapping: 'DateTime', sortType: 'asUCString'},
        {name: 'LastUpdateTime', mapping: 'LastUpdateTime', sortType: 'asUCString'},
        {name: 'BCode', mapping: 'BCode', sortType: 'asUCString'},
        {name: 'BrokerCode', mapping: 'BrokerCode', sortType: 'asUCString'},
        {name: 'groupKey', convert: function(v, record) {
                if (N2N_CONFIG.ordBookAmal) {
                    return record.get('AccNo') + ' ' + record.get('StkCode') + ' ' + record.get('PrevAct'); // Order by accno, code, action
                    
                    /*
                    var status = record.data['Sts'];
                    if (status && status !== 'RJ' && status !== 'CN' && status !== 'DN' && status !== 'SPS') {
                        return record.get('AccNo') + ' ' + record.get('StkCode') + ' ' + record.get('PrevAct'); // Order by accno, code, action
                    } else {
                        return '|INACTIVE|'; // wrapped with || to make this group displays at the bottom since | has higher ASCII code
                    }
                    */
                }
            }
        },
        {name: 'TradCond', mapping: 'TradCond',	sortType: 'asUCString'},
        {name: 'State', mapping: 'State', sortType: 'asUCString'},
        {name: fieldRSSIndicator, 	mapping: fieldRSSIndicator,	sortType: 'asUCString'},
        {name: 'QtyTM', sortType: 'asInt', type: 'int'},
        {name: 'ReqCC', mapping: 'ReqCC', sortType: 'asUCString'},
        {name: 'Amount', sortType: 'asFloat', type: 'float'}
    ],
    proxy: {
        type: 'memory',
        reader: {
            type: "json",
            rootProperty: 'data',
            totalProperty: 'count', // os,,c ,s  according to result frm ajax request...if we create an obj and load it ...then we map back the name of variable accordingly
            successProperty: 'success'
        }
    }
});