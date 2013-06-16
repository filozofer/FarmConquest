// -----------------------------------------------------------
//
// class        : FarmingController
// description  : Client interaction with tiles' farming
//
// -----------------------------------------------------------

define(['jquery', '../lib/vector2', '../lib/fcl', '../entity/tile', './farmerController'], function(jQuery, Vector2, FCL, Tile, FarmerController) {

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
            jQuery('#btn_arroser, #btn_fertiliser').on('click',function(event){
                event.preventDefault();
                if ( jQuery(this).hasClass('active') ) {
                    jQuery(this).removeClass('active');
                    socket.sessions.selectedActionIndex = undefined;
                } else {
                    jQuery('.action_btn').removeClass('active');
                    jQuery(this).addClass('active');
                    socket.sessions.selectedActionIndex = jQuery(this).val();
                }
            });

            jQuery(document).on('FARMING-farmerMoveEnd', function(){
                if (socket.sessions.selectedActionTile != undefined){
                    if (socket.sessions.selectedActionTile.owner.name == socket.sessions.farmer.name) {
                        if( socket.sessions.selectedActionIndex != undefined){
                            socket.emit('doFarmingAction', { 'tile' : socket.sessions.selectedActionTile, 'index' : socket.sessions.selectedActionIndex});
                        }
                        else if (socket.sessions.farmer.isFarming){
                            console.log("PLANT Item with ID=" + socket.sessions.idItemSelected + " at " + socket.sessions.selectedActionTile.X +"/" + socket.sessions.selectedActionTile.Y);
                            socket.emit('BuildOrSeed', {tile: socket.sessions.selectedActionTile, idItem: socket.sessions.idItemSelected, action: app.Config.actionType.seed});
                        }
                        else if (socket.sessions.farmer.isHarvesting){
                            console.log("Harvest Plant : "+ socket.sessions.selectedActionTile.contentTile.type.name);
                            socket.emit("harvestSeed", socket.sessions.selectedActionTile);
                        }
                        else if (socket.sessions.farmer.isBuilding){
                            console.log("Put Building : " + socket.sessions.idItemSelected);
                            socket.emit("BuildOrSeed", {tile: socket.sessions.selectedActionTile, idItem: socket.sessions.idItemSelected, action: app.Config.actionType.build});
                        }
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
                self.canvas.changeTexture(tile);
            });

            socket.on('finishPlant', function(tileServer){
                socket.sessions.farmer.isWorking = false;
            });

            socket.on('seedGrowing', function(tile){
                console.log("seed Grow to State : " + tile.contentTile.state);
                var tile = self.getWorkingTileFromServer(tile);
                app.World[tile.X][tile.Y] = tile;
                self.canvas.changeTexture(tile);
            });

            socket.on('seedGoingToDie', function(tile){
                console.log("Seed going to die");
                var tile = self.getWorkingTileFromServer(tile);
                if (app.World[tile.X][tile.Y].contentTile != undefined && app.World[tile.X][tile.Y].contentTile.type == tile.contentTile.type && app.World[tile.X][tile.Y].contentTile.state == 2){
                    app.World[tile.X][tile.Y] = tile;
                    self.canvas.changeTexture(tile);
                }
            });

            socket.on('seedDie', function(tile){
                console.log("Seed died");
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
                console.log("harvest done");
                if (tile.owner.name == socket.sessions.farmer.name)
                    socket.sessions.farmer.isHarvesting = false;
                var tile = self.getWorkingTileFromServer(tile);
                app.World[tile.X][tile.Y] = tile;
                self.canvas.changeTexture(tile);
            });

            socket.on('FARMING-makeBuilding', function(building){
                console.log(building);
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
