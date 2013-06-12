// @name cloudvisio - 0.5.0 (Wed, 12 Jun 2013 12:42:07 GMT)
// @url https://github.com/makesites/cloudvisio

// @author makesites
// @license Apache License, Version 2.0

if( !window.Cloudvisio ) (function( d3 ){
// dependencies
//var d3 = require("d3");

Cloudvisio = function( options ){
	// variables
	options = options || {};
	this.options = {};

	// get the el
	this.el = options.el || defaults.el;
	// clean up options
	options.layout = ( options.layout || defaults.layout ).toLowerCase();
	// extend with the defaults
	options = utils.extend( defaults, options );
	/*
	options.container = options.container || defaults.container;
	options.width = options.width || defaults.width;
	options.height = options.height || defaults.height;
	options.colors = options.colors || defaults.colors;
	*/
	// add the appropriate chart
	//this.chart( options.layout );
	// ovewrite the default values (with the passed ones)
	//this.options = utils.extend( this.options, options );
	this.set( options );

};

Cloudvisio.prototype = {

	constructor: Cloudvisio,

	description : function() {
		return "Cloudvisio running on D3";
	},

	options: {} // why isn't this available in the constructor?

};


var defaults = {
	el: "#vis",
	layout: "stack",
	container: "svg",
	width: "100%",
	height: "100%",
	// The color scale will be assigned by index, but if you define your data using objects, you could pass
	// in a named field from the data object instead, such as `d.name`. Colors are assigned lazily,
	// so if you want deterministic behavior, define a domain for the color scale.
	colors: d3.scale.category20c(),
	//colors: d3.scale.ordinal().range(["darkblue", "blue", "lightblue"]);
	renderErrors: false
};


// updating options dynamically
Cloudvisio.prototype.set = function( obj ){
	if( !(obj instanceof Object) ) return this;
	// merge the final object
	utils.extend(this.options, obj);
	// special condition for layouts
	if( obj.layout ) this.chart( obj.layout );

	//
	return this;
};


// this is where the axis will be stored
Cloudvisio.prototype.models = [];

// load a dataset
Cloudvisio.prototype.data = function( models, options ){
	// fallbacks
	options = options || {};
	// return the existing data if none is passed...
	if ( !arguments.length ) return this._data;
	//
	var data = this._data;
	// check if the data we're adding is in an array
	if( models instanceof Array){
		// resetting only if set with an option
		if( options.reset ){
			data = models;
		} else {
			data = data.concat(models);
		}
	} else if( models instanceof Object) {
		// all individual imports are silent
		options.silent = true;
		//
		if( options.filter ){
			models.__filter = true;
		}
		// passing the key as an option - better way?
		if( options.key ){
			data[options.key] = models;
		} else {
			data.push(models);
		}
	} else {
		// nothing else supported for now
		return this;
	}
	// reset the models
	if( options.silent ){
		// don't erase models
	} else {
		// reset the models
		this.models = [];
	}
	// save data back to the common container
	this._data = data;

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
	// setup the axis by checking if the chart is ready
	this.ready();
	// allow method chaining
	return this;
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
Cloudvisio.prototype.axis = function( key, value ){
	// return the existing data if none is passed...
	if (!arguments.length) return Object.keys( this.models[0] || {} );
	// #24 if key is an object loop through options
	if( key instanceof Object ){
		for( var k in key ){
			this.axis( k, key[k] );
		}
	}

	// focus on a specific subset?
	var data = this.data();
	// lookup the key in the raw data
	for(var i in data){
		// create model if necessary
		if(typeof this.models[i] == "undefined" ) this.models[i] = {};

		if(typeof value != "undefined"){
			// if a value is passed just use that
			this.models[i][key] = value;
		} else if( typeof data[i][key] == "string" || typeof data[i][key] == "number"){
			// there's currenty a 1-1 match between the data length and the models length...
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
	// setup the _axis
	if(typeof value != "undefined") this._axis[key] = value;
	/*
	for( var i in obj){
		if( i == "chart" ){
			var options = this._axis || {};
			var chart = obj[i];
			// reset options now
			this._axis = {};
			// don't overwrite existing assignements
			for( var j in chart ){
				if( options[j] && typeof options[j] != "undefined" && !chart[j] ){
					obj[i][j] = options[j];
				}
			}
		}
	}
	*/
	// maintain chanability
	return this;
};

// select a field from the raw dataset
Cloudvisio.prototype.select = function( field ){
	var keys = this.keys();
	this._selectedField = (keys.indexOf(field) > -1 )? field : false;

	return this;
};

// calculate axis based on the queries
Cloudvisio.prototype.amount = function( options ){
	// get the (active) data
	var data = this.data();
	// also reset models?
	var calculated = 0;
	// lookup all the queries
	for(var i in this._queries ){
		var model = {
			label: "",
			value: 0
		};
		for(var j in data ){
			model.value += data[j][i];
		}
		// add labels
		if(options.labels){
			model.label = this._queries[i].query.toString();
		}
		// save the query result as a new axis
		this.models.push(model);
	}
	// add another item with the remaining
	if( calculated < data.length ){
		this.models.push({
			label: "other",
			value: data.length - calculated
		});
	}

};

// removing axis
Cloudvisio.prototype.remove = function( axis ){
	for( var i in this.models ){
		var model = this.models[i];
		if( typeof model[axis] != "undefined"){
			delete this.models[i][axis];
		}
	}
	return this;
};

// public access of findType
Cloudvisio.prototype.type = function( key, options ){
	// lookup the key in the models first
	if( this.models.length && this.models[0][key] ){
		// everything is fine...
		return this._findType( key );
	} else {
		return this._findType( key, this._data );
	}
};


// Internal
// - raw data container
Cloudvisio.prototype._data = [];
// - filtered data
Cloudvisio.prototype._filteredData = [];
// - chart fields set as axis
Cloudvisio.prototype._axis = {};
// - the last selected field
Cloudvisio.prototype._selectedField = false;
// - saving queries
Cloudvisio.prototype._queries = {};

Cloudvisio.prototype._axisSchema = function( schema ){
	// reset axis
	this._axis = {};
	for(var i in schema){
		this._axis[i] = false;
	}
};


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
	// create a new field for the query;
	var id = "__query_"+ utils.uid();
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
		if( options.exclude && data[i]["__filter"] !== false ){
			// when exluding don't consider the ones already filtered out
			data[i]["__filter"] = !result;
		} else if( options.filter && data[i]["__filter"] !== false ){
			data[i]["__filter"] = result;
		}
		// add a new query key
		data[i][id] = result;
		//
		opt.key = i;
		// update the existing data
		this.data( data[i], opt);
		// save the query
		this._queries[id] = { field: field, type: type, query: number };

	}

};
// Public methods

Cloudvisio.prototype.match = function( string, options ){
	//
	options = options || {};
	options.match = true;
	this._filterString( string, options );
	// allow method chaining
	return this;
};


// filter the data based on a regular expression
Cloudvisio.prototype.search = function( string, options ){
	//
	options = options || {};
	options.search = true;
	this._filterString( string, options );
	// allow method chaining
	return this;
};


// lookup a value in a field
Cloudvisio.prototype.find = function( query, options ){
	//
	options = options || {};
	if( typeof query == "boolean" ) {
		this.match( query, options );
	} else {
		// a find() always resets the axis?
		this.search( query, options );
	}
	// allow method chaining
	return this;
	/*
	options = options || {};
	// exit now if theres no selected field
	if( !this._selectedField ) return;
	var field = this._selectedField;
	// check if the query is a boolean
	if( typeof query == "boolean" ) query = (query) ? "true" : "false";
	// a find() always resets the axis?
	options.reset = true;
	this.group( [query], field, options);
	// allow method chaining
	return this;
	*/
};


// create an axis by grouping the raw data
Cloudvisio.prototype.group = function( groups, key, options){
	// fallbacks
	options = options || {};
	// variables
	var data = this.data();
	var field;
	// convert groups to lower case
	groups = groups.join("`").toLowerCase().split("`");
	// reset models if needed
	if( options.reset ){
		// create a model set equal to the length of the groups
		var length = (groups.length === 1) ? groups.length+1 : groups.length;
		this.models = new Array( length );
		field = "value";
		for( var k = 0; k < this.models.length; k++ ){
			this.models[k] = {};
			this.models[k][field] = 0;
			if( options.labels ){
				this.models[k].label = groups[k] || "not "+ groups[k-1];
			}else {
				this.models[k].label = "";
			}
		}
	} else {
		field = "group_"+key;
	}
	// lookup the right axis
	for( var i in data ){
		var model;
		if( !options.reset ){
			// create the model if this is the first axis
			this.models[i] = this.models[i] || {};
			model = this.models[i];
		}
		if( typeof data[i][key] != "undefined"){
			// convert any value to string
			var value = (data[i][key] instanceof Object) ? utils.toArray( data[i][key] ).join("|") : ""+data[i][key]+"";

			//
			var matches = this._find(groups, value);
			// process results
			//if(matches !== null);
			if(matches instanceof Array){
				// are we expecting more than one matches??
				var group = matches.pop().toLowerCase();
				if( options.reset ){
					this.models[ groups.indexOf( group ) ][field] += 1;
				} else {
					this.models[i][field] = groups.indexOf( group );
				}
			} else {
				if( options.reset ){
					this.models[groups.length][field] += 1;
				} else {
					this.models[i][field] = -1;
				}
			}
			/*
			// support types other than string
			switch(typeof value){
				case "string":

				break;
				case "boolean":
					console.log(groups);
					// in this case we do a direct comparison (sting comparisson
					this.models[i]["group_"+key] = groups.indexOf( value.toString() );
					console.log();
				break;
			}
			*/
		} else {
			//model["group_"+axis] = null;
			if( options.reset ){
				this.models[groups.length][field] += 1;
			} else {
				this.models[i][field] = -1;
			}
		}
	}
	// save latest group
	// #30 pick the right axis
	var selected  = this._lookupSchema("number", field);
	this._axis[selected] = field;

	return this;
};


Cloudvisio.prototype.reverse = function(){
	// set the flag for reference
	this._reverseQuery = true;
};


// Internal objects
Cloudvisio.prototype._reverseQuery = false;


// Internal methods

// Return the matches of a regular expression
Cloudvisio.prototype._find = function( query, string ){
	if( query instanceof Array) query = query.join("|");
	var regexp = new RegExp(query, "gi");
	return string.match(regexp);
};


// Applying a filter based on an regulat expression
Cloudvisio.prototype._filterString = function( string, options ){
	//
	options = options || {};
	var field = this._selectedField || options.field || false;
	// exit now if theres no selected field
	if( !field ) return;
	// check if the query is a number
	//if(typeof string != "string") return;
	// get the data
	var data = this.data(null, { raw : true });
	// create a new field for the query
	var id = "__query_"+ utils.uid();
	//
	for( var i in data ){
		var opt = {
			silent: true,
			filter: options.filter
		};
		var result, type;
		if( options.match ){
			result = (data[i][field] === string);
			type = "match";
		}
		if( options.search ){
			var exp = new RegExp(string, "gi");
			result = ( data[i][field].search(exp) > -1 );
			type = "search";
		}
		// make the necessary adjustments to the data
		if( options.exclude && data[i]["__filter"] !== false ){
			// when exluding don't consider the ones already filtered out
			data[i]["__filter"] = !result;
		} else if( options.filter && data[i]["__filter"] !== false ){
			data[i]["__filter"] = result;
		}
		// add a new query key
		data[i][id] = result;
		//
		opt.key = i;
		// update the existing data
		this.data( data[i], opt);
		// save the query
		this._queries[id] = { field: field, type: type, query: string };
	}
};





// convert the regular expression into a string
Cloudvisio.prototype.verbalize = function( query ){
	// replace signs
	query = query.replace(/\+/gi, " and ");
	query = query.replace(/>/gi, " greater than ");
	query = query.replace(/</gi, " less than ");

	// remove unnecessary spaces
	query = query.replace(/  /gi, " ");
};

// Display status messages about the chart generation
Cloudvisio.prototype.status = function( render ){
	var flags = {};
	var chart = this.chart();
	render = render || false;
	// check if the data is empty
	//if( Object.keys( this._data ).length === 0 ) flags.push("001");
	if( this._data.length === 0 ) flags[101] = status[101];
	// check if there are any axis
	if( this.models.length === 0 ) flags[102] = status[102];
	// look into each individual missing axis

	for(var i in this._axis ){
		var axis = this._axis[i];
		if( !axis ){
			var type = chart.schema[i];
			switch(type){
				case "string":
					flags[103] = status[103].replace(/_field_/gi, i);
				break;
				case "number":
					flags[104] = status[104].replace(/_field_/gi, i);
				break;
			}
			//console.log(i);
		}
	}
	// if everything is OK return a standard 200
	if( Object.keys( flags ).length === 0 ) flags[200] = status[200];
	if( render ){
		var el = d3.select( this.el );
		// create html
		var html = '<div class="error">';
		html += "<p>There were the following errors:</p>";
		html += "<ul>";
		for(var j in flags){
			html += "<li>"+ flags[j] +"</li>";
		}
		html += "</ul>";
		html += "</div>";
		el.html( html );
	}
	// either way return the flags as an object
	return flags;
};


// Helpers
var status = {
	101: "Missing source data",
	102: "No axis created",
	103: "Missing string: _field_",
	104: "Missing number: _field_",
	105: "Missing group: _field_",
	200: "OK"
};

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

// stacked/bar chart
var stack = function( self ) {

		this.self = self;
		// setup options
		self.set( this.defaults );
		// set axis
		self._axisSchema( this.schema );

	};

stack.prototype = {

	layout: "stack",

	schema: {
		label: "string",
		value: "number"
	},

	defaults: {
	},

	constructor: stack,

	render: function( append ){

		var self = this.self;
		var width = 1024,
		height = 768;

		var nodes = this.data();

		var svg = d3.select( self.el + " "+ self.options.container)
				.append("svg:g")
				.attr("transform", "translate(30,738)");

		x = d3.scale.ordinal().rangeRoundBands([0, width]);
		y = d3.scale.linear().range([0, height]);

		var data = d3.layout.stack()( nodes.values );

		x.domain(data[0].map(function(d) { return d.x; }));
		y.domain([0, d3.max(data[data.length - 1], function(d) { return d.y0 + d.y; })]);

		// Add a group for each column.
		var valgroup = svg.selectAll("g.valgroup")
			.data( data )
			.enter().append("svg:g")
			.attr("class", "valgroup")
			.style("fill", function(d, i) { return self.color(i); })
			.style("stroke", function(d, i) { return d3.rgb( self.color(i)).darker(); });

		// Add a rect for each date.
		var rect = valgroup.selectAll("rect")
			.data(function(d){return d;})
			.enter().append("svg:rect")
			.attr("x", function(d) { return x(d.x); })
			.attr("y", function(d) { return -y(d.y0) - y(d.y); })
			.attr("height", function(d) { return y(d.y); })
			.attr("width", x.rangeBand());

		//parse = d3.time.format("%m/%Y").parse,
		//format = d3.time.format("%b");

		// Add a label per date.
		svg.selectAll("text")
			.data( nodes.labels )
			.enter().append("svg:text")
			.attr("x", function(d) { return x(d) + x.rangeBand() / 2; })
			.attr("y", 6)
			.attr("text-anchor", "middle")
			.attr("dy", ".71em")
			.text(function(d) { return d; });

		// Add y-axis rules.
		var rule = svg.selectAll("g.rule")
			.data(y.ticks(5))
			.enter().append("svg:g")
			.attr("class", "rule")
			.attr("transform", function(d) { return "translate(0," + -y(d) + ")"; });

		rule.append("svg:line")
			.attr("x2", width)
			.style("stroke", function(d) { return d ? "#fff" : "#000"; })
			.style("stroke-opacity", function(d) { return d ? 0.3 : null; });

		rule.append("svg:text")
			.attr("x", -20)
			.attr("dy", ".35em")
			.text(d3.format(",d"));

	},

	data: function(){
		var self = this.self;

		var label = self._axis.label,
			value = self._axis.value;

		var labels = self.models.map(function( data, i ){
			return data[label];
		});

		var values = self.models.map(function( data, i ){
			return { x : i, y : data[value] };
		});

		// in a stacked bar there's more than one passes from the models
		return {
			labels : labels,
			values : [values]
		};

	}
};

Cloudvisio.prototype.charts.stack = stack;

var arc = d3.svg.arc();

var pie = function( self ) {

		this.self = self;
		// setup options
		self.set( this.defaults );
		// set axis
		self._axisSchema( this.schema );

	};

pie.prototype = {

	layout: "pie",

	schema: {
		label: "string",
		value: "number"
	},

	defaults: {
		r : 384, // radius, height/2
		ir : 0,
		textOffset: 100
	},

	constructor: pie,

	render: function( append ){

		var width = 1024, // internal (non-customizable) width
			height = 768, // internal (non-customizable) height
			self = this.self,
			data = this.data();

		// Insert an svg:svg element (with margin) for each row in our dataset. A
		// child svg:g element translates the origin to the pie center.
		var svg = d3.select( self.el + " "+ self.options.container)
					.data( data ) //associate our data with the document
					.append("svg:g")
					.attr("transform", "translate(" + width/2 + "," + height/2 + ")");

		// add pie group
		var pie = d3.layout.pie() //this will create arc data for us given a list of values
					.value(function(d) { return d.value; }) // Binding each value to the pie
					.sort( function(d) { return null; } );

		// Select all <g> elements with class slice (there aren't any yet)
		var arcs = svg.selectAll("g.slice")
			// Associate the generated pie data (an array of arcs, each having startAngle,
			// endAngle and value properties)
			.data(pie)
			// This will create <g> elements for every "extra" data element that should be associated
			// with a selection. The result is creating a <g> for every object in the data array
			.enter()
			// Create a group to hold each slice (we will have a <path> and a <text>
			// element associated with each slice)
			.append("svg:g")
			.attr("class", "slice"); //allow us to style things in the slices (like text)

		// The data for each svg:svg element is a row of numbers (an array). We pass
		// that to d3.layout.pie to compute the angles for each arc. These start and end
		// angles are passed to d3.svg.arc to draw arcs! Note that the arc radius is
		// specified on the arc, not the layout.

		var slices = arcs.append("svg:path")
			.attr("alt", function(d) { return d.data.label; })
			.attr("d", arc
						.innerRadius( self.options.ir )
						.outerRadius( self.options.r )
				)
			.style("fill", function(d, i) { return self.color( i ); });

		// animate slices
		slices.transition()
			.ease("cubic")
			.duration(2000)
			.attrTween("d", this.tweenPie);

		var label = arcs.append("svg:text")
			.style("font-size", function(d) { return Math.max( 1, (d.data.value/100) ) * 15; })                                   //add a label to each slice
			.attr("fill", "white")
			.attr("transform", function(d, i) {                    //set the label's origin to the center of the arc
				//we have to make sure to set these before calling arc.centroid
				d.innerRadius = self.options.r/2;
				d.outerRadius = self.options.r;
				return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
			})
			.attr("text-anchor", "middle")                          //center the text on it's origin
			.text(function(d, i) { return d.data.label; })        //get the label from our original data array
			.style("opacity", 0)
			.transition().ease("cubic").duration(2000).style("opacity", 1);
			//.transition().ease("cubic").duration(2000).attrTween("opacity", d3.interpolateNumber(0, 100) );

	},

	data: function (){
		var self = this.self,
			data = [];

		var label = self._axis.label,
			value = self._axis.value;

		data = self.models.map(function( data, i ){
			return { label: data[label], value: data[value] };
		});

		return [data];
	},

	// helpers
	tweenPie: function(b) {
		b.innerRadius = 0;
		var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
		return function(t) {
			return arc(i(t));
		};
	}
};



Cloudvisio.prototype.charts.pie = pie;


// force chart
var force = function( self ) {

		this.self = self;
		// setup options
		self.set( this.defaults );
		// set axis
		self._axisSchema( this.schema );

	};

force.prototype = {

	layout: "force",

	schema: {
		label: "string",
		group: "number",
		radius: "number"
	},

	defaults: {
		charge: -20,
		distance: 30,
		ir : 0,
		radius: 5
	},

	constructor: force,

	render: function( append ){

		var self = this.self;
		var that = this;
		var svg = d3.select( self.el + " "+ self.options.container);
		var width = 1024,
		height = 768;

		var data = this.nodes = this.data();

		var force = d3.layout.force()
			.charge( self.options.charge )
			.linkDistance( self.options.distance )
			.size([width, height])
			.nodes( data )
			.links([])
			.start();

		/*
		var groups = d3.nest().key(function(d) { return d.group & 3; }).entries( nodes );

		var groupPath = function(d) {
		return "M" + d3.geom.hull(d.values.map(function(i) { return [i.x, i.y]; })).join("L") + "Z";
		};

		var groupFill = function(d, i) { return self.color(i & 3); };
		*/
		this.node = svg.selectAll(".node")
			.data( data ).enter()
			.append("circle")
			.attr("class", "node")
			.attr("r", function(d) { return d.radius; })
			.style("fill", function(d) { return self.color( d.group ); })
			.call(force.drag);

		this.node.append("title")
			.text(function(d) { return d.name; });

		force.on("tick", function(e){ that.update(e); });

	},

	// local
	data: function(){
		var self = this.self,
			d = self.models;
		// get keys
		//var keys = self.keys( d );
		// required data:
		// - name (string)
		var name = self._axis.label,
			group = self._axis.group,
			radius = self._axis.radius;
		// old code:
		// - group (integer)
		/*
		if( keys.indexOf("id") > -1 ) name = "id";
		if( keys.indexOf("title") > -1 ) name = "title";
		if( keys.indexOf("label") > -1 ) name = "label";
		if( keys.indexOf("name") > -1 ) name = "name";
		for( var i in keys ){
			if( keys[i].search(/group_/gi) === 0 ) group =  keys[i];
		}
		*/
		//
		var result = [];
		for( var j in d ){
			result.push({
				name : d[j][name],
				group : d[j][group],
				// if radius is a number, use it as a static value
				radius: ( isNaN(radius) )? d[j][radius] : radius
			});
		}
		//
		return result;
	},

	update: function(e) {

		// Push different nodes in different directions for clustering.
		var k = 6 * e.alpha;
		this.nodes.forEach(function(o, i) {
			//o.x += i & 2 ? k : -k;
			//o.y += i & 1 ? k : -k;
			o.x += (o.group + 2) & 2 ? k : -k;
			o.y += (o.group + 2) & 1 ? k : -k;
		});

		var q = d3.geom.quadtree( this.nodes ),
			i = 0,
			n = this.nodes.length;

		while (++i < n) {
			q.visit( this.collide( this.nodes[i] ));
		}

		this.node.attr("cx", function(d) { return d.x; })
			.attr("cy", function(d) { return d.y; });

		/*
		svg.selectAll("path")
		.data(groups)
		.attr("d", groupPath)
		.enter().insert("path", "circle")
		.style("fill", groupFill)
		.style("stroke", groupFill)
		.style("stroke-width", 40)
		.style("stroke-linejoin", "round")
		.style("opacity", .2)
		.attr("d", groupPath);
		*/

	},

	// Collision detection
	// Source: https://gist.github.com/GerHobbelt/3116713
	collide: function(node) {
		var r = node.radius + 16,
			nx1 = node.x - r,
			nx2 = node.x + r,
			ny1 = node.y - r,
			ny2 = node.y + r;

			return function(quad, x1, y1, x2, y2) {
				if (quad.point && (quad.point !== node)) {
				var x = node.x - quad.point.x,
					y = node.y - quad.point.y,
					l = Math.sqrt(x * x + y * y),
					r = node.radius + quad.point.radius;
				if (l < r) {
					l = (l - r) / l * 0.5;
					node.x -= x *= l;
					node.y -= y *= l;
					quad.point.x += x;
					quad.point.y += y;
				}
			}
		return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
		};

	}

};



Cloudvisio.prototype.charts.force = force;



// rendering the visualization (generated once)
Cloudvisio.prototype.render = function( append ){
	// fallbacks
	append = append || false;
	// chart is a prerequisite
	var chart = this.chart();
	if( chart === null) return;

	var options = {
		append : append
	};

	if( !this.ready() ){
		// exit now with an error message
		return ( this.options.renderErrors ) ? this.status("string") : this.status();
	}
	// ready to create chart
	// clear container (by default)
	if( !append ) {
		this._container();
	}

	chart.render( options );

	return this.status();
	//.transition().duration(500).call( this.chart() );

};

// updating visualization (on every tick)
Cloudvisio.prototype.update = function(){

};

// verifies that there's the minimum data for a chart
Cloudvisio.prototype.ready = function( layout ){
	// prerequisite - we need to have some data set...
	if( this.models.length === 0 ) return false;
	// main flag
	var state = true,
		chart, original_chart, original_options;
	//
	if(!arguments.length){
		// evaluate the current layout
		chart = this._chart;

	} else {
		// keep a reference of the original chart / options
		original_chart = this._chart;
		original_options = this._axis;
		this.chart( layout );
		chart = this._chart;
	}

	// check if all the required attributes are set
	for( var i in chart.schema ){
		var option = this._axis[i] || false;
		if(!option){
			// lookup a suitable option
			var type = chart.schema[i];
			option = this._findAxis( type );
			if( option ) {
				this._axis[i] = option;
				continue;
			} else {
				state = false;
			}
		}
	}

	// restore original layout if necessery
	if( arguments.length ){
		this._chart = original_chart;
		this._axis = original_options;
	}
	//
	return state;
};



// Internal methods
// creates the chart container
Cloudvisio.prototype._container = function(){

	var width = 1024,
	height = 768;

	var svg = d3.select( this.el ).html("")
		.append( this.options.container );

	function redraw() {
		svg.attr("transform", "translate("+ d3.event.translate +")" + " scale("+ d3.event.scale +")");
	}

	svg.attr({
			"width": this.options.width,
			"height":  this.options.height
		})
		.attr("viewBox", "0 0 " + width + " " + height )
		.attr("preserveAspectRatio", "xMidYMid meet")
		.attr("pointer-events", "all")
		.call(d3.behavior.zoom().on("zoom", redraw));

	return svg;

};

// make an intelligent decision on what the next axis may be
Cloudvisio.prototype._findAxis = function( type ){
	// get the keys of the model
	var keys = this.keys( this.models );
	if( !keys ) return false;
	var axis = utils.toArray( this._axis );
	// loop through the keys
	for( var i in keys ){
		// check that the key hasn't been used
		if( axis.indexOf( keys[i] ) > -1 ) continue;
		// get type of field
		if( type == this._findType( keys[i] )) return keys[i];
	}
	return false;
};

// get the type of the selected field
Cloudvisio.prototype._findType = function( key, data ){
	var type = false;
	data = data || this.models;
	// loop through models
	for(var i in data){
		var value = data[i][key];
		// #35 check if the value is a float
		if( !isNaN( parseFloat(value) ) ) value = parseFloat(value);
		var itype = (typeof value);

		// if we've found more than one types exit
		if( type && type != itype ) return "mixed";
		type = itype;
	}
	return type;
};

// define the color spectrum
Cloudvisio.prototype.colors = function( colors ){
	if (!arguments.length) return this.options.colors;
	//  overwrite existing color palette 
	this.options.colors = colors;
	// preserve chainability
	return this;
};

// get the next color in the selected spectrum
Cloudvisio.prototype.color = function(i) { 
	return (this.options.colors instanceof Function) ? this.options.colors(i) : this.options.colors[i]; // assume it's an array if not a function?
};


// Helpers
// - load template
function loadTemplate(file) {
	return file;
}

// Usage:
//traverse(options.data,process);
function traverse(o,func) {
	for ( var i in o) {
		func.apply(this, [i, o[i]]);
		if (typeof o[i] == "object" ) {
			//going on step down in the object tree!!
			traverse(o[i], func);
		}
	}
}


var utils = {

	// Common.js extend method: https://github.com/commons/common.js
	extend : function(destination, source) {
		for (var property in source) {
			if (source[property] && source[property].constructor && source[property].constructor === Object) {
				destination[property] = destination[property] || {};
				arguments.callee(destination[property], source[property]);
			} else {
				destination[property] = source[property];
			}
		}
		return destination;
	},

	// convert an object to an array (loosing the keys)
	toArray: function( obj ){
		var array = [];
		for( var i in obj ){
			array.push( obj[i] );
		}
		return array;
	},

	// checks if an object is in an array
	inArray: function( obj, list ){
		for (var i = 0; i < list.length; i++) {
			if (list[i] === obj) {
				return i;
			}
		}
		return -1;
	},

	// unique sequential id - based on: http://stackoverflow.com/a/14714979
	uid: (function(){var id=0;return function(){if(arguments[0]===0)id=0;return id++;};})(),

	// remove all special characters & spaces
	safeString: function( string ){
		return string.replace(/[^a-zA-Z0-9]/g,'');
	}

};


//module.exports = Cloudvisio;

})( window.d3 );