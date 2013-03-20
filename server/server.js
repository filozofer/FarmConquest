
var http = require('http');

http.createServeur(function (req, res){
       console.log('Server Start...');
});

httpServer.listen(1337);

var io = require('socket.io').listen(httpServer);

require('controllers/userControllers.js');