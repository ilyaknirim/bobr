export class StateManager {
  constructor() {
    this.currentState = 'menu';
    this.frame = 0;
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('beaver-best') || 0);
    this.gamesPlayed = parseInt(localStorage.getItem('beaver-games-played') || 0);
  }

  startGame() {
    this.currentState = 'playing';
    this.frame = 0;
    this.score = 0;
  }

  pauseGame() {
    if (this.currentState === 'playing') {
      this.currentState = 'paused';
      return true;
    }
    return false;
  }

  resumeGame() {
    if (this.currentState === 'paused') {
      this.currentState = 'playing';
      return true;
    }
    return false;
  }

  togglePause() {
    if (this.currentState === 'playing') {
      this.currentState = 'paused';
      return true;
    } else if (this.currentState === 'paused') {
      this.currentState = 'playing';
      return false;
    }
    return false;
  }

  endGame() {
    this.currentState = 'gameOver';
    
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('beaver-best', this.bestScore);
    }
    
    this.gamesPlayed++;
    localStorage.setItem('beaver-games-played', this.gamesPlayed);
  }

  get isPlaying() { return this.currentState === 'playing'; }
  get isPaused() { return this.currentState === 'paused'; }
  get isGameOver() { return this.currentState === 'gameOver'; }
  get isMenu() { return this.currentState === 'menu'; }
  get hasStarted() { return this.currentState !== 'menu'; }

  addScore(points) { this.score += points; }
  getScore() { return this.score; }
  getBestScore() { return this.bestScore; }
  getGamesPlayed() { return this.gamesPlayed; }

  incrementFrame() { this.frame++; }
  getFrame() { return this.frame; }
}