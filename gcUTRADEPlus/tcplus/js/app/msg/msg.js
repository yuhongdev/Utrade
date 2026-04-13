/* 
 * Provides various application message constants
 * 
 */
var MSG = {
    /**
     * We regret to inform that we are unable to retrieve your stock information at this time. Kindly try again shortly.
     * @type String 
     */
    NOSTOCK: 'We regret to inform that we are unable to retrieve your stock information at this time. Kindly try again shortly.',
    /**
     * Market Streamer
     * @type String
     */
    MKTSTR: 'Market Streamer',
    OK: 'OK',
    CANCEL: 'Cancel',
    EXPORT: 'Export',
    ERROR1: 'Error occurred.',
    ERROR2: 'We regret to inform that we are unable to process your request at this time. Kindly try again shortly.',
    WORKING: 'Working...',
    ACCNO: {
        d: 'Account No.',
        m: 'Acc.'
    },
    TRADELIMIT: {
        d: 'Trading Limit',
        m: 'Limit'
    },
    CONNUNABLE: 'We regret to inform that we are unable to connect to server at this time. Please try again later.',
    CONNTRY: 'Try now',
    LOGOUT: 'Are you sure you want to logout?',
    WLINPUT: 'Please enter watchlist name:',
    WLEXCEED: 'We regret to inform that we are unable to create your watchlist as you have reached your maximum number of watchlists.',
    WLEMPTY: 'The watchlist name should not be left blank. Kindly enter the name and try again.',
    WLEXCEEDCHAR: 'Please ensure that the name entered does not exceed 20 characters.',
    WLFUNNYCHAR: 'Please use only letters (a-z or A-Z), numbers (0-9) and symbol (space-_) in this field.',
    WLCREATEFAIL: 'We regret to inform that we are unable to create your watchlist at this time. Kindly try again shortly.',
    WLREMOVEFAIL: 'We regret to inform that we are unable to remove your watchlist at this time. Kindly try again shortly.',
    WLNONE: 'Please create a watchlist.',
    WLADDSUCCESS: 'Stock has been successfully added to the watchlist.',
    WLADDFAIL: 'Failed to add to watchList.',
    WLREMOVESTKCONFIRM: 'Are you sure you want to remove this stock from watchlist?',
    WLREMOVESTKFAIL: 'Failed to remove from watchList.',
    WLREMOVESTKSUCCESS: 'Removed successfully.',
    WL_NO_STOCK: 'No stock in watchlist ',
    WL_NEED_LOGIN: 'For watchlist access, please login to continue',
    LOGIN_NOW: '<b>Log in now</b>',
    LOGIN_LATER: 'Later',
    VIEWMOBILE: 'Switching to mobile view will reload the page. Proceed?',
    VIEWDESKTOP: 'Switching to desktop view will reload the page. Proceed?',
    RELOAD: 'Please wait. Reloading...',
    STOCKALERT_CANCELCONFIRM: 'Confirm to discard changes?',
    STOCKALERT_EXISTSTOCK: "Stock already exists in Stock Alert",
    STOCKALERT_DELETEALL: "Delete All Price Alert?",
    STOCKALERT_DELETE: "Delete Price Alert",
    SAVING_SETTING: "You have unsaved settings. Would you like to save your settings?",
    ALL_EXCH: {
        d: 'All Exchanges',
        m: 'All Exch'
    },
    THIS_EXCH: {
        d: 'This Exchange Only',
        m: 'This Exch'
    },
    ALL_BOARD: 'All Boards',
    MKT: {
        '10': {
            d: 'Normal Board Lot',
            m: 'Norm-Brd'
        },
        '15': {
            d: 'Normal Odd Lot',
            m: 'Odd-Lot'
        },
        '17': {
            d: 'Buy In Board Lot',
            m: 'BI-Brd'
        },
        '18': {
            d: 'Buy In Odd Lot',
            m: 'BI-odd'
        },
        '19': {
            d: 'Off Market',
            m: 'Off-Mkt'
        }
    },
    HIS_DATA: 'Historical Data',
    NO_RESULT: 'No result found.',
    NO_CHART: 'Chart not available.',
    EMPTY_SEARCH_TEXT: 'Symbol/Code',
    LOADING: 'Loading...',
    REFRESH: {
        d: 'Refresh',
        m: ''
    },
    RESET: {
        d: 'Reset',
        m: ''
    },
    COLUMN: {
        d: 'Columns',
        m: ''
    },
    SEARCH: {
        d: 'Search',
        m: ''
    },
    BACK: {
        d: 'Back',
        m: ''
    },
    FILTER: {
        d: 'Filter',
        m: ''
    },
    ORDERED_VALUE: {
        d: 'Total Ordered Value:',
        m: 'Ordered:'
    },
    MATCHED_VALUE: {
        d: 'Total Matched Value:',
        m: 'Matched:'
    },
    VIEW_DETAIL: {
        d: 'Detail',
        m: ''
    },
    col: {
        CODE: 'Code',
        SYM: 'Symbol',
        LPRI: 'LPrice',
        PI: 'PI',
        LQTY: 'LQtyU',
        TIME: 'Time',
        CHG: 'Change',
        CHGPER: 'Chg%',
        BDF: 'BDF',
        SDF: 'SDF',
        BBH: 'BBH',
        SBH: 'SBH',
        DATE_TIME: 'DateTime',
        OPEN: 'Open',
        HIGH: 'High',
        LOW: 'Low',
        CLOSE: 'Close',
        VOLUME: 'Vol'
    },
    MIN_1: '1MIN',
    MIN_15: '15MIN',
    MIN_30: '30MIN',
    MIN_60: '60MIN',
    DAILY: 'Daily',
    PIE: 'Pie',
    UP: 'Up',
    DOWN: 'Down',
    UNCHG: 'Unchanged',
    UNTRADEDED: 'Untraded',
    MKT_SUM: 'Market Summary',
    MKT_SUM_PIE: 'Market Summary Pie',
    DEMO: 'Demo',
    POPUP: 'Popup',
    DOCKED: 'Docked',
    TAB: 'Tab',
    IE_NOT_SUPPORT: '<b>Attention:</b> You are using IE version which is not supported by this application.' +
            '<br/> Please upgrade your browser or we recommend to use Chrome or Firefox.<br/>',
    ORDER_ALL: 'All Order',
    ORDER_ACTIVE: 'Active',
    ORDER_OPEN: 'Open',
    ORDER_FILLED: 'Filled',
    ORDER_INACTIVE: 'Inactive',
    EXPORT_CSV: 'Export CSV',
    EXPORT_ENTER_NAME: 'Please enter a file name.',
    FILE_NAME: 'File Name',
    EXPORT_FILE_NAME: 'Export CSV File Name',
    EQUITY_TRACKER: 'Equities Tracker',
    DIVIDEND: 'Dividend',
    WARRANT: 'Warrants',
    BMD_FUTURE: 'BMD Futures',
    SKIP_CONFIRM: 'Skip Confirmation',
    TRADE_PIN: {
        d: 'Trading Pin',
        m: 'PIN'
    },
    ADD_STOCK_ALERT: 'Add Stock Alert',
    PROFILE: 'Profile',
    CHANGE_PWD: 'Change Password',
    FORGOT_PWD: 'Forgot Password',
    CHANGE_PIN: 'Change Pin',
    FORGOT_PIN: 'Forgot Pin',
    PORTFOLIO_DETAIL: 'Portfolio Detail',
    OPEN_INTER_CHART: 'Open interactive chart in a new window',
    DAY: 'Day',
    OVER_NIGHT: 'Overnight',
    DETAIL: {
        d: 'Detail',
        m: ''
    },
    DERIVATIVE_DETAIL: 'Detail',
    MKTSM_PIE_TIP: 'Display market summary as pie chart',
    AVG_PRICE: 'Average Price',
    TOTAL_QTY: {
    	d:'Total Quantity',
    	m:'Total Qty'
    },
    TOTAL_UNREAL: {
    	d: 'Total Unrealised G/L',
    	m: 'Total Un. G/L'
    },
    NUM: 'No.',
    BUY: 'Buy',
    SELL: 'Sell',
    PRICE: 'Price',
    UNREAL_GL: 'Unrealised G/L',
    CURRENCY: 'Currency',
    MOBILE_VER: 'Mobile Version',
    DESK_VER: 'Desktop Version',
    CALC: 'Calculator',
    BREAK_CALC: 'Breakeven Calculator',
    ANALYSIS_CHART: 'Analysis Chart',
    HIGHEST: 'Highest',
    LOWEST: 'Lowest',
    SHR_ISS: 'Shared Issued',
    MKT_CAP: 'Mkt Cap (MYR)',
    BOARD: 'Board',
    SECTOR: 'Sector',
    STYLE: 'Style',
    TYPE: 'Type',
    CANDLE_STICK: 'Candle Stick',
    OPEN: 'Open',
    CLOSE: 'Close',
    VOLUME: 'Volume',
    CHG_PER: '%Change',
    MOVING_AVG: 'Moving Avg.',
    INTERVAL: 'Interval',
    TRADE_SUBMIT: 'Your order is being processed. Please check your order book for updates.',
    REVISE_SUMBIT: {
        d: 'Revise order submitted!',
        m: 'Revise Order has been submitted. Please check order book for updates.',
    },
    CANCEL_SUBMIT: {
        d: 'Cancel order submitted!',
        m: 'Cancel Order has been submitted. Please check order book for updates.',
    },
    MONTH: {
        d: 'Month',
        m: 'M'
    },
    YEAR: {
        d: 'Year',
        m: 'Y'
    },
    FAIL_LOAD_CHART: 'Failed to load chart.',
    CHART_NOT_AVAI: 'Chart not available.',
    qs: {
        SORTVOL: {
            d: 'Sort by Volume',
            m: 'Volume'
        },
        SORTGAINER: {
            d: '',
            m: ''
        },
        SORTGAINERP: {
            d: '',
            m: ''
        },
        SORTLOSER: {
            d: '',
            m: ''
        },
        SORTLOSERP: {
            d: '',
            m: ''
        },
        SORTTRADE: {
            d: '',
            m: ''
        },
        SORTVALUE: {
            d: '',
            m: ''
        },
        SORTCLOSE: {
            d: '',
            m: ''
        },
        SORTLACP: {
            d: '',
            m: ''
        }
    },
    pf: {
        TOTALMKT: {
            d: 'Total Market Value: ',
            m: 'Mkt Val: '
        },
        TOTALGL: {
            d: 'Total Gain/Loss:',
            m: 'Total G/L:'
        },
        UNGL: {
            d: 'Unrealised G/L',
            m: 'Un. G/L'
        },
        UNGLPC: {
            d: 'Unrealised G/L %',
            m: 'Un. GL%'
        }
    },
    NO_STOCK_SELECTED: 'No stock selected.',
    ARCHIVE: {
        d: 'Archive',
        m: ''
    },
    NEWS_ARCHIVE: 'News Archive',
    NEWS_NOT_AVAI_: 'There is no news available for ',
    SELECT_WL: 'Please select a watchlist.',
    ADD_SOME_COL: 'Please add at least 3 columns. Code or Symbol column is required.',
    CODE_SYM_REQUIRED: 'Code or symbol column is required!',
    FULL_VIEW: 'Switch to full view',
    BASIC_VIEW: 'Switch to basic view',
    ANALYSIS: 'Analysis',
    REPORT: 'Reports',
    SP_COMSYN: 'SPCapIQ - Company Synopsis',
    SP_COMINFO: 'SPCapIQ - Company Info',
    SP_ANNO: 'SPCapIQ - Announcement',
    SP_KEYPER: 'SPCapIQ - Key Persons',
    SP_SHRSUM: 'SPCapIQ - Shareholding Summary',
    SP_FINRPT: 'SPCapIQ - Financial Reports',
    STK_INFO: 'Stock Info',
    CHART: 'Chart',
    NEWS: 'News',
    PORT: 'Portfolio',
    MARKET: 'Market',
    EXCH: 'Exchange',
    /**
     * Gets message
     * @param {string} msgObj Message object (from MSG)
     * @param {string} defaultMsg Default message string
     * @returns {string} Message string or empty string if not found
     */
    get: function(msgObj, defaultMsg) {
        var msg = defaultMsg ? defaultMsg : '';

        if (msgObj) {
            if (typeof msgObj == 'object') {
                if (isMobile) {
                    msg = msgObj['m']; // mobile
                } else {
                    msg = msgObj['d']; // non-mobile
                }
            } else { // should be string
                msg = msgObj;
            }
        }

        return msg;
    }
};

