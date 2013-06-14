define(['jquery', './vector2', './kinetic', './tweenlite'], function(jQuery, Vector2){

    jQuery.noConflict();
    var $j = jQuery;
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
            this.layerGroup = new Kinetic.Group();


            //Add each layers in stage
            for (var i in this.layers){
                this.layerGroup.add(this.layers[i]);
                this.stage.add(this.layers[i]);
            }

            this.timeFPS = Date.now();

            this.drawLoopInterval = window.setInterval(function(){ self.draw(); }, 1000 / 60);

        },

        draw: function() {

            //Display FPS
            var now = Date.now();
            var diff = now - this.timeFPS;
            var fps = 1000 / diff;
            $j("#FPS").html(Math.floor(fps));
            this.timeFPS = now;

            //Draw layer
            for (var i in this.layers){
                this.layers[i].draw();
            }

        },

        clearCanvas: function() {
            for (var i in this.layers){
                this.layers[i].removeChildren();
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

        putFarmerSprite: function(vector, imageObj, objectLinked, layerName, zIndex){
            var self = this;

            //DEFINIR ANIMATIONS.....
            var animations = {
                harvestNE: self.frames([0,1,2,3,4,5,6,7], 0, 0, 96, 96, 9, 13, 96, 96),
                harvestNW: self.frames([9,10,11,12,13,14,15,16], 0, 0, 96, 96, 9, 13, 96, 96),
                harvestSE: self.frames([18,19,20,21,22,23,24,25], 0, 0, 96, 96, 9, 13, 96, 96),
                harvestSW: self.frames([27,28,29,30,31,32,33,34], 0, 0, 96, 96, 9, 13, 96, 96),
                stopSW: self.frames([36], 0, 0, 96, 96, 9, 13, 96, 96),
                stopNW: self.frames([37], 0, 0, 96, 96, 9, 13, 96, 96),
                stopNE: self.frames([38], 0, 0, 96, 96, 9, 13, 96, 96),
                stopSE: self.frames([39], 0, 0, 96, 96, 9, 13, 96, 96),
                walkingNE: self.frames([45,46,47,48,49,50,51,52], 0, 0, 96, 96, 9, 13, 96, 96),
                walkingNW: self.frames([54,55,56,57,58,59,60,61], 0, 0, 96, 96, 9, 13, 96, 96),
                walkingSE: self.frames([63,64,65,66,67,68,69,70], 0, 0, 96, 96, 9, 13, 96, 96),
                walkingSW: self.frames([72,73,74,75,76,77,78,79], 0, 0, 96, 96, 9, 13, 96, 96),
                sowingNE: self.frames([81,82,83,84,85,86,87,88,89], 0, 0, 96, 96, 9, 13, 96, 96),
                sowingNW: self.frames([90,91,92,93,94,95,96,97,98], 0, 0, 96, 96, 9, 13, 96, 96),
                sowingSE: self.frames([99,100,101,102,103,104,105,106,107], 0, 0, 96, 96, 9, 13, 96, 96),
                sowingSW: self.frames([108,109,110,111,112,113,114,115,116], 0, 0, 96, 96, 9, 13, 96, 96)
            };
            //----------------------------

            var farmerSprite = new Kinetic.Sprite({
                image: imageObj,
                x: vector.X,
                y: vector.Y,
                animation: 'stopSW',
                animations: animations,
                frameRate: 7,
                index: 0
            });

            farmerSprite.objectLinked = objectLinked;
            objectLinked.image = farmerSprite;

            if(this.layers[layerName] == undefined)
            {
                this.layers[layerName] = new Kinetic.Layer();
            }

            this.layers[layerName].add(farmerSprite);

            farmerSprite.start();
            farmerSprite.afterFrame(0.5, function(){
                farmerSprite.stop();
            });

            farmerSprite.setZIndex(zIndex);
        },

        removeFarmerSprite: function(farmer){
            farmer.image.remove();
        },

        changeTexture: function(element, action) {

            //Remove old kinnetic image associate to the element to change
            var elementToRemove = app.World[element.X][element.Y];

            var zIndex = undefined;

            if (elementToRemove.image != undefined){
                elementToRemove.image.remove();
                zIndex = elementToRemove.image.getZIndex();
            }
            else {
                zIndex = 1000;
            }

            if (self.app.World[elementToRemove.X][elementToRemove.Y].XPx == undefined){

                var centerScreen = new Object();
                centerScreen.X = this.canvas.stage.attrs.width/2;
                centerScreen.Y = this.canvas.stage.attrs.height/2;

                elementToRemove.XPx = centerScreen.X - ((elementToRemove.Y - self.app.World.center.Y) * (self.app.Config.tileWidth/2)) +((elementToRemove.X - self.app.World.center.X) * (self.app.Config.tileWidth/2)) - (self.app.Config.tileWidth/2);
                elementToRemove.YPx = centerScreen.Y + ((elementToRemove.Y - self.app.World.center.Y) * (self.app.Config.tileHeight/2)) +((elementToRemove.X - self.app.World.center.X) * (self.app.Config.tileHeight/2)) - (self.app.Config.tileHeight/2);
            }

            //Change the world with the new element
            element.XPx = elementToRemove.XPx;
            element.YPx = elementToRemove.YPx;
            app.World[element.X][element.Y] = element;

            //Add the associate kinnetic texture of the element in the layer
            var tileType = null;
            if (element.contentTile != undefined){
                tileType = element.contentTile.type;
            }
            this.putTexture(new Vector2(elementToRemove.XPx, elementToRemove.YPx), this.getImageFromType(tileType, action) , app.World[element.X][element.Y], this.L_NAME.tiles, zIndex);

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

        // Generate a frame
        frame: function (id, base_x, base_y, offset_x, offset_y, nbr_x, width, height) {
            return {
                x: base_x + offset_x * ((id + nbr_x) % nbr_x),
                y: base_y + offset_y * parseInt(id / nbr_x),
                width: width,
                height: height
            };
        },

        // Generate frames
        frames: function (ids, base_x, base_y, offset_x, offset_y, nbr_x, nbr_y, width, height) {
            var self = this;
            var frames_tab = new Array();
            for(var i = 0; i < ids.length; ++i)
                frames_tab.push(self.frame(ids[i], base_x, base_y, offset_x, offset_y, nbr_x, width, height));
            return frames_tab;
        },

        opacityToTile: function(tile, opacity) {
            if(tile.image != undefined)
            {
                var opacity = (opacity) ? 0.5 : 1;
                tile.image.setOpacity(opacity);
            }
        },

        moveTextureAlongPath: function(path, farmerImage, farmer, layerName, speed, isFarmer){
            var self = this;

            //Farmer is walking
            farmer.isWalking = true;

            if( path.length > 0 ) {

                if(farmer.name == socket.sessions.farmer.name){
                    //Determine if farmer walk behind building
                    if(farmer.cleanTile != undefined)

                    {
                        self.opacityToTile(farmer.cleanTile, false);
                        farmer.cleanTile = undefined;
                        socket.sessions.tilesMissOpacity = undefined;
                        farmer.behindBuiding = false;
                    }
                    for(var i = 0; i < app.TileBehindBuilding.length; i++)
                    {
                        if(path[0].X == app.TileBehindBuilding[i].X && path[0].Y == app.TileBehindBuilding[i].Y)
                        {
                            socket.sessions.tilesMissOpacity = app.TileBehindBuilding[i].locations;
                            self.opacityToTile(app.TileBehindBuilding[i].tileA, true);
                            farmer.cleanTile = app.TileBehindBuilding[i].tileA;
                            farmer.behindBuiding = true;
                        }
                    }
                }

                //Determine polar directions

                //NORTH-EAST
                if (farmer.X == path[0].X && farmer.Y > path[0].Y){
                    if (farmer.direction != "NE"){
                        farmerImage.stop();
                        farmerImage.setAnimation('walkingNE');
                        farmer.direction = "NE";
                        farmerImage.start();
                    }
                }
                //NORTH-WEST
                if (farmer.X > path[0].X && farmer.Y == path[0].Y){
                    if (farmer.direction != "NW"){
                        farmerImage.stop();
                        farmerImage.setAnimation('walkingNW');
                        farmer.direction = "NW";
                        farmerImage.start();
                    }
                }
                //SOUTH-EAST
                if (farmer.X < path[0].X && farmer.Y == path[0].Y){
                    if (farmer.direction != "SE"){
                        farmerImage.stop();
                        farmerImage.setAnimation('walkingSE');
                        farmer.direction = "SE";
                        farmerImage.start();
                    }
                }
                //SOUTH-WEST
                if (farmer.X == path[0].X && farmer.Y < path[0].Y){
                    if (farmer.direction != "SW"){
                        farmerImage.stop();
                        farmerImage.setAnimation('walkingSW');
                        farmer.direction = "SW";
                        farmerImage.start();
                    }
                }

                var newXPx = app.World[path[0].X][path[0].Y].XPx;
                var newYPx = undefined;
                if(isFarmer){
                    newYPx = app.World[path[0].X][path[0].Y].YPx - ((farmerImage.attrs.image.height / app.Config.farmerSpriteNbLine) / 2);
                }
                else{
                    newYPx = app.World[path[0].X][path[0].Y].YPx;
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

                        if(farmer.name == socket.sessions.farmer.name){
                            socket.emit('updateFarmerPositionOnMove', {X: farmer.X, Y: farmer.Y});
                        }

                        if (path.length == 1){
                            farmerImage.stop();
                            var stopAnimation = 'stop'+farmer.direction;
                            farmerImage.setAnimation(stopAnimation);
                            farmerImage.afterFrame(0.1, function(){
                                farmerImage.stop();
                            });
                            farmer.direction = "";


                            if(farmer.name == socket.sessions.farmer.name){

                                //UPDATE MAP DISPLAY
                                if ((app.Config.tileHeight >= socket.sessions.positionClick.Y) && ((self.stage.attrs.width - app.Config.tileWidth) <= socket.sessions.positionClick.X)){
                                    self.stage.fire("dragMapToTopRight");
                                }
                                else if (((self.stage.attrs.height - app.Config.tileHeight) <= socket.sessions.positionClick.Y) && ((self.stage.attrs.width - app.Config.tileWidth) <= socket.sessions.positionClick.X)){
                                    self.stage.fire("dragMapToBottomRight");
                                }
                                else if ((app.Config.tileHeight >= socket.sessions.positionClick.Y) && (app.Config.tileWidth >= socket.sessions.positionClick.X)){
                                    self.stage.fire("dragMapToTopLeft");
                                }
                                else if (((self.stage.attrs.height - app.Config.tileHeight) <= socket.sessions.positionClick.Y) && (app.Config.tileWidth >= socket.sessions.positionClick.X)){
                                    self.stage.fire("dragMapToBottomLeft");
                                }
                                else if ((self.stage.attrs.width - app.Config.tileWidth) <= socket.sessions.positionClick.X){
                                    self.stage.fire("dragMapToRight");
                                }
                                else if (app.Config.tileWidth >= socket.sessions.positionClick.X){
                                    self.stage.fire("dragMapToLeft");
                                }
                                else if ((self.stage.attrs.height - app.Config.tileHeight) <= socket.sessions.positionClick.Y){
                                    self.stage.fire("dragMapToBottom");
                                }
                                else if (app.Config.tileHeight >= socket.sessions.positionClick.Y){
                                    self.stage.fire("dragMapToTop");
                                }
                            }
                        }
                        path.shift();
                        if (path.length > 0){
                            self.moveTextureAlongPath(path, farmerImage, farmer, layerName, speed, isFarmer);
                        }
                        else {
                            farmer.isWalking = false;
                            $j(document).trigger('FCL-farmerMoveEnd');
                        }
                    }
                });
            }
            else if (path.length == 0) {
                farmer.isWalking = false;
                $j(document).trigger('FCL-farmerMoveEnd');
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
                            //this.fire("dragMapToRight");
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

                //Clean old position of mouse (opacity)
                if(socket.sessions.tileClean != undefined && (socket.sessions.tileClean.tA.X != tile.X || socket.sessions.tileClean.tA.Y != tile.Y))
                {
                    //If farmer not behind building
                    if(!socket.sessions.farmer.behindBuiding)
                    {
                        self.opacityToTile(socket.sessions.tileClean.tileToClean, false);
                        socket.sessions.tileClean = undefined;
                        socket.sessions.tilesMissOpacityMouse = undefined;
                    }
                }
                if (tile != undefined){
                    //Detect if mouse on tile behind a building
                    for(var i = 0; i < app.TileBehindBuilding.length; i++)
                    {
                        if(tile.X == app.TileBehindBuilding[i].X && tile.Y == app.TileBehindBuilding[i].Y)
                        {
                            socket.sessions.tilesMissOpacityMouse = app.TileBehindBuilding[i].locations;
                            self.opacityToTile(app.TileBehindBuilding[i].tileA, true);
                            socket.sessions.tileClean = {tA: tile, tileToClean: app.TileBehindBuilding[i].tileA};
                        }
                    }

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
                }
            });

            $j("#section_canvas").on("mouseout", function(e){
                if(self.stage.currentTile != undefined)
                {
                    if(typeof self.stage.currentTile.mouseOutEvent == 'function'){
                        self.stage.currentTile.mouseOutEvent();
                    }
                }
            });

            stageK.on("dragMapToRight", function(){
                // HAVE TO BE A MULTIPLE OF TILE'S WIDTH OR HEIGHT
                var xToMove = -(app.Config.tileWidth)*app.Config.tileToDragHorizontally;
                var yToMove = 0;
                self.updateWorldTilesPx(xToMove, yToMove);
            });

            stageK.on("dragMapToLeft", function(){
                // HAVE TO BE A MULTIPLE OF TILE'S WIDTH OR HEIGHT
                var xToMove = (app.Config.tileWidth)*app.Config.tileToDragHorizontally;
                var yToMove = 0;
                self.updateWorldTilesPx(xToMove, yToMove);
            });

            stageK.on("dragMapToTop", function(){
                // HAVE TO BE A MULTIPLE OF TILE'S WIDTH OR HEIGHT
                var xToMove = 0;
                var yToMove = (app.Config.tileHeight)*app.Config.tileToDragVertically;
                self.updateWorldTilesPx(xToMove, yToMove);
            });

            stageK.on("dragMapToBottom", function(){
                // HAVE TO BE A MULTIPLE OF TILE'S WIDTH OR HEIGHT
                var xToMove = 0;
                var yToMove = -(app.Config.tileHeight)*app.Config.tileToDragVertically;
                self.updateWorldTilesPx(xToMove, yToMove);
            });

            stageK.on("dragMapToBottomLeft", function(){
                // HAVE TO BE A MULTIPLE OF TILE'S WIDTH OR HEIGHT
                var xToMove = (app.Config.tileWidth)*app.Config.tileToDragHorizontally;
                var yToMove = -(app.Config.tileHeight)*app.Config.tileToDragVertically;
                self.updateWorldTilesPx(xToMove, yToMove);
            });

            stageK.on("dragMapToBottomRight", function(){
                // HAVE TO BE A MULTIPLE OF TILE'S WIDTH OR HEIGHT
                var xToMove = -(app.Config.tileWidth)*app.Config.tileToDragHorizontally;
                var yToMove = -(app.Config.tileHeight)*app.Config.tileToDragVertically;
                self.updateWorldTilesPx(xToMove, yToMove);
            });

            stageK.on("dragMapToTopLeft", function(){
                // HAVE TO BE A MULTIPLE OF TILE'S WIDTH OR HEIGHT
                var xToMove = (app.Config.tileWidth)*app.Config.tileToDragHorizontally;
                var yToMove = (app.Config.tileHeight)*app.Config.tileToDragVertically;
                self.updateWorldTilesPx(xToMove, yToMove);
            });

            stageK.on("dragMapToTopRight", function(){
                // HAVE TO BE A MULTIPLE OF TILE'S WIDTH OR HEIGHT
                var xToMove = -(app.Config.tileWidth)*app.Config.tileToDragHorizontally;
                var yToMove = (app.Config.tileHeight)*app.Config.tileToDragVertically;
                self.updateWorldTilesPx(xToMove, yToMove);
            });

            stageK.on("dragMapToFarm", function(){
                if(socket.sessions.positionMap != undefined)
                {
                    var xTest = socket.sessions.positionMap.X;
                    var yTest = socket.sessions.positionMap.Y;
                    var xToMove = - socket.sessions.positionMap.X;
                    var yToMove = - socket.sessions.positionMap.Y;
                    self.updateWorldTilesPx(xToMove, yToMove);
                }
            });

            return stageK;
        },

        updateWorldTilesPx: function(xToMove, yToMove){
            var ScreenMinX = app.Config.screenMinX;
            var ScreenMaxX = app.Config.screenMaxX;
            var ScreenMinY = app.Config.screenMinY;
            var ScreenMaxY = app.Config.screenMaxY;

            //Keep position reminder
            if(socket.sessions.positionMap == undefined)
            {
                socket.sessions.positionMap = {X: xToMove, Y: yToMove};
            }
            else
            {
                socket.sessions.positionMap.X += xToMove;
                socket.sessions.positionMap.Y += yToMove;
            }

            //Old Center
            var oldCenter = app.World.center;
            var newCenter = undefined;
            for(var i=ScreenMinX; i<ScreenMaxX; i++){
                for (var j=ScreenMinY; j<ScreenMaxY; j++){
                    if(app.World[i] != undefined && app.World[i][j] != undefined)
                    {
                        var newXPx = app.World[i][j].XPx + xToMove;
                        var newYPx = app.World[i][j].YPx + yToMove;
                        app.World[i][j].XPx = newXPx;
                        app.World[i][j].YPx = newYPx;
                        if (app.World[i][j].image != undefined){
                            var newX = app.World[i][j].image.getX() + xToMove;
                            var newY = app.World[i][j].image.getY() + yToMove;
                            app.World[i][j].image.setX(newX);
                            app.World[i][j].image.setY(newY);
                        }
                        if (newXPx == oldCenter.XPx && newYPx == oldCenter.YPx){
                            newCenter = new Object();
                            newCenter.X = i;
                            newCenter.Y = j;
                            newCenter.XPx = newXPx;
                            newCenter.YPx = newYPx;
                        }
                    }
                }
            }

            if (newCenter == undefined){
                newCenter = new Object();
                newCenter.XPx = oldCenter.XPx;
                newCenter.YPx = oldCenter.YPx;

                //calcul new center coordinates
                var X0 = (oldCenter.XPx - xToMove) - this.stage.attrs.width / 2;
                var Y0 = (oldCenter.YPx - yToMove) - this.stage.attrs.height / 2;
                var X = Y0 + (X0 / 2) + (app.Config.tileWidth/2);
                var Y = Y0 - (X0 / 2);
                var Xiso = Math.round(X / app.Config.tileHeight) + oldCenter.X;
                var Yiso = Math.round(Y / app.Config.tileHeight) + oldCenter.Y;

                newCenter.X = Xiso;
                newCenter.Y = Yiso;
            }

            app.World.center = newCenter;

            //UPDATE FARMER POSITION
            $j(document).trigger('GAME-updateDisplayedMap', [app.World]);
            $j(document).trigger('FARMER-updatePosition', [xToMove, yToMove]);
        },

        getImageFromType: function(type, action) {
            var actionImage = "";
            if (action != undefined){
                actionImage = "_"+action;
            }
            switch(type)
            {
                case "seed":
                    var nameRessource = "seedTest"+actionImage;
                    return app.Ressources["seedTest"];
                    break;

                default:
                    var nameRessource = "default_tile"+actionImage;
                    return app.Ressources[nameRessource];
                    break;
            }
        }
		 
    };

	
    return FCL;
});
