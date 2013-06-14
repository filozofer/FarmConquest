// -----------------------------------------------------------
//
// class        : FarmingController
// description  : Server interaction with tiles' farming
//
// -----------------------------------------------------------

FarmingController = function(socket, db, mongoose){

    var farmingActions = ["arrosage","fertilisation"];
    var Farmer = mongoose.model("Farmer");
    var Tile = mongoose.model("Tile");

    socket.on('doFarmingAction', function(resp){
        var index = resp.index;
        var tile = resp.tile;
        var action = farmingActions[index];
        var query = { X: tile.X, Y: tile.Y };
        switch(action){
            case "arrosage" :
                if(tile.humidity < 10) {
                    tile.humidity++;
                    socket.sessions.farmer.money -= Config.waterPrice;
                    //UPDATE INFOS
                     Farmer.update(query, { humidity: tile.humidity }, null, null);
                     G.World[tile.X][tile.Y].humidity = tile.humidity;
                }
                break;
            case "fertilisation" :
                if(tile.fertility < 10) {
                    tile.fertility++;
                    socket.sessions.farmer.money -= Config.fertilizerPrice;
                    //UPDATE INFOS
                     Farmer.update(query, { fertility: tile.fertility }, null, null);
                     G.World[tile.X][tile.Y].humidity = tile.fertility;
                }
                break;
            default:
                break;
        }

        var farmerQuery = { name: socket.sessions.farmer.name };
        Farmer.update(farmerQuery, { money: socket.sessions.farmer.money }, null, null);

        socket.emit("beginWork", {tile: tile, money: socket.sessions.farmer.money, action: action});

        var sockets = getSocketByFarmerPosition(socket.sessions.farmer.X, socket.sessions.farmer.Y);
        for (var i=0; i<sockets.length; i++){
            var currentSocket = sockets[i];
            currentSocket.emit("ennemyBeginWork", {tile: tile, action: action});
        }

        setTimeout(function(){
            socket.emit("finishWork", {tile: tile});
            for (var i=0; i<sockets.length; i++){
                var currentSocket = sockets[i];
                currentSocket.emit("ennemyFinishWork", {tile: tile});
            }
        }, Config.workingTime);
    });



    var getSocketByFarmerPosition = function(X, Y){
        var socketsToUse = new Array();
        var minX = X - Config.communicationRadius;
        var maxX = X + Config.communicationRadius;
        var minY = Y - Config.communicationRadius;
        var maxY = Y + Config.communicationRadius;
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

};

module.exports = FarmingController;
