
var color = {
	// define the color spectrum
	colors: function( colors ){
		if (!arguments.length) return this.options.colors;
		//  overwrite existing color palette
		this.options.colors = colors;
		// preserve chainability
		return this;
	},

	// get the next color in the selected spectrum
	color: function(i) {
		return (this.options.colors instanceof Function) ? this.options.colors(i) : this.options.colors[i]; // assume it's an array if not a function?
	}
}

module.exports = color;