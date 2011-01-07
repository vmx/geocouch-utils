/**
 * A simple spatial view that emits the GeoJSON plus the complete documents.   
 */
function(doc){
	if(doc.geo){
		emit(doc.geo, doc);
	}
}