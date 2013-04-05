// dependencies
var d3 = require("d3");
var document = global.document = require("jsdom").jsdom("<html><head></head><body></body></html>"),
    window = global.window = document.createWindow();

var body = document.querySelector("body");

var label={}, data=[];

var container = d3.select(body).append("svg:svg").attr("id", "container");

var compile = function(){
	
	// loop through the data
	for( var i in this.models ){
		var model = this.models[i]; 
		// first capture the axis labels
		//label[i] = 1;
		// group the values
		
	}
	
	//var vis = container.data(this.models)
    //.enter().append("div");
	
	//console.log( container ); 
	
};

// Helpers


module.exports = compile;