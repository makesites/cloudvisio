#!/bin/bash

browserify index.js -o build/cloudvisio.js
uglifyjs build/cloudvisio.js -m --comments '/@name|@url|@author|@license/' > build/cloudvisio-min.js

exit;
