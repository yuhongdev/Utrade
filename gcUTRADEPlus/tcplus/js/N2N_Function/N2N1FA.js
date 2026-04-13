var N2N1FA = (function(){
	
	var tField_PinPass = null;
	var tPanel_MainPanel = null;
	var tWindow_Window = null;
	var tLoadMask_Main = null;
	
	var publicKey = '';
	var sessionId = '';
	var randomNum = '';
	var rsaModulus = '';
	var rsaExponent = '';
	//var haveE2EEParams = false;
	
	function return1FAValidation(type, args){
		var returnValue = false;
                                
		if(haveE2EEParams == true){
			if ( global_s1FAValidate == true ) {
				global_s1FAValidate = false;
				returnValue = true;
			} else {
				returnValue = false;
				_generateWindow(type, args);
			}
		}else{
			getE2EEParams(type, args);
		}
		
		return returnValue;
	}
	
	
	function _generateWindow(type, args){

        tField_PinPass = new Ext.form.field.Text({
			fieldLabel 	: languageFormat.getLanguage(21065, 'Client Password'),
		    labelStyle	: 'width:210px;',
			//width		: 200,
			inputType	: 'password',
		});
		
		var formPanel = new Ext.panel.Panel({
			layout: {
				type: 'form'
			},
			border: false,
			style: 'padding:8px;padding-bottom:0px;',
			items: [{
				xtype: 'fieldset',
				title: languageFormat.getLanguage(21066, 'Client Account'),
				collapsible: false,
				autoHeight: true,
				items: [	                  
				        tField_PinPass]
			}]
		});
		
		var imagePanel = new Ext.Panel({
			   border: false,
			   style: 'padding:8px;padding-top:0px;',
			   items: 
				   [{  width:"100%",
				       border: false,
                                       html:'<div>' + languageFormat.getLanguage(30806, '<B>Important Notice:</B><br><br>We noticed that you have yet to register or link your OneKey Token for 2FA (2nd Factor Authentication).<br><br>As your online trading security is our top priority, please proceed to apply for the OneKey device now if you have not done so.<br><br>') + '<div style="text-align:center"><a class="fa-register" href="https://portal.assurity.sg/naf-web/public/index.do" target="_blank"></a></div></div>'}]
			
		});
		
		var btnPanel = new Ext.container.Container({
			border:false,
			layout: {
				type: 'hbox',
				pack: 'center',
				align: 'middle'
			},
			style: 'padding-top:10px;padding-bottom:10px;',
			// layoutConfig: { pack: 'center', align: 'middle' },
			items: [ 
			        new Ext.button.Button({
			        	text : languageFormat.getLanguage(20849, 'Submit'),
			        	cls: 'fix_btn',
			        	handler: function(){
			        		_submitForm(type, args);
			        	}
			        }), 

			        { html: "&nbsp;&nbsp;&nbsp;&nbsp;",border: false},

			        new Ext.button.Button({
			        	text : languageFormat.getLanguage(10010, 'Cancel'),
			        	cls: 'fix_btn',
			        	handler: function(){
			        		tWindow_Window.close();
			        	}
			        })

			        ]	  


		});

		tPanel_MainPanel = new Ext.panel.Panel({
			items 	: [formPanel, imagePanel, btnPanel],
			border: false,
			bbar	: {
				items: [languageFormat.getLanguage(30807, 'Please key in password')]
			}
		});
		
        tWindow_Window = msgutil.popup({
            title		: languageFormat.getLanguage(30808, 'Enter Login ID Password'),
			width       : 430,	
			items		: [tPanel_MainPanel],
                        dislayAtClick: false
		}).show();
	}
		
	function _submitForm(type, args){
		
		if ( tField_PinPass.getValue() == "" ) {
			return ;
		}
		
		var rsa = new RSAEngine();
		rsa.init(publicKey, sessionId, randomNum);
		var pin1 = rsa.encryptPIN1(tField_PinPass.getValue());
		
		var rsa2 = new RSAKey();
		rsa2.setPublic(rsaModulus, rsaExponent);
		var pin2 = rsa2.encrypt(tField_PinPass.getValue());
		
		var tempUrl = [];
		tempUrl.push( addPath + 'tcplus/oneFAValidation?' );
		tempUrl.push( "pin1=" );		
		tempUrl.push( pin1 );
		tempUrl.push( "&pin2=" );		
		tempUrl.push( pin2 );
		tempUrl.push( "&randomNum=" );		
		tempUrl.push( randomNum );
		
		var url = tempUrl.join('');

		tLoadMask_Main = tWindow_Window.setLoading(languageFormat.getLanguage(10017, 'Loading...'));	
		
		Ext.Ajax.request({
			url			: url,
			method		: 'POST',
			success		: function( response ) {
                                tLoadMask_Main.hide();
                            
				try {
					var obj = Ext.decode( response.responseText );
					
					if ( obj.s ) {							
						tWindow_Window.destroy(); 
						global_s1FAValidate = true;
						
						switch(type){
						case 'ordPad':
							orderPad.submitForm();
							haveE2EEParams = false;
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
						case 'multiplecancel':
                                                        if (orderStatusPanel) {
                                                            orderStatusPanel.is1FAPrompted = true;
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
					} else {
						tWindow_Window.setTitle( tWindow_Window.title );
						
						msgutil.alert(obj.msg, null, "Status");
					}
					
				} catch(e) {
					console.log( '[N2N1FA][_submitForm][inner] Exception ---> ' + e );
				}
				
				
			},
			failure		: function(response) {
				tLoadMask_Main.hide();
			}
		});		
	}
	
	function getE2EEParams(type, args){
		var panel = this;
		
		console.log( '[main][gete2eeparams] start *** ' );
				
		var url = addPath + 'tcplus/gete2eeparams';
	
		Ext.Ajax.request( {
			url		: url,
			method	: 'POST',
			
			success	: function ( response ) {
				panel.timeOutCall = panel.totalTimeOut;
				
				try {
					var obj = Ext.decode( response.responseText );
					var dataObj = obj.d;

					if(obj.s){
						console.log( '[main][gete2eeparams] result : success *** ' );
						haveE2EEParams = true;

						publicKey = dataObj[0]['43'];
						sessionId = dataObj[0]['44'];
						randomNum = dataObj[0]['45'];
						rsaModulus = dataObj[0]['46'];
						rsaExponent = dataObj[0]['47'];
						
						return1FAValidation(type, args);
					}else{
						console.log( '[main][gete2eeparams] result : fail *** ' );
						haveE2EEParams = false;

						publicKey = '';
						sessionId = '';
						randomNum = '';
						rsaPublicKey = '';
						rsaModulus = '';
						rsaExponent = '';
						
						tWindow_Window.setTitle( tWindow_Window.title );
						msgutil.alert(obj.msg, null, "Status");			
					}
					
				} catch ( e ) {
					console.log( '[main][gete2eeparams] Exception ---> ' + e );					
				}	
			},
			failure	: function( response ){			
				console.log( '[main][gete2eeparams] failure ---> ' + response.responseText );				
			}
		} );
	}

	
	return{
		return1FAValidation : return1FAValidation
	};
	
})();