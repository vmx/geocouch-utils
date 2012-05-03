exports.KNNCluster =
    /**
     * kNN-based Clustering
     */
    (function() {
    	var cluster = this.cluster = {};
    
    	if (typeof module !== 'undefined' && module.exports) {
    		module.exports = cluster;
    	}
    	
    	//TODO
    })();
    
    
exports.ProximityCluster =
    /**
     * Proximity based clustering
     */
    (function() {
    
        var proxcluster = this.proxcluster = {};
    	if (typeof module !== 'undefined' && module.exports) {
    		module.exports = proxcluster;
    	}
    
        var gju = require('vendor/geojson-js-utils/geojson-utils');
    
        proxcluster.PointCluster = function(threshold){
            this.clusters = [];
            this.points = [];
            this.distanceThreshold = threshold;
    
        };
      
        proxcluster.PointCluster.prototype.addToClosestCluster = function(point) {
            var distance = 40000; // Some large number
            var clusterToAddTo = null;
            var pos = point.geometry;
            for (var i = 0, cluster; cluster = this.clusters[i]; i++) {
                var center = cluster.center;
              
                if (center) {
                    var d = gju.pointDistance(center, pos)/1000; //convert to km
                    if ( d < this.distanceThreshold) {
                        distance = d;
                        clusterToAddTo = cluster;
                    }
                }
            }
    
            if (clusterToAddTo) {
                clusterToAddTo.addPoint(point);
            } else {
                var cluster = new proxcluster.Cluster(this);
                cluster.addPoint(point);
                this.clusters.push(cluster);
            }
        };
    
        proxcluster.PointCluster.prototype.getClusters = function(){
    
            var clusterdata = [];
            for (var i = 0, cluster; cluster = this.clusters[i]; i++) {
                clusterdata.push({"center":cluster.center, "points":cluster.getPoints(), "size": cluster.getSize()});
            }
            return clusterdata;
        }
    
        /**
         * A cluster that contains points.
         *
         * @param {PointCluster} The PointCluster that this
         *     cluster is associated with.
         * @constructor
         * @ignore
         */
        proxcluster.Cluster = function (PointCluster) {
            this.pointCluster = PointCluster;
            this.center = null;
            this.points = [];
        }
    
        /**
         * Add a point the cluster.
         *
         * @param {point} The point to add.
         * @return {boolean} True if the point was added.
         */
        proxcluster.Cluster.prototype.addPoint = function(point) {
            if (!this.center) {
                this.center = point.geometry;
            } else {
                var l = this.points.length + 1;
                var lng = (this.center.coordinates[0] * (l-1) + point.geometry.coordinates[0]) / l;
                var lat = (this.center.coordinates[1] * (l-1) + point.geometry.coordinates[1]) / l;
                this.center = {"type": "Point", "coordinates":[lng, lat]};
            }
    
          
            this.points.push(point);
    
            return true;
        };
    
    
        /**
         * Returns points in the cluster
         *
         * @return {Array.<points>} The points
         */
        proxcluster.Cluster.prototype.getPoints = function() {
            return this.points;
        };
    
        /**
         * Returns number of points
         *
         * @return {int} number of points
         */
        proxcluster.Cluster.prototype.getSize = function() {
            return this.points.length;
        };
    
    
    })();
    