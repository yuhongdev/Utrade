Ext.define('Ext.ux.ticker.Ticker', {
    extend: 'Ext.Component',
    baseCls: 'x-ticker',
    autoEl: {
        tag: 'div',
        cls: 'x-ticker-wrap',
        children: {
            tag: 'div',
            cls: 'x-ticker-body'
        }
    },
    body: null,
    reconfigureTask: null,
    init: true,
    constructor: function(config) {
        Ext.applyIf(config, {
            direction: 'up',
            speed: 1,
            pauseOnHover: true
        });

        this.setSpeed(config.speed);

        Ext.applyIf(config, {
            refreshInterval: parseInt(11 - config.speed) * 2
        });
        config.unitIncrement = 1;

        Ext.ux.ticker.Ticker.superclass.constructor.call(this, config);

        this.addEvents('itemclick');
    },
    afterRender: function() {
        this.body = this.el.first('.x-ticker-body');
        this.body.addCls(this.direction);

        this.taskCfg = {
            interval: this.refreshInterval,
            scope: this
        };

        var posInfo, body = this.body;
        switch (this.direction) {
            case "left":
            case "right":
                posInfo = {left: body.getWidth()};
                this.taskCfg.run = this.scroll.horz;
                break;
            case "up":
            case "down":
                posInfo = {top: body.getHeight()};
                this.taskCfg.run = this.scroll.vert;
                break;
        }
        posInfo.position = 'relative';

        body.setPositioning(posInfo);
        Ext.ux.ticker.Ticker.superclass.afterRender.call(this);

        if (this.pauseOnHover) {
            this.el.on('mouseover', this.onMouseOver, this);
            this.el.on('mouseout', this.onMouseOut, this);
            this.el.on('click', this.onMouseClick, this);
        }

        this.task = Ext.apply({}, this.taskCfg);
        Ext.TaskManager.start(this.task);
    },
    add: function(o) {
        var dom = Ext.DomHelper.createDom(o);
        this.clear();
        this.body.appendChild(Ext.fly(dom).addCls('x-ticker-item').addCls(this.direction));
    },
    clear: function() {
        this.body.update('');
    },
    start: function() {
        var me = this;
        me.init = true;
    },
    stop: function() {
        var me = this;

        me.clear();
    },
    restart: function(restartDelay) {
        var me = this;

        me.stop();
        var delay = restartDelay != undefined ? restartDelay : 0;
        Ext.Function.defer(function() {
            me.start();
        }, delay);
    },
    onDestroy: function() {
        if (this.task) {
            Ext.TaskManager.stop(this.task);
        }

        Ext.ux.ticker.Ticker.superclass.onDestroy.call(this);
    },
    onMouseOver: function() {
        if (this.task) {
            Ext.TaskManager.stop(this.task);
            delete this.task;
        }
    },
    onMouseClick: function(e, t, o) {
        var item = Ext.fly(t).up('.x-ticker-item');
        if (item) {
            this.fireEvent('itemclick', item, e, t, o);
        }
    },
    onMouseOut: function() {
        if (!this.task) {
            this.task = Ext.apply({}, this.taskCfg);
            Ext.TaskManager.start(this.task);
        }
    },
    scroll: {
        horz: function() {
            if (!this.isHidden()) {
                var runTickerFunc = false;
                var body = this.body;
                var bodyLeft = body.getLeft(true);
                if (this.direction == 'left') {
                    if (this.init) {
                        bodyLeft = -body.getWidth();
                        this.init = false;
                    } else {
                        var bodyWidth = body.getWidth();
                        if (bodyLeft <= -bodyWidth) {
                            bodyLeft = this.el.getWidth(true);

                            runTickerFunc = true;
                        } else {
                            bodyLeft -= this.unitIncrement;
                        }
                    }
                } else {
                    var elWidth = this.el.getWidth(true);
                    if (bodyLeft >= elWidth) {
                        bodyLeft = -body.getWidth(true);
                        runTickerFunc = true;
                    } else {
                        bodyLeft += this.unitIncrement;
                    }
                }
                body.setLeft(bodyLeft);
                if (runTickerFunc && this.tickerFunc != null) {
                    this.tickerFunc();
                }
            }
        },
        vert: function() {
            if (!this.isHidden()) {
                var runTickerFunc = false;
                var body = this.body;
                var bodyTop = body.getTop(true);
                if (this.direction == 'up') {
                    var bodyHeight = body.getHeight(true);
                    if (bodyTop <= -bodyHeight) {
                        bodyTop = this.el.getHeight(true);
                        runTickerFunc = true;
                    } else {
                        bodyTop -= this.unitIncrement;
                    }
                } else {
                    var elHeight = this.el.getHeight(true);
                    if (bodyTop >= elHeight) {
                        bodyTop = -body.getHeight(true);
                        runTickerFunc = true;
                    } else {
                        bodyTop += this.unitIncrement;
                    }
                }
                body.setTop(bodyTop);
                if (runTickerFunc && this.tickerFunc != null) {
                    this.tickerFunc();
                }
            }
        }
    },
    setSpeed: function(speed) {
        speed = parseInt(speed);
        if (speed < 1)
            this.speed = 1;
        else if (speed > 10)
            this.speed = 10;

        this.speed = speed;
    },
    reconfigure: function(config) {
        var me = this;

        if (config.hasOwnProperty('show')) {
            if (config.show == true) {
                me.show();
            } else {
                me.hide();
            }
        }
        if (config.hasOwnProperty('speed')) {
            if (me.task) {
                me.setSpeed(config.speed);
                me.runConfigureTask();
            }
        }
    },
    runConfigureTask: function() {
        var me = this;

        if (me.reconfigureTask != null) {
            clearTimeout(me.reconfigureTask);
            me.reconfigureTask = null;
        }
        me.reconfigureTask = setTimeout(function() {
            Ext.TaskManager.stop(me.task);
            delete me.task;
            me.taskCfg.interval = parseInt(11 - me.speed) * 2;
            me.task = Ext.apply({}, me.taskCfg);
            Ext.TaskManager.start(me.task);

            me.reconfigureTask = null;
        }, 1000);
    }
});