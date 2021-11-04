import Gamefield from "./gamefield";
import { constants } from "./constants";

describe("Rendering gamefield", () => {
  let gameFieldElement;
  let gameField;
  beforeEach(() => {
    document.body.innerHTML = ` <table class="gamefield" id="gamefield"></table>`;
    gameFieldElement = document.getElementById("gamefield");

    gameField = new Gamefield({
      elem: gameFieldElement,
      width: 25,
      height: 25,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("Creating instance of Gamefield", () => {
    expect(gameField).toBeInstanceOf(Gamefield);
    expect(gameField.width).toBe(25);
    expect(gameField.height).toBe(25);
  });
  test("Generating initial gamefield", () => {
    const createCell = jest
      .spyOn(gameField, "createCell")
      .mockImplementation((row, col) => {
        const cellEl = document.createElement("td");
        cellEl.dataset.row = `${row}`;
        cellEl.dataset.col = `${col}`;
        cellEl.className = `c c${Math.floor(Math.random() * 4 + 1)}`;
        return cellEl;
      });
    const generateField = jest.fn().mockImplementationOnce(
      function generateField() {
        const tbody = document.createElement("tbody");
        for (let row = 0; row < this.height; row += 1) {
          const rowEl = document.createElement("tr");
          for (let col = 0; col < this.width; col += 1) {
            const cellEl = createCell(row, col);
            rowEl.append(cellEl);
          }
          tbody.append(rowEl);
        }
        gameFieldElement.append(tbody);
        return {
          gameField: this.gameField,
          allCells: this.allCells,
          aliveCellNumber: this.aliveCellNumber,
        };
      }.bind(gameField)
    );

    const fieldOptions = generateField();
    gameFieldElement = fieldOptions.gameField;
    expect(gameField.createCell).toHaveBeenCalledTimes(
      gameField.width * gameField.height
    );
    expect(gameFieldElement.rows.length).toBe(25);
    const cell = createCell(
      Math.floor(Math.random()),
      Math.floor(Math.random())
    );
    expect(cell.classList.contains("c")).toBeTruthy();
  });

  test("Generating random gamefield", () => {
    const generateRandField = jest.fn().mockImplementationOnce(
      function generateRandField(height, width) {
        this.allCells = [];
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
      }.bind(gameField)
    );
    const fieldOptions = generateRandField();
    expect(generateRandField).toHaveBeenCalled();
    fieldOptions.allCells.forEach((row, index) => {
      expect(row.filter((cell) => cell === constants.ALIVE).length).toBe(
        fieldOptions.gameField.rows[index].querySelectorAll(".alive").length
      );
    });
  });
});
