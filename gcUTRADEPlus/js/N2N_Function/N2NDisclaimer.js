var N2NDisclaimer = (function() {
    var tWindow_Window = null;
    var validationStatus = true;
    var buttonList = [];
    var disAjax = null;
    var funcs = []; // to solve multiple disclaimer issue
    //retry 3 times when ajax hit chkDisclaimer is failed
    var agree = 3;

    function runAllFuncs() {
        for (var i = 0; i < funcs.length; i++) {
            var fn = funcs[i];
            if (typeof window[fn.f] == 'function') {
                window[fn.f].apply(null, fn.p);
            }
        }

        funcs = []; // empty func
    }

    function validation(funcName, funcParam) {
        var returnValue = false;

        if (disclaimerAvailble && validationStatus) {
            funcs.push({
                f: funcName,
                p: funcParam
            });

            // avoid multi disclaimers
            if (!tWindow_Window) {
                _procButtonType();
                _openDisclaimerWindow();
            }

            returnValue = true;
        }

        return returnValue;
    }

    function chkDisclaimerValidation(funcName, funcParam) {
        var isFirstCheck = true;

        if (disclaimerAvailble) {
            if (firsttimeportfolio) {
                funcs.push({
                    f: funcName,
                    p: funcParam
                });

                if (!disAjax) {
                    _procAjaxConfirm();
                }
            } else {
                isFirstCheck = false;
            }
        }

        return isFirstCheck;
    }

    function _procButtonType() {
        buttonList = [];

        if (disclaimerBtnType == 'OK') {
            buttonList.push({
                text: 'OK',
                handler: function() {
                    _procConfirmation(true);
                }
            });

        } else if (disclaimerBtnType == "AGREED/NOT") {
            buttonList.push({
                text: 'AGREED',
                handler: function() {
                    _procConfirmation(true);
                }
            });

            buttonList.push({
                text: 'NOT AGREED',
                handler: function() {
                    _procConfirmation(false);
                }
            });

        } else if (disclaimerBtnType == "ACCEPT/DECLINE") {
            buttonList.push({
                text: 'ACCEPT',
                handler: function() {
                    _procConfirmation(true);
                }
            });

            buttonList.push({
                text: 'DECLINE',
                handler: function() {
                    _procConfirmation(false);
                }
            });
        }

    }

    function _openDisclaimerWindow() {
        var htmlDesign = '<iframe width="100%" height="100%" frameborder="0" scrolling="auto" src="disclaimer.jsp?' + new Date().getTime() + '"> </iframe> ';

        tWindow_Window = msgutil.popup({
            title: "Disclaimer",
            width: disclaimerWidth, // main.jsp
            height: disclaimerHeight, // main.jsp
            plain: true,
            closable: false,
            resizable: false,
            dislayAtClick: false,
            items: {
                xtype: 'container',
                html: htmlDesign,
                style: 'overflow: auto; -webkit-overflow-scrolling: touch;'
            },
            buttons: buttonList,
            listeners: {
                destroy: function() {
                    tWindow_Window = null;
                }
            }
        });
    }

    function _procConfirmation(status) {
        if (status) {
            if (portFolioDisclaimerSessionShare.toLowerCase() == 'true') {
                _chkDisclaimer();
            } else {
                validationStatus = false;
                tWindow_Window.destroy();
                runAllFuncs();
            }

        } else {
            tWindow_Window.destroy();
            funcs = [];
        }

    }

    function _procAjaxConfirm() {
        var tempUrl = [];
        // tempUrl.push(addPath + 'chkDisclaimer.jsp'); // for localhost run this
        tempUrl.push('chkDisclaimer.jsp'); // for confWMSServer=TRUE when deploy to server

        var url = tempUrl.join('');

        disAjax = Ext.Ajax.request({
            url: url,
            method: 'POST',
            success: function(response) {
                try {
                    var obj = Ext.decode(response.responseText);

                    if (obj) {
                        if (obj.s == false) {
                            // validationStatus = true;
                            firsttimeportfolio = true;
                            _procButtonType();
                            _openDisclaimerWindow();
                        } else {
                            // validationStatus = false;
                            firsttimeportfolio = false;
                            runAllFuncs();
                        }
                    }
                } catch (e) {
                    console.log('[N2NDisclaimer][_procConfirmation][inner] Exception ---> ' + e);
                }

            },
            failure: function(response) {
                console.log('[N2NDisclaimer][_procConfirmation] failure ---> ' + response.responseText);
            },
            callback: function() {
                disAjax = null;
            }
        });
    }

    function _chkDisclaimer() {
        Ext.Ajax.request({
            url: 'chkDisclaimer.jsp?act=agree',
            method: 'GET',
            success: function(response) {
                var text = response.responseText;
                var obj = null;
                try {
                    obj = Ext.decode(text);
                } catch (e) {
                    console.log('[N2NDisclaimer][_chkDisclaimer][inner] Exception ---> ' + e);
                }

                if (obj && obj.s == true) {
                    firsttimeportfolio = false;
                    tWindow_Window.destroy();
                    runAllFuncs();
                }
            },
            failure: function() {
                if (agree-- > 0) {
                    console.log('[N2NDisclaimer][_chkDisclaimer] failure (trying again)---> ' + response.responseText);
                    _chkDisclaimer();
                }
                else {
                    console.log('[N2NDisclaimer][_chkDisclaimer] failure ---> ' + response.responseText);
                }
            }
        });
    }


    return {
        validation: validation,
        chkDisclaimerValidation: chkDisclaimerValidation
    };

})();