"use strict";

var lunr = require("lunr");

module.exports = (function () {

    var chants_map = {};

    var chant_idx = {};

    function load(chants_data) {
        chants_map = chants_data.chants;

        chant_idx = lunr(function () {
            this.field('volpiano');
            this.field('incipit');
            this.field('full_text_standard');
            this.ref('id');
        });
        
        ingest();
    }

    function loadChant(folio, chant_num) {
        var chant = chants_map[folio][chant_num];

        chant_idx.add({
                id: chant['id'],
                full_text_standard: chant['full_text_standard']
            }
        );
    }

    function ingest() {
        for (var folio in chants_map) {
            for (var chant_num in chants_map[folio]) {
                loadChant(folio, chant_num);
            }
        }
    }

    function search(keyword) {
        var result = chant_idx.search(keyword);
        console.log(result);
    }

    function searchVolpiano(volpiano) {
        var return_vals = [];
        var chants;

        for (var folio in chants_map) {
            chants = chants_map[folio];
            return_vals = return_vals.concat(chants.filter(chantContainsVolpiano, {volpiano: volpiano}));
        }
        return return_vals;
    }

    function chantContainsVolpiano(chant) {
        return chant.search_volpiano.includes(this.volpiano);
    }

    return {
        load: load,
        search: search
    };

})();