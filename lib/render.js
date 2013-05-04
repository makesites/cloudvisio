
// rendering the visualization (generated once)
Cloudvisio.prototype.render = function( append ){
	
	var chart = this.chart();
    append = append || false;
    
    // clear container (by default)
    if( !append ) {
        d3.select( this.el ).html("");
        this._container();
    }
    
	if( chart !== null && this.ready() ){ 
		chart.call(this, arguments);
    } else {
        console.log("error",  "not all options are met");
    }
	//.transition().duration(500).call( this.chart() );
	
	
};

// updating visualization (on every tick)
Cloudvisio.prototype.update = function(){
	
};

// verifies that there's the minimum data for a chart
Cloudvisio.prototype.ready = function( chart ){
    console.log("here", this.options.chart );
    return true;
};


// updating options dynamically
Cloudvisio.prototype.set = function( obj ){
	if( !(obj instanceof Object) ) return this;
	for( var i in obj){
		this.options[i] = obj[i];
	}
	// 
	return this;
};


// Internal methods
// creates the chart container
Cloudvisio.prototype._container = function(){
	
	var width = 1024,
    height = 768;

	var svg = d3.select( this.el )
		.append( this.options.container );
	
	function redraw() {
		svg.attr("transform", "translate("+ d3.event.translate +")" + " scale("+ d3.event.scale +")");
	}
	
	svg.attr({
			"width": this.options.width,
			"height":  this.options.height
		})
		.attr("viewBox", "0 0 " + width + " " + height )
		.attr("preserveAspectRatio", "xMidYMid meet")
		.attr("pointer-events", "all")
		.call(d3.behavior.zoom().on("zoom", redraw));
		
	return svg;
	
};
	