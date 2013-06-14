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
        return this[keyFunction]();
    }

    this.changeFarmer = function(farmer){
        this.farmer = farmer;
    }

    this.get_marteau = function(){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.main;
        weapon.power = 15;
        weapon.hitRatio = 80;

        return weapon;
    }

    this.get_hache = function(){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.main;
        weapon.power = 40;
        weapon.hitRatio = 60;

        return weapon;
    }

    this.get_epee = function(){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.main;
        weapon.power = 40;
        weapon.hitRatio = 80;

        return weapon;
    }

    this.get_ak47 = function(){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.main;
        weapon.power = 60;
        weapon.hitRatio = 90;

        return weapon;
    }

    this.get_lightsaber = function(){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.main;
        weapon.power = 69;
        weapon.hitRatio = 99;

        return weapon;
    }

    this.get_rocks = function(){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.support;
        weapon.power = 5;
        weapon.hitRatio = 30;
        weapon.effect = function(){

        }

        return weapon;
    }

    this.get_poulet = function(){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.support;
        weapon.power = 10;
        weapon.hitRatio = 30;
        weapon.effect = function(){

        }

        return weapon;
    }

    this.get_nyancat = function(){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.support;
        weapon.power = 20;
        weapon.hitRatio = 20;
        weapon.effect = function(){

        }

        return weapon;
    }

    this.get_chien = function(){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.support;
        weapon.power = 20;
        weapon.hitRatio = 20;
        weapon.effect = function(){

        }

        return weapon;
    }

    this.get_grenade = function(){
        var weapon = new Weapon();

        weapon.farmer = farmer;
        weapon.type = config.weaponsType.support;
        weapon.power = 20;
        weapon.hitRatio = 20;
        weapon.effect = function(){

        }

        return weapon;
    }

};

module.exports = WeaponFactory;
