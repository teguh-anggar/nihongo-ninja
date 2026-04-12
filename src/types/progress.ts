export interface ModeProgress {
  highScore: number;
  gamesPlayed: number;
  correctAnswers: number;
  incorrectAnswers: number;
  bestStreak: number;
  lastScore: number;
}

export interface UserProgress {
  totalStars: number;
  level: number;
  gamesPlayed: number;
  totalCorrectAnswers: number;
  totalIncorrectAnswers: number;
  bestStreak: number;
  achievements: string[];
  perMode: {
    hiragana: ModeProgress;
    katakana: ModeProgress;
    vocabulary: ModeProgress;
    "drag-drop": ModeProgress;
  };
  lastPlayedAt: string;
}

export const emptyModeProgress: ModeProgress = {
  highScore: 0,
  gamesPlayed: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  bestStreak: 0,
  lastScore: 0,
};

export function createEmptyProgress(): UserProgress {
  return {
    totalStars: 0,
    level: 1,
    gamesPlayed: 0,
    totalCorrectAnswers: 0,
    totalIncorrectAnswers: 0,
    bestStreak: 0,
    achievements: [],
    perMode: {
      hiragana: { ...emptyModeProgress },
      katakana: { ...emptyModeProgress },
      vocabulary: { ...emptyModeProgress },
      "drag-drop": { ...emptyModeProgress },
    },
    lastPlayedAt: new Date().toISOString(),
  };
}

export function calculateStars(score: number, total: number, correct: number): number {
  const accuracy = total > 0 ? correct / total : 0;
  if (accuracy >= 0.9) return 3;
  if (accuracy >= 0.7) return 2;
  if (accuracy >= 0.5) return 1;
  return 0;
}

export function calculateLevel(totalStars: number): number {
  if (totalStars >= 100) return 10;
  if (totalStars >= 75) return 9;
  if (totalStars >= 55) return 8;
  if (totalStars >= 40) return 7;
  if (totalStars >= 28) return 6;
  if (totalStars >= 18) return 5;
  if (totalStars >= 11) return 4;
  if (totalStars >= 6) return 3;
  if (totalStars >= 3) return 2;
  return 1;
}

export const BELT_COLORS: Record<number, string> = {
  1: "#F5F5F5",    // White
  2: "#FBBF24",    // Yellow
  3: "#F97316",    // Orange
  4: "#22C55E",    // Green
  5: "#3B82F6",    // Blue
  6: "#8B5CF6",    // Purple
  7: "#A16207",    // Brown
  8: "#78350F",    // Dark Brown
  9: "#1F2937",    // Dark
  10: "#111827",   // Black
};

export const BELT_NAMES: Record<number, string> = {
  1: "White Belt",
  2: "Yellow Belt",
  3: "Orange Belt",
  4: "Green Belt",
  5: "Blue Belt",
  6: "Purple Belt",
  7: "Brown Belt",
  8: "Dark Belt",
  9: "Shadow Belt",
  10: "Black Belt",
};

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (progress: UserProgress) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-game",
    name: "First Steps",
    description: "Complete your first game",
    icon: "footprints",
    condition: (p) => p.gamesPlayed >= 1,
  },
  {
    id: "five-games",
    name: "Dedicated Learner",
    description: "Complete 5 games",
    icon: "books",
    condition: (p) => p.gamesPlayed >= 5,
  },
  {
    id: "perfect-score",
    name: "Perfect Score",
    description: "Get 100% accuracy in any game",
    icon: "crown",
    condition: (p) => {
      const modes = Object.values(p.perMode);
      return modes.some((m) => m.gamesPlayed > 0 && m.incorrectAnswers === 0 && m.correctAnswers > 0);
    },
  },
  {
    id: "streak-5",
    name: "On Fire",
    description: "Get a 5-answer streak",
    icon: "fire",
    condition: (p) => p.bestStreak >= 5,
  },
  {
    id: "streak-10",
    name: "Unstoppable",
    description: "Get a 10-answer streak",
    icon: "lightning",
    condition: (p) => p.bestStreak >= 10,
  },
  {
    id: "ten-stars",
    name: "Star Collector",
    description: "Earn 10 stars total",
    icon: "star",
    condition: (p) => p.totalStars >= 10,
  },
  {
    id: "fifty-stars",
    name: "Star Master",
    description: "Earn 50 stars total",
    icon: "stars",
    condition: (p) => p.totalStars >= 50,
  },
  {
    id: "all-modes",
    name: "Well Rounded",
    description: "Play all 4 game modes",
    icon: "balance",
    condition: (p) => {
      const modes = Object.values(p.perMode);
      return modes.every((m) => m.gamesPlayed > 0);
    },
  },
  {
    id: "level-5",
    name: "Rising Ninja",
    description: "Reach level 5",
    icon: "ninja",
    condition: (p) => p.level >= 5,
  },
  {
    id: "level-10",
    name: "Ninja Master",
    description: "Reach level 10 (max level)",
    icon: "master",
    condition: (p) => p.level >= 10,
  },
];
