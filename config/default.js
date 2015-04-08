var d3 = require('d3');

module.exports = {
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
	renderErrors: false
};
