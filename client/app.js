global.diva = require("diva");
var chants = require('./chants.js');
var antiphoner = require('./antiphoner.js');
var search = require('./search.js');
search.load(chants);
antiphoner.load(chants);