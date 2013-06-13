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
            //socket.emit("plantTest", { X: this.X, Y: this.Y});
            if (this.walkable){
                //si une action est sélectionnée
                var goToWork = false;
                if ( socket.sessions.selectedActionIndex != undefined ) {
                   goToWork = true;
                   // we save in session the tile clicked
                   socket.sessions.selectedActionTile = this;
                }

                $j(document).trigger('FARMER-moveFarmer', {'tile':this, 'goToWork':goToWork});
            }
            else if(this.contentTile != undefined && this.contentTile.type == "farm" && this.owner != undefined && this.owner.username == socket.sessions.currentUser.username)
            {
                $j("#game_main_board").fadeIn(500);
                socket.emit("BOARD-getPage", 1);
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
                    this.image.setOpacity(1);
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
		    if (this.walkable){
                            //si une action est sélectionnée
                            var goToWork = false;
                            if ( socket.sessions.selectedActionIndex != undefined ) {
                               goToWork = true;
                               // we save in session the tile clicked
                               socket.sessions.selectedActionTile = this;
                            }

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

                default:
                    break;
            }
        }

    };

    return Tile;
});

