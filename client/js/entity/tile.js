define(['jquery'], function(jQuery){

    var $j = jQuery.noConflict();

	var Tile = Class.create();
	Tile.prototype = {

		initialize: function(X, Y){
			this.X = X;
			this.Y = Y;
			this.image = undefined;
			this.walkable = true;
		},

		clickEvent: function(){
			//alert("(" + this.X + "." + this.Y + ")");
            socket.emit("plantTest", { X: this.X, Y: this.Y});
		},

		mouseOverEvent: function(){
		    this.image.setOpacity(0.5);
		},

		mouseOutEvent: function(){
		    this.image.setOpacity(1);
		},

		rightClickEvent: function(){
		    if (this.walkable){
		        $j(document).trigger('FARMER-moveFarmer', [this]);
		    }
		    else{
		        console.log("NOT WALKABLE");
		    }
		}

    };

    return Tile;
});

