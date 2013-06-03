
// convert the regular expression into a string
Cloudvisio.prototype.verbalize = function( query ){
	// replace signs
	query = query.replace(/\+/gi, " and ");
	query = query.replace(/>/gi, " greater than ");
	query = query.replace(/</gi, " less than ");

	// remove unnecessary spaces
	query = query.replace(/  /gi, " ");
};

Cloudvisio.prototype.status = function( type ){
	console.log( this._axis );
	//var el = d3.select( this.el );


};

// Helpers
