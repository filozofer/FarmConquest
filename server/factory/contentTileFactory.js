/*
 name :Weapon Factory
 description: Object use to create weapon !
 */

var Configuration = require('../config/config');
var config = new Configuration();

ContentTileFactory = function(mongoose, farmer){

    //Params
    this.mongoose = mongoose;
    var farmer = farmer;

    //Models
    var ContentTile = mongoose.model("ContentTile");
    var Tile = mongoose.model("Tile");
    var tile = undefined;

    this.getContentTile = function(id, tileToUse){

        tile = tileToUse;
        //Get name of the weapon by id
        var idItems = config.idItems;
        var item = undefined;
        for(var k in idItems)
        {
            if(idItems[k].id == id)
            {
                item = idItems[k];
            }
        }
        var keyFunction = "get_" + item.name;

        //Call the function associate for create the asked content tile
        return this[keyFunction](item);
    }

    this.changeFarmer = function(farmer){
        this.farmer = farmer;
    }

    this.get_avoine = function(item){
        var contentTile = new ContentTile();
        contentTile.type = config.tileType.seed;
        contentTile.name = item.name;
        contentTile.description = "Avoine";
        contentTile.mainPos = tile;
        contentTile.owner = farmer;
        contentTile.idItem = item.id;
        contentTile.maturationTime   = 15000;
        contentTile.deathTime        = 300000;
        contentTile.productivity     = 2;
        contentTile.unitLosePerDeath = 5;
        contentTile.state = 0;
        return contentTile;
    }

    this.get_ble = function(item){
        var contentTile = new ContentTile();
        contentTile.type = config.tileType.seed;
        contentTile.name = item.name;
        contentTile.description = "Ble";
        contentTile.mainPos = tile;
        contentTile.owner = farmer;
        contentTile.idItem = item.id;
        contentTile.maturationTime   = 30000;
        contentTile.deathTime        = 600000;
        contentTile.productivity     = 3;
        contentTile.unitLosePerDeath = 5;
        contentTile.state = 0;
        return contentTile;
    }

    this.get_carotte = function(item){
        var contentTile = new ContentTile();
        contentTile.type = config.tileType.seed;
        contentTile.name = item.name;
        contentTile.description = "Carotte";
        contentTile.mainPos = tile;
        contentTile.owner = farmer;
        contentTile.idItem = item.id;
        contentTile.maturationTime   = 45000;
        contentTile.deathTime        = 600000;
        contentTile.productivity     = 5;
        contentTile.unitLosePerDeath = 5;
        contentTile.state = 0;
        return contentTile;
    }

    this.get_citrouille = function(item){
        var contentTile = new ContentTile();
        contentTile.type = config.tileType.seed;
        contentTile.name = item.name;
        contentTile.description = "Citrouille";
        contentTile.mainPos = tile;
        contentTile.owner = farmer;
        contentTile.idItem = item.id;
        contentTile.maturationTime   = 600000;
        contentTile.deathTime        = 900000;
        contentTile.productivity     = 2;
        contentTile.unitLosePerDeath = 1;
        contentTile.state = 0;
        return contentTile;
    }

    this.get_fayot = function(item){
        var contentTile = new ContentTile();
        contentTile.type = config.tileType.seed;
        contentTile.name = item.name;
        contentTile.description = "Fayot";
        contentTile.mainPos = tile;
        contentTile.owner = farmer;
        contentTile.idItem = item.id;
        contentTile.maturationTime   = 120000;
        contentTile.deathTime        = 900000;
        contentTile.productivity     = 9;
        contentTile.unitLosePerDeath = 3;
        contentTile.state = 0;
        return contentTile;
    }

    this.get_seigle = function(item){
        var contentTile = new ContentTile();
        contentTile.type = config.tileType.seed;
        contentTile.name = item.name;
        contentTile.description = "Seigle";
        contentTile.mainPos = tile;
        contentTile.owner = farmer;
        contentTile.idItem = item.id;
        contentTile.maturationTime   = 150000;
        contentTile.deathTime        = 900000;
        contentTile.productivity     = 9;
        contentTile.unitLosePerDeath = 3;
        contentTile.state = 0;
        return contentTile;
    }

    this.get_radis = function(item){
        var contentTile = new ContentTile();
        contentTile.type = config.tileType.seed;
        contentTile.name = item.name;
        contentTile.description = "Radis";
        contentTile.mainPos = tile;
        contentTile.owner = farmer;
        contentTile.idItem = item.id;
        contentTile.maturationTime   = 180000;
        contentTile.deathTime        = 900000;
        contentTile.productivity     = 5;
        contentTile.unitLosePerDeath = 3;
        contentTile.state = 0;
        return contentTile;
    }

    this.get_salade = function(item){
        var contentTile = new ContentTile();
        contentTile.type = config.tileType.seed;
        contentTile.name = item.name;
        contentTile.description = "Salade";
        contentTile.mainPos = tile;
        contentTile.owner = farmer;
        contentTile.idItem = item.id;
        contentTile.maturationTime   = 300000;
        contentTile.deathTime        = 1200000;
        contentTile.productivity     = 2;
        contentTile.unitLosePerDeath = 1;
        contentTile.state = 0;
        return contentTile;
    }

    this.get_topinambour = function(item){
        var contentTile = new ContentTile();
        contentTile.type = config.tileType.seed;
        contentTile.name = item.name;
        contentTile.description = "Topinambour";
        contentTile.mainPos = tile;
        contentTile.owner = farmer;
        contentTile.idItem = item.id;
        contentTile.maturationTime   = 360000;
        contentTile.deathTime        = 1200000;
        contentTile.productivity     = 9;
        contentTile.unitLosePerDeath = 1;
        contentTile.state = 0;
        return contentTile;
    }

    this.get_grangeP = function(item){
        var contentTile = new ContentTile();
        contentTile.type = config.tileType.grangeP;
        contentTile.name = item.name;
        contentTile.description = "Petite grange";
        contentTile.mainPos = tile;
        contentTile.owner = farmer;
        contentTile.idItem = item.id;
        contentTile.size = 1;
        return contentTile;
    }

    this.get_grangeM = function(item){
        var contentTile = new ContentTile();
        contentTile.type = config.tileType.grangeM;
        contentTile.name = item.name;
        contentTile.description = "Moyenne grange";
        contentTile.mainPos = tile;
        contentTile.owner = farmer;
        contentTile.idItem = item.id;
        contentTile.size = 4;
        return contentTile;
    }

    this.get_grangeG = function(item){
        var contentTile = new ContentTile();
        contentTile.type = config.tileType.grangeG;
        contentTile.name = item.name;
        contentTile.description = "Grande grange";
        contentTile.mainPos = tile;
        contentTile.owner = farmer;
        contentTile.idItem = item.id;
        contentTile.size = 6;
        return contentTile;
    }

};

module.exports = ContentTileFactory;
