var Cloudvisio = require("../index"), // in production: require("cloudvisio")
	request = require('request'),
	fs = require('fs');

// get data
// source: "https://api.github.com/users/"+ user +"/gists"
request.get({
	url: "https://api.github.com/users/tracend/gists",
	headers: {
		'User-Agent': 'request'
	}
}, function( err, request, response ){
	// error control?
	renderGraph( response );
});

	//JSON.parse( fs.readFileSync( __dirname + '/data/income.json', "utf8") );

//console.log( data );
// initiate lib
var vis = new Cloudvisio({
		layout: "force"
	});

// compile chart data
function renderGraph( data ){

	vis
	.data( data )
	.axis("description")
	.select("public")
	.group([true, false])
	.axis("comments");
	// output graph data
	console.log( vis.models );
}
