#!/bin/bash

browserify index.js -o build/cloudvisio.js
uglifyjs build/cloudvisio.js > build/cloudvisio-min.js
#uglifyjs build/cloudvisio.js -m --comments '/Tick.js|Copyright/' > build/cloudvisio-min.js

exit;
