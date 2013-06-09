//Config Server
var EventEmitter = require('events').EventEmitter;
var http        = require('http'),
    io          = require('socket.io').listen(1337),
    mongoose    = require('mongoose'),
    db          = require('./lib/db');


//Controllers Import
var UserController      = require('./controllers/userController');
var GameController      = require('./controllers/gameController');
var FarmerController    = require('./controllers/farmerController');
var FarmController    = require('./controllers/farmController');
var MapController       = require('./controllers/mapController');
var DatabaseController       = require('./controllers/databaseController');

function LoadServer(){};
LoadServer.prototype = {

    init: function() {
        //The server is launch line 5 (require socket.io and listen)
        console.log('Server Start...');
        db();
    },

    callModels: function(){
        console.log("Call models");
        require('./models/user.js');
        require('./models/farmer.js');
        require('./models/farm.js');
        require('./models/worldInfo.js');
        require('./models/contentTile.js');
        require('./models/Tile.js');
        console.log("Models successfully called !");
    },

    callControllers: function(){

        //Case connection received
        io.sockets.on('connection', function(socket){

            //Initialize sessions
            socket.sessions = new Object();

            //Call Controllers
            var userController = new UserController(socket, db, mongoose);
            var gameController = new GameController(socket, db, mongoose);
            var farmerController = new FarmerController(socket, db, mongoose);
            var mapController = new MapController(socket, db, mongoose);
            var farmController = new FarmController(socket, db, mongoose);
            var dbController = new DatabaseController(socket, db, mongoose);

            process.emit('initDatabaseController', dbController);
            process.emit('initUserController', userController);
            process.emit('initGameController', gameController);
            process.emit('initFarmerController', farmerController);
            process.emit('initMapController', mapController);
            process.emit('initFarmController', farmController);
        });
    }

}

module.exports = LoadServer;