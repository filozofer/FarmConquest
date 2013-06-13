/*
 Farmer Controller class
 */
var ShortestPath = require("../lib/shortestPath");

FarmerController = function(socket, db, mongoose){

    var Farm = mongoose.model("Farm");
    var Farmer = mongoose.model("Farmer");

    socket.on('getFarmerPosition', function(){
        if(!socket.sessions.loadFarmerOnce){
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
                    socket.emit('farmerPosition', {X: tile.X, Y: tile.Y, farmer: farmer});
                    socket.sessions.loadFarmerOnce = true;
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

    // recuperation du fermier associé au joureur connecté
    // pour afficher certaines données coté client
    socket.on('getFarmer', function(){
        Farmer.findOne({user: socket.sessions.user._id }).exec(function(err,farmer){
            socket.emit("setFarmer", farmer.getAsObject());
        });
    });

};

module.exports = FarmerController;




