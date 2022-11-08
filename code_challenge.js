/* FIRST EXAMPLE
@---A---+
        |
x-B-+   C
    |   |
    +---+
[@,-,--A---+],
[        |],
[x-B-+   C],
[    |   |],
[    +---+],

multiple start sam odradio

moram jos dodat missing start char
moram jos dodat missing end char

dodati jos da se u letter ne dodaje char ako je char dosao od vec prodjene pozicije, ali taj char se dodaje u PATH

pogledati compact spaces, 

// if choices veci od 1, keep direction



*/


//   console.log(items);
var testPath = "\@---A---+\n        |\nx-B-+   C\n    |   |\n    +---+";

// @
// | +-C--+
// A |    |
// +---B--+
//   |      x
//   |      |
//   +---D--+
var testPath2 = "\@\n| +-C--+\nA |    |\n+---B--+\n  |      x\n  |      |\n  +---D--+";


//PATH CHARACTERS & RULES 
const START = '@',
      END = 'x',
      HORIZONTAL = '-',
      VERTICAL = '|',
      TURN = '+';
var pathMarkers = [HORIZONTAL, VERTICAL, TURN];

var map = [];

var currentPosition= [];
// traversed path
var path = "";
// collected letters
var letters = "";
// previous positions
var prevPositions = new Array();
var lastDirection = new String();
var opposite;
var lastMove;

//choices
var choices = new Map();


// read and store input -- class MAP - takes mapString input, returns 2d array
function readInput(mapString) {
    map = mapString.split('\n').map(function(somePath){
        // console.log(somePath);
        
        return somePath.split('');
    })
   
}



// FIND START - dodat sta se dogodi ako nema @
function findStart (map) {
    //find char @
    console.log("map lengthj: " + map.length);
    for (var i = 0; i < map.length; i++ ) {
        var arr = map[i];
        // console.log("arr " + arr);
        for( var j = 0; j < arr.length; j++) {
            var char = arr[j];

            if (char == '@') {
                // console.log(char);
                //save current position
                currentPosition = [i,j]; 
                // console.log('curr: ' +currentPosition);
                // save path
                path += char;
                // make sure you dont go back
                prevPositions.push([i,j]);
                lastMove = prevPositions[prevPositions.length-1];
            }
        }
    }

    //If starting position not found -> error
    if (currentPosition.length == 0) {
        //Log no starting position
        console.log('No starting position found');
    }
}

// find next step - where to go
function findNextStep(map) {
    // 4 choices - up, down, left, right
    //dont go outside matrix -1, dont go to prev position 
    var up = [currentPosition[0] - 1, currentPosition[1]]; // watch for  error log
    var left = [currentPosition[0], currentPosition[1] -1 ];
    var down = [currentPosition[0] + 1, currentPosition[1]];
    var right = [currentPosition[0], currentPosition[1] + 1];

    // var possibleDirections = [left, up, right, down];
    var possibleDirections = [up, left, down, right];

    lastMove = prevPositions[prevPositions.length-2];

    // console.log('poss dir: ' + up);
    
    //empty choices map
    choices.clear();
    
    var directionCounter = 0;
    for (const direction of possibleDirections) {
        //to save which direction we went
        directionCounter++;
        // console.log(direction[1]);
        // returns map {} key is path marker, value is location array { }
        // console.log("direction: " + direction[0] + direction[1]);
        // console.log("smap :\n" + map[2][0]);
        // console.log(map[direction[0]][direction[1]]);
        opposite = getOppositeDirection(direction, currentPosition);

        try {
            var char = map[direction[0]][direction[1]];
          } catch (error) {
            console.error("dont go there lol");
            // expected output: ReferenceError: nonExistentFunction is not defined
            // Note - error messages will vary depending on browser
          }
        
        
        console.log('direction ' + direction);
        console.log('last move ' + lastMove);
        console.log('current pos ' + currentPosition);
        console.log('op dir  ' + opposite);
        // console.log(opposite[0]==direction[0])
        // console.log(prevPositions.length);
        // if( opposite )
        if (char == undefined) {
            console.log('wrong direciton');
        }
        else if (prevPositions.includes(direction)) { // probably makes a mistake if we were already there. wrong array check used
            console.log('was here, dont go again');
            // break;
        }
        else if (  (char.toUpperCase() != char.toLowerCase() || pathMarkers.includes(char)) && path.length <= 2) { //if letter or path marker
            // console.log('uspio sam 1' + char);
            // console.log('uspio sam 1 ' + direction);
            opposite = getOppositeDirection(direction, currentPosition);
            choices.set(char,direction);
            break;
        }
        else if ( (char.toUpperCase() != char.toLowerCase() || pathMarkers.includes(char))) {
            //check if opposite direction
            // if (lastMove[0] == opposite[0] && lastMove[1] == opposite[1]) {
            if (!(lastMove[0] == direction[0] && lastMove[1] == direction[1])) {    
                // console.log('uspio sam ' + char);
                opposite = getOppositeDirection(direction, currentPosition);
                choices.set(char,direction);
                break;
            }
            
        } 
        else {
            console.log('error');
        } 
                        
    }
}


