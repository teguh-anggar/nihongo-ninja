"use client";

import { useReducer, useCallback, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gameReducer } from "@/lib/game-engine/reducer";
import { createInitialState } from "@/types/game";
import { pickRandom, shuffle } from "@/lib/game-engine/shuffle";
import { saveGameResult } from "@/lib/progress/storage";
import { vocabulary } from "@/lib/game-data/vocabulary";
import { GameHeader } from "@/components/game/GameHeader";
import { GameComplete } from "@/components/game/GameComplete";
import { Button } from "@/components/ui/Button";
import { useSoundContext } from "@/providers/SoundProvider";
import confetti from "canvas-confetti";
import type { VocabularyWord } from "@/lib/game-data/vocabulary";

export default function VocabularyPage() {
  const [state, dispatch] = useReducer(gameReducer, createInitialState("vocabulary", "easy"));
  const { playSound } = useSoundContext();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const questions = useMemo(() => {
    const words = pickRandom(vocabulary, 10);
    return words.map((w, i) => {
      const wrongAnswers = shuffle(
        vocabulary.filter((v) => v.english !== w.english)
      )
        .slice(0, 3)
        .map((v) => v.english);
      const options = shuffle([w.english, ...wrongAnswers]);
      return { ...w, id: `v-${i}`, options };
    });
  }, [state.phase]);

  const currentQ = state.phase === "playing" ? questions[state.currentQuestionIndex] : null;

  const startGame = useCallback(() => {
    dispatch({
      type: "START_GAME",
      payload: {
        questions: questions.map((q) => ({
          id: q.id,
          type: "quiz" as const,
          prompt: q.japanese,
          correctAnswer: q.english,
          options: q.options,
        })),
      },
    });
    setSelectedId(null);
  }, [questions]);

  const handleAnswer = useCallback(
    (answer: string, questionId: string) => {
      if (selectedId) return;
      const correct = answer === currentQ?.english;
      setSelectedId(questionId);

      if (correct) {
        dispatch({ type: "ANSWER_CORRECT", payload: { questionId, points: 10 } });
        playSound("correct");
        if ((state.streak + 1) % 5 === 0) {
          confetti({ particleCount: 30, spread: 60, colors: ["#f83d82", "#f59e07"] });
        }
      } else {
        dispatch({ type: "ANSWER_INCORRECT", payload: { questionId } });
        playSound("wrong");
      }

      setTimeout(() => {
        dispatch({ type: "NEXT_QUESTION" });
        setSelectedId(null);
      }, 1200);
    },
    [currentQ, selectedId, playSound, state.streak]
  );

  useEffect(() => {
    if (state.phase === "complete" && state.startTime) {
      saveGameResult(state);
      confetti({ particleCount: 100, spread: 100, colors: ["#f83d82", "#45a668", "#f59e07"] });
    }
  }, [state.phase, state.startTime]);

  if (state.phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-kid-4 gap-kid-6">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="text-8xl">
          📚
        </motion.div>
        <h1 className="text-heading-xl font-bold text-text text-center">Vocabulary Quiz</h1>
        <p className="text-body-lg text-text-muted text-center max-w-md">
          Read the Japanese word and pick the correct English meaning. Be careful - you have limited lives!
        </p>
        <Button variant="accent" size="lg" onClick={startGame}>
          Start Quiz!
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

  if (!currentQ) return null;

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
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {/* Question */}
          <div className="bg-surface rounded-kid-xl shadow-kid-card border border-border p-kid-6 mb-kid-6 text-center">
            <p className="text-body-sm text-text-muted mb-2">What does this mean?</p>
            <p className="font-japanese text-character-xl text-primary-500 mb-2">{currentQ.japanese}</p>
            <p className="text-body-md text-text-muted">{currentQ.romaji}</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-kid-3">
            {currentQ.options.map((option, i) => {
              const isCorrect = option === currentQ.english;
              const isSelected = selectedId === currentQ.id + option;
              let bgClass = "bg-surface border-border hover:shadow-kid-card-hover hover:-translate-y-0.5";
              if (selectedId) {
                if (isCorrect) bgClass = "bg-secondary-100 border-secondary-400 scale-[1.02]";
                else if (isSelected) bgClass = "bg-red-100 border-error";
                else bgClass = "bg-surface border-border opacity-50";
              }

              return (
                <motion.button
                  key={option}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleAnswer(option, currentQ.id + option)}
                  disabled={selectedId !== null}
                  className={`p-kid-4 rounded-kid-lg shadow-kid-card border-2 font-bold text-body-md transition-all duration-200 cursor-pointer min-h-[60px] ${bgClass}`}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
