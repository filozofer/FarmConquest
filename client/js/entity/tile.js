define(['jquery'], function(jQuery){

    var $j = jQuery.noConflict();

	var Tile = Class.create();
	Tile.prototype = {

		initialize: function(X, Y){
			this.X = X;
			this.Y = Y;
			this.image = undefined;
            this.contentTile = undefined;
			this.walkable = true;
            this.owner = undefined;
            this.humidity = undefined;
            this.fertility = undefined;
		},

		clickEvent: function(){
            if (this.walkable){
                if (!socket.sessions.farmer.isWorking){
                    if(socket.sessions.farmer.isHarvesting){
                        socket.sessions.farmer.isHarvesting = false;
                    }
                    //si une action est sélectionnée
                    var goToWork = false;
                    //BOARD ACTION
                    if ( socket.sessions.selectedActionIndex != undefined && socket.sessions.farmer.name == this.owner.name) {
                       goToWork = true;
                       // we save in session the tile clicked
                       socket.sessions.selectedActionTile = this;
                    }
                    //SEED ACTION
                    else if (socket.sessions.farmer.name == this.owner.name && socket.sessions.farmer.isFarming){
                        goToWork = true;
                        $j("body").css('cursor','url("../img/cursors/main.cur"), progress');
                        // we save in session the tile clicked
                        socket.sessions.selectedActionTile = this;
                    }
                    else if (socket.sessions.farmer.name == this.owner.name && socket.sessions.farmer.isBuilding){
                        goToWork = true;
                        $j("body").css('cursor','url("../img/cursors/main.cur"), progress');
                        // we save in session the tile clicked
                        socket.sessions.selectedActionTile = this;
                    }
                    socket.sessions.positionClick = {X: this.XPx, Y: this.YPx};
                    if(!(socket.sessions.farmer.X == this.X && socket.sessions.farmer.Y == this.Y)){
                        $j(document).trigger('FARMER-moveFarmer', {'tile':this, 'goToWork':goToWork});
                    }
                }
            }
            else if(this.contentTile != undefined && this.contentTile.type == "farm" && this.owner != undefined && this.owner.name == socket.sessions.farmer.name)
            {
                $j("#game_main_board").fadeIn(500);
                socket.emit("BOARD-getPage", 1);
            }
            else if(this.contentTile != undefined && (this.contentTile.type == app.Config.tileType.grangeP || this.contentTile.type == app.Config.tileType.grangeM || this.contentTile.type == app.Config.tileType.grangeG))
            {
               //if:  && this.owner != undefined && this.owner.name == socket.sessions.farmer.name
                var mainPos  = this.contentTile.mainPos;
                socket.emit('GAME-getBuildingContent', { mainPos: mainPos, tile: this });
            }

		},


		mouseOverEvent: function(){
            if(this.image != undefined)
            {
                this.image.setOpacity(0.5);
            }
            else
            {
                if (this.contentTile != undefined){
                    var mainPos = this.contentTile.mainPos;
                    app.World[mainPos.X][mainPos.Y].image.setOpacity(0.5);
                }
            }

            $j(document).trigger('TILE-mouseOver', {X: this.X, Y: this.Y});
		},

		mouseOutEvent: function(){
            var opacityToSet = true;

            //Case farmer behind building
            if(socket.sessions.tilesMissOpacity != undefined)
            {
                var tiles = socket.sessions.tilesMissOpacity;
                for(var i = 0; i < tiles.length; i++)
                {
                    if(this.X == tiles[i].X && this.Y == tiles[i].Y)
                    {
                        opacityToSet = false;
                    }
                }
            }

            if(opacityToSet)
            {
                if(this.image != undefined)
                {
                     if (this.contentTile != undefined){
                        if (this.contentTile.state != 3){
                            this.image.setOpacity(1);
                        }
                     } else {
                        this.image.setOpacity(1);
                     }
                }
                else
                {
                    if (this.contentTile != undefined){
                        var mainPos = this.contentTile.mainPos;
                        app.World[mainPos.X][mainPos.Y].image.setOpacity(1);
                    }
                }
            }
		},

		rightClickEvent: function(){
		    if (this.contentTile != undefined && this.contentTile.type == app.Config.tileType.seed){
                //si une action est sélectionnée

                goToWork = true;
                socket.sessions.farmer.isHarvesting = true;
                // we save in session the tile clicked
                socket.sessions.selectedActionTile = this;

                socket.sessions.positionClick = {X: this.XPx, Y: this.YPx};

                $j(document).trigger('FARMER-moveFarmer', {'tile':this, 'goToWork':goToWork});
            }
		},

        setContentTile: function(contentTile){
            if(contentTile == undefined)
                return null;

            this.contentTile = contentTile;

            if(this.contentTile.owner != undefined)
                this.owner = this.contentTile.owner;

            switch(contentTile.type)
            {
                case "farm":
                    this.walkable = false;

                    if(this.contentTile.mainPos.X == this.X && this.contentTile.mainPos.Y == this.Y)
                    {
                        app.TileBehindBuilding.push({X: this.X-1, Y: this.Y-1, tileA: this, locations: this.contentTile.locations}); // -1, -1
                        app.TileBehindBuilding.push({X: this.X-1, Y: this.Y, tileA: this, locations: this.contentTile.locations});   // -1, 0
                        app.TileBehindBuilding.push({X: this.X-2, Y: this.Y, tileA: this, locations: this.contentTile.locations});   // -2, 0
                        app.TileBehindBuilding.push({X: this.X-2, Y: this.Y-1, tileA: this, locations: this.contentTile.locations}); // -2, -1
                        app.TileBehindBuilding.push({X: this.X-2, Y: this.Y-2, tileA: this, locations: this.contentTile.locations}); // -2, -2
                        app.TileBehindBuilding.push({X: this.X-3, Y: this.Y-2, tileA: this, locations: this.contentTile.locations}); // -3, -2
                        app.TileBehindBuilding.push({X: this.X-2, Y: this.Y-3, tileA: this, locations: this.contentTile.locations}); // -2, -3
                        app.TileBehindBuilding.push({X: this.X-1, Y: this.Y-2, tileA: this, locations: this.contentTile.locations}); // -1, -2
                        app.TileBehindBuilding.push({X: this.X, Y: this.Y-1, tileA: this, locations: this.contentTile.locations});   //  0, -1
                        app.TileBehindBuilding.push({X: this.X-1, Y: this.Y+1, tileA: this, locations: this.contentTile.locations}); // -1, 1
                    }
                    break;

                case "seed":
                    this.walkable = true;
                    break;

                case app.Config.tileType.grangeP:
                    this.walkable = false;

                    if(this.contentTile.mainPos.X == this.X && this.contentTile.mainPos.Y == this.Y)
                    {
                        app.TileBehindBuilding.push({X: this.X-1, Y: this.Y, tileA: this, locations: this.contentTile.locations}); // -1, 0
                        app.TileBehindBuilding.push({X: this.X-1, Y: this.Y-1, tileA: this, locations: this.contentTile.locations});   // -1, -1
                    }
                    break;

                case app.Config.tileType.grangeM:
                    this.walkable = false;

                    if(this.contentTile.mainPos.X == this.X && this.contentTile.mainPos.Y == this.Y)
                    {
                        app.TileBehindBuilding.push({X: this.X-1, Y: this.Y-1, tileA: this, locations: this.contentTile.locations}); // -1, -1
                        app.TileBehindBuilding.push({X: this.X-1, Y: this.Y, tileA: this, locations: this.contentTile.locations});   // -1, 0
                        app.TileBehindBuilding.push({X: this.X-1, Y: this.Y+1, tileA: this, locations: this.contentTile.locations});   // -1, +1
                    }
                    break;

                case app.Config.tileType.grangeG:
                    this.walkable = false;

                    if(this.contentTile.mainPos.X == this.X && this.contentTile.mainPos.Y == this.Y)
                    {
                        app.TileBehindBuilding.push({X: this.X-2, Y: this.Y-2, tileA: this, locations: this.contentTile.locations});    // -2, -2
                        app.TileBehindBuilding.push({X: this.X-2, Y: this.Y-1, tileA: this, locations: this.contentTile.locations});    // -2, -1
                        app.TileBehindBuilding.push({X: this.X-2, Y: this.Y, tileA: this, locations: this.contentTile.locations});      // -2, 0
                        app.TileBehindBuilding.push({X: this.X-2, Y: this.Y+1, tileA: this, locations: this.contentTile.locations});    // -2, +1
                        app.TileBehindBuilding.push({X: this.X-1, Y: this.Y-2, tileA: this, locations: this.contentTile.locations});    // -1, -2
                        app.TileBehindBuilding.push({X: this.X-1, Y: this.Y-1, tileA: this, locations: this.contentTile.locations});    // -1, -1
                        app.TileBehindBuilding.push({X: this.X-1, Y: this.Y, tileA: this, locations: this.contentTile.locations});      // -1, 0
                        app.TileBehindBuilding.push({X: this.X-1, Y: this.Y+1, tileA: this, locations: this.contentTile.locations});    // -1, +1
                        app.TileBehindBuilding.push({X: this.X-1, Y: this.Y+2, tileA: this, locations: this.contentTile.locations});    // -1, +2
                        app.TileBehindBuilding.push({X: this.X, Y: this.Y-1, tileA: this, locations: this.contentTile.locations});      // 0, -1
                    }
                    break;

                default:
                    break;
            }
        }

    };

    return Tile;
});

