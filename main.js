import {Board} from "./board.js";

const body = document.querySelector("main");
let horizontal = true;
const carrierBtn = document.getElementById("carrier");
const battleshipBtn = document.getElementById("battleship");
const cruiserBtn = document.getElementById("cruiser");
const submarineBtn = document.getElementById("submarine");
const destroyerBtn = document.getElementById("destroyer");
const rotate = document.getElementById("rotate");
let gameStarted = false;
let totalShips = 5;
let currentShip = 0;
let currentButton = null;
let currentBoatNum = -1;

const highlightedDivs = [];

function validConsts(){
    return currentBoatNum > 0 && currentShip > 0 && totalShips > 0;
}

//returns the whole board as node
function createBoard(player=true){
    let div = document.createElement("div");
    div.style="margin:2rem;"
    for(let i = 0; i < 10; i++){
        let s=createRow(i, player);
        div.appendChild(s);
    }

    return div;
}

function createRow(row, player=true){
    let sect = document.createElement("section");
    for(let i = 0; i < 10; i++){
        let d = createDiv("empty", row, i, player);
        sect.appendChild(d);
    }

    sect.style="display:flex;"

    return sect;
}

function highlightDivs(list, spaces, mainDiv, isHorizontal = true){
    
    
    let coords = getCoords(mainDiv.id);
    if(isHorizontal){
        
        for(let i = coords[1]; i > coords[1] - spaces; i--){
            //highlight the div;
            let box = document.getElementById(coords[0] + " " + i);
            box.classList.add("highlight");
            list.push(box);
        }
    }else{
        console.log("vertical highlighting!")
        for(let i = coords[0]; i < coords[0] + spaces; i++){
            let box = document.getElementById(i + " " + coords[1]);
            box.classList.add("highlight");
            list.push(box);
        }
    }
}

function removeHighlighting(list){
    //go through list and remove the highlight class from classlist.

    while(list.length != 0){
        let box = list.pop();
        box.classList.remove("highlight");
    }
}




function offsetPos(radiusCenter, offset){
    let center = [radiusCenter[0], radiusCenter[1]];
    if(offset == 1){
        center[1] += 1;
    }else if(offset == 2){
        center[0] += 1;
    }else if(offset == 3){
        center[1] -= 1;
    }else{
        center[0] -= 1;
    }

    return center;
}



let center = null
let lockedIn = false;
let offset = 1;
let adder = 0;
let lockedShip = 0;

