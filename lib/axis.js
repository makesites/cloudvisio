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
			this._axis[i] = i; // customize value?
		}

		// merge data with existing
		this.models = this.models.concat( axis );
	},

	_axisSchema: function( schema ){
		// reset axis (conditionally)
		//this._axis = {};
		// remove old axis
		for(var i in this._axis){
			if(typeof schema[i] == "undefined") delete this._axis[i];
		}
		// add new axis
		for(var j in schema){
			// get the default value ( if set )
			var value = ( this.options[j] ) ? this.options[j] : false;
			// preserve existing axis
			if(typeof this._axis[j] == "undefined") this._axis[j] = value;
		}
	},

	// make an intelligent decision on what the next axis may be
	_findAxis: function( type ){
		// get the keys of the model
		var keys = this.keys( this.models );
		if( !keys ) return false;
		var axis = utils.toArray( this._axis );
		// loop through the keys
		for( var i in keys ){
			// check that the key hasn't been used
			if( axis.indexOf( keys[i] ) > -1 ) continue;
			// get type of field
			if( type == this._findType( keys[i] )) return keys[i];
		}
		return false;
	}

}

module.exports = axis;
