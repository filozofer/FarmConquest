define(['./kinetic', './tweenlite'], function(){

	var FCL = Class.create();
	FCL.prototype = {
		initialize: function(idContainer, x, y){

            //Stage Kinnetic
			this.stage = new Kinetic.Stage({
		           container: idContainer,
		           width: x,
		           height: y
		         });

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

            //Use to know how many hit region have been load before draw
            this.loadHitRegion = 0;
		},

        draw: function() {
            this.stage.clear();

            for (var i in this.layers){
                this.stage.add(this.layers[i]);
            }

        },

        clearCanvas: function() {
            this.stage.clear();
            for (var i in this.layers){
                this.layers[i] = new Kinetic.Layer();
            }


        },

		putTexture: function(vector, imageObj, objectLinked, layerName){
            var self = this;

            var customImg = new Kinetic.Image({
                image: imageObj,
                x: vector.X,
                y: vector.Y
            });

            customImg.objectLinked = objectLinked;
            customImg = this.manageEvent(customImg);
            objectLinked.image = customImg;

            if(this.layers[layerName] == undefined)
            {
                this.layers[layerName] = new Kinetic.Layer();
            }

            this.loadHitRegion++;
            customImg.createImageHitRegion(function() {
                self.hitRegionLoaded();
            });

            this.layers[layerName].add(customImg);
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
                    farmerImage.getLayer().draw();
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
		
		getMousePos: function(evt) {
		        var rect = this.canvas.getBoundingClientRect();
		        return {
		          x: evt.clientX - rect.left,
		          y: evt.clientY - rect.top
		        };
		 },

        manageEvent: function(customImg) {
            var self = this;

            customImg.on("click", function(e){
                if (e.which != 3){
                    if(typeof customImg.objectLinked.clickEvent == 'function'){
                        this.objectLinked.clickEvent();
                    }
                } else {
                    if(typeof customImg.objectLinked.rightClickEvent == 'function'){
                        this.objectLinked.rightClickEvent();
                    }
                }
            });

            /*if(typeof customImg.objectLinked.clickEvent == 'function')
            {
                customImg.on("click", function(){
                    this.objectLinked.clickEvent();
                });
            }*/
            if(typeof customImg.objectLinked.mouseOverEvent == 'function')
            {
                customImg.on("mouseover", function(){
                    this.objectLinked.mouseOverEvent();
                    //self.layers[customImg.getY()].drawScene(self.layers[customImg.getY()].getCanvas());
                    self.draw();
                });
            }
            if(typeof customImg.objectLinked.mouseDownEvent == 'function')
            {
                customImg.on("mousedown", function(){
                    this.objectLinked.mouseDownEvent();
                });
            }
            if(typeof customImg.objectLinked.mouseUpEvent == 'function')
            {
                customImg.on("mouseup", function(){
                    this.objectLinked.mouseUpEvent();
                });
            }
            if(typeof customImg.objectLinked.mouseOutEvent == 'function')
            {
                customImg.on("mouseout", function(){
                    this.objectLinked.mouseOutEvent();
                    //self.layers[customImg.getY()].drawScene(self.layers[customImg.getY()].getCanvas());
                    self.draw();
                });
            }
            if(typeof customImg.objectLinked.mouseEnterEvent == 'function')
            {
                customImg.on("mouseenter", function(){
                    this.objectLinked.mouseEnterEvent();
                });
            }
            if(typeof customImg.objectLinked.mouseLeaveEvent == 'function')
            {
                customImg.on("mouseleave", function(){
                    this.objectLinked.mouseLeaveEvent();
                });
            }
            if(typeof customImg.objectLinked.mouseMoveEvent == 'function')
            {
                customImg.on("mousemove", function(){
                    this.objectLinked.mouseMoveEvent();
                });
            }
            if(typeof customImg.objectLinked.doubleClickEvent == 'function')
            {
                customImg.on("dblclick", function(){
                    this.objectLinked.doubleClickEvent();
                });
            }
            if(typeof customImg.objectLinked.touchStartEvent == 'function')
            {
                customImg.on("touchstart", function(){
                    this.objectLinked.touchStartEvent();
                });
            }
            if(typeof customImg.objectLinked.touchEndEvent == 'function')
            {
                customImg.on("touchend", function(){
                    this.objectLinked.touchEndEvent();
                });
            }
            if(typeof customImg.objectLinked.touchMoveEvent == 'function')
            {
                customImg.on("touchmove", function(){
                    this.objectLinked.touchMoveEvent();
                });
            }
            if(typeof customImg.objectLinked.tapEvent == 'function')
            {
                customImg.on("tap", function(){
                    this.objectLinked.tapEvent();
                });
            }
            if(typeof customImg.objectLinked.doubleTapEvent == 'function')
            {
                customImg.on("dbltap", function(){
                    this.objectLinked.doubleTapEvent();
                });
            }
            if(typeof customImg.objectLinked.dragStartEvent == 'function')
            {
                customImg.on("dragstart", function(){
                    this.objectLinked.dragStartEvent();
                });
            }
            if(typeof customImg.objectLinked.dragMoveEvent == 'function')
            {
                customImg.on("dragmove", function(){
                    this.objectLinked.dragMoveEvent();
                });
            }
            if(typeof customImg.objectLinked.dragEndEvent == 'function')
            {
                customImg.on("dragend", function(){
                    this.objectLinked.dragEndEvent();
                });
            }
            if(typeof customImg.objectLinked.drawEvent == 'function')
            {
                customImg.on("draw", function(){
                    this.objectLinked.drawEvent();
                });
            }
            if(typeof customImg.objectLinked.beforeDrawEvent == 'function')
            {
                customImg.on("beforeDraw", function(){
                    this.objectLinked.beforeDrawEvent();
                });
            }

            return customImg;
        }
		 
    };

	
    return FCL;
});
