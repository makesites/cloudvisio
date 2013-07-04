
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
		id = (queries[i].id) ? queries[i].id : this._queryId();
		// insert selected data (field, type, query )
		this._queries[id] = { field: queries[i].field, type: queries[i].type, query: queries[i].query };
	}
	// return the id if entering one query
	return (query instanceof Array) ? this : id;
};

// refresh results of queries
Cloudvisio.prototype.refresh = function(){
	// variables
	var queries = this.queries;
	// discart filter?
	// loop through queries
	for(var i in queries){
		//
	}
};


// Internal

// - saving queries
Cloudvisio.prototype._queries = {};


Cloudvisio.prototype._queryId = function(){
	var prefix = "__query_";
	var queries = Object.keys( this._queries );
	var id;
	do {
		id = utils.uid();
	} while ( queries.indexOf( prefix + id ) > -1 );

	return prefix + id;
};
