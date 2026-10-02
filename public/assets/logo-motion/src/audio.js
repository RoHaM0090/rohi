/* ==========================================================================
   AUDIO - tiny cue-based sound system. Fully optional.
   - Cues are defined in config.js (audio.cues).
   - A cue plays a file from audio.files[type] if provided,
     otherwise a built-in WebAudio synth (if audio.synth is true).
   - Browsers require a user gesture before sound: press S (or click) first.
   ========================================================================== */
(() => {
  'use strict';

  class AudioFX {
    constructor(cfg) {
      this.cfg = cfg.audio;
      this.on = !!this.cfg.enabled;
      this.ctx = null;
      this.master = null;
      this.timers = [];
      this.live = [];
      this.noiseBuf = null;
    }

    _ensure() {
      if (this.ctx) return true;
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -14; comp.ratio.value = 4; comp.attack.value = 0.005; comp.release.value = 0.25;
      this.master = this.ctx.createGain();
      this.master.gain.value = this.cfg.volume;
      this.master.connect(comp); comp.connect(this.ctx.destination);

      // white-noise buffer + small generated reverb impulse
      const len = this.ctx.sampleRate * 2;
      this.noiseBuf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noiseBuf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

      const irLen = Math.floor(this.ctx.sampleRate * 1.8);
      const ir = this.ctx.createBuffer(2, irLen, this.ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const ch = ir.getChannelData(c);
        for (let i = 0; i < irLen; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLen, 3.2);
      }
      this.verb = this.ctx.createConvolver();
      this.verb.buffer = ir;
      this.verbGain = this.ctx.createGain();
      this.verbGain.gain.value = 0.28;
      this.verb.connect(this.verbGain); this.verbGain.connect(this.master);
      return true;
    }

    /** Toggle sound. Must be called from a user gesture the first time. */
    toggle(tNow) {
      this.on = !this.on;
      if (this.on) {
        if (!this._ensure()) { this.on = false; return false; }
        if (this.ctx.state === 'suspended') this.ctx.resume();
        this.schedule(tNow || 0);
      } else {
        this.stop();
      }
      return this.on;
    }

    /** Schedule every cue that is still in the future of design-time `tNow`. */
    schedule(tNow, speed = 1) {
      this.stop();
      if (!this.on) return;
      this._ensure();
      const cues = this.cfg.cues;
      for (const cue of cues) {
        const delay = (cue.t - tNow) / speed;
        if (delay < -0.05) continue;
        const file = this.cfg.files && this.cfg.files[cue.type];
        if (file) {
          const id = setTimeout(() => this._playFile(file), Math.max(0, delay) * 1000);
          this.timers.push(id);
        } else if (this.cfg.synth && this.ctx) {
          this._synth(cue, this.ctx.currentTime + Math.max(0, delay), speed);
        }
      }
    }

    stop() {
      this.timers.forEach(clearTimeout); this.timers = [];
      for (const n of this.live) { try { n.stop(); } catch (e) {} }
      this.live = [];
      for (const a of this._files || []) { try { a.pause(); } catch (e) {} }
      this._files = [];
    }

    _playFile(url) {
      const a = new Audio(url);
      a.volume = Math.min(1, this.cfg.volume);
      (this._files = this._files || []).push(a);
      a.play().catch(() => {});
    }

    /* ---------------- synthesized cues ---------------- */
    _env(g, t0, a, peak, d) {
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(peak, t0 + a);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
    }

    _synth(cue, t0, speed) {
      const c = this.ctx, dur = cue.dur / speed;
      const track = (n) => { this.live.push(n); return n; };

      if (cue.type === 'drone') {
        const g = c.createGain(); g.connect(this.master);
        g.gain.setValueAtTime(0.0001, t0);
        g.gain.exponentialRampToValueAtTime(0.16, t0 + dur * 0.7);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        const lp = c.createBiquadFilter(); lp.type = 'lowpass';
        lp.frequency.setValueAtTime(120, t0); lp.frequency.exponentialRampToValueAtTime(520, t0 + dur * 0.8);
        lp.connect(g);
        [[55, 'sine'], [82.41, 'triangle'], [110.3, 'sine']].forEach(([f, type], i) => {
          const o = track(c.createOscillator()); o.type = type; o.frequency.value = f;
          const og = c.createGain(); og.gain.value = [0.6, 0.25, 0.18][i];
          o.connect(og); og.connect(lp); o.start(t0); o.stop(t0 + dur + 0.1);
        });
      }

      if (cue.type === 'whoosh') {
        const n = track(c.createBufferSource()); n.buffer = this.noiseBuf; n.loop = true;
        const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.9;
        const up = cue.dir !== 'down';
        bp.frequency.setValueAtTime(up ? 250 : 3200, t0);
        bp.frequency.exponentialRampToValueAtTime(up ? 3200 : 250, t0 + dur);
        const g = c.createGain(); this._env(g, t0, dur * 0.55, 0.32, dur);
        n.connect(bp); bp.connect(g); g.connect(this.master); g.connect(this.verb);
        n.start(t0); n.stop(t0 + dur + 0.05);
      }

      if (cue.type === 'shimmer') {
        [1318.5, 1976, 2637, 3322].forEach((f, i) => {
          const o = track(c.createOscillator()); o.type = 'sine'; o.frequency.value = f;
          const g = c.createGain(); this._env(g, t0 + i * 0.05, 0.25, 0.035 / (i + 1), dur);
          o.connect(g); g.connect(this.master); g.connect(this.verb);
          o.start(t0); o.stop(t0 + dur + 0.2);
        });
      }

      if (cue.type === 'impact') {
        const o = track(c.createOscillator()); o.type = 'sine';
        o.frequency.setValueAtTime(110, t0); o.frequency.exponentialRampToValueAtTime(34, t0 + 0.7);
        const g = c.createGain(); this._env(g, t0, 0.012, 0.95, dur);
        o.connect(g); g.connect(this.master); g.connect(this.verb);
        o.start(t0); o.stop(t0 + dur + 0.1);
        const n = track(c.createBufferSource()); n.buffer = this.noiseBuf;
        const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800;
        const ng = c.createGain(); this._env(ng, t0, 0.005, 0.35, 0.35);
        n.connect(lp); lp.connect(ng); ng.connect(this.master); ng.connect(this.verb);
        n.start(t0); n.stop(t0 + 0.5);
      }
    }
  }

  window.AudioFX = AudioFX;
})();
