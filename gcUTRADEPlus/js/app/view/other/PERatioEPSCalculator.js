Ext.define('TCPlus.view.other.PERatioEPSCalculator', {
    extend: 'Ext.container.Container',
    alias: 'widget.perepscalc',
    // vtypes
    qtyTest: /^[1-9]|^[1-9]+$[0-9]/,
    prcTest: /^-?\.\d{1,}$|^-?\d{1,}\.\d{1,}$|^-?\d{1,}\.\d{1,}$|^-?[0-9]\d{1,}$|^-?[0-9]$/,
    type: 'calculator',
    stk: null,
    winConfig: {
        width: 570,
        height: 193
    },
    initComponent: function() {
        var panel = this;

        Ext.apply(Ext.form.field.VTypes, {
            qty: function(val, field) {
                return panel.qtyTest.test(val);
            },
            qtyText: 'Please enter a valid quantity',
            qtyMask: /[0-9\b]/i,
            sharePrc: function(val, field) {
                return panel.prcTest.test(val);
            },
            sharePrcText: 'Please enter a valid price',
            sharePrcMask: /-?[0-9.\b]/i
        });
        
        var vNetEarnings = 0;
        var vTotalCash = 0;
        var vOutstandingShares = 0;
        var vPriceperShare = 0;
        var vEPS = 0;
        var vEEPS = 0;
        var vPERatio = 0;
        var vEPERatio = 0;

        var itemWidth = 260;
        var labelWidth = 135;
        if (isMobile) {
            itemWidth = 275;
            labelWidth = 150;
        }
        var fcLabelWidth = 73;
        var per_formPanelItems = [
            {
                xtype: 'numericfield',
                name: 'pricepershare',
                fieldLabel: languageFormat.getLanguage(21006, 'Price per share'),
                invalidClass: 'calculator-invalid ', //in css
                allowBlank: true,
                enableKeyEvents: true,
                vtype: 'sharePrc',
                emptyText: languageFormat.getLanguage(30307, 'Enter a value'),
                fieldStyle: 'text-align:right;',
                decimalPrecision: 3,
                allowDecimals: true,
                alwaysDisplayDecimals: true,
                decimalSeparator: '.',
                useThousandSeparator: true,
                thousandSeparator: ',',
                hideTrigger: true,
                listeners: {
                    keyup: function() {
                        var val = this.getRawValue();
                        //check val is not null
                        if (val) {
                            if (!panel.prcTest.test(val)) {
                                this.setValue('');
                                msgutil.alert(Ext.form.VTypes.sharePrcText);
                            }else{
                            	panel.compute("PER");
                            	panel.compute("EPER");
                            }
                        }
                    }
                }
            },{
            	xtype: 'numberfield',
            	name: 'annualeps',
            	fieldLabel: languageFormat.getLanguage(20056, 'EPS'),
            	invalidClass: 'calculator-invalid ', //in css
            	allowBlank: true,
            	enableKeyEvents: true,
            	vtype: 'sharePrc',
            	emptyText: languageFormat.getLanguage(30307, 'Enter a value'),
            	fieldStyle: 'text-align:right;',
            	decimalPrecision: 3,
            	allowDecimals: true,
            	alwaysDisplayDecimals: true,
            	decimalSeparator: '.',
            	useThousandSeparator: true,
            	thousandSeparator: ',',
            	hideTrigger: true,
            	listeners: {
            		keyup: function() {
            			var val = this.getRawValue();
            			//check val is not null
            			if (val) {
            				if (!panel.prcTest.test(val)) {
            					this.setValue('');
            					msgutil.alert(Ext.form.VTypes.sharePrcText);
            				}else{
                            	panel.compute("PER");
                            }
            			}
            		},
            		change: function() {
            			panel.compute("PER");
            		}
            	}
            },{
            	xtype: 'numberfield',
            	name: 'eannualeps',
            	fieldLabel: languageFormat.getLanguage(21007, 'Enhanced EPS'),
            	invalidClass: 'calculator-invalid ', //in css
            	allowBlank: true,
            	enableKeyEvents: true,
            	vtype: 'sharePrc',
            	emptyText: languageFormat.getLanguage(30307, 'Enter a value'),
            	fieldStyle: 'text-align:right;',
            	decimalPrecision: 3,
            	allowDecimals: true,
            	alwaysDisplayDecimals: true,
            	decimalSeparator: '.',
            	useThousandSeparator: true,
            	thousandSeparator: ',',
            	hideTrigger: true,
            	listeners: {
            		keyup: function() {
            			var val = this.getRawValue();
            			//check val is not null
            			if (val) {
            				if (!panel.prcTest.test(val)) {
            					this.setValue('');
            					msgutil.alert(Ext.form.VTypes.sharePrcText);
            				}else{
                            	panel.compute("EPER");
                            }
            			}
            		},
            		change: function() {
            			panel.compute("EPER");
            		}
            	}
            },/*{
                xtype: 'fieldcontainer',
                fieldLabel: '',
                hideEmptyLabel: false,
                labelWidth: fcLabelWidth,
                padding: '4 0 4 0',
                items: [
                     {
                        xtype: 'button',
                        style: 'margin-left: 47px;text-align: right;',
                        text: 'Compute',
                        handler: function() {
                            Ext.getCmp('peratioform').getForm().findField('peRatio').setValue(panel.formatCurrencyDecimal(panel.compute("PER"), 3));
                        }
                    }
                ]
            },*/ {
                xtype: 'textfield',
                name: 'peRatio',
                fieldLabel: languageFormat.getLanguage(21008, 'P/E ratio'),
                readOnly: true,
                useThousandSeparator: true,
                thousandSeparator: ',',
                allowBlank: true,
                decimalPrecision: 3,
                allowDecimals: true,
                alwaysDisplayDecimals: true,
                decimalSeparator: '.',
                labelSeparator: ':&nbsp;' + "<img src='" + iconOrdPadHelp10 + "'title=" + languageFormat.getLanguage(21013, 'P/E Ratio = Price per Share / EPS') + "/>",
                fieldStyle: 'text-align:right;',
                labelStyle:'font-weight:bold;'	
            }, {
                xtype: 'textfield',
                name: 'epeRatio',
                fieldLabel: languageFormat.getLanguage(21009, 'Enhanced P/E ratio'),
                readOnly: true,
                useThousandSeparator: true,
                thousandSeparator: ',',
                allowBlank: true,
                decimalPrecision: 3,
                allowDecimals: true,
                alwaysDisplayDecimals: true,
                decimalSeparator: '.',
                labelSeparator: ':&nbsp;' + "<img src='" + iconOrdPadHelp10 + "'title=" + languageFormat.getLanguage(21014, 'Enhanced P/E Ratio = Price per Share / Enhanced EPS') + "/>",
                fieldStyle: 'text-align:right;',
                labelStyle:'font-weight:bold;'	
            }
        ];

        var per_formPanel = new Ext.form.Panel({
            title: languageFormat.getLanguage(20055, 'P/E Ratio'),
            columnWidth: 0.5,
            style: 'margin: 5px; color: #000;',
            bodyStyle: {
                background: 'transparent'
            },
            id: 'peratioform',
            frame: true,
            autoScroll: true,
            defaults: {
                width: itemWidth,
                labelWidth: labelWidth
            },
            items: per_formPanelItems
        });

        var eps_formPanelItems = [
            {
                xtype: 'numericfield',
                fieldLabel: languageFormat.getLanguage(21010, 'Net earnings'),
                name: 'netearn',
                invalidClass: 'calculator-invalid ',
                allowBlank: true,
                useThousandSeparator: true,
                thousandSeparator: ',',
                emptyText: languageFormat.getLanguage(30307, 'Enter a value'),
                enableKeyEvents: true,
                allowDecimals: false,
                decimalSeparator: '.',
                vtype: 'sharePrc',
                fieldStyle: 'text-align:right;',
                hideTrigger: true,
                listeners: {
                    keyup: function() {
                        var val = this.getRawValue();
                        //check val is not null
                        if (val) {
                            if (!panel.prcTest.test(val)) {
                                this.setValue('');
                                msgutil.alert(Ext.form.VTypes.sharePrcText);
                            }else{
                            	panel.compute("EPS");
                            	panel.compute("EEPS");
                            }
                        }


                    }
                }
            }, {
            	xtype: 'numericfield',
            	fieldLabel: languageFormat.getLanguage(21011, 'Total Cash'),
            	name: 'totalcash',
            	invalidClass: 'calculator-invalid ',
            	allowBlank: true,
            	useThousandSeparator: true,
            	thousandSeparator: ',',
            	emptyText: languageFormat.getLanguage(30307, 'Enter a value'),
            	enableKeyEvents: true,
            	allowDecimals: false,
            	alwaysDisplayDecimals: true,
            	decimalSeparator: '.',
            	vtype: 'sharePrc',
            	fieldStyle: 'text-align:right;',
            	hideTrigger: true,
            	listeners: {
            		keyup: function() {
            			var val = this.getRawValue();
            			//check val is not null
            			if (val) {
            				if (!panel.prcTest.test(val)) {
            					this.setValue('');
            					msgutil.alert(Ext.form.VTypes.sharePrcText);
            				}else{
                            	panel.compute("EEPS");
                            }
            			}


            		}
            	}
            }, {
                xtype: 'numericfield',
                fieldLabel: languageFormat.getLanguage(21012, 'Outstanding shares'),
                invalidClass: 'calculator-invalid ',
                name: 'outstdshares',
                enableKeyEvents: true,
                allowBlank: true,
                useThousandSeparator: true,
                thousandSeparator: ',',
                vtype: 'qty',
                emptyText: languageFormat.getLanguage(30307, 'Enter a value'),
                fieldStyle: 'text-align:right;',
                hideTrigger: true,
                listeners: {
                    keyup: function() {
                        var val = this.getRawValue();
                        //check val is not null
                        if (val) {
                            if (!panel.qtyTest.test(val)) {
                                this.setValue('');
                                msgutil.alert(Ext.form.VTypes.qtyText);
                            }else{
                            	panel.compute("EPS");
                            	panel.compute("EEPS");
                            }
                        }
                    }
                }
            }, /*{
                xtype: 'fieldcontainer',
                fieldLabel: '',
                hideEmptyLabel: false,
                labelWidth: fcLabelWidth,
                padding: '4 0 4 0',
                items: [
                   {
                        xtype: 'button',
                        style: 'margin-left: 47px;text-align: right;',
                        text: languageFormat.getLanguage(21003, 'Compute'),
                        handler: function() {
                            Ext.getCmp('epsform').getForm().findField('eps').setValue(panel.formatCurrencyDecimal(panel.compute("EPS"), 3));
                        }
                    }
                ]
            },*/ {
                xtype: 'numberfield',
                name: 'eps',
                fieldLabel: languageFormat.getLanguage(20056, 'EPS'),
                readOnly: true,
                enableKeyEvents: true,
                allowBlank: true,
                useThousandSeparator: true,
                thousandSeparator: ',',
                decimalPrecision: 3,
                allowDecimals: true,
                alwaysDisplayDecimals: true,
                decimalSeparator: '.',
                //vtype: 'qty',
                labelSeparator: ':&nbsp;' + "<img src='" + iconOrdPadHelp10 + "'title=" + languageFormat.getLanguage(21015, 'EPS = Net Earnings / Outstanding Shares') + "/>",
                fieldStyle: 'text-align:right;',
                labelStyle:'font-weight:bold;'	
            },
            {
                xtype: 'numberfield',
                name: 'eeps',
                fieldLabel: languageFormat.getLanguage(21007, 'Enhanced EPS'),
                readOnly: true,
                enableKeyEvents: true,
                allowBlank: true,
                useThousandSeparator: true,
                thousandSeparator: ',',
                decimalPrecision: 3,
                allowDecimals: true,
                alwaysDisplayDecimals: true,
                decimalSeparator: '.',
                //vtype: 'qty',
                labelSeparator: ':&nbsp;' + "<img src='" + iconOrdPadHelp10 + "'title=" + languageFormat.getLanguage(21016, 'Enhanced EPS = (Net Earnings + Total Cash) / Outstanding Shares') + "/>",
                fieldStyle: 'text-align:right;',
                labelStyle:'font-weight:bold;'	
            }
        ];

        var eps_formPanel = new Ext.form.Panel({
            title: languageFormat.getLanguage(20056, 'EPS'),
            columnWidth: 0.5,
            style: 'margin: 5px; color: #000;',
            bodyStyle: {
                background: 'transparent'
            },
            id: 'epsform',
            frame: true,
            autoScroll: true,
            defaults: {
                width: itemWidth,
                labelWidth: labelWidth
            },
            items: eps_formPanelItems
        });

        var newItemList = [
            per_formPanel,
            eps_formPanel
        ];

        var ctLayout = 'column';
        var mainCt;
        if (isMobile) {
            ctLayout = 'vbox';
            mainCt = newItemList;
            /*Ext.create('Ext.tab.Panel', {
                items: newItemList
            });*/
        } else {
            mainCt = newItemList;
        }

        var defaultConfig = {
            layout: ctLayout,
            autoScroll: true,
            items: mainCt
        };
        
        this.getFundamentalData(this.stk);

        Ext.apply(this, defaultConfig);
        this.callParent(arguments);
    },
    formatCurrencyDecimal: function(value, dec) {
        return parseFloat(value).toFixed(dec);
    },
    compute: function(type) {
    	var panel = this;
        if (type == "PER") {
            var prcpershare = Ext.getCmp('peratioform').getForm().findField('pricepershare').getValue();
            var annualeps = Ext.getCmp('peratioform').getForm().findField('annualeps').getValue();
            var peRatioTotal = 0; 
            
            if (!Ext.getCmp('peratioform').getForm().isValid()) {
               // msgutil.alert(languageFormat.getLanguage(30301, 'Please check the fields in red border'));
                return;
            }

            if (prcpershare == null || prcpershare == "") {
                //msgutil.alert(languageFormat.getLanguage(30302, 'Please enter price per share'));
                return;
            }
            if (annualeps == null || annualeps == "") {
                //msgutil.alert(languageFormat.getLanguage(30303, 'Please enter annual EPS'));
                return;
            }

            peRatioTotal = prcpershare / annualeps;
            
            //return peRatioTotal;
            if(peRatioTotal < 0){
                Ext.getCmp('peratioform').getForm().findField('peRatio').setValue('-');
            }else{
                Ext.getCmp('peratioform').getForm().findField('peRatio').setValue(panel.formatCurrencyDecimal(peRatioTotal, 3));
            }
        } else if (type == "EPER") {
            var prcpershare = Ext.getCmp('peratioform').getForm().findField('pricepershare').getValue();
            var eannualeps = Ext.getCmp('peratioform').getForm().findField('eannualeps').getValue();
            var peRatioTotal = 0; 
            
            if (!Ext.getCmp('peratioform').getForm().isValid()) {
               // msgutil.alert(languageFormat.getLanguage(30301, 'Please check the fields in red border'));
                return;
            }

            if (prcpershare == null || prcpershare == "") {
                //msgutil.alert(languageFormat.getLanguage(30302, 'Please enter price per share'));
                return;
            }
            if (eannualeps == null || eannualeps == "") {
                //msgutil.alert(languageFormat.getLanguage(30303, 'Please enter annual EPS'));
                return;
            }

            peRatioTotal = prcpershare / eannualeps;
            
            //return peRatioTotal;
            if(peRatioTotal < 0){
                Ext.getCmp('peratioform').getForm().findField('epeRatio').setValue('-');
            }else{
                Ext.getCmp('peratioform').getForm().findField('epeRatio').setValue(panel.formatCurrencyDecimal(peRatioTotal, 3));
            }
        } else if (type == "EPS") {

            var netearnings = Ext.getCmp('epsform').getForm().findField('netearn').getValue();
            var outstdshares = Ext.getCmp('epsform').getForm().findField('outstdshares').getValue();
            var epsTotal = 0;

            if (!Ext.getCmp('epsform').getForm().isValid()) {
               // msgutil.alert(languageFormat.getLanguage(30301, 'Please check the fields in red border'));
                return;
            }

            if (netearnings == null || netearnings == "") {
               // msgutil.alert(languageFormat.getLanguage(30302, 'Please enter net earnings'));
                return;
            }
            if (outstdshares == null || outstdshares == "") {
               // msgutil.alert(languageFormat.getLanguage(30303, 'Please enter outstanding shares'));
                return;
            }

            epsTotal = netearnings / outstdshares;
            //return epsTotal;
            Ext.getCmp('epsform').getForm().findField('eps').setValue(panel.formatCurrencyDecimal(epsTotal, 3));
            Ext.getCmp('peratioform').getForm().findField('annualeps').setValue(panel.formatCurrencyDecimal(epsTotal, 3));
        } else if (type == "EEPS") {

            var netearnings = Ext.getCmp('epsform').getForm().findField('netearn').getValue();
            var outstdshares = Ext.getCmp('epsform').getForm().findField('outstdshares').getValue();
            var totalcash = Ext.getCmp('epsform').getForm().findField('totalcash').getValue(); 
            var eepsTotal = 0;

            if (!Ext.getCmp('epsform').getForm().isValid()) {
               // msgutil.alert(languageFormat.getLanguage(30301, 'Please check the fields in red border'));
                return;
            }

            if (netearnings == null || netearnings == "") {
               // msgutil.alert(languageFormat.getLanguage(30302, 'Please enter net earnings'));
                return;
            }
            if (outstdshares == null || outstdshares == "") {
               // msgutil.alert(languageFormat.getLanguage(30303, 'Please enter outstanding shares'));
                return;
            }
            if (totalcash == null || totalcash == "") {
               // msgutil.alert(languageFormat.getLanguage(30303, 'Please enter total cash'));
                return;
            }

            eepsTotal = (netearnings + totalcash) / outstdshares;
            //return epsTotal;
            Ext.getCmp('epsform').getForm().findField('eeps').setValue(panel.formatCurrencyDecimal(eepsTotal, 3));
            Ext.getCmp('peratioform').getForm().findField('eannualeps').setValue(panel.formatCurrencyDecimal(eepsTotal, 3));
        }
    },
    getFundamentalData: function(stk){
    	var panel = this;
    	var stkInfoFieldList = new Array();
    	stkInfoFieldList.push(fieldStkCode);
    	stkInfoFieldList.push(fieldStkName);
    	stkInfoFieldList.push(fieldShrIssue); 
    	stkInfoFieldList.push(fieldLast); 
    	stkInfoFieldList.push(fieldSectorCode); 
    	var fundamentalFieldList = new Array();
    	fundamentalFieldList.push(fieldStkCode);
    	//fundamentalFieldList.push(field17EPS); //eps
    	//fundamentalFieldList.push(field17ShareOutstanding); //shroutstanding
    	//fundamentalFieldList.push(field17EEPS); //eeps
    	fundamentalFieldList.push(field17NetIncome); //netincome 
    	fundamentalFieldList.push(field17TotalCash); //totalcash
    	
    	var calcStkCode = stk["stkCode"];
        
        conn.getStockInfo({
            f: stkInfoFieldList,
            k: calcStkCode,
            success: function(obj) {
                try {
                    if (obj.s == true && obj.c > 0) {
                       var data = obj.d[0];
                       var sector = data[fieldSectorCode];
                       var stkName = data[fieldStkName];
                       if(!formatutils.isWarrant(sector, stkName)){
                    	   vOutstandingShares = data[fieldShrIssue];
                    	   vPriceperShare = data[fieldLast];

                    	   Ext.getCmp('epsform').getForm().findField('outstdshares').setValue(vOutstandingShares);
                    	   Ext.getCmp('peratioform').getForm().findField('pricepershare').setValue(vPriceperShare); 

                    	   conn.getFundamentalInfo({
                    		   f: fundamentalFieldList,
                    		   k: calcStkCode,
                    		   success: function(obj) {
                    			   try {
                    				   if (obj.s == true && obj.c > 0) {
                    					   console.log(obj.d[0]);
                    					   var data = obj.d[0];
                    					   vNetEarnings = data[field17NetIncome];
                    					   vTotalCash = data[field17TotalCash];
                    					   vEPS = data[field17EPS];
                    					   vEEPS = data[field17EEPS];
                    					   Ext.getCmp('epsform').getForm().findField('netearn').setValue(vNetEarnings);
                    					   Ext.getCmp('epsform').getForm().findField('totalcash').setValue(vTotalCash);

                    					   panel.compute("EPS");
                    					   panel.compute("EEPS");
                    					   panel.compute("PER");
                    					   panel.compute("EPER");
                    				   }

                    			   } catch (e) {
                    				   console.log('[EPSCalc][callFundamentalInfo] Exception ---> ' + e);
                    			   }
                    		   }
                    	   });
                       }      
                    }

                } catch (e) {
                    console.log('[EPSCalc][callStkInfo] Exception ---> ' + e);
                }
            }
        });
    }
});
