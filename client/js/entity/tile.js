define(['jquery'], function(jQuery){

    var $j = jQuery.noConflict();

	var Tile = Class.create();
	Tile.prototype = {

		initialize: function(X, Y){
			this.X = X;
			this.Y = Y;
			this.image = undefined;
            this.contentTile = undefined;
			this.walkable = true;
            this.owner = undefined;
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
                if (this.contentTile != undefined){
                    var mainPos = this.contentTile.mainPos;
                    app.World[mainPos.X][mainPos.Y].image.setOpacity(0.5);
                }
            }

            $j(document).trigger('TILE-mouseOver', {X: this.X, Y: this.Y});
		},

		mouseOutEvent: function(){
            if(this.image != undefined)
            {
                this.image.setOpacity(1);
            }
            else
            {
                if (this.contentTile != undefined){
                    var mainPos = this.contentTile.mainPos;
                    app.World[mainPos.X][mainPos.Y].image.setOpacity(1);
                }
            }
		},

		rightClickEvent: function(){
		    if (this.walkable){
		        $j(document).trigger('FARMER-moveFarmer', [this]);
		    }
		    else{
		        console.log("NOT WALKABLE");
		    }
		},

        setContentTile: function(contentTile){
            if(contentTile == undefined)
                return null;

            this.contentTile = contentTile;

            if(this.contentTile.owner != undefined)
                this.owner = this.contentTile.owner;

            switch(contentTile.type)
            {
                case "farm":
                    this.walkable = false;
                    break;

                case "seed":
                    this.walkable = true;
                    break;

                default:
                    break;
            }
        }

    };

    return Tile;
});

