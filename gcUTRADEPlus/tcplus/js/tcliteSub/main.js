var main = (function() {
    var tPanel_Panel = null;
    var tPanel_subPanel = {};

    function procData(dataObj) {
        if (tPanel_Panel == null) {
            _createPanel();
        }

        if (dataObj.total == 0) {
            return;
        }

        for (var i = 0; i < dataObj.totalRecord; i++) {
            var newDataObj = dataObj.stockList[i];
            (tPanel_subPanel[i]).updateData(newDataObj);
        }
    }

    function _createPanel() {
        var totalWidth = 0;
        var panelItem = [];
        for (var i = 0; i < parseInt(global_TrackerRecordTotalRecord); i++) {
            tPanel_subPanel[i] = _returnNewPanel(i.toString());
            panelItem.push(tPanel_subPanel[i]);
            totalWidth = (tPanel_subPanel[i]).width;
        }

        resizeWindow((totalWidth * parseInt(global_TrackerRecordTotalRecord)));

        tPanel_Panel = new Ext.container.Container({
            width: (totalWidth * parseInt(global_TrackerRecordTotalRecord)),
            height: 110,
            layout: {
                type: 'table',
                columns: global_TrackerRecordTotalRecord
            },
            cls: 'backgroundBlack',
            border: false,
            defaults: {
                padding: 5
            },
            items: panelItem,
            renderTo: 'content'
        }).show();
    }

    function _returnNewPanel(valueID) {
        var mainId = "subPanel_" + valueID;

        var htmlDesign = "";
        htmlDesign += "<table cellspacing='1' cellpadding='2' border='0' style=' width: 100%; font-size: 9pt; border: 1px solid gold;'>";
        htmlDesign += "<tr>";
        htmlDesign += "<td width='50%' id='" + mainId + "_title' > </td>";
        htmlDesign += "<td width='50%' id='" + mainId + "_image' rowspan='5'> </td>";
        htmlDesign += "</tr>";

        htmlDesign += "<tr>";
        htmlDesign += "<td width='50%' id='" + mainId + "_volumn' style=' overflow: hidden; '> </td>";
        htmlDesign += "</tr>";

        htmlDesign += "<tr>";
        htmlDesign += "<td width='50%' id='" + mainId + "_price' style=' overflow: hidden; ' > </td>";
        htmlDesign += "</tr>";

        htmlDesign += "<tr>";
        htmlDesign += "<td width='50%' id='" + mainId + "_buyer' style=' overflow: hidden; '> </td>";
        htmlDesign += "</tr>";

        htmlDesign += "<tr>";
        htmlDesign += "<td width='50%' id='" + mainId + "_seller' style=' overflow: hidden; '> </td>";
        htmlDesign += "</tr>";

        htmlDesign += "</table>";

        var temp = new Ext.container.Container({
            mainCompId: mainId,
            mainId: '',
            width: 130,
            height: 100,
            tTextField_Symbol: null,
            tTextField_Volumn: null,
            tTextField_Price: null,
            tTextField_Buyer: null,
            tTextField_Seller: null,
            cls: 'backgroundBlack',
            border: false,
            tImage_UpDown: null,
            updateData: function(dataObj) {
                if (dataObj == null) {
                    return;
                }

                var panel = this;

                if (global_trackerDebug.toLowerCase() == 'true') {
                    console.log('[main][_returnNewPanel] dataObj ---> ');
                    console.log(dataObj);
                    console.log('stock code 	    : 33 : ' + dataObj['33']);
                    console.log('ex         	    : 45 : ' + dataObj['45']);
                    console.log('ref price  	    : 51 : ' + dataObj['51']);
                    console.log('date       	    : 53 : ' + dataObj['53']);
                    console.log('time       	    : 54 : ' + dataObj['54']);
                    console.log('last done price   : 98 : ' + dataObj['98']);
                    console.log('last done qty     : 99 : ' + dataObj['99']);
                    console.log('transaction no    : 103 : ' + dataObj['103']);
                    console.log('Price Indicator   : 104 : ' + dataObj['104']);
                    console.log('Buy & Sell Broker	: 120 : ' + dataObj['120']);
                    console.log('exchange          : 131 : ' + dataObj['131']);
                }

                /*
                 * 33 = stock code
                 * 45 = ex
                 * 51 = ref price
                 * 53 = date
                 * 54 = time
                 * 98 = last done price
                 * 99 = last done qty
                 * 103 = trns no
                 * 104 = Price Indicator
                 * 120 = Buy & Sell Broker
                 * 131 = exchange
                 */
                var temp_StockCode = dataObj['33'];
                var temp_RefPrice = dataObj['51'];
                var temp_LastDonePrice = dataObj['98'];
                var temp_LastDoneQty = dataObj['99'];
                var temp_TransactionNo = dataObj['103'];
                var temp_PI = dataObj['104'];
                var temp_BuySellBroker = dataObj['120'];

                var newMainId = temp_StockCode + "_" + temp_TransactionNo;

                if (panel.mainId != newMainId) {
                    panel.mainId = newMainId;

                    // split stock code exchange
                    var newValue = (temp_StockCode);
                    var index = newValue.lastIndexOf('.');
                    if (index != -1) {
                        newValue = temp_StockCode.substring(0, index);
                    }

                    var imageTag = "";
                    var color = "";
                    if (temp_PI.toLowerCase() == 'b') {
                        imageTag = "<img src='images/tcliteSub/ArrowUp_35.png' />";
                        color = "#64FE2E";
                    } else if (temp_PI.toLowerCase() == 's') {
                        imageTag = "<img src='images/tcliteSub/ArrowDown_35.png' />";
                        color = "#FE2E2E";
                    } else {
                        imageTag = "<img src='images/tcliteSub/UnChg_35.png' />";
                        color = "#FFFF00";
                    }

                    panel.tImage_UpDown.update(imageTag);
                    panel.tTextField_Price.update('<label style=" color: ' + color + '; font-weight: 900  !important; ">' + N2NNumberFormat.formatNumber(temp_LastDonePrice) + '</label>');
                    panel.tTextField_Symbol.update('<label style=" color: ' + color + '; font-weight: 900  !important; ">' + newValue + '</label>');
                    panel.tTextField_Volumn.update('<label style=" color: ' + color + '; font-weight: 900  !important; ">' + N2NNumberFormat.formatNumber(temp_LastDoneQty) + '</label>');

                    if (temp_BuySellBroker != null) {
                        var tempBroker = (temp_BuySellBroker).split(',');

                        panel.tTextField_Buyer.update('<label style=" color: ' + color + '; font-weight: 900  !important; ">' + tempBroker[1] + '</label>');
                        panel.tTextField_Seller.update('<label style=" color: ' + color + '; font-weight: 900  !important; ">' + tempBroker[3] + '</label>');
                    }
                }

            },
            listeners: {
                afterrender: function(thisPanel) {
                    thisPanel.tTextField_Symbol = thisPanel._returnText();
                    thisPanel.tTextField_Volumn = thisPanel._returnText();
                    thisPanel.tTextField_Price = thisPanel._returnText();
                    thisPanel.tTextField_Buyer = thisPanel._returnText();
                    thisPanel.tTextField_Seller = thisPanel._returnText();

                    thisPanel.tImage_UpDown = new Ext.Component({
                        autoEl: {
                            tag: 'div',
                            style: 'padding-left: 20px;'
                        }
                    });

                    thisPanel.tTextField_Symbol.render(thisPanel.mainCompId + "_title");
                    thisPanel.tTextField_Volumn.render(thisPanel.mainCompId + "_volumn");
                    thisPanel.tTextField_Price.render(thisPanel.mainCompId + "_price");
                    thisPanel.tTextField_Buyer.render(thisPanel.mainCompId + "_buyer");
                    thisPanel.tTextField_Seller.render(thisPanel.mainCompId + "_seller");
                    thisPanel.tImage_UpDown.render(thisPanel.mainCompId + "_image");
                }
            },
            _returnText: function() {
                var tempComp = new Ext.form.Label({
                    text: '-'
                });

                return tempComp;
            },
            items: {
                html: htmlDesign,
                border: false
            }
        });

        return temp;
    }

    return {
        procData: procData
    };

})();