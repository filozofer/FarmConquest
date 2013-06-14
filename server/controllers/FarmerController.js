/*
 Farmer Controller class
 */
var ShortestPath = require("../lib/shortestPath");

FarmerController = function(socket, db, mongoose){

    var Configuration = require('../config/config');
    var config = new Configuration();

    var Farm = mongoose.model("Farm");
    var Farmer = mongoose.model("Farmer");

    var self = this;

    socket.on('getFarmerPosition', function(){
        if(!socket.sessions.loadFarmerOnce){
            //Find the farm of the connect player
            Farm.findOne({owner: socket.sessions.user._id }).populate("mainPos").exec(function(err, farm){
                var farmObject = farm.toObject();
                var mainPos = farmObject.mainPos;

                self.addMissingWorld(mainPos);

                //Get possible empty tile around the farm
                var possibleTiles = new Array();
                for(var i = mainPos.X; i <= mainPos.X + 2; i++)
                {
                    for(var j = mainPos.Y; j <= mainPos.Y + 2; j++)
                    {
                        if(G.World[i] != undefined && G.World[i][j] != undefined && G.World[i][j].walkable)
                        {
                            possibleTiles.push(G.World[i][j]);
                        }
                    }
                }
                var random = Math.floor((Math.random()*possibleTiles.length));
                //Tile contains the position set for the player
                var tile = possibleTiles[random];

                //Update position in database
                Farmer.update({name: socket.sessions.user.username}, {X: tile.X, Y: tile.Y}, function(err, farmer){

                    Farmer.findOne({name: socket.sessions.user.username}).populate("bag").exec(function(err, farmerWithBag){
                        //Update farmer in socket sessions
                        socket.sessions.farmer = farmerWithBag.getAsObject();
                        //Send to client
                        socket.emit('farmerPosition', {X: tile.X, Y: tile.Y, farmer: socket.sessions.farmer});
                        socket.sessions.loadFarmerOnce = true;
                        self.generateNeighbors();
                    });
                });
            });
        }
    });

    socket.on('getFarmPositionForTeleport', function(){
        //Find the farm of the connect player
        Farm.findOne({owner: socket.sessions.user._id }).populate("mainPos").exec(function(err, farm){
            var farmObject = farm.toObject();
            var mainPos = farmObject.mainPos;

            //Get possible empty tile around the farm
            var possibleTiles = new Array();
            for(var i = mainPos.X; i <= mainPos.X + 2; i++)
            {
                for(var j = mainPos.Y; j <= mainPos.Y + 2; j++)
                {
                    if(G.World[i] != undefined && G.World[i][j] != undefined && G.World[i][j].walkable)
                    {
                        possibleTiles.push(G.World[i][j]);
                    }
                }
            }
            var random = Math.floor((Math.random()*possibleTiles.length));
            //Tile contains the position set for the player
            var tile = possibleTiles[random];

            //Update position in database
            Farmer.findOneAndUpdate({name: socket.sessions.user.username}, {X: tile.X, Y: tile.Y}, function(err, farmer){
                //Update farmer in socket sessions
                socket.sessions.farmer = farmer.getAsObject();
                //Send to client
                socket.emit('farmPositionForTeleport', {X: tile.X, Y: tile.Y});
            });
        });
    });

    socket.on('calculatePath', function(resp){

        var finish = resp.finish;
        var goToWork = resp.goToWork;

        var pathManager = new ShortestPath(G.World, socket.sessions.farmer, finish, goToWork);

        var path = pathManager.shortestPath;
        socket.sessions.pathMove = path;
        socket.emit('farmerPath', {'path': path});

        //FOR ENNEMY, SEND MOVEMENT
        var neighborSockets = getSocketByFarmerPosition(socket.sessions.farmer.X, socket.sessions.farmer.Y);
        for(var i=0; i<neighborSockets.length; i++){
            var currentSocket = neighborSockets[i];
            currentSocket.emit('ennemyPath', {ennemy: socket.sessions.farmer, path: path});
        }
    });

    socket.on('updateFarmerPositionOnMove', function(tile){

        if(socket.sessions.pathMove != undefined && socket.sessions.pathMove.length > 0)
        {
            if(tile.X == socket.sessions.pathMove[0].X && tile.Y == socket.sessions.pathMove[0].Y)
            {
                socket.sessions.pathMove.shift();
                Farmer.findOneAndUpdate({name: socket.sessions.user.username}, {X: tile.X, Y: tile.Y}, function(err, farmer){
                    //Update farmer in socket sessions
                    socket.sessions.farmer = farmer.getAsObject();
                });
            }
        }
    });

    // Recuperation du fermier associé du joueur connecté
    // pour afficher certaines données coté client
    socket.on('getFarmer', function(){
        Farmer.findOne({user: socket.sessions.user._id }).populate("bag").exec(function(err,farmer){
            socket.emit("setFarmer", farmer.getAsObject());
        });
    });

    socket.on('teleportToFarm', function(resp){
        var neighborSockets = getSocketByFarmerPosition(socket.sessions.farmer.X, socket.sessions.farmer.Y);
        for(var i=0; i<neighborSockets.length; i++){
            var currentSocket = neighborSockets[i];
            currentSocket.emit('ennemyTeleportedToFarm', {'ennemyName': socket.sessions.farmer.name, 'position':{X: resp.ennemy.X, Y: resp.ennemy.Y}} );
        }
    });

    this.generateNeighbors = function(){
        var neighborSockets = getSocketByFarmerPosition(socket.sessions.farmer.X, socket.sessions.farmer.Y);
        for(var i=0; i<neighborSockets.length; i++){
            var currentSocket = neighborSockets[i];
            currentSocket.emit('ennemyFarmer', socket.sessions.farmer);
            socket.emit('ennemyFarmer', currentSocket.sessions.farmer);
        }
    }

    this.refreshNeighbors = function(){
        var neighborSockets = getSocketByFarmerPosition(socket.sessions.farmer.X, socket.sessions.farmer.Y);
        for(var i=0; i<neighborSockets.length; i++){
            var currentSocket = neighborSockets[i];
            socket.emit('ennemyFarmer', currentSocket.sessions.farmer);
        }
    }

    var getSocketByFarmerPosition = function(X, Y){
        var socketsToUse = new Array();
        var minX = X - config.communicationRadius;
        var maxX = X + config.communicationRadius;
        var minY = Y - config.communicationRadius;
        var maxY = Y + config.communicationRadius;
        for (var i=0; i<userSockets.length; i++){
            var currentSocket = userSockets[i];
            var currentFarmer = currentSocket.sessions.farmer;
            if (currentFarmer != undefined){
                //if current socket farmer position in the radius of communication of the speaker, save his socket
                if ((currentFarmer.X >= minX && currentFarmer.X <= maxX) && (currentFarmer.Y >= minY && currentFarmer.Y <= maxY) && (currentSocket.sessions.user.username != socket.sessions.user.username)){
                    socketsToUse.push(currentSocket);
                }
            }
        }
        return socketsToUse;
    }

    this.addMissingWorld = function(mainPos){

        var tileMinX = mainPos.X - (config.farmSize/2 - 2);
        var tileMinY = mainPos.Y - (config.farmSize/2 - 2);
        var tileMaxX = tileMinX + config.farmSize;
        var tileMaxY = tileMinY + config.farmSize;

        var world = new Object();

        for(var i = tileMinX; i < tileMaxX; i++)
        {
            for(var j = tileMinY; j < tileMaxY; j++)
            {
                if(G.World[i] != undefined && G.World[i][j] != undefined)
                {
                    if(world[i] == undefined){world[i] = new Object();}
                    world[i][j] = G.World[i][j];
                }
            }
        }

        var neighborSockets = getSocketByFarmerPosition(mainPos.X, mainPos.Y);

        for(var i=0; i<neighborSockets.length; i++){
            var currentSocket = neighborSockets[i];
            currentSocket.emit('GAME-missingWorld', {
                missingWorld: world,
                begin: {X: tileMinX, Y: tileMinY},
                finish: {X: tileMaxX, Y: tileMaxY}
            });
        }


    }

};

module.exports = FarmerController;




