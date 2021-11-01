import "./style/index.scss";
import Slider from "./slider/slider";
import GameOfLife from "./game_of_life";

const gameField = document.getElementById("gamefield");
const startBtn = document.getElementById("start");
const randomBtn = document.getElementById("random");
const nextBtn = document.getElementById("next");
const widthElem = document.getElementById("width");
const heightElem = document.getElementById("height");

const slider = new Slider({
    elem: document.getElementById("slider-wrapper"),
});

const gol = new GameOfLife({
    widthElem,
    heightElem,
    startBtn,
    gameField,
    slider,
});

gol.generateField();
gameField.addEventListener("click", gol.draw.bind(gol));
widthElem.addEventListener("input", gol.setWidth.bind(gol));
heightElem.addEventListener("click", gol.setHeight.bind(gol));
startBtn.addEventListener("click", gol.lifeCycle.bind(gol, gol.PLAY_MODE));
randomBtn.addEventListener("click", gol.generateField.bind(gol, gol.RAND_MODE));
nextBtn.addEventListener("click", gol.lifeCycle.bind(gol, gol.NEXT_MODE));