"use strict";

var indexes = require('./indexes.js');

module.exports = (function () {

    var antiphoner = {};

    function load(antiphoner_object) {
        antiphoner = antiphoner_object;
        ingest();
    }

    function loadChant(folio, sequence) {
        sequence = parseInt(sequence) + 1;
        var chant = antiphoner.getChant(folio + sequence);
        indexes.indexChant(chant);
    }

    function ingest() {
        for (var folio in antiphoner.data()) {
            for (var sequence in antiphoner.getChants(folio)) {
                loadChant(folio, sequence);
            }
        }
    }

    function searchTextField(keyword, field) {
        var results = [];
        var lunr_results = indexes[field].search(keyword);
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
        searchTextField: searchTextField,
        searchVolpiano: searchVolpiano
    };

})();