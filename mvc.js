class Model {
    //Defines data structure, function logic
    constructor() {
        this.currPlayer = "blue"
        this.tokens = []; //col: col, row: height, color: this.currPlayer
        if (localStorage.getItem("board")) { //Board [i/row][j/col]
            this.board = JSON.parse(localStorage.getItem("board"))
            this.tokens = JSON.parse(localStorage.getItem("tokens"))
            this.currPlayer = JSON.parse(localStorage.getItem("player"))
        }
        else {
            this.board = this.#constructEmptyBoard()
        }
        console.log(this.board)
    }

    #constructEmptyBoard() {
        const board = []
        for (let i = 0; i <= 6; i++) {
            board[i] = [];
            for (let j = 0; j <= 6; j++) {
                board[i].push(`i: ${i} j: ${j}`)
            }
        }
        console.log("empty")
        localStorage.setItem("board", JSON.stringify(board))
        localStorage.setItem("tokens", JSON.stringify([]));
        localStorage.setItem("player", JSON.stringify("blue"));
        return board;
    }

    addToken(col) {
        if (this.isPlaceAble(col)) {
            let height = 6;
            for (let i = 6; i >= 0; i--) {
                if (this.board[i][col] !== "red" && this.board[i][col] !== "blue") {

                    height = i;
                    break;
                }
            }
            console.log(`Placeing a ${this.currPlayer} token in col ${col} lvl ${height}`)
            this.tokens.push({ col: col, row: height, color: this.currPlayer })
            this.board[height][col] = this.currPlayer;
            localStorage.setItem("board", JSON.stringify(this.board))
            localStorage.setItem("tokens", JSON.stringify(this.tokens))
            this.checkWinner();
            this.switchTurn();
        }
        else {
            console.log(`col ${col} is full`)
        }
    }

    isPlaceAble(col) {
        if (this.board[0][col] !== "red" && this.board[0][col] !== "blue") {
            return true;
        }
        return false;
    }

    switchTurn() {
        if (this.currPlayer === "blue") {
            localStorage.setItem("player", JSON.stringify("red"));
            this.currPlayer = "red";
        }
        else {
            localStorage.setItem("player", JSON.stringify("blue"));
            this.currPlayer = "blue";
        }
    }

    checkWinner(streak) {
        const lastToken = this.tokens[this.tokens.length - 1]
        //check horizontal
        if (this.#checkHorizontal(1, lastToken, [])) {
            console.log("victory")
        }
        //check vertical
        if (this.#checkVertical(1, lastToken, [])) {
            console.log("victory")
        }
        //check sideways
        if (this.#checkSideWaysRising(1, lastToken, [])) {
            console.log("victory")
        }
        if (this.#checkSideWaysDesc(1, lastToken, [])) {
            console.log("victory")
        }
    }

    doesTokenExist(col, row, color) {
        for (let i = 0; i < this.tokens.length; i++) {
            if (this.tokens[i].col === col && this.tokens[i].row === row && this.tokens[i].color === color) {
                return this.tokens[i];
            }
        }
        return false;
    }

    #checkVertical(streak, token, checked) {
        checked.push(token)
        if (streak === 4) {
            return true;
        }
        const tokenCol = token.col; //j
        const tokenRow = token.row; //i
        const overToken = this.doesTokenExist(tokenCol, tokenRow - 1, token.color)
        const underToken = this.doesTokenExist(tokenCol, tokenRow + 1, token.color)
        if (overToken && !checked.includes(overToken)) {
            checked.push(overToken)
            return this.#checkVertical(streak + 1, overToken, checked)
        }
        if (underToken && !checked.includes(underToken)) {
            checked.push(underToken)
            return this.#checkVertical(streak + 1, underToken, checked)
        }
    }

    #checkHorizontal(streak, token, checked) {
        checked.push(token)
        if (streak === 4) {
            return true;
        }
        const tokenCol = token.col; //j
        const tokenRow = token.row; //i
        const rightToken = this.doesTokenExist(tokenCol + 1, tokenRow, token.color)
        const leftToken = this.doesTokenExist(tokenCol - 1, tokenRow, token.color)
        if (rightToken && !checked.includes(rightToken)) {
            checked.push(rightToken)
            return this.#checkHorizontal(streak + 1, rightToken, checked)
        }
        if (leftToken && !checked.includes(leftToken)) {
            checked.push(leftToken)
            return this.#checkHorizontal(streak + 1, leftToken, checked)
        }
    }

    #checkSideWaysRising(streak, token, checked) {
        checked.push(token)
        if (streak === 4) {
            return true;
        }
        const tokenCol = token.col; //j
        const tokenRow = token.row; //i
        const northEast = this.doesTokenExist(tokenCol + 1, tokenRow - 1, token.color)
        const southWest = this.doesTokenExist(tokenCol - 1, tokenRow + 1, token.color)

        if (northEast && !checked.includes(northEast)) {
            checked.push(northEast)
            return this.#checkSideWaysRising(streak + 1, northEast, checked)
        }
        if (southWest && !checked.includes(southWest)) {
            checked.push(southWest)
            return this.#checkSideWaysRising(streak + 1, southWest, checked)
        }
    }

    #checkSideWaysDesc(streak, token, checked) {
        checked.push(token)
        if (streak === 4) {
            return true;
        }
        const tokenCol = token.col; //j
        const tokenRow = token.row; //i
        const northWest = this.doesTokenExist(tokenCol - 1, tokenRow - 1, token.color)
        const southEast = this.doesTokenExist(tokenCol + 1, tokenRow + 1, token.color)

        if (northWest && !checked.includes(northWest)) {
            checked.push(northWest)
            return this.#checkSideWaysDesc(streak + 1, northWest, checked)
        }
        if (southEast && !checked.includes(southEast)) {
            checked.push(southEast)
            return this.#checkSideWaysDesc(streak + 1, southEast, checked)
        }
    }

    set tokens(newTokens) {
        this._tokens = newTokens;
    }

    get tokens() {
        return this._tokens;
    }

}

class View {
    //Handles UI changes, DOM manipulation
    constructor() {
        this.root = document.getElementById("root");
        this.board = document.createElement("table");
        for (let i = 0; i <= 6; i++) {
            const tr = document.createElement("tr");
            for (let j = 0; j <= 6; j++) {
                const td = document.createElement("td");
                td.textContent = `i: ${i} j: ${j}`
                td.classList.add("cell")
                td.addEventListener("click", () => { this.addToken(j) })
                tr.append(td)
            }
            this.board.append(tr)
        }
        this.root.append(this.board)
    }

    addToken(col) {
        console.log(`Adding token to ${col}`)
        return col;
    }

    render(tokens) {
        for (let i = 0; i < tokens.length; i++) {
            const cell = this.board.children[tokens[i].col].children[tokens[i].row];
            cell.style['background-color'] = tokens[i].color
        }
    }
}

class Controller {
    //Connects the view and model
    #model;
    #view;
    constructor(model, view) {
        this.#model = model;
        this.#view = view;
    }

    handleAddToken(col){
        this.#model.addToken(col);
    }
}

const model = new Model();
const view = new View();

const control = new Controller(model, view)

