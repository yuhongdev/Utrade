/**
 * Application starts here
 * This file should contain only two parts: global variables and main application codes
 */
/*** Global Variables Section ***/
var isMobile = false; // view (not device)
if (sView == 'mobile') {
    sView = 'm';
    isMobile = true;
} else {
    sView = 'd';
}
var cookieKey = loginId + '_' + N2N_CONFIG.cookieKey + sView;
var vKey = N2N_CONFIG.cookieKey + '_' + loginId;
// cache device status (should check only once)
var isTablet = device.tablet();
var isPhone = device.mobile();
var isDesktop = device.desktop();
var touchMode = isTouchDevices() || isTablet || isPhone;
if(isDesktop){
	touchMode = false;
}

var androidPhone = device.androidPhone();

var currentDeviceKey = sView;
/*
if (isTablet) {
    currentDeviceKey = 'tb';
}
*/

var defFontType = 'Helvetica';
var defFontSize = 12;
var gl_fonttype;
var globalFontSize;
var fontSizeDel = '{';

N2N_CONFIG.trackerTSCol = '54=60,104=25,98=60,99=80,1001=80,1003=80';
N2N_CONFIG.trackerBSCol = '1=60,2=75,3=75,4=75,5=75,6=50,7=50,br=45';
N2N_CONFIG.scoreColId = '37|110|105|106|107|108|111';
N2N_CONFIG.scoreColWidth = '120|61|40|40|40|40|61';
N2N_CONFIG.dpColWidth = '42=25,44=100,nettPosition=75,51=100,52=100,78=90,lastDone=90,155=55,154=55,unrealised=110,82=110,125=110,totalpl=110,95=60,96=60,99=60,100=60,97=60,98=60,111=100,118=100';

if (!N2N_CONFIG.autoQtyRound) {
    N2N_CONFIG.scoreColWidth = '120|90|40|40|40|40|105';
}

if (N2N_CONFIG.ignoreColWidthConf) {
    global_feedColumnID = '01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|30|31|32|33|34|60|35|43|44|45|46|47|48|49|50|51|52|53|54|br|42';
    global_feedWidthKL = '60|90|48|48|53|48|48|48|80|48|48|80|48|30|45|48|55|82|55|35|40|55|60|48|30|40|85|50|55|48|48|80|85|76|60|60|60|65|60|65|65|45|75|60|85|50|160';
     global_feedWidthMY = '60|125|65|65|65|65|65|65|45|65|65|45|65|30|50|50|35|50|45|35|40|55|60|65|30|40|75|50|55|65|65|85|85|72|60|60|60|65|60|65|65|60|75|60|85|50|170';
     global_feedWidthHK = '50|125|60|60|60|60|60|60|80|60|60|80|60|30|50|45|55|80|45|35|40|50|60|60|30|40|85|50|55|60|60|85|85|72|60|60|60|65|60|65|65|60|75|60|85|50|130';
     global_feedWidthSI = '50|120|55|55|55|55|55|55|60|55|55|60|55|30|58|53|65|80|55|35|40|55|60|55|30|40|80|50|55|55|55|85|85|72|60|60|60|65|60|65|65|60|75|60|85|50|160';
     global_feedWidthOth = '45|120|60|60|60|60|60|60|55|60|60|55|60|30|58|53|55|80|55|35|40|50|60|60|30|40|80|50|55|60|60|85|85|72|60|60|60|65|60|65|65|60|75|60|85|50|170';

     global_MDColumnID = 'level|bidtrd|bidcum|bidqty|bidprice|askprice|askqty|askcum|asktrd';
     global_MDWidthKL = '30|35|60|60|50|50|60|60|35';
     global_MDWidthMY = '30|35|45|45|60|60|45|45|35';
     global_MDWidthHK = '30|35|50|50|60|60|50|50|35';
     global_MDWidthOth = '30|35|60|60|60|60|60|60|35';

     global_WLColumnID = '01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|30|31|32|33|34|60|35|43|44|45|46|47|48|49|50|51|52|53|54|br|42';
     global_WLWidth = '60|90|60|60|60|60|60|60|80|60|60|80|60|30|45|45|55|80|55|35|40|50|60|60|30|40|80|50|55|60|60|85|85|72|60|60|60|65|60|65|65|45|75|60|85|50|170';

     global_RQColumnID = '01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|30|31|32|33|34|60|35|43|44|45|46|47|48|49|50|51|52|53|54|br|42';
     global_RQWidth = '60|90|60|60|60|60|60|60|80|60|60|80|60|30|45|45|55|80|55|35|40|50|60|60|30|40|80|50|55|60|60|85|85|72|60|60|60|65|60|65|65|45|75|60|85|50|170';
     
     global_OSColumnID = '01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|35|34|36|37|38|39|42';
     global_OSWidth = '65|157|60|110|60|72|50|50|50|50|60|60|60|60|90|100|70|60|125|60|55|40|60|60|70|80|200|170|55|100|50|60|60|125|60|50|60|60|70|65';

     global_FOSColumnID = '01|02|03|04|05|06|07|08|09|10|11|12|14|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|32|33|35|34|36|37|38|39|42';
     global_FOSWidth = '65|157|60|110|60|72|50|50|50|50|60|70|90|100|70|60|125|60|55|40|60|60|70|80|200|170|100|50|60|60|125|60|50|60|60|70|65';

     global_PFColumnID = '01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28';
     global_PFWidth = '90|65|65|65|75|85|60|65|65|60|60|60|60|60|57|50|58|53|65|65|50|40|65|65|60|60|85|65';

     global_RGLColumnID = '01|02|03|04|05|06|07|08|09|10|11|12|13|14';
     global_RGLWidth = '75|90|85|85|64|64|64|85|64|90|64|50|40|50';
     
     global_MFColumnID = '01|02|03|04|05|06|07|08|09|10|11|12|13|14'; //TODO
     global_MFWidth = '90|140|100|60|100|80|100|100|80|80|80|80|80|100';    //TODO  
}

var isGuestUser = loginId.toLowerCase() == 'guest' || global_IsGuest;
var isCellClick = false;
var macSafari = false;
var pagingMode = false;
var viewInLotMode = false;
var mdSetting = null;

