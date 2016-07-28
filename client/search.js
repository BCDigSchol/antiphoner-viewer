"use strict";

var lunr = require("lunr");

module.exports = (function () {

    var antiphoner = {};

    var full_text_idx = {};

    function load(antiphoner_object) {
        antiphoner = antiphoner_object;
        full_text_idx = lunr(function () {
            this.field('full_text_standard');
            this.ref('id');
        });
        ingest();
    }

    function loadChant(folio, sequence) {
        sequence = parseInt(sequence) + 1;
        var chant = antiphoner.getChant(folio + sequence);
        full_text_idx.add({
                id: chant['id'],
                full_text_standard: chant['full_text_standard']
            }
        );
    }

    function ingest() {
        for (var folio in antiphoner.data()) {
            for (var sequence in antiphoner.getChants(folio)) {
                loadChant(folio, sequence);
            }
        }
    }

    function searchText(keyword) {
        var results = [];
        var lunr_results = full_text_idx.search(keyword);
        lunr_results.forEach(function (result, index, array) {
            try {
                results.push(antiphoner.getChant(result.ref));
            } catch (err) {
                console.log(err.message);
                results.push({});
            }
        });
        return results;
    }

    function searchVolpiano(volpiano) {
        var return_vals = [];
        var chants;

        for (var folio in antiphoner.data()) {
            chants = antiphoner.getChants(folio);
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