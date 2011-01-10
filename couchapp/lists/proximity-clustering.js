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

