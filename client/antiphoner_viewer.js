module.exports = (function () {
    "use strict";

    var my = {
        load: load
    };

    var querystring = require("querystring");

    // Incipit data array
    var antiphoner = {};

    // Incipit handlebars template
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
        data.current_folio = '';
        diva.Events.subscribe('PageDidLoad', loadPage, self);
        diva.Events.subscribe('ObjectDidLoad', loadInitialViewer, self);
    }

    function loadInitialViewer() {
        var folio = querystring.parse(window.location.search.slice(1)).page;
        if (folio) {
            goTo(folio);
        }
    }

    /**
     * Jump to a folio
     *
     * @param folio
     */
    function goTo(folio) {

        // For some reason we have to wait before jumping.
        // @TODO: Why do we have to wait before jumping?
        setTimeout(function () {
            data.current_diva.gotoPageByAliasedNumber(folio);
        }, 1);
    }

    /**
     * Load a folio of antiphoner data
     *
     * @param page_num
     * @param b
     * @param c
     */
    function loadPage(page_num, b, c) {
        var chants_on_page = [];
        if (pageHasChanged()) {
            chants_on_page = antiphoner.getChants(data.current_folio);
            $('.incipit-holder').html(incipit_template({incipits: chants_on_page}));
            $('.incipit-holder h3').click(function () {
                $(this).next('.metadata').slideToggle().siblings('.metadata:visible').slideUp();
            });
        }
    }

    /**
     * Monitor page changes
     *
     * @returns {boolean}
     */
    function pageHasChanged() {
        window.currentdiva = data.current_diva;
        if (data.current_folio != data.current_diva.getCurrentAliasedPageIndex()) {
            data.current_folio = data.current_diva.getCurrentAliasedPageIndex();
            return true;
        } else {
            return false;
        }
    }

    function load(antiphoner_data) {
        antiphoner = antiphoner_data;
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