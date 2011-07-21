/**
 * A simple spatial view that emits the GeoJSON plus the complete document.
 */
function(doc){
    if(doc.geometry){
        emit(doc.geometry, doc);
    }
}
