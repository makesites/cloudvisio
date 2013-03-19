(function(d3) {
	
	cloudvisio = function ( options ) {
		// variables
		var svg,
		options = options ? options : {};
		options.el || ( options.el="#vis" );
		options.data || ( options.data={} );
		options.view || ( options.view="default" );
		
		init = function(){
			svg = d3.select(options.el).html("").append("svg")
			.attr("width", "100%")
			.attr("height", "100%")
			.attr("class", "cloudvisio")
			.append("g");
		}
		
		// visual methods
		description = function() {
			return "cloudvisio running on d3";
		};
		
		process = function(key,value) {
			console.log(key + " : "+value);
		}
		
		traverse = function(o,func) {
			for (i in o) {
				func.apply(this,[i,o[i]]);  
				if (typeof(o[i])=="object") {
					//going on step down in the object tree!!
					traverse(o[i],func);
				}
			}
		}

		//traverse(options.data,process);
		init();
		
		return this;
	};

	// Helpers
	// - load template
	cloudvisio.loadTemplate = function(file) {
		return file;
	};

})(d3);

