Ext.define('TCPlus.view.orderbook.OrderDetail', {
    extend: 'Ext.container.Container',
    alias: "widget.orderdetail",
    exchangecode: '',
    tktno: '',
    ordno: '',
    stkcode: '',
    last: '',
    lacp: '',
    change: '',
    chgpc: '',
    ordDetailsPanel: null,
    loadMask: null,
    accno: '',
    action: '',
    ordsrc: '',
    ordtype: '',
    validity: '',
    orddate: '',
    ordtime: '',
    ordsts: '',
    ordprc: '',
    ordqty: '',
    mtqty: '',
    mtprc: '',
    mtval: '',
    unmtqty: '',
    cnclqty: '',
    remarks: '',
    expdate: '',
    searchdate: '',
    accBranchCode: '',
    slcomp: "od",
//    tConf: {
//        tab: 'tab1'
//    },
    winConfig: {
        resizable: true,
        width: 530,
        height: 220
    },
    initComponent: function() {
        var panel = this;

        var panelid = panel.id;
        if (panelid == null || panelid.length == 0) {
            panelid = '';
        }
        var htmlbuf = new Array();
        if (isMobile) {
            htmlbuf.push('<div style="width:100%">');
            htmlbuf.push('<table class="ordDetailPane" cellspacing="0" cellpadding="0.5" style="width: 100%" style="font-size:8pt;">');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td width="10%" class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20177, 'Stock') + '</td>');
            htmlbuf.push('<td width="30%" id="' + panelid + '_OrdDet_StkCode"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td width="10%" class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20182, 'Order No.') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_OrdNo"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20833, 'Account No.') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_AccNo"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20183, 'Order Price') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_OrdPrc"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20832, 'Action') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_Action"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20184, 'Order Qty') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_OrdQty"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20178, 'Order Source') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_OrdSrc"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20185, 'Matched Qty') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_MtQty"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20837, 'Order Type') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_OrdType"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20186, 'Matched Price') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_MtPrc"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20838, 'Validity') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_Validity"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20187, 'Matched Value') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_MtVal"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20179, 'Order Time') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_OrdTime"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20188, 'Unmatched Qty') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_UnMtQty"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20172, 'Order Status') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_OrdSts"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20189, 'Canceled Qty') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_CnclQty"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20180, 'Disclosed Qty') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_Disclosed"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20843, 'Min Qty') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_MinQty"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20848, 'Short Sell') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_ShortSell"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '"> &nbsp; </td>');
            htmlbuf.push('<td id=""></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20181, 'Remarks') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_Remarks" colspan="3"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('</table>');
            htmlbuf.push('</div>');
        } else {
            htmlbuf.push('<div style="width:100%">');
            htmlbuf.push('<table class="ordDetailPane" cellspacing="0" cellpadding="0.5" style="width: 100%" style="font-size:8pt;">');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td width="10%" class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20177, 'Stock') + '</td>');
            htmlbuf.push('<td width="30%" id="' + panelid + '_OrdDet_StkCode"></td>');
            htmlbuf.push('<td width="10%" class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20182, 'Order No.') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_OrdNo"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20833, 'Account No.') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_AccNo"></td>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20183, 'Order Price') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_OrdPrc"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20832, 'Action') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_Action"></td>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20184, 'Order Qty') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_OrdQty"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20178, 'Order Source') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_OrdSrc"></td>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20185, 'Matched Qty') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_MtQty"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20837, 'Order Type') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_OrdType"></td>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20186, 'Matched Price') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_MtPrc"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20838, 'Validity') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_Validity"></td>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20187, 'Matched Value') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_MtVal"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20179, 'Order Time') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_OrdTime"></td>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20188, 'Unmatched Qty') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_UnMtQty"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20172, 'Order Status') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_OrdSts"></td>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20189, 'Canceled Qty') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_CnclQty"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20180, 'Disclosed Qty') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_Disclosed"></td>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20843, 'Min Qty') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_MinQty"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20848, 'Short Sell') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_ShortSell"></td>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '"> &nbsp; </td>');
            htmlbuf.push('<td id=""></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('<tr>');
            htmlbuf.push('<td class="ordDetailLabel ' + N2NCSS.stockInfoLabel_color + '">' + languageFormat.getLanguage(20181, 'Remarks') + '</td>');
            htmlbuf.push('<td id="' + panelid + '_OrdDet_Remarks" colspan="3"></td>');
            htmlbuf.push('</tr>');
            htmlbuf.push('</table>');
            htmlbuf.push('</div>');
        }

        var defaultConfig = {
            width: '100%',
            border: false,
            autoScroll: true,
            style: 'padding: 5px;',
            html: htmlbuf.join(''),
            cls: 'fix_themebg',
            listeners: {
                afterrender: function(thisComp) {
                    panel.loadMask = thisComp.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
                }
            }
        };


        Ext.apply(this, defaultConfig);
        this.callParent(arguments);
    },
    callOrdDetail: function() {
        var panel = this;
        try {
            panel.loadMask.show();
            panel.reset();
            var urlbuf = new Array();
            urlbuf.push(addPath + 'tcplus/atp/status?');
            urlbuf.push('on=' + panel.ordno);
            urlbuf.push('&tn=' + panel.tktno);
            urlbuf.push('&r=1');
            urlbuf.push('&bc=' + panel.accBranchCode);


            var url = urlbuf.join('');

            Ext.Ajax.request({
                url: url,
                method: 'POST',
                success: function(response) {
                    var text = response.responseText;
                    var obj = null;
                    try {
                        obj = Ext.decode(text);
                        panel.updateOrdDetail(obj);
                    } catch (e) {
                        debug(e);
                    }

                    panel.loadMask.hide();
                },
                failure: function(response) {
                    debug(response);
                    panel.loadMask.hide();
                }
            });
        } catch (e) {
            debug(e);
        }
    },
    callOrdHistoryDetail: function() {
        var panel = this;
        try {
            panel.loadMask.show();
            panel.reset();

            var urlbuf = new Array();
            urlbuf.push(addPath + 'tcplus/atp/history?');
            urlbuf.push('on=' + panel.ordno);
            urlbuf.push('&tn=' + panel.tktno);
            urlbuf.push('&fr=');
            urlbuf.push(panel.searchdate);
            urlbuf.push('&to=');
            urlbuf.push(panel.searchdate);
            urlbuf.push('&ac=');
            urlbuf.push(panel.accno);
            urlbuf.push('&bc=' + panel.accBranchCode);

            var url = urlbuf.join('');

            Ext.Ajax.request({
                url: url,
                method: 'POST',
                success: function(response) {
                    var text = response.responseText;
                    var obj = null;
                    try {
                        obj = Ext.decode(text);
                        panel.updateOrdDetail(obj);
                    } catch (e) {
                        debug(e);
                    }
                    panel.loadMask.hide();

                },
                failure: function(response) {
                    debug(response);
                    panel.loadMask.hide();
                }
            });
        } catch (e) {
            debug(e);
        }
    },
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
    formatNumberLot: function(value) {
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
    formatCurrency: function(value) {
        value += '';
        var x = value.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        var ret = x1 + x2;
        return ret;
    },
    formatDecimal: function(value, decimal) {
        if (isNaN(value) || value == '') {
            value = 0;
        }
        if (decimal == null)
            decimal = 3;

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
    printColor: function(value, color, bold, fontsize) {
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
    printNumber: function(value, meta, record) {
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
    printPrice: function(value) {
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
    setStkName: function(str) {
        if (!Ext.isEmpty(str)) {
            Ext.fly(this.id + '_OrdDet_StkName').update(str);
        }
    },
    setLast: function(last) {
        try {
            if (Ext.isEmpty(last))
                return;
            var label = Ext.fly(this.id + '_OrdDet_Last');
            if (label != null) {
                last = parseFloat(last).toFixed(3);
                last == 0 ? label.update('-') : label.update(last);

                var width = label.getWidth();
                var x = this.getInnerWidth() - (width + 10);

                var img;
                var el = label;

                var change = (this.last == 0 || this.lacp == 0) ? 0 : this.last - this.lacp;
                if (change > 0) {
                    img = Ext.getDom(this.id + '_stkinfoimg');
                    img.src = 'images/arrow_up.png';
                    el.setStyle('color', cFUp);
                } else if (change < 0) {
                    el.setStyle('color', cFDown);
                    img = Ext.getDom(this.id + '_stkinfoimg');
                    img.src = 'images/arrow_down.png';
                } else {
                    el.setStyle('color', cFUnchanged);
                    img = Ext.getDom(this.id + '_stkinfoimg');
                    img.src = '';
                }
            }
        } catch (e) {
            debug(e);
        }
    },
    setChange: function(change, chgpc) {
        var label = Ext.fly(this.id + '_OrdDet_Change');
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
            if (change > 0) {
                el.setStyle('color', cFUp);
            } else if (change < 0) {
                el.setStyle('color', cFDown);
            } else {
                el.setStyle('color', cFUnchanged);
            }
            this.change = change;
        }
    },
    updateOrdDetail: function(obj) {
        var panel = this;

        try {
            var success = obj.s;
            if (success == true) {
                var data = obj.os;
                if (data != null) {
                    var totData = data.length;
                    for (var i = 0; i < totData; i++) {
                        var orddetail = data[i];
                        if (orddetail['tn'] != panel.tktno || orddetail['on'] != panel.ordno)
                            continue;
                        var stkcode = orddetail['sc'];
                        var stkname = orddetail['sy'];
                        var accno = orddetail['an'];
                        var ordno = orddetail['on'];
                        var ordsrc = panel.getOrdSrcDesc(orddetail['os']);
                        var ordtype = orddetail['ot'];
                        var validity = orddetail['vd'];
                        var ordtime = orddetail['tm'];
                        var orddate = orddetail['dt'];
                        var act = orddetail['act'];
                        var st = orddetail['st'];
                        st = trim(st) == null ? '' : trim(st);
                        var sts = orddetail['sts'] + ' (' + st + ')';
                        var ordprc = orddetail['op'];
                        var ordqty = orddetail['oq'];
                        var mtqty = orddetail['mq'];
                        var mtprc = orddetail['mp'];
                        var mtval = orddetail['mv'];
                        var umtqty = orddetail['uq'];
                        var remarks = orddetail['rmk'];
                        var expdate = orddetail['ed'];
                        var cnclqty = orddetail['cq'];
                        var disclosedQty = orddetail['dq'];
                        var minQty = orddetail['minq'];
                        var shortSell = orddetail['ordercond'];

                        this.expdate = expdate;
                        this.orddate = orddate;

                        this.setStkCode(stkcode, stkname);
                        this.setOrdNo(ordno);
                        this.setAccNo(accno);
                        this.setAction(act);
                        this.setOrdSrc(ordsrc);
                        this.setOrdType(ordtype);
                        this.setValidity(validity);
                        this.setOrdTime(ordtime);
                        this.setOrdSts(sts);
                        this.setOrdPrc(ordprc);
                        this.setOrdQty(ordqty);
                        this.setMtQty(mtqty);
                        this.setMtPrc(mtprc);
                        this.setMtVal(mtval);
                        this.setUnMtQty(umtqty);
                        this.setCnclQty(cnclqty);
                        this.setRemarks(remarks);
                        this.setDisclosed(disclosedQty);
                        this.setMinQty(minQty);
                        this.setShortSell(shortSell);

                        break;
                    }
                }
            }
        } catch (e) {
            debug(e);
        }

    },
    reset: function() {
        this.expdate = '';
        this.orddate = '';

        this.setStkCode('', '');
        this.setOrdNo('');
        this.setAccNo('');
        this.setAction('');
        this.setOrdSrc('');
        this.setOrdType('');
        this.setValidity('');
        this.setOrdTime('');
        this.setOrdSts('');
        this.setOrdPrc('');
        this.setOrdQty('');
        this.setMtQty('');
        this.setMtPrc('');
        this.setMtVal('');
        this.setUnMtQty('');
        this.setCnclQty('');
        this.setRemarks('');
        this.setDisclosed('');
        this.setMinQty('');
        this.setShortSell('');
    },
    setStkCode: function(val, val2) {
        if (Ext.isEmpty(val)) {
            val = '-';
        } else {
            var idx = val.lastIndexOf('.');
            if (idx != -1) {
                val = val.substring(0, idx);
            }
        }

        if (Ext.isEmpty(val2)) {
            val2 = '-';
        } else {
            var idx = val2.lastIndexOf('.');
            if (idx != -1) {
                val2 = val2.substring(0, idx);
            }
        }

        var stk = '-';
        if (val != '-' && val2 != '-') {
            stk = val + ' / ' + val2;
        }

        Ext.fly(this.id + '_OrdDet_StkCode').update(stk);
    },
    setOrdNo: function(val) {
        if (Ext.isEmpty(val)) {
            val = '-';
        }
        Ext.fly(this.id + '_OrdDet_OrdNo').update(val);
    },
    setAccNo: function(val) {
        if (Ext.isEmpty(val)) {
            val = '-';
        }
        Ext.fly(this.id + '_OrdDet_AccNo').update(val);
    },
    setAction: function(val) {
        var txtColor;

        if (Ext.isEmpty(val)) {
            val = '-';
        } else if (val == 'Buy')
            txtColor = N2NCSS.FontUp;
        else if (val == 'Sell')
            txtColor = N2NCSS.FontDown;

        var actionEl = Ext.get(this.id + '_OrdDet_Action');
        if (actionEl) {
            actionEl.removeCls([N2NCSS.FontUp, N2NCSS.FontDown]);
            if (txtColor) {
                // addCls not work
                actionEl.addCls(txtColor);
            }
            actionEl.update(val);
        }

    },
    setOrdSrc: function(val) {
        if (Ext.isEmpty(val)) {
            val = '-';
        }
        Ext.fly(this.id + '_OrdDet_OrdSrc').update(val);
    },
    setOrdType: function(val) {
        if (Ext.isEmpty(val)) {
            val = '-';
        }
        Ext.fly(this.id + '_OrdDet_OrdType').update(val);
    },
    setValidity: function(val) {
        if (Ext.isEmpty(val)) {
            val = '-';
        } else {
            if (val == 'GTD') {
                var dtFormat;
                var expDate = this.expdate;

                if (expDate.length > 8) {
                    dtFormat = 'YmdHis.u';
                } else if (expDate.length == 8) {
                    dtFormat = 'Ymd';
                }

                if (dtFormat) {
                    var dt = Ext.Date.parse(expDate, dtFormat);
                    expDate = Ext.Date.format(dt, "Y-m-d H:i:s");
                }

                val += ' ' + expDate;
            }
        }

        Ext.fly(this.id + '_OrdDet_Validity').update(val);
    },
    setOrdTime: function(val) {

        try {
            var dateFormat = this.orddate;
            var timeFormat = val;

            // set date format
            var dateObj = null;
            if (dateFormat != null) {
                if ((dateFormat).indexOf('-') != -1) {
                    var tempDate = (dateFormat).split('-');
                    dateObj = new Date(tempDate[0], (tempDate[1] - 1), tempDate[2]);
                }
            }
            if (dateObj != null) {
                dateFormat = Ext.Date.format(dateObj, global_DateFormat);
            }

            // set time format
            var timeObj = null;
            if (timeFormat != null) {
                if (timeFormat.indexOf(':') != -1) {
                    var tempTime = (timeFormat).split(':');
                    timeObj = new Date();
                    timeObj.setHours(tempTime[0]);
                    timeObj.setMinutes(tempTime[1]);
                    timeObj.setSeconds(tempTime[2]);
                }
            }
            if (timeObj != null) {
                timeFormat = Ext.Date.format(timeObj, global_TimeFormat);
            }

            var tempValue = '';
            if (dateFormat != '') {
                tempValue += dateFormat + ' ';
            } else {
                tempValue += '- ';
            }
            if (tempValue == '- ') {
                tempValue = '';
            }
            if (timeFormat != '') {
                tempValue += timeFormat;
            } else {
                tempValue += '-';
            }

            Ext.fly(this.id + '_OrdDet_OrdTime').update(tempValue);

        } catch (e) {
            console.log('[ordDetails][setOrdTime] Exception ---> ' + e);
        }

    },
    setOrdSts: function(val) {
        if (Ext.isEmpty(val)) {
            val = '-';
        }
        Ext.fly(this.id + '_OrdDet_OrdSts').update(val);
    },
    setOrdPrc: function(val) {
        if (Ext.isEmpty(val)) {
            val = '-';
        }
        val = this.formatCurrency(val);
        Ext.fly(this.id + '_OrdDet_OrdPrc').update(val);
    },
    setOrdQty: function(val) {
        if (Ext.isEmpty(val)) {
            val = '-';
        }
        val = this.formatCurrency(val);
        Ext.fly(this.id + '_OrdDet_OrdQty').update(val);
    },
    setMtQty: function(val) {
        if (Ext.isEmpty(val)) {
            val = '-';
        }
        val = this.formatCurrency(val);
        Ext.fly(this.id + '_OrdDet_MtQty').update(val);
    },
    setMtPrc: function(val) {
        if (Ext.isEmpty(val)) {
            val = '-';
        }
        Ext.fly(this.id + '_OrdDet_MtPrc').update(val);
    },
    setMtVal: function(val) {
        if (Ext.isEmpty(val)) {
            val = '-';
        }
        val = this.formatCurrency(val);
        Ext.fly(this.id + '_OrdDet_MtVal').update(val);
    },
    setUnMtQty: function(val) {
        if (Ext.isEmpty(val)) {
            val = '-';
        }
        val = this.formatCurrency(val);
        Ext.fly(this.id + '_OrdDet_UnMtQty').update(val);
    },
    setCnclQty: function(val) {
        if (Ext.isEmpty(val)) {
            val = '-';
        }
        val = this.formatCurrency(val);
        Ext.fly(this.id + '_OrdDet_CnclQty').update(val);
    },
    setRemarks: function(val) {
        if (Ext.isEmpty(val)) {
            val = '-';
        }
        Ext.fly(this.id + '_OrdDet_Remarks').update(val);
    },
    setDisclosed: function(val) {
        if (Ext.isEmpty(val)) {
            val = '-';
        }
        val = this.formatCurrency(val);
        Ext.fly(this.id + '_OrdDet_Disclosed').update(val);
    },
    setMinQty: function(val) {
        if (Ext.isEmpty(val)) {
            val = '-';
        }
        val = this.formatCurrency(val);
        Ext.fly(this.id + '_OrdDet_MinQty').update(val);
    },
    setShortSell: function(val) {
        if (Ext.isEmpty(val)) {
            val = '-';

        } else {
            if (val == '8192') {
                val = 'Y';

            } else {
                val = '-';
            }
        }

        Ext.fly(this.id + '_OrdDet_ShortSell').update(val);
    },
    getOrdSrcDesc: function(ordsrc) {
        if (ordsrc == 'I') {
            ordsrc = languageFormat.getLanguage(20200, 'Internet retail');
        } else if (ordsrc == 'D') {
            ordsrc = languageFormat.getLanguage(20201, 'Dealer');
        } else if (ordsrc == 'W') {
            ordsrc = languageFormat.getLanguage(20202, 'Wap/Mobile');
        } else if (ordsrc == 'S') {
            ordsrc = languageFormat.getLanguage(20203, 'SMS');
        } else if (ordsrc == 'P') {
            ordsrc = languageFormat.getLanguage(20204, 'Phone');
        } else if (ordsource == 'F') {
            ordsrc = languageFormat.getLanguage(20205, 'Fix');
        } else {
            ordsrc = "-";
        }
        return ordsrc;
    }
});