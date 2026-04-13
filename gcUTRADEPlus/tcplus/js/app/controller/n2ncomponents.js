/*
 * N2N components
 */
var n2ncomponents = {
    debug: false,
    remove: function(compColl, key) {
        for (var i = 0; i < compColl.length; i++) {
            var comp = compColl[i];
            if (comp.key == key) {
                compColl.splice(i, 1);
            }
        }
    },
    get: function(compColl, key) {
        for (var i = 0; i < compColl.length; i++) {
            var comp = compColl[i];
            if (comp.key == key) {
                return comp;
            }
        }

        return null;
    },
    historicalDataViews: [],
    brokerQViews: [],
    derivativePrtfDetails: [],
    equityPrtfDetails: [],
    analysisCharts: [],
    stockNews: [],
    fFlows: [],
    frames: [],
    news: [],
    userReports: {},
    spCapIQItems: {},
    elasticNews: {},
    MFQuestionnaire: {},
    breakEvenCalc: null,
    mfCalc: null,
    formatTitle: function(compName, name) {
        name = stockutil.getStockPart(name);
        return [compName, name].join(UI.titleSeparator);
    },
    createHistoricalData: function(key, name, replace, portlet_col, index, htConf, tabCt) {
        var me = this;
        var _replaceView = replace != undefined ? replace : true;

        if (!tabCt && (jsutil.isEmpty(key) || jsutil.isEmpty(name))) {
            // if (!htConf || !htConf.tConf || !htConf.tConf.pos0) {
            msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
            return;
            // }
            
            name = '';
        }
        
        key = key || '';
        name = name || '';

        var hisData = me.get(me.historicalDataViews, key);
        if (hisData == null) {
            if (!tabCt && n2nLayoutManager.activateBuffer('hd', key, name)) {
                return;
            }
            if (me.historicalDataViews.length == 0) {
                _replaceView = false;
            }
            if (_replaceView) {
                hisData = me.historicalDataViews[0];
                Ext.apply(hisData, {
                    key: key,
                    stkname: name,
                    oldKey: hisData.key
                });
                
            } else {
                var hisData = Ext.create('widget.historicaldata', Ext.apply({
                    key: key,
                    stkname: name
                }, htConf));
                hisData.on('beforedestroy', function(thisComp) {
                    me.remove(me.historicalDataViews, thisComp.key);
                });
                // add to component collection
                me.historicalDataViews.push(hisData);
                portlet_col = portlet_col == null ? portalcol_top : portlet_col;
                n2nLayoutManager.addItem(hisData, portlet_col, index, tabCt);
                me.addEmptyScreen(hisData);

            }
        }

        n2nLayoutManager.activateItem(hisData);
        hisData.refresh();
    },
    openPSEBoardLotTable: function(conf, tabCt){
    	if (!tabCt && n2nLayoutManager.activateBuffer('pbl')) {
            return;
        }
    	
    	if (N2N_CONFIG.pseBoardLotTableURL) {
    		var params = [
                          'ft=' + gl_fonttype,
                          'fs=' + globalFontSize,
                          'lang=' + global_Language,
                          'color=' + formatutils.procThemeColor()
                      ];

    		var url = helper.addUrlParams(N2N_CONFIG.pseBoardLotTableURL, params.join('&'));
    		
            if (jsutil.toBoolean(showUISettingItem[2]) && jsutil.toBoolean(global_NewWindow_News)) {
                if (window.name == "_pse_boardlot")
                    window.name = "";

                msgutil.openURL({
                    url: url,
                    name: '_pse_boardlot'
                });
            } else {
                var pseBoardLot = userReport['userReport_pse_boardlot'];
                if (pseBoardLot == null) {
                	pseBoardLot = Ext.create('Ext.ux.IFrame', Ext.apply({
                        title: languageFormat.getLanguage(20099, 'PSE Board Lot Table'),
                        type: 'pbl',
        				savingComp: true,
                        ddComp: true,
                        winConfig: {
                            maximizable: true,
                            pcWidth: 0.4,
                            pcHeight: 0.75
                        },
                        initMax: true
                    }, conf));

                	pseBoardLot.on('beforedestroy', function() {
                        userReport['userReport_pse_boardlot'] = null;
                    });
                    userReport['userReport_pse_boardlot'] = pseBoardLot;
                    n2nLayoutManager.addItem(pseBoardLot, null, null, tabCt);
                }
                
                n2nLayoutManager.activateItem(pseBoardLot);
                helper.runAfterCompRendered(pseBoardLot, function() {
                	pseBoardLot.refresh(url);
                });  
            }
        }
    },
    createDerivativePrtfDetail: function(conf) { // Introduced 20140307 - main properties: key, name, replace
        var me = this;
        var _replaceView = !(conf.replace === false);

        if (!jsutil.isEmpty(conf.key) && !jsutil.isEmpty(conf.name)) {
            if (me.debug) {
                console.log('n2ncomponents > createDerivativePrtfDetail ...');
            }

            var devPrtfDetail = me.get(me.derivativePrtfDetails, conf.key);

            if (devPrtfDetail == null) {
                if (me.derivativePrtfDetails.length == 0) {
                    _replaceView = false;
                }

                var config = {
                    key: conf.key,
                    stkName: conf.name
                };
                if (conf.config) {
                    Ext.apply(config, conf.config);
                }

                if (_replaceView) {
                    devPrtfDetail = me.derivativePrtfDetails[0];
                    Ext.apply(devPrtfDetail, config);
                } else {
                    var devPrtfDetail = Ext.create('widget.derivative_prtf_detail', config);
                    devPrtfDetail.on('beforedestroy', function(thisComp) {
                        me.remove(me.derivativePrtfDetails, thisComp.key);
                    });
                    // add to component collection
                    me.derivativePrtfDetails.push(devPrtfDetail);
                    n2nLayoutManager.addItem(devPrtfDetail);
                }
            }

            n2nLayoutManager.activateItem(devPrtfDetail);
            devPrtfDetail.refresh();

        } else {
            msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
        }

    },
    createAnalysisChart: function(conf, portlet_col, index, anConf, tabCt, startup) {
        var me = this;
        var _replaceView = !(conf.replace === false);
        
        if (!tabCt && (jsutil.isEmpty(conf.key) || jsutil.isEmpty(conf.name))) {
            msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
            return;
        }
        
        if (jsutil.isEmpty(conf.key)) {
            conf.key = '';
        }
        if (jsutil.isEmpty(conf.name)) {
            conf.name = '';
        }
        
        if (me.debug) {
            console.log('n2ncomponents > createAnalysisChart ...');
        }

        // Removes delayed exchange suffix. Determine whether exchange is delayed based on param 'View'
        var nonDelayCode = stockutil.removeStockDelay(conf.key);
        var stkParts = stockutil.getStockParts(nonDelayCode);
        //var stkParts = stockutil.getStockParts(conf.key);

        if (jsutil.toBoolean(global_NewWindow_News)) { // open in new tab
            // Tele chart
            if (showFlashTeleChart && analysisChartFlashURL != '' && gifChartExList.indexOf(stkParts.exch) == -1) {
                if (!startup) {
                    var params = [
                        'exchg=' + stkParts.exch,
                        'Code=' + stkParts.code,
                        'Name=' + encodeURIComponent(stockutil.getStockName(conf.name)),
                        'View=' + (stockutil.isDelayStock(conf.key) ? 'D' : 'R'),
                        'lang=' + global_Language,
                        'color=' + formatutils.procThemeColor(),
                        'isstock=' + (conf.isIndices ? 'N' : 'Y'),
                        'type=an' + (conf.isIndices ? 'i' : ''),
                        'loginId=' + md5UniqueLoginId
                    ];

                    var teleChartURL = helper.addUrlParams(analysisChartFlashURL, params.join('&'));
                    msgutil.openURL({
                        url: teleChartURL,
                        name: 'tele_analysis_chart'
                    });
                }
            } else if (!jsutil.isEmpty(stockChartURL) && gifChartExList.indexOf(stkParts.exch) == -1) {
                if (!startup) {
                    var params = [
                        'exchg=' + stkParts.exch,
                        'Code=' + stkParts.code,
                        'Name=' + encodeURIComponent(stockutil.getStockName(conf.name)),
                        'View=' + (stockutil.isDelayStock(conf.key) ? 'D' : 'R'),
                        'lang=' + global_Language,
                        'color=' + formatutils.procThemeColor(),
                        'isstock=' + (conf.isIndices ? 'N' : 'Y'),
                        'type=an' + (conf.isIndices ? 'i' : ''),
                        'loginId=' + md5UniqueLoginId
                    ];

                    var chartURL = helper.addUrlParams(stockChartURL, params.join('&'));
                    msgutil.openURL({
                        url: chartURL,
                        name: 'stockchart_analysis'
                    });
                }
            }
        } else { // open inside
            var analysisChart = me.get(me.analysisCharts, conf.key);
            if (analysisChart == null) {
                if (!tabCt && n2nLayoutManager.activateBuffer('an', conf.key, conf.name)) {
                    return;
                }
                
                sessionStorage.removeItem('anChart');

                if (me.analysisCharts.length == 0) {
                    _replaceView = false;
                }

                if (_replaceView) {
                    analysisChart = me.analysisCharts[0];
                    analysisChart.setCode(conf.key, conf.name);
                    analysisChart.newOpen = false;
                } else {
                    var config = {
                        _startup: startup,
                        key: conf.key,
                        stkname: conf.name,
                        isIndices: conf.isIndices,
                        newOpen: anConf == null,
                        lessBtn: true,
                        mConfig: {
                            listeners: {
                                beforehide: function() {
                                    if (analysisChart.compRef.chartToolWin) {
                                        analysisChart.compRef.chartToolWin.close();
                                    }
                                }
                            }
                        }
                    };

                    var analysisChart = Ext.create('widget.analysis_chart', Ext.apply(config, anConf));
                    analysisChart.on('beforedestroy', function(thisComp) {
                        me.remove(me.analysisCharts, thisComp.key);
                        if (thisComp.compRef.chartToolWin) {
                            thisComp.compRef.chartToolWin.destroy();
                        }
                    });

                    // add to component collection
                    me.analysisCharts.push(analysisChart);
                    n2nLayoutManager.addItem(analysisChart, portlet_col, index, tabCt);
                    n2ncomponents.addEmptyScreen(analysisChart);
                }
            }

            var prevChartKey = sessionStorage.getItem('anChart');
            if(prevChartKey){
            	if(prevChartKey == conf.key){
            		return;
            	}
            }
            
            sessionStorage.setItem('anChart', conf.key);
            analysisChart.isIndices = conf.isIndices;
            n2nLayoutManager.activateItem(analysisChart);
            analysisChart.refresh();
        }

    },
    createEquitiesTracker: function(key) {
        var me = this;

        if (!jsutil.isEmpty(key)) {
            var eqtURL = N2N_CONFIG.equitiesTrackerURL + '?opt=1&key=' + stockutil.getStockPart(key);
            /*
             // open in new window
             if (global_NewWindow_News.toLowerCase() == 'true' || global_NewWindow_News == '1') { // TO REVIEW
             //if load on new tab then name that to blank
             if (window.name == "equities_tracker")
             window.name = "";
             
             window.open(eqtURL, 'equities_tracker').focus();
             } else {
             var eqTracker = me.userReports['Equities_Tracker'];
             if (eqTracker == null) {
             eqTracker = Ext.create('Ext.ux.IFrame', {
             title: languageFormat.getLanguage(20025, 'Equities Tracker')
             });
             
             eqTracker.on('beforedestroy', function() {
             me.userReports['Equities_Tracker'] = null;
             });
             me.userReports['Equities_Tracker'] = eqTracker;
             
             n2nLayoutManager.addItem(eqTracker);
             n2nLayoutManager.activateItem(eqTracker);
             eqTracker.refresh(eqtURL);
             } else {
             n2nLayoutManager.activateItem(eqTracker);
             }
             
             }*/

            // force hard code to open in new window as the equities tracker have no https link
            if (window.name == "equities_tracker")
                window.name = "";

            msgutil.openURL({
                url: eqtURL,
                name: 'equities_tracker'
            });
        } else {
            msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
        }
    },
    createCorporateNewsAction: function(record) {
        var me = this;

        if (me.debug) {
            console.log('n2ncomponents > createCorporateNewsAction');
            console.log('record -> ', record);
            console.log('corporateStockNewsAlert -> ', N2N_CONFIG.corporateStockNewsAlert);
            console.log('corporateStockNewsUrl ->', N2N_CONFIG.corporateStockNewsUrl);
        }

        if (N2N_CONFIG.corporateStockNewsAlert) {
            // gets news
            var news = record.get('News');

            if (news != null && news.indexOf('X') > -1) {
                var stkCode = record.get(fieldStkCode);
                var stkName = record.get(fieldStkName);
                if (stkCode == null) {
                    stkCode = record.get('StkCode');
                    stkName = record.get('StkName');
                }

                if (!jsutil.isEmpty(stkCode) && !jsutil.isEmpty(stkName)) {
                    var _code = stockutil.getStockPart(stkCode);
                    var _name = stockutil.getStockPart(stkName);

                    var cnaMsg = '<b class="msg_red">Important Message:</b><br/>' +
                            'Please click on <a id="cna_link" href="#" style="text-decoration:none"><b class="msg_red">Stock News</b></a> to check out the corporate action exercise announcement.<br/>' +
                            'This may have impact on the quantity of shares you may have following the corporate action exercise.<br/>' +
                            '<b class="msg_blue">Please consult your Dealer\'s Representative for more information. (Apply to all Exchanges).</b>';

                    msgutil.msg(cnaMsg, null, null, Ext.MessageBox.INFO);
                    
                    if (N2N_CONFIG.corporateStockNewsUrl != '') {
                        Ext.get('cna_link').on('click', function() {
                            me.openCorporateNewsLink(_code, _name);
                        });
                    }
                }
            }
        }
    },
    openCorporateNewsLink: function(code, name) {
        var links = N2N_CONFIG.corporateStockNewsUrl.split('|');
        var linkParams = [
            '?Code=' + code,
            'Name=' + name,
            'exchg=' + exchangecode
        ];

        var newsLink = links[0] + linkParams.join('&');
        var winWidth = 300;
        var winHeight = 300;
        if (links.length > 2) {
            winWidth = links[1];
            winHeight = links[2];
        }

        msgutil.openURL({
            url: newsLink,
            name: 'corporate_news',
            spec: 'menubar=1,resizable=1,scrollbars=yes,width=' + winWidth + ',height=' + winHeight
        });
    },
    openPSENews: function(stkcode) {
        if (pseStockNewsURL) {
            var pseNewsURL = pseStockNewsURL + '?stkcode=' + stockutil.getStockPart(stkcode);

            if (jsutil.toBoolean(showUISettingItem[2]) && jsutil.toBoolean(global_NewWindow_News)) {
                if (window.name == "_pse_news")
                    window.name = "";

                msgutil.openURL({
                    url: pseNewsURL,
                    name: '_pse_news'
                });
            } else {
                var pseNews = userReport['userReport_pse_news'];
                if (pseNews == null) {
                    pseNews = Ext.create('Ext.ux.IFrame', {
                        title: languageFormat.getLanguage(20131, 'PSE Stock News'),
                        winConfig: getNewsWinConfig(),
                        initMax: true
                    });

                    pseNews.on('beforedestroy', function() {
                        userReport['userReport_pse_news'] = null;
                    });
                    userReport['userReport_pse_news'] = pseNews;
                    n2nLayoutManager.addItem(pseNews);
                }

                n2nLayoutManager.activateItem(pseNews);
                pseNews.refresh(pseNewsURL);
            }
        }
    },
    openFindShareNews: function() {

        if (N2N_CONFIG.findShareUrl) {
            var newUrl = N2N_CONFIG.findShareUrl;

            if (jsutil.toBoolean(showUISettingItem[2]) && jsutil.toBoolean(global_NewWindow_News)) {
                if (window.name == "_findshare_news")
                    window.name = "";

                msgutil.openURL({
                    url: newUrl,
                    name: '_findshare_news'
                });
            } else {
                var fshNews = userReport['userReport_findshare_news'];
                if (fshNews == null) {
                    fshNews = Ext.create('Ext.ux.IFrame', {
                        title: languageFormat.getLanguage(31910, 'Trending News'),
                        winConfig: getNewsWinConfig(),
                        initMax: true
                    });

                    fshNews.on('beforedestroy', function() {
                        userReport['userReport_findshare_news'] = null;
                    });
                    userReport['userReport_findshare_news'] = fshNews;
                    n2nLayoutManager.addItem(fshNews);
                }

                n2nLayoutManager.activateItem(fshNews);
                fshNews.refresh(newUrl);
            }
        }
    },
    openTheScreener: function(stkcode, stkname, conf, tabCt){
    	if (!tabCt && n2nLayoutManager.activateBuffer('is', stkcode, stkname)) {
            return;
        }
    	
    	if (theScreenerURL.length > 0) {
            var screenerURL = theScreenerURL + '?m=' + sView + '&l=en';
            
            if(stkcode){
            	var stkParts = stockutil.getStockParts(stkcode);
            	
            	screenerURL = theScreenerURL + '?m=' + sView + '&l=en&t=d&e=' + stkParts.exch + '&s=' + stkParts.code ;
            }

            if (jsutil.toBoolean(showUISettingItem[2]) && jsutil.toBoolean(global_NewWindow_News)) {
                if (window.name == "_thescreener")
                    window.name = "";

                msgutil.openURL({
                    url: screenerURL,
                    name: '_thescreener'
                });
            } else {
                var theScreener = userReport['userReport_thescreener'];
                if (theScreener == null) {
                	theScreener = Ext.create('Ext.ux.IFrame', Ext.apply({
                        title: languageFormat.getLanguage(20525, 'TheScreener'),
                        type: 'is',
                        savingComp: true,
                        ddComp: true,
                        winConfig: getNewsWinConfig(),
                        initMax: true
                    }, conf));

                	theScreener.on('beforedestroy', function() {
                        userReport['userReport_thescreener'] = null;
                    });
                    userReport['userReport_thescreener'] = theScreener;
                    n2nLayoutManager.addItem(theScreener, null, null, tabCt);
                }

                // update key
                theScreener.updateKey(stkcode, stkname);
                n2nLayoutManager.activateItem(theScreener);
                helper.runAfterCompRendered(theScreener, function() {
                	theScreener.refresh(screenerURL);
                });
            }
        }
    },
    openIBillionaire: function(stkcode, stkname, conf, tabCt){
    	if (!tabCt && n2nLayoutManager.activateBuffer('ib', stkcode, stkname)) {
            return;
        }
    	
    	if (N2N_CONFIG.iBillionaireURL.length > 0) {
            var ibURL = N2N_CONFIG.iBillionaireURL;
            
            if(stkcode){
            	var nonDelayCode = stockutil.removeStockDelay(stkcode);
            	var stkParts = stockutil.getStockParts(nonDelayCode);
            	
            	ibURL = helper.addUrlParams(N2N_CONFIG.iBillionaireURL, 'sc=' + stkParts.code + '&ex=' + stkParts.exch);
            }

            if (jsutil.toBoolean(showUISettingItem[2]) && jsutil.toBoolean(global_NewWindow_News)) {
                if (window.name == "_ibillionaire")
                    window.name = "";

                msgutil.openURL({
                    url: ibURL,
                    name: '_ibillionaire'
                });
            } else {
                var iBillionaire = userReport['userReport_ibillionaire'];
                if (iBillionaire == null) {
                	iBillionaire = Ext.create('Ext.ux.IFrame', Ext.apply({
                        title: languageFormat.getLanguage(20526, 'iBillionaire'),
                        winConfig: getNewsWinConfig(),
                        type: 'ib',
                        savingComp: true,
                        ddComp: true,
                        initMax: true
                    }, conf));

                	iBillionaire.on('beforedestroy', function() {
                        userReport['userReport_ibillionaire'] = null;
                    });
                    userReport['userReport_ibillionaire'] = iBillionaire;
                    n2nLayoutManager.addItem(iBillionaire, null, null, tabCt);
                }

                // update key
                iBillionaire.updateKey(stkcode, stkname);
                n2nLayoutManager.activateItem(iBillionaire);
                helper.runAfterCompRendered(iBillionaire, function() {
                	iBillionaire.refresh(ibURL);
                });     
            }
        }
    },
    openPseEdge: function(stkcode, stkname, conf, tabCt){
    	if (!tabCt && n2nLayoutManager.activateBuffer('pe', stkcode, stkname)) {
            return;
        }
    	
    	if (N2N_CONFIG.pseEdgeURL.length > 0) {
            var url = N2N_CONFIG.pseEdgeURL;
            
            var params = [
                          'ft=' + gl_fonttype,
                          'fs=' + globalFontSize,
                          'lang=' + global_Language,
                          'color=' + formatutils.procThemeColor()
                      ];
            
            if(stkcode){
            	var stkParts = stockutil.getStockParts(stkcode);
            	//url = N2N_CONFIG.pseEdgeURL + '?spid=&exchg=' + stkParts.exch + '&stkcode=' + stkcode ;
            	params.push('spid=', 'exchg=' + stkParts.exch, 'stkcode=' + stkcode);
            }
            
            url = helper.addUrlParams(N2N_CONFIG.pseEdgeURL, params.join('&'));

            // if (jsutil.toBoolean(showUISettingItem[2]) && jsutil.toBoolean(global_NewWindow_News)) {
            if (true) { // force to open as new tab as PSE doesn't have https
                if (window.name == "_pseEdge")
                    window.name = "";

                msgutil.openURL({
                    url: url,
                    name: '_pseEdge'
                });
            } else {
                var pseEdge = userReport['userReport_pseEdge'];
                if (pseEdge == null) {
                	pseEdge = Ext.create('Ext.ux.IFrame', Ext.apply({
                        title: 'PSE Edge',
                        type: 'pe',
                        savingComp: true,
                        ddComp: true,
                        winConfig: getNewsWinConfig(),
                        initMax: true,
                        style: 'background-color: #fff'
                    }, conf));

                	pseEdge.on('beforedestroy', function() {
                        userReport['userReport_pseEdge'] = null;
                    });
                    userReport['userReport_pseEdge'] = pseEdge;
                    n2nLayoutManager.addItem(pseEdge, null, null, tabCt);
                }

                // update key
                pseEdge.updateKey(stkcode, stkname);
                n2nLayoutManager.activateItem(pseEdge);
                helper.runAfterCompRendered(pseEdge, function() {
                	pseEdge.refresh(url);
                });  
            }
        }
    },
    /**
     * Gets the list of market depth components or codes
     * 
     * @param {boolean} codeOnly Gets the list of stock codes only
     * @returns {Array} List of components or string
     */
    getMDList: function(codeOnly) {
        var mdList = new Array();

        // embedded market depth (in order pad)
        if (orderPad && orderPad.compRef.marketDepth) {
            mdList.push(orderPad.compRef.marketDepth);
        }

        // market depth panel
        if (helper.activeView(newMarketDepth)) {
            mdList.push(newMarketDepth);
        }

        // depth matrix
        var mmd = new Array();
        var mmd2 = [], mmd3 = [];
        if (helper.activeView(marketDepthMatrixPanel)) {
            mmd = marketDepthMatrixPanel.returnAllMarketDepth();
        }
        if (helper.activeView(quoteScreen) && quoteScreen.isCardView && quoteScreen.cardComp) {
            mmd2 = quoteScreen.cardComp.returnAllMarketDepth();
        }
        
        for (var i = 0; i < activeWatchlistArr.length; i++) {
            if (activeWatchlistArr[i].wlpanel.isCardView && activeWatchlistArr[i].wlpanel.cardComp) {
                mmd3 = mmd3.concat(activeWatchlistArr[i].wlpanel.cardComp.returnAllMarketDepth());
            }
        }

        if (recentQuotePanel && helper.activeView(recentQuotePanel) && recentQuotePanel.isCardView && recentQuotePanel.cardComp) {
            mmd3 = mmd3.concat(recentQuotePanel.cardComp.returnAllMarketDepth());
        }


        mdList = mdList.concat(mmd, mmd2, mmd3);
        var normal = [];
        var mdl = [];
        var normalMaxLevel = 0;

        for (var i = 0; i < mdList.length; i++) {
            var mdComp = mdList[i];
            if (mdComp.thisPanelType == 'multi') {
                if (codeOnly) {
                    if (!jsutil.isEmpty(mdComp.stkcode)) {
                        mdl.push(mdComp.stkcode);
                    }
                } else {
                    mdl.push(mdComp);
                }
            } else {
                if (codeOnly) {
                    if (!jsutil.isEmpty(mdComp.stkcode)) {
                        normal.push(mdComp.stkcode);
                    }
                } else {
                    normal.push(mdComp);
                }
                
                if (mdComp.normalLevel > normalMaxLevel) {
                    normalMaxLevel = mdComp.normalLevel;
                }
            }
        }
        if (codeOnly) {
            return {
                normal: jsutil.arrayUnique(normal),
                mdl: jsutil.arrayUnique(mdl),
                normalMaxLevel: normalMaxLevel
            };
        } else {
            return {
                normal: normal,
                mdl: mdl,
                normalMaxLevel: normalMaxLevel
            };
        }

    },
    getBrokerQCodeList: function() {
        var qList = [];

        for (var i = 0; i < n2ncomponents.brokerQViews.length; i++) {
            var bq = n2ncomponents.brokerQViews[i];
            if (helper.activeView(bq)) {
                qList.push(bq.key);
            }
        }

        return qList;
    },
    /**
     * Creates margin financing calculator
     */
    createMFCalc: function(conf, tabCt) {
    	if (!tabCt && n2nLayoutManager.activateBuffer('ec')) {
            return;
        }
    	
        var me = this;

        if (me.debug) {
            console.log('n2ncomponents > createMFCalc');
        }

        var calcConf = N2N_CONFIG.calcURL.split('|');
        var confURL = calcConf[0] + '?lang=' + global_Language + '&color=' + formatutils.procThemeColor();
        var winWidth = 667;
        var winHeight = 360;
        if (calcConf.length > 2) {
            winWidth = parseInt(calcConf[1]);
            winHeight = parseInt(calcConf[2]);
        }

        if (N2N_CONFIG.newWin_Other) {
            msgutil.openURL({
                url: confURL,
                name: 'margin_financing_calc',
                spec: 'menubar=1,resizable=1,scrollbars=yes,width=' + winWidth + ',height=' + winHeight
            });
        } else {
            if (!me.mfCalc) {
                if (me.debug) {
                    console.log('creating MFCalc...');
                }

                me.mfCalc = Ext.create('Ext.ux.IFrame', Ext.apply({
                    title: languageFormat.getLanguage(20623, 'Calculator'),
                    winConfig: {
                        width: 635,
                        height: 315
                    },
                    initMax: true,
                    type: 'ec',
                    savingComp: true,
                    ddComp: true
                }, conf));

                me.mfCalc.on('beforedestroy', function() {
                    me.mfCalc = null;
                });

                n2nLayoutManager.addItem(me.mfCalc, null, null, tabCt);
            }
            
            if (me.debug) {
                console.log('activate MFCalc...');
            }
            
            n2nLayoutManager.activateItem(me.mfCalc);
            me.mfCalc.refresh(confURL);
        }
    },
    createSPCapIQItem: function(conf) {
        var me = this;
        if (jsutil.isEmpty(conf.key)) {
            msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
            return;
        }
        
        if (N2N_CONFIG.mbFundamentalURL != '' && conf.category && conf.key) {
            var code = stockutil.removeStockDelay(conf.key);
            var stkParts = stockutil.getStockParts(code);
            var spCapIQItemName = 'SPCapIQ_' + conf.category;
            var params = [
                '?SourceCode=' + N2N_CONFIG.fundamentalCPIQPrefix,
                'StkCode=' + stkParts.code,
                'ExchCode=' + stkParts.exch
            ];

            var spURL = N2N_CONFIG.mbFundamentalURL;
            if (conf.category == 'Annual') { //Financial reports 
                params.push('Report=Annual&DataItemType=INC');
                spURL = N2N_CONFIG.mbFundamentalFiRepURL;
            } else {
                params.push('Category=' + conf.category);
            }

            var spCapIQURL = spURL + params.join("&");

            if (jsutil.toBoolean(showUISettingItem[2]) && jsutil.toBoolean(global_NewWindow_News)) {
                window.open(spCapIQURL, spCapIQItemName).focus();
            } else {
                var spCapIQItem = me.spCapIQItems[spCapIQItemName];
                if (!spCapIQItem) {
                    spCapIQItem = Ext.create('Ext.ux.IFrame', {
                        title: conf.title
                    });

                    spCapIQItem.on('beforedestroy', function() {
                        me.spCapIQItems[spCapIQItemName] = null;
                    });

                    n2nLayoutManager.addItem(spCapIQItem);
                    me.spCapIQItems[spCapIQItemName] = spCapIQItem;
                }

                n2nLayoutManager.activateItem(spCapIQItem);
                spCapIQItem.refresh(spCapIQURL);
            }
        }
    },
    createStockNews: function(conf, tabCt) {
        var me = this;
        var _replaceView = !(conf.replace === false);

        if (!tabCt && (jsutil.isEmpty(conf.key) || jsutil.isEmpty(conf.name))) {
            // msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
            conf.key = '';
            conf.name = '';
            // return;
        }
        if (me.debug) {
            console.log('n2ncomponents > createStockNews ...');
        }
        
        var _getStockNews = function(newsDt) {
            var stockNews = me.get(me.stockNews, conf.key);
            if (me.stockNews.length > 0) {
                screenSet = conf.config != null && conf.config.tConf != null;
            }

            if (stockNews == null) {
                if (!tabCt && n2nLayoutManager.activateBuffer('sn', conf.key, conf.name)) {
                    return;
                }

                if (me.stockNews.length == 0) {
                    _replaceView = false;
                }

                if (_replaceView) {
                    stockNews = me.stockNews[0];
                    stockNews.setCode(conf.key, conf.name);
                } else {
                    var config = {
                        key: conf.key,
                        stkcode: conf.key,
                        stkname: conf.name,
                        title: languageFormat.getLanguage(20123, 'Stock News')
                    };

                    stockNews = Ext.create('widget.stocknews', Ext.apply(config, conf.config));
                    stockNews.on('beforedestroy', function(thisComp) {
                        me.remove(me.stockNews, thisComp.key);
                    });
                    // add to component collection
                    me.stockNews.push(stockNews);
                    n2nLayoutManager.addItem(stockNews, null, null, tabCt);
                    n2ncomponents.addEmptyScreen(stockNews);
                }

                stockNews.searchNews(newsDt);
            }

            if (conf.config != null && conf.config.tConf != null) {
                // n2nLayoutManager.saveConfiguredTab(conf.config.tConf.tab, 'sn');
            }

            n2nLayoutManager.activateItem(stockNews);
        };
        
        if ((conf && conf.config && conf.config.loadedScreen) || !conf.key) {
            _getStockNews();
        } else {
            conn.getStockNews({
                k: conf.key,
                success: function(result) {
                    if (result.s && result.d.length > 0) {
                        _getStockNews(result);
                    } else {
                        msgutil.info(languageFormat.getLanguage(30951, 'There is no news available for [PARAM0].', stockutil.getStockName(conf.name)));
                    }
                }
            });
        }

    },
    createWLGrid: function(wlArr) {
        var me = this;

        if (!me.wlGrid) {
            var wlData = new Array();
            for (var i = 0; i < wlArr.length; i++) {
                wlData.push({
                    wlname: wlArr[i]
                });
            }

            var wlStore = Ext.create('Ext.data.Store', {
                fields: ['wlname'],
                data: wlData
            });

            var wlToolItems = new Array();

            // Edit button
            if (showWatchListRename == "TRUE" || showWatchListDelete == "TRUE") {
                me.wlEditBtn = Ext.create('Ext.button.Button', {
                    type: 'button',
                    text: languageFormat.getLanguage(10021, 'Edit'),
                    enableToggle: true,
                    disabled: wlArr.length < 1,
                    toggleHandler: function(thisBtn, state) {
                        var deleterCol = helper.getColumn(helper.getGridColumns(me.wlGrid), 'itemId', 'wlDeleter');
                        if (state) {
                            me.wlGrid.editMode = true;
                            thisBtn.setText(languageFormat.getLanguage(10023, 'Done'));
                            deleterCol.col.setVisible(true);
                            wlNewBtn.hide();
                            wlRenameBtn.show();
                        } else {
                            me.wlGrid.editMode = false;
                            thisBtn.setText(languageFormat.getLanguage(10021, 'Edit'));
                            deleterCol.col.setVisible(false);
                            wlRenameBtn.hide();
                            wlNewBtn.show();
                        }
                    },
                    listeners: {
                        beforedestroy: function() {
                            me.wlEditBtn = null;
                        }
                    }
                });
                wlToolItems.push(me.wlEditBtn);
            }
            wlToolItems.push('->');

            // New button
            var wlNewBtn;
            if (showWatchListCreate == "TRUE") {
                wlNewBtn = Ext.create('Ext.button.Button', {
                    text: languageFormat.getLanguage(20003, 'New'),
                    handler: createWatchlist
                });
                wlToolItems.push(wlNewBtn);
            }

            // Rename button
            var wlRenameBtn;
            if (showWatchListRename == "TRUE") {
                wlRenameBtn = Ext.create('Ext.button.Button', {
                    text: languageFormat.getLanguage(20004, 'Rename'),
                    hidden: true,
                    handler: function() {
                        var selectedWl = me.wlGrid.getSelectionModel().getSelection();

                        if (selectedWl.length > 0) {
                            renameWatchlist(selectedWl[0].get('wlname'), selectedWl[0].index);
                        } else {
                            msgutil.alert(languageFormat.getLanguage(30128, 'Please select a watchlist.'));
                        }
                    }
                });
                wlToolItems.push(wlRenameBtn);
            }

            me.wlGrid = Ext.create('Ext.grid.Panel', {
                title: languageFormat.getLanguage(20001, 'Watchlist'),
                store: wlStore,
                border: false,
                header: false,
                hideHeaders: true,
                cls: 'plaingrid',
                editMode: false,
                columns: [
                    {
                        xtype: 'actioncolumn',
                        itemId: 'wlDeleter',
                        width: 40,
                        align: 'center',
                        dataIndex: 0,
                        hidden: true,
                        items: [
                            {
                                iconCls: 'wl-action-col icon-remove',
                                handler: function(view, rowIndex, colIndex, item, e, record) {
                                    if (record) {
                                        deleteWatchlist(record.get('wlname'), rowIndex);
                                    } else {
                                        msgutil.alert(languageFormat.getLanguage(30128, 'Please select a watchlist.')); // mostly no need this case
                                    }
                                }
                            }
                        ]
                    },
                    {text: 'Name', dataIndex: 'wlname', flex: 1,
                        renderer: function(value) {
                            return textToHtml(value);
                        }
                    }
                ],
                bbar: wlToolItems,
                listeners: {
                    beforedestroy: function() {
                        me.wlGrid = null;
                    },
                    itemclick: function(thisView, record, item, idx) {
                        if (!me.wlGrid.editMode) {
                            viewWatchlist(record.get('wlname'));
                        }
                    }
                }
            });

            n2nLayoutManager.addItem(me.wlGrid);
        }

        n2nLayoutManager.activateItem(me.wlGrid);
    },
    refreshWlGrid: function(wlArr, wlIdx) {
        var me = this;

        if (mainMenuBar || N2N_CONFIG.menuType == MENU_TYPE.TOOL) {
            constructWatchlistTbar(wlArr);
        } else {
            watchListArr = wlArr;

            if (me.wlGrid) {
                var wlData = new Array();
                for (var i = 0; i < wlArr.length; i++) {
                    wlData.push({
                        wlname: wlArr[i]
                    });
                }

                me.wlGrid.getStore().loadData(wlData);
                if (me.wlEditBtn) {
                    if (wlData.length > 0) {
                        if (me.wlEditBtn.isDisabled()) {
                            me.wlEditBtn.enable();
                        }
                    } else {
                        if (!me.wlEditBtn.isDisabled()) {
                            me.wlEditBtn.disable();
                            if (me.wlEditBtn.pressed) {
                                me.wlEditBtn.toggle();
                            }
                        }
                    }
                }
                var wlCount = me.wlGrid.getStore().getCount();
                if (wlIdx && wlIdx < wlCount) {
                    me.wlGrid.getSelectionModel().select(wlIdx);
                } else {
                    if (wlCount > 0) {
                        me.wlGrid.getSelectionModel().select(wlCount - 1);
                    }
                }
            }
        }
    },
    openBrokerageFaq: function() {
        var me = this;

        if (!me.brokerageFaqWin) {
            var brokerageFaq = Ext.create('Ext.ux.IFrame');
            me.brokerageFaqWin = msgutil.popup({
                title: languageFormat.getLanguage(21004, 'Brokerage Rate'),
                layout: 'fit',
                width: 610,
                height: 330,
                items: brokerageFaq,
                constrain: true,
                resizable: false,
                cls: 'fix_black',
                buttons: [
                    {
                        text: 'OK',
                        handler: function() {
                            me.brokerageFaqWin.close();
                        }
                    }
                ],
                listeners: {
                    beforedestroy: function() {
                        me.brokerageFaqWin = null;
                    }
                }
            });
            brokerageFaq.refresh('faqCalcBrokerage.htm');
        } else {
            me.brokerageFaqWin.toFront();
        }

    },
    openElasticNews: function(conf) {
    	if (!conf.tabCt && n2nLayoutManager.activateBuffer('en' + conf.newsOpt)) {
            return;
        }

        var me = this;

        if (N2N_CONFIG.elasticNewsUrl || N2N_CONFIG.nikkeiNewsUrl) {
            var elasticURL = '';
            var params = [
                'spc=' + N2N_CONFIG.fundamentalSponsor,
                'bh=' + bhCode,
                'appId=' + appId,
                'lang=' + global_Language,
                'color=' + formatutils.procThemeColor()
            ];

            if (conf.newsOpt == '1') {
                elasticURL = N2N_CONFIG.elasticNewsUrl + '&' + params.join('&');
                console.log('elasticURL -> ', elasticURL);
            } else {
                elasticURL = N2N_CONFIG.nikkeiNewsUrl + '&' + params.join('&');
                console.log('nikkeiURL -> ', elasticURL);
            }

            var compName = conf.newsOpt == '1' ? 'elastic_news' : 'nikkei_news';
            var winWidth = 770;
            var winHeight = 670;
            if (jsutil.toBoolean(showUISettingItem[2]) && jsutil.toBoolean(global_NewWindow_News)) {
                if (window.name === compName)
                    window.name = "";

                msgutil.openURL({
                    url: elasticURL,
                    name: compName,
                    spec: "menubar=1,resizable=1,scrollbars=yes,width=" + winWidth + ",height=" + winHeight
                });
            } else {
                var elNews = me.elasticNews[compName];
                if (elNews == null) {
                    elNews = Ext.create('Ext.ux.IFrame', Ext.apply({
                        title: conf.newsOpt == '1' ? languageFormat.getLanguage(20140, 'Elastic News') : languageFormat.getLanguage(21501, 'Nikkei News'),
                        winConfig: getNewsWinConfig(),
                        type: 'en' + conf.newsOpt,
                        ddComp: true,
                        savingComp: true,
                        initMax: true
                    }, conf.conf));

                    elNews.on('beforedestroy', function() {
                        me.elasticNews[compName] = null;
                    });
                    me.elasticNews[compName] = elNews;
                    n2nLayoutManager.addItem(elNews, null, null, conf.tabCt);
                }

                n2nLayoutManager.activateItem(elNews);
                helper.runAfterCompRendered(elNews, function() {
                	elNews.refresh(elasticURL);
                });
            }
        }
    },
    openMFQuestionnaire: function() {
        var me = this;
        var compName = '_mutual_fund_questionnaire';
                
        if (jsutil.toBoolean(showUISettingItem[2]) && jsutil.toBoolean(global_NewWindow_News)) {
            msgutil.openURL({
                url: N2N_CONFIG.mfQuestionURL,
                name: compName
            });
        } else {
            var MFQuestionnaire = me.MFQuestionnaire[compName];
            if (MFQuestionnaire == null) {
                MFQuestionnaire = Ext.create('Ext.ux.IFrame', Ext.apply({
                    title: languageFormat.getLanguage(33504, 'Suitability Questionnaire'),
                    winConfig: {
                        width: 770,
                        height: 670
                    },
                    type: 'mfq',
                    ddComp: true,
                    savingComp: true,
                    initMax: true
                }));
//                }, conf.conf));

                MFQuestionnaire.on('beforedestroy', function () {
                    me.MFQuestionnaire[compName] = null;
                });
                me.MFQuestionnaire[compName] = MFQuestionnaire;
//                n2nLayoutManager.addItem(MFQuestionnaire, null, null, conf.tabCt);
                n2nLayoutManager.addItem(MFQuestionnaire, null, null, null);
            }

            n2nLayoutManager.activateItem(MFQuestionnaire);
            helper.runAfterCompRendered(MFQuestionnaire, function () {
                MFQuestionnaire.refresh(N2N_CONFIG.mfQuestionURL);
            });
        }
    },
    openNews: function(conf) {
        conf = conf || {};
        var newType = conf.newsType || '';

        var compType = 'enews';

        if (!conf.tabCt && n2nLayoutManager.activateBuffer(compType)) {
            return;
        }

        var me = this;

        if (N2N_CONFIG.news2_Url) {
            var newURL = '';
            var params = [
                'ns=' + newType,
                'spc=' + N2N_CONFIG.fundamentalSponsor,
                'bh=' + bhCode,
                'appId=' + appId,
                'lang=' + global_Language,
                'ft=' + gl_fonttype,
                'fs=' + globalFontSize,
                'color=' + formatutils.procThemeColor()
            ];
            
            if (conf.key) {
                var stkParts = stockutil.getStockParts(conf.key);
                params.push('sc=' + stkParts.code, 'ex=' + stkParts.exch);
            }

            newURL = N2N_CONFIG.news2_Url + '&' + params.join('&');
            tLog('newURL -> ', newURL);

            var winWidth = 770;
            var winHeight = 670;

            if (jsutil.toBoolean(showUISettingItem[2]) && jsutil.toBoolean(global_NewWindow_News)) {
                if (window.name === compType)
                    window.name = "";

                msgutil.openURL({
                    url: newURL,
                    name: compType,
                    spec: "menubar=1,resizable=1,scrollbars=yes,width=" + winWidth + ",height=" + winHeight
                });

            } else {

                var elNews = me.news[compType];

                if (elNews == null) {
                    elNews = Ext.create('Ext.ux.IFrame', Ext.apply({
                        title: languageFormat.getLanguage(20121, 'News'),
                        winConfig: getNewsWinConfig(),
                        type: compType,
                        ddComp: true,
                        savingComp: true,
                        initMax: true,
                        refreshScreen: true,
                        switchRefresh: function() {
                            var ns = this;

                            if (ns._needReload) {
                                menuHandler.openNews('', ns.key);
                                ns._needReload = false;
                            }
                        },
                        syncBuffer: function(stkcode) {
                            var ns = this;

                            // update key and title
                            ns.updateKey(stkcode);

                            ns._needReload = true;
                        }
                    }, conf.conf));

                    elNews.on('beforedestroy', function() {
                        me.news[compType] = null;
                    });
                    me.news[compType] = elNews;
                    n2nLayoutManager.addItem(elNews, null, null, conf.tabCt);

                    n2nLayoutManager.activateItem(elNews);
                    helper.runAfterCompRendered(elNews, function() {
                        elNews.refresh(newURL);
                        elNews.firstLoad = false;
                        elNews.updateKey(conf.key);
                    });
                } else {
                    n2nLayoutManager.activateItem(elNews);
                    elNews.refresh(newURL);
                    elNews.updateKey(conf.key);
                }

            }
        }
    },
    openArchiveNews: function(conf) {
        if (!conf.tabCt && n2nLayoutManager.activateBuffer('hn', conf.key, conf.name)) {
            return;
        }
    
        var haveConf = true;
        if (jsutil.isEmpty(conf.key)) { // stock name can be empty if key is exchange
            haveConf = false;
            //msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
            //return;
        }

        var newsConf = N2N_CONFIG.corporateStockNewsUrl.split('|');
        if (newsConf.length > 0) {
            var archiveURL = '';
            if (!haveConf) {
                archiveURL = newsConf[0];
            } else {
                var stkParts = stockutil.getStockParts(conf.key);
                // if the key is not a stock code itself, it should be an exchange
                if (!stkParts.exch) {
                    stkParts.exch = stkParts.code;
                    conf.frmMenu = true;
                }
                
                var params;
                if (conf.frmMenu) {
                    params = ['?exchg=' + stkParts.exch];
                    archiveURL = newsConf[0] + params.join('&');
                    // in this case, key is exchange
                    conf.key = stkParts.exch;
                    conf.name = null; // no need stock name
                } else {
                    var stkName = stockutil.getStockName(conf.name);

                    params = [
                        '?Code=' + stkParts.code,
                        'Name=' + stkName,
                        'exchg=' + stkParts.exch
                    ];
                    archiveURL = newsConf[0] + params.join('&');
                }
            }

            //var archiveURL = newsConf[0] + params.join('&');
            console.log('archiveURL -> ', archiveURL);

            var winWidth = 770;
            var winHeight = 670;
            // allows to use back previous defined width and height settings
            if (newsConf.length > 3 || jsutil.toBoolean(newsConf[4])) {
                winWidth = newsConf[1];
                winHeight = newsConf[2];
            }

            if (jsutil.toBoolean(showUISettingItem[2]) && jsutil.toBoolean(global_NewWindow_News)) {

                if (window.name == "archive_news")
                    window.name = "";

                msgutil.openURL({
                    url: archiveURL,
                    name: 'archive_news',
                    spec: "menubar=1,resizable=1,scrollbars=yes,width=" + winWidth + ",height=" + winHeight
                });
            } else {
                var archiveNews = userReport['userReport_archive_news'];
                if (archiveNews == null) {
                    archiveNews = Ext.create('Ext.ux.IFrame', Ext.apply({
                        title: languageFormat.getLanguage(20137, 'News Archive'),
                        winConfig: getNewsWinConfig(),
                        initMax: true,
                        key: conf.key,
                        stkname: conf.name,
                        type: 'hn',
                        savingComp: true,
                        ddComp: true
                    }, conf.conf));

                    archiveNews.on('beforedestroy', function() {
                        userReport['userReport_archive_news'] = null;
                    });
                    userReport['userReport_archive_news'] = archiveNews;
                    n2nLayoutManager.addItem(archiveNews, null, null, conf.tabCt);
                } else {
                    // update key
                    archiveNews.updateKey(conf.key, conf.name);
                }

                n2nLayoutManager.activateItem(archiveNews);
                archiveNews.refresh(archiveURL);
            }
        }
    },
    openUserGuide: function() {

        var userGuideConf = userGuideURL.split('|');
        if (userGuideConf.length > 0) {

            var userGuideMenuURL = userGuideConf[0];
            console.log('userGuideMenuURL -> ', userGuideMenuURL);

            var winWidth = 770;
            var winHeight = 670;
            // allows to use back previous defined width and height settings
            if (userGuideConf.length >= 3) {
                winWidth = userGuideConf[1];
                winHeight = userGuideConf[2];
            }

            msgutil.openURL({
                url: userGuideMenuURL,
                name: 'user_guide',
                spec: "menubar=1,resizable=1,scrollbars=yes,width=" + winWidth + ",height=" + winHeight
            });
        }
    },
    openWebReport: function(rptSettings, portlet_col, index) {
        var me = this;
        var params = [
                      's=' + new Date().getTime(),
                      'ft=' + gl_fonttype,
                      'fs=' + globalFontSize,
                      'lang=' + global_Language,
                      'color=' + formatutils.procThemeColor()
                  ];
        
        //var rptUrl = rptSettings.url + '&' + new Date().getTime();
        var rptUrl = helper.addUrlParams(rptSettings.url, params.join('&'));
        var rptId = rptSettings.id;
        var slcomp = null;
        switch (rptSettings.url) {
            case webReportClientSummaryURL.split("|")[4]:
                slcomp = "rcs";
                break;
            case webReportMonthlyStatementURL.split("|")[4]:
                slcomp = "rmst";
                break;
            case webReportMarginAccountSummaryURL.split("|")[4]:
                slcomp = "rmas";
                break;
            case webReportTraderDepositReportURL.split("|")[4]:
                slcomp = "rtd";
                break;
            case webReportTradeBeyondReportURL.split("|")[4]:
                slcomp = "rtb";
                break;
            case webReporteContractURL.split("|")[4]:
                slcomp = "rc";
                break;
            case webReportAISBeStatementURL.split("|")[4]:
                slcomp = "rai";
                break;
            case webReportMarginPortFolioValuationURL.split("|")[4]:
                slcomp = "rmp";
                break;
            case webReportTransactionMovementURL.split("|")[4]:
                slcomp = "rtm";
                break;
            case webReportClientTransactionStatementURL.split("|")[4]:
                slcomp = "rct";
                break;
            case webReportStockBalanceURL.split("|")[4]:
                slcomp = "rsba";
                break;
        }
        if (jsutil.toBoolean(showUISettingItem[3]) && jsutil.toBoolean(global_NewWindow_Report)) {
            msgutil.openURL({
                url: rptUrl,
                name: rptId
            });
        } else {
            var rpt = me.userReports[rptId];

            if (!rpt) {
                rpt = Ext.create('Ext.ux.IFrame', Ext.apply({
                    title: rptSettings.title,
                    type: slcomp,
                    winConfig: getNewsWinConfig(),
                    ddComp: true,
                    savingComp: true,
                    initMax: true
                }, portlet_col));

                rpt.on('beforedestroy', function() {
                    me.userReports[rptId] = null;
                });

                me.userReports[rptId] = rpt;
                n2nLayoutManager.addItem(rpt, null, null, index);
            }

            n2nLayoutManager.activateItem(rpt);
            helper.runAfterCompRendered(rpt, function() {
            	rpt.refresh(rptUrl);
            });
        }

    },
    openSettlementMenu: function(settSettings, portlet_col, index) {
        var me = this;
        var settUrl = settSettings.url + '&' + new Date().getTime();
        var settId = settSettings.id;
        var slcomp = null;
        switch (settSettings.url) {
            case webESettlementURL.split("|")[4]:
                slcomp = "es";
                break;
            case webESettlementStatusURL.split("|")[4]:
                slcomp = "ess";
                break;
            case webEDepositURL.split("|")[4]:
                slcomp = "ed";
                break;
        }
        if (jsutil.toBoolean(jsutil.toBoolean(showUISettingItem[3]) && global_NewWindow_Report)) {
            msgutil.openURL({
                url: settUrl,
                name: settId
            });
        } else {
            var rpt = me.userReports[settId];

            if (!rpt) {
                rpt = Ext.create('Ext.ux.IFrame', {
                    title: settSettings.title,
                    slcomp: slcomp,
                    winConfig: getNewsWinConfig()
                });

                rpt.on('beforedestroy', function() {
                    me.userReports[settId] = null;
                });

                me.userReports[settId] = rpt;
                n2nLayoutManager.addItem(rpt, portlet_col, index);
            }

            n2nLayoutManager.activateItem(rpt);
            rpt.refresh(settUrl);
        }

    },
    createForeignFlows: function(conf, tabCt) {
        var me = this;
        var _replaceView = !(conf.replace === false);

        if (!tabCt && (jsutil.isEmpty(conf.key) || jsutil.isEmpty(conf.name))) {
            msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
            conf.key = '';
            conf.name = '';
            return;
        }
        if (me.debug) {
            console.log('n2ncomponents > createForeignFlow ...');
        }

        var fFlow = me.get(me.fFlows, conf.key);
        if (me.fFlows.length > 0) {
            screenSet = conf.config != null && conf.config.tConf != null;
        }

        if (fFlow == null) {
            if (!tabCt && n2nLayoutManager.activateBuffer('ff', conf.key, conf.name)) {
                return;
            }

            if (me.fFlows.length == 0) {
                _replaceView = false;
            }

            if (_replaceView) {
                fFlow = me.fFlows[0];
                fFlow.setCode(conf.key, conf.name);
            } else {
                var config = {
                    key: conf.key,
                    stkcode: conf.key,
                    stkname: conf.name
                };

                fFlow = Ext.create('widget.fflows', Ext.apply(config, conf.config));
                fFlow.on('beforedestroy', function(thisComp) {
                    me.remove(me.fFlows, thisComp.key);
                });
                // add to component collection
                me.fFlows.push(fFlow);
                n2nLayoutManager.addItem(fFlow, null, null, tabCt);
            }

        }

        n2nLayoutManager.activateItem(fFlow);
        fFlow.refresh();

    },
    createBrokerInfo: function(conf, tabCt) {
        var me = this;

        if (!me.bkInfo) {
            if (!tabCt && n2nLayoutManager.activateBuffer('bki', conf.key, conf.name)) {
                return;
            }
            
            me.bkInfo = Ext.widget('brokerinfo', Ext.apply({}, conf.config));
            
            me.bkInfo.on('destroy', function() {
                me.bkInfo = null;
            });
            n2nLayoutManager.addItem(me.bkInfo, null, null, tabCt);
        }

        n2nLayoutManager.activateItem(me.bkInfo);

    },
    createBrokerSearch: function(conf, tabCt) {
        var me = this;

        if (!me.bkSearch) {
            if (!tabCt && n2nLayoutManager.activateBuffer('bks', conf.key, conf.name)) {
                return;
            }

            me.bkSearch = Ext.widget('brokersearch', Ext.apply({}, conf.config));

            me.bkSearch.on('destroy', function() {
                me.bkSearch = null;
            });
            n2nLayoutManager.addItem(me.bkSearch, null, null, tabCt);
        }

        n2nLayoutManager.activateItem(me.bkSearch);

    },
    createBrokerQ: function(conf, tabCt) {
        var me = this;
        var _replaceView = !(conf.replace === false);

        var brokerQ = me.get(me.brokerQViews, conf.key);

        if (brokerQ == null) {
            if (!tabCt && n2nLayoutManager.activateBuffer('bq', conf.key, conf.name)) {
                return;
            }

            if (me.brokerQViews.length == 0) {
                _replaceView = false;
            }

            if (_replaceView) {
                brokerQ = me.brokerQViews[0];
                brokerQ.setCode(conf.key, conf.name);
            } else {
                var config = {
                    key: conf.key,
                    stkcode: conf.key,
                    stkname: conf.name,
                    exch: stockutil.getExchange(conf.key)
                };

                brokerQ = Ext.create('widget.brokerq', Ext.apply(config, conf.config));
                
                brokerQ.on('beforedestroy', function(thisComp) {
                    me.remove(me.brokerQViews, thisComp.key);
                });
                // add to component collection
                me.brokerQViews.push(brokerQ);
                n2nLayoutManager.addItem(brokerQ, null, null, tabCt);
            }

        }

        n2nLayoutManager.activateItem(brokerQ);
        brokerQ.refresh();

    },
    createWorldIndices: function(conf, tabCt) {
        var me = this;
        conf = conf || {};

        if (!me.worldIndices) {
            if (!tabCt && n2nLayoutManager.activateBuffer('wi', conf.key, conf.name)) {
                return;
            }

            me.worldIndices = Ext.widget('worldindices', Ext.apply({}, conf.config));

            me.worldIndices.on('destroy', function() {
                me.worldIndices = null;
            });
            n2nLayoutManager.addItem(me.worldIndices, null, null, tabCt);
        }

        n2nLayoutManager.activateItem(me.worldIndices);
    },
    createEquityPrtfDetail: function(conf) {
        var me = this;
        var _replaceView = !(conf.replace === false);

        if (!jsutil.isEmpty(conf.key) && !jsutil.isEmpty(conf.name)) {
            if (me.debug) {
                console.log('n2ncomponents > createEquityPrtfDetail ...');
            }

            var prtfDetail = me.get(me.equityPrtfDetails, conf.key);

            if (prtfDetail == null) {
                if (me.equityPrtfDetails.length == 0) {
                    _replaceView = false;
                }

                var config = {
                    key: conf.key,
                    stkName: conf.name,
                    jsonString: conf.dataObj
                };
                if (conf.config) {
                    Ext.apply(config, conf.config);
                }

                if (_replaceView) {
                    prtfDetail = me.equityPrtfDetails[0];
                    Ext.apply(prtfDetail, config);
                } else {
                    var prtfDetail = Ext.create('widget.equityprtfdetail', config);
                    prtfDetail.on('beforedestroy', function(thisComp) {
                        me.remove(me.equityPrtfDetails, thisComp.key);
                    });
                    // add to component collection
                    me.equityPrtfDetails.push(prtfDetail);
                    n2nLayoutManager.addItem(prtfDetail);
                }
            }

            n2nLayoutManager.activateItem(prtfDetail);
            prtfDetail.callRecord();

        } else {
            msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
        }

    },
    bufferTasks1: [], // quotescreen, indices, orderbook, market summary, market streamer
    bufferTasks2: [], // watchlist
    bufferTasks3: [], // tracker, market depth, intraday chart, news (which depends on main screen)
    bufferTasks4: [], // portfolio
    _runBufferTasks: function(bufferTasks) {
        var me = this;

        for (var i = 0; i < bufferTasks.length; i++) {
            var task = bufferTasks[i];
            task();
        }

        // empty tasks
        bufferTasks = [];
    },
    runBufferTasks1: function() {
        this._runBufferTasks(this.bufferTasks1);
        this.bufferTasks1 = [];
    },
    runBufferTasks2: function() {
        this._runBufferTasks(this.bufferTasks2);
        this.bufferTasks2 = [];
    },
    runBufferTasks3: function() {
        this._runBufferTasks(this.bufferTasks3);
        this.bufferTasks3 = [];
    },
    runBufferTasks4: function() {
        this._runBufferTasks(this.bufferTasks4);
        this.bufferTasks4 = [];
    },
    runAllBufferTasks: function() {
        this.runBufferTasks1();
        this.runBufferTasks2();
        this.runBufferTasks3();
        this.runBufferTasks4();
    },
    clearAllBufferTasks: function() {
        this.bufferTasks1 = [];
        this.bufferTasks2 = [];
        this.bufferTasks3 = [];
        this.bufferTasks4 = [];
    },
    createExchangeRate: function() {
        var me = this;

        if (!me.exchangeRate) {
            me.exchangeRate = Ext.create('widget.exchangerate', {
                winConfig: {
                    width: 750,
                    height: 430
                }
            });
            me.exchangeRate.on('beforedestroy', function(thisComp) {
                if (thisComp.winCon) { // confirmation box
                    thisComp.winCon.close();
                }
                if (thisComp.winFXConversion) { // conversion popup
                    thisComp.winFXConversion.close();
                }
                me.exchangeRate = null;
            });

            n2nLayoutManager.addItem(me.exchangeRate);
        }

        n2nLayoutManager.activateItem(me.exchangeRate);
    },
    requestSaveDefaultTradingAccountSetting: function(asyncMode) {
        // updates setting value
        var defTrAccStr = defTrAccConf.save();
        var tradeSettingURL = addPath + "tcplus/setting?a=set&sc=TCLTDA";

        cookies.createCookie(loginId + '_defTrAcc', defTrAccStr, 1800);
        cookies.createCookie(loginId + '_defTrAccSync', false, 1800);
        Ext.Ajax.request({
            url: tradeSettingURL,
            method: 'POST',
            params:{p:defTrAccStr},
            async: asyncMode != null ? asyncMode : true,
            success: function(response, options) {
                var res = Ext.decode(response.responseText);
                if (res && res.s) {
                    cookies.createCookie(loginId + '_defTrAccSync', true, 1800);
                }
            }
        });
    },
    requestSaveAccountOrder: function(accGrid) {
        var me = this;

        me.updateAccountListIndex(accGrid.store, true);
        // sorts account list by index
        accRet.ai.sort(jsutil.getArraySorter('index'));
        var accList = [];
        for (var i = 0; i < accRet.ai.length; i++) {
            var acc = accRet.ai[i];
            if (acc.ac && acc.bc) {
                accList.push(acc.ac + global_AccountSeparator + acc.bc);
            }
        }

        var accountOrderURL = [
            addPath,
            "tcplus/setting?a=set&sc=TCLTAO&p=",
            accList.join(',')
        ].join('');

        Ext.Ajax.request({
            url: accountOrderURL,
            success: function(response, options) {
            }
        });

    },
    updateAccountListIndex: function(orderList, isStore) {
        var me = this;

        if (accRet.ai) {
            for (var i = 0; i < accRet.ai.length; i++) {
                var acc = accRet.ai[i];
                if (acc.ac && acc.bc) {
                    var index = me.getAccountIndex(acc.ac + global_AccountSeparator + acc.bc, orderList, isStore);
                    if (index > -1) {
                        acc.index = index;
                    }
                }
            }
        }
    },
    getAccountIndex: function(accountKey, records, isStore) {
    	var index = -1;

        if (isStore) {
            records.each(function(rec, i) {
                if (rec.get('acckey') === accountKey) {
                    index = i;
                    return false;
                }
            });
        } else {
            for (var i = 0; i < records.length; i++) {
                if (records[i] === accountKey) {
                    index = i;
                    break;
                }
            }
        }

        return index;
    },
    _initScreenMap: function() {
        var me = this;

        me.scrMap = {
            qs: {
                title: languageFormat.getLanguage(20631, 'Quote Screen')
            },
            rq: {
                title: languageFormat.getLanguage(20018, 'Recent Quotes')
            },
            wl: {
                title: languageFormat.getLanguage(20001, 'Watchlist')
            },
            si: {
                title: languageFormat.getLanguage(20021, 'Stock Info')
            },
            md: {
                title: languageFormat.getLanguage(20022, 'Market Depth')
            },
            tr: {
                title: languageFormat.getLanguage(20095, 'Tracker')
            },
            ic: {
                title: languageFormat.getLanguage(20101, 'Intraday Chart')
            },
            an: {
                title: languageFormat.getLanguage(20102, 'Analysis Chart')
            },
            os: {
                title: languageFormat.getLanguage(20171, 'Order Book')
            },
            mfos: {
                title: languageFormat.getLanguage(33720, 'Mutual Fund Order Book')
            },
            oh: {
                title: languageFormat.getLanguage(20173, 'Order History')
            },
            mfoh: {
                title: languageFormat.getLanguage(20245, 'Mutual Fund Order History')
            },
            bo: {
                title: languageFormat.getLanguage(32013, 'Basket Order')
            },
            ep: {
                title: languageFormat.getLanguage(20262, 'Equities Portfolio')
            },
            fp: {
                title: languageFormat.getLanguage(33690, 'Mutual Fund Portfolio')
            },
            emp: {
                title: languageFormat.getLanguage(20296, 'Manual Portfolio')
            },
            cfdh: {
                title: languageFormat.getLanguage(10749, 'CFD Holdings')
            },
            rp: {
                title: languageFormat.getLanguage(20265, 'Realised Gain/Loss')
            },
            dp: {
                title: languageFormat.getLanguage(20263, 'Derivatives Portfolio')
            },
            gn: {
                title: languageFormat.getLanguage(20138, 'Announcement News')
            },
            sn: {
                title: languageFormat.getLanguage(20123, 'Stock News')
            },
            in: {
                title: languageFormat.getLanguage(20029, 'Indices')
            },
            hd: {
                title: languageFormat.getLanguage(20060, 'Historical Data')
            },
            mo: {
                title: languageFormat.getLanguage(20152, 'Market Summary')
            },
            sb: {
                title: languageFormat.getLanguage(20156, 'Scoreboard')
            },
            ms: {
                title: languageFormat.getLanguage(20157, 'Streamer')
            },
            td: {
                title: languageFormat.getLanguage(20501, 'Tracker Record')
            },
            ff: {
                title: languageFormat.getLanguage(20653, 'Flow Analysis')
            },
            dm: {
                title: languageFormat.getLanguage(20023, 'Depth Matrix')
            },
            od: {
                title: languageFormat.getLanguage(20831, 'Order Pad')
            },
            hn: {
                title: languageFormat.getLanguage(20137, 'News Archive')
            },
            bc: {
                title: languageFormat.getLanguage(20622, 'Breakeven Calculator')
            },
            ec: {
                title: languageFormat.getLanguage(20623, 'Calculator')
            },
            pc: {
                title: languageFormat.getLanguage(21005, 'P/E Ratio & EPS Calculator')
            },
            fc: {
                title: languageFormat.getLanguage(20124, 'Fundamental (Capital IQ)')
            },
            fcs: {
                title: languageFormat.getLanguage(20125, 'Fundamental Screener (Capital IQ)')
            },
            ft: {
                title: languageFormat.getLanguage(20126, 'Fundamental (Thomson Reuters)')
            },
            fst: {
                title: languageFormat.getLanguage(20127, 'Fundamental Screener (Thomson Reuters)')
            },
            bki: {
                title: languageFormat.getLanguage(11060, 'Broker Info')
            },
            bks: {
                title: languageFormat.getLanguage(31820, 'Broker Search')
            },
            wi: {
                title: languageFormat.getLanguage(20158, 'World Indices')
            },
            tc: {
                title: languageFormat.getLanguage(31600, 'Trade Calculator')
            },
            en1: {
                title: languageFormat.getLanguage(20140, 'Elastic News')
            },
            en2: {
                title: languageFormat.getLanguage(21501, 'Nikkei News')
            },
            enews: {
                title: languageFormat.getLanguage(20121, 'News')
            },
            rcs: {
                title: languageFormat.getLanguage(20231, 'Client Summary')
            },
            rmst: {
                title: languageFormat.getLanguage(20232, 'Monthly Statement')
            },
            rmas: {
                title: languageFormat.getLanguage(20233, 'Margin Account Summary')
            },
            rtd: {
                title: languageFormat.getLanguage(20234, 'Trader Deposit Report')
            },
            rtb: {
                title: languageFormat.getLanguage(20235, 'TradeBeyond Report')
            },
            rc: {
                title: languageFormat.getLanguage(20236, 'eContract')
            },
            rai: {
                title: languageFormat.getLanguage(20237, 'AISB eStatement')
            },
            rmp: {
                title: languageFormat.getLanguage(20238, 'Margin Portfolio Valuation')
            },
            rtm: {
                title: languageFormat.getLanguage(20239, 'Transaction Movement')
            },
            rct: {
                title: languageFormat.getLanguage(20241, 'Client Transaction Statement')
            },
            rsba: {
                title: languageFormat.getLanguage(20240, 'Stock Balance')
            },
            pe: {
                title: languageFormat.getLanguage(20139, 'PSE Edge')
            },
            ib: {
                title: languageFormat.getLanguage(20526, 'iBillionaire')
            },
            is: {
                title: languageFormat.getLanguage(20525, 'TheScreener')
            },
            smsa: {
                title: languageFormat.getLanguage(20602, 'Stock Alert')
            },
            pbl: {
                title: languageFormat.getLanguage(20099, 'PSE Board Lot Table')
            },
            ertool: {
            	title: languageFormat.getLanguage(20523, 'Exchange Rate')
            },
            sstool:{
            	title: languageFormat.getLanguage(20522, 'Stock Filter')
            },
            aw:{
            	title: languageFormat.getLanguage(20142, 'Warrants')
            },
            ad:{
            	title: languageFormat.getLanguage(20141, 'Dividend')
            },
            abf:{
            	title: languageFormat.getLanguage(20143, 'BMD Futures')
            },
            itf:{
            	title: languageFormat.getLanguage(20113, 'IT Finance Chart')
            },
            ewi:{
            	title: languageFormat.getLanguage(20158, 'World Indices')
            },
            bq:{
            	title: languageFormat.getLanguage(31800, 'Broker Queue')
            },
            vnd:{
                title: languageFormat.getLanguage(20426, 'VN Direct')
            },
            mf:{
                title: languageFormat.getLanguage(33503, 'Mutual Fund / Unit Investment Trust Fund (UITF)')
            }
        };
    },
    skipCodeTitle: ['hn','ft', 'fc', 'enews'],
    getScreenTitle: function(scr) {
        var me = this;

        if (!me.scrMap) {
            me._initScreenMap();
        }

        var title;
        if (me.scrMap[scr.comp]) {
            title = me.scrMap[scr.comp].title;
        }
        
        if (me.skipCodeTitle.indexOf(scr.comp) === -1) {
            if (scr.stkname) {
                title += ' - ' + stockutil.getStockName(getMappedStockName(scr.stkname));
            } else if (scr.key) {
                title += ' - ' + scr.key;
            }
        }
        
        return title;
    },
    openFrame: function(frameKey, frameURL, frameConf) {
        var me = this;
        var urlFrame = me.get(me.frames, frameKey);

        if (!urlFrame) {
            urlFrame = Ext.create('Ext.ux.IFrame', Ext.apply({
                key: frameKey,
                winConfig: getNewsWinConfig(),
                listeners: {
                    beforedestroy: function(thisFrame) {
                        me.remove(me.frames, thisFrame.key);
                    }
                }
            }, frameConf));

            me.frames.push(urlFrame);
            n2nLayoutManager.addItem(urlFrame);
            urlFrame.refresh(frameURL);
        }

        n2nLayoutManager.activateItem(urlFrame);
    },
    openStockScreenerWin: function(conf, tabCt){
    	if (!tabCt && n2nLayoutManager.activateBuffer('sstool')) {
            return;
        }
    	
    	var stockScreenerUrl = global_otherToolStockScreenerURL + '?lang=' + global_Language + '&color=' + formatutils.procThemeColor();
    	if (N2N_CONFIG.newWin_StkFilter) {
            if (window.name == "_otherTool_StockScreener")
                window.name = "";

            msgutil.openURL({
                url: stockScreenerUrl,
                name: '_otherTool_StockScreener'
            });
        } else {
            var ssTool = userReport['userReport_otherTool_StockScreener'];
            if (ssTool == null) {
            	ssTool = Ext.create('Ext.ux.IFrame', Ext.apply({
                    title: languageFormat.getLanguage(20523, 'Exchange Rate'),
                    slcomp: "sstool",
                    type: 'sstool',
                    savingComp: true,
                    ddComp: true,
                    winConfig: getNewsWinConfig(),
                    initMax: true
                }, conf));

            	sstool.on('beforedestroy', function () {
                    userReport[ 'userReport_otherTool_StockScreener' ] = null;
                });

                n2nLayoutManager.addItem(sstool, null, null, tabCt);
                userReport[ 'userReport_otherTool_StockScreener' ] = sstool;
            }

            n2nLayoutManager.activateItem(sstool);
            helper.runAfterCompRendered(sstool, function() {
            	sstool.refresh(stockScreenerUrl);
            }); 
        }
    },
    openExchangeRateWin: function(conf, tabCt){
    	if (!tabCt && n2nLayoutManager.activateBuffer('ertool')) {
            return;
        }
    	
    	var exchangeRateUrl = global_otherToolExchangeRateURL + '?lang=' + global_Language + '&color=' + formatutils.procThemeColor();
    	if (N2N_CONFIG.newWin_Other) {
            if (window.name == "_otherTool_ExchangeRate")
                window.name = "";

            msgutil.openURL({
                url: exchangeRateUrl,
                name: '_otherTool_ExchangeRate'
            });
        } else {
            var erTool = userReport['userReport_otherTool_ExchangeRate'];
            if (erTool == null) {
            	erTool = Ext.create('Ext.ux.IFrame', Ext.apply({
                    title: languageFormat.getLanguage(20523, 'Exchange Rate'),
                    slcomp: "ertool",
                    type: 'ertool',
                    savingComp: true,
                    ddComp: true,
                    winConfig: getNewsWinConfig(),
                    initMax: true
                }, conf));

            	erTool.on('beforedestroy', function () {
                    userReport[ 'userReport_otherTool_ExchangeRate' ] = null;
                });

                n2nLayoutManager.addItem(erTool, null, null, tabCt);
                userReport[ 'userReport_otherTool_ExchangeRate' ] = erTool;
            }

            n2nLayoutManager.activateItem(erTool);
            helper.runAfterCompRendered(erTool, function() {
            	erTool.refresh(exchangeRateUrl);
            }); 
        }
    },
    createITFinanceChartPanel: function(conf, tabCt){
    	if (!tabCt && n2nLayoutManager.activateBuffer('itf')) {
            return;
        }
    	
        var itFinanceChart = userReport['userReport_itfinance_chart'];

        if (userReport['userReport_itfinance_chart'] == null) {
            itFinanceChart = Ext.create('Ext.ux.IFrame', Ext.apply({
                title: languageFormat.getLanguage(20113, 'IT Finance Chart'),
                type: 'itf',
                savingComp: true,
                ddComp: true,
                initMax: true
            }, conf));

            itFinanceChart.on('beforedestroy', function () {
                userReport[ 'userReport_itfinance_chart' ] = null;
            });

            n2nLayoutManager.addItem(itFinanceChart, null, null, tabCt);
            userReport[ 'userReport_itfinance_chart' ] = itFinanceChart;
        }

        n2nLayoutManager.activateItem(itFinanceChart);
        helper.runAfterCompRendered(itFinanceChart, function() {
            itFinanceChart.refresh(ITFinanceChartURL);
        }); 
    },
    createWorldIndicesPanel: function(conf, tabCt){
    	if (!tabCt && n2nLayoutManager.activateBuffer('ewi')) {
            return;
        }
    	
        var worldIndices = userReport['userReport_worldIndices'];

        if (userReport['userReport_worldIndices'] == null) {
            worldIndices = Ext.create('Ext.ux.IFrame', Ext.apply({
                title: languageFormat.getLanguage(20158, 'World Indices'),
                type: 'ewi',
                savingComp: true,
                ddComp: true,
                initMax: true
            }, conf));

            worldIndices.on('beforedestroy', function () {
                userReport[ 'userReport_worldIndices' ] = null;
            });

            n2nLayoutManager.addItem(worldIndices, null, null, tabCt);
            userReport[ 'userReport_worldIndices' ] = worldIndices;
        }

        n2nLayoutManager.activateItem(worldIndices);
        helper.runAfterCompRendered(worldIndices, function() {
            worldIndices.refresh(worldIndicesURL);
        }); 
    },
    createVNDirectIframe: function (conf, tabCt) {
        var me = this;

        if (!tabCt && n2nLayoutManager.activateBuffer('vnd')) {
            return;
        }

        if (N2N_CONFIG.vnDirectDisclaimer && jsutil.toBoolean(userPreference.get('vnds', 'true'))) {
            var elStyle = 'margin: 10px;';

            var noAskCb = Ext.create('Ext.form.field.Checkbox', {
                boxLabel: languageFormat.getLanguage(10059, 'Do not show this message again'),
                style: elStyle
            });

            var disclaimerBox = msgutil.popup({
                title: languageFormat.getLanguage(10016, 'Disclaimer'),
                width: 380,
                items: {
                    items: [
                        {
                            xtype: 'container',
                            html: languageFormat.getLanguage(10058, 'We are pleased to offer free access to Vietnam (VN) market price feed and analytics which is powered by our Business Partner. Please call your trading representatives to place orders for VN stocks. Click <a target="_blank" href="https://www.itradecimb.com.sg/app/help.client.services.z?cat=01&subcat=01_06&subsubcat=8a3e8254590b09e00159ddd818012152#Vietnam">here</a> to find more about trading in Vietnam market.'),
                            style: elStyle
                        },
                        noAskCb,
                        {
                            xtype: 'button',
                            width: 60,
                            text: languageFormat.getLanguage(10103, 'Close'),
                            cls: 'flatbtn',
                            style: elStyle,
                            handler: function() {
                                disclaimerBox.close();
                            }
                        }
                    ]
                },
                listeners: {
                    close: function() {
                        N2N_CONFIG.vnDirectDisclaimer = false; // display disclaimer only once
                        var noAskCbVal = noAskCb.getValue();
                        if (noAskCbVal) {
                            userPreference.set('vnds', 'false');
                            userPreference.save();
                        }

                        me.createVNDirectIframe(conf, tabCt);
                    }
                }
            });

            return;
        }
        
        if (N2N_CONFIG.vnDirectUrl) {
            var VNDirectIframe = userReport['userReport_VNDirect'];
            
            if (VNDirectIframe == null) {
                VNDirectIframe = Ext.create('Ext.ux.IFrame', Ext.apply({
                    title: languageFormat.getLanguage(20426, 'VN Direct'),
                    slcomp: "vnd",
                    type: 'vnd',
                    savingComp: true,
                    winConfig: getNewsWinConfig()
                }, conf));

                VNDirectIframe.on('beforedestroy', function () {
                    userReport['userReport_VNDirect'] = null;
                });

                n2nLayoutManager.addItem(VNDirectIframe, null, null, tabCt);
                userReport['userReport_VNDirect'] = VNDirectIframe;
            }

            //show or hide
            n2nLayoutManager.activateItem(VNDirectIframe);
            helper.runAfterCompRendered(VNDirectIframe, function () {
                VNDirectIframe.refresh(N2N_CONFIG.vnDirectUrl);
            });
        }
    },
    addEmptyScreen: function(comp) {
        var me = this;

        if (comp && !comp.stkcode) {
            me.emptyScreens.push(comp);
        }
    },
    emptyScreens: [],
    activateEmptyScreens: function() {
        var me = this;

        if (!me.activatingEmptyScreens && me.emptyScreens.length > 0) {
            me.activatingEmptyScreens = true;

            setTimeout(function() {
                for (var i = 0; i < me.emptyScreens.length; i++) {
                    var scr = me.emptyScreens[i];

                    if (helper.inView(scr) && typeof scr.refreshEmpty === 'function') {
                        scr.refreshEmpty();
                    }
                }

                me.emptyScreens = [];
                me.activatingEmptyScreens = false;
            }, 1);

        }
    }
};

