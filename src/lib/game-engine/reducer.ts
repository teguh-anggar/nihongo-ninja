import type { GameState, GameAction } from "@/types/game";
import { createInitialState } from "@/types/game";

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_GAME":
      return {
        ...state,
        phase: "playing",
        questions: action.payload.questions,
        startTime: Date.now(),
        currentQuestionIndex: 0,
        score: 0,
        streak: 0,
        bestStreak: 0,
        correctCount: 0,
        incorrectCount: 0,
        livesRemaining: state.maxLives,
        lastAnswerCorrect: null,
        showConfetti: false,
      };

    case "ANSWER_CORRECT": {
      const newStreak = state.streak + 1;
      const streakBonus = Math.floor(newStreak / 3) * 5;
      const points = action.payload.points + streakBonus;
      const shouldConfetti = newStreak % 5 === 0;

      return {
        ...state,
        score: state.score + points,
        streak: newStreak,
        bestStreak: Math.max(newStreak, state.bestStreak),
        correctCount: state.correctCount + 1,
        lastAnswerCorrect: true,
        showConfetti: shouldConfetti,
      };
    }

    case "ANSWER_INCORRECT":
      return {
        ...state,
        streak: 0,
        incorrectCount: state.incorrectCount + 1,
        livesRemaining: Math.max(0, state.livesRemaining - 1),
        lastAnswerCorrect: false,
        phase: state.livesRemaining <= 1 ? "complete" : state.phase,
      };

    case "NEXT_QUESTION": {
      const nextIndex = state.currentQuestionIndex + 1;
      const isComplete = nextIndex >= state.totalQuestions;
      return {
        ...state,
        currentQuestionIndex: nextIndex,
        phase: isComplete ? "complete" : state.phase,
        lastAnswerCorrect: null,
      };
    }

    case "COMPLETE_GAME":
      return {
        ...state,
        phase: "complete",
        elapsedMs: state.startTime ? Date.now() - state.startTime : 0,
      };

    case "RESET_GAME":
      return createInitialState(state.gameMode, state.difficulty);

    case "MATCH_PAIR":
      return {
        ...state,
        score: state.score + 15,
        correctCount: state.correctCount + 1,
      };

    case "DROP_CHARACTER":
      return state;

    case "DISMISS_CONFETTI":
      return { ...state, showConfetti: false };

    default:
      return state;
  }
}