var feedLoginRet;
var feedFilterRet;
var global_ExchangeList = [];
var exchangecode = 'KL';
var fullList = {wl: {}}; // for mapping stock code/symbol (market streamer)
var showExType; // to know which current exchange QC 
var indexCodes = new Array();
var tradeExCodes = new Array();
var viewExCodes = new Array();
var viewExType = new Object();

var activeWatchlistArr = [];
var watchListArr = [];
/* menu */
var tbMenuMarketSummary;
var tbMenuNews;
var tbMenuFund;
var tbMenuOrdSts;
var tbMenuChart;
var tbMenuPortfolio;
var tbMenuOrderPad;
var tbMenuStk;
var tbMenuStkInfo;
var tbMenuMktDepth;
var tbMenuIntraChart;
var tbMenuBuy;
var tbMenuSell;
var tbMenuExchg;
var tbMenuTrackerRecord;
var tbMenuTrker;
var tbMenuSettings;
var tbMenuAnalysiss;
var tbTouchMode;
var tbMenuFEmoChat;
var tbMenuFCalculator;
var tbMenuReports;
var tbMenuOtherTool;
var tbMenuUserGuide; //user guide menu

/* components */
var mainPanel;
var contentPanel;
var sContentPanel;
var sContentPanelColumn;
var lContentPanel;
var lContentPanelColumn;

var marketMoverPanel;
var searchPanel;
var topPanelBarPanel;
var marketDepthPanel;
var orderStatusPanel;
var mfOrderStatusPanel;
var basketOrderPanel;
var scoreboardPanel;
var indicesPanel;
var stkInfoPanel;
var trackerPanel;
var analysisChartPanel;
var derivativePrtfPanel;
var equityPrtfPanel;
var mfEquityPrtfPanel;
var cfdHoldingsPanel;
var equityManualPrtfPanel;
var equityPrtfRealizedPanel;
var reportsCSummry;
var reportsMStatemnt;
var reportsMASummry;
var userReport = {};
var newsReport = {};
var optPanel;
var disclaimerPanel;
var portfolioSaving = true;

var marketMoverPanels;
var marketDepthPanels = [];
var chartPanels;
var analysisChartPanels;
var stkNewsPanels;
var newsContentPanels;
var stkInfoPanels;
var trackerPanels;
var derivativePrtfDetails;
var equityPrtfDetails;

var n2nLayoutManager;
var mainMenuBar;
var topPanelBar = null;
var n2nTicker;
// portal column references
var portalcol_top = null;
var portalcol_2 = null;
var portalcol_3 = null;
var portalcol_4 = null;
// component references
var quoteScreen;
var mutualFund;
var newMarketDepth;
var marketDepthMatrixPanel;
var marketOverviewPanel = null;
var indices = null;
var scoreBoard = null;
var newsPanel = null;
var orderPad = null;
var orderHistoryPanel;
var mfOrderHistoryPanel;
var orderLogPanel = null;
var ordDetailPanel = null;
var portlet_orderPad = null;
var marketStreamer = null;

/* other */
var retryCount = 0;
var firsttimeportfolio = true;
var idleWin;
var currentWidth = 1000;
var currentHeight = 768;
var colRDTooltip;
var tLoadMask_MainPage = null;
var isAliveTimer = 0;
var isFirst = true;
var isAlive = null;
var showOrderPadWin = 0;
var orderWin = null;
var callOrdPadTaskID;
var callMarketDepthTaskID;
var activeOrder = null;
var tempStockRecord = null;
var closedMarketDepth = false;
var closedOrderPad = false;
var onRefreshBrowser = false;
var preload_image;
var preload_url;
var menuOverflow = true;
var menuAutoScroll = false;
var searchboxWidth = 90;
var emptySearchText = 'Please key in your search text';
var toolbarHeight = null;
var priceAlert = null;
var saveLayoutATP;
var gl_up = "", gl_down = "", gl_unchg = "", gl_yel = "", gl_alter = "0";
var up_w = "", down_w = "", unchg_w = "", yel_w = "";
var up_b = "", down_b = "", unchg_b = "", yel_b = "";
var firstRunMD = true;
var firstRunSaving = true;
var winAlwaysOnTop = device.android(); // to sovle issue on Android browser
var screenSet = false;
var defTrAccConf;
var isAutoWidth = false;
var trackerRecord;
N2N_CONFIG.dateFormat = 'd/m/Y';
N2N_CONFIG.timeFormat = 'H:i:s';
N2N_CONFIG.timeFormat2 = 'g:i:s A'; // For historical data
N2N_CONFIG.newsDateTimeFormat = 'd M Y';
N2N_CONFIG.qtyFormat = '0,000';
N2N_CONFIG.roundQtyReg = /^\d{1,3}(,?\d{3})*(\.\d{1,2})?[KMB]{0,1}$/i; // begin with at least 1 digit, with optional . and at least one digit, and end with optional only one K or M or B
N2N_CONFIG.roundNegQtyReg = /^-?\d{1,3}(,?\d{3})*(\.\d{1,2})?[KMB]{0,1}$/i;
N2N_CONFIG.qtyReg = /^\d+$/i;
N2N_CONFIG.negQtyReg = /^-?\d+$/i;
N2N_CONFIG.equitiesTrackerURL = equitiesTrackerURL;
N2N_CONFIG.minViewWidth = 900; // for some components to display one or two sides of data 
// Layout constants
var APP_LAYOUT = new Object();
APP_LAYOUT.PORTAL = '1';
APP_LAYOUT.WINDOW = '2';
APP_LAYOUT.TAB = '3';
// Menu types
var MENU_TYPE = {
    DEFAULT: '0',
    METRO: '1',
    TOOL: '2'
};
// Layout open
var layoutOpen = {
    TAB: '0',
    POPUP: '1'
};
var mhPadding = 0; // menu height padding
var UI = {
    exchWidth: 140,
    matchFieldWidth: false,
    titleSeparator: ' - '
};
// datetime format for news
/* merged */
var global_AccountSeparator = '~';
isStockChart = false;
var global_DynamicLimitList = new Array();
global_dynamicLimitSetting = global_dynamicLimitSetting || '0';

