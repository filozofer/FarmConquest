//=================================================
// Tile
//
// Represent a tile of the map
//=================================================

var Tile = function(x,y){
    if (typeof(x)=="undefined"){
        x=0;
    }
    if (typeof(y)=="undefined"){
        y=0;
    }
    this.x = x;
    this.y = y;
};
Tile.prototype = {
    print : function(){
        return "["+this.x+","+this.y+"]"
    }
};

//export the object to make it accessible via the require function
module.exports = Tile;