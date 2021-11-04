export default class GameOfLife {
    ALIVE = 1;
    DEAD = 0;
    SPEED = 50;
    RESIZE_MODE = 0;
    PLAY_MODE = 1;
    NEXT_MODE = 2;
    RAND_MODE = 3;
    SPEED_MODE = 4;

    constructor(options) {
        this.gameField = options.gameField;
        this.startBtn = options.startBtn;
        this.widthElem = options.widthElem;
        this.heightElem = options.heightElem;
        this.width = Number(options.widthElem.value) < Number(options.widthElem.min) ? Number(options.widthElem.min) : Number(options.widthElem.value);
        this.height = Number(options.heightElem.value) < Number(options.heightElem.min) ? Number(options.heightElem.min) : Number(options.heightElem.value);
        this.slider = options.slider;
        this.allCells = Array.from(Array(this.height), () => new Array(this.width).fill(this.DEAD));
        this.inactiveArr = JSON.parse(JSON.stringify(this.allCells));
        this.interval = null;
        this.aliveCellNumber = 0;
        this.lastSpeed = this.slider.value;
    }

    generateField(mode) {
        if (mode === this.RAND_MODE) {
            this.aliveCellNumber = 0;
            for (let row = 0; row < this.height; row += 1) {
                for (let col = 0; col < this.width; col += 1) {
                    if (Math.round(Math.random())) {
                        this.gameField.rows[row].cells[col].classList.add("alive");
                        this.allCells[row][col] = this.ALIVE;
                        this.aliveCellNumber += 1;
                    } else {
                        this.gameField.rows[row].cells[col].classList.remove("alive");
                        this.allCells[row][col] = this.DEAD;
                    }
                }
            }
            return;
        }

        const tbody = document.createElement("tbody");
        for (let row = 0; row < this.height; row += 1) {
            const rowEl = document.createElement("tr");
            for (let col = 0; col < this.width; col += 1) {
                const cellEl = this.createCell(row, col);
                rowEl.append(cellEl);
            }
            tbody.append(rowEl);
        }
        this.gameField.append(tbody);
    }

    draw(e) {
        const cellEl = e.target;
        if (cellEl.tagName.toLowerCase() !== "td") {
            return;
        }
        const className = cellEl.className;
        const row = +cellEl.dataset.row;
        const col = +cellEl.dataset.col;

        if (!~className.indexOf("alive")) {
            cellEl.classList.add("alive");
            this.allCells[row][col] = this.ALIVE;
            this.aliveCellNumber += 1;
        } else {
            cellEl.classList.toggle("alive");
            this.allCells[row][col] = this.allCells[row][col] ? this.DEAD : this.ALIVE;
            if (this.allCells[row][col] === this.DEAD) {
                this.aliveCellNumber -= 1;
            }
        }
        console.log(this.aliveCellNumber);
    }

    countNeighbours(row, col) {
        let neighbours = 0;
        for (let i = -1; i < 2; i += 1) {
            for (let j = -1; j < 2; j += 1) {
                if (!i && !j)
                    continue;
                try {
                    if (this.allCells[row + i][col + j] === this.ALIVE) {
                        neighbours += 1;
                    }
                } catch (e) {
                }
                if (neighbours > 3) {
                    return neighbours;
                }
            }
        }
        return neighbours;
    }

    updateCellValue(row, col) {
        const total = this.countNeighbours(row, col);
        if (total > 3 || total < 2) {
            return this.DEAD;
        } else if (this.allCells[row][col] === this.DEAD && total === 3) {
            return this.ALIVE;
        } else {
            return this.allCells[row][col];
        }
    }

    createCell(row, col) {
        const cellEl = document.createElement("td");
        cellEl.dataset.row = `${row}`;
        cellEl.dataset.col = `${col}`;
        cellEl.className = `c c${Math.floor(Math.random() * 4 + 1)}`;
        return cellEl;
    }

    renderField(height, width) {
        if (Number.isNaN(height) || Number.isNaN(width))
            return;
        if (this.height < height) {
            const arr = Array.from(Array(height - this.height), () => new Array(this.width).fill(this.DEAD));
            this.allCells = this.allCells.concat(arr);
            this.inactiveArr = this.inactiveArr.concat(arr);
            for (let row = this.height; row < height; row += 1) {
                const rowEl = document.createElement("tr");
                for (let col = 0; col < this.width; col += 1) {
                    const cellEl = this.createCell(row, col);
                    rowEl.append(cellEl);
                }
                this.gameField.tBodies[0].append(rowEl);
            }
            this.height = height;
        } else if (this.height > height) {
            for (let row = 0; row < this.height - height; row += 1) {
                this.aliveCellNumber -= this.allCells[height].filter(cell => cell === this.ALIVE).length;
                this.gameField.rows[height].remove();
            }
            this.allCells.splice(height, this.height - height);
            this.inactiveArr.splice(height, this.height - height);
            this.height = height;
        }
        if (this.width < width) {
            const arr = new Array(width - this.width).fill(this.DEAD);
            this.allCells = this.allCells.map(value => value.concat(arr));
            this.inactiveArr = this.inactiveArr.map(value => value.concat(arr));
            for (let row = 0; row < this.height; row += 1) {
                for (let col = this.width; col < width; col += 1) {
                    const cellEl = this.createCell(row, col);
                    this.gameField.rows[row].append(cellEl);
                }
            }
            this.width = width;
        } else if (this.width > width) {
            this.allCells.forEach(value => {
                this.aliveCellNumber -= value[value.length - 1];
                value.splice(width, this.width - width);
            });
            this.inactiveArr.forEach(value => {
                value.splice(width, this.width - width);
            });
            for (let row = 0; row < this.height; row += 1) {
                for (let col = width; col < this.width; col += 1) {
                    this.gameField.rows[row].lastChild.remove();
                }
            }
            this.width = width;
        }
    }

    setHeight() {
        if (Number(this.heightElem.value) < Number(this.heightElem.min)) {
            this.heightElem.value = this.heightElem.min;
        }
        this.renderField(Number(this.heightElem.value), this.width);
    }

    setWidth() {
        if (Number(this.widthElem.value) < Number(this.widthElem.min)) {
            this.widthElem.value = this.widthElem.min;
        }
        this.renderField(this.height, Number(this.widthElem.value));
    }

    updateGameField(mode) {
        if (mode !== this.NEXT_MODE && this.lastSpeed !== this.slider.value) {
            this.lastSpeed = this.slider.value;
            clearInterval(this.interval);
            this.lifeCycle(this.SPEED_MODE, (100 - this.lastSpeed));
            return;
        }
        for (let row = 0; row < this.height; row += 1) {
            for (let col = 0; col < this.width; col += 1) {
                const initialState = this.allCells[row][col] === this.ALIVE ? this.ALIVE : this.DEAD;
                this.inactiveArr[row][col] = this.updateCellValue(row, col);
                const cell = this.gameField.rows[row].cells[col];
                if (this.inactiveArr[row][col] !== initialState) {
                    let className = "";
                    if (this.inactiveArr[row][col] === this.ALIVE) {
                        if (mode === this.NEXT_MODE) {
                            className = "new-alive";
                        }
                        this.aliveCellNumber += 1;
                    } else {
                        if (mode === this.NEXT_MODE) {
                            className = "new-dead";
                        }
                        this.aliveCellNumber -= 1;
                    }
                    if (mode === this.NEXT_MODE) {
                        cell.classList.add(className);
                        setTimeout(() => cell.classList.remove(className), 1000);
                    }
                    cell.classList.toggle("alive");
                }
            }
        }
        this.allCells = JSON.parse(JSON.stringify(this.inactiveArr));
        if (!this.aliveCellNumber) {
            clearInterval(this.interval);
            this.startBtn.innerHTML = "start";
        }
    }

    lifeCycle(mode = this.PLAY_MODE, speed = this.SPEED) {
        if (!this.aliveCellNumber) {
            clearInterval(this.interval);
            this.startBtn.innerHTML = "start";
            return;
        }
        if (mode === this.RESIZE_MODE && this.startBtn.innerHTML === "start")
            return;
        if (this.startBtn.innerHTML === "stop" && mode === this.PLAY_MODE) {
            clearInterval(this.interval);
            this.startBtn.innerHTML = "start";
            return;
        }
        this.startBtn.innerHTML = "stop";
        if (mode === this.NEXT_MODE) {
            this.startBtn.innerHTML = "start";
            clearInterval(this.interval);
            this.updateGameField.call(this, this.NEXT_MODE);
            return;
        }
        this.interval = setInterval(this.updateGameField.bind(this), (100 - this.lastSpeed) * 10)
    }
}