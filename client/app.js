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
    var current_index = 'keyword';
    var current_tab = 'metadata';
    var select_boxes = {};
    var index_selector;

    function selectSearchField(event) {
        document.getElementById(current_index + '-row').className = 'search-row';
        current_index = event.target.value;
        document.getElementById(event.target.value + '-row').className = 'search-row active-field';
    }

    function searchVolpiano(event) {
        var results = search.searchVolpiano(event.target.value);
        displayResults(results);
    }

    function searchMode(event) {
        var results = search.searchMode(event.target.value);
        displayResults(results);
    }

    function searchText(event) {
        if (event.target.value) {
            var results = search.searchTextField(event.target.value, current_index);
            displayResults(results);
        }
    }

    function displayResults(results) {
        var total_results = results.length,
            result_elements = [];
        document.getElementById('results-holder').innerHTML = result_template({results: results, total: total_results});
        result_elements = document.getElementsByClassName('search-result');
        for (var i = 0; i < result_elements.length; i++) {
            result_elements[i].onclick = goToResult;
        }
    }

    function goToResult(event) {
        var array = event.target.pathname.split('/'),
            folio = array[2], sequence = array[3];
        var url = folio + '/' + sequence;
        viewer.goTo(folio, sequence);
        return false;
    }

    function addSearchListeners() {
        var text_inputs = document.getElementsByClassName('text-input');
        for (var i = 0; i < text_inputs.length; i++) {
            text_inputs[i].oninput = searchText
        }
        document.getElementById('volpiano-input').oninput = searchText;
        document.getElementById('feast-selector').onchange = searchText;
        document.getElementById('mode-selector').onchange = searchMode;
        document.getElementById('genre-selector').onchange = searchText;
        document.getElementById('office-selector').onchange = searchText;
        document.getElementById('index-selector').onchange = selectSearchField;
    }

    function listenToTabs(event) {
        var new_tab = event.target.id.replace('-tab-selector', '');
        if (new_tab !== current_tab) {
            changeTab(new_tab);
        }
    }

    function changeTab(new_tab) {
        var current = document.getElementsByClassName('current-tab');
        while (current.length) {
            current[0].className = '';
        }
        document.getElementById(new_tab + '-tab-selector').className = 'current-tab';
        document.getElementById(new_tab + '-tab').className = 'current-tab';
        current_tab = new_tab;
    }

    // Load everything.
    $('#diva-wrapper').diva(viewer.diva_settings);
    document.querySelector('#tab-menu').onclick = listenToTabs;
    addSearchListeners();

    // Initialize selectors
    index_selector = $('#index-selector').select2({minimumResultsForSearch: Infinity});

    select_boxes = {
        genre: $('#genre-selector').select2({
                placeholder: "Select a genre",
                minimumResultsForSearch: Infinity
            }
        ),

        feast: $('#feast-selector'
        ).select2({
                placeholder: "Select a feast"
            }
        ),

        mode: $('#mode-selector').select2({
                placeholder: "Select a mode",
                minimumResultsForSearch: Infinity
            }
        ),

        office: $('#office-selector').select2({
                placeholder: "Select an office",
                minimumResultsForSearch: Infinity
            }
        )
    };

    index_selector.on("change", function (e) {
        Object.keys(select_boxes).forEach(function (key) {
            select_boxes[key].val(null).change();
            }
        );
        $('.entry-field input').val('');
    })
}