"use strict";

function Viewer(antiphoner) {
    var incipit_template = require('./templates/incipit.hbs');
    var data = {};
    var hold_state = false;

    var zoom_level = (window.innerWidth > 2400) ? 3 : 2;
    console.log(window.innerWidth);

    this.diva_settings = {
        enableAutoHeight: true,
        fixedHeightGrid: false,
        iipServerURL: "http://mlib.bc.edu/iipsrv/iipsrv.fcgi",
        objectData: "antiphoner-processed.json",
        imageDir: "",
        enableCanvas: false,
        enableDownload: true,
        enableLinkIcon: false,
        enableAutoTitle: false,
        enableAntiphoner: true,
        goDirectlyTo: 2,
        zoomLevel: zoom_level,
        pageAliasFunction: getPageAlias,
        enablePagealias: true
    };
    this.goTo = goTo;

    // Add to the Diva plugin list
    window.divaPlugins.push({
        pluginName: 'antiphoner',
        init: initialize,
        handleClick: function (event) {
            // Diva.js plugins need a handleClick function, but we have no clicks to handle.
        }
    });

    function getPageAlias(page) {
        var numeric = 0;

        switch (page) {
            case 0:
                return 'Front cover';
            case 1:
                return 'Front endpaper';
            case 240:
                return 'Back endpaper';
            case 241:
                return 'Back cover';
        }

        numeric = Math.floor(page / 2);

        if (page % 2 === 0) {
            return numeric + "r";
        } else {
            return numeric + "v";
        }
    }

    /**
     * Initialize the antiphoner display
     *
     * @param diva_settings
     * @param diva_instance
     */
    function initialize(diva_settings, diva_instance) {
        data.current_diva = diva_instance;
        data.current_folio = '';
        diva.Events.subscribe('VisiblePageDidChange', loadPage, self);
        diva.Events.subscribe('ObjectDidLoad', loadInitialViewer, self);
    }

    function loadInitialViewer() {
        //var folio = querystring.parse(window.location.pathname.slice(1)).page;
        var path_parts = window.location.pathname.split('/');
        var folio = path_parts[2], sequence = path_parts[3];
        if (folio) {
            goTo(folio, sequence);
        }
    }

    function update_state(state, url, push) {
        if (push) {
            history.pushState(state, '', url);
        } else {
            history.replaceState(state, '', url);
        }
    }

    /**
     * Jump to a folio
     *
     * @param folio
     */
    function goTo(folio, sequence) {
        // For some reason we have to wait before jumping.
        // @TODO: Why do we have to wait before jumping?
        setTimeout(function () {
            var url = (sequence) ? folio + '/' + sequence : folio;
            data.current_diva.gotoPageByAliasedNumber(folio.replace(/^0+/, ''));
        }, 1);
    }

    /**
     * Load a folio of antiphoner data
     *
     * @param page_num
     * @param filename
     */
    function loadPage(page_num, filename) {
        var chants_on_page = [];
        if (pageHasChanged()) {
            chants_on_page = antiphoner.getChants(data.current_folio);
            $('#metadata-tab').html(incipit_template({incipits: chants_on_page, folio: data.current_folio}));
            $('#metadata-tab h3').click(function () {
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
        var state;
        if (data.current_folio != data.current_diva.getCurrentAliasedPageIndex()) {
            data.current_folio = data.current_diva.getCurrentAliasedPageIndex();
            state = {folio: data.current_folio, sequence: false, hold: false};
            if (hold_state) {
                update_state(state, data.current_folio, true);
            } else {
                update_state(state, data.current_folio, false);
            }
            return true;
        } else {
            return false;
        }
    }

    window.onpopstate = function (e) {
        if (e.state) {
            goTo(e.state.folio, e.state.sequence);
        }
    };
}

module.exports = Viewer;