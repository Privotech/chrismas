// Multi-melody Web Audio holiday synthesizer
class HolidayAudioSystem {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.timer = null;
    this.currentTrack = "chimes"; // "chimes" | "silent_night" | "jingle_bells"
    this.noteIndex = 0;

    // Frequencies
    this.f = {
      C4: 261.63,
      D4: 293.66,
      E4: 329.63,
      F4: 349.23,
      G4: 392.0,
      A4: 440.0,
      B4: 493.88,
      C5: 523.25,
      D5: 587.33,
      E5: 659.25,
      F5: 698.46,
      G5: 783.99,
    };

    // Melodies: [frequency, durationInBeats]
    this.melodies = {
      chimes: [
        [392.0, 1.5],
        [523.25, 1.5],
        [659.25, 2.0],
        [587.33, 1.5],
        [523.25, 2.5],
        [440.0, 1.5],
        [392.0, 3.0],
      ],
      silent_night: [
        [392.0, 1.5],
        [440.0, 0.5],
        [392.0, 1.0],
        [329.63, 3.0], // Silent night,
        [392.0, 1.5],
        [440.0, 0.5],
        [392.0, 1.0],
        [329.63, 3.0], // holy night,
        [587.33, 2.0],
        [587.33, 1.0],
        [493.88, 3.0], // all is calm,
        [523.25, 2.0],
        [523.25, 1.0],
        [392.0, 3.0], // all is bright.
      ],
      jingle_bells: [
        [329.63, 0.8],
        [329.63, 0.8],
        [329.63, 1.6], // Jin-gle bells,
        [329.63, 0.8],
        [329.63, 0.8],
        [329.63, 1.6], // jin-gle bells,
        [329.63, 0.8],
        [392.0, 0.8],
        [261.63, 1.2],
        [293.66, 0.4],
        [329.63, 2.4], // jin-gle all the way!
      ],
    };
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

  playBell(freq, duration = 1.8, gainVal = 0.07) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(gainVal, this.ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // fallback
    }
  }

  playSparkle() {
    this.init();
    if (!this.ctx) return;
    const sparkleNotes = [523.25, 659.25, 783.99, 1046.5];
    sparkleNotes.forEach((freq, i) => {
      setTimeout(() => {
        this.playBell(freq, 1.0, 0.05);
      }, i * 60);
    });
  }

  setTrack(trackKey) {
    this.currentTrack = trackKey;
    this.noteIndex = 0;
    if (this.isPlaying) {
      if (this.timer) clearTimeout(this.timer);
      this.stepMelody();
    }
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

  stepMelody() {
    if (!this.isPlaying) return;
    const sequence = this.melodies[this.currentTrack] || this.melodies.chimes;
    const [freq, beats] = sequence[this.noteIndex % sequence.length];

    this.playBell(freq, beats * 0.9, 0.06);

    this.noteIndex = (this.noteIndex + 1) % sequence.length;
    const intervalMs = beats * 620;
    this.timer = setTimeout(() => this.stepMelody(), intervalMs);
  }

  start() {
    this.init();
    if (!this.ctx) return;
    this.isPlaying = true;
    this.stepMelody();
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
