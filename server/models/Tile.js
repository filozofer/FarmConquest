var mongoose    = require("mongoose"),
    Schema      = mongoose.Schema;

//=================================================
// class:       Tile
// description: Represent a tile of the map
//=================================================

var Tile = new Schema({
    X : Number,
    Y : Number,
    humidity: Number,
    fertility: Number,
    owner : { type : Schema.Types.ObjectId, ref : 'Farmer'},
    contentTile : { type : Schema.Types.ObjectId, ref : 'ContentTile'},
    walkable: Boolean
});

Tile.methods.create = function(){
    this.X = null;
    this.Y = null;
    this.humidity = null;
    this.fertility = null;
    this.owner = null;
    this.contentTile = null;
    this.walkable = null;
}

Tile.methods.print = function(){
    console.log("["+this.x+","+this.y+"]");
}

Tile.methods.setRandomStats = function(){
    this.humidity = Math.floor(Math.random()*(8-4+1)+4);
    this.fertility = Math.floor(Math.random()*(8-4+1)+4);
}

Tile.methods.getAsObject = function(){

    var object = new Object();
    object._id = this._id;
    object.X = this.X;
    object.Y = this.Y;
    object.humidity = this.humidity;
    object.fertility = this.fertility;
    object.walkable = this.walkable;

    if(this.owner != null && typeof(this.owner._bsontype) == "undefined")
    {
        object.owner = this.owner.getAsObject();
    }

    if(this.contentTile != null && typeof(this.contentTile._bsontype) == "undefined")
    {
        object.contentTile = this.contentTile.getAsObject();
    }

    return object;
}

mongoose.model('Tile',Tile);
