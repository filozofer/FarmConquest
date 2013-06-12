/*
 Farmer Controller class
 */
var ShortestPath = require("../lib/shortestPath");

FarmerController = function(socket, db, mongoose){

    var Farm = mongoose.model("Farm");

    socket.on('getFarmerPosition', function(){
        if(!socket.sessions.loadFarmerOnce){
            //GET FARM POSITION
            Farm.findOne({owner: socket.sessions.user._id }).populate("mainPos").exec(function(err, farm){
                var farmObject = farm.toObject();
                socket.emit('farmerPosition', {X:farmObject.mainPos.X, Y: farmObject.mainPos.Y});
                socket.sessions.loadFarmerOnce = true;
            });
        }
    });

    socket.on('getFarmPositionForTeleport', function(){
        Farm.findOne({owner: socket.sessions.user._id }).populate("mainPos").exec(function(err, farm){
            var farmObject = farm.toObject();
            socket.emit('farmPositionForTeleport', {X:farmObject.mainPos.X, Y: farmObject.mainPos.Y});
        });
    });

    socket.on('calculatePath', function(resp){

        var world = resp.world;
        var start = resp.start;
        var finish = resp.finish;

        var pathManager = new ShortestPath(world, start, finish);
        var path = pathManager.shortestPath;

        socket.emit('farmerPath', {'path': path});
    });

};

module.exports = FarmerController;




