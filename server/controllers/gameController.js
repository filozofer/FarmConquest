
/*
 Game Controller class
 */


GameController = function(socket, db, mongoose){

    var Farmer = mongoose.model("Farmer");
    var ItemBag = mongoose.model("ItemBag");

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

            if(newPosEmpty && itemBag != undefined)
            {
                farmer.bag[itemBag].positionInBag = posEnd;
                farmer.bag[itemBag].save(function(err, itemBagDB){
                    socket.sessions.farmer = farmer.getAsObject();
                    //Send farmer to client for update bag view
                    //User of BOARD-itemBuyComplete because it do what we need
                    socket.emit('BOARD-itemBuyComplete', socket.sessions.farmer);
                });
            }
        });
    });

    socket.on('GAME-saleCrop', function(resp){
        var idItem = resp.id;
        var quantity = resp.quantity;

         Farmer.findById(socket.sessions.farmer._id).populate("bag").exec(function(err, farmerWithBag){
             socket.sessions.farmer = farmerWithBag.getAsObject();
             var bag = socket.sessions.farmer.bag;
             var item = undefined;
             for(var i=0; i<bag.length; i++){
                 var bagItem = bag[i];
                 if (bagItem.idItem == idItem && bagItem.quantity >= quantity && bagItem.canBeSold){
                     bagItem.quantity -= quantity;
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

                var keyName = undefined;
                for(var key in Config.idItems)
                {
                    if(Config.idItems[key].id == idItem)
                    {
                        keyName = Config.idItems[key].name;
                        break;
                    }
                }

                var price = Config.prices[keyName];
                socket.sessions.farmer.money += (price*quantity);

                var farmerQuery = {name: socket.sessions.farmer.name}
                Farmer.update(farmerQuery, { money: socket.sessions.farmer.money }, null, null);

                socket.emit('FARMER-newMoney', socket.sessions.farmer.money);

             }



    });
    });


};

module.exports = GameController;




