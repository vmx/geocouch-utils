/**
 * A simple spatial view that emits GeoJSON plus the original GeoJSON value and document id.
 */
function(doc){
	if(doc.geometry){
		emit(doc.geometry, {
			id: doc._id,
			geometry: doc.geometry			
		});
	}
}
