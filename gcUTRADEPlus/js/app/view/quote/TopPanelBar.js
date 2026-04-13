
/*
 * this  : Ext.container.Container
 * 
 * constructor 		: initial this object function / design this panel 
 * 
 * callSummary		: retrieve market summary / ajax call market summary 
 * updateSummary 	: update summary text field record / update summary text field design
 * 
 * updateStkCode 	: update this object stock code
 * 
 * updateByExchange	: update record by exchange code is changing
 * 
 * setLast			: update market summary image up / down
 * setChange		: update market summary text colour
 * formatNumber 	: change number format
 * 
 * getFieldList 	: set retrieve market summary record url by column record 
 * 
 * clearTextField 	: clear market summary text field record
 * 
 * clockStart		: looping clock time / update new date time / update this object exchange code, panel record
 * setDate			: set new date into this object
 * setClockTime		: set new time into this object
 * 
 * setExchangeFlag 	: change market summary icon by exchange code
 * 
 * 
 * getDate			: return this object date , e.g : 31/12/2010 
 * getTime			: return this object time , e.g : 02:59:21
 * getDateTime 		: return this object date time , e.g. : new Date(year, minute, day, hour, minute, second, millisecond)
 * 
 * 
 * displaySummaryGraph : create new window to display market summary image
 * 
 * _disableAllLabel		: hide / show all label component
 * 
 */
