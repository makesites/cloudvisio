var Cloudvisio = require("../index"), // in production: require("cloudvisio")
	fs = require('fs');

// get data
// source: http://api.worldbank.org/countries?format=json&per_page=300&json
var data = JSON.parse( fs.readFileSync( __dirname + '/data/income.json', "utf8") );

// initiate lib
var vis = new Cloudvisio();
// compile chart data
vis
	.data( data[1] )
	.set({ layout: "force" })
	.axis("radius", 5)
	.axis("name")
	.select("incomeLevel")
	.group(["High", "Middle", "Low"]);

console.log( vis.models );