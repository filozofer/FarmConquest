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
            socket.emit("plantTest", { X: this.X, Y: this.Y});
		},

		mouseOverEvent: function(){
            if(this.image != undefined)
            {
                this.image.setOpacity(0.5);
            }
            else
            {
                var mainPos = this.contentTile.mainPos;
                app.World[mainPos.X][mainPos.Y].image.setOpacity(0.5);
            }
		},

		mouseOutEvent: function(){
            if(this.image != undefined)
            {
                this.image.setOpacity(1);
            }
            else
            {
                var mainPos = this.contentTile.mainPos;
                app.World[mainPos.X][mainPos.Y].image.setOpacity(1);
            }
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

