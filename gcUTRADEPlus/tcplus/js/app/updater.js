var updater = {
    updateQuote: function(dataObj) {
        Storage.procJson(dataObj);
    },
    updateQuote06: function(dataObj) {
        Storage.procJson06(dataObj);
    },
    updateQuote12: function(dataObj) {
        try {
            var mdList = n2ncomponents.getMDList().mdl;

            if (mdList.length > 0) { // update only mdl components
                if (dataObj && dataObj.s) {
                    for (var i = 0; i < dataObj.d.length; i++) {
                        var dt = dataObj.d[i];

                        for (var ii = 0; ii < mdList.length; ii++) {
                            mdList[ii].updateFeedRecord(dt);
                        }
                    }
                }
            }
        } catch (e) {
            console.log('[main][updateQuote12] Exception ---> ' + e);
        }
    },
    updateTransactPush: function() {

    },
    updateSummary: function(responseText) {
        resetCheckAliveTimer();//v1.3.34.45

        var obj = responseText;
        if (typeof obj == 'string') {
            try {
                obj = Ext.decode(responseText);
            } catch (e) {
            }
        }

        if (obj != null && obj.s == true) {
            //test typeIndexList
            if (obj.t == typeIndex || obj.t == typeIndexList) {
                if (marketOverviewPanel != null)
                    marketOverviewPanel.updateSummary(obj);

                if (topPanelBar != null)
                    topPanelBar.updateSummary(obj);

                if (indices != null)
                    indices.updateIndices(obj);

            } else if (obj.t == typeScoreBoard) {
                if (marketOverviewPanel != null)
                    marketOverviewPanel.updateSummary(obj);
                if (topPanelBar != null)
                    topPanelBar.updateSummary(obj);
            }
        }
    },
    updateTime: function(responseText) {
        resetCheckAliveTimer();//v1.3.34.45

        var convertPercentageFormat = function(value) {
            return value.toFixed(2);
        };

        var convertNumberFormat = function(value) {
            value.toFixed(3);
            value += '';
            var x = value.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }

            var returnVal = x1 + x2;
            if (returnVal.indexOf('.') == -1) {
                returnVal += ".000";
            }
            return returnVal;
        };

        try {
            var obj = responseText;
            if (typeof obj == 'string') {
                obj = Ext.decode(responseText);
            }

            if (obj.s) {
                var listData = obj.d;
                for (var i = 0; i < listData.length; i++) {
                    var dataObj = listData[i];
                    
                    if(dataObj[fieldTPSts]){
    					var tpsts = "";
    					for(var j=0; j<global_TPMapping.length; j++){
    						var obj = global_TPMapping[j];
    						if(dataObj[fieldTPSts] == obj.code){
    							tpsts = obj.name;
    							break;
    						}
    					}

                                        // Update trading phase label
                                        if (N2N_CONFIG.mktSumDisplayTPStatus && topPanelBar) {
                                            var tradePhaseEl = topPanelBar.tLabelTPValue.getEl();
                                            if (tradePhaseEl && tpsts) {
                                                var formatTP = "[ " + tpsts + " ]";
                                                topPanelBar._autoWidth(topPanelBar.tLabelTPValue, formatTP);
                                                tradePhaseEl.update(formatTP);
                                            }
                                        }

    					var userInfo = {"trdPhase": tpsts};
    					window.parent.postMessage(JSON.stringify(userInfo), document.location.origin);
    				}

                    if (dataObj[fieldHotMarket] != null) {
                        var temp = dataObj[fieldHotMarket].split("|");

                        var stringTitle = "";
                        var stringDate = temp[1];
                        var stringTime = temp[2];
                        var reason = temp[5];
                        var suspendedCIStr = '';

                        if (temp[0] == "H") {
                            stringTitle = languageFormat.getLanguage(20658, "TRADING HALT - CIRCUIT BREAKER TRIGGERED");
                            var valuePrev = parseFloat(temp[3]);
                            var valueCurr = parseFloat(temp[4]);
                            var totalDifferent = valuePrev - valueCurr;
                            var totalPerc = convertPercentageFormat((totalDifferent / valueCurr) * 100);
                            suspendedCIStr = convertNumberFormat(valuePrev) + ' (' + convertNumberFormat(totalDifferent) + ' , ' + totalPerc + '%)';
                        } else if (temp[0] == "R") {
                            stringTitle = languageFormat.getLanguage(20659, "TRADING RESUME");
                        }

                        if (stringDate.length == 8) {
                            stringDate = stringDate.substring(stringDate.length - 2, stringDate.length) + "-" + stringDate.substring(4, 6) + "-" + stringDate.substring(0, 4);
                        }

                        stringTime = stringTime.substring(0, 2) + ":" + stringTime.substring(2, 4) + ":" + stringTime.substring(4, 6);

                        var ico = null;
                        if (!isMobile) {
                            ico = Ext.MessageBox.INFO;
                        }

                        if (global_dynamicLimitSetting == '1' && temp[0] == 'M' && !isMobile) {
                            var dlObj = new Object();
                            dlObj.datetime = stringDate + ' ' + stringTime;
                            dlObj.reason = reason;
                            global_DynamicLimitList.push(dlObj);
                            quoteScreen.callImageBlink('openDynamicLimit_Quote');
                        } else {
                            var stringContent = "<table border='0'>";
                            stringContent += "<tr>";
                            stringContent += "<td width='40%'>";
                            stringContent += "<b>" + languageFormat.getLanguage(20660, 'Trading Status Information') + "</b>";
                            stringContent += "</td>";
                            stringContent += "<td>";
                            stringContent += stringTitle;
                            stringContent += "</td>";
                            stringContent += "</tr>";
                            stringContent += "<tr>";
                            stringContent += "<td>";
                            stringContent += languageFormat.getLanguage(20661, "Date & Time");
                            stringContent += "</td>";
                            stringContent += "<td>";
                            stringContent += stringDate + ' ' + stringTime;
                            stringContent += "</td>";
                            stringContent += "</tr>";

                            if (suspendedCIStr != '') {
                                stringContent += "<tr>";
                                stringContent += "<td>";
                                stringContent += languageFormat.getLanguage(20662, "Suspended CI");
                                stringContent += "</td>";
                                stringContent += "<td>";
                                stringContent += suspendedCIStr;
                                stringContent += "</td>";
                                stringContent += "</tr>";
                            }

                            stringContent += "<tr>";
                            stringContent += "<td>";
                            stringContent += languageFormat.getLanguage(20663, "Reason");
                            stringContent += "</td>";
                            stringContent += "<td>";
                            stringContent += reason;
                            stringContent += "</td>";
                            stringContent += "</tr>";
                            stringContent += "</table>";

                            msgutil.show({
                                msg: stringContent,
                                animEl: 'elId',
                                icon: ico,
                                buttons	: Ext.Msg.OK,
                                width: 500
                            }, false);
                        }
                            
                    }

                    if (dataObj[fieldSbExchgCode] == exchangecode) { // verify from n2nconstant.js
                        if (topPanelBar != null) {
                            topPanelBar.setClockTime(dataObj[fieldTransTime], dataObj[fieldTransDate]);// verify from n2nconstant.js
                            topPanelBar.setDate(dataObj[fieldTransDate]);// verify from n2nconstant.js
                        }
                    }
                }
            }
        } catch (e) {
        }
    },
    updateTransact: function(responseText) {

    },
    updateTransactSumm: function(responseText) {

    },
    updateOrdSts: function(responseText) {
        var obj = null;
        try {
            obj = Ext.decode(responseText);

            if (obj.t == typeOrderStatus || obj.t == typeOrderStatusPush) {
                if (orderStatusPanel != null)
                    orderStatusPanel.updateOrdSts(obj);

                if (ordDetailPanels) {
                    var total = ordDetailPanels.length;
                    for (var i = 0; i < total; i++) {
                        ordDetailPanels[i].updateOrdDetail(obj);
                    }
                }
            }
            if (obj.t == typeMFOrderStatus) {
                if (mfOrderStatusPanel != null)
                mfOrderStatusPanel.updateOrdSts(obj);
            } 
        } catch (e) {
            debug(e);
        }
    },
    updatePortfolio: function(responseText) {
        var obj = null;
        try {
            obj = Ext.decode(responseText);

            if (obj.t == typePortfolio) {
                if (equityPrtfPanel != null)
                    equityPrtfPanel.updatePortfolio(obj);
            }
            
            if (obj.t == typeMFPortfolio) {
                if (mfEquityPrtfPanel != null)
                    mfEquityPrtfPanel.updatePortfolio(obj);
                
            }
        } catch (e) {
            debug(e);
        }
    },
    updatePriceAlert: function(responseText) {
        try {
            if (priceAlert) {
                priceAlert.updateResultView(responseText);
            }
        } catch (e) {
            debug(e);
        }
    }
};



/*** Other ***/
