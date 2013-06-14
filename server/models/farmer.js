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
    Y: Number,
    money : Number,
    level : Number,
    experiences : Number,
    bag: [{ type : Schema.Types.ObjectId, ref : 'ItemBag'}]
});

// class constructor / On l'utilise sa ?
FarmerSchema.methods.create = function(user, name){
    this.user = user;
    this.name = name;
    this.X = null;
    this.Y = null;
    this.money = null;
    this.level = null;
    this.experiences = null;
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
    object.money = this.money;
    object.level = this.level;
    object.experiences = this.experiences;

    object.bag = new Array();
    if(this.bag != undefined && this.bag.length != undefined)
    {
        for(var i = 0; i < this.bag.length; i++)
        {
            if(this.bag[i] != null && typeof(this.bag[i]._bsontype) == "undefined")
            {
                object.bag.push(this.bag[i].getAsObject());
            }
        }
    }

    //Keep reference of this mongoose object
    object.mongooseObject = this;

    return object;
}

mongoose.model('Farmer', FarmerSchema);