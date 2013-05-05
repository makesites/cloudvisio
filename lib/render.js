
// rendering the visualization (generated once)
Cloudvisio.prototype.render = function( append ){
	
	var chart = this.chart();
    append = append || false;
    
    // clear container (by default)
    if( !append ) {
        d3.select( this.el ).html("");
        this._container();
    }
    
    var options = {
        append : append
    };
    
	if( chart !== null){ 
		if( this.ready() ){ 
            chart.render( options );
        }
    }
	//.transition().duration(500).call( this.chart() );
	
	
};

// updating visualization (on every tick)
Cloudvisio.prototype.update = function(){
	
};

// verifies that there's the minimum data for a chart
Cloudvisio.prototype.ready = function(){
    var chart = this._chart;
    console.log( this.models );
    // we need to have some data set...
    if( this.models.length === 0 ) return false;
    // check if all the required attributes are set
    for( var i in chart.schema ){
        var option = this.options.chart[i] || false;
        if(!option){ 
            return false;
        }
    }
    
    //console.log("here", this.options.chart );
    return true;
};


// updating options dynamically
Cloudvisio.prototype.set = function( obj ){
	if( !(obj instanceof Object) ) return this;
    utils.extend(this.options, obj);
    // special condition for layouts
    if( obj.layout ) this.chart( obj.layout );
	//for( var i in obj){
	//	this.options[i] = obj[i];
	//}
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
