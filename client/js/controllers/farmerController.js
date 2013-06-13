

define(['jquery', '../lib/vector2', '../lib/fcl', '../entity/farmer'], function(jQuery, Vector2, FCL, Farmer) {

    jQuery.noConflict();
    var $j = jQuery;
    var FarmerController = Class.create();
    FarmerController.prototype = {

        initialize: function(){
            this.app = undefined;
            this.canvas = undefined;
            this.farmer = undefined;
        },

        initEvents: function(){

            var self = this;
            GLOBAL_FARMERCONTROLLER = new Object();

            $j(document).on('FARMER-canvasLoaded', function(event, app, canvas){
                self.canvas = canvas;
                self.app = app;
            });

            $j(document).on('FARMER-moveFarmer', function(event, obj) {
                socket.emit('calculatePath', {'finish': obj.tile, 'goToWork' : obj.goToWork});
            });

            $j(document).on('FARMER-updatePosition', function(event, xToMove, yToMove){
                var newXPx = self.farmer.XPx + xToMove;
                var newYPx = self.farmer.YPx + yToMove;
                self.farmer.XPx = newXPx;
                self.farmer.YPx = newYPx;
                self.farmer.image.setX(newXPx);
                self.farmer.image.setY(newYPx);
                self.canvas.putFarmerSprite(new Vector2(newXPx, newYPx), self.farmer.image.attrs.image, self.farmer, self.canvas.L_NAME.players);
            });

            $j(document).on('FARMER-drawFarmer', function() {
                console.log("FARMER POSITION : " + socket.sessions.farmer.X + "/" + socket.sessions.farmer.Y + " - " + socket.sessions.farmer.XPx + "/" + socket.sessions.farmer.YPx);
                var farmerImg = self.app.Ressources["farmer"];

                var positionPx = new Vector2(socket.sessions.farmer.XPx, socket.sessions.farmer.YPx);
                self.canvas.putFarmerSprite(positionPx, farmerImg, socket.sessions.farmer, self.canvas.L_NAME.players);
            });

            socket.on('farmerPath', function(resp){
                self.moveFarmer(resp.path);
            });

            socket.on('farmerPosition', function(tile){
                var farmerImg = self.app.Ressources["farmer"];

                var positionPx = new Vector2(self.app.World[tile.X][tile.Y].XPx, self.app.World[tile.X][tile.Y].YPx - ((farmerImg.height  / self.app.Config.farmerSpriteNbLine) /2));
                self.farmer = new Farmer(tile.X, tile.Y);
                self.farmer.XPx = positionPx.X;
                self.farmer.YPx = positionPx.Y;
                self.canvas.putFarmerSprite(positionPx, farmerImg, self.farmer, self.canvas.L_NAME.players);

                socket.sessions.farmer = self.farmer;
            });

            // mise à jour du nom du fermier et du montant d'argent dont il dispose
            socket.on('drawMap', function(){
                socket.emit("getFarmer");
            });

            socket.on('setFarmer', function(resp){
                jQuery('#mg_nom_joueur').text(resp.name);
                jQuery('#mg_money_joueur').text(resp.money);
            });
            // fin de la mise à jour
        },

        moveFarmer: function(path) {
            var isFarmer = true;
            this.canvas.moveTextureAlongPath(path, this.farmer.image, this.farmer, this.canvas.L_NAME.players, this.app.Config.playerMoveSpeed, isFarmer);

            // si elle existe, on traite l'action sélectionnée
            if ( socket.sessions.selectedActionIndex != undefined ) {
                console.log("Traitement de l'action");
                switch(socket.sessions.selectedActionIndex) {
                    // Farming actions
                    case '0':
                    case '1':
                        socket.emit('doFarmingAction');
                        break;
                    default:
                        console.log("Aucun traitement.");
                        break;
                }
            }
        },

        getRandomInArray: function(arrayR){
            var random = Math.floor((Math.random()*arrayR.length));
            return arrayR[random];
        }

    };

    return FarmerController;

});
