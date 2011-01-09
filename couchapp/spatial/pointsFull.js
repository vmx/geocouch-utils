/**
 * A simple spatial view that emits the GeoJSON plus the complete documents.   
 */
function(doc){
	if(doc.geometry){
		emit(doc.geometry, doc);
	}
}