//TOREVIEW
var quotelabel = (function() {

    function GridLabel(fieldId) {
        var string = '';

        switch (fieldId) {
            case fieldStkCode:
                if (exchangecode == 'PH') { // pse request
                    string = "Stock Code";
                } else {
                    string = "Code";
                }
                break;
            case fieldStkName:
                if (exchangecode == 'PH') { // pse request
                    string = "Security Name";
                } else {
                    string = "Symbol";
                }
                break;
            case fieldPrev:
                string = "Close";
                break;
            case fieldOpen:
                string = "Open";
                break;
            case fieldOpenInt:
                string = "Open Int";
                break;
            case fieldLacp:
                string = "LACP";
                break;
            case fieldHigh:
                string = "High";
                break;
            case fieldLow:
                string = "Low";
                break;
            case fieldBqty:
                string = "Bid.Qty";
                break;
            case fieldBuy:
                string = "Bid";
                break;
            case fieldSell:
                string = "Ask";
                break;
            case fieldSqty:
                string = "Ask.Qty";
                break;
            case fieldLast:
                string = "Last";
                break;
            case fieldPI:
                string = "b/s";
                break;
            case fieldChange:
                string = "Chg";
                break;
            case fieldChangePer:
                string = "Chg%";
                break;
            case fieldUnit:
                string = "L.Vol";
                break;
            case fieldVol:
                string = "Vol";
                break;
            case fieldTotTrade:
                string = "Trades";
                break;
            case fieldStatus:
                string = "Sts";
                break;
            case fieldNews:
                string = "News";
                break;
            case fieldTP:
                string = "TP";
                break;
            case fieldTime:
                string = "Time";
                break;
            case fieldTOP:
                string = "TOP";
                break;
            case fieldRD:
                string = "R/D";
                break;
            case fieldExchangeCode:
                string = "Exchg";
                break;
            case fieldValue:
                string = "Value";
                break;
            case 'margin':
                string = "Marginable";
                break;
            case 'marginPrc':
                string = "Margin-Price";
                break;
            case 'marginPc':
                string = "Margin Perc.";
                break;
            case fieldLotSize:
                string = "Lot Size";
                break;
            case fieldCurrency:
                string = "Currency";
                break;
            case fieldRemark:
                string = "Remark";
                break;
            case fieldStkFName:
                string = "LongName";
                break;
            case field52WHigh_06:      			//msgtype06
            case field17High52: // msg 17
                string = "52WHi";
                break;
            case field52WLow_06:
            case field17Low52: // msg 17
                string = "52WLo";
                break;
            case fieldIndexGrp_06:
                string = "Category";
                break;
            case fieldPrevStkNo_06:
                string = "PrevStkNo";
                break;
            case fieldPrevLongName_06:
                string = "PrevStkName";
                break;
            case fieldTickSize_06:
                string = "TickSize";
                break;
            case fieldTheoPrice_06:
                string = "TheoPrice";
                break;
            case fieldDynamicLow_06:
                string = "DynamicLow";
                break;
            case fieldDynamicHigh_06:
                string = "DynamicHigh";
                break;
                //OSK
            case fieldExpiryDate:
                string = "ExpiryDate";
                break;
            case fieldExercisePrice:
                string = "ExPrice";
                break;
            case fieldExerciseRatio:
                string = "ExRatio";
                break;
            case fieldGearingX:
                string = "Gearing";
                break;
            case fieldPremiumPerc:
                string = "Premium%";
                break;
            case fieldImpVolatility:
                string = "I.V%";
                break;
            case fieldUnderlying:
                string = "Underlying";
                break;
            case fieldOptionType:
                string = "OptionType";
                break;
            case fieldOptionStyle:
                string = "OptionStyle";
                break;
            case fieldIssuer_06:
                string = "Issuer";
                break;
            case fieldUnderCurr_06:
                string = "UnderCurr";
                break;
            case fieldUnderName_06:
                string = "UnderName";
                break;
            case fieldBuyRate:
                string = "Buy%";
                break;
            case fieldExpiryDays:
                string = "ExpiryDay(s)";
                break;
            case fieldDelta:
                string = "Delta%";
                break;
            case fieldEffectiveGearingX:
                string = "EffGearing";
                break;
                //PSE
            case fieldFloatLevel_06:
                string = "FloatLevel";
                break;
            case fieldFreeFloat_06:
                string = "FreeFloat";
                break;
            case fieldFloatShare_06:
                string = "FloatShare";
                break;
            case fieldFlunctuation_06:
                string = "Fluctuations";
                break;
            case fieldForeignOwnerLimit:
                string = "ForeignLimit";
                break;
            case fieldShrIssue:
                string = "Shares Issued";
                break;
                //Dividend Info
            case field12MDiv:
                string = "12MDiv";
                break;
            case fieldDivPay:
                string = "DivPay";
                break;
            case fieldDivEx:
                string = "DivEx";
                break;
            case fieldDivYld:
                string = "DivYld";
                break;
            case fieldDivCcy:
                string = "DivCcy";
                break;
            case fieldIntDiv:
                string = "IntDiv";
                break;
            case fieldIntExDate:
                string = "IntExDate";
                break;
            case fieldSpDiv:
                string = "SpDiv";
                break;
            case fieldSpDivExDate:
                string = "SpDivExDate";
                break;
            case fieldFinDiv:
                string = "FinDiv";
                break;
            case fieldFinDivExDate:
                string = "FinDivExDate";
                break;
            case fieldEPS:
                string = "12MEPS";
                break;
            case fieldPERatio:
                string = "12MP/E";
                break;
        }

        return string;
    }


    function topButtonLabel(number, idValue) {
        //var string = 'Top ' + number + ' ' ;
        var string = '';
        if (!isMobile) {
            string = 'Sort by ';
        }

        switch (idValue) {
            case 'vol':
                string += "Volume";
                break;
            case 'gainer':
                string += "Gainers";
                break;
            case 'gainerp':
                string += "Gainers %";
                break;
            case 'loser':
                string += "Losers";
                break;
            case 'loserp':
                string += "Losers %";
                break;
            case 'symbol':
                string += "Name";
                break;
            case 'totaltrade':
                string += "Trade";
                break;
            case 'totalvalue':
                if (exchangecode == 'PH') { // pse request
                    string += "Most Active";
                } else {
                    string += "Value";
                }
                break;
            case 'close':
                string += "Close";
                break;
            case 'lacp':
                string += "LACP";
                break;
            case 'bid_qty':
                string += "Bid.Qty";
                break;
        }

        return string;
    }

    // deprecated
    function MarketButtonLabel(idValue, text) {
        var string = '';

        switch (idValue) {
        case '10':
        	string += languageFormat.getLanguage(20648, "Normal Board Lot");
        	break;
        case '17':
        	string += languageFormat.getLanguage(20649, "Buy In Board Lot");
        	break;
        case '19':
        	string += languageFormat.getLanguage(20650, "Off Market");
        	break;
        case '15':
        	string += languageFormat.getLanguage(20651, "Normal Odd Lot");
        	break;
        case '18':
        	string += languageFormat.getLanguage(20652, "Buy In Odd Lot");
        	break;
        }

        if (string == '') {
        	string = text;
        }

        return string;
    }




    return {
        GridLabel: GridLabel,
        topButtonLabel: topButtonLabel,
        MarketButtonLabel: MarketButtonLabel
    };

})();

var Tracker = (function() {

    function GridLabel(fieldId) {
        var string = '';

        switch (fieldId) {

            case fieldTransAction:
                if (exchangecode == 'PH') { // pse request
                    string = "Aggressive Side";
                } else {
                    // string = "Traded At";
                    string = "PI";
                }
                break;
            case fieldTransNo:
                string = "No";
                break;
            case fieldTime:
                string = "Time";
                break;
            case fieldLast:
                string = "Price";
                break;
            case fieldUnit:
                string = "Volume";
                break;
            case fieldBuyBroker:
                string = "BBH";
                break;
            case fieldSellBroker:
                string = "SBH";
                break;
        }

        return string;
    }

    return {
        GridLabel: GridLabel
    };
})();