
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
Cloudvisio.prototype.ready = function( layout ){
	// prerequisite - we need to have some data set...
	if( this.models.length === 0 ) return false;
	// main flag
	var state = true,
		chart, original_chart, original_options;
	//
	if(!arguments.length){
		// evaluate the current layout
		chart = this._chart;

	} else {
		// keep a reference of the original chart / options
		original_chart = this._chart;
		original_options = this.options.chart;
		this.chart( layout );
		chart = this._chart;
	}

	// check if all the required attributes are set
	for( var i in chart.schema ){
		var option = this.options.chart[i] || false;
		if(!option){
			// lookup a suitable option
			var type = chart.schema[i];
			option = this._findAxis( type );
			if( option ) {
				this.options.chart[i] = option;
				continue;
			} else {
				state = false;
			}
		}
	}

	// restore original layout if necessery
	if( arguments.length ){
		this._chart = original_chart;
		this.options.chart = original_options;
	}
	//
	return state;
};


// updating options dynamically
Cloudvisio.prototype.set = function( obj ){
	if( !(obj instanceof Object) ) return this;
	// "clean" obj first
	for( var i in obj){
		if( i == "chart" ){
			var options = this.options.chart || {};
			var chart = obj[i];
			// reset options now
			this.options.chart = {};
			// don't overwrite existing assignements
			for( var j in chart ){
				if( options[j] && typeof options[j] != "undefined" && !chart[j] ){
					obj[i][j] = options[j];
				}
			}
		}
	}
	// merge the final object
	utils.extend(this.options, obj);
	// special condition for layouts
	if( obj.layout ) this.chart( obj.layout );

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

// make an intelligent decision on what the next axis may be
Cloudvisio.prototype._findAxis = function( type ){
	// get the keys of the model
	var keys = this.keys( this.models );
	if( !keys ) return false;
	var axis = utils.toArray( this.options.chart );
	// loop through the keys
	for( var i in keys ){
		// check that the key hasn't been used
		if( axis.indexOf( keys[i] ) > -1 ) continue;
		// get type of field
		if( type == this._findType( keys[i] )) return keys[i];
	}
	return false;
};

// get the type of the selected field
Cloudvisio.prototype._findType = function( key, data ){
	var type = false;
	data = data || this.models;
	// loop through models
	for(var i in data){
		var itype = (typeof data[i][key] );
		// if we've found more than one types exit
		if( type && type != itype ) return "mixed";
		type = itype;
	}
	return type;
};