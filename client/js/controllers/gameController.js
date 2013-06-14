

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
                $j("#section_loadingMap").hide();
                self.canvas.clearCanvas();
                self.drawMap(resp.worldToDraw, resp.dimension);
                self.drawMapTexture();
                if (resp.isRefresh){
                    $j(document).trigger('FARMER-drawFarmer');
                } else {
                self.refreshFarmerController();
                }
            });

            socket.on('drawElement', function(resp){
               self.drawElement(resp);
            });

            $j(document).on('TILE-mouseOver', function(e, tile) {
                self.changeNotifTileZone(tile);
            });

            $j(document).on('GAME-updateDisplayedMap', function() {
                self.canvas.clearCanvas();
                self.drawMapTexture();
                //clear list of ennemies before refresh -> avoid same ennemy twice
                socket.sessions.ennemies.length = 0;
                // CALL SERVER TO LOAD NEW MAP TO DISPLAYED FROM NEW POSITION
                socket.emit('changeWorldCenter', app.World.center);
            });

            socket.on('farmPositionForTeleport', function(tile){
                var farmerImg = self.app.Ressources["farmer"];

                var positionPx = new Vector2(self.app.World[tile.X][tile.Y].XPx, self.app.World[tile.X][tile.Y].YPx - ((farmerImg.height  / self.app.Config.farmerSpriteNbLine) /2));
                socket.sessions.farmer.X = tile.X;
                socket.sessions.farmer.Y = tile.Y;
                socket.sessions.farmer.XPx = positionPx.X;
                socket.sessions.farmer.YPx = positionPx.Y;
                self.canvas.removeFarmerSprite(socket.sessions.farmer);
                self.canvas.putFarmerSprite(positionPx, farmerImg, socket.sessions.farmer, self.canvas.L_NAME.players);

                socket.emit('teleportToFarm', {ennemy: socket.sessions.farmer, tile: tile});
                self.canvas.stage.fire("dragMapToFarm");
            });

            $j("#mg_teleport").on('click', function(){
                //If the farmer don't walk we send a request for teleport to the server
                if(!socket.sessions.farmer.isWalking)
                {
                    socket.emit('getFarmPositionForTeleport');
                }
            });

            socket.on('GAME-missingWorld', function(resp){

                for(var i=resp.begin.X; i<resp.finish.X; i++){
                    for (var j=resp.begin.Y; j<resp.finish.Y; j++){
                        var currentMissingTile = resp.missingWorld[i][j];

                        if (app.World[i] == undefined){
                            app.World[i] = new Object();
                        }

                        app.World[i][j] = new Tile(currentMissingTile.X, currentMissingTile.Y);
                        app.World[i][j].setContentTile(currentMissingTile.contentTile);
                        app.World[i][j].owner = currentMissingTile.owner;
                        app.World[i][j].humidity = currentMissingTile.humidity;
                        app.World[i][j].fertility = currentMissingTile.fertility;
                    }
                }

            });

            this.tilesModifyEye = undefined;
            $j(document).on('mouseenter mouseleave', "#mg_eye_owner", function(ev){

                var mouse_is_inside = ev.type === 'mouseenter';

                if(mouse_is_inside)
                    $j("#mg_eye_owner").attr('src', "img/gameMenu/buttonEyeOwnerRed.png");
                else
                    $j("#mg_eye_owner").attr('src', "img/gameMenu/buttonEyeOwner.png");

                var username = socket.sessions.currentUser.username;
                self.tilesModifyEye = new Array();
                var screenMinX = self.app.Config.screenMinX;
                var screenMaxX = self.app.Config.screenMaxX;
                var screenMinY = self.app.Config.screenMinY;
                var screenMaxY = self.app.Config.screenMaxY;
                //Get tiles not own by the current player
                for(var i = screenMinX; i < screenMaxX; i++)
                {
                    for(var j = screenMinY; j < screenMaxY; j++)
                    {
                        if(app.World[i] != undefined && app.World[i][j] != undefined)
                        {
                            if(app.World[i][j].owner != undefined && app.World[i][j].owner.username != username)
                            {
                                self.tilesModifyEye.push(app.World[i][j]);
                            }
                        }
                    }
                }

                //For each tiles change opacity
                var opacityChange = (mouse_is_inside) ? -0.7 : +0.7;
                for(var i = 0; i < self.tilesModifyEye.length; i++)
                {
                    if(self.tilesModifyEye[i].image != undefined)
                    {
                        self.tilesModifyEye[i].image.setOpacity(self.tilesModifyEye[i].image.getOpacity() + opacityChange);
                    }
                    else
                    {
                        if (self.tilesModifyEye[i].contentTile != undefined){
                            var mainPos = self.tilesModifyEye[i].contentTile.mainPos;
                            if(app.World[mainPos.X][mainPos.Y].image != undefined)
                            {
                                app.World[mainPos.X][mainPos.Y].image.setOpacity(app.World[mainPos.X][mainPos.Y].image.getOpacity() + opacityChange);
                            }
                        }
                    }
                }

            });
        },

        startGame: function() {
            //Draw Game Canvas
            this.canvas = new FCL("section_canvas", 980, 440);
        },

        drawMap: function(worldToDraw, dimension) {

            var serverWorld = worldToDraw;
            var world = this.app.World;
            world.center = serverWorld.center;

            var centerScreen = new Object();
            centerScreen.X = this.canvas.stage.attrs.width/2;
            centerScreen.Y = this.canvas.stage.attrs.height/2;
            // CENTER = 0,0
            var tileCenter = new Tile(world.center.X, world.center.Y);

            var ScreenMinX = dimension.minX;
            var ScreenMaxX = dimension.maxX;
            var ScreenMinY = dimension.minY;
            var ScreenMaxY = dimension.maxY;

            this.app.Config.screenMinX = ScreenMinX;
            this.app.Config.screenMaxX = ScreenMaxX;
            this.app.Config.screenMinY = ScreenMinY;
            this.app.Config.screenMaxY = ScreenMaxY;

            var tileWidth = this.app.Config.tileWidth;
            var tileHeight = this.app.Config.tileHeight;

            for(var i=ScreenMinX; i<ScreenMaxX; i++){
                if (serverWorld[i] != undefined){
                    world[i] = new Object();
                    for(var j=ScreenMinY; j<ScreenMaxY; j++){

                        if(serverWorld[i][j] != undefined){
                            var element = serverWorld[i][j];
                            var tileX = element.X;
                            var tileY = element.Y;
                            world[i][j] = new Tile(tileX, tileY);
                            world[i][j].setContentTile(element.contentTile);
                            world[i][j].owner = element.owner;
                            world[i][j].humidity = element.humidity;
                            world[i][j].fertility = element.fertility;

                            var tile = world[i][j];
                            tile.XPx = centerScreen.X - ((tile.Y - tileCenter.Y) * (tileWidth/2)) +((tile.X - tileCenter.X) * (tileWidth/2)) - (tileWidth/2);
                            tile.YPx = centerScreen.Y + ((tile.Y - tileCenter.Y) * (tileHeight/2)) +((tile.X - tileCenter.X) * (tileHeight/2)) - (tileHeight/2);
                            world[i][j] = tile;

                            if (tile.X == world.center.X && tile.Y == world.center.Y){
                                world.center.XPx = tile.XPx;
                                world.center.YPx = tile.YPx;
                            }
                        }
                    }
                }
            }
            if (world.center.XPx == undefined){
                world.center.XPx = this.canvas.stage.attrs.width/2 - this.app.Config.tileWidth/2;
            }
            if (world.center.YPx == undefined){
                world.center.YPx = this.canvas.stage.attrs.height/2 - this.app.Config.tileHeight/2;
            }
            this.app.World = world;

            //this.drawMapTexture();
        },

        drawMapTexture: function(){
            var tileWidth = this.app.Config.tileWidth;
            var tileHeight = this.app.Config.tileHeight;
            var world = this.app.World;
            var countCurrentTile = 1;
            for (var i=this.app.Config.screenMinX; i<this.app.Config.screenMaxX; i++){
                for (var j=this.app.Config.screenMinY; j<this.app.Config.screenMaxY; j++){
                    if(world[i] != undefined)
                    {
                        var tile = world[i][j];
                        if(tile != undefined)
                        {
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
                                                this.canvas.putTexture(new Vector2(tile.XPx - tileWidth / 2 + 5, tile.YPx - 100), this.app.Ressources["farm"] , world[i][j], this.canvas.L_NAME.buildings, countCurrentTile);
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
        },

        refreshFarmerController: function(){
            //REFRESH FARMERCONTROLLER PARAMETERS WHEN WORLD LOADED
            $j(document).trigger('FARMER-canvasLoaded', [this.app, this.canvas]);
            socket.emit('getFarmerPosition');
        },

        drawElement: function(resp) {
            var tile = new Tile(resp.element.X, resp.element.Y);
            tile.setContentTile(resp.element);
            this.canvas.changeTexture(tile);
        },

        changeNotifTileZone: function(tile){

            var tileBoard = this.app.World[tile.X][tile.Y];

            //Name //Description
            if(tileBoard.contentTile != undefined)
            {
                $j("#tile_name_content").html(tileBoard.contentTile.name);
                $j("#tile_infos_content").html(tileBoard.contentTile.description);
            }
            else
            {
                $j("#tile_name_content").html("Terre");
                $j("#tile_infos_content").html("");
            }

            //Image
            if(tileBoard.image != undefined)
            {
                $j("#tile_image").attr("src", tileBoard.image.attrs.image.src);
            }
            else if(tileBoard.contentTile != undefined && tileBoard.contentTile.mainPos != undefined) //Case building
            {
                $j("#tile_image").attr("src", this.app.World[tileBoard.contentTile.mainPos.X][tileBoard.contentTile.mainPos.Y].image.attrs.image.src);
            }

            //Owner
            if(tileBoard.owner != undefined)
            {
                $j("#tile_owner").html(tileBoard.owner.username);
            }
            else
            {
                $j("#tile_owner").html("Neutre");
            }

            //Humidity
            if(tileBoard.humidity != undefined)
                $j("#tile_humidity_level").html(tileBoard.humidity + " / 10");
            else
                $j("#tile_humidity_level").html("0 / 10");

            //Fertility
            if(tileBoard.fertility != undefined)
                $j("#tile_fertility_level").html(tileBoard.fertility + " / 10");
            else
                $j("#tile_fertility_level").html("0 / 10");

        },

        getRandomInArray: function(arrayR){
            var random = Math.floor((Math.random()*arrayR.length));
            return arrayR[random];
        }

    };

    return GameController;

});
