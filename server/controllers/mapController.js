//=================================================
// class:       MapController
// description:
//=================================================

MapController = function(socket, db, mongoose) {

        this.FarmerModel = mongoose.model("Farmer");
        this.FarmModel   = mongoose.model("Farm");

        var ContentTile = mongoose.model("ContentTile");
        var Tile = mongoose.model("Tile");

        this.getContentTileByName = function(tileName){
            var content = null;
            ContentTile.findOne({ name : tileName },function (err, contentTile) {
                content = contentTile;
            });
            return content;
        }

        this.findTileAtPosition = function(x, y){
            var tile = null;
            Tile.findOne({ X: x, Y: y },function (err, tile) {
                content = tile;
            });
            return content;
        }

}

module.exports = MapController;