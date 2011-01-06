/**
 * A simple helper script for generating test data using node.js
 *
 * @author Benjamin Erb
 */
var http = require('http');
var util = require('util');

var host = "localhost";
var port = 5984;
var db = "geotemp";

function getRandomArbitary(min, max) {
    return Math.random() * (max - min) + min;
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var clients = [];

for (var i = 0; i < 100; i++) {
    clients.push(http.createClient(port, host));
}


var ptr = 0;

for (var i = 0; i < 30000; i++) {
    var client = clients[ptr++ % 100];

    var lat = getRandomArbitary(47, 54);
    var lon = getRandomArbitary(6, 14);
    var variance = getRandomInt(0, 2000);
    var started = getRandomInt(1262304000, 1293753600);
    var ended = started + getRandomInt(1, 7200);
    var tags = [];

    var tagCount = getRandomInt(1, 10);
    for (var t = 0; t < tagCount; t++) {
        tags.push("tag" + getRandomInt(0, 999));
    }

    var entity = {
        lat: lat,
        lon: lon,
        variance: variance,
        ended: ended,
        started: started,
        tags: tags
    };


    var request = client.request('POST', "/" + db, {
        "content-type": "application/json"
    });
    request.write(JSON.stringify(entity));
    request.end();
    request.on('response', function (response) {
        console.log('STATUS: ' + response.statusCode);
        response.setEncoding('utf8');
        var buf = "";
        response.on('data', function (chunk) {
            buf = buf + chunk;
        });
        response.on('end', function () {
            console.log(util.inspect(JSON.parse(buf)));
        });
    });
}
