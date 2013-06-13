define(['jquery'], function(jQuery) {

    jQuery.noConflict();
    var $j = jQuery;
    var TchatController = Class.create();
    TchatController.prototype = {

        initialize: function(){
        },

        initEvents: function(){

            var self = this;
            GLOBAL_TCHATCONTROLLER = new Object();

            $j('#mg_new_message').hide();

            //Submit form login
            $j('#mg_new_message').on('submit', function(event){
                event.preventDefault();
                if ($j('#mg_new_message').is(":visible")){
                    socket.emit('newMessage', {
                        message: $j('#new_message').val(),
                        username: socket.sessions["currentUser"].username,
                        position: {X: socket.sessions.farmer.X, Y:socket.sessions.farmer.Y}
                        });
                    }
                });

            $j(document).on('keypress', function(e) {
                // Enter pressed?
                if(e.which == 10 || e.which == 13) {
                if (socket.sessions["currentUser"] != undefined){
                    event.preventDefault();
                    if ($j('#mg_new_message').is(":visible")){
                        if ($j('#new_message').val() != ""){
                            $j('#mg_new_message').submit();
                        }
                        $j('#mg_new_message').hide();
                        $j('#mg_new_message').each(function(){
                        	        this.reset();
                        	});
                    } else {
                        $j('#mg_new_message').show();
                        $j('#new_message').focus();
                    }
                }
                }
            });

            socket.on('tchatMessage', function(resp){
                $j('#mg_infoList').append('<p tabindex="1" class="chatContent"><span class="chatUser">'+resp.username+' : </span><span class="chatMessage">'+resp.message+'</span></p>');
                $j('#mg_notifications_area').animate({scrollTop: $j(".chatContent:last").offset().top}, 'slow');

            });

        }


    };

    return TchatController;

});
