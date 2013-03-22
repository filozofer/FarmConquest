(function($){

    //Config Server
    var socket = io.connect('http://localhost:1337');

    //Import Entity
    //var User = require(['entity/user']);

    $('#loginForm').on('submit', function(event){
        event.preventDefault();
        var userLogin = new User();
        userLogin.createLogin($("#usernameLoginInput").val(), $("#passwordLoginInput").val());
        socket.emit('login', userLogin);
    });

})(jQuery);