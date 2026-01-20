export class AudioManager {
  constructor() {
    this.audioContext = null;
    this.musicGain = null;
    this.soundGain = null;
    this.musicPlaying = false;
    this.isMuted = false;

    // Свойства для разнообразной музыки
    this.currentBeat = 0;
    this.currentPattern = 0;
    
    this.init();
  }

  init() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Узлы для управления громкостью
      this.musicGain = this.audioContext.createGain();
      this.soundGain = this.audioContext.createGain();
      
      this.musicGain.gain.value = 0.15;
      this.soundGain.gain.value = 0.3;
      
      this.musicGain.connect(this.audioContext.destination);
      this.soundGain.connect(this.audioContext.destination);
      
    } catch (error) {
      console.warn('Аудио не поддерживается:', error);
    }
  }

  playJumpSound() {
    if (!this.audioContext || this.isMuted) return;

    // Гарантированный запуск AudioContext
    this.ensureAudioContextRunning();
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.soundGain);
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  playCollisionSound() {
    if (!this.audioContext || this.isMuted) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.soundGain);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  playObstacleSpawnSound(type) {
    if (!this.audioContext || this.isMuted) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.soundGain);
    
    oscillator.type = 'sine';
    
    // Разные звуки для разных препятствий
    let frequency = 800;
    switch(type) {
      case 'rock':
        frequency = 300;
        break;
      case 'dynamite':
        frequency = 500;
        break;
    }
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.7, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  playNewDaySound() {
    if (!this.audioContext || this.isMuted) return;
    
    // Приятный звук при смене дня
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.soundGain);
        
        oscillator.type = 'sine';
        oscillator.frequency.value = 523.25 * (1 + i * 0.2); // Нота C
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
      }, i * 100);
    }
  }

  playMusic() {
    if (!this.audioContext || this.musicPlaying) return;
    
    this.musicPlaying = true;
    // Простая музыкальная петля
    this.musicInterval = setInterval(() => {
      if (!this.musicPlaying) {
        clearInterval(this.musicInterval);
        return;
      }
      
      // Проигрываем простой бит
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.musicGain);
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = 100 + Math.random() * 100;
      
      gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.2);
    }, 250);
  }

  updateTempo(tempoMultiplier) {
    // Обновляем темп музыки
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }

    // Запускаем музыку с новым темпом
    if (this.musicPlaying) {
      this.musicInterval = setInterval(() => {
        if (!this.musicPlaying) {
          clearInterval(this.musicInterval);
          return;
        }

        // Проигрываем простой бит с учетом темпа
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.musicGain);

        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 100 + Math.random() * 100;

        gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
      }, 250 / tempoMultiplier); // Изменяем интервал в зависимости от темпа
    }
  }

  stopMusic() {
    this.musicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  playFinalMusic() {
    if (!this.audioContext) return;

    // Останавливаем текущую музыку
    this.stopMusic();

    // Торжественная мелодия для финала
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25]; // Ноты от C4 до C5
    const melody = [0, 2, 4, 5, 4, 2, 0, 7, 5, 4, 2, 0]; // Простая мелодия
    const duration = 0.4; // Длительность каждой ноты

    // Воспроизводим мелодию
    melody.forEach((noteIndex, i) => {
      setTimeout(() => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.musicGain);

        oscillator.type = 'sine';
        oscillator.frequency.value = notes[noteIndex];

        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration * 0.8);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
      }, i * duration * 1000);
    });

    // Добавляем басовую линию
    setTimeout(() => {
      const bassNotes = [130.81, 146.83, 164.81, 174.61]; // Ноты на октаву ниже
      const bassLine = [0, 2, 1, 3, 0, 2, 1, 0];
      
      bassLine.forEach((noteIndex, i) => {
        setTimeout(() => {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(this.musicGain);

          oscillator.type = 'triangle';
          oscillator.frequency.value = bassNotes[noteIndex];

          gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration * 2);

          oscillator.start();
          oscillator.stop(this.audioContext.currentTime + duration * 2);
        }, i * duration * 1000);
      });
    }, duration * 500);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.audioContext) {
      const volume = this.isMuted ? 0 : 1;
      this.musicGain.gain.value = volume * 0.15;
      this.soundGain.gain.value = volume * 0.3;
    }
    
    return this.isMuted;
  }

  resumeAudio() {
    if (this.audioContext) {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      return true;
    }
    return false;
  }

  // Гарантированный запуск AudioContext перед воспроизведением звука
  ensureAudioContextRunning() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      // Создаем и немедленно останавливаем осциллятор для активации контекста
      const oscillator = this.audioContext.createOscillator();
      oscillator.connect(this.audioContext.destination);
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.001);
    }
  }
}