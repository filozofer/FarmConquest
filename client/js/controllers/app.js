

//Import Entity
//var User = require(['entity/user']);

define(['jquery'], function($) {

    var App = Class.extend({

         init: function(){
            var socket = io.connect('http://localhost:1337');
             return socket;
         },

        center: function() {
            window.scrollTo(0, 1);
        }

    });

    return App;
});