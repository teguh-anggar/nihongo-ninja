"use client";

import { useSoundContext } from "@/providers/SoundProvider";
import { motion } from "framer-motion";

export function SoundToggle() {
  const { soundEnabled, toggleSound } = useSoundContext();

  return (
    <button
      onClick={toggleSound}
      className="w-12 h-12 rounded-kid-md bg-surface shadow-kid-card flex items-center justify-center cursor-pointer hover:shadow-kid-card-hover transition-shadow min-h-touch min-w-touch"
      aria-label={`${soundEnabled ? "Mute" : "Unmute"} sounds`}
    >
      <motion.span
        key={soundEnabled ? "on" : "off"}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="text-2xl"
      >
        {soundEnabled ? "🔊" : "🔇"}
      </motion.span>
    </button>
  );
}
