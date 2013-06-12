//Config Server
var EventEmitter = require('events').EventEmitter;
var http        = require('http'),
    mongoose    = require('mongoose'),
    db          = require('./lib/db');

//Change log level
io = require('socket.io').listen(1337);
io.set('log level', 1);


//Controllers Import
var UserController      = require('./controllers/userController');
var GameController      = require('./controllers/gameController');
var FarmerController    = require('./controllers/farmerController');
var WorldController     = require('./controllers/worldController');
var TchatController     = require('./controllers/tchatController');
var FarmingController   = require('./controllers/farmingController');

/* GLOBAL */
G = new Object();
G.World = undefined;

//userSockets = {};
userSockets = new Array();


function LoadServer(){};
LoadServer.prototype = {

    init: function() {
        //The server is launch line 5 (require socket.io and listen)
        console.log('Server Start...');
        db();
    },

    initWorld: function() {

        //Init the world from the database
        var worldControllerServer = new WorldController(null, db, mongoose);
        worldControllerServer.initWorld();

    },

    callModels: function(){
        require('./models/user.js');
        require('./models/contentTile.js');
        require('./models/farmer.js');
        require('./models/Tile.js');
        require('./models/farm.js');
        require('./models/worldInfo.js');
    },

    callControllers: function(){

        //Case connection received
        io.sockets.on('connection', function(socket){

            //Initialize sessions
            socket.sessions = new Object();

            var socketId = userSockets.push(socket);
            socket.sessions.socketId = socketId;

            //Call Controllers
            socket.controllers = new Object();
            socket.controllers.userController = new UserController(socket, db, mongoose);
            socket.controllers.gameController = new GameController(socket, db, mongoose);
            socket.controllers.farmerController = new FarmerController(socket, db, mongoose);
            socket.controllers.worldController = new WorldController(socket, db, mongoose);
            socket.controllers.tchatController = new TchatController(socket, db, mongoose);
            socket.controllers.farmingController = new FarmingController(socket, db, mongoose);
        });
    }

}

module.exports = LoadServer;