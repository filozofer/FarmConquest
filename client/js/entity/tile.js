define(function(){

	var Tile = Class.create();
	Tile.prototype = {

		initialize: function(X, Y){
			this.X = X;
			this.Y = Y;
			this.image = undefined;
		},

		clickEvent: function(){
			alert("(" + this.X + "." + this.Y + ")");
		},

		mouseOverEvent: function(){
		    //this.image.setStroke('red');
		    //this.image.setStrokeWidth(4);
		    //this.image.enableStroke();
		    this.image.setOpacity(0.5);
		    console.log("overTile");
		},

		mouseOutEvent: function(){
		    //this.image.disableStroke();
		    this.image.setOpacity(1);
		    console.log("outTile");
		}

    };

    return Tile;
});

