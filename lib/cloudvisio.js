(function(d3) {
	
	cloudvisio = function (vis) {
		// variables
		var vis = vis ? vis : {};
		
		// visual methods
		vis.description = function() {
			return "cloudvisio running on d3";
		};
		
		return vis;
	};

	// Helpers
	// - load template
	cloudvisio.loadTemplate = function(file) {
	
		return file;
	};

})(d3);

