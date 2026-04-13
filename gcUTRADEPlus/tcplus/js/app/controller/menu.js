/* 
 * Provides menu functions
 * 
 * TO REVIEW
 */
/* menu */
var MENU = new Object();

var menuHandler = {
    stockInfo: function() {
        var stk = n2nLayoutManager.getActiveRecord();
        createStkInfoPanel(stk.stkCode, stk.stkName);
    },
    marketDepth: function() {
        var stk = n2nLayoutManager.getActiveRecord();
        if (stk) {
            closedMarketDepth = false;
            createMarketDepthPanel(stk.stkCode, stk.stkName, true);
        }
    },
    tracker: function() {
        var stk = n2nLayoutManager.getActiveRecord();
        if (stk) {
            createTrackerPanel(stk.stkCode, stk.stkName, false);
        }
    },
    intradayChart: function() {
        var stk = n2nLayoutManager.getActiveRecord();
        if (stk) {
            createChartPanel(stk.stkCode, stk.stkName, false);
        }
    },
    analysisChart: function() {
        var stk = n2nLayoutManager.getActiveRecord();

        if (stk) {
            createAnalysisChartPanel(stk.stkCode, stk.stkName, false);
        }
    },
    itFinanceChart: function(){
    	n2ncomponents.createITFinanceChartPanel();
    },
    buy: function() {
        activateBuySellMenu(modeOrdBuy);
    },
    sell: function() {
        activateBuySellMenu(modeOrdSell);
    },
    announcement: function() {
        createNewsPanel();
    },
    historicalData: function() {
        var stk = n2nLayoutManager.getActiveRecord();
        if (stk) {
            n2ncomponents.createHistoricalData(stk.stkCode, stk.stkName);
        }
    },
    brokerQ: function() {
        var stk = n2nLayoutManager.getActiveRecord();
        if (stk) {
            n2ncomponents.createBrokerQ({key: stk.stkCode, name: stk.stkName});
        }
    },
    pseBoardLotTable: function(){
    	n2ncomponents.openPSEBoardLotTable();
    },
    stockNews: function() {
        var stk = n2nLayoutManager.getActiveRecord();
        if (stk) {
            createStkNewsPanel(stk.stkCode, stk.stkName);
        }
    },
    elasticNews: function(newsOption) {
        n2ncomponents.openElasticNews({newsOpt: newsOption});
    },
    archiveNews: function() {
        var activeStk = n2nLayoutManager.getActiveRecord();
        n2ncomponents.openArchiveNews({key: activeStk.stkCode, name: activeStk.stkName, frmMenu: N2N_CONFIG.featuresNews_Archive_GeneralNews}); //CIMBSG click from main menu, pull General News. Missing behavior after port from TCLite.
    },
    userGuide: function() {
        n2ncomponents.openUserGuide();
    },
    marketSummary: function() {
        createSummaryPanel(false);
    },
    indices: function() {
        createIndices();
    },
    scoreBoard: function() {
        if (feedFilterRet == null)
            return;
        createScoreBoard();
    },
    streamer: function() {
        createMarketStreamer();
    },
    trackerRecord: function() {
    	createTrackerRecord();
    },
    worldIndices: function() {
        n2ncomponents.createWorldIndicesPanel();
    },
    orderStatus: function() {
        createOrdStsPanel('', '0');
        // resetOrderPad();	// to reset Order Pad
    },
    mfOrderStatus: function() {
        createMFOrdStsPanel('', '0');
        // resetOrderPad(); // to reset Order Pad
    },
    basketOrder: function() {
        createBasketOrderPanel();
    },
    logout: function() {
//        if (isMobile) {
            msgutil.confirm(languageFormat.getLanguage(30127, 'Are you sure you want to logout?'), function(btn) {
                if (btn == "yes") {
                    conn.logout();
                }
            });
//        } else {
//            conn.logout();
//        }
    },
    equityPrtf: function() {
        createEquityPortfolioPanel('');
        resetOrderPad();	// to reset Order Pad
    },
    fundPrtf: function() {
        createFundPortfolioPanel('');
        resetOrderPad();    // to reset Order Pad
    },
    cfdHoldings: function(){
    	createCFDHoldingsPanel('');
    	resetOrderPad();
    },
    equityManualPrtf: function() {
    	createEquityManualPortFolioPanel('');
        resetOrderPad();	// to reset Order Pad
    },
    realizedPrtf: function() {
        createEquityPortfolioRealizedGainLossPanel('');
        resetOrderPad();	// to reset Order Pad
    },
    changePwd: function() {
        window.open(N2N_CONFIG.profileChgPwdURL, 'profile_change_password').focus();
    },
    forgotPwd: function() {
        window.open(N2N_CONFIG.profileForPwdURL, 'profile_forgot_password').focus();
    },
    changePin: function() {
        window.open(N2N_CONFIG.profileChgPinURL, 'profile_change_pin').focus();
    },
    forgotPin: function() {
        window.open(N2N_CONFIG.profileForPinURL, 'profile_forgot_pin').focus();
    },
    switchExchange: function(exchange) {
        layoutProfileManager.setLastSelectedExchange(exchange);
        
        // Set current exchange code
        setExchange(exchange);
        
        viewInLotMode = isLotMode();
        
        var skipQuoteCalRow = true;
        if (N2N_CONFIG.switchExchOpenQuote && !quoteScreen) {
            createQuoteScreen(true);
            skipQuoteCalRow = false;
        }
        
        //loadExchange();
            
        if (quoteScreen) {
            n2nLayoutManager.activateItem(quoteScreen);
            
            if (quoteScreen.isCardView) { // fix visible grid header
                quoteScreen._gridEl.addCls('init-hidden');
            }
            
            Blinking.clearBlink(quoteScreen);
            quoteScreen.setPageNo(0);
            quoteScreen.exchangeFeedType = showExType;
            quoteScreen.exchangecode = exchangecode;
            quoteScreen.procColumnWidth(exchangecode);
            quoteScreen.tempWidth = cookies.toDefaultColumn("_Quote_" + exchangecode);
            quoteScreen.oriState = true;
            quoteScreen.isImgBlink = false;
            quoteScreen.getStore().removeAll();
            quoteScreen.reconfigure(null, quoteScreen.generateColumnsArray(quoteScreen.generateColumn("")));
            quoteScreen.resetFeedSetting(skipQuoteCalRow);
            
            if(showMargin == "TRUE"){
            	quoteScreen.callMargin();
            }else{
            	quoteScreen.callSort();
            }
            
            quoteScreen.updateRDToolTip();

            // some exchange right click features is not supported
            if (outbound) {
                quoteScreen.disableRightFunction(exchangecode);
                mainContextMenu.validateIBMenu(); // context menu for card view
            }

            /*
             if (showV1GUI != "TRUE") {
             if (outbound) {
             disableMenuItems(exchangecode);
             }
             }*/

            conn.initializeSectors();
        }
        
        loadExchange();
        
        if (n2ncomponents.bkInfo) {
            n2ncomponents.bkInfo.setExchange(exchangecode);
        }
        if (n2ncomponents.bkSearch) {
            n2ncomponents.bkSearch.setExchange(exchangecode);
        }

    },
    menuStatus: [],
    getMenuStatus: function(menuName) {
        var me = this;
        var mStatus = true;

        for (var i = 0; i < me.menuStatus.length; i++) {
            if (menuName == me.menuStatus[i].name) {
                mStatus = me.menuStatus[i].status;
                break;
            }
        }

        return mStatus;
    },
    derivativePrtf: function() {
        createDerivativePortfolioPanel('');
        resetOrderPad();	// to reset Order Pad
    },
    analysisDividend: function() {
        n2ncomponents.createAnalysisDividend();
    },
    analysisWarrants: function() {
        n2ncomponents.createAnalysisWarrants();
    },
    analysisBMD_Future: function() {
        n2ncomponents.createAnalysisBMD_Future();
    },
    openReport: function(rptSt, portlet_col, index) {
        n2ncomponents.openWebReport(rptSt, portlet_col, index);
    },
    openSettlement: function (settSt, portlet_col, index) {
        n2ncomponents.openSettlementMenu(settSt, portlet_col, index);
    },
    spFundamental: function(){
    	var stk = n2nLayoutManager.getActiveRecord();
        if (stk) {
            createFundamentalCPIQWin(stk.stkCode);
        }
    },
    spFundamentalScreener: function(){
    	 createFundamentalScreenerCPIQWin();
    },
    spCapIQItem: function (spTitle, spCat) {
        var stk = n2nLayoutManager.getActiveRecord();

        n2ncomponents.createSPCapIQItem({
            key: stk.stkCode,
            category: spCat,
            title: spTitle
        });
    },
    spCapIQSynopsis: function() {
        this.spCapIQItem(languageFormat.getLanguage(20132, 'Company Synopsis'), 'Synopsis');
    },
    spCapIQInfo: function() {
        this.spCapIQItem(languageFormat.getLanguage(20133, 'Company Info'), 'Info');
    },
    spCapIQAnnouncement: function() {
        this.spCapIQItem(languageFormat.getLanguage(20128, 'Announcement'), 'Announcement');
    },
    spCapIQKeyPerson: function() {
        this.spCapIQItem(languageFormat.getLanguage(20134, 'Key Persons'), 'KeyPerson');
    },
    spCapIQShareHolders: function() {
        this.spCapIQItem(languageFormat.getLanguage(20135, 'Shareholding Summary'), 'ShareHolders');
    },
    spCapIQAnnual: function() {
        this.spCapIQItem(languageFormat.getLanguage(20136, 'Financial Reports'), 'Annual');
    },
    FXConversion: function(){
    	n2ncomponents.createExchangeRate();
    },
    theScreener: function(){
    	n2ncomponents.openTheScreener();
    },
    iBillionaire: function(){
    	n2ncomponents.openIBillionaire();
    },
    pseEdge: function(){
    	var activeStk = n2nLayoutManager.getActiveRecord();
    	n2ncomponents.openPseEdge(activeStk.stkCode);
    },
    createWatchList: function() {
        if (N2N_CONFIG.requiredLoginUrl !== '') {
            msgutil.show({
                msg: languageFormat.getLanguage(30608, 'For watchlist access, please login to continue'),
                buttons: Ext.MessageBox.YESNO,
                buttonText: {
                    yes: '<b>' + languageFormat.getLanguage(10025, 'Log in now') + '</b>',
                    no: languageFormat.getLanguage(10026, 'Later')
                },
                fn: function(btn) {
                    if (btn == 'yes') {
                        window.parent.location = N2N_CONFIG.requiredLoginUrl;
                    } else {
                        this.close();
    }
                }
            });
        }
    },
    PERatioEPSCalc: function(){
    	var stk = n2nLayoutManager.getActiveRecord();
        if (stk) {
        	n2ncomponents.createPEREPSCalc(stk);
        }
    },
    breakEvenCalc: function() {
        n2ncomponents.createBreakEvenCalc();
    },
    externalCalc: function(){
    	n2ncomponents.createMFCalc();
    },
    foreignFlow: function() {
        var stk = n2nLayoutManager.getActiveRecord();
        if (stk) {
            n2ncomponents.createForeignFlows({
                key: stk.stkCode,
                name: stk.stkName
            });
        }
    },
    brokerInfo: function() {
        n2ncomponents.createBrokerInfo({});
    },
    brokerSearch: function() {
        n2ncomponents.createBrokerSearch({});
    },
    openExchangeRateWin: function(){
    	n2ncomponents.openExchangeRateWin();
    },
    openStockScreenerWin: function(){
    	n2ncomponents.openStockScreenerWin();
    },
    recentQuote: function() {
        viewRecentQuote();
    },
    stockAlert: function(){
    	var stk = n2nLayoutManager.getActiveRecord();
        if (stk) {
        	n2ncomponents.createSMSStockAlert(stk.stkCode);
        }else{
        	n2ncomponents.createSMSStockAlert();
        }
    },
    settings: function(){
    	n2ncomponents.settingUI();
    },
    worldindices: function() {
        n2ncomponents.createWorldIndices();
    },
    tradeCal: function() {
        n2ncomponents.createTradeCal();
    },
    hotkeys: function(){
    	n2ncomponents.openHotKeysMapping();
    },
    openNews: function(newsType, stkcode) {
        n2ncomponents.openNews({
            newsType: newsType,
            key: stkcode
        });
    }
};

