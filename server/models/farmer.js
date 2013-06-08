var mongoose    = require("mongoose"),
    Schema      = mongoose.Schema;

//=================================================
// class:       Farmer
// description: Represent a farmer
//              (linked to an user account)
//=================================================


var FarmerSchema = new Schema({
    user : [{ type : Schema.ObjectId, ref : "User"}],
    name : String,
    farmPosition : [{ type : Schema.ObjectId, ref : "Tile"}],
    position : [{ type : Schema.ObjectId, ref : "Tile"}]
});

// class constructor
FarmerSchema.methods.create = function(user, name, farmPosition, position){
    this.user = user;
    this.name = name;
    // the farm covers 4 Tiles in a square shape
    // the farm position represents the top left corner of the square
    this.farmPosition = farmPosition;
    // the farmer position, represents 1 Tile
    this.position = position;
}

mongoose.model('Farmer', FarmerSchema);