var User = require("user.js");

io.sockets.on('connection', function(socket){

    console.log('User get page !');

    socket.on('login', function(user){
       //TODO
       console.log('login');
       socket.emit('login', true);
    });

    socket.on('register', function(user){
        //TODO
        console.log('register');
        socket.emit('register');
    });

});