
//Config Server
var cls = require("./lib/class");
var http = require('http');
var io = require('socket.io').listen(1337);
mongoose = require('mongoose');
db = require('./lib/db');



//Controllers Import
var UserController = require('./controllers/userController');

LoadServer = cls.Class.extend({

    init: function() {
        //The server is launch line 5 (require socket.io and listen)
        console.log('Server Start...');
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

        });

    }

});

module.exports = LoadServer;