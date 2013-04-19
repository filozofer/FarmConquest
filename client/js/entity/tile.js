define(function(){

	var Tile = Class.create();
	Tile.prototype = {

		initialize: function(X, Y){
			this.X = X;
			this.Y = Y;
		},

		onClickJS: function(){
			alert("(" + this.X + "." + this.Y + ")");
		}

    };

    return Tile;
});

