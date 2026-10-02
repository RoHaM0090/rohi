/* ==========================================================================
   LOGO REVEAL - CONFIG
   Everything you are likely to tweak lives here.
   Timeline values are in seconds on the *design* timeline (4.5s).
   If you change `duration`, the whole timeline is stretched/compressed.
   ========================================================================== */
window.REVEAL_CONFIG = {

  duration: 4.5,          // total length of the scripted animation (seconds)
  speed: 1,               // playback multiplier (testing)
  loop: false,            // restart automatically after the end
  idleAfterEnd: 'animate',// 'animate' = very calm dust keeps drifting | 'freeze'
  transparent: false,     // true = no black background (or open index.html?transparent=1)
  maxDpr: 2,              // cap device-pixel-ratio for performance

  logo: {
    src: 'assets/logo.png',   // white logo on transparent background
    heightFraction: 0.62,     // logo height relative to viewport height
    maxWidthFraction: 0.62    // ...but never wider than this fraction of the viewport
  },

  colors: {
    background: '#000000',
    logoTop:    '#eef0f3',    // logo surface (subtle vertical gradient, top)
    logoBottom: '#c6cad1',    // logo surface (bottom)
    line:       '#d9dee6',    // construction lines / outline
    particle:   '#cfd5de',
    glow:       '#e3e9f2',
    sweep:      '#ffffff',
    flash:      '#ffffff'
  },

  glow:   { intensity: 1.0 },            // 0 = off, 1 = default, 2 = strong
  flash:  { intensity: 0.13 },           // final flash strength (0 = off)
  sweep:  { intensity: 1.0 },            // light-sweep strength

  particles: {
    ambient: 150,                        // fine dust in the dark
    formation: 260,                      // particles that converge onto the logo outline
    pass: 38                             // particles crossing at the final sweep
  },

  camera: {
    zoom: 0.035,                         // total micro zoom (3.5%)
    drift: 3                             // gentle drift in CSS px (0 = static camera)
  },

  depth: {
    layers: 8,                           // extrusion layers for the subtle 3D feel
    thickness: 7                         // total extrusion depth in CSS px (fades to 0 at the end)
  },

  /* Sound is OFF by default. Press S to toggle. Cues are fired from this list.
     Put your own files in assets/audio/ and map them in `files`;
     any cue without a file uses the built-in synth when `synth` is true. */
  audio: {
    enabled: false,
    synth: true,
    volume: 0.8,
    files: {
      // whoosh:  'assets/audio/whoosh.mp3',
      // impact:  'assets/audio/impact.mp3',
      // drone:   'assets/audio/drone.mp3',
      // shimmer: 'assets/audio/shimmer.mp3'
    },
    cues: [
      { t: 0.00, type: 'drone',   dur: 4.5 },
      { t: 0.55, type: 'whoosh',  dur: 0.9, dir: 'up' },
      { t: 1.45, type: 'whoosh',  dur: 0.6, dir: 'up' },
      { t: 1.85, type: 'shimmer', dur: 1.4 },
      { t: 3.00, type: 'whoosh',  dur: 0.7, dir: 'up' },
      { t: 3.50, type: 'impact',  dur: 1.4 }
    ]
  },

  hints: true             // small key hints after the animation ends
};
