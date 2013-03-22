
/*
    User Controller class
 */
UserController = function(socket){

    socket.on('login', function(userLogin){
        //TODO
        console.log('login ' + userLogin.username + ' ' + userLogin.password);
        socket.emit('login', true);
    });

    socket.on('register', function(userRegister){
        //TODO
        console.log('register');
        socket.emit('register');
    });

};

module.exports = UserController;



