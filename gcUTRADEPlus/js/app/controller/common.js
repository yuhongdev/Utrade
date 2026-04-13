/* 
 * Provides common controller functions
 * 
 */

function updateActivePanel(view, record, cidx, activateItem) {
    var activate = activateItem != undefined ? activateItem : false;
    if (callOrdPadTaskID != null) {
        clearTimeout(callOrdPadTaskID);
        callOrdPadTaskID = null;
    }

    callOrdPadTaskID = setTimeout(function() {
        if (orderHistoryPanel && view && view.id == orderHistoryPanel.getView().id) {
            updateActivePanelTaskOH(view, record, cidx, activate);
        } else {
            updateActivePanelTask(view, record, cidx, activate);
        }
        callOrdPadTaskID = null;
    }, 250);

}

function updateActiveMarketDepth(stkCode, stkName) {

    if (callMarketDepthTaskID !== null) {
        clearTimeout(callMarketDepthTaskID);
        callMarketDepthTaskID = null;
    }

    callMarketDepthTaskID = setTimeout(function() {
        createMarketDepthPanel(stkCode, stkName);

        callMarketDepthTaskID = null;
    }, 250);

}

function updateActivePanelTask(view, record, cidx, activateItem) {
    if (!view) {
        return;
    }

    try {
        var grid = view.ownerGrid;
        if (!grid) {
            return;
        }
        
        var recData = record.data;
        var stkcode;
        var stkname;
        if (recData.hasOwnProperty(fieldStkCode)) {
            stkcode = recData[fieldStkCode];
        } else if (recData.hasOwnProperty('StkCode')) {
            stkcode = recData['StkCode'];
        }
        if (recData.hasOwnProperty(fieldStkName)) {
            stkname = recData[fieldStkName];
        } else if (recData.hasOwnProperty('StkName')) {
            stkname = recData['StkName'];
        }

        var mode;
        var prc = '';
        var sts;
        var ordRec = new Object();
        ordRec.accbranchNo = '';

        /*
        if (equityPrtfPanel) {
            ordRec.accbranchNo = equityPrtfPanel.accbranchNo;
        } else if (derivativePrtfPanel) {
            ordRec.accbranchNo = derivativePrtfPanel.accbranchNo;
        }*/
        
        var isDerivativePanel = false;
        if(equityPrtfPanel){
        	if(grid.id == equityPrtfPanel.id){
        		ordRec.accbranchNo = equityPrtfPanel.accbranchNo;
        	}
        }
        if (derivativePrtfPanel) {
        	if(view.id == derivativePrtfPanel.tPanel_GridSummary.items.items[0].id){
        		ordRec.accbranchNo = derivativePrtfPanel.accbranchNo;
        		if(isDealerRemisier){
					ordRec.OrdStsAccList = [[recData['51'] + global_AccountSeparator + recData['52'], recData['51'] + ' - ' + recData['52']]];
        		}
        		isDerivativePanel = true;
        	}
        }

        if(isDealerRemisier){
        	if(view != null){
        		if(grid.id != quoteScreen.id && !isDerivativePanel){
        			if(activeWatchlistArr && activeWatchlistArr.length > 0){
        				if(grid.id != activeWatchlistArr[0].wlpanel.id){
        					if(recData.AccountName != null && recData.AccountName.length > 0){
            					ordRec.OrdStsAccList = [[recData.AccNo + global_AccountSeparator + recData.BCode, recData.AccNo + ' - ' + recData.AccountName + ' - ' + recData.BCode]];
        					}else{
            					ordRec.OrdStsAccList = [[recData.AccNo + global_AccountSeparator + recData.BCode, recData.AccNo + ' - ' + recData.BCode]];
        					}
        				}
        			}else{
        				if(recData.AccountName != null && recData.AccountName.length > 0){
        					ordRec.OrdStsAccList = [[recData.AccNo + global_AccountSeparator + recData.BCode, recData.AccNo + ' - ' + recData.AccountName + ' - ' + recData.BCode]];
    					}else{
        					ordRec.OrdStsAccList = [[recData.AccNo + global_AccountSeparator + recData.BCode, recData.AccNo + ' - ' + recData.BCode]];
    					}        			
        			}
        		}
        	}
        }

        if(isDerivativePanel){
        	mode = modeOrdSell;
        	prc = getBuySellPrice(record, mode, isDerivativePanel);
        }else if (cidx != null) {
        	var gridView = view.ownerCt;
        	var cell = gridView.columns[cidx].dataIndex;

        	if (cell == fieldBuy || cell == 'Buy' || cell == fieldBqty) {
        		mode = modeOrdSell;
        		prc = getBuySellPrice(record, mode); // TODO
        	} else if (cell == fieldSell || cell == 'Sell' || cell == fieldSqty) {
        		mode = modeOrdBuy;
        		prc = getBuySellPrice(record, mode);
        	} else {
        		if (recData.OrdNo != null || recData.TktNo != null) {
        			sts = recData.Sts;

        			if (sts) {
        				prc = recData.OrdPrc;
        				mode = modeOrdRevise;

        				ordRec.accNo = recData.AccNo + global_AccountSeparator + recData.BCode;
        				ordRec.ordQty = recData.UnMtQty;
        				ordRec.unMtQty = recData.UnMtQty;
        				ordRec.ordPrc = recData.OrdPrc;
        				prc = recData.OrdPrc;

        				ordRec.SubOrdNo = recData.SubOrdNo;
        				ordRec.ordType = recData.OrdType;
        				ordRec.validity = recData.Validity;
        				ordRec.tktNo = recData.TktNo;
        				ordRec.ordNo = recData.OrdNo;
        				ordRec.ordSts = sts;
        				ordRec.expDate = recData.ExpDate;
        				ordRec.stopLimit = recData.StopLimit;
        				ordRec.MinQty = recData.MinQty;
        				ordRec.DsQty = recData.DsQty;
        				ordRec.Action = recData.PrevAct;
        				ordRec.MtQty = recData.MtQty;//shuwen 28/05/2013
        				ordRec.BCode = recData.BCode; //shuwen 23/08/2013
        				ordRec.BrokerCode = recData.BrokerCode;  //shuwen 23/08/2013
        				ordRec.SettOpt = recData.SettOpt;
        				ordRec.SettCurr = recData.Currency;

        				ordRec.TPType = recData.TPType;
        				ordRec.TPDirection = recData.TPDirection;
        				ordRec.TradCond = recData.TradCond;
                        ordRec.State = recData.State;
        			}
        		} else {

                    if (recData.PrtfNo || recData['43']) {
                        mode = modeOrdSell;
                    } else {
                        mode = modeOrdBuy;
                    }

        			prc = getBuySellPrice(record, mode); // TODO
        		}
        	}
        } else {
        	if (recData.OrdNo != null || recData.TktNo != null) {
        		sts = recData.Sts;

        		if (sts) {
        			mode = modeOrdRevise;
        			prc = recData.OrdPrc;

        			ordRec.accNo = recData.AccNo + global_AccountSeparator + recData.BCode;
        			// ordRec.ordQty = recData.OrdQty;
        			ordRec.ordQty = recData.UnMtQty;
        			ordRec.unMtQty = recData.UnMtQty;
        			ordRec.ordPrc = recData.OrdPrc;
        			prc = recData.OrdPrc;
        			ordRec.ordType = recData.OrdType;
        			ordRec.validity = recData.Validity;
        			ordRec.tktNo = recData.TktNo;
        			ordRec.ordNo = recData.OrdNo;
        			ordRec.ordSts = sts;
        			ordRec.expDate = recData.ExpDate;
        			ordRec.SubOrdNo = recData.SubOrdNo;

        			// prc = getBuySellPrice(rec, mode);
        			ordRec.stopLimit = recData.StopLimit;
        			ordRec.MinQty = recData.MinQty;
        			ordRec.DsQty = recData.DsQty;
        			ordRec.Action = recData.PrevAct;
        			ordRec.MtQty = recData.MtQty;//shuwen 28/05/2013
        			ordRec.BCode = recData.BCode; //shuwen 23/08/2013
        			ordRec.BrokerCode = recData.BrokerCode;  //shuwen 23/08/2013
        			ordRec.SettOpt = recData.SettOpt;
        			ordRec.SettCurr = recData.Currency;
        			ordRec.TPType = recData.TPType;
        			ordRec.TPDirection = recData.TPDirection;
        			ordRec.TradCond = recData.TradCond;   
                    ordRec.State = recData.State;
        		}
        	} else if (recData.PrtfNo || recData['43']) {
        		mode = modeOrdSell;
        		prc = getBuySellPrice(record, mode); // TODO
        	} else {
                mode = modeOrdBuy;
                prc = getBuySellPrice(record, mode);
        	}
        }

        ordRec.price = prc;
        
        // activate orderpad
        if (mode && stkcode) {
            if (activateItem) { // forced to activate order pad
                createOrderPad(stkcode, stkname, mode, ordRec, true);
            } else {
                if (N2N_CONFIG.singleClickMode) {
                    createOrderPad(stkcode, stkname, mode, ordRec);
                }
            }
        }
        
        syncAllComps(grid, stkcode, stkname);

        // n2ncomponents.createCorporateNewsAction(record);

    } catch (e) {
        debugutil.debug('updateActivePanelTask', null, e, true);
    }

}

