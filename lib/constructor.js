// dependencies
//var d3 = require("d3");

Cloudvisio = function( options ){
	// variables
	options = options || {};
	
	// merge with defaults
	this.el = options.el || defaults.el;
	options.view = options.view || defaults.view;
	options.container = options.container || defaults.container;
	options.width = options.width || defaults.width;
	options.height = options.height || defaults.height;
	// save options for later...
	this.options = options;
	
	// setup 
	this._container();
	
};

Cloudvisio.prototype = {
	
	constructor: Cloudvisio, 
	
	description : function() {
		return "Cloudvisio running on D3";
	}

};