var global_s1FAValidate = false;
var haveE2EEParams = false;
var global_ordPadWidth = 0;
var fmx, fmx0, ofmx;
var priceDec = setOrderBookDP.split('|')[0];

var trackerPullInterval = 10000;
var trackerStopPushExchange = '';
var pushTrackerUpdate = true;

var exchangeRate = null;
var global_isCUTAcc = false;
var global_isWarrantList = new Array();
var streaming = true; // streaming status
var ddCompGroup = 'ddComp';
var pinReg = /^\d{6}$/;

var userPreference, layoutPreference, streamerPreference, calPreference, MFundPreference, sumFontColorReader;
var n2nStorage;
var mappedNames = {}; // deprecate
var mappedList = {};

var recentQuotePrfr;
var recentQuotePanel;

var global_MappedKeys;
var global_OrderSource = '';
var mboxModal = true;
var reorderMenu = N2N_CONFIG.reorderMenu;
var global_TPMapping = [];
var streamerExchArr = [];
var portfolioExcludePayment = [];
var orderbookExcludePayment = [];
var overwriteMDManager = null;
var forcingMDManager = null;
var userFitToScreen = N2N_CONFIG.fitToScreenDefVal;
var appMsg = null;

//Mutual fund section for usability
var MFClientLogin = [];
var OMSClientInfo = atpOMSID.obj["d"];
for(i=0;i<OMSClientInfo.length;i++){
    
    switch(i) {
        case 0:
            MFClientLogin["BrokerCode"] = OMSClientInfo[i];
            break;
        case 1:
            MFClientLogin["LoginID"] = OMSClientInfo[i];
            break;
        case 2:
            MFClientLogin["RiskScoreVal"] = OMSClientInfo[i];
            break;
        default:
            MFClientLogin[i] = OMSClientInfo[i];
    }
}

/*** End of Global Variables Section ***/

delete Ext.tip.Tip.prototype.minWidth;
/*** Application Section ***/
Ext.Loader.setConfig({
    enabled: true
});

/* fix backspace key issue */
var stopBackSpace = function(e, t) {
    if (e.getKey() == e.BACKSPACE && (!/^input$/i.test(t.tagName) || t.disabled || t.readOnly)) {
        e.stopEvent();
    }
};
/*
 Ext.EventManager.on(window, 'keydown', function(e, t) {
 stopBackSpace(e, t);
 });
 Ext.EventManager.on(window.top, 'keydown', function(e, t) {
 stopBackSpace(e, t);
 });
 */

document.onkeypress = function(evt) {
    focusManager.focusComponent(evt);
};
window.parent.onkeypress = function(evt) {
    focusManager.focusComponent(evt);
};

document.onkeyup = function(evt) {
    focusManager.navComponent(evt);
};

Ext.Loader.setPath('Ext.ux', 'js/lib/extjs/plugins');
Ext.Loader.setPath('Ext.app', 'js/app');
Ext.Ajax.defaultHeaders = {
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'Pragma': 'no-cache'
};
Ext.require([
    'Ext.grid.Panel',
    'Ext.panel.Panel',
    'Ext.toolbar.Toolbar',
    'Ext.button.Button',
    'Ext.ux.IFrame',
    'Ext.ux.colorpicker.ColorPickerField',
    'Ext.chart.*',
    'Ext.tip.QuickTipManager',
    'Ext.ux.BoxReorderer',
    'Ext.grid.plugin.CellEditing'
]);

var t2, t3, t4, t6;
var appCtrl = [
        'QuoteScreen', 'WatchList', 'Indices', 'MarketDepth', 'ScoreBoard',
        'StockInfo', 'GeneralNews', 'QuoteCharts',
        'Order', 'OrderStatus', 'BasketOrder', 'Portfolio',
        'other'
    ];

if (!isBasicVer) {
    appCtrl.push('settings');
    appCtrl.push('Market'); // market streamer
    appCtrl.push('quote.CHistoricalData');
}

