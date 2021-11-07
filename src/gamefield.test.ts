import Gamefield from "./gamefield";
import { constants } from "./constants";

describe("Rendering gamefield", () => {
  let gameFieldElement: HTMLTableElement;
  let gameField: Gamefield;

  beforeEach(() => {
    document.body.innerHTML = ` <table class="gamefield" id="gamefield"></table>`;
    gameFieldElement = document.getElementById("gamefield") as HTMLTableElement;

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
