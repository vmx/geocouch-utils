function(head, req) {
    var row, out, sep = '\n';

    // Send the same Content-Type as CouchDB would
    if (req.headers.Accept.indexOf('application/json')!=-1)
      start({"headers":{"Content-Type" : "application/json"}});
    else
      start({"headers":{"Content-Type" : "text/plain"}});

    send('{"type": "FeatureCollection", "features":[');
    while (row = getRow()) {
        out = '{"type": "Feature", "geometry": ' + JSON.stringify(row.value.geometry);
        delete row.value.geometry;
        out += ', "properties": ' + JSON.stringify(row.value) + '}';

        send(sep + out);
        sep = ',\n';
    }
    return "\n]}";
};
