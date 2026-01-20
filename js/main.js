import { GameEngine } from './core/GameEngine.js';

class Game {
  constructor() {
    this.gameEngine = null;
    this.init();
  }

  async init() {
    try {
      // Проверяем, что все необходимые элементы существуют
      const canvas = document.getElementById('game');
      const scoreElement = document.getElementById('score');
      const bestElement = document.getElementById('best');
      const dayElement = document.getElementById('day');
      
      if (!canvas || !scoreElement || !bestElement || !dayElement) {
        throw new Error('Не удалось найти необходимые элементы DOM');
      }
      
      // Создание игрового движка
      this.gameEngine = new GameEngine({
        canvas: canvas,
        scoreElement: scoreElement,
        bestElement: bestElement,
        dayElement: dayElement
      });
      
      // Настройка UI событий
      this.setupUI();
      
      // Скрытие экрана загрузки
      document.getElementById('loading-screen').classList.add('hidden');
      document.getElementById('intro-screen').classList.remove('hidden');
      
      // Обновление статистики
      this.updateStats();
      
    } catch (error) {
      console.error('Ошибка инициализации игры:', error);
      const loadingScreen = document.getElementById('loading-screen');
      if (loadingScreen) {
        loadingScreen.innerHTML = 
          '<div class="error">Ошибка загрузки игры. Пожалуйста, обновите страницу.</div>' +
          '<div style="margin-top: 20px; font-size: 14px; color: #666;">' + error.message + '</div>';
      }
    }
  }

  setupUI() {
    // Кнопка старта
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        document.getElementById('start-screen').classList.add('hidden');
        if (this.gameEngine) {
          this.gameEngine.start();
        }
      });
    }
    
    // Обработчик касания на весь экран для первого запуска
    document.addEventListener('click', (e) => {
      const startScreen = document.getElementById('start-screen');
      if (!startScreen.classList.contains('hidden') && 
          !e.target.closest('#start-btn')) {
        startScreen.classList.add('hidden');
        if (this.gameEngine) {
          this.gameEngine.start();
        }
      }
    });

    // Кнопка рестарта
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        document.getElementById('game-over').classList.add('hidden');
        if (this.gameEngine) {
          this.gameEngine.restart();
        }
      });
    }
    
    // Обработчик касания на весь экран для перезапуска
    document.addEventListener('click', (e) => {
      const gameOverScreen = document.getElementById('game-over');
      if (!gameOverScreen.classList.contains('hidden') && 
          !e.target.closest('#restart-btn')) {
        gameOverScreen.classList.add('hidden');
        if (this.gameEngine) {
          this.gameEngine.restart();
        }
      }
    });

    // Управление звуком
    const soundBtn = document.getElementById('sound-btn');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        if (this.gameEngine && this.gameEngine.audio) {
          const muted = this.gameEngine.audio.toggleMute();
          soundBtn.textContent = muted ? '🔇' : '🔊';
        }
      });
    }

    // Пауза
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        if (this.gameEngine) {
          const paused = this.gameEngine.togglePause();
          pauseBtn.textContent = paused ? '▶️' : '⏸️';
        }
      });
    }
  }

  updateStats() {
    const gamesPlayed = localStorage.getItem('beaver-games-played') || 0;
    const bestScore = localStorage.getItem('beaver-best') || 0;
    
    const startBest = document.getElementById('start-best');
    const gamesPlayedEl = document.getElementById('games-played');
    
    if (startBest) startBest.textContent = bestScore;
    if (gamesPlayedEl) gamesPlayedEl.textContent = gamesPlayed;
  }
}

// Запуск игры при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});

// Предотвращаем стандартное поведение жестов на мобильных
document.addEventListener('touchmove', (e) => {
  if (e.scale !== 1) {
    e.preventDefault();
  }
}, { passive: false });

// Добавляем обработчик для восстановления аудио
document.addEventListener('click', () => {
  if (window.game && window.game.gameEngine && window.game.gameEngine.audio) {
    window.game.gameEngine.audio.resumeAudio();
  }
});