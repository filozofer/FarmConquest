define(['./vector2', './kinetic', './tweenlite'], function(Vector2){

	var FCL = Class.create();
	FCL.prototype = {
		initialize: function(idContainer, x, y){

            var self = this;

            //Stage Kinnetic
			this.stage = new Kinetic.Stage({
		           container: idContainer,
		           width: x,
		           height: y
		    });

            this.stage = this.manageEvent(this.stage);

            //Layers Names
            this.L_NAME = new Object();
            this.L_NAME.tiles = "tiles";
            this.L_NAME.buildings = "buildings";
            this.L_NAME.players = "players";

            //Create Layers (order z_index)
		    this.layers = new Object();
            this.layers[this.L_NAME.tiles] = new Kinetic.Layer();
            this.layers[this.L_NAME.buildings] = new Kinetic.Layer();
            this.layers[this.L_NAME.players] = new Kinetic.Layer();

            //Add each layers in stage
            for (var i in this.layers){
                this.stage.add(this.layers[i]);
            }

            this.test = null;

            this.drawLoopInterval = window.setInterval(function(){ self.draw(); }, 1000 / 40);

        },

        draw: function() {

            for (var i in this.layers){
                this.layers[i].draw();
            }

        },

        clearCanvas: function() {
            this.stage.clear();
            for (var i in this.layers){
                this.layers[i] = new Kinetic.Layer();
            }
        },

		putTexture: function(vector, imageObj, objectLinked, layerName, zIndex){
            var self = this;

            var customImg = new Kinetic.Image({
                image: imageObj,
                x: vector.X,
                y: vector.Y
            });

            customImg.objectLinked = objectLinked;
            //customImg = this.manageEvent(customImg);
            objectLinked.image = customImg;

            if(this.layers[layerName] == undefined)
            {
                this.layers[layerName] = new Kinetic.Layer();
            }

            /*this.loadHitRegion++;
            customImg.createImageHitRegion(function() {
                self.hitRegionLoaded();
            });*/

            this.layers[layerName].add(customImg);

            customImg.setZIndex(zIndex);
		},

        changeTexture: function(element) {

            //Remove old kinnetic image associate to the element to change
            var elementToRemove = app.World[element.X][element.Y];
            elementToRemove.image.remove();

            //Change the world with the new element
            app.World[element.X][element.Y] = element;

            //Add the associate kinnetic texture of the element in the layer
            this.putTexture(new Vector2(elementToRemove.XPx, elementToRemove.YPx - 20), this.getImageFromType(element.contentTile.type) , app.World[element.X][element.Y], this.L_NAME.tiles, elementToRemove.image.getZIndex());

        },

		moveTexture: function(vectorPx, vector, image, objectLinked, layerName){
            var self = this;

            objectLinked.X = vector.X;
            objectLinked.Y = vector.Y;
            objectLinked.XPx = vectorPx.X;
            objectLinked.YPx = vectorPx.Y;
            objectLinked.image = image;

            TweenLite.to(image, 0.5, {
                        setX: vectorPx.X,
                        setY: vectorPx.Y,
                        onUpdate: function() {
                          image.getLayer().draw();
                        }
                      });
		},

		moveTextureAlongPath: function(path, farmerImage, farmer, layerName, speed, isFarmer){
            var self = this;
            var newXPx = path[0].XPx;
            var newYPx = undefined;

            if(isFarmer){
                newYPx = path[0].YPx - (farmerImage.attrs.image.height / 2);
            }
            else{
                newYPx = path[0].YPx;
            }

           TweenLite.to(farmerImage, speed, {
                  setX: newXPx,
                  setY: newYPx,
                  ease: Linear.easeNone,
                  onUpdate: function() {
                    //farmerImage.getLayer().draw();
                  },
                  onComplete: function() {

                    farmer.X = path[0].X;
                    farmer.Y = path[0].Y;
                    farmer.XPx = newXPx;
                    farmer.YPx = newYPx;
                    farmer.image = farmerImage;
                    path.shift();
                    if (path.length > 0){
                        self.moveTextureAlongPath(path, farmerImage, farmer, layerName, speed, isFarmer);
                    }
                  }
                });
		},

        hitRegionLoaded: function() {
            this.loadHitRegion--;
            if(this.loadHitRegion <= 0)
            {
                for (var i in this.layers){
                    this.layers[i].draw();
                }
            }
        },

        getTileAtPosition: function(positionClick) {

            //Get tile coord from mouse position
            var X0 = positionClick.x - this.stage.attrs.width / 2;
            var Y0 = positionClick.y - this.stage.attrs.height / 2;
            var X = Y0 + (X0 / 2);
            var Y = Y0 - (X0 / 2);
            var Xiso = Math.round(X / app.Config.tileHeight) + app.World.center.X;
            var Yiso = Math.round(Y / app.Config.tileHeight) + app.World.center.Y;

            //Return selected tile
            return app.World[Xiso][Yiso];
        },

        manageEvent: function(stageK) {
            var self = this;

            stageK.on("click", function(e){
                var positionClick = self.stage.getMousePosition();
                var tile = self.getTileAtPosition(positionClick);

                if (e.which != 3){
                    if(typeof tile.clickEvent == 'function'){
                        tile.clickEvent();
                    }

                } else {
                    if(typeof tile.rightClickEvent == 'function'){
                        tile.rightClickEvent();
                    }
                }
            });

            stageK.on("mousemove", function(e){
                var positionClick = self.stage.getMousePosition();
                var tile = self.getTileAtPosition(positionClick);

                if(self.stage.currentTile == undefined)
                {
                    self.stage.currentTile = tile;
                    if(typeof self.stage.currentTile.mouseOverEvent == 'function'){
                        self.stage.currentTile.mouseOverEvent();
                    }
                }
                else if(self.stage.currentTile.X != tile.X || self.stage.currentTile.Y != tile.Y)
                {
                    if(typeof self.stage.currentTile.mouseOutEvent == 'function'){
                        self.stage.currentTile.mouseOutEvent();
                    }
                    self.stage.currentTile = tile;
                    if(typeof self.stage.currentTile.mouseOverEvent == 'function'){
                        self.stage.currentTile.mouseOverEvent();
                    }
                }

            });

            return stageK;
        },

        getImageFromType: function(type) {
            switch(type)
            {
                case "seed":
                    return app.Ressources["seedTest"];
                    break;

                default:
                    return app.Ressources["tileTest"];
                    break;
            }
        }
		 
    };

	
    return FCL;
});