n2ncomponents.getScreenList = function(tabId) {
    var me = this;
    var menuItems = new Array();
    // allow layout saving
    if (n2nLayoutManager) {
        n2nLayoutManager._allowSaveLayout = true;
    }

    // Quotescreen
    menuItems.push({
        text: languageFormat.getLanguage(20631, 'Quote Screen'),
        handler: function() {
            me.configureHandler.quoteScreen(tabId, true);
        }
    });

    // watchlist
    if (showWatchListHeader == "TRUE" && showWatchListView == "TRUE" && watchListArr && watchListArr.length > 0) {
        if (watchListArr.length > 1) {
            var subMenuItems = new Array();
            for (var i = 0; i < watchListArr.length; i++) {
                subMenuItems.push({
                    text: textToHtml(watchListArr[i]),
                    wlName: watchListArr[i],
                    handler: function(thisBtn) {
                        me.configureHandler.watchlist(tabId, thisBtn.wlName);
                    }
                });
            }
            menuItems.push({
                text: languageFormat.getLanguage(20001, 'Watchlist'),
                menu: subMenuItems
            });
        } else {
            menuItems.push({
                text: languageFormat.getLanguage(20001, 'Watchlist') + ' - ' + watchListArr[0],
                wlName: watchListArr[0],
                handler: function(thisBtn) {
                    me.configureHandler.watchlist(tabId, thisBtn.wlName);
                }
            });
        }
    }

    // Stock info
    if (showStkInfoHeader == "TRUE" && showStkInfoStkInfo == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20021, 'Stock Info'),
            handler: function() {
                me.configureHandler.stockInfo(tabId);
            }
        });
    }

    // Tracker
    if (showStkInfoHeader == "TRUE" && showStkInfoTracker == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20024, 'Stock Tracker'),
            handler: function() {
                me.configureHandler.tracker(tabId);
            }
        });
    }

    // Historical data
    if (showStkInfoHeader == "TRUE" && N2N_CONFIG.features_HistoricalData) {
        menuItems.push({
            text: languageFormat.getLanguage(20060, 'Historical Data'),
            handler: function() {
                me.configureHandler.historical(tabId);
            }
        });
    }

    // Indices
    if (showMarketIndices == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20029, 'Indices'),
            handler: function() {
                me.configureHandler.indices(tabId);
            }
        });
    }

    // Order status
    if (showOrdBookHeader == "TRUE" && showOrdBookOrderSts == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20172, 'Order Status'),
            iconCls: 'icon-detail',
            handler: function() {
                me.configureHandler.orderStatus(tabId);
            }
        });
    }
    //Mutual Order status
    if (showOrdBookHeader == "TRUE" && showOrdBookMFOrderSts == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(33720, 'Mutual Fund Order Book'),
            iconCls: 'icon-detail',
            handler: function() {
                me.configureHandler.mfOrderStatus(tabId);
            }
        });
    }

    // Derivative Portfolio
    if (showPortFolioHeader == "TRUE" && global_showPortFolioDerivativePortFolio == 'TRUE') {
        menuItems.push({
            text: languageFormat.getLanguage(20263, 'Derivatives Portfolio'),
            handler: function() {
                me.configureHandler.derivativePrtf(tabId);
            }
        });
    }

    // Equity Portfolio
    if (showPortFolioHeader == "TRUE" && showPortFolioMyPortFolio == 'TRUE') {
        menuItems.push({
            text: languageFormat.getLanguage(20262, 'Equities Portfolio'),
            handler: function() {
                me.configureHandler.equityPrtf(tabId);
            }
        });
    }

    // Equity Portfolio Realised G/L
    if (showPortFolioHeader == "TRUE" && showPortFolioRealizedGainLoss == 'TRUE') {
        menuItems.push({
            text: languageFormat.getLanguage(20265, 'Realised Gain/Loss'),
            handler: function() {
                me.configureHandler.realizedPrtf(tabId);
            }
        });
    }

    // Announcement
    if (n2nLayoutManager.isWindowLayout() && showNewsHeader == "TRUE" && showNewsAnnouncements == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20122, 'Announcements'),
            handler: function() {
                me.configureHandler.announcement(tabId);
            }
        });
    }

    return menuItems;
};
n2ncomponents.getMiniScreenList = function(tabId) {
    var me = this;
    var menuItems = new Array();

    // Market Depth
    if (showStkInfoHeader == "TRUE" && showStkInfoMarketDepth == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20022, 'Market Depth'),
            handler: function() {
                me.configureHandler.marketDepth(tabId);
            }
        });
    }

    // Intraday Chart
    if (showChartHeader == "TRUE" && showChartIntradayChart == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20101, 'Intraday Chart'),
            handler: function() {
                me.configureHandler.intradaychart(tabId);
            }
        });
    }

    // Stock News
    if (showNewsHeader == "TRUE" && showNewsStockNews == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20123, 'Stock News'),
            handler: function() {
                me.configureHandler.stockNews(tabId);
            }
        });
    }

    // Announcement
    if (showNewsHeader == "TRUE" && showNewsAnnouncements == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20122, 'Announcements'),
            handler: function() {
                me.configureHandler.announcement(tabId);
            }
        });
    }

    // Market Summary
    if (showMarketHeader == "TRUE" && showMarketSummary == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20050, 'Summary'),
            handler: function() {
                me.configureHandler.marketSummary(tabId);
            }
        });
    }

    // Market Streamer
    if (showMarketHeader == "TRUE" && showMarketStreamer == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20157, 'Streamer'),
            handler: function() {
                me.configureHandler.streamer(tabId);
            }
        });
    }

    return menuItems;
};
n2ncomponents.configureHandler = {
    quoteScreen: function(tabId, suspendLoad, conf, tabCt) {
        createQuoteScreen(suspendLoad, conf, tabCt);
        // n2nLayoutManager.saveConfiguredTab(tabId, 'qs');
    },
    orderPad: function(conf, tabCt) {
        closedOrderPad = false;
        createOrderPad(null, null, null, null, null, null, null, conf, tabCt);
    },
    depthMatrix: function(tabId, suspendLoad, conf, tabCt) {
        createMarketDepthMatrixPanel(suspendLoad, conf, tabCt);
    },
            recentQuote: function(suspendLoad, conf, tabCt) {
        viewRecentQuote(conf, tabCt, suspendLoad);
    },
    watchlist: function(tabId, wlName, conf, tabCt) {
        viewWatchlist(wlName, null, null, conf, tabCt);
    },
    stockInfo: function(tabId, compKey, stkName, conf, tabCt) {
        var stk = n2nLayoutManager.getActive(compKey, stkName);
        createStkInfoPanel(stk.stkCode, stk.stkName, false, null, null, conf, tabCt);
        // n2nLayoutManager.saveConfiguredTab(tabId, 'si', stkCode);
    },
    tracker: function(tabId, compKey, stkName, conf, tabCt) {
        var stk = n2nLayoutManager.getActive(compKey, stkName);
        createTrackerPanel(stk.stkCode, stk.stkName, false, null, null, conf, tabCt);
        // n2nLayoutManager.saveConfiguredTab(tabId, 'tr', stkCode);
    },
    historical: function(tabId, compKey, stkName, conf, tabCt) {
        var stk = n2nLayoutManager.getActive(compKey, stkName);

        n2ncomponents.createHistoricalData(stk.stkCode, stk.stkName, null, null, null, conf, tabCt);
        // n2nLayoutManager.saveConfiguredTab(tabId, 'hs', stkCode);
    },
    intradaychart: function(tabId, compKey, stkName, conf, tabCt, startup) {
        var stk = n2nLayoutManager.getActive(compKey, stkName);

        createChartPanel(stk.stkCode, stk.stkName, false, null, null, conf, tabCt, startup);
    },
    analysischart: function(tabId, compKey, stkName, conf, tabCt, startup) {
        var stk = n2nLayoutManager.getActive(compKey, stkName);

        createAnalysisChartPanel(stk.stkCode, stk.stkName, false, null, null, conf, tabCt, startup);
    },
    indices: function(tabId) {
        createIndices(null, null, null, null);
        n2nLayoutManager.saveConfiguredTab(tabId, 'in');
    },
    orderStatus: function(tabId, conf, tabCt) {
        createOrdStsPanel('', '0', null, null, conf, tabCt);
        // n2nLayoutManager.saveConfiguredTab(tabId, 'os');
    },
    mfOrderStatus: function(tabId, conf, tabCt) {
        createMFOrdStsPanel('', '0', null, null, conf, tabCt);
        // n2nLayoutManager.saveConfiguredTab(tabId, 'os');
    },
    orderHistory: function(tabId, conf, tabCt) {
        createOrdHistoryPanel(null, null, conf, tabCt);
        // n2nLayoutManager.saveConfiguredTab(tabId, 'oh');
    },
    mfOrderHistory: function(tabId, conf, tabCt) {
        createMFOrdHistoryPanel(null, null, conf, tabCt);
        // n2nLayoutManager.saveConfiguredTab(tabId, 'oh');
    },
    basketOrder: function(tabId, conf, tabCt) {
        createBasketOrderPanel(null, null, conf, tabCt);
    },
    derivativePrtf: function(tabId, conf, tabCt) {
        createDerivativePortfolioPanel('', null, null, conf, tabCt);
        resetOrderPad();
        // n2nLayoutManager.saveConfiguredTab(tabId, 'dp');
    },
    equityPrtf: function(tabId, conf, tabCt) {
        createEquityPortfolioPanel('', null, null, conf, tabCt);
        resetOrderPad();
        // n2nLayoutManager.saveConfiguredTab(tabId, 'ep');
    },
    fundPrtf: function(tabId, conf, tabCt) {
        createFundPortfolioPanel('', null, null, conf, tabCt);
        resetOrderPad();    // to reset Order Pad
    },
    equityManualPrtf: function(tabId, conf, tabCt) {
        createEquityManualPortFolioPanel('', null, null, conf, tabCt);
        resetOrderPad();
    },
    cfdHoldings: function(tabId, conf, tabCt) {
    	createCFDHoldingsPanel('', null, null, conf, tabCt);
        resetOrderPad();
    },
    realizedPrtf: function(tabId, conf, tabCt) {
        createEquityPortfolioRealizedGainLossPanel('', null, null, conf, tabCt);
        resetOrderPad();
        // n2nLayoutManager.saveConfiguredTab(tabId, 'rp');
    },
    marketDepth: function(tabId, compKey, stkName, conf, tabCt) {
        var stk = n2nLayoutManager.getActive(compKey, stkName);
        closedMarketDepth = false;
        createMarketDepthPanel(stk.stkCode, stk.stkName, true, null, conf, tabCt);
        // n2nLayoutManager.saveConfiguredTab(tabId, 'md');
    },
    brokerQ: function(tabId, compKey, stkName, conf, tabCt) {
        var stk = n2nLayoutManager.getActive(compKey, stkName);

        n2ncomponents.createBrokerQ({
            key: stk.stkCode,
            name: stk.stkName,
            config: conf
        }, tabCt);
    },
    stockNews: function(tabId, compKey, stkName, conf, tabCt) {
        var stk = n2nLayoutManager.getActive(compKey, stkName);
        if (stk) {
            createStkNewsPanel(stk.stkCode, stk.stkName, conf, tabCt);
        }
    },
    announcement: function(tabId, conf, tabCt) {
        createNewsPanel(null, null, conf, tabCt);
        // n2nLayoutManager.saveConfiguredTab(tabId, 'gn');
    },
    newsArchive: function(compKey, stkName, conf, tabCt) {
        n2ncomponents.openArchiveNews({key: compKey, name: stkName, conf: conf, tabCt: tabCt});
    },
    marketSummary: function(tabId, conf, tabCt) {
        createSummaryPanel(false, null, null, conf, tabCt);
        // n2nLayoutManager.saveConfiguredTab(tabId, 'mo');
    },
    streamer: function(tabId, conf, tabCt) {
        createMarketStreamer(null, null, conf, tabCt);
        // n2nLayoutManager.saveConfiguredTab(tabId, 'ms');
    },
    trackerrecord: function(tabId, conf, tabCt) {
        createTrackerRecord(null, null, conf, tabCt);
    },
    foreignFlows: function(tabId, compKey, stkName, conf, tabCt) {
        var stk = n2nLayoutManager.getActive(compKey, stkName);
        n2ncomponents.createForeignFlows({
            key: stk.stkCode,
            name: stk.stkName,
            config: conf
        }, tabCt);
    },
    brokerInfo: function(tabId, conf, tabCt) {
        n2ncomponents.createBrokerInfo({config: conf}, tabCt);
    },
    brokerSearch: function(tabId, conf, tabCt) {
        n2ncomponents.createBrokerSearch({config: conf}, tabCt);
    },
    worldIndices: function(tabId, conf, tabCt) {
        n2ncomponents.createWorldIndices({config: conf}, tabCt);
    },
    tradeCal: function(tabId, conf, tabCt) {
        n2ncomponents.createTradeCal(conf, tabCt);
    },
    factSet: function(tabId, compKey, stkName, conf, tabCt) {
    	var stk = n2nLayoutManager.getActive(compKey, stkName);
        createFundamentalCPIQWin(stk.stkCode, stk.stkName, conf, tabCt);
    },
    factSetScreener: function(tabId, compKey, stkName, conf, tabCt) {
    	createFundamentalScreenerCPIQWin(conf, tabCt);
    },
    thomson: function(tabId, compKey, stkName, conf, tabCt) {
            var stk = n2nLayoutManager.getActive(compKey, stkName);
        createFundamentalThomsonReutersWin(stk.stkCode, stk.stkName, conf, tabCt);
    },
    thomsonscreener: function(tabId, conf, tabCt) {
            createFundamentalScreenerThomsonReutersWin(conf, tabCt);
    },
    addstockalert: function(tabId, compKey, stkName, conf, tabCt) {
        n2ncomponents.createAddStockAlert(compKey);
    },
    breakevencalc: function(conf, tabCt) {
        n2ncomponents.createBreakEvenCalc(conf, tabCt);
    },
    externalCalc: function(conf, tabCt){
            n2ncomponents.createMFCalc(conf, tabCt);
    },
    perEPSCalc: function(tabCt){
            var stk = n2nLayoutManager.getActiveRecord();
            if (stk) {
                    n2ncomponents.createPEREPSCalc(stk, tabCt);
            }
    },
    hotkeys: function(tabId, conf, tabCt){
    	n2ncomponents.openHotKeysMapping(conf, tabCt);   
    },
    elasticNews: function(compKey, stkName, conf, tabCt, newsOpt) {
        n2ncomponents.openElasticNews({key: compKey, name: stkName, conf: conf, tabCt: tabCt, newsOpt: newsOpt});
    },
    news: function(compKey, stkName, conf, tabCt) {
        n2ncomponents.openNews({conf: conf, tabCt: tabCt, key: compKey});
    },
    webReport: function(rptSettings, conf, tabCt){
    	var rtpSt = getReportSettings(rptSettings);
    	n2ncomponents.openWebReport(rtpSt, conf, tabCt);
    },
    pseEdge: function(compKey, stkName, conf, tabCt){
    	n2ncomponents.openPseEdge(compKey, stkName, conf, tabCt);
    },
    iBillionaire: function(compKey, stkName, conf, tabCt){
    	n2ncomponents.openIBillionaire(compKey, stkName, conf, tabCt);
    },
    theScreener: function(compKey, stkName, conf, tabCt){
    	n2ncomponents.openTheScreener(compKey, stkName, conf, tabCt);
    },
    smsStockAlert: function(compKey, stkName, conf, tabCt){
    	n2ncomponents.createSMSStockAlert(compKey, stkName, conf, tabCt);
    },
    pseBoardLotTable: function(conf, tabCt){
    	n2ncomponents.openPSEBoardLotTable(conf, tabCt);
    },
    exchangeRate: function(conf, tabCt){
    	n2ncomponents.openExchangeRateWin(conf, tabCt);
    },
    stockScreener: function(conf, tabCt){
    	n2ncomponents.openStockScreenerWin(conf, tabCt);
    },
    analysisWarrants: function(conf, tabCt){
    	n2ncomponents.createAnalysisWarrants(conf, tabCt);
    },
    analysisDividend: function(conf, tabCt){
    	n2ncomponents.createAnalysisDividend(conf, tabCt);
    },
    analysisBMDFuture: function(conf, tabCt){
    	n2ncomponents.createAnalysisBMD_Future(conf, tabCt);
    },
    itFinanceChart: function(conf, tabCt){
    	n2ncomponents.createITFinanceChartPanel(conf, tabCt);
    },
    externalWorldIndices: function(conf, tabCt){
    	n2ncomponents.createWorldIndicesPanel(conf, tabCt);
    },
    VNDirectIframe: function(conf, tabCt){
    	n2ncomponents.createVNDirectIframe(conf, tabCt);
    },
    mutualFund: function(suspendLoad, conf, tabCt){
    	createMutualFund(suspendLoad, conf, tabCt);
    }
    
};
n2ncomponents._saveLayoutTask = null;
n2ncomponents.requestSaveLayout = function(asyncMode, successCallback, failureCallback) {
    if (n2nLayoutManager) {
        var lyStr = n2nLayoutManager.lyConf.toString();
        n2nLayoutManager.lyConf.removeBackup();
        var scKey = 'TCLMLV2';
        var mscKey = 'TCLMN';
        if (isTablet) {
            scKey = 'TCLTLV2';
            mscKey = 'TCLTMN';
        }

        n2nStorage.set('layout', lyStr);
        var mapStr = Ext.encode(mappedNames);
        n2nStorage.set('mappedNames', mapStr);
        n2nStorage.set('layoutSync', false);

        var successResult = false;

        // save mapped name
        if (N2N_CONFIG.saveMappedNames) {
            Ext.Ajax.request({
                url: addPath + "tcplus/setting?a=set&sc=" + mscKey + "&p=" + mapStr,
                async: asyncMode != null ? asyncMode : true
            });
        }

        // save layout
        Ext.Ajax.request({
            url: addPath + "tcplus/setting?a=set&sc=" + scKey + "&p=" + lyStr,
            async: asyncMode != null ? asyncMode : true,
            success: function(response) {
                var res = Ext.decode(response.responseText);
                if (res && res.s) {
                    n2nStorage.set('layoutSync', true);
                    n2nLayoutManager.lyConf.changed = false;
                    successResult = true;
                }
            },
            callback: function() {
                if (successResult) {
                    if (typeof successCallback === 'function') {
                        successCallback();
                    }
                } else {
                    if (typeof failureCallback === 'function') {
                        failureCallback();
                    }
                }
            }
        });
    }
};
n2ncomponents.loadScreen = function(tabId, comp, compKey, stkName, tabCt, extraConf) {
    var me = this;
    var conf = {};
    var suspendLoad = true;

    if (tabId) {
        if (tabId !== 'p') {
            conf = {tConf: {tab: tabId}};
            if (tabId !== 'am') {
                suspendLoad = false;
            }
        }

        conf.loadedScreen = true;
        Ext.apply(conf, extraConf);
    } else {
        suspendLoad = false;
    }

    switch (comp) {
        case 'qs':
            me.configureHandler.quoteScreen(tabId, suspendLoad, conf, tabCt);
            if (suspendLoad) {
                me.bufferTasks1.push(function() {
                    if (quoteScreen) {
                        quoteScreen.start();
                    }
                });
                me.bufferTask1HasMain = true;
            }

            break;
        case 'rq':
            me.configureHandler.recentQuote(suspendLoad, conf, tabCt);
            if (suspendLoad) {
                me.bufferTask1HasMain = true;
            }

            break;
        case 'wl':
            if (suspendLoad) {
                me.bufferTasks2.push(function() {
                    me.configureHandler.watchlist(tabId, compKey, conf, tabCt);
                });
                me.bufferTasks2HasMain = true;
            } else {
                me.configureHandler.watchlist(tabId, compKey, conf, tabCt);
            }

            break;
        case 'si':
            if (suspendLoad) {
                me.bufferTasks3.push(function() {
                    me.configureHandler.stockInfo(tabId, compKey, stkName, conf, tabCt);
                });
            } else {
                me.configureHandler.stockInfo(tabId, compKey, stkName, conf, tabCt);
            }

            break;
        case 'tr':
            if (suspendLoad) {
                me.bufferTasks3.push(function() {
                    me.configureHandler.tracker(tabId, compKey, stkName, conf, tabCt);
                });
            } else {
                me.configureHandler.tracker(tabId, compKey, stkName, conf, tabCt);
            }

            break;
        case 'hd':
            if (suspendLoad) {
                me.bufferTasks3.push(function() {
                    me.configureHandler.historical(tabId, compKey, stkName, conf, tabCt);
                });
            } else {
                me.configureHandler.historical(tabId, compKey, stkName, conf, tabCt);
            }

            break;
        case 'ic':
            if (suspendLoad) {
                me.bufferTasks3.push(function() {
                    me.configureHandler.intradaychart(tabId, compKey, stkName, conf, tabCt, true);
                });
            } else {
                me.configureHandler.intradaychart(tabId, compKey, stkName, conf, tabCt, true);
            }

            break;
        case 'an':
            if (suspendLoad) {
                me.bufferTasks3.push(function() {
                    me.configureHandler.analysischart(tabId, compKey, stkName, conf, tabCt, true);
                });
            } else {
                me.configureHandler.analysischart(tabId, compKey, stkName, conf, tabCt, true);
            }

            break;
        case 'in':
            createIndices(false, !suspendLoad, null, null, conf, tabCt);
            if (suspendLoad) {
                me.bufferTasks1.push(function() {
                    indices._procCallIndices();
                });
            }
            break;
        case 'sb':
            if (suspendLoad) {
                me.bufferTasks1.push(function() {
                    createScoreBoard(false, null, null, conf, tabCt);
                });
            } else {
                createScoreBoard(false, null, null, conf, tabCt);
            }

            break;
        case 'os':
            if (suspendLoad) {
                me.bufferTasks1.push(function() {
                    me.configureHandler.orderStatus(tabId, conf, tabCt);
                });
            } else {
                me.configureHandler.orderStatus(tabId, conf, tabCt);
            }

            break;
        case 'mfos':
            if (suspendLoad) {
                me.bufferTasks1.push(function() {
                    me.configureHandler.mfOrderStatus(tabId, conf, tabCt);
                });
            } else {
                me.configureHandler.mfOrderStatus(tabId, conf, tabCt);
            }

            break;
        case 'oh':
            if (suspendLoad) {
                me.bufferTasks1.push(function() {
                    me.configureHandler.orderHistory(tabId, conf, tabCt);
                });
            } else {
                me.configureHandler.orderHistory(tabId, conf, tabCt);
            }

            break;
        case 'mfoh':
            if (suspendLoad) {
                me.bufferTasks1.push(function() {
                    me.configureHandler.mfOrderHistory(tabId, conf, tabCt);
                });
            } else {
                me.configureHandler.mfOrderHistory(tabId, conf, tabCt);
            }

            break;
        case 'bo':
            if (suspendLoad) {
                me.bufferTasks1.push(function() {
                    me.configureHandler.basketOrder(tabId, conf, tabCt);
                });
            } else {
                me.configureHandler.basketOrder(tabId, conf, tabCt);
            }

            break;
        case 'dp':
            if (suspendLoad) {
                me.bufferTasks4.push(function() {
                    me.configureHandler.derivativePrtf(tabId, conf, tabCt);
                });
            } else {
                me.configureHandler.derivativePrtf(tabId, conf, tabCt);
            }

            break;
        case 'ep':
            if (suspendLoad) {
                me.bufferTasks4.push(function() {
                    me.configureHandler.equityPrtf(tabId, conf, tabCt);
                });
            } else {
                me.configureHandler.equityPrtf(tabId, conf, tabCt);
            }
            break;
        case 'fp':
            if (suspendLoad) {
                me.bufferTasks4.push(function() {
                    me.configureHandler.fundPrtf(tabId, conf, tabCt);
                });
            } else {
                me.configureHandler.fundPrtf(tabId, conf, tabCt);
            }
            break;
        case 'emp':
            if (suspendLoad) {
                me.bufferTasks4.push(function() {
                    me.configureHandler.equityManualPrtf(tabId, conf, tabCt);
                });
            } else {
                me.configureHandler.equityManualPrtf(tabId, conf, tabCt);
            }
            break;
        case 'cfdh':
            if (suspendLoad) {
                me.bufferTasks4.push(function() {
                    me.configureHandler.cfdHoldings(tabId, conf, tabCt);
                });
            } else {
                me.configureHandler.cfdHoldings(tabId, conf, tabCt);
            }
            break;
        case 'rp':
            if (suspendLoad) {
                me.bufferTasks4.push(function() {
                    me.configureHandler.realizedPrtf(tabId, conf, tabCt);
                });
            } else {
                me.configureHandler.realizedPrtf(tabId, conf, tabCt);
            }

            break;
        case 'md':
            if (suspendLoad) {
                me.bufferTasks3.push(function() {
                    me.configureHandler.marketDepth(tabId, compKey, stkName, conf, tabCt);
                });
            } else {
                me.configureHandler.marketDepth(tabId, compKey, stkName, conf, tabCt);
            }

            break;
        case 'bq':
            if (suspendLoad) {
                me.bufferTasks3.push(function() {
                    me.configureHandler.brokerQ(tabId, compKey, stkName, conf, tabCt);
                });
            } else {
                me.configureHandler.brokerQ(tabId, compKey, stkName, conf, tabCt);
            }

            break;
        case 'sn':
            if (suspendLoad) {
                me.bufferTasks3.push(function() {
                    me.configureHandler.stockNews(tabId, compKey, stkName, conf, tabCt);
                });
            } else {
                me.configureHandler.stockNews(tabId, compKey, stkName, conf, tabCt);
            }

            break;
        case 'gn':
            me.configureHandler.announcement(tabId, conf, tabCt);
            break;
        case 'mo':
            if (suspendLoad) {
                me.bufferTasks1.push(function() {
                    me.configureHandler.marketSummary(tabId, conf, tabCt);
                });
            } else {
                me.configureHandler.marketSummary(tabId, conf, tabCt);
            }

            break;
        case 'ms':
            if (suspendLoad) {
                me.bufferTasks1.push(function() {
                    me.configureHandler.streamer(tabId, conf, tabCt);
                });
            } else {
                me.configureHandler.streamer(tabId, conf, tabCt);
            }

            break;
        case 'td':
            if (suspendLoad) {
                me.bufferTasks1.push(function() {
                    me.configureHandler.trackerrecord(tabId, conf, tabCt);
                });
            } else {
                me.configureHandler.trackerrecord(tabId, conf, tabCt);
            }

            break;
        case 'ff':
            if (suspendLoad) {
                me.bufferTasks3.push(function() {
                    me.configureHandler.foreignFlows(tabId, compKey, stkName, conf, tabCt);
                });
            } else {
                me.configureHandler.foreignFlows(tabId, compKey, stkName, conf, tabCt);
            }
            break;
        case 'fc':
                me.configureHandler.factSet(tabId, compKey, stkName, conf, tabCt);

            break;
        case 'fcs':
            me.configureHandler.factSetScreener(tabId, conf, tabCt);

        break;
        case 'ft':
                me.configureHandler.thomson(tabId, compKey, stkName, conf, tabCt);

            break;
        case 'fst':
            me.configureHandler.thomsonscreener(tabId, conf, tabCt);

        break;
        case 'asa':
                me.configureHandler.addstockalert(tabId, compKey, stkName, conf, tabCt);

            break;
        case 'dm':
            me.configureHandler.depthMatrix(tabId, suspendLoad, conf, tabCt);
            if (suspendLoad) {
                me.bufferTasks1.push(function() {
                    if (marketDepthMatrixPanel) {
                        marketDepthMatrixPanel.start();
    }
                });
                me.bufferTask1HasMain = true;
            }
            break;
        case 'od':
            if (N2N_CONFIG.confDockableOrderpad) {
                me.configureHandler.orderPad(conf, tabCt);
            }

            break;
        case 'hn':
            me.configureHandler.newsArchive(compKey, stkName, conf, tabCt);
            break;
        case 'bc':
            me.configureHandler.breakevencalc(conf, tabCt);
            break;
        case 'ec':
            me.configureHandler.externalCalc(conf, tabCt);
            break;
        case 'pc':
            me.configureHandler.perEPSCalc(tabCt);
            break;
        case 'bki':
            if (suspendLoad) {
                me.bufferTasks1.push(function() {
                    me.configureHandler.brokerInfo(tabId, conf, tabCt);
                });
            } else {
                me.configureHandler.brokerInfo(tabId, conf, tabCt);
            }

            break;
        case 'bks':
            if (suspendLoad) {
                me.bufferTasks1.push(function() {
                    me.configureHandler.brokerSearch(tabId, conf, tabCt);
                });
            } else {
                me.configureHandler.brokerSearch(tabId, conf, tabCt);
            }

            break;
        case 'wi':
            if (suspendLoad) {
                me.bufferTasks1.push(function() {
                    me.configureHandler.worldIndices(tabId, conf, tabCt);
                });
            } else {
                me.configureHandler.worldIndices(tabId, conf, tabCt);
            }

            break;
       case 'tc':
           me.configureHandler.tradeCal(tabId, conf, tabCt);
           break;
       case 'hk':
    	   me.configureHandler.hotkeys(tabId, conf, tabCt);
           break;
       case 'en1':
    	   me.configureHandler.elasticNews(compKey, stkName, conf, tabCt, '1');
           break;
       case 'en2':
    	   me.configureHandler.elasticNews(compKey, stkName, conf, tabCt, '2');
           break;
       case 'enews':
    	   me.configureHandler.news(compKey, stkName, conf, tabCt);
           break;
       case 'rcs':
    	   me.configureHandler.webReport(webReportClientSummaryURL, conf, tabCt);
    	   break;
       case 'rmst':
    	   me.configureHandler.webReport(webReportMonthlyStatementURL, conf, tabCt);
    	   break;
       case 'rmas':
    	   me.configureHandler.webReport(webReportMarginAccountSummaryURL, conf, tabCt);
    	   break;
       case 'rtd':
    	   me.configureHandler.webReport(webReportTraderDepositReportURL, conf, tabCt);
    	   break;
       case 'rtb':
    	   me.configureHandler.webReport(webReportTradeBeyondReportURL, conf, tabCt);
    	   break;
       case 'rc':
    	   me.configureHandler.webReport(webReporteContractURL, conf, tabCt);
    	   break;
       case 'rai':
    	   me.configureHandler.webReport(webReportAISBeStatementURL, conf, tabCt);
    	   break;
       case 'rmp':
    	   me.configureHandler.webReport(webReportMarginPortFolioValuationURL, conf, tabCt);
    	   break;
       case 'rtm':
    	   me.configureHandler.webReport(webReportTransactionMovementURL, conf, tabCt);
    	   break;
       case 'rct':
    	   me.configureHandler.webReport(webReportClientTransactionStatementURL, conf, tabCt);
    	   break;
       case 'rsba':
    	   me.configureHandler.webReport(webReportStockBalanceURL, conf, tabCt);
    	   break;
       case 'pe':
    	   me.configureHandler.pseEdge(compKey, stkName, conf, tabCt);
    	   break;
       case 'ib':
    	   me.configureHandler.iBillionaire(compKey, stkName, conf, tabCt);
    	   break;
       case 'is':
    	   me.configureHandler.theScreener(compKey, stkName, conf, tabCt);
    	   break;
       case 'smsa':
    	   me.configureHandler.smsStockAlert(compKey, stkName, conf, tabCt);
    	   break;
       case 'pbl':
    	   me.configureHandler.pseBoardLotTable(conf, tabCt);
    	   break;
       case 'ertool':
    	   me.configureHandler.exchangeRate(conf, tabCt);
    	   break;
       case 'sstool':
    	   me.configureHandler.stockScreener(conf, tabCt);
    	   break;
       case 'aw':
    	   me.configureHandler.analysisWarrants(conf, tabCt);
    	   break;
       case 'ad':
    	   me.configureHandler.analysisDividend(conf, tabCt);
    	   break;
       case 'abf':
    	   me.configureHandler.analysisBMDFuture(conf, tabCt);
    	   break;
       case 'itf':
    	   me.configureHandler.itFinanceChart(conf, tabCt);
    	   break;
       case 'ewi':
    	   me.configureHandler.externalWorldIndices(conf, tabCt);
    	   break;
       case 'vnd':
    	   me.configureHandler.VNDirectIframe(conf, tabCt);
    	   break;
       case 'mf':
            if (N2N_CONFIG.mutualFund) {
                me.configureHandler.mutualFund(suspendLoad, conf, tabCt);
                if (suspendLoad) {
                    me.bufferTasks1.push(function () {
                        if (mutualFund) {
                            mutualFund.start();
                        }
                    });
                    me.bufferTask1HasMain = true;
                }
            }
    	   break;
    }

};
n2ncomponents.loadScreens = function(tabId, cfScr) {
    for (var s in cfScr) {
        n2ncomponents.loadScreen(tabId, cfScr[s].comp, cfScr[s].key);
    }
};
n2ncomponents.getSplitOptions = function() {
    var menuItems = [
        {
            text: languageFormat.getLanguage(31115, 'Split none'),
            handler: function() {
                n2nLayoutManager.createSplitScreen(1);
            }
        },
        {
            text: languageFormat.getLanguage(31116, 'Split in right'),
            handler: function() {
                n2nLayoutManager.createSplitScreen(2);
            }
        },
        {
            text: languageFormat.getLanguage(31117, 'Split in bottom'),
            handler: function() {
                n2nLayoutManager.createSplitScreen(3);
            }
        },
        {
            text: languageFormat.getLanguage(31118, 'Split in 4'),
            handler: function() {
                n2nLayoutManager.createSplitScreen(4);
            }
        }
    ];

    return menuItems;
};

