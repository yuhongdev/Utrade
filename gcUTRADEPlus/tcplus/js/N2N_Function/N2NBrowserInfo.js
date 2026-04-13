var N2NBrowserInfo = (function(){
	
	var browserInfo = null;
	
	
	function returnBrowserVersion() {
		
		if ( browserInfo == null )
			browserInfo = _generateInfo();
		
		return browserInfo.fullVersion;
	}
	
	function returnBrowserType() {
		
		if ( browserInfo == null )
			browserInfo = _generateInfo();
		
		return browserInfo.type;
	}
	
	function returnOSType() {
		
		if ( browserInfo == null )
			browserInfo = _generateInfo();
		
		return browserInfo.osType;
	}
	
	function returnBrowserMainVersion() {
		
		if ( browserInfo == null )
			browserInfo = _generateInfo();
		
		return browserInfo.mainVersion;
	}
	
	
	
	
	function _generateInfo(){
		
		var OSName 			= "Unknown OS";
		var nAgt 			= navigator.userAgent;
		var majorVersion 	= parseInt( navigator.appVersion, 10 );
		var fullVersion  	= '' + parseFloat( navigator.appVersion );
		var browserName 	= nAgt;
		
		var verOffset, ix;

		if ( ( verOffset = nAgt.indexOf("Chrome") ) != -1 ) {
			browserName = "Chrome";
			fullVersion = nAgt.substring( verOffset + 7 );

		} else if ( ( verOffset = nAgt.indexOf("Firefox") ) != -1 ) {
			browserName = "Firefox";
			fullVersion = nAgt.substring( verOffset + 8 );

		} else if ( ( verOffset = nAgt.indexOf("Safari") ) != -1 ) {
			browserName = "Safari";
			fullVersion = nAgt.substring( verOffset + 7 );

			if ( ( verOffset = nAgt.indexOf("Version") ) != -1 ) 
				fullVersion = nAgt.substring( verOffset + 8 );
			
		} else if ( ( verOffset = nAgt.indexOf("Opera") ) != -1 ) {
			browserName = "Opera";
			fullVersion = nAgt.substring( verOffset + 6 );
			
			if ( ( verOffset = nAgt.indexOf("Version") ) != -1) 
				fullVersion = nAgt.substring( verOffset + 8 );
		}
		
		if ( navigator.appVersion.indexOf("Win") != -1 ) 
			OSName = "Windows";
		if ( navigator.appVersion.indexOf("Mac") != -1 )
			OSName = "MacOS";
		if ( navigator.appVersion.indexOf("X11") != -1 )
			OSName = "UNIX";
		if ( navigator.appVersion.indexOf("Linux") != -1 )
			OSName = "Linux";
		

		
		if ( ( ix = fullVersion.indexOf(";") ) != -1 )
			fullVersion = fullVersion.substring( 0, ix );
		
		if ( ( ix = fullVersion.indexOf(" ") ) != -1 )
			fullVersion = fullVersion.substring( 0, ix );
		
		
		majorVersion = parseInt('' + fullVersion, 10);
		
		if ( isNaN( majorVersion ) ) {
			fullVersion  = '' + parseFloat( navigator.appVersion ); 
			majorVersion = parseInt( navigator.appVersion, 10);
		}
		
		return {
				type 			: browserName,
				mainVersion 	: majorVersion,
				fullVersion 	: fullVersion,
				osType			: OSName
		};
	}
	

	return {
		returnBrowserVersion 	: returnBrowserVersion,
		returnBrowserType		: returnBrowserType,
		returnOSType			: returnOSType,
		returnBrowserMainVersion: returnBrowserMainVersion
	}
	
	
}());