// TODO
function updateActivePanelTaskOH(view, record, cidx, activateItem) {
    if (!view) {
        return;
    }
    
    try {
        var grid = view.ownerGrid;
        if (!grid) {
            return;
        }
        
        var recData = record.data;
        var stkcode = recData.sc;
        var stkname = recData.sy;

        var mode = null;
        var ordRec = new Object();
        var prc = '';
        var sts;

        if (cidx != null) {
            var cell = view.columns[cidx].dataIndex;
            if (cell == fieldBuy || cell == 'Buy' || cell == fieldBqty) {
                mode = modeOrdSell;
                prc = getBuySellPrice(record, mode);
            } else if (cell == fieldSell || cell == 'Sell' || cell == fieldSqty) {
                mode = modeOrdBuy;
                prc = getBuySellPrice(record, mode);
            } else {
                if (recData.on != null || recData.tn != null) {
                    sts = recData.stc;

                    if (sts && canCancelRevise(sts)) {
                        mode = modeOrdRevise;
                        ordRec.accNo = recData.an;
                        // ordRec.ordQty = recData.OrdQty;
                        ordRec.ordQty = recData.uq;
                        ordRec.unMtQty = recData.uq;
                        ordRec.ordPrc = recData.op;
                        prc = recData.op;
                        ordRec.ordType = recData.ot;
                        ordRec.validity = recData.vd;
                        ordRec.tktNo = recData.tn;
                        ordRec.ordNo = recData.on;
                        ordRec.ordSts = sts;
                        ordRec.expDate = recData.ed;
                        ordRec.stopLimit = recData.sl;
                    }
                } else {
                    if (recData.PrtfNo != null) {
                        mode = modeOrdSell;
                    } else {
                        mode = modeOrdBuy;
                    }
                    prc = getBuySellPrice(record, mode); // TODO
                }
            }
        } else {
            var recData = record.data;
            if (recData.on != null || recData.tn != null) {
                sts = recData.stc;
                if (sts && canCancelRevise(sts)) {
                    mode = modeOrdRevise;
                    ordRec.accNo = recData.AccNo + global_AccountSeparator + recData.BCode;
                    // ordRec.ordQty = recData.OrdQty;
                    ordRec.ordQty = recData.uq;
                    ordRec.unMtQty = recData.uq;
                    ordRec.ordPrc = recData.op;
                    prc = recData.op;
                    ordRec.ordType = recData.ot;
                    ordRec.validity = recData.vd;
                    ordRec.tktNo = recData.tn;
                    ordRec.ordNo = recData.on;
                    ordRec.ordSts = sts;
                    ordRec.expDate = recData.ed;
                    // prc = getBuySellPrice(rec, mode);
                    ordRec.stopLimit = recData.sl;
                }
            } else if (recData.PrtfNo != null) {
                mode = modeOrdSell;
            } else {
                mode = modeOrdBuy;
            }
            prc = getBuySellPrice(record, mode);
        }
        ordRec.price = prc;

        // TO REVIEW
        // createChartPanel( stkcode, stkname, true );
        // createMarketDepthPanel(stkcode, stkname);
        // createStkNewsPanel( stkcode, stkname);
        if (mode == null) {
            mode = modeOrdRevise;
        }
        
        // activate orderpad
        if (mode && stkcode) {
            if (activateItem) { // forced to activate order pad
                createOrderPad(stkcode, stkname, mode, ordRec, true);
            } else {
                if (N2N_CONFIG.singleClickMode) {
                    createOrderPad(stkcode, stkname, mode, ordRec);
                }
            }
        }

        syncAllComps(grid, stkcode, stkname);

    } catch (e) {
        debug(e);
    }
}

/**
 * Gets buy or sell price from stock record
 * 
 * @param {object} rec Record object
 * @param {string} mode Order mode
 * @returns {mixed} Price as float or empty string if not found
 */
function getBuySellPrice(rec, mode, isDerivativePanel) {
    var prc = '';
    var recData = rec.data;
    var tempEx =recData[fieldStkCode] != null ? formatutils.getExchangeFromStockCode(recData[fieldStkCode]) : 'KL';
    
    if (mode) {
    	if(tempEx != 'MY'){
    		if (mode == modeOrdBuy) {
    			if (recData[fieldSell] != null && recData[fieldSell] > 0)
    				prc = recData[fieldSell];
    			else if (recData.Sell != null && recData.Sell > 0)
    				prc = recData.Sell;
    			else if (recData[fieldLast] != null && recData[fieldLast] > 0)
    				prc = recData[fieldLast];
    			else if (recData[fieldLacp] != null && recData[fieldLacp] > 0)
    				prc = recData[fieldLacp];
    			else if (recData[fieldPrev] != null && recData[fieldPrev] > 0)
    				prc = recData[fieldPrev];
    			else {
    				// check for other
    				if (recData.Last != null && recData.Last > 0)
    					prc = recData.Last;
    				else if (recData.LACP != null && recData.LACP > 0)
    					prc = recData.LACP;
    				else if (recData.Last != null && recData.Last > 0)
    					prc = recData.Last;
    				else if (recData.OrdPrc != null && recData.OrdPrc > 0)
    					prc = recData.OrdPrc;
    				else if (recData.RefPrc != null && recData.RefPrc > 0)
    					prc = recData.RefPrc;
    			}
    		} else if (mode == modeOrdSell) {
    			if(!isDerivativePanel){
    				if (recData[fieldBuy] != null && recData[fieldBuy] > 0)
    					prc = recData[fieldBuy];
    				else if (recData.Buy != null && recData.Buy > 0)
    					prc = recData.Buy;
    				else if (recData[fieldLast] != null && recData[fieldLast] > 0)
    					prc = recData[fieldLast];
    				else if (recData[fieldLacp] != null && recData[fieldLacp] > 0)
    					prc = recData[fieldLacp];
    				else if (recData[fieldPrev] != null && recData[fieldPrev] > 0)
    					prc = recData[fieldPrev];
    				else {
    					// check for other
    					if (recData.Last != null && recData.Last > 0)
    						prc = recData.Last;
    					else if (recData.LACP != null && recData.LACP > 0)
    						prc = recData.LACP;
    					else if (recData.Last != null && recData.Last > 0)
    						prc = recData.Last;
    					else if (recData.OrdPrc != null && recData.OrdPrc > 0)
    						prc = recData.OrdPrc;
    					else if (recData.RefPrc != null && recData.RefPrc > 0)
    						prc = recData.RefPrc;
    				}
    			}else{
    				if (recData['lastDone'] != null && recData['lastDone'] > 0) //last done
    					prc = recData['lastDone'];
    				else if (recData['78'] != null && recData['78'] > 0) //avg price
    					prc = recData['78'];
    			}
    			if (recData.StkCode && !prc) {
    				prc = Storage.returnRecord(recData.StkCode)[fieldLacp];
    			}
    		}
    	}else{
    		if (mode == modeOrdBuy) {
    			if (recData[fieldSell] != null)
    				prc = recData[fieldSell];
    			else if (recData.Sell != null)
    				prc = recData.Sell;
    			else if (recData[fieldLast] != null)
    				prc = recData[fieldLast];
    			else if (recData[fieldLacp] != null)
    				prc = recData[fieldLacp];
    			else if (recData[fieldPrev] != null)
    				prc = recData[fieldPrev];
    			else {
    				// check for other
    				if (recData.Last != null)
    					prc = recData.Last;
    				else if (recData.LACP != null)
    					prc = recData.LACP;
    				else if (recData.Last != null)
    					prc = recData.Last;
    				else if (recData.OrdPrc != null)
    					prc = recData.OrdPrc;
    				else if (recData.RefPrc != null)
    					prc = recData.RefPrc;
    			}
    		} else if (mode == modeOrdSell) {
    			if(!isDerivativePanel){
    				if (recData[fieldBuy] != null)
    					prc = recData[fieldBuy];
    				else if (recData.Buy != null)
    					prc = recData.Buy;
    				else if (recData[fieldLast] != null)
    					prc = recData[fieldLast];
    				else if (recData[fieldLacp] != null)
    					prc = recData[fieldLacp];
    				else if (recData[fieldPrev] != null)
    					prc = recData[fieldPrev];
    				else {
    					// check for other
    					if (recData.Last != null)
    						prc = recData.Last;
    					else if (recData.LACP != null)
    						prc = recData.LACP;
    					else if (recData.Last != null)
    						prc = recData.Last;
    					else if (recData.OrdPrc != null)
    						prc = recData.OrdPrc;
    					else if (recData.RefPrc != null)
    						prc = recData.RefPrc;
    				}
    			}else{
    				if (recData['lastDone'] != null) //last done
    					prc = recData['lastDone'];
    				else if (recData['78'] != null) //avg price
    					prc = recData['78'];
    			}
    			if (recData.StkCode && !prc) {
    				prc = Storage.returnRecord(recData.StkCode)[fieldLacp];
    			}
    		}
    	}
    }

    return prc;
}

function canCancelRevise(ordsts) {
    if (ordsts && ordsts != 'CN' && ordsts != 'RJ' && ordsts != 'FL' && ordsts != 'DN' && ordsts != 'EXP')
        return true;

    return false;
}

/**
 * Description <br/>
 * 		set number decimal place format and set thousand format
 * @param value
 * @param decimalPlace
 */
