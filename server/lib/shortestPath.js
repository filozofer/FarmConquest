ShortestPath = function(world, start, finish){

	Array.prototype.disorder= function(){
    	var i, temp, L= this.length, A= this.concat();
    	while(--L){
    		i= Math.floor(Math.random()*L);
    		temp= A[i];
    		A[i]= A[L];
    		A[L]= temp;
    	}
    	return A;
    }

     this.world = world;
     this.start = start;
     this.finish = finish;

     this.start.G=0;
     this.start.H = (Math.abs(this.finish.Y - this.start.Y) + Math.abs(this.finish.X - this.start.X))*10;
     this.start.F = this.start.G + this.start.H;
     this.finish.H=0;

     this.openList = new Array();
     this.closeList = new Array();
     this.shortestPath = new Array();
     this.pathNotFound = true;
     this.currentSquare = new Object();

     this.caseDroite = new Object();
     this.caseBas = new Object();
     this.caseGauche = new Object();
     this.caseHaut = new Object();

     this.calculatePath = function(){
         var self = this;


         this.openList.push(this.start);

         while(this.openList.lenght != 0 || pathNotFound){
         	// case avec le plus petit F=G+H
         	this.currentSquare = this.openList[0];
         	this.openList.shift();
         	if (this.currentSquare.X == this.finish.X && this.currentSquare.Y == this.finish.Y){
         		pathNotFound = false;
         		//ENREGISTRER LE CHEMIN
         		this.getEveryParentFromCurrentSquare(this.currentSquare);
         		break;
         	}
         	this.closeList.push(this.currentSquare);


         	if (this.world[this.currentSquare.X+1] != undefined){
         		this.caseDroite = this.world[this.currentSquare.X+1][this.currentSquare.Y];
         	}
         	if (this.world[this.currentSquare.X][this.currentSquare.Y+1] != undefined){
         		this.caseBas = this.world[this.currentSquare.X][this.currentSquare.Y+1];
         	}
         	if (this.world[this.currentSquare.X-1][this.currentSquare.Y] != undefined){
         		this.caseGauche = this.world[this.currentSquare.X-1][this.currentSquare.Y];
         	}
         	if (this.world[this.currentSquare.X][this.currentSquare.Y-1] != undefined){
         		this.caseHaut = this.world[this.currentSquare.X][this.currentSquare.Y-1];
         	}

         	var casesToCheck = new Array();
         	casesToCheck.push(this.caseDroite);
         	casesToCheck.push(this.caseBas);
         	casesToCheck.push(this.caseGauche);
         	casesToCheck.push(this.caseHaut);

         	//RANDOMIZE THE CASE CHECKING
         	casesToCheck = this.shuffleArray(casesToCheck);

         	//CHECK GOOD PARENT
         	for(var i in casesToCheck){
         		this.verifyCase(casesToCheck[i]);
         	}



         }

         if(this.shortestPath.length != 0){
         		//console.log("PATH FOUND");
         }
     }

    this.verifyCase = function (caseToCheck){
    	if (caseToCheck.walkable && this.isNotInsideCloseList(caseToCheck)){
    		if(this.isNotInsideOpenList(caseToCheck)){
    			caseToCheck.parent = this.currentSquare;
    			caseToCheck.G = caseToCheck.parent.G + 10;
    			caseToCheck.H = (Math.abs(this.finish.Y - caseToCheck.Y) + Math.abs(this.finish.X - caseToCheck.X))*10;
    			caseToCheck.F = caseToCheck.G + caseToCheck.H;
    			if (this.openList[0] != undefined && caseToCheck.F < this.openList[0].F){
    				this.openList.unshift(caseToCheck);
    			}
    			else{
    				this.openList.push(caseToCheck);
    			}
    		}
    		else{
    			if ((caseToCheck.G + 10) < this.currentSquare.G){
    				this.currentSquare.parent = caseToCheck;
    			}
    		}
    	}
    }

    this.getEveryParentFromCurrentSquare = function (lastSquare){
    	var pathCreated = false;

    	this.shortestPath.push(lastSquare);
    	var childCase = lastSquare;

    	while (!this.pathCreated){
    		var pathCase = childCase.parent;
    		if (pathCase.X == this.start.X && pathCase.Y == this.start.Y){
    			this.pathCreated = true;
    			break;
    		}
    		this.shortestPath.unshift(pathCase);
    		childCase = pathCase;
    	}
    }

    this.isNotInsideCloseList = function (caseToAnalyse){
    	if (this.closeList.indexOf(caseToAnalyse) != -1){
    		return false;
    	}
    	else{ return true; }
    }

    this.isNotInsideOpenList = function (caseToAnalyse){
    	if (this.openList.indexOf(caseToAnalyse) != -1){
    		return false;
    	}
    	else{ return true; }
    }

    this.shuffleArray = function ( myArray ) {
      var i = myArray.length, j, tempi, tempj;
      if ( i === 0 ) return false;
      while ( --i ) {
         j = Math.floor( Math.random() * ( i + 1 ) );
         tempi = myArray[i];
         tempj = myArray[j];
         myArray[i] = tempj;
         myArray[j] = tempi;
       }
       return myArray;
    }



     this.calculatePath();
};

module.exports = ShortestPath;