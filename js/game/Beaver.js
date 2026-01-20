export class Beaver {
  constructor(game) {
    this.game = game;
    this.width = 50;
    this.height = 40;
    this.x = 40;
    this.y = game ? game.baseHeight - 24 - this.height : 116; // 180-24-40=116
    this.velocityY = 0;
    this.gravity = 0.5;
    this.scale = 1;
    
    // Анимационные параметры
    this.animationFrame = 0;
    this.legPosition = 0;
    this.bodyBob = 0;
    this.isJumping = false;
    
    // Состояния анимации
    this.state = 'running';
  }

  updateScale(scale) {
    this.scale = scale;
    this.gravity = 0.5 * scale;
  }

  update() {
    this.animationFrame++;
    
    // Физика
    this.velocityY += this.gravity;
    this.y += this.velocityY;
    
    // Проверка земли
    const groundY = this.game ? this.game.baseHeight - 24 - this.height : 116;
    if (this.y > groundY) {
      this.y = groundY;
      this.velocityY = 0;
      this.isJumping = false;
      this.state = 'running';
    }
    
    // Анимация бега
    if (this.state === 'running') {
      this.legPosition = Math.sin(this.animationFrame * 0.2) * 3;
      this.bodyBob = Math.sin(this.animationFrame * 0.1) * 2;
    }
    
    // Анимация прыжка
    if (this.state === 'jumping') {
      this.bodyBob = Math.sin(this.animationFrame * 0.3) * 1.5;
    }
    
    // Определение состояния
    if (this.velocityY < -1) {
      this.state = 'jumping';
    } else if (this.velocityY > 1) {
      this.state = 'falling';
    }
  }

  jump() {
    const groundY = this.game ? this.game.baseHeight - 24 - this.height : 116;
    
    if (this.y >= groundY - 0.1) {
      this.velocityY = -11 * this.scale;
      this.isJumping = true;
      this.state = 'jumping';

      // Запускаем игру при первом прыжке
      if (this.game && !this.game.gameStarted) {
        this.game.gameStarted = true;
        this.game.audio.playMusic();
        document.getElementById('hint').classList.add('hidden');
      }
      
      // Воспроизводим звук через game, если он доступен
      if (this.game && this.game.audio) {
        this.game.audio.playJumpSound();
      }
      
      return true;
    }
    return false;
  }

  reset() {
    this.y = this.game ? this.game.baseHeight - 24 - this.height : 116;
    this.velocityY = 0;
    this.animationFrame = 0;
    this.state = 'running';
  }

  draw(ctx) {
    if (!ctx) return;
    
    const frame = this.animationFrame;
    const isJumping = this.isJumping;
    const legPos = this.legPosition;
    const bob = this.bodyBob;
    
    // Сохранение контекста
    ctx.save();
    ctx.translate(this.x, this.y + bob);
    
    // Тело бобра (вытянутое вправо)
    ctx.fillStyle = '#8b5a2b';
    ctx.beginPath();
    ctx.ellipse(25, 12, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Голова
    ctx.fillStyle = '#a66a3c';
    ctx.beginPath();
    ctx.ellipse(35, 4, 12, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Глаза (моргание)
    const blink = frame % 120 < 3 ? 0 : 2;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(32, 2, blink, 0, Math.PI * 2);
    ctx.arc(38, 2, blink, 0, Math.PI * 2);
    ctx.fill();
    
    // Нос
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(42, 4, 1.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Зубы (видны только при прыжке)
    if (isJumping) {
      ctx.fillStyle = '#fff';
      ctx.fillRect(40, 6, 2, 3);
      ctx.fillRect(43, 6, 2, 3);
    }
    
    // Хвост (движется при беге)
    const tailBob = Math.sin(frame * 0.15) * 2;
    ctx.fillStyle = '#7a4a23';
    ctx.save();
    ctx.translate(0, tailBob);
    ctx.beginPath();
    ctx.ellipse(8, 14, 8, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    // Ноги для бега (движутся)
    ctx.fillStyle = '#6b4a1b';
    
    // Передняя нога
    ctx.save();
    ctx.translate(0, legPos);
    ctx.fillRect(15, 18, 4, 8);
    ctx.restore();
    
    // Задняя нога
    ctx.save();
    ctx.translate(0, -legPos);
    ctx.fillRect(25, 18, 4, 8);
    ctx.restore();
    
    // Уши (шевелятся)
    const earBob = Math.sin(frame * 0.1) * 1;
    ctx.fillStyle = '#a66a3c';
    ctx.save();
    ctx.translate(0, earBob);
    ctx.beginPath();
    ctx.ellipse(30, -4, 3, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(38, -4, 3, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    
    ctx.restore();
  }

  getBounds() {
    return {
      x: this.x + 5,
      y: this.y + 5,
      width: this.width - 10,
      height: this.height - 10
    };
  }
}