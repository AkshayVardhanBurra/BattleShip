
// 0 -> empty
//1 -> marked
//2 -> hit
//3 -> occupied

function createEmptyBoard(rows, cols){
        let brows = [];
        for(let i = 0; i < rows; i++){
            let row = [];
            for(let j = 0; j < cols; j++){
                row.push(0);
            }
            brows.push(row);

            
            
        }

        return brows;
    }
export class Board{
    constructor(){
        this.board = createEmptyBoard(10, 10);

    }


    


    //return: void -> places the ships randomly on the board
    placeShipsRandomly(){
        // let rPos = getRandom();
        // let HorV = randomHorV();
        // while(this.hasSpace(rPos, 3, HorV)){
        //     rPos = getRandom();
        //     HorV = randomHorV();
        // }
        // this.placeShip(33, 3, rPos, HorV);

        this.placeAShipRandomly(33, 3);

        for(let i = 2; i <= 5; i++){
            // rPos = getRandom();
            // HorV = randomHorV();
            // while(this.hasSpace(rPos, i, HorV)){
            //     rPos = getRandom();
            //     HorV = randomHorV();
            // }

            // this.placeShip(i, i, rPos, HorV);
            this.placeAShipRandomly(i, i);
        }
    }

    placeAShipRandomly(shipNum, spaces){
        let rPos = this.getRandom();
        let HorV = this.randomHorV();
        while(!this.hasSpace(rPos, spaces, HorV)){
            rPos = this.getRandom();
            HorV = this.randomHorV();
        }
        this.placeShip(shipNum, spaces, rPos, HorV);
    }

    //return: void -> changes board 2d array by placing the ship
    //position is an array
    placeShip(boatNum,spaces, position, isHorizontal = true){
        if(isHorizontal){
            console.log("placing horizontally!")
            for(let x = position[1]; x > position[1] - spaces; x--){
                this.board[position[0]][x] = boatNum;
            }
        }else{
            console.log("placing vertically!")
            for(let y = position[0]; y < position[0] + spaces; y++){
                this.board[y][position[1]] = boatNum;
            }
        }
    }

    hasSpace(position, spaces, isHorizontal = true){
        let x = position[1];
        let y = position[0];

        if(isHorizontal){
            if((x + 1) - spaces < 0){
                return false;
            }

            return this.searchForShips(position, spaces, isHorizontal);
        }else{
            if((y) + spaces > this.board.length){
                return false;
            }

            return this.searchForShips(position, spaces, isHorizontal);
        }
    }

    searchForShips(position, spaces, isHorizontal=true){
        if(isHorizontal){
            for(let i = position[1]; i > position[1] - spaces; i--){
                if(this.board[position[0]][i] != 0){
                    return false;
                }
            }


        }else{
            for(let i = position[0]; i < position[0] + spaces; i++){
                if(this.board[i][position[1]] != 0){
                    return false;
                }
            }
        }

        return true;
    }

    getNumRandom(min, max) {
        return Math.floor(Math.random() * (max - min) ) + min;
    }

    getRandom(){
        return [this.getNumRandom(0,10), this.getNumRandom(0, 10)];
    }
    //true for horizontal. false for vertical
    randomHorV(){
        let randomNum = Math.random();

        return randomNum<=0.5
    }
}