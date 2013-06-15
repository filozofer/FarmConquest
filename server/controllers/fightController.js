
/*
 Fight Controller class
 */

FightController = function(socket, db, mongoose){


    var Farmer = mongoose.model("Farmer");
    var Arena = require('../models/arena.js');
    var WeaponFactory = require('../models/weaponFactory');

    socket.on('FIGHT-getFarmersList', function(){

        //Get all farmers sort by level 10 -> 1
        Farmer.find({}).sort({level: 'desc'}).exec(function(err, farmers){

            var page = new Object();
            page.farmers = farmers;
            page.creditFight = socket.sessions.farmer.creditFight;

            socket.emit('FIGHT-fillFightBoard', page);
        });
    });

    socket.on('FIGHT-findFarmerToAttack', function(name){
        var resp = new Object();
        Farmer.findOne({ name : name }, function(err, farmer){
            if(farmer != undefined && farmer != null && farmer.name != socket.sessions.farmer.name)
            {
                resp.found = true;
                resp.level = farmer.level;
            }
            else
            {
                resp.found = false;
            }

            socket.emit('FIGHT-findFarmerToAttack', resp);
        });
    });


    socket.on('FIGHT-attackFarmer', function(request){

        var nameOpponent = request;

        Farmer.findById(socket.sessions.farmer._id).populate("arsenal").exec(function(err, farmerAttackerMongo){
            Farmer.findOne({ name: nameOpponent }).populate("arsenal").exec(function(err, farmerDefenderMongo){
                if(farmerAttackerMongo != null && farmerDefenderMongo != null)
                {
                    //Get farmers as object for fill arsenal if needed
                    var farmerAttacker = farmerAttackerMongo.getAsObject();
                    var farmerDefender = farmerDefenderMongo.getAsObject();

                    //Create the weapon
                    var weaponFactoryAttacker = new WeaponFactory(mongoose, farmerAttacker);
                    var weaponFactoryDefender = new WeaponFactory(mongoose, farmerDefender);

                    //Set default weapon if weapon null
                    if(farmerAttacker.arsenal.mainWeapon == null || farmerAttacker.arsenal.mainWeapon == undefined)
                        farmerAttacker.arsenal.mainWeapon = weaponFactoryAttacker.getWeapon(Config.idItems.marteau.id);
                    if(farmerAttacker.arsenal.supportWeapon == null || farmerAttacker.arsenal.supportWeapon == undefined)
                        farmerAttacker.arsenal.supportWeapon = weaponFactoryAttacker.getWeapon(Config.idItems.cailloux.id);
                    if(farmerDefender.arsenal.mainWeapon == null || farmerDefender.arsenal.mainWeapon == undefined)
                        farmerDefender.arsenal.mainWeapon = weaponFactoryDefender.getWeapon(Config.idItems.marteau.id);
                    if(farmerDefender.arsenal.supportWeapon == null || farmerDefender.arsenal.supportWeapon == undefined)
                        farmerDefender.arsenal.supportWeapon = weaponFactoryDefender.getWeapon(Config.idItems.cailloux.id);

                    //Send the farmers to the Arena
                    var fight = new Arena(mongoose);
                    fight.start(farmerAttacker, farmerDefender, function(){
                        console.log('Fight over !');
                        //socket.emit('FIGHT-fightTransmission', TODOfight );
                    });
                }
            });
        });
    });

};

module.exports = FightController;




