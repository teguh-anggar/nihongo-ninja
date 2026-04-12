"use client";

import { useReducer, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gameReducer } from "@/lib/game-engine/reducer";
import { createInitialState } from "@/types/game";
import { pickRandom } from "@/lib/game-engine/shuffle";
import { saveGameResult } from "@/lib/progress/storage";
import { allHiragana } from "@/lib/game-data/hiragana";
import { GameHeader } from "@/components/game/GameHeader";
import { GameComplete } from "@/components/game/GameComplete";
import { Button } from "@/components/ui/Button";
import { useSoundContext } from "@/providers/SoundProvider";
import confetti from "canvas-confetti";
export default function HiraganaPage() {
  const [state, dispatch] = useReducer(gameReducer, createInitialState("hiragana", "easy"));
  const { playSound } = useSoundContext();

  const currentCard = state.questions[state.currentQuestionIndex];

  const startGame = useCallback(() => {
    const cards = pickRandom(allHiragana, 5).map((c, i) => ({
      id: `h-${i}-${c.character}`,
      type: "flashcard" as const,
      prompt: c.character,
      correctAnswer: c.romaji,
      example: `${c.example} (${c.exampleRomaji}) - ${c.exampleMeaning}`,
    }));
    dispatch({ type: "START_GAME", payload: { questions: cards } });
  }, []);

  const handleAnswer = useCallback(
    (knewIt: boolean) => {
      if (!currentCard) return;
      if (knewIt) {
        dispatch({ type: "ANSWER_CORRECT", payload: { questionId: currentCard.id, points: 10 } });
        playSound("correct");
        if ((state.streak + 1) % 5 === 0) {
          confetti({ particleCount: 30, spread: 60, colors: ["#f83d82", "#45a668", "#f59e07"] });
        }
      } else {
        dispatch({ type: "ANSWER_INCORRECT", payload: { questionId: currentCard.id } });
        playSound("wrong");
      }
      setTimeout(() => dispatch({ type: "NEXT_QUESTION" }), 800);
    },
    [currentCard, playSound, state.streak]
  );

  // Save on complete
  useEffect(() => {
    if (state.phase === "complete" && state.startTime) {
      saveGameResult(state);
      confetti({ particleCount: 100, spread: 100, colors: ["#f83d82", "#45a666", "#f59e07", "#3b82f6"] });
    }
  }, [state.phase, state.startTime]);

  // Keyboard support
  useEffect(() => {
    if (state.phase !== "playing") return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "y") handleAnswer(true);
      if (e.key === "ArrowLeft" || e.key === "n") handleAnswer(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [state.phase, handleAnswer]);

  if (state.phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-kid-4 gap-kid-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="text-8xl">
          🎴
        </motion.div>
        <h1 className="text-heading-xl font-bold text-text text-center">Hiragana Flashcards</h1>
        <p className="text-body-lg text-text-muted text-center max-w-md">
          Flip the card to see the romaji. Did you know it? Swipe right if yes, left if no!
        </p>
        <Button variant="primary" size="lg" onClick={startGame}>
          Start Learning!
        </Button>
      </div>
    );
  }

  if (state.phase === "complete") {
    return (
      <GameComplete
        score={state.score}
        correctCount={state.correctCount}
        incorrectCount={state.incorrectCount}
        totalQuestions={state.totalQuestions}
        bestStreak={state.bestStreak}
        onPlayAgain={startGame}
        onGoHome={() => (window.location.href = "/")}
      />
    );
  }

  return (
    <div className="max-w-lg mx-auto px-kid-4 py-kid-4">
      <GameHeader
        score={state.score}
        streak={state.streak}
        livesRemaining={state.livesRemaining}
        maxLives={state.maxLives}
        currentQuestion={state.currentQuestionIndex}
        totalQuestions={state.totalQuestions}
      />

      <AnimatePresence mode="wait">
        {currentCard && (
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Flashcard card={currentCard} />
          </motion.div>
        )}
      </AnimatePresence>

      {state.lastAnswerCorrect !== null && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center mt-kid-4 text-heading-md font-bold ${state.lastAnswerCorrect ? "text-secondary-500" : "text-error"}`}
        >
          {state.lastAnswerCorrect ? "Correct! Great job!" : "Not quite. Keep trying!"}
        </motion.div>
      )}

      <div className="flex gap-kid-4 mt-kid-6 justify-center">
        <Button
          variant="danger"
          size="lg"
          onClick={() => handleAnswer(false)}
          className="flex-1 max-w-[200px]"
        >
          ✗ Not Yet
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => handleAnswer(true)}
          className="flex-1 max-w-[200px]"
        >
          ✓ Knew It!
        </Button>
      </div>
    </div>
  );
}

function Flashcard({ card }: { card: { prompt: string; correctAnswer: string; example?: string } }) {
  return (
    <div className="bg-surface rounded-kid-xl shadow-kid-card border border-border p-kid-8 flex flex-col items-center gap-kid-4">
      <span className="font-japanese text-character-xl text-primary-500 leading-none">
        {card.prompt}
      </span>
      <span className="text-heading-md font-bold text-text">{card.correctAnswer}</span>
      {card.example && (
        <span className="text-body-md text-text-muted text-center">{card.example}</span>
      )}
    </div>
  );
}
