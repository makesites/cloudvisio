// force chart
var force = function( self ) {

		this.self = self;
		// setup options
		self.set( this.defaults );

	};

force.prototype = {

	layout: "force",

	schema: {
		label: "string",
		value: "number",
		radius: "number"
	},

	defaults: {
		charge: -20,
		distance: 30,
		ir : 0,
		radius: 5,
		chart: {
			label: false,
			value: false,
			radius: false
		}
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
		var name = self.options.chart.label,
			group = self.options.chart.value,
			radius = self.options.chart.radius;
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

