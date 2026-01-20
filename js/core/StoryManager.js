// Менеджер управления сюжетом
export class StoryManager {
  constructor(gameEngine) {
    this.gameEngine = gameEngine;
    this.currentIntroPage = 1;
    this.currentFinalPage = 1;
    this.totalPages = 3;

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Кнопки навигации для вступления
    const prevBtn = document.getElementById('prev-story');
    const nextBtn = document.getElementById('next-story');
    const startGameBtn = document.getElementById('start-game');
    const dots = document.querySelectorAll('#intro-screen .dot');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigateIntro('prev'));
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigateIntro('next'));
    }

    if (startGameBtn) {
      startGameBtn.addEventListener('click', () => this.startGameFromIntro());
    }
    
    const skipIntroBtn = document.getElementById('skip-intro');
    if (skipIntroBtn) {
      skipIntroBtn.addEventListener('click', () => this.showStartScreen());
    }

    // Навигация по точкам для вступления
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        this.goToIntroPage(parseInt(dot.dataset.page));
      });
    });

    // Кнопки навигации для финала
    const prevFinalBtn = document.getElementById('prev-final');
    const nextFinalBtn = document.getElementById('next-final');
    const finishGameBtn = document.getElementById('finish-game');
    const finalDots = document.querySelectorAll('#final-screen .dot');

    if (prevFinalBtn) {
      prevFinalBtn.addEventListener('click', () => this.navigateFinal('prev'));
    }

    if (nextFinalBtn) {
      nextFinalBtn.addEventListener('click', () => this.navigateFinal('next'));
    }

    if (finishGameBtn) {
      finishGameBtn.addEventListener('click', () => this.finishGame());
    }
    
    const skipFinalBtn = document.getElementById('skip-final');
    if (skipFinalBtn) {
      skipFinalBtn.addEventListener('click', () => this.finishGame());
    }

    // Навигация по точкам для финала
    finalDots.forEach(dot => {
      dot.addEventListener('click', () => {
        this.goToFinalPage(parseInt(dot.dataset.page));
      });
    });
  }

  // Навигация по страницам вступления
  navigateIntro(direction) {
    if (direction === 'next' && this.currentIntroPage < this.totalPages) {
      this.currentIntroPage++;
    } else if (direction === 'prev' && this.currentIntroPage > 1) {
      this.currentIntroPage--;
    }

    this.updateIntroUI();
  }

  goToIntroPage(page) {
    this.currentIntroPage = page;
    this.updateIntroUI();
  }

  updateIntroUI() {
    // Обновляем видимость страниц
    const pages = document.querySelectorAll('#intro-screen .story-page');
    pages.forEach((page, index) => {
      if (index + 1 === this.currentIntroPage) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    // Обновляем точки
    const dots = document.querySelectorAll('#intro-screen .dot');
    dots.forEach((dot, index) => {
      if (index + 1 === this.currentIntroPage) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Обновляем кнопки
    const prevBtn = document.getElementById('prev-story');
    const nextBtn = document.getElementById('next-story');
    const startGameBtn = document.getElementById('start-game');

    if (prevBtn) {
      if (this.currentIntroPage === 1) {
        prevBtn.classList.add('hidden');
      } else {
        prevBtn.classList.remove('hidden');
      }
    }

    if (nextBtn) {
      if (this.currentIntroPage === this.totalPages) {
        nextBtn.classList.add('hidden');
        if (startGameBtn) startGameBtn.classList.remove('hidden');
      } else {
        nextBtn.classList.remove('hidden');
        if (startGameBtn) startGameBtn.classList.add('hidden');
      }
    }
  }

  // Навигация по страницам финала
  navigateFinal(direction) {
    if (direction === 'next' && this.currentFinalPage < this.totalPages) {
      this.currentFinalPage++;
    } else if (direction === 'prev' && this.currentFinalPage > 1) {
      this.currentFinalPage--;
    }

    this.updateFinalUI();
  }

  goToFinalPage(page) {
    this.currentFinalPage = page;
    this.updateFinalUI();
  }

  updateFinalUI() {
    // Обновляем видимость страниц
    const pages = document.querySelectorAll('#final-screen .story-page');
    pages.forEach((page, index) => {
      if (index + 1 === this.currentFinalPage) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    // Обновляем точки
    const dots = document.querySelectorAll('#final-screen .dot');
    dots.forEach((dot, index) => {
      if (index + 1 === this.currentFinalPage) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Обновляем кнопки
    const prevBtn = document.getElementById('prev-final');
    const nextBtn = document.getElementById('next-final');
    const finishGameBtn = document.getElementById('finish-game');

    if (prevBtn) {
      if (this.currentFinalPage === 1) {
        prevBtn.classList.add('hidden');
      } else {
        prevBtn.classList.remove('hidden');
      }
    }

    if (nextBtn) {
      if (this.currentFinalPage === this.totalPages) {
        nextBtn.classList.add('hidden');
        if (finishGameBtn) finishGameBtn.classList.remove('hidden');
      } else {
        nextBtn.classList.remove('hidden');
        if (finishGameBtn) finishGameBtn.classList.add('hidden');
      }
    }
  }

  startGameFromIntro() {
    document.getElementById('intro-screen').classList.add('hidden');
    this.gameEngine.start();
  }

  showFinalScreen(days) {
    // Обновляем количество дней в тексте
    const daysText = document.getElementById('final-days-text');
    if (daysText) {
      const daysWord = days === 1 ? 'день' : (days >= 2 && days <= 4 ? 'дня' : 'дней');
      daysText.textContent = `${days} ${daysWord}`;
    }

    // Показываем экран финала
    document.getElementById('final-screen').classList.remove('hidden');

    // Сбрасываем на первую страницу
    this.currentFinalPage = 1;
    this.updateFinalUI();

    // Воспроизводим торжественную музыку
    if (this.gameEngine && this.gameEngine.audio) {
      this.gameEngine.audio.playFinalMusic();
    }
  }

  finishGame() {
    document.getElementById('final-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');

    // Сбрасываем страницы
    this.currentIntroPage = 1;
    this.updateIntroUI();
  }

  showStartScreen() {
    document.getElementById('intro-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
  }
}
