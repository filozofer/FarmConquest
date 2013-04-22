

define(['jquery'], function(jQuery){

    jQuery.noConflict();
    var $j = jQuery;

    var App = Class.create();
    App.prototype = {

        initialize: function(){
            this.Ressources = new Object();
            this.chargement = 0;
            this.chargementMax = 0;
            this.manageLoadingInterval = undefined;
        },

        init: function(){
            var socket = io.connect('http://localhost:1337');
             return socket;
         },

        center: function() {
            window.scrollTo(0, 1);
        },

        loadRessources: function() {

            var self = this;

            /* Load Images */
            this.addRessource("tileTest", "img/tileTest.png");
            this.addRessource("tileSet", "img/tileSet.png");
            this.addRessource("farmer", "img/farmer.png");

            this.chargementMax = this.chargement;

            var self = this;
            this.manageLoadingInterval = window.setInterval(function(){ self.manageLoading(self.chargement, self.chargementMax)}, 100);
        },

        manageLoading: function(load, loadMax) {
            var self = this;

            if(this.chargement == 0)
            {
                $j('#loading_window').hide(function(){
                    $j('#section_intro').show();
                    $j('#section_canvas').show();
                    $j('#game_menu_box').show();
                    window.clearInterval(self.manageLoadingInterval);
                    $j(document).trigger('loadRessourcesOver');
                });
            }
            else
            {
                var pourcentage = 100 - (load * 100 / loadMax);
                $j('#pourcentage').html(pourcentage + " %");
            }
        },

        addRessource: function(key, source) {
            var self = this;
            this.Ressources[key] = new Image();
            this.Ressources[key].src = source;
            this.chargement++;
            this.Ressources[key].onload = function(){

                //Create HitBox
                var KImage = new Kinetic.Image({
                    image: self.Ressources[key],
                    width: self.Ressources[key].width,
                    height: self.Ressources[key].height
                });
                KImage.createImageHitRegion();
                self.Ressources[key].imageHitRegion = KImage.imageHitRegion;

                //Decrease loading
                self.chargement--;
            };
        }

    };

    return App;
});