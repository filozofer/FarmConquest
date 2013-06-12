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

        }
    }

    return FarmingController;

});
