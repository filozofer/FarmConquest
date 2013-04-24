

define(['jquery', '../entity/user', '../lib/vector2', '../lib/fcl', '../entity/tile'], function(jQuery, User, Vector2, FCL, Tile) {

    jQuery.noConflict();
    var $j = jQuery;
    var UserController = Class.create();
    UserController.prototype = {

        initialize: function(app){
            this.ifcl = undefined;
            this.app = app;
        },

        initEvents: function(){

            var self = this;
            GLOBAL = new Object();

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

                    //Declare lib draw canvas
                    self.ifcl = new FCL("section_canvas", 980, 440);


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

            socket.on('worldArray', function(resp){



                var serverWorld = resp.world;
                var world = new Object();

                var centerScreen = new Object();
                centerScreen.X = self.ifcl.stage.attrs.width/2;
                centerScreen.Y = self.ifcl.stage.attrs.height/2;
                // CENTER = 0,0
                var tileCenter = new Tile(0,0);

                //var ScreenMinX = tileCenter.X - (centerScreen.X / 40);
                var ScreenMinX = -13;
                var ScreenMaxX = 14;
                var ScreenMinY = -13;
                var ScreenMaxY = 14;
                var tileWidth = self.app.Config.tileWidth;
                var tileHeight = self.app.Config.tileHeight;

                var nbAppelleFonction = 0;

                for(var i=ScreenMinX; i<ScreenMaxX; i++){

                    if (serverWorld[i] != 'undefined'){
                        world[i] = new Object();
                        for(var j=ScreenMinY; j<ScreenMaxY; j++){

                            if(serverWorld[i][j] != 'undefined'){
                                var element = serverWorld[i][j];
                                var tileX = element.X;
                                var tileY = element.Y;
                                world[i][j] = new Tile(tileX, tileY);

                                var tile = world[i][j];
                                tile.XPx = centerScreen.X - ((tile.Y - tileCenter.Y) * (tileWidth/2)) +((tile.X - tileCenter.X) * (tileWidth/2)) - (tileWidth/2);
                                tile.YPx = centerScreen.Y + ((tile.Y - tileCenter.Y) * (tileHeight/2)) +((tile.X - tileCenter.X) * (tileHeight/2)) - (tileHeight/2);
                                world[i][j] = tile;

                                if(tile.XPx >= -tileWidth &&
                                    tile.XPx <= self.ifcl.stage.attrs.width + tileWidth &&
                                    tile.YPx >= -tileHeight &&
                                    tile.YPx <= self.ifcl.stage.attrs.height + tileHeight)
                                {
                                    nbAppelleFonction++;
                                    console.log("putTexture : " + nbAppelleFonction);
                                    self.ifcl.putTexture(new Vector2(tile.XPx, tile.YPx), self.app.Ressources["tileTest"] , world[i][j]);
                                }
                            }
                        }
                    }
                }

                self.ifcl.draw();
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
            GLOBAL.receiveRegister = false;

            socket.on('register_resp', function(resp){
                if(GLOBAL.receiveRegister){ return; } else { GLOBAL.receiveRegister = true;}
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
