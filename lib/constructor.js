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
	options.chart = options.chart || defaults.chart;
	// add the appropriate chart
	this.chart( options.layout );
	// ovewrite the default values (with the passed ones)
	this.options = utils.extend( this.options, options );
    
	// setup 
	this._container();
};

Cloudvisio.prototype = {
	
	constructor: Cloudvisio, 
	
	description : function() {
		return "Cloudvisio running on D3";
	}, 

    options: {}
    
};

