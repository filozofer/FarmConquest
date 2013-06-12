

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

                //Get possible empty tile around the farm
                var possibleTiles = new Array();
                for(var i = resp.X; i <= resp.X + 2; i++)
                {
                    for(var j = resp.Y; j <= resp.Y + 2; j++)
                    {
                        if(app.World[i] != undefined && app.World[i][j] != undefined && app.World[i][j].contentTile == undefined)
                        {
                            possibleTiles.push(app.World[i][j]);
                        }
                    }
                }
                var tile = self.getRandomInArray(possibleTiles);

                var positionPx = new Vector2(self.app.World[tile.X][tile.Y].XPx, self.app.World[tile.X][tile.Y].YPx - ((farmerImg.height  / self.app.Config.farmerSpriteNbLine) /2));
                self.farmer = new Farmer(tile.X, tile.Y);
                self.farmer.XPx = positionPx.X;
                self.farmer.YPx = positionPx.Y;
                self.canvas.putFarmerSprite(positionPx, farmerImg, self.farmer, self.canvas.L_NAME.players);

                socket.sessions.farmer = self.farmer;
            });
        },

        moveFarmer: function(path) {
            var isFarmer = true;
            this.canvas.moveTextureAlongPath(path, this.farmer.image, this.farmer, this.canvas.L_NAME.players, this.app.Config.playerMoveSpeed, isFarmer);
        },

        getRandomInArray: function(arrayR){
            var random = Math.floor((Math.random()*arrayR.length));
            return arrayR[random];
        }


    };

    return FarmerController;

});
