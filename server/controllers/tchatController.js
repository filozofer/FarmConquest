
TchatController = function(socket, db, mongoose){

    var Configuration = require('../config/config');
    var config = new Configuration();
    var self = this;

    socket.on('newMessage', function(resp){
        console.log("Position : " + socket.sessions.farmer.X + "/" + socket.sessions.farmer.Y);
        io.sockets.emit('tchatMessage', {
            message: resp.message,
            username: resp.username
        });
    });

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
                if ((currentFarmer.X >= minX && currentFarmer.X <= maxX) && (currentFarmer.Y >= minY && currentFarmer.Y <= maxY)){
                    socketsToUse.push(currentSocket);
                }
            }
        }
        return socketsToUse;
    }

};

module.exports = TchatController;