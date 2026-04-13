var languageTable = new N2NHashtable();

var languageFormat = (function(){

function setLanguage(languageArr){
	
	for(var langObj in languageArr){
		languageTable.put(langObj, languageArr[langObj]);
	}
	
}

function getLanguage(id, defaultLanguage, params){
        defaultLanguage = defaultLanguage || '';
	var languageString = '';
			
	if(existLanguageFile == 'true'){
		languageString = languageTable.get(id);
	}
	
	if(languageString == null || languageString == ''){
		languageString = defaultLanguage;
	}
	
	if(params != undefined){
		var tempString = languageString.replace(/\[(.*?)\]/g, '$1');
                
                // need to convert to string, since split() is available for string or raises exception
                if (typeof params !== 'string') {
                    params = params.toString();
                }

                // need to convert to string, since split() is available for string or raises exception
                if (typeof params !== 'string') {
                    params = params.toString();
                }

		var tempParams = params.split('|');
		
		for (var i=0; i<tempParams.length; i++){
			tempString = tempString.replace('PARAM' + i, tempParams[i]);
		}
		languageString = tempString;
	}
	
	return languageString;
}

return {
	setLanguage	: setLanguage,
	getLanguage	: getLanguage
};


}());
