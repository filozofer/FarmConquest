
/*
 Game Controller class
 */
GameController = function(socket, db, mongoose){

    //Models

    socket.on('getMapToDraw', function(){

        //TEMP - WORLD GENERATION
        var world = new Object();
        for(var i = -25; i<25; i++){
            world[i] = new Object();
            for (var j=-25; j<25; j++){
                world[i][j] = new Object();
                world[i][j].X = i;
                world[i][j].Y = j;
            }
        }
        socket.emit('drawMap', {'worldToDraw': world});
    });

};

module.exports = GameController;




