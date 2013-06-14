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
    // working session time (ms)
    this.workingTime = 2000;


    //Tile content types

    /* ID ITEMS */
    this.idItems = new Object();
    this.idItems.avoine = { id: 1, name: "avoine" };
    this.idItems.ble = { id: 2, name: "ble" };
    this.idItems.carotte = { id: 3, name: "carotte" };
    this.idItems.citrouille = { id: 4, name: "citrouille" };
    this.idItems.fayot = { id: 5, name: "fayot" };
    this.idItems.seigle = { id: 6, name: "seigle" };
    this.idItems.radis = { id: 7, name: "radis" };
    this.idItems.salade = { id: 8, name: "salade" };
    this.idItems.topinambour = { id: 9, name: "topinambour" };
    //Buildings
    this.idItems.grangeP = { id: 10, name: "grangeP" };
    this.idItems.grangeM = { id: 11, name: "grangeM" };
    this.idItems.grangeG = { id: 12, name: "grangeG" };
    //Weapons
    this.idItems.weapons = { id: 13, name: "marteau" };
    this.idItems.weapons = { id: 14, name: "cailloux" };
    this.idItems.weapons = { id: 15, name: "hache" };
    this.idItems.weapons = { id: 16, name: "poulet" };
    this.idItems.weapons = { id: 17, name: "epee" };
    this.idItems.weapons = { id: 18, name: "nyancat" };
    this.idItems.weapons = { id: 19, name: "ak47" };
    this.idItems.weapons = { id: 20, name: "chien" };
    this.idItems.weapons = { id: 21, name: "lightsaber" };
    this.idItems.weapons = { id: 22, name: "grenade" };



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

    /* Configurations buy*/
    this.nbSeedWhenBuy = 5;
    this.nbBuildingWhenBuy = 1;
    this.maxItemByCellBag = 50;

    /* Configurations weapons */
    this.weaponsType = new Object();
    this.weaponsType.main = 1;
    this.weaponsType.support = 2;


};

module.exports = Configuration;




