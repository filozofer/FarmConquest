define(['jquery'], function(jQuery){

    var $j = jQuery.noConflict();

	var Farmer = Class.create();
	Farmer.prototype = {

		initialize: function(X, Y){
			this.X = X;
			this.Y = Y;
			this.image = undefined;
			this.XPx = undefined;
			this.YPx = undefined;
            this.behindBuiding = false;

			//Sprite orientation
			this.direction = "";
		},

		clickEvent: function(){
			alert("Don't touch me you asshole !");
		},

		rightClickEvent: function(){
		    alert("What do you want ?");
		}

    };

    return Farmer;
});

