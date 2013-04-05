# Cloudvisio 

Representing data in interesting ways. You may see it a s a javascript template engine for graphs
It operates one level abobe D3, allowing you to create useful results (axis) based on raw data


## Features

* Structure agnostic approach
* Live filtering of data
* D3 integration 


## Install 

For server-side processing you can use npm: 
```
npm install cloudvisio
```

For client-side processing you can install with bower:
```
bower install cloudvisio
```

If you'd like to build the clinet lib from the you can use [browserify](http://browserify.org/)
```
browserify -x ./node_modules/d3/index-browserify.js index.js > build/cloudvisio.js
```

## Usage

For either client-side or server-side processing the API is the same. For instance: 
```
var chart = new Cloudvisio({ type: "graph" });
chart.set( data );

```
In the above example, where 'data' is a known javascript object with pre-caclulated data. If the data is a raw collection we can filter it first by creating the axis out of conditions we create: 
```
var chart = new Cloudvisio({ view: "graph" });
chart.data( data ); *
chart.search(/USA/gi, "address");
chart.match(/^John/gi, "name");

```
After the data is processed we compile the new chart with the method ```compile()``` which will output the required markup.

```
var html = chart.compile();
```

Look into the examples folder for more specific implementations of the (server-side) logic. 


## Methods 

The api is trying to use the most obvious conventions every experienced web developer is already familiar with, and thus it is greatly inspired by vanilla js, jquery, backbone and of course the d3 library itself. 

### data( json )

Pass a raw object to the library that will be used for further analysis. 

### set( axis )

Add to the axis models with pre-calculated data. 

### search()

Lookup the raw data for the search term (regular expression) you are looking for. Returns a boolean. 

### match()

Find all the occurances of a condition in the raw data, expressed by a regular expression. Returns a number. 

### match()