n2ncomponents.saveBasketCookie = function(){
	if(basketOrderPanel){
    	var basketId = basketOrderPanel.cbBasket.getValue();
    	if(basketId == 'default'){
    		var sm = basketOrderPanel.getStore().data;
        	var ls = sm.items;
        	var n = ls.length;
        	var basketList = [];
        	var recordList = '';
        	for (var i = 0; i < n; i++) {
        		var r = ls[i].data;
        		var record = JSON.stringify(r);
        		recordList += record;
        		if(i != (n-1)){
        			recordList += '|';
        		}
        	}
        	localStorage.setItem(loginId + '_BasketList', recordList);
    	}
    }
};

Ext.define('TCPlus.Toast', {
    extend: 'Ext.window.Window',
    initComponent: function() {
        var me = this;

        if (me.displayDuration == 0) { // display forever
            me.displayDuration = null;
        } else if (!me.displayDuration) {
            me.displayDuration = 1500; // default to 3s
        }

        Ext.apply(me, {
            header: false,
            autoShow: true,
            maxWidth: 345,
            minHeight: 55,
            layout: 'fit',
            fadeInDuration: 500,
            fadeOutDuration: 1000,
            constrain: true,
            resizable: false,
            cls: 'toast-box ',
            shadow: false,
            items: {
                xtype: 'container',
                html: me.msg || '',
                style: me.imgCls ? 'padding-left: 40px;' : '',
                cls: me.imgCls || ''
            },
            listeners: {
                show: function(thisWin) {
                    var el = thisWin.getEl();

                    if (el) {
                        el.setOpacity(0);

                        el.fadeIn({duration: me.fadeInDuration, callback: function() {
                                me._runFn();

                                if (thisWin.displayDuration) {
                                    me.setFadeOutTask(thisWin.displayDuration);
                                }
                            }});

                    }
                },
                afterrender: function(thisWin) {
                    var el = thisWin.getEl();

                    if (el) {
                        if (thisWin.displayDuration) {
                            if (el) {
                                el.on('mouseenter', function() {
                                    me._clearFadeOutTask();
                                });

                                el.on('mouseleave', function() {
                                    me.setFadeOutTask(thisWin.displayDuration / 2); // decrease display duration by half
                                });
                            }
                        }
                        el.on('click', function() {
                            me.setFadeOutTask(1);
                        });
                    }
                },
                beforedestroy: function(thisWin) {
                    thisWin._clearFadeOutTask();
                }
            }
        });

        me.callParent(arguments);
    },
    _clearFadeOutTask: function() {
        var me = this;

        if (me.fadeOutTask) {
            clearTimeout(me.fadeOutTask);
            me.fadeOutTask = null;
        }

    },
    setFadeOutTask: function(displayDuration) {
        var me = this;
        var el = me.el;

        me._clearFadeOutTask();
        me.fadeOutTask = setTimeout(function() {
            el.fadeOut({duration: me.fadeOutDuration, callback: function() {
                    me.close();
                    me.fadeOutTask = null;
                    
                    // me._runFn();
                }});
        }, displayDuration); // display message for some time before it fades out
    },
    _runFn: function() {
        var me = this;

        if (typeof(me.func) === 'function') {
            me.func('ok');
        }
    }
});

