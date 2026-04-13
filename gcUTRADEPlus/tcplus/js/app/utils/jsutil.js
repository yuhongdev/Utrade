/*
 * Provides common javascript utilities in pure js codes 
 * 
 */

var jsutil = {
    /**
     * Checks whether object is empty
     * 
     * @param {object} obj Object to check
     * @returns {Boolean} true if object is empty ({}) otherwise false
     */
    isEmptyObject: function(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return true;
    },
    /**
     * Checks a value is empty or not
     * 
     * @param {mixed} value Value to check
     * @returns {Boolean} true if empty otherwise false
     */
    isEmpty: function(value) {
        if (value == null) // null or undefined
            return true;
        if (typeof value === 'string' && value === '') // empty string
            return true;
        if (typeof value === 'object' && this.isEmptyObject(value)) // empty array, object
            return true;

        return false;
    },
    toBoolean: function(value) {
        var bool = false;

        switch (value) {
            case 1:
            case '1':
            case 'true':
            case 'TRUE':
            case true:
                bool = true;
                break;
        }

        return bool;
    },
    boolToStr: function(bool, trueStr, falseStr) {
        if (bool) {
            return trueStr;
        } else {
            return falseStr;
        }
    },
    arrayEqual: function(array1, array2, ignoreOrder) {
        if (array1.length !== array2.length)
            return false;

        var ignore = ignoreOrder != undefined ? ignoreOrder : true;
        var arrStr1 = '';
        var arrStr2 = '';

        if (ignore) {
            arrStr1 = array1.slice().sort().join(",");
            arrStr2 = array2.slice().sort().join(",");
        } else {
            arrStr1 = array1.slice().join(",");
            arrStr2 = array2.slice().join(",");
        }

        return arrStr1 === arrStr2;
    },
    arrayMoveFront: function(arr, ele) {
        for (var i = 0; i < arr.length; i++) {
            var val = arr[i];
            if (val === ele) {
                arr.splice(i, 1);
                arr.unshift(ele);
                break;
            }
        }
    },
    toHtml: function(str) {
        return str.replace(/ /g, '&nbsp;');
    },
    arrayUnique: function(a) {

        return a.reduce(function(p, c) {
            if (p.indexOf(c) < 0)
                p.push(c);
            return p;
        }, []);
    },
    arrayRemoveElement: function(arr, val, removeAllEl) {
        if (arr) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === val) {
                    arr.splice(i, 1);
                    if (removeAllEl) {
                        break;
                    }
                }
            }
        }
        
        return arr;
    },
    arrayObjIndex: function(arr, key, value) {
        for (var i = 0; i < arr.length; i++) {
            var obj = arr[i];
            if (typeof(obj) === 'object') {
                if (obj[key] == value) {
                    return i;
                }
            }
        }

        return -1;
    },
    getDecNum: function(num) {
        return (num.toString().split('.')[1] || []).length;
    },
    getExtNumFormat: function(decNum, skipFirst0) {
        var numFormat = '';
        if (!skipFirst0) {
            numFormat = '0';
        }

        if (decNum > 0) {
            numFormat += '.';
            for (var i = 0; i < decNum; i++) {
                numFormat += '0';
            }
        }

        return numFormat;
    },
    // parse date and format date as string
    formatDate: function (value) {
        var dateStr = "";

        if (value) {
            var dateObj = Ext.Date.parse(value, "Ymd");
            dateStr = Ext.util.Format.date(dateObj, 'd/m/Y');
        }

        return dateStr;
    },
    objectToString: function(obj, separator) {
        var arrVal = new Array();

        for (var k in obj) {
            arrVal.push(obj[k]);
        }

        return arrVal.join(separator);
    },      
    getArraySorter: function(field, fn, reverse) {
        var key = fn ?
                function(x) {
                    return fn(x[field]);
                } :
                function(x) {
                    return x[field];
                };

        reverse = [1, -1][+!!reverse];

        return function(a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        };
    },
    getValue: function(value, def) {
        if (value != null || def == null) {
            return value;
        } else if (def != null) {
            return def;
        }
    },
	runFn: function(fn, args, scope) { // scope is a context for this
        fn = (typeof fn === 'function') ? fn : window[fn];

        return fn.apply(scope, args);

    },
    getFloat: function(val, defVal, dec) {

        if (typeof val === 'string') {
            val = val.trim();
            if (val === '') {
                return defVal || 0;
            }
        }

        if (val != null && !isNaN(val)) {
            if (dec) {
                return parseFloat(parseFloat(val).toFixed(dec));
            } else {
                return parseFloat(val);
            }
        } else {
            return defVal || 0;
        }
    },
    getNum: function(val, defVal, dec, displayZeroDec) { // enhanced function from getFloat
        var fVal = parseFloat(val);

        if (!isNaN(fVal)) {
            if (dec >= 0) {
                if (displayZeroDec) {
                    return fVal.toFixed(dec);
                } else {
                    return parseFloat(fVal.toFixed(dec));
                }
            } else {
                return fVal;
            }
        } else {
            return defVal !== undefined ? defVal : 0;
        }
    },
    getRound: function(val, defVal) {
        if (!isNaN(val)) {
            return parseInt(parseFloat(val).toFixed(0));
        } else {
            return defVal || 0;
        }
    },
    getNumFromFormat: function(numStr, defVal) {
        defVal = defVal || null;
        
        if (numStr == null) {
            return defVal;
        }

        var num = String(numStr).replace(/,/g, '');
        num = parseFloat(num);
        if (isNaN(num)) {
            return defVal;
        } else {
            return num;
        }
    },
    getNumFromRound: function(roundStr) {
        roundStr = String(roundStr);
        roundStr = roundStr.trim().toUpperCase();

        if (N2N_CONFIG.roundNegQtyReg.test(roundStr)) {
            // remove comma
            roundStr = roundStr.replace(/,/g, '');
        
            if (roundStr.endsWith('K')) {
                var numArr = roundStr.split('K');
                roundStr = numArr[0] * 1.0e+3;
            } else if (roundStr.endsWith('M')) {
                var numArr = roundStr.split('M');
                roundStr = numArr[0] * 1.0e+6;
            } else if (roundStr.endsWith('B')) {
                var numArr = roundStr.split('B');
                roundStr = numArr[0] * 1.0e+9;
            }

            return parseInt(roundStr, 10);
        }

        return null;
    },
    isPrintableKey: function(keycode) {
        return (keycode > 47 && keycode < 58) || // number keys
                // keycode == 32 || // spacebar
                (keycode > 64 && keycode < 91) || // letter keys
                (keycode > 95 && keycode < 112) || // numpad keys
                (keycode > 185 && keycode < 193) || // ;=,-./` (in order)
                (keycode > 218 && keycode < 223);   // [\]' (in order)
    }        
};
