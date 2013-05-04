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
chart.parse( data );
```
In the above example, where 'data' is a known javascript object with pre-caclulated axis. If the data is a raw collection we can filter it first by creating the axis out of conditions we create: 
```
var chart = new Cloudvisio({ layout: "stack" });
chart.data( data ); *
chart.axis("address");
chart.axis("name");
chart.group(["USA"], "address");
```
After the data is processed we compile the new chart with the method ```render()``` which will output the required markup.

```
var html = chart.render();
```

Look into the examples folder for more specific implementations of the (server-side) logic. 


## Options

* ```layout: "string"```, the type of chart we want to render. Review the layout section for the available options
* ```chart: { object }```, options related with the rendering of the chart - which differ for every layout. 
...

## Methods 

The api is trying to use the most obvious conventions every experienced web developer is already familiar with, and thus it is greatly inspired by vanilla js, jquery, backbone and of course the d3 library itself. 

### data( json )

Pass a raw object to the library that will be used for further analysis. 

### parse( models )

Add a normalized dataset ( with pre-calculated axis ) to the models. 

### set( object )

Update the visualization's options dynamically. Accepts an object of updated values. 

### group([array], axis)

Use an axis as a basis to group the parsed models into groups, with their labels specified in the array.


## Layouts 

Cloudvisio supports some of [D3 layouts](https://github.com/mbostock/d3/wiki/Layouts) out of the box. 

* Stack
* Pie
* Force
...

In addition it can accept custom layouts using the ```chart()``` method. 


## Credits

Created by [Makis Tracend](http://tracend.me)

Distributed through [Makesites.org](http://makesites.org/)

Released under the [Apache License v2.0](http://makesites.org/licenses/APACHE-2.0)
