global.diva = require("diva");
var antiphoner = require('./antiphoner.js');
var viewer = require('./antiphoner_viewer.js');
var search = require('./search.js');
search.load(antiphoner.data);
viewer.load(antiphoner);

window.onload = function () {
    var search_window = document.getElementById('search-window');
    var btn = document.getElementById('search-button');
    var close_btn = document.querySelector('#search-window .close');
    var modal_content = document.querySelector('#search-window .modal-content');
    var volpiano_input = document.getElementById('volpiano-input');

    var result_template = require('./templates/search-results.hbs');


    btn.onclick = toggleDisplay;
    search_window.onclick = toggleDisplay;

    volpiano_input.oninput = searchVolpiano;

    function toggleDisplay(event) {
        if (!modal_content.contains(event.target) || event.target == close_btn) {
            search_window.style.display = (search_window.style.display === 'block') ? 'none' : 'block';
        }
    }

    function searchVolpiano(event) {
        var results = search.searchVolpiano(event.srcElement.value);
        var total_results = results.length;
        $('#results-holder').html(result_template({results: results, total: total_results}));
    }
};