//get opposite direction
function getOppositeDirection(direction, position) {
    
    // console.log('op pos: ' + position);
    // console.log('op dir: ' + direction);
    //defines directions, return opposites
    var up = [position[0] - 1, position[1]]; // watch out for error log
    var left = [position[0], position[1] -1 ];
    var down = [position[0] + 1, position[1]];
    var right = [position[0], position[1] + 1];

    
    if (direction[0] === up[0] && direction[1] === up[1]) 
        return down
    else if (direction[0] === down[0] && direction[1] === down[1]) 
        return up
    else if (direction[0] === left[0] && direction[1] === left[1]) 
        return right
    else if (direction[0] === right[0] && direction[1] === right[1]) 
        return left
    else
        return 'lol'

}

function walk() {
    
    //call findNextStep()
    console.log("Letter: " + letters); // provjera
    console.log("Path: " + path);
    findNextStep(map);

    
    var key = choices.keys().next().value;

    // if choices >  1, keep direction, if not, then its FORK dakle error
    // console.log("choices size: " + choices.size);
    if (choices.size < 1) { //nowhere to go, break.
        console.log("error nowhere to go");
        //empty map or fork error or multiple choices
        return "error"; 
    }
    else if(choices.size > 1){ // if we have more possible directions, keep going in the same direction
        var check = false;
        choices.forEach (function(value, key) {
            // console.log('keeeeeeeeeeeeey ' + key + ' ' + value + ' ' + lastMove + ' ' + opposite);
            if(key == '' &&  value[0] == currentPosition[0]) {
                // console.log('unutraaaa');
                // step forward
                currentPosition = value;
                //add to traversed path
                path += key;
                //add to previous positions
                prevPositions.push(currentPosition);
                check = true;
            } 
        })
        if (check == true) return "walking";
    }
    else if ( pathMarkers.includes(choices.keys().next().value) ) { //if path marker, not letter
        // if + dont go in the same direction, -> cant be opposite direction, if + LEFT, dont go RIGHT
        // korak naprijed
        currentPosition = choices.get(key);
        //dodamo u predjeni put
        path += key;
        //dodamo da smo tu bili
        prevPositions.push(currentPosition);

        return "walking";

    }
    else if (choices.keys().next().value == 'x' ) { //if end marker
        //add to traversed path
        path += key;
        //finished
        console.log('finished');

        // print letters and path
        console.log("Letter: " + letters);
        console.log("Path: " + path);

        return "im done";
    }
    else if(prevPositions.length == map.length) { //if no end marker
        // no end marker x
        console.log('no end marker');
    }
    else if (includesArray(prevPositions, choices.get(key))) { //we were already here so we add to path, but not to letters
        //add to traversed path
        path += key;
        // step forward
        currentPosition = choices.get(key);
        //add to previous positions
        prevPositions.push(currentPosition);

        return "walking";
    }
    else { //we weren't here at all, so add to path and letters
        //add to traversed path
        path += key;
        //add letter
        letters += key;
        // step forward
        currentPosition = choices.get(key);
        //add to previous positions
        prevPositions.push(currentPosition);

        return "walking";
    }

}

// array in array check (arr1 == arr2 but actually works)
const includesArray = (originArray, compareArray) => {
    return originArray.some(e => Array.isArray(e) && e.every((o, i) => Object.is(compareArray[i], o)));
  }

// MAIN RUN
// console.log(testPath);
readInput(testPath);
// console.log("map :\n" + map[2][0]);
findStart(map);
//WALK
while (walk() === "walking") {
    // walk();
}