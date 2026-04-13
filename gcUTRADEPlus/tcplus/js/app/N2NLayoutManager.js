Ext.define('Ext.app.N2NLayoutManager', {
    debug: false,
    extend: 'Ext.container.Viewport',
    alias: 'widget.n2nlayoutmanager',
    requires: [
        // for portal layout
        'Ext.app.portal.PortalPanel',
        'Ext.app.portal.PortalColumn'
    ],
    layout: {
        type: 'border'
    },
    // custom properties //
    appHeader: null, // App header: main menu and top bar
    appMain: null, // App main: body for portlets or window
    comp: [],
    notComp: [],
    compRef: {}, // component references,
    _firstTime: true,
    style: 'background-color: transparent;',
    _minHeight: 250,
    _activeItem: null,
    _tTabList: ['mainTab', 'mainTab2', 'tab2', 'tab3', 'tab4'],
    _wTabList: ['mt', 'mt2', 'mt3', 'mt4', 'mt5', 'mt6', 'mt7', 'mt8', 'mt9', 'mt10', 'mt11', 'mt12', 'mt13', 'p'],
    _mScrList: ['am'],
    _layoutDDGroup: 'layoutDD',
    _succeedingActiveOrder: {
        'base': ['mt', 'mt3', 'mt2', 'mt4', 'mt5', 'mt6', 'mt7', 'mt8', 'mt9', 'mt10', 'mt11', 'mt12', 'mt13'],
        'mt': ['mt3', 'mt2', 'mt4', 'mt5', 'mt6', 'mt7', 'mt8', 'mt9', 'mt10', 'mt11', 'mt12', 'mt13'],
        'mt3': ['mt', 'mt2', 'mt4', 'mt5', 'mt6', 'mt7', 'mt8', 'mt9', 'mt10', 'mt11', 'mt12', 'mt13'],
        'mt2': ['mt4', 'mt5', 'mt6', 'mt7', 'mt8', 'mt9', 'mt10', 'mt11', 'mt12', 'mt13', 'mt', 'mt3'],
        'mt4': ['mt2', 'mt5', 'mt6', 'mt7', 'mt8', 'mt9', 'mt10', 'mt11', 'mt12', 'mt13', 'mt', 'mt3'],
        'mt5': ['mt6', 'mt7', 'mt8', 'mt9', 'mt10', 'mt11', 'mt12', 'mt13', 'mt', 'mt3', 'mt2', 'mt4'],
        'mt6': ['mt5', 'mt7', 'mt8', 'mt9', 'mt10', 'mt11', 'mt12', 'mt13', 'mt', 'mt3', 'mt2', 'mt4'],
        'mt7': ['mt8', 'mt9', 'mt10', 'mt11', 'mt12', 'mt13', 'mt', 'mt3', 'mt2', 'mt4', 'mt5', 'mt6'],
        'mt8': ['mt7', 'mt9', 'mt10', 'mt11', 'mt12', 'mt13', 'mt', 'mt3', 'mt2', 'mt4', 'mt5', 'mt6'],
        'mt9': ['mt7', 'mt8', 'mt10', 'mt11', 'mt12', 'mt13', 'mt', 'mt3', 'mt2', 'mt4', 'mt5', 'mt6'],
        'mt10': ['mt11', 'mt12', 'mt13', 'mt', 'mt3', 'mt2', 'mt4', 'mt5', 'mt6', 'mt7', 'mt8', 'mt9'],
        'mt11': ['mt10', 'mt12', 'mt13', 'mt', 'mt3', 'mt2', 'mt4', 'mt5', 'mt6', 'mt7', 'mt8', 'mt9'],
        'mt12': ['mt10', 'mt11', 'mt13', 'mt', 'mt3', 'mt2', 'mt4', 'mt5', 'mt6', 'mt7', 'mt8', 'mt9'],
        'mt13': ['mt10', 'mt11', 'mt12', 'mt', 'mt3', 'mt2', 'mt4', 'mt5', 'mt6', 'mt7', 'mt8', 'mt9']
    },
    initComponent: function() {
        var me = this;
        
        if (N2N_CONFIG.confMsgBoxCenter) {
            // keep x, y position on mouse click
            document.onclick = function(e) {
                me.clickPos = {
                    x: e.clientX,
                    y: e.clientY
                };
            };
        }
        
        var activeLayout = null;
        if (me.isWindowLayout()) {
            activeLayout = layoutProfileManager.getActiveLayout();
        }
        me.lyConf = new LayoutConfig(activeLayout);

        var appItems = new Array();
        var appHeaderItems = new Array();

        if (!isMobile && showTickerSetting == 'TRUE') {
            var tsi = tsItems.split('~'); // from main.jsp
            n2nTicker = Ext.create('widget.n2nticker', {
                layout: 'fit',
                height: 23,
                speed: tsi[1],
                direction: 'left',
                pauseOnHover: true,
                hidden: !jsutil.toBoolean(tsi[0])
            });
            appHeaderItems.push(n2nTicker);
        }

        // Header logo
        if (isMobile && N2N_CONFIG.headerLogo != '') {
            me.compRef.headerCt = Ext.create('Ext.container.Container', {
                height: 26,
                html: '<div style="width:100%;height:100%;background: url(\'' + N2N_CONFIG.headerLogo + '\') no-repeat center center;"></div>',
                cls: 'head_gradient'
            });
            appHeaderItems.push(me.compRef.headerCt);
        }

        var defaultMenu = true;
        var menuHandler = null;
        if (isMobile) {
            switch (N2N_CONFIG.menuType) {
                case MENU_TYPE.METRO:
                    me.compRef.fullMenu = true;
                    defaultMenu = false;
                    var metro = metroMenu();
                    var metro1 = [];
                    var mediumScalePort = 0;
                    var mediumScaleLand = 0;
                    var mediumScale = 0;
                    var metroPortrait = [];
                    var metroLandscape = [];
                    for (var i = 0; i < metro.length; i++) {
                        var colspan = 0;
                        if (i == metro.length - 1) {
                            colspan = 1;//(4 * rows) - (i + mediumScale);
                        }
                        if (metro[i].mtScale == "medium") {
                            if (colspan == 0) {
                                colspan = 2;
                            }
                            metro1.push({
                                mtScale: "medium",
                                items: [metro[i]],
                                colspan: colspan
                            });
                        } else {
                            metro1.push({
                                items: [metro[i]],
                                colspan: colspan
                            });
                        }
                    }
                    menuHandler = function(thisBtn, state) {
                        if (me.compRef.fullMenu === true) { // expected to create menu once
                            me.compRef.fullMenu = me.addItem({
                                type: 'container',
                                overflowY: 'auto',
                                border: false,
                                items: {
                                    type: 'containter',
                                    border: false,
                                    baseCls: '',
                                    cls: 'menu_ct',
                                    items: metro1,
                                    width: "100%",
                                    height: "100%",
                                    style: 'padding:0px; overflow:hidden',
                                    defaults: {
                                        border: false,
                                        width: "100%",
                                        height: "100%",
                                        bodyStyle: {
                                            padding: 0,
                                            margin: 0
                                        },
                                        style: {
                                            padding: 0,
                                            margin: 0

                                        }
                                    },
                                    layout: {
                                        type: "table",
                                        columns: 4,
                                        tableAttrs: {
                                            style: {
                                                height: "100%",
                                                borderCollapse: "collapse",
                                                cellSpacing: 0,
                                                cellPadding: 0,
                                                width: "100%"
                                            }
                                        },
                                        tdAttrs: {
                                            style: {
                                                border: "1px solid #313030"
                                            }
                                        }
                                    }
                                },
                                listeners: {
                                    resize: function(thisComp, w, h) {
                                        var items = [];
                                        var fullMenu = thisComp.getComponent(0);
                                        if (w < h) {
                                            fullMenu.layout.columns = 4;
                                            items = metroPortrait;
                                            mediumScale = mediumScalePort;
                                        } else {
                                            fullMenu.layout.columns = 5;
                                            items = metroLandscape;
                                            mediumScale = mediumScaleLand;
                                        }
                                        var rows = Math.ceil((metro1.length + mediumScale) / fullMenu.layout.columns);
                                        var height = h / rows;
                                        fullMenu.width = w;
                                        if (height > 70) {
                                            fullMenu.height = h;
                                        } else {
                                            fullMenu.height = "100%";
                                        }
                                        height = height > 70 ? height - 1.1 : 70;
                                        fullMenu.defaults.height = height;
                                        fullMenu.removeAll();
                                        fullMenu.add(items);
                                    },
                                    afterrender: function(thisComp) {
                                        var fullMenu = thisComp.getComponent(0);
                                        var sizeMode = ["portrait", "landscape"];
                                        for (var j = 0; j < sizeMode.length; j++) {
                                            mediumScale = 0;
                                            var cols = 4;
                                            if (sizeMode[j] == "landscape") {
                                                cols = 5;
                                            }
                                            for (var i = 0; i < metro1.length; i++) {
                                                var colspan = 0;
                                                if (i == metro1.length - 1) {
                                                    colspan = cols;
                                                }
                                                if (metro1[i].mtScale == "medium") {
                                                    if (colspan == 0) {
                                                        colspan = 2;
                                                    }
                                                    metro1[i].colspan = colspan;
                                                    if ((i + mediumScale + 1) % cols != 0) {
                                                        mediumScale++;
                                                    }
                                                } else {
                                                    metro1[i].colspan = colspan;
                                                }
                                                if (sizeMode[j] == "portrait") {
                                                    metroPortrait.push(metro1[i]);
                                                    mediumScalePort = mediumScale;
                                                } else {
                                                    metroLandscape.push(metro1[i]);
                                                    mediumScaleLand = mediumScale;
                                                }
                                            }

                                        }
                                    }
                                },
                                mConfig: {
                                    notComp: true,
                                    border: false,
                                    style: 'border-width:0;padding:0;',
                                    listeners: {
                                        expand: function(thisComp) {
                                            // fix height when expanding full menu
                                            var appMainHeight = me.getAppMain().getHeight();
                                            if (thisComp.getHeight() != appMainHeight) {
                                                thisComp.setHeight(appMainHeight);
                                            }

                                            if (me.compRef.plainMenu) {
                                                me.compRef.plainMenu.collapse();
                                            }
                                        }
                                    }
                                }
                            });
                        }

                        if (state) {
                            me.compRef.fullMenu.toFront();
                            me.compRef.fullMenu.expand();
                        } else {
                            me.compRef.fullMenu.collapse();
                        }
                    };
                    break;
                case MENU_TYPE.TOOL:
                    defaultMenu = false;
                    break;
            }
        }
    
        if (defaultMenu) {
            mhPadding = 28;
            N2N_CONFIG.menuType = MENU_TYPE.DEFAULT;
            initializeMainMenuItems();
            // App header: main menu and top bar
            mainMenuBar = Ext.create('Ext.toolbar.Toolbar', {
                enableOverflow: menuOverflow,
                autoScroll: menuAutoScroll,
                border: false,
                plugins: N2N_CONFIG.reorderMenu ? Ext.create('Ext.ux.BoxReorderer', {}) : '',    
                defaults: {
                    scale: 'medium',
                    iconAlign: 'top',
                    reorderable: true
                }, 
                cls: 'smallermenu main-menu',
                items: mainmenu(),
                listeners: {
                    afterrender: function(thisTool) {
                        var toolItems = thisTool.items.items;
                        for (var i = 0; i < toolItems.length; i++) {
                            var mainItem = toolItems[i];
                            mainItem.zeroMenu = true;
                            
                            if (!mainItem.notDDMenu) { // single main menu
                                if (mainItem.menu) { // sub menu
                                    fix_firefox_menu_top(mainItem.menu);

                                var mmItem = mainItem.menu.items.items;
                                for (var j = 0; j < mmItem.length; j++) {
                                    var subItem = mmItem[j];
                                    if (!subItem.notDDMenu) {
                                            if (subItem.menu) { // have more sub menus
                                                var innerSub = subItem.menu.items.items;
                                                for (var k = 0; k < innerSub.length; k++) {
                                                    var innerSubItem = innerSub[k];
                                                    innerSubItem.secondMenu = true;
                                                    
                                                    if (!innerSubItem.notDDMenu) {
                                                        innerSubItem.on('afterrender', function(thisSubMenu) {
                                                            me.initDragMenu(thisSubMenu);
                                                        });
                                                    }
                                                    // TODO if more sub menu, should create a recursive function
                                                }
                                            } else { // this should the last sub menus
                                        subItem.on('afterrender', function(thisSubMenu) {
                                            me.initDragMenu(thisSubMenu);
                                        });
                                    }
                                }
                            }
                                } else { // single main menu
                                    me.initDragMenu(mainItem);
                        }
                    }
                }
                    }
                }
            });

            appHeaderItems.push(mainMenuBar);
        } else if (isMobile) {
            // back button
            me.compRef.backBtn = Ext.create('Ext.button.Button', {
                width: 30,
                height: '100%',
                iconCls: 'mobile-icon-back',
                cls: 'menubtn',
                hidden: true,
                handler: function() {
                    if (me.compRef.plainMenu && !me.compRef.plainMenu.getCollapsed()) {
                        me.compRef.plainMenu.collapse();
                    } else {
                        if (me.debug) {
                            console.log('back...');
                            console.log('closing ->', me._activeItemWin);
                        }
                        me._activeItemWin.close();
                    }
                }
            });
            // search box
            if (N2N_CONFIG.topSearchBox) {
                me.compRef.searchTf = Ext.create('Ext.form.field.Text', {
                    emptyText: 'Search',
                    width: 50,
                    height: '100%',
                    selectOnFocus: true,
                    cls: 'fix_fulltf',
                    listeners: {
                        focus: function(thisTf) {
                            thisTf.setWidth(70);
                        },
                        blur: function(thisTf) {
                            thisTf.setWidth(50);
                        },
                        specialkey: function(thisTf, e) {
                            if (e.getKey() == e.ENTER) {
                                var searchTxt = thisTf.getValue();

                                if (searchTxt && quoteScreen) {
                                    var searchTxt = thisTf.getValue();
                                    quoteScreen.search(searchTxt.trim());
                                }
                            }
                        }
                    }
                });
            }
            // title label
            me.compRef.titleLbl = Ext.create('Ext.form.Label', {
                html: '&nbsp;',
                flex: '1',
                style: 'text-align:center;font-size:1.1em!important;font-weight:bold;'
            });
            // menu button
            me.compRef.menuBtn = Ext.create('Ext.button.Button', {
                width: 30,
                height: '100%',
                toggleHandler: menuHandler,
                style: "background-color:#505050;",
                enableToggle: true,
                iconCls: 'mobile-icon-menu',
                cls: 'menubtn'
            });


            if (N2N_CONFIG.menuType == MENU_TYPE.TOOL) {
                initializeMainMenuToolItems();
                // menu button
                me.compRef.menuToolBtn = Ext.create('Ext.button.Button', {
                    width: 30,
                    height: '100%',
                    id: 'menutoolbtn',
                    cls: 'menubtn',
//            		bodyCls:'mainmenuTool',
                    menu: {
                        showSeparator: false,
                        //bodyStyle:'background-color:#AAA339;',
                        items: mainmenuTools()
                    }
                });
            }

            var mainMenuBarItems = [me.compRef.backBtn];
            if (me.compRef.searchTf) {
                mainMenuBarItems.push(me.compRef.searchTf);
            }

            if (N2N_CONFIG.menuType == MENU_TYPE.TOOL) {
                mainMenuBarItems.push(me.compRef.titleLbl, me.compRef.menuToolBtn);
            } else {
                mainMenuBarItems.push(me.compRef.titleLbl, me.compRef.menuBtn);
            }
            me.compRef.mainMenuBar = Ext.create('Ext.toolbar.Toolbar', {
                height: 33,
                border: false,
                items: mainMenuBarItems
            });
            appHeaderItems.push(me.compRef.mainMenuBar);
        }

        if (!isMobile) {
            topPanelBar = Ext.create('widget.toppanelbar');
            appHeaderItems.push(topPanelBar);
        }

        me.appHeader = {
            id: 'app-header',
            xtype: 'container',
            region: 'north',
            bodyStyle: {
                background: 'transparent'
            },
            items: appHeaderItems
        };

        if (switchView) {
            me.appFooter = new Ext.create('Ext.container.Container', {
                region: 'south',
                html: me._createViewLinks(),
                padding: 3,
                width: '100%',
                collapsible: true
            });
        }

        me.prepareLayouts();

        appItems.push(me.appHeader);
        appItems.push(me.appMain);
        if (switchView) {
            appItems.push(me.appFooter);
        }

        if (isMobile && touchMode) {
            me.setMinMaxSize();
        }
        // Temporary disabled due to many scrolling issues
        /*
         if (!isMobile) {
         if (me.isWindowLayout()) {
         me.minHeight = 300;
         } else {
         me.minHeight = 640;
         }
         me.minWidth = 950;
         me.autoScroll = true;
         }
         */

        var isIndexPage = window.parent.location.href.indexOf('index.jsp') > -1;
        var isOriented = Ext.supports.OrientationChange && !isIndexPage;
        
        Ext.apply(me, {
            id: 'app-viewport',
            items: appItems,
            cls: 'appvp',
            listeners: {
                resize: function(thisComp, width, height, oldWidth, oldHeight) {
                    if (oldWidth) {
                        if (!isOriented) {
                            me.autoResize();
                        }
                    }
                },
                afterrender: function(thisComp) {
                    setTimeout(function() {
                        thisComp.setLoading(languageFormat.getLanguage(10017, 'Loading...'));
                    }, 1);
                    
                    // activate first section
                    me.setFirstActive();
                }
            }
        });

        this.callParent();

        // Listen for orientation changes
        if (isOriented) {
            window.addEventListener("orientationchange", function() {
                var resizeInt = 250;
                if (androidPhone) {
                    resizeInt = 500;
                }

                if (me.resizeTask) {
                    clearTimeout(me.resizeTask);
                }
                me.resizeTask = setTimeout(function() {
                    var bodySize = me.setMinMaxSize();
                    me.setSize(bodySize);
                    me.autoResize();
                }, resizeInt);
            }, false);
        }
    },
    prepareLayouts: function() {
        var me = this;
        
        // prepares layout items
        if (me.isWindowLayout()) {
            if (isMobile) {
                me.appMain = Ext.create('Ext.container.Container', {
                    id: 'app-main',
                    region: 'center',
                    layout: 'fit'
                });
            } else {
                var subLayout = me.lyConf.getSubLayout();

                var mainTabConf = {
                    mt: 'mt',
                    region: 'center',
                    border: false,
                    layout: 'fit',
                    listeners: {
                        tabchange: me.tabchangeHandler
                    }
                };

                var appMainItems;
                if (N2N_CONFIG.splitScreen) {
                    var mtMinHeight = 100;
                    mainTabConf.minHeight = mtMinHeight;
                    mainTabConf.cls = 'splitscr top-panel';
                    mainTabConf.listeners.afterrender = me._getActiveScreenHandler();
                    mainTabConf.width = '100%';
                    mainTabConf.flex = 1 - me.lyConf.getScreenSize('mt3');
                    mainTabConf.hidden = me.lyConf.getScreenHidden('mt');
                    mainTabConf.listeners = me.getScreenListernerObj(true);
                    mainTabConf.tabBar = me.getConfigureTool('mt');

                    me.compRef.mt = Ext.create('Ext.tab.Panel', mainTabConf);
                    me.compRef.mt2 = Ext.create('Ext.tab.Panel', {
                        mt: 'mt2',
                        border: false,
                        layout: 'fit',
                        minHeight: mtMinHeight,
                        tabBar: me.getConfigureTool('mt2'),
                        hidden: me.lyConf.getScreenHidden('mt2'),
                        listeners: me.getScreenListernerObj(true),
                        cls: 'splitscr top-panel',
                        width: '100%',
                        flex: 1 - me.lyConf.getScreenSize('mt4')
                    });
                    me.compRef.mt3 = Ext.create('Ext.tab.Panel', {
                        mt: 'mt3',
                        border: false,
                        layout: 'fit',
                        split: true,
                        minHeight: mtMinHeight,
                        tabBar: me.getConfigureTool('mt3'),
                        hidden: me.lyConf.getScreenHidden('mt3'),
                        listeners: me.getScreenListernerObj(),
                        cls: 'splitscr',
                        width: '100%',
                        flex: me.lyConf.getScreenSize('mt3')
                    });
                    me.compRef.mt4 = Ext.create('Ext.tab.Panel', {
                        mt: 'mt4',
                        border: false,
                        layout: 'fit',
                        split: true,
                        minHeight: mtMinHeight,
                        tabBar: me.getConfigureTool('mt4'),
                        hidden: me.lyConf.getScreenHidden('mt4'),
                        listeners: me.getScreenListernerObj(),
                        cls: 'splitscr',
                        width: '100%',
                        flex: me.lyConf.getScreenSize('mt4')
                    });
                    me.compRef.mt5 = Ext.create('Ext.tab.Panel', {
                        mt: 'mt5',
                        border: false,
                        layout: 'fit',
                        minHeight: mtMinHeight,
                        tabBar: me.getConfigureTool('mt5'),
                        hidden: me.lyConf.getScreenHidden('mt5'),
                        listeners: me.getScreenListernerObj(true),
                        cls: 'splitscr dropbarsection top-panel',
                        width: '100%',
                        flex: 1 - me.lyConf.getScreenSize('mt6')
                    });
                    me.compRef.mt6 = Ext.create('Ext.tab.Panel', {
                        mt: 'mt6',
                        border: false,
                        layout: 'fit',
                        split: true,
                        minHeight: mtMinHeight,
                        tabBar: me.getConfigureTool('mt6'),
                        hidden: me.lyConf.getScreenHidden('mt6'),
                        listeners: me.getScreenListernerObj(),
                        cls: 'splitscr dropbarsection',
                        width: '100%',
                        flex: me.lyConf.getScreenSize('mt6')
                    });
                    me.compRef.mt7 = Ext.create('Ext.tab.Panel', {
                        mt: 'mt7',
                        border: false,
                        layout: 'fit',
                        minHeight: mtMinHeight,
                        tabBar: me.getConfigureTool('mt7'),
                        hidden: me.lyConf.getScreenHidden('mt7'),
                        listeners: me.getScreenListernerObj(true),
                        cls: 'splitscr dropbarsection top-panel',
                        width: '100%',
                        flex: 1 - me.lyConf.getScreenSize('mt8', null, 0.33) - me.lyConf.getScreenSize('mt9', null, 0.33)
                    });
                    me.compRef.mt8 = Ext.create('Ext.tab.Panel', {
                        mt: 'mt8',
                        border: false,
                        layout: 'fit',
                        split: true,
                        minHeight: mtMinHeight,
                        tabBar: me.getConfigureTool('mt8'),
                        hidden: me.lyConf.getScreenHidden('mt8'),
                        listeners: me.getScreenListernerObj(),
                        cls: 'splitscr dropbarsection',
                        width: '100%',
                        flex: me.lyConf.getScreenSize('mt8', null, 0.33)
                    });
                    me.compRef.mt9 = Ext.create('Ext.tab.Panel', {
                        mt: 'mt9',
                        border: false,
                        layout: 'fit',
                        split: true,
                        minHeight: mtMinHeight,
                        tabBar: me.getConfigureTool('mt9'),
                        hidden: me.lyConf.getScreenHidden('mt9'),
                        listeners: me.getScreenListernerObj(),
                        cls: 'splitscr dropbarsection',
                        width: '100%',
                        flex: me.lyConf.getScreenSize('mt9', null, 0.33)
                    });
                    
                    var mctHidden1 = me.lyConf.getScreenHidden('mt') && me.lyConf.getScreenHidden('mt3');
                    var mctHidden2 = me.lyConf.getScreenHidden('mt2') && me.lyConf.getScreenHidden('mt4');
                    var mctHidden3 = me.lyConf.getScreenHidden('mt5') && me.lyConf.getScreenHidden('mt6');
                    var mctHidden4 = me.lyConf.getScreenHidden('mt7') && me.lyConf.getScreenHidden('mt8') && me.lyConf.getScreenHidden('mt9');
                    
                    var mctMinWidth = 100;
                    me.compRef.mainCt1 = Ext.create('Ext.container.Container', {
                        mct: 'mct1',
                        layout: 'vbox',
                        minWidth: mctMinWidth,
                        items: [me.compRef.mt, me.compRef.mt3],
                        flex: 1 - me.lyConf.getScreenSize('mt2', true, null, mctHidden2) - me.lyConf.getScreenSize('mt5', true, null, mctHidden3)
                                - me.lyConf.getScreenSize('mt7', true, null, mctHidden4),
                        hidden: mctHidden1,
                        height: '100%',
                        listeners: me.getMainTabListernerObj(true)
                    });
                    me.compRef.mainCt2 = Ext.create('Ext.container.Container', {
                        mct: 'mct2',
                        layout: 'vbox',
                        split: true,
                        minWidth: mctMinWidth,
                        hidden: mctHidden2,
                        items: [me.compRef.mt2, me.compRef.mt4],
                        height: '100%',
                        flex: me.lyConf.getScreenSize('mt2', true, null, mctHidden2),
                        listeners: me.getMainTabListernerObj()
                    });
                    me.compRef.mainCt3 = Ext.create('Ext.container.Container', {
                        mct: 'mct3',
                        layout: 'vbox',
                        split: true,
                        minWidth: mctMinWidth,
                        hidden: mctHidden3,
                        items: [me.compRef.mt5, me.compRef.mt6],
                        height: '100%',
                        flex: me.lyConf.getScreenSize('mt5', true, null, mctHidden3),
                        listeners: me.getMainTabListernerObj()
                    });
                    me.compRef.mainCt4 = Ext.create('Ext.container.Container', {
                        mct: 'mct4',
                        layout: 'vbox',
                        split: true,
                        minWidth: mctMinWidth,
                        hidden: mctHidden4,
                        items: [me.compRef.mt7, me.compRef.mt8, me.compRef.mt9],
                        height: '100%',
                        flex: me.lyConf.getScreenSize('mt7', true, null, mctHidden4),
                        listeners: me.getMainTabListernerObj()
                    });
                    
                    var appMainCenterItems = [me.compRef.mainCt1, me.compRef.mainCt2, me.compRef.mainCt3, me.compRef.mainCt4];
                    
                    me.appMainCenter = Ext.create('Ext.container.Container', {
                        region: 'center',
                        layout: 'hbox',
                        items: appMainCenterItems
                    });
                    
                    me.compRef.mt10 = Ext.create('Ext.tab.Panel', {
                        mt: 'mt10',
                        border: false,
                        layout: 'fit',
                        tabBar: me.getConfigureTool('mt10'),
                        hidden: me.lyConf.getScreenHidden('mt10'),
                        listeners: me.getScreenListernerObj(true),
                        cls: 'splitscr dropbarsection',
                        height: '100%',
                        minWidth: mctMinWidth,
                        flex: 1 - me.lyConf.getScreenSize('mt11', true, null, me.lyConf.getScreenHidden('mt11')) - 
                                me.lyConf.getScreenSize('mt12', true, null, me.lyConf.getScreenHidden('mt12'))
                                - me.lyConf.getScreenSize('mt13', true, null, me.lyConf.getScreenHidden('mt13'))
                    });
                    me.compRef.mt11 = Ext.create('Ext.tab.Panel', {
                        mt: 'mt11',
                        border: false,
                        layout: 'fit',
                        split: true,
                        tabBar: me.getConfigureTool('mt11'),
                        hidden: me.lyConf.getScreenHidden('mt11'),
                        listeners: me.getScreenListernerObj(),
                        cls: 'splitscr dropbarsection',
                        height: '100%',
                        minWidth: mctMinWidth,
                        flex: me.lyConf.getScreenSize('mt11', true, null, me.lyConf.getScreenHidden('mt11'))
                    });
                    me.compRef.mt12 = Ext.create('Ext.tab.Panel', {
                        mt: 'mt12',
                        border: false,
                        layout: 'fit',
                        split: true,
                        tabBar: me.getConfigureTool('mt12'),
                        hidden: me.lyConf.getScreenHidden('mt12'),
                        listeners: me.getScreenListernerObj(),
                        cls: 'splitscr dropbarsection',
                        height: '100%',
                        minWidth: mctMinWidth,
                        flex: me.lyConf.getScreenSize('mt12', true, null, me.lyConf.getScreenHidden('mt12'))
                    });
                    me.compRef.mt13 = Ext.create('Ext.tab.Panel', {
                        mt: 'mt13',
                        border: false,
                        layout: 'fit',
                        split: true,
                        tabBar: me.getConfigureTool('mt13'),
                        hidden: me.lyConf.getScreenHidden('mt13'),
                        listeners: me.getScreenListernerObj(),
                        cls: 'splitscr dropbarsection',
                        height: '100%',
                        minWidth: mctMinWidth,
                        flex: me.lyConf.getScreenSize('mt13', true, null, me.lyConf.getScreenHidden('mt13'))
                    });
                    
                    me.appMainNorth = Ext.create('Ext.container.Container', {
                       mct: 'mct5',
                       region: 'south',
                       layout: 'hbox',
                       items: [me.compRef.mt10, me.compRef.mt11, me.compRef.mt12, me.compRef.mt13],
                       height: parseInt((me.lyConf.getScreenSize('mt10', null, 0.33)) * 100) + '%',
                       minHeight: mtMinHeight,
                       split: true,
                       hidden: me.lyConf.getScreenHidden('mt10') && me.lyConf.getScreenHidden('mt11') && me.lyConf.getScreenHidden('mt12') && me.lyConf.getScreenHidden('mt13'),
                       listeners: me.getMainTabListernerObj()
                    });
                    
                    appMainItems = [me.appMainCenter, me.appMainNorth];

                    me.appMain = Ext.create('Ext.container.Container', {
                        id: 'app-main',
                        region: 'center',
                        layout: 'border',
                        items: appMainItems,
                        listeners: {
                            afterrender: function() {
                                me.initializePopupDropZone(me);
                            }
                        }
                    });
                
                } else {
                    me.compRef.mt = Ext.create('Ext.tab.Panel', mainTabConf);
                    appMainItems = [me.compRef.mt];

                    me.appMain = Ext.create('Ext.container.Container', {
                        id: 'app-main',
                        region: 'center',
                        layout: 'hbox',
                        items: appMainItems,
                        listeners: {
                            afterrender: function() {
                                me.initializePopupDropZone(me);
                            }
                        }
                    });
                }
                
            }

        } else {
            var portalColumns = new Array();
            var portalPadding = 0;
            if (isTablet) {
                portalPadding = '1 10 1 1';
            }

            if (N2N_CONFIG.portalColumns > 0) {
                portalcol_top = Ext.create('widget.portalcolumn', {id: 'portalcol_top', padding: portalPadding});
                portalColumns.push(portalcol_top);
            }
            if (N2N_CONFIG.portalColumns > 1) {
                portalcol_2 = Ext.create('widget.portalcolumn', {id: 'portalcol_2'});
                portalColumns.push(portalcol_2);
            }
            if (N2N_CONFIG.portalColumns > 2) {
                portalcol_3 = Ext.create('widget.portalcolumn', {id: 'portalcol_3'});
                portalColumns.push(portalcol_3);
            }
            if (N2N_CONFIG.portalColumns > 3) {
                portalcol_4 = Ext.create('widget.portalcolumn', {id: 'portalcol_4'});
                portalColumns.push(portalcol_4);
            }

            me.appMain = Ext.create('widget.portalpanel', {
                id: 'app-main',
                region: 'center',
                border: false,
                items: portalColumns
            });
        }
    },
    isPortalLayout: function() {
        return layoutProfileManager.getMainLayout() === APP_LAYOUT.PORTAL;
    },
    isWindowLayout: function() {
        return isMobile || layoutProfileManager.getMainLayout() === APP_LAYOUT.WINDOW;
    },
    isTabLayout: function() {
        return false; // deprecated
    },
    isDefaultMenu: function() {
        return N2N_CONFIG.menuType == MENU_TYPE.DEFAULT;
    },
    isMetroMenu: function() {
        return N2N_CONFIG.menuType == MENU_TYPE.METRO;
    },
    /**
     * Adds new item to layout
     * 
     * @param {object} item Item to add
     * @param {string} portcol Portlet column to add to, use PORTCOL // apply on portal layout only
     * @param {int} index 
     * @param {object} tabCt Tab supposed to be parent of current item if any
     */
    addItem: function(item, portcol, index, tabCt) {
        var me = this;
        var newItem;
        var id = item.id || Ext.id();
        var title = item.title || '';
        var firstItem = false;
        var isTabItem = false;

        if (me.isWindowLayout()) { // window layout and mobile
            if (isMobile) {
                var keepHomeScreen = false;
                if (item.tConf) { // configure screen
                    var itemConf = {
                        title: title,
                        items: item,
                        layout: 'fit',
                        n2nType: item.type,
                        n2nName: item.n2nName,
                        screenType: item.screenType,
                        header: me.isDefaultMenu(),
                        type: item.type,
                        savingComp: item.savingComp,
                        key: item.key,
                        keyEnabled: item.keyEnabled,
                        stkname: item.stkname,
                        defScreen: true,
                        mt: 'am'
                    };

                    if (me.appMain.items.length > 0) {
                        me.appMain.removeAll();
                    }
                    
                    newItem = me.appMain.add(itemConf);
                    
                    keepHomeScreen = true;
                } else {
                    var mSize = me.getAppMain().getSize();
                    if (item.screenType == 'main') {
                        for (var i = 1; i < me.comp.length; i++) {
                            var win = me.comp[i];
                            if (win.screenType == 'main') {
                                win.destroy();
                                me.comp.splice(i, 1);
                            }
                        }
                    }
                    var winHeader = true;
                    if (me.compRef.fullMenu) {
                        winHeader = false;
                    }
                    
                    var winConfig = me._getWinConfig(item, {
                        title: title,
                        constrainTo: 'app-main',
                        height: mSize.height,
                        width: mSize.width,
                        closeAction: 'hide',
                        header: winHeader,
                        padding: 0,
                        collapsible: false,
                        draggable: false,
                        resizable: false
                    });
                    
                    if (item.mConfig != null) {
                        // make sure the components sizes not bigger than viewport size
                        if (item.mConfig.width > mSize.width) {
                            item.mConfig.width = mSize.width;
                        }
                        if (item.mConfig.height > mSize.height) {
                            item.mConfig.height = mSize.height;
                        }
                        
                        Ext.apply(winConfig, item.mConfig);
                    }
                    
                    newItem = Ext.create('Ext.window.Window', winConfig);
                    keepHomeScreen = me._defScreen == null && item.savingComp;
                    firstItem = keepHomeScreen;
                }
                
                // store default screen id
                if (keepHomeScreen) {
                    me._defScreen = item.id;
                    me._defScreenComp = item;
                }
                
                if (!newItem.notComp) {
                    newItem.on('close', function(thisComp) {
                        var activeItem = -1;

                        if (me.comp.length > 1) {
                            for (var i = me.comp.length - 1; i > 0; i--) {
                                var win = me.comp[i];
                                if (win.getId() != thisComp.getId()) {
                                    if (win.screenType == 'main') {
                                        me.activateItem(win.getComponent(0), true);
                                        activeItem = i;
                                        break;
                                    }
                                }
                            }
                        }
                        
                        if (activeItem == -1) {
                            if (me._defScreen) {
                                me.activateItem(me._defScreenComp, true);
                            } else { // when no home screen set
                                me.hardsettHomeScreen();
                            }
                        }

                    });
                }
                
            } else { // desktop
                // ignore maximized config
                item.initMax = null;
                
                var asTab = false;
                if (me.openAs) {
                    asTab = me.lyConf._isMt(me.openAs);
                } else {
                    asTab = layoutProfileManager.getOpenAs() === '1';
                }
                
                if (!item.initMax && (item.mtTarget || (item.tConf && (item.tConf.tab || item.tConf.pos0)) || (!item.loadedScreen && asTab))) { // switch to tab or configure screen
                    if (tabCt && !item.mtTarget) {
                        newItem = me.loadBufferItem(tabCt, item);
                    } else {
                        newItem = me.switchToTab(item);
                    }
                    isTabItem = true;
                } else {
                    // reset open as
                    me.openAs = null;
                    
                    if (item.initMax) {
                        if (item.winConfig) {
                            item.winConfig.maximized = true;
                        } else {
                            item.winConfig = {
                                maximized: true
                            };
                        }
                        item.initMax = null;
                    }
                   
                    var isMaxWin = item.winConfig && item.winConfig.maximized;
                    
                    var headerToolItems = [];
                    /*
                    if (syncGroupManager.isSyncComp(item.type)) {
                        headerToolItems.push({
                            xtype: 'checkbox',
                            style: 'margin: -4px 1px 0px 2px',
                            checked: syncCompList.exist(item.type),
                            screenType: item.screenType,
                            handler: function(thisBtn, status) {
                                updateSyncList(thisBtn.toolOwner.type, status);
                            },
                            listeners: me.syncCbListener()
                        });
                    }
                    */
                    
                    if (syncGroupManager.isSyncComp(item.type)) {
                        headerToolItems.push({
                            xtype: 'colorcombo',
                            syncType: item.type,
                            screenType: item.screenType,
                            style: 'margin-left:3px;width:24px',
                            value: syncGroupManager.getSyncGroup(item.type)
                        });
                    }

                    headerToolItems.push({
                        xtype: 'button',
                        padding: 0,
                        width: 15,
                        height: 15,
                        iconCls: 'icon-popin',
                        tooltip: languageFormat.getLanguage(21160,'Pop in this tab'),
                        style: 'margin-left:3px',
                        cls: 'fix_tool_btn fix_black',
                        handler: function(thisBtn) {
                            me._toTab(thisBtn.toolOwner);
                        }
                    });
                            
                    var winConfig = me._getWinConfig(item, {
                        title: title,
                        shadow: 'frame',
                        width: 800,
                        height: 350,
                        minWidth: 300,
                        minHeight: 150,
                        maxWidth: me.getWidth(),
                        maxHeight: me.getHeight(),
                        maximizable: N2N_CONFIG.allowMax && !item.noMaxBtn,
                        cls: (isMaxWin ? 'fix_restore' : '') + ' compresize',
                        _isMaxWin: isMaxWin,
 						noDD: item.noDD,
                        tools: headerToolItems,
                        resizable: (typeof(item._resizable) !='undefined' && item._resizable == false) ? false:  me.getCompResizable(),
                        listeners: {
                        	afterrender: function(thisComp){
                        		if(thisComp.collapseTool){
                        			if(thisComp.collapseTool.type == 'collapse-top')
                        				thisComp.collapseTool.setTooltip(languageFormat.getLanguage(10054, 'Collapse'));

                        			if(thisComp.collapseTool.type == 'expand-bottom')
                        				thisComp.collapseTool.setTooltip(languageFormat.getLanguage(10055, 'Expand'));
                        		}

                        		if(thisComp.tools.maximize)
                        			thisComp.tools.maximize.setTooltip(languageFormat.getLanguage(21148,'Maximize this tab'));
                        		
                        		if(thisComp.tools.close)
                        			thisComp.tools.close.setTooltip(languageFormat.getLanguage(10053, 'Close'));
                        	},
                        	collapse: function(thisComp){
                        		thisComp.collapseTool.setTooltip(languageFormat.getLanguage(10055, 'Expand'));
                        	},
                        	expand: function(thisComp){
                        		thisComp.collapseTool.setTooltip(languageFormat.getLanguage(10054, 'Collapse'));
                        	},
                            drag: function(thisDD, e) {
                                if (thisDD.comp && !thisDD.comp.noDD) {
                                me._isTabEnter(e.xy);
                                }
                            },
                            dragstart: function() {
                                me.shimIframe();
                            },
                            dragend: function(thisDD, e) {
                                if (thisDD.comp && !thisDD.comp.noDD) {
                                me._isTabEnter([e.pageX, e.pageY], thisDD);
                                }
                            },
                            resize: function(thisComp, width, height) {
                                // never save the maximized sizes
                                if (!thisComp._isMaxWin) {
                                    me.lyConf.setScreen('p', thisComp, width, height);
                                    
                                    // update width and height in winConfig so it remembers when switching
                                    var compItem = thisComp.getComponent(0);
                                    var layoutSize = me.getSize(); // fix issue when resize return the full size of viewport on dblclick

                                    if (compItem && width > 0 && width < layoutSize.width && height > 0 && height < layoutSize.height) {
                                        if (compItem.winConfig) {
                                            compItem.winConfig.width = width;
                                            compItem.winConfig.height = height;
                                        } else {
                                            compItem.winConfig = {
                                                width: width,
                                                height: height
                                            };
                                        }
                                    }
                                }
                            },
                            move: function(thisComp, x, y) {
                                if (!thisComp._isMaxWin) {
                                    me.lyConf.setScreen('p', thisComp, null, null, x, y);

                                    // update x and y in winConfig so it remembers when switching
                                    var compItem = thisComp.getComponent(0);
                                    if (compItem && (x > 0 || y > 0)) {
                                        if (compItem.winConfig) {
                                            if (compItem.winConfig.x) {
                                                compItem.winConfig.prevX = compItem.winConfig.x;
                                            }
                                            if (compItem.winConfig.y) {
                                                compItem.winConfig.prevY = compItem.winConfig.y;
                                            }

                                            compItem.winConfig.x = x;
                                            compItem.winConfig.y = y;
                                        } else {
                                            compItem.winConfig = {
                                                x: x,
                                                y: y
                                            };
                                        }
                                    }
                                }
                            },
                            restore: function(thisComp) {
                                var compItem = thisComp.getComponent(0);
                                if (compItem) {
                                    if (compItem._preMaxComp) {
                                        compItem._preMaxComp.close();
                                        compItem._preMaxComp = null;
                                        compItem._prevMt = null;
                                        me._fullScreen = null;
                                    }
                                }

                                thisComp.removeCls('fix_restore');
                                thisComp._isMaxWin = null;

                                // moves window from the top left position to centre
                                if (thisComp.x === 0 && thisComp.y === 0) {
                                    thisComp.center();
                                }
                            }
                        }
                    });
                    
                    if (item.winConfig != null) {
                        // width, height in percentage
                        if (item.winConfig.pcHeight < 1) {
                            item.winConfig.height = parseInt(me.getHeight() * item.winConfig.pcHeight);
                        }
                        if (item.winConfig.pcWidth < 1) {
                            item.winConfig.width = parseInt(me.getWidth() * item.winConfig.pcWidth);
                        }
                        // merge default winConfig with item winConfig
                        Ext.Object.merge(winConfig, item.winConfig);
                        Ext.Object.merge(winConfig, item.ctConfig);
                    }
                    
                    // set comp x,y if any
                    if (me.compWinX != null) {
                        winConfig.x = me.compWinX;
                    }
                    if (me.compWinY != null) {
                        winConfig.y = me.compWinY;
                    }
                    
                    // update item's parent id
                    item.mt = 'p';
                    newItem = Ext.create('Ext.window.Window', winConfig);
                    
                    // for popup on double click
                    if (!item.noDD) {
                    newItem.header.on({
                        scope: newItem,
                        dblclick: function(thisHeader) {
                            if (thisHeader.ownerCt) {
                                me._toTab(thisHeader.ownerCt);
                            }
                        }
                    });
                }
                
                me._addScreenCloseEvent(newItem);
                focusManager.addActiveKeyScreenEvent(newItem);
                
                }
                
                if (item.ddComp) {
                    me.initDropComp(newItem, item, isTabItem);
                }
            }

            if (!newItem.notComp) {
                if (firstItem) {
                    me.comp.unshift(newItem);
                } else {
                    me.comp.push(newItem);
                }
            } else {
                me.notComp.push(newItem);
            }

        } else if (me.isTabLayout()) {
            var tabItem = {
                title: title,
                layout: 'fit',
                items: item,
                closable: true,
                border: false,
                autoShow: true,
                n2nType: item.type,
                n2nName: item.n2nName,
                screenType: item.screenType,
                height: '100%',
                width: '100%',
                // hideMode: 'offsets', // fixed empty grid issue when tab is inactive
                listeners: {
                    beforeclose: function() {
                        tabItem = null;
                    }
                }
            };

            var tab;
            var altTab;
            var pos0;
            if (item.tConf) {
                Ext.apply(tabItem, item.tConf);
                tab = item.tConf.tab;
                altTab = item.tConf.altTab;
                pos0 = item.tConf.pos0;
            }

            var ctTab = me.getActiveScreen();

            if (tab || altTab) {
                if (me.compRef[tab]) {
                    ctTab = tab;
                } else if (me.compRef[altTab]) {
                    ctTab = altTab;
                } else if (me.compRef.tab1) {
                    ctTab = 'tab1';
                }
            }

            if (pos0) {
                var comp0 = me.compRef[ctTab].getComponent(0);
                if (comp0) {
                    me.compRef[ctTab].remove(comp0);
                }
                tabItem.closable = false;
                newItem = me.compRef[ctTab].insert(0, tabItem);
            } else {
                newItem = me.compRef[ctTab].add(tabItem);
            }

        } else {
            if (isMobile || portcol == undefined || portcol == null) {
                portcol = portalcol_top;
            }
            var portletId = 'portlet_' + id;
            var portletItem = {
                id: portletId,
                title: title,
                items: item,
                height: 342,
                n2nType: item.type,
                n2nName: item.n2nName,
                screenType: item.screenType,
                resizable: false,
                listeners: {resize: function(thisComp, newWidth, newHeight, oldWidth, oldHeight) {
                        if (oldWidth && N2N_CONFIG.activeSub) {
                            me.appMain.runActiveSubscriptionTask();
                        }
                    }
                }
            };
            var minMax = item.hasOwnProperty('minMax') ? item.minMax : true;
            if (minMax) {
                portletItem.tools = me.getTools(portletId);
            }
            if (item.portConfig != null) {
                Ext.apply(portletItem, item.portConfig);
            }
            if (isMobile) {
                var mHeight = me.getAppMain().getHeight() - 5;
                Ext.apply(portletItem, {
                    height: mHeight
                });
            }

            var pos = parseInt(N2N_CONFIG.portalAddItemPosition);
            if (pos != NaN && pos > -1) {
                newItem = portcol.insert(pos, portletItem);
            } else if (index) {
                newItem = portcol.insert(index, portletItem);
            } else {
                newItem = portcol.add(portletItem);
            }
        }

        // to observe active item
        if (!isMobile && item.screenType == 'main' && !item.ignoredScreen) {
            if (!item.events.itemclick) {
                item.on('itemclick', function() {
                    var activeId = item.getId();
                    if (me.debug) {
                        console.log('N2NLayoutManager -> main screen: item clicked...');
                        console.log('item id -> ', activeId);
                    }
                    n2nLayoutManager.setActiveItem(activeId);
                });
            }
            
            if (!item._contextEventAdded) {
                item.on('itemcontextmenu', function() {
                    var activeId = item.getId();
                    if (me.debug) {
                        console.log('N2NLayoutManager -> main screen: item contextmenu ...');
                        console.log('item id -> ', activeId);
                    }
                    n2nLayoutManager.setActiveItem(activeId);
                });

                item._contextEventAdded = true;
            }

        }
        
        return newItem;
    },
    _addScreenCloseEvent: function(comp) {
        var me = this;
        
        if (comp.notComp) {
            return;
        }
        
        comp.on('close', function(thisComp) {
            
            for (var i = 0; i < me.comp.length; i++) {
                var win = me.comp[i];
                if (win.closeAction !== 'hide' && win.getId() == thisComp.getId()) {
                    me.comp.splice(i, 1);
                    break;
                }
            }

            // remove previous screen config
            me.lyConf.removeScreen(thisComp.mt, thisComp.type, thisComp.key);

            var compItem = thisComp.getComponent(0);
            if (compItem) {
                if (compItem._preMaxComp) {
                    compItem._preMaxComp.close();
                    compItem._preMaxComp = null;
                    compItem._prevMt = null;
                    me._fullScreen = null;
                }
            }
        });
        
        comp._secondCloseEvent = true;
    },
    switchToTab: function(item) {
        var me = this;
        var newItem;

        if (item._preMaxComp) {
            item.tConf = {tab: item._preMaxComp.mt};
            item._needUpdate = item.stkname != null;
            newItem = me.addItem(item, null, null, item._preMaxComp);

            // add extra buttons back
            me.tabExtraButtons(newItem);
            // removes previous component reference
            item._preMaxComp = null;
            me._fullScreen = null;
        } else {
            if (item.mtTarget) {
                me.destroyExtraButtons(item);
            }
            
            var tabItem = me._getTabConfig({
                title: item.title || '',
                items: item,
                n2nType: item.type,
                n2nName: item.n2nName,
                type: item.type,
                savingComp: item.savingComp,
                key: item.key,
                keyEnabled: item.keyEnabled,
                stkname: item.stkname,
                screenType: item.screenType
            });
            Ext.Object.merge(tabItem, item.ctConfig);

            // activate first tab if there is no tab available
            if (me.compRef.mainCt1.isHidden() && me.compRef.mainCt2.isHidden() && me.compRef.mainCt3.isHidden() && me.compRef.mainCt4.isHidden()) {
                // remove previous config of this item
                me.lyConf.removeScreen('mt', item.type, item.key);
                me.compRef.mainCt1.show();
                me.compRef.mt.show();
                me.setActiveScreen(me.compRef.mt);
            }
            
            var ctTab = item.mtTarget || me.openAs;
            if (ctTab == null || !me.isMt(ctTab)) {
                ctTab = me.getActiveScreen();
            }
            
            item.mtTarget = null; // important: clear mt target
            me.openAs = null; // reset open as
            
            var tab0 = false;
            if (item.tConf && item.tConf.pos0) {
                ctTab = item.tConf.tab;
                tab0 = true;
            }
            
            if (me.compRef[ctTab] && !me.compRef[ctTab].isHidden()) {
                // key tab info
                item.mt = ctTab;
                
                if (tab0) {
                    var comp0 = me.compRef[ctTab].getComponent(0);
                    if (comp0) {
                        // me.compRef[ctTab].remove(comp0);
                        comp0.close();
                    }
                    tabItem.closable = false;
                    newItem = me.compRef[ctTab].insert(0, tabItem);
                } else {
                    newItem = me.compRef[ctTab].add(tabItem);
                }
                
                me._addScreenCloseEvent(newItem);
                
                me.compRef[ctTab].setActiveTab(newItem.id);

                newItem.mt = ctTab;
                if (item.ddComp) {
                    me.initDropComp(newItem, item, true);
                }

            // save screen config
            me.lyConf.setScreen(newItem.mt, item);
        }
        }
        
        if (newItem) {
            newItem.keyEnabled = item.keyEnabled;
            focusManager.addActiveKeyScreenEvent(newItem);
            
            focusManager.setActiveKeyScreen(newItem);
        }

        return newItem;
    },
    _toPopup: function(comp, maximized) {
        var me = this;
        var compItem = comp.getComponent(0);
        
        if (compItem) {
            var prevMt;
            
            if (compItem.winConfig) {
                compItem.winConfig.maximized = maximized || false;
            } else {
                compItem.winConfig = {
                    maximized: maximized || false
                };
            }
            // maximized window
            if (maximized) {
                prevMt = compItem.mt;
            }
            
            var pcomp = comp.up();
            var ctTab = 'mt';
            if (pcomp) {
                ctTab = pcomp.mt;
            }
            if (compItem.tConf) {
                ctTab = compItem.tConf.tab;
                compItem.tConf = null; // reset to popup
            }
            
            compItem.loadedScreen = true;
            compItem.switched = true;
            
            if (typeof(compItem.setChartStatus) === 'function') {
                compItem.setChartStatus();
            }
            // create popup
            var compWin = me.addItem(compItem);
            
            me.destroyExtraButtons(compItem);
            
            // remove current tab
            if (!maximized) {
                comp.close();
            } else {
                compItem._preMaxComp = comp;
                compItem._prevMt = prevMt;
                me._fullScreen = compWin;
            }
            
            /*
            if (me.compRef[ctTab]) {
                me.compRef[ctTab].remove(comp);
            }
            */

            // keep active item if it is main screen
            if (compItem.screenType === 'main' && !compItem.ignoredScreen) {
                me.setActiveItem(compItem.getId());
            }
            
            focusManager.setActiveKeyScreen(compWin);
            
            // keep screen info
            if (!maximized) {
                // me.lyConf.setScreen('p', compItem);
            }
        }
    },
    _toTab: function(comp) {
        var me = this;
        var compItem = comp.getComponent(0);
        if (compItem) {
            compItem._needRecreatePicker = true;
            me._resetGridMenu(compItem);
            
            if (typeof(compItem.setChartStatus) === 'function') {
                compItem.setChartStatus();
            }
            
            // for drag from popup to tab
            compItem.mtTarget = comp.mtTarget;
            me.switchToTab(compItem);
            
            // make sure current popup destroyed when switch to tab
            if (comp.closeAction === 'hide') {
                comp.closeAction = 'destroy';
            }
            // closes current popup
            comp.close();
        }
    },
    destroyExtraButtons: function(compItem) {
        if (compItem.popupBtn) {
            compItem.popupBtn.destroy();
            compItem.popupBtn = null;
        }
        if (compItem.maxBtn) {
            compItem.maxBtn.destroy();
            compItem.maxBtn = null;
        }
        if (compItem.hiddenTbar) {
            compItem.hiddenTbar.hide();
            compItem.hiddenTbar = null;
        }
        if (compItem.syncCombo) {
            compItem.syncCombo.destroy();
            compItem.syncCombo = null;
        }
        if (compItem.menuBtn) {
            compItem.menuBtn.destroy();
            compItem.menuBtn = null;
        }
    },
    loadBufferItem: function(tabCt, item) {
        var me = this;
        
        // update mt
        item.mt = tabCt.mt;
        
        // apply some more configs
        tabCt.screenType = item.screenType;
        
        // key enabled
        tabCt.keyEnabled = item.keyEnabled;

        // add item to tab body    
        tabCt.add(item);
        if (typeof item.afterLoadBufferItem === 'function') {
            item.afterLoadBufferItem(item, tabCt);
        }
        
        // add buttons
        me.addExtraButtons(item, tabCt);
        tabCt.isPendingTab = false;
        
        if (item._needUpdate) {
            // update some info back to tab if any info has been updated during full screen
            tabCt.key = item.key;
            tabCt.stkname = item.stkname;
            // update title
            tabCt.setTitle(item.title || '');
            item._needUpdate = null;
        }
        
        me._addScreenCloseEvent(tabCt);
        focusManager.addActiveKeyScreenEvent(tabCt);

        return tabCt;
    },
    /**
     * Gets item(portlet/window) from current layout
     * 
     * @param {string} property Property of item to get
     * @param {mixed} value Value of property
     * @param {string} comType Component type (optional)
     * @return {component} Returns found item (window/portlet/tab)
     */
    getItem: function(property, value, comType) {
        var me = this;
        var foundItem = null;
        var checkType = comType != undefined && comType != null;

        if (me.isWindowLayout()) {
            if (isMobile) {
                var compItems = me.comp;
                for (var i = 0; i < compItems.length; i++) {
                    var winComp = compItems[i];
                    var skipType = true;
                    if (checkType && winComp.hasOwnProperty('type')) {
                        skipType = false;
                        if (winComp.type == comType) {
                            skipType = true;
                        }
                    }

                    if (skipType && winComp[property] == value) {
                        foundItem = winComp;
                        break;
                    }
                }
            } else { // desktop
                tabList:
                        for (var t = 0; t < me._wTabList.length; t++) {
                    var tId = me._wTabList[t];

                    if (me.compRef[tId] && !me.compRef[tId].isHidden()) {
                        var tabItems = me.compRef[tId].items.items;
                        for (var i = 0; i < tabItems.length; i++) {
                            var tabComp = tabItems[i];
                            var skipType = true;
                            if (checkType && tabComp.hasOwnProperty('type')) {
                                skipType = false;
                                if (tabComp.type == comType) {
                                    skipType = true;
                                }
                            }

                            if (skipType && tabComp[property] == value) {
                                foundItem = tabComp;
                                break tabList;
                            }
                        }
                    }
                }

                if (!foundItem) {
                    Ext.WindowManager.each(function(win) {
                        var skipType = true;
                        if (checkType && win.hasOwnProperty('type')) {
                            skipType = false;
                            if (win.type == comType) {
                                skipType = true;
                            }
                        }

                        if (skipType && win.hasOwnProperty(property) && win[property] == value) {
                            foundItem = win;
                            return false; // exit from loop
                        }
                    });
                }
            }

        } else if (me.isTabLayout()) {
            tabList:
            for (var t = 0; t < me._tTabList.length; t++) {
                var tId = me._tTabList[t];

                if (me.compRef[tId] && !me.compRef[tId].isHidden()) {
                    var items = me.compRef[tId].items.items;
                    for (var i = 0; i < items.length; i++) {
                        var tabComp = items[i];
                        var comp = tabComp.getComponent(0);
                        var skipType = true;
                        if (checkType) {
                            skipType = false;
                            if (comp.type == comType) {
                                skipType = true;
                            }
                        }
                        if (skipType && tabComp[property] == value) {
                            foundItem = tabComp;
                            break tabList;
                        }
                    }
                }
            }
        } else {
            var portalPanel = me.appMain;
            var colCount = portalPanel.items.length;
            for (var i = 0; i < colCount; i++) {
                var portCol = portalPanel.getComponent(i);
                for (var j = 0; j < portCol.items.length; j++) {
                    var portCom = portCol.getComponent(j);
                    var comp = portCom.getComponent(0);
                    var skipType = true;
                    if (checkType) {
                        skipType = false;
                        if (comp.type == comType) {
                            skipType = true;
                        }
                    }
                    if (skipType && portCom.hasOwnProperty(property) && portCom[property] == value) {
                        foundItem = portCom;
                        break;
                    }
                }
            }
        }
        
        return foundItem;
    },
    _getItem: function(item) {
        if (item) {
            return item.up();
        }

        return null;
    },
    /**
     * Removes item (window/portlet) from current layout
     * 
     * @param {string} property Property of item
     * @param {mixed} value Value of property
     * @param {string} comType Component type (optional)
     */
    removeItem: function(property, value, comType) {
        var me = this;
        var checkType = comType != undefined && comType != null;
        var removeObj = null;

        if (me.isWindowLayout()) {
            var itemRemoved = false;

            if (isMobile) {
                var winItems = me.comp;
                for (var i = 0; i < winItems.length; i++) {
                    var winComp = winItems[i];
                    var skipType = true;
                    if (checkType && winComp.hasOwnProperty('type')) {
                        skipType = false;
                        if (winComp.type == comType) {
                            skipType = true;
                        }
                    }

                    if (skipType && winComp[property] == value) {
                        removeObj = {
                            mt: winComp.mt,
                            type: winComp.type,
                            key: winComp.key
                        };
                        
                        var chComp = winComp.getComponent(0);
                        if (chComp && chComp.id === me._defScreen) {
                            me._defScreen = null;
                            me._defScreenComp = null;
                        }

                        if (winComp.isXType('window')) {
                            winComp.suspendEvent('close');
                            winComp.close();
                        } else { // tab in default screen
                            winComp.destroy();
                        }
                        
                        // remove comp list
                        me.comp.splice(i, 1);
                        break;
                    }
                }
            } else { // desktop
                tabList:
                        for (var t = 0; t < me._wTabList.length; t++) {
                    var tId = me._wTabList[t];
                    if (me.compRef[tId] && !me.compRef[tId].isHidden()) {
                        var tabItems = me.compRef[tId].items.items;
                        for (var i = 0; i < tabItems.length; i++) {
                            var tabComp = tabItems[i];
                            var skipType = true;
                            if (checkType && tabComp.hasOwnProperty('type')) {
                                skipType = false;
                                if (tabComp.type == comType) {
                                    skipType = true;
                                }
                            }

                            if (skipType && tabComp[property] == value) {
                                removeObj = {
                                    mt: tabComp.mt,
                                    type: tabComp.type,
                                    key: tabComp.key
                                };
                                tabComp.destroy();
                                itemRemoved = true;
                                break tabList;
                            }
                        }
                    }
                }

                if (!itemRemoved) {
                    Ext.WindowManager.each(function(win) {
                        var skipType = true;
                        if (checkType && win.hasOwnProperty('type')) {
                            skipType = false;
                            if (win.type == comType) {
                                skipType = true;
                            }
                        }

                        if (skipType && win.hasOwnProperty(property) && win[property] == value) {
                            removeObj = {
                                mt: win.mt,
                                type: win.type,
                                key: win.key
                            };
                            win.close();
                            itemRemoved = true;
                            return false;
                        }
                    });
                }
            }

        } else if (me.isTabLayout()) {
            tabList:
                    for (var t = 0; t < me._tTabList.length; t++) {
                var tId = me._tTabList[t];
                if (me.compRef[tId] && !me.compRef[tId].isHidden()) {
                    var items = me.compRef[tId].items.items;
                    for (var i = 0; i < items.length; i++) {
                        var tabComp = items[i];
                        var comp = tabComp.getComponent(0);
                        var skipType = true;
                        if (checkType) {
                            skipType = false;
                            if (comp.type == comType) {
                                skipType = true;
                            }
                        }
                        if (skipType && tabComp[property] == value) {
                            tabComp.close();
                            break tabList;
                        }
                    }
                }
            }
        } else {
            var portalPanel = me.appMain;
            var colCount = portalPanel.items.length;
            for (var i = 0; i < colCount; i++) {
                var portCol = portalPanel.getComponent(i);
                for (var j = 0; j < portCol.items.length; j++) {
                    var portCom = portCol.getComponent(j);
                    var comp = portCom.getComponent(0);
                    var skipType = true;
                    if (checkType) {
                        skipType = false;
                        if (comp.type == comType) {
                            skipType = true;
                        }
                    }
                    if (skipType && portCom.hasOwnProperty(property) && portCom[property] == value) {
                        portCol.remove(portCom);
                    }
                }
            }
        }
        
        return removeObj;
    },
    /**
     * Activates portlet/window: focus and highlight
     * 
     * @param {component} item Item to activate
     * 
     */
    activateItem: function(item, sRefresh) {
        if (!firstRunSaving || !N2N_CONFIG.confSaveLayout || !n2nLayoutManager.isPortalLayout()) {// For Saving Components of Portlet Layout. Don't activate item in first loading on Docked Layout.
            var me = this;
            var itemWin = item.up();
            
            if (isMobile) {
                if (!itemWin.notComp) {
                    if (me.compRef.menuBtn) {
                        me.toggleFullMenu(false);

                        if (item.id == me._defScreen) {
                            me.compRef.backBtn.hide();
                            if (me.compRef.searchTf) {
                                me.compRef.searchTf.show();
                            }
                        } else {
                            if (me.compRef.searchTf) {
                                me.compRef.searchTf.hide();
                            }
                            me.compRef.backBtn.show();
                        }

                        // update title
                        helper.setHtml(me.compRef.titleLbl, item.title);
                    }

                    var itemWinId = itemWin != null ? itemWin.getId() : '';
                    for (var i = 0; i < me.comp.length; i++) {
                        var win = me.comp[i];
                        if (itemWinId != win.getId()) {
                            // if (win.screenType != 'main') {
                                win.hide();
                            // }
                        } else {
                            win.show();
                            // update screen config
                            if (item.savingComp) {
                                me.lyConf.setScreen('am', item);
                            }
                        }
                    }
                    for (var i = 1; i < me.comp.length; i++) {
                        var win = me.comp[i];
                        if (win.screenType !== 'main' && win.isHidden()) {
                            win.destroy();
                            me.comp.splice(i, 1);
                        }
                    }
                } else {
                    if (me.compRef.menuBtn) {
                        me.toggleFullMenu(false);
                    }
                    if (itemWin.isHidden()) {
                        itemWin.show();
                    }
                    itemWin.toFront();
                    // update screen config
                    if (item.savingComp) {
                        me.lyConf.setScreen('am', item);
                    }

                    return;
                }
            } else {
                if (me.isTabLayout()) {
                    var tabPanel = item.findParentByType('tabpanel');
                    var tab = item.up();

                    if (tabPanel && tab) {
                        tabPanel.setActiveTab(tab.id);
                    }
                } else {
                    var pitem = item.up();
                    if (pitem) {
                        // check if full screen is presenting, exit it
                        if (me._fullScreen) {
                            // me._toTab(me._fullScreen);
                        }
                            
                        if (me.isWindowLayout() && pitem.isXType('window')) {
                            if (pitem.getCollapsed()) {
                                pitem.expand();
                            }
                            pitem.toFront();
                        } else {
                            var ppitem = pitem.up();
                            if (ppitem && ppitem.isXType('tabpanel')) {
                                ppitem.setActiveTab(pitem.id);
                            } else {
                                scrollToView(pitem.getId());
                            }
                        }
                    }
                }
            }
            
            // used in mobile view
            me._activation = item.id;
            
            // keep active item (only ID)
            if (item.screenType == 'main' && !item.ignoredScreen) {
                me.setActiveItem(item.id);
            }
            if (isMobile) {
                me._activeItemWin = itemWin; // for mobile only
            }
            
            if (item.fromSync) {
                if (itemWin.isXType('window')) {
                    focusManager.setActiveKeyScreen(itemWin);
                }
            } else {
                focusManager.setActiveKeyScreen(itemWin);
            }

            if (item.body != null){
                item.body.highlight();
            }
            
            if (N2N_CONFIG.activeSub && isMobile) {
                var doStorageRefresh = true;
                if (sRefresh) {
                    if (typeof item.switchRefresh === 'function') {
                        doStorageRefresh = false;
                        item.switchRefresh(true);
                    }
                }
                if (doStorageRefresh) {
                    Storage.refresh();
                }
            }
           
        }
    },
    getActiveRecord: function(wholeRecord) {
        var me = this;
        var activeItem;
        var accbranch = null;

        if (me._activeItem && me._activeItem != '') {
            activeItem = Ext.ComponentManager.get(me._activeItem);
        }
        if (!activeItem && quoteScreen) {
            activeItem = quoteScreen;
            me._activeItem = quoteScreen.getId();
        }

        if (activeItem && activeItem.screenType == 'main') {
            var records = [];

            if (typeof activeItem.getSelectedRec === 'function') {
                records = activeItem.getSelectedRec();
            } else {
                if (!activeItem.isXType('grid')) {
                    if (activeItem.mainScreenId != '') {
                        var innerItem = Ext.ComponentManager.get(activeItem.mainScreenId);
                        if (innerItem) {
                            records = innerItem.getSelectionModel().getSelection();
                        }
                    }
                } else {
                    records = activeItem.getSelectionModel().getSelection();
                    if (equityPrtfPanel && equityPrtfPanel.getId() === activeItem.getId()) {
                        accbranch = equityPrtfPanel.getAccountBranch();
                    } else if(mfEquityPrtfPanel && mfEquityPrtfPanel.getId() === activeItem.getId()) {
                        accbranch = mfEquityPrtfPanel.getAccountBranch();
                    }
                }
            }

            if ((!records || records.length == 0) && quoteScreen) {
                // if no record, get record from quote screen
                records = quoteScreen.getSelectedRec();
            }
            if (records.length > 0) {
                return me.getStkRec(records[0], wholeRecord, accbranch);
            }
        }

        return {};
    },
    getStkRec: function(rec, wholeRec, accbranch) {
        var record = {};

        if (rec.get('StkCode') != null) {
            record.stkCode = rec.get('StkCode');
            record.stkName = rec.get('StkName');
        } else if (rec.get('sc') != null) {
            record.stkCode = rec.get('sc');
            record.stkName = rec.get('sy');
            rec.data.RefPrc = rec.get('op');
        } else {
            record.stkCode = rec.get(fieldStkCode);
            record.stkName = rec.get(fieldStkName);
        }
        if (rec.get(fieldLotSize)) {
            lotsize = rec.get(fieldLotSize);
        } else if (rec.get("ls")) {
            lotsize = rec.get("ls");
        } else if (rec.get("LotSize")) {
            lotsize = rec.get("LotSize");
        }
        record['News'] = rec.get('News');
        if (accbranch) {
            record.accbranchNo = accbranch;
            record.payment = rec.get('SettOpt');
        }

        if (wholeRec) {
            record['rec'] = rec;
        }

        return record;
    },
    getActive: function(key, stkName) { // get active counter
        var me = this;
        
        // sets active screen to quotescreen
        me.setActiveItem('');

        if (key) {
            return {
                stkCode: key,
                stkName: stkName
            };
        } else {
            return n2nLayoutManager.getActiveRecord();
        }

    },
    getActivation: function() {
        var me = this;
        var activeId = '';

        if (me._activation && me._activation != '' && Ext.ComponentManager.get(me._activation)) {
            activeId = me._activation;
        } else if (quoteScreen) { // default to quotescreen
            activeId = quoteScreen.getId();
        }

        return activeId;
    },
    isActivation: function(comp) {
        if (isMobile) {
            return comp.getId() === this.getActivation();
        } else {
            return helper.activeView(comp);
        }
    },
    setActiveItem: function(itemId) {
        this._activeItem = itemId;
    },
    getTools: function(comId) {
        var me = this;
        var tools = new Array();

        if (N2N_CONFIG.portalColumns > 1 && N2N_CONFIG.portalFullColumn) {
            tools = [{
                    xtype: 'tool',
                    type: 'maximize',
                    listeners: {
                        afterrender: function(thisComp) {
                            var toolIcon = Ext.getCmp(comId).findParentByType('container').getId() === 'portalcol_top' ? 'minimize' : 'maximize';
                            thisComp.setType(toolIcon);
                        }
                    },
                    handler: function(e, target, header, tool) {
                        var comp = Ext.getCmp(comId);
                        var col = comp.findParentByType('container').getId();

                        if (col === 'portalcol_2' || col === 'portalcol_3') {
                            portalcol_top.add(comp);

                        } else if (col === 'portalcol_top') {
                            portalcol_2.add(comp);
                        }

                        var toolIcon = comp.findParentByType('container').getId() === 'portalcol_top' ? 'minimize' : 'maximize';
                        this.setType(toolIcon);
                        me.activateItem(comp);
                    }
                }];
        }

        return tools;
    },
    saveLayout: function(displayMsg) {
        if (this.isPortalLayout() && N2N_CONFIG.confSaveLayout) {
            // var url = addPath + "tcplus/setting?a=set&sc=" + contSaveLayout + "&p=";
            var url = "";
            //var isCompStock = ["epd", "si", "tr", "nc", "sn", "fc", "ft", "wi", "wl", "ol", "od"];

            var isCompStock = ["wl", "nc"];
            var portalcol = [portalcol_top, portalcol_2, portalcol_3];
            
            for (var i = 0; i < portalcol.length; i++) {
                if (portalcol[i]) {
                    if (portalcol[i].items.items.length > 0) {
                        // url += portalcol_str;
                        if (i != 0) {
                            url += "~";
                        }
                        
                        for (var j = 0; j < portalcol[i].items.items.length; j++) {
                            var comp = portalcol[i].items.items[j].items.items[0];
                            if (comp) {
                                if (j == 0) {
                                    url += comp.slcomp;
                                } else {
                                    url += "," + comp.slcomp;
                                }

                                if (isCompStock.indexOf(comp.slcomp) != -1) {
                                    if (comp.stkCode) {
                                        url += "_" + comp.stkCode;
                                        if (comp.stkName) {
                                            url += "_" + comp.stkName;
                                        }
                                    } else if (comp.stkcode) {
                                        url += "_" + comp.stkcode;
                                        if (comp.stkname) {
                                            url += "_" + comp.stkname;
                                        }
                                    } else if (comp.key) {
                                        url += "_" + comp.key;
                                    } else if (comp.wlname) {
                                        url += "_" + comp.wlname;
                                    } else if (comp.ac && comp.slcomp == "ol") {
                                        url += "_" + comp.ac;
                                        url += "_" + comp.ordno;
                                        url += "_" + comp.stkname;
                                    } else if (comp.ordno && comp.slcomp == "od") {
                                        url += "_" + comp.ordno;
                                        url += "_" + comp.tktno;
                                        url += "_" + comp.type;
                                    }
                                }
                            }
                        }
                    } else {
                        if (i != 0) {
                            url += "~";
                        }
                    }
                }
            }
            
            cookies.createCookie(cookieKey + "savelayout", url, cookieExpiryDays);
            
            if (displayMsg) {
                msgutil.info(languageFormat.getLanguage(21031, 'Layout saved successfully.'));
            }
        }
    },
    getAppMain: function() {
        return this.appMain;
    },
    getClickPosition: function() {
        return this.clickPos;
    },
    resetClickPosition: function() {
        this.clickPos = null;
    },
    /**
     * Updates the title of window/portlet
     * 
     * @param {component} com Item
     * @param {string} title Title to update
     */
    updateTitle: function(com, title) {
        var me = this;

        com.title = title;
        if (!me.compRef.fullMenu) {
            var pcom = com.up();
            if (pcom)
                pcom.setTitle(title);
        } else {
            // update screen title
            helper.setHtml(me.compRef.titleLbl, title);
        }

    },
    autoResize: function() {
        var me = this;

        if (me.isWindowLayout()) { // should resize for window layout only
            if (isMobile) {
                var appMainSize = me.getAppMain().getSize();

                for (var i = 1; i < me.comp.length; i++) {
                    var comp = me.comp[i];
                    if (me.debug) {
                        debugutil.debug('resize ' + comp.id);
                        debugutil.debug('', {'old size': comp.getSize()});
                    }
                    comp.setSize(appMainSize.width, appMainSize.height);
                    if (me.debug) {
                        debugutil.debug('', {'new size': comp.getSize()});
                    }
                }

                for (var i = 0; i < me.notComp.length; i++) {
                    var nCmp = me.notComp[i];
                    nCmp.setSize(appMainSize.width, appMainSize.height);
                }
                
                /* Not needed anymore
                if (orderPad) {
                    getOrdPadCol(orderPad, orderPad.getWidth());
                }
                */
            } else {
                for (var i = 0; i < me.comp.length; i++) {
                    var comp = me.comp[i];
                    msgutil.reposition(comp);
                }

                for (var i = 0; i < me.notComp.length; i++) {
                    var nCmp = me.notComp[i];
                    msgutil.reposition(nCmp);
                }
                
                /* Not needed anymore
                if (orderPad) {
                    getOrdPadCol(orderPad, orderPad.getWidth() - orderPad.trdForm.down('#msgBox').ownerCt.getWidth());
                }
                */
            }
        }

        Ext.WindowManager.each(function(win) {
            if (win.winType == 'popup') {
                msgutil.reposition(win);
            }
        });
    },
    resetScale: function() {
        var viewport = document.getElementById('app-viewport');
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0');
    },
    _createViewLinks: function() {
        var html = '';

        if (isMobile) {
            html = '<span class="activeview">' + languageFormat.getLanguage(10033, 'Mobile Version') + '</span> | <span onclick="runSwitchView(1);" class="altview">' + languageFormat.getLanguage(10032, 'Desktop Version') + '</span>';
        } else {
            html = '<span onclick="runSwitchView(0);" class="altview">' + languageFormat.getLanguage(10033, 'Mobile Version') + '</span> | <span class="activeview">' + languageFormat.getLanguage(10032, 'Desktop Version') + '</span>';
        }

        var logoStyle = '';
        if (isMobile && N2N_CONFIG.footerLogo != '') {
            logoStyle = "text-align:right; background-image: url('" + N2N_CONFIG.footerLogo + "');";
        } else {
            logoStyle = 'text-align:center';
        }

        return '<div class="viewversion" style="' + logoStyle + '">' + html + '</div>';
    },
    setMinMaxSize: function() {
        var me = this;

        var bodySize = Ext.getBody().getViewSize();
        me.minWidth = bodySize.width;
        me.maxWidth = bodySize.width;
        if (bodySize.height > me._minHeight) {
            me.maxHeight = bodySize.height;
            me.minHeight = bodySize.height;
        } else {
            me.maxHeight = me._minHeight;
            me.minHeight = me._minHeight;
        }
        bodySize.height = me.minHeight;

        return bodySize;
    },
    isActiveItem: function(comp) {
        if (comp) {
            var me = this;
            var activeItem;

            if (me._activeItem != null) {
                activeItem = Ext.ComponentManager.get(me._activeItem);
            }
            if (!activeItem) {
                activeItem = quoteScreen;
                me._activeItem = quoteScreen.getId();
            }

            if (comp.id == me._activeItem) {
                return true;
            } else {
                return false;
            }
        }

        return false;
    },
    toggleFullMenu: function(state) {
        this.compRef.menuBtn.toggle(state);
    },
    plainMenu: function(menus) {
        var me = this;

        me.toggleFullMenu(false);

        if (!me.compRef.plainMenu || !me.compRef.plainMenuStore) {
            me.compRef.plainMenuStore = Ext.create('Ext.data.Store', {
                fields: ['menulabel', 'fn'],
                data: menus
            });

            me.compRef.plainMenu = me.addItem({
                type: 'containter',
                border: false,
                baseCls: '',
                cls: 'menu_ct',
                autoScroll: true,
                items: {
                    xtype: 'dataview',
                    tpl: [
                        '<tpl for=".">',
                        '<div class="plainmenu"<tpl if="fn!=null"> onclick="n2nLayoutManager.compRef.plainMenu.collapse();{fn}"</tpl>>',
                        '<div class="subicon {iconCls}"></div>',
                        '<div class="sublabel">{menulabel}</div>',
                        '</div>',
                        '</tpl>'
                    ],
                    store: me.compRef.plainMenuStore,
                    itemSelector: 'div.plainmenu'
                            /*
                             listeners: {
                             itemclick: function(thisView, record) {
                             if (me.debug) {
                             console.log('plainMenu select...');
                             console.log(record);
                             }
                             var menuFn = record.get('fn');
                             var onClick = record.get('onclick');
                             
                             me.compRef.plainMenu.collapse();
                             if (!onClick && typeof menuFn === 'function') {
                             // run the function
                             menuFn(record.get('param'));
                             }
                             }
                             }
                             */
                },
                mConfig: {
                    notComp: true,
                    border: false,
                    style: 'border-width:0;padding:0;',
                    // collapseDirection: 'left'
                    listeners: {
                        expand: function(thisComp) {
                            // fix height when expanding plain menu
                            var appMainHeight = me.getAppMain().getHeight();
                            if (thisComp.getHeight() != appMainHeight) {
                                thisComp.setHeight(appMainHeight);
                            }
                        }
                    }
                }
            });
        } else {
            me.compRef.plainMenuStore.loadData(menus);
            me.compRef.plainMenu.toFront();
            me.compRef.plainMenu.expand();
        }

    },
    saveConfiguredTab: function(tabId, comp, compKey) {
        // deprecated
        /*
        var me = this;
        
        if (me._allowSaveLayout) {
            if (screenSet) {
                msgutil.alert(languageFormat.getLanguage(31120, 'This screen is already set.'));
                screenSet = false;
            } else {
                if (tabId) {
                    me.lyConf.setScreen(tabId, comp);
                }

                n2ncomponents.requestSaveLayout();
            }
        }
        */
    },
    loadConfiguredTab: function(skipPopup) {
        var me = this;
        
        for (var tabId in me.lyConf.cfScr) {
            var isLyScr = false; // whether this screen belongs to the current layout
            if (isMobile) {
                if (tabId === 'am') {
                    var cfScr = me.lyConf.getScreen(tabId);
                    var emptyHome = true;
                    for (var s in cfScr) {
                        var scr = cfScr[s];
                        if (me.getFeatureStatus(scr.comp)) {
                        n2ncomponents.loadScreen(tabId, scr.comp, scr.key, getMappedStockName(scr.stkname));
                        me.setLoading(false);
                        emptyHome = false;
                    }
                    }
                    if (emptyHome) {
                        me.hardsettHomeScreen();
                    }
                }
            } else {
                if (me.isWindowLayout()) {
                    isLyScr = me._wTabList.indexOf(tabId) > -1;
                } else if (me.isTabLayout()) {
                    isLyScr = me._tTabList.indexOf(tabId) > -1;
                }
                
                if (isLyScr) {
                    if (me.compRef[tabId] && !me.compRef[tabId].isHidden()) {
                        var cfScr = me.lyConf.getScreen(tabId);
                        me.createBufferTabs(tabId, cfScr);
                    } else if (tabId === 'p') {
                        if (!skipPopup) {
                            me.loadConfiguredPopup();
                        }
                }
            }
        }
        }
    },
    loadConfiguredPopup: function() {
        var me = this;
        
        var cfScr = me.lyConf.getScreen('p');
        for (var s in cfScr) {
            var scr = cfScr[s];
            if (me.getFeatureStatus(scr.comp)) {
                if (scr.comp === 'wl') {
                    // check max opening watchlist
                    if (!watchlistDetector.add(scr.key, true)) {
                        // remove screen from config
                        me.lyConf.removeScreen('p', scr.comp, scr.key);
                        continue;
                    }
                }
                 
                var extConf = {};
                if (scr.width) {
                    extConf.width = scr.width;
                }
                if (scr.height) {
                    extConf.height = scr.height;
                }
                if (scr.x != null) {
                    extConf.x = scr.x;
                }
                if (scr.y != null) {
                    extConf.y = scr.y;
                }
                n2ncomponents.loadScreen('p', scr.comp, scr.key, getMappedStockName(scr.stkname), null, {
                    winConfig: extConf
                });
            }
        }
    },
    _getTabConfig: function(extraConf) {
        var me = this;

        var tConf = {
            closable: true,
            layout: 'fit',
            border: false,
            autoShow: true,
            height: '100%',
            width: '100%',
            cls: 'buffer compresize',
            listeners: {
                afterrender: function(thisComp) {
                    me.tabExtraButtons(thisComp);
                },
                render: function(thisComp) {
                    me.initializeCompDragZone(thisComp);
                },
                close: function(thisTab) {
                    if (!thisTab._secondCloseEvent) {
                        // remove previous screen config
                        me.lyConf.removeScreen(thisTab.mt, thisTab.type, thisTab.key);
                    }
                }
            }
        };

        return Ext.apply(tConf, extraConf);
    },
    tabExtraButtons: function(thisComp) {
        var me = this;
        var comp = thisComp.getComponent(0);

        if (thisComp.tab.el) {
            thisComp.tab.el.on({
                scope: thisComp,
                dblclick: function() {
                    me._toPopup(this);
                },
                click: function() {
                    if (typeof thisComp.delayedFn === 'function') {
                        thisComp.delayedFn();
                        thisComp.delayedFn = null;
                    }
                }
            });
        }

        /*
         // creates a popup button
         var popupBtn = thisComp.tab.closeEl.insertSibling('<span class="x-tab-popup-btn">Pop up</span>');
         // adds event to popup button
         popupBtn.on({
         scope: thisComp,
         click: function() {
         me._toPopup(this);
         }
         });
         */
        // adds a popup button to toolbar
        me.addExtraButtons(comp, thisComp);
        
        me._recreatePicker(comp);
    },
    addExtraButtons: function(comp, tab) {
        var me = this;
        
        if (comp) {
            if (comp.getDockedItems || comp._topBar_) {
                var dockedItems = [];
                if (comp._topBar_) {
                    dockedItems = [comp._topBar_];
                } else {
                    dockedItems = comp.getDockedItems('toolbar[dock="top"]', true);
                }
                
                if (dockedItems.length > 0) {
                    var compTbar = dockedItems[0];
                    if (compTbar.isHidden()) {
                        comp.hiddenTbar = compTbar;
                        comp.hiddenTbar.show();
                    }
                    
                    
                    // sync checkbox
                    /*
                    if(syncGroupManager.isSyncComp(comp.type) && !comp.syncCb){
                        comp.syncCb = compTbar.add({
                           xtype: 'checkbox',
                           style: 'margin-right: 8px',
                           checked: syncCompList.exist(comp.type),
                           syncType: comp.type,
                           screenType: comp.screenType,
                           handler: function(thisCb, value){
                               updateSyncList(thisCb.syncType, value);
                           },
                           listeners: me.syncCbListener()
                        });
                    }
                    */
                    
                    // sync group
                    if (syncGroupManager.isSyncComp(comp.type) && !comp.syncCombo) {
                        comp.syncCombo = compTbar.add({
                            xtype: 'colorcombo',
                            style: 'margin-right:8px;width:24px;',
                            syncType: comp.type,
                            screenType: comp.screenType,
                            value: syncGroupManager.getSyncGroup(comp.type)
                        });
                    }
                    
                    // popup button
                    if (!comp.popupBtn) {
                        comp.popupBtn = compTbar.add({
                            iconCls: 'icon-popup',
                            tooltip: languageFormat.getLanguage(21147,'Pop up this tab'),
                            overflowText: languageFormat.getLanguage(21147,'Pop up this tab'),
                            handler: function() {
                                me._toPopup(tab);
                            }
                        });
                    }
                    
                    // maximize button
                    if (N2N_CONFIG.allowMax && !comp.maxBtn && !comp.noMaxBtn) {
                        comp.maxBtn = compTbar.add({
                            iconCls: 'icon-maximize',
                            tooltip: languageFormat.getLanguage(21148,'Maximize this tab'),
                            overflowText: languageFormat.getLanguage(21148,'Maximize this tab'),
                            handler: function() {
                                me._toPopup(tab, true);
                            }
                        });
                    }
                }
            }
            
            // extra button index
            var btnIdx = 0;
            var createBtn1 = N2N_CONFIG.allowMax && !comp.maxBtn && !comp.noMaxBtn;
            if (!createBtn1) {
                btnIdx = 1;
            }
            
            var compEl;
            var extraNum = 0;
            /*
            if (syncGroupManager.isSyncComp(comp.type) && !comp.syncCb) {
                compEl = tab.getEl();

                if (compEl) {
                    var syncBtnEl = Ext.DomHelper.append(compEl, {tag: 'div', cls: 'extrabtn sync_ct'});

                    tab.syncCb = Ext.create('Ext.form.field.Checkbox', {
                        checked: syncCompList.exist(comp.type),
                        screenType: comp.screenType,
                        syncType: comp.type,
                        handler: function(thisCb, value) {
                            updateSyncList(thisCb.syncType, value);
                        },
                        renderTo: syncBtnEl,
                        listeners: me.syncCbListener()
                    });
                }
            }
            */
            
            if (syncGroupManager.isSyncComp(comp.type) && !comp.syncCombo) {
                compEl = tab.getEl();

                if (compEl) {
                    var syncBtnEl = Ext.DomHelper.append(compEl, {tag: 'div', cls: 'extrabtn sync_ct'}, true);

                    comp.syncCombo = Ext.create('widget.colorcombo', {
                        renderTo: syncBtnEl,
                        xtype: 'colorcombo',
                        style: 'width:24px;',
                        syncType: comp.type,
                        screenType: comp.screenType,
                        value: syncGroupManager.getSyncGroup(comp.type)
                    });
                    
                    extraNum++;
                }
            }
            
            //CREATE NEW SYNC GROUP FOR MUTUAL FUND.
            
            if (!comp.popupBtn) {
                compEl = compEl || tab.getEl();

                if (compEl) {
                    var popupBtnEl = Ext.DomHelper.append(compEl, {tag: 'div', cls: 'extrabtn btn' + btnIdx++}, true);

                    comp.popupBtn = Ext.create('Ext.button.Button', {
                        iconCls: 'icon-popup',
                        tooltip: languageFormat.getLanguage(21147,'Pop up this tab'),
                        cls: 'fix_btn',
                        handler: function() {
                            me._toPopup(tab);
                        },
                        renderTo: popupBtnEl
                    });
                    
                    extraNum++;
                }
            }
            
            if (createBtn1) {
                compEl = compEl || tab.getEl();

                if (compEl) {
                    var maxBtnEl = Ext.DomHelper.append(compEl, {tag: 'div', cls: 'extrabtn btn' + btnIdx}, true);

                    comp.maxBtn = Ext.create('Ext.button.Button', {
                        iconCls: 'icon-maximize',
                        tooltip: languageFormat.getLanguage(21148,'Maximize this tab'),
                        cls: 'fix_btn',
                        handler: function() {
                            me._toPopup(tab, true);
                        },
                        renderTo: maxBtnEl
                    });
                    
                    extraNum++;
                }
            }
            
            if (extraNum > 1 && (comp.lessBtn || comp.iframeScroll)) {
                var extraCls = extraNum > 2 ? 'menu-ct-left0': 'menu-ct-left1';
                
                if (comp.syncCombo) {
                    comp.syncCombo.renderTo.hide();
                }
                if (comp.popupBtn) {
                    comp.popupBtn.renderTo.hide();
                }
                if (comp.maxBtn) {
                    comp.maxBtn.renderTo.hide();
                }

                var menuBtnEl = Ext.DomHelper.append(compEl, {tag: 'div', cls: 'extrabtn menu-ct menu-ct-right'}, true);

                comp.menuBtn = Ext.create('Ext.button.Button', {
                    iconCls: 'x-tbar-page-prev',
                    tooltip: '',
                    cls: 'fix_btn',
                    _btnStatus: false,
                    // style: 'background-color: transparent; border:none',
                    handler: function(thisBtn) {
                        thisBtn._btnStatus = !thisBtn._btnStatus;

                        if (thisBtn._btnStatus) {
                            thisBtn.setIconCls('x-tbar-page-next');
                            
                            if (comp.syncCombo) {
                                comp.syncCombo.renderTo.show();
                            }
                            if (comp.popupBtn) {
                                comp.popupBtn.renderTo.show();
                            }
                            if (comp.maxBtn) {
                                comp.maxBtn.renderTo.show();
                            }
                            
                        } else {
                            thisBtn.setIconCls('x-tbar-page-prev');
                            
                            if (comp.syncCombo) {
                                comp.syncCombo.renderTo.hide();
                            }
                            if (comp.popupBtn) {
                                comp.popupBtn.renderTo.hide();
                            }
                            if (comp.maxBtn) {
                                comp.maxBtn.renderTo.hide();
                            }
                        }

                        if (thisBtn._btnStatus) {
                            thisBtn.renderTo.addCls(extraCls);
                            thisBtn.renderTo.removeCls('menu-ct-right');
                            thisBtn.renderTo.removeCls('menu-ct');
                        } else {
                            thisBtn.renderTo.addCls('menu-ct-right');
                            thisBtn.renderTo.removeCls(extraCls);
                            thisBtn.renderTo.addCls('menu-ct');
                        }

                    },
                    renderTo: menuBtnEl
                });

            }
            
        }
    },
    _getWinConfig: function(item, extraConf) {
        var wConf = {
            items: item,
            layout: 'fit',
            constrain: true,
            autoShow: true,
            n2nType: item.type,
            n2nName: item.n2nName,
            type: item.type,
            savingComp: item.savingComp,
            key: item.key,
            keyEnabled: item.keyEnabled,
            stkname: item.stkname,
            mt: isMobile ? 'am' : 'p',
            screenType: item.screenType,
            collapsible: true
        };
        
        return Ext.apply(wConf, extraConf);
    },
    featureStatus: {}, // for caching
    getFeatureStatus: function(featureType) {
        var me = this;
        var status = true; // temporarily set to true until all features checking added

        if (me.featureStatus[featureType] != null) {
            return me.featureStatus[featureType];
        }

        switch (featureType) {
            case 'si':
                status = showStkInfoHeader == "TRUE" && showStkInfoStkInfo == "TRUE";
                break;
            case 'gn':
                status = showNewsHeader == "TRUE" && showNewsAnnouncements == "TRUE";
                break;
            case 'tc':
                status = N2N_CONFIG.tradeCal;
                break;
        }

        // cache
        me.featureStatus[featureType] = status;

        return status;
    },
    createBufferTabs: function(tabId, cfScr, checkExist) {
        var me = this;

        if (me.compRef[tabId]) {
            var scrTab = [];
            for (var s in cfScr) {
                if (me.lyConf.isLayoutKey(s)) {
                    if ((checkExist && me.screenExist(cfScr[s].comp, cfScr[s].key))) {
                        // removes existing from screen config
                        me.lyConf.removeScreen(tabId, cfScr[s].comp, cfScr[s].key);
                        continue;
                    }
                    if (me.getFeatureStatus(cfScr[s].comp)) {
                        if (cfScr[s].comp === 'wl') {
                            // check max opening watchlist
                            if (!watchlistDetector.add(cfScr[s].key, true)) {
                                // remove screen from config
                                me.lyConf.removeScreen(tabId, cfScr[s].comp, cfScr[s].key);
                                continue;
                            }
                        }
                        
                    var bTab = me._getTabConfig({
                        title: n2ncomponents.getScreenTitle(cfScr[s]),
                        isBufferredTab: true,
                        mt: tabId,
                        type: cfScr[s].comp,
                        savingComp: cfScr[s].savingComp,
                        keyEnabled: cfScr[s].keyEnabled,
                        key: cfScr[s].key,
                        stkname: getMappedStockName(cfScr[s].stkname)
                    });

                    scrTab.push(bTab);
                }
            }
            }
            
            if (scrTab.length > 0) {
                // add buffer tabs
                me.compRef[tabId].add(scrTab);
                me._createTabInitDragZone(me.compRef[tabId]);
            }
            
        }
        
    },
    activateBuffer: function(type, key, stkname) {
        var me = this;
        
        var mt = ['mt', 'mt2', 'mt3', 'mt4', 'mt5', 'mt6', 'mt7', 'mt8', 'mt9', 'mt10', 'mt11', 'mt12', 'mt13'];
        for (var i = 0; i < mt.length; i++) {
            if (me.compRef[mt[i]] && !me.compRef[mt[i]].isHidden()) {
                var comp = me.compRef[mt[i]].items.items; // get all tabs
                for (var t = 0; t < comp.length; t++) {
                    var tab = comp[t];
                    if ((tab.isBufferredTab || tab.isPendingTab) && type == tab.type && (type!='wl' || key == tab.key)) {
                        if (type != 'wl') {
                            if (key) {
                                tab.key = key;
                            }
                            if (stkname) {
                                tab.stkname = stkname;
                            }
                        }
                        
                        if (tab.isPendingTab && typeof(tab.delayedFn) === 'function') {
                            tab.delayedFn();
                            tab.delayedFn = null;
                        }
                        
                        me.compRef[mt[i]].setActiveTab(tab);
                        
                        return true;
                    }
                }
            }
        }
        
        return false;

    },
    screenExist: function(type, key) {
        var me = this;

        var mt = ['mt', 'mt2', 'mt3', 'mt4', 'mt5', 'mt6', 'mt7', 'mt8', 'mt9', 'mt10', 'mt11', 'mt12', 'mt13'];
        for (var i = 0; i < mt.length; i++) {
            if (me.compRef[mt[i]] && !me.compRef[mt[i]].isHidden()) {
                var comp = me.compRef[mt[i]].items.items; // get all tabs
                for (var t = 0; t < comp.length; t++) {
                    var tab = comp[t];
                    if (type == tab.type && (type != 'wl' || key == tab.key)) {
                        return true;
                    }
                }
            }
        }
        
        // check popup
        var popups = me.lyConf.getScreen('p');
        for (var k in popups) {
            var p = popups[k];
            if (type == p.comp && (type != 'wl' || key == p.key)) {
                return true;
            }
        }

        return false;
    },
    backupLayout: function() {
        var me = this;
        me.prevLayoutStr = me.lyConf.toString();
    },
    removeBackupLayout: function() {
        this.prevLayoutStr = null;
    },
    restorePreviousLayout: function() {
        var me = this;

        if (me.prevLayoutStr) {
            me.loadLayout(null, me.prevLayoutStr, function() {
                me.removeBackupLayout();
                me.loadConfiguredPopup();
                n2ncomponents.runAllBufferTasks();
                me.activateAllScreens();
            });
        }
    },
    loadLayout: function(layoutId, layoutStr, callback) {
        var me = this;
        // clean current layouts
        me.remove(me.appMain);
        // clear opening watchlist
        watchlistDetector.clear();
        // clean popup
        me.cleanPopups();
        // reset active key screen
        focusManager.resetActiveKeyScreen();
        me.comp = [];
        n2ncomponents.clearAllBufferTasks();
        // remove previous popup dropzone
        if (me.dropZone) {
            me.dropZone.destroy();
        }
        // reactivate sync group for layout
        syncGroupManager.activateProfileItems();
        
        // get layout string for selected layout in current profile
        layoutStr = layoutStr || layoutProfileManager.getProfileLayout(layoutProfileManager.getActiveProfile(), layoutId);
        // create new layout object from string
        me.lyConf = new LayoutConfig(layoutStr);
        me.prepareLayouts();
        
        me.add(me.appMain);
        
        var codeList = me.lyConf.codeList;
        var newList = [];
        // load only non-existing stock names
        for (var i = 0; i < codeList.length; i++) {
            var stkCode = codeList[i];
            if (!mappedList[stkCode]) {
                newList.push(stkCode);
            }
        }
        
        if (newList.length > 0) {
            conn.getSimpleStockList({
                list: newList,
                col: [fieldStkCode, fieldStkName],
                success: function(data) {
                    if (data && data.d) {
                        for (var i in data.d) {
                            var dataObj = data.d[i];
                            mappedList[dataObj[fieldStkCode]] = dataObj[fieldStkName];
                        }
                    }

                    me.loadConfiguredTab(true);
                    
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            });
        } else {
            me.loadConfiguredTab(true);
            
            if (typeof callback === 'function') {
                callback();
            }
        }

    },
    changeLayoutProfile: function(profile) {
        var me = this;
        
        if (profile !== layoutProfileManager.getActiveProfile()) {
            // save current profile if needed
            if (n2nLayoutManager.lyConf.shouldSave()) {
                layoutProfileManager.requestSaveProfileLayout();
            }

            layoutProfileManager.setActiveProfile(profile);
            layoutProfileManager.loadProfileSettings(function() {
                var layoutStr = layoutProfileManager.getActiveLayout();

                me.loadLayout(null, layoutStr, function() {
                    me.loadConfiguredPopup();
                    n2ncomponents.runAllBufferTasks();
                    me.activateAllScreens();

                    // save active profile
                    layoutProfileManager.saveLayoutPreference();
                });
            });
        }

    },
    activateAllScreens: function() {
        var me = this;

        me.activateAllTabs();
        me.activateWlTabs();
        me.setFirstActive();
    },
    createSplitScreen: function(splitOpt) {
        return; // deprecated
        
        var me = this;
        
        helper.show(me.compRef.mainCt1);
        helper.show(me.compRef.mt);
        switch (splitOpt) {
            case '2': // 1 right
                helper.hide(me.compRef.mt3);

                helper.show(me.compRef.mainCt2);
                helper.show(me.compRef.mt2);
                helper.hide(me.compRef.mt4);
                
                helper.hide(me.compRef.mainCt3);
                helper.hide(me.compRef.mt5);
                helper.hide(me.compRef.mt6);
                
                helper.hide(me.compRef.mainCt4);
                helper.hide(me.compRef.mt7);
                helper.hide(me.compRef.mt8);
                break;
            case '3': // 1 bottom
                helper.show(me.compRef.mt3);

                helper.hide(me.compRef.mainCt2);
                helper.hide(me.compRef.mt2);
                helper.hide(me.compRef.mt4);
                
                helper.hide(me.compRef.mainCt3);
                helper.hide(me.compRef.mt5);
                helper.hide(me.compRef.mt6);
                
                helper.hide(me.compRef.mainCt4);
                helper.hide(me.compRef.mt7);
                helper.hide(me.compRef.mt8);
                break;
            case '4': // 4
                helper.show(me.compRef.mt3);

                helper.show(me.compRef.mainCt2);
                helper.show(me.compRef.mt2);
                helper.show(me.compRef.mt4);
                
                helper.hide(me.compRef.mainCt3);
                helper.hide(me.compRef.mt5);
                helper.hide(me.compRef.mt6);
                
                helper.hide(me.compRef.mainCt4);
                helper.hide(me.compRef.mt7);
                helper.hide(me.compRef.mt8);
                break;
            case '5': 
                helper.hide(me.compRef.mt3);

                helper.show(me.compRef.mainCt2);
                helper.show(me.compRef.mt2);
                helper.show(me.compRef.mt4);
                
                helper.hide(me.compRef.mainCt3);
                helper.hide(me.compRef.mt5);
                helper.hide(me.compRef.mt6);
                
                helper.hide(me.compRef.mainCt4);
                helper.hide(me.compRef.mt7);
                helper.hide(me.compRef.mt8);
                break;
            case '6': 
                helper.show(me.compRef.mt3);

                helper.show(me.compRef.mainCt2);
                helper.show(me.compRef.mt2);
                helper.show(me.compRef.mt4);
                
                helper.show(me.compRef.mainCt3);
                helper.show(me.compRef.mt5);
                helper.show(me.compRef.mt6);
                
                helper.hide(me.compRef.mainCt4);
                helper.hide(me.compRef.mt7);
                helper.hide(me.compRef.mt8);
                break;
            case '7': 
            	helper.hide(me.compRef.mt3);

                helper.show(me.compRef.mainCt2);
                helper.show(me.compRef.mt2);
                helper.hide(me.compRef.mt4);
                
                helper.show(me.compRef.mainCt3);
                helper.show(me.compRef.mt5);
                helper.hide(me.compRef.mt6);
                
                helper.hide(me.compRef.mainCt4);
                helper.hide(me.compRef.mt7);
                helper.hide(me.compRef.mt8);
                break;
            case '8': 
            	helper.hide(me.compRef.mt3);

                helper.show(me.compRef.mainCt2);
                helper.show(me.compRef.mt2);
                helper.hide(me.compRef.mt4);
                
                helper.show(me.compRef.mainCt3);
                helper.show(me.compRef.mt5);
                helper.show(me.compRef.mt6);
                
                helper.hide(me.compRef.mainCt4);
                helper.hide(me.compRef.mt7);
                helper.hide(me.compRef.mt8);
                break;
            case '9': 
            	helper.hide(me.compRef.mt3);

                helper.show(me.compRef.mainCt2);
                helper.show(me.compRef.mt2);
                helper.show(me.compRef.mt4);
                
                helper.show(me.compRef.mainCt3);
                helper.show(me.compRef.mt5);
                helper.show(me.compRef.mt6);
                
                helper.hide(me.compRef.mainCt4);
                helper.hide(me.compRef.mt7);
                helper.hide(me.compRef.mt8);
                break;
            case '10': 
                helper.show(me.compRef.mt3);

                helper.show(me.compRef.mainCt2);
                helper.show(me.compRef.mt2);
                helper.show(me.compRef.mt4);
                
                helper.show(me.compRef.mainCt3);
                helper.show(me.compRef.mt5);
                helper.show(me.compRef.mt6);
                
                helper.show(me.compRef.mainCt4);
                helper.show(me.compRef.mt7);
                helper.show(me.compRef.mt8);
                break;
            case '11': 
            	helper.hide(me.compRef.mt3);

                helper.show(me.compRef.mainCt2);
                helper.show(me.compRef.mt2);
                helper.show(me.compRef.mt4);
                
                helper.show(me.compRef.mainCt3);
                helper.show(me.compRef.mt5);
                helper.show(me.compRef.mt6);
                
                helper.show(me.compRef.mainCt4);
                helper.show(me.compRef.mt7);
                helper.hide(me.compRef.mt8);
                break;
            case '12': 
            	helper.show(me.compRef.mt3);

                helper.show(me.compRef.mainCt2);
                helper.show(me.compRef.mt2);
                helper.hide(me.compRef.mt4);
                
                helper.show(me.compRef.mainCt3);
                helper.show(me.compRef.mt5);
                helper.hide(me.compRef.mt6);
                
                helper.show(me.compRef.mainCt4);
                helper.show(me.compRef.mt7);
                helper.show(me.compRef.mt8);
                break;
            case '13': 
            	helper.hide(me.compRef.mt3);

                helper.show(me.compRef.mainCt2);
                helper.show(me.compRef.mt2);
                helper.hide(me.compRef.mt4);
                
                helper.show(me.compRef.mainCt3);
                helper.show(me.compRef.mt5);
                helper.hide(me.compRef.mt6);
                
                helper.show(me.compRef.mainCt4);
                helper.show(me.compRef.mt7);
                helper.hide(me.compRef.mt8);
                break;
            case '14':
                helper.hide(me.compRef.mt3);

                helper.hide(me.compRef.mainCt2);
                helper.hide(me.compRef.mt2);
                helper.hide(me.compRef.mt4);

                helper.hide(me.compRef.mainCt3);
                helper.hide(me.compRef.mt5);
                helper.hide(me.compRef.mt6);

                helper.show(me.compRef.mainCt4);
                helper.show(me.compRef.mt7);
                helper.show(me.compRef.mt8);
                helper.show(me.compRef.mt9);

                helper.hide(me.appMainNorth);
                helper.hide(me.compRef.mt10);
                helper.hide(me.compRef.mt11);
                helper.hide(me.compRef.mt12);
                helper.hide(me.compRef.mt13);
                break;
            case '15':
                helper.hide(me.compRef.mt3);

                helper.show(me.compRef.mainCt2);
                helper.show(me.compRef.mt2);
                helper.show(me.compRef.mt4);

                helper.hide(me.compRef.mainCt3);
                helper.hide(me.compRef.mt5);
                helper.hide(me.compRef.mt6);

                helper.hide(me.compRef.mainCt4);
                helper.hide(me.compRef.mt7);
                helper.hide(me.compRef.mt8);

                helper.show(me.appMainNorth);
                helper.show(me.compRef.mt10);
                helper.show(me.compRef.mt11);
                helper.show(me.compRef.mt12);
                helper.show(me.compRef.mt13);
                break;
            case '16':
                helper.show(me.compRef.mt3);

                helper.hide(me.compRef.mainCt2);
                helper.hide(me.compRef.mt2);
                helper.hide(me.compRef.mt4);

                helper.hide(me.compRef.mainCt3);
                helper.hide(me.compRef.mt5);
                helper.hide(me.compRef.mt6);

                helper.hide(me.compRef.mainCt4);
                helper.hide(me.compRef.mt7);
                helper.hide(me.compRef.mt8);

                helper.show(me.appMainNorth);
                helper.show(me.compRef.mt10);
                helper.hide(me.compRef.mt11);
                helper.hide(me.compRef.mt12);
                helper.hide(me.compRef.mt13);
                break;
            default: // no split
                helper.hide(me.compRef.mt3);
                helper.hide(me.compRef.mainCt2);
                helper.hide(me.compRef.mt2);
                helper.hide(me.compRef.mt4);
                helper.hide(me.compRef.mainCt3);
                helper.hide(me.compRef.mt5);
                helper.hide(me.compRef.mt6);
                helper.hide(me.compRef.mainCt4);
                helper.hide(me.compRef.mt7);
                helper.hide(me.compRef.mt8);
        }

        // me.lyConf.setSubLayout(splitOpt);
        // me.saveConfiguredTab();
    },
    resetSplitScreen: function() {
        var me = this;
        var visibleMt = !me.lyConf.getScreenHidden('mt');
        var visibleMt2 = !me.lyConf.getScreenHidden('mt2');
        var visibleMt3 = !me.lyConf.getScreenHidden('mt3');
        var visibleMt4 = !me.lyConf.getScreenHidden('mt4');
        var visibleMt5 = !me.lyConf.getScreenHidden('mt5');
        var visibleMt6 = !me.lyConf.getScreenHidden('mt6');
        var visibleMt7 = !me.lyConf.getScreenHidden('mt7');
        var visibleMt8 = !me.lyConf.getScreenHidden('mt8');

        helper.setVisible(me.compRef.mt, visibleMt);
        helper.setVisible(me.compRef.mt2, visibleMt2);
        helper.setVisible(me.compRef.mt3, visibleMt3);
        helper.setVisible(me.compRef.mt4, visibleMt4);
        helper.setVisible(me.compRef.mt5, visibleMt5);
        helper.setVisible(me.compRef.mt6, visibleMt6);
        helper.setVisible(me.compRef.mt7, visibleMt7);
        helper.setVisible(me.compRef.mt8, visibleMt8);
        helper.setVisible(me.compRef.mainCt1, visibleMt || visibleMt3);
        helper.setVisible(me.compRef.mainCt2, visibleMt2 || visibleMt4);
        helper.setVisible(me.compRef.mainCt3, visibleMt5 || visibleMt6);
        helper.setVisible(me.compRef.mainCt4, visibleMt7 || visibleMt8);
    },
    getConfigureTool: function(pId) { // for window layout only
        var me = this;
        var configTool;
        
        /*
        if (N2N_CONFIG.configScreen) {
            configTool = {
                items: [
                    {
                        xtype: 'tbfill'
                    },
                    {
                        xtype: 'container',
                        items: {
                            xtype: 'button',
                            pId: pId,
                            tooltip: touchMode ? '' : languageFormat.getLanguage(31113, 'Set default screen for this tab'),
                            menu: [],
                            handler: function(thisBtn) {
                                var splMenu = n2ncomponents.getScreenList(thisBtn.pId);
                                // adds split screen option menu
                                splMenu.push('-');
                                splMenu = splMenu.concat(n2ncomponents.getSplitOptions());
                                thisBtn.setMenu(splMenu);
                                thisBtn.showMenu();
                            }
                        }
                    }
                ]
            };
        }
        */
        configTool = {
            cls: 'dropbarsection toptab',
            items: [
                {
                    xtype: 'tbfill'
                },
                {
                    xtype: 'container',
                    items: {
                        xtype: 'tool',
                        type: 'close',
                        pId: pId,
                        tooltip: 'Close this section',
                        style: 'margin-top: 3px; margin-right: 2px',
                        hidden: !N2N_CONFIG.configScreen,
                        listeners: {
                            click: function(thisBtn) {
                                if (jsutil.toBoolean(global_noAsk)) {
                                    me.closeSection(thisBtn.pId);
                                    me.setSucceedingActive(thisBtn.pId);
                                } else {
                                    var noAskCb = Ext.create('Ext.form.field.Checkbox', {
                                        boxLabel: languageFormat.getLanguage(10040, 'Do not ask me again')
                                    });
                                    var closeMsg = msgutil.popup({
                                        title: global_popUpMsgTitle,
                                        width: 350,
                                        items: {
                                            style: 'padding: 5px',
                                            items: [
                                                {
                                                    xtype: 'container',
                                                    html: languageFormat.getLanguage(21142, 'You are about to close this section. To restore sections,<br/>please go to Settings > Layout and choose layout option.<br/>Close this section?')
                                                },
                                                noAskCb,
                                                {
                                                    xtype: 'container',
                                                    style: 'text-align:center!important',
                                                    items: [
                                                        {
                                                            xtype: 'button',
                                                            text: languageFormat.getLanguage(10011, 'Yes'),
                                                            width: 75,
                                                            style: 'margin-right: 6px',
                                                            cls: 'fix_btn',
                                                            handler: function() {
                                                                closeMsg.close();
                                                                me.closeSection(thisBtn.pId);
                                                                me.setSucceedingActive(thisBtn.pId);
                                                                if (noAskCb.getValue()) {
                                                                    global_noAsk = "1";
                                                                    n2ncomponents.requestSaveNoAsk();
                                                                }
                                                            }
                                                        },
                                                        {
                                                            xtype: 'button',
                                                            text: languageFormat.getLanguage(10014, 'No'),
                                                            width: 75,
                                                            cls: 'fix_btn',
                                                            handler: function() {
                                                                closeMsg.close();
                                                            }
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    });
                                }

                            }
                        }
                    }
                }
            ],
            listeners: {
                render: function(thisTabBar) {
                    me.initializeCompDropZone(thisTabBar, thisTabBar.ownerCt);
                },
                beforedestroy: function(thisTabBar) {
                    if (thisTabBar.dropZone) {
                        thisTabBar.dropZone.destroy();
                    }
                }
            }
        };

        return configTool;
    },
    closeSection: function(sectionId) {
        var me = this;
        helper.hide(me.compRef[sectionId]);

        switch (sectionId) {
            case 'mt':
                if (me.compRef.mt3.isHidden()) {
                    me.compRef.mainCt1.hide();
                }
                break;
            case 'mt2':
                if (me.compRef.mt4.isHidden()) {
                    me.compRef.mainCt2.hide();
                }
                break
            case 'mt3':
                if (me.compRef.mt.isHidden()) {
                    me.compRef.mainCt1.hide();
                }
                break
            case 'mt4':
                if (me.compRef.mt2.isHidden()) {
                    me.compRef.mainCt2.hide();
                }
                break
            case 'mt5':
                if (me.compRef.mt6.isHidden()) {
                    me.compRef.mainCt3.hide();
                }
                break
            case 'mt6':
                if (me.compRef.mt5.isHidden()) {
                    me.compRef.mainCt3.hide();
                }
                break;
            case 'mt7':
                if (me.compRef.mt8.isHidden()) {
                    me.compRef.mainCt4.hide();
                }
                break;
            case 'mt8':
                if (me.compRef.mt7.isHidden()) {
                    me.compRef.mainCt4.hide();
                }
                break;
            case 'mt10':
            case 'mt11':
            case 'mt12':
            case 'mt13':
                if (me.compRef.mt10.isHidden() && me.compRef.mt11.isHidden() && me.compRef.mt12.isHidden() && me.compRef.mt13.isHidden()) {
                    me.appMainNorth.hide();
                }
                break;
        }
    },
    getTabConfigureTool: function(tabId) {
        var me = this;

        var tabTool = {
            items: [
                {
                    xtype: 'tbfill'
                },
                {
                    xtype: 'container',
                    items: {
                        xtype: 'button',
                        tooltip: touchMode ? '' : languageFormat.getLanguage(31113, 'Set default screen for this tab'),
                        menu: [],
                        tabId: tabId,
                        handler: function(thisBtn) {
                            var scrList = n2ncomponents.getScreenList(thisBtn.tabId);
                            // adds split screen check menu
                            scrList.push('-', {
                                xtype: 'menucheckitem',
                                text: 'Split screen',
                                checked: jsutil.toBoolean(me.lyConf.getSplitScreen()),
                                checkHandler: function(thisChk, checked) {
                                    // force closing menu since menu won't close on check item case
                                    thisBtn.hideMenu();

                                    if (checked) {
                                        helper.show(me.compRef.mainTab2);
                                    } else {
                                        helper.hide(me.compRef.mainTab2);
                                    }

                                    me.lyConf.setSplitScreen(jsutil.boolToStr(checked, '1', '0'));
                                    // me.saveConfiguredTab();
                                }
                            });

                            thisBtn.setMenu(scrList);
                            thisBtn.showMenu();
                        }
                    }
                }
            ]
        };

        return tabTool;
    },
    getAppLayout: function() {
        return layoutProfileManager.getMainLayout();
    },
    getSubLayout: function() {
        return this.lyConf.getSubLayout();
    },
    getScreenListernerObj: function(ignoreExtra) {
        var me = this;

        var lisObj = {
            beforerender: function(thisComp) {
                if (thisComp.splitter) {
                    // avoid double-clicking spitter to collapse section
                    thisComp.splitter.collapseOnDblClick = false;
                }
            },
            afterrender: me._getActiveScreenHandler(),
            hide: function(thisComp) {
                if (thisComp.items.length > 0) {
                    thisComp.removeAll();
                }
                me.lyConf.setScreenHidden(thisComp.mt, true);
            },
            show: function(thisComp) {
                // hacked here for handling north section
                me.resetNorthFlex(thisComp);
                
                if (thisComp.items.length == 0) {
                    var cfScr = me.lyConf.getScreen(thisComp.mt);
                    me.createBufferTabs(thisComp.mt, cfScr, true);
                    me.activateAllTabs();
                    me.activateWlTabs();

                }
                me.lyConf.setScreenHidden(thisComp.mt, false);
            },
            tabchange: me.tabchangeHandler,
            destroy: function(thisComp) {
                // reset references
                me.compRef[thisComp.mt] = null;
            }
        };

        if (!ignoreExtra) {
            lisObj.resize = function(thisComp, newWidth, newHeight, oldWidth, oldHeight) {
                if (oldWidth) {
                    var compSize;
                    switch (thisComp.mt) {
                        case 'mt3':
                            // save height
                            if (!me.compRef.mt.isHidden() && !me.compRef.mt3.isHidden()) {
                                var appMainHeight = me.appMainCenter.getHeight();
                                compSize = newHeight / appMainHeight;
                            }

                            break;
                        case 'mt4':
                            // save height
                            if (!me.compRef.mt2.isHidden() && !me.compRef.mt4.isHidden()) {
                                var appMainHeight = me.appMainCenter.getHeight();
                                compSize = newHeight / appMainHeight;
                            }

                            break;
                        case 'mt6':
                            // save height
                            if (!me.compRef.mt5.isHidden() && !me.compRef.mt6.isHidden()) {
                                var appMainHeight = me.appMainCenter.getHeight();
                                compSize = newHeight / appMainHeight;
                            }

                            break;
                        case 'mt8':
                            // save height
                            if (!me.compRef.mt7.isHidden() && !me.compRef.mt8.isHidden()) {
                                var appMainHeight = me.appMainCenter.getHeight();
                                compSize = newHeight / appMainHeight;
                            }

                            break;
                        case 'mt11':
                        case 'mt12':
                        case 'mt13':
                            // save width
                            if (me.appMainNorth && !me.appMainNorth.isHidden()) {
                                var appMainWidth = me.appMainNorth.getWidth();
                                compSize = newWidth / appMainWidth;
                            }
                            
                            break;
                        case 'mainTab2': // for tab // might not be used anymore
                            if (newWidth === oldWidth || newHeight === oldHeight) {
                                if (newWidth !== oldWidth) { // width change
                                    var appMainWidth = me.getAppMain().getWidth();
                                    compSize = newWidth / appMainWidth;
                                } else if (newHeight !== oldHeight) { // height change
                                    var appMainHeight = me.getAppMain().getHeight();
                                    compSize = newHeight / appMainHeight;
                                }
                            }

                            break;
                    }

                    if (compSize) {
                        me.lyConf.setScreenSize(thisComp.mt, compSize);
                        // me._allowSaveLayout = true;
                        // me.saveConfiguredTab();
                    }
                }
            };
        }


        return lisObj;
    },
    settingFlex: false,
    resetCtFlex: function() {
        return; // deprecated
        
        var me = this;

        if (!me.settingFlex) {
            me.settingFlex = true;
            var flex = 0.25;
            me.compRef.mainCt1.setFlex(flex);
            me.compRef.mainCt2.setFlex(flex);
            me.compRef.mainCt3.setFlex(flex);
            me.compRef.mainCt4.setFlex(flex);

            me.appMainCenter.updateLayout();
            me.settingFlex = false;
        }
    },
    getMainTabListernerObj: function(ignoreExtra) {
        var me = this;
        var conf = {
            afterrender: function(thisCt) {
                me._fixIframeResize(thisCt);
            },
            show: function() {
                // reset all flexes
                me.resetCtFlex();
            },
            destroy: function(thisComp) {
                me.compRef[thisComp.mct] = null;
            }
        };

        if (!ignoreExtra) {
            conf.resize = function(thisComp, newWidth, newHeight, oldWidth, oldHeight) {
                if (oldWidth) {
                    var compSize;
                    var savingMt;
                    var saveHeight = false;

                    switch (thisComp.mct) {
                        case 'mct2':
                            savingMt = 'mt2';
                            break;
                        case 'mct3':
                            savingMt = 'mt5';
                            break;
                        case 'mct4':
                            savingMt = 'mt7';
                            break;
                        case 'mct5':
                            savingMt = 'mt10';
                            saveHeight = true;
                            break;
                    }

                    if (savingMt) {
                        if (saveHeight) {
                            var appMainHeight = me.getAppMain().getHeight();
                            compSize = newHeight / appMainHeight;
                            me.lyConf.setScreenSize(savingMt, compSize);

                        } else { // save width
                            var appMainWidth = me.appMainCenter.getWidth();
                            compSize = newWidth / appMainWidth;
                            me.lyConf.setScreenSize(savingMt, compSize);
                            // me._allowSaveLayout = true;
                            // me.saveConfiguredTab();
                        }
                    }
                }
            };
        }

        return conf;
    },
    northFlexBeingSet: false,
    resetNorthFlex: function(comp) {
        return; // deprecated
        var me = this;

        if (comp.mt === 'mt10' || comp.mt === 'mt11' || comp.mt === 'mt12' || comp.mt === 'mt13') {
            if (!me.northFlexBeingSet) {
                me.northFlexBeingSet = true;
                var nFlex = 0.25;

                me.compRef.mt10.setFlex(nFlex);
                me.compRef.mt11.setFlex(nFlex);
                me.compRef.mt12.setFlex(nFlex);
                me.compRef.mt13.setFlex(nFlex);
                me.appMainNorth.updateLayout();

                me.northFlexBeingSet = false;
            }
        }
    },
    _getActiveScreenHandler: function() {
        var me = this;

        return function(thisComp) {
            var compTbar = thisComp.getTabBar();
            if (compTbar) {
                var compEl = compTbar.getEl();
                compEl.on('click', function() {
                    me.setActiveScreen(this);
                }, thisComp);
            }

            // add screen layer to highlight when dragging tab over
            var compEl = thisComp.getEl();
            compEl.appendChild({tag: 'div', cls: 'scr-layer'});
            
            me._fixIframeResize(thisComp);
        };
    },
    _prevActiveScreen: null,
    setActiveScreen: function(scrComp) {
        var me = this;

        if (scrComp && me.compRef[me._prevActiveScreen] !== scrComp.mt) {
        me._activeScreen = scrComp.mt;

            if (me._prevActiveScreen) {
                me.compRef[me._prevActiveScreen].removeCls('fixblack');
                me.compRef[me._prevActiveScreen].removeCls('activescreen');
                me.compRef[me._prevActiveScreen].isActiveScreen = false;
            }

        scrComp.addCls('fixblack');
        scrComp.addCls('activescreen');
            scrComp.isActiveScreen = true;

            me._prevActiveScreen = scrComp.mt;
        }
    },
    getActiveScreen: function() {
        var me = this;

        if (me.compRef[me._activeScreen]) {
            if (me.compRef[me._activeScreen].isHidden() && me.isWindowLayout()) {
                me.setSucceedingActive(me._activeScreen);
            }

            return me._activeScreen;
        }

        return null;
    },
    tabchangeHandler: function(thisTp, newTab, oldTab) {
        var comp;

        if (newTab.isBufferredTab) {
            // load buffer tab
            n2ncomponents.loadScreen(newTab.mt, newTab.type, newTab.key, getMappedStockName(newTab.stkname), newTab);

            // clear buffer config
            newTab.isBufferredTab = false;

            // adds popup button
            comp = newTab.getComponent(0);
            n2nLayoutManager.addExtraButtons(comp, newTab);
        }

        if (!comp) {
            comp = newTab.getComponent(0);
        }
        
        // adjust grid column
        if (comp) {
            // keep activated item
            if (comp.screenType == 'main' && !comp.ignoredScreen) {
                var activeId = comp.getId();
                if (n2nLayoutManager.debug) {
                    console.log('N2NLayoutManager > tabchangeHandler tab activated...');
                    console.log('item id -> ', activeId);
                }
                n2nLayoutManager.setActiveItem(activeId);
            }
        
            if (comp.runAutoAdjustWidth) {
                comp.autoAdjustWidth();
            }

            if (!comp._needReload && comp.needReloadChart && typeof(comp.forceReloadChart) === 'function') {
                comp.forceReloadChart();
            }
            
            // fixed Chrome issue where iframe loss scrollbars when becoming visible after hiding
            if (Ext.isChrome && (comp.iframeURL || comp.frameCt)) {
                var iframeComp = comp.frameCt ? comp.frameCt : comp;
                iframeComp.setStyle('overflow', 'scroll');

                setTimeout(function() {
                    iframeComp.setStyle('overflow', 'hidden');
                }, 1);
            }
        }

        if (N2N_CONFIG.activeSub) {
            if (comp) {
                if (comp.firstLoad === false) {
                    if (comp.screenType === 'main' || comp.feedScreen || comp.refreshScreen) {
                        if (typeof comp.switchRefresh === 'function') {
                            comp.switchRefresh(true);
                        }
                    } else {
                        Storage.refresh();
                    }

                } else {
                    if (comp.notMainSubscription) {
                        Storage.refresh();
                    }
                }
            }

            var wi = n2ncomponents.worldIndices;
            var bq = n2ncomponents.brokerQViews[0];
            if (oldTab) {
                var oldComp = oldTab.getComponent(0);
                if (oldComp) {
                    if (marketStreamer && marketStreamer.getId() === oldComp.getId()) {
                        marketStreamer.unsubscribe();
                        marketStreamer.inactive = true;
                    }
                    if (trackerRecord && trackerRecord.getId() === oldComp.getId()) {
                        trackerRecord.unsubscribe();
                        trackerRecord.inactive = true;
                    }
                    if (indices && indices.getId() === oldComp.getId()) {
                        conn.subscribeIndices();
                        indices.inactive = true;
                    }

                    if (wi && wi.getId() === oldComp.getId()) {
                        wi.unsubscribe();
                        wi.inactive = true;
                    }
                    if (bq && bq.getId() === oldComp.getId()) {
                        bq.unsubscribe();
                        bq.inactive = true;
                    }
                    if (orderPad && orderPad.getId() === oldComp.getId()) {
                        closedOrderPad = true;
                    }
                }
            }

            if (comp) {
                if (marketStreamer && marketStreamer.inactive && marketStreamer.getId() === comp.getId()) {
                    marketStreamer.subscribe();
                    marketStreamer.inactive = false;
                }
                if (trackerRecord && trackerRecord.inactive && trackerRecord.getId() === comp.getId()) {
                    trackerRecord.subscribe();
                    trackerRecord.inactive = false;
                }
                if (orderPad && comp && orderPad.getId() === comp.getId()) {
                    closedOrderPad = false;
                }
            }

        }

        // remember active tab
        var tIndex = helper.getTabIndex(thisTp, newTab);
        n2nLayoutManager.lyConf.setActiveTabIndex(thisTp.mt, tIndex);
    },
    _lastInView: {wlLView: {}},
    runAllSwitchRefresh: function() {
        var me = this;
        var refreshComps = new Array();

        var qsCView = helper.activeView(quoteScreen);
        if (me._lastInView.qcLView !=null && qsCView && !me._lastInView.qcLView) {
            refreshComps.push(quoteScreen);
        }
        me._lastInView.qcLView = qsCView;
        
        if (activeWatchlistArr) {
            for (var i = 0; i < activeWatchlistArr.length; i++) {
                var wlLv = me._lastInView.wlLView[activeWatchlistArr[i].name];
                var wlCv = helper.activeView(activeWatchlistArr[i].wlpanel);
                if (wlLv != null && wlCv && !wlLv) {
                    refreshComps.push(activeWatchlistArr[i].wlpanel);
                }
                me._lastInView.wlLView[activeWatchlistArr[i].name] = wlCv;
            }
        }
        
        // order status
        var osCView = helper.activeView(orderStatusPanel);
        if (me._lastInView.osLView!=null && osCView && !me._lastInView.osLView) {
            refreshComps.push(orderStatusPanel);
        }
        me._lastInView.osLView = osCView;
        
        // mutual fund order status
        var mfosCView = helper.activeView(mfOrderStatusPanel);
        if (me._lastInView.mfosLView!=null && mfosCView && !me._lastInView.mfosLView) {
            refreshComps.push(mfOrderStatusPanel);
        }
        me._lastInView.mfosLView = mfosCView;
        
        // order history
        var ohCView = helper.activeView(orderHistoryPanel);
        if (me._lastInView.ohLView !=null && ohCView && !me._lastInView.ohLView) {
            refreshComps.push(orderHistoryPanel);
        }
        me._lastInView.ohLView = ohCView;
        
        // mf order history
        var mfohCView = helper.activeView(mfOrderHistoryPanel);
        if (me._lastInView.mfohCView !=null && mfohCView && !me._lastInView.mfohCView) {
            refreshComps.push(mfOrderHistoryPanel);
        }
        me._lastInView.mfohCView = mfohCView;
        
        // derivative portfolio
        var dpCView = helper.activeView(derivativePrtfPanel);
        if (me._lastInView.dpLView!=null && dpCView && !me._lastInView.dpLView) {
            refreshComps.push(derivativePrtfPanel);
        }
        me._lastInView.dpLView = dpCView;
        
        // equity portfolio
        var epCView = helper.activeView(equityPrtfPanel);
        if (me._lastInView.epLView!=null && epCView && !me._lastInView.epLView) {
            refreshComps.push(equityPrtfPanel);
        }
        me._lastInView.epLView = epCView;
        
        // fund portfolio
        var fpCView = helper.activeView(mfEquityPrtfPanel);
        if (me._lastInView.fpCView!=null && fpCView && !me._lastInView.fpCView) {
            refreshComps.push(mfEquityPrtfPanel);
        }
        me._lastInView.fpCView = fpCView;
        // equity portfolio g/l
        var eglCView = helper.activeView(equityPrtfRealizedPanel);
        if (me._lastInView.eglLView!=null && eglCView && !me._lastInView.eglLView) {
            refreshComps.push(equityPrtfRealizedPanel);
        }
        me._lastInView.eglLView = eglCView;
        
        // indices
        var inCView = helper.activeView(indices);

        if (me._lastInView.inLView != null && inCView && !me._lastInView.inLView) {
            refreshComps.push(indices);
        } else if (indices && inCView === false) {
            conn.subscribeIndices();
        }
        me._lastInView.inLView = inCView;
        
        // market streamer
        var msCView = helper.activeView(marketStreamer);
        if (me._lastInView.msLView != null && msCView && !me._lastInView.msLView) {
            conn.subscribeTransaction();
        } else if (marketStreamer && msCView === false) {
            conn.unsubscribeTransaction();
        }
        me._lastInView.msLView = msCView;
        
        if (refreshComps.length > 0) {
            for (var i = 0; i < refreshComps.length; i++) {
                refreshComps[i].switchRefresh(true);
            }
        } else {
            Storage.refresh();
        }
    },
    activateHomeScreen: function() {
        var me = this;
        
        // close all other screens except home screen
        for (var i = 1; i < me.comp.length; i++) {
            me.comp[i].close();
        }
        
        if (me.comp.length <= 1) {
            // hide full menu
            me.toggleFullMenu(false);
        }
        
    },
    activateAllTabs: function() { // activate non-watchlist tab
        this._activateTabs(this.lyConf.activeIndex);
    },
    activateWlTabs: function() { // activate watchlist tab
        this._activateTabs(this.lyConf.activeWlIndex);
    },
    _activateTabs: function(tabs) {
        var me = this;
        if (tabs) {
            for (var i in tabs) {
                var tIndex = parseInt(tabs[i]);
                if (me.compRef[i]) {
                    me.compRef[i].setActiveTab(tIndex);
                }
            }

            // clear active index
            tabs = [];
        }
    },
    updateKey: function(comp) {
        var me = this;
        
        if (comp && comp.mt) {
            me.lyConf.updateKey(comp._prevMt || comp.mt, comp.type, comp.key, comp.stkname, comp.oldKey);
            // update parent key
            var pcomp = comp.up();
            if (pcomp) {
                pcomp.key = comp.key;
                pcomp.stkname = comp.stkname;
            }
        }
    },
    removeKey: function(compObj) {
        var me = this;

        if (compObj && compObj.mt) {
            me.lyConf.removeKey(compObj.mt, compObj.type, compObj.key);
        }
    },
    isMt: function(mt) {
        return this.lyConf._isMt(mt);
    },
    isP: function(mt) {
        return this.lyConf._isP(mt);
    },
    hardsettHomeScreen: function() {
        var me = this;
        
        var checkEmptyHome = true;
        for (var i = 0; i < me.comp.length; i++) {
            var cmp = me.comp[i];

            if (cmp.savingComp) { // activate the first main screen as home screen
                var chComp = cmp.getComponent(0);

                if (chComp) {
                    me.compRef.backBtn.hide();
                    me._defScreen = chComp.getId();
                    me._defScreenComp = chComp;
                    me.activateItem(me._defScreenComp, true);

                    checkEmptyHome = false;
                    // make sure the default screen is at the first position of comp array
                    if (i !== 0) {
                        var swapComp = me.comp[0];
                        me.comp[0] = cmp;
                        me.comp[i] = swapComp;
                    }
                    break;
                }
            }
        }
            
        if (checkEmptyHome && me.isEmptyHome()) {
            me.compRef.backBtn.hide();
            // update title
            helper.setHtml(me.compRef.titleLbl, '&nbsp;');

            var appMainEl = me.appMain.getEl();
            if (appMainEl) {
                appMainEl.update('<div class="home-msg"><div class="home-text">' + languageFormat.getLanguage(10042, 'Your home screen is empty. Please select a screen from the menu.') + '</div></div>');
            }
            n2nLayoutManager.toggleFullMenu(true);
        }
    },
    isEmptyHome: function() {
        return n2nLayoutManager.appMain.items.items.length === 0;
    },
    initializeCompDragZone: function(thisComp) {
        if (N2N_CONFIG.layoutDD) {
            var me = this;
            var tabHeader = thisComp.body.component.tab;

            if (tabHeader._initDragZone) {
                // destory initial drag zone if any
                tabHeader._initDragZone.destroy();
                tabHeader._initDragZone = null;
            }
            tabHeader._skipCreateInitDragZone = true;
            
            thisComp.dragZone = new Ext.dd.DragZone(tabHeader.el, {
                ddGroup: me._layoutDDGroup,
                onStartDrag: function() {
                    me.setDraggingCompStatus();
                    me.shimIframe();
                },
                getDragData: function(e) {
                    var sourceEl = e.getTarget(this.dom);
                    if (sourceEl) {
                        var cloneEl = sourceEl.cloneNode(true);
                        cloneEl.id = Ext.id();

                        return {
                            ddel: cloneEl,
                            sourceEl: sourceEl,
                            repairXY: Ext.fly(sourceEl).getXY(),
                            comp: thisComp,
                            role: 'dock'
                        };
                    }
                },
                getRepairXY: function() {
                    return this.dragData.repairXY;
                }
            });
        }
    },
    _initializeInitCompDragZone: function(tabHeader) {

        if (N2N_CONFIG.layoutDD && !tabHeader._skipCreateInitDragZone) {
            var me = this;

            tabHeader._initDragZone = new Ext.dd.DragZone(tabHeader.el, {
                ddGroup: me._layoutDDGroup,
                onStartDrag: function() {
                    me.setDraggingCompStatus();
                    me.shimIframe();
                },
                getDragData: function(e) {
                    var sourceEl = e.getTarget(this.dom);
                    if (sourceEl) {
                        var cloneEl = sourceEl.cloneNode(true);
                        cloneEl.id = Ext.id();

                        return {
                            ddel: cloneEl,
                            sourceEl: sourceEl,
                            repairXY: Ext.fly(sourceEl).getXY(),
                            role: 'dock'
                        };
                    }
                },
                getRepairXY: function() {
                    return this.dragData.repairXY;
                }
            });
        }
    },
    initializeCompDropZone: function(dropComp, secComp) {
        if (N2N_CONFIG.layoutDD) {
            var me = this;

            dropComp.dropZone = new Ext.dd.DropZone(dropComp.getEl(), {
                ddGroup: me._layoutDDGroup,
                getTargetFromEvent: function(e) {
                    return e.getTarget('.dropbarsection');
                },
                onNodeEnter: function(target, dd, e, data) {
                    if (data && data.role) {
                        switch (data.role) {
                            case 'menu':
                                if (!data.comp || !data.comp.popupOnly) {
                                    Ext.fly(secComp.getEl()).addCls('dropbar-over');
                                }

                                break;
                            case 'dock':
                                if (data.comp) {
                                    var comp = data.comp.getComponent(0);
                                    if (comp) {
                                        if (secComp.mt !== comp.mt) {
                                            Ext.fly(secComp.getEl()).addCls('dropbar-over'); // highlight only on different tabpanel
                                        }
                                    }
                                    break;
                                }
                        }
                    }
                },
                onNodeOut: function(target, dd, e, data) {
                    if (!data.comp || !data.comp.popupOnly) {
                        Ext.fly(secComp.getEl()).removeCls('dropbar-over');
                    }
                },
                onNodeOver: function(target, dd, e, data) {
                    if (data.comp && data.comp.popupOnly) {
                        return 'dd-add-popup';
                    } else {
                        return 'dd-add-tab';
                    }
                },
                onNodeDrop: function(target, dd, e, data) {
                    me.resetDraggingCompStatus();
                    
                    if (data && data.comp) {
                        switch (data.role) {
                            case 'menu':
                                if (!data.comp || !data.comp.popupOnly) {
                                    me.openAs = secComp.mt; // force to open at a specific tab
                                }
                                me.hideDDMenu(data.comp);
                                if (typeof data.comp.handler === 'function') {
                                data.comp.handler(data.comp);
                                }

                                break;
                            case 'dock':
                                var comp = data.comp.getComponent(0); // get component item
                                if (comp) {
                                    // move tab
                                    if (secComp.mt !== comp.mt) {
                                        comp.mtTarget = secComp.mt;

                                        n2nLayoutManager.addItem(comp);
                                        // close previous tab
                                        data.comp.close();
                                    }
                                }

                                break;
                        }
                    }

                    return true;
                    }
            });
        }
    },
    initializePopupDropZone: function(dropComp) {
        var me = this;

        if (N2N_CONFIG.layoutDD) {
            dropComp.dropZone = new Ext.dd.DropZone(dropComp.getEl(), {
                ddGroup: me._layoutDDGroup,
                getTargetFromEvent: function(e) {
                    return e.getTarget('.appvp');
                },
                onNodeOver: function(target, dd, e, data) {
                    if (data && data.role && !data.skipDD) {
                        return 'dd-add-popup';
                    }
                },
                onNodeDrop: function(target, dd, e, data) {
                    me.resetDraggingCompStatus();
                    
                    if (data && data.role) {
                        if (data.comp) {
                            switch (data.role) {
                                case 'menu':
                                    me.openAs = 'popup'; // force to open as popup
                                    // set window x, y position according to the drop target position
                                    me.setCompWinXY(e);
                                    me.hideDDMenu(data.comp);
                                    if (typeof data.comp.handler === 'function') {
                                    data.comp.handler(data.comp);
                                    }
                                    // clear previous drop x, y position to avoid using the same position for later screens
                                    me.resetCompWinXY();
                                    break;
                                case 'dock':
                                    // popup this tab
                                    me.setCompWinXY(e);
                                    me._toPopup(data.comp);
                                    me.resetCompWinXY();

                                    break;
                            }
                        }
                    }

                    return true;
                }
            });
        }
    },
    _isXYEnter: function(xy, comp2) {
        var xy2 = comp2.getXY();
        var size2 = comp2.getSize();
        
        return (xy[0] >= xy2[0] && xy[0] <= xy2[0] + size2.width) && (xy[1] >= xy2[1] && xy[1] <= xy2[1] + size2.height);
    },
    _isTabEnter: function(xy, ddComp) {
        if (N2N_CONFIG.layoutDD) {
            var me = this;
            var overComp;

            for (var i = 0; i < me._wTabList.length; i++) {
                var mtComp = me.compRef[me._wTabList[i]];

                if (mtComp && !mtComp.isHidden()) {
                    if (me._isXYEnter(xy, mtComp.tabBar)) {
                        if (ddComp) {
                            overComp = mtComp;
                        }
                        mtComp.addCls('dropbar-over');
                    } else {
                        mtComp.removeCls('dropbar-over');
                    }
                }
            }

            if (ddComp && ddComp.comp && overComp) {
                overComp.removeCls('dropbar-over');
                ddComp.comp.mtTarget = overComp.mt;
                
                // the last drop position should be ignored since it is over the tabbar
                var compItem = ddComp.comp.getComponent(0);
                if (compItem && compItem.winConfig) {
                    if (compItem.winConfig.prevX) {
                        compItem.winConfig.x = compItem.winConfig.prevX;
                        compItem.winConfig.prevX = null;
                    }
                    if (compItem.winConfig.prevY) {
                        compItem.winConfig.y = compItem.winConfig.prevY;
                        compItem.winConfig.prevY = null;
                    }
                }
                
                me._toTab(ddComp.comp);
            }
        }
    },
    initDragMenu: function(menuItem) {
        
        if (N2N_CONFIG.ddMenu) {
            var me = this;
            
            var dEl;
            if (menuItem.btnInnerEl) { // use innerEl to avoid interference with sorting menu and image drag
                dEl = menuItem.btnInnerEl;
            } else {
                dEl = menuItem.getEl();
            }

            menuItem.dragZone = new Ext.dd.DragZone(dEl, {
                ddGroup: me._layoutDDGroup,
                onStartDrag: function() {
                    me.setDraggingCompStatus();
                    me.shimIframe();
                },
                getDragData: function(e) {
                    var sourceEl = e.getTarget(this.dom);
                    if (sourceEl) {
                        var cloneEl = sourceEl.cloneNode(true);
                        cloneEl.id = Ext.id();

                        return {
                            ddel: cloneEl,
                            sourceEl: sourceEl,
                            repairXY: Ext.fly(sourceEl).getXY(),
                            comp: menuItem,
                            role: 'menu',
                            skipDD: menuItem.skipDD
                        };
                    }
                },
                getRepairXY: function() {
                    return this.dragData.repairXY;
                }
            });
            
            menuItem.on('beforedestroy', function(thisMenu) {
                if (thisMenu.dragZone) {
                    thisMenu.dragZone.destroy();
                }
            });
        }
    },
    initDropComp: function(dropComp, compRef, isTab) {
        if (N2N_CONFIG.ddComp && !dropComp.dropZoneCreated) {
            var me = this;

            dropComp.addCls('dropcompsection');
            var els = [dropComp.getEl()];
            if (isTab) {
                dropComp.body.component.tab.el.addCls('dropcompsection');
                els.push(dropComp.body.component.tab.el);
            }

            for (var i = 0; i < els.length; i++) {
                var dropId = 'dropZone' + i;
                if (!dropComp[dropId]) {
                    dropComp[dropId] = new Ext.dd.DropZone(els[i], {
                        ddGroup: ddCompGroup,
                        compType: dropComp.type,
                        compRef: compRef,
                        getTargetFromEvent: function(e) {
                            return e.getTarget('.dropcompsection');
                        },
                        onNodeEnter: function(target, dd, e, data) {
                            Ext.fly(target).addCls('open-comp');
                        },
                        onNodeOut: function(target, dd, e, data) {
                            Ext.fly(target).removeCls('open-comp');
                        },
                        onNodeOver: function(target, dd, e, data) {
                            return Ext.dd.DropZone.prototype.dropAllowed;
                        },
                        onNodeDrop: function(target, dd, e, data) {
                            me.resetDraggingCompStatus();
                            
                            // get record
                            var rec = me.getStkRec(dd.dragData.records[0]);
                            if (this.compType === 'wl') {
                                // add to watchlist only when dragging over different watchlist
                                if (dd.dragData.compRef && dd.dragData.compRef.id !== this.compRef.id) {
                                    wlAddStock(this.compRef.wlname, rec.stkCode, this.compRef);
                                }
                            } else {
                                // load component with new stock
                                n2ncomponents.loadScreen(null, this.compType, rec.stkCode, getMappedStockName(rec.stkName));
                            }

                            return true;
                        }
                    });
                    
                    dropComp.dropZoneCreated = true;
                }
            }

        }
    },
    setCompWinXY: function(e) {
        var me = this;

        if (e && e.parentEvent) {
            me.compWinX = e.parentEvent.pageX;
            me.compWinY = e.parentEvent.pageY;
        }
    },
    resetCompWinXY: function() {
        var me = this;

        me.compWinX = null;
        me.compWinY = null;
    },
    hideDDMenu: function(menu) { // hide current context menu

        if (!menu.zeroMenu) {
            var pcomp = menu.up();
            if (pcomp) {
                pcomp.hide();

                if (menu.secondMenu) {
                    var pcomp1 = pcomp.up();
                    if (pcomp1) {
                        var pcomp2 = pcomp1.up();
                        if (pcomp2) { // second level menu
                            pcomp2.hide();
                        }
                    }
                }
            }
        }
    },
    getSucceedingActive: function(curMt) {
        var me = this;

        if (me._succeedingActiveOrder[curMt]) {
            var succeedList = me._succeedingActiveOrder[curMt];
            for (var i = 0; i < succeedList.length; i++) {
                var sm = succeedList[i];
                if (me.compRef[sm] && !me.compRef[sm].isHidden()) {
                    return sm;
                }
            }
        }
        
        return null;
    },
    setSucceedingActive: function(mt) {
        var me = this;

        if (me.compRef[mt] && me.compRef[mt].isActiveScreen) {
            var sa = me.getSucceedingActive(mt);
            me.setActiveScreen(me.compRef[sa]);
        }
    },
    setFirstActive: function() {
        var me = this;
        var firstActive = me.getSucceedingActive('base');
        me.setActiveScreen(me.compRef[firstActive]);
    },
	syncCbListener: function() {
        return {
            afterrender: function(thisCb) {
                var tt = thisCb.screenType === 'main' ?
                        languageFormat.getLanguage(31511, 'Check as syncing parent') :
                        languageFormat.getLanguage(31512, 'Check as syncing child');

                Ext.QuickTips.register({
                    target: thisCb.getEl(),
                    text: tt
                });
            }
        };
    },
    getCompResizable: function() {
        var me = this;
        
        return {
            handles: 'all',
            listeners: {
                beforeresize: function() {
                    me.shimIframe();
                }
            }
        };
    },
    getFreeWl: function() { // get available watchlist which is not being open, so it can be set automatically
        var me = this;
        var wl = null;

        for (var i = 0; i < watchListArr.length; i++) {
            var wlName = watchListArr[i];
            var wlConf = me.lyConf.getScreenConfig('wl', wlName);
            if (wlConf.length === 0) {
                wl = wlName;
                break;
            }
        }

        return wl;

    },
    cleanPopups: function() {
        var me = this;

        var removedComp = [];
        for (var i = 0; i < me.comp.length; i++) {
            var comp = me.comp[i];

            if (comp.isXType('window')) {
                if (comp.closeAction === 'hide') {
                    comp.closeAction = 'destroy';
                }

                removedComp.push(comp);
            }
        }

        for (var i = 0; i < removedComp.length; i++) {
            removedComp[i].close();
        }
    },
    shimIframe: function() {
        Ext.select('.compresize').addCls('iframeresize');
    },
    unshimIframe: function() {
        var me = this;

        if (!me._draggingComp) {
            Ext.select('.iframeresize').removeCls('iframeresize');
        }

    },
    setDraggingCompStatus: function() {
        var me = this;

        me._draggingComp = true;
    },
    resetDraggingCompStatus: function() {
        var me = this;

        me._draggingComp = false;
    },
    _fixIframeResize: function(thisCt) {
        var me = this;

        if (thisCt.splitter && thisCt.splitter.tracker) {
            thisCt.splitter.tracker.on('mousedown', function() {
                me.shimIframe();
            });

            thisCt.splitter.tracker.on('dragstart', function() {
                me.setDraggingCompStatus();
                me.shimIframe();
            });

            thisCt.splitter.tracker.on('dragend', function() {
                me.resetDraggingCompStatus();
            });
        }
    },
    _recreatePicker: function(comp) { // fixed combobox exception when docking
        if (comp && comp._needRecreatePicker) {
            // get all combobox
            var combo = comp.query('combo');

            for (var i = 0; i < combo.length; i++) {
                var cb = combo[i];

                if (cb.picker && cb.picker.rendered) {
                    // recreate picker
                    cb.createPicker();
                }
            }

            comp._needRecreatePicker = false;

        }
    },
    _resetGridMenu: function(comp) { // fixed grid menu exception when docking
        if (comp && comp.isXType('grid')) {
            helper.resetGridMenus(comp);
        }
    },
    _createTabInitDragZone: function(tabPanel) {
        if (!tabPanel._initDragZoneCreated && tabPanel.tabBar) {
            var me = this;
            var tbItems = tabPanel.tabBar.items.items;

            for (var i = 0; i < tbItems.length; i++) {
                var ti = tbItems[i];
                if (ti.getXType() === 'tab') {
                    me._initializeInitCompDragZone(ti);
                }
            }

            tabPanel._initDragZoneCreated = true; // make sure fake drag zone is called only one
        }

    }
});
