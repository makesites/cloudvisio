var Cloudvisio = require("../index"),
	fs = require("fs");
	data = JSON.parse( fs.readFileSync( "./data/population.json", "utf8") );

// 
var vis = new Cloudvisio();
// 
vis.set( data );
// 
vis.compile();