import { MathUtils } from '../utils/MathUtils.js';

export class Effects {
  constructor(ctx) {
    this.ctx = ctx;
    this.particles = [];
    this.transitions = [];
    this.textEffects = [];
  }

  // Частицы
  createParticles(x, y, count = 20, color = '#FFEB3B', size = 2) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      const life = Math.random() * 30 + 20;
      
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: Math.random() * size + 1,
        life,
        maxLife: life
      });
    }
  }

  createExplosion(x, y, power = 30) {
    // Взрыв с разными цветами
    const colors = ['#FFEB3B', '#FF9800', '#FF5722', '#F44336'];
    
    for (let i = 0; i < power; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      this.createParticles(x, y, 5, color, 3);
    }
    
    // Ударная волна
    this.transitions.push({
      type: 'shockwave',
      x,
      y,
      radius: 0,
      maxRadius: 50,
      life: 30
    });
  }

  createJumpEffect(x, y) {
    // Эффект при прыжке
    this.createParticles(x + 25, y + 40, 10, '#8b5a2b', 1.5);
    
    // Пыль от толчка
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: x + Math.random() * 40,
        y: y + 40,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * -0.5 - 0.5,
        color: '#A1887F',
        size: Math.random() * 2 + 1,
        life: 20,
        maxLife: 20
      });
    }
  }

  // Переходы
  showDayTransition(dayNumber) {
    this.textEffects.push({
      text: `День ${dayNumber}`,
      x: 180, // Центр экрана
      y: 90,
      size: 32,
      color: '#FFFFFF',
      alpha: 0,
      life: 60,
      maxLife: 60,
      type: 'fade'
    });
  }

  // Обновление эффектов
  update() {
    // Обновление частиц
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1; // Гравитация
      p.life--;
      
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
    
    // Обновление переходов
    for (let i = this.transitions.length - 1; i >= 0; i--) {
      const t = this.transitions[i];
      
      switch(t.type) {
        case 'shockwave':
          t.radius += 2;
          t.life--;
          
          if (t.life <= 0) {
            this.transitions.splice(i, 1);
          }
          break;
      }
    }
    
    // Обновление текстовых эффектов
    for (let i = this.textEffects.length - 1; i >= 0; i--) {
      const te = this.textEffects[i];
      
      te.life--;
      
      if (te.type === 'fade') {
        if (te.life > te.maxLife * 0.7) {
          // Появление
          te.alpha = 1 - (te.life - te.maxLife * 0.7) / (te.maxLife * 0.3);
        } else if (te.life < te.maxLife * 0.3) {
          // Исчезновение
          te.alpha = te.life / (te.maxLife * 0.3);
        } else {
          // Полная видимость
          te.alpha = 1;
        }
      }
      
      if (te.life <= 0) {
        this.textEffects.splice(i, 1);
      }
    }
  }

  // Отрисовка эффектов
  draw() {
    // Сохраняем состояние контекста
    this.ctx.save();
    
    // Рисуем частицы
    this.particles.forEach(p => {
      const alpha = p.life / p.maxLife;
      
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = alpha * 0.7;
      
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
    
    // Рисуем переходы
    this.transitions.forEach(t => {
      switch(t.type) {
        case 'shockwave':
          const alpha = t.life / 30;
          this.ctx.strokeStyle = `rgba(255, 235, 59, ${alpha})`;
          this.ctx.lineWidth = 2;
          this.ctx.beginPath();
          this.ctx.arc(t.x, t.y, t.radius, 0, Math.PI * 2);
          this.ctx.stroke();
          break;
      }
    });
    
    // Рисуем текстовые эффекты
    this.textEffects.forEach(te => {
      this.ctx.save();
      
      this.ctx.fillStyle = te.color;
      this.ctx.globalAlpha = te.alpha;
      this.ctx.font = `bold ${te.size}px sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      
      // Тень текста
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      this.ctx.shadowBlur = 10;
      this.ctx.shadowOffsetX = 2;
      this.ctx.shadowOffsetY = 2;
      
      this.ctx.fillText(te.text, te.x, te.y);
      
      this.ctx.restore();
    });
    
    // Восстанавливаем состояние контекста
    this.ctx.restore();
  }

  // Очистка всех эффектов
  clear() {
    this.particles = [];
    this.transitions = [];
    this.textEffects = [];
  }

  // Дополнительные эффекты
  createRain(count = 30) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * 360,
        y: Math.random() * 180,
        vx: Math.random() * 1 - 0.5,
        vy: Math.random() * 2 + 1,
        color: '#2196F3',
        size: Math.random() * 1 + 0.5,
        life: 100,
        maxLife: 100
      });
    }
  }

  createSnow(count = 50) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * 360,
        y: Math.random() * 180,
        vx: Math.random() * 0.5 - 0.25,
        vy: Math.random() * 0.5 + 0.2,
        color: '#FFFFFF',
        size: Math.random() * 2 + 1,
        life: 200,
        maxLife: 200,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: Math.random() * 0.1 - 0.05
      });
    }
  }

  updateWeatherEffects(weather) {
    // Обновление погодных эффектов
    this.particles = this.particles.filter(p => {
      if (p.color === '#2196F3' || p.color === '#FFFFFF') {
        // Погодные частицы
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.rotationSpeed) {
          p.rotation += p.rotationSpeed;
        }
        
        if (p.y > 180) {
          p.y = 0;
          p.x = Math.random() * 360;
        }
        
        return true;
      }
      return true;
    });
  }
}