module.exports = function () {
    "use strict";

    // Incipit data array
    var all_incipits = require('./incipits.js');

    // Incipit handlebars tempalte
    var incipit_template = require('./templates/incipit.hbs')

    var data = {};

    /**
     * Initialize the antiphoner display
     *
     * @param diva_settings
     * @param diva_instance
     */
    function initialize(diva_settings, diva_instance) {
        data.current_diva = diva_instance;
        data.current_page = '';
        diva.Events.subscribe('PageDidLoad', loadPage, self);
    }

    /**
     * Load a page of antiphoner data
     *
     * @param page_num
     * @param b
     * @param c
     */
    function loadPage(page_num, b, c) {
        var page_incipits = [];
        if (pageHasChanged()) {
            page_incipits = all_incipits[data.current_page];
            page_incipits.map(buildIncipitID);
            console.log(page_incipits);
            $('.incipit-holder').html(incipit_template({incipits: page_incipits}));
        }
    }

    function buildIncipitID(incipit) {
        incipit.id = incipit.title.replace(/\s+/g, '-').toLowerCase();
        return incipit;
    }

    /**
     * Monitor page changes
     *
     * @returns {boolean}
     */
    function pageHasChanged() {
        if (data.current_page != data.current_diva.getCurrentAliasedPageIndex()) {
            data.current_page = data.current_diva.getCurrentAliasedPageIndex();
            return true;
        } else {
            return false;
        }
    }

    // Add to the Diva plugin list
    window.divaPlugins.push({
        pluginName: 'antiphoner',
        init: initialize,
        handleClick: function (event) {
            // Diva.js plugins need a handleClick function, but we have no clicks to handle.
        }
    });
};