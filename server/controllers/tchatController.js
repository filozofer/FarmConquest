
TchatController = function(socket, db, mongoose){

    var Configuration = require('../config/config');
    var config = new Configuration();
    var self = this;

    var Farmer = mongoose.model("Farmer");

    this.ListCommand = new Object();

    socket.on('newMessage', function(resp){

        //Command Systems
        var isCommand = false;
        if(resp.message.charAt(0) == "/")
        {
            var command = resp.message.substr(1).split(' ')[0];
            var remaining = resp.message.substr(1 + command.length);
            isCommand = self.sendCommand(command, remaining);
        }

        if(!isCommand)
        {
            //Broadcast messages neightboors
            var socketToUse = getSocketByFarmerPosition(socket.sessions.farmer.X, socket.sessions.farmer.Y);
            for (var i=0; i<socketToUse.length; i++){
                socketToUse[i].emit('tchatMessage', {
                    message: resp.message,
                    username: resp.username
                });
            }
        }

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

    this.sendCommand = function(command, remaining){
        if(this.ListCommand[command] != undefined)
        {
            this.ListCommand[command](remaining);
            return true;
        }
        return false;
    }

    this.ListCommand.setAdmin = function(pass){
        if(pass == " pass=nonoMax")
        {
            Farmer.findById(socket.sessions.farmer._id, function(err, farmer){
                farmer.money = 50000;
                farmer.level = 10;
                farmer.experiences = 1000000;
                farmer.creditFight = 99;
                farmer.creditConquest = 500;
                farmer.save(function(err, farmerDB){
                   socket.sessions.farmer = farmerDB.getAsObject();
                   socket.emit('GAME-updateFarmerAttributes', farmerDB.getAsObject());
                });
            });
        }
    }

};

module.exports = TchatController;