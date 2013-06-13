// -----------------------------------------------------------
//
// class        : FarmingController
// description  : Server interaction with tiles' farming
//
// -----------------------------------------------------------

FarmingController = function(socket, db, mongoose){

    var farmingActions = ["arrosage","fertilisation"];

    socket.on('doFarmingAction', function(resp){
        var index = resp.index;
        var tile = resp.tile;
        var action = farmingActions[index];

        switch(action){
            case "arrosage" :
                if(tile.humidity < 10) {
                    tile.humidity++;
                    console.log(socket.sessions.farmer.money);
                }
                break;
            case "fertilisation" :
                if(tile.fertility < 10) {
                    tile.fertility++;
                }
                break;
            default:
                break;
        }

        socket.emit("updateTile", tile);
    });

};

module.exports = FarmingController;
