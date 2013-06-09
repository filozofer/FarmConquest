var mongoose    = require("mongoose"),
    Schema      = mongoose.Schema;


var WorldInfoSchema = new Schema({
    lastFarmUpLeftX : Number,
    lastFarmUpLeftY : Number,
    lastFarmBottomRightX : Number,
    lastFarmBottomRightY : Number,
    infoToUse : Number
});

// class constructor
WorldInfoSchema.methods.create = function(){
    this.lastFarmUpLeftX = 0;
    this.lastFarmUpLeftY = 0;
    this.lastFarmBottomRightX = 0;
    this.lastFarmBottomRightY = 0;
}

mongoose.model('WorldInfo', WorldInfoSchema);
