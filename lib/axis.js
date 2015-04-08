var utils = require('./utils');

var axis = {

	// add a new axis
	add: function( axis ){
		// convert to an array if necessary
		axis = ( axis instanceof Array ) ? axis : [axis];
		// loop through new axis
		for( var i in axis ){
			// check if there's an id assigned
			if( typeof axis[i]._id == "undefined" ){
				axis[i]._id = utils.uniqueID();
			}
		}
		// merge with existing
		this.models = this.models.concat( axis );
	}

}

module.exports = axis;
