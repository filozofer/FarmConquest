// -----------------------------------------------------------
//
// class        : FarmingController
// description  : Server interaction with tiles' farming
//
// -----------------------------------------------------------

FarmingController = function(socket, db, mongoose){

    var farmingActions = ["arrosage","fertilisation"];

    socket.on('doFarmingAction', function(tile, index){
        var action = farmingActions[index];

        switch(action){
            case "arrosage" :
                if(tile.humidity < 10) {
                    tile.humidity++;
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
    });

};

module.exports = FarmingController;
