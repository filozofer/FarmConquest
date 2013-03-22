
//Config Server
var cls = require("./lib/class");
var http = require('http');
var io = require('socket.io').listen(1337);

//Controllers Import
var UserController = require('./controllers/userController');


LoadServer = cls.Class.extend({

    init: function() {
        //Creation Server
        var server = http.createServer(function(req, res){
            console.log('Server Start...');
        });
        //Server listen port 1337
        server.listen(1337);
        //Sockets system start to listen our server
        var io = require('socket.io').listen(server);
    },

    callControllers: function(){

        //Case connection received
        io.sockets.on('connection', function(socket){

            //Call Controllers
            new UserController(socket);

        });

    }

});

module.exports = LoadServer;