
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
