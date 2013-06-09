var mongoose    = require("mongoose"),
    Schema      = mongoose.Schema;

//=================================================
// class:       contentTile
// description: Represent the content of a tile
//=================================================

var ContentTile = new Schema({
    type : String,
    name : String,
    description : String
});

ContentTile.methods.create = function(type, name, description){
    this.type = type;
    this.name = name;
    this.description = description;
}

mongoose.model('ContentTile',ContentTile);