var utils = require('./utils');

var render = {

	// rendering the visualization (generated once)
	render: function( append ){
		// fallbacks
		append = append || false;
		// chart is a prerequisite
		var chart = this.chart();

		if( chart === null) return;

		var options = {
			append : append
		};

		if( !this.ready() ){
			// exit now with an error message
			return ( this.options.renderErrors ) ? this.status("string") : this.status();
		}
		// ready to create chart
		// clear container (by default)
		if( !append ) {
			this._container();
		}

		chart.render( options );

		return this.status();
		//.transition().duration(500).call( this.chart() );

	},

	// updating visualization (on every tick)
	update: function(){

	},

	// verifies that there's the minimum data for a chart
	ready: function( layout ){
		// fallback (not needed?)
		//layout = layout || this.options.layout;
		// check if the selected layout "needs" a group
		this._findGroups();
		// process query amounts
		this.amount();
		// prerequisite - we need to have some data set...
		if( this.models.length === 0 ) return false;
		// main flag
		var state = true,
			chart, original_chart, original_options;
		//
		if(!arguments.length){
			// evaluate the current layout
			chart = this.chart();

		} else {
			// keep a reference of the original chart / options
			original_chart = this.chart();
			original_options = this._axis;
			this.chart( layout );
			chart = this.chart();
		}

		// check if all the required attributes are set
		for( var i in chart.schema ){
			var option = this._axis[i] || false;
			if(!option){
				// lookup a suitable option
				var type = chart.schema[i];
				option = this._findAxis( type );
				if( option ) {
					this._axis[i] = option;
					continue;
				} else {
					state = false;
				}
			}
		}

		// restore original layout if necessery
		if( arguments.length ){
			this._chart = original_chart;
			this._axis = original_options;
		}
		//
		return state;
	},

	// reset all properties/data
	reset: function(){
		// variables
		var data, options;
		// count arguments
		switch( arguments.length ){
			case 1:
				if( arguments[0] instanceof Array ){
					data = arguments[0];
				} else {
					options = arguments[0];
				}
			break;
			default:
				data = arguments[0];
				options = arguments[1];
			break;
		}
		// fallbacks
		data = data || false;
		options = options || false;
		if( data ) this.data( data, { reset: true });
		// optionally reset other options
		if( !options.soft || options.hard ){
			this.options = defaults;
			this.models = [];
		}
	},


	// Internal methods
	// creates the chart container
	_container: function(){

		var width = 4000,
		height = 3000;

		var svg = d3.select( this.el ).html("")
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

	},

	// get the type of the selected field
	_findType: function( key, data ){
		var type = false;
		data = data || this.models;
		// loop through models
		for(var i in data){
			var value = data[i][key];
			// #35 check if the value is a float
			if( !isNaN( parseFloat(value) ) ) value = parseFloat(value);
			var itype = (typeof value);

			// if we've found more than one types exit
			if( type && type != itype ) return "mixed";
			type = itype;
		}
		return type;
	},

	// get the type of the selected field
	_findGroups: function( key, data ){

		var axis = this.axis();
		var queries = this.queries();
		// first see if we have a group "need"
		if( axis.group === false ){
			var match = false;
			for( var i in queries ){
			if(queries[i].type == "group"){
				// select the query key as the group axis
				this.axis(i);
				this._axis.group = i;
				// one group is enough?
				match = true;
				break;
			}
			}
			// fallback to unique id
			if(!match) this._axis.group = "_id";
		}

	}

}

module.exports = render;
