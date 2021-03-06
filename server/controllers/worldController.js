
WorldController = function(socket, db, mongoose){

    //Events
    var EventEmitter = require('events').EventEmitter;

    //Models
    var Tile = mongoose.model("Tile");
    var Farmer = mongoose.model("Farmer");
    var Farm = mongoose.model("Farm");
    var WorldInfo = mongoose.model("WorldInfo");
    var ContentTile = mongoose.model("ContentTile");
    var User = mongoose.model("User");
    var Arsenal = mongoose.model("Arsenal");
    var Configuration = require('../config/config');
    var config = new Configuration();

    //Configs
    var self = this;

    /* Events */
    //SOCKET LISTENER
    if (socket != null){
        socket.on('changeWorldCenter', function(newCenter){
            self.sendWorldAtPosition(newCenter, true);
        });
    }

    /* Methods */

    //Call on player register
    this.addNewPlayer = function(user) {

        //Add farmer
        this.addFarmer(user);

        //Add farm
        //this.addFarm(user);
        //Send to client the world (end of addFarm after add in database)

    };

    //Init the world at server start (load from database)
    this.initWorld = function(){
        console.log("Load world...");
        var self = this;
        self.loadWorldCounter = 0;

        //Look for tiles in database
        Tile.find({ X : 0 },function (err, tiles) {
            if (err){throw(err);}

            //If tiles found in database -> Load the world
            if(tiles.length > 0)
            {
                //Init the world
                G.World = new Object();

                //Get all tiles in bdd
                Tile.find({}).exec(function(err, tiles){

                    for(var i = 0; i < tiles.length; i++)
                    {
                        self.loadWorldCounter++;
                        self.addTileToTheWorld(tiles[i]);
                    }

                });
            }
            else
            {
                //Else just init the world by a new Object()
                G.World = new Object();

                WorldInfo.findOne({ infoToUse: 1 },function (err, worldInfo) {

                    if(worldInfo == null)
                    {
                        //init config for world generation farm
                        var worldInfo = new WorldInfo();
                        worldInfo.infoToUse = 1;
                        worldInfo.lastFarmUpLeftX = 0;
                        worldInfo.lastFarmUpLeftY = 0;
                        worldInfo.lastFarmBottomRightX = 0;
                        worldInfo.lastFarmBottomRightY = 0;
                        worldInfo.save();
                    }

                });

                console.log('World Loaded !');
            }
        });
    };

    //Init the market fluctuation (prices of the crops)
    this.initMarketFluctuation = function(){
        setInterval(function(){
            console.log("============== Market Fluctuation ==============");
            var keyName = undefined;
            for(var key in Config.idItems)
            {
                var currentCrop = Config.idItems[key];
                if (currentCrop.id >= 100 && currentCrop.id < 200){
                    var minValue = Config.pricesRange[currentCrop.name].min;
                    var maxValue = Config.pricesRange[currentCrop.name].max;

                    Config.prices[currentCrop.name] = Math.floor(Math.random()*(maxValue-minValue+1)+minValue);
                    console.log(currentCrop.displayed + " : " + Config.prices[currentCrop.name]);
                }
            }
            console.log("================================================");
        }, Config.marketRefreshTime);
    };

    //Add a tile from database in the server world (populate of properties)
    this.addTileToTheWorld = function(tileSend){
        var self = this;

        //Get tile as object (first from mongoose base, second from our schema method)
        var tileTo = tileSend.toObject();
        var tileAsObject = tileSend.getAsObject();

        //Verify if tile as owner set (ObjectId)
        if(tileTo.owner != null && typeof(tileTo.owner._bsontype) == "string")
        {
            //Get owner
            Farmer.findById(tileTo.owner).select('name').exec(function(err, farmer){
                //Set owner
                tileAsObject.owner = farmer.getAsObject();

                //Verify if tile as contentTile set (ObjectId)
                if(tileTo.contentTile != null && typeof(tileTo.contentTile._bsontype) == "string")
                {
                    //Get Content tile (populate work here... I don't know why)
                    ContentTile.findById(tileTo.contentTile).populate("owner locations mainPos").exec(function(err, contentTileDB){

                        if(contentTileDB != null)
                        {
                            //Set contentTile
                            tileAsObject.contentTile = contentTileDB.getAsObject();
                        }
                        else
                        {
                            tileSend.contentTile = undefined;
                            tileSend.save();
                        }

                        //Add to the server world
                        if(G.World[tileTo.X] == undefined){ G.World[tileTo.X] = new Object(); }
                        G.World[tileTo.X][tileTo.Y] = tileAsObject;
                        self.loadWorldCounter--;
                        if(self.loadWorldCounter == 0){ console.log('World Loaded !'); }
                    });
                }
                else
                {
                    //Ifno contentTile, Add to the server world
                    if(G.World[tileTo.X] == undefined){ G.World[tileTo.X] = new Object(); }
                    G.World[tileTo.X][tileTo.Y] = tileAsObject;
                    self.loadWorldCounter--;
                    if(self.loadWorldCounter == 0){ console.log('World Loaded !'); }
                }
            });
        }
        else
        {
            //If no owner, add to the G.World (server world)
            if(G.World[tileTo.X] == undefined){ G.World[tileTo.X] = new Object(); }
            G.World[tileTo.X][tileTo.Y] = tileAsObject;
            self.loadWorldCounter--;
            if(self.loadWorldCounter == 0){ console.log('World Loaded !'); }
        }

    }

    //On register, create farmer
    this.addFarmer = function(user){
        var self = this;
        var farmer = new Farmer();
        farmer.user = user;
        farmer.name = user.username;
        farmer.money = config.initialMoney;
        farmer.level = 1;
        farmer.experiences = 0;
        farmer.bag = new Array();
        farmer.creditFight = 3;
        var arsenal = new Arsenal();
        arsenal.save(function(err){
            farmer.arsenal = arsenal;
            farmer.save(function(err){
                arsenal.farmer = farmer;
                arsenal.save(function(err){});
                self.addFarm(farmer);
            });
        });
    };

    //On register, create farm
    this.addFarm = function(farmer){

        var caseUL = new Object();
        var caseBR = new Object();

        WorldInfo.findOne({ infoToUse: 1 },function (err, worldInfo) {

            caseUL.X = worldInfo.lastFarmUpLeftX;
            caseUL.Y = worldInfo.lastFarmUpLeftY;
            caseBR.X = worldInfo.lastFarmBottomRightX;
            caseBR.Y = worldInfo.lastFarmBottomRightY;

            //Déclaration de boolean qui permettrons de savoir si la dernière ferme ajouter possède des voisins
            //(test pour les 4 directions)
            var up = false, right = false, bottom = false, left = false;

            var newFarm = null;
            //Case world is empty so first farm in the world
            if (caseUL.X==0 && caseBR.Y == 0){
                newFarm = self.generateNewFarm(0,0, farmer);
            }
            else{
                //Ici on fait les 4 tests de voisinage
                up      = (G.World[caseUL.X] != undefined && G.World[caseUL.X][caseUL.Y - 1] != undefined) ? true : false;
                left    = (G.World[caseUL.X - 1] != undefined && G.World[caseUL.X - 1][caseUL.Y] != undefined) ? true : false;
                right   = (G.World[caseBR.X + 1] != undefined && G.World[caseBR.X + 1][caseBR.Y] != undefined) ? true : false;
                bottom  = (G.World[caseBR.X] != undefined && G.World[caseBR.X][caseBR.Y + 1] != undefined) ? true : false;


                //En fonction des voisins on en déduis la position de la prochaine et on demande donc une
                //nouvelle ferme grace à la fonction generateNewFarm() en lui donnant en paramètre les coordonnées
                //de la première case de la nouvelle ferme.
                if((up && !right && !bottom && !left) ||(up && right  && !bottom && !left))
                    newFarm = self.generateNewFarm(caseUL.X - config.farmSize, caseUL.Y, farmer);
                else if((!up && !right && !bottom && left) ||(up  && !right  && !bottom && left))
                    newFarm = self.generateNewFarm(caseUL.X, caseUL.Y + config.farmSize, farmer);
                else if((!up && right && !bottom && !left) || (!up && right && bottom  && !left))
                    newFarm = self.generateNewFarm(caseUL.X, caseUL.Y - config.farmSize, farmer);
                else if((!up && !right && bottom && !left) || (!up && !right && bottom && left))
                    newFarm = self.generateNewFarm(caseUL.X + config.farmSize, caseUL.Y, farmer);
                else
                    newFarm = self.generateNewFarm(caseUL.X + config.farmSize, caseUL.Y, farmer);
            }

            if(newFarm != null)
            {
                //Update configurations for futur add farm in world
                var query = { infoToUse: 1};
                WorldInfo.update(query, { lastFarmUpLeftX: newFarm[0].X }, null, null);
                WorldInfo.update(query, { lastFarmUpLeftY: newFarm[0].Y }, null, null);
                WorldInfo.update(query, { lastFarmBottomRightX: newFarm[config.farmSize * config.farmSize - 1].X }, null, null);
                WorldInfo.update(query, { lastFarmBottomRightY: newFarm[config.farmSize * config.farmSize - 1].Y }, null, null);

            }
        });


    };

    //Generate tiles of a new farm, add in database and in G.World
    //x & y are the coord of the top left tile (the first) of the farm
    this.generateNewFarm = function(x, y, farmer){
        var self = this;
        var newFarmTiles = new Array();
        var farm = new Farm();
        farm.create();
        farm.owner = farmer;
        farm.locations = new Array();
        var locationsTemp = new Array();


        var offset = config.farmSize/2-2;
        //Generate tiles
        for (var i = 0 + x; i < config.farmSize + x; i++)
        {
            for (var j = 0 + y; j < config.farmSize + y; j++)
            {
                var newFarmTile = new Tile();
                newFarmTile.X = i;
                newFarmTile.Y = j;
                newFarmTile.owner = farmer;
                newFarmTile.contentTile = null;
                newFarmTile.setRandomStats();
                newFarmTile.walkable = true;

                //If middle of the farm territory, add building main Farm
                if(i == (x+offset) && j == (y+offset))
                {
                    farm.mainPos = new Tile();
                    farm.mainPos.X = x+offset;
                    farm.mainPos.Y = y+offset;

                    for(var k = 0; k < 2; k++)
                    {
                        for(var l = 0; l < 2; l++)
                        {
                            var farmLoc = new Tile();
                            farmLoc.X = x+offset+k;
                            farmLoc.Y = y+offset+l;
                            locationsTemp.push(farmLoc);
                        }
                    }
                }


                newFarmTiles.push(newFarmTile);
            }
        }

        //Save in database + Add tiles in World
        for(var i = 0; i < newFarmTiles.length; i++)
        {
            var tileF = newFarmTiles[i];
            //Add each tile in database
            tileF.save(function(err, tileDB){
                if (err) { throw err; }
                //Add in world server
                var tileAsObject = tileDB.getAsObject();
                tileAsObject.owner = farmer.getAsObject();
                if(G.World[tileDB.X] == undefined){ G.World[tileDB.X] = new Object(); }
                G.World[tileDB.X][tileDB.Y] = tileAsObject;
            });


            //For the last tile to save, add callback method for continue
            if(i == newFarmTiles.length - 1)
            {
                tileF.save(function(err, tileDB){
                    if (err) { throw err; }
                    //Add in world server
                    var tileAsObject = tileDB.getAsObject();
                    tileAsObject.owner = farmer.getAsObject();
                    if(G.World[tileDB.X] == undefined){ G.World[tileDB.X] = new Object(); }
                    G.World[tileDB.X][tileDB.Y] = tileAsObject;

                    //Save farm in database
                    var l1 = locationsTemp[0];
                    var l2 = locationsTemp[1];
                    var l3 = locationsTemp[2];
                    var l4 = locationsTemp[3];
                    Tile.findOne({X: farm.mainPos.X, Y: farm.mainPos.Y}).exec(function(err, mainPos){
                        Tile.findOne({X: l1.X, Y: l1.Y}).exec(function(err, loc1){
                            Tile.findOne({X: l2.X, Y: l2.Y}).exec(function(err, loc2){
                                Tile.findOne({X: l3.X, Y: l3.Y}).exec(function(err, loc3){
                                    Tile.findOne({X: l4.X, Y: l4.Y}).exec(function(err, loc4){
                                        farm.mainPos = mainPos;
                                        farm.locations = new Array();
                                        farm.locations.push(loc1);
                                        farm.locations.push(loc2);
                                        farm.locations.push(loc3);
                                        farm.locations.push(loc4);
                                        farm.save(function(err, farmDB){
                                            if (err) { throw err; }
                                            //Update farm tiles contentTile
                                            var contentTile = new ContentTile();
                                            contentTile.create("farm", "Ferme", "Batîment principal");
                                            contentTile.mainPos = loc1;
                                            contentTile.locations = new Array();
                                            contentTile.locations.push(loc1);
                                            contentTile.locations.push(loc2);
                                            contentTile.locations.push(loc3);
                                            contentTile.locations.push(loc4);
                                            contentTile.owner = farmer;

                                            contentTile.save(function(err, contentTileDBs){
                                                ContentTile.findById(contentTileDBs._id).populate("owner locations mainPos").exec(function(err, contentTileDB){
                                                    Tile.update({X: loc1.X, Y: loc1.Y}, { contentTile: contentTileDB, walkable: false }, null, function(err){
                                                        Tile.update({X: loc2.X, Y: loc2.Y}, { contentTile: contentTileDB, walkable: false }, null, function(err){
                                                            Tile.update({X: loc3.X, Y: loc3.Y}, { contentTile: contentTileDB, walkable: false }, null, function(err){
                                                                Tile.update({X: loc4.X, Y: loc4.Y}, { contentTile: contentTileDB, walkable: false }, null, function(err){
                                                                    Tile.findOne({X: l1.X, Y: l1.Y}).populate("contentTile.mainPos").exec(function(err, loca1){
                                                                        Tile.findOne({X: l2.X, Y: l2.Y}).populate("contentTile.mainPos").exec(function(err, loca2){
                                                                            Tile.findOne({X: l3.X, Y: l3.Y}).populate("contentTile.mainPos").exec(function(err, loca3){
                                                                                Tile.findOne({X: l4.X, Y: l4.Y}).populate("contentTile.mainPos").exec(function(err, loca4){

                                                                                    var contentTileAsObject = contentTileDB.getAsObject();
                                                                                    var t1 = loca1.getAsObject();
                                                                                    t1.owner = farmer.getAsObject();
                                                                                    t1.contentTile = contentTileAsObject;
                                                                                    var t2 = loca2.getAsObject();
                                                                                    t2.owner = farmer.getAsObject();
                                                                                    t2.contentTile = contentTileAsObject;
                                                                                    var t3 = loca3.getAsObject();
                                                                                    t3.owner = farmer.getAsObject();
                                                                                    t3.contentTile = contentTileAsObject;
                                                                                    var t4 = loca4.getAsObject();
                                                                                    t4.owner = farmer.getAsObject();
                                                                                    t4.contentTile = contentTileAsObject;

                                                                                    G.World[t1.X][t1.Y] = t1;
                                                                                    G.World[t2.X][t2.Y] = t2;
                                                                                    G.World[t3.X][t3.Y] = t3;
                                                                                    G.World[t4.X][t4.Y] = t4;

                                                                                    //Now the farm is save in db we send the map to the client
                                                                                    self.sendWorldToClient(farmer);
                                                                                });
                                                                            });
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            }
            else
            {
                tileF.save();
            }
        }

        return newFarmTiles;
    };

    //Send to client the world
    this.sendWorldToClient = function(farmer){

        //Get main farm position in database
        Farm.findOne({owner: farmer}).populate('mainPos').exec(function(err, farm){
            if(farm != null)
            {
                //Collect world tiles from (-1, -1) chunk to (+1, +1) chunk
                //Chunk: 20x20 (farmSize*farmSize)
                var mainPos = farm.mainPos;

                self.sendWorldAtPosition(mainPos, false);
            }
        });

    };

    this.sendWorldAtPosition = function(mainPos, isRefresh){
         var world = new Object();
         var offset = config.farmSize/2 -2;
         for(var i = mainPos.X - offset - config.farmSize; i < mainPos.X - offset + config.farmSize + config.farmSize; i++)
         {
             for(var j = mainPos.Y - offset - config.farmSize; j < mainPos.Y - offset + config.farmSize + config.farmSize; j++)
             {
                 if(G.World[i] != undefined && G.World[i][j] != undefined)
                 {
                     if(world[i] == undefined){world[i] = new Object();}
                     world[i][j] = G.World[i][j];
                 }
             }
         }

         //Set Center of the world for display
         world.center = new Object();
         world.center.X = mainPos.X;
         world.center.Y = mainPos.Y;

         //World dimensions
         var worldDimension = new Object();
         worldDimension.minX = mainPos.X - offset - config.farmSize;
         worldDimension.minY = mainPos.Y - offset - config.farmSize;
         worldDimension.maxX = mainPos.X - offset + config.farmSize + config.farmSize;
         worldDimension.maxY = mainPos.Y - offset + config.farmSize + config.farmSize;

         //Send to client
         socket.emit('drawMap', {'worldToDraw': world, 'dimension': worldDimension, 'isRefresh': isRefresh});
        if (isRefresh){
            socket.controllers.farmerController.refreshNeighbors();
        }
    };

};

module.exports = WorldController;