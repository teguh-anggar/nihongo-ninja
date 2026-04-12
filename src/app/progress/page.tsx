"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { loadProgress } from "@/lib/progress/storage";
import { BELT_COLORS, BELT_NAMES, ACHIEVEMENTS } from "@/types/progress";
import type { UserProgress } from "@/types/progress";

const modeLabels: Record<string, { label: string; emoji: string; color: string }> = {
  hiragana: { label: "Hiragana", emoji: "🎴", color: "bg-primary-500" },
  katakana: { label: "Katakana", emoji: "🔗", color: "bg-secondary-500" },
  vocabulary: { label: "Vocabulary", emoji: "📚", color: "bg-accent-500" },
  "drag-drop": { label: "Match", emoji: "🎯", color: "bg-info-500" },
};

export default function ProgressPage() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!progress) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-4xl animate-bounce-in">🥷</span>
      </div>
    );
  }

  const beltColor = BELT_COLORS[progress.level] || BELT_COLORS[1];
  const beltName = BELT_NAMES[progress.level] || BELT_NAMES[1];

  return (
    <div className="max-w-4xl mx-auto px-kid-4 py-kid-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-heading-xl font-bold text-text text-center mb-kid-6"
      >
        Your Ninja Progress
      </motion.h1>

      {/* Ninja Level Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-surface rounded-kid-xl shadow-kid-card border border-border p-kid-6 mb-kid-6 text-center"
      >
        <div
          className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl border-4"
          style={{ borderColor: beltColor, backgroundColor: beltColor + "20" }}
        >
          🥷
        </div>
        <h2 className="text-heading-lg font-bold text-text">{beltName}</h2>
        <p className="text-body-md text-text-muted mt-1">Level {progress.level}</p>

        <div className="flex justify-center gap-kid-6 mt-kid-4">
          <StatPill emoji="⭐" value={progress.totalStars} label="Stars" />
          <StatPill emoji="🎮" value={progress.gamesPlayed} label="Games" />
          <StatPill emoji="🔥" value={progress.bestStreak} label="Best Streak" />
        </div>
      </motion.div>

      {/* Per-Mode Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface rounded-kid-xl shadow-kid-card border border-border p-kid-6 mb-kid-6"
      >
        <h3 className="text-heading-md font-bold text-text mb-kid-4">Game Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-kid-4">
          {Object.entries(modeLabels).map(([key, info]) => {
            const mode = progress.perMode[key as keyof typeof progress.perMode];
            const accuracy = mode.gamesPlayed > 0
              ? Math.round((mode.correctAnswers / (mode.correctAnswers + mode.incorrectAnswers)) * 100)
              : 0;
            return (
              <div key={key} className="bg-surface-raised rounded-kid-lg p-kid-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{info.emoji}</span>
                  <span className="text-body-lg font-bold text-text">{info.label}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-body-sm">
                    <span className="text-text-muted">Games Played</span>
                    <span className="font-bold">{mode.gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between text-body-sm">
                    <span className="text-text-muted">High Score</span>
                    <span className="font-bold text-accent-500">{mode.highScore}</span>
                  </div>
                  <div className="flex justify-between text-body-sm">
                    <span className="text-text-muted">Accuracy</span>
                    <span className="font-bold text-secondary-500">{accuracy}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface rounded-kid-full overflow-hidden">
                    <div
                      className={`h-full rounded-kid-full transition-all duration-500 ${info.color}`}
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-surface rounded-kid-xl shadow-kid-card border border-border p-kid-6"
      >
        <h3 className="text-heading-md font-bold text-text mb-kid-4">
          Achievements ({progress.achievements.length}/{ACHIEVEMENTS.length})
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-kid-3">
          {ACHIEVEMENTS.map((a) => {
            const earned = progress.achievements.includes(a.id);
            return (
              <motion.div
                key={a.id}
                whileHover={{ scale: 1.05 }}
                className={`rounded-kid-lg p-kid-3 text-center transition-all ${
                  earned
                    ? "bg-accent-50 border-2 border-accent-300"
                    : "bg-surface-raised border-2 border-border opacity-50"
                }`}
              >
                <span className="text-3xl block mb-1">
                  {earned ? "🏅" : "🔒"}
                </span>
                <span className="text-body-sm font-bold text-text block">{a.name}</span>
                <span className="text-body-sm text-text-muted block">{a.description}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

function StatPill({ emoji, value, label }: { emoji: string; value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-2xl">{emoji}</span>
      <span className="text-heading-md font-bold text-text">{value}</span>
      <span className="text-body-sm text-text-muted">{label}</span>
    </div>
  );
}