function doRound(value, decimalPlace) {
    var defaultNumber = 10;
    var finalResult = 0;
    // set decimal place
    for (var i = 1; i < decimalPlace; i++) {
        defaultNumber = defaultNumber * 10;
    }
    finalResult = Math.round(value * defaultNumber) / defaultNumber;

    // set thousand format
    finalResult += '';
    var x = finalResult.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }

    return x1 + x2;
}

function calculationOfPortFolioDetail(quantity, unitPrice, transFee, action) {
    var total = 0;

    if (quantity != null && unitPrice != null && transFee != null) {
        quantity = parseFloat(quantity);
        unitPrice = parseFloat(unitPrice);
        transFee = parseFloat(transFee);

        if (!unitPrice) {
            unitPrice = 0;
        }
        if (!quantity) {
            quantity = 0;
        }
        if (!transFee) {
            transFee = 0;
        }

        if (action == 'Buy' || action == '1') {
            total = quantity * unitPrice + transFee;
        } else {
            total = quantity * unitPrice - transFee;
        }
    }

    return total;
}

function getActiveStk() {
    var stkObj = new Object();
    // Currently default to quote screen
    var record = quoteScreen.getSelectionModel().getSelection();
    if (record.length > 0) {
        // Assume there is one record
        var rec = record[0];
        stkObj[fieldStkCode] = rec.get(fieldStkCode);
        stkObj[fieldStkName] = rec.get(fieldStkName);
        // stkObj['News'] = rec.get('News');

        return stkObj;
    } else {
        return null;
    }
}

function getActiveTabStkPrice(mode) {
    var activeTab = tabPanel1.getActiveTab();
    if (activeTab == null)
        return null;

    var comp = activeTab.getComponent(0);

    var stkobj = getActiveTabStk();
    if (stkobj != null) {
        if (indexOfPanels(comp, marketMoverPanels) != -1) {
            var rec = comp.getSelectionModel().getSelection();
            if (rec != null)
                stkobj.price = getBuySellPrice(rec, mode);
        }
        else if (indexOfPanels(comp, activeWatchlistArr) != -1) {
            var rec = comp.getSelectionModel().getSelection();
            if (rec != null)
                stkobj.price = getBuySellPrice(rec, mode);
        }
        else if (equityPrtfPanel != null && comp.id == equityPrtfPanel.id) {
            var rec = comp.getSelectionModel().getSelection();
            if (rec != null)
                stkobj.price = getBuySellPrice(rec, mode);
        }
        else if (equityPrtfRealizedPanel != null && comp.id == equityPrtfRealizedPanel.id) {
            var rec = comp.getSelectionModel().getSelection();
            if (rec != null)
                stkobj.price = getBuySellPrice(rec, mode);
        }
        else if (orderStatusPanel != null && comp.id == orderStatusPanel.id) {
            var rec = comp.getSelectionModel().getSelection();
            if (rec != null)
                stkobj.price = getBuySellPrice(rec, mode);
        }
    }

    return stkobj;
}

function _getActiveTabStk() {
    // TODO
    // var activeTab = tabPanel1.getActiveTab();
    // if (activeTab == null)
    //    return null;

    // var comp = activeTab.getComponent(0);

    var stkobj = new Object();
    // TODO
    /*
     if (indexOfPanels(comp, marketMoverPanels) != -1) {
     var rec = comp.getSelectionModel().getSelection();
     if (rec != null) {
     stkobj[fieldStkCode] = rec.get(fieldStkCode);
     stkobj[fieldStkName] = rec.get(fieldStkName);
     stkobj['News'] = rec.get('News');
     }
     }
     else if (indexOfPanels(comp, activeWatchlistArr) != -1) {
     var rec = comp.getSelectionModel().getSelection();
     if (rec != null) {
     stkobj[fieldStkCode] = rec.get(fieldStkCode);
     stkobj[fieldStkName] = rec.get(fieldStkName);
     stkobj['News'] = rec.get('News');
     }
     }
     else if (equityPrtfPanel != null && comp.id == equityPrtfPanel.id) {
     var rec = comp.getSelectionModel().getSelection();
     if (rec != null) {
     stkobj[fieldStkCode] = rec.get('StkCode');
     stkobj[fieldStkName] = rec.get('StkName');
     stkobj['News'] = '';
     }
     }
     else if (equityPrtfRealizedPanel != null && comp.id == equityPrtfRealizedPanel.id) {
     var rec = comp.getSelectionModel().getSelection();
     if (rec != null) {
     stkobj[fieldStkCode] = rec.get('StkCode');
     stkobj[fieldStkName] = rec.get('StkName');
     stkobj['News'] = '';
     }
     }
     else if (orderStatusPanel != null && comp.id == orderStatusPanel.id) {
     var rec = comp.getSelectionModel().getSelection();
     if (rec != null) {
     stkobj[fieldStkCode] = rec.get('StkCode');
     stkobj[fieldStkName] = rec.get('StkName');
     stkobj['News'] = '';
     }
     }
     */
    if (stkobj[fieldStkCode] == null) {
        if (marketMoverPanels.length > 0) {
            comp = marketMoverPanels[0];
            var rec = comp.getSelectionModel().getSelection();
            if (rec != null) {
                stkobj[fieldStkCode] = rec.get(fieldStkCode);
                stkobj[fieldStkName] = rec.get(fieldStkName);
                stkobj['News'] = rec.get('News');
            }
            else
                return null;
        }
        else
            return null;
    }

    return stkobj;
}

function getRecById(id) {

    if (id == null || typeof id != 'string' || id == '')
        return null;

    var rec = null;
    var store = null;
    var alreayGet = false;

    if (!alreayGet) {
        // if (marketMoverPanels.length > 0) {  	// quote screen
        if (quoteScreen) {
            var mmpanel = quoteScreen;
            store = mmpanel.getStore();
            rec = store.getById(id);
            if (rec != null) {
                alreayGet = true;
            }
        }
    }

    if (!alreayGet) {
        if (activeWatchlistArr != null) {			// watch list
            if (activeWatchlistArr.length > 0) {
                for (var i = 0; i < activeWatchlistArr.length; i++) {
                    var watchListObj = activeWatchlistArr[i];
                    rec = watchListObj.wlpanel.store.getById(id);
                    if (rec != null) {
                        alreayGet = true;
                    }
                }
            }
        }
    }

    if (!alreayGet) {
        if (orderStatusPanel != null) {			// order status 
            store = orderStatusPanel.getStore();
            rec = store.getById(id);
            if (rec != null) {
                alreayGet = true;
            }
        }
    }

    if (!alreayGet) {
        if (equityPrtfPanel != null) {			// port folio
            store = equityPrtfPanel.getStore();
            rec = store.getById(id);
            if (rec != null) {
                alreayGet = true;
            }
        }
    }
    if (!alreayGet) {
        if (equityPrtfRealizedPanel != null) {  // realise gain & lose
            store = equityPrtfRealizedPanel.getStore();
            rec = store.getById(id);
            if (rec != null) {
                alreayGet = true;
            }
        }
    }

    return rec;
}

function setTabScroll(panelId, height) {

    /*
     * image size
     * 
     * 	width 	: 30
     * 	height	: 285
     */

    var agent = navigator.userAgent.toLowerCase();

    if (isTablet) {

        var mainDiv = '';

        mainDiv = '<div style=" background: url(\'images/scroll.png\') 0 0 no-repeat;  width : 100%; height : 200px; " ></div>';

        var number = ((height - 200) - 40) / 50;
        for (var i = 0; i < Math.round(number); i++) {
            mainDiv += ' <div style=" background: url(\'images/scroll.png\') 0 -200px no-repeat;  width : 100%; height : 50px; " ></div> ';
        }

        mainDiv += '<div style=" background: url(\'images/scroll.png\') 0 -260px no-repeat;  width : 100%; height : 30px; " ></div>';

        Ext.get(panelId + '_right').update(mainDiv);

    } else {

        Ext.get(panelId + '_right').setWidth(0);

    }

}

function actionLoadMask(action) {

    if (N2NLoginStatus.returnOnLogin()) {
        if (action == "open") {
            tLoadMask_MainPage.show();

        } else if (action == "close") {
            changeLoadMaskMessage("Loading .....");

            N2NLoginStatus.setOnReady(true);
            N2NLoginStatus.setOnLogin(false);

//			if ( marketMoverPanels.length > 0 ) {
//				marketMoverPanels[0].show();
//			}
        } else {
            tLoadMask_MainPage.hide();
        }
    } else {
        if (action == "remove") {
            tLoadMask_MainPage.hide();
        }
    }
}

function changeLoadMaskMessage(message) {

    if (N2NLoginStatus.returnOnLogin()) {
//		tLoadMask_MainPage.msg = message;
//		tLoadMask_MainPage.show();
    }
}

function isProcColumn() {
    var isNeedToSet = false;

    try {

        if (N2NBrowserInfo.returnBrowserType() == "Chrome") {
            if (parseInt(N2NBrowserInfo.returnBrowserMainVersion()) > 18) {
                isNeedToSet = true;
            }
        }

        if (N2NBrowserInfo.returnBrowserType() == "Safari") {
            if (parseInt(N2NBrowserInfo.returnBrowserMainVersion()) > 4) {
                isNeedToSet = true;
            }
        }

    } catch (err) {
    }

    return isNeedToSet;
}

