/* 
 * Provides functions to create components
 * 
 */

function createQuoteScreen(suspendLoad, qsConf, tabCt, portlet_col, index) {
    if (quoteScreen == null) {
        if (!tabCt && n2nLayoutManager.activateBuffer('qs')) {
            return;
        }
        
        var appMainSize = n2nLayoutManager.getAppMain().getSize();

        // read from cookie
        var qsHeight = appMainSize.height;
        if (!isMobile) {
            qsHeight = cookies.readCookie(cookieKey + '_Quote_Height_');
            if (qsHeight != null) {
                qsHeight = parseInt(qsHeight);
            } else {
                if (n2nLayoutManager.isWindowLayout()) {
                    qsHeight = appMainSize.height - 235;
                } else {
                    if (N2N_CONFIG.qsDefaultHeight != '') {
                        qsHeight = parseInt(N2N_CONFIG.qsDefaultHeight);
                    } else {
                        if (n2nLayoutManager.isPortalLayout() && Ext.isIE) {
                            qsHeight = appMainSize.height - 247;
                        } else {
                            qsHeight = appMainSize.height - 241; // auto
                        }
                    }
                }
            }
        }

        var qsResizable = {
            handles: 's',
            pinned: true
        };
        if (!N2N_CONFIG.qsResizable) {
            qsResizable = false;
        }

        quoteScreen = Ext.widget('quotescreen', Ext.apply({
            id: 'quoteScreen',
            title: languageFormat.getLanguage(20631, 'Quote Screen'),
            exchangecode: exchangecode,
            exchangeFeedType: showExType,
            portConfig: {
                resizable: qsResizable,
                closable: false,
                height: qsHeight,
                minHeight: 280, // for at least 10 counters
                maxHeight: 600
            },
            winConfig: {
                width: 880
            }
        }, qsConf));

        /*
         * availableItems: 
         * - quoteScreen.cMenuBuyId; 
         * - quoteScreen.cMenuSellId; 
         * - quoteScreen.cMenuCanRevId; 
         * - quoteScreen.cMenuDepthId; 
         * - quoteScreen.cMenuStkInfoId; 
         * - quoteScreen.cMenuChartId; 
         * - quoteScreen.cMenuNewsId; 
         * - quoteScreen.cMenuStkNewsId;
         */
        var funcs = new Array();

        var funcObj = new Object();
        funcObj.name = quoteScreen.cMenuBuyId;
        funcObj.func = function () {
            activateBuySellMenu(modeOrdBuy);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuSellId;
        funcObj.func = function () {
            activateBuySellMenu(modeOrdSell);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuDepthId;
        funcObj.func = function () {
            /**
             * Apply Market Depth Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            closedMarketDepth = false;
            createMarketDepthPanel(quoteScreen.cMenuStkCode, quoteScreen.cMenuStkName, true);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuStkInfoId;
        funcObj.func = function () {
            createStkInfoPanel(quoteScreen.cMenuStkCode, quoteScreen.cMenuStkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuChartId;
        funcObj.func = function () {
            /**
             * Apply Chart Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createChartPanel(quoteScreen.cMenuStkCode, quoteScreen.cMenuStkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuStkTrackerId;
        funcObj.func = function () {
            /**
             * Apply Stock News Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createTrackerPanel(quoteScreen.cMenuStkCode, quoteScreen.cMenuStkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuHisDataId;
        funcObj.func = function () {
            n2ncomponents.createHistoricalData(quoteScreen.cMenuStkCode, quoteScreen.cMenuStkName);
        };
        funcs.push(funcObj);
        
        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuBrokerQId;
        funcObj.func = function() {
            n2ncomponents.createBrokerQ({key: quoteScreen.cMenuStkCode, name: quoteScreen.cMenuStkName});
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuAnalysisId;
        funcObj.func = function () {
            /**
             * Apply Chart Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createAnalysisChartPanel(quoteScreen.cMenuStkCode, quoteScreen.cMenuStkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuStkNewsId;
        funcObj.func = function () {
            /**
             * Apply Stock News Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createStkNewsPanel(quoteScreen.cMenuStkCode, quoteScreen.cMenuStkName);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuEqTrackerId;
        funcObj.func = function () {
            n2ncomponents.createEquitiesTracker(quoteScreen.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuArchiveNewsId;
        funcObj.func = function () {
            /**
             * Apply Stock News Logic, To Get
             * selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            n2ncomponents.openArchiveNews({key: quoteScreen.cMenuStkCode, name: quoteScreen.cMenuStkName});
        };
        funcs.push(funcObj);
        
        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuElasticNewsId;
        funcObj.func = function () {
            n2ncomponents.openElasticNews({key: quoteScreen.cMenuStkCode, name: quoteScreen.cMenuStkName, newsOpt: '1'});
        };
        funcs.push(funcObj);
        
        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuNikkeiNewsId;
        funcObj.func = function () {
            n2ncomponents.openElasticNews({key: quoteScreen.cMenuStkCode, name: quoteScreen.cMenuStkName, newsOpt: '2'});
        };
        funcs.push(funcObj);
        
        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuNews2Id;
        funcObj.func = function() {
            menuHandler.openNews('', quoteScreen.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuFundamentalCPIQId;
        funcObj.func = function () {
            /**
             * Show Fundamental CPIQ news
             * selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createFundamentalCPIQWin(quoteScreen.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuFundamentalThomsonReutersId;
        funcObj.func = function () {
            /**
             * Show Fundamental Thomson Reuters news
             * selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createFundamentalThomsonReutersWin(quoteScreen.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuAddStockAlertId;
        funcObj.func = function () {
            /**
             * Add Stock Alert
             * selected StkCode get using
             */
            n2ncomponents.createAddStockAlert(quoteScreen.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuOrderStatus;
        funcObj.func = function () {
            /**
             * 
             */
            createOrdStsPanel('', '0');
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuWarrantsInfoId;
        funcObj.func = function () {
            /**
             * Show Warrants Info
             * selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createWarrantsInfoWin(quoteScreen.cMenuStkCode);
        };
        funcs.push(funcObj);
        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuAddToWL;
        funcObj.func = function() {
            addToWatchlist(quoteScreen.cMenuStkCode);
        };
        funcs.push(funcObj);
        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuStockAlert;
        funcObj.func = function() {
        	n2ncomponents.createSMSStockAlert(quoteScreen.cMenuStkCode);
        };
        funcs.push(funcObj);
        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuPSEEdge;
        funcObj.func = function() {
        	n2ncomponents.openPseEdge(quoteScreen.cMenuStkCode);
        };
        funcs.push(funcObj);
        funcObj = new Object();
        funcObj.name = quoteScreen.cMenuIB;
        funcObj.func = function() {
        	n2ncomponents.openIBillionaire(quoteScreen.cMenuStkCode);
        };
        funcs.push(funcObj);

        quoteScreen.onContextMenuClick(funcs);
        
        n2nLayoutManager.addItem(quoteScreen, portlet_col, index, tabCt);
        if (!n2nLayoutManager.isPortalLayout()) {
            n2nLayoutManager.activateItem(quoteScreen);
        }
        
        if (!suspendLoad) {
            quoteScreen.start();
        }
    } else {
        n2nLayoutManager.activateItem(quoteScreen);
    }
}

//CREATE MUTUAL FUND START
function createMutualFund(suspendLoad, mfConf, tabCt, portlet_col, index) {
    
    if(!N2N_CONFIG.mutualFund){
        return;
    }
    
    if (mutualFund == null) {
        if (!tabCt && n2nLayoutManager.activateBuffer('mf')) {
            return;
        }
        
        var appMainSize = n2nLayoutManager.getAppMain().getSize();

        // read from cookie
        var mfHeight = appMainSize.height;
        if (!isMobile) {
            mfHeight = cookies.readCookie(cookieKey + '_MFund_Height_');
            if (mfHeight != null) {
                mfHeight = parseInt(mfHeight);
            } else {
                if (n2nLayoutManager.isWindowLayout()) {
                    mfHeight = appMainSize.height - 235;
                } else {
                    if (N2N_CONFIG.mfDefaultHeight != '') {
                        mfHeight = parseInt(N2N_CONFIG.mfDefaultHeight);
                    } else {
                        if (n2nLayoutManager.isPortalLayout() && Ext.isIE) {
                            mfHeight = appMainSize.height - 247;
                        } else {
                            mfHeight = appMainSize.height - 241; // auto
                        }
                    }
                }
            }
        }

        var mfResizable = {
            handles: 's',
            pinned: true
        };
        if (!N2N_CONFIG.mfResizable) {
            mfResizable = false;
        }

        mutualFund = Ext.widget('mutualFund', Ext.apply({
            id: 'mutualFund',
            title: languageFormat.getLanguage(33503, 'Mutual Fund / Unit Investment Trust Fund (UITF)'),                    
            portConfig: {
                resizable: mfResizable,
                closable: false,
                height: mfHeight,
                minHeight: 280, // for at least 10 counters
                maxHeight: 600
            },
            winConfig: {
                width: 880
            }
        }, mfConf));

        /*
         * availableItems: 
         * - mutualFund.cMenuBuyId; 
         * - mutualFund.cMenuSellId; 
         * - mutualFund.cMenuCanRevId; 
         * - mutualFund.cMenuDepthId; 
         * - mutualFund.cMenuStkInfoId; 
         * - mutualFund.cMenuChartId; 
         * - mutualFund.cMenuNewsId; 
         * - mutualFund.cMenuStkNewsId;
         */
        // Context menu list
        var funcs = new Array();

        //Orderpad buy
        var funcObj = new Object();
        funcObj.name = mutualFund.cMenuBuyId;
        funcObj.func = function () {
            activateBuySellMenu(modeOrdBuy);
        };
        funcs.push(funcObj);

        //Orderpad sell
        funcObj = new Object();
        funcObj.name = mutualFund.cMenuSellId;
        funcObj.func = function () {
            activateBuySellMenu(modeOrdSell);
        };
        funcs.push(funcObj);
        
        //Order status
        funcObj = new Object();
        funcObj.name = mutualFund.cMenuOrderStatus;
        funcObj.func = function () {
            /**
             * 
             */
            createOrdStsPanel('', '0');
        };
        funcs.push(funcObj);
        
        //Stock info
        funcObj = new Object();
        funcObj.name = mutualFund.cMenuStkTrackerId;
        funcObj.func = function () {
            /**
             * Apply Stock News Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createTrackerPanel(mutualFund.cMenuStkCode, mutualFund.cMenuStkName, false);
        };
        funcs.push(funcObj);
        
        //Equity portfolio
        funcObj = new Object();
        funcObj.name = mutualFund.cMenuEqPrtfId;
        funcObj.func = function () {
            /**
             * Apply Chart Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            //TODO HAVE TO CREATE MUTUAL FUND PORTFOLIO PANEL
//            createMutualFundPortfolioPanel('', '0');
        };
        funcs.push(funcObj);

        //Analysis chart
        funcObj = new Object();
        funcObj.name = mutualFund.cMenuAnalysisId;
        funcObj.func = function () {
            /**
             * Apply Chart Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createAnalysisChartPanel(mutualFund.cMenuStkCode, mutualFund.cMenuStkName, false);
        };
        funcs.push(funcObj);

        mutualFund.onContextMenuClick(funcs);
        
        n2nLayoutManager.addItem(mutualFund, portlet_col, index, tabCt);
        if (!n2nLayoutManager.isPortalLayout()) {
            n2nLayoutManager.activateItem(mutualFund);
        }
        
        if (!suspendLoad) {
            mutualFund.start();
        }
    } else {
        n2nLayoutManager.activateItem(mutualFund);
    }
}
//CREATE MUTUAL FUND END

function createOrderPad(stkcode, stkname, mode, ordrec, activateOrderPad, portlet_col, index, conf, tabCt) {

    if (closedOrderPad)
        return;

    if (configutil.noATP() || showBuySellHeader != "TRUE") {
        return;
    }
    
    var exch = stockutil.getExchange(stkcode);
    if (exch && N2N_CONFIG.nonTradeMsgExch.indexOf(exch) > -1) {
        if (activateOrderPad) {
            msgutil.alert(languageFormat.getLanguage(10060, 'Please call your trading representative to place order.'));
            return;
        } else {
            return;
        }
    }

    var activate = activateOrderPad != undefined ? activateOrderPad : false;
    if (orderPad == null) {
        
        if (!tabCt && n2nLayoutManager.activateBuffer('od')) {
            return;
        }
        
        orderPad = Ext.widget('orderpad', Ext.apply({
            portalType: 'large',
            title: languageFormat.getLanguage(20831, 'Order Pad'),
            arFldCfg: arFldCfg,
            arFldCfgMF: arFldCfgMF,
            atpRule: atpRule,
            atpCurrencyRate: atpCurrencyRate,
            id: 'orderPad',
            noMaxBtn: true,
            _resizable: false,
            savingComp: !isMobile && N2N_CONFIG.confDockableOrderpad,
            noDD: !N2N_CONFIG.confDockableOrderpad
        }, conf));

        if (n2nLayoutManager.isWindowLayout()) {
            if (isMobile) {
                var mdToolBtn = Ext.create('Ext.button.Button', {
                    itemId: 'mdTool',
                    xtype: 'button',
                    iconCls: 'mobile-icon-md',
                    width: 24,
                    height: 24,
                    enableToggle: true,
                    pressed: !getCollapsed(),
                    style: 'margin-right:3px',
                    cls: 'fix_tool_btn',
                    toggleHandler: function () {
                        toggleOrderpadExtra();
                    }
                });

                orderPad.mConfig = {
                    maxWidth: 750,
                    width: 350,
                    draggable: true,
                    collapsible: false,
                    resizable: false,
                    closable: false,
                    padding: 2,
                    shadow: 'frame',
                    notComp: true,
                    header: true, // should be always true
                    tools: [
                        mdToolBtn,
                        {
                            xtype: 'button',
                            iconCls: 'mobile-icon-collapse',
                            width: 24,
                            height: 24,
                            style: 'margin-right:3px',
                            cls: 'fix_tool_btn',
                            handler: function (thisBtn, a, b) {
                                var pcomp = orderPad.up();
                                
                                pcomp.toggleCollapse(); //TODO

                                if (pcomp.getCollapsed()) {
                                    thisBtn.setIconCls('mobile-icon-expand');
                                        mdToolBtn.hide();
                                } else {
                                    thisBtn.setIconCls('mobile-icon-collapse');
                                        mdToolBtn.show();
                                    }
                                }
                        },
                        {
                            xtype: 'button',
                            iconCls: 'mobile-icon-close',
                            width: 24,
                            height: 24,
                            cls: 'fix_tool_btn',
                            handler: function () {
                                closedOrderPad = true;
                                var pcomp = orderPad.up();
                                if (pcomp) {
                                    pcomp.close();
                                }
                            }
                        }
                    ]
                };

                // set max width for non-phone
                /*
                 if (!isPhone) {
                 orderPad.mConfig.maxWidth = 350;
                 }
                 */
            } else if (!n2nLayoutManager.isPortalLayout()) {
                orderPadAddExtraFeatures();
            }
            
            if (!N2N_CONFIG.confDockableOrderpad) {
                n2nLayoutManager.openAs = 'popup';
            }else{
            	if(N2N_CONFIG.confOrderpadPopup){
            		n2nLayoutManager.openAs = 'popup';
            	}
            }
            n2nLayoutManager.addItem(orderPad, portlet_col, index, tabCt);
        }
    }
    
    if (n2nLayoutManager.isPortalLayout()) {
        if (showOrderPadWin == 1) {
            orderPadPopup();
        } else {
            orderPadPortlet(portlet_col, index);
        }
    }
    
    helper.runAfterCompRendered(orderPad, function() {
    	
    /*	Not needed anymore
    if (isMobile) {
        getOrdPadCol(orderPad, orderPad.getWidth());
        // orderWin.show();
    } else {
        getOrdPadCol(orderPad, orderPad.getWidth() - orderPad.trdForm.down('#msgBox').ownerCt.getWidth());
    }
    */
    
    if (n2nLayoutManager.isWindowLayout()) {
        var pcomp = orderPad.up();
        if (pcomp.isHidden()) {
            pcomp.show();
        }
    }

    if (mode == null || mode == '') {
        mode = modeOrdBuy;
    }

    if (stkcode && stkcode.length > 0) {
        if (activate) {
            n2nLayoutManager.activateItem(orderPad);
            
            /*
            if (orderWin && orderWin.getCollapsed() != false) {
                orderWin.expand();
            }
            */
        }

        try {
            if (orderPad.allowUpdate === true) {

                orderPad.reset();
                orderPad.resetPanel();

                // dealer/remisier search enhancements
                if (isDealerRemisier && ordrec.OrdStsAccList != null) {
                    orderPad.arAccList = ordrec.OrdStsAccList;
                    orderPad.accs = ordrec.OrdStsAccList;
                }
                
                var stkPart = stockutil.getStockPart(stkname);
                // update title immediately
                orderPad.updateTitle(stkcode, stkPart);
                //Update toggle button
                orderPad.exchangecode = getStkExCode(stkname); 
                if ((orderPad.lastExchange != orderPad.exchangecode)  && (isMf(orderPad.exchangecode) || isMf(orderPad.lastExchange)))
                  switchOrderpadInfo();
                orderPad.setStock(stkcode, stkname);
                
                if (mode == modeOrdBuy || mode == modeOrdSell) {

                    if (ordrec != null && ordrec.price != null && ordrec.price != '' && !(isMO(ordrec.price) || isMP(ordrec.price)))
                        orderPad.price = formatOrdPadPrc(ordrec.price, stkcode);
                    else
                        orderPad.price = '';

                    orderPad.setStkCode(stkcode);
                    orderPad.setStkName(stkname);
                    
                    //Set mutual fund amount scroll step
                    orderPad.minInvest = ordrec.minInvest;
                    orderPad.minRedeem = ordrec.minRedeem;
                    
                    orderPad.mode = mode;
                    orderPad.setTrdInfo();
                    if (ordrec && ordrec.accbranchNo) {
                        if (ordrec.accbranchNo.trim() != '') {
                            orderPad.setAccountNo(ordrec.accbranchNo);
                            if (equityPrtfPanel != undefined) {
                                equityPrtfPanel.accbranchNo = '';
                            }
                        }
                        
                        orderPad.setPaymentList(null, ordrec.payment); // fixed issue where not able to reselect back payment mode when selling from portfolio
                        
                    }
                    orderPad.callStkInfo();
                } else if (mode == modeOrdRevise || mode == modeOrdCancel) {

                    orderPad.accno = ordrec.accNo;
                    orderPad.ordqty = ordrec.unMtQty;
                    // orderPad.ordprc = ordrec.ordPrc;
                    orderPad.price = formatOrdPadPrc(ordrec.ordPrc, stkcode);
                    orderPad.ordprc = orderPad.price;
                    orderPad.ordtype = ordrec.ordType;
                    orderPad.validity = ordrec.validity;
                    orderPad.expdate = ordrec.expDate;
                    orderPad.tktno = ordrec.tktNo;
                    orderPad.ordno = ordrec.ordNo;
                    orderPad.subordno = ordrec.SubOrdNo;
                    orderPad.ordsrc = ordrec.ordSrc;
                    orderPad.ordtime = ordrec.ordTime;
                    orderPad.ordsts = ordrec.ordSts;
                    orderPad.unmtqty = ordrec.unMtQty;
                    orderPad.tradCond = ordrec.TradCond;
                    orderPad.state = ordrec.State;

                    // additional fields for derivatives
                    orderPad.stoplimit = ordrec.stopLimit;
                    orderPad.trailType = ordrec.trailType;
                    orderPad.minqty = ordrec.MinQty;
                    orderPad.dsqty = ordrec.DsQty;
                    orderPad.action = ordrec.Action;
                    orderPad.setStkCode(stkcode);
                    orderPad.setStkName(stkname);
                    orderPad.mode = mode;
                    orderPad.paymentmode = ordrec.SettOpt;
                    orderPad.settcurr = ordrec.SettCurr;
                    orderPad.prevAction = ordrec.Action;
                    orderPad.mtqty = ordrec.MtQty;
                    orderPad.branchCode = ordrec.BCode;
                    orderPad.brokerCode = ordrec.BrokerCode;
                    orderPad.tpType = ordrec.TPType;
                    orderPad.tpDirection = ordrec.TPDirection;
                    orderPad.revTPType = ordrec.TPType;
                    orderPad.revTPDirection = ordrec.TPDirection;
                    
                    // amount for mf
                    orderPad.amount = ordrec.Amount;
                    orderPad.mfQty = ordrec.unMtQty;
                    
//                    orderPad.minInvest = ordRec.minInvest;
//                    orderPad.minRedeem = ordrec.minRedeem;
                    
                    orderPad.setTrdInfo();
                    orderPad.callStkInfo();
                }
                orderPad.callAccBal();
            }
            
            //Update market depth
            //Stk part is stkname without exch
                if (orderPad.exchangecode == "PHMF") {
                    orderPad.updateMutualFundInfo(stkcode, stkname)
                } else {
                    orderPad.updateMarketDepth(stkcode, stkname);
                }

        } catch (e) {
            debugutil.debug('components > createOrderPad', null, e, true);
        }
    }

    if (!orderPad.trdForm.down('#accountno').getValue()) {
        orderPad.btnlimit.disable();
    } else {
        orderPad.btnlimit.enable();
    }
    
    if (stkcode) {
        orderPad.startEdit();
    }
        
    });
    
}

var lastSelectedWl = null;
function addToWatchlist(stkcode) {
    if (isGuestUser) {
        msgutil.show({
            msg: languageFormat.getLanguage(30608, 'For watchlist access, please login to continue'),
            buttons: Ext.MessageBox.YESNO,
            buttonText: {
                yes: '<B>' + languageFormat.getLanguage(10025, 'Log in now') + '</B>',
                no: languageFormat.getLanguage(10026, 'Later')
            },
            fn: function(btn) {
                if (btn == 'yes') {
                    window.parent.location = 'http://www.theedgemalaysia.com/';
                } else {
                    this.close();
                }
            }
        });

        return;
    }

    if (watchListArr == null || watchListArr.length == 0) {
        msgutil.alert(languageFormat.getLanguage(30604, 'Please create a Watchlist'));
        return;
    }
    var wlarr = [];
    for (var i = 0; i < watchListArr.length; i++) {
        wlarr.push({
            val: watchListArr[i],
            dis: textToHtml(watchListArr[i])
        });
    }
    var stWl = Ext.create("Ext.data.Store", {
        fields: ['val', 'dis'],
        data: wlarr
    });
    
    if (!lastSelectedWl || watchListArr.indexOf(lastSelectedWl) == -1) {
        lastSelectedWl = watchListArr[0];
    }
    
    var wlCombo = Ext.create('Ext.form.field.ComboBox', {
        store: stWl,
        forceSelection: true,
        autoSelect: true,
        editable: false,
        displayField: 'dis',
        valueField: 'val',
        displayTpl: Ext.create('Ext.XTemplate',
                '<tpl for=".">',
                '{val}',
                '</tpl>'
                ),
        triggerAction: 'all',
        value: lastSelectedWl,
        listeners: {
            change: function(thisCb, newValue) {
                lastSelectedWl = newValue;
            }
        }
    });

    var addStockWin = msgutil.popup({
        width: 250,
        title: languageFormat.getLanguage(30605, 'Add to Watchlist'),
        border: false,
        resizable: false,
        keepOriginalCloseButton: true,
        bodyStyle: {
            background: 'transparent',
            padding: '5px 0'
        },
        items: [
            wlCombo
        ],
        buttons: [
            {
                text: languageFormat.getLanguage(10012, 'Add'),
                handler: function() {
                    addStockWin.setLoading(languageFormat.getLanguage(10017, 'Loading...'));

                    var wlname = wlCombo.getValue();

                    if (outbound) {
                        stkcode = stockutil.removeStockDelay(stkcode);
                        if (stkcode == false) {
                            msgutil.alert(languageFormat.getLanguage(30602, 'Failed to add to watchList.'));
                            return;
                        }
                    } else {
                        stkcode = stockutil.mapOutboundStock(stkcode);
                    }
                    
                    var url = addPath + 'tcplus/addwl?w=' + escape(wlname) + '&k=' + escape(stkcode);

                    Ext.Ajax.request({
                        url: url,
                        method: 'POST',
                        success: function(response) {
                            addStockWin.setLoading(false);

                            try {
                                var obj = Ext.decode(response.responseText);
                                if (obj != null) {
                                    if (obj.s == true) {
                                        msgutil.info(languageFormat.getLanguage(30606, 'Stock has been successfully added to the watchlist.'));
                                        addStockWin.destroy();

                                        // Refresh watch list if any
                                        var activeWl = n2nLayoutManager.getItem('key', wlname, 'wl');
                                        
                                        if (activeWl != null) {
                                            var wlItem = activeWl.getComponent(0);
                                            if (wlItem) {
                                                wlItem.wlname = wlname;
                                                wlItem.resetList();
                                            }
                                        }
                                    } else {
                                        if (obj.m) {
                                            if (winAlwaysOnTop) {
                                                addStockWin.setAlwaysOnTop(false);
                                            }
                                            if (obj.e == -2002) {		// if its error code is -2002
                                            	msgutil.alert(languageFormat.getLanguage(30131, 'Stock \'[PARAM0]\' already exists in watchlist [PARAM1].', 
                                            				textToHtml(stkcode) + '|' + textToHtml(wlname)), function() {
                                                    if (winAlwaysOnTop) {
                                                        addStockWin.setAlwaysOnTop(true);
                                                    }
                                                });
                                            } else if (obj.e == -2008) {		// if its error code is -2008
                                            	msgutil.alert(languageFormat.getLanguage(30140, 'Maximum \'[PARAM0]\' stocks per watchlist has reached.', 
                                            			N2N_CONFIG.maxStockInWatchlist), function() {
                                            		if (winAlwaysOnTop) {
                                            			addStockWin.setAlwaysOnTop(true);
                                            		}
                                            	});
                                            } else {
                                            	msgutil.alert(obj.m, function() {
                                                    if (winAlwaysOnTop) {
                                                        addStockWin.setAlwaysOnTop(true);
                                                    }
                                                });
                                            }                                           
                                        }
                                    }
                                }
                            } catch (e) {
                                msgutil.alert(languageFormat.getLanguage(30602, 'Failed to add to watchList.'));
                            }
                        },
                        failure: function(response) {
                            addStockWin.setLoading(false);
                            msgutil.alert(languageFormat.getLanguage(30602, 'Failed to add to watchList.'));
                        }
                    });
                }
            },
            {
                text: languageFormat.getLanguage(10010, 'Cancel'),
                handler: function() {
                    addStockWin.destroy();
                }
            }
        ]
    });
}

function wlAddStock(wlname, stkcode, wlComp) {
    stkcode = validateOutboundStock(stkcode);
    
    if (!stkcode) {
        msgutil.alert(languageFormat.getLanguage(30602, 'Failed to add to watchList.'));
        return;
    }

    if (wlComp && !wlComp.recentQuote) { // save for only watchlist
        if (!wlComp.stockExists(stkcode)) {
            if (!helper.inView(wlComp)) {
                wlComp.suspendSwitchRefresh = true;
            }
            
            wlComp.addStock([stkcode], -1); // append to the last
        } else {
            msgutil.alert(languageFormat.getLanguage(30131, 'Stock \'[PARAM0]\' already exists in watchlist [PARAM1].', textToHtml(stkcode) + '|' + textToHtml(wlname)));
            return;
        }

        var url = addPath + 'tcplus/addwl?w=' + escape(wlname) + '&k=' + escape(stkcode);

        Ext.Ajax.request({
            url: url,
            method: 'POST',
            success: function(response) {
                try {
                    var obj = Ext.decode(response.responseText);
                    if (obj != null) {
                        if (obj.s == true) {
                                msgutil.info(languageFormat.getLanguage(30606, 'Stock has been successfully added to the watchlist.'));
                        	} else {
                        		if (obj.m) {
                        			if (obj.e == -2002) {		// if its error code is -2002
                        				msgutil.alert(languageFormat.getLanguage(30131, 'Stock \'[PARAM0]\' already exists in watchlist [PARAM1].', 
                        						textToHtml(stkcode) + '|' + textToHtml(wlname)));
                        			} else if (obj.e == -2008) {		// if its error code is -2008
                        				msgutil.alert(languageFormat.getLanguage(30140, 'Maximum \'[PARAM0]\' stocks per watchlist has reached.', 
                        						N2N_CONFIG.maxStockInWatchlist));
                        			}else {
                                msgutil.alert(obj.m);
                                // revert adding
                                var wlRec = wlComp.stockExists(stkcode);
                                if (wlRec) {
                                    wlComp.removeStock(wlRec);
                        			}                                           
                        		}
                        	}
                        }
                    }
                } catch (e) {
                    msgutil.alert(languageFormat.getLanguage(30602, 'Failed to add to watchList.'));
                }
            },
            failure: function(response) {
                msgutil.alert(languageFormat.getLanguage(30602, 'Failed to add to watchList.'));
            }
        });
    }
}

function orderPadPortlet(portlet_col, index) {
    if (portlet_orderPad === null) {
        if (orderWin != null)
            orderWin.hide();

        portlet_orderPad = Ext.widget('portlet', {
            //id: 'portlet_orderPad',
            closeAction: 'hide',
            title: languageFormat.getLanguage(20831, 'Order Pad'),
            width: 560,
            height: Ext.isIE ? 241 : 235,
            tools: [
                //portal.getTools('Order Pad', 'portlet_orderPad'), 
                {
                    xtype: 'tool',
                    type: 'restore',
                    tooltip: 'Open as popup',
                    handler: function () {
                        showOrderPadWin = 1;
                        orderPadPopup();
                    }
                }],
            items: orderPad,
            listeners: {
                close: function () {
                    portlet_orderPad = null;
                    closedOrderPad = true;
                }
            }
        });
        if (portlet_col) {
            portlet_col.add(portlet_orderPad);
        } else if (portalcol_3) {
            portalcol_3.add(portlet_orderPad);
        } else {
            portalcol_top.add(portlet_orderPad);
        }
    } else {
        if (orderWin != null)
            orderWin.hide();
        portlet_orderPad.add(orderPad);
    }
}

function orderPadPopup() {
    if (orderWin == null) {
        var mdToolBtn;
        var ordWinTools = [];

        if (n2nLayoutManager.isPortalLayout()) {
            ordWinTools.push({
                type: 'restore',
                tooltip: 'Dock as portlet',
                handler: function () {
                    showOrderPadWin = 0;
                    orderPadPortlet();
                }
            });
        }

        if (n2nLayoutManager.isWindowLayout()) {
            mdToolBtn = Ext.create('Ext.button.Button', {
                iconCls: 'icon-tool-md',
                width: 15,
                height: 15,
                padding: 0,
                enableToggle: true,
                cls: 'fix_tool_btn',
                pressed: !getCollapsed(),
                toggleHandler: function () {
                    toggleOrderpadExtra();
                }
            });
            ordWinTools.push(mdToolBtn);
        }
        ordWinTools.push({
            type: 'up',
            callback: function (owner, tool) {
                orderWin.toggleCollapse();

                if (orderWin.getCollapsed()) {
                    tool.setType('down');
                    if (mdToolBtn)
                        mdToolBtn.hide();
                } else {
                    tool.setType('up');
                    if (mdToolBtn)
                        mdToolBtn.show();
                }
            }
        });

        var ordWinConfig = {
            width: 500,
            layout: 'fit',
            title: languageFormat.getLanguage(20831, 'Order Pad'),
            resizable: false,
            constrain: true,
            tools: ordWinTools,
            closeAction: 'hide',
            collapsible: false,
            listeners: {
                close: function () {
                    closedOrderPad = true;
                }
            }
        };

        orderWin = Ext.create('Ext.window.Window', ordWinConfig);
    }

    orderWin.add(orderPad);
    if (portlet_orderPad !== null)
        portlet_orderPad.close();
    
    if (orderWin.isHidden()) {
        if (n2nLayoutManager.compWinX && n2nLayoutManager.compWinY) {
            orderWin.showAt(n2nLayoutManager.compWinX, n2nLayoutManager.compWinY);
        } else {
            orderWin.show();
        }
    }
}

function orderPadAddExtraFeatures() {
    if (!orderPad)
        return;

    // create feature buttons
    var ordWinTools = [];

    // market depth button
    ordWinTools.push({
        xtype: 'button',
        itemId: 'mdToolBtn',
        iconCls: 'icon-tool-md',
        width: 15,
        height: 15,
        padding: 0,
        enableToggle: true,
        cls: 'fix_tool_btn',
        tooltip: languageFormat.getLanguage(10056, 'Toggle Market Depth'), //change tooltip
        toggleHandler: function() {
                toggleOrderpadExtra();
        },
        listeners: {
            afterrender: function(thisBtn) {
                thisBtn.toggle(!getCollapsed(), true);
            }
        }
    });

    // collapse button
    ordWinTools.push({
        type: 'up',
        tooltip: languageFormat.getLanguage(10054, 'Collapse'),
        callback: function(owner, tool) {
            owner.toggleCollapse();

            // market depth toggle button
            var mdToolBtn;
            if (owner.header) {
                mdToolBtn = owner.header.getComponent('mdToolBtn');
            }

            if (owner.getCollapsed()) {
                tool.setType('down');
                tool.setTooltip(languageFormat.getLanguage(10055, 'Expand'));
                if (mdToolBtn)
                    mdToolBtn.hide();
            } else {
                tool.setType('up');
                tool.setTooltip(languageFormat.getLanguage(10054, 'Collapse'));
                if (mdToolBtn)
                    mdToolBtn.show();
            }
        }
    });
    
    if (N2N_CONFIG.confDockableOrderpad) {
        ordWinTools.push({
            xtype: 'button',
            padding: 0,
            width: 15,
            height: 15,
            iconCls: 'icon-popin',
            tooltip: languageFormat.getLanguage(21160,'Pop in this tab'),
            style: 'margin-left:3px',
            cls: 'fix_tool_btn fix_black',
            handler: function(thisBtn) {
                n2nLayoutManager._toTab(thisBtn.toolOwner);
            }
        });
    }

    Ext.apply(orderPad, {
        winConfig: {
            tools: ordWinTools,
            collapsible: false, // use custom button instead
            width: 665,
            minWidth: 500,
            maxWidth: 800,
            closeAction: 'hide',
            listeners: {
                close: function() {
                    if (!orderPad.skipMarkingClosed) {
                        closedOrderPad = true;
                    }
                    orderPad.skipMarkingClosed = null;
                }
            }
        },
        ctConfig: {
            listeners: {
                afterrender: function(thisCt) {
                	if(thisCt.tools.close)
                		thisCt.tools.close.setTooltip(languageFormat.getLanguage(10053, 'Close'));
                	
                    if (!thisCt.isXType('window')) {
                        if (N2N_CONFIG.confDockableOrderpad) {
                            n2nLayoutManager.tabExtraButtons(thisCt);
                        }
                        // skip marking orderpad closed
                        orderPad.skipMarkingClosed = true;
                    } else {
                        closedOrderPad = false; // make sure orderPad still active when switching
                    }
                    
                    orderPad.adjustComps();
                }
            }
        },
        afterLoadBufferItem: function() {
            orderPad.adjustComps();
        }
    });

}

function toggleOrderpadExtra() {
    //On collapsed, 2 will close, on open, only 1 will expand
    //IF ASSUME THAT ONLY 1 EXCHANGE USE 1 TYPE OF ORDER INFO, THEN COOKIE CAN SAVE THE EXCHG CODE ITSELF
    //DEFAULT WILL BE MARKET DEPTH. IF SPECIAL CASE ONLY SPECIAL INFO
    var collapsed = orderPad.compRef.topInfo.getCollapsed() ? true : false;
    var expand;
    
    if (isMf(orderPad.exchangecode)) {
        //fail safe
        orderPad.compRef.marketDepth.collapse();
        if (collapsed) {
            orderPad.compRef.topInfo.expand();
            orderPad.compRef.mFundInfo.expand();
            expand = "MF";
        } else {
            orderPad.compRef.mFundInfo.collapse();
            orderPad.compRef.topInfo.collapse();
            expand = "-1";
        }
    } else {
        //fail safe
        orderPad.compRef.mFundInfo.collapse();
        if (collapsed) {
            orderPad.compRef.topInfo.expand();
            orderPad.compRef.marketDepth.expand();
            expand = "MD";
        } else {
            orderPad.compRef.marketDepth.collapse();
            orderPad.compRef.topInfo.collapse();
            expand = "-1";
        }
    }
    
    // saves state to cookie
    cookies.createCookie('_OrdPad_Expand', expand, 1800);

    orderPad._setCtSize();
}

function processCollapseExpand (MD, MF) {
    
//    switch(true)
//case MD && !MF
//    break;
    if(MD){
        //If market depth not collapsed
        if (!panel.compRef.marketDepth.getCollapsed()) {
            panel.compRef.marketDepth.toggleCollapse();
        }
        if(panel.compRef.marketDepth.getCollapsed()){
            panel.compRef.mFundInfo.toggleCollapse();
        }
    }
    //if not collapsed
    if(!MF){
    //If mFund not collapsed
    if(!panel.compRef.mFundInfo.getCollapsed()){
        panel.compRef.mFundInfo.toggleCollapse();
    }
    }
}

//Get expand or collapsed
function getCollapsed() {
    
    return cookies.readCookie('_OrdPad_Expand') == "-1";
}

function switchOrderpadInfo () {
    var doExpand = false;
    //check if collapsed or docked(dock doesn't display extra thing due to space
    if(!(cookies.readCookie('_OrdPad_Expand') == "-1" || (orderPad.mt && orderPad.mt != "p"))){
        doExpand = true;
    }
    
    //Only for switch from normal stock to mutual fund stock, so 
    if (orderPad.exchangecode == "PHMF") {
        //fail safe
        if(doExpand){
            orderPad.compRef.marketDepth.collapse();
            orderPad.compRef.mFundInfo.expand();
        }
        expand = "MF";
    } else {
        //fail safe
        if(doExpand){
            orderPad.compRef.mFundInfo.collapse();
            orderPad.compRef.marketDepth.expand();
        }
        expand = "MD";
    }

    // saves state to cookie
    cookies.createCookie('_OrdPad_Expand', expand, 1800);
    
    orderPad._setCtSize();
}

function updateOrdPadPanel(grid, ridx, cidx, ordrec) {
    try {
        var rec = grid.getStore().getAt(ridx);
        var recData = rec.data;
        var stkcode = ordrec.stkcode;
        var stkname = ordrec.stkname;
        var mode;
        if (cidx) {
            var cell = grid.getColumnModel().getDataIndex(cidx);
            if (cell == 'BidPrice' || cell == 'BidQty' || cell == 'BidSplit') {
                mode = modeOrdSell;
                ordrec.price = recData.BidPrice;
            } else if (cell == 'AskPrice' || cell == 'AskQty' || cell == 'AskSplit') {
                mode = modeOrdBuy;
                ordrec.price = recData.AskPrice;
            }
        }
        if (mode && stkcode)
            createOrderPad(stkcode, stkname, false, mode, ordrec);
    } catch (e) {
        debug(e);
    }
}

function createOrdStsPanel(accNo, filterOpt, portlet_col, index, osConf, tabCt) {

    if (global_HaveATP.toLowerCase() == 'false') {
        return;
    }

    var isOrdSts = function (comp) {
        var isOS = false;
        if (comp.type == 'orderStatusPanel') {
            isOS = true;
        }
        return isOS;
    };
    if (orderStatusPanel == null) {
        if (!tabCt && n2nLayoutManager.activateBuffer('os')) {
            return;
        }

        if (!N2N2FA.return2FAValidate('ordSts', arguments, osConf, tabCt)) {
            return;
        }
        
        orderStatusPanel = Ext.widget('orderstatus', Ext.apply({
            portalType: 'large',
            title: languageFormat.getLanguage(20171, 'Order Book'),
            id: 'orderStatusPanel',
            filterOpt: filterOpt
        }, osConf));

//        orderStatusPanel.on('beforedestroy', function() {
//            orderStatusPanel = null;
////  		Ext.getCmp('ord_log').disable(); //this can be used if orderHis does nt trigger orderLog
//
//            var length = tabPanel1.items.length;
//            var ohPanelExist = false;
//            for (var i = 0; i < length; i++) {
//                var tmposPanel = tabPanel1.getComponent(i).getComponent(0);
//                if (tmposPanel.type == 'orderHistoryPanel') {
//                    ohPanelExist = true;
//                    break;
//                }
//            }
//
//            if (showV1GUI == "TRUE") {
//                // do not have order log
//            } else {
//                if (showOrdBookOrderLog == "TRUE") {
//                    if (!ohPanelExist) {
//                        Ext.getCmp('ord_log').disable();
//                    }
//                } else {
//                    // do not have order log
//                }
//            }
//        });


        orderStatusPanel.on('beforedestroy', function () {
            orderStatusPanel = null;
            if (!orderHistoryPanel ||!mfOrderHistoryPanel) {
                var _ordLog = Ext.getCmp('ord_log');
                if (_ordLog)
                    _ordLog.disable();
            }
        });
        n2nLayoutManager.addItem(orderStatusPanel, portlet_col, index, tabCt);
        n2nLayoutManager.activateItem(orderStatusPanel);

        if (showV1GUI == "TRUE") {
            // do not have order log	
        } else {
            var _ordLog = Ext.getCmp('ord_log');
            if (showOrdBookOrderLog == "TRUE" && _ordLog) {
                _ordLog.enable();
            } else {
                // do not have order log
            }
        }
        orderStatusPanel.show();
        var tradePinInfo = getPinInfo();
        if (orderPad) {
            orderStatusPanel.setPinInfo(tradePinInfo);
        }
//        for (var i = 0; i < tabPanel1.items.length; i++) {
//            var tempPanel = tabPanel1.getComponent(i).getComponent(0);
//
//            if (tempPanel.id == orderStatusPanel.id) {
//                tabPanel1.getComponent(i).on({
//                    "activate": {
//                        fn: function(thisPanel) {
//                            thisPanel.getComponent(0).search();
//                        },
//                        scope: this
//                    }
//                });
//            }
//        }
    } else {
        screenSet = osConf != null;
        n2nLayoutManager.activateItem(orderStatusPanel);
        orderStatusPanel.filterOpt = filterOpt;
        orderStatusPanel.search(true);
    }

}


function createMFOrdStsPanel(accNo, filterOpt, portlet_col, index, osConf, tabCt) {

    if (global_HaveATP.toLowerCase() == 'false') {
        return;
    }

    var isOrdSts = function (comp) {
        var isOS = false;
        if (comp.type == 'mfOrderStatusPanel') {
            isOS = true;
        }
        return isOS;
    };
    if (mfOrderStatusPanel == null) {
        if (!tabCt && n2nLayoutManager.activateBuffer('mfos')) {
            return;
        }

        if (!N2N2FA.return2FAValidate('ordSts', arguments, osConf, tabCt)) {
            return;
        }
        
        mfOrderStatusPanel = Ext.widget('mforderstatus', Ext.apply({
            portalType: 'large',
            title: languageFormat.getLanguage(33720, 'Mutual Fund Order Book'),
            id: 'mfOrderStatusPanel',
            filterOpt: filterOpt
        }, osConf));
 


        mfOrderStatusPanel.on('beforedestroy', function () {
            mfOrderStatusPanel = null;
            if (!orderHistoryPanel || !mfOrderHistoryPanel) {
                var _ordLog = Ext.getCmp('ord_log');
                if (_ordLog)
                    _ordLog.disable();
            }
        });
        n2nLayoutManager.addItem(mfOrderStatusPanel, portlet_col, index, tabCt);
        n2nLayoutManager.activateItem(mfOrderStatusPanel);

        if (showV1GUI == "TRUE") {
            // do not have order log    
        } else {
            var _ordLog = Ext.getCmp('ord_log');
            if (showOrdBookOrderLog == "TRUE" && _ordLog) {
                _ordLog.enable();
            } else {
                // do not have order log
            }
        }
        mfOrderStatusPanel.show();
        var tradePinInfo = getPinInfo();
        if (orderPad) {
            mfOrderStatusPanel.setPinInfo(tradePinInfo);
        }
    } else {
        screenSet = osConf != null;
        n2nLayoutManager.activateItem(mfOrderStatusPanel);
        mfOrderStatusPanel.filterOpt = filterOpt;
        mfOrderStatusPanel.search(true);
    }

}

function createBasketOrderPanel(portlet_col, index, boConf, tabCt) {

    if (global_HaveATP.toLowerCase() == 'false') {
        return;
    }

    if (basketOrderPanel == null) {
        if (!tabCt && n2nLayoutManager.activateBuffer('bo')) {
            return;
        }
        basketOrderPanel = Ext.widget('basketorder', Ext.apply({}, boConf));

        basketOrderPanel.on('beforedestroy', function () {
        	n2ncomponents.saveBasketCookie();
        	basketOrderPanel = null;
        });
        
        n2nLayoutManager.addItem(basketOrderPanel, portlet_col, index, tabCt);
        n2nLayoutManager.activateItem(basketOrderPanel);
        
        if(!orderPad){
        	closedOrderPad = false;
            createOrderPad(null,null,false);
            orderPad.up().close();
        }
        
        var tradePinInfo = getPinInfo();
        if (orderPad) {
        	basketOrderPanel.setPinInfo(tradePinInfo);
        }
    } else {
        n2nLayoutManager.activateItem(basketOrderPanel);
    }
}

function createMarketDepthPanel(stkcode, stkname, activateMarketDepth, newMktDepth, mdConf, tabCt, portlet_col, index) {
    var createNew = newMktDepth != undefined ? newMktDepth : false;

    // Fix when market depth feature is disabled
    if (showStkInfoMarketDepth != "TRUE" || closedMarketDepth) {
        return;
    }
    
    if (!tabCt && n2nLayoutManager.activateBuffer('md', stkcode, stkname)) {
        return;
    }
    
    /*
    if (!createNew) {
        if (!tabCt && (jsutil.isEmpty(stkcode) || jsutil.isEmpty(stkname))) {
            msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
            return;
        }
    }
    */

    if (newMarketDepth == null) {
        var appMainHeight = n2nLayoutManager.getAppMain().getHeight();
        var mktdY = appMainHeight;
        var mktdConfig = {};
        if (n2nLayoutManager.isWindowLayout()) {
            mktdConfig = {
                winConfig: {
                    width: 560,
                    height: jsutil.toBoolean(showMktDepthTotal) ? 220 : 180
                }
            };
        }

        newMarketDepth = Ext.widget('marketdepth', Ext.apply(mktdConfig, mdConf));
        marketDepthPanels.push(newMarketDepth);
        newMarketDepth.on('beforedestroy', function() {
            Storage.generateUnsubscriptionByExtComp(newMarketDepth);
            newMarketDepth = null;
            marketDepthPanels = [];
            closedMarketDepth = true;
        });
        n2nLayoutManager.addItem(newMarketDepth, portlet_col, index, tabCt);
        n2ncomponents.addEmptyScreen(newMarketDepth);

    } else {
        screenSet = mdConf != null;
    }

    if (stkcode && stkname && newMarketDepth) {
        newMarketDepth.createMarketDepth(stkcode, stkname);
    }

    if (activateMarketDepth == true && newMarketDepth) {
        n2nLayoutManager.activateItem(newMarketDepth);
    }
}

function createMarketDepthMatrixPanel(suspendLoad, dmConf, tabCt, portlet_col, index) {
    if (marketDepthMatrixPanel == null) {
        if (!tabCt && n2nLayoutManager.activateBuffer('dm')) {
            return;
        }
        
        if (n2nLayoutManager.isWindowLayout()) {
            var mxWidth = 985;
            var mxHeight = 508;

            if (device.portrait()) {
                mxWidth = 745;
            }

            marketDepthMatrixPanel = Ext.widget('marketdepthmatrix', Ext.apply({
                winConfig: {
                    width: mxWidth,
                    height: mxHeight
                }
            }, dmConf));
        } else if (n2nLayoutManager.isTabLayout()) {
            marketDepthMatrixPanel = Ext.widget('marketdepthmatrix', {
                matrixWidth: n2nLayoutManager.compRef.mainTab.getWidth(),
                matrixHeight: n2nLayoutManager.compRef.mainTab.getHeight()
            });
        } else {
            marketDepthMatrixPanel = Ext.widget('marketdepthmatrix', {
                matrixWidth: portalcol_top.getWidth(),
                matrixHeight: 355,
                portConfig: {
                    height: 355
                }
            });
        }

        n2nLayoutManager.addItem(marketDepthMatrixPanel, portlet_col, index, tabCt);
        n2nLayoutManager.activateItem(marketDepthMatrixPanel);

        if (!suspendLoad) {
            marketDepthMatrixPanel.start();
        }
    } else {
        n2nLayoutManager.activateItem(marketDepthMatrixPanel);
    }

}

function createIndices(activateItem, autoLoadIndices, portlet_col, index, inConf, tabCt) {
    var activate = activateItem != undefined ? activateItem : true;
    var autoLoad = autoLoadIndices != undefined ? autoLoadIndices : true;

    if (indices == null) {
        if (!tabCt && n2nLayoutManager.activateBuffer('in')) {
            return;
        }
            
        indices = Ext.widget("indices", Ext.apply({
            autoLoad: autoLoad,
            newOpen: inConf == null
            // tConf: n2nLayoutManager.getSubLayout() == 6 ? {tab: 'tab6'} : null
        }, inConf));
        indices.on('beforedestroy', function () {
            if (!indices.inactive) {
                conn.subscribeIndices();
            }
            indices = null;
        });

        n2nLayoutManager.addItem(indices, portlet_col, index, tabCt);
    } else {
        screenSet = inConf != null;
        indices.newOpen = false;
    }

    if (activate)
        n2nLayoutManager.activateItem(indices);
}

function createScoreBoard(activateScoreBoard, portlet_col, index, sbConf, tabCt) {
    var activate = activateScoreBoard != undefined ? activateScoreBoard : true;

    if (scoreBoard == null) {
        if (!tabCt && n2nLayoutManager.activateBuffer('sb')) {
            return;
        }
        scoreBoard = Ext.widget("scoreboard", Ext.apply({
            // tConf: n2nLayoutManager.getSubLayout() == 6 ? {tab: 'tab6'} : null
            winConfig: {
                width: N2N_CONFIG.autoQtyRound ? 925 : 965,
                height: 405
            }
        }, sbConf));
        scoreBoard.on('beforedestroy', function () {
            scoreBoard = null;
        });
        n2nLayoutManager.addItem(scoreBoard, portlet_col, index, tabCt);
    }

    if (activate)
        n2nLayoutManager.activateItem(scoreBoard);
}

function createSummaryPanel(update, portlet_col, index, msConf, tabCt) {
    if (!tabCt && n2nLayoutManager.activateBuffer('mo')) {
        return;
    }
            
    if (!marketOverviewPanel && update == false) {
        marketOverviewPanel = Ext.widget("marketoverview", Ext.apply({
            portalType: 'small',
            exchangecode: exchangecode,
            newOpen: msConf == null
        }, msConf));
        marketOverviewPanel.on('beforedestroy', function () {
            marketOverviewPanel = null;
        });
        if (!portlet_col) {
            portlet_col = portalcol_2;
        }
        n2nLayoutManager.addItem(marketOverviewPanel, portlet_col, index, tabCt);

        n2nLayoutManager.activateItem(marketOverviewPanel);
    } else {
        screenSet = msConf != null;
        marketOverviewPanel.newOpen = false;
        if (update) {
            marketOverviewPanel.cleanUp2();
            marketOverviewPanel.exchangecode = exchangecode;
        }

        n2nLayoutManager.activateItem(marketOverviewPanel);
        marketOverviewPanel.callSummary();
    }
}

/* Moved to n2ncomponents - shuwen20170316
function createWorldIndicesPanel() {
    var worldIndices = userReport['userReport_worldIndices'];

    if (userReport['userReport_worldIndices'] == null) {
        worldIndices = Ext.create('Ext.ux.IFrame', {
            title: languageFormat.getLanguage(20158, 'World Indices'),
//			id			: 'userReport_worldIndices',
//			url 		: worldIndicesURL,
//			iframeScroll: true
        });

        worldIndices.on('beforedestroy', function () {
            userReport[ 'userReport_worldIndices' ] = null;
        });

        n2nLayoutManager.addItem(worldIndices);
        userReport[ 'userReport_worldIndices' ] = worldIndices;
    }

    n2nLayoutManager.activateItem(worldIndices);
    worldIndices.refresh(worldIndicesURL);
}
*/

function initializeWatchList() {
    if (isGuestUser) {
        return;
    }

    console.log("[main][initializeWatchList] start *** ");

    var url = addPath + 'tcplus/getawl?r=true';

    Ext.Ajax.request({
        url: url,
        method: 'POST',
        success: function (response) {
            var text = response.responseText;
            console.log("[main][initializeWatchList] result ---> " + text);

            var wlobj;
            try {
                wlobj = Ext.decode(text);
                if (wlobj.l) { // need to update first
                    watchListArr = wlobj.l;
                }
                
                n2ncomponents.runBufferTasks2();
                n2nLayoutManager.activateWlTabs();
                
                constructWatchlistTbar(wlobj.l);

            } catch (e) {
                console.log("[main][initializeWatchList] Exception ---> " + e);
                console.log(e.stack);
            }
        },
        failure: function (response) {
            console.log("[main][initializeWatchList] failure ---> " + response.responseText);
        }
    });
}

/* Create a new watch list */
// LAST REVIEW: Ratha Pov 2013-15-11
function createWatchlist() {
    var totWL = watchListArr.length;

    if (totWL >= global_maxWatchlistCreate) {
        msgutil.alert(languageFormat.getLanguage(30109, 'We regret to inform that we are unable to create your watchlist as you have reached your maximum number of watchlists.'));
    } else {
        msgutil.prompt(languageFormat.getLanguage(30118, 'Please enter watchlist name') + ':', function (newWl) {
            newWl = newWl.trim();

            if (jsutil.isEmpty(newWl)) {
                msgutil.alert(languageFormat.getLanguage(30106, 'The watchlist name should not be left blank. Kindly enter the name and try again.'), function () {
                    createWatchlist();
                });
            } else if (newWl.length > 20) { // more than 20 characters
                msgutil.alert(languageFormat.getLanguage(30104, 'Please ensure that the name entered does not exceed 20 characters.'), function () {
                    createWatchlist();
                });
            } else if (containsWatchListFunnyChar(newWl)) { // TO REVIEW
                msgutil.alert(languageFormat.getLanguage(30105, 'Please use only letters (a-z or A-Z), numbers (0-9) and symbols (space-_) in this field.'), function () {
                    createWatchlist();
                });
            } else {
                var url = addPath + 'tcplus/createwl?w=' + encodeURI(newWl);
                Ext.Ajax.request({
                    url: url,
                    method: 'POST',
                    success: function (response) {
                        try {
                            var obj = Ext.decode(response.responseText);
                            if (obj != null) {
                                if (obj.s == true) {
                                    msgutil.info(languageFormat.getLanguage(30110, 'New watchlist \'[PARAM0]\' had been successfully created.', textToHtml(newWl)));
                                    n2ncomponents.refreshWlGrid(obj.l);
                                } else if (obj.e == -5002) {
                                	msgutil.alert(languageFormat.getLanguage(30132, 'Wathclist \'[PARAM0]\' already exist.', textToHtml(newWl)));
                                } else {
                                    msgutil.alert(obj.m);
                                }
                            }
                        } catch (e) {
                            msgutil.alert(languageFormat.getLanguage(30113, 'We regret to inform that we are unable to create your new watchlist at this time. Kindly try again shortly.(e)'));
                        }
                    },
                    failure: function () {
                        msgutil.alert(languageFormat.getLanguage(30113, 'We regret to inform that we are unable to create your new watchlist at this time. Kindly try again shortly.(e)'));
                    }
                });
            }
        });
    }
}

/* Rename a watchlist */
// LAST REVIEW: Ratha Pov 2013-15-11
function renameWatchlist(oldName, wlIdx) {
    msgutil.prompt(languageFormat.getLanguage(30107, 'Rename watchlist \'[PARAM0]\' to:', textToHtml(oldName)), function (newName) {
        newName = newName.trim();

        if (jsutil.isEmpty(newName)) {
            msgutil.alert(languageFormat.getLanguage(30106, 'The watchlist name should not be left blank. Kindly enter the name and try again.'), function () {
                renameWatchlist(oldName);
            });
        } else if (newName.length > 20) { // more than 20 characters
            msgutil.alert(languageFormat.getLanguage(30104, 'Please ensure that the name entered does not exceed 20 characters.'), function () {
                renameWatchlist(oldName);
            });
        } else if (containsWatchListFunnyChar(newName)) { // TO REVIEW
            msgutil.alert(languageFormat.getLanguage(30105, 'Please use only letters (a-z or A-Z), numbers (0-9) and symbols (space-_) in this field.'), function () {
                renameWatchlist(oldName);
            });
        } else {
            var url = addPath + 'tcplus/renwl?ow=' + encodeURI(oldName) + '&nw=' + encodeURI(newName);

            Ext.Ajax.request({
                url: url,
                method: 'POST',
                success: function (response) {
                    try {
                        var obj = Ext.decode(response.responseText);
                        if (obj != null) {
                            if (obj.s == true) {
                                msgutil.info(languageFormat.getLanguage(30103, '\'[PARAM0]\' has been successfully renamed to \'[PARAM1]\'.', textToHtml(oldName) + '|' + textToHtml(newName)));

                                var activeWl = n2nLayoutManager.getItem('key', oldName, 'wl');
                                if (activeWl != null) {
                                    activeWl.setTitle(languageFormat.getLanguage(20001, 'Watchlist') + ' - ' + textToHtml(newName));
                                    activeWl.wlname = newName;
                                    activeWl.n2nName = newName;
                                    activeWl.oldKey = oldName;
                                    activeWl.key = newName;
                                    
                                    var keyUpdated = false;
                                    if (activeWatchlistArr) {
                                        for (var ii = 0; ii < activeWatchlistArr.length; ii++) {
                                            var tempWlName = activeWatchlistArr[ii].name;
                                            if (tempWlName == oldName) {
                                                activeWatchlistArr[ii].name = newName;
                                                activeWatchlistArr[ii].wlpanel.wlname = newName;
                                                activeWatchlistArr[ii].wlpanel.n2nName = newName;
                                                activeWatchlistArr[ii].wlpanel.updateKey(newName, oldName);
                                                keyUpdated = true;
                                            }
                                        }
                                    }

                                    if (!keyUpdated) {
                                        n2nLayoutManager.lyConf.updateKey(activeWl.mt, activeWl.type, activeWl.key, null, activeWl.oldKey);
                                    }
                                }
                                
                                watchlistDetector.rename(oldName, newName);

                                n2ncomponents.refreshWlGrid(obj.l, wlIdx);
                            } else {
                            	if (obj.e == -5008) {
                            		msgutil.alert(languageFormat.getLanguage(30132, 'Wathclist \'[PARAM0]\' already exist.', textToHtml(newName)));
                            	}else if(obj.m != null){
                                    msgutil.alert(obj.m);
                            }
                        }
                        }

                    } catch (e) {
                    }
                },
                failure: function (response) {
                }
            });
        }
    });
}

function deleteWatchlist(wlname, wlIdx) {
    msgutil.confirm(languageFormat.getLanguage(30111, 'Are you sure you want to remove [[PARAM0]] from your watchlist?', textToHtml(wlname)), function (btn) {
        if (btn == 'yes') {
            var url = addPath + 'tcplus/delwl?w=' + encodeURI(wlname);
            Ext.Ajax.request({
                url: url,
                method: 'POST',
                success: function (response) {
                    try {
                        var obj = Ext.decode(response.responseText);
                        if (obj != null) {
                            if (obj.s == true) {
                                n2ncomponents.refreshWlGrid(obj.l, wlIdx);

                                msgutil.info(languageFormat.getLanguage(30120, 'Watchlist \'[PARAM0]\' had been successfully removed.', textToHtml(wlname)), function () {
                                    if (activeWatchlistArr) {
                                        for (var ii = 0; ii < activeWatchlistArr.length; ii++) {
                                            if (activeWatchlistArr[ii].name == wlname) {
                                                if (activeWatchlistArr[ii].wlpanel.tConf && activeWatchlistArr[ii].wlpanel.tConf.pos0) {
                                                    // reset configured tab
                                                    n2nLayoutManager.saveConfiguredTab(activeWatchlistArr[ii].wlpanel.tConf.tab, '');
                                                }
                                            }
                                        }
                                    }
                                    
                                    var rObj = n2nLayoutManager.removeItem('key', wlname, 'wl');
                                    n2nLayoutManager.removeKey(rObj);
                                });
                            } else {
                                msgutil.alert(obj.m);
                            }
                        }
                    } catch (e) {
                        msgutil.alert(languageFormat.getLanguage(30108, 'We regret to inform that we are unable to remove your watchlist at this time. Kindly try again shortly.'));
                    }
                },
                failure: function (response) {
                }
            });
        }
    });
}

function viewRecentQuote(rqConf, ctTab, suspendLoad) {
    if (recentQuotePrfr) {
        displayWatchlist(true, recentQuotePrfr.getRecentList(), rqConf, ctTab, null, null, suspendLoad);
    }
}

function displayWatchlist(wlName, stkList, wlConf, ctTab, portlet_col, index1, suspendLoad) {
    var wlType = 'wl';
    var isRecentQuote = false;
    if (wlName === true) { // recent quote
        isRecentQuote = true;
        wlName = '';
        wlType = 'rq';
    }
        
        if (showExchangeMapping == "TRUE") {
            var totStk = stkList.length;
            for (var i = 0; i < totStk; i++) {
                // remove delay
                stkList[i] = stockutil.removeStockDelay(stkList[i]);
            }
        }

        var wlpanel = null;
        if (isRecentQuote) {
            wlpanel = recentQuotePanel;
        } else {
            for (var i = 0; i < activeWatchlistArr.length; i++) {
                var wlobj = activeWatchlistArr[i];

                if (wlobj.name == wlName) {
                    wlpanel = wlobj.wlpanel;
                }
            }
        }

        if (wlpanel == null) {
            wlpanel = Ext.widget('watchlist', Ext.apply({
                id: 'wl_' + Ext.id(),
                title: isRecentQuote ? languageFormat.getLanguage(20018, 'Recent Quotes') : languageFormat.getLanguage(20001, 'Watchlist') + ' - ' + textToHtml(wlName),
                wlname: wlName,
                key: wlName,
                n2nName: wlName,
                fulllist: stkList,
                type: wlType,
                recentQuote: isRecentQuote
            }, wlConf));

            if (outbound) {
                wlpanel.updateRDToolTip(this.colRDTooltip);
            }

            wlpanel.on("beforedestroy", function(p) {
                if (p.recentQuote) {
                    recentQuotePanel = null;
                } else {
                    var index = -1;
                    var totWL = activeWatchlistArr.length;
                    for (var i = 0; i < totWL; i++) {
                        var wlobj = activeWatchlistArr[i];
                        if (wlobj.name == p.wlname) {
                            index = i;
                            break;
                        }
                    }
                    if (index != -1) {
                        activeWatchlistArr.splice(index, 1);
                    }
                    
                    watchlistDetector.remove(p.wlname);
                }
            });

            resetOrderPad();
            n2nLayoutManager.addItem(wlpanel, portlet_col, index1, ctTab);
            n2nLayoutManager.activateItem(wlpanel);
            
            if (!suspendLoad) {
                wlpanel.show();
            } else {
                // add to buffered run
                n2ncomponents.bufferTasks1.push(function() {
                    if (wlpanel) {
                        wlpanel.show();
                    }
                });
            }

            /*
             * availableItems: 
             * - wlpanel.cMenuBuyId; 
             * - wlpanel.cMenuSellId; 
             * - wlpanel.cMenuCanRevId; 
             * - wlpanel.cMenuDepthId; 
             * - wlpanel.cMenuStkInfoId; 
             * - wlpanel.cMenuChartId; 
             * - wlpanel.cMenuNewsId; 
             * - wlpanel.cMenuStkNewsId;
             */
            var funcs = new Array();
            var funcObj = new Object();
            funcObj.name = wlpanel.cMenuBuyId;
            funcObj.func = function() {
                activateBuySellMenu(modeOrdBuy);
            };
            funcs.push(funcObj);


            funcObj = new Object();
            funcObj.name = wlpanel.cMenuSellId;
            funcObj.func = function() {
                activateBuySellMenu(modeOrdSell);
            };
            funcs.push(funcObj);


            funcObj = new Object();
            funcObj.name = wlpanel.cMenuDepthId;
            funcObj.func = function() {
                /**
                 * Apply Market Depth Logic, To Get selected StkCode get using
                 * marketMoverPanel.contextMenu.stkCode
                 */
                closedMarketDepth = false;
                createMarketDepthPanel(wlpanel.cMenuStkCode, wlpanel.cMenuStkName, true);
            };
            funcs.push(funcObj);

            funcObj = new Object();
            funcObj.name = wlpanel.cMenuStkInfoId;
            funcObj.func = function() {
                createStkInfoPanel(wlpanel.cMenuStkCode, wlpanel.cMenuStkName, false);
            };
            funcs.push(funcObj);

            funcObj = new Object();
            funcObj.name = wlpanel.cMenuChartId;
            funcObj.func = function() {
                /**
                 * Apply Chart Logic, To Get
                 * selected StkCode get using
                 * marketMoverPanel.contextMenu.stkCode
                 */

                createChartPanel(wlpanel.cMenuStkCode, wlpanel.cMenuStkName, false);
            };
            funcs.push(funcObj);

            funcObj = new Object();
            funcObj.name = wlpanel.cMenuStkNewsId;
            funcObj.func = function() {
                /**
                 * Apply Stock News Logic, To Get
                 * selected StkCode get using
                 * marketMoverPanel.contextMenu.stkCode
                 */
                createStkNewsPanel(wlpanel.cMenuStkCode, wlpanel.cMenuStkName);
            };
            funcs.push(funcObj);

            funcObj = new Object();
            funcObj.name = wlpanel.cMenuArchiveNewsId;
            funcObj.func = function() {
                /**
                 * Apply Stock News Logic, To Get
                 * selected StkCode get using
                 * marketMoverPanel.contextMenu.stkCode
                 */
                n2ncomponents.openArchiveNews({key: wlpanel.cMenuStkCode, name: wlpanel.cMenuStkName});
            };
            funcs.push(funcObj);
            
            funcObj = new Object();
            funcObj.name = wlpanel.cMenuElasticNewsId;
            funcObj.func = function() {
                n2ncomponents.openElasticNews({key: wlpanel.cMenuStkCode, name: wlpanel.cMenuStkName, newsOpt: '1'});
            };
            funcs.push(funcObj);
            
            funcObj = new Object();
            funcObj.name = wlpanel.cMenuNikkeiNewsId;
            funcObj.func = function() {
                n2ncomponents.openElasticNews({key: wlpanel.cMenuStkCode, name: wlpanel.cMenuStkName, newsOpt: '2'});
            };
            funcs.push(funcObj);
            
            funcObj = new Object();
            funcObj.name = wlpanel.cMenuNews2Id;
            funcObj.func = function() {
                menuHandler.openNews('', wlpanel.cMenuStkCode);
            };
            funcs.push(funcObj);

            funcObj = new Object();
            funcObj.name = wlpanel.cMenuEqTrackerId;
            funcObj.func = function() {
                n2ncomponents.createEquitiesTracker(wlpanel.cMenuStkCode);
            };
            funcs.push(funcObj);

            funcObj = new Object();
            funcObj.name = wlpanel.cMenuStkTrackerId;
            funcObj.func = function() {
                /**
                 * Apply Stock News Logic, To Get
                 * selected StkCode get using
                 * marketMoverPanel.contextMenu.stkCode
                 */
                createTrackerPanel(wlpanel.cMenuStkCode, wlpanel.cMenuStkName, false);
            };
            funcs.push(funcObj);

            funcObj = new Object();
            funcObj.name = wlpanel.cMenuHisDataId;
            funcObj.func = function() {
                n2ncomponents.createHistoricalData(wlpanel.cMenuStkCode, wlpanel.cMenuStkName);
            };
            funcs.push(funcObj);
            
            funcObj = new Object();
            funcObj.name = wlpanel.cMenuBrokerQId;
            funcObj.func = function() {
                n2ncomponents.createBrokerQ({key: wlpanel.cMenuStkCode, name: wlpanel.cMenuStkName});
            };
            funcs.push(funcObj);

            funcObj = new Object();
            funcObj.name = wlpanel.cMenuAnalysisId;
            funcObj.func = function() {
                /**
                 * Apply Stock News Logic, To Get
                 * selected StkCode get using
                 * marketMoverPanel.contextMenu.stkCode
                 */
                createAnalysisChartPanel(wlpanel.cMenuStkCode, wlpanel.cMenuStkName, false);
            };
            funcs.push(funcObj);

            funcObj = new Object();
            funcObj.name = wlpanel.cMenuFundamentalCPIQId;
            funcObj.func = function() {
                /**
                 * Show Fundamental CPIQ news
                 * selected StkCode get using
                 * marketMoverPanel.contextMenu.stkCode
                 */
                createFundamentalCPIQWin(wlpanel.cMenuStkCode);
            };
            funcs.push(funcObj);

            funcObj = new Object();
            funcObj.name = wlpanel.cMenuFundamentalThomsonReutersId;
            funcObj.func = function() {
                /**
                 * Show Fundamental Thomson Reuters news
                 * selected StkCode get using
                 * marketMoverPanel.contextMenu.stkCode
                 */
                createFundamentalThomsonReutersWin(wlpanel.cMenuStkCode);
            };
            funcs.push(funcObj);

            funcObj = new Object();
            funcObj.name = wlpanel.cMenuAddStockAlertId;
            funcObj.func = function() {
                /**
                 * Add Stock Alert
                 * selected StkCode get using
                 */
                n2ncomponents.createAddStockAlert(wlpanel.cMenuStkCode);
            };
            funcs.push(funcObj);

            funcObj = new Object();
            funcObj.name = wlpanel.cMenuOrderStatus;
            funcObj.func = function() {
                /**
                 * open order book
                 */
                if(wlpanel.cMenuStkCode && wlpanel.cMenuStkCode.indexOf('.'+ N2N_CONFIG.mfExchCode) > -1)
                    createMFOrdStsPanel('', '0');
                else 
                    createOrdStsPanel('', '0');
            };
            funcs.push(funcObj);

            funcObj = new Object();
            funcObj.name = wlpanel.cMenuWarrantsInfoId;
            funcObj.func = function() {
                /**
                 * Show Warrants Info
                 * selected StkCode get using
                 * marketMoverPanel.contextMenu.stkCode
                 */
                createWarrantsInfoWin(wlpanel.cMenuStkCode);
            };
            funcs.push(funcObj);


            funcObj = new Object();
            funcObj.name = wlpanel.cMenuRmFrWatchlist;
            funcObj.func = function() {

                removeFromWatchlist(wlpanel, wlpanel.cMenuStkCode, wlpanel.cMenuRowIndex);
            };
            funcs.push(funcObj);
            
            funcObj = new Object();
            funcObj.name = wlpanel.cMenuRmFrRecent;
            funcObj.func = function() {
                removeFromRecent(wlpanel, wlpanel.cMenuStkCode, wlpanel.cMenuRowIndex);
                
            };
            funcs.push(funcObj);
            funcObj = new Object();
            funcObj.name = wlpanel.cMenuStockAlert;
            funcObj.func = function() {
            	n2ncomponents.createSMSStockAlert(wlpanel.cMenuStkCode);
            };
            funcs.push(funcObj);
            funcObj = new Object();
            funcObj.name = wlpanel.cMenuPSEEdge;
            funcObj.func = function() {
            	n2ncomponents.openPseEdge(wlpanel.cMenuStkCode);
            };
            funcs.push(funcObj);
            funcObj = new Object();
            funcObj.name = wlpanel.cMenuIB;
            funcObj.func = function() {
            	n2ncomponents.openIBillionaire(wlpanel.cMenuStkCode);
            };
            funcs.push(funcObj);

            wlpanel.onContextMenuClick(funcs);

            wlobj = new Object();
            wlobj.name = wlName;
            wlobj.wlpanel = wlpanel;

            if (!isRecentQuote) {
                activeWatchlistArr.push(wlobj);
            } else {
                recentQuotePanel = wlpanel;
            }
        } else {
            n2nLayoutManager.activateItem(wlpanel);
            screenSet = wlConf != null && wlConf.tConf.pos0;
        }
        
        if (wlConf && wlConf.tConf && wlConf.tConf.pos0) {
            n2nLayoutManager.saveConfiguredTab(wlConf.tConf.tab, wlType, wlName);
        }
}

function viewWatchlist(wlName, portlet_col, index1, wlConf, ctTab) {
    if (!wlName) {
        // get available watchlist
        wlName = n2nLayoutManager.getFreeWl();
        if (wlName && ctTab) {
            ctTab.key = wlName;
            ctTab.setTitle(languageFormat.getLanguage(20001, 'Watchlist') + ' - ' + textToHtml(wlName));
            n2nLayoutManager.lyConf.updateKey(ctTab.mt, 'wl', wlName);
        }
    }
    
    if (!ctTab && n2nLayoutManager.activateBuffer('wl', wlName)) {
        return;
    }
    
    if (!watchlistDetector.add(wlName, (wlConf != null && wlConf.loadedScreen))) {
        return;
    }

    if (wlName) {
        var url = addPath + 'tcplus/getwl?w=' + encodeURI(wlName);

        Ext.Ajax.request({
            url: url,
            method: 'POST',
            success: function(response) {
                var d = [];
                try {
                    var obj = Ext.decode(response.responseText);
                    d = obj.d;
                } catch (e) {
                    console.log('viewWatchlist exception ->', e);
                }

                displayWatchlist(wlName, d, wlConf, ctTab, portlet_col, index1);

            },
            failure: function() {
                msgutil.alert(languageFormat.getLanguage(31112, 'Error occurred.'));
            }
        });
    }
}

function removeFromWatchlist(grid, stkcode, rowIndex) {
    if (!outbound) {
        stkcode = stockutil.mapOutboundStock(stkcode);
    }

    msgutil.confirm(languageFormat.getLanguage(30601, 'Are you sure you want to remove this stock from watchlist?'), function(btn) {
        if (btn == 'yes') {
            if (outbound) {
                stkcode = stockutil.removeStockDelay(stkcode);
                if (stkcode == false) {
                    msgutil.alert(languageFormat.getLanguage(30609, 'Failed to remove from watchlist.'));
                    return;
                }
            }

            var url = addPath + 'tcplus/remwl?w=' + escape(grid.wlname) + '&k=' + escape(stkcode);
            Ext.Ajax.request({
                url: url,
                method: 'POST',
                success: function(response) {
                    try {
                        var obj = Ext.decode(response.responseText);
                        if (obj != null) {
                            if (obj.s == true) {
                                grid.removeStock(rowIndex, stkcode, true);

                                msgutil.info(languageFormat.getLanguage(30603, 'Removed successfully'));
                                var recNum = grid.getStore().getCount();
                                if (recNum == 0) {
                                    helper.setGridEmptyText(grid, languageFormat.getLanguage(30013, 'No result found.'));
                                } else {
                                    if (rowIndex > recNum - 1) {
                                        rowIndex = recNum - 1;
                                    }

                                    grid.getSelectionModel().select(rowIndex);
                                }
                            } else {
                                if (obj.m) {
                                    msgutil.alert(obj.m);
                                } else {
                                    msgutil.alert(languageFormat.getLanguage(30609, 'Failed to remove from watchlist.'));
                                }
                            }
                        }
                    } catch (e) {
                        msgutil.alert(languageFormat.getLanguage(30609, 'Failed to remove from watchlist.'));
                    }
                },
                failure: function() {
                    msgutil.alert(languageFormat.getLanguage(30609, 'Failed to remove from watchlist.'));
                }
            });
        }
    });
}

function removeFromRecent(grid, stkcode, rowIndex) {
    /*
    if (outbound) {
        stkcode = stockutil.removeStockDelay(stkcode);
        if (stkcode == false) {
            return;
        }
    } else {
        stkcode = stockutil.mapOutboundStock(stkcode);
    }
    */
    
    grid.removeStock(rowIndex, stkcode, true);

    var recNum = grid.getStore().getCount();
    if (recNum == 0) {
        helper.setGridEmptyText(grid, languageFormat.getLanguage(30013, 'No result found.'));
    } else {
        if (rowIndex > recNum - 1) {
            rowIndex = recNum - 1;
        }

        grid.getSelectionModel().select(rowIndex);
    }

    // remove from recent quote storage
    recentQuotePrfr.remove(stkcode);
}

function addWlDDMenu() {
    return {
        afterrender: function(thisSubMenu) {
            n2nLayoutManager.initDragMenu(thisSubMenu);
        },
        beforedestroy: function(thisSubMenu) {
            if (thisSubMenu.dragZone) {
                thisSubMenu.dragZone.destroy();
            }
        }
    };
}

function constructWatchlistTbar(list) {
    if (!list)
        return;

    watchListArr = list;

    if (!mainMenuBar && (N2N_CONFIG.menuType != MENU_TYPE.TOOL)) { // when default menu is not used
        return;
    }

    var tbar = null;
    var idx = -1;

    if (mainMenuBar) {
        tbar = mainMenuBar;
        var count = mainMenuBar.items.length;
        for (var i = 0; i < count; i++) {
            if (mainMenuBar.items.items[i].id == tbMenuWatchList.id) {
                idx = i;
                break;
            }
        }
    } else {

        var mainMenuToolBar = n2nLayoutManager.compRef.mainMenuBar.items;
        for (var i = 0; i < mainMenuToolBar.length; i++) {
            if (mainMenuToolBar.items[i].id == 'menutoolbtn') {
                tbar = mainMenuToolBar.items[i].menu;
                break;
            }
        }

        var totExchg = tbar.items.length;
        for (var i = 0; i < totExchg; i++) {
            if (tbar.items.items[i].id == tbMenuWatchList.id) {
                idx = i;
                break;
            }
        }
    }

    if (idx != -1) {
        var menuView = new Array();
        var menuRename = new Array();
        var menuDelete = new Array();
        var totWL = list.length;

        for (var i = 0; i < totWL; i++) {
            if (list[i] == "") {
                continue;
            }

            var viewWl = {
                text: textToHtml(list[i]),
                wlName: list[i],
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                handler: function (thisBtn) {
                    viewWatchlist(thisBtn.wlName);
                },
                secondMenu: true,
                listeners: addWlDDMenu()
            };

            var renameWl = {
                text: textToHtml(list[i]),
                wlName: list[i],
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                secondMenu: true,
                popupOnly: true,
                handler: function (thisBtn) {
                    renameWatchlist(thisBtn.wlName);
                },
                listeners: addWlDDMenu()
            };

            var deleteWl = {
                text: textToHtml(list[i]),
                wlName: list[i],
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                secondMenu: true,
                popupOnly: true,
                listeners: addWlDDMenu(),
                handler: function (thisBtn) {
                    deleteWatchlist(thisBtn.wlName);
                }};

            menuView.push(viewWl);
            menuRename.push(renameWl);
            menuDelete.push(deleteWl);
        }

        if (showWatchListHeader == "TRUE") {
            var tbWacthListItem = [];
            if (N2N_CONFIG.recentQuote) {
                tbWacthListItem.push({
                    id: 'tbwl_recent',
                    text: languageFormat.getLanguage(20018, 'Recent Quotes'),
                    cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                    handler: menuHandler.recentQuote,
                    listeners: addWlDDMenu()
                });
            }
            
            if (showWatchListView == "TRUE") {
                tbWacthListItem.push({
                    id: 'tbwl_view',
                    text: languageFormat.getLanguage(20002, 'View Watchlist'),
                    disabled: (menuView.length > 0 ? false : true),
                    hideOnClick: !touchMode,
                    cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                    mouseOverDisabled: true,
                    menu: new Ext.menu.Menu({
                        //cls: 'x-menu-medium',
                        items: menuView
                    }),
                    onClick: touchExpandSubmenu
                });
            }
            if (showWatchListCreate == "TRUE") {
                tbWacthListItem.push({
                    id: 'tbwl_create',
                    text: languageFormat.getLanguage(20003, 'Create Watchlist'),
                    cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                    items: list, //v1.3.34.4
                    handler: createWatchlist,
                    listeners: addWlDDMenu(),
                    popupOnly: true
                });
            }
            if (showWatchListRename == "TRUE") {
                tbWacthListItem.push({
                    id: 'tbwl_rename',
                    text: languageFormat.getLanguage(20004, 'Rename Watchlist'),
                    disabled: (menuRename.length > 0 ? false : true),
                    mouseOverDisabled: true,
                    hideOnClick: !touchMode,
                    cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                    menu: new Ext.menu.Menu({
                        //cls: 'x-menu-medium',
                        items: menuRename
                    }),
                    onClick: touchExpandSubmenu
                });
            }
            if (showWatchListDelete == "TRUE") {
                tbWacthListItem.push({
                    id: 'tbwl_delete',
                    text: languageFormat.getLanguage(20005, 'Delete Watchlist'),
                    disabled: (menuDelete.length > 0 ? false : true),
                    mouseOverDisabled: true,
                    hideOnClick: !touchMode,
                    cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                    menu: new Ext.menu.Menu({
                        //cls: 'x-menu-medium',
                        items: menuDelete
                    }),
                    onClick: touchExpandSubmenu
                });
            }
            
            tbMenuWatchList = {
                id: 'tbWL',
                text: languageFormat.getLanguage(20001, 'Watchlist'),
                iconCls: 'icon-menu-watchlist',
                hideOnClick: false,
                menu: tbWacthListItem,
                listeners: getMenuOverListeners()
            };

            tbar.remove(tbMenuWatchList.id);
            tbar.insert(idx, tbMenuWatchList);
        }

    }
}

function createStkInfoPanel(stkcode, stkname, replace, portlet_col, index, stConf, tabCt) {
    replace = true;
    
    if (!n2nLayoutManager.getFeatureStatus('si')) {
        return;
    }
    
    if (!tabCt && n2nLayoutManager.activateBuffer('si', stkcode, stkname)) {
        return;
    }
    
    /*
    if (!tabCt && (jsutil.isEmpty(stkcode) || jsutil.isEmpty(stkname))) {
        // if (!stConf || !stConf.tConf || !stConf.tConf.pos0) {
        msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
        return;
        // }
    }
    */

    if (jsutil.isEmpty(stkcode)) {
        stkcode = '';
    }
    if (jsutil.isEmpty(stkname)) {
        stkname = '';
    }

    if (stkInfoPanels == null)
        stkInfoPanels = [];

    var stkTitle = stockutil.getStockName(stkname, languageFormat.getLanguage(20021, 'Stock Info'));
    var createNew = false;

    // Check existing stock info panel
    if (stkInfoPanels.length > 0) {
        if (replace) {
            var tempStkInfo = stkInfoPanels[0];
            tempStkInfo.title = stkTitle;
            tempStkInfo.setCode(stkcode, stkname);
            tempStkInfo.newOpen = false;
            n2nLayoutManager.activateItem(tempStkInfo);
            tempStkInfo.procCallTitle();
        } else {
            var isExist = false;
            for (var i = 0; i < stkInfoPanels.length; i++) {
                var tempStkPanel = stkInfoPanels[i];
                if (tempStkPanel.stkcode == stkcode) {
                    isExist = true;
                }
            }

            if (!isExist) {
                createNew = true;
            }
        }
    } else {
        createNew = true;
    }

    if (createNew) {
        var newStkInfo = Ext.widget("stockinfo", Ext.apply({
            title: stkTitle,
            stkcode: stkcode,
            key: stkcode,
            stkname: stkname,
            newOpen: stConf == null
        }, stConf));
        stkInfoPanels.push(newStkInfo);
        newStkInfo.on('beforedestroy', function (panel) {
            for (var i = 0; i < stkInfoPanels.length; i++) {
                var tempStkInfo = stkInfoPanels[i];
                if (tempStkInfo.id == panel.id) {
                    stkInfoPanels.splice(i, 1);
                    newStkInfo = null;
                    break;
                }
            }
        });
        n2nLayoutManager.addItem(newStkInfo, portlet_col, index, tabCt);
        n2nLayoutManager.activateItem(newStkInfo);
        n2ncomponents.addEmptyScreen(newStkInfo);
    }
}

function createChartPanel(stkcode, stkname, replace, portlet_col, index, chConf, tabCt, startup) {
    replace = true;
    
    if (!tabCt && n2nLayoutManager.activateBuffer('ic', stkcode, stkname)) {
        return;
    }
    
    /*
    if (!tabCt && (jsutil.isEmpty(stkcode) || jsutil.isEmpty(stkname))) {
        msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
        return;
    }
    */
    
    stkcode = stkcode || '';
    stkname = stkname || '';

    if (chartPanels == null)
        chartPanels = [];

    var chartPanel;
    var createNew = false;

    if (chartPanels.length > 0) {
        if (replace) {
            var chartPanel = chartPanels[0];
        } else {
            var isExist = false;

            for (var i = 0; i < chartPanels.length; i++) {
                if (chartPanels[i].stkcode === stkcode) {
                    isExist = true;
                    break;
                }
            }

            if (!isExist) {
                createNew = true;
            }
        }

    } else {
        createNew = true;
    }

    if (createNew) {
    	
    	sessionStorage.removeItem('idChart');
        var chartPanel = Ext.widget('intradaychart', Ext.apply({
            _startup: startup,
            newOpen: chConf == null
        }, chConf));

        chartPanels.push(chartPanel);
        chartPanel.on('beforedestroy', function (panel) {
            for (var i = 0; i < chartPanels.length; i++) {
                var tempChartPanel = chartPanels[i];
                if (tempChartPanel.id == panel.id) {
                    chartPanels.splice(i, 1);
                    break;
                }
            }
        });

        n2nLayoutManager.addItem(chartPanel, portlet_col, index, tabCt);
        n2ncomponents.addEmptyScreen(chartPanel);

    } else {
        screenSet = chConf != null;
        chartPanel.newOpen = false;
    }
    
    var prevChartKey = sessionStorage.getItem('idChart');
    if(prevChartKey){
    	if(prevChartKey == stkcode){
    		return;
    	}
    }

    sessionStorage.setItem('idChart', stkcode);
    chartPanel.setCode(stkcode, stkname);
    n2nLayoutManager.activateItem(chartPanel);
    
    helper.runAfterCompRendered(chartPanel, function() {
    chartPanel.loadChart();
    });

}

function createAnalysisChartPanel(stkcode, stkname, replace, portlet_col, index, conf, tabCt, startup, isIndices) {
    // keep for existing use, will remove in the future
    n2ncomponents.createAnalysisChart({
        key: stkcode,
        name: stkname,
        isIndices: isIndices
    }, portlet_col, index, conf, tabCt, startup);
}

/* Moved to n2ncomponents - shuwen20170316
function createITFinanceChartPanel() {
    var itFinanceChart = userReport['userReport_itfinance_chart'];

    if (userReport['userReport_itfinance_chart'] == null) {
        itFinanceChart = Ext.create('Ext.ux.IFrame', {
            title: languageFormat.getLanguage(20113, 'IT Finance Chart'),
            initMax: true
//			id			: 'userReport_itfinance_chart',
//			url 		: ITFinanceChartURL,
//			iframeScroll: true
        });

        itFinanceChart.on('beforedestroy', function () {
            userReport[ 'userReport_itfinance_chart' ] = null;
        });

        n2nLayoutManager.addItem(itFinanceChart);
        userReport[ 'userReport_itfinance_chart' ] = itFinanceChart;
    }

    n2nLayoutManager.activateItem(itFinanceChart);
    itFinanceChart.refresh(ITFinanceChartURL);
}
*/

function createDerivativePortfolioPanel(accNo, portlet_col, index, dpConf, tabCt) {

    if (global_HaveATP.toLowerCase() == 'false') {
        return;
    }

    if (derivativePrtfPanel == null) {
        if (!tabCt && n2nLayoutManager.activateBuffer('dp')) {
            return;
        }
        
        if (!N2N2FA.return2FAValidate('derivativePrtf', arguments, dpConf, tabCt)) {
            return;
        }
            
        if (portFolioDisclaimerSessionShare.toLowerCase() == 'true') {
            if (N2NDisclaimer.chkDisclaimerValidation('createDerivativePortfolioPanel', arguments)) {
                return;
            }
        } else {
            if (N2NDisclaimer.validation('createDerivativePortfolioPanel', arguments)) {
                return;
            }
        }

        derivativePrtfPanel = Ext.widget('derivativeprtf', Ext.apply({
            portalType: 'large',
            displayCategory: 'auto'
        }, dpConf));

        derivativePrtfPanel.on('beforedestroy', function () {
            derivativePrtfPanel = null;
        });

        n2nLayoutManager.addItem(derivativePrtfPanel, portlet_col, index, tabCt);
    } else {
        screenSet = dpConf != null;
        if (accNo) {
            derivativePrtfPanel.accNo = accNo;
        }
    }

    n2nLayoutManager.activateItem(derivativePrtfPanel);
    derivativePrtfPanel.refresh();
}

function createEquityPortfolioPanel(accNo, portlet_col, index, epConf, tabCt) {

    if (global_HaveATP.toLowerCase() == 'false') {
        return;
    }

    var ex = (exchangecode == 'MY') ? 'KL' : exchangecode;

    if (equityPrtfPanel == null) {
        if (!tabCt && n2nLayoutManager.activateBuffer('ep')) {
            return;
        }
        
        if (!N2N2FA.return2FAValidate('equityPrtf', arguments, epConf, tabCt)) {
            return;
        }
        
        if (portFolioDisclaimerSessionShare.toLowerCase() == 'true') {
            if (N2NDisclaimer.chkDisclaimerValidation('createEquityPortfolioPanel', arguments)) {
                return;
            }
        } else {
            if (N2NDisclaimer.validation('createEquityPortfolioPanel', arguments)) {
                return;
            }
        }

        equityPrtfPanel = Ext.widget('equityprtf', Ext.apply({
        	title: languageFormat.getLanguage(20295, 'Equities Portfolio'),
            exchangecode: ex,
            portalType: 'large',
            displayCategory: 'auto'
        }, epConf));

        equityPrtfPanel.on('beforedestroy', function () {
            equityPrtfPanel = null;
        });
        
        n2nLayoutManager.addItem(equityPrtfPanel, portlet_col, index, tabCt);
        n2nLayoutManager.activateItem(equityPrtfPanel);
        
        var funcs = new Array();
        var funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuBuyId;
        funcObj.func = function () {
            /*
            var objRec = equityPrtfPanel.cMenuObject;
            var accbranch = (equityPrtfPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[0].trim() + global_AccountSeparator + (equityPrtfPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[1].trim(); // #account list separator ('-')
            equityPrtfPanel.accbranchNo = accbranch;
            objRec.accbranchNo = accbranch;
            */
            activateBuySellMenu(modeOrdBuy);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuSellId;
        funcObj.func = function () {
            /*
            var objRec = equityPrtfPanel.cMenuObject;
            var accbranch = (equityPrtfPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[0].trim() + global_AccountSeparator + (equityPrtfPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[1].trim(); // #account list separator ('-')
            equityPrtfPanel.accbranchNo = accbranch;
            objRec.accbranchNo = accbranch;
            */
            activateBuySellMenu(modeOrdSell);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuDepthId;
        funcObj.func = function () {
            closedMarketDepth = false;
            createMarketDepthPanel(equityPrtfPanel.cMenuStkCode, equityPrtfPanel.cMenuStkName, true);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuStkInfoId;
        funcObj.func = function () {
            createStkInfoPanel(equityPrtfPanel.cMenuStkCode, equityPrtfPanel.cMenuStkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuChartId;
        funcObj.func = function () {
            /**
             * Apply Chart Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */

            createChartPanel(equityPrtfPanel.cMenuStkCode, equityPrtfPanel.cMenuStkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuStkTrackerId;
        funcObj.func = function () {
            /**
             * Apply Chart Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */

            createTrackerPanel(equityPrtfPanel.cMenuStkCode, equityPrtfPanel.cMenuStkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuEqTrackerId;
        funcObj.func = function () {
            n2ncomponents.createEquitiesTracker(equityPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuHisDataId;
        funcObj.func = function () {
            n2ncomponents.createHistoricalData(equityPrtfPanel.cMenuStkCode, equityPrtfPanel.cMenuStkName);
        };
        funcs.push(funcObj);
        
        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuBrokerQId;
        funcObj.func = function() {
            n2ncomponents.createBrokerQ({key: equityPrtfPanel.cMenuStkCode, name: equityPrtfPanel.cMenuStkName});
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuAnalysisId;
        funcObj.func = function () {
            /**
             * Apply Chart Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */

            createAnalysisChartPanel(equityPrtfPanel.cMenuStkCode, equityPrtfPanel.cMenuStkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuStkNewsId;
        funcObj.func = function () {
            /**
             * Apply Stock News Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createStkNewsPanel(equityPrtfPanel.cMenuStkCode, equityPrtfPanel.cMenuStkName);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuArchiveNewsId;
        funcObj.func = function () {
            n2ncomponents.openArchiveNews({key: equityPrtfPanel.cMenuStkCode, name: equityPrtfPanel.cMenuStkName});
        };
        funcs.push(funcObj);
        
        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuElasticNewsId;
        funcObj.func = function () {
            n2ncomponents.openElasticNews({key: equityPrtfPanel.cMenuStkCode, name: equityPrtfPanel.cMenuStkName, newsOpt: '1'});
        };
        funcs.push(funcObj);
        
        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuNikkeiNewsId;
        funcObj.func = function () {
            n2ncomponents.openElasticNews({key: equityPrtfPanel.cMenuStkCode, name: equityPrtfPanel.cMenuStkName, newsOpt: '2'});
        };
        funcs.push(funcObj);
        
        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuNews2Id;
        funcObj.func = function () {
            menuHandler.openNews('', equityPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuFundamentalCPIQId;
        funcObj.func = function () {
            /**
             * Show Fundamental CPIQ news
             * selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createFundamentalCPIQWin(equityPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuFundamentalThomsonReutersId;
        funcObj.func = function () {
            /**
             * Show Fundamental Thomson Reuters news
             * selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createFundamentalThomsonReutersWin(equityPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuAddStockAlertId;
        funcObj.func = function () {
            /**
             * Add Stock Alert
             * selected StkCode get using
             */
            n2ncomponents.createAddStockAlert(equityPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuWarrantsInfoId;
        funcObj.func = function () {
            /**
             * Show Warrants Info
             * selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createWarrantsInfoWin(equityPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);
        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuStockAlertId;
        funcObj.func = function() {
        	n2ncomponents.createSMSStockAlert(equityPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);
        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuPSEEdgeId;
        funcObj.func = function() {
        	n2ncomponents.openPseEdge(equityPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);
        funcObj = new Object();
        funcObj.name = equityPrtfPanel.cMenuIBId;
        funcObj.func = function() {
        	n2ncomponents.openIBillionaire(equityPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);

        equityPrtfPanel.onContextMenuClick(funcs);

    } else {
        screenSet = epConf != null;
        n2nLayoutManager.activateItem(equityPrtfPanel);

        if (accNo) {
            equityPrtfPanel.accNo = accNo;
        }

        equityPrtfPanel.search();
    }

}

function createFundPortfolioPanel(accNo, portlet_col, index, epConf, tabCt) {

    if (global_HaveATP.toLowerCase() == 'false') {
        return;
    }

    var ex = (exchangecode == 'MY') ? 'KL' : exchangecode;

    if (mfEquityPrtfPanel == null) {
        if (!tabCt && n2nLayoutManager.activateBuffer('ep')) {
            return;
        }
        
        if (!N2N2FA.return2FAValidate('mfequityprtf', arguments, epConf, tabCt)) {
            return;
        }
        
        if (portFolioDisclaimerSessionShare.toLowerCase() == 'true') {
            if (N2NDisclaimer.chkDisclaimerValidation('createEquityPortfolioPanel', arguments)) {
                return;
            }
        } else {
            if (N2NDisclaimer.validation('createEquityPortfolioPanel', arguments)) {
                return;
            }
        }

        mfEquityPrtfPanel = Ext.widget('mfequityprtf', Ext.apply({
            title: languageFormat.getLanguage(33690, 'Mutual Fund Portfolio'),
            exchangecode: ex,
            portalType: 'large',
            displayCategory: 'auto'
        }, epConf));

        mfEquityPrtfPanel.on('beforedestroy', function () {
            mfEquityPrtfPanel = null;
        });
        
        n2nLayoutManager.addItem(mfEquityPrtfPanel, portlet_col, index, tabCt);
        n2nLayoutManager.activateItem(mfEquityPrtfPanel);
        
        var funcs = new Array();
        var funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuBuyId;
        funcObj.func = function () {
            /*
            var objRec = mfEquityPrtfPanel.cMenuObject;
            var accbranch = (mfEquityPrtfPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[0].trim() + global_AccountSeparator + (mfEquityPrtfPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[1].trim(); // #account list separator ('-')
            mfEquityPrtfPanel.accbranchNo = accbranch;
            objRec.accbranchNo = accbranch;
            */
            activateBuySellMenu(modeOrdBuy);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuSellId;
        funcObj.func = function () {
            /*
            var objRec = mfEquityPrtfPanel.cMenuObject;
            var accbranch = (mfEquityPrtfPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[0].trim() + global_AccountSeparator + (mfEquityPrtfPanel.tComboBoxAccount.getValue()).split(global_AccountSeparator)[1].trim(); // #account list separator ('-')
            mfEquityPrtfPanel.accbranchNo = accbranch;
            objRec.accbranchNo = accbranch;
            */
            activateBuySellMenu(modeOrdSell);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuDepthId;
        funcObj.func = function () {
            closedMarketDepth = false;
            createMarketDepthPanel(mfEquityPrtfPanel.cMenuStkCode, mfEquityPrtfPanel.cMenuStkName, true);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuStkInfoId;
        funcObj.func = function () {
            createStkInfoPanel(mfEquityPrtfPanel.cMenuStkCode, mfEquityPrtfPanel.cMenuStkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuChartId;
        funcObj.func = function () {
            /**
             * Apply Chart Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */

            createChartPanel(mfEquityPrtfPanel.cMenuStkCode, mfEquityPrtfPanel.cMenuStkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuStkTrackerId;
        funcObj.func = function () {
            /**
             * Apply Chart Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */

            createTrackerPanel(mfEquityPrtfPanel.cMenuStkCode, mfEquityPrtfPanel.cMenuStkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuEqTrackerId;
        funcObj.func = function () {
            n2ncomponents.createEquitiesTracker(mfEquityPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuHisDataId;
        funcObj.func = function () {
            n2ncomponents.createHistoricalData(mfEquityPrtfPanel.cMenuStkCode, mfEquityPrtfPanel.cMenuStkName);
        };
        funcs.push(funcObj);
        
        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuBrokerQId;
        funcObj.func = function() {
            n2ncomponents.createBrokerQ({key: mfEquityPrtfPanel.cMenuStkCode, name: mfEquityPrtfPanel.cMenuStkName});
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuAnalysisId;
        funcObj.func = function () {
            /**
             * Apply Chart Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */

            createAnalysisChartPanel(mfEquityPrtfPanel.cMenuStkCode, mfEquityPrtfPanel.cMenuStkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuStkNewsId;
        funcObj.func = function () {
            /**
             * Apply Stock News Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createStkNewsPanel(mfEquityPrtfPanel.cMenuStkCode, mfEquityPrtfPanel.cMenuStkName);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuArchiveNewsId;
        funcObj.func = function () {
            n2ncomponents.openArchiveNews({key: mfEquityPrtfPanel.cMenuStkCode, name: mfEquityPrtfPanel.cMenuStkName});
        };
        funcs.push(funcObj);
        
        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuElasticNewsId;
        funcObj.func = function () {
            n2ncomponents.openElasticNews({key: mfEquityPrtfPanel.cMenuStkCode, name: mfEquityPrtfPanel.cMenuStkName, newsOpt: '1'});
        };
        funcs.push(funcObj);
        
        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuNikkeiNewsId;
        funcObj.func = function () {
            n2ncomponents.openElasticNews({key: mfEquityPrtfPanel.cMenuStkCode, name: mfEquityPrtfPanel.cMenuStkName, newsOpt: '2'});
        };
        funcs.push(funcObj);
        
        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuNews2Id;
        funcObj.func = function () {
            menuHandler.openNews('', mfEquityPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuFundamentalCPIQId;
        funcObj.func = function () {
            /**
             * Show Fundamental CPIQ news
             * selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createFundamentalCPIQWin(mfEquityPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuFundamentalThomsonReutersId;
        funcObj.func = function () {
            /**
             * Show Fundamental Thomson Reuters news
             * selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createFundamentalThomsonReutersWin(mfEquityPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuAddStockAlertId;
        funcObj.func = function () {
            /**
             * Add Stock Alert
             * selected StkCode get using
             */
            n2ncomponents.createAddStockAlert(mfEquityPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuWarrantsInfoId;
        funcObj.func = function () {
            /**
             * Show Warrants Info
             * selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createWarrantsInfoWin(mfEquityPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);
        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuStockAlertId;
        funcObj.func = function() {
            n2ncomponents.createSMSStockAlert(mfEquityPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);
        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuPSEEdgeId;
        funcObj.func = function() {
            n2ncomponents.openPseEdge(mfEquityPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);
        funcObj = new Object();
        funcObj.name = mfEquityPrtfPanel.cMenuIBId;
        funcObj.func = function() {
            n2ncomponents.openIBillionaire(mfEquityPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);

        mfEquityPrtfPanel.onContextMenuClick(funcs);

    } else {
        screenSet = epConf != null;
        n2nLayoutManager.activateItem(mfEquityPrtfPanel);

        if (accNo) {
            mfEquityPrtfPanel.accNo = accNo;
        }

        mfEquityPrtfPanel.search();
    }

}

function createCFDHoldingsPanel(accNo, portlet_col, index, cfdhConf, tabCt){
	if (global_HaveATP.toLowerCase() == 'false') {
        return;
    }

    if (cfdHoldingsPanel == null) {
        if (!tabCt && n2nLayoutManager.activateBuffer('cfdh')) {
            return;
        }
        
        if (!N2N2FA.return2FAValidate('cfdHoldingsPanel', arguments, cfdhConf, tabCt)) {
            return;
        }
            
        if (portFolioDisclaimerSessionShare.toLowerCase() == 'true') {
            if (N2NDisclaimer.chkDisclaimerValidation('createCFDHoldingsPanel', arguments)) {
                return;
            }
        } else {
            if (N2NDisclaimer.validation('createCFDHoldingsPanel', arguments)) {
                return;
            }
        }

        cfdHoldingsPanel = Ext.widget('cfdHoldings', Ext.apply({
            portalType: 'large',
            displayCategory: 'auto'
        }, cfdhConf));

        cfdHoldingsPanel.on('beforedestroy', function () {
        	cfdHoldingsPanel = null;
        });

        n2nLayoutManager.addItem(cfdHoldingsPanel, portlet_col, index, tabCt);
    } else {
        screenSet = cfdhConf != null;
        if (accNo) {
        	cfdHoldingsPanel.accNo = accNo;
        }
    }

    n2nLayoutManager.activateItem(cfdHoldingsPanel);
    cfdHoldingsPanel.refresh();
}

function createEquityManualPortFolioPanel(accNo, portlet_col, index, empConf, tabCt) {

    if (global_HaveATP.toLowerCase() == 'false') {
        return;
    }

    var ex = (exchangecode == 'MY') ? 'KL' : exchangecode;

    if (equityManualPrtfPanel == null) {
        if (!tabCt && n2nLayoutManager.activateBuffer('emp')) {
            return;
        }

        if (!N2N2FA.return2FAValidate('manualPrtf', arguments, empConf, tabCt)) {
            return;
        }
        if (portFolioDisclaimerSessionShare.toLowerCase() == 'true') {
            if (N2NDisclaimer.chkDisclaimerValidation('createEquityManualPortFolioPanel', arguments)) {
                return;
            }
        } else {
            if (N2NDisclaimer.validation('createEquityManualPortFolioPanel', arguments)) {
                return;
            }
        }

        equityManualPrtfPanel = Ext.widget('equityprtf', Ext.apply({
            exchangecode: ex,
            slcomp: 'emp',
            type: 'emp',
            portalType: 'large',
            title: languageFormat.getLanguage(20296, 'Manual Portfolio'),
            displayCategory: 'manual',
            id: Ext.id()
        }, empConf));

        equityManualPrtfPanel.on('beforedestroy', function() {
            equityManualPrtfPanel = null;
        });

        n2nLayoutManager.addItem(equityManualPrtfPanel, portlet_col, index, tabCt);
        n2nLayoutManager.activateItem(equityManualPrtfPanel);

        var funcs = new Array();
        var funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuBuyId;
        funcObj.func = function() {
            activateBuySellMenu(modeOrdBuy);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuSellId;
        funcObj.func = function() {
            activateBuySellMenu(modeOrdSell);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuDepthId;
        funcObj.func = function() {
            /**
             * Apply Market Depth Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            closedMarketDepth = false;
            createMarketDepthPanel(equityManualPrtfPanel.cMenuStkCode, equityManualPrtfPanel.cMenuStkName, true);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuStkInfoId;
        funcObj.func = function() {
            createStkInfoPanel(equityManualPrtfPanel.cMenuStkCode, equityManualPrtfPanel.cMenuStkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuChartId;
        funcObj.func = function() {
            /**
             * Apply Chart Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */

            createChartPanel(equityManualPrtfPanel.cMenuStkCode, equityManualPrtfPanel.cMenuStkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuStkTrackerId;
        funcObj.func = function() {
            /**
             * Apply Chart Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */

            createTrackerPanel(equityManualPrtfPanel.cMenuStkCode, equityManualPrtfPanel.cMenuStkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuEqTrackerId;
        funcObj.func = function() {
            n2ncomponents.createEquitiesTracker(equityManualPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuHisDataId;
        funcObj.func = function() {
            n2ncomponents.createHistoricalData(equityManualPrtfPanel.cMenuStkCode, equityManualPrtfPanel.cMenuStkName);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuBrokerQId;
        funcObj.func = function() {
            n2ncomponents.createBrokerQ({key: equityManualPrtfPanel.cMenuStkCode, name: equityManualPrtfPanel.cMenuStkName});
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuAnalysisId;
        funcObj.func = function() {
            /**
             * Apply Chart Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */

            createAnalysisChartPanel(equityManualPrtfPanel.cMenuStkCode, equityManualPrtfPanel.cMenuStkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuStkNewsId;
        funcObj.func = function() {
            /**
             * Apply Stock News Logic, To Get selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createStkNewsPanel(equityManualPrtfPanel.cMenuStkCode, equityManualPrtfPanel.cMenuStkName);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuArchiveNewsId;
        funcObj.func = function() {
            n2ncomponents.openArchiveNews({key: equityManualPrtfPanel.cMenuStkCode, name: equityManualPrtfPanel.cMenuStkName});
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuElasticNewsId;
        funcObj.func = function() {
            n2ncomponents.openElasticNews({key: equityManualPrtfPanel.cMenuStkCode, name: equityManualPrtfPanel.cMenuStkName, newsOpt: '1'});
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuNikkeiNewsId;
        funcObj.func = function() {
            n2ncomponents.openElasticNews({key: equityManualPrtfPanel.cMenuStkCode, name: equityManualPrtfPanel.cMenuStkName, newsOpt: '2'});
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuNews2Id;
        funcObj.func = function() {
            menuHandler.openNews('', equityManualPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuFundamentalCPIQId;
        funcObj.func = function() {
            /**
             * Show Fundamental CPIQ news
             * selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createFundamentalCPIQWin(equityManualPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuFundamentalThomsonReutersId;
        funcObj.func = function() {
            /**
             * Show Fundamental Thomson Reuters news
             * selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createFundamentalThomsonReutersWin(equityManualPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuAddStockAlertId;
        funcObj.func = function() {
            /**
             * Add Stock Alert
             * selected StkCode get using
             */
            n2ncomponents.createAddStockAlert(equityManualPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuWarrantsInfoId;
        funcObj.func = function() {
            /**
             * Show Warrants Info
             * selected StkCode get using
             * marketMoverPanel.contextMenu.stkCode
             */
            createWarrantsInfoWin(equityManualPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);
        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuStockAlertId;
        funcObj.func = function() {
            n2ncomponents.createSMSStockAlert(equityManualPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);
        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuPSEEdgeId;
        funcObj.func = function() {
            n2ncomponents.openPseEdge(equityManualPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);
        funcObj = new Object();
        funcObj.name = equityManualPrtfPanel.cMenuIBId;
        funcObj.func = function() {
            n2ncomponents.openIBillionaire(equityManualPrtfPanel.cMenuStkCode);
        };
        funcs.push(funcObj);

        equityManualPrtfPanel.onContextMenuClick(funcs);
    } else {
        n2nLayoutManager.activateItem(equityManualPrtfPanel);
        if (accNo) {
            equityManualPrtfPanel.accNo = accNo;
        }

        equityManualPrtfPanel.search();
    }

}

function createEquityPortfolioRealizedGainLossPanel(accNo, portlet_col, index, rpConf, tabCt) {
    if (global_HaveATP.toLowerCase() == 'false') {
        return;
    }

    var ex = (exchangecode == 'MY') ? 'KL' : exchangecode;

    if (equityPrtfRealizedPanel == null) {
        if (!tabCt && n2nLayoutManager.activateBuffer('rp')) {
            return;
        }
        
        if (!N2N2FA.return2FAValidate('realizedGL', arguments, rpConf, tabCt)) {
            return;
        }
        
        if (portFolioDisclaimerSessionShare.toLowerCase() == 'true') {
            if (N2NDisclaimer.chkDisclaimerValidation('createEquityPortfolioRealizedGainLossPanel', arguments)) {
                return;
            }
        } else {
            if (N2NDisclaimer.validation('createEquityPortfolioRealizedGainLossPanel', arguments)) {
                return;
            }
        }
        
        equityPrtfRealizedPanel = Ext.widget('equityprtfrealized', Ext.apply({
            exchangecode: ex,
            portalType: 'large'
        }, rpConf));

        equityPrtfRealizedPanel.on('itemdblclick', function (grid, record, item, ridx, e) {
            if (!touchMode && singleClickMode == "FALSE") {
                // updateActivePanel(grid, ridx, null);
                // createCorporateNewsAction(grid, ridx);
            }
        });

        equityPrtfRealizedPanel.on('cellclick', function (grid, td, cidx, record, tr, ridx, e) {
            if (touchMode || singleClickMode == "TRUE") {
                // updateActivePanel(grid, ridx, cidx);
                // createCorporateNewsAction(grid, ridx);
            }
        });

        equityPrtfRealizedPanel.on('beforedestroy', function () {
            equityPrtfRealizedPanel = null;
        });

        n2nLayoutManager.addItem(equityPrtfRealizedPanel, portlet_col, index, tabCt);
        n2nLayoutManager.activateItem(equityPrtfRealizedPanel);

        var funcs = new Array();
        var funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuBuyId;
        funcObj.func = function () {
            activateBuySellMenu(modeOrdBuy);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuSellId;
        funcObj.func = function () {
            activateBuySellMenu(modeOrdSell);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuDepthId;
        funcObj.func = function () {
            closedMarketDepth = false;
            createMarketDepthPanel(equityPrtfRealizedPanel.contextMenu.stkCode, equityPrtfRealizedPanel.contextMenu.stkName, true);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuStkInfoId;
        funcObj.func = function () {
            createStkInfoPanel(equityPrtfRealizedPanel.contextMenu.stkCode, equityPrtfRealizedPanel.contextMenu.stkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuChartId;
        funcObj.func = function () {
            createChartPanel(equityPrtfRealizedPanel.contextMenu.stkCode, equityPrtfRealizedPanel.contextMenu.stkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuStkTrackerId;
        funcObj.func = function () {
            createTrackerPanel(equityPrtfRealizedPanel.contextMenu.stkCode, equityPrtfRealizedPanel.contextMenu.stkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuEqTrackerId;
        funcObj.func = function () {
            n2ncomponents.createEquitiesTracker(equityPrtfRealizedPanel.contextMenu.stkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuHisDataId;
        funcObj.func = function () {
            n2ncomponents.createHistoricalData(equityPrtfRealizedPanel.contextMenu.stkCode, equityPrtfRealizedPanel.contextMenu.stkName);
        };
        funcs.push(funcObj);
        
        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuBrokerQId;
        funcObj.func = function () {
            n2ncomponents.createBrokerQ({key: equityPrtfRealizedPanel.contextMenu.stkCode, name: equityPrtfRealizedPanel.contextMenu.stkName});
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuAnalysisId;
        funcObj.func = function () {
            createAnalysisChartPanel(equityPrtfRealizedPanel.contextMenu.stkCode, equityPrtfRealizedPanel.contextMenu.stkName, false);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuStkNewsId;
        funcObj.func = function () {
            createStkNewsPanel(equityPrtfRealizedPanel.contextMenu.stkCode, equityPrtfRealizedPanel.contextMenu.stkName);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuStkNewsArchiveId;
        funcObj.func = function () {
            n2ncomponents.openArchiveNews({key: equityPrtfRealizedPanel.contextMenu.stkCode, name: equityPrtfRealizedPanel.contextMenu.stkName});
        };
        funcs.push(funcObj);
        
        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuStkNewsElasticId;
        funcObj.func = function () {
            n2ncomponents.openElasticNews({key: equityPrtfRealizedPanel.contextMenu.stkCode, name: equityPrtfRealizedPanel.contextMenu.stkName, newsOpt: '1'});
        };
        funcs.push(funcObj);
        
        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuNews2Id;
        funcObj.func = function () {
            menuHandler.openNews('', equityPrtfRealizedPanel.contextMenu.stkCode);
        };
        funcs.push(funcObj);
        
        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuStkNewsNikkeiId;
        funcObj.func = function () {
            n2ncomponents.openElasticNews({key: equityPrtfRealizedPanel.contextMenu.stkCode, name: equityPrtfRealizedPanel.contextMenu.stkName, newsOpt: '2'});
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuFundamentalCPIQId;
        funcObj.func = function () {
            createFundamentalCPIQWin(equityPrtfRealizedPanel.contextMenu.stkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuFundamentalThomsonReutersId;
        funcObj.func = function () {
            createFundamentalThomsonReutersWin(equityPrtfRealizedPanel.contextMenu.stkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuAddStockAlertId;
        funcObj.func = function () {
            n2ncomponents.createAddStockAlert(equityPrtfRealizedPanel.contextMenu.stkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuWarrantsInfoId;
        funcObj.func = function () {
            createWarrantsInfoWin(equityPrtfRealizedPanel.contextMenu.stkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuStockAlertId;
        funcObj.func = function() {
        	n2ncomponents.createSMSStockAlert(equityPrtfRealizedPanel.contextMenu.stkCode);
        };
        funcs.push(funcObj);
        
        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuPSEEdgeId;
        funcObj.func = function() {
        	n2ncomponents.openPseEdge(equityPrtfRealizedPanel.contextMenu.stkCode);
        };
        funcs.push(funcObj);

        funcObj = new Object();
        funcObj.name = equityPrtfRealizedPanel.menuIBId;
        funcObj.func = function() {
        	n2ncomponents.openIBillionaire(equityPrtfRealizedPanel.contextMenu.stkCode);
        };
        funcs.push(funcObj);

        equityPrtfRealizedPanel.onContextMenuClick(funcs);

    } else {
        screenSet = rpConf != null;
        n2nLayoutManager.activateItem(equityPrtfRealizedPanel);
        if (accNo)
            equityPrtfRealizedPanel.accNo = accNo;

        equityPrtfRealizedPanel.search();
    }
}

function createTrackerPanel(stkcode, stkname, replace, portlet_col, index1, tkConf, tabCt) {
    replace = true;
    
    if (!tabCt && n2nLayoutManager.activateBuffer('tr', stkcode, stkname)) {
        return;
    }
    
    /*
    if (!tabCt && (jsutil.isEmpty(stkcode) || jsutil.isEmpty(stkname))) {
        // if (!tkConf || !tkConf.tConf || !tkConf.tConf.pos0) {
        msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
        return;
        // }
    }
    */
    
    if (jsutil.isEmpty(stkcode)) {
        stkcode = '';
    }
    if (jsutil.isEmpty(stkname)) {
        stkname = '';
    }
    
    if (trackerPanels == null)
        trackerPanels = [];

    var createNew = false;

    if (trackerPanels.length > 0) {

        if (replace) {
            var tempTracker = trackerPanels[0];
            tempTracker.setCode(stkcode, stkname);
            tempTracker.setLayoutSet();
            n2nLayoutManager.activateItem(tempTracker);
            tempTracker.newOpen = false;
            tempTracker.procCallTitle();

        } else {
            var isExist = false;
            for (var i = 0; i < trackerPanels.length; i++) {
                var tempTrackerPanel = trackerPanels[i];
                if (tempTrackerPanel.stkcode == stkcode) {
                    isExist = true;
                }
            }

            if (!isExist) {
                createNew = true;
            }
        }

    } else {
        createNew = true;
    }

    if (createNew) {
        sessionStorage.removeItem('trackerChart');
        
        var trackerId = Ext.id();
        var trackerTitle = languageFormat.getLanguage(20095, 'Tracker');

        var index = trackerTitle.lastIndexOf('.');
        if (index != -1) {
            trackerTitle = trackerTitle.substring(0, index);
        }

        var newTracker = Ext.widget('tracker', Ext.apply({
            id: trackerId,
            portalType: 'large',
            title: trackerTitle,
            stkcode: stkcode,
            stkname: stkname,
            key: stkcode,
            exch: stockutil.getExchange(stkcode),
            isMf: isMf(stockutil.getExchange(stkcode)),
            parentCt: portlet_col,
            autoLoad: true,
            newOpen: tkConf == null
        }, tkConf));
        
        newTracker.on('beforedestroy', function (panel) {
            for (var i = 0; i < trackerPanels.length; i++) {
                var tkPanel = trackerPanels[i];
                if (tkPanel.id == panel.id) {
                    trackerPanels.splice(i, 1);
                    newTracker = null;
                    break;
                }
            }
        });

        n2nLayoutManager.addItem(newTracker, portlet_col, index1, tabCt);
        n2nLayoutManager.activateItem(newTracker);
        trackerPanels.push(newTracker);
        n2ncomponents.addEmptyScreen(newTracker);
    } else {
        screenSet = tkConf != null;
    }

}

function createOrdLogPanel(portlet_col, idx) {
    if (!orderLogPanel) {
        orderLogPanel = Ext.widget('orderlog');
        orderLogPanel.on('beforedestroy', function () {
            orderLogPanel = null;
        });
        n2nLayoutManager.addItem(orderLogPanel, portlet_col, idx);
        n2nLayoutManager.activateItem(orderLogPanel);
    } else {
        n2nLayoutManager.activateItem(orderLogPanel);
        orderLogPanel.callOrdLog();
    }

}

function createOrderDetailPanel(ordno, tktno, stkname, replace, type, searchDate, accno, portlet_col, idx) {
    if (global_HaveATP.toLowerCase() == 'false') {
        return;
    }

    if (!ordDetailPanel) {
        ordDetailPanel = Ext.widget("orderdetail", {
            portalType: 'large',
            title: languageFormat.getLanguage(20175, 'Order Detail')
        });

        n2nLayoutManager.addItem(ordDetailPanel, portlet_col, idx);
        ordDetailPanel.on('beforedestroy', function () {
            ordDetailPanel = null;
        });
    }

    n2nLayoutManager.activateItem(ordDetailPanel);
    if ((ordno && ordno.length > 0) || (tktno && tktno.length > 0)) {
        ordDetailPanel.ordno = ordno;
        ordDetailPanel.tktno = tktno;
        ordDetailPanel.searchdate = searchDate;

        if (!jsutil.isEmpty(accno)) {
            var accountName = (accno).split('-');
            ordDetailPanel.accno = accountName[0].trim();
            ordDetailPanel.accBranchCode = accountName [accountName.length - 1].trim();
        }

        if (type == 'ordHistPanel') {
            ordDetailPanel.callOrdHistoryDetail();
        } else {
            ordDetailPanel.callOrdDetail();
        }
    }

}

function createOrdHistoryPanel(portlet_col, index, ohConf, tabCt) {
    if (!tabCt && n2nLayoutManager.activateBuffer('oh')) {
        return;
    }

    if (global_HaveATP.toLowerCase() == 'false' || !N2N2FA.return2FAValidate('ordHistory', arguments, ohConf, tabCt)) {
        return;
    }

    if (!orderHistoryPanel) {
        orderHistoryPanel = Ext.widget('orderhistory', Ext.apply({}, ohConf));
        n2nLayoutManager.addItem(orderHistoryPanel, portlet_col, index, tabCt);
        n2nLayoutManager.activateItem(orderHistoryPanel);

        Ext.getCmp('ord_log').enable();
    } else {
        n2nLayoutManager.activateItem(orderHistoryPanel);
    }

}

function createMFOrdHistoryPanel(portlet_col, index, ohConf, tabCt) {
    if (!tabCt && n2nLayoutManager.activateBuffer('mfoh')) {
        return;
    }

    if (global_HaveATP.toLowerCase() == 'false' || !N2N2FA.return2FAValidate('mfOrdHistory', arguments, ohConf, tabCt)) {
        return;
    }

    if (!mfOrderHistoryPanel) {
        mfOrderHistoryPanel = Ext.widget('mforderhistory', Ext.apply({
            portalType: 'large',
            title: languageFormat.getLanguage(20245, 'Mutual Fund Order History'),
        }, ohConf));
        n2nLayoutManager.addItem(mfOrderHistoryPanel, portlet_col, index, tabCt);
        n2nLayoutManager.activateItem(mfOrderHistoryPanel);

        Ext.getCmp('ord_log').enable();
    } else {
        n2nLayoutManager.activateItem(mfOrderHistoryPanel);
    }

}

function createNewsPanel(portlet_col, index, anConf, tabCt) {
    /*
     *  update : 
     *  	
     *  	this parameter is for verify on user change exchange code or not
     *  	
     *  	if change exchange code, it will true 
     *  	else it will false 
     */
    
    if (!n2nLayoutManager.getFeatureStatus('gn')) {
        return;
    }
    
    if (newsPanel == null) {
        if (!tabCt && n2nLayoutManager.activateBuffer('gn')) {
            return;
        }
                
        // create new panel
        newsPanel = Ext.widget("generalnews", Ext.apply({}, anConf));
        newsPanel.on('beforedestroy', function () {
            newsPanel = null;
        });
        n2nLayoutManager.addItem(newsPanel, portlet_col, index, tabCt);
    } else {
        screenSet = anConf != null;
    }
    n2nLayoutManager.activateItem(newsPanel);
    newsPanel.search();
}

function createNewsContentPanel(key, stkname, replace, isAnn, portlet_col, index) {
    var winReplace = replace != null ? replace : true;
    var title = languageFormat.getLanguage(20121, 'News');
    if (stkname) {
        title += ' - ' + stkname;
    }
    var compKey = key;

    if (winReplace) {
        compKey = isAnn ? 'ann' : 'news';
    }

    if (jsutil.toBoolean(showUISettingItem[2]) && jsutil.toBoolean(global_NewWindow_News)) {
        window.open('stkNews.jsp?k=' + key + '&l=' + '&s=' + new Date().getTime(), "_blank");
    } else {
        var newsKey = 'newsReport_news_list_' + compKey;

        if (!userReport[newsKey]) {
            var newsContent = Ext.widget('newscontent', {
                key: key,
                title: title
            });

            newsContent.on('beforedestroy', function() {
                userReport[newsKey] = null;
            });

            n2nLayoutManager.addItem(newsContent, portlet_col, index);
            userReport[newsKey] = newsContent;
        } else {
            userReport[newsKey].setCode(key);
            n2nLayoutManager.updateTitle(userReport[newsKey], title);
        }

        n2nLayoutManager.activateItem(userReport[newsKey]);
    }
}

// temporary left for compatibility, will be removed
function createStkNewsPanel(stkcode, stkname, newsConf, tabCt) {
    n2ncomponents.createStockNews({
        key: stkcode,
        name: stkname,
        config: newsConf
    }, tabCt);
}

function createMarketStreamer(portlet_col, index, msConf, tabCt) {
    if (feedFilterRet != null) {
        if (marketStreamer == null) {
            if (!tabCt && n2nLayoutManager.activateBuffer('ms')) {
                return;
            }
            marketStreamer = Ext.create('widget.marketstreamer', Ext.apply({}, msConf));
            marketStreamer.on('beforedestroy', function() {
                if (!marketStreamer.inactive) {
                    marketStreamer.unsubscribe();
                }
                marketStreamer = null;
            });
            if (!portlet_col) {
                portlet_col = portalcol_2;
            }
            n2nLayoutManager.addItem(marketStreamer, portlet_col, index, tabCt);
        } else {
            screenSet = msConf != null;
        }

        n2nLayoutManager.activateItem(marketStreamer);
    }
}

function createTrackerRecord(portlet_col, index, tdConf, tabCt) {
    if (feedFilterRet != null) {
        if (!trackerRecord) {
            if (!tabCt && n2nLayoutManager.activateBuffer('td')) {
                return;
            }

            trackerRecord = Ext.create('widget.trackerrecord', Ext.apply({}, tdConf));
            trackerRecord.on('beforedestroy', function() {
                if (!trackerRecord.inactive) {
                    trackerRecord.unsubscribe();
                }
                trackerRecord = null;
            });

            if (!portlet_col) {
                portlet_col = portalcol_2;
            }
            n2nLayoutManager.addItem(trackerRecord, portlet_col, index, tabCt);
        } else {
            screenSet = tdConf != null;
        }

        n2nLayoutManager.activateItem(trackerRecord);
    }
}

function createWarrantsInfoWin(stkcode, portlet_col) {
    if (jsutil.isEmpty(stkcode)) {
        msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
        return;
    }
    
    if (stkcode != '') {
        var tempstkcode = stkcode.substring(0, stkcode.lastIndexOf('.'));

        //if ( global_NewWindow_News.toLowerCase() == 'true'){
        if (jsutil.toBoolean(showUISettingItem[2]) && jsutil.toBoolean(global_NewWindow_News)) {


            if (window.name == "_warrants_info")
                window.name = "";

            msgutil.openURL({
                url: warrantsInfoURL + '?ExchCode=' + exchangecode + '&StkCode=' + tempstkcode,
                name: '_warrants_info'
            });
        } else {

            if (userReport['userReport_warrants_info'] == null) {
                var tempTab = Ext.create('Ext.ux.IFrame', {
                    title: languageFormat.getLanguage(20130, 'Warrants Info'),
                    id: 'userReport_warrants_info',
                    slcomp: "wi",
                    // height: !n2nLayoutManager.isTabLayout() ? 310 : quoteScreen.up().up().body.getHeight() - 2,
                    url: warrantsInfoURL + '?ExchCode=' + exchangecode + '&StkCode=' + tempstkcode,
                    iframeScroll: true,
                    initMax: true
                });

                tempTab.on('beforedestroy', function () {
                    userReport[ 'userReport_warrants_info' ] = null;
                });

                addTab(tabPanel1, tempTab, true, '', false);
                tempTab.refresh(tempTab.url);

                userReport[ 'userReport_warrants_info' ] = tempTab;

            } else {

//				userReport[ 'userReport_warrants_info' ].url = warrantsInfoURL + '?ExchCode=' + exchangecode + '&StkCode=' + tempstkcode;
                userReport[ 'userReport_warrants_info' ].refresh(warrantsInfoURL + '?ExchCode=' + exchangecode + '&StkCode=' + tempstkcode);

                for (var i = 0; i < tabPanel1.items.length; i++) {
                    var tempComponent = tabPanel1.getComponent(i).getComponent(0);

                    if (tempComponent.id == 'userReport_warrants_info') {
                        tabPanel1.setActiveTab(i);
                        break;
                    }
                }
            }
        }

    } else {
        msgutil.alert(languageFormat.getLanguage(30116, 'Fail to retrieve stock code'));
    }
}

function createFundamentalCPIQWin(stkcode, stkname, conf, tabCt) {
	if (!tabCt && n2nLayoutManager.activateBuffer('fc', stkcode, stkname)) {
        return;
    }
	
    if (jsutil.isEmpty(stkcode)) {
        msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
        return;
    }
        
    if (stkcode != '') {
        // removes delay
        stkcode = stockutil.removeStockDelay(stkcode);
        var exch = stockutil.getExchange(stkcode);
        
        var params = [
                      'Type=' + N2N_CONFIG.fundamentalCPIQType,
                      'SourceCode=' + N2N_CONFIG.fundamentalCPIQPrefix,
                      'StkCode=' + stkcode,
                      'Sponsor=' + N2N_CONFIG.fundamentalSponsor,
                      'ExchCode=' + exch,
                      's=' + new Date().getTime(),
                      'ft=' + gl_fonttype,
                      'fs=' + globalFontSize,
                      'lang=' + global_Language,
                      'color=' + formatutils.procThemeColor()
                  ];

        //var fundURL = N2N_CONFIG.fundamentalURL + '?Type=' + N2N_CONFIG.fundamentalCPIQType + '&SourceCode=' + N2N_CONFIG.fundamentalCPIQPrefix + '&StkCode=' + stkcode + '&Sponsor=' + N2N_CONFIG.fundamentalSponsor + '&ExchCode=' + exch + '&s=' + new Date().getTime();
        var fundURL = helper.addUrlParams(N2N_CONFIG.fundamentalURL, params.join('&'));
        
        if (jsutil.toBoolean(showUISettingItem[2]) && jsutil.toBoolean(global_NewWindow_News)) {
            if (window.name == "_fundamental_cpiq")
                window.name = "";

            msgutil.openURL({
                url: fundURL,
                name: '_fundamental_cpiq'
            });
        } else {
            var fundCpIq = userReport['userReport_fundamental_cpiq'];
            if (fundCpIq == null) {
                fundCpIq = Ext.create('Ext.ux.IFrame', Ext.apply({
                    title: languageFormat.getLanguage(20124, 'Fundamental (Capital IQ)'),
                    slcomp: "fc",
                    type: 'fc',
                    savingComp: true,
                    ddComp: true,
                    winConfig: getNewsWinConfig(),
                    initMax: true,
                    refreshScreen: true,
                    switchRefresh: function() {
                        var fd = this;

                        if (fd._needReload) {
                            createFundamentalCPIQWin(fd.key, fd.stkname);
                            fd._needReload = false;
                        }
                    },
                    syncBuffer: function(stkcode, stkname) {
                        var fd = this;

                        // update key and title
                        fd.updateKey(stkcode, stkname);

                        fd._needReload = true;
                    }
                }, conf));

                fundCpIq.on('beforedestroy', function () {
                    userReport[ 'userReport_fundamental_cpiq' ] = null;
                });

                n2nLayoutManager.addItem(fundCpIq, null, null, tabCt);
                userReport[ 'userReport_fundamental_cpiq' ] = fundCpIq;
            }
            
            // update key
        	fundCpIq.updateKey(stkcode, stkname);
            n2nLayoutManager.activateItem(fundCpIq);
            helper.runAfterCompRendered(fundCpIq, function() {
            	fundCpIq.refresh(fundURL);
                fundCpIq.firstLoad = false;
            });
        }
    } else {
        msgutil.alert(languageFormat.getLanguage(30115, 'We regret to inform that we are unable to retrieve your stock code at this time. Kindly try again shortly.'));
    }

}
function createKafChartNews(portlet_col, index) {
    var URL = kafChartResearchLinkUrl;
    if (jsutil.toBoolean(showUISettingItem[2]) && jsutil.toBoolean(global_NewWindow_News)) {
        if (window.name == "kafChartResearchLink_News")
            window.name = "";

        window.open(URL, 'kafChartResearchLink_News').focus();
    } else {
        var fundScr = userReport['kafChartResearchLink_News'];
        if (fundScr == null) {
            fundScr = Ext.create('Ext.ux.IFrame', {
                title: languageFormat.getLanguage(20125, 'KafChartResearchLink'),
                slcomp: "kaf",
                winConfig: getNewsWinConfig(),
                initMax: true
            });

            fundScr.on('beforedestroy', function () {
                userReport[ 'kafChartResearchLink_News' ] = null;
            });

            n2nLayoutManager.addItem(fundScr, portlet_col, index);
            userReport[ 'kafChartResearchLink_News' ] = fundScr;
        }

        n2nLayoutManager.activateItem(fundScr);
        fundScr.refresh(URL);
    }

}
function createFundamentalScreenerCPIQWin(conf, tabCt) {
	if (!tabCt && n2nLayoutManager.activateBuffer('fcs')) {
        return;
    }
	
    if (!isValidFundExch()) {
        msgutil.alert(languageFormat.getLanguage(10043, 'Not available.'));
        return;
    }
    
    var params = [
                  'Type=' + N2N_CONFIG.fundamentalCPIQScreenerType,
                  'SourceCode=' + N2N_CONFIG.fundamentalCPIQPrefix,
                  'Sponsor=' + N2N_CONFIG.fundamentalSponsor,
                  's=' + new Date().getTime(),
                  'ft=' + gl_fonttype,
                  'fs=' + globalFontSize,
                  'lang=' + global_Language,
                  'color=' + formatutils.procThemeColor()
              ];
    
    //var fundScrURL = N2N_CONFIG.fundamentalScreenerURL + '?Type=' + N2N_CONFIG.fundamentalCPIQScreenerType + '&SourceCode=' + N2N_CONFIG.fundamentalCPIQPrefix + '&Sponsor=' + N2N_CONFIG.fundamentalSponsor + '&s=' + new Date().getTime();
    var fundScrURL = helper.addUrlParams(N2N_CONFIG.fundamentalScreenerURL, params.join('&'));
    
    if (jsutil.toBoolean(showUISettingItem[2]) && jsutil.toBoolean(global_NewWindow_News)) {
        if (window.name == "_fundamental_screener_cpiq")
            window.name = "";

        msgutil.openURL({
            url: fundScrURL,
            name: '_fundamental_screener_cpiq'
        });
    } else {
        var fundScr = userReport['userReport_fundamental_screener_cpiq'];
        if (fundScr == null) {
            fundScr = Ext.create('Ext.ux.IFrame', Ext.apply({
                title: languageFormat.getLanguage(20125, 'Fundamental Screener (Capital IQ)'),
                type: "fcs",
                savingComp: true,
                winConfig: getNewsWinConfig(),
                initMax: true
            }, conf));

            fundScr.on('beforedestroy', function () {
                userReport[ 'userReport_fundamental_screener_cpiq' ] = null;
            });

            n2nLayoutManager.addItem(fundScr, null, null, tabCt);
            userReport[ 'userReport_fundamental_screener_cpiq' ] = fundScr;
        }

        n2nLayoutManager.activateItem(fundScr);
        helper.runAfterCompRendered(fundScr, function() {
        	fundScr.refresh(fundScrURL);
        });
    }
}

function createFundamentalThomsonReutersWin(stkcode, stkname, conf, tabCt) {
	if (!tabCt && n2nLayoutManager.activateBuffer('ft', stkcode, stkname)) {
        return;
    }
	
    if (jsutil.isEmpty(stkcode)) {
        msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
        return;
    }
    
    if (stkcode != '') {
        // removes delay
        stkcode = stockutil.removeStockDelay(stkcode);
        var exch = stockutil.getExchange(stkcode);

        var params = [
                      'Type=' + N2N_CONFIG.fundamentalThomsonReutersType,
                      'SourceCode=' + N2N_CONFIG.fundamentalThomsonReutersPrefix,
                      'StkCode=' + stkcode,
                      'Sponsor=' + N2N_CONFIG.fundamentalSponsor,
                      'ExchCode=' + exch,
                      's=' + new Date().getTime(),
                      'ft=' + gl_fonttype,
                      'fs=' + globalFontSize,
                      'lang=' + global_Language,
                      'color=' + formatutils.procThemeColor()
                  ];
        
        //var fundTrURL = N2N_CONFIG.fundamentalURL + '?Type=' + N2N_CONFIG.fundamentalThomsonReutersType + '&SourceCode=' + N2N_CONFIG.fundamentalThomsonReutersPrefix + '&StkCode=' + stkcode + '&Sponsor=' + N2N_CONFIG.fundamentalSponsor + '&ExchCode=' + exch + '&s=' + new Date().getTime();
        var fundTrURL = helper.addUrlParams(N2N_CONFIG.fundamentalURL, params.join('&'));

        if (jsutil.toBoolean(showUISettingItem[2]) && jsutil.toBoolean(global_NewWindow_News)) {
            if (window.name == "_fundamental_tomsonreuters")
                window.name = "";

            msgutil.openURL({
                url: fundTrURL,
                name: '_fundamental_tomsonreuters'
            });
        } else {
            var fundTr = userReport['userReport_fundamental_tomsonreuters'];
            if (fundTr == null) {
                fundTr = Ext.create('Ext.ux.IFrame', Ext.apply({
                    title: languageFormat.getLanguage(20126, 'Fundamental (Thomson Reuters)'),
                    slcomp: "ft",
                    type: 'ft',
                    ddComp: true,
                    savingComp: true,
                    winConfig: getNewsWinConfig(),
                    initMax: true,
                    key: stkcode,
                    stkname: stkname
                }, conf));

                fundTr.on('beforedestroy', function () {
                    userReport[ 'userReport_fundamental_tomsonreuters' ] = null;
                });

                //n2nLayoutManager.addItem(fundTr, portlet_col, index);
                userReport[ 'userReport_fundamental_tomsonreuters' ] = fundTr;
                
                n2nLayoutManager.addItem(fundTr, null, null, tabCt);
            }
            
            // update key
        	fundTr.updateKey(stkcode, stkname);
            n2nLayoutManager.activateItem(fundTr);
            helper.runAfterCompRendered(fundTr, function() {
            	fundTr.refresh(fundTrURL);
            });
        }

    } else {
        msgutil.alert(languageFormat.getLanguage(30115, 'We regret to inform that we are unable to retrieve your stock code at this time. Kindly try again shortly.'));
    }
}

function createFundamentalScreenerThomsonReutersWin(conf, tabCt) {
	if (!tabCt && n2nLayoutManager.activateBuffer('fst')) {
        return;
    } 
	
	var params = [
                  'Type=' + N2N_CONFIG.fundamentalThomsonReutersScreenerType,
                  'SourceCode=' + N2N_CONFIG.fundamentalThomsonReutersPrefix,
                  'Sponsor=' + N2N_CONFIG.fundamentalSponsor,
                  's=' + new Date().getTime(),
                  'ft=' + gl_fonttype,
                  'fs=' + globalFontSize,
                  'lang=' + global_Language,
                  'color=' + formatutils.procThemeColor()
              ];
    	
    //var fundScrTrURL = N2N_CONFIG.fundamentalScreenerURL + '?Type=' + N2N_CONFIG.fundamentalThomsonReutersScreenerType + '&SourceCode=' + N2N_CONFIG.fundamentalThomsonReutersPrefix + '&Sponsor=' + N2N_CONFIG.fundamentalSponsor + '&s=' + new Date().getTime();
    var fundScrTrURL = helper.addUrlParams(N2N_CONFIG.fundamentalScreenerURL, params.join('&'));
	
    if (jsutil.toBoolean(showUISettingItem[2]) && jsutil.toBoolean(global_NewWindow_News)) {
        if (window.name == "_fundamental_screener_tomsonreuters")
            window.name = "";

        msgutil.openURL({
            url: fundScrTrURL,
            name: '_fundamental_screener_tomsonreuters'
        });
    } else {
        var fundScrTr = userReport['userReport__fundamental_screener_tomsonreuters'];
        if (fundScrTr == null) {
            fundScrTr = Ext.create('Ext.ux.IFrame', Ext.apply({
                title: languageFormat.getLanguage(20127, 'Fundamental Screener (Thomson Reuters)'),
                slcomp: "fst",
                type: 'fst',
                ddComp: true,
                savingComp: true,
                winConfig: getNewsWinConfig(),
                initMax: true
            }, conf));

            fundScrTr.on('beforedestroy', function () {
                userReport[ 'userReport__fundamental_screener_tomsonreuters' ] = null;
            });

            //n2nLayoutManager.addItem(fundScrTr, portlet_col, index);
            userReport[ 'userReport__fundamental_screener_tomsonreuters' ] = fundScrTr;
            n2nLayoutManager.addItem(fundScrTr, null, null, tabCt);
        }

        n2nLayoutManager.activateItem(fundScrTr);
        helper.runAfterCompRendered(fundScrTr, function() {
        	 fundScrTr.refresh(fundScrTrURL);
        });
    }
}

function createReportSubMenu(rptSubMenus, rptSetting, isMetroMenu, portlet_col, index) {
    var rptSt = getReportSettings(rptSetting);

    var mobileMetroIcon = "";
    switch (rptSetting) {
        case webReportClientSummaryURL:
            rptSt.title = languageFormat.getLanguage(20231, rptSt.title);
            mobileMetroIcon = 'mobile-icon-submenu-client-summary';
            break;
        case webReportMonthlyStatementURL:
            rptSt.title = languageFormat.getLanguage(20232, rptSt.title);
            mobileMetroIcon = 'mobile-icon-submenu-monthly-statement';
            break;
        case webReportMarginAccountSummaryURL:
            rptSt.title = languageFormat.getLanguage(20233, rptSt.title);
            mobileMetroIcon = 'mobile-icon-submenu-margin-account';
            break;
        case webReportTraderDepositReportURL:
            rptSt.title = languageFormat.getLanguage(20234, rptSt.title);
            mobileMetroIcon = 'mobile-icon-submenu-trade-deposit';
            break;
        case webReportTradeBeyondReportURL:
            rptSt.title = languageFormat.getLanguage(20235, rptSt.title);
            mobileMetroIcon = 'mobile-icon-submenu-trade-beyond';
            break;
        case webReporteContractURL:
            rptSt.title = languageFormat.getLanguage(20236, rptSt.title);
            mobileMetroIcon = 'mobile-icon-submenu-e-contract';
            break;
        case webReportAISBeStatementURL:
            rptSt.title = languageFormat.getLanguage(20237, rptSt.title);
            mobileMetroIcon = 'mobile-icon-submenu-saisb';
            break;
        case webReportMarginPortFolioValuationURL:
            rptSt.title = languageFormat.getLanguage(20238, rptSt.title);
            mobileMetroIcon = 'mobile-icon-submenu-margin-portfolio';
            break;
        case webReportTransactionMovementURL:
            rptSt.title = languageFormat.getLanguage(20239, rptSt.title);
            mobileMetroIcon = 'mobile-icon-submenu-transaction-movement';
            break;
        case webReportClientTransactionStatementURL:
            rptSt.title = languageFormat.getLanguage(20241, rptSt.title);
            mobileMetroIcon = 'mobile-icon-submenu-client-statement';
            break;
        case webReportStockBalanceURL:
            rptSt.title = languageFormat.getLanguage(20240, rptSt.title);
            mobileMetroIcon = 'mobile-icon-submenu-stock-balance';
            break;

    }

    if (isMetroMenu) {

        if (!menuHandler.helper) {
            menuHandler.helper = {};
        }
        if (!menuHandler.helper[rptSt.id]) {
            menuHandler.helper[rptSt.id] = function () {
                menuHandler.openReport(rptSt, portlet_col, index);
            };
        }

        rptSubMenus.push({
            iconCls: mobileMetroIcon,
            menulabel: rptSt.title,
            fn: 'menuHandler.helper[\'' + rptSt.id + '\']();'
        });
    } else {
        rptSubMenus.push({
            text: rptSt.title,
            cls: 'x-menu-item-medium',
            handler: function () {
                menuHandler.openReport(rptSt, portlet_col, index);
            }
        });
    }
}

function getReportSettings(rptSetting) {
    var rptSt = rptSetting.split('|');
    var stObj = {
        title: rptSt[0],
        id: rptSt[2],
        // icon: rptSt[3],
        url: rptSt[4]
    };

    return stObj;
}

function createSettlementSubMenu(settSubMenus, settSetting, isMetroMenu, portlet_col, index) {
    var settSt = getReportSettings(settSetting);

    switch (settSetting) {
        case webESettlementURL:
        	settSt.title = languageFormat.getLanguage(21402, settSt.title);
            break;
        case webESettlementStatusURL:
        	settSt.title = languageFormat.getLanguage(21403, settSt.title);
            break;
        case webEDepositURL:
        	settSt.title = languageFormat.getLanguage(21404, settSt.title);
            break;
    }

    if (isMetroMenu) {

        if (!menuHandler.helper) {
            menuHandler.helper = {};
        }
        if (!menuHandler.helper[settSt.id]) {
            menuHandler.helper[settSt.id] = function() {
                menuHandler.openSettlement(settSt);
            };
        }

        settSubMenus.push({
            menulabel: settSt.title,
            fn: 'menuHandler.helper[\'' + settSt.id + '\']();'
        });
    } 
}

function changeFontSize(fontsize, isSaved, isFirst) {
    if (jsutil.toBoolean(showUISettingItem[5]) && !isMobile) {
        if (!isSaved || isFirst) {
            fontsize = parseInt(fontsize);
            var lineHeight = fontsize + 3;
            var rowHeight = fontsize + 5;
            var innerHeight = rowHeight + 4;
            
            changeClsStyle(".n2n .x-grid-row .x-grid-cell", "font-size:" + fontsize + "px !important;" + "height:" + rowHeight + "px;" + "line-height:" + lineHeight + "px;");
            changeClsStyle(".n2n .x-grid-cell-inner", "height:" + innerHeight + 'px');
            changeClsStyle(".n2n .x-grid-row-summary .x-grid-cell", "font-size:" + fontsize + "px !important;");
            changeClsStyle(".N2N_stockNameStyle div", "font-size:" + fontsize + "px !important;");
            
            var opFont = fontsize > 14 ? 14 : fontsize;
            var opLineHeight = lineHeight > 15 ? 15 : lineHeight;
            
            changeClsStyle(".orderpad .x-form-item-label", "font-size:" + opFont + "px !important;line-height:" + opLineHeight + 'px!important');
            changeClsStyle(".orderpad .x-form-text-default", "font-size:" + opFont + "px !important;");
            changeClsStyle(".orderpad .x-panel-body-default", "font-size:" + opFont + "px");
            changeClsStyle(".n2n .orderpad .x-btn-inner-default-small", "font-size:" + opFont + "px");
            changeClsStyle(".font-size-max-applied", "font-size:" + opFont + "px");
            changeClsStyle(".font-applied", "font-size:" + fontsize + "px");
        }
    }
}

function changeClsStyle(classname, property) {
    var currentStyle = getStyle(classname);
    Ext.util.CSS.getRule(classname, true).style["cssText"] = currentStyle + property;
}

function adjustAllColumnWidthsSettings(adjustWidth) {
    if (adjustWidth !== 0) {

        // quote columns
        for (var i = 0; i < viewExCodes.length; i++) {
            var exch = stockutil.removeDelayChar(viewExCodes[i]);
            var colKey = 'qs' + exch;
            var qck = columnWidthSaveManager.getCookieColKey('quote' + exch);
            columnWidthSaveManager.adjustAllColWidths(N2N_CONFIG.constKey + 'QS' + exch, qck, colKey, adjustWidth);
        }

        // watchlist
        var wlck = columnWidthSaveManager.getCookieColKey('watchlist');
        columnWidthSaveManager.adjustAllColWidths(N2N_CONFIG.constKey + 'WL', wlck, 'wl', adjustWidth);

        // recent quote
        var rqCk = columnWidthSaveManager.getCookieColKey('recentQuote');
        columnWidthSaveManager.adjustAllColWidths(N2N_CONFIG.constKey + 'RQ', rqCk, 'rq', adjustWidth);

        // order status
        var osCk = columnWidthSaveManager.getCookieColKey('ordStatus');
        columnWidthSaveManager.adjustAllColWidths(N2N_CONFIG.constKey + 'OS', osCk, 'os', adjustWidth);

        //mf order status
        var mfosCk = columnWidthSaveManager.getCookieColKey('mfOrdStatus');
        columnWidthSaveManager.adjustAllColWidths(N2N_CONFIG.constKey + 'MFOS', mfosCk, 'mfos', adjustWidth);

        var ohCk = columnWidthSaveManager.getCookieColKey('ordHistory');
        columnWidthSaveManager.adjustAllColWidths(N2N_CONFIG.constKey + 'OH', ohCk, 'oh', adjustWidth);

        var mfohCk = columnWidthSaveManager.getCookieColKey('mfOrdHistory');
        columnWidthSaveManager.adjustAllColWidths(N2N_CONFIG.constKey + 'MFOH', mfohCk, 'mfoh', adjustWidth);
        
        var epCk = columnWidthSaveManager.getCookieColKey('equityPrtf');
        columnWidthSaveManager.adjustAllColWidths(N2N_CONFIG.constKey + 'EP', epCk, 'ep', adjustWidth);
        
        var epCk = columnWidthSaveManager.getCookieColKey('fundPrtf');
        columnWidthSaveManager.adjustAllColWidths(N2N_CONFIG.constKey + 'FP', epCk, 'fp', adjustWidth);
     
        var rpCk = columnWidthSaveManager.getCookieColKey('realisedGL');
        columnWidthSaveManager.adjustAllColWidths(N2N_CONFIG.constKey + 'RP', rpCk, 'rp', adjustWidth);
        
        var cfdCk = columnWidthSaveManager.getCookieColKey('cfdHoldings');
        columnWidthSaveManager.adjustAllColWidths(N2N_CONFIG.constKey + 'CFD', cfdCk, 'cfd', adjustWidth);

        var trTsCk = columnWidthSaveManager.getCookieColKey('trackerTS');
        columnWidthSaveManager.adjustAllColWidths2(N2N_CONFIG.constKey + 'TRTS', trTsCk, 'trTS', adjustWidth);

        var trBsCk = columnWidthSaveManager.getCookieColKey('trackerBS');
        columnWidthSaveManager.adjustAllColWidths2(N2N_CONFIG.constKey + 'TRBS', trBsCk, 'trBS', adjustWidth);

        var sbCk = columnWidthSaveManager.getCookieColKey('scoreboard');
        columnWidthSaveManager.adjustAllColWidths2(N2N_CONFIG.constKey + 'SB', sbCk, 'sb', adjustWidth);

        var dpSmCk = columnWidthSaveManager.getCookieColKey('dpSummary');
        columnWidthSaveManager.adjustAllColWidths2(N2N_CONFIG.constKey + 'DPSM', dpSmCk, 'dpSM', adjustWidth);

        // save column width immediately
        columnWidthSaveManager.save();
    }

}

function restoreAllColumnWidthSettings() {

    for (var i = 0; i < viewExCodes.length; i++) {
        var qck = columnWidthSaveManager.getCookieColKey('quote' + stockutil.removeDelayChar(viewExCodes[i]));
        cookies.eraseCookie(qck);
    }

    // watchlist
    var wlck = columnWidthSaveManager.getCookieColKey('watchlist');
    cookies.eraseCookie(wlck);

    // recent quote
    cookies.eraseCookie(columnWidthSaveManager.getCookieColKey('recentQuote'));

    cookies.eraseCookie(columnWidthSaveManager.getCookieColKey('ordStatus'));
    cookies.eraseCookie(columnWidthSaveManager.getCookieColKey('mfOrdStatus'));
    cookies.eraseCookie(columnWidthSaveManager.getCookieColKey('ordHistory'));
    cookies.eraseCookie(columnWidthSaveManager.getCookieColKey('equityPrtf'));
    cookies.eraseCookie(columnWidthSaveManager.getCookieColKey('fundPrtf'));
    cookies.eraseCookie(columnWidthSaveManager.getCookieColKey('realisedGL'));
    cookies.eraseCookie(columnWidthSaveManager.getCookieColKey('trackerTS'));
    cookies.eraseCookie(columnWidthSaveManager.getCookieColKey('trackerBS'));
    cookies.eraseCookie(columnWidthSaveManager.getCookieColKey('scoreboard'));
    cookies.eraseCookie(columnWidthSaveManager.getCookieColKey('dpSummary'));
    
    // also need to reset failed saving column
    n2nStorage.set('colWidthObj', '{}');

}

function adjustAllGridColumnWidths(){
    // quote
    setAutoAdjustWidth(quoteScreen);
    
    // watchlist
    if (activeWatchlistArr) {
        for (var i = 0; i < activeWatchlistArr.length; i++) {
            setAutoAdjustWidth(activeWatchlistArr[i].wlpanel);
        }
    }
    
    setAutoAdjustWidth(recentQuotePanel);
    setAutoAdjustWidth(orderStatusPanel);
    setAutoAdjustWidth(mfOrderStatusPanel);
    setAutoAdjustWidth(orderHistoryPanel);
    setAutoAdjustWidth(equityPrtfPanel);
    setAutoAdjustWidth(mfEquityPrtfPanel);
    setAutoAdjustWidth(equityPrtfRealizedPanel);
    setAutoAdjustWidth(scoreBoard);
    setAutoAdjustWidth(derivativePrtfPanel);
    setAutoAdjustWidth(cfdHoldingsPanel);
    
    if (trackerPanels && trackerPanels.length > 0) {
        setAutoAdjustWidth(trackerPanels[0]);
    }
}

function setAutoAdjustWidth(comp) {
    if (comp) {
        if (helper.inView(comp)) {
            comp.autoAdjustWidth();
        } else {
            comp.runAutoAdjustWidth = true;
        }
    }
}

function adjustColWidths() {
    var diffWidth = getDiffPx();

    adjustAllDefaultWidths(diffWidth);
    adjustAllColumnWidthsSettings(diffWidth);
    adjustAllGridColumnWidths();
}

function adjustAllDefaultWidths(diffWidth) {
    if (diffWidth !== 0) {
        global_feedWidthKL = stockutil.adjustSizes(global_feedWidthKL, diffWidth);
        global_feedWidthMY = stockutil.adjustSizes(global_feedWidthMY, diffWidth);
        global_feedWidthHK = stockutil.adjustSizes(global_feedWidthHK, diffWidth);
        global_feedWidthSI = stockutil.adjustSizes(global_feedWidthSI, diffWidth);
        global_feedWidthOth = stockutil.adjustSizes(global_feedWidthOth, diffWidth);
        global_MDWidthKL = stockutil.adjustSizes(global_MDWidthKL, diffWidth);
        global_MDWidthMY = stockutil.adjustSizes(global_MDWidthMY, diffWidth);
        global_MDWidthHK = stockutil.adjustSizes(global_MDWidthHK, diffWidth);
        global_MDWidthOth = stockutil.adjustSizes(global_MDWidthOth, diffWidth);
        global_WLWidth = stockutil.adjustSizes(global_WLWidth, diffWidth);
        global_OSWidth = stockutil.adjustSizes(global_OSWidth, diffWidth);
        global_PFWidth = stockutil.adjustSizes(global_PFWidth, diffWidth);
        global_RGLWidth = stockutil.adjustSizes(global_RGLWidth, diffWidth);
        N2N_CONFIG.scoreColWidth = stockutil.adjustSizes(N2N_CONFIG.scoreColWidth, diffWidth);
        N2N_CONFIG.dpColWidth = stockutil.toColWidthConfig2(N2N_CONFIG.dpColWidth, diffWidth);
        
        N2N_CONFIG.trackerTSCol = stockutil.toColWidthConfig2(N2N_CONFIG.trackerTSCol, diffWidth);
        N2N_CONFIG.trackerBSCol = stockutil.toColWidthConfig2(N2N_CONFIG.trackerBSCol, diffWidth);
    }
}

function setFontStyle() {
    if (jsutil.toBoolean(showUISettingItem[6]) && !isMobile) {
        changeTextFont(gl_fonttype);
    }
    if (jsutil.toBoolean(showUISettingItem[7]) && !isMobile) {
        changeClsStyle(".n2n .N2N_FontUp", "color:#" + gl_up + " !important;");
        changeClsStyle(".n2n .N2N_FontDown", "color:#" + gl_down + " !important;");
        changeClsStyle(".n2n .N2N_FontUnchange", "color:#" + gl_unchg + " !important;");
        changeClsStyle(".n2n .N2N_FontUnchange_yellow", "color:#" + gl_yel + " !important;");
    }
    if (jsutil.toBoolean(showUISettingItem[8]) && !isMobile) {
        setAltStyle(gl_alter);
    }
}

function changeTextFont(fontStyle) {
    changeClsStyle(".n2n .x-grid-row .x-grid-cell", "font-family:" + fontStyle + ";");
    changeClsStyle(".n2n .x-grid-row-summary .x-grid-cell", "font-family:" + fontStyle + ";");
    changeClsStyle(".n2n .orderpad .x-form-item-label", "font-family:" + fontStyle + ";");
    changeClsStyle(".n2n .orderpad .x-form-text-default", "font-family:" + fontStyle + ";");
    changeClsStyle(".n2n .orderpad .x-panel-body-default", "font-family:" + fontStyle + ";");
    changeClsStyle(".orderpad .x-btn-inner-default-small", "font-family:" + fontStyle + ";");
    changeClsStyle(".font-applied", "font-family:" + fontStyle + ";");
    changeClsStyle(".font-style-applied", "font-family:" + fontStyle + ";");
}

function createFmx0(fmxType, fmxSize) {
    changeClsStyle(".n2n .x-grid-row .gridcell_tmx0", "font-family:" + fmxType + ";");
    changeClsStyle(".n2n .x-grid-row .gridcell_tmx0", "font-size:" + fmxSize + "px !important;");

    if (fmx0) {
        fmx0.destroy();
    }

    fmx0 = new Ext.util.TextMetrics('gridcell_tmx0');
}

function createFmx() {
    if (fmx) {
        fmx.destroy();
    }
    if (ofmx) {
        ofmx.destroy();
    }

    fmx = new Ext.util.TextMetrics('gridcell_tmx');
    ofmx = new Ext.util.TextMetrics('order_label_tmx');
}

function getDiffPx() {
    var str = 'abcdefghijklmnopqrstuvwxyz ABCDEFGHIJKLMNOPQRSTUVWXYZ 1234567890.:,;(!?)+-*/=';

    return Math.ceil((fmx.getWidth(str) - fmx0.getWidth(str))/10);
}

function setAltStyle(altOpt, themeName) {
    var bgcolor = "";
    themeName = themeName || global_personalizationTheme;

    if (altOpt == 1) {
        bgcolor = themeName.indexOf("black") == -1 ? "#fff" : "#000";
        if (themeName.indexOf("wh_black") != -1) {
            bgcolor = "#2a2c30";
        }
    } else {
        bgcolor = themeName.indexOf("black") == -1 ? "#e9e9e9" : "#1c1d1d";
        if (themeName.indexOf("wh_black") != -1) {
            bgcolor = "#383a40";
        }
    }
    
    changeClsStyle(".n2n .x-grid-item-alt", "background-color: " + bgcolor + "!important;");
}

function getStyle(classname, property) {
    var style = Ext.util.CSS.getRule(classname, true);
    if (property) {
        return style.style[property];
    }
    style = style.cssText;
    return style.substring(style.indexOf("{") + 1, style.indexOf("}"));
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(str) {
    str = str.replace("rgb(", "");
    str = str.replace(")", "");
    var strSplit = str.split(",");
    var r = parseInt(strSplit[0]);
    var g = parseInt(strSplit[1]);
    var b = parseInt(strSplit[2]);
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/**
 * Scroll element into view (top)
 * 
 * @param {string} elId element ID
 * 
 */
function scrollToView(elId) {
    document.getElementById(elId).scrollIntoView();
}

function getAllChildren(col) {
    var children = col.items.items;
    var allchild = new Array();
    for (var i = 0; i < children.length; i++) {
        allchild[i] = children[i].getId();
    }
    return allchild;
}

function refreshViewMarketDepth() {
    if (newMarketDepth) {
        if (global_personalizationTheme.indexOf("black") == -1) {
            if (marketDepthGradient != "gradient") {
                if (newMarketDepth.hasCls("marketdepth")) {
                    newMarketDepth.removeCls("marketdepth");
                }
            } else {
                if (!newMarketDepth.hasCls("marketdepth")) {
                    newMarketDepth.addCls("marketdepth");
                }
            }
        }

        newMarketDepth.getView().refresh();
    }
}

function getOrdPadCol(ordPad, width) {
    if(!ordPad)
        return;
    
    if (width != 0) {
        global_ordPadWidth = width;
    } else {
        width = global_ordPadWidth;
    }

    console.log('ordPad size:' + width);

    if (ordPadColWidth.length > 0) {
        var ordPadColWidthArr = ordPadColWidth.split(',');
        var ordPadColSize = ordPadColWidthArr[0].split('|');
        var ordPadColumns = ordPadColSize;

        var diff = Math.abs(width - ordPadColumns[0]);
        for (var i = 0; i < ordPadColWidthArr.length; i++) {
            var tempOrdPadColSize = ordPadColWidthArr[i].split('|');
            var newdiff = Math.abs(width - tempOrdPadColSize[0]);
            if (newdiff < diff) {
                diff = newdiff;
                ordPadColumns = ordPadColWidthArr[i].split('|');
            }
        }

        ordPad.compRef.priceCT.columnWidth = ordPadColumns[1];
        ordPad.compRef.qtyCT.columnWidth = ordPadColumns[2];
        ordPad.compRef.orderTypeCT.columnWidth = ordPadColumns[3];
        ordPad.compRef.validityCt.columnWidth = ordPadColumns[4];
        ordPad.compRef.dsqtyPanel.columnWidth = ordPadColumns[5];
        ordPad.compRef.stopLimitCt.columnWidth = ordPadColumns[6];
        ordPad.compRef.minQtyCt.columnWidth = ordPadColumns[7];
        ordPad.compRef.setCurCt.columnWidth = ordPadColumns[8];
        ordPad.compRef.paymentCt.columnWidth = ordPadColumns[9];
        ordPad.compRef.tpTypeCt.columnWidth = ordPadColumns[10];
        ordPad.compRef.tpDirectionCt.columnWidth = ordPadColumns[11];

        ordPad.doLayout();
    }
}

function post_to_url(path, params, method, name) {
    method = method || "post"; // Set method to post by default if not specified.

    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
    form.setAttribute("target", name);

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);

    msgutil.openURL({
        url: '',
        name: name,
        spec: "menubar=1,resizable=1,scrollbars=yes,width=865,height=595"
    });

    form.submit();
}

function checkIsCutAcc() {
    if (accRet) {
	var accList = accRet.ai;
	var totAcc = accList.length;
	if (accList && totAcc > 0) {
            for (var i = 0; i < totAcc; i++) {
			var acc = accList[i];
                if (acc.cliType == 'B') { //for CIMB SG
				global_isCUTAcc = true;
				break;
			}
		}
	}	
}
}

function getNewsWinConfig() {
    return {
        maximizable: true,
        pcWidth: 0.7,
        pcHeight: 0.7
    };
}

function rememberRecent(type, stkCode) {
    if (recentQuotePrfr) {
        recentQuotePrfr.addRecent(type, stkCode);
    }
}

function compAddRecent(comp, stkCode) {
    if (stkCode && comp) {
        if (!comp.loadedScreen) {
            rememberRecent(comp.type, stkCode);
        } else {
            comp.loadedScreen = false;
        }
    }
}

function getDelayedConfig(conf) {
    var winX = n2nLayoutManager.compWinX;
    var winY = n2nLayoutManager.compWinY;

    if (winX != null && winY != null) {
        if (conf && conf.winConfig) {
            conf.winConfig.x = winX;
            conf.winConfig.y = winY;
        } else {
            conf = {
                winConfig: {
                    x: winX,
                    y: winY
                }
            };
        }
    }

    return conf;
}

function createAutoWidthButton(grid, gridItem, extraConf) {
            
    if (N2N_CONFIG.autoWidthButton) {
        return Ext.create('Ext.button.Button', Ext.merge({
            text: languageFormat.getLanguage(20664, 'Fit columns'),
            tooltip: languageFormat.getLanguage(20664, 'Fit columns'),
            iconCls: 'icon-fitcolumn',
            handler: function() {
                var gridComp = grid;
                if (gridItem) {
                    gridComp = grid[gridItem];
                }
                helper.autoSizeGrid(gridComp);
            }
        }, extraConf));
    }

    return null;
}

function createAutoFitButton(grid, gridItem, extraConf) {

    if (N2N_CONFIG.fitToScreen) {

        return Ext.create('Ext.button.Button', Ext.merge({
            tooltip: userFitToScreen ? languageFormat.getLanguage(20681, 'Fit to Screen ON') : languageFormat.getLanguage(20682, 'Fit to Screen OFF'),
            cls: 'plain-btn',
            iconCls: userFitToScreen ? 'icon-fitscreen-on' : 'icon-fitscreen-off',
            isFitToScreen: userFitToScreen,
            handler: function(thisBtn) {
                userFitToScreen = !userFitToScreen;

                if (userFitToScreen) {
                    thisBtn.setIconCls('icon-fitscreen-on');
                    thisBtn.setTooltip(languageFormat.getLanguage(20681, 'Fit to Screen ON'));
                    
                    helper.fitScreenAll();
                    
                } else {
                    thisBtn.setIconCls('icon-fitscreen-off');
                    thisBtn.setTooltip(languageFormat.getLanguage(20682, 'Fit to Screen OFF'));
                }

                userPreference.set('fitts', jsutil.boolToStr(userFitToScreen, '1', '0'));
                userPreference.save();
            }
        }, extraConf));
    }

    return null;
}

function validateOutboundStock(stkcode) {
    if (outbound) {
        stkcode = stockutil.removeStockDelay(stkcode);
    } else {
        stkcode = stockutil.mapOutboundStock(stkcode);
    }

    return stkcode;
}

var mainContextMenu = {
    _intradayMenu: null,
    _ibMenu: null,
    init: function() {
        var me = this;
        var menuItems = [];

        // buy/sell
        if (showBuySellHeader == "TRUE") {
            menuItems.push({
                text: languageFormat.getLanguage(10001, 'Buy'),
                popupOnly: true,
                handler: function() {
                    activateBuySellMenu(modeOrdBuy);
                }
            });

            menuItems.push({
                text: languageFormat.getLanguage(10002, 'Sell'),
                popupOnly: true,
                handler: function() {
                    activateBuySellMenu(modeOrdSell);
                }
            });
        }

        // revise/cancel
        if (showOrdBookHeader == "TRUE" && showOrdBookOrderSts == "TRUE") {
            menuItems.push({
                text: languageFormat.getLanguage(10009, 'Revise') + ' / ' + languageFormat.getLanguage(10010, 'Cancel'),
                handler: function() {
                    createOrdStsPanel('', '0');
                }
            });
        }

        if (showStkInfoHeader === 'TRUE') {
            // market depth
            if (showStkInfoMarketDepth === 'TRUE') {
                menuItems.push({
                    text: languageFormat.getLanguage(20022, 'Market Depth'),
                    handler: function() {
                        closedMarketDepth = false;
                        createMarketDepthPanel(me.stkCode, me.stkName, true);
                    }
                });
            }

            // stock info
            if (showStkInfoStkInfo == "TRUE") {
                menuItems.push({
                    text: languageFormat.getLanguage(20021, 'Stock Info'),
                    handler: function() {
                        createStkInfoPanel(me.stkCode, me.stkName, false);
                    }
                });
            }

            // tracker
            if (showStkInfoTracker === 'TRUE') {
                menuItems.push({
                    text: languageFormat.getLanguage(20024, 'Stock Tracker'),
                    handler: function() {
                        createTrackerPanel(me.stkCode, me.stkName, false);
                    }
                });
            }

            // equities tracker
            if (showStkInfoEquitiesTracker == "TRUE") {
                menuItems.push({
                    text: languageFormat.getLanguage(20025, 'Equities Tracker'),
                    handler: function() {
                        n2ncomponents.createEquitiesTracker(me.stkCode);
                    }
                });
            }

            // historical data
            if (N2N_CONFIG.features_HistoricalData) {
                menuItems.push({
                    text: languageFormat.getLanguage(20060, 'Historical Data'),
                    handler: function() {
                        n2ncomponents.createHistoricalData(me.stkCode, me.stkName);
                    }
                });
            }
            
            // BrokerQ
            if (N2N_CONFIG.features_BrokerQ) {
                menuItems.push({
                    text: languageFormat.getLanguage(31800, 'Broker Queue'),
                    handler: function() {
                        n2ncomponents.createBrokerQ({key: me.stkCode, name: me.stkName});
                    }
                });
            }
        }

        if (showChartHeader == "TRUE") {
            // intraday chart
            if (showChartIntradayChart == "TRUE") {
                me._intradayMenu = Ext.create('Ext.menu.Item', {
                    text: languageFormat.getLanguage(20101, 'Intraday Chart'),
                    handler: function() {
                        createChartPanel(me.stkCode, me.stkName, false);
                    }
                });
                menuItems.push(me._intradayMenu);
            }

            // analysis chart
            if (showChartAnalysisChart == "TRUE") {
                menuItems.push({
                    text: languageFormat.getLanguage(20102, 'Analysis Chart'),
                    handler: function() {
                        createAnalysisChartPanel(me.stkCode, me.stkName, false);
                    }
                });
            }
        }

        if (showNewsHeader == "TRUE") {
            // stock news
            if (showNewsStockNews == "TRUE") {
                menuItems.push({
                    text: languageFormat.getLanguage(20123, 'Stock News'),
                    handler: function() {
                        createStkNewsPanel(me.stkCode, me.stkName);
                    }
                });
            }

            // news archives
            if (N2N_CONFIG.featuresNews_Archive) {
                menuItems.push({
                    text: languageFormat.getLanguage(20137, 'News Archive'),
                    handler: function() {
                        n2ncomponents.openArchiveNews({key: me.stkCode, name: me.stkName});
                    }
                });
            }

            // elastic news
            if (N2N_CONFIG.elasticNewsUrl) {
                menuItems.push({
                    text: languageFormat.getLanguage(20140, 'Elastic News'),
                    handler: function() {
                        n2ncomponents.openElasticNews({key: me.stkCode, name: me.stkName, newsOpt: '1'});
                    }
                });
            }

            // nikkei news
            if (N2N_CONFIG.nikkeiNewsUrl) {
                menuItems.push({
                    text: languageFormat.getLanguage(21501, 'Nikkei News'),
                    handler: function() {
                        n2ncomponents.openElasticNews({key: me.stkCode, name: me.stkName, newsOpt: '2'});
                    }
                });
            }
            
        }

        if (N2N_CONFIG.hasNews2) {
            menuItems.push({
                text: languageFormat.getLanguage(20121, 'News'),
                handler: function() {
                    menuHandler.openNews('', me.stkCode);
                }
            });
        }

        // fundamental
        if (N2N_CONFIG.featuresFund_Header) {

            if (N2N_CONFIG.featuresNews_FundamentalCPIQ) {
                menuItems.push({
                    text: languageFormat.getLanguage(20124, 'Fundamental (Capital IQ)'),
                    handler: function() {
                        createFundamentalCPIQWin(me.stkCode);
                    }
                });
            }

            if (N2N_CONFIG.featuresNews_FundamentalThomsonReuters) {
                menuItems.push({
                    text: languageFormat.getLanguage(20126, 'Fundamental (Thomson Reuters)'),
                    handler: function() {
                        createFundamentalThomsonReutersWin(me.stkCode);
                    }
                });
            }

        }
        
        if (showSettingHeader == 'TRUE') {
            // add stock alert
            if (N2N_CONFIG.featuresSetting_AddStockAlert) {
                menuItems.push({
                    text: languageFormat.getLanguage(20603, 'Add Stock Alert'),
                    handler: function() {
                        n2ncomponents.createAddStockAlert(me.stkCode);
                    }
                });
            }
        }

        // warants info
        if (showWarrantsInfo == "TRUE") {
            menuItems.push({
                text: languageFormat.getLanguage(20130, 'Warrants Info'),
                handler: function() {
                    createWarrantsInfoWin(me.stkCode);
                }
            });
        }

        // add to watchlist
        if (showWatchListHeader == 'TRUE') {
            menuItems.push({
                text: languageFormat.getLanguage(30605, 'Add to Watchlist'),
                popupOnly: true,
                handler: function() {
                    addToWatchlist(me.stkCode);
                }
            });
        }

        // stock alert
        if (settingSMSStockAlertURL.length > 0) {
            menuItems.push({
                text: languageFormat.getLanguage(20602, 'Stock Alert'),
                handler: function() {
                    n2ncomponents.createSMSStockAlert(me.stkCode);
                }
            });
        }

        // pse edge
        if (N2N_CONFIG.pseEdgeURL.length > 0) {
            menuItems.push({
                text: languageFormat.getLanguage(20139, 'PSE Edge'),
                handler: function() {
                    n2ncomponents.openPseEdge(me.stkCode);
                }
            });
        }

        // ibillionaire
        if (N2N_CONFIG.iBillionaireURL.length) {
            me._ibMenu = Ext.create('Ext.menu.Item', {
                text: languageFormat.getLanguage(20527, 'Follow iBillionaire'),
                handler: function() {
                    n2ncomponents.openIBillionaire(me.stkCode);
                }
            });
            menuItems.push(me._ibMenu);
        }

        me.menuItems = menuItems;
        me.menu = Ext.create('Ext.menu.Menu', {
            items: menuItems,
            listeners: addDDMenu()
        });
    },
    showAt: function(stkCode, stkName, e) {
        var me = this;

        // update stock
        me.stkCode = stkCode;
        me.stkName = stkName;
        me.exch = stockutil.getExchange(stkCode);

        me.validateIBMenu();
        me.menu.showAt(e.getXY());
    },
    validateIBMenu: function() {
        var me = this;

        checkContextMenuItems(me._intradayMenu, me._ibMenu, me.exch);
    }
};

var mutualFundMenu = {
    init: function() {
        var me = this;
        var menuItems = [];

        // buy/sell
        if (showBuySellHeader == "TRUE") {
            menuItems.push({
                text: languageFormat.getLanguage(10001, 'Buy'),
                popupOnly: true,
                handler: function() {
                    activateBuySellMenu(modeOrdBuy);
                }
            });

            menuItems.push({
                text: languageFormat.getLanguage(10002, 'Sell'),
                popupOnly: true,
                handler: function() {
                    activateBuySellMenu(modeOrdSell);
                }
            });
        }

        // revise/cancel
        if (showOrdBookHeader == "TRUE" && showOrdBookOrderSts == "TRUE") {
            menuItems.push({
                text: languageFormat.getLanguage(10009, 'Revise') + ' / ' + languageFormat.getLanguage(10010, 'Cancel'),
                handler: function() {
                    createOrdStsPanel('', '0');
                }
            });
        }

            // tracker
            if (showStkInfoTracker === 'TRUE') {
                menuItems.push({
                    text: languageFormat.getLanguage(20024, 'Stock Tracker'),
                    handler: function() {
                        createTrackerPanel(me.stkCode, me.stkName, false);
                    }
                });
            }

        if (showChartHeader == "TRUE") {
            // analysis chart
            if (showChartAnalysisChart == "TRUE") {
                menuItems.push({
                    text: languageFormat.getLanguage(20102, 'Analysis Chart'),
                    handler: function() {
                        createAnalysisChartPanel(me.stkCode, me.stkName, false);
                    }
                });
            }
        }

//        if (showPortFolioHeader == "TRUE") {
            // portfolio
            //May have to change in the future
//            if (showPortFolioMyPortFolio == "TRUE") {
//                menuItems.push({
//                    text: languageFormat.getLanguage(20262, 'Equities Portfolio'),
//                    handler: function() {
                        //TODO HAVE TO CREATE MUTUAL FUND PORTFOLIO PANEL
//                        createMutualFundPortfolioPanel(me.stkCode, me.stkName, false);
//                    }
//                });
//            }
//        }

        me.menuItems = menuItems;
        me.menu = Ext.create('Ext.menu.Menu', {
            items: menuItems,
            listeners: addDDMenu()
        });
    },
    showAt: function(stkCode, stkName, e) {
        var me = this;

        // update stock
        me.stkCode = stkCode;
        me.stkName = stkName;
        me.exch = stockutil.getExchange(stkCode);

//        me.validateIBMenu();
        me.menu.showAt(e.getXY());
    }
};