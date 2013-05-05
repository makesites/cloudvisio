
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
Cloudvisio.prototype.parse = function( data ){
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

// return the matchs of a regular expression
Cloudvisio.prototype.find = function( query, string ){
	if( query instanceof Array) query = query.join("|");
	var regexp = new RegExp(query, "gi");
	return string.match(regexp);
};

// retrieve all keys from a data block (currently non-recursive)
Cloudvisio.prototype.keys = function( data ){
	// fallback to the raw data
	data = data || this.data();
	//
	var keys = [];
	for(var i in data){
		var attr = Object.keys(  data[i] );
		for( var j in attr ){
			// don't add the same key 
			if( keys.indexOf( attr[j] ) > -1 ) continue;
			keys.push( attr[j] );
		}
	}
	//
	return keys;
};

// set an axis key (or return the whole array
Cloudvisio.prototype.axis = function( key ){
	// return the existing data if none is passed...
	if (!arguments.length) return Object.keys( this.models[0] || {} );
	// focus on a specific subset?
	var data = this.data();
	// lookup the key in the raw data
	for(var i in data){
		// create model if necessary
		if(typeof this.models[i] == "undefined" ) this.models[i] = {};
			
		// there's currenty a 1-1 match between the data length and the models length...
		if( typeof data[i][key] == "string" || typeof data[i][key] == "number"){
			this.models[i][key] = data[i][key];
		} else if( typeof data[i][key] == "object" ){
			// by priority look up a desciptive key in the object
			this.models[i][key] = data[i][key].value || data[i][key].name || data[i][key].title || data[i][key].id || data[i][key];
		} else {
			// not supporting any other types for now...
			this.models[i][key] = null;
		}
		//
		
	}
	// maintain chanability
	return this;
};

// group models based on axis results
Cloudvisio.prototype.group = function( groups, axis){ 
	// convert groups to lower case
	groups = groups.join("`").toLowerCase().split("`");
	// lookup the right axis
	for( var i in this.models ){
		var model = this.models[i];
		if( typeof model[axis] != "undefined"){
			var matches = this.find(groups, model[axis]);
			// process results
			//if(matches !== null);
			if(matches instanceof Array){
				// are we expecting more than one matches??
				var group = matches.pop().toLowerCase();
				model["group_"+axis] = groups.indexOf( group);
			} else {
				model["group_"+axis] = -1;
			}
		} else {
			//model["group_"+axis] = null;
			model["group_"+axis] = -1;
		}
	}
	// save groups for later
	this.options.chart["group_"+axis] = groups;
	//'match(/(high)/gi, ).;
}; 

// removing axis 
Cloudvisio.prototype.remove = function( axis ){
    for( var i in this.models ){
        var model = this.models[i];
        if( typeof model[axis] != "undefined"){
            delete this.models[i][axis];
        }
    }
};


// Internal 
// - raw data container
Cloudvisio.prototype._data = {};