function mainmenu() {
    var mainMenuItems = new Array();
    
    mainMenuItems.push({
        id: 'tbQS',
        text: languageFormat.getLanguage(20673, 'Quote'),
        iconCls: 'icon-menu-quote',
        handler: function() {
            createQuoteScreen();
        },
        listeners: menuListeners()
    });
    
    if (showWatchListHeader == "TRUE") {
        if (tbMenuWatchList)
            mainMenuItems.push(tbMenuWatchList);
    }
    if (showStkInfoHeader == "TRUE") {
        if (tbMenuStkInfo)
            mainMenuItems.push(tbMenuStkInfo);
    }
    if (showChartHeader == "TRUE") {
        if (tbMenuChart)
            mainMenuItems.push(tbMenuChart);
    }
    if (showBuySellHeader == "TRUE") {
        if (tbMenuBuy)
            mainMenuItems.push(tbMenuBuy);
        if (tbMenuSell)
            mainMenuItems.push(tbMenuSell);
    }
    
    if (N2N_CONFIG.featuresMutualFund_Header) {
        var fundMenuItems = [];

        if (N2N_CONFIG.mutualFund) {
            fundMenuItems.push({
                text: languageFormat.getLanguage(33502, 'Funds'),
                cls: 'x-menu-item-medium',
                handler: function () {
                    createMutualFund();
                }
            });
        }

        // questionaire
        if (N2N_CONFIG.mfQuestionURL) {
            fundMenuItems.push({
                text: languageFormat.getLanguage(33504, 'Suitability Questionnaire'),
                cls: 'x-menu-item-medium',
                handler: function () {
                    n2ncomponents.openMFQuestionnaire();
                }
            })
        }

        if (fundMenuItems.length > 0) {
            mainMenuItems.push({
                id: 'tbMF',
                text: languageFormat.getLanguage(33502, 'Funds'),
                iconCls: 'icon-menu-mutualfund',
                menu: new Ext.menu.Menu({
                    cls: 'x-menu-medium',
                    items: fundMenuItems
                }),
                listeners: menuListeners()
            });
        }

    }
    
    if (showNewsHeader == "TRUE") {
        if (tbMenuNews)
            mainMenuItems.push(tbMenuNews);
    }
    
    // news menu  2
    if (N2N_CONFIG.news2_Menu !== '') {
        var sItems = [];

        var nMenu = initMenuObj(N2N_CONFIG.news2_Menu);
        if (nMenu) {
            sItems.push(nMenu);
        }

        if (sItems.length > 0) {
            if (sItems.length === 1) {
                var rsItems = [];
                var oneMenu = sItems[0];
                if (oneMenu.menu && oneMenu.menu.items) {
                    if (oneMenu.menu.items.length > 0) {
                        for (var i = 0; i < oneMenu.menu.items.length; i++) {
                            var mItem = oneMenu.menu.items[i];
                            mItem.secondMenu = null;
                            mItem.listeners = {};
                            rsItems.push(mItem);
                        }

                        if (rsItems.length > 0) {
                            sItems = rsItems;
                        }
                    }
                }
            }

            mainMenuItems.push({
                id: 'tbNews2',
                text: languageFormat.getLanguage(20121, 'News'),
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-medium' : '',
                iconCls: 'icon-menu-news',
                menu: sItems,
                listeners: menuListeners()
            });

        }

    }
    
    if (tbMenuFund) {
        mainMenuItems.push(tbMenuFund);
    }
    if (N2N_CONFIG.features_Analysis) {
        if (tbMenuAnalysiss)
            mainMenuItems.push(tbMenuAnalysiss);
    }
    if (showMarketHeader == "TRUE") {
        if (tbMenuMarketSummary)
            mainMenuItems.push(tbMenuMarketSummary);
    }
    if (showOrdBookHeader == "TRUE") {
        if (tbMenuOrdSts)
            mainMenuItems.push(tbMenuOrdSts);
    }
    if (showWebReportHeader == "TRUE") {
        if (tbMenuReports)
            mainMenuItems.push(tbMenuReports);
    }
    if (showPortFolioHeader == "TRUE") {
        if (tbMenuPortfolio)
            mainMenuItems.push(tbMenuPortfolio);
    }

    if (global_showOtherToolHeader.toLowerCase() == "true") {
        if (tbMenuOtherTool)
            mainMenuItems.push(tbMenuOtherTool);
    }

    if (showExchangeHeader == "TRUE") {
        if (tbMenuExchg)
            mainMenuItems.push(tbMenuExchg);
    }
    
    if (N2N_CONFIG.worldIndices) {
        mainMenuItems.push({
            id: 'tbWi',
            text: languageFormat.getLanguage(20158, 'World Indices'),
            iconCls: 'icon-menu-worldindices',
            handler: menuHandler.worldindices,
            listeners: menuListeners()
        });
    }

    if (showForeignFlows == "TRUE") {
        mainMenuItems.push({
            text: languageFormat.getLanguage(20653, 'Flow Analysis'),
            id: 'tbFF',
            iconCls: 'icon-menu-frflow',
            cls: 'smallmenutext',
            handler: function() {
                menuHandler.foreignFlow();
            },
            listeners: menuListeners()
        });
    }
    
    if (N2N_CONFIG.brokerInfo) {
        mainMenuItems.push({
            text: languageFormat.getLanguage(11060, 'Broker Info'),
            id: 'tbBI',
            iconCls: 'icon-menu-brokerinfo',
            cls: 'smallmenutext',
            handler: function() {
                menuHandler.brokerInfo();
            },
            listeners: menuListeners()
        });
    }

    if (global_TrackerRecord.toLowerCase() == 'true') {
        if (tbMenuTrackerRecord)
            mainMenuItems.push(tbMenuTrackerRecord);
    }
    
    if (configutil.getTrueConfig(showUserGuide)) {
        if (tbMenuUserGuide)
            mainMenuItems.push(tbMenuUserGuide);
    }

    if (showSettingHeader == "TRUE") {
        if (tbMenuSettings)
            mainMenuItems.push(tbMenuSettings);
    }
    if (MENU.profile != null) {
        mainMenuItems.push(MENU.profile);
    }
    if (showEmoHeader == "TRUE") { //v1.3.30.21
        if (tbMenuFEmoChat)
            mainMenuItems.push(tbMenuFEmoChat);
    }
    if (N2N_CONFIG.features_Calculator) {
        if (tbMenuFCalculator)
            mainMenuItems.push(tbMenuFCalculator);
    }

    if (global_showFullScreen.toLowerCase() == 'true') {
        var mnText = languageFormat.getLanguage(20633, 'Standard');
        var urlmain = window.parent.location.href.toString().split(window.parent.location.host)[1].indexOf("indexMin.jsp") != -1 ? false : true;

        if (urlmain) {
            global_onFullScreen = false;

            mnText = '&nbsp;&nbsp;' + languageFormat.getLanguage(20632, 'Full') + '&nbsp;&nbsp;';
        } else {
            global_onFullScreen = true;
        }

        mainMenuItems.push({
            text: mnText,
            handler: function() {
                var goPath = '';

                if (global_onFullScreen) {
                    goPath = sStdScreenUrl == '' || sStdScreenUrl == null ? 'index.jsp' : sStdScreenUrl;
                } else {
                    goPath = sFullScreenUrl == '' || sFullScreenUrl == null ? 'indexMin.jsp' : sFullScreenUrl;
                }

                if (sFullScreenUrl == '' || sFullScreenUrl == null)
                    window.parent.location = goPath;
                else
                    top.location.href = goPath;
            }
        });
    }

    if (N2N_CONFIG.otherMenuName !== '') { // services menu
        var sItems = [];
        for (var i = 1; i <= 6; i++) {
            var oMenu = initMenuObj(N2N_CONFIG['otherMenu' + i]);
            if (oMenu) {
                sItems.push(oMenu);
            }
        }

        if (sItems.length > 0) {
            if (sItems.length === 1) {
                var rsItems = [];
                var oneMenu = sItems[0];
                if (oneMenu.menu && oneMenu.menu.items) {
                    if (oneMenu.menu.items.length > 0) {
                        for (var i = 0; i < oneMenu.menu.items.length; i++) {
                            var mItem = oneMenu.menu.items[i];
                            mItem.secondMenu = null;
                            mItem.listeners = {};
                            rsItems.push(mItem);
                        }

                        if (rsItems.length > 0) {
                            sItems = rsItems;
                        }
                    }
                }
            }


            mainMenuItems.push({
                id: 'tbSV',
                text: languageFormat.getLanguage(N2N_CONFIG.otherMenuName, N2N_CONFIG.otherMenuName),
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-medium' : '',
                iconCls: 'icon-menu-service',
                menu: sItems,
                listeners: menuListeners()
            });
        }

    }
    
    if (settingSMSStockAlertURL.length > 0) {
        mainMenuItems.push({
        	id: 'tbSA',
            text: languageFormat.getLanguage(20602, 'Stock Alert'),
            iconCls: 'icon-menu-stockalert',
            notDDMenu: true,
            handler: menuHandler.stockAlert,
            listeners: menuListeners()
        });
    }
    
    if (global_logoutButton.toLowerCase() == 'true') {
        mainMenuItems.push({
        	id: 'tbLog',
            text: languageFormat.getLanguage(10006, 'Logout'),
            iconCls: 'icon-menu-logout',
            notDDMenu: true,
            handler: function () {
                menuHandler.logout();
            },
            listeners: menuListeners()
        });
    }
    
    if(N2N_CONFIG.reorderMenu){
    	var menuCookie = userPreference.get('menuRowSettings'); //cookies.readCookie(loginId + '_MenuRowSettings');
    	if (menuCookie != null) {
    		var tempRowArray = new Array();
    		var menuCookieArr = menuCookie.split(',');

    		if(menuCookieArr.length == mainMenuItems.length){
				var found = false;

    			for (var i = 0; i < menuCookieArr.length; i++) {
    				found = false;
    				for (var j = 0; j < mainMenuItems.length; j++) {
    					if (menuCookieArr[i] == mainMenuItems[j].id) {
    						tempRowArray.push(mainMenuItems[j]);
    						found = true;
    						break;
    					}
    				}
    				if(!found) break;
    			}
    			if(found){
    				mainMenuItems = tempRowArray;
    			}
    		}
    	}
    }
    
    return mainMenuItems;
}

