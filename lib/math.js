
Cloudvisio.prototype.process = function( key, value ) {
	console.log(key + " : "+value);
};

Cloudvisio.prototype.eq = function( number, options ){
	//
	options = options || {};
	options.eq = true;
	this._filterNumber( number, options );
	// allow method chaining
	return this;
};


Cloudvisio.prototype.gt = function( number, options ){
	//
	options = options || {};
	options.gt = true;
	this._filterNumber( number, options );
	// allow method chaining
	return this;
};


Cloudvisio.prototype.lt = function( number, options ){
	//
	options = options || {};
	options.lt = true;
	this._filterNumber( number, options );
	// allow method chaining
	return this;
};


// Applying a filter based on an operator
Cloudvisio.prototype._filterNumber = function( number, options ){
	//
	options = options || {};
	var field = this._selectedField || options.field || false;
	// exit now if theres no selected field
	if( !field ) return;
	// check if the query is a number
	if(typeof number != "number") return;
	// get the data
	var data = this.data(null, { raw : true });
	// create a new field for the query;
	var id = "_query_"+ utils.uid();
	//
	if( options.filter ){
		// reset filtered data - should be part of data()?
		this._filteredData = [];
	}
	//
	for( var i in data ){
		var opt = {
			silent: true,
			filter: options.filter
		};
		var result;
		if( options.eq){
			result = (data[i][field] === number);
			if( options.filter ){
				if( result ) this.data( data[i], opt);
			} else {
				// add a new filter key
				data[i][id] = result;
				//
				opt.key = i;
				// update the existing data
				this.data( data[i], opt);
				// save the query
				this._queries[id] = { field: field, type: "eq", query: number };
			}
		}
		if( options.lt){
			result = (data[i][field] < number);
			if( options.filter ){
				if( result ) this.data( data[i], opt);
			} else {
				// add a new filter key
				data[i][id] = result;
				//
				opt.key = i;
				// update the existing data
				this.data( data[i], opt);
				// save the query
				this._queries[id] = { field: field, type: "lt", query: number };
			}
		}
		if( options.gt){
			result = (data[i][field] > number);
			if( options.filter ){
				if( result ) this.data( data[i], opt);
			} else {
				// add a new filter key
				data[i][id] = result;
				//
				opt.key = i;
				// update the existing data
				this.data( data[i], opt);
				// save the query
				this._queries[id] = { field: field, type: "gt", query: number };
			}
		}
	}

};