import { constants } from "./constants";

export default class Gamefield {
  constructor(options) {
    this.gameField = options.elem;
    this.height = options.height;
    this.width = options.width;
    this.allCells = Array.from(Array(this.height), () =>
      new Array(this.width).fill(constants.DEAD)
    );
    this.aliveCellNumber = 0;
  }

  generateRandField(height, width, allCells) {
    this.allCells = JSON.parse(JSON.stringify(allCells));
    this.aliveCellNumber = 0;
    for (let row = 0; row < height; row += 1) {
      for (let col = 0; col < width; col += 1) {
        if (Math.round(Math.random())) {
          this.gameField.rows[row].cells[col].classList.add("alive");
          this.allCells[row][col] = constants.ALIVE;
          this.aliveCellNumber += 1;
        } else {
          this.gameField.rows[row].cells[col].classList.remove("alive");
          this.allCells[row][col] = constants.DEAD;
        }
      }
    }
    return {
      gameField: this.gameField,
      allCells: this.allCells,
      aliveCellNumber: this.aliveCellNumber,
    };
  }

  generateField() {
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
    return {
      gameField: this.gameField,
      allCells: this.allCells,
      aliveCellNumber: this.aliveCellNumber,
    };
  }
  // eslint-disable-next-line
  createCell(row, col) {
    const cellEl = document.createElement("td");
    cellEl.dataset.row = `${row}`;
    cellEl.dataset.col = `${col}`;
    cellEl.className = `c c${Math.floor(Math.random() * 4 + 1)}`;
    return cellEl;
  }
}
