/**
 * Provides debugging utilities
 */

var debugutil = {
    debugMode: N2N_CONFIG.fDebug,
    debugStart: debugStart, // From main.jsp
    /**
     * Displays debug messages
     * 
     * @param {string} debugTitle Debug Title (can be function name/section title)
     * @param {object} debugCodes Codes to debug
     * @param {exception} exceptions Exception object
     * @param {boolean} printStack Whether to print stack of exception
     */
    debug: function(debugTitle, debugCodes, exceptions, printStack) {
        // display debug messages only debugMode is ON
        if (this.debugMode) {
            if (debugTitle !== '') {
                debugTitle = 'DEBUGGING >>> ' + debugTitle;
                if (exceptions !== undefined) {
                    debugTitle += ' > exception';
                }
                console.log(debugTitle);
            }

            if (debugCodes !== undefined) {
                if (typeof debugCodes === 'object') {
                    for (var i in debugCodes) {
                        console.log(i);
                        console.log(debugCodes[i]);
                    }
                } else if (typeof debugCodes === 'string') {
                    console.log(debugCodes);
                }
            }

            if (exceptions !== undefined) {
                console.log(exceptions);

                if (printStack !== undefined && printStack) {
                    console.log(exceptions.stack);
                }
            }
        }
    },
    /**
     * Displays debug time messages: start, end, duration
     */
    showDebugTime: function() {
        if (this.debugMode) {
            console.log('DEBUG START >>> ' + this.debugStart);
            var debugEnd = new Date().getTime();
            console.log('DEBUG END >>> ' + debugEnd);
            console.log('DEBUG DURATION >>> ' + (debugEnd - this.debugStart) / 1000 + 's');
        }
    }
};