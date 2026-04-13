Ext.define('TCPlus.model.EquityPrtfRealizedRecord', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'StkCode',
            mapping: 'StkCode',
            sortType: 'asUCString'
        },
        {
            name: 'StkName',
            mapping: 'StkName',
            sortType: 'asUCString'
        },
        {
            name: 'AggrBuyPrice',
            mapping: 'AggrBuyPrice',
            sortType: 'asFloat'
        },
        {
            name: 'AggrSellPrice',
            mapping: 'AggrSellPrice',
            sortType: 'asFloat'
        },
        {
            name: 'TotalQtyFromHolding',
            mapping: 'TotalQtyFromHolding',
            sortType: 'asInt',
            type: 'int'
        },
        {
            name: 'TotalQtyShort',
            mapping: 'TotalQtyShort',
            sortType: 'asInt',
            type: 'int'
        },
        {
            name: 'TotalQtySold',
            mapping: 'TotalQtySold',
            sortType: 'asInt',
            type: 'int'
        },
        {
            name: 'TotalBrokerage',
            mapping: 'TotalBrokerage',
            sortType: 'asFloat'
        },
        {
            name: 'realGLAmt',
            mapping: 'realGLAmt',
            sortType: 'asFloat'
        },
        {
            name: 'realGLPc',
            mapping: 'realGLPc',
            sortType: 'asFloat'
        },
        {
            name: 'AccNo',
            mapping: 'AccNo',
            sortType: 'asUCString'
        },
        {
            name: 'Currency',
            mapping: 'Currency',
            sortType: 'asUCString'
        },
        {
            name: 'ExchangeCode',
            mapping: 'ExchangeCode',
            sortType: 'asUCString'
        },
        {
            name: 'LotSize',
            mapping: 'LotSize',
            sortType: 'asInt',
            type: 'int'
        },
        {
            name: fieldStkStatus,
            mapping: fieldStkStatus,
            sortType: 'asUCString'
        },
        {
            name: fieldIndexCode,
            mapping: fieldIndexCode,
            sortType: 'asInt'
        },
        {
            name: 'SettOpt',
            mapping: 'SettOpt',
            sortType: 'asUCString'
        },
        {
            name: 'BCode',
            mapping: 'BCode',
            sortType: 'asUCString'
        },
        {
            name: 'AccountName',
            mapping: 'AccountName',
            sortType: 'asUCString'
        },
        {
            name: fieldRSSIndicator,
            mapping: fieldRSSIndicator,
            sortType: 'asUCString'
        },
        {
            name: 'ReqCC',
            mapping: 'ReqCC',
            sortType: 'asUCString'
        }
    ],
    proxy: {
        type: 'memory',
        reader: {
            idProperty: 'PrtfNo',
            rootProperty: 'data',
            totalProperty: 'count',
            successProperty: 'success'
        }
    }
});