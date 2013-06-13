
BoardController = function(socket, db, mongoose){

    var Configuration = require('../config/config');
    var config = new Configuration();
    var self = this;


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
        if(id >= 1 && id <= 9)
        {
            self.buySeed(id);
        }
        else if(id >= 10 && id <= 12)
        {
            self.buyBuilding(id);
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

    };

    this.fillPageTrophy = function(){

    };

    this.buySeed = function(id){

    };

    this.buyBuilding = function(id){

    };

    this.buyWeapon = function(id){

    };

};

module.exports = BoardController;