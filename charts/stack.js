// dependencies
var d3 = require('d3');

// stacked/bar chart
var stack = function( self ) {

		this.self = self;
		// setup options
		self.set( this.defaults );
		// set axis
		//self._axisSchema( this.schema );

	};

stack.prototype = {

	layout: "stack",

	schema: {
		x: "number",
		y: "number",
		//text: "string" // optional
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

		// Add a label per axis
		svg.selectAll("text")
			.data( nodes.labels )
			.enter().append("svg:text")
			//.attr("x", function(d) { return x(d) + x.rangeBand() / 2; })
			.attr("x", function(d) { return x.rangeBand() / 2; })
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
			//.text(function(d) { console.log("d", d);return nodes.values[d].text; });
			.text(d3.format(",d"));

	},

	data: function(){
		var self = this.self;
		var labels = [], values = [], x;
		// check for the x axis
		if( self._axis.x ){
			x = self._axis.x;
			// add label
			labels.push( x );
		}

		// loop through axis
		for( var key in self._axis ){
			var label = self._axis[key];
			// the first axis is the x axis (unless it exists)
			if( !x ){
				x = label;
				// add label
				labels.push( label );
				continue;
			}
			if( key == "x" ) continue;
			// add label
			labels.push( label );
			// normalize data
			var data = self.models.map(function( item, i ){
				return { x : ( typeof item[x] == "number" ) ? item[x] : i, y : parseInt( item[label], 10 ), text: item[x] };
			});

			values.push( data );
		}
		// in a stacked bar there's more than one passes from the models
		return {
			labels : labels,
			values : values
		};

	}
};


module.exports = stack;
