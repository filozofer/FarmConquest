//=================================================
// Farm
//
// Represent a farm building on the map
//=================================================

var Building = require('./building.js');

var Farm = function(){
       this.name = "farm";
}

Farm.prototype = new Building();

//export the object to make it accessible via the require function
module.exports = Farm;
