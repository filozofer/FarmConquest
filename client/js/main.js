/**
 * Created with IntelliJ IDEA.
 * User: Maxime
 * Date: 22/03/13
 * Time: 10:54
 * To change this template use File | Settings | File Templates.
 */

define(['jquery', 'controllers/app', 'controllers/userController'], function(jQuery, App, UserController) {

    jQuery(function($) {

        var app, userController, game;

        //Load the App (html part)
        var initApp = function() {

                //Load Controllers
                app = new App();
                userController = new UserController(app);

                //Call init configurations
                app.center();
                socket = app.init();
                app.loadRessources();

                var first = true;
                $(document).on('loadRessourcesOver', function() {
                    if(first)
                    {
                        first = false;

                        //Init all events from controllers
                        userController.initEvents();

                        //Log+ContinueLoad
                        console.log("App initialized.");
                        initGame();
                    }
                });
        };

        //Load the Game (canvas part)
        var initGame = function() {
            //console.log("TODO GAME");
        };

        initApp();
    });

});
