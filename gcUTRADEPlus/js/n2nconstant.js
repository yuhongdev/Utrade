/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
// login status
var statusNotLogin = -1;
var statusInProgress = 1;
var statusHasLogin = 0;

// field id for hot market
var fieldHotMarket = '233';

// field ID
var fieldStkCode = '33';
var fieldStkName = '38';

if(global_Language != 'en'){
    fieldStkName = '130';
}

var fieldStkFName = '39';
var fieldLotSize = '40';
var fieldPrev = '50';
var fieldLacp = '51';
var fieldTime = '54';
var fieldHigh = '56';
var fieldLow = '57';
var fieldBqty = '58';
var fieldBqty2 = '59';
var fieldBqty3 = '60';
var fieldBqty4 = '61';
var fieldBqty5 = '62';
var fieldBuy = '68';
var fieldBuy2 = '69';
var fieldBuy3 = '70';
var fieldBuy4 = '71';
var fieldBuy5 = '72';
var fieldSqty = '78';
var fieldSqty2 = '79';
var fieldSqty3 = '80';
var fieldSqty4 = '81';
var fieldSqty5 = '82';
var fieldSell = '88';
var fieldSell2 = '89';
var fieldSell3 = '90';
var fieldSell4 = '91';
var fieldSell5 = '92';
var fieldLast = '98';
var fieldUnit = '99';
var fieldLValue = '100'; // last traded value
var fieldVol = '101';
var fieldStkStatus = '44';
var fieldStatus = '48';
var fieldValue = '102';
var fieldShrIssue = '41';
var fieldPI = '104';
var fieldParValue = '123';
var fieldTotTrade = '132';
var fieldCurrency = '134';
var fieldRemark = '135';
var fieldTOP = '153'; //Theoritical Price
var fieldTP = '156'; //Trading Phase
var fieldNTA = '113';
var fieldEPS = '127';
var fieldPERatio = '138';
var fieldSettPrice = '152';
//var fieldForeignOwnerLimit = '66677'; //not using fid 66677 anymore due to change in datatype from feed
var fieldForeignOwnerLimit = '666191';
// message type
var fieldMsgType = '45';

//OSK
var fieldExpiryDate = '49';
var fieldExercisePrice = '243';
var fieldExerciseRatio = '245';
var fieldGearingX = '140';
var fieldPremiumPerc = '141';
var fieldImpVolatility = '142';
var fieldUnderlying = '244';
var fieldOptionType = "OptionType";
var fieldOptionStyle = "OptionStyle";
var fieldExpiryDays = "ExpiryDays";
var fieldDelta = '143';
var fieldEffectiveGearingX = 'EGearingX';

//Dividend Info - CIMB SG
var field12MDiv = '666127';
var fieldDivPay = '666117';
var fieldDivEx = '117';
var fieldDivYld = '666133';
var fieldDivCcy = '666137';
var fieldIntDiv = '66668';
var fieldIntExDate = '66658';
var fieldSpDiv = '66669';
var fieldSpDivExDate = '66659';
var fieldFinDiv = '66670';
var fieldFinDivExDate = '66660';

// ************** 
var fieldChange = "change";
var fieldChangePer = "changePer";
var fieldPrfChange = "prtChange"; //v1.3.33.1
var fieldPrfChangePer = "prtChangePer"; //v1.3.33.1
var fieldNews = "News";
var fieldRD = "RD";
var fieldExchangeCode = "ExchangeCode";
var fieldBuyRate = 'buyRate';
var fieldFXSpread = "FXSpread";
var fieldRSSIndicator = "RSSIndicator";
//************** 



// stkinfo
//var fieldMktCap = '41';
var fieldIndexCode = '35';
var fieldSectorCode = '36';
var fieldSectorName = '37';
var fieldBoard = '154';
var fieldISIN = '157';
var fieldTotBVol = '238';
var fieldTotSVol = '237';
var fieldTotSSVol = '239';
var fieldBTrans = '241';
var fieldSTrans = '242';
var fieldUpLmt = '232';
var fieldLowLmt = '231';

var fieldBSplit = '170';
var fieldBSplit2 = '171';
var fieldBSplit3 = '172';
var fieldBSplit4 = '173';
var fieldBSplit5 = '174';
var fieldSSplit = '180';
var fieldSSplit2 = '181';
var fieldSSplit3 = '182';
var fieldSSplit4 = '183';
var fieldSSplit5 = '184';
var fieldInstrument = '139';

// FID - transaction
var fieldTransNo = '103';
var fieldOpen = '55';
var fieldOpenInt = '52';
var fieldTransDate = '53';
var fieldTransTime = '54';
var fieldTransAction = '104';

//MsgType 06, '666'+fid
var fieldStkCode_06 = '66633';
var fieldPrevStkNo_06 = '66637';
var fieldPrevLongName_06 = '66639';
var fieldTickSize_06 = '666123';
var fieldExchange_06 = '666131';
var fieldIndexGrp_06 = '666135';
var field52WHigh_06 = '66656';
var field52WLow_06 = '66657';
var fieldTheoPrice_06 = '666153';
var fieldDynamicLow_06 = '666231';
var fieldDynamicHigh_06 = '666232';
var fieldIssuer_06 = '666157';
var fieldUnderCurr_06 = '666134';
var fieldUnderName_06 = '666244';

