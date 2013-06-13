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
                if ( socket.sessions.selectedActionIndex != undefined ) {
                    socket.emit('doFarmingAction', { 'tile' : socket.sessions.selectedActionTile, 'index' : socket.sessions.selectedActionIndex});
                }
            });


            // mise à jour des parametres humidité et fertilité de la tile
            socket.on('updateTile', function(tile){
                app.World[tile.X][tile.Y].humidity = tile.humidity;
                app.World[tile.X][tile.Y].fertility = tile.fertility;
            });
        }
    }

    return FarmingController;

});
