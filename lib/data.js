
// this is where the axis will be stored
Cloudvisio.prototype.models = [];

// load a dataset
Cloudvisio.prototype.data = function( raw, options ){
	// fallbacks
	options = options || {};
	// return the existing data if none is passed...
	if (!arguments.length) return this._data;
	// do some calculations
	this._data = raw;
	// reset the models
	if( options.silent ){
		// don't erase models
	} else {
		// reset the models
		this.models = [];
	}
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

// filter the data based on a regular expression
Cloudvisio.prototype.search = function( query, field ){
	var exp = new RegExp(query);
	//...
	// allow method chaining
	return this;
};

// lookup a value in a field
Cloudvisio.prototype.find = function( query, options ){
	options = options || {};
	// exit now if theres no selected field
	if( !this._selectedField ) return;
	var field = this._selectedField;
	// check if the query is a boolean
	if( typeof query == "boolean" ) query = (query) ? "true" : "false";
	// a find() always resets the axis?
	options.reset = true;
	this.group( [query], field, options);

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

// create an axis by grouping the raw data
Cloudvisio.prototype.group = function( groups, key, options){
	// fallbacks
	options = options || {};
	// variables
	var data = this.data();
	// convert groups to lower case
	groups = groups.join("`").toLowerCase().split("`");
	// lookup the right axis
	for( var i in data ){
		// create the model it this is the first axis
		this.models[i] = this.models[i] || {};
		if( typeof data[i][key] != "undefined"){
			// convert any value to string
			var value = (data[i][key] instanceof Object) ? utils.toArray( data[i][key] ).join("|") : ""+data[i][key]+"";

			//
			var matches = this._find(groups, value);
			// process results
			//if(matches !== null);
			if(matches instanceof Array){
				// are we expecting more than one matches??
				var group = matches.pop().toLowerCase();
				this.models[i]["group_"+key] = groups.indexOf( group );
			} else {
				this.models[i]["group_"+key] = -1;
			}
			/*
			// support types other than string
			switch(typeof value){
				case "string":

				break;
				case "boolean":
					console.log(groups);
					// in this case we do a direct comparison (sting comparisson
					this.models[i]["group_"+key] = groups.indexOf( value.toString() );
					console.log();
				break;
			}
			*/
		} else {
			//model["group_"+axis] = null;
			this.models[i]["group_"+key] = -1;
		}
	}
	// save latest group
	// #30 pick the right axis
	var field  = this._lookupSchema("number", "group_"+key);
	this._axis[field] = "group_"+key;

	return this;
};


// select a field from the raw dataset
Cloudvisio.prototype.select = function( field ){
	var keys = this.keys();
	this._selectedField = (keys.indexOf(field) > -1 )? field : false;

	return this;
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
// - chart attributes
Cloudvisio.prototype._axis = {};
// - chart attributes
Cloudvisio.prototype._selectedField = false;


Cloudvisio.prototype._axisSchema = function( schema ){
	// reset axis
	this._axis = {};
	for(var i in schema){
		this._axis[i] = false;
	}
};

// return the matches of a regular expression
Cloudvisio.prototype._find = function( query, string ){
	if( query instanceof Array) query = query.join("|");
	var regexp = new RegExp(query, "gi");
	return string.match(regexp);
};

