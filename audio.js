// ===== Звуковые эффекты и музыка =====

// Создаем аудио контекст
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Глобальные переменные для музыки
let musicGainNode;
let musicOscillators = [];
let musicPlaying = false;

// Инициализация музыки
function initMusic() {
  // Создаем узел для управления громкостью
  musicGainNode = audioContext.createGain();
  musicGainNode.gain.value = 0.2; // Устанавливаем начальную громкость
  musicGainNode.connect(audioContext.destination);
}

// Создание звука прыжка
function playJumpSound() {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

// Создание звука столкновения с бутылкой
function playCollisionSound() {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);

  gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
}

// Создание мелодии в стиле русского рока
function playRussianRock() {
  if (musicPlaying) return;

  musicPlaying = true;

  // Основной ритм (барабаны)
  const kickInterval = setInterval(() => {
    if (!musicPlaying) {
      clearInterval(kickInterval);
      return;
    }

    const kick = audioContext.createOscillator();
    const kickGain = audioContext.createGain();

    kick.connect(kickGain);
    kickGain.connect(audioContext.destination);

    kick.frequency.setValueAtTime(60, audioContext.currentTime);
    kick.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    kickGain.gain.setValueAtTime(0.5, audioContext.currentTime);
    kickGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    kick.start(audioContext.currentTime);
    kick.stop(audioContext.currentTime + 0.1);
  }, 250);

  // Хэт (hi-hat)
  const hihatInterval = setInterval(() => {
    if (!musicPlaying) {
      clearInterval(hihatInterval);
      return;
    }

    const hihat = audioContext.createOscillator();
    const hihatGain = audioContext.createGain();
    const hihatFilter = audioContext.createBiquadFilter();

    hihat.connect(hihatFilter);
    hihatFilter.connect(hihatGain);
    hihatGain.connect(audioContext.destination);

    hihatFilter.type = 'highpass';
    hihatFilter.frequency.value = 8000;

    hihat.type = 'square';
    hihat.frequency.value = 8000;

    hihatGain.gain.setValueAtTime(0.1, audioContext.currentTime);
    hihatGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.03);

    hihat.start(audioContext.currentTime);
    hihat.stop(audioContext.currentTime + 0.03);
  }, 125);

  // Басовая линия
  const bassNotes = [82.41, 82.41, 110, 82.41, 73.42, 82.41, 110, 82.41]; // Ноты E, E, A, E, D, E, A, E
  let bassNoteIndex = 0;

  const bassInterval = setInterval(() => {
    if (!musicPlaying) {
      clearInterval(bassInterval);
      return;
    }

    const bass = audioContext.createOscillator();
    const bassGain = audioContext.createGain();

    bass.connect(bassGain);
    bassGain.connect(audioContext.destination);

    bass.type = 'sawtooth';
    bass.frequency.value = bassNotes[bassNoteIndex];

    bassGain.gain.setValueAtTime(0.3, audioContext.currentTime);
    bassGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    bass.start(audioContext.currentTime);
    bass.stop(audioContext.currentTime + 0.2);

    bassNoteIndex = (bassNoteIndex + 1) % bassNotes.length;
  }, 500);

  // Гитарный рифф
  const guitarNotes = [164.81, 146.83, 130.81, 146.83, 164.81, 0, 146.83, 130.81]; // Ноты E, D, C, D, E, пауза, D, C
  let guitarNoteIndex = 0;

  const guitarInterval = setInterval(() => {
    if (!musicPlaying) {
      clearInterval(guitarInterval);
      return;
    }

    if (guitarNotes[guitarNoteIndex] === 0) {
      guitarNoteIndex = (guitarNoteIndex + 1) % guitarNotes.length;
      return;
    }

    const guitar = audioContext.createOscillator();
    const guitarGain = audioContext.createGain();
    const guitarFilter = audioContext.createBiquadFilter();

    guitar.connect(guitarFilter);
    guitarFilter.connect(guitarGain);
    guitarGain.connect(audioContext.destination);

    guitar.type = 'sawtooth';
    guitar.frequency.value = guitarNotes[guitarNoteIndex];

    guitarFilter.type = 'lowpass';
    guitarFilter.frequency.value = 2000;
    guitarFilter.Q.value = 5;

    guitarGain.gain.setValueAtTime(0.2, audioContext.currentTime);
    guitarGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    guitar.start(audioContext.currentTime);
    guitar.stop(audioContext.currentTime + 0.3);

    guitarNoteIndex = (guitarNoteIndex + 1) % guitarNotes.length;
  }, 250);
}

// Остановка музыки
function stopMusic() {
  musicPlaying = false;
}

// Увеличение темпа музыки при увеличении скорости игры
function updateMusicTempo(speed) {
  // Эта функция может быть использована для ускорения музыки при увеличении скорости игры
  // В данном простом примере мы не реализуем изменение темпа, но в реальной игре это можно сделать
}

export { initMusic, playJumpSound, playCollisionSound, playRussianRock, stopMusic, updateMusicTempo };
