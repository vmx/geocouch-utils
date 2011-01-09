function(doc) {
  if (doc.geometry) {
    emit(doc.geometry, {id: doc._id, geometry: doc.geometry});    
  }
}

