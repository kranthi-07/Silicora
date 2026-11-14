'use client';

/**
 * Workbench Audio Synthesizer
 * Uses pure Web Audio API (zero external assets, zero latency, works 100% offline).
 * Synthesizes photorealistic analog lab sounds: switch clicks, dial ratchets, buzzer tones,
 * probe snaps, and electrical burnout pops.
 */

let audioCtx: AudioContext | null = null;
let soundMuted: boolean = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const WorkbenchAudio = {
  isMuted(): boolean {
    return soundMuted;
  },

  setMuted(muted: boolean) {
    soundMuted = muted;
  },

  toggleMute(): boolean {
    soundMuted = !soundMuted;
    return soundMuted;
  },

  /**
   * Crisp tactile toggle switch / pushbutton click
   */
  playSwitchClick() {
    if (soundMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    // Primary mechanical contact snap
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.exponentialRampToValueAtTime(120, t + 0.035);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(400, t);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.04);

    // Subtle micro-spring bounce
    const noise = ctx.createOscillator();
    const noiseGain = ctx.createGain();
    noise.type = 'sine';
    noise.frequency.setValueAtTime(800, t + 0.012);
    noise.frequency.exponentialRampToValueAtTime(300, t + 0.03);

    noiseGain.gain.setValueAtTime(0.08, t + 0.012);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(t + 0.012);
    noise.stop(t + 0.035);
  },

  /**
   * High-frequency ratchet tick for turning potentiometers or rotary knobs
   */
  playDialTick() {
    if (soundMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2600, t);
    osc.frequency.exponentialRampToValueAtTime(700, t + 0.015);

    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.02);
  },

  /**
   * Metallic probe alligator clip snap onto lead or breadboard hole
   */
  playProbeSnap(polarity: 'red' | 'black' = 'red') {
    if (soundMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const baseFreq = polarity === 'red' ? 1800 : 1500;
    osc.type = 'square';
    osc.frequency.setValueAtTime(baseFreq, t);
    osc.frequency.exponentialRampToValueAtTime(250, t + 0.04);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.045);
  },

  /**
   * Piezoelectric resonant buzzer tone
   */
  playBuzzerTone(freq: number = 2400, durationSec: number = 0.15) {
    if (soundMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.15, t);
    gain.gain.setValueAtTime(0.15, t + durationSec - 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + durationSec + 0.01);
  },

  /**
   * Dramatic electrical spark discharge and sizzling pop when component fails or burns out
   */
  playBurnoutPop() {
    if (soundMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // 1. Initial sharp capacitive arc crack
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(450, t);
    osc.frequency.exponentialRampToValueAtTime(50, t + 0.12);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);

    // 2. Dissipating sizzle (white noise burst)
    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.06));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, t);
    filter.Q.setValueAtTime(3, t);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(t);
    noise.stop(t + 0.25);
  },
};