function createDiv(status, row, col, player=true){

    let box=document.createElement("div");
    box.id=row+" " + col;
    box.classList.add("box");
    box.style="border-style:solid"
    if(status == "empty"||status=="hit"||status=="occupied"||status=="marked"){
        box.classList.add(status);

    }
    if(player){
        box.onmouseover = (e) => {
            if(horizontal && playerBoard.hasSpace(getCoords(e.target.id), currentShip)){
                removeHighlighting(highlightedDivs);
                highlightDivs(highlightedDivs, currentShip, e.target, horizontal);
                
            }else if(!horizontal && playerBoard.hasSpace(getCoords(e.target.id), currentShip, false)){
                removeHighlighting(highlightedDivs);
                highlightDivs(highlightedDivs, currentShip, e.target, horizontal);
            }else{
                removeHighlighting(highlightedDivs);
            }
        }
    }

    function alertIfShipDead(randomPos, killer){
        if(!playerBoard.completeShipWithNumExists(playerBoard.get(randomPos))){
                            alertDeadShip(killer, playerBoard.get(randomPos));
        }
    }

    if(player){
        box.onclick = (e) => {
            if(gameStarted){
                //game logic here
            }else{
                handleShipsLogic(e.target);
                
            }
        }
    }else{
        box.onclick = (e) => {
            if(gameStarted){
            //handle marking and hitting.
                let coords = getCoords(e.target.id);
                console.log("Ship exists when clicked: " + compBoard.shipExists(coords));
                if(compBoard.shipExists(coords)){
                    let damagedShip = compBoard.board[coords[0]][coords[1]]
                    compBoard.board[coords[0]][coords[1]] = 7;
                    e.target.className = "box hit";


                    if(compBoard.gameOver()){
                        console.log(compBoard.board);
                        alert("Player won!");
                        window.location.reload();
                        //reset the game
                    }
                    
                }else{
                    if(compBoard.board[coords[0]][coords[1]] == 1){

                        alert("choose a square that hasn't been marked!")
                        return;
                    }else{
                        compBoard.board[coords[0]][coords[1]] = 1;
                        e.target.className = "box marked";
                    }
                }

                //-----computer logic here
                
                if(center == null){
                    let randomPos = getNewPos();

                    if(playerBoard.shipExists(randomPos)){
                        lockedShip = playerBoard.get(randomPos);
                        setUIBoard(playerUIBoard, randomPos, "box hit");
     
                        playerBoard.set(randomPos, 7);
                        center = randomPos;
                    }else{
                        setUIBoard(playerUIBoard, randomPos, "box marked");
                        playerBoard.set(randomPos, 1);
                    }
                }else{
                    if(!lockedIn){
                        console.log("here!!!")
                        //offset is always at 1 at this point
                        let newPos = offsetPos(center, offset);
                        while(!playerBoard.withinBounds(newPos) || playerBoard.get(newPos) == 7 || playerBoard.get(newPos) == 1){
                            offset++;
                            newPos = offsetPos(center, offset);
                        }

                        if(playerBoard.shipExists(newPos) && lockedShip == playerBoard.get(newPos)){
                            setUIBoard(playerUIBoard, newPos, "box hit");

                            playerBoard.set(newPos, 7);
                            adder = 2;
                            lockedIn = true;

                        }else{

                            if(playerBoard.get(newPos) == 0){
                                setUIBoard(playerUIBoard, newPos, "box marked");
                                playerBoard.set(newPos, 1);
                            }else if(playerBoard.shipExists(newPos)){
                                

                                setUIBoard(playerUIBoard, newPos, "box hit");

                                playerBoard.set(newPos, 7);
                            }

                        }
                    }else{
                        let nextPos = performAdding(center, offset, adder);
                        console.log("after locking in: here is the position we tried: " + nextPos);

                        if(
                            playerBoard.withinBounds(nextPos) &&
                            playerBoard.shipExists(nextPos) &&
                            playerBoard.get(nextPos) == lockedShip
                        ){
                            console.log("here is nextPos: " + nextPos);
                            setUIBoard(playerUIBoard, nextPos, "box hit");
                            
                            playerBoard.set(nextPos, 7);
                            if(adder >= 0){
                                adder++;
                            }else{
                                adder--;
                            }
                        }else{
                            if(playerBoard.completeShipWithNumExists(lockedShip)){
                                if(playerBoard.withinBounds(nextPos) && playerBoard.get(nextPos) == 0){
                                    setUIBoard(playerUIBoard, nextPos, "box marked")
                                    playerBoard.set(nextPos, 1);
                                    if(adder >= 0){
                                        adder = -1;
                                    }else{
                                        adder -= 1;
                                    }
                                }else{
                                    if(adder >= 0){
						                adder = -1;
					                }else{
						                adder -= 1;
					                }

                                    nextPos = performAdding(center, offset, adder);
                                    setUIBoard(playerUIBoard, nextPos, "box hit");
  
                                    playerBoard.set(nextPos, 7);
                                }
                            }
                            
                            if(!playerBoard.completeShipWithNumExists(lockedShip)){
                                //ship is dead
                                alertDeadShip('computer', lockedShip);
                                console.log("here a ship is recognized as dead!")
                                adder = 0;
                                center = null;
                                lockedIn = false;
                                offset = 1;
                                lockedShip = 0;
                                
                                


                                let randomPos = getNewPos();

                    if(playerBoard.shipExists(randomPos)){
                        lockedShip = playerBoard.get(randomPos);
                        setUIBoard(playerUIBoard, randomPos, "box hit");
                      
                        playerBoard.set(randomPos, 7);
                        center = randomPos;
                    }else{
                        setUIBoard(playerUIBoard, randomPos, "box marked");
                        playerBoard.set(randomPos, 1);
                    }


                            }
                        }
                    }
                }


            }

            if(playerBoard.gameOver()){
                alert("Computer has won!");
                window.location.reload();
            }

        }
    }

    return box;

}

function setUIBoard(uiBoard, coords, classText){
    uiBoard.querySelector(`[id="${coords[0]} ${coords[1]}"]`).className = classText;
}

function performAdding(center, offset, add){
    let n = [center[0], center[1]];

    if(offset == 1){
        n[1] += add;
    }else if(offset == 2){
        n[0] += add;
    }else if(offset == 3){
        n[1] -= add;
    }else{
        n[0] -= add;
    }

    return n;
}

