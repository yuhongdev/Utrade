/**
 * @class Ext.app.portal.PortalColumn
 * @extends Ext.container.Container
 * A layout column class used internally be {@link Ext.app.portal.PortalPanel}.
 */
Ext.define('Ext.app.portal.PortalColumn', {
    extend: 'Ext.container.Container',
    alias: 'widget.portalcolumn',
    requires: [
        'Ext.layout.container.Anchor',
        'Ext.app.portal.Portlet'
    ],
    layout: 'anchor',
    defaultType: 'portlet',
    cls: 'x-portal-column',
    listeners: {
        add: function() {
            if (layoutProfileManager && layoutProfileManager.getRememberLastLayout()) {
                if (!portfolioSaving) {
                    n2nLayoutManager.saveLayout();
                }
            }
        },
        remove: function() {
            if (layoutProfileManager && layoutProfileManager.getRememberLastLayout()) {
                n2nLayoutManager.saveLayout();
            }
        }
    }

    // This is a class so that it could be easily extended
    // if necessary to provide additional behavior.
});