//CFD
var fieldCFDMapValue_06 = "66662";
var fieldCFDTradable_06 = "cfdTradable";
var fieldCFDShortSell_06 = "cfdSS";
var fieldCFDMarginPerc_06 = "66693";
var fieldCFDMarginLS_06 = "66663"

//CIMBSG Circuit Breaker Enhancements
var fieldRefPrice_06 = '66650';
var fieldEndTime_06 = '666116';

//PSE
var fieldFloatLevel_06 = '66673';
var fieldFreeFloat_06 = '66674';
//var fieldFloatShare_06 = '66675'; //not using fid 66675 anymore due to change in datatype from feed
var fieldFloatShare_06 = '666190';
var fieldFlunctuation_06 = '66676';
var fieldTickSize_06 = '66678';
var fieldBuyType = '1000';
var fieldBuyBroker = '1001';
var fieldSellType = '1002';
var fieldSellBroker = '1003';
var fieldAmalgamateBroker = '1004';
var fieldBrokerId = '120';

//Fundamental Info(msg type 17)
var field17EPS = 'x46';
var field17EEPS = 'x145';
var field17ShareOutstanding = 'x48';
var field17NetIncome = 'x146';
var field17TotalCash = 'x147';
var field17Ratings = 'x152';
var field17BRisk = 'x153';

//Scoreboard
var fieldSbUnchanged = '107';
var fieldSbUntraded = '108';
var fieldSbTotalVol = '110';
var fieldSbTotalValue = '111';
var fieldSbExchgCode = '131';
var fieldSbTotalTrade = '133';
var fieldSbUntrd = '108';
var fieldSbUp = '105';
var fieldSbUnchg = '107';
var fieldSbBid = '35';
var fieldSbDown = '106';
var fieldSbName = '37';
var fieldSbTot = '109';
var fieldSbVol = '110';
var fieldSbEx = '131';
var fieldSbVal = '111';
var fieldSbId = '36';

// return type
var typeSort = 's';
var typeQuote = 'q';
var typeIndex = 'i';
var typeIndexList = 'd';
var typeTransact = 'r';
var typeTransactSumm = 'rs';
var typeScoreBoard = 'b';
var typeOrderStatus = 'os';
var typeOrderStatusPush = 'osp';
var typePortfolio = 'pf';
var typePrtfSumm = 'ps';
var typeOrdStsSumm = 'oss';
var typeAccount = 'acc';
//var typePrtfDetRep = 'pdf';
//var typePrtfSubDetRep = 'psdr';
//var typePrtfSubDetRepSumm = 'psdrs';
//var typePrtfSummRpt = 'psr';
//var typePrtfDetRpt = 'pdr';

var DEBUG = false;

// blinkColor
//var cBUp = 'rgb(0,128,0)'; //#008000
//var cBDown = 'rgb(204,0,0)'; //#CC0000
//var cBUnchanged = 'rgb(47,79,79)'; //#2F4F4F
var cBUp = '#008000';
var cBDown = '#CC0000';
var cBUnchanged = '#2F4F4F';

// fontColor
//var cFBlink = 'rgb(255,255,255)';
//var cFUp = 'rgb(0,128,0)';
//var cFDown = 'rgb(204,0,0)';
//var cFUnchanged = 'rgb(47,79,79)';
var cFBlink = '#FFFFFF';
var cFUp = '#008000';
var cFDown = '#CC0000';
var cFUnchanged = '#2F4F4F';

var contentHeight = 340;

var cOrdSrcDesc_I = 'Internet retail';
var cOrdSrcDesc_D = 'Dealer';
var cOrdSrcDesc_W = 'Wap/Mobile';
var cOrdSrcDesc_S = 'SMS';
var cOrdSrcDesc_P = 'Phone';
var cOrdSrcDesc_F = 'Fix';

var cGridFSize = 9;

var modeOrdBuy = 'B';
var modeOrdSell = 'S';
var modeOrdRevise = 'R';
var modeOrdCancel = 'C';

var modeOrdBuyLabel = 'BUY';
var modeOrdSellLabel = 'SELL';
var modeOrdReviseLabel = 'REVISE';
var modeOrdCancelLabel = 'CANCEL';

var cssTabMktMover = 'tab-quoteScr';
var cssTabWlist = 'tab-wList';
var cssTabStkInfo = 'tab-stkInfo';
var cssTabMktDepth = 'tab-mktDepth';
var cssTabChart = 'tab-chart';
var cssTabOrdSts = 'tab-ordSts';
var cssTabEqtPrtf = 'tab-eqtPrtf';
var cssTabOrdPad = 'tab-ordPad';
var cssTabSummary = 'tab-summary';

var iconBtnDetail = 'images/icons/Info_Portfolio.png';
var iconBtnDetailEdit = 'images/icons/portFolioDetailEdit.png';
var iconBtnDetailDelete = 'images/icons/portFolioDetailDelete.png';
var iconBtnManualEntry = 'images/icons/ManualEntry.png';
var iconBtnQuote24 = 'images/icons/StkQuote_24.png';
var iconQuote = 'images/icons/StkQuote_24.gif';
var icoBtnSearch = 'images/icons/Search.png';
var icoBtnArchive = 'images/icons/archive.gif';
var icoBtnRefresh = 'images/icons/Reset.png';
//var icoBtnMsia = 'images/icons/Malaysia-Flag.png';
var icoBtnMsia = 'images/icons/Flag_Msia.png';
//var icoBtnSpore = 'images/icons/Spore-Flag.png';
var icoBtnSpore = 'images/icons/Flag_Sg.png';
var icoBtnIndo = 'images/icons/Flag_Indo.png';
var icoBtnHK = 'images/icons/Flag_HK.png';
var icoBtnUS = 'images/icons/Flag_USA.png';
var icoBtnCME = 'images/icons/Flag_CME.png';
var icoBtnBK = 'images/icons/Flag_BK.png';
var icoBtnPH = 'images/icons/Flag_PH.png';

