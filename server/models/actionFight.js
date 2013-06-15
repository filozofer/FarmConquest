var mongoose    = require("mongoose"),
    Schema      = mongoose.Schema;

//=================================================
// class:       ActionFight
// description: Represent an action during a fight
//
//=================================================


var ActionFightSchema = new Schema({
    nameAttacker: String,
    idWeapon: Number,
    damageWeapon: Number,
    probHitWeapon: Number,
    hit: Boolean,
    precisionModifDef: Number,
    precisionModifAtt: Number,
    orderAction: Number
});


ActionFightSchema.methods.getAsObject = function(){

    var object = new Object();
    object._id = this._id;

    object.nameAttacker = this.nameAttacker;
    object.idWeapon = this.idWeapon;
    object.damageWeapon = this.damageWeapon;
    object.probHitWeapon = this.probHitWeapon;
    object.hit = this.hit;
    object.precisionModifDef = this.precisionModifDef;
    object.precisionModifAtt = this.precisionModifAtt;
    object.orderAction = this.orderAction;

    return object;
};


mongoose.model('ActionFight', ActionFightSchema);