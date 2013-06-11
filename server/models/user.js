var mongoose    = require("mongoose"),
    Schema      = mongoose.Schema;

//=================================================
// class:       User
// description: Represent User of the application
//              (account for player)
//=================================================

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

User.methods.getAsObject = function(){

    var object = new Object();
    object._id = this._id;
    object.username = this.username;
    object.password = this.password;
    object.mail = this.mail;
    object.dateOfCreation = this.dateOfCreation;
    return object;
}

mongoose.model('User', User);


