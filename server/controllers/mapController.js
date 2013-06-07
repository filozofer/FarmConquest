//=================================================
// class:       MapController
// description:
//=================================================

MapController = function(socket, db, mongoose) {

        this.FarmerModel = mongoose.model("Farmer");
        this.FarmModel   = mongoose.model("Farm");

        this.addFarmer = function(user, name){
            farmer = new this.FarmerModel();
            farmer.user = user;
            farmer.name = name;
            farmer.save(function(err){
                if (err) {
                    throw err;
                }
                mongoose.connection.close();
            });
        }

}

module.exports = MapController;