/**
 * Provides common function utilities related to stock info
 * Namespace: stockutil
 */

var stockutil = {
    /**
     * Gets exchange code from stock code
     * 
     * @param {string} stockCode Stock code
     * @returns {string} Exchange code
     */
    getExchange: function(stockCode) {
        var exchangeCode = '';

        if (stockCode != null && stockCode != '') {
            var dot = stockCode.indexOf(".");
            if (dot != -1)
                exchangeCode = stockCode.substring(dot + 1);
        }

        return exchangeCode;
    },
    /**
     * Gets only stock name part (without exchange)
     * 
     * @param {string} stockName Stock name
     * @param {mixed} defaultName Default name if can not get from stockName
     * @returns {mixed} Stock name part (without exchange)
     */
    getStockName: function(stockName, defaultName) {
        return this.getStockPart(stockName, defaultName);
    },
    /**
     * Gets only stock part (without exchange)
     * 
     * @param {string} stock Stock string
     * @param {mixed} defaultValue Default value
     * @returns {mixed} Stock part without exchange
     */
    getStockPart: function(stock, defaultValue) {
        var stockPart = stock;
        if (defaultValue !== undefined)
            stockPart = defaultValue;

        if (stock != null && stock !== '') {
            var dot = stock.lastIndexOf('.');
            if (dot !== -1) {
                stockPart = stock.substring(0, dot);
            }
        }

        return stockPart;
    },
    /**
     * Gets parts of a stock
     * @param {string} stock code
     * @returns {Object} Parts of stock: code and exch
     */
    getStockParts: function(stock) {
        var stockParts = new Object();
        if (stock) {
            var parts = stock.split(".");

            stockParts.code = parts[0];
            if (parts.length > 1) {
                stockParts.exch = parts[1];
            }
        }

        return stockParts;
    },
    getExchangeName: function(exchange) {
        var exName = '';

        if (!jsutil.isEmpty(exchange)) {
            for (var i = 0; i < global_ExchangeList.length; i++) {
                if (exchange === global_ExchangeList[i].exchange) {
                    exName = global_ExchangeList[i].exchangeName;
                    break;
                }
            }
        }

        return exName;
    },
    getBuyRate: function(totalBuyVol, volume) {
        return this.getBuySellRate(totalBuyVol, volume);
    },
    getSellRate: function(totalSellVol, volume) {
        return this.getBuySellRate(totalSellVol, volume);
    },
    getAvgPrice: function(totalPrice, totalQty) {
        var avgPrice = 0;

        if (totalQty > 0) {
            avgPrice = totalPrice / totalQty;
        }

        return avgPrice;
    },
    getBuySellRate: function(totalBuySellVol, volume) {
        totalBuySellVol = parseFloat(totalBuySellVol);
        volume = parseFloat(volume);
        var rate = 0.00;

        if (!isNaN(totalBuySellVol) && !isNaN(volume)) {
            if (volume != 0) {
                rate = (totalBuySellVol / volume * 100).toFixed(2);
            }
        }

        return rate;
    },
    mapOutboundStock: function(stockCode) {
        // SG to SI
        stockCode = stockCode.replace('.SG', '.SI');

        return stockCode;
    },
    removeStockDelay: function(delayStock) {
        // get exchange
        var exch = this.getExchange(delayStock);
        if (N2N_CONFIG.forcedNonDelayedExch.indexOf(exch) > -1) {
            return delayStock;
        }
        
        if (delayStock.lastIndexOf('.') > -1) {
            var delay = delayStock.substr(delayStock.length - 1);
            if (delay.toLowerCase() == 'd') {
                return delayStock.substr(0, delayStock.length - 1);
            }
        }

        return delayStock;
    },
    removeDelayChar: function(stkCode) {
        // get exchange
        var exch = this.getExchange(stkCode);
        if (N2N_CONFIG.forcedNonDelayedExch.indexOf(exch) > -1) {
            return stkCode;
        }
        
        if (stkCode[stkCode.length - 1] === 'D') {
            return stkCode.substring(0, stkCode.length - 1);
        }

        return stkCode;
    },
    isDelayStock: function(stock) {
        var exch = this.getExchange(stock);
        if (N2N_CONFIG.forcedNonDelayedExch.indexOf(exch) > -1) {
            return false;
        }
        
        if (stock.lastIndexOf('.') > -1) {
            var delay = stock.substr(stock.length - 1);
            return delay.toLowerCase() == 'd';
        }

        return false;
    },
    removeDecimalString: function(numStr) {
        var intStr = parseInt(numStr);

        return String(intStr);
    },
    roundDecimalString: function(numStr) {
        var intStr = Math.round(numStr);

        return String(intStr);
    },
    filterCols: function(colList, skipMDColCheck, skipStrCol) {
        var col05 = new Array();
        var col06 = new Array();
        var col17 = new Array();
        
        for (var i = 0; i < colList.length; i++) {
            var col = colList[i];
            if (/^666/.test(col)) { // coll 06
                if (col !== fieldStkCode_06) {
                    var newCol06 = col.replace(/^666/, '');
                    col06.push(newCol06);
                }
            } else if (/^x/.test(col)) { // coll 17
                col17.push(col);
            } else if (skipMDColCheck || (MD_COLS.indexOf(col) === -1 && (!isNaN(col) || (!skipStrCol && col === fieldBuyRate)))) { // coll 05
                col05.push(col);
            }
        }

        // adds some important columns
        if (!skipMDColCheck) {
            col05.push(fieldStkCode, fieldBqty, fieldBuy, fieldSqty, fieldSell);
        }
        
        // if PE ratio included, make sure to include these fids
        var pePos = col05.indexOf(fieldPERatio);
        if (N2N_CONFIG.calculatePERatio && pePos > -1) {
            col05.splice(pePos, 1); // no need to request PE Ratio fid
            
            if (col05.indexOf(fieldEPS) === -1) {
                col05.push(fieldEPS);
            }
            if (col05.indexOf(fieldLast) === -1) {
                col05.push(fieldLast);
            }
            if (col05.indexOf(fieldLacp) === -1) {
                col05.push(fieldLacp);
            }
        }

        if (col06.length > 0) {
            col06.push(fieldStkCode);
        }
        
        if (col17.length > 0) {
            col17.push(fieldStkCode);
        }

        return {
            col05: col05,
            col06: col06,
            col17: col17
        };
    },
    getCodeList: function(feedObj) {
        var codeList = new Array();

        if (feedObj) {
            for (var i = 0; i < feedObj.length; i++) {
                var stkCode = feedObj[i][fieldStkCode];
                if (stkCode) {
                    codeList.push(stkCode);
                }
            }
        }

        return codeList;
    },
    getPERatio: function(eps, last, lacp) {
        
        var price = parseFloat(last);
        var epsValue = parseFloat(eps);

        // if last not available, use lacp
        if (!price) {
            price = parseFloat(lacp);
        }

        if (price && epsValue) {
            var PERatio = price / epsValue;

            return Ext.util.Format.number(PERatio, '0.000');
        }

        return null;
    },
    getMktAvgPrice: function(volumn, value, lotSize) {
        var avgPrice = null;

        volumn = parseFloat(volumn);
        value = parseFloat(value);
        lotSize = parseFloat(lotSize);

        if (volumn && value && lotSize) {
            // need put lot size back since volume is in lot if using 'lot'
            lotSize = global_displayUnit.toLowerCase() == "lot" ? lotSize : 1;
            avgPrice = (value / (volumn * lotSize)).toFixed(5);
        }

        return avgPrice;
    },
    getYtd: function(lacp, ytd) {
        lacp = parseFloat(lacp);
        ytd = parseFloat(ytd);

        if (isNaN(lacp) || isNaN(ytd) || ytd == 0) {
            return '-';
        }

        var ytdPer = (((lacp - ytd) / ytd) * 100).toFixed(2);

        return ytdPer;
    },
    getVWAP: function(tolVal, tolVol) {

        var tolValue = parseFloat(tolVal);
        var tolVolume = parseFloat(tolVol);

        if (tolValue && tolVolume) {
            var VWAP = tolValue / tolVolume;

            return Ext.util.Format.number(VWAP, '0.000');
        }

        return null;
    },
    formatExpDate: function(dateStr) {
        if (dateStr != null) {
            dateStr = dateStr.trim();

            if (dateStr != '') {
                var format = '';
                if (dateStr.length > 10) {
                    format = 'YmdHis.u';
                } else if (dateStr.length == 8) {
                    format = 'Ymd';
                }

                var dateObj = Ext.Date.parse(dateStr, format);
                if (Ext.util.Format.date(dateObj, 'Y') == '1900') {
                    dateStr = '-';
                } else {
                    dateStr = Ext.util.Format.date(dateObj, global_OrderStatusDateFormat);
                }
            } else {
                dateStr = '-';
            }
        } else {
            dateStr = '-';
        }

        return dateStr;
    },
    adjustColumnWidthConfig: function(widthStr, adjust) {
        // console.log('current column width config: ', widthStr);
        // console.log('adjust by', adjust);

        var arr = widthStr.split('|');
        var newArr = [];

        for (var i = 0; i < arr.length; i++) {
            var newWidth = parseInt(arr[i]) + adjust;
            newArr.push(newWidth);
        }

        // console.log('new column width config: ');
        return newArr.join('|');
    },
    debugColWidth: function(colId, colWidth, colType) {
        colType = colType || 'q';

        var _getColStr = function(_colId) {
            var _colMap = {
                q: {
                    cmap_mmCode: "01",
                    cmap_mmSymbol: "02",
                    cmap_mmClose: "03",
                    cmap_mmOpen: "04",
                    cmap_mmOpenInt: "05",
                    cmap_mmLacp: "06",
                    cmap_mmHigh: "07",
                    cmap_mmLow: "08",
                    cmap_mmBidQty: "09",
                    cmap_mmBid: "10",
                    cmap_mmAsk: "11",
                    cmap_mmAskQty: "12",
                    cmap_mmLast: "13",
                    cmap_mmBS: "14",
                    cmap_mmChg: "15",
                    cmap_mmChgPer: "16", cmap_mmLVol: "17",
                    cmap_mmVol: "18",
                    cmap_mmTrades: "19", cmap_mmSts: "20",
                    cmap_mmNews: "21",
                    cmap_mmTp: "22", cmap_mmTime: "23",
                    cmap_mmTop: "24", cmap_mmRD: "25",
                    cmap_mmExchg: "26",
                    cmap_mmMargin: "27",
                    cmap_mmMarginPrc: "28",
                    cmap_mmMarginPc: "29",
                    cmap_mmTValue: "30",
                    cmap_mmLotSize: "31",
                    cmap_mmCurrency: "32",
                    cmap_mm52WHi_06: "33",
                    cmap_mm52WLo_06: "34",
                    cmap_mmIndexGrp_06: "35",
                    cmap_mmPrevStkNo_06: "36",
                    cmap_mmPrevStkName_06: "37",
                    cmap_mmTickSize_06: "38",
                    cmap_mmTheoPrice_06: "39",
                    cmap_mmDynamicLow_06: "40",
                    cmap_mmDynamicHigh_06: "41",
                    cmap_mmLongName: "42",
                    cmap_mmBuyRate: "br",
                    cmap_mmExpiryDate: "43",
                    cmap_mmExeRatio: "44",
                    cmap_mmGearingX: "45",
                    cmap_mmPremiumPerc: "46",
                    cmap_mmImpVolatility: "47",
                    cmap_mmUnderlying: "48",
                    cmap_mmOptionType: "49",
                    cmap_mmOptionStyle: "50",
                    cmap_mmExePrice: "51",
                    cmap_mmIssuer_06: "52",
                    cmap_mmUnderCurrency_06: "53",
                    cmap_mmUnderName_06: "54",
                    cmap_mmFloatLevel_06: "55",
                    cmap_mmFreeFloat_06: "56",
                    cmap_mmFloatShare_06: "57",
                    cmap_mmFlunctuation_06: "58",
                    cmap_mmForeignOwnerLimit_06: "59",
                    cmap_mmfieldShrIssue_05: "60",
                    cmap_mmRemark: "61",
                    cmap_mmExpiryDays: "62",
                    cmap_mmDelta: "63",
                    cmap_mmEfectiveGearingX: "64",
                    cmap_mmfieldEPS: "65",
                    cmap_mmfieldPERatio: "66",
                    cmap_mmfield12MDiv: "67",
                    cmap_mmfieldDivPay: "68",
                    cmap_mmfieldDivEx: "69",
                    cmap_mmfieldDivYld: "70",
                    cmap_mmfieldDivCcy: "71",
                    cmap_mmfieldIntDiv: "72",
                    cmap_mmfieldIntExDate: "73",
                    cmap_mmfieldSpDiv: "74",
                    cmap_mmfieldSpDivExDate: "75",
                    cmap_mmfieldFinDiv: "76",
                    cmap_mmfieldFinDivExDate: "77"
                },
                o: {
                    cmap_osAccNo: '01',
                    cmap_osOrdNo: '02',
                    cmap_osStkCode: '03',
                    cmap_osStkName: '04',
                    cmap_osOrdTime: '05',
                    cmap_osOrdDate: '06',
                    cmap_osAction: '07',
                    cmap_osType: '08',
                    cmap_osValidity: '09',
                    cmap_osStsCode: '10',
                    cmap_osStatus: '11',
                    cmap_osOrdQty: '12',
                    cmap_osOrdPrc: '13',
                    cmap_osMtQty: '14',
                    cmap_osMtPrc: '15',
                    cmap_osMchVal: '16',
                    cmap_osUnMchQty: '17',
                    cmap_osCncQty: '18',
                    cmap_osExpDate: '19',
                    cmap_osExpQty: '20',
                    cmap_osCurrency: '21',
                    cmap_osExCode: '22',
                    cmap_osLast: '23',
                    cmap_osMinQty: '24',
                    cmap_osDsQty: '25',
                    cmap_osStopLimit: '26',
                    cmap_osRemark: '27',
                    cmap_osAccountName: '28',
                    cmap_osSettOpt: '29',
                    cmap_osOrderValue: '30',
                    cmap_osLotSize: "31",
                    cmap_osLACP: "32",
                    cmap_osTradeCurrency: "33",
                    cmap_osTradeCound: "34",
                    cmap_osLastUpdateTime: "35",
                    cmap_osBranchCode: "36",
                    cmap_osBrokerCode: "37",
                    cmap_osTPType: "38",
                    cmap_osTPDirection: "39"
                },
                p: {
                    cmap_pfName: "01",
                    cmap_pfQtyOH: "02",
                    cmap_pfQtyAvl: "03",
                    cmap_pfQtyQue: "04",
                    cmap_pfCode: "05",
                    cmap_pfAvgBPrc: "06",
                    cmap_pfLast: "07",
                    cmap_pfMktVal: "08",
                    cmap_pfAccNo: "09",
                    cmap_pfYrHigh: "10",
                    cmap_pfYrLow: "11",
                    cmap_pfDayHigh: "12",
                    cmap_pfDayLow: "13",
                    cmap_pfRef: "14",
                    cmap_pfVol: "15",
                    cmap_pfLtSize: "16",
                    cmap_pfChg: "17",
                    cmap_pfChgPc: "18",
                    cmap_pfUnGL: "19",
                    cmap_pfPL: "20",
                    cmap_pfCurrency: "21",
                    cmap_pfExchg: "22",
                    cmap_pfQtySold: "23",
                    cmap_pfQtySusp: "24",
                    cmap_pfBid: "25",
                    cmap_pfAsk: "26",
                    cmap_pfavgsp: "27",
                    cmap_pfTradeValue: "28",
                    cmap_pfSettOpt: "29"
                },
                pr: {
                    cmap_pfRealCode: '01',
                    cmap_pfRealName: '02',
                    cmap_pfRealAggBuyPrc: '03',
                    cmap_pfRealAggSellPrc: '04',
                    cmap_pfRealTtlQtyFromHolding: '05',
                    cmap_pfRealTtlQtyShort: '06',
                    cmap_pfRealTtlQtySold: '07',
                    cmap_pfRealTtlBrokerage: '08',
                    cmap_pfRealGLAmt: '09',
                    cmap_pfRealGLPc: '10',
                    cmap_pfRealAccNo: '11',
                    cmap_pfRealCurrency: '12',
                    cmap_pfRealExchg: '13',
                    cmap_pfRealLotSize: '14',
                    cmap_pfRealAvgSPrice: '15',
                    cmap_pfRealAvgBPrice: '16',
                    cmap_pfRealSettOpt: '17'
                }
            };
            for (var _k in _colMap[colType]) {
                if (_colMap[colType][_k] == _colId) {
                    return _k;
                }
            }
        };

        var cId = colId.split('|');
        var cWidth = colWidth.split('|');
        var idWidth = new Array();

        for (var i = 0; i < cId.length; i++) {
            var cStr = _getColStr(cId[i]);
            var cwStr = cStr + '=' + cWidth[i];
            idWidth.push(cwStr);
        }

        return idWidth.join('|');
    },
    toColWidthConfig: function(cwStr, adjustWidth) {
        adjustWidth = adjustWidth || 0;
        var cwItems = cwStr.split('|');
        var cwConf = new Array();
        var _getValue = function(_strConf) {
            var _vIndex = _strConf.indexOf('=');
            if (_vIndex > -1) {
                return _strConf.substring(_vIndex + 1);
            } else {
                return '';
            }
        };
        for (var i = 0; i < cwItems.length; i++) {
            cwConf.push(parseInt(_getValue(cwItems[i])) + adjustWidth);
        }

        return cwConf.join('|');
    },
    toColWidthConfig2: function(cwStr, adjustWidth) { // for new config format
        var colArr = cwStr.split(',');
        var newWidthObj = {};

        for (var i = 0; i < colArr.length; i++) {
            var colWidth = colArr[i].split('=');
            if (colWidth.length > 1) {
                if (colWidth[0] !== '' && colWidth[1] !== '') {
                    var clWd = parseInt(colWidth[1]);
                    clWd += adjustWidth;
                    newWidthObj[colWidth[0]] = clWd;
                }
            }
        }

        var strArr = [];
        for (var i in newWidthObj) {
            var colStr = i + '=' + newWidthObj[i];
            strArr.push(colStr);
        }

        return strArr.join(',');
    },
    adjustSizes: function(sizes, adjustSize) {
        var sizeArr = sizes.split('|');
        var newSizeArr = [];
        for (var i = 0; i < sizeArr.length; i++) {
            newSizeArr.push(parseInt(sizeArr[i]) + adjustSize);
        }

        return newSizeArr.join('|');
    },
    stripItemId: function(stripId, itemId) {
        return itemId.replace(stripId, '');
    },
    getStockDataFromList: function(stkCode, exch, streamWl) {
        if (streamWl && fullList.wl) {
            return fullList.wl[stkCode];
        } else if (fullList[exch]) {
            return fullList[exch][stkCode];
        } else {
            return null;
        }

    }
};