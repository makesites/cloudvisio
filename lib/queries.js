var utils = require('./utils');

var queries = {

	// set or retrieve the queries applied
	queries: function( query, options ){
		if (!arguments.length) return this._queries;
		// fallbacks
		query = query || false;
		options = options || {};
		options.restore = options.restore || false;
		// exit now if there; sno query
		if( !query ) return this;
		// get a query if given string
		if(typeof query == "string") return this._queries[ query ];
		// check if the query passed is a set of existing queries
		if(!options.restore && query instanceof Object){
			for( var q in query ){
				if( q.search(/__query/gi) > -1 ){
					// restoring previously set queries
					options.restore = true;
				}
			}
		}
		// set a query if given object
		var queries = (options.restore || query instanceof Array) ? query : [query];
		//
		var id = false;
		for( var i in queries ){
			// check if query exists first?
			if( options.restore ){
				id = i;
			}
			// create a new field for the query
			id = (!id && queries[i].id) ? queries[i].id : this._queryId();
			// get the sort if not set (this could also be done in _filterString, _filterNumber)
			if( typeof queries[i].sort == "undefined"){
				//
				if( options.exclude ){
					queries[i].sort = "exclude";
				}else if( options.filter ){
					queries[i].sort = "filter";
				} else {
					queries[i].sort = "group";
				}
			}
			// insert selected data (field, type, query )
			this._queries[id] = { field: queries[i].field, type: queries[i].type, query: queries[i].query, sort: queries[i].sort };
		}
		// return the id if entering one query
		return (query instanceof Array) ? this : id;
	},

	// refresh results of queries
	refresh: function(){
		// variables
		var queries = this.queries;
		// discart filter?
		// loop through queries
		for(var i in queries){
			//
			this.queries(queries[i]);
		}
	},

	// Internal

	// - saving queries
	_queries: {},

	_queryId: function(){
		var prefix = "__query_";
		var queries = Object.keys( this._queries );
		var id;
		do {
			id = utils.uid();
		} while ( queries.indexOf( prefix + id ) > -1 );

		return prefix + id;
	}

}


module.export = queries;
