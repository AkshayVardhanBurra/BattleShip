import {Board} from "./board.js";

const body = document.querySelector("body");


//returns the whole board as node
function createBoard(){
    let div = document.createElement("div");
    div.style="margin:2rem;"
    for(let i = 0; i < 10; i++){
        let s=createRow(i);
        div.appendChild(s);
    }

    return div;
}

function createRow(row){
    let sect = document.createElement("section");
    for(let i = 0; i < 10; i++){
        let d = createDiv("empty", row, i);
        sect.appendChild(d);
    }

    sect.style="display:flex;"

    return sect;
}

function createDiv(status, row, col){

    let box=document.createElement("div");
    box.id=row+" " + col;
    box.classList.add("box");
    box.style="border-style:solid"
    if(status == "empty"||status=="hit"||status=="occupied"||status=="marked"){
        box.classList.add(status);

    }

    return box;

}


let playerBoard = new Board();
let compBoard = new Board();

let playerUIBoard = createBoard();
let compUIBoard = createBoard();

body.appendChild(playerUIBoard);
body.appendChild(compUIBoard);