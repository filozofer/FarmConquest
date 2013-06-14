var mongoose    = require("mongoose"),
    Schema      = mongoose.Schema;

//=================================================
// class:       Arsenal
// description: Represent the weapons own by farmers
//
//=================================================


var ArsenalSchema = new Schema({
    farmer : { type : Schema.Types.ObjectId, ref : 'Farmer'},
    mainWeapon : { type : Schema.Types.ObjectId, ref : 'Weapon'},
    supportWeapon: { type : Schema.Types.ObjectId, ref : 'Weapon'}
});


ArsenalSchema.methods.getAsObject = function(){

    var object = new Object();
    object._id = this._id;

    if(this.farmer != null && typeof(this.farmer._bsontype) == "undefined")
    {
        object.farmer = this.farmer.getAsObject();
    }

    if(this.mainWeapon != null && typeof(this.mainWeapon._bsontype) == "undefined")
    {
        object.mainWeapon = this.mainWeapon.getAsObject();
    }

    if(this.supportWeapon != null && typeof(this.supportWeapon._bsontype) == "undefined")
    {
        object.supportWeapon = this.supportWeapon.getAsObject();
    }

    return object;
};


mongoose.model('Arsenal', ArsenalSchema);