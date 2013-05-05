// force chart
var force = function( self ) {

        this.self = self;
        // setup options
        utils.extend(self.options, this.defaults);
    
    };
    
force.prototype = {
    
    layout: "force",
    
    schema: {
        label: "string",
        value: "number"
    },
    
    defaults: {
        charge: -20,
        distance: 30,
        ir : 0,
        chart: {
            label: false,
            value: false
        }
    }, 
    
    constructor: force, 
    
    render: function( append ){ 
        
        var self = this.self;
        var svg = d3.select( self.el + " "+ self.options.container);
        var width = 1024,
        height = 768;
        
        var data = this.data();
        
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
        
        var node = svg.selectAll(".node")
            .data( data ).enter()
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
            data.forEach(function(o, i) {
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
    
    },
    
	// local 
	data: function(){
		var self = this.self,
            d = self.models;
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


        
Cloudvisio.prototype.charts.force = force;

