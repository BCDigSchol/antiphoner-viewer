"use strict";

var lunr = require("lunr");

function Index() {
    var fields = Array.prototype.slice.call(arguments);

    var index = lunr(function () {
        for (var i = 0; i < fields.length; i++) {
            this.field(fields[i]);
        }
        this.ref('id');
        this.pipeline.remove(lunr.stemmer);
        this.pipeline.remove(lunr.stopWordFilter);
    });

    this.search = function (text) {
        return index.search(text);
    };

    this.addChant = function (chant) {
        var to_add = {id: chant['id']};
        for (var i = 0; i < fields.length; i++) {
            to_add[fields[i]] = chant[fields[i]];
        }
        index.add(to_add);
    }
}

module.exports = Index;