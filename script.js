const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

const birdImg = new Image();
birdImg.src = 'https://i.postimg.cc/PrymFVhr/flappy-bird.png';

const pipeImg = new Image();
pipeImg.src = 'https://i.postimg.cc/FHnHY3bx/flappy-bird-pipe.png';

const bird = {
  x: 50,
  y: 150,
  width: 34,
  height: 24,
  gravity: 0.25,
  lift: -4,
  velocity: 0
};

let pipes = [];
const pipeWidth = 52;
const pipeGap = 150;
let frameCount = 0;
let score = 0;
let gameRunning = false;
let gameOver = false;

function drawBird() {
  ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    ctx.drawImage(pipeImg, pipe.x, 0, pipeWidth, pipe.top);
    ctx.drawImage(pipeImg, pipe.x, canvas.height - pipe.bottom, pipeWidth, pipe.bottom);
  }
}

function updateBird() {
  if (!gameRunning) return;
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    endGame();
  }
}

function updatePipes() {
  if (!gameRunning) return;
  if (frameCount % 90 === 0) {
    const topHeight = Math.random() * (canvas.height - pipeGap - 50) + 20;
    const bottomHeight = canvas.height - pipeGap - topHeight;
    pipes.push({ x: canvas.width, top: topHeight, bottom: bottomHeight });
  }
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= 2;
    if (pipes[i].x + pipeWidth < 0) {
      pipes.splice(i, 1);
      score++;
    }
  }
}

function checkCollision() {
  for (let i = 0; i < pipes.length; i++) {
    const pipe = pipes[i];
    if (
      bird.x < pipe.x + pipeWidth &&
      bird.x + bird.width > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.height > canvas.height - pipe.bottom)
    ) {
      return true;
    }
  }
  return false;
}

function drawScore() {
  document.getElementById('score').innerText = score;
}

function endGame() {
  gameRunning = false;
  gameOver = true;
  document.getElementById('game-over').classList.remove('hidden');
  document.getElementById('final-score').innerText = `Score: ${score}`;
}

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frameCount = 0;
  gameOver = false;
  document.getElementById('game-over').classList.add('hidden');
  document.getElementById('start-text').classList.remove('hidden');
  drawScore();
  drawBird();
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();
  updateBird();
  updatePipes();
  drawScore();

  if (!checkCollision() && !gameOver) {
    frameCount++;
    requestAnimationFrame(gameLoop);
  } else if (checkCollision()) {
    endGame();
  }
}

document.addEventListener('keydown', () => {
  if (!gameRunning && !gameOver) {
    gameRunning = true;
    document.getElementById('start-text').classList.add('hidden');
    gameLoop();
  }
  bird.velocity = bird.lift;
});

canvas.addEventListener('click', () => {
  if (!gameRunning && !gameOver) {
    gameRunning = true;
    document.getElementById('start-text').classList.add('hidden');
    gameLoop();
  }
  bird.velocity = bird.lift;
});

document.getElementById('retry-button').addEventListener('click', resetGame);

resetGame();
