//1.3.29.11 timer function added
//1.3.29.14 Enhance UI of timer
//1.3.33.42 Detect event mousedown and keypress, enhance logic of detect user event

var timer = (function() {
	
	var thread = null;
	
	var idleCounting = 0;
	var exitCounting = 0;

	var timeClock = null;
	var timeClockExit = null;
	
	var isOnExit = false;
	
	if ( global_showCountDownTimer.toLowerCase() == "true" ){ //from main.jsp
		
		document.onmousemove = ( function() { /*Remark - Will detect also when got pop up*/
			resetCount();
		} );

		document.onmousedown = ( function() {
			resetCount();
		} );

		document.onkeypress = ( function() {
			resetCount();
		} );

		
		function startCount(){
			idleCounting = 0;
			
			timeClock = setInterval( function() {
				idleCounting += 1;
				if ( idleCounting >= global_countdownIdle ) {
					showAlert();
					clearInterval( timeClock );
				} 
			}, 1000 );
		}
		
		function resetCount(){
			if ( !isOnExit ) {
				idleCounting = 0;
			}
		}

		
		function showAlert(){
			
			var tempAlert = Ext.Msg.show( { 
				title 	: global_popUpMsgTitle, 
				msg 	: ' Your session will be expired on ' + global_countdownTime + " seconds.", 
				buttons	: Ext.Msg.OKCANCEL,
				fn		: function( btn, text ) {
					if ( btn != 'ok' ) {
                                                // uses this function to avoid confirmation on mobile view
                                                conn.logout();
					} else {
						startCount();
						clearInterval( timeClockExit );
					}
				}
			} );
			
			exitCounting = global_countdownTime;
			
			timeClockExit = setInterval( function() {
				exitCounting -= 1; 
				
				if ( exitCounting >= 0 ) {
					tempAlert.updateText( " Your session will be expired in  " + exitCounting + " seconds. <br/> Press OK to continue, or Cancel to logout." );
				
				} else {
					isOnExit = true;
					clearInterval( timeClockExit );
					tempAlert.hide();
					
					conn.logout();
				}
				
			}, 1000 );
		}
		
		
		startCount();

//		function onIdle() {
//			idleCountingStart = setInterval( function() {
//				idleCounting ++;
//				console.log( "[timer][onIdle] ---> " + idleCounting );
//				if ( idleCounting >= global_countdownIdle ) {
//					timer.callAlert( true );
//					clearInterval( idleCountingStart );
//				}
//			}, 1000 );
//		}
//
//		function onReturn( string ) {
//			clearTimeout( thread );
//
//			if ( idleCounting != 0 ) {
//				console.log( "[timer][onReturn] ---> " + string );
//				clearInterval( idleCountingStart );
//				idleCounting = 0;
//				console.log( "[timer][onReturn] ---> " + idleCounting );
//			}
//
//			thread = setTimeout( function(){ onIdle() }, 10 ); //call onIdle() after 5 min
//		}
//
//		var tLabel1 = new Ext.form.Label ( {
//			xtype: 'label',		                
//			name: 'labelString',
//			text:'Your session will be expired in '
//		} );
//		var tLabel2 = new Ext.form.Label ( {
//			xtype: 'label',		                
//			name: 'timerSeconds',
//			text: ''
//		} );
//		var tLabel3 = new Ext.form.Label ( {
//			xtype: 'label',		                
//			name: 'labelString',
//			text:' seconds.'
//		} );
//
//		var timerRunFunction = function() {
//			var form =  Ext.getCmp( 'formTimer' ).getForm();
//			tLabel2.setText( timer.getSeconds() );
//		}
//
//		var timerFormPanel = new Ext.FormPanel( {
//			id: 'formTimer',
//			frame: true,
//			border: true,
//
//			items: [{
//				xtype: 'label',
//				html: '<img style="height: 32px; width: 32px; float: left; margin-right: 8px" src="images/Icn_Warning.png" />'
//			},{
//				layout: 'form',
//				items: [{
//					xtype: 'label',		                
//					name: 'labelString',
//					text:'Warning'
//				}]
//
//			},{
//				layout: 'form',
//				items: [ tLabel1, tLabel2, tLabel3 ]
//
//			},{
//				layout: 'form',
//				items: [{
//					xtype: 'label',		                
//					name: 'labelString',
//					text:'Press OK to continue, or Cancel to logout.'
//				}]
//
//			}],
//
//			buttons: [
//			          {
//			        	  text: 'OK',
//			        	  handler: function() {
//			        		  timer.stop();
//			        		  timer.reset();
//			        		  tLabel2.setText( timer.getSeconds() );
//			        		  timerWindow.hide();
//			        	  }
//			          },
//			          {
//			        	  id: 'btnLogout',
//			        	  text: 'Cancel',
//			        	  handler: function() {
//			        		  main.connectionManager.logoutGC();
//			        	  },
//			        	  resetText: function() {
//			        		  var btn = Ext.getCmp( 'btnLogout');
//			        		  btn.setText( 'Cancel' );
//			        	  }
//			          }
//			          ]
//
//		} );
//
//		var timerWindow = new Ext.Window( {
//			layout: 'auto',
//			title: global_popUpMsgTitle,
//			width: 300,
//			closable: false,
//			resizable: false,
//			border: false,
//			plain: true,
//			constrain: true,
//			constrainHeader: true,
//			items: [ timerFormPanel ]
//		} );
//
//		var parseNumber = function( val, def ) {
//			var defaultValue = ( def != undefined) ? def : 0;
//
//			if ( isNaN( val ) || val == '' ) {
//				return defaultValue;
//			}
//			return parseInt( val );
//		}
//
//		var timer = {
//				originalTimeInSeconds: global_countdownTime,
//				currentTimeInSeconds: global_countdownTime,
//
//				runCallBack: null,
//				endCallBack: null,
//
//				running: false,
//
//				interval: 1000,
//
//				init: function( hours, minutes, seconds ) {
//					hours = parseNumber( hours );
//					minutes = parseNumber( minutes );
//					seconds = parseNumber( seconds );
//
//					totalSeconds = this.calculateSeconds( hours, minutes, seconds );
//					this.originalTimeInSeconds = totalSeconds;
//					this.currentTimeInSeconds = this.originalTimeInSeconds;
//				},
//
//				reset: function() {
//					this.currentTimeInSeconds = this.originalTimeInSeconds;
//				},
//
//				run: function() {
//					this.currentTimeInSeconds = this.currentTimeInSeconds - 1;
//					this.runCallBack( timer.getHours, timer.getMinutes(), timer.getSeconds() );
//
//					if (this.isFinished()) {
//						this.stop();
//						this.reset();
//						timerWindow.hide();
//						main.connectionManager.logoutGC();
//						return;
//					}
//
//				},
//
//				isFinished: function() {
//					if ( this.currentTimeInSeconds <= 0 ) {
//						return true;
//					}
//
//					return false;
//				},
//
//				getHours: function() {
//					return parseInt( this.currentTimeInSeconds / 3600 );
//				},
//
//				getMinutes: function() {
//					return parseInt( ( this.currentTimeInSeconds % 3600 ) / 60 );
//				},
//
//				getSeconds: function() {
//					hours = this.getHours();
//					minutes = this.getMinutes();
//					return this.currentTimeInSeconds - ( hours * 3600 ) - ( minutes * 60 );
//				},
//
//				setRunCallBack: function( fn ) {
//					this.runCallBack = fn;
//				},
//
//				setEndCallBack: function( fn ) {
//					this.endCallBack = fn;
//				},
//
//				start: function() {
//					Ext.TaskMgr.start(this);
//					this.running = true;
//				},
//
//				stop: function() {
//					if ( this.running ) {
//						Ext.TaskMgr.stop(this);
//						this.running = false;
//						this.endCallBack();
//					}
//					else {
//					}
//				},
//
//				isRunning: function() {
//					return this.running;
//				},
//
//				calculateSeconds: function( hours, minutes, seconds ) {
//					return seconds + ( minutes * 60 ) + ( hours * 60 * 60 );
//				},
//
//				callAlert: function(boolean){
//					if(boolean == true){
//						if (!timer.isRunning()) {
//							timerWindow.show();
//							timer.init( 0, 0, global_countdownTime);
//							timer.setRunCallBack( timerRunFunction );
//							timer.setEndCallBack( timerFormPanel.buttons[1].resetText );
//							timer.start();
//						}
//					}
//				}
//		};
	}
}());