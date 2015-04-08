var utils = require('./utils');

var defaults = {
	el: "#vis",
	layout: "stack",
	container: "svg",
	width: "100%",
	height: "100%",
	// The color scale will be assigned by index, but if you define your data using objects, you could pass
	// in a named field from the data object instead, such as `d.name`. Colors are assigned lazily,
	// so if you want deterministic behavior, define a domain for the color scale.
	colors: d3.scale.category20c(),
	//colors: d3.scale.ordinal().range(["darkblue", "blue", "lightblue"]);
	renderErrors: false
};


// updating options dynamically
Cloudvisio.prototype.set = function( obj ){
	if( !(obj instanceof Object) ) return this;
	// merge the final object
	utils.extend(this.options, obj);
	// special condition for layouts
	if( obj.layout ) this.chart( obj.layout );

	//
	return this;
};

// retrieving options
Cloudvisio.prototype.get = function( key ){
	//
	return this.options[key] || false;
};
