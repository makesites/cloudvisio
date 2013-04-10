if( !window.cloudvisio ) (function( d3 ){
var defaults = {
	
};
// dependencies
//var d3 = require("d3");

var Cloudvisio = function( options ){
	// fallbacks
	options = options || {};
	// defaults
	options.el = options.el || "#vis";
	options.view = options.view || "graph";
	
	// initialize with options
	this.options = options;
	
};

Cloudvisio.prototype = {
	// this is where the axis will be stored
	models: [], 
	
	// load a dataset
	data: function( raw ){
		// return the existing data if none is passed...
		if (!arguments.length) return this._data;
		// do some calculations 
		this._data = raw;
		// allow method chaining
		return this;
	}, 
	
	// load a dataset
	set: function( data ){
		data = data || false;
		if(!data) return;
		// check if it's and array of objects
		//if(data instanceof Array){
		if(data.length != "undefined"){
			for( var i in data ){
				this.models.push( data[i] );
			}
		} else {
			// assume one element
			this.models.push( data );
		}
		// allow method chaining
		return this;
	}, 
	
	// filter the data based on a regular expression
	search: function( query, field ){
		var exp = new RegExp(query);
		//...
		// allow method chaining
		return this;
	}, 
	
	match: function( query, field ){
		var exp = new RegExp(query);
		//...
		// allow method chaining
		return this;
	}, 
	
	compile: require("./compile"), 
	
	// convert the regular expression into a string
	verbalize: function(){
		
	}
	
};


// visual methods
description = function() {
	return "cloudvisio running on d3";
};

process = function(key,value) {
	console.log(key + " : "+value);
}

// Usage: 
//traverse(options.data,process);
traverse = function(o,func) {
	for (i in o) {
		func.apply(this,[i,o[i]]);  
		if (typeof(o[i])=="object") {
			//going on step down in the object tree!!
			traverse(o[i],func);
		}
	}
}

// Helpers
// - load template
loadTemplate = function(file) {
	return file;
};
	
	
	
//module.exports = Cloudvisio;
})( window.d3 );