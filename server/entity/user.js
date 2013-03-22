
var cls = require("../lib/class");

function User(username, mail, password, dateOfCreation) {
  this.username = username;
  this.mail = mail;
  this.password = password;
  this.dateOfCreation = dateOfCreation;

  //Methods....
  //this.checkSomething = checkSomething();
}
module.exports = User = cls.Class.extend({

    create : function(username, password){
        this.username = username;
        this.password = password;
    },

    createFullParamaters : function (username, mail, password, dateOfCreation){
        this.username = username;
        this.mail = mail;
        this.password = password;
        this.dateOfCreation = dateOfCreation;
    }

});