if( !window.Cloudvisio ) (function( d3 ){
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
	chart: {}
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
	options.colors = options.colors || defaults.colors;
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
	if (!arguments.length) return Object.keys( this.models[0] );
	// focus on a specific subset?
	var data = this.data();
	// lookup the key in the raw data
	for(var i in data){
		// create model if necessary
		if(typeof this.models[i] == "undefined" ) this.models[i] = {};
			
		// there's currenty a 1-1 match between the data length and the models length...
		if( typeof data[i][key] == "string" ){
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
	if (!arguments.length) return this.charts[this.options.layout] || null;
	// otherwise save provided chart.. evaluate the function first? 
	// create a new, non-conflicting container if it exists 
	if(typeof this.charts[this.options.layout] != "undefined"){ 
		this.options.layout = "untitled";
	}
	// either way save a referense of the chart
	this.charts[this.options.layout] = chart;

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

	var self = this;
	
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
            .attr("transform", "translate(30,470)");
			
	x = d3.scale.ordinal().rangeRoundBands([0, w]);
	y = d3.scale.linear().range([0, h]);
	
	var data = d3.layout.stack()( remapped );
	
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
		.data( labels )
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
		.attr("x2", w)
		.style("stroke", function(d) { return d ? "#fff" : "#000"; })
		.style("stroke-opacity", function(d) { return d ? 0.3 : null; });
		
	rule.append("svg:text")
		.attr("x", -20)
		.attr("dy", ".35em")
		.text(d3.format(",d"));
		

};

var arc = d3.svg.arc();

Cloudvisio.prototype.charts.pie = function() {

	var self = this;
	
	var r = 300, // width/2
		ir = 0,
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
		.attr("transform", "translate(" + r + "," + r + ")");
	
	// The data for each svg:svg element is a row of numbers (an array). We pass
	// that to d3.layout.pie to compute the angles for each arc. These start and end
	// angles are passed to d3.svg.arc to draw arcs! Note that the arc radius is
	// specified on the arc, not the layout.
	svg.selectAll("path")
		.data(d3.layout.pie())
		.enter().append("svg:path")
		.attr("class", "slice")    //allow us to style things in the slices (like text)
		.attr("d", arc
			.innerRadius( ir )
			.outerRadius(r))
		.style("fill", function(d, i) { return self.color( i ); });

	// animate slices
	svg.selectAll("path").transition()
		.ease("cubic")
		.duration(2000)
		.attrTween("d", tweenPie);
		
	// labels
	/*
	svg.append("svg:g")
		.attr("class", "label_group")
		//.attr("transform", "translate(" + (w/2) + "," + (h/2) + ")")
		.append("svg:text") 
		.style("font-size", function(d) { return (d.value * 1.5); })                                   //add a label to each slice
		.attr("fill", "grey")
		.attr("opacity", "100")
		.attr("transform", function(d) {                    //set the label's origin to the center of the arc
			//we have to make sure to set these before calling arc.centroid
			d.innerRadius = 0;
			d.outerRadius = r;
			return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
		})
		.attr("text-anchor", "middle")                          //center the text on it's origin
		.text(function(d, i) { return labels[i]; });        //get the label from our original data array
		.transition().ease("cubic").duration(2000).attrTween("transform", textTween);
	*/
	
};

function tweenPie(b) {
	b.innerRadius = 0;
	var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
	return function(t) {
		return arc(i(t));
	};
} 

// force chart
Cloudvisio.prototype.charts.force = function() {

	var self = this;
	var svg = d3.select( this.el + " "+ this.options.container);
	var width = 1000,
    height = 1000;

	var nodes = models();
	
	var force = d3.layout.force()
		.charge(-20)
		.linkDistance(30)
		.size([width, height])
		.nodes( nodes )
		.links([])
		.start();

	/*
	var groups = d3.nest().key(function(d) { return d.group & 3; }).entries( nodes );
	
	var groupPath = function(d) {
		return "M" + d3.geom.hull(d.values.map(function(i) { return [i.x, i.y]; })).join("L") + "Z";
	};
	
	var groupFill = function(d, i) { return self.color(i & 3); };
	*/
	
	var node = svg.selectAll(".node")
		.data( nodes ).enter()
		.append("circle")
		.attr("class", "node")
		.attr("r", 5)
		.style("fill", function(d) { return self.color( d.group ); })
		.call(force.drag);

	node.append("title")
		.text(function(d) { return d.name; });
	
	force.on("tick", function(e) {
	
		
		// Push different nodes in different directions for clustering.
		var k = 6 * e.alpha;
		nodes.forEach(function(o, i) {
			//o.x += i & 2 ? k : -k;
			//o.y += i & 1 ? k : -k;
			o.x += (o.group + 2) & 2 ? k : -k;
			o.y += (o.group + 2) & 1 ? k : -k;
		});
		
		node.attr("cx", function(d) { return d.x; })
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

	});

	// local 
	function models(){
		var d = self.models;
		// get keys
		var keys = self.keys( d );
		// required data: 
		// - name (string)
		var name, group;
		// - group (integer)
		if( keys.indexOf("id") > -1 ) name = "id";
		if( keys.indexOf("title") > -1 ) name = "title";
		if( keys.indexOf("label") > -1 ) name = "label";
		if( keys.indexOf("name") > -1 ) name = "name";
		for( var i in keys ){
			if( keys[i].search(/group_/gi) === 0 ) group =  keys[i];
		}
		//
		var result = [];
		for( var j in d ){
			result.push({
				name : d[j][name], 
				group : d[j][group]
			});
		}
		//
		return result;
	}
	
};


// rendering the visualization (generated once)
Cloudvisio.prototype.render = function(){
	
	var chart = this.chart();
	if( chart !== null)
		chart.call(this, arguments);
	//.transition().duration(500).call( this.chart() );
	
	
};

// updating visualization (on every tick)
Cloudvisio.prototype.update = function(){
	
};


// updating options dynamically
Cloudvisio.prototype.set = function( obj ){
	if( !(obj instanceof Object) ) return this;
	for( var i in obj){
		this.options[i] = obj[i];
	}
	// 
	return this;
};


// Internal methods
// creates the chart container
Cloudvisio.prototype._container = function(){
	
	var width = 1000,
    height = 1000;

	var svg = d3.select( this.el )
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


//module.exports = Cloudvisio;

})( window.d3 );