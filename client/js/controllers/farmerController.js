

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
                socket.emit('calculatePath', {'finish': obj.tile, 'goToWork' : obj.goToWork, 'isHarvesting' : socket.sessions.farmer.isHarvesting});
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
                self.farmer.createByServer(tile.farmer);
                self.farmer.XPx = positionPx.X;
                self.farmer.YPx = positionPx.Y;
                self.canvas.putFarmerSprite(positionPx, farmerImg, self.farmer, self.canvas.L_NAME.players);

                socket.sessions.farmer = self.farmer;
            });

            // mise à jour du nom du fermier et du montant d'argent dont il dispose
            socket.on('drawMap', function(){
                socket.emit("getFarmer");
            });

            socket.on('setFarmer', function(farmer){
                jQuery('#mg_nom_joueur').text(farmer.name);
                jQuery('#mg_money_joueur').text(farmer.money);

                if(farmer.bag != undefined)
                {
                    for(var i = 0; i < farmer.bag.length; i++)
                    {
                        var itemBag = farmer.bag[i];
                        var content = "<span class='mg_item_bag' iditem='" + itemBag.idItem + "'><span class='mg_bag_item bagItem" + itemBag.idItem + "'></span><span class='bagItem_quantity'>" + itemBag.quantity + "</span></span>";

                        $j(".mg_bag_box[idBag='" + itemBag.positionInBag + "']").html(content);
                    }
                }

                $j(document).trigger('GAME-bagReceive');

            });
            // fin de la mise à jour

            //Other Players
            socket.on('ennemyFarmer', function(ennemyFarmer){

                self.addEnnemyToParty(ennemyFarmer);
            });

            socket.on('ennemyPath', function(resp){
                var ennemyFarmer = resp.ennemy;
                var path = resp.path;
                var isHarvesting = false;
                if (resp.isHarvesting != undefined){
                    isHarvesting = true;
                }
                self.moveEnnemy(path, ennemyFarmer, isHarvesting);
            });

            socket.on('ennemyTeleportedToFarm', function(resp){
                var farmerImg = self.app.Ressources["farmer"];
                var ennemyFarmer = undefined;
                for (var i=0; i<socket.sessions.ennemies.length;i++){
                    if (socket.sessions.ennemies[i].name == resp.ennemyName){
                        ennemyFarmer = socket.sessions.ennemies[i];
                        break;
                    }
                }

                ennemyFarmer.X = resp.position.X;
                ennemyFarmer.Y = resp.position.Y;

                if (self.app.World[ennemyFarmer.X][ennemyFarmer.Y].XPx == undefined){

                    var centerScreen = new Object();
                    centerScreen.X = this.canvas.stage.attrs.width/2;
                    centerScreen.Y = this.canvas.stage.attrs.height/2;

                    self.app.World[ennemyFarmer.X][ennemyFarmer.Y].XPx = centerScreen.X - ((ennemyFarmer.Y - self.app.World.center.Y) * (self.app.Config.tileWidth/2)) +((ennemyFarmer.X - self.app.World.center.X) * (self.app.Config.tileWidth/2)) - (self.app.Config.tileWidth/2);
                    self.app.World[ennemyFarmer.X][ennemyFarmer.Y].YPx = centerScreen.Y + ((ennemyFarmer.Y - self.app.World.center.Y) * (self.app.Config.tileHeight/2)) +((ennemyFarmer.X - self.app.World.center.X) * (self.app.Config.tileHeight/2)) - (self.app.Config.tileHeight/2);
                }

                var positionPx = new Vector2(self.app.World[resp.position.X][resp.position.Y].XPx, self.app.World[resp.position.X][resp.position.Y].YPx - ((farmerImg.height  / self.app.Config.farmerSpriteNbLine) /2));
                self.canvas.removeFarmerSprite(ennemyFarmer);
                self.canvas.putFarmerSprite(positionPx, farmerImg, ennemyFarmer, self.canvas.L_NAME.players);
            });

            socket.on("FARMER-ennemyDisconnect", function(ennemy){
                var ennemyFarmer = undefined;
                var indexOfEnnemy = undefined;
                console.log(socket.sessions.ennemies);
                for (var i=0; i<socket.sessions.ennemies.length;i++){
                    if (socket.sessions.ennemies[i].name == ennemy.name){
                        ennemyFarmer = socket.sessions.ennemies[i];
                        indexOfEnnemy = i;
                        break;
                    }
                }
                console.log("ennemy disconnect : ");
                console.log(ennemyFarmer);
                ennemyFarmer.image.remove();
                socket.sessions.ennemies.splice(indexOfEnnemy, 1);
                console.log(socket.sessions.ennemies);
            });

            socket.on('FARMER-newMoney', function(money){
                socket.sessions.farmer.money = money;
                jQuery('#mg_money_joueur').text(money);
            });
        },

        moveFarmer: function(path) {
            var isFarmer = true;
            this.canvas.moveTextureAlongPath(path, this.farmer.image, this.farmer, this.canvas.L_NAME.players, this.app.Config.playerMoveSpeed, isFarmer);
        },

        moveEnnemy: function(path, ennemy, isHarvesting){
            var isFarmer = true;
            // retrieve ennemy farmer entity
            var farmerEnnemy = undefined;
            for (var i=0; i<socket.sessions.ennemies.length; i++){
                if (socket.sessions.ennemies[i].name == ennemy.name){
                    farmerEnnemy = socket.sessions.ennemies[i];
                    farmerEnnemy.isHarvesting = isHarvesting;
                    break;
                }
            }
            if (farmerEnnemy != undefined){
                this.canvas.moveTextureAlongPath(path, farmerEnnemy.image, farmerEnnemy, this.canvas.L_NAME.players, this.app.Config.playerMoveSpeed, isFarmer);
            }

        },

        getRandomInArray: function(arrayR){
            var random = Math.floor((Math.random()*arrayR.length));
            return arrayR[random];
        },

        addEnnemyToParty: function(ennemyFarmer){
            var self = this;
            if (app.World[ennemyFarmer.X] != undefined && app.World[ennemyFarmer.X][ennemyFarmer.Y] != undefined)
            {
                if (self.intervalEnnemy != undefined){
                    window.clearInterval(self.intervalEnnemy);
                    self.intervalEnnemy = undefined;
                }
                socket.sessions.ennemies.push(ennemyFarmer);
                var farmerImg = self.app.Ressources["farmer"];

                /*
                tile.XPx = centerScreen.X - ((ennemyFarmer.Y - self.app.World.center.Y) * (self.app.Config.tileWidth/2)) +((ennemyFarmer.X - self.app.World.center.X) * (self.app.Config.tileWidth/2)) - (self.app.Config.tileWidth/2);
                tile.YPx = centerScreen.Y + ((ennemyFarmer.Y - self.app.World.center.Y) * (self.app.Config.tileHeight/2)) +((ennemyFarmer.X - self.app.World.center.X) * (self.app.Config.tileHeight/2)) - (self.app.Config.tileHeight/2);
                */

                if (self.app.World[ennemyFarmer.X][ennemyFarmer.Y].XPx == undefined){

                    var centerScreen = new Object();
                    centerScreen.X = this.canvas.stage.attrs.width/2;
                    centerScreen.Y = this.canvas.stage.attrs.height/2;

                    self.app.World[ennemyFarmer.X][ennemyFarmer.Y].XPx = centerScreen.X - ((ennemyFarmer.Y - self.app.World.center.Y) * (self.app.Config.tileWidth/2)) +((ennemyFarmer.X - self.app.World.center.X) * (self.app.Config.tileWidth/2)) - (self.app.Config.tileWidth/2);
                    self.app.World[ennemyFarmer.X][ennemyFarmer.Y].YPx = centerScreen.Y + ((ennemyFarmer.Y - self.app.World.center.Y) * (self.app.Config.tileHeight/2)) +((ennemyFarmer.X - self.app.World.center.X) * (self.app.Config.tileHeight/2)) - (self.app.Config.tileHeight/2);
                }

                var positionPx = new Vector2(self.app.World[ennemyFarmer.X][ennemyFarmer.Y].XPx, self.app.World[ennemyFarmer.X][ennemyFarmer.Y].YPx - ((farmerImg.height  / self.app.Config.farmerSpriteNbLine) /2));
                self.canvas.putFarmerSprite(positionPx, farmerImg, ennemyFarmer, self.canvas.L_NAME.players);
            }
            else
            {
                if (self.intervalEnnemy == undefined)
                {
                    self.intervalEnnemy = window.setInterval(function(){ self.addEnnemyToParty(ennemyFarmer); }, 1000);
                }
            }
        }

    };

    return FarmerController;

});
