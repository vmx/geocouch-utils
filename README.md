# Helper Functions for GeoCouch

This is a [CouchApp](http://couchapp.org/page/index) providing spatial functions and a set of helper scripts for GeoCouch.

# Quick install (without cloning this repo)

* If you don't already have one, make a database on your couch: <code>curl -X PUT http://YOURCOUCH/DBNAME</code>
* Replicate the geocouch utils from my public couch to your database: <code>curl -X POST http://YOURCOUCH/\_replicate -d '{"source":"http://max.couchone.com/apps","target":"http://YOURCOUCH/DBNAME", "doc\_ids":["_design/geo"]}'</code>

# In-depth install

If you don't have a database, you'll have to create a new database to store your data. You can do this from http://YOURCOUCH/_utils or with <code>curl</code>:

<code>curl -X PUT http://YOURCOUCH/DBNAME</code>

When you store geo data in GeoCouch, you have to store them in the document under the key called <code>geometry</code>:

    // add a document with a valid geometry into your database
    $ curl -X PUT http://localhost:5984/DBNAME/myfeature -d '{"type":"Feature", "color":"orange" ,"geometry":{"type":"Point","coordinates":[11.395,48.949444]}}'
    {"ok":true,"id":"myfeature","rev":"1-2eeb1e5eee6c8e7507b671aa7d5b0654"}

You can either replicate the couchapp from my public couch [max.couchone.com/apps/_design/geo](http://max.couchone.com/apps/_design/geo) (quickest option) or, if you want to hack on the source code first, you'll need to install the [CouchApp command line utility](http://couchapp.org/page/installing) and check out this repo.

If you want to hack on the code (aka build it yourself), once you have the couchapp utility working, <code>git clone</code> this repo and go into this folder and execute <code>couchapp init</code>. To upload these utils into your couch just run <code>couchapp push http://YOURCOUCH/DATABASENAME</code>. Otherwise see the Quick install section above.

When you push these utils into your couch it will enhance your database with the magical geo sprinkles contained in this repo and teach your database how to do awesome things with geo data. At this point you can use the following commands:

### [List Functions](http://guide.couchdb.org/editions/1/en/transforming.html)

#### geojson.js 

This function outputs a GeoJSON FeatureCollection (compatible with
OpenLayers and other mapping libraries). The geometry is stored in the `geometry` property, all
other properties in the `properties` property.

Example:

    $ curl -X GET http://localhost:5984/somedb/_design/geo/_list/geojson/all
    {"type": "FeatureCollection", "features":[{"type": "Feature", "geometry": {"type":"Point","coordinates":[11.395,48.949444]}, "properties": {"_id":"myfeature","_rev":"1-2eeb1e5eee6c8e7507b671aa7d5b0654","type":"Feature","color":"orange"}}

#### radius.js

This will take the centroid of the bbox parameter and a supplied radius parameter in meters and filter the rectangularly shaped bounding box result set by circular radius.

**WARNING** This only works with on points, not lines or polygons yet

Example:

    $ curl -X GET http://localhost:5984/mydb/_design/geo/_spatiallist/radius/points?bbox=-122.677,45.523,-122.675,45.524&radius=50
    {"rows":[{"id":"ef512bfdc9b17e9827f7275dd07d59c0","geometry":{"coordinates":[-122.676634,45.523667],"type":"Point"}},
    {"id":"ef512bfdc9b17e9827f7275dd07f4316","geometry":{"coordinates":[-122.676649,45.523966],"type":"Point"}},
    {"id":"ef512bfdc9b17e9827f7275dd08985a9","geometry":{"coordinates":[-122.676652,45.524034],"type":"Point"}}]};

### Helper Scripts

In the folder `misc` you can find helpful scripts or snippets for GeoCouch.

#### geocouch-filler.js

This node.js script can be handy for generating test data. It creates random documents within given value ranges. The script expects the following parameters:

 * The URI of the database to fill
 * A bounding box of the area to fill
 * The number of documents to generate

Example call:

	node geocouch-filler.js http://localhost:5984/gc-utils [-180,-90,180,90] 1000

This will create 1.000 documents with random locations spread over the whole world.


## License

Licensed under the MIT License.
