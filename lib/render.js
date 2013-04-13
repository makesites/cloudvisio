
// rendering the visualization (generated once)
Cloudvisio.prototype.render = function(){
	d3.select( this.el + " "+ this.options.container).data(this.models);
	//.transition().duration(500).call(chart);
};

// updating visualization (on every tick)
Cloudvisio.prototype.update = function(){
	d3.select( this.el + " "+ this.options.container).data(this.models);
	//.transition().duration(500).call(chart);
};

// Internal methods
// creates the chart container
Cloudvisio.prototype._container = function(){
	d3.select( this.el )
		.append( this.options.container )
		.attr("width", this.options.width)
		.attr("height", this.options.height);
};
	