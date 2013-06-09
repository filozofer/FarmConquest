DatabaseController = function(socket, db, mongoose){
    var Tile = mongoose.model("Tile");
    var EventEmitter = require('events').EventEmitter;

    var WorldInfoModel = mongoose.model("WorldInfo");

    var ContentTile = mongoose.model("ContentTile");
    var self=this;

    process.on("checkForFirstFarm", function(user){
        console.log("checkForFirstFarm");
        self.infoExist(user);
    });

    this.infoExist = function (user){
        console.log("checking if collection exist...");
        var result = null;
        WorldInfoModel.findOne({ infoToUse: 1 },function (err, info) {
                    if (err){throw(err);}

                    if(info != null) {
                        result = true;
                    } else {
                       result = false;
                       console.log("PAS de WorldInfo");
                    }
                    console.log("WorldInfo has content : " + result);
                    if (result == true){
                        process.emit("addFarm", user);
                    }else{
                        self.initWorld();
                        self.initContentTiles();
                        process.emit("addFarm", user);
                    }
                });
    }

    this.updateField = function(collection, fieldName, value, where){
        collection.update({
            query: where,//{ name: "Tom", state: "active", rating: { $gt: 10 } },
            update: { fieldName: value }
        });
    }

    this.initWorld = function(){
        var worldInfo = new WorldInfoModel();
        worldInfo.infoToUse = 1;
        worldInfo.lastFarmUpLeftX = 0;
        worldInfo.lastFarmUpLeftY = 0;
        worldInfo.lastFarmBottomRightX = 0;
        worldInfo.lastFarmBottomRightY = 0;
        worldInfo.save();
        console.log("world initialized !");
    }

    this.initContentTiles = function(){
       var avoine1 = new ContentTile();
       avoine1.type = "seed";
       avoine1.name = "Avoine";
       avoine1.description = "Niv. 1";
       avoine1.save();
        console.log("tiles initialized !");
    }
};

 module.exports = DatabaseController;