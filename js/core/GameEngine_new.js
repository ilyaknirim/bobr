import { Beaver } from '../game/Beaver.js';
import { ObstacleManager } from '../game/Obstacle.js';
import { BackgroundSystem } from '../game/Background.js';
import { AudioManager } from '../audio/AudioManager.js';
import { InputManager } from './InputManager.js';
import { StateManager } from './StateManager.js';

export class GameEngine {
  constructor(config) {
    this.canvas = config.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.scoreElement = config.scoreElement;
    this.bestElement = config.bestElement;
    this.dayElement = config.dayElement;

    this.baseWidth = 360;
    this.baseHeight = 180;
    this.scale = 1;
    this.dpr = window.devicePixelRatio || 1;

    this.currentDay = 1;
    this.dayProgress = 0;
    this.dayLength = 1000;

    this.gameSpeed = 3;
    this.score = 0;
    this.gameStarted = false; // Флаг для отслеживания начала игры после нажатия

    // Инициализация объектов
    this.audio = new AudioManager();
    this.state = new StateManager();
    this.input = null;
    this.beaver = null;
    this.obstacles = null;
    this.background = null;

    this.init();
  }

  init() {
    // Создание игровых объектов
    this.beaver = new Beaver(this);
    this.obstacles = new ObstacleManager(this);
    this.background = new BackgroundSystem(this);
    this.input = new InputManager(this.canvas);

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Подписка на события
    this.input.onJump(() => this.beaver.jump());
    this.input.onRestart(() => this.restart());

    this.loop();
  }

  resize() {
    const { innerWidth, innerHeight } = window;

    this.scale = Math.min(innerWidth / this.baseWidth, innerHeight / this.baseHeight);
    this.canvas.width = Math.floor(innerWidth * this.dpr);
    this.canvas.height = Math.floor(innerHeight * this.dpr);

    this.ctx.setTransform(
      this.dpr * this.scale, 0, 0,
      this.dpr * this.scale,
      (this.canvas.width - this.baseWidth * this.dpr * this.scale) / 2 / this.dpr,
      (this.canvas.height - this.baseHeight * this.dpr * this.scale) / 2 / this.dpr
    );

    // Проверяем, что бобер инициализирован
    if (this.beaver) {
      this.beaver.updateScale(this.scale);
    }

    // Обновляем скорость с учетом нового масштаба
    this.gameSpeed = 3 * this.scale;
  }

  start() {
    this.state.startGame();
    this.currentDay = 1;
    this.dayProgress = 0;
    this.score = 0;
    this.gameSpeed = 3 * this.scale;
    this.gameStarted = true;

    this.beaver.reset();
    this.obstacles.reset();

    this.audio.playMusic();
    this.updateUI();

    document.getElementById('hint').classList.remove('hidden');
  }

  update() {
    if (this.state.isPaused || this.state.isGameOver || !this.gameStarted) return;

    this.state.incrementFrame();

    // Обновление прогресса дня
    this.dayProgress++;
    if (this.dayProgress >= this.dayLength) {
      this.dayProgress = 0;
      this.currentDay++;
      this.onNewDay();
    }

    // Обновление объектов
    if (this.beaver) this.beaver.update();
    if (this.obstacles) this.obstacles.update(this.gameSpeed);
    if (this.background) this.background.update(this.dayProgress / this.dayLength);

    // Проверка столкновений
    if (this.beaver && this.obstacles && this.obstacles.checkCollision(this.beaver)) {
      this.gameOver();
      return;
    }

    // Увеличение счета
    this.score++;
    this.gameSpeed += 0.0005 * this.scale;

    // Обновление музыки
    if (this.audio) {
      this.audio.updateTempo(this.gameSpeed / (3 * this.scale));
    }

    // Обновление UI
    if (this.state.frame % 10 === 0) {
      this.updateUI();
    }
  }

  onNewDay() {
    // Каждый день добавляем новые испытания
    if (this.obstacles) {
      this.obstacles.addNewObstacleType(this.currentDay);
      this.obstacles.increaseFrequency();
    }

    // Увеличиваем сложность
    this.gameSpeed *= 1.05;

    // Воспроизводим звук нового дня
    if (this.audio) {
      this.audio.playNewDaySound();
    }
  }

