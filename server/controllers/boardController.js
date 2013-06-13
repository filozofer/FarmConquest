
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

    this.fillPageInfos = function(){

        var page = new Object();
        page.page = 1;

        page.username = socket.sessions.farmer.name;

        socket.emit("BOARD-receivePage", page);
    }

    this.fillPageBuy = function(){

    }

    this.fillPageSell = function(){

    }

    this.fillPageFights = function(){

    }

    this.fillPageTrophy = function(){

    }

};

module.exports = BoardController;