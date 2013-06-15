define(['jquery'], function(jQuery) {

    jQuery.noConflict();
    var $j = jQuery;
    var FightController = Class.create();
    FightController.prototype = {

        initialize: function(){
        },

        initEvents: function(){

            var self = this;

            $j("#mg_fight, #mb_launch_fight").on('click', function(){

                if($j("#game_fight_board").css("display") == "none")
                {
                    socket.emit('FIGHT-getFarmersList');

                    $j("#game_main_board").fadeOut(500, function(){
                        $j("#game_fight_board").fadeIn(500);
                    });
                }
                else
                {
                    $j("#game_fight_board").fadeOut(500);
                }
            });

            $j('#fb_farmer_name').on('keyup', function(){
               socket.emit('FIGHT-findFarmerToAttack', $j(this).val());
            });
            socket.on('FIGHT-findFarmerToAttack', function(resp){
                if(resp.found)
                {
                    $j('#fb_attack_specefic_farmer').attr('src', 'img/fightBoard/attack.png');
                    $j('#fb_farmer_level').html(resp.level);
                }
                else
                {
                    $j('#fb_attack_specefic_farmer').attr('src', 'img/fightBoard/no_attack.png');
                    $j('#fb_farmer_level').html("");
                }
            });

            socket.on('FIGHT-fillFightBoard', function(resp){

                $j('#fb_title').html("Combattre un adversaire ! Crédits restant: " + resp.creditFight);

                $j('#fb_farmers_list_table tr:has(td)').remove();
                for(var i = 0; i < resp.farmers.length; i++)
                {
                    if(resp.farmers[i].name != socket.sessions.farmer.name)
                    {
                        var line = "<tr><td>" + resp.farmers[i].name + "</td><td>" + resp.farmers[i].level + "</td><td><img src='img/fightBoard/attack.png' width='20' alt='attack' class='fb_btn_attack' /></tr>";
                        $j('#fb_farmers_list_table').append(line);
                    }
                }
            });

            $j('#fb_attack_specefic_farmer').on('click', function(){
                socket.emit('FIGHT-attackFarmer', $j('#fb_farmer_name').val());
            });

            $j(document).on('click', '.fb_btn_attack', function(){
                var nameOpponent = $j(this).parent().parent().children().first().html();
                socket.emit('FIGHT-attackFarmer', nameOpponent);
            });
        }


    };

    return FightController;

});
