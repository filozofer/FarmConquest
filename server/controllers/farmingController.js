// -----------------------------------------------------------
//
// class        : FarmingController
// description  : Server interaction with tiles' farming
//
// -----------------------------------------------------------

FarmingController = function(socket, db, mongoose){

    socket.on('doFarmingAction', function(){
        console.log(socket.sessions.selectedActionIndex);
    });

}

module.exports = FarmingController;
