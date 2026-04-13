var N2NDisclaimerRDS = ( function(){
	
	var tWindow_Window = null;
	var validationStatus = false;
	var tLoadMask_Main = null;
	
	function validation(stkExchange) {
		var returnValidation = false;
		
		if ( global_sLocalExchange ) {
			var needValidate = true;
			var tempExchange = global_sLocalExchange.split( ',' );

			for ( var i = 0; i < tempExchange.length; i ++ ) {
				var tempExchg = tempExchange[ i ];
				
				if ( tempExchg == stkExchange ) {
					needValidate = false;
				}
			}

			if ( needValidate ) {
				 
				if ( global_sRDSIsRequire.toLowerCase() == 'n' ) { // from main.jsp
					returnValidation = true;
					_openDisclaimerWindow( 'agree' );

				} else if ( global_sRDSIsRequire.toLowerCase() == 'b' ) { // from main.jsp
					returnValidation = true;
					_openDisclaimerWindow( 'ok' );

				} else {
					returnValidation = false;
				}
			}
		}
		
		return returnValidation;
	}
	
	function _openDisclaimerWindow( type ) {
		var buttonList = [];
		
		if ( type == 'agree' ) {
			
			buttonList.push( {
				text		: languageFormat.getLanguage(10064 , 'Agree'),
				handler		: function() {
					N2NDisclaimerRDS._procConfirmation();
				}
			} );

			buttonList.push( {
				text		: languageFormat.getLanguage(10061, 'Not Agree'),
				handler		: function() {
					N2NDisclaimerRDS._destroy();
				}
			} );
			
		} else {
			
			buttonList.push( {
				text		: languageFormat.getLanguage(10036, 'OK'),
				handler		: function() {
					N2NDisclaimerRDS._destroy();
				}
			} );
		}
		
		
		tWindow_Window = msgutil.popup({
			title		:  languageFormat.getLanguage(10016, "Disclaimer"),
			width       : 650,
			height      : 580,
			buttons		: buttonList,	
                        dislayAtClick: false,
			listeners	: {
				afterrender: function( thisComp ) {
					
					var htmlDesign = "";
					htmlDesign += "<table cellspacing='0' cellpadding='2' border='0' style=' width: 100%; '>";
					htmlDesign += "<tr>";
					htmlDesign += "<td style='font-size: 13pt; font-weight: bold; '>";
					htmlDesign += " <iframe src='" + global_sRDSDisclaimerURL  + "' style='overflow : auto;' height='" + ( thisComp.height - 8 ) + "' width='100%'> </iframe>";
					htmlDesign += "</td>";
					htmlDesign += "</tr>";
					htmlDesign += "</table>";
					
					var newPanel = new Ext.container.Container({
						layout: {
							type: 'fit'
						},
						header		: false,
						border		: false,
						width		: '100%',
						items		: [ { html	: htmlDesign } ]
					} );
					
					thisComp.insert( 0, newPanel );
					
				}
			}
		} ).show();
	}
	
	
	function _procConfirmation(){
		
		var url = addPath + 'tcplus/RDSValidation?' ;
		url += 'RDSversion=' + global_sRDSVersion;
		tLoadMask_Main = tWindow_Window.setLoading(MSG.get(MSG.LOADING));
		
		Ext.Ajax.request( {
			url			: url,
			method		: 'POST',
			success		: function( response ) {
				try {
					var obj = Ext.decode( response.responseText );
					
					if ( obj ) {
												
						if ( obj.s ) {
							msgutil.info( languageFormat.getLanguage(30811, 'Success.'), function() {
			    			} );
							
							global_sRDSIsRequire = 'Y';
							
						} else {
							msgutil.alert(languageFormat.getLanguage(30812, 'Failure: ') + obj.msg, function() {
			    			} );
						}
					}
				} catch( e ) {
					console.log( '[N2NDisclaimerRDS][_procConfirmation][inner] Exception ---> ' + e );
				}
				
				N2NDisclaimerRDS._destroy();
			},
			failure		: function( response ) {
				
				N2NDisclaimerRDS._destroy();
				
				console.log( '[N2NDisclaimerRDS][_procConfirmation] failure ---> ' + response.responseText );
			}
		} );
	}
	
	function _destroy() {
		tWindow_Window.close();
	}
	
	
	return {
		validation 		: validation,
		_destroy		: _destroy,
		
		_procConfirmation : _procConfirmation
	}
	
} )();