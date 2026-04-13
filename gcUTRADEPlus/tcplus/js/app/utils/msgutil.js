var msgutil = {
    debug: false,
    _boxPadding: 20,
    _maxMsgWidth: 400,
    singleBox: null,
    msg: function(msg, func, msgTitle, msgIcon, displayAtClick) { // default msg won't follow click position to display
        msgTitle = msgTitle || global_popUpMsgTitle;
        
        var appMainSize = n2nLayoutManager.getAppMain().getSize();
        var maxWidth = appMainSize.width - this._boxPadding;
        if (maxWidth > this._maxMsgWidth) {
            maxWidth = this._maxMsgWidth;
        }
        var alertBox = Ext.create('Ext.window.MessageBox', {
            constrain: true,
            winType: 'popup',
            alwaysOnTop: winAlwaysOnTop,
            listeners: this.getMsgBoxListeners(jsutil.getValue(displayAtClick, true))
        });
        alertBox.show({
            title: msgTitle,
            msg: this._fixMsg(msgTitle, msg),
            buttons: Ext.Msg.OK,
            icon: msgIcon,
            maxWidth: maxWidth,
            minWidth: 300,
            fn: func
        });
        
        return alertBox;
    },
    alert: function(msg, func, msgTitle, displayAtClick) { // alias for warn, afterward should use warn or info instead
        return this.warn(msg, func, msgTitle, displayAtClick);
    },
    warn: function(msg, func, msgTitle, displayAtClick) {
        if (N2N_CONFIG.enableToast) {
            return this.toast(msg, Ext.MessageBox.WARNING, func);
        } else {
            return this.msg(msg, func, msgTitle, Ext.MessageBox.WARNING, displayAtClick);
        }
    },
    info: function(msg, func, msgTitle, displayAtClick) {
        if (N2N_CONFIG.enableToast) {
            return this.toast(msg, Ext.MessageBox.INFO, func);
        } else {
            return this.msg(msg, func, msgTitle, Ext.MessageBox.INFO, displayAtClick);
        }
    },
    error: function(msg, func, msgTitle) {
        return this.msg(msg, func, msgTitle, Ext.MessageBox.WARNING, false);
    },
    prompt: function(msg, okFunc, msgTitle) {
        var appMainSize = n2nLayoutManager.getAppMain().getSize();

        var promptBox = Ext.create('Ext.window.MessageBox', {
            winType: 'popup',
            alwaysOnTop: winAlwaysOnTop,
            listeners: this.getMsgBoxListeners(true) // display at click position
        });
        
        this.addMboxEvents(promptBox);

        return promptBox.show({
            prompt: true,
            title: msgTitle || global_popUpMsgTitle,
            message: msg,
            buttons: Ext.MessageBox.OKCANCEL,
            fn: function(btn, value) {
                if (btn == 'ok') {
                    if (okFunc != undefined && typeof okFunc == 'function') {
                        okFunc(value);
                    }
                }
            },
            maxWidth: appMainSize.width - this._boxPadding,
            constrain: true,
            modal: mboxModal
        });

    },
    confirm: function(msg, func, msgTitle) {
        msgTitle = msgTitle || global_popUpMsgTitle;

        var appMainSize = n2nLayoutManager.getAppMain().getSize();
        var confirmWin = Ext.create('Ext.window.MessageBox', {
            winType: 'popup',
            alwaysOnTop: winAlwaysOnTop,
            listeners: this.getMsgBoxListeners(true) // display at click position
        });
        
        this.addMboxEvents(confirmWin);
        
        var msgObj = {
            title: msgTitle,
            msg: this._fixMsg(msgTitle, msg),
            icon: Ext.MessageBox.QUESTION,
            buttons: Ext.MessageBox.YESNO,
            buttonText: {yes: languageFormat.getLanguage(10011, 'Yes'), no: languageFormat.getLanguage(10014, 'No')},
            fn: func,
            maxWidth: appMainSize.width - this._boxPadding,
            constrain: true,
            modal: mboxModal
        };
        
        /*
        if (n2nLayoutManager.compWinX && n2nLayoutManager.compWinY) {
            Ext.applyIf(msgObj, {
                x: n2nLayoutManager.compWinX,
                y: n2nLayoutManager.compWinY
            });
        }
        */

        return confirmWin.show(msgObj);
    },
    show: function(msgObj) {
    	Ext.applyIf(msgObj, {
            title: global_popUpMsgTitle
        });
        if (isMobile) {
            var appMainSize = n2nLayoutManager.getAppMain().getSize();
            msgObj.width = appMainSize.width - this._boxPadding;
        }
        
        var msgBox = Ext.create('Ext.window.MessageBox', {
            constrain: true,
            winType: 'popup'
        });
        
        if (msgObj.modal && !mboxModal) { // force all modal to false (in firefox)
            msgObj.modal = false;
            this.addMboxEvents(msgBox);
        }
        
        var msgLis = this.getMsgBoxListeners(jsutil.getValue(msgObj.displayAtClick, true)); // default to display at click position
        if (msgObj.listeners) {
            Ext.merge(msgObj.listeners, msgLis);
        } else {
            msgObj.listeners = msgLis;
        }

        /*
        if (n2nLayoutManager.compWinX && n2nLayoutManager.compWinY) {
            Ext.appyIf(msgObj, {
                x: n2nLayoutManager.compWinX,
                y: n2nLayoutManager.compWinY
            });
            n2nLayoutManager.resetCompWinXY();
        }
        */
        
        return msgBox.show(msgObj);
    },
    popup: function(winObj) {
    	var me = this;
        
        Ext.applyIf(winObj, {
            modal: true,
            alwaysOnTop: winAlwaysOnTop,
            resizable: true,
            layout: 'fit',
            constrain: true
        });
        
        var replaceModal = !mboxModal && winObj.modal;
        if (replaceModal) {
            winObj.modal = false;
        }

        var autoShow = true;
        if (winObj.autoShow === false) {
            autoShow = false;
        } else {
            winObj.autoShow = false;
        }

        var msgLis = this.getMsgBoxListeners(jsutil.getValue(winObj.displayAtClick, true)); // default to display at click position
        if (winObj.listeners) {
            Ext.mergeIf(winObj.listeners, msgLis);
        } else {
            winObj.listeners = msgLis;
        }
        
        /*if (n2nLayoutManager.compWinX && n2nLayoutManager.compWinY) {
            Ext.applyIf(winObj, {
                x: n2nLayoutManager.compWinX,
                y: n2nLayoutManager.compWinY
            });
            n2nLayoutManager.resetCompWinXY();
        }*/

        if (isMobile) {
            var appSize = n2nLayoutManager.getAppMain().getSize();
            var winWidth = appSize.width - this._boxPadding;
            var winHeight = appSize.height;
            
            winObj.maxWidth = winWidth;
            winObj.maxHeight = winHeight;
            winObj.winType = 'popup';
            winObj.padding = 2;
            if (winObj.closable != false && !winObj.keepOriginalCloseButton) {
                winObj.tools = [
                    {
                        xtype: 'button',
                        iconCls: 'mobile-icon-close',
                        height: 23,
                        handler: function() {
                            popupWin.close();
                        }
                    }
                ];               
                winObj.closable = false;
            }
            winObj.closable = false;
            // winObj.autoSize = true;
        }     

        var popupWin = Ext.create('Ext.window.Window', winObj);
        if (replaceModal) {
            this.addMboxEvents(popupWin);
        }

        if (autoShow) {
            popupWin.show();
        }
        
        return popupWin;
    },
    reposition: function(win) {
        if (!win && !win.isXType('window')) {
            return;
        }
        
        if (this.debug) {
            console.log('msgutil > reposition', 'win', win);
        }
        var appMainSize = n2nLayoutManager.getAppMain().getSize();

        var newWidth = appMainSize.width - this._boxPadding;
        var newHeight = appMainSize.height;
        if (win.autoSize != true) {
            if (this.debug) {
                console.log('win.autoSize != true');
            }
            var winSize = win.getSize();
            if (winSize.width < newWidth) {
                newWidth = winSize.width;
            }
            if (winSize.height < newHeight) {
                newHeight = winSize.height;
            }
        }

        var newX = (appMainSize.width - newWidth) / 2;
        var newY = (n2nLayoutManager.getHeight() - newHeight) / 2;
        var defaultPos = this._boxPadding / 2;
        if (newX < defaultPos) {
            newX = defaultPos;
        }
        if (newY < defaultPos) {
            newY = defaultPos;
        }
        
        win.setSize(newWidth, newHeight);
        win.setPosition(newX, newY);
    },
    _fixMsg: function(title, msg) { // misaligned button issue // dirty hack
        var diffLength = title.length - msg.length;
        var minDiff = isMobile ? 0 : -1;
        if (diffLength > minDiff && diffLength <= 3) {
            msg = '&nbsp;' + msg + '&nbsp;&nbsp;';
        }

        return msg;
    },
    formatReg: /^{([^:]+):(.*)}$/gm,
    parseMsg: function(msg) {
        var me = this;

        if (msg && msg.length > 0) {
            var parts = msg.split(me.formatReg);

            if (parts && parts.length > 2) {
                var msgCode = parts[1].trim();
                var msgText = parts[2].trim();
                
                return languageFormat.getLanguage(msgCode, msgText);
            }
        }

        return msg;
    },
    join: function() {
        var s = '';

        for (var i = 0; i < arguments.length; i++) {
            s += arguments[i];
        }

        return s;
    },
    openFunc: null,
    openURL: function(options) {
        var me = this;

        var win = window.open(options.url, options.name || null, options.spec || null);

        if (win == null || typeof(win) == 'undefined') {
            me.openFunc = function() {
                var win2 = window.open(options.url, options.name || null, options.spec || null);
                if (win2) {
                    win2.focus();
                }
            };

            // creates a messagebox with custom link button
            var appMainSize = n2nLayoutManager.getAppMain().getSize();
            me.confirmWin = Ext.create('Ext.window.MessageBox', {
                winType: 'popup',
                alwaysOnTop: winAlwaysOnTop,
                listeners: Ext.apply({
                    destroy: function() {
                        me.openFunc = null;
                        me.confirmWin = null;
                    }
                }, this.getMsgBoxListeners(true))
            });
            me.confirmWin.show({
                title: global_popUpMsgTitle,
                msg: languageFormat.getLanguage(32000, "You are about to open a new tab. Proceed? <button onclick='msgutil.openFunc();msgutil.confirmWin.close();'>Yes</button><button onclick='msgutil.confirmWin.close();'>No</button>" +
                        "<br/>You may turn off the pop-up blocker in this browser settings."),
                icon: Ext.MessageBox.INFO,
                maxWidth: appMainSize.width - this._boxPadding,
                constrain: true
            });
        }

        return win;
    },
    mouseMsgBoxPosition: function(msgBox) {
        var msgSize = msgBox.getSize();
        var clickPos = n2nLayoutManager.getClickPosition();
        
        if (clickPos) {
            msgBox.setPosition(clickPos.x - (msgSize.width / 2), clickPos.y - (msgSize.height / 2));
            n2nLayoutManager.resetClickPosition();
        }       
        
    },
    getMsgBoxListeners: function(displayAtClick) {
        var me = this;
        var listeners = {};

        if (displayAtClick && N2N_CONFIG.confMsgBoxCenter) {
            listeners.show = function(thisMsgBox) {
                me.mouseMsgBoxPosition(thisMsgBox);
                
                // reset focus when displaying popup
                setTimeout(function() {
                    focusManager.resetActiveKeyScreen();
                }, 1);
                
            };
        }
        
        return listeners;
    },
    toast: function(msg, imgCls, func, displayDuration) {
        var me = this;

        var toastObj = {
            msg: msg,
            imgCls: imgCls,
            displayDuration: displayDuration,
            func: func
        };

        var pos = n2nLayoutManager.getClickPosition();
        if (pos) {
            toastObj.x = pos.x + 5;
            toastObj.y = pos.y + 5;
        }

        var toastBox = Ext.create('TCPlus.Toast', toastObj);

        return toastBox;
    },
    addMboxEvents: function(mbox) {
        var me = this;

        if (!mboxModal) {
            mbox.closeAction = 'destroy';
            
            mbox.on('afterrender', function(thisComp) {
                if (me.singleBox) { // close current message box if exists
                    me.singleBox.close();
                }

                me.singleBox = thisComp;
            });

            mbox.on('destroy', function(thisComp) {
                me.singleBox = null;
            });
        }
    }
};