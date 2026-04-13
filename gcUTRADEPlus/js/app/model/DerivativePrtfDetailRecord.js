Ext.define('TCPlus.model.DerivativePrtfDetailRecord', {
            extend: 'Ext.data.Model',
            fields: [
                {
                    name: 'no',
                    mapping: '42',
                    type: 'int'
                },
                {
                    name: 'buy',
                    mapping: 'buy',
                    type: 'int'
                },
                {
                    name: 'sell',
                    mapping: 'sell',
                    type: 'int'
                },
                {
                    name: 'price',
                    mapping: '117',
                    type: 'float'
                },
                {
                    name: 'real',
                    mapping: 'real',
                    type: 'float'
                },
                {
                    name: 'curr',
                    mapping: 'curr',
                    type: 'string'
                }
            ],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    totalProperty: "c",
                    rootProperty: "d",
                    successProperty: "s"
                }
            }
        });