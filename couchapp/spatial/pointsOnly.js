/**
 * A simple spatial view that emits only the GeoJSON object further values.   
 */
function(doc){
	if(doc.geo){
		emit(doc.geo, null);
	}
}