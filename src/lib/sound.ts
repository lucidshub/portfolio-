// Soft keypress tick — used by the terminal. Low gain, low-passed, short.
// Created lazily inside a user gesture so autoplay policies are happy.
let ctx: AudioContext | null = null;

export function playKey() {
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();

    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const filt = ctx.createBiquadFilter();
    const g = ctx.createGain();

    o.type = "triangle";
    o.frequency.setValueAtTime(240, t);
    filt.type = "lowpass";
    filt.frequency.setValueAtTime(700, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);

    o.connect(filt).connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + 0.06);
  } catch {
    /* audio unavailable — fail silently */
  }
}
