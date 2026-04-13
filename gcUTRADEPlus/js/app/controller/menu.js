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
    stockNews: function() {
        var stk = n2nLayoutManager.getActiveRecord();
        if (stk) {
            createStkNewsPanel(stk.stkCode, stk.stkName);
        }
    },
    elasticNews: function(newsOption) {
        var activeStk = n2nLayoutManager.getActiveRecord();
        n2ncomponents.openElasticNews({key: activeStk.stkCode, name: activeStk.stkName, newsOpt: newsOption});
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
        createWorldIndicesPanel();
    },
    orderStatus: function() {
        createOrdStsPanel('', '0');
        // resetOrderPad();	// to reset Order Pad
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
        if (userPreference && exchangecode !== exchange) {
            userPreference.set('last_ex', exchange);
            userPreference.save();
        }
        
        // Set current exchange code
        exchangecode = exchange;

        showExType = viewExType[exchangecode];
        if (showExType == null || showExType == "") {
            showExType = 'R';
        }

        viewInLotMode = isLotMode();
        
        if (!quoteScreen) {
            createQuoteScreen(true);
        }
        
        // reset index when switch exchange
        if (topPanelBar) {
            topPanelBar.clearTextField();
            topPanelBar.updateByExchange();
        }
            
        if (quoteScreen) {
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
            quoteScreen.resetFeedSetting();
            quoteScreen.callSort();
            quoteScreen.updateRDToolTip();

            // some exchange right click features is not supported
            if (outbound) {
                quoteScreen.disableRightFunction();
            }

            /*
             if (showV1GUI != "TRUE") {
             if (outbound) {
             disableMenuItems(exchangecode);
             }
             }*/

            conn.initializeSectors();

            n2nLayoutManager.activateItem(quoteScreen);
        }
        
        updateTopMenu();

        // Tracker record
        if (trackerRecord) {
            trackerRecord.reset();
        }
        
        if (n2ncomponents.bkInfo) {
            n2ncomponents.bkInfo.setExchange(exchangecode);
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
    openExchangeRateWin: function(){
    	n2ncomponents.openExchangeRateWin();
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
    }
};

function mainmenu() {
    var mainMenuItems = new Array();
    
    mainMenuItems.push({
        id: 'tbQS',
        text: languageFormat.getLanguage(20673, 'Quote'),
        icon: iconQuote,
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
    
    if (N2N_CONFIG.worldIndices) {
        mainMenuItems.push({
            id: 'tbWi',
            text: languageFormat.getLanguage(20158, 'World Indices'),
            iconCls: 'icon-worldindices',
            handler: menuHandler.worldindices,
            listeners: menuListeners()
        });
    }

    if (showForeignFlows == "TRUE") {
        mainMenuItems.push({
            text: 'Foreign Flows',
            id: 'tbFF',
            icon: iconForeignFlows24b,
            cls: 'smallmenutext',
            handler: function() {
                menuHandler.foreignFlow();
            },
            listeners: menuListeners()
        });
    }
    
    if (N2N_CONFIG.brokerInfo) {
        mainMenuItems.push({
            text: 'Broker Info',
            id: 'tbBI',
            icon: iconBrokerInfo,
            cls: 'smallmenutext',
            handler: function() {
                menuHandler.brokerInfo();
            },
            listeners: menuListeners()
        });
    }

    // Demo menu
    if (N2N_CONFIG.menu_Demo) {
        mainMenuItems.push({
            text: languageFormat.getLanguage(20667, 'Demo'),
            icon: ICON.MENU_DEMO,
            handler: function() {
                msgutil.openURL({
                    url: formatUrl(N2N_CONFIG.demoURL)
                });
            }
        });
    }

    //mainMenuItems.push('->');

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
        var mnIcon = iconNormalScreen;
        var urlmain = window.parent.location.href.toString().split(window.parent.location.host)[1].indexOf("indexMin.jsp") != -1 ? false : true;

        if (urlmain) {
            global_onFullScreen = false;

            mnText = '&nbsp;&nbsp;' + languageFormat.getLanguage(20632, 'Full') + '&nbsp;&nbsp;';
            mnIcon = iconFullScreen;
        } else {
            global_onFullScreen = true;
        }

        mainMenuItems.push({
            text: mnText,
            icon: mnIcon,
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
    
    if (global_logoutButton.toLowerCase() == 'true') {
        mainMenuItems.push({
        	id: 'tbLog',
            text: languageFormat.getLanguage(10006, 'Logout'),
            icon: global_personalizationTheme.indexOf("wh") == -1 ? icoBtnLogout24 : iconWBBtnLogOut,
            notDDMenu: true,
            handler: function () {
                menuHandler.logout();
            },
            listeners: menuListeners()
        });
    }

    if (tbMenuRDIcon)
        mainMenuItems.push(tbMenuRDIcon);

    // Show power by image
    if (N2N_CONFIG.showPowerBy) {
        mainMenuItems.push({
            xtype: 'box',
            width: 112,
            height: 42,
            margin: 5,
            cls: 'default-cursor',
            autoEl: {
                tag: 'img',
                src: ICON.MENU_POWER_BY
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
                icon: iconService,
                menu: sItems,
                listeners: menuListeners()
            });
        }

    }
    
    if (settingSMSStockAlertURL.length > 0) {
        mainMenuItems.push({
        	id: 'tbSA',
            text: languageFormat.getLanguage(20602, 'Stock Alert'),
            icon: global_personalizationTheme.indexOf("wh") == -1 ? icoBtnStkAlert : iconWBBtnStkAlert,
            notDDMenu: true,
            handler: menuHandler.stockAlert,
            listeners: menuListeners()
        });
    }
    
    var menuCookie = userPreference.get('menuRowSettings'); //cookies.readCookie(loginId + '_MenuRowSettings');
    if (menuCookie != null) {
        var tempRowArray = new Array();
        var menuCookieArr = menuCookie.split(',');
        
        if(menuCookieArr.length == mainMenuItems.length){
        	for (var i = 0; i < menuCookieArr.length; i++) {
        		for (var j = 0; j < mainMenuItems.length; j++) {
        			if (menuCookieArr[i] == mainMenuItems[j].id) {
        				tempRowArray.push(mainMenuItems[j]);
        				break;
        			}
        		}
        	}
        	mainMenuItems = tempRowArray;
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
                icon: icoBtnSummary24,
                cls: 'x-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.marketSummary
            });
        }

        if (showMarketIndices == "TRUE") {
            tbMarketItem.push({
                text: languageFormat.getLanguage(20029, 'Indices'),
                icon: icoBtnIndices24,
                cls: 'x-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.indices
            });
        }

        if (showMarketScoreBoard == "TRUE") {
            tbMarketItem.push({
                text: languageFormat.getLanguage(20156, 'Scoreboard'),
                icon: icoBtnSBoard24,
                cls: 'x-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.scoreBoard
            });
        }
        if (configutil.getTrueConfig(showMarketStreamer)) {
            tbMarketItem.push({
                text: languageFormat.getLanguage(20157, 'Streamer'),
                icon: icoBtnStreamer24,
                cls: 'x-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.streamer
            });
        }

        if (global_TrackerRecord.toLowerCase() == 'true') {
        	tbMarketItem.push({
        		text: languageFormat.getLanguage(20501, 'Tracker Record'),
        		icon: icoBtnTrackerRecord24,
        		cls: 'x-menu-item-medium',
                iconAlign: 'top',
        		handler: menuHandler.trackerRecord
        	});
        }

        if (configutil.getTrueConfig(showMarketWorldIndices)) {
            tbMarketItem.push({
                text: languageFormat.getLanguage(20158, 'World Indices'),
                icon: icoBtnIndices24,
                cls: 'x-menu-item-medium',
                iconAlign: 'top',
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
            icon: global_personalizationTheme.indexOf("wh") == -1 ? icoBtnSummary24 : iconWBBtnMarket,
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
                icon: global_personalizationTheme.indexOf("wh") == -1 ? icoBtnNews24 : iconWBBtnNews,
                menu: menuNews,
                listeners: menuListeners()
            };
        } else if (menuCount == 1) {
            tbMenuNews = tbNewsItem[0];
            tbMenuNews.cls = '';
        }
    }



    if (showWatchListHeader == "TRUE") {
        var tbWacthListItem = [];
        
        if (N2N_CONFIG.recentQuote) {
            tbWacthListItem.push({
                id: 'tbwl_recent',
                text: languageFormat.getLanguage(20018, 'Recent Quotes'),
                icon: icoBtnAddWlist24,
                cls: 'x-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.recentQuote,
                notDDMenu: true
            });
        }
        if (showWatchListView == "TRUE" && !isGuestUser) {
            tbWacthListItem.push({
                id: 'tbwl_view',
                text: languageFormat.getLanguage(20002, 'View Watchlist'),
                icon: icoBtnViewWlist24,
                disabled: true,
                cls: 'x-menu-item-medium',
                iconAlign: 'top',
                notDDMenu: true
            });
        }
        if (showWatchListCreate == "TRUE") {
            tbWacthListItem.push({
                id: 'tbwl_create',
                text: languageFormat.getLanguage(20003, 'Create Watchlist'),
                icon: icoBtnAddWlist24,
                cls: 'x-menu-item-medium',
                iconAlign: 'top',
                disabled: isGuestUser && N2N_CONFIG.requiredLoginUrl === '',
                handler: menuHandler.createWatchList,
                notDDMenu: true
                    });
                }
        if (showWatchListRename == "TRUE" && !isGuestUser) {
            tbWacthListItem.push({
                id: 'tbwl_rename',
                text: languageFormat.getLanguage(20004, 'Rename Watchlist'),
                icon: iconBtnRenameWlist24,
                disabled: true,
                cls: 'x-menu-item-medium',
                iconAlign: 'top',
                notDDMenu: true
            });
        }
        if (showWatchListDelete == "TRUE" && !isGuestUser) {
            tbWacthListItem.push({
                id: 'tbwl_delete',
                text: languageFormat.getLanguage(20005, 'Delete Watchlist'),
                icon: icoBtnRmvWlist24,
                disabled: true,
                cls: 'x-menu-item-medium',
                iconAlign: 'top',
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
            icon: global_personalizationTheme.indexOf("wh") == -1 ? icoBtnWlist24 : icoWBBtnWlist,
            // arrowAlign:'bottom',
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
                icon: icoBtnStkInfo24,
                cls: 'x-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.stockInfo
            });
        }

        if (showStkInfoMarketDepth == "TRUE") {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20022, 'Market Depth'),
                icon: icoBtnDepth24,
                cls: 'x-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.marketDepth
            });
        }

        if (showStkInfoMarketMatrixDepth.toLowerCase() == "true") {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20023, 'Depth Matrix'),
                icon: icoBtnDepth24,
                cls: 'x-menu-item-medium',
                iconAlign: 'top',
                handler: function() {
                    createMarketDepthMatrixPanel();
                }
            });
        }



        if (showStkInfoTracker == "TRUE") {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20024, 'Stock Tracker'),
                icon: icoBtnTracker24,
                cls: 'x-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.tracker
            });
        }

        if (showStkInfoEquitiesTracker == "TRUE") {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20025, 'Equities Tracker'),
                icon: icoBtnEquitiesTracker24,
                cls: 'x-menu-item-medium',
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
                icon: ICON.HIS_DATA24,
                cls: 'x-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.historicalData
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
                icon: global_personalizationTheme.indexOf("wh") == -1 ? icoBtnStkInfo24 : iconWBBtnSInfo,
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
            icon: icoBtnChat24,
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
                icon: icoBtnFCalculator24,
                cls: 'x-menu-item-medium',
                handler: menuHandler.breakEvenCalc
            });
        }        
        if (N2N_CONFIG.perEPSCalc) {
            calcMenuItems.push({
                text: languageFormat.getLanguage(21005, 'P/E Ratio & EPS Calculator'),
                icon: icoBtnFCalculator24,
                cls: 'x-menu-item-medium',
                handler: menuHandler.PERatioEPSCalc
            });
        }
        if (N2N_CONFIG.calcURL != '') {
            calcMenuItems.push({
                text: languageFormat.getLanguage(20623, 'Calculator'),
                icon: icoBtnFCalculator24,
                cls: 'x-menu-item-medium',
                handler: menuHandler.externalCalc
            });
        }
        
        if (N2N_CONFIG.tradeCal) {
            calcMenuItems.push({
                text: languageFormat.getLanguage(31600, 'Trade Calculator'),
                icon: icoBtnFCalculator24,
                cls: 'x-menu-item-medium',
                handler: menuHandler.tradeCal
            });
        }

        if (calcMenuItems.length > 0) {
            tbMenuFCalculator = {
            	id: 'tbCalc',
                text: languageFormat.getLanguage(20621, 'Calculator'),
                icon: global_personalizationTheme.indexOf("wh") == -1 ? icoBtnFCalculator24 : iconWBBtnCal,
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
            icon: global_personalizationTheme.indexOf("wh") == -1 ? icoBtnReports24 : iconWBBtnReport,
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
                icon: icoBtnPrtFolio24,
                cls: 'x-menu-item-medium',
                handler: menuHandler.derivativePrtf
            });
        }

        if (showPortFolioMyPortFolio == "TRUE") {
            tbPortFolio.push({
                id: 'myPortfolio',
                text: languageFormat.getLanguage(20262, 'Equities Portfolio'),
                icon: icoBtnPrtFolio24,
                cls: 'x-menu-item-medium',
                handler: menuHandler.equityPrtf
            });
        }
        
        if (showPortFolioRealizedGainLoss == "TRUE") {
            tbPortFolio.push({
                id: 'portfolioRealizedGainLoss',
                text: languageFormat.getLanguage(20265, 'Realised Gain/Loss'),
                icon: icoBtnPrtFolioRealizedGainLoss24,
                cls: 'x-menu-item-medium',
                handler: menuHandler.realizedPrtf
            });
        }
        
        if (global_showPortFolioManualPortFolio == "TRUE") {
            tbPortFolio.push({
                id: 'manualPortfolio',
                text: languageFormat.getLanguage(20264, 'Manual Portfolio'),
                icon: icoBtnPrtFolio24,
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
                    icon: icoBtnPrtFolioRealizedGainLoss24,
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
                    icon: icoBtnPrtFolioRealizedGainLoss24,
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
                icon: icoBtnPrtFolioRealizedGainLoss24,
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
            icon: global_personalizationTheme.indexOf("wh") == -1 ? icoBtnPrtFolio24 : iconWBBtnPF,
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
                icon: icoBtnOrdSts24,
                handler: menuHandler.orderStatus
            });
        }

        if (showOrdBookOrderHistory == "TRUE") {
            tbOrderbook.push({
                id: 'ord_history',
                text: languageFormat.getLanguage(20173, 'Order History'),
                cls: 'x-menu-item-medium',
                icon: icoBtnOrdSts24,
                handler: function() {
                    resetOrderPad();
                    createOrdHistoryPanel();
                }
            });
        }

        if (showOrdBookOrderLog == "TRUE") {
            tbOrderbook.push({
                id: 'ord_log',
                text: languageFormat.getLanguage(20174, 'Order Log'),
                disabled: true,
                cls: 'x-menu-item-medium',
                icon: icoBtnOrdSts24,
                handler: function() {
                    resetOrderPad();
                    createOrdLogPanel();
                    orderLogPanel.callOrdLog();
                }
            });
        }

        var menuOrderBook = new Ext.menu.Menu({
            cls: 'x-menu-medium',
            items: tbOrderbook
        });

        tbMenuOrdSts = {
            id: 'tbOS',
            cls: 'fixpadding',
            text: languageFormat.getLanguage(20171, 'Order Book'),
            icon: global_personalizationTheme.indexOf("wh") == -1 ? icoBtnOrdSts24 : iconWBBtnOrdBook,
            menu: menuOrderBook,
            listeners: menuListeners()
        };
    }

    if (showExchangeHeader == "TRUE") {
        tbMenuExchg = {
            id: 'tbEx',
            text: languageFormat.getLanguage(20301, 'Exchange'),
            icon: global_personalizationTheme.indexOf("wh") == -1 ? icoBtnExchg24 : iconWBBtnEx,
            listeners: menuListeners()
                    // arrowAlign:'bottom'
        };
    }

    /* 12/1/2016 moved under Market Menu
    if (global_TrackerRecord.toLowerCase() == 'true') {
        tbMenuTrackerRecord = {
        	id: 'tbTR',
            text: languageFormat.getLanguage(20501, 'Tracker Record'),
            icon: icoBtnTrackerRecord24,
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
                icon: icoBtnAnalysisDividend24,
                cls: 'x-menu-item-medium',
                handler: menuHandler.analysisDividend
            });
        }

        if (N2N_CONFIG.features_Analysis_Warrants) {
            tbMenuAnalysis.push({
                text: languageFormat.getLanguage(20142, 'Warrants'),
                icon: icoBtnAnalysisWarrants24,
                cls: 'x-menu-item-medium',
                handler: menuHandler.analysisWarrants
            });
        }

        if (N2N_CONFIG.features_Analysis_BMFutures) {
            tbMenuAnalysis.push({
                text: languageFormat.getLanguage(20143, 'BMD Futures'),
                icon: icoBtnAnalysisBMFutures24,
                cls: 'x-menu-item-medium',
                handler: menuHandler.analysisBMD_Future
            });
        }

        var menuMenuAnalysis = new Ext.menu.Menu({
            cls: 'x-menu-medium',
            items: tbMenuAnalysis
        });

        tbMenuAnalysiss = {
            id: "tbMenuAnalysis",
            text: languageFormat.getLanguage(20144, 'Analysis'),
            icon: global_personalizationTheme.indexOf("wh") == -1 ? icoBtnAnalysis24 : iconWBBtnANAL,
            menu: menuMenuAnalysis,
            listeners: menuListeners()
        };
    }

    if (showSettingHeader == "TRUE") {
        var tbMenuSetting = [];

        if (showSettingStockAlert == "TRUE") {
            tbMenuSetting.push({
                id: 'stockalert',
                icon: icoBtnStkAlert24,
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
                                    resizable: true,
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
                icon: icoBtnAddStkAlert24,
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
                icon: icoBtnStkAlert24,
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
                icon: icoBtnOtherTool,
                text: languageFormat.getLanguage(20617, 'Settings'),
                cls: 'x-menu-item-medium',
                notDDMenu: true,
                handler: function() {
                    n2ncomponents.settingUI();
                }
            });

        }
        /* // not used anymore, moved to settings
        if (N2N_CONFIG.layoutSetting) {
            tbMenuSetting.push({
                id: 'layoutSetting',
                icon: icoBtnOtherTool,
                text: languageFormat.getLanguage(20605, 'Layout'),
                cls: 'x-menu-item-medium',
                handler: function() {
                    n2ncomponents.layoutSettingUI();
                }
            });
        }
        */
        if (configutil.getDefaultTrueConfig(showTickerSetting)) {
            tbMenuSetting.push({
                id: 'tickerSettingSubMenu',
                icon: icoBtnOtherTool,
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
                icon: iconLanguageSetting,
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
            icon: global_personalizationTheme.indexOf("wh") == -1 ? icoBtnSetting24 : iconWBBtnSET,
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
                icon: ICON.MENU_EDIT_PROFILE,
                handler: menuHandler.changePwd
            });
        }

        // Forgot password
        if (N2N_CONFIG.profileForPwdURL != '') {
            profileMenuItems.push({
                text: languageFormat.getLanguage(20613, 'Forgot Password'),
                cls: 'x-menu-item-medium',
                icon: ICON.MENU_EDIT_PROFILE,
                handler: menuHandler.forgotPwd
            });
        }

        // Change Pin
        if (N2N_CONFIG.profileChgPinURL != '') {
            profileMenuItems.push({
                text: languageFormat.getLanguage(20614, 'Change Pin'),
                cls: 'x-menu-item-medium',
                icon: ICON.MENU_EDIT_PROFILE,
                handler: menuHandler.changePin
            });
        }

        // Forgot Pin
        if (N2N_CONFIG.profileForPinURL != '') {
            profileMenuItems.push({
                text: languageFormat.getLanguage(20615, 'Forgot Pin'),
                cls: 'x-menu-item-medium',
                icon: ICON.MENU_EDIT_PROFILE,
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
                icon: ICON.MENU_PROFILE,
                menu: profileSubMenu
            };
        }
    }

    if (global_showOtherToolHeader.toLowerCase() == 'true') {

        var tempOtherToolItems = [];
        
        if ( global_otherToolStockScreenerURL.length > 0 ) {
    		tempOtherToolItems.push( {
    			icon	: icoBtnStockFilter,
				text	: languageFormat.getLanguage(20522, 'Stock Filter'),
				cls	: 'x-menu-item-medium',
				handler	: function() {
					
					if (N2N_CONFIG.newWin_StkFilter) {

						if ( window.name == "_otherTool_StockScreener" )
							window.name = ""; //if tclite load on new_tab then name that win to blank
						
						window.open( global_otherToolStockScreenerURL,'_otherTool_StockScreener' );

					} else {

						if ( userReport['userReport_otherTool_StockScreener'] == null ) {
							var tempTab = Ext.create('Ext.ux.IFrame', {
								title		: languageFormat.getLanguage(20522, 'Stock Filter'),
								id			: 'userReport_otherTool_StockScreener',
								url 		: global_otherToolStockScreenerURL,
								iframeScroll: true
							} );

							tempTab.on( 'beforedestroy', function() {
								userReport[ 'userReport_otherTool_StockScreener' ] = null;
							} );

							addTab( tabPanel1, tempTab, true, '' );
							tempTab.refresh(tempTab.url);

							userReport[ 'userReport_otherTool_StockScreener' ] = tempTab;

						} else {

     						userReport[ 'userReport_otherTool_StockScreener' ].refresh(global_otherToolStockScreenerURL);
							
							for( var i = 0; i < tabPanel1.items.length; i ++ ) {
								var tempComponent = tabPanel1.getComponent(i).getComponent(0);

								if ( tempComponent.id == 'userReport_otherTool_StockScreener' ) {
									tabPanel1.setActiveTab( i );
									break;
								}
							}
						}
					}
				}
    		} );
    	}

        if (global_showOtherToolStockFilter.toLowerCase() == 'true') {
            tempOtherToolItems.push({
                icon: icoBtnStockFilter,
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
                icon: icoBtnExchangeRate,
                text: languageFormat.getLanguage(20523, 'Exchange Rate'),
                cls: 'x-menu-item-medium',
                handler	: menuHandler.openExchangeRateWin
            });
        }
        
        if(global_showOtherToolFXConversion.toLowerCase() == 'true'){
            tempOtherToolItems.push( {
			icon	: icoBtnExchangeRate,
			text	: languageFormat.getLanguage(21250, 'FX Conversion - CUT'),
            cls		: 'x-menu-item-medium',
			handler	: function() {
						menuHandler.FXConversion();}
                    });
        }
        
        if(theScreenerURL.length > 0){
            tempOtherToolItems.push( {
			icon	: icoBtnExchangeRate,
			text	: languageFormat.getLanguage(20525, 'TheScreener'),
            cls		: 'x-menu-item-medium',
			handler	: function() {
						menuHandler.theScreener();}
                    });
        }

        tbMenuOtherTool = {
            text: languageFormat.getLanguage(20521, 'Tools'),
            icon: icoBtnOtherTool,
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
            icon: global_personalizationTheme.indexOf("wh") == -1 ? iconUserGuide24 : iconWBBtnUserGuide,
            handler: menuHandler.userGuide,
            listeners: menuListeners()
    	};			
    }

    if (configutil.getTrueConfig(showBuySellHeader)) {
        tbMenuBuy = {
            id: 'tbBuy',
            text: '&nbsp;' + languageFormat.getLanguage(10001, 'Buy') + '&nbsp;',
            icon: global_personalizationTheme.indexOf("wh") == -1 ? icoBtnBuy24 : iconWBBtnBuy,
            //           width:50,
            handler: menuHandler.buy,
            listeners: menuListeners()
        };

        tbMenuSell = {
            id: 'tbSell',
            text: '&nbsp;' + languageFormat.getLanguage(10002, 'Sell') + '&nbsp;',
            icon: global_personalizationTheme.indexOf("wh") == -1 ? icoBtnSell24 : iconWBBtnSell,
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
                icon: icoBtnIntraChart24,
                cls: 'x-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.intradayChart
            });
        }

        if (configutil.getTrueConfig(showChartAnalysisChart)) {
            tbChartItem.push({
                text: languageFormat.getLanguage(20102, 'Analysis Chart'),
                icon: icoBtnIntraChart24,
                cls: 'x-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.analysisChart
            });
        }

        if (configutil.getTrueConfig(showChartITFinanceChart)) {
            tbChartItem.push({
                text: languageFormat.getLanguage(20113, 'IT Finance Chart'),
                icon: icoBtnIntraChart24,
                cls: 'x-menu-item-medium',
                iconAlign: 'top',
                handler: function() {
                    createITFinanceChartPanel();
                }
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
                icon: global_personalizationTheme.indexOf("wh") == -1 ? icoBtnIntraChart24 : iconWBBtnChart,
                menu: menuChart,
                listeners: menuListeners()
            };
        } else if (menuCount == 1) {
            tbMenuChart = tbChartItem[0];
            tbMenuChart.cls = '';
        }
    }

    if (outbound == true) {
        if (global_personalizationTheme.indexOf("wh") == -1) {
        tbMenuRDIcon = {
            xtype: "box",
            id: "tbMenuRDIcon",
            width: 112,
            height: 35,
            autoEl: {
                tag: 'img',
                src: icoBtnRDBanner
            }
        };
    }
}
}