Ext.define('Ext.ux.CustomSpinner', {
    extend: 'Ext.form.field.Spinner',
    alias: 'widget.customspinner',

    // override onSpinUp (using step isn't neccessary)
    onSpinUp: function() {
        var me = this;
        if (!me.readOnly) {
            var val = parseInt(me.getValue(), 10)||0; // defaults to zero on parse failure
            me.setSpinValue(Ext.Number.constrain(val + me.step, me.minValue, me.maxValue));
        }
    },

    // override onSpinDown
    onSpinDown: function() {
        var me = this;
        if (!me.readOnly) {
            var val = parseInt(me.getValue(), 10)||0; // defaults to zero on parse failure
            me.setSpinValue(Ext.Number.constrain(val - me.step, me.minValue, me.maxValue));
        }
    },
    setSpinValue: function(value) {
        var me = this;
            
        if (me.enforceMaxLength) {
            // We need to round the value here, otherwise we could end up with a 
            // very long number (think 0.1 + 0.2) 
            if (me.fixPrecision(value).toString().length > me.maxLength) {
                return;
            }
        }
        me.setValue(value);
    },
    fixPrecision : function(value) {
        var me = this,
            nan = isNaN(value),
            precision = me.decimalPrecision;
 
        if (nan || !value) {
            return nan ? '' : value;
        } else if (!me.allowDecimals || precision <= 0) {
            precision = 0;
        }
 
        return parseFloat(Ext.Number.toFixed(parseFloat(value), precision));
    }
});

