/**
 * @include "log4javascript.js"
 */
var logger = (function() {
	var log = null;

	/**
	 * Initialize the log4javascript.
	 * Log is enabled if debug=1 is present at the query string.
	 * It should be called when loading the main page.
	 */
	function init() {
		var d = getQueryParam('debug');
		DEBUG = isLocalhost();
		if (!DEBUG)
			DEBUG = (d == '1' ? true : false);
			
		log4javascript.setEnabled(DEBUG);
		log = log4javascript.getDefaultLogger();
		log.setLevel(log4javascript.Level.ALL);
	}

	/**
	 * Logs at level TRACE.
	 * Should be used to log method calls.
	 * Please refer to http://log4javascript.org/docs/manual.html#loggers
	 */
	function _trace(a) {
		if (!validate())
			return;
			
		log.trace(a);
	}

	/**
	 * Logs at level DEBUG.
	 * Should be used to log ajax response.
	 * Please refer to http://log4javascript.org/docs/manual.html#loggers
	 */
	function _debug(a) {
		if (!validate())
			return;
		
		log.debug(a);
	}

	/**
	 * Logs at level INFO.
	 * Should be used to log javascript object/JSON response.
	 * Can be used to log other useful info.
	 * Please refer to http://log4javascript.org/docs/manual.html#loggers
	 */
	function _info(a) {
		if (!validate())
			return;
		
		log.info(a);
	}

	/**
	 * Logs at level ERROR.
	 * Should be used to log exceptions.
	 * Please refer to http://log4javascript.org/docs/manual.html#loggers
	 */
	function _error(a, ex) {
		if (!validate())
			return;
		
		log.error(a, ex);
	}
	
	function _warn(ex) {
		if (!validate())
			return;
		
		log.warn(ex);
	}
	
	function _group(a, expanded) {
		if (!validate())
			return;
			
		log.group(a, expanded);
	}
	
	function _groupEnd() {
		if (!validate())
			return;

		log.groupEnd();
	}
	
	/**
	 * Checks whether to perform logging.
	 * @return {boolean}
	 */
	function validate() {
		if (DEBUG == false || !log)
			return false;
			
		return true;
	}

	/**
	 * Get query string parameter.
	 */
	function getQueryParam(name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
		var regexS = "[\\?&]" + name + "=([^&#]*)";
		var regex = new RegExp(regexS);
		var a = isInIFrame();
		var h = (a == true ? window.parent.location.href : window.location.href);
		var results = regex.exec(h);

		if (results == null)
			return "";

		else
			return results[1];
	}
	
	/**
	 * Checks whether the page is loaded in iframe.
	 */
	function isInIFrame() {
		var a = (window.location != window.parent.location ? true : false);
		return a;
	}

	/**
	 * Checks whether the page is running in localhost.
	 */
	function isLocalhost() {
		var a = isInIFrame();
		var h = (a == true ? window.parent.location : window.location);
		//return (h.hostname == 'localhost' ? true : false);
		return false;
	}

	return {
		init: init,
		trace: _trace,
		debug: _debug,
		info: _info,
		error: _error,
		warn: _warn,
		group: _group,
		groupEnd: _groupEnd
	};
}());