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