function updateTopMenu() {
    var items = determineItem(["Scoreboard", "Indices", "Summary", "Intraday Chart"], exchangecode);

    if (mainMenuBar || (N2N_CONFIG.menuType == MENU_TYPE.TOOL)) {
        var marketItem = 0;
        for (var i = 0; i < items.length; i++) {
            var obj = items[i];
            if (obj.name == "Scoreboard") {
                if (showMarketScoreBoard == "TRUE") {
                    disableEnableMenu("tbMS", "Scoreboard", obj.status);
                    marketItem = obj.status ? marketItem + 1 : marketItem;
                }
            } else if (obj.name == "Stock Tracker") {
                if (configutil.getTrueConfig(showStkInfoHeader)) {
                    if (configutil.getTrueConfig(showStkInfoTracker)) {
                        disableEnableMenu("tbSI", "Stock Tracker", obj.status);
                    }
                }
            } else if (obj.name == "Indices") {
                if (showMarketIndices == "TRUE") {
                    disableEnableMenu("tbMS", "Indices", obj.status);
                    marketItem = obj.status ? marketItem + 1 : marketItem;
                }
            } else if (obj.name == "Summary") {
                disableEnableMenu("tbMS", "Summary", obj.status);
                marketItem = obj.status ? marketItem + 1 : marketItem;
            } else if (obj.name == "Intraday Chart") {
                if (configutil.getTrueConfig(showChartHeader)) {
                    if (configutil.getTrueConfig(showChartIntradayChart)) {
                        disableEnableMenu("tbCht", "Intraday Chart", obj.status);
                    }
                }
            }
            if (configutil.getTrueConfig(showMarketStreamer)) {
                marketItem += 1;
            }
            if (configutil.getTrueConfig(showMarketWorldIndices)) {
                marketItem += 1;
            }
            if (configutil.getTrueConfig(showMarketHeader)) {
                var menuMktSum = Ext.getCmp("tbMS");
                if (menuMktSum) {
                    if (marketItem == 0) {
                        menuMktSum.disable();
                    } else {
                        menuMktSum.enable();
                    }
                }
            }
        }
    } else {
        menuHandler.menuStatus = items;
    }

}

function disableEnableMenu(parentId, text, have) {
    var pMenu = Ext.getCmp(parentId);
    if (pMenu) {
        var mktSum = pMenu.menu.items.items;
        for (var j = 0; j < mktSum.length; j++) {
            if (mktSum[j].text == text) {
                if (!have) {
                    mktSum[j].disable();
                } else {
                    mktSum[j].enable();
                }
            }
        }
    }
}

/**
 * Descritpion <br/>
 * 
 * 		determine the item function is allow on the exchange
 * 
 * @param itemList : array
 * @param exchgCode : string
 * 
 * @return array 
 */
function determineItem(itemList, exchgCode) {
    var newArray = new Array();

    if (determineMainMenuItems.length > 0) {

        var mainMenuList = determineMainMenuItems.split('|');

        for (var i = 0; i < itemList.length; i++) {
            var trueFalse = true;
            var itemName = itemList[i];

            for (var j = 0; j < mainMenuList.length; j++) {
                if (itemName == mainMenuList[j].split(',')[0]) {
                    for (var k = 1; k < mainMenuList[j].length; k++) {
                        if (exchgCode == mainMenuList[j].split(',')[k]) {
                            trueFalse = false;
                            break;
                        }
                    }
                }
            }

            var newObj = new Object();
            newObj.name = itemName;
            newObj.status = trueFalse;
            newArray.push(newObj);
        }
    } else {
        for (var i = 0; i < itemList.length; i++) {
            var trueFalse = true;
            var itemName = itemList[i];

            if (itemName == "Scoreboard") {
                switch (exchgCode) {
                    case "SI":
                    case "SID":
                    case "A":
                    case "AD":
                    case "N":
                    case "ND":
                    case "O":
                    case "OD":
                    case "HK":
                    case "HKD":
                        trueFalse = false;
                        break;
                    default:
                        trueFalse = true;
                }
            } else if (itemName == "Stock Tracker") {
                switch (exchgCode) {
                    case "A":
                    case "AD":
                    case "N":
                    case "ND":
                    case "O":
                    case "OD":
                        trueFalse = false;
                        break;
                    default:
                        trueFalse = true;
                }
            } else if (itemName == "Intraday Chart") {
                switch (exchgCode) {
                    case "A":
                    case "AD":
                    case "N":
                    case "ND":
                    case "O":
                    case "OD":
                        trueFalse = false;
                        break;
                    default:
                        trueFalse = true;
                }
            } else if (itemName == "Summary") {
                switch (exchgCode) {
                    case "A":
                    case "AD":
                    case "N":
                    case "ND":
                    case "O":
                    case "OD":
                        trueFalse = false;
                        break;
                    default:
                        trueFalse = true;
                }
            } else if (itemName == "Indices") {
                switch (exchgCode) {
                    case "A":
                    case "AD":
                    case "N":
                    case "ND":
                        trueFalse = false;
                        break;
                    default:
                        trueFalse = true;
                }
            }

            var newObj = new Object();
            newObj.name = itemName;
            newObj.status = trueFalse;
            newArray.push(newObj);
        }
    }

    return newArray;
}

function setSize(w, h) {
    if (w != null)
        currentWidth = w;
    if (h != null)
        currentHeight = h;

    var h1 = currentHeight - 150;
    var h2 = h1 - 300;
    tabPanel1.setHeight(h2);
    mainPanel.setSize(currentWidth, h1);

    var w1 = currentWidth * 60 / 100;
    tabPanel3.setWidth(w1);
}

function isPagingMode() {
    //return true; // for testing
    var pf = navigator.platform;
    if (isTablet || isMacSafari()) {
        return false;
    } else {
        if (!isTouchDevice())
            return false;
    }
    return true;
}

function isMacSafari() {
    return (Ext.isMac && Ext.isSafari);
}

function isLotMode() {
    //not implemented
    return false;
//    if (exchangecode && exchangecode == 'JK')
//    	return true;
//    else
//    	return false;
}

function isVisible(id) {
    var activetabs = tabPanel1.getActiveTab();
    var comp = null;
    var visible = false;
    if (activetabs != null && !visible) {
        comp = activetabs.getComponent(0);
        if (comp != null && comp.id == id)
            visible = true;
    }
    activetabs = tabPanel2.getActiveTab();
    if (activetabs != null && !visible) {
        comp = activetabs.getComponent(0);
        if (comp != null && comp.id == id)
            visible = true;
    }
    activetabs = tabPanel3.getActiveTab();
    if (activetabs != null && !visible) {
        comp = activetabs.getComponent(0);
        if (comp != null && comp.id == id)
            visible = true;
    }

    return visible;
}

function indexOfPanels(panel, panelArray) {
    var idx = -1;

    if (panel != null && panelArray != null) {
        var totPanel = panelArray.length;
        for (var i = 0; i < totPanel; i++) {
            var tmppanel = panelArray[i];

            // custom checking for watchlist
            if (tmppanel.wlpanel != null)
                tmppanel = activeWatchlistArr[i].wlpanel;

            if (panel.id != null && panel.id == tmppanel.id) {
                idx = i;
                break;
            }
        }
    }

    return idx;
}

function switchMode(enableTouch) {
    touchMode = enableTouch;
}

function haveActiveAcc(ex) {
    var accList = accRet.ai;
    var totAcc = accList.length;
    if (accList && totAcc > 0) {
        for (var i = 0; i < totAcc; i++) {
            var acc = accList[i];
            if (acc.ex == ex || (acc.ex == 'SI' && ex == 'SG'))
                // active acc
                if (acc.sts == "1")
                    return true;
        }
    }
    return false;
}

function getExchangeType(ex) {	// use on outbound to remove the "D"
    var tmpV = ex.split(".");
    var tmpType = tmpV[tmpV.length - 1];
    if (tmpType.length == 1) {	// delay feed will more then 1 char
        return tmpType;
    } else {
        var tmpChkType = tmpType.substring(tmpType.length, tmpType.length - 1);
        var tmpChkTypeValue = tmpType.substring(0, tmpType.length - 1);
        if (tmpChkType.toUpperCase() == "D") {
            return tmpChkTypeValue;
        } else {
            return tmpType;
        }
    }
}

function getOnlyStockCode(stkcode) {
    var tmpV = stkcode.split(".");
    var tmpStkCode = "";
    for (var i = 0; i < tmpV.length; i++) {
        if (i == tmpV.length || i == (tmpV.length - 1)) {
            // ignore
        } else {
            tmpStkCode += tmpV[i];
        }
    }

    return tmpStkCode;
}

function canTrade(exchg) {
    var totEx = tradeExCodes.length;
    if (totEx == 0) {
        return true;
    } else {
        if (exchg && tradeExCodes != null && totEx > 0) {
            exchg = getExchangeType(exchg);
            for (var i = 0; i < totEx; i++) {
//	        	allow order submission singapore exchange if  subscribe to SI/SG - ATP tradeclient return SI, feed return SG)
//	            if (exchg == tradeExCodes[i])
                if (exchg == tradeExCodes[i] || (exchg == 'SG' && tradeExCodes[i] == 'SI'))
                    return true;
            }
        }
        return false;
    }
}

function canView(ex) {
    var can = false;
    var totEx = viewExCodes.length;
    for (var i = 0; i < totEx; i++) {
        //allow to view singapore exchange if  subscribe to SI/SG   	

        //production
        if (ex == viewExCodes[i] || (ex == 'SG' && viewExCodes[i] == 'SI')) {
            //bypass
            //if (viewExCodes[i].indexOf(ex)>=0 || (ex == 'SG' && viewExCodes[i] == 'SI')) {
            can = true;
            break;
        }
    }
    return can;
}