function initializeMainMenuItems() {
    var me = this;

    if (showMarketHeader == "TRUE") {
        var tbMarketItem = [];
        if (showMarketSummary == "TRUE") {
            tbMarketItem.push({
                text: languageFormat.getLanguage(20050, 'Summary'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.marketSummary
            });
        }

        if (showMarketIndices == "TRUE") {
            tbMarketItem.push({
                text: languageFormat.getLanguage(20029, 'Indices'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.indices
            });
        }

        if (showMarketScoreBoard == "TRUE") {
            tbMarketItem.push({
                text: languageFormat.getLanguage(20156, 'Scoreboard'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.scoreBoard
            });
        }
        if (configutil.getTrueConfig(showMarketStreamer)) {
            tbMarketItem.push({
                text: languageFormat.getLanguage(20157, 'Streamer'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.streamer
            });
        }

        if (global_TrackerRecord.toLowerCase() == 'true') {
        	tbMarketItem.push({
        		text: languageFormat.getLanguage(20501, 'Tracker Record'),
        		cls: 'x-menu-item-medium',
        		handler: menuHandler.trackerRecord
        	});
        }

        if (configutil.getTrueConfig(showMarketWorldIndices)) {
            tbMarketItem.push({
                text: languageFormat.getLanguage(20158, 'World Indices'),
                iconCls: 'icon-menu-worldindices',
                cls: 'x-menu-item-medium',
                handler: menuHandler.worldIndices
            });
        }

        // var menuCount = tbMarketItem.length;
        // if (menuCount > 1) {
        var menuMarket = new Ext.menu.Menu({
            cls: 'x-menu-medium',
            items: tbMarketItem
        });

        tbMenuMarketSummary = {
            id: 'tbMS',
            text: languageFormat.getLanguage(20151, 'Market'),
            iconCls: 'icon-menu-market',
            menu: menuMarket,
            listeners: menuListeners()
        };
        // } else if (menuCount == 1) {
        //    tbMenuMarketSummary = tbMarketItem[0];
        //     tbMenuMarketSummary.cls = '';
        // }
    }

    if (showNewsHeader == "TRUE") {
        initializeNewsMenu();

        var menuCount = tbNewsItem.length;
        if (menuCount > 1) {
            var menuNews = {
                cls: 'x-menu-medium',
                items: tbNewsItem
            };

            tbMenuNews = {
                id: 'tbNews',
                text: languageFormat.getLanguage(20121, 'News'),
                iconCls: 'icon-menu-news',
                menu: menuNews,
                listeners: menuListeners()
            };
        } else if (menuCount == 1) {
            tbMenuNews = tbNewsItem[0];
            tbMenuNews.cls = '';
            tbMenuNews.iconCls = 'icon-menu-news';
        }
    }
    
    if (N2N_CONFIG.featuresFund_Header) {
        initializeFundMenu();

        var menuFund = {
            cls: 'x-menu-medium',
            items: tbFundItems
        };

        tbMenuFund = {
            id: 'tbFund',
            text: languageFormat.getLanguage(20124, 'Fundamental'),
            iconCls: 'icon-menu-fund',
            menu: menuFund,
            listeners: menuListeners()
        };
    }

    if (showWatchListHeader == "TRUE") {
        var tbWacthListItem = [];
        
        if (N2N_CONFIG.recentQuote) {
            tbWacthListItem.push({
                id: 'tbwl_recent',
                text: languageFormat.getLanguage(20018, 'Recent Quotes'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.recentQuote,
                notDDMenu: true
            });
        }
        if (showWatchListView == "TRUE" && !isGuestUser) {
            tbWacthListItem.push({
                id: 'tbwl_view',
                text: languageFormat.getLanguage(20002, 'View Watchlist'),
                disabled: true,
                cls: 'x-menu-item-medium',
                notDDMenu: true
            });
        }
        if (showWatchListCreate == "TRUE") {
            tbWacthListItem.push({
                id: 'tbwl_create',
                text: languageFormat.getLanguage(20003, 'Create Watchlist'),
                cls: 'x-menu-item-medium',
                disabled: isGuestUser && N2N_CONFIG.requiredLoginUrl === '',
                handler: menuHandler.createWatchList,
                notDDMenu: true
                    });
                }
        if (showWatchListRename == "TRUE" && !isGuestUser) {
            tbWacthListItem.push({
                id: 'tbwl_rename',
                text: languageFormat.getLanguage(20004, 'Rename Watchlist'),
                disabled: true,
                cls: 'x-menu-item-medium',
                notDDMenu: true
            });
        }
        if (showWatchListDelete == "TRUE" && !isGuestUser) {
            tbWacthListItem.push({
                id: 'tbwl_delete',
                text: languageFormat.getLanguage(20005, 'Delete Watchlist'),
                disabled: true,
                cls: 'x-menu-item-medium',
                notDDMenu: true
            });
        }
        
        var menuWatchList = new Ext.menu.Menu({
            cls: 'x-menu-medium',
            items: tbWacthListItem
        });
        tbMenuWatchList = {
            id: 'tbWL',
            text: languageFormat.getLanguage(20001, 'Watchlist'),
            iconCls: 'icon-menu-watchlist',
            menu: menuWatchList,
            listeners: menuListeners()
        };
    }

    // Menu Stk Info
    if (showStkInfoHeader == "TRUE") {
        var tbStkInfoItem = [];
        // Menu Stk Info -> Stk Info        
        if (showStkInfoStkInfo == "TRUE") {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20021, 'Stock Info'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.stockInfo
            });
        }

        if (showStkInfoMarketDepth == "TRUE") {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20022, 'Market Depth'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.marketDepth
            });
        }

        if (showStkInfoMarketMatrixDepth.toLowerCase() == "true") {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20023, 'Depth Matrix'),
                cls: 'x-menu-item-medium',
                handler: function() {
                    createMarketDepthMatrixPanel();
                }
            });
        }



        if (showStkInfoTracker == "TRUE") {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20024, 'Stock Tracker'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.tracker
            });
        }

        if (showStkInfoEquitiesTracker == "TRUE") {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20025, 'Equities Tracker'),
                cls: 'x-menu-item-medium',
                handler: function() {
                    var stk = n2nLayoutManager.getActiveRecord();
                    if (stk) {
                        n2ncomponents.createEquitiesTracker(stk.stkCode);
                    }
                }
            });
        }

        // Menu: Stock Info -> Historical Data
        if (N2N_CONFIG.features_HistoricalData) {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20060, 'Historical Data'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.historicalData
            });
        }
        
        // Menu: Stock Info -> Broker Q
        if (N2N_CONFIG.stockInfo_BrokerQ) {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(0, 'Broker Queue'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.brokerQ
            });
        }
        
        if (N2N_CONFIG.pseBoardLotTableURL) {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20099, 'PSE Board Lot Table'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.pseBoardLotTable
            });
        }

        var menuCount = tbStkInfoItem.length;
        if (menuCount > 1) {
            var menuStkInfo = {
                cls: 'x-menu-medium',
                items: tbStkInfoItem
            };

            tbMenuStkInfo = {
                id: 'tbSI',
                text: languageFormat.getLanguage(20021, 'Stock Info'),
                iconCls: 'icon-menu-stockinfo',
                cls: 'fixpadding',
                menu: menuStkInfo,
                listeners: menuListeners()
            };
        } else if (menuCount == 1) {
            tbMenuStkInfo = tbStkInfoItem[0];
            tbMenuStkInfo.cls = '';
        }
    }
    
    if (showEmoHeader == "TRUE") { //v1.3.30.21
        tbMenuFEmoChat = {
            id: 'tbEmo',
            text: languageFormat.getLanguage(20646, 'Emo'),
            iconCls: 'icon-menu-emo',
            handler: function () {
                msgutil.openURL({
                    url: '../popEMO.jsp?userParam=' + global_userParam,
                    spec: 'width=300,height=550,left=650,top=50, location=no'
                });
            },
            listeners: menuListeners()
        };

    }

    if (N2N_CONFIG.features_Calculator) {
        var calcMenuItems = [];

        if (N2N_CONFIG.breakEvenCalc) {
            calcMenuItems.push({
                text: languageFormat.getLanguage(20622, 'Breakeven Calculator'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.breakEvenCalc
            });
        }        
        if (N2N_CONFIG.perEPSCalc) {
            calcMenuItems.push({
                text: languageFormat.getLanguage(21005, 'P/E Ratio & EPS Calculator'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.PERatioEPSCalc
            });
        }
        if (N2N_CONFIG.calcURL != '') {
            calcMenuItems.push({
                text: languageFormat.getLanguage(20623, 'Calculator'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.externalCalc
            });
        }

        if (N2N_CONFIG.tradeCal) {
            calcMenuItems.push({
                text: languageFormat.getLanguage(31600, 'Trade Calculator'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.tradeCal
            });
        }

        if (calcMenuItems.length > 0) {
            tbMenuFCalculator = {
            	id: 'tbCalc',
                text: languageFormat.getLanguage(20621, 'Calculator'),
                iconCls: 'icon-menu-calculator',
                menu: Ext.create('Ext.menu.Menu', {
                    cls: 'x-menu-medium',
                    items: calcMenuItems
                }),
                listeners: menuListeners()
            };
        }

    }

    if (showWebReportHeader == "TRUE") {
        var tbWebReport = [];

        if (webReportClientSummaryURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportClientSummaryURL);
        }

        if (webReportMonthlyStatementURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportMonthlyStatementURL);
        }

        if (webReportMarginAccountSummaryURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportMarginAccountSummaryURL);
        }

        if (webReportTraderDepositReportURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportTraderDepositReportURL);
        }

        if (webReportTradeBeyondReportURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportTradeBeyondReportURL);
        }

        if (webReporteContractURL.length != 0) {
            createReportSubMenu(tbWebReport, webReporteContractURL);
        }

        if (webReportAISBeStatementURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportAISBeStatementURL);
        }

        if (webReportMarginPortFolioValuationURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportMarginPortFolioValuationURL);
        }

        if (webReportTransactionMovementURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportTransactionMovementURL);
        }

        if (webReportClientTransactionStatementURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportClientTransactionStatementURL);
        }

        if (webReportStockBalanceURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportStockBalanceURL);
        }


        var menuWebReport = new Ext.menu.Menu({
            cls: 'x-menu-medium',
            items: tbWebReport
        });

        tbMenuReports = {
            id: 'tbMenuReports',
            text: languageFormat.getLanguage(20242, 'Reports'),
            iconCls: 'icon-menu-report',
            menu: menuWebReport,
            listeners: menuListeners()
        };
    }

    // Portfolio Menu
    if (showPortFolioHeader == "TRUE") {
        var tbPortFolio = [];

        if (global_showPortFolioDerivativePortFolio == "TRUE") {
            tbPortFolio.push({
                id: 'derivativePortfolio',
                text: languageFormat.getLanguage(20263, 'Derivatives Portfolio'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.derivativePrtf
            });
        }

        if (showPortFolioMyPortFolio == "TRUE") {
            tbPortFolio.push({
                id: 'myPortfolio',
                text: languageFormat.getLanguage(20262, 'Equities Portfolio'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.equityPrtf
            });
        }
        
        if (showFundPortFolio == "TRUE") {
            tbPortFolio.push({
                id: 'myFundPortfolio',
                text: languageFormat.getLanguage(33690, 'Mutual Fund Portfolio'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.fundPrtf
            });
        }
        
        if (N2N_CONFIG.CFDHoldings) {
            tbPortFolio.push({
                id: 'cfdHoldings',
                text: 'CFD Holdings',
                cls: 'x-menu-item-medium',
                handler: menuHandler.cfdHoldings
            });
        }
        
        if (showPortFolioRealizedGainLoss == "TRUE") {
            tbPortFolio.push({
                id: 'portfolioRealizedGainLoss',
                text: languageFormat.getLanguage(20265, 'Realised Gain/Loss'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.realizedPrtf
            });
        }
        
        if (global_showPortFolioManualPortFolio == "TRUE") {
            tbPortFolio.push({
                id: 'manualPortfolio',
                text: languageFormat.getLanguage(20264, 'Manual Portfolio'),
                cls: 'x-menu-item-medium',
                handler: function() {
                    createEquityManualPortFolioPanel('');
                    resetOrderPad();	// to reset Order Pad
                }
            });
        }

        if (global_showMigratedPortFolioHeader.toLowerCase() == 'true') {
            var tempMigratedPortFolioitems = [];

            if (global_showMigratedPortFolioDetail.toLowerCase() == 'true') {
                tempMigratedPortFolioitems.push({
                    text: languageFormat.getLanguage(20286, 'Migrated Portfolio Detail'),
                    cls: 'x-menu-item-medium',
                    handler: function() {
                    	var url = global_portFolioDetailURL + '?lang=' + global_Language;
                        if (N2N_CONFIG.newWin_Other) {

                            if (window.name == "_migrated_Portfoliodetail")
                                window.name = ""; //if tclite load on new_tab then name that win to blank

                            msgutil.openURL({
                                url: url,
                                name: '_migrated_Portfoliodetail'
                            });

                        } else {

                            if (userReport['_migrated_Portfoliodetail'] == null) {
                                var tempTab = Ext.create('Ext.ux.IFrame', {
                                    id: 'userReport_migrated_Portfoliodetail',
                                    // height: 300,
                                    url: url,
                                    iframeScroll: true,
                                    title: languageFormat.getLanguage(20286, 'Migrated Portfolio Detail')
                                });

                                tempTab.on('beforedestroy', function() {
                                    userReport[ '_migrated_Portfoliodetail' ] = null;
                                });

                                n2nLayoutManager.addItem(tempTab);
                                userReport['_migrated_Portfoliodetail'] = tempTab;
                            }

                            n2nLayoutManager.activateItem(userReport['_migrated_Portfoliodetail']);
                            userReport['_migrated_Portfoliodetail'].refresh(url);
                        }
                    }
                });
            }

            if (global_showMigratedPortFolioRealized.toLowerCase() == 'true') {
                tempMigratedPortFolioitems.push({
                    text: languageFormat.getLanguage(20284, 'Migrated Realised Gain/Loss'),
                    cls: 'x-menu-item-medium',
                    handler: function() {
                    	var url = global_portFolioRealizedURL + '?lang=' + global_Language;
                        if (N2N_CONFIG.newWin_Other) {

                            if (window.name == "_migrated_realizedgainlose")
                                window.name = "";

                            msgutil.openURL({
                                url: url,
                                name: '_migrated_realizedgainlose'
                            });
                        } else {
                            if (userReport['_migrated_realizedgainlose'] == null) {
                                var tempTab = Ext.create('Ext.ux.IFrame', {
                                    id: 'userReport_migrated_realizedgainlose',
                                    // height: 300,
                                    url: url,
                                    iframeScroll: true,
                                    title: languageFormat.getLanguage(20284, 'Migrated Realised Gain/Loss')
                                });

                                tempTab.on('beforedestroy', function() {
                                    userReport[ '_migrated_realizedgainlose' ] = null;
                                });

                                n2nLayoutManager.addItem(tempTab);
                                userReport[ '_migrated_realizedgainlose' ] = tempTab;
                            }

                            n2nLayoutManager.activateItem(userReport['_migrated_realizedgainlose']);
                            userReport['_migrated_realizedgainlose'].refresh(url);
                        }
                    }
                });
            }

            tbPortFolio.push({
                text: languageFormat.getLanguage(20266, 'Migrated Portfolio'),
                cls: 'x-menu-item-medium',
                menu: new Ext.menu.Menu({
                    cls: 'x-menu-medium',
                    items: tempMigratedPortFolioitems
                })
            });
        }

        var menuPortFolio = new Ext.menu.Menu({
            cls: 'x-menu-medium',
            items: tbPortFolio
        });

        tbMenuPortfolio = {
            id: 'tbPrtf',
            text: languageFormat.getLanguage(20261, 'Portfolio'),
            iconCls: 'icon-menu-portfolio',
            menu: menuPortFolio,
            listeners: menuListeners()
        };
    }


    tbMenuOrderPad = {
        text: languageFormat.getLanguage(20831, 'Order Pad'),
        handler: function() {
            createOrderPad(null, null, false);
        }
    };

    if (showOrdBookHeader == "TRUE") {
        var tbOrderbook = [];
        if (showOrdBookOrderSts == "TRUE") {
            tbOrderbook.push({
                id: 'ord_stat',
                text: languageFormat.getLanguage(20172, 'Order Status'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.orderStatus
            });
        }
        
        if (showMFOrdBookOrderSts == "TRUE") {
            tbOrderbook.push({
                id: 'mford_stat',
                text: languageFormat.getLanguage(33720, 'Mutual Fund Order Book'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.mfOrderStatus
            });
        }

        if (showOrdBookOrderHistory == "TRUE") {
            tbOrderbook.push({
                id: 'ord_history',
                text: languageFormat.getLanguage(20173, 'Order History'),
                cls: 'x-menu-item-medium',
                handler: function() {
                    resetOrderPad();
                    createOrdHistoryPanel();
                }
            });
        }
        
        if (showMFOrdBookOrderHistory == "TRUE") {
            tbOrderbook.push({
                id: 'mf_ord_history',
                text: languageFormat.getLanguage(20245, ' Mutual Fund Order History'),
                cls: 'x-menu-item-medium',
                handler: function() {
                    resetOrderPad();
                    createMFOrdHistoryPanel();
                }
            });
        }

        if (showOrdBookOrderLog == "TRUE") {
            tbOrderbook.push({
                id: 'ord_log',
                text: languageFormat.getLanguage(20174, 'Order Log'),
                disabled: true,
                cls: 'x-menu-item-medium',
                handler: function() {
                    resetOrderPad();
                    createOrdLogPanel();
                    orderLogPanel.callOrdLog();
                }
            });
        }
        
        tbOrderbook.push({
            id: 'ord_basket',
            text: languageFormat.getLanguage(32013, 'Basket Order'),
            cls: 'x-menu-item-medium',
            //icon: icoBtnOrdSts24,
            hidden: !N2N_CONFIG.basketOrder,
            handler: menuHandler.basketOrder
        });

        var menuOrderBook = new Ext.menu.Menu({
            cls: 'x-menu-medium',
            items: tbOrderbook
        });

        tbMenuOrdSts = {
            id: 'tbOS',
            cls: 'fixpadding',
            text: languageFormat.getLanguage(20171, 'Order Book'),
            iconCls: 'icon-menu-orderbook',
            menu: menuOrderBook,
            listeners: menuListeners()
        };
    }

    if (showExchangeHeader == "TRUE") {
        tbMenuExchg = {
            id: 'tbEx',
            text: languageFormat.getLanguage(20301, 'Exchange'),
            iconCls: 'icon-menu-exchange',
            listeners: menuListeners()
                    // arrowAlign:'bottom'
        };
    }

    /* 12/1/2016 moved under Market Menu
    if (global_TrackerRecord.toLowerCase() == 'true') {
        tbMenuTrackerRecord = {
        	id: 'tbTR',
            text: languageFormat.getLanguage(20501, 'Tracker Record'),
            handler: function() {
            	try {
                    n2ncomponents.createTrackerRecord();
                } catch (e) {
                    console.log(e);
                }
            }
        };
    }*/




    if (N2N_CONFIG.features_Analysis) {
        var tbMenuAnalysis = [];

        if (N2N_CONFIG.features_Analysis_Dividend) {
            tbMenuAnalysis.push({
                text: languageFormat.getLanguage(20141, 'Dividend'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.analysisDividend
            });
        }

        if (N2N_CONFIG.features_Analysis_Warrants) {
            tbMenuAnalysis.push({
                text: languageFormat.getLanguage(20142, 'Warrants'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.analysisWarrants
            });
        }

        if (N2N_CONFIG.features_Analysis_BMFutures) {
            tbMenuAnalysis.push({
                text: languageFormat.getLanguage(20143, 'BMD Futures'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.analysisBMD_Future
            });
        }
        if (N2N_CONFIG.features_Analysis_ForeignFlow) {
            tbMenuAnalysis.push({
                text: languageFormat.getLanguage(20653, 'Flow Analysis'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.foreignFlow
            });
        }
        if (N2N_CONFIG.features_Analysis_BrokerInfo) {
            tbMenuAnalysis.push({
                text: languageFormat.getLanguage(11060, 'Broker Info'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.brokerInfo
            });
        }
        if (N2N_CONFIG.features_Analysis_BrokerSearch) {
            tbMenuAnalysis.push({
                text: languageFormat.getLanguage(31820, 'Broker Search'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.brokerSearch
            });
        }
        if (N2N_CONFIG.features_Analysis_BrokerSearch) {
            tbMenuAnalysis.push({
                text: languageFormat.getLanguage(31800, 'Broker Queue'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.brokerQ
            });
        }

        var menuMenuAnalysis = new Ext.menu.Menu({
            cls: 'x-menu-medium',
            items: tbMenuAnalysis
        });

        tbMenuAnalysiss = {
            id: "tbMenuAnalysis",
            text: languageFormat.getLanguage(20144, 'Analysis'),
            iconCls: 'icon-menu-analysis',
            menu: menuMenuAnalysis,
            listeners: menuListeners()
        };
    }

    if (showSettingHeader == "TRUE") {
        var tbMenuSetting = [];

        if (showSettingStockAlert == "TRUE") {
            tbMenuSetting.push({
                id: 'stockalert',
                iconCls: 'icon-menu-stockalert',
                text: languageFormat.getLanguage(20602, 'Stock Alert'),
                cls: 'x-menu-item-medium',
                handler: function() {

                    if (N2N_CONFIG.newWin_Other) {

                        if (window.name == "_stockalert ")
                            window.name = ""; //if tclite load on new_tab then name that win to blank

                        msgutil.openURL({
                            url: settingStockAlertURL + '?BHCode=' + bhCode + '&Clicode=' + cliCode + '&Mobile=' + mobileNo + '&Email=' + emailAdd + '&LoginID=' + loginId + '&Encrypt=N&fontSize=11&lang=en&exchg=' + exchangecode + '&' + new Date().getTime(),
                            name: '_stockalert'
                        });
                    } else {

                        if (userReport['userReport_stockalert'] == null) {
                            var tempTab = Ext.create('Ext.ux.IFrame', {
                                title: languageFormat.getLanguage(20602, 'Stock Alert'),
                                id: 'userReport_stockalert',
                                // height: !n2nLayoutManager.isTabLayout() ? 310 : quoteScreen.up().up().body.getHeight() - 2,
                                url: settingStockAlertURL + '?BHCode=' + bhCode + '&Clicode=' + cliCode + '&Mobile=' + mobileNo + '&Email=' + emailAdd + '&LoginID=' + loginId + '&Encrypt=N&fontSize=11&lang=en&exchg=' + exchangecode + '&' + new Date().getTime(),
                                iframeScroll: true,
                                type: 'stock_alert',
                                winConfig: {
                                    width: 865,
                                    height: 490
                                }
                            });

                            tempTab.on('beforedestroy', function() {
                                userReport[ 'userReport_stockalert' ] = null;
                            });

                            userReport[ 'userReport_stockalert' ] = tempTab;
                            n2nLayoutManager.addItem(tempTab);
                            n2nLayoutManager.activateItem(tempTab);
                            tempTab.refresh(tempTab.url);

                        } else {
                            n2nLayoutManager.activateItem(userReport['userReport_stockalert']);
                            userReport[ 'userReport_stockalert' ].refresh(settingStockAlertURL + '?BHCode=' + bhCode + '&Clicode=' + cliCode + '&Mobile=' + mobileNo + '&Email=' + emailAdd + '&LoginID=' + loginId + '&Encrypt=N&fontSize=11&lang=en&exchg=' + exchangecode + '&' + new Date());
                        }
                    }
                }
            });
        }

        // Add Stock Alert menu
        if (N2N_CONFIG.featuresSetting_AddStockAlert) {
            tbMenuSetting.push({
                text: languageFormat.getLanguage(20603, 'Add Stock Alert'),
                cls: 'x-menu-item-medium',
                handler: function() {
                    var record = n2nLayoutManager.getActiveRecord();
                    n2ncomponents.createAddStockAlert(record.stkCode);
                }
            });
        }

        if (N2N_CONFIG.featuresSetting_PriceAlert) {
            tbMenuSetting.push({
                id: 'pricealert',
                text: languageFormat.getLanguage(20608, 'Price Alert'),
                cls: 'x-menu-item-medium',
                handler: function() {
                    createPriceAlert();
                }
            });
        }

        if (showUISetting == "TRUE") {
            tbMenuSetting.push({
                id: 'setUI',
                text: languageFormat.getLanguage(20617, 'Settings'),
                cls: 'x-menu-item-medium',
                notDDMenu: true,
                handler: function() {
                    n2ncomponents.settingUI();
                }
            });

        }
        if (configutil.getDefaultTrueConfig(showTickerSetting)) {
            tbMenuSetting.push({
                id: 'tickerSettingSubMenu',
                text: languageFormat.getLanguage(20610, 'Ticker'),
                tooltip: languageFormat.getLanguage(30125, 'Manage how to display the ticker bar'),
                tooltipType: 'title',
                cls: 'x-menu-item-medium',
                handler: function() {
                    tickerSettingUI();
                }
            });
        }
        if (showLanguageMenu == 'TRUE') {
            tbMenuSetting.push({
            	text: languageFormat.getLanguage(20616, 'Language'),
                showSeparator: false,
                cls: 'x-menu-item-medium',
                notDDMenu: true,
                menu: new Ext.menu.Menu({
                    items: n2ncomponents.languageSetting()
                }),
                onClick: touchExpandSubmenu
            });
        }

        var menuMenuSettings = new Ext.menu.Menu({
            cls: 'x-menu-medium',
            items: tbMenuSetting
        });

        tbMenuSettings = {
            id: "tbSett",
            text: languageFormat.getLanguage(20601, 'Settings'),
            iconCls: 'icon-menu-setting',
            handler: menuHandler.settings,
            //menu: menuMenuSettings,
            listeners: menuListeners()
        };

    }

    if (N2N_CONFIG.menuProfile) {
        var profileMenuItems = new Array();

        // Change password
        if (N2N_CONFIG.profileChgPwdURL != '') {
            profileMenuItems.push({
                text: languageFormat.getLanguage(20612, 'Change Password'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.changePwd
            });
        }

        // Forgot password
        if (N2N_CONFIG.profileForPwdURL != '') {
            profileMenuItems.push({
                text: languageFormat.getLanguage(20613, 'Forgot Password'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.forgotPwd
            });
        }

        // Change Pin
        if (N2N_CONFIG.profileChgPinURL != '') {
            profileMenuItems.push({
                text: languageFormat.getLanguage(20614, 'Change Pin'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.changePin
            });
        }

        // Forgot Pin
        if (N2N_CONFIG.profileForPinURL != '') {
            profileMenuItems.push({
                text: languageFormat.getLanguage(20615, 'Forgot Pin'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.forgotPin
            });
        }

        if (profileMenuItems.length > 0) {
            var profileSubMenu = new Ext.menu.Menu({
                cls: 'x-menu-medium',
                items: profileMenuItems
            });
            MENU.profile = {
                text: languageFormat.getLanguage(20611, 'Profile'),
                menu: profileSubMenu
            };
        }
    }

    if (global_showOtherToolHeader.toLowerCase() == 'true') {

        var tempOtherToolItems = [];
        
        if ( global_otherToolStockScreenerURL.length > 0 ) {
    		tempOtherToolItems.push( {
				text	: languageFormat.getLanguage(20522, 'Stock Filter'),
				cls	: 'x-menu-item-medium',
				handler	: menuHandler.openStockScreenerWin
    		} );
    	}

        if (global_showOtherToolStockFilter.toLowerCase() == 'true') {
            tempOtherToolItems.push({
                text: languageFormat.getLanguage(20522, 'Stock Filter'),
                cls: 'x-menu-item-medium',
                handler: function() {

                    if (N2N_CONFIG.newWin_StkFilter) {

                        if (window.name == "_otherTool_StockFilter")
                            window.name = ""; //if tclite load on new_tab then name that win to blank

                        msgutil.openURL({
                            url: global_otherToolStockFilterURL + '?BHCode=' + bhCode + '&Clicode=' + cliCode + '&Mobile=' + mobileNo + '&Email=' + emailAdd + '&LoginID=' + loginId + '&Encrypt=N&fontSize=11&lang=en&exchg=' + exchangecode + '&' + new Date().getTime(),
                            name: '_stockalert'
                        });
                    } else {

                        if (userReport['userReport_otherTool_StockFilter'] == null) {
                            var tempTab = Ext.create('Ext.ux.IFrame', {
                                title: languageFormat.getLanguage(20522, 'Stock Filter'),
                                id: 'userReport_otherTool_StockFilter',
                                // height: tabPanel1.body.getHeight(),
                                url: global_otherToolStockFilterURL,
                                iframeScroll: true
                            });

                            tempTab.on('beforedestroy', function() {
                                userReport[ 'userReport_otherTool_StockFilter' ] = null;
                            });

                            tempTab.refresh(tempTab.url);

                            userReport[ 'userReport_otherTool_StockFilter' ] = tempTab;

                        } else {

//								userReport[ 'userReport_otherTool_StockFilter' ].url = global_otherToolStockFilterURL;
                            userReport[ 'userReport_otherTool_StockFilter' ].refresh(global_otherToolStockFilterURL);

                            for (var i = 0; i < tabPanel1.items.length; i++) {
                                var tempComponent = tabPanel1.getComponent(i).getComponent(0);

                                if (tempComponent.id == 'userReport_otherTool_StockFilter') {
                                    tabPanel1.setActiveTab(i);
                                    break;
                                }
                            }
                        }
                    }
                }
            });
        }

        if (global_showOtherToolExchangeRate.toLowerCase() == 'true') {
            tempOtherToolItems.push({
                text: languageFormat.getLanguage(20523, 'Exchange Rate'),
                cls: 'x-menu-item-medium',
                handler	: menuHandler.openExchangeRateWin
            });
        }
        
        if(global_showOtherToolFXConversion.toLowerCase() == 'true'){
            tempOtherToolItems.push( {
			text	: languageFormat.getLanguage(21250, 'FX Conversion - CUT'),
            cls		: 'x-menu-item-medium',
			handler	: function() {
						menuHandler.FXConversion();}
                    });
        }
        
        if(theScreenerURL.length > 0){
            tempOtherToolItems.push( {
			text	: languageFormat.getLanguage(20525, 'TheScreener'),
            cls		: 'x-menu-item-medium',
			handler	: function() {
						menuHandler.theScreener();}
                    });
        }
        
        if(N2N_CONFIG.iBillionaireURL.length > 0){
            tempOtherToolItems.push( {
			text	: languageFormat.getLanguage(20526, 'iBillionaire'),
            cls		: 'x-menu-item-medium',
			handler	: function() {
						menuHandler.iBillionaire();}
                    });
        } 
        
        if (N2N_CONFIG.otherToolStreamer) {
            tempOtherToolItems.push({
                text: languageFormat.getLanguage(20157, 'Streamer'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.streamer
            });
        }

        tbMenuOtherTool = {
            text: languageFormat.getLanguage(20521, 'Tools'),
            iconCls: 'icon-menu-tool',
            id: 'tbTools',
            menu: new Ext.menu.Menu({
                cls: 'x-menu-medium',
                items: tempOtherToolItems
            }),
            listeners: menuListeners()
        };
    }
    
    if (configutil.getTrueConfig(showUserGuide)) { //v1.3.30.21    	
    	tbMenuUserGuide = {
            id: 'tbUG',
            text: languageFormat.getLanguage(21230, 'User Guide'),
            iconCls: 'icon-menu-userguide',
            handler: menuHandler.userGuide,
            listeners: menuListeners()
    	};			
    }

    if (configutil.getTrueConfig(showBuySellHeader)) {
        tbMenuBuy = {
            id: 'tbBuy',
            text: '&nbsp;' + languageFormat.getLanguage(10001, 'Buy') + '&nbsp;',
            iconCls: 'icon-menu-buy',
            //           width:50,
            handler: menuHandler.buy,
            listeners: menuListeners()
        };

        tbMenuSell = {
            id: 'tbSell',
            text: '&nbsp;' + languageFormat.getLanguage(10002, 'Sell') + '&nbsp;',
            iconCls: 'icon-menu-sell',
//            width: 50,
            handler: menuHandler.sell,
            listeners: menuListeners()
        };
    }

    if (configutil.getTrueConfig(showChartHeader)) {

        var tbChartItem = new Array();

        if (configutil.getTrueConfig(showChartIntradayChart)) {
            tbChartItem.push({
                text: languageFormat.getLanguage(20101, 'Intraday Chart'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.intradayChart
            });
        }

        if (configutil.getTrueConfig(showChartAnalysisChart)) {
            tbChartItem.push({
                text: languageFormat.getLanguage(20102, 'Analysis Chart'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.analysisChart
            });
        }

        if (configutil.getTrueConfig(showChartITFinanceChart)) {
            tbChartItem.push({
                text: languageFormat.getLanguage(20113, 'IT Finance Chart'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.itFinanceChart
            });
        }

        var menuCount = tbChartItem.length;
        if (menuCount > 1) {
            var menuChart = new Ext.menu.Menu({
                cls: 'x-menu-medium',
                items: tbChartItem
            });

            tbMenuChart = {
                id: 'tbCht',
                text: languageFormat.getLanguage(20103, 'Chart'),
                iconCls: 'icon-menu-chart',
                menu: menuChart,
                listeners: menuListeners()
            };
        } else if (menuCount == 1) {
            tbMenuChart = tbChartItem[0];
            tbMenuChart.cls = '';
        }
    }

}

function mainmenuTools() {
    var mainMenuItems = new Array();

    if (isMobile) {
        mainMenuItems.push({
            id: 'tbQS',
            text: languageFormat.getLanguage(20673, 'Quote'),
            cls: 'toolbar-menu-medium',
            handler: function() {
                createQuoteScreen();
            }
        });
    }
    if (showWatchListHeader == "TRUE") {
        if (tbMenuWatchList)
            mainMenuItems.push(tbMenuWatchList);
    }
    if (showStkInfoHeader == "TRUE") {
        if (tbMenuStkInfo)
            mainMenuItems.push(tbMenuStkInfo);
    }
    if (showChartHeader == "TRUE") {
        if (tbMenuChart)
            mainMenuItems.push(tbMenuChart);
    }
    if (showBuySellHeader == "TRUE") {
        if (tbMenuBuy)
            mainMenuItems.push(tbMenuBuy);
        if (tbMenuSell)
            mainMenuItems.push(tbMenuSell);
    }
    if (showNewsHeader == "TRUE") {
        if (tbMenuNews)
            mainMenuItems.push(tbMenuNews);
    }
    if (N2N_CONFIG.features_Analysis) {
        if (tbMenuAnalysiss)
            mainMenuItems.push(tbMenuAnalysiss);
    }
    if (showMarketHeader == "TRUE") {
        if (tbMenuMarketSummary)
            mainMenuItems.push(tbMenuMarketSummary);
    }
    if (showOrdBookHeader == "TRUE") {
        if (tbMenuOrdSts)
            mainMenuItems.push(tbMenuOrdSts);
    }
    if (showWebReportHeader == "TRUE") {
        if (tbMenuReports)
            mainMenuItems.push(tbMenuReports);
    }
    if (showPortFolioHeader == "TRUE") {
        if (tbMenuPortfolio)
            mainMenuItems.push(tbMenuPortfolio);
    }

    if (global_showOtherToolHeader.toLowerCase() == "true") {
        if (tbMenuOtherTool)
            mainMenuItems.push(tbMenuOtherTool);
    }

    if (showExchangeHeader == "TRUE") {
        if (tbMenuExchg)
            mainMenuItems.push(tbMenuExchg);
    }

    if (global_TrackerRecord.toLowerCase() == 'true') {
        if (tbMenuTrackerRecord)
            mainMenuItems.push(tbMenuTrackerRecord);
    }
    
    if (showSettingHeader == "TRUE") {
        if (tbMenuSettings)
            mainMenuItems.push(tbMenuSettings);
    }
    if (MENU.profile != null) {
        mainMenuItems.push(MENU.profile);
    }
    if (showEmoHeader == "TRUE") { //v1.3.30.21
        if (tbMenuFEmoChat)
            mainMenuItems.push(tbMenuFEmoChat);
    }
    if (N2N_CONFIG.features_Calculator) {
        if (tbMenuFCalculator)
            mainMenuItems.push(tbMenuFCalculator);
    }

    if (global_showFullScreen.toLowerCase() == 'true') {
        var mnText = languageFormat.getLanguage(20633, 'Standard');
        var urlmain = window.parent.location.href.toString().split(window.parent.location.host)[1].indexOf("indexMin.jsp") != -1 ? false : true;

        if (urlmain) {
            global_onFullScreen = false;

            mnText = '&nbsp;&nbsp;' + languageFormat.getLanguage(20632, 'Full') + '&nbsp;&nbsp;';
        } else {
            global_onFullScreen = true;
        }

        mainMenuItems.push({
            text: mnText,
            handler: function() {
                var goPath = '';

                if (global_onFullScreen) {
                    goPath = sStdScreenUrl == '' || sStdScreenUrl == null ? 'index.jsp' : sStdScreenUrl;
                } else {
                    goPath = sFullScreenUrl == '' || sFullScreenUrl == null ? 'indexMin.jsp' : sFullScreenUrl;
                }

                if (sFullScreenUrl == '' || sFullScreenUrl == null)
                    window.parent.location = goPath;
                else
                    top.location.href = goPath;
            }
        });
    }

    mainMenuItems.push({
        xtype: 'menuseparator'
    });

    if (global_logoutButton.toLowerCase() == 'true') {
        mainMenuItems.push({
            text: languageFormat.getLanguage(10006, 'Logout'),
            cls: 'toolbar-menu-medium',
            handler: function() {
                menuHandler.logout();
            }
        });
    }

    return mainMenuItems;
}

function initializeMainMenuToolItems() {
    var me = this;

    if (showMarketHeader == "TRUE") {
        var tbMarketItem = [];
        if (showMarketSummary == "TRUE") {
            tbMarketItem.push({
                text: languageFormat.getLanguage(20050, 'Summary'),
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.marketSummary
            });
        }

        if (showMarketIndices == "TRUE") {
            tbMarketItem.push({
                text: languageFormat.getLanguage(20029, 'Indices'),
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.indices
            });
        }

        if (showMarketScoreBoard == "TRUE") {
            tbMarketItem.push({
                text: languageFormat.getLanguage(20156, 'Scoreboard'),
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.scoreBoard
            });
        }
        if (configutil.getTrueConfig(showMarketStreamer)) {
            tbMarketItem.push({
                text: languageFormat.getLanguage(20157, 'Streamer'),
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.streamer
            });
        }

        if (configutil.getTrueConfig(showMarketWorldIndices)) {
            tbMarketItem.push({
                text: languageFormat.getLanguage(20158, 'World Indices'),
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.worldIndices
            });
        }

        var menuCount = tbMarketItem.length;
        if (menuCount > 1) {
            var menuMarket = new Ext.menu.Menu({
                items: tbMarketItem
            });

            tbMenuMarketSummary = {
                id: 'tbMS',
                text: languageFormat.getLanguage(20151, 'Market'),
                cls: 'toolbar-menu-medium',
                //disabledCls: 'disabled-menu-medium',
                showSeparator: false,
                hideOnClick: false,
                menu: menuMarket
            };
        } else if (menuCount == 1) {
            tbMenuMarketSummary = tbMarketItem[0];
            tbMenuMarketSummary.cls = '';
        }
    }

    if (showNewsHeader == "TRUE") {
        initializeNewsMenu();

        var menuCount = tbNewsItem.length;
        if (menuCount > 1) {
            var menuNews = {
                items: tbNewsItem
            };

            tbMenuNews = {
                id: 'tbNews',
                text: languageFormat.getLanguage(20121, 'News'),
                showSeparator: false,
                hideOnClick: false,
                cls: 'toolbar-menu-medium',
                menu: menuNews
            };
        } else if (menuCount == 1) {
            tbMenuNews = tbNewsItem[0];
            tbMenuNews.cls = '';
        }
    }


    if (showWatchListHeader == "TRUE") {
        var tbWacthListItem = [];
        if (showWatchListView == "TRUE" && !isGuestUser) {
            tbWacthListItem.push({
                id: 'tbwl_view',
                text: languageFormat.getLanguage(20002, 'View Watchlist'),
                showSeparator: false,
                disabled: true,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top'
            });
        }
        if (showWatchListCreate == "TRUE") {
            tbWacthListItem.push({
                id: 'tbwl_create',
                text: languageFormat.getLanguage(20003, 'Create Watchlist'),
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                disabled: isGuestUser && N2N_CONFIG.requiredLoginUrl === '',
                handler: menuHandler.createWatchList
                    });
                }
        if (showWatchListRename == "TRUE" && !isGuestUser) {
            tbWacthListItem.push({
                id: 'tbwl_rename',
                text: languageFormat.getLanguage(20004, 'Rename Watchlist'),
                showSeparator: false,
                disabled: true,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top'
            });
        }
        if (showWatchListDelete == "TRUE" && !isGuestUser) {
            tbWacthListItem.push({
                id: 'tbwl_delete',
                text: languageFormat.getLanguage(20005, 'Delete Watchlist'),
                showSeparator: false,
                disabled: true,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top'
            });
        }

        var menuWatchList = new Ext.menu.Menu({
            cls: 'toolbar-menu-medium',
            items: tbWacthListItem
        });
        tbMenuWatchList = {
            id: 'tbWL',
            text: languageFormat.getLanguage(20001, 'Watchlist'),
            cls: 'toolbar-menu-medium',
            showSeparator: false,
            hideOnClick: false,
            // arrowAlign:'bottom',
            menu: menuWatchList
        };
    }

    // Menu Stk Info
    if (showStkInfoHeader == "TRUE") {
        var tbStkInfoItem = [];
        // Menu Stk Info -> Stk Info        
        if (showStkInfoStkInfo == "TRUE") {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20021, 'Stock Info'),
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.stockInfo
            });
        }

        if (showStkInfoMarketDepth == "TRUE") {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20022, 'Market Depth'),
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.marketDepth
            });
        }

        if (showStkInfoMarketMatrixDepth.toLowerCase() == "true") {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20023, 'Depth Matrix'),
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: function() {
                    createMarketDepthMatrixPanel();
                }
            });
        }



        if (showStkInfoTracker == "TRUE") {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20024, 'Stock Tracker'),
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.tracker
            });
        }

        if (showStkInfoEquitiesTracker == "TRUE") {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20025, 'Equities Tracker'),
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: function() {
                    var stk = n2nLayoutManager.getActiveRecord();
                    if (stk) {
                        n2ncomponents.createEquitiesTracker(stk.stkCode);
                    }
                }
            });
        }

        // Menu: Stock Info -> Historical Data
        if (N2N_CONFIG.features_HistoricalData) {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20060, 'Historical Data'),
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.historicalData
            });
        }
        
        if (N2N_CONFIG.pseBoardLotTableURL) {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20099, 'PSE Board Lot Table'),
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.pseBoardLotTable
            });
        }

        var menuCount = tbStkInfoItem.length;
        if (menuCount > 1) {
            var menuStkInfo = {
                items: tbStkInfoItem
            };

            tbMenuStkInfo = {
                id: 'tbSI',
                text: languageFormat.getLanguage(20021, 'Stock Info'),
                cls: 'toolbar-menu-medium',
                showSeparator: false,
                hideOnClick: false,
                menu: menuStkInfo
            };
        } else if (menuCount == 1) {
            tbMenuStkInfo = tbStkInfoItem[0];
            tbMenuStkInfo.cls = '';
        }
    }
    if (showEmoHeader == "TRUE") { //v1.3.30.21
        tbMenuFEmoChat = {
            id: 'tbEmo',
            text: '&nbsp;&nbsp;&nbsp;' + languageFormat.getLanguage(20646, 'Emo') + '&nbsp;&nbsp;&nbsp',
            showSeparator: false,
            cls: 'toolbar-menu-medium',
            handler: function() {
                msgutil.openURL({
                    url: '../popEMO.jsp?userParam=' + global_userParam,
                    spec: 'width=300,height=550,left=650,top=50, location=no'
                });
            }
        };

    }

    if (N2N_CONFIG.features_Calculator) {
        var calcMenuItems = [];

        if (N2N_CONFIG.breakEvenCalc) {
            calcMenuItems.push({
                text: languageFormat.getLanguage(20622, 'Breakeven Calculator'),
                showSeparator: false,
                handler: menuHandler.breakEvenCalc
            });
        }
        if (N2N_CONFIG.calcURL != '') {
            calcMenuItems.push({
                text: languageFormat.getLanguage(20623, 'Calculator'),
                showSeparator: false,
                handler: function() {
                    n2ncomponents.createMFCalc();
                }
            });
        }

        if (calcMenuItems.length > 0) {
            tbMenuFCalculator = {
                text: languageFormat.getLanguage(20621, 'Calculator'),
                showSeparator: false,
                hideOnClick: false,
                cls: 'toolbar-menu-medium',
                menu: Ext.create('Ext.menu.Menu', {
                    items: calcMenuItems
                })
            };
        }

    }

    if (showWebReportHeader == "TRUE") {
        var tbWebReport = [];

        if (webReportClientSummaryURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportClientSummaryURL);
        }

        if (webReportMonthlyStatementURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportMonthlyStatementURL);
        }

        if (webReportMarginAccountSummaryURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportMarginAccountSummaryURL);
        }

        if (webReportTraderDepositReportURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportTraderDepositReportURL);
        }

        if (webReportTradeBeyondReportURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportTradeBeyondReportURL);
        }

        if (webReporteContractURL.length != 0) {
            createReportSubMenu(tbWebReport, webReporteContractURL);
        }

        if (webReportAISBeStatementURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportAISBeStatementURL);
        }

        if (webReportMarginPortFolioValuationURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportMarginPortFolioValuationURL);
        }

        if (webReportTransactionMovementURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportTransactionMovementURL);
        }

        if (webReportClientTransactionStatementURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportClientTransactionStatementURL);
        }

        if (webReportStockBalanceURL.length != 0) {
            createReportSubMenu(tbWebReport, webReportStockBalanceURL);
        }


        var menuWebReport = new Ext.menu.Menu({
            items: tbWebReport
        });

        tbMenuReports = {
            id: 'tbMenuReports',
            text: languageFormat.getLanguage(20242, 'Reports'),
            showSeparator: false,
            hideOnClick: false,
            cls: 'toolbar-menu-medium',
            menu: menuWebReport
        };
    }

    // Portfolio Menu
    if (showPortFolioHeader == "TRUE") {
        var tbPortFolio = [];

        if (global_showPortFolioDerivativePortFolio == "TRUE") {
            tbPortFolio.push({
                id: 'derivativePortfolio',
                text: languageFormat.getLanguage(20263, 'Derivatives Portfolio'),
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                handler: menuHandler.derivativePrtf
            });
        }

        if (showPortFolioMyPortFolio == "TRUE") {
            tbPortFolio.push({
                id: 'myPortfolio',
                text: languageFormat.getLanguage(20262, 'Equities Portfolio'),
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                handler: menuHandler.equityPrtf
            });
        }
        
        if (showFundPortFolio == "TRUE") {
            tbPortFolio.push({
                id: 'myFundPortfolio',
                text: languageFormat.getLanguage(33690, 'Mutual Fund Portfolio'),
                cls: 'x-menu-item-medium',
                handler: menuHandler.fundPrtf
            });
        }

        if (global_showPortFolioManualPortFolio == "TRUE") {
            tbPortFolio.push({
                id: 'manualPortfolio',
                text: languageFormat.getLanguage(20264, 'Manual Portfolio'),
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                handler: function() {
                    createEquityManualPortFolioPanel('');
                    resetOrderPad();	// to reset Order Pad
                }
            });
        }

        if (showPortFolioRealizedGainLoss == "TRUE") {
            tbPortFolio.push({
                id: 'portfolioRealizedGainLoss',
                text: languageFormat.getLanguage(20265, 'Realised Gain/Loss'),
                cls: 'toolbar-menu-item-medium',
                showSeparator: false,
                handler: menuHandler.realizedPrtf
            });
        }

        if (global_showMigratedPortFolioHeader.toLowerCase() == 'true') {
            var tempMigratedPortFolioitems = [];

            if (global_showMigratedPortFolioDetail.toLowerCase() == 'true') {
                tempMigratedPortFolioitems.push({
                    text: languageFormat.getLanguage(20267, 'Portfolio Detail'),
                    cls: 'toolbar-menu-item-medium',
                    showSeparator: false,
                    handler: function() {
                    	var url = global_portFolioDetailURL + '?lang=' + global_Language;
                        if (N2N_CONFIG.newWin_Other) {

                            if (window.name == "_migrated_Portfoliodetail")
                                window.name = ""; //if tclite load on new_tab then name that win to blank

                            msgutil.openURL({
                                url: url,
                                name: '_migrated_Portfoliodetail'
                            });

                        } else {

                            if (userReport['_migrated_Portfoliodetail'] == null) {
                                var tempTab = Ext.create('Ext.ux.IFrame', {
                                    id: 'userReport_migrated_Portfoliodetail',
                                    // height: 300,
                                    url: url,
                                    iframeScroll: true,
                                    title: languageFormat.getLanguage(20286, 'Migrated Portfolio Detail')
                                });

                                tempTab.on('beforedestroy', function() {
                                    userReport[ '_migrated_Portfoliodetail' ] = null;
                                });

                                n2nLayoutManager.addItem(tempTab);
                                userReport['_migrated_Portfoliodetail'] = tempTab;
                            }

                            n2nLayoutManager.activateItem(userReport['_migrated_Portfoliodetail']);
                            userReport['_migrated_Portfoliodetail'].refresh(url);
                        }
                    }
                });
            }

            if (global_showMigratedPortFolioRealized.toLowerCase() == 'true') {
                tempMigratedPortFolioitems.push({
                    text: languageFormat.getLanguage(20265, 'Realised Gain/Loss'),
                    cls: 'toolbar-menu-item-medium',
                    showSeparator: false,
                    handler: function() {
                    	var url = global_portFolioRealizedURL + '?lang=' + global_Language;
                        if (N2N_CONFIG.newWin_Other) {

                            if (window.name == "_migrated_realizedgainlose")
                                window.name = "";

                            msgutil.openURL({
                                url: url,
                                name: '_migrated_realizedgainlose'
                            });
                        } else {
                            if (userReport['_migrated_realizedgainlose'] == null) {
                                var tempTab = Ext.create('Ext.ux.IFrame', {
                                    id: 'userReport_migrated_realizedgainlose',
                                    // height: 300,
                                    url: url,
                                    iframeScroll: true,
                                    title: languageFormat.getLanguage(20284, 'Migrated Realised Gain/Loss')
                                });

                                tempTab.on('beforedestroy', function() {
                                    userReport[ '_migrated_realizedgainlose' ] = null;
                                });

                                n2nLayoutManager.addItem(tempTab);
                                userReport[ '_migrated_realizedgainlose' ] = tempTab;
                            }

                            n2nLayoutManager.activateItem(userReport['_migrated_realizedgainlose']);
                            userReport['_migrated_realizedgainlose'].refresh(url);
                        }
                    }
                });
            }

            tbPortFolio.push({
                text: languageFormat.getLanguage(20266, 'Migrated Portfolio'),
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                menu: new Ext.menu.Menu({
                    //cls: 'x-menu-medium',
                    items: tempMigratedPortFolioitems
                }),
                onClick: touchExpandSubmenu
            });
        }

        var menuPortFolio = new Ext.menu.Menu({
            items: tbPortFolio
        });

        tbMenuPortfolio = {
            id: 'tbPrtf',
            text: languageFormat.getLanguage(20261, 'Portfolio'),
            hideOnClick: false,
            cls: 'toolbar-menu-medium',
            menu: menuPortFolio
        };
    }


    tbMenuOrderPad = {
        text: languageFormat.getLanguage(20831, 'Order Pad'),
        handler: function() {
            createOrderPad(null, null, false);
        }
    };

    if (showOrdBookHeader == "TRUE") {
        var tbOrderbook = [];
        if (showOrdBookOrderSts == "TRUE") {
            tbOrderbook.push({
                id: 'ord_stat',
                text: languageFormat.getLanguage(20172, 'Order Status'),
                cls: 'toolbar-menu-item-medium',
                handler: menuHandler.orderStatus
            });
        }
        if (showMFOrdBookOrderSts == "TRUE") {
            tbOrderbook.push({
                text: languageFormat.getLanguage(33720, 'Mutual Fund Order Book'),
                id: 'mford_stat',
                iconCls: 'toolbar-menu-item-medium',
                handler: menuHandler.mfOrderStatus
            });
        }
     

        if (showOrdBookOrderHistory == "TRUE") {
            tbOrderbook.push({
                id: 'ord_history',
                text: languageFormat.getLanguage(20173, 'Order History'),
                cls: 'toolbar-menu-item-medium',
                handler: function() {
                    createOrdHistoryPanel();
                    resetOrderPad();	// to reset Order Pad
                }
            });
        }
        
        if (showMFOrdBookOrderHistory == "TRUE") {
            tbOrderbook.push({
                id: 'mf_ord_history',
                text: languageFormat.getLanguage(20245, ' Mutual Fund Order History'),
                cls: 'toolbar-menu-item-medium',
                handler: function() {
                    createMFOrdHistoryPanel();
                    resetOrderPad();    // to reset Order Pad
                }
            });
        }

        if (showOrdBookOrderLog == "TRUE") {
            tbOrderbook.push({
                id: 'ord_log',
                text: languageFormat.getLanguage(20174, 'Order Log'),
                disabled: true,
                cls: 'toolbar-menu-item-medium',
                handler: function() {
                    createOrdLogPanel();
                    orderLogPanel.callOrdLog();
                    resetOrderPad();	// to reset Order Pad
                }
            });
        }

        var menuOrderBook = new Ext.menu.Menu({
            //cls: 'toolbar-menu-item-medium',
            //bodyStyle:'color:white',
            items: tbOrderbook
        });

        tbMenuOrdSts = {
            id: 'tbOS',
            text: languageFormat.getLanguage(20171, 'Order Book'),
            showSeparator: false,
            hideOnClick: false,
            cls: 'toolbar-menu-medium',
            menu: menuOrderBook
        };
    }

    if (showExchangeHeader == "TRUE") {
        tbMenuExchg = {
            id: 'tbEx',
            text: languageFormat.getLanguage(20301, 'Exchange'),
            hideOnClick: false,
            cls: 'toolbar-menu-medium',
            showSeparator: false
                    // arrowAlign:'bottom'
        };
    }

    if (global_TrackerRecord.toLowerCase() == 'true') {
        tbMenuTrackerRecord = {
            text: languageFormat.getLanguage(20501, 'Tracker Record'),
            cls: 'toolbar-menu-medium',
            handler: function() {
                N2NSubWindow.open();
            }
        };
    }




    if (N2N_CONFIG.features_Analysis) {
        var tbMenuAnalysis = [];

        if (N2N_CONFIG.features_Analysis_Dividend) {
            tbMenuAnalysis.push({
                text: languageFormat.getLanguage(20141, 'Dividend'),
                cls: 'toolbar-menu-item-medium',
                handler: menuHandler.analysisDividend
            });
        }

        if (N2N_CONFIG.features_Analysis_Warrants) {
            tbMenuAnalysis.push({
                text: languageFormat.getLanguage(20142, 'Warrants'),
                cls: 'toolbar-menu-item-medium',
                handler: menuHandler.analysisWarrants
            });
        }

        if (N2N_CONFIG.features_Analysis_BMFutures) {
            tbMenuAnalysis.push({
                text: languageFormat.getLanguage(20143, 'BMD Futures'),
                cls: 'toolbar-menu-item-medium',
                handler: menuHandler.analysisBMD_Future
            });
        }

        var menuMenuAnalysis = new Ext.menu.Menu({
            items: tbMenuAnalysis
        });

        tbMenuAnalysiss = {
            id: "tbMenuAnalysis",
            text: languageFormat.getLanguage(20144, 'Analysis'),
            showSeparator: false,
            hideOnClick: false,
            cls: 'toolbar-menu-medium',
            menu: menuMenuAnalysis
        };
    }

    if (showSettingHeader == "TRUE") {
        var tbMenuSetting = [];

        if (showSettingStockAlert == "TRUE") {
            tbMenuSetting.push({
                id: 'stockalert',
                text: languageFormat.getLanguage(20602, 'Stock Alert'),
                cls: 'toolbar-menu-item-medium',
                handler: function() {

                    if (N2N_CONFIG.newWin_Other) {

                        if (window.name == "_stockalert ")
                            window.name = ""; //if tclite load on new_tab then name that win to blank

                        msgutil.openURL({
                            url: settingStockAlertURL + '?BHCode=' + bhCode + '&Clicode=' + cliCode + '&Mobile=' + mobileNo + '&Email=' + emailAdd + '&LoginID=' + loginId + '&Encrypt=N&fontSize=11&lang=en&exchg=' + exchangecode + '&' + new Date().getTime(),
                            name: '_stockalert'
                        });
                    } else {

                        if (userReport['userReport_stockalert'] == null) {
                            var tempTab = Ext.create('Ext.ux.IFrame', {
                                title: languageFormat.getLanguage(20602, 'Stock Alert'),
                                id: 'userReport_stockalert',
                                // height: !n2nLayoutManager.isTabLayout() ? 310 : quoteScreen.up().up().body.getHeight() - 2,
                                url: settingStockAlertURL + '?BHCode=' + bhCode + '&Clicode=' + cliCode + '&Mobile=' + mobileNo + '&Email=' + emailAdd + '&LoginID=' + loginId + '&Encrypt=N&fontSize=11&lang=en&exchg=' + exchangecode + '&' + new Date().getTime(),
                                iframeScroll: true,
                                winConfig: {
                                    width: 865,
                                    height: 490
                                }
                            });

                            tempTab.on('beforedestroy', function() {
                                userReport[ 'userReport_stockalert' ] = null;
                            });

                            userReport[ 'userReport_stockalert' ] = tempTab;
                            n2nLayoutManager.addItem(tempTab);
                            n2nLayoutManager.activateItem(tempTab);
                            tempTab.refresh(tempTab.url);

                        } else {
                            n2nLayoutManager.activateItem(userReport['userReport_stockalert']);
                            userReport[ 'userReport_stockalert' ].refresh(settingStockAlertURL + '?BHCode=' + bhCode + '&Clicode=' + cliCode + '&Mobile=' + mobileNo + '&Email=' + emailAdd + '&LoginID=' + loginId + '&Encrypt=N&fontSize=11&lang=en&exchg=' + exchangecode + '&' + new Date());
                        }
                    }
                }
            });
        }

        // Add Stock Alert menu
        if (N2N_CONFIG.featuresSetting_AddStockAlert) {
            tbMenuSetting.push({
                text: languageFormat.getLanguage(20603, 'Add Stock Alert'),
                cls: 'toolbar-menu-item-medium',
                handler: function() {
                    var record = n2nLayoutManager.getActiveRecord();
                    n2ncomponents.createAddStockAlert(record.stkCode);
                }
            });
        }

        if (N2N_CONFIG.featuresSetting_PriceAlert) {
            tbMenuSetting.push({
                id: 'pricealert',
                text: languageFormat.getLanguage(20608, 'Price Alert'),
                cls: 'toolbar-menu-item-medium',
                handler: function() {
                    createPriceAlert();
                }
            });
        }

        if (showUISetting == "TRUE") {
            tbMenuSetting.push({
                id: 'setUI',
                text: languageFormat.getLanguage(20606, 'UI Settings'),
                cls: 'toolbar-menu-item-medium',
                handler: function() {
                    n2ncomponents.settingUI();
                }
            });

        }
        if (N2N_CONFIG.fontSizeButton) {
            tbMenuSetting.push({
                id: 'fontSizeSetting',
                text: languageFormat.getLanguage(20609, "Font Size"),
                cls: 'toolbar-menu-item-medium',
                handler: function() {
                    fontSizeSetting();
                }
            });
        }
        if (configutil.getDefaultTrueConfig(showTickerSetting)) {
            tbMenuSetting.push({
                id: 'tickerSettingSubMenu',
                text: languageFormat.getLanguage(20610, 'Ticker'),
                tooltip: languageFormat.getLanguage(30125, 'Manage how to display the ticker bar'),
                tooltipType: 'title',
                cls: 'toolbar-menu-item-medium',
                handler: function() {
                    tickerSettingUI();
                }
            });
        }

        var menuMenuSettings = new Ext.menu.Menu({
            items: tbMenuSetting
        });

        tbMenuSettings = {
            id: "tbSett",
            text: languageFormat.getLanguage(20601, 'Settings'),
            showSeparator: false,
            hideOnClick: false,
            cls: 'toolbar-menu-medium',
            menu: menuMenuSettings
        };


//	        tbMenuSetting = {
//	        	id: "tbMenuSetting",
//	        	text: "Setting",
//	        	handler: function() {
//	        		createoptPanel();
//	        	}
//	        };
    }

    if (N2N_CONFIG.menuProfile) {
        var profileMenuItems = new Array();

        // Change password
        if (N2N_CONFIG.profileChgPwdURL != '') {
            profileMenuItems.push({
                text: languageFormat.getLanguage(20612, 'Change Password'),
                cls: 'toolbar-menu-item-medium',
                handler: menuHandler.changePwd
            });
        }

        // Forgot password
        if (N2N_CONFIG.profileForPwdURL != '') {
            profileMenuItems.push({
                text: languageFormat.getLanguage(20613, 'Forgot Password'),
                cls: 'toolbar-menu-item-medium',
                handler: menuHandler.forgotPwd
            });
        }

        // Change Pin
        if (N2N_CONFIG.profileChgPinURL != '') {
            profileMenuItems.push({
                text: languageFormat.getLanguage(20614, 'Change Pin'),
                cls: 'toolbar-menu-item-medium',
                handler: menuHandler.changePin
            });
        }

        // Forgot Pin
        if (N2N_CONFIG.profileForPinURL != '') {
            profileMenuItems.push({
                text: languageFormat.getLanguage(20615, 'Forgot Pin'),
                cls: 'toolbar-menu-item-medium',
                handler: menuHandler.forgotPin
            });
        }

        if (profileMenuItems.length > 0) {
            var profileSubMenu = new Ext.menu.Menu({
                cls: 'toolbar-menu-item-medium',
                items: profileMenuItems
            });
            MENU.profile = {
                text: languageFormat.getLanguage(20611, 'Profile'),
                menu: profileSubMenu
            };
        }
    }

    if (global_showOtherToolHeader.toLowerCase() == 'true') {

        var tempOtherToolItems = [];

        if (global_showOtherToolStockFilter.toLowerCase() == 'true') {
            tempOtherToolItems.push({
                text: languageFormat.getLanguage(20522, 'Stock Filter'),
                cls: 'toolbar-menu-item-medium',
                handler: function() {

                    if (N2N_CONFIG.newWin_StkFilter) {

                        if (window.name == "_otherTool_StockFilter")
                            window.name = ""; //if tclite load on new_tab then name that win to blank

                        msgutil.openURL({
                            url: global_otherToolStockFilterURL + '?BHCode=' + bhCode + '&Clicode=' + cliCode + '&Mobile=' + mobileNo + '&Email=' + emailAdd + '&LoginID=' + loginId + '&Encrypt=N&fontSize=11&lang=en&exchg=' + exchangecode + '&' + new Date().getTime(),
                            name: '_stockalert'
                        });
                    } else {

                        if (userReport['userReport_otherTool_StockFilter'] == null) {
                            var tempTab = Ext.create('Ext.ux.IFrame', {
                                title: languageFormat.getLanguage(20522, 'Stock Filter'),
                                id: 'userReport_otherTool_StockFilter',
                                // height: tabPanel1.body.getHeight(),
                                url: global_otherToolStockFilterURL,
                                iframeScroll: true
                            });

                            tempTab.on('beforedestroy', function() {
                                userReport[ 'userReport_otherTool_StockFilter' ] = null;
                            });

                            tempTab.refresh(tempTab.url);

                            userReport[ 'userReport_otherTool_StockFilter' ] = tempTab;

                        } else {

//								userReport[ 'userReport_otherTool_StockFilter' ].url = global_otherToolStockFilterURL;
                            userReport[ 'userReport_otherTool_StockFilter' ].refresh(global_otherToolStockFilterURL);

                            for (var i = 0; i < tabPanel1.items.length; i++) {
                                var tempComponent = tabPanel1.getComponent(i).getComponent(0);

                                if (tempComponent.id == 'userReport_otherTool_StockFilter') {
                                    tabPanel1.setActiveTab(i);
                                    break;
                                }
                            }
                        }
                    }
                }
            });
        }

        if (global_showOtherToolExchangeRate.toLowerCase() == 'true') {
            tempOtherToolItems.push({
                text: 'Exchange Rate',
                cls: 'toolbar-menu-item-medium',
                handler: function() {
                	var exchangeRateUrl = global_otherToolExchangeRateURL + '?lang=' + global_Language;
                    if (N2N_CONFIG.newWin_Other) {

                        if (window.name == "_otherTool_ExchangeRate")
                            window.name = ""; //if tclite load on new_tab then name that win to blank

                        msgutil.openURL({
                            url: exchangeRateUrl,
                            name: '_stockalert'
                        });
                    } else {

                        if (userReport['userReport_otherTool_ExchangeRate'] == null) {
                            var tempTab = Ext.create('Ext.ux.IFrame', {
                                title: languageFormat.getLanguage(20523, 'Exchange Rate'),
                                id: 'userReport_otherTool_ExchangeRate',
                                // height: tabPanel1.body.getHeight(),
                                url: exchangeRateUrl,
                                iframeScroll: true
                            });

                            tempTab.on('beforedestroy', function() {
                                userReport[ 'userReport_otherTool_ExchangeRate' ] = null;
                            });

                            tempTab.refresh(tempTab.url);

                            userReport[ 'userReport_otherTool_ExchangeRate' ] = tempTab;

                        } else {

//								userReport[ 'userReport_otherTool_ExchangeRate' ].url = global_otherToolExchangeRateURL;
                            userReport[ 'userReport_otherTool_ExchangeRate' ].refresh(exchangeRateUrl);

                            for (var i = 0; i < tabPanel1.items.length; i++) {
                                var tempComponent = tabPanel1.getComponent(i).getComponent(0);

                                if (tempComponent.id == 'userReport_otherTool_ExchangeRate') {
                                    tabPanel1.setActiveTab(i);
                                    break;
                                }
                            }
                        }
                    }
                }
            });
        }


        tbMenuOtherTool = {
            text: languageFormat.getLanguage(20521, 'Tools'),
            hideOnClick: false,
            showSeparator: false,
            id: 'tbTools',
            menu: new Ext.menu.Menu({
                cls: 'toolbar-menu-medium',
                items: tempOtherToolItems
            })
        }
    }

    if (configutil.getTrueConfig(showBuySellHeader)) {
        tbMenuBuy = {
            id: 'tbBuy',
            text: '&nbsp;' + languageFormat.getLanguage(10001, 'Buy') + '&nbsp;',
            width: 50,
            cls: 'toolbar-menu-medium',
            handler: menuHandler.buy
        };

        tbMenuSell = {
            id: 'tbSell',
            text: '&nbsp;' + languageFormat.getLanguage(10002, 'Sell') + '&nbsp;',
            width: 50,
            cls: 'toolbar-menu-medium',
            handler: menuHandler.sell
        };
    }

    if (configutil.getTrueConfig(showChartHeader)) {

        var tbChartItem = new Array();

        if (configutil.getTrueConfig(showChartIntradayChart)) {
            tbChartItem.push({
                text: languageFormat.getLanguage(20101, 'Intraday Chart'),
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.intradayChart
            });
        }

        if (configutil.getTrueConfig(showChartAnalysisChart)) {
            tbChartItem.push({
                text: languageFormat.getLanguage(20102, 'Analysis Chart'),
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.analysisChart
            });
        }

        if (configutil.getTrueConfig(showChartITFinanceChart)) {
            tbChartItem.push({
                text: languageFormat.getLanguage(20113, 'IT Finance Chart'),
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.itFinanceChart
            });
        }

        var menuCount = tbChartItem.length;
        if (menuCount > 1) {
            var menuChart = new Ext.menu.Menu({
                items: tbChartItem
            });

            tbMenuChart = {
                id: 'tbCht',
                text: languageFormat.getLanguage(20103, 'Chart'),
                hideOnClick: false,
                showSeparator: false,
                cls: 'toolbar-menu-medium',
                menu: menuChart
            };
        } else if (menuCount == 1) {
            tbMenuChart = tbChartItem[0];
            tbMenuChart.cls = '';
        }
    }

}

