#!/bin/env node

var Server = require('./server/main');
WEBROOT = __dirname + '/client';

var server = new Server();
server.init();
server.callModels();
server.initWorld();
server.callControllers();

