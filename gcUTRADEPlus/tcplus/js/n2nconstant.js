// login status
var statusNotLogin = -1;
var statusInProgress = 1;
var statusHasLogin = 0;

//field id for TP status
var fieldTPSts = '128';
// field id for hot market
var fieldHotMarket = '233';

// field ID
var fieldStkCode = '33'; // mf: fund code
var fieldStkName = '38'; // mf: fund name 

if(global_Language != 'en'){
    fieldStkName = '130';
}

var fieldStkFName = '39';
var fieldLotSize = '40';
var fieldFundSize = '41'; // mf: fund size
var fieldPrev = '50';
var fieldLacp = '51'; // mf: navps
var fieldTime = '54';
var fieldHigh = '56';
var fieldLow = '57';
var fieldBqty = '58';
var fieldBqty2 = '59';
var fieldBqty3 = '60';
var fieldBqty4 = '61';
var fieldBqty5 = '62';
var fieldBqty6 = '63';
var fieldBqty7 = '64';
var fieldBqty8 = '65';
var fieldBqty9 = '66';
var fieldBqty10 = '67';
var fieldBuy = '68';
var fieldBuy2 = '69';
var fieldBuy3 = '70';
var fieldBuy4 = '71';
var fieldBuy5 = '72';
var fieldBuy6 = '73';
var fieldBuy7 = '74';
var fieldBuy8 = '75';
var fieldBuy9 = '76';
var fieldBuy10 = '77';
var fieldSqty = '78';
var fieldSqty2 = '79';
var fieldSqty3 = '80';
var fieldSqty4 = '81';
var fieldSqty5 = '82';
var fieldSqty6 = '83';
var fieldSqty7 = '84';
var fieldSqty8 = '85';
var fieldSqty9 = '86';
var fieldSqty10 = '87';
var fieldSell = '88';
var fieldSell2 = '89';
var fieldSell3 = '90';
var fieldSell4 = '91';
var fieldSell5 = '92';
var fieldSell6 = '93';
var fieldSell7 = '94';
var fieldSell8 = '95';
var fieldSell9 = '96';
var fieldSell10 = '97';
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
var fieldRefPrice = '125';
var fieldTotTrade = '132';
var fieldCurrency = '134';
var fieldRemark = '135';
var fieldTOP = '153'; //Theoritical Price
var fieldTP = '156'; //Trading Phase
var fieldNTA = '113';
var fieldWarrantType = '119';
var fieldEPS = '127';
var fieldPERatio = '138';
var fieldMarket = '151';
var fieldSettPrice = '152';
//var fieldForeignOwnerLimit = '66677'; //not using fid 66677 anymore due to change in datatype from feed
var fieldForeignOwnerLimit = '666191';
// message type
var fieldMsgType = '45';

//add new field for mkt avg price
var fieldMktAvgPrice = 'avgpr';

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
var fieldSubSector = '159';
var fieldBoard = '154';
var fieldISIN = '157';
var fieldTotBVol = '238';
var fieldTotSVol = '237';
var fieldTotSSVol = '239';
var fieldBTrans = '241';
var fieldSTrans = '242';
var fieldUpLmt = '232';
var fieldLowLmt = '231';
var fieldFrBuy = '235';
var fieldFrSell = '236';
var fieldVWAP = 'vwap';

var fieldBSplit = '170';
var fieldBSplit2 = '171';
var fieldBSplit3 = '172';
var fieldBSplit4 = '173';
var fieldBSplit5 = '174';
var fieldBSplit6 = '175';
var fieldBSplit7 = '176';
var fieldBSplit8 = '177';
var fieldBSplit9 = '178';
var fieldBSplit10 = '179';
var fieldSSplit = '180';
var fieldSSplit2 = '181';
var fieldSSplit3 = '182';
var fieldSSplit4 = '183';
var fieldSSplit5 = '184';
var fieldSSplit6 = '185';
var fieldSSplit7 = '186';
var fieldSSplit8 = '187';
var fieldSSplit9 = '188';
var fieldSSplit10 = '189';
var fieldInstrument = '139';
var fieldIdssSuspend = '160';

