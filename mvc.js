class Model {
    //Defines data structure, function logic
    constructor() {
        this.currPlayer = "blue"
        if (localStorage.getItem("board")) {
            this.board = JSON.parse(localStorage.getItem("board"))
        }
        else {
            console.log("else")
            this.board = this.#constructEmptyBoard()
        }
        console.log(this.board)
    }

    #constructEmptyBoard() {
        const board = []
        for (let i = 0; i <= 6; i++) {
            board[i] = [];
            for (let j = 0; j <= 6; j++) {
                board[i].push(`empty`)
            }
        }
        console.log("empty")
        localStorage.setItem("board", JSON.stringify(board))
        return board;
    }

    addToken(col) {
        if (this.isPlaceAble(col)) {
            let height = 0;
            for (let i = 0; i <= 6; i++) {         
                if (this.board[col][i] === "empty") {
                    console.log(`col ${col} hieght ${i}`)
                    height = i;
                    break;
                }
            }
            console.log(`Placeing a ${this.currPlayer} token in col ${col} lvl ${height}`)
            this.board[col][height] = this.currPlayer;
            localStorage.setItem("board", JSON.stringify(this.board))
            this.switchTurn();
        }
    }

    isPlaceAble(col) {
        if (this.board[col][6] === "empty") {
            return true;
        }
        return false;
    }

    switchTurn() {
        if (this.currPlayer === "blue") {
            this.currPlayer = "red";
        }
        else {
            this.currPlayer = "blue";
        }
    }

    checkWinner() { }
}

class View {
    //Handles UI changes, DOM manipulation
    constructor() {
        this.root = document.getElementById("root");
        this.board = document.createElement("table");
        for (let i = 1; i <= 7; i++) {
            const tr = document.createElement("tr");
            for (let j = 1; j <= 7; j++) {
                const td = document.createElement("td");
                td.textContent = "O"
                td.classList.add("cell")
                tr.append(td)
            }
            this.board.append(tr)
        }
        this.root.append(this.board)
    }
}

class Controller {
    //Connects the view and model
    #model;
    #view;
    constructor(model, view) {

    }
}

const model = new Model();
const view = new View();

//const control = new Controller(new Model(), new View())

