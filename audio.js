// ===== Звуковые эффекты и музыка =====

// Создаем аудио контекст
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Глобальные переменные для музыки
let musicGainNode;
let musicOscillators = [];
let musicPlaying = false;

// Переменные для динамической музыки
let bassNotes, currentRiff, bassNoteIndex, guitarRiffs, currentGuitarRiff, guitarNoteIndex;
let kickInterval, hihatInterval, bassInterval, guitarInterval, soloInterval;

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

// Создание звука появления бутылки
function playBottleSpawnSound() {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
}

// Создание мелодии в стиле русского рока
function playRussianRock() {
  if (musicPlaying) return;

  musicPlaying = true;
  
  // Инициализируем переменные
  bassNotes = [
    [82.41, 82.41, 110, 82.41, 73.42, 82.41, 110, 82.41], // Рифф 1: E, E, A, E, D, E, A, E
    [98, 98, 110, 98, 87.31, 98, 110, 98], // Рифф 2: G, G, A, G, F, G, A, G
    [82.41, 73.42, 65.41, 73.42, 82.41, 73.42, 65.41, 73.42] // Рифф 3: E, D, C, D, E, D, C, D
  ];
  currentRiff = 0;
  bassNoteIndex = 0;
  
  guitarRiffs = [
    [164.81, 146.83, 130.81, 146.83, 164.81, 0, 146.83, 130.81], // Рифф 1: E, D, C, D, E, пауза, D, C
    [196, 174.61, 146.83, 174.61, 196, 0, 174.61, 146.83], // Рифф 2: G, F, D, F, G, пауза, F, D
    [164.81, 130.81, 110, 130.81, 164.81, 0, 130.81, 110] // Рифф 3: E, C, A, C, E, пауза, C, A
  ];
  currentGuitarRiff = 0;
  guitarNoteIndex = 0;

  // Основной ритм (барабаны)
  let kickInterval = setInterval(() => {
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
  let hihatInterval = setInterval(() => {
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

  let bassInterval = setInterval(() => {
    if (!musicPlaying) {
      clearInterval(bassInterval);
      return;
    }

    const bass = audioContext.createOscillator();
    const bassGain = audioContext.createGain();

    bass.connect(bassGain);
    bassGain.connect(audioContext.destination);

    bass.type = 'sawtooth';
    bass.frequency.value = bassNotes[currentRiff][bassNoteIndex];

    bassGain.gain.setValueAtTime(0.3, audioContext.currentTime);
    bassGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    bass.start(audioContext.currentTime);
    bass.stop(audioContext.currentTime + 0.2);

    bassNoteIndex = (bassNoteIndex + 1) % bassNotes[currentRiff].length;
    
    // Переключаем рифф каждые 4 повторения
    if (bassNoteIndex === 0) {
      currentRiff = (currentRiff + 1) % bassNotes.length;
    }
  }, 500);

  // Гитарный рифф

  let guitarInterval = setInterval(() => {
    if (!musicPlaying) {
      clearInterval(guitarInterval);
      return;
    }

    if (guitarRiffs[currentGuitarRiff][guitarNoteIndex] === 0) {
      guitarNoteIndex = (guitarNoteIndex + 1) % guitarRiffs[currentGuitarRiff].length;
      return;
    }

    const guitar = audioContext.createOscillator();
    const guitarGain = audioContext.createGain();
    const guitarFilter = audioContext.createBiquadFilter();

    guitar.connect(guitarFilter);
    guitarFilter.connect(guitarGain);
    guitarGain.connect(audioContext.destination);

    guitar.type = 'sawtooth';
    guitar.frequency.value = guitarRiffs[currentGuitarRiff][guitarNoteIndex];

    guitarFilter.type = 'lowpass';
    guitarFilter.frequency.value = 2000;
    guitarFilter.Q.value = 5;
    
    // Добавляем эффект дисторшна
    const distortion = audioContext.createWaveShaper();
    distortion.curve = makeDistortionCurve(50);
    distortion.oversample = '4x';
    guitarFilter.connect(distortion);
    distortion.connect(guitarGain);

    guitarGain.gain.setValueAtTime(0.2, audioContext.currentTime);
    guitarGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    guitar.start(audioContext.currentTime);
    guitar.stop(audioContext.currentTime + 0.3);

    guitarNoteIndex = (guitarNoteIndex + 1) % guitarRiffs[currentGuitarRiff].length;
    
    // Переключаем рифф каждые 4 повторения
    if (guitarNoteIndex === 0) {
      currentGuitarRiff = (currentGuitarRiff + 1) % guitarRiffs.length;
    }
  }, 250);
  
  // Соло-гитара (проигрывается время от времени)
  let soloInterval = setInterval(() => {
    if (!musicPlaying) {
      clearInterval(soloInterval);
      return;
    }
    
    // Соло проигрывается с вероятностью 20%
    if (Math.random() < 0.2) {
      playGuitarSolo();
    }
  }, 8000);
  
  // Функция для обновления интервалов в зависимости от темпа
  function updateIntervals() {
    clearInterval(kickInterval);
    clearInterval(hihatInterval);
    clearInterval(bassInterval);
    clearInterval(guitarInterval);
    clearInterval(soloInterval);
    
    // Обновляем интервалы с учетом текущего темпа
    kickInterval = setInterval(() => {
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
    }, 250 / currentTempo);

    hihatInterval = setInterval(() => {
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
    }, 125 / currentTempo);

    bassInterval = setInterval(() => {
      if (!musicPlaying) {
        clearInterval(bassInterval);
        return;
      }

      const bass = audioContext.createOscillator();
      const bassGain = audioContext.createGain();

      bass.connect(bassGain);
      bassGain.connect(audioContext.destination);

      bass.type = 'sawtooth';
      bass.frequency.value = bassNotes[currentRiff][bassNoteIndex];

      bassGain.gain.setValueAtTime(0.3, audioContext.currentTime);
      bassGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      bass.start(audioContext.currentTime);
      bass.stop(audioContext.currentTime + 0.2);

      bassNoteIndex = (bassNoteIndex + 1) % bassNotes[currentRiff].length;
      
      // Переключаем рифф каждые 4 повторения
      if (bassNoteIndex === 0) {
        currentRiff = (currentRiff + 1) % bassNotes.length;
      }
    }, 500 / currentTempo);

    guitarInterval = setInterval(() => {
      if (!musicPlaying) {
        clearInterval(guitarInterval);
        return;
      }

      if (guitarRiffs[currentGuitarRiff][guitarNoteIndex] === 0) {
        guitarNoteIndex = (guitarNoteIndex + 1) % guitarRiffs[currentGuitarRiff].length;
        return;
      }

      const guitar = audioContext.createOscillator();
      const guitarGain = audioContext.createGain();
      const guitarFilter = audioContext.createBiquadFilter();

      guitar.connect(guitarFilter);
      guitarFilter.connect(guitarGain);
      guitarGain.connect(audioContext.destination);

      guitar.type = 'sawtooth';
      guitar.frequency.value = guitarRiffs[currentGuitarRiff][guitarNoteIndex];

      guitarFilter.type = 'lowpass';
      guitarFilter.frequency.value = 2000;
      guitarFilter.Q.value = 5;
      
      // Добавляем эффект дисторшна
      const distortion = audioContext.createWaveShaper();
      distortion.curve = makeDistortionCurve(50);
      distortion.oversample = '4x';
      guitarFilter.connect(distortion);
      distortion.connect(guitarGain);

      guitarGain.gain.setValueAtTime(0.2, audioContext.currentTime);
      guitarGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      guitar.start(audioContext.currentTime);
      guitar.stop(audioContext.currentTime + 0.3);

      guitarNoteIndex = (guitarNoteIndex + 1) % guitarRiffs[currentGuitarRiff].length;
      
      // Переключаем рифф каждые 4 повторения
      if (guitarNoteIndex === 0) {
        currentGuitarRiff = (currentGuitarRiff + 1) % guitarRiffs.length;
      }
    }, 250 / currentTempo);
    
    soloInterval = setInterval(() => {
      if (!musicPlaying) {
        clearInterval(soloInterval);
        return;
      }
      
      // Соло проигрывается с вероятностью 20%
      if (Math.random() < 0.2) {
        playGuitarSolo();
      }
    }, 8000 / currentTempo);
  }
  
  // Экспортируем функцию обновления интервалов
  window.updateMusicIntervals = updateIntervals;
}

// Функция для создания кривой дисторшна
function makeDistortionCurve(amount) {
  const samples = 44100;
  const curve = new Float32Array(samples);
  const deg = Math.PI / 180;
  
  for (let i = 0; i < samples; i++) {
    const x = (i * 2) / samples - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }
  
  return curve;
}

// Функция для проигрывания гитарного соло
function playGuitarSolo() {
  if (!musicPlaying) return;
  
  // Ноты для соло (блюзовая пентатоника)
  const soloNotes = [
    196, 220, 246.94, 261.63, 293.66, 329.63, 349.23, 392,
    440, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99
  ];
  
  // Проигрываем случайную последовательность нот
  let noteCount = 0;
  const soloNoteInterval = setInterval(() => {
    if (!musicPlaying || noteCount >= 16) {
      clearInterval(soloNoteInterval);
      return;
    }
    
    const solo = audioContext.createOscillator();
    const soloGain = audioContext.createGain();
    const soloFilter = audioContext.createBiquadFilter();
    const distortion = audioContext.createWaveShaper();
    
    solo.connect(soloFilter);
    soloFilter.connect(distortion);
    distortion.connect(soloGain);
    soloGain.connect(audioContext.destination);
    
    // Случайная нота из соло-нот
    const randomNoteIndex = Math.floor(Math.random() * soloNotes.length);
    solo.frequency.value = soloNotes[randomNoteIndex];
    
    solo.type = 'sawtooth';
    
    soloFilter.type = 'lowpass';
    soloFilter.frequency.value = 3000;
    soloFilter.Q.value = 8;
    
    distortion.curve = makeDistortionCurve(80);
    distortion.oversample = '4x';
    
    soloGain.gain.setValueAtTime(0.3, audioContext.currentTime);
    soloGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    solo.start(audioContext.currentTime);
    solo.stop(audioContext.currentTime + 0.2);
    
    noteCount++;
  }, 100);
}

// Остановка музыки
function stopMusic() {
  musicPlaying = false;
}

// Увеличение темпа музыки при увеличении скорости игры
let currentTempo = 1.0; // Базовый темп

function updateMusicTempo(speed) {
  // Увеличиваем темп в зависимости от скорости игры
  // Базовая скорость - 3, максимальная - примерно 10
  const tempoMultiplier = 0.5 + (speed / 3) * 0.5; // От 0.5x до 2x
  currentTempo = tempoMultiplier;
}

// Делаем функции доступными глобально
window.initMusic = initMusic;
window.playJumpSound = playJumpSound;
window.playCollisionSound = playCollisionSound;
window.playBottleSpawnSound = playBottleSpawnSound;
window.playRussianRock = playRussianRock;
window.stopMusic = stopMusic;
window.updateMusicTempo = updateMusicTempo;
