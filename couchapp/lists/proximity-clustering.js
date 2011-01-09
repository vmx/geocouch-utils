/**
 * A clustering algorithm that clusters object based on their proximity, using a threshold value.
 */
function(head, req) {
	
    if (req.headers.Accept.indexOf('application/json')!=-1)
        start({"headers":{"Content-Type" : "application/json"}});
      else
        start({"headers":{"Content-Type" : "text/plain"}});
	
	start({"code": 501,"headers":{"Content-Type" : "text/plain"}});
	//TODO: implement proximity clustering list    
}
