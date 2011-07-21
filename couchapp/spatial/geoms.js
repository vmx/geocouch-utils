/**
 * A simple spatial view that emits GeoJSON plus the original document id.
 */
function(doc){
    if(doc.geometry){
        emit(doc.geometry, doc._id);
    }
}
