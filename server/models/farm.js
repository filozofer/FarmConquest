var mongoose    = require("mongoose"),
    Schema      = mongoose.Schema;

//=================================================
// class:       Farmer
// description: Represent a farmer
//              (linked to an user account)
//=================================================


var FarmSchema = new Schema({
    owner : [{ type : Schema.Types.ObjectId, ref : 'User'}],
    farmPosition : [{ type : Schema.Types.ObjectId, ref : 'Tile'}],
    position : [{ type : Schema.Types.ObjectId, ref : 'Tile'}]
});

// class constructor
FarmSchema.methods.create = function(){
    this.owner = null,
    // the farm covers 4 Tiles in a square shape
    // the farm position represents the top left corner of the square
    this.farmPosition = undefined;
    // the farmer position, represents 1 Tile
    this.position = undefined;
}

mongoose.model('Farm', FarmSchema);
