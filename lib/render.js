
// rendering the visualization (generated once)
Cloudvisio.prototype.render = function(){
	d3.select( this.el + " "+ this.options.container).data(this.models);
	var chart = this.chart();
	chart.call(this, arguments);
	//.transition().duration(500).call( this.chart() );
};

// updating visualization (on every tick)
Cloudvisio.prototype.update = function(){
	
};

// Internal methods
// creates the chart container
Cloudvisio.prototype._container = function(){
	d3.select( this.el )
		.append( this.options.container )
		.attr("width", this.options.width)
		.attr("height", this.options.height);
};
	