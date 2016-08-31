"use strict";

var Index = require('./index.js');

function SearchEngine(antiphoner) {
    var indices = {
        keyword: new Index('incipit', 'genre', 'feast', 'office', 'mode'),
        genre: new Index('genre'),
        feast: new Index('feast'),
        office: new Index('office'),
        volpiano: new Index('search_volpiano')
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

    this.searchMode = function (mode) {
        var return_vals = [],
            chants;
        folios.forEach(function (folio) {
            chants = antiphoner.getChants(folio);
            return_vals = return_vals.concat(chants.filter(chantIsInMode, {mode: mode}));
        });
        return return_vals;
    };

    function loadChant(folio, sequence) {
        sequence = parseInt(sequence) + 1;
        var chant = antiphoner.getChant(folio + sequence);
        /*chant.url = chant.folio + '/' + chant.sequence;
         chant.folio  = chant.folio.replace(/^[0]+/g,"");*/
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

    function chantIsInMode(chant) {
        return chant.mode == this.mode;
    }
};

module.exports = SearchEngine;