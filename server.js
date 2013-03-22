
var Server = require('./server/main');

var server = new Server();
server.init();
server.callControllers();

