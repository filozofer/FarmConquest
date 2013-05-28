

define(['jquery', '../lib/vector2', '../lib/fcl', '../entity/tile', './farmerController'], function(jQuery, Vector2, FCL, Tile, FarmerController) {

    jQuery.noConflict();
    var $j = jQuery;
    var GameController = Class.create();
    GameController.prototype = {

        initialize: function(app){
            this.canvas = undefined;
            this.app = app;
            //this.farmerController = undefined;
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

            socket.on('drawElement', function(resp){
               self.drawElement(resp);
            });


        },

        startGame: function() {
            //Draw Game Canvas
            this.canvas = new FCL("section_canvas", 980, 440);
            socket.emit('getMapToDraw');
        },

        drawMap: function(worldToDraw) {

            var serverWorld = worldToDraw;
            var world = this.app.World;
            world.center = serverWorld.center;

            var centerScreen = new Object();
            centerScreen.X = this.canvas.stage.attrs.width/2;
            centerScreen.Y = this.canvas.stage.attrs.height/2;
            // CENTER = 0,0
            var tileCenter = new Tile(world.center.X, world.center.Y);

            //var ScreenMinX = tileCenter.X - (centerScreen.X / 40);
            var ScreenMinX = this.app.Config.screenMinX;
            var ScreenMaxX = this.app.Config.screenMaxX;
            var ScreenMinY = this.app.Config.screenMinY;
            var ScreenMaxY = this.app.Config.screenMaxY;
            var tileWidth = this.app.Config.tileWidth;
            var tileHeight = this.app.Config.tileHeight;

            var countCurrentTile = 1;
            for(var i=ScreenMinX; i<ScreenMaxX; i++){

                if (serverWorld[i] != undefined){
                    world[i] = new Object();
                    for(var j=ScreenMinY; j<ScreenMaxY; j++){

                        if(serverWorld[i][j] != undefined){
                            var element = serverWorld[i][j];
                            var tileX = element.X;
                            var tileY = element.Y;
                            world[i][j] = new Tile(tileX, tileY);
                            world[i][j].contentTile = element.contentTile;

                            var tile = world[i][j];
                            tile.XPx = centerScreen.X - ((tile.Y - tileCenter.Y) * (tileWidth/2)) +((tile.X - tileCenter.X) * (tileWidth/2)) - (tileWidth/2);
                            tile.YPx = centerScreen.Y + ((tile.Y - tileCenter.Y) * (tileHeight/2)) +((tile.X - tileCenter.X) * (tileHeight/2)) - (tileHeight/2);
                            world[i][j] = tile;

                            if (tile.X == world.center.X && tile.Y == world.center.Y){
                                world.center.XPx = tile.XPx;
                                world.center.YPx = tile.YPx;
                            }

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
                                                this.canvas.putTexture(new Vector2(tile.XPx - tileWidth / 2, tile.YPx - 80), this.app.Ressources["farm"] , world[i][j], this.canvas.L_NAME.buildings, countCurrentTile);
                                            break;

                                        case "seed":
                                                this.canvas.putTexture(new Vector2(tile.XPx, tile.YPx - 20), this.app.Ressources["seedTest"] , world[i][j], this.canvas.L_NAME.tiles, countCurrentTile);
                                            break;

                                        default:
                                            break;
                                    }
                                }
                                else
                                {
                                    this.canvas.putTexture(new Vector2(tile.XPx, tile.YPx), this.app.Ressources["tileTest"] , world[i][j], this.canvas.L_NAME.tiles, countCurrentTile);
                                }

                                countCurrentTile++;
                            }
                        }
                    }
                }
            }
            this.app.World = world;

            this.refreshFarmerController();
        },

        refreshFarmerController: function(){
            //REFRESH FARMERCONTROLLER PARAMETERS WHEN WORLD LOADED
            $j(document).trigger('FARMER-canvasLoaded', [this.app, this.canvas]);
            socket.emit('getFarmer');
        },

        drawElement: function(resp) {
            var tile = new Tile(resp.element.X, resp.element.Y);
            tile.contentTile = resp.element;
            tile.walkable = false;
            this.canvas.changeTexture(tile);
        }
    };

    return GameController;

});
