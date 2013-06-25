define(['jquery', '../lib/jquery-ui'], function(jQuery, ui) {

    jQuery.noConflict();
    var $j = jQuery;
    var FightController = Class.create();
    FightController.prototype = {

        initialize: function(){
        },

        initEvents: function(){

            var self = this;

            $j("#mg_fight, #mb_launch_fight, #mb_quit_fight_board_button").on('click', function(){
                $j('#fb_farmer_name').val("");
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

            socket.on('FIGHT-fightTransmission', function(resp){
                if(resp.money != undefined)
                {
                    $j('#mg_money_joueur').text(resp.farmer.money);
                }

                self.playPreFight(resp.fight, self);
            });

            $j(document).on('mouseenter mouseleave', "#fui_leave", function(ev){
                var mouse_is_inside = ev.type === 'mouseenter';
                if(mouse_is_inside)
                    $j("#fui_leave").attr('src', "img/gameBoard/cross_active_button.png");
                else
                    $j("#fui_leave").attr('src', "img/gameBoard/cross_clean_button.png");
            });
            $j('#fui_leave').on('click', function(){
                $j('#game_fight_ui_window').hide();
                //Call cleaner
                self.cleanFight(self);
            });

            $j('#mg_conquest, #mg_credits_conquest').on('click', function(event){
                event.preventDefault();

                //Change cursor
                var cursorName = "cursor_conquest.png";
                $j("body").css('cursor','url("../img/cursors/'+cursorName+'"), progress');

                //Switch on/off fonctionnality (border + set in sessions)
                if ($j(this).hasClass('active'))
                {
                    $j(this).removeClass('active');
                    socket.sessions.selectedActionIndex = undefined;
                    $j("body").css('cursor','url("../img/cursors/main.cur"), progress');
                }
                else
                {
                    $j('.action_btn').removeClass('active');
                    $j(this).addClass('active');
                    socket.sessions.selectedActionIndex = $j(this).val();
                    if(socket.sessions.selectedActionIndex == "")
                        socket.sessions.selectedActionIndex = $j(this).attr('value');
                }
            });
        },

        playPreFight: function(fight, self){


            $j('#game_fight_board').hide();
            $j('#game_main_board').hide();
            $j('#pre_fight_fui_left').hide();
            $j('#pre_fight_fui_right').hide();
            $j('#pre_fight_fui_left_farmer').hide();
            $j('#pre_fight_fui_right_farmer').hide();
            $j('#pre_fight_fui').show();
            $j('#pre_fight_fui_left_bar').html(fight.farmerAttacker);
            $j('#pre_fight_fui_right_bar').html(fight.farmerDefender);

            $j('#game_fight_ui_window').fadeIn(500, function(){
                $j('#pre_fight_fui_left').fadeIn(1000);
                $j('#pre_fight_fui_right').fadeIn(1000, function(){
                    $j('#pre_fight_fui_left_farmer').fadeIn(500);
                    $j('#pre_fight_fui_right_farmer').fadeIn(500, function(){
                        setTimeout(function(){
                            $j('#pre_fight_fui').hide();
                            self.playFight(fight, self);
                        }, 1000);
                    });

                });
            });

        },

        playFight: function(fight, self){

            //Name + Life
            $j('#fui_heath_valueA').html(fight.farmerAttackerLife + " / " + fight.farmerAttackerLife);
            $j('#fui_heath_valueD').html(fight.farmerDefenderLife + " / " + fight.farmerDefenderLife);
            $j('#fui_nameA').html(fight.farmerAttacker);
            $j('#fui_nameD').html(fight.farmerDefender);


            //Weapons
            $j('#fui_weapon_mainA').removeClass();
            $j('#fui_weapon_supportA').removeClass();
            $j('#fui_weapon_mainD').removeClass();
            $j('#fui_weapon_supportD').removeClass();
            $j('#fui_weapon_mainA').addClass('mb_arsenal_weapon mg_weapon' + fight.farmerAttackerMainWeapon);
            $j('#fui_weapon_supportA').addClass('mb_arsenal_weapon mg_weapon' + fight.farmerAttackerSupportWeapon);
            $j('#fui_weapon_mainD').addClass('mb_arsenal_weapon mg_weapon' + fight.farmerDefenderMainWeapon);
            $j('#fui_weapon_supportD').addClass('mb_arsenal_weapon mg_weapon' + fight.farmerDefenderSupportWeapon);

            $j('#container_fui').fadeIn(200);

            //Prepare
            fight.lifeA = fight.farmerAttackerLife;
            fight.lifeD = fight.farmerDefenderLife;
            fight.leftOld = 0;
            self.fight = fight;
            fight.over = false;

            setTimeout(function(){
                self.animateActions(fight.actionsFights, fight.actionsFights.length, self, fight, function(){
                    var farmerToDelete = (fight.farmerAttacker == fight.winnerName) ? "D" : "A";
                    $j('#fui_farmer' + farmerToDelete).fadeOut(1000, function(){
                        var result = fight.winnerName + " a gagné ! <br />";
                        result += "L'attaquant gagne " + fight.rewardMoneyAtt + " d'argent et " + fight.creditConquest + " crédit(s) de conquête ! <br />";
                        var winLose = (fight.winnerName = fight.farmerDefender) ? "perd" : "gagne";
                        result += "Le defenseur " + winLose + " " + fight.rewardMoneyDef + " d'argent !";

                        $j('#fui_result').html(result);
                        $j('#fui_result').show();
                    });

                });
            }, 2000);
        },

        animateActions : function(actions, total, self, fight, callback){
            var action = actions.pop();

            if(fight.lifeA > 0 && fight.lifeD > 0)
            {
                //PLAYACTION
                var f1 = (action.nameAttacker == fight.farmerAttacker) ? "A" : "D";
                var f2 = (action.nameAttacker == fight.farmerAttacker) ? "D" : "A";
                var f1MaxLife = (action.nameAttacker == fight.farmerAttacker) ? fight.farmerAttackerLife : fight.farmerDefenderLife;
                var f2MaxLife = (action.nameAttacker == fight.farmerAttacker) ? fight.farmerDefenderLife : fight.farmerAttackerLife;
                var d1 = (action.nameAttacker == fight.farmerAttacker) ? "+=30" : "-=30";
                var d2 = (action.nameAttacker == fight.farmerAttacker) ? "-=30" : "+=30";

                $j('#fui_farmer' + f1).animate({
                    left: d1
                }, 200, function(){
                    $j('#fui_farmer' + f1).animate({
                        left: d2
                    }, 200);
                });

                $j('#fui_notif').show();
                $j('#fui_notif').removeClass();
                $j('#fui_notif').addClass('fui_weapon' + action.idWeapon);
                $j('#fui_notif').show();
                setTimeout(function(){ $j('#fui_notif').fadeOut(500); }, 1000);

                if(action.hit)
                {
                    //$j('#fui_farmer' + f2).effect("highlight", {}, 400);
                    self.blink(3, f2, self);

                    fight['life' + f2] -= action.damageWeapon;
                    $j('#fui_heath_value' + f2).html(fight['life' + f2] + " / " + f2MaxLife);
                    var widthActual = parseFloat($j('#fui_lifeBarGreen' + f2).css('width').replace('px', ''));
                    var widthMaxBarLife = 250; //Max width of the life bar
                    var widthBarLife = fight['life' + f2] * widthMaxBarLife / f2MaxLife;

                    var diff = '-=' + (widthActual - widthBarLife) + 'px';
                    var diffLeft = '0px';

                    $j('#fui_lifeBarGreen' + f2).animate({
                        width: diff,
                        left: diffLeft
                    }, 200);
                }
                else
                {
                    $j('#fui_farmer' + f2).animate({
                        left: d1
                    }, 200, function(){
                        $j('#fui_farmer' + f2).animate({
                            left: d2
                        }, 200);
                    });
                }
            }

            if (--total && fight.over != true)
                setTimeout(function(){self.animateActions(actions, actions.length, self, fight, callback);}, 2000);
            else if(!fight.over) //Someone has click the cross to quit the fight
                callback();
        },

        blink: function(nb, f2, self){
            $j('#fui_farmer' + f2).animate({
                opacity: '-=0.3'
            }, 200, function(){
                $j('#fui_farmer' + f2).animate({
                    opacity: '+=0.7'
                }, 200, function(){
                    nb--;
                    if(nb > 0)
                    {
                        self.blink(nb, f2,  self);
                    }
                });
            });
        },

        cleanFight: function(self){
            $j('#fui_result').hide();
            $j('#container_fui').hide();
            $j('#fui_lifeBarGreenA').css('width', '250px');
            $j('#fui_lifeBarGreenD').css('width', '250px');
            $j('#fui_lifeBarGreenD').css('left', '0px');
            $j('#fui_farmerA').show();
            $j('#fui_farmerD').show();
            $j('#fui_result').hide();
            self.fight.over = true;
        }


    };

    return FightController;

});
