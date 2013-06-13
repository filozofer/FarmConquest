/*
 Config class
 */

Configuration = function(){

    this.farmSize = 20;
    // rayon de communication pour l'affichage des messages du chat
    this.communicationRadius = 50;
    // price of water action
    this.waterPrice = 5;
    // price of fertilizer action
    this.fertilizerPrice = 10;
    // initial amount of money the player is given
    this.initialMoney = 500;


    //Tile content types


    /* Prices */
    this.prices = new Object();
    //Seed
    this.prices.avoine = 1;
    this.prices.ble = 5;
    this.prices.carotte = 10;
    this.prices.citrouille = 15;
    this.prices.fayot = 20;
    this.prices.seigle = 25;
    this.prices.radis = 30;
    this.prices.salade = 35;
    this.prices.topinambour = 40;
    //Buildings
    this.prices.grangeP = 100;
    this.prices.grangeM = 300;
    this.prices.grangeG = 400;
    //Weapons
    this.prices.marteau = 100;
    this.prices.cailloux = 20;
    this.prices.hache = 200;
    this.prices.poulet = 40;
    this.prices.epee = 300;
    this.prices.nyancat = 60;
    this.prices.ak47 = 400;
    this.prices.chien = 60;
    this.prices.lightsaber = 500;
    this.prices.grenade = 60;


    /*Level Available*/
    this.lvlAvailable = new Object();
    //Seed
    this.lvlAvailable.avoine = 1;
    this.lvlAvailable.ble = 2;
    this.lvlAvailable.carotte = 3;
    this.lvlAvailable.citrouille = 4;
    this.lvlAvailable.fayot = 5;
    this.lvlAvailable.seigle = 6;
    this.lvlAvailable.radis = 7;
    this.lvlAvailable.salade = 8;
    this.lvlAvailable.topinambour = 9;
    //Buildings
    this.lvlAvailable.grangeP = 3;
    this.lvlAvailable.grangeM = 5;
    this.lvlAvailable.grangeG = 8;
    //Weapons
    this.lvlAvailable.marteau = 2;
    this.lvlAvailable.cailloux = 3;
    this.lvlAvailable.hache = 4;
    this.lvlAvailable.poulet = 5;
    this.lvlAvailable.epee = 6;
    this.lvlAvailable.nyancat = 7;
    this.lvlAvailable.ak47 = 8;
    this.lvlAvailable.chien = 7;
    this.lvlAvailable.lightsaber = 10;
    this.lvlAvailable.grenade = 7;


};

module.exports = Configuration;




