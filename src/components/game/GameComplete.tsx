"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { getStarRating } from "@/lib/game-engine/scoring";

interface GameCompleteProps {
  score: number;
  correctCount: number;
  incorrectCount: number;
  totalQuestions: number;
  bestStreak: number;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export function GameComplete({
  score,
  correctCount,
  incorrectCount,
  totalQuestions,
  bestStreak,
  onPlayAgain,
  onGoHome,
}: GameCompleteProps) {
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const stars = getStarRating(accuracy);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="flex flex-col items-center gap-kid-4 py-kid-8 px-kid-4 text-center"
    >
      <motion.span
        className="text-8xl"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      >
        {stars >= 3 ? "🏆" : stars >= 2 ? "🎉" : stars >= 1 ? "👍" : "💪"}
      </motion.span>

      <h2 className="text-heading-xl font-bold text-text">
        {stars >= 3 ? "Amazing!" : stars >= 2 ? "Great Job!" : stars >= 1 ? "Nice Try!" : "Keep Practicing!"}
      </h2>

      <StarRating stars={stars} size="lg" />

      <div className="grid grid-cols-2 gap-kid-4 w-full max-w-sm mt-kid-2">
        <StatCard label="Score" value={score.toString()} emoji="💰" color="text-accent-500" />
        <StatCard label="Accuracy" value={`${accuracy}%`} emoji="🎯" color="text-secondary-500" />
        <StatCard label="Correct" value={correctCount.toString()} emoji="✅" color="text-success" />
        <StatCard label="Best Streak" value={`${bestStreak}x`} emoji="🔥" color="text-primary-500" />
      </div>

      <div className="flex gap-kid-3 mt-kid-4">
        <Button variant="primary" size="lg" onClick={onPlayAgain}>
          Play Again
        </Button>
        <Button variant="ghost" size="lg" onClick={onGoHome}>
          Home
        </Button>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, emoji, color }: { label: string; value: string; emoji: string; color: string }) {
  return (
    <div className="bg-surface-raised rounded-kid-md p-kid-3 flex flex-col items-center gap-1">
      <span className="text-2xl">{emoji}</span>
      <span className={`text-heading-md font-bold ${color}`}>{value}</span>
      <span className="text-body-sm text-text-muted">{label}</span>
    </div>
  );
}