var icoBtnReset = 'images/icons/Reset.png';
var icoBtnBack = 'images/icons/Back.png';
var icoBtnColumn = 'images/icons/column.png';
var icoBtnExchg = 'images/icons/Exchange.gif';
var icoBtnExchg24 = 'images/icons/Exchg_24.png';
var icoBtnTrackerRecord24 = 'images/icons/TrackerRecord_24.png';

var icoBtnSummary = 'images/summary/MktSummary.gif';
var icoBtnSummary24 = 'images/summary/MktSummary_24.png';
var icoBtnStreamer = 'images/summary/MktStreamer.png';
var icoBtnStreamer24 = 'images/summary/MktStreamer_24.png';
var icoBtnNews = 'images/icons/News.png';
var icoBtnNews24 = 'images/icons/News_24.png';
var icoBtnArchive24 = 'images/icons/Archive_24.png';
var icoBtnOrdSts = 'images/icons/OrderStatus.png';
var icoBtnOrdSts24 = 'images/icons/OrdStatus_24.png';
var icoBtnPrtFolio = 'images/icons/EquityPortfolio.png';
var icoBtnPrtFolio24 = 'images/icons/EquityPortfolio_24.png';
var icoBtnDPrtFolio = 'images/icons/DerivativePortfolio.png';
var icoBtnPrtFolioRealizedGainLoss = 'images/icons/RealizedGainLoss.png';
var icoBtnPrtFolioRealizedGainLoss24 = 'images/icons/RealizedGainLoss_24.png';
var icoBtnPrtFolioInfo = 'images/icons/Info_Portfolio.png';
var icoBtnQuote = 'images/icons/QuoteScrn.png';
var icoBtnWlist = 'images/icons/Watchlist.png';
var icoBtnWlist24 = 'images/icons/Watchlist_24.png';
var icoBtnViewWlist = 'images/icons/Watchlist.png';
var icoBtnViewWlist24 = 'images/icons/Watchlist_View_24.png';
var icoBtnAddWlist = 'images/icons/AddWatchlist.png';
var icoBtnAddWlist24 = 'images/icons/Watchlist_Add_24.png';
var iconBtnRenameWlist = 'images/icons/Watchlist.png';
var iconBtnRenameWlist24 = 'images/icons/Watchlist_Rname_24.png';
var icoBtnRmvWlist = 'images/icons/RmvWatchlist.png';
var icoBtnRmvWlist24 = 'images/icons/Watchlist_Delete_24.png';
var icoBtnStkInfo = 'images/icons/StockInfo.png';
var icoBtnStkInfo24 = 'images/icons/Stk_24.gif';
var icoBtnDepth = 'images/icons/MktDepth.png';
var icoBtnDepth24 = 'images/icons/MktDepth_24.png';
var icoBtnIntraChart = 'images/icons/IntradayChart.png';
var icoBtnIntraChart24 = 'images/icons/Intraday_24.png';
var icoBtnAnalysisChart = 'images/icons/AnalysChart_16.png';
var icoBtnAnalysisChart24 = 'images/icons/AnalysChart_24.png';
var icoBtnOrdPad = 'images/icons/OrderEntry.gif';
var icoTouchMode = 'images/icons/StandardMode.gif';
var icoStandardMode = 'images/icons/TouchScrnMode.gif';
var icoBtnBuy24 = 'images/icons/Buy_24.png';
var icoBtnSell24 = 'images/icons/Sell_24.png';
var icoBtnBuy = 'images/icons/Buy_16.png';
var icoBtnSell = 'images/icons/Sell.png';
var icoBtnSBoard24 = 'images/icons/Scoreboard_24.png';
var icoBtnIndices = 'images/icons/Indices.png';
var icoBtnIndices24 = 'images/icons/Indices_24.png';
var icoBtnFCalculator24 = 'images/icons/Calculator_24.png';
var icoBtnTracker = 'images/icons/Tracker.png';
var icoBtnTracker24 = 'images/icons/Tracker_24.png';
var icoBtnEquitiesTracker = 'images/icons/EquityTracker.png';
var icoBtnEquitiesTracker24 = 'images/icons/EquityTracker_24.png';
var icoBtnReports24 = 'images/icons/Report_24.png';
var icoBtnEContract24 = 'images/icons/eContract_24.png';
var icoBtnAISBeStatement24 = 'images/icons/AISB_eStatement_24.png';
var icoBtnTraderBeyondReport24 = 'images/icons/TraderBeyond_24.png';

var icoBtnMarginPortFolioValuationReport24 = 'images/icons/MarginPortfolioVal_24.png';
var icoBtnTransactionMovementReport24 = 'images/icons/TransactionMvmt_24.png';
var icoBtnStockBalanceReport24 = 'images/icons/StkBalc_24.png';
var icoBtnClientTransactionStatement24 = 'images/icons/StkBalc_24.png';

