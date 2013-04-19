
// adding a new (custom chart)
Cloudvisio.prototype.chart = function( chart ){
	if (!arguments.length) return this._chart;
	console.log( chart );
	// evaluate the function first? 
	this._chart = chart;
	// preserve chainability
	return this;
};


// default chart
Cloudvisio.prototype._stack = function() {

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

Cloudvisio.prototype._pie = function() {

 
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