// FID - transaction
var fieldTransNo = '103';
var fieldOpen = '55';
var fieldOpenInt = '52';
var fieldTransDate = '53';
var fieldTransTime = '54';
var fieldTransAction = '104';

//MsgType 05
var fieldType = '48';

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
var fieldFluactation_06 = '66676';
var fieldFloatFree_06 = '66674';
var fieldForeignShares_06 = '666191';
//add new IDSS(individual short sell)
var fieldIDSSTolVol_06 = '666101';
var fieldIDSSTolVal_06 = '666102';

//Mutual Fund
//Msg Type 06
var fieldStartDate_06 = '66649';

//MsgType 17
var fieldRiskRate = 'x153';
var fieldFundType = 'x154';
var fieldMinInvestment = 'x155';
var fieldMinAdditionalSub = 'x156';
var fieldMinRedemptionQty = 'x157';
var fieldMinHoldingDays = 'x158';
var fieldEarlyRedemptionFee = 'x159';
var fieldManagementFee = 'x160';
var fieldAssetClass = 'x161';
var fieldInvestmentAllocations = 'x162';
var fieldSettleMentDateRedemption = 'x163';
var fieldFundIssuerName = 'x164';
var fieldPhilosophy = '?';
var fieldGeography = '?';
var fieldLegalBase = '?';
var fieldYTD = 'x165';
var field1YTD = 'x166';
var field3YTD = 'x167';
var field5YTD = 'x168';
var fieldYTDChgPer = 'ytdChgPer';
var fieldYTD1ChgPer = 'ytd1ChgPer';
var fieldYTD3ChgPer = 'ytd3ChgPer';
var fieldYTD5ChgPer = 'ytd5ChgPer';

//CFD
var fieldCFDMapValue_06 = "66662";
var fieldCFDTradable_06 = "cfdTradable";
var fieldCFDShortSell_06 = "cfdSS";
var fieldCFDMarginPerc_06 = "66693";
var fieldCFDMarginLS_06 = "66663";
var fieldCFDLastUpdTime_06 = 'cfdLastUpdTime';

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

var field17WeekHigh = 'x148';
var field17WeekLow = 'x149';
var field17MonthHigh = 'x150';
var field17MonthLow = 'x151';
var field17High52 = 'x102';
var field17Low52 = 'x104';

// broker queue
var field18RecNo = '103';
var field18Indicator = '106';
var field18SeqNo = '118';
var field18BrokerData = 'x120';

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
var fieldSbFrBuy = '81';
var fieldSbFrSell = '83';

// return type
var typeSort = 's';
var typeQuote = 'q';
var typeIndex = 'i';
var typeIndexList = 'd';
var typeTransact = 'r';
var typeTransactSumm = 'rs';
var typeScoreBoard = 'b';
var typeOrderStatus = 'os';
var typeMFOrderStatus = 'mfos';
var typeOrderStatusPush = 'osp';
var typePortfolio = 'pf';
var typeMFPortfolio = 'fp';
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

var mode2FAToken = '0101';
var mode2FAMobile = '0103';

var cssTabMktMover = 'tab-quoteScr';
var cssTabWlist = 'tab-wList';
var cssTabStkInfo = 'tab-stkInfo';
var cssTabMktDepth = 'tab-mktDepth';
var cssTabChart = 'tab-chart';
var cssTabOrdSts = 'tab-ordSts';
var cssTabEqtPrtf = 'tab-eqtPrtf';
var cssTabOrdPad = 'tab-ordPad';
var cssTabSummary = 'tab-summary';

var COL = {
    DATE_TIME: '54',
    OPEN: '55',
    HIGH: '56',
    LOW: '57',
    CLOSE: '50',
    VOLUME: '101',
    MDL_LEVEL: '107'
};
  
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
    field17High52,
    field17Low52,
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

