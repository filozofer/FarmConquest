

define(['jquery', '../entity/user'], function($, User) {

    var UserController = Class.extend({

        initEvents: function(){
            var self = this;
            GLOBAL = new Object();

            //Submit form login
            $('#form_login').on('submit', function(event){
                event.preventDefault();
                self.loginEvent();
            });

            $('#form_register').on('submit', function(event){
                event.preventDefault();
                self.registerEvent();
            });

        },

        loginEvent: function(){
            var userLogin = new User();
            userLogin.createLogin($("#input_username").val(), $("#input_password").val());
            socket.emit('login', userLogin);

            socket.on('login_resp', function(resp){

                var loginState = resp.loginState;
                var errorsMessages = resp.errorsMessages;
                if(loginState) {
                    $('#section_intro').fadeOut();
                } else {
                    for(var i in errorsMessages)
                    {
                        switch(errorsMessages[i])
                        {
                            case "bad_login":
                                $("#input_username").parent().parent().addClass('error');
                                $("#input_username").parent().append("<span class='help-inline'>Informations incorrect</span>");
                                break;

                            default:
                                alert(errorsMessages[i]);
                        }
                    }
                }

            });
        },

        registerEvent: function(){

            //Get values
            var userRegister = new User();
            var username = $("#input_username_r").val();
            var password = $("#input_password_r").val();
            var passwordConf = $("#input_password_conf_r").val();
            userRegister.passwordConf = passwordConf;

            //Reset state ui
            $("#input_username_r").parent().parent().removeClass('error');
            $("#input_password_r").parent().parent().removeClass('error');
            $("#input_password_conf_r").parent().parent().removeClass('error');
            $('.help-inline').remove();

            userRegister.createLogin(username, password);
            socket.emit('register', userRegister);
            GLOBAL.receiveRegister = false;

            socket.on('register_resp', function(resp){
                  if(GLOBAL.receiveRegister){ return; } else { GLOBAL.receiveRegister = true;}
                  var registerState = resp.registerState;
                  var errorsMessages = resp.errorsMessages;
                  if(registerState) {
                      $('#section_intro').fadeOut();
                  } else {
                      for(var i in errorsMessages)
                      {
                          switch(errorsMessages[i])
                          {
                              case "username_size":
                                  $("#input_username_r").parent().parent().addClass('error');
                                  $("#input_username_r").parent().append("<span class='help-inline'>6 à 20 caractères</span>");
                                  break;

                              case "password_conf":
                                  $("#input_password_r").parent().parent().addClass('error');
                                  $("#input_password_conf_r").parent().parent().addClass('error');
                                  $("#input_password_conf_r").parent().append("<span class='help-inline'>Mot de passe différent</span>");
                                  break;

                              default:
                                  alert(errorsMessages[i]);
                          }
                      }
                  }
            });
        }

    });

    return UserController;
});
