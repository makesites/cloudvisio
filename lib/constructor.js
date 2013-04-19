// dependencies
//var d3 = require("d3");

Cloudvisio = function( options ){
	// variables
	options = options || {};
	
	// merge with defaults
	this.el = options.el || defaults.el;
	options.layout = ( options.layout || defaults.layout ).toLowerCase();
	options.container = options.container || defaults.container;
	options.width = options.width || defaults.width;
	options.height = options.height || defaults.height;
	options.colors = options.colors || defaults.colors;
	// save options for later...
	this.options = options;
	// add the appropriate chart
	var layout = this.charts[ options.layout] || this.charts.stack;
	this.chart( layout );
	
	
	// setup 
	this._container();
};

Cloudvisio.prototype = {
	
	constructor: Cloudvisio, 
	
	description : function() {
		return "Cloudvisio running on D3";
	}

};

