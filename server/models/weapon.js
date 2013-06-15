var mongoose    = require("mongoose"),
    Schema      = mongoose.Schema;

//=================================================
// class:       Weapon
// description: Represent a weapon own by a farmer
//
//=================================================


var WeaponSchema = new Schema({
    farmer : { type : Schema.Types.ObjectId, ref : 'Farmer'},
    idItem: Number,
    type: Number,
    power: Number,
    hitRatio: Number
});


WeaponSchema.methods.getAsObject = function(){

    var object = new Object();
    object._id = this._id;
    object.idItem = this.idItem;

    if(this.farmer != null && typeof(this.farmer._bsontype) == "undefined")
    {
        object.farmer = this.farmer.getAsObject();
    }

    object.type = this.type;
    object.power = this.power;
    object.hitRatio = this.hitRatio;
    object.probabilityHappen = this.probabilityHappen;

    return object;
};

WeaponSchema.methods.effect = function(){

};


mongoose.model('Weapon', WeaponSchema);