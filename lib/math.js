
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
	// create a new query
	var id = { field: field, type: type, query: number };
	//
	for( var i in data ){
		var opt = {
			silent: true,
			filter: options.filter
		};
		var result, type;
		if( options.eq){
			result = (data[i][field] === number);
			type = "eq";
		}
		if( options.lt){
			result = (data[i][field] < number);
			type = "lt";
		}
		if( options.gt){
			result = (data[i][field] > number);
			type = "gt";
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
		// update the existing data
		this.data( data[i], opt);
	}

};