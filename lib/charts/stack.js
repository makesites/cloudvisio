// stacked/bar chart
Cloudvisio.prototype.charts.stack = function( append ) {

	var self = this;
	var width = 1024,
    height = 768;
    
	var nodes = models();
	
	var svg = d3.select( this.el + " "+ this.options.container)
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
		
	
	function models(){
		var label = self.options.chart.label, 
			value = self.options.chart.value;
	
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
