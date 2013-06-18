
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


};

module.exports = GameController;




