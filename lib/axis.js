var utils = require('./utils');

var axis = {

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
	},

	// process an item to match its keys with the schema
	_matchAxis: function( item ){
		// variables
		var chart = this.chart();// get schema from chart
		//var axis = this._axis;// existing axis
		// prerequisite(s)
		var used = [];
		var missing = [];
		for( var axis in chart.schema ){
			if( this._axis[axis] ){
				used.push( this._axis[axis] );
				continue;
			}
			missing.push(axis);
		}
		// exit now if no further axis to process..
		if( !missing.length ) return;
		// loop through keys
		for( var key in item ){
			// convention: the first axis is always x (regardless of type)
			if( chart.schema.x && !this._axis.x ){
				this._axis.x = key;
				continue;
			}
			// don't use the same key twice
			if( used.indexOf( key ) > -1 ) continue;
			// further processing? (using missing array?)
			//this._axis[key] = key;
		}
	}

}

module.exports = axis;
