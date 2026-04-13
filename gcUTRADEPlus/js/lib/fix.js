/* to fix console in IE < 10 */
if (!(window.console && console.log)) {
    console = {
        log: function() {
        },
        debug: function() {
        },
        info: function() {
        },
        warn: function() {
        },
        error: function() {
        }
    };
}

/* to fix string trim() function in IE <10 */
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/gm, '');
    };
}

/* array's indexOf() */
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement, fromIndex) {
        if (this === undefined || this === null) {
            throw new TypeError('"this" is null or not defined');
        }

        var length = this.length >>> 0; // Hack to convert object.length to a UInt32

        fromIndex = +fromIndex || 0;

        if (Math.abs(fromIndex) === Infinity) {
            fromIndex = 0;
        }

        if (fromIndex < 0) {
            fromIndex += length;
            if (fromIndex < 0) {
                fromIndex = 0;
            }
        }

        for (; fromIndex < length; fromIndex++) {
            if (this[fromIndex] === searchElement) {
                return fromIndex;
            }
        }

        return -1;
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function(searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}

/*
 * Since these have been removed in ExtJS 5: Ext.is.iPad, Ext.is.Tablet, Ext.is.Phone, Ext.is.iPod
 * and Ext.supports.Touch is usually true, so this function is used instead to detect touch mode
 */
function isTouchDevices() {
    return (window.navigator.msMaxTouchPoints || ('ontouchstart' in document.documentElement));
}

/*
 * Fix to get cell which includes hidden columns as counting index
 */
Ext.view.Table.prototype.getCellByPosition = function(position, returnDom) {
    if (position) {
        var view = position.view || this,
                row = view.getRow(position.record || position.row),
                header = position.column.isColumn ? position.column : view.getColumnManager().getHeaderAtIndex(position.column);

        if (header && row) {
            return Ext.fly(row).down(view.getCellSelector(header), returnDom);
        }
    }
    return false;
};

Ext.layout.ContextItem.prototype.initAnimation = function() {
    var me = this,
            target = me.target,
            ownerCtContext = me.ownerCtContext;

    if (ownerCtContext && ownerCtContext.isTopLevel && target.ownerLayout) {
        me.animatePolicy = target.ownerLayout.getAnimatePolicy(me);
    } else if (!ownerCtContext && target.isCollapsingOrExpanding && target.animCollapse) {
        me.animatePolicy = target.componentLayout.getAnimatePolicy(me);
    }

    if (me.animatePolicy) {
        me.context.queueAnimation(me);
    }
};

// to fix unintentional deselect issue
Ext.override(Ext.grid.Panel, {
    listeners: {
        beforecontainerclick: function() {
            return false;
        }
    }
});

//fix hide submenu (in chrome 43)
Ext.override(Ext.menu.Menu, {
    onMouseLeave: function(e) {
	var me = this;


	// BEGIN FIX
	visibleSubmenu = false;
	me.items.each(function(item) { 
		if(item.menu && item.menu.isVisible()) { 
			visibleSubmenu = true;
		}
	});
	if(visibleSubmenu) {
		//console.log('apply fix hide submenu');
		return;
	}
	// END FIX


	me.deactivateActiveItem();


	if (me.disabled) {
	    return;
	}


	me.fireEvent('mouseleave', me, e);
    }
});

// fixed exception issue on some Safari
Ext.override(Ext.data.Model, {
    constructor: function(data, session) {
        var me = this,
                cls = me.self,
                identifier = cls.identifier,
                Model = Ext.data.Model,
                modelIdentifier = Model.identifier,
                idProperty = me.idField.name,
                array, id, initializeFn, internalId, len, i, fields;

        me.data = me.data = data || (data = {});
        me.session = session || null;
        me.internalId = internalId = modelIdentifier.generate();
        var dataId = data[idProperty];
        if (session && !session.isSession) {
            Ext.Error.raise('Bad Model constructor argument 2 - "session" is not a Session');
        }
        if ((array = data) instanceof Array) {
            me.data = data = {};
            fields = me.getFields();
            len = Math.min(fields.length, array.length);
            for (i = 0; i < len; ++i) {
                data[fields[i].name] = array[i];
            }
        }
        if (!(initializeFn = cls.initializeFn)) {
            cls.initializeFn = initializeFn = Model.makeInitializeFn(cls);
        }
        if (!initializeFn.$nullFn) {
            cls.initializeFn(me);
        }

        if (!(me.id = id = data[idProperty]) && id !== 0) {
            if (dataId) {
                Ext.Error.raise('The model ID configured in data ("' + dataId + '") has been rejected by the ' + me.fieldsMap[idProperty].type + ' field converter for the ' + idProperty + ' field');
            }
            if (session) {
                identifier = session.getIdentifier(cls);
                id = identifier.generate();
            } else if (modelIdentifier === identifier) {
                id = internalId;
            } else {
                id = identifier.generate();
            }
            data[idProperty] = me.id = id;
            me.phantom = true;
        }
        if (session) {
            session.add(me);
        }
        if (me.init && Ext.isFunction(me.init)) {
            me.init();
        }
    }
});

Ext.override(Ext.picker.Date, {

    runAnimation: function(isHide) {
        var me = this,
            picker = this.monthPicker,
            options = {
                duration: 200,
                callback: function() {
                    picker.setVisible(!isHide);
                    // See showMonthPicker
                    picker.ownerCmp = isHide ? null : me;
                }
            };


        if (isHide) {
            picker.el.slideOut('t', options);
        } else {
            picker.el.slideIn('t', options);
        }
    },


    hideMonthPicker: function(animate) {
        var me = this,
            picker = me.monthPicker;


        if (picker && picker.isVisible()) {
            if (me.shouldAnimate(animate)) {
                me.runAnimation(true);
            } else {
                picker.hide();
                // See showMonthPicker
                picker.ownerCmp = null;
            }
        }
        return me;
    },


    showMonthPicker: function(animate) {
        var me = this,
            el = me.el,
            picker;


        if (me.rendered && !me.disabled) {
            picker = me.createMonthPicker();
            if (!picker.isVisible()) {
                picker.setValue(me.getActive());
                picker.setSize(el.getSize());
                picker.setPosition(-el.getBorderWidth('l'), -el.getBorderWidth('t'));
                if (me.shouldAnimate(animate)) {
                    me.runAnimation(false);
                } else {
                    picker.show();
                    // We need to set the ownerCmp so that owns() can correctly
                    // match up the component hierarchy, however when positioning the picker
                    // we don't want it to position like a normal floater because we render it to 
                    // month picker element itself.
                    picker.ownerCmp = me;
                }
            }
        }
        return me;
    }
});

if (N2N_CONFIG.gridBufferedRenderer) {
    Ext.override(Ext.view.Table, {
        // Avoid blur of search boxes due to grid selection-focus
        _ws_lastScrollPosition: null,
        refresh: function() {
            var me = this;

            me.callParent(arguments);
            if (me.headerCt.up('[store]')) {
                me.headerCt.setSortState();
            }

            if (me.rendered && me.bufferedRenderer) {
                me.el.dom.scrollTop = me._ws_lastScrollPosition;
                me.bufferedRenderer.onViewScroll(null, me.el);
            }

            me.selModel.onLastFocusChanged(null, me.selModel.lastFocused, true);
        },
        onViewScroll: function(e, t) {
            this._ws_lastScrollPosition = t.scrollTop;

            return this.callParent(arguments);
        }
    });
}