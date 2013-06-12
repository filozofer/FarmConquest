

define(['jquery', '../lib/vector2', '../lib/fcl', '../entity/farmer'], function(jQuery, Vector2, FCL, Farmer) {

    jQuery.noConflict();
    var $j = jQuery;
    var FarmerController = Class.create();
    FarmerController.prototype = {

        initialize: function(){
            this.app = undefined;
            this.canvas = undefined;
            this.farmer = undefined;
        },

        initEvents: function(){

            var self = this;
            GLOBAL_FARMERCONTROLLER = new Object();

            $j(document).on('FARMER-canvasLoaded', function(event, app, canvas){
                self.canvas = canvas;
                self.app = app;
            });

            $j(document).on('FARMER-moveFarmer', function(event, tile) {
                var world = self.app.World;

                //DEFAULT DEPART : FARMER POSITION
                var start = socket.sessions.farmer;

                socket.emit('calculatePath', {'world': world, 'start': start, 'finish': tile});
            });

            $j(document).on('FARMER-updatePosition', function(event, xToMove, yToMove){
                var newXPx = self.farmer.XPx + xToMove;
                var newYPx = self.farmer.YPx + yToMove;
                self.farmer.XPx = newXPx;
                self.farmer.YPx = newYPx;
                self.farmer.image.setX(newXPx);
                self.farmer.image.setY(newYPx);
                self.canvas.putFarmerSprite(new Vector2(newXPx, newYPx), self.farmer.image.attrs.image, self.farmer, self.canvas.L_NAME.players);
            });

            socket.on('farmerPath', function(resp){
                self.moveFarmer(resp.path);
            });

            socket.on('farmerPosition', function(resp){
                var farmerImg = self.app.Ressources["farmer"];
                var positionPx = new Vector2(self.app.World[resp.position.X][resp.position.Y].XPx, self.app.World[resp.position.X][resp.position.Y].YPx - ((farmerImg.height  / self.app.Config.farmerSpriteNbLine) /2));
                self.farmer = new Farmer(resp.position.X, resp.position.Y);
                self.farmer.XPx = positionPx.X;
                self.farmer.YPx = positionPx.Y;
                self.canvas.putFarmerSprite(positionPx, farmerImg, self.farmer, self.canvas.L_NAME.players);

                socket.sessions.farmer = self.farmer;
            });
        },

        moveFarmer: function(path) {
            var isFarmer = true;
            this.canvas.moveTextureAlongPath(path, this.farmer.image, this.farmer, this.canvas.L_NAME.players, this.app.Config.playerMoveSpeed, isFarmer);
        }


    };

    return FarmerController;

});
