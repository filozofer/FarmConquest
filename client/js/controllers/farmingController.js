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

            jQuery(document).on('FCL-farmerMoveEnd', function(){
                if (socket.sessions.selectedActionTile != undefined){
                    if ( socket.sessions.selectedActionIndex != undefined && socket.sessions.selectedActionTile.owner.username == socket.sessions.currentUser.username) {
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
