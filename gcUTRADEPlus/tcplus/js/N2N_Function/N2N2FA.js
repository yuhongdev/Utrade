var N2N2FA = (function() {

    var tCombo_Device = null;
    var tField_PinPass = null;
    var tCombo_MobileDevice = null;
    var tButton_OTPviaSMS = null;
    var tField_SMSPass = null;
    var tPanel_MainPanel = null;
    var tWindow_Window = null;
    var tLoadMask_Main = null;
    var tPanel_tokenOTP = null;
    var tPanel_smsOTP = null;
    var tField_SMSContainer = null;
    var delayedParams = {};
    var comps = {};
    
    global_s2FAMode = mode2FAToken;

    function return2FAValidate(type, args, conf, tabCt) {
        var returnValue = true;
        var isRequest = false;
    	if((global_s2FARequire == 'true' && global_s2FABypass == 'YES' && (global_s2FADeviceList.length > 0 || global_s2FAMobileDevice.length > 0)) || (global_s2FARequire == 'true' && global_s2FABypass == 'NO') ){
            if (global_s2FAValidate == "true") {
                returnValue = true;
            } else {
                isRequest = true;
                returnValue = false;
            }
        } else {
            returnValue = true;
        }


        if (isRequest) {
            _generateWindow(type, args, conf, tabCt);
        }

        return returnValue;
    }


    function set2FAValidate(validate) {
        global_s2FAValidate = validate;
    }

    function set2FADeviceInfo(deviceID) {
        global_s2FADevice = deviceID;
    }
    function get2FADeviceInfo( ) {
        return global_s2FADevice;
    }

    function _generateWindow(type, args, conf, tabCt) {
        delayedParams[type] = {
            type: type,
            args: args,
            conf: conf,
            tabCt: tabCt
        };

        // display only one OTP window
        if (tWindow_Window) {
            return;
        }

        var deviceList = [];
        if (global_s2FADeviceList != null) {
            var temp = global_s2FADeviceList.split(",");
            for (var i = 0; i < temp.length; i++) {
                var value = temp[i];
                if (value != "") {
                    deviceList.push([value, value]);
                }
            }
        }

        tCombo_Device = new Ext.form.field.ComboBox({
            fieldLabel: languageFormat.getLanguage(21063, 'Device'),
            width: 300,
            store: new Ext.data.ArrayStore({
                fields: ['value', 'displayText'],
                data: deviceList
            }),
            triggerAction: 'all',
            mode: 'local',
            valueField: 'value',
            displayField: 'displayText',
            editable: false,
            value: (deviceList.length > 0) ? deviceList[0][0] : ''
        });

        tField_PinPass = new Ext.form.field.Text({
            fieldLabel: languageFormat.getLanguage(21064, 'OTP'),
            width: 300,
            inputType: 'password',
            listeners: {
                specialkey: function (field, e) {
                    // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                    // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
                    if (e.getKey() == e.ENTER) {
                    	global_s2FAMode = mode2FAToken; 
                    	_submitForm();
                    }
                }
            }
        });
        
        var tokenImagePanel = new Ext.container.Container({
            border: false,
            items:
                    [{width: "100%",
                            border: false,
                            html: '<div style="float:left;padding-right:10px;height:101px"><div align="left" class="fa-one-key"></div></div><div style="float:left;width:255px;">'+ languageFormat.getLanguage(30804, 'The OneKey Token provides added security to your Online Trading Experience. It is also a personal device which allows you to generate a One Time Password for use of CIMB Securities Services.') + '</div><div style="padding-top:5px;float:left; "><a href="https://www.itradecimb.com.sg/app/help.client.services.z?cat=01&subcat=01_02&subsubcat=40288c9f3ae4c28e013afd79dbd7020d" target="_blank"><div class="fa-learn-more"></div></div>'}]

        });
        
        var str = global_s2FAMobileDevice;
        tCombo_MobileDevice = new Ext.form.field.Display({
            fieldLabel: languageFormat.getLanguage(21071, 'Mobile'),
            width: 300,
            mobileNo: global_s2FAMobileDevice,
            value: str = str.replace(/.(?=.{4})/g, 'x')
        });
        
        tButton_OTPviaSMS = new Ext.button.Button({
        	text: languageFormat.getLanguage(21070, 'OTP via SMS'),
        	cls: 'flatbtn',
        	handler: function(thisBtn) {
        		thisBtn.disable();
        		tField_SMSRandomChar.setValue('');
        		_requestOTP(thisBtn); //trigger for request OTP
        		setTimeout(function(){thisBtn.enable();}, global_s2FASMSOTPInt);
        	}
        });
        
        tField_SMSRandomChar = new Ext.form.field.Text({
            width: 50,
            readOnly: true,
            margin: '0 5 0 0'
        });

        tField_SMSPass = new Ext.form.field.Text({
        	enforceMaxLength: true,
        	maxLength: 6,
        	maskRe: /[0-9.]/,
            inputType: 'password',
            margin: '0 5 0 0',
            listeners: {
                specialkey: function (field, e) {
                    // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                    // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
                    if (e.getKey() == e.ENTER) {
                    	global_s2FAMode = mode2FAMobile; 
                    	_submitForm();
                    }
                }
            }
//			emptyText	: 'Key in password to validation'
        });
        
        tField_SMSContainer = new Ext.form.FieldContainer({
        	layout: 'hbox',
        	fieldLabel: languageFormat.getLanguage(21064, 'OTP'),
        	items:[tField_SMSRandomChar, tField_SMSPass, tButton_OTPviaSMS]
        });
        
        var smsImagePanel = new Ext.container.Container({
            border: false,
            items:
                    [{width: "100%",
                            border: false,
                            html: '<div style="float:left;padding-right:10px;height:101px"><div align="left" class="fa-otp-phone"></div></div><div style="float:left;width:255px;">'+ '<ol><li>Click the <b>"OTP via SMS"</b> button to retrieve your one time password (OTP).</li><li>Enter the OTP number sent to your mobile number.</li><li>Click on the check button to proceed.</li></ol>' + '</div>'}]

        });
        
        var tabItemList = [];
        
        tPanel_tokenOTP = Ext.create("Ext.panel.Panel", {
            title: languageFormat.getLanguage(21068, 'Token OTP'),
            itemId: 'tokenOTP',
            disabled: deviceList.length > 0 ? false : true,
            items: [{
                xtype: 'fieldset',
                title: languageFormat.getLanguage(21062, 'Client Account'),
                collapsible: false,
                autoHeight: true,
                items: [
                    tCombo_Device,
                    tField_PinPass,
                    tokenImagePanel]
            }]
        });
        tabItemList.push(tPanel_tokenOTP);
        
        tPanel_smsOTP = Ext.create("Ext.panel.Panel", {
            title: languageFormat.getLanguage(21069, 'SMS OTP'),
            itemId: 'smsOTP',
            disabled: global_s2FAMobileDevice.length > 0 ? false : true,
            items: [{
                xtype: 'fieldset',
                title: languageFormat.getLanguage(21062, 'Client Account'),
                collapsible: false,
                autoHeight: true,
                items: [
                    tCombo_MobileDevice,
                    tField_SMSContainer,
                    smsImagePanel]
            }]
        });
        tabItemList.push(tPanel_smsOTP);

        var formPanel = new Ext.tab.Panel({
            layout: {
            	type: 'form'
            },
            border: false,
            style: 'padding:8px;padding-bottom:0px;',
            activeTab: deviceList.length > 0 ? 0 : 1,
            items: tabItemList
        });

        var btnPanel = new Ext.container.Container({
            border: false,
            layout: {
            	type: 'hbox',
            	pack: 'center',
            	align: 'middle'
            },
          //  layoutConfig: {pack: 'center', align: 'middle'},
            items: [
                new Ext.button.Button({
                    text: languageFormat.getLanguage(20849, 'Submit'),
                    tooltip: languageFormat.getLanguage(20849, 'Submit'),
                    cls: 'fix_btn',
                    iconCls: 'fa-submit',
                    handler: function() {
                    	global_s2FAMode = mode2FAToken;
                    	var activeTab = formPanel.getActiveTab();
                    	var source = '';
                    	if(activeTab){
                    		if(activeTab.itemId == 'smsOTP'){
                    			global_s2FAMode = mode2FAMobile;
                    		}
                    	}
                        _submitForm();
                    }
               }),
                {html: "&nbsp;&nbsp;&nbsp;&nbsp;", border: false},
                new Ext.button.Button({
                    text: languageFormat.getLanguage(10010, 'Cancel'),
                    tooltip: languageFormat.getLanguage(10010, 'Cancel'),
                    cls: 'fix_btn',
                    iconCls: 'fa-cancel',
                    handler: function() {
                        tWindow_Window.close();
                    }
                })

            ]


        });

        tPanel_MainPanel = new Ext.panel.Panel({
            items: [formPanel, btnPanel],
            border: false,
            bbar: {
                items: [languageFormat.getLanguage(30805, 'Please choose a Device and key in OTP')]
            }
        });

        /*
         tCombo_Device = new Ext.form.ComboBox({
         fieldLabel	: "Device",
         labelStyle	: 'width:20px;',
         width		: 120,
         store		: new Ext.data.ArrayStore({
         fields		: ['value', 'displayText'],
         data		: deviceList
         }),
         typeAhead	: true,
         triggerAction: 'all',
         mode		: 'local',
         valueField	: 'value',
         displayField: 'displayText',
         editable	: false
         });
         
         tField_PinPass = new Ext.form.TextField({
         fieldLabel 	: 'Pin',
         labelStyle	: 'width:20px;',
         width		: 120,
         //inputType	: 'password',
         emptyText	: 'Key in password to validation'
         });
         
         var formPanel = new Ext.form.FormPanel({
         layout		: 'form',
         bodyStyle	: 'padding:20px',
         items		: [
         tCombo_Device,
         tField_PinPass
         ]
         });
         
         tPanel_MainPanel = new Ext.Panel({
         items 	: formPanel,
         bbar	: {
         enableOverflow	: false,
         items			:[
         '->',
         new Ext.Button({
         text : 'Submit',
         handler: function(){
         _submitForm();
         }
         }),
         '-',
         new Ext.Button({
         text : 'Cancel',
         handler: function(){
         tWindow_Window.close();
         }
         })
         ]
         },
         listeners	: {
         render	: function( thisPanel ){
         tLoadMask_Main = new Ext.LoadMask(thisPanel.getId(), {
         msg: 'Loading...'
         });
         }
         }
         });
         */


        tWindow_Window = msgutil.popup({
            //      title		: "OTP Validate",		
            title: languageFormat.getLanguage(21061, 'Second Factor Authentication (2FA)'),
            width: 450,
            height: 310,
            items: [tPanel_MainPanel],
 			dislayAtClick: false,
            listeners: {
                destroy: function() {
                    tWindow_Window = null;
                },
                close: function() {
                    for (var k in delayedParams) {
                        var dp = delayedParams[k];
                        createDelayedFn(dp.type, dp.args, dp.conf, dp.tabCt);
                    }
                    delayedParams = {};
                }
            }
        }).show();
    }


    function _submitForm() {
        var deviceItem;
        var pin;
        var rc;
        
    	if(global_s2FAMode == mode2FAToken){
    		if (tCombo_Device.getValue() == "" || tField_PinPass.getValue() == "") {
                return;
            }
    		deviceItem = tCombo_Device.getValue();
    		pin = tField_PinPass.getValue();
    	}else{
    		if (tCombo_MobileDevice.getValue() == "" || tField_SMSPass.getValue() == "") {
                return;
            }
    		deviceItem = tCombo_MobileDevice.mobileNo;
    		pin = tField_SMSPass.getValue();
    		rc = tField_SMSRandomChar.getValue();
    	}

        var tempUrl = [];
        tempUrl.push(addPath + 'tcplus/otpvalidation?');
        tempUrl.push("deviceItem=");
        tempUrl.push(deviceItem);
        tempUrl.push("&pin=");
        tempUrl.push(pin);
        tempUrl.push("&cliCode=");
		tempUrl.push(cliCode);
		tempUrl.push("&source=" + global_s2FAMode);
		if(rc){
			tempUrl.push("&rc=" + rc);
		}

        var url = tempUrl.join('');

		tLoadMask_Main = tWindow_Window.setLoading(languageFormat.getLanguage(10017, 'Loading...'));

        Ext.Ajax.request({
            url: url,
            method: 'POST',
            success: function(response) {
                tLoadMask_Main.hide();
                
                try {
                    var obj = Ext.decode(response.responseText);

                    if (obj.s) {
                        tWindow_Window.destroy(); // caution: don't use .close() here since close is meant to cancel OTP login
                        global_s2FAValidate = "true";
                        
                        for (var k in delayedParams) {
                            var dp = delayedParams[k];
                            runFn(dp.type, dp.args, dp.tabCt);
                        }
                        
                        for (var k in comps) {
                            var cmp = comps[k];
                            if (!delayedParams[k] && (cmp.isConf || helper.inView(cmp)) && typeof(cmp.delayedFn) === 'function') {
                                cmp.delayedFn();
                                cmp.delayedFn = null;
                            }
                        }
                        
                        delayedParams = {};
                        comps = {};
                        
                    } else {
                        tWindow_Window.setTitle(tWindow_Window.title);

                        msgutil.alert(obj.msg, null, "Status");
                    }

                } catch (e) {
                    console.log('[N2N2FA][_submitForm][inner] Exception ---> ' + e);
                }

                
            },
            failure: function(response) {
                tLoadMask_Main.hide();
            }
        });
    }
    
    function _requestOTP(thisBtn) {
    	global_s2FAMode = mode2FAMobile;
    	
        var tempUrl = [];
        tempUrl.push(addPath + 'tcplus/otpvalidation?');
        tempUrl.push("deviceItem=");
        tempUrl.push(tCombo_MobileDevice.mobileNo);
        tempUrl.push("&cliCode=");
		tempUrl.push(cliCode);
		tempUrl.push("&source=" + global_s2FAMode);
		tempUrl.push("&sms=Y");
		
		if(tField_SMSRandomChar.getValue() != ''){
			tempUrl.push("&rc=" + tField_SMSRandomChar.getValue());
		}

        var url = tempUrl.join('');

        Ext.Ajax.request({
            url: url,
            method: 'POST',
            success: function(response) {                
                try {
                    var obj = Ext.decode(response.responseText);

                    if (obj.s) {
                    	msgutil.alert('OTP request submitted successfully', null);
                    	if(obj.rc.length > 0){
                    		tField_SMSRandomChar.setValue(obj.rc);
                    	}
                    } else {
                    	msgutil.alert(obj.msg, null, "Status");
                        thisBtn.enable();
                    }

                } catch (e) {
                    console.log('[N2N2FA][_requestOTP][inner] Exception ---> ' + e);
                }
            },
            failure: function(response) {
            	console.log('[N2N2FA][_requestOTP][failedAjax] Exception ---> ' + e);
            	msgutil.alert('OTP request failed', null);
                thisBtn.enable();
            }
        });
    }
    
    function runFn(type, args, tabCt) {
        if (tabCt && tabCt.id && !Ext.get(tabCt.id)) { // skip running if this tab has been closed
            return;
        }
        
        switch (type) {
            case 'ordPad':
            	orderPad.submitForm();
                break;
            case 'ordSts':
                jsutil.runFn(createOrdStsPanel, args);
                break;
            case 'ordHistory':
                jsutil.runFn(createOrdHistoryPanel, args);
                break;
            case 'mfOrdHistory':
                jsutil.runFn(createMFOrdHistoryPanel, args);
                break;
            case 'derivativePrtf':
                jsutil.runFn(createDerivativePortfolioPanel, args);
                break;
            case 'equityPrtf':
                jsutil.runFn(createEquityPortfolioPanel, args);
                break;
            case 'manualPrtf':
                jsutil.runFn(createEquityManualPortFolioPanel, args);
                break;
            case 'realizedGL':
                jsutil.runFn(createEquityPortfolioRealizedGainLossPanel, args);
                break;
            case 'multiplecancel': // for 1FA only
                if (orderStatusPanel) { // most cases does not need this
                    orderStatusPanel.processCancel();
                }
                break;
            case 'openFXConversion':
                if (n2ncomponents.exchangeRate) {
                    n2ncomponents.exchangeRate.openFXConversion();
                }
                break;
            case 'submitOrderFX':
                if (n2ncomponents.exchangeRate) {
                    n2ncomponents.exchangeRate.submit();
                }
                break;
            case 'showTransact':
                if (n2ncomponents.exchangeRate) {
                    n2ncomponents.exchangeRate.showTransact();
                }
                break;         
        }

    }

    function createDelayedFn(type, args, conf, tabCt) {
        if (!jsutil.isEmpty(conf) && !tabCt) {
            tabCt = {isConf: true};
                }

        if (tabCt) {
            tabCt.delayedFn = function() {
                runFn(type, args, tabCt);
            };
            tabCt.isPendingTab = true;
            tabCt.isBufferredTab = false;
            comps[type] = tabCt;
            }
    }

    return{
        return2FAValidate: return2FAValidate,
        set2FAValidate: set2FAValidate,
        get2FADeviceInfo: get2FADeviceInfo,
        set2FADeviceInfo: set2FADeviceInfo
    };

})();