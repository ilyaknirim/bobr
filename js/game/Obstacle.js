export class ObstacleManager {
  constructor(game) {
    this.game = game;
    this.obstacles = [];
    this.obstacleTypes = [];
    this.spawnTimer = 0;
    this.spawnInterval = 90;
    
    this.initObstacleTypes();
  }

  initObstacleTypes() {
    // Базовые типы препятствий
    this.obstacleTypes = [
      {
        name: 'bottle',
        width: 24,
        height: 40,
        color: '#3aaed8',
        spawnChance: 1.0,
        draw: this.drawBottle.bind(this),
        getBounds: function(x, y, w, h) {
          return { x: x + 4, y: y + 10, width: w - 8, height: h - 15 };
        }
      }
    ];
  }

  addNewObstacleType(day) {
    // Добавляем новые типы препятствий в зависимости от дня
    switch(day) {
      case 2:
        // Камень
        this.obstacleTypes.push({
          name: 'rock',
          width: 35,
          height: 25,
          color: '#78909C',
          spawnChance: 0.3,
          draw: this.drawRock.bind(this),
          getBounds: function(x, y, w, h) {
            return { x: x + 5, y: y + 5, width: w - 10, height: h - 5 };
          }
        });
        break;
        
      case 3:
        // Бревно
        this.obstacleTypes.push({
          name: 'log',
          width: 60,
          height: 20,
          color: '#8D6E63',
          spawnChance: 0.2,
          draw: this.drawLog.bind(this),
          getBounds: function(x, y, w, h) {
            return { x: x + 5, y: y + 5, width: w - 10, height: h - 10 };
          }
        });
        break;
    }
  }

  increaseFrequency() {
    // Уменьшаем интервал спавна
    this.spawnInterval = Math.max(30, this.spawnInterval * 0.9);
  }

  spawn() {
    // Выбираем тип препятствия на основе шансов
    const totalChance = this.obstacleTypes.reduce((sum, type) => sum + type.spawnChance, 0);
    let random = Math.random() * totalChance;
    
    let selectedType = this.obstacleTypes[0];
    for (const type of this.obstacleTypes) {
      random -= type.spawnChance;
      if (random <= 0) {
        selectedType = type;
        break;
      }
    }
    
    const obstacle = {
      type: selectedType.name,
      x: this.game.baseWidth + 20,
      y: this.game.baseHeight - 24 - selectedType.height,
      width: selectedType.width,
      height: selectedType.height,
      data: {}
    };
    
    // Особые свойства для некоторых препятствий
    switch(selectedType.name) {
      case 'log':
        obstacle.y = this.game.baseHeight - 24 - selectedType.height + 5;
        break;
    }
    
    this.obstacles.push(obstacle);
    
    // Воспроизводим звук
    if (this.game.audio) {
      this.game.audio.playObstacleSpawnSound(selectedType.name);
    }
  }

  update(speed) {
    this.spawnTimer++;
    
    // Спавн новых препятствий
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawn();
      this.spawnTimer = 0;
    }
    
    // Обновление существующих препятствий
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obstacle = this.obstacles[i];
      
      // Движение
      obstacle.x -= speed;
      
      // Удаление вышедших за пределы
      if (obstacle.x + obstacle.width < 0) {
        this.obstacles.splice(i, 1);
      }
    }
  }

  checkCollision(beaver) {
    const beaverBounds = beaver.getBounds();
    
    for (const obstacle of this.obstacles) {
      const type = this.obstacleTypes.find(t => t.name === obstacle.type);
      if (!type) continue;
      
      const bounds = type.getBounds(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      
      // Простая проверка столкновения
      if (beaverBounds.x < bounds.x + bounds.width &&
          beaverBounds.x + beaverBounds.width > bounds.x &&
          beaverBounds.y < bounds.y + bounds.height &&
          beaverBounds.y + beaverBounds.height > bounds.y) {
        return true;
      }
    }
    
    return false;
  }

  draw(ctx) {
    this.obstacles.forEach(obstacle => {
      const type = this.obstacleTypes.find(t => t.name === obstacle.type);
      if (type && type.draw) {
        type.draw(ctx, obstacle);
      }
    });
  }

  // Методы рисования разных препятствий
  drawBottle(ctx, obstacle) {
    // Бутылка
    ctx.fillStyle = '#3aaed8';
    ctx.fillRect(obstacle.x + 8, obstacle.y + 6, 8, 28);
    
    ctx.fillStyle = '#2b8fb3';
    ctx.fillRect(obstacle.x + 10, obstacle.y, 4, 6);
    
    // Этикетка
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(obstacle.x + 9, obstacle.y + 15, 6, 8);
  }

  drawRock(ctx, obstacle) {
    // Камень
    ctx.fillStyle = '#78909C';
    ctx.beginPath();
    ctx.ellipse(
      obstacle.x + obstacle.width / 2,
      obstacle.y + obstacle.height / 2,
      obstacle.width / 2 - 3,
      obstacle.height / 2 - 3,
      0, 0, Math.PI * 2
    );
    ctx.fill();
    
    // Текстура камня
    ctx.fillStyle = '#607D8B';
    ctx.beginPath();
    ctx.arc(obstacle.x + obstacle.width * 0.3, obstacle.y + obstacle.height * 0.4, 3, 0, Math.PI * 2);
    ctx.arc(obstacle.x + obstacle.width * 0.7, obstacle.y + obstacle.height * 0.6, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  drawLog(ctx, obstacle) {
    // Бревно
    ctx.fillStyle = '#8D6E63';
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    
    // Кора
    ctx.fillStyle = '#6D4C41';
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, 3);
    ctx.fillRect(obstacle.x, obstacle.y + obstacle.height - 3, obstacle.width, 3);
  }

  reset() {
    this.obstacles = [];
    this.spawnTimer = 0;
    this.spawnInterval = 90;
    this.obstacleTypes = [this.obstacleTypes[0]]; // Оставляем только бутылки
  }
}