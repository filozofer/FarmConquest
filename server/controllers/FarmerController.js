/*
 Farmer Controller class
 */
var ShortestPath = require("../lib/shortestPath");

FarmerController = function(socket, db, mongoose){

    var self = this;

    this.getFarmer = function(user){
        var result = null;
        self.FarmerModel.findOne({ name : user.username },function (err, farmer) {
            if (err){throw(err);}

            if(farmer != null) {
                result = farmer
            }
        });
        return result;
    }

    //Models
    socket.on('getFarmer', function(){
        if(!socket.sessions.loadFarmerOnce){
            //GET FARMER POSITION
            var farmerPosition = new Object();
            farmerPosition.X = 3;
            farmerPosition.Y = 5;
            socket.emit('farmerPosition', {'position': farmerPosition});
            socket.sessions.loadFarmerOnce = true;
        }
    });

    socket.on('calculatePath', function(resp){

        var world = resp.world;
        var start = resp.start;
        var finish = resp.finish;

        //TEMP - WORLD GENERATION
        var pathManager = new ShortestPath(world, start, finish);
        var path = pathManager.shortestPath;

        socket.emit('farmerPath', {'path': path});
    });

};

module.exports = FarmerController;




