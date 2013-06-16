
BoardController = function(socket, db, mongoose){

    var Configuration = require('../config/config');
    var config = new Configuration();
    var WeaponFactory = require('../models/weaponFactory');
    var self = this;

    var Farmer = mongoose.model("Farmer");
    var ItemBag = mongoose.model("ItemBag");
    var Arsenal = mongoose.model("Arsenal");
    var Weapon = mongoose.model("Weapon");
    var Fight = mongoose.model("Fight");


    socket.on('BOARD-getPage', function(page){

        switch(page)
        {
            case 1:
                self.fillPageInfos();
                break;

            case 2:
                self.fillPageBuy();
                break;

            case 3:
                self.fillPageSell();
                break;

            case 4:
                self.fillPageFights();
                break;

            case 5:
                self.fillPageTrophy();
                break;

            default:
                break;
        }

    });

    socket.on('BOARD-buySomething', function(id){
        if(id >= 1 && id <= 12)
        {
            self.buySeedOrBuilding(id);
        }
        else if(id >= 13 && id <= 22)
        {
            self.buyWeapon(id);
        }
    });

    this.fillPageInfos = function(){

        var page = new Object();
        page.page = 1;

        page.username = socket.sessions.farmer.name;
        page.money = socket.sessions.farmer.money;

        socket.emit("BOARD-receivePage", page);
    };

    this.fillPageBuy = function(){

        var page = new Object();
        page.page = 2;

        /* PRICES */
        page.prices = new Array();
        page.prices[1] = Config.prices.avoine;
        page.prices[2] = Config.prices.ble;
        page.prices[3] = Config.prices.carotte;
        page.prices[4] = Config.prices.citrouille;
        page.prices[5] = Config.prices.fayot;
        page.prices[6] = Config.prices.seigle;
        page.prices[7] = Config.prices.radis;
        page.prices[8] = Config.prices.salade;
        page.prices[9] = Config.prices.topinambour;

        //Buildings
        page.prices[10] = Config.prices.grangeP;
        page.prices[11] = Config.prices.grangeM;
        page.prices[12] = Config.prices.grangeG;

        //Weapons
        page.prices[13] = Config.prices.marteau;
        page.prices[14] = Config.prices.cailloux;
        page.prices[15] = Config.prices.hache;
        page.prices[16] = Config.prices.poulet
        page.prices[17] = Config.prices.epee;
        page.prices[18] = Config.prices.nyancat;
        page.prices[19] = Config.prices.ak47;
        page.prices[20] = Config.prices.chien;
        page.prices[21] = Config.prices.lightsaber;
        page.prices[22] = Config.prices.grenade;

        /* LVL AVAILABLE */
        page.lvlAvailable = new Array();
        page.lvlAvailable[1] = Config.lvlAvailable.avoine;
        page.lvlAvailable[2] = Config.lvlAvailable.ble;
        page.lvlAvailable[3] = Config.lvlAvailable.carotte;
        page.lvlAvailable[4] = Config.lvlAvailable.citrouille;
        page.lvlAvailable[5] = Config.lvlAvailable.fayot;
        page.lvlAvailable[6] = Config.lvlAvailable.seigle;
        page.lvlAvailable[7] = Config.lvlAvailable.radis;
        page.lvlAvailable[8] = Config.lvlAvailable.salade;
        page.lvlAvailable[9] = Config.lvlAvailable.topinambour;

        //Buildings
        page.lvlAvailable[10] = Config.lvlAvailable.grangeP;
        page.lvlAvailable[11] = Config.lvlAvailable.grangeM;
        page.lvlAvailable[12] = Config.lvlAvailable.grangeG;

        //Weapons
        page.lvlAvailable[13] = Config.lvlAvailable.marteau;
        page.lvlAvailable[14] = Config.lvlAvailable.cailloux;
        page.lvlAvailable[15] = Config.lvlAvailable.hache;
        page.lvlAvailable[16] = Config.lvlAvailable.poulet
        page.lvlAvailable[17] = Config.lvlAvailable.epee;
        page.lvlAvailable[18] = Config.lvlAvailable.nyancat;
        page.lvlAvailable[19] = Config.lvlAvailable.ak47;
        page.lvlAvailable[20] = Config.lvlAvailable.chien;
        page.lvlAvailable[21] = Config.lvlAvailable.lightsaber;
        page.lvlAvailable[22] = Config.lvlAvailable.grenade;


        socket.emit("BOARD-receivePage", page);
    };

    this.fillPageSell = function(){

    };

    this.fillPageFights = function(){
        Arsenal.findOne({farmer: socket.sessions.farmer.mongooseObject}).exec(function(err, arsenal){

            Weapon.findById(arsenal.mainWeapon, function(err, mainWeapon){
                Weapon.findById(arsenal.supportWeapon, function(err, secondaryWeapon){

                    var page = new Object();
                    page.page = 4;

                    page.mainWeapon = (mainWeapon != null) ? mainWeapon.idItem : 13;
                    page.secondaryWeapon = (secondaryWeapon != null) ? secondaryWeapon.idItem : 14;

                    //Retrieves the fight where the current user perticipate
                    var name = socket.sessions.farmer.name;
                    Fight.find({}).or([{farmerAttacker: name}, {farmerDefender: name}]).sort({date: 'desc'}).exec(function(err, fights){
                        page.fights = fights;
                        socket.emit("BOARD-receivePage", page);
                    });
                });
            });
        });
    };

    this.fillPageTrophy = function(){

    };

    this.buySeedOrBuilding = function(id){

        var self = this;

        //Define which item the player want to buy
        var keyName = undefined;
        for(var key in config.idItems)
        {
            if(config.idItems[key].id == id)
            {
                keyName = config.idItems[key].name;
            }
        }

        //If item exist in config
        if(keyName != undefined)
        {
            //Verif player have sufficient level for buy item
            var lvlRequire = config.lvlAvailable[keyName];
            if(socket.sessions.farmer.level >= lvlRequire)
            {
                //Verif player have sufficient money for buy item
                var price = config.prices[keyName];
                if(socket.sessions.farmer.money >= price)
                {
                    //Add the new item buy to the bag of the farmer
                    Farmer.findById(socket.sessions.farmer._id).populate("bag").exec(function(err, farmerWithBag){
                        socket.sessions.farmer = farmerWithBag.getAsObject();
                        var bag = socket.sessions.farmer.bag;
                        var nbItemToAdd = 0;
                        if(id >= 1 && id <= 9)
                            nbItemToAdd = config.nbSeedWhenBuy;
                        else if (id >= 10 && id <= 10)
                            nbItemToAdd = config.nbBuildingWhenBuy;

                        self.addItemInBag(id, keyName, bag, nbItemToAdd, price);
                    });
                }
            }
        }
    };

    this.buyWeapon = function(id){

        //Define which item the player want to buy
        var keyName = undefined;
        for(var key in config.idItems)
        {
            if(config.idItems[key].id == id)
            {
                keyName = config.idItems[key].name;
            }
        }

        //If item exist in config
        if(keyName != undefined)
        {
            //Verif player have sufficient level for buy item
            var lvlRequire = config.lvlAvailable[keyName];
            if(socket.sessions.farmer.level >= lvlRequire)
            {
                //Verif player have sufficient money for buy item
                var price = config.prices[keyName];
                if(socket.sessions.farmer.money >= price)
                {
                    //Get the arsenal of the farmer
                    Arsenal.findById(socket.sessions.farmer.mongooseObject.arsenal).exec(function(err, arsenal){
                        //Create the weapon
                        var weaponFactory = new WeaponFactory(mongoose, socket.sessions.farmer.mongooseObject);
                        var weapon = weaponFactory.getWeapon(id);

                        //Save weapon in database
                        weapon.save(function(err){

                            //Update farmer money
                            var money = socket.sessions.farmer.money - price;
                            Farmer.update(socket.sessions.farmer._id, {money: money}, function(err, farmer){
                                socket.sessions.farmer.money -= price;
                                //Update Arsenal
                                if(weapon.type == config.weaponsType.main)
                                {
                                    Weapon.remove({ _id: arsenal.mainWeapon }, function(err){});
                                    arsenal.mainWeapon = weapon;
                                }
                                else if(weapon.type == config.weaponsType.support)
                                {
                                    Weapon.remove({ _id: arsenal.supportWeapon }, function(err){});
                                    arsenal.supportWeapon = weapon;
                                }

                                arsenal.save(function(err){
                                    socket.emit('BOARD-weaponBuyComplete', { money: money });
                                });
                            });
                        });
                    });
                }
            }
        }

    };

    this.addItemInBag = function(id, keyName, bag, nbItemToAdd, price){

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
                itemBag.name = config.idItems[keyName].name;
                itemBag.quantity = nbItemToAdd;
                itemBag.positionInBag = firstEmptyPoche;
                itemBag.idItem = id;

                //Save in database the new ItemBag
                itemBag.save(function(err, itemBagDB){

                    //Push the new item in the bag of the farmer
                    //Save the modification in database, keep in sessions and send to client
                    socket.sessions.farmer.mongooseObject.bag.push(itemBagDB);
                    socket.sessions.farmer.mongooseObject.money = socket.sessions.farmer.money - price;
                    socket.sessions.farmer.mongooseObject.save(function(err, farmerDB){
                        Farmer.findById(farmerDB).populate("bag").exec(function(err, farmerWithBag){
                            socket.sessions.farmer = farmerWithBag.getAsObject();
                            socket.emit("BOARD-itemBuyComplete", socket.sessions.farmer);
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
                socket.sessions.farmer.mongooseObject.money = socket.sessions.farmer.money - price;
                socket.sessions.farmer.mongooseObject.save(function(err, farmerDB){

                    //Verifications surplus exist
                    if(surplus != undefined)
                    {
                        //If surplus detected we try to place in an empty cell of bag this surplus
                        if(firstEmptyPoche != undefined)
                        {
                            //Create new ItemBag
                            var itemBag = new ItemBag();
                            itemBag.name = config.idItems[keyName].name;
                            itemBag.quantity = nbItemToAdd;
                            itemBag.positionInBag = firstEmptyPoche;
                            itemBag.idItem = id;

                            //Save in database the new ItemBag
                            itemBag.save(function(err, itemBagDB){

                                //Push the new item in the bag of the farmer
                                //Save the modification in database, keep in sessions and send to client
                                socket.sessions.farmer.mongooseObject.bag.push(itemBagDB);
                                socket.sessions.farmer.mongooseObject.money = socket.sessions.farmer.money - price;
                                socket.sessions.farmer.mongooseObject.save(function(err, farmerDB){
                                    Farmer.findById(farmerDB).populate("bag").exec(function(err, farmerWithBag){
                                        socket.sessions.farmer = farmerWithBag.getAsObject();
                                        socket.emit("BOARD-itemBuyComplete", socket.sessions.farmer);
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
                            socket.emit("BOARD-itemBuyComplete", socket.sessions.farmer);
                        });
                    }
                });
            });
        }
    };

};

module.exports = BoardController;