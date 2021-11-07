import Gamefield from "./gamefield";
import { constants, DEAD_ALIVE } from "./constants";

export interface IOptionsGoL {
  startBtn: HTMLButtonElement;
  widthElem: HTMLInputElement;
  heightElem: HTMLInputElement;
  slider: HTMLInputElement;
  height?: number;
  width?: number;
  gameFieldRender?: Gamefield;
  interval?: number | undefined;
  gameField?: HTMLTableElement;
  allCells?: DEAD_ALIVE[][];
  inactiveArr?: DEAD_ALIVE[][];
  aliveCellNumber?: number;
  lastSpeed?: number;
}

export default class GameOfLife {
  startBtn: HTMLButtonElement;

  widthElem: HTMLInputElement;

  heightElem: HTMLInputElement;

  width: number;

  height: number;

  slider: HTMLInputElement;

  private gameFieldRender: Gamefield;

  interval: number | undefined;

  gameField: HTMLTableElement;

  allCells: DEAD_ALIVE[][];

  private inactiveArr: any;

  aliveCellNumber: number;

  lastSpeed: number;

  constructor(options: IOptionsGoL) {
    this.startBtn = options.startBtn;
    this.widthElem = options.widthElem;
    this.heightElem = options.heightElem;
    this.width =
      Number(options.widthElem.value) < Number(options.widthElem.min)
        ? Number(options.widthElem.min)
        : Number(options.widthElem.value);
    this.height =
      Number(options.heightElem.value) < Number(options.heightElem.min)
        ? Number(options.heightElem.min)
        : Number(options.heightElem.value);
    this.slider = options.slider;
    this.gameFieldRender = new Gamefield({
      elem: options.gameField as HTMLTableElement,
      width: this.width,
      height: this.height,
    });
    const gameFieldRenderOptions = this.gameFieldRender.generateField();
    this.interval = undefined;
    this.gameField = gameFieldRenderOptions.gameField;
    this.allCells = gameFieldRenderOptions.allCells;
    this.inactiveArr = JSON.parse(JSON.stringify(this.allCells));
    this.aliveCellNumber = gameFieldRenderOptions.aliveCellNumber;
    // eslint-disable-next-line
    this.lastSpeed = Number(this.slider.value) | 50;
  }

  generateRandField() {
    const gameFieldRenderOptions = this.gameFieldRender.generateRandField(
      this.height,
      this.width,
      this.allCells
    );
    this.gameField = gameFieldRenderOptions.gameField;
    this.allCells = gameFieldRenderOptions.allCells;
    this.inactiveArr = JSON.parse(JSON.stringify(this.allCells));
    this.aliveCellNumber = gameFieldRenderOptions.aliveCellNumber;
  }

  draw(e: Event) {
    const cellEl = e.target as HTMLTableCellElement;
    if (cellEl.tagName.toLowerCase() !== "td") {
      return;
    }
    const { className } = cellEl;
    const row = Number(cellEl.dataset.row);
    const col = Number(cellEl.dataset.col);

    if (className.indexOf("alive") === -1) {
      cellEl.classList.add("alive");
      this.allCells[row][col] = constants.ALIVE as DEAD_ALIVE;
      this.aliveCellNumber += 1;
    } else {
      cellEl.classList.toggle("alive");
      this.allCells[row][col] = this.allCells[row][col]
        ? (constants.DEAD as DEAD_ALIVE)
        : (constants.ALIVE as DEAD_ALIVE);
      if (this.allCells[row][col] === constants.DEAD) {
        this.aliveCellNumber -= 1;
      }
    }
  }

  countNeighbours(row: number, col: number) {
    let neighbours = 0;
    for (let i = -1; i < 2; i += 1) {
      for (let j = -1; j < 2; j += 1) {
        if (!i && !j) continue;
        try {
          if (this.allCells[row + i][col + j] === constants.ALIVE) {
            neighbours += 1;
          }
        } catch (e) {
          continue;
        }
        if (neighbours > 3) {
          return neighbours;
        }
      }
    }
    return neighbours;
  }

  updateCellValue(row: number, col: number) {
    const total = this.countNeighbours(row, col);
    if (total > 3 || total < 2) {
      return constants.DEAD;
    }
    if (this.allCells[row][col] === constants.DEAD && total === 3) {
      return constants.ALIVE;
    }
    return this.allCells[row][col];
  }