Ext.define('TCPlus.ColorCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.colorcombo',
    initComponent: function() {
        var me = this;

        Ext.apply(me, {
            store: {
                fields: ['id', 'name', 'color'],
                data: syncGroupManager.groupData
            },
            displayField: 'name',
            valueField: 'id',
            queryMode: 'local',
            matchFieldWidth: false,
            forceSelection: true,
            editable: false,
            cls: 'color-combobox',
            tooltip: languageFormat.getLanguage(31711, 'Sync group'),
            tpl: Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                    '<li class="x-boundlist-item color-combobox-item" style="position:relative;padding:0px;height:20px;">',
                    '<div style="position:absolute;width:14px;top:2px;bottom:2px;left:2px;border:1px solid #101418;background-color:{color};" class="sync-{id}">',
                    '</div>',
                    '<div style="position:absolute;left:18px;right:0px;bottom:0px;padding-left:3px;">',
                    '{name}',
                    '</div>',
                    '</li>',
                    '</tpl>'
                    ),
                        displayTpl: Ext.create('Ext.XTemplate', 
                        '<tpl for=".">',
                        '</tpl>'),
            listConfig: {
                width: 88
            },
            listeners: {
                afterrender: function() {
                    var selectedVal = me.getValue();
                    var selectedRec = me.findRecordByValue(selectedVal);

                    if (selectedRec) {
                        me.updateFieldColor(selectedRec);
                    }
                },
                select: function(thisCb, records) {
                    me.updateFieldColor(records[0], true);
                }
            }
        });
        
        me.callParent(arguments);
    },
    updateFieldColor: function(rec, saveGroup) {
        var me = this;

        if (rec) {
            me.inputEl.setStyle({
                'background-color': rec.get('color')
            });
            
            me.inputEl.removeCls(['sync-nogroup', 'sync-groupmix']);
            me.inputEl.addCls('sync-' + rec.get('id'));
            
            if(saveGroup){
                syncGroupManager.setSyncGroup(me.syncType, rec.get('id')); // id is group id
                syncGroupManager.save();
            }
        }
    }
});