  gameOver() {
    this.state.endGame();

    // Сохраняем рекорд
    const best = parseInt(localStorage.getItem('beaver-best') || 0);
    if (this.score > best) {
      localStorage.setItem('beaver-best', this.score);
    }

    // Увеличиваем счетчик игр
    const gamesPlayed = parseInt(localStorage.getItem('beaver-games-played') || 0);
    localStorage.setItem('beaver-games-played', gamesPlayed + 1);

    // Останавливаем музыку
    if (this.audio) {
      this.audio.stopMusic();
    }

    // Показываем экран Game Over
    document.getElementById('final-score').textContent = this.score;
    document.getElementById('final-days').textContent = this.currentDay;
    document.getElementById('final-best').textContent = Math.max(this.score, best);

    // Обновляем сообщение о трезвости
    const sobrietyMessage = document.querySelector('.sobriety-message');
    if (sobrietyMessage) {
      const daysText = this.currentDay === 1 ? 'день' : (this.currentDay >= 2 && this.currentDay <= 4 ? 'дня' : 'дней');
      sobrietyMessage.innerHTML = `Поздравляю, Бобёр не бухал <span id="final-days">${this.currentDay}</span> ${daysText}!`;
    }

    document.getElementById('game-over').classList.remove('hidden');
    document.getElementById('hint').classList.add('hidden');
  }

  restart() {
    this.state.startGame();
    this.currentDay = 1;
    this.dayProgress = 0;
    this.score = 0;
    this.gameSpeed = 3 * this.scale;
    this.gameStarted = false; // Игра начнется только после нажатия

    if (this.beaver) this.beaver.reset();
    if (this.obstacles) this.obstacles.reset();

    if (this.audio) this.audio.playMusic();

    this.updateUI();

    document.getElementById('game-over').classList.add('hidden');
    document.getElementById('hint').classList.remove('hidden');
  }

  updateUI() {
    if (this.scoreElement) this.scoreElement.textContent = this.score;
    if (this.bestElement) this.bestElement.textContent = localStorage.getItem('beaver-best') || 0;
    if (this.dayElement) this.dayElement.textContent = `День ${this.currentDay}`;
  }

  draw() {
    if (!this.ctx) return;

    // Очистка канваса
    this.ctx.clearRect(0, 0, this.baseWidth, this.baseHeight);

    // Если игра не началась, не рисуем игровые элементы
    if (!this.gameStarted) {
      return;
    }

    // Рисование фона
    if (this.background) {
      this.background.draw(this.ctx);
    }

    // Рисование объектов
    if (this.obstacles) {
      this.obstacles.draw(this.ctx);
    }

    if (this.beaver) {
      this.beaver.draw(this.ctx);
    }

    // Рисование интерфейса игры
    if (this.state.isGameOver) {
      this.drawGameOver();
    }
  }

  drawGameOver() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.baseWidth, this.baseHeight);

    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 20px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('ИГРА ОКОНЧЕНА', this.baseWidth / 2, this.baseHeight / 2 - 30);

    this.ctx.font = '16px sans-serif';
    const days = Math.floor(this.score / 100);
    const dayWord = days === 1 ? 'день' : (days >= 2 && days <= 4 ? 'дня' : 'дней');
    this.ctx.fillText(`Бобёр продержался ${days} ${dayWord}`, this.baseWidth / 2, this.baseHeight / 2);
  }

  drawInstructions() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.baseWidth, this.baseHeight);

    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 18px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('ПОМОГИ БОБРУ НЕ БУХАТЬ!', this.baseWidth / 2, this.baseHeight / 2 - 40);

    this.ctx.font = '14px sans-serif';
    this.ctx.fillText('Избегайте бутылок и других препятствий', this.baseWidth / 2, this.baseHeight / 2 - 10);
    this.ctx.fillText('Нажмите для начала игры', this.baseWidth / 2, this.baseHeight / 2 + 20);
  }

  loop() {
    try {
      this.update();
      this.draw();
    } catch (error) {
      console.error('Ошибка в игровом цикле:', error);
    }
    requestAnimationFrame(() => this.loop());
  }

  togglePause() {
    if (this.state) {
      return this.state.togglePause();
    }
    return false;
  }

  toggleSound() {
    if (this.audio) {
      return this.audio.toggleMute();
    }
    return false;
  }
}