var icoBtnUnit24 = 'images/icons/ViewUnit_Lot_24.png';
var icoBtnLogout24 = 'images/icons/Logout_24.png';

var iconNormalScreen = 'images/icons/StandardScreen_24.png';
var iconFullScreen = 'images/icons/FullScreen_24.png';

var icoBtnSetting = "images/icons/Setting_16.png";
var icoBtnSetting24 = "images/icons/Setting_24.png";
var icoBtnConfig = "images/icons/configure.png";
var icoBtnClientSumm = "images/icons/ClientSummary.png";
var icoBtnMarginAccSumm = "images/icons/MarginAccSummary_24.png";
var icoBtnMonthlyStatement = "images/icons/MonthlyStatement.png";
var icoBtnTraderDepositReport = "images/icons/TraderDepositReport_24.png";
var icoBtnAnalysis24 = "images/icons/Analysis_24.png";
var icoBtnAnalysisDividend24 = "images/icons/Dividend_24.png";
var icoBtnAnalysisWarrants24 = "images/icons/Warrants_24.png";
var icoBtnAnalysisBMFutures24 = "images/icons/Warrants_24.png";

var icoBtnAddStkAlert = "images/icons/AddStkAlert_16.png";
var icoBtnStkAlert = "images/icons/StkAlert_16.png";
var icoBtnAddStkAlert24 = "images/icons/AddStkAlert_24.png";
var icoBtnStkAlert24 = "images/icons/StkAlert_24.png";
var icoBtnExportCSV = "images/icons/Export_CSV.png";
var icoBtnTheme = "images/icons/Theme_24.png";
var icoBtnChat24 = 'images/icons/Chat_24.png';

//var icoBtnRDBanner = "../images/RotatingLogo.gif";  //put this brokerhouse images at webapps/images/tclite folder to avoid overwrite during deployment
var icoBtnRDBanner = "images/RotatingLogo.gif";

var icoBtnOtherTool = "images/icons/tools_24.png";
var icoBtnStockFilter = "images/icons/tools_StockFilter_24.png";
var icoBtnExchangeRate = "images/icons/CurrencyConv_24.png";

var iconForeignFlows24b = "images/icons/ForeignFlow_24b.png";
var iconBrokerInfo = '';
var iconService = '';
var iconExchgFlag_A = "images/icons/exchange/A.png";
var iconExchgFlag_ES = "images/icons/exchange/ES.png";
var iconExchgFlag_HC = "images/icons/exchange/HC.png";
var iconExchgFlag_HK = "images/icons/exchange/HK.png";
var iconExchgFlag_HN = "images/icons/exchange/HN.png";
var iconExchgFlag_JK = "images/icons/exchange/JK.png";
var iconExchgFlag_KL = "images/icons/exchange/KL.png";
var iconExchgFlag_MY = "images/icons/exchange/MY.png";
var iconExchgFlag_N = "images/icons/exchange/N.png";
var iconExchgFlag_O = "images/icons/exchange/O.png";
var iconExchgFlag_OM = "images/icons/exchange/OM.png";
var iconExchgFlag_P = "images/icons/exchange/P.png";
var iconExchgFlag_SA = "images/icons/exchange/SA.png";
var iconExchgFlag_SG = "images/icons/exchange/SG.png";
var iconExchgFlag_UC = "images/icons/exchange/UC.png";
var iconExchgFlag_UP = "images/icons/exchange/Up.png";
var iconExchgFlag_YM = "images/icons/exchange/YM.png";
var iconExchgFlag_ZS = "images/icons/exchange/ZS.png";
var iconExchgFlag_BK = "images/icons/exchange/BK.png";
var iconExchgFlag_PH = "images/icons/exchange/PH.png";

var iconBtnMoveToLeft = "images/Icn_MoveLeft.png";
var iconBtnAllMoveToLeft = "images/Icn_MoveAllLeft.png";
var iconBtnMoveToRight = "images/Icn_MoveRight.png";
var iconBtnAllMoveToRight = "images/Icn_MoveAllRight.png";
var iconBtnMoveToUp = "images/Icn_MoveUp.png";
var iconBtnMoveToDown = "images/Icn_MoveDown.png";
var iconBtnMoveToTop = "images/Icn_MoveTop.png";
var iconBtnMoveToBottom = "images/Icn_MoveBottom.png";
var iconTop = "images/top16.png";
var iconUp = "images/up16.png";
var iconDown = "images/down16.png";
var iconBottom = "images/bottom16.png";

var iconBtnSave = "images/icons/Save.png";
var iconBtnAdv = "images/icons/advance.png";
var iconBtnBasic = "images/icons/basic.png";
var iconBtnAdv20 = "images/icons/adv20.jpg";
var iconBtnBasic20 = "images/icons/basic20.jpg";
var iconBtnRestore = "images/Restore.png";
var iconBtnCancel = "images/Cancel.png";
var iconBtnSaveSetting = "images/SaveColSetting.png";
var iconBtnSaveSettingOff = "images/SaveColSetting_off.png";
var iconBtnDLAnnouncements = "images/DLAnnouncements.png";
var iconBtnDLAnnouncementsOff = "images/DLAnnouncements_off.png";

var iconSearchAccBtn = "images/icons/SearchAcc.png";

