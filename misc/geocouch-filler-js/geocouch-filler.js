/**
 * A simple helper script for generating test data using node.js
 *
 * @author Benjamin Erb
 */
var http = require('http');
var url = require('url');
var path = require('path');

require.paths.unshift(path.join(__dirname, 'lib'));
var Barrier = require('barrier').Barrier;

var httpClientPoolSize = 16;
var host,port,db;

if(process.argv.length < 5){
	console.log("\n\tUsage: node geocouch-filler.js <database-URI> <[bbox]> <count>\n\n")
	process.exit(1);
};
var uri = url.parse(process.argv[2] || "http://localhost:5984/gc-utils");
var bbox = JSON.parse(process.argv[3] || "[-180,-90,180,90]") ;
var documentCount = parseInt(process.argv[4]) || 10;


if(uri && bbox && bbox.length === 4 && documentCount){
	host = uri.hostname;
	port = uri.port || 5984;
	db = uri.pathname.split("/")[1] || "gc-utils";
}

var randomArbitrary = function(min, max) {
    return Math.random() * (max - min) + min;
};


//create client pool to speed
var clients = [];
for (var i = 0; i < httpClientPoolSize; i++) {
    clients.push(http.createClient(port, host));
}

//barrier allows to exit when queries have been executed
var b = new Barrier(documentCount, function() {
	console.log("Insertion completed");
	process.exit(0);
});

var ptr = 0;

for (var i = 0; i < documentCount; i++) {
    var client = clients[ptr++ % httpClientPoolSize];

    var entity = {
	"geometry" : {
		"type" : "Point",
		"coordinates": [randomArbitrary(bbox[0],bbox[2]),randomArbitrary(bbox[1],bbox[3])]
	}
    };

    var request = client.request('POST', "/" + db, {
        "Content-Type": "application/json",
	"Connection": "keep-alive"
    });
    request.write(JSON.stringify(entity));
    request.end();
    request.once('response', function (response) {
	if(response.statusCode === 201){
		console.log("Document "+response.headers['location']+" created");
		b.submit();
	}
	else{
		console.log("POST caused "+response.statusCode+"!");
		b.submit();
	}
    });
}
