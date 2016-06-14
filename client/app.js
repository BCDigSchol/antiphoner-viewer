global.diva = require("diva");
var antiphoner = require('./antiphoner.js');
var viewer = require('./antiphoner_viewer.js');
var search = require('./search.js');
search.load(antiphoner.data);
viewer.load(antiphoner);