var tbNewsItem = new Array();
function initializeNewsMenu() {

    if (showNewsHeader == "TRUE") {
        if (showNewsAnnouncements == "TRUE") {
            tbNewsItem.push({
                text: languageFormat.getLanguage(20122, 'Announcements'),
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                iframeScroll: true,
                handler: menuHandler.announcement
            });
        }

        if (showNewsStockNews == "TRUE") {
            tbNewsItem.push({
                text: languageFormat.getLanguage(20123, 'Stock News'),
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                handler: menuHandler.stockNews
            });
        }

        if (N2N_CONFIG.featuresNews_Archive) {
            tbNewsItem.push({
                text: languageFormat.getLanguage(20137, 'News Archive'),
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                handler: menuHandler.archiveNews
            });
        }
        
        if (N2N_CONFIG.elasticNewsUrl) {
            tbNewsItem.push({
                text: languageFormat.getLanguage(20140, 'Elastic News'),
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                handler: function() {
					menuHandler.elasticNews('1');
				}
            });
        }
        
        if (N2N_CONFIG.nikkeiNewsUrl) {
            tbNewsItem.push({
                text: languageFormat.getLanguage(21501, 'Nikkei News'),
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
        		handler: function() {
					menuHandler.elasticNews('2');
				}
            });
        }
    }
}

