
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
	},

	// unique sequential id - based on: http://stackoverflow.com/a/14714979
	uid: (function(){var id=0;return function(){if(arguments[0]===0)id=0;return id++;};})(),

	// remove all special characters & spaces
	safeString: function( string ){
		return string.replace(/[^a-zA-Z0-9]/g,'');
	}

};
