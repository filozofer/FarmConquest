//Config Server

var http        = require('http'),
    io          = require('socket.io').listen(1337),
    mongoose    = require('mongoose'),
    db          = require('./lib/db');


//Controllers Import
var UserController      = require('./controllers/userController');
var GameController      = require('./controllers/gameController');
var FarmerController    = require('./controllers/farmerController');
var MapController       = require('./controllers/mapController');

function LoadServer(){};
LoadServer.prototype = {

    init: function() {
        //The server is launch line 5 (require socket.io and listen)
        console.log('Server Start...');
    },

    callModels: function(){
        console.log("Call models");
        require('./models/user.js');
        require('./models/farmer.js');
        require('./models/farm.js');
    },

    callControllers: function(){

        //Case connection received
        io.sockets.on('connection', function(socket){

            //Initialize sessions
            socket.sessions = new Object();

            //Call Controllers
            new UserController(socket, db, mongoose);
            new GameController(socket, db, mongoose);
            new FarmerController(socket, db, mongoose);
            new MapController(socket, db, mongoose);

        });
    }

}

module.exports = LoadServer;