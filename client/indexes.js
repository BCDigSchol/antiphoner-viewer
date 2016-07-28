"use strict";

var lunr = require("lunr");

module.exports = (function () {
    var full_text = buildIndex('full_text_standard');

    function indexChant(chant) {
        addChantToIndex(chant, full_text, 'full_text_standard');
    }

    function buildIndex(field) {
        return lunr(function () {
            this.field(field);
            this.ref('id');
        });
    }

    function addChantToIndex(chant, index, field) {
        index.add({
                id: chant['id'],
                full_text_standard: chant[field]
            }
        );
    }

    return {
        full_text: full_text,
        indexChant: indexChant
    };
})();