var tbFundItems = new Array();
function initializeFundMenu() {
    if (N2N_CONFIG.featuresFund_Header) {
        if (N2N_CONFIG.featuresNews_FundamentalCPIQ) {

            tbFundItems.push({
                text: languageFormat.getLanguage(20124, 'Fundamental (Capital IQ)'),
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                handler: function() {
                    var stk = n2nLayoutManager.getActiveRecord();
                    if (stk) {
                        createFundamentalCPIQWin(stk.stkCode);
                    }
                }
            });
        }

        if (N2N_CONFIG.featuresNews_FundamentalScreenerCPIQ) {
            tbFundItems.push({
                text: languageFormat.getLanguage(20125, 'Fundamental Screener (Capital IQ)'),
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                handler: function() {
                    createFundamentalScreenerCPIQWin();
                }
            });
        }

        if (N2N_CONFIG.featuresNews_FundamentalThomsonReuters) {
            tbFundItems.push({
                text: languageFormat.getLanguage(20126, 'Fundamental (Thomson Reuters)'),
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                handler: function() {
                    var stk = n2nLayoutManager.getActiveRecord();
                    if (stk) {
                        createFundamentalThomsonReutersWin(stk.stkCode);
                    }
                }
            });
        }

        if (N2N_CONFIG.featuresNews_FundamentalScreenerThomsonReuters) {
            tbFundItems.push({
                text: languageFormat.getLanguage(20127, 'Fundamental Screener (Thomson Reuters)'),
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                handler: function() {
                    createFundamentalScreenerThomsonReutersWin();
                }
            });
        }

        if (N2N_CONFIG.pseEdgeURL.length > 0) {
            tbFundItems.push({
                text: languageFormat.getLanguage(20139, 'PSE Edge'),
                cls: 'x-menu-item-medium',
                handler: function() {
                    menuHandler.pseEdge();
                }
            });
        }
    }
}

