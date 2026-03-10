/**
 * Sound Engine - Web Audio API (Number Puzzle)
 */
class SoundEngine {
    constructor() {
        this.enabled = this.loadPref();
        this.ctx = null;
        this.master = null;
        this.init();
    }

    init() {
        if (this.ctx) return;
        try {
            const AC = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AC();
            this.master = this.ctx.createGain();
            this.master.connect(this.ctx.destination);
            this.master.gain.value = this.enabled ? 0.5 : 0;
        } catch (e) { /* no audio */ }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    }

    toggle() {
        this.enabled = !this.enabled;
        this.savePref();
        if (this.master) this.master.gain.value = this.enabled ? 0.5 : 0;
        return this.enabled;
    }

    tone(freq, dur, type = 'sine', env = {}) {
        if (!this.ctx || !this.master) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        const g = this.ctx.createGain();
        g.connect(this.master);
        const a = env.a || 0.01, d = env.d || 0.05, s = env.s || 0.3;
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(1, now + a);
        g.gain.linearRampToValueAtTime(s, now + a + d);
        g.gain.linearRampToValueAtTime(0, now + dur);
        osc.connect(g);
        osc.start(now);
        osc.stop(now + dur);
    }

    play(type) {
        if (!this.enabled || !this.ctx) return;
        try {
            switch (type) {
                case 'slide': this.tone(300, 0.08, 'sine'); break;
                case 'merge': this.tone(520, 0.12, 'sine', { a: 0.01, d: 0.08, s: 0.5 }); break;
                case 'bigmerge':
                    this.tone(523, 0.15, 'sine', { a: 0.01, d: 0.1, s: 0.6 });
                    setTimeout(() => this.tone(659, 0.15, 'sine'), 80);
                    break;
                case 'newtile': this.tone(440, 0.06, 'triangle', { a: 0.01, d: 0.04, s: 0.3 }); break;
                case 'combo':
                    [523, 659, 784].forEach((f, i) => setTimeout(() => this.tone(f, 0.1, 'sine'), i * 60));
                    break;
                case 'win':
                    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, 0.2, 'sine', { a: 0.02, s: 0.5 }), i * 120));
                    break;
                case 'gameover':
                    [400, 300, 200].forEach((f, i) => setTimeout(() => this.tone(f, 0.25, 'sine', { a: 0.03, s: 0.3 }), i * 150));
                    break;
                case 'newbest':
                    [659, 784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, 0.18, 'sine', { a: 0.01, s: 0.6 }), i * 100));
                    break;
                case 'undo': this.tone(350, 0.1, 'square', { a: 0.01, d: 0.06, s: 0.3 }); break;
            }
        } catch (e) { /* ignore */ }
    }

    savePref() { try { localStorage.setItem('sfx_enabled', this.enabled); } catch (e) {} }
    loadPref() { try { return localStorage.getItem('sfx_enabled') !== 'false'; } catch (e) { return true; } }
}

window.sfx = new SoundEngine();
