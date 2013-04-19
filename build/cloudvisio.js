if( !window.Cloudvisio ) (function( d3 ){
var defaults = {
	el: "#vis", 
	layout: "stack", 
	container: "svg", 
	width: "100%", 
	height: "100%"
};
// dependencies
//var d3 = require("d3");

Cloudvisio = function( options ){
	// variables
	options = options || {};
	
	// merge with defaults
	this.el = options.el || defaults.el;
	options.layout = ( options.layout || defaults.layout ).toLowerCase();
	options.container = options.container || defaults.container;
	options.width = options.width || defaults.width;
	options.height = options.height || defaults.height;
	// save options for later...
	this.options = options;
	// add the appropriate chart
	var layout = this.charts[ options.layout] || this.charts.stack;
	this.chart( layout );
	
	
	// setup 
	this._container();
};

Cloudvisio.prototype = {
	
	constructor: Cloudvisio, 
	
	description : function() {
		return "Cloudvisio running on D3";
	}

};



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



Cloudvisio.prototype.process = function( key, value ) {
	console.log(key + " : "+value);
};

Cloudvisio.prototype.match = function( query, field ){
	var exp = new RegExp(query);
	//...
	// allow method chaining
	return this;
};


// convert the regular expression into a string
Cloudvisio.prototype.verbalize = function(){
	
};

// Helpers


// adding a new (custom chart)
Cloudvisio.prototype.chart = function( chart ){
	if (!arguments.length) return this._chart;
	// evaluate the function first? 
	this._chart = chart;
	// save a referense of the chart if it doesn't exist 
	if(typeof this.charts[this.options.layout] == "undefined"){ 
		this.charts[this.options.layout] = chart;
	}
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


// stacked/bar chart
Cloudvisio.prototype.charts.stack = function() {

	var w = 960,
	h = 500, 
	label = "country", 
	value = "population";
	
	var labels = this.models.map(function( data, i ){
		return data[label];
	});
	
	var values = this.models.map(function( data, i ){
		return { x : i, y : data[value] };
	});
	
	// in a stacked bar there's more than one passes from the models
	var remapped = [values];
	
	var svg = d3.select( this.el + " "+ this.options.container)
            .append("svg:g")
            .attr("transform", "translate(10,470)");
			
	x = d3.scale.ordinal().rangeRoundBands([0, w-50]);
	y = d3.scale.linear().range([0, h-50]);
	z = d3.scale.ordinal().range(["darkblue", "blue", "lightblue"]);
	
	var data = d3.layout.stack()( remapped );
	
	x.domain(data[0].map(function(d) { return d.x; }));
	y.domain([0, d3.max(data[data.length - 1], function(d) { return d.y0 + d.y; })]);
	
	// Add a group for each column.
	var valgroup = svg.selectAll("g.valgroup")
	.data( data )
	.enter().append("svg:g")
	.attr("class", "valgroup")
	.style("fill", function(d, i) { return z(i); })
	.style("stroke", function(d, i) { return d3.rgb(z(i)).darker(); });
	
	// Add a rect for each date.
	var rect = valgroup.selectAll("rect")
	.data(function(d){return d;})
	.enter().append("svg:rect")
	.attr("x", function(d) { return x(d.x); })
	.attr("y", function(d) { return -y(d.y0) - y(d.y); })
	.attr("height", function(d) { return y(d.y); })
	.attr("width", x.rangeBand());
	
};

Cloudvisio.prototype.charts.pie = function() {

 
var m = 0,
    r = 100,
	ir = 0,
    z = d3.scale.category20c(), 
	label = "country", 
	value = "population";
 
 
	var labels = this.models.map(function( data, i ){
		return data[label];
	});
	
	var values = this.models.map(function( data, i ){
		return data[value];
	});
	
	var data = [values];
	
// Insert an svg:svg element (with margin) for each row in our dataset. A
// child svg:g element translates the origin to the pie center.
var svg = d3.select( this.el + " "+ this.options.container)
    .data( data )
  .append("svg:g")
    .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");
 
// The data for each svg:svg element is a row of numbers (an array). We pass
// that to d3.layout.pie to compute the angles for each arc. These start and end
// angles are passed to d3.svg.arc to draw arcs! Note that the arc radius is
// specified on the arc, not the layout.
svg.selectAll("path")
    .data(d3.layout.pie())
  .enter().append("svg:path")
    .attr("d", d3.svg.arc()
    .innerRadius( ir )
    .outerRadius(r))
    .style("fill", function(d, i) { return z(i); });
 
};

// rendering the visualization (generated once)
Cloudvisio.prototype.render = function(){
	d3.select( this.el + " "+ this.options.container).data(this.models);
	var chart = this.chart();
	chart.call(this, arguments);
	//.transition().duration(500).call( this.chart() );
};

// updating visualization (on every tick)
Cloudvisio.prototype.update = function(){
	
};

// Internal methods
// creates the chart container
Cloudvisio.prototype._container = function(){
	d3.select( this.el )
		.append( this.options.container )
		.attr("width", this.options.width)
		.attr("height", this.options.height);
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


//module.exports = Cloudvisio;

})( window.d3 );