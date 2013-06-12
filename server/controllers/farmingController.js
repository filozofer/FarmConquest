// -----------------------------------------------------------
//
// class        : FarmingController
// description  : Server interaction with tiles' farming
//
// -----------------------------------------------------------

FarmingController = function(socket, db, mongoose){

    var farmingActions = ["arrosage","fertilisation"];

    socket.on('doFarmingAction', function(selectedFarmingAction){
        console.log(farmingActions[selectedFarmingAction]);
    });

};

module.exports = FarmingController;
