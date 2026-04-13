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
    derivativePrtfDetails: [],
    equityPrtfDetails: [],
    analysisCharts: [],
    stockNews: [],
    fFlows: [],
    frames: [],
    userReports: {},
    spCapIQItems: {},
    elasticNews: {},
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
                        '?exchg=' + stkParts.exch,
                        'Code=' + stkParts.code,
                        'Name=' + encodeURIComponent(stockutil.getStockName(conf.name)),
                        'View=' + (stockutil.isDelayStock(conf.key) ? 'D' : 'R'),
                        'lang=' + global_Language,
                        'color=' + formatutils.procThemeColor(),
                        'isstock=' + (conf.isIndices ? 'N' : 'Y'),
                        'type=an' + (conf.isIndices ? 'i' : '')
                    ];

                    var teleChartURL = analysisChartFlashURL + params.join('&');
                    msgutil.openURL({
                        url: teleChartURL,
                        name: 'tele_analysis_chart'
                    });
                }
            } else if (!jsutil.isEmpty(stockChartURL) && gifChartExList.indexOf(stkParts.exch) == -1) {
                if (!startup) {
                    var params = [
                        '?exchg=' + stkParts.exch,
                        'Code=' + stkParts.code,
                        'Name=' + encodeURIComponent(stockutil.getStockName(conf.name)),
                        'View=' + (stockutil.isDelayStock(conf.key) ? 'D' : 'R'),
                        'lang=' + global_Language,
                        'color=' + formatutils.procThemeColor(),
                        'isstock=' + (conf.isIndices ? 'N' : 'Y'),
                        'type=an' + (conf.isIndices ? 'i' : '')
                    ];

                    var chartURL = stockChartURL + params.join('&');
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

                    msgutil.info(cnaMsg);
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
    openTheScreener: function(stkcode){
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
                	theScreener = Ext.create('Ext.ux.IFrame', {
                        title: languageFormat.getLanguage(20525, 'TheScreener'),
                        winConfig: getNewsWinConfig(),
                        initMax: true
                    });

                	theScreener.on('beforedestroy', function() {
                        userReport['userReport_thescreener'] = null;
                    });
                    userReport['userReport_thescreener'] = theScreener;
                    n2nLayoutManager.addItem(theScreener);
                }

                n2nLayoutManager.activateItem(theScreener);
                theScreener.refresh(screenerURL);
            }
        }
    },
    openPseEdge: function(stkcode){
    	if (N2N_CONFIG.pseEdgeURL.length > 0) {
            var url = N2N_CONFIG.pseEdgeURL;
            
            if(stkcode){
            	var stkParts = stockutil.getStockParts(stkcode);
            	url = N2N_CONFIG.pseEdgeURL + '?spid=&exchg=' + stkParts.exch + '&stkcode=' + stkcode ;
            }

            if (jsutil.toBoolean(showUISettingItem[2]) && jsutil.toBoolean(global_NewWindow_News)) {
                if (window.name == "_pseEdge")
                    window.name = "";

                msgutil.openURL({
                    url: url,
                    name: '_pseEdge'
                });
            } else {
                var pseEdge = userReport['userReport_pseEdge'];
                if (pseEdge == null) {
                	pseEdge = Ext.create('Ext.ux.IFrame', {
                        title: 'PSE Edge',
                        winConfig: getNewsWinConfig(),
                        initMax: true,
                        style: 'background-color: #fff'
                    });

                	pseEdge.on('beforedestroy', function() {
                        userReport['userReport_pseEdge'] = null;
                    });
                    userReport['userReport_pseEdge'] = pseEdge;
                    n2nLayoutManager.addItem(pseEdge);
                }

                n2nLayoutManager.activateItem(pseEdge);
                pseEdge.refresh(url);
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
        if (helper.activeView(marketDepthMatrixPanel)) {
            mmd = marketDepthMatrixPanel.returnAllMarketDepth();
        }

        mdList = mdList.concat(mmd);

        var normal = [];
        var mdl = [];

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
            }
        }

        if (codeOnly) {
            return {
                normal: jsutil.arrayUnique(normal),
                mdl: jsutil.arrayUnique(mdl)
            };
        } else {
            return {
                normal: normal,
                mdl: mdl
            };
        }

    },
    /**
     * Creates margin financing calculator
     */
    createMFCalc: function(tabCt) {
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

                me.mfCalc = Ext.create('Ext.ux.IFrame', {
                    title: languageFormat.getLanguage(20623, 'Calculator'),
                    winConfig: getNewsWinConfig(),
                    initMax: true,
                    type: 'ec',
                    savingComp: true,
                    ddComp: true
                });

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
            msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
            conf.key = '';
            conf.name = '';
            return;
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
                        stkname: conf.name
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
        
        if (conf && conf.config && conf.config.loadedScreen) {
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
                                iconCls: 'extensive-remove',
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
        if (jsutil.isEmpty(conf.key)) {
            msgutil.alert(languageFormat.getLanguage(30126, 'No stock selected.'));
            return;
        }

        var me = this;

        if (N2N_CONFIG.elasticNewsUrl || N2N_CONFIG.nikkeiNewsUrl) {
            var stkParts = stockutil.getStockParts(conf.key);
            var stkName = stockutil.getStockName(conf.name);
            var elasticURL = '';
            var params = null;

            if(conf.newsOpt == '1'){
            	params = [
            	          'sc=' + stkParts.code,
            	          'ex=' + stkParts.exch,
            	          'spc=' + N2N_CONFIG.fundamentalSponsor,
            	          'bh=' + bhCode,
            	          'appId=' + appId
            	          ];
            	elasticURL = N2N_CONFIG.elasticNewsUrl + '&' + params.join('&');
            }else{
            	params = [
            	          'spc=' + N2N_CONFIG.fundamentalSponsor,
            	          'bh=' + bhCode,
            	          'appId=' + appId
            	          ];
            	elasticURL = N2N_CONFIG.nikkeiNewsUrl + '&' + params.join('&');
            }
            
            console.log('elasticURL -> ', elasticURL);

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
                    elNews = Ext.create('Ext.ux.IFrame', {
                        title: conf.newsOpt == '1' ? languageFormat.getLanguage(20140, 'Elastic News') : languageFormat.getLanguage(21501, 'Nikkei News'),
                        winConfig: getNewsWinConfig(),
                        initMax: true
                    });

                    elNews.on('beforedestroy', function() {
                        me.elasticNews[compName] = null;
                    });
                    me.elasticNews[compName] = elNews;
                    n2nLayoutManager.addItem(elNews);
                }

                n2nLayoutManager.activateItem(elNews);
                elNews.refresh(elasticURL);
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
        var rptUrl = rptSettings.url + '&' + new Date().getTime();
        var rptId = rptSettings.id;
        var slcomp = null;
        switch (rptSettings.url) {
            case webReportClientSummaryURL.split("|")[4]:
                slcomp = "cs";
                break;
            case webReportMonthlyStatementURL.split("|")[4]:
                slcomp = "mst";
                break;
            case webReportMarginAccountSummaryURL.split("|")[4]:
                slcomp = "mas";
                break;
            case webReportTraderDepositReportURL.split("|")[4]:
                slcomp = "td";
                break;
            case webReportTradeBeyondReportURL.split("|")[4]:
                slcomp = "tb";
                break;
            case webReporteContractURL.split("|")[4]:
                slcomp = "c";
                break;
            case webReportAISBeStatementURL.split("|")[4]:
                slcomp = "ai";
                break;
            case webReportMarginPortFolioValuationURL.split("|")[4]:
                slcomp = "mp";
                break;
            case webReportTransactionMovementURL.split("|")[4]:
                slcomp = "tm";
                break;
            case webReportClientTransactionStatementURL.split("|")[4]:
                slcomp = "ct";
                break;
            case webReportStockBalanceURL.split("|")[4]:
                slcomp = "sba";
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
                rpt = Ext.create('Ext.ux.IFrame', {
                    title: rptSettings.title,
                    slcomp: slcomp,
                    winConfig: getNewsWinConfig(),
                    initMax: true
                });

                rpt.on('beforedestroy', function() {
                    me.userReports[rptId] = null;
                });

                me.userReports[rptId] = rpt;
                n2nLayoutManager.addItem(rpt, portlet_col, index);
            }

            n2nLayoutManager.activateItem(rpt);
            rpt.refresh(rptUrl);
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
        var tradeSettingURL = [
            addPath,
            "tcplus/setting?a=set&sc=TCLTDA&p=",
            defTrAccStr
        ].join('');

        cookies.createCookie(loginId + '_defTrAcc', defTrAccStr, 1800);
        cookies.createCookie(loginId + '_defTrAccSync', false, 1800);
        Ext.Ajax.request({
            url: tradeSettingURL,
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
            oh: {
                title: languageFormat.getLanguage(20173, 'Order History')
            },
            ep: {
                title: languageFormat.getLanguage(20262, 'Equities Portfolio')
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
                title: languageFormat.getLanguage(20653, 'Foreign Flows')
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
            ft: {
                title: languageFormat.getLanguage(20126, 'Fundamental (Thomson Reuters)')
            },
            fst: {
                title: languageFormat.getLanguage(20127, 'Fundamental Screener (Thomson Reuters)')
            },
            bki: {
                title: languageFormat.getLanguage(11060, 'Broker Info')
            },
            wi: {
                title: languageFormat.getLanguage(20158, 'World Indices')
            },
            tc: {
                title: languageFormat.getLanguage(31600, 'Trade Calculator')
            }
        };
    },
    skipCodeTitle: ['hn','ft'],
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
                title += ' - ' + stockutil.getStockName(scr.stkname);
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
    openExchangeRateWin: function(){
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
            	erTool = Ext.create('Ext.ux.IFrame', {
                    title: languageFormat.getLanguage(20523, 'Exchange Rate'),
                    slcomp: "ertool",
                    type: 'ertool',
                    ddComp: true,
                    winConfig: getNewsWinConfig(),
                    initMax: true
                });

            	erTool.on('beforedestroy', function () {
                    userReport[ 'userReport_otherTool_ExchangeRate' ] = null;
                });

                n2nLayoutManager.addItem(erTool);
                userReport[ 'userReport_otherTool_ExchangeRate' ] = erTool;
            }

            n2nLayoutManager.activateItem(erTool);
            erTool.refresh(exchangeRateUrl);
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
        icon: icoBtnQuote,
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
                menu: subMenuItems,
                icon: icoBtnWlist
            });
        } else {
            menuItems.push({
                text: languageFormat.getLanguage(20001, 'Watchlist') + ' - ' + watchListArr[0],
                wlName: watchListArr[0],
                icon: icoBtnWlist,
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
            icon: icoBtnStkInfo24,
            handler: function() {
                me.configureHandler.stockInfo(tabId);
            }
        });
    }

    // Tracker
    if (showStkInfoHeader == "TRUE" && showStkInfoTracker == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20024, 'Stock Tracker'),
            icon: icoBtnTracker,
            handler: function() {
                me.configureHandler.tracker(tabId);
            }
        });
    }

    // Historical data
    if (showStkInfoHeader == "TRUE" && N2N_CONFIG.features_HistoricalData) {
        menuItems.push({
            text: languageFormat.getLanguage(20060, 'Historical Data'),
            icon: ICON.HIS_DATA24,
            handler: function() {
                me.configureHandler.historical(tabId);
            }
        });
    }

    // Indices
    if (showMarketIndices == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20029, 'Indices'),
            icon: icoBtnIndices,
            handler: function() {
                me.configureHandler.indices(tabId);
            }
        });
    }

    // Order status
    if (showOrdBookHeader == "TRUE" && showOrdBookOrderSts == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20172, 'Order Status'),
            icon: icoBtnOrdSts,
            handler: function() {
                me.configureHandler.orderStatus(tabId);
            }
        });
    }

    // Derivative Portfolio
    if (showPortFolioHeader == "TRUE" && global_showPortFolioDerivativePortFolio == 'TRUE') {
        menuItems.push({
            text: languageFormat.getLanguage(20263, 'Derivatives Portfolio'),
            icon: icoBtnDPrtFolio,
            handler: function() {
                me.configureHandler.derivativePrtf(tabId);
            }
        });
    }

    // Equity Portfolio
    if (showPortFolioHeader == "TRUE" && showPortFolioMyPortFolio == 'TRUE') {
        menuItems.push({
            text: languageFormat.getLanguage(20262, 'Equities Portfolio'),
            icon: icoBtnPrtFolio,
            handler: function() {
                me.configureHandler.equityPrtf(tabId);
            }
        });
    }

    // Equity Portfolio Realised G/L
    if (showPortFolioHeader == "TRUE" && showPortFolioRealizedGainLoss == 'TRUE') {
        menuItems.push({
            text: languageFormat.getLanguage(20265, 'Realised Gain/Loss'),
            icon: icoBtnPrtFolioRealizedGainLoss,
            handler: function() {
                me.configureHandler.realizedPrtf(tabId);
            }
        });
    }

    // Announcement
    if (n2nLayoutManager.isWindowLayout() && showNewsHeader == "TRUE" && showNewsAnnouncements == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20122, 'Announcements'),
            icon: icoBtnNews,
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
            icon: icoBtnDepth,
            handler: function() {
                me.configureHandler.marketDepth(tabId);
            }
        });
    }

    // Intraday Chart
    if (showChartHeader == "TRUE" && showChartIntradayChart == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20101, 'Intraday Chart'),
            icon: icoBtnIntraChart,
            handler: function() {
                me.configureHandler.intradaychart(tabId);
            }
        });
    }

    // Stock News
    if (showNewsHeader == "TRUE" && showNewsStockNews == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20123, 'Stock News'),
            icon: icoBtnNews,
            handler: function() {
                me.configureHandler.stockNews(tabId);
            }
        });
    }

    // Announcement
    if (showNewsHeader == "TRUE" && showNewsAnnouncements == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20122, 'Announcements'),
            icon: icoBtnNews,
            handler: function() {
                me.configureHandler.announcement(tabId);
            }
        });
    }

    // Market Summary
    if (showMarketHeader == "TRUE" && showMarketSummary == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20050, 'Summary'),
            icon: icoBtnSummary,
            handler: function() {
                me.configureHandler.marketSummary(tabId);
            }
        });
    }

    // Market Streamer
    if (showMarketHeader == "TRUE" && showMarketStreamer == "TRUE") {
        menuItems.push({
            text: languageFormat.getLanguage(20157, 'Streamer'),
            icon: icoBtnStreamer,
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
    orderHistory: function(tabId, conf, tabCt) {
        createOrdHistoryPanel(null, null, conf, tabCt);
        // n2nLayoutManager.saveConfiguredTab(tabId, 'oh');
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
    worldIndices: function(tabId, conf, tabCt) {
        n2ncomponents.createWorldIndices({config: conf}, tabCt);
    },
    tradeCal: function(tabId, conf, tabCt) {
        n2ncomponents.createTradeCal(conf, tabCt);
    },
    factSet: function(tabId, compKey, stkName, conf, tabCt) {
        createFundamentalCPIQWin(compKey);
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
    breakevencalc: function(tabCt) {
        n2ncomponents.createBreakEvenCalc(tabCt);
    },
    externalCalc: function(tabCt){
            n2ncomponents.createMFCalc(tabCt);
    },
    perEPSCalc: function(tabCt){
            var stk = n2nLayoutManager.getActiveRecord();
            if (stk) {
                    n2ncomponents.createPEREPSCalc(stk, tabCt);
            }
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
        case 'oh':
            if (suspendLoad) {
                me.bufferTasks1.push(function() {
                    me.configureHandler.orderHistory(tabId, conf, tabCt);
                });
            } else {
                me.configureHandler.orderHistory(tabId, conf, tabCt);
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
            me.configureHandler.breakevencalc(tabCt);
            break;
        case 'ec':
            me.configureHandler.externalCalc(tabCt);
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
            icon: iconSplitNone,
            text: languageFormat.getLanguage(31115, 'Split none'),
            handler: function() {
                n2nLayoutManager.createSplitScreen(1);
            }
        },
        {
            icon: iconSplitRight,
            text: languageFormat.getLanguage(31116, 'Split in right'),
            handler: function() {
                n2nLayoutManager.createSplitScreen(2);
            }
        },
        {
            icon: iconSplitBottom,
            text: languageFormat.getLanguage(31117, 'Split in bottom'),
            handler: function() {
                n2nLayoutManager.createSplitScreen(3);
            }
        },
        {
            icon: iconSplit4,
            text: languageFormat.getLanguage(31118, 'Split in 4'),
            handler: function() {
                n2nLayoutManager.createSplitScreen(4);
            }
        }
    ];

    return menuItems;
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

        var toastItems = [];

        if (me.imgCls) {
            toastItems.push({
                xtype: 'image',
                imgCls: me.imgCls,
                width: 32,
                height: 32
            });
        }

        toastItems.push({
            html: me.msg || '',
            flex: 1,
            height: '100%',
            style: 'margin-left: 8px;'
        });

        Ext.apply(me, {
            header: false,
            autoShow: true,
            maxWidth: 345,
            layout: 'hbox',
            fadeInDuration: 500,
            fadeOutDuration: 1000,
            constrain: true,
            resizable: false,
            cls: 'toast-box',
            alwaysOnTop: true,
            shadow: false,
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
            },
            items: toastItems
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
