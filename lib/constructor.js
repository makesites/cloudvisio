// dependencies
//var d3 = require("d3");

Cloudvisio = function( options ){
	// variables
	options = options || {};
	
	// merge with defaults
	options.el = options.el || defaults.el;
	options.view = options.view || defaults.view;
	
	// save for later...
	this.options = options;
};

Cloudvisio.prototype = {
	
	constructor: Cloudvisio, 
	
	description : function() {
		return "Cloudvisio running on D3";
	}

};

