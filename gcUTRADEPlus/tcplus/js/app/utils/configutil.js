/* 
 * Provides function utilities for config
 * 
 */

var configutil = {
    hasATP: function() {
        return !this.noATP();
    },
    noATP: function() {
        return global_HaveATP.toLowerCase() === 'false';
    },
    getTrueConfig: function(config) {
        return config.toLowerCase() === 'true';
    },
    getFalseConfig: function(config) {
        return config.toLowerCase() === 'false';
    },
    getDefaultTrueConfig: function(config) {
        return config.toLowerCase() !== 'false';
    },
    getDefaultFalseConfig: function(config) {
        return config.toLowerCase() !== 'true';
    },
    getATPAccountParts: function(accountStr, accountSeparator) {
        var separator = global_AccountSeparator; // from app.js
        var accParts = new Array();

        if (accountSeparator != undefined && accountSeparator != null) {
            separator = accountSeparator;
        }
        if (accountStr == null) {
            accountStr = "";
        }
        accParts = accountStr.split(separator);

        return accParts;
    }
};