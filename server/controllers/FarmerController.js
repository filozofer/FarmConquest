/*
 Farmer Controller class
 */
var ShortestPath = require("../lib/shortestPath");

FarmerController = function(socket, db, mongoose){

    //Models

    socket.on('drawMap', function(resp){
                    self.drawMap(resp.worldToDraw);
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




