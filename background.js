// ===== Фон с заснеженным еловым лесом =====
export function drawBackground(ctx, W, H, frame) {
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