var arc = d3.svg.arc();

var pie = function( self ) {

        this.self = self;
        // setup options
        self.set( this.defaults );
    
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
        textOffset: 100,
        chart: {
            label: false,
            value: false
        }
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
          .attr("class", "slice");    //allow us to style things in the slices (like text)
        
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
        
		var label = self.options.chart.label, 
			value = self.options.chart.value;
	
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

