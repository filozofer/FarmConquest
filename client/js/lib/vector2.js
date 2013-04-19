define(function(){
	
    var Vector2 = Class.create();
	Vector2.prototype = {

		initialize: function(X, Y){
			this.X = X;
			this.Y = Y;
		}

    };

    return Vector2;
});
