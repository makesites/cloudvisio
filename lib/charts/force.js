// force chart
Cloudvisio.prototype.charts.force = function( append ) {

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
