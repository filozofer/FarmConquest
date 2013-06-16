var mongoose    = require("mongoose"),
    Schema      = mongoose.Schema;

//=================================================
// class:       Fight
// description: Represent an fight
//
//=================================================


var FightSchema = new Schema({
    farmerAttacker: String,
    farmerDefender: String,
    farmerAttackerLife: Number,
    farmerDefenderLife: Number,
    date: { type: Date, default: Date.now },
    winnerName: String,
    rewardMoneyAtt: Number,
    rewardMoneyDef: Number,
    creditConquest: Number,
    farmerAttackerMainWeapon: Number,
    farmerDefenderMainWeapon: Number,
    farmerAttackerSupportWeapon: Number,
    farmerDefenderSupportWeapon: Number,
    actionsFights : [{ type : Schema.Types.ObjectId, ref : 'ActionFight'}]
});


FightSchema.methods.getAsObject = function(){

    var object = new Object();
    object._id = this._id;

    object.farmerAttacker = this.farmerAttacker;
    object.farmerDefender = this.farmerDefender;
    object.farmerAttackerLife = this.farmerAttackerLife;
    object.farmerDefenderLife = this.farmerDefenderLife;
    object.date = this.date;
    object.winnerName = this.winnerName;
    object.rewardMoney = this.rewardMoney;
    object.creditConquest = this.creditConquest;
    object.farmerAttackerMainWeapon = this.farmerAttackerMainWeapon;
    object.farmerDefenderMainWeapon = this.farmerDefenderMainWeapon;
    object.farmerAttackerSupportWeapon = this.farmerAttackerSupportWeapon;
    object.farmerDefenderSupportWeapon = this.farmerDefenderSupportWeapon;

    object.actionsFights = new Array();
    if(this.actionsFights != undefined && this.actionsFights.length != undefined)
    {
        for(var i = 0; i < this.actionsFights.length; i++)
        {
            if(this.actionsFights[i] != null && typeof(this.actionsFights[i]._bsontype) == "undefined")
            {
                object.actionsFights.push(this.actionsFights[i].getAsObject());
            }
        }
    }

    return object;
};


mongoose.model('Fight', FightSchema);