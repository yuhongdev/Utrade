
var StockColor = (function() {
	
	var panel = null;
	var exchangeCode = "";
	
	
	var verifyIndexList = [4096, 1, 3, 7, 15];
	
	/*
	 *		green 	: STRCWARR
	 *		cyan 	: ACE-MKT
	 *		red		: PN17/GN3
	 * 
	 * 		[back red] : SUSPENDED
	 * 
	 * [default color],  cyan ,  green  ,magenta
	 */
	var colorList = [N2NCSS.Font_StockCategory_1, 'notChange', N2NCSS.Font_StockCategory_2, N2NCSS.Font_StockCategory_3, N2NCSS.Font_StockCategory_4];
	var colorSuspend = N2NCSS.FontWhite;
	var backSuspend = N2NCSS.BackDown;
	
	
	/**
     * Description <br/>
     * 
     * 		set the stock name color code for quote screen and watch list
     * 
     * @param {string} 			stockName
     * 	pass in stock name to set design
     * 
     * @param {Ext.record} 		ExtRecord
     * this is pass in the Ext.record to set stock name color, either it can pass by null
     * if is null , it will set all stock name color 
     * 
     * @param {Ext.Panel}  		thisPanel
     * pass in the panel on process
     */
	function stockByQuote(stockName, ExtRecord, thisPanel){
		panel = thisPanel;
		
		var stockCode = ExtRecord.data[fieldStkCode];
		var indexCode = ExtRecord.data[fieldIndexCode];
    	var stockStatus = ExtRecord.data[fieldStkStatus];
    	
    	indexCode 		= indexCode != null && indexCode != "" ? indexCode : 0;
    	stockStatus 	= stockStatus != null ? stockStatus : '';
    	
    	return _setStockColor(stockName, stockCode, indexCode, stockStatus);
	}
	
	
    /**
     * Description <br/>
     * 
     * 		set the stock name color code for order book
     * 
     * @param {string} 			stockName
     * 	pass in stock name to set design
     * 
     * @param {Ext.record} 		ExtRecord
     * this is pass in the Ext.record to set stock name color, either it can pass by null
     * if is null , it will set all stock name color 
     * 
     * 
     * @param {Ext.Panel}  		thisPanel
     * pass in the panel on process
     */
    function stockByOrderBook(stockName, ExtRecord, thisPanel) {
        panel = thisPanel;

        var stockCode = ExtRecord.data['StkCode'];
        var indexCode = ExtRecord.data[fieldIndexCode];
    	var stockStatus = ExtRecord.data[fieldStkStatus];
    	
        indexCode = indexCode != null && indexCode != "" ? indexCode : 0;
        stockStatus = stockStatus != null ? stockStatus : '';

        if (stockStatus != null && stockStatus.length > 1) {
            stockStatus = stockStatus.charAt(1);
        }

        return _setStockColor(stockName, stockCode, indexCode, stockStatus);
    }
    function setColor(indexCode){
    	var fontColorCode = null;
    	if(indexCode > 0){

			for (var ii = 0; ii < verifyIndexList.length; ii ++) {
				var finaltext = indexCode & verifyIndexList[ii];
				var finalBinary = parseInt(indexCode).toString(2) & parseInt(verifyIndexList[ii]).toString(2);

				if (ii == 0) {
					if (finaltext == verifyIndexList[ii]) {
						fontColorCode = colorList[ii];
						break;
					}
				} else {
					if(parseInt(finalBinary).toString(2) > 0){
						fontColorCode = colorList[ii];
						break;
					}
				}
			}
		}
    	return fontColorCode;
    }
	/**
	 * Description <br/>
	 * 
	 * 		generate stock name color design 
	 * 
	 * 
	 * @param {string} 		stockName
	 * stock name
	 * 
	 * @param {string} 		stockCode
	 * stock code
	 * 
	 * @param {int}			indexCode
	 * stock index code
	 * 
	 * @param {string}		stockStatus
	 * stock status
	 */
	function _setStockColor(stockName, stockCode, indexCode, stockStatus){
		
    	var fontColorCode = null;
		var backgroundColorCode = null;
		
		// take stock code to split the exchange code and stock code
		var index = stockCode.lastIndexOf('.');
                if (index != -1) {
                    exchangeCode = stockCode.substring(index + 1, stockCode.length);
                    
                    if ((exchangeCode == 'PH' || exchangeCode == 'PHD') && indexCode == '1025') { // make PSEI counter to be blue (for PH exchange only)
                        indexCode = '2056';
                    }
                }
		
		if (stockStatus.toUpperCase() == "S" 
			|| stockStatus.toUpperCase() == "T" 
				|| stockStatus.toUpperCase() == "B" 
					|| stockStatus.toUpperCase() == "SUSP" 
						|| stockStatus.toUpperCase() == "H"
							|| stockStatus.toUpperCase() == "F"
								|| stockStatus.toUpperCase() == "K"
									|| stockStatus.toUpperCase() == "P") {
			
			backgroundColorCode = backSuspend; // red color
			fontColorCode = colorSuspend; // white color
			
		} else {
			
			if(!N2N_CONFIG.confChgOBColours){
				fontColorCode = setColor(indexCode);
			}else{
				if(exchangeCode != global_confDefaultViewEx){
					fontColorCode = 'notChange';
				}else{
					fontColorCode = setColor(indexCode);
				}
			}
		}
        
		var returnString = null;
		
		if (exchangeCode != 'MY' && fontColorCode != null && fontColorCode != 'notChange') {
			
			backgroundColorCode = backgroundColorCode == null ? "" : backgroundColorCode;
			
			returnString = {
					css : fontColorCode + " " + backgroundColorCode
			}
		}
		
		return returnString;
	}
	
	
	
	
	
	return {
		stockByQuote 		: stockByQuote,
		stockByOrderBook 	: stockByOrderBook
	};
	
}());
















