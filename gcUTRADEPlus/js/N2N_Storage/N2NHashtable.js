function N2NHashtable(obj)
{
    this.length = 0;
    this.items = {};
	this.ExtComp = [];
    
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            this.items[p] = obj[p];
            this.length++;
        }
    }

    
    /**
     * Description <br/>
     * 
     * 		add new record or udpate record
     * 
     * @param {string}  key
     * @param {string}  value
     * 
     * @return {string}
     */
    this.setItem = function(key, value)
    {
    	// this variable is to return previous value
        var previous = null;
        
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        // update or add new value
        this.items[key] = value;
        
        return previous;
    }
    
    
    
    /**
     * Description <br/>
     * 
     * 		add new record or udpate record
     * 
     * 
     * @param {string}  key
     * @param {string}  value
     * 
     * @return {string}
     */
    this.put = function(key, value)
    {
    	var show = false;
    	
    	
    	// this variable is to return previous value
        var previous = null;
        if (this.hasItem(key)) {
            previous = this.items[key];
        }
        else {
            this.length++;
        }
        
        // update or add new value
        this.items[key] = value;
        
        return previous;
    }

    
    
    
    this.defineItemList = function(defObj)
    {
//    	var arrTemp = defObj;
    	for (var i = 0; i < defObj.length; i++) 
//    		console.log("N2NHash::define:"+defObj[i]);
    	
    	this.items[key] = "";
    	
//    	return arrTemp;
    }
    
    
    
    /**
     * Description <br/>
     * 
     *		get item value bu key
     *
     * @param 	{string}  key
     * 
     * @return 	{string}
     */
    this.getItem = function(key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    }

    
    
    /**
     * Description <br/>
     * 
     *		get item value bu key
     *
     * @param 	{string}  key
     * 
     * @return 	{string}
     */
    this.get = function(key) {
        return this.hasItem(key) ? this.items[key] : undefined;
    };
    
    
    
    /**
     * Description <br/>
     * 
     *		check storage exist the key mapping 
     *
     * @param 	{string}  key
     * 
     * @return 	{boolean}
     */
    this.hasItem = function(key)
    {
        return this.items.hasOwnProperty(key);
    }
   
    
    
    /**
     * Description <br/>
     * 
     *		remove storage record by key 
     *
     * @param 	{string}  key
     * 
     * @return 	{null / string}
     */
    this.removeItem = function(key)
    {
        if (this.hasItem(key)) {
            previous = this.items[key];
            this.length--;
            delete this.items[key];
            return previous;
        }
        else {
            return undefined;
        }
    }
    
    

    /**
     * Description <br/>
     * 
     *		return storage all key
     *
     * @return 	{array<string>}
     */
    this.keys = function()
    {
        var keys = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    
    
    /**
     * Description <br/>
     * 
     *		return storage all value
     *
     * @return 	{array<string>}
     */
    this.values = function()
    {
        var values = [];
        for (var k in this.items) {
            if (this.hasItem(k)) {
                values.push(this.items[k]);
            }
        }
        return values;
    }

    
    /**
     * Description <br/>
     * 
     * 		add new component id
     * 
     * @param {Ext.Component}   ExtComp
     */
    this.addComp = function(ExtComp){
    	var allowToAdd = true;
    	
    	if (this.hashComp(ExtComp)){
    		allowToAdd = false;
    	}
    	
    	if (allowToAdd) {
    		this.ExtComp.push(ExtComp);
    	}
    }
    
    
    /**
     * Description <br/>
     * 
     * 		remove component id
     * 
     * @param {Ext.Component}  ExtComp
     */
    this.removeComp = function(ExtComp){
    	for (var i = 0; i < this.ExtComp.length; i ++) {
    		if (this.ExtComp[i].getId() == ExtComp.getId()) {
    			this.ExtComp.splice(i, 1);
    		}
    	}
    }
    
    /**
     * Description <br/>
     * 
     * 		check have the component in subscription 
     * 
     * @param {Ext.Component}  ExtComp
     * 
     * @return {boolean}
     */
    this.hashComp = function(ExtComp){
    	var returnBoolean = false;
    	
    	for (var i = 0; i < this.ExtComp.length; i ++) {
    		if (this.ExtComp[i].getId() == ExtComp.getId()) {
    			returnBoolean = true;
        	}
    	}
    	
    	return returnBoolean;
    }
    
    
    /**
     * Description <br/>
     * 
     * 		process update record
     */
    this.procComp = function(dataObj){
    	var thisItem = this.items;

    	if(thisItem[fieldTransAction]){
    		dataObj[fieldTransAction] = thisItem[fieldTransAction];	
    	}
    	
    	pushTrackerUpdate = true;
    	for (var i = 0; i < this.ExtComp.length; i ++) {

    		if (this.ExtComp[i] != null) {
    			if(trackerUpdate.length > 0){
    				if(this.ExtComp[i].comp == "tracker"){
    					var tempTrackerExchange = formatutils.getExchangeFromStockCode(this.ExtComp[i].stkcode);
    					for(var j = 0; j < trackerStopPushExchange.length; j++){
    						if(tempTrackerExchange == trackerStopPushExchange[j]){
    							pushTrackerUpdate = false;
    							break;
    						}
    					}
    				}
    			}

    			if(pushTrackerUpdate){
    				if (typeof this.ExtComp[i].updateFeedRecord == "function") {
    					this.ExtComp[i].updateFeedRecord(dataObj);
    				}
    			}
    		}
    	}
    }
    
    
    /**
     * Description <br/>
     * 
     * 		looping storage record and process function pass in 
     * 
     * @param {function(key, object)}  fn
     */
    this.each = function(fn) {
        for (var k in this.items) {
            if (this.hasItem(k)) {
                fn(k, this.items[k]);
            }
        }
    }

    
    
    /**
     * Description <br/>
     * 
     * 		reset storage or clear storage
     * 
     */
    this.clear = function()
    {
        this.items = {}
        this.length = 0;
        this.ExtComp = [];
    }
}