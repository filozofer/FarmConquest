/*
 name : Arena
 description: Object use to allow farmer to fight each other
 */

var Configuration = require('../config/config');
var config = new Configuration();

Arena = function(mongoose){

    var self = this;

    //Params
    this.mongoose = mongoose;
    this.farmerAttacker = undefined;
    this.farmerDefender = undefined;
    this.mainWeaponA = undefined;
    this.supportWeaponA = undefined;
    this.mainWeaponD = undefined;
    this.supportWeaponD = undefined;
    this.lifeFarmerA = undefined;
    this.lifeFarmerD = undefined;

    //Farmers
    this.farmerA = undefined; //Farmer Attacker
    this.farmerD = undefined; //Farmer Defender

    //Callback
    this.callbackFunction = undefined;

    //Models
    var Weapon = mongoose.model("Weapon");
    var Fight = mongoose.model("Fight");
    var ActionFight = mongoose.model("ActionFight");


    //Recuperation of all the needed informations
    this.start = function(farmerAttacker, farmerDefender, callback){

        self.farmerAttacker = farmerAttacker;
        self.farmerDefender = farmerDefender;
        self.callbackFunction = callback;
        self.lifeFarmerA = config.farmerLifeStart + farmerAttacker.level * config.farmerLifeByLevel;
        self.lifeFarmerD = config.farmerLifeStart + farmerDefender.level * config.farmerLifeByLevel;

        var saveMainWeaponA = farmerAttacker.arsenal.mainWeapon;
        var saveSupportWeaponA = farmerAttacker.arsenal.supportWeapon;
        var saveMainWeaponD = farmerDefender.arsenal.mainWeapon;
        var saveSupportWeaponD = farmerDefender.arsenal.supportWeapon;

        Weapon.findById(farmerAttacker.arsenal.mainWeapon, function(err, mainWeaponA_DB){
            self.mainWeaponA = (mainWeaponA_DB != null) ? mainWeaponA_DB.getAsObject() : null;
            Weapon.findById(farmerAttacker.arsenal.supportWeapon, function(err, supportWeaponA_DB){
                self.supportWeaponA = (supportWeaponA_DB != null) ? supportWeaponA_DB.getAsObject() : null;
                Weapon.findById(farmerDefender.arsenal.mainWeapon, function(err, mainWeaponD_DB){
                    self.mainWeaponD = (mainWeaponD_DB != null) ? mainWeaponD_DB.getAsObject() : null;
                    Weapon.findById(farmerDefender.arsenal.mainWeapon, function(err, supportWeaponD_DB){
                        self.supportWeaponD = (supportWeaponD_DB != null) ? supportWeaponD_DB.getAsObject() : null;

                        //Weapon controll null
                        self.mainWeaponA = (self.mainWeaponA == null) ? saveMainWeaponA : self.mainWeaponA;
                        self.supportWeaponA = (self.supportWeaponA == null) ? saveSupportWeaponA : self.supportWeaponA;
                        self.mainWeaponD = (self.mainWeaponD == null) ? saveMainWeaponD : self.mainWeaponD;
                        self.supportWeaponD = (self.supportWeaponD == null) ? saveSupportWeaponD : self.supportWeaponD;


                        //Farmer Attacker
                        self.farmerA = new Object();
                        self.farmerA.name = self.farmerAttacker.name;
                        self.farmerA.life = self.lifeFarmerA;
                        self.farmerA.precisionModif = 0;
                        self.farmerA.playTurn = self.playTurn;
                        self.farmerA.maxPrecisionToLose = config.maxPrecisionToLose;
                        self.farmerA.maxPrecisionToWin = config.maxPrecisionToWin;

                        self.farmerA.mainWeapon = new Object();
                        self.farmerA.mainWeapon.idItem = self.mainWeaponA.idItem
                        self.farmerA.mainWeapon.dammage = self.mainWeaponA.power;
                        self.farmerA.mainWeapon.probHit = self.mainWeaponA.hitRatio;

                        self.farmerA.supportWeapon = new Object();
                        self.farmerA.supportWeapon.idItem = self.supportWeaponA.idItem
                        self.farmerA.supportWeapon.dammage = self.supportWeaponA.power;
                        self.farmerA.supportWeapon.probHit = self.supportWeaponA.hitRatio;
                        self.farmerA.supportWeapon.effect = (self.supportWeaponA.effect != undefined) ? self.supportWeaponA.effect : function(){};


                        //Farmer Defender
                        self.farmerD = new Object();
                        self.farmerD.name = self.farmerDefender.name;
                        self.farmerD.life = self.lifeFarmerD;
                        self.farmerD.precisionModif = 0;
                        self.farmerD.playTurn = self.playTurn;
                        self.farmerD.maxPrecisionToLose = config.maxPrecisionToLose;
                        self.farmerD.maxPrecisionToWin = config.maxPrecisionToWin;

                        self.farmerD.mainWeapon = new Object();
                        self.farmerD.mainWeapon.idItem = self.mainWeaponD.idItem
                        self.farmerD.mainWeapon.dammage = self.mainWeaponD.power;
                        self.farmerD.mainWeapon.probHit = self.mainWeaponD.hitRatio;

                        self.farmerD.supportWeapon = new Object();
                        self.farmerD.supportWeapon.idItem = self.supportWeaponD.idItem
                        self.farmerD.supportWeapon.dammage = self.supportWeaponD.power;
                        self.farmerD.supportWeapon.probHit = self.supportWeaponD.hitRatio;
                        self.farmerD.supportWeapon.effect = (self.supportWeaponD.effect != undefined) ? self.supportWeaponD.effect : function(){};

                        self.fight();
                    });
                });
            });
        });


    }

    //Fight start here
    this.fight = function(){

        //Keep historic of actions
        var actions = new Array();

        //Use actual player and other player to know which one have to play
        var actualPlayer = self.farmerA;
        var otherPlayer = self.farmerD;

        //Initiate the fight
        var fight = new Fight();
        fight.farmerAttacker = self.farmerA.name;
        fight.farmerDefender = self.farmerD.name;
        fight.farmerAttackerLife = self.farmerA.life;
        fight.farmerDefenderLife = self.farmerD.life;

        //Fights until someone is K.O.
        while(actualPlayer.life > 0 && otherPlayer.life > 0)
        {
            //Actual player play and we keep trace of what he do
            var actionsTurn = actualPlayer.playTurn(otherPlayer);
            for(var i = 0; i < actionsTurn.length; i++)
            {
                actionsTurn[i].orderAction = actions.length + 1;
                actions.push(actionsTurn[i]);
            }

            //Change player turn
            var temp = actualPlayer;
            actualPlayer = otherPlayer;
            otherPlayer = temp;
        }

        //Set winner of the fight
        fight.winnerName = (actualPlayer.life <= 0) ? otherPlayer.name : actualPlayer.name;

        //Set reward in money
        var rewardMoneyAttIfWin = config.rewardMoneyMinByFight + self.farmerAttacker.level * config.rewardMoneyByLevel + (self.farmerDefender.level - self.farmerAttacker.level) * config.rewardMoneyDiffLevelAttacker;
        fight.rewardMoneyAtt = (fight.winnerName == self.farmerA.name) ? rewardMoneyAttIfWin : 0;
        fight.rewardMoneyDef = (fight.winnerName == self.farmerA.name) ? - (rewardMoneyAttIfWin) : (self.farmerAttacker.level - self.farmerDefender.level) * config.rewardMoneyDiffLevelDefender;

        //Set reward in credit conquest
        fight.creditConquest = (fight.winnerName == self.farmerA.name) ? config.rewardCreditConquestByFight : 0;


        //Save the fight
        self.saveFight(fight, actions);

    }

    //Set to player and use when player need to play is turn
    this.playTurn = function(otherPlayer){
        var actions = new Array();

        //Try to hit with main weapon
        var hit = Math.floor(Math.random()*(100)+1) + this.precisionModif;
        var touch = false;
        if(hit <= this.mainWeapon.probHit)
        {
            otherPlayer.life -= this.mainWeapon.dammage;
            touch = true;
        }
        var action1 = new ActionFight();
        action1.nameAttacker = this.name;
        action1.idWeapon = this.mainWeapon.idItem;
        action1.damageWeapon = this.mainWeapon.dammage;
        action1.probHitWeapon = this.mainWeapon.probHit;
        action1.hit = touch;
        action1.precisionModifDef = 0;
        action1.precisionModifAtt = 0;
        actions.push(action1);

        //Try to hit with support weapon
        var hit = Math.floor(Math.random()*(100)+1) + this.precisionModif;
        var touch = false;
        var precisionModifDef = 0;
        var precisionModifAtt = 0;
        var additionnalDamage = 0;
        if(hit <= this.supportWeapon.probHit)
        {
            otherPlayer.life -= this.supportWeapon.dammage;
            var resultEffect = this.supportWeapon.effect(this, otherPlayer);

            precisionModifDef = (otherPlayer.precisionModif > otherPlayer.maxPrecisionToLose) ? resultEffect.precisionModifDef : 0;
            otherPlayer.precisionModif += precisionModifDef;

            precisionModifAtt = (this.precisionModif  <  this.maxPrecisionToWin) ? resultEffect.precisionModifAtt : 0;
            this.precisionModif += precisionModifAtt;

            additionnalDamage = resultEffect.additionnalDamage;
            otherPlayer.life -= additionnalDamage;

            touch = true;
        }
        var action2 = new ActionFight();
        action2.nameAttacker = this.name;
        action2.idWeapon = this.supportWeapon.idItem;
        action2.damageWeapon = this.supportWeapon.dammage + additionnalDamage;
        action2.probHitWeapon = this.supportWeapon.probHit + this.precisionModif - precisionModifAtt;
        action2.hit = touch;
        action2.precisionModifDef = precisionModifDef;
        action2.precisionModifAtt = precisionModifAtt;
        actions.push(action2);

        return actions;
    }

    //Save the fight
    this.saveFight = function(fight, actions)
    {
        //Save all actions first, then save the fight and call the callback function
        self.saveAll(actions, actions.length, new Array(), function(result){
            for(var i = 0; i < result.length; i++)
            {
                fight.actionsFights.push(result[i]);
            }
            fight.save(function(err, fightDB){
                self.callbackFunction();
            });
        });
    }

    //Method to saves all items, then call a callback function
    this.saveAll = function(items, total, result, callback){
        var doc = items.pop();

        doc.save(function(err, saved){
            if (err) throw err;

            result.push(saved);

            if (--total)
            {
                self.saveAll(items, items.length, result, callback);
            }
            else
            {
                callback(result);
            }
        });
    }

};

module.exports = Arena;
