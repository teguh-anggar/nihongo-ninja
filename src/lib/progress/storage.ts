import type { UserProgress, ModeProgress } from "@/types/progress";
import { createEmptyProgress, calculateStars, calculateLevel, ACHIEVEMENTS } from "@/types/progress";
import type { GameState } from "@/types/game";

const STORAGE_KEY = "nihongo-ninja-progress";

export function loadProgress(): UserProgress {
  if (typeof window === "undefined") return createEmptyProgress();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // Corrupted data
  }
  return createEmptyProgress();
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage full
  }
}

export function saveGameResult(state: GameState): UserProgress {
  const progress = loadProgress();
  const stars = calculateStars(
    state.score,
    state.correctCount + state.incorrectCount,
    state.correctCount
  );
  const modeKey = state.gameMode as keyof typeof progress.perMode;
  const modeProgress: ModeProgress = progress.perMode[modeKey];

  const updatedMode: ModeProgress = {
    highScore: Math.max(modeProgress.highScore, state.score),
    gamesPlayed: modeProgress.gamesPlayed + 1,
    correctAnswers: modeProgress.correctAnswers + state.correctCount,
    incorrectAnswers: modeProgress.incorrectAnswers + state.incorrectCount,
    bestStreak: Math.max(modeProgress.bestStreak, state.bestStreak),
    lastScore: state.score,
  };

  const updatedProgress: UserProgress = {
    ...progress,
    totalStars: progress.totalStars + stars,
    gamesPlayed: progress.gamesPlayed + 1,
    totalCorrectAnswers: progress.totalCorrectAnswers + state.correctCount,
    totalIncorrectAnswers: progress.totalIncorrectAnswers + state.incorrectCount,
    bestStreak: Math.max(progress.bestStreak, state.bestStreak),
    perMode: {
      ...progress.perMode,
      [modeKey]: updatedMode,
    },
    lastPlayedAt: new Date().toISOString(),
  };

  // Calculate level
  updatedProgress.level = calculateLevel(updatedProgress.totalStars);

  // Check achievements
  const newAchievements = ACHIEVEMENTS.filter(
    (a) => !updatedProgress.achievements.includes(a.id) && a.condition(updatedProgress)
  ).map((a) => a.id);
  updatedProgress.achievements = [...updatedProgress.achievements, ...newAchievements];

  saveProgress(updatedProgress);
  return updatedProgress;
}

export function resetProgress(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