var iconOfflineSignal = "images/icons/Offline.png"; //v1.3.33.49
var iconOnlineSignal = "images/icons/Online.gif"; //v1.3.33.49
var iconConnectingSignal = "images/icons/Connecting.png"; //v1.3.33.49

var ordPadBGColor = '#EEEEEE';
var ordPadBGColorBuy = 'lightgreen';
var ordPadBGColorSell = 'salmon';
var iconSubmitFA = 'images/submitFA.png';
var iconCancelFA = 'images/cancelFA.png';
var imageFA = "images/oneKey.png";
var iconLearnmoreFA = "images/btn_learnmore.png";
var iconRegisterNowFA = "images/btn_registernow.png";
var iconRefreshLimit = "images/icons/refresh_limit.png";
var iconNewStockChart = "images/newstockchart.png";

var iconLanguageSetting = "images/icons/LanguageSetting.png";
var iconLanguageEnglish = "images/icons/LanguageEnglish.png";
var iconLanguageChinese = "images/icons/LanguageChinese.png";
var iconLanguageJapanese = "images/icons/LanguageJapanese.png";
var iconLanguageVietnamese = "images/icons/LanguageVietnamese.png";

var iconSplit = 'images/icons/split.png';
var iconSplitNone = 'images/icons/split_none.png';
var iconSplitRight = 'images/icons/split_right.png';
var iconSplitBottom = 'images/icons/split_bottom.png';
var iconSplit4 = 'images/icons/split_4.png';
var iconSplitNone_2 = 'images/icons/split_none2.png';
var iconSplitRight_2 = 'images/icons/split_right2.png';
var iconSplitBottom_2 = 'images/icons/split_bottom2.png';
var iconSplit4_2 = 'images/icons/split_42.png';
var iconSplit5 = 'images/icons/split_5.png';
var iconSplit6 = 'images/icons/split_6.png';
var iconSplit7 = 'images/icons/split_7.png';
var iconSplit8 = 'images/icons/split_8.png';
var iconSplit9 = 'images/icons/split_9.png';
var iconSplit10 = 'images/icons/split_10.png';
var iconSplit11 = 'images/icons/split_11.png';
var iconSplit12 = 'images/icons/split_12.png';
var iconSplit13 = 'images/icons/split_13.png';

var iconAmal= 'images/icons/amalgamate.png';

var iconUserGuide24 = "images/icons/UserGuide_24.png";
var iconOrdPadHelp10 = "images/icons/Help_10.png";
var iconSaveLayout = "images/icons/save_layout.png";
var iconFXFlipIcon = "images/fxConversion/filpicon.png";
var iconIndicesHistorical = "images/icons/indices_historical.png";

// White and Black Theme
var icoWBBtnWlist = 'images/icons/watchlist_transBG.png';
var iconWBBtnSInfo = 'images/icons/SI.png';
var iconWBBtnChart = 'images/icons/CHART.png';
var iconWBBtnBuy = 'images/icons/BUY.png';
var iconWBBtnSell = 'images/icons/SELL_1.png';
var iconWBBtnNews = 'images/icons/NEWS_1.png';
var iconWBBtnMarket = 'images/icons/M.png';
var iconWBBtnOrdBook = 'images/icons/OB.png';
var iconWBBtnPF = 'images/icons/PF.png';
var iconWBBtnEx = 'images/icons/EX.png';
var iconWBBtnLogOut = 'images/icons/LOGOUT.png';
var iconWBBtnANAL = 'images/icons/ANAL.png';
var iconWBBtnSET = 'images/icons/SET.png';
var iconWBBtnCal = 'images/icons/CUL.png';
var iconWBBtnReport = 'images/icons/REPORT.png';
var iconWBBtnUserGuide = 'images/icons/USERGUIDE.png';
var iconWBBtnStkAlert = 'images/icons/SA.png';

