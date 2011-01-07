/**
 * A simple spatial view that emits GeoJSON plus the original GeoJSON value and document id.
 */
function(doc){
	if(doc.geo){
		emit(doc.geo, {
			id: doc._id,
			geo: doc.geo			
		});
	}
}