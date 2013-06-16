

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
            configuration.plantHeight = 60;
            configuration.plantWidth = 80;

            //WORLD SCREEN SIZE
            configuration.screenMinX = -13;
            configuration.screenMaxX = 14;
            configuration.screenMinY = -13;
            configuration.screenMaxY = 14;

            configuration.tileToDragHorizontally = 12;
            configuration.tileToDragVertically = 10;

            //FARMER SPRITE
            configuration.farmerSpriteNbLine = 13;
            configuration.farmerSpriteNbColumn = 9;

            //MOVE SPEED
            configuration.playerMoveSpeed = 0.3;

            //SEEDS INFO
            //Seeds
            configuration.idItems = new Object();
            configuration.idItems.avoine = { id: 1, name: "avoine" };
            configuration.idItems.ble = { id: 2, name: "ble" };
            configuration.idItems.carotte = { id: 3, name: "carotte" };
            configuration.idItems.citrouille = { id: 4, name: "citrouille" };
            configuration.idItems.fayot = { id: 5, name: "fayot" };
            configuration.idItems.seigle = { id: 6, name: "seigle" };
            configuration.idItems.radis = { id: 7, name: "radis" };
            configuration.idItems.salade = { id: 8, name: "salade" };
            configuration.idItems.topinambour = { id: 9, name: "topinambour" };
            //Crops
            configuration.idItems.avoineCrop = { id: 101 ,name: "avoineCrop", displayed:"Avoine" };
            configuration.idItems.bleCrop = { id: 102, name: "bleCrop", displayed:"Ble" };
            configuration.idItems.carotteCrop = { id: 103, name: "carotteCrop", displayed:"Carotte" };
            configuration.idItems.citrouilleCrop = { id: 104, name: "citrouilleCrop", displayed:"Citrouille" };
            configuration.idItems.fayotCrop = { id: 105, name: "fayotCrop", displayed:"Fayot" };
            configuration.idItems.seigleCrop = { id: 106, name: "seigleCrop", displayed:"Seigle" };
            configuration.idItems.radisCrop = { id: 107, name: "radisCrop", displayed:"Radis" };
            configuration.idItems.saladeCrop = { id: 108, name: "saladeCrop", displayed:"Salade" };
            configuration.idItems.topinambourCrop = { id: 109, name: "topinambourCrop", displayed:"Topinambour" };
            //Buildings
            configuration.idItems.grangeP = { id: 10, name: "grangeP" };
            configuration.idItems.grangeM = { id: 11, name: "grangeM" };
            configuration.idItems.grangeG = { id: 12, name: "grangeG" };
            //Weapons
            //Weapons
            configuration.idItems.marteau = { id: 13, name: "marteau", type: 1 };
            configuration.idItems.cailloux = { id: 14, name: "cailloux", type: 2 };
            configuration.idItems.hache = { id: 15, name: "hache", type: 1 };
            configuration.idItems.poulet = { id: 16, name: "poulet", type: 2 };
            configuration.idItems.epee = { id: 17, name: "epee", type: 1 };
            configuration.idItems.nyancat = { id: 18, name: "nyancat", type: 2 };
            configuration.idItems.ak47 = { id: 19, name: "ak47", type: 1 };
            configuration.idItems.chien = { id: 20, name: "chien", type: 2 };
            configuration.idItems.lightsaber = { id: 21, name: "lightsaber", type: 1 };
            configuration.idItems.grenade = { id: 22, name: "grenade", type: 2 };


            configuration.tileType = new Object();
            configuration.tileType.grangeP = "grangeP";
            configuration.tileType.grangeM = "grangeM";
            configuration.tileType.grangeG = "grangeG";
            configuration.tileType.farm = "farm";
            configuration.tileType.seed = "seed";

            /* ACTION TYPE */
            configuration.actionType = new Object();
            configuration.actionType.seed = "Seed";
            configuration.actionType.build = "Build";

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
            this.addRessource("default_tile", self.Type.IMAGE, "default_tile.png");
            this.addRessource("default_tile_arrosage", self.Type.IMAGE, "default_tile_arrosage.png");
            this.addRessource("default_tile_fertilisation", self.Type.IMAGE, "default_tile_fertilisation.png");
            this.addRessource("farming_set", self.Type.IMAGE, "Farming/farming_set.png");
            this.addRessource("farming_set_arrosage", self.Type.IMAGE, "Farming/farming_set_arrosage.png");
            this.addRessource("farming_set_fertilisation", self.Type.IMAGE, "Farming/farming_set_fertilisation.png");
            this.addRessource("farmer", self.Type.IMAGE, "farmerSprite.png");
            this.addRessource("farm", self.Type.IMAGE, "farm.png");
            this.addRessource("grangeP", self.Type.IMAGE, "Buildings/grangeP.png");
            this.addRessource("grangeM", self.Type.IMAGE, "Buildings/grangeM.png");
            this.addRessource("grangeG", self.Type.IMAGE, "Buildings/grangeG.png");

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