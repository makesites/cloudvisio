var Cloudvisio = require("../index"), // in production: require("cloudvisio")
	fs = require('fs');

// initiate lib
vis = new Cloudvisio();
console.log( vis.description() );
