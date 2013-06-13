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
            this.isWalking = false;
            this.money = undefined;
            this.level = undefined;
            this.experiences = undefined;
            this.name = undefined;

			//Sprite orientation
			this.direction = "";
		},

        createByServer: function(farmer){
            this.X = (farmer.X != undefined) ? farmer.X : 0;
            this.Y = (farmer.Y != undefined) ? farmer.Y : 0;
            this.money = (farmer.money != undefined) ? farmer.money : undefined;
            this.level = (farmer.level != undefined) ? farmer.level : undefined;
            this.experiences = (farmer.experiences != undefined) ? farmer.experiences : undefined;
            this.name = (farmer.name != undefined) ? farmer.name : undefined;
        },

		clickEvent: function(){

		},

		rightClickEvent: function(){

		}

    };

    return Farmer;
});

