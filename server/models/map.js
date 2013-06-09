var mongoose    = require("mongoose"),
    db          = require('../lib/db');

//=================================================
// Map
//
// Represent the map
//=================================================

// load the Tile object
var Tile = require('./tile.js');

// class constructor
var Map = function(side){

    if(typeof(side)=="undefined"){
        side=5;
    }
    this.side = side;
    this.nbTiles = Math.pow(this.side,2);
    this.currentNbOfTiles = 0;
    this.tiles = new Object();

    this.minX = 0;
    this.minY = 0;

    this.lastInsertedTile;

    //loop of moves used to insert new tile
    this.moves = new Array("right", "bottom", "left", "top");
    this.nextMove = 0;

    this.currentIteration = 0;
    this.maxIteration = 1;
    this.incrementMaxIteration = 0;

    // get the existing map
    // by getting its farmers

    var nbFarmers = this.numberOfFarms();
    if ( nbFarmers > 0 )
    {
        // TODO
        // the map exist
        // we load it
    }
    else
    {
        // we add a the first farmer to the map
        //we populate the table of tile
        var i;
        for(i=0;i<this.nbTiles;i++){
            this.addTile(this.getNextTile());
            this.currentNbOfTiles++;
        }
    }
};

// class methods
Map.prototype = {

    print : function(){
        var i,j;
        for(i=this.minX;i<=Math.abs(this.minX);i++){
            for(j=this.minY;j<=Math.abs(this.minY);j++){
                this.tiles[i][j].print();
            }
        }
    },

    addTile : function(tile){
        var nextTile;
        if (typeof(tile)=="undefined" || ! tile instanceof Tile){
            nextTile = this.getNextTile();
        } else {
            nextTile = tile;
        }
        if(typeof(this.tiles[tile.x]) == "undefined"){
            this.tiles[nextTile.x] = new Object();
        }
        this.tiles[nextTile.x][nextTile.y] = nextTile;
        this.lastInsertedTile = nextTile;

        if (nextTile.x < this.minX){
            this.minX=nextTile.x;
        }

        if (nextTile.y < this.minY){
            this.minY=nextTile.y;
        }

        if (this.currentNbOfTiles>0){

            this.currentIteration++;

            if ( this.currentIteration == this.maxIteration ) {
                this.incrementMaxIteration++;
                this.currentIteration=0;
                this.nextMove++;
            }

            if ( this.incrementMaxIteration == 2 ) {
                this.maxIteration++;
                this.incrementMaxIteration = 0;
            }

            //loop trough the moves
            if( this.nextMove == this.moves.length ) {
                this.nextMove = 0;
            }

        }

    },

    getNextTile : function(){
        var tile = new Tile();
        if( this.currentNbOfTiles > 0)
        {
            lastTile = this.lastInsertedTile;
            switch(this.moves[this.nextMove]){
                case "right":
                    tile.x = lastTile.x + 1;
                    tile.y = lastTile.y;
                    break;
                case "bottom":
                    tile.x = lastTile.x;
                    tile.y = lastTile.y + 1;
                    break;
                case "left":
                    tile.x = lastTile.x - 1;
                    tile.y = lastTile.y;
                    break;
                case "top":
                    tile.x = lastTile.x;
                    tile.y = lastTile.y - 1;
                    break;
                default:
                    break;
            }
        }
        return tile;
    },

    // add a new farm
    addFarm : function(){
        console.log(this.numberOfFarms());
    },

    // get the next farm position to insert
    getNextFarmPosition : function(){

    },

    // return the number of farms created on the map
    numberOfFarms : function(){
        return 0;
    }
};

// export the object to make it accessible via the require function
module.exports = Map;

