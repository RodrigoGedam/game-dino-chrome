import { getCactusRects, setupCactus, updateCactus } from "./cactus.js";
import { getDinoRect, setDinoLose, setupDino, updateDino } from "./dino.js";
import { setupGround, updateGround } from "./ground.js";

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

const worldElement = document.querySelector("[data-world]");
const scoreElement = document.querySelector("[data-score]");
const startScreenElement = document.querySelector("[data-start-screen]");

setPixelToWorldScale();
window.addEventListener("resize", setPixelToWorldScale);
document.addEventListener("keydown", handleStart, { once: true });

let lastTime;
let speedScale;
let score;

function update(time) {
	if (lastTime == null) {
		lastTime = time;
		window.requestAnimationFrame(update);
		return;
	}

	const delta = time - lastTime;

	updateGround(delta, speedScale);
	updateDino(delta, speedScale);
	updateCactus(delta, speedScale);
	updateSpeedScale(delta);
	updateScore(delta);

	if (checkLose()) return handleLose();

	lastTime = time;

	window.requestAnimationFrame(update);
}

function checkLose() {
	const dinoRect = getDinoRect();
	return getCactusRects().some((rect) => isCollision(rect, dinoRect));
}

function isCollision(rect1, rect2) {
	return (
		rect1.left < rect2.right &&
		rect1.top < rect2.bottom &&
		rect1.right > rect2.left &&
		rect1.bottom > rect2.top
	);
}

function updateSpeedScale(delta) {
	speedScale += delta * SPEED_SCALE_INCREASE;
}

function updateScore(delta) {
	score += delta * 0.001;
	scoreElement.textContent = Math.floor(score);
}

function setPixelToWorldScale() {
	let worldToPixelScale;
	window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT
		? (worldToPixelScale = window.innerWidth / WORLD_WIDTH)
		: (worldToPixelScale = window.innerHeight / WORLD_HEIGHT);

	worldElement.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
	worldElement.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
}

function handleStart() {
	lastTime = null;
	speedScale = 1;
	score = 0;
	setupGround();
	setupDino();
	setupCactus();
	startScreenElement.classList.add("hide");
	window.requestAnimationFrame(update);
}

function handleLose() {
	setDinoLose();
	setTimeout(() => {
		document.addEventListener("keydown", handleStart, { once: true });
		startScreenElement.classList.remove("hide");
	}, 100);
}
