global.diva = require("diva");
var antiphoner = require('./antiphoner.js');
var viewer = require('./antiphoner_viewer.js');
var search = require('./search.js');

function display_antiphoner() {
    
    search.load(antiphoner.data());
    viewer.load(antiphoner);
    
    var search_window = document.getElementById('search-window');
    var btn = document.getElementById('search-button');
    var close_btn = document.querySelector('#search-window .close');
    var modal_content = document.querySelector('#search-window .modal-content');
    var volpiano_input = document.getElementById('volpiano-input');

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
        })
    }

    $('#diva-wrapper').diva({
        enableAutoHeight: true,
        fixedHeightGrid: false,
        iipServerURL: "http://mlib.bc.edu/iipsrv/iipsrv.fcgi",
        objectData: "antiphoner-processed.json",
        imageDir: "",
        enableCanvas: true,
        enableDownload: true,
        enableAutoTitle: false,
        enableAntiphoner: true,
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

    btn.onclick = toggleDisplay;
    search_window.onclick = function (event) {
        if (!modal_content.contains(event.target) || event.target == close_btn) {
            toggleDisplay(event);
        }
    };

    volpiano_input.oninput = searchVolpiano;

    function toggleDisplay(event) {
        search_window.style.display = (search_window.style.display === 'block') ? 'none' : 'block';
    }
}

window.onload = function() {
    antiphoner.load(display_antiphoner);
};
