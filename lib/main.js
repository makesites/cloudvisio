var utils = require('./utils');

Cloudvisio = function( options ){
	// variables
	options = options || {};
	this.options = {};

	// get the el
	this.el = options.el || defaults.el;
	// clean up options
	options.layout = ( options.layout || defaults.layout ).toLowerCase();
	// extend with the defaults
	options = utils.extend( defaults, options );
	/*
	options.container = options.container || defaults.container;
	options.width = options.width || defaults.width;
	options.height = options.height || defaults.height;
	options.colors = options.colors || defaults.colors;
	*/
	// add the appropriate chart
	//this.chart( options.layout );
	// ovewrite the default values (with the passed ones)
	//this.options = utils.extend( this.options, options );
	this.set( options );

	// allow method chaining
	return this;
};

Cloudvisio.prototype = {

	constructor: Cloudvisio,

	description : function() {
		return "Cloudvisio: Making awesome charts of your data";
	},

	options: {} // why isn't this available in the constructor?

};


module.exports = Cloudvisio;
