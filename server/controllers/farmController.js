/*
 Farm Controller class
 */
require('backbone');
var _ = require('underscore');

FarmController = function(socket, db, mongoose){

    //server-side event listener
    var EventEmitter = require('events').EventEmitter;
    var events = new EventEmitter();

    var self = this;

    var Tile = mongoose.model("Tile");

    var databaseController = null;
    var mapController = null;

    this.Farm   = mongoose.model("Farm");
    var WorldInfo = mongoose.model('WorldInfo');

    var Configuration = require('../config/config');
    var config = new Configuration();

    //Server-side listener
    process.on('newFarm', function(user) {
        console.log("Check New Farm");
        //self.addFarm(user);
        process.emit("checkForFirstFarm", user);
    });

    process.on('addFarm', function(user){
        console.log("Add Farm for " + user.username);
        self.addFarm(user);
    });

    process.on('initDatabaseController', function(controller){
        databaseController = controller;
    });

    process.on('initMapController', function(controller){
        mapController = controller;
    });

    this.addFarm = function(user){

        farm = new this.Farm();
        farm.owner = user;
        farm.save(function(err){
            if (err) {
                throw err;
            }
            else{
                console.log("New Farm created for: " + farm.name);
                self.getNewFarm(user);
            }
            //mongoose.connection.close();
        });

    }

    this.generateNewFarm = function(x, y, user){
        var newFarm = new Array();
        for (i = 0 + x; i < config.farmSize + x; i++)
        {
        	for (j = 0 + y; j < config.farmSize + y; j++)
        	{
        		var newFarmCase = new Tile();
        		newFarmCase.X = i;
                newFarmCase.Y = j;
                newFarmCase.owner = user;
                newFarmCase.contentTile = null;
        		newFarm.push(newFarmCase);
        	}
        }
        return newFarm;
    }

    this.getNewFarm = function(user){

        var caseUL = new Object();
        var caseBR = new Object();
        //récup la taille du monde sur BDD OU param World.isEmpty dans BDD
        WorldInfo.findOne({ infoToUse: 1 },function (err, worldInfo) {
           caseUL.X = worldInfo.lastFarmUpLeftX;
           caseUL.Y = worldInfo.lastFarmUpLeftY;
            caseBR.X = worldInfo.lastFarmBottomRightX;
            caseBR.Y = worldInfo.lastFarmBottomRightY;
            console.log("LAST FARM POSITION DIAGONALE : X:"+caseUL.X+" - Y:"+caseBR.Y);
            //mongoose.connection.close();
            //Déclaration de boolean qui permettrons de savoir si la dernière ferme ajouter possède des voisins
                		//(test pour les 4 directions)
                		var up = false, right = false, bottom = false, left = false;

                		var newFarm = null;
                        if (caseUL.X==0 && caseBR.Y == 0){
                            newFarm = self.generateNewFarm(0,0, user);
                        }
                        else{
                        //Ici on fait les 4 tests de voisinage
                		up = (mapController.findTileAtPosition(caseUL.X, caseUL.Y - 1) != null) ? true : false;
                		left = (mapController.findTileAtPosition(caseUL.X -1, caseUL.Y) != null) ? true : false;
                		right = (mapController.findTileAtPosition(caseBR.X +1, caseBR.Y) != null) ? true : false;
                		bottom = (mapController.findTileAtPosition(caseBR.X, caseBR.Y +1) != null) ? true : false;


                		//En fonction des voisins on en déduis la position de la prochaine et on demande donc une
                		//nouvelle ferme grace à la fonction generateNewFarm() en lui donnant en paramètre les coordonnées
                		//de la première case de la nouvelle ferme.
                		if((up && !right && !bottom && !left) ||(up && right  && !bottom && !left))
                			newFarm = self.generateNewFarm(caseUL.X - config.farmSize, caseUL.Y, user);
                		else if((!up && !right && !bottom && left) ||(up  && !right  && !bottom && left))
                			newFarm = self.generateNewFarm(caseUL.X, caseUL.Y + config.farmSize, user);
                		else if((!up && right && !bottom && !left) || (!up && right && bottom  && !left))
                			newFarm = self.generateNewFarm(caseUL.X, caseUL.Y - config.farmSize, user);
                		else if((!up && !right && bottom && !left) || (!up && !right && bottom && left))
                			newFarm = self.generateNewFarm(caseUL.X + config.farmSize, caseUL.Y, user);
                		else
                			newFarm = self.generateNewFarm(caseUL.X + config.farmSize, caseUL.Y, user);
                        }

                		if(newFarm != null)
                		{
                		    console.log(newFarm);
                			//Même chose que pour la première fois (en gros on ajoute la ferme dans le world)
                			_.each(newFarm, function(caseFarm){
                				//add each new tile in db

                                caseFarm.save();
                			});

                			var query = { infoToUse: 1};
                            WorldInfo.update(query, { lastFarmUpLeftX: newFarm[0].X }, null, null);
                            WorldInfo.update(query, { lastFarmUpLeftY: newFarm[0].Y }, null, null);
                            WorldInfo.update(query, { lastFarmBottomRightX: newFarm[config.farmSize * config.farmSize - 1].X }, null, null);
                            WorldInfo.update(query, { lastFarmBottomRightY: newFarm[config.farmSize * config.farmSize - 1].Y }, null, null);

                			//databaseController.updateField(WorldInfo, 'lastFarmUpLeftX', newFarm[0].X, { infoToUse: 1});
                			//databaseController.updateField(WorldInfo, 'lastFarmUpLeftY', newFarm[0].Y, { infoToUse: 1});
                			//databaseController.updateField(WorldInfo, 'lastFarmBottomRightX',  newFarm[config.farmSize * config.farmSize - 1].X, { infoToUse: 1});
                			//databaseController.updateField(WorldInfo, 'lastFarmBottomRightY',  newFarm[config.farmSize * config.farmSize - 1].Y, { infoToUse: 1});
                		}
        });


    }

};

module.exports = FarmController;




