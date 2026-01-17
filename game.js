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

// ===== Функция для рисования фона с постепенным переходом от леса к космосу =====
function drawBackground(ctx, W, H, frame, score) {
  // Определяем этап игры на основе очков
  // 0-100 очков: лес
  // 101-300 очков: переход от леса к закату
  // 301-600 очков: закат и сумерки
  // 601-1000 очков: переход к ночи
  // 1001+ очков: космос с метеоритами

  let stage = 0; // по умолчанию - лес
  if (score > 100 && score <= 300) stage = 1; // переход к закату
  else if (score > 300 && score <= 600) stage = 2; // закат и сумерки
  else if (score > 600 && score <= 1000) stage = 3; // переход к ночи
  else if (score > 1000) stage = 4; // космос

  // Рисуем фон в зависимости от этапа
  if (stage === 0) {
    drawForestBackground(ctx, W, H, frame);
  } else if (stage === 1) {
    drawTransitionToSunset(ctx, W, H, frame, score);
  } else if (stage === 2) {
    drawSunsetBackground(ctx, W, H, frame);
  } else if (stage === 3) {
    drawTransitionToNight(ctx, W, H, frame, score);
  } else {
    drawSpaceBackground(ctx, W, H, frame);
  }
}

// ===== Лесной фон (начальный этап) =====
function drawForestBackground(ctx, W, H, frame) {
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

// ===== Переход от леса к закату =====
function drawTransitionToSunset(ctx, W, H, frame, score) {
  // Вычисляем коэффициент перехода (от 0 до 1)
  const transition = (score - 100) / 200;

  // Небо с переходом от дневного к закатному
  const gradient = ctx.createLinearGradient(0, 0, 0, H);

  // Цвета неба меняются от голубого к оранжевому/розовому
  const r1 = Math.floor(214 * (1 - transition) + 255 * transition);
  const g1 = Math.floor(234 * (1 - transition) + 157 * transition);
  const b1 = Math.floor(248 * (1 - transition) + 77 * transition);

  const r2 = Math.floor(174 * (1 - transition) + 70 * transition);
  const g2 = Math.floor(214 * (1 - transition) + 130 * transition);
  const b2 = Math.floor(241 * (1 - transition) + 180 * transition);

  gradient.addColorStop(0, `rgb(${r1}, ${g1}, ${b1})`);
  gradient.addColorStop(1, `rgb(${r2}, ${g2}, ${b2})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  // Ели становятся темнее и менее заметными
  const treeOpacity = 1 - transition * 0.5;

  // Задний слой елей (самый дальний)
  ctx.fillStyle = `rgba(200, 230, 201, ${treeOpacity * 0.3})`;
  drawTrees(ctx, W, H, 40, 60, 0.3, frame * 0.2);

  // Средний слой елей
  ctx.fillStyle = `rgba(165, 214, 167, ${treeOpacity * 0.5})`;
  drawTrees(ctx, W, H, 60, 80, 0.5, frame * 0.5);

  // Передний слой елей
  ctx.fillStyle = `rgba(129, 199, 132, ${treeOpacity * 0.7})`;
  drawTrees(ctx, W, H, 80, 100, 0.7, frame * 0.8);

  // Снег на земле становится желтоватым
  const snowR = Math.floor(255 * (1 - transition) + 240 * transition);
  const snowG = Math.floor(255 * (1 - transition) + 230 * transition);
  const snowB = Math.floor(255 * (1 - transition) + 200 * transition);
  ctx.fillStyle = `rgb(${snowR}, ${snowG}, ${snowB})`;
  ctx.beginPath();
  ctx.moveTo(0, H - 24);
  ctx.lineTo(W, H - 24);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
}

// ===== Фон заката и сумерек =====
function drawSunsetBackground(ctx, W, H, frame) {
  // Небо заката
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, '#ff9d4d');
  gradient.addColorStop(0.5, '#ff8252');
  gradient.addColorStop(1, '#ff8268');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  // Добавляем солнце на горизонте
  ctx.fillStyle = '#ffeb3b';
  ctx.beginPath();
  ctx.arc(W - 80, H - 60, 25, 0, Math.PI * 2);
  ctx.fill();

  // Ели становятся силуэтами
  ctx.fillStyle = 'rgba(34, 49, 39, 0.7)';
  drawTrees(ctx, W, H, 40, 60, 0.3, frame * 0.2);

  ctx.fillStyle = 'rgba(34, 49, 39, 0.8)';
  drawTrees(ctx, W, H, 60, 80, 0.5, frame * 0.5);

  ctx.fillStyle = 'rgba(34, 49, 39, 0.9)';
  drawTrees(ctx, W, H, 80, 100, 0.7, frame * 0.8);

  // Земля становится темной
  ctx.fillStyle = '#4a3b31';
  ctx.beginPath();
  ctx.moveTo(0, H - 24);
  ctx.lineTo(W, H - 24);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
}

// ===== Переход от заката к ночи =====
function drawTransitionToNight(ctx, W, H, frame, score) {
  // Вычисляем коэффициент перехода (от 0 до 1)
  const transition = (score - 600) / 400;

  // Небо с переходом от закатного к ночному
  const gradient = ctx.createLinearGradient(0, 0, 0, H);

  // Цвета неба меняются от оранжевого к темно-синему/черному
  const r1 = Math.floor(255 * (1 - transition) + 10 * transition);
  const g1 = Math.floor(157 * (1 - transition) + 10 * transition);
  const b1 = Math.floor(77 * (1 - transition) + 30 * transition);

  const r2 = Math.floor(70 * (1 - transition) + 5 * transition);
  const g2 = Math.floor(130 * (1 - transition) + 5 * transition);
  const b2 = Math.floor(180 * (1 - transition) + 20 * transition);

  gradient.addColorStop(0, `rgb(${r1}, ${g1}, ${b1})`);
  gradient.addColorStop(1, `rgb(${r2}, ${g2}, ${b2})`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  // Солнце садится и исчезает
  if (transition < 0.5) {
    const sunOpacity = 1 - transition * 2;
    const sunY = H - 60 + transition * 40;
    ctx.fillStyle = `rgba(255, 235, 59, ${sunOpacity})`;
    ctx.beginPath();
    ctx.arc(W - 80, sunY, 25, 0, Math.PI * 2);
    ctx.fill();
  }

  // Появляются первые звезды
  if (transition > 0.3) {
    const starsOpacity = (transition - 0.3) / 0.7;
    drawStars(ctx, W, H, starsOpacity);
  }

  // Ели становятся еще темнее
  const treeOpacity = 0.7 + transition * 0.3;
  ctx.fillStyle = `rgba(34, 49, 39, ${treeOpacity})`;
  drawTrees(ctx, W, H, 40, 60, 0.3, frame * 0.2);
  drawTrees(ctx, W, H, 60, 80, 0.5, frame * 0.5);
  drawTrees(ctx, W, H, 80, 100, 0.7, frame * 0.8);

  // Земля становится почти черной
  const groundR = Math.floor(74 * (1 - transition) + 5 * transition);
  const groundG = Math.floor(59 * (1 - transition) + 5 * transition);
  const groundB = Math.floor(49 * (1 - transition) + 15 * transition);
  ctx.fillStyle = `rgb(${groundR}, ${groundG}, ${groundB})`;
  ctx.beginPath();
  ctx.moveTo(0, H - 24);
  ctx.lineTo(W, H - 24);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fill();
}

// ===== Космический фон с метеоритами =====
function drawSpaceBackground(ctx, W, H, frame) {
  // Космическое небо
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, '#000011');
  gradient.addColorStop(0.5, '#000033');
  gradient.addColorStop(1, '#000022');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  // Звезды
  drawStars(ctx, W, H, 1);

  // Метеориты
  drawMeteors(ctx, W, H, frame);

  // Земля видна как темная линия на горизонте
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, H - 24, W, 24);
}

// ===== Функция для рисования звезд =====
function drawStars(ctx, W, H, opacity) {
  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;

  // Рисуем звезды случайным образом, но с фиксированным seed для предсказуемости
  const seed = 12345;
  let random = seed;

  function nextRandom() {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  }

  // Рисуем 100 звезд
  for (let i = 0; i < 100; i++) {
    const x = nextRandom() * W;
    const y = nextRandom() * H * 0.7; // Только в верхней 70% экрана
    const size = nextRandom() * 2 + 0.5;

    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ===== Функция для рисования метеоритов =====
function drawMeteors(ctx, W, H, frame) {
  // Метеориты появляются случайным образом
  const meteorCount = 5;

  for (let i = 0; i < meteorCount; i++) {
    // Используем индекс и frame для создания предсказуемой позиции метеорита
    const seed = 54321 + i * 1000;
    let random = seed;

    function nextRandom() {
      random = (random * 9301 + 49297) % 233280;
      return random / 233280;
    }

    // Метеориты появляются каждые 200 кадров
    const meteorFrame = (frame + i * 40) % 200;

    if (meteorFrame < 50) {
      const progress = meteorFrame / 50;

      // Начальная позиция (случайная в верхней части экрана)
      const startX = nextRandom() * W;
      const startY = nextRandom() * H * 0.5;

      // Конечная позиция (вниз и вправо)
      const endX = startX + 100 + nextRandom() * 100;
      const endY = startY + 100 + nextRandom() * 100;

      // Текущая позиция
      const x = startX + (endX - startX) * progress;
      const y = startY + (endY - startY) * progress;

      // Рисуем метеорит
      const gradient = ctx.createLinearGradient(x - 20, y - 20, x, y);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 200, 0.5)');
      gradient.addColorStop(1, 'rgba(255, 200, 100, 0.8)');

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 20, y - 20);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Яркая голова метеорита
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
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

// Инициализация аудио
initMusic();

// Добавляем переменную для отслеживания последнего прыжка
let lastJumpTime = 0;

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
      // Добавляем небольшую задержку между звуками прыжка
      const currentTime = Date.now();
      if (currentTime - lastJumpTime > 200) {
        playJumpSound(); // Звук прыжка
        lastJumpTime = currentTime;
      }
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
  
  // Добавляем звук появления бутылки
  playBottleSpawnSound();
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
  
  // Запускаем музыку при начале игры
  playRussianRock();
  
  // Устанавливаем начальный темп
  updateMusicTempo(speed);
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
      
      // Воспроизводим звук столкновения и останавливаем музыку
      playCollisionSound();
      stopMusic();


    }
  }

  // Очки
  if (!gameOver) {
    score++;
    const oldSpeed = speed;
    speed += 0.0005;
    
    // Обновляем темп музыки при значительном изменении скорости
    if (Math.floor(oldSpeed * 10) !== Math.floor(speed * 10)) {
      updateMusicTempo(speed);
      // Обновляем интервалы музыки
      if (window.updateMusicIntervals) {
        window.updateMusicIntervals();
      }
    }
  }
  scoreEl.textContent = score;
}

function draw() {
  // Рисуем фон с переходом от леса к космосу в зависимости от очков
  drawBackground(ctx, W, H, frame, score);

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