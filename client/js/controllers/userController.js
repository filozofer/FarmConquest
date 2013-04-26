

define(['jquery', '../entity/user'], function(jQuery, User) {

    jQuery.noConflict();
    var $j = jQuery;
    var UserController = Class.create();
    UserController.prototype = {

        initialize: function(app){
            this.app = app;
        },

        initEvents: function(){

            var self = this;
            GLOBAL_USERCONTROLLER = new Object();

            //Submit form login
            $j('#form_login').on('submit', function(event){
                event.preventDefault();
                self.loginEvent();
            });

            $j('#form_register').on('submit', function(event){
                event.preventDefault();
                self.registerEvent();
            });

        },

        loginEvent: function() {
            var self = this;
            var userLogin = new User();
            userLogin.createLogin($j("#input_username").val(), $j("#input_password").val());
            socket.emit('login', userLogin);

            socket.on('login_resp', function(resp){

                var loginState = resp.loginState;
                var errorsMessages = resp.errorsMessages;
                if(loginState) {
                    $j('#section_intro').fadeOut(function(){
                        $j("#container").fadeIn();
                    });

                    //Add User in session
                    socket.sessions["currentUser"] = userLogin;

                    //Call gameController
                    $j(document).trigger('startGame');

                } else {
                    errorsMessages.forEach(function(element){

                        switch(element)
                        {
                            case "bad_login":
                                $j("#input_username").parent().parent().addClass('error');
                                $j("#input_username").parent().append("<span class='help-inline'>Informations incorrect</span>");
                                break;

                            default:
                                alert(element);
                        }
                    });
                }

            });

        },

        registerEvent: function(){

            //Get values
            var userRegister = new User();
            var username = $j("#input_username_r").val();
            var password = $j("#input_password_r").val();
            var passwordConf = $j("#input_password_conf_r").val();
            userRegister.passwordConf = passwordConf;

            //Reset state ui
            $j("#input_username_r").parent().parent().removeClass('error');
            $j("#input_password_r").parent().parent().removeClass('error');
            $j("#input_password_conf_r").parent().parent().removeClass('error');
            $j('.help-inline').remove();

            userRegister.createLogin(username, password);
            socket.emit('register', userRegister);
            GLOBAL_USERCONTROLLER.receiveRegister = false;

            socket.on('register_resp', function(resp){
                if(GLOBAL_USERCONTROLLER.receiveRegister){ return; } else { GLOBAL_USERCONTROLLER.receiveRegister = true;}
                var registerState = resp.registerState;
                var errorsMessages = resp.errorsMessages;
                if(registerState) {
                    $j('#section_intro').fadeOut();
                } else {
                    alert(errorsMessages.length);
                    errorsMessages.forEach(function(element){
                        switch(element)
                        {
                            case "username_size":
                                $j("#input_username_r").parent().parent().addClass('error');
                                $j("#input_username_r").parent().append("<span class='help-inline'>6 à 20 caractères</span>");
                                break;

                            case "password_conf":
                                $j("#input_password_r").parent().parent().addClass('error');
                                $j("#input_password_conf_r").parent().parent().addClass('error');
                                $j("#input_password_conf_r").parent().append("<span class='help-inline'>Mot de passe différent</span>");
                                break;

                            default:
                                console.log(element);
                        }
                    });
                }
            });
        }

    };

    return UserController;

});
