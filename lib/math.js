
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
	var id;
	// exit now if theres no selected field
	if( !field ) return;
	// check if the query is a number
	if(typeof number != "number") return;
	// get the data
	var data = this.data();
	//
	if( options.filter ){
		// reset filtered data - should be part of data()?
		this._filteredData = [];
	} else {
		// create a new field for the result;
		id = "filter_"+ field + "_"+ utils.uid();
	}
	//
	for( var i in data ){
		var result;
		if( options.eq){
			result = (data[i][field] === number);
			if( options.filter ){
				if( result ) this.data( data[i], { silent: true });
			} else {
				// add a new filter key
				data[i][id] = result;
				// update the existing data
				this.data( data[i], { key : i, silent: true });
				// save the query
				this._queries[id] = number;
			}
		}
		if( options.lt){
			result = (data[i][field] < number);
			if( options.filter ){
				if( result ) this.data( data[i], { silent: true });
			} else {
				// add a new filter key
				data[i][id] = result;
				// update the existing data
				this.data( data[i], { key : i, silent: true });
				// save the query
				this._queries[id] = number;
			}
		}
		if( options.gt){
			result = (data[i][field] > number);
			if( options.filter ){
				if( result ) this.data( data[i], { silent: true });
			} else {
				// add a new filter key
				data[i][id] = result;
				// update the existing data
				this.data( data[i], { key : i, silent: true });
				// save the query
				this._queries[id] = number;
			}
		}
	}

};