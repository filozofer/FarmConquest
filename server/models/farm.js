var mongoose    = require("mongoose"),
    Schema      = mongoose.Schema;

//=================================================
// class:       Farmer
// description: Represent a farmer
//              (linked to an user account)
//=================================================


var FarmSchema = new Schema({
    user : [{ type : Schema.ObjectId, ref : "User"}],
    farmPosition : [{ type : Schema.ObjectId, ref : "Tile"}],
    position : [{ type : Schema.ObjectId, ref : "Tile"}]
});

// class constructor
FarmSchema.methods.create = function(user, farmPosition, position){
    this.user = user,
    // the farm covers 4 Tiles in a square shape
    // the farm position represents the top left corner of the square
    this.farmPosition = farmPosition;
    // the farmer position, represents 1 Tile
    this.position = position;
}

mongoose.model('Farm', FarmSchema);
