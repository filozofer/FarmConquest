/*
 Farmer Controller class
 */
var ShortestPath = require("../lib/shortestPath");

FarmerController = function(socket, db, mongoose){
    //server-side event listener
    var EventEmitter = require('events').EventEmitter;

    var databaseController = null;

    var self = this;

    //var FarmController = require('./FarmController');
    //var farmController = new FarmController(socket, db, mongoose);

    this.FarmerModel = mongoose.model("Farmer");

    this.addFarmer = function(user){
        farmer = new this.FarmerModel();
        farmer.user = user;
        farmer.name = user.username;
        farmer.save(function(err){
            if (err) {
                throw err;
            }
            else{
                console.log("New Farmer registered: " + farmer.name);
            }
        });
        //NEW FARM - FARMCONTROLLER
        //TODO: Fix it in farmerController:
        process.emit('newFarm', user);
    }

    this.getFarmer = function(user){
        var result = null;
        self.FarmerModel.findOne({ name : user.username },function (err, farmer) {
            if (err){throw(err);}

            if(farmer != null) {
                result = farmer
            }
        });
        return result;
    }

    //Server-side listener
    process.on('addFarmer', function(User) {
        console.log("create Farmer for " + User.username);
        self.addFarmer(User);
    });

    process.on('initDatabaseController', function(controller){
        databaseController = controller;
    });

    //Models
    socket.on('getFarmer', function(){
        if(!socket.sessions.loadFarmerOnce){
            //GET FARMER POSITION
            var farmerPosition = new Object();
            farmerPosition.X = 3;
            farmerPosition.Y = 5;
            socket.emit('farmerPosition', {'position': farmerPosition});
            socket.sessions.loadFarmerOnce = true;
        }
    });

    socket.on('calculatePath', function(resp){

        var world = resp.world;
        var start = resp.start;
        var finish = resp.finish;

        //TEMP - WORLD GENERATION
        var pathManager = new ShortestPath(world, start, finish);
        var path = pathManager.shortestPath;

        socket.emit('farmerPath', {'path': path});
    });

};

module.exports = FarmerController;




