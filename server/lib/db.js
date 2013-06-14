/**
 * Created with IntelliJ IDEA.
 * User: Maxime
 * Date: 26/03/13
 * Time: 12:21
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('mongoose');

module.exports = function () {
    var database = mongoose.connect('mongodb://127.0.0.1/FarmConquest',
        function(err) {
            if (err) { throw err; }
        }
    );
    return database;
};
