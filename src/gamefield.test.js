import Gamefield from "./gamefield";
import { constants } from "./constants";

// export const createCell = jest.fn()
//     .mockImplementation((row, col) => {
//         const cellEl = document.createElement("td");
//         cellEl.dataset.row = `${row}`;
//         cellEl.dataset.col = `${col}`;
//         cellEl.className = `c c${Math.floor(Math.random() * 4 + 1)}`;
//         return cellEl;
//     });
// export const generateField = jest.fn().mockImplementation(
//     function generateField() {
//         const tbody = document.createElement("tbody");
//         for (let row = 0; row < this.height; row += 1) {
//             const rowEl = document.createElement("tr");
//             for (let col = 0; col < this.width; col += 1) {
//                 const cellEl = createCell(row, col);
//                 rowEl.append(cellEl);
//             }
//             tbody.append(rowEl);
//         }
//         this.gameField.append(tbody);
//         return {
//             gameField: this.gameField,
//             allCells: this.allCells,
//             aliveCellNumber: this.aliveCellNumber,
//         };
//     }
// );

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
    const createCell = jest.spyOn(gameField, "createCell");
    const fieldOptions = gameField.generateField();
    expect(createCell).toHaveBeenCalledTimes(
      gameField.width * gameField.height
    );
    expect(fieldOptions.gameField.rows.length).toBe(gameField.height);
    expect(fieldOptions.gameField.rows[0].cells.length).toBe(gameField.width);
    const cell = gameField.createCell(
      Math.floor(Math.random()),
      Math.floor(Math.random())
    );
    expect(cell.classList.contains("c")).toBeTruthy();
  });

  test("Generating random gamefield", () => {
    gameField.generateField();
    // const generateRandField = jest.fn().mockImplementationOnce(
    //     function generateRandField(height, width, allCells) {
    //         this.allCells = allCells;
    //         this.aliveCellNumber = 0;
    //         for (let row = 0; row < height; row += 1) {
    //             for (let col = 0; col < width; col += 1) {
    //                 if (Math.round(Math.random())) {
    //                     this.gameField.rows[row].cells[col].classList.add("alive");
    //                     this.allCells[row][col] = constants.ALIVE;
    //                     this.aliveCellNumber += 1;
    //                 } else {
    //                     this.gameField.rows[row].cells[col].classList.remove("alive");
    //                     this.allCells[row][col] = constants.DEAD;
    //                 }
    //             }
    //         }
    //         return {
    //             gameField: this.gameField,
    //             allCells: this.allCells,
    //             aliveCellNumber: this.aliveCellNumber,
    //         };
    //     }.bind(gameField)
    // );
    const fieldOptions = gameField.generateRandField(
      gameField.height,
      gameField.width,
      gameField.allCells
    );
    fieldOptions.allCells.forEach((row, index) => {
      expect(row.filter((cell) => cell === constants.ALIVE).length).toBe(
        fieldOptions.gameField.rows[index].querySelectorAll(".alive").length
      );
    });
    expect(fieldOptions.gameField.querySelectorAll(".alive").length).toBe(
      fieldOptions.aliveCellNumber
    );
  });
});