/**
 * Description :
 * 		this method is to disable menu items
 * 
 * @param exchangeCode
 */
function disableMenuItems(exchangeCode) {
    /*
     * for this method have need two array, first is able array and disable array
     * 
     * able array 		: is for record which item is able user to select
     * disable array 	: is for record which item is disable user to select
     * 
     * 
     * first it will loop the menu item one by one first, then will loop the subMenu item when the menu item is looping 
     * if the menu or subMenu item name is same will the two array it will able the item first, then will disable the item.
     * 
     * 
     * the "Try... Catch..." is to block the menu items didn't have subMenu
     */

    if (!mainMenuBar) {
        return;
    }

    // this two array is for record menu sub menu items
    var ableListSubMenu = new Array();
    ableListSubMenu.push("Scoreboard");
    ableListSubMenu.push("Intraday Chart");
    ableListSubMenu.push("Summary");
    ableListSubMenu.push("Indices");

    var newItemList = determineItem(ableListSubMenu, exchangeCode);

    // get from the menu item
    var mainTools = mainMenuBar.items;
    var mainToolsItem = mainTools.items.length;
    // loop from the menu items
    for (var i = 0; i < mainToolsItem; i++) {
        var toolsItem = mainTools.get(i);
        // block Menu item button
        if (toolsItem.text == "Market") {
            var isDisable = new Array();
            for (var ii = 0; ii < newItemList.length; ii++) {
                var obj = newItemList[ii];
                if (obj.name == "Scoreboard" || obj.name == "Summary" || obj.name == "Indices") {
                    if (obj.status) {
                        isDisable.push(true);
                    } else {
                        isDisable.push(false);
                    }
                }
            }

            if (isDisable[0] == false && isDisable[1] == false && isDisable[2] == false) {
                toolsItem.disable();
            } else {
                toolsItem.enable();
            }
        }


        try {

            var itemLength = 0;

            try {
                if (toolsItem.menu != null) {
                    itemLength = toolsItem.menu.items.length;
                }
            } catch (e) {
            }
            // loop the subMenu items
            for (var ii = 0; ii < itemLength; ii++) {

                var subMenuItem = toolsItem.menu.items.get(ii);
                // verify the item with two array
                // set item to able
                for (var iii = 0; iii < newItemList.length; iii++) {
                    if (newItemList[iii].name == subMenuItem.text) {
                        if (newItemList[iii].status) {
                            subMenuItem.enable();
                        } else {
                            subMenuItem.disable();
                        }
                    }
                }
            }
        } catch (err) {
        }
    }
}

function activateBuySellMenu(mode, objRec) {
    var activeRec = objRec || n2nLayoutManager.getActiveRecord(true);
    
    if (!jsutil.isEmpty(activeRec)) {
        if (callOrdPadTaskID != null) {
            clearTimeout(callOrdPadTaskID);
            callOrdPadTaskID = null;
        }

        callOrdPadTaskID = setTimeout(function() {
            var ordRec = new Object();
            var stkcode = activeRec.stkCode;
            var stkname = activeRec.stkName;
            ordRec.price = getBuySellPrice(activeRec.rec, mode);
            if (activeRec.accbranchNo) {
                ordRec.accbranchNo = activeRec.accbranchNo;
                ordRec.payment = activeRec.payment;
            }
            
            if(activeRec.rec.data.AccNo){
            	if(activeRec.rec.data.AccountName.length > 0){
                	ordRec.OrdStsAccList = [[activeRec.rec.data.AccNo + global_AccountSeparator + activeRec.rec.data.BCode, activeRec.rec.data.AccNo + ' - ' + activeRec.rec.data.AccountName + ' - ' + activeRec.rec.data.BCode]];
				}else{
	            	ordRec.OrdStsAccList = [[activeRec.rec.data.AccNo + global_AccountSeparator + activeRec.rec.data.BCode, activeRec.rec.data.AccNo + ' - ' + activeRec.rec.data.BCode]];
				}  
            }else{
            	if(activeRec.rec.data.an){
                	if(activeRec.rec.data.accN.length > 0){
                    	ordRec.OrdStsAccList = [[activeRec.rec.data.an + global_AccountSeparator + activeRec.rec.data.bc, activeRec.rec.data.an + ' - ' + activeRec.rec.data.accN + ' - ' + activeRec.rec.data.bc]];
    				}else{
    	            	ordRec.OrdStsAccList = [[activeRec.rec.data.an + global_AccountSeparator + activeRec.rec.data.bc, activeRec.rec.data.an + ' - ' + activeRec.rec.data.bc]];
    				}  
                }
            }        

            closedOrderPad = false;
            createOrderPad(stkcode, stkname, mode, ordRec, true);
            n2ncomponents.createCorporateNewsAction(activeRec.rec);
            if (!n2nLayoutManager.isWindowLayout()) {
                // closedMarketDepth = false;
            }
            // createMarketDepthPanel(stkcode, stkname);

            callOrdPadTaskID = null;
        }, 250);
    } else {
        msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
    }
}

/* Metro Menu */
function metroMenuObj(menuObj) {
//    if (menuObj.mtScale == 'medium') {
//        menuObj.width = 153;
//    }
    var colorCls = '';
    if (menuObj.mtColor && menuObj.mtColor != '') {
        colorCls = ' metro_' + menuObj.mtColor;
    }

    Ext.applyIf(menuObj, {
        xtype: 'button',
        width: "100%",
        height: "100%",
//        width: 74,
//        height: 74,
        cls: 'metrobtn metro_grey',
        overCls: '',
//        margin: '5 0 0 5',
        padding: 0,
        iconAlign: 'top',
        scale: 'meduim'
    });

    return menuObj;
}

