exports.geojson = 
    /**
     * This function outputs a GeoJSON FeatureCollection (compatible with
     * OpenLayers). JSONP requests are supported as well.
     *
     * @author Volker Mische
     */
    function(head, req) {
        var row, out, sep = '\n';
    
        // Send the same Content-Type as CouchDB would
        if (req.headers.Accept.indexOf('application/json')!=-1) {
            start({"headers":{"Content-Type" : "application/json"}});
        }
        else {
            start({"headers":{"Content-Type" : "text/plain"}});
        }
    
        if ('callback' in req.query) {
            send(req.query['callback'] + "(");
        }
    
        send('{"type": "FeatureCollection", "features":[');
        while (row = getRow()) {
            out = JSON.stringify({type: "Feature", geometry: row.geometry,
                    properties: row.value});
            send(sep + out);
            sep = ',\n';
        }
        send("]}");
    
        if ('callback' in req.query) {
            send(")");
        }
    };
    

exports.kml =
    /**
     * A list function that transforms a spatial view result set into a KML feed.
     *
     * @author Benjamin Erb
     */
    function(head, req) {
        var row, out, sep = '\n';
    
        start({"headers":{"Content-Type" : "application/vnd.google-earth.kml+xml"}});
        send('<?xml version="1.0" encoding="UTF-8"?>\n');
        send('<kml xmlns="http://www.opengis.net/kml/2.2">\n');
        send('<Document>\n');
        send('<name>GeoCouch Result - KML Feed</name>\n');
        while (row = getRow()) {
            if(row.geometry){
                send('\t<Placemark>');
                send('<name>'+row.id+'</name>');
                send('<Point><coordinates>'+row.geometry.coordinates[0]+','+row.geometry.coordinates[1]+',0</coordinates></Point>');
                send('</Placemark>\n');
        	}
        }
        send('</Document>\n');
        send('</kml>\n');
    };
    
    
exports['knn-clustering'] = 
    /**
     * A clustering algorithm that clusters object based on their proximity, producing k distinct clusters.
     */
    function(head, req) {
    	start({"code": 501,"headers":{"Content-Type" : "text/plain"}});
    	//TODO: implement kNN clustering list    
    }
    
    
exports['proximity-clustering'] =
    /**
     * A clustering algorithm that clusters object based on their proximity, using a threshold value.
     */
    function(head, req) {	
    
        var g = require('vendor/clustering/ProximityCluster'),
            row,
            threshold =100;
    
        start({"headers":{"Content-Type" : "application/json"}});
        if ('callback' in req.query) send(req.query['callback'] + "(");
       
        if('threshold' in req.query){ threshold = req.query.threshold;}
        var pc = new g.PointCluster(parseInt(threshold));   
     
        while (row = getRow()) {
            pc.addToClosestCluster(row.value);
        }
    
        send(JSON.stringify({"rows":pc.getClusters()}));
    
        if ('callback' in req.query) send(")");
    };
    
    

exports.radius =
    /**
     * This will take the centroid of the bbox parameter and a supplied radius
     * parameter in meters and filter the rectangularly shaped bounding box
     * result set by circular radius.
     *
     * @author Max Ogden
     */
    function(head, req) {
      var gju = require('vendor/geojson-js-utils/geojson-utils'),
          row,
          out,
          radius = req.query.radius,
          bbox = JSON.parse("[" + req.query.bbox + "]"),
          center = gju.rectangleCentroid({
            "type": "Polygon",
            "coordinates": [[[bbox[0], bbox[1]], [bbox[2], bbox[3]]]]
          }),
          callback = req.query.callback,
          circle = gju.drawCircle(radius, center),
          startedOutput = false;
    
      if (req.headers.Accept.indexOf('application/json') != -1)
        start({"headers":{"Content-Type" : "application/json"}});
      else
        start({"headers":{"Content-Type" : "text/plain"}});
    
      if ('callback' in req.query) send(req.query['callback'] + "(");
      send('{"type": "FeatureCollection", "features":[');
      while (row = getRow()) {
        if (gju.pointInPolygon(row.geometry, circle)) {
          if (startedOutput) send(",\n");
          out = '{"type": "Feature", "geometry": ' + JSON.stringify(row.geometry) +
              ', "properties": ' + JSON.stringify(row.value) + '}';
          send(out);
          startedOutput = true;
        }
      }
      send("\n]};");
      if ('callback' in req.query) send(")");
    };
    