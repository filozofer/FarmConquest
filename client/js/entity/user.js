
define(function(){

    var User = Class.extend({

            create : function (username, mail, password, dateOfCreation){
                this.username = username;
                this.mail = mail;
                this.password = password;
                this.dateOfCreation = dateOfCreation;
            },

            createLogin : function(username, password){
                this.username = username;
                this.password = password;
            }

    });

    return User;
});