function metroMenu() {
    var metroMenuItems = new Array();

    // Quote
    var mtHome = metroMenuObj({
        text: languageFormat.getLanguage(20668, 'Home'),
        //mtScale: 'medium', // custom member
        mtColor: 'orange',
        iconCls: 'mobile-icon-menu-home',
        handler: function() {
            n2nLayoutManager.activateHomeScreen();
        }
    });
    metroMenuItems.push(mtHome);
    
    // Quote
    var mtQuote = metroMenuObj({
        text: languageFormat.getLanguage(20673, 'Quote'),
        mtColor: 'green',
        iconCls: 'mobile-icon-menu-quote',
        handler: function() {
            createQuoteScreen();
        }
    });
    metroMenuItems.push(mtQuote);

    // Watchlist
    if (showWatchListHeader == "TRUE" && showWatchListView == "TRUE") {
        var mtWatchlist = metroMenuObj({
            text: languageFormat.getLanguage(20001, 'Watchlist'),
            mtColor: 'dark',
            iconCls: 'mobile-icon-menu-watchlist',
            handler: function() {
                n2ncomponents.createWLGrid(watchListArr);
            }
        });
        metroMenuItems.push(mtWatchlist);
    }

    // Stock Info
    if (showStkInfoHeader == "TRUE") {
        var mtStockInfo = metroMenuObj({
            text: languageFormat.getLanguage(20021, 'Stock Info'),
            mtColor: 'purple',
            iconCls: 'mobile-icon-menu-stockinfo',
            handler: function() {
                var subMenus = new Array();

                if (showStkInfoStkInfo == "TRUE") {
                    subMenus.push({iconCls: 'mobile-icon-submenu-stockinfo', menulabel: languageFormat.getLanguage(20021, 'Stock Info'), fn: 'menuHandler.stockInfo();'});
                }
                if (showStkInfoMarketDepth == "TRUE") {
                    subMenus.push({iconCls: 'mobile-icon-submenu-marketdepth', menulabel: languageFormat.getLanguage(20022, 'Market Depth'), fn: 'menuHandler.marketDepth();'});
                }
                if (showStkInfoTracker == "TRUE") {
                    subMenus.push({iconCls: 'mobile-icon-submenu-tracker', menulabel: languageFormat.getLanguage(20024, 'Stock Tracker'), fn: 'menuHandler.tracker();'});
                }

                n2nLayoutManager.plainMenu(subMenus);
            }
        });
        metroMenuItems.push(mtStockInfo);
    }

    // Chart
    if (showChartHeader == 'TRUE') {
        var mtChart = metroMenuObj({
            text: languageFormat.getLanguage(20103, 'Chart'),
            mtColor: 'pink',
            iconCls: 'mobile-icon-menu-chart',
            handler: function() {
                var subMenus = new Array();

                if (showChartIntradayChart == 'TRUE' && menuHandler.getMenuStatus('Intraday Chart')) {
                    subMenus.push({iconCls: 'mobile-icon-submenu-chart', menulabel: languageFormat.getLanguage(20101, 'Intraday Chart'), fn: 'menuHandler.intradayChart();'});
                }
                if (showChartAnalysisChart == 'TRUE') {
                    subMenus.push({iconCls: 'mobile-icon-submenu-chart', menulabel: languageFormat.getLanguage(20102, 'Analysis Chart'), fn: 'menuHandler.analysisChart();'});
                }

                n2nLayoutManager.plainMenu(subMenus);
            }
        });
        metroMenuItems.push(mtChart);
    }

    // Trade
    if (showBuySellHeader == 'TRUE') {
        var mtTrade = metroMenuObj({
            text: languageFormat.getLanguage(10001, 'Buy'),
            mtColor: 'green',
            iconCls: 'mobile-icon-menu-buy',
            handler: menuHandler.buy
        });
        metroMenuItems.push(mtTrade);

        var mtSell = metroMenuObj({
            text: languageFormat.getLanguage(10002, 'Sell'),
            mtColor: 'red',
            iconCls: 'mobile-icon-menu-sell',
            handler: menuHandler.sell
        });
        metroMenuItems.push(mtSell);
    }

    // News
    if (showNewsHeader == "TRUE") {
        var mtNews = metroMenuObj({
            text: languageFormat.getLanguage(20121, 'News'),
            mtColor: 'purple',
            iconCls: 'mobile-icon-menu-news',
            handler: function() {
                var subMenus = new Array();

                if (showNewsAnnouncements == "TRUE") {
                    subMenus.push({iconCls: 'mobile-icon-submenu-news', menulabel: languageFormat.getLanguage(20122, 'Announcements'), fn: 'menuHandler.announcement();'});
                }
                if (showNewsStockNews == "TRUE") {
                    subMenus.push({iconCls: 'mobile-icon-submenu-news', menulabel: languageFormat.getLanguage(20123, 'Stock News'), fn: 'menuHandler.stockNews();'});
                }
                if (N2N_CONFIG.elasticNewsUrl) {
                    subMenus.push({iconCls: 'mobile-icon-submenu-news', menulabel: languageFormat.getLanguage(20140, 'Elastic News'), fn: 'menuHandler.elasticNews(\'1\');'});
                }
                if (N2N_CONFIG.nikkeiNewsUrl) {
                    subMenus.push({iconCls: 'mobile-icon-submenu-news', menulabel: languageFormat.getLanguage(21501, 'Nikkei News'), fn: 'menuHandler.elasticNews(\'2\');'});
                }
                if(kafChartResearchLinkUrl!=""){
                    subMenus.push({iconCls: 'mobile-icon-submenu-news', menulabel: "Kaf Chart Research Link", fn: 'createKafChartNews();'
                    });
                }
                
                if(N2N_CONFIG.newMobileFundamental){
                	if (N2N_CONFIG.featuresNews_FundamentalCPIQ) {

                		subMenus.push({
                			id: 'Fundamental_cpiq',
                			iconCls: 'mobile-icon-submenu-news',
                			menulabel: languageFormat.getLanguage(20124, 'Fundamental'),
                			fn: 'menuHandler.spFundamental();'
                		});
                	}

                	if (N2N_CONFIG.featuresNews_FundamentalScreenerCPIQ) {
                		subMenus.push({
                			id: 'Fundamental_Screener_cpiq',
                			iconCls: 'mobile-icon-submenu-news',
                			menulabel: languageFormat.getLanguage(20125, 'Fundamental Screener'),
                			fn: 'menuHandler.spFundamentalScreener();'
                		});
                	}
                }else{
                	if (N2N_CONFIG.mbFeaturesNews_SPCapIQ) {

                		if (N2N_CONFIG.mbFeaturesNews_SPCapIQ_Synopsis) {
                			subMenus.push({
                				iconCls: 'mobile-icon-submenu-news',
                            menulabel: languageFormat.getLanguage(20132, 'Company Synopsis'),
                				fn: 'menuHandler.spCapIQSynopsis();'
                			});
                		}

                		if (N2N_CONFIG.mbFeaturesNews_SPCapIQ_ComInfo) {
                			subMenus.push({
                				iconCls: 'mobile-icon-submenu-news',
                            menulabel: languageFormat.getLanguage(20133, 'Company Info'),
                				fn: 'menuHandler.spCapIQInfo();'
                			});
                		}

                		if (N2N_CONFIG.mbFeaturesNews_SPCapIQ_Announcement) {
                			subMenus.push({
                				iconCls: 'mobile-icon-submenu-news',
                            menulabel: languageFormat.getLanguage(20128, 'Announcement'),
                				fn: 'menuHandler.spCapIQAnnouncement();'
                			});
                		}

                		if (N2N_CONFIG.mbFeaturesNews_SPCapIQ_KeyPersons) {
                			subMenus.push({
                				iconCls: 'mobile-icon-submenu-news',
                            menulabel: languageFormat.getLanguage(20134, 'Key Persons'),
                				fn: 'menuHandler.spCapIQKeyPerson();'
                			});
                		}

                		if (N2N_CONFIG.mbFeaturesNews_SPCapIQ_ShareSum) {
                			subMenus.push({
                				iconCls: 'mobile-icon-submenu-news',
                            menulabel: languageFormat.getLanguage(20135, 'Shareholding Summary'),
                				fn: 'menuHandler.spCapIQShareHolders();'
                			});
                		}

                		if (N2N_CONFIG.mbFeaturesNews_SPCapIQ_FiReports) {
                			subMenus.push({
                				iconCls: 'mobile-icon-submenu-news',
                            menulabel: languageFormat.getLanguage(20136, 'Financial Reports'),
                				fn: 'menuHandler.spCapIQAnnual();'
                			});
                		}
                	}
                }

                n2nLayoutManager.plainMenu(subMenus);
            }
        });

        metroMenuItems.push(mtNews);
    }

    // news menu 2 for mobile
    if (N2N_CONFIG.news2_Menu !== '') {
        var mtNews2 = metroMenuObj({
            text: languageFormat.getLanguage(20121, 'News'),
            mtColor: 'purple',
            iconCls: 'mobile-icon-menu-news',
            handler: function () {
                var sItems = [];

                var nMenu = initMenuObj(N2N_CONFIG.news2_Menu);
                if (nMenu) {
                    sItems.push(nMenu);
                }

                if (sItems.length > 0) {
                    if (sItems.length === 1) {
                        var rsItems = [];
                        var oneMenu = sItems[0];
                        if (oneMenu.menu && oneMenu.menu.items) {
                            if (oneMenu.menu.items.length > 0) {
                                for (var i = 0; i < oneMenu.menu.items.length; i++) {
                                    var mItem = oneMenu.menu.items[i];
                                    mItem.secondMenu = null;
                                    mItem.listeners = {};
                                    rsItems.push(mItem);
                                }

                                if (rsItems.length > 0) {
                                    sItems = rsItems;
                                }
                            }
                        }
                    }

                    var subMenus = new Array();
                    for (i = 0; i < sItems.length; i++) {
                        subMenus.push({menulabel: sItems[i].text, fn: sItems[i]._menuAction});
                    }

                    n2nLayoutManager.plainMenu(subMenus);

                }
            }
        });

        metroMenuItems.push(mtNews2);

    }

    // Analysis
    if (N2N_CONFIG.features_Analysis) {
        if (N2N_CONFIG.features_Analysis_Dividend || N2N_CONFIG.features_Analysis_Warrants || N2N_CONFIG.features_Analysis_BMFutures) {
            var mtAnalysis = metroMenuObj({
                text: languageFormat.getLanguage(20144, 'Analysis'),
                mtColor: 'teal',
                iconCls: 'mobile-icon-menu-analysis',
                handler: function() {
                    var subMenus = new Array();

                    if (N2N_CONFIG.features_Analysis_Dividend) {
                        subMenus.push({iconCls: 'mobile-icon-submenu-dividend', menulabel: languageFormat.getLanguage(20141, 'Dividend'), fn: 'menuHandler.analysisDividend();'});
                    }
                    if (N2N_CONFIG.features_Analysis_Warrants) {
                        subMenus.push({iconCls: 'mobile-icon-submenu-warrant', menulabel: languageFormat.getLanguage(20142, 'Warrants'), fn: 'menuHandler.analysisWarrants();'});
                    }
                    if (N2N_CONFIG.features_Analysis_BMFutures) {
                        subMenus.push({iconCls: 'mobile-icon-submenu-future', menulabel: languageFormat.getLanguage(20143, 'BMD Futures'), fn: 'menuHandler.analysisBMD_Future();'});
                    }

                    n2nLayoutManager.plainMenu(subMenus);
                }
            });

            metroMenuItems.push(mtAnalysis);
        }
    }

    // Market
    if (showMarketHeader == "TRUE") {
        var mtMarket = metroMenuObj({
            text: languageFormat.getLanguage(20151, 'Market'),
            mtColor: 'yellow',
            iconCls: 'mobile-icon-menu-market',
            handler: function() {
                var subMenus = new Array();

                if (showMarketSummary == "TRUE" && menuHandler.getMenuStatus('Summary') != false) {
                    subMenus.push({iconCls: 'mobile-icon-submenu-summary', menulabel: languageFormat.getLanguage(20050, 'Summary'), fn: 'menuHandler.marketSummary();'});
                }
                if (showMarketIndices == "TRUE" && menuHandler.getMenuStatus('Indices') != false) {
                    subMenus.push({iconCls: 'mobile-icon-submenu-indices', menulabel: languageFormat.getLanguage(20029, 'Indices'), fn: 'menuHandler.indices();'});
                }
                if (showMarketScoreBoard == "TRUE" && menuHandler.getMenuStatus('Scoreboard')) {
                    subMenus.push({iconCls: 'mobile-icon-submenu-scoreboard' ,menulabel: languageFormat.getLanguage(20156, 'Scoreboard'), fn: 'menuHandler.scoreBoard();'});
                }
                if (showMarketStreamer == 'TRUE') {
                    subMenus.push({menulabel: languageFormat.getLanguage(20157, 'Streamer'), fn: 'menuHandler.streamer();'});
                }
                if (showMarketWorldIndices == 'TRUE') {
                    subMenus.push({menulabel: languageFormat.getLanguage(20158, 'World Indices'), fn: 'menuHandler.worldIndice();'});
                }

                n2nLayoutManager.plainMenu(subMenus);
            }
        });
        metroMenuItems.push(mtMarket);
    }
    // Orderbook
    if (showOrdBookHeader == "TRUE" && showOrdBookOrderSts == "TRUE") {
        var mtOrderbook = metroMenuObj({
            text: languageFormat.getLanguage(20171, 'Order Book'),
            //mtScale: 'medium',
            mtColor: 'green',
            iconCls: 'mobile-icon-menu-orderbook',
            handler: menuHandler.orderStatus
        });
        metroMenuItems.push(mtOrderbook);
    }
    
    //Mutal fund Orderbook
    if (showOrdBookHeader == "TRUE" && showMFOrdBookOrderSts == "TRUE") {
        var mfOrderbook = metroMenuObj({
            text: languageFormat.getLanguage(33720, 'Mutual Fund Order Book'),
            //mtScale: 'medium',
            mtColor: 'green',
            iconCls: 'mobile-icon-menu-orderbook',
            handler: menuHandler.mfOrderStatus
        });
        metroMenuItems.push(mfOrderbook);
    }

    // Reports
    if (jsutil.toBoolean(showWebReportHeader)) {
        var mtReport = metroMenuObj({
            text: languageFormat.getLanguage(20242, 'Reports'),
            mtColor: 'teal',
            iconCls: 'mobile-icon-menu-report',
            handler: function() {
                var subMenus = new Array();

                if (webReportClientSummaryURL.length != 0) {
                    createReportSubMenu(subMenus, webReportClientSummaryURL, true);
                }

                if (webReportMonthlyStatementURL.length != 0) {
                    createReportSubMenu(subMenus, webReportMonthlyStatementURL, true);
                }

                if (webReportMarginAccountSummaryURL.length != 0) {
                    createReportSubMenu(subMenus, webReportMarginAccountSummaryURL, true);
                }

                if (webReportTraderDepositReportURL.length != 0) {
                    createReportSubMenu(subMenus, webReportTraderDepositReportURL, true);
                }

                if (webReportTradeBeyondReportURL.length != 0) {
                    createReportSubMenu(subMenus, webReportTradeBeyondReportURL, true);
                }

                if (webReporteContractURL.length != 0) {
                    createReportSubMenu(subMenus, webReporteContractURL, true);
                }

                if (webReportAISBeStatementURL.length != 0) {
                    createReportSubMenu(subMenus, webReportAISBeStatementURL, true);
                }

                if (webReportMarginPortFolioValuationURL.length != 0) {
                    createReportSubMenu(subMenus, webReportMarginPortFolioValuationURL, true);
                }

                if (webReportTransactionMovementURL.length != 0) {
                    createReportSubMenu(subMenus, webReportTransactionMovementURL, true);
                }

                if (webReportClientTransactionStatementURL.length != 0) {
                    createReportSubMenu(subMenus, webReportClientTransactionStatementURL, true);
                }

                if (webReportStockBalanceURL.length != 0) {
                    createReportSubMenu(subMenus, webReportStockBalanceURL, true);
                }

                n2nLayoutManager.plainMenu(subMenus);
            }
        });

        metroMenuItems.push(mtReport);
    }

    // Portfolio
    if (showPortFolioHeader == "TRUE") {
        var mtPortfolio = metroMenuObj({
            text: languageFormat.getLanguage(20261, 'Portfolio'),
            mtColor: 'orange',
            iconCls: 'mobile-icon-menu-portfolio',
            handler: function() {
                var subMenus = new Array();

                if (global_showPortFolioDerivativePortFolio == 'TRUE') {
                    subMenus.push({iconCls: 'mobile-icon-submenu-derivative-portfolio', menulabel: languageFormat.getLanguage(20263, 'Derivatives Portfolio'), fn: 'menuHandler.derivativePrtf();'});
                }
                if (showPortFolioMyPortFolio == "TRUE") {
                    subMenus.push({iconCls: 'mobile-icon-submenu-equity-portfolio', menulabel: languageFormat.getLanguage(20262, 'Equities Portfolio'), fn: 'menuHandler.equityPrtf();'});
                }
                if (showFundPortFolio == "TRUE") {
                    subMenus.push({iconCls: 'mobile-icon-submenu-equity-portfolio', menulabel: languageFormat.getLanguage(33690, 'Mutual Fund Portfolio'), fn: 'menuHandler.fundPrtf();'});
                }
                if (global_showPortFolioManualPortFolio == "TRUE") {
                    subMenus.push({iconCls: 'mobile-icon-submenu-manual-portfolio', menulabel: languageFormat.getLanguage(20264, 'Manual Portfolio'), fn: 'menuHandler.equityManualPrtf();'});
                }
                if (showPortFolioRealizedGainLoss == "TRUE") {
                    subMenus.push({iconCls: 'mobile-icon-submenu-realised-portfolio', menulabel: languageFormat.getLanguage(20265, 'Realised Gain/Loss'), fn: 'menuHandler.realizedPrtf();'});
                }

                n2nLayoutManager.plainMenu(subMenus);
            }
        });
        metroMenuItems.push(mtPortfolio);
    }
    
    /*
    // Settlement
    if (showSettlementHeader == "TRUE") {
        var mtSettlement = metroMenuObj({
            text: languageFormat.getLanguage(21401, 'Settlement'),
            mtColor: 'pink',
            iconCls: '',
            handler: function () {
            	var subMenus = new Array();

                if (webESettlementURL.length != 0) {
                	createSettlementSubMenu(subMenus, webESettlementURL, true);
                }

                if (webESettlementStatusURL.length != 0) {
                	createSettlementSubMenu(subMenus, webESettlementStatusURL, true);
                }

                if (webEDepositURL.length != 0) {
                	createSettlementSubMenu(subMenus, webEDepositURL, true);
                }
                
                n2nLayoutManager.plainMenu(subMenus);
            }
        });
        metroMenuItems.push(mtSettlement);
    }
    */

    // Exchange
    if (showExchangeHeader == "TRUE") {
        var mtExchange = metroMenuObj({
            text: languageFormat.getLanguage(20301, 'Exchange'),
            mtColor: 'purple',
            iconCls: 'mobile-icon-menu-exchange',
            handler: function() {
                var subMenus = new Array();
                for (var i = 0; i < indexCodes.length; i++) {
                    subMenus.push({iconCls: 'mobile-icon-submenu-exchange', menulabel: indexCodes[i].name, fn: 'menuHandler.switchExchange(\'' + indexCodes[i].ex + '\');'});
                }

                n2nLayoutManager.plainMenu(subMenus);
            }
        });
        metroMenuItems.push(mtExchange);
    }
    
    
    if (N2N_CONFIG.features_Calculator) {
        var mtCal = metroMenuObj({
            text: languageFormat.getLanguage(20621, 'Calculator'),
            mtColor: 'dark',
            iconCls: 'mobile-icon-menu-calculator',
            handler: function() {
                var subMenus = [];

                if (N2N_CONFIG.breakEvenCalc) {
                    subMenus.push({
                        iconCls: 'mobile-icon-submenu-calculator',
                        menulabel: languageFormat.getLanguage(20622, 'Breakeven Calculator'),
                        fn: 'menuHandler.breakEvenCalc();'
                    });
                }

                if (N2N_CONFIG.perEPSCalc) {
                    subMenus.push({
                        iconCls: 'mobile-icon-submenu-calculator',
                        menulabel: languageFormat.getLanguage(21005, 'P/E Ratio & EPS Calculator'),
                        fn: 'menuHandler.PERatioEPSCalc();'
                    });
                }
                n2nLayoutManager.plainMenu(subMenus);
            }
        });
        
         metroMenuItems.push(mtCal);
    }

    // Profile
    if (N2N_CONFIG.menuProfile) {
        var mtProfile = metroMenuObj({
            text: languageFormat.getLanguage(20611, 'Profile'),
            mtColor: 'pink',
            iconCls: '',
            handler: function() {
                var subMenus = new Array();

                if (N2N_CONFIG.profileChgPwdURL != '') {
                    subMenus.push({menulabel: languageFormat.getLanguage(20612, 'Change Password'), fn: 'menuHandler.changePwd();'});
                }
                if (N2N_CONFIG.profileForPwdURL != '') {
                    subMenus.push({menulabel: languageFormat.getLanguage(20613, 'Forgot Password'), fn: 'menuHandler.forgotPwd();'});
                }
                if (N2N_CONFIG.profileChgPinURL != '') {
                    subMenus.push({menulabel: languageFormat.getLanguage(20614, 'Change Pin'), fn: 'menuHandler.changePin();'});
                }
                if (N2N_CONFIG.profileForPinURL != '') {
                    subMenus.push({menulabel: languageFormat.getLanguage(20615, 'Forgot Pin'), fn: 'menuHandler.forgotPin();'});
                }

                n2nLayoutManager.plainMenu(subMenus);
            }
        });
        metroMenuItems.push(mtProfile);
    }
    
    // Services
    if (N2N_CONFIG.otherMenuName != "") {
        var mtSetting = metroMenuObj({
            text: languageFormat.getLanguage(N2N_CONFIG.otherMenuName, N2N_CONFIG.otherMenuName),
            iconCls: 'mobile-icon-menu-services',
            handler: function() {
                n2nLayoutManager.plainMenu(getMetroOtherMenus());
            }
        });
        
        metroMenuItems.push(mtSetting);
    }
    
    // Setting
    if (showSettingHeader == "TRUE") {
        var mtSetting = metroMenuObj({
            text: languageFormat.getLanguage(20601, 'Settings'),
            mtColor: 'red',
            iconCls: 'mobile-icon-menu-setting',
            handler: function() {
                n2nLayoutManager.compRef.menuBtn.toggle(false);
                n2ncomponents.settingUI();
            }
        });
        metroMenuItems.push(mtSetting);
    }

    // Languages
    if (showLanguageMenu == 'TRUE') {
        var mtLang = metroMenuObj({
            text: languageFormat.getLanguage(20616, 'Language'),
            mtColor: 'purple',
            iconCls: 'mobile-icon-menu-language',
            handler: function() {
                var subMenus = new Array();

                var langs = languageOptions.split(',');
                for (var i = 0; i < langs.length; i++) {
                    // default to english

                    var langText = languageFormat.getLanguage(10034, 'English');
                    var langFile = 'en';
                    var langIcon = 'mobile-icon-submenu-en';

                    switch (langs[i].toLowerCase()) {
                        case 'cn':
                            langText = languageFormat.getLanguage(10035, 'Chinese');
                            langFile = 'cn';
                            langIcon = 'mobile-icon-submenu-cn';
                            break;
                        case 'jp':
                            langText = languageFormat.getLanguage(10037, 'Japanese');
                            langFile = 'jp';
                            langIcon = 'mobile-icon-submenu-jp';
                            break;
                        case 'vn':
                            langText = languageFormat.getLanguage(10038, 'Vietnamese');
                            langFile = 'vn';
                            langIcon = 'mobile-icon-submenu-vn';
                            break;
                    }


                    subMenus.push({iconCls: langIcon, menulabel: langText, fn: 'switchLanguage(\'' + langFile + '\')'});
                }

                n2nLayoutManager.plainMenu(subMenus);
            }
        });
    
        metroMenuItems.push(mtLang);
    }
    
    // Log out
    if (global_logoutButton.toLowerCase() == 'true') {
        var mtLogout = metroMenuObj({
            text: languageFormat.getLanguage(10006, 'Logout'),
            mtColor: 'red',
            iconCls: 'mobile-icon-menu-logout',
            handler: function() {
                menuHandler.logout();
            }
        });
        metroMenuItems.push(mtLogout);
    }

    return metroMenuItems;
}
function menuListeners() {
    var text = {};
    var event = {};

    if (!N2N_CONFIG.showMenuLabel) {
        event = {
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
                text = Ext.get(this.getId() + "-btnInnerEl");
                if (text != null) {
                    text.setVisibilityMode(Ext.dom.Element.VISIBILITY);
                    //text.setVisible(false);
                    if (Ext.os.deviceType == 'Desktop') {
                    	text.addCls('hidden');
                    }
                }
            },
            mouseover: function() {
                if (text != null) {
                    //text.setVisible(true);
                	text.addCls('visible');
                	text.removeCls('hidden');
                }
            },
            mouseout: function() {
                if (text != null) {
                    //text.setVisible(false);
                	text.addCls('hidden');
                	text.removeCls('visible');
                }
            }
        };
    }

    return event;
}

