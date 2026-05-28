const stage = document.getElementById('stage');
const butterflyButton = document.getElementById('butterflyButton');
const note = document.getElementById('note');
const taskText = document.getElementById('taskText');
const timeText = document.getElementById('timeText');
const doneButton = document.getElementById('doneButton');
const snoozeButton = document.getElementById('snoozeButton');
const closeButton = document.getElementById('closeButton');

let payload = null;
let didOpenAfterFlight = false;
let didPlayMusic = false;
let audioContext = null;

function formatDueTime(timestamp) {
  const date = new Date(timestamp || Date.now());
  return date.toLocaleString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
    day: 'numeric'
  });
}

function clampText(text, max = 150) {
  const value = String(text || 'Your reminder is ready.').replace(/\s+/g, ' ').trim();
  return value.length > max ? value.slice(0, max - 1).trim() + '…' : value;
}


function ensureAudioContext() {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    audioContext = new AudioCtx();
  }
  if (audioContext.state === 'suspended') audioContext.resume().catch(() => {});
  return audioContext;
}

function playTone(ctx, { start, duration, frequency, type = 'sine', volume = 0.04, pan = 0, fade = 0.22 }) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, start);

  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(Math.max(volume, 0.0002), start + 0.035);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration + fade);

  if (panner) {
    panner.pan.setValueAtTime(pan, start);
    osc.connect(gain);
    gain.connect(panner);
    panner.connect(ctx.destination);
  } else {
    osc.connect(gain);
    gain.connect(ctx.destination);
  }

  osc.start(start);
  osc.stop(start + duration + fade + 0.06);
}

function playSoftPianoNote(ctx, start, frequency, duration, volume = 0.035, pan = 0) {
  // soft piano-ish layered sine/triangle tones
  playTone(ctx, { start, duration, frequency, type: 'sine', volume, pan, fade: 0.55 });
  playTone(ctx, { start: start + 0.006, duration: duration * 0.82, frequency: frequency * 2.01, type: 'triangle', volume: volume * 0.18, pan, fade: 0.38 });
  playTone(ctx, { start: start + 0.012, duration: duration * 0.70, frequency: frequency * 3.0, type: 'sine', volume: volume * 0.07, pan, fade: 0.30 });
}

function playSparkle(ctx, start, frequency, volume = 0.018, pan = 0) {
  playTone(ctx, { start, duration: 0.10, frequency, type: 'sine', volume, pan, fade: 0.16 });
  playTone(ctx, { start: start + 0.025, duration: 0.09, frequency: frequency * 1.5, type: 'sine', volume: volume * 0.45, pan: pan * -0.6, fade: 0.14 });
}

function playReminderMusic() {
  if (didPlayMusic) return;
  const ctx = ensureAudioContext();
  if (!ctx) return;
  didPlayMusic = true;

  const now = ctx.currentTime + 0.04;

  // Long soft magical piano bed, around 10 seconds, made to cover the butterfly flight.
  const pianoNotes = [
    [0.00,  523.25, 1.35, 0.030, -0.12], // C5
    [0.42,  659.25, 1.45, 0.028,  0.10], // E5
    [0.92,  783.99, 1.55, 0.027, -0.06], // G5
    [1.52,  987.77, 1.65, 0.024,  0.14], // B5
    [2.20,  880.00, 1.70, 0.026, -0.10], // A5
    [2.92,  659.25, 1.80, 0.026,  0.08],
    [3.70,  739.99, 1.85, 0.025, -0.05],
    [4.48,  987.77, 1.95, 0.023,  0.12],
    [5.30,  783.99, 2.05, 0.025, -0.10],
    [6.12,  659.25, 2.15, 0.025,  0.04],
    [6.94,  587.33, 2.25, 0.024, -0.08],
    [7.80,  523.25, 2.35, 0.026,  0.00],
    [8.62,  659.25, 1.65, 0.020,  0.10],
    [9.10,  783.99, 1.50, 0.018, -0.06]
  ];

  pianoNotes.forEach(([offset, freq, dur, vol, pan]) => {
    playSoftPianoNote(ctx, now + offset, freq, dur, vol, pan);
  });

  // Calm background pad underneath.
  const padNotes = [
    [0.00, 261.63, 4.8, 0.010],
    [2.40, 329.63, 4.8, 0.009],
    [4.80, 392.00, 4.8, 0.009],
    [7.20, 329.63, 3.4, 0.008]
  ];
  padNotes.forEach(([offset, freq, dur, vol]) => {
    playTone(ctx, { start: now + offset, duration: dur, frequency: freq, type: 'sine', volume: vol, pan: 0, fade: 1.4 });
  });

  // Tiny sparkle sounds sprinkled softly, not harsh.
  const sparkles = [
    [0.70, 1567.98, -0.30],
    [1.38, 1975.53,  0.32],
    [2.05, 1760.00, -0.16],
    [2.85, 2349.32,  0.22],
    [3.60, 2093.00, -0.24],
    [4.38, 2637.02,  0.28],
    [5.18, 1975.53, -0.18],
    [6.05, 2349.32,  0.16],
    [6.90, 1760.00, -0.28],
    [7.72, 2637.02,  0.30],
    [8.55, 2093.00, -0.08],
    [9.20, 2349.32,  0.12]
  ];
  sparkles.forEach(([offset, freq, pan]) => {
    playSparkle(ctx, now + offset, freq, 0.010, pan);
  });
}

async function init() {
  payload = await window.euphoricAlarm.getPayload();
  taskText.textContent = clampText(payload.text, 165);
  timeText.textContent = formatDueTime(payload.dueAt);
  window.setInterval(() => window.euphoricAlarm.keepOnTop(), 2500);
  playReminderMusic();
  window.setTimeout(() => playReminderMusic(), 250);

  // Stable butterfly size, soft non-rectangle trail, and music starts when flight starts.
  window.setTimeout(() => {
    stage.classList.remove('is-flying');
    stage.classList.add('has-landed');
    window.euphoricAlarm.flightComplete();
    window.setTimeout(() => openNote(), 420);
  }, 11250);
}

function openNote() {
  if (!didOpenAfterFlight) didOpenAfterFlight = true;
  stage.classList.add('has-landed', 'is-open');
  note.setAttribute('aria-hidden', 'false');
  playReminderMusic();
}

function closeNoteOnly() {
  stage.classList.remove('is-open');
  note.setAttribute('aria-hidden', 'true');
}

function finish(action, minutes = 0) {
  stage.classList.remove('is-open');
  stage.style.transition = 'opacity 220ms ease, transform 220ms ease';
  stage.style.opacity = '0';
  stage.style.transform = 'translateY(-10px) scale(.96)';
  window.setTimeout(() => window.euphoricAlarm.action({ action, minutes }), 220);
}

butterflyButton.addEventListener('click', openNote);
closeButton.addEventListener('click', closeNoteOnly);
doneButton.addEventListener('click', () => finish('done'));
snoozeButton.addEventListener('click', () => finish('snooze', 10));
window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (stage.classList.contains('is-open')) closeNoteOnly();
    else finish('dismiss');
  }
});

init();
