# Cloudvisio 

Representing data in interesting ways. You may see it as a javascript template engine for graphs. It operates one level above D3, allowing you to create useful results (models) based on existing raw data. 


## Features

* D3 integration 
* Structure agnostic approach
* Live filtering of data


## Install 

For client-side processing you can install with bower:
```
bower install cloudvisio
```

For server-side processing you can use npm (still work in progress): 
```
npm install cloudvisio
```

If you'd like to build the client lib from the you can use [browserify](http://browserify.org/)
```
browserify -x ./node_modules/d3/index-browserify.js index/index-browserify.js > build/cloudvisio.bundle.js
```

## Usage

For either client-side or server-side processing the API is the same. For instance: 
```
var chart = new Cloudvisio({ layout: "stack" });
chart.set( data );

```
In the above example, where 'data' is a known javascript object with pre-caclulated data. If the data is a raw collection we can filter it first by creating the axis out of conditions we create: 
```
var chart = new Cloudvisio({ layout: "stack" });
chart.data( data ); *
chart.search(/USA/gi, "address");
chart.match(/^John/gi, "name");

```
After the data is processed we compile the new chart with the method ```render()``` which will output the required markup.

```
var html = chart.render();
```

Look into the examples folder for more specific implementations of the (server-side) logic. 


## Options

 * ```layout: "string"```, the type of chart we want to render. Review the layout section for the available options
...

## Methods 

The api is trying to use the most obvious conventions every experienced web developer is already familiar with, and thus it is greatly inspired by vanilla js, jquery, backbone and of course the d3 library itself. 

### data( json )

Pass a raw object to the library that will be used for further analysis. 

### set( models )

Add a normalized dataset ( with pre-calculated axis ) to the models. 

### search()

Lookup the raw data for the search term (regular expression) you are looking for. Returns a boolean. 

### match()

Find all the occurances of a condition in the raw data, expressed by a regular expression. Returns a number. 


## Layouts 

Cloudvisio supports some of D3 layouts out of the box. 

* Stack
* Pie
...

In addition it can accept custom layouts using the ```chart()``` method. 
