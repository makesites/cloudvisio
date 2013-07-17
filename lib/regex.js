// Public methods

Cloudvisio.prototype.match = function( string, options ){
	//
	options = options || {};
	options.match = true;
	this._filterString( string, options );
	// allow method chaining
	return this;
};


// filter the data based on a regular expression
Cloudvisio.prototype.search = function( string, options ){
	//
	options = options || {};
	options.search = true;
	this._filterString( string, options );
	// allow method chaining
	return this;
};


// lookup a value in a field
Cloudvisio.prototype.find = function( query, options ){
	//
	options = options || {};
	if( typeof query == "boolean" ) {
		this.match( query, options );
	} else {
		// a find() always resets the axis?
		this.search( query, options );
	}
	// allow method chaining
	return this;
	/*
	options = options || {};
	// exit now if theres no selected field
	if( !this._selectedField ) return;
	var field = this._selectedField;
	// check if the query is a boolean
	if( typeof query == "boolean" ) query = (query) ? "true" : "false";
	// a find() always resets the axis?
	options.reset = true;
	this.group( [query], field, options);
	// allow method chaining
	return this;
	*/
};


// create an axis by grouping the raw data
Cloudvisio.prototype.group = function(){
	// for no arguments (or more arguments) just exit
	if( !arguments.length ) return this;
	// variables
	var key, groups, options, field;
	// count arguments (groups are optional)
	switch( arguments.length ){
		case 1:
			key = arguments[0];
		break;
		case 2:
			key = arguments[0];
			if( arguments[1] instanceof Array ){
				groups = arguments[1];
			} else {
				options = arguments[1];
			}
		break;
		default:
			key = arguments[0];
			groups = arguments[1];
			options = arguments[2];
		break;
	}
	// fallbacks
	options = options || {};
	// get the (working) data
	var data = this.data();
	//
	// try to find an existing query first?
	//
	if( groups ){
		// convert groups to lower case
		groups = groups.join("`").toLowerCase().split("`");
		options.fixed = true; // fixed groups
	} else {
		groups = this._getValues( key, data );
	}
	// save the query
	var id = this.queries({ field: key, type: "group", query: groups }, options);
	//

	for( var i in data ){
		// convert any value to string
		var value = (data[i][key] instanceof Object) ? utils.toArray( data[i][key] ).join(",") : ""+data[i][key]+"";
		var opt = {
			silent: true,
			key: i
		};
		var result = this._find( value, groups );
		// add a new query key
		// are we expecting more than one matches??
		//if(result instanceof Array) result = result.pop().toLowerCase();
		data[i][id] = result;
		// update the existing data
		this.data( data[i], opt);
	}
	// check if the selected layout "needs" a group
	var axis = this.axis();
	if( axis.group === false ){
		// select the query key as the group axis
		this.axis(id);
		this._axis.group = id;
	}


	/*
	// reset models if needed
	if( options.reset ){
		// create a model set equal to the length of the groups
		var length = (groups.length === 1) ? groups.length+1 : groups.length;
		this.models = new Array( length );
		field = "value";
		for( var k = 0; k < this.models.length; k++ ){
			this.models[k] = {};
			this.models[k][field] = 0;
			if( options.labels ){
				this.models[k].label = groups[k] || "not "+ groups[k-1];
			}else {
				this.models[k].label = "";
			}
		}
	} else {
		field = "group_"+key;
	}
	// lookup the right axis
	for( var i in data ){
		var model;
		if( !options.reset ){
			// create the model if this is the first axis
			this.models[i] = this.models[i] || {};
			model = this.models[i];
		}
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
				if( options.reset ){
					this.models[ groups.indexOf( group ) ][field] += 1;
				} else {
					this.models[i][field] = groups.indexOf( group );
				}
			} else {
				if( options.reset ){
					this.models[groups.length][field] += 1;
				} else {
					this.models[i][field] = -1;
				}
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
	/*
		} else {
			//model["group_"+axis] = null;
			if( options.reset ){
				this.models[groups.length][field] += 1;
			} else {
				this.models[i][field] = -1;
			}
		}
	}
	// save latest group
	// #30 pick the right axis
	var selected  = this._lookupSchema("number", field);
	this._axis[selected] = field;
	*/
	return this;
};


Cloudvisio.prototype.reverse = function(){
	// set the flag for reference
	this._reverseQuery = true;
	// allow method chaining
	return this;
};

// check if a query is there
Cloudvisio.prototype.inQueries = function( q ){
	var id = false;
	for( var i in this._queries ){
		// check all fields for a match
		if( this._queries[i].field == q.field && this._queries[i].type == q.type && this._queries[i].query == q.query ){
			id = i;
		}
	}
	return id;
};



// Internal objects
Cloudvisio.prototype._reverseQuery = false;


// Internal methods

// Return the matches of a regular expression
Cloudvisio.prototype._find = function( query, string ){
	// convert text to lower case
	string = string.join("|").toLowerCase();
	query = query.toLowerCase();
	//
	var regexp = new RegExp(string, "gi");
	var matches = query.match(regexp);
	if(matches === null) return -1;
	// collapse matches / explode query
	matches = matches.join(",");
	string = string.split("|");
	if( string instanceof Array){
		// return the index
		return string.indexOf( matches );
	}
	// return the text
	return matches;
};

// get a list of the different values
Cloudvisio.prototype._getValues = function( key, data ){
	var values = [];
	for( var i in data ){
		// convert any value to string
		var value = (data[i][key] instanceof Object) ? utils.toArray( data[i][key] ).join(",") : ""+data[i][key]+"";
		var exists = values.indexOf( value ) > -1;
		if( !exists ) values.push(value);
	}
	return values;
};



// Applying a filter based on an regulat expression
Cloudvisio.prototype._filterString = function( string, options ){
	//
	options = options || {};
	var field = this._selectedField || options.field || false;
	// exit now if theres no selected field
	if( !field ) return;
	// check if the query is a number
	//if(typeof string != "string") return;
	// get the data
	var data = this.data(null, { raw : true });
	//
	var type;
	if( options.match ) type = "match";
	if( options.search ) type = "search";
	// create a new query
	var id = this.queries({ field: field, type: type, query: string }, options);
	//
	for( var i in data ){
		var opt = {
			silent: true,
			filter: options.filter
		};
		var result;
		if( options.match ){
			result = (data[i][field] === string);
		}
		if( options.search ){
			var exp = new RegExp(string, "gi");
			result = ( data[i][field].search(exp) > -1 );
		}
		// make the necessary adjustments to the data
		if( options.exclude && data[i].__filter !== false ){
			// when exluding don't consider the ones already filtered out
			data[i].__filter = !result;
		} else if( options.filter && data[i].__filter !== false ){
			data[i].__filter = result;
		}
		// add a new query key
		data[i][id] = result;
		//
		opt.key = i;
		//opt.filter = true;
		// update the existing data
		this.data( data[i], opt);
	}

};