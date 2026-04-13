
Ext.define("TCPlus.view.other.TrackerRecord", {
    extend: 'Ext.view.View',
    alias: "widget.trackerrecord",
    layout: "fit",
    height: 110,
    width: 120 * global_TrackerRecordTotalRecord,
    storeTracker: null,
    style: "background-color: #000;overflow:hidden;",
    initComponent: function() {
        var me = this;
        me.storeTracker = Ext.create('Ext.data.Store', {
            fields: [
                fieldStkCode, fieldTime,
                fieldTransAction, fieldLast, fieldUnit,
                fieldBuyBroker, fieldSellBroker, fieldPI, 'src', 'color', 'tooltip'
            ],
            autoLoad: {params:{start:0, limit:global_TrackerRecordTotalRecord}}, 
            pageSize: global_TrackerRecordTotalRecord,
            sorters: [
                {
                    property: fieldTime,
                    direction: 'DESC'
                }

            ],
            data: []
        });
        var feedTpl = new Ext.XTemplate('<tpl for=".">',
                '<div class="tr" style="width:120px;height: 110px;float:left;" cellspacing="0" cellpadding="0">',
                '<table border="0" style="height:100px;width:110px;margin:5px; border: 1px solid #FFD600; ">',
                '<tr><td width="70%"><div style="float:left;color:{color};">{' + fieldStkCode + '}</div>',
                '</td><td rowspan="6"><div style="float:left;color:{color};padding-right:5px;"> <img src="{src}"/></div></td></tr>',
                '<tr><td><div style="float:left;color:{color}">{' + fieldUnit + '}</div></td><tr>',
                '<tr><td><div style="float:left;color:{color}">{' + fieldLast + '}</div></td></tr>',
                '<tr><td><div title="{tooltip}" style="float:left;color:{color}">{' + fieldBuyBroker + '}</div></td></tr>',
                '<tr><td><div title="{tooltip}" style="float:left;color:{color}">{' + fieldSellBroker + '}</div></td></tr>',
                '</table>',
                '</div>',
                '</tpl>');
        Ext.apply(me, {
            tpl: feedTpl,
            store: me.storeTracker,
            itemSelector: 'p.tr',
            emptyText: 'No data',
            listeners: {
                afterrender: function() {
                    me._subscribe();
                },
                beforedestroy: function() {
                    conn.unsubscribeTransaction();
                }
            }
        });
        me.callParent(arguments);
    },
    updateFeedRecord: function(feedObj) {
        var me = this;
        var temp_PI = feedObj[fieldPI];
        var imageTag = "";
        var color = "";
        if (temp_PI.toLowerCase() == 'b') {
            imageTag = "images/tcliteSub/ArrowUp_35.png";
            color = "#64FE2E";
        } else if (temp_PI.toLowerCase() == 's') {
            imageTag = "images/tcliteSub/ArrowDown_35.png";
            color = "#FE2E2E";
        } else {
            imageTag = "images/tcliteSub/UnChg_35.png";
            color = "#FFFF00";
        }
        feedObj["src"] = imageTag;
        feedObj["color"] = color;
        feedObj["33"] = stockutil.getStockPart(feedObj["33"]);
        feedObj[fieldUnit] = formatutils.formatNumber(feedObj[fieldUnit]);
        
        var temp_BuySellBroker = feedObj[fieldBrokerId];
        if (!feedObj[fieldBuyBroker]) {
            feedObj[fieldBuyBroker] = "-";
        }
        if (!feedObj[fieldSellBroker]) {
            feedObj[fieldSellBroker] = "-";
        }
        
        if (temp_BuySellBroker) {
			var tempBroker = ( temp_BuySellBroker ).split( ',' );
			if(tempBroker[1].indexOf('|') != -1 || tempBroker[3].indexOf('|') != -1){
    			  var brokerToolTip = '';
    			  var buyBrokerList = tempBroker[1].split('|');
    			  var sellBrokerList = tempBroker[3].split('|');
    			  var volList = tempBroker[4].split('|');
    			  for(var i=0; i<volList.length; i++){
    				  brokerToolTip = brokerToolTip.concat("BBH:" + buyBrokerList[i] + ", " + "SBH:" + sellBrokerList[i] + ", " +"Vol:" + volList[i] + "&#13;");
    			  }
    			  
    			  feedObj[fieldBuyBroker] = "GROUP";
    			  feedObj[fieldSellBroker] = "GROUP";
    			  feedObj['tooltip'] = brokerToolTip; 
    		  }else{
    			  feedObj[fieldBuyBroker] = tempBroker[1];
    			  feedObj[fieldSellBroker] = tempBroker[3];
    		  }
		}
        me.storeTracker.loadData([feedObj], true);
    },
    _subscribe: function() {
        var me = this.findParentByType("window");
        me.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
        conn.getTrackerHistory({
        	exch:exchangecode,
        	success: function(response){
        		me.setLoading(false);
        		var dataObj = response;
        		var tempArr = [];
        		for(var i=0; i<dataObj.length; i++){
        			trackerRecord.updateFeedRecord(dataObj[i]);
        		}
        	}
        });
        
        if (!fullList[exchangecode]) {
            conn.getFullList({
                exch: exchangecode,
                success: function(resp) {
                    me.setLoading(false);
                    conn.subscribeTransaction();
                }
            });
        } else {
            conn.subscribeTransaction();
        }
    },
});