# Helper Functions for GeoCouch

This is a [CouchApp](http://couchapp.org/page/index) providing spatial functions and a set of helper scripts for GeoCouch.

## CouchApp

The folder `couchapp/` is a CouchApp that provides useful spatial functions.

### Quick install (without cloning this repo)

* If you don't already have one, make a database on your couch: <code>curl -X PUT http://YOURCOUCH/DBNAME</code>
* Replicate the geocouch utils from my public couch to your database: <code>curl -X POST http://YOURCOUCH/\_replicate -d '{"source":"http://max.couchone.com/apps","target":"http://YOURCOUCH/DBNAME", "doc\_ids":["_design/geo"]}'</code>

### In-depth install

If you don't have a database, you'll have to create a new database to store your data. You can do this from http://YOURCOUCH/_utils or with <code>curl</code>:

<code>curl -X PUT http://YOURCOUCH/DBNAME</code>

When you store geo data in GeoCouch, the geometry is stored in the `geometry` property, all
other properties in the `properties` property:

    // add a document with a valid geometry into your database
    $ curl -X PUT http://localhost:5984/DBNAME/myfeature -d '{"type":"Feature", "color":"orange" ,"geometry":{"type":"Point","coordinates":[11.395,48.949444]}}'
    {"ok":true,"id":"myfeature","rev":"1-2eeb1e5eee6c8e7507b671aa7d5b0654"}

You can either replicate the couchapp from my public couch at [http://max.couchone.com/apps/_design/geo](http://max.couchone.com/apps/_design/geo) (quickest option) or, if you want to hack on the source code first, you'll need to install the [CouchApp command line utility](http://couchapp.org/page/installing) and check out this repo.

If you want to hack on the code (aka build it yourself), once you have the couchapp utility working, <code>git clone</code> this repo and go into this folder and execute <code>couchapp init</code>. To upload these utils into your couch just run <code>couchapp push http://YOURCOUCH/DATABASENAME</code>. Otherwise see the Quick install section above.

When you push these utils into your couch it will enhance your database with the magical geo sprinkles contained in this repo and teach your database how to do awesome things with geo data. At this point you can use the following commands:


### Document Structure used in this CouchApp

The document structure is used consistently within all views and examples, assuming that location information is provided in `doc.geometry` containing a GeoJSON struct.
If your document structure differs, don't forget to adapt the (spatial) views.

Example:

	{
	   "_id": "c0c048ad2770bb836a10f164cc0a3fc0",
	   "_rev": "1-e2d2130da93ca435965d6d3efca22380",
	   "geometry": {
	       "type": "Point",
	       "coordinates": [
	           48.417,
	           9.983
	       ]
	   },
	   "etc" : "..."
	}

### [Spatial Views] (https://github.com/vmx/couchdb)

#### points.js

A spatial view that additionally emits the original GeoJSON value (doc.geometry) 

Example:

	$ curl 'http://localhost:5984/gc-utils/_design/geo/_spatial/points?bbox=80,88,90,90'
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
	            "geometry":{
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

	$ curl 'http://localhost:5984/gc-utils/_design/geo/_spatial/pointsFull?bbox=80,88,90,90'	
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
	            "geometry":{
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

	$ curl 'http://localhost:5984/gc-utils/_design/geo/_spatial/pointsOnly?bbox=80,88,90,90'	
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

### [Views] (http://guide.couchdb.org/draft/views.html)

#### all 

A simple map function that returns all documents. It's like _all_docs, but you can use it as a regular view.

### [List Functions](http://guide.couchdb.org/draft/transforming.html)

#### kml.js

This list functions generates a simple KML feed

Examples:

Open a tool capable of handling KML feeds and import your query link: `http://localhost:5984/gc-utils/_design/geo/_spatiallist/kml/points?bbox=0,0,45,45`  

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


	$curl -X GET 'http://localhost:5984/gc-utils/_design/geo/_spatiallist/geojson/points?bbox=80,88,90,90'	
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

#### radius.js

This will take the centroid of the bbox parameter and a supplied radius parameter in meters and filter the rectangularly shaped bounding box result set by circular radius.

**WARNING** This only works with on points, not lines or polygons yet

Example:

	$ curl -X GET http://localhost:5984/gc-utils/_design/geo/_spatiallist/radius/points?bbox=-122.677,45.523,-122.675,45.524&radius=50
	{
	   "type":"FeatureCollection",
	   "features":[
	      {
		 "type":"Feature",
		 "geometry":{
		    "coordinates":[
		       -122.676375038274,
		       45.5233877497394
		    ],
		    "type":"Point"
		 },
		 "properties":{
		    "id":"b7f31f5062745b6ca1c1adfc0c2351a1"
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

