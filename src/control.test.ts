import init from "./control";
import GameOfLife from "./game_of_life";
import { constants } from "./constants";

const mockDraw = jest.fn();
const mockSetWidth = jest.fn();
const mockSetHeight = jest.fn();
const mockLifeCycle = jest.fn();
const mockGenerateRandField = jest.fn();

jest.mock("./game_of_life", () => jest.fn());
(GameOfLife as jest.Mock).mockImplementation(() => ({
  draw: mockDraw,
  setWidth: mockSetWidth,
  setHeight: mockSetHeight,
  lifeCycle: mockLifeCycle,
  generateRandField: mockGenerateRandField,
}));

describe("Controllers check", () => {
  let gameField: HTMLTableElement;
  let startBtn: HTMLButtonElement;
  let widthElem: HTMLInputElement;
  let heightElem: HTMLInputElement;
  let randomBtn: HTMLButtonElement;
  let nextBtn: HTMLButtonElement;

  beforeEach(() => {
    document.body.innerHTML = `<header class="header">
      <h1 class="header-title">Game of life</h1>
      <nav>
        <ul class="controller">
          <li>
            <button id="start">start</button>
          </li>
          <li>
            <button id="random">random</button>
          </li>
          <li>
            <button id="next">next</button>
          </li>
          <li>
            <input
              id="width"
              type="number"
              min="5"
              placeholder="width"
              value="25"
            />
          </li>
          <li>
            <input
              id="height"
              type="number"
              min="5"
              placeholder="height"
              value="25"
            />
          </li>
          <li class="slider-wrapper">
            <section class="tooltip">
              <span class="tooltiptext" id="tooltip">50</span>
              <input
                id="slider"
                class="slider"
                type="range"
                value="50"
                min="1"
                max="100"
              />
            </section>
          </li>
        </ul>
      </nav>
    </header>
    <main class="main">
      <table class="gamefield" id="gamefield"></table>
    </main>`;
    gameField = document.getElementById("gamefield") as HTMLTableElement;
    startBtn = document.getElementById("start") as HTMLButtonElement;
    widthElem = document.getElementById("width") as HTMLInputElement;
    heightElem = document.getElementById("height") as HTMLInputElement;
    randomBtn = document.getElementById("random") as HTMLButtonElement;
    nextBtn = document.getElementById("next") as HTMLButtonElement;
    init();
    jest.clearAllMocks();
  });
  test("Drawing cell", () => {
    gameField.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(mockDraw).toHaveBeenCalled();
  });
  test("Setting width", () => {
    widthElem.dispatchEvent(new Event("input"));
    expect(mockSetWidth).toHaveBeenCalled();
  });
  test("Setting height", () => {
    heightElem.dispatchEvent(new Event("input"));
    expect(mockSetHeight).toHaveBeenCalled();
  });

  test("Lifecycle PLAY mode", () => {
    startBtn.dispatchEvent(new MouseEvent("click"));
    expect(mockLifeCycle).toHaveBeenCalled();
    expect(mockLifeCycle).toHaveBeenCalledWith(
      constants.PLAY_MODE,
      new MouseEvent("click")
    );
  });
  test("Lifecycle NEXT mode", () => {
    nextBtn.dispatchEvent(new MouseEvent("click"));
    expect(mockLifeCycle).toHaveBeenCalled();
    expect(mockLifeCycle).toHaveBeenCalledWith(
      constants.NEXT_MODE,
      new MouseEvent("click")
    );
  });
  test("Generating random field", () => {
    randomBtn.dispatchEvent(new MouseEvent("click"));
    expect(mockGenerateRandField).toHaveBeenCalled();
  });
});
