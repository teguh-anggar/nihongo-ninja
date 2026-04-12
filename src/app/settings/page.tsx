"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/providers/ThemeProvider";
import { useSoundContext } from "@/providers/SoundProvider";
import { Button } from "@/components/ui/Button";
import { resetProgress } from "@/lib/progress/storage";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound } = useSoundContext();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    resetProgress();
    setShowResetConfirm(false);
    window.location.href = "/";
  };

  return (
    <div className="max-w-lg mx-auto px-kid-4 py-kid-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-heading-xl font-bold text-text text-center mb-kid-6"
      >
        Settings
      </motion.h1>

      <div className="space-y-kid-4">
        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-kid-xl shadow-kid-card border border-border p-kid-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-kid-3">
            <span className="text-3xl">{theme === "light" ? "☀️" : "🌙"}</span>
            <div>
              <p className="text-body-lg font-bold text-text">Theme</p>
              <p className="text-body-sm text-text-muted">{theme === "light" ? "Light Mode" : "Dark Mode"}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={toggleTheme}>
            Switch
          </Button>
        </motion.div>

        {/* Sound */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-kid-xl shadow-kid-card border border-border p-kid-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-kid-3">
            <span className="text-3xl">{soundEnabled ? "🔊" : "🔇"}</span>
            <div>
              <p className="text-body-lg font-bold text-text">Sound Effects</p>
              <p className="text-body-sm text-text-muted">{soundEnabled ? "On" : "Off"}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={toggleSound}>
            {soundEnabled ? "Mute" : "Unmute"}
          </Button>
        </motion.div>

        {/* Reset */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface rounded-kid-xl shadow-kid-card border border-border p-kid-4"
        >
          <div className="flex items-center gap-kid-3 mb-kid-3">
            <span className="text-3xl">🗑️</span>
            <div>
              <p className="text-body-lg font-bold text-text">Reset Progress</p>
              <p className="text-body-sm text-text-muted">Delete all your stars and achievements</p>
            </div>
          </div>
          {!showResetConfirm ? (
            <Button variant="danger" size="sm" onClick={() => setShowResetConfirm(true)}>
              Reset All Data
            </Button>
          ) : (
            <div className="flex gap-kid-2 items-center">
              <p className="text-body-sm text-error font-bold">Are you sure?</p>
              <Button variant="danger" size="sm" onClick={handleReset}>
                Yes, Reset
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
