
// this is where the axis will be stored
Cloudvisio.prototype.models = [];

// load a dataset
Cloudvisio.prototype.data = function( raw ){
	// return the existing data if none is passed...
	if (!arguments.length) return this._data;
	// do some calculations 
	this._data = raw;
	// allow method chaining
	return this;
};

// load a dataset
Cloudvisio.prototype.set = function( data ){
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

// Internal 
// - raw data container
Cloudvisio.prototype._data = {};

