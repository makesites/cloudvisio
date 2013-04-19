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