//names of known key codes (0-255)
var keyboardMap = [
  "", // [0]
  "", // [1]
  "", // [2]
  "CANCEL", // [3]
  "", // [4]
  "", // [5]
  "HELP", // [6]
  "", // [7]
  "BACK_SPACE", // [8]
  "TAB", // [9]
  "", // [10]
  "", // [11]
  "CLEAR", // [12]
  "ENTER", // [13]
  "ENTER_SPECIAL", // [14]
  "", // [15]
  "SHIFT", // [16]
  "CTRL", // [17]
  "ALT", // [18]
  "PAUSE", // [19]
  "CAPS_LOCK", // [20]
  "KANA", // [21]
  "EISU", // [22]
  "JUNJA", // [23]
  "FINAL", // [24]
  "HANJA", // [25]
  "", // [26]
  "ESCAPE", // [27]
  "CONVERT", // [28]
  "NONCONVERT", // [29]
  "ACCEPT", // [30]
  "MODECHANGE", // [31]
  "SPACE", // [32]
  "PAGE_UP", // [33]
  "PAGE_DOWN", // [34]
  "END", // [35]
  "HOME", // [36]
  "LEFT", // [37]
  "UP", // [38]
  "RIGHT", // [39]
  "DOWN", // [40]
  "SELECT", // [41]
  "PRINT", // [42]
  "EXECUTE", // [43]
  "PRINTSCREEN", // [44]
  "INSERT", // [45]
  "DELETE", // [46]
  "", // [47]
  "0", // [48]
  "1", // [49]
  "2", // [50]
  "3", // [51]
  "4", // [52]
  "5", // [53]
  "6", // [54]
  "7", // [55]
  "8", // [56]
  "9", // [57]
  "COLON", // [58]
  "SEMICOLON", // [59]
  "LESS_THAN", // [60]
  "EQUALS", // [61]
  "GREATER_THAN", // [62]
  "QUESTION_MARK", // [63]
  "AT", // [64]
  "A", // [65]
  "B", // [66]
  "C", // [67]
  "D", // [68]
  "E", // [69]
  "F", // [70]
  "G", // [71]
  "H", // [72]
  "I", // [73]
  "J", // [74]
  "K", // [75]
  "L", // [76]
  "M", // [77]
  "N", // [78]
  "O", // [79]
  "P", // [80]
  "Q", // [81]
  "R", // [82]
  "S", // [83]
  "T", // [84]
  "U", // [85]
  "V", // [86]
  "W", // [87]
  "X", // [88]
  "Y", // [89]
  "Z", // [90]
  "OS_KEY", // [91] Windows Key (Windows) or Command Key (Mac)
  "", // [92]
  "CONTEXT_MENU", // [93]
  "", // [94]
  "SLEEP", // [95]
  "NUMPAD0", // [96]
  "NUMPAD1", // [97]
  "NUMPAD2", // [98]
  "NUMPAD3", // [99]
  "NUMPAD4", // [100]
  "NUMPAD5", // [101]
  "NUMPAD6", // [102]
  "NUMPAD7", // [103]
  "NUMPAD8", // [104]
  "NUMPAD9", // [105]
  "MULTIPLY", // [106]
  "ADD", // [107]
  "SEPARATOR", // [108]
  "SUBTRACT", // [109]
  "DECIMAL", // [110]
  "DIVIDE", // [111]
  "F1", // [112]
  "F2", // [113]
  "F3", // [114]
  "F4", // [115]
  "F5", // [116]
  "F6", // [117]
  "F7", // [118]
  "F8", // [119]
  "F9", // [120]
  "F10", // [121]
  "F11", // [122]
  "F12", // [123]
  "F13", // [124]
  "F14", // [125]
  "F15", // [126]
  "F16", // [127]
  "F17", // [128]
  "F18", // [129]
  "F19", // [130]
  "F20", // [131]
  "F21", // [132]
  "F22", // [133]
  "F23", // [134]
  "F24", // [135]
  "", // [136]
  "", // [137]
  "", // [138]
  "", // [139]
  "", // [140]
  "", // [141]
  "", // [142]
  "", // [143]
  "NUM_LOCK", // [144]
  "SCROLL_LOCK", // [145]
  "WIN_OEM_FJ_JISHO", // [146]
  "WIN_OEM_FJ_MASSHOU", // [147]
  "WIN_OEM_FJ_TOUROKU", // [148]
  "WIN_OEM_FJ_LOYA", // [149]
  "WIN_OEM_FJ_ROYA", // [150]
  "", // [151]
  "", // [152]
  "", // [153]
  "", // [154]
  "", // [155]
  "", // [156]
  "", // [157]
  "", // [158]
  "", // [159]
  "CIRCUMFLEX", // [160]
  "EXCLAMATION", // [161]
  "DOUBLE_QUOTE", // [162]
  "HASH", // [163]
  "DOLLAR", // [164]
  "PERCENT", // [165]
  "AMPERSAND", // [166]
  "UNDERSCORE", // [167]
  "OPEN_PAREN", // [168]
  "CLOSE_PAREN", // [169]
  "ASTERISK", // [170]
  "PLUS", // [171]
  "PIPE", // [172]
  "HYPHEN_MINUS", // [173]
  "OPEN_CURLY_BRACKET", // [174]
  "CLOSE_CURLY_BRACKET", // [175]
  "TILDE", // [176]
  "", // [177]
  "", // [178]
  "", // [179]
  "", // [180]
  "VOLUME_MUTE", // [181]
  "VOLUME_DOWN", // [182]
  "VOLUME_UP", // [183]
  "", // [184]
  "", // [185]
  "SEMICOLON", // [186]
  "EQUALS", // [187]
  "COMMA", // [188]
  "MINUS", // [189]
  "PERIOD", // [190]
  "SLASH", // [191]
  "BACK_QUOTE", // [192]
  "", // [193]
  "", // [194]
  "", // [195]
  "", // [196]
  "", // [197]
  "", // [198]
  "", // [199]
  "", // [200]
  "", // [201]
  "", // [202]
  "", // [203]
  "", // [204]
  "", // [205]
  "", // [206]
  "", // [207]
  "", // [208]
  "", // [209]
  "", // [210]
  "", // [211]
  "", // [212]
  "", // [213]
  "", // [214]
  "", // [215]
  "", // [216]
  "", // [217]
  "", // [218]
  "OPEN_BRACKET", // [219]
  "BACK_SLASH", // [220]
  "CLOSE_BRACKET", // [221]
  "QUOTE", // [222]
  "", // [223]
  "META", // [224]
  "ALTGR", // [225]
  "", // [226]
  "WIN_ICO_HELP", // [227]
  "WIN_ICO_00", // [228]
  "", // [229]
  "WIN_ICO_CLEAR", // [230]
  "", // [231]
  "", // [232]
  "WIN_OEM_RESET", // [233]
  "WIN_OEM_JUMP", // [234]
  "WIN_OEM_PA1", // [235]
  "WIN_OEM_PA2", // [236]
  "WIN_OEM_PA3", // [237]
  "WIN_OEM_WSCTRL", // [238]
  "WIN_OEM_CUSEL", // [239]
  "WIN_OEM_ATTN", // [240]
  "WIN_OEM_FINISH", // [241]
  "WIN_OEM_COPY", // [242]
  "WIN_OEM_AUTO", // [243]
  "WIN_OEM_ENLW", // [244]
  "WIN_OEM_BACKTAB", // [245]
  "ATTN", // [246]
  "CRSEL", // [247]
  "EXSEL", // [248]
  "EREOF", // [249]
  "PLAY", // [250]
  "ZOOM", // [251]
  "", // [252]
  "PA1", // [253]
  "WIN_OEM_CLEAR", // [254]
  "" // [255]
];

var KEY_CODES = {
    'enter': 13,
    'page_up': 33,
    'page_down': 34,
    'end': 35,
    'home': 36,
    'left': 37,
    'down': 40
};

var colorUpCls = 'color-up';
var colorDownCls = 'color-down';
var colorUnChgCls = 'color-unchange';
var allColorCls = [colorUpCls, colorDownCls, colorUnChgCls];
