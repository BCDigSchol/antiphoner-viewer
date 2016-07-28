"use strict";

var lunr = require("lunr");

function Index(field) {
    var index = lunr(function () {
        this.field(field);
        this.ref('id');
    });

    this.search = function (text) {
        return index.search(text);
    };

    this.addChant = function (chant) {
        index.add({
                id: chant['id'],
                full_text_standard: chant[field]
            }
        );
    }
}

module.exports = Index;