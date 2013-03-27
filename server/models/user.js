

var mongoose = require("mongoose");
Schema = mongoose.Schema;

/*
    class: User
    description: represent User of the application (account for player)
 */
var User = new Schema({
    username : String,
    mail: String,
    password: String,
    dateOfCreation: { type: Date, default: Date.now }
});

//Constructor simple
User.methods.create = function(username, password){
    this.username = username;
    this.password = password;
}

//Constructor full
User.methods.createFullParameters = function (username, mail, password, dateOfCreation){
    this.username = username;
    this.mail = mail;
    this.password = password;
    this.dateOfCreation = dateOfCreation;
}

User.methods.speak = function (){
    console.log("I am " + this.username + " !");
}

mongoose.model('User', User);


