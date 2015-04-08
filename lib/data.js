var utils = require('./utils');

var data = {

	// this is where the axis will be stored
	models: [],

	// load a dataset
	data: function( models, options ){
		// fallbacks
		options = options || {};
		// return the existing data if none is passed...
		if ( !arguments.length || models === null ) return ( options.raw ) ? this._data : this._filteredData();
		//
		var data = this._data;
		// check if the data we're adding is in an array
		if( models instanceof Array){
			// resetting only if set with an option
			if( options.reset ){
				data = models;
			} else {
				data = data.concat(models);
			}
		} else if( models instanceof Object) {
			// all individual imports are silent
			options.silent = true;
			//
			//if( options.filter ){
			//	models.__filter = true;
			//}
			// passing the key as an option - better way?
			if( options.key ){
				data[options.key] = models;
			} else {
				data.push(models);
			}
		} else {
			// nothing else supported for now
			return this;
		}
		// reset the models
		if( options.silent ){
			// don't erase models
		} else {
			// reset the models
			this.models = [];
		}
		// save data back to the common container
		this._data = data;

		// allow method chaining
		return this;
	},

	// return filtered data
	_filteredData: function(){
		var data = [];
		for(var i in this._data ){
			// if filter is not set yet this is pass-through
			if( typeof this._data[i].__filter == "undefined" || this._data[i].__filter ){
				data.push( this._data[i] );
			}
		}
		return data;
	},

	// load a dataset
	parse: function( data ){
		data = data || false;
		if(!data) return;
		// check if it's and array of objects
		//if(data instanceof Array){
		if(data.length != "undefined"){
			for( var i in data ){
				this.add( data[i] );
			}
		} else {
			// assume one element
			this.add( data );
		}
		// setup the axis by checking if the chart is ready
		this.ready();
		// allow method chaining
		return this;
	},

	// retrieve all keys from a data block (currently non-recursive)
	keys: function( data ){
		// fallback to the raw data
		data = data || this.data();
		//
		var keys = [];
		for(var i in data){
			var attr = Object.keys(  data[i] );
			for( var j in attr ){
				// don't add the same key or queries
				if( keys.indexOf( attr[j] ) > -1 || attr[j].search(/__query/gi) > -1 ) continue;
				keys.push( attr[j] );
			}
		}
		//
		return keys;
	},

	// set an axis key (or return the whole array
	axis: function( key, value ){
		// return the existing data if none is passed...
		//if (!arguments.length) return Object.keys( this.models[0] || {} );
		if (!arguments.length) return this._axis;
		// #24 if key is an object loop through options
		if( key instanceof Object ){
			for( var k in key ){
				this.axis( k, key[k] );
			}
		}

		// focus on a specific subset?
		var data = this.data();
		// lookup the key in the raw data
		for(var i in data){
			// create model if necessary
			if(typeof this.models[i] == "undefined" ) this.models[i] = { _id: utils.uniqueID() };

			if(typeof value != "undefined"){
				// if a value is passed just use that
				this.models[i][key] = value;
			} else if( typeof data[i][key] == "string" || typeof data[i][key] == "number"){
				// there's currenty a 1-1 match between the data length and the models length...
				this.models[i][key] = data[i][key];
			} else if( typeof data[i][key] == "object" ){
				// by priority look up a desciptive key in the object
				this.models[i][key] = data[i][key].value || data[i][key].name || data[i][key].title || data[i][key].id || data[i][key];
			} else {
				// not supporting any other types for now...
				this.models[i][key] = null;
			}
			//

		}
		// setup the _axis
		if(typeof value != "undefined") this._axis[key] = value;
		/*
		for( var i in obj){
			if( i == "chart" ){
				var options = this._axis || {};
				var chart = obj[i];
				// reset options now
				this._axis = {};
				// don't overwrite existing assignements
				for( var j in chart ){
					if( options[j] && typeof options[j] != "undefined" && !chart[j] ){
						obj[i][j] = options[j];
					}
				}
			}
		}
		*/
		// maintain chanability
		return this;
	},

	// select a field from the raw dataset
	select: function( field ){
		var keys = this.keys();
		this._selectedField = (keys.indexOf(field) > -1 )? field : false;

		return this;
	},

	// calculate axis based on the queries
	amount: function( options ){
		// fallback
		options = options || {};
		// get the (active) data
		var data = this.data();
		var axis = this.axis();
		// if there are no value axis (available) in the schema exit now
		if( axis.value !== false ) return;
		var queries = this.queries();
		// also reset models?
		if( options.reset ) {
			this.models = [];
		}
		var used = 0;
		// lookup all the queries
		for(var i in queries ){
			// don't use filter queries
			if( queries[i].sort == "filter" || queries[i].sort == "exclude" ) continue;
			// template
			var models = {};
			for(var j in data ){
				if(typeof data[j][i] == "boolean"){
					// skip false state
					if( data[j][i] === false ) continue;
					// create empty container
					if( typeof models[0] == "undefined" ) models[0] = { label: false, value: 0 };
					// increment value
					models[0].value +=1;
					// add label
					if( !models[0].label && options.labels !== false ){
						models[0].label = queries[i].query.toString();
					}
					used++;
				} else if(typeof data[j][i] == "number"){
					// skip false state
					if( data[j][i] == -1 ) continue;
					// create empty container
					if( typeof models[ data[j][i] ] == "undefined" ) models[ data[j][i] ] = { label: false, value: 0 };
					// increment value
					models[ data[j][i] ].value += 1;
					// add label
					if( !models[ data[j][i] ].label && options.labels !== false ){
						models[ data[j][i] ].label = queries[i].query[ data[j][i] ].toString();
					}
					used++;
				} else {
					// what to do with a string?
				}
			}
			// convert object to array
			//models = Array.prototype.slice.apply( models );
			//this.models = this.models.concat( models );
			for( var g in  models ){
				this.add( models[g] );
			}
		}
		// add another item with the remaining
		if( used < data.length ){
			this.add({
				label: "other",
				value: data.length - used
			});
		}
		// lastly specify the axis to the schema
		this._axis.label = "label";
		this._axis.value = "value";

		// allow method chaining
		return this;
	},

	// removing axis
	remove: function( string, options ){
		// fallbacks
		options = options || {};
		options.type = options.type || false;
		var axis = false,
			query = false;
		// option types always override any logic
		if( !options.type ){
			// check in the axis
			axis = utils.inArray( string, this._axis );
			query = Object.keys(this._queries).indexOf( string );
			// an axis is also a query...
			if( query > -1 ) options.type = "query";
			if( axis > -1 ) options.type = "axis";
		}

		// if we didn't find anything exit
		if( !options.type ) return this;

		if( options.type == "query" ){
			var q = this._queries[string];
			// remove the query entry
			delete this._queries[string];
			// remove any reference in the data
			for( var i in this._data ){
				delete this._data[i][string];
				// remove the filter flag if query type of filter/exclude or the last query
				if( q.sort =="filter" || q.sort =="exclude" || !this._queries.length ){
					delete this._data[i].__filter;
				}
			}
		}

		if( options.type == "axis" ){
			// remove the axis entry
			this._axis[string] = false;
			// remove the data
			for( var j in this.models ){
				var model = this.models[j];
				if( typeof model[string] != "undefined"){
					delete this.models[j][string];
				}
			}
		}
		// also support query objects in the future?
		return this;
	},

	// public access of findType
	type: function( key, options ){
		// lookup the key in the models first
		if( this.models.length && this.models[0][key] ){
			// everything is fine...
			return this._findType( key );
		} else {
			return this._findType( key, this._data );
		}
	},


	// Internal
	// - raw data container
	_data: [],
	// - chart fields set as axis
	_axis: {},
	// - the last selected field
	_selectedField: false,


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
	}
}


module.exports = data;
