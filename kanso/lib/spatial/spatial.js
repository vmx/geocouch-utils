exports.geoms = 
    /**
     * A simple spatial view that emits GeoJSON plus the original document id.
     */
    function(doc){
        if(doc.geometry){
            emit(doc.geometry, doc._id);
        }
    }
    

exports.geomsFull =
    /**
     * A simple spatial view that emits the GeoJSON plus the complete document.
     */
    function(doc){
        if(doc.geometry){
            emit(doc.geometry, doc);
        }
    }
    

exports.geomsOnly =
    /**
     * A simple spatial view that emits only the GeoJSON object without
     * further values.
     */
    function(doc){
        if(doc.geometry){
            emit(doc.geometry, null);
        }
    }
    

exports.geomsProps =
    /**
     * A spatial function that emits the geometry plus the value of the
     * properties field of the document (or null if not defined).
     */
    function(doc){
        if(doc.geometry){
            emit(doc.geometry, doc.properties || null);
        }
    }
    