  renderField(height: number, width: number) {
    if (Number.isNaN(height) || Number.isNaN(width)) return;
    if (this.height < height) {
      const arr = Array.from(Array(height - this.height), () =>
        new Array(this.width).fill(constants.DEAD)
      );
      this.allCells = this.allCells.concat(arr);
      this.inactiveArr = this.inactiveArr.concat(arr);
      for (let row = this.height; row < height; row += 1) {
        const rowEl = document.createElement("tr");
        for (let col = 0; col < this.width; col += 1) {
          const cellEl = this.gameFieldRender.createCell(row, col);
          rowEl.append(cellEl);
        }
        this.gameField.tBodies[0].append(rowEl);
      }
      this.height = height;
    } else if (this.height > height) {
      for (let row = 0; row < this.height - height; row += 1) {
        this.aliveCellNumber -= this.allCells[height].filter(
          (cell) => cell === constants.ALIVE
        ).length;
        this.gameField.rows[height].remove();
      }
      this.allCells.splice(height, this.height - height);
      this.inactiveArr.splice(height, this.height - height);
      this.height = height;
    }
    if (this.width < width) {
      const arr = new Array(width - this.width).fill(constants.DEAD);
      this.allCells = this.allCells.map((value) => value.concat(arr));
      this.inactiveArr = this.inactiveArr.map((value: DEAD_ALIVE[]) =>
        value.concat(arr)
      );
      for (let row = 0; row < this.height; row += 1) {
        for (let col = this.width; col < width; col += 1) {
          const cellEl = this.gameFieldRender.createCell(row, col);
          this.gameField.rows[row].append(cellEl);
        }
      }
      this.width = width;
    } else if (this.width > width) {
      this.allCells.forEach((value) => {
        this.aliveCellNumber -= value[value.length - 1];
        value.splice(width, this.width - width);
      });
      this.inactiveArr.forEach((value: DEAD_ALIVE[]) => {
        value.splice(width, this.width - width);
      });
      for (let row = 0; row < this.height; row += 1) {
        for (let col = width; col < this.width; col += 1) {
          this.gameField.rows[row].lastElementChild!.remove();
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

  updateGameField(mode: number) {
    if (
      mode !== constants.NEXT_MODE &&
      this.lastSpeed !== Number(this.slider.value)
    ) {
      this.lastSpeed = Number(this.slider.value);
      clearInterval(this.interval);
      this.lifeCycle(constants.SPEED_MODE);
      return;
    }
    for (let row = 0; row < this.height; row += 1) {
      for (let col = 0; col < this.width; col += 1) {
        const initialState = this.allCells[row][col];
        this.inactiveArr[row][col] = this.updateCellValue(row, col);
        const cell = this.gameField.rows[row].cells[col];
        if (this.inactiveArr[row][col] !== initialState) {
          let className = "";
          if (this.inactiveArr[row][col] === constants.ALIVE) {
            if (mode === constants.NEXT_MODE) {
              className = "new-alive";
            }
            this.aliveCellNumber += 1;
          } else {
            if (mode === constants.NEXT_MODE) {
              className = "new-dead";
            }
            this.aliveCellNumber -= 1;
          }
          if (mode === constants.NEXT_MODE) {
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

  lifeCycle(mode = constants.PLAY_MODE) {
    if (!this.aliveCellNumber) {
      clearInterval(this.interval);
      this.startBtn.innerHTML = "start";
      return;
    }
    if (mode === constants.RESIZE_MODE && this.startBtn.innerHTML === "start")
      return;
    if (this.startBtn.innerHTML === "stop" && mode === constants.PLAY_MODE) {
      clearInterval(this.interval);
      this.startBtn.innerHTML = "start";
      return;
    }
    this.startBtn.innerHTML = "stop";
    if (mode === constants.NEXT_MODE) {
      this.startBtn.innerHTML = "start";
      clearInterval(this.interval);
      this.updateGameField.call(this, constants.NEXT_MODE);
      return;
    }
    this.interval = setInterval(
      this.updateGameField.bind(this),
      (100 - this.lastSpeed) * 10
    );
  }
}