var summaryDir = "images/summary/";
var sbTrd = summaryDir + "ScoreBoardTrd.png";
var sbUnchg = summaryDir + "ScoreBoardUnchg.png";
var sbUntrd = summaryDir + "ScoreBoardUntrd.png";
var sbUp = summaryDir + "ScoreBoardUp.png";
var sbVol = summaryDir + "ScoreBoardVol.png";
var sbDown = summaryDir + "ScoreBoardDw.png";
var sbVal = summaryDir + "ScoreBoardVal.png";
var sbUnchg_wb = summaryDir + "ScoreBoardUnchg_1.png";
var sbTrd_wb = summaryDir + "ScoreBoardTrd_1.png";
var sbUntrd_wb = summaryDir + "ScoreBoardUntrd_1.png";
var sbUp_wb = summaryDir + "ScoreBoardUp_1.png";
var sbVol_wb = summaryDir + "ScoreBoardVol_1.png";
var sbDown_wb = summaryDir + "ScoreBoardDw_1.png";
var sbVal_wb = summaryDir + "ScoreBoardVal_1.png";
var iconSaveOrdPad = iconBtnSave;
var COL = {
    DATE_TIME: '54',
    OPEN: '55',
    HIGH: '56',
    LOW: '57',
    CLOSE: '50',
    VOLUME: '101',
    MDL_LEVEL: '107'
};
var exportIcon = 'images/icons/exportxls.png';
var iconTheme = 'images/white/';
var ICON = {
    TAB_2: 'images/icons/tabs/tab2.png',
    TAB_3: 'images/icons/tabs/tab3.png',
    TAB_4: 'images/icons/tabs/tab4.png',
    TAB_5: 'images/icons/tabs/tab5.png',
    PIE: 'images/pie.png',
    MENU_DEMO: 'images/icons/demo_24.png',
    MENU_PROFILE: 'images/icons/profile_24.png',
    MENU_EDIT_PROFILE: 'images/icons/editProfile_24.png',
    MENU_POWER_BY: 'images/Logo_PowerByN2N.gif',
    EDIT: 'images/icons/edit.png',
    DONE: 'images/icons/done.png',
    streamOn: 'images/icons/stream_on.png',
    streamOff: 'images/icons/stream_off.png',
    HIS_DATA: 'images/icons/historical_data.png',
    HIS_DATA24: 'images/icons/historical_data24.png',
    CHART: iconTheme + 'chart.png',
    EXCH: iconTheme + 'exchange.png',
    HOME: iconTheme + 'home.png',
    QUOTE: iconTheme + 'quote.png',
    LOGOUT: iconTheme + 'logout.png',
    MARKET: iconTheme + 'market.png',
    NEWS: iconTheme + 'news.png',
    ANALYSIS: iconTheme + 'analysis.png',
    REPORT: iconTheme + 'report.png',
    ORDBOOK: iconTheme + 'ordbook.png',
    PORTFOLIO: iconTheme + 'portfolio.png',
    SEARCH: iconTheme + 'search.png',
    SETTING: iconTheme + 'setting.png',
    WATCHLIST: iconTheme + 'watchlist.png',
    PROFILE: iconTheme + 'profile.png',
    TRADE: iconTheme + 'trade.png',
    BUY: iconTheme + 'buy.png',
    SELL: iconTheme + 'sell.png',
    STOCK_INFO: iconTheme + 'stockinfo.png',
    MENU: iconTheme + 'menu.png',
    BACK: 'images/icons/back22.png',
    CLOSE: 'images/icons/close22.png',
    COLLAPSE: 'images/icons/collapse22.png',
    EXPAND: 'images/icons/expand22.png',
    TOOL_MD: 'images/icons/tool_md.png',
    TOOL_MD22: 'images/icons/tool_md22.png',
    POPUP: 'images/icons/popup.png',
    POPIN: 'images/icons/popin.png',
    MAX: 'images/enlarge-column.png',
    SSCOREBOARD: iconTheme + "sscoreboard.png",
    SORDERBOOK: iconTheme + "sorderbook.png",
    SREPORTVIEW: iconTheme + "sreport-view.png",
    SINDICES: iconTheme + "sindices.png",
    SSUMMARY: iconTheme + "ssummary.png",
    SSTOCKINFO: iconTheme + "sstockinfo.png",
    SMARKETDEPTH: iconTheme + "smarketdepth.png",
    SSTOCKTRACKER: iconTheme + "sstocktracker.png",
    SCHART: iconTheme + "schart-view.png",
    SNEWS: iconTheme + "snews.png",
    SANALYSIS: iconTheme + "sanalysis.png",
    SDIVIDEND: iconTheme + "sdividend.png",
    SWARRANTS: iconTheme + "swarrant.png",
    SFUTURES: iconTheme + "sfutures.png",
    SCLIENTSUMMARY: iconTheme + "sclientsummary.png",
    SMONTHLYSTATEMENT: iconTheme + "smonthlystatement.png",
    SMARGINACCOUNT: iconTheme + "smarginaccount.png",
    STRADEBEYOND: iconTheme + "stradebeyond.png",
    STRADEDEPOSIT: iconTheme + "stradedeposit.png",
    SECONTRACT: iconTheme + "secontract.png",
    SAISB: iconTheme + "saisb.png",
    SSTOCKBALANCE: iconTheme + "sstockbalance.png",
    STRANSACTIONMOVEMENT: iconTheme + "stransaction-movement.png",
    SCLIENTSTATEMENT: iconTheme + "sclientstatement.png",
    SMARGINPORTFOLIO: iconTheme + "smarginportfolio.png",
    SEXCHANGE: iconTheme + "sexchange.png",
    SREALISEDGL: iconTheme + "srealised-gainlost.png",
    SDERIVATIVEPORTFOLIO: iconTheme + "sderivative-portfolio.png",
    SEQUITIESPORTFOLIO: iconTheme + "sequity-portfolio.png",
    SPROFILEEDIT: iconTheme + "sprofile-edit.png",
    SMANUALPORTFOLIO: iconTheme + "smanual-portfolio.png",
    LANG: iconTheme + "lang.png",
    CAL: iconTheme + "calculator.png",
    SCAL: iconTheme + "scalculator.png",
    SETTLEMENT: iconTheme + "settlement.png",
    SSETTLEMENT: iconTheme + "ssettlement.png"
};
if (global_personalizationTheme.indexOf("wh") != -1) {
    iconBtnDetailEdit = 'images/icons/portFolioDetailEdit_1.png';
    iconBtnDetailDelete = 'images/icons/portFolioDetailDelete_1.png';
    iconBtnManualEntry = 'images/icons/ManualEntry_1.png';
    icoBtnReset = 'images/Restore_1.png';
    icoBtnSearch = 'images/icons/Search_1.png';
    icoBtnRefresh = 'images/Restore_1.png';
    iconRefreshLimit = "images/refreshlimit1.png";
    icoBtnArchive = "images/icons/archive_1.png";
    ICON.EDIT = 'images/icons/edit_1.png';
    ICON.DONE = 'images/icons/done_1.png';
    ICON.POPUP = 'images/icons/popup_1.png';
    ICON.POPIN = 'images/icons/popin_1.png';
    ICON.BACK = 'images/icons/back22_1.png';
    ICON.CLOSE = 'images/icons/close22_1.png';
    ICON.COLLAPSE = 'images/icons/collapse22_1.png';
    ICON.EXPAND = 'images/icons/expand22_1.png';
    ICON.TAB_2 = 'images/icons/tabs/tab2_2.png';
    ICON.TAB_3 = 'images/icons/tabs/tab3_2.png';
    ICON.TAB_4 = 'images/icons/tabs/tab4_2.png';
    ICON.TAB_5 = 'images/icons/tabs/tab5_2.png';
    ICON.TOOL_MD = 'images/icons/tool_md_1.png';
    iconSubmitFA = 'images/submitFA_1.png';
    iconAmal = "images/icons/amalgamate_1.png";
    iconTop = "images/top16_1.png";
    iconUp = "images/up16_1.png";
    iconDown = "images/down16_1.png";
    iconBottom = "images/bottom16_1.png";
    iconBtnSave = "images/icons/Save_1.png";
    iconSaveOrdPad = "images/save_2.png";
    iconBtnRestore = "images/Restore_1.png";
    iconBtnSaveSetting = "images/SaveColSetting_1.png";
    iconBtnSaveSettingOff = "images/SaveColSetting_off_1.png";
    iconBtnDLAnnouncements = "images/DLAnnouncements_1.png";
    iconBtnDLAnnouncementsOff = "images/DLAnnouncements_off_1.png";
    iconSearchAccBtn = "images/icons/SearchAcc_1.png";
    iconOfflineSignal = "images/icons/Offline_1.png";
    iconOnlineSignal = "images/icons/Online_1.png";
    iconConnectingSignal = "images/icons/Connecting_1.png";
    icoBtnOtherTool = "images/icons/tools_24_1.png";
    icoBtnExportCSV = "images/icons/Export_CSV_1.png";
    icoBtnPrtFolio = 'images/icons/EquityPortfolio_1.png';
    icoBtnDPrtFolio = 'images/icons/Derivative-Portfolio.png';
    icoBtnPrtFolioInfo = 'images/icons/Info_Portfolio_1.png';
    iconBtnBasic = "images/icons/basic-view_1.png";
    iconBtnAdv = "images/icons/full-view_1.png";;
    iconBtnDetail = icoBtnPrtFolioInfo;
    icoBtnOrdSts = icoBtnPrtFolioInfo;
    icoBtnStkInfo = 'images/icons/StockInfo_1.png';
    icoBtnOrdPad = 'images/icons/OrderEntry_1.png';
    icoBtnConfig = "images/icons/configure_1.png";
    icoBtnColumn = 'images/icons/column_1.png';
    iconSplit4 = 'images/icons/split_4_1.png';
    iconBtnMoveToLeft = "images/Icn_MoveLeft_2.png";
    iconBtnAllMoveToLeft = "images/Icn_MoveAllLeft_2.png";
    iconBtnMoveToRight = "images/Icn_MoveRight_2.png";
    iconBtnAllMoveToRight = "images/Icn_MoveAllRight_2.png";
    iconBtnMoveToUp = "images/Icn_MoveUp_2.png";
    iconBtnMoveToDown = "images/Icn_MoveDown_2.png";
    iconBtnMoveToTop = "images/Icn_MoveTop_2.png";
    iconBtnMoveToBottom = "images/Icn_MoveBottom_2.png";
    iconNewStockChart = "images/newstockchart_1.png";
    iconSplit = "images/icons/split_1.png";
    iconExchgFlag_KL = "images/icons/exchange/KL_1.png";
    sbUnchg = sbUnchg_wb;
    sbTrd = sbTrd_wb;
    sbUntrd = sbUntrd_wb;
    sbUp = sbUp_wb;
    sbVol = sbVol_wb;
    sbDown = sbDown_wb;
    sbVal = sbVal_wb;
    ICON.MENU = iconTheme + 'menu2.png';
    ICON.TOOL_MD22 = 'images/icons/tool_md16.png';
    iconQuote = 'images/icons/Quote.png';
    icoBtnChat24 = 'images/icons/emo.png';
    iconForeignFlows24b = "images/icons/FF.png";
    iconService = 'images/icons/service.png';
    iconBrokerInfo = 'images/icons/BI.png'; 
    if (global_personalizationTheme.indexOf("black") != -1) {
        sbUnchg = summaryDir + "ScoreBoardUnchg_2.png";
        sbTrd = summaryDir + "ScoreBoardTrd_2.png";
        sbUntrd = summaryDir + "ScoreBoardUntrd_2.png";
        sbUp = summaryDir + "ScoreBoardUp_2.png";
        sbVol = summaryDir + "ScoreBoardVol_2.png";
        sbDown = summaryDir + "ScoreBoardDw_2.png";
        sbVal = summaryDir + "ScoreBoardVal_2.png";
        iconBtnMoveToLeft = "images/Icn_MoveLeft_1.png";
        iconBtnAllMoveToLeft = "images/Icn_MoveAllLeft_1.png";
        iconBtnMoveToRight = "images/Icn_MoveRight_1.png";
        iconBtnAllMoveToRight = "images/Icn_MoveAllRight_1.png";
        iconBtnMoveToUp = "images/Icn_MoveUp_1.png";
        iconBtnMoveToDown = "images/Icn_MoveDown_1.png";
        iconBtnMoveToTop = "images/Icn_MoveTop_1.png";
        iconBtnMoveToBottom = "images/Icn_MoveBottom_1.png";
        iconRefreshLimit = "images/refreshlimit1.png";
        iconBtnBasic = "images/icons/basic-view_1.png";
        iconBtnAdv = "images/icons/full-view_1.png";
        iconFXFlipIcon = "images/fxConversion/flipicon_white.png";
        //iconSaveOrdPad = iconBtnSave;
        ICON.TAB_2 = 'images/icons/tabs/tab2_1.png';
        ICON.TAB_3 = 'images/icons/tabs/tab3_1.png';
        ICON.TAB_4 = 'images/icons/tabs/tab4_1.png';
        ICON.TAB_5 = 'images/icons/tabs/tab5_1.png';
    }
} else {
    sbTrd_wb = summaryDir + "ScoreBoardTrd.png";
    sbUnchg_wb = summaryDir + "ScoreBoardUnchg.png";
    sbUntrd_wb = summaryDir + "ScoreBoardUntrd.png";
    sbUp_wb = summaryDir + "ScoreBoardUp.png";
    sbVol_wb = summaryDir + "ScoreBoardVol.png";
    sbDown_wb = summaryDir + "ScoreBoardDw.png";
    sbVal_wb = summaryDir + "ScoreBoardVal.png";
}
  
