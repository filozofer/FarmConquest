//=================================================
// Building
//
// Represent a building on the map
//=================================================

// class constructor
var Building = function(){
     this.name = "building";
}

// class methods
Building.prototype = {
     info : function(){
        console.log(this.name);
     }
}

// export the object to make it accessible via the require function
module.exports = Building;