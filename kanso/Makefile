SHELL := /bin/bash

build:
	@interleave src/geocouch-utils.js --path lib --output geocouch-utils.js
	@interleave src/lists/lists.js --path lib/lists --output lists.js
	@interleave src/spatial/spatial.js --path lib/spatial --output spatial.js
	@interleave src/views/all.js --path lib/views --output all.js
	@interleave src/vendor/clustering.js --path lib/vendor --output clustering.js
	@interleave src/vendor/geojson-js-utils.js --path vendor/geojson-js-utils --output geojson-utils.js