var MD_COLS = [
    fieldStkCode,
    fieldMsgType,
    fieldBqty,
    fieldBqty2,
    fieldBqty3,
    fieldBqty4,
    fieldBqty5,
    fieldBuy,
    fieldBuy2,
    fieldBuy3,
    fieldBuy4,
    fieldBuy5,
    fieldSqty,
    fieldSqty2,
    fieldSqty3,
    fieldSqty4,
    fieldSqty5,
    fieldSell,
    fieldSell2,
    fieldSell3,
    fieldSell4,
    fieldSell5,
    fieldBSplit,
    fieldBSplit2,
    fieldBSplit3,
    fieldBSplit4,
    fieldBSplit5,
    fieldSSplit,
    fieldSSplit2,
    fieldSSplit3,
    fieldSSplit4,
    fieldSSplit5
];

var MD_QTY_COL = [
    fieldBqty,
    fieldBqty2,
    fieldBqty3,
    fieldBqty4,
    fieldBqty5,
    fieldSqty,
    fieldSqty2,
    fieldSqty3,
    fieldSqty4,
    fieldSqty5
];

var PIE_COLOR = [
    '#809609', // up
    '#910F1C', // down
    '#E6E600', // unchanged
    '#8B8B8B' // untraded
];

var cookieExpiryDays = 9999;

