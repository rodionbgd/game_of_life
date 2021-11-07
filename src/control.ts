import "./style/index.scss";
import GameOfLife from "./game_of_life";
import { constants } from "./constants";

export default function init() {
  const gameField = document.getElementById("gamefield") as HTMLTableElement;
  const startBtn = document.getElementById("start") as HTMLButtonElement;
  const randomBtn = document.getElementById("random") as HTMLButtonElement;
  const nextBtn = document.getElementById("next") as HTMLButtonElement;
  const widthElem = document.getElementById("width") as HTMLInputElement;
  const heightElem = document.getElementById("height") as HTMLInputElement;
  const slider = document.getElementById("slider") as HTMLInputElement;
  const tooltip = document.getElementById("tooltip");
  if (
    !gameField ||
    !startBtn ||
    !randomBtn ||
    !nextBtn ||
    !widthElem ||
    !heightElem ||
    !slider ||
    !tooltip
  )
    return;
  slider.value = slider.getAttribute("value") as string;
  const gol = new GameOfLife({
    widthElem,
    heightElem,
    startBtn,
    gameField,
    slider,
  });

  gameField.addEventListener("click", gol.draw.bind(gol));
  widthElem.addEventListener("input", gol.setWidth.bind(gol));
  heightElem.addEventListener("input", gol.setHeight.bind(gol));
  startBtn.addEventListener(
    "click",
    gol.lifeCycle.bind(gol, constants.PLAY_MODE)
  );
  randomBtn.addEventListener("click", gol.generateRandField.bind(gol));
  nextBtn.addEventListener(
    "click",
    gol.lifeCycle.bind(gol, constants.NEXT_MODE)
  );
  slider.addEventListener("input", () => {
    tooltip.textContent = slider.value;
    const thumbWidth = 9;
    if (Number(slider.value) > 50) {
      tooltip.style.setProperty(
        "left",
        `calc(${slider.value}%  - ${
          ((Number(slider.value) / 100) * thumbWidth) / 2 +
          tooltip.clientWidth / 2
        }px)`
      );
    } else {
      tooltip.style.setProperty(
        "left",
        `calc(${slider.value}%  - ${
          tooltip.clientWidth / 2 -
          ((0.5 - Number(slider.value) / 50) * thumbWidth) / 2
        }px)`
      );
    }
  });
}

init();
