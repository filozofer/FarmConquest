//=================================================
// Building
//
// Represent a building on the map
//=================================================

var Building = function(){

}

Building.prototype = {
     info : function(){
        console.log("building");
     }
}

//export the object to make it accessible via the require function
module.exports = Building;