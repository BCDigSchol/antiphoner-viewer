var data = {};

function load(success) {
    console.log('called');
    var request = new XMLHttpRequest();
    request.onload = function () {
        data = JSON.parse(request.responseText);
        success();
    }; request.onerror = function() {
        console.log('error');
    };
    request.open('GET', 'antiphoner-data.json');
    request.send();
};

function get_data() {
    return data;
}

function ChantError(message) {
    this.message = message;
};

ChantError.prototype = Object.create(Error.prototype);

function getChants(folio) {
    if (!data[folio]) {
        throw new ChantError('No chant found with ID ' + folio);
    }
    return data[folio];
}

module.exports = {
    getChants: getChants,
    data: get_data,
    load: load
};