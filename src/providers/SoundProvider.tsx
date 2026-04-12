"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

interface SoundContextValue {
  soundEnabled: boolean;
  toggleSound: () => void;
  playSound: (name: string) => void;
}

const SoundContext = createContext<SoundContextValue>({
  soundEnabled: true,
  toggleSound: () => {},
  playSound: () => {},
});

export function useSoundContext() {
  return useContext(SoundContext);
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("nihongo-ninja-sound");
    if (stored !== null) setSoundEnabled(stored === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("nihongo-ninja-sound", String(soundEnabled));
  }, [soundEnabled]);

  const toggleSound = () => setSoundEnabled((s) => !s);

  const playSound = useCallback(
    (name: string) => {
      if (!soundEnabled) return;
      // Web Audio API for simple tones
      try {
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.value = 0.1;

        if (name === "correct") {
          osc.frequency.value = 523.25; // C5
          osc.type = "sine";
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        } else if (name === "wrong") {
          osc.frequency.value = 200;
          osc.type = "sawtooth";
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        } else if (name === "star") {
          osc.frequency.value = 880;
          osc.type = "sine";
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
        }
      } catch {
        // Audio not available
      }
    },
    [soundEnabled]
  );

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound, playSound }}>
      {children}
    </SoundContext.Provider>
  );
}
