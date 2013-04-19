
// adding a new (custom chart)
Cloudvisio.prototype.chart = function( chart ){
	if (!arguments.length) return this._chart;
	// evaluate the function first? 
	this._chart = chart;
	// save a referense of the chart if it doesn't exist 
	if(typeof this.charts[this.options.layout] == "undefined"){ 
		this.charts[this.options.layout] = chart;
	}
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

