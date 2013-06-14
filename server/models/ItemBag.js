var mongoose    = require("mongoose"),
    Schema      = mongoose.Schema;

//=================================================
// class:       ItemBag
// description: Represent an item which can be put in the bag
//
//=================================================


var ItemBagSchema = new Schema({
    idItem: Number,
    farmer : { type : Schema.Types.ObjectId, ref : 'Farmer'},
    name : String,
    quantity: Number,
    positionInBag: Number
});


ItemBagSchema.methods.getAsObject = function(){

    var object = new Object();
    object._id = this._id;
    object.idItem = this.idItem;

    if(this.farmer != null && typeof(this.farmer._bsontype) == "undefined")
    {
        object.farmer = this.farmer.getAsObject();
    }

    object.name = this.name;
    object.quantity = this.quantity;
    object.positionInBag = this.positionInBag;

    return object;
};


mongoose.model('ItemBag', ItemBagSchema);