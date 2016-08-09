"use strict";

var Index = require('./index.js');

function SearchEngine(antiphoner) {
    var indices = {
        keyword: new Index('full_text_standard'),
        genre: new Index('genre'),
        feast: new Index('feast'),
        office: new Index('office'),
        mode: new Index('mode')
    };

    var folios = antiphoner.getFolios();
    folios.forEach(loadFolio);

    this.searchTextField = function (keyword, field) {
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
    };

    this.searchVolpiano = function (volpiano) {
        var return_vals = [];
        var chants;
        folios.forEach(function (folio) {
            chants = antiphoner.getChants(folio);
            return_vals = return_vals.concat(chants.filter(chantContainsVolpiano, {volpiano: volpiano}));
        });
        return return_vals;
    };

    function loadChant(folio, sequence) {
        sequence = parseInt(sequence) + 1;
        var chant = antiphoner.getChant(folio + sequence);
        for (var index in indices) {
            indices[index].addChant(chant);
        }
    }

    function loadFolio(folio) {
        for (var sequence in antiphoner.getChants(folio)) {
            loadChant(folio, sequence);
        }
    }

    function chantContainsVolpiano(chant) {
        return chant.search_volpiano.includes(this.volpiano);
    }
};

module.exports = SearchEngine;