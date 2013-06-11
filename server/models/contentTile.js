var mongoose    = require("mongoose"),
    Schema      = mongoose.Schema;

//=================================================
// class:       contentTile
// description: Represent the content of a tile
//=================================================

var ContentTile = new Schema({
    type : String,
    name : String,
    description : String,
    mainPos : { type : Schema.ObjectId, ref : 'Tile'},
    owner : { type : Schema.ObjectId, ref : 'User'},
    locations : [{ type : Schema.ObjectId, ref : 'Tile'}]
});

ContentTile.methods.create = function(type, name, description){
    this.type = type;
    this.name = name;
    this.description = description;
}

ContentTile.methods.getAsObject = function(){

    var object = new Object();
    object._id = this._id;
    object.type = this.type;
    object.name = this.name;
    object.description = this.description;

    if(this.mainPos != null && typeof(this.mainPos._bsontype) == "undefined")
    {
        object.mainPos = this.mainPos.getAsObject();
    }

    if(this.owner != null && typeof(this.owner._bsontype) == "undefined")
    {
        object.owner = this.owner.getAsObject();
    }

    if(this.locations != null && typeof(this.locations._bsontype) == "undefined")
    {
        object.locations = new Array();
        for(var i = 0; i < this.locations.length; i++)
        {
            if(typeof(this.locations[i]._bsontype) == "undefined")
            {
                object.locations.push(this.locations[i].getAsObject());
            }
        }
    }

    return object;

}

mongoose.model('ContentTile',ContentTile);