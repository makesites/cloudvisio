
// adding a new (custom chart)
Cloudvisio.prototype.chart = function( chart ){
	if (!arguments.length) return this.charts[this.options.layout] || null;
	// otherwise save provided chart.. evaluate the function first? 
	// create a new, non-conflicting container if it exists 
	if(typeof this.charts[this.options.layout] != "undefined"){ 
		this.options.layout = "untitled";
	}
	// either way save a referense of the chart
	this.charts[this.options.layout] = chart;

	// preserve chainability
	return this;
};

// default layouts
//var charts = ["stack", "pie"];
//
Cloudvisio.prototype.charts = {}; 

// loop through charts 
//for(var i in charts){
//	Cloudvisio.prototype.charts[ charts[i] ] = charts[i];
//}

