

define(['jquery', '../entity/user'], function(jQuery, User) {

    jQuery.noConflict();
    var $j = jQuery;
    var UserController = Class.create();
    UserController.prototype = {

        initialize: function(app){
            this.app = app;

            this.userTryToLog = undefined;
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

            socket.on('register_resp', function(resp){
                self.registerResp(resp);
            });

            socket.on('login_resp', function(resp){
                self.loginResp(resp);
            });

        },

        loginEvent: function() {
            this.userTryToLog = new User();
            this.userTryToLog.createLogin($j("#input_username").val(), $j("#input_password").val());
            socket.emit('login', this.userTryToLog);
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
            this.userTryToLog = userRegister;
            socket.emit('register', userRegister);
            GLOBAL_USERCONTROLLER.receiveRegister = false;

        },

        registerResp: function(resp){
            if(GLOBAL_USERCONTROLLER.receiveRegister){ return; } else { GLOBAL_USERCONTROLLER.receiveRegister = true;}
            var registerState = resp.registerState;
            var errorsMessages = resp.errorsMessages;
            if(registerState) {

                //Show the game
                $j('#section_intro').fadeOut(function(){
                    $j("#container").fadeIn();
                });

                //Add User in session
                socket.sessions.currentUser = this.userTryToLog;

                //Call gameController
                $j(document).trigger('startGame');

            } else {
                errorsMessages.forEach(function(element){
                    switch(element)
                    {
                        case "username_size":
                            $j("#input_username_r").parent().parent().addClass('error');
                            $j("#input_username_r").parent().append("<span class='help-inline'>Pseudo entre 6 et 20 caractères.</span>");
                            break;

                        case "password_conf":
                            $j("#input_password_r").parent().parent().addClass('error');
                            $j("#input_password_conf_r").parent().parent().addClass('error');
                            $j("#input_password_conf_r").parent().append("<span class='help-inline'>Mots de passe différents.</span>");
                            break;

                        case "user_exists":
                            $j("#input_username_r").parent().parent().addClass('error');
                            $j("#input_username_r").parent().append("<span class='help-inline'>Cet utilisateur existe déjà.</span>");

                        default:
                            break;
                    }
                });
            }
        },

        loginResp: function(resp){
            var loginState = resp.loginState;
            var errorsMessages = resp.errorsMessages;
            if(loginState) {
                $j('#section_intro').fadeOut(function(){
                    $j("#container").fadeIn();
                });

                //Add User in session
                socket.sessions.currentUser = this.userTryToLog;

                //Call gameController
                $j(document).trigger('startGame');

            } else {
                $j('.help-inline').remove();
                $j("#input_username").parent().parent().removeClass('error');
                errorsMessages.forEach(function(element){

                    switch(element)
                    {
                        case "bad_login":
                            $j("#input_username").parent().parent().addClass('error');
                            $j("#input_username").parent().append("<span class='help-inline'>Informations incorrectes</span>");
                            break;

                        default:
                            alert(element);
                    }
                });
            }
        }

    };

    return UserController;

});
