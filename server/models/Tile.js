var mongoose    = require("mongoose"),
    Schema      = mongoose.Schema;

//=================================================
// class:       Tile
// description: Represent a tile of the map
//=================================================

var Tile = new Schema({
    x : Number,
    y : Number,
    owner : [{ type : Schema.ObjectId, ref : "Farmer"}],
    content : String
});

Tile.methods.create = function(x,y,farmer,content){
    // set the default values
    if (typeof(x)=="undefined"){
        x=0;
    }
    if (typeof(y)=="undefined"){
        y=0;
    }
    if (typeof(owner)=="undefined"){
        owner=null;
    }
    if (typeof(content)=="undefined"){
        content=null;
    }

    this.x = x;
    this.y = y;
    this.owner = owner;
    this.content = content;
}

Tile.methods.print = function(){
    console.log("["+this.x+","+this.y+"]");
}

mongoose.model('Tile',Tile);

/*
// class constructor
var Tile = function(x,y,owner,content){
    // set the default values
    if (typeof(x)=="undefined"){
        x=0;
    }
    if (typeof(y)=="undefined"){
        y=0;
    }
    if (typeof(owner)=="undefined"){
        owner=null;
    }
    if (typeof(content)=="undefined"){
        content=null;
    }
    // x and y coordinates
    this.x = x;
    this.y = y;

    // the farmer who owns the tile
    this.owner = owner;
    // the content of the tile (building, farming, ...)
    this.content = content;
};

// class methods
Tile.prototype = {
    print : function(){
        return "["+this.x+","+this.y+"]"
    }
};

// export the object to make it accessible via the require function
module.exports = Tile;
*/