if( !window.Cloudvisio ) (function( d3 ){
var defaults = {
	el: "#vis", 
	layout: "stack", 
	container: "svg", 
	width: "100%", 
	height: "100%", 
	// The color scale will be assigned by index, but if you define your data using objects, you could pass
	// in a named field from the data object instead, such as `d.name`. Colors are assigned lazily, 
	// so if you want deterministic behavior, define a domain for the color scale.
	colors: d3.scale.category20c(), 
	//colors: d3.scale.ordinal().range(["darkblue", "blue", "lightblue"]);
	chart: {}
};

// dependencies
//var d3 = require("d3");

Cloudvisio = function( options ){
	// variables
	options = options || {};
	this.options = {};
        
	// get the el
	this.el = options.el || defaults.el;
    // clean up options
	options.layout = ( options.layout || defaults.layout ).toLowerCase();
    // extend with the defaults
    options = utils.extend( defaults, options );
    /*
	options.container = options.container || defaults.container;
	options.width = options.width || defaults.width;
	options.height = options.height || defaults.height;
	options.colors = options.colors || defaults.colors;
	options.chart = options.chart || defaults.chart;
    */
	// add the appropriate chart
	//this.chart( options.layout );
	// ovewrite the default values (with the passed ones)
	//this.options = utils.extend( this.options, options );
    this.set( options );
    
	// setup 
	this._container();
};

Cloudvisio.prototype = {
	
	constructor: Cloudvisio, 
	
	description : function() {
		return "Cloudvisio running on D3";
	}, 

    options: {} // why isn't this available in the constructor?
    
};



// this is where the axis will be stored
Cloudvisio.prototype.models = [];

// load a dataset
Cloudvisio.prototype.data = function( raw, options ){
    // fallbacks
    options = options || {};
	// return the existing data if none is passed...
	if (!arguments.length) return this._data;
	// do some calculations 
	this._data = raw;
    // reset the models
    if( options.silent ){
        // don't erase models
    } else {
        // reset the models
        this.models = [];
    }
	// allow method chaining
	return this;
};

// load a dataset
Cloudvisio.prototype.parse = function( data ){
	data = data || false;
	if(!data) return;
	// check if it's and array of objects
	//if(data instanceof Array){
	if(data.length != "undefined"){
		for( var i in data ){
			this.models.push( data[i] );
		}
	} else {
		// assume one element
		this.models.push( data );
	}
	// allow method chaining
	return this;
}; 

// filter the data based on a regular expression
Cloudvisio.prototype.search = function( query, field ){
	var exp = new RegExp(query);
	//...
	// allow method chaining
	return this;
};

// return the matchs of a regular expression
Cloudvisio.prototype.find = function( query, string ){
	if( query instanceof Array) query = query.join("|");
	var regexp = new RegExp(query, "gi");
	return string.match(regexp);
};

// retrieve all keys from a data block (currently non-recursive)
Cloudvisio.prototype.keys = function( data ){
	// fallback to the raw data
	data = data || this.data();
	//
	var keys = [];
	for(var i in data){
		var attr = Object.keys(  data[i] );
		for( var j in attr ){
			// don't add the same key 
			if( keys.indexOf( attr[j] ) > -1 ) continue;
			keys.push( attr[j] );
		}
	}
	//
	return keys;
};

// set an axis key (or return the whole array
Cloudvisio.prototype.axis = function( key ){
	// return the existing data if none is passed...
	if (!arguments.length) return Object.keys( this.models[0] || {} );
	// focus on a specific subset?
	var data = this.data();
	// lookup the key in the raw data
	for(var i in data){
		// create model if necessary
		if(typeof this.models[i] == "undefined" ) this.models[i] = {};
			
		// there's currenty a 1-1 match between the data length and the models length...
		if( typeof data[i][key] == "string" || typeof data[i][key] == "number"){
			this.models[i][key] = data[i][key];
		} else if( typeof data[i][key] == "object" ){
			// by priority look up a desciptive key in the object
			this.models[i][key] = data[i][key].value || data[i][key].name || data[i][key].title || data[i][key].id || data[i][key];
		} else {
			// not supporting any other types for now...
			this.models[i][key] = null;
		}
		//
		
	}
	// maintain chanability
	return this;
};

// group models based on axis results
Cloudvisio.prototype.group = function( groups, axis){ 
	// convert groups to lower case
	groups = groups.join("`").toLowerCase().split("`");
	// lookup the right axis
	for( var i in this.models ){
		var model = this.models[i];
		if( typeof model[axis] != "undefined"){
			var matches = this.find(groups, model[axis]);
			// process results
			//if(matches !== null);
			if(matches instanceof Array){
				// are we expecting more than one matches??
				var group = matches.pop().toLowerCase();
				model["group_"+axis] = groups.indexOf( group);
			} else {
				model["group_"+axis] = -1;
			}
		} else {
			//model["group_"+axis] = null;
			model["group_"+axis] = -1;
		}
	}
	// save groups for later
	this.options.chart["group_"+axis] = groups;
	//'match(/(high)/gi, ).;
    return this;
}; 

// removing axis 
Cloudvisio.prototype.remove = function( axis ){
    for( var i in this.models ){
        var model = this.models[i];
        if( typeof model[axis] != "undefined"){
            delete this.models[i][axis];
        }
    }
    return this;
};

// public access of findType
Cloudvisio.prototype.type = function( key ){
    // add more conditions / filters?
    return this._findType( key );
};

    
// Internal 
// - raw data container
Cloudvisio.prototype._data = {};



Cloudvisio.prototype.process = function( key, value ) {
	console.log(key + " : "+value);
};

Cloudvisio.prototype.match = function( query, field ){
	var exp = new RegExp(query);
	//...
	// allow method chaining
	return this;
};


// convert the regular expression into a string
Cloudvisio.prototype.verbalize = function(){
	
};

// Helpers


// retrieving chart (or adding a new custom chart)
Cloudvisio.prototype.chart = function( chart ){
	if (!arguments.length) return this._chart;
	// otherwise save provided chart.. evaluate the function first? 
	// create a new, non-conflicting container if it exists 
	//if(typeof this.charts[this.options.layout] != "undefined"){ 
	//	this.options.layout = "untitled";
	//}
    var Chart; // class name
    // find the right chart
    if(typeof chart == "string"){
        // find chart from the charts collection
        Chart = this.charts[ chart ] || null;
        // exit now if we didn't find it...
        if( Chart === null ) return this;
    } else if(typeof chart == "function"){
        Chart = chart;
        var layout = chart.prototype.layout || "untitled";
        // it it's a new layout...
        if(typeof this.charts[ layout ] == "undefined"){ 
            this.charts[this.options.layout] = chart;
            // set the new layout automatically?
            this.options.layout = layout;
        }
    }
    // 
    // either way create a new instance of the chart
    this._chart = new Chart( this );
    //this.charts[this.options.layout]
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


// Internal 
// - instantiated chart
Cloudvisio.prototype._chart = null;

// stacked/bar chart
var stack = function( self ) {

        this.self = self;
        // setup options
        self.set( this.defaults );
    
    };
    
stack.prototype = {
    
    layout: "stack",
    
    schema: {
        label: "string",
        value: "number"
    },
    
    defaults: {
        chart: {
            label: false,
            value: false
        }
    }, 
    
    constructor: stack, 
    
    render: function( append ){ 
            
        var self = this.self;
        var width = 1024,
        height = 768;
            
        var nodes = this.data();
        
        var svg = d3.select( self.el + " "+ self.options.container)
                .append("svg:g")
                .attr("transform", "translate(30,738)");
                
        x = d3.scale.ordinal().rangeRoundBands([0, width]);
        y = d3.scale.linear().range([0, height]);
        
        var data = d3.layout.stack()( nodes.values );
        
        x.domain(data[0].map(function(d) { return d.x; }));
        y.domain([0, d3.max(data[data.length - 1], function(d) { return d.y0 + d.y; })]);
        
        // Add a group for each column.
        var valgroup = svg.selectAll("g.valgroup")
            .data( data )
            .enter().append("svg:g")
            .attr("class", "valgroup")
            .style("fill", function(d, i) { return self.color(i); })
            .style("stroke", function(d, i) { return d3.rgb( self.color(i)).darker(); });
        
        // Add a rect for each date.
        var rect = valgroup.selectAll("rect")
            .data(function(d){return d;})
            .enter().append("svg:rect")
            .attr("x", function(d) { return x(d.x); })
            .attr("y", function(d) { return -y(d.y0) - y(d.y); })
            .attr("height", function(d) { return y(d.y); })
            .attr("width", x.rangeBand());
        
        //parse = d3.time.format("%m/%Y").parse,
        //format = d3.time.format("%b");
        
        // Add a label per date.
        svg.selectAll("text")
            .data( nodes.labels )
            .enter().append("svg:text")
            .attr("x", function(d) { return x(d) + x.rangeBand() / 2; })
            .attr("y", 6)
            .attr("text-anchor", "middle")
            .attr("dy", ".71em")
            .text(function(d) { return d; });
        
        // Add y-axis rules.
        var rule = svg.selectAll("g.rule")
            .data(y.ticks(5))
            .enter().append("svg:g")
            .attr("class", "rule")
            .attr("transform", function(d) { return "translate(0," + -y(d) + ")"; });
            
        rule.append("svg:line")
            .attr("x2", width)
            .style("stroke", function(d) { return d ? "#fff" : "#000"; })
            .style("stroke-opacity", function(d) { return d ? 0.3 : null; });
            
        rule.append("svg:text")
            .attr("x", -20)
            .attr("dy", ".35em")
            .text(d3.format(",d"));
            
    },
    
    data: function(){
        var self = this.self;
        
        var label = self.options.chart.label, 
            value = self.options.chart.value;
    
        var labels = self.models.map(function( data, i ){
            return data[label];
        });
        
        var values = self.models.map(function( data, i ){
            return { x : i, y : data[value] };
        });
        
        // in a stacked bar there's more than one passes from the models
        return {
            labels : labels,
            values : [values]
        };
    
    }
};
        
Cloudvisio.prototype.charts.stack = stack;

var arc = d3.svg.arc();

var pie = function( self ) {

        this.self = self;
        // setup options
        self.set( this.defaults );
    
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
        textOffset: 100,
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
                    .data( data ) //associate our data with the document
                    .append("svg:g")
                    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");
        
        // add pie group
        var pie = d3.layout.pie() //this will create arc data for us given a list of values
                    .value(function(d) { return d.value; }) // Binding each value to the pie
                    .sort( function(d) { return null; } );
        
        // Select all <g> elements with class slice (there aren't any yet)
        var arcs = svg.selectAll("g.slice")
          // Associate the generated pie data (an array of arcs, each having startAngle,
          // endAngle and value properties) 
          .data(pie)
          // This will create <g> elements for every "extra" data element that should be associated
          // with a selection. The result is creating a <g> for every object in the data array
          .enter()
          // Create a group to hold each slice (we will have a <path> and a <text>
          // element associated with each slice)
          .append("svg:g")
          .attr("class", "slice");    //allow us to style things in the slices (like text)
        
        // The data for each svg:svg element is a row of numbers (an array). We pass
        // that to d3.layout.pie to compute the angles for each arc. These start and end
        // angles are passed to d3.svg.arc to draw arcs! Note that the arc radius is
        // specified on the arc, not the layout.
        
        var slices = arcs.append("svg:path")
            .attr("alt", function(d) { return d.data.label; }) 
            .attr("d", arc
                        .innerRadius( self.options.ir )
                        .outerRadius( self.options.r )
                 )
            .style("fill", function(d, i) { return self.color( i ); });
    
        // animate slices
        slices.transition()
            .ease("cubic")
            .duration(2000)
            .attrTween("d", this.tweenPie);
        
        var label = arcs.append("svg:text") 
            .style("font-size", function(d) { return Math.max( 1, (d.data.value/100) ) * 15; })                                   //add a label to each slice
            .attr("fill", "white")
            .attr("transform", function(d, i) {                    //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.innerRadius = self.options.r/2;
                d.outerRadius = self.options.r;
                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")                          //center the text on it's origin
            .text(function(d, i) { return d.data.label; })        //get the label from our original data array
            .style("opacity", 0)
            .transition().ease("cubic").duration(2000).style("opacity", 1);
            //.transition().ease("cubic").duration(2000).attrTween("opacity", d3.interpolateNumber(0, 100) );

    }, 
    
	data: function (){ 
        var self = this.self,
            data = [];
        
		var label = self.options.chart.label, 
			value = self.options.chart.value;
	
		data = self.models.map(function( data, i ){
			return { label: data[label], value: data[value] };
		});
		
		return [data];
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


// force chart
var force = function( self ) {

        this.self = self;
        // setup options
        self.set( this.defaults );
    
    };
    
force.prototype = {
    
    layout: "force",
    
    schema: {
        label: "string",
        value: "number"
    },
    
    defaults: {
        charge: -20,
        distance: 30,
        ir : 0,
        chart: {
            label: false,
            value: false
        }
    }, 
    
    constructor: force, 
    
    render: function( append ){ 
        
        var self = this.self;
        var svg = d3.select( self.el + " "+ self.options.container);
        var width = 1024,
        height = 768;
        
        var data = this.data();
        
        var force = d3.layout.force()
            .charge( self.options.charge )
            .linkDistance( self.options.distance )
            .size([width, height])
            .nodes( data )
            .links([])
            .start();
        
        /*
        var groups = d3.nest().key(function(d) { return d.group & 3; }).entries( nodes );
        
        var groupPath = function(d) {
        return "M" + d3.geom.hull(d.values.map(function(i) { return [i.x, i.y]; })).join("L") + "Z";
        };
        
        var groupFill = function(d, i) { return self.color(i & 3); };
        */
        
        var node = svg.selectAll(".node")
            .data( data ).enter()
            .append("circle")
            .attr("class", "node")
            .attr("r", 5)
            .style("fill", function(d) { return self.color( d.group ); })
            .call(force.drag);
        
        node.append("title")
            .text(function(d) { return d.name; });
        
        force.on("tick", function(e) {
            
            // Push different nodes in different directions for clustering.
            var k = 6 * e.alpha;
            data.forEach(function(o, i) {
                //o.x += i & 2 ? k : -k;
                //o.y += i & 1 ? k : -k;
                o.x += (o.group + 2) & 2 ? k : -k;
                o.y += (o.group + 2) & 1 ? k : -k;
            });
            
            node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
            
            /*
            svg.selectAll("path")
            .data(groups)
            .attr("d", groupPath)
            .enter().insert("path", "circle")
            .style("fill", groupFill)
            .style("stroke", groupFill)
            .style("stroke-width", 40)
            .style("stroke-linejoin", "round")
            .style("opacity", .2)
            .attr("d", groupPath);
            */
            
        });
    
    },
    
	// local 
	data: function(){
		var self = this.self,
            d = self.models;
		// get keys
		var keys = self.keys( d );
		// required data: 
		// - name (string)
		var name, group;
		// - group (integer)
		if( keys.indexOf("id") > -1 ) name = "id";
		if( keys.indexOf("title") > -1 ) name = "title";
		if( keys.indexOf("label") > -1 ) name = "label";
		if( keys.indexOf("name") > -1 ) name = "name";
		for( var i in keys ){
			if( keys[i].search(/group_/gi) === 0 ) group =  keys[i];
		}
		//
		var result = [];
		for( var j in d ){
			result.push({
				name : d[j][name], 
				group : d[j][group]
			});
		}
		//
		return result;
	}
	
};


        
Cloudvisio.prototype.charts.force = force;



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
Cloudvisio.prototype._findType = function( key ){
    var type = false;
    // loop through models
    for(var i in this.models){
        var itype = (typeof this.models[i][key] );
        // if we've found more than one types exit
        if( type && type != itype ) return "mixed";
        type = itype;
    }
    return type;
};

// define the color spectrum
Cloudvisio.prototype.colors = function( colors ){
	if (!arguments.length) return this.options.colors;
	//  overwrite existing color palette 
	this.options.colors = colors;
	// preserve chainability
	return this;
};

// get the next color in the selected spectrum
Cloudvisio.prototype.color = function(i) { 
	return (this.options.colors instanceof Function) ? this.options.colors(i) : this.options.colors[i]; // assume it's an array if not a function?
};


// Helpers
// - load template
function loadTemplate(file) {
	return file;
}

// Usage: 
//traverse(options.data,process);
function traverse(o,func) {
	for ( var i in o) {
		func.apply(this, [i, o[i]]);  
		if (typeof o[i] == "object" ) {
			//going on step down in the object tree!!
			traverse(o[i], func);
		}
	}
}


var utils = {
    
    // Common.js extend method: https://github.com/commons/common.js
    extend : function(destination, source) {
        for (var property in source) {
            if (source[property] && source[property].constructor && source[property].constructor === Object) {
                destination[property] = destination[property] || {};
                arguments.callee(destination[property], source[property]);
            } else {
                destination[property] = source[property];
            }
        }
        return destination;
    }, 
    
        
    // convert an object to an array (loosing the keys)
    toArray: function( obj ){
        var array = [];
        for( var i in obj ){
            array.push( obj[i] );
        }   
        return array;
    }
     
};


//module.exports = Cloudvisio;

})( window.d3 );