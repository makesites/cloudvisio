var arc = d3.svg.arc();

var pie = function( self ) {

        this.self = self;
        // setup options
        utils.extend(self.options, this.defaults);
    
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
            .data( data.values )
            .append("svg:g")
            .attr("transform", "translate(" + width/2 + "," + height/2 + ")");
        
        // The data for each svg:svg element is a row of numbers (an array). We pass
        // that to d3.layout.pie to compute the angles for each arc. These start and end
        // angles are passed to d3.svg.arc to draw arcs! Note that the arc radius is
        // specified on the arc, not the layout.
        svg.selectAll("path")
            .data(d3.layout.pie())
            .enter().append("svg:path")
            .attr("class", "slice")    //allow us to style things in the slices (like text)
            .attr("d", arc
                .innerRadius( self.options.ir )
                .outerRadius( self.options.r )
                 )
            .style("fill", function(d, i) { return self.color( i ); });
    
        // animate slices
        svg.selectAll("path").transition()
            .ease("cubic")
            .duration(2000)
            .attrTween("d", this.tweenPie);
            
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
            .text(function(d, i) { return data.labels[i]; });        //get the label from our original data array
            .transition().ease("cubic").duration(2000).attrTween("transform", textTween);
        */
        
    }, 
    
	data: function (){ 
        var self = this.self;
        
		var label = self.options.chart.label, 
			value = self.options.chart.value;
	
		var labels = self.models.map(function( data, i ){
			return data[label];
		});
		
		var values = self.models.map(function( data, i ){
			return data[value];
		});
		
		return {
			labels: labels,
			values:  [values]
		};
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

