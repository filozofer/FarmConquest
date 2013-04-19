define(['./kinetic'], function(){

	var FCL = Class.create();
	FCL.prototype = {
		initialize: function(idContainer, x, y){
			
			this.stage = new Kinetic.Stage({
		           container: idContainer,
		           width: x,
		           height: y
		         });
		    
		    this.layer = new Kinetic.Layer();
			
		},

		putTexture: function(vector, image, objectLinked){
			var self = this;
			var texture = new Image();
			texture.src = image;
			texture.onload = function(){
				self.drawImage(texture, vector, objectLinked);
			};
		},
		
		getMousePos: function(evt) {
		        var rect = this.canvas.getBoundingClientRect();
		        return {
		          x: evt.clientX - rect.left,
		          y: evt.clientY - rect.top
		        };
		 },
		 
		 isOccupied: function(mousePos){

		 },
		 
		 addTile: function(vector, texture){

		 },
		 
		 drawImage: function(imageObj, vector, objectLinked) { 
            var self = this;
		    var customImg = new Kinetic.Image({
		    	image: imageObj,
		        x: vector.X,
		        y: vector.Y,
		        width: imageObj.width,
		        height: imageObj.height
		    });

            objectLinked.image = customImg;

		    //customImg.objectLinked = undefined;
		    customImg.objectLinked = objectLinked;

/*
mousedown
mouseup
mouseout
mouseenter
mouseleave
mousemove
dblclick
touchstart
touchend
touchmove
tap
dbltap
dragstart
dragmove
dragend
draw
beforeDraw
*/
			if(typeof customImg.objectLinked.clickEvent == 'function')
			{
				customImg.on("click", function(){
		    		this.objectLinked.clickEvent();
		    	});
		    }
		    if(typeof customImg.objectLinked.mouseOverEvent == 'function')
			{
				customImg.on("mouseover", function(){
		    		this.objectLinked.mouseOverEvent();
                            self.layer.draw();
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
                            self.layer.draw();
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

		    

		    this.layer.add(customImg);
		    this.stage.add(this.layer);

		    
		}
		 
    };

	
    return FCL;
});
