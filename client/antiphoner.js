"use strict";

function Antiphoner(success_callback) {
    var data = {};

    load();

    this.getFolios = getFolios;
    this.getChant = getChant;
    this.getChants = getChants;

    function load() {
        var request = new XMLHttpRequest();
        request.onload = function () {
            data = JSON.parse(request.responseText);
            success_callback();
        };
        request.onerror = function () {
        };
        request.open('GET', 'antiphoner-data.json');
        request.send();
    };

    function getFolios(){
        return Object.keys(data);
    }

    function getChants(folio) {
        if (!data[folio]) {
            throw new ChantError('No folio found with ID ' + folio);
        }
        return data[folio];
    }

    function getChant(chant_id) {
        var regex_results = /0*(\d*(r|v))(\d*)/.exec(chant_id);
        var folio_id = regex_results[1],
            chant_sequence = regex_results[3] - 1;
        var folio = getChants(folio_id);
        if (!folio[chant_sequence]) {
            throw new ChantError('No chant found on ' + folio_id + ' with sequence number ' + chant_sequence + ' : ' + chant_id);
        }
        return folio[chant_sequence];
    }
}

function ChantError(message) {
    this.message = message;
}

ChantError.prototype = Object.create(Error.prototype);

module.exports = Antiphoner;