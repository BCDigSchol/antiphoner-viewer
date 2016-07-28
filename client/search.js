"use strict";

var Index = require('./index.js');

module.exports = (function () {

    var antiphoner = {};

    var indices = {
        full_text: new Index('full_text_standard')
    };

    function load(antiphoner_object) {
        antiphoner = antiphoner_object;
        for (var folio in antiphoner.data()) {
            for (var sequence in antiphoner.getChants(folio)) {
                loadChant(folio, sequence);
            }
        }
    }

    function loadChant(folio, sequence) {
        sequence = parseInt(sequence) + 1;
        var chant = antiphoner.getChant(folio + sequence);
        for (var index in indices) {
            indices[index].addChant(chant);
        }
    }

    function searchTextField(keyword, field) {
        var results = [];
        var lunr_results = indices[field].search(keyword);
        lunr_results.forEach(function (result, index, array) {
            try {
                results.push(antiphoner.getChant(result.ref));
            } catch (err) {
                console.log(err.message);
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