define(['./kinetic'], function(){

	var FCL = Class.create();
	FCL.prototype = {
		initialize: function(idContainer, x, y){
			
			this.stage = new Kinetic.Stage({
		           container: idContainer,
		           width: x,
		           height: y
		         });

		    this.layers = new Object();

		},

        draw: function() {
            this.stage.clear();

            for (var i in this.layers){
                //this.layers[i].drawHit();
                this.stage.add(this.layers[i]);
            }
            //this.layer.drawHit();
            //this.stage.add(this.layer);
        },

		putTexture: function(vector, imageObj, objectLinked){
            var self = this;


            var customImg = new Kinetic.Image({
                image: imageObj,
                x: vector.X,
                y: vector.Y
            });
            //customImg.imageHitRegion = imageObj.imageHitRegion;

            /*
            var customImg = imageObj.clone();
            customImg.setX(vector.X);
            customImg.setY(vector.Y);
            customImg.setName(vector.X + " - " + vector.Y);
            //customImg.imageHitRegion = imageObj.imageHitRegion.clone();
            */

            if (this.layers[vector.Y] == undefined){
                this.layers[vector.Y] = new Kinetic.Layer();

                /*
                this.layers[vector.Y].on('click', function(evt) {
                        // get the shape that was clicked on
                        var shape = evt.targetNode;
                        alert('you clicked on \"' + shape.getName() + '\"');
                      });
                */
            }

            /*
            customImg.createImageHitRegion(function(){
                self.layers[vector.Y].draw();
            });
            */

            customImg.objectLinked = objectLinked;
            customImg = this.manageEvent(customImg);
            objectLinked.image = customImg;

            customImg.createImageHitRegion(function(){
                            console.log("img add to layer");
                        });

            this.layers[vector.Y].add(customImg);
            //this.layers[vector.Y].add(customImg);
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

            if(typeof customImg.objectLinked.clickEvent == 'function')
            {
                customImg.on("click", function(){
                    this.objectLinked.clickEvent();
                    console.log("onclick");
                });
            }
            if(typeof customImg.objectLinked.mouseOverEvent == 'function')
            {
                customImg.on("mouseover", function(){
                    this.objectLinked.mouseOverEvent();
                    self.layers[customImg.getY()].drawScene(self.layers[customImg.getY()].getCanvas());
                    //self.layers[customImg.getY()].drawHit();
                    console.log("OVER IMG = " + customImg.getX() + " - " + customImg.getY());
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
                    self.layers[customImg.getY()].drawScene(self.layers[customImg.getY()].getCanvas());
                    //self.layers[customImg.getY()].drawHit();
                    console.log("OUT IMG = " + customImg.getX() + " - " + customImg.getY());
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