function updateTradeResult(obj) {

    if (orderPad != null) {
        // var obj = null;
        try {
            // obj = Ext.decode(responseText);
            if (obj.t == 'trd') {
                orderPad.stopTradeResultTimeout();
                if (obj.s == true) {
                    if (obj.sts != null)
                        orderPad.promptTradeResult(obj.sts, obj.s);
                    else
                        orderPad.promptTradeResult('Order has been successfully submitted', obj.s);
                } else {
                    if (obj.msg != null)
                        orderPad.promptTradeResult(obj.msg, obj.s);
                    else
                        orderPad.promptTradeResult("Trade Fail", obj.s);
                }
            }
        } catch (e) {
            debug(e);
        }
    }
}

/* Order */
function resetOrderPad() {
    if (orderPad) {
        orderPad.reset();
        if (orderPad.compRef.marketDepth) {
            orderPad.compRef.marketDepth.createMarketDepth();
        }
    }
}

function testPin(pin) {
    return pinReg.test(pin);
}

function getPinInfo() {
    var pinInfo = null;
    if (orderPad) {
        pinInfo = {
            savePin: orderPad.savePin,
            lastPin: orderPad.lastPin
        };
    }
    return pinInfo;
}

function setPinInfo(cfg) {
    if (cfg && cfg.savePin && orderPad) {
        orderPad.savePin = cfg.savePin;
        orderPad.lastPin = cfg.lastPin;
        orderPad.setSetting();
    }
}

function getColorBar(rate) {
    var bgpc = '';

    if (!isNaN(rate)) {
        if (rate == 0) {
            bgpc = '<div class="resetpadding">0%</div>';
        } else {
            var pc1 = '<div class="pc1 N2N_BackUp" style="width: ' + rate + '%"></div>';
            bgpc = '<div class="bgpc N2N_BackDown">' + pc1 + ' <div class="bgtext">' + parseFloat(rate) + '% </div></div>';
        }
    }

    return bgpc;
}

function getExchangeIcon(exchange) {
    var icon = '';

    switch (exchange) {
        // malaysia
        case 'KL':
        case 'KLD':
        case 'MY':
            icon = icoBtnMsia;
            break;
            // singapore
        case 'SI':
        case 'SID':
        case 'SG':
        case 'SGD':
            icon = icoBtnSpore;
            break;
            // Indoneisa
        case 'JK':
        case 'JKD':
            icon = icoBtnIndo;
            break;
            // Hong Kong
        case 'HK':
        case 'HKD':
            icon = icoBtnHK;
            break;
            // US
        case 'A':
        case 'AD':
        case 'N':
        case 'ND':
        case 'O':
        case 'OD':
        case 'P':
            icon = icoBtnUS;
            break;
            // CME
        case 'YM':
        case 'ES':
        case 'ZS':
        case 'UC':
            icon = icoBtnCME;
            break;
            // Thailand
        case 'BK':
        case 'BKD':
            icon = icoBtnBK;
            break;
            // Philliphine
        case 'PH':
            icon = icoBtnPH;
            break;
    }

    return icon;
}

function getIndiceKey(exchange) {
    var indice = '';

    if (feedLoginRet && feedLoginRet.ex) {
        var exchList = feedLoginRet.ex;
        for (var i = 0; i < exchList.length; i++) {
            var exObj = exchList[i];
            if (exObj.ex == exchange) {
                indice = exObj.ix;
                break;
            }
        }
    }

    return indice;
}

function runSwitchView(view) {
    var appURL = N2N_CONFIG.desktopViewURL;
    var viewQuery = 'default';
    // var msg = languageFormat.getLanguage(31103, 'Switching to desktop view will reload the page. Proceed?');

    if (view == 0) {
        viewQuery = 'mobile';
        // msg = languageFormat.getLanguage(31102, 'Switching to mobile view will reload the page. Proceed?');
        appURL = N2N_CONFIG.mobileViewURL;
    }
    if (N2N_CONFIG.useViewURL && appURL != '') {
        var urlParts = appURL.split('?'); // TODO should remove param part in config (no need view=...)
        appURL = urlParts[0] + location.search; // to preserve all params in current url
        appURL = formatUrl(appURL);
    } else {
        appURL = location.href;
    }

    // msgutil.confirm(msg, function(btn) {
        // if (btn == 'yes') {
    n2nLayoutManager.setLoading(languageFormat.getLanguage(31104, 'Please wait. Reloading...'));
    window.parent.location.href = updateQueryStringParameter(appURL, 'view', viewQuery);
        // }
    // });
}

// use below function instead cos it can reserve the previous param (flexible)
function switchLanguage(lang) {
	if(global_Language == lang){
		return;
	}else{
		var settingUrl = [
		                  addPath,
		                  "tcplus/setting?a=set&sc=TCLPTHEME&p=",
		                  global_personalizationTheme, '~',
		                  global_displayUnit, '~',
		                  'news,', global_newsSetting, '-',
		                  'rpt,', global_reportSetting, '-',
		                  'dl,', global_dynamicLimitSetting, '-',
		                  'fs,', globalFontSize, '-',
		                  'na,', global_noAsk, '-',
		                  'nt,', 1, '-',
		                  'lang,', lang
		                  ].join('');
		Ext.Ajax.request({
			url: settingUrl,
			success: function(){
				n2nLayoutManager.setLoading(languageFormat.getLanguage(31104, 'Please wait. Reloading...'));
			    window.parent.location.href = updateQueryStringParameter(window.parent.location.href, 'lang', lang);
			},
			failure: function(){
				n2nLayoutManager.setLoading(languageFormat.getLanguage(31104, 'Please wait. Reloading...'));
			    window.parent.location.href = updateQueryStringParameter(window.parent.location.href, 'lang', lang);
			}
		});
	}
}

