define(['jquery'], function(jQuery) {

    jQuery.noConflict();
    var $j = jQuery;

    var BoardController = Class.create();
    BoardController.prototype = {

        initialize: function(){
        },

        initEvents: function(){

            var self = this;

            //Add jquery function
            jQuery.fn.extend({
                findPos : function() {
                    obj = jQuery(this).get(0);
                    var curleft = obj.offsetLeft || 0;
                    var curtop = obj.offsetTop || 0;
                    while (obj = obj.offsetParent) {
                        curleft += obj.offsetLeft
                        curtop += obj.offsetTop
                    }
                    return {x:curleft,y:curtop};
                }
            });

            /* General */

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

            /* Page Buy */

            $j(document).on('mouseenter mouseleave', ".buy_item_span", function(ev){
                var mouse_is_inside = ev.type === 'mouseenter';
                if(mouse_is_inside)
                {
                    if($j(this).css("opacity") == "1")
                    {
                        $j(this).css('cursor','pointer');
                    }
                }
                else
                {
                    $j(this).css('cursor','url("../img/cursors/main.cur"), progress !important');
                }
            });

            $j(".buy_item_span").on('click', function(){
                if($j(this).css("opacity") == "1")
                {
                    socket.emit('BOARD-buySomething', parseInt($j(this).attr('boxPrice')));
                }
            });

            socket.on('BOARD-itemBuyComplete', function(farmer){
                jQuery('#mg_money_joueur').text(farmer.money);

                if(farmer.bag != undefined)
                {
                    for(var i = 0; i < farmer.bag.length; i++)
                    {
                        var itemBag = farmer.bag[i];
                        var content = "<span class='mg_item_bag'><span class='mg_bag_item bagItem" + itemBag.idItem + "'></span><span class='bagItem_quantity'>" + itemBag.quantity + "</span></span>";

                        $j(".mg_bag_box[idBag='" + itemBag.positionInBag + "']").html(content);
                    }
                }

                $j(document).trigger('GAME-bagReceive');

            });

            socket.on('BOARD-refreshBag', function(bag){
                if(bag != undefined)
                {
                    // clean bag
                    for (var i=0; i < 10; i++){
                        $j(".mg_bag_box[idBag='" + i + "']").html("");
                    }
                    if (bag.length > 0)
                    {
                        for(var i = 0; i < bag.length; i++)
                        {
                            var itemBag = bag[i];
                            var content = "<span class='mg_item_bag' iditem='" + itemBag.idItem + "'><span class='mg_bag_item bagItem" + itemBag.idItem + "'></span><span class='bagItem_quantity'>" + itemBag.quantity + "</span></span>";

                            $j(".mg_bag_box[idBag='" + itemBag.positionInBag + "']").html(content);
                        }
                    }
                }

                $j(document).trigger('GAME-bagReceive');
            });

            socket.on('BOARD-weaponBuyComplete', function(resp){
                //Update money
                $j('#mg_money_joueur').html(resp.money);
                //Change tab view
                $j(".mb_tabs").removeClass("mb_tab_select");
                $j("#mb_tab_fights").addClass("mb_tab_select");
                $j(".mb_board_page").removeClass("mb_page_select");
                $j(".mb_board_page[page=4]").addClass("mb_page_select");

                socket.emit("BOARD-getPage", 4);
            });

            socket.on('BOARD-bagFull', function(){
                $j("#mg_notif_bag").html("<img src='img/gameMenu/icoDanger.png' width='17' alt='ico_error' /> Le sac est plein !");
                setTimeout(function(){ $j("#mg_notif_bag").html(""); }, 3000);
            });

        },

        fillPageInfos: function(page) {
            $j("#mb_p1_username").html(page.username);
            $j("#mb_p1_money").html("<img src='img/gameMenu/treasure.png' alt='money' /> " + page.money);

        },

        fillPageBuy: function(page) {

            for(var i = 1; i < page.prices.length; i++)
            {
                $j(".buy_item_span[boxPrice=" + i + "] .mb_price_span").remove()
                $j(".buy_item_span[boxPrice=" + i + "]").append("<div class='mb_price_span'>" + page.prices[i] + "<img src='img/gameBoard/miniCoin.png' width='20' alt='coin'/></div>");

                if(socket.sessions.farmer.level < page.lvlAvailable[i])
                {
                    $j(".buy_item_span[boxPrice=" + i + "]").css('opacity', '0.2');
                    $j(".buy_item_span[boxPrice=" + i + "]").attr("lvlAvailable", page.lvlAvailable[i]);
                }
            }

        },

        fillPageSell: function(page) {

        },

        fillPageFights: function(page) {
            var idMainWeapon = page.mainWeapon;
            var idSecondaryWeapon = page.secondaryWeapon;

            $j("#mb_arsenal_main").removeClass();
            $j("#mb_arsenal_main").addClass("mb_arsenal_weapon");
            $j("#mb_arsenal_main").addClass("mg_weapon" + idMainWeapon);

            $j("#mb_arsenal_secondary").removeClass();
            $j("#mb_arsenal_secondary").addClass("mb_arsenal_weapon");
            $j("#mb_arsenal_secondary").addClass("mg_weapon" + idSecondaryWeapon);
        },

        fillPageTrophy: function(page) {

        },

        callToolTip: function(x, y, message) {
            $j("#div_tooltip").html(message);
            $j("#div_tooltip").css("left", x);
            $j("#div_tooltip").css("top", y);
        },

        hideToolTip: function(){
            $j("#div_tooltip").css("left", -1000);
            $j("#div_tooltip").css("top", -1000);
        }

    };

    return BoardController;

});
