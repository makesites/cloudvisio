
// retrieving chart (or adding a new custom chart)
Cloudvisio.prototype.chart = function( chart ){
	if (!arguments.length) return this._chart;
	// otherwise save provided chart.. evaluate the function first?
	// create a new, non-conflicting container if it exists
	//if(typeof this.charts[this.options.layout] != "undefined"){
	//	this.options.layout = "untitled";
	//}
	var Chart; // class name
	// find the right chart
	if(typeof chart == "string"){
		// find chart from the charts collection
		Chart = this.charts[ chart ] || null;
		// exit now if we didn't find it...
		if( Chart === null ) return this;
	} else if(typeof chart == "function"){
		Chart = chart;
		var layout = chart.prototype.layout || "untitled";
		// it it's a new layout...
		if(typeof this.charts[ layout ] == "undefined"){
			this.charts[this.options.layout] = chart;
			// set the new layout automatically?
			this.options.layout = layout;
		}
	}
	//
	// either way create a new instance of the chart
	this._chart = new Chart( this );
	//this.charts[this.options.layout]
	// preserve chainability
	return this;
};

// default layouts
//var charts = ["stack", "pie"];
//
Cloudvisio.prototype.charts = {};

// loop through charts
//for(var i in charts){
//	Cloudvisio.prototype.charts[ charts[i] ] = charts[i];
//}

Cloudvisio.prototype._lookupSchema = function( type, preferred ){
	// fallbacks
	type = type || false;
	preferred = preferred || false;
	// prerequisite
	if( !type ) return false;
	// variables
	var keys = Object.keys( this._axis );
	if( !keys ) return false;
	var schema = this.chart().schema;
	// if there's a preferred field, try to pick that
	//console.log("schema", schema);
	if( preferred && keys[preferred] && schema[preferred] == type){
		console.log("preferred", preferred);
		return preferred;
	}
	for( var i in schema ){
		if( schema[i] == type ) return i;
	}
	return false;
};

// Internal
// - instantiated chart
Cloudvisio.prototype._chart = null;
