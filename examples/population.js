var Cloudvisio = require("../index"), // in production: require("cloudvisio")
	fs = require('fs');

// get data
var data = JSON.parse( fs.readFileSync( __dirname + '/data/population.json', "utf8") );

// initiate lib
var vis = new Cloudvisio({
		layout: "pie"
	})
	.axis({
		label: "country",
		value: "population"
	});
//
vis.parse( data );

console.log( vis.models );
