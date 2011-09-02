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
