"use strict";

var lunr = require("lunr");

function Index(field) {
    var index = lunr(function () {
        this.field(field);
        this.ref('id');
        this.pipeline.remove(lunr.stemmer)
        this.pipeline.remove(lunr.stopWordFilter)
    });

     this.index = index;

    this.search = function (text) {
        return index.search(text);
    };

    this.addChant = function (chant) {
        var to_add = { id: chant['id']};
        to_add[field] = chant[field];
        index.add(to_add);
    }
}

module.exports = Index;