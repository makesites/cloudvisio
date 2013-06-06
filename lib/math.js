
Cloudvisio.prototype.process = function( key, value ) {
	console.log(key + " : "+value);
};

Cloudvisio.prototype.match = function( query, field ){
	var exp = new RegExp(query);
	//...
	// allow method chaining
	return this;
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
	var data = this.data();
	// reset filtered data - should be part of data()?
	this._filteredData = [];
	//
	for( var i in data ){
		if( options.eq && data[i][field] === number){
			this._filteredData.push( data[i] );
		}
		if( options.lt && data[i][field] < number){
			this._filteredData.push( data[i] );
		}
		if( options.gt && data[i][field] > number){
			this._filteredData.push( data[i] );
		}
	}
};