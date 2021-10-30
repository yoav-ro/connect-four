class Model {
    constructor() {
        this.currPlayer = "blue"
        this.isPlayAble = true;
        this.tokens = [];
        this.board = this.#constructEmptyBoard()
    }

    reset() { //Resets all game elements related to the model class
        this.isPlayAble = true;
        this.currPlayer = "blue";
        this.tokens = [];
        this.board = this.#constructEmptyBoard();
    }

    //Construcats an empry board
    #constructEmptyBoard() {
        const board = []
        for (let i = 0; i <= 6; i++) {
            board[i] = [];
            for (let j = 0; j <= 6; j++) {
                board[i].push(`i: ${i} j: ${j}`)
            }
        }
        return board;
    }

    //Handles adding a new token to the game
    addToken(col) {
        if (this.isPlayAble) {
            if (this.isPlaceAble(col)) {
                let height = 6;
                for (let i = 6; i >= 0; i--) {
                    if (this.board[i][col] !== "red" && this.board[i][col] !== "blue") {
                        height = i;
                        break;
                    }
                }
                this.tokens.push({ col: col, row: height, color: this.currPlayer })
                this.board[height][col] = this.currPlayer;
                this.switchTurn();
            }
        }
    }

    //Checks if the given column is full
    isPlaceAble(col) {
        if (this.board[0][col] !== "red" && this.board[0][col] !== "blue") {
            return true;
        }
        return false;
    }

    //Switches the player
    switchTurn() {
        if (this.currPlayer === "blue") {
            this.currPlayer = "red";
        }
        else {
            this.currPlayer = "blue";
        }
    }

    //Checks if any player won
    checkWinner() {
        if (this.tokens.length >= 6) {
            const lastToken = this.tokens[this.tokens.length - 1]
            //check horizontal
            if (this.#checkHorizontal(1, lastToken, [])) {
                return this.victory();
            }
            //check vertical
            if (this.#checkVertical(1, lastToken, [])) {
                return this.victory();

            }
            //check sideways
            if (this.#checkSideWaysRising(1, lastToken, [])) {
                return this.victory();
            }
            if (this.#checkSideWaysDesc(1, lastToken, [])) {
                return this.victory();
            }
        }
    }

    victory() {
        this.isPlayAble = false;
        return this.tokens[this.tokens.length - 1].color
    }

    //Checks if a token exists
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
    constructor() {
        this.root = document.getElementById("root");
        this.board = document.createElement("table");
        this.msgDiv = document.createElement("div")
        this.tokens = [];

        this.board.className="table"

        this.#_generateBoard();
    }

    bindVictory(color) {
        this.msgDiv.textContent = `${color} WINS! Reset to play again.`
        this.msgDiv.className="winnerDiv"
        this.root.append(this.msgDiv);
    }

    //Generates the board
    #_generateBoard() {
        for (let i = 0; i < 7; i++) {
            const tr = document.createElement("tr");
            for (let j = 0; j < 7; j++) {
                const td = document.createElement("td");
                td.classList.add("cell")
                tr.append(td)
            }

            this.board.append(tr)
        }
        this.root.append(this.board)
        const resetBtn = document.createElement("button");
        resetBtn.textContent = "Reset"
        resetBtn.id = "resetBtn"
        this.root.append(resetBtn)
    }
    
    //Resets all elements related to the view class
    reset() {
        this.tokens = [];
        for (let i = 0; i < this.board.rows.length; i++) {
            for (let j = 0; j < this.board.rows[i].cells.length; j++) {
                this.board.rows[i].cells[j].style.backgroundColor = "white";
            }
        }
        this.root.removeChild(this.msgDiv)
    }

    //Puts all token in the board
    updateBoard(tokens) {
        for (let i = 0; i < tokens.length; i++) {
            this.placeInBoard(tokens[i]);
        }
    }

    //Recieves a token and places it the the correct spot
    placeInBoard(token) {
        for (let i = 0; i < this.board.rows.length; i++) {
            if (i === token.row) {
                for (let j = 0; j < this.board.rows[i].cells.length; j++) {
                    if (j === token.col) {
                        this.board.rows[i].cells[j].style.backgroundColor = token.color;
                    }
                }
            }
        }
    }

    bindResetButton(resetCb) {
        const btn = document.getElementById("resetBtn");
        btn.addEventListener("click", () => {
            resetCb();
        })
        resetCb();
    }

    bindAddToken(modelAddToken) {
        for (let i = 0; i < this.board.rows.length; i++) {
            for (let j = 0; j < this.board.rows[i].cells.length; j++) {
                this.board.rows[i].cells[j].addEventListener("click", (event) => {
                    modelAddToken(j)
                })
            }
        }
    }
}

class Controller {
    #model;
    #view;
    constructor(model, view) {
        this.#model = model;
        this.#view = view;

        this.#view.bindAddToken(this.#handleAddToken)
        this.#view.bindResetButton(this.#handleReset)
    }

    #onVictory(color) {
        if (color) {
            this.#view.bindVictory(color);
        }
    }

    //Fires after every new token added. Updates the model, view, and checks for a winner
    #handleAddToken = (col) => {
        this.#model.addToken(col)
        this.#onVictory(this.#model.checkWinner())
        this.#view.updateBoard(this.#model.tokens)

    }

    //Fires when the reset button is clicked
    #handleReset = () => {
        this.#model.reset();
        this.#view.reset();
    }
}

const control = new Controller(new Model(), new View())

