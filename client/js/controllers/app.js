

define(function() {

    var App = Class.create();
    App.prototype = {

        initialize: function(){},

        init: function(){
            var socket = io.connect('http://localhost:1337');
             return socket;
         },

        center: function() {
            window.scrollTo(0, 1);
        }

    };

    return App;
});