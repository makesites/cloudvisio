var utils = require('./utils');

var options = {

	// updating options dynamically
	set: function( obj ){
		if( !(obj instanceof Object) ) return this;
		// merge the final object
		utils.extend(this.options, obj);
		// special condition for layouts
		if( obj.layout ) this.chart( obj.layout );

		//
		return this;
	},

	// retrieving options
	get: function( key ){
		//
		return this.options[key] || false;
	}

}

module.exports = options;