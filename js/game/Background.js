export class BackgroundSystem {
  constructor(game) {
    this.game = game;
    this.width = game.baseWidth;
    this.height = game.baseHeight;

    // Цикл дня: 0-1 (0 = полночь, 0.5 = полдень)
    this.dayCycle = 0;
    this.currentPhase = "night"; // night, dawn, day, dusk

    // Элементы фона
    this.trees = [];
    this.clouds = [];
    this.stars = [];
    this.meteors = [];
    this.weatherEffects = []; // Добавляем инициализацию массива погодных эффектов

    this.init();
  }

  init() {
    this.generateStars(100);
    this.generateClouds(8);
    this.generateTrees();
  }
  changeWeather(weatherType) {
    this.currentWeather = weatherType;

    // Сброс эффектов погоды
    this.weatherEffects = [];

    switch (weatherType) {
      case "rain":
        // Создаем капли дождя
        for (let i = 0; i < 50; i++) {
          this.weatherEffects.push({
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            speed: Math.random() * 3 + 2,
            length: Math.random() * 10 + 5,
            type: "rain",
          });
        }
        break;

      case "snow":
        // Создаем снежинки
        for (let i = 0; i < 100; i++) {
          this.weatherEffects.push({
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            speed: Math.random() * 0.5 + 0.2,
            size: Math.random() * 2 + 1,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: Math.random() * 0.1 - 0.05,
            type: "snow",
          });
        }
        break;
    }
  }
  generateStars(count) {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height * 0.7,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.05 + 0.01,
      });
    }
  }

  generateClouds(count) {
    this.clouds = [];
    for (let i = 0; i < count; i++) {
      this.clouds.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height * 0.4,
        width: Math.random() * 60 + 40,
        height: Math.random() * 30 + 20,
        speed: Math.random() * 0.2 + 0.1,
        opacity: Math.random() * 0.6 + 0.2,
      });
    }
  }

  generateTrees() {
    this.trees = [];
    const layers = [
      {
        count: 15,
        height: [30, 50],
        opacity: 0.3,
        speed: 0.2,
        color: "#2d5a27",
      },
      {
        count: 10,
        height: [50, 80],
        opacity: 0.5,
        speed: 0.5,
        color: "#3a7a32",
      },
      {
        count: 8,
        height: [80, 120],
        opacity: 0.7,
        speed: 0.8,
        color: "#4a9a3a",
      },
    ];

    layers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        this.trees.push({
          x: Math.random() * this.width * 2,
          y: this.height - 24,
          height: this.randomBetween(...layer.height),
          layer: layer,
          speed: layer.speed,
        });
      }
    });
  }

  randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  update(dayProgress) {
    this.dayCycle = dayProgress;

    // Определение фазы дня
    if (dayProgress < 0.25) this.currentPhase = "night";
    else if (dayProgress < 0.35) this.currentPhase = "dawn";
    else if (dayProgress < 0.65) this.currentPhase = "day";
    else if (dayProgress < 0.75) this.currentPhase = "dusk";
    else this.currentPhase = "night";

    // Обновление облаков
    this.clouds.forEach((cloud) => {
      cloud.x -= cloud.speed;
      if (cloud.x + cloud.width < 0) {
        cloud.x = this.width;
        cloud.y = Math.random() * this.height * 0.4;
      }
    });

    // Обновление деревьев
    this.trees.forEach((tree) => {
      tree.x -= tree.speed;
      if (tree.x < -100) {
        tree.x = this.width + Math.random() * 100;
      }
    });

    // Обновление звезд (мерцание)
    this.stars.forEach((star) => {
      star.brightness = 0.5 + Math.sin(Date.now() * star.twinkleSpeed) * 0.5;
    });

    // Обновление метеоритов (только с 3 дня)
    if (this.game.currentDay >= 3) {
      this.updateMeteors();
    }
    // Обновление погодных эффектов
    this.weatherEffects.forEach((effect) => {
      if (effect.type === "rain") {
        effect.y += effect.speed;
        if (effect.y > this.height) {
          effect.y = -10;
          effect.x = Math.random() * this.width;
        }
      } else if (effect.type === "snow") {
        effect.y += effect.speed;
        effect.x += Math.sin(effect.y * 0.01) * 0.3;
        effect.rotation += effect.rotationSpeed;

        if (effect.y > this.height) {
          effect.y = -10;
          effect.x = Math.random() * this.width;
        }
      }
    });
  }

  updateMeteors() {
    // Удаляем старые метеориты
    this.meteors = this.meteors.filter(
      (meteor) => meteor.life > 0 && meteor.y < this.height,
    );

    // Случайные метеориты
    if (Math.random() < 0.01 && this.meteors.length < 3) {
      this.meteors.push({
        x: this.width + 20,
        y: Math.random() * this.height * 0.3,
        speedX: -(Math.random() * 3 + 2),
        speedY: Math.random() * 2 + 1,
        length: Math.random() * 20 + 10,
        life: 100,
      });
    }

    // Обновление метеоритов
    this.meteors.forEach((meteor) => {
      meteor.x += meteor.speedX;
      meteor.y += meteor.speedY;
      meteor.life--;
    });
  }

  draw(ctx) {
    // Небо в зависимости от времени суток
    this.drawSky(ctx);

    // Солнце/Луна
    this.drawSunMoon(ctx);

    // Облака
    this.drawClouds(ctx);

    // Звезды (ночью и на рассвете/закате)
    this.drawStars(ctx);

    // Деревья
    this.drawTrees(ctx);

    // Земля
    this.drawGround(ctx);

    // Метеориты (ночью, начиная с 3 дня)
    if (this.game.currentDay >= 3 && this.currentPhase === "night") {
      this.drawMeteors(ctx);
    }

    // Погодные эффекты
    this.drawWeatherEffects(ctx);
  }

  drawSky(ctx) {
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);

    switch (this.currentPhase) {
      case "night":
        gradient.addColorStop(0, "#001122");
        gradient.addColorStop(1, "#000811");
        break;
      case "dawn":
        gradient.addColorStop(0, "#ff6b6b");
        gradient.addColorStop(0.5, "#ffa726");
        gradient.addColorStop(1, "#5c6bc0");
        break;
      case "day":
        gradient.addColorStop(0, "#87CEEB");
        gradient.addColorStop(1, "#E0F7FA");
        break;
      case "dusk":
        gradient.addColorStop(0, "#5c6bc0");
        gradient.addColorStop(0.5, "#ffa726");
        gradient.addColorStop(1, "#001122");
        break;
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);
  }

  drawSunMoon(ctx) {
    const angle = this.dayCycle * Math.PI * 2;
    const radius = Math.min(this.width, this.height) * 0.4;
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius * 0.3;

    if (
      this.currentPhase === "day" ||
      this.currentPhase === "dawn" ||
      this.currentPhase === "dusk"
    ) {
      // Солнце
      const sunColor =
        this.currentPhase === "day"
          ? "#FFEB3B"
          : this.currentPhase === "dawn"
            ? "#FF9800"
            : "#FF5722";
      ctx.fillStyle = sunColor;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();

      // Лучи солнца (только днем)
      if (this.currentPhase === "day") {
        ctx.strokeStyle = "rgba(255, 235, 59, 0.3)";
        ctx.lineWidth = 2;
        for (let i = 0; i < 12; i++) {
          const rayAngle = (i / 12) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + Math.cos(rayAngle) * 40, y + Math.sin(rayAngle) * 40);
          ctx.stroke();
        }
      }
    } else {
      // Луна
      ctx.fillStyle = "#E0E0E0";
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();

      // Кратеры на луне
      ctx.fillStyle = "#BDBDBD";
      ctx.beginPath();
      ctx.arc(x - 5, y - 3, 3, 0, Math.PI * 2);
      ctx.arc(x + 6, y + 4, 2, 0, Math.PI * 2);
      ctx.arc(x + 2, y - 6, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawStars(ctx) {
    if (this.currentPhase === "night") {
      this.stars.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * 0.8})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });
    } else if (this.currentPhase === "dawn" || this.currentPhase === "dusk") {
      // Некоторые звезды видны на рассвете/закате
      this.stars.forEach((star) => {
        const opacity = star.brightness * 0.3;
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  drawClouds(ctx) {
    this.clouds.forEach((cloud) => {
      let opacity = cloud.opacity;

      // Облака темнее ночью и на закате
      if (this.currentPhase === "night") {
        opacity *= 0.3;
      } else if (this.currentPhase === "dusk") {
        opacity *= 0.6;
      }

      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      this.drawCloudShape(ctx, cloud.x, cloud.y, cloud.width, cloud.height);
    });
  }

  drawCloudShape(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.arc(x + width * 0.2, y + height * 0.5, height * 0.4, 0, Math.PI * 2);
    ctx.arc(x + width * 0.5, y + height * 0.3, height * 0.5, 0, Math.PI * 2);
    ctx.arc(x + width * 0.8, y + height * 0.5, height * 0.4, 0, Math.PI * 2);
    ctx.arc(x + width * 0.5, y + height * 0.7, height * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  drawTrees(ctx) {
    this.trees.forEach((tree) => {
      const { layer } = tree;
      let color = layer.color;
      let opacity = layer.opacity;

      // Деревья темнее ночью и на закате
      if (this.currentPhase === "night") {
        color = "#1a3a1a";
        opacity *= 0.5;
      } else if (this.currentPhase === "dusk" || this.currentPhase === "dawn") {
        opacity *= 0.7;
      }

      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;

      // Рисуем елку
      const baseY = tree.y - tree.height;

      // Нижний ярус
      ctx.beginPath();
      ctx.moveTo(tree.x, baseY + tree.height);
      ctx.lineTo(tree.x - tree.height * 0.3, baseY + tree.height * 0.8);
      ctx.lineTo(tree.x + tree.height * 0.3, baseY + tree.height * 0.8);
      ctx.closePath();
      ctx.fill();

      // Средний ярус
      ctx.beginPath();
      ctx.moveTo(tree.x, baseY + tree.height * 0.6);
      ctx.lineTo(tree.x - tree.height * 0.4, baseY + tree.height * 0.4);
      ctx.lineTo(tree.x + tree.height * 0.4, baseY + tree.height * 0.4);
      ctx.closePath();
      ctx.fill();

      // Верхний ярус
      ctx.beginPath();
      ctx.moveTo(tree.x, baseY + tree.height * 0.2);
      ctx.lineTo(tree.x - tree.height * 0.35, baseY);
      ctx.lineTo(tree.x + tree.height * 0.35, baseY);
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = 1;
    });
  }

  drawGround(ctx) {
    let color;

    switch (this.currentPhase) {
      case "night":
        color = "#1a1a2e";
        break;
      case "dawn":
        color = "#8d6e63";
        break;
      case "day":
        color = "#8bc34a";
        break;
      case "dusk":
        color = "#5d4037";
        break;
    }

    // Земля
    ctx.fillStyle = color;
    ctx.fillRect(0, this.height - 24, this.width, 24);

    // Трава (только днем и на рассвете)
    if (this.currentPhase === "day" || this.currentPhase === "dawn") {
      ctx.fillStyle = this.currentPhase === "day" ? "#7cb342" : "#558b2f";
      for (let x = 0; x < this.width; x += 4) {
        const height = Math.sin(x * 0.1) * 3 + 5;
        ctx.fillRect(x, this.height - 24, 2, -height);
      }
    }
  }

  drawMeteors(ctx) {
    this.meteors.forEach((meteor) => {
      // Хвост метеорита
      const gradient = ctx.createLinearGradient(
        meteor.x,
        meteor.y,
        meteor.x - meteor.speedX * 3,
        meteor.y - meteor.speedY * 3,
      );
      gradient.addColorStop(0, "rgba(255, 255, 200, 0.8)");
      gradient.addColorStop(1, "rgba(255, 200, 100, 0)");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(meteor.x, meteor.y);
      ctx.lineTo(meteor.x - meteor.speedX * 3, meteor.y - meteor.speedY * 3);
      ctx.stroke();

      // Голова метеорита
      ctx.fillStyle = "#FFEB3B";
      ctx.beginPath();
      ctx.arc(meteor.x, meteor.y, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Погодные эффекты (добавляются с определенного дня)
  drawWeatherEffects(ctx) {
    // Дождь (с 4 дня, только днем и на рассвете/закате)
    if (
      this.game.currentDay >= 4 &&
      (this.currentPhase === "day" ||
        this.currentPhase === "dawn" ||
        this.currentPhase === "dusk")
    ) {
      this.drawRain(ctx);
    }

    // Снег (с 5 дня, только ночью)
    if (this.game.currentDay >= 5 && this.currentPhase === "night") {
      this.drawSnow(ctx);
    }
  }

  drawRain(ctx) {
    if (!this.weatherEffects || this.weatherEffects.length === 0) return;

    ctx.strokeStyle = "rgba(33, 150, 243, 0.6)";
    ctx.lineWidth = 1;

    // Рисуем капли из массива weatherEffects
    this.weatherEffects.forEach(effect => {
      if (effect.type === "rain") {
        ctx.beginPath();
        ctx.moveTo(effect.x, effect.y);
        ctx.lineTo(effect.x + 2, effect.y + effect.length);
        ctx.stroke();
      }
    });
  }

  drawSnow(ctx) {
    if (!this.weatherEffects || this.weatherEffects.length === 0) return;

    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";

    // Рисуем снежинки из массива weatherEffects
    this.weatherEffects.forEach(effect => {
      if (effect.type === "snow") {
        ctx.save();
        ctx.translate(effect.x, effect.y);
        ctx.rotate(effect.rotation);
        ctx.beginPath();
        ctx.arc(0, 0, effect.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });
  }
}
