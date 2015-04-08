
var math = {

	process: function( key, value ) {
		console.log(key + " : "+value);
	},

	eq: function( number, options ){
		//
		options = options || {};
		options.eq = true;
		this._filterNumber( number, options );
		// allow method chaining
		return this;
	},

	gt: function( number, options ){
		//
		options = options || {};
		options.gt = true;
		this._filterNumber( number, options );
		// allow method chaining
		return this;
	},


	lt: function( number, options ){
		//
		options = options || {};
		options.lt = true;
		this._filterNumber( number, options );
		// allow method chaining
		return this;
	},

	// Applying a filter based on an operator
	_filterNumber: function( number, options ){
		//
		options = options || {};
		var field = this._selectedField || options.field || false;
		// exit now if theres no selected field
		if( !field ) return;
		// check if the query is a number
		if(isNaN(number)) return;
		// in case of a string
		number = parseFloat(number);
		// get the data
		var data = this.data(null, { raw : true });
		// create a new query
		var type = null;
		if( options.eq) type = "eq";
		if( options.lt) type = "lt";
		if( options.gt) type = "gt";
		//
		var id = this.queries({ field: field, type: type, query: number }, options);
		//
		for( var i in data ){
			var opt = {
				silent: true,
				filter: options.filter
			};
			var result;
			if( options.eq){
				result = (data[i][field] === number);
			}
			if( options.lt){
				result = (data[i][field] < number);
			}
			if( options.gt){
				result = (data[i][field] > number);
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

	}

}


module.exports = math;