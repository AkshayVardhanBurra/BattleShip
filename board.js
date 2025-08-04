
// 0 -> empty
//1 -> marked
//2 -> hit
//3 -> occupied


export class Board{
    constructor(){
        this.board = this.createEmptyBoard(10, 10);

    }


    createEmptyBoard(rows, cols){
        let brows = [];
        for(let i = 0; i < rows; i++){
            let row = [];
            for(let j = 0; j < cols; j++){
                row.push(0);
            }
            brows.push(row);

            
            
        }

        return rows;
    }


}