function getNewPos(){
    let pos = playerBoard.getRandom();

    while(playerBoard.board[pos[0]][pos[1]] == 7 || playerBoard.board[pos[0]][pos[1]] == 1){
        pos = playerBoard.getRandom();
    }

    return pos;
}



function getClassNameByNum(boardNum){
    if((boardNum >= 2 && boardNum <= 5) || boardNum == 33){
        return "occupied";
    }else if(boardNum == 0){
        return "empty";
    }else if(boardNum == 1){
        return "marked";
    }else{
        return "hit";
    }
}

function alertDeadShip(pOrC, shipNum){
    if(shipNum == 2){
        alert(pOrC + " destroyed a: destroyer!");
    }else if(shipNum == 3){
        alert(pOrC + " destroyed a: cruiser!");
    }else if(shipNum == 4){
        alert(pOrC + " destroyed a: battleship!");
    }else if(shipNum == 5){
        alert(pOrC + " destroyed a: carrier!");
    }else if(shipNum == 33){
        alert(pOrC + " destroyed a: submarine!");
    }
}

function handleShipsLogic(box){
    console.log("here!!!!")
    console.log(validConsts());
    console.log(horizontal);
    console.log(playerBoard.hasSpace(getCoords(box.id), currentShip));
    console.log(playerBoard.board[0]);
    if(validConsts() && horizontal && playerBoard.hasSpace(getCoords(box.id), currentShip)){
                console.log("placing horizintally again!")
                playerBoard.placeShip(currentBoatNum, currentShip, getCoords(box.id));
                updateAllDivs(playerBoard, playerUIBoard);
                console.log(playerBoard.board);
                
                currentButton.remove();
                totalShips --;
                resetConsts();
                
    }else if(validConsts() && playerBoard.hasSpace(getCoords(box.id), currentShip, false) && !horizontal){
                playerBoard.placeShip(currentBoatNum, currentShip, getCoords(box.id), false);
                updateAllDivs(playerBoard, playerUIBoard);
               
                currentButton.remove();
                totalShips--;
                resetConsts();
    }
}

function resetConsts(){
    currentBoatNum = -1;
    currentShip = 0;    
    currentButton = null;
}

function getCoords(id){
    let coords = id.split(" ");

    for(let i = 0; i < coords.length; i++){
        coords[i] = parseInt(coords[i]);
    }

    return coords;
}


let playerBoard = new Board();
let compBoard = new Board();

const playerUIBoard = createBoard(true);
const compUIBoard = createBoard(false);

body.appendChild(playerUIBoard);
body.appendChild(compUIBoard);

//------------------------------------------


document.getElementById("play").onclick = (e) => {
    if(totalShips > 0){
        alert("Place all your ships before playing!")
        return;
    }else{
        //basically enables div onclicks to work
        gameStarted = true;
        compBoard.placeShipsRandomly();
        console.log(compBoard.board);
        updateAllDivs(compBoard, compUIBoard);
        rotate.remove();
        e.target.remove();
        
    }


}







carrierBtn.onclick = (e) => {
    console.log("clicked carrier");
    currentShip = 5;
    currentButton = carrierBtn;
    currentBoatNum = 5;
    
};

battleshipBtn.onclick = (e) => {
    currentShip = 4;
    currentButton = battleshipBtn;
    currentBoatNum = 4;
};

cruiserBtn.onclick = (e) => {
    currentShip = 3;
    currentButton = cruiserBtn;
    currentBoatNum = 3;
    
};

submarineBtn.onclick = (e) => {
    currentShip = 3;
    currentButton = submarineBtn;
    currentBoatNum = 33;
    
};

destroyerBtn.onclick = () => {
    currentShip = 2;
    currentButton = destroyerBtn;
    currentBoatNum = 2;
    
};

rotate.onclick = (e) => {
    horizontal = !horizontal;
}





function updateAllDivs(internalBoard, externalBoard){
    let sectionChildren = externalBoard.children;

    for(let i = 0; i < sectionChildren.length; i++){
        let boxChildren = sectionChildren[i].children;
        for(let j = 0; j < boxChildren.length; j++){
            updateColor(boxChildren[j], internalBoard.board[i][j]);
        }
    }
}

function updateColor(box, num){
    if(num == 0){
        box.className = "box empty";
    }else if(num == 1){
        box.className = "box marked";
    }else if(num <= 5 && num >= 2 || num > 15){
        box.className = "box occupied";
    }else if(num == 7){
        box.className = "box hit";
    }
}