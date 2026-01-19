export class MusicSystem {
  constructor(audioManager) {
    this.audioManager = audioManager;
    this.audioContext = audioManager.audioContext;
    this.isPlaying = false;
    this.tempo = 1.0;
    
    // Музыкальные параметры
    this.bassNotes = [];
    this.guitarRiffs = [];
    this.currentRiff = 0;
    this.currentGuitarRiff = 0;
    
    // Интервалы
    this.intervals = {};
    
    this.init();
  }

  init() {
    this.initMelody();
  }

  initMelody() {
    // Басовая линия (упрощенная)
    this.bassNotes = [
      [82.41, 82.41, 110, 82.41, 73.42, 82.41, 110, 82.41], // Рифф 1
      [98, 98, 110, 98, 87.31, 98, 110, 98], // Рифф 2
      [82.41, 73.42, 65.41, 73.42, 82.41, 73.42, 65.41, 73.42] // Рифф 3
    ];
    
    // Гитарные риффы
    this.guitarRiffs = [
      [164.81, 146.83, 130.81, 146.83, 164.81, 0, 146.83, 130.81],
      [196, 174.61, 146.83, 174.61, 196, 0, 174.61, 146.83],
      [164.81, 130.81, 110, 130.81, 164.81, 0, 130.81, 110]
    ];
  }

  play() {
    if (this.isPlaying || !this.audioContext) return;
    
    this.isPlaying = true;
    this.bassNoteIndex = 0;
    this.guitarNoteIndex = 0;
    
    // Барабаны
    this.startDrums();
    
    // Бас
    this.startBass();
    
    // Гитара
    this.startGuitar();
    
    // Соло (случайное)
    this.startSolo();
  }

  startDrums() {
    // Kick drum
    this.intervals.kick = setInterval(() => {
      if (!this.isPlaying) return;
      this.playKick();
    }, 500 / this.tempo);

    // Hi-hat
    this.intervals.hihat = setInterval(() => {
      if (!this.isPlaying) return;
      this.playHiHat();
    }, 250 / this.tempo);
  }

  startBass() {
    this.intervals.bass = setInterval(() => {
      if (!this.isPlaying) return;
      
      const note = this.bassNotes[this.currentRiff][this.bassNoteIndex];
      if (note > 0) {
        this.playBassNote(note);
      }
      
      this.bassNoteIndex = (this.bassNoteIndex + 1) % this.bassNotes[this.currentRiff].length;
      if (this.bassNoteIndex === 0) {
        this.currentRiff = (this.currentRiff + 1) % this.bassNotes.length;
      }
    }, 500 / this.tempo);
  }

  startGuitar() {
    this.intervals.guitar = setInterval(() => {
      if (!this.isPlaying) return;
      
      const note = this.guitarRiffs[this.currentGuitarRiff][this.guitarNoteIndex];
      if (note > 0) {
        this.playGuitarNote(note);
      }
      
      this.guitarNoteIndex = (this.guitarNoteIndex + 1) % this.guitarRiffs[this.currentGuitarRiff].length;
      if (this.guitarNoteIndex === 0) {
        this.currentGuitarRiff = (this.currentGuitarRiff + 1) % this.guitarRiffs.length;
      }
    }, 250 / this.tempo);
  }

  startSolo() {
    this.intervals.solo = setInterval(() => {
      if (!this.isPlaying) return;
      
      if (Math.random() < 0.2) {
        this.playGuitarSolo();
      }
    }, 8000 / this.tempo);
  }

  // Звуковые функции
  playKick() {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioManager.musicGain);
    
    oscillator.frequency.setValueAtTime(60, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  playHiHat() {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioManager.musicGain);
    
    filter.type = 'highpass';
    filter.frequency.value = 8000;
    
    oscillator.type = 'square';
    oscillator.frequency.value = 8000;
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.03);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.03);
  }

  playBassNote(frequency) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioManager.musicGain);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  playGuitarNote(frequency) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    const distortion = this.audioContext.createWaveShaper();
    
    oscillator.connect(filter);
    filter.connect(distortion);
    distortion.connect(gainNode);
    gainNode.connect(this.audioManager.musicGain);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = frequency;
    
    filter.type = 'lowpass';
    filter.frequency.value = 2000;
    filter.Q.value = 5;
    
    distortion.curve = this.makeDistortionCurve(50);
    distortion.oversample = '4x';
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  playGuitarSolo() {
    const soloNotes = [
      196, 220, 246.94, 261.63, 293.66, 329.63, 349.23, 392,
      440, 493.88, 523.25, 587.33, 659.25, 698.46, 783.99
    ];
    
    let noteCount = 0;
    const soloInterval = setInterval(() => {
      if (!this.isPlaying || noteCount >= 12) {
        clearInterval(soloInterval);
        return;
      }
      
      const randomNote = soloNotes[Math.floor(Math.random() * soloNotes.length)];
      this.playSoloNote(randomNote);
      noteCount++;
    }, 100);
  }

  playSoloNote(frequency) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    const distortion = this.audioContext.createWaveShaper();
    
    oscillator.connect(filter);
    filter.connect(distortion);
    distortion.connect(gainNode);
    gainNode.connect(this.audioManager.musicGain);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = frequency;
    
    filter.type = 'lowpass';
    filter.frequency.value = 3000;
    filter.Q.value = 8;
    
    distortion.curve = this.makeDistortionCurve(80);
    distortion.oversample = '4x';
    
    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  makeDistortionCurve(amount) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    
    return curve;
  }

  updateTempo(tempoMultiplier) {
    this.tempo = Math.max(0.5, Math.min(2.0, tempoMultiplier));
    
    // Обновляем интервалы с новым темпом
    if (this.isPlaying) {
      this.stop();
      this.play();
    }
  }

  stop() {
    this.isPlaying = false;
    
    // Очистка всех интервалов
    Object.values(this.intervals).forEach(interval => {
      clearInterval(interval);
    });
    
    this.intervals = {};
  }

  pause() {
    this.stop();
  }

  resume() {
    if (this.audioContext) {
      this.play();
    }
  }
}