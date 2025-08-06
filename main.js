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
            //handle marking and hitting.
        }
    }

    return box;

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
        box.className = "hit";
    }
}