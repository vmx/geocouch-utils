# Helper Functions for GeoCouch

This is a CouchApp providing helpul spatial functions and a set of helper scripts for GeoCouch.

## CouchApp

The folder `couchapp/` is a CouchApp that provides useful spatial functions. Follow these steps for deployment to your GeoCouch:

 * Install the couchapp command line utility ()
 * Clone this repository. Don't forget to do so recursively if you need vendor submodules.
 * Change directory into `couchapp/` and execute: "couchapp init"
 * Push to your GeoCouch: couchapp push http://*yourcouch*/*db*
 * The CouchApp is then available at http://*yourcouch*/*db*/_design/gc-utils

The document structure is used consistently within all views and examples, assuming that location information is provided in `doc.geo` containing a GeoJSON struct.
If your document structure differs, don't forget to adapt the (spatial) views.

Example:

	{
	   "_id": "c0c048ad2770bb836a10f164cc0a3fc0",
	   "_rev": "1-e2d2130da93ca435965d6d3efca22380",
	   "geo": {
	       "type": "Point",
	       "coordinates": [
	           48.417,
	           9.983
	       ]
	   },
	   "etc" : "..."
	}

### spatial 

#### points.js

A spatial view that additionally emits the original GeoJSON value (doc.geo) 

Example:

	$ curl 'http://localhost:5984/gc-utils/_design/gc-utils/_spatial/points?bbox=80,88,90,90'
	{
	   "update_seq":203,
	   "rows":[
	      {
	         "id":"c0c048ad2770bb836a10f164cc08a3e5",
	         "bbox":[
	            81.0876957164146,
	            89.14168435614556,
	            81.0876957164146,
	            89.14168435614556
	         ],
	         "value":{
	            "id":"c0c048ad2770bb836a10f164cc08a3e5",
	            "geo":{
	               "type":"Point",
	               "coordinates":[
	                  81.0876957164146,
	                  89.14168435614556
	               ]
	            }
	         }
	      }
	   ]
	}

#### pointsFull.js

A spatial view that emits both GeoJSON and the full document (as value).  

Example:

	$ curl 'http://localhost:5984/gc-utils/_design/gc-utils/_spatial/pointsFull?bbox=80,88,90,90'	
	{
	   "update_seq":203,
	   "rows":[
	      {
	         "id":"c0c048ad2770bb836a10f164cc08a3e5",
	         "bbox":[
	            81.0876957164146,
	            89.14168435614556,
	            81.0876957164146,
	            89.14168435614556
	         ],
	         "value":{
	            "_id":"c0c048ad2770bb836a10f164cc08a3e5",
	            "_rev":"1-0e087449742a73b5ce0df1415b1af3f3",
	            "geo":{
	               "type":"Point",
	               "coordinates":[
	                  81.0876957164146,
	                  89.14168435614556
	               ]
	            }
	         }
	      }
	   ]
	}

#### pointsOnly.js

A spatial view that only emits GeoJSON and no additional value.

Example:

	$ curl 'http://localhost:5984/gc-utils/_design/gc-utils/_spatial/pointsOnly?bbox=80,88,90,90'	
	{
	   "update_seq":203,
	   "rows":[
	      {
	         "id":"c0c048ad2770bb836a10f164cc08a3e5",
	         "bbox":[
	            81.0876957164146,
	            89.14168435614556,
	            81.0876957164146,
	            89.14168435614556
	         ],
	         "value":null
	      }
	   ]
	}

### views

#### all 

A simple map function that returns all documents. It's like _all_docs, but you can use it as a regular view.

### lists

#### geojson.js 

This function outputs a GeoJSON FeatureCollection (compatible with
OpenLayers). The geometry is stored in the `geometry` property, all
other properties in the `properties` property.

Examples:

    $ curl -X PUT -d '{"type":"Feature", "color":"orange" ,"geometry":{"type":"Point","coordinates":[11.395,48.949444]}}' 'http://localhost:5984/gc-utils/myfeature'
	{
	   "ok":true,
	   "id":"myfeature",
	   "rev":"1-2eeb1e5eee6c8e7507b671aa7d5b0654"
	}


	$curl -X GET 'http://localhost:5984/gc-utils/_design/gc-utils/_spatiallist/geojson/points?bbox=80,88,90,90'	
	{
	   "type":"FeatureCollection",
	   "features":[
	      {
	         "type":"Feature",
	         "geometry":{
	            "type":"Point",
	            "coordinates":[
	               81.0876957164146,
	               89.14168435614556
	            ]
	         },
	         "properties":{
	            "id":"c0c048ad2770bb836a10f164cc08a3e5"
	         }
	      }
	   ]
	}


## Helper Scripts

In the folder `misc` you can find helpful scripts or snippets for GeoCouch.

### geocouch-filler-js

This node.js script can be handy for generating test data. It creates random documents within given value ranges. The script expects the following parameters:

 * The URI of the database to fill
 * A bounding box of the area to fill (as bbox JSON array)
 * The number of documents to generate

Example call:

	node geocouch-filler.js http://localhost:5984/gc-utils [-180,-90,180,90] 1000

This will create 1.000 documents with random locations spread over the whole world.


## License

Licensed under the MIT License.