Ext.define('TCPlus.view.quote.TopPanelBar', {
    extend: 'Ext.toolbar.Toolbar',
    debug: false,
    alias: 'widget.toppanelbar',
    stkcode: '',
    last: '',
    lacp: '',
    change: '',
    chgpc: '',
    exchangeCode: '',
    exchangeName: '',
    tempExchCode: '',
    summaryPanel: null, // store market summary panel
    globalDay: 0, // record day
    globalMonth: 0, // record month
    globalYear: 0, // record year
    globalHour: 0, // record hour
    globalMinute: 0, // record minute
    globalSecond: 0, // record second

    isFiveMinute: 0, // record every second/minute, if is 5 minute will call "callSummary" function to retrieve server time

    displaySummary: false, // verify this panel already display market summary 

    summaryImage: null, // new window for display market summary image

    tButtonFlagSummaryGraph: null, //v1.3.33.13 summary graph and exchange flag button

//	tImageFlag				: null, //v1.3.33.13
    tImageVolumn: null,
    tImageValue: null,
    tImageTrade: null,
    tImageUp: null,
    tImageDown: null,
    tImageUnchange: null,
    tImageUntrade: null,
    tImageSignal: null, //v1.3.33.49

    tLabelSummaryUpDown: null,
    tLabelExchangeLast: null,
    tLabelExchangeChange: null,
    tLabelVolumn: null,
    tLabelValue: null,
    tLabelTrade: null,
    tLabelUp: null,
    tLabelDown: null,
    tLabelUnchange: null,
    tLabelUntrade: null,
    tLabelDateTime: null,
    tLabelIndexDelay: null,
    _roundValue: false,
    /**
     * Description <br />
     * 		when this object create will call this function
     */
    initComponent: function() {
        var panel = this;

        /*
         * this method is get the exchange code from main.js
         */
        if (panel.exchangeCode == "") {
            panel.exchangeCode = exchangecode;
            panel.tempExchCode = exchangecode;

        }

        panel.tButtonFlagSummaryGraph = Ext.create('Ext.button.Button', {
            tooltip: languageFormat.getLanguage(21022, 'Index Chart'),
            padding: 0,
            // scale: 'medium',
            hidden: showMarketSummaryGraph.toLowerCase() == "true" ? false : true,
            handler: function(thisObject, event) {

                panel.summaryImage = Ext.create('Ext.window.Window', {
                    title: languageFormat.getLanguage(21021, 'Market Summary Graph'),
                    width: 800,
                    height: 450,
                    plain: true,
                    layout: 'fit',
                    resizable: false,
                    draggable: true,
                    modal: true,
                    alwaysOnTop: winAlwaysOnTop,
                    constrain: true,
                    bbar: [
                        "->",
                        new Ext.Button({
                            text: languageFormat.getLanguage(10103, 'Close'),
                            handler: function() {
                                panel.summaryImage.destroy();
                            }
                        })
                    ],
                    listener: {
                        destroy: function(thisObject) {
                            panel.summaryImage = null;
                        }
                    }
                }).show();

                panel.summaryImage.on("destroy", function() {

                });
                panel.displaySummaryGraph();
            }

        });

        
        var lblHeight = 15;
        var imgHeight = 16;
        var imgWidth = 24;
        
        var adjustStyle = '';
        var rightStyle = 'text-align: right; margin-left: 15px';
        var style = 'padding-left: 8px;';
        if (global_personalizationTheme.indexOf("wh") != -1) {
            style = 'padding-left:8px; top:0px;';
        }
        panel.tImageTrade = Ext.create('widget.box', {
            autoEl: {
                tag: 'img',
                src: sbTrd_wb,
                style: style
            },
            height: imgHeight,
            width: imgWidth
        });
        panel.tImageUnchange = Ext.create('widget.box', {
            autoEl: {
                tag: 'img',
                src: sbUnchg_wb,
                style: style
            },
            height: imgHeight,
            width: imgWidth
        }),
        panel.tImageUntrade = Ext.create('widget.box', {
            autoEl: {
                tag: 'img',
                        src: sbUntrd_wb,
                style: style
            },
            height: imgHeight,
            width: imgWidth
        });
        panel.tImageUp = Ext.create('widget.box', {
            autoEl: {
                tag: 'img',
                src: sbUp_wb,
                style: style
            },
            height: imgHeight,
            width: imgWidth
        });
        panel.tImageValue = Ext.create('widget.box', {
            autoEl: {
                tag: 'img',
                src: sbVal_wb,
                style: style
            },
            height: imgHeight,
            width: imgWidth
        });
        panel.tImageVolumn = Ext.create('widget.box', {
            autoEl: {
                tag: 'img',
                src: sbVol_wb,
                style: style
            },
            height: imgHeight,
            width: imgWidth
        });
        panel.tImageSignal = Ext.create('widget.box', {//v1.3.33.49
            height: imgHeight,
            width: 16,
            autoEl: {
                tag: 'img',
                src: iconConnectingSignal,
                style: 'padding-left: 1px;'
            }
        });

        panel.tImageDown = Ext.create('widget.box', {
            autoEl: {
                tag: 'img',
                src: sbDown_wb,
                style: style
            },
            height: imgHeight,
            width: imgWidth
        });


        panel.tLabelDown = new Ext.form.Label({
            width: 20,
            style: adjustStyle,
            height: lblHeight
        });
        
        // layouts
        var layoutProfiles = N2N_CONFIG.defLayoutProfiles;
        var layoutItems = [];
        if (N2N_CONFIG.enableLayoutProfile) {
            for (var l in layoutProfiles) {
                panel['lp' + l] = Ext.create('Ext.button.Button', {
                    cls: 'plain-btn layout-btn-' + l,
                    // text: 'L' + l,
                    icon: iconLayoutPath + 'L' + l + '.png', // the icon file name must match the profile name
                    tooltip: languageFormat.getLanguage(21030, 'Layout profile ') + ' ' + l,
                    lp: l,
                    toggleGroup: 'layoutbtn',
                    pressed: layoutProfileManager.getActiveProfile() === l,
                    allowDepress: false,
                    handler: function(thisBtn) {
                        n2nLayoutManager.changeLayoutProfile(thisBtn.lp);
                    }
                });

                layoutItems.push(panel['lp' + l]);
            }

            panel.saveCurrentLayoutBtn = Ext.create('Ext.button.Button', {
                cls: 'plain-btn',
                icon: iconSaveLayout, //ICON.streamOn,
                tooltip: languageFormat.getLanguage(21027, 'Save Current Layout'),
                handler: function(thisBtn) {
                    if (n2nLayoutManager.isWindowLayout()) {
                        panel.saveCurrentLayoutBtn.disable();

                        layoutProfileManager.requestSaveProfileLayout(null,
                                function() {
                                    panel.saveCurrentLayoutBtn.enable();
                                },
                                function() {
                                    panel.saveCurrentLayoutBtn.enable();
                                },
                                true);
                    } else if (n2nLayoutManager.isPortalLayout()) {
                        n2nLayoutManager.saveLayout(true);
                    }
                }
            });
            layoutItems.push(panel.saveCurrentLayoutBtn);
        }

        if (layoutItems.length > 0) {
            panel.layoutCt = Ext.create('Ext.container.Container', {
                items: layoutItems,
                style: 'margin-right: 10px'
            });
        }
        
        panel.streamToggle = Ext.create('Ext.button.Button', {
            text: '<b>' + languageFormat.getLanguage(21028, 'Streaming ON') + '</b>',
            streaming: true,
            hidden: !N2N_CONFIG.streamOpt,
            cls: 'plain-btn',
            icon: ICON.streamOn,
            tooltip: languageFormat.getLanguage(21028, 'Streaming ON'),
            handler: function(thisBtn) {
                thisBtn.streaming = !thisBtn.streaming;
                if (thisBtn.streaming) {
                    // thisBtn.setText('<b>Streaming ON</b>');
                    thisBtn.setIcon(ICON.streamOn);
                    thisBtn.setTooltip(languageFormat.getLanguage(21028, 'Streaming ON'));
                    conn.setStreaming(true);
                } else {
                    // thisBtn.setText('<i>Streaming OFF</i>');
                    thisBtn.setIcon(ICON.streamOff);
                    thisBtn.setTooltip(languageFormat.getLanguage(21029, 'Streaming OFF'));
                    conn.setStreaming(false);
                }
            }
        });
        
        panel.tLabelDateTime = new Ext.form.Label({
            text: '',
            width: isNewTheme() ? 65 : 115,
            height: lblHeight,
            style: 'text-align: right;'
        });

        panel.tLabelExchangeChange = new Ext.form.Label({
            width: 75,
            height: lblHeight,
            style: adjustStyle
        });
        panel.tLabelExchangeLast = new Ext.form.Label({
            width: 50,
            height: lblHeight,
            style: adjustStyle
        });
        panel.tLabelSummaryUpDown = new Ext.form.Label({
            width: 16,
            height: imgHeight
        });
        panel.tLabelTrade = new Ext.form.Label({
            style: adjustStyle,
            width: 40,
            height: lblHeight
        });
        panel.tLabelUnchange = new Ext.form.Label({
            style: N2N_CONFIG.sumColorBar ? rightStyle : adjustStyle,
            width: 20,
            height: lblHeight
        });
        panel.tLabelUntrade = new Ext.form.Label({
            style: adjustStyle,
            width: 20,
            height: lblHeight
        });
        panel.tLabelUp = new Ext.form.Label({
            style: N2N_CONFIG.sumColorBar ? rightStyle : adjustStyle,
            width: 20,
            height: lblHeight
        });
        panel.tLabelValue = new Ext.form.Label({
            style: adjustStyle,
            width: 70,
            height: lblHeight
        });
        panel.tLabelVolumn = new Ext.form.Label({
            style: adjustStyle,
            width: 70,
            height: lblHeight
        });
        
        panel.tLabelIndexDelay = new Ext.form.Label({
        	text: '',
            width: isNewTheme() ? 65 : 115,
            height: lblHeight,
            style: 'text-align: right;'
        });	
        
        panel.upDownBar = Ext.create('Ext.Component', {
            width: 50,
            html: '',
            height: lblHeight
        });
        panel.unChgTrdBar = Ext.create('Ext.Component', {
            width: 50,
            html: '',
            height: lblHeight
        });
        
        var sumItems = [
            panel.tButtonFlagSummaryGraph,
            panel.tLabelSummaryUpDown,
            panel.tLabelExchangeLast,
            panel.tLabelExchangeChange,
            panel.tImageVolumn,
            panel.tLabelVolumn,
            panel.tImageValue,
            panel.tLabelValue,
            panel.tImageTrade,
            panel.tLabelTrade
        ];

        if (N2N_CONFIG.sumColorBar) {
            sumItems.push(
                    panel.tLabelUp,
                    panel.upDownBar,
                    panel.tLabelDown,
                    panel.tLabelUnchange,
                    panel.unChgTrdBar,
                    panel.tLabelUntrade
                    );

        } else {
            sumItems.push(
                    panel.tImageUp,
                    panel.tLabelUp,
                    panel.tImageDown,
                    panel.tLabelDown,
                    panel.tImageUnchange,
                    panel.tLabelUnchange,
                    panel.tImageUntrade,
                    panel.tLabelUntrade
                    );
        }

        sumItems.push(
                '->',
                panel.tLabelIndexDelay,
                panel.layoutCt,
                panel.streamToggle,
                panel.tLabelDateTime,
                panel.tImageSignal
                );
                
        //panel to display the panel design
        panel.summaryPanel = {
            id: 'topPanelSummaryPanel',
            border: '1 0',
            padding: global_personalizationTheme.indexOf("wh") != -1 ? '1 0px 0 0px' : '2 5',
            margin: global_personalizationTheme.indexOf("wh") != -1 ? '3px 2px' : '0',
            minWidth: 800,
            enableOverflow: false,
            autoScroll: true,
            suspendLayout: true,
            style: global_personalizationTheme.indexOf("wh") != -1 ? 'font-size:11px;margin-top:3px' : 'font-size:11px',
            items: sumItems,
            listeners: {
                resize: function(thisComp, newWidth, newHeight, oldWidth, oldHeight) {
                    /*
                     if (panel.debug) {
                     console.log('TopPanelBar resize...');
                     console.log({
                     newWidth: newWidth,
                     newHeight: newHeight,
                     oldWidth: oldWidth,
                     oldHeight: oldHeight
                     });
                     }
                     if (newWidth > panel.minWidth) {
                     panel._roundValue = false;
                     } else {
                     panel._roundValue = true;
                     }
                     
                     panel._updateVV();
                     */
                },
                afterrender: function(thisComp) {
                    /*
                     var currentWidth = thisComp.getWidth();
                     if (panel.debug) {
                     console.log('TopPanelBar afterrender...');
                     console.log('current with: ', currentWidth);
                     }
                     if (currentWidth <= panel.minWidth) {
                     panel._roundValue = true;
                     }
                     */
                    thisComp.fmx = new Ext.util.TextMetrics(panel.tLabelExchangeLast.getEl());
                    // adds tooltip
                    Ext.create('Ext.tip.ToolTip', {
                        target: panel.tLabelSummaryUpDown.getId(),
                        html: languageFormat.getLanguage(21023, 'Index')
                    });
                    Ext.create('Ext.tip.ToolTip', {
                        target: panel.tLabelExchangeLast.getId(),
                        html: languageFormat.getLanguage(21023, 'Index')
                    });
                    Ext.create('Ext.tip.ToolTip', {
                        target: panel.tLabelExchangeChange.getId(),
                        html: languageFormat.getLanguage(21023, 'Index')
                    });
                    Ext.create('Ext.tip.ToolTip', {
                        target: panel.tImageVolumn.getId(),
                        html: languageFormat.getLanguage(21024, 'Total Volume')
                    });
                    Ext.create('Ext.tip.ToolTip', {
                        target: panel.tLabelVolumn.getId(),
                        html: languageFormat.getLanguage(21024, 'Total Volume')
                    });
                    Ext.create('Ext.tip.ToolTip', {
                        target: panel.tImageValue.getId(),
                        html: languageFormat.getLanguage(21025, 'Total Value')
                    });
                    Ext.create('Ext.tip.ToolTip', {
                        target: panel.tLabelValue.getId(),
                        html: languageFormat.getLanguage(21025, 'Total Value')
                    });
                    Ext.create('Ext.tip.ToolTip', {
                        target: panel.tImageTrade.getId(),
                        html: languageFormat.getLanguage(21026, 'Total Number Of Trades')
                    });
                    Ext.create('Ext.tip.ToolTip', {
                        target: panel.tLabelTrade.getId(),
                        html: languageFormat.getLanguage(21026, 'Total Number Of Trades')
                    });

                    Ext.create('Ext.tip.ToolTip', {
                        target: panel.tImageUp.getId(),
                        html: languageFormat.getLanguage(11031, 'Up')
                    });
                    Ext.create('Ext.tip.ToolTip', {
                        target: panel.tLabelUp.getId(),
                        html: languageFormat.getLanguage(11031, 'Up')
                    });
                    Ext.create('Ext.tip.ToolTip', {
                        target: panel.tImageDown.getId(),
                        html: languageFormat.getLanguage(11032, 'Down')
                    });
                    Ext.create('Ext.tip.ToolTip', {
                        target: panel.tLabelDown.getId(),
                        html: languageFormat.getLanguage(11032, 'Down')
                    });
                    Ext.create('Ext.tip.ToolTip', {
                        target: panel.tImageUnchange.getId(),
                        html: languageFormat.getLanguage(11036, 'Unchanged')
                    });
                    Ext.create('Ext.tip.ToolTip', {
                        target: panel.tLabelUnchange.getId(),
                        html: languageFormat.getLanguage(11036, 'Unchanged')
                    });
                    Ext.create('Ext.tip.ToolTip', {
                        target: panel.tImageUntrade.getId(),
                        html: languageFormat.getLanguage(11037, 'Untraded')
                    });
                    Ext.create('Ext.tip.ToolTip', {
                        target: panel.tLabelUntrade.getId(),
                        html: languageFormat.getLanguage(11037, 'Untraded')
                    });
                }
            }
        };

        Ext.apply(this, panel.summaryPanel);
        this.callParent();
    },
    load: function() {
        var panel = this;
        t4 = new Date().getTime();

        panel.callSummary();
        panel.updateStkCode();
        // display exchange code flag
        panel.setExchangeFlag();
        panel.setDelayIndexLabel();
        // start clock to counting
        panel.clockStart();
    },
    setSignal: function(stage) {
        var me = this;
        var signal = "";

        if (stage == "Online") {
            signal = iconOnlineSignal;
        } else if (stage == "Loading") {
            signal = iconConnectingSignal;
        } else {
            signal = preload_image['preload_offline'].src;
        }

        var signalLabel = me.tImageSignal.getEl();

        if (signalLabel != null) {
            var signalString = signalLabel.getAttribute('src');
            if (signalString.length == 0) {
                signalLabel.dom.src = signal;
            } else {
                if (signalString != signal) {
                    signalLabel.dom.src = signal;
                }
            }
        }
    },
    /**
     * Description <br/>
     * 
     * 		call ajax to retrieve record
     */
    callSummary: function() {
        /*
         * this function is to call market summary record 
         */

        var panel = this;

//        if (!N2NLoginStatus.returnValidate()) {
//            panel.displaySummary = false;
//            
//           return;
//        }


        /*
         * this part is verify have user record in the main object or not 
         * because in the main object didn't have user record and can't get user record to retrieve market summary record
         * 
         * reason : may be haven't retrieve record from server or haven't process the method to get user record
         * 
         * 
         * if didn't have user record in the main object 
         * 		it will set "displaySummary" to false,
         * 			if "displaySummary" is false, it will redo this function is on the "clockstart" method
         * else
         * 		it will set "displaySummary" to true
         * 
         */

        if (feedLoginRet == null) {
            panel.displaySummary = false;
            return;
        } else {
            panel.displaySummary = true;
        }

        /*
         * if this object stkcode is null or empty, it will get the stkcode from main object
         */
        if (panel.stkcode == null || panel.stkcode.length == 0) {

            panel.updateStkCode();
        }

        conn.getIndices({
            ex: exchangecode,
            code: getIndiceKey(exchangecode),
            success: function(obj2) {
                if (obj2 != null) {
                    panel.updateSummary(obj2);
                    panel._loadDebug();
                }
            }});

        conn.getMarketSummary({
            ex: exchangecode,
            success: function(obj) {
                if (obj != null) {
                    panel.updateSummary(obj);
                    panel._loadDebug();
                }
            }
        });

        conn.getExTime({
            ex: exchangecode,
            success: function(obj) {
                if (obj) {
                    updater.updateTime(obj);
                }
            }
        });

        conn.subscribeStatus();
    },
    _loadDebug: function() {
        var panel = this;

        if (N2N_CONFIG.lDebug) {
            if (panel._rt) {
                console.log('top bar load in ', (new Date().getTime() - t4) / 1000, 's');
            }
            panel._rt = new Date().getTime();
        }

    },
    /**
     * Description <br/>
     * 
     * 		update market summary record
     * 
     * @param obj : json
     * 1.3.29.28 - filter only data 10000 and 2000 to update market summary bar
     */
    updateSummary: function(obj) {
//		console.log("topPanelBar.js-updateSummary");
        /*
         * this function is to update record into text field record, for market summary record
         */
        var panel = this;
//        console.log(obj);
        if (obj.s == true) {

            var dataListObj = obj.d;

            for (var i = 0; i < dataListObj.length; i++) {
                var dataobj = dataListObj[i];
//				console.log("dataobj[36]:"+dataobj[fieldSectorCode]+", dataobj[33]:"+dataobj[fieldStkCode]);
                if (dataobj[fieldSectorCode] == '10000' || (dataobj[fieldSectorCode] == '2000'))
                {
                    if (dataobj[fieldSectorCode] == '10000')
                    {
                        /*
                         * if return result exiting the "53"and "54", it will update time and date
                         */
                        if (dataobj[fieldTransTime] != null && dataobj[fieldTransDate] != null) {
                            panel.setClockTime(dataobj[fieldTransTime], dataobj[fieldTransDate]);
                            panel.setDate(dataobj[fieldTransDate]);
                        }
                        if (dataobj[fieldTransDate] != null) {
                            panel.setDate(dataobj[fieldTransDate]);
                        }

                        var exchg = dataobj[fieldSbExchgCode];
                        if (exchg != null) {
                            if (exchg != panel.exchangeCode) {
                                return;
                            }
                        }
                        var stkcode = dataobj[fieldStkCode];
                        if (stkcode != null) {
                            if (stkcode.toLowerCase() != this.stkcode.toLowerCase()) {
                                return;
                            }
                        }

                        var up = dataobj[fieldSbUp];
                        var down = dataobj[fieldSbDown];
                        var unchg = dataobj[fieldSbUnchanged];
                        var untrd = dataobj[fieldSbUntraded];
                        var value = dataobj[fieldSbTotalValue];
                        var volume = dataobj[fieldSbTotalVol];
                        var tottrade = dataobj[fieldSbTotalTrade];

                        // keeps for resizing
                        panel._value = value;
                        panel._volume = volume;

                        if (dataobj[fieldStkName] != null) {
                            panel.exchangeName = dataobj[fieldStkName];
                        }

                        // start to update text field value 
                        if (!Ext.isEmpty(up)) {
                            var upEl = panel.tLabelUp.getEl();
                            if (upEl != null) {
                                panel._up = up;
                                var upStr = panel.formatNumber(up);
                                panel._autoWidth(panel.tLabelUp, upStr);
                                upEl.update(upStr);
                                upEl.setStyle('color', cFUp);
                            }
                        }
                        if (!Ext.isEmpty(down)) {
                            var downEl = panel.tLabelDown.getEl();
                            if (downEl != null) {
                                panel._down = down;
                                var downStr = panel.formatNumber(down);
                                panel._autoWidth(panel.tLabelDown, downStr);
                                downEl.update(downStr);
                                downEl.setStyle('color', cFDown);
                            }
                        }
                        if (!Ext.isEmpty(unchg)) {
                            var unchgEl = panel.tLabelUnchange.getEl();
                            if (unchgEl != null) {
                                panel._unchg = unchg;
                                var unchgStr = panel.formatNumber(unchg);
                                panel._autoWidth(panel.tLabelUnchange, unchgStr);
                                unchgEl.update(unchgStr);
                            }
                        }
                        if (!Ext.isEmpty(untrd)) {
                            var untrdEl = panel.tLabelUntrade.getEl();
                            if (untrdEl != null) {
                                panel._untrd = untrd;
                                var untrdStr = panel.formatNumber(untrd);
                                panel._autoWidth(panel.tLabelUntrade, untrdStr);
                                untrdEl.update(untrdStr);
                            }
                        }
                        
                        // update bars
                        panel.updateBars();

                        panel._updateVV();

                        if (!Ext.isEmpty(tottrade)) {
                            var tottradeEl = panel.tLabelTrade.getEl();
                            if (tottradeEl != null) {
                                var totStr = panel.formatNumber(tottrade);
                                panel._autoWidth(panel.tLabelTrade, totStr);
                                tottradeEl.update(panel.formatNumber(tottrade));
                            }
                        }
                        //console.log("up:"+up+", down:"+down+",unchg:"+unchg+", untrd:"+untrd+", value:"+value+", vol:"+volume+", tottrade:"+tottrade);
                    } //end if 100000
                    //  console.log(dataListObj);
                    //  console.log('dataobj :'+ dataobj[fieldStkCode]+" stkcode :"+ panel.stkcode);
//                     console.log(" ");
//                     console.log("panel.stkcode: "+panel.stkcode);
//                     console.log("fieldStkCode: "+dataobj[fieldStkCode]);
//                     console.log("fieldSectorCode: "+dataobj[fieldSectorCode]);
                    if ((dataobj[fieldSectorCode] == '2000') && (dataobj[fieldStkCode] == panel.stkcode))
                    {

                        /*
                         * this all condition is to verify the market store is going down or going up 
                         */


                        var last = dataobj[fieldLast];
                        var lacp = dataobj[fieldLacp];

                        panel.last = last == null ? panel.last : last;
                        panel.lacp = lacp == null ? panel.lacp : lacp;

                        var change;
                        var chgpc;
                        if (last != null && lacp != null) {
                            change = (last == 0 || lacp == 0) ? 0 : last - lacp;
                            chgpc = (last == 0 || lacp == 0) ? 0 : (change / lacp) * 100;
                        } else if (panel.last != null && panel.lacp != null) {
                            change = (panel.last == 0 || panel.lacp == 0) ? 0 : panel.last - panel.lacp;
                            chgpc = (panel.last == 0 || panel.lacp == 0) ? 0 : (change / panel.lacp) * 100;
                        } else {
                            change = 0;
                            chgpc = 0;
                        }

                        /* follow as per tclite. Show indices for all exchange.
                        if (panel.exchangeCode == "A" || panel.exchangeCode == "AD" || panel.exchangeCode == "N" || panel.exchangeCode == "ND") {
                            panel.clearTextField();
                        } else {
                        */
                            if (!isNaN(panel.last) && panel.last != '')
                                panel.setLast(panel.last);
                            if (!isNaN(change) && change != '')
                                panel.setChange(change, chgpc);

                        //}
                        //console.log("last:"+last+", lacp:"+lacp);
                    } //end if 2000




                }//end if 10000 or 2000

            }  //end for
        } //(obj.s == true) 
    },
    /**
     * Description <br/>
     * 
     * 		reset stkcode
     */
    updateStkCode: function() {
        /*
         *this function is to reset the object stkcode
         *
         *this will take record from main.js and update into this object
         */

        var panel = this;

        var idx = feedLoginRet.ex;

        var idxcode;
        var totIdx = idx.length;
        for (var i = 0; i < totIdx; i++) {
            var exchg = idx[i];

            if (panel.exchangeCode == exchg.ex) {
                idxcode = exchg.ix;
                break;
            }
        }

        var enableAllLabel = true;

        if (idxcode == null || idxcode.length == 0) {
            if (global_derivativesMarket.indexOf('|') != -1) { // from main.jsp
                var tempList = global_derivativesMarket.split('|'); // from main.jsp
                for (var i = 0; i < tempList.length; i++) {
                    var tempStr = tempList[i].split(':');
                    if (tempStr[0] == panel.exchangeCode) {
                        idxcode = tempStr[1];
                    }
                }
            } else {
                if (global_derivativesMarket.length > 0) { // from main.jsp
                    var tempStr = global_derivativesMarket.split(':'); // from main.jsp
                    if (tempStr[0] == panel.exchangeCode) {
                        idxcode = tempStr[1];
                    }
                } else {
                    enableAllLabel = false;
                    idxcode = "";
                }
            }
        }

        panel._disableAllLabel(enableAllLabel);

        panel.stkcode = idxcode;
    },
    /**
     * Description <br/>
     * 
     * 		update record by exchange code is changing
     */
    updateByExchange: function() {
        var panel = this;

        panel.exchangeCode = exchangecode;

        // update this stcode
        panel.updateStkCode();
        // update market summary record
        panel.callSummary();
        // change exchange icon
        panel.setExchangeFlag();
        //update delay label
        panel.setDelayIndexLabel();

        // verify in the exchange exist this function or not
        var haveScoreBoard = true;
        var haveIndices = true;
        var haveSummary = true;
        var temp = determineItem(["Scoreboard", "Indices", "Summary"], panel.exchangeCode);
        for (var i = 0; i < temp.length; i++) {
            var obj = temp[i];
            if (obj.name == "Scoreboard") {
                if (!obj.status) {
                    haveScoreBoard = false;
                }
            } else if (obj.name == "Indices") {

                if (!obj.status) {
                    haveIndices = false;
                }
            } else if (obj.name == "Summary") {
                if (!obj.status) {
                    haveSummary = false;
                }

            }
        }

        if (!haveSummary) {
            panel.tButtonFlagSummaryGraph.disable(); //v1.3.33.13
        } else {
            panel.tButtonFlagSummaryGraph.enable(); //v1.3.33.13
        }

        // store the component is ready to destroy
        var destroyList = new Array();

        // catch up "Scoreboard" and "Indices" to process

        if (indices) {
            if (haveIndices) {
                // indices.on('activate', function(thisObject) {
                if (panel.exchangeCode != indices.exchangeCode) {
                    indices.exchangeCode = panel.exchangeCode;
                    indices.refresh();
                }
                // });
            } else {
                destroyList.push(indices);
            }
        }


        if (scoreBoard) {
            if (!haveScoreBoard) {
                destroyList.push(scoreBoard);
            } else {
                scoreBoard._createMainPanel();
            }
        }




        // update announcements news - from main.js 
        if (newsPanel != null) {
            createNewsPanel();
        }

        // update market summary - from main.js
        if (marketOverviewPanel) {
            if (haveSummary) {
                createSummaryPanel(true);
            } else {
                destroyList.push(marketOverviewPanel);
            }
        }

        // destroy list
        for (var i = 0; i < destroyList.length; i++) {
            var pItem = destroyList[i].up();
            if (pItem) {
                pItem.close();
            }
        }

    },
    /**
     * Description <br/>
     * 
     * 		change market image up or down
     * 
     * @param last : integer
     */
    setLast: function(last) {
        /*
         * change the image to show market is going down or going up
         */
        try {

            var panel = this;

            var label = panel.tLabelExchangeLast.getEl();

            if (label != null) {
                last = parseFloat(last).toFixed(3);
                var lastStr = '-';
                if (!isNaN(last)) {
                    lastStr = panel.formatNumber(last);
                }
                panel._autoWidth(panel.tLabelExchangeLast, lastStr);
                label.update(lastStr);

                var img = panel.tLabelSummaryUpDown.getEl();
                var change = (panel.last == 0 || panel.lacp == 0) ? 0 : panel.last - panel.lacp;

                if (change > 0) {
                    label.setStyle('color', cFUp);
                    if (global_personalizationTheme.indexOf("wh") != -1) {
                        img.update('<img src="' + sbUp_wb + '"/>');
                    } else {
                    img.update('<img src="images/arrow_up.png"/>');
                    }
                } else if (change < 0) {
                    label.setStyle('color', cFDown);
                    if (global_personalizationTheme.indexOf("wh") != -1) {
                        img.update('<img src="' + sbDown_wb + '"/>');
                    } else {
                    img.update('<img src="images/arrow_down.png"/>');
                    }
                } else {
                    label.setStyle('color', cFUnchanged);
                    img.update('');
                }
            }

        } catch (e) {
            debug(e);
        }
    },
    /**
     * Description <br/>
     * 
     * 		change market summary text color 
     * 
     * @param change : integer
     * @param chgpc  : integer
     */
    setChange: function(change, chgpc) {
        /*
         * change the text color, easy user to see it
         */
        var panel = this;

        var label = panel.tLabelExchangeChange.getEl();
        if (label != null) {
            change = parseFloat(change).toFixed(2);
            chgpc = parseFloat(chgpc).toFixed(2);
            var _change;
            if (change > 0) {
                _change = '+' + change;
            } else {
                _change = change;
            }
            var str = _change + ' (' + chgpc + '%)';
            panel._autoWidth(panel.tLabelExchangeChange, str);
            label.update(str);

            if (change > 0) {
                label.setStyle('color', cFUp);
            } else if (change < 0) {
                label.setStyle('color', cFDown);
            } else {
                label.setStyle('color', cFUnchanged);
            }
            panel.change = change;
        }
    },
    /**
     * Description <br/>
     * 
     * 		set number format 
     * 
     * @param value : integer
     * 
     * @return integer
     */
    formatNumber: function(value) {
        value += '';
        var x = value.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    },
    /**
     * Description <br/>
     * 
     * 		return field record
     * 
     * @return array
     */
    getFieldList: function() {
        /*
         * get the requirement record 
         * 
         * this array will pack in all the requirement record number and will pass into the server to get this all record
         */
        var fieldlist = new Array();
        fieldlist.push(fieldStkName);
        fieldlist.push(fieldLacp);
        fieldlist.push(fieldLast);
        fieldlist.push(fieldHigh);
        fieldlist.push(fieldLow);

        fieldlist.push(fieldTransDate);
        fieldlist.push(fieldTransTime);

        return fieldlist;
    },
    /**
     * Description <br/>
     * 		
     * 		clear text field text / value
     */
    clearTextField: function() {
        var panel = this;

        /*
         * clear all market summary text field
         */
        helper.setHtml(panel.tLabelSummaryUpDown, '');
        helper.setHtml(panel.tLabelExchangeLast, '');
        helper.setHtml(panel.tLabelExchangeChange, '');
        helper.setHtml(panel.tLabelDown, '');
        helper.setHtml(panel.tLabelTrade, '');
        helper.setHtml(panel.tLabelUnchange, '');
        helper.setHtml(panel.tLabelUntrade, '');
        helper.setHtml(panel.tLabelUp, '');
        helper.setHtml(panel.tLabelValue, '');
        helper.setHtml(panel.tLabelVolumn, '');
        if (N2N_CONFIG.sumColorBar) {
            panel.upDownBar.update('');
            panel.unChgTrdBar.update('');
        }
    },
    /**
     * Description <br/>
     * 
     * 		looping clock time 
     */
    clockStart: function() {
        /*
         * start to counting clock value
         */

        var panel = this;

        panel.stopLoopTime();

        /*
         * this will increase 1 second by every second
         * 
         * 1000 equal 1 second 
         */
        panel.loopTime = setInterval(function() {

            /*
             * catch the time text field by id
             */

            var dayInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            /*
             * this part is increasing the second, minute, hour, day, month and year
             */
            panel.globalSecond = parseInt(panel.globalSecond) + 1;
            if (parseInt(panel.globalSecond) == 60) {
                panel.globalSecond = 0;
                panel.globalMinute = parseInt(panel.globalMinute) + 1;
                if (parseInt(panel.globalMinute) == 60) {
                    panel.globalMinute = 0;
                    panel.globalHour = parseInt(panel.globalHour) + 1;
                    if (parseInt(panel.globalHour) == 24) {
                        panel.globalHour = 0;
                        panel.globalDay = parseInt(panel.globalDay) + 1;
                        var dayMonth = 0;
                        if (panel.globalMonth == 2) {
                            // check is leap year or not 
                            if ((parseInt(panel.globalMonth) % 4 == 0) && (parseInt(panel.globalMonth) % 100 != 0 || parseInt(panel.globalMonth) % 400 == 0)) {
                                dayMonth = 29 + 1;
                            } else {
                                dayMonth = parseInt(dayInMonth[parseInt(panel.globalMonth - 1)]) + 1;
                            }
                        } else {
                            dayMonth = parseInt(dayInMonth[parseInt(panel.globalMonth - 1)]) + 1;
                        }

                        if (parseInt(panel.globalDay) == parseInt(dayMonth)) {
                            panel.globalDay = 1;
                            panel.globalMonth = parseInt(panel.globalMonth) + 1;
                            if (parseInt(panel.globalMonth) == 13) {
                                panel.globalMonth = 1;
                                panel.globalYear = parseInt(panel.globalYear) + 1;
                            }
                        }
                    }
                }
            }

            /*
             * this part is combine second, minute and hour together to string
             */
            var stringTime = panel.getTime()
            //var stringDate = panel.getDate()
            var stringDate = global_DateHidden == 'TRUE' ? '' : panel.getDate();
            if (global_personalizationTheme.indexOf("wh") != -1) {
                stringDate = "";
            }
            if (panel.tLabelDateTime != null) {
                // panel.tLabelDateTime.setText(stringDate + " " + stringTime);
                helper.setHtml(panel.tLabelDateTime, stringDate + " " + stringTime);
            }

            /*
             * if this panel haven't display the market summary, 
             * it will recall the method agains
             */
            if (panel.displaySummary == false) {
                panel.callSummary();
            }


            /*
             * this part is every 5 minute will update market summary record
             * 
             * 
             * why :
             * 		because it is to retrieve a new time from server
             */
            panel.isFiveMinute = parseInt(panel.isFiveMinute) + 1;
            if (parseInt(panel.isFiveMinute) == 300) {
                if (jQC == "TRUE") {
                    // ignore, due to jQC will return all exchange information
                    // TODO: to enhance currently did cater data push from QC and update user according
                } else {
                    panel.callSummary();
                }
                panel.isFiveMinute = 0;
            }

        }, 1000);
    },
    /* susan 20121218
     * stop the time at market summary bar
     */
    stopLoopTime: function() {
        var panel = this;

        if (panel.loopTime) {
            clearInterval(panel.loopTime);
            panel.loopTime = null;
        }
    },
    /**
     * Description <br/>
     * 
     * 		set date value
     * 
     * @param value : string
     */
    setDate: function(value) {
        /* value : 
         * 		20121203
         * 
         * set date into this object
         */
        var panel = this;

        if (value == null) {
            return;
        }

        var year = value.substring(0, 4);
        var month = value.substring(4, 6);
        var day = value.substring(6, value.length);

        panel.globalDay = day;
        panel.globalMonth = month;
        panel.globalYear = year;
    },
    /**
     * Description <br/>
     * 
     * 		set date time value
     * 
     * @param time : string
     * @param date : string
     */
    setClockTime: function(time, date) {
        /* time:
         * 		12:02:12.120
         * 		12:21:21
         * 		120423
         * 
         * date:
         * 		20120327
         * 
         * 
         * set the time value
         * 
         * this function is to verify the latest time 
         * if this clockTime is null, mean didn't have latest time
         * else exist the latest time and it may be need to update it
         */
        var panel = this;

        var splitObj = null;

        if (time == null) {
            return;
        }

        /*
         * check the value inside exist "." symbol
         * 
         * if yes, 
         * 		it will split it by "." and ":"
         * else 
         * 		it will split by ":"
         * 
         * 
         * why : because it have two type value, such as
         * 		12:01:21.234  /  12:02:42
         */
        if (time.indexOf(".") != -1) {
            if (time.indexOf(":") != -1) {
                splitObj = time.split(".")[0].split(":");
            }
        } else {
            if (time.indexOf(":") != -1) {
                splitObj = time.split(":");
            } else {
                if (time.length == 6) {
                    splitObj = new Array();
                    splitObj.push(time.substring(0, 2));
                    splitObj.push(time.substring(2, 4));
                    splitObj.push(time.substring(4, 6));
                } else if (time.length == 5) {
                    splitObj = new Array();
                    splitObj.push(time.substring(0, 1));
                    splitObj.push(time.substring(1, 3));
                    splitObj.push(time.substring(3, 5));
                }
            }
        }
        /*
         * if the value inside didn't have "." or ":", it will null 
         */
        if (splitObj == null) {
            return;
        }


        var setNewTime = false;

        //var year = "";
        //var month = "";
        //var day = "";




        /*
         * after split value, it will compare the time is latest or old 
         * 
         * if year > current year
         * 		reset time
         * else
         * 		if month > current month
         * 			reset time
         * 		else
         * 			if day > current day
         * 				reset time
         * 			else
         * 				if hour > current hour 
         * 					reset time
         *	 			else
         * 					if minute > current minute
         * 						reset time
         * 					else
         * 						if second > current second 
         * 							reset time
         */

        if (date != null) {
            year = date.substring(0, 4);
            month = date.substring(4, 6);
            day = date.substring(6, date.length);
            /*
             if(year > parseInt(panel.globalYear)){
             setNewTime = true;
             }else{
             if(month > parseInt(panel.globalMonth)){
             setNewTime = true;
             }else{
             if(day > parseInt(panel.globalMonth)){
             setNewTime = true;
             }else{
             if(parseInt(splitObj[0]) > panel.globalHour){
             setNewTime = true;	
             }else{
             if(parseInt(splitObj[1]) > panel.globalMinute){
             setNewTime = true;
             }else{
             if(parseInt(splitObj[2]) > panel.globalSecond){
             setNewTime = true;
             console.log("testing"+splitObj[2]+">"+ panel.globalSecond);
             }
             }			
             }	
             }
             }
             }*/




            var glMinute = panel.globalMinute.toString().length != 2 ? '0' + panel.globalMinute.toString() : panel.globalMinute.toString();
            var glSecond = panel.globalSecond.toString().length != 2 ? '0' + panel.globalSecond.toString() : panel.globalSecond.toString();
            var glTime = (panel.globalHour.toString() + glMinute.toString() + glSecond.toString()).toString();

            if (panel.tempExchCode == panel.exchangeCode) {
                if (parseInt(splitObj[0] + splitObj[1] + splitObj[2]) > parseInt(glTime)) { // compare time to make sure that time couldn't be backward..

                    setNewTime = true;

                }
            } else {
                panel.tempExchCode = panel.exchangeCode;
                setNewTime = true;
            }

        } else {
            setNewTime = true;
        }

        if (setNewTime) {
            panel.globalHour = parseInt(splitObj[0]);
            panel.globalMinute = parseInt(splitObj[1]);
            panel.globalSecond = parseInt(splitObj[2]);
        }
    },
    /**
     * Description <br/>
     * 
     * 		change market summary icon image
     */
    setExchangeFlag: function() {
        /*
         * this function is to set the exchange flag icon
         * 
         * ** this exchange code is get from main.js
         */
        var panel = this;

        var icon = "";
        var ex = panel.exchangeCode;
        switch (ex) {
            case 'A':
            case 'AD':
                icon = iconExchgFlag_A;
                break;
            case 'ZS':
            case 'ZSD':
                icon = iconExchgFlag_ZS;
                break;
            case 'YM':
            case 'YMD':
                icon = iconExchgFlag_YM;
                break;
            case 'UP':
            case 'UPD':
                icon = iconExchgFlag_UP;
                break;
            case 'UC':
            case 'UCD':
                icon = iconExchgFlag_UC;
                break;
            case 'SG':
            case 'SGD':
            case 'SI':
            case 'SID':
                icon = iconExchgFlag_SG;
                break;
            case 'SA':
            case 'SAD':
                icon = iconExchgFlag_SA;
                break;
            case 'P':
            case 'PD':
                icon = iconExchgFlag_P;
                break;
            case 'OM':
            case 'OMD':
                icon = iconExchgFlag_OM;
                break;
            case 'O':
            case 'OD':
                icon = iconExchgFlag_O;
                break;
            case 'N':
            case 'ND':
                icon = iconExchgFlag_N;
                break;
            case 'MY':
            case 'MYD':
                icon = iconExchgFlag_MY;
                break;
            case 'KL':
            case 'KLL':
            case 'KLD':
                icon = iconExchgFlag_KL;
                break;
            case 'JK':
            case 'JKD':
                icon = iconExchgFlag_JK;
                break;
            case "HN":
                icon = iconExchgFlag_HN;
                break;
            case "HK":
            case 'HKD':
                icon = iconExchgFlag_HK;
                break;
            case "HC":
                icon = iconExchgFlag_HC;
                break;
            case "ES":
            case "ESD":
                icon = iconExchgFlag_ES;
                break;
            case "BK":
            case "BKD":
                icon = iconExchgFlag_BK;
                break;
            case "PH":
            case "PHD":
                icon = iconExchgFlag_PH;
                break;
        }


        if (panel.tButtonFlagSummaryGraph != null) {	//v1.3.33.13		
            // get the image src

            var icons = panel.tButtonFlagSummaryGraph.icon;

            if (icons != null) {
                if (icons != icon) {
                    panel.tButtonFlagSummaryGraph.setIcon(icon);
                }
            }
            else {
                panel.tButtonFlagSummaryGraph.setIcon(icon);
            }
        }

        /* //v1.3.33.13
         * 	if the component is not empty 
         * 		it will get the image src and compare the image src
         * 			if they are not same, it will update it
         */
//		if(panel.tImageFlag != null){			
//			// get the image src
//			
//			var label = panel.tImageFlag.getEl();
//			
//			if (label != null) {
//				var labelString = label.getAttribute('src');
//				if(labelString.length == 0){
//					label.dom.src = icon;
//				}else{
//					if(labelString != icon){
//						label.dom.src = icon;
//					}
//				}
//			}
//		}
    },
    /**
     * Description <br/>
     * 
     *  	return date format , e.g. : 10/03/2012
     *  
     *  @return string
     */
    getDate: function() {
        var panel = this;

        /*
         * this is set date format 
         * 
         * e.g. 
         * 		12/03/2012
         */
//		var stringDate = "";
//    	if(panel.globalDay.toString().length == 1){
//    		stringDate = "0" + panel.globalDay;
//    	}else{
//    		stringDate = panel.globalDay;		    	
//    	}
//    	if(panel.globalMonth.toString().length == 1){
//    		stringDate = stringDate + "-0" + panel.globalMonth;
//    	}else{
//    		stringDate = stringDate + "-" + panel.globalMonth;
//    	}	    	
//    	stringDate = stringDate + "-" + panel.globalYear;

        var returnValue = '';
        if (panel.globalYear == 0 && panel.globalMonth == 0 && panel.globalDay == 0) {
            returnValue = ' '

        } else {
            var tempDate = new Date(panel.globalYear, (panel.globalMonth - 1), panel.globalDay, panel.globalHour, panel.globalMinute, panel.globalSecond);
            returnValue = Ext.Date.format(tempDate, global_DateFormat);


        }

        return returnValue;

    },
    /**
     * Description <br/>
     *  	
     *  	return time format , e.g. :  10:21:03
     *  
     *  @return string
     */
    getTime: function() {
        var panel = this;

        /*
         * this is set time format 
         * 
         * e.g. 
         * 		02:59:21
         */
//		var stringTime = panel.globalHour;    	
//    	if(panel.globalMinute.toString().length == 1){
//    		stringTime += ":0" + panel.globalMinute;
//    	}else{
//    		stringTime += ":" + panel.globalMinute;
//    	}
//    	if(panel.globalSecond.toString().length == 1){
//    		stringTime += ":0" + panel.globalSecond;
//    	}else{
//    		stringTime += ":" + panel.globalSecond;
//    	}    
        var returnValue = '';
//		if ( panel.globalYear == 0 && panel.globalMonth == 0 && panel.globalDay == 0 ) {
//			returnValue = ' ';
//			
//		} else {
        var tempDate = new Date(panel.globalYear, panel.globalMonth, panel.globalDay, panel.globalHour, panel.globalMinute, panel.globalSecond);
        //returnValue = tempDate.format( global_TimeFormat );
        returnValue = Ext.Date.format(tempDate, global_TimeFormat);

//		}

        return returnValue;
    },
    /**
     * Description <br/>
     *  	
     *  	return new Date()
     *  
     * @return Date
     */
    getDateTime: function() {
        var panel = this;
        /*
         * ** in javascript Date in month is from 0 to 11, not 1 to 12
         */
        var month = parseInt(panel.globalMonth) - 1;
        var dateTime = new Date(panel.globalYear, month, panel.globalDay, panel.globalHour, panel.globalMinute, panel.globalSecond, 0);

        return dateTime;
    },
    /**
     * Description <br/>
     * 
     * Creates a new window to display market summary image
     */
    displaySummaryGraph: function() {
        var panel = this;

        if (panel.summaryImage == null) {
            return;
        }

        panel.summaryImage.removeAll();

        var idxcode;
        var excode = this.exchangeCode;
        if (excode && excode == 'MY')
            excode = 'KL';

        try {
            var idx = feedLoginRet.ex;
            var totIdx = idx.length;
            for (var i = 0; i < totIdx; i++) {
                var exchg = idx[i];
                if (excode == exchg.ex) {
                    idxcode = exchg.ix;
                    break;
                }
            }
        } catch (e) {
            debug(e);
        }

        if (!idxcode) {
            idxcode = '';
        }

        if (!isStockChart) {
            var url = 'indexchart.jsp';

            if (idxcode) {
                url += ('?k=' + idxcode);
                url += ('&w=750&h=450');
                url += ('&c=' + formatutils.procThemeColor());
            }

            Ext.Ajax.request({
                url: url,
                method: 'GET',
                success: function(response) {
                    var imageUrl = Ext.util.Format.trim(response.responseText);

                    var object = null;
                    if (imageUrl != null && imageUrl.length > 0) {
                        object = Ext.create('widget.box', {
                            autoEl: {
                                tag: 'img',
                                src: imageUrl + '?' + Math.random()
                            }
                        });
                    } else {
                        object = new Ext.form.Label({
                            text: 'Chart Link not available'
                        });
                    }
                    panel.summaryImage.insert(0, object);
                }
            });
        } else {
            var bg = "#fff";
            if (formatutils.procThemeColor() == "b") {
                bg = "#000";
            }

            panel.chartPanel = Ext.create('Ext.ux.IFrame', {
                style: 'padding: 5px 5px 0px 5px;background:' + bg
            });

            panel.summaryImage.insert(0, panel.chartPanel);
            // Removes delayed exchange suffix. Determine whether exchange is delayed based on param 'View'
            var nonDelayCode = stockutil.removeStockDelay(idxcode);
            var stkParts = stockutil.getStockParts(nonDelayCode);
            var excode = stkParts.exch; //stockutil.getExchange(idxcode);
            var stkcode = stkParts.code; //idxcode.split('.')[0];
            var name = '';
            conn.getIndices({
            	ex: excode,
            	code: idxcode,
            	success: function(obj2) {
            		if (obj2 != null) {
            			if(obj2.s && obj2.d.length > 0){
            				var dt = obj2.d[0];
            				name = dt[fieldStkName];

            				var url = embeddedStockChartURL + "?code=" + stkcode + '&Name=' + encodeURIComponent(stockutil.getStockName(name)) + "&exchg=" + excode + "&isstock=N&mode=d&color=" + formatutils.procThemeColor() + '&lang=' + global_Language + '&View=' + (stockutil.isDelayStock(stkcode) ? 'D' : 'R');
            				panel.chartPanel.refresh(url);
            			}else{
            				var url = embeddedStockChartURL + "?code=" + stkcode + '&Name=' + encodeURIComponent(stockutil.getStockName(name)) + "&exchg=" + excode + "&isstock=N&mode=d&color=" + formatutils.procThemeColor() + '&lang=' + global_Language + '&View=' + (stockutil.isDelayStock(stkcode) ? 'D' : 'R');
            				panel.chartPanel.refresh(url);
            			}
            		}
            	}
            });
        }

    },
    _disableAllLabel: function(visible) {
        var panel = this;

        panel.suspendLayouts();
        panel.tImageDown.setVisible(visible);
        panel.tImageTrade.setVisible(visible);
        panel.tImageUnchange.setVisible(visible);
        panel.tImageUntrade.setVisible(visible);
        panel.tImageUp.setVisible(visible);
        panel.tImageValue.setVisible(visible);
        panel.tImageVolumn.setVisible(visible);

        panel.tLabelDown.setVisible(visible);
        panel.tLabelExchangeChange.setVisible(visible);
        panel.tLabelExchangeLast.setVisible(visible);
        panel.tLabelSummaryUpDown.setVisible(visible);
        panel.tLabelTrade.setVisible(visible);
        panel.tLabelUnchange.setVisible(visible);
        panel.tLabelUntrade.setVisible(visible);
        panel.tLabelUp.setVisible(visible);
        panel.tLabelValue.setVisible(visible);
        panel.tLabelVolumn.setVisible(visible);
        if (N2N_CONFIG.sumColorBar) {
            panel.upDownBar.setVisible(visible);
            panel.unChgTrdBar.setVisible(visible);
        }
        panel.resumeLayouts(true);

        if (showMarketSummaryGraph.toLowerCase() == "true") {
            panel.tButtonFlagSummaryGraph.enable(); //v1.3.33.13
        }
        else
            panel.tButtonFlagSummaryGraph.disable(); //v1.3.33.13
    },
    /**
     * Updates value and volume
     */
    _updateVV: function() {
        var me = this;

        if (me._value) {
            var valueEl = me.tLabelValue.getEl();
            if (valueEl != null) {
                var valStr;
                if (me._roundValue) {
                    valStr = formatutils.formatNumberLot(me._value);
                } else {
                    valStr = me.formatNumber(me._value);
                }

                me._autoWidth(me.tLabelValue, valStr);
                valueEl.update(valStr);
            }
        }

        if (me._volume) {
            var volumeEl = me.tLabelVolumn.getEl();
            if (volumeEl != null) {
                var volStr;
                if (me._roundValue) {
                    volStr = formatutils.formatNumberLot(me._volume);
                } else {
                    volStr = me.formatNumber(me._volume);
                }

                me._autoWidth(me.tLabelVolumn, volStr);
                volumeEl.update(volStr);
            }
        }
    },
    _autoWidth: function(comp, text) {
        var me = this;

        if (me.fmx) {
            var compWidth = comp.width;
            var textWidth = me.fmx.getWidth(text); // gets the width of content

            if (textWidth > compWidth) {
                comp.setWidth(textWidth); // removes 3px padding
            }
        }
    },
    updateBars: function() {
        if (N2N_CONFIG.sumColorBar) {
            var me = this;

            // up/down bar
            if (me._up && me._down) {
                me._up = parseInt(me._up);
                me._down = parseInt(me._down);
                var totalUpDown = me._up + me._down;
                var upRate = Math.round(me._up * 100 / totalUpDown);
                var tooltip1 = languageFormat.getLanguage(11031, 'Up') + ' ' + upRate + '%';
                var tooltip2 = languageFormat.getLanguage(11032, 'Down') + ' ' + (100 - upRate) + '%';

                me.upDownBar.update(me.getColorBar(upRate, tooltip1 + '\n' + tooltip2, 'bar-up', 'bar-down'));
            }

            // unchanged/untraded bar
            if (me._unchg && me._untrd) {
                me._unchg = parseInt(me._unchg);
                me._untrd = parseInt(me._untrd);
                var totalUnchgTrd = me._unchg + me._untrd;
                var unchgRate = Math.round(me._unchg * 100 / totalUnchgTrd);
                var tooltip1 = languageFormat.getLanguage(11036, 'Unchanged') + ' ' + unchgRate + '%';
                var tooltip2 = languageFormat.getLanguage(11037, 'Untraded') + ' ' + (100 - unchgRate) + '%';

                me.unChgTrdBar.update(me.getColorBar(unchgRate, tooltip1 + '\n' + tooltip2, 'N2N_BackUnchg', 'N2N_BackUnTrd'));
            }
        }
    },
    getColorBar: function(rate, tooltip, cls1, cls2) {
        var pc1 = '<div class="pc1 '+ cls1 +'" style="width: ' + rate + '%"></div>';
        var bgpc = '<div title="' + tooltip + '" class="bgpc '+cls2+'">' + pc1 + ' <div class="bgtext"></div></div>';

        return bgpc;
    },
    setDelayIndexLabel: function(){
		var panel = this;
		panel.isIndexDelay = false;
		panel.tLabelIndexDelay.setText('');
		
		if(delayIndicesExList.length > 0){
			var delayIndicesList = delayIndicesExList.split(',');
			for(var i=0; i<delayIndicesList.length; i++){
				if(delayIndicesList[i] == panel.exchangeCode){
					panel.isIndexDelay = true;
					panel.tLabelIndexDelay.setText('[Delayed]');
					break;
    }
			}
		}
	}
});
