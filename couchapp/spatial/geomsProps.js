/**
 * A spatial function that emits the geometry plus the value of the
 * properties field of the document (or null if not defined).
 */
function(doc){
    if(doc.geometry){
        emit(doc.geometry, doc.properties || null);
    }
}
