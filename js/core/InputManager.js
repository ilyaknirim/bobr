export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.isPressed = false;
    this.lastTapTime = 0;
    this.doubleTapDelay = 300;
    
    this.jumpHandlers = [];
    this.restartHandlers = [];
    
    this.init();
  }

  init() {
    // Touch события
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    
    // Mouse события
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    
    // Предотвращаем контекстное меню
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    
    // Предотвращаем выделение текста при таче
    this.canvas.style.userSelect = 'none';
    this.canvas.style.webkitUserSelect = 'none';
  }

  handleTouchStart(e) {
    e.preventDefault();
    this.isPressed = true;
    
    const currentTime = Date.now();
    const tapLength = currentTime - this.lastTapTime;
    
    // Проверка на двойное касание
    if (tapLength < this.doubleTapDelay && tapLength > 0) {
      // Двойное касание - рестарт
      this.triggerRestart();
    } else {
      // Одиночное касание - прыжок
      this.triggerJump();
    }
    
    this.lastTapTime = currentTime;
  }

  handleTouchEnd(e) {
    e.preventDefault();
    this.isPressed = false;
  }

  handleTouchMove(e) {
    e.preventDefault();
  }

  handleMouseDown(e) {
    e.preventDefault();
    this.isPressed = true;
    this.triggerJump();
  }

  handleMouseUp(e) {
    e.preventDefault();
    this.isPressed = false;
  }

  onJump(handler) {
    this.jumpHandlers.push(handler);
  }

  onRestart(handler) {
    this.restartHandlers.push(handler);
  }

  triggerJump() {
    this.jumpHandlers.forEach(handler => handler());
  }

  triggerRestart() {
    this.restartHandlers.forEach(handler => handler());
  }
}