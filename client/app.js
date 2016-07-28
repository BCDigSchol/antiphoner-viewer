global.diva = require("diva");
var antiphoner = require('./antiphoner.js');
var viewer = require('./antiphoner_viewer.js');
var search = require('./search.js');

function display_antiphoner() {

    search.load(antiphoner);
    viewer.load(antiphoner);

    var search_tab = document.getElementById('search-tab');
    var metadata_tab = document.getElementById('metadata-tab');
    var btn = document.getElementById('search-button');
    var volpiano_input = document.getElementById('volpiano-input');
    var keyword_input = document.getElementById('keyword-input');

    var result_template = require('./templates/search-results.hbs');

    function searchVolpiano(event) {
        var results = search.searchVolpiano(event.target.value);
        var total_results = results.length;
        $('#results-holder').html(result_template({results: results, total: total_results}));
        $('.search-result').click(function (e) {
            var array = e.currentTarget.pathname.split('/'),
                folio = array[2], sequence = array[3];
            var url = folio + '/' + sequence;
            toggleDisplay(event);
            viewer.goTo(folio, sequence);
            return false;
        });
    }

    function searchText(event) {
        var results = search.searchText(event.target.value);
        var total_results = results.length;
        $('#results-holder').html(result_template({results: results, total: total_results}));
        $('.search-result').click(function (e) {
            var array = e.currentTarget.pathname.split('/'),
                folio = array[2], sequence = array[3];
            var url = folio + '/' + sequence;
            toggleDisplay(event);
            viewer.goTo(folio, sequence);
            return false;
        });
    }

    $('#diva-wrapper').diva({
        enableAutoHeight: true,
        fixedHeightGrid: false,
        iipServerURL: "http://mlib.bc.edu/iipsrv/iipsrv.fcgi",
        objectData: "antiphoner-processed.json",
        imageDir: "",
        enableCanvas: true,
        enableDownload: true,
        enableLinkIcon: false,
        enableAutoTitle: false,
        enableAntiphoner: true,
        zoomLevel: 3,
        pageAliasFunction: function (page) {
            var numeric = 0;

            switch (page) {
                case 0:
                    return 'Front cover';
                case 1:
                    return 'Front endpaper';
                case 239:
                    return 'Back endpaper';
                case 240:
                    return 'Back cover';
            }

            numeric = Math.floor(page / 2);

            if (page % 2 === 0) {
                return numeric + "r";
            } else {
                return numeric + "v";
            }
        },
        enablePagealias: true
    });

    $('#tab-menu li').click(function () {
        if (! $(this).hasClass('current')) {
            $('#tab-menu li').toggleClass('current');
            metadata_tab.classList.toggle('current');
            search_tab.classList.toggle('current');
        }
    });

    volpiano_input.oninput = searchVolpiano;
    keyword_input.oninput = searchText;
}

window.onload = function () {
    antiphoner.load(display_antiphoner);
};
