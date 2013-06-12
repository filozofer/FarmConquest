var mongoose    = require("mongoose"),
    Schema      = mongoose.Schema;

//=================================================
// class:       Farmer
// description: Represent a farmer
//              (linked to an user account)
//=================================================


var FarmerSchema = new Schema({
    user : { type : Schema.Types.ObjectId, ref : 'User'},
    name : String,
    X: Number,
    Y: Number
});

// class constructor
FarmerSchema.methods.create = function(user, name){
    this.user = user;
    this.name = name;
    this.X = null;
    this.Y = null;
}

FarmerSchema.methods.getAsObject = function(){

    var object = new Object();
    object._id = this._id;

    if(this.user != null && typeof(this.user._bsontype) == "undefined")
    {
        object.user = this.user.getAsObject();
    }

    object.name = this.name;
    object.X = this.X;
    object.Y = this.Y;

    return object;
}

mongoose.model('Farmer', FarmerSchema);