

define(['jquery', '../lib/kinetic'], function(jQuery, Kinetic){

    jQuery.noConflict();
    var $j = jQuery;

    var App = Class.create();
    App.prototype = {

        initialize: function(){

            //Disable right click default event
            window.oncontextmenu = function(event) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            };

            this.Ressources = new Object();
            this.chargement = 0;
            this.chargementMax = 0;
            this.manageLoadingInterval = undefined;
            this.Config = this.getConfig();
            this.Type = this.generateType();
            this.World = new Object();
            this.TileBehindBuilding = new Array();

            // liste des actions disponibles via les 4 boutons à droite du menu
            this.actions = ["arrosage", "fertilisation", "alliance", "attaque"];
        },

        init: function(){
            var socket = io.connect('http://localhost:1337');
            socket.sessions = new Object();
            return socket;
         },

        getConfig: function(){
            var self = this;
            var configuration = new Object();

            //URLs
            configuration.baseURL = this.getBaseURL();
            configuration.clientURL = configuration.baseURL + "";
            configuration.serverURL = configuration.baseURL + "server/";

            //FOLDERS
            configuration.imagePath = configuration.clientURL + "img/";

            //TEXTURE
            configuration.tileHeight = 40;
            configuration.tileWidth = 80;

            //WORLD SCREEN SIZE
            configuration.screenMinX = -13;
            configuration.screenMaxX = 14;
            configuration.screenMinY = -13;
            configuration.screenMaxY = 14;

            configuration.tileToDragHorizontally = 10;
            configuration.tileToDragVertically = 11;

            //FARMER SPRITE
            configuration.farmerSpriteNbLine = 13;

            //MOVE SPEED
            configuration.playerMoveSpeed = 0.3;

            return configuration;
        },

        generateType: function(){
            var self = this;
            var type = new Object();

            //TYPES
            type.IMAGE = "image";
            type.SOUND = "sound";

            return type;
        },

        getBaseURL: function() {
            var url = location.href;  // entire url including querystring - also: window.location.href;
            var baseURL = url.substring(0, url.indexOf('/', 14));

            if (baseURL.indexOf('http://localhost') != -1) {
                    // Base Url for localhost
                    var url = location.href;  // window.location.href;
                    var pathname = location.pathname;  // window.location.pathname;
                    var index1 = url.indexOf(pathname);
                    var index2 = url.indexOf("/", index1 + 1);
                    var baseLocalUrl = url.substr(0, index2);

                    return baseLocalUrl + "/";
                }
                else {
                    // Root Url for domain name
                    return baseURL + "/";
                }
        },

        center: function() {
            window.scrollTo(0, 1);
        },

        loadRessources: function() {

            var self = this;

            /* Load Images */
            this.addRessource("tileTest", self.Type.IMAGE, "tileTest.png");
            this.addRessource("farmer", self.Type.IMAGE, "farmerSprite.png");
            this.addRessource("farm", self.Type.IMAGE, "farm.png");

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

        addRessource: function(key, type, source) {
            var self = this;

            if (type == self.Type.IMAGE){
                var imgSrc = self.Config.imagePath + source;
                this.Ressources[key] = new Image();
                this.Ressources[key].src = imgSrc;
                this.chargement++;
                this.Ressources[key].onload = function(){
                    //Decrease loading
                    self.chargement--;
                };
            }
        }

    };

    return App;
});