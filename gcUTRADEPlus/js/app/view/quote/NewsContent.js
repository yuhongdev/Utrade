Ext.define('TCPlus.view.quote.NewsContent', {
    extend: 'Ext.container.Container',
    alias: 'widget.newscontent',
    lang: '',
    slcomp: "nc",
    initMax: true,
    initComponent: function() {
        var panel = this;
        panel.winConfig = getNewsWinConfig();

        panel.frameCt = Ext.create('Ext.ux.IFrame');

        var btnPopUp = Ext.create('Ext.button.Button', {
            text: 'View in new window',
            icon: icoBtnNews,
            handler: function() {
                msgutil.openURL({
                    url: panel.url
                });
            }
        });

        var config = {
            layout: 'fit',
            border: false,
            tbar: {
                hidden: pagingMode ? false : true,
                items: [btnPopUp]
            },
            items: panel.frameCt,
            listeners: {
                afterrender: function() {
                    panel.setCode();
                }
            }
        };

        Ext.apply(this, config);
        this.callParent();
    },
    setCode: function(stkCode) {
        var me = this;

        me.url = 'stkNews.jsp?k=' + (stkCode || me.key) + '&l=' + me.lang + '&s=' + new Date().getTime();
        me.frameCt.refresh(me.url);
    }
});