/* search autocomplete box */
Ext.define('TCPlus.SearchAutoBox', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.searchautobox',
    emptyText: languageFormat.getLanguage(10102, 'Symbol') + '/' + languageFormat.getLanguage(10101, 'Code'),
    selectOnFocus: true,
    minChars: 1,
    queryMode: 'remote',
    typeAhead: true,
    typeAheadDelay: 200,
    hideTrigger: true,
    enableKeyEvents: true,
    matchFieldWidth: false,
    showListOnFocus: true,
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
            width: searchboxWidth,
            store: {
                fields: [
                    fieldStkCode,
                    fieldStkName,
                    {name: 'stkCode', convert: function(val, rec) {
                            // decode html back
                            return htmlDecode(stockutil.getStockName(rec.get(fieldStkName)));
                        }},
                    {name: 'stockText', convert: function(val, rec) {
                            return stockutil.getStockName(rec.get(fieldStkCode)) + ' (' +
                                    stockutil.getStockName(rec.get(fieldStkName)) + ')';
                        }}
                ]
            },
            valueField: fieldStkCode,
            displayField: fieldStkName,
            listConfig: {
                minWidth: searchboxWidth,
                loadingText: languageFormat.getLanguage(10018, 'Loading'),
                overflowX: "hidden",
                maxHeight: 135
            },
            tpl: Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                    '<div class="x-boundlist-item">{stockText}</div>',
                    '</tpl>'
                    ),
            displayTpl: Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                    '{stkCode}',
                    '</tpl>'
                    )
        });

        Ext.merge(me, {
            listeners: {
                afterrender: function(thisCb) {
                    me.searchTask = new Ext.util.DelayedTask(function() {
                        var comboValue = thisCb.getRawValue().trim();

                        if (comboValue) {
                            if (comboValue != thisCb._textVal || me._forceSearch) { // search only if the text is different from current one
                                me._forceSearch = false;

                                var mkt = null;

                                if (me.market == null) {
                                    mkt = conn.getMarketCode(exchangecode, '[All Stocks]') || 10;
                                } else if (me.market !== 'all') {
                                    mkt = me.market;
                                }
                                
                                var exch = [];
                                if (me.allExch) {
                                    for (var i = 0; i < global_ExchangeList.length; i++) {
                                        exch.push(global_ExchangeList[i].exchange);
                                    }
                                } else {
                                    exch = [exchangecode]; // default to current exchange
                                }

                                conn.searchStock({
                                    ex: me.exch || exch,
                                    k: comboValue,
                                    field05: me.field05 || [fieldStkCode, fieldStkName],
                                    mkt: mkt,
                                    count: N2N_CONFIG.searchRecordCount,
                                    success: function(obj) {
                                        if (obj && obj.d) {
                                            thisCb.store.loadData(obj.d);
                                            
                                            if (obj.d.length > 0) {
                                                thisCb.expand();
                                                if (N2N_CONFIG.searchAutoSelect) {
                                                    thisCb.doAutoSelect(); // doAutoSelect is a private method, just use it :D
                                                }
                                            } else {
                                                thisCb.collapse();
                                            }
                                        }

                                    }
                                });
                            }
                        } else {
                            thisCb.collapse();
                        }

                        thisCb._textVal = comboValue;
                    });

                    // delay 700ms before sending the search request
                    thisCb.on('keyup', function(cb, e) {
                        if (e.getKey() == e.ENTER) {
                            me.searchTask.cancel();
                            me.collapse();
                        } else {
                            if (e.keyCode === e.BACKSPACE || jsutil.isPrintableKey(e.keyCode)) {
                                me.searchTask.delay(700);
                            }
                        }
                    });
                },
                focus: function(thisCb) {
                    if (me.showListOnFocus) {
                        if (me.store.getCount() > 0) { // reopen list when focus
                            me.expand();
                        } else {
                            me.collapse();
                        }
                    }
                }
            }
        });
        
        if (!me.listeners.specialkey) {
            me.listeners.specialkey = function(thisCb, e) {
                if (thisCb._itemSelected) {
                    thisCb._itemSelected = false;
                    return;
                }
                
                if (e.getKey() == e.ENTER) {
                    
                    var sVal = thisCb.getRawValue();
                    if (sVal) {
                        sVal = sVal.trim();

                        if (sVal) {
                            sVal = sVal.trim().toUpperCase() + '.' + (thisCb.exch || exchangecode);

                            conn.getStockInfo({
                                ex: thisCb.exch || exchangecode, //thisCb.exch to specify exchg
                                k: sVal,
                                f: me.field05 || [fieldStkCode, fieldStkName],
                                stkName: true,
                                limit: 1,
                                success: function(obj) {
                                    if (obj && obj.s && obj.d) {
                                        if (typeof me.onSearchEnterKey === 'function') {
                                            thisCb.store.loadData(obj.d);
                                            me.onSearchEnterKey(thisCb.store.data.items);
                                        }
                                    }

                                }
                            });
                        }

                    }
                }
            };
        }
        
        me.callParent(arguments);
    },
    setValue: function() {
        var me = this;

        me.callParent(arguments);

        var val = me.getRawValue();
        if (!val || val.trim() === '') {
            me.store.removeAll(); // clear list
        }
        me._textVal = val;
    },
    search: function() {
        var me = this;

        me._forceSearch = true;
        me.searchTask.delay(100);
    }
});


