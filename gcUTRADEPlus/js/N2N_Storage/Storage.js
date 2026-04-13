/*
 * 
 * procJson
 * procString
 * 
 * 
 * returnRecord
 * _generateUnsubscription
 * _generateSubscription
 * 
 * 
 * returnRecordByList
 * generateUnsubscriptionByList
 * generateSubscriptionByList
 * 
 * 
 * generateUnsubscriptionByExtComp
 * 
 * 
 * returnStockCode
 * returnStockCodeByExtComp
 * returnFieldId
 * 
 * 
 * _refresh 
 * 
 */


var Storage = (function() {
	
	var hashTable = new N2NHashtable();
        var helpObj = {}; // to solve order history issue
	
	//msgtype06 (duplicate from procJson, need to combine into it)
	function procJson06( dataObj, ExtComp) {

		try {

			var stkcode;
			var htsub = new N2NHashtable();
			var isNewHT = false;

//			if(isFirst){//v1.3.34.45
//			isFirst = false;
//			}
//			console.log(" dataObj.d.length:"+ dataObj.d.length);
			if ( dataObj.d != null ) {
				// main.connectionManager.resetCheckAliveTimer(); //v1.3.34.45

				for ( var i = 0; i < dataObj.d.length; i ++ ) {
					var arrTemp = dataObj.d[i];
					stkcode = arrTemp[fieldStkCode];				
//					console.log("stkcode 06:"+stkcode);
					//get the selected stock info from hashtable
					htsub = hashTable.get( stkcode );

					//if stock info not exist, htsub is undefined. define new htsub
					if ( typeof( htsub ) == 'undefined') {
						htsub = new N2NHashtable();
						//isNewHT = true;
						//htsub.put('lastupdate', new Date().getTime());
					}

					/*
					if(!isNewHT){
						var lastUpdateTime = htsub.getItem('lastupdate');
						var objUpdateTime = new Date().getTime();
						
						var feedUpdateInterval = (objUpdateTime - lastUpdateTime) / 1000;
						if(feedUpdateInterval > 1){
							lastUpdateTime = objUpdateTime;
							htsub.put('lastupdate', lastUpdateTime);
						}else{
							return;
						}
					}*/

					//insert to stkinfo hashtable by field id return from feed        	
					for ( var z in arrTemp ) {
						htsub.put( z, arrTemp[z] );        	       
					}

					if ( arrTemp[fieldLast] != null ) {
						var chg = formatutils.procChangeValue( htsub.items );
						htsub.put( fieldChange, chg );
						var chgPerc = formatutils.procChangePercValue( htsub.items );
						htsub.put( fieldChangePer, chgPerc );
						var prfChg = formatutils.procPrfChangeValue( htsub.items );
						htsub.put( fieldPrfChange, prfChg );
						var prfChgPerc = formatutils.procPrfChangePercValue( htsub.items );
						htsub.put( fieldPrfChangePer, prfChgPerc );

						arrTemp[fieldChange] = chg;
						arrTemp[fieldChangePer] = chgPerc;
						arrTemp[fieldPrfChange] = prfChg;
						arrTemp[fieldPrfChangePer] = prfChgPerc;
					}

					if(arrTemp[fieldExpiryDate] != null){
						var expDate = formatutils.formatDate(htsub.items);
						htsub.put(fieldExpiryDate, expDate);
						arrTemp[fieldExpiryDate] = expDate;
					}

					if(arrTemp[fieldOptionType] != null){
						var opt = formatutils.procOptionType(htsub.items);
						htsub.put(fieldOptionType, opt);
						arrTemp[fieldOptionType] = opt;
					}
					
					if(arrTemp[fieldOptionStyle] != null){
						var ops = formatutils.procOptionStyle(htsub.items);
						htsub.put(fieldOptionStyle, ops);
						arrTemp[fieldOptionStyle] = ops;
					}
					
					// v1.3.34.68
					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldBqty] != null) {
						var bqty = formatutils.formatLot( arrTemp[fieldBqty], htsub.items );
						htsub.put(fieldBqty, bqty);
						arrTemp[fieldBqty] = bqty;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldBqty2] != null) {
						var bqty2 = formatutils.formatLot( arrTemp[fieldBqty2], htsub.items );
						htsub.put(fieldBqty2, bqty2);
						arrTemp[fieldBqty2] = bqty2;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldBqty3] != null) {
						var bqty3 = formatutils.formatLot( arrTemp[fieldBqty3], htsub.items );
						htsub.put(fieldBqty3, bqty3);
						arrTemp[fieldBqty3] = bqty3;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldBqty4] != null) {
						var bqty4 = formatutils.formatLot( arrTemp[fieldBqty4], htsub.items );
						htsub.put(fieldBqty4, bqty4);
						arrTemp[fieldBqty4] = bqty4;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldBqty5] != null) {
						var bqty5 = formatutils.formatLot( arrTemp[fieldBqty5], htsub.items );
						htsub.put(fieldBqty5, bqty5);
						arrTemp[fieldBqty5] = bqty5;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldSqty] != null) {
						var sqty = formatutils.formatLot( arrTemp[fieldSqty], htsub.items );
						htsub.put(fieldSqty, sqty);
						arrTemp[fieldSqty] = sqty;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldSqty2] != null) {
						var sqty2 = formatutils.formatLot( arrTemp[fieldSqty2], htsub.items );
						htsub.put(fieldSqty2, sqty2);
						arrTemp[fieldSqty2] = sqty2;
					}
					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldSqty3] != null) {
						var sqty3 = formatutils.formatLot( arrTemp[fieldSqty3], htsub.items );
						htsub.put(fieldSqty3, sqty3);
						arrTemp[fieldSqty3] = sqty3;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldSqty4] != null) {
						var sqty4 = formatutils.formatLot( arrTemp[fieldSqty4], htsub.items );
						htsub.put(fieldSqty4, sqty4);
						arrTemp[fieldSqty4] = sqty4;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldSqty5] != null) {
						var sqty5 = formatutils.formatLot( arrTemp[fieldSqty5], htsub.items );
						htsub.put(fieldSqty5, sqty5);
						arrTemp[fieldSqty5] = sqty5;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldUnit] != null) {
						var unit = formatutils.formatLot( arrTemp[fieldUnit], htsub.items );
						htsub.put(fieldUnit, unit);
						arrTemp[fieldUnit] = unit;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldTotBVol]) {
						var tbvol = formatutils.formatLot(arrTemp[fieldTotBVol], htsub.items);
						htsub.put(fieldTotBVol, tbvol);
						arrTemp[fieldTotBVol] = tbvol;
					}
					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldTotSVol]) {
						var tsvol = formatutils.formatLot(arrTemp[fieldTotSVol], htsub.items);
						htsub.put(fieldTotSVol, tsvol);
						arrTemp[fieldTotSVol] = tsvol;
					}
					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldTotSSVol]) {
						var tssvol = formatutils.formatLot(arrTemp[fieldTotSSVol], htsub.items);
						htsub.put(fieldTotSSVol, tssvol);
						arrTemp[fieldTotSSVol] = tssvol;
					}
					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldVol] != null) {
						var vol = formatutils.formatLot(arrTemp[fieldVol], htsub.items);
						htsub.put(fieldVol, vol);
						arrTemp[fieldVol] = vol;
						// v1.3.34.68
					}

					if ( ExtComp != null ) {
						htsub.addComp( ExtComp );
					}

					htsub.procComp(arrTemp);
					hashTable.put( stkcode, htsub );  //put stkinfo to main hashtable


					stkcode = null;
					arrTemp = null;
				}
			}

			htsub = null;

		
		} catch ( e ) {
			console.log( '[Storage][procJson06] Exception ---> ' + e );
		}
	}
	
	/**
	 * Description <br/>
	 * 
	 * 		process json object add into storage
	 * 
	 * @param {json / object}  	dataObj
	 * @param {Ext.Component}	ExtComp
	 */
	function procJson( dataObj, ExtComp, skipUpdate) {

		try {

			var stkcode;
			var htsub = new N2NHashtable();
			var isNewHT = false;

			if(isFirst){//v1.3.34.45
				isFirst = false;
			}

			if ( dataObj.d != null ) {
				// main.connectionManager.resetCheckAliveTimer(); //v1.3.34.45

				for ( var i = 0; i < dataObj.d.length; i ++ ) {
					var arrTemp = dataObj.d[i];

					stkcode = arrTemp[fieldStkCode];

					//get the selected stock info from hashtable
					htsub = hashTable.get( stkcode );

					//if stock info not exist, htsub is undefined. define new htsub
					if ( typeof( htsub ) == 'undefined') {
						htsub = new N2NHashtable();
						//isNewHT = true;
						//htsub.put('lastupdate', new Date().getTime());
					}

					/*
					if(!isNewHT){
						var lastUpdateTime = htsub.getItem('lastupdate');
						var objUpdateTime = new Date().getTime();
						
						var feedUpdateInterval = (objUpdateTime - lastUpdateTime) / 1000;
						if(feedUpdateInterval > 1){
							lastUpdateTime = objUpdateTime;
							htsub.put('lastupdate', lastUpdateTime);
						}else{
							return;
						}
					}*/
					//insert to stkinfo hashtable by field id return from feed        	
					for ( var z in arrTemp ) {
						htsub.put( z, arrTemp[z] );        	       
					}

					if ( arrTemp[fieldLast] != null ) {
						var chg = formatutils.procChangeValue( htsub.items );
						htsub.put( fieldChange, chg );
						var chgPerc = formatutils.procChangePercValue( htsub.items );
						htsub.put( fieldChangePer, chgPerc );
						var prfChg = formatutils.procPrfChangeValue( htsub.items );
						htsub.put( fieldPrfChange, prfChg );
						var prfChgPerc = formatutils.procPrfChangePercValue( htsub.items );
						htsub.put( fieldPrfChangePer, prfChgPerc );

						arrTemp[fieldChange] = chg;
						arrTemp[fieldChangePer] = chgPerc;
						arrTemp[fieldPrfChange] = prfChg;
						arrTemp[fieldPrfChangePer] = prfChgPerc;
					}

					if(arrTemp[fieldExpiryDate] != null){
						var expDate = formatutils.formatDate(htsub.items);
						htsub.put(fieldExpiryDate, expDate);
						arrTemp[fieldExpiryDate] = expDate;
					}

					if(arrTemp[fieldOptionType] != null){
						var opt = formatutils.procOptionType(htsub.items);
						htsub.put(fieldOptionType, opt);
						arrTemp[fieldOptionType] = opt;
					}
					
					if(arrTemp[fieldOptionStyle] != null){
						var ops = formatutils.procOptionStyle(htsub.items);
						htsub.put(fieldOptionStyle, ops);
						arrTemp[fieldOptionStyle] = ops;
					}
					
					// v1.3.34.68
					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldBqty] != null) {
						var bqty = formatutils.formatLot( arrTemp[fieldBqty], htsub.items );
						htsub.put(fieldBqty, bqty);
						arrTemp[fieldBqty] = bqty;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldBqty2] != null) {
						var bqty2 = formatutils.formatLot( arrTemp[fieldBqty2], htsub.items );
						htsub.put(fieldBqty2, bqty2);
						arrTemp[fieldBqty2] = bqty2;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldBqty3] != null) {
						var bqty3 = formatutils.formatLot( arrTemp[fieldBqty3], htsub.items );
						htsub.put(fieldBqty3, bqty3);
						arrTemp[fieldBqty3] = bqty3;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldBqty4] != null) {
						var bqty4 = formatutils.formatLot( arrTemp[fieldBqty4], htsub.items );
						htsub.put(fieldBqty4, bqty4);
						arrTemp[fieldBqty4] = bqty4;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldBqty5] != null) {
						var bqty5 = formatutils.formatLot( arrTemp[fieldBqty5], htsub.items );
						htsub.put(fieldBqty5, bqty5);
						arrTemp[fieldBqty5] = bqty5;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldSqty] != null) {
						var sqty = formatutils.formatLot( arrTemp[fieldSqty], htsub.items );
						htsub.put(fieldSqty, sqty);
						arrTemp[fieldSqty] = sqty;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldSqty2] != null) {
						var sqty2 = formatutils.formatLot( arrTemp[fieldSqty2], htsub.items );
						htsub.put(fieldSqty2, sqty2);
						arrTemp[fieldSqty2] = sqty2;
					}
					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldSqty3] != null) {
						var sqty3 = formatutils.formatLot( arrTemp[fieldSqty3], htsub.items );
						htsub.put(fieldSqty3, sqty3);
						arrTemp[fieldSqty3] = sqty3;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldSqty4] != null) {
						var sqty4 = formatutils.formatLot( arrTemp[fieldSqty4], htsub.items );
						htsub.put(fieldSqty4, sqty4);
						arrTemp[fieldSqty4] = sqty4;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldSqty5] != null) {
						var sqty5 = formatutils.formatLot( arrTemp[fieldSqty5], htsub.items );
						htsub.put(fieldSqty5, sqty5);
						arrTemp[fieldSqty5] = sqty5;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldUnit] != null) {
						var unit = formatutils.formatLot( arrTemp[fieldUnit], htsub.items );
						htsub.put(fieldUnit, unit);
						arrTemp[fieldUnit] = unit;
					}

					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldTotBVol]) {
						var tbvol = formatutils.formatLot(arrTemp[fieldTotBVol], htsub.items);
						htsub.put(fieldTotBVol, tbvol);
						arrTemp[fieldTotBVol] = tbvol;
					}
					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldTotSVol]) {
						var tsvol = formatutils.formatLot(arrTemp[fieldTotSVol], htsub.items);
						htsub.put(fieldTotSVol, tsvol);
						arrTemp[fieldTotSVol] = tsvol;
					}
					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldTotSSVol]) {
						var tssvol = formatutils.formatLot(arrTemp[fieldTotSSVol], htsub.items);
						htsub.put(fieldTotSSVol, tssvol);
						arrTemp[fieldTotSSVol] = tssvol;
					}
					if (global_displayUnit.toLowerCase() == "lot" && arrTemp[fieldVol] != null) {
						var vol = formatutils.formatLot(arrTemp[fieldVol], htsub.items);
						htsub.put(fieldVol, vol);
						arrTemp[fieldVol] = vol;
						// v1.3.34.68
					}

					if ( ExtComp != null ) {
						htsub.addComp( ExtComp );
					}

					if (!skipUpdate) { // avoid unnecessary UI update
						htsub.procComp(arrTemp);
					}

					hashTable.put( stkcode, htsub );  //put stkinfo to main hashtable


					stkcode = null;
					arrTemp = null;
				}
			}

			htsub = null;

		} catch ( e ) {
			console.log( '[Storage][procJson] Exception ---> ' + e );
		}

	}
	
	/**
	 * Description <br/>
	 * 
	 * 		process string to json object to add in storage
	 * 	
	 * @param {string} 			dataString
	 * @param {Ext.Component} 	ExtComp
	 */
	function procString( dataString, ExtComp ){
		var obj = null;
		
		try {
    		obj = Ext.decode( responseText );
    		
    		procJson( obj, ExtComp );
    		
    	} catch( e ) {
    		debug( e );
    	}
    	
    	obj = null;
	}
	
	/**
	 * Description <br/>
	 * 
	 * 		return record result
	 * 
	 * @param 	{string}  stockCode
	 * 
	 * @return 	{json / object}
	 */
	function returnRecord( stockCode ){
		var record = null;
		
		if (stockCode != null) {
			record = hashTable.get( stockCode );
		}
		
		if (record != null) {
			record = record.items;
		}
                
                if (jsutil.isEmpty(record)) { // try to get from help object (for order history)
                    record = helpObj[stockCode] || {};
                }
		
		return record;
	}
	
	/**
	 * Description <br/>
	 * 
	 * 		unsubscription stock info by stock code and Ext.Component
	 * 
	 * @param {string}			stockCode
	 * @param {Ext.Component}	ExtComp
	 */
	function _generateUnsubscription(stockCode, ExtComp){
		if ( ExtComp != null && stockCode != null ) {
                        
			if ( ( hashTable.get( stockCode ) ) != null ) {
				( hashTable.get( stockCode ) ).removeComp( ExtComp );
				
				if ( ( hashTable.get( stockCode ) ).ExtComp.length == 0 ) {
					hashTable.removeItem( stockCode );
				}
			}
		}
	}
	
	/**
	 * Description <br/>
	 * 
	 * 		subscription stock info by stock code and Ext.Component
	 * 
	 * @param {string}			stockCode
	 * @param {Ext.Component}	ExtComp
	 */
	function _generateSubscription( stockCode, ExtComp ){
		if ( ExtComp != null && stockCode != null ) {
			
			if ( hashTable.get(stockCode) == null ) {
				var htsub = new N2NHashtable();
				if ( ExtComp != null ) {
					htsub.addComp( ExtComp );
				}
				hashTable.put( stockCode, htsub );
				
			} else {
				( hashTable.get( stockCode ) ).addComp( ExtComp );
			}
		}	
	}
	
	
	
	/**
	 * Description <br/>
	 * 
	 * 		return record result by list
	 * 
	 * @param 	{array<string>}  stockCodeList
	 * 
	 * @return 	{array<json / object>}
	 */
	function returnRecordByList( stockCodeList ){
		var tempList = [];
		var tempRecord = null;
		
		if ( stockCodeList != null ) {
			for ( var i = 0; i < stockCodeList.length; i ++ ) {
				var tempStockCode = stockCodeList[i];
				tempRecord = hashTable.get( tempStockCode );
				if ( tempRecord != null ) {
					tempList.push( tempRecord.items );
				}
				tempRecord = null;
			}
		}
		
		return tempList;
	}
	
	/**
	 * Description <br/>
	 * 
	 * 		subscription stock info by stock code list and Ext.Component
	 * 
	 * @param {array<string>}	stockCodeList
	 * @param {Ext.Component}	ExtComp
         * @param boolean               Skip refresh or not (default=refresh)
	 */
	function generateSubscriptionByList( stockCodeList, ExtComp, skipRefresh){
                ExtComp.firstLoad = false;
                
		if (stockCodeList != null){ //v1.3.34.30
			for ( var i = 0; i < stockCodeList.length; i ++ ) {
				var stockCode = stockCodeList[i];
				_generateSubscription( stockCode, ExtComp );
			}		
                        
                        if (!skipRefresh) {
                            _refresh();
                        }
		}//v1.3.34.30
	}
	

	/**
	 * Description <br/>
	 * 
	 * 		unsubscription stock info by stock code list and Ext.Component
	 * 
	 * @param {array<string>}	stockCodeList
	 * @param {Ext.Component}	ExtComp
	 */
	function generateUnsubscriptionByList( stockCodeList, ExtComp, skipRefresh){
		
		if (stockCodeList != null) {
			for ( var i = 0; i < stockCodeList.length; i ++ ) {
				var stockCode = stockCodeList[i];
				_generateUnsubscription( stockCode, ExtComp );
			}
                        
                        if (!skipRefresh) {
                            _refresh();
                        }
		}
	}
	
	
	
	
	
	/**
	 * Description <br/>
	 * 
	 * 		unsubscription stock info by Ext.Component
	 * 
	 * @param {Ext.Component} ExtComp
	 */
	function generateUnsubscriptionByExtComp( ExtComp, skipRefresh){
                ExtComp.firstLoad = true;
            
		// get all stock code
		var tempKey = hashTable.keys();
		
		// list for ready to delete
		var stockList = [];
		
		// loop the stock code list
		for ( var i = 0; i < tempKey.length; i ++ ) {
			
			var temoObj = hashTable.get( tempKey[i] );
			// if match with the Ext.Component
			if ( temoObj.hashComp( ExtComp ) ) {
				stockList.push( tempKey[i] );
			}
		}
		
		generateUnsubscriptionByList( stockList, ExtComp, skipRefresh);
		
	}
	
	
	/**
	 * Description <br/>
	 * 
	 * 		return storage stock code list
	 * 
	 * @returns {array} 
	 */
	function returnStockCode(){
		return hashTable.keys();
	}
	
	/**
	 * Description <br/>
	 * 
	 * 		return storage stock code list by Ext Component
	 * 
	 * @param {Ext.Component} ExtComp
	 * 
	 * @returns {array} 
	 */
	function returnStockCodeByExtComp( ExtComp ){
		// get all stock code
		var tempKey = hashTable.keys();
		
		// list for ready to return
		var stockList = [];
		
		// loop the stock code list
		for ( var i = 0; i < tempKey.length; i ++ ) {
			
			var temoObj = hashTable.get( tempKey[i] );
			// if match with the Ext.Component
			if ( temoObj.hashComp( ExtComp ) ) {
				stockList.push( tempKey[i] );
			}
		}
		
		return stockList;
	}
	
	
	/**
	 * Description <br/>
	 * 
	 * 		return field id 
	 * 
	 * @returns {array} 
	 */
	function returnFieldId(){

		var returnList = [];
		
		var stockCodeList = hashTable.keys();
		if ( stockCodeList.length > 0 ) {
			var dataObj = ( hashTable.get( stockCodeList[0] ) ).items;
			
			for ( var key in dataObj ) {
				
				if ( dataObj.hasOwnProperty( key ) ) {
					
					if ( ( /^-?\.\d{1,}$|^-?\d{1,}\.\d{1,}$|^-?\d{1,}\.\d{1,}$|^-?[0-9]\d{1,}$|^-?[0-9]$/.test( key ) ) || key === fieldBuyRate) {
						returnList.push( key );
					}
				}
			}
			
		}
		
		return returnList;
	}
	
	
	
	
	/**
	 * Description <br/>
	 * 
	 * 		refresh storage data 
	 */
	function _refresh(){
		// get all stock code
		var tempKey = hashTable.keys();
		
		// list for ready to delete
		var deleteList = [];
		
		// loop the stock code list
		for (var i = 0; i < tempKey.length; i ++) {
			
			var temoObj = hashTable.get( tempKey[i] );
			
			// if the stock code didn't have other Ext.Component subscription, it will delete the stock code
			// else it will only unsubcription the Ext.Component
			if ((temoObj.ExtComp.length) == 0 || !_hasVisibleComp(temoObj.ExtComp)) {
				deleteList.push( tempKey[i] );
			}
		}
		
		// delete stock code list with didn't Ext.Compoent subscription
		for ( var i = 0; i < deleteList.length; i ++ ) {
			hashTable.removeItem( deleteList[i] );
		}
		
		conn.updateStkCodes();
		conn.updateFieldList();
		conn.subscribeFeed();
	}
        
        function _hasVisibleComp(compList) {
            for (var i = 0; i < compList.length; i++) {
                if (!isMobile) {
                    if (compList[i].screenType != 'main' || helper.activeView(compList[i])) {
                        return true;
                    }
                } else {
                    if (!N2N_CONFIG.activeSub || helper.activeView(compList[i])) {
                        return true;
                    }
                }
            }

            return false;
        }
        
        function getStore(){
            return hashTable.values();
        }
        
        function _updateHelpObj(obj) {
            helpObj = obj;
        }

        function _clearHelpObj() {
            helpObj = {};
        }
        
        function _getHelpObj() {
            return helpObj;
        }
	
	return {
		procJson 					: procJson,
		procJson06 					: procJson06,
		procString					: procString,
		
		returnRecord				: returnRecord,
		
		returnRecordByList			: returnRecordByList,
		generateSubscriptionByList	: generateSubscriptionByList,
		generateUnsubscriptionByList: generateUnsubscriptionByList,
		
		generateUnsubscriptionByExtComp		: generateUnsubscriptionByExtComp,
		
		returnStockCode				: returnStockCode,
		returnStockCodeByExtComp	: returnStockCodeByExtComp,
		returnFieldId				: returnFieldId,
                getStore: getStore,
                updateHelpObj: _updateHelpObj,
                clearHelpObj: _clearHelpObj,
                getHelpObj: _getHelpObj,
                refresh: _refresh
	};
	
	
}());



