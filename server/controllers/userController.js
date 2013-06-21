
/*
    User Controller class
 */
UserController = function(socket, db, mongoose){

    //Models
    var User = mongoose.model('User');
    var Farmer = mongoose.model('Farmer');

    socket.on('login', function(userLogin){

        //Get Values
        var userL = new User();
        userL.username = userLogin.username;
        userL.password = userLogin.password;
        var loginState = false;
        var errorsMessages = new Array();

        //Find in Db
        User.findOne({ username : userL.username, password : userL.password },function (err, user) {
            if (err){throw(err);}

            if(user != null) {
                socket.sessions.user = user;
                socket.sessions.loadFarmerOnce = false;
                loginState = true;
                console.log(user.username + " logged in !");
            } else {
               errorsMessages.push("bad_login");
            }

            //Send response
            socket.emit('login_resp', {'loginState': loginState, 'errorsMessages': errorsMessages});

            Farmer.findOne({user: user}, function(err, farmer){
                if (err){throw(err);}

                if(farmer != null) {
                    socket.controllers.worldController.sendWorldToClient(farmer);
                }
            });

        });
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
        User.findOne({ username : newUser.username },function (err, user) {
                    if (err){throw(err);}

                    if(user != null) {
                        errors.push("user_exists");
                        console.log("USER FOUND");
                    }



                    if(errors.length == 0) {
                        registerState = true;
                        socket.emit('register_resp', {'registerState': registerState, 'errorsMessages': errors});

                        newUser.save(function(err){
                            if (err) { throw err; }

                            socket.sessions.user = newUser;
                            socket.controllers.worldController.addNewPlayer(newUser);
                        });
                    }
                    else
                    {
                        socket.emit('register_resp', {'registerState': registerState, 'errorsMessages': errors});
                    }

                    });


    });


};

module.exports = UserController;