/* view button */
Ext.define('TCPlus.cardviewbutton', {
    extend: 'Ext.button.Segmented',
    alias: 'widget.cardviewbutton',
    initComponent: function() {
        var me = this;
        
        if (me.grid) {
            me.grid.hasCardView = true;
            // little hack here
            me.grid.isCardView = me.defaultView === 'card';
            
            me.grid.on('afterrender', function() {
                var bodyEl = me.grid.body.el;
                // grid el
                me.grid._gridEl = bodyEl;
                
                if (me.grid.isCardView) {
                    me.grid._gridEl.addCls('init-hidden');
                }
                
                // retrieving top style of body (need to delay to wait for body position to be laid out)
                setTimeout(function() {
                    var top = bodyEl.getStyle('top');

                    // create another container layer for card view
                    me.grid._cardEl = Ext.DomHelper.insertAfter(bodyEl, {tag: 'div', cls: 'cardview', style: 'top:' + top}, true);
                    
                    // hide all views
                    me.grid._cardEl.hide();
                    
                    // set default view
                    me.setView(me.defaultView);
                    
                }, 0);
            });
            
            me.grid.on('destroy', function(){
               
               // manually destroy since card quote is not destroyed together with quote screen
               if(me.grid.cardComp){
                   me.grid.cardComp.destroy(); 
               }
            });
            
            // resize handler for card view
            me.grid.on('resize', function(thisComp, width, height, oldWidth, oldHeight) {
                if (me.grid.cardCt) {
                    me.grid.cardComp.setSize(me.grid.cardCt.getSize());
                }

            });
        }
        
        Ext.applyIf(me, {
            style: 'border-collapse: separate',
            items: [
                {
                    text: languageFormat.getLanguage(20679, 'Grid'),
                    iconCls: 'icon-gridview',
                    tooltip: languageFormat.getLanguage(20676, 'Grid view'),
                    _view: 'grid',
                    pressed: me.defaultView === 'grid',
                    handler: function() {
                        me.switchView(this._view);
                    }
                },
                {
                    text: languageFormat.getLanguage(20680, 'Matrix'),
                    iconCls: 'icon-cardview',
                    tooltip: languageFormat.getLanguage(20677, 'Card view'),
                    _view: 'card',
                    pressed: me.defaultView === 'card',
                    style: 'padding-left: 3px',
                    handler: function() {
                        me.switchView(this._view);
                    }
                }
            ]
        });

        me.callParent(arguments);
    },
    setView: function(view) {
        var me = this;
        
        if (me.grid._view !== view) {
            me.grid._view = view;

            if (view === 'card') {
                if (!me.grid.cardComp) {
                    me.grid.cardComp = Ext.widget('cardquote');
                    // keep grid reference
                    me.grid.cardComp._grid = me.grid;
                    
                    me.grid.cardCt = Ext.widget('container', {
                       items: me.grid.cardComp,
                       layout: 'fit',
                       renderTo: me.grid._cardEl,
                       width: '100%',
                       height: '100%'
                    });
                }
                
                me.grid._cardEl.show();
                me.grid._gridEl.hide();
                me.grid.isCardView = true;
            } else {
                me.grid._gridEl.removeCls('init-hidden');
                
                me.grid._gridEl.show();
                me.grid._cardEl.hide();
                me.grid.isCardView = false;
            }
            
            return true;
        }
        
        return false;
    },
    getView: function() {
        return this.grid._view;
    },
    switchView: function(view) {
        var me = this;

        if (me.setView(view)) {
            if (typeof me.switchViewHandler === 'function') {
                me.switchViewHandler(me, me.grid, me.getView());
            }
        }
        
    }
});

