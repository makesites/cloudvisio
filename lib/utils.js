
var utils = {

	// Common.js extend method: https://github.com/commons/common.js
	extend : function() {
		var objects = arguments; // to array?
		var destination = {};
		for( var obj in objects ){
			var source = objects[obj];
			for (var property in source){
				if (source[property] && source[property].constructor && source[property].constructor === Object) {
					destination[property] = destination[property] || {};
					arguments.callee(destination[property], source[property]);
				} else {
					destination[property] = source[property];
				}
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

	// checks if an object is in an array
	inArray: function( obj, list ){
		for (var i = 0; i < list.length; i++) {
			if (list[i] === obj) {
				return i;
			}
		}
		return -1;
	},

	// unique sequential id - based on: http://stackoverflow.com/a/14714979
	uid: (function(){var id=0;return function(){if(arguments[0]===0)id=0;return id++;};})(),

	// remove all special characters & spaces
	safeString: function( string ){
		return string.replace(/[^a-zA-Z0-9]/g,'');
	},

	// - Creates a unique id for identification purposes
	uniqueID : function (separator) {

		var delim = separator || "-";

		function S4() {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		}

		return (S4() + S4() + delim + S4() + delim + S4() + delim + S4() + delim + S4() + S4() + S4());
	},

	// - load template
	loadTemplate: function(file){
		return file;
	},

	// Usage:
	//traverse(options.data,process);
	traverse: function(o,func){
		for ( var i in o) {
			func.apply(this, [i, o[i]]);
			if (typeof o[i] == "object" ) {
				//going on step down in the object tree!!
				traverse(o[i], func);
			}
		}
	}

};

module.exports = utils;

