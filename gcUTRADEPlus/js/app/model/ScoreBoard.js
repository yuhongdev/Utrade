/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


Ext.define('TCPlus.model.ScoreBoard',
        {
            extend: 'Ext.data.Model',
            idProperty: fieldSbId,
            fields: [
                {name: fieldSbId, sortType: 'asUCString'},
                {name: fieldSbName, sortType: 'asUCString'},
                {name: fieldSbVol, sortType: 'asInt', type: 'int'},
                {name: fieldSbVal, sortType: 'asFloat', type: 'float'},
                {name: fieldSbUp, sortType: 'asInt', type: 'int'},
                {name: fieldSbDown, sortType: 'asInt', type: 'int'},
                {name: fieldSbUnchg, sortType: 'asInt', type: 'int'},
                {name: fieldSbUntrd, sortType: 'asInt', type: 'int'}
            ],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    rootProperty: "data",
                    totalProperty: 'count',
                    successProperty: "success"
                }
            }

        });