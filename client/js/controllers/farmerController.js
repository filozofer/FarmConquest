

define(['jquery', '../lib/vector2', '../lib/fcl', '../entity/tile', '../lib/shortestPath'], function(jQuery, Vector2, FCL, Tile, ShortestPath) {

    jQuery.noConflict();
    var $j = jQuery;
    var FarmerController = Class.create();
    FarmerController.prototype = {

        initialize: function(app){
            this.app = app;
        },

        initEvents: function(){

            var self = this;
            GLOBAL_FARMERCONTROLLER = new Object();

            $j(document).on('FARMER-moveFarmer', function(event, tile) {
                self.moveFarmer(tile);
            });
        },

        moveFarmer: function(tile) {

            var world = this.app.World;
            console.log("objectif: " + tile.X +","+tile.Y);

            //DEFAULT DEPART
            var start = world[0][0];
            console.log("depart: " + start.X +","+start.Y);

            var pathManager = new ShortestPath(world, start, tile);
            var path = pathManager.shortestPath;

            for (var i=0; i<path.length; i++){
                console.log(path[i].X+","+path[i].Y);
            }

            /*
            var centerScreen = new Object();
            centerScreen.X = this.canvas.stage.attrs.width/2;
            centerScreen.Y = this.canvas.stage.attrs.height/2;
            // CENTER = 0,0
            var tileCenter = new Tile(0,0);

            //var ScreenMinX = tileCenter.X - (centerScreen.X / 40);
            var ScreenMinX = -13;
            var ScreenMaxX = 14;
            var ScreenMinY = -13;
            var ScreenMaxY = 14;
            var tileWidth = this.app.Config.tileWidth;
            var tileHeight = this.app.Config.tileHeight;

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
                                tile.XPx <= this.canvas.stage.attrs.width + tileWidth &&
                                tile.YPx >= -tileHeight &&
                                tile.YPx <= this.canvas.stage.attrs.height + tileHeight)
                            {
                                this.canvas.putTexture(new Vector2(tile.XPx, tile.YPx), this.app.Ressources["tileTest"] , world[i][j]);
                            }
                        }
                    }
                }
            }

            this.canvas.draw();
            */
        }


    };

    return FarmerController;

});
