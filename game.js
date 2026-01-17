// ===== SVG спрайты =====
const beaverSVG = new Image();
beaverSVG.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="50" height="40">
  <!-- Тело бобра, вытянутое вправо -->
  <ellipse cx="25" cy="24" rx="18" ry="12" fill="#8b5a2b"/>
  <!-- Голова -->
  <ellipse cx="35" cy="16" rx="12" ry="9" fill="#a66a3c"/>
  <!-- Глаза -->
  <circle cx="32" cy="14" r="2" fill="#000"/>
  <circle cx="38" cy="14" r="2" fill="#000"/>
  <!-- Нос -->
  <circle cx="42" cy="16" r="1.5" fill="#000"/>
  <!-- Зубы -->
  <rect x="40" y="18" width="2" height="3" fill="#fff"/>
  <rect x="43" y="18" width="2" height="3" fill="#fff"/>
  <!-- Хвост -->
  <ellipse cx="8" cy="26" rx="8" ry="6" fill="#7a4a23"/>
  <!-- Ноги для бега -->
  <rect x="15" y="30" width="4" height="8" rx="2" fill="#6b4a1b"/>
  <rect x="25" y="30" width="4" height="8" rx="2" fill="#6b4a1b"/>
  <!-- Уши -->
  <ellipse cx="30" cy="8" rx="3" ry="4" fill="#a66a3c"/>
  <ellipse cx="38" cy="8" rx="3" ry="4" fill="#a66a3c"/>
</svg>`);

const bottleSVG = new Image();
bottleSVG.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="40">
  <rect x="8" y="6" width="8" height="28" rx="3" fill="#3aaed8"/>
  <rect x="10" y="0" width="4" height="6" fill="#2b8fb3"/>
</svg>`);

// ===== Функция для рисования фона с заснеженным еловым лесом =====
function drawBackground(ctx, W, H, frame) {
  // Небо
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, '#d6eaf8');
  gradient.addColorStop(1, '#aed6f1');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  // Задний слой елей (самый дальний)
  ctx.fillStyle = '#c8e6c9';
  drawTrees(ctx, W, H, 40, 60, 0.3, frame * 0.2);

  // Средний слой елей
  ctx.fillStyle = '#a5d6a7';
  drawTrees(ctx, W, H, 60, 80, 0.5, frame * 0.5);

  // Передний слой елей
  ctx.fillStyle = '#81c784';
  drawTrees(ctx, W, H, 80, 100, 0.7, frame * 0.8);

  // Снег на земле
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(0, H - 24);
  ctx.lineTo(W, H - 24);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
}

function drawTrees(ctx, W, H, minHeight, maxHeight, opacity, offset) {
  ctx.globalAlpha = opacity;
  
  // Рисуем ели через равные промежутки
  const spacing = 120;
  const startX = -(offset % spacing);
  
  for (let x = startX; x < W + spacing; x += spacing) {
    const height = minHeight + Math.random() * (maxHeight - minHeight);
    const width = height * 0.7;
    const y = H - 24 - height;
    
    // Рисуем ель (треугольники)
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y);
    ctx.lineTo(x, y + height * 0.4);
    ctx.lineTo(x + width, y + height * 0.4);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y + height * 0.3);
    ctx.lineTo(x + width * 0.2, y + height * 0.7);
    ctx.lineTo(x + width * 0.8, y + height * 0.7);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y + height * 0.6);
    ctx.lineTo(x + width * 0.3, y + height);
    ctx.lineTo(x + width * 0.7, y + height);
    ctx.closePath();
    ctx.fill();
  }
  
  // Сбрасываем прозрачность
  ctx.globalAlpha = 1;
}

// ===== Игра =====

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let W = canvas.width;
let H = canvas.height;

const groundY = H - 24;

const beaver = {
  x: 40,
  y: groundY - 40,
  w: 50,
  h: 40,
  vy: 0,
  jump() {
    if (this.y >= groundY - this.h - 0.1) {
      this.vy = -11;
    }
  }
};

let gravity = 0.5;
let speed = 3;
let obstacles = [];
let frame = 0;
let score = 0;
let best = Number(localStorage.getItem('beaver-best') || 0);
let gameOver = false;
let gameStarted = false;

const scoreEl = document.getElementById('score');
const bestEl = document.getElementById('best');
bestEl.textContent = 'BEST: ' + best;

function spawnBottle() {
  obstacles.push({
    x: W + 20,
    y: groundY - 40,
    w: 24,
    h: 40
  });
}

function reset() {
  obstacles = [];
  frame = 0;
  score = 0;
  speed = 3;
  beaver.y = groundY - beaver.h;
  beaver.vy = 0;
  gameOver = false;
  gameStarted = true;
}

function collide(a, b) {
  return a.x < b.x + b.w &&
         a.x + a.w > b.x &&
         a.y < b.y + b.h &&
         a.y + a.h > b.y;
}

function update() {
  frame++;

  // Бобёр
  beaver.vy += gravity;
  beaver.y += beaver.vy;
  if (beaver.y > groundY - beaver.h) {
    beaver.y = groundY - beaver.h;
    beaver.vy = 0;
  }

  // Препятствия
  if (frame % 90 === 0) spawnBottle();
  obstacles.forEach(o => o.x -= speed);
  obstacles = obstacles.filter(o => o.x + o.w > 0);

  // Столкновения
  for (let o of obstacles) {
    if (collide(beaver, o)) {
      gameOver = true;
      best = Math.max(best, score);
      localStorage.setItem('beaver-best', best);
      bestEl.textContent = 'BEST: ' + best;


    }
  }

  // Очки
  if (!gameOver) {
    score++;
    speed += 0.0005;
  }
  scoreEl.textContent = score;
}

function draw() {
  // Рисуем фон с заснеженным еловым лесом
  drawBackground(ctx, W, H, frame);

  // Земля
  ctx.fillStyle = '#ddd';
  ctx.fillRect(0, groundY, W, 2);

  // Бобёр
  ctx.drawImage(beaverSVG, beaver.x, beaver.y, beaver.w, beaver.h);

  // Бутылки
  obstacles.forEach(o => {
    ctx.drawImage(bottleSVG, o.x, o.y, o.w, o.h);
  });

  // Начальное сообщение
  if (!gameStarted) {
    ctx.fillStyle = '#000';
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Помоги бобру не бухать', W / 2, H / 2 - 15);
    ctx.font = '14px sans-serif';
    ctx.fillText('Коснись, если готов', W / 2, H / 2 + 10);
  }

  if (gameOver) {
    ctx.fillStyle = '#000';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Игра окончена', W / 2, H / 2 - 40);
    
    // Сообщение о трезвости
    const soberDays = Math.floor(score / 100);
    const dayWord = soberDays === 1 ? 'день' : (soberDays >= 2 && soberDays <= 4 ? 'дня' : 'дней');
    ctx.fillText(`Бобёр не бухал ${soberDays} ${dayWord}`, W / 2, H / 2 - 15);
    
    ctx.font = '14px sans-serif';
    ctx.fillText('Коснись, чтобы начать заново', W / 2, H / 2 + 10);
  }
}

function loop() {
  if (!gameOver) update();
  draw();
  requestAnimationFrame(loop);
}

// Управление (тач + клик)
function action() {
  if (gameOver) reset();
  else if (!gameStarted) {
    gameStarted = true;
    reset();
  }
  else beaver.jump();
}

canvas.addEventListener('touchstart', e => { e.preventDefault(); action(); });
canvas.addEventListener('mousedown', action);

loop();