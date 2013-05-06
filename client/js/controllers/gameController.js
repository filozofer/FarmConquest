

define(['jquery', '../lib/vector2', '../lib/fcl', '../entity/tile'], function(jQuery, Vector2, FCL, Tile) {

    jQuery.noConflict();
    var $j = jQuery;
    var GameController = Class.create();
    GameController.prototype = {

        initialize: function(app){
            this.canvas = undefined;
            this.app = app;
        },

        initEvents: function(){

            var self = this;
            GLOBAL_GAMECONTROLLER = new Object();

            $j(document).on('startGame', function() {
                self.startGame();
            });

            //Get map to draw from server
            socket.on('drawMap', function(resp){
                self.drawMap(resp.worldToDraw);
            });

        },

        startGame: function() {
            //Draw Game Canvas
            this.canvas = new FCL("section_canvas", 980, 440);
            socket.emit('getMapToDraw');

        },

        drawMap: function(worldToDraw) {

            var serverWorld = worldToDraw;
            var world = new Object();

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
                            world[i][j].contentTile = element.contentTile;

                            var tile = world[i][j];
                            tile.XPx = centerScreen.X - ((tile.Y - tileCenter.Y) * (tileWidth/2)) +((tile.X - tileCenter.X) * (tileWidth/2)) - (tileWidth/2);
                            tile.YPx = centerScreen.Y + ((tile.Y - tileCenter.Y) * (tileHeight/2)) +((tile.X - tileCenter.X) * (tileHeight/2)) - (tileHeight/2);
                            world[i][j] = tile;

                            if(tile.XPx >= -tileWidth &&
                                tile.XPx <= this.canvas.stage.attrs.width + tileWidth &&
                                tile.YPx >= -tileHeight &&
                                tile.YPx <= this.canvas.stage.attrs.height + tileHeight)
                            {

                                //Check contentTile not empty
                                if(tile.contentTile != undefined)
                                {
                                    switch(tile.contentTile.type)
                                    {
                                        case "farm":
                                            if(tile.contentTile.mainPos.X == tile.X && tile.contentTile.mainPos.Y == tile.Y)
                                                this.canvas.putTexture(new Vector2(tile.XPx - tileWidth / 2, tile.YPx - 18), this.app.Ressources["farm"] , world[i][j]);
                                            break;

                                        default:
                                            break;
                                    }
                                }
                                else
                                {
                                    this.canvas.putTexture(new Vector2(tile.XPx, tile.YPx), this.app.Ressources["tileTest"] , world[i][j]);
                                }

                            }
                        }
                    }
                }
            }

            this.canvas.draw();
        }


    };

    return GameController;

});
