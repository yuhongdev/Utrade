var N2NLoginStatus = (function(){
	
	var onLogin = false;
	var onReady = false;
	var onAliveSession = false;
	
	
	
	function setOnReady( validate ){
		if (validate == true){ //v1.3.33.49
			// topPanelBarPanel.setSignal("Loading");
		}
		onReady = validate;
	}
	function returnOnReady(){
		return onReady;		
	}
	
	

	function setOnLogin( validate ){
		if (validate == true){ //v1.3.33.49
			// topPanelBarPanel.setSignal("Loading");
		}
		onLogin = validate;
	}
	function returnOnLogin(){
		return onLogin;
	}
	
	
	
	
	
	function setOnAliveSession( validate ){
		if (validate == false){ //v1.3.33.49
			// topPanelBarPanel.setSignal("Offline");
		}
		onAliveSession = validate;
	}
	function returnOnAliveSession(){
		return onAliveSession;
	}
	
	
	
	
	function returnValidate(){
		var validate = true;
		
		if ( onLogin ) {
			validate = false;
		} else {
			if ( !onReady ) {
				validate = false;
			} else {
				if ( !onAliveSession ) {
					validate = false;
				}
			}
		}
		return validate;
	}
	
	
	
	return {
		setOnReady : setOnReady,
		returnOnReady : returnOnReady,
		
		
		setOnLogin : setOnLogin,
		returnOnLogin : returnOnLogin,
		
		
		setOnAliveSession : setOnAliveSession,
		returnOnAliveSession : returnOnAliveSession,
		
		
		returnValidate : returnValidate
	}
	
})();