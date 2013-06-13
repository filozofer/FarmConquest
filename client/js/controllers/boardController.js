define(['jquery'], function(jQuery) {

    jQuery.noConflict();
    var $j = jQuery;

    var BoardController = Class.create();
    BoardController.prototype = {

        initialize: function(){
        },

        initEvents: function(){

            var self = this;

            $j(".mb_tabs").on('click', function(){
                $j(".mb_tabs").removeClass("mb_tab_select");
                $j(this).addClass("mb_tab_select");
                $j(".mb_board_page").removeClass("mb_page_select");
                var page = $j(this).attr("page");
                $j(".mb_board_page[page=" + page + "]").addClass("mb_page_select");

                socket.emit("BOARD-getPage", parseInt(page));

            });

            $j(document).on('mouseenter mouseleave', "#mb_quit_button", function(ev){
                var mouse_is_inside = ev.type === 'mouseenter';
                if(mouse_is_inside)
                    $j("#mb_quit_button").attr('src', "img/gameBoard/cross_active_button.png");
                else
                    $j("#mb_quit_button").attr('src', "img/gameBoard/cross_clean_button.png");
            });

            $j("#mb_quit_button").on('click', function(){
                $j("#game_main_board").fadeOut(500);
            });

            socket.on('BOARD-receivePage', function(resp){
                var page = resp.page;
                switch(page)
                {
                    case 1:
                        self.fillPageInfos(resp);
                        break;

                    case 2:
                        self.fillPageBuy(resp);
                        break;

                    case 3:
                        self.fillPageSell(resp);
                        break;

                    case 4:
                        self.fillPageFights(resp);
                        break;

                    case 5:
                        self.fillPageTrophy(resp);
                        break;

                    default:
                        break;
                }
            });

        },

        fillPageInfos: function(page) {
            $j("#mb_board_page_mainBoard").html(page.username);

        },

        fillPageBuy: function(page) {

        },

        fillPageSell: function(page) {

        },

        fillPageFights: function(page) {

        },

        fillPageTrophy: function(page) {

        }
    };

    return BoardController;

});
