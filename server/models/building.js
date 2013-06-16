var mongoose    = require("mongoose"),
    Schema      = mongoose.Schema;

//=================================================
// class:       Farmer
// description: Represent a farmer
//              (linked to an user account)
//=================================================


var Building = new Schema({
    owner : { type : Schema.ObjectId, ref : 'Farmer'},
    mainPos : { type : Schema.ObjectId, ref : 'Tile'},
    locations : [{ type : Schema.ObjectId, ref : 'Tile'}],
    type : String,
    name : String,
    description : String

});

// class constructor
Building.methods.create = function(){
    this.type = Config.buildingType.grange;
    this.name = Config.buildingType.grange;
    this.description = Config.buildingType.grange;
}

Building.methods.getAsObject = function(){

    var object = new Object();
    object._id = this._id;
    object.type = this.type;
    object.name = this.name;
    object.description = this.description;

    if(this.owner != null && typeof(this.owner._bsontype) == "undefined")
    {
        object.owner = this.owner.getAsObject();
    }

    if(this.mainPos != null && typeof(this.mainPos._bsontype) == "undefined")
    {
        object.mainPos = this.mainPos.getAsObject();
    }

    if(this.locations != null)
    {
        object.locations = new Array();
        for (var i=0; i<this.locations.length; i++){
            if (typeof(this.locations[i]._bsontype) == "undefined"){
                object.locations.push(this.locations[i].getAsObject());
            }
        }
    }

    return object;
}

mongoose.model('Building', Building);