function initMenuObj(menuConf) {
    // read menu configuration
    if (!jsutil.isEmpty(menuConf)) {
        // read main menu
        var mainMenuParts = menuConf.split('{');

        if (mainMenuParts.length > 1 && mainMenuParts[1].trim() !== '') {
            var mmParts = mainMenuParts[0].split(';');
            var allowedMenu = true;
            if (mmParts.length > 1 && mmParts[1].trim() === 'ob') {
                allowedMenu = outbound;
            }

            if (allowedMenu) {
                var mainMenuLabel = languageFormat.getLanguage(mmParts[0].trim(), mmParts[0]);

                var menuItems = [];
                var subMenuParts = mainMenuParts[1].split(',');
                for (var i = 0; i < subMenuParts.length; i++) {
                    var subMenu = getMenuItemDef(subMenuParts[i]);
                    if (subMenu) {
                        menuItems.push({
                            text: subMenu.menuLabel,
                            cls: 'x-menu-item-medium',
                            // notDDMenu: true,
                            secondMenu: true,
                            // popupOnly: true,
                            _menuAction: subMenu.menuAction,
                            _winConf: subMenu.winConf,
                            // listeners: {
                            //    afterrender: function(thisMenu) {
                            //        addMenuAction(thisMenu);
                            //    }
                            // },
                            handler: function(thisMenu) {
                                runMenuAction(thisMenu._menuAction, thisMenu.text, thisMenu._winConf);
                            }
                        });
                    }
                }

                return {
                    text: mainMenuLabel,
                    hideOnClick: !touchMode,
                    cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                    menu: {
                        items: menuItems
                    }
                };

            }
        } else { // single main menu
            var mmMenu = getMenuItemDef(menuConf);
            if (mmMenu) {
                return {
                    text: mmMenu.menuLabel,
                    cls: 'x-menu-item-medium',
                    _menuAction: mmMenu.menuAction,
                    _winConf: mmMenu.winConf,
                    // popupOnly: true,
                    // notDDMenu: true,
                    // listeners: {
                    //    afterrender: function(thisMenu) {
                    //        addMenuAction(thisMenu);
                    //    }
                    // },
                    handler: function(thisMenu, e) {
                        runMenuAction(thisMenu._menuAction, thisMenu.text, thisMenu._winConf);
                    }
                };
            }
        }
    }

    return null;
}


function getMenuItemDef(menuStr) {
    var menuParts = menuStr.split('|');

    if (menuParts.length > 1 && menuParts[1].trim() !== '') {
        // get outbound status
        var smmParts = menuParts[0].split(';');
        var allowedMenu = true;
        if (smmParts.length > 1 && smmParts[1].trim() === 'ob') {
            allowedMenu = outbound;
        }
        
        // win config
        var winConf = {};
        if (!isNaN(menuParts[2])) { // width
            winConf.width = parseInt(menuParts[2]);
        }
        if (!isNaN(menuParts[3])) { // height
            winConf.height = parseInt(menuParts[3]);
        }

        if (allowedMenu) {
            return {
                menuLabel: languageFormat.getLanguage(smmParts[0].trim(), smmParts[0]),
                menuAction: menuParts[1],
                winConf: winConf
            };
        }
    }

    return null;
}

function runMenuAction(menuAction, menuLabel, winConf) {
    var actionParts = menuAction.split('fn:');
    if (actionParts.length > 1) { // assume as js
        try {
            eval(actionParts[1]); // execute js
        } catch (e) {
            msgutil.alert(languageFormat.getLanguage(31112, 'Error occurred.'));
            console.log(e.stack);
        }
    } else if (actionParts.length === 1) { // assume as a link
        // check current URL is absolute or relative
        var re = /^(http|https):\/\//;
        var newURL = '';
        var openInside = true;
        if (re.test(actionParts[0])) {
            newURL = actionParts[0];
            // openInside = false; // absolute url can't be opened inside cos of the same origin policy
        } else {
            newURL = window.location.origin + '/' + actionParts[0];
        }
        
        var params = [
                      'ft=' + gl_fonttype,
                      'fs=' + globalFontSize,
                      'lang=' + global_Language,
                      'color=' + formatutils.procThemeColor()
                  ];
        
        newURL = helper.addUrlParams(newURL, params.join('&'));
        
        var urlName = 'link_' + menuLabel;
        
        if ((jsutil.toBoolean(showUISettingItem[3]) && jsutil.toBoolean(global_NewWindow_Report)) || !openInside) {
            msgutil.openURL({
                url: newURL,
                name: urlName
            });
        } else {
            n2ncomponents.openFrame(urlName, newURL, Ext.apply({title: menuLabel}, {winConfig: winConf}));
        }
    }
}

function addMenuAction(thisMenu) {
    var menuEl = thisMenu.getEl();

    var actionParts = thisMenu._menuAction.split('fn:');
    var actionStr;
    if (actionParts.length > 1) {
        actionStr = actionParts[1];
    } else if (actionParts.length === 1) {
        actionStr = 'var winLink = window.open("' + actionParts[0] + '", "link_' + thisMenu.text + '"); if(winLink) winLink.focus();';
    }

    if (actionStr) {
        menuEl.set({
            onclick: 'javascript:' + actionStr
        });
    }
}

function getMetroOtherMenus() {
    var sItems = [];
    for (var i = 1; i <= 6; i++) {
        var oMenu = initMobileMenuObj(N2N_CONFIG['otherMenu' + i]);
        if (oMenu) {
            sItems = sItems.concat(oMenu);
        }
    }

    return sItems;
}

function initMobileMenuObj(menuConf) {
    // read menu configuration
    if (!jsutil.isEmpty(menuConf)) {
        // read main menu
        var mainMenuParts = menuConf.split('{');

        if (mainMenuParts.length > 1 && mainMenuParts[1].trim() !== '') {
            var mmParts = mainMenuParts[0].split(';');
            var allowedMenu = true;
            if (mmParts.length > 1 && mmParts[1].trim() === 'ob') {
                allowedMenu = outbound;
            }

            if (allowedMenu) {
                var mainMenuLabel = languageFormat.getLanguage(mmParts[0].trim(), mmParts[0]);

                var menuItems = [];
                var subMenuParts = mainMenuParts[1].split(',');
                for (var i = 0; i < subMenuParts.length; i++) {
                    var subMenu = getMenuItemDef(subMenuParts[i]);
                    if (subMenu) {
                        var runId = Ext.id();
                        var fnId = 'fn_' + runId;
                        var paramId = 'param_' + runId;
                        menuHandler[fnId] = function(prId) {
                            // get fn param
                            var paramObj = menuHandler[prId];
                            if (paramObj) {
                                runMenuAction(paramObj.menuAction, paramObj.menuLabel);
                            }
                        };
                        menuHandler[paramId] = subMenu;

                        menuItems.push({
                            menulabel: mainMenuLabel + ' - ' + subMenu.menuLabel,
                            fn: "menuHandler['" + fnId + "']('" + paramId + "');",
                            iconCls: 'mobile-icon-submenu-services'
                        });
                    }
                }

                return menuItems;

            }
        } else { // single main menu
            var mmMenu = getMenuItemDef(menuConf);
            if (mmMenu) {
                var runId = Ext.id();
                var fnId = 'fn_' + runId;
                var paramId = 'param_' + runId;
                menuHandler[fnId] = function(prId) {
                    // get fn param
                    var paramObj = menuHandler[prId];
                    if (paramObj) {
                        runMenuAction(paramObj.menuAction, paramObj.menuLabel);
                    }
                };
                menuHandler[paramId] = subMenu;

                return [{
                        menulabel: mmMenu.menuLabel,
                        fn: "menuHandler['" + fnId + "']('" + paramId + "');",
                        iconCls: 'mobile-icon-submenu-services'
                    }];
            }
        }
    }

    return null;
}
