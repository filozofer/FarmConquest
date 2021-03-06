/**
 * Created with IntelliJ IDEA.
 * User: Maxime
 * Date: 26/03/13
 * Time: 12:21
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose');

module.exports = function () {

    if(typeof process.env.OPENSHIFT_NODEJS_IP === "undefined")
    {
        //LOCAL DATABASE
        var database = mongoose.connect('mongodb://127.0.0.1/FarmConquest',
            function(err) {
                if (err) { throw err; }
            }
        );
    }
    else
    {
        //PRODUCTION DATABASE
        var database = mongoose.connect('mongodb://admin:_GbXzbqKNDqS@5149baae5973caaf18000239-conquest.rhcloud.com:59616/farm',
            function(err) {
                if (err) { throw err; }
            }
        );
    }


    return database;
};
