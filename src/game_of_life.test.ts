import GameOfLife from "./game_of_life";
import { constants, DEAD_ALIVE } from "./constants";

describe("Controllers testing", () => {
  let gameField: HTMLTableElement;
  let startBtn: HTMLButtonElement;
  let widthElem: HTMLInputElement;
  let heightElem: HTMLInputElement;
  let slider: HTMLInputElement;
  let gol: GameOfLife;

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
    slider = document.getElementById("slider") as HTMLInputElement;

    gol = new GameOfLife({
      widthElem,
      heightElem,
      startBtn,
      gameField,
      slider,
    });
  });
  afterEach(() => {
    gol.allCells = Array.from(Array(gol.height), () =>
      new Array(gol.width).fill(constants.DEAD)
    );
    jest.resetAllMocks();
  });

  test("Instance of GameOfLife", () => {
    expect(gol).toBeInstanceOf(GameOfLife);
    expect(gol.width).toBe(Number(widthElem.value));
    expect(gol.height).toBe(Number(heightElem.value));
    expect(gol.allCells.length).toBe(Number(heightElem.value));
    expect(gol.gameField.rows.length).toBe(Number(heightElem.value));
    expect(gol.gameField.rows[0].cells.length).toBe(Number(widthElem.value));
  });

  let cells = Array.from(Array(10), () => [
    Math.floor(Math.random() * 24),
    Math.floor(Math.random() * 24),
  ]);
  test.each(cells)("Drawing alive cell[%p,%p]", (row, col) => {
    const event: any = {
      target: gameField.rows[row].cells[col],
    };
    const draw = jest.spyOn(gol, "draw");
    gol.draw(event);
    expect(draw).toHaveBeenCalledTimes(1);
    expect(
      gameField.rows[row].cells[col].classList.contains("alive")
    ).toBeTruthy();
  });

  test("Redrawing cell", () => {
    const row = 0;
    const col = 0;
    const event: any = {
      target: gameField.rows[row].cells[col],
    };
    gol.draw(event);
    expect(
      gameField.rows[row].cells[col].classList.contains("alive")
    ).toBeTruthy();
    gol.draw(event);
    expect(
      gameField.rows[row].cells[col].classList.contains("alive")
    ).toBeFalsy();
  });

  const sizes = Array.from(Array(10), () => [
    Math.floor(Math.random() * 24 + 5),
    Math.floor(Math.random() * 24 + 5),
  ]);
  test.each(sizes)("Setting height: %p, width: %p", (height, width) => {
    const renderField = jest.spyOn(gol, "renderField");
    gol.widthElem.value = `${width}`;
    gol.setWidth();
    expect(Number(gol.widthElem.value)).toBe(width);
    gol.heightElem.value = `${height}`;
    gol.setHeight();
    expect(Number(gol.heightElem.value)).toBe(height);
    expect(renderField).toHaveBeenCalled();
  });

  test("Resizing field", () => {
    const height = Math.floor(Math.random() * (gol.height - 1));
    const width = Math.floor(Math.random() * (gol.width - 1));
    gol.renderField(height, gol.width);
    expect(gol.height).toBe(height);
    gol.renderField(gol.height, width);
    expect(gol.width).toBe(width);
  });

  const cellNeighbours = [
    [1, 1, 1],
    [1, 2, 2],
    [1, 3, 1],
  ];
  test.each(cellNeighbours)(
    "Cell [%p, %p] has %p neighbours",
    (row, col, res) => {
      cellNeighbours.forEach(([curRow, curCol]) => {
        gol.allCells[curRow][curCol] = constants.ALIVE as DEAD_ALIVE;
      });
      expect(gol.countNeighbours(row, col)).toBe(res);
    }
  );

  // Testcase description:
  // [---]    [-*-]
  // [***] -> [-*-]
  // [---]    [-*-]
  cells = [
    [0, 2, constants.DEAD, constants.ALIVE],
    [1, 1, constants.ALIVE, constants.DEAD],
    [1, 2, constants.ALIVE, constants.ALIVE],
    [1, 3, constants.ALIVE, constants.DEAD],
    [2, 2, constants.DEAD, constants.ALIVE],
  ];
  test.each(cells)(
    "Cell [%p, %p, %p] has a result state %p",
    (row, col, initialState, resState) => {
      cells.forEach(([curRow, curCol, curState]) => {
        gol.allCells[curRow][curCol] = curState as DEAD_ALIVE;
      });
      expect(gol.updateCellValue(row, col)).toBe(resState);
    }
  );

  describe("Updating gamefield", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });
    test("Changing game speed", () => {
      const lifeCycle = jest
        .spyOn(gol, "lifeCycle")
        .mockImplementation(() => {});
      const clearInterval = jest.spyOn(window, "clearInterval");
      const mode = constants.SPEED_MODE;
      gol.slider.value = `${gol.lastSpeed + 10}`;
      gol.updateGameField(mode);
      expect(gol.lastSpeed).toBe(Number(gol.slider.value));
      expect(clearInterval).toHaveBeenCalledTimes(1);
      expect(gol.interval).toBeUndefined();
      expect(lifeCycle).toHaveBeenCalledWith(mode);
    });

    test("Not changing speed", async () => {
      const updateCellValue = jest
        .spyOn(gol, "updateCellValue")
        .mockReturnValue(constants.ALIVE);
      const mode = constants.NEXT_MODE;
      const cell = Math.floor(Math.random() * (gol.height - 1));
      gol.updateGameField(mode);
      expect(updateCellValue).toHaveBeenCalledTimes(gol.width * gol.height);
      expect(gol.allCells[cell][cell]).toBe(constants.ALIVE);
      expect(gol.gameField.querySelectorAll(".alive").length).toBe(
        gol.width * gol.height
      );
    });

    test('Changing "start" button value', () => {
      const mode = constants.NEXT_MODE;
      gol.startBtn.innerHTML = "stop";
      gol.updateGameField(mode);
      // no alive cells
      expect(gol.startBtn.innerHTML).toBe("start");
      expect(gol.interval).toBeUndefined();
    });

    test("Next mode, asynchronous class adding", async () => {
      cells.forEach(([curRow, curCol, curState]) => {
        gol.allCells[curRow][curCol] = curState as DEAD_ALIVE;
      });
      const mode = constants.NEXT_MODE;
      gol.updateGameField(mode);
      cells.map(async (val) => {
        const resultClass =
          val[3] === constants.ALIVE ? "new-alive" : "new-dead";
        return setTimeout(() => {
          expect(
            gol.gameField.rows[val[0]].cells[val[1]].classList.contains(
              resultClass
            )
          ).toBeTruthy();
        }, 0);
      });
    });
  });

  describe("Life cycle", () => {
    afterEach(() => {
      jest.resetAllMocks();
    });
    test("No alive cell", () => {
      gol.aliveCellNumber = 0;
      gol.startBtn.innerHTML = "stop";
      gol.lifeCycle();
      expect(gol.interval).toBeUndefined();
      expect(gol.startBtn.innerHTML).toBe("start");
    });
    test("Start game", () => {
      gol.aliveCellNumber = Math.floor(Math.random() * (gol.height - 1)) + 1;
      gol.startBtn.innerHTML = "start";
      gol.lifeCycle();
      expect(gol.startBtn.innerHTML).toBe("stop");
    });
    test("Next mode launching", () => {
      const updateGameField = jest.spyOn(gol, "updateGameField");
      gol.aliveCellNumber = Math.floor(Math.random() * (gol.height - 1)) + 1;
      const mode = constants.NEXT_MODE;
      gol.startBtn.innerHTML = "start";
      gol.lifeCycle(mode);
      expect(gol.startBtn.innerHTML).toBe("start");
      expect(gol.interval).toBeUndefined();
      expect(updateGameField).toHaveBeenCalledTimes(1);
      expect(updateGameField).toHaveBeenCalledWith(mode);
    });
    test("Play mode launching", () => {
      const updateGameField = jest.spyOn(gol, "updateGameField");
      const setInterval = jest.spyOn(window, "setInterval");
      gol.aliveCellNumber = Math.floor(Math.random() * (gol.height - 1)) + 1;
      gol.startBtn.innerHTML = "start";
      gol.lifeCycle();
      setTimeout(() => {
        expect(gol.interval).not.toBeUndefined();
        expect(updateGameField).toHaveBeenCalledTimes(1);
        expect(setInterval).toHaveBeenCalledWith(
          updateGameField,
          (100 - gol.lastSpeed) * 10
        );
      }, (100 - gol.lastSpeed) * 20);
    });
  });
});
