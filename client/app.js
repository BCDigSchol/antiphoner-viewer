global.diva = require("diva");
var antiphoner = require('./antiphoner.js');
var viewer = require('./antiphoner_viewer.js');
var search = require('./search.js');

function display_antiphoner() {

    search.load(antiphoner);
    viewer.load(antiphoner);

    var search_tab = document.getElementById('search-tab');
    var metadata_tab = document.getElementById('metadata-tab');
    var volpiano_input = document.getElementById('volpiano-input');
    var keyword_input = document.getElementById('keyword-input');

    var result_template = require('./templates/search-results.hbs');

    function searchVolpiano(event) {
        var results = search.searchVolpiano(event.target.value);
        displayResults(results, event);
    }

    function searchText(event) {
        var results = search.searchTextField(event.target.value, 'full_text');
        displayResults(results, event);
    }

    function displayResults(results, event) {
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

    $('#diva-wrapper').diva(viewer.diva_settings);

    $('#tab-menu li').click(function () {
        if (!$(this).hasClass('current')) {
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
