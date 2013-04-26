
/*
    User Controller class
 */
UserController = function(socket, db, mongoose){

    //Models
    var User = mongoose.model('User');

    socket.on('login', function(userLogin){

        //Get Values
        var userL = new User();
        userL.username = userLogin.username;
        userL.password = userLogin.password;
        var loginState = false;
        var errorsMessages = new Array();

        //Find in Db
        db();
        User.findOne({ username : userL.username, password : userL.password },function (err, user) {
            if (err){throw(err);}

            if(user != null) {
                socket.sessions.user = user;
                loginState = true;
            } else {
               errorsMessages.push("bad_login");
            }
            mongoose.connection.close();

            //Send response
            socket.emit('login_resp', {'loginState': loginState, 'errorsMessages': errorsMessages});
        })
    });

    socket.on('register', function(userRegister){

        //Get values
        var newUser = new User();
        var registerState = false;
        newUser.username = userRegister.username;
        newUser.password = userRegister.password;
        newUser.passwordConf =userRegister.passwordConf;
        newUser.dateOfCreation = new Date();

        //Verification
        var errors = new Array();
        if(newUser.username.length < 6 || newUser.username.length > 20){
            errors.push("username_size");
        }

        if(newUser.password != newUser.passwordConf) {
            errors.push("password_conf");
        }


        //TODO
        //User Exist

        if(errors.length == 0) {
            registerState = true;
            db();
            newUser.save(function(err){ if (err) { throw err; } mongoose.connection.close();});
            socket.sessions.user = newUser;
        }

        socket.emit('register_resp', {'registerState': registerState, 'errorsMessages': errors});
        mongoose.connection.close();
    });


};

module.exports = UserController;




