// -----------------------------------------------------------
//
// class        : FarmingController
// description  : Server interaction with tiles' farming
//
// -----------------------------------------------------------

var ContentTileFactory = require('../factory/contentTileFactory');

FarmingController = function(socket, db, mongoose){

    var farmingActions = ["arrosage","fertilisation", null, null, "conquest"];
    var Farmer = mongoose.model("Farmer");
    var Building = mongoose.model("Building");
    var Tile = mongoose.model("Tile");
    var ContentTile = mongoose.model("ContentTile");
    var ItemBag = mongoose.model("ItemBag");
    var contentTileFactory = new ContentTileFactory(mongoose, socket.sessions.farmer);

    socket.on('doFarmingAction', function(resp){
        var index = resp.index;
        var tile = resp.tile;
        var action = farmingActions[index];
        var query = { X: tile.X, Y: tile.Y };
        switch(action){
            case "arrosage" :
                if(tile.humidity < 10) {
                    tile.humidity++;
                     socket.sessions.farmer.money -= Config.waterPrice;
                    //UPDATE INFOS
                     Tile.update(query, { humidity: tile.humidity }, null, null);
                     G.World[tile.X][tile.Y].humidity = tile.humidity;
                }
                break;

            case "fertilisation" :
                if(tile.fertility < 10) {
                    tile.fertility++;
                    socket.sessions.farmer.money -= Config.fertilizerPrice;
                    //UPDATE INFOS
                    Tile.update(query, { fertility: tile.fertility }, null, null);
                     G.World[tile.X][tile.Y].humidity = tile.fertility;
                }
                break;

            case "conquest":
                if(tile.owner.name != socket.sessions.farmer.name)
                {
                    if(tile.contentTile == undefined || (tile.contentTile != undefined && tile.contentTile.type != Config.tileType.farm))
                    {
                        if(socket.sessions.farmer.creditConquest > 0)
                        {
                            //Test for tile to conquest is near from one other own tile
                            if(isNearFromOwnTile(tile.X, tile.Y))
                            {
                                socket.sessions.farmer.creditConquest -= 1;
                                tile.owner = socket.sessions.farmer.mongooseObject;
                                Farmer.findByIdAndUpdate(socket.sessions.farmer._id, { creditConquest : socket.sessions.farmer.creditConquest}, function(err, farmerDB){

                                    var isBuilding = false;
                                    var type = (tile.contentTile != undefined) ? tile.contentTile.type : null;
                                    if(type == Config.tileType.grangeP || type == Config.tileType.grangeM || type == Config.tileType.grangeG)
                                        isBuilding = true;

                                    if(!isBuilding)
                                    {
                                        G.World[tile.X][tile.Y].owner = farmerDB.getAsObject();
                                        Tile.update(query, { owner: farmerDB}, function(){});
                                    }
                                    else
                                    {
                                        //TODO Building
                                    }
                                });
                            }
                        }
                    }
                }
                break;

            default:
                break;
        }

        var farmerQuery = { name: socket.sessions.farmer.name };
        if(socket.sessions.farmer.creditConquest == undefined) { socket.sessions.farmer.creditConquest = 0; }
        Farmer.update(farmerQuery, { money: socket.sessions.farmer.money, creditConquest: socket.sessions.farmer.creditConquest }, null, null);

        socket.emit("beginWork", {tile: tile, money: socket.sessions.farmer.money, action: action, creditConquest: socket.sessions.farmer.creditConquest});

        var sockets = getSocketByFarmerPosition(socket.sessions.farmer.X, socket.sessions.farmer.Y);
        for (var i=0; i<sockets.length; i++){
            var currentSocket = sockets[i];
            currentSocket.emit("ennemyBeginWork", {tile: tile, action: action});
        }

        setTimeout(function(){
            socket.emit("finishWork", {tile: tile});
            for (var i=0; i<sockets.length; i++){
                var currentSocket = sockets[i];
                currentSocket.emit("ennemyFinishWork", {tile: tile});
            }
        }, Config.workingTime);
    });

    socket.on('BuildOrSeed', function(resp){
        var tile = undefined;
        var idItem = resp.idItem;
        var action = resp.action;
        var farmerDB = undefined;

        Farmer.findById(socket.sessions.farmer._id).populate("bag").exec(function(err, farmerWithBag){
            farmerDB = farmerWithBag;
            socket.sessions.farmer = farmerWithBag.getAsObject();
            var bag = socket.sessions.farmer.bag;
            var item = undefined;
            for(var i=0; i<bag.length; i++){
                var bagItem = bag[i];
                if (bagItem.idItem == idItem){
                    bagItem.quantity --;
                    item = bagItem;
                    if (item.quantity <= 0){
                        bag.splice(i, 1);
                        ItemBag.remove({_id: item._id}, function(){});
                    }
                    else {
                        ItemBag.update({_id: item._id}, {quantity: item.quantity}, null, null);
                    }
                    break;
                }
            }

        if (item != undefined){
            socket.emit('BOARD-refreshBag', bag);

            if (action == Config.actionType.seed){

                Tile.findOne({ X : resp.tile.X, Y : resp.tile.Y },function (err, tileToTake) {
                    if (err){throw(err);}

                    if(tileToTake != null) {
                        tile = tileToTake.getAsObject();
                    }

                       var contentTile = contentTileFactory.getContentTile(idItem, tile);
                    contentTile.save(function(err){
                        tileToTake.contentTile = contentTile;
                        var contentT = contentTile.getAsObject();
                        tile.contentTile = contentT;
                        tile.owner = socket.sessions.farmer;
                        G.World[tile.X][tile.Y] = tile;
                        tileToTake.save(function(err){
                            socket.emit('doPlantSeed', tile);

                            var sockets0 = getSocketByFarmerPosition(socket.sessions.farmer.X, socket.sessions.farmer.Y);
                            setTimeout(function(){
                                socket.emit("finishPlant");
                            }, Config.workingTime);
                            for (var i=0; i<sockets0.length; i++){
                                var currentSocket = sockets0[i];
                                currentSocket.emit("ennemyBeginWork", {tile: tile, action: undefined});
                            }

                            generatePlantEvolution(tile, tileToTake, contentTile);

                            //
                        });
                    });


                });
            }
            else if (action == Config.actionType.build){
                Tile.findOne({ X : resp.tile.X, Y : resp.tile.Y },function (err, tileToTake) {
                    if (err){throw(err);}

                    if(tileToTake != null) {
                        tile = tileToTake.getAsObject();
                    }

                    var contentTileMainPos = contentTileFactory.getContentTile(idItem, tileToTake);
                    contentTileMainPos.owner = farmerDB;

                    var request1 = [{X: tile.X, Y: tile.Y}];

                    var request4 = [{X: tile.X, Y: tile.Y},
                    				{X: tile.X+1, Y: tile.Y},
                    				{X: tile.X, Y: tile.Y+1},
                    				{X: tile.X+1, Y: tile.Y+1}];

                    var request6 = [{X: tile.X, Y: tile.Y},
                    				{X: tile.X+1, Y: tile.Y},
                    				{X: tile.X, Y: tile.Y+1},
                    				{X: tile.X+1, Y: tile.Y+1},
                    				{X: tile.X, Y: tile.Y+2},
                                    {X: tile.X+1, Y: tile.Y+2}];

                    var request = undefined;

                    var building = new Building();
                    var buildingClient = new Object();
                    building.create();
                    buildingClient.owner = socket.sessions.farmer;
                    building.owner = farmerDB;
                    building.mainPos = tileToTake;

                    buildingClient.locations = new Array();
                    var tempLocation = new Array();



                    if (contentTileMainPos.size == 1){
                        request = request1;
                    }
                    else if (contentTileMainPos.size == 4){
                        //CHECK IF the three neigbors tile are free and own to the farmer
                        /*
                            check with G.World
                            tile1 -> X+1
                            tile2 -> X+1, Y+1
                            tile3 -> Y+1
                        */
                        if (G.World[tile.X+1][tile.Y].contentTile == undefined && G.World[tile.X+1][tile.Y].owner.name == socket.sessions.farmer.name && G.World[tile.X+1][tile.Y].walkable
                         && G.World[tile.X+1][tile.Y+1].contentTile == undefined && G.World[tile.X+1][tile.Y+1].owner.name == socket.sessions.farmer.name && G.World[tile.X+1][tile.Y+1].walkable
                         && G.World[tile.X][tile.Y+1].contentTile == undefined && G.World[tile.X][tile.Y+1].owner.name == socket.sessions.farmer.name && G.World[tile.X][tile.Y+1].walkable){
                            request = request4;
                         }
                    }
                    else if (contentTileMainPos.size == 6){
                        //CHECK IF the five neigbors tile are free and own to the farmer
                        /*
                            check with G.World
                            tile1 -> X+1
                            tile2 -> X+1, Y+1
                            tile3 -> Y+1
                            tile4 -> X+2, Y+1
                            tile5 -> X+2
                        */
                        if (G.World[tile.X+1][tile.Y].contentTile == undefined && G.World[tile.X+1][tile.Y].owner.name == socket.sessions.farmer.name && G.World[tile.X+1][tile.Y].walkable
                         && G.World[tile.X+1][tile.Y+1].contentTile == undefined && G.World[tile.X+1][tile.Y+1].owner.name == socket.sessions.farmer.name && G.World[tile.X+1][tile.Y+1].walkable
                         && G.World[tile.X][tile.Y+1].contentTile == undefined && G.World[tile.X][tile.Y+1].owner.name == socket.sessions.farmer.name && G.World[tile.X][tile.Y+1].walkable
                         && G.World[tile.X][tile.Y+2].contentTile == undefined && G.World[tile.X][tile.Y+2].owner.name == socket.sessions.farmer.name && G.World[tile.X][tile.Y+2].walkable
                         && G.World[tile.X+1][tile.Y+2].contentTile == undefined && G.World[tile.X+1][tile.Y+2].owner.name == socket.sessions.farmer.name && G.World[tile.X+1][tile.Y+2].walkable){
                            request = request6;
                         }
                    }

                    Tile.find({}).or(request).exec(function(err, tiles){
                    	//go through tiles result
                    	for (var i=0; i<tiles.length; i++){

                    	    var lastOne = false;
                    	    if (i == tiles.length -1){
                    	        lastOne = true;
                    	    }

                    		var currentTile = tiles[i];

                            currentTile.owner = farmerDB;
                    		currentTile.walkable = false;
                    		currentTile.save(function(err, currentT){

                    		        var contentTile = contentTileFactory.getContentTile(idItem, tile);
                                    contentTile.owner = farmerDB;

                                    contentTile.save(function(err, content){

                    		            currentT.contentTile = content;


                    		            currentT.save(function(err, curTile){

                                            var curTileObject = curTile.getAsObject();

                                            curTileObject.contentTile = content.getAsObject();

                                            ContentTile.findById(curTileObject.contentTile).populate("owner locations mainPos").exec(function(err, contentTileDB){
                                                //Set contentTile
                                                curTileObject.contentTile = contentTileDB.getAsObject();

                                                //Add to the server world
                                                if(G.World[curTileObject.X] == undefined){ G.World[curTileObject.X] = new Object(); }
                                                G.World[curTileObject.X][curTileObject.Y] = curTileObject;
                                            });



                                            if(curTileObject.X == resp.tile.X && curTileObject.Y == resp.tile.Y){
                                                buildingClient.mainPos = curTileObject;
                                            }

                    		                building.locations.push(curTile);
                    		                buildingClient.locations.push(curTileObject);
                    		                if (buildingClient.locations.length == contentTileMainPos.size){
                    		                        building.save(function(err, buildingServer){
                                                        socket.emit('FARMING-makeBuilding', buildingClient);

                                                        var sockets = getSocketByFarmerPosition(socket.sessions.farmer.X, socket.sessions.farmer.Y);
                                                        setTimeout(function(){
                                                            socket.emit("finishPlant");
                                                        }, Config.buildingTime);
                                                        for (var i=0; i<sockets.length; i++){
                                                            var currentSocket = sockets[i];
                                                            currentSocket.emit("FARMING-ennemyBuilding", buildingClient);
                                                        }
                                                    });

                    		                }
                    		            });
                                    });
                            });
                    	}

                    });

                });


                //if number of tile available -> build
                    // send anim to other player

                //else
                    // message "No place to build the storage"
            }
        }

        });
    });

    socket.on('harvestSeed', function(resp){

        var keyName = undefined;
        var idCrop = resp.contentTile.idItem + 100;

        if (resp.owner.name == socket.sessions.farmer.name && resp.contentTile.state >= 2){

            for(var key in Config.idItems)
            {
                if(Config.idItems[key].id == idCrop)
                {
                    keyName = Config.idItems[key].name;
                    break;
                }
            }

            if (keyName != undefined)
            {
                ContentTile.findOne({_id: resp.contentTile._id}, function(err, contentInDb){
                    if (err){throw(err);}

                    var contentTile = undefined;
                    if(contentInDb != null) {
                        contentTile = contentInDb.getAsObject();

                        //Add the new item buy to the bag of the farmer
                        Farmer.findById(socket.sessions.farmer._id).populate("bag").exec(function(err, farmerWithBag){
                            socket.sessions.farmer = farmerWithBag.getAsObject();
                            var bag = socket.sessions.farmer.bag;
                            var nbItemToAdd = contentTile.productivity;

                            addCropInBag(idCrop, keyName, bag, nbItemToAdd, contentInDb, resp);
                        });
                    }
                });
            }
        } else
        {
            socket.emit("FARMING-harvestFordbidden");
        }
    });

    var addCropInBag = function(id, keyName, bag, nbItemToAdd, contentInDb, tileClient){

        var alreadyInBag = undefined;
        var firstEmptyPoche = undefined;

        //Looking for empty place in bag or item already in bag
        for(var i = 0; i < 10; i++)
        {
            if(bag[i] == undefined && firstEmptyPoche == undefined)
            {
                firstEmptyPoche = i;
            }
            else if(bag[i] != undefined)
            {
                if(bag[i].idItem == id && bag[i].quantity < Config.maxItemByCellBag)
                {
                    alreadyInBag = i;
                }
            }
        }

        //If item not in bag
        if(alreadyInBag == undefined)
        {
            //And empty place in bag
            if(firstEmptyPoche != undefined)
            {
                //Create new ItemBag
                var itemBag = new ItemBag();
                itemBag.name = Config.idItems[keyName].displayed;
                itemBag.quantity = nbItemToAdd;
                itemBag.positionInBag = firstEmptyPoche;
                itemBag.idItem = id;
                itemBag.canBeSold = true;

                //Save in database the new ItemBag
                itemBag.save(function(err, itemBagDB){

                    //Push the new item in the bag of the farmer
                    //Save the modification in database, keep in sessions and send to client
                    socket.sessions.farmer.mongooseObject.bag.push(itemBagDB);
                    socket.sessions.farmer.mongooseObject.save(function(err, farmerDB){
                        Farmer.findById(farmerDB).populate("bag").exec(function(err, farmerWithBag){
                            socket.sessions.farmer = farmerWithBag.getAsObject();
                            contentInDb.remove();
                            tileClient.contentTile = undefined;
                            G.World[tileClient.X][tileClient.Y] = tileClient;
                            Tile.findOne({X: tileClient.X, Y:tileClient.Y}, function(err, tileToEdit){
                                tileToEdit.contentTile = undefined;
                                tileToEdit.save();

                                //Clear timer for the crop
                                clearTimeout(G.Timeout[tileToEdit.X][tileToEdit.Y].growStateTimeOut);
                                clearTimeout(G.Timeout[tileToEdit.X][tileToEdit.Y].doneStateTimeOut);
                                clearTimeout(G.Timeout[tileToEdit.X][tileToEdit.Y].deathStateTimeOut);
                                clearTimeout(G.Timeout[tileToEdit.X][tileToEdit.Y].dyingStateTimeOut);

                            });
                            socket.emit('BOARD-refreshBag', socket.sessions.farmer.bag);
                            var sockets = getSocketByPlantPosition(tileClient.X, tileClient.Y);
                            for (var i=0; i<sockets.length; i++){
                                var currentSocket = sockets[i];
                                currentSocket.emit("FARMING-HarvestDone", tileClient);
                            }
                        });
                    });
                });
            }
            else
            {
                //If not empty place, send to client the bag is full (for notification)
                socket.emit('BOARD-bagFull');
            }
        }
        else
        {
            var newQuantity = bag[alreadyInBag].quantity + nbItemToAdd;
            var surplus = undefined;
            if(newQuantity > Config.maxItemByCellBag)
            {
                surplus = newQuantity - Config.maxItemByCellBag;
                newQuantity = Config.maxItemByCellBag;
            }

            //If item already exist in the bag we update the quantity of the item (add nbItemToAdd)
            //Get the farmer after update of the bag and money
            //Keep in session and send to client
            ItemBag.update({_id: bag[alreadyInBag]._id}, {quantity: newQuantity}, function(err, itemBag){

                //Decrease money of the farmer
                socket.sessions.farmer.mongooseObject.save(function(err, farmerDB){

                    //Verifications surplus exist
                    if(surplus != undefined)
                    {
                        //If surplus detected we try to place in an empty cell of bag this surplus
                        if(firstEmptyPoche != undefined)
                        {
                            //Create new ItemBag
                            var itemBag = new ItemBag();
                            itemBag.name = Config.idItems[keyName].name;
                            itemBag.quantity = nbItemToAdd;
                            itemBag.positionInBag = firstEmptyPoche;
                            itemBag.idItem = id;
                            itemBag.canBeSold = true;

                            //Save in database the new ItemBag
                            itemBag.save(function(err, itemBagDB){

                                //Push the new item in the bag of the farmer
                                //Save the modification in database, keep in sessions and send to client
                                socket.sessions.farmer.mongooseObject.bag.push(itemBagDB);
                                socket.sessions.farmer.mongooseObject.save(function(err, farmerDB){
                                    Farmer.findById(farmerDB).populate("bag").exec(function(err, farmerWithBag){
                                        socket.sessions.farmer = farmerWithBag.getAsObject();
                                        contentInDb.remove();
                                        tileClient.contentTile = undefined;
                                        G.World[tileClient.X][tileClient.Y] = tileClient;
                                        Tile.findOne({X: tileClient.X, Y:tileClient.Y}, function(err, tileToEdit){
                                            tileToEdit.contentTile = undefined;
                                            tileToEdit.save();

                                            //Clear timer for the crop
                                            clearTimeout(G.Timeout[tileToEdit.X][tileToEdit.Y].growStateTimeOut);
                                            clearTimeout(G.Timeout[tileToEdit.X][tileToEdit.Y].doneStateTimeOut);
                                            clearTimeout(G.Timeout[tileToEdit.X][tileToEdit.Y].deathStateTimeOut);
                                            clearTimeout(G.Timeout[tileToEdit.X][tileToEdit.Y].dyingStateTimeOut);

                                        });
                                        socket.emit('BOARD-refreshBag', socket.sessions.farmer.bag);
                                        var sockets = getSocketByPlantPosition(tileClient.X, tileClient.Y);
                                        for (var i=0; i<sockets.length; i++){
                                            var currentSocket = sockets[i];
                                            currentSocket.emit("FARMING-HarvestDone", tileClient);
                                        }
                                    });
                                });
                            });
                        }
                        else
                        {
                            //If not empty place, send to client the bag is full (for notification)
                            socket.emit('BOARD-bagFull');
                        }
                    }
                    else
                    {
                        //Case no surplus, we send the farmer updated to the client
                        Farmer.findById(farmerDB).populate("bag").exec(function(err, farmerWithBag){
                            socket.sessions.farmer = farmerWithBag.getAsObject();
                            contentInDb.remove();
                            tileClient.contentTile = undefined;
                            G.World[tileClient.X][tileClient.Y] = tileClient;
                            Tile.findOne({X: tileClient.X, Y:tileClient.Y}, function(err, tileToEdit){
                                tileToEdit.contentTile = undefined;
                                tileToEdit.save();

                                //Clear timer for the crop
                                clearTimeout(G.Timeout[tileToEdit.X][tileToEdit.Y].growStateTimeOut);
                                clearTimeout(G.Timeout[tileToEdit.X][tileToEdit.Y].doneStateTimeOut);
                                clearTimeout(G.Timeout[tileToEdit.X][tileToEdit.Y].deathStateTimeOut);
                                clearTimeout(G.Timeout[tileToEdit.X][tileToEdit.Y].dyingStateTimeOut);

                            });
                            socket.emit('BOARD-refreshBag', socket.sessions.farmer.bag);
                            var sockets = getSocketByPlantPosition(tileClient.X, tileClient.Y);
                            for (var i=0; i<sockets.length; i++){
                                var currentSocket = sockets[i];
                                currentSocket.emit("FARMING-HarvestDone", tileClient);
                            }
                        });
                    }
                });
            });
        }
    };

    var getSocketByFarmerPosition = function(X, Y){
        var socketsToUse = new Array();
        var minX = X - Config.communicationRadius;
        var maxX = X + Config.communicationRadius;
        var minY = Y - Config.communicationRadius;
        var maxY = Y + Config.communicationRadius;
        for (var i=0; i<userSockets.length; i++){
            var currentSocket = userSockets[i];
            var currentFarmer = currentSocket.sessions.farmer;
            if (currentFarmer != undefined){
                //if current socket farmer position in the radius of communication of the speaker, save his socket
                if ((currentFarmer.X >= minX && currentFarmer.X <= maxX) && (currentFarmer.Y >= minY && currentFarmer.Y <= maxY) && (currentSocket.sessions.user.username != socket.sessions.user.username)){
                    socketsToUse.push(currentSocket);
                }
            }
        }
        return socketsToUse;
    }

    var generatePlantEvolution = function(tile, tileToTake, contentTile){

        if(G.Timeout[tile.X] == undefined)
            G.Timeout[tile.X] = new Object();
        if(G.Timeout[tile.X][tile.Y] == undefined)
            G.Timeout[tile.X][tile.Y] = new Object();


        //Grow state
        G.Timeout[tile.X][tile.Y].growStateTimeOut = setTimeout(function(){

            G.World[tile.X][tile.Y].contentTile.state = 1;

            Tile.findOne({X: tile.X, Y: tile.Y}, function(err, tileDB){
                ContentTile.update({ mainPos: tileDB }, { state: 1 }, function(){});
            });

            var sockets1 = getSocketByPlantPosition(tile.X, tile.Y);
            for (var i=0; i<sockets1.length; i++){
                var currentSocket = sockets1[i];
                currentSocket.emit("seedGrowing", G.World[tile.X][tile.Y]);
            }
        }, (tile.contentTile.maturationTime / 2));

        //Done State
        G.Timeout[tile.X][tile.Y].doneStateTimeOut = setTimeout(function(){

            G.World[tile.X][tile.Y].contentTile.state = 2;

            Tile.findOne({X: tile.X, Y: tile.Y}, function(err, tileDB){
                ContentTile.update({ mainPos: tileDB }, { state: 2 }, function(){});
            });

            var sockets2 = getSocketByPlantPosition(tile.X, tile.Y);
            for (var i=0; i<sockets2.length; i++){
                var currentSocket = sockets2[i];
                currentSocket.emit("seedGrowing", G.World[tile.X][tile.Y]);
            }
        }, (tile.contentTile.maturationTime));

        var deathTime  = tile.contentTile.deathTime;
        //End of life state
        G.Timeout[tile.X][tile.Y].deathStateTimeOut = setTimeout(function(){

            G.World[tile.X][tile.Y].contentTile.state = 3;

            Tile.findOne({X: tile.X, Y: tile.Y}, function(err, tileDB){
                ContentTile.update({ mainPos: tileDB }, { state: 3 }, function(){});
            });

            var sockets3 = getSocketByPlantPosition(tile.X, tile.Y);
            for (var i=0; i<sockets3.length; i++){
               var currentSocket = sockets3[i];
                currentSocket.emit("seedGoingToDie", G.World[tile.X][tile.Y]);
            }
        }, ((deathTime / 3)*2));

        //Dying state
        G.Timeout[tile.X][tile.Y].dyingStateTimeOut = setTimeout(function(){

            Tile.findOne({X: tile.X, Y: tile.Y}, function(err, tileDB){
                ContentTile.findOneAndRemove({ mainPos: tileDB }, function(){});
            });
            G.World[tile.X][tile.Y].contentTile = undefined;

            var sockets4 = getSocketByPlantPosition(tile.X, tile.Y);
            for (var i=0; i<sockets4.length; i++){
                var currentSocket = sockets4[i];
                currentSocket.emit("seedDie", G.World[tile.X][tile.Y]);
            }
        }, deathTime);
    }

    var getSocketByPlantPosition = function(X, Y){
        var socketsToUse = new Array();
        var minX = X - Config.communicationRadius;
        var maxX = X + Config.communicationRadius;
        var minY = Y - Config.communicationRadius;
        var maxY = Y + Config.communicationRadius;
        for (var i=0; i<userSockets.length; i++){
            var currentSocket = userSockets[i];
            var currentFarmer = currentSocket.sessions.farmer;
            if (currentFarmer != undefined){
                //if current socket farmer position in the radius of communication of the speaker, save his socket
                if ((currentFarmer.X >= minX && currentFarmer.X <= maxX) && (currentFarmer.Y >= minY && currentFarmer.Y <= maxY)){
                    socketsToUse.push(currentSocket);
                }
            }
        }
        return socketsToUse;
    }

    /*
     *  Description: Tell if the tile at X,Y his near of one owned tile
     *  Params: X: Number -> coord X of the tile to test , Y: Number -> coord Y of the tile to test
     *  Return: isNear (Boolean)
     */
    var isNearFromOwnTile = function(X, Y){

        //Get the name of the current player
        var name = socket.sessions.farmer.name;

        //Tell if the tile to conquest is near an owned tile
        var isNear = false;

        //Test for the 4 adjacents tiles
        if(G.World[X-1] != undefined && G.World[X-1][Y] != undefined && G.World[X-1][Y].owner.name == name)
            isNear = true;

        if(G.World[X-1] != undefined && G.World[X-1][Y-1] != undefined && G.World[X-1][Y-1].owner.name == name)
            isNear = true;

        if(G.World[X] != undefined && G.World[X][Y+1] != undefined && G.World[X][Y+1].owner.name == name)
            isNear = true;

        if(G.World[X+1] != undefined && G.World[X+1][Y+1] != undefined && G.World[X+1][Y+1].owner.name == name)
            isNear = true;

        //Return the result (Boolean)
        return isNear;
    }

};

module.exports = FarmingController;
