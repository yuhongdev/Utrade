Ext.define('Ext.ux.IFrame', {
    extend: 'Ext.container.Container',
    debug: false,
    iframeURL: null,
    iframeScroll: true,
    initComponent: function() {
        var config = {
            style: 'padding:0px;margin:0px;font-size:12pt;overflow:auto;-webkit-overflow-scrolling:touch;',
            border: false,
            listeners: {
                afterrender: function(thisComp) {
                    var compEl = thisComp.getEl();
                    var layerEl = compEl.appendChild({tag: 'div', cls: 'iframelayer'});
                    layerEl.on('mousemove', function() {
                        n2nLayoutManager.unshimIframe();
                    });
                }
            }
        };

        Ext.apply(this, config);
        this.callParent();
    },
    refresh: function(url, disableScroll) {
        var me = this;
        if (disableScroll) {
            me.iframeScroll = false;
        }

        me.iframeURL = url;
        var el = me.getEl();
        if (!me.iframeDom) {
            if (me.debug) {
                console.log('creating iframe url -> ', url);
            }

            me.removeAll();
            me.add({
                xtype: 'component',
                autoEl: {
                    tag: 'iframe',
                    src: url,
                    scrolling: me.iframeScroll ? 'auto' : 'no',
                    frameborder: '0',
                    width: '100%',
                    height: '100%'
                },
                listeners: {
                    afterrender: function(thisComp) {
                        me.iframeDom = thisComp.getEl().dom;
                    }
                }
            });

        } else {
            if (me.debug) {
                console.log('iframe updating url ->', url);
            }

            me.iframeDom.src = url; // update only url
        }

    },
    updateKey: function(newKey, stkName) {
        var me = this;

        if (me.savingComp) { // applicable when this iframe is a saving component
            if (newKey) {
                me.oldKey = me.key;
                me.key = newKey;
            }

            me.stkname = stkName;

            n2nLayoutManager.updateKey(me);
        }
    }
});
