//Config Server

var http = require('http');
var io = require('socket.io').listen(1337);
mongoose = require('mongoose');
db = require('./lib/db');


//Controllers Import
var UserController = require('./controllers/userController');
var GameController = require('./controllers/gameController');
var FarmerController = require('./controllers/farmerController');

function LoadServer(){};
LoadServer.prototype = {

    init: function() {
        //The server is launch line 5 (require socket.io and listen)
        console.log('Server Start...');
        var Map = require('./models/map.js');
        var map = new Map();
        map.print();
    },

    callModels: function(){
        require('./models/user.js');
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

        });
    }

}

module.exports = LoadServer;