Ext.application({
    requires: [
        'Ext.app.N2NLayoutManager'
    ],
    name: 'TCPlus',
    appFolder: 'js/app',
    controllers: appCtrl,
    launch: function() {
        if (N2N_CONFIG.useAppMsg) {
            appMsg = Ext.get('appmsg');
        }
        
        // fix menu touch and scrolling issue on Chrome on Windows 10
        if (Ext.isChrome && Ext.supports.Touch && Ext.is.Desktop) {
            Ext.supports.TouchEvents = false;
            Ext.supports.touchScroll = 0;
            reorderMenu = false; // disable reorder menu since it's with interfering touch events
        }
        
        debugutil.debug('TCPlus starting');
        if (N2N_CONFIG.lDebug) {
            t2 = new Date().getTime();
            console.log('script loaded in ', (new Date().getTime() - t1) / 1000, 's');
        }
        
        /*========== checking and fixes ==========*/
        var appBody = Ext.getBody();
        // Checks IE version
        // Supports IE>=11
        if (Ext.isIE && Ext.ieVersion < 11) {
            var pageLoader = Ext.get('page-loader');
            if (pageLoader !== null) {
                pageLoader.remove();
            }

            appBody.setHtml('<div style="position: absolute; left:20%; top: 45%; background-color: #ffa; font-size: 1.1em; padding: 5px;">' + languageFormat.getLanguage(31101, '<b>Attention:</b> You are using IE version which is not supported by this application.' + '<br/> Please upgrade your browser or we recommend to use Chrome or Firefox.<br/>') + '</div>');
            return;
        }
        
        // fix grid locked line issue for android browser
        if (winAlwaysOnTop) {
            appBody.addCls('fix_android');
        }
        if (touchMode) {
            appBody.addCls('touchmode');
        }

        var pageLoader = Ext.get('page-loader');
        if (pageLoader !== null) {
            pageLoader.remove();
        }
        var apprevision = Ext.get('apprevision');
        if (apprevision != null) {
            apprevision.remove();
        }
        
        Ext.BLANK_IMAGE_URL = 'js/lib/extjs/themes/ext-theme-classic/resources/images/tree/s.gif';
        Ext.tip.QuickTipManager.init();
         Ext.override(Ext.MessageBox.buttonText, {
            ok: languageFormat.getLanguage(10036, 'OK'),
            cancel: languageFormat.getLanguage(10010, 'Cancel')
        });

        Ext.override(Ext.grid.header.Container, {
            sortAscText: languageFormat.getLanguage(10046, 'Sort by Ascending'),
            sortDescText: languageFormat.getLanguage(10047, 'Sort by Descending'),
            columnsText: languageFormat.getLanguage(10005, 'Columns')
        });
        
        // daterange vtype
        Ext.apply(Ext.form.field.VTypes, {
            daterange: function(val, field) {
                var date = field.parseDate(val);

                if (!date) {
                    return false;
                }

                if (field.startDateField) {
                    var start = field.startDateField;
                    if (!start.maxValue || (date.getTime() != start.maxValue.getTime())) {
                        start.setMaxValue(date);
                        start.validate();
                    }
                } else if (field.endDateField) {
                    var end = field.endDateField;
                    if (!end.minValue || (date.getTime() != end.minValue.getTime())) {
                        end.setMinValue(date);
                        end.validate();
                    }
                }

                /*
                 * Always return true since we're only using this vtype to set the
                 * min/max allowed values (these are tested for after the vtype test)
                 */
                return true;
            },
            // common VType for KMB
            roundQtyCommon: function (val, field) {
                //Only PH so don't need to check exch
                return N2N_CONFIG.roundQtyReg.test(val);
            },
            roundQtyCommonText: languageFormat.getLanguage(30244, 'Please input a valid quantity. You can use K, M, B with maximum 2 decimals. \neg. 1.55K'),
            roundQtyCommonMask: /[0-9.\-KMB]/i
        });
        
        
        if (Ext.isFirefox) {
            mboxModal = false;
        }

        /*========== clean and format config ==========*/
        streamerExchArr = N2N_CONFIG.streamerExch.split(',');
        N2N_CONFIG.streamerGridWidth = parseInt(N2N_CONFIG.streamerGridWidth);
        portfolioExcludePayment = N2N_CONFIG.portfolioExcludePayment.split(',');
        orderbookExcludePayment = N2N_CONFIG.orderbookExcludePayment.split(',');
        N2N_CONFIG.calcURL = N2N_CONFIG.calcURL.trim();
        N2N_CONFIG.announcement = jsutil.toBoolean(showNewsHeader) && jsutil.toBoolean(showNewsAnnouncements);
        N2N_CONFIG.mktSummary = jsutil.toBoolean(showMarketHeader) && jsutil.toBoolean(showMarketSummary);
        N2N_CONFIG.features_BrokerQ = N2N_CONFIG.stockInfo_BrokerQ || N2N_CONFIG.features_Analysis_BrokerQueue;
        // convert to array
        N2N_CONFIG.nonTradeMsgExch = N2N_CONFIG.nonTradeMsgExch.split(',');
        N2N_CONFIG.forcedNonDelayedExch = N2N_CONFIG.forcedNonDelayedExch.split(',');
        userMarketDepthInfoBar = jsutil.toBoolean(userMarketDepthInfoBar);
        N2N_CONFIG.exchDisclaimerList = N2N_CONFIG.exchDisclaimerList.split(',');
        N2N_CONFIG.exchDisclaimerFile = N2N_CONFIG.exchDisclaimerFile.split('|');
        N2N_CONFIG.orderPadExchangeIdss = N2N_CONFIG.orderPadExchgIdss.split(",");
        N2N_CONFIG.orderPadBoardIdss = N2N_CONFIG.orderPadBoardIdss.split(",");
        N2N_CONFIG.exchOrder = N2N_CONFIG.exchOrder.split(',');
        N2N_CONFIG.trackerInfoFid = N2N_CONFIG.trackerInfoFid.toLowerCase();
        
        if (N2N_CONFIG.tradeCalExtraField) {
            N2N_CONFIG.tradeCalExtraField = N2N_CONFIG.tradeCalExtraField.toLowerCase().split(',');
        } else {
            N2N_CONFIG.tradeCalExtraField = []; // make sure it's used as array (emtpy string also fine)
        }
        
        searchKey = searchKey.trim();
        N2N_CONFIG.reloginURL = formatUrl(N2N_CONFIG.reloginURL);
        if (vertxAutoConnect != '' || vertxAutoConnect != '0') {
            vertxAutoConnect = parseInt(vertxAutoConnect);
        } else {
            vertxAutoConnect = false;
        }
        if (vertxAutoRetry != "") {
            vertxAutoRetry = parseInt(vertxAutoRetry);
        } else {
            vertxAutoRetry = 3;
        }
        // Stock chart
        if (stockChartURL != '') {
            stockChartURL = formatUrl(stockChartURL);
        }
        if (embeddedStockChartURL != '') {
            isStockChart = true;
            embeddedStockChartURL = formatUrl(embeddedStockChartURL);
        }
        
        if (trackerUpdate.length > 0) {
            trackerPullInterval = trackerUpdate.split('|');
            trackerStopPushExchange = trackerPullInterval[0].split(',');
            trackerPullInterval = trackerPullInterval[1];
        }
        
        // Switch view
        switchView = configutil.getDefaultTrueConfig(switchView);
        
        layoutProfileManager.init();
        
        /*========== overwrite config ==========*/
        if (isMobile) {
            // Market mover column setting
            global_FeedAllColumn = global_MbFeedAllColumn;
            global_FeedDefaultColumn = global_MbFeedDefaultColumn;
            // Watchlist column setting
            global_WLAllColumn = global_MbWLAllColumn;
            global_WLDefaultColumn = global_MbWLDefaultColumn;
            // Recentqoute column setting
            global_RQAllColumn = global_MbRQAllColumn;
            global_RQDefaultColumn = global_MbRQDefaultColumn;
            // portofolio
            global_PFAllColumn = global_MbPFAllColumn;
            global_PFDefaultColumn = global_MbPFDefaultColumn;
            // fund portofolio
            global_FPAllColumn = global_MbFPAllColumn;
            global_FPDefaultColumn = global_MbFPDefaultColumn;
            // Realized portfolio column setting
            global_RGLAllColumn = global_MbRGLAllColumn;
            global_RGLDefaultColumn = global_MbRGLDefaultColumn;
            // global_OSAllColumn = global_MbOSAllColumn;
            global_OSDefaultColumn = global_MbOSDefaultColumn;
            // marketDepthCol = "01~04~05~06~07,normal,8ACFAB,F296E1,349E9E,105922,f50a16";
            marketDepthGradient = "normal";
            emptySearchText = '';
            toolbarHeight = 30;
            UI.exchWidth = 80;
            UI.matchFieldWidth = false;

//            showWebReportHeader = 'FALSE';
            global_TrackerRecord = 'FALSE';
            showSettingStockAlert = 'FALSE';
            showSettingAddStockAlert = 'FALSE';
            N2N_CONFIG.featuresSetting_AddStockAlert = false;
            showSettingPersonalizationTheme = 'FALSE';
            showUnitHeader = 'FALSE';
            N2N_CONFIG.features_HistoricalData = false;
            showMarketStreamer = 'FALSE';
            showTickerSetting = 'FALSE';
            showStkInfoMarketMatrixDepth = 'FALSE';
            //global_showPortFolioManualPortFolio = 'FALSE';
            global_showMigratedPortFolioHeader = 'FALSE';
            showOrdBookOrderHistory = 'FALSE';
            showOrdBookOrderLog = 'FALSE';
            showSettingStockAlert = 'FALSE';
            global_showFullScreen = 'FALSE';
            // showPortFolioDetailUpdate = 'FALSE';
            //showPortFolioDetailDelete = 'FALSE';
            // Fundamental news
            //N2N_CONFIG.featuresNews_FundamentalCPIQ = N2N_CONFIG.mbFeaturesNews_FundamentalCPIQ;
            N2N_CONFIG.featuresNews_FundamentalThomsonReuters = N2N_CONFIG.mbFeaturesNews_FundamentalThomsonReuters;
            //N2N_CONFIG.featuresNews_FundamentalScreenerCPIQ = N2N_CONFIG.mbFeaturesNews_FundamentalScreenerCPIQ;
            N2N_CONFIG.featuresNews_FundamentalScreenerThomsonReuters = N2N_CONFIG.mbFeaturesNews_FundamentalScreenerThomsonReuters;

            Ext.override(Ext.button.Button, {
                arrowCls: ''
            });

            // Disable drag and drop on order pad on touch mode
            if (touchMode) {
                enableOrdPadDD = 'FALSE';
            }

            /* use back menuOverflow since it is hacked in fix.js */
            // menuOverflow = false;
            // menuAutoScroll = true;

            // increases all column widths by 8px
            global_feedWidthKL = stockutil.adjustColumnWidthConfig(global_feedWidthKL, 8);
            global_feedWidthMY = stockutil.adjustColumnWidthConfig(global_feedWidthMY, 8);
            global_feedWidthHK = stockutil.adjustColumnWidthConfig(global_feedWidthHK, 8);
            global_feedWidthSI = stockutil.adjustColumnWidthConfig(global_feedWidthSI, 8);
            global_feedWidthOth = stockutil.adjustColumnWidthConfig(global_feedWidthOth, 8);
            global_WLWidth = stockutil.adjustColumnWidthConfig(global_WLWidth, 8);
            global_RQWidth = stockutil.adjustColumnWidthConfig(global_RQWidth, 8);
            global_OSWidth = stockutil.adjustColumnWidthConfig(global_OSWidth, 8);
            global_PFWidth = stockutil.adjustColumnWidthConfig(global_PFWidth, 8);
            global_RGLWidth = stockutil.adjustColumnWidthConfig(global_RGLWidth, 8);
            
            N2N_CONFIG.scoreColWidth = stockutil.adjustColumnWidthConfig(N2N_CONFIG.scoreColWidth, 8);

            global_NewWindow_News = 'FALSE'; //force to open inside in mobile
        	global_NewWindow_Report = 'FALSE'; //force to open inside in mobile
            
            // disable dragging row
            N2N_CONFIG.ddComp = false;
            
            N2N_CONFIG.cardViewButton = false;
            // disable auto width/fit button
            // N2N_CONFIG.autoWidthButton = false;
        } else {
            N2N_CONFIG.menuProfile = false;
            // Disable SP Cap IQ for desktop
            N2N_CONFIG.mbFeaturesNews_SPCapIQ = false;

            if (N2N_CONFIG.portalColumns > 4) {
                // maximum number of portal column is 4
                N2N_CONFIG.portalColumns = 4;
            }
        }
        
        if (touchMode) {
            // use single click for touch mode
            N2N_CONFIG.singleClickMode = true;

            // remove sticky hover class issue on touch
            Ext.override(Ext.button.Button, {
                overCls: ''
            });
        }
        
        if (isMobile) {
            // N2N_CONFIG.singleClickMode = false; // allowed single click mode for mobile (Susan feedback 05-06-2015)
        }
        
        if (isBasicVer || isGuestUser) {
            marketDepthCol = "01~04~05~06~07,normal,8ACFAB,F296E1,349E9E,105922,f50a16";
            marketDepthGradient = "normal";
            
            showUISetting = 'FALSE';
            showLanguageMenu = 'FALSE';
            var colStr = '01~02~03~07~08~09~10~11~12~13~15~18~24~22';
            global_FeedAllColumn = colStr;
            global_FeedDefaultColumn = colStr;
            global_WLAllColumn = colStr;
            global_WLDefaultColumn = colStr;
            global_RQAllColumn = colStr;
            global_RQDefaultColumn = colStr;
            N2N_CONFIG.confDRSearchAcc = false;
            showStkInfoMarketMatrixDepth = 'FALSE';
            N2N_CONFIG.features_Tracker_3Pies = false;
            N2N_CONFIG.features_HistoricalData = false;
            N2N_CONFIG.featuresNews_FundamentalCPIQ = false;
            N2N_CONFIG.featuresNews_FundamentalThomsonReuters = false;
            N2N_CONFIG.featuresNews_FundamentalScreenerCPIQ = false;
            N2N_CONFIG.features_Analysis = false;
            showMarketStreamer = 'FALSE';
            global_TrackerRecord = 'FALSE';
            N2N_CONFIG.ordBookAmal = false;
            N2N_CONFIG.brokerInfo = false;
            N2N_CONFIG.worldIndices = false;
            showSettingHeader = 'FALSE';
            N2N_CONFIG.features_Calculator = false;
            N2N_CONFIG.enableLayoutProfile = false;
            N2N_CONFIG.configScreen = false;
            showSettingHeader = 'FALSE';
            showSettingStockAlert = 'FALSE';
            N2N_CONFIG.featuresSetting_AddStockAlert = false;
            settingSMSStockAlertURL = '';
            N2N_CONFIG.syncScreen = false;
            global_NewWindow_News = 'FALSE';
            global_NewWindow_Report = 'FALSE';
            global_showOtherToolHeader = 'FALSE';
            N2N_CONFIG.orderPadBasic = false;
            showMDColButton = 'FALSE';
            N2N_CONFIG.recentQuote = false;
            showForeignFlows = 'FALSE';
            N2N_CONFIG.elasticNewsUrl = '';
            N2N_CONFIG.featuresNews_Archive = false;
            N2N_CONFIG.pseEdgeURL = '';
            N2N_CONFIG.nikkeiNewsUrl = '';
            N2N_CONFIG.enableHKMapping = false;
            
            if (isBasicVer) {
                N2N_CONFIG.autoQtyRound = false;
            }

            if (isGuestUser) {
                global_logoutButton = 'FALSE';
                showWatchListHeader = 'FALSE';
                showBuySellHeader = 'FALSE';
                showOrdBookHeader = 'FALSE';
                showWebReportHeader = 'FALSE';
                showPortFolioHeader = 'FALSE';
                // service menu
                N2N_CONFIG.otherMenuName = '';
                N2N_CONFIG.streamOpt = false;
                N2N_CONFIG.useEditButton = false;
                showSettlementHeader = false;
                N2N_CONFIG.enableUserPreference = false;
                N2N_CONFIG.menuProfile = false;
                switchView = false;
                
                // enforce guest vertx feed if enabled
                if (guestVertxFeed) {
                    vertxfeed = guestVertxFeed;
                }
                
                // enforce guest exchanges
                arExMapping = null;
                isLMS = false;
                bypassMYAccChecking = 'TRUE';
                confViewEx = N2N_CONFIG.guestEx;
            }
        }
        
        // init main context menu
        mainContextMenu.init();
        // init mutual fund context menu
        mutualFundMenu.init();
                
        // split config to array
        var boardArr = N2N_CONFIG.quickSearchExcludeBoards.split(',');
        N2N_CONFIG.quickSearchExcludeBoards = [];
        for (var i = 0; i < boardArr.length; i++) {
            if (boardArr[i].trim() && !isNaN(boardArr[i])) {
                N2N_CONFIG.quickSearchExcludeBoards.push(parseInt(boardArr[i]));
            }
        }
        
        userPreference = new UserPreference(N2N_CONFIG.userPrf, N2N_CONFIG.enableUserPreference, addPath + 'tcplus/setting?a=set&sc=TCLUPRF', 'p');
        calPreference = new UserPreference(N2N_CONFIG.calPrf, true, addPath + 'tcplus/setting?a=set&sc=TCLTCAL', 'p');
        MFundPreference = new UserPreference(N2N_CONFIG.mutualFundPrf, true, addPath + 'tcplus/setting?a=set&sc=TCLMFUND', 'p');

        streamerPreference = new UserPreference(N2N_CONFIG.streamerPrf, true, addPath + 'tcplus/setting?a=set&sc=TCLSRPF', 'p');
        
        if (N2N_CONFIG.fitToScreen) {
            userFitToScreen = jsutil.toBoolean(userPreference.get('fitts', N2N_CONFIG.fitToScreenDefVal));
        }
        
        sumFontColorReader = new ConfigReader(N2N_CONFIG.sumFontColor);
        if (sumFontColorReader.get('up')) {
            changeClsStyle(".summary-bar .color-up", "color:" + sumFontColorReader.get('up') + " !important;");
        }
        if (sumFontColorReader.get('down')) {
            changeClsStyle(".summary-bar .color-down", "color:" + sumFontColorReader.get('down') + " !important;");
        }
        if (sumFontColorReader.get('unchg')) {
            changeClsStyle(".summary-bar .color-unchange", "color:" + sumFontColorReader.get('unchg') + " !important;");
        }
        
        if (layoutProfileManager.getMainLayout() !== APP_LAYOUT.WINDOW) {
            N2N_CONFIG.defLayoutProfiles = {};
            N2N_CONFIG.syncScreen = false;
        }
        
        n2nStorage = new N2NStorage(cookieKey);
        
        if(N2N_CONFIG.enableHKMapping){
        	global_MappedKeys = keyMapUtil.loadHotKeys();
        	var hksts = userPreference.get('hksts');
        	if(hksts){
        		if(hksts == '0')
        			keyMapUtil.disable();
        	}else{
        		if(!N2N_CONFIG.hotKeysStatus){
        			keyMapUtil.disable();
        		}
        	}
        }

		if (N2N_CONFIG.recentQuote) {
            recentQuotePrfr = new RecentQuote(N2N_CONFIG.recentQuoteList);
            recentQuotePrfr.setComp(N2N_CONFIG.recentComp);
            autoSaveManager.add(recentQuotePrfr);
        }
        
        autoSaveManager.add(columnWidthSaveManager);
        autoSaveManager.start();
        
        if (N2N_CONFIG.syncScreen) {
            syncGroupManager.init();
        }
        
        overwriteMDManager = new MDConfManager(N2N_CONFIG.overwriteMD);
        forcingMDManager = new MDConfManager(N2N_CONFIG.forcingMD);
        
        if (!jsutil.isEmpty(accRet)) {
            if (!isDealerRemisier) {
                // trade setting is enabled only when there is trading account
                N2N_CONFIG.tradeSetting = N2N_CONFIG.tradeSetting && accRet.ai.length > 0;
            }
        } else {
            // trade setting is disabled if no trading account
            N2N_CONFIG.tradeSetting = false;
        }
        // default trading account
        N2N_CONFIG.defTradeAccFeature = N2N_CONFIG.tradeSetting && N2N_CONFIG.defTradeAccFeature;
        // trading account order setting
        N2N_CONFIG.tradeAccOrder = N2N_CONFIG.tradeSetting && N2N_CONFIG.tradeAccOrder && !isDealerRemisier; // apply to retailer account only

        if (N2N_CONFIG.defTradeAccFeature) {
            if (cookies.readCookie(loginId + '_defTrAccSync') == 'false') {
                N2N_CONFIG.defTrAcc = cookies.readCookie(loginId + '_defTrAcc') || '';
                defTrAccConf = new DefaultTradingAccountConfig(N2N_CONFIG.defTrAcc);
                n2ncomponents.requestSaveDefaultTradingAccountSetting();
            } else {
                defTrAccConf = new DefaultTradingAccountConfig(N2N_CONFIG.defTrAcc);
            }
        }
        if (N2N_CONFIG.tradeAccOrder) {
            N2N_CONFIG.trAccOrdArr = N2N_CONFIG.trAccOrd.split(',');
            n2ncomponents.updateAccountListIndex(N2N_CONFIG.trAccOrdArr, false);
            // sorts account list by index
            accRet.ai.sort(jsutil.getArraySorter('index'));
        }
        
        var lastLayoutNotSynced = n2nStorage.get('layoutSync') === 'false';
        
        /*
        try {
            if (!N2N_CONFIG.saveMappedNames || lastLayoutNotSynced) {
                mappedNames = Ext.decode(n2nStorage.get('mappedNames', '{}'));
            } else {
                if (isTablet) { // use mapped name for tablet
                    N2N_CONFIG.mappedNames = N2N_CONFIG.mappedNames_T;
                }
                if (N2N_CONFIG.mappedNames) {
                    mappedNames = Ext.decode(N2N_CONFIG.mappedNames);
                }
            }
        } catch (e) {
            console.log('error decoding mapped names -> ', e);
        }
        
        if (!mappedNames) {
            mappedNames = {};
        }
        */
        
        // layout
        if (lastLayoutNotSynced) {
            var cacheLayout = n2nStorage.get('layout', '');
            if (cacheLayout) {
            if (isTablet) {
                    N2N_CONFIG.tbMainLayout = cacheLayout;
            } else {
                    N2N_CONFIG.mainLayout = cacheLayout;
            }
            }
            n2ncomponents.requestSaveLayout();
        }
        if (isTablet) {
            // N2N_CONFIG.mainLayout = N2N_CONFIG.tbMainLayout;
        }
        
        fontSaving = fontSaving.split(',');
        for (var i = 0; i < fontSaving.length; i++) {
            var fontItem = fontSaving[i].split("_");
            if (fontItem[0] == "ft") {
                var fontSet = fontSaving[i].substring(fontSaving[i].indexOf("_") + 1);
                var fontSetArr = fontSet.split(fontSizeDel);
                gl_fonttype = fontSetArr[0];
                globalFontSize = fontSetArr[1];
            }
            
            if (fontItem[0] == "fcl") {
                up_w = fontItem[1].split("~")[1];
                up_b = fontItem[1].split("~")[2];
                down_w = fontItem[2].split("~")[1];
                down_b = fontItem[2].split("~")[2];
                unchg_w = fontItem[3].split("~")[1];
                unchg_b = fontItem[3].split("~")[2];
                yel_w = fontItem[4].split("~")[1];
                yel_b = fontItem[4].split("~")[2];
                if (global_personalizationTheme.indexOf("black") == -1) {
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
            if (fontItem[0] == "alter" && fontItem[1]) {
                gl_alter = fontItem[1];
            }
        }
        
        if (jsutil.toBoolean(showUISettingItem[6]) && !isMobile && fontTypeItemsArr.length > 0) {
            // check whether current font exists in the list
            var fontExisted = false;
            for (var i = 0; i < fontTypeItemsArr.length; i++) {
                var fontRec = fontTypeItemsArr[i];
                if (fontRec.font === gl_fonttype) {
                    fontExisted = true;
                    break;
                }
            }

            if (!fontExisted) { // if not exist, use the first one
                gl_fonttype = fontTypeItemsArr[0].font;
            }
        }

        if (isNaN(globalFontSize)) {
            globalFontSize = defFontSize;
        }
        if (!gl_fonttype) {
            gl_fonttype = defFontType;
        }
        
        var lastFont = cookies.readCookie(loginId + '_LastFont');
        var currentFont = gl_fonttype + fontSizeDel + globalFontSize;
        if (currentFont != lastFont) {
            // restore all column widths to default in case user changed font size at other client
            // so current column width cookies are not compatible anymore
            restoreAllColumnWidthSettings();
        }
        // always keep track of current font
        cookies.createCookie(loginId + '_LastFont', currentFont, 1800);

        changeFontSize(globalFontSize, false);
        setFontStyle();
        createFmx0(defFontType, defFontSize);
        createFmx();
        adjustAllDefaultWidths(getDiffPx());
        
        //detect user has derivative acc or not. if not, it will auto-hide derivative portfolio.
        // should not apply to dealer/remisier account as the account record is empty
        if (!jsutil.isEmpty(accRet) && global_showPortFolioDerivativePortFolio == "TRUE" && !isDealerRemisier) {
            var accInfo = accRet.ai;
            var total = accInfo.length;
            var isHaveDriAcc = "FALSE";
            for (var i = 0; i < total; i++) {
                var acc = accInfo[i];
                if (acc.ex == 'MY') {
                    isHaveDriAcc = "TRUE";
                }
            }
            global_showPortFolioDerivativePortFolio = isHaveDriAcc;
        }
        
        if (arExMapping && arExMapping.scpt) {
            var scpts = arExMapping.scpt;
            for (var i = 0; i < scpts.length; i++) {
                var scpt = scpts[i];
                if (scpt.tcplusfeatures) {
                    showFlashTeleChart = false;
                    var tcplusFeaturesList = scpt.tcplusfeatures.split(',');
                    for (var j = 0; j < tcplusFeaturesList.length; j++) {
                        switch (parseInt(tcplusFeaturesList[j])) {
                            case TCPLUS_FEATURES.HTML5_TTCHART:
                                showFlashTeleChart = true;
                                break;
                        }
                    }
                    break;
                }
            }
        }

        if (arExMapping && arExMapping.scpt) {
            var scpts = arExMapping.scpt;

            for (var i = 0; i < scpts.length; i++) {
                var scpt = scpts[i];

                if (scpt.ex) {
                    if (bypassMYAccChecking == 'FALSE') {
                        if (authenret.atp.sct == 'M' && scpt.ex == 'MY')
                            if (!haveActiveAcc(scpt.ex))
                                continue;
                        viewExCodes.push(scpt.ex);
                        viewExType[scpt.ex] = scpt.extype;
                    } else {
                        viewExCodes.push(scpt.ex);
                        viewExType[scpt.ex] = scpt.extype;
                    }
                }
            }
        } else {
            if (outbound && isLMS) {
                if (confOBViewEx.length > 0) {
                    viewExCodes = confOBViewEx.split(',');
                }
                else {
                    viewExCodes.push(global_confDefaultViewEx);
                }
            } else {
                if (confViewEx) {
                    var tempViewExCodes = confViewEx.split(',');

                    if (tempViewExCodes && tempViewExCodes.length > 0) {
                        if (global_HaveATP.toLowerCase() == 'true' && !isGuestUser) {
                            if (bypassMYAccChecking == 'FALSE') {
                                for (var i = 0; i < tempViewExCodes.length; i++) {
                                    if (authenret.atp.sct == 'M' && tempViewExCodes[i] == 'MY')
                                        if (!haveActiveAcc(tempViewExCodes[i]))
                                            continue;
                                    viewExCodes.push(tempViewExCodes[i]);
                                }
                            } else {
                                viewExCodes = tempViewExCodes;
                            }
                        } else {
                            viewExCodes = tempViewExCodes;
                        }
                    }
                }
            }
        }

        if (confTrdEx) {
            tradeExCodes = confTrdEx.split(',');
        }


        // last selected exchange
        var lastEx = layoutProfileManager.getLastSelectedExchange()['exch'];
        if (lastEx) {
            exchangecode = lastEx;
        }
        
        if (jsutil.isEmpty(lastEx) && !jsutil.isEmpty(global_confDefaultViewEx)) { // default view exchange
            exchangecode = global_confDefaultViewEx;
        }
        
        /*
         if (!contains(viewExCodes, exchangecode)) {
         exchangecode = viewExCodes[0];
         }*/

        var exchgFound = false;

        for (var i = 0; i < viewExCodes.length; i++) {
            if (viewExCodes[i].indexOf(exchangecode) == 0) {
            	if(exchangecode == viewExCodes[i] || (exchangecode + 'D') == viewExCodes[i]){
            		exchangecode = viewExCodes[i];
                    exchgFound = true;
                    break;
            	}
            }
        }

        if (!exchgFound) {
            exchangecode = global_confDefaultViewExBkp;
        }

        showExType = viewExType[exchangecode];
        if (showExType == null || showExType == "") {
            showExType = 'R';
        }
        
        checkIsCutAcc(); //for CIMB SG

        // Disables right click menu
        document.body.oncontextmenu = function() {
            return false;
        };

        if (document.images) {
            preload_image = {};
            preload_url = {};

            preload_url['preload_offline'] = '';
            preload_url['preload_blinkingOn'] = '';
            preload_url['preload_blinkingOff'] = '';

            for (var i in preload_url) {
                preload_image[i] = new Image();
                preload_image[i].src = preload_url[i];
            }
        }
        
        window.parent.onbeforeunload = function() {
            
            if (!onRefreshBrowser) {
                onRefreshBrowser = true;

                if (!isGuestUser && !isBasicVer) {
                    // save layout
                    if (n2nLayoutManager.lyConf.shouldSave()) {
                        layoutProfileManager.requestSaveProfileLayout(false);
                    }

                    // save default trading account setting
                    if (cookies.readCookie(loginId + '_defTrAccSync') == 'false') {
                        n2ncomponents.requestSaveDefaultTradingAccountSetting(false);
                    }

                    if(N2N_CONFIG.reorderMenu){
                    	var menuRowSettings = cookies.readCookie(loginId + '_MenuRowSettings');
                    	if (menuRowSettings) {
                    		userPreference.set('menuRowSettings', menuRowSettings);
                    		userPreference.save();
                    	}
                    }

                    autoSaveManager.saveAll(false);
                }

                conn.requestLogout();
            }
            
            n2ncomponents.saveBasketCookie();
        };
        
        window.addEventListener('online', function () {
            tLog('online');
        });
        window.addEventListener('offline', function () {
            tLog('offline');
            
            // assume that offline Vertx is also disconnected
            conn.disconnect();
        });
        
        // starts keepalive immediately
        conn.keepAlive();
        
        // Starts connection
        conn.connect();

        n2nLayoutManager = Ext.create('widget.n2nlayoutmanager');

        }
});
        
function startApp() {

    if (n2nLayoutManager.isWindowLayout()) {
        portfolioSaving = false;
        closedOrderPad = true;
        n2nLayoutManager.loadConfiguredTab();

        n2ncomponents.runBufferTasks1();

        // Watch list
        initializeWatchList();

        n2ncomponents.runBufferTasks4();
        n2ncomponents.runBufferTasks3();

        n2nLayoutManager.activateAllTabs();
    } else {
        initializeWatchList();

        loadDockedItems();
    }

    n2nLayoutManager.setLoading(false);

    if (N2N_CONFIG.lDebug) {
        console.log('script run in', (new Date().getTime() - t2) / 1000, 's');
    }

}

/*** End of Application Section ***/
