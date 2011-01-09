function(head, req) {
  var g = require('vendor/geojson-js-utils/geojson-utils'),
      row,
      radius = req.query.radius,
      bbox = JSON.parse("[" + req.query.bbox + "]"),
      center = g.rectangleCentroid({ 
        "type": "Polygon",
        "coordinates": [[[bbox[0], bbox[1]], [bbox[2], bbox[3]]]]
      }),
      callback = req.query.callback,
      circle = g.drawCircle(radius, center),
      startedOutput = false;
      
  if (req.headers.Accept.indexOf('application/json') != -1)
    start({"headers":{"Content-Type" : "application/json"}});
  else
    start({"headers":{"Content-Type" : "text/plain"}});

  if ('callback' in req.query) send(req.query['callback'] + "(");
  send('{"rows":[');
  while (row = getRow()) {
    if (g.pointInPolygon(row.value.geometry, circle)) {
      if (startedOutput) send(",\n");
      send(JSON.stringify(row.value));
      startedOutput = true;
    }
  }
  send("]};");
  if ('callback' in req.query) send(")");
};
