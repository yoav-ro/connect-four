class Event {
    constructor() {
        this.listeners = [];
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    trigger(params) {
        this.listeners.forEach(listener => { listener(params); });
    }
}


class TicTacToe {
    constructor() {
        this.board = Array(49).fill();
        this.currentPlayer = 'X';
        this.finished = false;

        this.updateCellEvent = new Event();
        this.victoryEvent = new Event();
        this.drawEvent = new Event();
    }

    play(move) {
        if (this.finished || move < 0 || move > 48 || this.board[move]) { return false; }

        this.board[move] = this.currentPlayer;
        this.updateCellEvent.trigger({ move, player: this.currentPlayer });

        this.finished = this.victory() || this.draw();

        if (!this.finished) { this.switchPlayer(); }

        return true;
    }

    victory() {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        // [0, 1, 2, 3, 4, 5, 6],
        //     [7, 8, 9, 10, 11, 12, 13],
        //     [14, 15, 16, 17, 18, 19, 20],
        //     [21, 22, 23, 24, 25, 26, 27],
        //     [28, 29, 30, 31, 32, 33, 34],
        //     [35, 36, 37, 38, 39, 40, 41],

        const victory = lines.some(l => this.board[l[0]]
            && this.board[l[0]] === this.board[l[1]]
            && this.board[l[1]] === this.board[l[2]]);

        if (victory) {
            this.victoryEvent.trigger(this.currentPlayer);
        }

        return victory;
    }

    draw() {
        const draw = this.board.every(i => i);

        if (draw) {
            this.drawEvent.trigger();
        }

        return draw;
    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
}


class View {
    constructor() {
        this.playEvent = new Event();
    }

    render() {
        const board = document.createElement('div');
        board.className = 'board';

        this.cells = Array(49).fill().map((_, i) => {
            const cell = document.createElement('div');
            cell.className = 'cell';

            cell.addEventListener('click', () => {
                this.playEvent.trigger(i);
            });

            board.appendChild(cell);

            return cell;
        });

        this.message = document.createElement('div');
        this.message.className = 'message';

        document.body.appendChild(board);
        document.body.appendChild(this.message);
    }

    updateCell(data) {
        this.cells[data.move].innerHTML = data.player;
    }

    victory(winner) {
        this.message.innerHTML = `${winner} wins!`;
    }

    draw() {
        this.message.innerHTML = "It's a draw!";
    }
}


class Controller {
    constructor() {
        this.model = new TicTacToe();
        this.view = new View();

        this.view.playEvent.addListener(move => { this.model.play(move); });

        this.model.updateCellEvent.addListener(data => { this.view.updateCell(data); });
        this.model.victoryEvent.addListener(winner => { this.view.victory(winner); });
        this.model.drawEvent.addListener(() => { this.view.draw(); });
    }

    run() {
        this.view.render();
    }
}


const app = new Controller();

app.run();