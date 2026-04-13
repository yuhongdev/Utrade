var QcFeed = function() {
    // static

    return function(url, sockConfig) {
        // --------------------------------------------------------------------------------------------------------------
        var that = this;

        var _debug = false;
        var _sock = null;
        var _url = url;
        var _sockConfig = sockConfig === undefined ? {} : sockConfig;

        var _feedLis = [];
        var _reqLis = {};
        var _callbackId = 0;
        var _autoReconnect = sockConfig.autoReconnect === undefined ? true : sockConfig.autoReconnect;

        var _queryData = {};

        that.keepAliveTime = 15000;// every 15 second
        //that.timeoutVar = null;
        //that.startPing = false;
        //that.onPing = false;

        var _state = 0; // 0 = new, 1 = connected, 2 = closed
        var watchStk = []; // current watched stk from listener

        // --------------------------------------------------------------------------------------------------------------
        // private function

        function updatePingPong() {
            if (!that.timeoutVar) {
                var timeoutfunc = function() {
                    that.request({
                        action: 'ping'
                    });
                };
                that.timeoutVar = window.setInterval(timeoutfunc, that.keepAliveTime);
            }
        }
        function cancelPingPong() {
            if (that.timeoutVar) {
                window.clearInterval(that.timeoutVar);
                that.timeoutVar = null;
            }
        }

        function checkAndConnect(delayCall, args) {
            var me = this;
            if (that.isConnected()) {
                return true;
            } else {
                if (_autoReconnect) {
                    that.connect(function() {
                        delayCall.apply(me, args);
                    });
                }
                return false;
            }
        }

        /**
         * If watch all, it will cause it retrieve all event
         */
        function processFeedEvent(feed) {
            for (var i = 0; i < _feedLis.length; i++) {
                var lis = _feedLis[i];
                try {
                    if (feed.listenId && feed.listenId !== lis.listenId) {
                        continue;
                    }
                    if (lis.callback)
                        lis.callback(that, lis, feed);
                } catch (e) {
                    that.err(e);
                }
            }
        }

        /**
         * Join all query item to form full response message
         */
        function processQuery(feed) {
            var qid = 'q' + feed.qid;
            if (!_queryData[qid]) {
                if (feed.success !== undefined) {
                    if (feed.hasNext) {
                        _queryData[qid] = feed;
                        _queryData[qid].data = [];
                    } else {
                        processRequest(feed);
                    }

                } else {
                    that.err('Invalid data packet ' + feed);
                }
            } else {
                if (feed.end) {
                    if (feed.delay) {
                        _queryData[qid].delay = feed.delay;
                    }
                    processRequest(_queryData[qid]);
                    delete _queryData[qid];
                } else {
                    _queryData[qid].data.push(feed.data);
                }
            }
        }

        function processRequest(json) {
            // per request
            var lis = _reqLis[json.eventId];
            var err;
            try {
                if (lis && lis.callback) {
                    lis.callback(that, lis, json);
                } else {
                    //that.log(JSON.stringify(json));
                }
            } catch (e) {
                err = e;
            }
            if (!json.hasNext) {
                delete _reqLis[json.eventId];
            }

            if (err) {
                if (console && sockConfig.debug) {
                    console.log('exception -> ', err.stack);
                }

                throw err;
            }
        }

        // --------------------------------------------------------------------------------------------------------------
        // public API (for override)
        that.onclose = function(qc) {

        };
        that.onopen = function(qc) {

        };
        // logging, can override
        that.log = function(msg) {
            if (console && sockConfig.debug) {
                console.log(msg);
            }
        };
        that.err = function(msg) {
            if (console && sockConfig.debug) {
                console.error(msg);
            }
        };
        that.debug = function(msg) {
            if (console && _debug && sockConfig.debug) {
                if (console.debug) {
                    console.debug(msg);
                } else {
                    console.info(msg);
                }
            }
        };

        that.isConnected = function() {
            return _sock != null && _sock.readyState === SockJS.OPEN;
        };

        // query data
        that.query = function(exch, market, sectorList, sector, config) {
            //var deferred = Q.defer();
            var cfg = {
                action: 'query',
                coll: '05',
                start: 0,
                limit: 30,
                mode: 'compact',
                filter: []
            };

            // copy configurations
            if (config) {
                for (var p in config) {
                    cfg[p] = config[p];
                }
            }
            // fix if it is not an array after overrided
            cfg.filter = [].concat(cfg.filter);

            // additional configurations
            if (exch)
                cfg.exch = exch;
            if (market) {
                var marketInt = parseInt(market);
                if (marketInt >= 1000 && marketInt < 2000) { // e.g MY uses market as sector instead
                    cfg.filter.push({"field": "36", comparison: "eq", value: market});
                    // sector list and sector should not be used anymore in this case
                    sectorList = null;
                    sector = null;
                } else {
                    cfg.filter.push({"field": "151", comparison: "eq", value: market});
                }
            }
            if (sectorList) {
                var sectorListInt = parseInt(sectorList);
                if (sectorListInt <= 2200 || sectorListInt > 2299) {
                    if (cfg.callback) {
                        cfg.callback(that, cfg, {success: false, msg: 'Invalid sector list ' + sectorList});
                    }
                    //deferred.reject('Invalid sector list ' + sectorList);
                    return;
                }
                cfg.filter.push({"field": "35", comparison: "biton", value: 1 << (sectorListInt % 2201)});
            }
            if (sector)
                cfg.filter.push({"field": "36", comparison: "eq", value: sector});

            // query and callback
            var callback = cfg.callback;
            cfg.callback = function(a, b, c) {

                // uncompact message
                if (cfg.mode === 'compact') {
                    c = that.msgUncompact(c);
                }
                if (callback) {
                    callback(a, b, c);
                }
                /*
                 if(c && c.success){
                 deferred.resolve(c);
                 } else {
                 deferred.reject(c.message);
                 }
                 */
            };
            that.request(cfg);

            // return results
        };

        that.msgUncompact = function(json) {
            if (json && json.data && json.data.c) {
                var list = [];
                for (var i = 0; i < json.data.v.length; i++) {
                    var val = {};
                    var data = json.data.v[i];
                    for (var j = 0; j < json.data.c.length; j++) {
                        val[json.data.c[j]] = data[j];
                    }
                    list.push(val);
                }
                json.data = list;
            }
            return json;
        };

        // --------------------------------------------------------------------------------------------------------------
        // connect
        that.connect = function(callback) {
            if (_sock) {
                that.log('Error connection already established');

                if (_sock.readyState !== SockJS.OPEN) {
                    var func = that.onopen;
                    that.onopen = function() {
                        if (func)
                            func();
                        if (callback)
                            callback(that);
                    };
                }

                return;
            } else {
                that.log('Creating connection to ' + _url);
            }

            _sock = new SockJS(_url, null, _sockConfig);

            _sock.onopen = function() {
                that.log('connected');

                // this function only required for non-websocket mode
                updatePingPong();
                if (_sockConfig.dot !== undefined || _sockConfig.dot) {
                    that.request({action: 'dot'});
                }

                if (_sockConfig.initReq) {
                    _sockConfig.initReq = [].concat(_sockConfig.initReq); // convert it to array if it is not
                    for (var i = 0; i < _sockConfig.initReq.length; i++) {
                        that.request(_sockConfig.initReq[i]);
                    }
                }
                if (callback) {
                    callback(that);
                }
                if (that.onopen) {
                    that.onopen(that);
                }
            };

            _sock.onmessage = function(e) {
                if (e.data === '.') {
                    return;
                }
                var json = JSON.parse(e.data);
                if (json) {
                    if (_debug) {
                        that.debug(json);
                    }

                    switch (json.type) {
                        case 'i': // system info msg
                            that.log(json);
                            break;

                        case 'e': // process request
                            processRequest(json);
                            break;

                        case 'a':
                        case 'u': // obsolated
                            processFeedEvent(json);
                            break;

                        case 'q':
                            processQuery(json);
                            break;

                        default:
                            if (json.status !== undefined && !json.status) {
                                that.err(json);
                            } else {
                                that.log(json);
                            }
                    }
                } else {
                    that.err('Invalid response');
                    that.err(e.data);
                }
            };

            _sock.onclose = function() {
                that.log('disconnected');
                cancelPingPong();
                that.onPing = false;
                _sock = null;
                _reqLis = []; // cleanup
                if (that.onclose) {
                    that.onclose(that);
                }
            };
        };

        // close connection
        that.close = function() {
            _sock.close();
        };

        // request, example format = {column: [1,2,3,4,5], filter: [{conditions: 'in', value: ['N2N.KL'], field: '38'}]}
        that.request = function(cfg) {
            if (!checkAndConnect(that.request, [cfg])) {
                return;
            }
            try {
                if (_sock && _sock.readyState == SockJS.OPEN) {
                    if (cfg.action === 'ping') {
                        _sock.send('.');
                    } else {
                        cfg.eventId = '' + (++_callbackId);
                        if (cfg.action === 'session') {
                            // adds protocol
                            var isWebSocket = _sock.protocol == 'websocket' ? '1' : '0';
                            cfg.username = cfg.user + isWebSocket;
                            delete cfg.user;
                        }

                        var msg = JSON.stringify(cfg);
                        that.log("Send Message " + msg);
                        _reqLis[cfg.eventId] = cfg; // register after success._reqLis.

                        if (cfg.action === 'register') {
                            if (cfg.listener) {
                                that.addFeedListener({
                                    listenId: cfg.listenId,
                                    callback: cfg.listener
                                });
                            }
                        } else if (cfg.action === 'unregister') {
                            that.removeFeedListener(cfg.listenId);
                        }

                        _sock.send(msg);
                    }
                } else {
                    that.err('Socket is close');
                }
            } catch (e) {
                that.err(e);
            }
            return cfg;
        };

        // add any number of listener, lis must contain id and callback
        that.addFeedListener = function(lis) {

            if (!lis.listenId) {
                lis.listenId = 'DEFAULT';
            }

            // replace if already exists
            for (var i = 0; i < _feedLis.length; i++) {
                if (_feedLis[i].listenId === lis.listenId) {
                    _feedLis[i] = lis;
                    return;
                }
            }

            // add new if not exists
            _feedLis.push(lis);
        };

        // remove the first only, more than 1 will need to call again
        that.removeFeedListener = function(listenId) {
            if (!listenId) {
                listenId = 'DEFAULT';
            }

            // remove first feed lis with same listen id
            for (var i = 0; i < _feedLis.length; i++) {
                if (_feedLis[i].listenId === listenId) {
                    return _feedLis.splice(i, 1);
                }
            }
        };
    };
}();