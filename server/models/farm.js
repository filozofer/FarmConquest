//=================================================
// Farm
//
// Represent a farm building on the map
//=================================================

var Building = require('./building.js');

var Farm = function(){

}

Farm.prototype = new Building();

Farm.prototype.info = function(){
     console.log("farm");
}


//export the object to make it accessible via the require function
module.exports = Farm;
