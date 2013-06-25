/*
 name :Weapon Factory
 description: Object use to create weapon !
 */

var Configuration = require('../config/config');
var config = new Configuration();

WeaponFactory = function(mongoose, farmer){

    //Params
    this.mongoose = mongoose;
    this.farmer = farmer;

    //Models
    var Weapon = mongoose.model("Weapon");

    this.getWeapon = function(id){

        //Get name of the weapon by id
        var idItems = config.idItems;
        var keyName = undefined;
        for(var k in idItems)
        {
            if(idItems[k].id == id)
            {
                keyName = idItems[k].name;
            }
        }
        var keyFunction = "get_" + keyName;

        //Call the function associate for create the asked weapon
        return this[keyFunction](id);
    }

    this.changeFarmer = function(farmer){
        this.farmer = farmer;
    }

    this.get_marteau = function(id){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.main;
        weapon.power = 15;
        weapon.hitRatio = 80;
        weapon.idItem = id;

        return weapon;
    }

    this.get_hache = function(id){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.main;
        weapon.power = 40;
        weapon.hitRatio = 60;
        weapon.idItem = id;

        return weapon;
    }

    this.get_epee = function(id){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.main;
        weapon.power = 40;
        weapon.hitRatio = 80;
        weapon.idItem = id;

        return weapon;
    }

    this.get_ak47 = function(id){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.main;
        weapon.power = 60;
        weapon.hitRatio = 90;
        weapon.idItem = id;

        return weapon;
    }

    this.get_lightsaber = function(id){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.main;
        weapon.power = 69;
        weapon.hitRatio = 99;
        weapon.idItem = id;

        return weapon;
    }

    this.get_cailloux = function(id){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.support;
        weapon.power = 5;
        weapon.hitRatio = 30;
        weapon.idItem = id;
        weapon.__proto__.effect = function(otherPlayer){
            var resultEffect = new Object();
            resultEffect.precisionModifDef = -10;
            resultEffect.precisionModifAtt = 0;
            resultEffect.additionnalDamage = 0;
            return resultEffect;
        }

        return weapon;
    }

    this.get_poulet = function(id){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.support;
        weapon.power = 10;
        weapon.hitRatio = 30;
        weapon.idItem = id;
        weapon.__proto__.effect = function(otherPlayer){
            var resultEffect = new Object();
            resultEffect.precisionModifDef = 0;
            resultEffect.precisionModifAtt = 10;
            resultEffect.additionnalDamage = 0;
            return resultEffect;
        }

        return weapon;
    }

    this.get_nyancat = function(id){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.support;
        weapon.power = 20;
        weapon.hitRatio = 20;
        weapon.idItem = id;
        weapon.__proto__.effect = function(otherPlayer){
            var resultEffect = new Object();
            resultEffect.precisionModifDef = 0;
            resultEffect.precisionModifAtt = 0;
            resultEffect.additionnalDamage = (otherPlayer.supportWeapon.idItem == config.idItems.grenade.id) ? 20 : 0;
            return resultEffect;
        }

        return weapon;
    }

    this.get_chien = function(id){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.support;
        weapon.power = 20;
        weapon.hitRatio = 20;
        weapon.idItem = id;
        weapon.__proto__.effect = function(otherPlayer){
            var resultEffect = new Object();
            resultEffect.precisionModifDef = 0;
            resultEffect.precisionModifAtt = 0;
            resultEffect.additionnalDamage = (otherPlayer.supportWeapon.idItem == config.idItems.nyancat.id) ? 20 : 0;
            return resultEffect;
        }

        return weapon;
    }

    this.get_grenade = function(id){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.support;
        weapon.power = 20;
        weapon.hitRatio = 20;
        weapon.idItem = id;
        weapon.__proto__.effect = function(otherPlayer){
            var resultEffect = new Object();
            resultEffect.precisionModifDef = 0;
            resultEffect.precisionModifAtt = 0;
            resultEffect.additionnalDamage = (otherPlayer.supportWeapon.idItem == config.idItems.chien.id) ? 20 : 0;
            return resultEffect;
        }

        return weapon;
    }

};

module.exports = WeaponFactory;