/* card view for Mutual fund. Basically card view in here is like ticker/ an actual card view. */
//Should be nothing happened
Ext.define('TCPlus.cardviewbuttonmf', {
    extend: 'Ext.button.Segmented',
    alias: 'widget.cardviewbuttonmf',
    initComponent: function() {
        var me = this;
        
        if (me.grid) {
            me.grid.hasCardView = true;
            // little hack here
            me.grid.isCardView = me.defaultView === 'card';
            
            me.grid.on('afterrender', function() {
                var bodyEl = me.grid.body.el;
                // grid el
                me.grid._gridEl = bodyEl;
                
                if (me.grid.isCardView) {
                    me.grid._gridEl.addCls('init-hidden');
                }
                
                // retrieving top style of body (need to delay to wait for body position to be laid out)
                setTimeout(function() {
                    var top = bodyEl.getStyle('top');

                    // create another container layer for card view
                    me.grid._cardEl = Ext.DomHelper.insertAfter(bodyEl, {tag: 'div', cls: 'cardview', style: 'top:' + top}, true);
                    
                    // hide all views
                    me.grid._cardEl.hide();
                    
                    // set default view
                    me.setView(me.defaultView);
                    
                }, 0);
            });
            
            me.grid.on('destroy', function(){
               
               // manually destroy since card quote is not destroyed together with quote screen
               if(me.grid.cardComp){
                   me.grid.cardComp.destroy(); 
               }
            });
            
            // resize handler for card view
            me.grid.on('resize', function(thisComp, width, height, oldWidth, oldHeight) {
                if (me.grid.cardCt) {
                    me.grid.cardComp.setSize(me.grid.cardCt.getSize());
                }

            });
        }
        
        Ext.applyIf(me, {
            style: 'border-collapse: separate',
            items: [
                {
                    text: languageFormat.getLanguage(20679, 'Grid'),
                    iconCls: 'icon-gridview',
                    tooltip: languageFormat.getLanguage(20676, 'Grid view'),
                    _view: 'grid',
                    pressed: me.defaultView === 'grid',
                    handler: function() {
                        me.switchView(this._view);
                    }
                },
                {
                    text: languageFormat.getLanguage(33560, 'Card'),
                    iconCls: 'icon-cardview',
                    tooltip: languageFormat.getLanguage(20677, 'Card view'),
                    _view: 'card',
                    pressed: me.defaultView === 'card',
                    style: 'padding-left: 3px',
                    handler: function() {
                        me.switchView(this._view);
                    }
                }
            ]
        });

        me.callParent(arguments);
    },
    setView: function(view) {
        var me = this;
        
        if (me.grid._view !== view) {
            me.grid._view = view;

            if (view === 'card') {
                if (!me.grid.cardComp) {
                    me.grid.cardComp = Ext.widget('cardmfund');
                    // keep grid reference
                    me.grid.cardComp._grid = me.grid;
                    
                    me.grid.cardCt = Ext.widget('container', {
                       items: me.grid.cardComp,
                       hidden: false,
                       layout: 'fit',
                       renderTo: me.grid._cardEl,
                       width: '100%',
                       height: '100%'
                    });
                }
                
                //If filter message is not exist
                me.grid._gridEl.hide();
                me.grid._cardEl.show();
                me.grid.isCardView = true;
            } else {
                me.grid._gridEl.removeCls('init-hidden');
                
                //If filter message is not exist
                me.grid._cardEl.hide();
                me.grid._gridEl.show();
                me.grid.isCardView = false;
            }
            
            return true;
        }
        
        return false;
    },
    getView: function() {
        return this.grid._view;
    },
    //Enable and disable button based on view
    switchView: function(view) {
        var me = this;

        if (me.setView(view)) {
            if (typeof me.switchViewHandler === 'function') {
                me.switchViewHandler(me, me.grid, me.getView());
            }
        }
        
    }
});
/* card view for Mutual fund. Basically card view in here is like ticker/an actual card view. */

/* Free mask, non-blocking load mask */
Ext.define('TCPlus.plugin.FreeMask', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.freemask',
    maskBgColor: '#ce4646',
    init: function(cmp) {
        var me = this;
        me.setCmp(cmp);
        me.maskText = 'Updating...';
        me.imageOnly = true;

        cmp.on({
            afterrender: this.onCmpRender,
            single: true,
            scope: this
        });
    },
    onCmpRender: function() {
        var me = this;
        if (me.disabled) {
            return;
        }
        var cmp = me.getCmp();

        var cmpEl = cmp.getEl();
        me.freeMaskEl = cmpEl.appendChild({
            tag: 'div',
            cls: 'freemask',
            attrs: {
                title: 'Auto updating...'
            },
            style: {
                position: 'absolute',
                height: '20px',
                bottom: '7px',
                left: 0,
                right: 0,
                'z-index': 2,
                width: '100px',
                padding: '3px',
                'text-align': 'center',
                'background-color': 'transparent',
                'margin-left': 'auto',
                'margin-right': 'auto',
                color: '#fff'
            },
            hidden: true
        });

        if (me.imageOnly) {
            me.freeMaskEl.addCls(['icon', 'icon-progress']);
        } else {
            me.freeMaskEl.setStyle('background-color', me.maskBgColor);
        }

        cmp.freeMask = me;

    },
    setMsg: function(msg) {
        var me = this;
        if (me.disabled) {
            return;
        }

        if (me.freeMaskEl) {
            if (msg) {
                me.freeMaskEl.show();
                if (!me.imageOnly) {
                    me.freeMaskEl.setHtml(msg);
                }
            } else {
                me.freeMaskEl.hide();
            }
        }
    }
});
