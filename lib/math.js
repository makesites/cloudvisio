
Cloudvisio.prototype.process = function( key, value ) {
	console.log(key + " : "+value);
};

Cloudvisio.prototype.match = function( query, field ){
	var exp = new RegExp(query);
	//...
	// allow method chaining
	return this;
};