function updateQueryStringParameter(uri, key, value) {
    // removes #
    uri = uri.replace('#', '');

    var re = new RegExp("([?|&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

function formatUrl(url) {
    if (!/^(http|https):\/\//i.test(url)) {
        // get current protocol
        var proto = document.location.protocol;
        return proto + "//" + url;
    }

    return url;
}

function getStockLabel(record) {
    var sLabel = '';

    if (record) {
        var code = record.get(fieldStkCode);
        var name = record.get(fieldStkName);

        sLabel = name + '(' + code + ')';
    }

    return sLabel;
}

function controlSelectionChanged(comp, selected) {
    if (selected.length > 0) {
        var record = selected[0];

        if (isMobile) {
            var sLabel = getStockLabel(record);
            helper.setHtml(comp.compRef.selectedLabel, sLabel);
        }

        if (N2N_CONFIG.singleClickMode) {
            updateActivePanel(null, record, null);
            // only update the market depth
            // updateActiveMarketDepth(record.get(fieldStkCode), record.get(fieldStkName));
        }
    } else {
        helper.setHtml(comp.compRef.selectedLabel, '');
    }
}

function loadDockedItems() {

    if (n2nLayoutManager.isPortalLayout()) {
        saveLayoutATP = cookies.readCookie(cookieKey + "savelayout");
        if (!N2N_CONFIG.confSaveLayout || saveLayoutATP == null) {
            saveLayoutATP = 'qs~md~op';
        }
                    
        var features = saveLayoutATP.split("~");
        var portalcols = [portalcol_top, portalcol_2, portalcol_3];

        for (var i = 0; i < features.length; i++) {
            var properties = features[i].split(",");

            for (var j = 0; j < properties.length; j++) {
                var property = properties[j].split("_");

                var tbWebReport = [];
                switch (property[0]) {
                    case "qs":
                        createQuoteScreen(false, null, null, portalcols[i], j);
                        break;

                    case "md":
                        createMarketDepthPanel(null, null, null, null, null, {}, portalcols[i], j);
                        break;

                    case "op":
                        createOrderPad(null, 'Order Pad', modeOrdBuy, null, null, portalcols[i], j);
                        break;

                    case "si":
                        createStkInfoPanel(null, null, null, portalcols[i], j, null, {});
                        break;

                    case "tr":
                        createTrackerPanel(null, null, null, portalcols[i], j, null, {});
                        break;

                    case "os":
                        createOrdStsPanel('', '0', portalcols[i], j, null, {});
                        break;

                    case "oh":
                        createOrdHistoryPanel(portalcols[i], j, null, {});
                        break;

                    case "mo":
                        createSummaryPanel(false, portalcols[i], j, null, {});
                        break;

                    case "in":
                        createIndices(false, true, portalcols[i], j, null, {});
                        break;

                    case "sb":
                        createScoreBoard(null, portalcols[i], j, null, {});
                        break;

                    case "dm":
                        createMarketDepthMatrixPanel(null, null, null, portalcols[i], j, null, {});
                        break;

                    case "gn":
                        createNewsPanel(portalcols[i], j, null, {});
                        break;

                    case "sn":
                        createStkNewsPanel(null, null, null, {});
                        break;

                    case "ms":
                        createMarketStreamer(portalcols[i], j, null, {});

                        break;
                    case "fc":
                        createFundamentalCPIQWin(null, portalcols[i], j);
                        break;

                    case "fs":
                        createFundamentalScreenerCPIQWin(portalcols[i], j);
                        break;

                    case "ft":
                        createFundamentalThomsonReutersWin(null, null, portalcols[i], j);
                        break;

                    case "fst":
                        createFundamentalScreenerThomsonReutersWin();
                        break;

                    case "wi":
                        createWarrantsInfoWin();
                        break;

                    case "dp":
                        createDerivativePortfolioPanel('', portalcols[i], j, null, {});
                        break;

                    case "ep":
                        createEquityPortfolioPanel("", portalcols[i], j, null, {});
                        break;

                    case "emp":
                        createEquityManualPortFolioPanel('', portalcols[i], j, null, {});
                        break;

                    case "eqr":
                        createEquityPortfolioRealizedGainLossPanel('', portalcols[i], j, null, {});
                        break;

                    case "wl":
                        loadWlPortal(property[1], portalcols[i], j);
                        break;

                    case "cs":
                        var rptSt = getReportSettings(webReportClientSummaryURL);
                        n2ncomponents.openWebReport(rptSt, portalcols[i], j);
                        break;

                    case "mst":
                        var rptSt = getReportSettings(webReportMonthlyStatementURL);
                        n2ncomponents.openWebReport(rptSt, portalcols[i], j);
                        break;

                    case "mas":
                        var rptSt = getReportSettings(webReportMarginAccountSummaryURL);
                        n2ncomponents.openWebReport(rptSt, portalcols[i], j);
                        break;

                    case "td":
                        var rptSt = getReportSettings(webReportTraderDepositReportURL);
                        n2ncomponents.openWebReport(rptSt, portalcols[i], j);
                        break;

                    case "tb":
                        var rptSt = getReportSettings(webReportTradeBeyondReportURL);
                        n2ncomponents.openWebReport(rptSt, portalcols[i], j);
                        break;

                    case "c":
                        var rptSt = getReportSettings(webReporteContractURL);
                        n2ncomponents.openWebReport(rptSt, portalcols[i], j);
                        break;

                    case "ai":
                        var rptSt = getReportSettings(webReportAISBeStatementURL);
                        n2ncomponents.openWebReport(rptSt, portalcols[i], j);
                        break;

                    case "mp":
                        var rptSt = getReportSettings(webReportMarginPortFolioValuationURL);
                        n2ncomponents.openWebReport(rptSt, portalcols[i], j);
                        break;

                    case "tm":
                        var rptSt = getReportSettings(webReportTransactionMovementURL);
                        n2ncomponents.openWebReport(rptSt, portalcols[i], j);
                        break;

                    case "ct":
                        var rptSt = getReportSettings(webReportClientTransactionStatementURL);
                        n2ncomponents.openWebReport(rptSt, portalcols[i], j);
                        break;

                    case "sba":
                        var rptSt = getReportSettings(webReportStockBalanceURL);
                        n2ncomponents.openWebReport(rptSt, portalcols[i], j);
                        break;

                    case "ic":
                        createChartPanel(null, null, false, portalcols[i], j, null, {});
                        break;

                    case "ac":
                        createAnalysisChartPanel(null, null, false, portalcols[i], j, null, {});
                        break;

                    case "hd":
                        n2ncomponents.createHistoricalData(null, null, false, portalcols[i], j, null, {});
                        break;

                }
            }
        }

        portfolioSaving = false;
        firstRunSaving = false;
    }
}

function loadWlPortal(_wlName, _col, j) {

    if (_wlName) {
        n2ncomponents.bufferTasks2.push(function() {
            viewWatchlist(_wlName, _col, j, null, {});
        });
    }
}

function htmlEncode(str) {
    return Ext.util.Format.htmlEncode(str);
}

function htmlDecode(str) {
    return Ext.util.Format.htmlDecode(str);
}

function textToHtml(text) {
    return text.replace(/ /g, '&nbsp;');
}

function htmlToText(html) {
    return html.replace(/&nbsp;/g, ' ');
}

function spaceToDollar(text) {
    return text.replace(/ /g, '$');
}

function dollarToSpace(text) {
    return text.replace(/\$/g, ' ');
}

function spaceToUnderscore(text) {
    return text.replace(/ /g, '_');
}

function isBlackTheme(themeName) {
    return (themeName || global_personalizationTheme).indexOf("black") > -1;
}

function isWhiteTheme(themeName) {
    return !isBlackTheme(themeName);
}

function isNewTheme() {
    return  global_personalizationTheme.indexOf("wh") > -1;
}

function isNewBlackTheme() {
    return isNewTheme() && global_personalizationTheme.indexOf("black") > -1;
}

function gridColHandler() {
    var grid = this;

    var mappingCols = helper.getColMappingIDs(grid, helper.getGridAllColumns(grid, true));
    grid.requestSaveColumns(mappingCols.join('~'));
}

function addDDMenu() {

    return {
        afterrender: function(thisMenu) {
            var menuItems = thisMenu.items.items;
            for (var i = 0; i < menuItems.length; i++) {
                n2nLayoutManager.initDragMenu(menuItems[i]);
            }
        }
    };
}

function getGridViewConfig(compRef) {
    var conf = {
        stripeRows: true,
        trackOver: true,
        preserveScrollOnRefresh: true,
        compRef: compRef
    };

    if (N2N_CONFIG.ddComp) {
        conf.plugins = {
            ptype: 'gridviewdragdrop',
            // dragGroup: 'ddRow',
            // dropGroup: ddCompGroup,
            ddGroup: ddCompGroup,
            enableDrop: false,
            dragText: '',
            dragZone: {
                onStartDrag: function() {
                    n2nLayoutManager.setDraggingCompStatus();
                    n2nLayoutManager.shimIframe();
                },
                getDragText: function() { // override
                    if (this.dragData.records.length > 0) {
                        var rec = n2nLayoutManager.getStkRec(this.dragData.records[0]);
                        var stkName = stockutil.getStockName(rec.stkName);

                        return stkName;
                    }

                    return '';
                },
                getDragData: function(e) {
                    var view = this.view,
                            item = e.getTarget(view.getItemSelector());

                    if (item) {
                        return {
                            copy: view.copy || (view.allowCopy && e.ctrlKey),
                            event: e,
                            view: view,
                            ddel: this.ddel,
                            item: item,
                            records: view.getSelectionModel().getSelection(),
                            fromPosition: Ext.fly(item).getXY(),
                            compRef: view.compRef
                        };
                    }
                }
            }
        };
        
        if (N2N_CONFIG.ddWlRemove) {
            if (compRef && compRef.type === 'wl') {
                conf.plugins.dragZone.afterInvalidDrop = function() {
                    // remove watchlist
                    if (this.dragData.records.length > 0) {
                        var rec = this.dragData.records[0];
                        var stkCode = rec.get(fieldStkCode);
                        var rowIndex = this.dragData.compRef.store.indexOf(rec);

                        removeFromWatchlist(this.dragData.compRef, stkCode, rowIndex);
                    }
                };

            }
        }
    }

    return conf;
}

function isValidFundExch(stkCode) {
    if (N2N_CONFIG.fundamentalExchg != '') {
    	var isValidFund = false;
        var exch = exchangecode;
        if (stkCode) {
            exch = stockutil.getExchange(stkCode);
        }

        var exchArr = N2N_CONFIG.fundamentalExchg.split(',');
        for (var i = 0; i < exchArr.length; i++) {
        	if(exch == exchArr[i]){
        		isValidFund = true;
        		break;
    }
        }

        return isValidFund;
    }

    return true;
}

function getIndicesName(stkIdxId, sectorcode) {
    var stkIdxIdName = null;

    if (feedFilterRet && feedFilterRet.s && stkIdxId
            && sectorcode) {
        var sectors;
        var stkParentId = getBoardCode(sectorcode);
        stkIdxIdName = '';

        if (stkParentId) {
            sectors = feedFilterRet.bl;
            if (sectors && sectors.length > 0) {
                var totSec = sectors.length;
                for (var i = 0; i < totSec; i++) {
                    var sector = sectors[i];
                    var secCode = sector.id;
                    var secName = sector.n;

                    var nBit = 0;
                    try {
                        nBit = Math.pow(2, parseInt(secCode.substring(secCode.length - 2), 10) - 1); //1.23.5.4 misspell secCode, so that Indices display '-'
                    } catch (e) {
                        debug(e);
                    }

                    if (stkParentId && secCode != stkParentId && nBit > 0 && (stkIdxId & nBit) > 0) {

                        if (stkIdxIdName.length > 0)
                            stkIdxIdName += ', ';

                        stkIdxIdName += secName;
                    }
                }
            }
        }
    }

    return stkIdxIdName;
}


function getBoardCode(sector) {
    var boardId = null;
    if (!feedFilterRet || !feedFilterRet.bi)
        return boardId;

    var totBI = feedFilterRet.bi.length;
    for (var i = 0; i < totBI; i++) {
        var rec = feedFilterRet.bi[i];
        if (rec.id == sector) {
            // console.log(i + ':' + rec.id + ':' + sector +
            // ':' + rec.bid);
            boardId = rec.bid;
        }
    }

    return boardId;
}

function getBoardName(pathName) {
    var boardName = null;
    pathName = pathName.split("|");
    if (pathName.length > 3) { 
        if (isNaN(pathName[3])) { // if the value is a number, it should not be correct board to display
            boardName = pathName[3];
        }
    }

    return boardName;
}

function getSectorName(pathName) {
    var sectorName = null;
    pathName = pathName.split("|");
    if (pathName.length > 4) {
        if (isNaN(pathName[4])) { // if the value is a number, it should not be correct sector to display
            sectorName = pathName[4];
            if (sectorName) {
                sectorName = sectorName.replace(/\//g, ' / '); // to avoid unwrappable sector name
            }
        }
    }

    return sectorName;
}

function getPriceString(value, lacp) {
    var cssCls = N2NCSS.FontUnChange;

    if (value != 0 && lacp != 0) {
        if (value > lacp) {
            cssCls = N2NCSS.FontUp;
        } else if (value < lacp) {
            cssCls = N2NCSS.FontDown;
        }
    }

    return '<label class="' + cssCls + '">' + getDisplayValue(value) + '</label>';
}

function getStkStatus(statusChar) { //Map status char with string
    var statusString = "";

    if (typeof statusChar === 'string') {
        statusChar = statusChar.toUpperCase();

        switch (statusChar) {
            case 'N':
                statusString = languageFormat.getLanguage(20066, "NEW");
                break;
            case 'W':
                statusString = languageFormat.getLanguage(20067, "NEW WITH ALERT ANNOUNCEMENT");
                break;
            case 'A':
                statusString = languageFormat.getLanguage(20068, "ACTIVE");
                break;
            case 'T':
                statusString = languageFormat.getLanguage(20069, "ACTIVE WITH ALERT ANNOUNCEMENT");
                break;
            case 'Q':
                statusString = languageFormat.getLanguage(20065, "DESIGNATED");
                break;
            case 'S':
                statusString = languageFormat.getLanguage(20070, "SUSPENDED");
                break;
            case 'P':
                statusString = languageFormat.getLanguage(20071, "SUSPENDED WITH ALERT ANNOUNCEMENT");
                break;
            case 'D':
                statusString = languageFormat.getLanguage(20072, "DELISTED");
                break;
            case 'E':
                statusString = languageFormat.getLanguage(20073, "EXPIRED");
                break;
            case 'R':
                statusString = languageFormat.getLanguage(20062, "READY");
                break;
            case 'H':
                statusString = languageFormat.getLanguage(20074, "HALTED");
                break;
            case 'Y':
                statusString = languageFormat.getLanguage(20075, "DELAYED");
                break;
            case 'X':
                statusString = languageFormat.getLanguage(20076, "SHUTTING DOWN");
                break;
            case 'I':
                statusString = languageFormat.getLanguage(20063, "IMMEDIATE DELIVERY");
                break;
            case 'L':
                statusString = languageFormat.getLanguage(20079, "PENDING LISTING");
                break;
            case 'M':
                statusString = languageFormat.getLanguage(20080, "PENDING ANNOUNCEMENT");
                break;
            case 'C':
                statusString = languageFormat.getLanguage(20081, "CONDITIONAL TRADING");
                break;
            case 'U':
                statusString = languageFormat.getLanguage(20082, "CONDITIONAL WHEN ISSUE");
                break;
            case 'Z':
                statusString = languageFormat.getLanguage(20083, "WHEN ISSUE");
                break;
            case 'B':
                statusString = languageFormat.getLanguage(20084, "BUYING IN MARKET ONLY");
                break;
            case 'J':
                statusString = languageFormat.getLanguage(20085, "ADJUSTED");
                break;
            case 'G':
                statusString = languageFormat.getLanguage(20086, "FROZEN");
                break;
            case 'V':
                statusString = languageFormat.getLanguage(20087, "RESERVE");
                break;
            case '*':
                statusString = languageFormat.getLanguage(20103, "CHART");
                break;
            case 'F':
                statusString = languageFormat.getLanguage(20088, "CIRCUIT BREAKER");
                break;
            case 'K':
                statusString = languageFormat.getLanguage(20096, "HALT DUE TO CIRCUIT BREAKER");
                break;
        }
    }

    return statusString.toUpperCase();
}

function getDeliveryBasisText(basisCode) {
    var basisText = '-';
    switch (basisCode.toLowerCase()) {
        case 'r':
            basisText = languageFormat.getLanguage(20062, 'Ready');
            break;
        case 'i':
            basisText = languageFormat.getLanguage(20063, 'Immediate Delivery');
            break;
        case 'c':
            basisText = languageFormat.getLanguage(20064, 'Cash');
            break;
        case 'd':
            basisText = languageFormat.getLanguage(20065, 'Designated');
            break;
    }

    return basisText;
}

function getForeignLimitText(limitCode) {
    var limitText = '-';

    switch (limitCode.toLowerCase()) {
        case 'n':
            limitText = languageFormat.getLanguage(10014, 'No');
            break;
        case 'y':
            limitText = languageFormat.getLanguage(10011, 'Yes');
            break;
        default:
            limitText = '-';
            break;
    }

    return limitText;
}

function getStockStatusObj(statusStr) {
    var statusObj = {};

    if (statusStr) {
        if (statusStr.length >= 2) {
            statusObj.status = getStkStatus(statusStr.charAt(1));
        }

        if (statusStr.length >= 3) {
            statusObj.deliveryBasis = getDeliveryBasisText(statusStr.charAt(2));
        }

        if (statusStr.length >= 9) {
            statusObj.foreignLimit = getForeignLimitText(statusStr.charAt(8));
        }
    }

    return statusObj;
}

function getMarketCapital(shares, last, lacp) {
    if (shares) {
        if (last && last != 0) {
            return shares * last;
        } else if (lacp) {
            return shares * lacp;
        }
    }

    return null;
}

function updateFieldValue(field, value, defZeroValue, displayType, roundQty, defNullValue) {
    if (value != null) {
        var valueStr = '';

        if (value == 0 && defZeroValue != null) {
            valueStr = defZeroValue;
        } else {
            switch (displayType) {
                case 'qty':
                    valueStr = formatutils.formatNumber(value, null, roundQty);
                    if (roundQty) {
                        var wholeValue = formatutils.formatNumber(value);
                        valueStr = '<span title="' + wholeValue + '">' + valueStr + '</span>';
                    }

                    break;
                default:
                    valueStr = value;
            }
        }

        helper.setHtml(field, valueStr);
    } else if (defNullValue != null) { // for null
        helper.setHtml(field, defNullValue);
    }
}

function getDisplayValue(value, emptyDisplay) {
    emptyDisplay = emptyDisplay || '-';

    if (value == 0 || value == null) {
        return emptyDisplay;
    }

    return value;
}

function resetFieldValues(fields, resetText) {
    resetText = resetText || '-';

    for (var i = 0; i < fields.length; i++) {
        var fd = fields[i];
        if (fd) {
            helper.setHtml(fd, resetText);
        }
    }
}

function isSyncComp(compType) { // check if this component is a sync component
    return N2N_CONFIG.syncScreen && N2N_CONFIG.syncItems.indexOf(compType) > -1;
}

function isSyncEnabled(compType) { // check if this sync is enable for this component
    if (syncCompList) {
        return syncCompList.exist(compType);
    }

    return false;
}

function isSyncCompVisible(comp) { // check if a component is visible and a sync comp
    if (comp && helper.inView(comp)) {
        return isSyncComp(comp.type) && isSyncEnabled(comp.type);
    }

    return false;
}
    
function updateSyncList(compType, status) {
    if (syncCompList) {
        if (status) {
            syncCompList.add(compType);
        } else {
            syncCompList.remove(compType);
        }

        syncCompList.save();
    }
}

function syncFirstComp(compArr, callback, stkCode, stkName) {
    if (compArr && compArr.length > 0) {
        var comp = compArr[0];

        if (comp && isSyncComp(comp.type) && isSyncEnabled(comp.type)) {
            if (helper.inView(comp)) {
                callback();
            } else if (typeof comp.syncBuffer === 'function') {
                comp.syncBuffer(stkCode, stkName);
            }
        }

    }
}

function syncAllComps(comp, stkCode, stkName) {
    // check whether current component is a syncing component
    if (isSyncComp(comp.type) && isSyncEnabled(comp.type)) {
        // market depth
        if (newMarketDepth) {
            syncFirstComp([newMarketDepth], function() {
                createMarketDepthPanel(stkCode, stkName);
            }, stkCode, stkName);
        }

        // stock info
        syncFirstComp(stkInfoPanels, function() {
            createStkInfoPanel(stkCode, stkName);
        }, stkCode, stkName);

        // tracker
        syncFirstComp(trackerPanels, function() {
            createTrackerPanel(stkCode, stkName);
        }, stkCode, stkName);

        // intraday chart
        syncFirstComp(chartPanels, function() {
            createChartPanel(stkCode, stkName);
        }, stkCode, stkName);

        // analysis chart
        syncFirstComp(n2ncomponents.analysisCharts, function() {
            createAnalysisChartPanel(stkCode, stkName);
        }, stkCode, stkName);

        // historical data
        syncFirstComp(n2ncomponents.historicalDataViews, function() {
            n2ncomponents.createHistoricalData(stkCode, stkName);
        }, stkCode, stkName);

        // stock news
        syncFirstComp(n2ncomponents.stockNews, function() {
            createStkNewsPanel(stkCode, stkName);
        }, stkCode, stkName);
    }
}

function watchlistExist(wlName) {
    if (watchListArr) {
        return watchListArr.indexOf(wlName) > -1;
    }

    return false;
}

function requestImportWl(wlObj, callback) {
    var ajaxObj = {
        url: addPath + 'tcplus/importwl',
        method: 'POST',
        params: {
            wl: Ext.encode(wlObj)
        }
    };

    ajaxObj.callback = callback || function(op, success, response) { // default callback
        var res;
        if (response) {
            try {
                res = Ext.decode(response);
            } catch (e) {

            }
        }

        if (success && res && res.s) {
            msgutil.info(languageFormat.getLanguage(30116, 'Imported successfully.'));
            n2ncomponents.refreshWlGrid(res.l);
        } else {
            var errMsg = languageFormat.getLanguage(30134, 'Failed to import watchlist.');
            if (res && res.m) {
                errMsg = res.m;
            }
            msgutil.alert(errMsg);
        }
    };

    Ext.Ajax.request(ajaxObj);
}

function fix_firefox_menu_top(subMenu) {
    if (Ext.isFirefox && subMenu) {
        if (subMenu.cls) {
            subMenu.cls += ' fix_firefox_menu_top';
        } else {
            subMenu.cls = 'fix_firefox_menu_top';
        }
    }
}

function bufferedResizeHandler(grid) {
    if (grid.bufferedRenderer && grid.didSelect) {
        helper.reselectRow(grid);
    }
}

function resetGridScroll(panel) {
    if (panel.bufferedRenderer && !panel.doSwitchRefresh && panel.didSelect) {
        helper.resetGridScroll(panel);
    }
}

function activateRow(panel) {
    if (!panel.doSwitchRefresh) {
        helper.selectRow(panel, 0, true);
        panel.didSelect = true;
    }

    panel.doSwitchRefresh = false;
}

function reactivateRow(panel) {
    if (panel.bufferedRenderer) {
        if (!Ext.isChrome) {
            helper.reselectRow(panel); // fix blank on some browsers except Chrome
        }
    }
    panel.doSwitchRefresh = true;
}

function patchFirstLoad(panel) {
    if (panel.bufferedRenderer && !Ext.isChrome) {
        panel.firstLoad = false;
    }
}

function getMenuOverListeners() {
    var exListeners;

    if (N2N_CONFIG.showMenuLabel) {
        exListeners = {
            afterrender: function(thisMenu) {
                fix_firefox_menu_top(thisMenu.menu);
            }
        };
    } else {
        exListeners = {
            afterrender: function(thisMenu) {
            	// when touch by phone, touchstart-item class is to made the text visible. touchend-item is to hide the text
            	thisMenu.el.dom.addEventListener('touchstart', function(){
            		var text = Ext.get(this.getAttribute('id') + "-btnInnerEl");
            		text.addCls('touchstart-item');
            		text.removeCls('touchend-item');
            	});
            	thisMenu.el.dom.addEventListener('touchend', function(){
            		var text = Ext.get(this.getAttribute('id') + "-btnInnerEl");
            		text.removeCls('touchstart-item');
            		text.addCls('touchend-item');            		
            	});
            	
                fix_firefox_menu_top(thisMenu.menu);

                if (N2N_CONFIG.menuType != MENU_TYPE.TOOL
                        && global_personalizationTheme.indexOf("wh") != -1) {
                    var text = Ext.get(this.getId() + "-btnInnerEl");
                    if (text != null) {
                        text.setVisibilityMode(Ext.dom.Element.VISIBILITY);
                        //text.setVisible(false);
                        if (Ext.os.deviceType == 'Desktop') {
                        	text.addCls('hidden');
                        }
                    }
                }
            },
            mouseover: function() {
                if (N2N_CONFIG.menuType != MENU_TYPE.TOOL
                        && global_personalizationTheme.indexOf("wh") != -1) {
                    var text = Ext.get(this.getId() + "-btnInnerEl");
                    if (text != null) {
                        //text.setVisible(true);
                    	text.addCls('visible');
                    	text.removeCls('hidden');
                    }
                }
            },
            mouseout: function() {
                if (N2N_CONFIG.menuType != MENU_TYPE.TOOL
                        && global_personalizationTheme.indexOf("wh") != -1) {
                    var text = Ext.get(this.getId() + "-btnInnerEl");
                    if (text != null) {
                        //text.setVisible(false);
                        text.addCls('hidden');
                    	text.removeCls('visible');
                    }
                }
            }
        };
    }

    return exListeners;
}

function setCSSRule(img) {
    if (img && img.width && img.height) {
        Ext.util.CSS.createStyleSheet(
		'.main-menu .x-btn-inner.x-btn-inner-default-toolbar-medium {font-size:' + N2N_CONFIG.menuFontSize + 'px; left:-24%;}' +
		'.main-menu .x-btn-default-toolbar-medium, .main-menu .x-btn-text.x-btn-icon-top .x-btn-icon-el-default-toolbar-medium {width:' + img.width + 'px;}' +  //margin-left:auto;margin-right:auto;
		'.x-menu-item-medium span.x-menu-item-text.x-menu-item-text-default.x-menu-item-indent {font-size:' + (N2N_CONFIG.menuFontSize - 1) + 'px;}' +
		'.main-menu .x-btn-button-default-toolbar-medium {height:' + (img.height-6) + 'px;}' + 
		'.smallermenu.main-menu.x-toolbar-default {height:' + img.height + 'px;}' +
		'.main-menu .x-btn-default-toolbar-medium {width:' + (img.width) + 'px;}' +
		'.main-menu .x-btn-default-toolbar-medium {width:' + (2*img.width) + 'px;margin-right:' +  (-img.width) + 'px!important;}' +
        '.n2n .x-menu.fix_firefox_menu_top {top: ' + img.height + 'px !important;}'    
  	);
    }
}

function touchExpandSubmenu(e){
	// should not be used for desktop with mouse pointer
	if (Ext.os.deviceType == 'Desktop') {
		return;
	}
	var item = this;
	// hide the previously open menu, if exist, else can have many submenu opened at same time
	if (item.parentMenu.activeChild) {
		item.parentMenu.activeChild.ownerCmp.deactivate();
		item.parentMenu.activeChild.hide();
	}
	// to expand the submenu, need to be in activated state
	item.activate();
	item.parentMenu.activeItem = item;
    item.expandMenu(0);
}

function getLotUnit(value, lotSize) {
    if (global_displayUnit.toLowerCase() == "lot" && lotSize && value && !isNaN(lotSize) && !isNaN(value)) {
        return value / lotSize;
    } else {
        return value;
    }
}

function cleanName(nameStr) {
    return nameStr.replace(/(\[|\])/g, '');
}

function reloadAllCharts() {
    reloadFirstChart(chartPanels);
    reloadFirstChart(n2ncomponents.analysisCharts);
    if (marketOverviewPanel) {
        reloadFirstChart([marketOverviewPanel]);
    }
    reloadFirstChart(trackerPanels);
    reloadFirstChart(stkInfoPanels);
    if (indices) {
        reloadFirstChart([indices]);
    }
    
}

function reloadFirstChart(compColl) {
    if (compColl && compColl.length > 0) {
        if (typeof(compColl[0].forceReloadChart) === 'function') {
            if (helper.inView(compColl[0])) {
                compColl[0].forceReloadChart();
            } else {
                compColl[0].needReloadChart = true;
            }
        }
    }
}

function getDefaultFontColors(themeName) {
    
    if (isBlackTheme(themeName)) {
        return {
            'up': '00ff00',
            'down': 'ff0000',
            'unchg': 'ffffff',
            'yellow': 'ffff00'
        };
    } else {
        return {
            'up': '008000',
            'down': 'cc0000',
            'unchg': '2F4F4F',
            'yellow': '8e9005'
        };
    }
    
}

function updateGlobalFontColors(themeName) {
    if (isWhiteTheme(themeName)) {
        gl_up = up_w;
        gl_down = down_w;
        gl_unchg = unchg_w;
        gl_yel = yel_w;
    } else {
        gl_up = up_b;
        gl_down = down_b;
        gl_unchg = unchg_b;
        gl_yel = yel_b;
    }
}

function updateWlMappingList(list) {
    for (var i = 0; i < list.length; i++) {
        var obj = list[i];
        fullList['wl'][obj[fieldStkCode]] = obj[fieldStkName];
    }
}

function getNewWlMappingList(list) {
    var newList = [];

    listLoop: for (var i = 0; i < list.length; i++) {
        wlLoop: for (var l in fullList['wl']) {
            if (l == list[i]) {
                continue listLoop;
            }
        }

        newList.push(list[i]);
    }
    
    return newList;
}

function getComparison(sign) {
    var comparison = 'eq';

    switch (sign) {
        case '>':
            comparison = 'gt';
            break;
        case '>=':
            comparison = 'gte';
            break;
        case '<':
            comparison = 'lt';
            break;
        case '<=':
            comparison = 'lte';
            break;
    }

    return comparison;
}

function getExchangeFromCodes(codes) {
    var exch = [];

    for (var i = 0; i < codes.length; i++) {
        var ex = stockutil.getExchange(codes[i]);
        if (exch.indexOf(ex) === -1) {
            exch.push(ex);
        }
    }
}

function compareValues(value1, value2, sign) {
    switch (sign) {
        case '=':
            return value1 == value2;
            break;
        case '>':
            return value1 > value2;
            break;
        case '>=':
            return value1 >= value2;
            break;
        case '<':
            return value1 < value2;
            break;
        case '<=':
            return value1 <= value2;
            break;
    }
}