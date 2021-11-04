import "./style/index.scss";
import GameOfLife from "./game_of_life";
import { constants } from "./constants";

const gameField = document.getElementById("gamefield");
const startBtn = document.getElementById("start");
const randomBtn = document.getElementById("random");
const nextBtn = document.getElementById("next");
const widthElem = document.getElementById("width");
const heightElem = document.getElementById("height");
const slider = document.getElementById("slider");
slider.value = slider.getAttribute("value");
const gol = new GameOfLife({
  widthElem,
  heightElem,
  startBtn,
  gameField,
  slider,
});

gameField.addEventListener("click", gol.draw.bind(gol));
widthElem.addEventListener("input", gol.setWidth.bind(gol));
heightElem.addEventListener("click", gol.setHeight.bind(gol));
startBtn.addEventListener(
  "click",
  gol.lifeCycle.bind(gol, constants.PLAY_MODE)
);
randomBtn.addEventListener("click", gol.generateRandField.bind(gol));
nextBtn.addEventListener("click", gol.lifeCycle.bind(gol, constants.NEXT_MODE));
slider.addEventListener("input", () => {
  const tooltip = document.getElementById("tooltip");
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
