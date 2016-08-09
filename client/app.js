global.diva = require("diva");

var Antiphoner = require('./antiphoner.js');
var Viewer = require('./antiphoner_viewer.js');
var SearchEngine = require('./search.js');

var antiphoner;

// Once the window loads, load the Antiphoner and display.
window.onload = function () {
    antiphoner = new Antiphoner(display_antiphoner);
};

function display_antiphoner() {

    var result_template = require('./templates/search-results.hbs');
    var search = new SearchEngine(antiphoner);
    var viewer = new Viewer(antiphoner);

    function searchVolpiano(event) {
        var results = search.searchVolpiano(event.target.value);
        displayResults(results);
    }

    function searchText(event) {
        var input_name = event.target.id.replace('-input', '');
        var results = search.searchTextField(event.target.value, input_name);
        displayResults(results);
    }

    function displayResults(results) {
        var total_results = results.length;
        $('#results-holder').html(result_template({results: results, total: total_results}));
        $('.search-result').click(function (e) {
            var array = e.currentTarget.pathname.split('/'),
                folio = array[2], sequence = array[3];
            var url = folio + '/' + sequence;
            viewer.goTo(folio, sequence);
            return false;
        });
    }

    $('#diva-wrapper').diva(viewer.diva_settings);

    $('#tab-menu li').click(function () {
        if (!$(this).hasClass('current')) {
            $('#tab-menu li').toggleClass('current');
            $('#info > section').toggleClass('current');
        }
    });

    document.getElementById('volpiano-input').oninput = searchVolpiano;
    document.getElementById('keyword-input').oninput = searchText;
    document.getElementById('genre-input').oninput = searchText;
    document.getElementById('feast-input').oninput = searchText;
    document.getElementById('office-input').oninput = searchText;
    document.getElementById('mode-input').oninput = searchText;
}