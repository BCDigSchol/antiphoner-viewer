module.exports = (function () {
    "use strict";

    var my = {
        load: load
    };

    var querystring = require("querystring");

    // Incipit data array
    var chants = {};

    // Incipit handlebars tempalte
    var incipit_template = require('./templates/incipit.hbs');

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
        diva.Events.subscribe('ObjectDidLoad', loadInitialViewer, self);
    }

    function loadInitialViewer() {
        var page = querystring.parse(window.location.search.slice(1)).page;
        if (page) {
            goToPage(page);
        }
    }

    /**
     * Jump to a page
     *
     * @param page_alias
     */
    function goToPage(page_alias) {

        // For some reason we have to wait before page jumping.
        // @TODO: Why do we have to wait before page jumping?
        setTimeout(function () {
            data.current_diva.gotoPageByAliasedNumber(page_alias);
        }, 1);
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
            page_incipits = chants.getChants(data.current_page);
            page_incipits.map(buildIncipitID);
            console.log(page_incipits);
            $('.incipit-holder').html(incipit_template({incipits: page_incipits}));
            $('.incipit-holder h3').click(function () {
                $(this).next('.metadata').slideToggle().siblings('.metadata:visible').slideUp();
            });
        }
    }

    function buildIncipitID(incipit) {
        incipit.id = incipit.incipit.replace(/\s+/g, '-').toLowerCase();
        return incipit;
    }

    /**
     * Monitor page changes
     *
     * @returns {boolean}
     */
    function pageHasChanged() {
        window.currentdiva = data.current_diva;
        if (data.current_page != data.current_diva.getCurrentAliasedPageIndex()) {
            data.current_page = data.current_diva.getCurrentAliasedPageIndex();
            return true;
        } else {
            return false;
        }
    }

    function load(chants_data) {
        chants = chants_data;
        // Add to the Diva plugin list
        window.divaPlugins.push({
            pluginName: 'antiphoner',
            init: initialize,
            handleClick: function (event) {
                // Diva.js plugins need a handleClick function, but we have no clicks to handle.
            }
        });
    }

    return my;
})();