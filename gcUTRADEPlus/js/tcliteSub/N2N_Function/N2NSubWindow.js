var N2NSubWindow = (function(){
	
//	var currentWindow = [];
	
	var currentWindow = null;
	
	function open(){
//		currentWindow.push( window.open( "childWindow.jsp", null, "height=115px, width=920px, status=no, resizable=no" ) );
		
		if ( currentWindow != null ) {
			currentWindow.close();
		}
		
                currentWindow = msgutil.openURL({
                    url: "childWindow.jsp",
                    name: "menubar=no, status=no, resizable=no, directories=no, location=no, width=180, height=180"
                });
	}
	
	
        function close() {
            if (currentWindow) {
                currentWindow.close();
                currentWindow = null;
            }
        }
	
	return {
		open : open,
		close : close
	};
	
})();