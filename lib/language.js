// dependencies
var d3 = require('d3');

var language = {

	// convert the regular expression into a string
	verbalize: function( query ){
		// replace signs
		query = query.replace(/\+/gi, " and ");
		query = query.replace(/>/gi, " greater than ");
		query = query.replace(/</gi, " less than ");

		// remove unnecessary spaces
		query = query.replace(/  /gi, " ");
	},

	// Display status messages about the chart generation
	status: function( render ){
		var flags = {};
		var chart = this.chart();
		render = render || false;
		// check if the data is empty
		//if( Object.keys( this._data ).length === 0 ) flags.push("001");
		if( this._data.length === 0 ) flags[101] = status[101];
		// check if there are any axis
		if( this.models.length === 0 ) flags[102] = status[102];
		// look into each individual missing axis

		for(var i in this._axis ){
			var axis = this._axis[i];
			if( !axis ){
				var type = chart.schema[i];
				switch(type){
					case "string":
						flags[103] = status[103].replace(/_field_/gi, i);
					break;
					case "number":
						flags[104] = status[104].replace(/_field_/gi, i);
					break;
				}
				//console.log(i);
			}
		}
		// if everything is OK return a standard 200
		if( Object.keys( flags ).length === 0 ) flags[200] = status[200];
		if( render ){
			var el = d3.select( this.el );
			// create html
			var html = '<div class="error">';
			html += "<p>There were the following errors:</p>";
			html += "<ul>";
			for(var j in flags){
				html += "<li>"+ flags[j] +"</li>";
			}
			html += "</ul>";
			html += "</div>";
			el.html( html );
		}
		// either way return the flags as an object
		return flags;
	}
}


// Helpers
var status = {
	101: "Missing source data",
	102: "No axis created",
	103: "Missing string: _field_",
	104: "Missing number: _field_",
	105: "Missing group: _field_",
	200: "OK"
};

module.exports = language;