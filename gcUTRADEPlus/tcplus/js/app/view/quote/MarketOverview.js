Ext.define('TCPlus.view.quote.MarketOverview', {
    extend: 'Ext.container.Container',
    debug: false,
    alias: 'widget.marketoverview',
    exchangecode: '',
    exchangename: '',
    stkcode: '',
    last: '',
    lacp: '',
    change: '',
    chgpc: '',
    runFirstTimeOnly: true,
    summaryPanel: null,
    chartPanel: null,
    slcomp: "mo",
    portConfig: {
        height: 227
    },
    winConfig: {
        width: 560,
        height: 265
    },
//    tConf: {
//        tab: 'tab4',
//        altTab: 'tab2'
//    },
    pieData: {},
    compRef: {},
    type: 'mo',
    savingComp: true,
    notMainSubscription: true,
    initialised: false,
    initComponent: function () {
        var panel = this;

        panel.summaryPanel = new Ext.container.Container({
            id: 'summaryPanel',
            layout: 'fit',
            defaults: {
                bodyStyle: 'border: none;',
                style: 'font-family: Helvetica,Verdana; font-weight: bold; font-size:10pt;'
            }
        });

        var defaultConfig = {
            title: languageFormat.getLanguage(20152, 'Market Summary'),
            layout: 'fit',
            header: false,
            bodyStyle: 'padding:0px; margin:0px; font-size: 12pt;',
            // style: 'margin-bottom: 10px;',
            width: '100%',
            border: false,
            animCollapse: true,
            columnLines: false,
            collapsible: true,
            enableColumnMove: false,
            viewConfig: {
                scrollOffset: 0,
                stripeRows: true
            },
            items: [panel.summaryPanel],
            cls: 'apply-black',
            listeners: {
                resize: function (thisComp, newWidth, newHeight, oldWidth, oldHeight) {
                        if (oldWidth) {
                            panel.newOpen = false;
                        }
                    
                    	if(panel.initialised && isStockChart){
                		if(oldWidth > oldHeight){
                			if(newWidth > newHeight){
                				var width = Ext.get("colInfo").getWidth();
                				var nw = newWidth - width;
                				Ext.get("colChart").setHeight(newHeight);
                				Ext.get("colChart").setWidth(nw);
                				panel.chartPanel.setHeight(newHeight);
                				panel.chartPanel.setWidth(nw);
                                panel.refreshPieChart(newHeight,nw);
                			}else{
                    panel.summaryPanel.removeAll();
                				panel._isLayout1 = false;
                				panel._isLayout3 = false;
                    if (panel.compRef.summaryPie) {
                        panel.compRef.summaryPie.destroy();
                    }

                				panel.summaryPanel.add({html: panel._getLayoutHtml2().join('')});

                				if (N2N_CONFIG.features_MarketSummary_PieChart) {
                					var tabHeight = Ext.get("colChart").getHeight();
                					if (panel._isLayout1) {
                						tabHeight -= Ext.get("lbl_title").getHeight();
                					}

                					panel.compRef.buttons = Ext.create('Ext.container.Container', {
                						renderTo: 'buttonsPanel',
                						width: "100%",
                						defaultType: 'button',
                                                                cls: 'normal-btn',
                						items: [{
                							tooltip: languageFormat.getLanguage(21022, 'Index Chart'),
                							iconCls: "icon-chart",
                							hidden: N2N_CONFIG.features_MarketSummary_PieChart ? false :true,
                									handler: function () {
                										var el = Ext.get("summarypie");
                										el.setVisibilityMode(Ext.Element.DISPLAY);
                										el.hide();
                										var el = Ext.get("indexChart");
                										el.show();
                										panel.getIndexChart(panel.needReloadChart);

                									}
                						}, {
                							tooltip: "Pie Chart",
                							iconCls: "icon-pie",
                							hidden: N2N_CONFIG.features_MarketSummary_PieChart ? false :true,
                									handler: function () {	
                										var el = Ext.get("indexChart");
                										el.setVisibilityMode(Ext.Element.DISPLAY);
                										el.hide();
                                                        panel.refreshPieChart();
                										var el = Ext.get("summarypie");
                										el.show();
                									}
                						},{
                							tooltip: languageFormat.getLanguage(10003, 'Reset'),
                							iconCls: 'icon-reset2',
                							handler: function () {
                								var el = Ext.get("summarypie");
                								el.setVisibilityMode(Ext.Element.DISPLAY);
                								el.hide();
                								var el = Ext.get("indexChart");
                								el.show();
                								panel.getIndexChart(true);
                							}
                						}]
                					});
                				}
                				panel.callSummary(true);
                			}
                		}else{
                			if(newWidth > newHeight){
                				panel.summaryPanel.removeAll();
                				panel._isLayout1 = false;
                				panel._isLayout3 = false;
                				if (panel.compRef.summaryPie) {
                					panel.compRef.summaryPie.destroy();
                				}

                				panel.summaryPanel.add({html: panel._getLayoutHtml3().join('')});

                				if (N2N_CONFIG.features_MarketSummary_PieChart) {
                					var tabHeight = Ext.get("colChart").getHeight();
                					if (panel._isLayout1) {
                						tabHeight -= Ext.get("lbl_title").getHeight();
                					}

                					panel.compRef.buttons = Ext.create('Ext.container.Container', {
                						renderTo: 'buttonsPanel',
                						width: "100%",
                						defaultType: 'button',
                                                                cls: 'normal-btn',
                						items: [{
                							tooltip: languageFormat.getLanguage(21022, 'Index Chart'),
                							iconCls: "icon-chart",
                							hidden: N2N_CONFIG.features_MarketSummary_PieChart ? false :true,
                									handler: function () {
                										var el = Ext.get("summarypie");
                										el.setVisibilityMode(Ext.Element.DISPLAY);
                										el.hide();
                										var el = Ext.get("indexChart");
                										el.show();
                										panel.getIndexChart(panel.needReloadChart);

                									}
                						}, {
                							tooltip: "Pie Chart",
                							iconCls: "icon-pie",
                							hidden: N2N_CONFIG.features_MarketSummary_PieChart ? false :true,
                									handler: function () {	
                										var el = Ext.get("indexChart");
                										el.setVisibilityMode(Ext.Element.DISPLAY);
                										el.hide();
														panel.refreshPieChart();
                										var el = Ext.get("summarypie");
                										el.show();
                									}
                						},{
                							tooltip: languageFormat.getLanguage(10003, 'Reset'),
                							iconCls: 'icon-reset2',
                							handler: function () {
                								var el = Ext.get("summarypie");
                								el.setVisibilityMode(Ext.Element.DISPLAY);
                								el.hide();
                								var el = Ext.get("indexChart");
                								el.show();
                								panel.getIndexChart(true);
                							}
                						}]
                					});
                				}
                				panel.callSummary(true);
                			}else{
                				var height = Ext.get("colInfo").getHeight();
                				var buttonsheight = Ext.get("buttonsPanel").getHeight();
                    			var nh = newHeight - height - buttonsheight;
                    			var chartHeight = newHeight - height - buttonsheight;
                    			Ext.get("colChart").setHeight(nh);
                    			Ext.get("colChart").setWidth(newWidth);
                    			panel.chartPanel.setHeight(chartHeight);
                    			panel.chartPanel.setWidth(newWidth);
                			}
                		}
                	}else{
                		panel.initialised = true;
                		panel.summaryPanel.removeAll();
        				panel._isLayout1 = false;
        				panel._isLayout3 = false;
        				if (panel.compRef.summaryPie) {
        					panel.compRef.summaryPie.destroy();
        				}
        				
                		if (newWidth > newHeight) {
                				panel.summaryPanel.add({html: panel._getLayoutHtml3().join('')});
                		} else {
                			panel.summaryPanel.add({html: panel._getLayoutHtml2().join('')});
                		}
                		if (N2N_CONFIG.features_MarketSummary_PieChart) {
                			var tabHeight = Ext.get("colChart").getHeight();
                			if (panel._isLayout1) {
                				tabHeight -= Ext.get("lbl_title").getHeight();
                			}

                			panel.compRef.buttons = Ext.create('Ext.container.Container', {
                				renderTo: 'buttonsPanel',
                				width: "100%",
                                                cls: 'normal-btn',
                				defaultType: 'button',
                				items: [{
                					tooltip: languageFormat.getLanguage(21022, 'Index Chart'),
                					iconCls: "icon-chart",
                					hidden: N2N_CONFIG.features_MarketSummary_PieChart ? false :true,
                							handler: function () {
                								var el = Ext.get("summarypie");
                								el.setVisibilityMode(Ext.Element.DISPLAY);
                								el.hide();
                								var el = Ext.get("indexChart");
                								el.show();
                								panel.getIndexChart(panel.needReloadChart);

                							}
                				}, {
                					tooltip: "Pie Chart",
                					iconCls: "icon-pie",
                					hidden: N2N_CONFIG.features_MarketSummary_PieChart ? false :true,
                							handler: function () {	
                								var el = Ext.get("indexChart");
                								el.setVisibilityMode(Ext.Element.DISPLAY);
                								el.hide();
                                                panel.refreshPieChart();
                								var el = Ext.get("summarypie");
                								el.show();
                							}
                				},{
                					tooltip: languageFormat.getLanguage(10003, 'Reset'),
                					iconCls: 'icon-reset2',
                					handler: function () {
                						var el = Ext.get("summarypie");
                						el.setVisibilityMode(Ext.Element.DISPLAY);
                						el.hide();
                						var el = Ext.get("indexChart");
                						el.show();
                						panel.getIndexChart(true);
                					}
                				}]
                			});
                		}
                		panel.callSummary(true);
                	}
                },
                destroy: function () {
                    panel.clearRefreshTimer();

                    if (!topPanelBar) {
                        conn.subscribeIndices(null, isMobile);
                        conn.subscribeMarket();
                    }
                }
            }
        };


        Ext.apply(this, defaultConfig);
        this.callParent(arguments);
    },
    getIdxCode: function () {
        var idxcode;
        var excode = this.exchangecode;
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
        if (!idxcode)
            idxcode = '';

        return idxcode;
    },
    refreshPieChart: function(newHeight, newWidth){
        var panel = this;
        if (panel.compRef.summaryPie){
            panel.compRef.summaryPie.destroy();
        };
               
        panel.createSummaryPieChart();
        panel.callSummary(true);
    },
    getIndexChart: function (isResize) {
        var panel = this;
        
        var key = this.getIdxCode();
        if (!key) {
            return;
        }
        var c = formatutils.procThemeColor();
        var colChart = Ext.get("indexChart");
        var colChartHeight = Ext.get("colChart"); //colChart.getHeight();
        var height = colChartHeight.getHeight();
        var width = colChartHeight.getWidth();

        if (!panel._isLayout1 && !panel._isLayout3) {
        	height -= 20;
        }
        
        //if (panel.compRef.tabPanel) {
            //height = panel.compRef.tabPanel.body.getHeight() - 1; // leave for some padding.
        //}
        if (!isStockChart) {
            if (key) {
                var url = 'indexchart.jsp';
                var width = colChart.getWidth(); // leaves for some padding

                url += ('?k=' + key + '&c=' + c + "&h=" + height + "&w=" + width);

                Ext.Ajax.request({
                    url: url,
                    method: 'GET',
                    success: function (response) {
                        var url = response.responseText;
                        url = Ext.util.Format.trim(url);
                        var el = Ext.fly('indexChart');
                        if (el) {
                            if (url != null && url.length > 0) {
                                el.update('<img src="' + url + '?' + Math.random() + '" style="width:' + width + 'px; height:' + height + 'px;"/>');
                            } else {
                                el.update('Chart Link not available');
                            }
                        }

                    }
                });
            }
        } else {
            //var stockcode = stockutil.getStockPart(key);
        	// Removes delayed exchange suffix. Determine whether exchange is delayed based on param 'View'
            var nonDelayCode = stockutil.removeStockDelay(key);
            var stkParts = stockutil.getStockParts(nonDelayCode);
            var stockcode = stkParts.code; //stockutil.getStockPart(key);
            var excode = stkParts.exch; //getStkExCode(key);

            if(panel.chartPanel == null || isResize){
            	sessionStorage.removeItem('mktSummChart');
                
                if (panel.chartPanel) { // make sure to destroy previous chart el or many charts will be created
                    panel.chartPanel.destroy();
                }
                
            	panel.chartPanel = Ext.create('Ext.ux.IFrame', {
            		renderTo: "indexChart",
            		height: height,
            		width: width
            	});
            	
            	panel.chartPanel.on('beforedestroy', function() {
            		panel.chartPanel = null;
            	});
            }
            
            var charturl = helper.addUrlParams(embeddedStockChartURL, "code=" + stockcode + '&Name=' + encodeURIComponent(stockutil.getStockName(this.exchangename)) + "&exchg=" + excode 
            				+ "&isstock=N&mode=d&color=" + c + '&lang=' + global_Language + '&View=' + (stockutil.isDelayStock(key) ? 'D' : 'R') 
                                        + '&type=mo&newOpen=' + (jsutil.boolToStr(panel.newOpen, '1', '0'))) + '&loginId=' + md5UniqueLoginId;
                                
            var prevChartKey = sessionStorage.getItem('mktSummChart');
            if(prevChartKey){
            	if(prevChartKey == excode || prevChartKey == 'MY'){
            		return;
            	}
            }
            
            sessionStorage.setItem('mktSummChart', excode);
            
            panel.chartPanel.refresh(charturl);
        	/*
            if (n2nLayoutManager.isTabLayout()) {
                if (panel.runFirstTimeOnly) {
                    panel.up().on("deactivate", function () {
                        panel.chartPanel.refresh("");
                    });
                    panel.runFirstTimeOnly = false;
                }
                panel.up().on("activate", function () {
                    panel.chartPanel.refresh(charturl);
                });
            }
        	*/

        }
        
        panel.needReloadChart = false;
    },
    callChart: function() {
        var panel = this;

        if (!isStockChart) { // auto refresh only image chart
            panel.clearRefreshTimer();
            panel.refreshTimer = setInterval(function() {
                if (panel.up().isVisible()) { // check its parent not itself
                    if (!panel.compRef.tabPanel || panel.compRef.tabPanel.getActiveTab().comp === 'index') {
                        panel.getIndexChart();
                    }
                }

            }, 300000); // refresh every 5 minutes
        }
    },
    clearRefreshTimer: function () {
        var panel = this;

        if (panel.refreshTimer) {
            clearInterval(panel.refreshTimer);
        }
    },
    callSummary: function (isResize) {
        if (this.exchangecode && this.exchangecode == 'MY') {
            this.exchangecode = 'KL';
        }

        var panel = this;
        try {
            if (panel.stkcode == null || panel.stkcode.length == 0) {
                var idx = feedLoginRet.ex;
                //console.log(idx.length);

                var idxcode;
                var totIdx = idx.length;
                for (var i = 0; i < totIdx; i++) {
                    var exchg = idx[i];
                    //console.log(exchg.ex);
                    //console.log(exchg.ix);
                    if (panel.exchangecode == exchg.ex) {
                        idxcode = exchg.ix;
                        break;
                    }
                }
                if (idxcode == null || idxcode.length == 0)
                    return;
                panel.stkcode = idxcode;
            }
            
            panel.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
            
           // panel.getIndexChart();
            //panel.callChart();

            conn.getIndices({
                rType: 'mo_indices',
                ex: panel.exchangecode,
                code: getIndiceKey(panel.exchangecode),
                success: function (obj2) {
                    if (obj2) {
                        panel._updateSummaryTitle(obj2);
                        panel.updateSummary(obj2);
                        panel.getIndexChart(isResize);
                        panel.callChart();
                    }
                }
            });

            conn.getMarketSummary({
                rType: 'mo_mkt',
                noMsg: true,
                ex: panel.exchangecode,
                success: function (obj) {
                    if (obj) {
                        panel.updateSummary(obj);
                    }
                }
            });

            if (!topPanelBar) {
                conn.subscribeIndices(null, isMobile);
                conn.subscribeMarket();
            }

        } catch (e) {
            debug(e);
        }
    },
    formatNumber: function (value) {
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
    formatNumberLot: function (value) {
        if (isNaN(value)) {
            return null;
        }

        value = value.toString(10);
        var oldvalue = value;
        var cursor;
        var identifier = '';
        if (value.length >= 8) {
            identifier = 'M';
            var decimal = 3;

            if (value.length >= 10) {
                decimal = 2;
            }

            cursor = value.length - 6;
            var str1 = '';
            var str2 = '';

            if (cursor == 0) {
                str1 = "0";
                str2 = value;
            } else {
                str1 = value.substring(0, cursor);
                str2 = value.substring(cursor, value.length);
            }

            var l = str2.length;
            str2 = parseInt(str2, 10);
            str2 = str2 / Math.pow(10, l - 2);
            str2 = Math.round(str2);

            value = str1 + '.' + str2;
            value = parseFloat(value).toFixed(decimal);
        } else if (value.length >= 7) {
            identifier = 'K';

            cursor = value.length - 3;
            str1 = value.substring(0, cursor);
            str2 = value.substring(cursor, value.length);

            l = str2.length;
            str2 = parseInt(str2, 10);
            str2 = str2 / Math.pow(10, l - 2);
            str2 = Math.round(str2);

            value = str1 + '.' + str2;
            value = parseFloat(value).toFixed(2);
        }

        var x = value.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        var ret = x1 + x2;
        if (oldvalue != null) {
            ret += identifier;
        }

        return ret;
    },
    formatDecimal: function (value) {
        var decimal = 3;

        if (exchangecode == "KL")
            decimal = 3;

        else if (exchangecode == "SA")
            decimal = 2;

        else if (exchangecode == "JK")
            decimal = 0;

        else {
            if ((value / 1000) >= 1) {
                decimal = 2;
            }
        }
        return parseFloat(value).toFixed(decimal);
    },
    printColor: function (value, color, bold, fontsize) {
        var el = new Array();
        el.push('<span');

        var style = color != null || bold != null || fontsize != null;

        if (style) {
            el.push(' style="');

            if (color != null) {
                el.push('color: ');
                el.push(color);
                el.push('; ');
            }

            if (bold != null) {
                el.push('font-weight: bold; ');
            }

            if (fontsize != null) {
                el.push('font-size: ');
                el.push(fontsize);
                el.push('pt');
            }

            el.push('"');
        }

        el.push('>');
        el.push(value);
        el.push('</span>');

        return el.join('');
    },
    printNumber: function (value, meta, record) {
        if (viewInLotMode) {
            value = this.formatNumberLot(value);
        } else {
            value = this.formatNumber(value);
        }
        var color = cFUnchanged;
        if (record.id == 'Up') {
            color = cFUp;
        } else if (record.id == 'Down') {
            color = cFDown;
        }
        return this.printColor(value, color, true, cGridFSize);
    },
    printPrice: function (value) {
        value = this.formatDecimal(value);
        var lacp = this.lacp;
        if (lacp == null || lacp == 0) {
            return this.printColor(value, cFUnchanged, true, cGridFSize);
        } else if (value > lacp) {
            return this.printColor(value, cFUp, true, cGridFSize);
        } else if (value < lacp) {
            return this.printColor(value, cFDown, true, cGridFSize);
        } else {
            return this.printColor(value, cFUnchanged, true, cGridFSize);
        }
    },
    setExchangeName: function (str) {
        var label = Ext.fly('lbl_ExchangeName');
        if (label != null) {
            label.update(str);
        }
    },
    setLast: function (last) {
        try {
            var label = Ext.get('lbl_ExchangeLast');
            if (label != null) {

                last = parseFloat(last).toFixed(3);
//                last == 0 ? label.update('-') : label.update(last);
                (isNaN(last)) ? label.update('-') : label.update(this.formatNumber(last));

                var img = Ext.get('lbl_summary_updown');

                var change = (this.last == 0 || this.lacp == 0) ? 0 : this.last - this.lacp;
                label.removeCls([N2NCSS.FontUnChange, N2NCSS.FontUp, N2NCSS.FontDown]);
                img.removeCls(['icon', 'icon-up', 'icon-down']);
                
                if (change > 0) {
                    label.addCls(N2NCSS.FontUp);
                    img.addCls('icon icon-up');
                } else if (change < 0) {
                    label.addCls(N2NCSS.FontDown);
                    img.addCls('icon icon-down');
                } else {
                    label.addCls(N2NCSS.FontUnChange);
                }
            }
        } catch (e) {
            debug(e);
        }
    },
    setChange: function (change, chgpc) {
        var label = Ext.fly('lbl_ExchangeChange');
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
            label.update(str);

            var el = label;
            var arrayCls = [N2NCSS.FontUnchange, N2NCSS.FontUp, N2NCSS.FontDown];
            el.removeCls(arrayCls);
            if (change > 0) {
                el.addCls(N2NCSS.FontUp);//v1.3.33.42
            } else if (change < 0) {
                el.addCls(N2NCSS.FontDown);//v1.3.33.42
            } else {
                el.addCls(N2NCSS.FontUnchange);//v1.3.33.42
            }

            this.change = change;
        }
    },
    updateSummary: function (obj) {//1.3.33.44 Synchronize with top panel update    
        var panel = this;
        
        if (!this.isVisible())
            return;
        if (obj.s == true) {
            var dataListObj = obj.d;

            for (var i = 0; i < dataListObj.length; i++) {
                var d = dataListObj[i];
                if (d[fieldSectorCode] == '10000' || d[fieldSectorCode] == '2000') {

                    if (d[fieldSectorCode] == '10000') {

                        var exchg = d[fieldSbExchgCode];

                        if (exchg != null) {
                            if (exchg != this.exchangecode) {
                                return;
                            }
                        }


                        var stkcode = d[fieldStkCode];
                        if (stkcode != null) {
                            if (stkcode.toLowerCase() != this.stkcode.toLowerCase()) {
                                return;
                            }
                        }


                        var up = d[fieldSbUp];
                        var down = d[fieldSbDown];
                        var unchg = d[fieldSbUnchanged];
                        var untrd = d[fieldSbUntraded];
                        var value = d[fieldSbTotalValue];
                        var volume = d[fieldSbTotalVol];
                        var tottrade = d[fieldSbTotalTrade];
                        //Market foreign value
                        if (N2N_CONFIG.displayMktFrVal) {
                            var frbuy = d[fieldSbFrBuy];
                            var frsell = d[fieldSbFrSell];
                        }
                        var updatePie = false;
//	            var high = d[fieldHigh];
//	            var low = d[fieldLow];
                        //     console.log(up+ " "+down+" "+ unchg + ' ' + untrd);
                        if (this.data == null)
                            this.data = new Array();
                        if (d[fieldStkName] != null) {
                            this.setExchangeName(d[fieldStkName]);
                            this.exchangename = d[fieldStkName];
                        }

                        if (!Ext.isEmpty(up)) {
                            var upEl = Ext.get('summary_Up');
                            upEl.update(this.formatNumber(up));
                            upEl.addCls(N2NCSS.FontUp);//v1.3.33.42
                            panel.pieData.up = up;
                            updatePie = true;
                        }

                        if (!Ext.isEmpty(down)) {
                            var downEl = Ext.get('summary_Down');
                            downEl.update(this.formatNumber(down));
                            downEl.addCls(N2NCSS.FontDown);//v1.3.33.42
                            panel.pieData.down = down;
                            updatePie = true;
                        }

                        if (!Ext.isEmpty(unchg)) {
                            var unchgEl = Ext.get('summary_Unchanged');
                            unchgEl.update(this.formatNumber(unchg));
                            panel.pieData.unchg = unchg;
                            updatePie = true;
                        }

                        if (!Ext.isEmpty(untrd)) {
                            var untrdEl = Ext.get('summary_Untraded');
                            untrdEl.update(this.formatNumber(untrd));
                            panel.pieData.untrd = untrd;
                            updatePie = true;
                        }

                        if (updatePie && panel.compRef.summaryPie != null) {
                            if (panel.compRef.summaryPie){
                                panel.compRef.summaryPie.destroy();
                            }
                            panel.createSummaryPieChart();
                        }

                        if (!Ext.isEmpty(value)) {
                            var valueEl = Ext.get('summary_TotalValue');
                            valueEl.update(this.formatNumber(value));
                        }

                        if (!Ext.isEmpty(volume)) {
                            var volumeEl = Ext.get('summary_TotalVolume');
                            volumeEl.update(this.formatNumber(volume));
                        }

                        if (!Ext.isEmpty(tottrade)) {
                            var tottradeEl = Ext.get('summary_TotalTrade');
                            tottradeEl.update(this.formatNumber(tottrade));
                        }
                        
                        //Cache foreign value
                        if (N2N_CONFIG.displayMktFrVal) {
                            if (frbuy) {
                                panel._frbuy = frbuy;
                            }
                            if (frsell) {
                                panel._frsell = frsell;
                            }

                            if (frbuy || frsell) {
                                var netVal = panel._frbuy - panel._frsell;
                                var mktfrvalEl = Ext.get('summary_MktFrVal');
                                mktfrvalEl.update(this.formatNumber(netVal));
                            }
                        }
                    }
                    if (d[fieldSectorCode] == '2000' && d[fieldStkCode] == this.stkcode) {
                        var last = d[fieldLast];
                        var lacp = d[fieldLacp];

                        this.last = last == null ? this.last : last;
                        this.lacp = lacp == null ? this.lacp : lacp;
                        var change;
                        var chgpc;
                        if (last != null && lacp != null) {
                            change = (last == 0 || lacp == 0) ? 0 : last - lacp;
                            chgpc = (last == 0 || lacp == 0) ? 0 : (change / lacp) * 100;
                        } else if (this.last != null && this.lacp != null) {
                            change = (this.last == 0 || this.lacp == 0) ? 0 : this.last - this.lacp;
                            chgpc = (this.last == 0 || this.lacp == 0) ? 0 : (change / this.lacp) * 100;
                        } else {
                            change = 0;
                            chgpc = 0;
                        }
                        if (!isNaN(this.last) && this.last != '')
                            this.setLast(this.last);
                        if (!isNaN(change) && change != '')
                            this.setChange(change, chgpc);
                    }
                }
            }
        }
        
        this.setLoading(false);
    },
    _updateSummaryTitle: function (obj) {
            var dt = obj.d[0];
            if (dt) {
                this.exchangename = dt[fieldStkName];
            }
    },
    changeExchg: function (val) {
        if (val == 'MY')
            val = 'KL';
        this.exchangecode = val;
        var idx = feedLoginRet.ex;
        var idxcode;
        var totIdx = idx.length;
        for (var i = 0; i < totIdx; i++) {
            var exchg = idx[i];
            if (this.exchangecode == exchg.ex) {
                idxcode = exchg.ix;
                break;
            }
        }
        if (idxcode == null || idxcode.length == 0)
            return;
        this.stkcode = idxcode;
        this.exchangecode = val;
    },
    cleanUp2: function () {
        Ext.get('summary_TotalVolume').update('');
        Ext.get('summary_TotalTrade').update('');
        if (N2N_CONFIG.displayMktFrVal) {
            Ext.get('summary_MktFrVal').update('');
        }
        Ext.get('summary_TotalValue').update('');
        Ext.get('summary_Untraded').update('');
        Ext.get('summary_Unchanged').update('');
        Ext.get('summary_Up').update('');
        Ext.get('summary_Down').update('');
        Ext.get('lbl_ExchangeChange').update('');
        Ext.get('lbl_ExchangeLast').update('');
        this.cleanChart();

        this.exchangecode = '';
        this.stkcode = '';
    },
    cleanUp: function () {
        var panel = this.summaryPanel;
        var label = panel.get('lbl_ExchangeName');
        if (label != null) {
            label.setText('');
        }
        label = panel.get('lbl_ExchangeLast');
        if (label != null) {
            label.setText('');
            label.setPosition(0, 10);
        }
        label = panel.get('lbl_ExchangeChange');
        if (label != null) {
            label.setText('');
            label.setPosition(0, 40);
        }
        var img = panel.get('summary_upimg');
        if (img != null) {
            img.hide();
        }
        img = panel.get('summary_downimg');
        if (img != null) {
            img.hide();
        }

        this.exchangename = '';
        this.last = '';
        this.lacp = '';
        this.change = '';
        this.chgpc = '';

    },
    getFieldList: function () {
        var fieldlist = new Array();
        fieldlist.push(fieldStkName);
        fieldlist.push(fieldLacp);
        fieldlist.push(fieldLast);
        fieldlist.push(fieldHigh);
        fieldlist.push(fieldLow);
        return fieldlist;
    },
    _getPieData: function () {
        var panel = this;
        if (panel.debug) {
            console.log('MarketOverview > _getPieData');
        }
        var pieData = [];

        if (panel.pieData.up != null) {
            pieData.push({
                name: languageFormat.getLanguage(11031, 'Up'),
                data: parseInt(panel.pieData.up)
            });
        }
        if (panel.pieData.down != null) {
            pieData.push({
                name: languageFormat.getLanguage(11032, 'Down'),
                data: parseInt(panel.pieData.down)
            });
        }
        if (panel.pieData.unchg != null) {
            pieData.push({
                name: languageFormat.getLanguage(11036, 'Unchanged'),
                data: parseInt(panel.pieData.unchg)
            });
        }
        if (panel.pieData.unchg != null) {
            pieData.push({
                name: languageFormat.getLanguage(11037, 'Untraded'),
                data: parseInt(panel.pieData.untrd)
            });
        }

        if (panel.debug) {
            console.log('pieData -> ', pieData);
        }

        return pieData;
    },
    createSummaryPieChart: function () {
        var panel = this;
        var pieData = panel._getPieData();

        if (panel.pieStore == null) {
            panel.pieStore = Ext.create('Ext.data.JsonStore', {
                fields: ['name', 'data'],
                data: pieData
            });
        } else {
            panel.pieStore.loadData(pieData);
        }

        if (!panel.compRef.summaryPie) {
            panel.compRef.innerSummaryPie = Ext.create('Ext.chart.Chart', {
                store: panel.pieStore,
                theme: 'Base:gradients',
                animate: true,
//                legend: {
//                    position: 'right'
//                },
                shadow: false,
                series: [{
                        type: 'pie',
                        angleField: 'data',
                        // showInLegend: true,
                        getLegendColor: function(index) {
                            if (this.yField) {
                                // get legend name
                                var legendName = this.yField[index];
                                return getPieColor(legendName);
                            }
                        },
                        renderer: function(sprite, record, attr) {
                            attr.fill = getPieColor(record.get('name'));

                            return attr;
                        },
                        tips: {
                            trackMouse: true,
                            width: isMobile ? 190 : 170,
                            height: 28,
                            renderer: function (storeItem, item) {
                                var total = 0;
                                panel.pieStore.each(function (rec) {
                                    total += rec.get('data');
                                });
                                this.setTitle(storeItem.get('name') + ': ' + storeItem.get('data') + " ( " + Ext.util.Format.number((storeItem.get('data') / total * 100), '0.00') + '%)');
                            }
                        },
                        highlight: {
                            segment: {
                                margin: 20
                            }
                        },
                        label: {
                            field: 'name',
                            display: 'middle',
                            renderer: function (value, label, storeItem) {
                                if (label.attr) {
                                    if (value == 'Up' || value == 'Unchanged') {
                                        label.attr.fill = '#000';
                                    } else {
                                        label.attr.fill = '#fff';
                                    }
                                }
                            
                                var total = 0;
                                panel.pieStore.each(function (rec) {
                                    total += rec.get('data');
                                });
                                var percent = 0;
                                if (total != 0) {
                                    percent = storeItem.get('data') / total * 100;
                                }
                                return Ext.util.Format.number(percent, '0.00') + '%';
                            }
                        }
                    }]
            });

            var colChartHeight = Ext.get("colChart").getHeight();
            if (!panel._isLayout1 && !panel._isLayout3) {
                colChartHeight -= 20;
            }
            
            panel.compRef.summaryPie = Ext.create('Ext.container.Container', {
                title: languageFormat.getLanguage(20159, 'Market Summary Pie'),
                layout: "fit",
                renderTo: "summarypie",
                width: "100%",
                height: colChartHeight, //"100%",
                items: [panel.compRef.innerSummaryPie],
                listeners: {
                    beforedestroy: function () {
                        panel.compRef.summaryPie = null;
                    }
                }
            });
        }
    },
    _getLayoutHtml1: function () {
        var htmls = new Array();

        this._isLayout1 = true;
        htmls.push('<table  style="width:100%;height:100%;"  cellspacing="0" cellpadding="0">');
        htmls.push('<tr>');
        htmls.push('<td  id="colChart" align="center" valign="top">');
        htmls.push('<div style="height: 20px; width: 100%;clear: both;" id="lbl_title"></div>');
        if (N2N_CONFIG.features_MarketSummary_PieChart) {
            htmls.push('<div id="tabpanel" style="width:100%;height:100%;"></div>');
        } else {
            htmls.push('<div id="indexChart" style="width:100%;"></div>');
        }
        htmls.push('</td>');
        htmls.push('<td style="width:150px;" id="colInfo">');

        htmls.push('<table style="width:100%;height:100%;" cellspacing="7" cellpadding="0">');
        htmls.push('<tr>');
        htmls.push('<td colspan="2" style="text-align:left;font-weight:bold;font-size: 12pt;"><span id="lbl_summary_updown"></span>&nbsp;&nbsp;<div id="lbl_ExchangeLast" style="float:right;"></div><div id="lbl_ExchangeChange" style="float:right;clear:both;"></div></td>');

        htmls.push('</tr>');
        htmls.push('<tr>');
        htmls.push('<td colspan="2" ><span class="icon-small icon-vol" title="Total Volume"></span>&nbsp;&nbsp;<span id="summary_TotalVolume" style="float:right"></span></td>');
        htmls.push('</tr>');
        htmls.push('<tr>');
        htmls.push('<td colspan="2"><span class="icon-small icon-valueue" title="Total Value"></span>&nbsp;&nbsp;<span id="summary_TotalValue" style="float:right"></span></td>');
        htmls.push('</tr>');
        htmls.push('<tr>');
        htmls.push('<td colspan="2" ><span class="icon-small icon-trade" title="Total Trades"></span>&nbsp;&nbsp;<span id="summary_TotalTrade" style="float:right" class="N2N_stringStyle"></span></td>');
        htmls.push('</tr>');
        htmls.push('<tr>');
        htmls.push('<td><span class="icon-small icon-up" title="Up"></span>&nbsp;&nbsp;<span id="summary_Up"></span></td>');
        htmls.push('<td><span class="icon-small icon-down" title="Down"></span>&nbsp;&nbsp;<span id="summary_Down"></span></td>');
        htmls.push('</tr>');
        htmls.push('<tr>');
        htmls.push('<td><span class="icon-small icon-unchange" title="Unchanged"></span>&nbsp;&nbsp;<span id="summary_Unchanged"></span></td>');
        htmls.push('<td><span class="icon-small icon-untrade" title="Untraded"></span>&nbsp;&nbsp;<span id="summary_Untraded"></span></span><span style="margin-left: 5px;" id="summary_pie"></td>');
        htmls.push('</tr>');
        if (N2N_CONFIG.displayMktFrVal) {
            htmls.push('<tr>');
            htmls.push('<td colspan="2" ><span class="icon-small icon-mktfrval" title="Market Foreign Value"></span>&nbsp;&nbsp;<span id="summary_MktFrVal" style="float:right" class="N2N_stringStyle"></span></td>');
            htmls.push('</tr>');
        }
        htmls.push('</table>');
        htmls.push('</td>');
        htmls.push('</tr>');
        htmls.push('</table>');

        return htmls;
    },
    _getLayoutHtml2: function () {
        var htmls = new Array();

        this._isLayout1 = false;
        htmls.push('<table  style="width:100%;height:100%;"  cellspacing="0" cellpadding="0">');
        htmls.push('<tr>');
        htmls.push('<td style="width:100%;height:150px;" id="colInfo">');
        htmls.push('<table style="width:100%;height:100%;" cellspacing="2" cellpadding="0">');
        htmls.push('<tr>');
        htmls.push('<td valign="top;"><div style="float:left;font-size:1.2em;" id="lbl_title"></div><div style="float:left;clear:both;"><span id="lbl_summary_updown"></span></div></td>');
        htmls.push('<td style="text-align:left;font-weight:bold;font-size: 12pt;"><div id="lbl_ExchangeLast" style="float:right;"></div><div id="lbl_ExchangeChange" style="float:right;clear:both;"></div></td>');

        htmls.push('</tr>');
        htmls.push('<tr>');
        htmls.push('<td colspan="2" ><span class="icon-small icon-vol" title="Total Volume"></span>&nbsp;&nbsp;Total Volume:<span id="summary_TotalVolume" style="float: right"></span></td>');
        htmls.push('</tr>');
        htmls.push('<tr>');
        htmls.push('<td colspan="2"><span class="icon-small icon-value" title="Total Value"></span>&nbsp;&nbsp;Total Value:<span id="summary_TotalValue" style="float: right"></span></td>');
        htmls.push('</tr>');
        htmls.push('<tr>');
        htmls.push('<td colspan="2" ><span class="icon-small icon-trade" title="Total Trades"></span>&nbsp;&nbsp;Total Trades:<span id="summary_TotalTrade" style="float: right" class="N2N_stringStyle"></span></td>');
        htmls.push('</tr>');
        htmls.push('<tr>');
        htmls.push('<td><span class="icon-small icon-up" title="Up"></span>&nbsp;&nbsp;<span id="summary_Up"></span></td>');
        htmls.push('<td><span class="icon-small icon-down" title="Down"></span>&nbsp;&nbsp;<span id="summary_Down"></span></td>');
        htmls.push('</tr>');
        htmls.push('<tr>');
        htmls.push('<td><span class="icon-small icon-unchange" title="Unchanged"></span>&nbsp;&nbsp;<span id="summary_Unchanged"></span></td>');
        htmls.push('<td><span class="icon-small icon-untrade" title="Untraded"></span>&nbsp;&nbsp;<span id="summary_Untraded"></span><span style="margin-left: 3px;" id="summary_pie"></span></td>');
        htmls.push('</tr>');
        if (N2N_CONFIG.displayMktFrVal) {
            htmls.push('<tr>');
            htmls.push('<td colspan="2" ><span class="icon-small icon-mktfrval" title="Market Foreign Value"></span>&nbsp;&nbsp;Total Trades:<span id="summary_MktFrVal" style="float: right" class="N2N_stringStyle"></span></td>');
            htmls.push('</tr>');
        }
        htmls.push('</table>');
        htmls.push('</td>');
        htmls.push('</tr>');
        htmls.push('<tr>');
        htmls.push('<div id="buttonsPanel" style="width:100%;"></div>');
        htmls.push('<td  id="colChart" style="width:100%;height:100%;">');
        htmls.push('<div id="indexChart" style="width:100%;"></div>');
        htmls.push('<div id="summarypie" style="width:100%;"></div>');
        htmls.push('</td>');
        htmls.push('</tr>');
        htmls.push('</table>');

        return htmls;
    },
    _getLayoutHtml3: function () {
        this._isLayout1 = false;
        this._isLayout3 = true;
        var htmls = new Array();
        var styleinfo = 'style="clear:both;margin-bottom:3px;"';
        htmls.push('<table  style="width:100%;height:100%;"  cellspacing="0" cellpadding="0">');
        htmls.push('<tr>');
        htmls.push('<td  id="colChart" align="center" valign="top" style="padding:0px;margin:0px;">');
        htmls.push('<div id="indexChart" style="width:100%;"></div>');
        htmls.push('<div id="summarypie" style="width:100%;"></div>');
        htmls.push('</td>');
        htmls.push('<td style="width:150px;font-size:12px;vertical-align:top;padding-left:10px;padding-right:5px;" id="colInfo">');
        htmls.push('<div id="buttonsPanel" style="width:100%;"></div>');

        htmls.push('<div  style="text-align:left;font-weight:bold;font-size: 11pt;clear:both;"><span id="lbl_summary_updown"></span><div id="lbl_ExchangeLast" style="float:right;"></div><div id="lbl_ExchangeChange" style="float:right;clear:both;padding-bottom:10px;"></div></div>');

        htmls.push('<div ' + styleinfo + '><span class="icon-small icon-vol" title="Total Volume" style="margin-right:20px;display:block;float:left;"></span><span id="summary_TotalVolume" style="padding-bottom:5px;display:block;" ></span></div>');
        htmls.push('<div ' + styleinfo + '><span class="icon-small icon-value" title="Total Value" style="margin-right:20px;display:block;float:left;"></span><span id="summary_TotalValue" style="padding-bottom:5px;display:block;"  ></span></div>');
        htmls.push('<div ' + styleinfo + '><span class="icon-small icon-trade" title="Total Trades" style="margin-right:20px;display:block;float:left;"></span><span id="summary_TotalTrade" class="N2N_stringStyle" style="padding-bottom:5px;display:block;" ></span></div>');
        htmls.push('<div ' + styleinfo + '><span class="icon-small icon-up" title="Up" style="margin-right:20px;display:block;float:left;"></span><span id="summary_Up" style="padding-bottom:5px;display:block;" ></span></div>');
        htmls.push('<div ' + styleinfo + '><span class="icon-small icon-down" title="Down" style="margin-right:20px;display:block;float:left;"></span><span id="summary_Down" style="padding-bottom:5px;display:block;" ></span></div>');
        htmls.push('<div ' + styleinfo + '><span class="icon-small icon-unchange" title="Unchanged" style="margin-right:20px;display:block;float:left;"></span><span id="summary_Unchanged" style="padding-bottom:5px;display:block;" ></span></div>');
        htmls.push('<div ' + styleinfo + 'margin-bottom:0px;><span class="icon-small icon-untrade" title="Untraded" style="margin-right:20px;display:block;float:left;"></span><span id="summary_Untraded" style="padding-bottom:5px;display:block;" ></span></div>');
        if (N2N_CONFIG.displayMktFrVal) {
            htmls.push('<div ' + styleinfo + '><span class="icon-small icon-mktfrval" title="Market Foreign Value" style="margin-right:20px;display:block;float:left;"></span><span id="summary_MktFrVal" class="N2N_stringStyle" style="padding-bottom:5px;display:block;" ></span></div>');
        }
        htmls.push('</td>');
        htmls.push('</tr>');
        htmls.push('</table>');

        return htmls;

    },
    forceReloadChart: function() {
        var me = this;
    
        var chartEl = Ext.get('indexChart');
        if (helper.inView(chartEl)) {
            me.getIndexChart(true);
        } else {
            me.needReloadChart = true;
        }
        
    },
    setChartStatus: function() {
        var me = this;

        if (isStockChart && me.chartPanel && me.newOpen) {
            me.newOpen = false;
            var newUrl = updateQueryStringParameter(me.chartPanel.iframeURL, 'newOpen', '0');
            me.chartPanel.refresh(newUrl);
        }
    },
    cleanChart: function () {
        var me = this;

        if (isStockChart) {
            if (me.chartPanel) {
                me.chartPanel.refresh('');
            }
        } else {
            var inChart = Ext.fly('indexChart');

            if (inChart) {
                inChart.update('');
            }
        }
    }
});
