# Helper Functions for GeoCouch

This is a CouchApp providing helpul spatial functions and a set of helper scripts for GeoCouch.

## CouchApp

The folder `couchapp/` is a CouchApp that provides useful spatial functions. Follow these steps for deployment to your GeoCouch:
* Install the couchapp command line utility ()
* Clone this repository. Don't forget to do so recursively if you need vendor submodules.
* Change directory into `couchapp/` and execute: "couchapp init"
* Push to your GeoCouch: couchapp push http://*yourcouch*/*db*
* The CouchApp is then available at http://*yourcouch*/*db*/_design/gc-utils

### lists

#### geojson.js 

This function outputs a GeoJSON FeatureCollection (compatible with
OpenLayers). The geometry is stored in the `geometry` property, all
other properties in the `properties` property.

Examples:

    $ curl -X PUT -d '{"type":"Feature", "color":"orange" ,"geometry":{"type":"Point","coordinates":[11.395,48.949444]}}' 'http://localhost:5984/gc-utils/myfeature'
    {"ok":true,"id":"myfeature","rev":"1-2eeb1e5eee6c8e7507b671aa7d5b0654"}

    $ curl -X GET 'http://localhost:5984/vmxch/_design/gc-utils/_list/geojson/all'
    {"type": "FeatureCollection", "features":[{"type": "Feature", "geometry": {"type":"Point","coordinates":[11.395,48.949444]}, "properties": {"_id":"myfeature","_rev":"1-2eeb1e5eee6c8e7507b671aa7d5b0654","type":"Feature","color":"orange"}}


## Helper Scripts

In the folder `misc` you can find helpful scripts or snippets for GeoCouch.

### geocouch-filler.js

This node.js script can be handy for generating test data. It creates random documents within given value ranges.
**documentation tbd.**


## License

Licensed under the MIT License.
