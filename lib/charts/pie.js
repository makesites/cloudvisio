Cloudvisio.prototype.charts.pie = function() {

 
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