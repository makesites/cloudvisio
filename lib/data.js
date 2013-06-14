
// this is where the axis will be stored
Cloudvisio.prototype.models = [];

// load a dataset
Cloudvisio.prototype.data = function( models, options ){
	// fallbacks
	options = options || {};
	// return the existing data if none is passed...
	if ( !arguments.length || (models === null && options.raw) ) return this._data;
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
		if( options.filter ){
			models.__filter = true;
		}
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
};

// load a dataset
Cloudvisio.prototype.parse = function( data ){
	data = data || false;
	if(!data) return;
	// check if it's and array of objects
	//if(data instanceof Array){
	if(data.length != "undefined"){
		for( var i in data ){
			this.models.push( data[i] );
		}
	} else {
		// assume one element
		this.models.push( data );
	}
	// setup the axis by checking if the chart is ready
	this.ready();
	// allow method chaining
	return this;
};

// retrieve all keys from a data block (currently non-recursive)
Cloudvisio.prototype.keys = function( data ){
	// fallback to the raw data
	data = data || this.data();
	//
	var keys = [];
	for(var i in data){
		var attr = Object.keys(  data[i] );
		for( var j in attr ){
			// don't add the same key
			if( keys.indexOf( attr[j] ) > -1 ) continue;
			keys.push( attr[j] );
		}
	}
	//
	return keys;
};

// set an axis key (or return the whole array
Cloudvisio.prototype.axis = function( key, value ){
	// return the existing data if none is passed...
	if (!arguments.length) return Object.keys( this.models[0] || {} );
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
		if(typeof this.models[i] == "undefined" ) this.models[i] = {};

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
};

// select a field from the raw dataset
Cloudvisio.prototype.select = function( field ){
	var keys = this.keys();
	this._selectedField = (keys.indexOf(field) > -1 )? field : false;

	return this;
};

// set or retrieve the queries applied
Cloudvisio.prototype.queries = function( query, options ){
	if (!arguments.length) return this._queries;
	// get a query if given string
	if(typeof query == "string") return this._queries[ query ];
	// set a query if given object
	var queries = (query instanceof Array) ? query : [query];
	var id;
	for( var i in queries ){
		// check if query exists first?
		// create a new field for the query
		id = "__query_"+ utils.uid();
		this._queries[id] = query;
	}
	// return the id if entering one query
	return (query instanceof Array) ? this : id;
};

// calculate axis based on the queries
Cloudvisio.prototype.amount = function( options ){
	// fallback
	options = options || {};
	// get the (active) data
	var data = this.data();
	// also reset models?
	var calculated = 0;
	// lookup all the queries
	for(var i in this._queries ){
		var model = {
			label: "",
			value: 0
		};
		for(var j in data ){
			model.value += data[j][i];
		}
		// add labels
		if(options.labels){
			model.label = this._queries[i].query.toString();
		}
		// save the query result as a new axis
		this.models.push(model);
	}
	// add another item with the remaining
	if( calculated < data.length ){
		this.models.push({
			label: "other",
			value: data.length - calculated
		});
	}

};

// removing axis
Cloudvisio.prototype.remove = function( axis ){
	for( var i in this.models ){
		var model = this.models[i];
		if( typeof model[axis] != "undefined"){
			delete this.models[i][axis];
		}
	}
	return this;
};

// public access of findType
Cloudvisio.prototype.type = function( key, options ){
	// lookup the key in the models first
	if( this.models.length && this.models[0][key] ){
		// everything is fine...
		return this._findType( key );
	} else {
		return this._findType( key, this._data );
	}
};


// Internal
// - raw data container
Cloudvisio.prototype._data = [];
// - filtered data
Cloudvisio.prototype._filteredData = [];
// - chart fields set as axis
Cloudvisio.prototype._axis = {};
// - the last selected field
Cloudvisio.prototype._selectedField = false;
// - saving queries
Cloudvisio.prototype._queries = {};

Cloudvisio.prototype._axisSchema = function( schema ){
	// reset axis
	this._axis = {};
	for(var i in schema){
		this._axis[i] = false;
	}
};
