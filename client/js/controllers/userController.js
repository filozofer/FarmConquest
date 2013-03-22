

define(['jquery', '../entity/user'], function($, User) {

    var UserController = Class.extend({

        initEvents: function(){
            var self = this;

            //Submit form login
            $('#loginForm').on('submit', function(event){
                event.preventDefault();
                self.loginEvent();
            });

        },

        loginEvent: function(){
            var userLogin = new User();
            userLogin.createLogin($("#usernameLoginInput").val(), $("#passwordLoginInput").val());
            socket.emit('login', userLogin);
        }

    });

    return UserController;
});