var TCPLUS_FEATURES = {
    HTML5_TTCHART: 0 //subcsribe html5 tt chart
};

// updating columns (for quote screen & watchlist)
var updateCols = [
    fieldLast,
    fieldSqty,
    fieldTotTrade,
    fieldTP,
    fieldTOP,
    fieldPI,
    fieldOpen,
    fieldOpenInt,
    fieldValue,
    fieldUnit,
    fieldVol,
    fieldTime,
    fieldPrev,
    fieldLacp,
    fieldHigh,
    fieldLow,
    fieldBqty,
    fieldBuy,
    fieldSell,
    fieldChange,
    fieldChangePer,
    fieldBuyRate,
    fieldStatus,
    fieldStkStatus,
    //OSK    			
    fieldExpiryDate,
    fieldExercisePrice,
    fieldExerciseRatio,
    fieldGearingX,
    fieldPremiumPerc,
    fieldImpVolatility,
    fieldUnderlying,
    fieldOptionType,
    fieldOptionStyle,
    //msgtype06###
    field52WHigh_06,
    field52WLow_06,
    fieldIndexGrp_06,
    fieldPrevStkNo_06,
    fieldPrevLongName_06,
    fieldTickSize_06,
    fieldTheoPrice_06,
    fieldDynamicLow_06,
    fieldDynamicHigh_06,
    fieldIssuer_06,
    fieldUnderCurr_06,
    fieldUnderName_06,
    //PSE
    fieldFloatLevel_06,
    fieldFreeFloat_06,
    fieldFloatShare_06,
    fieldFlunctuation_06,
    fieldForeignOwnerLimit,
    fieldShrIssue,
    //Dividend Info
    fieldEPS,
    fieldPERatio,
    field12MDiv,
    fieldDivPay,
    fieldDivEx,
    fieldDivYld,
    fieldDivCcy,
    fieldIntDiv,
    fieldIntExDate,
    fieldSpDiv,
    fieldSpDivExDate,
    fieldFinDiv,
    fieldFinDivExDate,
    //CIMBSG Circuit Breaker Enhancements
    fieldRefPrice_06,
    fieldEndTime_06
];

var iconLayoutPath = 'images/icons/';

var ICONCLS = {
    reset: 'icon-reset'
};