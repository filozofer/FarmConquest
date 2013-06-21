
/*
 Game Controller class
 */


GameController = function(socket, db, mongoose){

    var Farmer = mongoose.model("Farmer");
    var ItemBag = mongoose.model("ItemBag");
    var Tile = mongoose.model("Tile");
    var Building = mongoose.model("Building");

    socket.on('GAME-itemBagDelete', function(idBag){
        Farmer.findById(socket.sessions.farmer._id).populate("bag").exec(function(err, farmer){

            //Get itemBag to remove
            var itemBag = undefined;
            for(var i = 0; i < farmer.bag.length; i++)
            {
                if(farmer.bag[i].positionInBag == idBag)
                {
                    itemBag = farmer.bag[i];
                }
            }
            //Remove from farmer

            ItemBag.remove({ _id: itemBag._id}, function(){});
            farmer.bag.pull(itemBag._id);

            //Save change in database
            farmer.save(function(err){
                socket.sessions.farmer = farmer.getAsObject();
            });
        });
    });

    socket.on('GAME-changePlaceItemBag', function(request){

        var posStart = request.idBag;
        var posEnd = request.newPos;
        var containerStart = request.containerStart;
        var containerEnd = request.containerEnd;


        if(containerStart == "bag" && containerEnd == "bag")
        {
            Farmer.findById(socket.sessions.farmer._id).populate("bag").exec(function(err, farmer){

                //Get itemBag to move and detect if cell end is not empty
                var itemBag = undefined;
                var newPosEmpty = true;
                for(var i = 0; i < farmer.bag.length; i++)
                {
                    if(farmer.bag[i].positionInBag == posStart)
                    {
                        itemBag = i;
                    }
                    if(farmer.bag[i].positionInBag == posEnd)
                    {
                        newPosEmpty = false;
                    }
                }

                if(farmer.bag[newPosEmpty] != undefined && farmer.bag[newPosEmpty].idItem == farmer.bag[itemBag].idItem)
                {
                    //TODO: Put carotte on carotte
                }

                if(newPosEmpty && itemBag != undefined)
                {
                    farmer.bag[itemBag].positionInBag = posEnd;
                    farmer.bag[itemBag].save(function(err, itemBagDB){
                        socket.sessions.farmer = farmer.getAsObject();
                        //Send farmer to client for update bag view
                        //Use of BOARD-itemBuyComplete because it do what we need
                        socket.emit('BOARD-itemBuyComplete', socket.sessions.farmer);
                    });
                }
            });
        }
        else if(containerStart == "bag" && containerEnd == "building")
        {
            //Find bag and building
            Farmer.findById(socket.sessions.farmer._id).populate("bag").exec(function(err, farmer){
                Tile.findOne({X: request.containerEndPos.X, Y: request.containerEndPos.Y }, function(err, mainPosDB){
                    Building.findOne({ mainPos: mainPosDB }).populate("items").exec(function(err, building){

                        //Get Item Bag to move
                        var itemBag = undefined;
                        for(var i = 0; i < farmer.bag.length; i++)
                        {
                            if(farmer.bag[i].positionInBag == posStart)
                            {
                                itemBag = i;
                            }
                        }

                        //Get pos end in building
                        var newPosEmpty = true;
                        for(var i = 0; i < building.items.length; i++)
                        {
                            if(building.items[i].positionInBag == posEnd)
                            {
                                if(building.items[i].idItem != undefined && building.items[i].idItem == farmer.bag[itemBag].idItem)
                                {
                                    newPosEmpty = false;//TODO
                                }
                                else
                                {
                                    newPosEmpty = false;
                                }
                            }
                        }

                        //If found in bag and place choose is empty
                        if(newPosEmpty && itemBag != undefined)
                        {
                            //Pull out the ItemBag of the bag
                            var itemBagToMove = farmer.bag[itemBag];
                            farmer.bag.pull({ _id: farmer.bag[itemBag]._id});
                            farmer.save(function(err, farmerDB){
                                Farmer.findById(farmerDB).populate("bag").exec(function(err, farmerWithBag){
                                    //Change the position of the ItemBag
                                    itemBagToMove.positionInBag = posEnd;
                                    itemBagToMove.save(function(err, itemBagDB){
                                        //Add the ItemBag in the items list of the building
                                        building.items.push(itemBagDB);
                                        building.save(function(err, buildingDB){
                                            socket.sessions.farmer = farmerWithBag.getAsObject();
                                            //Send farmer to client for update bag view
                                            //Use of BOARD-itemBuyComplete because it do what we need
                                            socket.emit('BOARD-itemBuyComplete', socket.sessions.farmer);
                                        });
                                    });
                                });
                            });
                        }
                    });
                });
            });
        }
        else if(containerStart == "building" && containerEnd == "bag")
        {
            //Find bag and building
            Farmer.findById(socket.sessions.farmer._id).populate("bag").exec(function(err, farmer){
                Tile.findOne({X: request.containerStartPos.X, Y: request.containerStartPos.Y }, function(err, mainPosDB){
                    Building.findOne({ mainPos: mainPosDB }).populate("items").exec(function(err, building){

                        //Get Item Bag to move from the building
                        var itemBag = undefined;
                        for(var i = 0; i < building.items.length; i++)
                        {
                            if(building.items[i].positionInBag == posStart)
                            {
                                itemBag = i;
                            }
                        }

                        //Get pos end in bag
                        var newPosEmpty = true;
                        for(var i = 0; i < farmer.bag.length; i++)
                        {
                            if(farmer.bag[i].positionInBag == posEnd)
                            {
                                newPosEmpty = false;
                            }
                        }

                        //If found in bag and place choose is empty
                        if(newPosEmpty && itemBag != undefined)
                        {
                            //Pull out the ItemBag of the bag
                            var itemBagToMove = building.items[itemBag];
                            building.items.pull({ _id: building.items[itemBag]._id});
                            building.save(function(err, buildingDB){
                                //Change the position of the ItemBag
                                itemBagToMove.positionInBag = posEnd;
                                itemBagToMove.save(function(err, itemBagDB){
                                    //Add the ItemBag in the items list of the building
                                    farmer.bag.push(itemBagDB);
                                    farmer.save(function(err, farmerDB){
                                        Farmer.findById(farmerDB).populate("bag").exec(function(err, farmerWithBag){
                                            socket.sessions.farmer = farmerWithBag.getAsObject();
                                            //Send farmer to client for update bag view
                                            //Use of BOARD-itemBuyComplete because it do what we need
                                            socket.emit('BOARD-itemBuyComplete', socket.sessions.farmer);
                                        });
                                    });
                                });
                            });
                        }
                    });
                });
            });
        }
        else if(containerStart == "building" && containerEnd == "building")
        {
            Tile.findOne({X: request.containerStartPos.X, Y: request.containerStartPos.Y }, function(err, mainPosDB){
                Building.findOne({ mainPos: mainPosDB }).populate("items").exec(function(err, building){

                    //Get Item Bag to move from the building and if endPos is empty
                    var itemBag = undefined;
                    var newPosEmpty = true;
                    for(var i = 0; i < building.items.length; i++)
                    {
                        if(building.items[i].positionInBag == posStart)
                        {
                            itemBag = i;
                        }
                        if(building.items[i].positionInBag == posEnd)
                        {
                            newPosEmpty = false;
                        }
                    }

                    //If found in building and place choose is empty
                    if(newPosEmpty && itemBag != undefined)
                    {
                        building.items[itemBag].positionInBag = posEnd;
                        building.items[itemBag].save(function(err, itemBagDB){
                            //Save in database succefull, Send the new content of the building to client ?
                        });
                    }
                });
            });
        }

    });

    socket.on('GAME-getBuildingContent', function(request){
        Tile.findOne({X: request.mainPos.X, Y: request.mainPos.Y}, function(err, mainPosDB){
            if(mainPosDB !=  null)
            {
                Building.findOne({mainPos: mainPosDB}).populate("items").exec(function(err, buildingDB){
                    if(buildingDB != null)
                    {
                        var building = buildingDB.getAsObject();
                        socket.emit('GAME-putContentBuilding', { items: building.items, tile: G.World[request.mainPos.X][request.mainPos.Y] });
                    }
                });
            }
        });

    });
};

module.exports = GameController;




