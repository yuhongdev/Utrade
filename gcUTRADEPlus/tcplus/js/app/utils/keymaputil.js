var saveSts = false;
var defId = N2N_CONFIG.defaultHotKeysMapping.split(',').map(Number);

var keyMapUtil = {
	returnDuplicateInfo: function(bindingObj, value){
		var duplicateInfoObj = {};
		if(value != ''){
			for(var i=0; i<global_MappedKeys.bindings.length; i++){
				if(bindingObj.id != global_MappedKeys.bindings[i].id){
					if(bindingObj.key == global_MappedKeys.bindings[i].key && bindingObj.alt == global_MappedKeys.bindings[i].alt && bindingObj.ctrl == global_MappedKeys.bindings[i].ctrl && bindingObj.shift == global_MappedKeys.bindings[i].shift){
						duplicateInfoObj.duplicate = true;
						duplicateInfoObj.id = global_MappedKeys.bindings[i].id;
						break;
					}
				}
			}
		}
		return duplicateInfoObj;
	},
	removeBinding: function(id){
		var tempObj;
		for(var i=0; i<global_MappedKeys.bindings.length; i++){
			if(id == global_MappedKeys.bindings[i].id){
				tempObj = global_MappedKeys.bindings[i]; 
				break;
			}
		}
		
		if(tempObj){
			global_MappedKeys.removeBinding(tempObj);
		}
	},
	addBinding: function(bindingObj){
		var obj = {
				key: bindingObj.key,
				id: bindingObj.id,
				name: bindingObj.name? bindingObj.name : this.getHKName(bindingObj.id),
				defaultEventAction: 'preventDefault',
				alt: bindingObj.alt? true : false,
				ctrl: bindingObj.ctrl? true : false,
				shift: bindingObj.shift? true : false,
				fn: this.getHKFunc(bindingObj.id)
		}
		global_MappedKeys.addBinding(obj);
	},
	getHKFunc: function(id){
		switch(id){
		case defId[0]:
			return function(){ menuHandler.buy(); }
		case defId[1]:
			return function(){ menuHandler.sell(); }
		case defId[2]:
			return function(){ menuHandler.analysisChart(); }
		case defId[3]:
			return function(){ menuHandler.intradayChart(); }
		case defId[4]:
			return function(){ menuHandler.marketDepth(); }
		case defId[5]:
			return function(){ menuHandler.tracker(); }
		case defId[6]:
			return function(){ menuHandler.brokerInfo(); }
		case defId[7]:
			return function(){ menuHandler.openNews(); }
		case defId[8]:
			return function(){ menuHandler.spFundamental(); }
		case defId[9]:
			return function(){ menuHandler.orderStatus(); }
		case defId[10]:
			return function(){ menuHandler.equityPrtf(); }
		case defId[11]:
			return function(){ menuHandler.stockAlert(); }
		}
	},
	getHKName: function(id){
		switch(id){
		case defId[0]:
			return languageFormat.getLanguage(10001, 'Buy');
		case defId[1]:
			return languageFormat.getLanguage(10002, 'Sell');
		case defId[2]:
			return languageFormat.getLanguage(20102, 'Analysis Chart');
		case defId[3]:
			return languageFormat.getLanguage(20101, 'Intraday Chart');
		case defId[4]:
			return languageFormat.getLanguage(20022, 'Market Depth');
		case defId[5]:
			return languageFormat.getLanguage(20095, 'Tracker');
		case defId[6]:
			return languageFormat.getLanguage(11060, 'Broker Info');
		case defId[7]:
			return languageFormat.getLanguage(20121, 'News');
		case defId[8]:
			return languageFormat.getLanguage(20124, 'Fundamental (Capital IQ)');
		case defId[9]:
			return languageFormat.getLanguage(20171, 'Order Book');
		case defId[10]:
			return languageFormat.getLanguage(20262, 'Equities Portfolio');
		case defId[11]:
			return languageFormat.getLanguage(20602, 'Stock Alert');
		}
	},
	enable: function(){
		global_MappedKeys.enable();
	},
	disable: function(){
		global_MappedKeys.disable();
	},
	mappedKey: function(value){
		if(value.toString().indexOf(',') != -1){
			var tempArr = value.split(',');
			var keyList = [];
			var key = '';
			for(var i=0; i<tempArr.length; i++){
				if(tempArr[i] != ''){
					key = keyboardMap[tempArr[i]];
					keyList.push(key);	
				}
			}
			
			var keyCombi = '';
			if(keyList.length > 1){
				keyCombi = keyList.join('+');
			}else{
				keyCombi = keyList.join('')
			}
			
			return keyCombi;
		}else{
			return keyboardMap[value];
		}
	},
	getHKMappedList: function(){
		var hkList = [];
		var tempList = global_MappedKeys.bindings;
        
        for(var i=0; i<tempList.length; i++){
        	var hkObj = tempList[i];
        	var keyList = [];

        	if(hkObj.alt){
        		keyList.push(Ext.event.Event.ALT);
        	}
        	if(hkObj.ctrl){
        		keyList.push(Ext.event.Event.CTRL);
        	}
        	if(hkObj.shift){
        		keyList.push(Ext.event.Event.SHIFT);
        	}
			  
        	keyList.push(hkObj.key);
        	var key = keyList.join(',');
        	
        	var hkKey = key;
        	var hkId = hkObj.id;
        	var hkFunc = hkObj.name;
        	var hkArr = [hkId, hkFunc, hkKey];
        		
        	hkList.push(hkArr);
        }
        
		return hkList;
	},
	loadDefaultMappedKeys: function(){
		var hotKeyList = [];
			
		var defaultList = this.getDefaultList(); 
		
		for(var i=0; i<defaultList.length; i++){
			var sts = defaultList[i].active;
			if(sts){
				hotKeyList.push(defaultList[i]);
			}
		}
		
		return hotKeyList;
	},
	loadHotKeys: function(isRestore){ 
		var hotKeyMapping = '';
		try{
			if(!isRestore){
				if (N2N_CONFIG.hotKeysMappingList.length > 0) {
					hotKeyMapping = JSON.parse(N2N_CONFIG.hotKeysMappingList);
				}else if(sessionStorage.getItem('HotKeys') != null){
					hotKeyMapping = JSON.parse(sessionStorage.getItem('HotKeys'));
				}else{
					hotKeyMapping = keyMapUtil.loadDefaultMappedKeys();
				}
			}else{
				hotKeyMapping = keyMapUtil.loadDefaultMappedKeys();
			}
		}catch(e){
			hotKeyMapping = keyMapUtil.loadDefaultMappedKeys();
		}
		
		for(var i=0; i<hotKeyMapping.length; i++){
			hotKeyMapping[i].fn = this.getHKFunc(hotKeyMapping[i].id);
			hotKeyMapping[i].name = this.getHKName(hotKeyMapping[i].id);
			hotKeyMapping[i].defaultEventAction = 'preventDefault';
		}
		
		return new Ext.util.KeyMap({
            target: Ext.getDoc(),
            binding: hotKeyMapping,
		});
	},
	restoreHotKeysMapping: function(){
		global_MappedKeys.destroy();
		global_MappedKeys = this.loadHotKeys(true);
	},
	getDefaultList: function(){
		var defaultList = [{
            key: this.getDefaultKeys(defId[0]),
            id: defId[0],
            name: this.getHKName(defId[0]),
            defaultEventAction: 'preventDefault',
            active: configutil.getTrueConfig(showBuySellHeader) ? true : false,
    		alt: false,
			ctrl: false,
			shift: false
        },{
            key: this.getDefaultKeys(defId[1]),
            id: defId[1],
            name: this.getHKName(defId[1]),
            defaultEventAction: 'preventDefault',
            active: configutil.getTrueConfig(showBuySellHeader) ? true : false,
    		alt: false,
			ctrl: false,
			shift: false
        },{
            key: this.getDefaultKeys(defId[2]),
            id: defId[2],
            name: this.getHKName(defId[2]),
            defaultEventAction: 'preventDefault',
            active: configutil.getTrueConfig(showChartAnalysisChart) ? true : false,
    		alt: false,
			ctrl: false,
			shift: false
        },{
            key: this.getDefaultKeys(defId[3]), 
            id: defId[3],
            name: this.getHKName(defId[3]),
            defaultEventAction: 'preventDefault',
            active: configutil.getTrueConfig(showChartIntradayChart) ? true : false,
    		alt: false,
			ctrl: false,
			shift: false
        },{
            key: this.getDefaultKeys(defId[4]),
            id: defId[4],
            name: this.getHKName(defId[4]),
            defaultEventAction: 'preventDefault',
            active: showStkInfoMarketDepth == "TRUE" ? true : false,
    		alt: false,
			ctrl: false,
			shift: false
        },{
            key: this.getDefaultKeys(defId[5]),
            id: defId[5],
            name: this.getHKName(defId[5]),
            defaultEventAction: 'preventDefault',
            active: showStkInfoTracker == "TRUE" ? true : false,
    		alt: false,
			ctrl: false,
			shift: false
        },{
            key: this.getDefaultKeys(defId[6]),
            id: defId[6],
            name: this.getHKName(defId[6]),
            defaultEventAction: 'preventDefault',
            active: N2N_CONFIG.brokerInfo ? true : false,
            alt: false,
			ctrl: false,
			shift: false
        },{
            key: this.getDefaultKeys(defId[7]),
            id: defId[7],
            name: this.getHKName(defId[7]),
            defaultEventAction: 'preventDefault',
            active: N2N_CONFIG.elasticNewsUrl ? true : false,
    		alt: false,
			ctrl: false,
			shift: false
        },{
            key: this.getDefaultKeys(defId[8]),
            id: defId[8],
            name: this.getHKName(defId[8]),
            defaultEventAction: 'preventDefault',
            active: N2N_CONFIG.featuresNews_FundamentalCPIQ ? true : false,
    		alt: false,
			ctrl: false,
			shift: false
        },{
            key: this.getDefaultKeys(defId[9]),
            id: defId[9],
            name: this.getHKName(defId[9]),
            defaultEventAction: 'preventDefault',
            active: showOrdBookHeader == "TRUE" ? true : false,
    		alt: false,
			ctrl: false,
			shift: false
        },{
            key: this.getDefaultKeys(defId[10]),
            id: defId[10],
            name: this.getHKName(defId[10]),
            defaultEventAction: 'preventDefault',
            active: showPortFolioMyPortFolio == "TRUE" ? true : false,
    		alt: false,
			ctrl: false,
			shift: false
        },{
            key: this.getDefaultKeys(defId[11]),
            id: defId[11],
            name: this.getHKName(defId[11]),
            defaultEventAction: 'preventDefault',
            active: settingSMSStockAlertURL.length > 0 ? true : false,
            alt: false,
			ctrl: false,
			shift: false
        }];
		
		return defaultList;
	},
	getDefaultKeys: function(id){
		switch(id){
		case 1:
			return 112; //f1
		case 2:
			return 113; //f2
		case 3:
			return 114; //f3
		case 4:
			return 115; //f4
		case 5:
			return 116; //f5
		case 6:
			return 117; //f6
		case 7:
			return 118; //f7
		case 8:
			return 119; //f8
		case 9:
			return 120; //f9
		case 10:
			return 121; //f10
		case 11:
			return 122; //f11
		case 12:
			return 123; //f12
		}
	},
	saveHotKeysMapping: function() {
		var list = [];
		for(var i=0; i<global_MappedKeys.bindings.length; i++){
			var bindingObj = global_MappedKeys.bindings[i];
			var obj = {
					key: bindingObj.key,
					id: bindingObj.id,
					alt: bindingObj.alt? true : false,
					ctrl: bindingObj.ctrl? true : false,
					shift: bindingObj.shift? true : false
			}
			list.push(obj);
		}
		
		var data = JSON.stringify(list);
		
		var saveUrl = addPath + 'tcplus/setting?a=set&sc=TCLHKM';
		var saveAjax = Ext.Ajax.request({
            url: saveUrl,
            method: 'POST',
            params:{p:data},
            success: function() {
                console.log('[HotKeys] save success');
            }
        });

    }
};