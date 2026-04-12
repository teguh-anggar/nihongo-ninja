export type GameMode = "hiragana" | "katakana" | "vocabulary" | "drag-drop";
export type GamePhase = "idle" | "playing" | "paused" | "complete";
export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  type: "flashcard" | "matching" | "quiz" | "drag-drop";
  prompt: string;
  correctAnswer: string;
  options?: string[];
  matched?: boolean;
  dropped?: boolean;
  example?: string;
  exampleRomaji?: string;
}

export interface GameState {
  phase: GamePhase;
  gameMode: GameMode;
  difficulty: Difficulty;
  currentQuestionIndex: number;
  totalQuestions: number;
  questions: Question[];
  score: number;
  streak: number;
  bestStreak: number;
  correctCount: number;
  incorrectCount: number;
  startTime: number | null;
  elapsedMs: number;
  livesRemaining: number;
  maxLives: number;
  lastAnswerCorrect: boolean | null;
  showConfetti: boolean;
}

export type GameAction =
  | { type: "START_GAME"; payload: { questions: Question[] } }
  | { type: "ANSWER_CORRECT"; payload: { questionId: string; points: number } }
  | { type: "ANSWER_INCORRECT"; payload: { questionId: string } }
  | { type: "NEXT_QUESTION" }
  | { type: "COMPLETE_GAME" }
  | { type: "RESET_GAME" }
  | { type: "MATCH_PAIR"; payload: { id1: string; id2: string } }
  | { type: "DROP_CHARACTER"; payload: { questionId: string } }
  | { type: "DISMISS_CONFETTI" };

export function getQuestionCount(difficulty: Difficulty): number {
  switch (difficulty) {
    case "easy": return 5;
    case "medium": return 10;
    case "hard": return 15;
  }
}

export function getMaxLives(difficulty: Difficulty): number {
  switch (difficulty) {
    case "easy": return 5;
    case "medium": return 3;
    case "hard": return 1;
  }
}

export function createInitialState(mode: GameMode, difficulty: Difficulty): GameState {
  return {
    phase: "idle",
    gameMode: mode,
    difficulty,
    currentQuestionIndex: 0,
    totalQuestions: getQuestionCount(difficulty),
    questions: [],
    score: 0,
    streak: 0,
    bestStreak: 0,
    correctCount: 0,
    incorrectCount: 0,
    startTime: null,
    elapsedMs: 0,
    livesRemaining: getMaxLives(difficulty),
    maxLives: getMaxLives(difficulty),
    lastAnswerCorrect: null,
    showConfetti: false,
  };
}
