// Web Audio API ambient chime synthesizer & holiday sound effects
class HolidayAudioSystem {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.notes = [
      261.63, // C4
      293.66, // D4
      329.63, // E4
      392.00, // G4
      440.00, // A4
      523.25, // C5
      587.33, // D5
      659.25, // E5
    ];
    this.chords = [
      [261.63, 329.63, 392.00], // C
      [220.00, 261.63, 329.63], // Am
      [174.61, 220.00, 261.63], // F
      [196.00, 246.94, 293.66], // G
    ];
    this.currentChord = 0;
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playBell(freq, duration = 2.5, gainVal = 0.08) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Bell envelope
      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(gainVal, this.ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  }

  playSparkle() {
    this.init();
    if (!this.ctx) return;
    const sparkleNotes = [523.25, 659.25, 783.99, 1046.50];
    sparkleNotes.forEach((freq, i) => {
      setTimeout(() => {
        this.playBell(freq, 1.2, 0.06);
      }, i * 65);
    });
  }

  toggleMusic(onStateChange) {
    this.init();
    if (this.isPlaying) {
      this.stop();
      if (onStateChange) onStateChange(false);
      return false;
    } else {
      this.start();
      if (onStateChange) onStateChange(true);
      return true;
    }
  }

  start() {
    this.init();
    if (!this.ctx) return;
    this.isPlaying = true;

    const playSequence = () => {
      if (!this.isPlaying) return;
      const chord = this.chords[this.currentChord % this.chords.length];
      chord.forEach((note, idx) => {
        setTimeout(() => {
          if (this.isPlaying) this.playBell(note * 1.5, 3.5, 0.03);
        }, idx * 300);
      });

      this.currentChord = (this.currentChord + 1) % this.chords.length;
      this.timer = setTimeout(playSequence, 2800);
    };

    playSequence();
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}

export const holidayAudio = new HolidayAudioSystem();
