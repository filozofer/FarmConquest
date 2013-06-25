//Config Server
var EventEmitter = require('events').EventEmitter;
var http        = require('http');
var mongoose    = require('mongoose');
var db          = require('./lib/db');

// OPENSHIFT //
//var express		= require('express');
//var connect		= require('connect');
//var fs			= require('fs');
// END OPENSHIFT //

//Prepare for socket io
io = undefined;

//Controllers Import
var UserController      = require('./controllers/userController');
var GameController      = require('./controllers/gameController');
var FarmerController    = require('./controllers/farmerController');
var WorldController     = require('./controllers/worldController');
var TchatController     = require('./controllers/tchatController');
var FarmingController   = require('./controllers/farmingController');
var BoardController     = require('./controllers/boardController');
var FightController     = require('./controllers/fightController');

/* GLOBAL */
G = new Object();
G.World = undefined;
G.Timeout = new Object();
userSockets = new Array();

var Configuration = require('./config/config');
Config = new Configuration();


function LoadServer(){};
LoadServer.prototype = {

    init: function() {
        //The server is launch line 5 (require socket.io and listen)
        console.log('Server Start...');
        db();

        // OPENSHIFT //
        /*
        ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        port      = process.env.OPENSHIFT_NODEJS_PORT || 80;
        if (typeof ipaddress === "undefined") {
            ipaddress = "127.0.0.1";
        }

        // Instance du serveur web
        var app = express();

        // Configuration du serveur web
        //app.use(express.logger()); //log from server web
        app.use('/', express.static(WEBROOT));
        app.use(app.router);
        server = http.createServer(app);

        // Ecoute du serveur web
        io = require('socket.io').listen(server);
        io.set('log level', 1);
        io.configure(function() {
            io.set("transports", ["websocket"]);
        });
        server.listen(port, ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                Date(Date.now() ), ipaddress, port);
        });*/

        // END OPENSHIFT //
    },

    initWorld: function() {

        //Init the world from the database
        var worldControllerServer = new WorldController(null, db, mongoose);
        worldControllerServer.initWorld();
        worldControllerServer.initMarketFluctuation();
    },

    callModels: function(){
        require('./models/user.js');
        require('./models/contentTile.js');
        require('./models/farmer.js');
        require('./models/Tile.js');
        require('./models/farm.js');
        require('./models/worldInfo.js');
        require('./models/itemBag.js');
        require('./models/weapon.js');
        require('./models/arsenal.js');
        require('./models/actionFight.js');
        require('./models/fight.js');
        require('./models/building.js');
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
            socket.controllers.boardController = new BoardController(socket, db, mongoose);
            socket.controllers.fightController = new FightController(socket, db, mongoose);
        });
    }

}

module.exports = LoadServer;