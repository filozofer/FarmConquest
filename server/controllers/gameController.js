
/*
 Game Controller class
 */
GameController = function(socket, db, mongoose){

    //Models

    socket.on('getMapToDraw', function(){

        //TEMP - WORLD GENERATION
        var world = new Object();

        var worldDimension = new Object();

        //TEMP
        worldDimension.minX = -36;
        worldDimension.minY = -36;
        worldDimension.maxX = 36;
        worldDimension.maxY = 36;

        for(var i = worldDimension.minX; i<worldDimension.maxX; i++){
            world[i] = new Object();
            for (var j=worldDimension.minY; j<worldDimension.maxY; j++){
                world[i][j] = new Object();
                world[i][j].X = i;
                world[i][j].Y = j;
            }
        }
        var center = new Object();
        center.X = 0;
        center.Y = 0;
        world.center = center;

        var position = new Object();
        position.X = 0;
        position.Y = 0;
        world = putFarm(world, position);

        //Temp stock world
        socket.sessions.World = world;

        socket.emit('drawMap', {'worldToDraw': world, 'dimension': worldDimension});

    });

    function putFarm(world, position) {

        var errors = false;

        //Create Farm
        var farm = new Object();
        farm.type = "farm";
        farm.mainPos = position;
        farm.name = "Ferme";
        farm.description = "Bâtiment principal";

        //Set Owner
        farm.owner = socket.sessions.user;

        //Set locations of the farm
        farm.locations = new Array();
        for(var i = position.X; i < position.X + 2; i++)
        {
            for(var j = position.Y; j < position.Y + 2; j++)
            {
                var pos = new Object();
                pos.X = i;
                pos.Y = j;
                farm.locations.push(pos);
            }
        }

        //Add farm in the world
        for(var i=0; i<farm.locations.length; i++)
        {
            var pos = farm.locations[i];
            if(world[pos.X] != undefined && world[pos.X][pos.Y] != undefined)
            {
                world[pos.X][pos.Y].contentTile = farm;
            }
            else
            {
                errors = true;
            }
        }

        //Return farm
        if(errors)
        {
            return false;
        }
        else
        {
            return world;
        }
    }

    socket.on('plantTest', function(request) {
        var world = socket.sessions.World;

        if(world[request.X] != undefined && world[request.X][request.Y] != undefined)
        {
            var seed = new Object();
            seed.X = request.X;
            seed.Y = request.Y;
            seed.type = "seed";
            seed.owner = socket.sessions.user;
            seed.name = "Avoine";
            seed.description = "Niv. 1";
            world[request.X][request.Y].contentTile = seed;
            socket.emit('drawElement', { element: seed });
        }

    });


    socket.on('worldInitTest', function(request){
        //Init the world

        G.World = new Object();

        var Tile = mongoose.model("Tile");

        //Get all tiles in bdd
        Tile.find({}).exec(function(err, tiles){

            for(var i = 0; i < tiles.length; i++)
            {
                addTileToTheWorld(tiles[i]);
            }

        });

    });

    function addTileToTheWorld(tileSend){

        var Tile = mongoose.model("Tile");
        var User = mongoose.model("User");
        var ContentTile = mongoose.model("ContentTile");

        var tileTo = tileSend.toObject();
        var tileAsObject = tileSend.getAsObject();

        if(tileTo.owner != null && typeof(tileTo.owner._bsontype) == "string")
        {
            User.findById(tileTo.owner).select('username').exec(function(err, user){
                tileAsObject.owner = user.getAsObject();

                if(tileTo.contentTile != null && typeof(tileTo.contentTile._bsontype) == "string")
                {
                    ContentTile.findById(tileTo.contentTile).populate("owner locations mainPos").exec(function(err, contentTileDB){
                        tileAsObject.contentTile = contentTileDB.getAsObject();

                        if(G.World[tileTo.X] == undefined){ G.World[tileTo.X] = new Object(); }
                        G.World[tileTo.X][tileTo.Y] = tileAsObject;
                    });
                }
                else
                {
                    if(G.World[tileTo.X] == undefined){ G.World[tileTo.X] = new Object(); }
                    G.World[tileTo.X][tileTo.Y] = tileAsObject;
                }
            });
        }
        else
        {
            if(G.World[tileTo.X] == undefined){ G.World[tileTo.X] = new Object(); }
            G.World[tileTo.X][tileTo.Y] = tileAsObject;
        }

    }

};

module.exports = GameController;




