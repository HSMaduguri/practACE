// Web Audio API Alarm Synthesizer for Power Naps & Wake-Up Alarms

let alarmAudioCtx: AudioContext | null = null;
let alarmIntervalId: any = null;
let isAlarmPlaying = false;

/**
 * Starts a repeating loud wake-up alarm sound using the Web Audio API.
 * Works reliably without any external asset files or network dependencies.
 */
export const playPowerNapAlarm = (): void => {
  if (isAlarmPlaying) return;
  isAlarmPlaying = true;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!alarmAudioCtx || alarmAudioCtx.state === 'closed') {
      alarmAudioCtx = new AudioContextClass();
    }

    if (alarmAudioCtx.state === 'suspended') {
      alarmAudioCtx.resume();
    }

    const playChimeTone = () => {
      if (!alarmAudioCtx || alarmAudioCtx.state === 'closed') return;
      try {
        const now = alarmAudioCtx.currentTime;

        // Double beep chime (High-pitched repeating alert: 880Hz C6 & 1046.5Hz C6)
        const osc1 = alarmAudioCtx.createOscillator();
        const osc2 = alarmAudioCtx.createOscillator();
        const gain = alarmAudioCtx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, now); // A5

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1046.5, now + 0.12); // C6

        // Gain envelope for pleasant yet clear alarm tone
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.exponentialRampToValueAtTime(0.5, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        gain.gain.setValueAtTime(0.01, now + 0.25);
        gain.gain.exponentialRampToValueAtTime(0.6, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(alarmAudioCtx.destination);

        osc1.start(now);
        osc1.stop(now + 0.25);

        osc2.start(now + 0.25);
        osc2.stop(now + 0.55);
      } catch (e) {
        console.warn("Audio chime note error:", e);
      }
    };

    // Play immediately, then repeat every 900ms
    playChimeTone();
    alarmIntervalId = setInterval(playChimeTone, 900);
  } catch (err) {
    console.error("Failed to start Power Nap alarm sound:", err);
  }
};

/**
 * Stops the active power nap alarm sound completely.
 */
export const stopPowerNapAlarm = (): void => {
  isAlarmPlaying = false;
  if (alarmIntervalId) {
    clearInterval(alarmIntervalId);
    alarmIntervalId = null;
  }
  if (alarmAudioCtx) {
    try {
      if (alarmAudioCtx.state !== 'closed') {
        alarmAudioCtx.close();
      }
    } catch (e) {
      console.warn("Error closing audio context:", e);
    }
    alarmAudioCtx = null;
  }
};

/**
 * Plays a brief 2-second preview chime for testing volume.
 */
export const testPowerNapAlarmSound = (): void => {
  stopPowerNapAlarm();
  playPowerNapAlarm();
  setTimeout(() => {
    stopPowerNapAlarm();
  }, 2200);
};

export const checkIsPowerNapAlarmPlaying = (): boolean => isAlarmPlaying;

let sharedChimeCtx: AudioContext | null = null;
let chimeUnlockListenersBound = false;

const getOrInitChimeContext = (): AudioContext | null => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!sharedChimeCtx || sharedChimeCtx.state === 'closed') {
      sharedChimeCtx = new AudioContextClass();
    }
    return sharedChimeCtx;
  } catch (e) {
    return null;
  }
};

const bindChimeUnlockListeners = () => {
  if (chimeUnlockListenersBound || typeof window === 'undefined') return;
  chimeUnlockListenersBound = true;

  const unlockAudio = () => {
    try {
      const ctx = getOrInitChimeContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch (e) {}
  };

  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
  window.addEventListener('click', unlockAudio, { passive: true });
};

if (typeof window !== 'undefined') {
  bindChimeUnlockListeners();
}

/**
 * Plays a pleasant, unmistakable harmonic chime notification using the Web Audio API
 * when target alert pop-ups appear (< 2 mins left or target completion).
 * Client-side synthesized with no external audio files and zero speech synthesis.
 */
export const playNotificationChime = (variant: 'approaching' | 'completed' = 'approaching'): void => {
  try {
    bindChimeUnlockListeners();
    const chimeCtx = getOrInitChimeContext();
    if (!chimeCtx) return;

    const scheduleNotes = () => {
      try {
        const now = chimeCtx.currentTime + 0.02;

        // Distinct harmonic bell chimes for approaching (<2m) vs completed (0:00)
        const tones =
          variant === 'completed'
            ? [
                { freq: 587.33, start: now, dur: 0.18, gain: 0.28, type: 'sine' as OscillatorType },        // D5
                { freq: 783.99, start: now + 0.14, dur: 0.22, gain: 0.32, type: 'sine' as OscillatorType }, // G5
                { freq: 987.77, start: now + 0.28, dur: 0.28, gain: 0.35, type: 'triangle' as OscillatorType }, // B5
                { freq: 1174.66, start: now + 0.44, dur: 0.65, gain: 0.4, type: 'sine' as OscillatorType }  // D6
              ]
            : [
                { freq: 659.25, start: now, dur: 0.18, gain: 0.28, type: 'sine' as OscillatorType },        // E5
                { freq: 830.61, start: now + 0.14, dur: 0.22, gain: 0.32, type: 'sine' as OscillatorType }, // G#5
                { freq: 987.77, start: now + 0.28, dur: 0.55, gain: 0.38, type: 'triangle' as OscillatorType }  // B5
              ];

        tones.forEach((t) => {
          const osc = chimeCtx.createOscillator();
          const gain = chimeCtx.createGain();

          osc.type = t.type;
          osc.frequency.setValueAtTime(t.freq, t.start);

          gain.gain.setValueAtTime(0.001, t.start);
          gain.gain.linearRampToValueAtTime(t.gain, t.start + 0.025);
          gain.gain.exponentialRampToValueAtTime(0.0008, t.start + t.dur);

          osc.connect(gain);
          gain.connect(chimeCtx.destination);

          osc.start(t.start);
          osc.stop(t.start + t.dur + 0.02);
        });
      } catch (innerErr) {
        console.warn('Could not schedule chime notes:', innerErr);
      }
    };

    if (chimeCtx.state === 'suspended') {
      chimeCtx
        .resume()
        .then(() => {
          scheduleNotes();
        })
        .catch(() => {
          scheduleNotes();
        });
    } else {
      scheduleNotes();
    }
  } catch (err) {
    console.warn('Could not play notification chime:', err);
  }
};

