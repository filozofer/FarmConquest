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

		    var customImg = new Kinetic.Image({
		    	image: imageObj,
		        x: vector.X,
		        y: vector.Y,
		        width: imageObj.width,
		        height: imageObj.height
		    });

		    customImg.objectLinked = undefined;
		    customImg.objectLinked = objectLinked;

/*
mousedown
mouseup
mouseover
mouseout
mouseenter
mouseleave
mousemove
click
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
			var test = customImg.objectLinked.onClickJS;
			if(typeof customImg.objectLinked.onClickJS == 'function')
			{
				customImg.on("click", function(){
		    		this.objectLinked.onClickJS();
		    	});
		    }

		    if(typeof customImg.objectLinked.onMouseOverJS == 'function')
			{
				customImg.on("mouseover", function(){
		    		this.objectLinked.onMouseOverJS();
		    	});
		    }

		    

		    this.layer.add(customImg);
		    this.stage.add(this.layer);

		    
		}
		 
    };

	
    return FCL;
});
