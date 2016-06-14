"use strict";

var lunr = require("lunr");

module.exports = (function () {

    var antiphoner = {};

    var chant_idx = {};

    function load(antiphoner_data) {
        antiphoner = antiphoner_data;
        chant_idx = lunr(function () {
            this.field('full_text_standard');
            this.ref('id');
        });
        ingest();
    }

    function loadChant(folio, sequence) {
        var chant = antiphoner[folio][sequence];

        chant_idx.add({
                id: chant['id'],
                full_text_standard: chant['full_text_standard']
            }
        );
    }

    function ingest() {
        for (var folio in antiphoner) {
            for (var sequence in antiphoner[folio]) {
                loadChant(folio, sequence);
            }
        }
    }

    function searchText(keyword) {
        return chant_idx.search(keyword);
    }

    function searchVolpiano(volpiano) {
        var return_vals = [];
        var chants;

        for (var folio in antiphoner) {
            chants = antiphoner[folio];
            return_vals = return_vals.concat(chants.filter(chantContainsVolpiano, {volpiano: volpiano}));
        }
        return return_vals;
    }

    function chantContainsVolpiano(chant) {
        return chant.search_volpiano.includes(this.volpiano);
    }

    return {
        load: load,
        searchText: searchText,
        searchVolpiano: searchVolpiano
    };

})();