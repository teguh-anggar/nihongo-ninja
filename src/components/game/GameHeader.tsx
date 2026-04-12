"use client";

import { motion, AnimatePresence } from "framer-motion";

interface GameHeaderProps {
  score: number;
  streak: number;
  livesRemaining: number;
  maxLives: number;
  currentQuestion: number;
  totalQuestions: number;
}

export function GameHeader({
  score,
  streak,
  livesRemaining,
  maxLives,
  currentQuestion,
  totalQuestions,
}: GameHeaderProps) {
  return (
    <div className="flex items-center justify-between px-kid-4 py-kid-2 bg-surface rounded-kid-lg shadow-kid-card mb-kid-4 flex-wrap gap-kid-2">
      {/* Score */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">💰</span>
        <motion.span
          key={score}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
          className="text-heading-md font-bold text-accent-500"
        >
          {score}
        </motion.span>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🔥</span>
        <span className="text-body-lg font-bold text-primary-500">
          {streak}x
        </span>
      </div>

      {/* Lives */}
      <div className="flex items-center gap-1" aria-label={`${livesRemaining} lives remaining`}>
        {Array.from({ length: maxLives }, (_, i) => (
          <motion.span
            key={i}
            initial={{ scale: 1 }}
            animate={i >= livesRemaining ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-2xl"
          >
            {i < livesRemaining ? "❤️" : "🩶"}
          </motion.span>
        ))}
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <span className="text-body-sm font-semibold text-text-muted">
          {currentQuestion + 1}/{totalQuestions}
        </span>
      </div>
    </div>
  );
}
