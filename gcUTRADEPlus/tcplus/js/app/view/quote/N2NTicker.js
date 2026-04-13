Ext.define('TCPlus.view.quote.N2NTicker', {
    extend: 'Ext.ux.ticker.Ticker',
    alias: 'widget.n2nticker',
    constructor: function(config) {
        var me = this;

        Ext.applyIf(config, {
            tickerFunc: function() {
                me.updateTicker();
            }
        });
        TCPlus.view.quote.N2NTicker.superclass.constructor.call(this, config);
    },
    updateTicker: function() {
        debugutil.debug('N2NTicker > updateTicker');
        var me = this;
        var updateStr = new Array();

        var tsi = tsItems.split('~'); // from main.jsp
        var qsTicker = jsutil.toBoolean(tsi[2]);

        // get stocks from quote screen
        if (quoteScreen != null && qsTicker) {
            var stkCodes = quoteScreen.stkcodes;
            for (var i = 0; i < stkCodes.length; i++) {
                var stkData = Storage.returnRecord(stkCodes[i]);
                if (stkData) {
                    var tContent = this._formatTickerContent(stkData);
                    updateStr.push(tContent);
                }
            }
        }

        me.add({
            children: updateStr
        });
    },
    getUpdateFromStorage: function() {
        var storageUpdate = new Array();
        var codes = Storage.getStore();

        for (var i in codes) {
            var codeItems = codes[i].items;
            if (codeItems != null) {
                var content = this._formatTickerContent(codeItems);
                storageUpdate.push(content);
            }
        }

        return storageUpdate;
    },
    _formatTickerContent: function(stkData) {
        var stkFName = stockutil.getStockName(stkData[fieldStkFName]);
        var stkName = '';

        switch (exchangecode) { // from app.js
            case 'N':
            case 'A':
            case 'O':
                stkName = stockutil.getStockName(stkData[fieldStkCode]);
                break;
            default:
                stkName = stockutil.getStockName(stkData[fieldStkName]);
        }
        var stkLacp = stkData[fieldLacp];
        var stkLast = stkData[fieldLast];
        var stkChg = stkData[fieldChange];
        var stkChgPer = stkData[fieldChangePer];
        var chgCls = '';
        if (stkChgPer < 0) {
            chgCls = 'down';
        } else if (stkChgPer > 0) {
            chgCls = 'up';
        }
        var lacpTitle = languageFormat.getLanguage(33300, 'last: [PARAM0] lacp: [PARAM1]', stkLast + '|' + stkLacp);
        var chgTitle = languageFormat.getLanguage(33301, 'change') + ': ' + stkChg;

        var content = {
            tag: 'span',
            cls: 'ticker-content ' + chgCls,
            children: [
                {
                    tag: 'label',
                    cls: 'ticker-content-stkname',
                    html: stkName,
                    title: stkFName
                },
                {
                    tag: 'label',
                    cls: 'ticker-content-stklacp',
                    html: stkLast,
                    title: lacpTitle
                },
                {
                    tag: 'label',
                    cls: 'ticker-content-stkchangeper',
                    html: stkChgPer + (stkChgPer == '-' ? '' : '%'),
                    title: chgTitle
                }
            ]
        };

        return content;
    }
});