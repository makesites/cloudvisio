var Cloudvisio = require("../index"),
	fs = require("fs");
	data = JSON.parse( fs.readFileSync( "./data/gists.json", "utf8") );


var vis = new Cloudvisio();