function mainmenuTools() {
    var mainMenuItems = new Array();

    if (isMobile) {
        mainMenuItems.push({
            id: 'tbQS',
            text: languageFormat.getLanguage(20673, 'Quote'),
            //icon: iconBtnQuote24,
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

    // Demo menu
    if (N2N_CONFIG.menu_Demo) {
        mainMenuItems.push({
            text: languageFormat.getLanguage(20667, 'Demo'),
            icon: ICON.MENU_DEMO,
            handler: function() {
                msgutil.openURL({
                    url: formatUrl(N2N_CONFIG.demoURL)
                });
            }
        });
    }

    //mainMenuItems.push('->');

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
        var mnIcon = iconNormalScreen;
        var urlmain = window.parent.location.href.toString().split(window.parent.location.host)[1].indexOf("indexMin.jsp") != -1 ? false : true;

        if (urlmain) {
            global_onFullScreen = false;

            mnText = '&nbsp;&nbsp;' + languageFormat.getLanguage(20632, 'Full') + '&nbsp;&nbsp;';
            mnIcon = iconFullScreen;
        } else {
            global_onFullScreen = true;
        }

        mainMenuItems.push({
            text: mnText,
            icon: mnIcon,
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
            //icon: icoBtnLogout24,
            cls: 'toolbar-menu-medium',
            handler: function() {
                menuHandler.logout();
            }
        });
    }

    if (tbMenuRDIcon)
        mainMenuItems.push(tbMenuRDIcon);

    // Show power by image
    if (N2N_CONFIG.showPowerBy) {
        mainMenuItems.push({
            xtype: 'box',
            width: 112,
            height: 42,
            margin: 5,
            cls: 'default-cursor',
            autoEl: {
                tag: 'img',
                src: ICON.MENU_POWER_BY
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
                //icon: icoBtnSummary24,
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.marketSummary
            });
        }

        if (showMarketIndices == "TRUE") {
            tbMarketItem.push({
                text: languageFormat.getLanguage(20029, 'Indices'),
                //icon: icoBtnIndices24,
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.indices
            });
        }

        if (showMarketScoreBoard == "TRUE") {
            tbMarketItem.push({
                text: languageFormat.getLanguage(20156, 'Scoreboard'),
                //icon: icoBtnSBoard24,
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.scoreBoard
            });
        }
        if (configutil.getTrueConfig(showMarketStreamer)) {
            tbMarketItem.push({
                text: languageFormat.getLanguage(20157, 'Streamer'),
                //icon: icoBtnSummary24,
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.streamer
            });
        }

        if (configutil.getTrueConfig(showMarketWorldIndices)) {
            tbMarketItem.push({
                text: languageFormat.getLanguage(20158, 'World Indices'),
                //icon: icoBtnIndices24,
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
                //icon: icoBtnSummary24,
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
                //icon: icoBtnNews24,
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
                //icon: icoBtnViewWlist24,
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
                //icon: icoBtnAddWlist24,
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
                //icon: iconBtnRenameWlist24,
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
                //icon: icoBtnRmvWlist24,
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
            //icon: icoBtnWlist24,
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
                //icon: icoBtnStkInfo24,
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.stockInfo
            });
        }

        if (showStkInfoMarketDepth == "TRUE") {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20022, 'Market Depth'),
                // icon: icoBtnDepth24,
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.marketDepth
            });
        }

        if (showStkInfoMarketMatrixDepth.toLowerCase() == "true") {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20023, 'Depth Matrix'),
                // icon: icoBtnDepth24,
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
                // icon: icoBtnTracker24,
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.tracker
            });
        }

        if (showStkInfoEquitiesTracker == "TRUE") {
            tbStkInfoItem.push({
                text: languageFormat.getLanguage(20025, 'Equities Tracker'),
                //icon: icoBtnEquitiesTracker24,
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
                // icon: ICON.HIS_DATA24,
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.historicalData
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
                // icon: icoBtnStkInfo24,
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
            // icon: icoBtnChat24,
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
                // icon: icoBtnFCalculator24,
                showSeparator: false,
                handler: menuHandler.breakEvenCalc
            });
        }
        if (N2N_CONFIG.calcURL != '') {
            calcMenuItems.push({
                text: languageFormat.getLanguage(20623, 'Calculator'),
                //  icon: icoBtnFCalculator24,
                showSeparator: false,
                handler: function() {
                    n2ncomponents.createMFCalc();
                }
            });
        }

        if (calcMenuItems.length > 0) {
            tbMenuFCalculator = {
                text: languageFormat.getLanguage(20621, 'Calculator'),
                //  icon: icoBtnFCalculator24,
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
            // icon: icoBtnReports24,
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
                //  icon: icoBtnPrtFolio24,
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                handler: menuHandler.derivativePrtf
            });
        }

        if (showPortFolioMyPortFolio == "TRUE") {
            tbPortFolio.push({
                id: 'myPortfolio',
                text: languageFormat.getLanguage(20262, 'Equities Portfolio'),
                //  icon: icoBtnPrtFolio24,
                showSeparator: false,
                cls: 'toolbar-menu-item-medium',
                handler: menuHandler.equityPrtf
            });
        }

        if (global_showPortFolioManualPortFolio == "TRUE") {
            tbPortFolio.push({
                id: 'manualPortfolio',
                text: languageFormat.getLanguage(20264, 'Manual Portfolio'),
                // icon: icoBtnPrtFolio24,
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
                // icon: icoBtnPrtFolioRealizedGainLoss24,
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
                    //  icon: icoBtnPrtFolioRealizedGainLoss24,
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
                    //  icon: icoBtnPrtFolioRealizedGainLoss24,
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
                // icon: icoBtnPrtFolioRealizedGainLoss24,
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
            //  icon: icoBtnPrtFolio24,
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
                //    icon: icoBtnOrdSts24,
                handler: menuHandler.orderStatus
            });
        }

        if (showOrdBookOrderHistory == "TRUE") {
            tbOrderbook.push({
                id: 'ord_history',
                text: languageFormat.getLanguage(20173, 'Order History'),
                cls: 'toolbar-menu-item-medium',
                //    icon: icoBtnOrdSts24,
                handler: function() {
                    createOrdHistoryPanel();
                    resetOrderPad();	// to reset Order Pad
                }
            });
        }

        if (showOrdBookOrderLog == "TRUE") {
            tbOrderbook.push({
                id: 'ord_log',
                text: languageFormat.getLanguage(20174, 'Order Log'),
                disabled: true,
                cls: 'toolbar-menu-item-medium',
                //    icon: icoBtnOrdSts24,
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
            //   icon: icoBtnOrdSts24,
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
                    //    icon: icoBtnExchg24
                    // arrowAlign:'bottom'
        };
    }

    if (global_TrackerRecord.toLowerCase() == 'true') {
        tbMenuTrackerRecord = {
            text: languageFormat.getLanguage(20501, 'Tracker Record'),
            //   icon: icoBtnTrackerRecord24,
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
                //   icon: icoBtnAnalysisDividend24,
                cls: 'toolbar-menu-item-medium',
                handler: menuHandler.analysisDividend
            });
        }

        if (N2N_CONFIG.features_Analysis_Warrants) {
            tbMenuAnalysis.push({
                text: languageFormat.getLanguage(20142, 'Warrants'),
                //   icon: icoBtnAnalysisWarrants24,
                cls: 'toolbar-menu-item-medium',
                handler: menuHandler.analysisWarrants
            });
        }

        if (N2N_CONFIG.features_Analysis_BMFutures) {
            tbMenuAnalysis.push({
                text: languageFormat.getLanguage(20143, 'BMD Futures'),
                //    icon: icoBtnAnalysisBMFutures24,
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
//            icon: icoBtnAnalysis24,
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
                //    icon: icoBtnStkAlert24,
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
                                    resizable: true,
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
                //   icon: icoBtnAddStkAlert24,
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
                //   icon: icoBtnStkAlert24,
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
                //      icon: icoBtnOtherTool,
                text: languageFormat.getLanguage(20606, 'UI Settings'),
                cls: 'toolbar-menu-item-medium',
                handler: function() {
                    n2ncomponents.settingUI();
                }
            });

        }
        /*
        if (N2N_CONFIG.layoutSetting) {
            tbMenuSetting.push({
                id: 'layoutSetting',
                //     icon: icoBtnOtherTool,
                text: languageFormat.getLanguage(20605, 'Layout'),
                cls: 'toolbar-menu-item-medium',
                handler: function() {
                    n2ncomponents.layoutSettingUI();
                }
            });
        }
        */
        if (N2N_CONFIG.fontSizeButton) {
            tbMenuSetting.push({
                id: 'fontSizeSetting',
                //      icon: icoBtnOtherTool,
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
                //     icon: icoBtnOtherTool,
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
            //    icon: icoBtnSetting24,
            showSeparator: false,
            hideOnClick: false,
            cls: 'toolbar-menu-medium',
            menu: menuMenuSettings
        };


//	        tbMenuSetting = {
//	        	id: "tbMenuSetting",
//	        	text: "Setting",
//	        	icon: icoBtnSetting24,
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
                //       icon: ICON.MENU_EDIT_PROFILE,
                handler: menuHandler.changePwd
            });
        }

        // Forgot password
        if (N2N_CONFIG.profileForPwdURL != '') {
            profileMenuItems.push({
                text: languageFormat.getLanguage(20613, 'Forgot Password'),
                cls: 'toolbar-menu-item-medium',
                //        icon: ICON.MENU_EDIT_PROFILE,
                handler: menuHandler.forgotPwd
            });
        }

        // Change Pin
        if (N2N_CONFIG.profileChgPinURL != '') {
            profileMenuItems.push({
                text: languageFormat.getLanguage(20614, 'Change Pin'),
                cls: 'toolbar-menu-item-medium',
                //        icon: ICON.MENU_EDIT_PROFILE,
                handler: menuHandler.changePin
            });
        }

        // Forgot Pin
        if (N2N_CONFIG.profileForPinURL != '') {
            profileMenuItems.push({
                text: languageFormat.getLanguage(20615, 'Forgot Pin'),
                cls: 'toolbar-menu-item-medium',
                //       icon: ICON.MENU_EDIT_PROFILE,
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
                //      icon: ICON.MENU_PROFILE,
                menu: profileSubMenu
            };
        }
    }

    if (global_showOtherToolHeader.toLowerCase() == 'true') {

        var tempOtherToolItems = [];

        if (global_showOtherToolStockFilter.toLowerCase() == 'true') {
            tempOtherToolItems.push({
                //     icon: icoBtnStockFilter,
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
                //         icon: icoBtnExchangeRate,
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
            //     icon: icoBtnOtherTool,
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
            //        icon: icoBtnBuy24,
            width: 50,
            cls: 'toolbar-menu-medium',
            handler: menuHandler.buy
        };

        tbMenuSell = {
            id: 'tbSell',
            text: '&nbsp;' + languageFormat.getLanguage(10002, 'Sell') + '&nbsp;',
            //       icon: icoBtnSell24,
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
                //    icon: icoBtnIntraChart24,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.intradayChart
            });
        }

        if (configutil.getTrueConfig(showChartAnalysisChart)) {
            tbChartItem.push({
                text: languageFormat.getLanguage(20102, 'Analysis Chart'),
                //     icon: icoBtnIntraChart24,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: menuHandler.analysisChart
            });
        }

        if (configutil.getTrueConfig(showChartITFinanceChart)) {
            tbChartItem.push({
                text: languageFormat.getLanguage(20113, 'IT Finance Chart'),
                //       icon: icoBtnIntraChart24,
                cls: 'toolbar-menu-item-medium',
                iconAlign: 'top',
                handler: function() {
                    createITFinanceChartPanel();
                }
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
                //        icon: icoBtnIntraChart24,
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

    if (outbound == true) {
        tbMenuRDIcon = {
            xtype: "box",
            id: "tbMenuRDIcon",
            width: 112,
            height: 35,
            autoEl: {
                tag: 'img',
                src: icoBtnRDBanner
            }
        };
    }
}

var tbNewsItem = new Array();
function initializeNewsMenu() {

    if (showNewsHeader == "TRUE") {
        if (showNewsAnnouncements == "TRUE") {
            tbNewsItem.push({
                text: languageFormat.getLanguage(20122, 'Announcements'),
                icon: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? '' : icoBtnNews24,
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                iframeScroll: true,
                handler: menuHandler.announcement
            });
        }

        if (showNewsStockNews == "TRUE") {
            tbNewsItem.push({
                text: languageFormat.getLanguage(20123, 'Stock News'),
                icon: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? '' : icoBtnNews24,
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                handler: menuHandler.stockNews
            });
        }

        if (N2N_CONFIG.featuresNews_Archive) {
            tbNewsItem.push({
                text: languageFormat.getLanguage(20137, 'News Archive'),
                icon: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? '' : icoBtnArchive24,
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                handler: menuHandler.archiveNews
            });
        }
        
        if (N2N_CONFIG.elasticNewsUrl) {
            tbNewsItem.push({
                text: languageFormat.getLanguage(20140, 'Elastic News'),
                icon: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? '' : icoBtnArchive24,
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                handler: function() {
					menuHandler.elasticNews('1');
				}
            });
        }
        
        if (N2N_CONFIG.nikkeiNewsUrl) {
            tbNewsItem.push({
                text: languageFormat.getLanguage(21501, 'Nikkei News'),
                icon: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? '' : icoBtnArchive24,
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
        		handler: function() {
					menuHandler.elasticNews('2');
				}
            });
        }

        if (N2N_CONFIG.featuresNews_FundamentalCPIQ) {

            tbNewsItem.push({
                id: 'Fundamental_cpiq',
                icon: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? '' : icoBtnNews24,
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
            tbNewsItem.push({
                id: 'Fundamental_Screener_cpiq',
                icon: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? '' : icoBtnNews24,
                text: languageFormat.getLanguage(20125, 'Fundamental Screener (Capital IQ)'),
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                handler: function() {
                    createFundamentalScreenerCPIQWin();
                }
            });
        }

        if (N2N_CONFIG.featuresNews_FundamentalThomsonReuters) {
            tbNewsItem.push({
                id: 'Fundamental_ThomsonReuters',
                icon: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? '' : icoBtnNews24,
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
            tbNewsItem.push({
                id: 'Fundamental_Screener_ThomsonReuters',
                icon: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? '' : icoBtnNews24,
                text: languageFormat.getLanguage(20127, 'Fundamental Screener (Thomson Reuters)'),
                cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                handler: function() {
                    createFundamentalScreenerThomsonReutersWin();
                }
            });
        }
        
        if(N2N_CONFIG.pseEdgeURL.length > 0){
        	tbNewsItem.push( {
			text	: languageFormat.getLanguage(20139, 'PSE Edge'),
            cls		: 'x-menu-item-medium',
			handler	: function() {
						menuHandler.pseEdge();}
                    });
        }

        if (N2N_CONFIG.mbFeaturesNews_SPCapIQ) {

            if (N2N_CONFIG.mbFeaturesNews_SPCapIQ_Synopsis) {
                tbNewsItem.push({
                	icon: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? '' : icoBtnNews24,
                    text: languageFormat.getLanguage(20132, 'Company Synopsis'),
                    cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                    handler: function() {
                        menuHandler.spCapIQItem(languageFormat.getLanguage(20132, 'Company Synopsis'), 'Synopsis');
                    }
                });
            }

            if (N2N_CONFIG.mbFeaturesNews_SPCapIQ_ComInfo) {
                tbNewsItem.push({
                	icon: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? '' : icoBtnNews24,
                    text: languageFormat.getLanguage(20133, 'Company Info'),
                    cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                    handler: function() {
                        menuHandler.spCapIQItem(languageFormat.getLanguage(20133, 'Company Info'), 'Info');
                    }
                });
            }

            if (N2N_CONFIG.mbFeaturesNews_SPCapIQ_Announcement) {
                tbNewsItem.push({
                	icon: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? '' : icoBtnNews24,
                    text: languageFormat.getLanguage(20128, 'Announcement'),
                    cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                    handler: function() {
                        menuHandler.spCapIQItem(languageFormat.getLanguage(20128, 'Announcement'), 'Announcement');
                    }
                });
            }

            if (N2N_CONFIG.mbFeaturesNews_SPCapIQ_KeyPersons) {
                tbNewsItem.push({
                	icon: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? '' : icoBtnNews24,
                    text: languageFormat.getLanguage(20134, 'Key Persons'),
                    cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                    handler: function() {
                        menuHandler.spCapIQItem(languageFormat.getLanguage(20134, 'Key Persons'), 'KeyPerson');
                    }
                });
            }

            if (N2N_CONFIG.mbFeaturesNews_SPCapIQ_ShareSum) {
                tbNewsItem.push({
                	icon: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? '' : icoBtnNews24,
                    text: languageFormat.getLanguage(20135, 'Shareholding Summary'),
                    cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                    handler: function() {
                        menuHandler.spCapIQItem(languageFormat.getLanguage(20135, 'Shareholding Summary'), 'ShareHolders');
                    }
                });
            }

            if (N2N_CONFIG.mbFeaturesNews_SPCapIQ_FiReports) {
                tbNewsItem.push({
                	icon: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? '' : icoBtnNews24,
                    text: languageFormat.getLanguage(20136, 'Financial Reports'),
                    cls: N2N_CONFIG.menuType == MENU_TYPE.TOOL ? 'toolbar-menu-item-medium' : 'x-menu-item-medium',
                    handler: function() {
                        menuHandler.spCapIQItem(languageFormat.getLanguage(20136, 'Financial Reports'), 'Annual');
                    }
                });
            }

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
    var activeRec = n2nLayoutManager.getActiveRecord(true);
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
        icon: ICON.HOME,
        handler: function() {
            n2nLayoutManager.activateHomeScreen();
        }
    });
    metroMenuItems.push(mtHome);
    
    // Quote
    var mtQuote = metroMenuObj({
        text: languageFormat.getLanguage(20673, 'Quote'),
        mtColor: 'green',
        icon: ICON.QUOTE,
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
            icon: ICON.WATCHLIST,
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
            icon: ICON.STOCK_INFO,
            handler: function() {
                var subMenus = new Array();

                if (showStkInfoStkInfo == "TRUE") {
                    subMenus.push({icon: ICON.SSTOCKINFO, menulabel: languageFormat.getLanguage(20021, 'Stock Info'), fn: 'menuHandler.stockInfo();'});
                }
                if (showStkInfoMarketDepth == "TRUE") {
                    subMenus.push({icon: ICON.SMARKETDEPTH, menulabel: languageFormat.getLanguage(20022, 'Market Depth'), fn: 'menuHandler.marketDepth();'});
                }
                if (showStkInfoTracker == "TRUE") {
                    subMenus.push({icon: ICON.SSTOCKTRACKER, menulabel: languageFormat.getLanguage(20024, 'Stock Tracker'), fn: 'menuHandler.tracker();'});
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
            icon: ICON.CHART,
            handler: function() {
                var subMenus = new Array();

                if (showChartIntradayChart == 'TRUE' && menuHandler.getMenuStatus('Intraday Chart')) {
                    subMenus.push({icon: ICON.SCHART, menulabel: languageFormat.getLanguage(20101, 'Intraday Chart'), fn: 'menuHandler.intradayChart();'});
                }
                if (showChartAnalysisChart == 'TRUE') {
                    subMenus.push({icon: ICON.SCHART, menulabel: languageFormat.getLanguage(20102, 'Analysis Chart'), fn: 'menuHandler.analysisChart();'});
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
            icon: ICON.BUY,
            handler: menuHandler.buy
        });
        metroMenuItems.push(mtTrade);

        var mtSell = metroMenuObj({
            text: languageFormat.getLanguage(10002, 'Sell'),
            mtColor: 'red',
            icon: ICON.SELL,
            handler: menuHandler.sell
        });
        metroMenuItems.push(mtSell);
    }

    // News
    if (showNewsHeader == "TRUE") {
        var mtNews = metroMenuObj({
            text: languageFormat.getLanguage(20121, 'News'),
            mtColor: 'purple',
            icon: ICON.NEWS,
            handler: function() {
                var subMenus = new Array();

                if (showNewsAnnouncements == "TRUE") {
                    subMenus.push({icon: ICON.SNEWS, menulabel: languageFormat.getLanguage(20122, 'Announcements'), fn: 'menuHandler.announcement();'});
                }
                if (showNewsStockNews == "TRUE") {
                    subMenus.push({icon: ICON.SNEWS, menulabel: languageFormat.getLanguage(20123, 'Stock News'), fn: 'menuHandler.stockNews();'});
                }
                if (N2N_CONFIG.elasticNewsUrl) {
                    subMenus.push({icon: ICON.SNEWS, menulabel: languageFormat.getLanguage(20140, 'Elastic News'), fn: 'menuHandler.elasticNews(\'1\');'});
                }
                if (N2N_CONFIG.nikkeiNewsUrl) {
                    subMenus.push({icon: ICON.SNEWS, menulabel: languageFormat.getLanguage(21501, 'Nikkei News'), fn: 'menuHandler.elasticNews(\'2\');'});
                }
                if(kafChartResearchLinkUrl!=""){
                    subMenus.push({icon: ICON.SNEWS, menulabel: "Kaf Chart Research Link", fn: 'createKafChartNews();'
                    });
                }
                
                if(N2N_CONFIG.newMobileFundamental){
                	if (N2N_CONFIG.featuresNews_FundamentalCPIQ) {

                		subMenus.push({
                			id: 'Fundamental_cpiq',
                			icon: ICON.SNEWS,
                			menulabel: languageFormat.getLanguage(20124, 'Fundamental'),
                			fn: 'menuHandler.spFundamental();'
                		});
                	}

                	if (N2N_CONFIG.featuresNews_FundamentalScreenerCPIQ) {
                		subMenus.push({
                			id: 'Fundamental_Screener_cpiq',
                			icon: ICON.SNEWS,
                			menulabel: languageFormat.getLanguage(20125, 'Fundamental Screener'),
                			fn: 'menuHandler.spFundamentalScreener();'
                		});
                	}
                }else{
                	if (N2N_CONFIG.mbFeaturesNews_SPCapIQ) {

                		if (N2N_CONFIG.mbFeaturesNews_SPCapIQ_Synopsis) {
                			subMenus.push({
                				icon: ICON.SNEWS,
                            menulabel: languageFormat.getLanguage(20132, 'Company Synopsis'),
                				fn: 'menuHandler.spCapIQSynopsis();'
                			});
                		}

                		if (N2N_CONFIG.mbFeaturesNews_SPCapIQ_ComInfo) {
                			subMenus.push({
                				icon: ICON.SNEWS,
                            menulabel: languageFormat.getLanguage(20133, 'Company Info'),
                				fn: 'menuHandler.spCapIQInfo();'
                			});
                		}

                		if (N2N_CONFIG.mbFeaturesNews_SPCapIQ_Announcement) {
                			subMenus.push({
                				icon: ICON.SNEWS,
                            menulabel: languageFormat.getLanguage(20128, 'Announcement'),
                				fn: 'menuHandler.spCapIQAnnouncement();'
                			});
                		}

                		if (N2N_CONFIG.mbFeaturesNews_SPCapIQ_KeyPersons) {
                			subMenus.push({
                				icon: ICON.SNEWS,
                            menulabel: languageFormat.getLanguage(20134, 'Key Persons'),
                				fn: 'menuHandler.spCapIQKeyPerson();'
                			});
                		}

                		if (N2N_CONFIG.mbFeaturesNews_SPCapIQ_ShareSum) {
                			subMenus.push({
                				icon: ICON.SNEWS,
                            menulabel: languageFormat.getLanguage(20135, 'Shareholding Summary'),
                				fn: 'menuHandler.spCapIQShareHolders();'
                			});
                		}

                		if (N2N_CONFIG.mbFeaturesNews_SPCapIQ_FiReports) {
                			subMenus.push({
                				icon: ICON.SNEWS,
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

    // Analysis
    if (N2N_CONFIG.features_Analysis) {
        var mtAnalysis = metroMenuObj({
            text: languageFormat.getLanguage(20144, 'Analysis'),
            mtColor: 'teal',
            icon: ICON.ANALYSIS,
            handler: function() {
                var subMenus = new Array();

                if (N2N_CONFIG.features_Analysis_Dividend) {
                    subMenus.push({icon: ICON.SDIVIDEND,menulabel: languageFormat.getLanguage(20141, 'Dividend'), fn: 'menuHandler.analysisDividend();'});
                }
                if (N2N_CONFIG.features_Analysis_Warrants) {
                    subMenus.push({icon: ICON.SWARRANTS, menulabel: languageFormat.getLanguage(20142, 'Warrants'), fn: 'menuHandler.analysisWarrants();'});
                }
                if (N2N_CONFIG.features_Analysis_BMFutures) {
                    subMenus.push({icon: ICON.SFUTURES, menulabel: languageFormat.getLanguage(20143, 'BMD Futures'), fn: 'menuHandler.analysisBMD_Future();'});
                }

                n2nLayoutManager.plainMenu(subMenus);
            }
        });

        metroMenuItems.push(mtAnalysis);
    }

    // Market
    if (showMarketHeader == "TRUE") {
        var mtMarket = metroMenuObj({
            text: languageFormat.getLanguage(20151, 'Market'),
            mtColor: 'yellow',
            icon: ICON.MARKET,
            handler: function() {
                var subMenus = new Array();

                if (showMarketSummary == "TRUE" && menuHandler.getMenuStatus('Summary') != false) {
                    subMenus.push({icon: ICON.SSUMMARY, menulabel: languageFormat.getLanguage(20050, 'Summary'), fn: 'menuHandler.marketSummary();'});
                }
                if (showMarketIndices == "TRUE" && menuHandler.getMenuStatus('Indices') != false) {
                    subMenus.push({icon:ICON.SINDICES,menulabel: languageFormat.getLanguage(20029, 'Indices'), fn: 'menuHandler.indices();'});
                }
                if (showMarketScoreBoard == "TRUE" && menuHandler.getMenuStatus('Scoreboard')) {
                    subMenus.push({icon:ICON.SSCOREBOARD,menulabel: languageFormat.getLanguage(20156, 'Scoreboard'), fn: 'menuHandler.scoreBoard();'});
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
            icon: ICON.ORDBOOK,
            handler: menuHandler.orderStatus
        });
        metroMenuItems.push(mtOrderbook);
    }

    // Reports
    if (jsutil.toBoolean(showWebReportHeader)) {
        var mtReport = metroMenuObj({
            text: languageFormat.getLanguage(20242, 'Reports'),
            mtColor: 'teal',
            icon: ICON.REPORT,
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
            icon: ICON.PORTFOLIO,
            handler: function() {
                var subMenus = new Array();

                if (global_showPortFolioDerivativePortFolio == 'TRUE') {
                    subMenus.push({icon: ICON.SDERIVATIVEPORTFOLIO, menulabel: languageFormat.getLanguage(20263, 'Derivatives Portfolio'), fn: 'menuHandler.derivativePrtf();'});
                }
                if (showPortFolioMyPortFolio == "TRUE") {
                    subMenus.push({icon: ICON.SEQUITIESPORTFOLIO, menulabel: languageFormat.getLanguage(20262, 'Equities Portfolio'), fn: 'menuHandler.equityPrtf();'});
                }
                if (global_showPortFolioManualPortFolio == "TRUE") {
                    subMenus.push({icon: ICON.SMANUALPORTFOLIO, menulabel: languageFormat.getLanguage(20264, 'Manual Portfolio'), fn: 'menuHandler.equityManualPrtf();'});
                }
                if (showPortFolioRealizedGainLoss == "TRUE") {
                    subMenus.push({icon: ICON.SREALISEDGL, menulabel: languageFormat.getLanguage(20265, 'Realised Gain/Loss'), fn: 'menuHandler.realizedPrtf();'});
                }

                n2nLayoutManager.plainMenu(subMenus);
            }
        });
        metroMenuItems.push(mtPortfolio);
    }
    
    // Settlement
    if (showSettlementHeader == "TRUE") {
        var mtSettlement = metroMenuObj({
            text: languageFormat.getLanguage(21401, 'Settlement'),
            mtColor: 'pink',
            icon: ICON.SETTLEMENT,
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

    // Exchange
    if (showExchangeHeader == "TRUE") {
        var mtExchange = metroMenuObj({
            text: languageFormat.getLanguage(20301, 'Exchange'),
            mtColor: 'purple',
            icon: ICON.EXCH,
            handler: function() {
                var subMenus = new Array();
                for (var i = 0; i < indexCodes.length; i++) {
                    subMenus.push({icon: ICON.SEXCHANGE, menulabel: indexCodes[i].name, fn: 'menuHandler.switchExchange(\'' + indexCodes[i].ex + '\');'});
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
            icon: ICON.CAL,
            handler: function() {
                var subMenus = [];

                if (N2N_CONFIG.breakEvenCalc) {
                    subMenus.push({
                        icon: ICON.SCAL,
                        menulabel: languageFormat.getLanguage(20622, 'Breakeven Calculator'),
                        fn: 'menuHandler.breakEvenCalc();'
                    });
                }

                if (N2N_CONFIG.perEPSCalc) {
                    subMenus.push({
                        icon: ICON.SCAL,
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
            icon: ICON.PROFILE,
            handler: function() {
                var subMenus = new Array();

                if (N2N_CONFIG.profileChgPwdURL != '') {
                    subMenus.push({icon: ICON.SPROFILEEDIT, menulabel: languageFormat.getLanguage(20612, 'Change Password'), fn: 'menuHandler.changePwd();'});
                }
                if (N2N_CONFIG.profileForPwdURL != '') {
                    subMenus.push({icon: ICON.SPROFILEEDIT, menulabel: languageFormat.getLanguage(20613, 'Forgot Password'), fn: 'menuHandler.forgotPwd();'});
                }
                if (N2N_CONFIG.profileChgPinURL != '') {
                    subMenus.push({icon: ICON.SPROFILEEDIT, menulabel: languageFormat.getLanguage(20614, 'Change Pin'), fn: 'menuHandler.changePin();'});
                }
                if (N2N_CONFIG.profileForPinURL != '') {
                    subMenus.push({icon: ICON.SPROFILEEDIT, menulabel: languageFormat.getLanguage(20615, 'Forgot Pin'), fn: 'menuHandler.forgotPin();'});
                }

                n2nLayoutManager.plainMenu(subMenus);
            }
        });
        metroMenuItems.push(mtProfile);
    }

    // Setting
    if (showSettingHeader == "TRUE") {
        var mtSetting = metroMenuObj({
            text: languageFormat.getLanguage(20601, 'Settings'),
            mtColor: 'red',
            icon: ICON.SETTING,
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
            icon: ICON.LANG,
            handler: function() {
                var subMenus = new Array();

                var langs = languageOptions.split(',');
                for (var i = 0; i < langs.length; i++) {
                    // default to english

                    var langText = languageFormat.getLanguage(10034, 'English');
                    var langFile = 'en';
                    var langIcon = iconLanguageEnglish;

                    switch (langs[i].toLowerCase()) {
                        case 'cn':
                            langText = languageFormat.getLanguage(10035, 'Chinese');
                            langFile = 'cn';
                            langIcon = iconLanguageChinese;
                            break;
                        case 'jp':
                            langText = languageFormat.getLanguage(10037, 'Japanese');
                            langFile = 'jp';
                            langIcon = iconLanguageJapanese;
                            break;
                        case 'vn':
                            langText = languageFormat.getLanguage(10038, 'Vietnamese');
                            langFile = 'vn';
                            langIcon = iconLanguageVietnamese;
                            break;
                    }


                    subMenus.push({icon: langIcon, menulabel: langText, fn: 'switchLanguage(\'' + langFile + '\')'});
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
            icon: ICON.LOGOUT,
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

    if (global_personalizationTheme.indexOf("wh") != -1 && !N2N_CONFIG.showMenuLabel) {
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
            openInside = false; // absolute url can't be opened inside cos of the same origin policy
        } else {
            newURL = window.location.origin + '/' + actionParts[0];
        }
        
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
