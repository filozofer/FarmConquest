// -----------------------------------------------------------
//
// class        : FarmingController
// description  : Client interaction with tiles' farming
//
// -----------------------------------------------------------

define(['jquery', '../lib/vector2', '../lib/fcl', '../entity/tile', './farmerController'], function(jQuery, Vector2, FCL, Tile, FarmerController) {

    jQuery.noConflict();
    var $j = jQuery;

    var FarmingController = Class.create();
    FarmingController.prototype = {

        initialize : function() {
            this.app = null;
            this.canvas = null;
        },

        initEvents : function() {

            var self = this;

            jQuery(document).on('FARMER-canvasLoaded', function(event, app, canvas){
                self.canvas = canvas;
                self.app = app;
            });

            // gestion des deux premiers boutons d'action
            $j('#btn_arroser, #btn_fertiliser').on('click',function(event){
                event.preventDefault();
                if ($j(this).hasClass('active') ) {
                    $j(this).removeClass('active');
                    socket.sessions.selectedActionIndex = undefined;
                    $j("body").css('cursor','url("../img/cursors/main.cur"), progress');
                } else {
                    $j('.action_btn').removeClass('active');
                    $j(this).addClass('active');
                    socket.sessions.selectedActionIndex = $j(this).val();

                    //Change cursor
                    switch($j(this).val())
                    {
                        case "0":
                            var cursorName = "cursor_arrosoir.png";
                            $j("body").css('cursor','url("../img/cursors/'+cursorName+'"), progress');
                            break;

                        case "1":
                            var cursorName = "cursor_fertilisation.png";
                            $j("body").css('cursor','url("../img/cursors/'+cursorName+'"), progress');
                            break;

                        default:
                            $j("body").css('cursor','url("../img/cursors/main.cur"), progress');
                            break;
                    }
                }
            });

            jQuery(document).on('FARMING-farmerMoveEnd', function(){
                if (socket.sessions.selectedActionTile != undefined){
                    if (socket.sessions.selectedActionTile.owner.name == socket.sessions.farmer.name) {
                        if( socket.sessions.selectedActionIndex != undefined){
                            socket.emit('doFarmingAction', { 'tile' : socket.sessions.selectedActionTile, 'index' : socket.sessions.selectedActionIndex});
                        }
                        else if (socket.sessions.farmer.isFarming){
                            socket.emit('BuildOrSeed', {tile: socket.sessions.selectedActionTile, idItem: socket.sessions.idItemSelected, action: app.Config.actionType.seed});
                        }
                        else if (socket.sessions.farmer.isHarvesting){
                            socket.emit("harvestSeed", socket.sessions.selectedActionTile);
                        }
                        else if (socket.sessions.farmer.isBuilding){
                            socket.emit("BuildOrSeed", {tile: socket.sessions.selectedActionTile, idItem: socket.sessions.idItemSelected, action: app.Config.actionType.build});
                        }
                    }
                    else if(socket.sessions.selectedActionIndex != undefined && socket.sessions.selectedActionIndex == "4") {
                        socket.emit('doFarmingAction', { 'tile' : socket.sessions.selectedActionTile, 'index' : socket.sessions.selectedActionIndex});
                    }
                }
            });


            // mise à jour des parametres humidité et fertilité de la tile
            socket.on('beginWork', function(resp){
                socket.sessions.farmer.isWorking = true;
                var tile = self.getWorkingTileFromServer(resp.tile);
                app.World[resp.tile.X][resp.tile.Y] = tile;
                socket.sessions.farmer.money = resp.money;
                jQuery("#mg_money_joueur").text(socket.sessions.farmer.money);
                $j('#mg_credits_conquest').html(resp.creditConquest);
                self.canvas.changeTexture(tile, resp.action);
            });

            socket.on('ennemyBeginWork', function(resp){
                var tile = self.getWorkingTileFromServer(resp.tile);
                app.World[resp.tile.X][resp.tile.Y] = tile;
                self.canvas.changeTexture(tile, resp.action);
            });

            socket.on('finishWork', function(resp){
                socket.sessions.farmer.isWorking = false;
                var tile = self.getWorkingTileFromServer(resp.tile);
                app.World[resp.tile.X][resp.tile.Y] = tile;
                self.canvas.changeTexture(tile);
            });

            socket.on('ennemyFinishWork', function(resp){
                var tile = self.getWorkingTileFromServer(resp.tile);
                app.World[resp.tile.X][resp.tile.Y] = tile;
                self.canvas.changeTexture(tile);
            });

            socket.on('doPlantSeed', function(tileServer){
                socket.sessions.farmer.isWorking = true;
                socket.sessions.farmer.isFarming = false;
                var tile = self.getWorkingTileFromServer(tileServer);
                app.World[tile.X][tile.Y] = tile;
                socket.sessions.farmer.image.setAnimation('seed'+socket.sessions.farmer.actionDirection);
                socket.sessions.farmer.image.start();
                socket.sessions.farmer.image.afterFrame(5, function(){
                    socket.sessions.farmer.image.setAnimation('stop'+socket.sessions.farmer.actionDirection)
                    socket.sessions.farmer.image.stop();
                });
                self.canvas.changeTexture(tile);
            });

            socket.on('finishPlant', function(tileServer){
                socket.sessions.farmer.isWorking = false;
            });

            socket.on('seedGrowing', function(tile){
                var tile = self.getWorkingTileFromServer(tile);
                app.World[tile.X][tile.Y] = tile;
                self.canvas.changeTexture(tile);
            });

            socket.on('seedGoingToDie', function(tile){
                var tile = self.getWorkingTileFromServer(tile);
                if (app.World[tile.X][tile.Y].contentTile != undefined && app.World[tile.X][tile.Y].contentTile.type == tile.contentTile.type && app.World[tile.X][tile.Y].contentTile.state == 2){
                    app.World[tile.X][tile.Y] = tile;
                    self.canvas.changeTexture(tile);
                }
            });

            socket.on('seedDie', function(tile){
                var tile = self.getWorkingTileFromServer(tile);
                if (app.World[tile.X][tile.Y].contentTile != undefined && app.World[tile.X][tile.Y].contentTile.state == 3){
                    app.World[tile.X][tile.Y] = tile;
                    self.canvas.changeTexture(tile);
                }
            });

            socket.on('FARMING-harvestFordbidden', function(){
                socket.sessions.farmer.isHarvesting = false;
                socket.sessions.farmer.image.stop();
            });

            socket.on('FARMING-HarvestDone', function(tile){
                if (tile.owner.name == socket.sessions.farmer.name)
                    socket.sessions.farmer.isHarvesting = false;
                var tile = self.getWorkingTileFromServer(tile);
                app.World[tile.X][tile.Y] = tile;
                self.canvas.changeTexture(tile);
            });

            socket.on('FARMING-makeBuilding', function(building){
                socket.sessions.farmer.isBuilding = false;
                self.canvas.changeTextureToBuilding(building);
            });

            socket.on('FARMING-ennemyBuilding', function(building){
                self.canvas.changeTextureToBuilding(building);
            });

        },

        getWorkingTileFromServer: function(tileServer){
            var tile = new Tile(tileServer.X, tileServer.Y);
            tile.image = app.World[tileServer.X][tileServer.Y].image;
            tile.contentTile = tileServer.contentTile;
            tile.walkable    = tileServer.walkable;
            tile.owner       = tileServer.owner;
            tile.humidity    = tileServer.humidity;
            tile.fertility   = tileServer.fertility;
            tile.XPx         = app.World[tileServer.X][tileServer.Y].XPx;
            tile.YPx         = app.World[tileServer.X][tileServer.Y].YPx;
            return tile;
        }
    }

    return FarmingController;

});
