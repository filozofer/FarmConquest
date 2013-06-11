var mongoose    = require("mongoose"),
    Schema      = mongoose.Schema;

//=================================================
// class:       Farmer
// description: Represent a farmer
//              (linked to an user account)
//=================================================


var FarmSchema = new Schema({
    owner : { type : Schema.ObjectId, ref : 'User'},
    mainPos : { type : Schema.ObjectId, ref : 'Tile'},
    locations : [{ type : Schema.ObjectId, ref : 'Tile'}],
    type : String,
    name : String,
    description : String

});

// class constructor
FarmSchema.methods.create = function(){
    this.type = "farm";
    this.name = "Ferme";
    this.description = "Bâtiment principal";
}

mongoose.model('Farm', FarmSchema);
